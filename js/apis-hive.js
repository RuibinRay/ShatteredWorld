'use strict';
// Shattered Worlds — Apis's war-hive (2026-11-20, the hero-look rework: cool, not cute). Her story: "queen of a hive the
// size of a world, until an engine drank it"; "a cloud of glowing bees circling her outstretched hand"; "never poke a
// hive". Her bees were 4x3 pixel blobs. They are now hornets: a black head with a red eye, an amber thorax, a striped
// abdomen that curls forward to stab with a long sting, and two blade wings that flicker. Crisp pixel art through
// js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/vega-star.js.
//   (all)  every bee she sends (Sting, the swarm at eight, Royal Jelly, the hive's eight, the finisher's three)
//   U      Sting: a hornet with a white stab where it lands
//   S+U    Honey Trap: a pool of honey over honeycomb, and hornets that drop to sting on every beat
//   I      Hive Burst: a spiked paper war-hive that shatters into pieces
//   S+I    Royal Jelly: a column of gold rises round her
//   W+O    Waggle Dance: six hornets fly a figure-eight round the target and stab in turn
//   J      her combo: a hornet stabs from her fist on every hit
//   S+O    Busy Bees: two hornets at her hand      O  Queen Bee: her crown glints, honeycomb at her feet (small on purpose)
//   W+I    Killer Swarm: the sky fills with hornets; in the cinematic finish (js/ult-cinema.js) the queen hornet,
//          crowned, hangs over the target and drives her sting through it on an impact frame
// SW.apisHive.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.sting || !CASTS.hive_burst) return;
  const AH = SW.apisHive = { on: true };
  const isA = g => !!(AH.on && g && g.state && g.state.hero === 'apis');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };

  // near-black, browns, amber to pale honey, white, a red eye, wing steel
  const PAL = ['#140a02', '#3a2206', '#8a4a08', '#d67a0a', '#fca311', '#ffd166', '#fff1b8', '#ffffff', '#ff3b1f', '#c9cfe0'];
  const C = { k: PAL[0], b0: PAL[1], b1: PAL[2], a0: PAL[3], a: PAL[4], h: PAL[5], p: PAL[6], w: PAL[7], red: PAL[8], st: PAL[9] };

  // ================= the hornet: (0, 0) its thorax, facing +x, s its body length =================
  // o = { t (wing flicker), sting 0-1 (the abdomen curls forward), queen (crown, legs, antennae) }
  function hornetVec(c, s, o) {
    const t = o.t || 0, st = clamp01(o.sting || 0), up = (t & 1) === 0;
    // wings: two blades, snapping between two positions
    const wing = (tx, ty, col) => { poly(c, [[s * 0.14, -s * 0.12], [tx, ty], [tx + s * 0.26, ty + s * 0.22], [-s * 0.08, s * 0.0]], col); };   // broad enough to survive at small sizes
    if (up) { wing(-s * 0.42, -s * 0.72, C.st); wing(-s * 0.16, -s * 0.76, C.p); } else { wing(-s * 0.8, -s * 0.34, C.st); wing(-s * 0.66, -s * 0.52, C.p); }
    if (o.queen) for (let i = 0; i < 3; i++) { c.strokeStyle = C.k; c.lineWidth = Math.max(1, s * 0.03); c.beginPath(); c.moveTo(s * (0.16 - i * 0.1), s * 0.1); c.lineTo(s * (0.22 - i * 0.12), s * 0.26); c.lineTo(s * (0.12 - i * 0.12), s * 0.4); c.stroke(); }   // legs
    // the abdomen: striped, tapering to the sting; it hangs back and curls forward under her to stab
    c.save(); c.translate(-s * 0.08, s * 0.03); c.rotate(-(0.3 + st * 2.25));
    poly(c, [[s * 0.02, -s * 0.13], [-s * 0.3, -s * 0.17], [-s * 0.62, -s * 0.07], [-s * 0.8, 0], [-s * 0.62, s * 0.08], [-s * 0.3, s * 0.15], [s * 0.02, s * 0.11]], C.a);
    poly(c, [[s * 0.02, -s * 0.13], [-s * 0.3, -s * 0.17], [-s * 0.62, -s * 0.07], [-s * 0.3, -s * 0.06], [s * 0.02, -s * 0.04]], C.h);
    poly(c, [[-s * 0.14, -s * 0.16], [-s * 0.24, -s * 0.17], [-s * 0.24, s * 0.15], [-s * 0.14, s * 0.13]], C.k); poly(c, [[-s * 0.38, -s * 0.15], [-s * 0.48, -s * 0.12], [-s * 0.48, s * 0.12], [-s * 0.38, s * 0.14]], C.k); poly(c, [[-s * 0.6, -s * 0.08], [-s * 0.68, -s * 0.05], [-s * 0.68, s * 0.06], [-s * 0.6, s * 0.08]], C.k);
    poly(c, [[-s * 0.76, -s * 0.035], [-s * 1.12, 0], [-s * 0.76, s * 0.035]], C.w);   // the sting
    c.restore();
    // thorax and head
    ell(c, s * 0.08, -s * 0.02, s * 0.2, s * 0.17, C.b1); ell(c, s * 0.1, -s * 0.07, s * 0.14, s * 0.08, C.a0);
    poly(c, [[s * 0.22, -s * 0.15], [s * 0.42, -s * 0.18], [s * 0.54, -s * 0.05], [s * 0.48, s * 0.09], [s * 0.28, s * 0.11]], C.k);
    poly(c, [[s * 0.32, -s * 0.12], [s * 0.5, -s * 0.07], [s * 0.38, -s * 0.01]], C.red);   // the eye
    poly(c, [[s * 0.46, s * 0.06], [s * 0.64, s * 0.13], [s * 0.44, s * 0.14]], C.a0);   // mandibles
    if (o.queen) {
      c.strokeStyle = C.k; c.lineWidth = Math.max(1, s * 0.025); c.beginPath(); c.moveTo(s * 0.44, -s * 0.16); c.lineTo(s * 0.62, -s * 0.36); c.lineTo(s * 0.74, -s * 0.3); c.moveTo(s * 0.4, -s * 0.17); c.lineTo(s * 0.5, -s * 0.4); c.lineTo(s * 0.62, -s * 0.42); c.stroke();
      poly(c, [[s * 0.2, -s * 0.17], [s * 0.19, -s * 0.36], [s * 0.26, -s * 0.26], [s * 0.31, -s * 0.4], [s * 0.36, -s * 0.26], [s * 0.43, -s * 0.36], [s * 0.42, -s * 0.18]], C.h);   // her crown
      poly(c, [[s * 0.2, -s * 0.17], [s * 0.42, -s * 0.18], [s * 0.42, -s * 0.22], [s * 0.2, -s * 0.21]], C.a0);
    }
  }
  function hornet(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x, y, s * 2.9, s * 2.9, c => { c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); hornetVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono, keepThin: !!o.queen });
  }
  AH.hornet = hornet;
  // a white stab: a thin diamond along angle ang
  function stab(ctx, x, y, ang, L, a) {
    ctx.save(); ctx.globalAlpha = clamp01(a); const ca = Math.cos(ang), sa = Math.sin(ang);
    art.line(ctx, '#fca311', Math.round(x - ca * L * 0.3), Math.round(y - sa * L * 0.3), Math.round(x + ca * L), Math.round(y + sa * L), 3); art.line(ctx, '#ffffff', Math.round(x - ca * L * 0.2), Math.round(y - sa * L * 0.2), Math.round(x + ca * L * 1.1), Math.round(y + sa * L * 1.1), 1);
    ctx.restore();
  }
  // a pixel hexagon outline
  const hexo = (ctx, x, y, r, col) => { for (let i = 0; i < 6; i++) { const a0 = i / 6 * PI * 2, a1 = (i + 1) / 6 * PI * 2; art.line(ctx, col, Math.round(x + Math.cos(a0) * r), Math.round(y + Math.sin(a0) * r * 0.9), Math.round(x + Math.cos(a1) * r), Math.round(y + Math.sin(a1) * r * 0.9), 1); } };

  // ================= every bee she sends =================
  const isBee = s => s instanceof Proj && s.w === 8 && s.h === 8 && s.ghost && s.life <= 80 && !s.pierce;
  function dress(z) {
    z.shots.forEach(s => {
      if (s.apis || !isBee(s)) return;
      s.apis = 1;
      s.render = (ctx, x, y, q) => {
        const d = q.vx >= 0 ? 1 : -1, e = N.nearest(G.zone, q.x, q.y, 30);
        hornet(ctx, x, y, 15, d, { t: q.t, rot: SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)), -0.9, 0.9), sting: e ? 0.55 : 0.05 });
      };
      const _end = s.onEnd;
      s.onEnd = function (g, zz, impact) {
        if (impact && zz && zz.shots) { const ang = Math.atan2(this.vy, this.vx), ex = this.x, ey = this.y; zz.shots.push(new Vis(ex, ey, 6, (ctx, sx, sy, t) => stab(ctx, sx, sy, ang, 12, 1 - t / 6))); }
        return _end ? _end.apply(this, arguments) : undefined;
      };
    });
  }

  // ================= S+U: Honey Trap =================
  const _ht = CASTS.honey_trap;
  CASTS.honey_trap = function (p, z) {
    const n0 = z.shots.length, r = _ht.apply(this, arguments);
    if (!isA(G)) return r;
    const vis = z.shots.slice(n0).find(s => s.life === 240 && s.render); if (!vis) return r;
    vis.render = (ctx, sx, sy, t) => {
      const a = Math.min(1, t / 8, (240 - t) / 12), w = Math.round(38 * a); if (w < 2) return;
      ctx.save(); ctx.globalAlpha = a;
      art.rect(ctx, '#8a4a08', sx - w, sy - 3, w * 2, 4); art.rect(ctx, '#d67a0a', sx - w + 1, sy - 4, w * 2 - 2, 3); art.rect(ctx, '#ffd166', sx - w + 4, sy - 4, Math.round(w * 0.7), 1);   // the honey, glossy
      for (let i = 0; i < 6; i++) hexo(ctx, sx - w + 7 + i * 12, sy - 9 - (i % 2) * 5, 6, i % 2 ? '#d67a0a' : '#fca311');   // comb rising out of it
      for (let i = 0; i < 4; i++) { const u = ((t * 0.02 + i * 0.27) % 1); art.rect(ctx, '#ffd166', sx - w + 10 + i * 17, Math.round(sy - 14 + u * 10), 1, 2 + Math.round(u * 2)); }   // drips
      ctx.restore();
      for (let i = 0; i < 3; i++) {   // hornets over it; they drop and sting on the beat (the trap stings every 20 frames)
        const beat = t % 20, dive = beat < 5 ? Math.sin(beat / 5 * PI) : 0, hx = sx - 22 + i * 22 + Math.sin(t * 0.07 + i * 2) * 5;
        hornet(ctx, hx, sy - 30 + dive * 14 + Math.sin(t * 0.2 + i) * 2, 12, i % 2 ? -1 : 1, { t: t + i, sting: dive * 0.6, a });
      }
    };
    return r;
  };

  // ================= I: Hive Burst: a spiked war-hive =================
  function hiveVec(c, r) {
    for (let i = 0; i < 7; i++) { const a = i / 7 * PI * 2 + 0.3; poly(c, [[Math.cos(a - 0.2) * r * 0.9, Math.sin(a - 0.2) * r * 0.9], [Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7], [Math.cos(a + 0.2) * r * 0.9, Math.sin(a + 0.2) * r * 0.9]], i % 2 ? C.b1 : C.k); }   // thorns
    ell(c, 0, 0, r, r * 1.12, C.b1);
    for (let i = -2; i <= 2; i++) { const yy = i * r * 0.38, hw = r * Math.sqrt(Math.max(0, 1 - (i * 0.38) * (i * 0.38))); poly(c, [[-hw, yy - r * 0.16], [hw, yy - r * 0.16], [hw, yy + r * 0.1], [-hw, yy + r * 0.1]], i % 2 ? C.a0 : C.a); }   // paper bands
    ell(c, -r * 0.3, -r * 0.5, r * 0.34, r * 0.18, C.h);
    ell(c, r * 0.1, r * 0.25, r * 0.3, r * 0.26, C.k);   // the way in
    poly(c, [[r * 0.0, r * 0.2], [r * 0.2, r * 0.2], [r * 0.1, r * 0.3]], C.red);
  }
  const _hb = CASTS.hive_burst;
  CASTS.hive_burst = function (p, z) {
    const n0 = z.shots.length, r = _hb.apply(this, arguments);
    if (!isA(G)) return r;
    const s0 = z.shots.slice(n0).find(s => s instanceof Proj && s.w === 14 && s.breaker); if (!s0) return r;
    s0.render = (ctx, x, y, q) => PX.sprite(ctx, x, y, 44, 44, c => { c.rotate(q.t * 0.22 * (Math.sign(q.vx) || 1)); hiveVec(c, 9); }, { pal: PAL });
    const _end = s0.onEnd;
    s0.onEnd = function (g, zz) {
      const ex = this.x, ey = this.y;
      if (zz && zz.shots) zz.shots.push(new Vis(ex, ey, 14, (ctx, sx, sy, t) => {   // it shatters: paper shards fly
        const k = t / 14;
        for (let i = 0; i < 7; i++) { const a = i / 7 * PI * 2 + 0.3, d = 6 + k * 34; PX.sprite(ctx, sx + Math.cos(a) * d, sy + Math.sin(a) * d * 0.8 + k * k * 10, 16, 16, c => { c.rotate(a + k * 4); poly(c, [[-4, -2], [3, -3], [5, 2], [-2, 3]], i % 2 ? C.a0 : C.b1); }, { pal: PAL, alpha: 1 - k }); }
      }));
      return _end ? _end.apply(this, arguments) : undefined;
    };
    return r;
  };

  // ================= S+I: Royal Jelly: gold rises round her =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.apis;
  if (BU && BU.cast) {
    const _rj = BU.cast;
    BU.cast = function (p, z) {
      const r = _rj.apply(this, arguments);
      if (!isA(G)) return r;
      z.shots.push(new Vis(p.x, p.y, 18, (ctx, sx, sy, t) => {
        const k = t / 18, a = 1 - ease((k - 0.5) / 0.5), h = 60 * ease(k * 2);
        ctx.save(); ctx.globalAlpha = 0.35 * a; ctx.fillStyle = '#ffd166'; ctx.fillRect(sx - 10, sy - h, 20, h); ctx.globalAlpha = 0.8 * a; ctx.fillStyle = '#ffffff'; ctx.fillRect(sx - 1, sy - h, 2, h); ctx.restore();
        ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 5; i++) hexo(ctx, sx + (i % 2 ? 7 : -7), sy - 8 - i * 11 * ease(k * 2), 5, i % 2 ? '#fca311' : '#ffd166'); ctx.restore();
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= W+O: Waggle Dance: a figure-eight of hornets =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.apis;
  if (SIG && SIG.cast) {
    const _wd = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _wd.apply(this, arguments);
      if (!isA(G)) return r;
      const vis = z.shots.slice(n0).find(s => s.life === 120 && s.render); if (!vis) return r;
      vis.render = (ctx, x, y, t) => {
        const cy = y - 18, a = t > 108 ? (120 - t) / 12 : Math.min(1, t / 6), turn = Math.floor(t / 15) % 6, beat = t % 15;
        for (let i = 0; i < 6; i++) {
          const u = t * 0.11 + i * PI / 3, hx = x + Math.sin(u) * 26, hy = cy + Math.sin(u * 2) * 11, d = Math.cos(u) >= 0 ? 1 : -1;
          if (i === turn && beat < 6) {   // this one darts in and stabs (the dance stings every 15 frames)
            const k = Math.sin(beat / 6 * PI), sx2 = hx + (x - hx) * k * 0.8, sy2 = hy + (cy - hy) * k * 0.8, dd = x >= hx ? 1 : -1;
            hornet(ctx, sx2, sy2, 15, dd, { t: t + i, sting: 0.6, a });
            if (beat < 4) stab(ctx, x, cy, Math.atan2(cy - hy, x - hx), 9, a * (1 - beat / 4));
          } else hornet(ctx, hx, hy, 13, d, { t: t + i, a });
        }
      };
      return r;
    };
  }

  // ================= her combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // a hornet stabs from her fist on every hit
      const k = p.st - a.hitAt;
      if (k >= -3 && k < 7) {
        const reach = a.box ? a.box[0] + a.box[2] * 0.6 : 22, out = k < 0 ? (k + 3) / 3 : 1 - k / 14, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22);
        hornet(ctx, sx + d * (8 + reach * out), hy, 17, d, { t: p.t, sting: k >= 0 && k < 4 ? 0.7 : 0.2 });
        if (k >= 0 && k < 4) stab(ctx, sx + d * (10 + reach), hy + 3, d > 0 ? 0.25 : PI - 0.25, 12, 1 - k / 4);
      }
    }
    if (p.modeT > 0) { const fade = Math.min(1, p.modeT / 30); for (let i = 0; i < 2; i++) { const u = p.t * 0.16 + i * PI; hornet(ctx, sx + d * 9 + Math.cos(u) * 8, sy - 24 + Math.sin(u) * 5, 9, Math.sin(u) < 0 ? 1 : -1, { t: p.t + i, a: fade }); } }   // two at her hand
    if (p.awakeT > 0) {   // her crown glints; honeycomb at her feet
      const fade = Math.min(1, p.awakeT / 30), top = sy - (p.h || 34);
      ctx.save(); ctx.globalAlpha = 0.7 * fade; for (let i = -1; i <= 1; i++) hexo(ctx, sx + i * 9, sy - 2 - (i ? 0 : 3), 5, '#fca311'); ctx.restore();
      if (p.t % 40 < 6) { ctx.save(); ctx.globalAlpha = fade; art.rect(ctx, '#ffffff', sx - 3, top - 5, 7, 1); art.rect(ctx, '#ffffff', sx, top - 8, 1, 7); ctx.restore(); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isA(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isA(g || this.G) && z && z.shots) dress(z); return r; };
  // the swarm she has gathered (up to eight), circling her hand: small, so the count stays readable
  if (N.TRAITS && N.TRAITS.swarm) N.TRAITS.swarm.mark = function (ctx, p, x, y) {
    const n = p.bees || 0;
    for (let i = 0; i < n; i++) { const a = SW.frame * 0.12 + i / 8 * PI * 2; if (AH.on) hornet(ctx, x + Math.cos(a) * 17, y - 24 + Math.sin(a) * 9, 8, Math.sin(a) < 0 ? 1 : -1, { t: SW.frame + i }); else art.rect(ctx, '#fca311', Math.round(x + Math.cos(a) * 16) - 2, Math.round(y - 24 + Math.sin(a) * 8) - 1, 4, 3); }
  };

  // ================= W+I: Killer Swarm =================
  const _ult = N.ULT.killer_swarm;
  if (_ult) N.ULT.killer_swarm = function (p, z, foes) {
    const n0 = z.shots.length, r = _ult.apply(this, arguments);
    if (!isA(G)) return r;
    z.shots.slice(n0).forEach((v, i) => {   // the bees that cross the screen: hornets of different sizes
      if (!(v instanceof Vis) || v.life !== 60 || !v.render) return;
      const d = v.x <= G.cam.x + 4 ? 1 : -1, sz = 12 + ((p.st * 7 + i * 3) % 12);
      v._ugS = 1;
      v.render = (ctx, x, y, t) => hornet(ctx, x + d * t * 8, y + Math.round(Math.sin(t * 0.5) * 6), sz, d, { t, sting: 0.15 });
    });
    if (p.st === 6) {
      const sky = new Vis(p.x, p.y, 70, (ctx, sx, sy, t) => {   // (screen space) the sky goes dark with them
        const k = Math.min(1, t / 10, (70 - t) / 10);
        ctx.save(); ctx.globalAlpha = 0.42 * k; ctx.fillStyle = '#140a02'; ctx.fillRect(0, 0, W, H); ctx.restore();
        ctx.save(); ctx.globalAlpha = k;
        for (let i = 0; i < 90; i++) { const sp = 2 + (i % 5), x = ((i * 53 + t * sp * (i % 2 ? 1 : -1)) % (W + 20) + W + 20) % (W + 20) - 10, y = 14 + ((i * 29) % 70) + Math.sin(t * 0.3 + i) * 3; art.rect(ctx, i % 4 ? '#3a2206' : '#fca311', Math.round(x), Math.round(y), 2, 1); art.rect(ctx, '#fff1b8', Math.round(x), Math.round(y) - 1, 1, 1); }   // the far swarm: a cloud of specks
        ctx.restore();
      });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('apis') >= 0) finale(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100): the queen
  // hornet hangs over the target, her sting drawn back; on the blow it curls forward and goes through
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1, S = 56;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 14) return;
      const cy = sy - 20, bx = sx - dir * 44, by = cy - 26;   // whole inside the pushed-in view; her sting lands on the target
      if (st < FIN) {
        const k = ease((st - 74) / 10), strike = ease((st - (FIN - 5)) / 5), bob = Math.sin(st * 0.5) * 2;
        hornet(ctx, bx, by + bob + 40 * (1 - k), S, dir, { t: st, queen: true, sting: 0.2 + strike * 0.8, a: k });
        for (let i = 0; i < 5; i++) { const u = st * 0.2 + i * 1.26; hornet(ctx, sx + Math.cos(u) * 44, cy + Math.sin(u * 2) * 16, 11, Math.cos(u) < 0 ? 1 : -1, { t: st + i, a: k }); }   // her guard, circling the target
      } else {
        const k = (st - FIN) / 14, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 81);
        hornet(ctx, bx, by, S, dir, { t: st, queen: true, sting: 1, mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease((k - 0.5) / 0.5) });
        stab(ctx, sx - dir * 10, cy - 6, dir > 0 ? 0.5 : PI - 0.5, 46, 1 - k);
        if (st === FIN) for (let i = 0; i < 22; i++) part(T.x + rand(-12, 12), T.y - rand(4, 36), i % 2 ? '#fca311' : '#ffffff', rand(-4, 4), -rand(0, 4), 22, 2, 0.1);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
