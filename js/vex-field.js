'use strict';
// Shattered Worlds — Vex's field (2026-11-20, the hero-look rework: cool, not cute). His story: the Iron Pull; "opposites
// attract. He makes sure of it."; a red fist (+) and a pale blue fist (-), and iron scrap obeying field lines. His charges
// were plain orbs and his scrap grey boxes. Now: charges that look like charges (a red + core in a crackling shell, a blue
// - core), curved field lines bending out or in, iron filings that stream along them, and real scrap - nuts, bolts,
// plates, a gear - drawn as crisp pixel art by js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was.
// Loaded after js/sable-hum.js.
//   U      Repel Shot: a red + charge with field lines bursting out of it
//   S+U    Attract: blue field lines curve inward to his fist, iron filings streaming along them
//   I      Iron Storm: three rings of real scrap - nuts, bolts, plates, gears - spinning out
//   S+I    Lodestar: a black lodestone core with filings standing up on it like fur, field lines pulling in
//   W+O    Flux Flip: a red ring pushes out with outward field lines, then the field flips and blue lines drag in
//   J      the finisher: a horseshoe-magnet arc, red and blue poles, sparks between them
//   (trait) SNAP: a red and a blue arc twist together
//   S+O    Strong Field: a few scraps float between his hands, field-line arcs fist to fist
//   O      North Star: a small compass star over him, its needle swinging (small on purpose)
//   W+I    Magnetar: field lines from him to every foe, red then blue; on the finishing blow (js/ult-grand.js) scrap
//          from everywhere crushes onto the target into a ball of iron on an impact frame
// SW.vexField.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.repel_shot || !CASTS.iron_storm) return;
  const VF = SW.vexField = { on: true };
  const isV = g => !!(VF.on && g && g.state && g.state.hero === 'vex');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0c0c14', r0: '#6a0a14', r: '#e63946', r2: '#ff8a8a', b0: '#2a5a6a', b: '#a8dadc', b2: '#e8fbff', w: '#ffffff', i0: '#2b2d42', i1: '#5a6070', i: '#8d99ae', i2: '#c5cedd', i3: '#e0e6f0', lode: '#1a1a22' };
  const PAL = [C.out, C.r0, C.r, C.r2, C.b0, C.b, C.b2, C.w, C.i0, C.i1, C.i, C.i2, C.i3, C.lode];

  // ---------- scrap: kind 0 nut, 1 bolt, 2 plate, 3 gear; (0, 0) its centre, s its size ----------
  function scrapVec(c, kind, s) {
    if (kind === 0) { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; const x = Math.cos(a) * s, y = Math.sin(a) * s; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.closePath(); c.fillStyle = C.i; c.fill(); c.beginPath(); c.arc(0, 0, s * 0.45, 0, PI * 2); c.fillStyle = C.i0; c.fill(); c.fillStyle = C.i3; c.fillRect(-s * 0.8, -s * 0.8, s * 0.5, s * 0.3); return; }
    if (kind === 1) { c.fillStyle = C.i1; c.fillRect(-s * 1.1, -s * 0.25, s * 1.8, s * 0.5); c.fillStyle = C.i2; for (let i = 0; i < 4; i++) c.fillRect(-s * 0.9 + i * s * 0.4, -s * 0.25, Math.max(1, s * 0.12), s * 0.5); c.fillStyle = C.i; c.fillRect(s * 0.6, -s * 0.6, s * 0.5, s * 1.2); c.fillStyle = C.i3; c.fillRect(s * 0.6, -s * 0.6, s * 0.5, s * 0.25); return; }
    if (kind === 2) { c.fillStyle = C.i1; c.beginPath(); c.moveTo(-s, -s * 0.6); c.lineTo(s * 0.8, -s * 0.8); c.lineTo(s, s * 0.5); c.lineTo(-s * 0.7, s * 0.7); c.closePath(); c.fill(); c.fillStyle = C.i2; c.fillRect(-s * 0.8, -s * 0.55, s * 1.4, s * 0.25); c.fillStyle = C.i0; c.beginPath(); c.arc(-s * 0.4, s * 0.1, s * 0.15, 0, PI * 2); c.arc(s * 0.4, s * 0.1, s * 0.15, 0, PI * 2); c.fill(); return; }
    for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; c.save(); c.rotate(a); c.fillStyle = C.i; c.fillRect(s * 0.6, -s * 0.2, s * 0.45, s * 0.4); c.restore(); }   // a gear
    c.beginPath(); c.arc(0, 0, s * 0.75, 0, PI * 2); c.fillStyle = C.i; c.fill(); c.beginPath(); c.arc(0, 0, s * 0.3, 0, PI * 2); c.fillStyle = C.i0; c.fill(); c.fillStyle = C.i3; c.fillRect(-s * 0.6, -s * 0.5, s * 0.5, s * 0.2);
  }
  function scrap(ctx, x, y, kind, s, rot, o) {
    o = o || {};
    s *= 1.5;
    PX.sprite(ctx, x, y, s * 3, s * 3, c => { c.rotate(rot || 0); scrapVec(c, kind, s); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  VF.scrap = scrap;
  // a charge: a + (red) or - (blue) core in a crackling shell
  function charge(ctx, x, y, r, plus, t) {
    PX.sprite(ctx, x, y, r * 3, r * 3, c => {
      c.beginPath(); c.arc(0, 0, r * 1.2, 0, PI * 2); c.fillStyle = plus ? C.r0 : C.b0; c.fill();
      c.beginPath(); c.arc(0, 0, r, 0, PI * 2); c.fillStyle = plus ? C.r : C.b; c.fill();
      c.beginPath(); c.arc(-r * 0.3, -r * 0.3, r * 0.4, 0, PI * 2); c.fillStyle = plus ? C.r2 : C.b2; c.fill();
      c.fillStyle = C.w; c.fillRect(-r * 0.6, -r * 0.14, r * 1.2, Math.max(1, r * 0.28)); if (plus) c.fillRect(-r * 0.14, -r * 0.6, Math.max(1, r * 0.28), r * 1.2);
    }, { pal: PAL, outline: C.out, keepThin: true });
    const n = 5, ph = (t || 0) * 0.2;   // the shell's crackle
    ctx.save(); for (let i = 0; i < n; i++) { const a = ph + i / n * PI * 2; if ((i + ((t || 0) >> 1)) % 2) art.rect(ctx, plus ? C.r2 : C.b2, Math.round(x + Math.cos(a) * r * 1.6), Math.round(y + Math.sin(a) * r * 1.6), r > 5 ? 2 : 1, r > 5 ? 2 : 1); } ctx.restore();
  }
  // field lines: n curved lines from (x, y); out = bursting outward, else bending inward toward it; k 0..1
  function field(ctx, x, y, n, R, out, k, col, sq) {
    if (k <= 0 || k >= 1) return;
    ctx.save(); ctx.globalAlpha = Math.min(1, Math.sin(k * PI) * 1.3);
    const lw = R >= 30 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const a = i / n * PI * 2, bend = 0.5;
      const r0 = out ? R * 0.2 + R * 0.6 * k : R * (1 - k * 0.8), r1 = out ? r0 + R * 0.35 : r0 + R * 0.25;
      let px = x + Math.cos(a) * r0, py = y + Math.sin(a) * r0 * (sq || 1);
      for (let j = 1; j <= 5; j++) { const rr = r0 + (r1 - r0) * j / 5, aa = a + bend * j / 5 * (out ? 1 : -1) * 0.4, nx = x + Math.cos(aa) * rr, ny = y + Math.sin(aa) * rr * (sq || 1); art.line(ctx, j === 5 ? C.w : col, Math.round(px), Math.round(py), Math.round(nx), Math.round(ny), lw); px = nx; py = ny; }
    }
    ctx.restore();
  }
  function filings(ctx, x0, y0, x1, y1, t, n) {   // iron filings streaming along a line toward (x1, y1)
    ctx.save();
    for (let i = 0; i < (n || 8); i++) { const u = ((t * 0.08 + i / (n || 8)) % 1), x = x0 + (x1 - x0) * u + Math.sin(i * 2.1) * 4 * (1 - u), y = y0 + (y1 - y0) * u + Math.cos(i * 1.7) * 4 * (1 - u); art.rect(ctx, i % 2 ? C.i2 : C.i3, Math.round(x), Math.round(y), 3, 2); }
    ctx.restore();
  }

  // ================= dressing his projectiles =================
  let scrapN = 0;
  function dress(p, z, n0) {
    z.shots.slice(n0 || 0).forEach(s => {
      if (s.vex || !(s instanceof Proj) || s.team === 'enemy') return;
      if (s.w === 10 && s.h === 10 && s.life === 26 && s.ghost) { s.vex = 1; const kind = scrapN++ % 4, spin = rand(0.2, 0.5) * (scrapN % 2 ? 1 : -1); s.render = (ctx, x, y, q) => scrap(ctx, x, y, kind, kind === 1 ? 5 : 4, q.t * spin); return; }   // Iron Storm's scrap
      if (s.r === 5 && s.life === 40) { s.vex = 1; s.render = (ctx, x, y, q) => { field(ctx, x, y, 8, 22, true, (q.t % 12) / 12, C.r2); charge(ctx, x, y, 7, true, q.t); }; }   // Repel Shot
    });
  }
  const _rs = CASTS.repel_shot; CASTS.repel_shot = function (p, z) { const n0 = z.shots.length, r = _rs.apply(this, arguments); if (isV(G)) dress(p, z, n0); return r; };
  const _is = CASTS.iron_storm;
  CASTS.iron_storm = function (p, z) {
    const n0 = z.shots.length, r = _is.apply(this, arguments);
    if (!isV(G)) return r;
    z.shots.slice(n0).forEach(l => { if (typeof l.fn === 'function') { const fn = l.fn; l.fn = function () { const m = z.shots.length, o = fn.apply(this, arguments); dress(p, z, m); return o; }; } });
    z.shots.push(new Vis(p.x, p.y, 10, (ctx, sx, sy, t) => { for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + t * 0.3, rr = 20 - t * 1.4; scrap(ctx, sx + Math.cos(a) * rr, sy - 20 + Math.sin(a) * rr * 0.6, i % 4, 4, t * 0.4 + i); } }, v => { v.x = p.x; v.y = p.y; }));   // gathering round him first
    return r;
  };

  // ================= S+U: Attract: blue field lines curving in, filings streaming =================
  const _at = CASTS.attract;
  if (_at) CASTS.attract = function (p, z) {
    const e = isV(G) ? N.ahead(p, z, 170) : null, d = p.face, tx = e ? e.x : p.x + d * 90, ty = e ? e.y - 18 : p.y - 20, r = _at.apply(this, arguments);   // (read where they stand before the pull moves them)
    if (!isV(G)) return r;
    z.shots.push(new Vis(p.x, p.y, 16, (ctx, sx, sy, t) => {
      const hx = sx + d * 10, hy = sy - 20, ex = Math.round(tx - G.cam.x), ey = Math.round(ty - G.cam.y), k = t / 16;
      ctx.save(); ctx.globalAlpha = 1 - k;
      for (let j = -2; j <= 2; j++) { let px = ex, py = ey + j * 6; for (let i = 1; i <= 8; i++) { const u = i / 8, nx = ex + (hx - ex) * u, ny = ey + j * 6 * (1 - u) + Math.sin(u * PI) * j * 7; art.line(ctx, i > 6 ? C.w : C.b, Math.round(px), Math.round(py), Math.round(nx), Math.round(ny), 2); px = nx; py = ny; } }
      ctx.restore();
      filings(ctx, ex, ey, hx, hy, t, 16);
      charge(ctx, hx, hy, 6, false, t);
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= S+I: Lodestar =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.vex;
  if (BU && BU.cast) {
    const _ls = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ls.apply(this, arguments);
      if (!isV(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint && !s.render) return;
        const draw = (ctx, x, y, t) => {
          const cy = y - 22;
          field(ctx, x, cy, 12, 56, false, (t % 24) / 24, C.b, 0.7);
          PX.sprite(ctx, x, cy, 46, 46, c => { c.scale(1.5, 1.5);   // the lodestone, filings standing up on it like fur
            c.beginPath(); c.arc(0, 0, 7, 0, PI * 2); c.fillStyle = C.lode; c.fill(); c.beginPath(); c.arc(-2, -2, 2.5, 0, PI * 2); c.fillStyle = C.i1; c.fill();
            c.strokeStyle = C.i; c.lineWidth = 1; for (let i = 0; i < 18; i++) { const a = i / 18 * PI * 2, L = 3 + Math.abs(Math.sin(i * 1.7 + t * 0.2)) * 3; c.beginPath(); c.moveTo(Math.cos(a) * 7, Math.sin(a) * 7); c.lineTo(Math.cos(a) * (7 + L), Math.sin(a) * (7 + L)); c.stroke(); }
          }, { pal: PAL, outline: C.out, keepThin: true });
          for (let i = 0; i < 4; i++) { const a = t * 0.07 + i * PI / 2, rr = 36 - ((t * 1.2 + i * 9) % 30); scrap(ctx, x + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.6, i % 4, 3, t * 0.3 + i); }   // scrap drawn in
        };
        if (s.paint) s.paint = (ctx, x, y, t) => draw(ctx, x, y, typeof t === 'number' ? t : (s.t || 0));
        else s.render = (ctx, x, y, t) => draw(ctx, x, y, typeof t === 'number' ? t : (s.t || 0));
      });
      return r;
    };
  }

  // ================= W+O: Flux Flip =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.vex;
  if (SIG && SIG.cast) {
    const _ff = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _ff.apply(this, arguments);
      if (!isV(G)) return r;
      z.shots.push(new Vis(p.x, p.y, 36, (ctx, sx, sy, t) => {
        if (t < 16) { field(ctx, sx, sy - 20, 12, 70, true, t / 16, C.r); charge(ctx, sx, sy - 20, 8, true, t); }
        else if (t < 22) { charge(ctx, sx, sy - 20, 8, t % 2 === 0, t); }   // the field flips
        else { field(ctx, sx, sy - 20, 12, 140, false, (t - 22) / 14, C.b); charge(ctx, sx, sy - 20, 8, false, t); }
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= the finisher, SNAP, and the small auras =================
  const _bolt = fx.bolt;
  fx.bolt = function (x0, y0, x1, y1, col) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (isV(g) && p && z && z.shots && Math.abs(x0 - (p.x + p.face * 10)) < 2 && Math.abs(y0 - (p.y - 20)) < 2 && col === '#a8dadc' && Math.abs(x1 - (p.x + p.face * 40)) < 2) {   // the finisher: a horseshoe magnet arc
      const d = p.face;
      z.shots.push(new Vis(x1, y1, 12, (ctx, sx, sy, t) => {
        const k = t / 12;
        PX.sprite(ctx, sx - d * 14, sy, 30, 30, c => { if (d < 0) c.scale(-1, 1); c.lineWidth = 5; c.strokeStyle = C.i1; c.beginPath(); c.arc(0, 0, 8, PI / 2, PI * 1.5); c.stroke(); c.fillStyle = C.r; c.fillRect(0, -10.5, 6, 5); c.fillStyle = C.b; c.fillRect(0, 5.5, 6, 5); c.fillStyle = C.w; c.fillRect(0, -10.5, 6, 1); }, { pal: PAL, alpha: 1 - ease((k - 0.5) / 0.5), outline: C.out, keepThin: true });
        ctx.save(); ctx.globalAlpha = 1 - k; for (let i = 0; i < 3; i++) art.line(ctx, i % 2 ? C.b2 : C.r2, sx - d * 6, sy - 8 + i, Math.round(sx + d * (8 + rand(0, 8))), Math.round(sy - 8 + i * 8 + rand(-2, 2)), 1); ctx.restore();
      }));
      return _bolt.apply(this, arguments);
    }
    if (isV(g) && p && z && z.shots && col === '#ffffff' && Math.abs(x0 - p.x) < 2 && Math.abs(y0 - (p.y - 20)) < 2) {   // SNAP: a red and a blue arc twist together
      _bolt.call(this, x0, y0 - 2, x1, y1 - 2, C.r); _bolt.call(this, x0, y0 + 2, x1, y1 + 2, C.b);
    }
    return _bolt.apply(this, arguments);
  };
  function aura(ctx, p, sx, sy) {
    const d = p.face;
    if (p.modeT > 0) {   // Strong Field: scraps float between his hands, field arcs fist to fist
      const fade = Math.min(1, p.modeT / 30), hx = sx + d * 4, hy = sy - 22;
      ctx.save(); ctx.globalAlpha = 0.6 * fade; ctx.strokeStyle = C.b; ctx.lineWidth = 1; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.ellipse(hx, hy, 9 + i * 3, 4 + i * 2, 0, PI, PI * 2); ctx.stroke(); } ctx.restore();
      for (let i = 0; i < 3; i++) { const a = p.t * 0.06 + i * 2.1; scrap(ctx, Math.round(hx + Math.cos(a) * 7), Math.round(hy - 6 + Math.sin(a) * 3), i, 2.5, p.t * 0.1 + i, { a: fade }); }
    }
    if (p.awakeT > 0) {   // North Star: a small compass star over him, its needle swinging
      const fade = Math.min(1, p.awakeT / 30), cx = sx, cy = sy - (p.h || 34) - 10, sw = Math.sin(p.t * 0.07) * 0.6;
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < 4; i++) { const a = i * PI / 2; art.line(ctx, C.i3, cx, cy, Math.round(cx + Math.cos(a) * 5), Math.round(cy + Math.sin(a) * 5), 1); }
      art.line(ctx, C.r, cx, cy, Math.round(cx + Math.sin(sw) * 4), Math.round(cy - Math.cos(sw) * 4), 1); art.line(ctx, C.b, cx, cy, Math.round(cx - Math.sin(sw) * 4), Math.round(cy + Math.cos(sw) * 4), 1);
      art.rect(ctx, C.w, cx, cy, 1, 1);
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isV(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: Magnetar =================
  const _mg = N.ULT && N.ULT.magnetar;
  if (_mg) N.ULT.magnetar = function (p, z, foes) {
    const L = fx.list, m = L.length, r = _mg.apply(this, arguments);
    if (!isV(G)) return r;
    for (let i = L.length - 1; i >= m; i--) if (L[i] && L[i].k === 'r' && (L[i].col === '#e63946' || L[i].col === '#a8dadc') && L[i].r1 === 90) L.splice(i, 1);   // the plain rings: field lines instead
    if (p.st % 4 === 0 && p.st >= 6 && p.st <= 60) { const out = p.st % 8 !== 0, v = new Vis(p.x, p.y, 8, (ctx, sx, sy, t) => field(ctx, sx, sy - 20, 14, 90, out, t / 8, out ? C.r : C.b)); v._ugS = 1; z.shots.push(v); }
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): scrap from everywhere crushes onto the target into a ball of iron
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('vex') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const bits = []; for (let i = 0; i < 30; i++) bits.push({ a: rand(0, PI * 2), r: rand(70, 140), kind: i % 4, s: rand(4, 7), spin: rand(-0.4, 0.4) });
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 22;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2));
        field(ctx, sx, cy, 12, 70, false, (st % 14) / 14, k > 0.5 ? C.b : C.r, 0.8);
        bits.forEach((b, i) => { const rr = b.r * (1 - k) + 20 * k; scrap(ctx, sx + Math.cos(b.a + k) * rr, cy + Math.sin(b.a + k) * rr * 0.75, b.kind, b.s, st * b.spin + i); });
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? C.w : undefined;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 91);
        const sq = 1 - Math.min(1, (st - FIN) / 3) * 0.35;   // crushed tighter on the hit
        bits.forEach((b, i) => { const rr = (8 + (i % 3) * 7) * sq; scrap(ctx, sx + Math.cos(b.a + i) * rr, cy + Math.sin(b.a + i) * rr * 0.8, b.kind, b.s, b.a, { mono, a: 1 - ease((k - 0.55) / 0.45) }); });   // the great ball of iron
        if (k < 0.6) field(ctx, sx, cy, 16, 110, true, k / 0.6, C.r);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
