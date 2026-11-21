'use strict';
// Shattered Worlds — Oda's bell (2026-11-20, the hero-look rework: cool, not cute). His story: the silent monk of the
// Temple of the Last Toll, who took a vow of silence; "the bell did not". His look: a small bronze temple bell hanging
// from a rope in one big hand, rings of sound rippling from it. His bells were stacks of rectangles and his sound plain
// arcs. Now his bells are weathered bronze temple bells drawn as crisp pixel art by js/pixel-kit.js: a crown loop, a
// rounded shoulder, raised bosses, cast bands, a lotus striking seat, a flared lip, green patina running down from the
// bands; and his sound rings are the shape of a bell's mouth. Draw-only: every hit, hitbox and timing stays as it was.
// Loaded after js/isa-ink.js.
//   U      Toll Wave: three bell-mouth rings roll out, nested, with vibration ticks
//   S+U    Bell Drop: a great bell drops on its rope over the foe and shudders at each ring
//   I      Resonance: each palm strike sends bell-shaped ripples both ways along the floor
//   S+I    Thunder Toll: the hand-bell is drawn back on its rope and swung into the foe's face: a cone of rings, dust
//   W+O    Echo Chamber: each echo lands as a ghost bell ringing on the floor further ahead
//   J      his combo: the hand-bell swings into every hit; the last tolls with a ring round a small bell
//   S+O    Deep Toll: slow low rings round his feet, like breathing      O  Great Bell: his hand-bell hangs from its rope
//          in his hand, swaying; a perfect block rings it (small on purpose: the view stays clear)
//   W+I    The Last Toll: the arena-sized bell comes down on its beam and a striking log swings into it for every toll;
//          on the finishing blow (js/ult-grand.js) the great bell drops over the target and tolls once with every ring
// SW.odaBell.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.toll_wave || !CASTS.bell_drop || !CASTS.resonance) return;
  const OB = SW.odaBell = { on: true };
  const isO = g => !!(OB.on && g && g.state && g.state.hero === 'oda');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // bronze: burnt umber up to dawn cream; verdigris; rope
  const PAL = ['#1a0e06', '#3a2210', '#6f4518', '#9a5a20', '#bc6c25', '#dda15e', '#fefae0', '#ffffff', '#2f5e52', '#5f9e8c', '#8a6a3a', '#c9a46a'];
  const C = { out: PAL[0], d1: PAL[1], d2: PAL[2], m: PAL[3], b: PAL[4], hi: PAL[5], cream: PAL[6], w: PAL[7], ver: PAL[8], ver2: PAL[9], rope: PAL[10], rope2: PAL[11] };

  // ---------- a temple bell: (0, 0) the middle of its mouth, s its height ----------
  function bellVec(c, s, o) {
    const S = (x, y) => [x * s, y * s];
    const body = [[-0.38, 0], [-0.35, -0.08], [-0.33, -0.7], [-0.27, -0.86], [-0.14, -0.94], [0.14, -0.94], [0.27, -0.86], [0.33, -0.7], [0.35, -0.08], [0.38, 0]];
    c.beginPath(); body.forEach((q, i) => { const p = S(q[0], q[1]); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = C.b; c.fill();
    // light from the upper left, shadow to the right
    c.beginPath(); [[-0.3, -0.06], [-0.28, -0.72], [-0.2, -0.86], [-0.08, -0.9], [-0.12, -0.8], [-0.17, -0.6], [-0.18, -0.06]].forEach((q, i) => { const p = S(q[0], q[1]); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = C.hi; c.fill();
    c.beginPath(); [[0.2, -0.06], [0.22, -0.7], [0.27, -0.84], [0.33, -0.7], [0.35, -0.08]].forEach((q, i) => { const p = S(q[0], q[1]); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = C.m; c.fill();
    // the cast bands and the flared lip
    c.fillStyle = C.d2; [-0.3, -0.56, -0.62].forEach(y => c.fillRect(-0.34 * s, y * s, 0.68 * s, Math.max(1, s * 0.025)));
    c.fillRect(-0.4 * s, -0.06 * s, 0.8 * s, Math.max(1, s * 0.05));
    c.fillRect(-0.012 * s, -0.56 * s, Math.max(1, s * 0.025), 0.26 * s);
    // raised bosses in the upper panels
    c.fillStyle = C.cream; for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) { const x = (-0.26 + i * 0.09) * s, y = (-0.82 + j * 0.07) * s; c.fillRect(x, y, Math.max(1, s * 0.035), Math.max(1, s * 0.035)); c.fillRect(-x - s * 0.035, y, Math.max(1, s * 0.035), Math.max(1, s * 0.035)); }
    // the lotus striking seat
    c.beginPath(); c.arc(0.16 * s, -0.2 * s, 0.065 * s, 0, PI * 2); c.fillStyle = C.d2; c.fill(); c.beginPath(); c.arc(0.16 * s, -0.2 * s, 0.035 * s, 0, PI * 2); c.fillStyle = C.hi; c.fill();
    // verdigris running down from the bands
    c.fillStyle = C.ver; [[-0.24, -0.3, 0.12], [0.05, -0.56, 0.16], [0.26, -0.3, 0.1], [-0.1, -0.62, 0.08]].forEach(q => c.fillRect(q[0] * s, q[1] * s, Math.max(1, s * 0.025), q[2] * s));
    c.fillStyle = C.ver2; c.fillRect(-0.24 * s, -0.3 * s, Math.max(1, s * 0.025), 0.04 * s);
    // a dent of age
    c.fillStyle = C.d2; c.fillRect(-0.3 * s, -0.42 * s, Math.max(1, s * 0.04), Math.max(1, s * 0.03));
    // the crown loop
    c.strokeStyle = C.d2; c.lineWidth = Math.max(1, s * 0.05); c.beginPath(); c.arc(0, -0.96 * s, 0.07 * s, PI, 0); c.stroke();
    // the dark mouth, seen from just below
    if (o && o.mouth) { c.fillStyle = C.d1; c.beginPath(); c.ellipse(0, -0.01 * s, 0.36 * s, 0.04 * s, 0, 0, PI); c.fill(); }
  }
  // the bell as a crisp sprite: (x, y) its mouth, s its height; o = { rot (swing, round its crown), a, mono, mouth }
  function bell(ctx, x, y, s, o) {
    o = o || {};
    const box = Math.ceil(s * 2.4);
    PX.sprite(ctx, x, y - s * 0.5, box, box, c => { c.translate(0, s * 0.5); if (o.rot) { c.translate(0, -s); c.rotate(o.rot); c.translate(0, s); } bellVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  OB.bell = bell;
  // a rope from (x0, y0) down to (x1, y1): twisted, two tones
  function rope(ctx, x0, y0, x1, y1) {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 2));
    for (let i = 0; i <= n; i++) { const u = i / n, x = Math.round(x0 + (x1 - x0) * u), y = Math.round(y0 + (y1 - y0) * u); art.rect(ctx, i % 2 ? C.rope : C.rope2, x, y, 2, 2); }
  }
  // a ring of sound the shape of the bell's mouth: a flared arc facing dir, radius r
  function mouthRing(ctx, x, y, r, dir, col, a, ticks) {
    if (a <= 0 || r < 2) return;
    ctx.save(); ctx.globalAlpha = clamp01(a);
    const n = Math.max(8, Math.round(r * 1.6));
    for (let i = 0; i <= n; i++) {
      const u = i / n, ang = -1.05 + 2.1 * u, flare = Math.pow(Math.abs(u - 0.5) * 2, 4) * r * 0.22;
      art.rect(ctx, col, Math.round(x + dir * (Math.cos(ang) * r + flare)), Math.round(y + Math.sin(ang) * r * 1.05), 2, 2);
    }
    if (ticks) for (let i = 0; i < 3; i++) { const ang = -0.6 + i * 0.6, rr = r + 4; art.rect(ctx, C.w, Math.round(x + dir * Math.cos(ang) * rr), Math.round(y + Math.sin(ang) * rr), 1, 3); }
    ctx.restore();
  }
  function shiver(ctx, x, y, s, k) {   // vibration lines either side of a ringing bell
    if (k <= 0 || k >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - k;
    for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { const xx = Math.round(x + d * (s * 0.45 + 3 + i * 4 + k * 6)), h = Math.round(s * (0.5 - i * 0.12)); art.rect(ctx, i % 2 ? C.hi : C.cream, xx, Math.round(y - s * 0.55 - h / 2), 1, h); }
    ctx.restore();
  }

  // ================= dressing what he makes =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.oda) return;
      if (s instanceof Proj && s.ghost && s.pierce && s.life === 40 && s.w >= 16 && s.vx && s.team !== 'enemy' && Math.abs(s.vx) > 4) {   // Toll Wave
        s.oda = 1;
        s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1, r = 8 + q.t * 0.4; for (let i = 0; i < 3; i++) mouthRing(ctx, x - d * i * 6, y, r * (1 - i * 0.22), d, i === 0 ? (q.t % 4 < 2 ? C.cream : C.hi) : C.b, 1 - i * 0.25, i === 0); };
      } else if (s instanceof Proj && s.ghost && s.pierce && s.life === 26 && s.w === 18 && s.h === 28) {   // Resonance: bell-shaped ripples
        s.oda = 1;
        s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1, k = q.t / 26; for (let i = 0; i < 3; i++) mouthRing(ctx, x - d * i * 5, y, (10 + q.t * 0.4) * (1 - i * 0.25), d, i ? C.b : (q.t % 4 < 2 ? C.cream : C.hi), (1 - k) * (1 - i * 0.25), i === 0); };
      }
    });
  }
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isO(g || this.G) && z && z.shots) dress(this, z); return r; };

  // ================= U: Toll Wave =================
  const _tw = CASTS.toll_wave;
  CASTS.toll_wave = function (p, z) { const r = _tw.apply(this, arguments); if (isO(G)) dress(p, z); return r; };

  // ================= S+U: Bell Drop: the great bell on its rope =================
  const _bd = CASTS.bell_drop;
  CASTS.bell_drop = function (p, z) {
    const n0 = z.shots.length, r = _bd.apply(this, arguments);
    if (!isO(G)) return r;
    const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 56 && s.render);
    if (v) v.render = (ctx, x, y, t) => {
      const yy = t < 12 ? -140 + Math.round(t * t * 0.97) : 0, ring = [20, 36].map(s => t - s).find(k => k >= 0 && k < 10), sh = ring !== undefined && ring < 4 ? Math.round(rand(-2, 2)) : 0, a = t > 48 ? (56 - t) / 8 : 1;
      ctx.save(); ctx.globalAlpha = a; rope(ctx, x, -10, x, y + yy - 52); ctx.restore();
      bell(ctx, x + sh, y + yy, 50, { a, rot: ring !== undefined ? Math.sin(ring * 1.6) * 0.04 : 0 });
      if (ring !== undefined) { shiver(ctx, x, y + yy, 50, ring / 10); mouthRing(ctx, x, y - 24, 20 + ring * 4, 1, C.cream, 1 - ring / 10, false); mouthRing(ctx, x, y - 24, 20 + ring * 4, -1, C.cream, 1 - ring / 10, false); }
      if (t === 12) for (let i = 0; i < 8; i++) part(x + rand(-24, 24), y - 2, C.hi, rand(-2, 2), -rand(0.5, 2), 18, 2, 0.12);
    };
    return r;
  };

  // ================= I: Resonance =================
  const _rs = CASTS.resonance;
  CASTS.resonance = function (p, z) { const r = _rs.apply(this, arguments); if (isO(G)) dress(p, z); return r; };

  // ================= S+I: Thunder Toll: the swing lands in a cone of rings =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.oda;
  if (BU && BU.cast) {
    const _tt = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _tt.apply(this, arguments);
      if (!isO(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face;
      if (drv) { const _st = drv.step; drv.step = function () { const m = z.shots.length, out = _st.apply(this, arguments); z.shots.slice(m).forEach(s => { if (s instanceof Vis && s.life === 1 && s.render) s.render = (ctx, x, y) => { const sw = -dir * 0.9 + Math.sin(SW.frame * 0.9) * 0.12; rope(ctx, x - dir * 12, y - 24, x - dir * 4, y - 22); bell(ctx, x - dir * 2, y + 2, 18, { rot: sw }); }; }); return out; }; }
      let end = -1, ex = 0, ey = 0;
      z.shots.push(new Vis(p.x, p.y, 40, (ctx, sx, sy, t) => {
        if (end < 0) return;
        const k = (t - end) / 18, x = Math.round(ex - G.cam.x), y = Math.round(ey - G.cam.y);
        bell(ctx, x + dir * 22, y, 20, { rot: dir * 0.6 * (1 - ease(k * 2)), a: 1 - ease((k - 0.6) / 0.4), mono: k < 0.12 ? C.w : undefined });   // swung into their face
        for (let i = 0; i < 4; i++) mouthRing(ctx, x + dir * (28 + i * 8 + k * 30), y - 22, 10 + i * 6 + k * 24, dir, i % 2 ? C.hi : C.cream, 1 - k, i === 0);
      }, v => { if (end < 0 && (!drv || drv.gone || v.t > 14)) { end = v.t; ex = p.x; ey = p.y; v.life = v.t + 18; for (let i = 0; i < 12; i++) part(p.x + dir * rand(20, 50), p.y - rand(0, 6), C.hi, dir * rand(1, 4), -rand(0.5, 2.5), 20, 2, 0.12); } }));
      return r;
    };
  }

  // ================= W+O: Echo Chamber: a ghost bell rings at each echo =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.oda;
  if (SIG && SIG.cast) {
    const _ec = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _ec.apply(this, arguments);
      if (!isO(G)) return r;
      const dir = p.face;
      [36, 76, 116].forEach((off, i) => {
        const x = p.x + dir * off, gy = N.floorY ? N.floorY(z, x, p.y - 20) : p.y, d0 = 6 + i * 10;
        z.shots.push(new Vis(x, gy, d0 + 22, (ctx, sx, sy, t) => {
          const k = (t - d0) / 22; if (k < 0) return;
          bell(ctx, sx, sy - (1 - ease(k * 4)) * 10, 30 + i * 4, { a: 0.8 * (1 - ease((k - 0.5) / 0.5)), rot: Math.sin(k * 18) * 0.06 * (1 - k) });
          shiver(ctx, sx, sy, 30 + i * 4, k);
          mouthRing(ctx, sx, sy - 18, 10 + k * 30, 1, C.hi, 1 - k, false); mouthRing(ctx, sx, sy - 18, 10 + k * 30, -1, C.hi, 1 - k, false);
        }));
      });
      return r;
    };
  }

  // ================= his combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // the hand-bell swings into every hit
      const k = p.st - a.hitAt, set = p.comboSet ? p.comboSet() : null, last = !!(set && a === set[set.length - 1]);
      if (k >= -2 && k < 8) {
        const hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), reach = a.box ? a.box[0] + a.box[2] * 0.6 : 22, sw = ease((k + 2) / 3);
        const hx = sx + d * 6, bx = sx + d * (6 + reach * sw), by = hy + 8;
        if (k < 5) { rope(ctx, hx, hy - 6, bx, by - 14); bell(ctx, bx, by, last ? 16 : 13, { rot: d * (0.9 - sw * 1.3), a: k < 3 ? 1 : 1 - (k - 3) / 2 }); }
        if (k >= 0) mouthRing(ctx, bx + d * 6, by - 8, 6 + k * (last ? 5 : 3), d, C.cream, 1 - k / 8, last);
      }
      if (last && k >= 0 && k < 14) {   // the last hit tolls: a ring round a small bell
        const q = k / 14, bx = sx + d * (a.box ? a.box[0] + a.box[2] : 30), by = sy - 20;
        bell(ctx, bx, by + 8, 14, { mono: C.cream, a: 0.8 * (1 - q) });
        ctx.save(); ctx.globalAlpha = 1 - q; art.ring(ctx, C.cream, bx, by, Math.round(8 + q * 30)); art.ring(ctx, C.hi, bx, by, Math.round(4 + q * 22)); ctx.restore();
      }
    }
    if (p.modeT > 0) {   // Deep Toll: slow low rings round his feet, like breathing
      const fade = Math.min(1, p.modeT / 30), k = (p.t % 60) / 60;
      ctx.save(); ctx.globalAlpha = fade * (1 - k) * 0.8;
      for (let i = 0; i < 28; i++) { const ang = i / 28 * PI * 2; art.rect(ctx, C.hi, Math.round(sx + Math.cos(ang) * (8 + k * 14)), Math.round(sy + Math.sin(ang) * (2 + k * 2)), 1, 1); }
      ctx.restore();
    }
    if (p.awakeT > 0 && !(p.state === 'attack' || p.state === 'airatk')) {   // Great Bell: the hand-bell hangs from its rope in his hand, swaying; it rings on a perfect block
      const fade = Math.min(1, p.awakeT / 30), sw = Math.sin(p.t * 0.06) * 0.25, hx = sx + d * 8, hy = sy - 18, rang = p.odaRang && SW.frame - p.odaRang < 16 ? (SW.frame - p.odaRang) / 16 : -1;
      ctx.save(); ctx.globalAlpha = fade; rope(ctx, hx, hy, hx + Math.round(Math.sin(sw) * 8), hy + 8); ctx.restore();
      bell(ctx, hx + Math.round(Math.sin(sw) * 8), hy + 18, 11, { rot: sw + (rang >= 0 ? Math.sin(rang * 20) * 0.2 : 0), a: fade });
      if (rang >= 0) { mouthRing(ctx, hx, hy + 12, 6 + rang * 20, 1, C.cream, 1 - rang, false); mouthRing(ctx, hx, hy + 12, 6 + rang * 20, -1, C.cream, 1 - rang, false); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isO(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const TR = N.TRAITS && N.TRAITS.ring;
  if (TR && TR.after) { const _af = TR.after; TR.after = function (p, atk, r) { if (r === 'perfect' && p) p.odaRang = SW.frame; return _af.apply(this, arguments); }; }

  // ================= W+I: The Last Toll =================
  const TOLLS = [18, 30, 42, 58];
  const _lt = N.ULT && N.ULT.last_toll;
  if (_lt) N.ULT.last_toll = function (p, z, foes) {
    const n0 = z.shots.length, r = _lt.apply(this, arguments);
    if (!isO(G)) return r;
    z.shots.slice(n0).forEach(v => {   // the arena-sized bell on its beam, and the striking log that tolls it
      if (!(v instanceof Vis) || v.life !== 66 || !v.render) return;
      v._ugS = 1;
      v.render = (ctx, x, y, t) => {
        const st = p.st, yy = Math.round(Math.min(1, t / 12) * 118), cx = W / 2, BS = 104;
        const hitK = TOLLS.map(s => st - s).find(k => k >= 0 && k < 12), last = st >= 58 && st < 70, sw = Math.sin(t * 0.3) * 0.03 + (hitK !== undefined ? Math.sin(hitK * 1.4) * 0.05 * (1 - hitK / 12) : 0);
        art.rect(ctx, C.d1, cx - 90, yy - BS - 18, 180, 8); art.rect(ctx, C.d2, cx - 90, yy - BS - 18, 180, 2);   // the beam
        rope(ctx, cx - 4, yy - BS - 10, cx - 4, yy - BS + 2); rope(ctx, cx + 3, yy - BS - 10, cx + 3, yy - BS + 2);
        bell(ctx, cx, yy, BS, { rot: sw, mono: last && st < 61 ? C.w : undefined, mouth: true });
        const next = TOLLS.find(s => s >= st), pull = next !== undefined ? clamp01((next - st) / 10) : 0, logX = cx + 52 + 34 * ease(pull) + (hitK !== undefined && hitK < 3 ? 0 : 0);   // the log is drawn back, then swings in
        rope(ctx, logX - 10, yy - BS - 10, logX - 10, yy - 44); rope(ctx, logX + 14, yy - BS - 10, logX + 14, yy - 44);
        art.rect(ctx, C.out, logX - 14, yy - 48, 34, 10); art.rect(ctx, C.rope, logX - 13, yy - 47, 32, 8); art.rect(ctx, C.rope2, logX - 13, yy - 47, 32, 2);
        if (hitK !== undefined) {
          shiver(ctx, cx, yy, BS, hitK / 12);
          const n = last ? 6 : 2;
          for (let i = 0; i < n; i++) { mouthRing(ctx, cx, yy - 40, 50 + hitK * 10 + i * 18, 1, i % 2 ? C.hi : C.cream, 1 - hitK / 12, i === 0); mouthRing(ctx, cx, yy - 40, 50 + hitK * 10 + i * 18, -1, i % 2 ? C.hi : C.cream, 1 - hitK / 12, false); }
        }
      };
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the great bell drops over the target and tolls once, every ring at once
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('oda') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 10), drop = ease((st - (FIN - 5)) / 5), hang = sy - 26 + drop * 28;
        ctx.save(); ctx.globalAlpha = k; rope(ctx, sx, -20, sx, hang - 58); ctx.restore();
        bell(ctx, sx, hang, 60, { rot: Math.sin(st * 0.2) * 0.05 * (1 - drop), a: k });
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 30, ik, 23);
        bell(ctx, sx, sy + 2, 60, { mono: ik < 0.5 ? C.w : undefined, a: 1 - ease((k - 0.6) / 0.4) });
        shiver(ctx, sx, sy + 2, 60, k);
        for (let i = 0; i < 6; i++) { mouthRing(ctx, sx, sy - 30, 34 + k * 60 + i * 10, 1, i % 2 ? C.hi : C.cream, 1 - k, i === 0); mouthRing(ctx, sx, sy - 30, 34 + k * 60 + i * 10, -1, i % 2 ? C.hi : C.cream, 1 - k, false); }
        if (st === FIN && !dusted) { dusted = true; for (let i = 0; i < 20; i++) part(T.x + rand(-30, 30), T.y - rand(0, 6), C.hi, rand(-4, 4), -rand(0.5, 3), 22, 2, 0.12); }
      }
    };
    let dusted = false;
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
