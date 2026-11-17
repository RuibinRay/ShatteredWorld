'use strict';
// Shattered Worlds — trainer for the Hardcore Versus bot (js/hardcore.js). Not loaded by the game.
// Every match here runs at normal game speed: one G.tick() is one game frame, exactly as when you play (no 2x / 4x
// Bot vs Bot speed-up and no instant simulation); it only skips drawing between frames.
//
// Load after tools/harness.js, on the record server (tools/record-server.ps1, port 8793) so results can be saved:
//   HT.learnThreats(rounds)   Hard vs Hard among all heroes; records when each hero's moves first land and how far
//   HT.findRoutes(hero)       beam search of combo routes against a stunned dummy; keeps the best per energy budget
//   HT.tune(hero, opps, n)    coordinate search of the hero's play style (spacing, pokes, charging, slipping...)
//                             in rounds against Hard opponents; keeps what wins most
//   HT.tourney(kind, ...)     the test tournaments: 'gauntlet' (Hardcore vs Hard), 'legends' (vs the ten legends on
//                             Hard), 'mirror' (Hardcore vs Hardcore), 'bosses' (vs the Convergence on Hard)
//   HT.save()                 writes recordings/hardcore-data.js (copy it to js/hardcore-data.js)
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, V = SW.versus, I = SW.input, T = window.T, HC = SW.hardcore;
  if (!T || !HC) { console.warn('hardcore-train: load tools/harness.js and the game first'); return; }
  G.manual = true; SW.profile.all = true; SW.audio.sfx = function () {}; SW.audio.music = function () {};
  G.saveGame = () => {}; if (SW.store) SW.store.save = () => {};
  const ALL = D.heroOrder.slice(), DATA = HC.data;
  const HT = window.HT = { errs: [], log: [] };
  const LEGENDS = ['orin', 'mira', 'noct', 'bando', 'aldric', 'sen', 'vega', 'tessa', 'jax', 'ferra'];
  HT.ALL = ALL; HT.LEGENDS = LEGENDS;

  // ---------- one round, normal speed ----------
  function begin(a, b, la, lb) {
    // the Convergence as a bot opponent in Player vs Bot is the story boss (js/vsboss.js), which a bot never meets in
    // play: against it, run Bot vs Bot at 1x, where it is a fighter like the others
    V.open(G); V.mode = b === 'convergence' ? 'bvb' : 'pvb'; V.fmt = 0; V.speed = 0; V.diff = lb; V.diff2 = lb; V.gain = 1; V.stage = HT.stageNow ? (typeof HT.stageNow === 'function' ? HT.stageNow() : HT.stageNow) : 1; V.pick = [ALL.indexOf(a), ALL.indexOf(b)]; V.phase = 'pick'; V.step = 1;
    T.press('confirm'); T.step(2);
    if (!V.f.length || V.f[0].hero !== a) { HT.errs.push('did not start: ' + a + ' v ' + b); return false; }
    V.f[0].bot = true; V.f[0].lv = la; V.f[1].lv = lb;
    return true;
  }
  HT.round = function (a, b, la, lb, maxT) {
    if (!begin(a, b, la, lb)) return null;
    let n = 0;
    while (V.phase !== 'ko' && n < (maxT || 7200)) { I.raw = {}; if (HT.rec) watchProxies(); G.tick(); n++; }
    if (G.lastError) { HT.errs.push(a + ' v ' + b + ': ' + String(G.lastError).slice(0, 160)); G.lastError = null; }
    const hp = V.f.map(f => { G.state = f.state; return Math.max(0, f.state.hp) / f.p.hpMax(); });
    return { w: V.phase === 'ko' ? V.winner : -1, n, hp, perf: V.perfects || 0 };
  };

  // ---------- 1. when each move lands ----------
  const QUIET = { idle: 1, run: 1, jump: 1, fall: 1, guard: 1, charge: 1, dash: 1, hurt: 1, dead: 1, slip: 1, attack: 1, airatk: 1 };
  let inThing = 0;
  // anything a fighter's shots, summons and leftovers do happens in the zone update: none of it is the fighter's own move
  { const zu = SW.Zone.prototype.update; SW.Zone.prototype.update = function () { inThing++; try { return zu.apply(this, arguments); } finally { inThing--; } }; }
  ['Shot', 'Puddle', 'Totem', 'Helper'].forEach(n => { const C = SW[n]; if (!C || !C.prototype.update) return; const u = C.prototype.update; C.prototype.update = function () { inThing++; try { return u.apply(this, arguments); } finally { inThing--; } }; });
  // every hit a fighter takes arrives through its proxy (its picture in the other fighter's entity list): record the
  // attacker's move state and frame there, so ultimates and custom moves that skip SW.strike are counted too
  function note(f, s, st, dx, ub) {
    const H = HT.rec[f.hero] || (HT.rec[f.hero] = {}), e = H[s] || (H[s] = { st: 999, last: 0, reach: 0, n: 0, ub: false, hits: [] });
    e.st = Math.min(e.st, st); e.last = Math.max(e.last, st); e.reach = Math.max(e.reach, Math.round(dx)); e.n++; if (ub) e.ub = true;
    if (e.hits.indexOf(st) < 0 && e.hits.length < 48) { e.hits.push(st); e.hits.sort((x, y) => x - y); }
  }
  function watchProxies() {
    V.f.forEach(f => f.ents.forEach(e => {
      if (!e.isProxy || e.hcWatched) return;
      e.hcWatched = true; const th = e.takeHit;
      e.takeHit = function (atk, g) {
        const r = th.apply(this, arguments), a = V.cur;
        // a helper's hit counts as the attacker's own move while it is casting close by (Ivo's kicks are delivered by a
        // helper); a summon acting on its own (Fenn's wolves during the ultimate) does not
        if (HT.rec && r && r !== 'none' && a && V.f.length === 2) {
          const s = a.p.state, dx = Math.abs(V.f[1 - a.i].p.x - a.p.x);
          if (!QUIET[s] && (!inThing || (s === 'cast' && dx < 90))) note(a, s, a.p.st, dx, atk && atk.unblockable);
        }
        return r;
      };
    }));
  }
  HT.watch = watchProxies;
  HT.learnThreats = function (rounds, from) {
    HT.rec = HT.rec || {};
    const t0 = Date.now(); let done = 0;
    for (let i = from || 0; i < ALL.length && done < rounds; i++, done++) {
      const a = ALL[i], b = ALL[(i * 7 + 3) % ALL.length];
      HT.round(a, b === a ? ALL[(i + 1) % ALL.length] : b, 2, 2, 3600);
    }
    Object.keys(HT.rec).forEach(h => { DATA.threats[h] = Object.assign(DATA.threats[h] || {}, HT.rec[h]); });
    return { heroes: Object.keys(DATA.threats).length, ms: Date.now() - t0 };
  };

  // ---------- 2. combo routes against a stunned dummy ----------
  function setStage(hero, dummy) {
    if (!begin(hero, dummy, 3, 2)) return false;
    let n = 0; while (V.phase !== 'fight' && n++ < 900) { I.raw = {}; G.tick(); }
    return V.phase === 'fight';
  }
  function reset(gap) {
    const A = V.f[0], B = V.f[1];
    [A, B].forEach((f, i) => {
      G.state = f.state; const p = f.p;
      p.x = 260 + (i ? gap : 0); p.y = 14 * 16; p.vx = 0; p.vy = 0; p.onGround = true; p.enter('idle'); p.atk = null; p.castFn = null; p.cd = {}; p.juggle = 0;
      p.invuln = 0; p.iframes = 0; p.awakeT = 0; p.held = null; p.combo = 0; p.comboT = 0; p.airCombo = 0; p.dashCd = 0; p.dashCancel = false; p.connected = false; p.hitSet = new Set();
      f.state.hp = i ? 99999 : p.hpMax(); p.dead = false; f.state.energy = 300; f.state.awaken = 0; f.stunT = 0; f.burnT = 0; f.frozen = 0;   // the dummy (i = 1) never dies: an ultimate that would KO it still reads its full damage
      f.shots.length = 0; f.ents.splice(0, f.ents.length, ...f.ents.filter(e => !e.dmg && !(e instanceof SW.Shot)));
      f.hc = { t: 0 }; f.hcLast = null;
    });
    A.p.face = 1; B.p.face = -1;
    G.state = B.state; const q = B.p; q.enter('hurt'); q.hurtLen = 60; B.stunT = 100000;   // as after a perfect block, and it never gets to act
    V.timer = 99 * 60; G.hitstop = 0;
  }
  HT.testRoute = function (r, gap) {
    const A = V.f[0], B = V.f[1];
    reset(gap || 22);
    HC.test = true; HC.start(A, r);
    let dmg = 0, spent = 0, broken = false, hp = B.state.hp, en = A.state.energy, after = 0, hits = 0;
    for (let t = 0; t < 420; t++) {
      I.raw = {}; G.tick();
      const nh = B.state.hp; if (nh < hp) { if (!broken) { dmg += hp - nh; hits++; } hp = nh; }
      if (A.state.energy < en) spent += en - A.state.energy; en = A.state.energy;
      if (dmg > 0 && B.p.state !== 'hurt' && !B.p.dead) broken = true;
      if (!A.hc.r) after++;
      if (broken || after > 130 || B.p.dead || V.phase !== 'fight') break;
    }
    HC.test = false;
    const done = A.hc.ri >= r.length || !A.hc.r && A.hc.ri >= r.length;
    return { r, dmg: Math.round(dmg), cost: Math.round(spent), hits, ok: !broken || dmg > 0, full: done };
  };
  const EXT = ['J', 'U', 'u', 'I', 'i', 'LKAAA', 'W', 'JU', 'JI'];
  HT.findRoutes = function (hero, o) {
    o = o || {};
    const dummy = hero === 'kael' ? 'nyra' : 'kael';
    if (!setStage(hero, dummy)) return null;
    const seen = {}, all = [];
    const test = r => { if (seen[r]) return seen[r]; const x = HT.testRoute(r); seen[r] = x; all.push(x); return x; };
    let beam = ['J', 'JJ', 'JJJ', 'JJJJ'].map(test);
    for (let depth = 0; depth < (o.depth || 5); depth++) {
      const next = [];
      beam.forEach(b => EXT.forEach(e => { const r = b.r + e; if (r.length > 14) return; const x = test(r); if (x.dmg > b.dmg) next.push(x); }));
      if (!next.length) break;
      // keep the strongest at each energy budget so cheap routes survive next to the big ones
      const keep = {};
      next.sort((p, q) => q.dmg - p.dmg).forEach(x => { const k = Math.min(6, Math.ceil(x.cost / 50)); (keep[k] = keep[k] || []).length < (o.width || 3) && keep[k].push(x); });
      beam = [].concat(...Object.values(keep));
    }
    const ult = test('X'), ultTail = test((beam[0] || { r: 'JJJ' }).r + 'X'); void ult; void ultTail;
    // a route must hold from wherever a punish starts, not only from the 22 px it was searched at: the strongest candidates
    // are played again from 16 and 30 px and keep their worst damage (in matches, routes that only worked from 22 px
    // dropped at the launcher)
    if (o.robust !== false) {
      const by = {}; all.filter(x => x.dmg > 0).sort((p, q) => q.dmg - p.dmg).forEach(x => { const k = Math.min(7, Math.ceil(x.cost / 25)); (by[k] = by[k] || []).length < (o.robustN || 6) && by[k].push(x); });
      const top = [].concat(...Object.values(by));
      top.forEach(x => { const a = HT.testRoute(x.r, 16), b = HT.testRoute(x.r, 30); x.dmg22 = x.dmg; x.dmg = Math.min(x.dmg, a.dmg, b.dmg); });
      all.splice(0, all.length, ...top);
    }
    // the routes the bot carries: the best at each energy budget (and the ultimate on its own)
    const best = {};
    all.filter(x => x.dmg > 0).forEach(x => { const k = Math.min(7, Math.ceil(x.cost / 25)); if (!best[k] || x.dmg > best[k].dmg || (x.dmg === best[k].dmg && x.r.length < best[k].r.length)) best[k] = x; });
    let list = Object.values(best).sort((p, q) => p.cost - q.cost);
    list = list.filter((x, i) => !list.slice(0, i).some(y => y.dmg >= x.dmg));   // drop routes a cheaper one already beats
    DATA.routes[hero] = list.map(x => ({ r: x.r, dmg: x.dmg, cost: x.cost }));
    return { hero, tested: all.length, routes: DATA.routes[hero] };
  };

  // ---------- 3. play style, tuned in tournaments ----------
  const KNOBS = { space: [56, 78, 104], poke: [0, 0.3, 0.7], charge: [0, 1], slip: [0, 1], ultIn: [0, 1], throwR: [24, 30, 38] };
  HT.score = function (hero, opps, n, lb) {
    let w = 0, m = 0, k = 0;
    for (let r = 0; r < (n || 1); r++) for (const b of opps) {
      if (b === hero) continue;
      const L = lb === undefined ? 2 : lb, sw = b === 'convergence', x = sw ? HT.round(b, hero, L, 3, 5400) : HT.round(hero, b, 3, L, 5400); if (!x) continue;
      const me = sw ? 1 : 0; k++; w += x.w === me ? 1 : x.w === -1 ? 0.5 : 0; m += x.hp[me] - x.hp[1 - me];
    }
    return { win: k ? w / k : 0, margin: k ? m / k : 0, n: k, s: k ? w / k + 0.25 * m / k : 0 };
  };
  HT.tune = function (hero, opps, n) {
    const cur = Object.assign({}, HC.params(hero));
    const apply = p => { DATA.params[hero] = p; };
    apply(cur); let base = HT.score(hero, opps, n);
    for (const key of Object.keys(KNOBS)) {
      for (const v of KNOBS[key]) {
        if (v === cur[key]) continue;
        const trial = Object.assign({}, cur, { [key]: v }); apply(trial);
        const s = HT.score(hero, opps, n);
        if (s.s > base.s + 0.02) { cur[key] = v; base = s; }
      }
      apply(Object.assign({}, cur));
    }
    const d = HC.params('__none__'), out = {}; Object.keys(cur).forEach(k => { if (cur[k] !== d[k]) out[k] = cur[k]; });
    DATA.params[hero] = out;
    return { hero, params: out, win: Math.round(base.win * 100), margin: Math.round(base.margin * 100) };
  };

  // ---------- 4. the tournaments ----------
  HT.tourney = function (kind, heroes, opps, reps) {
    heroes = heroes || ALL; reps = reps || 1;
    const rows = {};
    const add = (h, x, side) => { const R = rows[h] || (rows[h] = { hero: h, n: 0, w: 0, m: 0, perf: 0 }); R.n++; R.w += x.w === side ? 1 : x.w === -1 ? 0.5 : 0; R.m += x.hp[side] - x.hp[1 - side]; };
    for (let r = 0; r < reps; r++) heroes.forEach((h, i) => {
      const list = kind === 'legends' ? LEGENDS : kind === 'mirror' ? [heroes[(i + 1 + r) % heroes.length]] : (opps || ALL);
      list.forEach(b => {
        if (b === h) return;
        // the Convergence on the right of Player vs Bot is the boss fight, not a fighter: put it on the left instead
        const lb = kind === 'mirror' ? 3 : 2, x = b === 'convergence' ? HT.round(b, h, lb, 3, 5400) : HT.round(h, b, 3, lb, 5400);
        if (x) add(h, x, b === 'convergence' ? 1 : 0);
      });
    });
    const out = Object.values(rows).map(R => ({ hero: R.hero, n: R.n, win: Math.round(100 * R.w / R.n), margin: Math.round(100 * R.m / R.n) })).sort((a, b) => a.win - b.win);
    HT.log.push({ kind, at: Date.now(), rows: out });
    return out;
  };

  // ---------- new heroes ----------
  // Trains every hero the data does not cover yet (a hero added since the last training, or one whose moves were
  // never seen landing): their move timings (rounds with them attacking), their combo routes and their play style.
  HT.untrained = () => ALL.filter(h => !DATA.routes[h] || !DATA.threats[h] || !DATA.params[h]);
  HT.trainNew = function (list, o) {
    o = o || {};
    list = list || HT.untrained();
    const out = [];
    for (const h of list) {
      HT.rec = {};
      for (let i = 0; i < (o.rounds || 12); i++) { const b = ALL[(i * 13 + 7 + ALL.indexOf(h)) % ALL.length]; if (b !== h && b !== 'convergence') HT.round(h, b, 2, 2, 3600); }
      Object.keys(HT.rec).forEach(x => { if (x === h) DATA.threats[x] = Object.assign(DATA.threats[x] || {}, HT.rec[x]); });
      if (!DATA.threats[h]) DATA.threats[h] = {};   // nothing special ever landed: it fights with normals and shots only
      HT.rec = null;
      if (!DATA.routes[h] || o.routes) HT.findRoutes(h, { depth: 7, width: 4 });
      const t = HT.tune(h, o.opps || ['sen', 'aldric', 'noct', 'vega', 'convergence', 'fenn', 'dyna', 'ferra', 'isa', 'taro'], 1);
      out.push({ hero: h, threats: Object.keys(DATA.threats[h]).length, routes: (DATA.routes[h] || []).length, win: t.win });
    }
    return out;
  };

  // ---------- saving ----------
  HT.text = function () {
    const j = JSON.stringify({ routes: DATA.routes, threats: DATA.threats, params: DATA.params });
    return "'use strict';\n// Built by tools/hardcore-train.js: what the Hardcore Versus bot has learned (see js/hardcore.js). Do not edit by hand.\n" +
      '// routes: the best combo route per energy budget for each hero (tokens in js/hardcore.js), with the damage it did to a stunned dummy\n' +
      '// threats: for each hero and move state, the first and last frame it has landed a hit, and from how far away\n' +
      '// params: each hero\'s play style where tournaments found something better than the default\n' +
      'window.SW.hardcoreData = ' + j + ';\n';
  };
  HT.save = async function (name) { const r = await fetch('/__rec/' + (name || 'hardcore-data.js'), { method: 'POST', body: HT.text() }); return r.status; };

  // ---------- long runs in the background of the page ----------
  // HT.queue(jobs, key): plays [{a, b, st, la, lb}] one round at a time, yielding to the page between rounds; progress
  // and results in window[key] = { done, total, res: [{...job, w, hp, n}] }
  HT.queue = function (jobs, key) {
    const Q = window[key] = { done: 0, total: jobs.length, res: [], stop: false };
    (async () => {
      for (const j of jobs) {
        if (Q.stop) break;
        HT.stageNow = j.st || 1;
        const r = HT.round(j.a, j.b, j.la === undefined ? 3 : j.la, j.lb === undefined ? 2 : j.lb);
        Q.res.push(Object.assign({}, j, { w: r ? r.w : -2, hp: r ? r.hp : null, n: r ? r.n : 0 })); Q.done++;
        await new Promise(ok => setTimeout(ok, 0));
      }
      Q.end = true;
    })();
    return Q.total;
  };
  // HT.fluency(hero): how well the hero's combos hold, on a stunned dummy at normal speed. Out of 100: J chain lands (25),
  // damaging skills that combo off J J J (35), air hits after W + J > K (20), best no-energy combo damage against 120 (20)
  HT.fluency = function (hero) {
    const dummy = hero === 'kael' ? 'nyra' : 'kael';
    if (!setStage(hero, dummy)) return null;
    const d = r => HT.testRoute(r).dmg;
    let chain = 0, prev = 0; for (const r of ['J', 'JJ', 'JJJ', 'JJJJ']) { const x = d(r); if (x > prev) chain++; prev = x; }
    const base = d('JJJ'), skills = {};
    let dmgSkills = 0, linked = 0;
    for (const t of ['U', 'u', 'I', 'i']) { const alone = d(t); if (alone <= 0) continue; dmgSkills++; const got = d('JJJ' + t) - base; skills[t] = { alone, added: got }; if (got > 3) linked++; }
    let air = 0; prev = d('JJJLK'); for (const r of ['JJJLKA', 'JJJLKAA', 'JJJLKAAA']) { const x = d(r); if (x > prev) air++; prev = x; }
    const free = Math.max(0, ...(DATA.routes[hero] || []).filter(x => x.cost === 0).map(x => x.dmg));
    const score = Math.round(25 * chain / 4 + 35 * (dmgSkills ? linked / dmgSkills : 1) + 20 * air / 3 + 20 * Math.min(1, free / 120));
    return { hero, score, chain, air, linked, dmgSkills, free, jjjj: d('JJJJ'), skills };
  };
  // HT.retrainAll(key, list): every hero's combo routes searched again, then its fluency measured, one hero at a time in
  // the background of the page; progress in window[key] = { done, total, res: [...] }
  HT.retrainAll = function (key, list) {
    list = list || ALL.slice();
    const Q = window[key] = { done: 0, total: list.length, res: [], old: {} };
    (async () => {
      for (const h of list) {
        Q.old[h] = (DATA.routes[h] || []).map(x => Object.assign({}, x));
        try { HT.findRoutes(h, { depth: 7, width: 4 }); const fl = HT.fluency(h); Q.res.push(fl || { hero: h, err: 'no fluency' }); }
        catch (e) { Q.res.push({ hero: h, err: String(e).slice(0, 120) }); }
        Q.done++; await new Promise(ok => setTimeout(ok, 0));
      }
      Q.end = true;
    })();
    return Q.total;
  };
  // HT.comboStats(rounds, ms): Hardcore vs Hard on varied heroes and stages; for each kind of combo start (PUNISH STUN,
  // CONFIRM, WHIFF PUNISH, ...) how many were started, finished, and the damage they did up to the moment they ended
  HT.comboStats = function (rounds, ms) {
    const t0 = performance.now(), st = {}; let won = 0, played = 0;
    for (let i = 0; i < (rounds || 120) && performance.now() - t0 < (ms || 20000); i++) {
      const a = ALL[(i * 7) % ALL.length], b = ALL[(i * 13 + 5) % ALL.length];
      if (a === b || b === 'convergence') continue;
      HT.stageNow = 1 + (i % (V.STAGES.length - 1));
      if (!begin(a, b, 3, 2)) continue;
      played++;
      let cur = null, n = 0;
      while (V.phase !== 'ko' && n < 7200) {
        I.raw = {}; G.tick(); n++;
        const A = V.f[0], B = V.f[1], h = A.hc || {};
        if (h.r && (!cur || h.r !== cur.r)) cur = { r: h.r, kind: (h.why || '').split('  ')[0].trim(), hp: B.state.hp, at: 0 };
        if (cur && h.r === cur.r) cur.at = Math.max(cur.at, h.ri || 0);
        if (cur && h.r !== cur.r) {
          const e = st[cur.kind] || (st[cur.kind] = { n: 0, done: 0, dmg: 0 });
          e.n++; e.dmg += Math.max(0, cur.hp - B.state.hp); if (cur.at >= cur.r.length - 1) e.done++;
          cur = null;
        }
      }
      if (V.phase === 'ko' && V.winner === 0) won++;
    }
    const out = {}; for (const [k, e] of Object.entries(st)) out[k] = e.n + ' started, ' + Math.round(100 * e.done / e.n) + '% finished, ' + Math.round(e.dmg / e.n) + ' dmg each';
    return { played, won, kinds: out };
  };
  // HT.sum(Q): the share of rounds won, by stage, and the rounds lost
  HT.sum = function (Q) {
    const by = {}; Q.res.forEach(r => { const s = V.STAGES[r.st][0], e = by[s] || (by[s] = { w: 0, n: 0 }); e.n++; if (r.w === 0) e.w++; });
    const won = Q.res.filter(r => r.w === 0).length;
    return [Math.round(1000 * won / Math.max(1, Q.res.length)) / 10 + '% of ' + Q.res.length, Object.entries(by).map(([s, v]) => s + ' ' + Math.round(100 * v.w / v.n) + '%').join(' | '),
      Q.res.filter(r => r.w !== 0).map(r => r.a + '>' + r.b + '@' + r.st + (r.w === -1 ? '(time)' : '')).join(' ')];
  };
  // the opponents that beat Hardcore most often in testing
  HT.TOUGH = ['dyna', 'aldric', 'vega', 'sen', 'noct', 'ferra', 'oda', 'bando', 'orin', 'hollis'];
  // HT.diag(a, b, st, lb): one round of Hardcore a against b, with where a's lost health came from (the opponent's
  // state, a's own state, what a was doing) and which of a's states did the damage
  HT.diag = function (a, b, st, lb) {
    HT.stageNow = st || 1;
    if (!begin(a, b, 3, lb === undefined ? 2 : lb)) return null;
    const taken = {}, dealt = {}, why = {};
    let n = 0, last = V.f[0].state.hp, lastO = V.f[1].state.hp;
    while (V.phase !== 'ko' && n < 7200) {
      I.raw = {};
      const me = V.f[0].p, o = V.f[1].p, w = (V.f[0].hc && V.f[0].hc.why) || '-', dy = Math.round(o.y - me.y), ost = o.state, mst = me.state;
      G.tick(); n++;
      const hp = V.f[0].state.hp, ho = V.f[1].state.hp;
      if (hp < last) { const k = ost + ' | me:' + mst + ' | ' + w + (Math.abs(dy) > 20 ? ' | dy' + dy : ''); taken[k] = (taken[k] || 0) + (last - hp); }
      if (ho < lastO) dealt[mst] = (dealt[mst] || 0) + (lastO - ho);
      last = hp; lastO = ho; why[w] = (why[w] || 0) + 1;
    }
    const top = o => Object.entries(o).sort((x, y) => y[1] - x[1]).slice(0, 12).map(e => e[0] + ': ' + Math.round(e[1]));
    return { w: V.phase === 'ko' ? V.winner : -1, n, hp: V.f.map(f => Math.round(f.state.hp)), taken: top(taken), dealt: top(dealt), why: top(why) };
  };
})();
