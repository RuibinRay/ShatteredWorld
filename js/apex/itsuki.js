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
//            fly to the target and burn a five-pointed seal into the floor; on the blow a negative frame and a palm of
//            lightning the size of the target slams down on the seal
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
  function orbs(p, T) {   // the five gather round him, then fly to the target
    for (let e = 0; e < 5; e++) AP.fx({ x: p.x, y: p.y - 30, life: BU - (CUTS + 5 * CUT) + 40, draw(ctx, q, sx, sy, t, cam) {
      const cs = AP.caster(), st = cs ? cs.p.st : FIN + 1, a = -PI / 2 + e * 2 * PI / 5 + st * 0.12, fly = st >= BU ? easeOut((st - BU) / 14) : 0;
      if (st >= FIN) return;
      const ox = sx + Math.cos(a) * 26, oy = sy + Math.sin(a) * 18, tx = T.x - cam.x + Math.cos(a) * 30, ty = T.y - cam.y + 6 + Math.sin(a) * 6;
      const X = ox + (tx - ox) * fly, Y = oy + (ty - oy) * fly;
      D2.disc(ctx, X, Y, 6, EL[e][2]); D2.disc(ctx, X, Y, 5, EL[e][0]); D2.disc(ctx, X, Y, 2, EL[e][1]);
      if (fly > 0 && fly < 1) art.line(ctx, EL[e][0], R(ox + (tx - ox) * fly * 0.6), R(oy + (ty - oy) * fly * 0.6), R(X), R(Y), 1);
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
  function palm(cx, gy) {   // a palm of lightning the size of the target, slamming down on the seal
    const FING = [[-0.42, 30], [-0.14, 36], [0.14, 34], [0.4, 27]];   // finger angle off straight up, length
    AP.fx({ x: cx, y: gy, life: 26, draw(ctx, q, sx, sy, t) {
      const drop = easeOut(t * 4), X = sx, Y = R(sy - 26 - 110 * (1 - drop)), fade = 1 - ease((t - 0.62) / 0.38), fl = (t * 40 | 0) % 2;
      ctx.globalAlpha = fade;
      const shape = (col, grow) => {   // the palm, the four fingers, the thumb (grow: outline width)
        ctx.save(); ctx.translate(X, Y); ctx.scale(1, 1.15); art.disc(ctx, col, 0, 0, 22 + grow); ctx.restore();
        FING.forEach(([a, L]) => { const bx = X + Math.sin(a) * 16, by = Y - 18, ex = bx + Math.sin(a) * L, ey = by - Math.cos(a) * L; art.line(ctx, col, R(bx), R(by), R(ex), R(ey), 10 + grow * 2); art.disc(ctx, col, R(ex), R(ey), 5 + grow); });
        const tx = X + 22, ty = Y + 2; art.line(ctx, col, R(tx - 6), R(ty), R(tx + 16), R(ty - 16), 10 + grow * 2); art.disc(ctx, col, R(tx + 16), R(ty - 16), 5 + grow);
      };
      shape(C.ink, 3); shape(EL[2][2], 1); shape(EL[2][0], 0);
      ctx.save(); ctx.globalAlpha = fade * 0.9;   // the palm lines and finger joints in white light
      art.line(ctx, C.w, X - 14, Y - 4, X + 12, Y - 10, 1); art.line(ctx, C.w, X - 12, Y + 6, X + 8, Y + 2, 1); art.line(ctx, C.w, X + 2, Y + 18, X + 6, Y - 12, 1);
      FING.forEach(([a, L]) => { for (const u of [0.45, 0.75]) { const bx = X + Math.sin(a) * 16 + Math.sin(a) * L * u, by = Y - 18 - Math.cos(a) * L * u; art.line(ctx, EL[2][2], R(bx - 4), R(by), R(bx + 4), R(by), 1); } });
      ctx.restore();
      FING.forEach(([a, L], k) => { let px = X + Math.sin(a) * (16 + L), py = Y - 18 - Math.cos(a) * L - 5; for (let n = 0; n < 4; n++) { const nx = px + ((n + k + fl) % 2 ? 5 : -5), ny = py - 7; art.line(ctx, EL[2][1], R(px), R(py), R(nx), R(ny), n ? 1 : 2); px = nx; py = ny; } });   // lightning off the fingertips
      if (drop >= 1 && t < 0.4) D2.burst(ctx, X, sy - 4, 30, 16, [C.w, EL[2][0], EL[2][1]]);
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
      AP.stop(12); fx.shake(16, 26);
      palm(cx, gy);
      EL.forEach((e, i) => fx.ring(cx, cy, e[0], 4 + i * 3, 80 + i * 16, 18 + i * 2));
      AP.bits(cx, cy, 30, { cols: EL.map(e => e[0]), sp: 4.4, life: 24 });
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
      if (st >= FIN + 2 && st < FIN + 4) return { impact: 'tint', tint: EL[2][0] };
      if (st >= FIN + 4 && st < FIN + 12) return { lines: 40, lineCol: C.w, split: 3, vig: 0.4 };
      return null;
    }
  };

  AP.reg('itsuki', { melee, ult, init });
})();
