'use strict';
// Shattered Worlds — APEX Orin, the Door Between (#4 of the strongest 16). On top of js/orin-doors.js (his doors), which
// stays:
//   weapon   THE GATEKEY: a key as long as a spear, a ring bow at the hand and a toothed bit at the end that glows with
//            rift light; he fights with the armed poses
//   J        a cut, a thrust, a cut, and on the last hit a door: its frame snaps open where the blow lands, the two
//            leaves swing out and rift light pours through; hits throw small square shards of other worlds
//   skills   Rift Bolt: a keyhole of light at his hand; Fold: a frame at the target and one at his feet; Gate Lance: a
//            row of door frames along the lance; Back Door: a frame behind the target; Door Barrage: three frames flash
//   W+I      THOUSAND DOORS, a film of its own (204 frames): his close-up and card; door frames open all over the
//            screen; he steps out of them one after another round the target; then every door lines up into a
//            corridor that runs away behind the target, the camera falls down it, and a great door slams shut on them
//            on a negative impact frame and cracks with light
//   numbers  Versus: x1.12 damage, x1.1 health
(function () {
  const SW = window.SW, AP = SW.apex, G = SW.game, art = SW.art, fx = SW.fx, rand = SW.rand;
  if (!AP || !SW.data.heroes.orin) return;
  const { R, PI, ease, easeOut } = AP, D2 = AP.draw;
  const C = { m: '#e04dff', m2: '#f7d0ff', md: '#4a0a5a', ink: '#120818', wood: '#3a2440', w: '#ffffff', key: '#c8b8d8', key2: '#f0e8ff' };

  // ---------- the weapon: the Gatekey ----------
  function gatekey(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a); let px = dy, py = -dx; if (px < 0) { px = -px; py = -py; }
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = len;
    const [r0x, r0y] = P(-2.5 * sc, 0); T.disc(x, C.ink, r0x, r0y, R(2.6 * sc)); T.disc(x, C.key, r0x, r0y, R(1.8 * sc)); T.disc(x, C.ink, r0x, r0y, Math.max(1, R(0.8 * sc)));   // the bow
    const [s0x, s0y] = P(0, 0), [s1x, s1y] = P(L, 0);
    T.pline(x, C.ink, s0x, s0y, s1x, s1y, Math.max(2, R(1.4 * sc)) + 1); T.pline(x, C.key, s0x, s0y, s1x, s1y, Math.max(1, R(1 * sc)));
    for (let i = 4; i < L; i += 4) { const [hx, hy] = P(i, 0); T.rect(x, C.key2, R(hx), R(hy), 1, 1); }
    for (let j = 0; j < 3; j++) {   // the bit: three teeth, the last tooth glowing
      const u = L - j * 2.2 * sc - 1, h = (j === 1 ? 3.4 : 2.4) * sc;
      for (let v = 0; v <= h; v++) { const [bx, by] = P(u, v); T.rect(x, v > h - 1.2 ? C.m2 : j === 0 ? C.m : C.key, R(bx), R(by), Math.max(1, R(sc)), 1); }
    }
  }

  // ---------- J ----------
  function shards(x, y, n, sp) {
    for (let i = 0; i < n; i++) { const a = rand(0, PI * 2), s = rand(0.8, sp || 2.4), life = R(rand(12, 22)), col = [C.m, C.m2, '#7a5cff', '#5ad6c8'][i % 4]; AP.fx({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life, draw(ctx, q, sx, sy, t) { const k = q.max - q.life; ctx.globalAlpha = 1 - t; const z = t < 0.5 ? 3 : 2; art.rect(ctx, C.ink, R(sx + q.vx * k) - 1, R(sy + q.vy * k) - 1, z + 2, z + 2); art.rect(ctx, col, R(sx + q.vx * k), R(sy + q.vy * k), z, z); } }); }
  }
  function doorFrame(ctx, cx, cy, w, h, open, col) {   // a door frame, its two leaves swung out by `open` (0-1), light in the gap
    const hw = w / 2, gap = hw * open;
    art.rect(ctx, C.md, R(cx - gap), R(cy - h), R(gap * 2), R(h));
    if (open > 0.05) { art.rect(ctx, col || C.m, R(cx - gap * 0.8), R(cy - h + 1), Math.max(1, R(gap * 1.6)), R(h - 1)); art.rect(ctx, C.w, R(cx - gap * 0.25), R(cy - h + 1), Math.max(1, R(gap * 0.5)), R(h - 1)); }
    for (const s of [-1, 1]) { const lw = Math.max(1, R(hw * (1 - open))); art.rect(ctx, C.wood, s < 0 ? R(cx - hw - 1) : R(cx + hw - lw + 1), R(cy - h), lw, R(h)); }
    art.rect(ctx, C.ink, R(cx - hw - 2), R(cy - h - 2), R(w + 4), 2); art.rect(ctx, C.ink, R(cx - hw - 2), R(cy - h), 2, R(h)); art.rect(ctx, C.ink, R(cx + hw), R(cy - h), 2, R(h));
    art.rect(ctx, col || C.m, R(cx - hw - 1), R(cy - h - 1), R(w + 2), 1);
  }
  AP.orinDoor = doorFrame;
  function door(ctx, q, x, y, t) {
    const f = q.face, cx = x + f * 24, open = easeOut(t * 2.2), fade = 1 - ease((t - 0.55) / 0.45);
    ctx.globalAlpha = fade; doorFrame(ctx, cx, y - 4, 22, 40, open, C.m);
    if (t < 0.4) for (let i = 0; i < 8; i++) { const yy = y - 8 - i * 4; art.line(ctx, i % 2 ? C.m2 : C.w, R(cx), yy, R(cx + f * (10 + 30 * easeOut(t * 2.5))), yy, 1); }
  }
  const melee = {
    col: C.m, hi: C.m2, dk: C.ink,
    swing(ctx, q, x, y, t) { if (q.fin) return door(ctx, q, x, y, t); return (q.n === 1 ? AP.SWINGS.thrust : AP.SWINGS.crescent)(ctx, q, x, y, t); },
    hit(x, y, n, p, fin) { shards(x, y, fin ? 12 : 4, fin ? 3 : 2); if (fin) { AP.stop(4); fx.shake(3, 6); } }
  };

  // ---------- skills ----------
  function frameFx(x, y, w, h, life, back) { AP.fx({ x, y, life: life || 22, back, draw(ctx, q, sx, sy, t) { const open = t < 0.5 ? easeOut(t * 2) : 1 - ease((t - 0.5) * 2); ctx.globalAlpha = 1 - ease((t - 0.7) / 0.3); doorFrame(ctx, sx, sy, w, h, open, C.m); } }); }
  const foeOf = p => { const V = SW.versus; if (G.scene === 'vs' && V && V.f) { const o = V.f.find(f => f && f.p !== p); return o && o.p; } const z = G.zone; return z && z.ents ? z.ents.filter(e => e.team === 'enemy' && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0] : null; };
  function init() {
    AP.onCast('rift_bolt', p => AP.fx({ x: p.x + p.face * 16, y: p.y - 26, life: 14, draw(ctx, q, sx, sy, t) { ctx.globalAlpha = 1 - t; D2.disc(ctx, sx, sy - 2, 4 + 4 * t, C.m); D2.disc(ctx, sx, sy - 2, 2, C.w); art.rect(ctx, C.w, sx - 1, sy, 2, 5); } }));
    AP.onCast('fold', p => { const o = foeOf(p); if (o) frameFx(o.x, o.y, 22, 44, 24); frameFx(p.x + p.face * 18, p.y, 22, 44, 24, true); });
    AP.onCast('gate_lance', p => { for (let i = 1; i <= 5; i++) frameFx(p.x + p.face * i * 44, p.y, 16, 34, 16 + i * 3); });
    AP.onCast('back_door', p => { const o = foeOf(p); if (o) frameFx(o.x + (o.x > p.x ? 22 : -22), o.y, 22, 44, 28, true); });
    AP.onCast('door_barrage', p => { const o = foeOf(p); if (o) for (let i = -1; i <= 1; i++) frameFx(o.x + i * 34, o.y - 50 - Math.abs(i) * 10, 18, 30, 26); });
  }

  // ---------- W+I: Thousand Doors ----------
  const LEN = 204, FIN = 152, BU = 120;
  const zoom = AP.shots([
    [0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.5, 1, 'hero', 3, -18], [42, 2.3, 1, 'hero', 3, -18],
    [50, 1.1, 0.8, 'mid', 0, -20], [86, 1.2, 0.9, 'mid', 0, -20], [92, 1.7, 1, 'target'], [BU, 1.8, 1, 'target'],
    [FIN - 2, 2.6, 1, 'target', 0, -6], [FIN, 1.3, 1, 'target'], [FIN + 8, 1.6, 1, 'target'], [FIN + 32, 1.2, 0.5, 'mid'], [LEN - 4, 1, 0, 'mid']
  ]);
  const DOORS = [];   // the doors that open over the screen (screen space), made once
  for (let i = 0; i < 18; i++) DOORS.push({ x: 20 + ((i * 97) % 440), y: 50 + ((i * 61) % 140), w: 14 + (i % 3) * 4, h: 26 + (i % 4) * 5, t0: 54 + i * 2 });
  function screenDoors(ctx, o) {
    const st = o.st; if (st < 54 || st > BU + 6) return;
    for (const d of DOORS) { if (st < d.t0) continue; const k = easeOut((st - d.t0) / 8), close = st > BU - 6 ? ease((st - (BU - 6)) / 12) : 0, open = k * (1 - close); ctx.globalAlpha = 0.9 * (1 - close); doorFrame(ctx, d.x, d.y + d.h, d.w + 4, d.h, open * 0.55, C.m); }
    ctx.globalAlpha = 1;
  }
  function corridor(ctx, o) {   // every door lined up, running away behind the target to a point of light
    const st = o.st; if (st < BU || st >= FIN) return;
    const k = ease((st - BU) / 10), fall = (st - BU) / (FIN - BU), cx = o.fxp, cy = o.fyp - 6;
    ctx.globalAlpha = k;
    for (let i = 14; i >= 0; i--) {
      const z = ((i + fall * 4) % 15) / 15, s = 1 - z, w = R(200 * s * s + 8), h = R(150 * s * s + 10);
      art.rect(ctx, C.ink, R(cx - w / 2) - 3, R(cy - h / 2) - 3, w + 6, 3); art.rect(ctx, C.ink, R(cx - w / 2) - 3, R(cy - h / 2), 3, h); art.rect(ctx, C.ink, R(cx + w / 2), R(cy - h / 2), 3, h);
      art.rect(ctx, i % 2 ? C.m : C.m2, R(cx - w / 2) - 2, R(cy - h / 2) - 2, w + 4, 1);
      art.rect(ctx, i % 2 ? C.m : C.wood, R(cx - w / 2) - 2, R(cy - h / 2), 1, h); art.rect(ctx, i % 2 ? C.m : C.wood, R(cx + w / 2) + 1, R(cy - h / 2), 1, h);
    }
    D2.disc(ctx, cx, cy, 3 + 2 * Math.sin(st * 0.5), C.w);
    ctx.globalAlpha = 1;
  }
  function slamDoor(cx, gy) {   // a great door slams shut on them and cracks with light
    AP.fx({ x: cx, y: gy, life: 34, draw(ctx, q, sx, sy, t) {
      const shut = easeOut(t * 5), w = 70, h = 110, gap = R((w / 2) * (1 - shut)), crack = t > 0.3 ? ease((t - 0.3) / 0.4) : 0;
      ctx.globalAlpha = 1 - ease((t - 0.75) / 0.25);
      for (const s of [-1, 1]) { const lx = s < 0 ? sx - w / 2 : sx + gap, lw = w / 2 - gap; art.rect(ctx, C.ink, R(lx) - 1, sy - h - 1, R(lw) + 2, h + 2); art.rect(ctx, C.wood, R(lx), sy - h, R(lw), h); for (let j = 0; j < 4; j++) art.rect(ctx, C.md, R(lx) + 2, sy - h + 6 + j * 26, Math.max(1, R(lw) - 4), 20); art.rect(ctx, C.m, R(lx), sy - h, R(lw), 1); }
      if (crack > 0) for (let i = 0; i < 7; i++) { let px = sx, py = sy - h / 2; const a = (i / 7) * PI * 2; for (let j = 0; j < 5; j++) { const nx = px + Math.cos(a + (j % 2 ? 0.5 : -0.4)) * 10 * crack, ny = py + Math.sin(a + (j % 2 ? 0.5 : -0.4)) * 10 * crack; art.line(ctx, j < 2 ? C.w : C.m2, R(px), R(py), R(nx), R(ny), 2); px = nx; py = ny; } }
      art.rect(ctx, C.m2, sx - 1, sy - h, 2, h);
    } });
  }
  const ult = {
    len: LEN, fin: FIN, bu: BU, own: 72, cu0: 16, cu1: 44, c: [C.m2, C.m, C.md, C.ink],
    zoom, noDark: true,
    card: AP.card({ from: 18, to: 46, c1: C.m2, c2: C.m, tag: 'APEX IV', glyph(ctx, x, y, t) { doorFrame(ctx, x, y + 9, 12, 18, 0.3 + 0.6 * Math.abs(Math.sin(t * 6)), C.m); } }),
    every(st, o) {
      const { p, T } = o;
      if (st === 16) SW.audio.sfx('select');
      if (st === 54) SW.audio.sfx('charge');
      if (T && st >= 92 && st < BU && (st - 92) % 7 === 0) {   // he steps out of doors round them
        const s = ((st - 92) / 7) % 2 ? 1 : -1, dx = s * (34 + ((st * 7) % 20));
        frameFx(T.x + dx, T.y, 22, 44, 18, true);
        if (fx.ghost && p.sheet) fx.ghost(p.sheet(), ((st - 92) / 7) % 2 ? 'a2' : 'a4', 1, T.x + dx, T.y, s > 0, C.m);
        shards(T.x, T.y - 22, 3, 2); SW.audio.sfx('dash');
      }
      if (st > FIN && st < LEN - 20 && st % 3 === 0) shards(G.cam.x + rand(0, SW.W), G.cam.y + rand(0, 40), 1, 0.6);
    },
    build(k, dur) { if (k === 0 || k === dur - 10) SW.audio.sfx('charge'); },
    finish(o) {
      const { cx, cy, gy } = o;
      SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('perfect');
      AP.stop(10); fx.shake(12, 22);
      slamDoor(cx, gy);
      fx.ring(cx, cy, C.w, 6, 120, 24); fx.ring(cx, cy, C.m, 4, 90, 20);
      shards(cx, cy, 30, 4.2);
    },
    pose(st) {
      if (st < 72) return null;
      if (st < 92) return ['cast', (st >> 3) % 2];
      if (st < BU) return ['dash', 0];
      if (st < FIN - 4) return ['charge', (st >> 2) % 2];
      if (st < FIN + 10) return ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2];
      return ['cheer', 0];
    },
    look(st) {
      if (st >= 16 && st < 44) return { vig: 0.5, grade: ['#2a0a3a', 0.2] };
      if (st >= 54 && st < BU) return { vig: 0.3, draw: screenDoors };
      if (st >= BU && st < FIN) return { vig: 0.6, grade: ['#2a0a3a', 0.3], draw: corridor, lines: st > FIN - 12 ? 24 : 0, lineCol: C.m2 };
      if (st >= FIN && st < FIN + 2) return { impact: 'neg' };
      if (st >= FIN + 2 && st < FIN + 4) return { impact: 'tint', tint: '#ff7aff' };
      if (st >= FIN + 4 && st < FIN + 12) return { lines: 40, lineCol: C.m2, split: 3, vig: 0.4 };
      return null;
    }
  };

  AP.reg('orin', {
    weapon: { name: 'gatekey', len: 19, w: 2, col: C.key, hi: C.key2, hilt: C.ink, armed: 1, draw: gatekey },
    melee, ult, init,
    tune: { dmg: 1.12, hp: 1.1 }
  });
})();
