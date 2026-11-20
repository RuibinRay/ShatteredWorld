'use strict';
// Shattered Worlds — Coda's ribbons and stage (2026-11-20, the hero-look rework: cool, not cute). Her story: the star
// dancer of the Noble Ring's opera, who counted the tolls of Oda's bell with her feet; Pell tied a string to every step,
// and "the ribbons she fights with now are Pell's strings, cut one by one"; when the Finale ends she curtsies to an empty
// house. Her ribbons were dotted pixel lines and her Spotlight a faint box. Now her ribbons are silk with a blade's
// edge, drawn as crisp pixel art by js/pixel-kit.js: a strip that twists as it flies (pink face, violet back), a white
// highlight along the lit edge, pointed tips. Draw-only: every hit, hitbox and timing stays as it was. Loaded after
// js/zara-cards.js.
//   U      Ribbon Lash: a silk ribbon whips out and cracks taut at full reach; cast on the beat, a bell-ring pulses
//          under her feet with music notes
//   S+U    Pirouette: two ribbons spiral round her as she spins
//   I      Grand Jete: a ribbon traces her leap; she lands in a burst of ribbons
//   S+I    Crescendo: each of the four rings is a ribbon looped round her, with notes on it
//   W+O    Spotlight: a stage lamp above, a cone of light with dust in it, the pool at the foe's feet; it bursts
//   J      her combo: a ribbon lashes through every hit; the finisher pulls one taut and it snaps like a cut string
//   S+O    Allegro: a metronome ring at her feet on the beat, two short ribbons trailing      O  Prima: the cut ends of
//          Pell's strings hang from her wrists, petals fall (small on purpose: the view stays clear)
//   W+I    Finale: a spotlight finds her; on the finishing blow (js/ult-grand.js) heavy crimson curtains sweep in from both
//          sides and slam shut on the target on an impact frame, then lift
// SW.codaRibbon.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.ribbon_lash || !CASTS.grand_jete) return;
  const CR = SW.codaRibbon = { on: true };
  const isC = g => !!(CR.on && g && g.state && g.state.hero === 'coda');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, BEAT = 40;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // silk: violet shadow up to blush and white
  const PAL = ['#1a0820', '#3a1450', '#6a2c8a', '#9b5de5', '#c23b8a', '#f15bb5', '#ff8fd0', '#ffe0f3', '#ffffff'];
  const C = { out: PAL[0], v0: PAL[1], v1: PAL[2], v: PAL[3], p0: PAL[4], p: PAL[5], p2: PAL[6], blush: PAL[7], w: PAL[8] };
  const NOTE = ['0110', '0101', '0100', '0100', '1100', '1100'];
  const note = (ctx, x, y, col) => NOTE.forEach((r, j) => { for (let i = 0; i < 4; i++) if (r[i] === '1') art.rect(ctx, col, Math.round(x) + i, Math.round(y) + j, 1, 1); });

  // ---------- a ribbon through screen points pts: w its width, tw the twist phase; o = { a, mono, taper (0 = flat end), tip (pointed) } ----------
  function ribbon(ctx, pts, w, tw, o) {
    o = o || {};
    if (pts.length < 2) return;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(q => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, n = pts.length;
    PX.sprite(ctx, cx, cy, x1 - x0 + w * 2 + 8, y1 - y0 + w * 2 + 8, c => {
      for (let i = 0; i < n - 1; i++) {
        const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
        const u0 = i / (n - 1), u1 = (i + 1) / (n - 1), tp = u => (o.tip !== false ? Math.min(1, (1 - u) * 5) : 1) * (o.taper === 0 ? 1 : Math.min(1, 0.35 + u * 3));
        const s0 = Math.cos(tw + i * 0.55), s1 = Math.cos(tw + (i + 1) * 0.55), w0 = w * Math.max(0.25, Math.abs(s0)) * tp(u0) / 2, w1 = w * Math.max(0.25, Math.abs(s1)) * tp(u1) / 2;
        const face = (s0 + s1) >= 0;
        c.beginPath(); c.moveTo(a[0] - cx + nx * w0, a[1] - cy + ny * w0); c.lineTo(b[0] - cx + nx * w1, b[1] - cy + ny * w1); c.lineTo(b[0] - cx - nx * w1, b[1] - cy - ny * w1); c.lineTo(a[0] - cx - nx * w0, a[1] - cy - ny * w0); c.closePath();
        c.fillStyle = face ? C.p : C.v1; c.fill();
        if (face && Math.abs(s0) > 0.55) { c.strokeStyle = C.blush; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0] - cx + nx * w0 * 0.6, a[1] - cy + ny * w0 * 0.6); c.lineTo(b[0] - cx + nx * w1 * 0.6, b[1] - cy + ny * w1 * 0.6); c.stroke(); }   // the lit edge, like a blade
      }
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  CR.ribbon = ribbon;
  const crack = (ctx, x, y, k) => { if (k < 0 || k >= 1) return; const L = Math.round(7 * (1 - k)); ctx.save(); ctx.globalAlpha = 1 - k; for (let i = 0; i < 4; i++) { const a = i * PI / 2 + 0.4; art.line(ctx, i % 2 ? C.blush : C.w, Math.round(x), Math.round(y), Math.round(x + Math.cos(a) * L), Math.round(y + Math.sin(a) * L), 1); } ctx.restore(); };
  function bellRing(ctx, x, y, k) {   // the beat: a bell-ring pulse at her feet, and notes rising
    if (k < 0 || k >= 1) return;
    ctx.save();
    for (let i = 0; i < 2; i++) { const r = 8 + (k + i * 0.35) * 30; ctx.globalAlpha = (1 - k) * (i ? 0.6 : 1); art.ring ? art.ring(ctx, i ? C.p2 : C.w, x, y, Math.round(r)) : null; }
    ctx.globalAlpha = 1 - k; note(ctx, x - 14, y - 16 - k * 14, C.p2); note(ctx, x + 10, y - 22 - k * 18, C.w);
    ctx.restore();
  }
  // a Vis that stays with her
  const onHer = (p, life, render, tick) => new Vis(p.x, p.y, life, render, v => { v.x = p.x; v.y = p.y; if (p.dead) v.gone = true; if (tick) tick(v); });
  // run a cast and learn whether it landed on the beat (its "ON BEAT!" pop)
  function castBeat(fn, self, args) {
    let on = false; const _tx = fx.text;
    fx.text = function (x, y, s) { if (/ON BEAT/.test(String(s))) on = true; return _tx.apply(this, arguments); };
    let r; try { r = fn.apply(self, args); } finally { fx.text = _tx; }
    return [r, on];
  }

  // ================= U: Ribbon Lash =================
  const _rl = CASTS.ribbon_lash;
  CASTS.ribbon_lash = function (p, z) {
    if (!isC(G)) return _rl.apply(this, arguments);
    const n0 = z.shots.length, [r, on] = castBeat(_rl, this, arguments), dir = p.face;
    const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 14 && s.render);
    if (v) v.render = (ctx, x, y, t) => {
      const k = t < 6 ? ease(t / 6) : 1 - (t - 6) / 8, px = Math.round(p.x - G.cam.x) + dir * 8, py = Math.round(p.y - G.cam.y) - 22, L = 96 * k, pts = [];
      for (let i = 0; i <= 14; i++) { const u = i / 14, amp = (t < 6 ? 7 : 2 + (t - 6)) * u; pts.push([px + dir * L * u, py + Math.sin(u * 8 - t * 0.9) * amp - (t < 6 ? (1 - u) * 0 : 0)]); }
      ribbon(ctx, pts, 6, t * 0.5, { tip: true });
      if (t >= 5 && t < 9) crack(ctx, px + dir * L, py, (t - 5) / 4);   // taut at full reach: it cracks
    };
    if (on) z.shots.push(onHer(p, 18, (ctx, sx, sy, t) => bellRing(ctx, sx, sy - 2, t / 18)));
    return r;
  };

  // ================= S+U: Pirouette: two ribbons spiral round her =================
  const _pi = CASTS.pirouette;
  CASTS.pirouette = function (p, z) {
    if (!isC(G)) return _pi.apply(this, arguments);
    const n0 = z.shots.length, [r, on] = castBeat(_pi, this, arguments), drv = z.shots.slice(n0).find(s => s.p === p && s.step);
    z.shots.push(onHer(p, 24, (ctx, sx, sy, t) => {
      const fade = drv && drv.gone ? Math.max(0, 1 - (t - (drv.endT || t)) / 4) : 1;
      for (let j = 0; j < 2; j++) {
        const pts = [];
        for (let i = 0; i < 16; i++) { const a = t * 0.9 + i * 0.5 + j * PI; pts.push([sx + Math.cos(a) * (8 + i * 0.9), sy - 2 - i * 2.4 + Math.sin(a) * 2]); }
        ribbon(ctx, pts, 5, t * 0.7 + j * 2, { a: fade, taper: 0 });
      }
      if (on && t < 16) bellRing(ctx, sx, sy - 2, t / 16);
    }, vv => { if (drv && drv.gone && !drv.endT) drv.endT = vv.t; if (drv && drv.gone && vv.t - drv.endT > 4) vv.gone = true; }));
    return r;
  };

  // ================= I: Grand Jete: a ribbon traces the leap; she lands in a burst of ribbons =================
  const _gj = CASTS.grand_jete;
  CASTS.grand_jete = function (p, z) {
    if (!isC(G)) return _gj.apply(this, arguments);
    const n0 = z.shots.length, [r, on] = castBeat(_gj, this, arguments), drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face, trail = [];
    let land = -1, lx = 0, ly = 0;
    z.shots.push(onHer(p, 70, (ctx, sx, sy, t) => {
      const cam = G.cam;
      if (trail.length > 2) { const pts = trail.slice(-16).map(q => [q[0] - cam.x, q[1] - cam.y]); ribbon(ctx, pts, 7, t * 0.4, { a: land < 0 ? 1 : Math.max(0, 1 - (t - land) / 8), taper: 1 }); }
      if (land >= 0) {   // the landing: ribbons burst out like petals, already open on the hit frame
        const k = (t - land) / 22, x = Math.round(lx - cam.x), y = Math.round(ly - cam.y) - 6;
        for (let i = 0; i < 8; i++) {
          const a = -PI / 2 + (i - 3.5) * 0.42, L = 26 + ease(0.4 + k) * 34, pts = [];
          for (let j = 0; j <= 8; j++) { const u = j / 8, aa = a + Math.sin(u * 3 + i) * 0.3 * u; pts.push([x + Math.cos(aa) * L * u, y + Math.sin(aa) * L * u * 0.8]); }
          ribbon(ctx, pts, 5, i + t * 0.5, { a: 1 - ease((k - 0.5) / 0.5) });
        }
      }
      if (on && t < 16) bellRing(ctx, sx, sy - 2, t / 16);
    }, vv => {
      if (land < 0) { trail.push([p.x - dir * 6, p.y - 20]); if (!drv || drv.gone || vv.t > 42) { land = vv.t; lx = p.x; ly = p.y; vv.life = vv.t + 22; } }
    }));
    return r;
  };

  // ================= S+I: Crescendo: four rings of looped ribbon, notes on them =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.coda;
  if (BU && BU.cast) {
    const _cr = BU.cast;
    BU.cast = function (p, z) {
      if (!isC(G)) return _cr.apply(this, arguments);
      const [r, on] = castBeat(_cr, this, arguments);
      z.shots.push(onHer(p, 46, (ctx, sx, sy, t) => {
        for (let k = 0; k < 4; k++) {
          const s = 1 + k * 10, q = (t - s) / 12; if (q < 0 || q >= 1) continue;
          const R = (40 + k * 22) * ease(Math.min(1, 0.35 + q * 1.3)), cy = sy - 18, pts = [];
          for (let i = 0; i <= 28; i++) { const a = i / 28 * PI * 2 + k; pts.push([sx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.42]); }
          ribbon(ctx, pts, 4 + k, t * 0.3 + k, { a: 1 - ease((q - 0.55) / 0.45), taper: 0, tip: false });
          for (let i = 0; i < 3; i++) { const a = i / 3 * PI * 2 + t * 0.08 + k; note(ctx, sx + Math.cos(a) * R - 2, cy + Math.sin(a) * R * 0.42 - 10, k % 2 ? C.blush : C.w); }
        }
        if (on && t < 16) bellRing(ctx, sx, sy - 2, t / 16);
      }));
      return r;
    };
  }

  // ================= W+O: Spotlight: a stage lamp, a cone of light, dust in it =================
  function cone(ctx, x, y, a, t, burst) {
    if (a <= 0) return;
    const top = Math.max(-40, y - 170), h = y - top;
    ctx.save();
    for (let yy = 0; yy < h; yy += 2) {   // the cone, in crisp rows: narrow at the lamp, wide at the floor
      const u = yy / h, hw = Math.round(5 + u * 22);
      ctx.globalAlpha = a * (0.1 + u * 0.16);
      art.rect(ctx, C.blush, x - hw, top + yy, hw * 2, 2);
      ctx.globalAlpha = a * (0.08 + u * 0.1);
      art.rect(ctx, C.w, x - Math.round(hw * 0.45), top + yy, Math.round(hw * 0.9), 2);
    }
    ctx.globalAlpha = a * 0.55; art.rect(ctx, C.blush, x - 26, y - 2, 52, 3); ctx.globalAlpha = a * 0.8; art.rect(ctx, C.w, x - 16, y - 1, 32, 2);   // the pool at the feet
    ctx.globalAlpha = a;
    for (let i = 0; i < 9; i++) { const u = ((i * 0.37 + t * 0.006) % 1), xx = x + Math.sin(i * 5.1 + t * 0.03) * (5 + u * 18), yy = top + u * h; art.rect(ctx, C.w, Math.round(xx), Math.round(yy), 1, 1); }   // dust in the light
    art.rect(ctx, C.out, x - 7, top - 6, 14, 6); art.rect(ctx, C.v0, x - 6, top - 5, 12, 4); art.rect(ctx, C.w, x - 4, top - 1, 8, 2);   // the lamp
    if (burst > 0 && burst < 1) { ctx.globalAlpha = 1 - burst; for (let i = 0; i < 10; i++) { const ang = i / 10 * PI * 2, L = 10 + burst * 40; art.line(ctx, i % 2 ? C.p2 : C.w, x, y - 20, Math.round(x + Math.cos(ang) * L), Math.round(y - 20 + Math.sin(ang) * L), 1); } }
    ctx.restore();
  }
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.coda;
  if (SIG && SIG.cast) {
    const _sl = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _sl.apply(this, arguments);
      if (!isC(G)) return r;
      const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 50 && s.render);
      if (v) v.render = (ctx, x, y, t) => { const a = Math.min(1, t / 4) * (t > 42 ? (50 - t) / 8 : 1); cone(ctx, x, y, a, t, t >= 40 ? (t - 40) / 8 : 0); };
      return r;
    };
  }

  // ================= her combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), reach = a.box ? a.box[0] + a.box[2] : 28;
      if (a.fin && k >= -2 && k < 12) {   // the finisher: a ribbon pulled taut, and it snaps like a cut string
        const hx = sx + d * 8, L = 70;
        if (k < 2) { const pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([hx + d * L * u * ease((k + 3) / 4), hy + Math.sin(u * PI) * (k < 0 ? 4 : 0)]); } ribbon(ctx, pts, 4, 0.3, { taper: 0 }); }
        else {
          const q = (k - 2) / 10;
          for (const half of [0, 1]) { const pts = []; for (let i = 0; i <= 6; i++) { const u = i / 6, base = half ? L / 2 + u * L / 2 : u * L / 2, curl = (half ? u : 1 - u) * q * 18; pts.push([hx + d * (base + (half ? 1 : -1) * q * 10), hy + curl + Math.sin(u * 4 + k) * curl * 0.3]); } ribbon(ctx, pts, 4, 0.3 + half, { a: 1 - ease((q - 0.5) / 0.5), taper: 0 }); }
          crack(ctx, hx + d * L / 2, hy, q * 2.5);
        }
      } else if (!a.fin && k >= -1 && k < 6) {   // every other hit: a ribbon lashes through it
        const q = ease((k + 1) / 4), pts = [];
        for (let i = 0; i <= 9; i++) { const u = i / 9, ang = (-0.9 + q * 1.6) * u; pts.push([sx + d * (6 + Math.cos(ang) * reach * u * 1.1), hy - 6 + Math.sin(ang) * reach * u * 0.6]); }
        ribbon(ctx, pts, 4, p.t * 0.3, { a: k < 3 ? 1 : 1 - (k - 3) / 3 });
      }
    }
    if (p.modeT > 0) {   // Allegro: a metronome ring at her feet on the beat; two short ribbons trailing
      const fade = Math.min(1, p.modeT / 30), bk = SW.frame % BEAT, on = bk <= 6 || bk >= BEAT - 4, r = on ? 15 : 12;
      ctx.save(); ctx.globalAlpha = fade * (on ? 1 : 0.5);
      for (let i = 0; i < 24; i++) { const ang = i / 24 * PI * 2; art.rect(ctx, on ? C.w : C.p, Math.round(sx + Math.cos(ang) * r), Math.round(sy + Math.sin(ang) * 3), 1, 1); }
      ctx.restore();
      for (const o of [-1, 1]) { const pts = []; for (let i = 0; i <= 5; i++) { const u = i / 5; pts.push([sx + o * 4 - d * u * 12, sy - 20 + Math.sin(p.t * 0.3 + u * 3 + o) * 2 * u + u * 3]); } ribbon(ctx, pts, 3, p.t * 0.2 + o, { a: fade, taper: 0 }); }
    }
    if (p.awakeT > 0) {   // Prima: the cut ends of Pell's strings hang from her wrists; a few petals fall
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = 0.9 * fade;
      for (const o of [-5, 5]) { let x = sx + o, y = sy - 20; for (let i = 0; i < 12; i++) { const nx = x + Math.sin(p.t * 0.08 + i * 0.4 + o) * 0.6; art.rect(ctx, C.w, Math.round(nx), Math.round(y + i), 1, 1); x = nx; } art.rect(ctx, C.blush, Math.round(x) - 1, Math.round(y + 12), 1, 1); art.rect(ctx, C.blush, Math.round(x) + 1, Math.round(y + 12), 1, 1); }   // the frayed ends
      for (let i = 0; i < 3; i++) { const u = ((p.t * 0.01 + i * 0.33) % 1), x = sx + Math.sin(i * 3.1 + p.t * 0.04) * 14; art.rect(ctx, i % 2 ? C.p2 : C.p, Math.round(x), Math.round(sy - 44 + u * 44), 2, 1); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isC(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: Finale =================
  function curtain(ctx, x0, x1, top, bot, side, t, mono) {   // a velvet stage curtain from x0 to x1: folds, a gold valance and fringe
    const SH = ['#3a0410', '#6a0a20', '#9a1636', '#c42a50'];
    if (x1 - x0 < 1) return;
    for (let x = Math.round(x0); x < Math.round(x1); x += 2) {
      const f = Math.sin((x - x0) * 0.32 + side * 1.3), sh = mono ? '#ffffff' : SH[Math.max(0, Math.min(3, Math.round((f + 1) * 1.6)))];
      const hem = bot + Math.round(Math.sin(x * 0.28) * 2);
      art.rect(ctx, sh, x, top, 2, hem - top);
      if (!mono) { art.rect(ctx, (x / 2) % 2 ? '#d4a017' : '#8a6410', x, hem - 2, 2, 3); if ((x / 2) % 3 === 0) art.rect(ctx, '#ffd166', x, hem + 1, 1, 2); }   // the gold fringe
    }
    if (!mono) { art.rect(ctx, '#8a6410', Math.round(x0), top, Math.round(x1 - x0), 5); art.rect(ctx, '#d4a017', Math.round(x0), top + 1, Math.round(x1 - x0), 2); }   // the valance
  }
  const _ult = N.ULT.finale;
  if (_ult) N.ULT.finale = function (p, z, foes) {
    const r = _ult.apply(this, arguments);
    if (!isC(G)) return r;
    if (p.st === 6) {
      const spot = onHer(p, 66, (ctx, sx, sy, t) => { if (p.state !== 'ult') return; cone(ctx, sx, sy, Math.min(1, t / 6) * (t > 56 ? (66 - t) / 10 : 1), t, 0); });   // the spotlight finds her
      spot._ugS = 1; z.shots.push(spot);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    if (p.st >= 12 && p.st <= 52 && (p.st - 12) % 8 === 0) {   // on every beat of it, a ribbon slices across each foe
      foes.forEach((e, i) => {
        if (!e || e.dead) return;
        const b = e.box(), cx = b.x + b.w / 2, cy = b.y + b.h / 2, s = (p.st / 8 + i) % 2 ? 1 : -1;
        const v = new Vis(cx, cy, 10, (ctx, x, y, t) => { const k = t / 10, pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10; pts.push([x - s * 40 + s * 80 * Math.min(1, u * 1.4 * ease(k * 2 + 0.3)), y - 16 + u * 30 + Math.sin(u * 5 + t) * 3]); } ribbon(ctx, pts, 5, t * 0.6, { a: 1 - ease((k - 0.5) / 0.5) }); });
        v._ugS = 1; z.shots.push(v);
      });
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the curtains sweep in from both sides of the target and slam shut on an impact
  // frame; then they lift
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('coda') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 22) return;
      const top = sy - 96, bot = sy + 4, span = 90;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2)), gap = span * (1 - k * 0.82);
        curtain(ctx, sx - gap - span, sx - gap, top, bot, -1, st);
        curtain(ctx, sx + gap, sx + gap + span, top, bot, 1, st);
        if (st > FIN - 8) { ctx.save(); ctx.globalAlpha = 0.5; art.rect(ctx, '#ffe0f3', sx - gap, top, Math.round(gap * 2), bot - top); ctx.restore(); }   // the last light between them
      } else {
        const k = (st - FIN) / 22, ik = (st - FIN) / 5, lift = ease((k - 0.35) / 0.65) * 110, mono = ik < 0.5;
        if (ik < 1) PX.impact(ctx, sx, sy - 30, ik, 51);
        curtain(ctx, sx - span, sx + 1, top - lift, bot - lift, -1, st, mono);
        curtain(ctx, sx - 1, sx + span, top - lift, bot - lift, 1, st, mono);
        if (st === FIN) for (let i = 0; i < 20; i++) part(T.x + rand(-30, 30), T.y - rand(0, 50), i % 2 ? '#f15bb5' : '#ffd166', rand(-3, 3), -rand(0, 3), 26, 2, 0.12);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
