'use strict';
// Shattered Worlds — the world below Deepline: the MIDDLE DEEP and THE ROOTS. Moved from the first story mode's
// story-middle.js and story-roots.js when that story was removed: the places, their look, music, props, sprites,
// enemies, bosses and terrain machines are unchanged; the story (people, scenes, missions, triggers, arenas, taps and
// gates that ran it) is gone. Helpers (recolor, patch, tune, SW.Boss2) come from world-kit.js (SW.world).
//   THE MIDDLE DEEP   everything between Deepline and the sun, climbing from the top of the Metro Shaft: the Shafts,
//                     the Waterworks, the Fungal Hollows and the Breach (whose seal-guardian, the Keystone, is kept as an
//                     enemy). The Breach ladder comes out at the Scrapton hatch.
//   THE ROOTS         glowing roots under the tunnel floor at the foot of the Metro Shaft, tapped by Halcyon: the
//                     Taproot Stair, the Rootways and the Heartroot (boss kept as an enemy: Root Warden Grane).
// Also here, because the Underside and the Tether Fields (world-sky.js) share them: the Middle Deep's props (incl. the
// lantern the Hollow Crown's village hangs), the Roots' sprite bakes (incl. the Tether Fields' rank and file and
// Linewarden Orro) and the Root/Line wardens' special moves.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, world = SW.world, Z = SW.zones;
  const E = D.enemies, TH = art.themes;
  if (!world || !world.patch || !world.tune) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring;
  const sfx = n => SW.audio.sfx(n);
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16;

  // ================= look: themes, music, props =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    shaft:      theme('metro', { style: 'brick', a: '#3a3430', b: '#2e2824', top: '#6a5a48', hi: '#a08a68', deep: '#120e0c', plat: '#8a6a3a', sky: ['#06060a', '#1e1812'], mid: 'arches', midCol: '#120e0b', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#f5c542'] }),
    waterworks: theme('metro', { style: 'plate', a: '#2a4a52', b: '#223e46', top: '#4a8a92', hi: '#8ad0d8', deep: '#0a1a20', plat: '#6a8a7a', sky: ['#03101a', '#0c2a36'], mid: 'lab', midCol: '#081a22', bg: 'none', dim: 0, haz: '#3ad0ff', win: ['#3ad0ff'] }),
    hollows:    theme('metro', { style: 'dirt', a: '#2e2440', b: '#261e36', top: '#5a3a7a', hi: '#b88aff', deep: '#0e0a18', plat: '#4a6a3a', sky: ['#06040e', '#1a1030'], mid: 'ruins', midCol: '#0c0818', bg: 'none', dim: 0, haz: '#b8ff40', win: ['#7dffb2'] }),
    breach:     theme('metro', { style: 'brick', a: '#4a4640', b: '#3c3832', top: '#7a7468', hi: '#d8c8a0', deep: '#1a1814', plat: '#8a7a50', sky: ['#0a0a0c', '#2e2a22'], mid: 'arches', midCol: '#16140f', bg: 'none', dim: 0, haz: '#f5c542', win: ['#f5c542'] }),
  });
  SW.audio.tracks.middle = { bpm: 78, root: 38, prog: [0, -4, -2, -5], arp: [0, 3, 7, 10, 7, 3, 12, 3], bass: 'triangle', drums: 0.35 };

  // props drawn with a colour (the cache is per kind and colour)
  const PROPS = {
    valve: [20, 26, (x, c) => { rect(x, '#3a4a50', 0, 20, 20, 6); rect(x, '#5a6a70', 0, 20, 20, 2); rect(x, '#4a5a60', 8, 8, 4, 13); ring(x, c, 10, 8, 6); ring(x, c, 10, 8, 5); line(x, c, 4, 8, 16, 8, 1); line(x, c, 10, 2, 10, 14, 1); disc(x, '#c8ccd8', 10, 8, 2); }],
    glowcap: [28, 34, (x, c) => { rect(x, '#d8d0c0', 12, 14, 4, 20); rect(x, '#b8b0a0', 12, 14, 1, 20); [12, 20, 26, 28, 24].forEach((w, i) => rect(x, c, 14 - w / 2, 2 + i * 2, w, 2)); rect(x, '#2a1a3a', 2, 12, 24, 1); [[7, 5], [15, 3], [20, 7], [10, 9]].forEach(q => rect(x, '#e8ffe0', q[0], q[1], 2, 2)); }],
    pipe: [16, 80, (x, c) => { rect(x, '#2a4a52', 4, 0, 8, 80); rect(x, '#4a8a92', 4, 0, 2, 80); for (let j = 6; j < 80; j += 22) { rect(x, '#5a9aa2', 2, j, 12, 4); rect(x, c, 7, j + 1, 2, 2); } }],
    seal: [72, 72, (x, c) => { disc(x, '#3a2a10', 36, 36, 34); ring(x, c, 36, 36, 33); ring(x, c, 36, 36, 32); ring(x, '#8a6a20', 36, 36, 26); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line(x, c, 36 + Math.cos(a) * 12, 36 + Math.sin(a) * 12, 36 + Math.cos(a) * 30, 36 + Math.sin(a) * 30, 2); } disc(x, c, 36, 36, 10); disc(x, '#fff7d0', 36, 36, 5); }],
    lantern: [10, 18, (x, c) => { rect(x, '#3a3040', 4, 0, 2, 5); rect(x, '#3a3040', 1, 4, 8, 2); rect(x, c, 2, 6, 6, 9); rect(x, '#ffffff', 4, 8, 2, 4); rect(x, '#3a3040', 1, 15, 8, 2); }],
    hatchup: [32, 12, (x, c) => { rect(x, '#3a3632', 0, 4, 32, 8); rect(x, '#6a5a48', 2, 2, 28, 4); rect(x, c, 13, 3, 6, 2); rect(x, '#1a1612', 4, 8, 24, 2); }]
  };
  const pcache = {}, _prop = art.prop, _psize = art.propSize;
  art.prop = function (ctx, kind, x, y, col, flip) {
    const d = PROPS[kind];
    if (!d) return _prop.apply(this, arguments);
    const c0 = col || '#ff5a5a', key = kind + c0;
    let c = pcache[key];
    if (!c) { const cv = SW.canvas(d[0], d[1]); d[2](cv[1], c0); c = pcache[key] = cv[0]; }
    ctx.drawImage(c, Math.round(x - d[0] / 2), Math.round(y - d[1]));
  };
  art.propSize = kind => (PROPS[kind] ? [PROPS[kind][0], PROPS[kind][1]] : _psize(kind));

  // ================= the new faces =================
  function bakeMiddle() {
    const custom = art.custom, recolor = world.recolor;
    // --- the Middle Deep ---
    const crat = (f, eye) => x => {
      rect(x, '#4a4440', 5, 6, 12, 6); rect(x, '#5e5650', 6, 5, 10, 2); rect(x, '#4a4440', 15, 5, 6, 5); rect(x, '#6a625a', 20, 7, 2, 2);
      rect(x, '#3a3430', 15, 3, 2, 2); rect(x, eye, 18, 6, 1, 1); rect(x, '#c87a3a', 7, 5, 7, 1); rect(x, '#c87a3a', 9, 4, 3, 1);
      line(x, '#c87a3a', 5, 9, 1, 7 + (f ? 1 : -1), 1); rect(x, '#9af0ff', 0, 6 + (f ? 1 : -1), 2, 2);
      rect(x, '#2a2420', f ? 6 : 8, 12, 2, 2); rect(x, '#2a2420', f ? 14 : 12, 12, 2, 2);
    };
    custom('cablerat', 24, 16, 14, { idle: [crat(0, '#6fd3e8')], run: [crat(0, '#6fd3e8'), crat(1, '#6fd3e8')], hurt: [crat(1, '#ffffff')], down: [crat(0, '#2a2420')] });
    const sludge = (sq, eye) => x => {
      rect(x, '#24301c', 3 - sq, 10 + sq, 22 + sq * 2, 8 - sq); rect(x, '#3a4a2a', 5 - sq, 8 + sq, 18 + sq * 2, 4); disc(x, '#3a4a2a', 14, 9 + sq, Math.max(2, 6 - sq));
      rect(x, '#5a7a3a', 8, 7 + sq, 5, 2); rect(x, '#9aff6a', 10, 7 + sq, 1, 1);
      rect(x, eye, 16, 10 + sq, 2, 2); rect(x, eye, 20, 10 + sq, 2, 2); rect(x, '#24301c', 2, 17, 3, 1); rect(x, '#24301c', 23, 17, 3, 1);
    };
    custom('sludge', 28, 20, 18, { idle: [sludge(0, '#e8ff9a'), sludge(1, '#e8ff9a')], run: [sludge(1, '#e8ff9a'), sludge(-1, '#e8ff9a')], hurt: [sludge(2, '#ffffff')], down: [sludge(3, '#24301c')] });
    const pdrone = (rot, eye) => x => {
      disc(x, '#2a4a52', 15, 12, 8); disc(x, '#3a6a72', 14, 11, 6); rect(x, '#8ad0d8', 11, 7, 4, 2); rect(x, '#1a2a30', 7, 11, 16, 2);
      rect(x, eye, 18, 10, 4, 4); rect(x, '#ffffff', 20, 10, 1, 1); rect(x, '#4a5a60', 14, 2, 2, 4); rect(x, '#c8d8e0', rot ? 6 : 10, 1, rot ? 18 : 10, 1);
      rect(x, '#3ad0ff', 12, 20, 6, 2); rect(x, '#8af0ff', 14, 21, 2, 2);
    };
    custom('pumpdrone', 30, 24, 22, { idle: [pdrone(0, '#3ad0ff'), pdrone(1, '#3ad0ff')], run: [pdrone(0, '#3ad0ff'), pdrone(1, '#3ad0ff')], zap: [pdrone(0, '#ffffff'), pdrone(1, '#ff5a5a')], hurt: [pdrone(1, '#ff5a5a')], down: [pdrone(0, '#1a2a30')] });
    const spore = (st, l, eye, cap) => x => {
      rect(x, '#d8d0c0', 9, 13, 7, 8); rect(x, '#b8b0a0', 9, 13, 2, 8);
      rect(x, '#8a7e70', st ? 7 : 9, 21, 3, 3); rect(x, '#8a7e70', st ? 15 : 13, 21, 3, 3);
      [10, 16, 20, 22, 22].forEach((w, i) => rect(x, cap, 12 + l - w / 2, 2 + i * 2, w, 2)); rect(x, '#2a1a3a', 2 + l, 12, 20, 1);
      [[7, 5], [14, 4], [17, 8], [9, 9]].forEach(q => rect(x, '#e8ff9a', q[0] + l, q[1], 2, 2));
      rect(x, eye, 10, 15, 2, 2); rect(x, eye, 14, 15, 2, 2);
    };
    const SC = '#7a3a9a';
    custom('sporeling', 24, 26, 24, { idle: [spore(0, 0, '#2a1a3a', SC), spore(1, 0, '#2a1a3a', SC)], run: [spore(0, 1, '#2a1a3a', SC), spore(1, 1, '#2a1a3a', SC)],
      bite: [spore(0, -2, '#ff5a5a', SC), spore(1, 2, '#ffffff', '#a85aca')], hurt: [spore(0, -2, '#ffffff', '#a85aca')], down: [spore(0, 0, '#2a1a3a', '#4a2a5a')] });
    // --- THE KEYSTONE: a wall that stood up. Halcyon's gold seal set in its chest ---
    const golem = (o, cr) => x => {
      const c = o.crouch || 0, l = o.lean || 0, k1 = o.leg === 1 ? 3 : o.leg === 2 ? -3 : 0, eye = o.eye || (cr ? '#ff5a3a' : '#f5c542'), seal = o.seal || (cr ? '#ff8a3a' : '#ffe7a8');
      rect(x, '#4a463e', 30 + k1, 66 + c, 16, 26 - c); rect(x, '#5e5a50', 30 + k1, 66 + c, 4, 26 - c); rect(x, '#3a362e', 26 + k1, 90, 24, 4);
      rect(x, '#4a463e', 58 - k1, 66 + c, 16, 26 - c); rect(x, '#5e5a50', 58 - k1, 66 + c, 4, 26 - c); rect(x, '#3a362e', 54 - k1, 90, 24, 4);
      rect(x, '#4e4a42', 10 + l, 34 + c + (o.armL || 0), 12, 30); rect(x, '#3e3a32', 8 + l, 62 + c + (o.armL || 0), 16, 12);
      rect(x, '#6a665c', 22 + l, 28 + c, 60, 40); rect(x, '#7e7a6e', 22 + l, 28 + c, 60, 4); rect(x, '#4e4a42', 22 + l, 28 + c, 6, 40); rect(x, '#4e4a42', 76 + l, 28 + c, 6, 40);
      line(x, '#4e4a42', 30 + l, 40 + c, 40 + l, 64 + c, 1); line(x, '#4e4a42', 70 + l, 36 + c, 66 + l, 62 + c, 1); rect(x, '#8a8478', 24 + l, 66 + c, 56, 2);
      disc(x, '#5e5a50', 22 + l, 32 + c, 10); disc(x, '#6e6a60', 20 + l, 30 + c, 6); disc(x, '#5e5a50', 82 + l, 32 + c, 10); disc(x, '#6e6a60', 84 + l, 30 + c, 6);
      rect(x, '#5e5a50', 40 + l, 14 + c, 24, 16); rect(x, '#7e7a6e', 40 + l, 14 + c, 24, 3); rect(x, '#2a261e', 45 + l, 20 + c, 14, 5); rect(x, eye, 46 + l, 21 + c, 12, 3);
      rect(x, '#5e5a50', 84 + l, 34 + c + (o.armR || 0), 12, 28); rect(x, '#6e6a60', 84 + l, 34 + c + (o.armR || 0), 3, 28); rect(x, '#4a463e', 82 + l, 60 + c + (o.armR || 0), 18, 14); rect(x, '#d9b45a', 82 + l, 60 + c + (o.armR || 0), 18, 2);
      disc(x, '#3a2a10', 52 + l, 46 + c, 11); ring(x, '#f5c542', 52 + l, 46 + c, 10); ring(x, '#d9b45a', 52 + l, 46 + c, 9);
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; line(x, '#d9b45a', 52 + l + Math.cos(a) * 5, 46 + c + Math.sin(a) * 5, 52 + l + Math.cos(a) * 9, 46 + c + Math.sin(a) * 9, 1); }
      disc(x, seal, 52 + l, 46 + c, 5); rect(x, '#ffffff', 51 + l, 43 + c, 2, 2);
      if (cr) { line(x, '#ff5a3a', 46 + l, 36 + c, 57 + l, 56 + c, 1); line(x, '#ff5a3a', 57 + l, 38 + c, 47 + l, 55 + c, 1); line(x, '#ff8a3a', 30 + l, 32 + c, 37 + l, 58 + c, 1); line(x, '#ff8a3a', 72 + l, 34 + c, 65 + l, 60 + c, 1); line(x, '#ff8a3a', 44 + l, 16 + c, 50 + l, 28 + c, 1); }
    };
    const gsheet = (id, cr) => custom(id, 104, 96, 94, {
      idle: [golem({}, cr), golem({ crouch: 1 }, cr)], run: [golem({ leg: 1 }, cr), golem({ leg: 2 }, cr)],
      a1: [golem({ armR: -22, lean: -3 }, cr), golem({ armR: 6, lean: 5 }, cr)], a4: [golem({ armL: -24, armR: -24, lean: -2 }, cr), golem({ armL: 4, armR: 4, crouch: 6, lean: 3 }, cr)],
      special: [golem({ crouch: 5, lean: -4, eye: '#ffffff' }, cr)], dash: [golem({ leg: 1, lean: 6 }, cr), golem({ leg: 2, lean: 6 }, cr)],
      cast: [golem({ armR: -28 }, cr), golem({ armR: -10, lean: 3 }, cr)], jump: [golem({ armL: -20, armR: -20 }, cr)], cheer: [golem({ armL: -26, armR: -26, eye: '#ffffff' }, cr)],
      tele: [golem({ crouch: 3, eye: '#ffffff' }, cr)], hurt: [golem({ lean: -6, eye: '#ffffff' }, cr)], down: [golem({ crouch: 14, lean: -8, eye: '#2a261e', seal: '#3a2a10' }, cr)]
    }, '#100e0a');
    gsheet('keystone', false); gsheet('keystone2', true);
    // --- people and the rank and file, as recoloured cast ---
    recolor('wick', 'ferro', { top: '#5a4a3a', hair: '#e8e4d8', pants: '#3a3430' });
    recolor('lumen', 'odile', { top: '#2a5a6a', hair: '#d8f0ff', pants: '#2a3a4a' }, { '#f4f1ea': '#7fe8ff' });
    recolor('lamper', 'tamsin', { top: '#3a6a6a', hair: '#2a2030', pants: '#2a3a3a' }, { '#ffffff': '#7fe8ff' });
    recolor('scavenger', 'ganger', { top: '#5a4a3a', pants: '#3a3028', hair: '#b8a888' }, { '#f5c542': '#d8c8a0' });
    recolor('brute', 'brawler', { top: '#4a3a5a', skin: '#9a8ab0', hair: '#b8ff6a', pants: '#2e2a3a' });
  }
  // the backdrops (quarter scroll speed, behind everything): 512 x 300, they repeat sideways, mirrored every other time
  function bakeMids() {
    const paint = (id, fn) => { const cv = SW.canvas(512, 300); fn(cv[1], SW.rng(id.length * 131 + 7)); art.bg['mid_' + id] = cv[0]; TH[id].bg = 'mid_' + id; TH[id].dim = 0; };
    const sh = art.shade;
    paint('shaft', (x, r) => {
      for (let i = 0; i < 6; i++) { const gx = 20 + i * 86; rect(x, '#14100d', gx, 0, 10, 300); rect(x, '#1e1813', gx, 0, 2, 300); for (let y = 10; y < 300; y += 40) { line(x, '#14100d', gx, y, gx + 76, y + 40, 2); } }
      for (let i = 0; i < 4; i++) { const cx = 60 + i * 128 + (r() * 30 | 0), cy = 40 + (r() * 160 | 0); rect(x, '#2a2018', cx, 0, 1, cy); rect(x, '#1a140f', cx - 14, cy, 28, 30); for (let k = 0; k < 4; k++) rect(x, '#2a2018', cx - 12 + k * 8, cy + 2, 1, 26); rect(x, sh('#f5c542', 0.4), cx - 2, cy + 12, 3, 3); }
    });
    paint('waterworks', (x, r) => {
      rect(x, '#0a2028', 0, 60, 512, 18); rect(x, '#12303a', 0, 60, 512, 3); rect(x, '#0a2028', 0, 150, 512, 12);
      for (let i = 0; i < 5; i++) { const px = 30 + i * 104; rect(x, '#0a2028', px, 0, 22, 300); rect(x, '#12303a', px, 0, 4, 300); for (let y = 30; y < 300; y += 70) rect(x, '#163a46', px - 4, y, 30, 6); }
      for (let i = 0; i < 3; i++) { const tx = 70 + i * 170; rect(x, '#0c242c', tx, 190, 60, 110); rect(x, '#14343e', tx, 190, 60, 4); disc(x, '#0c242c', tx + 30, 190, 30); for (let k = 0; k < 3; k++) rect(x, sh('#3ad0ff', 0.45), tx + 10 + k * 18, 220, 6, 2); }
      for (let i = 0; i < 30; i++) rect(x, sh('#3ad0ff', 0.35), r() * 512 | 0, r() * 300 | 0, 1, 4);
    });
    paint('hollows', (x, r) => {
      for (let i = 0; i < 7; i++) {
        const mx = i * 74 + (r() * 30 | 0), h = 150 + (r() * 130 | 0), w = 50 + (r() * 60 | 0), top = 300 - h, cap = i % 2 ? '#2e1c4a' : '#24163e';
        rect(x, '#1c1230', mx - 5, top, 10, h); rect(x, '#2a1c44', mx - 5, top, 2, h);
        for (let k = 0; k < 6; k++) { const ww = w * [0.5, 0.75, 0.9, 1, 1, 0.92][k]; rect(x, cap, mx - ww / 2, top - 14 + k * 3, ww, 3); }
        for (let k = 0; k < 5; k++) rect(x, k % 2 ? sh('#7fe8ff', 0.55) : sh('#b8ff40', 0.5), mx - w / 2 + 6 + (r() * (w - 12) | 0), top - 12 + (r() * 10 | 0), 2, 2);
      }
      for (let i = 0; i < 12; i++) { const rx = r() * 512 | 0, rl = 20 + (r() * 60 | 0); line(x, '#120a20', rx, 0, rx + (r() * 10 - 5), rl, 1); }
      for (let i = 0; i < 40; i++) rect(x, sh('#7fe8ff', 0.4 + r() * 0.3), r() * 512 | 0, r() * 300 | 0, 1, 1);
    });
    paint('breach', (x, r) => {
      for (let i = 0; i < 5; i++) { const px = 40 + i * 104 + (r() * 20 | 0), w = 26 + (r() * 14 | 0); rect(x, '#16140f', px, 0, w, 300); rect(x, '#1e1b15', px, 0, 3, 300); for (let y = 20; y < 300; y += 34) rect(x, '#100e0a', px, y, w, 2); }
      x.globalAlpha = 0.08; for (let i = 0; i < 4; i++) { const lx = 30 + i * 130; rect(x, '#f5c542', lx, 0, 14, 300); rect(x, '#f5c542', lx + 4, 0, 6, 300); } x.globalAlpha = 1;
      for (let i = 0; i < 30; i++) rect(x, sh('#f5c542', 0.4 + r() * 0.3), r() * 512 | 0, r() * 300 | 0, 1, 1);
    });
  }
  const _init = art.init; art.init = function () { _init(); try { bakeMiddle(); bakeMids(); } catch (e) { console.error(e); } };

  // ================= enemies and bosses =================
  Object.assign(E, {
    cablerat:     { name: 'Cable Rat', sheet: 'cablerat', hp: 16, dmg: 6, speed: 1.4, xp: 6, creds: 2, ai: 'hopper', aggro: 140, w: 14, h: 10, contact: true, anims: { atk: 'run' } },
    scavenger:    { name: 'Shaft Scavenger', sheet: 'scavenger', hp: 44, dmg: 9, speed: 0.85, xp: 16, creds: 9, ai: 'ranged', range: 150, aggro: 220, cd: 110, shot: '#d8c8a0' },
    sludge:       { name: 'Sludge Crawler', sheet: 'sludge', hp: 40, dmg: 9, speed: 1.0, xp: 14, creds: 4, ai: 'hopper', aggro: 150, w: 20, h: 12, contact: true, anims: { atk: 'run' } },
    pumpdrone:    { name: 'Pump Drone', sheet: 'pumpdrone', hp: 26, dmg: 6, speed: 1.0, xp: 14, creds: 6, ai: 'drone', aggro: 210, fly: true, w: 18, h: 16, shot: '#3ad0ff', anims: { atk: 'zap' } },
    sporeling:    { name: 'Sporeling', sheet: 'sporeling', hp: 34, dmg: 8, speed: 1.0, xp: 14, creds: 4, ai: 'melee', range: 24, aggro: 160, windup: 24, w: 14, h: 22, anims: { atk: 'bite' }, spores: true },
    brute:        { name: 'Mycelium Brute', sheet: 'brute', hp: 96, dmg: 12, speed: 0.8, xp: 30, creds: 14, ai: 'melee', range: 30, aggro: 180, blockEvery: 3, windup: 26, commit: true },
    keystone: { name: 'THE KEYSTONE', sub: "Halcyon's seal on the road up", sheet: 'keystone', sheet2: 'keystone2', beast: true, heavy: true, hp: 720, dmg: 14, speed: 0.7, xp: 320, creds: 200, idle: 34, w: 60, h: 76,
      script: [['stomp', { col: '#f5c542' }, [3, 1]], ['slam', {}, [2, 2]], ['lob', { n: 2, col: '#c8b090', dmg: 8 }, [1, 3]], ['charge', { speed: 3.6 }, [1, 2]], ['summon', { kind: 'cablerat', max: 3, hp: 14, p2: true }, [2, 2]]] },
  });
  // balance (the old story-test.js bots, level 8, two kit skills, 10-14 fights each): the masher loses 7 in 10 against the
  // Keystone; the careful player wins about 9 in 10 (losing ~40% health).
  // a sporeling bursts into a spore cloud that stings for a few seconds
  const _kill = G.onKill; G.onKill = function (e) {
    const r = _kill.apply(this, arguments);
    try { if (e && e.def && e.def.spores && G.zone) { G.zone.add(new SW.Puddle(e.x, e.y - 4, 30, 200, 6, '#b8ff40')); fx.spark(e.x, e.y - 12, '#e8ff9a', 10, 2); } } catch (err) { console.error(err); }
    return r;
  };

  // ================= small machines =================
  // the banner under a zone name: these maps are not on the three old layers
  class Banner {
    constructor(sub, col) { this.sub = sub; this.col = col; }
    update(g) { if (g.banner) { g.banner.sub = this.sub; g.banner.col = this.col; } this.gone = true; }
    draw() {}
  }
  const solidAt = (z, p, x) => z.hit(x - p.w / 2, p.y - p.h + 2, p.w, p.h - 4);
  const push = (z, p, dx) => { if (!solidAt(z, p, p.x + dx)) p.x += dx; };
  // a glowcap: land on it holding JUMP to bounce high (letting go of jump cuts the bounce, like any jump)
  class Cap {
    constructor(tx, ty) { this.x = tx * T + 8; this.y = (ty + 1) * T; this.t = 0; this.sq = 0; }
    update(g) {
      this.t++; if (this.sq > 0) this.sq--;
      const p = g.player, top = this.y - 12;
      if (!p || p.dead || g.busy()) return;
      if (p.vy > 0 && Math.abs(p.x - this.x) < 15 && p.y >= top - 4 && p.y <= top + 7) {
        p.y = top; p.vy = -11; p.onGround = false; p.enter('jump'); this.sq = 10; sfx('jump'); fx.ring(this.x, top, '#7fe8ff', 4, 22, 12);
      }
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), s = this.sq > 0 ? 3 : 0, glow = 0.12 + 0.05 * Math.sin(this.t * 0.08);
      rect(ctx, '#d8d0c0', x - 3, y - 10 + s, 6, 10 - s);
      [16, 26, 32, 32].forEach((w, i) => rect(ctx, i === 0 ? '#9af0ff' : '#3ab8e8', x - w / 2 - s, y - 18 + i * 2 + s, w + s * 2, 2));
      rect(ctx, '#1a4a6a', x - 16 - s, y - 10 + s, 32 + s * 2, 1);
      [[-9, -16], [4, -17], [9, -14]].forEach(q => rect(ctx, '#ffffff', x + q[0], y + q[1] + s, 2, 2));
      art.glow(ctx, x, y - 14, 22, '#7fe8ff', glow);
    }
  }
  // the Breach roof comes down while the Keystone fights: a shadow, falling grit, then the rock
  class Rock extends SW.Shot {
    draw(ctx, cam) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y); disc(ctx, '#5e5a50', x, y, 7); disc(ctx, '#7e7a6e', x - 2, y - 2, 4); rect(ctx, '#3a362e', x - 6, y + 4, 12, 2); }
  }
  class Rockfall {
    constructor(x0, x1, roof, floor) { this.x0 = x0 * T; this.x1 = x1 * T; this.roof = roof * T; this.floor = floor * T; this.t = 0; this.marks = []; }
    update(g, z) {
      const b = g.boss;
      if (!b || b.type !== 'keystone' || b.dead || b.dormant || g.busy()) return;
      this.t++;
      if (this.t % (b.phase === 2 ? 80 : 140) === 0) { const p = g.player; this.marks.push({ x: SW.clamp(p.x + SW.rand(-40, 40), this.x0, this.x1), t: 54 }); }
      this.marks.forEach(m => {
        m.t--;
        if (m.t % 5 === 0) fx.list.push({ k: 'p', x: m.x + SW.rand(-6, 6), y: this.roof + 2, vx: 0, vy: 2, g: 0.2, life: 24, max: 24, col: '#8a8478', s: 1 });
        if (m.t === 0) { z.shots.push(new Rock({ kind: 'orb', team: 'enemy', x: m.x, y: this.roof + 8, vy: 1, g: 0.32, dmg: 9, life: 120, w: 14, h: 14, col: '#8a8478', kx: 2, ky: -2 })); sfx('heavy'); }
      });
      this.marks = this.marks.filter(m => m.t > 0);
    }
    draw(ctx, cam) {
      this.marks.forEach(m => { const w = Math.round(30 - m.t * 0.4); ctx.globalAlpha = 0.45; rect(ctx, '#000000', Math.round(m.x - w / 2 - cam.x), Math.round(this.floor - 3 - cam.y), w, 3); ctx.globalAlpha = 1; });
    }
  }

  // ================= the Middle Deep =================
  Z.shafts = {
    name: 'The Shafts', theme: 'shaft', music: 'middle', w: 48, h: 64,
    build(z, g) {
      z.add(new Banner('THE MIDDLE DEEP', '#e0a060'));
      z.fill(0, 0, 48, 1).fill(0, 0, 1, 64).fill(47, 0, 1, 64).ground(1, 46, 60);
      // six decks, ladders alternating right and left
      [50, 40, 30, 20, 10].forEach((y, i) => { const lx = i % 2 ? 3 : 44; z.fill(1, y, 46, 1).clear(lx, y, 1, 1).ladder(lx, y, 10); });
      z.clear(47, 3, 1, 7);
      z.spawn('bottom', 7, 59).spawn('top', 42, 9);
      z.exit(47, 3, 1, 7, 'waterworks', 'west');
      z.thing('hatch', 4, 59, { prompt: 'Back down to the Old Metro', use: gg => gg.gotoZone('metro', 'shaft') });
      // deck 0: the old lift-hut
      z.prop('cage', 20, 59, { front: true }).prop('crate', 16, 59).prop('crate', 17, 59).prop('bones', 33, 59).prop('barrel', 40, 59);
      lamp(z, 10, 59, '#f5c542'); lamp(z, 28, 59, '#ff8a3a');
      z.save(9, 59, 'glyph');
      z.enemy('cablerat', 26, 59); z.enemy('cablerat', 31, 59); z.enemy('scavenger', 38, 59);
      // deck 1
      z.plat(14, 47, 5).plat(26, 45, 5);
      z.enemy('cablerat', 20, 49); z.enemy('cablerat', 34, 49); z.enemy('scavenger', 28, 44); z.prop('cage', 38, 49);
      lamp(z, 8, 49, '#ff8a3a');
      // deck 2: a strip of rusted spikes, a catwalk over it
      z.spikes(20, 39, 7).plat(18, 37, 11);
      z.enemy('scavenger', 12, 39); z.enemy('cablerat', 34, 39); z.enemy('cablerat', 38, 39); z.prop('barrel', 8, 39).prop('crate', 30, 39);
      lamp(z, 40, 39, '#f5c542');
      // deck 3: broken lift machinery to climb over
      z.fill(14, 28, 4, 2).fill(28, 27, 4, 3).plat(21, 25, 5);
      z.enemy('cablerat', 10, 29); z.enemy('scavenger', 30, 25); z.enemy('cablerat', 36, 29); z.enemy('cablerat', 40, 29);
      lamp(z, 6, 29, '#ff8a3a');
      // deck 4: a rest, then more scavengers
      z.save(40, 19, 'glyph'); z.prop('crate', 36, 19).prop('crate', 37, 19);
      z.enemy('scavenger', 22, 19); z.enemy('scavenger', 12, 19); z.enemy('cablerat', 16, 19); z.plat(18, 17, 6);
      lamp(z, 30, 19, '#f5c542');
      // the top deck
      z.prop('sign', 38, 9).prop('pipe', 46, 9, { col: '#f5c542' });
      lamp(z, 24, 9, '#f5c542');
    }
  };
  Z.waterworks = {
    name: 'The Waterworks', theme: 'waterworks', music: 'middle', w: 150, h: 26,
    build(z, g) {
      z.add(new Banner('THE MIDDLE DEEP', '#e0a060'));
      z.fill(0, 0, 150, 3).ground(0, 149, 22);
      z.spawn('west', 2, 21).spawn('east', 146, 21);
      z.exit(0, 3, 1, 19, 'shafts', 'top'); z.exit(149, 3, 1, 19, 'hollows', 'west');
      // entry
      z.save(6, 21, 'glyph'); z.prop('pump', 12, 21).prop('pipe', 16, 21, { col: '#3ad0ff' }); lamp(z, 9, 21, '#3ad0ff');
      z.enemy('sludge', 18, 21);
      // the settling pools, and a catwalk
      z.clear(31, 22, 6, 1).liquid(31, 23, 6, 2).plat(33, 20, 2);
      z.enemy('sludge', 40, 21); z.enemy('pumpdrone', 44, 12); z.enemy('sludge', 46, 21);
      z.plat(48, 19, 3).plat(52, 16, 4).plat(57, 13, 9);
      z.enemy('pumpdrone', 60, 8);
      z.prop('pipe', 55, 21, { col: '#3ad0ff' }); lamp(z, 50, 21, '#3ad0ff');
      // the flooded run: pipes over the water
      z.clear(72, 22, 20, 1).liquid(72, 23, 20, 2).plat(75, 20, 3).plat(80, 18, 3).plat(85, 20, 3).plat(89, 19, 2);
      z.enemy('pumpdrone', 78, 10); z.enemy('pumpdrone', 88, 9);
      z.enemy('sludge', 95, 21); z.prop('tank', 93, 21);
      // the pump hall
      [106, 114, 122, 130].forEach(x => z.prop('pump', x, 21)); z.prop('tank', 110, 21).prop('tankb', 126, 21);
      lamp(z, 104, 21, '#3ad0ff'); lamp(z, 136, 21, '#3ad0ff');
      z.prop('pipe', 143, 21, { col: '#7dffb2' });
    }
  };
  Z.hollows = {
    name: 'The Fungal Hollows', theme: 'hollows', music: 'middle', w: 160, h: 28,
    build(z, g) {
      z.add(new Banner('THE MIDDLE DEEP', '#e0a060'));
      z.fill(0, 0, 160, 2).ground(0, 159, 24);
      z.spawn('west', 2, 23).spawn('east', 157, 23);
      z.exit(0, 2, 1, 22, 'waterworks', 'east'); z.exit(159, 2, 1, 22, 'breach', 'west');
      [[10, '#5a8aff'], [22, '#b88aff'], [90, '#5a8aff'], [100, '#7dffb2'], [146, '#b88aff']].forEach(q => z.prop('glowcap', q[0], 23, { col: q[1], glow: q[1], gy: 22, gr: 24 }));
      z.enemy('sporeling', 16, 23); z.enemy('sporeling', 26, 23);
      // the cliff up to the camp: two glowcaps
      z.fill(36, 18, 4, 6).fill(40, 12, 42, 12);
      z.add(new Cap(34, 23)); z.add(new Cap(38, 17));
      z.hint(28, 14, 12, 10, 'Glowcaps: land on one holding JUMP to bounce high.');
      // the Lamplighters' camp on the shelf
      [44, 52, 64, 76].forEach(x => z.prop('lantern', x, 2, { col: '#7fe8ff', glow: '#7fe8ff', gy: 8, gr: 22 }));
      z.prop('tent', 50, 11, { col: '#2a5a6a' }).prop('tent', 70, 11, { col: '#3a4a6a' }).prop('firebarrel', 60, 11, { glow: '#7fe8ff', gy: 16, gr: 26 }).prop('glowcap', 78, 11, { col: '#7dffb2', glow: '#7dffb2', gy: 22, gr: 24 });
      z.save(63, 11, 'glyph');
      // the road east, down off the shelf
      z.enemy('sporeling', 88, 23); z.enemy('brute', 96, 23); z.enemy('sporeling', 102, 23);
      z.plat(92, 19, 5); z.add(new Cap(84, 23));
      // the spore nest
      [114, 124, 134].forEach(x => z.prop('glowcap', x, 23, { col: '#b8ff40', glow: '#b8ff40', gy: 22, gr: 26 }));
    }
  };
  Z.breach = {
    name: 'The Breach', theme: 'breach', music: 'middle', w: 84, h: 30,
    build(z, g) {
      z.add(new Banner('THE MIDDLE DEEP', '#e0a060'));
      z.fill(0, 0, 84, 12).fill(83, 0, 1, 30).ground(0, 82, 26).clear(76, 0, 4, 12).ladder(77, 0, 26);
      z.spawn('west', 2, 25).spawn('top', 77, 25);
      z.exit(0, 12, 1, 14, 'hollows', 'east'); z.exit(76, 0, 4, 1, 'scrapton', 'hatch');
      lamp(z, 6, 25, '#7fe8ff'); z.prop('lantern', 12, 13, { col: '#7fe8ff', glow: '#7fe8ff', gy: 8, gr: 22 });
      z.prop('seal', 46, 25, { col: '#d9b45a' }).prop('bones', 30, 25).prop('bones', 64, 25).prop('boulder', 22, 25);
      z.add(new Rockfall(18, 70, 12, 26));
      z.thing('hatchup', 77, 25, { prompt: 'Climb to the surface', use: gg => gg.gotoZone('scrapton', 'hatch') });
    }
  };

  // ================= hooking the Middle Deep in =================
  // the top of the Metro Shaft opens into the Shafts (the Breach comes out at the Scrapton hatch)
  world.patch('metro', (z, g) => {
    z.exits.forEach(e => { if (e.to === 'scrapton' && e.spawn === 'hatch') { e.to = 'shafts'; e.spawn = 'bottom'; } });
  });

  // ---------- the world map ----------
  D.world.push({ id: 'shafts', name: 'The Middle Deep', layer: 2, x: 400, y: 196 });
  D.routes.forEach(r => { if (r[0] === 'metro' && r[1] === 'scrapton') r.length = 2; });
  D.routes.push(['metro', 'shafts'], ['shafts', 'scrapton', 'The Breach']);
  const GROUP = { waterworks: 'shafts', hollows: 'shafts', breach: 'shafts' };
  const _map = ui.drawMap; ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };
})();

(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, world = SW.world, Z = SW.zones;
  const E = D.enemies, TH = art.themes, W = SW.W;
  if (!world || !world.patch || !SW.Boss2) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring, sh = art.shade;
  const sfx = n => SW.audio.sfx(n);
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16, ROOT = '#7dff9a', SAP = '#b8ff40', SKY = '#6fd3e8';

  // ================= look: themes, music, backdrops, props =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    roots:    theme('metro', { style: 'dirt', a: '#2a2a1e', b: '#222218', top: '#4a5a2a', hi: '#9ad890', deep: '#0c0e08', plat: '#6a5a3a', sky: ['#040604', '#10180c'], mid: 'ruins', midCol: '#0a0e08', bg: 'none', dim: 0, haz: SAP, win: [ROOT] }),
    heart:    theme('metro', { style: 'dirt', a: '#2a2420', b: '#221c18', top: '#5a6a2a', hi: '#d8ffb0', deep: '#0e0a08', plat: '#6a5a3a', sky: ['#060a04', '#1a2a10'], mid: 'ruins', midCol: '#0a0e08', bg: 'none', dim: 0, haz: SAP, win: [ROOT] }),
  });
  SW.audio.tracks.roots = { bpm: 70, root: 36, prog: [0, -2, -5, -7], arp: [0, 3, 7, 10, 12, 10, 7, 3], bass: 'triangle', drums: 0.3 };

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
  }

  const PROPS = {
    rootcoil: [44, 30, (x, c) => { for (let i = 0; i < 4; i++) { const cx = 8 + i * 10; disc(x, i % 2 ? '#3a4a26' : '#2e3a1e', cx, 22 - i % 2 * 3, 9); rect(x, c, cx - 1, 16 - i % 2 * 3, 2, 2); } rect(x, '#2e3a1e', 0, 24, 44, 6); rect(x, '#4a5a2a', 0, 24, 44, 2); }],
    tap: [30, 64, (x, c) => { rect(x, '#4a5060', 11, 0, 8, 52); rect(x, '#6a7088', 11, 0, 2, 52); for (let j = 6; j < 50; j += 14) rect(x, '#5a6078', 9, j, 12, 3); rect(x, '#3a3f4e', 4, 50, 22, 14); rect(x, '#5a6078', 4, 50, 22, 3); disc(x, '#2a2e3a', 15, 57, 6); ring(x, c, 15, 57, 6); line(x, c, 10, 57, 20, 57, 1); line(x, c, 15, 52, 15, 62, 1); }],
    heartroot: [96, 110, (x, c) => { for (let k = 0; k < 110; k += 2) { const w = 30 + Math.sin(k * 0.08) * 8 + (k > 80 ? (k - 80) * 1.6 : 0); rect(x, k % 8 < 2 ? '#3a4a26' : '#2e3a1e', 48 - w / 2, k, w, 2); } disc(x, c, 48, 60, 16); disc(x, '#e8ffd0', 48, 60, 7); for (let i = 0; i < 6; i++) { const a = i * 1.05; line(x, c, 48, 60, 48 + Math.cos(a) * 26, 60 + Math.sin(a) * 34, 1); } }],
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

  // ================= the new faces (the Tether Fields' too: world-sky.js) =================
  function bakeRoots() {
    const custom = art.custom, recolor = world.recolor;
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

  // ================= enemies and bosses (the Tether Fields' are in world-sky.js) =================
  Object.assign(E, {
    rootling:     { name: 'Rootling', sheet: 'rootling', hp: 58, dmg: 13, speed: 1.7, xp: 26, creds: 5, ai: 'leaper', aggro: 170, w: 20, h: 14, anims: { idle: 'idle', run: 'run', jump: 'leap', atk: 'bite' } },
    tapcrew:      { name: 'Halcyon Tap Crew', sheet: 'tapcrew', hp: 96, dmg: 14, speed: 0.95, xp: 32, creds: 15, ai: 'melee', range: 28, aggro: 170, blockEvery: 4, windup: 22, commit: true },
    tapdrone:     { name: 'Tap Drone', sheet: 'tapdrone', hp: 32, dmg: 9, speed: 1.15, xp: 18, creds: 6, ai: 'drone', aggro: 210, fly: true, w: 18, h: 14, shot: SAP, anims: { atk: 'zap' } },
    rootknot:     { name: 'Root Knot', sheet: 'rootknot', hp: 96, dmg: 14, speed: 0.5, xp: 34, creds: 8, ai: 'crawler', aggro: 120, armored: true, w: 30, h: 14, contact: true, anims: { atk: 'lunge' } },
    grane: { name: 'ROOT WARDEN GRANE', sub: 'Halcyon taproot station', sheet: 'grane', sheet2: 'grane2', hp: 1040, dmg: 16, speed: 1.1, xp: 480, creds: 280, idle: 26, w: 14, h: 38, counter: 2, poise: 4,
      script: [['swings', { n: 2, reach: 56, col: SAP }, [3, 1]], ['lob', { n: 2, col: ROOT, dmg: 10 }, [1, 2]], ['lunge', {}, [1, 2]], ['summon', { kind: 'rootling', max: 2, hp: 30, p2: true }, [2, 2]]] },
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
      // root humps, and pools of sap that burn
      z.fill(16, 21, 5, 1).fill(17, 20, 3, 1).fill(60, 20, 6, 2).fill(62, 19, 2, 1).fill(112, 21, 6, 1).fill(170, 20, 5, 2);
      z.clear(30, 22, 6, 1).liquid(30, 23, 6, 2).plat(32, 20, 2);
      z.clear(78, 22, 7, 1).liquid(78, 23, 7, 2).plat(80, 20, 3);
      z.clear(128, 22, 8, 1).liquid(128, 23, 8, 2).plat(130, 20, 2).plat(134, 20, 2);
      [[10, 21], [40, 21], [70, 18], [96, 21], [122, 21], [146, 21], [184, 21]].forEach((q, i) => z.prop(i % 3 ? 'glowcap' : 'rootcoil', q[0], q[1], { col: i % 2 ? SAP : ROOT }));
      // three Halcyon taps: while they bleed light, the roots around them tear loose
      [48, 104, 156].forEach((tx, i) => z.add(new Tap(tx, 22, 'rt_t' + (i + 1))));
      [24, 66, 88, 118, 140, 176].forEach((x, i) => z.add(new RootBurst(x, 22, i * 43)));
      z.enemy('rootling', 22, 21); z.enemy('tapcrew', 40, 21); z.enemy('tapdrone', 56, 12);
      z.enemy('rootknot', 70, 21); z.enemy('tapcrew', 90, 21);
      z.save(94, 21, 'glyph'); z.pickup('item', 97, 21); lamp(z, 92, 21, '#ffffff');
      z.enemy('tapdrone', 112, 11); z.enemy('rootknot', 120, 21); z.enemy('tapcrew', 144, 21); z.enemy('rootling', 166, 21); z.enemy('tapcrew', 180, 21); z.enemy('tapdrone', 186, 12);
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
      z.thing('console', 68, 19, { prompt: 'Ride the tap-pipe lift up to the Old Metro', use: gg => gg.gotoZone('metro', 'roots') });
    }
  };
  // the Old Metro: the tunnel floor by the foot of the shaft has split open
  world.patch('metro', (z, g) => {
    z.spawn('roots', 151, 29);
    z.thing('hatch', 150, 29, { prompt: 'Climb down through the crack', glow: ROOT, use: gg => gg.gotoZone('rootstair', 'top') });
  });

  // ---------- the world map ----------
  D.world.push({ id: 'rootstair', name: 'The Roots', layer: 2, x: 290, y: 236 });
  D.routes.push(['metro', 'rootstair']);
  const GROUP = { rootways: 'rootstair', heartroot: 'rootstair' };
  const _map = SW.ui.drawMap; SW.ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };
})();
