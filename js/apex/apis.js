'use strict';
// Shattered Worlds — APEX Apis, the Hive Mind (#12 of the strongest 16). On top of js/apis-hive.js (her bees), which
// stays:
//   weapon   THE STINGER: a long amber needle banded in black, a wax-yellow guard shaped like folded wings; she fights
//            with the armed poses
//   J        stings: three quick thrusts, and on the last a spiral of bees bursting from the blade; hits drip honey
//   skills   a few bees buzz off her hand with every skill; Honey Trap a golden splash; Hive Burst a ring of hexagons;
//            Royal Jelly a crown of light over her; Waggle Dance a figure-eight of bees round the target
//   W+I      KILLER SWARM, a film of its own (204 frames; js/ult-cinema.js is told to leave it to this): her close-up
//            under the crown and her card; the sky goes dark with bees, swarming across the screen in rivers; a cage of
//            honeycomb closes round the target cell by cell; the swarm gathers above into one great bee; on the blow it
//            drives its stinger down on a gold impact frame and the honeycomb breaks
//   numbers  Versus: x1.08 damage, x1.05 health (her balance cut is gone: she is one of the sixteen)
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.apis) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { a: '#fca311', a2: '#fff1b8', ad: '#5a3200', blk: '#14100a', wax: '#ffd84a', honey: '#e08a00', w: '#ffffff', wing: '#e8f4ff' };

  // ---------- the weapon: the Stinger ----------
  function stinger(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    for (let i = 1; i <= L; i++) { const u = i / L, w = Math.max(1, R((1.4 - 1.1 * u) * sc)), band = ((i / (2.2 * sc)) | 0) % 2; for (let v = -w + 1; v < w; v++) { const [bx, by] = P(i, v); T.rect(x, u > 0.85 ? C.blk : band ? C.blk : C.a, R(bx), R(by), 1, 1); } }
    const [tx, ty] = P(L + 1, 0); T.rect(x, C.w, R(tx), R(ty), 1, 1);
    for (const s of [-1, 1]) { const [g0x, g0y] = P(0.5, 0), [g1x, g1y] = P(-1.5 * sc, s * 3.2 * sc); T.pline(x, C.wax, g0x, g0y, g1x, g1y, Math.max(1, R(1.2 * sc))); }   // the wing guard
  }

  // ---------- J ----------
  const honey = (x, y, n) => AP.bits(x, y, n, { sp: 1.4, grav: 0.14, life: 22, shape(ctx, X, Y, i, t) { art.rect(ctx, C.honey, X, Y, 2, 2 + R(t * 3)); art.rect(ctx, C.wax, X, Y, 1, 1); } });
  const bee = (ctx, X, Y, d, t) => { art.rect(ctx, C.blk, X - 2, Y - 1, 5, 3); art.rect(ctx, C.a, X - 1, Y - 1, 1, 3); art.rect(ctx, C.a, X + 1, Y - 1, 1, 3); art.rect(ctx, (t * 30 | 0) % 2 ? C.wing : C.w, X - 1, Y - 3, 2, 2); };
  AP.bee = bee;
  const buzz = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 2, life: 26, shape(ctx, X, Y, i, t) { bee(ctx, X + R(Math.sin(t * 20 + i) * 2), Y + R(Math.cos(t * 17 + i) * 2), 1, t + i * 0.1); } });
  function spiral(ctx, q, x, y, t) {
    const f = q.face, cx = x + f * 20, cy = y - 24;
    ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
    for (let i = 0; i < 14; i++) { const k = i / 14, a = t * 9 + k * PI * 4, r = 4 + 30 * easeOut(t * 1.4) * k; bee(ctx, R(cx + Math.cos(a) * r * f), R(cy + Math.sin(a) * r * 0.7), f, t + k); }
    AP.SWINGS.thrust(ctx, q, x, y, t);
  }
  const melee = {
    col: C.a, hi: C.a2, dk: C.blk,
    swing(ctx, q, x, y, t) { if (q.fin) return spiral(ctx, q, x, y, t); return AP.SWINGS.thrust(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { honey(x, y, fin ? 8 : 3); if (fin) { buzz(x, y, 6, 2.4); AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  function hexRing(x, y, r, life) { AP.fx({ x, y, life, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; const rr = r * easeOut(t * 1.5); for (let i = 0; i < 6; i++) { const a = i * PI / 3, b = (i + 1) * PI / 3; art.line(ctx, C.wax, R(sx + Math.cos(a) * rr), R(sy + Math.sin(a) * rr), R(sx + Math.cos(b) * rr), R(sy + Math.sin(b) * rr), 2); } } }); }
  function init() {
    AP.onCast('sting', p => buzz(p.x + p.face * 10, p.y - 26, 2, 1.6));
    AP.onCast('honey_trap', p => honey(p.x + p.face * 30, p.y - 10, 10));
    AP.onCast('hive_burst', p => hexRing(p.x + p.face * 30, p.y - 20, 26, 20));
    AP.onCast('royal_jelly', p => { AP.fx({ x: p.x, y: p.y - 46, life: 30, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; for (let i = -2; i <= 2; i++) art.rect(ctx, C.wax, sx + i * 3 - 1, R(sy - Math.abs(i) * 0 - (i % 2 ? 3 : 0)), 2, 4 + (i % 2 ? 0 : 3)); D2.glow(ctx, sx, sy, 12, C.wax, 0.4); } }); buzz(p.x, p.y - 30, 6, 1.4); });
    AP.onCast('waggle_dance', p => { const o = AP.foeOf(p); if (o) AP.fx({ x: o.x, y: o.y - 24, life: 40, draw(ctx, q, sx, sy, t) { for (let i = 0; i < 8; i++) { const a = t * 10 + i * PI / 4; bee(ctx, R(sx + Math.sin(a) * 26), R(sy + Math.sin(a * 2) * 10), 1, t + i * 0.1); } } }); });
  }

  // ---------- W+I: Killer Swarm ----------
  const LEN = 204, FIN = 152, BU = 118, DARK = 50;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -22], [44, 2.4, 1, 'hero', 2, -22],
    [DARK, 1.05, 0.8, 'mid', 0, -30], [92, 1.3, 0.9, 'target'], [BU, 1.6, 1, 'target', 0, -40], [FIN - 2, 2.0, 1, 'target', 0, -30],
    [FIN, 1.3, 1, 'target'], [FIN + 8, 1.6, 1, 'target'], [FIN + 34, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function rivers(ctx, o) {   // the sky dark with bees, in rivers
    const st = o.st; if (st < DARK || st >= FIN) return;
    const k = ease((st - DARK) / 16), n = R(160 * k);
    for (let i = 0; i < n; i++) { const river = i % 4, sp = 3 + river, x = ((st - DARK) * sp * 1.6 + i * 23) % (SW.W + 40) - 20, y = 20 + river * 34 + Math.sin((x + i * 13) * 0.05 + st * 0.1) * 12 + ((i * 7) % 11); bee(ctx, R(river % 2 ? x : SW.W - x), R(y), 1, st * 0.05 + i * 0.13); }
  }
  function comb(T) {   // a cage of honeycomb closing round the target, cell by cell
    const cells = []; for (let r = -3; r <= 3; r++) for (let c = -3; c <= 3; c++) { const x = c * 13 + (r % 2 ? 6.5 : 0), y = r * 11; const d = Math.hypot(x, y); if (d > 22 && d < 46) cells.push([x, y, d]); }
    AP.fx({ x: T.x, y: T.y - 26, life: FIN - 92 + 40, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 20, br = st >= FIN ? ease((st - FIN) / 14) : 0;
      cells.forEach(([x, y, d], i) => { if (st < 92 + i * 1.2) return; const ox = x * (1 + br * 1.6), oy = y * (1 + br * 1.6) + br * br * 30; ctx.globalAlpha = 1 - br; for (let j = 0; j < 6; j++) { const a = j * PI / 3 + PI / 6, b = (j + 1) * PI / 3 + PI / 6; art.line(ctx, C.ad, R(sx + ox + Math.cos(a) * 7), R(sy + oy + Math.sin(a) * 7), R(sx + ox + Math.cos(b) * 7), R(sy + oy + Math.sin(b) * 7), 2); art.line(ctx, C.wax, R(sx + ox + Math.cos(a) * 6), R(sy + oy + Math.sin(a) * 6), R(sx + ox + Math.cos(b) * 6), R(sy + oy + Math.sin(b) * 6), 1); } void d; });
    } });
  }
  function greatBee(T) {   // the swarm as one great bee over them, driving its stinger down on the blow
    AP.fx({ x: T.x, y: T.y - 84, life: FIN - BU + 30, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 20, form = easeOut((st - BU) / 20), dive = st >= FIN - 4 ? easeOut((st - (FIN - 4)) / 6) : 0, gone = st >= FIN + 6 ? ease((st - FIN - 6) / 10) : 0;
      if (form <= 0 || gone >= 1) return;
      const Y = R(sy + dive * 56), s = 1.6 * form;
      ctx.globalAlpha = (1 - gone);
      for (let i = 0; i < 40; i++) { const a = i * 2.4, r = (1 - form) * 60 + 4; bee(ctx, R(sx + Math.cos(a + st * 0.2) * r * 1.4), R(Y + Math.sin(a + st * 0.2) * r * 0.6), 1, st * 0.1 + i); }   // the swarm, gathering
      if (form > 0.6) {
        const br = 12 * s; art.disc(ctx, C.blk, sx, Y, R(br) + 1); for (let i = -2; i <= 2; i += 2) { const x0 = i * 4 * s, h = Math.sqrt(Math.max(0, br * br - x0 * x0)) * 0.9; art.rect(ctx, C.a, sx + R(x0) - R(1.5 * s), Y - R(h), R(3 * s), R(h * 2)); }
        for (const d of [-1, 1]) { art.disc(ctx, C.wing, sx + R(d * 14 * s), Y - R(14 * s + Math.sin(st * 1.4) * 3), R(9 * s)); art.disc(ctx, C.w, sx + R(d * 14 * s), Y - R(15 * s + Math.sin(st * 1.4) * 3), R(4 * s)); }
        for (let j = 0; j < R(18 * s); j++) art.rect(ctx, j < 3 ? C.w : C.blk, sx - 1, Y + R(10 * s) + j, 3 - (j > 10 ? 1 : 0), 1);   // the stinger
      }
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.a2, C.a, C.ad, C.blk],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.a2, c2: C.a, tag: 'APEX XII', glyph(ctx, x, y, t) { bee(ctx, x, y, 1, t * 3); bee(ctx, x - 8, y + 4, 1, t * 3 + 0.5); bee(ctx, x + 8, y + 3, 1, t * 3 + 0.2); } }),
    every(st, o) {
      const { T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === DARK) SW.audio.sfx('charge');
      if (T && st === 92) comb(T);
      if (T && st === BU) greatBee(T);
      if (st > DARK && st < FIN && st % 5 === 0) SW.audio.sfx('dash');
    },
    build() {},
    finish(o) {
      const { cx, cy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(12, 22);
      honey(cx, cy, 24); buzz(cx, cy, 20, 3.4);
      fx.ring(cx, cy, C.w, 6, 110, 22); fx.ring(cx, cy, C.a, 4, 80, 18);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < BU) return ['cast', (st >> 3) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#3a2400', 0.2] };
      if (st >= DARK && st < FIN) return { vig: 0.4 + 0.2 * ease((st - DARK) / 40), grade: ['#2a1a00', 0.35 * ease((st - DARK) / 20)], draw: rivers, lines: st >= BU + 20 ? 20 : 0, lineCol: C.a2 };
      if (st >= FIN && st < FIN + 3) return { impact: 'gold' };
      if (st >= FIN + 3 && st < FIN + 10) return { lines: 36, lineCol: C.a2, split: 2, vig: 0.4 };
      return null;
    }
  };

  AP.reg('apis', {
    weapon: { name: 'stinger', len: 18, w: 2, col: C.a, hi: C.a2, hilt: C.wax, armed: 1, draw: stinger },
    melee, ult, init,
    tune: { dmg: 1.08, hp: 1.05 }
  });
})();
