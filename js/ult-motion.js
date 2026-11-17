'use strict';
// Shattered Worlds — ultimates that move. Draw-only: no timing, hitboxes, damage or state change.
// Measured with the Nightmare trainer (recordings/anim-report.md): during an ultimate nearly every hero held one pose,
// "cheer", for 50-80 frames (about a second of no motion at the biggest moment of a fight). Here the hero goes
// through a sequence instead: gather (charge), wind up (cast), a run of strikes in rhythm (special, a4, launcher, a3,
// each with an anticipation, hit and follow-through frame and a small lunge on the hit), and the hero's own victory
// pose (js/herostyle.js gives each a different "cheer") for the last moment. Loaded after js/combo-flow.js.
// Left as they were: Itsuki (his kit is another session's work) and ultimates with their own motion (hero.ult 'line').
// SW.ultMotion.on = false turns it off.
(function () {
  const SW = window.SW, P = SW && SW.Player && SW.Player.prototype, art = SW && SW.art, G = SW && SW.game;
  if (!P || !P.draw || !art || !art.draw) return;
  const UM = SW.ultMotion = { on: true, skip: { itsuki: 1 } };
  const STRIKES = ['special', 'a4', 'launcher', 'a3'];
  const END = 58;   // from here on, the victory pose (ultimates run about 70 frames)
  // the pose for frame st of the ultimate: [anim, frame, lunge]
  function pick(st, t) {
    if (st < 6) return ['charge', (t >> 2) % 2, 0];
    if (st < 12) return ['cast', st < 9 ? 0 : 1, 0];
    if (st >= END) return null;
    const k = st - 12, beat = Math.floor(k / 8), ph = k % 8;
    return [STRIKES[beat % STRIKES.length], ph < 2 ? 0 : ph < 6 ? 1 : 2, ph >= 2 && ph < 4 ? 2 : ph >= 4 && ph < 6 ? 1 : 0];
  }
  let cur = null;   // the hero being drawn while its ultimate runs
  const _pd = P.draw;
  P.draw = function () {
    const h = this.G && this.G.hero && this.G.hero();
    const on = UM.on && this.state === 'ult' && h && !UM.skip[h.id] && h.ult !== 'line';
    if (!on) return _pd.apply(this, arguments);
    const keep = cur; cur = this;
    try { return _pd.apply(this, arguments); } finally { cur = keep; }
  };
  const _ad = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    const p = cur;
    if (p && anim === 'cheer') {
      const s = pick(p.st || 0, p.t || 0);
      if (s) {
        if (s[2] && SW.anim && !SW.anim.tf) SW.anim.tf = { dx: (flip ? -1 : 1) * s[2], sx: 1, sy: 1 };   // a small lunge on the hit
        if (UM.trace) UM.trace(s[0], s[1]);   // for measuring (tools)
        return _ad.call(this, ctx, id, s[0], s[1], x, y, flip, o);
      }
    }
    return _ad.apply(this, arguments);
  };
})();
