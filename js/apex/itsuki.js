'use strict';
// Shattered Worlds — APEX Itsuki, Champion of the Hollow Crown (#1 of the strongest 16: 100% in every open tournament,
// 98% in the round-robin). Draw-only: his kit, his routes, his Thunder Palm chain and his numbers stay exactly as they
// are (the user never wants him trimmed, and at the top there is nothing to add). No blade: his palms are the weapon.
//   J        each palm strike in the next of the five elements (fire, wind, thunder, earth, water) with a mark of its
//            own: a flame tongue, a green spiral, a forked spark, stone chips, a ring of spray; the last hit lands all
//            five at once as a five-pointed burst; every hit that lands throws sparks of its element
//   skills   Hellfire embers, Storm Seize a cyclone ring, Heaven's Thunder a spark at his hand, Mountain Fang dust,
//            Great Flood spray, Rising Five a ring of the five colours
//   W+I      FIVE CALAMITIES, a film of its own (198 frames): his close-up under the hollow crown and his card; five
//            cuts on the target, one per calamity, each opening on a frame of its own colour: fire falls, a storm wind
//            cuts, thunder strikes, the earth breaks into fangs, a flood crashes; then the five gather round him as orbs,
//            fly out and surround the target, circling faster and tighter over a five-pointed seal burned into the floor,
//            spiral in and collide on it; on the blow a negative frame and their explosion: a white core, five rings,
//            shards of every element and a crimson shockwave (2026-11-22: it used to end with a palm of lightning)
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.itsuki) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const EL = [   // fire, wind, thunder, earth, water: [main, light, dark]
    ['#ff6b35', '#ffd24a', '#6a1a00'], ['#7dffb2', '#eafff4', '#0a4a2a'], ['#ffe066', '#ffffff', '#5a4a00'], ['#c8a05a', '#f0d9a8', '#4a3010'], ['#4cc9f0', '#ffffff', '#0a3050']
  ];
  const C = { r: '#ff2a4a', r2: '#ffd6de', ink: '#0c0608', w: '#ffffff' };

  // ---------- J: the five, in turn ----------
  let wheel = 0;
  function elMark(ctx, e, cx, cy, t, s) {   // the mark of one element at (cx, cy)
    const [c1, c2, c3] = EL[e], k = easeOut(t * 1.8); s = s || 1;
    if (e === 0) { for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * 0.35, l = (8 + (i % 3) * 5) * k * s; art.line(ctx, c3, cx, cy, R(cx + Math.cos(a) * l), R(cy + Math.sin(a) * l), 3); art.line(ctx, i % 2 ? c1 : c2, cx, cy, R(cx + Math.cos(a) * l), R(cy + Math.sin(a) * l), 1); } }
    else if (e === 1) { for (let i = 0; i < 16; i++) { const u = i / 16, a = u * PI * 3 + t * 6, r = u * 16 * k * s; art.rect(ctx, i % 3 ? c1 : c2, R(cx + Math.cos(a) * r), R(cy + Math.sin(a) * r * 0.7), 2, 1); } }
    else if (e === 2) { let px = cx, py = cy - 14 * s; for (let i = 0; i < 5; i++) { const nx = cx + (i % 2 ? 5 : -5) * s, ny = py + 6 * s * k; art.line(ctx, c3, R(px), R(py), R(nx), R(ny), 3); art.line(ctx, c2, R(px), R(py), R(nx), R(ny), 1); px = nx; py = ny; } }
    else if (e === 3) { for (let i = 0; i < 6; i++) { const a = i * PI / 3 + 0.3, d = 12 * k * s; art.rect(ctx, c3, R(cx + Math.cos(a) * d) - 2, R(cy + Math.sin(a) * d) - 2, 4, 4); art.rect(ctx, i % 2 ? c1 : c2, R(cx + Math.cos(a) * d) - 1, R(cy + Math.sin(a) * d) - 1, 2, 2); } }
    else { D2.ring(ctx, cx, cy, 4 + 14 * k * s, c1, 2); D2.ring(ctx, cx, cy, 2 + 9 * k * s, c2, 1); for (let i = 0; i < 8; i++) { const a = i * PI / 4, d = 18 * k * s; art.rect(ctx, c2, R(cx + Math.cos(a) * d), R(cy + Math.sin(a) * d * 0.6), 1, 2); } }
  }
  function star(ctx, cx, cy, r, t, w) {   // a five-pointed burst in the five colours
    for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * 4 * PI / 5, b = -PI / 2 + (i + 1) * 4 * PI / 5; art.line(ctx, EL[i][2], R(cx + Math.cos(a) * r), R(cy + Math.sin(a) * r), R(cx + Math.cos(b) * r), R(cy + Math.sin(b) * r), (w || 2) + 2); art.line(ctx, EL[i][0], R(cx + Math.cos(a) * r), R(cy + Math.sin(a) * r), R(cx + Math.cos(b) * r), R(cy + Math.sin(b) * r), w || 2); }
    void t;
  }
  const melee = {
    col: C.r, hi: C.r2, dk: C.ink, life: 14,
    swing(ctx, q, x, y, t) {
      const f = q.face, cx = x + f * (20 + q.n * 2), cy = y - 24 + (q.n % 2 ? -3 : 2);
      if (q.e === undefined) q.e = q.fin ? -1 : (wheel = (wheel + 1) % 5);
      ctx.globalAlpha = 1 - ease((t - 0.55) / 0.45);
      AP.SWINGS.palm(ctx, Object.assign({}, q, { col: q.e < 0 ? C.r : EL[q.e][0], hi: q.e < 0 ? C.r2 : EL[q.e][1] }), x, y, t);
      if (q.e >= 0) elMark(ctx, q.e, cx, cy, t, 1.1);
      else { star(ctx, cx, cy, 8 + 20 * easeOut(t * 1.6), t, 2); for (let e = 0; e < 5; e++) { const a = -PI / 2 + e * 2 * PI / 5, d = 26 * easeOut(t * 1.6); elMark(ctx, e, cx + Math.cos(a) * d, cy + Math.sin(a) * d, t, 0.7); } }
    },
    hit(x, y, n, p, fin) { AP.bits(x, y, fin ? 15 : 5, { cols: fin ? EL.map(e => e[0]) : [EL[wheel][0], EL[wheel][1]], sp: fin ? 3.2 : 2.2, life: 16 }); if (fin) { AP.stop(4); fx.shake(4, 8); } }
  };

  // ---------- skills ----------
  function init() {
    AP.onCast('element_bolt', p => AP.bits(p.x + p.face * 14, p.y - 26, 8, { cols: [EL[0][0], EL[0][1]], sp: 1.8, up: 1, life: 18 }));
    AP.onCast('element_step', p => AP.fx({ x: p.x, y: p.y - 22, life: 16, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; elMark(ctx, 1, sx, sy, t, 2); } }));
    AP.onCast('element_pillar', p => AP.fx({ x: p.x + p.face * 12, y: p.y - 30, life: 12, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; elMark(ctx, 2, sx, sy, t, 1); } }));
    AP.onCast('five_seals', p => AP.bits(p.x + p.face * 20, p.y - 4, 10, { cols: [EL[3][0], EL[3][1]], sp: 1.6, up: 1.2, grav: 0.1, life: 20 }));
    AP.onCast('wheel_turns', p => AP.bits(p.x, p.y - 10, 16, { cols: [EL[4][0], EL[4][1]], sp: 2.6, up: 1, grav: 0.1, life: 20 }));
    AP.onCast('its_rising_five', p => AP.fx({ x: p.x, y: p.y - 22, life: 20, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; EL.forEach((e, i) => D2.ring(ctx, sx, sy, 6 + 6 * i * easeOut(t * 1.5), e[0], 1)); } }));
  }

  // ---------- W+I: Five Calamities ----------
  const LEN = 198, FIN = 152, BU = 116, CUTS = 54, CUT = 12;
  const keys = [[0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.7, 1, 'hero', 2, -22], [44, 2.5, 1, 'hero', 2, -22], [50, 1.2, 1, 'mid', 0, -20, 'cut']];
  for (let i = 0; i < 5; i++) keys.push([CUTS + i * CUT, 1.9 + (i % 2) * 0.3, 1, 'target', (i % 2 ? -1 : 1) * 6, -24 + (i === 0 ? -20 : 0), 'cut']);
  keys.push([CUTS + 5 * CUT, 1.8, 1, 'hero', 0, -26], [BU + 10, 1.25, 1, 'mid', 0, -20], [FIN - 2, 1.9, 1, 'target', 0, -10], [FIN, 1.3, 1, 'target'], [FIN + 8, 1.65, 1, 'target'], [FIN + 32, 1.15, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']);
  const zoom = AP.shots(keys);
  function calamity(e, T) {   // the strike of one element on the target
    const [c1, c2, c3] = EL[e], x = T.x, y = T.y;
    if (e === 0) for (let i = 0; i < 6; i++) AP.fx({ x: x + rand(-50, 50), y: y - 160, tx: x + rand(-14, 14), ty: y - rand(0, 30), life: 12 + i, draw(ctx, q, sx, sy, t, cam) { const k = easeOut(t * 1.6), X = sx + (q.tx - cam.x - sx) * k, Y = sy + (q.ty - cam.y - sy) * k; ctx.globalAlpha = 1 - ease((t - 0.7) / 0.3); D2.streak(ctx, X - (q.tx - q.x) * 0.25, Y - 40, X, Y, 5, [c3, c1, c2]); D2.disc(ctx, X, Y, 4, c2); } });
    if (e === 1) AP.fx({ x, y: y - 24, life: CUT + 4, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4); for (let i = 0; i < 4; i++) D2.crescent(ctx, sx, sy, 16 + i * 8, -2.4 + i + t * 8, -0.6 + i + t * 8, 4, 1, [c3, c1, c2]); } });
    if (e === 2) { for (let i = 0; i < 3; i++) fx.bolt(x + rand(-10, 10), G.cam.y - 10, x + rand(-6, 6), y - 10, i ? c1 : C.w); }
    if (e === 3) for (let i = -3; i <= 3; i++) AP.fx({ x: x + i * 12, y, life: CUT + 6, draw(ctx, q, sx, sy, t) { const h = R((26 - Math.abs(i) * 5) * Math.sin(Math.min(1, t * 2.5) * PI * 0.5) * (1 - ease((t - 0.7) / 0.3))); if (h < 1) return; art.rect(ctx, c3, sx - 4, sy - h, 8, h); art.rect(ctx, c1, sx - 3, sy - h, 6, h); art.rect(ctx, c2, sx - 1, sy - h, 2, R(h * 0.5)); } });
    if (e === 4) AP.fx({ x, y, life: CUT + 6, draw(ctx, q, sx, sy, t) { const k = easeOut(t * 1.6); ctx.globalAlpha = 1 - ease((t - 0.6) / 0.4); for (let i = -12; i <= 12; i++) { const h = R((34 - Math.abs(i) * 2.4) * Math.sin(PI * Math.min(1, k * 1.2))); if (h > 0) { art.rect(ctx, Math.abs(i) < 3 ? c2 : i % 2 ? c1 : c3, R(sx + i * 3 - 60 + 60 * k), sy - h, 3, h); } } } });
    AP.bits(x, y - 24, 10, { cols: [c1, c2], sp: 2.8, life: 16 });
    SW.audio.sfx(e === 2 ? 'zap' : 'heavy'); fx.shake(5, 8);
  }
  // the ending (the user, 2026-11-22: "dont make it end with hand make it end with the orbs surround enemy collide and
  // explode"): the five gather round him, fly out and surround the target, circle it faster and tighter, spiral in and
  // collide on it at the blow, and the blow is their explosion (boom), not a palm
  const SPIRAL = 14;   // the last frames before the blow: the orbs spiral in to collide
  function tgtC(T, cam) { const b = T.box ? T.box() : { x: T.x - 7, y: T.y - 30, w: 14, h: 30 }; return [b.x + b.w / 2 - cam.x, b.y + b.h / 2 - cam.y]; }
  function orbAt(e, st, sx, sy, T, cam) {   // where orb e is at frame st (screen space), and how big
    const [tx, ty] = tgtC(T, cam), spin = st < BU + 14 ? st * 0.12 : (BU + 14) * 0.12 + (st - BU - 14) * (0.14 + (st - BU - 14) * 0.006);
    const a = -PI / 2 + e * 2 * PI / 5 + spin;
    const ox = sx + Math.cos(a) * 26, oy = sy + Math.sin(a) * 18;                          // round him
    const cin = st >= FIN - SPIRAL ? ease((st - FIN + SPIRAL) / SPIRAL) : 0;              // spiralling in
    const r = (42 - 8 * Math.min(1, Math.max(0, (st - BU - 14) / (FIN - SPIRAL - BU - 14)))) * (1 - cin);
    const rx = tx + Math.cos(a) * r, ry = ty + Math.sin(a) * r * 0.55;                    // round the target, a tilted ring
    const fly = st >= BU ? easeOut((st - BU) / 14) : 0;
    return { X: ox + (rx - ox) * fly, Y: oy + (ry - oy) * fly, a, fly, cin, size: 5 + cin * 2, front: Math.sin(a) >= 0 };
  }
  function orbs(p, T) {
    for (let e = 0; e < 5; e++) AP.fx({ x: p.x, y: p.y - 30, life: FIN - (CUTS + 5 * CUT) + 34, draw(ctx, q, sx, sy, t, cam) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1;
      if (st >= FIN) return;
      const o = orbAt(e, st, sx, sy, T, cam), [c1, c2, c3] = EL[e];
      if (o.fly >= 1) for (let k = 3; k >= 1; k--) {   // a comet tail along the circle
        const b = orbAt(e, st - k * (1 + o.cin * 0.5), sx, sy, T, cam);
        ctx.globalAlpha = 0.18 + 0.12 * (3 - k); D2.disc(ctx, b.X, b.Y, Math.max(1, o.size - k), k === 1 ? c1 : c3);
      }
      ctx.globalAlpha = o.fly >= 1 && !o.front && o.cin < 0.5 ? 0.7 : 1;   // the far side of the ring a little dimmer
      if (o.fly > 0 && o.fly < 1) { const b = orbAt(e, st - 3, sx, sy, T, cam); D2.streak(ctx, b.X, b.Y, o.X, o.Y, 3, [c3, c1]); }
      D2.disc(ctx, o.X, o.Y, o.size + 1, c3); D2.disc(ctx, o.X, o.Y, o.size, c1); D2.disc(ctx, o.X, o.Y, Math.max(1, o.size - 3), c2);
      if (o.cin > 0) { ctx.globalAlpha = o.cin; art.line(ctx, c1, R(o.X), R(o.Y), R(tgtC(T, cam)[0]), R(tgtC(T, cam)[1]), 1); }   // drawn together
      ctx.globalAlpha = 1;
    } });
    // where they meet: a light gathers on the target as they close in, and flickers just before they collide
    AP.fx({ x: p.x, y: p.y, life: FIN - (CUTS + 5 * CUT) + 34, draw(ctx, q, sx, sy, t, cam) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1; if (st >= FIN || st < FIN - SPIRAL) return;
      const k = ease((st - FIN + SPIRAL) / SPIRAL), [tx, ty] = tgtC(T, cam);
      art.glow(ctx, R(tx), R(ty), 10 + 26 * k, C.r, 0.15 + 0.35 * k);
      if (st % 2 === 0) D2.disc(ctx, tx, ty, 2 + 5 * k, C.w);
      if (st >= FIN - 4) D2.burst(ctx, tx, ty, 10 + 14 * k, 10, EL.map(c => c[1]), st * 0.4);
    } });
  }
  function seal(T) {   // a five-pointed seal burned into the floor under them
    AP.fx({ x: T.x, y: T.y, life: FIN - BU + 40, back: true, draw(ctx, q, sx, sy) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 20, k = easeOut((st - BU - 10) / 12), out = st >= FIN ? ease((st - FIN) / 18) : 0; if (k <= 0 || out >= 1) return;
      ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(sx, sy); ctx.scale(1, 0.3); ctx.translate(-sx, -sy);
      const r = 40 * k * (1 + out); D2.ring(ctx, sx, sy, r + 4, C.r, 2); D2.ring(ctx, sx, sy, r + 1, C.r2, 1); star(ctx, sx, sy, r, 0, 3);
      ctx.restore();
    } });
  }
  function boom(cx, cy, gy) {   // the five orbs collide on the target and explode
    const SH = [];   // the shards: each orb breaks into pieces of its colour, thrown out on its own angle
    for (let e = 0; e < 5; e++) for (let k = 0; k < 4; k++) SH.push({ e, a: -PI / 2 + e * 2 * PI / 5 + (k - 1.5) * 0.28 + rand(-0.08, 0.08), v: 70 + k * 18 + rand(0, 14) });
    AP.fx({ x: cx, y: cy, life: 40, draw(ctx, q, sx, sy, t) {
      const k = easeOut(t * 2.2), fade = 1 - ease((t - 0.5) / 0.5);
      // the core: white, then crimson, then a dark heart as it burns out
      if (t < 0.55) { const r = 6 + 40 * easeOut(t * 3.5); ctx.globalAlpha = fade; art.glow(ctx, R(sx), R(sy), r * 1.6, C.r, 0.5); D2.disc(ctx, sx, sy, r, t < 0.12 ? C.w : C.r); D2.disc(ctx, sx, sy, r * 0.7, t < 0.2 ? C.w : C.r2); if (t > 0.25) D2.disc(ctx, sx, sy, r * 0.4 * (t - 0.25) / 0.3, C.ink); }
      // five rings, one per element, each a beat behind the last
      EL.forEach(([c1, c2], i) => { const u = (t - i * 0.04) / 0.7; if (u <= 0 || u >= 1) return; ctx.globalAlpha = 1 - u; D2.ring(ctx, sx, sy, 10 + 70 * easeOut(u), c1, 2); D2.ring(ctx, sx, sy, 8 + 70 * easeOut(u), c2, 1); });
      // the shards
      ctx.globalAlpha = fade;
      SH.forEach(s => { const [c1, c2, c3] = EL[s.e], d = s.v * k, x1 = sx + Math.cos(s.a) * d, y1 = sy + Math.sin(s.a) * d * 0.8, x0 = sx + Math.cos(s.a) * d * 0.7, y0 = sy + Math.sin(s.a) * d * 0.56; D2.streak(ctx, x0, y0, x1, y1, 4, [c3, c1, c2]); });
      // five-colour rays in the first instant
      if (t < 0.22) D2.burst(ctx, sx, sy, 48, 20, EL.map(c => c[0]).concat([C.w]), t * 2);
      // the shockwave along the floor, crimson over black
      const g = gy - (cy - sy), w = 20 + 120 * easeOut(t * 1.6); ctx.globalAlpha = fade;
      ctx.save(); ctx.translate(sx, g); ctx.scale(1, 0.18); D2.ring(ctx, 0, 0, w + 3, C.ink, 3); D2.ring(ctx, 0, 0, w, C.r, 2); ctx.restore();
      ctx.globalAlpha = 1;
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 46, c: [C.r2, C.r, C.ink, EL[2][0]],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 48, c1: C.r2, c2: C.r, tag: 'APEX I', glyph(ctx, x, y, t) { for (let e = 0; e < 5; e++) { const a = -PI / 2 + e * 2 * PI / 5 + t * 3; art.disc(ctx, EL[e][0], R(x + Math.cos(a) * 7), R(y + Math.sin(a) * 7), 2); } } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (T && st >= CUTS && st < CUTS + 5 * CUT && (st - CUTS) % CUT === 0) calamity((st - CUTS) / CUT, T);
      if (T && st === CUTS + 5 * CUT) { orbs(p, T); SW.audio.sfx('charge'); }
      if (T && st === BU + 10) seal(T);
    },
    build() {},
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect'); SW.audio.sfx('zap');
      AP.stop(12); fx.shake(18, 28); fx.flash('#ffffff', 6);
      boom(cx, cy, gy);
      EL.forEach((e, i) => fx.ring(cx, cy, e[0], 4 + i * 3, 80 + i * 16, 18 + i * 2));
      AP.bits(cx, cy, 40, { cols: EL.map(e => e[0]).concat([C.r]), sp: 4.8, life: 26 });
    },
    pose(st) {
      if (st < 72) return null;
      if (st < CUTS + 5 * CUT) return [['a1', 'a2', 'a3', 'a4', 'special'][Math.min(4, ((st - CUTS) / CUT) | 0)], 1];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 46) return { vig: 0.55, grade: ['#3a0a10', 0.2] };
      if (st >= CUTS && st < CUTS + 5 * CUT) { const e = ((st - CUTS) / CUT) | 0, k = (st - CUTS) % CUT; return k < 2 ? { impact: 'tint', tint: EL[e][0], lines: 30, lineCol: EL[e][1] } : { vig: 0.45, grade: [EL[e][2], 0.25], lines: k < 6 ? 14 : 0, lineCol: EL[e][1] }; }
      if (st >= CUTS + 5 * CUT && st < FIN) return { vig: 0.5, grade: ['#1a0a10', 0.25], lines: st >= BU ? 20 : 0, lineCol: C.r2 };
      if (st >= FIN && st < FIN + 2) return { impact: 'neg' };
      if (st >= FIN + 2 && st < FIN + 4) return { impact: 'tint', tint: C.r };
      if (st >= FIN + 4 && st < FIN + 12) return { lines: 40, lineCol: C.w, split: 3, vig: 0.4 };
      return null;
    }
  };

  AP.reg('itsuki', { melee, ult, init });
})();
