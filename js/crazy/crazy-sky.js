'use strict';
// Shattered Worlds — crazy Versus stages, part 1: sky and space (see crazy-core.js for how a stage is put together).
//   The Sky Leviathan       the floor is a sky whale's back; its blowholes erupt and throw whoever stands over them high
//   The Orbital Wreck       a wrecked station in orbit over a planet: low gravity, and wreckage drifts as platforms
//   The Endless Fall        a slab of tower falling beside the endless tower; rubble rises past as platforms, falls are slow
//   The Event Horizon       a black hole overhead; when it pulses it pulls everyone to the middle
//   The Skyfall Observatory a meteor shower; rings on the ground show where each one lands
(function () {
  const SW = window.SW, CZ = SW.crazy;
  if (!CZ) return;
  const art = SW.art, fx = SW.fx, T = 16, FLOOR = CZ.FLOOR, W = CZ.W, GRAV = CZ.GRAV;
  const R = CZ.rect, D = CZ.disc, E = CZ.ellipse, ST = SW.stages;
  const rnd = SW.rand;

  // ======================================================================================================
  // 1. THE SKY LEVIATHAN
  // ======================================================================================================
  const HOLES = [11 * T + 8, 27 * T + 8];
  const WHALE = ['#141a34', '#28345a', '#3a4870', '#5a6c98', '#8aa0c8', '#c8d4e8', '#e8e0d0'];
  function fluke(c, t) {   // the leviathan's tail, rising out of the cloud sea behind the arena (vector; the pixel kit crisps it)
    const a = Math.sin(t) * 0.12;
    c.rotate(a);
    c.fillStyle = WHALE[2];
    c.beginPath(); c.moveTo(-14, 70); c.quadraticCurveTo(-18, 20, -6, -12); c.lineTo(6, -12); c.quadraticCurveTo(14, 20, 14, 70); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(-30, -14, -66, -44); c.quadraticCurveTo(-40, -22, -6, 2); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(30, -14, 66, -44); c.quadraticCurveTo(40, -22, 6, 2); c.closePath(); c.fill();
    c.fillStyle = WHALE[4];   // light on the upper edge of each lobe
    c.beginPath(); c.moveTo(-2, -9); c.quadraticCurveTo(-30, -15, -66, -44); c.quadraticCurveTo(-34, -20, -4, -5); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(2, -9); c.quadraticCurveTo(30, -15, 66, -44); c.quadraticCurveTo(34, -20, 4, -5); c.closePath(); c.fill();
    c.fillStyle = WHALE[1];   // shadow side of the stock
    c.beginPath(); c.moveTo(6, -12); c.quadraticCurveTo(14, 20, 14, 70); c.lineTo(6, 70); c.quadraticCurveTo(6, 20, 2, -10); c.closePath(); c.fill();
    c.fillStyle = WHALE[6];   // barnacles
    [[-8, 30], [-4, 44], [-10, 52], [-2, 18]].forEach(([x, y]) => c.fillRect(x, y, 3, 2));
  }
  function smallWhale(c, s) {
    c.fillStyle = '#4c4c8c';
    c.beginPath(); c.ellipse(0, 0, 20 * s, 6 * s, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(-18 * s, 0); c.lineTo(-30 * s, -6 * s); c.lineTo(-28 * s, 0); c.lineTo(-30 * s, 6 * s); c.closePath(); c.fill();
    c.fillStyle = '#6a64a4'; c.fillRect(-12 * s, 3 * s, 26 * s, 2 * s);
  }
  CZ.add('cz_leviathan', {
    name: 'The Sky Leviathan',
    twist: 'You fight on a sky whale. Its blowholes erupt and throw whoever stands on them high.',
    theme: { style: 'plate', a: '#3a4870', b: '#2e3a60', top: '#6a80a8', hi: '#9ab0d0', deep: '#1c2440', plat: '#8a6a48', sky: ['#141c48', '#ffe0a0'], haz: '#bfe8ff', win: ['#ffe0a0'] },
    es: { 'The Sky Leviathan': 'El Leviatán del Cielo', 'You fight on a sky whale. Its blowholes erupt and throw whoever stands on them high.': 'Luchas sobre una ballena del cielo. Sus espiráculos estallan y lanzan muy alto a quien esté encima.', 'THE LEVIATHAN BREATHES': 'EL LEVIATÁN RESPIRA' },
    zh: { 'The Sky Leviathan': '天空巨鲸', 'You fight on a sky whale. Its blowholes erupt and throw whoever stands on them high.': '在天空巨鲸的背上战斗。它的喷水孔会喷发，把站在上面的人高高抛起。', 'THE LEVIATHAN BREATHES': '巨鲸在呼吸' },
    tiles(z) { z.plat(4, 11, 5); z.plat(29, 11, 5); z.plat(16, 8, 6); },
    paint(x, r) {
      CZ.sky(x, [[0, '#141c48'], [50, '#202a64'], [96, '#343e84'], [138, '#5a5a9c'], [172, '#94709e'], [198, '#d08a94'], [220, '#f0a888'], [240, '#f8c888'], [300, '#ffe4b0']]);
      for (let i = 0; i < 26; i++) { const sx = r() * 512 | 0, sy = r() * 90 | 0; R(x, r() < 0.3 ? '#ffffff' : '#a8b0e0', sx, sy, 1, 1); }
      // the low sun, half sunk in the cloud sea
      D(x, '#f8c890', 392, 222, 30); D(x, '#ffe0a8', 392, 222, 24); D(x, '#fff4d8', 392, 222, 19); D(x, '#ffffff', 392, 222, 13);
      // cirrus streaks lit from below
      for (let i = 0; i < 14; i++) { const w = 30 + r() * 110 | 0, sx = r() * 512 | 0, sy = 104 + r() * 84 | 0; R(x, '#7a6aac', sx, sy, w, 2); R(x, '#e0a0b8', sx + 4, sy + 2, w - 8, 1); }
      // a pod of distant whales
      [[90, 150, 0.7], [140, 166, 0.5], [60, 172, 0.45], [250, 140, 0.4]].forEach(([wx, wy, s]) => CZ.sprite(x, wx, wy, 80 * s + 8, 24 * s + 8, c => smallWhale(c, s), ['#2c2c68', '#4c4c8c', '#6a64a4'], { outline: false }));
      // the cloud sea: three banks of cumulus tops, lit warm from the sun
      const bank = (base, amp, f, ph, cols) => {
        const top = xx => base - amp * Math.abs(Math.sin(xx * f + ph)) - amp * 0.5 * Math.abs(Math.sin(xx * f * 2.3 + ph * 2)) - 3 * CZ.noise(xx / 9, ph, 4);
        CZ.ridge(x, cols[1], top, 300);
        for (let xx = 0; xx < 512; xx++) { const t = Math.round(top(xx)); R(x, cols[2], xx, t, 1, 2); if (CZ.bayer(xx, t + 2) < 0.5) R(x, cols[2], xx, t + 2, 1, 1); R(x, cols[0], xx, t + 9 + ((xx * 7) % 5), 1, 300); }
      };
      bank(226, 7, 0.031, 0.4, ['#b07098', '#d890a8', '#f8c8b8']);
      bank(240, 8, 0.024, 2.1, ['#8a5a8a', '#b47898', '#f0b0a8']);
      bank(256, 6, 0.04, 4.0, ['#6a4a7a', '#94608a', '#d89898']);
    },
    floor(x, z, r) {
      // the whale's back: blue-grey skin, mottled, barnacled, with two blowholes
      R(x, WHALE[2], 0, FLOOR, z.pw, 48);
      CZ.ditherRect(x, WHALE[2], WHALE[1], 0, FLOOR + 22, z.pw, 26);
      R(x, WHALE[5], 0, FLOOR, z.pw, 1); R(x, WHALE[4], 0, FLOOR + 1, z.pw, 1); R(x, WHALE[3], 0, FLOOR + 2, z.pw, 2);
      for (let i = 0; i < 70; i++) E(x, i % 3 ? '#46588a' : WHALE[1], r() * z.pw, FLOOR + 6 + r() * 36, 1 + r() * 4, 1 + r() * 1.4);
      for (let i = 0; i < 9; i++) { const bx = r() * z.pw, by = FLOOR + 5 + r() * 18; for (let j = 0; j < 5; j++) { const ex = bx + rnd(-6, 6), ey = by + rnd(-2, 3); D(x, '#8a8478', ex, ey, 1 + (r() * 1.6 | 0)); R(x, WHALE[6], ex - 1, ey - 1, 1, 1); } }
      for (const hx of HOLES) { E(x, WHALE[3], hx, FLOOR + 4, 12, 3); E(x, WHALE[0], hx, FLOOR + 4, 9, 2); R(x, '#0a0e20', hx - 4, FLOOR + 4, 8, 1); R(x, WHALE[5], hx - 9, FLOOR + 1, 4, 1); }
      // rider platforms: planks tied down to the whale's back with ropes
      CZ.eachPlat(z, (px, py, pw) => {
        x.clearRect(px, py, pw, T);
        CZ.line(x, '#a89070', px + 3, py + 4, px - 14, FLOOR, 1); CZ.line(x, '#a89070', px + pw - 4, py + 4, px + pw + 13, FLOOR, 1);
        R(x, '#5a3e28', px, py, pw, 5); R(x, '#a07848', px, py, pw, 3); R(x, '#d8a870', px, py, pw, 1);
        for (let i = 7; i < pw; i += 9) R(x, '#5a3e28', px + i, py + 1, 1, 3);
        R(x, '#c8b088', px + 6, py - 1, 2, 6); R(x, '#c8b088', px + pw - 8, py - 1, 2, 6);   // lashings
      });
    },
    init(s) { s.c.gy = CZ.timer(() => 420 + Math.random() * 200, 90, 56, 360); s.c.which = Math.random() < 0.5 ? 0 : 1; s.c.mk = { warn: 0, xs: [], heed: null }; s.c.hit = new Set(); },
    tick(s, z, on) {
      const c = s.c, h = c.gy;
      if (!on) { s.marks = null; return; }
      const ev = CZ.step(h);
      if (ev === 'warn') { c.which = 1 - c.which; c.mk.heed = null; CZ.banner(s, 'THE LEVIATHAN BREATHES', '#bfe8ff', 90); CZ.sfx('deny'); }
      const gx = HOLES[c.which];
      if (h.warn > 0) {
        c.mk.warn = h.warn; c.mk.xs = [gx]; s.marks = c.mk;
        if (h.warn % 5 === 0) CZ.part({ x: gx + rnd(-6, 6), y: FLOOR - 2, vx: rnd(-0.3, 0.3), vy: -0.8 - Math.random() * 1.4, life: 28, max: 28, col: '#e8f6ff', s: 2, a: 0.7 });
      } else s.marks = null;
      if (ev === 'go') { c.hit = new Set(); CZ.sfx('explode'); fx.shake(3, 12); }
      if (h.run) {
        for (const f of CZ.fightersF()) { const p = f.p; if (c.hit.has(p) || Math.abs(p.x - gx) > 16) continue; if (CZ.launch(p, -11.5)) { c.hit.add(p); CZ.spark(p.x, p.y - 8, '#ffffff', 10, 3); } }
        if (s.ct % 2 === 0) for (let i = 0; i < 2; i++) CZ.part({ x: gx + rnd(-10, 10), y: 6 + rnd(0, 20), vx: rnd(-1.6, 1.6), vy: rnd(-0.5, 1.5), g: 0.12, life: 40, max: 40, col: i ? '#ffffff' : '#bfe8ff', s: 2, a: 0.8 });
      }
    },
    back(ctx, s, cx) {
      const t = SW.frame * 0.018;
      CZ.sprite(ctx, Math.round(66 - cx * 0.45), Math.round(168 + Math.sin(t) * 5), 150, 130, c => fluke(c, t), WHALE.slice(0, 6));
      for (let i = 0; i < 7; i++) {   // gulls
        const gx = ((SW.frame * (0.5 + (i % 3) * 0.15) + i * 83) % (W + 60)) - 30 - cx * 0.2, gy = 70 + (i * 37) % 70 + Math.sin(SW.frame * 0.02 + i) * 4, up = (SW.frame + i * 7) % 20 < 10;
        R(ctx, '#2a2a5a', Math.round(gx), Math.round(gy), 1, 1); R(ctx, '#2a2a5a', Math.round(gx) - 2, Math.round(gy) + (up ? -1 : 1), 2, 1); R(ctx, '#2a2a5a', Math.round(gx) + 1, Math.round(gy) + (up ? -1 : 1), 2, 1);
      }
    },
    mid(ctx, s, cx, cy) {
      const c = s.c, h = c.gy;
      if (!h) return;
      const gx = HOLES[c.which] - cx, fy = FLOOR - cy;
      if (h.warn > 0) {
        const k = 1 - h.warn / h.warnT, hh = Math.round(2 + k * 7 + Math.sin(SW.frame * 0.6) * 2);
        R(ctx, '#7ab8e8', gx - 6, fy - hh, 12, hh); R(ctx, '#bfe8ff', gx - 4, fy - hh, 8, hh); R(ctx, '#ffffff', gx - 2, fy - hh, 3, 2);
        if (CZ.blink(h, 18)) { R(ctx, '#e8f6ff', gx - 14, fy - 2, 4, 1); R(ctx, '#e8f6ff', gx + 10, fy - 2, 4, 1); }
      }
      if (h.run) {
        const k = h.k, top = k < 8 ? fy - (fy + 10) * k / 8 : 18, fade = h.runT - k < 12 ? (h.runT - k) / 12 : 1, wd = Math.round(24 * fade + 4);
        for (let y = Math.max(-2, Math.round(top)); y < fy; y += 2) {
          const wob = Math.round(Math.sin(y * 0.15 + SW.frame * 0.6) * 2), ww = wd + Math.round((fy - y) / fy * 6);
          R(ctx, '#3a70b0', gx - (ww >> 1) + wob - 2, y, ww + 4, 2); R(ctx, '#7ab8e8', gx - (ww >> 1) + wob, y, ww, 2); R(ctx, '#bfe8ff', gx - (ww >> 2) + wob, y, ww >> 1, 2);
          if ((y + SW.frame * 4) % 14 < 6) R(ctx, '#ffffff', gx - 2 + wob + ((y >> 3) % 3) - 1, y, 3, 2);   // white water racing up the core
        }
        if (k >= 8 && fade > 0.3) for (let i = 0; i < 9; i++) {   // the spray crown, spilling over at the top
          const a = Math.PI + (i / 8) * Math.PI, rr = 14 + ((SW.frame * 2 + i * 5) % 12);
          D(ctx, i % 2 ? '#bfe8ff' : '#ffffff', gx + Math.cos(a) * rr * 1.4, top + 4 + Math.sin(a) * rr * 0.6 + rr * 0.5, 3 + (i % 3));
        }
        E(ctx, '#bfe8ff', gx, fy - 2, wd + 8, 3); E(ctx, '#ffffff', gx, fy - 3, wd, 1);   // the splash at its foot
      }
    }
  });

  // ======================================================================================================
  // 2. THE ORBITAL WRECK
  // ======================================================================================================
  const DRIFT = [[4, 11, 5, 24, 0], [16, 7, 6, 34, 2], [29, 11, 5, 24, 4]];   // tile x, row, width, sway px, phase
  CZ.add('cz_orbit', {
    name: 'The Orbital Wreck',
    twist: 'A wrecked station in orbit. Gravity is weak: everyone jumps high and falls slowly. Wreckage drifts.',
    theme: { style: 'plate', a: '#4a4e66', b: '#3e4258', top: '#a8acc0', hi: '#e0e4f0', deep: '#1e2234', plat: '#8a90a8', sky: ['#04030a', '#161a3a'], haz: '#7ad0ff', win: ['#7ad0ff'] },
    es: { 'The Orbital Wreck': 'Los Restos Orbitales', 'A wrecked station in orbit. Gravity is weak: everyone jumps high and falls slowly. Wreckage drifts.': 'Una estación en ruinas en órbita. La gravedad es débil: todos saltan alto y caen despacio. Los restos flotan.' },
    zh: { 'The Orbital Wreck': '轨道残骸', 'A wrecked station in orbit. Gravity is weak: everyone jumps high and falls slowly. Wreckage drifts.': '轨道上的废弃空间站。重力很弱：人人跳得高、落得慢。残骸四处漂浮。' },
    tiles(z) { z.plat(6, 4, 4); z.plat(28, 4, 4); },
    plats: () => DRIFT.map(([tx, ty, tw, amp, ph]) => CZ.plat(tx * T, ty * T, tw * T, 'drift', { bx: tx * T, by: ty * T, amp, ph })),
    paint(x, r) {
      CZ.sky(x, [[0, '#04030a'], [90, '#080a1c'], [170, '#10122c'], [300, '#161a3a']]);
      CZ.pixels(x, 0, 0, 512, 240, (px, py) => {   // a nebula across the sky
        const band = Math.abs(py - 30 - px * 0.3), n = CZ.fbm(px / 64, py / 36, 3, 4), k = n - band / 150;
        return k < 0.33 ? null : CZ.ramp(['#120a26', '#22123e', '#34185a', '#2a3a72', '#5a5aa8'], (k - 0.33) * 2.4, px, py);
      });
      CZ.stars(x, r, 300, 512, 250, ['#ffffff', '#c8d0ff', '#ffe8c0', '#8a90c0', '#6a70a0']);
      // the sun as a hard white star, top left
      D(x, '#c8d8ff', 34, 40, 5); D(x, '#ffffff', 34, 40, 3); R(x, '#ffffff', 14, 40, 41, 1); R(x, '#ffffff', 34, 22, 1, 37); R(x, '#a8b8ff', 4, 40, 61, 1);
      // a small grey moon
      D(x, '#3a3a50', 440, 64, 13); D(x, '#8a8aa0', 439, 63, 12); D(x, '#b8b8c8', 436, 60, 7); D(x, '#6a6a80', 444, 66, 3); D(x, '#6a6a80', 434, 68, 2);
      // the planet below: oceans, land, cloud bands, night side with city lights, a thin blue atmosphere
      const pcx = 256, pcy = 384, pr = 202;
      CZ.pixels(x, pcx - pr - 8, pcy - pr - 8, 2 * pr + 16, 2 * pr + 16, (px, py) => {
        const dx = (px - pcx) / pr, dy = (py - pcy) / pr, d2 = dx * dx + dy * dy;
        if (d2 > 1) { const d = Math.sqrt(d2); return d < 1.012 ? '#8ad8ff' : d < 1.03 && CZ.bayer(px, py) < (1.03 - d) * 40 ? '#2a5a98' : null; }
        const nz = Math.sqrt(1 - d2), L = -dx * 0.6 - dy * 0.35 + nz * 0.72;
        const u = dx / (nz + 0.7), v = dy / (nz + 0.7), land = CZ.fbm(u * 3 + 5, v * 3 + 2, 7, 4), cloud = CZ.fbm(u * 4 + 1, v * 10 + 8, 11, 4);
        let k = (L + 0.2) / 1.15; if (d2 > 0.93) k += 0.2;
        if (cloud > 0.6) return CZ.ramp(['#1a2440', '#5a6a8c', '#a8b8d0', '#f0f6ff'], k, px, py);
        if (land > 0.55) { if (k < 0.14 && CZ.hash(px, py, 9) > 0.9) return '#ffd87a'; return CZ.ramp(['#0e1e16', '#244a30', '#4a7a40', '#9aae62'], k, px, py); }
        return CZ.ramp(['#06102a', '#10285e', '#1c4c90', '#3a7cc0', '#6aa8d8'], k, px, py);
      });
      // the station's broken ring, arcing over the planet
      for (let a = Math.PI * 1.02; a < Math.PI * 1.98; a += 0.0025) {
        const seg = Math.floor(a * 40) % 9; if (seg === 0 || seg === 5) continue;   // the gaps
        const px = Math.round(256 + 300 * Math.cos(a)), py = Math.round(236 + 40 * Math.sin(a));
        R(x, '#1a1c2c', px, py, 1, 6); R(x, '#4a5068', px, py, 1, 4); R(x, '#a8b0c8', px, py, 1, 1);
        if ((px * 13) % 23 === 0) R(x, '#ffd87a', px, py + 2, 1, 1);
      }
    },
    floor(x, z, r) {
      R(x, '#3e4258', 0, FLOOR, z.pw, 48);
      CZ.ditherRect(x, '#3e4258', '#262a3e', 0, FLOOR + 26, z.pw, 22);
      R(x, '#e0e4f0', 0, FLOOR, z.pw, 1); R(x, '#a8acc0', 0, FLOOR + 1, z.pw, 2); R(x, '#5a6078', 0, FLOOR + 3, z.pw, 1);
      for (let xx = 0; xx < z.pw; xx++) if (((xx + 0) >> 2) % 2 === 0) R(x, '#f5c542', xx, FLOOR + 6, 1, 3); else R(x, '#141420', xx, FLOOR + 6, 1, 3);
      for (let xx = 16; xx < z.pw; xx += 32) { R(x, '#22263a', xx, FLOOR + 10, 1, 38); R(x, '#5a6078', xx + 1, FLOOR + 10, 1, 38); R(x, '#8a90a8', xx - 3, FLOOR + 12, 1, 1); R(x, '#8a90a8', xx + 4, FLOOR + 12, 1, 1); }
      R(x, '#22263a', 0, FLOOR + 21, z.pw, 1);
      for (let xx = 30; xx < z.pw; xx += 64) { R(x, '#16304a', xx, FLOOR + 14, 10, 4); R(x, '#7ad0ff', xx + 1, FLOOR + 15, 8, 2); R(x, '#d8f4ff', xx + 1, FLOOR + 15, 3, 1); }
      CZ.eachPlat(z, (px, py, pw) => {   // gantry beams with a truss under them
        x.clearRect(px, py, pw, T);
        R(x, '#22263a', px, py, pw, 5); R(x, '#8a90a8', px, py, pw, 3); R(x, '#e0e4f0', px, py, pw, 1);
        for (let i = 0; i < pw - 6; i += 8) { CZ.line(x, '#4a4e66', px + i, py + 5, px + i + 4, py + 10); CZ.line(x, '#4a4e66', px + i + 4, py + 10, px + i + 8, py + 5); }
        R(x, '#4a4e66', px, py + 10, pw, 1);
      });
    },
    tick(s, z, on) {
      s.lowG = !!ST.on;
      for (const p of s.plats) if (p.kind === 'drift') CZ.place(p, p.bx + Math.sin(s.ct * 0.006 + p.ph) * p.amp, p.by + Math.sin(s.ct * 0.011 + p.ph * 1.7) * 7);
    },
    drawPlat(ctx, p, x, y) {   // a chunk of rock with a scrap of hull plate on top, and a beacon
      const w = p.w;
      for (let i = 0; i < w; i++) { const d = 5 + Math.round(3 * CZ.hash(i >> 2, p.bx, 3) + 3 * Math.sin(i * 0.19 + p.bx) + 4 * Math.sin(i / w * Math.PI)); R(ctx, '#1c1a28', x + i, y + 3, 1, d + 2); R(ctx, '#4a4460', x + i, y + 3, 1, d); if (i % 7 === 3) R(ctx, '#6a6488', x + i, y + 4, 1, Math.max(1, d - 3)); }
      R(ctx, '#2a2e44', x, y, w, 3); R(ctx, '#8a90a8', x, y, w, 2); R(ctx, '#e0e4f0', x, y, w, 1);
      for (let i = 4; i < w - 4; i += 8) R(ctx, '#f5c542', x + i, y + 3, 4, 1);
      if ((SW.frame + p.bx) % 60 < 30) { R(ctx, '#ff4a4a', x + w - 6, y - 2, 2, 2); art.glow(ctx, x + w - 5, y - 1, 8, '#ff4a4a', 0.15); }
    },
    back(ctx, s, cx) {
      for (let i = 0; i < 14; i++) {   // small debris drifting across
        const sp = 0.12 + (i % 4) * 0.06, bx = ((SW.frame * sp + i * 71) % (W + 40)) - 20 - cx * (0.1 + (i % 3) * 0.05), by = 30 + (i * 53) % 150 + Math.sin(SW.frame * 0.01 + i) * 6, rot = Math.floor(SW.frame / (20 + i * 3) + i) % 2;
        R(ctx, '#3a3a52', Math.round(bx), Math.round(by), rot ? 3 : 2, rot ? 2 : 3); R(ctx, '#8a90a8', Math.round(bx), Math.round(by), 1, 1);
      }
      const sx = Math.round(352 - cx * 0.3), sy = Math.round(78 + Math.sin(SW.frame * 0.013) * 4);   // a satellite
      R(ctx, '#2a4a8a', sx - 14, sy, 10, 4); R(ctx, '#2a4a8a', sx + 6, sy, 10, 4); for (let i = 0; i < 10; i += 3) { R(ctx, '#4a7ac8', sx - 14 + i, sy, 1, 4); R(ctx, '#4a7ac8', sx + 6 + i, sy, 1, 4); }
      R(ctx, '#8a90a8', sx - 4, sy + 1, 10, 2); R(ctx, '#c8ccd8', sx - 2, sy - 2, 5, 7); R(ctx, '#e0e4f0', sx - 2, sy - 2, 5, 1);
      if (SW.frame % 50 < 6) R(ctx, '#ff5a5a', sx, sy - 4, 1, 2);
    }
  });

  // ======================================================================================================
  // 3. THE ENDLESS FALL
  // ======================================================================================================
  const RISE_BOT = FLOOR - 36, RISE_TOP = 52, RISE_V = 0.38;
  const LANES = [[4, 5, 0], [16, 6, 1 / 3], [29, 5, 2 / 3]];   // tile x, width, phase (how far up it starts)
  CZ.add('cz_freefall', {
    name: 'The Endless Fall',
    twist: 'Everyone falls beside an endless tower. Rubble rises past as platforms and breaks apart. Falls are slow.',
    theme: { style: 'brick', a: '#7a7060', b: '#6a6050', top: '#b8ae98', hi: '#e8e0cc', deep: '#3a342c', plat: '#9a9080', sky: ['#0c1838', '#d0e4f2'], haz: '#ffffff', win: ['#ffd890'] },
    es: { 'The Endless Fall': 'La Caída sin Fin', 'Everyone falls beside an endless tower. Rubble rises past as platforms and breaks apart. Falls are slow.': 'Todos caen junto a una torre sin fin. Los escombros suben como plataformas y se rompen. Las caídas son lentas.' },
    zh: { 'The Endless Fall': '无尽坠落', 'Everyone falls beside an endless tower. Rubble rises past as platforms and breaks apart. Falls are slow.': '众人在无尽高塔旁坠落。碎石如平台般上升，随后崩碎。下落变慢。' },
    tiles() {},
    plats: () => LANES.map(([tx, tw, ph]) => CZ.plat(tx * T, Math.round(RISE_BOT - (RISE_BOT - RISE_TOP) * ph), tw * T, 'rise', { grow: 0 })),
    paint(x, r) {
      CZ.sky(x, [[0, '#0c1838'], [60, '#16285a'], [120, '#24447e'], [180, '#3e6aa4'], [230, '#6a98c8'], [270, '#a8c8e4'], [300, '#d0e4f2']]);
      // far spires in the haze, rising from below past the top
      for (const [sx, sw, col, lit] of [[28, 18, '#3e5e92', '#6a90c0'], [110, 10, '#4a6ea0', '#7aa0c8'], [196, 24, '#36568a', '#5a80b0'], [470, 14, '#4a6ea0', '#7aa0c8']]) {
        R(x, col, sx, 0, sw, 300); R(x, lit, sx, 0, 2, 300);
        for (let y = 8; y < 300; y += 12) for (let i = 4; i < sw - 2; i += 5) if (CZ.hash(sx + i, y, 2) > 0.6) R(x, '#ffd890', sx + i, y, 1, 2);
        for (let y = 40 + (sx % 50); y < 300; y += 90) { R(x, lit, sx - 2, y, sw + 4, 2); }
      }
      for (let i = 0; i < 8; i++) { const cy0 = 40 + r() * 240, cx0 = r() * 512; CZ.cloud(x, cx0, cy0, 10 + r() * 10, '#e8f0f8', '#b8cce0', '#8aa4c8'); }
    },
    floor(x, z, r) {   // the slab we stand on: broken masonry with moss
      R(x, '#6a6050', 0, FLOOR, z.pw, 48);
      for (let row = 0; row < 3; row++) for (let bx = -((row * 11) % 24); bx < z.pw; bx += 24) { const y = FLOOR + 2 + row * 12; R(x, CZ.hash(bx, row, 1) > 0.5 ? '#8a8070' : '#7a7060', bx + 1, y + 1, 22, 10); R(x, '#a89c88', bx + 1, y + 1, 22, 1); R(x, '#4a4238', bx, y, 1, 12); }
      R(x, '#e8e0cc', 0, FLOOR, z.pw, 1); R(x, '#b8ae98', 0, FLOOR + 1, z.pw, 1);
      for (let i = 0; i < 26; i++) { const mx = r() * z.pw | 0, mw = 4 + r() * 14 | 0; R(x, '#5a7a3a', mx, FLOOR, mw, 2); R(x, '#8aac5a', mx + 1, FLOOR, mw - 2, 1); if (r() < 0.5) R(x, '#5a7a3a', mx + 2, FLOOR + 2, 1, 2 + r() * 3 | 0); }
      for (let i = 0; i < 12; i++) { const cx0 = r() * z.pw, cy0 = FLOOR + 6 + r() * 30; CZ.line(x, '#3a342c', cx0, cy0, cx0 + rnd(-6, 6), cy0 + rnd(3, 8)); }
    },
    init(s) { for (const p of s.plats) p.alive = true; },
    tick(s, z) {
      for (const p of s.plats) {
        if (!p.alive) { if (--p.gone <= 0) { p.alive = true; p.grow = 20; p.y = RISE_BOT; p.vy = 0; } continue; }
        if (p.grow > 0) p.grow--;
        p.yf = (p.yf === undefined ? p.y : p.yf) - RISE_V;   // a smooth sub-pixel rise, placed on whole pixels
        CZ.place(p, p.x, Math.round(p.yf));
        if (p.y <= RISE_TOP) {   // it breaks apart at the top
          CZ.drop(p); p.alive = false; p.gone = 70; p.yf = undefined;
          CZ.sfx('block'); fx.shake(2, 6);
          for (let i = 0; i < 14; i++) CZ.part({ x: p.x + Math.random() * p.w, y: p.y + Math.random() * 6, vx: rnd(-1.5, 1.5), vy: rnd(-3, -1), g: -0.05, life: 34, max: 34, col: i % 3 ? '#8a8070' : '#c8bea8', s: 2 });
        }
      }
    },
    move(a) { if (!a.onGround && a.vy > 0) a.vy -= GRAV * 0.22; return 0; },   // the rushing air holds you up a little
    drawPlat(ctx, p, x, y) {
      if (!p.alive) return;
      if (p.grow > 0) ctx.globalAlpha = 1 - p.grow / 20;
      const w = p.w, shake = p.y < RISE_TOP + 16 ? (SW.frame % 2 ? 1 : -1) : 0;
      x += shake;
      for (let i = 0; i < w; i++) { const d = 4 + Math.round(3 * CZ.hash(i >> 2, w, 5) + 2 * Math.sin(i / w * Math.PI) * 2); R(ctx, '#3a342c', x + i, y + 3, 1, d + 2); R(ctx, '#7a7060', x + i, y + 3, 1, d); }
      R(ctx, '#a89c88', x, y, w, 3); R(ctx, '#e8e0cc', x, y, w, 1);
      for (let i = 8; i < w - 6; i += 12) R(ctx, '#4a4238', x + i, y + 1, 1, 6);   // the block joints
      if (p.y < RISE_TOP + 16) { CZ.line(ctx, '#2a241c', x + w * 0.3, y, x + w * 0.35, y + 6); CZ.line(ctx, '#2a241c', x + w * 0.7, y, x + w * 0.62, y + 6); }
      ctx.globalAlpha = 1;
    },
    back(ctx, s, cx) {
      // the endless tower on the right, its face rushing upward
      const tx = Math.round(296 - cx * 0.3), tw = 176, off = (SW.frame * 4) % 96;
      R(ctx, '#5a5048', tx, 0, tw, 270); R(ctx, '#7a6e60', tx + 4, 0, tw - 8, 270);
      const boff = (SW.frame * 4) % 12;
      for (let y = -boff, row = Math.floor(SW.frame * 4 / 12); y < 270; y += 12, row++) { R(ctx, '#6a5e50', tx + 4, y, tw - 8, 1); for (let jx = tx + 4 + ((row & 1) ? 12 : 0); jx < tx + tw - 8; jx += 24) R(ctx, '#6a5e50', jx, y, 1, 12); }   // the stone courses
      R(ctx, '#9a8e7c', tx + 4, 0, 2, 270); R(ctx, '#4a4038', tx + tw - 8, 0, 4, 270);
      for (let y = -off; y < 270; y += 96) {
        R(ctx, '#a89880', tx, y, tw, 6); R(ctx, '#d8ccb4', tx, y, tw, 1); R(ctx, '#4a4038', tx, y + 6, tw, 2);   // a cornice
        for (let i = 0; i < 4; i++) {   // arched windows, some lit
          const wx = tx + 18 + i * 40, wy = y + 24;
          R(ctx, '#2a2438', wx, wy + 4, 18, 40); D(ctx, '#2a2438', wx + 9, wy + 5, 9); R(ctx, '#4a4038', wx - 2, wy + 44, 22, 3);
          if (CZ.hash(i, Math.floor((SW.frame * 4 + y + 1000) / 96), 3) > 0.55) { R(ctx, '#ffd890', wx + 3, wy + 10, 12, 30); R(ctx, '#fff0c8', wx + 3, wy + 10, 12, 2); }
        }
      }
      // wind streaks rushing up
      for (let i = 0; i < 16; i++) {
        const sx = (i * 97 + 13) % W, len = 16 + (i * 13) % 30, sp = 9 + (i % 5) * 2, sy = 270 - ((SW.frame * sp + i * 61) % (270 + len));
        ctx.globalAlpha = 0.35 + 0.2 * (i % 3) / 2; R(ctx, '#ffffff', sx, Math.round(sy), 1, len);
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 4; i++) {   // clouds rushing up past
        const cy0 = 300 - ((SW.frame * (2.2 + i * 0.4) + i * 120) % 380), cx0 = ((i * 157) % 430) + 20 - cx * 0.4;
        ctx.globalAlpha = 0.85; CZ.cloud(ctx, Math.round(cx0), Math.round(cy0), 16 + i * 3, '#ffffff', '#d8e6f4', '#a8c0dc'); ctx.globalAlpha = 1;
      }
    }
  });

  // ======================================================================================================
  // 4. THE EVENT HORIZON
  // ======================================================================================================
  const BH = [256, 116];   // the hole, in backdrop pixels (on screen: x - cam.x / 4, y - 30)
  CZ.add('cz_horizon', {
    name: 'The Event Horizon',
    twist: 'A black hole hangs overhead. When it pulses, it pulls everyone to the middle, the air most of all.',
    theme: { style: 'panel', a: '#2a2438', b: '#221c30', top: '#6a5a8a', hi: '#c8b0ff', deep: '#0c0814', plat: '#5a4a7a', sky: ['#050208', '#1e0e2e'], haz: '#ffb060', win: ['#b48cff'] },
    es: { 'The Event Horizon': 'El Horizonte de Sucesos', 'A black hole hangs overhead. When it pulses, it pulls everyone to the middle, the air most of all.': 'Un agujero negro cuelga en el cielo. Cuando late, atrae a todos hacia el centro, sobre todo en el aire.', 'THE STAR PULLS': 'EL AGUJERO ATRAE' },
    zh: { 'The Event Horizon': '事件视界', 'A black hole hangs overhead. When it pulses, it pulls everyone to the middle, the air most of all.': '黑洞悬在头顶。它脉动时会把所有人拉向中央，空中的人最明显。', 'THE STAR PULLS': '黑洞在吸引' },
    tiles(z) { z.plat(4, 11, 6); z.plat(28, 11, 6); z.plat(15, 8, 8); },
    paint(x, r) {
      CZ.sky(x, [[0, '#050208'], [100, '#0a0512'], [200, '#140a20'], [300, '#1e0e2e']]);
      const [hx, hy] = BH;
      for (let i = 0; i < 420; i++) {   // stars, smeared into arcs around the hole
        const px = r() * 512, py = r() * 280, dx = px - hx, dy = py - hy, d = Math.hypot(dx, dy);
        if (d < 60) continue;
        const col = r() < 0.2 ? '#ffffff' : r() < 0.5 ? '#c8a8e8' : '#7a6aa0', len = d < 200 ? Math.min(14, 900 / d) : 1, a0 = Math.atan2(dy, dx);
        for (let k = 0; k < len; k++) { const a = a0 + (k / d); R(x, col, Math.round(hx + Math.cos(a) * d), Math.round(hy + Math.sin(a) * d), 1, 1); }
      }
      const disk = (px, py, front) => {   // the accretion disk: hot white inside, red outside; the approaching side brighter
        const dx = (px - hx) / 150, dy = (py - hy) / 20, e = Math.sqrt(dx * dx + dy * dy);
        if (e > 1 || e < 0.27 || (front ? py < hy : py >= hy)) return null;
        const k = 1 - (e - 0.27) / 0.73 + (-dx * 0.18) + 0.1 * Math.sin(e * 40);
        return CZ.ramp(['#3a0a0a', '#7a1e10', '#c84a18', '#ff8a30', '#ffc870', '#fff0c8', '#ffffff'], k, px, py);
      };
      CZ.pixels(x, hx - 160, hy - 70, 320, 140, (px, py) => {   // the far side of the disk, bent up over the hole (the lensed arc), and its back half
        const dx = px - hx, dy = py - hy, d = Math.hypot(dx, dy);
        if (dy < 0 && d > 40 && d < 54) { const k = 1 - Math.abs(d - 46) / 8 + (-dx / 300); return CZ.ramp(['#5a1410', '#c84a18', '#ffa040', '#ffe0a0'], k, px, py); }
        return disk(px, py, false);
      });
      D(x, '#fff0d0', hx, hy, 39); D(x, '#000000', hx, hy, 37);   // the photon ring and the hole
      CZ.pixels(x, hx - 160, hy, 320, 30, (px, py) => disk(px, py, true));   // the near side of the disk, in front
      for (let i = 0; i < 60; i++) {   // a moon being pulled apart, streaming into the disk
        const k = i / 60, a = -0.4 + k * 2.4, d = 210 - k * 120;
        R(x, k < 0.2 ? '#8a7a9a' : '#c86a3a', Math.round(hx + Math.cos(a) * d * 1.1), Math.round(hy - 30 + Math.sin(a) * d * 0.3 + k * 30), k < 0.2 ? 3 : 1, k < 0.2 ? 3 : 1);
      }
      D(x, '#4a3a5a', 430, 70, 8); D(x, '#8a7a9a', 429, 69, 7); D(x, '#b8a8c8', 427, 67, 3);
      // the station's far wing, dark against the glow
      CZ.ridge(x, '#0e0818', xx => 226 - 14 * (Math.floor(xx / 40) % 3) - (xx % 40 < 6 ? 10 : 0), 300);
      for (let xx = 4; xx < 512; xx += 9) if (CZ.hash(xx, 1, 4) > 0.5) R(x, '#b48cff', xx, 230 + (xx % 3) * 4, 2, 1);
    },
    floor(x, z, r) {   // a station deck: dark metal grating with violet light strips
      R(x, '#221c30', 0, FLOOR, z.pw, 48);
      CZ.ditherRect(x, '#221c30', '#120e1c', 0, FLOOR + 20, z.pw, 28);
      R(x, '#c8b0ff', 0, FLOOR, z.pw, 1); R(x, '#6a5a8a', 0, FLOOR + 1, z.pw, 2);
      for (let xx = 0; xx < z.pw; xx += 4) R(x, '#120e1c', xx, FLOOR + 4, 2, 6);
      R(x, '#3a2a5a', 0, FLOOR + 11, z.pw, 2); R(x, '#b48cff', 0, FLOOR + 12, z.pw, 1);
      for (let xx = 20; xx < z.pw; xx += 48) { R(x, '#3a3048', xx, FLOOR + 16, 20, 10); R(x, '#5a4a7a', xx, FLOOR + 16, 20, 1); R(x, '#ffb060', xx + 2, FLOOR + 19, 2, 2); }
      CZ.eachPlat(z, (px, py, pw) => {
        x.clearRect(px, py, pw, T);
        R(x, '#120e1c', px, py, pw, 6); R(x, '#5a4a7a', px, py, pw, 3); R(x, '#c8b0ff', px, py, pw, 1);
        R(x, '#b48cff', px + 3, py + 5, pw - 6, 1);
        for (let i = 6; i < pw - 4; i += 10) R(x, '#2a2438', px + i, py + 3, 2, 2);
      });
    },
    init(s) { s.c.pull = CZ.timer(() => 540 + Math.random() * 240, 90, 240, 420); s.c.str = 0; },
    tick(s, z, on) {
      const c = s.c, h = c.pull;
      if (!on) { c.str = 0; return; }
      const ev = CZ.step(h);
      if (ev === 'warn') { CZ.banner(s, 'THE STAR PULLS', '#ffb060', 100); CZ.sfx('awaken'); }
      if (ev === 'go') { CZ.sfx('heavy'); fx.shake(3, 14); }
      c.str = h.run ? Math.min(1, h.k / 30, (h.runT - h.k) / 30) : 0;
      if (h.run && s.ct % 2 === 0) { const side = Math.random() < 0.5, px = SW.game.cam.x + (side ? 0 : W), py = 30 + Math.random() * 190; CZ.part({ x: px, y: py, vx: (side ? 1 : -1) * (2.5 + Math.random() * 2), vy: (120 - py) * 0.004, life: 70, max: 70, col: Math.random() < 0.4 ? '#ffe0a0' : '#c8a8e8', s: 1, a: 0.7 }); }
    },
    move(a, s, z) {
      const k = s.c.str; if (!k) return 0;
      const dx = z.pw / 2 - a.x; if (Math.abs(dx) < 6) return 0;
      return Math.sign(dx) * Math.min(1, Math.abs(dx) / 80) * k * (a.onGround ? (a.state === 'guard' ? 0.3 : 0.65) : 1.25);
    },
    back(ctx, s, cx) {
      const hx = BH[0] - Math.round(cx * 0.25), hy = BH[1] - 30, k = s.c.str || 0, h = s.c.pull;
      for (let i = 0; i < 10; i++) {   // hot spots orbiting in the disk
        const a = SW.frame * (0.016 + (i % 3) * 0.004) + i * 0.63, e = 0.4 + (i % 4) * 0.15, px = Math.round(hx + Math.cos(a) * 150 * e), py = Math.round(hy + Math.sin(a) * 20 * e);
        if (Math.sin(a) < 0 && Math.abs(px - hx) < 38) continue;
        R(ctx, i % 2 ? '#ffffff' : '#ffe0a0', px, py, 2, 1);
      }
      if (k > 0 || (h && h.warn > 0)) {
        const pulse = k > 0 ? k : (h.warn % 20 < 10 ? 0.3 : 0.1);
        art.glow(ctx, hx, hy, 70 + 20 * pulse, '#ff8a30', 0.08 * pulse); art.ring(ctx, '#ffe0a0', hx, hy, Math.round(40 + (SW.frame % 20) * 1.5 * pulse));
        D(ctx, '#000000', hx, hy, 36);
      }
    }
  });

  // ======================================================================================================
  // 5. THE SKYFALL OBSERVATORY
  // ======================================================================================================
  const FALL = 14;
  CZ.add('cz_meteor', {
    name: 'The Skyfall Observatory',
    twist: 'A meteor shower: rings on the ground show where each one lands. Step out of them.',
    theme: { style: 'brick', a: '#4a4060', b: '#3e3654', top: '#8a80a8', hi: '#c8c0e0', deep: '#1a1428', plat: '#8a7a60', sky: ['#0a0620', '#6a3a6a'], haz: '#ff8a3a', win: ['#ffd890'] },
    es: { 'The Skyfall Observatory': 'El Observatorio de los Meteoros', 'A meteor shower: rings on the ground show where each one lands. Step out of them.': 'Una lluvia de meteoros: los anillos del suelo marcan dónde caerá cada uno. Sal de ellos.', 'METEOR SHOWER': 'LLUVIA DE METEOROS' },
    zh: { 'The Skyfall Observatory': '陨星天文台', 'A meteor shower: rings on the ground show where each one lands. Step out of them.': '流星雨：地上的光圈标出每颗陨石的落点。快离开光圈。', 'METEOR SHOWER': '流星雨来袭' },
    tiles(z) { z.plat(5, 11, 6); z.plat(27, 11, 6); z.plat(15, 8, 8); },
    paint(x, r) {
      CZ.sky(x, [[0, '#0a0620'], [70, '#140c34'], [140, '#221448'], [190, '#3a1e5a'], [225, '#5a2e66'], [300, '#7a4070']]);
      CZ.pixels(x, 0, 0, 512, 200, (px, py) => {   // the Milky Way
        const band = Math.abs(py - 150 + px * 0.25), n = CZ.fbm(px / 40, py / 30, 5, 4), k = n * 1.2 - band / 70;
        return k < 0.45 ? null : CZ.ramp(['#2a1a50', '#4a3070', '#7a5a9a', '#c8b0e0'], (k - 0.45) * 2, px, py);
      });
      CZ.stars(x, r, 240, 512, 210, ['#ffffff', '#ffe8c0', '#c8c0ff', '#8a80c0']);
      // a great comet, its tail across the upper left
      for (let i = 0; i < 120; i++) { const k = i / 120, px = 150 - i * 1.1, py = 46 - i * 0.35, w = 1 + k * 8; ctx2(x, k < 0.15 ? '#ffffff' : k < 0.5 ? '#bfe8ff' : '#6a8ac8', px, py, w, k); }
      D(x, '#bfe8ff', 151, 46, 3); D(x, '#ffffff', 151, 46, 2);
      // two ranges of mountains, snow on the far one
      const far = xx => 196 - 34 * Math.abs(Math.sin(xx * 0.013 + 1)) - 18 * CZ.noise(xx / 22, 2, 3);
      CZ.ridge(x, '#2a2050', far, 300);
      for (let xx = 0; xx < 512; xx++) { const t = Math.round(far(xx)); if (t < 178) R(x, '#a8a0d0', xx, t, 1, Math.round((178 - t) * 0.5)); R(x, '#c8c0e8', xx, t, 1, 1); }
      const near = xx => 234 - 30 * Math.max(0, Math.sin(xx * 0.008 - 0.6)) - 8 * CZ.noise(xx / 12, 7, 3);
      CZ.ridge(x, '#16102c', near, 300);
      // the observatory on the right peak: dome, open slit, a great brass telescope
      const ox = 404, oy = 176;
      R(x, '#2a2440', ox - 30, oy, 60, 50); R(x, '#4a4060', ox - 30, oy, 60, 2);
      for (let i = 0; i < 3; i++) { R(x, '#ffd890', ox - 22 + i * 18, oy + 14, 6, 9); R(x, '#fff0c8', ox - 22 + i * 18, oy + 14, 6, 1); }
      CZ.pixels(x, ox - 34, oy - 34, 68, 34, (px, py) => { const dx = (px - ox) / 32, dy = (py - oy) / 32, d = dx * dx + dy * dy; if (d > 1 || py >= oy) return null; return Math.abs(px - ox + 4) < 4 && dy > -0.95 ? '#0a0614' : CZ.ramp(['#5a5070', '#9a90b0', '#d8d0e8', '#ffffff'], 1 - dx * 0.8 - dy * 0.2 - 0.3, px, py); });
      CZ.line(x, '#5a4a30', ox - 4, oy - 16, ox + 22, oy - 48, 6); CZ.line(x, '#d8b060', ox - 4, oy - 17, ox + 22, oy - 49, 3); CZ.line(x, '#fff0b0', ox - 4, oy - 18, ox + 22, oy - 50, 1);
      D(x, '#bfe8ff', ox + 23, oy - 50, 3);
    },
    floor(x, z, r) {   // a stone terrace with a brass star map set into it
      R(x, '#3e3654', 0, FLOOR, z.pw, 48);
      for (let bx = 0; bx < z.pw; bx += 32) { R(x, '#4a4060', bx + 1, FLOOR + 3, 30, 20); R(x, '#5a5070', bx + 1, FLOOR + 3, 30, 1); }
      CZ.ditherRect(x, '#3e3654', '#1a1428', 0, FLOOR + 24, z.pw, 24);
      R(x, '#c8c0e0', 0, FLOOR, z.pw, 1); R(x, '#8a80a8', 0, FLOOR + 1, z.pw, 2);
      for (let i = 0; i < 40; i++) { const sx = r() * z.pw | 0, sy = FLOOR + 5 + (r() * 16 | 0); R(x, '#d8b060', sx, sy, 1, 1); if (r() < 0.3) CZ.line(x, '#8a7040', sx, sy, sx + rnd(-12, 12), sy + rnd(-4, 4)); }
      art.ring(x, '#d8b060', 304, FLOOR + 13, 9); art.ring(x, '#8a7040', 304, FLOOR + 13, 6);
      CZ.eachPlat(z, (px, py, pw) => {
        x.clearRect(px, py, pw, T);
        R(x, '#2a2440', px, py, pw, 6); R(x, '#6a6088', px, py, pw, 3); R(x, '#c8c0e0', px, py, pw, 1);
        R(x, '#d8b060', px, py + 4, pw, 1); for (let i = 4; i < pw; i += 12) R(x, '#d8b060', px + i, py + 6, 2, 3);
      });
    },
    init(s) { s.c.sh = CZ.timer(() => 480 + Math.random() * 240, 60, 210, 360); s.c.rocks = []; s.c.mk = { warn: 0, xs: [], heed: null }; },
    tick(s, z, on) {
      const c = s.c, h = c.sh;
      if (on) {
        const ev = CZ.step(h);
        if (ev === 'warn') { CZ.banner(s, 'METEOR SHOWER', '#ffb060', 100); c.mk.heed = null; CZ.sfx('deny'); }
        if (h.run && h.k % 34 === 0) {   // a new meteor, mostly near a fighter
          const fs = CZ.fighters(), tg = fs.length ? fs[(Math.random() * fs.length) | 0] : null;
          const mx = SW.clamp(Math.round(tg && Math.random() < 0.7 ? tg.x + rnd(-30, 30) : 30 + Math.random() * (z.pw - 60)), 24, z.pw - 24);
          c.rocks.push({ x: mx, t: 0, warn: 54, dir: Math.random() < 0.5 ? -1 : 1, hit: new Set(), y: -30, cx: mx });
        }
      }
      for (const m of c.rocks) {
        if (m.warn > 0) { m.warn--; continue; }
        m.t++;
        const k = Math.min(1, m.t / FALL);
        m.y = -30 + (FLOOR + 30) * k; m.cx = m.x - m.dir * (1 - k) * 70;
        if (m.t <= FALL) for (const f of CZ.fightersF()) {
          const p = f.p;
          if (m.hit.has(p) || Math.abs(p.x - m.cx) > 12 || m.y < p.y - p.h - 8 || m.y > p.y + 6) continue;
          m.hit.add(p); CZ.hit(f, { dmg: 9, kx: m.dir * 3, ky: -5, stun: 26, down: true, srcX: m.cx - m.dir * 10 }); CZ.spark(p.x, p.y - 14, '#ffb060', 10, 3);
        }
        if (m.t === FALL) {   // it lands: a burst on the floor
          CZ.sfx('explode'); fx.shake(3, 8);
          for (const f of CZ.fightersF()) { const p = f.p; if (!m.hit.has(p) && Math.abs(p.x - m.x) < 22 && p.y > FLOOR - 24) { m.hit.add(p); CZ.hit(f, { dmg: 7, kx: (p.x < m.x ? -1 : 1) * 3, ky: -4.5, stun: 22, srcX: m.x }); } }
          for (let i = 0; i < 14; i++) CZ.part({ x: m.x + rnd(-6, 6), y: FLOOR - 2, vx: rnd(-2.5, 2.5), vy: rnd(-3.5, -0.5), g: 0.2, life: 26, max: 26, col: i % 3 ? '#ff8a3a' : '#ffe0a0', s: 2 });
        }
        if (m.t > FALL + 24) m.done = true;
      }
      c.rocks = c.rocks.filter(m => !m.done);
      const pend = c.rocks.filter(m => m.warn > 0);
      if (pend.length) { c.mk.warn = 1; c.mk.xs = pend.map(m => m.x); s.marks = c.mk; } else s.marks = null;
    },
    back(ctx, s, cx) {   // shooting stars, more of them during the shower
      const many = s.c.sh && s.c.sh.run;
      for (let i = 0; i < (many ? 6 : 2); i++) {
        const per = many ? 50 : 170, t = (SW.frame + i * 37) % per;
        if (t > 22) continue;
        const sx = (CZ.hash(i, Math.floor((SW.frame + i * 37) / per), 2) * 520) - cx * 0.2, sy = 10 + CZ.hash(i, Math.floor((SW.frame + i * 37) / per), 5) * 90;
        for (let k = 0; k < 10; k++) R(ctx, k < 2 ? '#ffffff' : '#bfe8ff', Math.round(sx + t * 5 - k * 2), Math.round(sy + t * 2 - k), 1, 1);
      }
    },
    mid(ctx, s, cx, cy) {
      const fy = FLOOR - cy;
      for (const m of s.c.rocks || []) {
        const x0 = Math.round(m.x - cx);
        if (m.warn > 0) {   // the ring where it will land
          const k = 1 - m.warn / 54, rr = Math.round(6 + k * 10), on = m.warn % 12 < 7;
          ctx.globalAlpha = 0.18 + 0.25 * k; R(ctx, '#ff8a3a', x0, 0, 1, fy); ctx.globalAlpha = 1;
          if (on) { art.ring(ctx, '#ff8a3a', x0, fy - 3, rr); R(ctx, '#ffe0a0', x0 - rr, fy - 3, rr * 2 + 1, 1); }
          continue;
        }
        if (m.t <= FALL) {   // the meteor coming in, trailing fire
          const mx = Math.round(m.cx - cx), my = Math.round(m.y - cy);
          for (let k = 1; k < 9; k++) R(ctx, k < 3 ? '#ffe0a0' : k < 6 ? '#ff8a3a' : '#c84a18', mx + m.dir * k * 4 - (k > 4 ? 1 : 0), my - k * 6, Math.max(1, 5 - (k >> 1)), Math.max(1, 5 - (k >> 1)));
          D(ctx, '#5a3a2a', mx, my, 4); D(ctx, '#ffd890', mx - 1, my - 1, 2);
          art.glow(ctx, mx, my, 16, '#ff8a3a', 0.2);
        } else if (m.t < FALL + 8) art.glow(ctx, Math.round(m.x - cx), fy - 4, 30, '#ffb060', 0.35 * (1 - (m.t - FALL) / 8));
      }
    }
  });
  function ctx2(x, col, px, py, w, k) { if (CZ.bayer(Math.round(px), Math.round(py)) > 1 - k * 0.9 + 0.1) return; R(x, col, Math.round(px), Math.round(py - w / 2), 1, Math.max(1, Math.round(w))); }
})();
