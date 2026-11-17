'use strict';
// Shattered Worlds — stronger combos for the heroes whose combos hit lightest (Versus only; the story is untouched).
// Loaded after js/combo-landing.js. Asked for by the user ("you can adjust some damage", then "improve the 20 weakest
// combos") after the combo-flow work. Measured with the Nightmare trainer (tools/hardcore-train.js) at normal speed on a
// stunned dummy, and checked against the regular heroes with Hard bots on both sides (see README, "Heavier J chains").
//   MELEE  normal attacks (J chain, launcher, sweep, air hits): for J chains that did well under the roster middle
//   SKILL  the hero's skill hits (energy moves, not the ultimate): for skills that connect after J J J but added little
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype, V = SW && SW.versus;
  if (!P || !P.comboMul) return;
  const MELEE = {
    fenn: 1.65, corvin: 1.7, rook: 1.45, convergence: 1.45, maren: 1.3, garo: 1.35, isa: 1.15,
    pell: 1.25, hex: 1.2, lin: 1.2, brann: 1.2, sable: 1.25, ume: 1.2,
    isolde: 1.2, thorne: 1.2, hart: 1.15, kova: 1.15, kestra: 1.15, ivo: 1.15,
    apis: 1.1, mika: 1.25, vesper: 1.1, kiri: 1.1, lux: 1.1
  };
  const SKILL = {
    garo: 1.6, corvin: 1.4, pell: 1.6, hex: 1.4, fenn: 1.4, rook: 1.3, lin: 1.3, thorne: 1.3, mika: 1.5, brann: 1.4,
    isolde: 1.3, kova: 1.3, hart: 1.3, isa: 1.3, maren: 1.2, ume: 1.4, kestra: 1.25, opal: 1.3
  };
  SW.comboTune = { MELEE, SKILL, on: true };
  const _cm = P.comboMul;
  P.comboMul = function () {
    const m = _cm.apply(this, arguments), G = this.G;
    if (!SW.comboTune.on || !G || G.scene !== 'vs' || !G.hero) return m;
    const h = G.hero();
    return m * (h && MELEE[h.id] || 1);
  };
  // skill hits: every hit a fighter takes in Versus passes here once, with the attacker as V.cur
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const a = V && V.cur, gg = g || (this.G);
    if (SW.comboTune.on && atk && atk.energy && atk.dmg && gg && gg.scene === 'vs' && a && a.p !== this && SKILL[a.hero] && a.p.state !== 'ult') {
      atk = Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * SKILL[a.hero])) });
      return _th.apply(this, [atk].concat([].slice.call(arguments, 1)));
    }
    return _th.apply(this, arguments);
  };
})();
