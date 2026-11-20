'use strict';
// Shattered Worlds — weapons with real shapes (the user, 2026-11-20: "make sure to improve weapon look as well like the
// vampire scythe"). The fighters' weapons were one straight line with a square at the end (js/art.js). js/art.js now
// asks art.WEAPON_DRAW[name] first: a function that draws the weapon into the sprite, pixel by pixel (no smooth paths:
// the sprite sheet gets its outline afterwards). Each one is drawn from the hand (wx, wy) along the angle a.
// Must load BEFORE the sprites are baked (any time before the game starts): js/ninja-core.js bakes them in art.init.
//   scythe   Vesna: a long black shaft with a crimson band, and a great hooked blade of blood with a bright edge
(function () {
  const SW = window.SW, art = SW.art;
  if (!art) return;
  const WD = art.WEAPON_DRAW = art.WEAPON_DRAW || {};

  // a tapering curved blade: points along an arc from (x0, y0), drawn as short thick-to-thin strokes
  function arcBlade(x, T, cx, cy, r, a0, a1, w0, cols) {
    const n = 14;
    for (let pass = 0; pass < cols.length; pass++) {
      for (let i = 0; i < n; i++) {
        const u0 = i / n, u1 = (i + 1) / n, t0 = a0 + (a1 - a0) * u0, t1 = a0 + (a1 - a0) * u1;
        const w = Math.max(1, Math.round(w0 * (1 - u0 * 0.85)) - pass), rr = r - pass * 0.8;
        if (pass && w0 * (1 - u0 * 0.85) - pass < 0.6) continue;
        T.pline(x, cols[pass], cx + Math.cos(t0) * rr, cy + Math.sin(t0) * rr, cx + Math.cos(t1) * rr, cy + Math.sin(t1) * rr, w);
      }
    }
  }

  WD.scythe = function (x, wx, wy, a, len, sc, W, T) {
    let dx = Math.sin(a), dy = Math.cos(a); const L = len * 1.25;
    if (dy > 0.35) { dx = -dx; dy = -dy; }   // a resting pose points the weapon at the floor: carry the scythe blade-up over the shoulder instead
    const bx = wx - dx * L * 0.35, by = wy - dy * L * 0.35, ex = wx + dx * L, ey = wy + dy * L;   // the shaft runs through the hand
    T.pline(x, '#140608', bx, by, ex, ey, Math.max(2, Math.round(2 * sc)));
    T.pline(x, '#4a1016', bx + dx * 2, by + dy * 2, ex, ey, 1);
    T.rect(x, '#d00000', wx + dx * L * 0.55 - sc, wy + dy * L * 0.55 - sc, 2 * sc, 2 * sc);   // a crimson band
    T.rect(x, '#ffb3b3', bx - sc * 0.5, by - sc * 0.5, sc, sc);                                 // the butt spike
    // the blade hooks out from the top of the shaft toward the front of the fighter, and curls back down
    let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const r = 11 * sc, cx = ex - dx * r * 0.2 + px * 0 - dx * r * 0.8, cy = ey - dy * r * 0.2 - dy * r * 0.8;
    const base = Math.atan2(dy, dx), side = (px * -dy + py * dx) > 0 ? 1 : -1;   // which way round the arc turns toward the front
    arcBlade(x, T, cx, cy, r, base, base + side * 2.5, 5 * sc, ['#6a040f', '#d00000', '#ff6b6b']);
    const tipA = base + side * 2.5; T.rect(x, '#ffb3b3', cx + Math.cos(tipA) * r - 0.5, cy + Math.sin(tipA) * r - 0.5, 1, 1);
    T.rect(x, '#e5383b', ex + px * 3 * sc, ey + py * 3 * sc + 3 * sc, 1, 2);   // a drop of blood hanging from it
  };
})();
