'use strict';
// Shattered Worlds — APEX Ferra, the Scrap Queen (#11 of the strongest 16). On top of js/ferra-scrap.js (her scrap and
// the crusher-plate finish), which stays:
//   weapon   THE SCRAPCLEAVER: a heavy cleaver welded out of junk, a saw-toothed back, a hazard-striped band, rivets
//   J        heavy arcs that throw sparks like a grinder, and on the last a magnetic slam: field lines snap shut on the
//            target; every hit that lands throws hot sparks and bolts
//   skills   sparks and a polarity ring on her skills; Scrap Halo a magnetic ring; Scrap Tornado a gust of bolts
//   W+I      JUNKYARD COMET, a film of its own (190 frames): her close-up and card; magnetic field lines bend across
//            the screen; every loose piece of metal rises off the floor and streams up into one ball high above the
//            target; the ball comes down as a comet (the camera tilts up, then follows it down), the crusher plates close
//            (js/ferra-scrap.js) on an ink frame and a hazard-yellow frame, and the bolts rain back down
//   numbers  Versus: x1.1 damage, x1.08 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.ferra) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { s: '#8aa4c8', s2: '#e0ecff', sd: '#2a3448', rust: '#a0582a', rust2: '#d08a4a', hz: '#ffd000', ink: '#0a0c10', spark: '#ffe08a', w: '#ffffff', red: '#e63946', blue: '#4cc9f0' };

  // ---------- the weapon: the Scrapcleaver ----------
  function cleaver(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [h0x, h0y] = P(-3 * sc, 0), [h1x, h1y] = P(2, 0); T.pline(x, C.ink, h0x, h0y, h1x, h1y, Math.max(2, R(1.4 * sc)));
    for (let i = 2; i <= L; i++) {
      const u = i / L, w = R((2.4 + 1.2 * u) * sc);
      for (let v = -1; v <= w; v++) { const [bx, by] = P(i, v); const edge = v === w, back = v === -1, saw = back && i % 3 === 0; T.rect(x, edge ? C.s2 : back ? (saw ? C.ink : C.sd) : ((i + v) % 7 === 0 ? C.rust : C.s), R(bx), R(by), 1, 1); }
      if (i >= L * 0.35 && i <= L * 0.45) { const [zx, zy] = P(i, 1); T.rect(x, i % 2 ? C.hz : C.ink, R(zx), R(zy), 1, 1); }   // the hazard band
    }
    for (const u of [0.25, 0.7]) { const [rx, ry] = P(L * u, 1.5 * sc); T.rect(x, C.s2, R(rx), R(ry), 1, 1); }   // rivets
  }

  // ---------- J ----------
  const sparks = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 2.8, grav: 0.12, life: 14, shape(ctx, X, Y, i, t) { art.rect(ctx, t < 0.3 ? C.w : i % 2 ? C.spark : C.rust2, X, Y, 2, 1); } });
  const bolts = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 2.2, up: 1, grav: 0.16, life: 24, shape(ctx, X, Y, i, t) { art.rect(ctx, C.ink, X - 1, Y - 1, 4, 3); art.rect(ctx, i % 2 ? C.s : C.rust, X, Y, 2, 1); } });
  function slam(ctx, q, x, y, t) {   // field lines snapping shut on the target
    const f = q.face, cx = x + f * 26, cy = y - 24, k = easeOut(t * 2);
    ctx.globalAlpha = 1 - ease((t - 0.55) / 0.45);
    for (let i = 0; i < 6; i++) { const r = (36 - 26 * k) * (1 + i * 0.12); art.ring(ctx, i % 2 ? C.red : C.blue, R(cx), R(cy), R(r)); }
    AP.SWINGS.crescent(ctx, Object.assign({}, q, { fin: true }), x, y, t);
    if (t > 0.4 && t < 0.6) D2.burst(ctx, cx, cy, 16, 12, [C.spark, C.w]);
  }
  const melee = {
    col: C.s, hi: C.s2, dk: C.sd,
    swing(ctx, q, x, y, t) { if (q.fin) return slam(ctx, q, x, y, t); AP.SWINGS.crescent(ctx, q, x, y, t); if (t < 0.5) for (let i = 0; i < 4; i++) art.rect(ctx, C.spark, R(x + q.face * (16 + i * 5)), R(y - 18 - i * 3 + t * 20), 2, 1); },
    hit(x, y, n, p, fin) { sparks(x, y, fin ? 16 : 6, fin ? 3.6 : 2.6); if (fin) { bolts(x, y, 6); AP.stop(5); fx.shake(4, 8); } }
  };

  // ---------- skills ----------
  const polar = (x, y, r, life) => AP.fx({ x, y, life, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.ring(ctx, sx, sy, 4 + r * easeOut(t), C.red, 1); D2.ring(ctx, sx, sy, 2 + r * 0.8 * easeOut(t), C.blue, 1); } });
  function init() {
    AP.onCast('sawback', p => sparks(p.x + p.face * 16, p.y - 24, 6));
    AP.onCast('polarity', p => polar(p.x, p.y - 22, 40, 18));
    AP.onCast('scrap_halo', p => polar(p.x, p.y - 22, 30, 22));
    AP.onCast('scrap_press', p => { const o = AP.foeOf(p); if (o) sparks(o.x, o.y - 24, 12, 3); });
    AP.onCast('scrap_tornado', p => bolts(p.x + p.face * 20, p.y - 20, 10, 2.6));
  }

  // ---------- W+I: Junkyard Comet ----------
  const LEN = 190, FIN = 140, BU = 110, PULL = 52;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -20], [44, 2.4, 1, 'hero', 2, -20],
    [PULL, 1.05, 0.8, 'mid', 0, -30], [90, 1.25, 0.9, 'target', 0, -90], [BU, 1.5, 1, 'target', 0, -110],
    [FIN - 8, 1.6, 1, 'target', 0, -60], [FIN - 2, 1.9, 1, 'target', 0, -16], [FIN, 1.3, 1, 'target'], [FIN + 8, 1.6, 1, 'target'], [FIN + 32, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function field(ctx, o) {   // magnetic field lines bending across the screen
    const st = o.st; if (st < PULL || st >= FIN) return;
    const k = ease((st - PULL) / 14);
    for (let j = 0; j < 7; j++) { ctx.globalAlpha = 0.35 * k; let px = 0, py = 30 + j * 26; for (let x = 8; x <= SW.W; x += 8) { const ny = py + Math.sin((x - o.fxp) * 0.02 + st * 0.08 + j) * 3 + (o.fxp - x) * 0.004 * (j - 3) * 4; art.line(ctx, j % 2 ? C.red : C.blue, R(px), R(py), x, R(ny), 1); px = x; py = ny; } }
    ctx.globalAlpha = 1;
  }
  function comet(T) {   // the metal rises off the floor and streams into one ball over the target; then it falls
    const N = 40, pcs = []; for (let i = 0; i < N; i++) pcs.push({ x: T.x + rand(-220, 220), y: T.y - rand(0, 6), d: rand(0, 1), s: 3 + (i % 3) });
    AP.fx({ x: T.x, y: T.y, life: FIN - PULL + 40, draw(ctx, q, sx, sy, t, cam) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 20; if (st >= FIN + 2) return;
      const bx = sx, by0 = sy - 150, fall = st >= FIN - 10 ? easeOut((st - (FIN - 10)) / 10) : 0, by = R(by0 + 130 * fall), grow = ease((st - PULL) / (BU - PULL));
      pcs.forEach((pc, i) => { const k = ease((st - PULL - pc.d * 30) / 26); if (k <= 0) return; const X = R(pc.x - cam.x + (bx - (pc.x - cam.x)) * k + Math.cos(i + st * 0.2) * 14 * k), Y = R(pc.y - cam.y + (by - (pc.y - cam.y)) * k + Math.sin(i + st * 0.2) * 10 * k); art.rect(ctx, C.ink, X - 1, Y - 1, pc.s + 2, pc.s + 2); art.rect(ctx, i % 3 ? C.s : C.rust, X, Y, pc.s, pc.s); });
      const r = R(8 + 22 * grow); if (grow <= 0) return;
      if (fall > 0) for (let i = 1; i < 6; i++) art.line(ctx, i % 2 ? C.spark : C.rust2, bx, by, bx + R(i * 3), R(by - 30 - i * 10), 2 + (i % 2));   // the comet's tail
      D2.disc(ctx, bx, by, r + 2, C.ink); D2.disc(ctx, bx, by, r, C.sd);
      for (let i = 0; i < 26; i++) { const a = i * 0.83 + st * 0.05, d = r * (0.15 + (i % 5) * 0.18), w = 4 + (i % 3) * 2, h = 3 + (i % 2) * 2, X = R(bx + Math.cos(a) * d) - (w >> 1), Y = R(by + Math.sin(a) * d) - (h >> 1); art.rect(ctx, C.ink, X - 1, Y - 1, w + 2, h + 2); art.rect(ctx, [C.s, C.rust, C.iron || C.sd, C.rust2, C.s2][i % 5], X, Y, w, h); art.rect(ctx, C.s2, X, Y, w, 1); if (i % 4 === 0) art.rect(ctx, C.hz, X + 1, Y + 1, 2, 1); }
      art.ring(ctx, C.s2, bx, by, r); art.ring(ctx, C.ink, bx, by, r + 1);
      if (fall > 0) D2.ring(ctx, bx, by, r + 3, C.spark, 1);
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.s2, C.s, C.sd, C.hz],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.s2, c2: C.s, tag: 'APEX XI', glyph(ctx, x, y, t) { D2.ring(ctx, x, y, 7, C.red, 1); D2.ring(ctx, x, y, 5, C.blue, 1); art.rect(ctx, C.hz, x - 2, y - 2, 4, 4); void t; } }),
    every(st, o) {
      const { T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (T && st === PULL) { comet(T); SW.audio.sfx('charge'); fx.shake(3, 30); }
      if (st > PULL && st < BU && st % 6 === 0) SW.audio.sfx('heavy');
      if (st === FIN - 10) SW.audio.sfx('charge');
    },
    build() {},
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(16, 26);
      sparks(cx, cy, 30, 4.6); bolts(cx, gy - 10, 24, 3.6);
      fx.ring(cx, cy, C.w, 6, 120, 22); fx.ring(cx, gy - 4, C.hz, 4, 100, 20);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < FIN - 10) return ['cast', (st >> 3) % 2];
      if (st < FIN - 2) return ['charge', 0];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#101828', 0.22] };
      if (st >= PULL && st < FIN) return { vig: 0.4, draw: field, lines: st >= FIN - 10 ? 26 : 0, lineCol: C.spark, grade: ['#101828', 0.2] };
      if (st >= FIN && st < FIN + 2) return { impact: 'ink' };
      if (st >= FIN + 2 && st < FIN + 4) return { impact: 'tint', tint: C.hz };
      if (st >= FIN + 4 && st < FIN + 12) return { lines: 40, lineCol: C.spark, split: 3, vig: 0.4 };
      return null;
    }
  };

  AP.reg('ferra', {
    weapon: { name: 'scrapcleaver', len: 15, w: 3, col: C.s, hi: C.s2, hilt: C.ink, armed: 1, draw: cleaver },
    melee, ult, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
