'use strict';
// tools/nk-rank.js — strength ranking by tournament (not loaded by the game; needs tools/hardcore-train.js as HT).
// Nightmare vs Nightmare rounds at normal game speed, with the game as it is (balance tables, ultimates and all).
//   NR.tourney(name, pairs)   plays the pairs in the background; NR.t[name] = rows when done (NR.busy false)
//   NR.swiss(heroes, opps, reps, seed)   pairs: each hero against `opps` others, both sides, shuffled by seed
//   NR.robin(heroes)          pairs: everyone against everyone, both sides
//   NR.rank(names)            heroes by average win rate over the named tournaments (margin breaks ties)
(function () {
  const later = fn => { const c = new MessageChannel(); c.port1.onmessage = () => fn(); c.port2.postMessage(0); };
  const HT = window.HT, D = window.SW.data;
  const NR = window.NR = { t: {}, busy: false, q: [], all: () => D.heroOrder.filter(h => D.heroes[h]) };
  const rnd = s => () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  NR.swiss = function (H, opps, reps, seed) {
    const r = rnd(seed || 1), P = [];
    H.forEach(a => { const o = H.filter(b => b !== a).sort(() => r() - 0.5).slice(0, opps); for (let k = 0; k < (reps || 1); k++) o.forEach(b => P.push([a, b])); });
    return P;
  };
  NR.robin = H => { const P = []; H.forEach(a => H.forEach(b => { if (a !== b) P.push([a, b]); })); return P; };
  NR.tourney = function (name, pairs) {
    const R = {}; NR.busy = true; NR.q = pairs.slice(); NR.name = name; NR.t0 = performance.now();
    const add = (h, w, m) => { const x = R[h] || (R[h] = { hero: h, n: 0, w: 0, m: 0 }); x.n++; x.w += w; x.m += m; };
    const step = () => {
      const t = performance.now();
      while (NR.q.length && performance.now() - t < 1500) {
        const [a, b] = NR.q.shift();
        const x = HT.round(a, b, 3, 3, 5400); if (!x) continue;
        const wa = x.w === 0 ? 1 : x.w === -1 ? 0.5 : 0, m = x.hp[0] - x.hp[1];
        add(a, wa, m); add(b, 1 - wa, -m);
      }
      if (NR.q.length) later(step);
      else { NR.t[name] = Object.values(R).map(x => ({ hero: x.hero, n: x.n, win: Math.round(1000 * x.w / x.n) / 10, margin: Math.round(100 * x.m / x.n) })); NR.busy = false; NR.ms = performance.now() - NR.t0; }
    };
    later(step);
  };
  NR.rank = function (names) {
    const S = {};
    (names || Object.keys(NR.t)).forEach(n => (NR.t[n] || []).forEach(r => { const s = S[r.hero] || (S[r.hero] = { hero: r.hero, k: 0, win: 0, margin: 0, each: [] }); s.k++; s.win += r.win; s.margin += r.margin; s.each.push(r.win); }));
    return Object.values(S).map(s => ({ hero: s.hero, win: Math.round(10 * s.win / s.k) / 10, margin: Math.round(s.margin / s.k), each: s.each })).sort((a, b) => b.win - a.win || b.margin - a.margin);
  };
})();
