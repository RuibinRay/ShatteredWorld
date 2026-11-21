'use strict';
// Shattered Worlds — APEX Rook, the Crowd of One (#10 of the strongest 16). On top of js/rook-crowd.js (his clones),
// which stays:
//   weapon   SMOKE TONFA: a pair of short teal batons with smoke-grey grips; he fights with the armed poses
//   J        a clone of him strikes alongside each hit from the other side (an afterimage and a cross), and on the
//            last three clones come in at once from three sides; every hit that lands puffs smoke
//   skills   a puff of smoke wherever a clone appears: Twin Rush, Swap Out (at both ends), Pile-On, Wheel Toss and Clone
//            Barrage
//   W+I      A THOUSAND ROOKS, a film of its own (210 frames): his close-up and card; wave after wave of him runs across
//            the screen (the near ones big and dark, the far ones small); they pile on the target into a tower of
//            Rooks that sways; on the blow it collapses on an ink frame into one great cloud of smoke
//   numbers  Versus: x1.08 damage, x1.05 health (his balance cut is gone: he is one of the sixteen)
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.rook) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { t: '#2ec4b6', t2: '#c8fff8', td: '#0a3a36', smoke: '#9aa4a8', smoke2: '#d8e0e2', dk: '#101418', w: '#ffffff' };

  // ---------- the weapon: smoke tonfa ----------
  function tonfa(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [a0x, a0y] = P(-3 * sc, 0), [a1x, a1y] = P(L, 0);
    T.pline(x, C.dk, a0x, a0y, a1x, a1y, Math.max(2, R(1.8 * sc)) + 1); T.pline(x, C.t, a0x, a0y, a1x, a1y, Math.max(1, R(1.3 * sc)));
    const [h0x, h0y] = P(0, 0), [h1x, h1y] = P(0, 3 * sc); T.pline(x, C.smoke, h0x, h0y, h1x, h1y, Math.max(1, R(1.2 * sc)));   // the side grip
    const [ex, ey] = P(L, 0); T.rect(x, C.t2, R(ex), R(ey), 1, 1);
  }

  // ---------- J ----------
  const puff = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 1.4, up: 0.4, life: 22, shape(ctx, X, Y, i, t) { const r = 2 + R(t * 4); art.disc(ctx, i % 2 ? C.smoke : C.smoke2, X, Y, r); } });
  function clone(p, dx, anim, col) { if (fx.ghost && p.sheet) fx.ghost(p.sheet(), anim, 1, p.x + dx, p.y, dx < 0, col || C.t); }
  const melee = {
    col: C.t, hi: C.t2, dk: C.dk,
    swing(ctx, q, x, y, t) { return (q.fin ? AP.SWINGS.xcut : q.n % 2 ? AP.SWINGS.crescent : AP.SWINGS.xcut)(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) {
      puff(x, y, fin ? 10 : 4, fin ? 2.2 : 1.4);
      if (fin) { [-1, 1, 0].forEach((s, i) => clone(p, s ? s * 44 + p.face * 30 : p.face * 60, i % 2 ? 'a3' : 'a4')); AP.stop(4); fx.shake(3, 6); }
      else clone(p, p.face * 50, n % 2 ? 'a2' : 'a1', C.td);
    }
  };

  // ---------- skills ----------
  function init() {
    AP.onCast('twin_rush', p => puff(p.x + p.face * 10, p.y - 16, 6));
    AP.onCast('swap_out', p => { puff(p.x, p.y - 16, 8); const o = AP.foeOf(p); if (o) puff(o.x, o.y - 16, 8); });
    AP.onCast('pile_on', p => puff(p.x + p.face * 14, p.y - 12, 10, 1.8));
    AP.onCast('wheel_toss', p => { const o = AP.foeOf(p); if (o) puff(o.x, o.y - 10, 10, 2); });
    AP.onCast('clone_barrage', p => { puff(p.x + p.face * 10, p.y - 16, 14, 2.4); fx.shake(2, 6); });
  }

  // ---------- W+I: A Thousand Rooks ----------
  const LEN = 210, FIN = 158, BU = 124, RUN = 52;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -18], [44, 2.4, 1, 'hero', 2, -18],
    [RUN, 1, 0.8, 'mid', 0, -20], [BU - 10, 1.1, 0.9, 'mid', 0, -20], [BU, 1.5, 1, 'target', 0, -40], [FIN - 2, 1.9, 1, 'target', 0, -50],
    [FIN, 1.2, 1, 'target', 0, -20], [FIN + 8, 1.5, 1, 'target', 0, -20], [FIN + 36, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  let SHEET = null;
  function crowd(ctx, o) {   // waves of him running across the screen
    const st = o.st; if (st < RUN || st >= BU + 4 || !SHEET) return;
    const fr = art.frames ? art.frames(SHEET, 'run') : 4;
    for (let w = 0; w < 3; w++) for (let i = 0; i < 9; i++) {
      const lane = (i * 7 + w * 3) % 5, sp = 5 + lane + w, x = ((st - RUN) * sp + i * 70 + w * 35) % (SW.W + 120) - 60, y = 150 + lane * 14 + (w === 2 ? 26 : 0);
      const big = w === 2, dir = (i + w) % 2 ? 1 : -1, X = dir > 0 ? x : SW.W - x;
      ctx.save(); ctx.globalAlpha = big ? 1 : 0.85;
      if (big) { ctx.translate(X, y); ctx.scale(1.5, 1.5); ctx.translate(-X, -y); ctx.filter = 'brightness(0.3) saturate(0.6)'; }   // the near ones big and dark
      art.draw(ctx, SHEET, 'run', ((st >> 2) + i) % fr, X, y, dir < 0);
      ctx.restore();
    }
  }
  function tower(T) {   // they pile on: a swaying tower of Rooks over the target
    AP.fx({ x: T.x, y: T.y, life: FIN - BU + 40, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1; if (!SHEET || st >= FIN) return;
      const n = Math.min(9, 1 + ((st - BU) / 3.5) | 0), sway = Math.sin(st * 0.18) * 0.6;
      for (let i = 0; i < n; i++) { const hx = sx + R(Math.sin(i * 1.7) * 8 + sway * i * 1.4), hy = sy - i * 15; art.draw(ctx, SHEET, i % 2 ? 'a3' : 'a4', 1, hx, hy, i % 2 === 0); }
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.t2, C.t, C.td, C.smoke],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.t2, c2: C.t, tag: 'APEX X', glyph(ctx, x, y, t) { for (let i = 0; i < 3; i++) { art.disc(ctx, C.dk, x - 8 + i * 8, y - 2 + (i % 2) * 2, 3); art.rect(ctx, C.t, x - 9 + i * 8, y + 2, 3, 5); } void t; } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 1) SHEET = p.sheet ? p.sheet() : null;
      if (st === 16) SW.audio.sfx('select');
      if (st >= RUN && st < BU && st % 6 === 0) { SW.audio.sfx('dash'); fx.shake(1, 3); }
      if (T && st === BU) { tower(T); puff(T.x, T.y - 10, 12, 2); }
      if (T && st > BU && st < FIN && st % 7 === 0) { puff(T.x + rand(-14, 14), T.y - (st - BU) * 3, 3, 1.4); SW.audio.sfx('heavy'); }
    },
    build() {},
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(14, 24);
      puff(cx, cy - 30, 40, 4); puff(cx, gy - 4, 20, 3);
      fx.ring(cx, cy, C.w, 6, 110, 22); fx.ring(cx, cy, C.t, 4, 80, 18);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < BU) return ['cast', (st >> 3) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#0a2a2a', 0.2] };
      if (st >= RUN && st < BU + 4) return { vig: 0.3, draw: crowd };
      if (st >= BU + 4 && st < FIN) return { vig: 0.45, lines: 18, lineCol: C.t2 };
      if (st >= FIN && st < FIN + 3) return { impact: 'ink' };
      if (st >= FIN + 3 && st < FIN + 10) return { lines: 36, lineCol: C.t2, split: 2, vig: 0.4 };
      return null;
    }
  };

  AP.reg('rook', {
    weapon: { name: 'smoketonfa', len: 10, w: 2, col: C.t, hi: C.t2, hilt: C.smoke, armed: 1, draw: tonfa },
    melee, ult, init,
    tune: { dmg: 1.08, hp: 1.05 }
  });
})();
