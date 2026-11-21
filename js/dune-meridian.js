'use strict';
// Shattered Worlds — Dune and the Buried Meridian (2026-11-20, the hero-look rework: cool, not cute). Her story: the
// guardian of "a city that went down in the Ashfall War with its people still in it"; "some say she is the sand they
// are buried in, standing up"; "thick ropes of sand streaming round her arms", pale gold eyes under a hood and veil.
// So the sand she throws has the city in it (spires, arches, broken columns), and it has hands. Crisp pixel art through
// js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/apis-hive.js.
//   J      her combo: a great fist of sand, on a forearm of sand ropes, punches out from her arm on every hit
//   U      Sand Lance: the tip of a buried spire bursts out of the floor, windows and all, sand pouring off it
//   S+U    Dune Grip: a clawed hand of sand rises under the target, closes, squeezes and crushes
//   I      Sinking Sands: a rolling dune with a broken arch and a roof turning over in it
//   S+I    Dune Sea: a breaking wave of sand carrying columns and a dome
//   W+O    Sand Maw: jaws of sand with broken masonry for teeth snap shut out of a sinking pit
//   S+O    Grit: sand runs off her shoulders      O  Glass Storm: a low ring of blowing sand with a few glints (small)
//   W+I    Buried City: the Meridian looms up out of the dust behind the fight, towers, domes and lit windows, then
//          drops; at the finishing blow (js/ult-grand.js) a hooded face of sand with pale gold eyes rises behind the
//          target and a colossal fist of sand comes down on an impact frame
// SW.duneMeridian.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !CASTS.sand_lance || !CASTS.dune_grip) return;
  const DM = SW.duneMeridian = { on: true };
  const isD = g => !!(DM.on && g && g.state && g.state.hero === 'dune');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const mix = (a, b, u) => a + (b - a) * u;
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const limb = (c, pts, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

  // deep shadow, ochres, sand gold, pale sand, white, and the gold of her eyes
  const PAL = ['#1e1408', '#4a3414', '#8a6a2a', '#b8862f', '#d9a441', '#f0cf80', '#fff0c8', '#ffffff', '#ffe66a'];
  const C = { k: PAL[0], d: PAL[1], o: PAL[2], m: PAL[3], s: PAL[4], l: PAL[5], p: PAL[6], w: PAL[7], eye: PAL[8] };
  const grains = (x, y, n, pw, dir) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-4, 4), i % 3 ? '#d9a441' : '#fff0c8', (dir || 0) * rand(0.5, pw) + rand(-pw, pw) * 0.5, -rand(0.5, pw), 18, 2, 0.14); };

  // ================= shapes =================
  // a forearm of twisted sand ropes from (x0, y0) to (x1, y1), w wide
  function ropes(c, x0, y0, x1, y1, w) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    poly(c, [[x0 + nx * w / 2, y0 + ny * w / 2], [x1 + nx * w / 2, y1 + ny * w / 2], [x1 - nx * w / 2, y1 - ny * w / 2], [x0 - nx * w / 2, y0 - ny * w / 2]], C.m);
    poly(c, [[x0 + nx * w / 2, y0 + ny * w / 2], [x1 + nx * w / 2, y1 + ny * w / 2], [x1 + nx * w * 0.15, y1 + ny * w * 0.15], [x0 + nx * w * 0.15, y0 + ny * w * 0.15]], C.s);
    for (let u = 0.08; u < 1; u += 0.16) { const bx = x0 + dx * u, by = y0 + dy * u; poly(c, [[bx + nx * w / 2, by + ny * w / 2], [bx + dx / L * w * 0.5 - nx * w / 2, by + dy / L * w * 0.5 - ny * w / 2], [bx + dx / L * w * 0.3 - nx * w / 2, by + dy / L * w * 0.3 - ny * w / 2], [bx - dx / L * w * 0.2 + nx * w / 2, by - dy / L * w * 0.2 + ny * w / 2]], C.o); }   // the twist
  }
  // a fist of sand facing +x: (0, 0) the wrist, s its size; arm how long the rope forearm trails behind
  function fistVec(c, s, arm) {
    ropes(c, -arm, 0, s * 0.06, 0, s * 0.42);
    poly(c, [[0, -s * 0.34], [s * 0.4, -s * 0.38], [s * 0.6, -s * 0.2], [s * 0.6, s * 0.22], [s * 0.38, s * 0.36], [0, s * 0.3]], C.s);
    poly(c, [[0, -s * 0.34], [s * 0.4, -s * 0.38], [s * 0.6, -s * 0.2], [s * 0.34, -s * 0.16], [0, -s * 0.12]], C.l);
    poly(c, [[s * 0.38, s * 0.36], [s * 0.6, s * 0.22], [s * 0.6, s * 0.02], [s * 0.4, s * 0.1], [0, s * 0.16], [0, s * 0.3]], C.m);
    for (let i = 0; i < 3; i++) poly(c, [[s * 0.44, -s * 0.22 + i * s * 0.15], [s * 0.62, -s * 0.2 + i * s * 0.15], [s * 0.6, -s * 0.11 + i * s * 0.15], [s * 0.44, -s * 0.12 + i * s * 0.15]], i % 2 ? C.o : C.d);   // knuckle lines
    poly(c, [[s * 0.1, s * 0.02], [s * 0.4, -s * 0.02], [s * 0.44, s * 0.12], [s * 0.14, s * 0.18]], C.l);   // the thumb across
  }
  // a hand of sand rising out of the floor: (0, 0) the floor, s its height; close 0 open .. 1 shut
  function handVec(c, s, close) {
    ropes(c, 0, s * 0.1, 0, -s * 0.42, s * 0.4);
    const fin = (i, col, hi) => {
      // two joints: out and up to the knuckle, then hooking back in; thick, like packed sand
      const sd = Math.sign(i), bx = i * s * 0.16, kx = i * s * 0.3, ky = -s * 0.68, jx = mix(i * s * 0.36, i * s * 0.24, close), jy = mix(-s * 0.9, -s * 0.84, close), tx = mix(i * s * 0.27, i * s * 0.06, close), ty = mix(-s * 1.04, -s * 0.62, close);
      limb(c, [[bx, -s * 0.46], [kx, ky], [jx, jy], [tx, ty]], s * 0.17, col); limb(c, [[bx - sd * s * 0.03, -s * 0.48], [kx - sd * s * 0.03, ky], [jx - sd * s * 0.03, jy]], s * 0.06, hi);
      const ax = i === 0 ? 0 : -sd, ay = i === 0 ? -1 : 0.5;   // the claw: up for the middle finger, inward for the rest
      poly(c, [[tx - s * 0.07, ty - s * 0.02], [tx + s * 0.07, ty + s * 0.02], [tx + ax * s * 0.24 * (0.5 + close * 0.5), ty + ay * s * 0.24 * (i === 0 ? 1 : 0.5 + close * 0.5)]], C.p);
    };
    fin(0, C.m, C.s);
    poly(c, [[-s * 0.3, -s * 0.3], [s * 0.3, -s * 0.3], [s * 0.46, -s * 0.58], [-s * 0.46, -s * 0.58]], C.s);
    poly(c, [[-s * 0.3, -s * 0.3], [s * 0.3, -s * 0.3], [s * 0.34, -s * 0.42], [-s * 0.34, -s * 0.42]], C.o);
    [-2, -1, 1, 2].forEach(i => fin(i, Math.abs(i) === 2 ? C.s : C.m, C.l));
  }
  // the tip of a buried tower: (0, 0) its base on the floor, w wide, h tall
  function spireVec(c, w, h) {
    poly(c, [[-w * 0.5, 0], [w * 0.5, 0], [w * 0.38, -h * 0.62], [-w * 0.38, -h * 0.62]], C.m);
    poly(c, [[-w * 0.5, 0], [-w * 0.1, 0], [-w * 0.08, -h * 0.62], [-w * 0.38, -h * 0.62]], C.s);
    poly(c, [[-w * 0.46, -h * 0.62], [-w * 0.34, -h * 0.8], [0, -h], [w * 0.34, -h * 0.8], [w * 0.46, -h * 0.62]], C.s);   // the dome
    poly(c, [[-w * 0.46, -h * 0.62], [-w * 0.34, -h * 0.8], [0, -h], [-w * 0.06, -h * 0.62]], C.l);
    poly(c, [[-w * 0.05, -h], [0, -h * 1.14], [w * 0.05, -h]], C.p);   // its finial
    poly(c, [[-w * 0.5, -h * 0.6], [w * 0.5, -h * 0.6], [w * 0.5, -h * 0.66], [-w * 0.5, -h * 0.66]], C.o);   // the cornice
    for (let i = 0; i < 2; i++) { const yy = -h * (0.2 + i * 0.22); poly(c, [[-w * 0.12, yy], [-w * 0.12, yy - h * 0.1], [0, yy - h * 0.15], [w * 0.12, yy - h * 0.1], [w * 0.12, yy]], C.k); c.fillStyle = C.eye; c.fillRect(-1, Math.round(yy - h * 0.06), 2, 2); }   // arched windows, a light still in them
    c.strokeStyle = C.d; c.lineWidth = 1; c.beginPath(); c.moveTo(w * 0.3, -h * 0.5); c.lineTo(w * 0.16, -h * 0.34); c.lineTo(w * 0.26, -h * 0.16); c.stroke();   // a crack
  }
  // jaws of sand: (0, 0) the hinge on the floor, s their height; open 0 shut .. 1 wide
  function mawVec(c, s, open) {
    poly(c, [[-s * 0.5 * open - s * 0.1, 0], [s * 0.5 * open + s * 0.1, 0], [s * 0.3 * open, -s * 0.3], [-s * 0.3 * open, -s * 0.3]], C.k);   // the throat
    for (const d of [-1, 1]) {
      c.save(); c.scale(d, 1); c.rotate(open * 0.85);
      poly(c, [[0, 0], [s * 0.36, -s * 0.08], [s * 0.34, -s * 0.66], [s * 0.1, -s * 1.02], [0, -s * 0.94], [s * 0.05, -s * 0.5]], C.m);
      poly(c, [[s * 0.36, -s * 0.08], [s * 0.34, -s * 0.66], [s * 0.1, -s * 1.02], [s * 0.2, -s * 0.62], [s * 0.22, -s * 0.1]], C.s);
      for (let i = 0; i < 4; i++) { const yy = -s * (0.26 + i * 0.19), q = s * (0.11 - i * 0.012); poly(c, [[s * 0.06, yy], [s * 0.06, yy - q], [-q * 1.2, yy - q * 0.5]], i % 2 ? C.p : C.l); }   // teeth of broken masonry
      poly(c, [[s * 0.2, -s * 0.3], [s * 0.3, -s * 0.3], [s * 0.3, -s * 0.2], [s * 0.2, -s * 0.2]], C.o);   // a block of wall caught in it
      c.restore();
    }
  }
  // her face in the sand: (0, 0) its middle, s its height; glare lights the eyes white
  function visageVec(c, s, glare) {
    poly(c, [[-s * 0.3, s * 0.4], [-s * 0.72, s * 1.2], [s * 0.72, s * 1.2], [s * 0.3, s * 0.4]], C.o);   // the cloak, running down into the ground
    for (let i = -3; i <= 3; i++) poly(c, [[i * s * 0.09, s * 0.44], [i * s * 0.2 - s * 0.03, s * 1.2], [i * s * 0.2 + s * 0.05, s * 1.2]], i % 2 ? C.m : C.d);
    poly(c, [[0, -s * 0.64], [s * 0.36, -s * 0.3], [s * 0.46, s * 0.2], [s * 0.3, s * 0.5], [-s * 0.3, s * 0.5], [-s * 0.46, s * 0.2], [-s * 0.36, -s * 0.3]], C.m);   // the hood
    poly(c, [[0, -s * 0.64], [-s * 0.36, -s * 0.3], [-s * 0.46, s * 0.2], [-s * 0.3, s * 0.5], [-s * 0.12, s * 0.2], [-s * 0.14, -s * 0.3]], C.s);
    poly(c, [[0, -s * 0.36], [s * 0.25, -s * 0.15], [s * 0.23, s * 0.12], [-s * 0.23, s * 0.12], [-s * 0.25, -s * 0.15]], C.k);   // the dark under it
    poly(c, [[-s * 0.25, s * 0.04], [s * 0.25, s * 0.04], [s * 0.21, s * 0.44], [0, s * 0.52], [-s * 0.21, s * 0.44]], C.l);   // the veil
    for (let i = -1; i <= 1; i++) poly(c, [[i * s * 0.1 - s * 0.01, s * 0.08], [i * s * 0.1 + s * 0.01, s * 0.08], [i * s * 0.13, s * 0.44]], C.m);
    for (const d of [-1, 1]) { poly(c, [[d * s * 0.2, -s * 0.11], [d * s * 0.04, -s * 0.05], [d * s * 0.06, -s * 0.0], [d * s * 0.19, -s * 0.045]], C.eye); poly(c, [[d * s * 0.16, -s * 0.085], [d * s * 0.07, -s * 0.045], [d * s * 0.14, -s * 0.04]], glare ? C.w : C.p); }   // pale gold eyes, slanted
  }
  const spr = (ctx, x, y, w, h, fn, o) => PX.sprite(ctx, x, y, w, h, fn, Object.assign({ pal: PAL }, o || {}));
  function fist(ctx, x, y, s, ang, arm, o) { o = o || {}; const b = (s + arm) * 2.2; spr(ctx, x, y, b, b, c => { c.rotate(ang); fistVec(c, s, arm); }, { alpha: o.a, mono: o.mono }); }
  function hand(ctx, x, y, s, close, o) { o = o || {}; spr(ctx, x, y - s * 0.5, s * 1.5, s * 1.5, c => { c.translate(0, s * 0.5); handVec(c, s, close); }, { alpha: o.a, mono: o.mono }); }
  function visage(ctx, x, y, s, o) { o = o || {}; spr(ctx, x, y + s * 0.3, s * 1.7, s * 2.1, c => { c.translate(0, -s * 0.3); visageVec(c, s, o.glare); }, { alpha: o.a, mono: o.mono }); }
  Object.assign(DM, { fist, hand, visage });

  // ================= U: Sand Lance: a buried spire =================
  const _sl = CASTS.sand_lance;
  CASTS.sand_lance = function (p, z) {
    const n0 = z.shots.length, r = _sl.apply(this, arguments);
    if (!isD(G)) return r;
    const vis = z.shots.slice(n0).find(s => s.life === 38 && s.render); if (!vis) return r;
    vis.render = (ctx, sx, sy, t) => {
      if (t < 5) { ctx.save(); ctx.globalAlpha = 0.7; ctx.strokeStyle = '#8a6a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx, sy, 3 + t * 2.4, 1 + t * 0.5, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); return; }   // the sand dimples first
      const k = t - 8, up = Math.min(1, (t - 5) / 5) * (k > 22 ? Math.max(0, 1 - (k - 22) / 8) : 1), h = 62;
      spr(ctx, sx, sy - h * 0.55, 60, h * 1.5, c => { c.beginPath(); c.rect(-30, -h * 0.75, 60, h * 1.3); c.clip(); c.translate(0, h * 0.55 + h * 1.16 * (1 - up)); spireVec(c, 22, h); });
      ctx.save(); ctx.globalAlpha = 0.9; for (let i = 0; i < 4; i++) { const u = ((k * 0.09 + i * 0.25) % 1); art.rect(ctx, i % 2 ? '#f0cf80' : '#d9a441', sx + (i % 2 ? 9 : -10) + (i > 1 ? 3 : 0), Math.round(sy - h * up * (1 - u * 0.9)), 1, 4); } ctx.restore();   // sand pouring off it
      art.rect(ctx, '#8a6a2a', sx - 14, sy - 2, 28, 2);
    };
    return r;
  };

  // ================= S+U: Dune Grip: the hand =================
  const _dg = CASTS.dune_grip;
  CASTS.dune_grip = function (p, z) {
    const n0 = z.shots.length, r = _dg.apply(this, arguments);
    if (!isD(G)) return r;
    const vis = z.shots.slice(n0).find(s => s.life === 52 && s.render); if (!vis) return r;
    vis.render = (ctx, x, y, t) => {
      const up = ease(t / 8), cl = t > 10 ? ease((t - 10) / 5) : 0, sq = t > 16 && t < 40 ? Math.sin(t * 0.9) * 0.04 : 0, crush = t >= 40 ? ease((t - 40) / 3) : 0, a = t > 46 ? (52 - t) / 6 : 1, S = 58;
      spr(ctx, x, y - S * 0.5, S * 1.6, S * 1.4, c => { c.beginPath(); c.rect(-S, -S * 0.9, S * 2, S * 1.4); c.clip(); c.translate(0, S * 0.5 + S * (1 - up)); handVec(c, S, clamp01(cl * 0.8 + sq + crush * 0.25)); }, { alpha: a, mono: t === 40 || t === 41 ? '#ffffff' : undefined });
      if (t === 40 || t === 41) { ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y - 26, 22, 26, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); }
      if (t % 3 === 0 && t < 46) part(G.cam.x + x + rand(-16, 16), G.cam.y + y - rand(0, 40), t % 2 ? '#d9a441' : '#f0cf80', rand(-0.4, 0.4), 0.7, 12, 2, 0.05);
    };
    return r;
  };

  // ================= I: Sinking Sands: a dune with the city turning over in it =================
  const _ss = CASTS.sinking_sands;
  CASTS.sinking_sands = function (p, z) {
    const n0 = z.shots.length, r = _ss.apply(this, arguments);
    if (!isD(G)) return r;
    const s0 = z.shots.slice(n0).find(s => s instanceof Proj && s.w === 40); if (!s0) return r;
    s0.render = (ctx, x, y, pr) => {
      const d = Math.sign(pr.vx) || 1, k = Math.min(1, pr.t / 6), gy = y + 13, t = pr.t;
      spr(ctx, x, gy - 14, 84, 60, c => {
        c.translate(0, 14); c.scale(d, 1);
        c.save(); c.translate(-6, -8 * k); c.rotate(-0.5 + Math.sin(t * 0.2) * 0.2);   // a broken arch
        poly(c, [[-9, 6], [-9, -10], [-5, -10], [-5, 6]], C.l); poly(c, [[5, 6], [5, -8], [9, -8], [9, 6]], C.m); poly(c, [[-9, -10], [-4, -17], [3, -16], [9, -8], [5, -8], [1, -12], [-3, -12], [-5, -10]], C.s);
        c.restore();
        c.save(); c.translate(11, -9 * k); c.rotate(0.6 + Math.cos(t * 0.17) * 0.25); poly(c, [[-8, -2], [8, -4], [9, 0], [-7, 3]], C.o); poly(c, [[-8, -2], [8, -4], [7, -6], [-6, -4]], C.m); c.restore();   // a roof slab
        const pts = [[-30, 0]]; for (let i = -24; i <= 24; i += 6) pts.push([i, -(15 - Math.abs(i) * 0.36) * k - Math.sin(t * 0.4 + i * 0.3) * 1.5]); pts.push([30, 0]);
        poly(c, pts, C.s);   // the dune over them
        poly(c, pts.map((q, i) => (i === 0 || i === pts.length - 1 ? q : [q[0], q[1] + 4])), C.m);
        poly(c, [[14, 0], [24, -5 * k], [34, 0]], C.l);   // its lip, breaking forward
      });
    };
    return r;
  };

  // ================= S+I: Dune Sea: a breaking wave of sand =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.dune;
  if (BU && BU.cast) {
    const _ds = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ds.apply(this, arguments);
      if (!isD(G)) return r;
      const s0 = z.shots.slice(n0).find(s => s instanceof Proj && s.h === 60); if (!s0) return r;
      s0.render = (ctx, x, y, pr) => {
        const d = Math.sign(pr.vx) || 1, k = ease(pr.t / 8), gy = y + 30, t = pr.t, Hh = 66 * k;
        PX.lines(ctx, x - d * 30, y, d > 0 ? 0 : PI, 50, 6, t, '#f0cf80', 50);
        spr(ctx, x, gy - 36, 110, 110, c => {
          c.translate(0, 36); c.scale(d, 1);
          poly(c, [[-40, 0], [-30, -Hh * 0.5], [-12, -Hh * 0.9], [8, -Hh], [26, -Hh * 0.88], [34, -Hh * 0.66], [26, -Hh * 0.6], [14, -Hh * 0.7], [6, -Hh * 0.5], [10, -Hh * 0.2], [20, 0]], C.m);   // the body, curling over
          poly(c, [[-40, 0], [-30, -Hh * 0.5], [-12, -Hh * 0.9], [8, -Hh], [-2, -Hh * 0.7], [-16, -Hh * 0.4], [-22, 0]], C.s);
          poly(c, [[8, -Hh], [26, -Hh * 0.88], [34, -Hh * 0.66], [26, -Hh * 0.6], [22, -Hh * 0.8]], C.p);   // the crest
          c.save(); c.translate(-8, -Hh * 0.45); c.rotate(t * 0.18); poly(c, [[-4, -9], [4, -9], [4, 9], [-4, 9]], C.l); poly(c, [[-6, -11], [6, -11], [6, -8], [-6, -8]], C.p); c.restore();   // a column tumbling in it
          c.save(); c.translate(4, -Hh * 0.22); c.rotate(-t * 0.13); poly(c, [[-8, 3], [-6, -4], [0, -8], [6, -4], [8, 3]], C.l); poly(c, [[-1, -8], [0, -12], [1, -8]], C.p); c.restore();   // and a dome
          c.save(); c.translate(-24, -Hh * 0.2); c.rotate(t * 0.1); poly(c, [[-4, -4], [4, -4], [4, 4], [-4, 4]], C.o); c.restore();
        });
      };
      return r;
    };
  }

  // ================= W+O: Sand Maw =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.dune;
  if (SIG && SIG.cast) {
    const _sm = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _sm.apply(this, arguments);
      if (!isD(G)) return r;
      const a0 = z.shots.slice(n0).find(s => s.life === 36 && s.paint); if (!a0) return r;
      a0.paint = (ctx, sx, sy, s) => {
        if (s.t < 8) { const k = s.t / 8; ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = '#1e1408'; ctx.beginPath(); ctx.ellipse(sx, sy, 20 * k, 4 * k, 0, 0, PI * 2); ctx.fill(); ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx, sy, 24 * k, 5 * k, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); return; }   // the floor sinks into a pit
        const k = s.t - 12, up = Math.min(1, (s.t - 8) / 4) * (k > 16 ? Math.max(0, (24 - k) / 8) : 1), open = k < 1 ? 1 : Math.max(0, 1 - (k - 1) / 2), S = 54;
        spr(ctx, sx, sy - S * 0.5, S * 2.2, S * 1.5, c => { c.beginPath(); c.rect(-S * 1.1, -S, S * 2.2, S * 1.5); c.clip(); c.translate(0, S * 0.5 + S * (1 - up)); mawVec(c, S, open); }, { mono: k === 3 ? '#ffffff' : undefined });
        if (k >= 3 && k < 7) { ctx.save(); ctx.globalAlpha = 1 - (k - 3) / 4; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy - 24, 10 + (k - 3) * 9, 6 + (k - 3) * 5, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); }
      };
      return r;
    };
  }

  // ================= J: the fist of sand, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= -4 && k < 8) {
        const big = !!a.fin || a.heavy, reach = a.box ? a.box[0] + a.box[2] * 0.55 : 22, out = k < 0 ? ease((k + 4) / 4) : 1 - ease((k - 2) / 6) * 0.6, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), S = big ? 34 : 24;
        const up = a.anim === 'launcher' ? -0.9 : 0;
        if (k >= 0 && k < 3) PX.lines(ctx, sx + d * 4, hy, d > 0 ? 0 : PI, 40, 5, p.t, '#f0cf80', 24);
        fist(ctx, sx + d * (6 + reach * out), hy + up * 10 * out, S, d > 0 ? up : PI - up, 14 + reach * out * 0.8, { a: k > 4 ? 1 - (k - 4) / 4 : 1 });
        if (k === 0) grains(p.x + d * (10 + reach), p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 9 : 5, 2.6, d);
      }
    }
    if (p.modeT > 0) { const fade = Math.min(1, p.modeT / 30); ctx.save(); ctx.globalAlpha = fade; for (let i = 0; i < 6; i++) { const u = ((p.t * 0.03 + i * 0.17) % 1); art.rect(ctx, i % 2 ? '#d9a441' : '#f0cf80', sx + (i % 2 ? 7 : -8) + (i % 3), Math.round(sy - 34 + u * 30), 1, 3); } ctx.restore(); }   // sand runs off her shoulders
    if (p.awakeT > 0) {   // a low ring of blowing sand, a few glints
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = fade; for (let i = 0; i < 10; i++) { const u = p.t * 0.12 + i * 0.63, x = sx + Math.cos(u) * 18, y = sy - 6 + Math.sin(u) * 4 - (i % 3) * 3; art.rect(ctx, i % 5 === 0 && p.t % 20 < 4 ? '#ffffff' : i % 2 ? '#d9a441' : '#f0cf80', Math.round(x), Math.round(y), 2, 1); } ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isD(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: Buried City =================
  // the Meridian, in screen space: it looms out of the dust above the fighters' heads (never over them); k how far it
  // has risen, fall how far it has dropped
  function city(ctx, k, fall, t) {
    const base = 176, a = Math.min(1, k * 2.2) * (1 - fall * 0.2);   // solid early: it has to read as a city, not as haze
    ctx.save();
    for (let i = 0; i < 13; i++) {
      const w = 16 + Math.round(rnd(i, 1) * 18), x = Math.round(i * 38 + rnd(i, 2) * 14 - 8), full = 50 + rnd(i, 3) * 80, h = Math.round(full * ease(k * 1.3 - rnd(i, 4) * 0.3) * (1 - fall)), far = i % 3 === 0;
      if (h < 3) continue;
      const y0 = base + Math.round(fall * 30);
      ctx.globalAlpha = a;
      art.rect(ctx, far ? '#2e2010' : '#4a3414', x, y0 - h, w, h); art.rect(ctx, far ? '#4a3414' : '#8a6a2a', x, y0 - h, Math.max(2, Math.round(w * 0.25)), h);
      if (i % 2) { art.disc(ctx, far ? '#2e2010' : '#4a3414', x + (w >> 1), y0 - h, w >> 1); art.rect(ctx, far ? '#4a3414' : '#8a6a2a', x + 2, y0 - h - (w >> 2), 2, w >> 2); art.rect(ctx, '#f0cf80', x + (w >> 1), y0 - h - (w >> 1) - 5, 1, 5); }   // a dome and its finial
      else { for (let j = 0; j < 4; j++) art.rect(ctx, far ? '#2e2010' : '#4a3414', x + j + 2, y0 - h - j * 3 - 3, Math.max(1, w - 4 - j * 2), 3); }   // a stepped spire
      for (let j = 0; j < Math.floor(h / 14); j++) if (rnd(i, j + 9) > 0.45) art.rect(ctx, (t + i * 7 + j * 3) % 30 < 26 ? '#ffe66a' : '#8a6a2a', x + 4 + ((j * 5) % Math.max(1, w - 9)), y0 - h + 6 + j * 14, 3, 4);   // windows, still lit
    }
    for (let j = 0; j < 6; j++) { ctx.globalAlpha = a * (0.2 + j * 0.14); art.rect(ctx, j > 3 ? '#f0cf80' : '#d9a441', 0, base - 24 + j * 5, W, 5); }   // the dust it stands in
    ctx.restore();
  }
  const _ult = N.ULT.buried_city;
  if (_ult) N.ULT.buried_city = function (p, z, foes) {
    const r = _ult.apply(this, arguments);
    if (!isD(G)) return r;
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('dune') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const sky = new Vis(p.x, p.y, 500, (ctx) => {
        const st = p.st; if (p.state !== 'ult' || st > 70) return;
        city(ctx, ease((st - 6) / 30), st >= 52 ? ease((st - 52) / 8) : 0, st);
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    if (N.every(p, 12, 44, 8)) foes.forEach(e => {   // a hand of sand holds each of them while the city rises
      if (!e || e.dead) return;
      const v = new Vis(e.x, e.y, 10, (ctx, sx, sy, t) => hand(ctx, sx, sy, 40, 0.5 + 0.4 * Math.sin(t / 10 * PI), { a: 1 - ease((t - 6) / 4) }));
      v._ugS = 1; z.shots.push(v);
    });
    return r;
  };
  // the finishing blow: her face rises in the sand behind the target; a colossal fist comes down on an impact frame
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult' || SW.frame - (v.f0o === undefined ? (v.f0o = SW.frame) : v.f0o) > 400 || !(G.player === p || (SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p)))) return false;   // (a match quit mid-ultimate leaves the old fighter in 'ult' for ever: stop when it is gone)
      const st = p.st; if (st < BU2 - 2 || st > FIN + 16) return;
      const sx = Math.round(v.x - cam.x), sy = Math.round(v.y - cam.y), cy = sy - 20;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 10), drop = clamp01((st - (FIN - 6)) / 6), sh = st > FIN - 10 ? Math.sin(st * 2.3) * 1.2 : 0;
        visage(ctx, sx - dir * 52 + sh, cy - 20 + 70 * (1 - k), 64, { a: k, glare: st > FIN - 12 });
        if (drop > 0) fist(ctx, sx + dir * 4, cy - 150 + 128 * drop * drop, 60, PI / 2, 120, {});
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 91);
        visage(ctx, sx - dir * 52, cy - 20, 64, { glare: true, mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease((k - 0.4) / 0.6) });
        fist(ctx, sx + dir * 4, cy - 22 + k * 6, 60, PI / 2, 120, { mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease((k - 0.5) / 0.5) });
        ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#f0cf80'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy, 14 + k * 110, 3 + k * 14, 0, 0, PI * 2); ctx.stroke(); ctx.restore();   // the shock along the floor
        if (st === FIN) grains(T.x, T.y - 10, 30, 5, 0);
      }
    });
  }
})();
