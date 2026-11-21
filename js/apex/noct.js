'use strict';
// Shattered Worlds — APEX Noct, the Blade That Isn't There (#5 of the strongest 16). On top of js/noct-void.js (his void
// looks), which stays:
//   weapon   THE NULL EDGE: a long blade that is only an outline of teal light round nothing, a black guard, a hilt
//            wrapped in white; the void blade he had, longer and emptier
//   J        his cuts land where they are aimed without crossing the space between: a thin line appears on the target
//            and then opens; the last hit is a tall black crescent; hits leave flecks of the dark
//   skills   Unseen Cut: the line on the target, opening; Afterimage: a ghost cut hanging where he stood; Null Crescent:
//            a hollow ring at his blade; Lights Out: the screen dims for a moment; Blink Strike: a black seam where he
//            was and where he lands
//   W+I      LAST LIGHT, a film of its own (198 frames): his close-up and card; the lights go out (only his blade and
//            the cuts can be seen); thin cuts flash all round the target in the dark; one line is drawn slowly right
//            across the screen; the light comes back on a negative frame and the whole picture slides apart along the
//            line, everything on the wrong side of it, before it closes again
//   numbers  Versus: x1.1 damage, x1.08 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.noct) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { t: '#5ad6c8', t2: '#d8fff8', td: '#0a3a38', ink: '#05080c', w: '#ffffff', wrap: '#e8f0f0' };

  // ---------- the weapon: the Null Edge ----------
  function nullEdge(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len, hw = 1.8 * sc;
    for (let i = 3; i <= L; i++) {   // only the outline: two teal edges, black between, a white point
      const u = i / L, w = hw * (1 - 0.6 * u * u);
      const [ax, ay] = P(i, -w), [bx, by] = P(i, w), [mx, my] = P(i, 0);
      T.rect(x, C.ink, R(mx), R(my), 1, 1);
      T.rect(x, u > 0.92 ? C.w : C.t, R(ax), R(ay), 1, 1); T.rect(x, u > 0.92 ? C.w : C.t2, R(bx), R(by), 1, 1);
    }
    const [g0x, g0y] = P(2, -2.6 * sc), [g1x, g1y] = P(2, 2.6 * sc); T.pline(x, C.ink, g0x, g0y, g1x, g1y, Math.max(2, R(1.4 * sc)));
    const [h0x, h0y] = P(-3 * sc, 0), [h1x, h1y] = P(1, 0); T.pline(x, C.wrap, h0x, h0y, h1x, h1y, Math.max(1, R(1.2 * sc)));
  }

  // ---------- J ----------
  function flecks(x, y, n) { for (let i = 0; i < n; i++) { const a = rand(0, PI * 2), s = rand(0.5, 2), life = R(rand(12, 20)); AP.fx({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life, draw(ctx, q, sx, sy, t) { const k = q.max - q.life; ctx.globalAlpha = 1 - t; art.rect(ctx, i % 3 ? C.ink : C.t, R(sx + q.vx * k), R(sy + q.vy * k), 2, 2); } }); } }
  function lineCut(ctx, cx, cy, a, L, t, w) {   // a line appears, then opens into a black slit with teal lips
    const ux = Math.cos(a) * L / 2, uy = Math.sin(a) * L / 2, open = t < 0.25 ? 0 : easeOut((t - 0.25) * 2.5), fade = 1 - ease((t - 0.6) / 0.4);
    ctx.globalAlpha = fade;
    if (open <= 0) { art.line(ctx, C.w, R(cx - ux), R(cy - uy), R(cx + ux), R(cy + uy), 1); return; }
    const th = Math.max(1, R((w || 4) * open)), nx = -Math.sin(a), ny = Math.cos(a);
    art.line(ctx, C.t, R(cx - ux + nx * th), R(cy - uy + ny * th), R(cx + ux + nx * th), R(cy + uy + ny * th), 1);
    art.line(ctx, C.t2, R(cx - ux - nx * th), R(cy - uy - ny * th), R(cx + ux - nx * th), R(cy + uy - ny * th), 1);
    art.line(ctx, C.ink, R(cx - ux), R(cy - uy), R(cx + ux), R(cy + uy), Math.max(1, th * 2 - 1));
  }
  const melee = {
    col: C.t, hi: C.t2, dk: C.ink,
    swing(ctx, q, x, y, t) {
      const f = q.face;
      if (q.fin) { ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5); D2.crescent(ctx, x + f * 10, y - 26, 30, -1.9, -1.9 + 3.6 * easeOut(t * 1.8), 10, f, [C.ink, C.td, C.t, C.t2]); return; }
      lineCut(ctx, x + f * 28, y - 22 + (q.n - 1) * 5, [0.6, -0.5, 0.15, 0.6][q.n % 4] * (f > 0 ? 1 : -1), 28 + q.n * 4, t);
    },
    hit(x, y, n, p, fin) { flecks(x, y, fin ? 12 : 4); if (fin) { AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  const foeOf = p => { const V = SW.versus; if (G.scene === 'vs' && V && V.f) { const o = V.f.find(f => f && f.p !== p); return o && o.p; } const z = G.zone; return z && z.ents ? z.ents.filter(e => e.team === 'enemy' && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0] : null; };
  const cutAt = (x, y, a, L, life) => AP.fx({ x, y, life: life || 16, draw(ctx, q, sx, sy, t) { lineCut(ctx, sx, sy, a, L, t, 5); } });
  const seam = (x, y) => AP.fx({ x, y, life: 16, draw(ctx, q, sx, sy, t) { const h = 50 * easeOut(t * 2); ctx.globalAlpha = 1 - t; art.rect(ctx, C.ink, sx - 2, R(sy - h), 4, R(h)); art.rect(ctx, C.t, sx - 3, R(sy - h), 1, R(h)); art.rect(ctx, C.t2, sx + 2, R(sy - h), 1, R(h)); } });
  function init() {
    AP.onCast('unseen_cut', p => { const o = foeOf(p); if (o) cutAt(o.x, o.y - 22, -0.6, 40, 18); });
    AP.onCast('afterimage', p => cutAt(p.x + p.face * 20, p.y - 24, 0.4, 34, 30));
    AP.onCast('null_crescent', p => AP.fx({ x: p.x + p.face * 14, y: p.y - 24, life: 14, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.ring(ctx, sx, sy, 6 + 22 * easeOut(t), C.t, 2); D2.ring(ctx, sx, sy, 4 + 16 * easeOut(t), C.ink, 2); } }));
    AP.onCast('lights_out', p => AP.fx({ x: p.x, y: p.y, life: 18, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 0.6 * Math.sin(t * PI); art.rect(ctx, C.ink, 0, 0, SW.W, SW.H); } }));
    AP.onCast('blink_strike', p => { seam(p.x, p.y); const o = foeOf(p); if (o) seam(o.x + (o.x > p.x ? 18 : -18), o.y); });
  }

  // ---------- W+I: Last Light ----------
  const LEN = 198, FIN = 150, BU = 118, DARK = 56;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -20], [44, 2.4, 1, 'hero', 2, -20],
    [52, 1.3, 1, 'mid', 0, -20], [DARK + 40, 1.5, 1, 'target'], [BU, 1.15, 1, 'mid', 0, -20],
    [FIN, 1.15, 1, 'mid', 0, -20], [FIN + 14, 1.25, 1, 'mid', 0, -20], [FIN + 34, 1.1, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function dark(ctx, o) {   // the lights are out: only his blade, the cuts and two eyes
    const st = o.st, k = ease((st - DARK) / 8) * (st >= FIN ? 0 : 1);
    if (k <= 0) return;   // (the dark itself is a back layer: lightsOut below, so the cuts glow over it)
    const p = o.p, sx = p.x - G.cam.x, sy = p.y - G.cam.y, zm = o.zm;
    if (!(zm.z > 1.01)) { art.rect(ctx, C.t2, R(sx + p.face * 2), R(sy - 37), 2, 1); art.line(ctx, C.t, R(sx + p.face * 6), R(sy - 26), R(sx + p.face * 26), R(sy - 40), 1); }
    if (st >= BU) {   // one line drawn slowly right across the screen
      const k2 = ease((st - BU) / (FIN - BU - 6)), y = o.fyp - 4, x0 = -10, x1 = SW.W + 10, xe = x0 + (x1 - x0) * k2;
      art.line(ctx, C.w, x0, R(y + 6), R(xe), R(y - 6 * (xe - x0) / (x1 - x0) + 6), 1);
      art.rect(ctx, C.w, R(xe) - 1, R(y - 6 * (xe - x0) / (x1 - x0) + 6) - 1, 3, 3);
    }
  }
  function lightsOut() {   // the dark, behind every effect: the stage and the fighters go, the cuts and his blade stay
    AP.fx({ x: 0, y: 0, life: FIN - DARK + 40, back: true, draw(ctx) { const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1, k = st >= FIN ? 0 : ease((st - DARK) / 8); if (k > 0) { ctx.globalAlpha = 0.88 * k; art.rect(ctx, C.ink, 0, 0, SW.W, SW.H); } } });
  }
  const SLICE_A = Math.atan2(-12, SW.W + 20);
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.t2, C.t, C.td, C.ink],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.t2, c2: C.t, tag: 'APEX V', glyph(ctx, x, y, t) { art.line(ctx, C.t, x - 10, y + 4, x + 10, y - 4, 1); if (t > 0.3) { art.line(ctx, C.ink, x - 9, y + 4, x + 9, y - 3, 3); art.line(ctx, C.t2, x - 9, y + 5, x + 9, y - 2, 1); } } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === DARK) { SW.audio.sfx('charge'); lightsOut(); }
      if (T && st >= DARK + 8 && st < BU - 4 && st % 4 === 0) { cutAt(T.x + rand(-30, 30), T.y - rand(6, 44), rand(-1.2, 1.2), rand(30, 56), 18); if (st % 10 === 0) SW.audio.sfx('dash'); }
      if (st === BU) SW.audio.sfx('charge');
      void p;
    },
    build() {},
    finish(o) {
      const { cx, cy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(12); fx.shake(10, 20);
      fx.ring(cx, cy, C.w, 6, 120, 22); fx.ring(cx, cy, C.t, 4, 90, 18); flecks(cx, cy, 24);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < BU) return ['idle', 0];
      if (st < FIN - 2) return ['charge', 0];
      if (st < FIN + 12) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.55, grade: ['#0a2a2a', 0.22] };
      if (st >= 46 && st < FIN) return { draw: dark, vig: 0.3 };
      if (st >= FIN && st < FIN + 2) return { impact: 'neg' };
      if (st >= FIN + 2 && st < FIN + 26) { const k = st - FIN - 2, off = k < 16 ? 44 * easeOut(k / 8) : 44 * (1 - ease((k - 16) / 8)); return { slice: { a: SLICE_A, off, col: C.t2, w: 2 }, lines: k < 8 ? 24 : 0, lineCol: C.t2 }; }
      return null;
    }
  };

  AP.reg('noct', {
    weapon: { name: 'nulledge', len: 22, w: 2, col: C.t, hi: C.t2, hilt: C.ink, armed: 1, draw: nullEdge },
    melee, ult, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
