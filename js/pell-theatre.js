'use strict';
// Shattered Worlds — Pell's marionette and theatre (2026-11-20, the hero-look rework: cool, not cute). His look: "a white
// porcelain mask and a plum coat, glowing pink threads running from every fingertip to a wooden marionette with blades
// for arms". The puppet is the kit, so it is redrawn as a tall, thin thing with a cracked porcelain face and two long
// hooked blades, hanging from taut glowing strings; the rest is the stage it performs on. Crisp pixel art through
// js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/vesna-blood.js.
//   (always) the marionette: jointed, blade-armed, on five glowing strings from his hand
//   U      Puppet Lunge: it thrusts both blades out on its strings, with speed lines
//   S+U    Venom Mist: its jaw drops; pale masks drift in the plum mist
//   I      Iron Cradle: a spiked iron coffin with a mask for a face shuts on the target
//   S+I    Hundred Strings: it rises with its chest open and fires needles that each trail a thread
//   W+O    Cat's Cradle: a real string figure held by two porcelain hands; it glints each time it catches
//   J x4   the finisher: a hooked string snaps taut from his fingers
//   S+O    Taut Strings: threads fan from his fingers       O  Grand Strings: thin strings rise from Pell himself
//   W+I    Grand Theatre: the curtains close on the arena, marionettes drop on strings and cut; at the finishing
//          blow (js/ult-grand.js) the porcelain mask looms beside the target, every string snaps tight on an impact
//          frame, and the curtain falls
// SW.pellTheatre.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.puppet_lunge) return;
  const PT = SW.pellTheatre = { on: true };
  const isP = g => !!(PT.on && g && g.state && g.state.hero === 'pell');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const bar = (c, pts, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };

  const PAL = ['#12060e', '#3a1030', '#6a1a5a', '#b5179e', '#ff7ad9', '#ffc8f0', '#4a2e1e', '#7a4e30', '#b08458', '#a89c90', '#f0e6d8', '#ffffff', '#8a90a0', '#e8ecf4', '#4a4e5c'];
  const C = { ink: PAL[0], pd: PAL[1], pm: PAL[2], pl: PAL[3], pk: PAL[4], pp: PAL[5], wd: PAL[6], wm: PAL[7], wl: PAL[8], ps: PAL[9], po: PAL[10], w: PAL[11], st: PAL[12], sl: PAL[13] };

  // ================= the porcelain mask: (0, 0) its middle, s its height =================
  function maskVec(c, s, o) {
    const g = o && o.glare;
    poly(c, [[-s * 0.3, -s * 0.36], [s * 0.26, -s * 0.4], [s * 0.36, -s * 0.1], [s * 0.26, s * 0.3], [0, s * 0.5], [-s * 0.26, s * 0.3], [-s * 0.38, -s * 0.06]], C.po);
    poly(c, [[-s * 0.3, -s * 0.36], [-s * 0.06, -s * 0.38], [-s * 0.14, s * 0.1], [-s * 0.1, s * 0.44], [-s * 0.26, s * 0.3], [-s * 0.38, -s * 0.06]], C.ps);   // the shadowed side
    poly(c, [[-s * 0.26, -s * 0.14], [-s * 0.06, -s * 0.08], [-s * 0.08, -s * 0.02], [-s * 0.24, -s * 0.05]], C.ink);   // the eyes: two slanted slits
    poly(c, [[s * 0.26, -s * 0.16], [s * 0.06, -s * 0.08], [s * 0.08, -s * 0.02], [s * 0.24, -s * 0.06]], C.ink);
    poly(c, [[-s * 0.19, -s * 0.095], [-s * 0.1, -s * 0.065], [-s * 0.17, -s * 0.055]], g ? C.w : C.pk); poly(c, [[s * 0.19, -s * 0.105], [s * 0.1, -s * 0.07], [s * 0.17, -s * 0.06]], g ? C.w : C.pk);   // a pink light in each
    c.strokeStyle = C.ink; c.lineWidth = Math.max(1, s * 0.035); c.beginPath(); c.moveTo(-s * 0.2, s * 0.14); c.quadraticCurveTo(0, s * 0.34, s * 0.22, s * 0.1); c.stroke();   // the carved smile
    c.beginPath(); c.moveTo(-s * 0.2, s * 0.14); c.lineTo(-s * 0.24, s * 0.09); c.moveTo(s * 0.22, s * 0.1); c.lineTo(s * 0.27, s * 0.05); c.stroke();
    c.lineWidth = Math.max(1, s * 0.02); c.beginPath(); c.moveTo(s * 0.12, -s * 0.38); c.lineTo(s * 0.18, -s * 0.22); c.lineTo(s * 0.12, -s * 0.16); c.lineTo(s * 0.2, s * 0.02); c.stroke();   // a crack
    poly(c, [[-s * 0.2, s * 0.0], [-s * 0.16, s * 0.1], [-s * 0.24, s * 0.08]], C.pl); poly(c, [[s * 0.2, -s * 0.01], [s * 0.16, s * 0.08], [s * 0.24, s * 0.06]], C.pl);   // plum tear marks
  }

  // ================= the marionette: (0, 0) under its feet, facing +x, s its height =================
  // o = { pose: 'hang' | 'lunge' | 'open', t, glare }
  const mix = (a0, a1, u) => a0 + (a1 - a0) * u;
  function cutAng(v, k, far) {
    const u = ease(k * 1.5);
    if (v === 0) return far ? [-0.6, -0.9] : [mix(2.7, 0.9, u), mix(3.1, 0.6, u)];                 // the near blade comes down
    if (v === 1) return far ? [mix(0.3, 2.3, u), mix(0.1, 2.7, u)] : [-0.4, -0.7];                 // the far blade rises
    if (v === 2) return far ? [mix(0.5, 1.6, u), mix(0.3, 1.75, u)] : [mix(0.5, 1.5, u), mix(0.3, 1.5, u)];   // both thrust
    return far ? [mix(3.3, 1.2, u), mix(3.6, 1.0, u)] : [mix(2.9, 1.0, u), mix(3.2, 0.7, u)];       // both come down, crossing
  }
  function marVec(c, s, o) {
    const t = o.t || 0, pose = o.pose || 'hang', sw = Math.sin(t * 0.13) * 0.12, lw = Math.max(1.2, s * 0.042);
    const sh = [0, -s * 0.72], hip = [-s * 0.02, -s * 0.44];
    // the cloak, in tatters, hanging behind
    poly(c, [[-s * 0.1, -s * 0.72], [s * 0.06, -s * 0.72], [-s * 0.06, -s * 0.5], [-s * 0.22 + sw * s * 0.3, -s * 0.14], [-s * 0.26 + sw * s * 0.3, -s * 0.3], [-s * 0.34 + sw * s * 0.3, -s * 0.2], [-s * 0.26, -s * 0.5]], C.pd);
    poly(c, [[-s * 0.1, -s * 0.72], [-s * 0.02, -s * 0.72], [-s * 0.2, -s * 0.36], [-s * 0.26, -s * 0.5]], C.pm);
    // legs: thin, jointed, dangling; pointed feet that never touch the floor
    const leg = (dx, ph, col) => { const a = 0.15 + Math.sin(t * 0.13 + ph) * 0.2 + (pose === 'lunge' ? -0.7 : 0), kx = hip[0] + dx + Math.sin(a) * s * 0.2, ky = hip[1] + Math.cos(a) * s * 0.2, fx2 = kx + Math.sin(a - 0.5) * s * 0.2, fy2 = ky + Math.cos(a - 0.5) * s * 0.2; bar(c, [[hip[0] + dx, hip[1]], [kx, ky], [fx2, fy2]], lw, col); ell(c, kx, ky, lw * 0.75, lw * 0.75, C.wl); poly(c, [[fx2 - lw * 0.5, fy2 - lw * 0.4], [fx2 + s * 0.09, fy2 + lw * 0.5], [fx2 - lw * 0.4, fy2 + lw * 0.7]], C.wd); };
    leg(-s * 0.03, 1.5, C.wd); leg(s * 0.04, 0, C.wm);
    // the far arm and its blade
    const arm = (far) => {
      const col = far ? C.wd : C.wm, bc = far ? C.st : C.sl;
      let ua, fa;   // upper-arm and blade angles from straight down, toward +x
      if (pose === 'lunge') { ua = 1.5 + (far ? 0.12 : -0.08); fa = 1.5 + (far ? 0.22 : -0.02); }
      else if (pose === 'open') { ua = far ? -2.2 : 2.2; fa = far ? -2.6 : 2.6; }
      else if (pose === 'cut') { const q = cutAng(o.v || 0, o.k || 0, far); ua = q[0]; fa = q[1]; }
      else { ua = (far ? -0.7 : 0.75) + sw; fa = (far ? -1.0 : 1.05) + sw * 1.5; }   // hanging: one blade out in front, one behind
      const sx = sh[0] + (far ? -s * 0.02 : s * 0.05), ex = sx + Math.sin(ua) * s * 0.15, ey = sh[1] + Math.cos(ua) * s * 0.15;
      bar(c, [[sx, sh[1]], [ex, ey]], lw, col); ell(c, ex, ey, lw * 0.75, lw * 0.75, C.wl);
      const L = s * 0.68, tx = ex + Math.sin(fa) * L, ty = ey + Math.cos(fa) * L, nx = Math.cos(fa), ny = -Math.sin(fa), w = s * 0.035;   // the blade: long, hooked at the tip
      poly(c, [[ex + nx * w, ey + ny * w], [ex + Math.sin(fa) * L * 0.8 + nx * w * 1.6, ey + Math.cos(fa) * L * 0.8 + ny * w * 1.6], [tx + nx * w * 3.4, ty + ny * w * 3.4], [tx, ty], [ex - nx * w, ey - ny * w]], bc);
      poly(c, [[ex + nx * w, ey + ny * w], [ex + Math.sin(fa) * L * 0.8 + nx * w * 1.6, ey + Math.cos(fa) * L * 0.8 + ny * w * 1.6], [tx + nx * w * 3.4, ty + ny * w * 3.4], [ex + Math.sin(fa) * L * 0.5 + nx * w * 0.4, ey + Math.cos(fa) * L * 0.5 + ny * w * 0.4]], far ? C.sl : C.w);
    };
    arm(true);
    // the body: a narrow wooden torso, a plum sash; open: the chest splits and shows its needles
    poly(c, [[-s * 0.07, -s * 0.76], [s * 0.07, -s * 0.76], [s * 0.035, -s * 0.44], [-s * 0.05, -s * 0.44]], C.wm);
    poly(c, [[-s * 0.07, -s * 0.76], [-s * 0.01, -s * 0.76], [-s * 0.02, -s * 0.44], [-s * 0.05, -s * 0.44]], C.wd);
    for (let i = 0; i < 3; i++) { c.fillStyle = C.wd; c.fillRect(Math.round(-s * 0.04), Math.round(-s * (0.7 - i * 0.07)), Math.max(2, Math.round(s * 0.09)), 1); }   // ribs
    poly(c, [[-s * 0.08, -s * 0.47], [s * 0.06, -s * 0.5], [s * 0.06, -s * 0.44], [-s * 0.08, -s * 0.41]], C.pl);
    if (pose === 'open') { poly(c, [[-s * 0.04, -s * 0.68], [s * 0.05, -s * 0.68], [s * 0.04, -s * 0.52], [-s * 0.04, -s * 0.52]], C.ink); for (let i = 0; i < 4; i++) bar(c, [[-s * 0.02 + i * s * 0.02, -s * 0.6], [s * 0.2 + i * s * 0.03, -s * (0.7 - i * 0.07)]], 1, C.sl); }
    ell(c, hip[0], hip[1], lw, lw * 0.9, C.wl);
    // the head: the mask, tilted; open: the jaw drops
    c.save(); c.translate(s * 0.02, -s * 0.88); c.rotate(-0.18 + sw * 0.5 + (pose === 'lunge' ? 0.3 : 0));
    if (pose === 'open') poly(c, [[-s * 0.07, s * 0.07], [s * 0.08, s * 0.07], [s * 0.05, s * 0.2], [-s * 0.04, s * 0.2]], C.ps);
    maskVec(c, s * 0.23, o);
    c.restore();
    arm(false);
  }
  function marionette(ctx, x, y, s, dir, o) { o = o || {}; PX.sprite(ctx, x, y - s * 0.5, s * 2.4, s * 1.6, c => { c.translate(0, s * 0.5); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); marVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono }); }
  function mask(ctx, x, y, s, o) { o = o || {}; PX.sprite(ctx, x, y, s * 1.2, s * 1.3, c => { if (o.rot) c.rotate(o.rot); maskVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono }); }
  Object.assign(PT, { marionette, mask });
  // a glowing string between two points on screen, with a bright bead running down it
  function string(ctx, x0, y0, x1, y1, t, a) {
    ctx.save(); ctx.globalAlpha = (a === undefined ? 1 : a) * 0.75; art.line(ctx, '#ff7ad9', Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), 1);
    const u = ((t * 0.06) % 1); ctx.globalAlpha = a === undefined ? 1 : a; art.rect(ctx, '#ffffff', Math.round(x0 + (x1 - x0) * u), Math.round(y0 + (y1 - y0) * u), 1, 1); ctx.restore();
  }

  // ================= the puppet itself: every Puppet Pell owns is redrawn =================
  const S = 48;
  // ---------- the melee: the marionette does the cutting (the user, 2026-11-20: "make sure pell melee is puppet attacking") ----------
  // which cut a combo step is: 0 a downward slash, 1 a rising slash, 2 a double thrust, 3 both blades down in a cross
  function cutOf(p) {
    const a = p.atk, h = p.G && p.G.hero ? p.G.hero() : null, list = h && SW.data.combat ? SW.data.combat[h.combo] : null, i = list ? list.indexOf(a) : -1;
    if (i >= 0) return i % 4;
    return a.anim === 'launcher' ? 1 : a.anim === 'sweep' ? 0 : a.anim === 'air' ? 3 : 2;
  }
  // a cutting arc on screen: hard pixels, white inside pink; from angle a0 to a1 round (cx, cy)
  function slashArc(ctx, cx, cy, R, a0, a1, alpha, big) {
    ctx.save(); ctx.globalAlpha = clamp01(alpha);
    const n = 12; let px = cx + Math.cos(a0) * R, py = cy + Math.sin(a0) * R;
    for (let i = 1; i <= n; i++) { const u = i / n, a = a0 + (a1 - a0) * u, r = R * (1 - 0.12 * Math.sin(u * PI)), qx = cx + Math.cos(a) * r, qy = cy + Math.sin(a) * r, w = Math.max(1, Math.round((big ? 5 : 4) * Math.sin(u * PI)));
      art.line(ctx, '#ff7ad9', Math.round(px), Math.round(py), Math.round(qx), Math.round(qy), w + 1); art.line(ctx, '#ffffff', Math.round(px), Math.round(py), Math.round(qx), Math.round(qy), Math.max(1, w - 1)); px = qx; py = qy; }
    ctx.restore();
  }
  function drawPuppet(ctx, cam) {
    const p = this.p, d0 = this.face;
    const hx = Math.round(p.x - cam.x + p.face * 6), hy = Math.round(p.y - cam.y - 26);
    const strings = (x, y, d) => [[0, -S * 0.98], [d * S * 0.22, -S * 0.56], [-d * S * 0.2, -S * 0.56], [d * S * 0.06, -S * 0.24], [-d * S * 0.05, -S * 0.24]].forEach((q, i) => string(ctx, hx, hy, x + q[0], y + q[1], this.t + i * 9));
    const a = p.atk, melee = a && (p.state === 'attack' || p.state === 'airatk') && !this.job && !(this.open > 0);
    if (melee) {
      // it swings out in front of him on its strings, cuts on the frames the hit lands, and swings back
      const d = p.face, st = p.st, v = cutOf(p), reach = (a.box ? a.box[0] + a.box[2] * 0.55 : 24);
      const go = ease(st / Math.max(2, a.hitAt)) * (1 - ease((st - (a.dur - 5)) / 5)), k = clamp01((st - (a.hitAt - 3)) / 7);
      const bx = Math.round(this.x - cam.x), by = Math.round(this.y - cam.y) + 10;
      const fx2 = Math.round(p.x - cam.x + d * (reach - 6)), fy2 = Math.round(p.y - cam.y) + (v === 1 ? -4 - k * 8 : v === 3 ? -10 + k * 12 : 2);
      const x = Math.round(bx + (fx2 - bx) * go), y = Math.round(by + (fy2 - by) * go);
      strings(x, y, d);
      if (go > 0.5) PX.lines(ctx, x - d * 22, y - 24, d > 0 ? 0 : PI, 36, 5, this.t, '#ff7ad9', 26);
      marionette(ctx, x, y, S, d, { pose: 'cut', v, k, t: this.t, glare: true });
      const hitT = st - a.hitAt;
      if (hitT >= -1 && hitT < 7) {   // the cut itself, where the hit lands
        const al = 1 - Math.max(0, hitT) / 7, cx = x + d * 10, cy = y - 24, big = v === 3;
        const A = (t0, t1) => (d > 0 ? [t0, t1] : [PI - t0, PI - t1]);
        if (v === 0) { const q = A(-1.9, 0.9); slashArc(ctx, cx, cy, 30, q[0], q[1], al); }
        else if (v === 1) { const q = A(1.2, -1.5); slashArc(ctx, cx, cy, 30, q[0], q[1], al); }
        else if (v === 2) { for (const o2 of [-5, 3]) { ctx.save(); ctx.globalAlpha = al; art.line(ctx, '#ff7ad9', cx - d * 6, cy + o2, cx + d * 36, cy + o2 + 1, 3); art.line(ctx, '#ffffff', cx - d * 2, cy + o2, cx + d * 38, cy + o2 + 1, 1); ctx.restore(); } }
        else { const q = A(-2.1, 0.8), r = A(-1.2, 1.7); slashArc(ctx, cx, cy, 40, q[0], q[1], al, true); slashArc(ctx, cx + d * 4, cy, 34, r[0], r[1], al, true); }
      }
      return;
    }
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y) + 10, pose = this.open > 0 ? 'open' : this.job ? 'lunge' : 'hang';
    strings(x, y, d0);
    if (pose === 'lunge') PX.lines(ctx, x - d0 * 26, y - 22, d0 > 0 ? 0 : PI, 46, 6, this.t, '#ff7ad9', 30);
    marionette(ctx, x, y, S, d0, { pose, t: this.t, glare: pose !== 'hang' });
  }
  const dressPuppets = z => z.shots.forEach(s => { if (s.isPuppet && !s.pellLook) { s.pellLook = 1; s.draw = drawPuppet; } });

  // ================= S+U: Venom Mist: masks in the mist =================
  const _vm = CASTS.venom_mist;
  CASTS.venom_mist = function (p, z) {
    const n0 = z.shots.length, r = _vm.apply(this, arguments);
    if (!isP(G)) return r;
    const vis = z.shots.slice(n0).find(s => s.life === 160 && s.render); if (!vis) return r;
    const _r = vis.render;
    vis.render = (ctx, sx, sy, t, v) => {
      _r(ctx, sx, sy, t, v);
      const k = Math.min(1, t / 12, (160 - t) / 20);
      for (let i = 0; i < 3; i++) { const ph = (t * 0.012 + i * 0.33) % 1; mask(ctx, sx + Math.sin(t * 0.03 + i * 2.1) * 22, sy - 10 - ph * 34, 14 + i * 2, { rot: Math.sin(t * 0.04 + i) * 0.3, a: 0.55 * k * Math.sin(ph * PI) }); }
    };
    return r;
  };

  // ================= I: Iron Cradle: a spiked coffin with a face =================
  const _ic = CASTS.iron_cradle;
  CASTS.iron_cradle = function (p, z) {
    const n0 = z.shots.length, r = _ic.apply(this, arguments);
    if (!isP(G)) return r;
    const vis = z.shots.slice(n0).find(s => s.life === 40 && s.render); if (!vis) return r;
    vis.render = (ctx, x, y, t, v) => {
      if (t < 9) return;
      const gap = Math.max(0, 20 - (t - 9) * 4.5), shut = gap < 1, a = t > 34 ? (40 - t) / 6 : 1;
      PX.sprite(ctx, x, y - 30, 110, 80, c => {
        c.translate(0, 30);
        for (const d of [-1, 1]) {   // two halves of the coffin
          const ox = d * (gap + 1);
          poly(c, [[ox, -58], [ox + d * 16, -52], [ox + d * 19, -20], [ox + d * 14, 0], [ox, 0]], C.st);
          poly(c, [[ox + d * 10, -54], [ox + d * 16, -52], [ox + d * 19, -20], [ox + d * 14, 0], [ox + d * 9, 0]], '#4a4e5c');
          for (let i = 0; i < 5; i++) poly(c, [[ox, -50 + i * 10], [ox - d * (shut ? 2 : 7), -47 + i * 10], [ox, -44 + i * 10]], C.sl);   // the spikes inside
          for (let i = 0; i < 3; i++) { c.fillStyle = C.pl; c.fillRect(Math.round(ox + d * 6 - 1), -46 + i * 18, 3, 2); }   // rivets, in plum
        }
        c.save(); c.translate(0, -62); maskVec(c, 18, { glare: shut }); c.restore();   // its face
      }, { pal: PAL, alpha: a });
      if (t === 38 || t === 39) { ctx.save(); ctx.globalAlpha = 0.8; ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 60, 2, 60); ctx.restore(); }
    };
    return r;
  };

  // ================= S+I: Hundred Strings: needles on threads =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.pell;
  if (BU && BU.cast) {
    const _hs = BU.cast;
    BU.cast = function (p, z) {
      const r = _hs.apply(this, arguments);
      if (!isP(G)) return r;
      const seen = new Set();
      z.shots.push(new Vis(p.x, p.y, 40, null, () => {
        const zs = G.zone && G.zone.shots; if (!zs) return;
        const pu = zs.find(s => s.isPuppet && s.p === p);
        zs.forEach(s => {
          if (seen.has(s) || !(s instanceof Proj) || s.w !== 10 || s.h !== 10 || s.life > 40 || s.pierce) return;
          seen.add(s); const ox = pu ? pu.x : s.x, oy = pu ? pu.y - 14 : s.y;
          s.render = (ctx, x, y, q) => {
            const m = Math.hypot(q.vx, q.vy) || 1, ux = q.vx / m, uy = q.vy / m;
            ctx.save(); ctx.globalAlpha = 0.5; art.line(ctx, '#ff7ad9', Math.round(ox - G.cam.x), Math.round(oy - G.cam.y), x, y, 1); ctx.restore();   // its thread
            art.line(ctx, '#8a90a0', Math.round(x - ux * 10), Math.round(y - uy * 10), x, y, 2); art.line(ctx, '#ffffff', Math.round(x - ux * 7), Math.round(y - uy * 7), Math.round(x + ux * 3), Math.round(y + uy * 3), 1);
          };
        });
      }));
      return r;
    };
  }

  // ================= W+O: Cat's Cradle =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.pell;
  if (SIG && SIG.cast) {
    const _cc = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _cc.apply(this, arguments);
      if (!isP(G)) return r;
      const web = z.shots.slice(n0).find(s => s.life === 64 && s.paint); if (!web) return r;
      web.paint = (ctx, sx, sy, s) => {
        const k = ease(s.t / 8), a = s.t > 56 ? (64 - s.t) / 8 : 1, beat = s.t % 12 < 3, w = 36 * k, h = 24;
        // the figure: two rails, two crossing diamonds, and the long diagonals
        const N0 = [[-w, -h], [-w * 0.35, -h * 0.4], [w * 0.35, -h * 0.4], [w, -h], [-w, h], [-w * 0.35, h * 0.4], [w * 0.35, h * 0.4], [w, h], [0, 0], [-w * 0.7, 0], [w * 0.7, 0]];
        const E = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 8], [2, 8], [5, 8], [6, 8], [1, 9], [5, 9], [2, 10], [6, 10], [0, 9], [4, 9], [3, 10], [7, 10], [1, 6], [2, 5]];
        ctx.save(); ctx.globalAlpha = a;
        E.forEach((e, i) => art.line(ctx, beat ? '#ffffff' : i % 3 ? '#ff7ad9' : '#ffc8f0', Math.round(sx + N0[e[0]][0]), Math.round(sy + N0[e[0]][1]), Math.round(sx + N0[e[1]][0]), Math.round(sy + N0[e[1]][1]), beat ? 2 : 1));
        N0.forEach(q => art.rect(ctx, '#ffffff', Math.round(sx + q[0]) - 1, Math.round(sy + q[1]) - 1, 2, 2));
        ctx.restore();
        for (const d of [-1, 1]) for (const v of [-1, 1]) {   // four porcelain fingers hold it
          const fx2 = sx + d * (w + 3), fy2 = sy + v * h;
          PX.sprite(ctx, fx2, fy2, 16, 14, c => { c.scale(d, v); poly(c, [[-1, -2], [5, -2], [6, 1], [1, 3], [-2, 1]], C.po); poly(c, [[-1, -2], [2, -2], [0, 2], [-2, 1]], C.ps); }, { pal: PAL, alpha: a * k });
        }
      };
      return r;
    };
  }

  // ================= J x4: a hooked string snaps taut =================
  const FIN = SW.clanmelee && SW.clanmelee.FIN;
  if (FIN && FIN.pell) {
    const _fp = FIN.pell;
    FIN.pell = function (p, z) {
      const n0 = z.shots.length, r = _fp.apply(this, arguments);
      if (!isP(G)) return r;
      const s0 = z.shots.slice(n0).find(s => s.life === 10 && s.paint); if (!s0) return r;
      const e = N.nearest(z, p.x, p.y - 16, 110), x1 = e ? e.x : p.x + p.face * 90, y1 = e ? e.y - e.h / 2 : p.y - 20, dx = x1 - p.x, dy = y1 - (p.y - 22);
      s0.paint = (ctx, sx, sy, s) => {
        const a = 1 - s.t / 10, ex = Math.round(sx + dx), ey = Math.round(sy + dy);
        ctx.save(); ctx.globalAlpha = a;
        for (let i = -1; i <= 1; i++) art.line(ctx, i ? '#ff7ad9' : '#ffffff', sx, sy + i * 2, ex, ey, s.t < 3 && !i ? 2 : 1);   // three threads, the middle one white-hot as it snaps
        art.line(ctx, '#e8ecf4', ex - 4, ey - 4, ex + 4, ey + 4, 1); art.line(ctx, '#e8ecf4', ex + 4, ey - 4, ex - 4, ey + 4, 1); art.rect(ctx, '#ffffff', ex - 1, ey - 1, 3, 3);   // the hook bites
        ctx.restore();
      };
      return r;
    };
  }

  // ================= S+O and O: small, nothing that blocks the view =================
  function aura(ctx, p, sx, sy) {
    const hx = sx + p.face * 6, hy = sy - 26;
    if (p.modeT > 0) { const fade = Math.min(1, p.modeT / 30); for (let i = 0; i < 5; i++) string(ctx, hx, hy, hx + p.face * (8 + i * 4), hy + 12 + Math.sin(p.t * 0.1 + i) * 2 - i * 3, p.t + i * 7, fade); }   // threads fan from his fingers
    if (p.awakeT > 0) { const fade = Math.min(1, p.awakeT / 30); for (let i = -1; i <= 1; i++) string(ctx, sx + i * 5, sy - 36, sx + i * 9, sy - 78, p.t + i * 11, fade * 0.8); }   // and thin strings rise from Pell himself
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const mine = isP(g || this.G) && !this.dead, a = this.atk, swap = mine && a && (this.state === 'attack' || this.state === 'airatk') && this.onGround && CONDUCT;
    const keep = swap ? a.anim : null; if (swap) a.anim = CONDUCT;
    let r; try { r = _pd.apply(this, arguments); } finally { if (swap) a.anim = keep; }
    if (isP(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  // the pose he holds while the puppet fights: his casting pose, if his sheet has enough frames of it
  let CONDUCT = null;
  const conductOf = p => { if (CONDUCT !== null) return; const sh = art.sheets[p.sheet()]; CONDUCT = sh && sh.anims && sh.anims.special && sh.anims.special.length >= 3 ? 'special' : (sh && sh.anims && sh.anims.cast && sh.anims.cast.length >= 3 ? 'cast' : ''); };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isP(g || this.G) && z && z.shots) { dressPuppets(z); conductOf(this); } return r; };

  // ================= W+I: Grand Theatre =================
  // the curtains, in screen space: k 0 open .. 1 closed to a stage window; drop 0-1 lowers the final curtain
  function curtains(ctx, k, t, drop) {
    const wd = Math.round(72 * k);   // the sides only: the fight stays in view
    for (const d of [0, 1]) for (let i = 0; i * 12 < wd; i++) {
      const x = d ? W - (i + 1) * 12 : i * 12, sway = Math.round(Math.sin(t * 0.05 + i * 0.9) * 1.5);
      art.rect(ctx, i % 2 ? '#5a1040' : '#3a0a2a', x, 0, 12, H); art.rect(ctx, '#8a1a60', x + (d ? 9 : 1) + sway, 0, 2, H);
    }
    art.rect(ctx, '#3a0a2a', 0, 0, W, Math.round(22 * k)); for (let x = 0; x < W; x += 24) art.disc(ctx, '#5a1040', x + 12, Math.round(22 * k), 12);   // the valance
    art.rect(ctx, '#ffc8f0', 0, Math.round(22 * k) - 2, W, 1);
    if (drop > 0) { const y = Math.round(H * drop); for (let x = 0; x < W; x += 12) art.rect(ctx, (x / 12) % 2 ? '#5a1040' : '#3a0a2a', x, 0, 12, y); art.rect(ctx, '#ffc8f0', 0, y - 3, W, 2); }
  }
  const _ult = N.ULT.grand_theatre;
  if (_ult) N.ULT.grand_theatre = function (p, z, foes) {
    const n0 = z.shots.length, r = _ult.apply(this, arguments);
    if (!isP(G)) return r;
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('pell') : null, FIN2 = pl ? pl.fin : 62;
      const cur = new Vis(p.x, p.y, 400, (ctx) => {
        const st = p.st; if (p.state !== 'ult') return;
        curtains(ctx, ease((st - 6) / 12), st, st > FIN2 + 4 ? ease((st - FIN2 - 4) / 12) : 0);
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      cur.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };   // screen space
      cur._ugS = 1; z.shots.push(cur);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN2, pl ? Math.max(74, FIN2 - 30) : 30);
    }
    if (N.every(p, 10, 54, 6)) {   // the puppets that drop on strings: real marionettes, cutting as they land
      const add = z.shots.slice(n0).filter(s => s.life === 14 && s.render);
      add.forEach((v, i) => {
        const e = foes[i]; if (!e) return; const b = e.box(), ty = b.y + b.h / 2 + 16, d = v.x > b.x + b.w / 2 ? -1 : 1;
        v._ugS = 1;
        v.render = (ctx, sx, sy, t) => {
          const y = Math.round(sy + (ty - G.cam.y) * ease(t / 6));
          string(ctx, sx, sy - 20, sx, y - 30, t + i * 5); string(ctx, sx + d * 6, sy - 20, sx + d * 8, y - 18, t + i * 5 + 4);
          marionette(ctx, sx, y, 30, d, { pose: t > 4 ? 'lunge' : 'hang', t: t + i * 7, glare: true, a: t > 10 ? (14 - t) / 4 : 1 });
        };
      });
    }
    return r;
  };
  // the finishing blow: the mask beside the target, strings on every limb; they snap tight on an impact frame
  function finale(p, z, T, FIN2, BU2) {
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN2 + 8) return;
      const cy = sy - 20, k = ease((st - (BU2 - 2)) / 10);
      const pts = [[sx - 9, cy - 12], [sx + 9, cy - 12], [sx, cy - 20], [sx - 6, cy + 14], [sx + 6, cy + 14]];
      if (st < FIN2) {
        const sh = st > FIN2 - 10 ? Math.sin(st * 2.3) * 1.2 : 0;
        pts.forEach((q, i) => string(ctx, sx - dir * 40 + i * 20 * dir, cy - 130, q[0], q[1], st + i * 7, k));   // a string to every limb
        mask(ctx, sx - dir * 70 + sh, cy - 20, 96, { rot: -dir * 0.22, a: k, glare: st > FIN2 - 12 });
      } else {
        const ik = (st - FIN2) / 5, kk = (st - FIN2) / 8;
        PX.impact(ctx, sx, cy, ik, 51);
        mask(ctx, sx - dir * 70, cy - 20, 96, { rot: -dir * 0.22, glare: true, mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease(kk) });
        ctx.save(); ctx.globalAlpha = 1 - ease(kk);   // every string pulled tight at once, straight through the target
        for (let i = 0; i < 7; i++) { const a = -0.5 + i * 0.5; art.line(ctx, i % 2 ? '#ff7ad9' : '#ffffff', Math.round(sx - Math.cos(a) * 150), Math.round(cy - Math.sin(a) * 150), Math.round(sx + Math.cos(a) * 150), Math.round(cy + Math.sin(a) * 150), kk < 0.3 ? 2 : 1); }
        ctx.restore();
        if (st === FIN2) for (let i = 0; i < 20; i++) part(T.x + rand(-16, 16), T.y - rand(4, 40), i % 2 ? '#ff7ad9' : '#ffffff', rand(-4, 4), rand(-4, 2), 22, 2, 0.08);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
