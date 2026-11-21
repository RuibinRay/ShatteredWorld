'use strict';
// Shattered Worlds — APEX Maren, the Tide Doctor (#14 of the strongest 16). On top of js/maren-tide.js (her water and the
// wave that rears over the target), which stays:
//   weapon   THE TIDEFORK: a trident of white coral and sea-green glass, a shell at its foot
//   J        whips of sea water: curling arcs that break into spray, and on the last a breaker that crashes over the
//            target; every hit that lands throws spray and a few bubbles
//   skills   spray and bubbles on her skills; Tide Pool a ring of ripples; Brine Bubble a shine on the ball
//   W+I      SPRING TIDE, a film of its own (196 frames): her close-up and card; rain starts; the sea comes in four
//            times: each time the water line rises up the screen (a real line of water with foam on it) and falls back a
//            little higher; on the fourth it covers the target, the wave rears (js/maren-tide.js), a sea-blue impact
//            frame and the water bursts upward in a column
//   numbers  Versus: x1.1 damage, x1.08 health (her balance cut is gone: she is one of the sixteen)
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.maren) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { t: '#2a9d8f', t2: '#b8fff0', td: '#0a3a40', deep: '#0a2a50', sea: '#1a6a90', foam: '#e8fbff', coral: '#f4e8e0', coral2: '#e8a090', w: '#ffffff' };

  // ---------- the weapon: the Tidefork ----------
  function tidefork(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [s0x, s0y] = P(-4 * sc, 0), [s1x, s1y] = P(L - 4 * sc, 0); T.pline(x, C.td, s0x, s0y, s1x, s1y, Math.max(2, R(1.3 * sc)) + 1); T.pline(x, C.coral, s0x, s0y, s1x, s1y, Math.max(1, R(1 * sc)));
    for (let i = 0; i < L - 4 * sc; i += 4) { const [bx, by] = P(i, 0); T.rect(x, C.coral2, R(bx), R(by), 1, 1); }
    const [c0x, c0y] = P(L - 4 * sc, -3 * sc), [c1x, c1y] = P(L - 4 * sc, 3 * sc); T.pline(x, C.td, c0x, c0y, c1x, c1y, 2);   // the cross-bar
    for (const v of [-3, 0, 3]) { const [t0x, t0y] = P(L - 4 * sc, v * sc), [t1x, t1y] = P(L + (v ? 0 : 2) * sc, v * sc); T.pline(x, C.t, t0x, t0y, t1x, t1y, Math.max(1, R(sc))); T.rect(x, C.t2, R(t1x), R(t1y), 1, 1); }
    const [fx0, fy0] = P(-4 * sc, 0); T.disc(x, C.coral2, fx0, fy0, R(1.6 * sc));   // the shell at its foot
  }

  // ---------- J ----------
  const spray = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 2.2, up: 1, grav: 0.14, life: 18, shape(ctx, X, Y, i, t) { if (i % 5 === 0) D2.ring(ctx, X, Y, 2, C.t2, 1); else art.rect(ctx, i % 2 ? C.foam : C.t2, X, Y, 1, 2); } });
  function breaker(ctx, q, x, y, t) {   // a breaker crashing over the target
    const f = q.face, k = easeOut(t * 1.8), x0 = x + f * 6, x1 = x + f * (10 + 40 * k);
    ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
    for (let i = 0; i <= 16; i++) { const u = i / 16, xx = x0 + (x1 - x0) * u, h = R(34 * Math.sin(PI * u) * k); art.rect(ctx, C.deep, R(xx) - 1, y - h, 3, h); art.rect(ctx, i % 3 ? C.sea : C.t, R(xx), y - h + 1, 2, h - 1); art.rect(ctx, C.foam, R(xx), y - h, 2, 2); }
    D2.crescent(ctx, x1 - f * 6, y - 30 * k, 10, -2.4, 0.6, 3, f, [C.foam, C.w]);
  }
  const melee = {
    col: C.t, hi: C.t2, dk: C.td,
    swing(ctx, q, x, y, t) { if (q.fin) return breaker(ctx, q, x, y, t); AP.SWINGS.crescent(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { spray(x, y, fin ? 16 : 6, fin ? 3 : 2.2); if (fin) { AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  const ripples = (x, y, life) => AP.fx({ x, y, life, back: true, draw(ctx, q, sx, sy, t) { ctx.save(); ctx.translate(sx, sy); ctx.scale(1, 0.3); ctx.translate(-sx, -sy); for (let i = 0; i < 3; i++) { const tt = t * 1.5 - i * 0.2; if (tt > 0 && tt < 1) { ctx.globalAlpha = 1 - tt; D2.ring(ctx, sx, sy, 6 + 30 * tt, C.t2, 2); } } ctx.restore(); } });
  function init() {
    AP.onCast('brine_lash', p => spray(p.x + p.face * 20, p.y - 24, 6));
    AP.onCast('tide_pool', p => ripples(p.x, p.y, 26));
    AP.onCast('undertow', p => spray(p.x + p.face * 30, p.y - 6, 10, 2.6));
    AP.onCast('brine_bubble', p => { const o = AP.foeOf(p); if (o) AP.fx({ x: o.x - 6, y: o.y - 34, life: 20, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; art.rect(ctx, C.w, sx, sy, 3, 1); art.rect(ctx, C.w, sx, sy + 1, 1, 2); } }); });
    AP.onCast('tidal_wave', p => spray(p.x - p.face * 10, p.y - 10, 14, 3));
  }

  // ---------- W+I: Spring Tide ----------
  const LEN = 196, FIN = 146, BU = 116, RAIN = 48, TIDES = [58, 74, 90, 106];
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -20], [44, 2.4, 1, 'hero', 2, -20],
    [RAIN, 1.05, 0.8, 'mid', 0, -20], [BU, 1.3, 1, 'mid', 0, -20], [BU + 8, 1.7, 1, 'target', 0, -20], [FIN - 2, 2.1, 1, 'target', 0, -24],
    [FIN, 1.3, 1, 'target'], [FIN + 8, 1.6, 1, 'target', 0, -20], [FIN + 32, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function sea(ctx, o) {   // rain, and the sea coming in four times, each a little higher
    const st = o.st; if (st < RAIN || st >= FIN + 2) return;
    const rk = ease((st - RAIN) / 10);
    ctx.globalAlpha = 0.5 * rk; for (let i = 0; i < 60; i++) { const x = (i * 53 + st * 7) % (SW.W + 40) - 20, y = (i * 37 + st * 9) % SW.H; art.line(ctx, C.t2, x, y, x - 2, y + 7, 1); } ctx.globalAlpha = 1;
    let lvl = 0; TIDES.forEach((t0, i) => { if (st < t0) return; const k = st - t0, surge = k < 8 ? easeOut(k / 8) : 1 - 0.45 * ease((k - 8) / 8); lvl = Math.max(lvl, (0.18 + i * 0.14) * (i === 3 ? Math.min(1, k / 8) * 1.4 : surge)); });
    if (st >= BU) lvl = Math.max(lvl, 0.62 + 0.1 * ease((st - BU) / (FIN - BU)));
    if (lvl <= 0) return;
    const top = R(SW.H - lvl * SW.H * 0.62);
    ctx.globalAlpha = 0.55; art.rect(ctx, C.deep, 0, top, SW.W, SW.H - top); ctx.globalAlpha = 0.35; art.rect(ctx, C.sea, 0, top + 4, SW.W, 6);
    ctx.globalAlpha = 0.95; for (let x = 0; x < SW.W; x += 3) { const y = top + R(Math.sin(x * 0.06 + st * 0.25) * 2.5); art.rect(ctx, (x / 3) % 4 ? C.foam : C.w, x, y - 1, 3, 2); }
    ctx.globalAlpha = 1;
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.t2, C.t, C.td, C.deep],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.t2, c2: C.t, tag: 'APEX XIV', glyph(ctx, x, y, t) { for (let i = 0; i < 9; i++) art.rect(ctx, i % 2 ? C.t : C.t2, x - 9 + i * 2, R(y + Math.sin(i * 0.8 + t * 8) * 2), 2, 2); } }),
    every(st, o) {
      const { T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (TIDES.indexOf(st) >= 0) { SW.audio.sfx('heavy'); fx.shake(4, 10); if (T) spray(T.x, T.y - 10, 10, 2.4); }
      if (st === BU) SW.audio.sfx('charge');
    },
    build() {},
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(14, 24);
      AP.fx({ x: cx, y: gy, life: 26, draw(ctx, q, sx, sy, t) { const h = R(140 * easeOut(t * 2.5)), fade = 1 - ease((t - 0.55) / 0.45); ctx.globalAlpha = fade; for (let i = -6; i <= 6; i++) { const hh = R(h * (1 - Math.abs(i) / 8)); art.rect(ctx, Math.abs(i) < 2 ? C.foam : i % 2 ? C.t : C.sea, sx + i * 3, sy - hh, 3, hh); } } });
      spray(cx, cy, 36, 4.6);
      fx.ring(cx, cy, C.w, 6, 120, 22); fx.ring(cx, cy, C.t, 4, 90, 18);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < BU) return ['cast', (st >> 3) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#0a2a3a', 0.22] };
      if (st >= RAIN && st < FIN) return { vig: 0.4, grade: ['#0a2a3a', 0.25], draw: sea, lines: st >= BU + 10 ? 20 : 0, lineCol: C.t2 };
      if (st >= FIN && st < FIN + 2) return { impact: 'tint', tint: '#4cc9f0' };
      if (st >= FIN + 2 && st < FIN + 4) return { impact: 'neg' };
      if (st >= FIN + 4 && st < FIN + 12) return { lines: 40, lineCol: C.t2, split: 3, vig: 0.4 };
      return null;
    }
  };

  AP.reg('maren', {
    weapon: { name: 'tidefork', len: 20, w: 2, col: C.coral, hi: C.t2, hilt: C.td, armed: 1, draw: tidefork },
    melee, ult, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
