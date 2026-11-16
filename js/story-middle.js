'use strict';
// Shattered Worlds — ACT 2: THE MIDDLE. Loaded after story-finale.js; only adds and wraps.
//   The world keeps its three layers, but each one is deeper now. Between the end of Act 1 and Scrapton the two roads
//   take the long way:
//   Kael's road CLIMBS through the Middle Deep: the Shafts, the Waterworks, the Fungal Hollows and the Breach, where
//     THE KEYSTONE, Halcyon's seal on the road up, has to be broken before anyone from below can reach the sun.
//   Nyra's road FALLS through the Underside of Aurelia: the Ballast Decks, the Cargo Ducts and the Cargo Drop, where
//     THE GRAVITY CLERK tries to stop a falling pod.
//   Both roads end in the Rust Flats, where Act 3 (the old Act 2) starts at the bounty board.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, TH = art.themes, text = SW.text, W = SW.W, H = SW.H;
  if (!story || !story.patch || !story.tune) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring;
  const sfx = n => SW.audio.sfx(n);
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16;
  const KZ = ['shafts', 'waterworks', 'hollows', 'breach'], NZ = ['ballast', 'ducts', 'cargodrop'];

  // ================= look: themes, music, props =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    shaft:      theme('metro', { style: 'brick', a: '#3a3430', b: '#2e2824', top: '#6a5a48', hi: '#a08a68', deep: '#120e0c', plat: '#8a6a3a', sky: ['#06060a', '#1e1812'], mid: 'arches', midCol: '#120e0b', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#f5c542'] }),
    waterworks: theme('metro', { style: 'plate', a: '#2a4a52', b: '#223e46', top: '#4a8a92', hi: '#8ad0d8', deep: '#0a1a20', plat: '#6a8a7a', sky: ['#03101a', '#0c2a36'], mid: 'lab', midCol: '#081a22', bg: 'none', dim: 0, haz: '#3ad0ff', win: ['#3ad0ff'] }),
    hollows:    theme('metro', { style: 'dirt', a: '#2e2440', b: '#261e36', top: '#5a3a7a', hi: '#b88aff', deep: '#0e0a18', plat: '#4a6a3a', sky: ['#06040e', '#1a1030'], mid: 'ruins', midCol: '#0c0818', bg: 'none', dim: 0, haz: '#b8ff40', win: ['#7dffb2'] }),
    breach:     theme('metro', { style: 'brick', a: '#4a4640', b: '#3c3832', top: '#7a7468', hi: '#d8c8a0', deep: '#1a1814', plat: '#8a7a50', sky: ['#0a0a0c', '#2e2a22'], mid: 'arches', midCol: '#16140f', bg: 'none', dim: 0, haz: '#f5c542', win: ['#f5c542'] }),
    underside:  theme('sky', { style: 'plate', a: '#b8b2a4', b: '#a49e90', top: '#e8e4d8', hi: '#ffffff', deep: '#6a665c', plat: '#d9b45a', sky: ['#9ad8f0', '#f0f4f8'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: '#6fd3e8', win: ['#d9b45a'] }),
    ducts:      theme('lab', { style: 'panel', a: '#5a5448', b: '#4a453a', top: '#8a8068', hi: '#c8b88a', deep: '#22201a', plat: '#a08a50', sky: ['#100e0a', '#2a261c'], mid: 'lab', midCol: '#1a1812', bg: 'none', dim: 0, haz: '#b48cff', win: ['#d9b45a'] }),
    cargo:      theme('sky', { style: 'plate', a: '#8a8478', b: '#76705f', top: '#c8c0a8', hi: '#ffffff', deep: '#4a463c', plat: '#d9b45a', sky: ['#4aa8d8', '#d8eef8'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: '#6fd3e8', win: ['#d9b45a'] })
  });
  SW.audio.tracks.middle = { bpm: 78, root: 38, prog: [0, -4, -2, -5], arp: [0, 3, 7, 10, 7, 3, 12, 3], bass: 'triangle', drums: 0.35 };
  SW.audio.tracks.underside = { bpm: 96, root: 45, prog: [0, 5, -3, 2], arp: [0, 7, 12, 16, 12, 7, 4, 7], bass: 'square', drums: 0.45 };

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
    const custom = art.custom, recolor = story.recolor;
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
    // --- the Underside ---
    const bdrone = (rot, eye) => x => {
      rect(x, '#e8ecf4', 8, 10, 18, 9); rect(x, '#ffffff', 9, 9, 16, 2); rect(x, '#b9c0ce', 10, 18, 14, 2);
      rect(x, '#d9b45a', 8, 14, 18, 1); rect(x, eye, 20, 12, 4, 4); rect(x, '#ffffff', 22, 12, 1, 1);
      rect(x, '#8a92a8', 16, 4, 1, 5); rect(x, '#d9b45a', rot ? 7 : 11, 3, rot ? 20 : 12, 1); rect(x, '#8a92a8', 16, 20, 1, 2); rect(x, '#d9b45a', 14, 21, 5, 2);
    };
    custom('ballastdrone', 32, 24, 23, { idle: [bdrone(0, '#6fd3e8'), bdrone(1, '#6fd3e8')], run: [bdrone(0, '#6fd3e8'), bdrone(1, '#6fd3e8')], zap: [bdrone(0, '#ffffff'), bdrone(1, '#ffe7a8')], hurt: [bdrone(1, '#ff5a5a')], down: [bdrone(0, '#3a3f4e')] });
    const wisp = (f, core) => x => {
      disc(x, '#5a3a9a', 10, 13, 6); disc(x, '#8a5aea', 10, 12, 5); disc(x, '#b48cff', 10, 11, 3); rect(x, core, 9, 10, 2, 2);
      rect(x, '#8a5aea', 7 + f, 4, 2, 4); rect(x, '#b48cff', 10 - f, 2, 2, 5); rect(x, '#8a5aea', 13, 5 + f, 2, 3); rect(x, '#5a3a9a', 9, 19, 2, 2 - f);
    };
    custom('wisp', 20, 22, 21, { idle: [wisp(0, '#ffffff'), wisp(1, '#ffffff')], run: [wisp(0, '#ffffff'), wisp(1, '#ffffff')], zap: [wisp(0, '#ffe040'), wisp(1, '#ff5a5a')], hurt: [wisp(1, '#ff5a5a')], down: [wisp(0, '#3a2a5a')] });
    const mtu = (leg, eye, arm) => x => {
      rect(x, '#4a453a', 10 + leg, 24, 5, 8); rect(x, '#4a453a', 20 - leg, 24, 5, 8); rect(x, '#2a261e', 9 + leg, 31, 7, 2); rect(x, '#2a261e', 19 - leg, 31, 7, 2);
      rect(x, '#8a8068', 7, 8, 22, 17); rect(x, '#a89a78', 7, 8, 22, 2); rect(x, '#6a6250', 7, 8, 3, 17); rect(x, '#d9b45a', 10, 20, 16, 2);
      rect(x, '#22201a', 14, 12, 12, 5); rect(x, eye, 16, 13, 8, 3); rect(x, '#6a6250', 16, 3, 4, 5); rect(x, '#ff5a5a', 17, 1, 2, 2);
      rect(x, '#6a6250', 28, 12 + arm, 4, 4); rect(x, '#8a8068', 31, 13 + arm, 4, 2); rect(x, '#c8b88a', 33, 11 + arm, 2, 2); rect(x, '#c8b88a', 33, 15 + arm, 2, 2);
    };
    custom('maintunit', 36, 34, 33, { idle: [mtu(0, '#b48cff', 0), mtu(0, '#b48cff', 1)], run: [mtu(2, '#b48cff', 0), mtu(-2, '#b48cff', 0)], clamp: [mtu(0, '#ffffff', -4), mtu(0, '#ffe040', 3)], hurt: [mtu(0, '#ff5a5a', 2)], down: [mtu(0, '#22201a', 6)] });
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
    recolor('hullwarden', 'guard', { top: '#e8e4d8', pants: '#6a7088' });
    recolor('clerk', 'brandt', { top: '#3a2a4a', hair: '#e8e4f0', pants: '#4a4a5a' }, { '#ff8a3a': '#b48cff', '#ffe0a0': '#e8d8ff', '#d9b45a': '#b48cff' });
    recolor('clerk2', 'clerk', { top: '#6a3a9a' });
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
    paint('underside', (x, r) => {
      // the bottom of Aurelia: inverted spires and keels hanging over the cloud
      for (let i = 0; i < 9; i++) { const sx = i * 58 + (r() * 20 | 0), len = 50 + (r() * 110 | 0), w = 14 + (r() * 18 | 0); for (let k = 0; k < len; k += 2) { const ww = Math.max(2, w * (1 - k / len)); rect(x, k < 6 ? '#b8c4d0' : '#c8d4e0', sx - ww / 2, k, ww, 2); } rect(x, '#d9b45a', sx - 1, len - 4, 2, 3); }
      for (let i = 0; i < 8; i++) { const cx = r() * 512 | 0, cy = 200 + (r() * 90 | 0); disc(x, '#ffffff', cx, cy, 18 + (r() * 16 | 0)); disc(x, '#eef6fa', cx + 22, cy + 6, 14); }
      rect(x, '#ffffff', 0, 270, 512, 30);
    });
    paint('ducts', (x, r) => {
      for (let i = 0; i < 8; i++) { const rx = i * 64; rect(x, '#18160f', rx, 0, 8, 300); rect(x, '#24211a', rx, 0, 2, 300); }
      for (let i = 0; i < 4; i++) { const y = 40 + i * 64; rect(x, '#1a1812', 0, y, 512, 10); rect(x, '#2a261c', 0, y, 512, 2); for (let k = 0; k < 512; k += 48) rect(x, sh('#d9b45a', 0.5), k + 10, y + 4, 3, 2); }
    });
    paint('cargo', (x, r) => {
      for (let i = 0; i < 14; i++) { const cx = r() * 512 | 0, cy = r() * 300 | 0, s = 12 + (r() * 22 | 0); disc(x, '#ffffff', cx, cy, s); disc(x, '#e8f4fa', cx + s, cy + 4, s * 0.7 | 0); }
      for (let i = 0; i < 20; i++) rect(x, '#ffffff', r() * 512 | 0, r() * 300 | 0, 30 + (r() * 40 | 0), 1);
    });
  }
  const _init = art.init; art.init = function () { _init(); try { bakeMiddle(); bakeMids(); } catch (e) { console.error(e); } };

  Object.assign(D.speakers, {
    wick: { name: 'Old Wick', sheet: 'wick', pitch: 230 }, lumen: { name: 'Mother Lumen', sheet: 'lumen', pitch: 470 },
    lamper: { name: 'Lamplighter', sheet: 'lamper', pitch: 560 }, clerk: { name: 'The Gravity Clerk', sheet: 'clerk', pitch: 420 }
  });

  // ================= enemies and bosses =================
  Object.assign(E, {
    cablerat:     { name: 'Cable Rat', sheet: 'cablerat', hp: 16, dmg: 6, speed: 1.4, xp: 6, creds: 2, ai: 'hopper', aggro: 140, w: 14, h: 10, contact: true, anims: { atk: 'run' } },
    scavenger:    { name: 'Shaft Scavenger', sheet: 'scavenger', hp: 44, dmg: 9, speed: 0.85, xp: 16, creds: 9, ai: 'ranged', range: 150, aggro: 220, cd: 110, shot: '#d8c8a0' },
    sludge:       { name: 'Sludge Crawler', sheet: 'sludge', hp: 40, dmg: 9, speed: 1.0, xp: 14, creds: 4, ai: 'hopper', aggro: 150, w: 20, h: 12, contact: true, anims: { atk: 'run' } },
    pumpdrone:    { name: 'Pump Drone', sheet: 'pumpdrone', hp: 26, dmg: 6, speed: 1.0, xp: 14, creds: 6, ai: 'drone', aggro: 210, fly: true, w: 18, h: 16, shot: '#3ad0ff', anims: { atk: 'zap' } },
    sporeling:    { name: 'Sporeling', sheet: 'sporeling', hp: 34, dmg: 8, speed: 1.0, xp: 14, creds: 4, ai: 'melee', range: 24, aggro: 160, windup: 24, w: 14, h: 22, anims: { atk: 'bite' }, spores: true },
    brute:        { name: 'Mycelium Brute', sheet: 'brute', hp: 96, dmg: 12, speed: 0.8, xp: 30, creds: 14, ai: 'melee', range: 30, aggro: 180, blockEvery: 3, windup: 26, commit: true },
    ballastdrone: { name: 'Ballast Drone', sheet: 'ballastdrone', hp: 24, dmg: 6, speed: 1.1, xp: 14, creds: 6, ai: 'drone', aggro: 220, fly: true, w: 18, h: 14, shot: '#ffe7a8', anims: { atk: 'zap' } },
    hullwarden:   { name: 'Hull Warden', sheet: 'hullwarden', hp: 58, dmg: 10, speed: 0.95, xp: 18, creds: 10, ai: 'melee', range: 28, aggro: 170, blockEvery: 3, windup: 22 },
    wisp:         { name: 'Ballast Wisp', sheet: 'wisp', hp: 20, dmg: 7, speed: 1.3, xp: 12, creds: 3, ai: 'drone', aggro: 200, fly: true, w: 12, h: 14, shot: '#b48cff', anims: { atk: 'zap' } },
    maintunit:    { name: 'Maintenance Unit', sheet: 'maintunit', hp: 70, dmg: 11, speed: 0.7, xp: 24, creds: 12, ai: 'melee', range: 30, aggro: 170, windup: 28, w: 22, h: 30, anims: { atk: 'clamp' }, commit: true },
    keystone: { name: 'THE KEYSTONE', sub: "Halcyon's seal on the road up", sheet: 'keystone', sheet2: 'keystone2', beast: true, heavy: true, hp: 720, dmg: 14, speed: 0.7, xp: 320, creds: 200, idle: 34, w: 60, h: 76,
      script: [['stomp', { col: '#f5c542' }, [3, 1]], ['slam', {}, [2, 2]], ['lob', { n: 2, col: '#c8b090', dmg: 8 }, [1, 3]], ['charge', { speed: 3.6 }, [1, 2]], ['summon', { kind: 'cablerat', max: 3, hp: 14, p2: true }, [2, 2]]] },
    clerk: { name: 'THE GRAVITY CLERK', sub: 'Ballast Office, Underside Division', sheet: 'clerk', sheet2: 'clerk2', hp: 760, dmg: 13, speed: 1.1, xp: 320, creds: 200, idle: 26, w: 14, h: 36, counter: 2, poise: 4,
      script: [['volley', { n: 3, kind: 'orb', col: '#b48cff', speed: 3, gap: 14 }, [1, 3]], ['swings', { n: 2, reach: 52, col: '#e8d8ff' }, [3, 1]], ['lunge', {}, [1, 2]], ['summon', { kind: 'ballastdrone', max: 2, hp: 16, fly: true, p2: true }, [2, 2]]] }
  });
  // balance (tools/story-test.js bots, level 8, two kit skills, 10-14 fights each): the masher loses 7 in 10 against the
  // Keystone and every fight against the Clerk; the careful player wins about 9 in 10 (Keystone, losing ~40% health)
  // and 8 in 10 (Clerk, ~25%). The Clerk punishes mashing harder (counter 2 after 4 free hits) because it is light.
  // a sporeling bursts into a spore cloud that stings for a few seconds
  const _kill = G.onKill; G.onKill = function (e) {
    const r = _kill.apply(this, arguments);
    try { if (e && e.def && e.def.spores && G.zone) { G.zone.add(new SW.Puddle(e.x, e.y - 4, 30, 200, 6, '#b8ff40')); fx.spark(e.x, e.y - 12, '#e8ff9a', 10, 2); } } catch (err) { console.error(err); }
    return r;
  };

  // ================= missions =================
  Object.assign(M, {
    'MD-1': { id: 'MD-1', title: 'The Middle Deep', hero: 'kael', xp: 140, creds: 60, next: 'MD-2', steps: [{ id: 'climb', t: 'Climb the Shafts to the top deck' }] },
    'MD-2': { id: 'MD-2', title: 'The Waterworks', hero: 'kael', xp: 160, creds: 70, next: 'MD-3', steps: [{ id: 'valves', t: 'Open the three drain valves', n: 3 }, { id: 'hall', t: 'Clear the pump hall' }] },
    'MD-3': { id: 'MD-3', title: 'Lamplight', hero: 'kael', xp: 160, creds: 70, next: 'MD-4', steps: [{ id: 'camp', t: "Find the Lamplighters' camp in the Fungal Hollows" }, { id: 'nest', t: 'Clear the spore nest on the road east' }] },
    'MD-4': { id: 'MD-4', title: 'The Keystone', hero: 'kael', xp: 260, creds: 140, next: 'A2-1', steps: [{ id: 'reach', t: 'Reach the Breach' }, { id: 'boss', t: 'Break the Keystone' }] },
    'US-1': { id: 'US-1', title: 'The Underside', hero: 'nyra', xp: 140, creds: 60, next: 'US-2', steps: [{ id: 'relay', t: "Cross the Ballast Decks to Wren's relay" }] },
    'US-2': { id: 'US-2', title: 'The Cargo Ducts', hero: 'nyra', xp: 160, creds: 70, next: 'US-3', steps: [{ id: 'fans', t: 'Shut down the three duct fans', n: 3 }] },
    'US-3': { id: 'US-3', title: 'The Cargo Drop', hero: 'nyra', xp: 260, creds: 140, next: 'A2-1', steps: [{ id: 'pod', t: 'Cut a cargo pod loose' }, { id: 'boss', t: 'Ride it all the way down' }] }
  });
  if (M['N1-5']) { M['N1-5'].next = 'MD-1'; const s = M['N1-5'].steps.find(q => q.id === 'shaft'); if (s) s.t = 'Climb the Metro Shaft'; }
  if (M['I1-5']) M['I1-5'].next = 'US-1';
  const onRoad = (g, pre) => (g.state.mission || '').indexOf(pre) === 0;
  // Kael's road takes the Shafts unless this save already reached the Surface the old way (or has broken the Keystone)
  const climbing = g => { const S = g.state; return g.route() === 'kael' && !S.done['MD-4'] && !S.done['A2-1'] && (!S.done['N1-5'] || onRoad(g, 'MD-')); };
  const falling = g => { const S = g.state; return g.route() !== 'kael' && !S.done['US-3'] && !S.done['A2-1'] && (S.mission === 'I1-5' || onRoad(g, 'US-')); };

  // ---------- the cards: the old Act 2 is Act 3 now ----------
  Object.assign(story.cards, {
    mid_k: { title: 'ACT 2 - THE MIDDLE DEEP', lines: ['Grist is dead, and his shaft does not open onto the sky.', 'It opens into the Middle Deep: everything between', 'Deepline and the sun. Lift-shafts, flooded pump halls,', 'a forest of glowing mushrooms, and at the top, the Breach.', '',
      'Halcyon sealed the road up with something called', 'the Keystone. Nothing from below has ever passed it.', '', 'Climb.'] },
    mid_n: { title: 'ACT 2 - THE UNDERSIDE', lines: ['The Garbage Chute did not drop you to the ground.', 'It dropped you onto the Underside: the ballast decks,', 'ducts and cargo bays hanging under Aurelia,', 'with nothing below them but cloud.', '',
      'Somewhere down there is the Surface.', 'Halcyon sends its junk down by cargo pod.', '', 'Fall the rest of the way. On purpose this time.'] }
  });
  const c1 = story.cards.act1;
  if (c1) { c1.title = 'ACT 2 COMPLETE'; c1.lines = c1.lines.map(l => (l === 'ACT 2 starts at the bounty board.' ? 'ACT 3 starts at the bounty board.' : l === 'SECRET in Act 2 that nobody else can wake.' ? 'SECRET in Act 3 that nobody else can wake.' : l)); }
  if (story.cards.act2) story.cards.act2.title = 'ACT 3 - CHAPTER 1 COMPLETE';
  if (story.cards.act2end) { story.cards.act2end.title = 'ACT 3 COMPLETE'; story.cards.act2end.lines = story.cards.act2end.lines.map(l => (l === 'ACT 3 - CONVERGENCE - begins now.' ? 'CONVERGENCE begins now.' : l)); }
  if (story.cards.act3a) story.cards.act3a.title = 'CONVERGENCE - PART 1 COMPLETE';

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
  // a gust between the hull ribs: calm, a warning flutter, then a long shove towards the open sky
  class Gust {
    constructor(x0, x1, dir) { this.x0 = x0 * T; this.x1 = (x1 + 1) * T; this.dir = dir; this.t = Math.floor(Math.random() * 200); }
    phase() { const c = this.t % 330; return c < 160 ? 'calm' : c < 210 ? 'warn' : 'blow'; }
    update(g, z) {
      this.t++;
      const p = g.player, ph = this.phase();
      if (ph === 'warn' && this.t % 330 === 160) sfx('dash');
      if (!p || p.dead || g.busy() || ph !== 'blow' || p.x < this.x0 || p.x > this.x1) return;
      push(z, p, this.dir * (p.state === 'guard' ? 0.6 : 1.5));
    }
    draw(ctx, cam) {
      const ph = this.phase();
      if (ph === 'calm') return;
      ctx.globalAlpha = ph === 'warn' ? 0.25 : 0.55;
      for (let i = 0; i < 16; i++) {
        const span = this.x1 - this.x0, sx = this.x0 + ((this.t * (ph === 'blow' ? 9 : 3) * this.dir + i * 97) % span + span) % span, sy = 4 * T + ((i * 53) % (13 * T));
        rect(ctx, '#3a6a8a', Math.round(sx - cam.x), Math.round(sy - cam.y), ph === 'blow' ? 24 : 8, 1); rect(ctx, '#ffffff', Math.round(sx - cam.x) + 2, Math.round(sy - cam.y) + 1, ph === 'blow' ? 14 : 4, 1);
      }
      ctx.globalAlpha = 1;
    }
  }
  // a duct fan: blows back down the duct, stalls, blows again. Its off-switch is past it.
  class Fan {
    constructor(tx, flag) { this.x = tx * T + 8; this.flag = flag; this.t = 0; this.a = 0; }
    on(g) { return !g.flag(this.flag); }
    phase() { const c = this.t % 260; return c < 160 ? 'blow' : 'stall'; }
    update(g, z) {
      this.t++;
      const run = this.on(g), ph = this.phase();
      this.a += !run ? 0 : ph === 'blow' ? (this.t % 260 > 130 ? 0.12 : 0.4) : 0.03;
      const p = g.player;
      if (!run || !p || p.dead || g.busy() || ph !== 'blow' || p.x > this.x + 6 || p.x < this.x - 10 * T) return;
      push(z, p, p.state === 'guard' ? -1.2 : -2.9);
      if (this.t % 4 === 0) fx.list.push({ k: 'p', x: this.x - Math.random() * 120, y: p.y - Math.random() * 60, vx: -4, vy: 0, g: 0, life: 18, max: 18, col: '#e8e4d8', s: 1, a: 0.6 });
    }
    draw(ctx, cam, g) {
      const x = Math.round(this.x - cam.x), y = Math.round(8 * T - cam.y);
      rect(ctx, '#2a261c', x - 4, y, 26, 6 * T); rect(ctx, '#6a6250', x - 2, y + 2, 22, 6 * T - 4);
      const cx = x + 9, cy = y + 3 * T;
      disc(ctx, '#1a1812', cx, cy, 34); ring(ctx, '#c8b88a', cx, cy, 34); ring(ctx, '#8a8068', cx, cy, 30);
      for (let i = 0; i < 4; i++) { const a = this.a + i * Math.PI / 2; line(ctx, '#a89a78', cx, cy, cx + Math.cos(a) * 28, cy + Math.sin(a) * 28, 5); }
      disc(ctx, this.on(g) ? '#ff5a5a' : '#5cff7a', cx, cy, 5);
      if (this.on(g) && this.phase() === 'blow') { ctx.globalAlpha = 0.3; for (let i = 0; i < 10; i++) { const sx = cx - ((this.t * 8 + i * 31) % 160), sy = cy - 40 + ((i * 29) % 80); rect(ctx, '#ffffff', sx, sy, 16, 1); } ctx.globalAlpha = 1; }
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

  // ================= ACT 2, Kael's road: the Middle Deep =================
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
      z.trigger(5, 51, 6, 9, gg => { if (gg.state.mission === 'N1-5' || onRoad(gg, 'MD-')) { gg.step('N1-5:shaft'); gg.say('md_enter'); } }, { flag: 'md_in' });
      // deck 0: Wick's lift-hut
      z.prop('cage', 20, 59, { front: true }).prop('crate', 16, 59).prop('crate', 17, 59).prop('bones', 33, 59).prop('barrel', 40, 59);
      lamp(z, 10, 59, '#f5c542'); lamp(z, 28, 59, '#ff8a3a');
      z.npc('wick', 13, 59, { name: 'Old Wick', talk: gg => (gg.state.done['MD-4'] ? 'md_wick2' : 'md_wick') });
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
      z.trigger(30, 1, 16, 9, gg => { if (onRoad(gg, 'MD-')) { gg.step('MD-1:climb'); gg.say('md_top'); } }, { flag: 'md_top' });
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
      z.trigger(3, 3, 4, 19, gg => { if (onRoad(gg, 'MD-')) gg.say('md_ww'); }, { flag: 'md_ww' });
      const valve = (tx, n) => z.thing('valve', tx, 21 - (n === 2 ? 9 : 0), { prompt: 'Open the drain valve', col: '#ff5a5a', when: gg => !gg.flag('ww_v' + n),
        tick: (gg, t) => { t.col = gg.flag('ww_v' + n) ? '#5cff7a' : '#ff5a5a'; },
        use: gg => { gg.setFlag('ww_v' + n); gg.count('MD-2:valves'); sfx('gate'); fx.shake(3, 10); gg.toast('Drain valve opened (' + [1, 2, 3].filter(i => gg.flag('ww_v' + i)).length + '/3)', '#3ad0ff'); } });
      // entry: the first valve, the first bulkhead
      z.save(6, 21, 'glyph'); z.prop('pump', 12, 21).prop('pipe', 16, 21, { col: '#3ad0ff' }); lamp(z, 9, 21, '#3ad0ff');
      z.enemy('sludge', 18, 21);
      valve(22, 1); z.gate(26, 3, 19, { flag: 'ww_v1' });
      // the settling pools, and a catwalk with the second valve
      z.clear(31, 22, 6, 1).liquid(31, 23, 6, 2).plat(33, 20, 2);
      z.enemy('sludge', 40, 21); z.enemy('pumpdrone', 44, 12); z.enemy('sludge', 46, 21);
      z.plat(48, 19, 3).plat(52, 16, 4).plat(57, 13, 9);
      valve(63, 2); z.enemy('pumpdrone', 60, 8);
      z.prop('pipe', 55, 21, { col: '#3ad0ff' }); lamp(z, 50, 21, '#3ad0ff');
      z.gate(68, 3, 19, { flag: 'ww_v2' });
      // the flooded run: pipes over the water
      z.clear(72, 22, 20, 1).liquid(72, 23, 20, 2).plat(75, 20, 3).plat(80, 18, 3).plat(85, 20, 3).plat(89, 19, 2);
      z.enemy('pumpdrone', 78, 10); z.enemy('pumpdrone', 88, 9);
      z.enemy('sludge', 95, 21); valve(97, 3); z.prop('tank', 93, 21);
      z.gate(100, 3, 19, { flag: 'ww_v3' });
      // the pump hall
      [106, 114, 122, 130].forEach(x => z.prop('pump', x, 21)); z.prop('tank', 110, 21).prop('tankb', 126, 21);
      lamp(z, 104, 21, '#3ad0ff'); lamp(z, 136, 21, '#3ad0ff');
      z.arena({ id: 'hall', x0: 103, x1: 138, gy: 21, gh: 19, intro: 'md_hall_in', win: 'md_hall_win', armed: gg => onRoad(gg, 'MD-'),
        enemies: [['sludge', 118, 21], ['sludge', 126, 21], ['pumpdrone', 122, 10], ['pumpdrone', 130, 10], ['scavenger', 134, 21]], onWin: gg => gg.step('MD-2:hall') });
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
      z.trigger(3, 2, 4, 22, gg => { if (onRoad(gg, 'MD-')) gg.say('md_hollows'); }, { flag: 'md_hol' });
      [[10, '#5a8aff'], [22, '#b88aff'], [90, '#5a8aff'], [100, '#7dffb2'], [146, '#b88aff']].forEach(q => z.prop('glowcap', q[0], 23, { col: q[1], glow: q[1], gy: 22, gr: 24 }));
      z.enemy('sporeling', 16, 23); z.enemy('sporeling', 26, 23);
      // the cliff up to the camp: two glowcaps
      z.fill(36, 18, 4, 6).fill(40, 12, 42, 12);
      z.add(new Cap(34, 23)); z.add(new Cap(38, 17));
      z.hint(28, 14, 12, 10, 'Glowcaps: land on one holding JUMP to bounce high.');
      // the Lamplighters' camp on the shelf
      [44, 52, 64, 76].forEach(x => z.prop('lantern', x, 2, { col: '#7fe8ff', glow: '#7fe8ff', gy: 8, gr: 22 }));
      z.prop('tent', 50, 11, { col: '#2a5a6a' }).prop('tent', 70, 11, { col: '#3a4a6a' }).prop('firebarrel', 60, 11, { glow: '#7fe8ff', gy: 16, gr: 26 }).prop('glowcap', 78, 11, { col: '#7dffb2', glow: '#7dffb2', gy: 22, gr: 24 });
      z.npc('lumen', 58, 11, { name: 'Mother Lumen', talk: gg => (gg.state.steps['MD-3:nest'] || gg.state.done['MD-3'] ? 'md_lumen2' : 'md_lumen') });
      z.npc('lamper', 54, 11, { name: 'Lamplighter', talk: () => 'md_lamper' }); z.npc('lamper', 67, 11, { name: 'Lamplighter', talk: () => 'md_lamper2' });
      z.save(63, 11, 'glyph');
      z.trigger(44, 2, 4, 10, gg => { if (onRoad(gg, 'MD-')) { gg.step('MD-3:camp'); gg.say('md_camp'); } }, { flag: 'md_camp' });
      // the road east, down off the shelf
      z.enemy('sporeling', 88, 23); z.enemy('brute', 96, 23); z.enemy('sporeling', 102, 23);
      z.plat(92, 19, 5); z.add(new Cap(84, 23));
      // the spore nest
      z.arena({ id: 'nest', x0: 108, x1: 140, gy: 23, gh: 21, intro: 'md_nest_in', win: 'md_nest_win', armed: gg => onRoad(gg, 'MD-'),
        enemies: [['sporeling', 120, 23], ['sporeling', 126, 23], ['brute', 134, 23], ['sporeling', 130, 23], ['brute', 116, 23]], onWin: gg => gg.step('MD-3:nest') });
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
      z.trigger(8, 12, 3, 14, gg => { if (onRoad(gg, 'MD-')) { gg.step('MD-4:reach'); gg.say('md_breach'); } }, { flag: 'md_breach' });
      lamp(z, 6, 25, '#7fe8ff'); z.prop('lantern', 12, 13, { col: '#7fe8ff', glow: '#7fe8ff', gy: 8, gr: 22 });
      z.prop('seal', 46, 25, { col: '#d9b45a' }).prop('bones', 30, 25).prop('bones', 64, 25).prop('boulder', 22, 25);
      z.add(new Rockfall(18, 70, 12, 26));
      z.arena({ id: 'key', x0: 16, x1: 72, gy: 25, gh: 14, boss: true, enemies: [['keystone', 60, 25]], intro: 'md_key_in', win: 'md_key_win', music: 'boss',
        onWin: gg => gg.step('MD-4:boss') });
      z.thing('hatchup', 77, 25, { prompt: 'Climb to the surface', when: gg => !!gg.flag('arena:breach:key'), use: gg => gg.gotoZone('scrapton', 'hatch') });
    }
  };

  // ================= ACT 2, Nyra's road: the Underside =================
  Z.ballast = {
    name: 'The Ballast Decks', theme: 'underside', music: 'underside', w: 150, h: 24,
    build(z, g) {
      z.add(new Banner('THE UNDERSIDE', '#9ad8f0'));
      z.fill(0, 0, 150, 4);
      for (let x = 6; x < 150; x += 12) z.fill(x, 4, 2, 2 + (x % 3));
      // gantries hanging under the city; the gaps go all the way down to the cloud
      [[0, 28], [32, 54], [58, 80], [84, 104], [108, 126], [130, 149]].forEach(s => z.fill(s[0], 18, s[1] - s[0] + 1, 2));
      z.fill(0, 4, 1, 14);
      z.spawn('top', 4, 17).spawn('east', 145, 17);
      z.exit(149, 4, 1, 14, 'ducts', 'west');
      z.trigger(2, 4, 6, 14, gg => { if (onRoad(gg, 'US-')) gg.say('us_land'); }, { flag: 'us_land' });
      z.save(8, 17, 'glyph');
      z.plat(44, 15, 4).plat(68, 15, 4).plat(96, 15, 3).plat(116, 15, 4);
      z.add(new Gust(58, 80, 1)); z.add(new Gust(108, 126, -1)); z.add(new Gust(32, 54, 1));
      z.enemy('ballastdrone', 20, 10); z.enemy('hullwarden', 46, 17); z.enemy('wisp', 66, 11); z.enemy('hullwarden', 74, 17);
      z.enemy('hullwarden', 92, 17); z.enemy('ballastdrone', 98, 9); z.enemy('wisp', 114, 11); z.enemy('hullwarden', 120, 17); z.enemy('wisp', 136, 10);
      // Wren's relay at the far end
      z.prop('relay', 140, 17);
      z.thing('beacon', 143, 17, { prompt: "Answer Wren's relay", when: gg => onRoad(gg, 'US-') && !gg.state.steps['US-1:relay'], use: gg => gg.say('us_relay') });
      z.gate(147, 4, 14, { openIf: gg => !!(gg.state.steps['US-1:relay'] || gg.state.done['US-1']) || !falling(gg) });
    }
  };
  Z.ducts = {
    name: 'The Cargo Ducts', theme: 'ducts', music: 'underside', w: 140, h: 18,
    build(z, g) {
      z.add(new Banner('THE UNDERSIDE', '#9ad8f0'));
      z.fill(0, 0, 140, 8).ground(0, 139, 14);
      z.spawn('west', 2, 13).spawn('east', 136, 13);
      z.exit(0, 8, 1, 6, 'ballast', 'east'); z.exit(139, 8, 1, 6, 'cargodrop', 'top');
      z.trigger(3, 8, 4, 6, gg => { if (onRoad(gg, 'US-')) gg.say('us_ducts'); }, { flag: 'us_ducts' });
      const fan = (tx, n) => {
        z.add(new Fan(tx, 'dc_f' + n));
        z.thing('console', tx + 3, 13, { prompt: 'Shut the fan down', when: gg => !gg.flag('dc_f' + n),
          use: gg => { gg.setFlag('dc_f' + n); gg.count('US-2:fans'); sfx('gate'); gg.toast('Fan shut down (' + [1, 2, 3].filter(i => gg.flag('dc_f' + i)).length + '/3)', '#b48cff'); } });
      };
      z.save(5, 13, 'glyph'); lamp(z, 9, 13, '#d9b45a');
      z.fill(18, 12, 2, 2).prop('crate', 24, 13);
      fan(32, 1);
      z.enemy('maintunit', 44, 13); z.enemy('wisp', 52, 10); z.fill(48, 12, 3, 2).prop('crate', 58, 13);
      z.save(64, 13, 'glyph');
      fan(72, 2);
      z.enemy('maintunit', 86, 13); z.enemy('ballastdrone', 94, 10); z.enemy('wisp', 100, 10); z.fill(90, 12, 2, 2);
      fan(112, 3);
      z.enemy('maintunit', 124, 13);
      z.gate(132, 8, 6, { openIf: gg => [1, 2, 3].every(i => gg.flag('dc_f' + i)) || !falling(gg) });
    }
  };
  // the pod: the reverse of the Skylift. Board, cut it loose, fall through three waves, then the Clerk.
  const P0 = 8, P1 = 56;
  const WAVES = [
    [['ballastdrone', 20, { hp: 22 }], ['ballastdrone', 44, { hp: 22 }]],
    [['wisp', 18, { hp: 20 }], ['hullwarden', 40, { hp: 58 }], ['wisp', 48, { hp: 20 }]],
    [['hullwarden', 16, { hp: 58 }], ['hullwarden', 46, { hp: 58 }], ['ballastdrone', 30, { hp: 22 }]]
  ];
  const GRAV = { normal: 'GRAVITY: NORMAL', light: 'GRAVITY: LIGHT - you float', heavy: 'GRAVITY: HEAVY - every step drags' };
  class Pod {
    constructor() { this.state = 'idle'; this.t = 0; this.alt = 1; this.wave = 0; this.foes = []; this.g = 'normal'; this.gt = 0; }
    riding() { return ['rest', 'fight', 'boss', 'talk', 'land'].indexOf(this.state) >= 0; }
    update(g, z) {
      this.t++;
      const p = g.player;
      if (!p || g.busy()) return;
      if (this.state === 'start') { this.state = 'talk'; g.say('us_pod', () => { this.state = 'rest'; this.wt = 80; this.wave = 0; sfx('explode'); fx.shake(8, 24); g.toast('THE POD IS FALLING', '#9ad8f0'); }); }
      else if (this.state === 'rest') { this.alt = Math.max(1 - (this.wave + 1) / (WAVES.length + 2), this.alt - 0.0007); if (--this.wt <= 0) {
        this.foes = WAVES[this.wave].map(w => { const e = z.enemy(w[0], w[1], 3, w[2]); e.state = 'chase'; e.ax0 = (P0 + 1) * T; e.ax1 = (P1 - 1) * T; fx.ring(e.x, e.y - 10, '#d9b45a', 4, 26, 14); return e; });
        this.state = 'fight'; g.toast('BOARDERS ' + (this.wave + 1) + ' / ' + WAVES.length, '#ff5a5a'); sfx('roar');
      } }
      else if (this.state === 'fight') { g.alert(); if (this.foes.every(f => f.dead)) {
        this.wave++;
        if (this.wave >= WAVES.length) { this.state = 'talk'; p.heal(p.hpMax()); g.say('us_clerk', () => {
          const e = z.enemy('clerk', 44, 6); e.ax0 = (P0 + 1) * T; e.ax1 = (P1 - 1) * T; e.state = 'chase'; e.dormant = false; g.boss = e; this.boss = e; this.state = 'boss'; this.gt = 0; this.g = 'normal'; SW.audio.music('boss');
        }); }
        else { this.state = 'rest'; this.wt = 90; p.heal(Math.round(p.hpMax() * 0.12)); }
      } }
      else if (this.state === 'boss') {
        g.alert();
        this.alt = Math.max(0.06, this.alt - 0.0003);
        // the Clerk's rod: normal, light, normal, heavy; each change is called out a second early
        const seq = ['normal', 'light', 'normal', 'heavy'], len = 260, k = Math.floor(this.gt / len) % 4, into = this.gt % len;
        this.gt++;
        if (into === len - 60) { const nx = seq[(k + 1) % 4]; if (nx !== 'normal') { g.toast(nx === 'light' ? 'The rod hums: gravity is going LIGHT' : 'The rod groans: gravity is going HEAVY', '#b48cff'); sfx('tele'); } }
        if (into === 0 && this.g !== seq[k]) { this.g = seq[k]; g.toast(GRAV[this.g], this.g === 'normal' ? '#ffffff' : '#b48cff'); fx.flash('#b48cff', 6); }
        if (!p.dead) {
          if (this.g === 'light' && !p.onGround) p.vy -= 0.22;
          if (this.g === 'heavy') { if (!p.onGround) p.vy += 0.18; if (Math.abs(p.vx) > 0.3) push(z, p, -p.vx * 0.4); }
        }
        if (this.boss.dead) { g.boss = null; this.g = 'normal'; this.state = 'talk'; g.say('us_clerk_win', () => { this.state = 'land'; this.lt = 50; fx.shake(10, 40); sfx('explode'); }); }
      }
      else if (this.state === 'land') { if (--this.lt <= 0) { this.state = 'done'; g.step('US-3:boss'); g.gotoZone('scrapton', 'chute'); } }
    }
    draw(ctx, cam, g) {
      const x0 = Math.round(P0 * T - cam.x), x1 = Math.round((P1 + 1) * T - cam.x), y = Math.round(13 * T - cam.y), t = this.t;
      // the pod's hull under the deck
      rect(ctx, '#5a564c', x0 + 6, y + 32, x1 - x0 - 12, 26); rect(ctx, '#76705f', x0 + 6, y + 32, x1 - x0 - 12, 3); rect(ctx, '#d9b45a', x0 + 10, y + 44, x1 - x0 - 20, 2);
      rect(ctx, '#4a463c', x0 + 30, y + 58, x1 - x0 - 60, 10); rect(ctx, '#ff8a3a', x0 + 40, y + 66, 6, 4); rect(ctx, '#ff8a3a', x1 - 46, y + 66, 6, 4);
      if (this.state === 'idle' || this.state === 'start') {
        // the clamps and the bay above, before the drop
        rect(ctx, '#e4dfd2', 0, 0, W, Math.round(T - cam.y)); rect(ctx, '#8f8a7c', 0, Math.round(T - cam.y), W, 3);
        [x0 + 10, x1 - 14].forEach(cx => { rect(ctx, '#3a3f4e', cx, Math.round(T - cam.y), 4, y - Math.round(T - cam.y) - 2); rect(ctx, '#d9b45a', cx - 4, y - 8, 12, 4); });
        return;
      }
      if (!this.riding() && this.state !== 'done') return;
      // falling: cloud rushing up past the pod, streaks of wind
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < 9; i++) { const cy = H - ((t * 3 + i * 53) % (H + 80)) + 40, cx = (i * 97 + 30) % W; rect(ctx, '#ffffff', cx - 30, cy, 60, 8); rect(ctx, '#ffffff', cx - 18, cy + 8, 36, 5); }
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 14; i++) { const sy = H - ((t * 9 + i * 41) % (H + 40)) + 20, sx = (i * 67 + 11) % W; rect(ctx, '#ffffff', sx, sy, 1, 16); }
      ctx.globalAlpha = 1;
      if (this.state === 'boss' && this.g !== 'normal') { ctx.globalAlpha = 0.08 + 0.04 * Math.sin(t * 0.2); rect(ctx, '#b48cff', 0, 0, W, H); ctx.globalAlpha = 1; }
    }
  }
  Z.cargodrop = {
    name: 'The Cargo Drop', theme: 'cargo', music: 'underside', w: 64, h: 17,
    build(z, g) {
      z.add(new Banner('THE UNDERSIDE', '#9ad8f0'));
      z.fill(P0, 13, P1 - P0 + 1, 2).fill(P0 - 1, 0, 1, 15).fill(P1 + 1, 0, 1, 15);
      z.spawn('top', 12, 12);
      const pod = z.add(new Pod());
      z.trigger(P0 + 1, 1, 6, 12, gg => { if (onRoad(gg, 'US-')) gg.say('us_bay'); }, { flag: 'us_bay' });
      z.prop('crate', 30, 12).prop('crate', 31, 12).prop('crate', 46, 12).prop('barrel', 20, 12);
      z.thing('console', 16, 12, { prompt: 'Cut the pod loose', when: gg => onRoad(gg, 'US-') && pod.state === 'idle',
        use: gg => { gg.step('US-3:pod'); pod.state = 'start'; gg.player.vx = 0; } });
      // after the war is won, or on an old save, there is nothing to ride
      z.thing('door', 52, 12, { prompt: 'Climb back into the ducts', when: gg => pod.state === 'idle', use: gg => gg.gotoZone('ducts', 'east') });
    }
  };
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    const pod = g.zone && g.zone.id === 'cargodrop' && g.zone.ents.find(e => e instanceof Pod);
    if (!pod || !pod.riding()) return;
    const h = 120, x = W - 16, y = 70, a = SW.clamp(pod.alt, 0, 1);
    art.rect(ctx, '#05060c', x - 2, y - 2, 8, h + 4); art.rect(ctx, '#2a2e3a', x, y, 4, h); art.rect(ctx, '#9ad8f0', x, y + Math.round(h * (1 - a)), 4, Math.round(h * a));
    text(ctx, 'ALT', x + 2, y + h + 6, '#9ad8f0', { align: 'center' });
    if (pod.state === 'boss' && pod.g !== 'normal') text(ctx, pod.g === 'light' ? 'LIGHT' : 'HEAVY', x + 2, y - 12, '#b48cff', { align: 'center' });
  };

  // ================= hooking the roads in =================
  // Kael's road: the top of Grist's shaft opens into the Shafts now (old saves past it keep the old way up)
  story.patch('metro', (z, g) => {
    z.exits.forEach(e => {
      if (e.to !== 'scrapton' || e.spawn !== 'hatch') return;
      Object.defineProperty(e, 'to', { get: () => (climbing(G) ? 'shafts' : 'scrapton'), configurable: true });
      Object.defineProperty(e, 'spawn', { get: () => (climbing(G) ? 'bottom' : 'hatch'), configurable: true });
    });
  });
  // Nyra's road: the Garbage Chute drops her on the Underside, not in the Rust Flats
  const _go = G.gotoZone; G.gotoZone = function (id, spawn) {
    if (id === 'scrapton' && spawn === 'chute' && G.state && falling(G)) { id = 'ballast'; spawn = 'top'; }
    return _go.call(this, id, spawn);
  };
  // when the Keystone breaks, Wick gets the old freight shaft running again: the Scrapton hatch goes straight down
  story.patch('scrapton', (z, g) => {
    z.ents.forEach(e => {
      if (!(e instanceof SW.Thing) || e.kind !== 'hatch') return;
      const u = e.use; e.use = (gg, t) => (gg.state.done['MD-4'] ? gg.gotoZone('metro', 'shaft') : u(gg, t));
    });
  });
  // a save made mid-road (or a mission that finished with no next one before this file existed)
  const _cg = G.continueGame; G.continueGame = function () {
    _cg.apply(this, arguments);
    const S = G.state;
    if (!S || G.scene !== 'play' || S.mission) return;
    if (S.done['N1-5'] && !S.done['A2-1'] && /^(shafts|waterworks|hollows|breach)$/.test(S.zone || '')) S.mission = 'MD-1';
  };

  // ---------- the world map ----------
  D.world.push({ id: 'shafts', name: 'The Middle Deep', layer: 2, x: 400, y: 196 }, { id: 'ballast', name: 'The Underside', layer: 0, x: 180, y: 86 });
  D.routes.forEach(r => { if (r[0] === 'metro' && r[1] === 'scrapton') r.length = 2; });
  D.routes.push(['metro', 'shafts'], ['shafts', 'scrapton', 'The Breach'], ['skyport', 'ballast'], ['ballast', 'scrapton', 'Cargo Drop']);
  const GROUP = { waterworks: 'shafts', hollows: 'shafts', breach: 'shafts', ducts: 'ballast', cargodrop: 'ballast' };
  const _map = ui.drawMap; ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };

  // ================= the words =================
  Object.assign(L, {
    // --- the Shafts ---
    md_enter: [
      say('sys', 'The Metro Shaft does not open onto the sky. It opens into a hollow the size of a cathedral: lift cages, rusted decks, ladders climbing into the dark.'),
      say('wick', 'Easy. Easy! Put the fists down. Nobody has come up Grist\'s shaft in years. Grist saw to that.'),
      say('wick', "Name's Wick. I kept these lifts when they still ran. This is the Middle Deep, friend: everything between Deepline and the sun."),
      say('hero', { K: '(Up. The air smells different, up there.) How far to the surface?', N: 'How far to the surface?' }),
      say('wick', 'Six decks of Shafts. Then the Waterworks, then the Fungal Hollows, then the Breach. And in the Breach sits the Keystone.'),
      say('wick', 'Halcyon sealed the old road up with it, long before you were born. Nothing from below gets past. People have tried. I buried some of them.'),
      say('hero', { K: "Then I'll be the first one through.", N: 'Then I will be the first one through.' }),
      say('wick', "Ha. They all say that. Ladders link the decks. Cable Rats nest in the wiring, and scavengers pick over anything that falls. Go on, then.", { fn: 'card:mid_k' })
    ],
    md_wick: [say('wick', 'The ladders hold. Mostly. Hold on with both hands and swear with your mouth: that is the Shaft way.')],
    md_wick2: [say('wick', 'You broke the Keystone. Forty years I looked up at that gold thing. I have the old freight shaft running again: the hatch in Scrapton comes straight down to the metro now.')],
    md_top: [say('sys', 'The top deck. Warm, wet air pours out of a pipe tunnel to the east, and with it the thump of very old pumps.')],
    // --- the Waterworks ---
    md_ww: [
      say('sys', 'The Waterworks. Halcyon built these pumps to keep the deep water off its foundations. Nobody has serviced them in ninety years. They pump anyway.'),
      say('sys', 'Bulkheads seal the halls. Each one opens when its drain valve is turned. Find all three.')
    ],
    md_hall_in: [say('sys', 'The pump hall. Something has been living in the sludge, and the drones have been feeding it.')],
    md_hall_win: [say('sys', 'The hall goes quiet except for the pumps. A tunnel to the east breathes cool air, and there is light in it. Blue light.')],
    // --- the Fungal Hollows ---
    md_hollows: [
      say('sys', 'The Fungal Hollows. Mushrooms taller than houses, glowing in the dark. Someone has hung lanterns along a path up the cliff.'),
      say('hero', { K: '(Lanterns. People live up there.)', N: '(Lanterns. People live up there.)' })
    ],
    md_camp: [
      say('lumen', 'Stop there, climber. Lamp up or turn back.'),
      say('lumen', '...You came up from the metro? Then you are why Grist stopped sending his collectors. Good. I am Mother Lumen. We are the Lamplighters.'),
      say('lumen', 'We keep the old road lit for anyone mad enough to walk it up. Not many do. Fewer come back down.'),
      say('hero', { K: "I'm going to the Breach.", N: 'I am going to the Breach.' }),
      say('lumen', 'Then you need the road clear. A spore nest has grown across it, east of here. The brutes guard it like it is their mother. It sort of is.'),
      say('lumen', 'And the Keystone... It wakes when anything living walks up to the seal. When it fights, the roof comes down. Watch the shadows on the floor, not just the stone.')
    ],
    md_lumen: [say('lumen', 'The nest is east, down off the shelf. Burn through it and the Breach is yours.')],
    md_lumen2: [say('lumen', 'The lamps are for the ones who come after. Somebody always comes after.')],
    md_lamper: [say('lamper', 'Hold your breath near the sporelings. When they pop, the cloud stings.')],
    md_lamper2: [say('lamper', 'The glowcaps throw you if you land on them holding jump. We use them as stairs. Mother Lumen uses them as a punishment.')],
    md_nest_in: [say('sys', 'The spore nest pulses. Every sporeling in it turns at once.')],
    md_nest_win: [say('sys', 'The nest collapses into dust. Beyond it the road climbs towards a wall of cut stone, and a gleam of gold.')],
    // --- the Breach ---
    md_breach: [
      say('sys', 'The Breach. The road ends in a wall of cut stone. Set into it is a gold seal as tall as a door, with words carved around the rim:'),
      say('sys', '"BY ORDER OF HALCYON: WHAT IS BELOW STAYS BELOW."'),
      say('hero', { K: '(Daylight. Through the cracks above the seal. Just a thread of it.)', N: '(Daylight, through the cracks. Just a thread of it.)' })
    ],
    md_key_in: [
      say('sys', 'The seal turns. Stone grinds on stone, and the wall stands up.'),
      say('sys', 'THE KEYSTONE: Halcyon\'s seal-guardian. Hold S to GUARD its fists. When its eye flashes white, DASH (L) past the charge. Watch for shadows: the roof is coming down.')
    ],
    md_key_win: [
      say('sys', 'The Keystone falls to its knees. The gold seal cracks down the middle, and light pours through it: real light, from straight above.'),
      say('hero', { K: '(Sun. Real sun.)', N: '(Sun.)' }),
      say('sys', 'A shaft climbs through the broken seal to the surface. Take the ladder up.')
    ],
    // --- the Underside ---
    us_land: [
      say('sys', 'The chute spits you out into wind. You slam onto a steel gantry hanging from the bottom of the city, with nothing under it but cloud.'),
      say('hero', { N: '(Not dead. Not falling. Not yet.)', K: '(Not dead. Not falling. Not yet.)' }),
      say('wren', "- hey. HEY. It's Wren. You're on my old relay band. Don't look down."),
      say('wren', "You went through the Garbage Chute and caught on the Underside: the ballast decks under Aurelia. Halcyon's basement, hanging upside down."),
      say('wren', "There's a relay mast at the east end of the decks. Get to it and I can see you properly. Mind the wind: it gusts between the hull ribs, and it always blows towards the drop.", { fn: 'card:mid_n' })
    ],
    us_relay: [
      say('wren', 'Got you. Okay. Bad news: the decks dead-end. Good news: the cargo ducts run all the way to the drop bay.'),
      say('wren', 'The drop bay is how Halcyon sends junk down to the Surface.'),
      say('hero', { N: 'Junk.', K: 'Junk.' }),
      say('wren', "Junk, broken drones, people they're done with. You'd be in excellent company. The ducts have three big fans. Shut them off or they'll blow you back to the start.", { step: 'US-1:relay' })
    ],
    us_ducts: [
      say('sys', 'The cargo ducts. A long brass throat, roaring. Each fan breathes out, stalls, and breathes out again.'),
      say('sys', 'Walk through while a fan stalls (GUARD to brace against the wind). Its off-switch is on the far side.')
    ],
    us_bay: [
      say('wren', "That's the drop bay. Cargo pods hang on clamps over the open sky. Use the console, cut one loose, and ride it down."),
      say('hero', { N: 'Ride it.', K: 'Ride it.' }),
      say('wren', "Ride it. Yes. I'm aware how it sounds.")
    ],
    us_pod: [
      say('sys', 'The clamps let go. The pod drops out from under Aurelia, and the city falls away above you.'),
      say('wren', "Uh. I'm reading company. A LOT of company. They're dropping onto the pod after you.")
    ],
    us_clerk: [
      say('sys', 'Something lands on the pod with a polite little thump: a thin man in ink-purple, with a brass rod in one hand and a ledger in the other.'),
      say('clerk', 'Clerk of the Ballast Office. This pod is registered as junk. You are not junk. You are unregistered mass.'),
      say('hero', { N: 'I am leaving.', K: "I'm leaving." }),
      say('clerk', 'Unregistered mass does not leave. It is corrected.'),
      say('sys', 'His rod bends gravity. When it goes LIGHT you float; when it goes HEAVY every step drags. Hold S to GUARD his swings.')
    ],
    us_clerk_win: [
      say('clerk', 'This... will need a form.'),
      say('sys', 'The Clerk lets go of the pod and floats back up towards the city, ledger flapping.'),
      say('wren', 'Brace! Brace brace brace -'),
      say('sys', 'The pod hits the Surface like a dropped anvil.', { step: 'US-3:boss' })
    ]
  });
  story.middle = { KZ, NZ, Pod, Fan, Gust, Cap, climbing, falling };
})();
