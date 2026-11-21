'use strict';
// tools/apex-balance.js — Versus balance for the sixteen apex heroes (not loaded by the game; needs tools/hardcore-train.js
// as HT). The user, 2026-11-21: "make them win all others but between them around 40-60% win chance".
//   AB.pass(o)    one pass in the background: a round-robin among the sixteen (both sides) and each of them against
//                 o.out heroes from the other 48 (alternating sides); AB.rows when AB.done
//   AB.step(k)    nudges SW.versusBalance.DMG / HP of the sixteen: toward 50% among themselves, and up when they win
//                 less than AB.TARGET of their rounds against the rest
//   AB.auto(n)    n passes with a step after each; AB.hist holds the spread of every pass
//   AB.table()    the numbers, for js/apex/apex-core.js (AP.TUNE)
(function () {
  const later = fn => { const c = new MessageChannel(); c.port1.onmessage = () => fn(); c.port2.postMessage(0); };
  const SW = window.SW, HT = window.HT, D = SW.data, B = SW.versusBalance, AP = SW.apex;
  const AB = window.AB = { rows: [], done: true, hist: [], TARGET: 92, LIM: { dmg: [0.55, 2.6], hp: [0.7, 2.0] } };
  AB.top = () => AP.TOP.filter(h => D.heroes[h]);
  AB.rest = () => D.heroOrder.filter(h => D.heroes[h] && AP.TOP.indexOf(h) < 0);
  AB.pass = function (o) {
    o = Object.assign({ out: 16, reps: 1, seed: 1 }, o || {});
    const T = AB.top(), Rr = AB.rest(), q = [], R = {};
    let s = o.seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let r = 0; r < o.reps; r++) T.forEach(a => T.forEach(b => { if (a !== b) q.push(['in', a, b]); }));
    T.forEach((a, i) => { const pool = Rr.slice().sort(() => rnd() - 0.5).slice(0, o.out); pool.forEach((b, j) => q.push(['out', (i + j) % 2 ? b : a, (i + j) % 2 ? a : b, a])); });
    const row = h => R[h] || (R[h] = { hero: h, inN: 0, inW: 0, inM: 0, outN: 0, outW: 0, outM: 0 });
    AB.done = false; AB.q = q; AB.t0 = performance.now();
    const step = () => {
      const t = performance.now();
      while (q.length && performance.now() - t < 1500) {
        const [kind, a, b, me] = q.shift(), x = HT.round(a, b, 3, 3, 5400); if (!x) continue;
        const wa = x.w === 0 ? 1 : x.w === -1 ? 0.5 : 0, m = x.hp[0] - x.hp[1];
        if (kind === 'in') { const A = row(a), Bb = row(b); A.inN++; A.inW += wa; A.inM += m; Bb.inN++; Bb.inW += 1 - wa; Bb.inM -= m; }
        else { const X = row(me), mine = me === a; X.outN++; X.outW += mine ? wa : 1 - wa; X.outM += mine ? m : -m; }
      }
      if (q.length) later(step);
      else {
        AB.rows = Object.values(R).map(r => ({ hero: r.hero, inWin: Math.round(100 * r.inW / Math.max(1, r.inN)), inM: Math.round(100 * r.inM / Math.max(1, r.inN)), outWin: Math.round(100 * r.outW / Math.max(1, r.outN)), outM: Math.round(100 * r.outM / Math.max(1, r.outN)), dmg: B.DMG[r.hero] || 1, hp: B.HP[r.hero] || 1 })).sort((p, q2) => q2.inWin - p.inWin);
        AB.done = true; AB.ms = performance.now() - AB.t0;
      }
    };
    later(step);
  };
  AB.summary = () => { const w = AB.rows.map(r => r.inWin), o = AB.rows.map(r => r.outWin); return { inMin: Math.min(...w), inMax: Math.max(...w), inOut: w.filter(v => v < 40 || v > 60).length, outMin: Math.min(...o), outAvg: Math.round(o.reduce((a, v) => a + v, 0) / o.length), outLow: AB.rows.filter(r => r.outWin < AB.TARGET).map(r => r.hero + ' ' + r.outWin).join(', ') }; };
  const clamp = (v, [a, b]) => Math.max(a, Math.min(b, v));
  AB.step = function (k) {
    k = k || 1;
    AB.rows.forEach(r => {
      const dIn = (50 - r.inWin) / 100 + 0.2 * (-r.inM) / 100, dOut = Math.max(0, (AB.TARGET - r.outWin) / 100) + Math.max(0, (60 - r.outM) / 400);
      const f = 1 + k * (0.9 * dIn + 0.8 * dOut);
      B.DMG[r.hero] = Math.round(clamp((B.DMG[r.hero] || 1) * Math.pow(f, 0.6), AB.LIM.dmg) * 100) / 100;
      B.HP[r.hero] = Math.round(clamp((B.HP[r.hero] || 1) * Math.pow(f, 0.4), AB.LIM.hp) * 100) / 100;
    });
    B.apply();
  };
  AB.auto = function (n, o) {
    AB.hist = []; let i = 0; AB.autoDone = false;
    const go = () => { AB.pass(Object.assign({}, o, { seed: 7 + i * 31 })); const wait = () => { if (!AB.done) return later(wait); AB.hist.push(Object.assign({ pass: i }, AB.summary())); if (++i < n) { AB.step(1); go(); } else AB.autoDone = true; }; later(wait); };
    go();
  };
  AB.table = () => { const t = {}; AB.top().forEach(h => { t[h] = { dmg: B.DMG[h] || 1, hp: B.HP[h] || 1 }; }); return JSON.stringify(t); };
})();
