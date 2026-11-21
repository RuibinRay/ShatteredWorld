'use strict';
// Shattered Worlds — Versus balance pass of 2026-11-20 (the user: "update the whole versus, adjust health and skill
// damage"), measured after every ultimate became 47% of full health (js/ult-share.js) and the Nightmare bots learned to use
// all five skills and mixed combos (js/nightmare-kit.js, tools/nk-train.js).
//   DMG[hero]  multiplies the damage the hero deals in Versus, on top of the older tables (V.tune and the per-hero
//              files); the ultimate stays at 47% whatever this says (js/ult-share.js caps it)
//   HP[hero]   multiplies the hero's full health in Versus
// Solved with Nightmare-vs-Nightmare rounds (tools/nk-balance.js): each regular hero against the other regulars, nudged
// toward a 50% win rate. Itsuki and the ten legends keep their designed edge and are left out (their lock and strength
// rule is the user's), so they are not in the tables. SW.versusBalance.on = false turns it off.
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, P = SW.Player && SW.Player.prototype;
  if (!V || !V.tune || !P) return;
  // four passes of 1,800+ rounds (each hero ~70 games): win rates from 18-90% (spread 17) to 29-90% with most at 35-65%
  // (spread 9). Corvin is left out too (the user wants him the strongest counter hero). Clamped to 0.7-1.45 damage and
  // 0.8-1.3 health, so no hero changes past that; Lin, Mako, Nyra, Kova, Sora and Tarn are at the top, Rook and Apis at
  // the bottom (Rook's S+U lands in 6 frames from up to 180 px)
  const DMG = {
    apis: 0.7, ashka: 0.8, brakk: 0.99, brann: 1.38, coda: 1.19, convergence: 1.37, dune: 1.3, dyna: 0.78,
    elixa: 0.7, fenn: 0.7, fumi: 0.92, gale: 1.18, garo: 1.1, hart: 1.15, hex: 1.01, hollis: 1.18, isa: 0.7,
    isolde: 0.99, ivo: 1.16, kael: 0.8, kestra: 1.02, kiri: 0.75, kova: 1.45, lin: 1.45, lux: 0.72, mako: 1.45,
    maren: 0.7, mika: 1.25, moro: 0.85, nami: 0.81, nyra: 1.45, oda: 1.24, opal: 0.77, pell: 0.7, pyra: 1.06,
    rook: 0.7, rue: 1.1, ryo: 1.22, sable: 1.07, slick: 0.83, sora: 1.45, tarek: 0.95, tarn: 1.45, taro: 0.83,
    thorne: 1.19, tor: 1.15, ume: 0.73, vesna: 1.14, vesper: 1.06, vex: 1.07, yara: 1.27, zara: 0.94
  };
  const HP = {
    apis: 0.8, ashka: 0.88, brakk: 0.99, brann: 1.23, coda: 1.13, convergence: 1.23, dune: 1.18, dyna: 0.86,
    elixa: 0.8, fenn: 0.8, fumi: 0.95, gale: 1.11, garo: 1.06, hart: 1.09, hex: 1, hollis: 1.12, isa: 0.8, isolde: 1,
    ivo: 1.1, kael: 0.88, kestra: 1.01, kiri: 0.83, kova: 1.3, lin: 1.3, lux: 0.82, mako: 1.3, maren: 0.8,
    mika: 1.16, moro: 0.91, nami: 0.88, nyra: 1.3, oda: 1.14, opal: 0.86, pell: 0.8, pyra: 1.04, rook: 0.8,
    rue: 1.07, ryo: 1.14, sable: 1.05, slick: 0.89, sora: 1.29, tarek: 0.97, tarn: 1.3, taro: 0.89, thorne: 1.12,
    tor: 1.1, ume: 0.82, vesna: 1.09, vesper: 1.03, vex: 1.04, yara: 1.18, zara: 0.96
  };
  const B = SW.versusBalance = { on: true, DMG, HP };
  const inVs = () => B.on && G.scene === 'vs';
  // damage: V.tune[hero] reads through this, keeping whatever the older tables (and getters) give
  B.apply = function () {
    Object.keys(B.DMG).forEach(h => {
      const d = Object.getOwnPropertyDescriptor(V.tune, h);
      if (d && d.get && d.get.nkBal) return;
      let base = d && d.get ? d.get : null, val = d && !d.get ? d.value : 1;
      const get = () => (base ? base() : val) * (inVs() ? B.DMG[h] || 1 : 1); get.nkBal = true;
      Object.defineProperty(V.tune, h, { configurable: true, enumerable: true, get, set: v => { base = null; val = v; } });
    });
  };
  // health
  const _hm = P.hpMax;
  P.hpMax = function () { const v = _hm.apply(this, arguments), h = G.state && G.state.hero, k = inVs() && h ? B.HP[h] : 0; return k ? Math.round(v * k) : v; };
  B.apply();
})();
