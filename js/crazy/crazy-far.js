'use strict';
// Shattered Worlds — crazy Versus stages, part 3: far-out places (see crazy-core.js for how a stage is put together).
//   The Pinball Palace     inside a giant pinball machine: the walls bounce you back, kickers on the floor fling you up
//   The Last Disco         a rooftop dance floor at the end of the world; a roaming spotlight charges energy
//   The Drowned Galleon    a ghost ship in a storm; the deck rolls and everyone slides downhill
//   The Midnight Carnival  a haunted carnival; Ferris wheel cars are platforms, and now and then the wheel lurches
//   The Sunken Reef        a tidal grotto; the tide rises and falls, and under water everyone floats
(function () {
  const SW = window.SW, CZ = SW.crazy;
  if (!CZ) return;
  const art = SW.art, fx = SW.fx, T = 16, FLOOR = CZ.FLOOR, W = CZ.W, GRAV = CZ.GRAV, EDGE = CZ.EDGE;
  const R = CZ.rect, D = CZ.disc, E = CZ.ellipse, ST = SW.stages;
  const rnd = SW.rand;

  // ======================================================================================================
  // 11. THE PINBALL PALACE
  // ======================================================================================================
  const KICK = [4 * T + 8, 33 * T + 8];   // the two kickers on the floor
  const NEON = ['#ff3ea5', '#22d3ee', '#f5c542', '#7dff6a'];
  function neonLine(x, col, pts, w) { for (let i = 0; i < pts.length - 1; i++) { CZ.line(x, CZ.mix(col, '#000000', 0.55), pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], w + 2); } for (let i = 0; i < pts.length - 1; i++) CZ.line(x, col, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], w); for (let i = 0; i < pts.length - 1; i++) CZ.line(x, '#ffffff', pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 1); }
  CZ.add('cz_pinball', {
    name: 'The Pinball Palace',
    twist: 'Inside a giant pinball machine. The walls bounce you back, and kickers on the floor fling you up.',
    theme: { style: 'panel', a: '#2a1a4a', b: '#22143e', top: '#8a5ad8', hi: '#f0d8ff', deep: '#0c0618', plat: '#c8ccd8', sky: ['#0c0618', '#1e0e3a'], haz: '#ff3ea5', win: NEON },
    es: { 'The Pinball Palace': 'El Palacio del Pinball', 'Inside a giant pinball machine. The walls bounce you back, and kickers on the floor fling you up.': 'Dentro de una máquina de pinball gigante. Las paredes te devuelven de un rebote y los lanzadores del suelo te disparan hacia arriba.' },
    zh: { 'The Pinball Palace': '弹球宫殿', 'Inside a giant pinball machine. The walls bounce you back, and kickers on the floor fling you up.': '在巨型弹球机里战斗。墙壁会把人弹回来，地上的弹射器会把人弹上天。' },
    tiles(z) { z.plat(9, 11, 5); z.plat(24, 11, 5); z.plat(15, 8, 8); },
    paint(x, r) {
      CZ.sky(x, [[0, '#0c0618'], [120, '#160a2c'], [220, '#1e0e3a'], [300, '#26124a']]);
      // the playfield's back glass: a printed starfield and a wizard's eye
      CZ.stars(x, r, 120, 512, 240, ['#3a2a6a', '#5a3a8a', '#8a5ad8']);
      for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; CZ.line(x, '#2a1650', 256, 108, 256 + Math.cos(a) * 300, 108 + Math.sin(a) * 300, 9); }   // sunburst rays
      D(x, '#3a1a6a', 256, 108, 46); D(x, '#5a2a9a', 256, 108, 40);
      // neon rails, ramps and lanes
      neonLine(x, NEON[0], [[30, 250], [60, 150], [130, 80], [256, 54], [382, 80], [452, 150], [482, 250]], 2);
      neonLine(x, NEON[1], [[80, 250], [110, 170], [170, 120], [210, 108]], 2); neonLine(x, NEON[1], [[432, 250], [402, 170], [342, 120], [302, 108]], 2);
      for (const lx of [196, 236, 276, 316]) { neonLine(x, NEON[2], [[lx, 150], [lx, 196]], 1); }
      // pop bumpers (printed big on the glass)
      for (const [bx, by, c] of [[150, 190, NEON[0]], [362, 190, NEON[1]], [256, 160, NEON[2]]]) { D(x, '#0c0618', bx, by + 3, 20); D(x, CZ.mix(c, '#000000', 0.5), bx, by, 20); D(x, c, bx, by - 2, 16); D(x, '#ffffff', bx, by - 2, 9); D(x, c, bx, by - 2, 6); }
      // drop targets and arrow inserts
      for (let i = 0; i < 5; i++) { R(x, '#0c0618', 200 + i * 24, 218, 16, 20); R(x, NEON[3], 201 + i * 24, 219, 14, 18); R(x, '#ffffff', 201 + i * 24, 219, 14, 2); }
      for (let i = 0; i < 6; i++) { const ax = 40 + i * 86, ay = 236; for (let k = 0; k < 6; k++) R(x, NEON[i % 4], ax - k, ay - k, 2 * k + 1, 1); }
      // the slingshots in the lower corners
      for (const [sx, d] of [[20, 1], [492, -1]]) for (let k = 0; k < 40; k++) R(x, k % 6 < 2 ? '#ffffff' : NEON[0], sx + (d > 0 ? 0 : -k), 260 - k, k, 1);
    },
    floor(x, z, r) {   // the playfield wood under clear coat, printed with lanes and stars
      R(x, '#2a1a4a', 0, FLOOR, z.pw, 48); CZ.ditherRect(x, '#2a1a4a', '#120a24', 0, FLOOR + 20, z.pw, 28);
      R(x, '#f0d8ff', 0, FLOOR, z.pw, 1); R(x, '#8a5ad8', 0, FLOOR + 1, z.pw, 2);
      for (let xx = 0; xx < z.pw; xx += 40) { R(x, NEON[(xx / 40) % 4], xx + 6, FLOOR + 6, 28, 2); for (let k = 0; k < 4; k++) R(x, '#f0d8ff', xx + 18 - k, FLOOR + 10 + k, 2 * k + 1, 1); }
      for (const kx of KICK) { R(x, '#0c0618', kx - 12, FLOOR, 24, 6); R(x, '#5a5e6e', kx - 11, FLOOR, 22, 3); }
      CZ.eachPlat(z, (px, py, pw) => {   // chrome rails with neon underglow
        x.clearRect(px, py, pw, T);
        R(x, '#3a3e4e', px, py, pw, 5); R(x, '#c8ccd8', px, py, pw, 3); R(x, '#ffffff', px, py, pw, 1); R(x, NEON[1], px + 2, py + 5, pw - 4, 1);
        for (let i = 4; i < pw; i += 10) R(x, '#3a3e4e', px + i, py + 1, 2, 1);
      });
    },
    init(s) { s.c.score = 0; s.c.fl = [0, 0]; s.c.kick = [0, 0]; s.c.pop = 0; },
    tick(s, z, on) {
      const c = s.c;
      c.fl = c.fl.map(v => Math.max(0, v - 1)); c.kick = c.kick.map(v => Math.max(0, v - 1)); if (c.pop > 0) c.pop--;
      if (!on) return;
      for (const p of CZ.fighters()) {
        // the walls are bumpers: a fighter knocked into one bounces back out
        const side = p.x <= EDGE + 3 && p.vx < -0.8 ? 0 : p.x >= z.pw - EDGE - 3 && p.vx > 0.8 ? 1 : -1;
        if (side >= 0 && p.state === 'hurt' && !((p.czBump || 0) > s.ct)) {
          p.vx = side ? -5.2 : 5.2; p.vy = Math.min(p.vy, -3.6); p.onGround = false; p.czBump = s.ct + 45;
          c.fl[side] = 14; c.score += 500; c.pop = 30;
          CZ.sfx('block'); fx.shake(2, 6); CZ.spark(p.x + (side ? 6 : -6), p.y - 18, NEON[side], 12, 3);
        }
        // the kickers
        for (let k = 0; k < 2; k++) {
          if (Math.abs(p.x - KICK[k]) > 10 || !CZ.onFloor(p) || (p.czKick || 0) > s.ct) continue;
          if (CZ.launch(p, -10.5)) { p.czKick = s.ct + 40; c.kick[k] = 12; c.score += 100; c.pop = 30; CZ.sfx('djump'); CZ.spark(KICK[k], FLOOR - 4, NEON[2], 10, 2.5); }
        }
      }
    },
    back(ctx, s, cx) {   // the score display
      const c = s.c, dx = Math.round(256 - cx * 0.25), dy = 34;
      R(ctx, '#05030a', dx - 70, dy, 140, 26); R(ctx, '#3a2a10', dx - 70, dy, 140, 1); R(ctx, '#3a2a10', dx - 70, dy + 25, 140, 1);
      for (let yy = dy + 3; yy < dy + 24; yy += 2) for (let xx = dx - 67; xx < dx + 68; xx += 2) R(ctx, '#1a0e04', xx, yy, 1, 1);
      const txt = String(c.score || 0).padStart(7, '0');
      SW.text(ctx, txt, dx, dy + 7, c.pop % 8 < 5 && c.pop ? '#ffffff' : '#ff9a3a', { align: 'center', scale: 2, raw: true });
      for (let i = 0; i < 10; i++) { const on = Math.floor(SW.frame / 6 + i) % 10 < 3; R(ctx, on ? NEON[i % 4] : '#2a1650', dx - 90 + i * 20, 96, 6, 3); }   // chasing lights
    },
    mid(ctx, s, cx, cy) {
      const c = s.c, fy = FLOOR - cy;
      for (let side = 0; side < 2; side++) {   // the rubber bumper walls at both ends
        const wx = side ? SW.versus.zone.pw - cx - 12 : -cx, lit = c.fl[side] > 0;
        R(ctx, '#0c0618', wx, 20, 12, fy - 20); R(ctx, lit ? '#ffffff' : NEON[side], wx + (side ? 0 : 6), 20, 6, fy - 20); R(ctx, lit ? NEON[side] : CZ.mix(NEON[side], '#000000', 0.5), wx + (side ? 6 : 0), 20, 6, fy - 20);
        for (let y = 30; y < fy - 10; y += 20) R(ctx, '#f0d8ff', wx + 3, y, 6, 3);
        if (lit) art.glow(ctx, wx + 6, fy / 2, 50, NEON[side], 0.2);
      }
      for (let k = 0; k < 2; k++) {   // the kickers: a spring pad that squashes when it fires
        const kx = KICK[k] - cx, sq = c.kick[k] > 0 ? 2 : 6, on = c.kick[k] > 0 || Math.floor(SW.frame / 20) % 2;
        R(ctx, '#5a5e6e', kx - 10, fy - sq, 20, sq); for (let i = 0; i < sq; i += 2) R(ctx, '#c8ccd8', kx - 9, fy - sq + i, 18, 1);
        R(ctx, '#0c0618', kx - 12, fy - sq - 3, 24, 3); R(ctx, on ? NEON[2] : '#8a6a20', kx - 11, fy - sq - 3, 22, 2);
        if (c.kick[k] > 0) art.glow(ctx, kx, fy - 6, 24, NEON[2], 0.3);
      }
    }
  });

  // ======================================================================================================
  // 12. THE LAST DISCO
  // ======================================================================================================
  const BEAT = 30, SPOT_R = 30, SPOT_GAIN = 0.3;
  const DANCE = ['#ff3ea5', '#22d3ee', '#f5c542', '#b48cff', '#7dff6a'];
  const spotX = (s, z) => Math.round(z.pw / 2 + Math.sin((s.ct || 0) * 0.004) * 210 + Math.sin((s.ct || 0) * 0.011 + 1) * 50);
  CZ.add('cz_disco', {
    name: 'The Last Disco',
    twist: 'A rooftop dance floor at the end of the world. Stand in the roaming spotlight to charge energy fast.',
    theme: { style: 'panel', a: '#1a1028', b: '#140c20', top: '#5a3a7a', hi: '#f0d8ff', deep: '#08040e', plat: '#c8ccd8', sky: ['#0a0414', '#4a1a3a'], haz: '#ff3ea5', win: DANCE },
    es: { 'The Last Disco': 'La Última Disco', 'A rooftop dance floor at the end of the world. Stand in the roaming spotlight to charge energy fast.': 'Una pista de baile en una azotea al fin del mundo. Ponte bajo el foco que se mueve para cargar energía rápido.' },
    zh: { 'The Last Disco': '末日迪斯科', 'A rooftop dance floor at the end of the world. Stand in the roaming spotlight to charge energy fast.': '世界末日的天台舞池。站进游走的聚光灯里，能量会快速充满。' },
    tiles(z) { z.plat(3, 10, 5); z.plat(30, 10, 5); },
    paint(x, r) {
      CZ.sky(x, [[0, '#0a0414'], [70, '#160828'], [140, '#2a0c3a'], [190, '#4a1240'], [230, '#7a1e3a'], [300, '#a83a2a']]);
      CZ.stars(x, r, 150, 512, 150, ['#ffffff', '#ffc8e8', '#c8a8ff']);
      // the moon, broken in two, molten light between the halves, its pieces strung out
      const mx = 370, my = 74;
      CZ.pixels(x, mx - 44, my - 44, 88, 88, (px, py) => {
        const dx = px - mx, dy = py - my, crack = dx * 0.8 + dy * 0.6 + 4 * Math.sin(dy * 0.4), d = Math.hypot(dx, dy);
        if (d > 36) return null;
        if (Math.abs(crack) < 4) return Math.abs(crack) < 1.5 ? '#ffffff' : '#ffb040';
        const k = 1 - d / 40 - dx * 0.006 - dy * 0.006 + (CZ.hash(px >> 2, py >> 2, 3) > 0.85 ? -0.2 : 0);
        return CZ.ramp(['#4a3a5a', '#8a7a9a', '#c8bcd0', '#f0e8f0'], k, px, py);
      });
      for (let i = 0; i < 16; i++) { const a = -0.3 + i * 0.12, d = 48 + i * 6; D(x, i % 3 ? '#8a7a9a' : '#c8bcd0', mx + Math.cos(a) * d, my + Math.sin(a) * d * 0.5, 1 + (i % 3)); }
      art.glow(x, mx, my, 60, '#ff8a40', 0.15);
      // burning streaks falling across the sky
      for (let i = 0; i < 8; i++) { const sx = 30 + r() * 300, sy = r() * 120; for (let k = 0; k < 14; k++) R(x, k < 2 ? '#ffffff' : k < 6 ? '#ffb040' : '#a83a2a', Math.round(sx - k * 2), Math.round(sy - k * 1.2), 1, 1); }
      // the city below in ruins, its signs still lit
      for (let bx = 0; bx < 512;) {
        const w = 18 + (r() * 30 | 0), h = 40 + (r() * 90 | 0), top = 260 - h, lean = r() < 0.2 ? 1 : 0;
        for (let yy = top; yy < 300; yy++) R(x, '#120818', bx + (lean ? Math.round((yy - top) * -0.08) : 0), yy, w - 2, 1);
        R(x, '#2a1430', bx, top, w - 2, 1);
        for (let wy = top + 6; wy < 250; wy += 8) for (let wx = bx + 3; wx < bx + w - 5; wx += 5) if (r() < 0.12) R(x, DANCE[(r() * 5) | 0], wx, wy, 2, 2);
        if (r() < 0.25) { const sc = DANCE[(r() * 5) | 0]; R(x, sc, bx + 2, top - 8, w - 6, 5); R(x, '#ffffff', bx + 3, top - 7, w - 8, 1); }
        bx += w;
      }
      art.glow(x, 256, 300, 200, '#ff3ea5', 0.12);
    },
    floor(x, z, r) {   // the lit tiles themselves are drawn live; here the edge and what's under it
      x.clearRect(0, FLOOR, z.pw, 16);
      R(x, '#0c0814', 0, FLOOR + 16, z.pw, 32); R(x, '#3a2a4a', 0, FLOOR + 16, z.pw, 2);
      for (let xx = 0; xx < z.pw; xx += 24) { R(x, '#1a1028', xx, FLOOR + 22, 20, 8); R(x, DANCE[(xx / 24) % 5], xx + 2, FLOOR + 24, 3, 3); }
      CZ.eachPlat(z, (px, py, pw) => {   // speaker stacks' tops / DJ booth ledges
        x.clearRect(px, py, pw, T);
        R(x, '#08040e', px, py, pw, 6); R(x, '#3a2a4a', px, py, pw, 4); R(x, '#c8ccd8', px, py, pw, 1);
        for (let i = 4; i < pw - 4; i += 14) { D(x, '#1a1028', px + i + 4, py + 10, 4); art.ring(x, '#5a3a7a', px + i + 4, py + 10, 4); }
      });
    },
    tick(s, z, on) {
      if (!on) return;
      const sx = spotX(s, z);
      for (const f of CZ.fightersF()) {
        const p = f.p;
        if (Math.abs(p.x - sx) > SPOT_R || p.state === 'ult') continue;
        f.state.energy = Math.min(300, f.state.energy + SPOT_GAIN);
        if (s.ct % 6 === 0) CZ.part({ x: p.x + rnd(-8, 8), y: p.y - rnd(4, 30), vx: 0, vy: -0.7, life: 20, max: 20, col: DANCE[(s.ct / 6 | 0) % 5], s: 1 });
      }
    },
    back(ctx, s, cx) {
      // the mirror ball over the floor, its beams sweeping
      const bx = Math.round(304 - cx), by = 40, rot = SW.frame * 0.05;
      R(ctx, '#8a8a9a', bx, 0, 1, by - 15);
      for (let i = 0; i < 6; i++) { const a = rot + i * 1.05, ex = bx + Math.cos(a) * 280, ey = by + 200 + Math.sin(a * 0.7) * 30; ctx.globalAlpha = 0.07; CZ.line(ctx, DANCE[i % 5], bx, by, ex, ey, 5); }
      ctx.globalAlpha = 1;
      D(ctx, '#2a2a3a', bx, by, 15);   // the ball: mirror tiles in rows, turning (plain rects: never read back from the game canvas)
      for (let ty = -14; ty < 14; ty += 4) {
        const half = Math.floor(Math.sqrt(Math.max(0, 196 - (ty + 2) * (ty + 2))));
        for (let tx = -half; tx < half - 1; tx += 4) {
          const u = Math.floor((Math.asin(SW.clamp((tx + 2) / 15, -1, 1)) + rot) / 0.35), v = (ty + 14) >> 2, k = CZ.hash(u, v, 7);
          R(ctx, k > 0.85 ? '#ffffff' : k > 0.6 ? '#c8c8d8' : k > 0.3 ? '#8a8a9a' : DANCE[(u + v + 50) % 5], bx + tx, by + ty, 3, 3);
        }
      }
      if (SW.frame % 12 < 3) { R(ctx, '#ffffff', bx - 6, by - 8, 3, 1); R(ctx, '#ffffff', bx - 5, by - 9, 1, 3); }
    },
    mid(ctx, s, cx, cy) {
      const z = SW.versus.zone || { pw: 608 }, fy = FLOOR - cy, beat = Math.floor((s.ct || SW.frame) / BEAT), sx = spotX(s, z) - cx;
      for (let tx = 0; tx < z.pw; tx += 16) {   // the dance floor, lit to the beat
        const i = tx / 16, lit = (i + beat) % 3 === 0 || (i * 7 + beat * 3) % 5 === 0, col = DANCE[(i + beat) % 5], x0 = tx - cx;
        if (x0 < -16 || x0 > W) continue;
        R(ctx, '#08040e', x0, fy, 16, 16);
        R(ctx, lit ? col : CZ.mix(col, '#08040e', 0.78), x0 + 1, fy + 1, 14, 14);
        if (lit) { R(ctx, '#ffffff', x0 + 2, fy + 2, 4, 1); R(ctx, CZ.mix(col, '#ffffff', 0.5), x0 + 2, fy + 3, 1, 3); }
      }
      R(ctx, '#f0d8ff', 0, fy, W, 1);
      // the roaming spotlight: a cone from above and a pool of light on the floor
      ctx.globalAlpha = 0.16; for (let y = 0; y < fy; y += 2) { const w = Math.round(6 + (y / fy) * SPOT_R * 2); R(ctx, '#fff4c8', sx - (w >> 1), y, w, 2); }
      ctx.globalAlpha = 0.45; E(ctx, '#fff4c8', sx, fy + 1, SPOT_R, 3); ctx.globalAlpha = 1;
      E(ctx, '#ffffff', sx, fy, SPOT_R - 8, 1);
    }
  });

  // ======================================================================================================
  // 13. THE DROWNED GALLEON
  // ======================================================================================================
  const ROLL = 0.08, ROLL_T = 600, ROLL_PUSH = 0.45;
  const roll = s => Math.sin((s.ct || 0) * Math.PI * 2 / ROLL_T) * ROLL;
  CZ.add('cz_galleon', {
    name: 'The Drowned Galleon',
    twist: 'A ghost ship in a storm. The deck rolls from side to side, and everyone on it slides downhill.',
    theme: { style: 'plate', a: '#5a3a24', b: '#4a2e1c', top: '#8a6a48', hi: '#c8a070', deep: '#1e120a', plat: '#6a4a2a', sky: ['#060c10', '#1e3a3a'], haz: '#5affb0', win: ['#5affb0'] },
    es: { 'The Drowned Galleon': 'El Galeón Ahogado', 'A ghost ship in a storm. The deck rolls from side to side, and everyone on it slides downhill.': 'Un barco fantasma en plena tormenta. La cubierta se balancea de lado a lado y todos se deslizan cuesta abajo.' },
    zh: { 'The Drowned Galleon': '沉没的幽灵船', 'A ghost ship in a storm. The deck rolls from side to side, and everyone on it slides downhill.': '暴风雨中的幽灵船。甲板左右摇晃，站在上面的人会向低处滑去。' },
    tiles(z) { z.plat(3, 11, 5); z.plat(30, 11, 5); z.plat(13, 7, 12); z.plat(17, 3, 4); },
    paint(x, r) {
      CZ.sky(x, [[0, '#04080c'], [80, '#0a1418'], [160, '#12242a'], [230, '#1e3a3a'], [300, '#2a4a48']]);
      CZ.sky(x, [[0, '#04080c'], [100, '#0e1c20'], [170, '#1e3a3a'], [200, '#3a6a60'], [230, '#2a4a48'], [300, '#1a3030']]);   // a pale band of storm light low down
      D(x, '#3a6a5a', 120, 96, 24); D(x, '#8affc8', 120, 96, 20); D(x, '#d8fff0', 116, 92, 12);   // a ghost-green moon
      // banks of storm cloud, far (low, hazy) to near (high, dark), each band ragged top and bottom and lit along its underside
      [[150, 176, 10, '#1e3a3a', '#4a7a70', 4], [116, 150, 14, '#16282c', '#3a5a58', 3], [66, 116, 18, '#0e1c20', '#2e4a4a', 2], [-10, 70, 20, '#081214', '#24403e', 1]].forEach(([t0, b0, amp, body, rim, sd]) => {
        const top = xx => t0 + amp * (CZ.fbm(xx / 40, sd, sd * 7, 3) - 0.5) * 2, bot = xx => b0 + amp * (CZ.fbm(xx / 46, sd + 9, sd * 3, 4) - 0.5) * 2.4 + 6 * Math.sin(xx * 0.02 + sd);
        for (let xx = 0; xx < 512; xx++) { const t = Math.round(top(xx)), b = Math.round(bot(xx)); if (b <= t) continue; R(x, body, xx, t, 1, b - t); R(x, rim, xx, b - 2, 1, 2); if (CZ.bayer(xx, b) < 0.5) R(x, rim, xx, b - 3, 1, 1); }
      });
    },
    floor(x, z, r) {   // the deck, the mast, the yard, the crow's nest, torn glowing sails and rigging (all on the ship, so they roll with us)
      R(x, '#4a2e1c', 0, FLOOR, z.pw, 48);
      for (let yy = 0; yy < 48; yy += 6) { R(x, '#2a180c', 0, FLOOR + yy + 5, z.pw, 1); for (let xx = (yy * 7) % 40; xx < z.pw; xx += 40) { R(x, '#2a180c', xx, FLOOR + yy, 1, 6); R(x, '#8a6a48', xx + 3, FLOOR + yy + 2, 1, 1); } }
      R(x, '#c8a070', 0, FLOOR, z.pw, 1); R(x, '#8a6a48', 0, FLOOR + 1, z.pw, 2);
      for (let yy = FLOOR + 28; yy < FLOOR + 48; yy++) for (let xx = 0; xx < z.pw; xx++) if (CZ.bayer(xx, yy) < (yy - FLOOR - 28) / 22) R(x, '#120a04', xx, yy, 1, 1);
      const mx = 21 * T;
      R(x, '#1e120a', mx - 5, 0, 10, FLOOR); R(x, '#6a4a2a', mx - 4, 0, 8, FLOOR); R(x, '#8a6a48', mx - 4, 0, 2, FLOOR); for (let y = 20; y < FLOOR; y += 30) R(x, '#2a180c', mx - 5, y, 10, 3);   // the mast
      // sails: torn, faintly glowing, hanging from the yard (dithered so the fight shows through)
      for (let yy = 7 * T + 6; yy < 7 * T + 70; yy++) for (let xx = 13 * T + 6; xx < 25 * T - 6; xx++) {
        const torn = yy > 7 * T + 40 + 18 * CZ.noise(xx / 10, 1, 8) || (xx > 18 * T && xx < 19 * T + 8 && yy > 7 * T + 26);
        if (torn || Math.abs(xx - mx) < 6) continue;
        if (CZ.bayer(xx, yy) < 0.28) R(x, (xx + yy) % 9 ? '#2a6a58' : '#5affb0', xx, yy, 1, 1);
      }
      for (let yy = 3 * T + 6; yy < 3 * T + 40; yy++) for (let xx = 16 * T; xx < 26 * T; xx++) { if (Math.abs(xx - mx) < 6 || yy > 3 * T + 22 + 14 * CZ.noise(xx / 8, 3, 2)) continue; if (CZ.bayer(xx, yy) < 0.22) R(x, '#2a6a58', xx, yy, 1, 1); }
      // rigging
      for (const [x0, y0, x1, y1] of [[mx, 8, 2 * T, FLOOR], [mx, 8, 36 * T, FLOOR], [mx, 3 * T, 8 * T, FLOOR], [mx, 3 * T, 34 * T, FLOOR]]) CZ.line(x, '#3a2a1a', x0, y0, x1, y1);
      CZ.eachPlat(z, (px, py, pw) => {   // the yard, the crow's nest, the castle rails: tarred wood
        x.clearRect(px, py, pw, T);
        if (pw === 4 * T && py === 3 * T) { R(x, '#2a180c', px, py, pw, 14); R(x, '#5a3a24', px + 1, py, pw - 2, 12); for (let i = 3; i < pw; i += 6) R(x, '#2a180c', px + i, py + 2, 1, 10); R(x, '#c8a070', px, py, pw, 1); return; }   // the crow's nest
        R(x, '#1e120a', px, py, pw, 6); R(x, '#6a4a2a', px, py, pw, 4); R(x, '#c8a070', px, py, pw, 1);
        if (py === 7 * T) for (const ex of [px, px + pw - 3]) R(x, '#8a6a48', ex, py - 2, 3, 8);
        else for (let i = 4; i < pw; i += 10) R(x, '#3a2a1a', px + i, py + 6, 2, FLOOR - py - 6);   // posts down to the deck
      });
    },
    init(s) { s.c.bolt = 0; s.c.next = 200; },
    tick(s, z, on) {
      const c = s.c;
      if (c.bolt > 0) c.bolt--;
      if (--c.next <= 0) { c.bolt = 14; c.next = 240 + Math.random() * 400; c.bx = 40 + Math.random() * 400; CZ.sfx('explode'); }
      if (on && s.ct % 2 === 0) CZ.part({ x: SW.game.cam.x + Math.random() * W, y: SW.game.cam.y - 4, vx: -1.2 - roll(s) * 10, vy: 6, life: 40, max: 40, col: '#8ab8c8', s: 1, a: 0.5 });   // rain
    },
    move(a, s) {   // the deck slopes: whoever stands on it slides downhill
      if (!a.onGround) return 0;
      return (roll(s) / ROLL) * ROLL_PUSH * (a.state === 'guard' ? 0.5 : 1);
    },
    back(ctx, s, cx) {
      const c = s.c, t = roll(s), H0 = 150, tn = Math.tan(t);
      if (c.bolt > 0) {   // lightning: the sky goes white, a bolt cracks down
        ctx.globalAlpha = c.bolt / 14 * 0.5; R(ctx, '#d8fff0', 0, 0, W, 270); ctx.globalAlpha = 1;
        if (c.bolt > 8) { let bx = c.bx, by = 0; while (by < 150) { const nx = bx + rnd(-10, 10), ny = by + rnd(8, 18); CZ.line(ctx, '#ffffff', bx, by, nx, ny, 2); bx = nx; by = ny; } }
      }
      // the sea, tilting against the deck's roll, with heaving swells and whitecaps
      for (let xx = 0; xx < W; xx += 2) {
        const sw = Math.round(4 * Math.sin(xx * 0.03 + SW.frame * 0.05) + 3 * Math.sin(xx * 0.071 - SW.frame * 0.08)), hy = Math.round(H0 - tn * (xx - W / 2) + sw);
        R(ctx, '#163a38', xx, hy, 2, 270 - hy); R(ctx, '#3a7a6a', xx, hy, 2, 2); R(ctx, '#245450', xx, hy + 2, 2, 3); R(ctx, '#0e2626', xx, hy + 16, 2, 270 - hy - 16);
        if (((xx * 7 + 3) % 40) < 6) R(ctx, '#2a5a52', xx, hy + 9 + ((xx >> 3) % 5), 2, 1);   // wave lines
        if ((xx + Math.floor(SW.frame / 4) * 2) % 26 < 4 && sw > 2) R(ctx, '#c8fff0', xx, hy - 1, 2, 1);
      }
      for (let i = 0; i < 3; i++) {   // the wrecks of other ghost ships on the swell
        const sx = Math.round(60 + i * 170 - cx * 0.2), sy = Math.round(H0 - tn * (sx - W / 2) + 2);
        R(ctx, '#081214', sx - 14, sy - 6, 28, 6); R(ctx, '#081214', sx - 1, sy - 30, 2, 26); for (let k = 0; k < 14; k++) if (CZ.bayer(sx + k, sy) < 0.4) R(ctx, '#2a6a58', sx + 2 + (k >> 1), sy - 28 + k, 4, 1);
      }
    }
  });

  // ======================================================================================================
  // 14. THE MIDNIGHT CARNIVAL
  // ======================================================================================================
  const WHEEL = [304, 116], WR = 72, CAR_W = 48, OMEGA = Math.PI * 2 / 1500;
  const carPos = (s, i) => { const a = (s.c.ang || 0) + i * Math.PI / 2; return [WHEEL[0] + Math.cos(a) * WR, WHEEL[1] + Math.sin(a) * WR]; };
  CZ.add('cz_carnival', {
    name: 'The Midnight Carnival',
    twist: 'A haunted carnival. Ride the Ferris wheel cars; now and then the wheel lurches and spins fast.',
    theme: { style: 'plate', a: '#5a3a3a', b: '#4a2e2e', top: '#8a5a48', hi: '#e8c090', deep: '#1e1010', plat: '#c83a3a', sky: ['#0e0820', '#6a2a50'], haz: '#ffd84a', win: ['#ffd84a', '#ff3ea5', '#22d3ee'] },
    es: { 'The Midnight Carnival': 'El Carnaval de Medianoche', 'A haunted carnival. Ride the Ferris wheel cars; now and then the wheel lurches and spins fast.': 'Un carnaval embrujado. Súbete a las cabinas de la noria; de vez en cuando la noria da un tirón y gira deprisa.', 'THE WHEEL LURCHES': 'LA NORIA DA UN TIRÓN' },
    zh: { 'The Midnight Carnival': '午夜狂欢节', 'A haunted carnival. Ride the Ferris wheel cars; now and then the wheel lurches and spins fast.': '闹鬼的游乐园。站上摩天轮的车厢；摩天轮时不时会猛地加速旋转。', 'THE WHEEL LURCHES': '摩天轮猛转' },
    tiles(z) { z.plat(1, 10, 5); z.plat(32, 10, 5); },
    plats: () => [0, 1, 2, 3].map(i => CZ.plat(0, 0, CAR_W, 'car', { i })),
    paint(x, r) {
      CZ.sky(x, [[0, '#0e0820'], [80, '#1a0e34'], [150, '#2e1444'], [200, '#4a1e50'], [240, '#6a2a50'], [300, '#8a3a48']]);
      CZ.stars(x, r, 120, 512, 160, ['#ffffff', '#ffd8f0']);
      D(x, '#f0e8d0', 440, 54, 18); D(x, '#0e0820', 448, 50, 16);   // a thin crescent
      // a roller coaster's lattice far away
      const track = xx => 150 + 40 * Math.sin(xx * 0.02) + 20 * Math.sin(xx * 0.05);
      for (let xx = 0; xx < 512; xx++) { const t = Math.round(track(xx)); R(x, '#24123a', xx, t, 1, 3); if (xx % 12 === 0) { R(x, '#1a0c2c', xx, t + 3, 1, 260 - t); CZ.line(x, '#1a0c2c', xx, t + 3, xx + 12, Math.round(track(xx + 12)) + 30); } }
      // the big top
      CZ.pixels(x, 20, 120, 200, 140, (px, py) => {
        const dx = (px - 120) / 90, peak = 128 + Math.abs(dx) * 70 + 6 * Math.abs(Math.sin(dx * 9));
        if (Math.abs(dx) > 1 || py < peak) return null;
        const stripe = Math.floor((dx + 1) * 7 + (py - peak) * 0.015) % 2, lit = 1 - Math.abs(dx + 0.3) * 0.8 - (py - 128) / 260;
        return stripe ? CZ.ramp(['#4a0e1a', '#8a1a2a', '#c83a3a', '#e86a5a'], lit, px, py) : CZ.ramp(['#4a3a3a', '#8a7a6a', '#d8c8b0', '#fff0d8'], lit, px, py);
      });
      R(x, '#1e1010', 119, 112, 2, 18); for (let k = 0; k < 6; k++) R(x, '#ffd84a', 121, 112 + k, 6 - k, 1);   // the flag
      // a carousel, right
      R(x, '#2a1428', 380, 196, 96, 50); E(x, '#c83a3a', 428, 196, 52, 8); E(x, '#ffd84a', 428, 194, 46, 5); for (let k = 0; k < 18; k++) R(x, '#c83a3a', 428 - 2, 160 + k, 4, 1); E(x, '#8a1a2a', 428, 178, 28, 18);
      for (let i = 0; i < 6; i++) R(x, '#d8c8b0', 386 + i * 16, 200, 2, 40);
      // strings of bulbs swagged across
      for (let s0 = 0; s0 < 2; s0++) for (let xx = 0; xx < 512; xx += 6) { const y = Math.round(60 + s0 * 40 + 10 * Math.sin((xx % 128) / 128 * Math.PI)); R(x, '#2a1428', xx, y, 6, 1); if (xx % 12 === 0) R(x, ['#ffd84a', '#ff3ea5', '#22d3ee', '#7dff6a'][(xx / 12 + s0) % 4], xx, y + 1, 2, 2); }
    },
    floor(x, z, r) {   // the boardwalk, scattered with popcorn and ticket stubs
      R(x, '#4a2e2e', 0, FLOOR, z.pw, 48);
      for (let xx = 0; xx < z.pw; xx += 10) { R(x, '#5a3a3a', xx, FLOOR + 3, 9, 45); R(x, '#2a1414', xx + 9, FLOOR + 3, 1, 45); R(x, '#7a5048', xx, FLOOR + 3, 1, 45); }
      R(x, '#e8c090', 0, FLOOR, z.pw, 1); R(x, '#8a5a48', 0, FLOOR + 1, z.pw, 2);
      for (let i = 0; i < 30; i++) { const px = r() * z.pw | 0, py = FLOOR + 1 + (r() * 3 | 0); R(x, i % 3 ? '#fff0c8' : '#c83a3a', px, py, 2, i % 3 ? 1 : 2); }
      for (let yy = FLOOR + 26; yy < FLOOR + 48; yy++) for (let xx = 0; xx < z.pw; xx++) if (CZ.bayer(xx, yy) < (yy - FLOOR - 26) / 24) R(x, '#120808', xx, yy, 1, 1);
      // the wheel's A-frame legs, from the hub down to the boardwalk
      CZ.line(x, '#1e1010', WHEEL[0], WHEEL[1], WHEEL[0] - 60, FLOOR, 5); CZ.line(x, '#8a5a48', WHEEL[0], WHEEL[1], WHEEL[0] - 60, FLOOR, 2);
      CZ.line(x, '#1e1010', WHEEL[0], WHEEL[1], WHEEL[0] + 60, FLOOR, 5); CZ.line(x, '#8a5a48', WHEEL[0], WHEEL[1], WHEEL[0] + 60, FLOOR, 2);
      CZ.eachPlat(z, (px, py, pw) => {   // the roofs of two game booths, striped awnings below
        x.clearRect(px, py, pw, T);
        R(x, '#1e1010', px, py, pw, 5); R(x, '#8a5a48', px, py, pw, 3); R(x, '#e8c090', px, py, pw, 1);
        for (let i = 0; i < pw; i += 8) { R(x, (i / 8) % 2 ? '#c83a3a' : '#fff0d8', px + i, py + 5, 8, 6); R(x, (i / 8) % 2 ? '#c83a3a' : '#fff0d8', px + i + 2, py + 11, 4, 2); }
        for (const ex of [px + 2, px + pw - 4]) R(x, '#2a1414', ex, py + 13, 2, FLOOR - py - 13);
      });
    },
    init(s) { s.c.ang = s.c.ang || 0; s.c.lu = CZ.timer(() => 660 + Math.random() * 240, 70, 150, 600); s.c.w = OMEGA; },
    tick(s, z, on) {
      const c = s.c, h = c.lu;
      if (on) {
        const ev = CZ.step(h);
        if (ev === 'warn') CZ.banner(s, 'THE WHEEL LURCHES', '#ffd84a', 90);
        if (ev === 'go') { CZ.sfx('heavy'); fx.shake(3, 10); }
      } else if (h.run) h.run = false;
      const target = h.run ? OMEGA * (h.k < h.runT - 30 ? 4.2 : 1) : OMEGA;
      c.w += (target - c.w) * 0.06;
      c.ang = (c.ang + c.w) % (Math.PI * 2);
      for (const p of s.plats) if (p.kind === 'car') { const [px, py] = carPos(s, p.i); CZ.place(p, px - CAR_W / 2, py + 8); }
    },
    back(ctx, s, cx, cy) {
      const hx = WHEEL[0] - cx, hy = WHEEL[1] - cy, a0 = s.c.ang || 0;
      for (let i = 0; i < 12; i++) { const a = a0 + i * Math.PI / 6; CZ.line(ctx, '#3a2030', hx, hy, hx + Math.cos(a) * WR, hy + Math.sin(a) * WR, 2); }   // spokes
      art.ring(ctx, '#1e1010', hx, hy, WR + 1); art.ring(ctx, '#8a5a48', hx, hy, WR); art.ring(ctx, '#8a5a48', hx, hy, WR - 1); art.ring(ctx, '#3a2030', hx, hy, WR - 10);
      for (let i = 0; i < 24; i++) { const a = a0 + i * Math.PI / 12, on = (Math.floor(SW.frame / 8) + i) % 3 === 0; R(ctx, on ? ['#ffd84a', '#ff3ea5', '#22d3ee'][i % 3] : '#4a2a2a', Math.round(hx + Math.cos(a) * WR) - 1, Math.round(hy + Math.sin(a) * WR) - 1, 2, 2); }
      D(ctx, '#1e1010', hx, hy, 8); D(ctx, '#c83a3a', hx, hy, 6); D(ctx, '#ffd84a', hx, hy, 2);
      // fireworks now and then
      const ft = SW.frame % 300;
      if (ft < 50) { const fx0 = 100 + (Math.floor(SW.frame / 300) * 137) % 300 - cx * 0.2, fy0 = 50, col = ['#ffd84a', '#ff3ea5', '#22d3ee', '#7dff6a'][Math.floor(SW.frame / 300) % 4]; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, d = ft * 0.9; ctx.globalAlpha = 1 - ft / 50; R(ctx, col, Math.round(fx0 + Math.cos(a) * d), Math.round(fy0 + Math.sin(a) * d + ft * ft * 0.004), 2, 2); } ctx.globalAlpha = 1; }
    },
    drawPlat(ctx, p, x, y, s) {   // a car: hanger up to the pivot, floor, a low cage
      const px0 = x + CAR_W / 2;
      R(ctx, '#2a1414', px0 - 1, y - 8, 2, 8); D(ctx, '#ffd84a', px0, y - 8, 2);
      R(ctx, '#1e1010', x, y, CAR_W, 12); R(ctx, '#c83a3a', x + 1, y, CAR_W - 2, 10); R(ctx, '#e86a5a', x + 1, y, CAR_W - 2, 2); R(ctx, '#fff0d8', x, y, CAR_W, 1);
      for (let i = 4; i < CAR_W - 2; i += 8) R(ctx, '#ffd84a', x + i, y + 5, 3, 3);
      R(ctx, '#8a1a2a', x + 2, y + 10, CAR_W - 4, 2);
    }
  });

  // ======================================================================================================
  // 15. THE SUNKEN REEF
  // ======================================================================================================
  const TIDE_T = 1500, TIDE_LOW = FLOOR - 12, TIDE_HIGH = 30;
  const tideK = s => 0.5 - 0.5 * Math.cos((s.ct || 0) * Math.PI * 2 / TIDE_T);
  const waterY = s => (ST && ST.on ? Math.round(TIDE_LOW + (TIDE_HIGH - TIDE_LOW) * tideK(s)) : TIDE_LOW);
  const CORAL = ['#ff6a8a', '#ff9a4a', '#b46aff', '#5ad0c8'];
  CZ.add('cz_reef', {
    name: 'The Sunken Reef',
    twist: 'A tidal grotto. The tide rises and falls: under water everyone floats and falls slowly.',
    theme: { style: 'dirt', a: '#2a4a5a', b: '#223e4c', top: '#5a8a8a', hi: '#bff8ff', deep: '#0a1820', plat: '#5a6a5a', sky: ['#06121a', '#1a4a5a'], haz: '#5ad0e8', win: CORAL },
    es: { 'The Sunken Reef': 'El Arrecife Hundido', 'A tidal grotto. The tide rises and falls: under water everyone floats and falls slowly.': 'Una gruta de mareas. La marea sube y baja: bajo el agua todos flotan y caen despacio.', 'THE TIDE COMES IN': 'SUBE LA MAREA' },
    zh: { 'The Sunken Reef': '沉没珊瑚礁', 'A tidal grotto. The tide rises and falls: under water everyone floats and falls slowly.': '潮汐洞窟。潮水涨落：在水下，人人都会漂浮、缓慢下落。', 'THE TIDE COMES IN': '涨潮了' },
    tiles(z) { z.plat(4, 11, 6); z.plat(28, 11, 6); z.plat(15, 8, 8); z.plat(9, 5, 4); z.plat(25, 5, 4); },
    paint(x, r) {
      // the grotto: rock all round, a wide mouth open to a sunset sky
      CZ.sky(x, [[0, '#2a1a3a'], [40, '#6a2a4a'], [80, '#c85a4a'], [110, '#f0a060'], [130, '#1a4a5a'], [300, '#06121a']]);
      CZ.pixels(x, 0, 0, 512, 300, (px, py) => {
        const mouth = Math.hypot((px - 256) / 210, (py - 96) / 80) + 0.14 * CZ.fbm(px / 30, py / 30, 9, 3);
        if (mouth < 1) return null;
        const k = 0.75 - (mouth - 1) * 1.6 + 0.3 * CZ.fbm(px / 18, py / 18, 4, 3);
        return CZ.ramp(['#040c12', '#0a1c26', '#14303c', '#2a4a5a', '#4a7a7a'], k, px, py);
      });
      // coral and anemones growing up the lower rock
      for (let i = 0; i < 26; i++) {
        const bx = r() * 512 | 0, by = 200 + (r() * 60 | 0), col = CORAL[(r() * 4) | 0], h = 8 + (r() * 22 | 0);
        if (r() < 0.5) { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.35; CZ.line(x, CZ.mix(col, '#000000', 0.4), bx, by, bx + Math.cos(a) * h, by + Math.sin(a) * h, 2); CZ.line(x, col, bx, by - 1, bx + Math.cos(a) * h, by - 1 + Math.sin(a) * h, 1); D(x, CZ.mix(col, '#ffffff', 0.4), bx + Math.cos(a) * h, by + Math.sin(a) * h, 1); } }
        else { E(x, CZ.mix(col, '#000000', 0.4), bx, by, 8, 5); E(x, col, bx, by - 1, 7, 4); for (let k = 0; k < 4; k++) R(x, CZ.mix(col, '#ffffff', 0.5), bx - 5 + k * 3, by - 3, 1, 1); }
      }
      // a sunken stone head, half buried, mossy
      CZ.sprite(x, 404, 214, 90, 80, c => {
        c.fillStyle = '#5a6a6a'; c.beginPath(); c.ellipse(0, 4, 30, 34, -0.2, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#8a9a90'; c.beginPath(); c.ellipse(-8, -6, 18, 22, -0.2, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#2a3a3a'; c.fillRect(-16, -8, 10, 3); c.fillRect(4, -10, 10, 3); c.fillRect(-6, 4, 6, 10); c.fillRect(-12, 20, 18, 3);
        c.fillStyle = '#4a7a4a'; c.beginPath(); c.ellipse(-4, -30, 26, 8, -0.2, 0, Math.PI * 2); c.fill();
      }, ['#1a2a2a', '#2a3a3a', '#4a7a4a', '#5a6a6a', '#8a9a90', '#b8c8b8']);
      R(x, '#0a1c26', 0, 236, 512, 64);
    },
    floor(x, z, r) {   // sand and shells over rock
      R(x, '#8a7a5a', 0, FLOOR, z.pw, 48);
      for (let i = 0; i < 300; i++) R(x, r() < 0.5 ? '#a89a70' : '#6a5a40', r() * z.pw | 0, FLOOR + 3 + (r() * 30 | 0), 1, 1);
      for (let i = 0; i < 14; i++) { const sx = r() * z.pw | 0; E(x, '#f0d8c8', sx, FLOOR + 3, 3, 2); R(x, '#c89a88', sx - 1, FLOOR + 2, 1, 3); }
      R(x, '#d8c8a0', 0, FLOOR, z.pw, 1); R(x, '#b8a880', 0, FLOOR + 1, z.pw, 2);
      for (let yy = FLOOR + 24; yy < FLOOR + 48; yy++) for (let xx = 0; xx < z.pw; xx++) if (CZ.bayer(xx, yy) < (yy - FLOOR - 24) / 26) R(x, '#0a1820', xx, yy, 1, 1);
      CZ.eachPlat(z, (px, py, pw) => {   // rock ledges crusted with coral
        x.clearRect(px, py, pw, T);
        for (let i = 0; i < pw; i++) { const d = 5 + Math.round(3 * CZ.hash(i >> 2, py, 2)); R(x, '#0a1820', px + i, py + 2, 1, d + 2); R(x, '#2a4a5a', px + i, py + 2, 1, d); }
        R(x, '#5a8a8a', px, py, pw, 3); R(x, '#bff8ff', px, py, pw, 1);
        for (let i = 3; i < pw - 3; i += 7) { const col = CORAL[(px + i) % 4]; R(x, col, px + i, py - 2, 2, 2); R(x, CZ.mix(col, '#ffffff', 0.5), px + i, py - 2, 1, 1); }
      });
    },
    init(s) { s.c.inK = 0; },
    tick(s, z, on) {
      const k = tideK(s), c = s.c;
      if (on && k > 0.12 && c.inK <= 0.12 && Math.sin((s.ct || 0) * Math.PI * 2 / TIDE_T) > 0) CZ.banner(s, 'THE TIDE COMES IN', '#5ad0e8', 100);
      c.inK = k;
      if (!on) return;
      const wy = waterY(s);
      for (const p of CZ.fighters()) if (p.y - 14 > wy && s.ct % 9 === 0) CZ.part({ x: p.x + rnd(-4, 4), y: p.y - 26, vx: 0, vy: -0.8, life: 40, max: 40, col: '#d8f8ff', s: 1, a: 0.8 });
      if (s.ct % 7 === 0) { const vx0 = [100, 300, 500][(s.ct / 7 | 0) % 3]; if (wy < FLOOR - 10) CZ.part({ x: vx0 + rnd(-4, 4), y: FLOOR - 2, vx: rnd(-0.2, 0.2), vy: -0.7 - Math.random() * 0.5, life: Math.min(160, (FLOOR - wy) / 1.1), max: 160, col: '#bff8ff', s: 1, a: 0.7 }); }   // bubbles from vents
    },
    move(a, s) {   // under water you float: gravity is weaker and you sink slowly
      if (a.onGround || a.y - 14 <= waterY(s)) return 0;
      a.vy -= GRAV * 0.5; if (a.vy > 3.2) a.vy = 3.2;
      return 0;
    },
    back(ctx, s, cx) {
      // kelp swaying up from the floor of the grotto
      for (let i = 0; i < 9; i++) {
        const bx = Math.round((i * 61 + 20) - cx * 0.5), h = 60 + (i * 23) % 60;
        for (let k = 0; k < h; k += 3) { const sw = Math.round(Math.sin(SW.frame * 0.03 + i + k * 0.06) * k * 0.08); R(ctx, k % 9 < 3 ? '#3a7a3a' : '#2a5a2a', bx + sw, 222 - k, 3, 3); if (k % 12 === 0) R(ctx, '#5a9a4a', bx + sw + 3, 222 - k, 3, 2); }
      }
      // the anglerfish, lurking in the dark at the left, its lure swinging
      const ax = Math.round(40 - cx * 0.35 + Math.sin(SW.frame * 0.008) * 10), ay = Math.round(150 + Math.sin(SW.frame * 0.013) * 6);
      CZ.sprite(ctx, ax, ay, 110, 80, c => {
        c.fillStyle = '#14242c'; c.beginPath(); c.ellipse(0, 8, 40, 26, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(-34, 8); c.lineTo(-54, -8); c.lineTo(-50, 24); c.closePath(); c.fill();
        c.fillStyle = '#081418'; c.beginPath(); c.moveTo(38, 4); c.quadraticCurveTo(20, 30, -4, 28); c.lineTo(38, 14); c.closePath(); c.fill();
        c.fillStyle = '#e8f0e8'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(34 - i * 6, 8); c.lineTo(31 - i * 6, 14); c.lineTo(28 - i * 6, 8); c.fill(); }
        c.fillStyle = '#d8f8ff'; c.fillRect(16, -6, 4, 4);
      }, ['#040a0c', '#081418', '#14242c', '#2a4a5a', '#d8f8ff', '#e8f0e8']);
      const lx = ax + 44 + Math.round(Math.sin(SW.frame * 0.05) * 6), ly = ay - 32;
      CZ.line(ctx, '#14242c', ax + 18, ay - 14, lx, ly, 1);
      art.glow(ctx, lx, ly, 20, '#bfff8a', 0.25); D(ctx, '#eaffc8', lx, ly, 2);
    },
    front(ctx, s, cx, cy) {   // the water over everything below the tide line
      const wy = waterY(s) - cy;
      if (wy >= 270) return;
      ctx.globalAlpha = 0.22; R(ctx, '#1a7a9a', 0, wy, W, 270 - wy);
      ctx.globalAlpha = 0.12; for (let i = 0; i < 6; i++) { const bx = ((i * 97 + SW.frame * 0.4) % (W + 80)) - 40; for (let y = wy; y < 270; y += 2) R(ctx, '#bff8ff', Math.round(bx + (y - wy) * 0.4), y, 8, 2); }   // light shafts
      ctx.globalAlpha = 0.9;
      for (let xx = 0; xx < W; xx += 2) { const wv = Math.round(Math.sin(xx * 0.08 + SW.frame * 0.09) * 1.5 + Math.sin(xx * 0.03 - SW.frame * 0.05)); R(ctx, '#bff8ff', xx, wy + wv, 2, 1); R(ctx, '#5ad0e8', xx, wy + wv + 1, 2, 1); }
      ctx.globalAlpha = 1;
    }
  });
})();
