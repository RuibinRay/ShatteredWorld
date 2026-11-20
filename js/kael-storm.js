'use strict';
// Shattered Worlds — Kael's storm-eye (2026-11-20, the hero-look rework: cool, not cute). His story: "born on Vharra,
// under the thunderheads", "the storm-eye of Vharra scratched on his jacket", a long red scarf, amber lightning round
// his fists. So his kit is the eye in the storm: a slit-pupilled eye of lightning that opens in the clouds, heavy
// jagged bolts with a white core, scrap from the Crusher Yard, and the scarf streaming behind him. Crisp pixel art
// through js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/pell-theatre.js.
//   U      Spark Dart: a bent scrap nail wound in arcs; a small storm-eye flashes where it lands
//   S+U    Thunder Totem: a junk totem (a sign pole, a car-door plate with the eye scratched in); it flares when it zaps
//   I      Breaker Rush: a ram of lightning on his shoulder, the scarf straight out behind, speed lines
//   S+I    Rising Storm: a twisting column of lightning carries him up; the eye opens above him at the top
//   W+O    Ball Lightning: a small thunderhead with the eye burning in it, spitting arcs
//   S+O    Overcharge: arcs between his fists      O  Tempest Form: a small thunderhead over his head (small on purpose)
//   W+I    Skyfall: thunderheads roll in over the arena, the storm-eye opens in them and throws a heavy bolt at every
//          enemy; at the finishing blow (js/ult-grand.js) the eye fills the sky over the target and one colossal bolt
//          comes down on an impact frame
// SW.kaelStorm.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Totem = SW.Totem;
  if (!N || !P || !PX || !PX.impact || !Totem) return;
  const KS = SW.kaelStorm = { on: true };
  const isK = g => !!(KS.on && g && g.state && g.state.hero === 'kael');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

  // scorched brown up to white-hot, the scarf's reds, storm-cloud slate, a cyan spark
  const PAL = ['#160a04', '#5a2a08', '#b85c0a', '#ffa726', '#ffd24a', '#fff3c4', '#ffffff', '#c1121f', '#7a0a14', '#1c1f30', '#343a54', '#565e80', '#7fe9ff', '#8a92a8'];
  const C = { k: PAL[0], b0: PAL[1], b1: PAL[2], a: PAL[3], y: PAL[4], p: PAL[5], w: PAL[6], red: PAL[7], redD: PAL[8], c0: PAL[9], c1: PAL[10], c2: PAL[11], cy: PAL[12], st: PAL[13] };

  // ---------- a heavy bolt between two points on screen: jagged, amber, with a white core and short forks ----------
  function bolt(ctx, x0, y0, x1, y1, seed, w, a) {
    const n = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0) / 16)), pts = [[x0, y0]], nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1;
    for (let i = 1; i < n; i++) { const u = i / n, off = (rnd(seed, i) - 0.5) * 22 * Math.sin(u * PI); pts.push([x0 + (x1 - x0) * u + nx / L * off, y0 + (y1 - y0) * u + ny / L * off]); }
    pts.push([x1, y1]);
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    const run = (col, wd) => { for (let i = 0; i < pts.length - 1; i++) art.line(ctx, col, Math.round(pts[i][0]), Math.round(pts[i][1]), Math.round(pts[i + 1][0]), Math.round(pts[i + 1][1]), wd); };
    run('#b85c0a', w + 2); run('#ffa726', w); run('#ffffff', Math.max(1, w - 2));
    for (let i = 2; i < pts.length - 1; i += 2) { const q = pts[i], d = rnd(seed, i + 50) > 0.5 ? 1 : -1; art.line(ctx, '#ffd24a', Math.round(q[0]), Math.round(q[1]), Math.round(q[0] + d * (8 + rnd(seed, i + 9) * 12)), Math.round(q[1] + 8 + rnd(seed, i + 3) * 10), 1); }   // forks
    ctx.restore();
  }
  KS.bolt = bolt;

  // ---------- the storm-eye: (0, 0) its middle, s its width; o = { open 0-1, t, look (-1..1), glare } ----------
  function eyeVec(c, s, o) {
    const open = clamp01(o.open === undefined ? 1 : o.open), t = o.t || 0, hh = s * 0.3 * open;
    // the thunderhead it opens in: a ring of dark cloud
    if (o.cloud !== false) for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2 + t * 0.01, r = s * (0.56 + 0.06 * Math.sin(i * 2.3)); ell(c, Math.cos(a) * r, Math.sin(a) * r * 0.62, s * (0.2 + 0.05 * Math.sin(i * 1.7 + t * 0.05)), s * 0.15, i % 2 ? C.c0 : C.c1); }
    if (hh < s * 0.01) { c.strokeStyle = C.y; c.lineWidth = Math.max(1, s * 0.02); c.beginPath(); c.moveTo(-s * 0.5, 0); c.lineTo(s * 0.5, 0); c.stroke(); return; }
    // the lids: a sharp almond with jagged edges of lightning
    const lid = (k, col) => { const pts = [[-s * 0.52 * k, 0]]; for (let i = 1; i < 8; i++) { const u = i / 8; pts.push([(-0.52 + 1.04 * u) * s * k, -Math.sin(u * PI) * hh * k - (i % 2 ? s * 0.035 : 0)]); } pts.push([s * 0.52 * k, 0]); for (let i = 7; i >= 1; i--) { const u = i / 8; pts.push([(-0.52 + 1.04 * u) * s * k, Math.sin(u * PI) * hh * k + (i % 2 ? 0 : s * 0.035)]); } poly(c, pts, col); };
    lid(1.12, C.b1); lid(1.04, C.a); lid(0.94, C.k);
    // the iris: a spoked ring that turns, then the slit pupil
    const ix = (o.look || 0) * s * 0.12, ir = Math.min(hh * 0.92, s * 0.24);
    ell(c, ix, 0, ir, ir, C.b1); ell(c, ix, 0, ir * 0.86, ir * 0.86, C.a);
    for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2 + t * 0.12; poly(c, [[ix + Math.cos(a) * ir * 0.3, Math.sin(a) * ir * 0.3], [ix + Math.cos(a + 0.12) * ir * 0.86, Math.sin(a + 0.12) * ir * 0.86], [ix + Math.cos(a - 0.12) * ir * 0.86, Math.sin(a - 0.12) * ir * 0.86]], i % 2 ? C.y : C.b1); }
    ell(c, ix, 0, ir * 0.5, ir * 0.5, C.y);
    poly(c, [[ix, -ir * 0.8], [ix + ir * (o.glare ? 0.1 : 0.2), 0], [ix, ir * 0.8], [ix - ir * (o.glare ? 0.1 : 0.2), 0]], o.glare ? C.w : C.k);   // the slit
    c.fillStyle = C.w; c.fillRect(Math.round(ix - ir * 0.5), Math.round(-ir * 0.5), Math.max(1, Math.round(s * 0.03)), Math.max(1, Math.round(s * 0.03)));
  }
  function eye(ctx, x, y, s, o) { o = o || {}; PX.sprite(ctx, x, y, s * 1.9, s * 1.3, c => eyeVec(c, s, o), { pal: PAL, alpha: o.a, mono: o.mono, outline: PAL[0] }); }
  KS.eye = eye;
  // short crackling arcs round a point (1 px, hard)
  function arcs(ctx, x, y, r, t, n, a) {
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    for (let i = 0; i < (n || 3); i++) { const sd = Math.floor(t / 2) * 5 + i * 17; let px = x + (rnd(sd, 1) - 0.5) * r * 2, py = y + (rnd(sd, 2) - 0.5) * r * 2; for (let k = 0; k < 4; k++) { const qx = px + (rnd(sd, 3 + k) - 0.5) * 9, qy = py + (rnd(sd, 9 + k) - 0.5) * 9; art.line(ctx, k % 2 ? '#ffd24a' : '#ffffff', Math.round(px), Math.round(py), Math.round(qx), Math.round(qy), 1); px = qx; py = qy; } }
    ctx.restore();
  }

  // ================= U: Spark Dart: a scrap nail wound in arcs =================
  function dartDraw(ctx, cam) {
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), d = this.vx >= 0 ? 1 : -1, ang = Math.atan2(this.vy, this.vx);
    PX.sprite(ctx, x, y, 80, 50, c => {
      c.rotate(ang); c.scale(1.7, 1.7);   // big enough to read as a nail in a storm
      poly(c, [[9, 0], [2, -2], [-8, -1.5], [-8, 1.5], [2, 2]], C.st); poly(c, [[9, 0], [2, -2], [-3, -1], [-3, 0]], C.w);   // the nail
      poly(c, [[-8, -3], [-6, -3], [-6, 3], [-8, 3]], C.c2);   // its flat head
      for (let i = 0; i < 4; i++) { const u = -6 + i * 4, ph = this.t * 0.9 + i * 1.6; poly(c, [[u, Math.sin(ph) * 4], [u + 2, Math.sin(ph + 0.8) * 4 - 1], [u + 2.5, Math.sin(ph + 0.8) * 4 + 1]], i % 2 ? C.y : C.a); }   // arcs winding round it
      for (let i = 1; i < 5; i++) poly(c, [[-8 - i * 4, (i % 2 ? -1 : 1) * (1 + i * 0.6)], [-12 - i * 4, 0], [-8 - i * 4, (i % 2 ? 1 : -1) * 0.5]], i < 3 ? C.y : C.a);   // a crackling tail
    }, { pal: PAL });
    void d;
  }
  function dressShots(z) {
    z.shots.forEach(s => {
      if (s.kael || s.kind !== 'dart' || s.team !== 'player') return;
      s.kael = 1; s.draw = dartDraw;
      const _end = s.end;
      s.end = function (g, zz, impact) {   // where it lands, a small storm-eye flashes
        const ex = this.x, ey = this.y;
        if (zz && zz.shots) { const v = new Vis(ex, ey, 9, (ctx, sx, sy, t) => { eye(ctx, sx, sy, 20, { open: t < 3 ? t / 3 : 1 - (t - 3) / 6, t, cloud: false, glare: true }); arcs(ctx, sx, sy, 8, t, 2); }); zz.shots.push(v); }
        return _end ? _end.apply(this, arguments) : undefined;
      };
    });
  }

  // ================= S+U: Thunder Totem: junk with the eye scratched in =================
  const _td = Totem.prototype.draw;
  Totem.prototype.draw = function (ctx, cam) {
    if (!KS.on) return _td.apply(this, arguments);
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), zap = (this.t % 42) >= 20 && (this.t % 42) < 27, rise = Math.min(1, this.t / 6);
    PX.sprite(ctx, x, y - 26, 60, 70, c => {
      c.translate(0, 26 + (1 - rise) * 30); c.scale(1.3, 1.3);
      poly(c, [[-1.5, 0], [1.5, 0], [1.5, -30], [-1.5, -30]], C.st); poly(c, [[-1.5, 0], [-0.5, 0], [-0.5, -30], [-1.5, -30]], C.w);   // a sign pole
      poly(c, [[-5, 0], [5, 0], [3, -3], [-3, -3]], C.c1);   // a lump of scrap for a foot
      poly(c, [[-10, -38], [9, -40], [11, -27], [4, -24], [-9, -26]], C.c2); poly(c, [[-10, -38], [9, -40], [8, -36], [-9, -34]], C.st);   // a bent car-door plate
      poly(c, [[-10, -38], [-7, -38], [-6, -26], [-9, -26]], C.c1);
      c.save(); c.translate(0, -31); eyeVec(c, 16, { open: zap ? 1 : 0.55, t: this.t, cloud: false, glare: zap }); c.restore();   // the storm-eye scratched into it
      c.strokeStyle = C.red; c.lineWidth = 1.5; c.beginPath(); c.moveTo(1, -22); c.quadraticCurveTo(7, -18 + Math.sin(this.t * 0.2) * 2, 10 + Math.sin(this.t * 0.15) * 2, -12); c.stroke();   // a rag of red, like his scarf
      for (let i = 0; i < 2; i++) { c.fillStyle = C.a; c.fillRect(-3, -8 - i * 7, 6, 2); }   // wire wound round the pole
    }, { pal: PAL });
    arcs(ctx, x, y - 42, zap ? 16 : 8, this.t, zap ? 4 : 1);
    if (zap) art.glow(ctx, x, y - 40, 18, '#ffa726', 0.2);
  };

  // ================= I: Breaker Rush: the ram and the scarf (drawn round him while he rushes) =================
  function rushLook(ctx, p, sx, sy) {
    const d = p.face, cy = sy - 20, t = p.st;
    PX.lines(ctx, sx - d * 30, cy, d > 0 ? 0 : PI, 70, 9, t, '#ffd24a', 40);
    PX.sprite(ctx, sx, cy, 120, 60, c => {
      c.scale(d, 1);
      const pts = [[-8, -8]]; for (let i = 1; i <= 7; i++) pts.push([-8 - i * 7, -8 + Math.sin(t * 0.9 + i * 0.9) * 2.2 - i * 0.3]); const back = pts.slice().reverse().map(q => [q[0], q[1] + 3.5]);   // the scarf, straight out behind
      poly(c, pts.concat(back), C.red); poly(c, pts.concat(pts.slice().reverse().map(q => [q[0], q[1] + 1.2])), '#ff5a5a');
      // the ram: three nested arrowheads of lightning on his leading shoulder
      [[30, 20, C.b1], [26, 15, C.a], [20, 10, C.y], [13, 5, C.w]].forEach(q => poly(c, [[q[0], 0], [q[0] - q[1] * 1.6, -q[1]], [q[0] - q[1] * 1.1, 0], [q[0] - q[1] * 1.6, q[1]]], q[2]));
      for (let i = 0; i < 4; i++) { const yy = (i - 1.5) * 9; poly(c, [[2, yy], [-18 - rnd(t, i) * 14, yy + 1.5], [2, yy + 2.5]], i % 2 ? C.y : C.a); }   // streaks torn off it
    }, { pal: PAL });
    arcs(ctx, sx + d * 18, cy, 12, t, 3);
  }

  // ================= S+I: Rising Storm =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.kael;
  if (BU && BU.cast) {
    const _rs = BU.cast;
    BU.cast = function (p, z) {
      const r = _rs.apply(this, arguments);
      if (!isK(G)) return r;
      const x0 = p.x, y0 = p.y;
      const v = new Vis(x0, y0, 30, (ctx, sx, sy, t) => {
        const px = Math.round(p.x - G.cam.x), py = Math.round(p.y - G.cam.y) - 20, a = t > 20 ? (30 - t) / 10 : 1;
        for (let i = 0; i < 2; i++) bolt(ctx, sx + (i ? 9 : -9) * Math.cos(t * 0.5), sy, px + (i ? -6 : 6) * Math.cos(t * 0.5), py, t * 3 + i * 7, 3, a);   // a twisting column, two strands
        if (t > 12) eye(ctx, px, py - 46, 46, { open: ease((t - 12) / 5) * (t > 24 ? (30 - t) / 6 : 1), t, glare: t > 16 && t < 22 });   // the eye opens above him at the top
      });
      v._ugS = 1; z.shots.push(v);
      return r;
    };
  }

  // ================= W+O: Ball Lightning: a small thunderhead with the eye in it =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.kael;
  if (SIG && SIG.cast) {
    const _bl = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _bl.apply(this, arguments);
      if (!isK(G)) return r;
      const s0 = z.shots.slice(n0).find(s => s.life === 90 && s.paint); if (!s0) return r;
      s0.paint = (ctx, x, y, s) => {
        eye(ctx, x, y, 30, { open: 0.7 + 0.3 * Math.sin(s.t * 0.3), t: s.t, glare: s.t % 12 < 3 });
        arcs(ctx, x, y, 16, s.t, 3);
        if (s.t % 6 === 0) { const e = N.nearest(G.zone, s.x, s.y, 46); if (e) fx.bolt(s.x, s.y, e.x, e.y - e.h / 2, '#ffe7a8'); }
      };
      return r;
    };
  }

  // ================= S+O and O (small), the rush, and dressing his darts =================
  function aura(ctx, p, sx, sy) {
    if (p.state === 'rush' && p.st >= 7 && p.st < 21) rushLook(ctx, p, sx, sy);
    if (p.modeT > 0) arcs(ctx, sx + p.face * 7, sy - 20, 6, p.t, 2, Math.min(1, p.modeT / 30));   // arcs between his fists
    if (p.awakeT > 0) {   // a small thunderhead over his head, raining sparks
      const fade = Math.min(1, p.awakeT / 30), top = sy - (p.h || 34);
      eye(ctx, sx, top - 12, 18, { open: 0.6 + 0.3 * Math.sin(p.t * 0.1), t: p.t, a: fade });
      ctx.save(); ctx.globalAlpha = fade; for (let i = 0; i < 3; i++) { const u = ((p.t * 2 + i * 23) % 40) / 40; art.rect(ctx, i % 2 ? '#ffd24a' : '#ffffff', Math.round(sx - 8 + i * 8), Math.round(top - 6 + u * 14), 1, 2); } ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isK(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isK(g || this.G) && z && z.shots) dressShots(z); return r; };

  // ================= W+I: Skyfall =================
  // thunderheads along the top of the screen (screen space); k how far they have rolled in
  function clouds(ctx, k, t) {
    for (let i = 0; i < 14; i++) { const x = ((i * 43 + t * (0.3 + (i % 3) * 0.15)) % (W + 80)) - 40, y = -10 + (i % 4) * 9 - (1 - k) * 60; art.disc(ctx, i % 3 ? '#1c1f30' : '#343a54', Math.round(x), Math.round(y + 18), 22 + (i % 3) * 6); }
    for (let i = 0; i < 6; i++) if ((t + i * 11) % 23 < 2) art.rect(ctx, '#ffd24a', (i * 83 + 30) % W, 20 + (i % 3) * 8, 14, 1);   // flickers inside them
  }
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isK(g)) return r;
    if (p.st === 4) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('kael') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const sky = new Vis(p.x, p.y, 500, (ctx) => {   // the sky: clouds roll in, the eye opens in them
        const st = p.st; if (p.state !== 'ult' || st > BU2 + 6) return;
        const k = ease((st - 4) / 12), a = st > BU2 - 4 ? 1 - (st - (BU2 - 4)) / 10 : 1;
        ctx.save(); ctx.globalAlpha = a; clouds(ctx, k, st); ctx.restore();
        eye(ctx, W / 2, 50, 120, { open: ease((st - 8) / 10), t: st, glare: st % 10 < 3, a, cloud: false });
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    if (p.st >= 10 && p.st <= 60 && p.st % 10 === 0) foes.forEach((e, i) => {   // a heavy bolt from the eye to each of them, on the ultimate's own beat
      if (!e || e.dead) return;
      const b = e.box(), tx = b.x + b.w / 2, ty = b.y + b.h / 2, seed = p.st + i * 13;
      const v = new Vis(tx, ty, 8, (ctx, sx, sy, t) => { bolt(ctx, W / 2 + (sx - W / 2) * 0.2, 56, sx, sy, seed, t < 3 ? 5 : 3, 1 - t / 8); if (t < 4) { ctx.save(); ctx.globalAlpha = 1 - t / 4; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy + 16, 8 + t * 7, 2 + t, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); } });
      v._ugS = 1; z.shots.push(v);
    });
    return r;
  };
  // the finishing blow: the eye fills the sky over the target and narrows on it; one colossal bolt on an impact frame
  function finale(p, z, T, FIN, BU2) {
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 20, ey = cy - 40;   // inside the pushed-in view, just over the target's head
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 10), sh = st > FIN - 10 ? Math.sin(st * 2.3) * 1.2 : 0;
        eye(ctx, sx + sh, ey, 92, { open: k, t: st, glare: st > FIN - 10, a: k });
        arcs(ctx, sx, ey + 22, 30, st, 4, k);
        if (st > FIN - 14 && st % 3 === 0) bolt(ctx, sx + (rnd(st, 1) - 0.5) * 60, ey + 20, sx + (rnd(st, 2) - 0.5) * 90, cy + 20, st, 1, 0.8);   // feelers reaching down
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 61);
        eye(ctx, sx, ey, 92, { open: 1, t: st, glare: true, mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease((k - 0.4) / 0.6) });
        if (k < 0.7) { bolt(ctx, sx, ey + 10, sx, sy, st * 7, 9, 1 - k / 0.7); bolt(ctx, sx - 12, ey + 10, sx - 4, sy, st * 7 + 3, 3, 1 - k / 0.7); bolt(ctx, sx + 12, ey + 10, sx + 5, sy, st * 7 + 5, 3, 1 - k / 0.7); }   // the bolt: a column with a white core
        ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#ffa726'; ctx.lineWidth = 1; for (let i = 0; i < 8; i++) { const d = i % 2 ? 1 : -1, L = (20 + i * 12) * ease(k * 4); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + d * L * 0.5, sy - 1 - (i % 3)); ctx.lineTo(sx + d * L, sy + (i % 2)); ctx.stroke(); } ctx.restore();   // the floor splits
        if (st === FIN) for (let i = 0; i < 24; i++) part(T.x + rand(-16, 16), T.y - rand(0, 40), i % 2 ? '#ffd24a' : '#ffffff', rand(-4, 4), -rand(1, 5), 22, 2, 0.12);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
