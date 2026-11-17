'use strict';
// Shattered Worlds — awakening (O) in Versus. Loaded after versus.js; only wraps V.update and V.draw.
//   An awakening lasts until its time runs out or until the hero has used one ultimate in it, whichever comes first:
//   the ultimate plays out, then the hero goes back to normal. (While awakened an ultimate costs much less than
//   300 energy, so one awakening used to hold several.)
//   The awaken meter fills at half its old rate in Versus (from hits taken and hits landed alike).
//   Training's endless mode keeps its full meter. The story is untouched.
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, art = SW.art;
  if (!V || !V.update || !V.draw) return;
  const AW = SW.vsAwaken = { ults: 1, fill: 0.5 };

  const _vu = V.update; V.update = function () {
    const fs = G.scene === 'vs' && V.f ? V.f.filter(f => f && f.p && f.state) : [];
    const before = fs.map(f => ({ f, p: f.p, aw: f.state.awaken || 0, st: f.p.state, on: f.p.awakeT > 0 }));
    const r = _vu.apply(this, arguments);
    if (G.scene !== 'vs' || (V.mode === 'train' && V.endless)) return r;
    for (const b of before) {
      const p = b.p, S = b.f.state;
      if (b.f.p !== p) continue;   // a new round or the next fighter: nothing to carry over
      // the meter: keep only part of what it gained this frame (while not awakened; awakened, it counts the time down)
      // (the game caps the meter at 100 before this sees it, so the last half point counts as full: no endless creep)
      if (!b.on && p.awakeT <= 0 && S.awaken > b.aw) { const v = b.aw + (S.awaken - b.aw) * AW.fill; S.awaken = v >= 99.5 ? 100 : v; }
      // the ultimates of this awakening
      if (p.awakeT > 0 && !b.on) p.vsUlts = 0;                                      // just awakened
      if (p.awakeT > 0 && p.state === 'ult' && b.st !== 'ult') p.vsUlts = (p.vsUlts || 0) + 1;
      if (p.awakeT > 1 && (p.vsUlts || 0) >= AW.ults && p.state !== 'ult') p.awakeT = 1;   // the last one is done: back to normal next frame
    }
    return r;
  };

  // under each awakened fighter's meter: how many ultimates this awakening has left
  const _vd = V.draw; V.draw = function (ctx) {
    _vd.apply(this, arguments);
    if (G.scene !== 'vs' || !V.f || (V.mode === 'train' && V.endless) || ['fight', 'ko'].indexOf(V.phase) < 0) return;
    V.f.forEach((f, i) => {
      const p = f && f.p; if (!p || p.dead || !(p.awakeT > 1)) return;
      const left = Math.max(0, AW.ults - (p.vsUlts || 0)), h = SW.data.heroes[f.hero];
      if (!left) return;   // used: it plays out, then the awakening ends
      const x = i === 0 ? 8 : SW.W - 8;
      SW.text(ctx, left === 1 ? 'One ultimate left' : left + ' ultimates left', x, 36, h ? h.colorHi : '#ffffff', { align: i === 0 ? 'left' : 'right' });
    });
  };
})();
