'use strict';
// Shattered Worlds — watch the Hardcore bot train, live, at normal speed. Not loaded by the game.
// Open the game, then in the console:  for (const f of ['tools/harness.js', 'tools/hardcore-watch.js']) await new Promise(r => { const s = document.createElement('script'); s.src = f; s.onload = r; document.head.appendChild(s); });
// It plays Bot vs Bot at 1x speed (Hardcore on the left, Hard on the right), one match after another from a schedule of
// the hardest matchups, and draws over the game what the Hardcore bot reads and decides: the frame count to the next hit,
// its perfect guards, the counters and combo routes it uses, its recommended combos, and the score so far.
//   HW.start()   begin (or carry on)        HW.stop()   stop after this match        HW.next()   skip to the next match
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, V = SW.versus, T = window.T, HC = SW.hardcore, text = SW.text, art = SW.art, W = SW.W;
  if (!T || !HC) { console.warn('hardcore-watch: load tools/harness.js and the game first'); return; }
  const HW = window.HW = { on: false, i: 0, wins: 0, losses: 0, rounds: 0, feed: [], log: [], perf: 0, combos: 0, counters: 0 };
  // the schedule: the matchups the trainer found hardest first, then a counter specialist, then the rest of the roster
  HW.plan = [['aldric', 'sen'], ['vex', 'zara'], ['kael', 'fenn'], ['hex', 'sora'], ['nyra', 'convergence'], ['ryo', 'itsuki'], ['isolde', 'aldric'], ['fumi', 'taro'],
    ['gale', 'noct'], ['elixa', 'opal'], ['brakk', 'vega'], ['mako', 'rue'], ['thorne', 'fenn'], ['mira', 'oda']]
    .concat(D.heroOrder.map((h, i) => [h, D.heroOrder[(i * 11 + 5) % D.heroOrder.length]]).filter(p => p[0] !== p[1]));
  const push = (s, col) => { HW.feed.unshift({ s, col: col || '#ffffff', t: V.t }); HW.feed.length = Math.min(HW.feed.length, 7); };

  function begin(a, b) {
    G.manual = true;
    V.open(G); V.mode = 'bvb'; V.fmt = 0; V.diff = 3; V.diff2 = HW.lv2 === undefined ? 2 : HW.lv2; V.speed = 0; V.gain = 1; V.stage = HW.st || 1;
    V.pick = [D.heroOrder.indexOf(a), D.heroOrder.indexOf(b)]; V.phase = 'pick'; V.step = 1;
    T.press('confirm'); T.step(2);
    G.manual = false;   // from here the game runs on its own clock: one fight frame per screen frame, as when you play
    HW.cur = { a, b, w0: 0, w1: 0 }; HW.seen = { why: '', pf: [V.f[0] && V.f[0].pfT, V.f[1] && V.f[1].pfT], hpB: null };
    HW.feed = []; push('MATCH ' + (HW.i + 1) + ': ' + D.heroes[a].name + ' (NIGHTMARE) vs ' + D.heroes[b].name + (HW.lv2 === 3 ? ' (NIGHTMARE)' : ' (HARD)'), '#ffe066');
  }
  HW.start = function () { HW.on = true; if (V.phase === 'menu' || !V.f.length || V.phase === 'result') HW.next(); };
  HW.stop = function () { HW.on = false; };
  HW.next = function () {
    if (HW.all) {   // every hero in turn, against a random opponent on a random stage (the new platform stages twice as often)
      const ALL = D.heroOrder, a = ALL[HW.i % ALL.length]; let b = a;
      while (b === a) b = ALL[Math.random() * ALL.length | 0];
      const n = V.STAGES.length - 1, pool = []; for (let s = 1; s <= n; s++) { pool.push(s); if (s >= 12) pool.push(s); }
      HW.st = pool[Math.random() * pool.length | 0];
      begin(a, b); HW.i++; return;
    }
    const p = HW.plan[HW.i % HW.plan.length]; HW.st = 1 + (HW.i % 3); begin(p[0], p[1]); HW.i++;
  };

  // ================= the recorder: every live match, frame by frame, saved to recordings/ =================
  // HW.recordAll()  every hero in turn, Hardcore vs Hard, random opponents and stages, recording as it plays.
  // Saved after each match to recordings/hardcore-live.json (raw numbers) and recordings/hardcore-live-report.md (per
  // hero: rounds won, where its damage comes from, which combos it starts, finishes or drops and at which input).
  HW.R = { started: new Date().toISOString(), matches: 0, heroes: {} };
  const heroRec = h => HW.R.heroes[h] || (HW.R.heroes[h] = { rounds: 0, wins: 0, dealt: {}, taken: {}, perfect: 0, counters: 0, routes: {}, stages: {} });
  // the totals carry over a page reload (this browser's storage), so a long run can pick up a newer bot and keep counting
  HW.recordAll = function () {
    try { const o = JSON.parse(localStorage.getItem('swHardcoreLive') || 'null'); if (o && o.heroes) { HW.R = o; HW.i = o.next || 0; } } catch (e) { /* a fresh record */ }
    HW.all = true; HW.recOn = true; HW.on = true; HW.next();
  };
  let lastHp = null, cmb = null;
  const _vu = V.update;
  V.update = function () {
    const r = _vu.apply(this, arguments);
    if (!HW.recOn || !HW.on || G.scene !== 'vs' || V.f.length !== 2) return r;
    const A = V.f[0], B = V.f[1], h = A.hc || {}, R = heroRec(A.hero);
    if (V.phase !== 'fight') { lastHp = null; return r; }
    const hp = [A.state.hp, B.state.hp];
    if (lastHp) {
      const got = lastHp[1] - hp[1], lost = lastHp[0] - hp[0];
      if (got > 0) { const k = A.p.state; R.dealt[k] = (R.dealt[k] || 0) + got; if (cmb) cmb.dmg += got; }
      if (lost > 0) { const k = B.hero + ':' + B.p.state; R.taken[k] = (R.taken[k] || 0) + lost; }
    }
    lastHp = hp;
    // a combo route: from the moment it starts until it ends, finished or dropped at some input
    if (h.r && (!cmb || cmb.r !== h.r)) cmb = { r: h.r, dmg: 0, at: 0 };
    if (cmb && h.r === cmb.r) cmb.at = Math.max(cmb.at, h.ri || 0);
    if (cmb && h.r !== cmb.r) {
      const e = R.routes[cmb.r] || (R.routes[cmb.r] = { n: 0, done: 0, dmg: 0, dropAt: {} });
      e.n++; e.dmg += cmb.dmg;
      if (cmb.at >= cmb.r.length - 1) e.done++; else e.dropAt[cmb.at] = (e.dropAt[cmb.at] || 0) + 1;
      cmb = null;
    }
    return r;
  };
  // what the live numbers say about each hero's moves
  HW.report = function () {
    const N = HC.notation, rows = Object.entries(HW.R.heroes).filter(([, x]) => x.rounds);
    const out = ['# Hardcore live training - what the matches say', '', 'Recorded live at normal speed (one game frame per screen frame), Hardcore vs Hard, random opponents and stages.',
      'Started ' + HW.R.started + ', ' + HW.R.matches + ' matches so far. Updated ' + new Date().toISOString() + '.', ''];
    const fl = x => { let n = 0, d = 0; for (const e of Object.values(x.routes)) { n += e.n; d += e.done; } return n ? d / n : 1; };
    const sorted = rows.sort((p, q) => fl(p[1]) - fl(q[1]));
    out.push('## Combo completion, lowest first', '', '| Hero | Rounds won | Combos finished | Damage split | Most dropped combo | Drops at input | Suggestion |', '|---|---|---|---|---|---|---|');
    for (const [h, x] of sorted) {
      const name = D.heroes[h].name, rs = Object.entries(x.routes).sort((p, q) => (q[1].n - q[1].done) - (p[1].n - p[1].done));
      const worst = rs[0], tot = Object.values(x.dealt).reduce((s, v) => s + v, 0), mel = (x.dealt.attack || 0) + (x.dealt.airatk || 0), sk = (x.dealt.cast || 0) + (x.dealt.rush || 0) + (x.dealt.wave || 0), ul = x.dealt.ult || 0;
      let sug = '-', drop = '-', wn = '-';
      if (worst && worst[1].n - worst[1].done > 0) {
        const e = worst[1], at = +Object.entries(e.dropAt).sort((p, q) => q[1] - p[1])[0][0], tok = worst[0][at], nxt = worst[0][at + 1];
        wn = N(worst[0]) + ' (' + (e.n - e.done) + ' of ' + e.n + ' dropped)'; drop = (at + 1) + ' (' + N(tok || '') + (nxt ? ' > ' + N(nxt) : '') + ')';
        sug = /[UuIiX]/.test(nxt || '') ? 'the cancel into ' + N(nxt) + ' comes too late or pushes the target out of reach: a longer cancel window or less knockback on ' + N(tok) :
          nxt === 'K' ? 'the launcher (' + N(tok) + ') sends the target out of jump reach: lower launch' :
          /[JA]/.test(nxt || '') ? 'the ' + N(tok) + ' hit pushes the target out of the next hit: less push or a longer reach' : 'check the timing after ' + N(tok);
      }
      out.push('| ' + name + ' | ' + x.wins + ' / ' + x.rounds + ' | ' + Math.round(100 * fl(x)) + '% | melee ' + Math.round(100 * mel / Math.max(1, tot)) + '%, skills ' + Math.round(100 * sk / Math.max(1, tot)) + '%, ultimate ' + Math.round(100 * ul / Math.max(1, tot)) + '% | ' + wn + ' | ' + drop + ' | ' + sug + ' |');
    }
    out.push('', '## Where Hardcore loses health (top 3 per hero)', '');
    for (const [h, x] of rows) {
      const t = Object.entries(x.taken).sort((p, q) => q[1] - p[1]).slice(0, 3).map(([k, v]) => k + ' ' + Math.round(v)).join(', ');
      if (t) out.push('- ' + D.heroes[h].name + ': ' + t);
    }
    return out.join('\n') + '\n';
  };
  HW.save = function () {
    fetch('/__rec/hardcore-live.json', { method: 'POST', body: JSON.stringify(HW.R, null, 1) }).catch(() => {});
    fetch('/__rec/hardcore-live-report.md', { method: 'POST', body: HW.report() }).catch(() => {});
    try { HW.R.next = HW.i; localStorage.setItem('swHardcoreLive', JSON.stringify(HW.R)); } catch (e) { /* storage off: the files still have it */ }
  };

  // follow the match: decisions, perfect guards, counters, combos, round results
  setInterval(() => {
    if (!HW.on || G.scene !== 'vs' || !V.f.length) return;
    const A = V.f[0], B = V.f[1], h = A.hc || {};
    if (V.phase === 'fight') {
      if (h.why && h.why !== HW.seen.why && !/^(READ AND WAIT|CLOSE IN|SPACING|WAIT|PULSE GUARD|COMBO  )/.test(h.why)) {
        const col = /PERFECT|COUNTER/.test(h.why) ? '#7dffb2' : /PUNISH|CONFIRM|WHIFF|THROW/.test(h.why) ? '#ffb347' : /HIT|SLIP|DROPPED/.test(h.why) ? '#ff7070' : '#c8d0ff';
        push(h.why, col);
        if (/^COUNTER - /.test(h.why)) { HW.counters++; if (HW.recOn) heroRec(A.hero).counters++; }
        if (/^(PUNISH|CONFIRM|WHIFF)/.test(h.why)) HW.combos++;
      }
      HW.seen.why = h.why;
      if (A.pfT !== undefined && A.pfT !== HW.seen.pf[0]) { HW.seen.pf[0] = A.pfT; HW.perf++; if (HW.recOn) heroRec(A.hero).perfect++; push('PERFECT BLOCK - ' + D.heroes[B.hero].name + ' is stunned for 60 frames', '#7dffb2'); }
    }
    if (V.phase === 'ko' && !HW.seen.ko) {
      HW.seen.ko = true; HW.rounds++;
      const won = V.winner === 0; if (won) HW.wins++; else HW.losses++;
      G.state = A.state; const hp = Math.round(100 * Math.max(0, A.state.hp) / A.p.hpMax());
      push(won ? 'ROUND WON with ' + hp + '% health left' : 'ROUND LOST', won ? '#ffe066' : '#ff7070');
      HW.log.push({ a: A.hero, b: B.hero, won, hp });
      if (HW.recOn) {
        const R = heroRec(A.hero), s = V.STAGES[HW.st || 1][0], st = R.stages[s] || (R.stages[s] = { rounds: 0, wins: 0 });
        R.rounds++; st.rounds++; if (won) { R.wins++; st.wins++; }
      }
    }
    if (V.phase === 'result' && HW.recOn && !HW.seen.saved) { HW.seen.saved = true; HW.R.matches++; HW.save(); }
    if (V.phase !== 'result') HW.seen.saved = false;
    if (V.phase !== 'ko') HW.seen.ko = false;
    if (V.phase === 'result' && !HW.seen.res) { HW.seen.res = V.t; }
    if (V.phase === 'result' && V.t - HW.seen.res > 200) { HW.seen.res = 0; HW.next(); }
  }, 50);

  // ================= the Combo Lab: every hero's trained combos, performed live on a stunned dummy =================
  // HW.lab()  runs the weakest 10 combo heroes, then the top 10 (from 10th up to 1st), then everyone else, at 1x.
  // The ranking: half the strongest route, 30% the strongest for one bar or less, 20% the strongest with no energy.
  HW.rank = function () {
    const R = HC.data.routes, N = HC.notation;
    return D.heroOrder.map(h => {
      const L = R[h] || [], top = lim => L.filter(x => x.cost <= lim).sort((a, b) => b.dmg - a.dmg)[0] || { dmg: 0, r: '', cost: 0 };
      const best = top(1e9), bar = top(100), free = top(0);
      return { h, name: D.heroes[h].name, best, bar, free, score: Math.round(best.dmg * 0.5 + bar.dmg * 0.3 + free.dmg * 0.2), N };
    }).sort((a, b) => b.score - a.score);
  };
  HW.lab = function (first) {   // first: hero ids to show before the rest (say, the weakest on fluency)
    HW.on = false; HW.labOn = true; HW.rk = HW.rank();
    const n = HW.rk.length; let order = HW.rk.slice(n - 10).reverse().concat(HW.rk.slice(0, 10).reverse(), HW.rk.slice(10, n - 10));
    if (first && first.length) order = first.map(h => HW.rk.find(r => r.h === h)).filter(Boolean).concat(order.filter(r => first.indexOf(r.h) < 0));
    HW.queue = order.map(r => r.h); HW.done = {}; HW.labI = 0; HW.labNext();
  };
  HW.labStop = function () { HW.labOn = false; HC.test = false; };
  HW.labNext = function () {
    if (!HW.labOn) return;
    const h = HW.queue[HW.labI % HW.queue.length]; HW.labI++;
    const row = HW.rk.find(r => r.h === h), routes = [row.free, row.best].filter((x, i, a) => x.r && a.findIndex(y => y.r === x.r) === i);
    G.manual = true;
    V.open(G); V.mode = 'train'; V.dummy = 0; V.stage = 1 + (HW.labI % 3); V.showMoves = false;
    V.pick = [D.heroOrder.indexOf(h), D.heroOrder.indexOf(h === 'kael' ? 'nyra' : 'kael')]; V.phase = 'pick'; V.step = 1;
    T.press('confirm'); T.step(2);
    G.manual = false;
    HW.lc = { h, row, routes, k: -1, wait: 0, dmg: 0, hp: 0, t: 0, out: [] };
  };
  function labReset() {
    const A = V.f[0], B = V.f[1];
    [A, B].forEach((f, i) => {
      G.state = f.state; const p = f.p;
      p.x = 250 + (i ? 22 : 0); p.vx = 0; p.vy = 0; p.enter('idle'); p.atk = null; p.castFn = null; p.cd = {}; p.juggle = 0; p.invuln = 0; p.iframes = 0; p.combo = 0; p.comboT = 0; p.airCombo = 0; p.dashCd = 0; p.dashCancel = false; p.connected = false; p.hitSet = new Set();
      f.state.hp = p.hpMax(); f.state.energy = 300; f.state.awaken = 0; f.stunT = 0; f.shots.length = 0; f.hc = { t: 0 }; f.hcLast = null;
    });
    A.p.face = 1; B.p.face = -1; A.bot = true; A.lv = 3;
    G.state = B.state; B.p.enter('hurt'); B.p.hurtLen = 60; B.stunT = 100000;
  }
  setInterval(() => {
    if (!HW.labOn || G.scene !== 'vs' || !V.f.length) return;
    const c = HW.lc; if (!c) return;
    if (V.phase !== 'fight') return;
    const A = V.f[0], B = V.f[1];
    if (c.k < 0 || (c.wait && V.t >= c.wait)) {   // next route, or next hero
      if (c.k >= 0) c.out.push({ r: c.routes[c.k], got: c.dmg });
      c.k++; c.wait = 0;
      if (c.k >= c.routes.length) { HW.done[c.h] = true; HW.lc = null; setTimeout(HW.labNext, 900); return; }
      labReset(); c.dmg = 0; c.hp = B.state.hp; c.t = V.t;
      HC.test = true; HC.start(A, c.routes[c.k].r);
      return;
    }
    if (B.state.hp < c.hp) { c.dmg += c.hp - B.state.hp; } c.hp = B.state.hp;
    if (!c.wait && (!A.hc.r || V.t - c.t > 420)) c.wait = V.t + 130;   // let the last hit land, then hold a moment
  }, 30);

  // the overlay
  const _draw = V.draw;
  V.draw = function (ctx) {
    _draw.apply(this, arguments);
    if (HW.labOn && V.f.length && V.phase === 'fight' && HW.lc) {
      const c = HW.lc, rank = HW.rk.findIndex(r => r.h === c.h) + 1, R = c.routes[Math.max(0, c.k)];
      ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 40, 232, 92); art.rect(ctx, '#05060c', W - 150, 40, 150, 196); ctx.globalAlpha = 1;
      text(ctx, 'NIGHTMARE COMBO LAB - LIVE, 1x', 6, 44, '#ffe066');
      text(ctx, '#' + rank + ' of ' + HW.rk.length + '  ' + D.heroes[c.h].name.toUpperCase() + '  score ' + c.row.score, 6, 56, '#ffffff');
      if (R) {
        text(ctx, (R === c.row.free && R.cost === 0 ? 'NO-ENERGY COMBO' : 'STRONGEST COMBO') + (R.cost ? ' (' + R.cost + ' energy)' : ''), 6, 70, '#8a92b8');
        text(ctx, HC.notation(R.r), 6, 81, '#ffffff');
        text(ctx, 'DAMAGE NOW: ' + Math.round(c.dmg) + '   (trained: ' + R.dmg + ')', 6, 94, '#7dffb2');
        const step = V.f[0].hc && V.f[0].hc.r ? Math.min(V.f[0].hc.ri + 1, R.r.length) : R.r.length;
        text(ctx, 'INPUT ' + step + ' / ' + R.r.length, 6, 106, '#c8d0ff');
      }
      c.out.forEach((o, i) => text(ctx, 'done: ' + Math.round(o.got) + ' dmg', 130, 106 + i * 10, '#8a92b8'));
      text(ctx, 'TOP 10 COMBO HEROES', W - 146, 44, '#ffe066');
      HW.rk.slice(0, 10).forEach((r, i) => text(ctx, (i + 1) + '. ' + r.name + '  ' + r.score, W - 146, 55 + i * 9, r.h === c.h ? '#7dffb2' : HW.done[r.h] ? '#ffffff' : '#5a6078'));
      text(ctx, 'WEAKEST 10', W - 146, 150, '#ff9a7a');
      HW.rk.slice(-10).reverse().forEach((r, i) => text(ctx, (HW.rk.length - i) + '. ' + r.name + '  ' + r.score, W - 146, 161 + i * 9, r.h === c.h ? '#7dffb2' : HW.done[r.h] ? '#ffffff' : '#5a6078'));
      return;
    }
    if (!HW.on || !V.f.length || (V.phase !== 'fight' && V.phase !== 'ko' && V.phase !== 'intro')) return;
    const A = V.f[0], B = V.f[1], h = A.hc || {};
    ctx.globalAlpha = 0.78; art.rect(ctx, '#05060c', 0, 40, 212, 150); art.rect(ctx, '#05060c', W - 168, 40, 168, 96); ctx.globalAlpha = 1;
    text(ctx, 'NIGHTMARE TRAINING - LIVE, 1x', 6, 44, '#ffe066');
    const th = HC.threat ? HC.threat(A, B) : { t: 99 };
    text(ctx, 'NEXT HIT: ' + (th.t >= 99 ? 'none coming' : th.t + ' frames' + (th.src ? ' (' + th.src + ')' : '')), 6, 56, th.t <= 4 ? '#7dffb2' : '#c8d0ff');
    text(ctx, 'NOW: ' + (h.why || '-'), 6, 67, '#ffffff');
    HW.feed.forEach((e, i) => text(ctx, e.s.length > 40 ? e.s.slice(0, 40) : e.s, 6, 82 + i * 11, e.col));
    const rec = HC.recommend(A.hero, 3);
    text(ctx, 'COMBOS IT KNOWS (' + D.heroes[A.hero].name + ')', W - 164, 44, '#ffe066');
    rec.forEach((R, i) => { text(ctx, HC.notation(R.r), W - 164, 56 + i * 20, '#ffffff'); text(ctx, R.dmg + ' dmg' + (R.cost ? ', ' + R.cost + ' energy' : ''), W - 164, 65 + i * 20, '#8a92b8'); });
    text(ctx, 'ROUNDS WON ' + HW.wins + '   LOST ' + HW.losses, W - 164, 118, '#ffe066');
    text(ctx, 'PERFECT ' + HW.perf + '  COMBOS ' + HW.combos + '  COUNTERS ' + HW.counters, W - 164, 128, '#7dffb2');
  };
})();
