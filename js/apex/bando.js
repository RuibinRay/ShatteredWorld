'use strict';
// Shattered Worlds — APEX Bando, the Long Arm of Deepline (#15 of the strongest 16). On top of js/bando-rope.js (his rope
// arm, which is his weapon: no blade for a man whose arm is the weapon), which stays:
//   J        each jab snaps out further than the arm can (a long streak with a knuckle flash at its end), and the last
//            winds into a coil and fires a fist the size of a crate; hits throw dock splinters
//   skills   Long Jab: a crack of air at the fist; Slingshot: a twang ring; Wind-Up: a coil of rope turns; Reel In:
//            rope dust; Rubber Cannon: a shock ring as he fires himself
//   W+I      HUNDRED HANDS, a film of its own (200 frames): his close-up and card; fists come in from every edge of the
//            screen at the target, faster and faster, rope behind each one; his arm winds back into a coil the camera
//            looks down; on the blow the two great rope arms clap together (js/bando-rope.js) on an ink impact frame and
//            a shock ring blows out the dust
//   numbers  Versus: x1.12 damage, x1.1 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.bando) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { l: '#b6e84a', l2: '#ecffc0', ld: '#2a4a10', rope: '#d8b878', rope2: '#8a6a3a', wrap: '#f0e8d0', wood: '#a0784a', dk: '#14120c', w: '#ffffff' };

  // ---------- J ----------
  const splinters = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 2.4, grav: 0.12, life: 20, shape(ctx, X, Y, i, t) { const a = t * 8 + i; art.line(ctx, i % 2 ? C.wood : C.rope2, X, Y, R(X + Math.cos(a) * 3), R(Y + Math.sin(a) * 3), 1); } });
  function longJab(ctx, q, x, y, t) {
    const f = q.face, L = (40 + q.n * 10) * easeOut(t * 2.4), yy = y - 24 + (q.n % 2 ? -3 : 2);
    ctx.globalAlpha = 1 - ease((t - 0.45) / 0.55);
    D2.streak(ctx, x + f * 8, yy, x + f * (8 + L), yy, 4, [C.rope2, C.rope, C.wrap]);
    for (let i = 10; i < L; i += 7) art.line(ctx, C.rope2, R(x + f * (8 + i)), yy - 2, R(x + f * (11 + i)), yy + 2, 1);
    if (t < 0.4) { D2.disc(ctx, x + f * (10 + L), yy, 5, C.dk); D2.disc(ctx, x + f * (10 + L), yy, 4, C.wrap); D2.burst(ctx, x + f * (14 + L), yy, 7, 8, [C.l2, C.w]); }
  }
  function crate(ctx, q, x, y, t) {   // a coil, then a fist the size of a crate
    const f = q.face, cx = x + f * 12, cy = y - 24;
    if (t < 0.35) { const k = t / 0.35; for (let i = 0; i < 18; i++) { const a = i * 0.7 + k * 4, r = 4 + i * 0.5; art.rect(ctx, i % 2 ? C.rope : C.rope2, R(cx + Math.cos(a) * r), R(cy + Math.sin(a) * r * 0.8), 2, 2); } return; }
    const k = easeOut((t - 0.35) * 3), L = 60 * k, fx0 = cx + f * L;
    ctx.globalAlpha = 1 - ease((t - 0.7) / 0.3);
    D2.streak(ctx, cx, cy, fx0, cy, 5, [C.rope2, C.rope]);
    art.rect(ctx, C.dk, R(fx0 - 9), cy - 10, 20, 20); art.rect(ctx, C.wrap, R(fx0 - 8), cy - 9, 18, 18); for (let i = 0; i < 3; i++) art.rect(ctx, C.rope2, R(fx0 - 8), cy - 6 + i * 6, 18, 1);
    if (t > 0.45 && t < 0.6) D2.burst(ctx, fx0 + f * 12, cy, 16, 12, [C.l2, C.w, C.l]);
  }
  const melee = {
    col: C.rope, hi: C.l2, dk: C.dk, life: 14,
    swing(ctx, q, x, y, t) { return (q.fin ? crate : longJab)(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { splinters(x, y, fin ? 12 : 4, fin ? 3.2 : 2.2); if (fin) { AP.stop(5); fx.shake(4, 8); } }
  };

  // ---------- skills ----------
  const ring = (x, y, r, col, life) => AP.fx({ x, y, life: life || 14, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.ring(ctx, sx, sy, 4 + r * easeOut(t), col, 2); } });
  function init() {
    AP.onCast('long_jab', p => ring(p.x + p.face * 70, p.y - 26, 10, C.l2, 10));
    AP.onCast('sling', p => ring(p.x, p.y - 26, 20, C.l, 14));
    AP.onCast('wind_up', p => AP.fx({ x: p.x + p.face * 8, y: p.y - 26, life: 24, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4); for (let i = 0; i < 20; i++) { const a = i * 0.6 + t * 12, r = 6 + i * 0.6; art.rect(ctx, i % 2 ? C.rope : C.rope2, R(sx + Math.cos(a) * r), R(sy + Math.sin(a) * r * 0.7), 2, 2); } } }));
    AP.onCast('reel_in', p => splinters(p.x + p.face * 20, p.y - 20, 6, 1.6));
    AP.onCast('rubber_cannon', p => { ring(p.x, p.y - 20, 34, C.l2, 16); fx.shake(3, 6); });
  }

  // ---------- W+I: Hundred Hands ----------
  const LEN = 200, FIN = 150, BU = 118, FISTS = 52;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -18], [44, 2.4, 1, 'hero', 2, -18],
    [FISTS, 1.15, 0.9, 'target'], [BU - 6, 1.6, 1, 'target'], [BU, 2.0, 1, 'hero', 6, -22], [FIN - 6, 2.2, 1, 'hero', 6, -22],
    [FIN - 4, 1.4, 1, 'target', 0, 0, 'cut'], [FIN, 1.3, 1, 'target'], [FIN + 8, 1.6, 1, 'target'], [FIN + 34, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function fistFrom(T, i) {   // a fist from an edge of the screen, rope behind it, at the target
    const a = (i * 2.399) % (PI * 2), ox = Math.cos(a) * 280, oy = Math.sin(a) * 160 - 40;
    AP.fx({ x: T.x + ox, y: T.y - 24 + oy, tx: T.x + rand(-8, 8), ty: T.y - 24 + rand(-14, 10), life: 12, draw(ctx, q, sx, sy, t, cam) {
      const k = easeOut(t * 2.4), ex = sx + (q.tx - cam.x - sx) * k, ey = sy + (q.ty - cam.y - sy) * k;
      ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
      art.line(ctx, C.rope2, R(sx), R(sy), R(ex), R(ey), 4); art.line(ctx, C.rope, R(sx), R(sy), R(ex), R(ey), 2);
      D2.disc(ctx, ex, ey, 6, C.dk); D2.disc(ctx, ex, ey, 5, C.wrap);
      if (k > 0.95) D2.burst(ctx, ex, ey, 8, 8, [C.l2, C.w]);
    } });
  }
  function coil(p) {   // his arm winds back into a coil
    AP.fx({ x: p.x - p.face * 6, y: p.y - 28, f: p.face, life: FIN - BU + 20, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1; if (st >= FIN) return;
      const k = easeOut((st - BU) / 24), n = R(36 * k);
      for (let i = 0; i < n; i++) { const a = i * 0.55 + st * 0.3, r = 3 + i * 0.55; art.rect(ctx, C.dk, R(sx - q.f * r * 0.4 + Math.cos(a) * r) - 1, R(sy + Math.sin(a) * r * 0.8) - 1, 4, 4); art.rect(ctx, i % 3 ? C.rope : C.wrap, R(sx - q.f * r * 0.4 + Math.cos(a) * r), R(sy + Math.sin(a) * r * 0.8), 2, 2); }
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.l2, C.l, C.ld, C.rope],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.l2, c2: C.l, tag: 'APEX XV', glyph(ctx, x, y, t) { art.line(ctx, C.rope, x - 14, y, x + R(4 * Math.sin(t * 9)), y, 3); art.disc(ctx, C.wrap, x + 6, y, 5); } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (T && st >= FISTS && st < BU - 4) { const gap = Math.max(2, 7 - ((st - FISTS) / 12 | 0)); if ((st - FISTS) % gap === 0) { fistFrom(T, st); SW.audio.sfx('hit'); if (st % 4 === 0) fx.shake(2, 3); splinters(T.x, T.y - 24, 2, 2); } }
      if (st === BU) { coil(p); SW.audio.sfx('charge'); }
    },
    build() {},
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(14, 24);
      splinters(cx, cy, 30, 4.4); AP.bits(cx, gy - 2, 24, { cols: ['#a09078', '#c8b8a0'], sp: 3, up: 1, life: 26, sz: 3 });
      fx.ring(cx, cy, C.w, 6, 130, 24); fx.ring(cx, cy, C.l, 4, 90, 20);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < BU) return ['a1', (st >> 2) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#1a2a08', 0.2] };
      if (st >= FISTS && st < BU) return { vig: 0.35, lines: (st - FISTS) % 8 < 2 ? 26 : 10, lineCol: C.l2 };
      if (st >= BU && st < FIN - 4) return { vig: 0.55, grade: ['#1a2a08', 0.25], lines: 16, lineCol: C.rope };
      if (st >= FIN && st < FIN + 3) return { impact: 'ink' };
      if (st >= FIN + 3 && st < FIN + 10) return { lines: 40, lineCol: C.l2, split: 3, vig: 0.4 };
      return null;
    }
  };

  AP.reg('bando', { melee, ult, init, tune: { dmg: 1.12, hp: 1.1 } });
})();
