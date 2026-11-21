'use strict';
// Shattered Worlds — APEX Tessa, the Second Hand (#3 of the strongest 16: 90% in the open tournaments). On top of
// js/tessa-clock.js (her brass clockwork looks and the grey world of her ultimate), which stays:
//   weapon   THE MINUTE HAND: a brass clock hand as a rapier, a spade tip, a counterweight ring, a gear for a hub; she
//            fights with the armed poses
//   J        a thrust, a sweeping arc, a thrust, and for the last a whole dial: twelve ticks round the blade's sweep
//            and the hand stopping on the hour; hits throw little cogs and ticks, the last one stops the world
//   skills   Stopwatch: a dial of ticks round her hand; Rewind: a ring of hands spinning backward where she lands;
//            Slow Hour: twelve brass ticks round the bubble as it opens; Second Hand: a gear behind her as the great
//            hand sweeps; Time Bomb: sparks and a wound spring
//   W+I      THE STOPPED CLOCK, a film of its own (214 frames): the world goes grey (js/tessa-clock.js); a close-up on her
//            with the watch and her card; a giant dial rises behind them, its hands racing backward until they stop; she
//            walks through the stopped moment and leaves cuts hanging in the air round the target, frozen; three ticks
//            (the camera jumps in on each); on the fourth every cut lands at once on a gold impact frame and the dial
//            breaks into gears
//   numbers  Versus: x1.12 damage, x1.1 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.tessa) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { b: '#d8a040', b2: '#ffe8a0', bd: '#5a3a10', cream: '#fff6e0', rose: '#e8a090', rose2: '#ffe4d8', ink: '#1a1410', grey: '#8a8a90', w: '#ffffff' };

  // ---------- the weapon: the Minute Hand ----------
  function minuteHand(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [a0x, a0y] = P(1, 0), [a1x, a1y] = P(L - 5 * sc, 0);
    T.pline(x, C.bd, a0x, a0y, a1x, a1y, Math.max(2, R(1.6 * sc)) + 1); T.pline(x, C.b, a0x, a0y, a1x, a1y, Math.max(1, R(1.2 * sc)));
    for (let i = 3; i < L - 6 * sc; i += 3) { const [hx, hy] = P(i, -0.5); T.rect(x, C.b2, R(hx), R(hy), 1, 1); }
    const sp = 2.6 * sc;   // the spade tip: a diamond with a notch
    for (let u = 0; u <= 5 * sc; u++) { const w = R(sp * Math.sin(Math.PI * u / (5 * sc))); for (let v = -w; v <= w; v++) { const [sx, sy] = P(L - 5 * sc + u, v); T.rect(x, Math.abs(v) === w ? C.bd : u > 3 * sc ? C.b2 : C.b, R(sx), R(sy), 1, 1); } }
    const [rx, ry] = P(L * 0.32, 0); T.disc(x, C.bd, rx, ry, R(1.8 * sc)); T.disc(x, C.b, rx, ry, Math.max(1, R(1.1 * sc)));   // the counterweight ring
    const [gx, gy] = P(0, 0); T.disc(x, C.bd, gx, gy, R(2.2 * sc)); T.disc(x, C.b, gx, gy, R(1.5 * sc)); T.rect(x, C.cream, R(gx), R(gy), 1, 1);   // the hub
  }

  // ---------- J: thrusts, an arc, and the dial ----------
  function cogs(x, y, n, sp) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, PI * 2), s = rand(0.8, sp || 2.4), life = R(rand(14, 24)), big = i % 3 === 0;
      AP.fx({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.2, life, draw(ctx, q, sx, sy, t) {
        const k = q.max - q.life, X = R(sx + q.vx * k), Y = R(sy + q.vy * k + 0.06 * k * k);
        ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
        if (big) { art.disc(ctx, C.bd, X, Y, 3); art.disc(ctx, C.b, X, Y, 2); art.rect(ctx, C.ink, X, Y, 1, 1); for (let j = 0; j < 4; j++) { const aa = j * PI / 2 + k * 0.3; art.rect(ctx, C.b, R(X + Math.cos(aa) * 3.5), R(Y + Math.sin(aa) * 3.5), 1, 1); } }
        else art.rect(ctx, i % 2 ? C.b2 : C.cream, X, Y, 2, 1);
      } });
    }
  }
  function dial(ctx, q, x, y, t) {   // the last hit: a dial round the sweep, the hand stopping on the hour
    const f = q.face, cx = x + f * 20, cy = y - 24, r = 24 * easeOut(t * 2.5), fade = 1 - ease((t - 0.55) / 0.45);
    ctx.globalAlpha = fade;
    D2.ring(ctx, cx, cy, r, C.bd, 2); D2.ring(ctx, cx, cy, r - 1, C.b, 1);
    for (let i = 0; i < 12; i++) { const a = i * PI / 6, l = i % 3 ? 3 : 6; art.line(ctx, i % 3 ? C.b : C.cream, R(cx + Math.cos(a) * (r - l)), R(cy + Math.sin(a) * (r - l)), R(cx + Math.cos(a) * r), R(cy + Math.sin(a) * r), 1); }
    const ha = -PI / 2 + Math.min(1, t * 2.2) * PI * 2 * f;   // the hand sweeps all the way round and stops at twelve
    D2.crescent(ctx, cx, cy, r * 0.75, -PI / 2, ha, 6, 1, [C.bd, C.b, C.b2]);
    art.line(ctx, C.cream, cx, cy, R(cx + Math.cos(ha) * r * 0.9), R(cy + Math.sin(ha) * r * 0.9), 2);
    if (t > 0.4 && t < 0.55) D2.burst(ctx, cx, cy - r, 10, 10, [C.b2, C.w]);
  }
  const melee = {
    col: C.b, hi: C.b2, dk: C.bd,
    swing(ctx, q, x, y, t) { if (q.fin) return dial(ctx, q, x, y, t); return (q.n === 1 ? AP.SWINGS.crescent : AP.SWINGS.thrust)(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { cogs(x, y, fin ? 10 : 4, fin ? 3 : 2); if (fin) { AP.stop(4); SW.audio.sfx('select'); } }
  };

  // ---------- skills ----------
  function ticks(x, y, r0, r1, life, col, back) {   // a dial of twelve ticks opening out
    AP.fx({ x, y, life: life || 20, back, draw(ctx, q, sx, sy, t) {
      const r = r0 + (r1 - r0) * easeOut(t * 1.4); ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5);
      for (let i = 0; i < 12; i++) { const a = i * PI / 6 + t * 0.6, l = i % 3 ? 3 : 7; art.line(ctx, i % 3 ? (col || C.b) : C.cream, R(sx + Math.cos(a) * r), R(sy + Math.sin(a) * r), R(sx + Math.cos(a) * (r + l)), R(sy + Math.sin(a) * (r + l)), i % 3 ? 1 : 2); }
    } });
  }
  function backwardHands(x, y) {
    AP.fx({ x, y, life: 28, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5); D2.ring(ctx, sx, sy, 14, C.b, 1); const a = -t * 14, b = -t * 3; art.line(ctx, C.cream, sx, sy, R(sx + Math.cos(a) * 11), R(sy + Math.sin(a) * 11), 1); art.line(ctx, C.b2, sx, sy, R(sx + Math.cos(b) * 7), R(sy + Math.sin(b) * 7), 2); } });
  }
  function gear(x, y, r, life, back, spin) {
    AP.fx({ x, y, life, back, draw(ctx, q, sx, sy, t) {
      const k = easeOut(t * 3), rr = r * k, a0 = t * (spin || 3); ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
      D2.disc(ctx, sx, sy, rr + 1, C.bd); D2.disc(ctx, sx, sy, rr - 1, C.b); D2.disc(ctx, sx, sy, rr * 0.45, C.bd); D2.disc(ctx, sx, sy, rr * 0.3, C.cream);
      for (let i = 0; i < 10; i++) { const a = a0 + i * PI / 5; art.rect(ctx, C.bd, R(sx + Math.cos(a) * (rr + 2)) - 2, R(sy + Math.sin(a) * (rr + 2)) - 2, 4, 4); art.rect(ctx, C.b, R(sx + Math.cos(a) * (rr + 2)) - 1, R(sy + Math.sin(a) * (rr + 2)) - 1, 2, 2); }
    } });
  }
  function init() {
    AP.onCast('stopwatch', p => ticks(p.x + p.face * 14, p.y - 26, 4, 16, 18));
    AP.onCast('rewind', p => { backwardHands(p.x, p.y - 24); cogs(p.x, p.y - 20, 6, 1.6); });
    AP.onCast('slow_hour', p => ticks(p.x + p.face * 40, p.y - 24, 10, 40, 26, C.rose2));
    AP.onCast('second_hand', p => { gear(p.x - p.face * 6, p.y - 30, 16, 36, true, 4); SW.audio.sfx('select'); });
    AP.onCast('time_bomb', p => { cogs(p.x + p.face * 16, p.y - 6, 8, 1.8); ticks(p.x + p.face * 16, p.y - 6, 2, 10, 14); });
  }

  // ---------- W+I: The Stopped Clock ----------
  const LEN = 214, FIN = 160, BU = 130, WALK = 84;
  const S = { cuts: [] };   // the cuts she leaves hanging in the stopped moment
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 4, -20],          // her face and the watch
    [42, 2.4, 1, 'hero', 4, -20], [52, 1.2, 0.8, 'mid', 0, -20], [WALK, 1.35, 0.9, 'mid', 0, -20],  // the great dial rises
    [WALK + 6, 1.8, 1, 'target'], [BU, 1.9, 1, 'target'],                                          // she walks the moment
    [BU + 2, 2.1, 1, 'target', 0, 0, 'cut'], [BU + 12, 2.25, 1, 'target', 0, 0, 'cut'], [BU + 22, 2.4, 1, 'target', 0, 0, 'cut'],   // tick, tick, tick
    [FIN - 2, 2.4, 1, 'target'], [FIN, 1.3, 1, 'target'], [FIN + 8, 1.7, 1, 'target'], [FIN + 34, 1.2, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function bigDial(T, p) {   // a dial as tall as the arena behind them, its hands racing backward until they stop
    const mx = (p.x + (T ? T.x : p.x + 80)) / 2, my = p.y - 70;
    AP.fx({ x: mx, y: my, life: FIN - 52 + 50, back: true, draw(ctx, q, sx, sy, t) {
      const st = p.st || 0, rise = easeOut((st - 52) / 20), br = st >= FIN ? ease((st - FIN) / 22) : 0, r = R(78 * rise);
      if (r < 2) return;
      ctx.globalAlpha = 0.85 * (1 - br);
      D2.ring(ctx, sx, sy, r, C.bd, 3); D2.ring(ctx, sx, sy, r - 3, C.b, 2); D2.ring(ctx, sx, sy, r - 10, C.bd, 1);
      for (let i = 0; i < 60; i++) { const a = i * PI / 30, l = i % 5 ? 2 : 6; art.line(ctx, i % 15 ? C.b : C.cream, R(sx + Math.cos(a) * (r - 5 - l)), R(sy + Math.sin(a) * (r - 5 - l)), R(sx + Math.cos(a) * (r - 5)), R(sy + Math.sin(a) * (r - 5)), i % 5 ? 1 : 2); }
      const run = Math.max(0, Math.min(1, (st - 52) / (WALK - 52)));   // racing backward, slowing, stopped
      const ma = -PI / 2 - (1 - (1 - run) * (1 - run)) * PI * 8, ha = -PI / 2 - (1 - (1 - run) * (1 - run)) * PI * 0.66;
      const shake = st >= BU && st < FIN && (st - BU) % 10 < 2 ? 1 : 0;
      art.line(ctx, C.bd, sx, sy, R(sx + Math.cos(ma) * (r - 14)), R(sy + Math.sin(ma) * (r - 14)) + shake, 4); art.line(ctx, C.b2, sx, sy, R(sx + Math.cos(ma) * (r - 14)), R(sy + Math.sin(ma) * (r - 14)) + shake, 2);
      art.line(ctx, C.bd, sx, sy, R(sx + Math.cos(ha) * (r * 0.55)), R(sy + Math.sin(ha) * (r * 0.55)), 6); art.line(ctx, C.b, sx, sy, R(sx + Math.cos(ha) * (r * 0.55)), R(sy + Math.sin(ha) * (r * 0.55)), 3);
      D2.disc(ctx, sx, sy, 6, C.bd); D2.disc(ctx, sx, sy, 4, C.b); art.rect(ctx, C.cream, sx - 1, sy - 1, 2, 2);
      if (br > 0) for (let i = 0; i < 18; i++) { const a = i * 0.35 + 0.2, d = r * (0.3 + br * 1.4), gx = R(sx + Math.cos(a) * d), gy = R(sy + Math.sin(a) * d + br * br * 60); art.disc(ctx, C.bd, gx, gy, 4); art.disc(ctx, i % 2 ? C.b : C.b2, gx, gy, 3); art.rect(ctx, C.ink, gx, gy, 1, 1); }
    } });
  }
  function hangCut(T, i, p) {   // a cut left in the stopped air round the target; it lands on the blow
    const a = rand(0, PI), l = rand(26, 46), ox = rand(-26, 26), oy = rand(-40, -6);
    const cut = AP.fx({ x: T.x + ox, y: T.y + oy, a, l, life: FIN - (p.st || 0) + 34, draw(ctx, q, sx, sy, t) {
      const st = p.st || 0, born = Math.min(1, (q.max - q.life) / 4), rel = st >= FIN ? Math.min(1, (st - FIN) / 8) : 0;
      const L = q.l * (1 + rel * 1.6), ux = Math.cos(q.a) * L / 2, uy = Math.sin(q.a) * L / 2, pulse = st >= BU && (st - BU) % 10 < 3;
      ctx.globalAlpha = rel ? 1 - rel : born;
      D2.streak(ctx, sx - ux, sy - uy, sx + ux, sy + uy, rel ? 5 : 3, rel ? [C.b, C.b2, C.w] : pulse ? [C.bd, C.b2, C.w] : [C.bd, C.b, C.cream]);
      if (!rel) { art.rect(ctx, C.cream, R(sx - ux) - 1, R(sy - uy) - 1, 2, 2); art.rect(ctx, C.cream, R(sx + ux) - 1, R(sy + uy) - 1, 2, 2); }
    } });
    S.cuts.push(cut);
    if (fx.ghost && p.sheet) fx.ghost(p.sheet(), i % 2 ? 'a2' : 'a3', 1, T.x + ox * 0.6 + (i % 2 ? -28 : 28), T.y, i % 2 === 0, C.rose);
    SW.audio.sfx('dash');
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 44, c: [C.b2, C.b, C.bd, C.rose],
    zoom,
    card: AP.card({ from: 18, to: 48, c1: C.b2, c2: C.bd, tag: 'APEX III', glyph(ctx, x, y, t) { art.disc(ctx, C.bd, x, y, 8); art.disc(ctx, C.cream, x, y, 6); const a = -PI / 2 + t * PI * 4; art.line(ctx, C.bd, x, y, R(x + Math.cos(a) * 5), R(y + Math.sin(a) * 5), 1); art.line(ctx, C.bd, x, y, x, y - 3, 1); } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 1) S.cuts = [];
      if (st === 16) { SW.audio.sfx('select'); ticks(p.x + p.face * 6, p.y - 30, 3, 12, 22); }
      if (st === 52) { bigDial(T, p); SW.audio.sfx('charge'); }
      if (T && st >= WALK && st < BU && (st - WALK) % 6 === 0) hangCut(T, (st - WALK) / 6, p);
      if (st >= BU && st < FIN && (st - BU) % 10 === 0) { SW.audio.sfx('select'); fx.shake(2, 3); }
      if (st > FIN + 4 && st < LEN - 24 && st % 4 === 0) cogs(G.cam.x + rand(0, SW.W), G.cam.y + rand(0, 30), 1, 0.5);
    },
    build() {},   // the cuts and the ticks above are the build-up
    noDark: true,
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(12, 22);
      fx.ring(cx, cy, C.w, 6, 120, 24); fx.ring(cx, cy, C.b, 4, 90, 20);
      cogs(cx, cy, 34, 4.2); gear(cx, cy, 22, 26, false, 8);
      void gy;
    },
    pose(st) {
      if (st < 72) return null;
      if (st < WALK) return ['cast', (st >> 3) % 2];
      if (st < BU) return ['a3', 1];
      if (st < FIN - 4) return ['charge', 0];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 44) return { vig: 0.5, grade: ['#3a2a10', 0.18] };
      if (st >= 52 && st < BU) return { vig: 0.35 };
      if (st >= BU && st < FIN) { const tick = (st - BU) % 10 < 2; return tick ? { impact: 'tint', tint: '#ffd890', lines: 24, lineCol: C.b2 } : { vig: 0.5, lines: 10, lineCol: C.b }; }
      if (st >= FIN && st < FIN + 3) return { impact: 'gold' };
      if (st >= FIN + 3 && st < FIN + 5) return { impact: 'neg' };
      if (st >= FIN + 5 && st < FIN + 12) return { lines: 40, lineCol: C.b2, split: 2, vig: 0.4 };
      return null;
    }
  };

  AP.reg('tessa', {
    weapon: { name: 'minutehand', len: 20, w: 2, col: C.b, hi: C.b2, hilt: C.bd, armed: 1, draw: minuteHand },
    melee, ult, init,
    tune: { dmg: 1.12, hp: 1.1 }
  });
})();
