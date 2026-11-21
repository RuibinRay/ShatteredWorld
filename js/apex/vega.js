'use strict';
// Shattered Worlds — APEX Vega, the Weight of Stars (#7 of the strongest 16). On top of js/vega-star.js (her stars and
// wells), which stays:
//   weapon   THE STAR SCEPTRE: a dark sceptre crowned with a small white star that a tiny moon circles; she fought
//            bare-handed in the sprites, she now swings it with the armed poses
//   J        rings of weight that close in on the blow instead of spreading out; the last hit is a tiny black hole that
//            swallows the light and spits it back; hits drag specks of dust into the point of impact
//   skills   Heavy Star: a falling-star streak at her hand; Crush: the ground cracks round her feet; Singularity: a
//            ring of in-falling light; Fall Up: dust rising off the floor ahead; Gravity Well: a ring that closes
//   W+I      EVENT HORIZON, a film of its own (208 frames): her close-up under the crown and her card; everything lifts
//            (stones and dust rise across the screen); a black hole opens above the target with a bright ring of
//            light round it; the camera tilts down the pull; gravity remembers: an ink impact frame and the target
//            slams into a floor that cracks in a ring while the hole collapses to a white point and bursts
//   numbers  Versus: x1.1 damage, x1.08 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.vega) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { v: '#9d6cff', v2: '#e4d8ff', vd: '#2a1458', ink: '#06040e', gold: '#ffe08a', w: '#ffffff', rock: '#5a5070', rock2: '#8a80a0' };

  // ---------- the weapon: the Star Sceptre ----------
  function sceptre(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [s0x, s0y] = P(-2 * sc, 0), [s1x, s1y] = P(L - 3 * sc, 0);
    T.pline(x, C.ink, s0x, s0y, s1x, s1y, Math.max(2, R(1.5 * sc)) + 1); T.pline(x, C.vd, s0x, s0y, s1x, s1y, Math.max(1, R(1.1 * sc)));
    for (let i = 2; i < L - 4; i += 5) { const [bx, by] = P(i, 0); T.rect(x, C.v, R(bx), R(by), 1, 1); }
    const [cx, cy] = P(L, 0);   // the crown of the sceptre: a white star in a dark cradle, a tiny moon
    T.disc(x, C.ink, cx, cy, R(3 * sc)); T.disc(x, C.v2, cx, cy, R(2.1 * sc)); T.disc(x, C.w, cx, cy, Math.max(1, R(1.2 * sc)));
    for (let i = 0; i < 4; i++) { const aa = a + i * PI / 2, [rx, ry] = [cx + Math.sin(aa) * 4 * sc, cy + Math.cos(aa) * 4 * sc]; T.rect(x, C.w, R(rx), R(ry), 1, 1); }
    const [mx, my] = P(L - 1, 4 * sc); T.rect(x, C.gold, R(mx), R(my), Math.max(1, R(sc)), Math.max(1, R(sc)));
  }

  // ---------- J ----------
  function specks(x, y, n, r0) {   // dust dragged into the point of impact
    for (let i = 0; i < n; i++) { const a = rand(0, PI * 2), d = rand(r0 * 0.6, r0), life = R(rand(10, 16)); AP.fx({ x, y, a, d, life, draw(ctx, q, sx, sy, t) { const k = 1 - easeOut(t); ctx.globalAlpha = 0.5 + 0.5 * t; art.rect(ctx, i % 3 ? C.v2 : C.w, R(sx + Math.cos(q.a) * q.d * k), R(sy + Math.sin(q.a) * q.d * k), 1, 1); } }); }
  }
  function implode(ctx, q, x, y, t) {   // rings that close in on the blow
    const f = q.face, cx = x + f * (22 + q.n * 2), cy = y - 22, s = 1 + (q.fin ? 0.6 : 0);
    ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
    for (let i = 0; i < 3; i++) { const tt = t * 1.6 - i * 0.18; if (tt > 0 && tt < 1) D2.ring(ctx, cx, cy, (22 - 18 * easeOut(tt)) * s, i % 2 ? C.v2 : C.v, 1); }
    if (t > 0.5 && t < 0.7) D2.burst(ctx, cx, cy, 6 * s, 8, [C.v2, C.w]);
  }
  function hole(ctx, q, x, y, t) {   // the last hit: a tiny black hole that swallows the light and spits it back
    const f = q.face, cx = x + f * 26, cy = y - 24, grow = t < 0.6 ? easeOut(t / 0.6) : 1 - ease((t - 0.6) / 0.25), r = 10 * grow;
    if (r > 0.5) { D2.ring(ctx, cx, cy, r + 3, C.v2, 1); D2.ring(ctx, cx, cy, r + 2, C.v, 1); D2.disc(ctx, cx, cy, r, C.ink); for (let i = 0; i < 8; i++) { const a = t * 6 + i * PI / 4, rr = r + 6 - 4 * ((t * 3 + i * 0.3) % 1); art.rect(ctx, C.v2, R(cx + Math.cos(a) * rr), R(cy + Math.sin(a) * rr * 0.5), 1, 1); } }
    if (t > 0.82) { ctx.globalAlpha = 1 - ease((t - 0.82) / 0.18); D2.burst(ctx, cx, cy, 22, 14, [C.w, C.v2, C.v]); }
  }
  const melee = {
    col: C.v, hi: C.v2, dk: C.ink, life: 15,
    swing(ctx, q, x, y, t) { if (q.fin) return hole(ctx, q, x, y, t); return implode(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { specks(x, y, fin ? 16 : 6, fin ? 40 : 24); if (fin) { AP.stop(5); fx.shake(4, 8); } }
  };

  // ---------- skills ----------
  function closing(x, y, r, life) { AP.fx({ x, y, life, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 0.4 + 0.6 * t; D2.ring(ctx, sx, sy, r * (1 - easeOut(t)) + 2, C.v2, 2); D2.ring(ctx, sx, sy, r * (1 - easeOut(t)) * 0.7 + 1, C.v, 1); } }); }
  function groundCrack(x, y, w, life) { AP.fx({ x, y, life, back: true, draw(ctx, q, sx, sy, t) { const k = easeOut(t * 3); ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4); for (let i = 0; i < 6; i++) { const s = i % 2 ? 1 : -1, l = (8 + (i * 7) % 14) * k * w; art.line(ctx, C.ink, sx, sy, R(sx + s * l), R(sy - (i % 3)), 2); art.line(ctx, C.v, sx, sy - 1, R(sx + s * l * 0.8), R(sy - 1 - (i % 3)), 1); } } }); }
  function rising(x, y, n, w) { for (let i = 0; i < n; i++) { const ox = rand(-w, w), life = R(rand(20, 34)), sz = 1 + (i % 3); AP.fx({ x: x + ox, y, life, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - ease((t - 0.7) / 0.3); art.rect(ctx, i % 2 ? C.rock2 : C.rock, sx, R(sy - 40 * easeOut(t)), sz, sz); } }); } }
  function init() {
    AP.onCast('heavy_star', p => AP.fx({ x: p.x + p.face * 18, y: p.y - 40, f: p.face, life: 12, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.streak(ctx, sx - q.f * 20 * (1 - t), sy - 10 * (1 - t), sx, sy, 3, [C.v, C.v2, C.w]); } }));
    AP.onCast('crush', p => { groundCrack(p.x, p.y, 3, 30); fx.shake(3, 6); });
    AP.onCast('singularity', p => closing(p.x + p.face * 30, p.y - 22, 30, 20));
    AP.onCast('fall_up', p => rising(p.x + p.face * 50, p.y, 12, 30));
    AP.onCast('gravity_well', p => closing(p.x + p.face * 50, p.y - 10, 44, 26));
  }

  // ---------- W+I: Event Horizon ----------
  const LEN = 208, FIN = 156, BU = 126, LIFT = 52;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -24], [44, 2.4, 1, 'hero', 2, -24],
    [LIFT, 1.1, 0.8, 'mid', 0, -30], [96, 1.3, 0.9, 'target', 0, -70], [BU, 1.6, 1, 'target', 0, -60],
    [FIN - 4, 2.2, 1, 'target', 0, -20], [FIN, 1.3, 1, 'target', 0, 10], [FIN + 8, 1.7, 1, 'target', 0, 6], [FIN + 34, 1.2, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  const STONES = []; for (let i = 0; i < 26; i++) STONES.push({ x: (i * 37) % 480, s: 2 + (i % 4), v: 0.6 + (i % 5) * 0.25, ph: i * 13 });
  function lift(ctx, o) {   // everything lifts: stones and dust rising across the screen
    const st = o.st; if (st < LIFT || st >= FIN) return;
    const k = ease((st - LIFT) / 14);
    for (const s of STONES) { const y = SW.H - ((st - LIFT) * s.v * 2 + s.ph) % (SW.H + 20); ctx.globalAlpha = 0.85 * k; art.rect(ctx, C.ink, s.x - 1, R(y) - 1, s.s + 2, s.s + 2); art.rect(ctx, s.s > 3 ? C.rock2 : C.rock, s.x, R(y), s.s, s.s); }
    ctx.globalAlpha = 1;
  }
  function blackHole(T) {   // the hole over the target, with its bright ring
    AP.fx({ x: T.x, y: T.y - 80, life: FIN - 92 + 40, draw(ctx, q, sx, sy, t, cam) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 20;
      const grow = easeOut((st - 92) / 24), col = st >= FIN ? 1 - ease((st - FIN) / 6) : 1, r = R(26 * grow * col);
      if (r < 1) return;
      for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.5 - i * 0.12; D2.ring(ctx, sx, sy, r + 6 + i * 5, i ? C.v : C.v2, 2); }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 40; i++) { const a = st * 0.12 + i * PI / 20, rr = r + 3 + (i % 3); art.rect(ctx, i % 4 ? C.v2 : C.gold, R(sx + Math.cos(a) * rr * 1.6), R(sy + Math.sin(a) * rr * 0.45), 2, 1); }   // the bright ring, seen edge on
      D2.disc(ctx, sx, sy, r, C.ink);
      for (let i = 0; i < 20; i++) { const a = st * 0.12 + i * PI / 10; if (Math.sin(a) < 0) continue; const rr = r + 3; art.rect(ctx, C.w, R(sx + Math.cos(a) * rr * 1.6), R(sy + Math.sin(a) * rr * 0.45), 2, 1); }   // the near side passes in front
    } });
  }
  function slam(cx, gy) {
    AP.fx({ x: cx, y: gy, life: 30, back: true, draw(ctx, q, sx, sy, t) { const k = easeOut(t * 2); ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4); for (let i = 0; i < 14; i++) { const a = i * PI / 7, l = (20 + (i * 13) % 30) * k * 2; art.line(ctx, C.ink, sx, sy, R(sx + Math.cos(a) * l), R(sy + Math.sin(a) * l * 0.18), 3); art.line(ctx, C.v, sx, sy - 1, R(sx + Math.cos(a) * l * 0.9), R(sy - 1 + Math.sin(a) * l * 0.16), 1); } } });
    for (let i = 0; i < 3; i++) fx.ring(cx, gy - 4, i ? C.v : C.w, 6 + i * 4, 120 + i * 30, 20 + i * 4);
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.v2, C.v, C.vd, C.ink],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.v2, c2: C.v, tag: 'APEX VII', glyph(ctx, x, y, t) { art.disc(ctx, C.ink, x, y, 6); D2.ring(ctx, x, y, 8, C.v2, 1); for (let i = 0; i < 8; i++) { const a = t * 6 + i * PI / 4; art.rect(ctx, C.w, R(x + Math.cos(a) * 11), R(y + Math.sin(a) * 4), 1, 1); } } }),
    every(st, o) {
      const { T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === LIFT) { SW.audio.sfx('charge'); fx.shake(3, 20); }
      if (T && st === 92) blackHole(T);
      if (T && st > 92 && st < FIN && st % 3 === 0) specks(T.x, T.y - 80, 3, 60);
      if (st === BU) SW.audio.sfx('charge');
    },
    build(k) { if (k % 8 === 0) fx.shake(2, 4); },
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(14, 26);
      slam(cx, gy);
      AP.fx({ x: cx, y: cy - 60, life: 16, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.disc(ctx, sx, sy, 3 + 40 * easeOut(t), C.w); D2.disc(ctx, sx, sy, 2 + 30 * easeOut(t), C.v2); } });
      specks(cx, cy, 30, 70);
      void cy;
    },
    pose(st) {
      if (st < 72) return null;
      if (st < 92) return ['cast', (st >> 3) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#1a0a3a', 0.22] };
      if (st >= LIFT && st < BU) return { vig: 0.35, draw: lift, grade: ['#1a0a3a', 0.15] };
      if (st >= BU && st < FIN) return { vig: 0.55, draw: lift, lines: 22, lineCol: C.v2, grade: ['#1a0a3a', 0.28] };
      if (st >= FIN && st < FIN + 3) return { impact: 'ink' };
      if (st >= FIN + 3 && st < FIN + 5) return { impact: 'tint', tint: '#c8a8ff' };
      if (st >= FIN + 5 && st < FIN + 14) return { lines: 40, lineCol: C.v2, split: 3, vig: 0.4 };
      return null;
    }
  };

  AP.reg('vega', {
    weapon: { name: 'starsceptre', len: 18, w: 2, col: C.vd, hi: C.v, hilt: C.ink, armed: 1, draw: sceptre },
    melee, ult, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
