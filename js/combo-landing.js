'use strict';
// Shattered Worlds — combos that carry on after the air string (Versus only). Loaded after js/combolink.js.
//   J J J  W+J > K > J J J  and then, back on the ground, J J J again.
// The third air hit spikes the target down (it stays hurt for 30 frames) but also pushed it 2.6 sideways, so it landed
// about 47 px away: out of reach of the first ground J for all but the eleven heroes with a long one (Nyra, Noct,
// Aldric...). Measured on a stunned dummy at normal speed with the Hardcore/Nightmare trainer (tools/hardcore-train.js):
//   push 2.6: 11 of 64 heroes can follow up on landing    push 0.6: 64 of 64 (61-64 from 16, 22 or 30 px away)
//   push 0:   11 of 64 (the target lands behind the hero)
// No hit does more damage than before: the combo just goes on for the extra hits (about +27 for a full string).
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype;
  if (!P || !P.hit) return;
  const PUSH = 0.6;
  const _hit = P.hit;
  P.hit = function (def) {
    const C = SW.data.combat;
    if (def && C && C.air && def === C.air[2] && this.G && this.G.scene === 'vs' && Math.abs(def.kx || 0) > PUSH) def = Object.assign({}, def, { kx: PUSH });
    return _hit.call(this, def);
  };
})();
