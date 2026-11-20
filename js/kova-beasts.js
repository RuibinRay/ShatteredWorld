'use strict';
// Shattered Worlds — Kova's three spirit beasts (2026-11-20; the user: "improve skills the ult the animation and make
// it cool not cute"). His look: "the spirit shapes of a tiger, an eagle and a tortoise behind him". He turns into each
// as he fights, so every move draws that beast over him, big: a roaring tiger of spirit fire with its claws out, an
// eagle of sky light with talons first, a spiked jade war-shell; and all three as one chimera when he awakens.
// Built for impact, not charm: small heads on heavy bodies, angular silhouettes, fangs and glowing eyes, a smear on the
// launch, speed lines, raked claw marks, and impact frames (js/pixel-kit.js) on the heavy landings.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/fenn-wolf.js; only wraps.
//   U      Tiger Pounce: the tiger pounces with him, stretched into a smear, and rakes three claw marks
//   S+U    Eagle Dive: the eagle carries him up, folds, and stoops talons-first; wings flare on the landing
//   I      Tortoise Shell: a spinning spiked jade shell round him tears along the ground and crashes (impact frame)
//   S+I    Three Beasts: tiger charge, eagle rise, shell crash, each beast in turn (impact frame on the crash)
//   W+O    Pack Charge: the three spirits themselves run, fly and spin out
//   J x4   the finisher: a tiger's paw rakes three long claw marks
//   S+O    Wild Heart: the head of his current beast looms behind him
//   O      Chimera: the chimera erupts behind him roaring (impact frame) and stands over him while he is awake
//   W+I    Primal Parade: tiger, eagle and shell strike in turn; at the finishing blow (js/ult-grand.js) the chimera's
//          head roars in close-up and a giant claw rakes the target (impact frame)
// SW.kovaBeasts.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.tiger_pounce) return;
  const KB = SW.kovaBeasts = { on: true };
  const isK = g => !!(KB.on && g && g.state && g.state.hero === 'kova');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, r, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), r || 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const limb = (c, pts, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); };

  // spirit fire (tiger), sky light (eagle), jade (shell): each a ramp from near-black to white
  const TP = ['#160806', '#4a140a', '#9a2e0c', '#e2661c', '#ff9d33', '#ffd67a', '#ffffff'];
  const EP = ['#0a1230', '#1b3476', '#3c69bc', '#78aeec', '#c4e2ff', '#ffffff', '#ffc93a'];
  const SP = ['#04140c', '#0d3520', '#1c6537', '#35a056', '#7ce68a', '#d6ffd0', '#ffffff'];
  const ALL = TP.concat(EP, SP);

  // ================= the tiger: (0, 0) the ground under its middle, facing +x, s its length =================
  // o = { run 0-1, pounce, roar 0-1, t, armor (jade plates: the chimera), stretch (a smear) }
  function tigerVec(c, s, o) {
    const T = TP, ph = (o.run || 0) * PI * 2, t = o.t || 0, roar = clamp01(o.roar === undefined ? 0.6 : o.roar);
    const bounce = o.pounce || o.stand ? 0 : -Math.abs(Math.sin(ph)) * s * 0.05;
    c.translate(0, bounce - s * 0.02);
    const leg = (hx, hy, a, k, L, col, w, claw) => {
      const ex = hx + Math.sin(a) * L * 0.5, ey = hy + Math.cos(a) * L * 0.5, px = ex + Math.sin(a + k) * L * 0.5, py = Math.min(-bounce + s * 0.02, ey + Math.cos(a + k) * L * 0.5);
      ell(c, hx + Math.sin(a) * L * 0.12, hy + Math.cos(a) * L * 0.12, w * 0.8, w * 1.25, -a, col);
      limb(c, [[hx, hy], [ex, ey], [px, py]], w, col);
      const fa = a + k, fxv = Math.sin(fa), fyv = Math.cos(fa);
      ell(c, px + fxv * w * 0.3, py + fyv * w * 0.2, w * 0.85, w * 0.6, 0, col);   // the paw
      if (claw) for (let i = -1; i <= 1; i++) poly(c, [[px + fxv * w * 0.5 + i * w * 0.35, py + fyv * w * 0.3 - w * 0.2], [px + fxv * w * 0.5 + i * w * 0.35 + w * 0.25, py + fyv * w * 0.3], [px + fxv * (w * 1.9) + i * w * 0.4, py + fyv * w * 1.5 + w * 0.3]], T[6]);
    };
    const legs = far => {
      const q = far ? 0.9 : 0, gg = Math.sin(ph + q), hh = Math.cos(ph + q), col = far ? T[2] : T[3], w = s * (far ? 0.075 : 0.09);
      if (o.pounce) { leg(s * 0.24, -s * 0.44, 1.3 + (far ? 0.12 : 0), -0.1, s * 0.42, col, w, true); leg(-s * 0.3, -s * 0.44, -1.2 - (far ? 0.1 : 0), 0.25, s * 0.42, col, w * 1.1, false); return; }
      if (o.stand) { leg(s * 0.24, -s * 0.44, far ? 0.25 : -0.05, 0.05, s * 0.36, col, w, true); leg(-s * 0.3, -s * 0.42, far ? -0.3 : -0.1, 0.35, s * 0.36, col, w * 1.1, false); return; }
      leg(s * 0.24, -s * 0.44, 0.8 * gg, -0.6 * Math.max(0, -hh), s * 0.4, col, w, true);
      leg(-s * 0.3, -s * 0.44, -0.8 * gg + 0.15, 0.6 * Math.max(0, hh) + 0.2, s * 0.4, col, w * 1.1, false);
    };
    if (!o.head) legs(true);
    // the tail: long, lashing, a tongue of flame at the tip
    const tw = Math.sin(t * 0.35) * s * 0.07;
    if (!o.head) {
      c.strokeStyle = T[3]; c.lineWidth = s * 0.075; c.lineCap = 'round'; c.beginPath(); c.moveTo(-s * 0.42, -s * 0.56); c.bezierCurveTo(-s * 0.62, -s * 0.5, -s * 0.78, -s * 0.62 + tw, -s * 0.84, -s * 0.84 + tw * 1.4); c.stroke();
      c.strokeStyle = T[0]; c.lineWidth = s * 0.03; for (let i = 0; i < 3; i++) { const u = 0.35 + i * 0.2; c.beginPath(); c.moveTo(-s * (0.44 + u * 0.4), -s * (0.5 + u * 0.16) + tw * u); c.lineTo(-s * (0.42 + u * 0.4), -s * (0.58 + u * 0.2) + tw * u); c.stroke(); }
      poly(c, [[-s * 0.8, -s * 0.8 + tw * 1.4], [-s * 0.92, -s * 1.04 + tw * 1.6], [-s * 0.84, -s * 0.86 + tw * 1.4], [-s * 0.98, -s * 0.84 + tw * 1.3], [-s * 0.86, -s * 0.76 + tw * 1.4]], T[5]);
    }
    // the body: heavy shoulders, long back, deep chest
    poly(c, [[s * 0.4, -s * 0.52], [s * 0.26, -s * 0.74], [-s * 0.08, -s * 0.66], [-s * 0.42, -s * 0.64], [-s * 0.48, -s * 0.4], [-s * 0.16, -s * 0.33], [s * 0.3, -s * 0.26]], T[3]);
    poly(c, [[s * 0.34, -s * 0.62], [s * 0.24, -s * 0.73], [-s * 0.08, -s * 0.65], [-s * 0.4, -s * 0.63], [-s * 0.12, -s * 0.57], [s * 0.2, -s * 0.6]], T[4]);
    poly(c, [[s * 0.32, -s * 0.34], [s * 0.04, -s * 0.33], [-s * 0.3, -s * 0.38], [-s * 0.02, -s * 0.42], [s * 0.3, -s * 0.44]], T[5]);
    for (let i = 0; i < 7; i++) { const sx = s * (0.28 - i * 0.105), top = -s * (0.72 - Math.min(i, 3) * 0.022); poly(c, [[sx, top], [sx - s * 0.055, top + s * 0.012], [sx - s * 0.02, top + s * (0.2 + (i % 2) * 0.06)]], T[0]); }   // stripes
    if (o.armor) {   // the chimera: plates of jade down its back, each with a spike
      for (let i = 0; i < 5; i++) { const px = s * (0.2 - i * 0.14), py = -s * (0.74 - i * 0.02); poly(c, [[px + s * 0.08, py + s * 0.06], [px, py - s * 0.02], [px - s * 0.08, py + s * 0.06], [px, py + s * 0.12]], SP[i % 2 ? 2 : 3]); poly(c, [[px + s * 0.03, py], [px - s * 0.02, py - s * 0.16], [px - s * 0.04, py + s * 0.01]], SP[5]); }
    } else {   // spirit fire licking off its back
      for (let i = 0; i < 6; i++) { const px = s * (0.26 - i * 0.12), py = -s * (0.73 - i * 0.016), len = s * (0.12 + 0.07 * Math.sin(t * 0.8 + i * 1.9)); poly(c, [[px + s * 0.04, py + s * 0.02], [px - len * 0.9, py - len], [px - s * 0.05, py + s * 0.03]], i % 2 ? T[5] : T[4]); }
    }
    // the head: broad skull, small ears laid back, white ruff, a brow drawn down hard, jaws open on long fangs
    c.save(); c.translate(s * 0.44, -s * 0.6); c.rotate(-0.12 - roar * 0.12);
    poly(c, [[-s * 0.06, -s * 0.12], [-s * 0.1, -s * 0.24], [s * 0.02, -s * 0.16]], T[2]);   // far ear
    poly(c, [[-s * 0.08, s * 0.02], [-s * 0.16, s * 0.14], [-s * 0.04, s * 0.1], [-s * 0.04, s * 0.2], [s * 0.06, s * 0.1]], T[5]);   // the ruff
    c.save(); c.translate(s * 0.08, s * 0.05); c.rotate(roar * 0.75);
    poly(c, [[-s * 0.02, 0], [s * 0.24, -s * 0.01], [s * 0.22, s * 0.05], [s * 0.0, s * 0.08]], T[2]);   // lower jaw
    poly(c, [[s * 0.17, -s * 0.005], [s * 0.21, -s * 0.005], [s * 0.2, -s * 0.085]], T[6]);   // lower fangs
    poly(c, [[s * 0.08, -s * 0.005], [s * 0.11, -s * 0.005], [s * 0.095, -s * 0.04]], T[6]);
    c.restore();
    if (roar > 0.1) poly(c, [[s * 0.06, s * 0.04], [s * 0.34, s * 0.02], [s * 0.3, s * 0.05 + roar * s * 0.16], [s * 0.1, s * 0.08]], '#3a0408');   // the mouth
    poly(c, [[-s * 0.1, s * 0.04], [-s * 0.1, -s * 0.1], [s * 0.0, -s * 0.17], [s * 0.16, -s * 0.15], [s * 0.34, -s * 0.05], [s * 0.36, s * 0.01], [s * 0.22, s * 0.05], [s * 0.06, s * 0.08]], T[3]);   // skull and muzzle
    poly(c, [[s * 0.0, -s * 0.16], [s * 0.16, -s * 0.145], [s * 0.3, -s * 0.07], [s * 0.12, -s * 0.1]], T[4]);
    poly(c, [[s * 0.2, s * 0.0], [s * 0.35, -s * 0.01], [s * 0.34, s * 0.03], [s * 0.22, s * 0.045]], T[5]);   // the pale muzzle
    poly(c, [[s * 0.26, s * 0.03], [s * 0.3, s * 0.03], [s * 0.285, s * 0.13 * Math.max(0.5, roar)]], T[6]);   // upper fangs: long
    poly(c, [[s * 0.18, s * 0.04], [s * 0.21, s * 0.04], [s * 0.195, s * 0.085]], T[6]);
    poly(c, [[s * 0.32, -s * 0.045], [s * 0.38, -s * 0.02], [s * 0.34, s * 0.0]], T[0]);   // nose
    poly(c, [[s * 0.04, -s * 0.12], [s * 0.2, -s * 0.07], [s * 0.2, -s * 0.045], [s * 0.05, -s * 0.085]], T[0]);   // the brow, slanted down
    poly(c, [[s * 0.1, -s * 0.085], [s * 0.19, -s * 0.05], [s * 0.12, -s * 0.045]], T[6]);   // the eye: a white-hot slit
    poly(c, [[-s * 0.04, -s * 0.02], [s * 0.02, -s * 0.03], [-s * 0.02, s * 0.03]], T[0]); poly(c, [[-s * 0.02, -s * 0.1], [s * 0.04, -s * 0.11], [0, -s * 0.06]], T[0]);   // face stripes
    poly(c, [[-s * 0.04, -s * 0.13], [-s * 0.07, -s * 0.27], [s * 0.05, -s * 0.16]], T[3]);   // near ear
    c.restore();
    if (!o.head) legs(false);
  }

  // ================= the eagle: (0, 0) its body, facing +x, s its body length =================
  function eWing(c, s, sx, sy, a, far, sweep) {
    const E = EP, up = a > 0 ? a : a * 0.6, au = Math.abs(up), L = s * 1.25, sw = sweep || 0;
    const wx = sx - L * (0.26 + 0.2 * sw), wy = sy - L * 0.5 * up, cyo = (far ? -0.5 : 1) * L * 0.2 * (1 - au);
    const base = far ? E[1] : E[2], dark = far ? E[0] : E[1], lite = far ? E[2] : E[3];
    poly(c, [[sx + L * 0.06, sy], [wx, wy], [wx - L * 0.08, wy + L * 0.14 + cyo * 0.6], [sx - L * 0.2, sy + cyo + L * 0.08]], dark);
    poly(c, [[sx + L * 0.06, sy], [wx, wy], [wx - L * 0.05, wy + L * 0.07], [sx - L * 0.1, sy + L * 0.035]], base);
    const dirA = Math.atan2(-(0.45 * up) - 0.02, -1) + (up < 0 ? -0.5 * up : 0) + (far ? 0.35 : -0.5) * (1 - au) + sw * 0.5 * (up > 0 ? 1 : -1) * 0;
    for (let i = 0; i < 6; i++) {   // long primaries, each a blade
      const ang = dirA + (i - 1.5) * 0.15 * (1 - 0.5 * sw), len = L * (0.78 - i * 0.06), ca = Math.cos(ang), sa = Math.sin(ang), w = L * 0.045;
      poly(c, [[wx - sa * w, wy + ca * w], [wx + ca * len * 0.8 - sa * w * 0.9, wy + sa * len * 0.8 + ca * w * 0.9], [wx + ca * len, wy + sa * len], [wx + sa * w, wy - ca * w]], i % 2 ? base : dark);
      if (i % 2 === 0) poly(c, [[wx, wy], [wx + ca * len, wy + sa * len], [wx + ca * len * 0.8 + sa * w * 0.5, wy + sa * len * 0.8 - ca * w * 0.5]], lite);
    }
    for (let i = 0; i < 4; i++) { const u = 0.22 + i * 0.22, px = sx + (wx - sx) * u, py = sy + (wy - sy) * u + cyo * 0.5, ang = dirA + 0.6 + i * 0.1, len = L * (0.34 - i * 0.03); poly(c, [[px - Math.sin(ang) * L * 0.05, py + Math.cos(ang) * L * 0.05], [px + Math.cos(ang) * len, py + Math.sin(ang) * len], [px + Math.sin(ang) * L * 0.05, py - Math.cos(ang) * L * 0.05]], i % 2 ? dark : base); }
    if (!far) limb(c, [[sx + L * 0.06, sy], [wx, wy]], Math.max(1, L * 0.045), E[5]);
  }
  // o = { flap 0-1, wing (fixed wing angle -1..1), sweep 0-1, talons 0-1, scream, t }
  function eagleVec(c, s, o) {
    const E = EP, a = o.wing !== undefined ? o.wing : Math.sin((o.flap || 0) * PI * 2), tal = clamp01(o.talons || 0);
    eWing(c, s, s * 0.06, -s * 0.06, a, true, o.sweep);
    poly(c, [[-s * 0.24, -s * 0.06], [-s * 0.66, -s * 0.16], [-s * 0.74, -s * 0.02], [-s * 0.66, s * 0.14], [-s * 0.24, s * 0.07]], E[4]);   // the white tail fan
    for (let i = 0; i < 3; i++) poly(c, [[-s * 0.4, -s * 0.05 + i * s * 0.05], [-s * 0.72, -s * 0.12 + i * s * 0.1], [-s * 0.42, -s * 0.01 + i * s * 0.05]], E[5]);
    if (tal > 0.05) for (const q of [0.0, 0.1]) {   // legs thrown forward, talons spread
      const lx = s * (0.02 + q), ly = s * 0.08, fx2 = lx + s * 0.22 * tal, fy2 = ly + s * 0.2 * tal;
      limb(c, [[lx, ly], [lx + s * 0.08 * tal, ly + s * 0.14 * tal], [fx2, fy2]], s * 0.055, q ? E[6] : '#b07a10');
      for (let i = -1; i <= 1; i++) poly(c, [[fx2, fy2 - s * 0.02], [fx2 + s * 0.03, fy2 + s * 0.02], [fx2 + s * (0.13 + 0.02 * i), fy2 + s * (0.06 + i * 0.07)]], q ? E[5] : E[4]);
    }
    ell(c, 0, 0, s * 0.38, s * 0.17, -0.06, E[1]);   // body: dark
    ell(c, s * 0.04, -s * 0.06, s * 0.28, s * 0.07, -0.06, E[2]);
    for (let i = 0; i < 3; i++) poly(c, [[s * (0.14 - i * 0.12), s * 0.02], [s * (0.08 - i * 0.12), s * 0.12], [s * (0.02 - i * 0.12), s * 0.03]], E[0]);   // breast feathers
    // head: white, a heavy brow, a big hooked beak
    c.save(); c.translate(s * 0.3, -s * 0.08); c.scale(1.5, 1.5); c.translate(-s * 0.3, s * 0.08);   // a big head: it has to read at a glance
    const hx = s * 0.36, hy = -s * 0.1, bo = o.scream ? s * 0.07 : 0;
    poly(c, [[hx - s * 0.14, hy + s * 0.08], [hx - s * 0.12, hy - s * 0.08], [hx, hy - s * 0.14], [hx + s * 0.12, hy - s * 0.1], [hx + s * 0.16, hy], [hx + s * 0.06, hy + s * 0.1]], E[4]);
    poly(c, [[hx - s * 0.1, hy - s * 0.07], [hx, hy - s * 0.135], [hx + s * 0.1, hy - s * 0.095], [hx, hy - s * 0.08]], E[5]);
    for (let i = 0; i < 3; i++) poly(c, [[hx - s * (0.1 - i * 0.03), hy + s * 0.06], [hx - s * (0.2 - i * 0.03), hy + s * (0.1 + i * 0.04)], [hx - s * (0.06 - i * 0.03), hy + s * 0.1]], E[4]);   // neck hackles
    poly(c, [[hx + s * 0.11, hy - s * 0.07], [hx + s * 0.29, hy - s * 0.04], [hx + s * 0.31, hy + s * 0.06], [hx + s * 0.24, hy + s * 0.02], [hx + s * 0.13, hy + s * 0.02]], E[6]);   // upper beak, hooked
    poly(c, [[hx + s * 0.26, hy + s * 0.0], [hx + s * 0.31, hy + s * 0.06], [hx + s * 0.27, hy + s * 0.05]], '#8a5a08');
    poly(c, [[hx + s * 0.12, hy + s * 0.03], [hx + s * 0.25, hy + s * 0.04 + bo], [hx + s * 0.12, hy + s * 0.07 + bo * 0.6]], '#b07a10');   // lower beak
    if (bo) poly(c, [[hx + s * 0.13, hy + s * 0.025], [hx + s * 0.24, hy + s * 0.03], [hx + s * 0.23, hy + s * 0.04 + bo * 0.8]], '#3a0408');
    poly(c, [[hx + s * 0.0, hy - s * 0.075], [hx + s * 0.13, hy - s * 0.045], [hx + s * 0.12, hy - s * 0.02], [hx + s * 0.01, hy - s * 0.045]], E[0]);   // the brow
    poly(c, [[hx + s * 0.04, hy - s * 0.045], [hx + s * 0.11, hy - s * 0.025], [hx + s * 0.06, hy - s * 0.015]], E[6]);   // the eye
    c.restore();
    eWing(c, s, s * 0.04, -s * 0.08, a, false, o.sweep);
  }

  // ================= the shell: a spiked jade war-shell, (0, 0) its centre, r its radius =================
  function shellVec(c, r, o) {
    const S = SP, t = o.t || 0;
    c.rotate(o.rot || 0);
    for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2, L = r * (i % 2 ? 0.45 : 0.75); poly(c, [[Math.cos(a - 0.16) * r * 0.92, Math.sin(a - 0.16) * r * 0.92], [Math.cos(a) * (r + L), Math.sin(a) * (r + L)], [Math.cos(a + 0.16) * r * 0.92, Math.sin(a + 0.16) * r * 0.92]], i % 2 ? S[3] : S[5]); }   // spikes
    ell(c, 0, 0, r, r, 0, S[1]);
    ell(c, 0, 0, r * 0.88, r * 0.88, 0, S[2]);
    const hexp = (x, y, q, col) => { const pts = []; for (let i = 0; i < 6; i++) pts.push([x + Math.cos(i / 6 * PI * 2) * q, y + Math.sin(i / 6 * PI * 2) * q]); poly(c, pts, col); };
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + PI / 6; hexp(Math.cos(a) * r * 0.56, Math.sin(a) * r * 0.56, r * 0.27, i % 2 ? S[2] : S[3]); }
    hexp(0, 0, r * 0.32, S[4]);
    const g = 0.5 + 0.5 * Math.sin(t * 0.5);   // the rune in the middle: three claw strokes
    for (let i = -1; i <= 1; i++) poly(c, [[i * r * 0.11 - r * 0.03, -r * 0.16], [i * r * 0.11 + r * 0.03, -r * 0.16], [i * r * 0.11, r * 0.17]], g > 0.4 ? S[6] : S[5]);
  }

  // ================= crisp sprites =================
  function tiger(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x - dir * s * 0.2, y - s * 0.5, s * 3, s * 1.9, c => { c.translate(s * 0.2 * (dir < 0 ? -1 : 1), s * 0.5); c.scale((dir < 0 ? -1 : 1) * (o.stretch || 1), 1 / Math.sqrt(o.stretch || 1)); if (o.rot) c.rotate(o.rot); tigerVec(c, s, o); }, { pal: o.armor ? ALL : TP, alpha: o.a, mono: o.mono });
  }
  function eagle(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x - dir * s * 0.3, y, s * 4, s * 3.4, c => { c.translate(s * 0.3 * (dir < 0 ? -1 : 1), 0); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); eagleVec(c, s, o); }, { pal: EP, alpha: o.a, mono: o.mono });
  }
  function shell(ctx, x, y, r, o) {
    o = o || {};
    PX.sprite(ctx, x, y, r * 3.4, r * 3.4, c => shellVec(c, r, o), { pal: SP, alpha: o.a, mono: o.mono });
  }
  // the chimera: the tiger armoured in jade, with the eagle's wings; (x, y) the ground under it
  function chimera(ctx, x, y, s, dir, o) {
    o = o || {};
    const w = o.wing === undefined ? 0.75 + 0.2 * Math.sin((o.t || 0) * 0.08) : o.wing;
    PX.sprite(ctx, x - dir * s * 0.2, y - s * 0.9, s * 3.2, s * 3, c => {
      c.translate(s * 0.2 * (dir < 0 ? -1 : 1), s * 0.9); c.scale(dir < 0 ? -1 : 1, 1);
      c.save(); c.translate(s * 0.06, -s * 0.66); eWing(c, s * 0.8, 0, 0, w, true, 0); c.restore();
      c.save(); tigerVec(c, s, Object.assign({ armor: true, stand: true }, o)); c.restore();
      c.save(); c.translate(s * 0.02, -s * 0.68); eWing(c, s * 0.8, 0, 0, w, false, 0); c.restore();
    }, { pal: ALL, alpha: o.a, mono: o.mono });
  }
  // the tiger's (or the chimera's) head alone, roaring: (x, y) the back of the skull
  function tigerHead(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x + dir * s * 0.12, y, s * 1.2, s * 1.1, c => {
      c.translate(-s * 0.12 * (dir < 0 ? -1 : 1), 0); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot);
      c.beginPath(); c.moveTo(-s * 0.3, -s * 0.6); c.lineTo(s * 0.9, -s * 0.6); c.lineTo(s * 0.9, s * 0.6); c.lineTo(-s * 0.02, s * 0.36); c.lineTo(-s * 0.3, s * 0.04); c.closePath(); c.clip();
      c.translate(-s * 0.44, s * 0.6); tigerVec(c, s, Object.assign({ stand: true, head: true }, o));
    }, { pal: o.armor ? ALL : TP, alpha: o.a, mono: o.mono });
  }
  Object.assign(KB, { tiger, eagle, shell, chimera, tigerHead });

  // a Vis that rides on the hero; render(ctx, sx, sy, t, v) with (sx, sy) his feet on screen
  function ride(p, z, life, render, tick) {
    const v = new Vis(p.x, p.y, life, render, vv => { if (!vv.free) { vv.x = p.x; vv.y = p.y; } if (tick) tick(vv); if (p.dead) vv.gone = true; });
    v._ugS = 1; z.shots.push(v); return v;
  }
  const casting = p => p.state === 'cast';
  const crack = (ctx, x, y, k, col) => {   // the ground splits under a heavy landing
    ctx.save(); ctx.globalAlpha = 1 - ease((k - 0.5) / 0.5); ctx.strokeStyle = col; ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) { const d = i % 2 ? 1 : -1, L = (18 + i * 9) * ease(k * 4); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d * L * 0.45, y - 1 - (i % 3)); ctx.lineTo(x + d * L, y + (i % 2)); ctx.stroke(); }
    ctx.restore();
  };

  // ================= U: Tiger Pounce =================
  const _tp = CASTS.tiger_pounce;
  CASTS.tiger_pounce = function (p, z) {
    const r = _tp.apply(this, arguments);
    if (!isK(G)) return r;
    const dir = p.face; let end = -1;
    ride(p, z, 30, (ctx, sx, sy, t) => {
      if (end < 0) {
        PX.lines(ctx, sx - dir * 30, sy - 26, dir > 0 ? 0 : PI, 60, 9, t, TP[4], 44);
        tiger(ctx, sx - dir * 6, sy + 2, 70, dir, { pounce: true, roar: 1, t, stretch: t < 4 ? 1.3 : 1.08, rot: -0.1 });
      } else {
        const k = (t - end) / 12;
        tiger(ctx, sx - dir * 6, sy + 2, 70, dir, { pounce: true, roar: 1, t, a: 1 - ease(k * 1.4) });
        PX.claws(ctx, sx + dir * 30, sy - 24, dir > 0 ? 0.5 : PI - 0.5, 34, k, TP, 3);
      }
    }, v => { if (end < 0 && v.t > 2 && !casting(p)) { end = v.t; v.life = v.t + 12; v.free = true; } });
    return r;
  };

  // ================= S+U: Eagle Dive =================
  const _ed = CASTS.eagle_dive;
  CASTS.eagle_dive = function (p, z) {
    const r = _ed.apply(this, arguments);
    if (!isK(G)) return r;
    const dir = p.face; let end = -1;
    ride(p, z, 70, (ctx, sx, sy, t) => {
      const by = sy - 24;
      if (end >= 0) {   // landed: the wings flare, feathers and a ring
        const k = (t - end) / 14;
        eagle(ctx, sx, by - 4 - k * 10, 44, dir, { wing: 0.95, talons: 1, scream: true, a: 1 - ease(k * 1.3) });
        ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = EP[4]; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy, 10 + k * 60, 3 + k * 8, 0, 0, PI * 2); ctx.stroke(); ctx.restore();
      } else if (t < 10) eagle(ctx, sx, by, 44, dir, { wing: t < 4 ? 0.9 : -0.7, rot: -0.9, t });   // the climb: one great wingbeat
      else {   // the stoop
        PX.lines(ctx, sx, by - 40, PI / 2, 70, 10, t, EP[4], 60);
        eagle(ctx, sx, by, 44, dir, { wing: 0.75, sweep: 1, talons: 1, scream: true, rot: 1.0, t });
      }
    }, v => {
      if (end < 0 && v.t > 10 && (p.onGround || !casting(p))) { end = v.t; v.life = v.t + 14; v.free = true; for (let i = 0; i < 10; i++) part(p.x + rand(-16, 16), p.y - rand(4, 30), i % 2 ? '#c4e2ff' : '#ffffff', rand(-2.5, 2.5), -rand(0.5, 3), 22, 2, 0.1); }
    });
    return r;
  };

  // ================= I: Tortoise Shell =================
  const _ts = CASTS.tortoise_shell;
  CASTS.tortoise_shell = function (p, z) {
    const r = _ts.apply(this, arguments);
    if (!isK(G)) return r;
    const dir = p.face; let end = -1;
    ride(p, z, 60, (ctx, sx, sy, t) => {
      const cy = sy - 20;
      if (end < 0) {
        PX.lines(ctx, sx - dir * 24, cy, dir > 0 ? 0 : PI, 50, 7, t, SP[4], 40);
        ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = SP[4]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, cy, 30, t * 0.6, t * 0.6 + 2.2); ctx.stroke(); ctx.beginPath(); ctx.arc(sx, cy, 34, t * 0.6 + PI, t * 0.6 + PI + 1.6); ctx.stroke(); ctx.restore();   // the spin smear
        shell(ctx, sx, cy, 22, { rot: dir * t * 0.7, t });
        if (t % 2 === 0) part(p.x - dir * 10, p.y - 1, t % 4 ? '#7ce68a' : '#ffffff', -dir * rand(1, 3), -rand(0.5, 2), 12, 2);
      } else {   // the crash
        const k = (t - end) / 16, ik = (t - end) / 5;
        PX.impact(ctx, sx + dir * 14, cy, ik, 3);
        crack(ctx, sx + dir * 10, sy, k, SP[4]);
        shell(ctx, sx + dir * 6, cy - (1 - ease(k * 3)) * 2, 22 + (1 - ease(k * 2)) * 8, { rot: dir * end * 0.7, t, a: 1 - ease((k - 0.5) / 0.5), mono: ik < 0.5 ? '#ffffff' : undefined });
      }
    }, v => { if (end < 0 && v.t > 2 && !casting(p)) { end = v.t; v.life = v.t + 16; v.free = true; } });
    return r;
  };

  // ================= S+I: Three Beasts =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.kova;
  if (BU && BU.cast) {
    const _tb = BU.cast;
    BU.cast = function (p, z) {
      const r = _tb.apply(this, arguments);
      if (!isK(G)) return r;
      const dir = p.face; let end = -1;
      ride(p, z, 90, (ctx, sx, sy, t) => {
        if (end >= 0) {   // the shell has landed
          const k = (t - end) / 18, ik = (t - end) / 5;
          PX.impact(ctx, sx, sy - 16, ik, 5);
          crack(ctx, sx, sy, k, SP[4]);
          shell(ctx, sx, sy - 22, 28 + (1 - ease(k * 2)) * 10, { rot: 0.3, t, a: 1 - ease((k - 0.5) / 0.5), mono: ik < 0.5 ? '#ffffff' : undefined });
        } else if (t <= 12) {   // the tiger's charge
          PX.lines(ctx, sx - dir * 30, sy - 26, dir > 0 ? 0 : PI, 60, 8, t, TP[4], 44);
          tiger(ctx, sx - dir * 4, sy + 2, 72, dir, { run: (t % 8) / 8, roar: 1, t, stretch: 1.12 });
        } else if (t < 24) {   // the eagle's rise
          PX.lines(ctx, sx, sy + 10, -PI / 2, 60, 8, t, EP[4], 50);
          eagle(ctx, sx, sy - 26, 46, dir, { wing: t < 17 ? 0.9 : -0.6, rot: -1.1, scream: true, t });
        } else {   // the shell comes down
          PX.lines(ctx, sx, sy - 60, PI / 2, 60, 8, t, SP[4], 44);
          shell(ctx, sx, sy - 22, 28, { rot: t * 0.5, t });
        }
      }, v => { if (end < 0 && v.t > 24 && (p.onGround || !casting(p))) { end = v.t; v.life = v.t + 18; v.free = true; } });
      return r;
    };
  }

  // ================= W+O: Pack Charge: the three spirits themselves =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.kova;
  if (SIG && SIG.cast) {
    const _pc = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _pc.apply(this, arguments);
      if (!isK(G)) return r;
      const gy = p.y, seen = new Set();
      z.shots.push(new Vis(p.x, p.y, 26, null, () => {
        const zs = G.zone && G.zone.shots; if (!zs) return;
        zs.forEach(s => {
          if (seen.has(s) || !(s instanceof SW.Proj) || s.w !== 22 || s.h !== 18 || s.maxHits !== 2) return;
          seen.add(s);
          const sp = Math.round(Math.abs(s.vx));
          s.render = (ctx, x, y, q) => {
            const d = Math.sign(q.vx) || 1, fy = y + (gy - q.y);
            if (sp >= 7) { PX.lines(ctx, x - d * 30, y, d > 0 ? 0 : PI, 40, 4, q.t, TP[4], 24); tiger(ctx, x - d * 8, fy + 2, 56, d, { run: (q.t % 8) / 8, roar: 1, t: q.t, stretch: 1.1 }); }
            else if (sp === 6) eagle(ctx, x, y - 6, 34, d, { flap: (q.t % 10) / 10, talons: 1, scream: true, t: q.t, rot: 0.15 });
            else { shell(ctx, x, fy - 18, 17, { rot: d * q.t * 0.6, t: q.t }); if (q.t % 2 === 0) part(q.x - d * 8, gy - 1, '#7ce68a', -d * rand(1, 2), -rand(0.5, 1.5), 10, 2); }
          };
        });
      }));
      return r;
    };
  }

  // ================= J x4: the tiger's paw =================
  const FIN = SW.clanmelee && SW.clanmelee.FIN;
  if (FIN && FIN.kova) {
    const _fk = FIN.kova;
    FIN.kova = function (p, z) {
      const r = _fk.apply(this, arguments);
      if (!isK(G)) return r;
      const dir = p.face;
      const v = new Vis(p.x + dir * 26, p.y - 24, 14, (ctx, sx, sy, t) => {
        const k = t / 14;
        tigerHead(ctx, sx - dir * 44, sy - 2, 60, dir, { roar: 1, t, a: 0.9 * (1 - ease(k * 1.2)) });
        PX.claws(ctx, sx, sy, dir > 0 ? 0.45 : PI - 0.45, 40, k, TP, 3);
      });
      z.shots.push(v);
      return r;
    };
  }

  // ================= S+O and O: Wild Heart and Chimera =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, top = sy - (p.h || 34);
    if (front) return;
    if (p.awakeT > 0) {   // the chimera stands over him
      const fade = Math.min(1, p.awakeT / 30), roar = (p.t % 260) < 24 ? 1 : 0.35;
      tigerHead(ctx, sx - d * 20, top + 4, 26, d, { armor: true, roar, t: p.t, a: 0.85 * fade });   // small: only its head by his shoulder
    } else if (p.modeT > 0) {   // the head of his current beast looms behind him
      const fade = Math.min(1, p.modeT / 30), f = p.form || 'tiger', br = Math.sin(p.t * 0.07) * 2;
      if (f === 'eagle') eagle(ctx, sx - d * 10, top - 2 + br, 16, d, { wing: 0.85, scream: (p.t % 120) < 16, t: p.t, a: 0.8 * fade });
      else if (f === 'tortoise') shell(ctx, sx - d * 14, top + 4 + br * 0.5, 7, { rot: p.t * 0.03, t: p.t, a: 0.6 * fade });
      else tigerHead(ctx, sx - d * 20, top + 4 + br, 26, d, { roar: (p.t % 120) < 18 ? 1 : 0.3, t: p.t, a: 0.85 * fade });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isK(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    return _pd.apply(this, arguments);
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isK(g || this.G) && z && z.shots && !this.dead && this.awakeT > a0 + 60) {   // Chimera: it erupts behind him, roaring
      const d = this.face, p = this;
      ride(p, z, 16, (ctx, sx, sy, t) => {   // short and small: a flash of the chimera, then it is gone
        const k = t / 16;
        chimera(ctx, sx - d * 26, sy, 40 + (1 - ease(t / 6)) * 14, d, { roar: 1, t, wing: 0.95, mono: t < 3 ? '#ffffff' : undefined, a: 1 - ease((k - 0.6) / 0.4) });
      });
    }
    return r;
  };

  // ================= W+I: Primal Parade =================
  const _ult = N.ULT.primal_parade;
  if (_ult) N.ULT.primal_parade = function (p, z, foes) {
    const r = _ult.apply(this, arguments);
    if (!isK(G)) return r;
    if (N.every(p, 12, 52, 7)) {   // each beast strikes in turn, on the ultimate's own beat
      const k = (p.st - 12) / 7 | 0, d = k % 2 ? -1 : 1;
      foes.forEach(e => {
        if (!e || e.dead) return;
        const b = e.box(), cx = b.x + b.w / 2, cy = b.y + b.h / 2, gy = e.y;
        const v = new Vis(cx, cy, 12, (ctx, sx, sy, t) => {
          const q = t / 12;
          if (k % 3 === 0) { tiger(ctx, sx - d * 60 + d * 110 * q, sy + (gy - cy) + 2, 62, d, { pounce: true, roar: 1, t, stretch: 1.2, a: 1 - ease((q - 0.7) / 0.3) }); PX.claws(ctx, sx, sy, d > 0 ? 0.5 : PI - 0.5, 30, q, TP, 3); }
          else if (k % 3 === 1) eagle(ctx, sx - d * 50 + d * 80 * q, sy - 70 + 90 * q, 40, d, { wing: 0.75, sweep: 1, talons: 1, scream: true, rot: 0.9, t, a: 1 - ease((q - 0.7) / 0.3) });
          else shell(ctx, sx, sy - 80 + 80 * ease(q * 1.6), 22, { rot: t * 0.6, t, a: 1 - ease((q - 0.75) / 0.25) });
        });
        v._ugS = 1; z.shots.push(v);
      });
    }
    if (p.st === 8) { const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0]; if (T) finale(p, z, T); }
    return r;
  };
  // the finishing blow: the chimera's head roars in close-up beside the target, then a giant claw rakes it
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('kova') : null, FIN2 = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN2 - 30) : 30;
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN2 + 16) return;
      const cy = sy - 20;
      if (st < FIN2) {
        const k = ease((st - (BU2 - 2)) / 8), sh = st > FIN2 - 12 ? Math.sin(st * 2.3) * 1.5 : 0;   // it shakes with the roar
        tigerHead(ctx, sx - dir * 96 + sh, cy - 6, 150, dir, { armor: true, roar: st > BU2 + 4 ? 1 : 0.3, t: st, a: k });
      } else {
        const k = (st - FIN2) / 16, ik = (st - FIN2) / 5;
        PX.impact(ctx, sx, cy, ik, 13);
        tigerHead(ctx, sx - dir * 96 + dir * k * 30, cy - 6, 150, dir, { armor: true, roar: 1, t: st, a: 1 - ease((k - 0.4) / 0.6), mono: ik < 0.5 ? '#ffffff' : undefined });
        PX.claws(ctx, sx, cy, dir > 0 ? 0.6 : PI - 0.6, 70, k, TP, 4);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
