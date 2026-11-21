'use strict';
// Shattered Worlds — APEX Corvin, the Crow Eye (#2 of the strongest 16: 93% in the open tournaments, 80% in the
// round-robin). On top of js/corvin-crows.js (his counter kit) and js/corvin-murder.js (his real crows), which stay:
//   weapon   RAVEN TALON: a hooked black dagger with a violet edge and a gold beak for a pommel (he fought bare-handed
//            in the sprites, though his J was always "his dagger"); he now swings it with the armed poses
//   J        violet crescents for the first two cuts, a cross cut for the third, and for the last a dive: a crow-wing
//            sweep with talon rakes; every hit that lands throws feathers; the last one stops the world for 3 frames
//   skills   Crow Volley: a shadow wake and a violet eye-glint as they leave; Crow's Due: a fan of black feathers opens
//            behind him like a shield; Black Flame: a sigil of black fire where it catches; Moon Gaze: a pale halo and a
//            ring as the eye opens; Murder of Crows: a wedge of speed lines and a burst of feathers from his sleeves
//   W+I      CROW ECLIPSE, a film of its own (206 frames): the red sky and the storm as before; a close-up on the violet
//            eye with his card; the camera between them while the eclipse rises behind the target; the moon goes black,
//            the crows ring them (js/corvin-murder.js), the screen turns to ink and blood on the blow and a great crow
//            made of the flock dives through them; feathers fall while the camera pulls away
//   numbers  Versus: x1.15 damage, x1.1 health (the user: "ignore balance" for the sixteen)
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.corvin) return;
  const { R, PI, ease, easeOut, clamp01 } = AP, D2 = AP.draw;
  const C = { v: '#7209b7', v2: '#9d4edd', hi: '#e0c3fc', ink: '#14101c', ink2: '#2a1a3e', gold: '#d8a020', gold2: '#ffe08a', red: '#c1121f', red2: '#5a0a1a', w: '#ffffff' };

  // ---------- the weapon: Raven Talon ----------
  function talon(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v];
    const L = len, hook = 3 * sc;
    for (let i = 0; i <= L; i++) {   // the blade: a back, a body, a violet edge, hooking forward at the tip
      const u = i / L, bend = hook * u * u, w = Math.max(1, R((2.2 - 1.4 * u) * sc));
      const [bx, by] = P(i, bend - w);
      T.rect(x, C.ink, R(bx), R(by), 1, w + 1);
      const [ex, ey] = P(i, bend + 0.5);
      T.rect(x, u > 0.85 ? C.w : C.hi, R(ex), R(ey), 1, 1);
      if (i % 3 === 0 && u < 0.8) { const [mx, my] = P(i, bend - w * 0.5); T.rect(x, C.v2, R(mx), R(my), 1, 1); }
    }
    const [g0x, g0y] = P(0, -2.5 * sc), [g1x, g1y] = P(0, 2.5 * sc); T.pline(x, C.gold, g0x, g0y, g1x, g1y, Math.max(1, R(sc)));   // the guard
    const [b0x, b0y] = P(-1, 0), [b1x, b1y] = P(-4 * sc, 1.5 * sc); T.pline(x, C.gold, b0x, b0y, b1x, b1y, Math.max(2, R(1.6 * sc)));   // the beak pommel
    T.rect(x, C.gold2, R(b0x), R(b0y), 1, 1);
  }

  // ---------- J: the cuts and the dive ----------
  function feathers(x, y, n, sp) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, PI * 2), s = rand(0.6, sp || 2.2), rot = rand(0, PI), life = R(rand(18, 30));
      AP.fx({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, rot, life, draw(ctx, q, sx, sy, t) {
        const k = q.max - q.life, X = sx + q.vx * k, Y = sy + q.vy * k + 0.04 * k * k, r = q.rot + k * 0.15;
        ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4);
        const ux = Math.cos(r) * 4, uy = Math.sin(r) * 2;
        art.line(ctx, C.ink, R(X - ux), R(Y - uy), R(X + ux), R(Y + uy), 2); art.rect(ctx, i % 3 ? C.v2 : C.hi, R(X + ux * 0.5), R(Y + uy * 0.5), 1, 1);
      } });
    }
  }
  function dive(ctx, q, x, y, t) {   // the last hit: a crow-wing sweep, then three talon rakes
    const f = q.face, k = easeOut(t * 1.7);
    ctx.globalAlpha = 1 - ease((t - 0.55) / 0.45);
    for (let s = -1; s <= 1; s += 2) D2.crescent(ctx, x + f * 4, y - 24, 30 + 6 * k, s * 2.1, s * 2.1 - s * 3.2 * k, 9, f, [C.ink, C.v, C.hi]);
    for (let i = 0; i < 3; i++) { const ox = x + f * (18 + i * 7), y0 = y - 44 + i * 3, y1 = y0 + 40 * easeOut(t * 2.2 - 0.2); if (y1 > y0) { art.line(ctx, C.ink, R(ox - f * 8), R(y0), R(ox + f * 6), R(y1), 3); art.line(ctx, i === 1 ? C.w : C.hi, R(ox - f * 8), R(y0), R(ox + f * 6), R(y1), 1); } }
    if (t < 0.25) D2.burst(ctx, x + f * 26, y - 22, 14, 10, [C.hi, C.w, C.v2]);
  }
  const melee = {
    col: C.v, hi: C.hi, dk: C.ink,
    swing(ctx, q, x, y, t) { if (q.fin) return dive(ctx, q, x, y, t); return (q.n === 2 ? AP.SWINGS.xcut : AP.SWINGS.crescent)(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { feathers(x, y, fin ? 12 : 4, fin ? 3 : 2); if (fin) { AP.stop(3); fx.shake(3, 6); } }
  };

  // ---------- skills: flourishes round the casts ----------
  function glint(x, y, life) { AP.fx({ x, y, life: life || 14, draw(ctx, q, sx, sy, t) { const s = R(6 * (1 - t) + 2); ctx.globalAlpha = 1 - t; art.line(ctx, C.hi, sx - s, sy, sx + s, sy, 1); art.line(ctx, C.hi, sx, sy - s, sx, sy + s, 1); art.rect(ctx, C.w, sx - 1, sy - 1, 2, 2); } }); }
  function wake(p, n, len) {   // speed lines streaming forward from his hand
    for (let i = 0; i < n; i++) { const oy = rand(-16, 10), l = rand(len * 0.5, len), d0 = rand(4, 20); AP.fx({ x: p.x, y: p.y - 22 + oy, f: p.face, life: R(rand(8, 14)), draw(ctx, q, sx, sy, t) { const k = easeOut(t * 1.4), x0 = sx + q.f * (d0 + l * k * 0.6), x1 = sx + q.f * (d0 + l * k); ctx.globalAlpha = 1 - t; art.line(ctx, i % 3 ? C.v : C.ink, R(x0), sy, R(x1), sy, i % 4 ? 1 : 2); } }); }
  }
  function featherFan(p) {   // Crow's Due: a fan of black feathers opens behind him, a shield of crows
    AP.fx({ x: p.x, y: p.y, f: p.face, life: 30, back: true, draw(ctx, q, sx, sy, t) {
      const k = easeOut(t * 3), fade = 1 - ease((t - 0.6) / 0.4);
      ctx.globalAlpha = fade;
      for (let i = 0; i < 9; i++) { const a = -PI / 2 + (i - 4) * 0.32 * k, L = 30 * k, bx = sx - q.f * 4, by = sy - 24; art.line(ctx, C.ink, bx, by, R(bx + Math.cos(a) * L * -q.f), R(by + Math.sin(a) * L), 4); art.line(ctx, i % 2 ? C.v : C.ink2, bx, by, R(bx + Math.cos(a) * (L - 2) * -q.f), R(by + Math.sin(a) * (L - 2)), 2); art.rect(ctx, C.hi, R(bx + Math.cos(a) * L * -q.f), R(by + Math.sin(a) * L), 1, 1); }
    } });
  }
  function sigil(x, y, life) {   // a ring of black fire with violet tongues
    AP.fx({ x, y, life: life || 26, back: true, draw(ctx, q, sx, sy, t) {
      const r = 6 + 20 * easeOut(t * 2); ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5);
      for (let i = 0; i < 14; i++) { const a = i * PI / 7 + t * 2, fx0 = sx + Math.cos(a) * r, fy0 = sy - 2 + Math.sin(a) * r * 0.3, h = 4 + ((i * 7) % 5) + 6 * Math.sin(t * PI); art.rect(ctx, C.ink, R(fx0) - 1, R(fy0 - h), 3, R(h)); art.rect(ctx, i % 2 ? C.v2 : C.hi, R(fx0), R(fy0 - h), 1, R(h * 0.6)); }
    } });
  }
  function halo(x, y) {
    AP.fx({ x, y, life: 26, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = (1 - t) * 0.9; D2.ring(ctx, sx, sy, 10 + 30 * easeOut(t), '#f4f0ff', 2); D2.ring(ctx, sx, sy, 6 + 22 * easeOut(t), C.v2, 1); } });
  }
  const foeOf = p => { const V = SW.versus; if (G.scene === 'vs' && V && V.f) { const o = V.f.find(f => f && f.p !== p); return o && o.p; } const z = G.zone; return z && z.ents ? z.ents.filter(e => e.team === 'enemy' && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0] : null; };
  function init() {
    AP.onCast('crow_volley', p => { wake(p, 8, 60); glint(p.x + p.face * 4, p.y - 37, 16); });
    AP.onCast('crows_due', p => { featherFan(p); feathers(p.x, p.y - 24, 8, 1.6); });
    AP.onCast('black_flame', p => { const o = foeOf(p); if (o) sigil(o.x, o.y, 30); });
    AP.onCast('moon_gaze', p => { const o = foeOf(p); if (o) halo(o.x, o.y - 70); });
    AP.onCast('murder_of_crows', p => { wake(p, 16, 110); feathers(p.x + p.face * 10, p.y - 24, 14, 3); fx.shake(2, 6); });
  }

  // ---------- W+I: Crow Eclipse ----------
  const LEN = 206, FIN = 150, BU = 120;
  const zoom = AP.shots([
    // st, z, bars, on, dx, dy
    [0, 1, 0, 'hero'], [10, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.5, 1, 'hero', 2, -16],   // the violet eye
    [40, 2.5, 1, 'hero', 2, -16], [48, 1.25, 0.7, 'mid'], [74, 1.35, 0.8, 'mid'],     // the storm, between them
    [96, 1.7, 1, 'target', 0, -26], [BU, 1.9, 1, 'target'], [FIN - 2, 2.3, 1, 'target'],  // the eclipse, the ring of crows
    [FIN, 1.15, 1, 'target'], [FIN + 6, 1.6, 1, 'target'], [FIN + 30, 1.25, 0.6, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  function eclipseSky(ctx, o) {   // the moon going black over the target (screen space), with a violet corona
    const st = o.st; if (st < 74 || st > FIN + 4) return;
    const k = ease((st - 74) / 30), black = ease((st - 104) / 18), x = o.fxp + 54, y = Math.max(26, o.fyp - 70), r = R(12 + 16 * k);
    ctx.globalAlpha = k;
    D2.disc(ctx, x, y, r + 5, C.red2); D2.disc(ctx, x, y, r + 2, '#ff6a6a'); D2.disc(ctx, x, y, r, '#ffe8e8');
    if (black > 0) { D2.disc(ctx, x - R(r * (1 - black)), y, r, C.ink); for (let i = 0; i < 16; i++) { const a = i * PI / 8 + st * 0.02, l = r + 3 + ((i * 5) % 6) * black; art.line(ctx, i % 2 ? C.v2 : C.hi, R(x + Math.cos(a) * (r + 1)), R(y + Math.sin(a) * (r + 1)), R(x + Math.cos(a) * l), R(y + Math.sin(a) * l), 1); } }
    ctx.globalAlpha = 1;
  }
  function greatCrow(T, p) {   // the flock as one crow, diving through them on the blow
    const dir = T.x >= p.x ? 1 : -1, x0 = T.x - dir * 170, y0 = T.y - 120;
    AP.fx({ x: x0, y: y0, life: 22, draw(ctx, q, sx, sy, t, cam) {
      const k = easeOut(t * 1.6), X = R(sx + dir * 340 * k), Y = R(sy + 120 * k - 30 * Math.sin(k * PI)), span = 54, flap = Math.sin(t * PI * 3) * 0.5;
      ctx.globalAlpha = 1 - ease((t - 0.7) / 0.3);
      for (let i = 0; i < 12; i++) { const ix = X - dir * i * 10, iy = Y - i * 3; art.rect(ctx, i % 3 ? C.v : C.ink2, R(ix) - 2, R(iy) - 1, 4, 2); }   // its wake
      for (const s of [-1, 1]) for (let i = 0; i < 9; i++) { const u = i / 8, wx = X - dir * u * 18, wy = Y + s * (8 + u * span * (0.7 + flap * s * 0.3)); art.line(ctx, C.ink, X, Y, R(wx), R(wy), 4); art.line(ctx, i % 2 ? C.v : C.ink2, X, Y, R(wx), R(wy), 2); }
      art.disc(ctx, C.ink, X, Y, 9); art.disc(ctx, C.ink, X + dir * 9, Y - 3, 6);
      art.rect(ctx, C.gold, X + dir * 14 - (dir < 0 ? 6 : 0), Y - 4, 7, 3); art.rect(ctx, C.gold2, X + dir * 14 - (dir < 0 ? 6 : 0), Y - 4, 7, 1);   // the beak
      art.rect(ctx, C.hi, X + dir * 10, Y - 6, 2, 2);   // the eye
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 44, c: [C.hi, C.v, C.ink, C.red],
    zoom,
    card: AP.card({ from: 18, to: 46, c1: C.hi, c2: C.v, tag: 'APEX II', glyph(ctx, x, y) { art.disc(ctx, C.ink, x, y, 7); art.disc(ctx, C.v, x, y, 4); art.disc(ctx, C.hi, x, y, 2); art.rect(ctx, C.w, x - 1, y - 2, 1, 1); } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 16) { SW.audio.sfx('select'); glint(p.x + p.face * 3, p.y - 38, 24); }
      if (st > 72 && st < FIN && st % 4 === 0 && T) feathers(T.x + rand(-60, 60), T.y - rand(60, 110), 1, 0.6);
      if (st === 96) SW.audio.sfx('charge');
      if (st > FIN && st < LEN - 20 && st % 3 === 0) feathers(G.cam.x + rand(0, SW.W), G.cam.y + rand(0, 40), 1, 0.4);
    },
    build(k, dur, o) {   // the ring of crows is js/corvin-murder.js's; here the eclipse pulls the shadows in
      const { p, cx, gy } = o;
      if (k % 5 === 0) for (let i = 0; i < 3; i++) { const a = rand(0, PI * 2); AP.fx({ x: cx + Math.cos(a) * 120, y: gy - 20 + Math.sin(a) * 50, tx: cx, ty: gy - 20, life: 14, draw(ctx, q, sx, sy, t, cam) { const X = sx + (q.tx - q.x) * easeOut(t), Y = sy + (q.ty - q.y) * easeOut(t); ctx.globalAlpha = 1 - t; art.line(ctx, C.ink, R(sx + (q.tx - q.x) * easeOut(t) * 0.7), R(sy + (q.ty - q.y) * easeOut(t) * 0.7), R(X), R(Y), 2); } }); }
      if (k === dur - 8) { fx.ring(cx, gy - 20, C.v, 70, 4, 10); SW.audio.sfx('select'); }
      void p;
    },
    finish(o) {
      const { p, T, cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(12, 24);
      if (T) greatCrow(T, p);
      fx.ring(cx, cy, C.w, 6, 110, 24); fx.ring(cx, cy, C.v, 4, 80, 20); fx.ring(cx, cy, C.red, 2, 140, 28);
      feathers(cx, cy, 40, 4.5);
      for (let i = 0; i < 6; i++) AP.fx({ x: cx, y: cy, a: i * PI / 3 + 0.3, life: 18, draw(ctx, q, sx, sy, t) { const l = 20 + 90 * easeOut(t); ctx.globalAlpha = 1 - t; D2.streak(ctx, sx, sy, sx + Math.cos(q.a) * l, sy + Math.sin(q.a) * l * 0.7, 4, [C.ink, C.v, C.hi]); } });
      void gy;
    },
    pose(st) {
      if (st < 72) return null;
      if (st < 96) return ['cast', (st >> 3) % 2];
      if (st < FIN - 6) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 44) return { vig: 0.55, grade: ['#3a0a5a', 0.25] };
      if (st >= 74 && st < FIN) return { grade: ['#5a0a1a', 0.18 + 0.2 * ease((st - 74) / 60)], vig: 0.35 + 0.3 * ease((st - BU) / 30), lines: st >= BU ? 18 : 0, lineCol: C.hi, draw: eclipseSky };
      if (st >= FIN && st < FIN + 2) return { impact: 'ink' };
      if (st >= FIN + 2 && st < FIN + 4) return { impact: 'red' };
      if (st >= FIN + 4 && st < FIN + 9) return { lines: 40, lineCol: C.hi, split: 3, vig: 0.4 };
      if (st >= FIN + 9 && st < FIN + 40) return { grade: ['#3a0a5a', 0.2 * (1 - ease((st - FIN - 9) / 31))], vig: 0.3 };
      return null;
    }
  };

  AP.reg('corvin', {
    weapon: { name: 'raventalon', len: 13, w: 2, col: C.ink, hi: C.hi, hilt: C.gold, armed: 1, draw: talon },
    melee, ult, init,
    tune: { dmg: 1.15, hp: 1.1 }
  });
})();
