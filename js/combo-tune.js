'use strict';
// Shattered Worlds — heavier normal attacks for the heroes whose J chain hits lightest (Versus only; the story is untouched).
// Loaded after js/combo-landing.js. Asked for by the user ("you can adjust some damage") after the combo-flow work.
// Measured with the Nightmare trainer (tools/hardcore-train.js) at normal speed: J J J J on a stunned dummy did 21-31 for
// these heroes against a roster middle of about 43, so their combos felt weak however well they connected. Each
// multiplier applies to normal attacks only (J chain, launcher, sweep, air hits; not skills or ultimates), and was
// sized to bring J J J J to about 35-40 while keeping each hero's rounds won against the regular heroes (Hard bots on
// both sides) inside the roster's normal range (see README, "Heavier J chains").
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype;
  if (!P || !P.comboMul) return;
  const MELEE = {
    fenn: 1.5, corvin: 1.4, rook: 1.3, convergence: 1.45, maren: 1.15, garo: 1.15,
    apis: 1.1, hart: 1.1, mika: 1.1, kova: 1.1, kestra: 1.1, ivo: 1.1, isolde: 1.1, thorne: 1.1, vesper: 1.1, kiri: 1.1, lux: 1.1
  };
  SW.comboTune = { MELEE, on: true };
  const _cm = P.comboMul;
  P.comboMul = function () {
    const m = _cm.apply(this, arguments), G = this.G;
    if (!SW.comboTune.on || !G || G.scene !== 'vs' || !G.hero) return m;
    const h = G.hero();
    return m * (h && MELEE[h.id] || 1);
  };
})();
