'use strict';
// Shattered Worlds — the MOVE LAB for the Nightmare bot (js/hardcore-skill.js). Not loaded by the game.
// Load after tools/harness.js and tools/hardcore-train.js, on the record server (port 8793):
//   HM.hero(id)        measures every move of one hero (U, S+U, I, S+I, W+O, W+J, W+I) against a dummy that does nothing:
//                      where it hits on the ground and in the air, when, for how much, how long the hero is stuck after it,
//                      whether it is safe when guarded, invincible frames, how far it carries the hero, and what it leaves
//                      the target in (launched, how long it stays hurt)
//   HM.all(key)        every hero, a few at a time in the background of the page; progress in window[key]
//   HM.save()          writes recordings/hardcore-moves.js (copy it to js/hardcore-moves.js)
// Every test runs at normal speed, one G.tick() a frame, like the trainer.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, V = SW.versus, I = SW.input, T = window.T, HC = SW.hardcore;
  if (!T || !HC || !window.HT) { console.warn('hardcore-moves: load tools/harness.js, tools/hardcore-train.js and the game first'); return; }
  const ALL = D.heroOrder.slice();
  const HM = window.HM = { data: (SW.hardcoreMoves && JSON.parse(JSON.stringify(SW.hardcoreMoves))) || {}, errs: [] };
  // where the dummy stands (px in front of the hero) and floats (px above the floor, px in front)
  const GX = [16, 36, 62, 95, 135, 180, 235, 300], AIR = [[28, 50], [60, 50], [105, 55], [40, 95], [85, 95]];
  const MOVES = ['U', 'u', 'I', 'i', 'O', 'L', 'X'];
  HM.GX = GX; HM.AIR = AIR; HM.MOVES = MOVES;

  function begin(a, b) {
    V.open(G); V.mode = 'pvb'; V.fmt = 0; V.speed = 0; V.diff = 3; V.diff2 = 3; V.gain = 1; V.stage = 1; V.pick = [ALL.indexOf(a), ALL.indexOf(b)]; V.phase = 'pick'; V.step = 1;
    T.press('confirm'); T.step(2);
    if (!V.f.length || V.f[0].hero !== a) return false;
    V.f[0].bot = true; V.f[0].lv = 3; V.f[1].lv = 3;
    let n = 0; while (V.phase !== 'fight' && n++ < 900) { I.raw = {}; G.tick(); }
    return V.phase === 'fight';
  }
  const GY = 14 * 16;
  function reset(gap) {
    const A = V.f[0], B = V.f[1];
    [A, B].forEach((f, i) => {
      G.state = f.state; const p = f.p;
      p.x = 110 + (i ? gap : 0); p.y = GY; p.vx = 0; p.vy = 0; p.onGround = true; p.enter('idle'); p.atk = null; p.castFn = null; p.cd = {}; p.juggle = 0;
      p.invuln = 0; p.iframes = 0; p.awakeT = 0; p.modeT = 0; p.held = null; p.combo = 0; p.comboT = 0; p.airCombo = 0; p.dashCd = 0; p.dashCancel = false; p.connected = false; p.hitSet = new Set();
      p.phaseT = 0; p.riposteT = 0; p.ambushT = 0; p.pose = null;
      f.state.hp = i ? 99999 : p.hpMax(); p.dead = false; f.state.energy = 300; f.state.awaken = 0; f.stunT = 0; f.burnT = 0; f.frozen = 0;
      f.shots.length = 0; f.ents.splice(0, f.ents.length, ...f.ents.filter(e => !e.dmg && !(e instanceof SW.Shot)));
      f.hc = { t: 0 }; f.hcLast = {}; f.labKeys = null;   // hcLast {}: roll back what the ordinary bot pressed this frame (js/hardcore.js)
      f.inp.now = {}; f.inp.prev = {}; f.inp.lastHit = {}; p.cdDeny = 0; p.cdFlash = null; p.linkLive = false; p.slipT = 0; p.guardT = 0;
    });
    I.lastHit = {}; I.now = {}; I.prev = {};
    A.p.face = 1; B.p.face = -1;
    V.timer = 99 * 60; G.hitstop = 0;
  }
  // results of every hit on the dummy (and on the hero), through the proxies in each fighter's entity list
  let log = null;
  function watch() {
    V.f.forEach((f, i) => f.ents.forEach(e => {
      if (!e.isProxy || e.hmWatched) return;
      e.hmWatched = true; const th = e.takeHit;
      e.takeHit = function (atk) { const r = th.apply(this, arguments); if (log && r && r !== 'none') log.push({ on: 1 - i, r, t: log.t, dmg: atk.dealt || atk.dmg || 0, ub: !!atk.unblockable, body: !!atk.src }); return r; };
    }));
  }
  const FREE = { idle: 1, run: 1, jump: 1, fall: 1, guard: 1, charge: 1 };
  // one test: move tk with the dummy at (dx, hy) (hy > 0: floating that high); guard: the dummy holds its guard, then
  // answers with J the moment it has blocked
  // bKeys: keys the dummy holds through the test (its own move: a counter stance, say); r.taken: what the hero lost
  function shot(tk, dx, hy, guard, bKeys) {
    const A = V.f[0], B = V.f[1];
    reset(dx); HC.test = true;
    // let anything left over from the last test play out (a cast still going, a buffered press), then place them again
    for (let n = 0; n < 120 && (n < 30 || !V.f.every(f => f.p.state === 'idle' && f.p.onGround && !f.shots.some(x => !x.gone))); n++) { I.raw = {}; G.tick(); }
    reset(dx); watch();
    const q = B.p, p = A.p, x0 = p.x;
    if (guard) B.labKeys = { down: true };
    if (bKeys) B.labKeys = Object.assign({}, bKeys);
    HC.test = true; HC.start(A, tk);
    log = []; log.t = 0;
    const r = { hit: -1, dmg: 0, hits: 0, rec: -1, inv: 0, mv: 0, air: false, hurtEnd: -1, blocked: false, punished: false, ub: false, last: -1, body: false, lift: 0, invFrom: -1, invTo: -1 };
    let hpB = B.state.hp, hpA = A.state.hp, started = false, freeRun = 0, answered = -1, lastHitT = -1;
    for (let t = 0; t < (HM.long || 130); t++) {
      log.t = t; I.raw = {};
      if (hy > 0 && r.hit < 0) { q.y = GY - hy; q.vy = 0; q.vx = 0; q.onGround = false; if (q.state !== 'fall' && q.state !== 'hurt') q.enter('fall'); }
      G.tick();
      if (V.phase !== 'fight') break;
      const ps = p.state;
      if (!started && !FREE[ps]) started = true;
      if (started && t < 24 && (p.iframes > 0 || p.invuln > 0 || p.phaseT > 0)) { r.inv++; if (r.invFrom < 0) r.invFrom = t; if (r.invTo === t - 1 || r.invTo < 0) r.invTo = t; }
      if (started && r.rec < 0) { if (FREE[ps] && !A.hc.r) { if (++freeRun >= 3) r.rec = t - 2; } else freeRun = 0; }
      const d = hpB - B.state.hp; hpB = B.state.hp;
      for (const e of log.splice(0)) {
        if (e.on === 1) { if (e.r === 'hit') { if (r.hit < 0) { r.hit = t; r.body = e.body; } r.hits++; lastHitT = t; if (e.ub) r.ub = true; } else if (e.r === 'block') { r.blocked = true; if (r.hit < 0) r.hit = t; if (guard && answered < 0) { answered = t; B.labKeys = null; HC.start(B, 'JJ'); } } }
        else if (e.on === 0 && e.r === 'hit' && guard) r.punished = true;
      }
      if (d > 0) r.dmg += d;
      if (r.hit >= 0 && !q.onGround && q.state === 'hurt') { r.air = true; if (!hy) r.lift = Math.max(r.lift, Math.round(GY - q.y)); }
      if (lastHitT >= 0 && q.state !== 'hurt' && r.hurtEnd < 0) r.hurtEnd = t;
      if (r.hit >= 0 && lastHitT >= 0 && q.state === 'hurt') r.hurtEnd = -1;
      if (r.rec >= 0 && (r.hit >= 0 ? t > lastHitT + 50 : t > r.rec + 40) && !A.shots.some(s => !s.gone)) break;
      if (guard && answered >= 0 && t > answered + 40) break;
    }
    HC.test = false; log = null;
    r.mv = Math.round((p.x - x0) * p.face);
    r.last = lastHitT; r.dmg = Math.round(r.dmg); r.taken = Math.round(hpA - A.state.hp);
    if (r.hurtEnd < 0 && lastHitT >= 0) r.hurtEnd = HM.long || 130;
    return r;
  }
  HM.shot = shot;
  HM.begin = begin;
  // a whole move: the ground row, the air row, then guarded at its best distance
  function move(tk) {
    const out = { g: [], a: [], dmg: 0, rec: 0, inv: 0, mv: 0, launch: false, adv: -99, safe: true, ub: false, used: false, hits: 0 };
    let best = null;
    GX.forEach((dx, i) => {
      const r = shot(tk, dx, 0, false);
      out.g[i] = r.hit;
      if (r.rec >= 0 || r.hit >= 0) out.used = true;
      if (r.hit >= 0 && (!best || r.dmg > best.r.dmg || (r.dmg === best.r.dmg && r.hit < best.r.hit))) best = { r, dx, i };
      if (i === 0) { out.rec = r.rec; out.inv = r.inv; out.mv = r.mv; out.iv = r.invFrom >= 0 ? [r.invFrom, r.invTo] : null; }
    });
    AIR.forEach(([dx, hy], i) => { const r = shot(tk, dx, hy, false); out.a[i] = r.hit; });
    if (best) {
      const r = best.r;
      Object.assign(out, { iv: r.invFrom >= 0 ? [r.invFrom, r.invTo] : null, dmg: r.dmg, hits: r.hits, rec: r.rec, inv: r.inv, mv: r.mv, launch: r.lift >= 30, lift: r.lift, body: r.body, ub: r.ub, at: best.dx });
      // frames the target stays helpless after the hero can move again (positive: there is time for more)
      out.adv = r.hurtEnd >= 0 && r.rec >= 0 ? r.hurtEnd - r.rec : -99;
      if (!r.ub) { const gd = shot(tk, best.dx, 0, true); out.safe = !gd.punished; out.blk = gd.blocked; }
      else out.safe = true;
    }
    return out;
  }
  HM.hero = function (id) {
    const dummy = id === 'kael' ? 'nyra' : 'kael';
    if (!begin(id, dummy)) { HM.errs.push('no stage: ' + id); return null; }
    const res = {};
    MOVES.forEach(tk => { try { const m = move(tk); if (m.used || m.dmg > 0) res[tk] = m; } catch (e) { HM.errs.push(id + ' ' + tk + ': ' + String(e).slice(0, 120)); } });
    HM.data[id] = res;
    return res;
  };
  HM.all = function (key, list) {
    list = list || ALL.slice();
    const Q = window[key] = { done: 0, total: list.length, ms: 0 };
    (async () => {
      for (const h of list) {
        const t0 = performance.now();
        HM.hero(h); Q.done++; Q.ms += performance.now() - t0;
        await new Promise(ok => setTimeout(ok, 0));
      }
      Q.end = true;
    })();
    return Q.total;
  };
  // short form for reading: per move, the ground row (frames to hit or '.'), the air row, then the numbers
  HM.show = function (id) {
    const d = HM.data[id] || {}, f = v => (v < 0 ? '.' : v);
    return Object.keys(d).map(k => { const m = d[k]; return k + ' g[' + m.g.map(f).join(' ') + '] a[' + m.a.map(f).join(' ') + '] dmg ' + m.dmg + ' rec ' + m.rec + ' inv ' + m.inv + ' mv ' + m.mv + (m.launch ? ' LAUNCH' : '') + ' adv ' + m.adv + (m.safe ? '' : ' UNSAFE') + (m.ub ? ' UB' : ''); });
  };
  HM.text = function () {
    return "'use strict';\n// Built by tools/hardcore-moves.js (the move lab): how every hero's moves behave, for the Nightmare bot (js/hardcore-skill.js). Do not edit by hand.\n" +
      '// per hero, per move (U u I i: U S+U I S+I, O: W+O, L: W+J, X: W+I): g = frames to the first hit with the target standing ' + JSON.stringify(GX) + ' px ahead (-1: misses),\n' +
      '// a = the same with the target in the air at [px ahead, px up] ' + JSON.stringify(AIR) + '; dmg, hits; rec = frames before the hero can move again;\n' +
      '// inv = invincible frames early in it (iv: the first and last frame of the first stretch); mv = px it carries the hero forward; launch: the target goes up; adv = frames the target stays\n' +
      '// helpless after the hero has recovered; safe: a guard cannot answer it with J; ub: it cannot be guarded; at: the distance it does most;\n' +
      '// body: the hero\'s own blow (a perfect guard stuns it 60 frames, a shot only 30); lift: px the target goes up (launch: 30 or more)\n' +
      'window.SW.hardcoreMoves = ' + JSON.stringify(HM.data) + ';\n';
  };
  HM.save = async function (name) { const r = await fetch('/__rec/' + (name || 'hardcore-moves.js'), { method: 'POST', body: HM.text() }); return r.status; };
})();
