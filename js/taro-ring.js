'use strict';
// Shattered Worlds — Taro's ring (2026-11-20, the hero-look rework: cool, not cute). His story: champion of the village
// ring, "nobody has ever pushed him out"; alias Mountain, the Unmovable; a ring of packed earth, salt flying from his hand,
// a golden belt. His shoves were cream slash arcs and his stomp a plain ring. Now his strength shows as force: a great
// open palm of gold light (thick fingers, a heavy heel of the hand, a palm line) that slams out with every shove; the
// floor heaves in slabs when he stamps; salt flies as glittering crystals; the straw rope of the ring is drawn on the
// floor. Drawn as crisp pixel art by js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was. Loaded after
// js/hart-spear.js.
//   U      Palm Push: a great gold palm slams out with each of the three shoves, shove lines behind it
//   S+U    Grab and Throw: a gold palm clamps the foe and a throw arc trails over his shoulder; dust where they land
//   I      Shiko Stomp: the floor heaves up in slabs both ways from his foot, earth chips flying, cracks running out
//   S+I    Belly Slam: a shadow grows under the held foe as they fall, then a crater of cracks and dust
//   W+O    Salt Toss: a fan of glittering salt crystals
//   J      the finisher: the great palm with salt flying off it
//   S+O    Rikishi: the straw rope of the ring on the floor round him      O  Yokozuna: the white rope belt with paper
//          zigzags at his waist (small on purpose: the view stays clear)
//   W+I    Grand Champion: the straw rope runs the length of the arena floor; a palm slams on each foe at every throw; on
//          the finishing blow (js/ult-grand.js) a palm the size of a gate comes down on the target on an impact frame and
//          the floor cracks under it
// SW.taroRing.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !CASTS.palm_push || !CASTS.shiko_stomp) return;
  const TR = SW.taroRing = { on: true };
  const isT = g => !!(TR.on && g && g.state && g.state.hero === 'taro');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const PAL = ['#1a1006', '#4a3010', '#8a5a1a', '#c08a2a', '#e9c46a', '#fff0b0', '#fff6d5', '#ffffff', '#5a4030', '#8a6a4a', '#b89a70', '#d8c8a0'];
  const C = { out: PAL[0], d1: PAL[1], d2: PAL[2], g0: PAL[3], g: PAL[4], g2: PAL[5], cream: PAL[6], w: PAL[7], e0: PAL[8], e1: PAL[9], e2: PAL[10], straw: PAL[11] };

  // ---------- a great open palm, fingers up, seen palm-on: (0, 0) its centre, s its height ----------
  function palmVec(c, s) {
    const R = (x, y, w, h, r, col) => { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath(); c.fillStyle = col; c.fill(); };
    const u = s / 10;
    R(-3.4 * u, -1 * u, 6.8 * u, 6 * u, 1.6 * u, C.g);                 // the heavy palm
    [[-3.2, 1.25, 3.6], [-1.6, 1.4, 4.4], [0.1, 1.4, 4.6], [1.8, 1.3, 4.0]].forEach(([x, w, h]) => R(x * u, (-1 - h) * u, w * u, (h + 1.5) * u, 0.6 * u, C.g));   // four thick fingers
    c.save(); c.translate(3.2 * u, 2.2 * u); c.rotate(-0.7); R(-0.7 * u, -3.4 * u, 1.5 * u, 3.8 * u, 0.6 * u, C.g); c.restore();   // the thumb
    c.fillStyle = C.g2; c.fillRect(-2.6 * u, 0, 4.4 * u, 1.4 * u); [[-3, 1.3], [-1.3, 1.4], [0.4, 1.4]].forEach(([x, w]) => c.fillRect(x * u, -4.5 * u, w * u * 0.5, 2.6 * u));   // light on the palm and fingers
    c.strokeStyle = C.d2; c.lineWidth = Math.max(1, u * 0.35); c.beginPath(); c.moveTo(-2.6 * u, 2.6 * u); c.quadraticCurveTo(0, 1.6 * u, 2.4 * u, 3.2 * u); c.stroke();   // the palm line
    c.strokeStyle = C.g0; c.lineWidth = Math.max(1, u * 0.25); for (const x of [-1.9, -0.25, 1.45]) { c.beginPath(); c.moveTo(x * u, -2.6 * u); c.lineTo(x * u, -1.6 * u); c.stroke(); }   // knuckle creases
  }
  function palm(ctx, x, y, s, o) {
    o = o || {};
    PX.sprite(ctx, x, y, s * 1.6, s * 1.6, c => { if (o.rot) c.rotate(o.rot); palmVec(c, s); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  TR.palm = palm;
  function shove(ctx, x, y, dir, k) {   // shove lines behind a palm
    if (k >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - k;
    for (let i = 0; i < 5; i++) { const yy = y - 12 + i * 6, L = 10 + (i % 2) * 8; art.line(ctx, i % 2 ? C.g2 : C.w, Math.round(x - dir * (8 + k * 10)), yy, Math.round(x - dir * (8 + L + k * 10)), yy, 1); }
    ctx.restore();
  }
  function salt(x, y, n, dir, power) {   // glittering salt crystals
    for (let i = 0; i < n; i++) part(x + rand(-3, 3), y + rand(-3, 3), i % 3 === 0 ? C.w : i % 3 === 1 ? C.cream : '#d8f0ff', dir * rand(0.5, power) + rand(-0.5, 0.5), -rand(0.5, power * 0.8), 18 + (i % 6) * 2, i % 4 === 0 ? 2 : 1, 0.12);
  }
  function rope(ctx, x0, x1, y, a) {   // the straw rope of the ring, twisted, lying on the floor
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    for (let x = Math.round(x0); x < x1; x += 3) { const o = (x >> 1) % 3; art.rect(ctx, C.out, x, y - 2, 3, 4); art.rect(ctx, o ? C.straw : C.e2, x, y - 1 - (o === 1 ? 1 : 0), 3, 2); art.rect(ctx, C.w, x + (o === 2 ? 1 : 0), y - 1, 1, 1); }
    ctx.restore();
  }
  function ringRope(ctx, x, y, r, a) {   // the rope as a ring on the floor round him
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    const n = Math.round(r * 2.2);
    for (let i = 0; i < n; i++) { const ang = i / n * PI * 2, px = Math.round(x + Math.cos(ang) * r), py = Math.round(y + Math.sin(ang) * r * 0.2); art.rect(ctx, Math.sin(ang) < 0 ? C.e2 : C.straw, px, py, 2, 2); if (i % 3 === 0) art.rect(ctx, C.w, px, py, 1, 1); }
    ctx.restore();
  }
  function heave(z, x, y, reach) {   // the floor heaving in slabs both ways
    z.shots.push(new Vis(x, y, 26, (ctx, sx, sy, t) => {
      const k = t / 26;
      for (const d of [-1, 1]) for (let i = 0; i < 7; i++) {
        const dx = 10 + i * (reach / 7), when = i * 1.2, q = t - when; if (q < 0) continue;
        const up = Math.sin(clamp01(q / 9) * PI) * (10 - i * 0.8);
        if (up <= 0.5) continue;
        const px = Math.round(sx + d * dx), py = Math.round(sy - up);
        art.rect(ctx, C.out, px - 5, py - 1, 11, 6); art.rect(ctx, C.e1, px - 4, py, 9, 4); art.rect(ctx, C.e2, px - 4, py, 9, 1);   // a slab of packed earth
      }
      ctx.save(); ctx.globalAlpha = 1 - k; for (const d of [-1, 1]) { let px = sx; for (let i = 0; i < 6 * Math.min(1, t / 6); i++) { const nx = px + d * 10, ny = sy - Math.round(Math.abs(Math.sin(i * 2.1)) * 2); art.line(ctx, C.d1, Math.round(px), sy, Math.round(nx), ny, 1); px = nx; } } ctx.restore();   // cracks
    }));
    for (let i = 0; i < 16; i++) part(x + rand(-reach, reach), y - 2, i % 2 ? C.e1 : C.e2, rand(-2, 2), -rand(2, 5), 24, 2, 0.25);   // earth chips
  }

  // ================= U: Palm Push, and the finisher: the great palm slams out =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player;
    if (col === '#fff6d5' && isT(g) && p && g.zone && g.zone.shots && Math.abs(y - (p.y - 22)) < 4) {
      const big = (len || 30) >= 36;
      g.zone.shots.push(new Vis(p.x, p.y, 10, (ctx, sx, sy, t) => {
        const out = ease((t + 1) / 3), k = t / 10, d = p.face, px = sx + d * (14 + out * (big ? 22 : 16));
        palm(ctx, px, sy - 22, big ? 24 : 18, { rot: d * 0.15, a: 1 - ease((k - 0.6) / 0.4) });
        shove(ctx, px, sy - 22, d, k);
      }, v => { v.x = p.x; v.y = p.y; }));
      if (big) salt(p.x + p.face * 36, p.y - 24, 10, p.face, 3);
      return;
    }
    return _slash.apply(this, arguments);
  };

  // ================= S+U: Grab and Throw =================
  const _gt = CASTS.grab_throw;
  if (_gt) CASTS.grab_throw = function (p, z) {
    const e = isT(G) ? z.ents.find(q => N.isFoe(q) && (q.x - p.x) * p.face > -8 && Math.abs(q.x - p.x) < 52 && Math.abs(q.y - p.y) < 30) : null, d = p.face, x0 = p.x, y0 = p.y;
    const r = _gt.apply(this, arguments);
    if (!isT(G)) return r;
    z.shots.push(new Vis(x0, y0, 20, (ctx, sx, sy, t) => {
      const k = t / 20;
      if (t < 6) palm(ctx, sx + d * 24, sy - 24, 18, { rot: d * 0.6, a: 1 });   // the clamp
      ctx.save(); ctx.globalAlpha = 1 - k;   // the throw arc, over his shoulder
      for (let i = 0; i <= 14 * Math.min(1, t / 4); i++) { const u = i / 14, a = PI * u, x = sx + d * Math.cos(a) * 26, y = sy - 22 - Math.sin(a) * 30; art.rect(ctx, i % 2 ? C.g : C.w, Math.round(x), Math.round(y), 2, 2); }
      ctx.restore();
      if (e && t >= 2 && t < 14) { const q = (t - 2) / 12; ctx.save(); ctx.globalAlpha = 1 - q; art.ring(ctx, C.e2, sx - d * 28, sy - 2, Math.round(6 + q * 20)); ctx.restore(); }   // dust where they land
    }));
    if (e) { for (let i = 0; i < 12; i++) part(x0 - d * 28 + rand(-10, 10), y0 - 2, C.e2, rand(-2.5, 2.5), -rand(0.5, 2), 18, 2, 0.12); }
    return r;
  };

  // ================= I: Shiko Stomp =================
  const _ss = CASTS.shiko_stomp;
  CASTS.shiko_stomp = function (p, z) {
    const n0 = z.shots.length, r = _ss.apply(this, arguments);
    if (!isT(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.end);
    if (drv) {
      const _end = drv.end;
      drv.end = function (q) {
        const L = fx.list, m = L.length, out = _end.apply(this, arguments);
        for (let i = L.length - 1; i >= m; i--) if (L[i] && L[i].k === 'r' && L[i].col === '#e9c46a') L.splice(i, 1);   // the plain ring: the floor heaves instead
        heave(z, q.x, q.y, 86);
        return out;
      };
      const _step = drv.step;   // the raised leg: dust gathers under the planted foot
      drv.step = function (t) { const out = _step.apply(this, arguments); if (t < 10 && t % 2 === 0) part(p.x + rand(-6, 6), p.y - 1, C.e2, rand(-0.6, 0.6), -rand(0.2, 0.8), 14, 1, 0.02); return out; };
    }
    return r;
  };

  // ================= S+I: Belly Slam =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.taro;
  if (BU && BU.cast) {
    const _bs = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _bs.apply(this, arguments);
      if (!isT(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
      if (!drv) return r;
      const gy = p.y;
      z.shots.push(new Vis(p.x, gy, 60, (ctx, sx, sy, t) => {   // a shadow on the floor, growing as he comes down
        if (drv.gone) return;
        const h = Math.max(0, gy - p.y), w = Math.round(30 - Math.min(h, 60) * 0.25), x = Math.round(p.x - G.cam.x) + p.face * 6;
        ctx.save(); ctx.globalAlpha = 0.5; art.rect(ctx, C.out, x - w, Math.round(sy) - 2, w * 2, 3); ctx.restore();
      }, v => { if (drv.gone) v.gone = true; }));
      const _end = drv.end;
      drv.end = function (q) {
        const out = _end ? _end.apply(this, arguments) : undefined;
        z.shots.push(new Vis(q.x, q.y, 24, (ctx, sx, sy, t) => {
          const k = t / 24;
          if (t < 4) PX.impact(ctx, sx, sy - 16, t / 4, 13);
          ctx.save(); ctx.globalAlpha = 1 - k; for (let i = 0; i < 8; i++) { const a = PI + i / 7 * PI, L = 10 + ease(k * 3) * (16 + (i % 3) * 6); art.line(ctx, C.d1, sx, sy - 1, Math.round(sx + Math.cos(a) * L), Math.round(sy - 1 + Math.sin(a) * L * 0.2), 1); } ctx.restore();   // the crater's cracks
        }));
        heave(z, q.x, q.y, 50);
        return out;
      };
      return r;
    };
  }

  // ================= W+O: Salt Toss =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.taro;
  if (SIG && SIG.cast) {
    const _st = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _st.apply(this, arguments);
      if (!isT(G)) return r;
      const d = p.face;
      z.shots.push(new Vis(p.x, p.y, 22, (ctx, sx, sy, t) => {
        for (let i = 0; i < 26; i++) {   // the fan of salt: crisp crystals that turn and glint
          const a = -0.55 + (i % 9) / 8 * 1.0, sp = 2.2 + (i % 5) * 0.6, x = sx + d * (14 + Math.cos(a) * sp * t * 1.6), y = sy - 26 + Math.sin(a) * sp * t * 1.2 + 0.08 * t * t;
          const glint = (t + i) % 6 < 2;
          art.rect(ctx, glint ? C.w : i % 2 ? C.cream : '#d8f0ff', Math.round(x), Math.round(y), glint ? 2 : 1, glint ? 2 : 1);
          if (glint && i % 4 === 0) { art.rect(ctx, C.w, Math.round(x) - 2, Math.round(y), 5, 1); art.rect(ctx, C.w, Math.round(x), Math.round(y) - 2, 1, 5); }
        }
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    if (behind && p.modeT > 0) ringRope(ctx, sx, sy, 26, Math.min(1, p.modeT / 30));   // Rikishi: the straw rope ring round him
    if (!behind && p.awakeT > 0) {   // Yokozuna: the white rope belt, paper zigzags hanging from it
      const fade = Math.min(1, p.awakeT / 30), by = sy - 14;
      ctx.save(); ctx.globalAlpha = fade;
      for (let x = -8; x <= 7; x += 2) { art.rect(ctx, C.out, sx + x, by - 1, 2, 3); art.rect(ctx, x % 4 ? C.w : C.cream, sx + x, by, 2, 1); }
      for (const o of [-5, 0, 5]) { const sw = Math.round(Math.sin(p.t * 0.08 + o) * 0.8); art.rect(ctx, C.w, sx + o + sw, by + 2, 2, 2); art.rect(ctx, C.w, sx + o + 1 + sw, by + 4, 2, 2); art.rect(ctx, C.w, sx + o + sw, by + 6, 2, 2); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isT(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };

  // ================= W+I: Grand Champion =================
  const _gc = N.ULT && N.ULT.grand_champion;
  if (_gc) N.ULT.grand_champion = function (p, z, foes) {
    const r = _gc.apply(this, arguments);
    if (!isT(G)) return r;
    if (p.st === 6) {
      const gy = p.y;
      const ring = new Vis(p.x, gy, 66, (ctx, sx, sy, t) => { if (p.state !== 'ult') return; const k = ease(t / 10); rope(ctx, 0, Math.round(W * k), Math.round(gy - G.cam.y) + 1, Math.min(1, (66 - t) / 8)); });   // the straw rope runs the length of the arena
      ring._ugS = 1; z.shots.push(ring);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    if (p.st >= 12 && p.st <= 52 && (p.st - 12) % 8 === 0) foes.forEach(e => {   // at every throw, a palm slams on them
      if (!e || e.dead) return;
      const v = new Vis(e.x, e.y, 10, (ctx, sx, sy, t) => { palm(ctx, sx, sy - 26 - (1 - ease(t / 3)) * 14, 22, { a: 1 - ease((t - 6) / 4) }); }, vv => { if (!e.dead) { vv.x = e.x; vv.y = e.y; } });
      v._ugS = 1; z.shots.push(v);
    });
    return r;
  };
  // the finishing blow (js/ult-grand.js): a palm the size of a gate comes down on the target and the floor cracks
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('taro') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    let done = false;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      if (st < FIN) { const k = ease((st - (BU2 - 2)) / (FIN - BU2)), drop = ease((st - (FIN - 3)) / 3); palm(ctx, sx, sy - 34 + drop * 4, 38, { a: Math.min(1, k * 3) }); }
      else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? C.w : undefined;
        if (ik < 1) PX.impact(ctx, sx, sy - 24, ik, 17);
        palm(ctx, sx, sy - 28, 38, { mono, a: 1 - ease((k - 0.55) / 0.45) });
        ctx.save(); ctx.globalAlpha = 1 - k; for (const d of [-1, 1]) for (let b = 0; b < 2; b++) { let x = sx; for (let i = 0; i < 9; i++) { const nx = x + d * 9, ny = sy - Math.round(Math.abs(Math.sin(i * 1.7 + b)) * 3); art.line(ctx, b ? C.d2 : C.d1, Math.round(x), sy, Math.round(nx), ny, 1); x = nx; } } ctx.restore();
        if (!done) { done = true; for (let i = 0; i < 24; i++) part(T.x + rand(-40, 40), T.y - 2, i % 2 ? C.e1 : C.e2, rand(-4, 4), -rand(2, 5), 24, 2, 0.25); salt(T.x, T.y - 30, 14, 1, 3); salt(T.x, T.y - 30, 14, -1, 3); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
