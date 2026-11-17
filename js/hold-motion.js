'use strict';
// Shattered Worlds — no frozen fighters between moves. Draw-only: no timing, hitbox, damage or state change.
// Loaded after js/cast-motion.js. Measured in 24 Nightmare and Hard matches with every frame drawn (the Nightmare
// trainer, tools/hardcore-train.js): after the skills and ultimates were fixed, the poses still held one frame for half a
// second or more were
//   hurt    344 times, up to 183 frames: mostly a fighter stunned by a perfect block (60 frames) or held in a long combo
//   guard    43 times, up to 137 frames: a held guard
//   awaken   26 times, 34 frames: the power-up, one "cheer" frame
// Here every hit lands with a short shake, and a stunned or long-hurt fighter sways, dazed, once the last hit's 30-frame
// reaction (anim2.js) is over:
// the hurt frame rocking a pixel each way, slumping forward now and then (anim2.js's "hurtf" pose); a held guard breathes
// and shifts its weight; the power-up gathers (the charge pose) before the cheer. Itsuki is left as he is (another
// session's work). SW.holdMotion.on = false turns it off.
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype, art = SW && SW.art;
  if (!P || !P.draw || !art || !art.draw) return;
  const HM = SW.holdMotion = { on: true, skip: { itsuki: 1 } };
  let cur = null;
  const _pd = P.draw;
  P.draw = function () {
    const h = this.G && this.G.hero && this.G.hero(), s = this.state;
    const on = HM.on && h && !HM.skip[h.id] && (s === 'hurt' || s === 'guard' || s === 'awaken');
    const keep = cur; cur = on ? this : false;
    try { return _pd.apply(this, arguments); } finally { cur = keep; }
  };
  const tf = o => { if (SW.anim && !SW.anim.tf) SW.anim.tf = Object.assign({ dx: 0, sx: 1, sy: 1 }, o); };
  const _ad = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    const p = cur;
    if (p) {
      const st = p.st || 0, f = SW.frame, dir = flip ? -1 : 1;
      // every hit lands with a short shake (in a fast combo the same reaction frame stayed up the whole time)
      if (p.state === 'hurt' && p._hkT && f - p._hkT < 5) {
        tf({ dx: (f % 2 ? 1 : -1) * dir });
        if (HM.trace) HM.trace(anim, 10 + (f % 2));
      }
      // dazed: once the last hit's reaction is over, sway; every fourth beat slump forward
      else if (p.state === 'hurt' && anim === 'hurt' && (!p._hkT || f - p._hkT >= 30)) {
        const since = p._hkT ? f - p._hkT - 30 : st, beat = Math.floor(Math.max(0, since) / 9) % 4;
        if (beat === 2 && art.sheets[id + '+'] && art.sheets[id + '+'].anims.hurtf) { if (HM.trace) HM.trace('hurtf', 0); return _ad.call(this, ctx, id + '+', 'hurtf', 0, x, y, flip, o); }
        tf({ dx: beat === 1 ? dir : beat === 3 ? -dir : 0, sy: 1 - 0.02 * (beat % 2) });
        if (HM.trace) HM.trace('hurt', beat);
      }
      // a held guard breathes and shifts its weight
      else if (p.state === 'guard' && anim === 'guard' && (p.guardT || 0) > 10) {
        tf({ dx: (Math.floor(f / 12) % 2) * dir, sy: 1 + 0.025 * Math.sin(f * 0.14) });
        if (HM.trace) HM.trace('guard', Math.floor(f / 12) % 2);
      }
      // the power-up gathers before it bursts
      else if (p.state === 'awaken' && anim === 'cheer') {
        if (st < 20) { if (HM.trace) HM.trace('charge', (st >> 2) % 2); return _ad.call(this, ctx, id, 'charge', (st >> 2) % 2, x, y, flip, o); }
        tf({ sy: 1 + 0.03 * Math.sin(st * 0.5) });
        if (HM.trace) HM.trace('cheer', st % 2);
      }
    }
    return _ad.apply(this, arguments);
  };
})();
