'use strict';
// Shattered Worlds — Versus: with an empty energy bar, an ultimate cannot be blocked (the user, 2026-11-17).
// Guarding is decided in Player.takeHit (js/actors.js): an attack marked "unblockable" goes through a guard. Here, in
// Versus only, a hit that lands while the attacker is in its ultimate is marked unblockable when the fighter it hits
// has no energy left. Everything else blocks as before, and story mode is unchanged. The Nightmare bot knows this
// (js/hardcore.js): with an empty bar it gets away from an ultimate instead of guarding it.
// SW.ultGuard.on = false turns it off.
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype, G = SW && SW.game, V = SW && SW.versus, fx = SW && SW.fx;
  if (!P || !P.takeHit || !G || !V) return;
  const UG = SW.ultGuard = { on: true };
  // the attacker: the other fighter (Versus switches to the fighter being hit before it calls takeHit)
  const attacker = p => V.f && V.f.length === 2 ? V.f.find(x => x && x.p && x.p !== p) : null;
  UG.applies = (p, g) => {
    const gg = g || G, S = gg && gg.state, o = attacker(p);
    return !!(UG.on && gg && gg.scene === 'vs' && S && S.energy < 1 && o && o.p.state === 'ult');
  };
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    if (atk && !atk.unblockable && this.state === 'guard' && UG.applies(this, g)) {
      if (fx && (!this._ugT || SW.frame - this._ugT > 30)) { this._ugT = SW.frame; fx.text(this.x, this.y - 52, 'NO ENERGY - GUARD BROKEN', '#ff6b6b'); }
      atk = Object.assign({}, atk, { unblockable: true });
      return _th.apply(this, [atk].concat([].slice.call(arguments, 1)));
    }
    return _th.apply(this, arguments);
  };
})();
