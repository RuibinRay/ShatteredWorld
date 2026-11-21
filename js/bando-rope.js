'use strict';
// Shattered Worlds — Bando's rope (2026-11-20, the hero-look rework: cool, not cute). His story: the Deepline dock hand
// who "did not climb. He reached." - an impossibly long arm, the docks' mooring ropes, bandaged forearms, a lime
// bandana. His rubber arm (js/heroes4.js) was a smooth tube. Now it is drawn like a mooring rope: a twisted lay that
// shows along its length, bandage wraps toward the fist, a knotted wrist, a bandaged fist that swells as it lands and
// tension lines while it is stretched; it loops round what it grabs like a rope round a bollard, coils like a spring,
// and the Wind-Up fist splinters what it hits like dock crates. Draw-only: every hit, hitbox and timing stays as it
// was. Loaded after js/dyna-fireworks.js.
//   U      Long Jab: the rope arm, tension lines while it flies, the fist swelling on impact, a wobble going home
//   S+U    Slingshot: the arm takes a turn round the target like a rope round a bollard
//   I      Wind-Up: the arm coils into three turns of rope like a spring, then a door-sized bandaged fist; crate
//          splinters where it lands
//   S+I    Reel In, W+O Rubber Cannon, and his J: all the same rope arm (W+O adds the slingshot band and a twang)
//   S+O    Overstretch: bandage ends fluttering off both forearms      O  Coil Form: a small fighting kite flying
//          on a string over him (both small on purpose: the view stays clear)
//   W+I    Hundred Hands: on the finishing blow (js/ult-grand.js) two giant rope arms come in from both edges and their
//          fists clap together on the target on an impact frame
// SW.bandoRope.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !SW.rubberArm || !CASTS.long_jab || !CASTS.wind_up) return;
  const BR = SW.bandoRope = { on: true };
  const isB = g => !!(BR.on && g && g.state && g.state.hero === 'bando');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0a0a12', band: '#b6e84a', band2: '#ecffc0', wrap: '#f0e8d0', wrap2: '#c8bca0', sleeve: '#2a6a5a', w: '#ffffff', wood: '#a0784a', wood2: '#5a3a1a', kite: '#d62828', kite2: '#f4d35e' };
  const shade = (c, k) => (art.shade ? art.shade(c, k) : c);
  const skinOf = p => { const s = art.sheets[p.sheet()], c = s && s.cfg && s.cfg.c; return (c && c.skin) || '#d8a878'; };
  const foreOf = p => { const s = art.sheets[p.sheet()], c = s && s.cfg && s.cfg.c; return (c && (c.fore || c.skin)) || '#d8a878'; };

  // the rope arm: o = { col, glove, r (fist size), t, out, slack, impact }  (same geometry as js/heroes4.js rubberArm)
  function ropeArm(ctx, sx, sy, tx, ty, o) {
    const col = o.col || '#d8a878', r = (o.r || 5) + (o.impact ? 2 : 0), dx = tx - sx, dy = ty - sy, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux, t = o.t || 0;
    const amp = o.out ? Math.min(6, L / 16) * (o.slack === undefined ? 1 : o.slack) : Math.min(3, L / 30) * Math.sin(t * 1.7), Nn = Math.max(3, R(L / 6)), pts = [];
    for (let i = 0; i <= Nn; i++) { const k = i / Nn, w = Math.sin(k * PI) * amp * Math.sin(k * 9 - t * 1.3); pts.push([R(sx + dx * k + nx * w), R(sy + dy * k + ny * w)]); }
    const aw = Math.max(4, R(r * 0.55)), dark = shade(col, 0.7), glove = o.glove || C.wrap;
    const seg = (c, w, oy) => { for (let i = 0; i < Nn; i++) art.line(ctx, c, pts[i][0], pts[i][1] + (oy || 0), pts[i + 1][0], pts[i + 1][1] + (oy || 0), w); };
    seg(C.out, aw + 2); seg(col, aw);
    // the lay of the rope: short diagonal strokes all along it
    const at = d => { const f = clamp01(d / L) * Nn, i = Math.min(Nn - 1, Math.floor(f)), u = f - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; };
    const h = aw / 2;
    for (let d = 4; d < L - r - 2; d += 4) { const [px, py] = at(d); art.line(ctx, dark, R(px - nx * h + ux * 1.5), R(py - ny * h + uy * 1.5), R(px + nx * h - ux * 1.5), R(py + ny * h - uy * 1.5), 1); }
    ctx.save(); ctx.globalAlpha *= 0.7; seg(o.hi || '#fff1dc', 1, -1); ctx.restore();
    // bandage wraps toward the fist
    for (let j = 0; j < 3; j++) { const d = L - r - 4 - j * 5; if (d < 8) break; const [px, py] = at(d); art.line(ctx, C.out, R(px - nx * (h + 1)), R(py - ny * (h + 1)), R(px + nx * (h + 1)), R(py + ny * (h + 1)), 3); art.line(ctx, j % 2 ? C.wrap2 : C.wrap, R(px - nx * h), R(py - ny * h), R(px + nx * h), R(py + ny * h), 2); }
    art.disc(ctx, C.out, sx, sy, 4); art.disc(ctx, o.top || C.sleeve, sx, sy, 3);   // the sleeve
    if (o.out && L > 40) {   // tension lines while it is stretched
      ctx.save(); ctx.globalAlpha *= 0.5;
      for (let j = -1; j <= 1; j += 2) for (let d = 10; d < L - r - 10; d += 14) { const [px, py] = at(d); art.line(ctx, C.w, R(px + nx * j * (h + 4)), R(py + ny * j * (h + 4)), R(px + nx * j * (h + 4) + ux * 6), R(py + ny * j * (h + 4) + uy * 6), 1); }
      ctx.restore();
    }
    const wx = R(tx - ux * (r + 1)), wy = R(ty - uy * (r + 1)), bz = Math.max(2, R(r / 3));
    art.disc(ctx, C.out, wx, wy, bz + 1); art.disc(ctx, o.band || C.band, wx, wy, bz); art.rect(ctx, C.band2, wx - 1, wy - 1, 1, 1);   // the knotted wrist band
    art.disc(ctx, C.out, tx, ty, r + 2); art.disc(ctx, glove, tx, ty, r + 1);   // the bandaged fist
    const kn = shade(glove, 0.72), kz = Math.max(2, R(r / 3));
    for (let k = -1; k <= 1; k++) art.rect(ctx, kn, R(tx + ux * (r - kz / 2) + nx * k * (r - kz)) - (kz >> 1), R(ty + uy * (r - kz / 2) + ny * k * (r - kz)) - (kz >> 1), kz, kz);   // knuckles
    for (let k = -1; k <= 1; k += 2) art.line(ctx, C.wrap2, R(tx - ux * 2 + nx * k * 2 - nx * r * 0.7), R(ty - uy * 2 + ny * k * 2 - ny * r * 0.7), R(tx - ux * 2 + nx * k * 2 + nx * r * 0.7), R(ty - uy * 2 + ny * k * 2 + ny * r * 0.7), 1);   // the wraps across it
    art.rect(ctx, C.w, R(tx - ux - nx * (r - 2)) - 1, R(ty - uy - ny * (r - 2)) - 1, 2, 1);
    if (o.impact) {
      for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + 0.3, r0 = r + 4, r1 = r + 9 + (i % 2) * 4; art.line(ctx, i % 2 ? C.band2 : C.w, R(tx + ux * 4 + Math.cos(a) * r0), R(ty + uy * 4 + Math.sin(a) * r0), R(tx + ux * 4 + Math.cos(a) * r1), R(ty + uy * 4 + Math.sin(a) * r1), 2); }
    }
    return pts;
  }
  BR.ropeArm = ropeArm;
  // a rope through a list of points (for the coil)
  function ropePath(ctx, pts, col, aw) {
    const dark = shade(col, 0.7);
    for (let i = 0; i < pts.length - 1; i++) art.line(ctx, C.out, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], aw + 2);
    for (let i = 0; i < pts.length - 1; i++) art.line(ctx, col, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], aw);
    for (let i = 0; i < pts.length - 1; i++) { const mx = R((pts[i][0] + pts[i + 1][0]) / 2), my = R((pts[i][1] + pts[i + 1][1]) / 2); art.line(ctx, dark, mx - 1, my - 1, mx + 1, my + 1, 1); }
  }
  // the arm taking a turn round a target, like a rope round a bollard
  function bollard(ctx, x, y, w, col, k) {
    const aw = 3, n = 14, pts = [];
    for (let i = 0; i <= n; i++) { const a = -PI / 2 + i / n * PI * 2 * ease(k); pts.push([R(x + Math.cos(a) * w), R(y + Math.sin(a) * w * 0.35 + i * 0.3)]); }
    ropePath(ctx, pts, col, aw);
  }

  // ---------- SW.rubberArm (Reel In, Rubber Cannon) ----------
  const _ra = SW.rubberArm;
  SW.rubberArm = function (ctx, sx, sy, tx, ty, o) { if (!isB(G)) return _ra.apply(this, arguments); ropeArm(ctx, sx, sy, tx, ty, o || {}); };

  // ---------- his own arms (js/heroes4.js Arm and ArmFx), found in the shots and redrawn ----------
  function armDraw(ctx, cam) {
    const p = this.p, sx = R(p.x + this.dir * 5 - cam.x), sy = R(p.y - 22 - cam.y), q = this.tip(), tx = R(q[0] - cam.x), ty = R(q[1] - cam.y);
    if (this.hs.size && !this.hitT) { this.hitT = this.t; const e = Array.from(this.hs)[0]; if (this.max === 170 && e) this._loopOn = e; }
    if (this._loopOn && this.hitT) { const e = this._loopOn, k = Math.min(1, (this.t - this.hitT + 1) / 4); if (!e.dead && this.t - this.hitT < 14) bollard(ctx, R(e.x - cam.x), R(e.y - (e.h || 30) * 0.55 - cam.y), 10, this.col, k); }
    ropeArm(ctx, sx, sy, tx, ty, { col: this.col, glove: this.glove, r: this.r + 1, t: this.t, out: !this.back, slack: this.back ? 0 : 1, impact: this.hitT && this.t - this.hitT < 4 });
    if (this.r >= 13 && this.hitT && this.t - this.hitT < 10) { const k = (this.t - this.hitT) / 10; for (let i = 0; i < 6; i++) { const a = (this.dir > 0 ? 0 : PI) + (i - 2.5) * 0.45, d = 8 + k * 30; ctx.save(); ctx.globalAlpha *= 1 - k; ctx.translate(R(tx + Math.cos(a) * d), R(ty + Math.sin(a) * d + k * k * 18)); ctx.rotate(a + k * 4 * (i % 2 ? 1 : -1)); art.rect(ctx, C.out, -5, -2, 10, 4); art.rect(ctx, i % 2 ? C.wood : C.wood2, -4, -1, 8, 2); ctx.restore(); } }   // crate splinters
  }
  function armFxDraw(ctx, cam) {
    const p = this.p, a = this.def, b = a.box, f = p.face, kind = this.kind, n = this.n;
    if (this.t < a.hitAt - 2) return;
    const prog = this.t < a.hitAt ? 0.3 : this.t <= a.hitEnd ? 1 : Math.max(0, 1 - (this.t - a.hitEnd) / 5) * (this.t === a.hitEnd + 1 ? 1.06 : 1);
    const upper = kind === 'up' || (kind === 'jab' && n === 2), sh = kind === 'jab' ? (n % 2 ? 3 : -2) : 0;
    const sx = R(p.x + f * 4 - cam.x), sy = R(p.y - 22 + sh - cam.y);
    const tipY = upper ? b[1] + (kind === 'jab' ? -6 : 8) : kind === 'low' ? b[1] + b[3] - 5 : kind === 'air' ? b[1] + b[3] / 2 + 5 : b[1] + b[3] / 2;
    const ex = sx + f * (b[0] + b[2] - 8), ey = R(p.y + tipY - cam.y), tx = R(sx + (ex - sx) * prog), ty = R(sy + (ey - sy) * prog);
    if (p.connected && !this.hitT) this.hitT = this.t;
    ropeArm(ctx, sx, sy, tx, ty, { col: this.col, glove: this.glove, r: kind === 'jab' && n === 3 ? 7 : 5, t: this.t, out: this.t < a.hitAt + 1, slack: 0.8, impact: this.hitT && this.t - this.hitT < 3 });
  }
  function dressArms(p, z) {
    z.shots.forEach(s => {
      if (s.bando || s.p !== p) return;
      if (typeof s.tip === 'function' && s.hs) { s.bando = 1; s.draw = armDraw; }
      else if (s.def && s.def.box && s.kind) { s.bando = 1; s.draw = armFxDraw; }
    });
  }

  // ================= I: Wind-Up: three turns of rope, like a spring =================
  const _wu = CASTS.wind_up;
  CASTS.wind_up = function (p, z) {
    const n0 = z.shots.length, r = _wu.apply(this, arguments);
    if (!isB(G)) return r;
    const coil = z.shots.slice(n0).find(s => s && typeof s.draw === 'function' && typeof s.update === 'function' && s.t === 0 && !s.p);
    if (coil) {
      const col = skinOf(p), glove = foreOf(p), f = p.face;
      coil.draw = function (ctx, cam) {
        const cx = R(p.x - f * 10 - cam.x), cy = R(p.y - 24 - cam.y), pts = [[R(p.x + f * 4 - cam.x), cy + 2]];
        for (let i = 0; i < 24; i++) { const a = i * 0.8 + this.t * 0.9, rr = 4 + i * 0.35, x = R(cx - f * i * 0.6 + Math.cos(a) * rr), y = R(cy + Math.sin(a) * rr); pts.push([x, y]); }
        ropePath(ctx, pts, col, 3);
        const [px, py] = pts[pts.length - 1];
        art.disc(ctx, C.out, px, py, 7); art.disc(ctx, glove, px, py, 6); art.line(ctx, C.wrap2, px - 4, py - 1, px + 4, py - 1, 1); art.line(ctx, C.wrap2, px - 4, py + 2, px + 4, py + 2, 1);
        if (this.t > 6) { ctx.save(); ctx.globalAlpha *= 0.6; for (let i = 0; i < 3; i++) art.line(ctx, C.w, cx + f * 6, cy - 12 + i * 10, cx + f * 14, cy - 12 + i * 10, 1); ctx.restore(); }
      };
    }
    return r;
  };

  // ================= W+O: Rubber Cannon: the slingshot band and a twang =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.bando;
  if (SIG && SIG.cast) {
    const _rc = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _rc.apply(this, arguments);
      if (!isB(G)) return r;
      const f = p.face, ax = p.x - f * 34, ay = p.y - 22;
      z.shots.push(new Vis(ax, ay, 22, (ctx, sx, sy, t) => {
        if (t < 10) {   // the band drawn back
          const hx = R(p.x - G.cam.x), hy = R(p.y - 20 - G.cam.y), k = t / 10;
          ctx.save(); ctx.globalAlpha *= 0.9;
          art.line(ctx, C.out, sx, sy - 18, hx - f * 2, hy, 3); art.line(ctx, C.band, sx, sy - 18, hx - f * 2, hy, 1);
          art.line(ctx, C.out, sx, sy + 18, hx - f * 2, hy, 3); art.line(ctx, C.band, sx, sy + 18, hx - f * 2, hy, 1);
          art.rect(ctx, C.wood2, sx - 2, sy - 21, 4, 6); art.rect(ctx, C.wood2, sx - 2, sy + 15, 4, 6);
          for (let i = 0; i < 3; i++) art.line(ctx, C.w, hx - f * (6 + i * 4), hy - 10 + i * 10, hx - f * (12 + i * 4 + k * 6), hy - 10 + i * 10, 1);   // stretch marks
          ctx.restore();
        } else {   // the twang
          const u = (t - 10) / 12;
          ctx.save(); ctx.globalAlpha *= 1 - u;
          for (let j = -1; j <= 1; j += 2) { let px = sx, py = sy + j * 18; for (let q = 1; q <= 6; q++) { const nx = sx + f * q * 4, ny = sy + j * 18 * (1 - q / 6) + Math.sin(q * 2 + t * 2) * 4 * (1 - u); art.line(ctx, C.band, R(px), R(py), R(nx), R(ny), 1); px = nx; py = ny; } }
          ctx.restore();
        }
      }));
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, t = p.t || SW.frame;
    if (p.modeT > 0) {   // Overstretch: bandage ends fluttering off his forearms
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade;
      [[d * 8, -18], [-d * 4, -17]].forEach(([ox, oy], j) => { let px = sx + ox, py = sy + oy; for (let i = 1; i <= 5; i++) { const nx = sx + ox - d * i * 2.5, ny = sy + oy + Math.sin(t * 0.4 + i + j * 2) * (1 + i * 0.5); art.line(ctx, i % 2 ? C.wrap : C.wrap2, R(px), R(py), R(nx), R(ny), 2); px = nx; py = ny; } });
      ctx.restore();
    }
    if (p.awakeT > 0) {   // Coil Form: a small fighting kite on a string over him
      const fade = Math.min(1, p.awakeT / 30), kx = sx - d * 18 + Math.sin(t * 0.05) * 6, ky = sy - 62 + Math.cos(t * 0.07) * 3;
      ctx.save(); ctx.globalAlpha *= fade;
      art.line(ctx, '#cfcfcf', sx + d * 6, sy - 22, R(kx), R(ky + 5), 1);
      PX.sprite(ctx, R(kx), R(ky), 16, 18, c => { c.rotate(Math.sin(t * 0.06) * 0.2); c.beginPath(); c.moveTo(0, -7); c.lineTo(5, 0); c.lineTo(0, 7); c.lineTo(-5, 0); c.closePath(); c.fillStyle = C.kite; c.fill(); c.beginPath(); c.moveTo(0, -7); c.lineTo(5, 0); c.lineTo(0, 0); c.closePath(); c.fillStyle = C.kite2; c.fill(); }, { outline: C.out, keepThin: true });
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isB(g || this.G) && !this.dead) aura(ctx, this, R(this.x - cam.x), R(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isB(g || this.G) && z && z.shots) dressArms(this, z); return r; };

  // ================= W+I: Hundred Hands: two giant rope arms clap on the target =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isB(g) || !z || !z.shots) return r;
    if (p.st === 8) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('bando') : null, FIN = pl ? pl.fin : 66, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  function finale(p, z, T, FIN, BU2) {
    const col = skinOf(p), glove = foreOf(p);
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 24;
      if (st <= FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2)), gap = 14 + (1 - k) * 120;
        [-1, 1].forEach(s => ropeArm(ctx, sx + s * (gap + 160), cy - 10, sx + s * gap, cy, { col, glove, r: 14, t: st, out: true, slack: 0.5, impact: st === FIN }));
      } else {
        const u = st - FIN, k = u / 16, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 59);
        [-1, 1].forEach(s => ropeArm(ctx, sx + s * 174, cy - 10, sx + s * (14 + k * 10), cy, { col, glove, r: 14, t: st, out: false, impact: u < 3 }));
        ctx.save(); ctx.globalAlpha *= 1 - k;
        for (let i = 0; i < 2; i++) { const rr = 10 + k * (30 + i * 20); for (let j = 0; j < 20; j++) { const a = j / 20 * PI * 2; art.rect(ctx, i ? C.band2 : C.w, R(sx + Math.cos(a) * rr), R(cy + Math.sin(a) * rr * 0.8), 2, 2); } }
        ctx.restore();
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
