'use strict';
// Shattered Worlds — Maren's tide (2026-11-20, the hero-look rework: cool, not cute). Her story: Subject 21, the tide
// doctor who takes and gives - what she takes out of them she puts back into herself; a whip of sea water curling round
// her arm; teal water, a soft green healing glow. Her water was wavy strips, flat bars and stacked columns. Now it
// moves like the sea: a whip that curls and throws foam, waves with a real face - deep water at the foot, a curl at the
// lip, a foam crest - light caustics in clear water, and the green of mending in every drop she takes back. Crisp
// pixel art. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/ferra-scrap.js.
//   U      Brine Lash: a curling whip of sea water with foam at its tip
//   S+U    Tide Pool: a pool with ripples and caustic light; green motes rise to her when she stands in it
//   I      Undertow: a wave that curls over and drags back, drag lines pulling toward her
//   S+I    Brine Bubble: a clear ball of sea water with light moving in it; it bursts into green mending drops
//   W+O    Tidal Wave: a curling wave face with a foam crest rolling forward
//   J      every blow throws a curl of water and spray
//   S+O    High Tide: water rising round her ankles, a tide line glowing      O  Deep Form: a ribbon of sea water
//          circling her, pulsing green (both small on purpose: the view stays clear)
//   W+I    Spring Tide: each of the four surges is a real wave rolling across the arena; on the finishing blow
//          (js/ult-grand.js) the sea rises behind the target and a great wave breaks over it on an impact frame
// SW.marenTide.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.brine_lash || !CASTS.tide_pool) return;
  const MT = SW.marenTide = { on: true };
  const isM = g => !!(MT.on && g && g.state && g.state.hero === 'maren');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#06222a', deep: '#0e4a54', d2: '#13606a', w: '#2a9d8f', w2: '#4fd1c5', lt: '#9ef0e4', foam: '#e8fffa', wh: '#ffffff', heal: '#7dffa0', heal2: '#c8ffd8' };

  // a wave with a real face, its foot at (x, y), rolling toward d; h tall, len long, k 0..1 how far it has risen
  function wave(ctx, x, y, d, len, h, t, a) {
    len *= 1.25; h *= 1.3;   // (2026-11-20 look ranking: the waves read flat)
    if (a <= 0 || h < 2) return;
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    for (let i = 0; i <= len; i += 2) {
      const u = i / len, hh = R(h * Math.pow(u, 1.4) * (0.92 + 0.08 * Math.sin(t * 0.4 + i * 0.3))), xx = R(x - d * (len - i));
      if (hh < 1) continue;
      art.rect(ctx, C.out, xx, y - hh - 1, 2, hh + 1);
      art.rect(ctx, C.deep, xx, y - R(hh * 0.35), 2, R(hh * 0.35));
      art.rect(ctx, C.w, xx, y - R(hh * 0.8), 2, R(hh * 0.45));
      art.rect(ctx, C.w2, xx, y - hh, 2, R(hh * 0.22) + 1);
      art.rect(ctx, (i + R(t)) % 6 < 3 ? C.foam : C.lt, xx, y - hh - 1, 2, 2);   // the crest
      if ((i + R(t * 2)) % 10 === 0 && hh > 8) art.rect(ctx, C.lt, xx, y - R(hh * 0.6), 2, 1);   // caustic light in the face
    }
    // the lip curling over toward d
    const lx = x, ly = y - h;
    for (let j = 0; j < 7; j++) { const an = -PI / 2 + j * 0.42, r = h * 0.28; art.rect(ctx, j < 4 ? C.foam : C.w2, R(lx + d * (Math.cos(an) * r + r * 0.2)), R(ly + r + Math.sin(an) * r), 3, 3); }
    for (let j = 0; j < 4; j++) art.rect(ctx, C.wh, R(lx + d * (4 + j * 3 + Math.sin(t + j) * 2)), R(ly + 2 + j * 3), 1, 1);   // spray off it
    ctx.restore();
  }
  MT.wave = wave;
  function caustics(ctx, x, y, rx, ry, t, a) {   // moving light inside clear water
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    for (let i = 0; i < 6; i++) { const ph = t * 0.08 + i * 1.7, cx = x + Math.cos(ph) * rx * 0.55, cy = y + Math.sin(ph * 1.3) * ry * 0.5; art.line(ctx, C.lt, R(cx - 3), R(cy), R(cx + 2), R(cy - 2), 1); art.line(ctx, C.lt, R(cx + 2), R(cy - 2), R(cx + 4), R(cy + 1), 1); }
    ctx.restore();
  }
  function drop(ctx, x, y, col, a) { ctx.save(); ctx.globalAlpha *= clamp01(a); art.rect(ctx, C.out, R(x) - 1, R(y) - 2, 4, 5); art.rect(ctx, col, R(x), R(y) - 1, 2, 3); art.rect(ctx, C.wh, R(x), R(y) - 1, 1, 1); ctx.restore(); }

  // ================= U: Brine Lash: a curling whip of sea water =================
  function dressLash(z, n0) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.maren || s.w !== 24 || s.h !== 12 || s.life !== 13) return;
      s.maren = 1; const x0 = s.x, y0 = s.y;
      s.render = (ctx, x, y, q) => {
        const d = Math.sign(q.vx) || 1, t = q.t || 0, sx = x - (q.x - x0), sy = y - (q.y - y0), L = Math.abs(x - sx);
        let px = sx, py = sy;
        for (let i = 1; i <= 12; i++) { const u = i / 12, nx = sx + (x - sx) * u, ny = sy + (y - sy) * u + Math.sin(u * PI * 2 + t * 1.2) * 5 * (1 - u * 0.4); art.line(ctx, C.out, R(px), R(py), R(nx), R(ny), 5); art.line(ctx, i > 9 ? C.w2 : C.w, R(px), R(py), R(nx), R(ny), 3); art.line(ctx, C.lt, R(px), R(py) - 1, R(nx), R(ny) - 1, 1); px = nx; py = ny; }
        for (let j = 0; j < 5; j++) { const an = j * 1.3 + t, r = 3 + (j % 2) * 2; art.rect(ctx, j % 2 ? C.foam : C.wh, R(x + d * 2 + Math.cos(an) * r), R(y + Math.sin(an) * r), 2, 2); }   // foam at the tip
        void L;
      };
    });
  }
  const _bl = CASTS.brine_lash;
  CASTS.brine_lash = function (p, z) { const n0 = z.shots.length, r = _bl.apply(this, arguments); if (isM(G)) dressLash(z, n0); return r; };

  // ================= S+U: Tide Pool =================
  const _tp = CASTS.tide_pool;
  CASTS.tide_pool = function (p, z) {
    const n0 = z.shots.length, r = _tp.apply(this, arguments);
    if (!isM(G)) return r;
    const pool = z.shots.slice(n0).find(s => s && s.isPool);
    if (pool) pool.render = (ctx, x, y, t) => {
      const k = t < 10 ? t / 10 : t > 280 ? (300 - t) / 20 : 1, w = R(46 * k);
      if (w < 2) return;
      ctx.save();
      ctx.globalAlpha = 0.85; art.rect(ctx, C.out, x - w - 1, y - 4, w * 2 + 2, 5); art.rect(ctx, C.deep, x - w, y - 3, w * 2, 3); art.rect(ctx, C.w, x - w + 2, y - 3, w * 2 - 4, 1);
      for (let i = 0; i < 2; i++) { const q = ((t * 0.02 + i * 0.5) % 1), rr = q * w; ctx.globalAlpha = 0.8 * (1 - q); for (let j = 0; j < 16; j++) { const an = j / 16 * PI * 2; art.rect(ctx, C.foam, R(x + Math.cos(an) * rr), R(y - 2 + Math.sin(an) * rr * 0.12), 1, 1); } }   // ripples
      ctx.restore();
      caustics(ctx, x, y - 2, w, 2, t, 0.8 * k);
      if (!p.dead && Math.abs(p.x - (pool.x || x)) < 48 && Math.abs(p.y - pool.y) < 8 && t % 6 === 0) part(p.x + rand(-10, 10), p.y - rand(2, 10), C.heal, 0, -rand(0.6, 1.2), 22, 2, -0.01);   // green motes rising to her
    };
    return r;
  };

  // ================= I: Undertow: a wave that curls and drags back =================
  function dressUndertow(z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.maren || s.w !== 26 || s.h !== 32 || s.life !== 30 || !s.ghost) return;
      s.maren = 1; const x0 = s.x;
      s.render = (ctx, x, y, q) => {
        const d = Math.sign(q.vx) || 1, t = q.t || 0, gy = y + 16, back = Math.min(40, Math.abs(q.x - x0));
        wave(ctx, x + d * 6, gy, d, 30, 30, t, 1);
        ctx.save(); ctx.globalAlpha *= 0.8; for (let i = 0; i < 3; i++) { const yy = gy - 4 - i * 6, len = 10 + ((t * 3 + i * 7) % back || 0); art.line(ctx, C.lt, R(x - d * 26), yy, R(x - d * (26 + len)), yy + 1, 1); } ctx.restore();   // drag lines pulling back toward her
      };
    });
  }

  // ================= S+I: Brine Bubble =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.maren;
  if (BU && BU.cast) {
    const _bb = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _bb.apply(this, arguments);
      if (!isM(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s || s.life !== 60 || typeof s.render !== 'function' || s.maren) return;   // (js/moves.js has a Vis class of its own: matched by shape)
        s.maren = 1;
        s.render = (ctx, x, y, t) => {
          t = typeof t === 'number' ? t : (s.t || 0);
          const rr = 20 + Math.sin(t * 0.3) * 2;
          if (t < 56) {
            ctx.save(); ctx.globalAlpha = 0.35; art.disc(ctx, C.w, x, y, R(rr)); ctx.globalAlpha = 0.25; art.disc(ctx, C.deep, x, y + 3, R(rr * 0.7)); ctx.restore();
            caustics(ctx, x, y, rr, rr, t, 0.9);
            for (let j = 0; j < 28; j++) { const an = j / 28 * PI * 2, wob = Math.sin(an * 3 + t * 0.4) * 1.2; art.rect(ctx, an > PI * 1.1 && an < PI * 1.6 ? C.wh : C.lt, R(x + Math.cos(an) * (rr + wob)), R(y + Math.sin(an) * (rr + wob)), 1, 1); }   // the skin of the bubble
            art.rect(ctx, C.wh, R(x - rr * 0.45), R(y - rr * 0.5), 3, 2);
            for (let j = 0; j < 3; j++) { const ph = ((t * 0.04 + j / 3) % 1); art.rect(ctx, C.foam, R(x - 6 + j * 6), R(y + rr * 0.6 - ph * rr * 1.2), 1, 1); }   // bubbles rising in it
          } else { const u = (t - 56) / 4; for (let j = 0; j < 12; j++) { const an = j / 12 * PI * 2, d2 = rr + u * 20; drop(ctx, x + Math.cos(an) * d2, y + Math.sin(an) * d2, j % 2 ? C.heal : C.w2, 1 - u * 0.5); } }
        };
        const _tk = s.tick || s.update;
        void _tk;
      });
      return r;
    };
  }

  // ================= W+O: Tidal Wave =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.maren;
  if (SIG && SIG.cast) {
    const _tw = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _tw.apply(this, arguments);
      if (!isM(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint || s.maren || s.life !== 34) return;
        s.maren = 1;
        s.paint = (ctx, x, y, q) => { const k = Math.min(1, q.t / 6), a = Math.min(1, (34 - q.t) / 8); wave(ctx, x + q.dir * 14, y, q.dir, 36, 42 * k, q.t, a); };
      });
      return r;
    };
  }

  // ================= J: a curl of water and spray =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (col !== '#b8fff0' || !isM(g) || !p || !z || !z.shots || (p.state !== 'attack' && p.state !== 'airatk')) return _slash.apply(this, arguments);
    const d = dir || p.face, a = p.atk, fin = !!(a && a.fin), Rr = Math.max(12, Math.min(26, (len || 22) * 0.75)), life = fin ? 14 : 10;
    z.shots.push(new Vis(x, y, life, (ctx, sx, sy, t) => {
      const k = t / life, sw = ease(Math.min(1, k * 3)), al = 1 - ease((k - 0.45) / 0.55);
      ctx.save(); ctx.globalAlpha *= al;
      const n = 10; let px, py;
      for (let i = 0; i <= n; i++) { const u = i / n; if (u > sw) break; const an = (d > 0 ? -1.1 : PI + 1.1) + d * 2.2 * u, rr = Rr - u * 3, nx = sx - d * Rr * 0.3 + Math.cos(an) * rr, ny = sy + Math.sin(an) * rr; if (i) { art.line(ctx, C.out, R(px), R(py), R(nx), R(ny), fin ? 6 : 5); art.line(ctx, C.w, R(px), R(py), R(nx), R(ny), fin ? 4 : 3); art.line(ctx, C.lt, R(px), R(py) - 1, R(nx), R(ny) - 1, 1); } px = nx; py = ny; }
      ctx.restore();
      for (let j = 0; j < (fin ? 6 : 3); j++) drop(ctx, sx + d * (Rr * 0.6 + k * (8 + j * 5)), sy - 6 + j * 4 - Math.sin(k * PI) * 6, j % 2 ? C.foam : C.w2, al);
    }));
  };

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const t = p.t || SW.frame;
    if (!behind && p.modeT > 0) {   // High Tide: water round her ankles, a tide line glowing
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade * 0.75;
      for (let i = -12; i <= 12; i += 2) { const hh = 3 + Math.round(Math.sin(t * 0.15 + i * 0.4) * 1.2); art.rect(ctx, C.w, sx + i, sy - hh, 2, hh); art.rect(ctx, C.foam, sx + i, sy - hh, 2, 1); }
      ctx.restore();
    }
    if (p.awakeT > 0) {   // Deep Form: a ribbon of sea water circling her, pulsing green
      const fade = Math.min(1, p.awakeT / 30), pulse = (t % 60) < 8;
      ctx.save(); ctx.globalAlpha *= fade;
      for (let i = 0; i < 22; i++) { const an = t * 0.08 + i * 0.16, s = Math.sin(an); if ((s < 0) !== behind) continue; art.rect(ctx, pulse ? C.heal : i % 3 ? C.w : C.lt, R(sx + Math.cos(an) * 16), R(sy - 22 + s * 4 + Math.sin(an * 2) * 3), 2, 2); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isM(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isM(g || this.G) && z && z.shots) dressUndertow(z); return r; };

  // ================= W+I: Spring Tide =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isM(g) || !z || !z.shots) return r;
    if (p.st >= 12 && p.st <= 54 && (p.st - 12) % 14 === 0) {   // each surge: a real wave rolling across the arena
      const d = ((p.st - 12) / 14) % 2 ? -1 : 1, gy = p.y;
      const v = new Vis(0, 0, 26, (ctx, x, y, t) => { const k = t / 26, fx0 = d > 0 ? -40 + (W + 80) * k : W + 40 - (W + 80) * k; wave(ctx, R(fx0), R(gy - G.cam.y), d, 90, 46, t + p.st, 1 - ease((k - 0.8) / 0.2)); });
      v.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      v._ugS = 1; z.shots.push(v);
    }
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('maren') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the sea rises behind the target and a great wave breaks over it
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const d = T.x >= p.x ? 1 : -1;   // the wave comes from her side and rears over them
      if (st < FIN) { const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2)); wave(ctx, sx - d * 30, sy, d, 70, 12 + k * 30, st + 7, 0.7 * Math.min(1, k * 3)); wave(ctx, sx + d * (14 - 10 * k), sy, d, 90, 24 + k * 56, st, Math.min(1, k * 3)); }   // a swell behind, and the great wave rearing over them
      else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 26, ik, 73);
        wave(ctx, sx + d * k * 30, sy, d, 90, 80 * (1 - k * 0.8), st, 1 - ease((k - 0.6) / 0.4));
        for (let j = 0; j < 14; j++) { const an = PI + j / 13 * PI, rr = 10 + k * 50; drop(ctx, sx + Math.cos(an) * rr, sy - 26 + Math.sin(an) * rr * 0.7 + k * k * 30, j % 3 === 0 ? C.heal : j % 2 ? C.foam : C.w2, 1 - k); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
