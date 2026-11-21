'use strict';
// Shattered Worlds — APEX Jax, Six Shots (#8 of the strongest 16). On top of js/jax-sixgun.js (his revolver and
// bullets), which stays:
//   weapon   THE PEACEMAKER: a long-barrelled revolver, an engraved cylinder, a hammer to fan and a worn grip
//   J        gun-fu: a point-blank shot on each hit (a flash and a tracer), and on the last a spin with three shots
//            fanned out; every hit that lands kicks out a brass casing
//   skills   a casing (or six) ejected with every shot; Trick Shot a spark where it leaves; Lucky Coin a coin's glint;
//            Ricochet a ring of sparks
//   W+I      HIGH NOON, a film of its own (208 frames): a close-up under his hat and his card; the world goes to sepia
//            under a white sun; the camera cuts between his eyes and theirs, then to his hand over the holster;
//            the bell tolls six times and six red marks appear on the target; on the blow all six shots land in one
//            frame (six tracers, a blood-red impact frame); smoke curls off the barrel while the camera pulls away
//   numbers  Versus: x1.12 damage, x1.08 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.jax) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { o: '#c86a3a', o2: '#ffd0a8', steel: '#9aa2b4', steel2: '#e6eaf2', dk: '#1a1210', wood: '#6a3a1a', wood2: '#a0683a', brass: '#e0b040', red: '#d0102a', w: '#ffffff', sepia: '#a07040' };

  // ---------- the weapon: the Peacemaker ----------
  function peacemaker(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [g0x, g0y] = P(-1, -1 * sc), [g1x, g1y] = P(-3.5 * sc, -3 * sc); T.pline(x, C.dk, g0x, g0y, g1x, g1y, Math.max(2, R(2 * sc)) + 1); T.pline(x, C.wood2, g0x, g0y, g1x, g1y, Math.max(2, R(1.6 * sc)));   // the grip
    const [c0x, c0y] = P(1.5 * sc, 0); T.disc(x, C.dk, c0x, c0y, R(2.2 * sc)); T.disc(x, C.steel, c0x, c0y, R(1.6 * sc)); T.rect(x, C.brass, R(c0x), R(c0y), 1, 1);   // the cylinder
    const [b0x, b0y] = P(2 * sc, 0), [b1x, b1y] = P(L, 0); T.pline(x, C.dk, b0x, b0y, b1x, b1y, Math.max(2, R(1.3 * sc)) + 1); T.pline(x, C.steel, b0x, b0y, b1x, b1y, Math.max(1, R(1 * sc)));
    for (let i = 3; i < L; i += 3) { const [hx, hy] = P(i, -0.5); T.rect(x, C.steel2, R(hx), R(hy), 1, 1); }
    const [hx, hy] = P(-0.5 * sc, -2 * sc); T.rect(x, C.dk, R(hx) - 1, R(hy) - 1, 2, 2);   // the hammer
  }

  // ---------- J: gun-fu ----------
  const casing = (x, y, n) => AP.bits(x, y, n || 1, { sp: 2.2, up: 2, grav: 0.18, life: 22, shape(ctx, X, Y, i, t) { const r = (t * 9 + i) | 0; art.rect(ctx, C.dk, X - 1, Y - 1, r % 2 ? 4 : 3, r % 2 ? 3 : 4); art.rect(ctx, C.brass, X, Y, r % 2 ? 2 : 1, r % 2 ? 1 : 2); } });
  function fanned(ctx, q, x, y, t) {
    const f = q.face, mx = x + f * 16, my = y - 24;
    ctx.globalAlpha = 1 - ease((t - 0.4) / 0.6);
    if (t < 0.3) D2.burst(ctx, mx, my, 16, 12, [C.o2, C.w, C.brass]);
    for (const a of [-0.25, 0, 0.25]) { const l = 30 + 170 * easeOut(t * 2.2); D2.streak(ctx, mx + f * 8, my, mx + f * Math.cos(a) * l, my + Math.sin(a) * l, 2, [C.o, C.w]); }
    D2.crescent(ctx, x, y - 22, 22, -2.6, -2.6 + 5.2 * easeOut(t * 2), 4, f, [C.dk, C.o, C.o2]);
  }
  const melee = {
    col: C.o, hi: C.o2, dk: C.dk,
    swing(ctx, q, x, y, t) { if (q.fin) return fanned(ctx, q, x, y, t); return AP.SWINGS.shot(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { casing(p.x + p.face * 6, p.y - 26, fin ? 3 : 1); AP.bits(x, y, fin ? 10 : 4, { cols: [C.o2, C.w, C.brass], sp: 2.4, life: 12 }); if (fin) { AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  function init() {
    AP.onCast('quick_shot', p => casing(p.x + p.face * 6, p.y - 26, 1));
    AP.onCast('trick_shot', p => { casing(p.x + p.face * 6, p.y - 26, 1); AP.bits(p.x + p.face * 22, p.y - 26, 6, { cols: [C.w, C.brass], sp: 2, life: 10 }); });
    AP.onCast('fan_hammer', p => casing(p.x + p.face * 6, p.y - 26, 6));
    AP.onCast('lucky_coin', p => AP.fx({ x: p.x + p.face * 10, y: p.y - 50, life: 14, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; const s = R(6 * (1 - t) + 2); art.line(ctx, C.brass, sx - s, sy, sx + s, sy, 1); art.line(ctx, C.brass, sx, sy - s, sx, sy + s, 1); art.rect(ctx, C.w, sx - 1, sy - 1, 2, 2); } }));
    AP.onCast('ricochet', p => { casing(p.x + p.face * 6, p.y - 26, 1); AP.fx({ x: p.x + p.face * 20, y: p.y - 26, life: 12, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.ring(ctx, sx, sy, 4 + 14 * easeOut(t), C.brass, 1); } }); });
  }

  // ---------- W+I: High Noon ----------
  const LEN = 208, FIN = 156, BU = 118;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.7, 1, 'hero', 2, -18], [44, 2.5, 1, 'hero', 2, -18],
    [50, 1.15, 1, 'mid', 0, -20, 'cut'],                                // the standoff, wide
    [64, 3.0, 1, 'hero', 2, -18, 'cut'], [74, 3.0, 1, 'target', -2, -18, 'cut'],   // his eyes, theirs
    [84, 3.0, 1, 'hero', 4, 0, 'cut'], [94, 3.0, 1, 'target', -2, -18, 'cut'],      // his hand over the holster, theirs
    [104, 1.2, 1, 'mid', 0, -20], [BU, 1.6, 1, 'target'], [FIN - 2, 2.2, 1, 'target'],
    [FIN, 1.3, 1, 'mid', 0, -20], [FIN + 6, 1.5, 1, 'mid', 0, -20], [FIN + 34, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function sun(ctx, o) {   // a white sun at noon, heat shimmer on the horizon
    const st = o.st, k = ease((st - 48) / 10); if (k <= 0 || st >= FIN) return;
    ctx.globalAlpha = k; D2.disc(ctx, SW.W / 2, 50, 16, '#fff6e0'); D2.disc(ctx, SW.W / 2, 50, 12, C.w);
    for (let i = 0; i < 12; i++) { const a = i * PI / 6 + st * 0.01; art.line(ctx, '#fff6e0', R(SW.W / 2 + Math.cos(a) * 19), R(50 + Math.sin(a) * 19), R(SW.W / 2 + Math.cos(a) * 26), R(50 + Math.sin(a) * 26), 1); }
    ctx.globalAlpha = 1;
  }
  function marks(T, p) {   // six red marks on the target, one with each toll
    const off = [[-10, -34], [8, -40], [-6, -22], [10, -18], [-12, -8], [6, -6]];
    off.forEach((o, i) => AP.fx({ x: T.x + o[0], y: T.y + o[1], life: FIN - (BU + i * 5) + 30, born: BU + 4 + i * 5, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1; if (st < q.born || st >= FIN + 2) return;
      const k = easeOut((st - q.born) / 4), r = R(7 - 3 * k);
      art.line(ctx, C.red, sx - r - 2, sy, sx - 2, sy, 1); art.line(ctx, C.red, sx + 2, sy, sx + r + 2, sy, 1); art.line(ctx, C.red, sx, sy - r - 2, sx, sy - 2, 1); art.line(ctx, C.red, sx, sy + 2, sx, sy + r + 2, 1); art.ring(ctx, C.red, sx, sy, r);
      void p;
    } }));
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.o2, C.o, C.dk, C.red],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.o2, c2: C.o, tag: 'APEX VIII', glyph(ctx, x, y, t) { art.disc(ctx, C.dk, x, y, 7); art.disc(ctx, C.steel, x, y, 5); for (let i = 0; i < 6; i++) { const a = i * PI / 3 + t * 4; art.rect(ctx, C.dk, R(x + Math.cos(a) * 3), R(y + Math.sin(a) * 3), 1, 1); } } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === 64 || st === 74 || st === 84 || st === 94) SW.audio.sfx('dash');
      if (T && st === BU) marks(T, p);
      if (st >= BU + 4 && st < BU + 34 && (st - BU - 4) % 5 === 0) { SW.audio.sfx('select'); fx.shake(2, 3); }
      if (st > FIN + 4 && st < FIN + 50 && st % 3 === 0) AP.fx({ x: p.x + p.face * 18, y: p.y - 28, life: 30, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 0.5 * (1 - t); art.rect(ctx, '#d8d0c8', R(sx + Math.sin(t * 6) * 3), R(sy - t * 24), 2 + R(t * 3), 2 + R(t * 3)); } });   // smoke off the barrel
    },
    build() {},
    finish(o) {
      const { p, T, cx, cy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(10, 20);
      const off = [[-10, -34], [8, -40], [-6, -22], [10, -18], [-12, -8], [6, -6]], mx = p.x + p.face * 16, my = p.y - 24;
      off.forEach(([ox, oy], i) => AP.fx({ x: mx, y: my, tx: (T ? T.x : cx) + ox, ty: (T ? T.y : cy + 22) + oy, life: 14, draw(ctx, q, sx, sy, t, cam) { ctx.globalAlpha = 1 - t; D2.streak(ctx, sx, sy, R(q.tx - cam.x), R(q.ty - cam.y), 2, [C.o, C.w]); D2.burst(ctx, R(q.tx - cam.x), R(q.ty - cam.y), 6, 8, [C.red, C.w]); } }));
      AP.fx({ x: mx, y: my, life: 10, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.burst(ctx, sx, sy, 26, 16, [C.o2, C.w, C.brass]); } });
      casing(mx, my, 6);
      fx.ring(cx, cy, C.w, 6, 100, 20); fx.ring(cx, cy, C.red, 4, 70, 18);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < BU) return ['idle', 0];
      if (st < FIN - 2) return ['cast', 0];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: [C.sepia, 0.25] };
      if (st >= 46 && st < FIN) return { vig: 0.45, grade: [C.sepia, 0.45, 'multiply'], draw: sun, lines: st >= 64 && st < 104 && (st - 64) % 10 < 2 ? 30 : 0, lineCol: '#fff6e0' };
      if (st >= FIN && st < FIN + 3) return { impact: 'red' };
      if (st >= FIN + 3 && st < FIN + 10) return { lines: 36, lineCol: C.o2, split: 2, vig: 0.4, grade: [C.sepia, 0.2] };
      return null;
    }
  };

  AP.reg('jax', {
    weapon: { name: 'peacemaker', len: 12, w: 2, col: C.steel, hi: C.steel2, hilt: C.wood, draw: peacemaker },
    melee, ult, init,
    tune: { dmg: 1.12, hp: 1.08 }
  });
})();
