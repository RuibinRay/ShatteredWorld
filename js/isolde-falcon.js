'use strict';
// Shattered Worlds — Isolde's ice falcon (the user, 2026-11-20: "now isolde", after the plan's entry: her story is "a small
// bird of glittering ice perched on her hand"). Every move is the falcon: drawn as a vector bird and turned into crisp
// pixel art by js/pixel-kit.js (no blur, a hue-shifted ice palette, a selective outline). Its wings flap from a clear
// wrist joint, and the body bobs with the beat (pixel animation practice: key the extremes, mark the joints, bob last).
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/hollis-beasts.js; only wraps.
//   U      Ice Shards: three feathers of ice, flicked off the falcon's wings as it flares from her hand
//   S+U    Frost Nova: the falcon circles her once and a ring of ice feathers fans out
//   I      Ice Bird: the falcon itself, hunting: it flaps, banks toward each target and stoops on it
//   S+I    Eyrie Spire: the falcon swoops in and lands on top of the spire, wings flared, as it throws the foe up
//   W+O    Falcon Dive: a big falcon stoops from the sky with its wings folded and flares them on impact
//   S+O    Whiteout: snow blows sideways round her and the falcon rides her shoulder
//   O      Glacier Form: a great ice raptor lands behind her and stays perched, wings half open
//   W+I    Absolute Zero: the falcon spreads its wings over the whole arena and screams; in the cinematic finish
//          (js/ult-cinema.js) its head and eye fill the view, then it stoops through the target on the blow
// SW.isoldeFalcon.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !CASTS.ice_bird || !CASTS.ice_shard) return;
  const IF = SW.isoldeFalcon = { on: true };
  const isI = g => !!(IF.on && g && g.state && g.state.hero === 'isolde');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // the ice palette: navy-violet shadows up to warm-white light, a gold eye
  const PAL = ['#141a3a', '#23366a', '#3a62a0', '#5f9ad0', '#93cdef', '#c8ecff', '#f4fbff', '#ffd24a', '#a86a10'];
  const C = { d0: PAL[0], d1: PAL[1], m: PAL[2], l: PAL[3], l2: PAL[4], hi: PAL[5], w: PAL[6], eye: PAL[7], eyeD: PAL[8] };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, r, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), r || 0, 0, PI * 2); c.fillStyle = col; c.fill(); };

  // one wing, from the shoulder (sx, sy): a = flap (-1 down .. 1 up), fold 0-1, far (behind the body), L the wing length.
  // The wing has a chord (its width front to back), so a level wing still shows its surface: seen a little from above, the
  // near wing's surface hangs below the body line and the far wing's peeks above it.
  function wing(c, sx, sy, a, fold, far, L) {
    const up = (a > 0 ? a : a * 0.55) * (1 - fold), au = Math.abs(up);
    const wx = sx - L * (0.28 + 0.3 * fold), wy = sy - L * 0.5 * up;                                    // the wrist joint
    const tx = wx - L * (0.6 - 0.25 * fold) + L * 0.1 * Math.max(0, up) + L * 0.38 * Math.max(0, -up), ty = wy - L * 0.42 * up + L * 0.04 * fold;   // the tip: lags on the way up, sweeps forward on the downstroke
    const cs = far ? -0.55 : 1, cx = -L * (0.1 + 0.14 * au), cy = L * 0.24 * (1 - au) * cs * (1 - fold) + L * 0.06 * fold;   // the chord
    const col = far ? C.m : C.l2, col2 = far ? C.d1 : C.l, col3 = far ? C.d1 : C.m;
    const S = [sx + L * 0.06, sy], W = [wx, wy], T = [tx, ty], T2 = [tx + cx * 0.2, ty + cy * 0.2], W2 = [wx + cx * 0.85, wy + cy * 0.85], S2 = [sx + cx, sy + cy];
    poly(c, [S, W, T, T2, W2, S2], col2);                                                                 // the whole wing
    poly(c, [S, W, [wx + cx * 0.45, wy + cy * 0.45], [sx + cx * 0.5, sy + cy * 0.5]], col);               // the coverts, lighter
    for (let i = 0; i < 4; i++) {                                                                         // the primaries: fingers at the tip
      const f = i / 4, px = T[0] + (W2[0] - T[0]) * f * 0.7, py = T[1] + (W2[1] - T[1]) * f * 0.7;
      poly(c, [[px, py], [px - L * 0.09, py + L * 0.02 + cy * 0.08], [px + L * 0.03, py + L * 0.05 + cy * 0.1]], col3);
    }
    if (!far) { c.strokeStyle = C.w; c.lineWidth = Math.max(1, L * 0.05); c.beginPath(); c.moveTo(S[0], S[1]); c.lineTo(W[0], W[1]); c.stroke(); }   // the bright leading edge
  }
  // the falcon: (0, 0) the body, facing +x, s the body length (beak to tail). o = { flap 0-1 phase, fold, flare, perch, scream }
  function head(c, s, hx, hy, o) {   // the dark cap and moustache stripe of a falcon, gold eye-ring, hooked beak
    ell(c, hx, hy, s * 0.14, s * 0.125, 0, C.hi);
    poly(c, [[hx - s * 0.13, hy], [hx - s * 0.02, hy - s * 0.13], [hx + s * 0.12, hy - s * 0.07], [hx + s * 0.04, hy - s * 0.03]], C.d1);   // cap
    poly(c, [[hx + s * 0.02, hy - s * 0.01], [hx + s * 0.07, hy + s * 0.02], [hx + s * 0.03, hy + s * 0.13], [hx - s * 0.02, hy + s * 0.06]], C.d1);   // the moustache stripe
    ell(c, hx + s * 0.055, hy - s * 0.03, s * 0.045, s * 0.04, 0, C.eye);
    ell(c, hx + s * 0.06, hy - s * 0.03, s * 0.026, s * 0.026, 0, C.d0);
    const bo = o.scream ? s * 0.05 : 0;
    poly(c, [[hx + s * 0.1, hy - s * 0.05], [hx + s * 0.22, hy - s * 0.015], [hx + s * 0.19, hy + s * 0.035], [hx + s * 0.11, hy + s * 0.015]], C.eye);
    poly(c, [[hx + s * 0.18, hy - s * 0.01], [hx + s * 0.22, hy - s * 0.015], [hx + s * 0.2, hy + s * 0.06]], C.eyeD);   // the hook
    if (bo) poly(c, [[hx + s * 0.11, hy + s * 0.025], [hx + s * 0.19, hy + s * 0.04 + bo], [hx + s * 0.11, hy + s * 0.05 + bo]], C.eyeD);   // the open lower beak
  }
  function falconVec(c, s, o) {
    if (o.perch) return perched(c, s, o);
    const ph = (o.flap || 0) * PI * 2, a = o.flare ? 0.95 : Math.sin(ph), fold = o.fold || 0;
    const L = s * (0.95 - 0.2 * fold);
    if (!fold) wing(c, s * 0.06, -s * 0.07, a, 0, true, L * 0.92);
    // tail fan
    const tf = o.flare ? s * 0.06 : 0;
    poly(c, [[-s * 0.24, -s * 0.04], [-s * 0.6, -s * 0.07 - tf], [-s * 0.63, s * 0.02], [-s * 0.58, s * 0.1 + tf], [-s * 0.24, s * 0.06]], C.m);
    poly(c, [[-s * 0.42, -s * 0.03], [-s * 0.61, -s * 0.05 - tf], [-s * 0.62, 0]], C.d1);
    // body: a teardrop, lit from above, cool shadow underneath
    ell(c, 0, 0, s * 0.34, s * 0.14, -0.06, C.l);
    ell(c, s * 0.04, -s * 0.05, s * 0.26, s * 0.06, -0.06, C.hi);
    ell(c, -s * 0.02, s * 0.08, s * 0.24, s * 0.05, -0.04, C.m);
    c.fillStyle = C.m; for (let i = 0; i < 3; i++) c.fillRect(Math.round(s * (0.1 - i * 0.09)), Math.round(s * 0.04), Math.max(1, Math.round(s * 0.04)), Math.max(1, Math.round(s * 0.02)));   // barring
    head(c, s, s * 0.34, -s * 0.09 - (o.scream ? s * 0.03 : 0), o);
    if (fold) {   // stooping: the wings tucked along the back, their tips past the tail
      poly(c, [[s * 0.18, -s * 0.1], [-s * 0.2, -s * 0.16], [-s * 0.78, -s * 0.06], [-s * 0.3, s * 0.02], [s * 0.1, -s * 0.02]], C.l);
      poly(c, [[s * 0.18, -s * 0.1], [-s * 0.2, -s * 0.16], [-s * 0.3, -s * 0.1], [s * 0.1, -s * 0.06]], C.hi);
      c.fillStyle = C.m; for (let i = 0; i < 3; i++) c.fillRect(Math.round(-s * (0.36 + i * 0.12)), Math.round(-s * (0.11 - i * 0.02)), Math.max(1, Math.round(s * 0.08)), 1);
    } else wing(c, s * 0.04, -s * 0.08, o.flare ? 1 : a, 0, false, L);
  }
  // sitting upright: tail down, folded wing along the back, talons gripping
  function perched(c, s, o) {
    const half = o.flap ? Math.max(0, o.flap) : 0;   // wings half open (Glacier Form)
    if (half > 0.05) { c.save(); c.translate(-s * 0.04, -s * 0.18); c.rotate(-0.9); wing(c, 0, 0, 0.9, 0, true, s * 0.8 * half + s * 0.2); c.restore(); }
    poly(c, [[-s * 0.02, s * 0.26], [-s * 0.14, s * 0.62], [s * 0.04, s * 0.62], [s * 0.08, s * 0.26]], C.m);   // tail
    ell(c, 0, 0, s * 0.16, s * 0.3, -0.25, C.l);
    ell(c, s * 0.05, -s * 0.02, s * 0.08, s * 0.22, -0.25, C.hi);
    c.fillStyle = C.m; for (let i = 0; i < 4; i++) c.fillRect(Math.round(s * 0.02), Math.round(s * (-0.06 + i * 0.07)), Math.max(1, Math.round(s * 0.07)), 1);   // barred breast
    poly(c, [[-s * 0.08, -s * 0.2], [s * 0.02, -s * 0.12], [-s * 0.02, s * 0.3], [-s * 0.1, s * 0.52], [-s * 0.18, s * 0.2]], C.l2);   // the folded wing
    c.fillStyle = C.eye; c.fillRect(Math.round(-s * 0.04), Math.round(s * 0.26), Math.max(1, Math.round(s * 0.05)), Math.round(s * 0.1)); c.fillRect(Math.round(s * 0.04), Math.round(s * 0.26), Math.max(1, Math.round(s * 0.05)), Math.round(s * 0.1));
    c.fillStyle = C.d0; c.fillRect(Math.round(-s * 0.08), Math.round(s * 0.35), Math.round(s * 0.22), Math.max(1, Math.round(s * 0.04)));   // talons
    head(c, s, s * 0.06, -s * 0.32, o);
    if (half > 0.05) { c.save(); c.translate(-s * 0.02, -s * 0.18); c.rotate(-0.7); wing(c, 0, 0, 0.9, 0, false, s * 0.8 * half + s * 0.2); c.restore(); }
  }
  // the falcon as a crisp sprite at (x, y), facing dir, s px long; rot tilts it (radians, + = nose down)
  function falcon(ctx, x, y, s, dir, o) {
    o = o || {};
    const bob = o.flare || o.fold || o.perch ? 0 : -Math.sin((o.flap || 0) * PI * 2) * s * 0.04;   // the body rises on the downstroke
    const box = s * 2.4;
    PX.sprite(ctx, x, y + bob, box, box, c => { c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); falconVec(c, s, o); }, { pal: PAL, alpha: o.a });
    if (o.glow) art.glow(ctx, Math.round(x), Math.round(y), Math.round(s * 0.5), '#7fd8ff', o.glow);
  }
  IF.falcon = falcon;
  // a feather of ice: a crisp sprite, pointing along (vx, vy)
  function feather(ctx, x, y, s, ang, a) {
    PX.sprite(ctx, x, y, s * 2.2, s * 2.2, c => {
      c.rotate(ang);
      poly(c, [[s * 0.9, 0], [s * 0.2, -s * 0.28], [-s * 0.6, -s * 0.18], [-s * 0.9, 0], [-s * 0.6, s * 0.2], [s * 0.2, s * 0.26]], C.l2);
      poly(c, [[s * 0.9, 0], [s * 0.1, -s * 0.12], [-s * 0.5, -s * 0.06], [-s * 0.5, 0.02]], C.w);
      c.fillStyle = C.m; c.fillRect(-s, -0.5, s * 1.8, 1);   // the quill
    }, { pal: PAL, alpha: a, keepThin: true });
  }
  IF.feather = feather;

  // ================= the great ice bird (Ice Bird, the I move) =================
  // A pheasant of living ice, much bigger than the falcon: a faceted crystal body, a crest of ice spikes, wings whose
  // feathers are separate icicles, and long tail plumes that stream and wave behind it. An original design.
  const CPAL = ['#0e1636', '#1d3a7a', '#2f66b4', '#4ea2e2', '#86d4f6', '#c6f2ff', '#ffffff', '#5ef0ff'];
  const K = { d0: CPAL[0], d1: CPAL[1], m: CPAL[2], l: CPAL[3], l2: CPAL[4], hi: CPAL[5], w: CPAL[6], cy: CPAL[7] };
  const tri = (c, p1, p2, p3, col) => poly(c, [p1, p2, p3], col);
  // an icicle feather from (x0, y0) toward angle ang, length L, half-width w
  function icicle(c, x0, y0, ang, L, w, col, edge) {
    const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa * w, ny = ca * w;
    poly(c, [[x0 + nx, y0 + ny], [x0 + ca * L, y0 + sa * L], [x0 - nx, y0 - ny]], col);
    if (edge) poly(c, [[x0 + nx * 0.2, y0 + ny * 0.2], [x0 + ca * L, y0 + sa * L], [x0 - nx * 0.6, y0 - ny * 0.6]], edge);
  }
  function crystalWing(c, s, sx, sy, a, far) {
    const up = a > 0 ? a : a * 0.55, au = Math.abs(up), L = s * 1.05;
    const wx = sx - L * 0.3, wy = sy - L * 0.5 * up, cyo = (far ? -0.5 : 1) * L * 0.2 * (1 - au);
    const base = far ? K.m : K.l2, edge = far ? K.l : K.hi, dark = far ? K.d1 : K.m;
    // the arm of the wing: two facets, light over dark
    poly(c, [[sx + L * 0.06, sy], [wx, wy], [wx - L * 0.06, wy + L * 0.12 + cyo * 0.6], [sx - L * 0.18, sy + cyo + L * 0.06]], dark);
    poly(c, [[sx + L * 0.06, sy], [wx, wy], [wx - L * 0.04, wy + L * 0.06], [sx - L * 0.08, sy + L * 0.03]], base);
    // the primaries: five long icicles fanned from the wrist; the secondaries: shorter ones along the arm
    // where the hand points: back, plus up or down with the beat; a level wing fans down (near) or up (far), so its
    // feathers never lie flat along the tail
    const dirA = Math.atan2(-(0.42 * up) - 0.02, -1) + (up < 0 ? -0.5 * up : 0) + (far ? 0.35 : -0.55) * (1 - au);
    for (let i = 0; i < 5; i++) { const ang = dirA + (i - 1) * 0.16 * (1 - 0.4 * au) + (far ? 0.05 : 0), len = L * (0.72 - i * 0.07); icicle(c, wx, wy, ang, len, L * 0.035, i % 2 ? base : dark, i % 2 ? null : edge); }
    for (let i = 0; i < 4; i++) { const u = 0.2 + i * 0.22, px = sx + (wx - sx) * u, py = sy + (wy - sy) * u + cyo * 0.5; icicle(c, px, py, dirA + 0.55 + i * 0.12, L * (0.32 - i * 0.03), L * 0.04, i % 2 ? dark : base, null); }
    if (!far) { c.strokeStyle = K.w; c.lineWidth = Math.max(1, L * 0.04); c.beginPath(); c.moveTo(sx + L * 0.06, sy); c.lineTo(wx, wy); c.stroke(); }
  }
  function iceBirdVec(c, s, o) {
    const t = o.t || 0, a = o.dive ? -0.2 : Math.sin((o.flap || 0) * PI * 2);
    // the long tail plumes, streaming and waving behind (under everything)
    for (let i = 0; i < 4; i++) {
      const len = s * (1.25 - i * 0.18), lift = (i - 1.2) * 0.1, pts = [];
      for (let k = 0; k <= 8; k++) { const u = k / 8, wv = Math.sin(t * 0.22 - u * 4 + i * 0.9) * s * 0.06 * u; pts.push([-s * 0.22 - u * len, s * 0.02 + lift * s * u + wv]); }
      const wd = s * (0.05 - i * 0.006), top = [], bot = [];
      pts.forEach((q, k) => { const ww = wd * (1 - (k / 8) * 0.75); top.push([q[0], q[1] - ww]); bot.unshift([q[0], q[1] + ww]); });
      poly(c, top.concat(bot), i % 2 ? K.m : K.l);
      poly(c, top.concat(pts.slice().reverse()), i % 2 ? K.l : K.l2);
      const e = pts[8]; icicle(c, e[0], e[1], PI + Math.sin(t * 0.22 - 4 + i * 0.9) * 0.3, s * 0.14, s * 0.03, K.hi, null);   // a shard at the tip
    }
    crystalWing(c, s, s * 0.04, -s * 0.06, o.dive ? -0.1 : a, true);
    // the body: a faceted crystal, lit from the top (bigger than a real bird's, so it holds its own against the wings)
    const Bf = [s * 0.32, -s * 0.04], Bt = [s * 0.04, -s * 0.2], Br = [-s * 0.3, -s * 0.02], Bb = [0, s * 0.15], Bc = [s * 0.02, -s * 0.03];
    tri(c, Bf, Bt, Bc, K.hi); tri(c, Bt, Br, Bc, K.l2); tri(c, Br, Bb, Bc, K.m); tri(c, Bb, Bf, Bc, K.l);
    tri(c, Bf, [s * 0.16, -s * 0.13], Bc, K.w);
    // the neck joins body to head
    poly(c, [[s * 0.12, -s * 0.13], [s * 0.32, -s * 0.18], [s * 0.42, -s * 0.06], [s * 0.24, s * 0.03]], K.l);
    poly(c, [[s * 0.12, -s * 0.13], [s * 0.32, -s * 0.18], [s * 0.34, -s * 0.12], [s * 0.18, -s * 0.08]], K.hi);
    // the head: angular, a crest of ice spikes, a long sharp beak
    const scr = o.scream ? s * 0.05 : 0;
    poly(c, [[s * 0.24, -s * 0.06], [s * 0.3, -s * 0.15], [s * 0.4, -s * 0.2], [s * 0.5, -s * 0.17], [s * 0.44, -s * 0.05]], K.l2);
    tri(c, [s * 0.3, -s * 0.15], [s * 0.4, -s * 0.2], [s * 0.46, -s * 0.15], K.hi);
    tri(c, [s * 0.5, -s * 0.17], [s * 0.66, -s * 0.12 - scr * 0.4], [s * 0.5, -s * 0.12], K.w);   // upper beak
    tri(c, [s * 0.5, -s * 0.12], [s * 0.62, -s * 0.1 + scr], [s * 0.44, -s * 0.05], K.l);   // lower beak
    for (let i = 0; i < 3; i++) icicle(c, s * (0.38 - i * 0.04), -s * (0.2 - i * 0.02), PI + 0.55 + i * 0.12, s * (0.26 - i * 0.05), s * 0.025, i ? K.l2 : K.hi, null);   // the crest
    poly(c, [[s * 0.42, -s * 0.15], [s * 0.5, -s * 0.15], [s * 0.46, -s * 0.13]], K.d0);   // the eye socket
    c.fillStyle = K.w; c.fillRect(Math.round(s * 0.45), Math.round(-s * 0.15), Math.max(1, Math.round(s * 0.04)), 1);   // the glowing eye
    crystalWing(c, s, s * 0.02, -s * 0.08, o.dive ? -0.1 : a, false);
  }
  function iceBird(ctx, x, y, s, dir, o) {
    o = o || {};
    const bob = o.dive ? 0 : -Math.sin((o.flap || 0) * PI * 2) * s * 0.05;
    PX.sprite(ctx, x - dir * s * 0.35, y + bob, s * 3.6, s * 2.6, c => { c.translate(s * 0.35 * (dir < 0 ? -1 : 1), 0); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); iceBirdVec(c, s, o); }, { pal: CPAL, alpha: o.a === undefined ? 0.94 : o.a * 0.94 });
    if (o.t !== undefined && o.t % 6 < 2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; art.rect(ctx, '#ffffff', Math.round(x + dir * s * 0.1 + Math.sin(o.t) * s * 0.1), Math.round(y - s * 0.1 + bob), 1, 1); ctx.restore(); }   // a glint
  }
  IF.iceBird = iceBird;

  // ================= I: Ice Bird: the great ice bird hunting =================
  const _ib = CASTS.ice_bird;
  CASTS.ice_bird = function (p, z) {
    const n0 = z.shots.length, r = _ib.apply(this, arguments);
    if (!isI(G)) return r;
    const b = z.shots.slice(n0).find(s => SW.Bird && s instanceof SW.Bird); if (!b) return r;
    let seen = 0, strike = 0;
    const think0 = b.think, x0 = b.x, y0 = b.y;
    // it forms out of ice in front of her: shards fly together
    for (let i = 0; i < 14; i++) { const a2 = i / 14 * PI * 2; part(x0 + Math.cos(a2) * 40, y0 + Math.sin(a2) * 26, i % 2 ? '#c6f2ff' : '#ffffff', -Math.cos(a2) * 3, -Math.sin(a2) * 2, 12, 2); }
    b.think = function (g, zz) {
      think0.apply(this, arguments);
      if (this.hits > seen) {   // it strikes: a burst of ice shards and a frost ring
        seen = this.hits; strike = 10;
        for (let i = 0; i < 10; i++) { const a2 = rand(0, PI * 2); part(this.x, this.y, i % 3 ? '#c6f2ff' : '#ffffff', Math.cos(a2) * rand(1.5, 3.5), Math.sin(a2) * rand(1.5, 3.5) - 1, 18, 2, 0.12); }
        fx.ring(this.x, this.y, '#c6f2ff', 4, 30, 12);
      }
      if (strike > 0) strike--;
      if (this.t % 3 === 0) {   // the frozen wake: little crystals that hang in the air and fade
        const cx2 = this.x - this.vx * 3, cy2 = this.y - this.vy * 3 + rand(-4, 4);
        (zz || G.zone).shots.push(new Vis(cx2, cy2, 22, (ctx, sx, sy, t) => { const k = 1 - t / 22, w = Math.max(1, Math.round(3 * k)); ctx.save(); ctx.globalAlpha = k; art.rect(ctx, '#c6f2ff', sx - w, sy, w * 2 + 1, 1); art.rect(ctx, '#ffffff', sx, sy - w, 1, w * 2 + 1); ctx.restore(); }));
      }
      if (this.t % 2 === 0) part(this.x - this.vx * 6 + rand(-6, 6), this.y + rand(-2, 6), '#dff6ff', -this.vx * 0.1, 0.4, 20, 2, 0.02);   // cold mist
    };
    b.render = function (ctx, x, y) {
      const d = this.vx >= 0 ? 1 : -1, bank = SW.clamp(Math.atan2(this.vy, Math.abs(this.vx)), -0.6, 0.8);
      const form = Math.min(1, this.t / 6);   // materialising
      if (strike > 0) iceBird(ctx, x, y, 46, d, { dive: true, scream: true, rot: bank * 0.5 + 0.15, t: this.t, a: form });
      else iceBird(ctx, x, y, 46, d, { flap: (this.t % 20) / 20, rot: bank * 0.5, t: this.t, a: form, scream: this.t < 10 });
    };
    return r;
  };

  // ================= U: Ice Shards: feathers of ice =================
  const _is = CASTS.ice_shard;
  CASTS.ice_shard = function (p, z) {
    const n0 = z.shots.length, r = _is.apply(this, arguments);
    if (!isI(G)) return r;
    const dir = p.face, x0 = p.x + dir * 14, y0 = p.y - 26;
    z.shots.slice(n0).forEach(s => { if (s.render && s.vx) s.render = (ctx, x, y, q) => feather(ctx, x, y, 8, Math.atan2(q.vy, q.vx)); });
    z.shots.push(new Vis(x0, y0, 14, (ctx, sx, sy, t) => falcon(ctx, sx, sy - t * 0.6, 22, dir, { flare: true, a: 1 - ease((t - 8) / 6) })));   // the falcon flares off her hand
    return r;
  };

  // ================= S+U: Frost Nova: the falcon circles her once =================
  const _fn = CASTS.frost_nova;
  CASTS.frost_nova = function (p, z) {
    const r = _fn.apply(this, arguments);
    if (!isI(G)) return r;
    const dir = p.face;
    z.shots.push(new Vis(p.x, p.y - 20, 26, (ctx, sx, sy, t) => {
      const k = t / 26;
      for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2, R = 14 + ease(k * 1.4) * 46; feather(ctx, sx + Math.cos(a) * R, sy + Math.sin(a) * R * 0.6, 6, a, 1 - ease((k - 0.6) / 0.4)); }   // a ring of ice feathers fans out
      const a = -PI / 2 + k * PI * 2 * dir, fx2 = sx + Math.cos(a) * 34, fy2 = sy + Math.sin(a) * 22;
      falcon(ctx, fx2, fy2, 26, Math.sin(a) * -dir >= 0 ? 1 : -1, { flap: (t % 10) / 10, rot: 0.2, a: 1 - ease((k - 0.85) / 0.15) });
    }));
    return r;
  };

  // ================= S+I: Eyrie Spire: the falcon lands on top =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.isolde;
  if (BU && BU.cast) {
    const _es = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _es.apply(this, arguments);
      if (!isI(G)) return r;
      const pil = z.shots.slice(n0).find(s => s.render || s.paint); if (!pil) return r;
      const dir = p.face, x = pil.x, gy = pil.y;
      z.shots.push(new Vis(x, gy, 46, (ctx, sx, sy, t) => {
        // it swoops in from behind her and lands on the tip (92 px up) as the spire comes up (frame 10)
        const k = ease(t / 12), top = sy - 92;
        if (t < 12) falcon(ctx, sx - dir * (90 - 90 * k), top - 40 + 30 * k, 30, dir, { flap: (t % 8) / 8, rot: 0.25 });
        else falcon(ctx, sx, top - 12, 30, dir, { perch: true, flap: t < 22 ? 1 : 0, scream: t >= 12 && t < 20, a: 1 - ease((t - 38) / 8) });
      }));
      return r;
    };
  }

  // ================= W+O: Falcon Dive: a stoop from the sky =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.isolde;
  if (SIG && SIG.cast) {
    const _fd = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _fd.apply(this, arguments);
      if (!isI(G)) return r;
      const s = z.shots.slice(n0).find(q => q.paint); if (!s) return r;
      s.paint = (ctx, x, y, q) => {
        const d = Math.sign(q.vx) || 1, ang = Math.atan2(q.vy, Math.abs(q.vx)), late = q.t > q.life - 6;
        if (q.t % 2 === 0) for (let i = 1; i < 4; i++) art.rect(ctx, C.w, Math.round(x - q.vx * i * 1.2), Math.round(y - q.vy * i * 1.2), 1, 1);   // the speed lines
        falcon(ctx, x, y, 46, d, late ? { flare: true, scream: true, rot: 0.1 } : { fold: 1, rot: ang, glow: 0.1 });
      };
      return r;
    };
  }

  // ================= S+O and O: Whiteout and Glacier Form =================
  function aura(ctx, p, sx, sy, front) {
    const top = sy - (p.h || 34), d = p.face;
    if (p.modeT > 0) {
      const fade = Math.min(1, p.modeT / 30);
      if (front) {   // snow blowing sideways
        ctx.save(); ctx.globalAlpha *= 0.85 * fade; ctx.fillStyle = '#f4fbff';
        for (let i = 0; i < 10; i++) { const u = ((p.t * (2 + (i % 3)) + i * 37) % 90) / 90; ctx.fillRect(Math.round(sx + 40 - u * 80), Math.round(sy - 6 - ((i * 13) % 40) + Math.sin(p.t * 0.2 + i) * 2), 2, 1); }
        ctx.restore();
        if (!p.awakeT) falcon(ctx, sx - d * 5, top + 2, 16, d, { perch: true, a: fade });   // the falcon on her shoulder
      }
    }
    if (p.awakeT > 0 && !front) {   // the great raptor perched behind her, wings half open
      const fade = Math.min(1, p.awakeT / 30), breathe = Math.sin(p.t * 0.05) * 0.15;
      falcon(ctx, sx - d * 18, top - 6 + Math.round(breathe * 4), 44, d, { flap: (p.t % 240) < 16 ? 1 : 0, perch: true, scream: (p.t % 240) < 16, a: fade, glow: 0.08 });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isI(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isI(g || this.G) && z && z.shots && !this.dead && this.awakeT > a0 + 60) {   // Glacier Form: the raptor lands with its wings flared
      const d = this.face, x = this.x, y = this.y;
      const v = new Vis(x, y, 30, (ctx, sx, sy, t) => { const k = ease(t / 20); falcon(ctx, sx - d * (18 + 100 * (1 - k)), sy - 40 - 90 * (1 - k), 56, d, { flare: true, scream: t > 14, a: 1 - ease((t - 24) / 6) }); });
      z.shots.push(v);
      for (let i = 0; i < 16; i++) part(x + rand(-30, 30), y - rand(20, 70), i % 2 ? '#f4fbff' : '#93cdef', rand(-1, 1), rand(-0.5, 1), 26, 2);
    }
    return r;
  };

  // ================= W+I: Absolute Zero =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isI(g)) return r;
    if (p.st === 10) {
      const dir = p.face;
      const wide = new Vis(p.x, p.y, 40, (ctx, sx, sy, t) => {   // it spreads its wings over the whole arena and screams
        const k = ease(t / 10), a = 1 - ease((t - 30) / 10);
        falcon(ctx, sx - dir * 34, sy - 74 + 14 * (1 - k), 120, dir, { flare: true, scream: t > 6 && t < 24, a: a * 0.92, glow: 0.1 });   // behind her, wings over the arena
      });
      wide._ugS = 1; z.shots.push(wide);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('isolde') >= 0) finale(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100)
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 14) return;
      const cy = sy - 18;
      if (st < FIN - 6) {   // the head fills the view above the target: the eye opens, the beak screams
        const k = ease((st - 74) / 8);
        falcon(ctx, sx - dir * 86, cy - 7 + 30 * (1 - k), 150, dir, { flare: true, scream: st > 84, a: k, glow: 0.12 });   // its eye lands just above and behind the target, inside the pushed-in view
      } else {   // the stoop: wings folded, straight through the target
        const k = (st - (FIN - 6)) / 20;
        falcon(ctx, sx - dir * 80 + dir * 200 * k, cy - 90 + 180 * k, 90, dir, { fold: 1, rot: 0.75, a: 1 - ease((st - FIN - 6) / 8), glow: 0.15 });
        if (st === FIN) for (let i = 0; i < 20; i++) part(T.x + rand(-20, 20), T.y - rand(4, 40), i % 2 ? '#f4fbff' : '#93cdef', rand(-3, 3), -rand(0, 4), 24, 2, 0.1);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
