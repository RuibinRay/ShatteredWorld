'use strict';
// Shattered Worlds — skill casts that move, and a look of their own for each skill slot. Draw-only: no timing,
// hitboxes, damage or state change. Loaded after js/ult-motion.js.
// Measured with the Nightmare trainer (recordings/anim-report.md): many heroes cast all four skills (U, S + U, I, S + I)
// with the same pose, and long casts held one frame for most of the move (Lin's I 86 frames, Ivo's I 84, Pyra's
// S + I 66: the Hidden Clans' carried moves pin the cast frame). Here, while a hero is casting with the plain cast pose:
//   * each slot has its own pose family: U cast > special, S + U special > a3, I a4 > launcher, S + I launcher > a4
//     (which slot was used is read from the cooldown it starts; nothing in the game is changed to know it)
//   * the cast plays as anticipation, release (with a small lunge) and follow-through, and a long one keeps moving,
//     alternating the two poses of its family every 6 frames instead of holding one frame.
// A skill that sets its own pose (p.pose) is drawn as before. Itsuki is left alone (another session's work).
// SW.castMotion.on = false turns it off.
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype, art = SW && SW.art;
  if (!P || !P.draw || !art || !art.draw) return;
  const CM = SW.castMotion = { on: true, skip: { itsuki: 1 } };
  const FAM = { u: ['cast', 'special'], su: ['special', 'a3'], i: ['a4', 'launcher'], si: ['launcher', 'a4'] };
  const SLOTS = ['u', 'su', 'i', 'si'];
  // which slot started last: the one whose cooldown just went up
  function watch(p) {
    const cd = p.cd || {}, was = p._cmCd || (p._cmCd = {});
    for (const s of SLOTS) { const v = cd[s] || 0; if (v > (was[s] || 0) + 1) { p._cmSlot = s; p._cmT0 = SW.frame; } was[s] = v; }
    if (p.state !== 'cast' && p._cmState === 'cast') p._cmSlot = null;
    if (p.state === 'cast' && p._cmState !== 'cast') { p._cmStart = SW.frame; if (!p._cmSlot || SW.frame - (p._cmT0 || 0) > 3) p._cmSlot = p._cmSlot || 'u'; }
    p._cmState = p.state;
  }
  function pick(slot, t) {
    const f = FAM[slot] || FAM.u;
    if (t < 4) return [f[0], 0, 0];
    if (t < 10) return [f[0], 1, 2];
    if (t < 16) return [f[0], 2, 0];
    const k = Math.floor((t - 16) / 6) % 4;   // a long cast keeps moving
    return [[f[1], 1, 1], [f[0], 1, 1], [f[1], 2, 0], [f[0], 2, 0]][k];
  }
  let cur = null;
  const _pd = P.draw;
  P.draw = function () {
    const h = this.G && this.G.hero && this.G.hero();
    if (CM.on && h && !CM.skip[h.id]) watch(this);
    const on = CM.on && this.state === 'cast' && h && !CM.skip[h.id];
    if (!on) return _pd.apply(this, arguments);
    const keep = cur; cur = this;
    try { return _pd.apply(this, arguments); } finally { cur = keep; }
  };
  const _ad = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    const p = cur;
    if (p && anim === 'cast' && !p.pose) {
      const s = pick(p._cmSlot || 'u', SW.frame - (p._cmStart || SW.frame));
      if (s[2] && SW.anim && !SW.anim.tf) SW.anim.tf = { dx: (flip ? -1 : 1) * s[2], sx: 1, sy: 1 };
      if (CM.trace) CM.trace(s[0], s[1]);   // for measuring (tools)
      return _ad.call(this, ctx, id, s[0], s[1], x, y, flip, o);
    }
    // a skill's own pose (p.pose) held a long time (Pyra's S + I held one frame 67 frames): keep the pose the skill
    // chose, but let it breathe between its hit and follow-through frames every 6 frames
    if (p && p.pose && anim === p.pose[0] && fi === p.pose[1]) {
      if (p._cmPose !== p.pose) { p._cmPose = p.pose; p._cmPoseT = SW.frame; }
      const held = SW.frame - p._cmPoseT;
      if (held > 18 && (fi === 1 || fi === 2)) {
        const f2 = Math.floor((held - 18) / 6) % 2 ? (fi === 1 ? 2 : 1) : fi;
        if (CM.trace) CM.trace(anim, f2);
        return _ad.call(this, ctx, id, anim, f2, x, y, flip, o);
      }
    }
    return _ad.apply(this, arguments);
  };
})();
