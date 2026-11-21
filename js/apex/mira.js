'use strict';
// Shattered Worlds — APEX Mira, the Other Side of the Glass (#6 of the strongest 16). On top of js/mira-mirror.js (her
// glass), which stays:
//   weapon   THE LOOKING EDGE: a sabre of mirror glass, facets that catch the light in turn, a silver guard; her shard,
//            grown into a blade
//   J        glass arcs that glint as they pass; the last hit shatters the air into a burst of triangles; hits throw
//            splinters that flash
//   skills   Glass Fan: a glint at her hand; Reflection: a pane of glass where she stood, cracking; Prism: a ring of
//            colours at the split; Hall of Mirrors: four panes flash round the target; Kaleidoscope: a turning ring of
//            colour round her
//   W+I      SEVEN YEARS' LUCK, a film of its own (202 frames): her close-up and card; cracks run across the screen
//            from the target outward; seven reflections of her stand round the target and strike one after another;
//            the cracks glow; on the blow the picture breaks into shards that fly apart and fall back
//   numbers  Versus: x1.1 damage, x1.08 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.mira) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { s: '#c8d4f0', s2: '#ffffff', sd: '#3a4660', ink: '#0a0e18', b: '#8ac8ff', p: '#ff8ad8', y: '#fff08a', w: '#ffffff' };

  // ---------- the weapon: the Looking Edge ----------
  function lookingEdge(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    for (let i = 2; i <= L; i++) {
      const u = i / L, curve = 1.6 * sc * u * u, w = Math.max(1, R((2 - 1.2 * u) * sc));
      for (let v = -w; v <= w; v++) { const [bx, by] = P(i, v + curve); const facet = ((i >> 2) + (v > 0 ? 1 : 0)) % 3; T.rect(x, v === -w ? C.sd : v === w ? C.s2 : [C.s, '#e8eefc', C.b][facet], R(bx), R(by), 1, 1); }
    }
    const [g0x, g0y] = P(1, -2.8 * sc), [g1x, g1y] = P(1, 2.8 * sc); T.pline(x, C.sd, g0x, g0y, g1x, g1y, Math.max(2, R(1.4 * sc))); T.pline(x, C.s, g0x, g0y, g1x, g1y, 1);
    const [h0x, h0y] = P(-3 * sc, 0), [h1x, h1y] = P(0, 0); T.pline(x, C.sd, h0x, h0y, h1x, h1y, Math.max(1, R(1.2 * sc)));
  }

  // ---------- J ----------
  function splinters(x, y, n, sp) {
    for (let i = 0; i < n; i++) { const a = rand(0, PI * 2), s = rand(0.8, sp || 2.6), life = R(rand(12, 22)), rot = rand(0, PI); AP.fx({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.5, life, rot, draw(ctx, q, sx, sy, t) { const k = q.max - q.life, X = sx + q.vx * k, Y = sy + q.vy * k + 0.05 * k * k, r = q.rot + k * 0.3, l = 3; ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5); art.line(ctx, (k >> 1) % 3 === 0 ? C.w : i % 2 ? C.s : C.b, R(X - Math.cos(r) * l), R(Y - Math.sin(r) * l), R(X + Math.cos(r) * l), R(Y + Math.sin(r) * l), 1); } }); }
  }
  function tri(ctx, x, y, r, a, col) { const p = [0, 1, 2].map(i => [x + Math.cos(a + i * 2.09) * r, y + Math.sin(a + i * 2.09) * r]); for (let i = 0; i < 3; i++) art.line(ctx, col, R(p[i][0]), R(p[i][1]), R(p[(i + 1) % 3][0]), R(p[(i + 1) % 3][1]), 1); }
  function shatterBurst(ctx, q, x, y, t) {
    const f = q.face, cx = x + f * 24, cy = y - 24, k = easeOut(t * 1.8);
    ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5);
    for (let i = 0; i < 12; i++) { const a = i * PI / 6 + 0.2, d = 6 + 30 * k; tri(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 4 + (i % 3) * 2, a + t * 4, [C.w, C.s, C.b, C.p][i % 4]); }
    if (t < 0.3) D2.burst(ctx, cx, cy, 14, 12, [C.w, C.s, C.b]);
  }
  const melee = {
    col: C.s, hi: C.w, dk: C.sd,
    swing(ctx, q, x, y, t) { if (q.fin) return shatterBurst(ctx, q, x, y, t); AP.SWINGS.crescent(ctx, q, x, y, t); if (t > 0.2 && t < 0.35) D2.burst(ctx, x + q.face * 28, y - 30 + q.n * 6, 5, 8, [C.w, C.b]); },
    hit(x, y, n, p, fin) { splinters(x, y, fin ? 14 : 5, fin ? 3.2 : 2.2); if (fin) { AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  const foeOf = p => { const V = SW.versus; if (G.scene === 'vs' && V && V.f) { const o = V.f.find(f => f && f.p !== p); return o && o.p; } const z = G.zone; return z && z.ents ? z.ents.filter(e => e.team === 'enemy' && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0] : null; };
  function pane(x, y, w, h, life, crack, outline) {   // a pane of mirror glass, cracking (outline: only its edges and glints)
    AP.fx({ x, y, life: life || 24, draw(ctx, q, sx, sy, t) {
      if (outline) { ctx.globalAlpha = 1 - ease((t - 0.4) / 0.6); art.rect(ctx, C.s, R(sx - w / 2), R(sy - h), w, 1); art.rect(ctx, C.s, R(sx - w / 2), R(sy - 1), w, 1); art.rect(ctx, C.w, R(sx - w / 2), R(sy - h), 1, h); art.rect(ctx, C.sd, R(sx + w / 2), R(sy - h), 1, h); const g = R((t * 2 % 1) * h); art.line(ctx, C.w, R(sx - w / 2), R(sy - h + g), R(sx + w / 2), R(sy - h + g - 6), 1); return; }
      ctx.globalAlpha = 0.85 * (1 - ease((t - 0.6) / 0.4));
      art.rect(ctx, C.sd, R(sx - w / 2) - 1, R(sy - h) - 1, w + 2, h + 2); ctx.globalAlpha *= 0.55; art.rect(ctx, C.s, R(sx - w / 2), R(sy - h), w, h); ctx.globalAlpha /= 0.55;
      art.line(ctx, C.w, R(sx - w / 2 + 2), R(sy - h + 3), R(sx - w / 2 + 6), R(sy - h + 1), 1); art.line(ctx, C.w, R(sx - w / 2 + 2), R(sy - h + 8), R(sx - w / 2 + 10), R(sy - h + 2), 1);
      if (crack && t > 0.3) { const k = ease((t - 0.3) / 0.3); for (let i = 0; i < 5; i++) { const a = i * 1.26; art.line(ctx, C.w, R(sx), R(sy - h / 2), R(sx + Math.cos(a) * w * 0.6 * k), R(sy - h / 2 + Math.sin(a) * h * 0.5 * k), 1); } }
    } });
  }
  function rainbowRing(x, y, r, life) { AP.fx({ x, y, life, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; [C.p, C.y, C.b, C.s].forEach((c, i) => D2.ring(ctx, sx, sy, r * easeOut(t) + i * 2, c, 1)); } }); }
  function init() {
    AP.onCast('shard_fan', p => AP.fx({ x: p.x + p.face * 14, y: p.y - 28, life: 12, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.burst(ctx, sx, sy, 8, 8, [C.w, C.b]); } }));
    AP.onCast('reflection', p => pane(p.x, p.y, 20, 46, 34, true));
    AP.onCast('prism', p => rainbowRing(p.x + p.face * 18, p.y - 26, 16, 18));
    AP.onCast('hall_of_mirrors', p => { const o = foeOf(p); if (o) [-40, -16, 16, 40].forEach((d, i) => pane(o.x + d, o.y - (i % 2 ? 6 : 0), 14, 40, 24 + i * 2)); });
    AP.onCast('kaleidoscope', p => rainbowRing(p.x, p.y - 22, 30, 26));
  }

  // ---------- W+I: Seven Years' Luck ----------
  const LEN = 202, FIN = 152, BU = 122, REFL = 92;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 2, -20], [44, 2.4, 1, 'hero', 2, -20],
    [52, 1.15, 0.8, 'mid', 0, -20], [REFL - 4, 1.25, 0.9, 'mid', 0, -20], [REFL + 2, 1.7, 1, 'target'], [BU, 1.85, 1, 'target'],
    [FIN - 2, 2.2, 1, 'target'], [FIN, 1.3, 1, 'target'], [FIN + 28, 1.3, 0.8, 'target'], [FIN + 40, 1.15, 0.4, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  const CR = [];   // the cracks: branching lines from the centre (screen space, made once)
  (function () { let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 12; i++) { const pts = [[0, 0]]; let a = i * PI / 6 + r() * 0.4, x = 0, y = 0; for (let j = 0; j < 7; j++) { a += (r() - 0.5) * 0.7; x += Math.cos(a) * (16 + r() * 18); y += Math.sin(a) * (12 + r() * 14); pts.push([x, y]); } CR.push(pts); } })();
  function cracks(ctx, o) {
    const st = o.st; if (st < 52 || st >= FIN) return;
    const k = ease((st - 52) / 40), glow = st >= BU ? 0.5 + 0.5 * Math.sin(st * 0.8) : 0;
    for (const pts of CR) { const n = Math.max(1, R((pts.length - 1) * k)); for (let j = 0; j < n; j++) { const a = pts[j], b = pts[j + 1]; art.line(ctx, C.ink, R(o.fxp + a[0]), R(o.fyp + a[1]), R(o.fxp + b[0]), R(o.fyp + b[1]), 3); art.line(ctx, glow > 0.5 ? C.w : C.s, R(o.fxp + a[0]), R(o.fyp + a[1]), R(o.fxp + b[0]), R(o.fyp + b[1]), 1); } }
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.w, C.s, C.sd, C.b],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.w, c2: C.b, tag: 'APEX VI', glyph(ctx, x, y, t) { art.rect(ctx, C.sd, x - 7, y - 9, 14, 18); art.rect(ctx, C.s, x - 6, y - 8, 12, 16); if (t > 0.4) { art.line(ctx, C.w, x - 6, y - 8, x + 2, y + 1, 1); art.line(ctx, C.w, x + 2, y + 1, x + 6, y - 3, 1); art.line(ctx, C.w, x + 2, y + 1, x - 2, y + 8, 1); } } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === 52) SW.audio.sfx('charge');
      if (T && st >= REFL && st < BU && (st - REFL) % 4 === 0) {   // seven reflections round them, each striking
        const i = (st - REFL) / 4; if (i < 7) { const a = PI + i * PI / 6 - PI / 2, dx = Math.cos(a) * 46, s = dx >= 0 ? 1 : -1; pane(T.x + dx, T.y, 18, 46, 24, false, true); if (fx.ghost && p.sheet) fx.ghost(p.sheet(), i % 2 ? 'a2' : 'a3', 1, T.x + dx, T.y, s > 0, C.b); splinters(T.x, T.y - 24, 3, 2); SW.audio.sfx('dash'); }
      }
      if (st > FIN + 6 && st < LEN - 20 && st % 2 === 0) splinters(G.cam.x + rand(0, SW.W), G.cam.y + rand(0, 30), 1, 0.6);
    },
    build() {},
    finish(o) {
      const { cx, cy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(8); fx.shake(10, 20);
      fx.ring(cx, cy, C.w, 6, 120, 22); fx.ring(cx, cy, C.b, 4, 90, 18); splinters(cx, cy, 34, 4.4);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < REFL) return ['cast', (st >> 3) % 2];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.5, grade: ['#1a2a4a', 0.2] };
      if (st >= 52 && st < FIN) return { vig: 0.3 + (st >= BU ? 0.25 : 0), draw: cracks, lines: st >= BU ? 16 : 0, lineCol: C.s };
      if (st >= FIN && st < FIN + 2) return { impact: 'neg' };
      if (st >= FIN + 2 && st < FIN + 36) { const k = st - FIN - 2, out = k < 14 ? easeOut(k / 10) : 1 - ease((k - 14) / 20); return out > 0.03 ? { shatter: { k: out, n: 22, seed: 3, col: C.w, d: 1.2 }, lines: k < 6 ? 30 : 0, lineCol: C.w } : null; }
      return null;
    }
  };

  AP.reg('mira', {
    weapon: { name: 'lookingedge', len: 20, w: 2, col: C.s, hi: C.w, hilt: C.sd, armed: 1, draw: lookingEdge },
    melee, ult, init,
    tune: { dmg: 1.1, hp: 1.08 }
  });
})();
