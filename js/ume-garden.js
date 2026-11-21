'use strict';
// Shattered Worlds — Ume's poison garden (2026-11-20, the hero-look rework: cool, not cute). Her story: the gardener of the
// Glowwild, maker of beautiful poison; "everything she grows is beautiful. Do not touch any of it." Her flowers were
// dots round a dot and her spores green blobs. Now her garden is deadly, drawn as crisp pixel art by js/pixel-kit.js:
// nightshade lilies with five long pointed violet petals, black veins and a glowing toxic-green throat that drips;
// thorned vines with serrated leaves; a corpse flower whose petals are jaws lined with teeth; and spores that glow in a
// halo of sickly light. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/jax-sixgun.js.
//   U      Spore Puff: a curling cloud of glowing spores in a sickly halo
//   S+U    Vine Snap: a thorned vine whips up out of the floor, serrated leaves, a nightshade at its tip
//   I      Bloom Field: three nightshades unfurl petal by petal, then breathe out their spores on every beat
//   S+I    Corpse Flower: a giant flower of red flesh whose petals are jaws with teeth; it snaps shut three times
//   W+O    Toxic Bloom: a fat bud pushes up through the floor, splits and bursts into a glittering cloud
//   J      her combo: a thorned vine lashes up through every hit; the last bursts in a spore cloud
//   S+O    Sap Rush: glowing sap drips from her hands      O  Full Bloom: the violet flower in her hair opens wide, and
//          spores drift round her (small on purpose: the view stays clear)
//   W+I    Last Spring: nightshades open across the whole floor and breathe spores; on the finishing blow
//          (js/ult-grand.js) one giant nightshade opens over the target and bursts on an impact frame
// SW.umeGarden.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.spore_puff || !CASTS.vine_snap || !CASTS.bloom_field) return;
  const UG = SW.umeGarden = { on: true };
  const isU = g => !!(UG.on && g && g.state && g.state.hero === 'ume');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // nightshade violet, black veins, toxic green, deep leaf green, flesh red, bone teeth
  const PAL = ['#0e0614', '#2a0a3a', '#4a1470', '#7b2cbf', '#c77dff', '#e8c6ff', '#0a2a10', '#1e5a14', '#38b000', '#9ef01a', '#e8ff7a', '#ffffff', '#3a0610', '#7a1020', '#c0303a', '#f0e6c8'];
  const C = { out: PAL[0], v0: PAL[1], v1: PAL[2], v: PAL[3], v2: PAL[4], v3: PAL[5], g0: PAL[6], g1: PAL[7], g: PAL[8], tox: PAL[9], tox2: PAL[10], w: PAL[11], r0: PAL[12], r1: PAL[13], r: PAL[14], bone: PAL[15] };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };

  // ---------- a nightshade lily, seen from the side-front: (0, 0) its throat, s its size; open 0 (bud) -> 1 ----------
  function lilyVec(c, s, open) {
    const o = clamp01(open);
    for (let i = 0; i < 5; i++) {   // five long pointed petals, curling back as they open; the back ones darker
      const a = -PI / 2 + (i - 2) * (0.18 + 0.42 * o), L = s * (0.5 + 0.5 * o), back = i % 2 === 1;
      const tx = Math.cos(a) * L, ty = Math.sin(a) * L, nx = -Math.sin(a) * s * 0.16, ny = Math.cos(a) * s * 0.16;
      poly(c, [[nx * 0.4, ny * 0.4], [tx * 0.55 + nx, ty * 0.55 + ny], [tx, ty], [tx * 0.55 - nx, ty * 0.55 - ny], [-nx * 0.4, -ny * 0.4]], back ? C.v1 : C.v);
      c.strokeStyle = C.v0; c.lineWidth = Math.max(1, s * 0.035); c.beginPath(); c.moveTo(0, 0); c.lineTo(tx * 0.9, ty * 0.9); c.stroke();   // the black vein
      if (!back) { c.strokeStyle = C.v2; c.lineWidth = Math.max(1, s * 0.03); c.beginPath(); c.moveTo(tx * 0.3 + nx * 0.5, ty * 0.3 + ny * 0.5); c.lineTo(tx * 0.8 + nx * 0.2, ty * 0.8 + ny * 0.2); c.stroke(); }   // light on the edge
    }
    // the glowing throat and its stamens
    c.beginPath(); c.arc(0, 0, s * (0.1 + 0.08 * o), 0, PI * 2); c.fillStyle = C.tox; c.fill();
    c.beginPath(); c.arc(0, 0, s * 0.06, 0, PI * 2); c.fillStyle = C.tox2; c.fill();
    if (o > 0.4) { c.strokeStyle = C.tox; c.lineWidth = Math.max(1, s * 0.03); for (let i = 0; i < 3; i++) { const a = -PI / 2 + (i - 1) * 0.4; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * s * 0.3, Math.sin(a) * s * 0.3); c.stroke(); c.fillStyle = C.tox2; c.fillRect(Math.cos(a) * s * 0.3 - 1, Math.sin(a) * s * 0.3 - 1, 2, 2); } }
  }
  // the lily on its stem: (x, y) the floor; o = { open, s, h (stem), sway, a, mono }
  function lily(ctx, x, y, o) {
    o = o || {};
    const s = o.s || 12, h = o.h === undefined ? s * 1.3 : o.h, sw = o.sway || 0;
    PX.sprite(ctx, x, y - (h + s) / 2, s * 2.6 + 4, h + s * 2 + 4, c => {
      c.translate(0, (h + s) / 2);
      c.strokeStyle = C.g1; c.lineWidth = Math.max(1, s * 0.1); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(sw * s * 0.4, -h * 0.5, sw * s * 0.2, -h); c.stroke();   // stem
      if (h > s * 0.6) { poly(c, [[0, -h * 0.35], [-s * 0.45, -h * 0.55], [-s * 0.1, -h * 0.42]], C.g1); poly(c, [[0, -h * 0.25], [s * 0.4, -h * 0.4], [s * 0.08, -h * 0.3]], C.g); }   // two blade leaves
      c.translate(sw * s * 0.2, -h); c.rotate(sw * 0.2);
      lilyVec(c, s, o.open === undefined ? 1 : o.open);
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  UG.lily = lily;
  // ---------- a thorned vine through floor-up points pts (screen) ----------
  function vine(ctx, pts, w, o) {
    o = o || {};
    if (pts.length < 2) return;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(q => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    PX.sprite(ctx, cx, cy, x1 - x0 + w * 6 + 8, y1 - y0 + w * 6 + 8, c => {
      c.translate(-cx, -cy);
      c.strokeStyle = C.g1; c.lineCap = 'round'; c.lineJoin = 'round';
      for (let i = 0; i < pts.length - 1; i++) { const u = i / (pts.length - 1); c.lineWidth = Math.max(1.5, w * (1 - u * 0.6)); c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i + 1][0], pts[i + 1][1]); c.stroke(); }
      c.strokeStyle = C.g; c.lineWidth = Math.max(1, w * 0.3); c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0] - w * 0.2, q[1]) : c.moveTo(q[0] - w * 0.2, q[1]))); c.stroke();
      for (let i = 1; i < pts.length - 1; i++) {   // thorns and serrated leaves along it
        const a = pts[i - 1], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, side = i % 2 ? 1 : -1, q = pts[i];
        poly(c, [[q[0] + nx * w * 0.4 * side, q[1] + ny * w * 0.4 * side], [q[0] + nx * w * 1.4 * side + dx / L * w * 0.4, q[1] + ny * w * 1.4 * side + dy / L * w * 0.4], [q[0] + dx / L * w * 0.5, q[1] + dy / L * w * 0.5]], C.bone);   // a thorn
        if (i % 3 === 0) { const lx = q[0] - nx * w * 2.2 * side, ly = q[1] - ny * w * 2.2 * side; poly(c, [[q[0], q[1]], [lx + dx / L * w, ly + dy / L * w], [lx - dx / L * w * 0.3, ly - dy / L * w * 0.3]], C.g); }   // a leaf
      }
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  // ---------- glowing spores: a curling cloud in a sickly halo ----------
  function spores(ctx, x, y, r, t, a) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = 0.14 * a; art.disc(ctx, C.tox, Math.round(x), Math.round(y), Math.round(r * 1.25));   // the halo
    ctx.globalAlpha = 0.22 * a; art.disc(ctx, C.g, Math.round(x), Math.round(y), Math.round(r * 0.8));
    ctx.globalAlpha = a;
    for (let i = 0; i < 16; i++) {   // the spores themselves, curling
      const ang = i * 2.4 + t * (0.05 + (i % 3) * 0.02), rr = r * (0.2 + ((i * 37) % 10) / 12), sx = x + Math.cos(ang) * rr, sy = y + Math.sin(ang) * rr * 0.8 - (t * 0.1 + i) % 6;
      art.rect(ctx, i % 4 === 0 ? C.w : i % 2 ? C.tox : C.tox2, Math.round(sx), Math.round(sy), i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
    }
    ctx.restore();
  }
  UG.spores = spores;
  // ---------- the corpse flower: (x, y) the floor; snap 0 (open) -> 1 (jaws shut); s its size ----------
  function corpse(ctx, x, y, s, snap, o) {
    o = o || {};
    PX.sprite(ctx, x, y - s * 0.6, s * 2.6, s * 1.6, c => {
      c.translate(0, s * 0.6);
      const sn = clamp01(snap);
      for (const side of [-1, 1]) {   // two great petals, hinged at the base, each a jaw
        c.save(); c.scale(side, 1); c.rotate(-(1 - sn) * 0.85);
        poly(c, [[0, -s * 0.05], [s * 0.15, -s * 0.55], [s * 0.05, -s * 1.0], [-s * 0.08, -s * 0.95], [-s * 0.12, -s * 0.5]], C.r1);
        poly(c, [[0, -s * 0.08], [s * 0.1, -s * 0.5], [s * 0.03, -s * 0.92], [-s * 0.05, -s * 0.5]], C.r);
        c.fillStyle = C.r0; for (let i = 0; i < 4; i++) c.fillRect(s * 0.02, -s * (0.25 + i * 0.17), Math.max(1, s * 0.05), Math.max(1, s * 0.05));   // dark spots
        for (let i = 0; i < 5; i++) poly(c, [[-s * 0.1 - i * s * 0.002, -s * (0.2 + i * 0.15)], [-s * 0.24, -s * (0.25 + i * 0.15)], [-s * 0.1, -s * (0.3 + i * 0.15)]], C.bone);   // teeth along the inner edge
        c.restore();
      }
      c.beginPath(); c.arc(0, -s * 0.06, s * 0.14, 0, PI * 2); c.fillStyle = C.tox; c.fill();   // the glowing heart
      c.fillStyle = C.g1; c.fillRect(-s * 0.5, -s * 0.06, s, s * 0.08);   // the leaves round its base
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }

  // ================= U: Spore Puff =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.ume || !(s instanceof Proj) || !s.ghost || s.w !== 24 || s.h !== 24 || s.life !== 54 || s.team === 'enemy') return;
      s.ume = 1;
      s.render = (ctx, x, y, q) => spores(ctx, x, y, 13 + Math.min(6, q.t / 6), q.t, 1);
    });
  }
  const _sp = CASTS.spore_puff;
  CASTS.spore_puff = function (p, z) { const r = _sp.apply(this, arguments); if (isU(G)) dress(p, z); return r; };

  // ================= S+U: Vine Snap =================
  const _vs = CASTS.vine_snap;
  CASTS.vine_snap = function (p, z) {
    const n0 = z.shots.length, r = _vs.apply(this, arguments);
    if (!isU(G)) return r;
    const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 30 && s.render);
    if (v) v.render = (ctx, sx, sy, t) => {
      const hh = 58 * Math.min(1, 0.35 + t / 5) * (t > 22 ? (30 - t) / 8 : 1), pts = [];
      for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([sx + Math.sin(u * 5 + t * 0.4) * 5 * u, sy - hh * u]); }
      vine(ctx, pts, 5);
      if (hh > 16) lily(ctx, pts[10][0], pts[10][1] + 10, { s: 10, h: 6, open: 1, sway: Math.sin(t * 0.3) });
    };
    return r;
  };

  // ================= I: Bloom Field =================
  const _bf = CASTS.bloom_field;
  CASTS.bloom_field = function (p, z) {
    const n0 = z.shots.length, r = _bf.apply(this, arguments);
    if (!isU(G)) return r;
    z.shots.slice(n0).filter(s => s instanceof Vis && s.life >= 170 && s.render).forEach((v, k) => {
      v.render = (ctx, sx, sy, t) => {
        const o = clamp01((t - 8 - k * 6) / 12), a = t > v.life - 12 ? (v.life - t) / 12 : 1, t0 = 20 + k * 6, beat = t >= t0 ? (t - t0) % 20 : -1;
        lily(ctx, sx, sy, { s: 14, open: o, sway: Math.sin(t * 0.06 + k) * 0.4, a });
        if (o >= 1 && beat >= 0) spores(ctx, sx, sy - 24 - beat * 0.6, 8 + beat * 0.5, t, a * (1 - beat / 20));
      };
    });
    return r;
  };

  // ================= S+I: Corpse Flower =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.ume;
  if (BU && BU.cast) {
    const _cf = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _cf.apply(this, arguments);
      if (!isU(G)) return r;
      const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 60 && s.render);
      if (v) v.render = (ctx, x, y, t) => {
        const rise = ease(t / 8), snapAt = [16, 30, 44].map(s => t - s).find(k => k >= -2 && k < 6), snap = snapAt === undefined ? 0 : snapAt < 0 ? (snapAt + 2) / 2 : snapAt < 3 ? 1 : 1 - (snapAt - 3) / 3, a = t > 52 ? (60 - t) / 8 : 1;
        corpse(ctx, x, y + (1 - rise) * 30, 56, snap, { a });
        if (snapAt !== undefined && snapAt >= 0 && snapAt < 4) spores(ctx, x, y - 24, 12, t, 1 - snapAt / 4);
      };
      return r;
    };
  }

  // ================= W+O: Toxic Bloom =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.ume;
  if (SIG && SIG.cast) {
    const _tb = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _tb.apply(this, arguments);
      if (!isU(G)) return r;
      const x = p.x + p.face * 40, gy = N.floorY ? N.floorY(z, x, p.y - 20) : p.y;
      z.shots.push(new Vis(x, gy, 140, (ctx, sx, sy, t) => {
        if (t < 16) {   // a fat bud pushes up through the floor, swelling
          const k = t / 16, sh = t > 12 ? Math.round(rand(-1, 1)) : 0;
          PX.sprite(ctx, sx + sh, sy - 20, 44, 52, c => { c.translate(0, 20); c.fillStyle = C.g1; c.fillRect(-2, -10 * k, 4, 10 * k); c.beginPath(); c.ellipse(0, -10 * k - 8 * (0.5 + k), 7 + 6 * k, 8 + 9 * k, 0, 0, PI * 2); c.fillStyle = C.v1; c.fill(); c.strokeStyle = C.v; c.lineWidth = 1; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(i * 3, -10 * k - 12 * k); c.lineTo(i * 2, -10 * k); c.stroke(); } c.fillStyle = C.tox; c.fillRect(-1, -10 * k - 12 * (0.5 + k), 2, 2); }, { pal: PAL, outline: C.out, keepThin: true });
        } else {
          const k = (t - 16) / 124;
          if (t < 26) lily(ctx, sx, sy, { s: 16, h: 10, open: 1, a: 1 - (t - 16) / 10 });
          spores(ctx, sx, sy - 22, 18 + ease(k * 3) * 12, t, 1 - ease((k - 0.6) / 0.4));
          if (t >= 16 && t < 22) { ctx.save(); ctx.globalAlpha = 1 - (t - 16) / 6; art.ring(ctx, C.tox, sx, sy - 18, 6 + (t - 16) * 6); ctx.restore(); }
        }
      }));
      return r;
    };
  }

  // ================= her combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // a thorned vine lashes up through every hit; the last bursts in spores
      const k = p.st - a.hitAt, set = p.comboSet ? p.comboSet() : null, last = !!(set && a === set[set.length - 1]) || a.fin;
      const hx = sx + d * (a.box ? a.box[0] + a.box[2] * 0.5 : 20), hy = sy + (a.box ? a.box[1] + a.box[3] * 0.4 : -24);
      if (k >= -2 && k < 6) {
        const q = ease((k + 2) / 3), pts = [];
        for (let i = 0; i <= 7; i++) { const u = i / 7; pts.push([sx + d * 4 + (hx - sx - d * 4) * u * q + Math.sin(u * 4) * 3 * d, sy - 2 + (hy - sy + 2) * u * q - Math.sin(u * PI) * 8]); }
        vine(ctx, pts, 4.5, { a: k < 3 ? 1 : 1 - (k - 3) / 3 });
      }
      if (last && k >= 0 && k < 16) spores(ctx, hx + d * 6, hy, 10 + k * 0.8, p.t, 1 - k / 16);
    }
    if (p.modeT > 0) {   // Sap Rush: glowing sap drips from her hands
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < 3; i++) { const u = ((p.t * 0.025 + i * 0.33) % 1), x = sx + (i - 1) * 6 + d * 3; art.rect(ctx, C.tox, Math.round(x), Math.round(sy - 18 + u * 18), 1, 2); if (u > 0.9) art.rect(ctx, C.tox2, Math.round(x) - 1, sy - 1, 3, 1); }
      ctx.restore();
    }
    if (p.awakeT > 0) {   // Full Bloom: the flower in her hair opens wide; spores drift round her
      const fade = Math.min(1, p.awakeT / 30);
      PX.sprite(ctx, sx - d * 3, sy - (p.h || 34) - 1, 16, 16, c => { lilyVec(c, 6, 1); }, { pal: PAL, alpha: fade, outline: C.out, keepThin: true });
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < 5; i++) { const ang = p.t * 0.04 + i * 1.26, r = 12 + Math.sin(p.t * 0.05 + i) * 3; art.rect(ctx, i % 2 ? C.tox : C.tox2, Math.round(sx + Math.cos(ang) * r), Math.round(sy - 18 + Math.sin(ang) * r * 0.6), 1, 1); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isU(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: Last Spring =================
  const _ls = N.ULT && N.ULT.last_spring;
  if (_ls) N.ULT.last_spring = function (p, z, foes) {
    const n0 = z.shots.length, r = _ls.apply(this, arguments);
    if (!isU(G)) return r;
    z.shots.slice(n0).forEach((v, i) => {   // the floor in bloom: nightshades open and breathe spores
      if (!(v instanceof Vis) || v.life !== 62 || !v.render) return;
      v._ugS = 1;
      v.render = (ctx, sx, sy, t) => { lily(ctx, sx, sy, { s: 10 + (i % 3) * 2, open: clamp01(t / 10), sway: Math.sin(t * 0.08 + i) * 0.5 }); if (t > 12 && t < 56) spores(ctx, sx, sy - 28 - (t % 20), 9, t + i * 7, 0.7); };
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): a giant nightshade unfurls over the target, its throat glowing, then bursts
  function finale(p, z, T) {
    const G2 = SW.ultGrand, pl = G2 && G2.on && G2.planOf ? G2.planOf('ume') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    let burst = false;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const cy = sy - 18;   // low enough for the pushed-in view
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2));
        PX.sprite(ctx, sx, cy, 110, 110, c => { c.rotate(Math.sin(st * 0.05) * 0.05); lilyVec(c, 44, k); }, { pal: PAL, alpha: Math.min(1, k * 3), outline: C.out, keepThin: true });
        spores(ctx, sx, cy, 10 + k * 14, st, k);
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 53);
        PX.sprite(ctx, sx, cy, 110, 110, c => lilyVec(c, 44, 1), { pal: PAL, alpha: 1 - ease((k - 0.3) / 0.4), mono: ik < 0.5 ? C.w : undefined, outline: C.out, keepThin: true });
        spores(ctx, sx, cy, 24 + k * 50, st, 1 - ease((k - 0.5) / 0.5));
        if (!burst) { burst = true; for (let i = 0; i < 26; i++) part(T.x + rand(-14, 14), T.y - rand(10, 40), i % 3 ? C.tox : C.v2, rand(-4, 4), -rand(0, 4), 26, 2, 0.05); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult') return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
