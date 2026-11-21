'use strict';
// Shattered Worlds — APEX Sen, the Single Stroke (#9 of the strongest 16). On top of js/sen-ink.js (his skills' ink and
// petals) and js/sen-stroke.js (his ultimate, another session's file: it is not touched or replaced, only filmed over):
//   weapon   THE SAKURA EDGE: a katana with an ink-black blade and a pale-pink temper line along its edge, a round
//            iron guard and a red-wrapped grip
//   J        brush-ink crescents with a pink edge that shed petals; the last hit is the quick-draw: a hairline appears
//            across the target, then opens; every hit that lands scatters petals
//   skills   petals off the blade on every skill; Three Breaths three ink rings; After the Bell a hairline where he was
//   W+I      THE SINGLE STROKE (js/sen-stroke.js's 230 frames, filmed): ink-dark grade and a vignette on the close-ups;
//            a pale flash and speed lines with each of the eight passes; near-black silence while he sheathes; the
//            "click" as a negative frame; and when every cut arrives, an ink frame, a pink frame, and the picture
//            really splits along the stroke and slides apart before it closes
//   numbers  Versus: x1.1 damage, x1.08 health (his ultimate stays 47% like everyone's: js/ult-share.js)
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.sen) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { p: '#ffa0c0', p2: '#ffe4ee', ink: '#0c0a10', ink2: '#2a2030', iron: '#5a5a66', red: '#a01828', w: '#ffffff' };

  // ---------- the weapon: the Sakura Edge ----------
  function sakura(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    for (let i = 2; i <= L; i++) { const u = i / L, curve = 1.4 * sc * u * u, w = Math.max(1, R(1.3 * sc)); for (let v = -w; v <= w; v++) { const [bx, by] = P(i, v + curve); T.rect(x, v === w ? (u > 0.9 ? C.w : C.p2) : v === w - 1 ? C.p : C.ink, R(bx), R(by), 1, 1); } }
    const [gx, gy] = P(1.5, 0); T.disc(x, C.ink, gx, gy, R(2 * sc)); T.disc(x, C.iron, gx, gy, Math.max(1, R(1.4 * sc)));
    const [h0x, h0y] = P(-4 * sc, 0), [h1x, h1y] = P(0, 0); T.pline(x, C.red, h0x, h0y, h1x, h1y, Math.max(2, R(1.3 * sc)));
    for (let i = 1; i < 4 * sc; i += 2) { const [kx, ky] = P(-i, 0); T.rect(x, C.ink, R(kx), R(ky), 1, 1); }
  }

  // ---------- J ----------
  const petals = (x, y, n, sp) => AP.bits(x, y, n, { sp: sp || 1.8, grav: 0.03, life: 30, shape(ctx, X, Y, i, t) { const a = t * 10 + i; art.rect(ctx, i % 3 ? C.p : C.p2, R(X + Math.sin(a) * 2), Y, 2, 1); art.rect(ctx, C.p, R(X + Math.sin(a) * 2), Y + 1, 1, 1); } });
  function hairline(ctx, cx, cy, t, L) {
    const open = t < 0.3 ? 0 : easeOut((t - 0.3) * 2.2), fade = 1 - ease((t - 0.6) / 0.4);
    ctx.globalAlpha = fade;
    if (!open) { art.line(ctx, C.w, R(cx - L), R(cy + 2), R(cx + L), R(cy - 2), 1); return; }
    const th = Math.max(1, R(3 * open));
    art.line(ctx, C.ink, R(cx - L), R(cy + 2), R(cx + L), R(cy - 2), th * 2 + 1); art.line(ctx, C.p, R(cx - L), R(cy + 2 - th), R(cx + L), R(cy - 2 - th), 1); art.line(ctx, C.p2, R(cx - L), R(cy + 2 + th), R(cx + L), R(cy - 2 + th), 1);
  }
  const melee = {
    col: C.ink2, hi: C.p, dk: C.ink,
    swing(ctx, q, x, y, t) { if (q.fin) return hairline(ctx, x + q.face * 30, y - 24, t, 34); return AP.SWINGS.crescent(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { petals(x, y, fin ? 14 : 4, fin ? 2.6 : 1.8); if (fin) { AP.stop(5); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  function init() {
    ['draw', 'falling_leaf', 'petal_storm'].forEach(id => AP.onCast(id, p => petals(p.x + p.face * 14, p.y - 26, 6)));
    AP.onCast('three_breaths', p => { for (let i = 0; i < 3; i++) AP.fx({ x: p.x + p.face * (14 + i * 12), y: p.y - 26, life: 12 + i * 4, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.ring(ctx, sx, sy, 3 + 10 * easeOut(t), C.ink2, 2); D2.ring(ctx, sx, sy, 2 + 8 * easeOut(t), C.p, 1); } }); });
    AP.onCast('after_the_bell', p => AP.fx({ x: p.x, y: p.y - 24, life: 18, draw(ctx, q, sx, sy, t) { hairline(ctx, sx, sy, t, 26); } }));
  }

  // ---------- W+I: the film over js/sen-stroke.js ----------
  const SS = () => SW.senStroke;
  const PASS0 = 72, GAP = 11, SHEATHE = 160, CUT = 188;
  const film = {
    zoomAt(st) { const s = SS(); return s && s.zoomAt ? s.zoomAt(st) : { z: 1 }; },
    every(st, o) {
      const { p, T } = o;
      if (T && st >= PASS0 && st < PASS0 + 8 * GAP && (st - PASS0) % GAP === 0) petals(T.x, T.y - 26, 6, 2.2);
      if (st === CUT) { AP.stop(10); fx.shake(12, 20); if (T) petals(T.x, T.y - 26, 30, 4); }
      if (st > CUT + 4 && st < 226 && st % 3 === 0) petals(G.cam.x + rand(0, SW.W), G.cam.y + rand(0, 20), 1, 0.5);
      void p;
    },
    look(st) {
      if (st >= 30 && st < 70) return { vig: 0.55, grade: ['#2a0a1a', 0.22] };
      if (st >= PASS0 && st < PASS0 + 8 * GAP) { const k = (st - PASS0) % GAP; return k < 1 ? { impact: 'tint', tint: C.p2, lines: 28, lineCol: C.p2 } : { vig: 0.4, lines: k < 4 ? 18 : 0, lineCol: C.p }; }
      if (st >= SHEATHE && st < CUT - 2) return { vig: 0.75, grade: ['#000000', 0.45] };
      if (st >= CUT - 2 && st < CUT) return { impact: 'neg' };
      if (st >= CUT && st < CUT + 2) return { impact: 'ink' };
      if (st >= CUT + 2 && st < CUT + 4) return { impact: 'tint', tint: C.p };
      if (st >= CUT + 4 && st < CUT + 30) { const k = st - CUT - 4, off = k < 16 ? 36 * easeOut(k / 6) : 36 * (1 - ease((k - 16) / 10)); return { slice: { a: -0.08, off, col: C.p2, w: 2 }, lines: k < 8 ? 30 : 0, lineCol: C.p2 }; }
      return null;
    }
  };

  AP.reg('sen', {
    weapon: { name: 'sakuraedge', len: 20, w: 2, col: C.ink, hi: C.p, hilt: C.red, armed: 1, draw: sakura },
    melee, film, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
