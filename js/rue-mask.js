'use strict';
// Shattered Worlds — Rue's masks (2026-11-20, the hero-look rework: cool, not cute). Her story: Pell's best spy, with no
// face, no voice and no shape of her own - she wears a white theatre mask with a painted smile and becomes whoever she
// copies. Peach, pink, porcelain white. Her shots were dots and her copies plain ghosts. Now the mask is everywhere: a
// porcelain mask with hollow black eyes and a thin painted smile, spinning when she throws it, flipping when she steps
// through, worn by every copy she makes - and when it breaks, it cracks. Crisp pixel art (js/pixel-kit.js; the mask
// baked once per expression and turn). Draw-only: every hit, hitbox and timing stays as it was. Loaded after
// js/elixa-flask.js.
//   U      Copy: the copied move plays with her mask flickering over her; with nothing to copy she throws a mask
//   S+U    Mirror Step: the mask flips round where she leaves and where she lands, a pink cut between
//   I      Masquerade: the three copies of the target each wear the mask
//   S+I    Perfect Copy: the mask over her both times; with nothing to copy, two masks thrown
//   W+O    Echo: the echo wears a second mask
//   J      the last blow leaves a small mask that cracks and falls
//   S+O    Quick Study: a second mask spins in her hand, its smile changing      O  Thousand Faces: masks circling
//          her, each tinted another hero's colour (both small on purpose: the view stays clear)
//   W+I    Masquerade Ball: every borrowed face wears the mask; on the finishing blow (js/ult-grand.js) the masks
//          close in a ring round the target and all crack and shatter at once on an impact frame
// SW.rueMask.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !CASTS.copy_cat || !CASTS.masquerade) return;
  const RM = SW.rueMask = { on: true };
  const isR = g => !!(RM.on && g && g.state && g.state.hero === 'rue');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#1a0e14', por: '#fbf6f0', por2: '#e0d4cc', por3: '#b8a8a0', eye: '#120810', red: '#c81d4a', pink: '#ffadad', peach: '#ffd6a5', w: '#ffffff' };
  const TINT = ['#ffd24a', '#4fc3f7', '#ff5a1f', '#7dffb2', '#9d6cff', '#ef476f', '#5ec8d8', '#f0e0a0'];

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  // the mask: s its height; expr 0 smile, 1 flat, 2 frown; crack draws a break; edge (0..1) turns it edge-on
  function mask(ctx, x, y, s, o) {
    o = o || {};
    const S = Math.max(6, R(s)), step = ((R((o.ang || 0) / (PI / 8)) % 16) + 16) % 16, expr = o.expr || 0, crack = o.crack ? 1 : 0, tint = o.tint || '';
    const edge = Math.max(0.15, Math.abs(Math.cos((o.flip || 0) * PI))), ew = Math.max(1, R(edge * 4)), b = S * 2 + 6;
    const cv = baked('m' + S + '_' + step + expr + crack + tint + ew, b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.rotate(step * PI / 8); q.scale(ew / 4, 1); const u = S / 12;
      q.beginPath(); q.moveTo(0, -6 * u); q.bezierCurveTo(4.8 * u, -6 * u, 5 * u, 1 * u, 3.6 * u, 4 * u); q.quadraticCurveTo(0, 7 * u, -3.6 * u, 4 * u); q.bezierCurveTo(-5 * u, 1 * u, -4.8 * u, -6 * u, 0, -6 * u); q.closePath(); q.fillStyle = C.por; q.fill();   // the face
      q.beginPath(); q.moveTo(2.6 * u, -5.4 * u); q.bezierCurveTo(4.6 * u, -3 * u, 4.6 * u, 1 * u, 3.2 * u, 3.6 * u); q.lineTo(2.2 * u, 3 * u); q.bezierCurveTo(3.4 * u, 0, 3.4 * u, -3 * u, 2.6 * u, -5.4 * u); q.fillStyle = C.por2; q.fill();   // its shaded side
      if (tint) { q.fillStyle = tint; q.fillRect(-4 * u, -6 * u, 8 * u, 1.2 * u); }
      q.fillStyle = C.eye; [-1, 1].forEach(e => { q.beginPath(); q.ellipse(e * 1.8 * u, -1.4 * u, 1.1 * u, 0.7 * u, e * -0.35, 0, PI * 2); q.fill(); });   // hollow eyes
      q.strokeStyle = C.red; q.lineWidth = Math.max(1, u * 0.7); q.beginPath();
      if (expr === 0) { q.moveTo(-2.4 * u, 2 * u); q.quadraticCurveTo(0, 4.4 * u, 2.4 * u, 2 * u); } else if (expr === 1) { q.moveTo(-2 * u, 2.8 * u); q.lineTo(2 * u, 2.8 * u); } else { q.moveTo(-2.2 * u, 3.4 * u); q.quadraticCurveTo(0, 1.6 * u, 2.2 * u, 3.4 * u); }
      q.stroke();
      q.fillStyle = C.pink; q.fillRect(-3.4 * u, 0.6 * u, 1 * u, 0.6 * u); q.fillRect(2.4 * u, 0.6 * u, 1 * u, 0.6 * u);   // painted cheeks
      if (crack) { q.strokeStyle = C.out; q.lineWidth = 1; q.beginPath(); q.moveTo(0.4 * u, -6 * u); q.lineTo(-0.6 * u, -2.6 * u); q.lineTo(1 * u, -0.4 * u); q.lineTo(-0.2 * u, 3 * u); q.lineTo(0.8 * u, 5.6 * u); q.moveTo(-0.6 * u, -2.6 * u); q.lineTo(-3 * u, -3.4 * u); q.stroke(); }
    }, { outline: C.out, keepThin: true }));
    ctx.save(); if (o.a !== undefined) ctx.globalAlpha *= clamp01(o.a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore();
  }
  RM.mask = mask;
  function shatter(ctx, x, y, s, k, seed) {   // porcelain pieces flying from a broken mask
    for (let i = 0; i < 7; i++) { const an = i / 7 * PI * 2 + (seed || 0), rr = k * (s * 0.6 + i * 2), px = R(x + Math.cos(an) * rr), py = R(y + Math.sin(an) * rr + k * k * 20); ctx.save(); ctx.globalAlpha *= 1 - k; art.rect(ctx, C.out, px - 1, py - 1, 4, 3); art.rect(ctx, i % 3 ? C.por : C.por2, px, py, 2, 1); if (i === 2) art.rect(ctx, C.red, px, py, 1, 1); ctx.restore(); }
  }
  const headOf = (sy, h) => sy - (h || 36);

  // ================= masks thrown (the mime shots) =================
  function dressShots(z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.rue || !(s.r === 4 || s.r === 5) || s.w !== 12 || s.h !== 12 || s.life !== 40) return;
      s.rue = 1;
      s.render = (ctx, x, y, q) => { const t = q.t || 0; mask(ctx, x, y, 18, { ang: t * 0.6 * (Math.sign(q.vx) || 1) }); ctx.save(); ctx.globalAlpha *= 0.5; art.line(ctx, C.pink, R(x - (Math.sign(q.vx) || 1) * 8), R(y), R(x - (Math.sign(q.vx) || 1) * 16), R(y), 1); ctx.restore(); };
    });
  }
  // ================= U / S+I: Copy: the mask flickers over her =================
  const maskOver = (p, z, life) => z.shots.push(new Vis(p.x, p.y, life, (ctx, sx, sy, t) => { if (t % 4 === 3) return; mask(ctx, sx + p.face * 2, headOf(sy, 34), 14, { a: (1 - t / life) * 0.9, expr: t < 4 ? 1 : 0 }); }, v => { v.x = p.x; v.y = p.y; }));
  ['copy_cat', 'perfect_copy'].forEach(id => {
    const f = CASTS[id]; if (!f) return;
    CASTS[id] = function (p, z) { const r = f.apply(this, arguments); if (isR(G) && z && z.shots) maskOver(p, z, 16); return r; };
  });

  // ================= S+U: Mirror Step: the mask flips where she leaves and lands =================
  const _ms = CASTS.mirror_step;
  if (_ms) CASTS.mirror_step = function (p, z) {
    const x0 = p.x, y0 = p.y, r = _ms.apply(this, arguments);
    if (!isR(G) || p.x === x0) return r;
    const x1 = p.x;
    z.shots.push(new Vis(x0, y0, 14, (ctx, sx, sy, t) => { const k = t / 14, dx = x1 - x0; mask(ctx, sx, headOf(sy, 34), 14, { flip: k, a: 1 - k }); mask(ctx, sx + dx, headOf(sy, 34), 14, { flip: 1 - k, a: 1 - k * 0.6, expr: 2 }); ctx.save(); ctx.globalAlpha *= 1 - k; art.line(ctx, C.pink, sx, sy - 22, R(sx + dx), sy - 22, 1); ctx.restore(); }));
    return r;
  };

  // ================= the copies she makes wear the mask (Masquerade, Echo, the ultimate's faces) =================
  function dressCopies(z) {
    z.shots.forEach(s => {
      if (s.rue || !(s instanceof Vis) || typeof s.render !== 'function' || !(s.life === 16 || s.life === 24 || s.life === 12)) return;
      const src = String(s.render); s.rue = 1;
      if (src.indexOf('art.draw(ctx, sh') < 0) return;
      const _r = s.render, echo = s.life === 24, n = R(s.x * 7) % TINT.length;
      s.render = function (ctx, sx, sy, t) { const o = _r.apply(this, arguments); mask(ctx, sx, headOf(sy, 34), 13, { a: echo ? 0.6 : 0.9, expr: echo ? 1 : 0, tint: s.life === 12 ? TINT[n] : '' }); return o; };
    });
  }

  // ================= J: the last blow leaves a mask that cracks =================
  function dressJ(p, z) {
    const a = p.atk;
    if (!a || !a.fin || (p.state !== 'attack' && p.state !== 'airatk') || p.st !== a.hitAt) return;
    const d = p.face, x = p.x + d * 30, y = p.y - 24;
    z.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => { const k = t / 22; if (t < 10) mask(ctx, sx, sy + k * 6, 13, { crack: t > 4, expr: t > 4 ? 2 : 0 }); else shatter(ctx, sx, sy + 6, 13, (t - 10) / 12, 1); }));
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (!behind && p.modeT > 0) {   // Quick Study: a second mask spinning in her hand, its smile changing
      const fade = Math.min(1, p.modeT / 30);
      mask(ctx, sx + d * 11, sy - 20, 9, { flip: (t * 0.02) % 1, expr: (t >> 5) % 3, a: fade });
    }
    if (p.awakeT > 0) {   // Thousand Faces: masks circling her, each tinted another hero's colour
      const fade = Math.min(1, p.awakeT / 30);
      for (let i = 0; i < 5; i++) { const an = t * 0.04 + i / 5 * PI * 2, s = Math.sin(an); if ((s < 0) !== behind) continue; mask(ctx, sx + Math.cos(an) * 20, sy - 24 + s * 6, 9, { tint: TINT[i], a: fade * (0.6 + 0.4 * (s + 1) / 2) }); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isR(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isR(g || this.G) && z && z.shots && !this.dead) { dressShots(z); dressCopies(z); dressJ(this, z); } return r; };

  // ================= W+I: Masquerade Ball =================
  const _mb = N.ULT && N.ULT.masquerade_ball;
  if (_mb) N.ULT.masquerade_ball = function (p, z, foes) {
    const r = _mb.apply(this, arguments);
    if (!isR(G) || !z || !z.shots) return r;
    dressCopies(z);
    if (p.st === 6) {
      const UC = SW.ultCinema, cine = UC && UC.on && UC.heroes.indexOf('rue') >= 0, UG = SW.ultGrand, pl = !cine && UG && UG.on && UG.planOf ? UG.planOf('rue') : null;
      const FIN = cine ? (UC.FIN || 100) : pl ? pl.fin : 64, BU2 = cine ? 74 : pl ? Math.max(74, FIN - 30) : 30;
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow: the masks close in a ring round the target and all crack and shatter at once
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const cy = sy - 26;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2)), rr = 70 - k * 40;
        mask(ctx, sx, cy - 6, 44, { expr: st > FIN - 10 ? 1 : 0, crack: st >= FIN - 4, a: 0.9 * Math.min(1, k * 2) });   // her own mask, huge, behind them: the smile widens
        for (let i = 0; i < 8; i++) { const an = i / 8 * PI * 2 + st * 0.04; mask(ctx, sx + Math.cos(an) * rr, cy + Math.sin(an) * rr * 0.6, 20, { tint: TINT[i], expr: k > 0.8 ? 1 : 0, crack: st >= FIN - 4, a: Math.min(1, k * 3) }); }
      } else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 101);
        for (let i = 0; i < 8; i++) { const an = i / 8 * PI * 2 + FIN * 0.04, x = sx + Math.cos(an) * 30, y = cy + Math.sin(an) * 18; if (u < 3) mask(ctx, x, y, 20, { crack: true, expr: 2, tint: TINT[i] }); else shatter(ctx, x, y, 20, Math.min(1, (u - 3) / 15), i); }
        if (u < 4) mask(ctx, sx, cy - 6, 44, { crack: true, expr: 2, mono: ik < 0.5 ? '#ffffff' : undefined }); else shatter(ctx, sx, cy - 6, 44, Math.min(1, (u - 4) / 14), 9);   // and the great mask breaks
        if (u >= 6 && u < 16) mask(ctx, sx, cy - 30 - (u - 6), 12, { expr: 1, a: 1 - (u - 6) / 10 });   // her own, lowered: blank
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
