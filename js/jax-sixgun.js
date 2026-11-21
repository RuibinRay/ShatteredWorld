'use strict';
// Shattered Worlds — Jax's six-gun (2026-11-20, the hero-look rework: cool, not cute). His story: keeper of the Long Bar at
// Mile Zero; "five to make a point, the sixth to end the conversation"; his look: a six-shot revolver raised beside his
// face, still smoking. His bullets were 8x2 boxes. Now every shot is a gunshot: a four-point muzzle star, a curl of smoke
// that hangs, a brass casing that spins away, and a hot tracer with a brass streak; and his revolver is drawn as crisp
// pixel art by js/pixel-kit.js (blued barrel, fluted cylinder, walnut grip, a brass trigger guard). Draw-only: every hit,
// hitbox and timing stays as it was. Loaded after js/moro-shadow.js.
//   U      Quick Shot: muzzle star, smoke, an ejected casing, a tracer; every sixth (DEAD-EYE) a long flash, a heavy
//          slug with a long tracer and a cylinder-click ring
//   S+U    Trick Shot: the tracer kinks at every bank, with a spark and a puff of dust off the wall
//   I      Fan the Hammer: his free hand fans the hammer, six flashes walk up, the smoke hangs in a cloud
//   S+I    Lucky Coin: a gold coin spins up edge-on to face; the shot pings it and five tracers split off
//   W+O    Ricochet: one glowing slug with a long tracer that zig-zags, a ping star at each bounce
//   J      his combo: the revolver pistol-whips through every hit; the last is a shot point-blank
//   S+O    Dead Eye: a six-chamber cylinder over his head, the chambers he has fired lit, a glint in one eye
//   O      Outlaw Form: a small dust devil round his boots, a sun-glint on his hat brim (small on purpose)
//   W+I    High Noon: the sun at its height, red crosshairs lock on every foe and the tracers come in six; on the
//          finishing blow (js/ult-grand.js) the crosshair closes on the target, a cylinder spins shut beside it and
//          the sixth shot lands on an impact frame
// SW.jaxGun.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.quick_shot || !CASTS.trick_shot || !CASTS.fan_hammer) return;
  const JG = SW.jaxGun = { on: true };
  const isJ = g => !!(JG.on && g && g.state && g.state.hero === 'jax');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // gunmetal, walnut, brass, flash, dust, the red of the crosshair
  const PAL = ['#0c0c12', '#1e2230', '#3a4050', '#6a7488', '#a8b4c8', '#4a2a18', '#7a4a2a', '#a8742a', '#ffd24a', '#fff7d0', '#ffffff', '#c86a3a', '#ff4a3a'];
  const C = { out: PAL[0], g1: PAL[1], g2: PAL[2], g3: PAL[3], g4: PAL[4], wal: PAL[5], wal2: PAL[6], brass: PAL[7], gold: PAL[8], flash: PAL[9], w: PAL[10], dust: PAL[11], red: PAL[12] };

  // ---------- the revolver: (0, 0) the grip's top, the barrel along +x; s its length ----------
  function gunVec(c, s) {
    const u = s / 16;
    c.fillStyle = C.g2; c.fillRect(2 * u, -3 * u, 13 * u, 2 * u);            // barrel
    c.fillStyle = C.g4; c.fillRect(2 * u, -3 * u, 13 * u, Math.max(1, u * 0.6));
    c.fillStyle = C.g2; c.fillRect(14 * u, -4 * u, u, u);                     // front sight
    c.fillStyle = C.g3; c.fillRect(-1 * u, -4 * u, 5 * u, 4 * u);             // the cylinder, fluted
    c.fillStyle = C.g1; for (let i = 0; i < 3; i++) c.fillRect((-0.5 + i * 1.6) * u, -3.5 * u, Math.max(1, u * 0.5), 3 * u);
    c.fillStyle = C.g2; c.fillRect(-3 * u, -4 * u, 2 * u, 3 * u);             // frame and hammer
    c.fillRect(-4 * u, -5 * u, 2 * u, 1.5 * u);
    c.fillStyle = C.wal; c.beginPath(); c.moveTo(-3 * u, -1 * u); c.lineTo(0, -1 * u); c.lineTo(-2 * u, 6 * u); c.lineTo(-5 * u, 6 * u); c.closePath(); c.fill();   // walnut grip
    c.fillStyle = C.wal2; c.fillRect(-3 * u, 0, Math.max(1, u * 0.8), 4 * u);
    c.strokeStyle = C.brass; c.lineWidth = Math.max(1, u * 0.6); c.beginPath(); c.arc(0.5 * u, 0.5 * u, 1.6 * u, 0, PI); c.stroke();   // brass trigger guard
  }
  function gun(ctx, x, y, s, ang, dir, o) {
    o = o || {};
    PX.sprite(ctx, x, y, s * 1.8, s * 1.8, c => { if (dir < 0) c.scale(-1, 1); c.rotate(ang); gunVec(c, s); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  JG.gun = gun;
  // a four-point muzzle star (k 0 -> 1), long and thin along the shot for a dead-eye
  function star(ctx, x, y, dir, k, big) {
    if (k < 0 || k >= 1) return;
    const L = (big ? 22 : 9) * (1 - k * 0.6), S = (big ? 7 : 4) * (1 - k);
    ctx.save(); ctx.globalAlpha = 1 - k * 0.7;
    art.line(ctx, C.gold, Math.round(x), Math.round(y), Math.round(x + dir * L), Math.round(y), 3);
    art.line(ctx, C.flash, Math.round(x), Math.round(y), Math.round(x + dir * L * 0.8), Math.round(y), 1);
    art.line(ctx, C.gold, Math.round(x), Math.round(y - S), Math.round(x), Math.round(y + S), 1);
    art.line(ctx, C.gold, Math.round(x - dir * 3), Math.round(y - S * 0.6), Math.round(x + dir * 3), Math.round(y + S * 0.6), 1);
    art.rect(ctx, C.w, Math.round(x) - 1, Math.round(y) - 1, 3, 3);
    ctx.restore();
  }
  function shot(z, x, y, dir, big) {   // everything that happens at the muzzle: the flash, the smoke, the casing
    z.shots.push(new Vis(x, y, big ? 9 : 6, (ctx, sx, sy, t) => star(ctx, sx, sy, dir, t / (big ? 9 : 6), big)));
    z.shots.push(new Vis(x, y, 40, (ctx, sx, sy, t) => {   // a curl of smoke that rises and hangs
      ctx.save();
      for (let i = 0; i < 4; i++) { const u = clamp01(t / 40 - i * 0.08); if (u <= 0) continue; ctx.globalAlpha = 0.45 * (1 - u); art.rect(ctx, i % 2 ? '#8a8a9a' : '#c8c8d4', Math.round(sx + dir * (4 + i * 2) + Math.sin(t * 0.15 + i) * 2), Math.round(sy - u * 14 - i * 2), 2 + (i % 2), 2); }
      ctx.restore();
    }));
    const vx = -dir * rand(0.8, 1.6), vy = -rand(2, 3);   // the brass casing, spinning away
    z.shots.push(new Vis(x - dir * 10, y, 26, (ctx, sx, sy, t) => { const xx = sx + vx * t, yy = sy + vy * t + 0.18 * t * t; art.rect(ctx, t % 4 < 2 ? C.brass : C.gold, Math.round(xx), Math.round(yy), t % 4 < 2 ? 2 : 1, t % 4 < 2 ? 1 : 2); }));
  }
  function tracer(ctx, x, y, q, len, big) {   // a hot tracer behind a bullet, along its path
    const sp = Math.hypot(q.vx, q.vy) || 1, ux = q.vx / sp, uy = q.vy / sp, L = Math.min(len, (q.t + 1) * sp);
    ctx.save();
    ctx.globalAlpha = 0.5; art.line(ctx, C.brass, Math.round(x - ux * L), Math.round(y - uy * L), Math.round(x), Math.round(y), big ? 3 : 1);
    ctx.globalAlpha = 1; art.line(ctx, C.gold, Math.round(x - ux * L * 0.5), Math.round(y - uy * L * 0.5), Math.round(x), Math.round(y), big ? 2 : 1);
    art.rect(ctx, C.w, Math.round(x) - (big ? 2 : 1), Math.round(y) - 1, big ? 4 : 2, 2);
    if (big) { art.rect(ctx, C.flash, Math.round(x - ux * 3) - 1, Math.round(y - uy * 3) - 1, 3, 3); }
    ctx.restore();
  }
  function ping(z, x, y) {   // a ricochet: a small white star and a puff of dust off what it hit
    z.shots.push(new Vis(x, y, 8, (ctx, sx, sy, t) => { const k = t / 8, L = 6 * (1 - k); ctx.save(); ctx.globalAlpha = 1 - k; art.line(ctx, C.w, sx - L, sy, sx + L, sy, 1); art.line(ctx, C.w, sx, sy - L, sx, sy + L, 1); art.rect(ctx, C.gold, sx - 1, sy - 1, 2, 2); ctx.restore(); }));
    for (let i = 0; i < 5; i++) part(x, y, i % 2 ? C.dust : '#d8b48a', rand(-1.5, 1.5), rand(-1.5, 0.5), 16, 2, 0.05);
  }
  const muzzle = p => [p.x + p.face * 16, p.y - 21];

  // ================= dressing his bullets =================
  function dressNew(p, z, n0, opt) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.jax || s.team === 'enemy') return;
      s.jax = 1;
      const big = !!(s.heavy && s.pierce) || opt.big, path = opt.kinks ? [[s.x, s.y]] : null;
      s.render = (ctx, x, y, q) => {
        if (path) {   // the kinked tracer: every bank it took, then the bullet
          const cam = G.cam; ctx.save(); ctx.globalAlpha = 0.75;
          for (let i = 0; i < path.length; i++) { const a = path[i], b = path[i + 1] || [q.x, q.y]; art.line(ctx, i === path.length - 1 ? C.gold : C.brass, Math.round(a[0] - cam.x), Math.round(a[1] - cam.y), Math.round(b[0] - cam.x), Math.round(b[1] - cam.y), 1); }
          ctx.restore(); art.rect(ctx, C.w, Math.round(x) - 1, Math.round(y) - 1, 3, 3);
        } else tracer(ctx, x, y, q, big ? 60 : 22, big);
      };
      if (path) {
        let vx = s.vx, vy = s.vy;
        const _th = s.think;
        s.think = function () { const r = _th ? _th.apply(this, arguments) : undefined; if (Math.sign(this.vx) !== Math.sign(vx) || Math.abs(this.vy - vy) > 1.5) { path.push([this.x, this.y]); ping(z, this.x, this.y); } vx = this.vx; vy = this.vy; return r; };
      }
      const _end = s.onEnd;
      s.onEnd = function (g, zz, impact) { if (zz && zz.shots && impact) ping(zz, this.x, this.y); return _end ? _end.apply(this, arguments) : undefined; };
    });
  }

  // ================= U: Quick Shot =================
  const _qs = CASTS.quick_shot;
  CASTS.quick_shot = function (p, z) {
    const n0 = z.shots.length, r = _qs.apply(this, arguments);
    if (!isJ(G)) return r;
    const dead = (p.cyl || 0) % 6 === 0, [mx, my] = muzzle(p);
    dressNew(p, z, n0, {});
    shot(z, mx, my, p.face, dead);
    if (dead) z.shots.push(new Vis(p.x, p.y, 14, (ctx, sx, sy, t) => { const k = t / 14; ctx.save(); ctx.globalAlpha = 1 - k; art.ring(ctx, C.gold, sx, sy - 22, Math.round(8 + k * 22)); for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; art.rect(ctx, C.flash, Math.round(sx + Math.cos(a) * (8 + k * 22)), Math.round(sy - 22 + Math.sin(a) * (8 + k * 22)), 2, 2); } ctx.restore(); }));   // the cylinder clicks round
    return r;
  };

  // ================= S+U: Trick Shot =================
  const _ts = CASTS.trick_shot;
  CASTS.trick_shot = function (p, z) {
    const n0 = z.shots.length, r = _ts.apply(this, arguments);
    if (!isJ(G)) return r;
    dressNew(p, z, n0, { kinks: true });
    const [mx, my] = muzzle(p); shot(z, mx, my, p.face, false);
    return r;
  };

  // ================= I: Fan the Hammer =================
  const _fh = CASTS.fan_hammer;
  CASTS.fan_hammer = function (p, z) {
    const n0 = z.shots.length, r = _fh.apply(this, arguments);
    if (!isJ(G)) return r;
    z.shots.slice(n0).forEach((l, i) => {   // each of the six: wrap its Later so the flash and the dressing land with it
      if (typeof l.fn !== 'function') return;
      const fn = l.fn;
      l.fn = function () { const m = z.shots.length, out = fn.apply(this, arguments); if (!p.dead) { dressNew(p, z, m, { big: i === 5 }); const [mx, my] = muzzle(p); shot(z, mx, my - i, p.face, i === 5); } return out; };
    });
    z.shots.push(new Vis(p.x, p.y, 26, (ctx, sx, sy, t) => {   // his free hand fanning the hammer: a blur over the gun
      const d = p.face, up = t % 4 < 2;
      gun(ctx, sx + d * 10, sy - 21, 14, 0, d);
      ctx.save(); ctx.globalAlpha = 0.75; art.rect(ctx, '#c89870', Math.round(sx + d * (3 + (up ? 0 : 3))), sy - (up ? 30 : 25), 4, 3); art.rect(ctx, '#e8c8a0', Math.round(sx + d * (4 + (up ? 3 : 0))), sy - (up ? 26 : 29), 3, 1); ctx.restore();
    }, v => { v.x = p.x; v.y = p.y; if (p.dead) v.gone = true; }));
    return r;
  };

  // ================= S+I: Lucky Coin =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.jax;
  if (BU && BU.cast) {
    const _lc = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _lc.apply(this, arguments);
      if (!isJ(G)) return r;
      const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 16 && s.render);
      if (v) {
        const rise = t => t * 3.4 - t * t * 0.07;
        v.render = (ctx, x, y, t) => {
          const yy = Math.round(y - rise(t)), face = Math.cos(t * 0.8);
          PX.sprite(ctx, x, yy, 12, 12, c => { c.scale(Math.max(0.15, Math.abs(face)), 1); c.beginPath(); c.arc(0, 0, 4, 0, PI * 2); c.fillStyle = face > 0 ? C.gold : C.brass; c.fill(); c.fillStyle = C.flash; c.fillRect(-2, -2, 2, 2); c.strokeStyle = C.brass; c.lineWidth = 1; c.beginPath(); c.arc(0, 0, 2.5, 0, PI * 2); c.stroke(); }, { pal: PAL, outline: C.out, clean: false, keepThin: true });
          if (t === 15) star(ctx, x, yy, 1, 0.2, true);
        };
        const _tk = v.tick;
        v.tick = function (vv, g, zz) { const m = zz.shots.length, out = _tk ? _tk.apply(this, arguments) : undefined; if (vv.t === 15) { const [mx, my] = muzzle(p); shot(zz, mx, my, p.face, false); ping(zz, vv.x, vv.y - rise(15)); } return out; };
      }
      // the five bullets come later, off the coin: dress them as they appear
      const watch = new Vis(p.x, p.y, 40, null, () => dressNew(p, z, 0, {}));
      z.shots.push(watch);
      return r;
    };
  }

  // ================= W+O: Ricochet =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.jax;
  if (SIG && SIG.cast) {
    const _rc = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _rc.apply(this, arguments);
      if (!isJ(G)) return r;
      const [mx, my] = muzzle(p); shot(z, mx, my, p.face, true);
      z.shots.slice(n0).forEach(s => {
        if (!s.paint) return;
        const pts = [];
        let vx = s.vx;
        s.paint = (ctx, x, y, q) => {
          const cam = G.cam; pts.push([q.x, q.y]); if (pts.length > 26) pts.shift();
          if (Math.sign(q.vx || vx) !== Math.sign(vx)) { ping(G.zone, q.x, q.y); }
          vx = q.vx || vx;
          ctx.save();
          for (let i = 1; i < pts.length; i++) { ctx.globalAlpha = i / pts.length; art.line(ctx, i > pts.length - 6 ? C.gold : C.brass, Math.round(pts[i - 1][0] - cam.x), Math.round(pts[i - 1][1] - cam.y), Math.round(pts[i][0] - cam.x), Math.round(pts[i][1] - cam.y), 2); }
          ctx.restore();
          art.rect(ctx, C.flash, Math.round(x) - 2, Math.round(y) - 2, 4, 4); art.rect(ctx, C.w, Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        };
      });
      return r;
    };
  }

  // ================= his combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // the revolver pistol-whips through every hit; the last is a shot point-blank
      const k = p.st - a.hitAt, set = p.comboSet ? p.comboSet() : null, last = !!(set && a === set[set.length - 1]);
      const hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), reach = a.box ? a.box[0] + a.box[2] * 0.5 : 18;
      if (k >= -2 && k < 6) {
        const sw = ease((k + 2) / 3), ang = last ? 0 : -1.1 + sw * 1.6;
        gun(ctx, sx + d * (4 + reach * 0.6 * sw), hy - 2, 14, ang, d, { a: k < 4 ? 1 : 1 - (k - 4) / 2 });
        if (!last && k >= 0 && k < 3) { ctx.save(); ctx.globalAlpha = 1 - k / 3; art.line(ctx, C.w, Math.round(sx + d * (reach - 2)), hy - 8, Math.round(sx + d * (reach + 8)), hy + 4, 1); ctx.restore(); }
        if (last && k >= 0 && k < 6) star(ctx, sx + d * (4 + reach * 0.6 + 14), hy - 4, d, k / 6, true);
      }
    }
    if (p.modeT > 0) {   // Dead Eye: the cylinder over his head, the chambers he has fired lit; a glint in one eye
      const fade = Math.min(1, p.modeT / 30), n = (p.cyl || 0) % 6, cx = sx, cy = sy - (p.h || 34) - 24;
      ctx.save(); ctx.globalAlpha = fade;
      art.disc(ctx, C.g1, cx, cy, 6); art.disc(ctx, C.g2, cx, cy, 5);
      for (let i = 0; i < 6; i++) { const ang = -PI / 2 + i / 6 * PI * 2; art.rect(ctx, i < n ? C.gold : i === 5 ? C.red : C.g1, Math.round(cx + Math.cos(ang) * 3.4) - 1, Math.round(cy + Math.sin(ang) * 3.4) - 1, 2, 2); }
      if (p.t % 50 < 6) art.rect(ctx, C.w, sx + d * 3, sy - (p.h || 34) + 5, 2, 1);
      ctx.restore();
    }
    if (p.awakeT > 0) {   // Outlaw Form: a small dust devil round his boots, a sun-glint on the hat brim
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = 0.7 * fade;
      for (let i = 0; i < 10; i++) { const a = p.t * 0.25 + i * 0.63, r = 6 + (i % 3) * 3, yy = sy - 1 - (i % 4) * 2; art.rect(ctx, i % 2 ? C.dust : '#d8b48a', Math.round(sx + Math.cos(a) * r), Math.round(yy + Math.sin(a) * 1.5), 1, 1); }
      ctx.restore();
      if (p.t % 60 < 8) { const bx = sx - d * 6, by = sy - (p.h || 34) - 1; ctx.save(); ctx.globalAlpha = fade; art.rect(ctx, C.w, bx - 2, by, 5, 1); art.rect(ctx, C.w, bx, by - 2, 1, 5); ctx.restore(); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isJ(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: High Noon =================
  function cross(ctx, x, y, r, k) {   // a red crosshair closing in
    ctx.save(); ctx.globalAlpha = clamp01(k);
    art.ring(ctx, C.red, Math.round(x), Math.round(y), Math.round(r));
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) art.line(ctx, C.red, Math.round(x + dx * (r - 3)), Math.round(y + dy * (r - 3)), Math.round(x + dx * (r + 5)), Math.round(y + dy * (r + 5)), 1);
    art.rect(ctx, C.w, Math.round(x), Math.round(y), 1, 1);
    ctx.restore();
  }
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const L = fx.list, m = L.length, r = _uf.apply(this, arguments);
    if (!isJ(g)) return r;
    if (p.st >= 8 && p.st <= 30) for (let i = L.length - 1; i >= m; i--) if (L[i] && L[i].col === '#ff5a5a') L.splice(i, 1);   // the plain rings: the crosshairs replace them
    if (p.st === 6) {
      const sun = new Vis(0, 0, 70, (ctx, x, y, t) => {   // (screen space) the sun at its height, white and hard
        const k = Math.min(1, t / 10, (70 - t) / 10), cx = W / 2, cy = 26;
        ctx.save(); ctx.globalAlpha = 0.18 * k; ctx.fillStyle = '#fff3c4'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = k;
        art.disc(ctx, C.flash, cx, cy, 12); art.disc(ctx, C.w, cx, cy, 9);
        for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2 + t * 0.01; art.line(ctx, C.gold, Math.round(cx + Math.cos(a) * 15), Math.round(cy + Math.sin(a) * 15), Math.round(cx + Math.cos(a) * 22), Math.round(cy + Math.sin(a) * 22), 1); }
        ctx.restore();
      });
      sun.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sun._ugS = 1; z.shots.push(sun);
      foes.forEach(e => {   // a crosshair on every foe, closing in, held until the shots
        if (!e || e.dead) return;
        const v = new Vis(e.x, e.y, 64, (ctx, sx, sy, t) => { const k = ease(t / 24); cross(ctx, sx, sy - (e.h || 30) / 2, 26 - k * 14, Math.min(1, t / 4) * (t > 58 ? (64 - t) / 6 : 1)); }, vv => { if (!e.dead) { vv.x = e.x; vv.y = e.y; } });
        v._ugS = 1; z.shots.push(v);
      });
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    if (p.st >= 36 && p.st <= 66 && (p.st - 36) % 6 === 0) { const [mx, my] = muzzle(p); shot(z, mx, my, p.face, p.st === 66); }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the crosshair closes on the target, a cylinder spins shut beside it with its six
  // chambers loaded, and the sixth shot lands on an impact frame
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('jax') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 20, dir = T.x >= p.x ? 1 : -1;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2)), spin = (1 - ease((st - (FIN - 10)) / 8)) * st * 0.5;
        cross(ctx, sx, cy, 30 - k * 20, Math.min(1, k * 3));
        const gx = sx - dir * 44, gy = cy - 30;   // the cylinder, spinning shut
        PX.sprite(ctx, gx, gy, 30, 30, c => { c.rotate(spin); c.beginPath(); c.arc(0, 0, 11, 0, PI * 2); c.fillStyle = C.g3; c.fill(); c.beginPath(); c.arc(0, 0, 3, 0, PI * 2); c.fillStyle = C.g1; c.fill(); for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; c.beginPath(); c.arc(Math.cos(a) * 7, Math.sin(a) * 7, 2.4, 0, PI * 2); c.fillStyle = C.brass; c.fill(); c.fillStyle = C.gold; c.fillRect(Math.cos(a) * 7 - 1, Math.sin(a) * 7 - 1, 1, 1); } }, { pal: PAL, outline: C.out, alpha: Math.min(1, k * 3) });
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 66);
        cross(ctx, sx, cy, 8 + k * 20, 1 - k);
        if (k < 0.4) { ctx.save(); ctx.globalAlpha = 1 - k / 0.4; art.line(ctx, C.gold, Math.round(sx - dir * 200), cy - 8, sx, cy, 3); art.line(ctx, C.w, Math.round(sx - dir * 120), cy - 5, sx, cy, 1); ctx.restore(); }
        star(ctx, sx, cy, dir, k, true);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult') return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
