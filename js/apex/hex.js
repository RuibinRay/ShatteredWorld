'use strict';
// Shattered Worlds — APEX Hex, the Delayed Doom (#13 of the strongest 16). "What she does to you happens twice." On top
// of js/hex-echo.js (her echoes), which stays:
//   weapon   THE PIN: a voodoo pin as long as a rapier, a pearl head, a red thread knotted under it; she fights with
//            the armed poses
//   J        every cut comes twice: the mark of each hit, and its ghost a moment later; the last hit drives the pin in
//            and a ring of pins answers it; hits leave wisps of ghost-light
//   skills   Hex Bolt: a wail of wisps; Soul Swap: two ghost rings, at both ends; Voodoo Pins: a red thread drawn from
//            her hand; Doom Mark: a slow pulse of the brand; Hollow: wisps trailing her
//   W+I      REQUIEM, a film of its own (210 frames): her close-up and card; the dead rise singing (pale faces drifting
//            up across a green-black screen); a straw doll the size of the target hangs behind them and the pins go in
//            one by one; on the blow a negative frame and every wound opens (red crosses all over them), and then it
//            happens again: a second impact frame and a second ring
//   numbers  Versus: x1.1 damage, x1.08 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.hex) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { g: '#80ffdb', g2: '#e0fff6', gd: '#0a3a30', ink: '#06100c', pearl: '#f4f0f8', red: '#d0102a', red2: '#ff6a7a', straw: '#c8a060', straw2: '#8a6a30', w: '#ffffff', steel: '#c8d0d8' };

  // ---------- the weapon: the Pin ----------
  function pin(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [s0x, s0y] = P(0, 0), [s1x, s1y] = P(L, 0); T.pline(x, C.ink, s0x, s0y, s1x, s1y, 2); T.pline(x, C.steel, s0x, s0y, s1x, s1y, 1);
    const [tx, ty] = P(L, 0); T.rect(x, C.w, R(tx), R(ty), 1, 1);
    const [hx, hy] = P(-2 * sc, 0); T.disc(x, C.ink, hx, hy, R(2.4 * sc)); T.disc(x, C.pearl, hx, hy, R(1.7 * sc)); T.rect(x, C.w, R(hx) - 1, R(hy) - 1, 1, 1);   // the pearl head
    const [r0x, r0y] = P(1, 0), [r1x, r1y] = P(2 * sc, 3 * sc); T.pline(x, C.red, r0x, r0y, r1x, r1y, 1);   // the red thread
  }

  // ---------- J: twice ----------
  const wisps = (x, y, n) => AP.bits(x, y, n, { sp: 1.2, up: 0.8, life: 24, shape(ctx, X, Y, i, t) { art.rect(ctx, i % 2 ? C.g : C.g2, X, Y, 1, 2 + R(t * 3)); } });
  const melee = {
    col: C.g, hi: C.g2, dk: C.gd, life: 24,
    swing(ctx, q, x, y, t) {   // the mark, then its ghost 10 frames later
      const base = q.fin ? AP.SWINGS.thrust : q.n % 2 ? AP.SWINGS.crescent : AP.SWINGS.xcut;
      const t1 = t * 24 / 13; if (t1 < 1) base(ctx, q, x, y, t1);
      const t2 = (t * 24 - 10) / 13; if (t2 > 0 && t2 < 1) { ctx.save(); ctx.globalAlpha = 0.6; base(ctx, Object.assign({}, q, { col: C.gd, hi: C.g }), x + q.face * 3, y - 2, t2); ctx.restore(); }
      if (q.fin && t > 0.3) { ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4); const cx = x + q.face * 26, cy = y - 24, r = 8 + 20 * easeOut((t - 0.3) * 2); for (let i = 0; i < 8; i++) { const a = i * PI / 4; art.line(ctx, C.steel, R(cx + Math.cos(a) * (r + 8)), R(cy + Math.sin(a) * (r + 8)), R(cx + Math.cos(a) * r), R(cy + Math.sin(a) * r), 1); art.rect(ctx, C.pearl, R(cx + Math.cos(a) * (r + 9)) - 1, R(cy + Math.sin(a) * (r + 9)) - 1, 2, 2); } }
    },
    hit(x, y, n, p, fin) { wisps(x, y, fin ? 10 : 4); if (fin) { AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  const ghostRing = (x, y, life) => AP.fx({ x, y, life: life || 20, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.ring(ctx, sx, sy, 6 + 22 * easeOut(t), C.g, 1); D2.ring(ctx, sx, sy, 4 + 14 * easeOut(t), C.g2, 1); } });
  function init() {
    AP.onCast('hex_bolt', p => wisps(p.x + p.face * 14, p.y - 26, 6));
    AP.onCast('soul_swap', p => { ghostRing(p.x, p.y - 22); const o = AP.foeOf(p); if (o) ghostRing(o.x, o.y - 22); });
    AP.onCast('voodoo_pins', p => { const o = AP.foeOf(p); if (o) AP.fx({ x: p.x + p.face * 8, y: p.y - 26, tx: o.x, ty: o.y - 60, life: 16, draw(ctx, q, sx, sy, t, cam) { ctx.globalAlpha = 1 - t; const ex = sx + (q.tx - cam.x - sx) * easeOut(t * 1.5), ey = sy + (q.ty - cam.y - sy) * easeOut(t * 1.5); art.line(ctx, C.red, sx, sy, R(ex), R(ey), 1); } }); });
    AP.onCast('doom_mark', p => { const o = AP.foeOf(p); if (o) AP.fx({ x: o.x, y: o.y - 24, life: 30, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 0.8 * (1 - t); D2.ring(ctx, sx, sy, 10 + 6 * Math.sin(t * PI * 3), C.red2, 1); } }); });
    AP.onCast('hollow', p => wisps(p.x, p.y - 20, 12));
  }

  // ---------- W+I: Requiem ----------
  const LEN = 210, FIN = 154, BU = 116, RISE = 50, TWICE = 12;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -20], [44, 2.4, 1, 'hero', 2, -20],
    [RISE, 1.05, 0.8, 'mid', 0, -30], [92, 1.4, 0.9, 'target', 0, -20], [BU, 1.7, 1, 'target', 0, -20], [FIN - 2, 2.1, 1, 'target'],
    [FIN, 1.3, 1, 'target'], [FIN + TWICE - 1, 1.5, 1, 'target'], [FIN + TWICE, 1.25, 1, 'target'], [FIN + TWICE + 8, 1.6, 1, 'target'], [FIN + 44, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function choir(ctx, o) {   // the dead rise, singing: pale ghosts with wavy tails drifting up the screen
    const st = o.st; if (st < RISE || st >= FIN) return;
    const k = ease((st - RISE) / 14);
    for (let i = 0; i < 14; i++) {
      const x = 16 + ((i * 61) % 450) + Math.sin(st * 0.06 + i) * 10, y = SW.H + 30 - ((st - RISE) * (0.9 + (i % 4) * 0.25) * 1.6 + i * 41) % (SW.H + 70), s = 6 + (i % 3) * 2;
      ctx.globalAlpha = 0.45 * k;
      art.disc(ctx, C.g, R(x), R(y), s + 1);
      for (let j = 0; j < 12; j++) { const w = R(s * (1 - j / 14)), yy = R(y + s * 0.4 + j * 2), xx = R(x + Math.sin(j * 0.6 - st * 0.25 + i) * (2 + j * 0.4)); art.rect(ctx, j % 3 ? C.g : C.g2, xx - w, yy, w * 2, 2); }   // the tail
      ctx.globalAlpha = 0.7 * k; art.disc(ctx, C.g2, R(x), R(y), s - 1);
      ctx.globalAlpha = 0.9 * k; art.rect(ctx, C.ink, R(x - s * 0.45) - 1, R(y - 2), 2, 3); art.rect(ctx, C.ink, R(x + s * 0.45) - 1, R(y - 2), 2, 3);
      const m = 1 + ((st >> 3) + i) % 3; art.rect(ctx, C.ink, R(x) - 1, R(y + 2), 2, m + 1);   // a mouth, singing
    }
    ctx.globalAlpha = 1;
  }
  function doll(T) {   // a ragged straw effigy hanging behind and above them; the pins go in one by one
    const pins = [[-6, -30], [6, -34], [0, -20], [-8, -12], [8, -10], [0, -4]];
    const S = { a: '#6a5030', b: '#3a2810', c: '#9a7a48', o: '#120a04' };
    AP.fx({ x: T.x + 30, y: T.y + 18, life: FIN - 92 + 40, back: true, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 20, k = easeOut((st - 92) / 12), br = st >= FIN ? ease((st - FIN) / 16) : 0; if (k <= 0 || br >= 1) return;
      const s = 1.35, X = sx + R(Math.sin(st * 0.07) * 3), Y = sy, tilt = Math.sin(st * 0.05) * 0.06;
      ctx.save(); ctx.globalAlpha = 0.85 * k * (1 - br); ctx.translate(X, Y - 60 * s); ctx.rotate(tilt); ctx.translate(-X, -(Y - 60 * s));
      art.line(ctx, S.o, X, R(Y - 80 * s), X, R(Y - 52 * s), 1);   // the cord it hangs from
      const body = (x, y, w, h) => { art.rect(ctx, S.o, R(x - 1), R(y - 1), R(w + 2), R(h + 2)); art.rect(ctx, S.a, R(x), R(y), R(w), R(h)); for (let i = 0; i < w; i += 2) art.rect(ctx, (i / 2) % 2 ? S.b : S.c, R(x + i), R(y), 1, R(h)); };
      art.disc(ctx, S.o, X, R(Y - 44 * s), R(8 * s) + 1); art.disc(ctx, S.a, X, R(Y - 44 * s), R(8 * s)); for (let i = -6; i <= 6; i += 3) art.line(ctx, S.b, R(X + i * s), R(Y - 50 * s), R(X + i * s * 0.8), R(Y - 38 * s), 1);
      body(X - 6 * s, Y - 36 * s, 12 * s, 20 * s); body(X - 15 * s, Y - 33 * s, 30 * s, 4 * s); body(X - 6 * s, Y - 16 * s, 4 * s, 14 * s); body(X + 2 * s, Y - 16 * s, 4 * s, 14 * s);
      for (const [hx, hy] of [[-15, -31], [15, -31], [-4, -2], [4, -2]]) for (let j = 0; j < 3; j++) art.line(ctx, S.c, R(X + hx * s), R(Y + hy * s), R(X + hx * s + (j - 1) * 3), R(Y + hy * s + 4), 1);   // straw ends
      art.disc(ctx, '#d8d0c8', R(X - 3 * s), R(Y - 45 * s), 2); art.disc(ctx, '#d8d0c8', R(X + 3 * s), R(Y - 45 * s), 2); art.rect(ctx, S.o, R(X - 3 * s), R(Y - 45 * s), 1, 1); art.rect(ctx, S.o, R(X + 3 * s), R(Y - 45 * s), 1, 1);   // button eyes
      for (let i = -3; i <= 3; i++) art.rect(ctx, S.o, R(X + i * 2), R(Y - 39 * s), 1, 2);   // a stitched mouth
      for (let i = 0; i < 5; i++) art.line(ctx, C.red, R(X - 2 * s + i), R(Y - 30 * s + i * 4), R(X + 2 * s - i), R(Y - 28 * s + i * 4), 1);   // a red seam down its chest
      pins.forEach(([px, py], i) => { if (st < BU + i * 6) return; const x0 = R(X + px * s), y0 = R(Y + py * s), d = Math.max(0, 1 - (st - BU - i * 6) / 3) * 14; art.line(ctx, C.steel, x0 - R(d * 0.7) - 7, y0 - R(d * 0.7) - 9, x0, y0, 1); art.disc(ctx, C.pearl, x0 - R(d * 0.7) - 8, y0 - R(d * 0.7) - 10, 2); art.rect(ctx, C.red2, x0, y0, 1, 1); });
      ctx.restore();
    } });
  }
  function wounds(cx, cy) { for (let i = 0; i < 10; i++) { const x = cx + rand(-14, 14), y = cy + rand(-24, 20); AP.fx({ x, y, life: 26, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4); const r = 2 + R(4 * easeOut(t * 3)); art.line(ctx, C.red, sx - r, sy - r, sx + r, sy + r, 2); art.line(ctx, C.red, sx - r, sy + r, sx + r, sy - r, 2); art.rect(ctx, C.red2, sx, sy, 1, 1); } }); } }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.g2, C.g, C.gd, C.red],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.g2, c2: C.g, tag: 'APEX XIII', glyph(ctx, x, y) { art.disc(ctx, C.straw, x, y - 4, 4); art.rect(ctx, C.straw, x - 3, y, 6, 7); art.line(ctx, C.steel, x - 6, y - 9, x, y + 2, 1); art.rect(ctx, C.pearl, x - 7, y - 10, 2, 2); } }),
    every(st, o) {
      const { T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === RISE) SW.audio.sfx('charge');
      if (T && st === 92) doll(T);
      if (st >= BU && st < BU + 36 && (st - BU) % 6 === 0) { SW.audio.sfx('select'); fx.shake(1, 3); }
      if (T && st === FIN + TWICE) {   // and then it happens again
        SW.audio.sfx('explode'); SW.audio.sfx('heavy'); AP.stop(6); fx.shake(10, 16);
        fx.ring(T.x, T.y - 22, C.g2, 6, 120, 22); wounds(T.x, T.y - 22); wisps(T.x, T.y - 22, 20);
      }
    },
    build() {},
    finish(o) {
      const { cx, cy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(8); fx.shake(12, 20);
      wounds(cx, cy); wisps(cx, cy, 24);
      fx.ring(cx, cy, C.w, 6, 110, 22); fx.ring(cx, cy, C.g, 4, 80, 18);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < BU) return ['cast', (st >> 3) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#0a2a20', 0.22] };
      if (st >= RISE && st < FIN) return { vig: 0.45, grade: ['#0a2a20', 0.35 * ease((st - RISE) / 20)], draw: choir, lines: st >= BU ? 14 : 0, lineCol: C.g2 };
      if (st >= FIN && st < FIN + 2) return { impact: 'neg' };
      if (st >= FIN + 2 && st < FIN + 8) return { lines: 30, lineCol: C.g2, split: 2, vig: 0.4 };
      if (st >= FIN + TWICE && st < FIN + TWICE + 2) return { impact: 'tint', tint: '#80ffdb' };
      if (st >= FIN + TWICE + 2 && st < FIN + TWICE + 10) return { lines: 36, lineCol: C.g, split: 3, vig: 0.45 };
      return null;
    }
  };

  AP.reg('hex', {
    weapon: { name: 'voodoopin', len: 20, w: 1, col: C.steel, hi: C.w, hilt: C.pearl, armed: 1, draw: pin },
    melee, ult, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
