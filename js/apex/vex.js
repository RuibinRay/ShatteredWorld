'use strict';
// Shattered Worlds — APEX Vex, the Iron Pull (#16 of the strongest 16). On top of js/vex-field.js (his scrap, charges,
// field lines and the crushed iron ball), which stays:
//   weapon   THE RAILBLADE: a short blade riding between two copper rails, coils wound round its base, a red tip and a
//            blue heel (his two poles)
//   J        arcs that leave red (+) and blue (-) streaks, a spark jumping between them; the last hit is a
//            repulse: a ring that blows out, then iron filings snap back in; every hit that lands throws filings
//   skills   a red ring on Repel Shot, a blue one on Attract, a burst of filings on Iron Storm, a lodestone pulse on
//            Lodestar, a flipping red-blue ring on Flux Flip
//   W+I      MAGNETAR, a film of its own (200 frames): his close-up and card; the screen splits into a red pole and a
//            blue pole that grind against each other; iron filings draw the field across the whole screen; he becomes
//            a star of iron (a ring of scrap round him), the field flips (the two halves swap colour) and everything is
//            dragged in; on the blow a red frame, a blue frame and the iron ball (js/vex-field.js) crushes them
//   numbers  Versus: x1.1 damage, x1.08 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.vex) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { r: '#e63946', r2: '#ffb0b8', b: '#4cc9f0', b2: '#d8f4ff', cu: '#c87a3a', cu2: '#f0b070', iron: '#5a6070', iron2: '#a8b0c0', ink: '#0a0a10', w: '#ffffff' };

  // ---------- the weapon: the Railblade ----------
  function railblade(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    for (const v of [-2, 2]) { const [r0x, r0y] = P(1, v * sc), [r1x, r1y] = P(L - 2, v * sc); T.pline(x, C.cu, r0x, r0y, r1x, r1y, 1); }   // the rails
    const [b0x, b0y] = P(2, 0), [b1x, b1y] = P(L, 0); T.pline(x, C.ink, b0x, b0y, b1x, b1y, 2); T.pline(x, C.iron2, b0x, b0y, b1x, b1y, 1);
    const [tx, ty] = P(L, 0); T.rect(x, C.r, R(tx) - 1, R(ty) - 1, 2, 2);
    const [hx, hy] = P(1, 0); T.rect(x, C.b, R(hx) - 1, R(hy) - 1, 2, 2);
    for (let i = 0; i < 3; i++) { const [cx, cy] = P(2 + i * 1.5 * sc, 0); T.rect(x, C.cu2, R(cx) - 1, R(cy) - 2, 1, 4); }   // the coils
  }

  // ---------- J ----------
  const filings = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 2.4, life: 16, shape(ctx, X, Y, i, t) { const a = i * 0.7 + t * 4; art.line(ctx, i % 2 ? C.iron2 : C.iron, X, Y, R(X + Math.cos(a) * 2), R(Y + Math.sin(a) * 2), 1); } });
  function poles(ctx, q, x, y, t) {   // a red streak and a blue streak, a spark jumping between them
    const f = q.face, k = easeOut(t * 2), y0 = y - 30 + (q.n % 2 ? 4 : 0), L = 34 * k;
    ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5);
    D2.streak(ctx, x + f * 8, y0, x + f * (8 + L), y0 + 6, 3, [C.ink, C.r, C.r2]); D2.streak(ctx, x + f * 8, y0 + 14, x + f * (8 + L), y0 + 8, 3, [C.ink, C.b, C.b2]);
    if (t > 0.2 && t < 0.5) { let px = x + f * (8 + L), py = y0 + 6; for (let i = 0; i < 3; i++) { const nx = px + f * (i % 2 ? -2 : 2), ny = py + 1; art.line(ctx, C.w, R(px), R(py), R(nx), R(ny), 1); px = nx; py = ny; } }
  }
  function repulse(ctx, q, x, y, t) {
    const f = q.face, cx = x + f * 24, cy = y - 24;
    ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
    if (t < 0.45) { const r = 4 + 30 * easeOut(t / 0.45); D2.ring(ctx, cx, cy, r, C.r, 2); D2.ring(ctx, cx, cy, r * 0.7, C.r2, 1); }
    else { const k = easeOut((t - 0.45) / 0.4); for (let i = 0; i < 16; i++) { const a = i * PI / 8, d = 34 * (1 - k) + 2; art.line(ctx, C.b, R(cx + Math.cos(a) * d), R(cy + Math.sin(a) * d), R(cx + Math.cos(a) * (d + 5)), R(cy + Math.sin(a) * (d + 5)), 1); } }
  }
  const melee = {
    col: C.r, hi: C.b2, dk: C.ink,
    swing(ctx, q, x, y, t) { return (q.fin ? repulse : poles)(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { filings(x, y, fin ? 16 : 6, fin ? 3.4 : 2.4); if (fin) { AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  const ring = (x, y, r, col, life, closing) => AP.fx({ x, y, life, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; const k = closing ? 1 - easeOut(t) : easeOut(t); D2.ring(ctx, sx, sy, 3 + r * k, col, 2); } });
  function init() {
    AP.onCast('repel_shot', p => ring(p.x + p.face * 14, p.y - 26, 14, C.r, 12));
    AP.onCast('attract', p => ring(p.x + p.face * 14, p.y - 26, 30, C.b, 16, true));
    AP.onCast('iron_storm', p => filings(p.x, p.y - 24, 18, 3));
    AP.onCast('lodestar', p => ring(p.x + p.face * 40, p.y - 20, 20, C.cu2, 20));
    AP.onCast('flux_flip', p => { ring(p.x, p.y - 22, 40, C.r, 16); ring(p.x, p.y - 22, 40, C.b, 24, true); });
  }

  // ---------- W+I: Magnetar ----------
  const LEN = 200, FIN = 150, BU = 118, SPLIT = 50, FLIP = 104;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -20], [44, 2.4, 1, 'hero', 2, -20],
    [SPLIT, 1.05, 0.8, 'mid', 0, -20], [FLIP - 4, 1.2, 0.9, 'mid', 0, -20], [FLIP, 1.6, 1, 'hero', 0, -22, 'cut'], [BU, 1.6, 1, 'hero', 0, -22],
    [BU + 4, 1.5, 1, 'target', 0, -20], [FIN - 2, 2.0, 1, 'target'], [FIN, 1.3, 1, 'target'], [FIN + 8, 1.6, 1, 'target'], [FIN + 32, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function poleField(ctx, o) {   // the screen split into a red and a blue pole, filings drawing the field between
    const st = o.st; if (st < SPLIT || st >= FIN) return;
    const k = ease((st - SPLIT) / 12), flip = st >= FLIP, mid = SW.W / 2 + R(Math.sin(st * 0.3) * 3 * (st > BU ? 2 : 1));
    ctx.globalAlpha = 0.22 * k; art.rect(ctx, flip ? C.b : C.r, 0, 0, mid, SW.H); art.rect(ctx, flip ? C.r : C.b, mid, 0, SW.W - mid, SW.H);
    ctx.globalAlpha = 0.9 * k; for (let y = 0; y < SW.H; y += 6) art.rect(ctx, (y / 6 + (st >> 1)) % 2 ? C.w : C.iron2, mid - 1, y, 2, 3);   // the seam, grinding
    ctx.globalAlpha = 0.55 * k;
    for (let j = 0; j < 9; j++) { const ry = 20 + j * 24; for (let x = 6; x < SW.W; x += 10) { const pull = st > FLIP ? Math.min(1, (st - FLIP) / 30) : 0, dx = (o.fxp - x) * 0.04 * pull, ang = Math.atan2(Math.sin((x - mid) * 0.02) * 6, 10) + (x < mid ? 0.2 : -0.2); art.line(ctx, C.iron2, R(x + dx), R(ry + Math.sin(x * 0.03 + j) * 4), R(x + dx + Math.cos(ang) * 4), R(ry + Math.sin(x * 0.03 + j) * 4 + Math.sin(ang) * 4), 1); } }
    ctx.globalAlpha = 1;
  }
  function star(p) {   // he becomes a star of iron: a ring of scrap round him
    AP.fx({ x: p.x, y: p.y - 26, life: FIN - FLIP + 30, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1; if (st >= FIN) return;
      const k = easeOut((st - FLIP) / 12);
      for (let i = 0; i < 18; i++) { const a = i * PI / 9 + st * 0.15, r = 30 * k + Math.sin(st * 0.3 + i) * 2; art.rect(ctx, C.ink, R(sx + Math.cos(a) * r) - 2, R(sy + Math.sin(a) * r * 0.8) - 2, 5, 4); art.rect(ctx, i % 3 ? C.iron2 : C.cu, R(sx + Math.cos(a) * r) - 1, R(sy + Math.sin(a) * r * 0.8) - 1, 3, 2); }
      D2.ring(ctx, sx, sy, 36 * k, st % 4 < 2 ? C.r : C.b, 1);
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.r2, C.r, C.ink, C.b],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.r2, c2: C.r, tag: 'APEX XVI', glyph(ctx, x, y, t) { art.rect(ctx, C.r, x - 8, y - 5, 7, 10); art.rect(ctx, C.b, x + 1, y - 5, 7, 10); art.rect(ctx, C.w, x - 1, y - 6 + R(t * 12) % 12, 2, 2); } }),
    every(st, o) {
      const { p } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === SPLIT) { SW.audio.sfx('charge'); fx.shake(3, 30); }
      if (st === FLIP) { star(p); SW.audio.sfx('zap'); fx.shake(6, 10); }
    },
    build(k) { if (k % 6 === 0) SW.audio.sfx('heavy'); },
    finish(o) {
      const { cx, cy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(14, 24);
      filings(cx, cy, 40, 4.6);
      fx.ring(cx, cy, C.r, 6, 120, 22); fx.ring(cx, cy, C.b, 4, 90, 18);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < FLIP) return ['cast', (st >> 3) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#2a0a10', 0.2] };
      if (st >= FLIP && st < FLIP + 2) return { impact: 'tint', tint: C.b, draw: poleField };
      if (st >= SPLIT && st < FIN) return { vig: 0.35, draw: poleField, lines: st >= BU ? 20 : 0, lineCol: st % 4 < 2 ? C.r2 : C.b2 };
      if (st >= FIN && st < FIN + 2) return { impact: 'red' };
      if (st >= FIN + 2 && st < FIN + 4) return { impact: 'tint', tint: C.b };
      if (st >= FIN + 4 && st < FIN + 12) return { lines: 40, lineCol: C.w, split: 4, vig: 0.4 };
      return null;
    }
  };

  AP.reg('vex', {
    weapon: { name: 'railblade', len: 14, w: 2, col: C.iron2, hi: C.w, hilt: C.cu, armed: 1, draw: railblade },
    melee, ult, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
