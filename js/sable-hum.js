'use strict';
// Shattered Worlds — Sable's hum (2026-11-20, the hero-look rework: cool, not cute). Her story: the Thunder Hand, "quiet,
// until the air starts to hum"; a reversed knife and a scarf over her mouth; violet static. Her kunai was a grey bar and
// her lightning plain bolt lines like everyone's. Now: a reverse-grip kunai with a ring pommel, crackling; the hum before
// every strike - rings of pressure that ripple out and tighten - so you can see it coming; a small thundercloud of her
// own for Storm Call; her stored static as beads of light. Crisp pixel art through js/pixel-kit.js; bolts stay bolts,
// they are the move. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/rook-crowd.js.
//   U      Spark Kunai: a reverse-grip kunai, sparks crawling on it; a beat later a spark pops on the target
//   S+U    Flash Step: a violet line with fading silhouettes along it, the hum closing at its end
//   I      Thunder Pierce: her hand fills with crackling violet light and a hum ring tightens; then the lunge rakes
//          sparks off the floor
//   S+I    Storm Call: a small violet thundercloud gathers over the target and hums before each of its three bolts;
//          the last leaves a static cage
//   W+O    Static Rain: a hum ripple marks each needle's spot just before it lands
//   J      the finisher: a kunai glint at the arc's head
//   S+O    Storm Hum: the air ripples round her in hum lines, static lifts specks off her
//   O      Thunder Heart: her stored static circles her chest as beads of light (small on purpose)
//   (trait) her static: five beads that light as she fills them, and flash when the discharge is ready
//   W+I    Thunderhead: the sky closes in violet cloud; on the finishing blow (js/ult-grand.js) the hum tightens round
//          the target, the cloud over it opens, and one great violet bolt comes down on an impact frame
// SW.sableHum.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.spark_kunai || !CASTS.thunder_pierce) return;
  const SH = SW.sableHum = { on: true };
  const isS = g => !!(SH.on && g && g.state && g.state.hero === 'sable');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0c0820', d: '#1a1040', m: '#3a2a6a', v0: '#6c5aff', v: '#8f7bff', v2: '#c8b8ff', pale: '#e6e0ff', w: '#ffffff', steel: '#8a92a8', steel2: '#c8ccd8' };
  const PAL = [C.out, C.d, C.m, C.v0, C.v, C.v2, C.pale, C.w, C.steel, C.steel2];

  // ---------- the kunai, point toward +x: (0, 0) its centre, s its length ----------
  function kunaiVec(c, s) {
    const u = s / 12;
    c.beginPath(); c.moveTo(6 * u, 0); c.lineTo(0, -1.6 * u); c.lineTo(-1 * u, 0); c.lineTo(0, 1.6 * u); c.closePath(); c.fillStyle = C.steel2; c.fill();   // the leaf blade
    c.beginPath(); c.moveTo(6 * u, 0); c.lineTo(0, -1.6 * u); c.lineTo(0, 0); c.closePath(); c.fillStyle = C.w; c.fill();
    c.fillStyle = C.m; c.fillRect(-4.5 * u, -0.7 * u, 3.6 * u, 1.4 * u);   // the wrapped grip
    c.fillStyle = C.v0; for (let i = 0; i < 3; i++) c.fillRect((-4.2 + i * 1.2) * u, -0.7 * u, Math.max(1, 0.5 * u), 1.4 * u);
    c.strokeStyle = C.steel; c.lineWidth = Math.max(1, 0.6 * u); c.beginPath(); c.arc(-5.8 * u, 0, 1.3 * u, 0, PI * 2); c.stroke();   // the ring pommel
  }
  function kunai(ctx, x, y, s, ang, o) {
    o = o || {};
    PX.sprite(ctx, x, y, s * 1.6, s * 1.6, c => { c.rotate(ang); kunaiVec(c, s); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  SH.kunai = kunai;
  function crackle(ctx, x, y, r, t, n) {   // little live arcs (1 px)
    ctx.save();
    for (let i = 0; i < (n || 2); i++) {
      const seed = Math.floor(t / 2) * 7 + i * 13, rr = k => { const v = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
      let px = x + (rr(1) - 0.5) * r * 2, py = y + (rr(2) - 0.5) * r * 2;
      for (let k = 0; k < 4; k++) { const nx = px + rr(3 + k) * 6 - 3, ny = py + rr(9 + k) * 6 - 3; art.line(ctx, i % 2 ? C.v2 : C.w, Math.round(px), Math.round(py), Math.round(nx), Math.round(ny), 1); px = nx; py = ny; }
    }
    ctx.restore();
  }
  function hum(ctx, x, y, k, R, n) {   // the hum: rings of pressure tightening toward the point (k 0 -> 1)
    if (k <= 0 || k >= 1) return;
    ctx.save();
    for (let i = 0; i < (n || 3); i++) {
      const q = (k + i / (n || 3)) % 1, r = Math.round(R * (1 - q) + 3);
      ctx.globalAlpha = 0.25 + 0.6 * q;
      const m = Math.max(10, Math.round(r * 2.4));
      for (let j = 0; j < m; j++) { const a = j / m * PI * 2; if (j % 3 === 2) continue; art.rect(ctx, q > 0.7 ? C.w : C.v2, Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 0.85), 1, 1); }
    }
    ctx.restore();
  }
  SH.hum = hum;
  function cloud(ctx, x, y, w, k, t) {   // a small violet thundercloud (screen point x, y its belly)
    if (k <= 0) return;
    PX.sprite(ctx, x, y - w * 0.3, w * 1.5, w * 0.9, c => {
      const lobes = [[-0.45, 0, 0.28], [-0.15, -0.12, 0.34], [0.2, -0.08, 0.32], [0.48, 0.02, 0.24], [0, 0.08, 0.36]];
      lobes.forEach(([lx, ly, r]) => { c.beginPath(); c.arc(lx * w, ly * w + w * 0.12, r * w * k, 0, PI * 2); c.fillStyle = C.m; c.fill(); });
      lobes.forEach(([lx, ly, r]) => { c.beginPath(); c.arc(lx * w - r * w * 0.2, ly * w + w * 0.12 - r * w * 0.25, r * w * 0.6 * k, 0, PI * 2); c.fillStyle = C.v0; c.fill(); });
      c.fillStyle = C.d; c.fillRect(-w * 0.6, w * 0.3, w * 1.2, Math.max(1, w * 0.06));
    }, { pal: PAL, alpha: clamp01(k * 1.5), outline: C.out, keepThin: true });
    if (t % 8 < 2) crackle(ctx, x, y - w * 0.1, w * 0.4, t, 1);
  }

  // ================= U: Spark Kunai =================
  function dressKunai(p, z, n0) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.sable || s.w !== 10 || s.h !== 6) return;
      s.sable = 1;
      s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1; kunai(ctx, x, y, 14, Math.atan2(q.vy, q.vx) + (d < 0 ? 0 : 0)); crackle(ctx, x, y, 5, q.t, 1); ctx.save(); ctx.globalAlpha = 0.5; art.line(ctx, C.v, Math.round(x - d * 8), y, Math.round(x - d * 18), y, 1); ctx.restore(); };
      const _end = s.onEnd;
      s.onEnd = function (g, zz, impact) {
        const r = _end ? _end.apply(this, arguments) : undefined;
        if (zz && zz.shots) this.hitSet.forEach(e => { if (!e || e.dead) return; const v = new Vis(e.x, e.y, 18, (ctx, sx, sy, t) => hum(ctx, sx, sy - (e.h || 30) / 2, t / 18, 16, 2), vv => { if (!e.dead) { vv.x = e.x; vv.y = e.y; } }); zz.shots.push(v); });   // the hum before the second spark pops
        return r;
      };
    });
  }
  const _sk = CASTS.spark_kunai;
  CASTS.spark_kunai = function (p, z) { const n0 = z.shots.length, r = _sk.apply(this, arguments); if (isS(G)) dressKunai(p, z, n0); return r; };

  // ================= S+U: Flash Step =================
  const _fs = CASTS.flash_step;
  if (_fs) CASTS.flash_step = function (p, z) {
    const x0 = p.x, r = _fs.apply(this, arguments);
    if (!isS(G)) return r;
    const x1 = p.x, y = p.y - 20, d = x1 >= x0 ? 1 : -1;
    z.shots.push(new Vis(x0, p.y, 14, (ctx, sx, sy, t) => {
      const k = t / 14, len = x1 - x0;
      ctx.save(); ctx.globalAlpha = 1 - k; art.line(ctx, C.v2, sx, sy - 20, Math.round(sx + len), sy - 20, 2); art.line(ctx, C.w, sx, sy - 21, Math.round(sx + len), sy - 21, 1); ctx.restore();
      hum(ctx, Math.round(sx + len + d * 10), sy - 20, 0.3 + k * 0.7, 18, 2);
    }));
    return r;
  };

  // ================= I: Thunder Pierce: the hand fills with light, the hum tightens =================
  const _tp = CASTS.thunder_pierce;
  CASTS.thunder_pierce = function (p, z) {
    const n0 = z.shots.length, r = _tp.apply(this, arguments);
    if (!isS(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face;
    z.shots.push(new Vis(p.x, p.y, 28, (ctx, sx, sy, t) => {
      if (drv && drv.gone && t > 2) return;
      const hx = sx + dir * 10, hy = sy - 22;
      if (t <= 11) { ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * (t % 2); art.disc(ctx, C.v, hx, hy, 3 + Math.round(t * 0.4)); art.disc(ctx, C.w, hx, hy, 2); ctx.restore(); crackle(ctx, hx, hy, 6, t, 2); hum(ctx, hx, hy, t / 11, 24, 3); }
      else { kunai(ctx, hx + dir * 6, hy, 16, dir > 0 ? 0 : PI); if (t % 2) for (let i = 0; i < 2; i++) part(p.x - dir * rand(6, 20), p.y - 1, i ? C.v2 : C.w, -dir * rand(1, 3), -rand(1, 3), 12, 1, 0.2); }   // sparks raked off the floor
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= S+I: Storm Call: her own thundercloud =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.sable;
  if (BU && BU.cast) {
    const _sc = BU.cast;
    BU.cast = function (p, z) {
      const e = isS(G) ? N.ahead(p, z, 260) : null, tx = e ? e.x : p.x + p.face * 100, r = _sc.apply(this, arguments);
      if (!isS(G)) return r;
      const gy = p.y;
      z.shots.push(new Vis(tx, gy, 70, (ctx, sx, sy, t) => {
        const k = ease(t / 10) * (t > 56 ? (70 - t) / 14 : 1), cy = sy - 96;
        cloud(ctx, sx, cy, 46, k, t);
        const next = [10, 22, 34].find(s => s >= t), hk = next !== undefined ? 1 - (next - t) / 8 : -1;
        if (hk > 0 && hk < 1) hum(ctx, sx, sy - 18, hk, 22, 3);   // the hum before each bolt
        if (t >= 34 && t < 64) {   // the static cage the last one leaves
          ctx.save(); ctx.globalAlpha = 0.85 * (1 - (t - 34) / 30);
          for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + t * 0.1, bx = Math.round(sx + Math.cos(a) * 14); art.line(ctx, i % 2 ? C.v2 : C.w, bx, sy - 44, bx, sy - 2, 1); }
          art.line(ctx, C.v2, sx - 15, sy - 44, sx + 15, sy - 44, 1);
          ctx.restore(); crackle(ctx, sx, sy - 24, 14, t, 2);
        }
      }, v => { if (e && !e.dead) v.x = e.x; }));
      return r;
    };
  }

  // ================= W+O: Static Rain: a hum marks each needle =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.sable;
  if (SIG && SIG.cast) {
    const _sr = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _sr.apply(this, arguments);
      if (!isS(G)) return r;
      for (let i = 0; i < 6; i++) { const x = p.x + p.face * (30 + i * 16), d0 = i * 4; z.shots.push(new Vis(x, p.y, d0 + 5, (ctx, sx, sy, t) => { const k = (t - d0 + 4) / 5; if (k > 0) hum(ctx, sx, sy - 4, k, 12, 2); })); }
      return r;
    };
  }

  // ================= the finisher (a lightning arc ahead): a kunai glint at its head =================
  function dressFin(p, z) {
    const a = p.atk;
    if (!a || !a.fin || p.st !== a.hitAt) return;
    const d = p.face, x1 = p.x + d * 84, y = p.y - 20;
    z.shots.push(new Vis(x1, y, 8, (ctx, sx, sy, t) => { kunai(ctx, sx - d * 4, sy, 14, d > 0 ? 0 : PI, { a: 1 - t / 8 }); if (t < 4) { ctx.save(); art.line(ctx, C.w, sx - 5, sy, sx + 5, sy, 1); art.line(ctx, C.w, sx, sy - 5, sx, sy + 5, 1); ctx.restore(); } }));
  }

  // ================= the small auras, and her static =================
  function aura(ctx, p, sx, sy) {
    const d = p.face;
    if (p.modeT > 0) {   // Storm Hum: the air ripples round her; static lifts specks off her
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha = fade * 0.7; for (let i = 0; i < 3; i++) { const k = ((p.t * 0.03 + i / 3) % 1), r = 10 + k * 12; ctx.globalAlpha = fade * 0.6 * (1 - k); for (let j = -3; j <= 3; j++) art.rect(ctx, C.v2, Math.round(sx + d * 0 + Math.cos(j * 0.35 - PI / 2) * r * 0.9), Math.round(sy - 18 + Math.sin(j * 0.35 - PI / 2) * r), 1, 1); } ctx.restore();
      if (p.t % 6 === 0) part(p.x + rand(-6, 6), p.y - rand(20, 34), C.v2, rand(-0.2, 0.2), -rand(0.3, 0.8), 14, 1, -0.02);
    }
    const n = p.stat || 0;
    if (p.awakeT > 0 && n) {   // Thunder Heart: her stored static circles her chest
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < n; i++) { const a = p.t * 0.12 + i / 5 * PI * 2, x = Math.round(sx + Math.cos(a) * 9), y = Math.round(sy - 20 + Math.sin(a) * 3); art.rect(ctx, n >= 5 ? C.w : C.v2, x, y, 2, 2); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isS(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isS(g || this.G) && z && z.shots) dressFin(this, z); return r; };
  const TR = N.TRAITS && N.TRAITS.static;
  if (TR && TR.mark) {   // her static: five beads of light, flashing white when the discharge is ready
    const _mk = TR.mark;
    TR.mark = function (ctx, p, x, y) {
      if (!SH.on) return _mk.apply(this, arguments);
      const n = p.stat || 0; if (!n) return;
      for (let i = 0; i < 5; i++) { const bx = x - 10 + i * 5, by = y - 50, on = i < n, full = n >= 5 && SW.frame % 8 < 4; art.rect(ctx, C.out, bx - 1, by - 1, 4, 4); art.rect(ctx, on ? (full ? C.w : C.v) : C.d, bx, by, 2, 2); if (on) art.rect(ctx, C.pale, bx, by, 1, 1); }
    };
  }

  // ================= W+I: Thunderhead =================
  const _th = N.ULT && N.ULT.thunderhead;
  if (_th) N.ULT.thunderhead = function (p, z, foes) {
    const r = _th.apply(this, arguments);
    if (!isS(G)) return r;
    if (p.st === 6) {
      const sky = new Vis(0, 0, 60, (ctx, x, y, t) => {   // (screen space) the sky closes in violet cloud
        const k = Math.min(1, t / 12, (60 - t) / 8);
        ctx.save(); ctx.globalAlpha = 0.4 * k; ctx.fillStyle = C.d; ctx.fillRect(0, 0, W, H); ctx.restore();
        for (let i = 0; i < 6; i++) cloud(ctx, 40 + i * 82 + Math.sin(t * 0.03 + i) * 6, 30 + (i % 2) * 10, 70, k, t + i * 3);
      });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the hum tightens round the target, the cloud over it opens, and one great
  // violet bolt comes down on an impact frame
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('sable') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 22;
      if (st < FIN) {
        const k = (st - (BU2 - 2)) / (FIN - BU2 + 2);
        cloud(ctx, sx, sy - 46, 48, ease(k * 2), st);
        hum(ctx, sx, cy, (k * 3) % 1, 34 - k * 16, 3);
        if (st % 4 < 2) crackle(ctx, sx, cy, 16, st, 2);
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 53);
        if (k < 0.5) {   // the great bolt: a thick violet trunk with a white core, from the cloud to the ground
          ctx.save(); ctx.globalAlpha = 1 - k * 2;
          let x = sx; const y0 = sy - 50;
          for (let y = y0; y < sy; y += 8) { const nx = sx + Math.round(Math.sin(y * 0.5 + st) * 5); art.line(ctx, C.v, x, y, nx, y + 8, 7); art.line(ctx, C.pale, x, y, nx, y + 8, 3); art.line(ctx, C.w, x, y, nx, y + 8, 1); x = nx; }
          ctx.restore();
        }
        cloud(ctx, sx, sy - 46, 48, 1 - k, st);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult') return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
