'use strict';
// Shattered Worlds — crazy Versus stages, part 2: strange lands (see crazy-core.js for how a stage is put together).
//   The Giant's Table      tiny fighters on a giant's dinner table; the giant flicks marbles across: jump them
//   The Dragon's Hoard     a dragon asleep on its gold wakes and breathes fire, low (climb) or high (get down)
//   The Singing Dunes      a great worm follows one fighter under the sand, then bursts up where it trembles
//   The Frozen Mirror      a frozen lake under the aurora: the ice is slippery
//   The Midnight Express   the roof of a speeding train; low bridges sweep the air above it
(function () {
  const SW = window.SW, CZ = SW.crazy;
  if (!CZ) return;
  const art = SW.art, fx = SW.fx, T = 16, FLOOR = CZ.FLOOR, W = CZ.W;
  const R = CZ.rect, D = CZ.disc, E = CZ.ellipse;
  const rnd = SW.rand;

  // ======================================================================================================
  // 6. THE GIANT'S TABLE
  // ======================================================================================================
  const MR = 11, MV = 4.6;   // the marble's radius and speed
  const SKIN = ['#3a1a18', '#6a3a2a', '#a8664a', '#d89a74', '#f0c8a0', '#fff0d8'];
  function candle(x, cx, base, h, w) {
    R(x, '#8a7048', cx - w / 2 - 1, base - h, w + 2, h); R(x, '#e8d8b0', cx - w / 2, base - h, w, h); R(x, '#fff4d8', cx - w / 2 + 2, base - h, 2, h); R(x, '#b8a070', cx + w / 2 - 3, base - h, 3, h);
    for (let i = 0; i < 4; i++) { const dx = cx - w / 2 + 2 + i * (w / 4), dl = 6 + ((i * 7) % 11); R(x, '#f0e4c4', dx, base - h, 3, dl); D(x, '#f0e4c4', dx + 1, base - h + dl, 1); }
    R(x, '#2a2018', cx - 1, base - h - 5, 2, 5);   // the wick
    E(x, '#c8a060', cx, base, w / 2 + 6, 3); E(x, '#e8c888', cx, base - 1, w / 2 + 4, 2);   // a brass dish
  }
  CZ.add('cz_table', {
    name: "The Giant's Table",
    twist: "You are tiny on a giant's table. The giant flicks marbles across it: jump over them.",
    theme: { style: 'plate', a: '#b83a3a', b: '#a03030', top: '#f0e0d0', hi: '#ffffff', deep: '#4a1818', plat: '#d8a850', sky: ['#1a0e0a', '#4a2a18'], haz: '#8ab8ff', win: ['#ffd890'] },
    es: { "The Giant's Table": 'La Mesa del Gigante', "You are tiny on a giant's table. The giant flicks marbles across it: jump over them.": 'Eres diminuto sobre la mesa de un gigante. El gigante lanza canicas rodando: sáltalas.', 'MARBLE! JUMP IT': '¡CANICA! SÁLTALA' },
    zh: { "The Giant's Table": '巨人的餐桌', "You are tiny on a giant's table. The giant flicks marbles across it: jump over them.": '你在巨人的餐桌上只有一丁点大。巨人会弹出弹珠滚过桌面：跳过去！', 'MARBLE! JUMP IT': '弹珠来了！快跳！' },
    tiles(z) { z.plat(4, 11, 5); z.plat(29, 11, 5); z.plat(15, 8, 8); },
    paint(x, r) {
      // the giant's dining hall, dark wood lit by candles
      CZ.sky(x, [[0, '#120806'], [80, '#22120a'], [170, '#3a2012'], [240, '#4a2a16'], [300, '#5a3418']]);
      for (let xx = 0; xx < 512; xx += 64) { R(x, '#1a0c06', xx, 0, 2, 240); R(x, '#5a3418', xx + 2, 0, 1, 240); R(x, '#2e1a0e', xx + 8, 20, 48, 90); R(x, '#4a2a16', xx + 8, 20, 48, 1); R(x, '#1a0c06', xx + 8, 110, 48, 1); }
      // a tall window with the moon
      R(x, '#120806', 60, 18, 64, 110); R(x, '#16224a', 64, 22, 56, 102); CZ.ditherRect(x, '#16224a', '#2a3a6a', 64, 60, 56, 64); R(x, '#3a2414', 90, 22, 4, 102); R(x, '#3a2414', 64, 68, 56, 3);
      D(x, '#e8ecf8', 104, 44, 9); D(x, '#ffffff', 102, 42, 5);
      // the giant's things on the far side of the table: a goblet, a loaf, a cheese wheel, a fork standing in a pie
      const ty = 238;
      R(x, '#2a1408', 0, ty, 512, 62); R(x, '#d8c8b8', 0, ty - 2, 512, 3); R(x, '#a8382e', 0, ty + 1, 512, 61);   // the far edge of the cloth
      E(x, '#4a2a10', 160, ty, 34, 4); E(x, '#c88a3a', 160, ty - 14, 32, 14); E(x, '#e8b060', 154, ty - 20, 22, 8); E(x, '#fff0c0', 146, ty - 24, 8, 2);   // the loaf
      for (let i = 0; i < 4; i++) R(x, '#8a5a20', 140 + i * 12, ty - 24 + (i % 2) * 2, 2, 10);
      // the goblet
      const gx = 300; R(x, '#8a8a9a', gx - 3, ty - 40, 6, 40); E(x, '#8a8a9a', gx, ty - 1, 18, 3); E(x, '#c8c8d8', gx, ty - 2, 14, 2);
      CZ.pixels(x, gx - 30, ty - 110, 60, 72, (px, py) => { const dx = (px - gx) / 28, dy = (py - (ty - 74)) / 36; if (dy < -1 || dy > 1 || Math.abs(dx) > 1 - Math.max(0, dy) * 0.75) return null; const liquid = py > ty - 92; const k = 1 - dx * 0.6 - 0.2 + (Math.abs(dx) > 0.85 - Math.max(0, dy) * 0.75 ? -0.4 : 0); return liquid ? CZ.ramp(['#2a0410', '#5a0a1e', '#8a1a30', '#c84a5a'], k * 0.8, px, py) : CZ.ramp(['#4a4a5a', '#8a8a9a', '#c8c8d8', '#ffffff'], k, px, py); });
      R(x, '#ffffff', gx - 20, ty - 104, 2, 14);
      // the cheese wheel, a wedge cut out
      CZ.pixels(x, 380, ty - 46, 96, 48, (px, py) => { const dx = (px - 428) / 46, dy = (py - (ty - 22)) / 22; if (dx * dx + dy * dy > 1) return null; if (dx > 0.1 && dy < 0 && dy > -dx * 1.4) return null; const rind = dx * dx + dy * dy > 0.82; return rind ? (dy < 0 ? '#e8a830' : '#b87818') : ((px * 7 + py * 3) % 23 === 0 ? '#c89828' : CZ.ramp(['#d8a838', '#f0c850', '#fff0a0'], 0.8 - dy * 0.4, px, py)); });
      // a fork standing upright in a pie, far right
      E(x, '#8a5a28', 488, ty - 8, 28, 10); E(x, '#d89a48', 488, ty - 12, 26, 7); for (let i = 0; i < 5; i++) R(x, '#a86a28', 470 + i * 8, ty - 14, 3, 1);
      R(x, '#8a8a9a', 494, ty - 120, 5, 110); R(x, '#c8c8d8', 494, ty - 120, 1, 110); for (let i = 0; i < 4; i++) R(x, '#b8b8c8', 486 + i * 6, ty - 150, 2, 32); R(x, '#8a8a9a', 486, ty - 122, 22, 4);
      // three tall candles, flames drawn live
      for (const [cx0, h, w] of [[34, 150, 16], [232, 120, 14], [356, 170, 18]]) candle(x, cx0, ty, h, w);
    },
    floor(x, z, r) {   // a red and cream checked tablecloth, with crumbs
      for (let xx = 0; xx < z.pw; xx += 12) for (let yy = 0; yy < 48; yy += 12) {
        const odd = ((xx / 12) + (yy / 12)) % 2, both = (xx / 12) % 2 && (yy / 12) % 2;
        R(x, both ? '#8a2424' : odd ? '#c84040' : '#f0e0d0', xx, FLOOR + yy, 12, 12);
      }
      R(x, '#ffffff', 0, FLOOR, z.pw, 1);
      for (let yy = FLOOR + 26; yy < FLOOR + 48; yy++) for (let xx = 0; xx < z.pw; xx++) if (CZ.bayer(xx, yy) < (yy - FLOOR - 26) / 30) R(x, '#3a0e0e', xx, yy, 1, 1);
      for (let i = 0; i < 8; i++) { const fx0 = r() * z.pw | 0; CZ.line(x, '#a03030', fx0, FLOOR + 2, fx0 + 6, FLOOR + 40); }   // folds
      for (let i = 0; i < 30; i++) { const cx0 = r() * z.pw | 0, cy0 = FLOOR + 1 + (r() * 6 | 0); R(x, '#d8a850', cx0, cy0, 2, 1); R(x, '#8a5a20', cx0, cy0 + 1, 2, 1); }
      CZ.eachPlat(z, (px, py, pw) => {   // crackers
        x.clearRect(px, py, pw, T);
        R(x, '#8a5a20', px, py, pw, 6); R(x, '#d8a850', px, py, pw, 5); R(x, '#f0d080', px, py, pw, 1); R(x, '#a87830', px, py + 5, pw, 1);
        for (let i = 4; i < pw - 2; i += 7) { R(x, '#a87830', px + i, py + 2, 1, 1); R(x, '#a87830', px + i + 3, py + 3, 1, 1); }
        for (let i = 0; i < pw; i += 4) R(x, '#f0d080', px + i, py - 1, 2, 1);   // the scalloped edge
      });
    },
    init(s) { s.c.mb = CZ.timer(() => 460 + Math.random() * 200, 80, 9999, 360); s.c.dir = Math.random() < 0.5 ? 1 : -1; s.c.ball = null; },
    tick(s, z, on) {
      const c = s.c, h = c.mb;
      if (c.ball) {
        const b = c.ball;
        b.x += c.dir * MV; b.a += MV / MR;
        if (s.ct % 3 === 0) fx.shake(1, 3);
        for (const f of CZ.fightersF()) {
          const p = f.p;
          if (b.hit.has(p) || Math.abs(p.x - b.x) > MR + 5 || p.y < FLOOR - 2 * MR + 2) continue;
          b.hit.add(p); CZ.hit(f, { dmg: 10, kx: c.dir * 5.5, ky: -5, stun: 30, down: true, heavy: true, srcX: b.x - c.dir * 10 }); CZ.spark(p.x, p.y - 10, '#bfe0ff', 12, 3); CZ.sfx('heavy');
        }
        if (b.x < -40 || b.x > z.pw + 40) { c.ball = null; h.run = false; h.next = typeof h.gap === 'function' ? h.gap() : h.gap; }
        return;
      }
      if (!on) return;
      const ev = CZ.step(h);
      if (ev === 'warn') { c.dir = -c.dir; CZ.banner(s, 'MARBLE! JUMP IT', '#8ab8ff', 90); }
      if (ev === 'go') { c.ball = { x: c.dir > 0 ? -MR - 4 : z.pw + MR + 4, a: 0, hit: new Set(), heed: null }; CZ.sfx('dash'); }
    },
    bot(p, f, s) {   // jump the marble as it comes
      const b = s.c.ball;
      if (!b || !CZ.heeds(f, b)) return;
      const rel = (p.x - b.x) * s.c.dir;   // how far ahead of the marble (it is coming when > 0)
      if (CZ.onFloor(p) && rel > 30 && rel < 170) CZ.quiet();   // finish what it's doing, start nothing new
      if (CZ.onFloor(p) && rel > 30 && rel < 76) CZ.press('jump');
      if (!p.onGround && rel > -24 && rel < 84) SW.input.now.jump = true;   // hold it for the full height
    },
    back(ctx, s, cx) {
      for (const [bx, h] of [[34, 150], [232, 120], [356, 170]]) {   // candle flames
        const fx0 = Math.round(bx - cx * 0.25), fy0 = 238 - 30 - h - 6, fl = Math.sin(SW.frame * 0.3 + bx) * 1.5;
        art.glow(ctx, fx0, fy0 - 4, 30, '#ffb040', 0.12);
        E(ctx, '#ff8a20', fx0 + fl * 0.5, fy0 - 3, 4, 7); E(ctx, '#ffd060', fx0 + fl * 0.3, fy0 - 2, 3, 5); E(ctx, '#fff8e0', fx0, fy0, 1, 3);
      }
      // the giant's eye, peering down from above the window: it follows the fight and blinks
      const ex = Math.round(392 - cx * 0.18), ey = 42, A = SW.game.cam.x + W / 2 - 304, look = SW.clamp(A / 60, -1, 1);
      const bl = SW.frame % 260, shut = bl < 8 ? 1 - Math.abs(bl - 4) / 4 : 0;
      CZ.sprite(ctx, ex, ey, 140, 70, c => {
        c.fillStyle = SKIN[3]; c.beginPath(); c.ellipse(0, 4, 66, 34, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = SKIN[2]; c.beginPath(); c.ellipse(0, 18, 60, 16, 0, 0, Math.PI); c.fill();
        c.fillStyle = SKIN[1]; c.fillRect(-56, -26, 112, 8);   // the brow
        c.fillStyle = '#f0ece0'; c.beginPath(); c.ellipse(0, 4, 40, 16 * (1 - shut) + 0.5, 0, 0, Math.PI * 2); c.fill();
        if (shut < 0.7) { c.fillStyle = '#6a4020'; c.beginPath(); c.arc(look * 18, 6, 12, 0, Math.PI * 2); c.fill(); c.fillStyle = '#100808'; c.beginPath(); c.arc(look * 18, 6, 6, 0, Math.PI * 2); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(look * 18 - 5, 1, 3, 3); }
        c.fillStyle = SKIN[4]; c.beginPath(); c.ellipse(0, -10 + 12 * shut, 42, 6, 0, Math.PI, Math.PI * 2); c.fill();   // the lid
      }, ['#2a1410', '#6a3a2a', '#a8664a', '#d89a74', '#f0c8a0', '#f0ece0', '#6a4020', '#100808', '#ffffff']);
    },
    mid(ctx, s, cx, cy) {
      const c = s.c, h = c.mb, fy = FLOOR - cy;
      if (h && h.warn > 0) {   // a giant fingertip at the edge, drawing back for the flick
        const k = 1 - h.warn / h.warnT, side = c.dir, pull = Math.round(k < 0.8 ? k / 0.8 * 18 : 18 - (k - 0.8) / 0.2 * 30);
        const edge = side > 0 ? 0 - cx : (SW.versus.zone.pw) - cx, fx0 = edge + side * (10 - pull);
        CZ.sprite(ctx, Math.round(fx0), fy - 16, 120, 40, cc => {
          cc.scale(side, 1);
          cc.fillStyle = SKIN[3]; cc.beginPath(); cc.ellipse(-30, 0, 46, 15, 0, 0, Math.PI * 2); cc.fill();
          cc.fillStyle = SKIN[2]; cc.fillRect(-70, 4, 70, 10);
          cc.fillStyle = '#f8e0d8'; cc.beginPath(); cc.ellipse(4, -2, 9, 7, 0, 0, Math.PI * 2); cc.fill();   // the nail
          cc.fillStyle = SKIN[1]; cc.fillRect(-40, -6, 2, 10); cc.fillRect(-46, -5, 2, 9);
        }, SKIN.slice(0, 5).concat(['#f8e0d8']));
        const bx = Math.round(edge + side * 30);   // the marble waiting
        drawMarble(ctx, bx, fy - MR, 0);
      }
      if (c.ball) drawMarble(ctx, Math.round(c.ball.x - cx), fy - MR, c.ball.a);
    }
  });
  function drawMarble(ctx, x, y, a) {
    D(ctx, '#0a1838', x, y, MR + 1); D(ctx, '#2a5ab8', x, y, MR); D(ctx, '#5a8ae0', x - 2, y - 2, MR - 3);
    for (let i = 0; i < 3; i++) { const t = a + i * 2.1, sx = Math.round(x + Math.cos(t) * 5), sy = Math.round(y + Math.sin(t) * 5); D(ctx, i ? '#ff5a5a' : '#ffd84a', sx, sy, 2); }
    R(ctx, '#ffffff', x - 5, y - 6, 3, 2); R(ctx, '#bfe0ff', x - 6, y - 4, 1, 2);
  }

  // ======================================================================================================
  // 7. THE DRAGON'S HOARD
  // ======================================================================================================
  const DRAGON = ['#140a14', '#3a1222', '#6a1e2e', '#9a2e36', '#c8503a', '#e8a060', '#ffe8a0', '#ffffff'];
  const LOWB = 34, HIGHB = 62;   // the low fire's height; the high fire reaches down to this far above the floor
  function dragonHead(c, open, eye) {
    c.fillStyle = DRAGON[2];
    c.beginPath(); c.moveTo(-60, -6); c.quadraticCurveTo(-30, -22, 10, -22); c.lineTo(40, -30); c.lineTo(46, -12); c.quadraticCurveTo(56, 4, 44, 22); c.lineTo(-4, 16); c.quadraticCurveTo(-40, 12, -60, 4); c.closePath(); c.fill();   // skull and snout
    c.beginPath(); c.moveTo(-56, 6 + open * 0.3); c.quadraticCurveTo(-20, 18 + open, 30, 26 + open * 0.4); c.lineTo(36, 34 + open * 0.2); c.quadraticCurveTo(-10, 30 + open, -58, 12 + open * 0.5); c.closePath(); c.fill();   // the jaw
    c.fillStyle = DRAGON[1]; c.beginPath(); c.moveTo(10, -20); c.lineTo(48, -46); c.lineTo(58, -44); c.lineTo(24, -14); c.closePath(); c.fill();   // the horns
    c.beginPath(); c.moveTo(22, -24); c.lineTo(70, -40); c.lineTo(72, -34); c.lineTo(30, -16); c.closePath(); c.fill();
    c.fillStyle = DRAGON[4]; c.beginPath(); c.moveTo(-56, -6); c.quadraticCurveTo(-30, -19, 8, -19); c.lineTo(8, -15); c.quadraticCurveTo(-30, -14, -56, -2); c.closePath(); c.fill();   // light along the brow ridge
    c.fillStyle = DRAGON[3]; for (let i = 0; i < 5; i++) c.fillRect(-40 + i * 14, -2, 8, 3);   // scales
    if (open > 2) { c.fillStyle = '#ffd060'; c.beginPath(); c.moveTo(-54, 6); c.quadraticCurveTo(-20, 14 + open * 0.5, 26, 22 + open * 0.2); c.lineTo(-52, 10 + open * 0.5); c.closePath(); c.fill(); c.fillStyle = '#ffffff'; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-48 + i * 12, 6); c.lineTo(-45 + i * 12, 12); c.lineTo(-42 + i * 12, 6); c.fill(); } }
    if (eye > 0) { c.fillStyle = '#ffd84a'; c.beginPath(); c.ellipse(4, -8, 7, 3 * eye + 0.5, -0.2, 0, Math.PI * 2); c.fill(); c.fillStyle = '#140a14'; c.fillRect(3, -11, 2, 6); }
    else { c.fillStyle = DRAGON[0]; c.fillRect(-2, -8, 12, 2); }
    c.fillStyle = DRAGON[0]; c.fillRect(-56, -4, 3, 2);   // the nostril
  }
  CZ.add('cz_hoard', {
    name: "The Dragon's Hoard",
    twist: 'A dragon sleeps on its gold. It wakes and breathes fire, low (climb up) or high (get down).',
    theme: { style: 'dirt', a: '#a87818', b: '#8a6010', top: '#ffd84a', hi: '#fff0a0', deep: '#3a2408', plat: '#5a4a48', sky: ['#0e0608', '#2a1410'], haz: '#ff8a30', win: ['#ffd84a'] },
    es: { "The Dragon's Hoard": 'El Tesoro del Dragón', 'A dragon sleeps on its gold. It wakes and breathes fire, low (climb up) or high (get down).': 'Un dragón duerme sobre su oro. Despierta y escupe fuego bajo (sube) o alto (baja).', 'FIRE LOW: CLIMB!': '¡FUEGO BAJO: SUBE!', 'FIRE HIGH: GET DOWN!': '¡FUEGO ALTO: BAJA!' },
    zh: { "The Dragon's Hoard": '巨龙宝库', 'A dragon sleeps on its gold. It wakes and breathes fire, low (climb up) or high (get down).': '巨龙睡在金山上。它醒来会喷火：低处喷火就爬上去，高处喷火就下到地面。', 'FIRE LOW: CLIMB!': '低处喷火：快爬上去！', 'FIRE HIGH: GET DOWN!': '高处喷火：快下来！' },
    tiles(z) { z.plat(4, 11, 6); z.plat(28, 11, 6); z.plat(15, 8, 8); },
    paint(x, r) {
      CZ.sky(x, [[0, '#0a0406'], [90, '#160a0c'], [170, '#2a1410'], [230, '#4a2a14'], [300, '#6a4018']]);
      // stalactites, lit warm from below by the gold
      for (let i = 0; i < 26; i++) { const sx = r() * 512, h = 20 + r() * 70, w = 6 + r() * 14; for (let yy = 0; yy < h; yy++) { const ww = Math.max(1, Math.round(w * (1 - yy / h))); R(x, '#1e1014', Math.round(sx - ww / 2), yy, ww, 1); R(x, '#5a3420', Math.round(sx - ww / 2), yy, 1, 1); } }
      // the dragon's coils across the back, scaled
      CZ.pixels(x, 0, 120, 512, 140, (px, py) => {
        const c1 = Math.abs(py - (190 + 26 * Math.sin(px * 0.018))) - 22, c2 = Math.abs(py - (226 + 14 * Math.sin(px * 0.03 + 2))) - 16;
        const d = Math.min(c1, px > 180 ? c2 : 99);
        if (d > 0) return null;
        const row = Math.floor(py / 6), u = (px + (row % 2) * 5) % 10, v = py % 6, du = Math.abs(u - 4.5) / 4.5;   // overlapping round scales: lit at the top middle, dark at the rim below
        const sc = 0.4 * (1 - v / 5) - 0.35 * du * du - (v >= 5 - du * 2 ? 0.45 : 0);
        const k = (-d / 22) * 0.75 + sc + (py < 190 + 26 * Math.sin(px * 0.018) - 12 ? 0.15 : 0);
        return CZ.ramp(DRAGON.slice(0, 5), k, px, py);
      });
      for (let xx = 0; xx < 512; xx += 14) { const y = Math.round(190 + 26 * Math.sin(xx * 0.018) - 22); R(x, DRAGON[1], xx, y - 7, 5, 7); R(x, DRAGON[4], xx + 1, y - 7, 1, 5); }   // spines
      // mountains of gold: coins, cups, a crown, a sword in the pile
      const pile = (cx0, cy0, rw, rh) => CZ.pixels(x, cx0 - rw, cy0 - rh, rw * 2, rh + 60, (px, py) => { const dx = (px - cx0) / rw, top = cy0 - rh * (1 - dx * dx) - 3 * CZ.noise(px / 4, cy0, 2); if (Math.abs(dx) > 1 || py < top) return null; const coin = CZ.hash(px >> 1, py >> 1, 4); return coin > 0.93 ? '#fff0a0' : coin < 0.05 ? '#6a4008' : CZ.ramp(['#5a3a08', '#8a6010', '#c89a28', '#ffd84a'], 1 - (py - top) / 40 - dx * 0.3, px, py); });
      pile(80, 236, 90, 40); pile(260, 250, 120, 34); pile(440, 240, 100, 44);
      R(x, '#c8c8d8', 300, 176, 3, 50); R(x, '#ffffff', 300, 176, 1, 50); R(x, '#8a6010', 292, 222, 19, 3); R(x, '#ffd84a', 299, 225, 5, 10); D(x, '#ff3a3a', 301, 223, 1);   // the sword
      R(x, '#ffd84a', 120, 196, 18, 7); for (let i = 0; i < 4; i++) R(x, '#ffd84a', 120 + i * 5, 190, 3, 6); R(x, '#ff3a5a', 124, 198, 2, 2); R(x, '#3a8aff', 131, 198, 2, 2);   // a crown
      R(x, '#c89a28', 420, 186, 10, 12); R(x, '#ffd84a', 420, 186, 10, 2); R(x, '#c89a28', 423, 198, 4, 6); R(x, '#c89a28', 419, 204, 12, 2);   // a cup
    },
    floor(x, z, r) {   // a floor of coins
      R(x, '#8a6010', 0, FLOOR, z.pw, 48);
      for (let i = 0; i < 900; i++) { const cx0 = r() * z.pw | 0, cy0 = FLOOR + 2 + (r() * 46 | 0), k = (cy0 - FLOOR) / 48; E(x, k > 0.6 ? '#6a4808' : '#c89a28', cx0, cy0, 3, 1); R(x, k > 0.6 ? '#a87818' : '#ffd84a', cx0 - 1, cy0 - 1, 2, 1); }
      R(x, '#fff0a0', 0, FLOOR, z.pw, 1);
      for (let i = 0; i < 30; i++) R(x, ['#ff3a5a', '#3aff8a', '#3a8aff', '#ffffff'][i % 4], r() * z.pw | 0, FLOOR + 2 + (r() * 20 | 0), 2, 2);
      for (let yy = FLOOR + 30; yy < FLOOR + 48; yy++) for (let xx = 0; xx < z.pw; xx++) if (CZ.bayer(xx, yy) < (yy - FLOOR - 30) / 22) R(x, '#2a1806', xx, yy, 1, 1);
      CZ.eachPlat(z, (px, py, pw) => {   // stone ledges trimmed with gold
        x.clearRect(px, py, pw, T);
        R(x, '#2a1e1e', px, py, pw, 7); R(x, '#5a4a48', px, py, pw, 5); R(x, '#8a7a70', px, py, pw, 1); R(x, '#ffd84a', px, py + 5, pw, 1);
        for (let i = 6; i < pw - 4; i += 12) R(x, '#3a2e2e', px + i, py + 1, 1, 4);
      });
    },
    init(s) { s.c.br = CZ.timer(() => 600 + Math.random() * 200, 110, 116, 420); s.c.low = Math.random() < 0.5; s.c.hit = new Set(); s.c.eye = 0; },
    tick(s, z, on) {
      const c = s.c, h = c.br;
      c.eye = h.warn > 0 || h.run ? Math.min(1, c.eye + 0.08) : Math.max(0, c.eye - 0.02);
      if (!on) { s.floorHaz = s.highHaz = null; return; }
      const ev = CZ.step(h);
      if (ev === 'warn') { c.low = !c.low; CZ.banner(s, c.low ? 'FIRE LOW: CLIMB!' : 'FIRE HIGH: GET DOWN!', '#ff8a30', 110); CZ.sfx('roar'); }
      s.floorHaz = c.low ? h : null; s.highHaz = c.low ? null : h;
      if (ev === 'go') { c.hit = new Set(); CZ.sfx('explode'); fx.shake(4, 16); }
      if (h.run) {
        const front = Math.max(-20, z.pw - h.k * 8);
        if (h.k < h.runT - 10) for (const f of CZ.fightersF()) {
          const p = f.p;
          if (c.hit.has(p) || p.x < front - 4) continue;
          const inBand = c.low ? p.y > FLOOR - LOWB : p.y - p.h < FLOOR - HIGHB;
          if (!inBand) continue;
          c.hit.add(p); CZ.hit(f, { dmg: 11, kx: -4, ky: c.low ? -4 : 2, stun: 28, down: true, srcX: p.x + 20 }); CZ.spark(p.x, p.y - 16, '#ffb040', 12, 3);
        }
        if (s.ct % 2 === 0) CZ.part({ x: front + Math.random() * 40, y: c.low ? FLOOR - Math.random() * LOWB : 40 + Math.random() * (FLOOR - HIGHB - 40), vx: -1 - Math.random() * 2, vy: -0.6 - Math.random(), life: 26, max: 26, col: Math.random() < 0.5 ? '#ffd060' : '#ff6a20', s: 2 });
      }
    },
    back(ctx, s, cx) {
      const c = s.c, h = c.br, hx = Math.round(452 - cx * 0.25), hy = 124 + Math.round(Math.sin(SW.frame * 0.02) * 2) - (c.eye * 10 | 0);
      const open = h && h.run ? Math.min(14, h.k * 2, (h.runT - h.k)) : h && h.warn > 0 && h.warn < 30 ? 4 : 0;
      if (c.eye > 0.3) art.glow(ctx, hx - 50, hy + 8, 40, '#ff8a30', 0.08 * c.eye + (h && h.warn > 0 ? 0.06 : 0));
      CZ.sprite(ctx, hx, hy, 160, 110, cc => dragonHead(cc, open, c.eye), DRAGON.concat(['#ffd060', '#ffd84a']));
      if (!c.eye && SW.frame % 90 < 40) CZ.part({ x: SW.game.cam.x + hx - 58, y: hy + 2 + SW.game.cam.y, vx: -0.2, vy: -0.4, life: 40, max: 40, col: '#5a4a48', s: 2, a: 0.5 });   // smoke from the nostril while it sleeps
    },
    mid(ctx, s, cx, cy) {
      const c = s.c, h = c.br; if (!h) return;
      const fy = FLOOR - cy, y0 = c.low ? fy - LOWB : 40 - cy, y1 = c.low ? fy : fy - HIGHB;
      if (h.warn > 0 && CZ.blink(h, 20)) { ctx.globalAlpha = 0.25; R(ctx, '#ff6a20', 0, y0, W, y1 - y0); ctx.globalAlpha = 0.7; R(ctx, '#ffd060', 0, c.low ? y0 : y1 - 1, W, 1); ctx.globalAlpha = 1; }
      if (!h.run) return;
      const front = Math.max(-20, SW.versus.zone.pw - h.k * 8) - cx, fade = Math.min(1, (h.runT - h.k) / 12);
      ctx.globalAlpha = fade;
      // the breath: rows of flame streaming leftward, white-hot along the middle of the band, red and broken at its edges
      for (let y = y0; y < y1; y += 3) {
        const mid = (y - y0) / Math.max(1, y1 - y0), heat = 1 - Math.abs(mid - 0.5) * 2, n = CZ.noise(y * 0.13, SW.frame * 0.25, 7);
        if (heat < 0.25 && n < 0.45) continue;   // ragged top and bottom
        const col = heat > 0.75 ? '#fff0a0' : heat > 0.5 ? '#ffd060' : heat > 0.25 ? '#ff8a30' : '#c83a18';
        let xx = Math.max(0, Math.round(front + 6 + n * 22 - heat * 10));   // the hottest rows lead
        while (xx < W) {
          const len = 8 + ((xx * 7 + y * 13 + SW.frame * 11) % 26);
          R(ctx, col, xx, y, len, 3);
          if (heat > 0.5) R(ctx, '#ffffff', xx, y + 1, Math.min(len, 3), 1);
          xx += len + (((xx >> 2) + y + SW.frame * 3) % 9 < 2 ? 4 : 0);
        }
      }
      art.glow(ctx, Math.round(front) + 40, (y0 + y1) / 2, 50, '#ff8a30', 0.12 * fade);
      ctx.globalAlpha = 1;
    }
  });

  // ======================================================================================================
  // 8. THE SINGING DUNES
  // ======================================================================================================
  const WORM = ['#1a0a10', '#4a2028', '#7a3a38', '#a85a48', '#c8865a', '#e8b880', '#fff0d0'];
  const WR = 24, WH = 120;   // the worm's reach either side and its height
  CZ.add('cz_dunes', {
    name: 'The Singing Dunes',
    twist: 'A great worm hunts under the sand. It follows one fighter, then bursts up where the sand trembles.',
    theme: { style: 'dirt', a: '#c8946a', b: '#b07e56', top: '#e8b88a', hi: '#fff0d0', deep: '#5a3a2a', plat: '#b88a5a', sky: ['#0a0a28', '#a85a5a'], haz: '#e8b880', win: ['#ffd890'] },
    es: { 'The Singing Dunes': 'Las Dunas que Cantan', 'A great worm hunts under the sand. It follows one fighter, then bursts up where the sand trembles.': 'Un gran gusano caza bajo la arena. Sigue a un luchador y luego emerge donde tiembla la arena.', 'THE WORM RISES': 'EL GUSANO EMERGE' },
    zh: { 'The Singing Dunes': '歌唱沙丘', 'A great worm hunts under the sand. It follows one fighter, then bursts up where the sand trembles.': '巨大的沙虫在沙下狩猎。它会追踪一名斗士，然后从颤动的沙地破土而出。', 'THE WORM RISES': '沙虫出没' },
    tiles(z) { z.plat(4, 11, 5); z.plat(29, 11, 5); z.plat(15, 8, 8); },
    paint(x, r) {
      CZ.sky(x, [[0, '#08081e'], [70, '#121234'], [130, '#221a48'], [180, '#3a2458'], [215, '#6a3a62'], [240, '#a85a5a'], [300, '#c87a5a']]);
      CZ.stars(x, r, 200, 512, 200, ['#ffffff', '#ffe8c0', '#c8c0ff']);
      // two moons
      D(x, '#8a8070', 380, 70, 33); D(x, '#e8e0d0', 380, 70, 31); D(x, '#fff8ec', 374, 64, 22); D(x, '#c8c0b0', 390, 78, 6); D(x, '#c8c0b0', 368, 82, 4); D(x, '#d8d0c0', 396, 58, 3);
      D(x, '#c86a3a', 120, 52, 9); D(x, '#e88a4a', 119, 51, 8); D(x, '#ffb070', 117, 49, 4);
      // dunes, far to near, each lit along its crest by the big moon
      const dune = (base, amp, f, ph, cols) => {
        const top = xx => base - amp * (0.5 + 0.5 * Math.sin(xx * f + ph)) - amp * 0.3 * Math.sin(xx * f * 2.7 + ph);
        CZ.ridge(x, cols[1], top, 300);
        for (let xx = 0; xx < 512; xx++) { const t = Math.round(top(xx)), slope = top(xx + 1) - top(xx); R(x, slope > 0 ? cols[2] : cols[0], xx, t, 1, 2); }
      };
      dune(196, 30, 0.011, 1, ['#2a1838', '#4a3058', '#8a5a7a']);
      // the bones of an older worm, arching over the far dunes
      for (let i = 0; i < 9; i++) {
        const bx = 150 + i * 26, h = 70 - Math.abs(i - 3) * 8;
        for (let a = 0; a <= Math.PI; a += 0.03) { const px = Math.round(bx + Math.cos(a) * 14), py = Math.round(206 - Math.sin(a) * h); R(x, a < 1.4 ? '#d8c8b0' : '#8a7a6a', px, py, 2, 2); }
      }
      CZ.sprite(x, 128, 186, 60, 40, c => { c.fillStyle = '#d8c8b0'; c.beginPath(); c.ellipse(0, 0, 24, 16, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#2a1838'; c.beginPath(); c.ellipse(4, 2, 14, 10, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#d8c8b0'; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; c.fillRect(4 + Math.cos(a) * 12 - 1, 2 + Math.sin(a) * 8 - 1, 3, 3); } }, ['#2a1838', '#8a7a6a', '#d8c8b0'], { outline: false });   // its skull
      dune(222, 24, 0.016, 3, ['#4a2a48', '#6a4060', '#a86a78']);
      // a leaning obelisk
      for (let yy = 0; yy < 70; yy++) { const w = Math.round(12 - yy * 0.08); R(x, '#5a3a48', 430 + Math.round(yy * 0.15) - (w >> 1), 220 - yy, w, 1); R(x, '#a87a78', 430 + Math.round(yy * 0.15) - (w >> 1), 220 - yy, 2, 1); }
      dune(246, 16, 0.022, 5, ['#6a3a48', '#8a5a58', '#c88a72']);
    },
    floor(x, z, r) {   // rippled sand
      R(x, '#b07e56', 0, FLOOR, z.pw, 48);
      for (let yy = 4; yy < 46; yy += 5) for (let xx = 0; xx < z.pw; xx++) { const y = FLOOR + yy + Math.round(2 * Math.sin(xx * 0.09 + yy)); R(x, '#c8946a', xx, y, 1, 1); R(x, '#8a5e40', xx, y + 1, 1, 1); }
      R(x, '#fff0d0', 0, FLOOR, z.pw, 1); R(x, '#e8b88a', 0, FLOOR + 1, z.pw, 2);
      for (let yy = FLOOR + 32; yy < FLOOR + 48; yy++) for (let xx = 0; xx < z.pw; xx++) if (CZ.bayer(xx, yy) < (yy - FLOOR - 32) / 18) R(x, '#4a2a2a', xx, yy, 1, 1);
      CZ.eachPlat(z, (px, py, pw) => {   // sandstone ledges, carved
        x.clearRect(px, py, pw, T);
        R(x, '#5a3a2a', px, py, pw, 7); R(x, '#b88a5a', px, py, pw, 5); R(x, '#e8c090', px, py, pw, 1);
        for (let i = 3; i < pw - 3; i += 8) { R(x, '#8a5a3a', px + i, py + 2, 4, 1); R(x, '#8a5a3a', px + i + 1, py + 3, 2, 1); }
      });
    },
    init(s) { s.c.wm = CZ.timer(() => 540 + Math.random() * 200, 100, 64, 420); s.c.x = 304; s.c.mk = { warn: 0, xs: [], heed: null }; s.c.hit = new Set(); s.c.tg = 0; },
    tick(s, z, on) {
      const c = s.c, h = c.wm;
      if (!on) { s.marks = null; return; }
      const ev = CZ.step(h);
      if (ev === 'warn') { const fs = CZ.fighters(); c.tg = (Math.random() * fs.length) | 0; c.x = fs[c.tg] ? fs[c.tg].x : 304; c.mk.heed = null; CZ.banner(s, 'THE WORM RISES', '#e8b880', 100); CZ.sfx('deny'); }
      if (h.warn > 0) {
        const fs = CZ.fighters(), t = fs[c.tg];
        if (t && h.warn > 40) c.x = SW.clamp(c.x + SW.clamp(t.x - c.x, -1.7, 1.7), 30, z.pw - 30);   // it follows, then settles
        c.mk.warn = h.warn; c.mk.xs = [c.x]; s.marks = c.mk;
        if (s.ct % 3 === 0) CZ.part({ x: c.x + rnd(-20, 20), y: FLOOR - 1, vx: rnd(-0.6, 0.6), vy: -1 - Math.random() * 1.5, g: 0.12, life: 22, max: 22, col: Math.random() < 0.5 ? '#e8b88a' : '#c8946a', s: 1 });
        if (h.warn % 20 === 0) fx.shake(1, 6);
      } else s.marks = null;
      if (ev === 'go') { c.hit = new Set(); CZ.sfx('explode'); fx.shake(6, 18); for (let i = 0; i < 24; i++) CZ.part({ x: c.x + rnd(-24, 24), y: FLOOR - 2, vx: rnd(-3, 3), vy: rnd(-5, -1), g: 0.22, life: 34, max: 34, col: i % 3 ? '#c8946a' : '#e8b88a', s: 2 }); }
      if (h.run) {
        const hgt = wormH(h);
        for (const f of CZ.fightersF()) { const p = f.p; if (c.hit.has(p) || Math.abs(p.x - c.x) > WR || p.y < FLOOR - hgt) continue; c.hit.add(p); CZ.hit(f, { dmg: 13, kx: (p.x < c.x ? -1 : 1) * 4, ky: -9, stun: 36, down: true, heavy: true, srcX: c.x }); CZ.spark(p.x, p.y - 16, '#e8b880', 12, 3); }
      }
    },
    back(ctx, s, cx) {   // sand blowing, and now and then a worm's back rolling through the far dunes
      for (let i = 0; i < 12; i++) { const sx = ((SW.frame * (2 + i % 3) + i * 53) % (W + 40)) - 20, sy = 150 + (i * 31) % 70; ctx.globalAlpha = 0.4; R(ctx, '#e8b88a', Math.round(sx), sy, 6 + i % 5, 1); }
      ctx.globalAlpha = 1;
      const t = SW.frame % 1400;
      if (t < 500) { for (let k = 0; k < 6; k++) { const wx = Math.round(-60 + t * 1.3 - k * 16 - cx * 0.3), wy = 170 - Math.round(Math.max(0, Math.sin((t * 1.3 - k * 16) * 0.012)) * 8); E(ctx, '#3a2440', wx, wy, 9, 5); R(ctx, '#6a4060', wx - 6, wy - 4, 12, 1); } }
    },
    mid(ctx, s, cx, cy) {
      const c = s.c, h = c.wm; if (!h) return;
      const x0 = Math.round(c.x - cx), fy = FLOOR - cy;
      if (h.warn > 0) {   // the sand bulges and trembles over it
        const k = 1 - h.warn / h.warnT, rw = Math.round(14 + k * 14), j = SW.frame % 2;
        E(ctx, '#8a5e40', x0 + j, fy, rw + 2, 3 + k * 3); E(ctx, '#c8946a', x0 + j, fy, rw, 2 + k * 3); E(ctx, '#e8b88a', x0 + j - 3, fy - 2, rw >> 1, 1 + k);
        if (h.warn < 40 && CZ.blink(h, 10)) { R(ctx, '#fff0d0', x0 - WR, fy - 1, 3, 1); R(ctx, '#fff0d0', x0 + WR - 2, fy - 1, 3, 1); }
      }
      if (!h.run) return;
      const hgt = wormH(h);
      CZ.sprite(ctx, x0, fy - (hgt >> 1) - 8, 70, hgt + 40, cc => {
        const top = -hgt / 2 - 4;
        cc.fillStyle = WORM[3]; cc.fillRect(-20, top + 10, 40, hgt + 20);
        cc.fillStyle = WORM[4]; cc.fillRect(-20, top + 10, 8, hgt + 20);
        for (let y = top + 16; y < hgt / 2 + 20; y += 9) { cc.fillStyle = WORM[2]; cc.fillRect(-20, y, 40, 3); cc.fillStyle = WORM[5]; cc.fillRect(-18, y - 1, 10, 1); }
        cc.fillStyle = WORM[3]; cc.beginPath(); cc.ellipse(0, top + 10, 26, 10, 0, 0, Math.PI * 2); cc.fill();   // the open mouth
        cc.fillStyle = WORM[1]; cc.beginPath(); cc.ellipse(0, top + 10, 18, 6, 0, 0, Math.PI * 2); cc.fill();
        cc.fillStyle = '#8a1a2a'; cc.beginPath(); cc.ellipse(0, top + 11, 10, 3, 0, 0, Math.PI * 2); cc.fill();
        cc.fillStyle = WORM[6]; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, tx = Math.cos(a) * 20, ty = top + 10 + Math.sin(a) * 7; cc.beginPath(); cc.moveTo(tx - 2, ty); cc.lineTo(tx * 0.7, ty + (Math.sin(a) > 0 ? -2 : 2) - 2); cc.lineTo(tx + 2, ty); cc.fill(); }
      }, WORM.concat(['#8a1a2a']));
      E(ctx, '#8a5e40', x0, fy, 34, 3); E(ctx, '#c8946a', x0, fy - 1, 30, 2);
    }
  });
  function wormH(h) { const k = h.k; return Math.round(k < 10 ? WH * k / 10 : h.runT - k < 16 ? WH * (h.runT - k) / 16 : WH); }

  // ======================================================================================================
  // 9. THE FROZEN MIRROR
  // ======================================================================================================
  const ICE_STATES = { idle: 0.22, run: 0.22, guard: 0.35, hurt: 0.5, charge: 0.3 };
  CZ.add('cz_frozen', {
    name: 'The Frozen Mirror',
    twist: 'A frozen lake under the aurora. The ice is slippery: fighters slide when they start, stop or are hit.',
    theme: { style: 'plate', a: '#5a8ab0', b: '#4a7aa0', top: '#c8ecff', hi: '#ffffff', deep: '#1a3050', plat: '#bfe8ff', sky: ['#040818', '#1e4870'], haz: '#bfefff', win: ['#bfefff'] },
    es: { 'The Frozen Mirror': 'El Espejo Helado', 'A frozen lake under the aurora. The ice is slippery: fighters slide when they start, stop or are hit.': 'Un lago helado bajo la aurora. El hielo resbala: los luchadores patinan al arrancar, al frenar o al recibir golpes.' },
    zh: { 'The Frozen Mirror': '冰封之镜', 'A frozen lake under the aurora. The ice is slippery: fighters slide when they start, stop or are hit.': '极光下的冰封湖面。冰面很滑：起步、停下或被击中时都会滑行。' },
    tiles(z) { z.plat(5, 11, 5); z.plat(28, 11, 5); z.plat(15, 8, 8); },
    paint(x, r) {
      CZ.sky(x, [[0, '#040818'], [60, '#081430'], [130, '#0e2244'], [190, '#163458'], [240, '#1e4870'], [300, '#2a5a80']]);
      CZ.stars(x, r, 260, 512, 190, ['#ffffff', '#c8e8ff', '#8ab0d8']);
      D(x, '#3a5a80', 90, 70, 26); D(x, '#c8d8f0', 90, 70, 19); D(x, '#f0f6ff', 90, 70, 17); D(x, '#ffffff', 86, 66, 10); D(x, '#c8d8f0', 96, 74, 3);   // the moon and its halo
      art.ring(x, '#5a7aa8', 90, 70, 30);
      // mountains with snow and blue shadow
      const mt = xx => 200 - 70 * Math.max(0, 1 - Math.abs(((xx + 60) % 200) - 100) / 100) - 10 * CZ.noise(xx / 16, 1, 2);
      CZ.pixels(x, 0, 120, 512, 120, (px, py) => { const t = mt(px); if (py < t) return null; const left = mt(px - 1) > t; return py - t < 22 + 6 * CZ.noise(px / 6, 3, 1) ? (left ? '#e8f4ff' : '#8aa8d0') : (left ? '#4a6a98' : '#2a4470'); });
      // ice spires on the far shore
      for (const [sx, h] of [[300, 90], [318, 60], [336, 110], [352, 50], [470, 80]]) for (let yy = 0; yy < h; yy++) { const w = Math.max(1, Math.round(10 * (1 - yy / h))); R(x, '#5a8ab8', sx - w, 232 - yy, w, 1); R(x, '#bfe8ff', sx, 232 - yy, Math.max(1, w >> 1), 1); }
      // pines along the shore
      for (let xx = 0; xx < 512; xx += 7) { const h = 14 + (CZ.hash(xx, 2, 3) * 22 | 0); for (let yy = 0; yy < h; yy++) { const w = Math.round((yy / h) * 5); R(x, '#081420', xx - w, 238 - h + yy, w * 2 + 1, 1); } }
      R(x, '#081420', 0, 236, 512, 64);
    },
    floor(x, z, r) {   // clear ice, with something vast frozen inside it
      R(x, '#3a6a98', 0, FLOOR, z.pw, 48);
      CZ.ditherRect(x, '#4a7aa8', '#1a3a60', 0, FLOOR + 4, z.pw, 44);
      CZ.pixels(x, 120, FLOOR + 8, 380, 40, (px, py) => {   // the coils of a frozen serpent, and one closed eye
        const c1 = Math.abs(py - (FLOOR + 26 + 9 * Math.sin(px * 0.035))) - 7;
        if (Math.hypot((px - 330) / 18, (py - FLOOR - 22) / 6) < 1) return Math.abs(py - FLOOR - 22) < 1 ? '#0e2040' : '#2a5080';
        if (c1 > 0) return null;
        return ((px + py) % 6 === 0) ? '#2a5080' : CZ.bayer(px, py) < 0.5 ? '#1e4470' : '#2a5888';
      });
      R(x, '#ffffff', 0, FLOOR, z.pw, 1); R(x, '#c8ecff', 0, FLOOR + 1, z.pw, 2); R(x, '#8ab8e0', 0, FLOOR + 3, z.pw, 1);
      for (let i = 0; i < 18; i++) { let cx0 = r() * z.pw, cy0 = FLOOR + 4 + r() * 10; for (let k = 0; k < 5; k++) { const nx = cx0 + rnd(-10, 10), ny = cy0 + rnd(1, 7); CZ.line(x, '#d8f4ff', cx0, cy0, nx, ny); cx0 = nx; cy0 = ny; } }
      for (let i = 0; i < 10; i++) { const sx = r() * z.pw | 0; CZ.line(x, '#e8f8ff', sx, FLOOR + 6, sx + 14, FLOOR + 30); CZ.line(x, '#a8d8f8', sx + 3, FLOOR + 6, sx + 17, FLOOR + 30); }
      CZ.eachPlat(z, (px, py, pw) => {   // ice ledges with icicles
        x.clearRect(px, py, pw, T);
        R(x, '#5a8ab8', px, py, pw, 5); R(x, '#bfe8ff', px, py, pw, 3); R(x, '#ffffff', px, py, pw, 1);
        for (let i = 2; i < pw - 2; i += 5) { const l = 2 + ((i * 7) % 6); R(x, '#8ac0e8', px + i, py + 5, 2, l); R(x, '#ffffff', px + i, py + 5, 1, l - 1); }
      });
    },
    move(a) {   // ice: you keep most of the speed you had (on the lake floor, not on the ledges)
      if (!a.onGround || a.y < FLOOR - 1 || a.swPlat || a.czV === undefined) return 0;
      const k = ICE_STATES[a.state];
      if (k !== undefined && Math.abs(a.vx - a.czV) < 2.5) a.vx = a.czV + (a.vx - a.czV) * k;   // a hit, a dash or a lunge still starts at full speed
      if (Math.abs(a.vx) > 1.2 && SW.frame % 3 === 0) CZ.part({ x: a.x - Math.sign(a.vx) * 4, y: a.y - 1, vx: -a.vx * 0.3, vy: -0.6, g: 0.1, life: 14, max: 14, col: '#e8f8ff', s: 1 });
      return 0;
    },
    after(a) { a.czV = a.vx; },
    back(ctx, s, cx) {   // aurora curtains
      for (let i = 0; i < 3; i++) {
        const base = 26 + i * 14, cols = [['#2a8a7a', '#5affb0', '#c8ffe8'], ['#3a5aa8', '#7ad0ff', '#d8f4ff'], ['#6a3a98', '#b48cff', '#f0d8ff']][i];
        for (let xx = 0; xx < W; xx += 2) {
          const wx = xx + cx * 0.1, top = Math.round(base + 14 * Math.sin(wx * 0.017 + SW.frame * 0.012 + i * 2) + 6 * Math.sin(wx * 0.05 - SW.frame * 0.02)), len = 26 + Math.round(16 * (0.5 + 0.5 * Math.sin(wx * 0.03 + i + SW.frame * 0.01)));
          const a = 0.18 + 0.14 * Math.sin(wx * 0.02 + SW.frame * 0.03 + i);
          if (a < 0.08) continue;
          ctx.globalAlpha = a; R(ctx, cols[0], xx, top, 2, len); ctx.globalAlpha = Math.min(1, a * 1.6); R(ctx, cols[1], xx, top + len - 6, 2, 4); R(ctx, cols[2], xx, top + len - 2, 2, 1);
        }
      }
      ctx.globalAlpha = 1;
    }
  });

  // ======================================================================================================
  // 10. THE MIDNIGHT EXPRESS
  // ======================================================================================================
  const BRIDGE_V = 14, BRIDGE_W = 120, LOWH = 48;   // the bridge's speed, its span, its clearance over the roof
  CZ.add('cz_express', {
    name: 'The Midnight Express',
    twist: 'You fight on top of a speeding train. Low bridges sweep over the roof: stay low when one comes.',
    theme: { style: 'plate', a: '#4a4e5e', b: '#3e4252', top: '#8a8e9e', hi: '#c8ccd8', deep: '#1a1c26', plat: '#8a8e9e', sky: ['#080a1c', '#3a2a5a'], haz: '#ff3b3b', win: ['#ffd890'] },
    es: { 'The Midnight Express': 'El Expreso de Medianoche', 'You fight on top of a speeding train. Low bridges sweep over the roof: stay low when one comes.': 'Luchas sobre un tren a toda velocidad. Los puentes bajos barren el techo: quédate abajo cuando llegue uno.', 'LOW BRIDGE!': '¡PUENTE BAJO!' },
    zh: { 'The Midnight Express': '午夜快车', 'You fight on top of a speeding train. Low bridges sweep over the roof: stay low when one comes.': '在飞驰的列车车顶上战斗。低矮的桥梁会扫过车顶：桥来时别跳、别站高处。', 'LOW BRIDGE!': '低桥来袭！' },
    tiles(z) { z.plat(5, 11, 5); z.plat(28, 11, 5); z.plat(15, 9, 8); },
    paint(x, r) {
      CZ.sky(x, [[0, '#06081a'], [80, '#0e1230'], [150, '#181a40'], [200, '#26204a'], [240, '#3a2a5a'], [300, '#4a3060']]);
      CZ.stars(x, r, 180, 512, 180, ['#ffffff', '#c8c8ff', '#ffe8c0']);
      D(x, '#c8b8a0', 96, 120, 40); D(x, '#f8f0d8', 96, 120, 38); D(x, '#ffffff', 90, 114, 26); D(x, '#d8ccb4', 108, 132, 7); D(x, '#d8ccb4', 84, 136, 4);   // a huge low moon
      const mt = xx => 190 - 40 * Math.abs(Math.sin(xx * 0.009 + 0.5)) - 16 * CZ.noise(xx / 20, 4, 3);
      CZ.ridge(x, '#141428', mt, 300);
      for (let xx = 0; xx < 512; xx++) { const t = Math.round(mt(xx)); if (t < 168) R(x, '#8a88b0', xx, t, 1, Math.round((168 - t) * 0.4)); }
    },
    floor(x, z, r) {   // the roofs of the cars, ridged, with vents and the gaps between cars
      R(x, '#3e4252', 0, FLOOR, z.pw, 48);
      for (let xx = 0; xx < z.pw; xx += 6) { R(x, '#4a4e5e', xx, FLOOR + 3, 4, 20); R(x, '#5a5e6e', xx, FLOOR + 3, 1, 20); }
      R(x, '#c8ccd8', 0, FLOOR, z.pw, 1); R(x, '#8a8e9e', 0, FLOOR + 1, z.pw, 2);
      R(x, '#2a2c38', 0, FLOOR + 23, z.pw, 2); R(x, '#6a1e1e', 0, FLOOR + 25, z.pw, 8); R(x, '#a83a3a', 0, FLOOR + 25, z.pw, 1); R(x, '#ffd84a', 0, FLOOR + 30, z.pw, 1);   // the car sides
      for (let xx = 10; xx < z.pw; xx += 22) { R(x, '#1a1c26', xx, FLOOR + 35, 14, 10); R(x, '#ffd890', xx + 1, FLOOR + 36, 12, 7); R(x, '#fff0c8', xx + 1, FLOOR + 36, 12, 1); }   // lit windows
      for (const gx of [150, 350, 550]) { R(x, '#0a0a12', gx, FLOOR, 5, 48); R(x, '#6a6e7e', gx + 1, FLOOR + 28, 3, 4); }   // the gaps (coupled below)
      for (let xx = 60; xx < z.pw; xx += 100) { R(x, '#2a2c38', xx, FLOOR - 4, 16, 4); R(x, '#8a8e9e', xx, FLOOR - 4, 16, 1); for (let i = 2; i < 16; i += 3) R(x, '#1a1c26', xx + i, FLOOR - 3, 1, 3); }   // vents
      CZ.eachPlat(z, (px, py, pw) => {   // roof racks on posts
        x.clearRect(px, py, pw, T);
        for (const ppx of [px + 4, px + pw - 6]) { R(x, '#2a2c38', ppx, py + 5, 2, FLOOR - py - 5); R(x, '#6a6e7e', ppx, py + 5, 1, FLOOR - py - 5); }
        R(x, '#1a1c26', px, py, pw, 5); R(x, '#8a8e9e', px, py, pw, 3); R(x, '#c8ccd8', px, py, pw, 1);
        for (let i = 3; i < pw - 2; i += 4) R(x, '#3e4252', px + i, py + 1, 2, 2);
      });
    },
    init(s) { s.c.br = CZ.timer(() => 540 + Math.random() * 220, 100, 9999, 420); s.c.bx = null; s.c.hit = new Set(); },
    tick(s, z, on) {
      const c = s.c, h = c.br;
      if (c.bx !== null) {
        c.bx -= BRIDGE_V;
        for (const f of CZ.fightersF()) { const p = f.p; if (c.hit.has(p) || p.x < c.bx - 6 || p.x > c.bx + BRIDGE_W + 6 || p.y - p.h >= FLOOR - LOWH) continue; c.hit.add(p); CZ.hit(f, { dmg: 12, kx: -6, ky: 3, stun: 30, down: true, heavy: true, srcX: p.x + 20 }); CZ.spark(p.x, p.y - 20, '#ffd24a', 12, 3); CZ.sfx('heavy'); }
        if (c.bx + BRIDGE_W < -40) { c.bx = null; h.run = false; h.next = typeof h.gap === 'function' ? h.gap() : h.gap; s.highHaz = null; }
        return;
      }
      if (!on) { s.highHaz = null; return; }
      const ev = CZ.step(h);
      if (ev === 'warn') { CZ.banner(s, 'LOW BRIDGE!', '#ff5a5a', 100); }
      if (h.warn > 0 && h.warn % 25 === 0) CZ.sfx('deny');
      s.highHaz = h.warn > 0 || h.run ? h : null;
      if (ev === 'go') { c.bx = z.pw + 30; c.hit = new Set(); CZ.sfx('explode'); fx.shake(3, 10); }
    },
    back(ctx, s, cx) {   // the world rushing past: far hills, a town's lights, trees, telegraph poles
      const f = SW.frame;
      for (let xx = 0; xx < W; xx++) { const wx = xx + f * 0.6, t = Math.round(206 - 14 * Math.abs(Math.sin(wx * 0.013)) - 6 * Math.sin(wx * 0.041)); R(ctx, '#0e0e1e', xx, t, 1, 270 - t); }
      for (let i = 0; i < 30; i++) { const lx = ((i * 41 - f * 0.9) % (W + 20) + W + 20) % (W + 20) - 10, ly = 200 + (i * 7) % 12; R(ctx, i % 3 ? '#ffd890' : '#ff8a5a', Math.round(lx), ly, 1, 1); }
      for (let i = 0; i < 10; i++) { const tx = ((i * 67 - f * 6) % (W + 80) + W + 80) % (W + 80) - 40, h = 26 + (i * 13) % 20; for (let yy = 0; yy < h; yy++) { const w = Math.round((yy / h) * 7); R(ctx, '#06060e', Math.round(tx) - w, 222 - h + yy, w * 2 + 1, 1); } }
      const px = ((-f * 18) % 260 + 260) % 260 - 20;   // telegraph poles whipping past
      for (const ox of [0, 260]) { const xx = Math.round(px + ox); R(ctx, '#05050a', xx, 120, 4, 110); R(ctx, '#05050a', xx - 10, 126, 24, 3); }
      ctx.globalAlpha = 0.5; for (let i = 0; i < 2; i++) CZ.line(ctx, '#05050a', -10, 128 + i * 3, W + 10, 132 + i * 3); ctx.globalAlpha = 1;
      for (let i = 0; i < 8; i++) { const sx = ((i * 97 - f * 22) % (W + 60) + W + 60) % (W + 60) - 30, sy = 60 + (i * 37) % 140; ctx.globalAlpha = 0.25; R(ctx, '#ffffff', Math.round(sx), sy, 26, 1); }
      ctx.globalAlpha = 1;
    },
    mid(ctx, s, cx, cy) {
      const c = s.c, h = c.br, fy = FLOOR - cy, low = fy - LOWH;
      if (h && h.warn > 0) {   // signal lights ahead, and where the bridge will pass
        const on = h.warn % 20 < 10;
        R(ctx, '#1a1c26', W - 12, low - 40, 4, 40); R(ctx, on ? '#ff3b3b' : '#4a1010', W - 14, low - 44, 8, 6); if (on) art.glow(ctx, W - 10, low - 41, 24, '#ff3b3b', 0.35);
        if (on) { ctx.globalAlpha = 0.3; R(ctx, '#ff5a5a', 0, low, W, 1); ctx.globalAlpha = 1; }
      }
      if (c.bx === null) return;
      const bx = Math.round(c.bx - cx);
      ctx.globalAlpha = 0.25; R(ctx, '#000000', 0, 0, W, 270); ctx.globalAlpha = 1;   // its shadow darkens everything as it passes
      R(ctx, '#1a1c26', bx, 0, BRIDGE_W, low); R(ctx, '#3a3e4e', bx + 2, 0, BRIDGE_W - 4, low - 2);
      for (let y = 0; y < low - 12; y += 24) { CZ.line(ctx, '#1a1c26', bx + 4, y, bx + BRIDGE_W - 4, y + 24, 3); CZ.line(ctx, '#1a1c26', bx + BRIDGE_W - 4, y, bx + 4, y + 24, 3); CZ.line(ctx, '#6a6e7e', bx + 4, y - 1, bx + BRIDGE_W - 4, y + 23, 1); }
      R(ctx, '#5a5e6e', bx, low - 10, BRIDGE_W, 10); R(ctx, '#8a8e9e', bx, low - 10, BRIDGE_W, 2); R(ctx, '#f5c542', bx, low - 2, BRIDGE_W, 2);
      for (let i = 4; i < BRIDGE_W; i += 16) R(ctx, '#ff3b3b', bx + i, low - 6, 2, 2);
      R(ctx, '#8a8e9e', bx, 0, 3, low); R(ctx, '#8a8e9e', bx + BRIDGE_W - 3, 0, 3, low);
    }
  });
})();
