'use strict';
// Shattered Worlds — Hollis's legendary beasts (the user, 2026-11-20: "Hollis: his swamp, make frogs jump up and down; try
// to include legend animals; the turtle: add spikes on the back, shell brown, and throw fire after landing; and other
// skill: add a bull with wings that runs over; and add other"). The old mountain sage calls the beasts of the old stories.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/brakk-dragon.js; only wraps.
//   U      Mountain Palm: a winged bull charges out and runs them over
//   S+U    Mudslick: a swamp, reeds and bubbles, and frogs jumping up and down in it (one lands on every trip)
//   I      Old Shell: a brown tortoise with a spiked shell drops, lands, and breathes fire
//   S+I    Boulder Fall: a roc carries the boulder over the target and lets it go
//   W+O    Stone Garden: a stone serpent coils up through the spires and hisses
//   J x4   the finisher: a golden three-legged toad springs out of the ground
//   S+O    Deep Root: roots spread from his feet and two frogs hop round him
//   O      Mountain Heart: a white crane swoops down and circles over him
//   W+I    Elder Mountain: a colossal spiked tortoise carrying a mountain stamps three times; at the finishing blow
//          (js/ult-grand.js) its head comes in close and breathes fire on the target
// SW.hollisBeasts.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !CASTS.old_shell || !CASTS.mudslick || !CASTS.mountain_palm) return;
  const HB = SW.hollisBeasts = { on: true };
  const isH = g => !!(HB.on && g && g.state && g.state.hero === 'hollis');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const shape = (ctx, pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); };
  const paint = (ctx, fill, line) => { ctx.fillStyle = fill; ctx.fill(); if (line) { ctx.strokeStyle = line; ctx.stroke(); } };
  const ell = (ctx, x, y, rx, ry, r, fill, line) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), r || 0, 0, PI * 2); paint(ctx, fill, line); };
  // every drawer: (ctx, x, y, s, dir, o): (x, y) the feet on the ground (or the body for flyers), s the size in pixels
  function frame(ctx, x, y, s, dir, o) { ctx.save(); ctx.translate(x, y); ctx.scale((dir < 0 ? -1 : 1) * s, s); if (o && o.rot) ctx.rotate(o.rot); if (o && o.a !== undefined) ctx.globalAlpha *= clamp01(o.a); ctx.lineWidth = Math.max(1, s / 45) / s; ctx.lineJoin = 'round'; }

  // ================= the frog (and the golden three-legged toad) =================
  const FROG = { body: '#4f9a3a', dark: '#2c5a20', belly: '#d8e8a0', spot: '#3a7a2a', eye: '#f2d64a', sac: '#e8eeb0' };
  const TOAD = { body: '#d9a12c', dark: '#7a4e10', belly: '#ffe8a0', spot: '#a8701a', eye: '#ff6a2a', sac: '#fff0c0' };
  function frog(ctx, x, y, s, dir, o) {
    o = o || {};
    const k = clamp01(o.leap || 0), C = o.gold ? TOAD : FROG, sac = clamp01(o.sac || 0);
    frame(ctx, x, y, s, dir, o);
    // the hind leg: folded on the ground, stretched out behind in the air
    if (k < 0.35) { ell(ctx, -0.25, -0.2, 0.26, 0.15, -0.3, C.dark, C.dark); shape(ctx, [[-0.4, -0.05], [0.12, -0.03], [0.18, 0], [-0.42, 0]]); paint(ctx, C.dark); }
    else { shape(ctx, [[-0.2, -0.3], [-0.55, -0.1 + k * 0.05], [-0.95, 0.05 + k * 0.12], [-0.98, 0.12 + k * 0.12], [-0.5, -0.02 + k * 0.05], [-0.12, -0.18]]); paint(ctx, C.dark); }
    if (o.gold) { shape(ctx, [[-0.05, -0.1], [-0.02, 0.02], [0.06, 0.02]]); paint(ctx, C.dark); }   // the third leg, behind
    // body and head in one
    ctx.beginPath(); ctx.moveTo(-0.45, -0.22); ctx.quadraticCurveTo(-0.4, -0.62, 0.05, -0.62); ctx.quadraticCurveTo(0.42, -0.62, 0.52, -0.42);
    ctx.quadraticCurveTo(0.5, -0.28, 0.3, -0.18); ctx.quadraticCurveTo(-0.1, -0.08, -0.45, -0.22); ctx.closePath(); paint(ctx, C.body, C.dark);
    ctx.beginPath(); ctx.moveTo(0.48, -0.38); ctx.quadraticCurveTo(0.2, -0.14, -0.3, -0.18); ctx.quadraticCurveTo(0.05, -0.2, 0.5, -0.4); ctx.closePath(); paint(ctx, C.belly);
    [[-0.22, -0.45, 0.06], [0.0, -0.52, 0.05], [-0.08, -0.35, 0.04]].forEach(q => ell(ctx, q[0], q[1], q[2], q[2] * 0.8, 0, C.spot));
    if (sac > 0.05) ell(ctx, 0.32, -0.24, 0.12 + sac * 0.1, 0.08 + sac * 0.08, 0, C.sac, C.dark);   // the croak
    ctx.strokeStyle = C.dark; ctx.beginPath(); ctx.moveTo(0.5, -0.41); ctx.quadraticCurveTo(0.35, -0.36, 0.18, -0.4); ctx.stroke();
    if (o.coin) { ell(ctx, 0.52, -0.39, 0.07, 0.07, 0, '#ffe066', '#8a5a10'); }
    ell(ctx, 0.26, -0.64, 0.12, 0.12, 0, C.body, C.dark); ell(ctx, 0.28, -0.66, 0.08, 0.08, 0, C.eye); ell(ctx, 0.29, -0.66, 0.025, 0.06, 0, '#101008'); ell(ctx, 0.25, -0.7, 0.02, 0.02, 0, '#ffffff');
    // the front leg
    shape(ctx, [[0.22, -0.24], [0.3, -0.24], [0.4 + k * 0.1, 0 - k * 0.1], [0.3 + k * 0.1, 0 - k * 0.1]]); paint(ctx, C.body, C.dark);
    ctx.restore();
  }
  HB.frog = frog;

  // ================= the spiked tortoise (Old Shell, and the Elder Mountain) =================
  const TT = { shell: '#7a4a24', rim: '#4a2a12', plate: '#9a6234', ridge: '#5a3418', spike: '#e2d2a8', tip: '#3a2814', skin: '#6a5a3a', skinD: '#3e321e', eye: '#ffb020', moss: '#5f8a3a' };
  // the point on the dome at angle a (0 = back rim, PI = front rim), and the outward normal
  const dome = a => [-Math.cos(a) * 0.5, -0.12 - Math.sin(a) * 0.43];
  function tortoise(ctx, x, y, s, dir, o) {
    o = o || {};
    const jaw = clamp01(o.jaw || 0), st = o.step || 0;
    frame(ctx, x, y, s, dir, o);
    // far legs, tail
    shape(ctx, [[-0.32, -0.14], [-0.18, -0.14], [-0.2, 0], [-0.34, 0]]); paint(ctx, TT.skinD, TT.skinD);
    shape(ctx, [[0.2, -0.14], [0.34, -0.14], [0.36, 0], [0.22, 0]]); paint(ctx, TT.skinD, TT.skinD);
    shape(ctx, [[-0.48, -0.16], [-0.66, -0.06], [-0.46, -0.08]]); paint(ctx, TT.skin, TT.skinD);
    // head and neck, the jaw opening for fire
    ctx.save(); ctx.translate(0.48, -0.2); ctx.rotate(-(o.lift || 0));
    shape(ctx, [[-0.06, -0.06], [0.14, -0.12], [0.16, 0.0], [-0.04, 0.08]]); paint(ctx, TT.skin, TT.skinD);
    ctx.save(); ctx.translate(0.16, -0.06); ctx.rotate(jaw * 0.6);
    shape(ctx, [[-0.02, 0.0], [0.17, 0.02], [0.12, 0.07], [-0.02, 0.07]]); paint(ctx, TT.skinD, TT.skinD);   // lower jaw
    ctx.restore();
    if (jaw > 0.05) { shape(ctx, [[0.14, -0.06], [0.33, -0.06], [0.33 - jaw * 0.02, 0.02 + jaw * 0.1], [0.15, 0.0]]); paint(ctx, '#3a0a04'); }
    shape(ctx, [[0.1, -0.15], [0.3, -0.15], [0.36, -0.08], [0.33, -0.05], [0.14, -0.05]]); paint(ctx, TT.skin, TT.skinD);   // the head, a hooked beak
    shape(ctx, [[0.3, -0.13], [0.37, -0.09], [0.33, -0.04]]); paint(ctx, '#2a2216');
    ell(ctx, 0.22, -0.12, 0.028, 0.022, 0, TT.eye); ell(ctx, 0.225, -0.12, 0.008, 0.018, 0, '#100800');
    if (o.glow !== false) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= 0.5; ell(ctx, 0.22, -0.12, 0.06, 0.05, 0, TT.eye); ctx.restore(); }
    ctx.restore();
    // the shell: a brown dome of plates, ringed by spikes
    ctx.beginPath(); ctx.moveTo(-0.5, -0.12); for (let a = 0; a <= PI + 0.01; a += PI / 24) { const q = dome(a); ctx.lineTo(q[0], q[1]); } ctx.closePath(); paint(ctx, TT.shell, TT.rim);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-0.5, -0.12); for (let a = 0; a <= PI + 0.01; a += PI / 24) { const q = dome(a); ctx.lineTo(q[0], q[1]); } ctx.closePath(); ctx.clip();
    ctx.strokeStyle = TT.ridge;
    for (let i = 0; i < 3; i++) { const yy = -0.2 - i * 0.12; ctx.beginPath(); ctx.moveTo(-0.6, yy); ctx.lineTo(0.6, yy); ctx.stroke(); }
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 0.18, -0.12); ctx.lineTo(i * 0.13, -0.6); ctx.stroke(); }
    for (let i = -2; i <= 2; i++) for (let j = 0; j < 3; j++) ell(ctx, i * 0.16 + (j % 2) * 0.08 - 0.04, -0.26 - j * 0.12, 0.05, 0.03, 0, TT.plate);
    ell(ctx, -0.1, -0.44, 0.22, 0.06, -0.2, 'rgba(255,220,170,0.18)');
    ctx.restore();
    shape(ctx, [[-0.54, -0.1], [0.54, -0.1], [0.52, -0.16], [-0.52, -0.16]]); paint(ctx, TT.rim, TT.rim);
    for (let i = 0; i < 9; i++) {   // the spikes
      const a = 0.18 + i * (PI - 0.36) / 8, q = dome(a), nx = -Math.cos(a), ny = -Math.sin(a), tx = -ny, ty = nx, L = i % 2 ? 0.13 : 0.18, w = 0.045;
      shape(ctx, [[q[0] + tx * w, q[1] + ty * w], [q[0] - tx * w, q[1] - ty * w], [q[0] + nx * L, q[1] + ny * L * 1.1]]); paint(ctx, TT.spike, TT.tip);
      shape(ctx, [[q[0] + nx * L * 0.6 + tx * w * 0.4, q[1] + ny * L * 0.66 + ty * w * 0.4], [q[0] + nx * L * 0.6 - tx * w * 0.4, q[1] + ny * L * 0.66 - ty * w * 0.4], [q[0] + nx * L, q[1] + ny * L * 1.1]]); paint(ctx, TT.tip);
    }
    if (o.mountain) mountain(ctx);
    // near legs, stamping
    const lf = Math.max(0, st) * 0.12;
    shape(ctx, [[-0.4, -0.14], [-0.22, -0.14], [-0.22, 0], [-0.42, 0]]); paint(ctx, TT.skin, TT.skinD);
    shape(ctx, [[0.18, -0.14], [0.38, -0.14], [0.4, -lf], [0.18, -lf]]); paint(ctx, TT.skin, TT.skinD);
    ctx.fillStyle = TT.spike; for (let i = 0; i < 3; i++) { shape(ctx, [[0.19 + i * 0.07, -lf], [0.23 + i * 0.07, -lf], [0.21 + i * 0.07, 0.04 - lf]]); ctx.fill(); }
    ctx.restore();
  }
  // the mountain on the Elder's back: two peaks, pines and moss, a small shrine
  function mountain(ctx) {
    shape(ctx, [[-0.42, -0.42], [-0.18, -1.05], [0.0, -0.7], [0.14, -0.95], [0.44, -0.4]]); paint(ctx, '#6e6a62', '#2e2c28');
    shape(ctx, [[-0.18, -1.05], [-0.1, -0.9], [-0.2, -0.86], [-0.26, -0.92]]); paint(ctx, '#e8ece0');
    shape(ctx, [[0.14, -0.95], [0.2, -0.84], [0.1, -0.82]]); paint(ctx, '#e8ece0');
    shape(ctx, [[-0.42, -0.42], [-0.3, -0.6], [0.3, -0.62], [0.44, -0.4]]); paint(ctx, TT.moss);
    for (let i = 0; i < 6; i++) { const px = -0.34 + i * 0.13, py = -0.56 - (i % 2) * 0.05; shape(ctx, [[px - 0.04, py + 0.04], [px, py - 0.12], [px + 0.04, py + 0.04]]); paint(ctx, '#2e4a22'); }
    shape(ctx, [[0.02, -0.66], [0.12, -0.66], [0.12, -0.6], [0.02, -0.6]]); paint(ctx, '#a83a2a');
    shape(ctx, [[-0.01, -0.66], [0.07, -0.72], [0.15, -0.66]]); paint(ctx, '#3a2a20');
  }
  HB.tortoise = tortoise;
  // fire breath from (x, y) toward dir, len pixels, t for the flicker
  function fire(ctx, x, y, len, dir, t, a) {
    ctx.save(); ctx.globalAlpha *= clamp01(a === undefined ? 1 : a);
    const COL = ['#b0200a', '#ff5a1a', '#ffa020', '#fff0a0'];
    for (let i = 14; i >= 0; i--) {
      const u = i / 14, px = x + dir * len * u, py = y - Math.sin(u * 3 + t * 0.7) * 2 * u - u * u * 6, r = 2 + u * len * 0.14 + Math.sin(t * 0.9 + i) * 1.2;
      for (let c = 0; c < 4; c++) { ctx.fillStyle = COL[c]; ctx.beginPath(); ctx.arc(px, py, Math.max(0.5, r * (1 - c * 0.24)), 0, PI * 2); ctx.fill(); }
    }
    ctx.restore();
    art.glow(ctx, Math.round(x + dir * len * 0.5), Math.round(y - 3), Math.round(len * 0.4), '#ff7a20', 0.14);
  }
  HB.fire = fire;

  // ================= the winged bull =================
  const BL = { body: '#4b3326', hi: '#7a5440', dark: '#24160f', horn: '#efe2c0', hoof: '#1a1210', wing: '#f2ead2', edge: '#d9a441', eye: '#ff7a2a' };
  function bull(ctx, x, y, s, dir, o) {
    o = o || {};
    const t = o.t || 0, gal = t * 0.55, flap = Math.sin(t * 0.45);
    frame(ctx, x, y, s, dir, o);
    const wing = (sh, col, ang) => {   // a feathered wing from the shoulder, raised and swept back
      ctx.save(); ctx.translate(0.08, -0.74); ctx.rotate(ang);
      shape(ctx, [[0, 0], [-0.2, -0.32], [-0.5, -0.56], [-0.78, -0.62], [-0.7, -0.48], [-0.86, -0.44], [-0.72, -0.32], [-0.84, -0.24], [-0.6, -0.14], [-0.66, -0.04], [-0.3, 0.02]]);
      paint(ctx, col, BL.edge);
      ctx.strokeStyle = BL.edge; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-0.12 * i, -0.06 * i); ctx.lineTo(-0.2 - 0.18 * i, -0.44 + 0.1 * i); ctx.stroke(); }
      ctx.restore(); void sh;
    };
    wing(0, '#c8bfa6', -0.25 + flap * 0.35);   // the far wing
    const leg = (hx, ph, col) => { const a = Math.sin(gal + ph) * 0.55, kx = hx + Math.sin(a) * 0.2, ky = -0.25 + Math.cos(a) * 0.02, fx2 = kx + Math.sin(a + Math.max(0, Math.cos(gal + ph)) * 0.9) * 0.18;
      ctx.strokeStyle = col; ctx.lineWidth = 0.075; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx, -0.42); ctx.lineTo(kx, ky); ctx.lineTo(fx2, -0.02); ctx.stroke();
      ctx.lineWidth = Math.max(1, s / 45) / s; ell(ctx, fx2, -0.02, 0.045, 0.03, 0, BL.hoof); };
    leg(-0.28, 1.6, BL.dark); leg(0.22, 0.2, BL.dark);
    // tail
    ctx.strokeStyle = BL.dark; ctx.lineWidth = 0.035; ctx.beginPath(); ctx.moveTo(-0.42, -0.6); ctx.quadraticCurveTo(-0.6, -0.5 + Math.sin(t * 0.4) * 0.08, -0.62, -0.32); ctx.stroke(); ctx.lineWidth = Math.max(1, s / 45) / s;
    ell(ctx, -0.62, -0.3, 0.04, 0.07, 0, BL.dark);
    // body, hump, head lowered to charge
    ctx.beginPath(); ctx.moveTo(-0.44, -0.62); ctx.quadraticCurveTo(-0.42, -0.36, -0.2, -0.36); ctx.lineTo(0.28, -0.38); ctx.quadraticCurveTo(0.46, -0.4, 0.5, -0.56);
    ctx.quadraticCurveTo(0.42, -0.88, 0.14, -0.84); ctx.quadraticCurveTo(-0.2, -0.78, -0.44, -0.62); ctx.closePath(); paint(ctx, BL.body, BL.dark);
    ell(ctx, 0.05, -0.74, 0.3, 0.06, -0.1, BL.hi);
    shape(ctx, [[0.42, -0.7], [0.72, -0.56], [0.78, -0.42], [0.66, -0.36], [0.46, -0.44]]); paint(ctx, BL.body, BL.dark);   // head
    ell(ctx, 0.74, -0.42, 0.05, 0.035, 0, '#6a4a3a', BL.dark);   // muzzle
    ell(ctx, 0.6, -0.58, 0.03, 0.022, 0, BL.eye);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= 0.5; ell(ctx, 0.6, -0.58, 0.06, 0.04, 0, BL.eye); ctx.restore();
    ctx.beginPath(); ctx.moveTo(0.52, -0.68); ctx.quadraticCurveTo(0.6, -0.86, 0.82, -0.84); ctx.quadraticCurveTo(0.66, -0.78, 0.58, -0.64); ctx.closePath(); paint(ctx, BL.horn, BL.dark);   // horns
    ctx.beginPath(); ctx.moveTo(0.46, -0.7); ctx.quadraticCurveTo(0.46, -0.9, 0.66, -0.94); ctx.quadraticCurveTo(0.52, -0.84, 0.52, -0.68); ctx.closePath(); paint(ctx, '#c8bc9c', BL.dark);
    shape(ctx, [[0.74, -0.38], [0.8, -0.36], [0.76, -0.33]]); paint(ctx, '#ffd24a');   // nose ring
    leg(-0.3, 4.7, BL.body); leg(0.24, 3.3, BL.body);
    wing(1, BL.wing, -0.15 + flap * 0.45);   // the near wing
    ctx.restore();
  }
  HB.bull = bull;

  // ================= birds: the roc and the crane =================
  const ROC = { body: '#5a3a20', wing: '#6b4626', tip: '#2e1e10', head: '#efe4c8', beak: '#e0a828', eye: '#ffcf40' };
  const CRANE = { body: '#f4f4ee', wing: '#ececE4', tip: '#1a1a1a', head: '#f4f4ee', beak: '#8a8a70', crown: '#d8202a', neck: '#1a1a1a', eye: '#ffcf40' };
  function bird(ctx, x, y, s, dir, o) {
    o = o || {};
    const crane = !!o.crane, C = crane ? CRANE : ROC, f = Math.sin((o.t || 0) * (o.beat || 0.3));
    frame(ctx, x, y, s, dir, o);
    const wing = (col, up) => {
      const tipY = -0.75 * up, mid = -0.3 * up;
      shape(ctx, [[0.12, -0.05], [-0.05, mid - 0.05], [-0.3, tipY], [-0.42, tipY + 0.06], [-0.4, tipY + 0.16], [-0.5, tipY + 0.2], [-0.42, tipY + 0.3], [-0.5, tipY + 0.36], [-0.36, mid + 0.18], [-0.2, 0.06]]);
      paint(ctx, col, C.tip);
      shape(ctx, [[-0.3, tipY], [-0.42, tipY + 0.06], [-0.4, tipY + 0.16], [-0.5, tipY + 0.2], [-0.42, tipY + 0.3], [-0.5, tipY + 0.36], [-0.38, tipY + 0.3]]); paint(ctx, C.tip);
    };
    wing(crane ? '#d8d8d0' : ROC.tip, 0.6 + f * 0.6);   // far wing
    if (crane) { ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 0.025; ctx.beginPath(); ctx.moveTo(-0.2, 0.02); ctx.lineTo(-0.62, 0.08); ctx.moveTo(-0.2, 0.04); ctx.lineTo(-0.62, 0.12); ctx.stroke(); ctx.lineWidth = Math.max(1, s / 45) / s; }   // trailing legs
    else { shape(ctx, [[-0.32, -0.04], [-0.55, -0.12], [-0.58, 0.02], [-0.55, 0.12], [-0.32, 0.06]]); paint(ctx, ROC.body, ROC.tip); }   // tail fan
    ell(ctx, -0.04, 0, 0.32, 0.12, 0, C.body, C.tip);
    if (crane) {   // the long neck, black, the red crown
      ctx.strokeStyle = C.neck; ctx.lineWidth = 0.06; ctx.beginPath(); ctx.moveTo(0.2, -0.02); ctx.quadraticCurveTo(0.4, -0.08, 0.56, -0.08); ctx.stroke(); ctx.lineWidth = Math.max(1, s / 45) / s;
      ell(ctx, 0.6, -0.09, 0.06, 0.045, 0, C.head, '#888'); ell(ctx, 0.6, -0.13, 0.03, 0.018, 0, C.crown);
      shape(ctx, [[0.65, -0.1], [0.86, -0.07], [0.65, -0.065]]); paint(ctx, C.beak); ell(ctx, 0.62, -0.1, 0.012, 0.012, 0, '#101010');
    } else {
      ell(ctx, 0.34, -0.06, 0.12, 0.09, 0, C.head, '#8a7a5a');
      ctx.beginPath(); ctx.moveTo(0.42, -0.1); ctx.quadraticCurveTo(0.56, -0.1, 0.55, 0.0); ctx.lineTo(0.5, -0.02); ctx.lineTo(0.42, -0.02); ctx.closePath(); paint(ctx, C.beak, '#6a4a10');
      ell(ctx, 0.37, -0.09, 0.022, 0.018, 0, C.eye); ell(ctx, 0.375, -0.09, 0.008, 0.012, 0, '#100800');
      shape(ctx, [[0.24, -0.1], [0.34, -0.15], [0.3, -0.08]]); paint(ctx, '#3a2414');   // a brow over the eye
      if (o.talons) { ctx.strokeStyle = '#e0a828'; ctx.lineWidth = 0.03; ctx.beginPath(); ctx.moveTo(0.02, 0.08); ctx.lineTo(0.04, 0.22); ctx.moveTo(-0.08, 0.08); ctx.lineTo(-0.06, 0.22); ctx.stroke(); ctx.lineWidth = Math.max(1, s / 45) / s; }
    }
    wing(C.wing, 0.6 - f * 0.7);   // near wing
    ctx.restore();
  }
  HB.bird = bird;
  // a mossy boulder with cracks
  function boulder(ctx, x, y, r, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.lineWidth = 1;
    const pts = []; for (let i = 0; i < 9; i++) { const a = i / 9 * PI * 2, rr = r * (0.86 + 0.18 * Math.sin(i * 7.3)); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    shape(ctx, pts); paint(ctx, '#7a6a58', '#2e261e');
    ell(ctx, 0, r * 0.35, r * 0.8, r * 0.45, 0, '#5a4c3e'); ell(ctx, -r * 0.3, -r * 0.35, r * 0.4, r * 0.22, -0.3, '#b0a088');
    shape(ctx, [[-r * 0.8, -r * 0.35], [-r * 0.2, -r * 0.95], [r * 0.5, -r * 0.8], [r * 0.2, -r * 0.55], [-r * 0.5, -r * 0.3]]); paint(ctx, '#6a994e');
    ctx.strokeStyle = '#2e261e'; ctx.beginPath(); ctx.moveTo(r * 0.1, -r * 0.2); ctx.lineTo(r * 0.35, r * 0.15); ctx.lineTo(r * 0.2, r * 0.5); ctx.stroke();
    ctx.restore();
  }

  // ================= U: Mountain Palm: the winged bull =================
  const _mp = CASTS.mountain_palm;
  CASTS.mountain_palm = function (p, z) {
    const n0 = z.shots.length, r = _mp.apply(this, arguments);
    if (!isH(G)) return r;
    const pr = z.shots.slice(n0).find(s => s.render && s.vx); if (!pr) return r;   // (the pose timer is pushed first)
    const gy = p.y;
    pr.render = (ctx, x, y, s) => {
      const d = Math.sign(s.vx) || 1, fy = y + (gy - s.y), a = s.life < 5 ? s.life / 5 : 1;
      if (s.t % 2 === 0) part(s.x - d * 14, gy - 2, '#a89a80', -d * rand(0.5, 1.5), -rand(0.3, 1.2), 14, 2);
      bull(ctx, x - d * 6, fy, 46, d, { t: s.t, a });
    };
    return r;
  };

  // ================= S+U: Mudslick: the swamp and its frogs =================
  const _ms = CASTS.mudslick;
  CASTS.mudslick = function (p, z) {
    const n0 = z.shots.length, r = _ms.apply(this, arguments);
    if (!isH(G)) return r;
    const vis = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 240); if (!vis) return r;
    const frogs = [{ ox: -26, ph: 0, s: 15 }, { ox: 4, ph: 6, s: 17 }, { ox: 28, ph: 13, s: 14 }];
    vis.render = (ctx, sx, sy, t) => {
      const k = Math.min(1, t / 8, (240 - t) / 20), w = Math.round(44 * k); if (w < 2) return;
      ctx.save();
      ell(ctx, sx, sy - 1, w, 5 * k, 0, '#2a3a1c'); ell(ctx, sx, sy - 1, w - 3, 3.6 * k, 0, '#3e5a26'); ell(ctx, sx - w * 0.3, sy - 2, w * 0.35, 1.2 * k, 0, '#5e7e3a');
      for (let i = 0; i < 3; i++) { const bx = sx + Math.sin(i * 2.1 + t * 0.05) * w * 0.7, ph = (t + i * 13) % 26; if (ph < 8) ell(ctx, bx, sy - 2 - ph * 0.3, 1 + ph * 0.25, 1 + ph * 0.2, 0, 'rgba(160,200,110,0.6)'); }   // bubbles
      ell(ctx, sx + w * 0.45, sy - 2, 5 * k, 1.6 * k, 0, '#4a8a3a'); shape(ctx, [[sx + w * 0.45, sy - 2], [sx + w * 0.45 + 5 * k, sy - 3], [sx + w * 0.45 + 5 * k, sy - 1]]); paint(ctx, '#3e5a26');   // a lily pad
      for (const e of [-1, 1]) for (let i = 0; i < 3; i++) {   // reeds and cattails at both edges
        const rx = sx + e * (w - 2 - i * 4), h = (12 + i * 5) * k, sw = Math.sin(t * 0.08 + i) * 1.5;
        ctx.strokeStyle = '#5a7a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(rx, sy); ctx.quadraticCurveTo(rx, sy - h * 0.6, rx + sw, sy - h); ctx.stroke();
        if (i !== 1) ell(ctx, rx + sw, sy - h + 2, 1.2, 3, 0, '#6a4022');
      }
      ctx.restore();
      // the frogs: each jumps on a 20-frame beat (the trip comes on frame 6 of every 20)
      frogs.forEach(f => {
        if (Math.abs(f.ox) > w) return;
        const ph = ((t + f.ph) % 20) / 20, jump = ph < 0.55 ? Math.sin(ph / 0.55 * PI) : 0, leap = ph < 0.55 ? 0.5 + jump * 0.5 : 0, dir = Math.floor((t + f.ph) / 40) % 2 ? -1 : 1;
        const fx2 = sx + f.ox + Math.sin(((t + f.ph) / 20) * 1.7) * 6;
        frog(ctx, fx2, sy - 2 - jump * (20 + f.s * 0.4), f.s, dir, { leap, sac: ph > 0.6 ? Math.sin((ph - 0.6) / 0.4 * PI) : 0, rot: jump > 0.05 ? (ph < 0.27 ? -0.35 : 0.3) : 0 });
        if (ph < 0.04 || (ph > 0.53 && ph < 0.57)) part(fx2, sy - 2, '#8ab86e', rand(-1, 1), -rand(0.5, 1.6), 12, 2);   // splash
      });
    };
    return r;
  };

  // ================= I: Old Shell: the spiked tortoise, then fire =================
  const _os = CASTS.old_shell;
  CASTS.old_shell = function (p, z) {
    const n0 = z.shots.length, r = _os.apply(this, arguments);
    if (!isH(G)) return r;
    const vis = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 50); if (!vis) return r;
    const dir = p.face;
    vis.life = 64;   // a little longer on screen for the fire (the hit is still on frame 14)
    const tick0 = vis.tick;
    vis.tick = function (v) { if (tick0) tick0.apply(this, arguments); if (v.t >= 20 && v.t <= 46 && v.t % 3 === 0) part(v.x + dir * rand(50, 90), v.y - rand(10, 30), v.t % 2 ? '#ffa020' : '#ff5a1a', dir * rand(0.5, 1.5), -rand(0.5, 1.5), 16, 2); };
    vis.render = (ctx, sx, sy, t) => {
      const yy = t < 14 ? -150 + Math.round(t * t * 0.76) : 0, a = t > 54 ? (64 - t) / 10 : 1, y = sy + yy;
      if (t < 14) { ctx.save(); ctx.globalAlpha = 0.3 + t * 0.03; ell(ctx, sx, sy - 1, 18 + t * 1.6, 3, 0, '#05060c'); ctx.restore(); }   // its shadow grows
      const squash = t >= 14 && t < 20 ? 1 - Math.sin((t - 14) / 6 * PI) * 0.12 : 1;
      const breath = t >= 20 && t < 48 ? ease((t - 20) / 4) * (1 - ease((t - 42) / 6)) : 0;
      ctx.save(); ctx.translate(sx, y); ctx.scale(1, squash); ctx.translate(-sx, -y);
      tortoise(ctx, sx, y, 82, dir, { jaw: breath, lift: breath * 0.15, a });
      ctx.restore();
      if (breath > 0.05) fire(ctx, sx + dir * 82 * 0.84, y - 82 * 0.3, 70 * breath, dir, t, a);
      if (t >= 14 && t < 22) { ctx.save(); ctx.globalAlpha = 1 - (t - 14) / 8; ctx.strokeStyle = '#d8c8a0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy, 40 + (t - 14) * 6, 4 + (t - 14), 0, 0, PI * 2); ctx.stroke(); ctx.restore(); }   // the dust ring
    };
    return r;
  };

  // ================= S+I: Boulder Fall: a roc carries it in =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.hollis;
  if (BU && BU.cast) {
    const _bf = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _bf.apply(this, arguments);
      if (!isH(G)) return r;
      const add = z.shots.slice(n0), mark = add.find(s => s instanceof Vis && s.life === 22), lat = add.find(s => s instanceof N.Later);
      if (!mark) return r;
      const dir = p.face, _mr = mark.render;
      // the roc: in from behind the caster, below the HUD, hovers over the target with the boulder in its talons and lets
      // go as the boulder (which falls from the top of the view, as before) reaches it
      const drop = { y: 0, gone: false };
      const roc = new Vis(mark.x, mark.y, 54, (ctx, sx, sy, t) => {
        const off = t < 18 ? 150 * (1 - ease(t / 18)) : t < 32 ? 0 : -(t - 32) * 9, ry = Math.round(70 + Math.sin(t * 0.3) * 3 - (t > 32 ? (t - 32) * 3 : 0));
        const rx = Math.round(sx - dir * off);
        drop.y = ry + 26;
        if (!drop.gone) boulder(ctx, rx + dir * 2, ry + 26, 16, 0);
        bird(ctx, rx, ry, 78, dir, { t, beat: t < 32 ? 0.45 : 0.3, talons: true });
      });
      roc.draw = function (ctx) { if (this.render) this.render(ctx, Math.round(mark.x - G.cam.x), Math.round(mark.y - G.cam.y), this.t, this); };   // drawn in screen height (top of the view)
      z.shots.push(roc);
      mark.render = (ctx, sx, sy, t, v) => { ctx.save(); ctx.globalAlpha = 0.25 + t * 0.02; ell(ctx, sx, sy - 1, 8 + t * 0.8, 2.5, 0, '#05060c'); ctx.restore(); void _mr; void v; };
      if (lat) {
        const _fn = lat.fn;
        lat.fn = function (g, zz) {
          const zs = zz || z, m0 = zs.shots.length; _fn.apply(this, arguments);
          const pr = zs.shots.slice(m0).find(s => s.render);
          if (pr) pr.render = (ctx, x, y, s) => { if (!drop.gone && y < drop.y) return; drop.gone = true; boulder(ctx, x, y, 16, s.t * 0.15); };
        };
      }
      return r;
    };
  }

  // ================= W+O: Stone Garden: the serpent =================
  function serpentHead(ctx, x, y, s, dir, jaw, t) {
    frame(ctx, x, y, s, dir);
    ctx.save(); ctx.translate(0.05, 0.02); ctx.rotate(jaw * 0.7);
    shape(ctx, [[0, 0], [0.55, 0.02], [0.5, 0.1], [0.05, 0.14]]); paint(ctx, '#4a5a3a', '#1e2a16');
    ctx.fillStyle = '#f2ead2'; shape(ctx, [[0.42, 0.01], [0.47, 0.01], [0.44, -0.12 * jaw]]); ctx.fill();
    ctx.restore();
    if (jaw > 0.05) { shape(ctx, [[0.05, 0.0], [0.6, -0.02], [0.05 + 0.55 * Math.cos(jaw * 0.7), 0.02 + 0.55 * Math.sin(jaw * 0.7)]]); paint(ctx, '#5a0e12'); }
    shape(ctx, [[-0.1, -0.16], [0.3, -0.2], [0.62, -0.08], [0.6, 0.0], [0.0, 0.04], [-0.12, 0.02]]); paint(ctx, '#5e7048', '#1e2a16');
    ctx.fillStyle = '#f2ead2'; shape(ctx, [[0.5, -0.01], [0.55, -0.02], [0.53, 0.14 * jaw + 0.02]]); ctx.fill(); shape(ctx, [[0.42, 0.0], [0.46, 0.0], [0.44, 0.1 * jaw + 0.02]]); ctx.fill();
    ell(ctx, 0.34, -0.11, 0.04, 0.03, 0, '#e8e030'); ell(ctx, 0.345, -0.11, 0.01, 0.026, 0, '#101008');
    shape(ctx, [[0.0, -0.17], [-0.1, -0.32], [0.12, -0.19]]); paint(ctx, '#8a9a6a', '#1e2a16');   // stone horns
    if (jaw > 0.3) { ctx.strokeStyle = '#c0303a'; ctx.lineWidth = 0.025; const f = Math.sin(t * 0.9) * 0.03; ctx.beginPath(); ctx.moveTo(0.55, 0.02); ctx.lineTo(0.75, 0.02 + f); ctx.lineTo(0.82, -0.02 + f); ctx.moveTo(0.75, 0.02 + f); ctx.lineTo(0.82, 0.06 + f); ctx.stroke(); }
    ctx.restore();
  }
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.hollis;
  if (SIG && SIG.cast) {
    const _sg = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _sg.apply(this, arguments);
      if (!isH(G)) return r;
      const dir = p.face;
      z.shots.push(new Vis(p.x, p.y, 40, (ctx, sx, sy, t) => {
        const up = ease((t - 4) / 6) * (1 - ease((t - 30) / 10)); if (up < 0.02) return;
        ctx.save(); ctx.beginPath(); ctx.rect(sx - 200, sy - 200, 400, 200); ctx.clip();
        ctx.lineCap = 'round';
        // the coils break the ground between the spires, in a ring round him
        [[-60, -36], [-16, 16], [36, 60]].forEach((c, i) => {
          const a = sx + c[0], b = sx + c[1], h = (16 + i * 2) * up;
          for (const [col, w] of [['#1e2a16', 9], ['#4a5a3a', 7], ['#7a8a5a', 2]]) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a, sy + 4); ctx.quadraticCurveTo((a + b) / 2, sy - h * 2, b, sy + 4); ctx.stroke(); }
          ctx.fillStyle = '#2e3a22'; for (let u = 0.2; u < 0.9; u += 0.2) { const px = a + (b - a) * u, py = sy + 4 - (1 - (2 * u - 1) ** 2) * h; ctx.fillRect(Math.round(px), Math.round(py - 3), 2, 2); }
        });
        ctx.restore();
        // the head rears up behind him and hisses
        const hx = sx - dir * 28, hy = sy - 30 - up * 26;
        ctx.save(); ctx.lineCap = 'round'; for (const [col, w] of [['#1e2a16', 9], ['#4a5a3a', 7]]) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(sx - dir * 36, sy + 4); ctx.quadraticCurveTo(sx - dir * 50, sy - 24, hx - dir * 6, hy + 4); ctx.stroke(); } ctx.restore();
        serpentHead(ctx, hx - dir * 6, hy, 34 * up, dir, t > 8 && t < 30 ? 0.6 + 0.4 * Math.sin(t * 0.5) : 0.2, t);
      }));
      return r;
    };
  }

  // ================= J x4: the golden three-legged toad =================
  const FIN = SW.clanmelee && SW.clanmelee.FIN;
  if (FIN && FIN.hollis) {
    const _fn = FIN.hollis;
    FIN.hollis = function (p, z) {
      const n0 = z.shots.length, r = _fn.apply(this, arguments);
      if (!isH(G)) return r;
      const act = z.shots.slice(n0).find(s => s.life === 22 && s.paint); if (!act) return r;
      const dir = p.face;
      act.paint = (ctx, sx, sy, s) => {
        if (s.t < 2) return;
        const k = clamp01((s.t - 2) / 16), jump = Math.sin(k * PI), a = s.t > 18 ? (22 - s.t) / 4 : 1;
        if (s.t < 6) { ctx.save(); ctx.globalAlpha = 0.6; ell(ctx, sx, sy - 1, 10, 2, 0, '#3a2a18'); ctx.restore(); }
        frog(ctx, sx - dir * 4, sy - jump * 30, 22, dir, { gold: true, coin: true, leap: jump > 0.1 ? 0.6 + jump * 0.4 : 0, rot: k < 0.5 ? -0.4 : 0.2, a });
        if (s.t === 4) art.glow(ctx, sx, sy - 20, 16, '#ffd24a', 0.25);
      };
      return r;
    };
  }

  // ================= S+O and O: Deep Root and Mountain Heart =================
  function aura(ctx, p, sx, sy, front) {
    if (p.modeT > 0) {
      const fade = Math.min(1, p.modeT / 30);
      if (!front) {   // roots through the floor
        ctx.save(); ctx.globalAlpha *= 0.85 * fade; ctx.strokeStyle = '#5a4022'; ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) { const d = i % 2 ? 1 : -1, L = 14 + i * 4; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + d * L * 0.5, sy + 1 + (i % 3), sx + d * L, sy + ((i * 5) % 3) - 1); ctx.stroke(); }
        ctx.restore();
      }
      for (let i = 0; i < 2; i++) {   // two frogs hop round him
        const ph = ((p.t + i * 31) % 62) / 62, side = i ? -1 : 1, hop = Math.abs(Math.sin(ph * PI * 3)), ox = side * (16 + Math.sin(ph * PI * 2) * 8);
        if ((i === 0) !== front) continue;
        frog(ctx, sx + ox, sy - hop * 10, 11, Math.cos(ph * PI * 2) * side > 0 ? 1 : -1, { leap: hop > 0.2 ? hop : 0, a: fade });
      }
    }
    if (p.awakeT > 0 && front) {   // the white crane circles over him
      const fade = Math.min(1, p.awakeT / 30), a = p.t * 0.05, top = sy - (p.h || 34);
      bird(ctx, sx + Math.cos(a) * 20, top - 12 + Math.sin(a) * 4, 18, -Math.sin(a) >= 0 ? 1 : -1, { crane: true, t: p.t, beat: 0.25, a: fade * (Math.sin(a) >= 0 ? 1 : 0.75) });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isH(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isH(g || this.G) && z && z.shots && !this.dead && this.awakeT > a0 + 60) {   // the crane swoops down to him
      const d = this.face, x = this.x, y = this.y;
      z.shots.push(new Vis(x, y, 40, (ctx, sx, sy, t) => {
        const k = ease(t / 40), bx = sx + d * (120 - 120 * k), by = sy - 140 + 90 * k;
        bird(ctx, bx, by, 34 - 16 * k, -d, { crane: true, t, beat: 0.3, a: 1 - ease((t - 32) / 8) });
      }));
      for (let i = 0; i < 12; i++) part(x + rand(-20, 20), y - rand(30, 60), '#f4f4ee', rand(-0.6, 0.6), rand(0.3, 1), 30, 2);   // feathers
    }
    return r;
  };

  // ================= W+I: Elder Mountain: the mountain-tortoise =================
  const _ult = N.ULT.elder_mountain;
  if (_ult) N.ULT.elder_mountain = function (p, z, foes) {
    const n0 = z.shots.length, r = _ult.apply(this, arguments);
    if (!isH(G)) return r;
    if (p.st === 6) {
      const vis = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 70);
      const dir = p.face;
      if (vis) {
        vis._ugS = 1;   // drawn to its own size: js/ult-grand.js must not enlarge it
        vis.render = (ctx, sx, sy, t) => {
          const rise = Math.max(0, 140 - t * 6), y = sy + rise, a = t > 62 ? (70 - t) / 8 : 1;
          const stp = [30, 44, 58].map(s => t + 6 - s).find(d => d >= -8 && d < 6);
          const step = stp === undefined ? 0 : stp < 0 ? (8 + stp) / 8 : 1 - stp / 6;   // the foot lifts, then comes down on the stamp
          ctx.save(); ctx.beginPath(); ctx.rect(sx - 400, sy - 400, 800, 400); ctx.clip();
          tortoise(ctx, sx - dir * 40, y, 190, dir, { mountain: true, step, a, jaw: stp !== undefined && stp >= 0 && stp < 4 ? 0.6 : 0 });
          ctx.restore();
        };
      }
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    if ([30, 44, 58].indexOf(p.st) >= 0) for (let i = 0; i < 10; i++) part(p.x + rand(-140, 140), p.y - 1, '#a89a80', rand(-1, 1), -rand(1, 3), 20, 3, 0.15);
    return r;
  };
  // the finishing blow: the Elder's head comes in close, opens its eyes and breathes fire on the target
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('hollis') : null, FINST = pl ? pl.fin : 64, BU = pl ? Math.max(74, FINST - 30) : 30;
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU - 2 || st > FINST + 18) return;
      const rise = ease((st - (BU - 2)) / 14), after = st > FINST ? ease((st - FINST) / 18) : 0;
      // its beak (0.84 of the body ahead, 0.3 up) stops 34 px short of the target, a little above its middle
      const S = 260, hx = sx - dir * (S * 0.84 + 34) - dir * 60 * (1 - rise), hy = sy - 24 + S * 0.3 + 120 * (1 - rise) + after * 40;
      const breath = st >= FINST - 10 ? ease((st - (FINST - 10)) / 4) * (1 - after) : 0;
      ctx.save(); ctx.globalAlpha *= 1 - ease((after - 0.5) / 0.5);
      tortoise(ctx, hx, hy, S, dir, { jaw: breath > 0 ? 0.7 : 0.1 * Math.sin(st * 0.2), lift: 0.15 });
      if (breath > 0.02) fire(ctx, hx + dir * S * 0.84, hy - S * 0.3, (Math.abs(sx - (hx + dir * S * 0.84)) + 40) * breath, dir, st, 1);
      ctx.restore();
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
