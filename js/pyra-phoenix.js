'use strict';
// Shattered Worlds — Pyra's phoenix (the user, 2026-11-20: "Pyra's phoenix"). Her story: "a blue forge that never went
// out"; she "burned the Burn Ward to the frame" and walked out through her own fire; Kestra "insists she is the real
// phoenix; Pyra insists on fighting her about it". So Pyra's phoenix is the forge's: red and orange flame with a
// blue-white heart, a hooked beak, a crest of fire and long tail flames. Crisp pixel art through js/pixel-kit.js.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/dune-meridian.js.
//   J      her combo: talons of flame rake on every hit
//   U      Fireball: a firebird with a blue heart
//   S+U    Flame Ring: wings of flame burst open from her back and a ring of burning feathers flies out
//   I      Sun Flare: the phoenix carries a small sun with a blue heart
//   S+I    Forge Breath: the phoenix's head rears over her shoulder and breathes the forge, blue at the beak
//   W+O    Fire Serpent: a serpent of flame with a fanged head and a blue spine
//   S+O    Blaze: her fists burn      O  Phoenix Form: small wings of flame at her back (small on purpose)
//   W+I    Supernova: the phoenix rises over the arena, firebirds dive in place of the meteors; in the cinematic
//          finish (js/ult-cinema.js) its head screams beside the target, then it dives through on an impact frame and
//          a column of blue fire goes up
// SW.pyraPhoenix.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.fireball || !CASTS.sun_flare) return;
  const PP = SW.pyraPhoenix = { on: true };
  const isP = g => !!(PP.on && g && g.state && g.state.hero === 'pyra');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

  // soot, deep red, red, red-orange, orange, amber, yellow, white, and the blue of the forge
  const PAL = ['#1a0504', '#5a0e06', '#a81e08', '#e2460e', '#ff7a1a', '#ffb52e', '#ffe27a', '#ffffff', '#7fd8ff', '#2a7fd8'];
  const C = { k: PAL[0], r0: PAL[1], r: PAL[2], ro: PAL[3], o: PAL[4], a: PAL[5], y: PAL[6], w: PAL[7], bl: PAL[8], bd: PAL[9] };
  // a tongue of flame from (x0, y0) along ang, L long, w half-wide, leaning by bend
  function tongue(c, x0, y0, ang, L, w, col, core, bend) {
    const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca, b = (bend || 0) * L;
    const P = (u, off) => [x0 + ca * L * u + nx * off, y0 + sa * L * u + ny * off];
    poly(c, [P(0, w * 0.7), P(0.3, w + b * 0.4), P(0.62, w * 0.55 + b), P(1, b * 1.7), P(0.66, -w * 0.3 + b), P(0.3, -w + b * 0.3), P(0, -w * 0.7)], col);
    if (core) poly(c, [P(0, w * 0.35), P(0.4, w * 0.4 + b * 0.5), P(0.78, b * 1.2), P(0.4, -w * 0.4 + b * 0.4), P(0, -w * 0.35)], core);
  }

  // ================= the phoenix, side view: (0, 0) its body, facing +x, s its body length =================
  // a broad wing of flame: an arm (shoulder, wrist, tip) with a fan of flame feathers trailing from it.
  // a: 1 raised, -1 beaten down; sweep 0-1 folds it back for a dive
  function flameWing(c, s, sx, sy, a, far, sweep) {
    const L = s * 1.15, sw = sweep || 0, phi = a * 1.15 * (1 - 0.45 * sw) + (far ? 0.2 : 0);
    const p1 = phi * 1.1 + 0.12, p2 = phi * 0.72;
    const wx = sx - Math.cos(p1) * L * 0.42, wy = sy - Math.sin(p1) * L * 0.42, tx = wx - Math.cos(p2) * L * 0.5, ty = wy - Math.sin(p2) * L * 0.5;
    const base = far ? C.r : C.o, dark = far ? C.r0 : C.ro, lite = far ? C.ro : C.a;
    const pr = -0.4 * SW.clamp(phi * 3, -1, 1) + 0.15 * phi, Nf = 10;
    for (let i = 0; i < Nf; i++) {
      const u = i / (Nf - 1), rx = u < 0.5 ? sx + (wx - sx) * u * 2 : wx + (tx - wx) * (u - 0.5) * 2, ry = u < 0.5 ? sy + (wy - sy) * u * 2 : wy + (ty - wy) * (u - 0.5) * 2;
      const pf = pr + (p2 - pr) * Math.pow(u, 0.8) + (1 - Math.abs(SW.clamp(phi * 3, -1, 1))) * (u - 0.4) * 0.6, len = L * (0.36 + 0.36 * u) * (u > 0.85 ? 0.84 : 1);
      tongue(c, rx, ry, PI + pf, len, L * 0.1, i % 2 ? base : dark, far ? null : (i % 3 === 0 ? C.y : i % 3 === 1 ? lite : null), (i % 2 ? 0.04 : -0.04) * (phi >= 0 ? 1 : -1));
    }
    const aw = L * 0.05, nx1 = Math.sin(p1), ny1 = -Math.cos(p1);   // the arm, bright along the leading edge
    poly(c, [[sx + nx1 * aw, sy + ny1 * aw], [wx + nx1 * aw, wy + ny1 * aw], [tx, ty], [wx - nx1 * aw, wy - ny1 * aw], [sx - nx1 * aw * 1.6, sy - ny1 * aw * 1.6]], lite);
    if (!far) { c.strokeStyle = C.y; c.lineWidth = Math.max(1, L * 0.035); c.beginPath(); c.moveTo(sx, sy); c.lineTo(wx, wy); c.lineTo(tx, ty); c.stroke(); }
  }
  // o = { flap 0-1, wing (fixed), sweep 0-1 (wings back: a dive), t, scream }
  function phoenixVec(c, s, o) {
    const t = o.t || 0, a = o.wing !== undefined ? o.wing : Math.sin((o.flap || 0) * PI * 2);
    for (let i = 0; i < 3; i++) {   // the tail: three long flames that stream and wave
      const len = s * (i === 1 ? 1.55 : 1.25), lift = (i - 1) * 0.16, pts = [], n = 10;
      for (let k = 0; k <= n; k++) { const u = k / n; pts.push([-s * 0.26 - u * len, s * 0.01 + lift * s * u + Math.sin(t * 0.25 - u * 4.5 + i * 1.3) * s * 0.09 * u]); }
      const top = [], bot = [], mid = []; pts.forEach((q, k) => { const u = k / n, w = s * 0.085 * (1 - u) * (1 + 0.35 * Math.sin(u * 9 + i)); top.push([q[0], q[1] - w]); bot.unshift([q[0], q[1] + w]); mid.unshift([q[0], q[1] + w * 0.2]); });
      poly(c, top.concat(bot), i === 1 ? C.o : C.ro); poly(c, top.concat(mid), i === 1 ? C.y : C.a);
      if (s >= 34) { const e = pts[7]; ell(c, e[0], e[1], s * 0.075, s * 0.055, C.y); ell(c, e[0], e[1], s * 0.04, s * 0.03, C.bd); }   // an eye of blue in each (seen on the big ones)
    }
    for (let i = 0; i < 4; i++) tongue(c, -s * 0.22, s * 0.0, PI + (i - 1.5) * 0.3, s * 0.42, s * 0.06, i % 2 ? C.r : C.ro, null, 0.05);   // the short fan over the rump
    flameWing(c, s, s * 0.06, -s * 0.08, a, true, o.sweep);
    poly(c, [[s * 0.36, -s * 0.07], [s * 0.2, -s * 0.18], [-s * 0.1, -s * 0.17], [-s * 0.36, -s * 0.02], [-s * 0.1, s * 0.13], [s * 0.2, s * 0.11]], C.ro);   // the body
    poly(c, [[s * 0.36, -s * 0.07], [s * 0.2, -s * 0.18], [-s * 0.1, -s * 0.17], [-s * 0.36, -s * 0.02], [-s * 0.05, -s * 0.07], [s * 0.2, -s * 0.06]], C.o);
    poly(c, [[-s * 0.3, s * 0.0], [-s * 0.1, s * 0.13], [s * 0.2, s * 0.11], [s * 0.0, s * 0.06]], C.r);
    ell(c, s * 0.16, -s * 0.02, s * 0.11, s * 0.085, C.bl); ell(c, s * 0.17, -s * 0.03, s * 0.055, s * 0.04, C.w);   // the blue heart of the forge
    poly(c, [[s * 0.16, -s * 0.15], [s * 0.36, -s * 0.34], [s * 0.5, -s * 0.28], [s * 0.38, s * 0.0]], C.o);   // the neck
    poly(c, [[s * 0.16, -s * 0.15], [s * 0.36, -s * 0.34], [s * 0.42, -s * 0.3], [s * 0.26, -s * 0.14]], C.a);
    // the head: a crest of fire, a fierce eye under a dark brow, a hooked beak
    const hx = s * 0.46, hy = -s * 0.3, bo = o.scream ? s * 0.07 : 0;
    c.save(); c.translate(hx, hy); c.scale(1.3, 1.3); c.translate(-hx, -hy);   // a big head: an eagle's, not a swan's
    for (let i = 0; i < 4; i++) tongue(c, hx - s * 0.02 - i * s * 0.02, hy - s * 0.05, PI + 0.42 + i * 0.2 + Math.sin(t * 0.5 + i) * 0.1, s * (0.5 - i * 0.07), s * 0.06, i % 2 ? C.a : C.ro, i % 2 ? null : C.y, 0.06);
    poly(c, [[hx - s * 0.1, hy + s * 0.07], [hx - s * 0.11, hy - s * 0.06], [hx, hy - s * 0.12], [hx + s * 0.12, hy - s * 0.09], [hx + s * 0.17, hy - s * 0.01], [hx + s * 0.05, hy + s * 0.09]], C.a);
    poly(c, [[hx + s * 0.1, hy - s * 0.085], [hx + s * 0.27, hy - s * 0.06], [hx + s * 0.34, hy + s * 0.0], [hx + s * 0.33, hy + s * 0.09], [hx + s * 0.26, hy + s * 0.025], [hx + s * 0.12, hy + s * 0.02]], C.y);   // the upper beak, hooked
    poly(c, [[hx + s * 0.28, hy - s * 0.02], [hx + s * 0.34, hy + s * 0.0], [hx + s * 0.33, hy + s * 0.09], [hx + s * 0.29, hy + s * 0.04]], C.r0);
    poly(c, [[hx + s * 0.1, hy + s * 0.03], [hx + s * 0.25, hy + s * 0.045 + bo], [hx + s * 0.1, hy + s * 0.08 + bo * 0.6]], C.a);   // the lower beak
    if (bo) poly(c, [[hx + s * 0.13, hy + s * 0.025], [hx + s * 0.25, hy + s * 0.03], [hx + s * 0.23, hy + s * 0.04 + bo * 0.8]], C.bl);
    poly(c, [[hx - s * 0.02, hy - s * 0.085], [hx + s * 0.14, hy - s * 0.05], [hx + s * 0.13, hy - s * 0.02], [hx - s * 0.01, hy - s * 0.05]], C.k);   // the brow
    poly(c, [[hx + s * 0.02, hy - s * 0.05], [hx + s * 0.12, hy - s * 0.025], [hx + s * 0.05, hy - s * 0.012]], C.w);   // the eye
    c.restore();
    flameWing(c, s, s * 0.04, -s * 0.1, a, false, o.sweep);
  }
  function phoenix(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x - dir * s * 0.45, y, s * 3.8, s * 3.6, c => { c.translate(s * 0.45 * (dir < 0 ? -1 : 1), 0); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); if (o.sun) sunVec(c, o.sun, o.t || 0); phoenixVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono });
  }
  // a small sun with a blue heart: r its radius
  function sunVec(c, r, t) {
    for (let i = 0; i < 12; i++) tongue(c, 0, 0, i / 12 * PI * 2 + t * 0.05, r * (1.5 + 0.25 * Math.sin(t * 0.4 + i * 2)), r * 0.3, i % 2 ? C.ro : C.o, null, 0.1);   // the corona
    ell(c, 0, 0, r, r, C.o); ell(c, 0, 0, r * 0.82, r * 0.82, C.a); ell(c, 0, 0, r * 0.6, r * 0.6, C.y); ell(c, 0, 0, r * 0.38, r * 0.38, C.w);
  }
  // the phoenix's head alone, like an eagle's made of fire: (0, 0) the middle of the skull, facing +x, s its length; o = { open 0-1, t }
  function headVec(c, s, o) {
    const t = o.t || 0, open = clamp01(o.open === undefined ? 0.6 : o.open), S = (pts, col) => poly(c, pts.map(q => [q[0] * s, q[1] * s]), col);
    for (let i = 0; i < 7; i++) tongue(c, s * (0.2 - i * 0.07), s * (-0.3 + i * 0.025), PI + 0.5 - i * 0.07 + Math.sin(t * 0.45 + i * 1.1) * 0.07, s * (1.0 - i * 0.085), s * 0.11, i % 2 ? C.o : C.ro, i % 2 ? C.y : C.a, i % 2 ? 0.07 : -0.03);   // the crest: long flames swept back
    for (let i = 0; i < 5; i++) tongue(c, -s * 0.18, s * (0.02 + i * 0.045), PI - 0.2 - i * 0.2 + Math.sin(t * 0.4 + i) * 0.06, s * (0.78 - i * 0.09), s * 0.11, i % 2 ? C.r : C.ro, i % 2 ? null : C.o, -0.05);   // the neck's flames
    const ja = open * 0.6, jx = 0.4, jy = 0.07, tipx = jx + Math.cos(ja) * 0.44, tipy = jy + Math.sin(ja) * 0.44;
    if (open > 0.06) {   // the forge burning in its throat
      S([[0.42, 0.03], [0.9, 0.02], [tipx, tipy], [0.36, 0.14]], C.r0);
      tongue(c, s * 0.44, s * (0.07 + open * 0.05), ja * 0.5, s * (0.3 + 0.12 * open), s * (0.03 + 0.05 * open), C.bd, null, 0);
      tongue(c, s * 0.44, s * (0.07 + open * 0.05), ja * 0.5, s * (0.24 + 0.1 * open), s * (0.02 + 0.03 * open), C.bl, C.w, 0);
    }
    c.save(); c.translate(jx * s, jy * s); c.rotate(ja);   // the lower beak
    S([[-0.08, -0.02], [0.44, 0.0], [0.36, 0.07], [-0.06, 0.12]], C.a); S([[-0.08, -0.02], [0.44, 0.0], [0.2, 0.035]], C.y); S([[-0.06, 0.12], [0.36, 0.07], [0.1, 0.07]], C.ro);
    c.restore();
    S([[-0.25, 0.2], [-0.3, -0.1], [-0.12, -0.3], [0.2, -0.36], [0.5, -0.26], [0.62, -0.1], [0.55, 0.06], [0.2, 0.16]], C.o);   // the skull
    S([[-0.12, -0.3], [0.2, -0.36], [0.5, -0.26], [0.2, -0.25]], C.a);
    S([[-0.25, 0.2], [-0.3, -0.1], [0.0, 0.0], [0.3, 0.02], [0.55, 0.06], [0.2, 0.16]], C.ro);
    S([[-0.25, 0.2], [-0.28, 0.0], [0.0, 0.08], [0.2, 0.16]], C.r);
    S([[0.5, -0.25], [0.72, -0.25], [0.9, -0.15], [1.0, 0.0], [0.98, 0.17], [0.9, 0.04], [0.8, -0.01], [0.5, 0.03]], C.y);   // the great hooked beak
    S([[0.5, -0.25], [0.72, -0.25], [0.86, -0.17], [0.6, -0.17]], C.w);
    S([[0.9, -0.15], [1.0, 0.0], [0.98, 0.17], [0.9, 0.04], [0.86, -0.04]], C.a);
    S([[0.96, 0.04], [0.98, 0.17], [0.93, 0.07]], C.r0);
    S([[0.6, -0.1], [0.68, -0.09], [0.63, -0.06]], C.r0);   // the nostril
    S([[0.1, -0.31], [0.58, -0.17], [0.55, -0.1], [0.12, -0.2]], C.k);   // the brow, drawn down
    S([[0.2, -0.19], [0.5, -0.11], [0.27, -0.06]], C.bl); S([[0.27, -0.16], [0.45, -0.11], [0.3, -0.085]], C.w);   // the eye: blue-white
    S([[0.02, -0.02], [0.22, 0.0], [0.05, 0.07]], C.a); S([[-0.1, -0.08], [0.04, -0.07], [-0.08, -0.01]], C.a);   // marks on the cheek
  }
  function head(ctx, x, y, s, dir, o) { o = o || {}; PX.sprite(ctx, x - dir * s * 0.1, y - s * 0.1, s * 2.7, s * 2.2, c => { c.translate(s * 0.1 * (dir < 0 ? -1 : 1), s * 0.1); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); headVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono }); }
  Object.assign(PP, { phoenix, head });
  const embers = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 4 === 0 ? '#7fd8ff' : i % 2 ? '#ffb52e' : '#e2460e', rand(-pw, pw), -rand(0.5, pw), 20, 2, -0.02); };
  // the forge's breath from (x0, y0) to (x1, y1): blue-white at the mouth, yellow, orange, then red
  function gout(ctx, x0, y0, x1, y1, t, a) {
    const L = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
    PX.sprite(ctx, (x0 + x1) / 2, (y0 + y1) / 2, L + 70, 96, c => {
      c.rotate(ang); c.translate(-L / 2, 0);
      for (let i = 27; i >= 0; i--) {
        const u = i / 27, x = u * L * 0.86 + (rnd(t, i) - 0.5) * 8, sp = 3 + u * 19, y = (rnd(t, i + 20) - 0.5) * 2 * sp * 0.8;
        const col = u < 0.1 ? C.w : u < 0.24 ? C.bl : u < 0.4 ? C.y : u < 0.6 ? C.a : u < 0.8 ? C.o : C.ro;
        tongue(c, x, y, (y / sp) * 0.35 + (rnd(t, i + 40) - 0.5) * 0.3, 16 + u * 26, 3 + u * 7, col, u > 0.3 && i % 3 === 0 ? (u < 0.6 ? C.w : C.y) : null, (rnd(t, i + 60) - 0.5) * 0.3);
      }
      tongue(c, -2, 0, 0, L * 0.34, 4, C.bl, C.w, 0);
    }, { pal: PAL, alpha: a });
  }

  // ================= her shots: Fireball, Sun Flare, and Supernova's meteors =================
  function dress(z) {
    z.shots.forEach(s => {
      if (s.pyra || !(s instanceof Proj) || !s.status || !s.status.burn) return;
      if (s.w === 12 && s.r === 5) { s.pyra = 1; s.render = (ctx, x, y, q) => phoenix(ctx, x, y, 20, q.vx >= 0 ? 1 : -1, { flap: (q.t % 8) / 8, t: q.t, rot: SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)), -0.8, 0.8), scream: true }); }
      else if (s.w === 30 && s.r === 12) { s.pyra = 1; s.render = (ctx, x, y, q) => phoenix(ctx, x, y, 38, q.vx >= 0 ? 1 : -1, { flap: (q.t % 24) / 24, t: q.t, sun: 15 }); }   // it carries the sun
      else if (s.w === 16 && s.h === 16 && s.vy > 4) { s.pyra = 1; s._ugS = 1; s.render = (ctx, x, y, q) => phoenix(ctx, x, y, 28, 1, { wing: 0.75, sweep: 1, t: q.t, rot: 1.15, scream: true }); }   // a firebird stooping
    });
  }

  // ================= S+U: Flame Ring: her wings burst open =================
  const _fr = CASTS.flame_ring;
  CASTS.flame_ring = function (p, z) {
    const r = _fr.apply(this, arguments);
    if (!isP(G)) return r;
    p._pyWing = 18;
    z.shots.push(new Vis(p.x, p.y - 22, 18, (ctx, sx, sy, t) => {
      const k = t / 18, a = 1 - ease((k - 0.55) / 0.45);
      if (t >= 3) for (let i = 0; i < 10; i++) { const an = i / 10 * PI * 2 + k * 1.2, R = 30 + ease(k * 1.3) * 34; PX.sprite(ctx, sx + Math.cos(an) * R, sy + 6 + Math.sin(an) * R * 0.6, 34, 34, c => tongue(c, -Math.cos(an + 0.9) * 7, -Math.sin(an + 0.9) * 7, an + 0.9, 15, 2.6, i % 2 ? C.o : C.ro, C.y, 0.12), { pal: PAL, alpha: a }); }   // the ring of burning feathers
    }, v => { v.x = p.x; v.y = p.y - 22; }));
    return r;
  };

  // ================= S+I: Forge Breath: the head over her shoulder =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.pyra;
  if (BU && BU.cast) {
    const _fb = BU.cast;
    BU.cast = function (p, z) {
      const r = _fb.apply(this, arguments);
      if (!isP(G)) return r;
      const v = new Vis(p.x, p.y, 44, (ctx, sx, sy, t) => {
        const d = p.face, a = t > 38 ? (44 - t) / 6 : Math.min(1, t / 3);
        gout(ctx, sx + d * 22, sy - 38, sx + d * 124, sy - 24, t, a);
        head(ctx, sx - d * 22, sy - 54, 42, d, { open: 0.75 + 0.25 * Math.sin(t * 0.8), rot: 0.28, t, a });
      }, vv => { vv.x = p.x; vv.y = p.y; if (p.state !== 'cast' && vv.t > 4 && vv.t < 38) vv.t = 38; });
      v._ugS = 1; z.shots.push(v);
      return r;
    };
  }

  // ================= W+O: Fire Serpent =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.pyra;
  if (SIG && SIG.cast) {
    const _fs = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _fs.apply(this, arguments);
      if (!isP(G)) return r;
      const s0 = z.shots.slice(n0).find(s => s.life === 48 && s.paint); if (!s0) return r;
      s0.paint = (ctx, x, y, s) => {
        const d = s.dir, t = s.t;
        PX.sprite(ctx, x - d * 40, y - 26, 170, 84, c => {
          c.translate(40 * d, 26); c.scale(d, 1);
          const spine = i => [-i * 7.5, -13 - Math.sin(t * 0.5 - i * 0.75) * 8 - Math.max(0, 3 - i) * 5];
          for (let i = 13; i >= 1; i--) {   // the body: coils of flame, a blue spine, fins of fire along the back
            const q = spine(i), rr = 9.5 - i * 0.5;
            if (i % 2) tongue(c, q[0], q[1] - rr * 0.5, -PI / 2 - 0.7, rr * 2.2, rr * 0.5, C.o, C.y, 0.12);
            poly(c, [[q[0] - rr * 1.3, q[1]], [q[0], q[1] - rr], [q[0] + rr * 1.3, q[1]], [q[0], q[1] + rr]], i % 2 ? C.ro : C.o);
            poly(c, [[q[0] - rr * 1.1, q[1] + rr * 0.15], [q[0], q[1] + rr], [q[0] + rr * 1.1, q[1] + rr * 0.15]], C.r);
            poly(c, [[q[0] - rr * 0.6, q[1] - rr * 0.1], [q[0], q[1] - rr * 0.5], [q[0] + rr * 0.6, q[1] - rr * 0.1], [q[0], q[1] + rr * 0.3]], i % 3 ? C.y : C.bl);
          }
          const h = spine(0), jaw = 0.25 + 0.6 * Math.max(0, Math.sin(t * 0.63));   // the head: it bites every ten frames
          c.save(); c.translate(h[0] + 3, h[1] - 3); c.scale(1.7, 1.7);
          for (let i = 0; i < 4; i++) tongue(c, -3 - i * 1.5, -5, PI + 0.5 + i * 0.28, 13 - i * 2, 2.4, i % 2 ? C.a : C.ro, i % 2 ? null : C.y, 0.1);   // a mane of flame
          c.save(); c.rotate(jaw * 0.7); poly(c, [[-2, 2], [15, 3], [12, 7], [-2, 7]], C.ro); poly(c, [[-2, 2], [15, 3], [6, 4]], C.r0); poly(c, [[9, 3.5], [11.5, 3.5], [10, -1]], C.w); poly(c, [[4, 3], [6, 3], [5, 0]], C.w); c.restore();
          poly(c, [[-5, 4], [-6, -6], [2, -9], [12, -6], [18, -1], [14, 2], [-2, 3]], C.o); poly(c, [[2, -9], [12, -6], [18, -1], [8, -3]], C.a); poly(c, [[-5, 4], [-6, -2], [4, 0], [-2, 3]], C.ro);
          poly(c, [[12, 1], [14.5, 1], [13, 6.5]], C.w); poly(c, [[7, 1.5], [9, 1.5], [8, 5]], C.w);   // fangs
          poly(c, [[2, -7.5], [12, -4.5], [11.5, -3], [2.5, -5.5]], C.k); poly(c, [[4, -5.2], [11, -3], [6, -2]], C.bl); poly(c, [[6, -4.4], [10, -3.1], [7, -2.6]], C.w);   // the eye under its brow
          c.restore();
        }, { pal: PAL });
      };
      return r;
    };
  }

  // ================= J: talons of flame, and the small auras =================
  const CLAW = ['#5a0e06', '#a81e08', '#ff7a1a'];
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 9) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.55 : 22, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), up = a.anim === 'launcher';
        PX.claws(ctx, sx + d * (reach + 2), hy, up ? (d > 0 ? -0.9 : PI + 0.9) : (d > 0 ? 0.5 : PI - 0.5), big ? 36 : 24, k / 9, CLAW, 3);
        if (k === 0) embers(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 7 : 4, 2);
      }
    }
    if (front && p.modeT > 0) {   // her fists burn
      const fade = Math.min(1, p.modeT / 30);
      PX.sprite(ctx, sx + d * 7, sy - 24, 22, 26, c => { for (let i = 0; i < 3; i++) tongue(c, (i - 1) * 3, 4, -PI / 2 + (i - 1) * 0.3 + Math.sin(p.t * 0.4 + i) * 0.15, 9 + (i === 1 ? 4 : 0), 2.5, i === 1 ? C.a : C.ro, i === 1 ? C.bl : null, 0.1); }, { pal: PAL, alpha: fade });
    }
    if (!front && p._pyWing > 0) {   // Flame Ring: wings of flame burst open from her back
      const t = 18 - p._pyWing, open = ease(t / 5), al = 1 - ease((t / 18 - 0.55) / 0.45);
      PX.sprite(ctx, sx, sy - 36, 170, 110, c => { c.translate(0, 14); for (const dd of [-1, 1]) { c.save(); c.scale(-dd, 1); flameWing(c, 60, -2, 2, 0.2 + open * 0.75, false, 0); c.restore(); } }, { pal: PAL, alpha: al });
    }
    if (!front && p.awakeT > 0) {   // small wings of flame at her back
      const fade = Math.min(1, p.awakeT / 30), open = 0.55 + 0.25 * Math.sin(p.t * 0.12);
      PX.sprite(ctx, sx, sy - 30, 60, 44, c => { c.translate(0, 8); for (const dd of [-1, 1]) { c.save(); c.scale(-dd, 1); flameWing(c, 17, -1, 0, open, dd === d, 0); c.restore(); } }, { pal: PAL, alpha: fade });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isP(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (this._pyWing > 0) this._pyWing--;
    if (isP(g || this.G) && z && z.shots) {
      dress(z);
      if (!this.dead && this.awakeT > a0 + 60) {   // Phoenix Form: the bottle breaks (small and short)
        const x = this.x, y = this.y - 24;
        for (let i = 0; i < 10; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 2 ? '#7fd8ff' : '#ffffff', rand(-3, 3), rand(-3, 1), 16, 2, 0.15);
        embers(x, y, 10, 2.6);
      }
    }
    return r;
  };

  // ================= W+I: Supernova =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isP(g)) return r;
    if (p.st === 10) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      const dir = T ? (T.x >= p.x ? 1 : -1) : p.face, x0 = p.x, y0 = p.y - 30;
      const sky = new Vis(x0, y0, 62, (ctx, sx, sy, t) => {
        const k = t / 62, a = Math.min(1, t / 4) * (1 - ease((k - 0.85) / 0.15));
        phoenix(ctx, sx, sy, 46, dir, { flap: (t % 18) / 18, t, scream: t % 20 < 12, rot: t < 14 ? -0.6 * (1 - t / 14) : 0, a });
      }, v => { const u = ease(v.t / 16), hx = T ? T.x - dir * 30 : x0 + dir * 80, hy = (T ? T.y : p.y) - 62 + Math.sin(v.t * 0.2) * 3; v.x = x0 + (hx - x0) * u; v.y = y0 + (hy - y0) * u; });
      sky._ugS = 1; z.shots.push(sky);
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('pyra') >= 0) finale(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100)
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 16) return;
      const cy = sy - 20;
      if (st < FIN - 5) {   // its head beside the target, screaming, the forge burning in its throat
        const k = ease((st - 74) / 8), sh = st > 84 ? Math.sin(st * 2.3) * 1.3 : 0;
        head(ctx, sx - dir * 92 + sh, cy - 14, 60, dir, { open: st > 80 ? 0.8 + 0.2 * Math.sin(st * 0.7) : 0.15, t: st, a: k });
      } else if (st < FIN) {   // it dives
        const k = (st - (FIN - 5)) / 5;
        PX.lines(ctx, sx - dir * 40, cy - 40, dir > 0 ? 0.75 : PI - 0.75, 80, 8, st, '#ffb52e', 50);
        phoenix(ctx, sx - dir * 84 * (1 - k), cy - 64 * (1 - k), 60, dir, { wing: 0.75, sweep: 1, t: st, rot: 0.75, scream: true });
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 101);
        phoenix(ctx, sx + dir * k * 90, cy + k * 30, 60, dir, { wing: 0.75, sweep: 1, t: st, rot: 0.75, mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease(k * 1.8) });
        const hgt = 150 * ease(k * 2.2), a = 1 - ease((k - 0.5) / 0.5);   // then the forge goes up: a column of blue fire
        PX.sprite(ctx, sx, sy - hgt / 2, 80, hgt + 30, c => { c.translate(0, hgt / 2); for (let i = 0; i < 7; i++) tongue(c, (i - 3) * 5, 0, -PI / 2 + (i - 3) * 0.06, hgt * (1 - Math.abs(i - 3) * 0.14), 8, i % 2 ? C.bl : C.bd, i === 3 ? C.w : null, (rnd(st >> 1, i) - 0.5) * 0.22); for (let i = 0; i < 4; i++) tongue(c, (i % 2 ? 1 : -1) * (16 + i * 3), 0, -PI / 2 + (i % 2 ? 0.3 : -0.3), hgt * 0.5, 6, i % 2 ? C.o : C.ro, C.a, 0.1); }, { pal: PAL, alpha: a });
        if (st === FIN) embers(T.x, T.y - 16, 26, 4.5);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
