'use strict';
// Shattered Worlds — Versus: while powered up (O), the energy bar fills 80% faster (the user, 2026-11-17).
// Versus settles each fighter's energy at the end of its frame (js/versus.js: the passive trickle, charging, landing
// and taking hits, all scaled by the Energy gain setting). At the start of the fighter's next frame the settled change
// is known: if it went up while the fighter was powered up, 80% more of it is added. Spending is never touched, and
// a frame that both spent and gained counts only the net gain. Story mode is unchanged.
// SW.awakenGain.mul is the extra share (0.8); SW.awakenGain.on = false turns it off.
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype, G = SW && SW.game, V = SW && SW.versus;
  if (!P || !P.update || !G || !V) return;
  const AG = SW.awakenGain = { on: true, mul: 0.8 };
  const _up = P.update;
  P.update = function () {
    const S = this.G && this.G.state;
    const f = V.cur && V.cur.p === this ? V.cur : null;   // the fighter whose frame this is (Versus adds f.bonus when it settles)
    if (AG.on && S && f && G.scene === 'vs' && V.phase === 'fight' && !this.dead) {
      const e = S.energy, last = this._agE;
      let extra = 0;
      if (last !== undefined && this._agOn && e > last) extra = Math.min(300 - e, (e - last) * AG.mul);
      if (extra > 0) f.bonus = (f.bonus || 0) + extra;
      this._agE = e + extra;   // the next frame measures only what was gained after this extra (no boost on the boost)
      this._agOn = this.awakeT > 0;
    } else { this._agE = undefined; this._agOn = false; }
    return _up.apply(this, arguments);
  };
})();
