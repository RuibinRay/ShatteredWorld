'use strict';
// Shattered Worlds — Ferra's scrap (2026-11-20, the hero-look rework: cool, not cute). Her story: the Scrap Queen of
// the Crusher Yard; the night she was born "every tool on the smithy wall turned to face the cradle". Steel-blue, one red
// and one blue gauntlet. Her scrap was grey discs and grey bars. Now it is junk you can name - hubcaps, car-door corners
// with their window frames, toothed saw blades, wrenches, tyres, pipes, road signs - turning to answer her, with blue
// field lines for a pull and red for a push. Crisp pixel art (js/pixel-kit.js; every piece baked once per angle).
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/sen-ink.js.
//   U      Sawback: a real toothed saw blade, spinning, sparks off its teeth, boomeranging home
//   S+U    Polarity: a pull is blue field lines curving in, a push red lines bursting out; scrap hangs in the field
//   I      Scrap Halo: four pieces in orbit - a hubcap, a car-door corner, a saw blade, a wrench
//   S+I    Scrap Press: two walls of crushed junk (door panels, pipes, a road sign) slam shut with a puff of rust
//   W+O    Scrap Tornado: a whirl of tyres, pipes and signs
//   J      her claws: three raking streaks of torn steel with sparks
//   S+O    Overclock: a wrench and a hammer orbit her raised hand      O  Titan Coil: smithy tools turn to face her
//          and circle her, both gauntlets blazing red and blue (both small on purpose: the view stays clear)
//   W+I    Junkyard Comet: the comet is a ball of car doors and saw blades with a fire trail; on the finishing blow
//          (js/ult-grand.js) junk streaks in from every side, crushes into a cube over the target and comes down with
//          a crusher-yard crunch on an impact frame
// SW.ferraScrap.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !CASTS.sawback || !CASTS.scrap_halo) return;
  const FS = SW.ferraScrap = { on: true };
  const isF = g => !!(FS.on && g && g.state && g.state.hero === 'ferra');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0c0e14', s0: '#3a3f4e', s: '#8a92a8', s2: '#c8ccd8', w: '#ffffff', red: '#c0392b', red2: '#e8604c', blue: '#2c6fbf', blue2: '#7ab0ff', rust: '#8a4a2a', rust2: '#c07040', yel: '#f2c230', blk: '#1a1a20', tyre: '#2a2a30', glass: '#9ad0e8', spark: '#ffd24a' };
  const PAL = [C.out, C.s0, C.s, C.s2, C.w, C.red, C.red2, C.blue, C.blue2, C.rust, C.rust2, C.yel, C.blk, C.tyre, C.glass, C.spark];

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  const blit = (ctx, cv, x, y, a) => { if (a !== undefined && a <= 0) return; ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore(); };
  // the junk: each drawn at unit size u around (0, 0)
  const KINDS = {
    hubcap(q, u) { q.beginPath(); q.arc(0, 0, 5 * u, 0, PI * 2); q.fillStyle = C.s2; q.fill(); q.beginPath(); q.arc(0, 0, 3.6 * u, 0, PI * 2); q.fillStyle = C.s; q.fill(); q.fillStyle = C.s2; for (let i = 0; i < 5; i++) { q.save(); q.rotate(i * PI * 0.4); q.fillRect(-0.5 * u, 0, 1 * u, 3.4 * u); q.restore(); } q.beginPath(); q.arc(0, 0, 1.2 * u, 0, PI * 2); q.fillStyle = C.s0; q.fill(); },
    door(q, u) { q.fillStyle = C.red; q.beginPath(); q.moveTo(-5 * u, 4 * u); q.lineTo(-5 * u, -1 * u); q.lineTo(-2 * u, -4.5 * u); q.lineTo(5 * u, -4.5 * u); q.lineTo(5 * u, 4 * u); q.closePath(); q.fill(); q.fillStyle = C.glass; q.beginPath(); q.moveTo(-3.6 * u, -1 * u); q.lineTo(-1.6 * u, -3.4 * u); q.lineTo(3.8 * u, -3.4 * u); q.lineTo(3.8 * u, -1 * u); q.closePath(); q.fill(); q.fillStyle = C.s2; q.fillRect(1.5 * u, 0.6 * u, 2 * u, 0.8 * u); q.fillStyle = C.red2; q.fillRect(-5 * u, 2.4 * u, 10 * u, 0.6 * u); },
    saw(q, u) { q.fillStyle = C.s2; q.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * PI * 2, r = i % 2 ? 4.2 * u : 5.4 * u; q.lineTo(Math.cos(a) * r, Math.sin(a) * r); } q.closePath(); q.fill(); q.beginPath(); q.arc(0, 0, 3 * u, 0, PI * 2); q.fillStyle = C.s; q.fill(); q.beginPath(); q.arc(0, 0, 1 * u, 0, PI * 2); q.fillStyle = C.s0; q.fill(); },
    wrench(q, u) { q.fillStyle = C.s2; q.fillRect(-4 * u, -0.8 * u, 7 * u, 1.6 * u); q.beginPath(); q.arc(3.8 * u, 0, 2 * u, 0, PI * 2); q.fill(); q.fillStyle = 'rgba(0,0,0,1)'; q.globalCompositeOperation = 'destination-out'; q.fillRect(3.8 * u, -0.8 * u, 2.4 * u, 1.6 * u); q.globalCompositeOperation = 'source-over'; q.beginPath(); q.arc(-4.4 * u, 0, 1.4 * u, 0, PI * 2); q.fillStyle = C.s2; q.fill(); q.fillStyle = C.s; q.fillRect(-3 * u, 0.2 * u, 5 * u, 0.6 * u); },
    tyre(q, u) { q.beginPath(); q.arc(0, 0, 5 * u, 0, PI * 2); q.fillStyle = C.tyre; q.fill(); q.beginPath(); q.arc(0, 0, 2.6 * u, 0, PI * 2); q.fillStyle = C.s; q.fill(); q.fillStyle = C.blk; for (let i = 0; i < 10; i++) { q.save(); q.rotate(i * PI / 5); q.fillRect(4 * u, -0.5 * u, 1.2 * u, 1 * u); q.restore(); } },
    pipe(q, u) { q.fillStyle = C.rust; q.fillRect(-5.5 * u, -1.2 * u, 11 * u, 2.4 * u); q.fillStyle = C.rust2; q.fillRect(-5.5 * u, -1.2 * u, 11 * u, 0.8 * u); q.fillStyle = C.s0; q.fillRect(-6 * u, -1.8 * u, 1.4 * u, 3.6 * u); q.fillRect(4.6 * u, -1.8 * u, 1.4 * u, 3.6 * u); },
    sign(q, u) { q.save(); q.rotate(PI / 4); q.fillStyle = C.yel; q.fillRect(-3.6 * u, -3.6 * u, 7.2 * u, 7.2 * u); q.restore(); q.fillStyle = C.blk; q.fillRect(-0.6 * u, -2.4 * u, 1.2 * u, 3.2 * u); q.fillRect(-0.6 * u, 1.4 * u, 1.2 * u, 1.2 * u); q.fillStyle = C.s0; q.fillRect(-0.5 * u, 4.6 * u, 1 * u, 3 * u); }
  };
  function junk(ctx, kind, x, y, s, ang, a, mono) {
    const step = ((R(ang / (PI / 8)) % 16) + 16) % 16, S = Math.max(1, Math.round(s * 4) / 4), b = R(16 * S) + 6;
    const cv = baked(kind + S + '_' + step + (mono || ''), b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => { q.rotate(step * PI / 8); KINDS[kind](q, S); }, { pal: PAL, outline: C.out, keepThin: true, mono }));
    blit(ctx, cv, x, y, a);
  }
  FS.junk = junk;
  const JUNK = ['hubcap', 'door', 'saw', 'wrench', 'tyre', 'pipe', 'sign'];
  function field(ctx, x, y, R0, k, inward, col, n) {   // field lines: n curved strokes, curving in (pull) or bursting out (push)
    if (k <= 0 || k >= 1) return;
    ctx.save(); ctx.globalAlpha *= Math.sin(k * PI);
    for (let i = 0; i < n; i++) {
      const a = i / n * PI * 2, r0 = inward ? R0 * (1 - k * 0.85) : R0 * 0.15 + R0 * 0.75 * k, r1 = r0 + R0 * 0.25;
      let px = x + Math.cos(a) * r0, py = y + Math.sin(a) * r0 * 0.6;
      for (let j = 1; j <= 5; j++) { const rr = r0 + (r1 - r0) * j / 5, aa = a + (inward ? -1 : 1) * 0.25 * j / 5, nx = x + Math.cos(aa) * rr, ny = y + Math.sin(aa) * rr * 0.6; art.line(ctx, j > 3 ? C.w : col, R(px), R(py), R(nx), R(ny), 2); px = nx; py = ny; }
    }
    ctx.restore();
  }

  // ================= U: Sawback =================
  const _sb = CASTS.sawback;
  CASTS.sawback = function (p, z) {
    const n0 = z.shots.length, r = _sb.apply(this, arguments);
    if (!isF(G)) return r;
    z.shots.slice(n0).forEach(s => {
      if (!s || s.p !== p || s.ferra) return;
      s.ferra = 1;
      s.draw = function (ctx, cam) { const x = R(this.x - cam.x), y = R(this.y - cam.y); junk(ctx, 'saw', x, y, 1.6, this.t * 0.9, 1); if (this.hs.size && this.t % 2 === 0) for (let i = 0; i < 2; i++) part(this.x + rand(-6, 6), this.y + rand(-6, 6), i ? C.spark : C.w, rand(-2, 2), -rand(1, 2.5), 10, 1, 0.2); };
    });
    return r;
  };

  // ================= I: Scrap Halo: four pieces in orbit =================
  const _sh = CASTS.scrap_halo;
  CASTS.scrap_halo = function (p, z) {
    const n0 = z.shots.length, r = _sh.apply(this, arguments);
    if (!isF(G)) return r;
    z.shots.slice(n0).forEach(s => {
      if (!s || !s.isHalo || s.ferra) return;
      s.ferra = 1; const kinds = ['hubcap', 'door', 'saw', 'wrench'];
      s.draw = function (ctx, cam) { if (this.t > 300 && this.t % 8 < 4) return; for (let k = 0; k < 4; k++) { const q = this.spot(k); junk(ctx, kinds[k], R(q[0] - cam.x), R(q[1] - cam.y), 1.2, this.t * (k === 2 ? 0.6 : 0.12) + k, 1); } };
    });
    return r;
  };

  // ================= S+U: Polarity: field lines (its rings) =================
  const _ring = fx.ring;
  fx.ring = function (x, y, col, r0, r1, life) {
    const g = G, z = g && g.zone;
    if (!isF(g) || !z || !z.shots || life !== 16 || !((col === '#2c6fbf' && r0 === 150) || (col === '#d83a3a' && r1 === 150))) return _ring.apply(this, arguments);
    const inward = col === '#2c6fbf';
    z.shots.push(new Vis(x, y, 18, (ctx, sx, sy, t) => {
      const k = t / 18;
      field(ctx, sx, sy, 110, k, inward, inward ? C.blue2 : C.red2, 16);
      for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + 0.3, rr = inward ? 90 * (1 - ease(k)) + 12 : 12 + 90 * ease(k); junk(ctx, JUNK[i % 7], sx + Math.cos(a) * rr, sy + Math.sin(a) * rr * 0.55, 0.9, t * 0.3 + i, 1 - ease((k - 0.7) / 0.3)); }   // scrap hanging in the field
    }));
  };

  // ================= S+I: Scrap Press: walls of crushed junk =================
  function wall(ctx, px, y, s, t) {   // a wall of crushed junk, 58 tall
    art.rect(ctx, C.out, px - 10, y - 59, 20, 59);
    const rows = [[C.red, C.red2], [C.s0, C.s], [C.rust, C.rust2], [C.blue, C.blue2], [C.s, C.s2], [C.red, C.red2], [C.rust, C.rust2]];
    for (let j = 0; j < 7; j++) { const [a, b] = rows[j], yy = y - 58 + j * 8 + (j % 2); art.rect(ctx, a, px - 9, yy, 18, 7); art.rect(ctx, b, px - 9, yy, 18, 1); if (j % 3 === 1) art.rect(ctx, C.glass, px - 5 + (j % 2) * 3, yy + 2, 5, 2); }   // crushed panels
    art.rect(ctx, C.s2, px - s * 6 - 1, y - 30, 2, 12);   // a pipe sticking out
    junk(ctx, 'sign', px + s * 2, y - 46, 0.7, 0.4 * s, 1);
  }
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.ferra;
  if (BU && BU.cast) {
    const _sp = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _sp.apply(this, arguments);
      if (!isF(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s || s.life !== 38 || typeof s.render !== 'function' || s.ferra) return;
        s.ferra = 1;
        s.render = (ctx, x, y, t) => {
          t = typeof t === 'number' ? t : (s.t || 0);
          const d = t < 12 ? 70 - t * 5 : t < 26 ? 10 : 10 + (t - 26) * 6;
          ctx.save(); ctx.globalAlpha *= t > 26 ? Math.max(0, 1 - (t - 26) / 12) : 1;
          [-1, 1].forEach(sd => wall(ctx, x + sd * d, y, sd, t));
          ctx.restore();
          if (t >= 12 && t < 24) { const k = (t - 12) / 12; ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2, rr = 6 + k * 26; art.disc(ctx, i % 2 ? C.rust : C.rust2, R(x + Math.cos(a) * rr), R(y - 30 + Math.sin(a) * rr * 0.6), R(4 - k * 2)); } ctx.restore(); }   // the puff of rust
        };
      });
      return r;
    };
  }

  // ================= W+O: Scrap Tornado =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.ferra;
  if (SIG && SIG.cast) {
    const _st = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _st.apply(this, arguments);
      if (!isF(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint || s.ferra || s.life !== 80) return;
        s.ferra = 1; const kinds = ['tyre', 'pipe', 'sign', 'hubcap', 'door', 'pipe', 'tyre', 'saw'];
        s.paint = (ctx, sx, sy, q) => {
          const t = q.t, a = Math.min(1, t / 6, (80 - t) / 10);
          for (let i = 0; i < 8; i++) { const an = t * 0.32 + i / 8 * PI * 2, h = ((i * 0.37 + t * 0.01) % 1), rr = 8 + h * 22; junk(ctx, kinds[i], sx + Math.cos(an) * rr, sy + 18 - h * 46 + Math.sin(an) * rr * 0.3, 0.9, an + t * 0.2, a); }
          ctx.save(); ctx.globalAlpha *= a * 0.7; for (let j = 0; j < 3; j++) { const yy = sy + 10 - j * 14, rr = 10 + j * 8; for (let i = 0; i < 12; i++) { const an = i / 12 * PI * 2 + t * 0.4; if (i % 3 === 2) continue; art.rect(ctx, C.s2, R(sx + Math.cos(an) * rr), R(yy + Math.sin(an) * rr * 0.25), 1, 1); } } ctx.restore();
        };
      });
      return r;
    };
  }

  // ================= J: claws of torn steel =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (col !== '#e0ecff' || !isF(g) || !p || !z || !z.shots || (p.state !== 'attack' && p.state !== 'airatk')) return _slash.apply(this, arguments);
    const d = dir || p.face, a = p.atk, fin = !!(a && a.fin), s = fin ? 16 : 12;
    z.shots.push(new Vis(x, y, fin ? 14 : 10, (ctx, sx, sy, t) => {
      const k = t / (fin ? 14 : 10), sw = ease(Math.min(1, k * 3)), al = 1 - ease((k - 0.45) / 0.55);
      ctx.save(); ctx.globalAlpha *= al;
      for (let i = -1; i <= 1; i++) {   // three raking streaks, jagged like torn metal
        let px = sx - d * s, py = sy - s * 0.6 + i * 5;
        for (let j = 1; j <= 6; j++) { const u = j / 6; if (u > sw) break; const nx = sx - d * s + d * s * 2 * u, ny = sy - s * 0.6 + i * 5 + s * 1.2 * u + (j % 2 ? -1 : 1); art.line(ctx, C.out, R(px), R(py), R(nx), R(ny), 4); art.line(ctx, j > 4 ? C.w : i === 0 ? C.s2 : C.s, R(px), R(py), R(nx), R(ny), 2); px = nx; py = ny; }
      }
      ctx.restore();
      if (t < 3) for (let i = 0; i < 3; i++) art.rect(ctx, C.spark, R(sx + d * (6 + i * 3)), R(sy + 4 - i * 4), 2, 1);
    }));
  };

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (p.modeT > 0 && !behind) {   // Overclock: a wrench and a hammer orbit her raised hand
      const fade = Math.min(1, p.modeT / 30), hx = sx + d * 6, hy = sy - 38;
      ['wrench', 'saw'].forEach((k, i) => { const an = t * 0.12 + i * PI; junk(ctx, k, hx + Math.cos(an) * 9, hy + Math.sin(an) * 4, 0.7, an * 2, fade); });
    }
    if (p.awakeT > 0) {   // Titan Coil: smithy tools face her and circle her; both gauntlets blaze
      const fade = Math.min(1, p.awakeT / 30), kinds = ['wrench', 'saw', 'pipe', 'wrench'];
      for (let i = 0; i < 4; i++) { const an = t * 0.05 + i / 4 * PI * 2, s = Math.sin(an); if ((s < 0) !== behind) continue; junk(ctx, kinds[i], sx + Math.cos(an) * 20, sy - 20 + s * 5, 0.75, an + PI, fade); }
      if (!behind) { ctx.save(); ctx.globalAlpha *= fade * (0.6 + 0.4 * Math.sin(t * 0.3)); art.disc(ctx, C.red2, sx + d * 9, sy - 19, 2); art.disc(ctx, C.blue2, sx - d * 5, sy - 18, 2); ctx.restore(); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isF(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };

  // ================= W+I: Junkyard Comet =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isF(g) || !z || !z.shots) return r;
    z.shots.forEach(s => {   // the comet: a ball of car doors and saw blades with a fire trail
      if (!(s instanceof Proj) || s.ferra || s.w !== 30 || s.h !== 30 || !s.ghost) return;
      s.ferra = 1;
      s.render = (ctx, x, y, q) => {
        const t = q.t || 0;
        for (let i = 0; i < 8; i++) { const ty = y - 8 - i * 7; ctx.save(); ctx.globalAlpha *= 1 - i / 8; art.disc(ctx, i < 3 ? '#ffd24a' : '#ff8a3a', R(x + Math.sin(t + i) * 3), R(ty), R(10 - i)); ctx.restore(); }   // the fire trail above it
        const kinds = ['door', 'saw', 'hubcap', 'door', 'saw', 'pipe'];
        for (let i = 0; i < 6; i++) { const an = t * 0.2 + i / 6 * PI * 2; junk(ctx, kinds[i], x + Math.cos(an) * 8, y + Math.sin(an) * 8, 1.3, an * 1.5, 1); }
        junk(ctx, 'hubcap', x, y, 1.4, t * 0.3, 1);
      };
    });
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('ferra') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): junk streaks in from every side and crushes into a cube over the target, then
  // it comes down with a crusher-yard crunch on an impact frame
  function cube(ctx, x, y, s, a) {
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    art.rect(ctx, C.out, R(x - s / 2) - 1, R(y - s / 2) - 1, R(s) + 2, R(s) + 2);
    const rows = [C.red, C.s, C.rust, C.blue, C.s2, C.red2];
    for (let j = 0; j < 6; j++) art.rect(ctx, rows[j], R(x - s / 2), R(y - s / 2 + j * s / 6), R(s), Math.max(1, R(s / 6)));
    art.rect(ctx, C.glass, R(x - s / 4), R(y - s / 6), R(s / 4), 2); art.rect(ctx, C.yel, R(x + s / 8), R(y + s / 8), 3, 3);
    ctx.restore();
  }
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const cy = sy - 44;
      if (st < FIN - 6) {
        const k = ease((st - (BU2 - 2)) / (FIN - 6 - BU2 + 2));
        for (let i = 0; i < 12; i++) { const an = i / 12 * PI * 2 + 0.2, rr = 120 * (1 - k) + 6; junk(ctx, JUNK[i % 7], sx + Math.cos(an) * rr, cy + Math.sin(an) * rr * 0.6, 1, an + st * 0.3, Math.min(1, k * 3)); if (k < 0.9) art.line(ctx, C.s2, R(sx + Math.cos(an) * (rr + 10)), R(cy + Math.sin(an) * (rr + 10) * 0.6), R(sx + Math.cos(an) * (rr + 22)), R(cy + Math.sin(an) * (rr + 22) * 0.6), 1); }
      } else if (st < FIN) {
        const k = (st - (FIN - 6)) / 6; cube(ctx, sx, cy - k * 4 + (st % 2), 22 - k * 2, 1);   // crushed
      } else {
        const u = st - FIN, k = u / 18, ik = u / 5, y = cy + Math.min(1, u / 2) * 30;
        if (ik < 1) PX.impact(ctx, sx, sy - 20, ik, 71);
        if (u < 6) cube(ctx, sx, y, 20, 1);
        for (let i = 0; i < 10; i++) { const s = i % 2 ? 1 : -1, row = i >> 1; junk(ctx, JUNK[(i + 2) % 7], sx + s * (8 + k * (30 + row * 10)), sy - 12 - Math.sin(Math.min(1, k * 1.5) * PI) * (16 + row * 6) + k * k * 30, 1, k * 6 * s + i, 1 - ease((k - 0.6) / 0.4)); }
        ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 10; i++) { const a = PI + i / 9 * PI; art.line(ctx, i % 2 ? C.spark : C.w, sx, sy - 4, R(sx + Math.cos(a) * (16 + k * 40)), R(sy - 4 + Math.sin(a) * (6 + k * 16)), 1); } ctx.restore();
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
