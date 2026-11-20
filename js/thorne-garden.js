'use strict';
// Shattered Worlds — Thorne's bone garden (the user, 2026-11-20: "Thorne's bone garden"). His story: keeper of the
// catacombs under Deepline, who "keeps them as a garden"; "a sword grown out of white bone, sharp spurs along his
// forearms"; "everything he needs, he already carries inside"; he trades cuttings with Ume; and "the Ossuary closes
// its ribs over everyone". So everything he grows is real bone: knuckled finger bones, a whip of vertebrae, saplings
// of bone with thorn branches and marrow showing in the cracks, briars, ribs that close like the fingers of two
// hands, and a great thorn-crowned skull. Ivory with cool maroon shadows and marrow red. Crisp pixel art through
// js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/kestra-fan.js.
//   J      his forearm spurs rake; the finisher's spikes are bone shoots
//   U      Finger Shards: three finger bones, knuckles and all, the broken end red
//   S+U    Spine Whip: linked vertebrae with a barbed blade at the tip
//   I      Bone Grove: bone saplings with thorn branches; the last one wears a crown
//   S+I    Marrow Lance: a lance grown from his forearm, marrow red in the blade
//   W+O    Ivory Thicket: hooked briars of bone
//   S+O    Hard Marrow: his forearm spurs lengthen      O  Ivory Form: thin ribs round his chest (small on purpose)
//   W+I    Ossuary: the floor grows a garden of bone, ribs close on the target; in the cinematic finish
//          (js/ult-cinema.js) a thorn-crowned skull opens its jaw beside the target, the great ribs snap shut on an
//          impact frame, and a flower of bone blades blooms on top
// SW.thorneGarden.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.finger_shards || !CASTS.spine_whip || !CASTS.bone_grove) return;
  const TG = SW.thorneGarden = { on: true };
  const isT = g => !!(TG.on && g && g.state && g.state.hero === 'thorne');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const fwd = d => (d > 0 ? 0 : PI);

  // outline, cool maroon shadow, shadowed bone, bone, light bone, ivory, white, marrow, bright marrow
  const PAL = ['#140e10', '#4a3540', '#8a7868', '#b8ac88', '#dcd4b0', '#f4f0dc', '#ffffff', '#8a1c2a', '#e0405a'];
  const C = { k: PAL[0], s0: PAL[1], s1: PAL[2], m: PAL[3], l: PAL[4], hi: PAL[5], w: PAL[6], mr: PAL[7], mh: PAL[8] };
  // a strip along a line of points, w0 half-wide at the start and w1 at the end
  function strip(c, pts, w0, w1, col) {
    const L = [], R = [], n = pts.length;
    for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = w0 + (w1 - w0) * i / (n - 1); L.push([pts[i][0] - dy / d * w, pts[i][1] + dx / d * w]); R.unshift([pts[i][0] + dy / d * w, pts[i][1] - dx / d * w]); }
    poly(c, L.concat(R), col);
  }
  const bez = (a, b, d, n) => { const o = []; for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; o.push([v * v * a[0] + 2 * v * u * b[0] + u * u * d[0], v * v * a[1] + 2 * v * u * b[1] + u * u * d[1]]); } return o; };
  const thorn = (c, x, y, ang, L, w, col) => poly(c, [[x - Math.sin(ang) * w, y + Math.cos(ang) * w], [x + Math.cos(ang) * L, y + Math.sin(ang) * L], [x + Math.sin(ang) * w, y - Math.cos(ang) * w]], col);

  // ================= a finger bone: three joints pointing +x, the broken end showing marrow =================
  function fingerVec(c, L) {
    let x = -L / 2; const h = L * 0.17;
    poly(c, [[x - L * 0.08, -h * 0.6], [x, -h], [x, h], [x - L * 0.08, h * 0.5], [x - L * 0.03, 0]], C.mr);
    [0.4, 0.33, 0.27].forEach((f, i) => {
      const l = L * f, hh = h * (1 - i * 0.18);
      if (i < 2) {
        poly(c, [[x, -hh], [x + l * 0.25, -hh * 0.55], [x + l * 0.75, -hh * 0.55], [x + l, -hh], [x + l, hh], [x + l * 0.75, hh * 0.55], [x + l * 0.25, hh * 0.55], [x, hh]], C.l);
        poly(c, [[x, 0.3], [x + l, 0.3], [x + l, hh], [x + l * 0.75, hh * 0.55], [x + l * 0.25, hh * 0.55], [x, hh]], C.m);
        poly(c, [[x + l * 0.15, -hh * 0.5], [x + l * 0.85, -hh * 0.5], [x + l * 0.85, -hh * 0.15], [x + l * 0.15, -hh * 0.15]], C.w);
      } else { poly(c, [[x, -hh], [x + l * 1.15, 0], [x, hh]], C.hi); poly(c, [[x, 0.3], [x + l * 1.15, 0], [x, hh]], C.m); }   // the last joint: a claw
      x += l;
    });
  }
  function finger(ctx, x, y, L, dir, tilt) { PX.sprite(ctx, x, y, L * 1.8, L * 1.2, c => { c.scale(dir, 1); c.rotate(tilt || 0); fingerVec(c, L); }, { pal: PAL }); }

  // ================= the spine whip: vertebrae along a line of points, a barbed blade at the end =================
  function whipVec(c, pts) {
    const n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const q = pts[i], nx = pts[i + 1], ang = Math.atan2(nx[1] - q[1], nx[0] - q[0]), s = 3.4 - i * 0.05;
      c.save(); c.translate(q[0], q[1]); c.rotate(ang);
      thorn(c, 0, -s * 0.5, -PI / 2 - 0.35, s * 1.9, s * 0.42, i % 2 ? C.l : C.hi);   // the spine's spur, raked back
      thorn(c, 0, s * 0.5, PI / 2 + 0.35, s * 1.0, s * 0.35, C.m);
      poly(c, [[-s * 0.9, -s * 0.75], [s * 0.7, -s * 0.6], [s * 0.9, 0], [s * 0.7, s * 0.6], [-s * 0.9, s * 0.75]], C.l);
      poly(c, [[-s * 0.9, 0.2], [s * 0.9, 0.2], [s * 0.7, s * 0.6], [-s * 0.9, s * 0.75]], C.m);
      poly(c, [[-s * 0.6, -s * 0.6], [s * 0.5, -s * 0.5], [s * 0.5, -s * 0.2], [-s * 0.6, -s * 0.25]], C.w);
      poly(c, [[s * 0.9, -s * 0.4], [s * 1.4, -s * 0.3], [s * 1.4, s * 0.3], [s * 0.9, s * 0.4]], C.s0);   // the disc between
      c.restore();
    }
    const e = pts[n - 1], b = pts[Math.max(0, n - 2)], ang = Math.atan2(e[1] - b[1], e[0] - b[0]);
    c.save(); c.translate(e[0], e[1]); c.rotate(ang);
    poly(c, [[-2, -2.5], [4, -5.5], [15, 0], [4, 5.5], [-2, 2.5]], C.hi); poly(c, [[-2, 0.3], [15, 0], [4, 5.5], [-2, 2.5]], C.m);
    poly(c, [[1, 0], [5, -1.6], [11, 0], [5, 1.6]], C.mr);
    thorn(c, 3, -4.5, PI + 0.7, 7, 1.6, C.l); thorn(c, 3, 4.5, PI - 0.7, 7, 1.6, C.m);   // barbs
    c.restore();
  }
  function whip(ctx, px, py, dir, reach, t, out) {
    PX.sprite(ctx, px + dir * reach / 2, py, reach + 60, 70, c => {
      c.scale(dir, 1); c.translate(-reach / 2, 0);
      const n = Math.max(2, Math.round(reach / 7.5)), pts = [];
      for (let i = 0; i <= n; i++) { const x = 6 + (reach - 14) * i / n, u = i / n; pts.push([x, Math.sin(i * 0.8 + t * 0.6) * 2.5 * u - Math.sin(u * PI) * (out ? 7 : -4)]); }
      whipVec(c, pts);
    }, { pal: PAL });
  }

  // ================= what grows out of the floor: (0, 0) the ground, up is -y =================
  function saplingVec(c, h, w, seed, crown) {
    const lean = (rnd(seed, 1) - 0.5) * h * 0.22, top = [lean, -h], pts = bez([0, 0], [lean * 0.2 + (rnd(seed, 2) - 0.5) * w * 1.4, -h * 0.5], top, 8);
    for (const d of [-1, 1]) { thorn(c, d * w * 0.45, 0, -PI / 2 + d * 1.0, w * 1.2, w * 0.36, C.m); thorn(c, d * w * 0.9, 0, -PI / 2 + d * 1.25, w * 0.8, w * 0.3, C.s1); }   // the floor breaks round it
    [[3, -1], [5, 1], [6, -1], [2, 1]].forEach((b, j) => { const q = pts[b[0]]; thorn(c, q[0], q[1], -PI / 2 + b[1] * (0.85 + rnd(seed, 5 + j) * 0.3), h * (0.26 - j * 0.03), w * 0.2, j % 2 ? C.l : C.hi); });   // thorn branches
    strip(c, pts, w * 0.5, 0.5, C.l);
    strip(c, pts.map(q => [q[0] + w * 0.2, q[1]]), w * 0.26, 0.2, C.m);
    strip(c, pts.map(q => [q[0] - w * 0.2, q[1]]), w * 0.12, 0.2, C.w);
    thorn(c, top[0], top[1] + 3, -PI / 2 + lean / h, h * 0.2, w * 0.2, C.hi);   // a sharp tip
    [2, 4, 6].forEach(i => { const q = pts[i], ww = w * 0.5 * (1 - i / 8) + 1.3; poly(c, [[q[0] - ww, q[1] - 1], [q[0] + ww, q[1] - 1], [q[0] + ww, q[1] + 1], [q[0] - ww, q[1] + 1]], C.s1); });   // joints, like knuckles
    poly(c, [[-w * 0.14, -h * 0.1], [w * 0.12, -h * 0.2], [w * 0.0, -h * 0.34], [-w * 0.04, -h * 0.2]], C.mr);   // marrow showing in a crack
    if (crown) { for (let i = 0; i < 5; i++) thorn(c, top[0], top[1] + h * 0.14, -PI / 2 + (i - 2) * 0.55, h * 0.3, w * 0.24, i % 2 ? C.l : C.hi); ell(c, top[0], top[1] + h * 0.14, w * 0.3, w * 0.3, C.mh); }
  }
  function briarVec(c, h, seed) {
    const d = rnd(seed, 3) < 0.5 ? -1 : 1, pts = bez([0, 0], [d * h * 0.55, -h * 0.75], [-d * h * 0.2, -h], 8);
    for (const e of [-1, 1]) thorn(c, e * 3, 0, -PI / 2 + e * 1.1, 6, 2, C.m);
    pts.forEach((q, i) => { if (i === 0 || i === 8) return; const nx = pts[i + 1], ang = Math.atan2(nx[1] - q[1], nx[0] - q[0]), sd = i % 2 ? 1 : -1; thorn(c, q[0], q[1], ang + sd * 1.9, h * 0.26, 1.5, i % 2 ? C.hi : C.l); });   // thorns hooked back down the stem
    strip(c, pts, 2.6, 0.6, C.l); strip(c, pts.map(q => [q[0] + 0.9, q[1] + 0.5]), 1.1, 0.2, C.m);
    const e = pts[8], b = pts[7]; thorn(c, e[0], e[1], Math.atan2(e[1] - b[1], e[0] - b[0]), h * 0.3, 2.2, C.hi);
    poly(c, [[-1, -h * 0.12], [1.4, -h * 0.2], [0, -h * 0.3]], C.mr);
  }
  // it is already 70% up on the frame it hits (hit-stop holds that frame), full two frames later, and sinks at the end
  function grow(ctx, sx, sy, t, delay, total, draw, h, wide) {
    if (t < delay * 0.4) { PX.sprite(ctx, sx, sy - 3, 26, 12, c => { for (let i = -1; i <= 1; i++) thorn(c, i * 5, 4, -PI / 2 + i * 0.5, 4 + (i ? 0 : 2), 1.6, i ? C.m : C.l); }, { pal: PAL, alpha: 0.8 }); return; }
    const k = t - delay, g = k < 0 ? 0.7 * ease((t - delay * 0.4) / Math.max(0.01, delay * 0.6)) : Math.min(1, 0.7 + 0.15 * (k + 1)), out = total - delay, fade = k > out - 8 ? Math.max(0, (out - k) / 8) : 1;
    if (fade <= 0) return;
    PX.sprite(ctx, sx, sy - h / 2, wide, h + 30, c => { c.translate(0, h / 2); c.scale(1, Math.max(0.05, g * (0.25 + 0.75 * fade))); draw(c); }, { pal: PAL, alpha: Math.min(1, fade * 2.5) });
  }

  // ================= ribs that close like the fingers of two hands: (0, 0) the ground between them =================
  function ribsVec(c, hgt, close, n) {
    for (let i = n - 1; i >= 0; i--) for (const d of [-1, 1]) {
      const bx = d * hgt * (0.2 + i * 0.13), H = hgt * (0.62 + 0.38 * i / Math.max(1, n - 1));
      const tip = [d * ((1 - close) * (Math.abs(bx) + hgt * 0.2) - close * (hgt * 0.05 + i * 1.5)), -H * (1 - 0.14 * close)];
      const pts = bez([bx, 0], [bx + d * hgt * (0.3 - 0.08 * close), -H * 0.8], tip, 10);
      strip(c, pts, hgt * 0.05 + 1.2, 0.5, i % 2 ? C.l : C.hi);
      strip(c, pts.map(q => [q[0] - d * 1.3, q[1] + 0.8]), hgt * 0.022 + 0.5, 0.2, C.s1);
      thorn(c, bx, 0, -PI / 2 + d * 1.2, hgt * 0.1, 2, C.m);
    }
  }
  function ribs(ctx, x, y, hgt, close, n, a, mono) { if (hgt < 3 || a <= 0) return; PX.sprite(ctx, x, y - hgt / 2, hgt * 2.3 + 10, hgt + 24, c => { c.translate(0, hgt / 2); ribsVec(c, hgt, close, n); }, { pal: PAL, alpha: a, mono }); }

  // ================= the skull, crowned with thorns: (0, 0) the middle of the cranium, facing +x, s its length =================
  function skullVec(c, s, o) {
    const jaw = clamp01(o.jaw || 0), S = (pts, col) => poly(c, pts.map(q => [q[0] * s, q[1] * s]), col), hx = -0.12, hy = 0.22, ca = Math.cos(jaw * 0.55), sa = Math.sin(jaw * 0.55);
    const J = (x, y) => [hx + x * ca - y * sa, hy + x * sa + y * ca];
    for (let i = 0; i < 6; i++) thorn(c, s * (-0.05 - i * 0.08), s * (-0.4 + i * 0.05), PI + 0.75 - i * 0.2, s * (0.62 - i * 0.05), s * 0.06, i % 2 ? C.m : C.l);   // the crown
    if (jaw > 0.05) { S([[-0.1, 0.22], [0.58, 0.27], J(0.68, -0.02), J(0.06, -0.04)], C.k); S([[0.1, 0.27], [0.4, 0.28], J(0.3, -0.03)], C.mr); }   // the dark of the mouth, marrow at the back
    S([J(-0.04, -0.06), J(0.1, -0.06), J(0.14, 0.0), J(0.62, -0.04), J(0.7, 0.03), J(0.62, 0.12), J(0.1, 0.12), J(-0.02, 0.02)], C.m);   // the lower jaw
    S([J(0.14, 0.0), J(0.62, -0.04), J(0.7, 0.03), J(0.2, 0.04)], C.l);
    for (let j = 0; j < 6; j++) { const x = 0.22 + j * 0.075, f = j === 5 ? 0.11 : 0.07; S([J(x, -0.01), J(x + 0.055, -0.015), J(x + 0.027, -0.01 - f)], C.w); }
    S([[-0.5, -0.05], [-0.42, -0.32], [-0.15, -0.46], [0.2, -0.44], [0.42, -0.3], [0.5, -0.1], [0.48, 0.08], [0.3, 0.12], [0.1, 0.2], [-0.3, 0.22], [-0.46, 0.12]], C.l);   // the cranium
    S([[-0.42, -0.32], [-0.15, -0.46], [0.2, -0.44], [0.42, -0.3], [0.1, -0.35], [-0.2, -0.31]], C.hi);
    S([[-0.5, -0.05], [-0.46, 0.12], [-0.3, 0.22], [0.1, 0.2], [-0.1, 0.06]], C.m);
    S([[-0.4, 0.0], [-0.44, 0.12], [-0.3, 0.22], [-0.1, 0.21]], C.s1);
    S([[0.3, 0.1], [0.5, 0.08], [0.62, 0.15], [0.6, 0.28], [0.22, 0.28], [0.1, 0.2]], C.l);   // the upper jaw
    S([[0.22, 0.24], [0.6, 0.24], [0.6, 0.28], [0.22, 0.28]], C.m);
    for (let j = 0; j < 6; j++) { const x = 0.24 + j * 0.06, f = j === 5 ? 0.13 : j === 0 ? 0.06 : 0.085; S([[x, 0.28], [x + 0.05, 0.28], [x + 0.025, 0.28 + f]], C.w); }
    S([[-0.06, 0.1], [0.3, 0.13], [0.27, 0.2], [-0.06, 0.18]], C.hi);   // the cheekbone
    S([[0.1, -0.12], [0.46, -0.04], [0.42, 0.1], [0.18, 0.1]], C.k);   // the eye socket
    S([[0.2, -0.03], [0.41, 0.02], [0.26, 0.07]], o.glare ? C.mh : C.mr); if (o.glare) S([[0.25, 0.0], [0.36, 0.025], [0.28, 0.045]], C.w);
    S([[0.06, -0.22], [0.52, -0.12], [0.5, -0.03], [0.08, -0.11]], C.hi);   // the brow ridge, heavy
    S([[0.06, -0.14], [0.5, -0.05], [0.5, -0.03], [0.08, -0.11]], C.s1);
    S([[0.5, 0.0], [0.6, 0.14], [0.49, 0.15]], C.k);   // the nose
    S([[-0.12, -0.45], [-0.04, -0.3], [-0.1, -0.2], [-0.07, -0.3]], C.s1); S([[0.18, -0.44], [0.22, -0.34], [0.16, -0.28]], C.s1);   // cracks
  }
  function skull(ctx, x, y, s, dir, o) { o = o || {}; PX.sprite(ctx, x - dir * s * 0.2, y - s * 0.1, s * 2.7, s * 2.3, c => { c.translate(s * 0.2 * (dir < 0 ? -1 : 1), s * 0.1); c.scale(dir < 0 ? -1 : 1, 1); skullVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono }); }

  // ================= a flower of bone blades: (0, 0) its heart, r a petal's length, open 0-1 =================
  function flowerVec(c, r, open) {
    for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 7; i++) {
      const a = -PI / 2 + (i - 3) * (0.16 + (ring ? 0.3 : 0.44) * open) + (ring ? 0.2 : 0), L = r * (ring ? 0.7 : 1), w = r * 0.17, ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
      const Q = (u, off) => [ca * L * u + nx * off, sa * L * u + ny * off];
      poly(c, [Q(0, w * 0.4), Q(0.45, w), Q(1, 0), Q(0.45, -w), Q(0, -w * 0.4)], ring ? C.l : C.hi);
      poly(c, [Q(0, 0), Q(1, 0), Q(0.45, w), Q(0, w * 0.4)], ring ? C.s1 : C.m);
    }
    ell(c, 0, 0, r * 0.2, r * 0.2, C.mr); ell(c, 0, -r * 0.03, r * 0.11, r * 0.11, C.mh); ell(c, 0, -r * 0.05, r * 0.045, r * 0.045, C.w);
  }
  function flower(ctx, x, y, r, open, a) { if (a <= 0) return; PX.sprite(ctx, x, y - r * 0.3, r * 2.6, r * 2.3, c => { c.translate(0, r * 0.3); flowerVec(c, r, open); }, { pal: PAL, alpha: a }); }
  // the lance grown from his forearm: (0, 0) his hand, l long
  function lanceVec(c, l) {
    thorn(c, 2, -2, PI + 0.9, 9, 2, C.l); thorn(c, 2, 2, PI - 0.9, 9, 2, C.m);   // the spurs it grew from
    poly(c, [[0, -3], [l - 14, -2.4], [l - 14, 2.4], [0, 3]], C.l); poly(c, [[0, 0.4], [l - 14, 0.4], [l - 14, 2.4], [0, 3]], C.m); poly(c, [[2, -2.2], [l - 15, -1.8], [l - 15, -0.9], [2, -1.1]], C.w);
    for (let x = 6; x < l - 16; x += 7) poly(c, [[x, -3], [x + 1.6, -3], [x + 3.6, 3], [x + 2, 3]], C.s1);   // it grew in a twist
    poly(c, [[l - 17, -2.6], [l - 10, -7], [l + 4, 0], [l - 10, 7], [l - 17, 2.6]], C.hi); poly(c, [[l - 17, 0.4], [l + 4, 0], [l - 10, 7], [l - 17, 2.6]], C.m);
    poly(c, [[l - 14, 0], [l - 9, -2.4], [l + 1, 0], [l - 9, 2.4]], C.mr); poly(c, [[l - 11, 0], [l - 8, -1], [l - 2, 0], [l - 8, 1]], C.mh);
  }
  Object.assign(TG, { finger, whip, ribs, skull, flower, saplingVec, briarVec, grow, lanceVec, PAL });
  const splinters = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 4 === 0 ? '#8a1c2a' : i % 2 ? '#f4f0dc' : '#b8ac88', rand(-pw, pw), -rand(0.5, pw), 20, 2, 0.12); };

  // ================= S+U: Spine Whip =================
  const _sw = CASTS.spine_whip;
  CASTS.spine_whip = function (p, z) {
    const n0 = z.shots.length, r = _sw.apply(this, arguments);
    if (!isT(G)) return r;
    const dir = p.face, v = z.shots.slice(n0).find(s => s.life === 22 && s.render);
    if (v) v.render = (ctx, x, y, t) => { const k = t < 10 ? t / 10 : 1 - (t - 10) / 12; whip(ctx, Math.round(p.x - G.cam.x), Math.round(p.y - G.cam.y - 22), dir, 14 + 96 * k, t, t < 10); };
    return r;
  };

  // ================= I: Bone Grove =================
  const _bg = CASTS.bone_grove;
  CASTS.bone_grove = function (p, z) {
    const n0 = z.shots.length, r = _bg.apply(this, arguments);
    if (!isT(G)) return r;
    z.shots.slice(n0).filter(s => s.render && s.life >= 34 && s.life <= 50).forEach(s => {
      const delay = s.life - 30, big = delay >= 20, h = big ? 70 : 48, w = big ? 15 : 10, seed = Math.round(s.x);
      s.tg = 1; s.render = (ctx, sx, sy, t) => grow(ctx, sx, sy, t, delay, delay + 30, c => saplingVec(c, h, w, seed, big), h, w * 6 + h * 0.7);
    });
    return r;
  };

  // ================= S+I: Marrow Lance =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.thorne;
  if (BU && BU.cast) {
    const _ml = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ml.apply(this, arguments);
      if (!isT(G)) return r;
      const v = z.shots.slice(n0).find(s => s.life === 26 && s.render);
      if (v) v.render = (ctx, x, y, t) => {
        const d = p.face, px = Math.round(p.x - G.cam.x), py = Math.round(p.y - G.cam.y) - 18, l = Math.min(58, 10 + t * 9);
        if (t >= 6) PX.lines(ctx, px - d * 6, py, fwd(-d), 46, 5, t, '#f4f0dc', 26);
        PX.sprite(ctx, px + d * (6 + l / 2), py, l + 40, 34, c => { c.scale(d, 1); c.translate(-l / 2, 0); lanceVec(c, l); }, { pal: PAL, alpha: t > 22 ? (26 - t) / 4 : 1 });
      };
      return r;
    };
  }

  // ================= W+O: Ivory Thicket =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.thorne;
  if (SIG && SIG.cast) {
    const _it = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _it.apply(this, arguments);
      if (!isT(G)) return r;
      z.shots.slice(n0).filter(s => s.paint && s.life >= 28).forEach(s => { const delay = s.life - 24, seed = Math.round(s.x * 3 + delay); s.tg = 1; s.paint = (ctx, sx, sy, q) => grow(ctx, sx, sy, q.t, delay, delay + 24, c => briarVec(c, 34, seed), 34, 64); });
      return r;
    };
  }

  // ================= J finisher: bone shoots =================
  const FINS = SW.clanmelee && SW.clanmelee.FIN;
  if (FINS && FINS.thorne) {
    const _tf = FINS.thorne;
    FINS.thorne = function (p, z) {
      const n0 = z.shots.length, r = _tf.apply(this, arguments);
      if (!isT(G)) return r;
      z.shots.slice(n0).filter(s => s.paint && s.life >= 20).forEach(s => { const delay = s.life - 18, seed = Math.round(s.x); s.tg = 1; s.paint = (ctx, sx, sy, q) => grow(ctx, sx, sy, q.t, delay, delay + 16, c => saplingVec(c, 30, 7, seed, false), 30, 60); });
      return r;
    };
  }

  // ================= J: his spurs rake; the small auras =================
  const RAKE = ['#4a3540', '#b8ac88', '#ffffff'];
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 9) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.55 : 22, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), up = a.anim === 'launcher';
        PX.claws(ctx, sx + d * (reach + 2), hy, up ? (d > 0 ? -0.9 : PI + 0.9) : (d > 0 ? 0.5 : PI - 0.5), big ? 34 : 22, k / 9, RAKE, 3);
        if (k === 0) splinters(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 6 : 3, 2);
      }
    }
    if (front && p.modeT > 0) {   // Hard Marrow: the spurs on his forearm lengthen (small)
      const fade = Math.min(1, p.modeT / 30);
      PX.sprite(ctx, sx + d * 6, sy - 26, 24, 20, c => { c.scale(d, 1); for (let i = 0; i < 3; i++) thorn(c, -3 + i * 3.2, 3, -PI / 2 - 0.55, 7.5 - i * 1.2, 1.5, i % 2 ? C.l : C.hi); }, { pal: PAL, alpha: fade });
    }
    if (front && p.awakeT > 0) {   // Ivory Form: thin ribs round his chest (small)
      const fade = Math.min(1, p.awakeT / 30) * 0.9;
      PX.sprite(ctx, sx, sy - 23, 26, 22, c => { for (let i = 0; i < 3; i++) for (const e of [-1, 1]) strip(c, bez([e * 7, -5 + i * 4.5], [e * 8, -1 + i * 4.5], [e * 1.5, 0.5 + i * 4.5], 5), 0.9, 0.5, i % 2 ? C.l : C.hi); }, { pal: PAL, alpha: fade });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isT(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };

  // ================= his leftover shots: the finger bones, and the Ossuary's garden and ribs =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.tg) return;
      if (s instanceof Proj && s.w === 10 && s.h === 6 && s.render && !s.status) { s.tg = 1; s.render = (ctx, x, y, q) => finger(ctx, x, y, 20, q.vx >= 0 ? 1 : -1, SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)), -1, 1)); return; }
      if (p.state !== 'ult' || !s.render || s.vx !== undefined) return;
      if (s.life === 32 && p.st >= 10 && p.st <= 52) {   // the garden comes up
        const seed = Math.round(s.x), h = 46 + (seed % 3) * 12, w = 9 + (seed % 2) * 3, crown = seed % 4 === 0;
        s.tg = 1; s._ugS = 1; s.render = (ctx, sx, sy, t) => grow(ctx, sx, sy, t, 2, 32, c => saplingVec(c, h, w, seed, crown), h, w * 6 + h * 0.7);
      } else if (s.life === 18 && p.st >= 54 && p.st <= 58) {   // the ribs close
        s.tg = 1; s._ugS = 1; s.render = (ctx, sx, sy, t) => ribs(ctx, sx, sy, 58 * ease((t + 2) / 5), ease(t / 8), 4, t > 13 ? (18 - t) / 5 : 1);
      }
    });
  }
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isT(g || this.G) || !z || !z.shots) return r;
    dress(this, z);
    if (!this.dead && this.awakeT > a0 + 60) splinters(this.x, this.y - 24, 14, 2.6);   // Ivory Form begins (small and short)
    return r;
  };

  // ================= W+I: Ossuary's finish =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isT(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('thorne') >= 0) finale(p, z, T);
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100)
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1, HG = 62;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const cy = sy - 20;
      if (st < FIN) {   // the skull beside them opens its jaw; the great ribs come up and lean in, then draw back
        const k = ease((st - 74) / 8), close = st < FIN - 6 ? 0.6 * ease((st - 78) / 14) : 0.6 - 0.28 * ease((st - (FIN - 6)) / 5), sh = st > 86 ? Math.sin(st * 2.3) * 1.2 : 0;
        ribs(ctx, sx, sy + 2, HG * ease((st - 74) / 9), close, 4, 1);
        skull(ctx, sx - dir * 80 + sh, cy - 10, 46, dir, { jaw: st > 82 ? 0.65 + 0.35 * Math.sin(st * 0.6) : 0.08, glare: st > 82, a: k });
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, mono = ik < 0.5 ? '#ffffff' : undefined;
        PX.impact(ctx, sx, cy, ik, 53);
        ribs(ctx, sx, sy + 2, HG, 1, 4, 1 - ease((k - 0.65) / 0.35), mono);   // they snap shut
        skull(ctx, sx - dir * 80, cy - 10, 46, dir, { jaw: 1, glare: true, mono, a: 1 - ease((k - 0.4) / 0.6) });
        if (ik >= 0.5) flower(ctx, sx, sy - HG * 0.86, 22, ease((ik - 0.5) / 1.6), 1 - ease((k - 0.75) / 0.25));   // and a flower of bone opens on top
        if (st === FIN) splinters(T.x, T.y - 16, 26, 4.5);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
