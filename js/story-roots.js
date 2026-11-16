'use strict';
// Shattered Worlds — ACT 4: ROOTS AND TETHERS. Loaded after story-surface.js; only adds and wraps.
//   The act the user's five-act plan puts between the Surface (Act 3) and Convergence (Act 5): the veil is broken and
//   the rival is your partner (A3-1, story-act3.js). Then:
//   RT-1 UNDER THE SUMP (new): the tunnel floor at the foot of the Metro Shaft has split open and Deepline's water runs
//     down into it. Below Deepline are the Roots, glowing roots that came through when the worlds were torn together.
//     Halcyon has tapped them; the pipes run up to the tethers that hold Aurelia steady. Three maps: the Taproot Stair,
//     the Rootways (shut three taps) and the Heartroot. Boss: ROOT WARDEN GRANE, who raises roots under your feet.
//   A3-2 RALLY THE DEEP (story-act3.js, unchanged): the Pit's Grand Melee wins Deepline.
//   TF-1 THE TETHER FIELDS (new): the Skylift road runs through a plain of tether anchors. Halcyon spotters watch the
//     road from them. Cut three beacons in the wind, climb the great tether, beat LINEWARDEN ORRO (who rides the cable
//     and drops on you) and light the signal fire. The army marches; Act 5 (A3-3, the Skylift) begins.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, TH = art.themes, W = SW.W, H = SW.H;
  if (!story || !story.patch || !story.tune || !SW.Boss2 || !M['A3-1'] || !M['A3-2']) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring, sh = art.shade;
  const sfx = n => SW.audio.sfx(n);
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16, ROOT = '#7dff9a', SAP = '#b8ff40', SKY = '#6fd3e8';
  const onRoad = (g, pre) => (g.state.mission || '').indexOf(pre) === 0;

  // ================= look: themes, music, backdrops, props =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    roots:    theme('metro', { style: 'dirt', a: '#2a2a1e', b: '#222218', top: '#4a5a2a', hi: '#9ad890', deep: '#0c0e08', plat: '#6a5a3a', sky: ['#040604', '#10180c'], mid: 'ruins', midCol: '#0a0e08', bg: 'none', dim: 0, haz: SAP, win: [ROOT] }),
    heart:    theme('metro', { style: 'dirt', a: '#2a2420', b: '#221c18', top: '#5a6a2a', hi: '#d8ffb0', deep: '#0e0a08', plat: '#6a5a3a', sky: ['#060a04', '#1a2a10'], mid: 'ruins', midCol: '#0a0e08', bg: 'none', dim: 0, haz: SAP, win: [ROOT] }),
    tether:   theme('surface', { style: 'dirt', a: '#8a6a4a', b: '#76583c', top: '#c8a070', hi: '#f0d8a8', deep: '#3a2818', plat: '#a08a50', sky: ['#5a9ad0', '#f0c890'], mid: 'ruins', midCol: '#6a5038', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#f5c542'] }),
    climb:    theme('sky', { style: 'plate', a: '#6a6e7a', b: '#5a5e6a', top: '#a8acb8', hi: '#e8ecf4', deep: '#2a2e3a', plat: '#d9b45a', sky: ['#4a8ad0', '#c8e0f0'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: SKY, win: ['#d9b45a'] }),
    crown:    theme('sky', { style: 'plate', a: '#7a7468', b: '#6a645a', top: '#c8c0a8', hi: '#ffffff', deep: '#3a362e', plat: '#d9b45a', sky: ['#3a7ac8', '#f0d8b0'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: SKY, win: ['#d9b45a'] })
  });
  SW.audio.tracks.roots = { bpm: 70, root: 36, prog: [0, -2, -5, -7], arp: [0, 3, 7, 10, 12, 10, 7, 3], bass: 'triangle', drums: 0.3 };
  SW.audio.tracks.tether = { bpm: 108, root: 43, prog: [0, 5, 3, -2], arp: [0, 7, 12, 14, 12, 7, 5, 7], bass: 'square', drums: 0.5 };

  function bakeBackdrops() {
    const paint = (id, fn) => { const cv = SW.canvas(512, 300); fn(cv[1], SW.rng(id.length * 173 + 11)); art.bg['rt_' + id] = cv[0]; TH[id].bg = 'rt_' + id; TH[id].dim = 0; };
    // a soft glow: stacked discs, each faint, so the light falls off instead of ending in a hard edge
    const soft = (x, col, cx, cy, rad, a) => { x.globalAlpha = a; for (let k = rad; k > 4; k -= Math.max(3, rad / 9)) disc(x, col, cx, cy, k); x.globalAlpha = 1; };
    const roots = (x, r, big) => {
      // pale roots, thick as tunnels, hanging down out of the dark; light pulses inside them
      for (let i = 0; i < 9; i++) {
        let px = i * 60 + (r() * 30 | 0), w = (big ? 16 : 10) + (r() * 10 | 0);
        for (let y = 0; y < 300; y += 4) { px += Math.sin((y + i * 40) * 0.03) * 1.6; rect(x, i % 2 ? '#1e2416' : '#262e1a', px - w / 2, y, w, 4); rect(x, '#3a4a26', px - w / 2, y, 2, 4); if ((y + i * 17) % 52 < 4) rect(x, '#5aa86a', px - 2, y, 4, 4); }
        w = Math.max(4, w - 6);
      }
      for (let i = 0; i < 5; i++) soft(x, ROOT, r() * 512 | 0, 180 + (r() * 120 | 0), 40 + (r() * 30 | 0), 0.035);
      for (let i = 0; i < 50; i++) rect(x, r() < 0.5 ? '#9ad890' : '#e8ffe0', r() * 512 | 0, r() * 300 | 0, 1, 1);
    };
    paint('roots', (x, r) => roots(x, r, false));
    paint('heart', (x, r) => { roots(x, r, true); soft(x, SAP, 256, 200, 130, 0.045); soft(x, '#e8ffd0', 256, 200, 46, 0.06); });
    const cables = (x, r, n, y0) => {
      // the underside of Aurelia far above; the tethers slant down out of it to the plain
      x.globalAlpha = 0.5; rect(x, '#3a4058', 60, 0, 400, 26); for (let i = 0; i < 12; i++) rect(x, '#2a2e40', 70 + i * 32, 26, 18, 10 + (i * 7 % 12)); x.globalAlpha = 1;
      for (let i = 0; i < n; i++) {
        const top = 60 + i * (400 / n) + (r() * 30 | 0), bot = top + 6 + (r() * 10 | 0);   // nearly plumb: the backdrop is mirrored as it tiles, and slanted lines would cross
        line(x, '#2a2620', top, y0, bot, 300, 5); line(x, '#4a463c', top + 2, y0, bot + 2, 300, 1); line(x, '#5aa86a', top - 3, y0, bot - 3, 300, 1);
      }
    };
    paint('tether', (x, r) => {
      cables(x, r, 4, 28);
      for (let i = 0; i < 8; i++) { const cx = i * 70 + (r() * 30 | 0), hgt = 30 + (r() * 40 | 0); for (let k = 0; k < hgt; k += 2) { const ww = 90 * Math.sqrt(1 - k / hgt); rect(x, k % 6 < 2 ? '#a08060' : '#8a6a4a', cx - ww / 2, 300 - k, ww, 2); } }
      for (let i = 0; i < 16; i++) { x.globalAlpha = 0.35; rect(x, '#ffffff', r() * 512 | 0, 120 + (r() * 140 | 0), 20 + (r() * 30 | 0), 1); x.globalAlpha = 1; }
    });
    const clouds = (x, r) => { for (let i = 0; i < 14; i++) { const cx = r() * 512 | 0, cy = 150 + (r() * 140 | 0), w = 50 + (r() * 70 | 0); x.globalAlpha = 0.6; disc(x, '#ffffff', cx, cy, w / 3); disc(x, '#ffffff', cx + w / 3, cy + 4, w / 4); disc(x, '#e8ecf4', cx - w / 3, cy + 6, w / 5); x.globalAlpha = 1; } };
    paint('climb', (x, r) => { cables(x, r, 2, 30); clouds(x, r); });
    paint('crown', (x, r) => { clouds(x, r); cables(x, r, 3, 34); for (let i = 0; i < 30; i++) rect(x, '#a08060', r() * 512 | 0, 280 + (r() * 20 | 0), 3, 1); });
  }

  const PROPS = {
    rootcoil: [44, 30, (x, c) => { for (let i = 0; i < 4; i++) { const cx = 8 + i * 10; disc(x, i % 2 ? '#3a4a26' : '#2e3a1e', cx, 22 - i % 2 * 3, 9); rect(x, c, cx - 1, 16 - i % 2 * 3, 2, 2); } rect(x, '#2e3a1e', 0, 24, 44, 6); rect(x, '#4a5a2a', 0, 24, 44, 2); }],
    tap: [30, 64, (x, c) => { rect(x, '#4a5060', 11, 0, 8, 52); rect(x, '#6a7088', 11, 0, 2, 52); for (let j = 6; j < 50; j += 14) rect(x, '#5a6078', 9, j, 12, 3); rect(x, '#3a3f4e', 4, 50, 22, 14); rect(x, '#5a6078', 4, 50, 22, 3); disc(x, '#2a2e3a', 15, 57, 6); ring(x, c, 15, 57, 6); line(x, c, 10, 57, 20, 57, 1); line(x, c, 15, 52, 15, 62, 1); }],
    heartroot: [96, 110, (x, c) => { for (let k = 0; k < 110; k += 2) { const w = 30 + Math.sin(k * 0.08) * 8 + (k > 80 ? (k - 80) * 1.6 : 0); rect(x, k % 8 < 2 ? '#3a4a26' : '#2e3a1e', 48 - w / 2, k, w, 2); } disc(x, c, 48, 60, 16); disc(x, '#e8ffd0', 48, 60, 7); for (let i = 0; i < 6; i++) { const a = i * 1.05; line(x, c, 48, 60, 48 + Math.cos(a) * 26, 60 + Math.sin(a) * 34, 1); } }],
    anchorstone: [40, 18, (x, c) => { rect(x, '#5a5650', 0, 6, 40, 12); rect(x, '#7a7468', 0, 6, 40, 3); disc(x, '#3a3632', 20, 6, 8); ring(x, c, 20, 6, 8); rect(x, '#2a2620', 18, 0, 4, 8); }],
    beaconoff: [20, 30, x => { rect(x, '#5a6078', 8, 6, 4, 24); rect(x, '#3a3f4e', 2, 26, 16, 4); rect(x, '#2a2e3a', 4, 0, 12, 8); for (let i = 0; i < 3; i++) rect(x, '#6a7088', 5 + i * 4, 30, 2, 0.5); }],
    signal: [30, 34, (x, c) => { rect(x, '#3a3632', 4, 20, 22, 14); rect(x, '#5a5650', 2, 18, 26, 4); line(x, '#2a2620', 6, 34, 2, 34, 1); for (let i = 0; i < 5; i++) rect(x, '#6a4a2a', 6 + i * 4, 14, 3, 6); rect(x, c, 13, 12, 4, 4); }],
    zipline: [26, 44, (x, c) => { rect(x, '#5a6078', 11, 4, 4, 40); rect(x, '#3a3f4e', 5, 40, 16, 4); disc(x, '#2a2e3a', 13, 6, 6); ring(x, c, 13, 6, 6); line(x, '#c8ccd8', 13, 6, 26, 0, 1); }]
  };
  const pcache = {}, _prop = art.prop, _psize = art.propSize;
  art.prop = function (ctx, kind, x, y, col) {
    const d = PROPS[kind];
    if (!d) return _prop.apply(this, arguments);
    const c0 = col || ROOT, key = kind + c0;
    let c = pcache[key];
    if (!c) { const cv = SW.canvas(d[0], d[1]); d[2](cv[1], c0); c = pcache[key] = cv[0]; }
    ctx.drawImage(c, Math.round(x - d[0] / 2), Math.round(y - d[1]));
  };
  art.propSize = kind => (PROPS[kind] ? [PROPS[kind][0], PROPS[kind][1]] : _psize(kind));

  // ================= the new faces =================
  function bakeRoots() {
    const custom = art.custom, recolor = story.recolor;
    // rootling: a knot of pale root that tears loose from the wall and springs at you
    const knot = (pose, eye) => x => {
      const up = pose === 'leap' ? 7 : pose === 'bite' ? 3 : 0, sq = pose === 'idle' ? 1 : 0;
      disc(x, '#3a4a26', 14, 20 - up + sq, 8); disc(x, '#4a5a2a', 12, 18 - up + sq, 6); rect(x, '#5a6a32', 9, 13 - up + sq, 8, 2);
      [[4, 24, 2, 22], [8, 26, 6, 25], [20, 26, 22, 25], [24, 24, 28, 22]].forEach((q, i) => line(x, '#2e3a1e', q[0], q[1] - (pose === 'run' && i % 2 ? 2 : 0) - up, q[2], q[3] + (pose === 'leap' ? 2 : 0) - up, 2));
      line(x, '#3a4a26', 22, 16 - up, 30, 10 - up - (pose === 'bite' ? 4 : 0), 2); line(x, '#3a4a26', 22, 20 - up, 31, 18 - up, 2);
      rect(x, eye, 16, 16 - up + sq, 2, 2); rect(x, eye, 12, 17 - up + sq, 2, 2);
      if (pose === 'bite') { rect(x, '#e8ffe0', 28, 10 - up, 3, 2); rect(x, '#e8ffe0', 30, 16 - up, 3, 2); }
    };
    custom('rootling', 34, 28, 26, { idle: [knot('idle', SAP), knot('run', SAP)], run: [knot('run', SAP), knot('idle', SAP)], leap: [knot('leap', SAP)], bite: [knot('bite', '#ffffff'), knot('bite', SAP)], hurt: [knot('run', '#ffffff')], down: [knot('idle', '#1a2010')] });
    // the two wardens
    art.bake('grane', { head: 'hood', sc: 1.1, weapon: 'staff', armed: 1, c: { skin: '#d8b898', hair: '#2a3a1a', top: '#e8e4d8', pants: '#3a5a2a', boots: '#2a2a1a', belt: ROOT, chest: ROOT, trail: SAP, acc: SAP }, trailLen: 4, trailW: 3 }, 'enemy');
    recolor('grane2', 'grane', { top: '#5a8a3a', hair: '#b8ff40' });
    art.bake('orro', { head: 'helmet', sc: 1.18, weapon: 'baton', armed: 1, c: { skin: '#a87850', hair: '#1a1a24', top: '#d9b45a', pants: '#3a3f4e', boots: '#2b2f3a', belt: SKY, chest: '#ffffff', trail: SKY, acc: SKY }, trailLen: 4, trailW: 3 }, 'enemy');
    recolor('orro2', 'orro', { top: '#ff8a3a', pants: '#2a2e3a' });
    // rank and file
    recolor('tapcrew', 'guard', { top: '#e8e4d8', pants: '#3a6a2a', hair: '#7dff9a' });
    recolor('lineman', 'guard', { top: '#d9b45a', pants: '#3a3f4e', hair: '#1a1a24' });
    recolor('tapdrone', 'drone', null, { '#3a3f4e': '#2a4a2a', '#555b6e': '#4a7a3a', '#8a92a8': '#9ad890', '#2b2f3a': '#1a2a14', '#6fd3e8': SAP, '#1c1f28': '#10180c' });
    recolor('kitedrone', 'drone', null, { '#3a3f4e': '#c8ccd8', '#555b6e': '#e8ecf4', '#8a92a8': '#ffffff', '#2b2f3a': '#5a6078', '#6fd3e8': '#ff5a3a', '#1c1f28': '#2a2e3a' });
    recolor('rootknot', 'crawler', null, { '#b8703a': '#4a5a2a', '#8a4a26': '#2e3a1e', '#d08a4a': '#6a7a3a', '#5a2e18': '#1a2210', '#ffb040': ROOT, '#fff0b0': '#e8ffe0', '#3a2418': '#10140a', '#ff5a3a': SAP });
    recolor('clampcrawler', 'crawler', null, { '#b8703a': '#8a92a8', '#8a4a26': '#5a6078', '#d08a4a': '#c8ccd8', '#5a2e18': '#2a2e3a', '#ffb040': '#d9b45a', '#fff0b0': '#ffffff', '#3a2418': '#1a1c24', '#ff5a3a': '#ff8a3a' });
    ['tapdrone', 'kitedrone'].forEach(id => { const s = art.sheets[id]; if (s) { s.anims.run = s.anims.idle; s.anims.zap = s.anims.atk; } });
    ['rootknot', 'clampcrawler'].forEach(id => { const s = art.sheets[id]; if (s) s.anims.lunge = s.anims.run; });
  }
  const _init = art.init; art.init = function () { _init(); try { bakeBackdrops(); bakeRoots(); } catch (e) { console.error(e); } };

  Object.assign(D.speakers, {
    grane: { name: 'Root Warden Grane', sheet: 'grane', pitch: 360 }, orro: { name: 'Linewarden Orro', sheet: 'orro', pitch: 240 }
  });

  // ================= enemies and bosses =================
  Object.assign(E, {
    rootling:     { name: 'Rootling', sheet: 'rootling', hp: 58, dmg: 13, speed: 1.7, xp: 26, creds: 5, ai: 'leaper', aggro: 170, w: 20, h: 14, anims: { idle: 'idle', run: 'run', jump: 'leap', atk: 'bite' } },
    tapcrew:      { name: 'Halcyon Tap Crew', sheet: 'tapcrew', hp: 96, dmg: 14, speed: 0.95, xp: 32, creds: 15, ai: 'melee', range: 28, aggro: 170, blockEvery: 4, windup: 22, commit: true },
    tapdrone:     { name: 'Tap Drone', sheet: 'tapdrone', hp: 32, dmg: 9, speed: 1.15, xp: 18, creds: 6, ai: 'drone', aggro: 210, fly: true, w: 18, h: 14, shot: SAP, anims: { atk: 'zap' } },
    rootknot:     { name: 'Root Knot', sheet: 'rootknot', hp: 96, dmg: 14, speed: 0.5, xp: 34, creds: 8, ai: 'crawler', aggro: 120, armored: true, w: 30, h: 14, contact: true, anims: { atk: 'lunge' } },
    lineman:      { name: 'Halcyon Lineman', sheet: 'lineman', hp: 104, dmg: 15, speed: 1, xp: 36, creds: 16, ai: 'melee', range: 30, aggro: 180, blockEvery: 3, windup: 20, commit: true },
    kitedrone:    { name: 'Kite Drone', sheet: 'kitedrone', hp: 36, dmg: 10, speed: 1.3, xp: 20, creds: 7, ai: 'drone', aggro: 230, fly: true, w: 18, h: 14, shot: '#ff5a3a', anims: { atk: 'zap' } },
    clampcrawler: { name: 'Clamp Crawler', sheet: 'clampcrawler', hp: 104, dmg: 15, speed: 0.6, xp: 36, creds: 9, ai: 'crawler', aggro: 120, armored: true, w: 30, h: 14, contact: true, anims: { atk: 'lunge' } },
    grane: { name: 'ROOT WARDEN GRANE', sub: 'Halcyon taproot station', sheet: 'grane', sheet2: 'grane2', hp: 1040, dmg: 16, speed: 1.1, xp: 480, creds: 280, idle: 26, w: 14, h: 38, counter: 2, poise: 4,
      script: [['swings', { n: 2, reach: 56, col: SAP }, [3, 1]], ['lob', { n: 2, col: ROOT, dmg: 10 }, [1, 2]], ['lunge', {}, [1, 2]], ['summon', { kind: 'rootling', max: 2, hp: 30, p2: true }, [2, 2]]] },
    orro: { name: 'LINEWARDEN ORRO', sub: 'Halcyon tether line, anchor crown', sheet: 'orro', sheet2: 'orro2', hp: 1120, dmg: 17, speed: 1.25, xp: 520, creds: 300, idle: 24, w: 14, h: 38, counter: 2, poise: 4,
      script: [['swings', { n: 3, reach: 58, col: SKY }, [3, 1]], ['volley', { n: 3, kind: 'crescent', col: '#ff5a3a', speed: 4, gap: 14 }, [1, 3]], ['slam', { col: SKY }, [2, 2]], ['summon', { kind: 'kitedrone', max: 2, hp: 18, fly: true, p2: true }, [1, 2]]] }
  });

  // ---------- roots that come up under you: a glow gathers in the floor, then a column erupts ----------
  class Spike {
    constructor(x, y, warn, dmg, src) { Object.assign(this, { x, y, warn, dmg, src, t: 0 }); }
    update(g) {
      this.t++;
      if (this.t === this.warn) {
        sfx('explode'); fx.shake(4, 8); fx.debris(this.x, this.y - 6, '#4a5a2a', 10);
        SW.strike(g, { team: 'enemy', x: this.x - 11, y: this.y - 74, w: 22, h: 74, dmg: this.dmg, kx: 2, ky: -6, heavy: true, hitSet: new Set(), srcX: this.x, src: this.src });
      }
      if (this.t > this.warn + 20) this.gone = true;
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      if (this.t < this.warn) {
        const k = this.t / this.warn;
        ctx.globalAlpha = 0.3 + 0.5 * k; rect(ctx, SAP, x - 12, y - 2, 24, 2); rect(ctx, '#e8ffe0', x - 4 - k * 6, y - 1, 8 + k * 12, 1); ctx.globalAlpha = 1;
        if (this.t % 6 < 3) for (let i = 0; i < 3; i++) rect(ctx, ROOT, x - 8 + i * 8, y - 3 - (this.t % 5), 1, 2);
        return;
      }
      const u = this.t - this.warn, h = Math.min(74, u * 14) - Math.max(0, u - 12) * 9;
      if (h <= 0) return;
      rect(ctx, '#3a4a26', x - 7, y - h, 14, h); rect(ctx, '#5a6a32', x - 7, y - h, 3, h); rect(ctx, '#2e3a1e', x + 4, y - h, 3, h);
      rect(ctx, SAP, x - 2, y - h, 4, 4); line(ctx, '#3a4a26', x, y - h, x - 6, y - h - 8, 2); line(ctx, '#3a4a26', x, y - h + 6, x + 7, y - h - 4, 2);
    }
  }
  // the same thing on a timer, for the Taproot Stair and the Rootways
  class RootBurst {
    constructor(tx, row, off) { this.x = tx * T + 8; this.y = row * T; this.t = off === undefined ? Math.floor(Math.random() * 260) : off; this.kid = null; }
    update(g, z) { this.t++; if (this.t % 260 === 180 && g.player && Math.abs(g.player.x - this.x) < 360) z.add(new Spike(this.x, this.y, 44, 12)); }
    draw() {}
  }
  function* rootfield(b, g, z) {
    const p = g.player;
    b.faceTo(p); b.vx = 0; b.setPose('cast', 0); b.tele = 26; sfx('tele');
    for (let i = 0; i < 26; i++) yield;
    b.tele = 0; b.setPose('cast', 1); fx.ring(b.x, b.y - 20, SAP, 6, 40, 14);
    const lo = (b.ax0 || b.x - 300) + 16, hi = (b.ax1 || b.x + 300) - 16, xs = b.phase === 2 ? [p.x - 56, p.x, p.x + 56] : [p.x];
    xs.forEach((x, i) => z.add(new Spike(SW.clamp(x, lo, hi), b.y, 40 + i * 8, b.def.dmg)));
    for (let i = 0; i < 40; i++) yield;
    b.setPose('idle', 0);
  }
  // Orro swings up onto the tether, rides it over your head, and drops: his shadow on the deck shows where
  function* zipdrop(b, g) {
    const p = g.player;
    b.faceTo(p); b.vx = 0; b.setPose('jump', 0); b.tele = 22; sfx('tele');
    for (let i = 0; i < 22; i++) yield;
    b.tele = 0; sfx('jump'); fx.dust(b.x, b.y, 8);
    b.aloft = true; b.invuln = 9999;
    const lo = (b.ax0 || b.x - 300) + 30, hi = (b.ax1 || b.x + 300) - 30;
    for (let i = 0; i < 120; i++) {
      const tx = SW.clamp(p.x, lo, hi), dx = tx - b.x;
      if (i > 24 && Math.abs(dx) < 6) break;
      b.vx = Math.sign(dx) * Math.min(b.phase === 2 ? 5 : 4, Math.abs(dx));
      yield;
    }
    b.vx = 0; b.dropWarn = true;
    for (let i = 0; i < (b.phase === 2 ? 22 : 30); i++) yield;
    b.aloft = false; b.dropWarn = false; b.invuln = 0; b.setPose('a4', 1);
    sfx('explode'); fx.shake(9, 18); fx.dust(b.x, b.y, 18); fx.ring(b.x, b.y - 6, SKY, 6, 50, 12);
    SW.strike(g, { team: 'enemy', x: b.x - 36, y: b.y - 60, w: 72, h: 60, dmg: b.def.dmg + 3, kx: 5, ky: -6, heavy: true, unblockable: true, hitSet: new Set(), srcX: b.x, src: b });
    for (let i = 0; i < 34; i++) yield;
    b.setPose('idle', 0);
  }
  const B2 = SW.Boss2.prototype, _think = B2.think, _bdraw = B2.draw;
  B2.draw = function (ctx, cam) {
    if (!this.aloft) return _bdraw.apply(this, arguments);
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), t = SW.frame;
    line(ctx, '#c8ccd8', x - 200, -10, x + 200, 30, 1);
    ctx.save(); ctx.globalAlpha = this.dropWarn ? 0.6 : 0.3; ctx.translate(x, y - 1); ctx.scale(1, 0.22); disc(ctx, '#05060c', 0, 0, this.dropWarn ? 30 : 18); ctx.restore();   // a flat shadow on the deck
    if (this.dropWarn) { if (t % 8 < 5) { rect(ctx, '#ff5a3a', x - 38, y - 1, 76, 2); rect(ctx, '#ff5a3a', x - 38, y - 7, 2, 7); rect(ctx, '#ff5a3a', x + 36, y - 7, 2, 7); } SW.text(ctx, '!', x, y - 48, '#ffe040', { align: 'center' }); }
  };
  B2.think = function (g, z, p) {
    if (!this.gen && !this.dead && (this.type === 'grane' || this.type === 'orro')) {
      this.rcd = (this.rcd === undefined ? 150 : this.rcd) - 1;
      if (this.rcd <= 0 && this.idleT <= 2) {
        this.rcd = this.type === 'grane' ? (this.phase === 2 ? 300 : 420) : (this.phase === 2 ? 320 : 460);
        this.gen = this.type === 'grane' ? rootfield(this, g, z) : zipdrop(this, g);
        this.last = { name: this.type === 'grane' ? 'xRootfield' : 'xZipdrop' };
      }
    }
    return _think.call(this, g, z, p);
  };
  // anything Grane raised dies with her
  const EP = SW.Enemy.prototype, _edie = EP.die;
  EP.die = function (g) {
    const was = this.dead, r = _edie.apply(this, arguments);
    if (!was && (this.type === 'grane' || this.type === 'orro') && G.zone) G.zone.ents.forEach(e => { if ((e.type === 'rootling' || e.type === 'kitedrone') && !e.dead && e.ax0 !== undefined) { e.hp = 0; e.die(g); } });
    return r;
  };

  // ================= small machines =================
  class Banner {
    constructor(sub, col) { this.sub = sub; this.col = col; }
    update(g) { if (g.banner) { g.banner.sub = this.sub; g.banner.col = this.col; } this.gone = true; }
    draw() {}
  }
  // a Halcyon tap driven into a root: while it bleeds light, the roots around it tear loose and attack
  class Tap {
    constructor(tx, row, flag) { this.x = tx * T + 8; this.y = row * T; this.flag = flag; this.t = 0; this.cd = 90; this.kids = []; }
    update(g, z) {
      this.t++;
      const p = g.player;
      if (g.flag(this.flag)) return;
      if (!p || p.dead || g.busy() || Math.abs(p.x - this.x) > 260) return;
      this.kids = this.kids.filter(e => !e.dead);
      if (--this.cd <= 0 && this.kids.length < 2) {
        this.cd = 250;
        const side = p.x < this.x ? -1 : 1, ex = this.x + side * SW.rand(24, 56), e = SW.spawnEnemy('rootling', ex, this.y);
        e.state = 'chase'; z.add(e); this.kids.push(e); fx.debris(ex, this.y - 6, '#4a5a2a', 8); sfx('roar');
      }
    }
    draw(ctx, cam, g) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), open = !g.flag(this.flag);
      if (x < -60 || x > W + 60) return;
      art.prop(ctx, 'rootcoil', x, y, open ? SAP : '#3a4a26');
      art.prop(ctx, 'tap', x, y - 10, open ? SAP : '#5a6078');
      rect(ctx, '#4a5060', x - 4, y - 200, 8, 132); rect(ctx, '#6a7088', x - 4, y - 200, 2, 132);
      if (open) {
        const k = (this.t * 3) % 132; rect(ctx, SAP, x - 1, y - 72 - k, 3, 6);
        art.glow(ctx, x, y - 30, 26, SAP, 0.12 + 0.05 * Math.sin(this.t * 0.12));
        if (this.t % 30 < 4) fx.spark(x + SW.rand(-10, 10), y - 26, SAP, 2, 1);
      }
    }
  }
  // a Halcyon spotter beacon on an anchor stone: while lit it calls kite drones on anyone close
  class Beacon {
    constructor(tx, row, flag) { this.x = tx * T + 8; this.y = row * T; this.flag = flag; this.t = 0; this.cd = 80; this.kids = []; }
    update(g, z) {
      this.t++;
      const p = g.player;
      if (g.flag(this.flag)) return;
      if (!p || p.dead || g.busy() || Math.abs(p.x - this.x) > 300) return;
      this.kids = this.kids.filter(e => !e.dead);
      if (--this.cd <= 0 && this.kids.length < 2) {
        this.cd = 280;
        const ex = this.x + SW.rand(-60, 60), e = SW.spawnEnemy('kitedrone', ex, this.y - 70);
        e.state = 'chase'; z.add(e); this.kids.push(e); fx.ring(ex, this.y - 70, '#ff5a3a', 4, 26, 14); sfx('tele');
      }
    }
    draw(ctx, cam, g) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), lit = !g.flag(this.flag);
      if (x < -120 || x > W + 120) return;
      rect(ctx, '#5a6078', x - 2, y - 40, 4, 40); rect(ctx, '#3a3f4e', x - 8, y - 4, 16, 4);
      if (!lit) { rect(ctx, '#2a2e3a', x - 7, y - 48, 14, 9); for (let i = 0; i < 3; i++) rect(ctx, '#6a7088', x - 6 + i * 5, y - 2, 2, 2); return; }
      rect(ctx, '#e8ecf4', x - 7, y - 48, 14, 9); rect(ctx, '#ff5a3a', x - 5, y - 46, 10, 5);
      const a = this.t * 0.04, dir = Math.cos(a);
      ctx.globalAlpha = 0.16; for (let k = 0; k < 6; k++) line(ctx, '#ffe0a0', x, y - 44, x + dir * 120 + k * 4, y + 20 + k * 3, 2); ctx.globalAlpha = 1;
      art.glow(ctx, x, y - 44, 24, '#ff5a3a', 0.12 + 0.06 * Math.sin(this.t * 0.2));
    }
  }
  // a tether: a cable as thick as a tower, from an anchor stone up into the clouds, a green pipe clamped along it
  class Tether {
    constructor(tx, row, slant) { this.x = tx * T + 8; this.y = row * T; this.s = slant || 0.55; this.t = 0; }
    update() { this.t++; }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), tx = x + Math.round(y / this.s), ty = -20;
      if (Math.min(x, tx) > W + 40 || Math.max(x, tx) < -40) return;
      line(ctx, '#2a2620', x, y, tx, ty, 9); line(ctx, '#4a463c', x - 3, y, tx - 3, ty, 2); line(ctx, '#3a362e', x + 3, y, tx + 3, ty, 2);
      line(ctx, '#3a5a2a', x - 7, y, tx - 7, ty, 2);
      for (let k = 0; k < 3; k++) { const f = ((this.t * 0.006 + k / 3) % 1), px = x + (tx - x) * f - 7, py = y + (ty - y) * f; rect(ctx, SAP, Math.round(px) - 1, Math.round(py) - 1, 3, 3); }
      for (let k = 1; k < 8; k++) { const f = k / 8, px = Math.round(x + (tx - x) * f), py = Math.round(y + (ty - y) * f); rect(ctx, '#5a5650', px - 6, py - 1, 12, 3); }
    }
  }
  // wind off the cables: calm, dust streaks as a warning, then a gust that shoves you along
  class Gust {
    constructor(tx0, tx1, ty0, ty1, dir, off) { Object.assign(this, { x0: tx0 * T, x1: (tx1 + 1) * T, y0: ty0 * T, y1: (ty1 + 1) * T, dir, t: off || 0 }); }
    phase() { const c = this.t % 360; return c < 190 ? 'calm' : c < 235 ? 'warn' : c < 330 ? 'blow' : 'calm'; }
    update(g, z) {
      this.t++;
      const p = g.player;
      if (!p || p.dead || g.busy() || this.phase() !== 'blow') return;
      if (p.x < this.x0 || p.x > this.x1 || p.y < this.y0 || p.y - (p.h || 30) > this.y1) return;
      const dx = this.dir * (p.onGround ? 1.1 : 1.7), hw = (p.w || 14) / 2;
      if (!z.hit(p.x - hw + dx, p.y - (p.h || 30), hw * 2, (p.h || 30) - 1)) p.x += dx;
    }
    draw(ctx, cam) {
      const ph = this.phase();
      if (ph === 'calm') return;
      const n = ph === 'warn' ? 6 : 18;
      ctx.globalAlpha = ph === 'warn' ? 0.35 : 0.55;
      for (let i = 0; i < n; i++) {
        const span = this.x1 - this.x0, xx = this.x0 + ((i * 97 + this.t * (ph === 'warn' ? 2 : 7) * this.dir) % span + span) % span, yy = this.y0 + ((i * 53) % Math.max(16, this.y1 - this.y0));
        const sx = Math.round(xx - cam.x), sy = Math.round(yy - cam.y);
        if (sx < -30 || sx > W + 30) continue;
        rect(ctx, i % 3 ? '#e8d8b0' : '#ffffff', sx, sy, ph === 'warn' ? 6 : 16, 1);
      }
      ctx.globalAlpha = 1;
    }
  }

  // ================= missions =================
  Object.assign(M, {
    'RT-1': { id: 'RT-1', title: 'Under the Sump', hero: 'all', xp: 420, creds: 220, next: 'A3-2', steps: [
      { id: 'crack', t: 'Go down the Metro Shaft and look at the crack by the junction' }, { id: 'down', t: 'Climb down through the roots to the bottom of the stair' },
      { id: 'taps', t: 'Shut the three Halcyon taps in the Rootways', n: 3 }, { id: 'boss', t: 'Get past whoever tends the taps' }, { id: 'heart', t: 'Touch the heartroot' }] },
    'TF-1': { id: 'TF-1', title: 'The Tether Fields', hero: 'all', xp: 500, creds: 300, next: 'A3-3', steps: [
      { id: 'road', t: 'Take the Skylift road out of Scrapton, into the Tether Fields' }, { id: 'beacons', t: 'Cut the three spotter beacons', n: 3 },
      { id: 'climb', t: 'Climb the great tether to the anchor crown' }, { id: 'boss', t: 'Get past the Linewarden' }, { id: 'signal', t: 'Light the signal fire for the army' }] }
  });
  M['A3-1'].next = 'RT-1';
  M['A3-2'].next = 'TF-1';
  if (!M['A3-3']) M['TF-1'].next = null;
  // saves from before Act 4 existed: put them back on the road where it now runs
  const _cg = G.continueGame; G.continueGame = function () {
    _cg.apply(this, arguments);
    const S = G.state;
    if (!S || G.scene !== 'play') return;
    const fresh = id => !Object.keys(S.steps).some(k => k.indexOf(id + ':') === 0);
    if (S.done['A3-1'] && !S.done['RT-1'] && !S.done['A3-2'] && (!S.mission || (S.mission === 'A3-2' && fresh('A3-2')))) S.mission = 'RT-1';
    else if (S.done['A3-2'] && !S.done['TF-1'] && !S.done['A3-3'] && (!S.mission || (S.mission === 'A3-3' && fresh('A3-3')))) S.mission = 'TF-1';
  };

  // ---------- act cards ----------
  const C = story.cards;
  if (C.act2end) C.act2end.lines = C.act2end.lines.map(l => (l === 'CONVERGENCE begins now.' || l === 'ACT 3 - CONVERGENCE - begins now.' ? 'ACT 4 - ROOTS AND TETHERS - begins now.' : l));
  if (C.act3a) {
    C.act3a.title = 'THE DEEP STANDS WITH YOU';
    C.act3a.lines = ['Anvil is beaten, and the Pit has a new champion.', 'Every crew in Deepline owes you a favour now,', 'and every one of them has heard about the taps.', '',
      'The army is gathering. It cannot march on the Skylift', 'while Halcyon spotters watch the road.', '', 'NEXT: the Tether Fields, along the Skylift road', 'out of Scrapton. Esc > Mission.'];
  }
  C.act4end = { title: 'ACT 4 COMPLETE', lines: ['The taps in the Roots are shut. The Deep has a champion.', 'The spotters on the Tether Fields are blind,', 'and a signal fire burns on the great anchor.', '',
    'Aurelia drinks from the Roots, through the tethers.', 'Whatever keeps it in the sky, it is not the sun.', '', 'ACT 5 - CONVERGENCE - begins now.', 'NEXT: join the army at the Skylift gate. Esc > Mission.'] };

  // ================= THE ROOTS =================
  Z.rootstair = {
    name: 'The Taproot Stair', theme: 'roots', music: 'roots', w: 40, h: 60,
    build(z, g) {
      z.add(new Banner('BENEATH DEEPLINE', ROOT));
      z.fill(0, 0, 1, 60).fill(39, 0, 1, 51).ground(1, 39, 56);
      // ledges stepping down between the roots; drop off the open end of each, or take the root ladders
      z.fill(1, 8, 26, 2).fill(12, 18, 27, 2).fill(1, 28, 26, 2).fill(12, 38, 27, 2).fill(1, 47, 26, 2);
      z.ladder(24, 8, 10).ladder(14, 18, 10).ladder(24, 28, 10).ladder(14, 38, 9).ladder(24, 47, 9);
      z.spawn('top', 4, 7).spawn('bottom', 36, 55);
      z.exit(39, 51, 1, 5, 'rootways', 'west');
      z.thing('hatch', 2, 7, { prompt: 'Climb back up to the Old Metro', use: gg => gg.gotoZone('metro', 'roots') });
      z.trigger(3, 0, 6, 8, gg => { if (onRoad(gg, 'RT-')) gg.say('rt_stair'); }, { flag: 'rt_stair' });
      z.trigger(1, 50, 38, 6, gg => { if (onRoad(gg, 'RT-')) { gg.step('RT-1:down'); gg.say('rt_floor'); } }, { flag: 'rt_floor' });
      [[18, 8], [30, 18], [8, 28], [30, 38], [10, 47], [20, 56]].forEach((q, i) => z.add(new RootBurst(q[0], q[1], i * 47)));
      z.enemy('rootling', 16, 7); z.enemy('tapdrone', 30, 13); z.enemy('rootling', 34, 17);
      z.enemy('tapcrew', 8, 27); z.enemy('rootknot', 18, 27);
      z.enemy('tapcrew', 28, 37); z.enemy('tapdrone', 20, 33);
      z.enemy('rootling', 10, 46); z.enemy('rootknot', 20, 55); z.enemy('tapcrew', 30, 55);
      [[6, 7], [36, 17], [4, 27], [34, 37], [16, 46], [12, 55]].forEach((q, i) => z.prop(i % 2 ? 'rootcoil' : 'glowcap', q[0], q[1], { col: i % 2 ? SAP : ROOT }));
      z.prop('pipe', 37, 55, { col: SAP }).prop('pipe', 37, 37, { col: SAP }).prop('pipe', 2, 27, { col: SAP });
      lamp(z, 10, 7, ROOT); lamp(z, 32, 37, '#ffffff'); lamp(z, 26, 55, '#ffffff');
      z.save(6, 55, 'glyph');
    }
  };
  Z.rootways = {
    name: 'The Rootways', theme: 'roots', music: 'roots', w: 200, h: 26,
    build(z, g) {
      z.add(new Banner('BENEATH DEEPLINE', ROOT));
      z.fill(0, 0, 200, 3).ground(0, 199, 22);
      z.spawn('west', 2, 21).spawn('east', 196, 21);
      z.exit(0, 3, 1, 19, 'rootstair', 'bottom'); z.exit(199, 3, 1, 19, 'heartroot', 'west');
      z.trigger(1, 3, 6, 19, gg => { if (onRoad(gg, 'RT-')) gg.say('rt_ways'); }, { flag: 'rt_ways' });
      // root humps, and pools of sap that burn
      z.fill(16, 21, 5, 1).fill(17, 20, 3, 1).fill(60, 20, 6, 2).fill(62, 19, 2, 1).fill(112, 21, 6, 1).fill(170, 20, 5, 2);
      z.clear(30, 22, 6, 1).liquid(30, 23, 6, 2).plat(32, 20, 2);
      z.clear(78, 22, 7, 1).liquid(78, 23, 7, 2).plat(80, 20, 3);
      z.clear(128, 22, 8, 1).liquid(128, 23, 8, 2).plat(130, 20, 2).plat(134, 20, 2);
      [[10, 21], [40, 21], [70, 18], [96, 21], [122, 21], [146, 21], [184, 21]].forEach((q, i) => z.prop(i % 3 ? 'glowcap' : 'rootcoil', q[0], q[1], { col: i % 2 ? SAP : ROOT }));
      // three taps: hit the valve wheel at the foot of each
      const tap = (tx, n) => {
        z.add(new Tap(tx, 22, 'rt_t' + n));
        const tg = z.target(tx, 20, 'rt_t' + n);
        tg.onHit = gg => { gg.count('RT-1:taps'); fx.shake(5, 14); fx.spark(tg.x, tg.y, SAP, 24, 4); sfx('heavy'); const k = [1, 2, 3].filter(i => gg.flag('rt_t' + i)).length; gg.toast('Tap shut ({0}/3)'.replace('{0}', k), ROOT); if (k === 3) gg.say('rt_taps'); };
      };
      tap(48, 1); tap(104, 2); tap(156, 3);
      [24, 66, 88, 118, 140, 176].forEach((x, i) => z.add(new RootBurst(x, 22, i * 43)));
      z.enemy('rootling', 22, 21); z.enemy('tapcrew', 40, 21); z.enemy('tapdrone', 56, 12);
      z.enemy('rootknot', 70, 21); z.enemy('tapcrew', 90, 21);
      z.save(94, 21, 'glyph'); z.pickup('item', 97, 21); lamp(z, 92, 21, '#ffffff');
      z.enemy('tapdrone', 112, 11); z.enemy('rootknot', 120, 21); z.enemy('tapcrew', 144, 21); z.enemy('rootling', 166, 21); z.enemy('tapcrew', 180, 21); z.enemy('tapdrone', 186, 12);
      z.hint(40, 10, 6, 12, 'Hit the valve wheel at the foot of each tap to shut it.');
      z.gate(192, 3, 19, { openIf: gg => [1, 2, 3].every(i => gg.flag('rt_t' + i)) || !onRoad(gg, 'RT-') });
    }
  };
  Z.heartroot = {
    name: 'The Heartroot', theme: 'heart', music: 'roots', w: 72, h: 24,
    build(z, g) {
      z.add(new Banner('BENEATH DEEPLINE', ROOT));
      z.fill(0, 0, 72, 2).fill(71, 0, 1, 24).ground(0, 70, 20);
      z.spawn('west', 2, 19);
      z.exit(0, 2, 1, 18, 'rootways', 'east');
      z.prop('heartroot', 64, 19, { col: SAP });
      [10, 22, 36, 48].forEach((x, i) => z.prop(i % 2 ? 'rootcoil' : 'glowcap', x, 19, { col: i % 2 ? SAP : ROOT }));
      z.arena({ id: 'grane', x0: 6, x1: 60, gy: 19, gh: 16, boss: true, enemies: [['grane', 50, 19]], intro: 'rt_grane_in', win: 'rt_grane_win', music: 'boss', onWin: gg => gg.step('RT-1:boss') });
      z.thing('core', 62, 19, { prompt: 'Touch the heartroot', glow: SAP, hide: () => true, when: gg => !!gg.flag('arena:heartroot:grane') && !gg.flag('rt_heart'), use: gg => gg.say('rt_heart') });
      z.thing('console', 68, 19, { prompt: 'Ride the tap-pipe lift up to the Old Metro', when: gg => !!gg.flag('rt_heart'), use: gg => gg.gotoZone('metro', 'roots') });
    }
  };
  // the Old Metro: the tunnel floor by the foot of the shaft has split open
  story.patch('metro', (z, g) => {
    z.spawn('roots', 151, 29);
    const open = gg => onRoad(gg, 'RT-') || !!gg.state.done['RT-1'];
    z.thing('hatch', 150, 29, { prompt: 'Climb down through the crack', glow: ROOT, when: open, hide: gg => !open(gg), use: gg => gg.gotoZone('rootstair', 'top') });
    z.trigger(143, 22, 14, 8, gg => { if (onRoad(gg, 'RT-') && !gg.state.steps['RT-1:crack']) { gg.step('RT-1:crack'); gg.say('rt_crack'); } }, { once: false });
  });

  // ================= THE TETHER FIELDS =================
  Z.tethers = {
    name: 'The Tether Fields', theme: 'tether', music: 'tether', w: 210, h: 26,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.ground(0, 209, 21);
      z.spawn('west', 3, 20).spawn('east', 206, 20);
      z.exit(0, 4, 1, 17, 'scrapton', 'skylift'); z.exit(209, 4, 1, 17, 'tetherclimb', 'bottom');
      z.trigger(1, 4, 7, 17, gg => { if (onRoad(gg, 'TF-')) { gg.step('TF-1:road'); gg.say('tf_fields'); } }, { flag: 'tf_in' });
      // tethers behind everything, rising from their anchor stones
      [[24, 21], [48, 17], [109, 15], [140, 21], [163, 13], [196, 21]].forEach(q => z.add(new Tether(q[0], q[1])));
      // three anchor stones, a spotter beacon on top of each
      z.fill(44, 17, 8, 4).plat(40, 19, 3);
      z.fill(104, 15, 10, 6).plat(98, 19, 3).plat(101, 17, 3);
      z.fill(158, 13, 10, 8).plat(149, 19, 3).plat(152, 17, 3).plat(155, 15, 3);
      const beacon = (tx, row, n) => {
        z.add(new Beacon(tx, row, 'tf_b' + n));
        const tg = z.target(tx, row - 2, 'tf_b' + n);
        tg.onHit = gg => { gg.count('TF-1:beacons'); fx.shake(5, 14); fx.spark(tg.x, tg.y, '#ff5a3a', 24, 4); sfx('explode'); const k = [1, 2, 3].filter(i => gg.flag('tf_b' + i)).length; gg.toast('Beacon cut ({0}/3)'.replace('{0}', k), '#ff8a3a'); if (k === 3) gg.say('tf_beacons'); };
      };
      beacon(48, 17, 1); beacon(109, 15, 2); beacon(163, 13, 3);
      [[56, 96, 4, 20, -1, 0], [118, 150, 4, 20, -1, 120], [170, 200, 4, 20, -1, 240]].forEach(q => z.add(new Gust(q[0], q[1], q[2], q[3], q[4], q[5])));
      [12, 34, 70, 132, 182].forEach((x, i) => z.prop(i % 2 ? 'anchorstone' : 'turbine', x, 20, { col: '#5aa86a' }));
      z.prop('banner', 30, 20, { col: '#d9b45a' }).prop('crate', 60, 20).prop('crate', 61, 20).prop('banner', 120, 20, { col: '#d9b45a' }).prop('crate', 176, 20);
      z.enemy('lineman', 30, 20); z.enemy('clampcrawler', 60, 20); z.enemy('kitedrone', 74, 10);
      z.save(88, 20, 'glyph'); z.pickup('item', 91, 20);
      z.enemy('lineman', 96, 20); z.enemy('gunner', 120, 20); z.enemy('clampcrawler', 136, 20);
      z.enemy('lineman', 150, 20); z.enemy('kitedrone', 172, 9); z.enemy('lineman', 182, 20); z.enemy('veilguard', 192, 20);
      z.hint(36, 10, 6, 10, 'Climb onto each anchor stone and hit the beacon on top to cut it.');
      z.gate(202, 4, 17, { openIf: gg => [1, 2, 3].every(i => gg.flag('tf_b' + i)) || !onRoad(gg, 'TF-') });
    }
  };
  Z.tetherclimb = {
    name: 'The Great Tether', theme: 'climb', music: 'tether', w: 36, h: 64,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.fill(0, 0, 1, 54).fill(35, 0, 1, 6).fill(35, 12, 1, 52).ground(1, 34, 60);
      z.add(new Tether(4, 60, 0.45));
      // the maintenance ladder up the anchor tower: platform after platform
      z.fill(1, 52, 24, 1).fill(11, 44, 24, 1).fill(1, 36, 24, 1).fill(11, 28, 24, 1).fill(1, 20, 24, 1).fill(11, 12, 24, 1);
      z.ladder(22, 52, 8).ladder(13, 44, 8).ladder(22, 36, 8).ladder(13, 28, 8).ladder(22, 20, 8).ladder(13, 12, 8);
      z.spawn('bottom', 3, 59).spawn('top', 32, 11);
      z.exit(0, 54, 1, 6, 'tethers', 'east'); z.exit(35, 6, 1, 6, 'anchor', 'west');
      z.trigger(1, 54, 10, 6, gg => { if (onRoad(gg, 'TF-')) gg.say('tf_climb'); }, { flag: 'tf_climb' });
      z.trigger(26, 4, 9, 8, gg => { if (onRoad(gg, 'TF-')) gg.step('TF-1:climb'); }, { flag: 'tf_top' });
      [[1, 34, 45, 51, 1, 0], [1, 34, 29, 35, -1, 90], [1, 34, 13, 19, 1, 180], [1, 34, 37, 43, -1, 270]].forEach(q => z.add(new Gust(q[0], q[1], q[2], q[3], q[4], q[5])));
      z.enemy('lineman', 16, 59); z.enemy('kitedrone', 26, 46); z.enemy('clampcrawler', 18, 43);
      z.enemy('lineman', 8, 35); z.enemy('kitedrone', 20, 22); z.enemy('lineman', 28, 27); z.enemy('kitedrone', 10, 8);
      z.save(30, 59, 'glyph'); lamp(z, 32, 43, '#d9b45a'); lamp(z, 4, 19, '#d9b45a');
    }
  };
  Z.anchor = {
    name: 'The Anchor Crown', theme: 'crown', music: 'tether', w: 72, h: 20,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.ground(0, 71, 16).fill(71, 0, 1, 16);
      z.spawn('west', 2, 15);
      z.exit(0, 4, 1, 12, 'tetherclimb', 'top');
      z.add(new Tether(30, 16, 0.5));
      z.prop('anchorstone', 30, 15, { col: '#5aa86a' }).prop('banner', 8, 15, { col: '#d9b45a' });
      z.arena({ id: 'orro', x0: 4, x1: 56, gy: 15, gh: 14, boss: true, enemies: [['orro', 46, 15]], intro: 'tf_orro_in', win: 'tf_orro_win', music: 'boss', onWin: gg => gg.step('TF-1:boss') });
      z.thing('signal', 61, 15, { prompt: 'Light the signal fire', glow: '#ff8a3a', when: gg => !!gg.flag('arena:anchor:orro') && !gg.flag('tf_signal'), use: gg => gg.say('tf_signal'),
        tick: (gg, t) => { if (gg.flag('tf_signal') && SW.frame % 4 === 0) fx.spark(t.x + SW.rand(-6, 6), t.y - 20, SW.frame % 8 ? '#ff8a3a' : '#ffe040', 2, 2); } });
      z.thing('zipline', 67, 15, { prompt: 'Ride the zipline down to the Skylift gate', col: SKY, when: gg => !!gg.flag('tf_signal') && !!Z.skylift, use: gg => gg.gotoZone('skylift', 'gate') });
    }
  };
  // Scrapton: Marlo between jobs, and the Skylift road goes through the Tether Fields while TF-1 is on
  story.patch('scrapton', (z, g) => {
    const S = g.state;
    z.ents.forEach(e => {
      if (e instanceof SW.NPC && e.sheet === 'marlo') { const t0 = e.talk; e.talk = gg => (onRoad(gg, 'RT-') ? 'r_rt_marlo' : onRoad(gg, 'TF-') ? 'r_tf_marlo' : typeof t0 === 'function' ? t0(gg) : t0); }
      if (e instanceof SW.Thing && e.prompt === 'Take the road to the Skylift gate') {
        const w0 = e.when, u0 = e.use, fields = gg => onRoad(gg, 'TF-');
        e.when = gg => fields(gg) || (!!w0 && w0(gg) && (!!gg.state.done['TF-1'] || !!gg.state.done['A3-3'] || gg.state.mission === 'A3-3'));
        e.use = gg => (fields(gg) ? gg.gotoZone('tethers', 'west') : u0(gg));
        e.tick = gg => { e.prompt = fields(gg) ? 'Take the road into the Tether Fields' : 'Take the road to the Skylift gate'; };
      }
    });
  });

  // ---------- the world map ----------
  D.world.push({ id: 'rootstair', name: 'The Roots', layer: 2, x: 290, y: 236 }, { id: 'tethers', name: 'Tether Fields', layer: 1, x: 235, y: 100 });
  D.routes.push(['metro', 'rootstair'], ['scrapton', 'tethers']);
  const GROUP = { rootways: 'rootstair', heartroot: 'rootstair', tetherclimb: 'tethers', anchor: 'tethers' };
  const _map = SW.ui.drawMap; SW.ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };

  story.roots = { Spike, RootBurst, Tap, Beacon, Tether, Gust, rootfield, zipdrop, PROPS };
})();
