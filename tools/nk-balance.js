'use strict';
// tools/nk-balance.js — Versus balance by tournament (not loaded by the game; needs tools/hardcore-train.js as HT and
// js/versus-balance.js). Nightmare vs Nightmare rounds, each regular hero against the other regulars.
//   NB.run(pool, o)    plays the rounds in the background (o: { opps: per hero, reps }); NB.rows when NB.done
//   NB.step(k)         nudges SW.versusBalance.DMG / HP toward 50% from NB.rows (k: how hard)
//   NB.table()         the tables as code, for js/versus-balance.js
(function () {
  const SW = window.SW, D = SW.data, HT = window.HT, B = SW.versusBalance;
  const later = fn => { const c = new MessageChannel(); c.port1.onmessage = () => fn(); c.port2.postMessage(0); };
  const NB = window.NB = { rows: [], done: true, q: [] };
  NB.legends = () => D.heroOrder.filter(h => (D.heroes[h] && D.heroes[h].legend) || (SW.ninja && SW.ninja.HEROES && SW.ninja.HEROES[h] && SW.ninja.HEROES[h].legend));
  NB.pool = () => { const L = NB.legends(); return D.heroOrder.filter(h => D.heroes[h] && h !== 'itsuki' && L.indexOf(h) < 0); };
  NB.run = function (pool, o) {
    o = Object.assign({ opps: 12, reps: 1 }, o || {}); pool = pool || NB.pool();
    const R = {}; NB.done = false; NB.q = []; NB.t0 = performance.now();
    pool.forEach((h, i) => { for (let r = 0; r < o.reps; r++) for (let j = 1; j <= o.opps; j++) NB.q.push([h, pool[(i + j * 5 + r * 3) % pool.length]]); });
    const add = (h, won, m) => { const x = R[h] || (R[h] = { hero: h, n: 0, w: 0, m: 0 }); x.n++; x.w += won; x.m += m; };
    const step = () => {
      const t = performance.now();
      while (NB.q.length && performance.now() - t < 1500) {
        const [a, b] = NB.q.shift(); if (a === b) continue;
        const x = b === 'convergence' ? HT.round(b, a, 3, 3, 5400) : HT.round(a, b, 3, 3, 5400); if (!x) continue;
        const sa = b === 'convergence' ? 1 : 0, wa = x.w === sa ? 1 : x.w === -1 ? 0.5 : 0, m = x.hp[sa] - x.hp[1 - sa];
        add(a, wa, m); add(b, 1 - wa, -m);
      }
      if (NB.q.length) later(step); else { NB.done = true; NB.ms = performance.now() - NB.t0; NB.rows = Object.values(R).map(x => ({ hero: x.hero, n: x.n, win: Math.round(100 * x.w / x.n), margin: Math.round(100 * x.m / x.n) })).sort((p, q) => p.win - q.win); }
    };
    later(step);
  };
  NB.step = function (k) {
    k = k || 1;
    NB.rows.forEach(r => {
      const d = (50 - r.win) / 100 + 0.25 * (-r.margin) / 100;
      const dm = SW.clamp((B.DMG[r.hero] || 1) * (1 + 0.55 * k * d), 0.7, 1.45), hp = SW.clamp((B.HP[r.hero] || 1) * (1 + 0.35 * k * d), 0.8, 1.3);
      B.DMG[r.hero] = Math.round(dm * 100) / 100; B.HP[r.hero] = Math.round(hp * 100) / 100;
    });
    B.apply();
  };
  NB.table = () => 'DMG: ' + JSON.stringify(B.DMG) + '\nHP: ' + JSON.stringify(B.HP);
})();
