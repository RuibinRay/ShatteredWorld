'use strict';
// Shattered Worlds — weapons with real shapes (the user, 2026-11-20: "make sure to improve weapon look as well like the
// vampire scythe"). The fighters' weapons were one straight line with a square at the end (js/art.js). js/art.js now
// asks art.WEAPON_DRAW[name] first: a function that draws the weapon into the sprite, pixel by pixel (no smooth paths:
// the sprite sheet gets its outline afterwards). Each weapon keeps its own colours and length from art.WEAPONS.
// Must load BEFORE the sprites are baked (any time before the game starts): js/ninja-core.js bakes them in art.init.
//   swords    blade, aurora, tanto, katana (curved, round guard), saber (curved, knuckle bow), voidblade (forked tip),
//             bonesword (serrated), shard (a jagged crystal), greatsword (wide, a fuller, a broad guard)
//   cleavers  cleaver, cleaver2 (Nami's: notched like a shark's back)
//   poles     staff (a ringed head), spear (a leaf head and a tassel), scythe (Vesna: a hooked blade of blood)
//   others    pipe, baton, club (studded), warfan (open ribs), pistol, longbow (a strung bow), flask, wrench
(function () {
  const SW = window.SW, art = SW.art;
  if (!art) return;
  const WD = art.WEAPON_DRAW = art.WEAPON_DRAW || {};
  const shade = (c, f) => (art.shade && /^#[0-9a-f]{6}$/i.test(c || '') ? art.shade(c, f) : c);

  // the weapon's own axes: u along it from the hand, v across it (positive toward the front of the fighter)
  function frame(wx, wy, a) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    return { dx, dy, px, py, P: (u, v) => [wx + dx * u + px * (v || 0), wy + dy * u + py * (v || 0)] };
  }
  const seg = (x, T, F, col, u0, v0, u1, v1, w) => { const a = F.P(u0, v0), b = F.P(u1, v1); T.pline(x, col, a[0], a[1], b[0], b[1], w || 1); };
  const dot = (x, T, F, col, u, v, s) => { const a = F.P(u, v), k = s || 1; T.rect(x, col, a[0] - k / 2, a[1] - k / 2, k, k); };
  // a tapered blade made of one-pixel strands: hw strands each side of the middle, a bright edge on the front side
  function blade(x, T, F, o) {
    const L = o.L, hw = o.hw || 1, curve = o.curve || 0, n = 5, base = o.base || 0;
    for (let v = -hw; v <= hw; v++) {
      const fr = Math.abs(v) / (hw + 0.6), Lv = L - fr * L * (o.taper === undefined ? 0.3 : o.taper);
      const col = v === hw ? o.edge : v === -hw ? o.back : o.body;
      for (let i = 0; i < n; i++) { const u0 = base + (Lv - base) * i / n, u1 = base + (Lv - base) * (i + 1) / n; seg(x, T, F, col, u0, v * (1 - 0.45 * u0 / L) + curve * (u0 / L) * (u0 / L), u1, v * (1 - 0.45 * u1 / L) + curve * (u1 / L) * (u1 / L), 1); }
    }
    if (o.shine) for (let i = 1; i < n; i++) { const u0 = base + (L - base) * i / n, u1 = base + (L - base) * (i + 1) / n; seg(x, T, F, o.shine, u0, curve * (u0 / L) * (u0 / L), u1, curve * (u1 / L) * (u1 / L), 1); }
  }
  const grip = (x, T, F, len, col, pom) => { seg(x, T, F, col, -len, 0, 0, 0, 2); if (pom) dot(x, T, F, pom, -len - 1, 0, 2); };
  const guard = (x, T, F, g, col, w) => seg(x, T, F, col, 0, -g, 0, g, w || 2);
  const sword = (o) => function (x, wx, wy, a, len, sc, W, T) {
    const F = frame(wx, wy, a), L = len * (o.long || 1.1);
    blade(x, T, F, { L, hw: o.hw || 1, curve: (o.curve || 0) * sc, body: W.col, edge: W.hi || '#ffffff', back: shade(W.col, 0.6), shine: o.shine ? (W.hi || '#ffffff') : null, taper: o.taper, base: 1 });
    if (o.extra) o.extra(x, T, F, L, W, sc);
    guard(x, T, F, (o.guard === undefined ? 3 : o.guard) * sc, o.guardCol || W.hilt, o.guardW);
    grip(x, T, F, (o.grip || 3) * sc, o.gripCol || shade(W.hilt, 0.7), o.pommel || W.hilt);
  };

  // ---------- swords ----------
  WD.blade = sword({ shine: true });
  WD.aurora = sword({ shine: true, guardCol: '#7fe9ff', extra(x, T, F, L) { dot(x, T, F, '#b8ffd8', L * 0.45, 2); dot(x, T, F, '#aef4ff', L * 0.75, -2); dot(x, T, F, '#ffffff', L + 1, 0); } });
  WD.tanto = sword({ long: 1, guard: 2, grip: 3 });
  WD.katana = sword({ curve: 2.5, shine: true, guard: 0, grip: 5, long: 1.15, extra(x, T, F) { const c = F.P(0, 0); T.disc(x, '#d9b45a', Math.round(c[0]), Math.round(c[1]), 2); for (let i = 1; i < 5; i += 2) dot(x, T, F, '#d8d0e8', -i, 0); } });
  WD.saber = sword({ curve: 3.5, shine: true, guard: 2, grip: 4, extra(x, T, F) { seg(x, T, F, '#d9b45a', 0, 3, -4, 3, 1); seg(x, T, F, '#d9b45a', -4, 3, -4, 0, 1); } });
  WD.voidblade = function (x, wx, wy, a, len, sc, W, T) {   // a black blade with a glowing edge on both sides and a forked tip
    const F = frame(wx, wy, a), L = len * 1.1;
    blade(x, T, F, { L: L - 3, hw: 1, body: W.col, edge: W.hi, back: W.hi, taper: 0, base: 1 });
    seg(x, T, F, W.hi, L - 3, 1, L + 1, 2, 1); seg(x, T, F, W.hi, L - 3, -1, L + 1, -2, 1); dot(x, T, F, '#ffffff', L + 1, 2); dot(x, T, F, '#ffffff', L + 1, -2);
    seg(x, T, F, W.hi, 0, -3, 1, -2, 1); seg(x, T, F, W.hi, 0, 3, 1, 2, 1); guard(x, T, F, 2, W.hilt, 1); grip(x, T, F, 4 * sc, '#0a1016', W.hi);
  };
  WD.bonesword = sword({ hw: 1, guard: 0, grip: 3, extra(x, T, F, L, W) { for (let u = 4; u < L - 2; u += 3) dot(x, T, F, '#ffffff', u, 2); const c = F.P(0, -2), d = F.P(0, 2); T.disc(x, W.hilt, Math.round(c[0]), Math.round(c[1]), 1); T.disc(x, W.hilt, Math.round(d[0]), Math.round(d[1]), 1); } });
  WD.shard = function (x, wx, wy, a, len, sc, W, T) {   // a jagged crystal: three facets of different lengths
    const F = frame(wx, wy, a), L = len * 1.15;
    seg(x, T, F, shade(W.col, 0.6), 1, -2, L * 0.62, -1, 1); seg(x, T, F, shade(W.col, 0.8), 1, -1, L * 0.8, -1, 1);
    seg(x, T, F, W.col, 1, 0, L, 0, 1); seg(x, T, F, W.hi || '#ffffff', 1, 1, L * 0.9, 1, 1); seg(x, T, F, W.col, 1, 2, L * 0.55, 1, 1);
    dot(x, T, F, '#ffffff', L, 0); dot(x, T, F, '#ffffff', L * 0.5, 1); seg(x, T, F, W.hilt, 0, -2, 0, 2, 2);
  };
  WD.greatsword = function (x, wx, wy, a, len, sc, W, T) {
    const F = frame(wx, wy, a), L = len;
    blade(x, T, F, { L, hw: 2, body: W.col, edge: W.hi || '#ffffff', back: shade(W.col, 0.6), taper: 0.22, base: 1 });
    seg(x, T, F, shade(W.col, 0.55), 3, 0, L * 0.7, 0, 1);   // the fuller
    seg(x, T, F, W.hilt, 0, -5 * sc, 0, 5 * sc, 2); dot(x, T, F, W.hilt, 1, -5 * sc, 2); dot(x, T, F, W.hilt, 1, 5 * sc, 2);
    grip(x, T, F, 5 * sc, shade(W.hilt, 0.5), W.hilt);
  };

  // ---------- cleavers: the blade hangs to the front of a straight spine ----------
  const cleaver = notched => function (x, wx, wy, a, len, sc, W, T) {
    const F = frame(wx, wy, a), L = len * (notched ? 1.25 : 1.1), d = Math.round((notched ? 5 : 4) * sc);
    for (let v = 0; v <= d; v++) seg(x, T, F, v === d ? (W.hi || '#ffffff') : v === 0 ? shade(W.col, 0.6) : W.col, 2, v, L - (d - v) * 0.8, v, 1);
    dot(x, T, F, shade(W.col, 0.4), L - 4, 1);   // the hole near the tip
    if (notched) for (let u = 5; u < L - 3; u += 4) { dot(x, T, F, shade(W.col, 0.6), u, -1); dot(x, T, F, shade(W.col, 0.6), u + 1, -2); }   // a notched back, like a shark's
    seg(x, T, F, W.hilt, 0, 0, 2, 0, 2); grip(x, T, F, 3 * sc, shade(W.hilt, 0.7), W.hilt);
  };
  WD.cleaver = cleaver(false); WD.cleaver2 = cleaver(true);

  // ---------- poles ----------
  WD.staff = function (x, wx, wy, a, len, sc, W, T) {   // a shaft through the hand, a ringed head with two prongs
    const F = frame(wx, wy, a), L = len;
    seg(x, T, F, W.hilt, -L * 0.35, 0, L, 0, 2); seg(x, T, F, W.col, L * 0.2, 0, L, 0, 1);
    const c = F.P(L + 2, 0); T.disc(x, W.col, Math.round(c[0]), Math.round(c[1]), 3); T.disc(x, shade(W.hilt, 0.6), Math.round(c[0]), Math.round(c[1]), 1);
    seg(x, T, F, W.tip || '#ffffff', L + 3, -3, L + 6, -2, 1); seg(x, T, F, W.tip || '#ffffff', L + 3, 3, L + 6, 2, 1); dot(x, T, F, '#ffffff', L + 2, 0);
    dot(x, T, F, W.col, L * 0.55, 0, 2);
  };
  WD.spear = function (x, wx, wy, a, len, sc, W, T) {   // a long shaft, a leaf-shaped head, a red tassel
    const F = frame(wx, wy, a), L = len;
    seg(x, T, F, W.hilt, -L * 0.4, 0, L - 5, 0, 2); seg(x, T, F, W.col, -L * 0.3, 0, L - 5, 0, 1);
    blade(x, T, { P: (u, v) => F.P(u + L - 6, v) }, { L: 8, hw: 1, body: W.tip || '#e0e6f0', edge: '#ffffff', back: shade(W.tip || '#e0e6f0', 0.65), taper: 0.5 });
    seg(x, T, F, '#c1121f', L - 6, 1, L - 9, 3, 1); dot(x, T, F, '#c1121f', L - 7, 0, 2);
  };
  // a tapering curved blade drawn as short thick-to-thin strokes round an arc
  function arcBlade(x, T, cx, cy, r, a0, a1, w0, cols) {
    const n = 14;
    for (let pass = 0; pass < cols.length; pass++) for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n, t0 = a0 + (a1 - a0) * u0, t1 = a0 + (a1 - a0) * u1;
      if (pass && w0 * (1 - u0 * 0.85) - pass < 0.6) continue;
      const w = Math.max(1, Math.round(w0 * (1 - u0 * 0.85)) - pass), rr = r - pass * 0.8;
      T.pline(x, cols[pass], cx + Math.cos(t0) * rr, cy + Math.sin(t0) * rr, cx + Math.cos(t1) * rr, cy + Math.sin(t1) * rr, w);
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
    const r = 11 * sc, cx = ex - dx * r, cy = ey - dy * r;
    const base = Math.atan2(dy, dx), side = (px * -dy + py * dx) > 0 ? 1 : -1;   // which way round the arc turns toward the front
    arcBlade(x, T, cx, cy, r, base, base + side * 2.5, 5 * sc, ['#6a040f', '#d00000', '#ff6b6b']);
    const tipA = base + side * 2.5; T.rect(x, '#ffb3b3', cx + Math.cos(tipA) * r - 0.5, cy + Math.sin(tipA) * r - 0.5, 1, 1);
    T.rect(x, '#e5383b', ex + px * 3 * sc, ey + py * 3 * sc + 3 * sc, 1, 2);   // a drop of blood hanging from it
  };

  // ---------- the rest ----------
  WD.pipe = function (x, wx, wy, a, len, sc, W, T) {   // a length of pipe with a joint and a bent end
    const F = frame(wx, wy, a), L = len * 1.1;
    seg(x, T, F, W.col, -2, 0, L, 0, 2); seg(x, T, F, shade(W.col, 1.3), 0, -1, L, -1, 1);
    seg(x, T, F, W.hilt, L * 0.6, -1, L * 0.6, 1, 3); seg(x, T, F, W.col, L, 0, L + 1, 3, 2); dot(x, T, F, shade(W.col, 0.5), L + 1, 4, 2);
  };
  WD.baton = function (x, wx, wy, a, len, sc, W, T) {   // a shock baton: a dark shaft, a lit tip, a spark
    const F = frame(wx, wy, a), L = len * 1.1;
    seg(x, T, F, W.col, -2, 0, L - 3, 0, 2); seg(x, T, F, W.tip || '#6fd3e8', L - 3, 0, L, 0, 2); dot(x, T, F, '#ffffff', L + 1, 0); dot(x, T, F, W.tip || '#6fd3e8', L, 2); dot(x, T, F, W.tip || '#6fd3e8', L - 1, -2);
    seg(x, T, F, shade(W.col, 1.6), 1, -1, 1, 1, 1);
  };
  WD.club = function (x, wx, wy, a, len, sc, W, T) {   // thin at the grip, heavy at the end, studded
    const F = frame(wx, wy, a), L = len * 1.1;
    seg(x, T, F, W.hilt, -2, 0, L * 0.4, 0, 2); seg(x, T, F, W.col, L * 0.4, 0, L, 0, 4); seg(x, T, F, shade(W.col, 1.3), L * 0.4, -1, L, -1, 1);
    for (let u = L * 0.5; u < L; u += 3) { dot(x, T, F, W.tip || '#b8bcc8', u, 3); dot(x, T, F, W.tip || '#b8bcc8', u + 1, -3); }
    dot(x, T, F, W.tip || '#b8bcc8', L + 1, 0, 2);
  };
  WD.warfan = function (x, wx, wy, a, len, sc, W, T) {   // an open war fan: ribs from the hand, a bright rim
    const L = len * 1.05, n = 6, spread = 1.3, pts = [];
    for (let i = 0; i < n; i++) { const b = a - spread / 2 + spread * i / (n - 1), ex = wx + Math.sin(b) * L, ey = wy + Math.cos(b) * L; pts.push([ex, ey]); T.pline(x, i % 2 ? W.col : shade(W.col, 0.7), wx, wy, ex, ey, 2); }
    for (let i = 0; i < n - 1; i++) T.pline(x, W.hi || W.tip || '#ffffff', pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 1);
    T.rect(x, W.hilt, wx - sc, wy - sc, 2 * sc, 2 * sc);
  };
  WD.pistol = function (x, wx, wy, a, len, sc, W, T) {   // a barrel, a grip, a bright muzzle
    const F = frame(wx, wy, a), L = len * 1.3;
    seg(x, T, F, W.col, -1, 0, L, 0, 3); seg(x, T, F, shade(W.col, 1.5), 0, -1, L, -1, 1); seg(x, T, F, W.hilt, 0, 1, -2, 4, 2); dot(x, T, F, W.tip || '#8a92a8', L + 1, 0, 2); dot(x, T, F, shade(W.col, 0.5), 2, 2);
  };
  WD.longbow = function (x, wx, wy, a, len, sc, W, T) {   // a strung bow held upright: two curved limbs and the string
    const F = frame(wx, wy, a), L = len * 0.8, n = 6;
    for (let i = 0; i < n; i++) { const t0 = -1 + 2 * i / n, t1 = -1 + 2 * (i + 1) / n; seg(x, T, F, W.col, t0 * L, 4 * (1 - t0 * t0), t1 * L, 4 * (1 - t1 * t1), i === 2 || i === 3 ? 2 : 1); }
    seg(x, T, F, W.hi || '#ffd60a', -L, 0, L, 0, 1); dot(x, T, F, W.hilt, 0, 4, 2); dot(x, T, F, W.hi || '#ffd60a', -L, 0); dot(x, T, F, W.hi || '#ffd60a', L, 0);
  };
  WD.flask = function (x, wx, wy, a, len, sc, W, T) {   // a round flask: glowing liquid, a neck, a cork
    const F = frame(wx, wy, a), c = F.P(len * 0.9, 0);
    T.disc(x, shade(W.col, 0.6), Math.round(c[0]), Math.round(c[1]), 4); T.disc(x, W.col, Math.round(c[0]), Math.round(c[1]), 3); dot(x, T, F, W.tip || '#00f5d4', len * 0.9 + 1, 1, 2); dot(x, T, F, '#ffffff', len * 0.9 - 1, -1);
    seg(x, T, F, W.hilt, 0, 0, len * 0.4, 0, 2); dot(x, T, F, '#8a5a2a', -1, 0, 2);
  };
  WD.wrench = function (x, wx, wy, a, len, sc, W, T) {   // a heavy wrench: a shaft and an open jaw
    const F = frame(wx, wy, a), L = len * 1.15;
    seg(x, T, F, W.hilt, -2, 0, 2, 0, 3); seg(x, T, F, W.col, 2, 0, L, 0, 3); seg(x, T, F, shade(W.col, 1.3), 2, -1, L, -1, 1);
    seg(x, T, F, W.col, L, -2, L + 4, -3, 2); seg(x, T, F, W.col, L, 2, L + 4, 3, 2); dot(x, T, F, W.tip || '#06d6a0', L + 1, 0, 2);
  };
})();
