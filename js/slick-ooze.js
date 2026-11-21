'use strict';
// Shattered Worlds — Slick's ooze (2026-11-20, the hero-look rework: cool, not cute). His story: the friendliest thing on
// the Drowned Line - a man of see-through green slime in a dark green vest; squash him flat and he comes back together.
// His slime was flat discs and particle blobs. Now it is a living ooze you can see into: translucent green with a dark
// rim, a wet highlight, bubbles drifting up inside it, and his grin - wide, toothy, a little too wide - on everything
// that is him. Puddles are glossy and alive. Crisp pixel art (js/pixel-kit.js for the shaped blobs). Draw-only: every
// hit, hitbox and timing stays as it was. Loaded after js/lin-palm.js.
//   U      Slime Ball: a wobbling ball of ooze with his grin in it; it splats into a puddle
//   S+U    Slide: he goes flat as a puddle with his vest floating on it and slides through
//   I      Engulf: a big see-through blob rolling forward, the grin across its front, bubbles churning as it chews
//   S+I    Split: two small grinning blobs bounce at the enemy and burst
//   W+O    Belly Flop: a splash crown when he lands
//   J      the last blow is a fist of slime that splats
//   S+O    Ooze Out: he drips, and his puddles wobble      O  King Slime: a crown of ooze on his head, dripping (both
//          small on purpose: the view stays clear)
//   W+I    Tidal Goo: puddles everywhere; on the finishing blow (js/ult-grand.js) a wave of ooze with his grin rises
//          over the target, swallows it and squeezes on an impact frame
// SW.slickOoze.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !Proj) return;
  const SO = SW.slickOoze = { on: true };
  const isS = g => !!(SO.on && g && g.state && g.state.hero === 'slick');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0b2a1a', rim: '#1b4332', d: '#2d6a4f', g: '#52b788', g2: '#74c69d', l: '#b7e4c7', l2: '#d8f3dc', w: '#ffffff', mouth: '#081c12', vest: '#1b4332' };

  // a blob of ooze, centre (x, y), radius r; squash > 1 flattens it; grin draws his mouth facing d
  function blob(ctx, x, y, r, t, o) {
    o = o || {};
    const sq = o.squash || 1, rx = r * Math.sqrt(sq), ry = r / Math.sqrt(sq), a = o.a === undefined ? 1 : o.a;
    if (a <= 0 || r < 1) return;
    ctx.save(); ctx.globalAlpha *= a;
    const wob = k => 1 + Math.sin(t * 0.35 + k * 2.1) * 0.06;
    ctx.globalAlpha *= 0.78; ctx.fillStyle = C.g;   // the body, thick enough to read
    ctx.beginPath(); for (let i = 0; i <= 20; i++) { const an = i / 20 * PI * 2, w = wob(i); const px = x + Math.cos(an) * rx * w, py = y + Math.sin(an) * ry * w; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.closePath(); ctx.fill();
    ctx.globalAlpha /= 0.78;
    if (r >= 6) {   // volume: a dark belly and a lit crown inside the body
      ctx.save(); ctx.globalAlpha *= 0.5; ctx.fillStyle = C.d; ctx.beginPath(); ctx.ellipse(x, y + ry * 0.38, rx * 0.82, ry * 0.5, 0, 0, PI * 2); ctx.fill();
      ctx.globalAlpha = ctx.globalAlpha / 0.5 * 0.4; ctx.fillStyle = C.g2; ctx.beginPath(); ctx.ellipse(x - rx * 0.1, y - ry * 0.32, rx * 0.6, ry * 0.38, 0, 0, PI * 2); ctx.fill(); ctx.restore();
    }
    const rw = r >= 14 ? 3 : 2;
    for (let i = 0; i < 28; i++) { const an = i / 28 * PI * 2, w = wob(R(i * 20 / 28)); art.rect(ctx, Math.sin(an) > 0.3 ? C.rim : C.d, R(x + Math.cos(an) * rx * w), R(y + Math.sin(an) * ry * w), rw, rw); }   // the rim
    if (r >= 12) for (let i = 0; i < 3; i++) { const dx = R(x + (i - 1) * rx * 0.45), L = 3 + R(((t * 0.15 + i * 3.1) % 1) * r * 0.35); art.rect(ctx, C.out, dx - 1, R(y + ry * 0.85), 4, L + 1); art.rect(ctx, C.g, dx, R(y + ry * 0.85), 2, L); }   // drips hanging off the bottom
    art.rect(ctx, C.l2, R(x - rx * 0.45), R(y - ry * 0.55), Math.max(2, R(rx * 0.3)), 2); art.rect(ctx, C.w, R(x - rx * 0.45), R(y - ry * 0.55), 1, 1);   // a wet highlight
    for (let i = 0; i < Math.min(5, 1 + R(r / 5)); i++) { const ph = ((t * 0.03 + i * 0.27) % 1), bx = R(x + Math.sin(i * 2.7) * rx * 0.5), by = R(y + ry * 0.6 - ph * ry * 1.2); art.rect(ctx, C.l, bx, by, 1, 1); if (i % 2) art.rect(ctx, C.l2, bx + 1, by, 1, 1); }   // bubbles drifting up inside
    if (o.grin && r >= 5) grin(ctx, x + o.grin * rx * 0.2, y + ry * 0.15, rx * 0.75, t);
    ctx.restore();
  }
  // his grin: wide, a row of small teeth, eyes as two hollows above it
  function grin(ctx, x, y, w, t) {
    const hw = Math.max(3, R(w * 0.6)), h = Math.max(2, R(w * 0.22));
    for (let i = -hw; i <= hw; i++) { const u = i / hw, cy = R(y + (1 - u * u) * h); art.rect(ctx, C.mouth, R(x + i), cy - 1, 1, 2 + R((1 - u * u) * 2)); if (i % 2 === 0 && Math.abs(u) < 0.85) art.rect(ctx, C.l2, R(x + i), cy - 1, 1, 1); }
    const ex = Math.max(2, R(hw * 0.5)), ey = R(y - h - 2), bl = t % 120 < 4;
    art.rect(ctx, C.mouth, R(x - ex) - 1, ey, 2, bl ? 1 : 2); art.rect(ctx, C.mouth, R(x + ex) - 1, ey, 2, bl ? 1 : 2);
  }
  SO.blob = blob; SO.grin = grin;
  function puddleDraw(ctx, x, y, w, t, a) {   // a glossy living puddle
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.globalAlpha *= 0.85; art.rect(ctx, C.g, x - w, y - 5, w * 2, 5); art.rect(ctx, C.d, x - w + 2, y - 2, w * 2 - 4, 2); ctx.globalAlpha /= 0.85;
    art.rect(ctx, C.rim, x - w, y - 1, w * 2, 1); art.rect(ctx, C.d, x - w - 1, y - 2, 1, 2); art.rect(ctx, C.d, x + w, y - 2, 1, 2);
    for (let i = -w + 2; i < w - 2; i += 5) { const hh = Math.sin(t * 0.12 + i * 0.4) > 0.6 ? 1 : 0; art.rect(ctx, C.g2, x + i, y - 6 - hh, 3, 2); }   // the surface moving
    if ((t >> 4) % 3 === 0) art.rect(ctx, C.w, x + ((t * 3) % (w * 2)) - w, y - 4, 2, 1);
    if (t % 50 < 10) { const k = (t % 50) / 10; art.rect(ctx, C.l, R(x + Math.sin(t) * w * 0.5), R(y - 4 - k * 4), 1, 1); }   // a bubble rising and popping
    ctx.restore();
  }
  function splash(ctx, x, y, k, n, s) {   // a crown of ooze droplets thrown up
    for (let i = 0; i < n; i++) { const an = PI + (i + 0.5) / n * PI, sp = s * (0.7 + (i % 3) * 0.15), px = x + Math.cos(an) * sp * k * 30, py = y + Math.sin(an) * sp * k * 26 + k * k * 30; ctx.save(); ctx.globalAlpha *= 1 - ease((k - 0.6) / 0.4); art.rect(ctx, C.out, R(px) - 1, R(py) - 1, 4, 4); art.rect(ctx, i % 2 ? C.g2 : C.g, R(px), R(py), 2, 2); ctx.restore(); }
  }

  // ================= his shots, puddles and blobs (found in the zone and redrawn) =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.slick) return;
      if (s.isSlime && s.p === p && typeof s.render === 'function') {   // puddles
        s.slick = 1; const life = s.life, w = 26;
        s.render = (ctx, sx, sy, t) => { t = typeof t === 'number' ? t : (s.t || 0); puddleDraw(ctx, sx, sy, w, t, Math.min(1, t / 6, (life - t) / 20)); if (p.modeT > 0) { const k = (t % 20) / 20; art.rect(ctx, C.g2, R(sx + Math.sin(t * 0.07) * w * 0.6), R(sy - 3 - Math.sin(k * PI) * 3), 1, 1); } };
        return;
      }
      if (s instanceof Proj && s.team !== 'enemy' && (s.r === 5 && s.life === 60 || s.r === 7 && s.w === 16 && s.life === 90)) {   // Slime Ball, Split
        s.slick = 1; const small = s.r === 7;
        s.render = (ctx, x, y, q) => { const t = q.t || 0, sq = 1 + Math.max(-0.25, Math.min(0.3, (q.vy || 0) * -0.05)); blob(ctx, x, y, small ? 11 : 9, t, { squash: 1 / sq, grin: Math.sign(q.vx) || 1 }); };
        return;
      }
      if (s instanceof Vis && s.life === 1 && typeof s.render === 'function' && String(s.render).indexOf("'#2d6a4f', x, y - 16, 17") >= 0) {   // Engulf's blob, drawn fresh each frame
        s.slick = 1; const d = p.face;
        s.render = (ctx, x, y) => { const t = p.t || SW.frame; blob(ctx, x + d * 4, y - 20, 28, t * 1.5, { grin: d, squash: 1.15 }); if (t % 8 < 2) for (let i = 0; i < 3; i++) art.rect(ctx, C.l2, R(x + d * 10 + rand(-8, 8)), R(y - 18 + rand(-8, 8)), 1, 1); };   // churning as it chews
      }
    });
  }

  // ================= S+U: Slide: flat as a puddle, his vest floating on it =================
  const SU = CASTS.slide;
  if (SU) CASTS.slide = function (p, z) {
    const n0 = z.shots.length, r = SU.apply(this, arguments);
    if (!isS(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), d = p.face;
    z.shots.push(new Vis(p.x, p.y, 16, (ctx, sx, sy, t) => {
      if (drv && drv.gone && t > 2) return;
      puddleDraw(ctx, sx, sy, 22, t * 3, 1); blob(ctx, sx + d * 6, sy - 5, 9, t, { squash: 3.2, grin: d });
      art.rect(ctx, C.out, sx - 6, sy - 9, 12, 4); art.rect(ctx, C.vest, sx - 5, sy - 8, 10, 2);   // the vest, floating
      ctx.save(); ctx.globalAlpha *= 0.7; for (let i = 0; i < 3; i++) art.line(ctx, C.l, R(sx - d * (24 + i * 6)), sy - 2 - i, R(sx - d * (34 + i * 8)), sy - 2 - i, 1); ctx.restore();
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= W+O: Belly Flop: a splash crown =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.slick;
  if (SIG && SIG.cast) {
    const _bf = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _bf.apply(this, arguments);
      if (!isS(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
      if (drv && drv.end) { const _e = drv.end; drv.end = function (q, zz) { const o = _e.apply(this, arguments); const x = p.x, y = p.y; (zz || z).shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => { const k = t / 22; splash(ctx, sx, sy - 2, k, 16, 1.6); blob(ctx, sx, sy - 4, 22 * (1 - k) + 2, t, { squash: 3 + k * 3, a: 1 - k }); })); return o; }; }
      return r;
    };
  }

  // ================= J: the last blow is a fist of slime that splats =================
  function dressJ(p, z) {
    const a = p.atk;
    if (!a || !a.fin || (p.state !== 'attack' && p.state !== 'airatk') || p.st !== a.hitAt) return;
    const d = p.face, x = p.x + d * 30, y = p.y - 20;
    z.shots.push(new Vis(x, y, 14, (ctx, sx, sy, t) => { const k = t / 14; if (t < 5) blob(ctx, sx - d * 6 + d * t * 2, sy, 13, t, { squash: 0.8, grin: 0 }); else splash(ctx, sx, sy + 4, (t - 5) / 9, 11, 1.1); void k; }));
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy) {
    const t = p.t || SW.frame;
    if (p.modeT > 0) {   // Ooze Out: he drips
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade;
      for (let i = 0; i < 3; i++) { const ph = ((t * 0.03 + i / 3) % 1), dx = R(sx - 6 + i * 6); art.rect(ctx, C.g, dx, R(sy - 20 + ph * 18), 1, 2 + R(ph * 2)); }
      ctx.restore();
    }
    if (p.awakeT > 0) {   // King Slime: a crown of ooze, dripping
      const fade = Math.min(1, p.awakeT / 30), cy = sy - 44;
      ctx.save(); ctx.globalAlpha *= fade;
      art.rect(ctx, C.out, sx - 7, cy - 1, 14, 5); art.rect(ctx, C.g, sx - 6, cy, 12, 3); art.rect(ctx, C.l2, sx - 5, cy, 4, 1);
      [-5, 0, 5].forEach((ox, i) => { const hh = i === 1 ? 6 : 4; art.rect(ctx, C.out, sx + ox - 2, cy - hh - 1, 4, hh + 1); art.rect(ctx, C.g2, sx + ox - 1, cy - hh, 2, hh); art.rect(ctx, C.w, sx + ox - 1, cy - hh, 1, 1); });
      const ph = (t * 0.02) % 1; art.rect(ctx, C.g, sx + 4, R(cy + 3 + ph * 6), 1, 2);
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isS(g || this.G) && !this.dead) aura(ctx, this, R(this.x - cam.x), R(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isS(g || this.G) && z && z.shots && !this.dead) { dress(this, z); dressJ(this, z); } return r; };

  // ================= W+I: Tidal Goo =================
  const _tg = N.ULT && N.ULT.tidal_goo;
  if (_tg) N.ULT.tidal_goo = function (p, z, foes) {
    const r = _tg.apply(this, arguments);
    if (!isS(G) || !z || !z.shots) return r;
    dress(p, z);
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('slick') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): a wave of ooze with his grin rises over the target, swallows it and squeezes
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const d = T.x >= p.x ? -1 : 1;
      if (st < FIN) { const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2)); blob(ctx, sx - d * (40 - k * 26), sy - 14 - k * 34, 20 + k * 34, st, { grin: d, squash: 1.4 - k * 0.4 }); }
      else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 24, ik, 89);
        const sq = u < 6 ? 0.7 + Math.sin(u * 1.2) * 0.15 : 1;   // the squeeze
        blob(ctx, sx, sy - 26, 46 * (1 - k * 0.55), st, { grin: d, squash: sq, a: 1 - ease((k - 0.6) / 0.4) });
        if (u > 6) splash(ctx, sx, sy - 6, (u - 6) / 12, 20, 2.2);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
