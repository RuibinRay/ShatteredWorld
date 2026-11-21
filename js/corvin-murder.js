'use strict';
// Shattered Worlds — Corvin's murder of crows (the user, 2026-11-20: "Corvin's crows"). His story: "a black feathered
// hood with a gold beak-shaped clasp, one eye glowing violet, black crows bursting out of his cloak"; "you hit him. You
// hit a crow"; the crows "are what his world sent to watch its own end". His kit (js/ninjas2.js, reworked in
// js/corvin-crows.js) stays exactly as it is: this file only swaps the pictures. Every crow in every move was a few
// rectangles; now each one is a real crow: black with a violet sheen and rim, a heavy gold-ridged beak, a violet eye,
// wings that beat. Crisp pixel art through js/pixel-kit.js. Draw-only: no hit, hitbox, timing or number is touched.
// Loaded after js/corvin-crows.js. It wraps no cast: it finds his shots by what they draw and redraws them.
//   J      a crow dives through each hit; the finisher's three crows are real
//   U      Crow Volley, the Crow's Due flock, the Mirage and perfect-guard crows: all real crows
//   S+U    Crow's Due: crows wheel round him while the stance holds
//   I      Black Flame: black fire with violet edges
//   S+I    Moon Gaze: a pale moon opens into an eye with a violet iris and looks down at them
//   W+O    Murder of Crows: ten real crows
//   Mirage ready: a small crow sits over him     S+O Omen: feathers drift round him     O Dark Wings: small black wings
//   W+I    Crow Eclipse: a red sky with a black eclipse, big crows crossing; in the finish (js/ult-grand.js) the crows
//          ring the target and close in, a great crow's head caws beside it, and the storm goes through on an impact frame
// SW.corvinMurder.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, V = SW.versus, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.rect || !SW.data || !SW.data.heroes.corvin) return;
  const CM = SW.corvinMurder = { on: true };
  const isC = g => !!(CM.on && g && g.state && g.state.hero === 'corvin');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

  // black, feather black, blue-black, steel violet, deep violet, violet, lilac, pale lilac, white, gold, dark gold, red, dark red
  const PAL = ['#0c0810', '#14101c', '#241a36', '#3a2a5a', '#5a2a9a', '#7209b7', '#b983ff', '#e0c3fc', '#ffffff', '#d8a020', '#8a5a10', '#c1121f', '#5a0a1a'];
  const C = { b0: PAL[0], b1: PAL[1], b2: PAL[2], b3: PAL[3], v0: PAL[4], v1: PAL[5], v2: PAL[6], li: PAL[7], w: PAL[8], gd: PAL[9], gd2: PAL[10], rd: PAL[11], rd2: PAL[12] };
  const RIM = '#7209b7';   // the outline: black birds need a rim to show against a dark sky
  // a feather blade from (x, y) along ang
  const blade = (c, x, y, ang, L, w, col) => { const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca; poly(c, [[x + nx * w * 0.6, y + ny * w * 0.6], [x + ca * L * 0.5 + nx * w, y + sa * L * 0.5 + ny * w], [x + ca * L, y + sa * L], [x + ca * L * 0.5 - nx * w, y + sa * L * 0.5 - ny * w], [x - nx * w * 0.6, y - ny * w * 0.6]], col); };
  // a tongue of fire from (x0, y0) along ang
  function tongue(c, x0, y0, ang, L, w, col, bend) {
    const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca, b = (bend || 0) * L, Q = (u, off) => [x0 + ca * L * u + nx * off, y0 + sa * L * u + ny * off];
    poly(c, [Q(0, w * 0.7), Q(0.3, w + b * 0.4), Q(0.62, w * 0.55 + b), Q(1, b * 1.7), Q(0.66, -w * 0.3 + b), Q(0.3, -w + b * 0.3), Q(0, -w * 0.7)], col);
  }

  // ================= the crow, side view: (0, 0) its body, facing +x, s its body length =================
  function wing(c, s, sx, sy, a, far) {
    const L = s * 1.1, phi = a * 1.15 + (far ? 0.2 : 0), p1 = phi * 1.1 + 0.12, p2 = phi * 0.72;
    const wx = sx - Math.cos(p1) * L * 0.42, wy = sy - Math.sin(p1) * L * 0.42, tx = wx - Math.cos(p2) * L * 0.5, ty = wy - Math.sin(p2) * L * 0.5;
    const base = far ? C.b1 : C.b2, alt = far ? C.b2 : C.b3, pr = -0.4 * SW.clamp(phi * 3, -1, 1) + 0.15 * phi, Nf = 9;
    for (let i = 0; i < Nf; i++) {   // flight feathers, fanned from the arm: the last ones are the long fingers of a crow's wing
      const u = i / (Nf - 1), rx = u < 0.5 ? sx + (wx - sx) * u * 2 : wx + (tx - wx) * (u - 0.5) * 2, ry = u < 0.5 ? sy + (wy - sy) * u * 2 : wy + (ty - wy) * (u - 0.5) * 2;
      const pf = pr + (p2 - pr) * Math.pow(u, 0.8) + (1 - Math.abs(SW.clamp(phi * 3, -1, 1))) * (u - 0.4) * 0.6;
      blade(c, rx, ry, PI + pf, L * (0.38 + 0.4 * u) * (u > 0.85 ? 0.86 : 1), L * 0.11, i % 2 ? base : alt);
    }
    const aw = L * 0.06, nx1 = Math.sin(p1), ny1 = -Math.cos(p1);
    poly(c, [[sx + nx1 * aw, sy + ny1 * aw], [wx + nx1 * aw, wy + ny1 * aw], [tx, ty], [wx - nx1 * aw, wy - ny1 * aw], [sx - nx1 * aw * 1.6, sy - ny1 * aw * 1.6]], far ? C.b2 : C.v0);   // the arm, with a violet sheen
    if (!far) poly(c, [[sx, sy - aw * 0.6], [wx, wy - aw * 0.6], [wx, wy + aw * 0.2], [sx, sy + aw * 0.2]], C.v1);
  }
  // o = { flap 0-1, wing (fixed), caw, t }
  function crowVec(c, s, o) {
    const a = o.wing !== undefined ? o.wing : Math.sin((o.flap || 0) * PI * 2), caw = o.caw ? s * 0.07 : 0;
    poly(c, [[-0.28 * s, -0.05 * s], [-0.74 * s, -0.12 * s], [-0.82 * s, 0.01 * s], [-0.72 * s, 0.13 * s], [-0.28 * s, 0.08 * s]], C.b2);   // the wedge of its tail
    poly(c, [[-0.28 * s, 0.02 * s], [-0.82 * s, 0.01 * s], [-0.72 * s, 0.13 * s], [-0.28 * s, 0.08 * s]], C.b1);
    wing(c, s, 0.04 * s, -0.06 * s, a, true);
    poly(c, [[0.36 * s, -0.1 * s], [0.1 * s, -0.18 * s], [-0.2 * s, -0.14 * s], [-0.38 * s, -0.02 * s], [-0.2 * s, 0.12 * s], [0.1 * s, 0.14 * s], [0.32 * s, 0.06 * s]], C.b2);   // the body
    poly(c, [[-0.38 * s, -0.02 * s], [-0.2 * s, 0.12 * s], [0.1 * s, 0.14 * s], [0.32 * s, 0.06 * s], [0.0, 0.03 * s]], C.b1);
    poly(c, [[0.34 * s, -0.1 * s], [0.1 * s, -0.18 * s], [-0.2 * s, -0.14 * s], [-0.02 * s, -0.1 * s], [0.2 * s, -0.08 * s]], C.v0);   // the sheen along its back
    poly(c, [[0.26 * s, -0.14 * s], [0.38 * s, -0.26 * s], [0.53 * s, -0.24 * s], [0.6 * s, -0.13 * s], [0.52 * s, -0.01 * s], [0.32 * s, 0.05 * s]], C.b2);   // the head
    poly(c, [[0.38 * s, -0.26 * s], [0.53 * s, -0.24 * s], [0.6 * s, -0.13 * s], [0.46 * s, -0.2 * s]], C.v0);
    blade(c, 0.4 * s, 0.02 * s, PI - 0.9, 0.16 * s, 0.03 * s, C.b2); blade(c, 0.34 * s, 0.04 * s, PI - 1.1, 0.16 * s, 0.03 * s, C.b2);   // the ruff at its throat
    poly(c, [[0.55 * s, -0.21 * s], [0.86 * s, -0.11 * s], [0.9 * s, -0.03 * s], [0.56 * s, -0.08 * s]], C.gd);   // the beak: heavy, gold along the ridge
    poly(c, [[0.56 * s, -0.12 * s], [0.9 * s, -0.03 * s], [0.56 * s, -0.08 * s]], C.gd2);
    poly(c, [[0.56 * s, -0.075 * s], [0.82 * s, -0.035 * s + caw], [0.56 * s, -0.02 * s + caw * 0.5]], C.gd2);
    if (caw) poly(c, [[0.58 * s, -0.075 * s], [0.8 * s, -0.045 * s], [0.78 * s, -0.035 * s + caw * 0.8]], C.rd);
    ell(c, 0.47 * s, -0.16 * s, Math.max(0.9, 0.045 * s), Math.max(0.9, 0.04 * s), C.li); if (s >= 16) ell(c, 0.48 * s, -0.165 * s, 0.02 * s, 0.02 * s, C.w);   // the violet eye
    wing(c, s, 0.02 * s, -0.08 * s, a, false);
  }
  // o also takes { rot, a, mono }. There can be dozens of crows on screen, so each pose (size, wing beat, beak, tilt)
  // is drawn once through the pixel kit, kept, and stamped from then on.
  const kept = new Map();
  function crow(ctx, x, y, s, dir, o) {
    o = o || {}; s = Math.max(6, Math.round(s));
    const wg = o.wing !== undefined ? Math.round(o.wing * 4) / 4 : null, fl = wg === null ? Math.round((((o.flap || 0) % 1) + 1) % 1 * 8) % 8 : -1, rq = Math.max(-3, Math.min(3, Math.round((o.rot || 0) / 0.3)));
    const key = s + '|' + fl + '|' + wg + '|' + (o.caw ? 1 : 0) + '|' + rq + '|' + (o.mono || ''), off = Math.round(s * 0.15);
    let cv = kept.get(key);
    if (!cv) {
      const W2 = 2 * Math.ceil(s * 1.6);
      cv = document.createElement('canvas'); cv.width = cv.height = W2;
      const drop = () => { if (kept.get(key) === cv) kept.delete(key); };   // a canvas the browser drops while the tab is hidden comes back blank: draw it again
      cv.addEventListener('contextlost', drop); cv.addEventListener('contextrestored', drop);
      PX.sprite(cv.getContext('2d'), W2 / 2, W2 / 2, W2, W2, c => { c.translate(off, 0); if (rq) c.rotate(rq * 0.3); crowVec(c, s, { wing: wg === null ? undefined : wg, flap: fl / 8, caw: o.caw }); }, { pal: PAL, mono: o.mono, outline: RIM });
      if (kept.size > 500) kept.clear();
      kept.set(key, cv);
    }
    const h = cv.width / 2, px = Math.round(x), py = Math.round(y);
    ctx.save(); ctx.imageSmoothingEnabled = false; if (o.a !== undefined) ctx.globalAlpha *= clamp01(o.a);
    if (dir < 0) { ctx.translate(px, py); ctx.scale(-1, 1); ctx.drawImage(cv, -h - off, -h); } else ctx.drawImage(cv, px - h - off, py - h);
    ctx.restore();
  }
  // a crow sitting: wings folded, head up
  function perchedVec(c, s) {
    poly(c, [[-0.1 * s, 0.34 * s], [-0.34 * s, 0.52 * s], [-0.22 * s, 0.56 * s], [0.02 * s, 0.38 * s]], C.b0);   // tail down behind
    poly(c, [[0.16 * s, -0.2 * s], [0.26 * s, 0.1 * s], [0.14 * s, 0.38 * s], [-0.12 * s, 0.4 * s], [-0.26 * s, 0.1 * s], [-0.1 * s, -0.22 * s]], C.b2);
    poly(c, [[-0.1 * s, -0.16 * s], [-0.26 * s, 0.1 * s], [-0.16 * s, 0.4 * s], [-0.02 * s, 0.3 * s], [-0.04 * s, -0.1 * s]], C.v0);   // the folded wing
    poly(c, [[-0.08 * s, -0.2 * s], [0.02 * s, -0.4 * s], [0.2 * s, -0.4 * s], [0.28 * s, -0.26 * s], [0.18 * s, -0.14 * s]], C.b3);
    poly(c, [[0.24 * s, -0.36 * s], [0.52 * s, -0.26 * s], [0.26 * s, -0.2 * s]], C.gd);
    ell(c, 0.15 * s, -0.31 * s, Math.max(0.9, 0.05 * s), Math.max(0.9, 0.05 * s), C.li);
    for (const d of [-0.06, 0.08]) poly(c, [[d * s, 0.38 * s], [d * s + 0.04 * s, 0.38 * s], [d * s + 0.02 * s, 0.5 * s]], C.gd2);
  }
  // the great crow's head: (0, 0) the middle of the skull, facing +x, s its length; o = { caw 0-1, glare }
  function headVec(c, s, o) {
    const caw = clamp01(o.caw || 0), S = (pts, col) => poly(c, pts.map(q => [q[0] * s, q[1] * s]), col), t = o.t || 0;
    for (let i = 0; i < 7; i++) blade(c, s * (-0.24 - i * 0.02), s * (-0.26 + i * 0.07), PI + 0.5 - i * 0.16 + Math.sin(t * 0.3 + i) * 0.04, s * (0.62 - Math.abs(i - 3) * 0.05), s * 0.07, i % 2 ? C.b2 : C.b3);   // the feathers of its nape
    for (let i = 0; i < 5; i++) blade(c, s * (0.2 - i * 0.09), s * 0.16, PI / 2 + 0.35 + i * 0.16, s * (0.36 - i * 0.03), s * 0.06, i % 2 ? C.b3 : C.b2);   // the ruff at its throat
    if (caw > 0.06) { S([[0.4, 0.0], [0.96, 0.03], [0.42 + Math.cos(caw * 0.5) * 0.44, 0.07 + Math.sin(caw * 0.5) * 0.44], [0.38, 0.14]], C.rd2); S([[0.44, 0.03], [0.74, 0.04], [0.46, 0.04 + caw * 0.14]], C.rd); }   // its red throat
    c.save(); c.translate(0.42 * s, 0.05 * s); c.rotate(caw * 0.5);   // the lower beak
    poly(c, [[-0.04 * s, 0.0], [0.5 * s, 0.02 * s], [0.42 * s, 0.09 * s], [-0.04 * s, 0.14 * s]], C.b3); poly(c, [[-0.04 * s, 0.07 * s], [0.5 * s, 0.02 * s], [0.42 * s, 0.09 * s], [-0.04 * s, 0.14 * s]], C.b2); poly(c, [[0.0, 0.0], [0.5 * s, 0.02 * s], [0.2 * s, 0.03 * s]], C.gd2);
    c.restore();
    S([[-0.35, 0.2], [-0.4, -0.1], [-0.2, -0.36], [0.15, -0.42], [0.42, -0.3], [0.52, -0.12], [0.46, 0.08], [0.2, 0.24]], C.b2);   // the skull
    S([[-0.2, -0.36], [0.15, -0.42], [0.42, -0.3], [0.1, -0.31], [-0.14, -0.28]], C.b3); S([[-0.1, -0.33], [0.15, -0.38], [0.3, -0.33], [0.1, -0.33]], C.v0);
    S([[-0.35, 0.2], [-0.4, -0.1], [-0.1, 0.02], [0.2, 0.24]], C.b1);
    S([[0.4, -0.25], [0.76, -0.21], [1.0, -0.07], [1.09, 0.09], [0.98, 0.04], [0.7, 0.0], [0.42, 0.02]], C.b3);   // the upper beak: heavy and hooked, gold along the ridge
    S([[0.42, -0.25], [0.76, -0.21], [1.0, -0.07], [0.74, -0.15], [0.44, -0.19]], C.gd); S([[0.76, -0.21], [1.0, -0.07], [0.86, -0.13]], C.w);
    S([[0.98, -0.02], [1.09, 0.09], [0.98, 0.04]], C.b0);
    for (let i = 0; i < 3; i++) blade(c, 0.42 * s, (-0.13 + i * 0.03) * s, -0.15 + i * 0.12, 0.2 * s, 0.022 * s, C.b0);   // bristles over the nostril
    S([[0.12, -0.3], [0.47, -0.2], [0.45, -0.14], [0.14, -0.22]], C.b0);   // the brow
    ell(c, 0.3 * s, -0.14 * s, 0.085 * s, 0.075 * s, o.glare ? C.li : C.v1); ell(c, 0.3 * s, -0.14 * s, 0.05 * s, 0.045 * s, o.glare ? C.w : C.v2); ell(c, 0.31 * s, -0.14 * s, 0.022 * s, 0.03 * s, C.b0);   // the violet eye
    if (o.glare) for (let i = 0; i < 4; i++) blade(c, 0.3 * s, -0.14 * s, i * PI / 2 + 0.4, 0.2 * s, 0.012 * s, C.li);
  }
  function head(ctx, x, y, s, dir, o) { o = o || {}; PX.sprite(ctx, x - dir * s * 0.1, y, s * 2.9, s * 2.2, c => { c.translate(s * 0.1 * (dir < 0 ? -1 : 1), 0); c.scale(dir < 0 ? -1 : 1, 1); headVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: RIM }); }
  Object.assign(CM, { crow, head, PAL });
  const feathers = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 === 0 ? '#7209b7' : i % 3 === 1 ? '#3a2a5a' : '#b983ff', rand(-pw, pw), -rand(0.3, pw), 24, 2, 0.05); };

  // ================= I: Black Flame: black fire, violet at its edges =================
  function flame(ctx, x, y, t, life) {
    const k = Math.min(1, t / 8, (life - t) / 16); if (k <= 0) return;
    PX.sprite(ctx, x, y - 26, 76, 70, c => {
      c.translate(0, 26);
      for (let pass = 0; pass < 2; pass++) for (let i = 0; i < 9; i++) {
        const hh = (18 + Math.abs(Math.sin(t * 0.3 + i * 1.3)) * 28) * k, bx = -24 + i * 6;
        tongue(c, bx, 0, -PI / 2 + Math.sin(t * 0.2 + i) * 0.12, hh * (pass ? 0.8 : 1), pass ? 3.4 : 5.2, pass ? (i % 2 ? C.b1 : C.b0) : (i % 2 ? C.v1 : C.v0), Math.sin(t * 0.25 + i * 2) * 0.12);
      }
      for (let i = 0; i < 4; i++) { const u = ((t * 0.03 + i * 0.25) % 1), fx0 = (rnd(i, 3) - 0.5) * 44 + Math.sin(t * 0.1 + i) * 4; blade(c, fx0, -8 - u * 44, -PI / 2 + Math.sin(t * 0.2 + i * 2) * 0.8, 6, 1.6, u > 0.7 ? C.v0 : C.b2); }   // feathers go up in it
      poly(c, [[-26, 0], [26, 0], [22, 3], [-22, 3]], C.b0);
    }, { pal: PAL, outline: false });
  }

  // ================= S+I: Moon Gaze: a pale moon opens into an eye =================
  function moon(ctx, x, y, t) {
    const o = ease(t / 14), look = t >= 18, a = t > 58 ? (64 - t) / 6 : 1;
    if (look) PX.sprite(ctx, x, y + 44, 70, 76, c => poly(c, [[-4, -32], [4, -32], [24, 34], [-24, 34]], C.v1), { pal: PAL, alpha: 0.22 * a, outline: false });   // its look falls on them
    PX.sprite(ctx, x, y, 64, 56, c => {
      ell(c, 0, 0, 19, 19, C.li); ell(c, -3, -3, 15, 15, C.w); ell(c, 7, 6, 4, 3, C.li); ell(c, -8, 8, 2.5, 2, C.li); ell(c, 5, -9, 2, 2, C.li);   // the moon
      if (o > 0.05) {
        const h = 11 * o;
        poly(c, [[-17, 0], [-8, -h], [8, -h], [17, 0], [8, h], [-8, h]], C.b0);   // the eye opens across it
        ell(c, 0, 0, 7.5 * o + 1, Math.min(h, 7.5 * o + 1), look ? C.v2 : C.v1); ell(c, 0, 0, 5 * o, Math.min(h, 5 * o), C.v0); poly(c, [[-1.3, -h * 0.75], [1.3, -h * 0.75], [1.3, h * 0.75], [-1.3, h * 0.75]], C.b0);
        ell(c, -2.5, -2.5 * o, 1.3, 1.3, C.w);
        for (let i = 0; i < 5; i++) blade(c, (i - 2) * 6, -h - 1, -PI / 2 + (i - 2) * 0.28, 7 + (i === 2 ? 2 : 0), 1.5, C.b1);   // lashes: crow feathers
      }
    }, { pal: PAL, alpha: a, outline: RIM });
  }

  // ================= W+I: the eclipse sky (drawn in screen space, like the picture it replaces) =================
  function eclipse(ctx, t, life) {
    const k = Math.min(1, t / 8, (life - t) / 8); if (k <= 0) return;
    ctx.globalAlpha = 0.4 * k; art.rect(ctx, '#5a0a1a', 0, 0, W, H); ctx.globalAlpha = 1;
    PX.sprite(ctx, W - 84, 74, 110, 110, c => {
      for (let i = 0; i < 16; i++) tongue(c, 0, 0, i / 16 * PI * 2 + t * 0.02, 34 + 9 * Math.sin(t * 0.3 + i * 2.1), 5, i % 2 ? C.rd : C.rd2, 0.08);   // the corona
      ell(c, 0, 0, 23, 23, C.rd); ell(c, 0, 0, 21, 21, C.b0); ell(c, -4, -4, 15, 15, C.b1);
    }, { pal: PAL, alpha: k, outline: false });
  }

  // ================= finding his shots by what they draw, and redrawing them =================
  // the old crow picture begins with one rectangle at (x - 4, y - 2) and a second at x + d * 3: run it against a
  // stand-in for art.rect and it tells us where the crow is and which way it faces
  function probe(render, sx, sy, t) {
    const keep = art.rect; let n = 0, X = 0, Y = 0, d = 1;
    art.rect = (c0, col, x, y) => { if (n === 0) { X = x + 4; Y = y + 2; } else if (n === 1) d = x - X > 0 ? 1 : -1; n++; };
    try { render(null, sx, sy, t); } catch (e) { n = 0; } finally { art.rect = keep; }
    return n ? { x: X, y: Y, d } : null;
  }
  function dressOne(s) {
    if (s.cm !== undefined) return;
    s.cm = 0;
    if (typeof s.render !== 'function') return;
    const src = Function.prototype.toString.call(s.render), old = s.render;
    if (src.indexOf('crow(ctx') >= 0) {
      s.cm = 1;
      if (s instanceof Proj) { const size = s.w >= 16 ? 17 : 15, ph = Math.round(rand(0, 7)); s.render = (ctx, x, y, q) => (CM.on ? crow(ctx, x, y, size, q.vx >= 0 ? 1 : -1, { flap: ((q.t + ph) % 8) / 8, rot: SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)), -0.7, 0.7), caw: q.t % 16 < 6 }) : old(ctx, x, y, q)); return; }
      const big = s.life === 60, size = big ? [20, 24, 28][Math.floor(rand(0, 2.99))] : (rand(0, 1) < 0.5 ? 12 : 14), ph = Math.round(rand(0, 7));   // the eclipse's crossing crows are the big ones
      s.render = (ctx, sx, sy, t) => { if (!CM.on) return old(ctx, sx, sy, t); const q = probe(old, sx, sy, t); if (q) crow(ctx, q.x, q.y, size, q.d, { flap: ((t + ph) % 8) / 8, caw: big && t % 20 < 8, a: big ? 1 : Math.min(1, (s.life - t) / 5) }); };
    } else if (s.life === 150 && src.indexOf("'#2a0a3a'") >= 0) { s.cm = 1; s.render = (ctx, x, y, t) => (CM.on ? flame(ctx, x, y, t, 150) : old(ctx, x, y, t)); }
    else if (s.life === 64 && src.indexOf("'#c1121f'") >= 0 && src.indexOf('art.disc') >= 0) { s.cm = 1; s.render = (ctx, x, y, t) => (CM.on ? moon(ctx, x, y, t) : old(ctx, x, y, t)); }
    else if (s.life === 66 && src.indexOf("'#5a0a1a'") >= 0) { s.cm = 1; s._ugS = 1; s.render = (ctx, x, y, t) => (CM.on ? eclipse(ctx, t, 66) : old(ctx, x, y, t)); }
  }
  // a hit on him in the other fighter's turn leaves its crows in that fighter's list, so every list is looked through
  function dress(z) {
    const seen = [], go = a => { if (!a || seen.indexOf(a) >= 0) return; seen.push(a); for (let i = 0; i < a.length; i++) dressOne(a[i]); };
    go(z && z.shots); go(G.zone && G.zone.shots); if (V && V.f) V.f.forEach(f => go(f && f.shots));
  }

  // ================= Mirage ready: a small crow sits over him =================
  const MIR = N.TRAITS && N.TRAITS.mirage;
  if (MIR && MIR.mark) {
    const _mm = MIR.mark;
    MIR.mark = function (ctx, p, x, y) {
      if (!CM.on) return _mm.apply(this, arguments);
      if (SW.frame - (p.mirT === undefined ? -1e9 : p.mirT) >= 600) PX.sprite(ctx, x, y - 54, 26, 28, c => { c.scale(p.face < 0 ? -1 : 1, 1); perchedVec(c, 13); }, { pal: PAL, outline: RIM });
    };
  }

  // ================= J: a crow dives through each hit; the stance's crows; the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 7) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.6 : 24, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), u = ease((k + 1) / 5), up = a.anim === 'launcher';
        crow(ctx, sx + d * (2 + (reach + 8) * u), up ? hy + 14 - 30 * u : hy - 16 + 20 * u, big ? 17 : 14, d, { wing: 0.8 - 1.3 * u, rot: up ? -0.6 : 0.45, caw: true, a: k > 4 ? (7 - k) / 3 : 1 });
        if (k === 0) feathers(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 6 : 3, 2);
      }
    }
    if (p.crowDue && p.riposteT > 0) for (let i = 0; i < 3; i++) {   // Crow's Due: crows wheel round him while it holds
      const an = p.t * 0.2 + i * 2.094, s = Math.sin(an);
      if ((s >= 0) === front) crow(ctx, sx + Math.round(Math.cos(an) * 22), sy - 22 + Math.round(s * 8), 11, -s >= 0 ? 1 : -1, { flap: ((p.t + i * 3) % 8) / 8 });
    }
    if (front && p.modeT > 0) {   // Omen: feathers drift down round him, his eye glows (small)
      const fade = Math.min(1, p.modeT / 30);
      PX.sprite(ctx, sx, sy - 24, 40, 50, c => { for (let i = 0; i < 3; i++) { const u = ((p.t * 0.012 + i / 3) % 1); blade(c, (i - 1) * 13 + Math.sin(p.t * 0.08 + i * 2) * 3, -22 + u * 40, PI / 2 + Math.sin(p.t * 0.1 + i) * 0.7, 6, 1.5, i % 2 ? C.b2 : C.v0); } }, { pal: PAL, alpha: fade, outline: RIM });
      art.rect(ctx, '#e0c3fc', sx + d * 3 - 1, sy - 37, 2, 2);
    }
    if (!front && p.awakeT > 0) {   // Dark Wings: small black wings at his back (small)
      const fade = Math.min(1, p.awakeT / 30), open = 0.55 + 0.25 * Math.sin(p.t * 0.12);
      PX.sprite(ctx, sx, sy - 30, 62, 46, c => { c.translate(0, 8); for (const dd of [-1, 1]) { c.save(); c.scale(-dd, 1); wing(c, 17, -1, 0, open, dd === d); c.restore(); } }, { pal: PAL, alpha: fade, outline: RIM });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isC(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) { dress(null); aura(ctx, this, sx, sy, false); }
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isC(g || this.G)) return r;
    dress(z);
    if (!this.dead && this.awakeT > a0 + 60) feathers(this.x, this.y - 24, 14, 2.6);   // Dark Wings begins (small and short)
    return r;
  };

  // ================= W+I: Crow Eclipse, the finish =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isC(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('corvin') : null;
    if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    return r;
  };
  // js/ult-grand.js builds up from BU2 and lands its finishing blow at FIN
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult') return false;
      const st = p.st; if (st < BU2 - 2 || st > FIN + 18) return;
      const sx = Math.round(v.x - cam.x), sy = Math.round(v.y - cam.y), cy = sy - 20;
      if (st < FIN) {   // the crows ring them and close in; the great crow caws beside them
        const k = ease((st - (BU2 - 2)) / 8), R = 74 - 40 * ease((st - BU2) / Math.max(1, FIN - BU2)), sh = st > FIN - 10 ? Math.sin(st * 2.3) * 1.2 : 0;
        for (let i = 0; i < 8; i++) { const an = st * 0.17 + i * PI / 4; crow(ctx, sx + Math.cos(an) * R, cy + Math.sin(an) * R * 0.5, 14, -Math.sin(an) >= 0 ? 1 : -1, { flap: ((st + i * 3) % 8) / 8, caw: (st + i * 5) % 14 < 5, a: k }); }
        head(ctx, sx - dir * 80 + sh, cy - 8, 44, dir, { caw: st > BU2 + 6 ? 0.65 + 0.35 * Math.sin(st * 0.7) : 0.05, glare: st > BU2 + 6, t: st, a: k });
      } else {   // the storm goes through them from every side
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, mono = ik < 0.5 ? '#ffffff' : undefined;
        PX.impact(ctx, sx, cy, ik, 29);
        for (let i = 0; i < 10; i++) { const an = i * PI / 5 + 0.3, u = -0.9 + ik * 0.8 + (i % 3) * 0.14, dx = Math.cos(an), dy = Math.sin(an); if (u < 1.5) crow(ctx, sx + dx * u * 92, cy + dy * u * 52, 17, dx >= 0 ? 1 : -1, { wing: 0.7, rot: (dx >= 0 ? 1 : -1) * Math.atan2(dy * 52, Math.abs(dx) * 92), caw: true, mono, a: 1 - ease((k - 0.5) / 0.5) }); }
        head(ctx, sx - dir * 80, cy - 8, 44, dir, { caw: 1, glare: true, t: st, mono, a: 1 - ease((k - 0.3) / 0.5) });
        if (st === FIN) feathers(T.x, T.y - 16, 30, 4.5);
      }
    });
  }
})();
