'use strict';
// Shattered Worlds — Versus balance tournament. Not loaded by the game.
// It plays heroes against each other with the Versus bot on both sides and reports win rates, so the balance
// table in js/versus.js (V.tune) can be checked or re-derived after heroes change.
//
// The ten legend heroes are strong on purpose, so they are left out: they keep normal damage (no entry in V.tune)
// and do not play in the tournament. VB.fixed is that list; empty it to measure all heroes together.
//
// How to run: serve the game (tools/serve.ps1), open it, and in the browser console load the test driver and this file:
//   for (const f of ['tools/harness.js', 'tools/versus-balance.js']) await new Promise(r => { const s = document.createElement('script'); s.src = f; s.onload = r; document.head.appendChild(s); });
//   then:
//   VB.report(VB.pass(4))        one measurement: 4 rounds per ordered pair
//   VB.solve(10)                 adjusts SW.versus.tune over 10 passes until win rates settle near 50%
//   VB.table()                   prints the current table, ready to paste into js/versus.js
//   VB.against(['sen', 'noct'])  how the pool does against heroes outside it (here two legends)
// A pass takes a second or two: the game is ticked directly, with no drawing and no sound.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, V = SW.versus, I = SW.input, T = window.T;
  if (!T) { console.warn('versus-balance: load tools/harness.js first'); return; }
  G.manual = true; SW.profile.all = true; SW.audio.sfx = function () {};
  const ALL = D.heroOrder.slice();
  const VB = window.VB = { errs: [], fixed: ['orin', 'mira', 'noct', 'bando', 'aldric', 'sen', 'vega', 'tessa', 'jax', 'ferra'] };
  VB.pool = () => ALL.filter(h => VB.fixed.indexOf(h) < 0);
  // one round, hero id a (left) against b (right); returns [winner 0 / 1 / -1, ticks]
  VB.round = function (a, b) {
    V.open(G); V.mode = 'pvb'; V.diff = 1; V.gain = 1; V.stage = 1; V.pick = [ALL.indexOf(a), ALL.indexOf(b)]; V.phase = 'pick'; V.step = 1;
    T.press('confirm'); T.step(2);
    if (!V.f.length || V.f[0].hero !== a) { VB.errs.push('did not start: ' + a + ' v ' + b); return null; }
    V.f[0].bot = true;
    let n = 0;
    while (V.phase !== 'ko' && n < 6000) { I.raw = {}; G.tick(); n++; }
    if (G.lastError) { VB.errs.push(a + ' v ' + b + ': ' + G.lastError.slice(0, 160)); G.lastError = null; }
    return [V.phase === 'ko' ? V.winner : -1, n];
  };
  // every ordered pair in the pool, `reps` times; returns one { hero, win, secs } per hero
  VB.pass = function (reps) {
    const P = VB.pool(), S = P.map(() => ({ n: 0, w: 0, t: 0 }));
    for (let r = 0; r < (reps || 1); r++) for (let a = 0; a < P.length; a++) for (let b = 0; b < P.length; b++) {
      if (a === b) continue;
      const x = VB.round(P[a], P[b]); if (!x) continue;
      S[a].n++; S[b].n++; S[a].t += x[1]; S[b].t += x[1];
      if (x[0] === 0) S[a].w++; else if (x[0] === 1) S[b].w++; else { S[a].w += 0.5; S[b].w += 0.5; }
    }
    return S.map((s, i) => ({ hero: P[i], win: s.w / s.n, secs: s.t / s.n / 60 }));
  };
  VB.report = function (rows) {
    const sorted = rows.slice().sort((p, q) => q.win - p.win);
    console.table(sorted.map(r => ({ hero: r.hero, 'win %': Math.round(r.win * 100), 'round s': Math.round(r.secs), tune: V.tune[r.hero] || 1 })));
    return sorted;
  };
  // nudge each pool hero's damage multiplier toward a 50% win rate; the pool's table is kept at an average of 1
  VB.solve = function (passes, lo, hi, reps) {
    lo = lo || 0.7; hi = hi || 1.4;
    const P = VB.pool();
    for (let k = 0; k < (passes || 8); k++) {
      const rows = VB.pass(reps || 2); let lg = 0;
      rows.forEach(r => { const w = Math.min(0.9, Math.max(0.1, r.win)); V.tune[r.hero] = Math.min(hi, Math.max(lo, (V.tune[r.hero] || 1) * Math.pow(0.5 / w, 0.3))); lg += Math.log(V.tune[r.hero]); });
      const gm = Math.exp(lg / P.length); P.forEach(h => { V.tune[h] = Math.min(hi, Math.max(lo, V.tune[h] / gm)); });
    }
    return VB.report(VB.pass(4));
  };
  // the pool against heroes outside it: the pool's share of wins
  VB.against = function (others, reps) {
    const P = VB.pool(); let n = 0, w = 0;
    for (let r = 0; r < (reps || 1); r++) for (const a of P) for (const b of others) for (const flip of [0, 1]) {
      const x = flip ? VB.round(b, a) : VB.round(a, b); if (!x) continue;
      n++; if (x[0] === (flip ? 1 : 0)) w++; else if (x[0] < 0) w += 0.5;
    }
    return { rounds: n, poolWinShare: n ? w / n : 0 };
  };
  VB.table = () => VB.pool().map(h => h + ': ' + (Math.round((V.tune[h] || 1) * 20) / 20)).join(', ');
})();
