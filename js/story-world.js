'use strict';
// Shattered Worlds — the places the story structure (story.js) needs: every bonus hero's own Act 1 tutorial zone,
// the Act 2 maps (Ash Dunes, Glowwild) and the two hero-only secret maps, plus the cast, props and bosses in them.
// Like story.js this only adds and wraps; no other file is edited.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, TH = art.themes;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring;

  // ================= art: themes, props, recoloured cast =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    pens:    theme('metro', { style: 'brick', a: '#3a2e2a', b: '#2e2420', top: '#6a5040', hi: '#9a7858', deep: '#160f0c', plat: '#6a5a40', sky: ['#0a0606', '#241410'], dim: 0.62 }),
    mine:    theme('metro', { style: 'dirt', a: '#4a3c30', b: '#3c3026', top: '#7a6248', hi: '#a88a60', deep: '#1a130e', plat: '#7a6238', sky: ['#070504', '#1a120c'], dim: 0.6 }),
    stacks:  theme('metro', { style: 'plate', a: '#3a4a52', b: '#2e3c44', top: '#6a8a92', hi: '#9ac8c8', deep: '#101a20', plat: '#5a8a80', sky: ['#04100e', '#12302a'], dim: 0.55, haz: '#6fd3e8' }),
    works:   theme('slums', { a: '#4a3a2a', b: '#3a2c20', top: '#8a6a3a', hi: '#c8a05a', deep: '#1a120a', plat: '#8a6a3a', sky: ['#0c0804', '#2a1a0a'], dim: 0.6, haz: '#ff8a3a' }),
    cryo:    theme('lab', { a: '#a8c4d8', b: '#90aec6', top: '#e6f4ff', hi: '#ffffff', deep: '#5a7a94', plat: '#6f93b8', sky: ['#6a8aa8', '#b8d4e8'], dim: 0.45, haz: '#bfefff' }),
    furnace: theme('lab', { a: '#4a3a38', b: '#3a2c2a', top: '#7a5a50', hi: '#b08068', deep: '#1c1412', plat: '#8a5a3a', sky: ['#1a0c08', '#4a2010'], dim: 0.72, haz: '#e8ecf4' }),
    core:    theme('lab', { a: '#3a3238', b: '#2c262c', top: '#6a4a40', hi: '#ff8a3a', deep: '#140e10', plat: '#8a4a2a', sky: ['#140606', '#501808'], dim: 0.75, haz: '#6fd3e8' }),
    ward:    theme('lab', { a: '#2a2c44', b: '#20223a', top: '#4a4f78', hi: '#8088c0', deep: '#0c0d1c', plat: '#4a4f78', sky: ['#05060f', '#12142c'], dim: 0.82, haz: '#8b5cf6' }),
    ash:     theme('surface', { a: '#6a6660', b: '#56524e', top: '#a8a49a', hi: '#d0ccc0', deep: '#2e2c2a', plat: '#5a4a3a', sky: ['#4a4a52', '#c08a58'], dim: 0.4, haz: '#ff8a3a' }),
    glow:    theme('surface', { a: '#24402e', b: '#1c3426', top: '#4e8a52', hi: '#9aff8a', deep: '#0e1c14', plat: '#3a5a34', sky: ['#06140e', '#1e4a34'], dim: 0.74, haz: '#b8ff40' }),
    ice:     theme('sky', { a: '#9ab8d0', b: '#7f9eb8', top: '#e6f4ff', hi: '#ffffff', deep: '#3e5c8a', plat: '#7fd8ff', sky: ['#0a1830', '#27456e'], mid: 'arches', midCol: '#16284a', bg: 'none', dim: 0, haz: '#bfefff' })
  });
  SW.audio.tracks.dunes = { bpm: 90, root: 41, prog: [0, -2, 3, -4], arp: [0, 7, 10, 12, 10, 7, 3, 7], bass: 'sawtooth', drums: 0.6 };
  SW.audio.tracks.glow = { bpm: 84, root: 39, prog: [0, 3, -2, 1], arp: [0, 6, 12, 6, 3, 15, 12, 6], bass: 'triangle', drums: 0.4 };

  // extra props: [width, height, draw], anchored bottom-centre like the built-in ones
  const PROPS = {
    stones: [40, 44, x => { [[4, 14, 9, 30], [16, 4, 10, 40], [29, 18, 8, 26]].forEach(q => { rect(x, '#6a6e7a', q[0], q[1], q[2], q[3]); rect(x, '#8a8e9a', q[0], q[1], 2, q[3]); rect(x, '#4a4e5a', q[0] + q[2] - 2, q[1], 2, q[3]); rect(x, '#9aa0b0', q[0] + 1, q[1], q[2] - 2, 2); }); ring(x, '#f5c542', 21, 16, 3); rect(x, '#22d3ee', 21, 16, 1, 1); }],
    cairn: [26, 20, x => { for (let i = 0; i < 4; i++) rect(x, i % 2 ? '#d8d4c4' : '#c8c4b0', 3 + i * 3, 14 - i * 4, 20 - i * 6, 5); disc(x, '#e8e4d4', 13, 3, 3); rect(x, '#1a1612', 11, 3, 1, 1); rect(x, '#1a1612', 14, 3, 1, 1); line(x, '#d8d4c4', 2, 19, 8, 16, 1); }],
    boulder: [44, 40, x => { disc(x, '#5a5650', 22, 20, 18); disc(x, '#7a766e', 20, 18, 15); disc(x, '#8e8a80', 16, 13, 8); line(x, '#4a4640', 10, 22, 20, 28, 1); line(x, '#4a4640', 26, 10, 32, 20, 1); rect(x, '#3a3632', 5, 37, 34, 3); }],
    cave: [40, 36, x => { disc(x, '#0a0806', 20, 22, 16); rect(x, '#0a0806', 4, 22, 32, 14); ring(x, '#5a5650', 20, 22, 17); }],
    chimes: [40, 70, x => { rect(x, '#8c7a6a', 18, 6, 3, 64); rect(x, '#5a4a40', 14, 66, 11, 4); line(x, '#8c7a6a', 19, 8, 4, 20, 2); line(x, '#8c7a6a', 19, 8, 36, 16, 2); for (let i = 0; i < 9; i++) { const cx = 4 + i * 4, cy = 20 - Math.abs(i - 4); rect(x, '#5a6078', cx, cy, 1, 6 + (i % 3) * 3); rect(x, i % 2 ? '#c8ccd8' : '#7dffb2', cx - 1, cy + 6 + (i % 3) * 3, 3, 5); } }],
    dud: [22, 30, x => { rect(x, '#5a6a4a', 7, 4, 8, 22); rect(x, '#7a8a62', 7, 4, 2, 22); rect(x, '#3a4630', 5, 0, 12, 5); rect(x, '#3a4630', 3, 0, 2, 9); rect(x, '#3a4630', 17, 0, 2, 9); rect(x, '#f5c542', 7, 12, 8, 2); rect(x, '#ff5a5a', 10, 16, 2, 2); rect(x, '#6a6660', 2, 26, 18, 4); }],
    relay: [26, 90, x => { rect(x, '#4a5060', 11, 20, 4, 70); rect(x, '#6a7088', 11, 20, 1, 70); line(x, '#4a5060', 2, 89, 12, 50, 2); line(x, '#4a5060', 24, 89, 14, 50, 2); rect(x, '#3a3f4e', 6, 12, 14, 10); disc(x, '#d9b45a', 13, 8, 6); disc(x, '#fff7d0', 13, 8, 3); rect(x, '#ff5a5a', 12, 0, 2, 3); for (let i = 0; i < 4; i++) rect(x, '#8a92a8', 8, 30 + i * 14, 10, 1); }],
    beacon: [30, 26, x => { rect(x, '#e6e8ee', 2, 8, 26, 18); rect(x, '#b9c0ce', 2, 8, 5, 18); rect(x, '#8e2430', 2, 12, 26, 3); rect(x, '#2b2f3a', 10, 16, 10, 10); rect(x, '#ff5a5a', 13, 2, 4, 6); rect(x, '#ffffff', 14, 3, 1, 2); rect(x, '#5a6478', 0, 24, 30, 2); }],
    frosttree: [40, 64, x => { rect(x, '#c8d8e8', 18, 20, 5, 44); rect(x, '#e6f4ff', 18, 20, 1, 44); line(x, '#c8d8e8', 20, 30, 6, 14, 2); line(x, '#c8d8e8', 21, 26, 34, 8, 2); line(x, '#c8d8e8', 20, 40, 32, 30, 2); line(x, '#e6f4ff', 6, 14, 2, 6, 1); line(x, '#e6f4ff', 34, 8, 38, 2, 1); disc(x, '#bfefff', 20, 16, 5); disc(x, '#ffffff', 20, 15, 3); rect(x, '#e6f4ff', 12, 62, 18, 2); }],
    iceseam: [18, 40, x => { line(x, '#7fd8ff', 9, 1, 5, 14, 3); line(x, '#7fd8ff', 5, 14, 12, 26, 3); line(x, '#7fd8ff', 12, 26, 8, 39, 3); line(x, '#ffffff', 9, 2, 6, 14, 1); line(x, '#ffffff', 6, 15, 12, 26, 1); }],
    vent: [34, 16, x => { rect(x, '#3a3632', 2, 8, 30, 8); rect(x, '#5a5650', 4, 6, 26, 3); rect(x, '#8a92a8', 8, 2, 18, 5); rect(x, '#c8ccd8', 8, 2, 18, 1); rect(x, '#d9b45a', 15, 4, 4, 2); }],
    pen: [36, 40, x => { for (let i = 0; i < 6; i++) rect(x, '#5a5048', 2 + i * 6, 0, 2, 40); rect(x, '#7a6a58', 0, 0, 36, 3); rect(x, '#7a6a58', 0, 20, 36, 2); rect(x, '#3a2e26', 0, 37, 36, 3); }],
    minecart: [34, 22, x => { rect(x, '#4a4640', 2, 4, 30, 12); rect(x, '#6a665e', 2, 4, 30, 2); rect(x, '#2e2a26', 4, 8, 26, 1); disc(x, '#1a1816', 9, 18, 3); disc(x, '#1a1816', 25, 18, 3); rect(x, '#8a7a50', 6, 1, 8, 4); rect(x, '#a89a80', 16, 0, 10, 5); }],
    cryotank: [22, 46, x => { rect(x, '#5a7a94', 0, 0, 22, 4); rect(x, '#5a7a94', 0, 42, 22, 4); rect(x, '#bfefff', 2, 4, 18, 38); rect(x, '#ffffff', 3, 5, 2, 36); rect(x, '#7fd8ff', 15, 5, 4, 36); rect(x, '#3e6ea8', 8, 12, 6, 24); rect(x, '#27456e', 9, 10, 4, 4); }],
    char: [30, 26, x => { const r = SW.rng(9); for (let i = 0; i < 12; i++) { const w = 3 + r() * 8, px = r() * 22, h = 4 + r() * 18; rect(x, i % 3 ? '#1c1412' : '#2a1c18', px, 26 - h, w, h); } rect(x, '#ff8a3a', 8, 22, 2, 1); rect(x, '#ffd24a', 19, 20, 1, 1); }]
  };
  const pcache = {}, _prop = art.prop, _psize = art.propSize;
  art.prop = function (ctx, kind, x, y, col, flip) {
    const d = PROPS[kind];
    if (!d) return _prop(ctx, kind, x, y, col, flip);
    let c = pcache[kind];
    if (!c) { const cv = SW.canvas(d[0], d[1]); d[2](cv[1]); c = pcache[kind] = cv[0]; }
    ctx.drawImage(c, Math.round(x - d[0] / 2), Math.round(y - d[1]));
  };
  art.propSize = kind => (PROPS[kind] ? [PROPS[kind][0], PROPS[kind][1]] : _psize(kind));

  // new characters are existing sprite sheets with the palette swapped (and, for two beasts, scaled up)
  const hex = c => parseInt(c.slice(1), 16);
  const DK = ['skin', 'hair', 'top', 'pants', 'boots', 'acc', 'trail', 'arm', 'hand', 'fore'];
  function recolor(id, src, swap, raw) {
    const s = art.sheets[src];
    if (!s) return;
    const C = (s.cfg && s.cfg.c) || {}, map = {}, nc = Object.assign({}, C);
    const put = (from, to) => { if (from && to) map[hex(from)] = hex(to); };
    Object.keys(swap || {}).forEach(k => {
      const to = swap[k];
      put(C[k], to); nc[k] = to;
      if (DK.indexOf(k) >= 0) { put(C[k + 'D'], art.shade(to, 0.7)); nc[k + 'D'] = art.shade(to, 0.7); }
      if (k === 'top' && C.top) put(art.shade(C.top, 1.3), art.shade(to, 1.3));
      if (k === 'hair' && C.hair) put(art.shade(C.hair, 1.2), art.shade(to, 1.2));
    });
    Object.keys(raw || {}).forEach(k => put(k, raw[k]));
    const paint = cv => {
      const pair = SW.canvas(cv.width, cv.height), c = pair[0], x = pair[1];
      x.drawImage(cv, 0, 0);
      const im = x.getImageData(0, 0, c.width, c.height), d = im.data;
      for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const to = map[(d[i] << 16) | (d[i + 1] << 8) | d[i + 2]]; if (to !== undefined) { d[i] = to >> 16; d[i + 1] = (to >> 8) & 255; d[i + 2] = to & 255; } }
      x.putImageData(im, 0, 0);
      return c;
    };
    art.sheets[id] = Object.assign({}, s, { img: paint(s.img), head: s.head ? paint(s.head) : null, cfg: s.cfg ? Object.assign({}, s.cfg, { c: nc }) : null });
  }
  // frames: source frame numbers; paint(ctx, i) may draw over frame i; anims name the new frames
  function scaled(id, src, k, frames, anims, o) {
    const s = art.sheets[src];
    if (!s) return;
    const fw = s.fw * k, fh = s.fh * k, pair = SW.canvas(frames.length * fw, fh), c = pair[0], x = pair[1];
    x.imageSmoothingEnabled = false;
    frames.forEach((f, i) => x.drawImage(s.img, (f % s.cols) * s.fw, Math.floor(f / s.cols) * s.fh, s.fw, s.fh, i * fw, 0, fw, fh));
    if (o && o.tint) { x.globalCompositeOperation = 'source-atop'; x.globalAlpha = o.tint[1]; x.fillStyle = o.tint[0]; x.fillRect(0, 0, c.width, c.height); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
    if (o && o.paint) frames.forEach((f, i) => { x.save(); x.translate(i * fw, 0); o.paint(x, i); x.restore(); });
    const fl = SW.canvas(c.width, c.height);
    fl[1].drawImage(c, 0, 0); fl[1].globalCompositeOperation = 'source-in'; fl[1].fillStyle = '#fff'; fl[1].fillRect(0, 0, c.width, c.height);
    art.sheets[id] = { img: c, flash: fl[0], fw, fh, cols: frames.length, ox: fw / 2, oy: s.oy * k, anims };
  }
  function bakeCast() {
    // people
    recolor('pip', 'kid', { top: '#8a5a3a', hair: '#2a2018' });
    recolor('dov', 'bookie', { acc: '#f5c542', top: '#6a5a48', pants: '#3a3430' });
    recolor('coil', 'mags', { hair: '#d8e4e0', top: '#3a6a5a', pants: '#2a3a36' });
    recolor('sprocket', 'ferro', { top: '#6a4a2a', hair: '#8a8a90', pants: '#3a3028' });
    recolor('juniper', 'ganger', { top: '#3a5a34', pants: '#2a3a28' }, { '#f5c542': '#b8ff40' });
    // rank and file
    recolor('digger', 'thug', { hair: '#f5c542', top: '#5a5248', pants: '#3a3430' });
    recolor('hazmat', 'guard', { top: '#f5c542', pants: '#c89a2a' });
    recolor('raider', 'bandit', { top: '#7a2a2a', hair: '#3a2a20', pants: '#3a3030' });
    recolor('gunner', 'ganger', { top: '#7a4a2a', pants: '#3a2c20' }, { '#f5c542': '#ff8a3a' });
    recolor('stalker', 'feral', { skin: '#3a7a4a', top: '#1e3a2a', pants: '#16281e', boots: '#4e8a52' }, { '#c8ff5a': '#eaff9a' });
    // tutorial bosses
    recolor('holt', 'brandt', { top: '#5a3a2a', hair: '#3a2a20', pants: '#3a3028' }, { '#ff8a3a': '#7fd8ff', '#ffe0a0': '#ffffff' });
    recolor('crake', 'tusk', { top: '#c8642a', skin: '#9a7a60', pants: '#3a3a44' }, { '#6b5234': '#5a6070', '#b8bcc8': '#f5c542' });
    recolor('bellows', 'anvil', { top: '#2a5a52', skin: '#b08a6a', pants: '#2a3a3a' }, { '#f5c542': '#7dffb2' });
    recolor('korr', 'brandt', { top: '#4a4a3a', hair: '#8a3a2a', pants: '#3a3a30' }, { '#ff8a3a': '#c8ccd8', '#ffe0a0': '#ffffff' });
    recolor('voss', 'grist', { top: '#c8e0f0', hair: '#3e6ea8', pants: '#7a98b0', trail: '#7fd8ff' }, { '#ff4040': '#bfefff', '#aab0b8': '#7fd8ff' });
    recolor('ilse', 'tusk', { top: '#d83a3a', skin: '#d8b090', pants: '#2b2f3a' }, { '#6b5234': '#8a6a3a', '#b8bcc8': '#e8ecf4', '#ff3ea5': '#f5c542' });
    recolor('dren', 'anvil', { top: '#8a4a2a', skin: '#7a5a48', pants: '#3a2a26' }, { '#f5c542': '#ff8a3a' });
    recolor('hale', 'grist', { top: '#2a2040', hair: '#1a1430', pants: '#1a1830', trail: '#8b5cf6' }, { '#ff4040': '#ff4d7a', '#aab0b8': '#d0c8f0' });
    // Act 2
    recolor('baron', 'tusk', { top: '#8a4a2a', skin: '#c8b8a0', pants: '#3a3028' }, { '#6b5234': '#3a2a20', '#b8bcc8': '#ff5a3a', '#ff3ea5': '#f5c542' });
    recolor('warden3', 'warden', null, { '#e6e8ee': '#4a2a2a', '#b9c0ce': '#3a1e1e', '#f8fafc': '#7a3a3a', '#9aa2b4': '#5a3030', '#d9b45a': '#ff8a3a' });
    [['holt', '#8a2a1a'], ['crake', '#e83a1a'], ['bellows', '#1a8a6a'], ['korr', '#8a7a2a'], ['voss', '#7fd8ff'], ['ilse', '#ff7a2a'], ['dren', '#d86a1a'], ['hale', '#5a2a8a'], ['baron', '#c82a1a']].forEach(q => recolor(q[0] + '2', q[0], { top: q[1] }));
    // the Pale Alpha: a bone-white feral at twice the size
    recolor('feralpale', 'feral', { skin: '#e8e4d8', top: '#b8b4a8', pants: '#98948a', boots: '#d8d4c8' }, { '#c8ff5a': '#ff5a3a' });
    const F = art.sheets.feral && art.sheets.feral.anims;
    if (F) scaled('alpha', 'feralpale', 2, [F.fidle[0]].concat(F.frun, F.fleap, F.fatk, F.hurt, F.down),
      { idle: [0], run: [1, 2, 3, 4], dash: [5], jump: [5], a1: [0, 7, 6], a4: [6, 7, 6], cast: [6, 7], special: [6], cheer: [7], hurt: [8], down: [9] });
    // the Glowmother: a rust crawler at three times the size, gone green, with glow sacs along the shell
    const sacs = (x, i) => { const col = i === 3 ? '#ffffff' : i === 4 ? '#ffe040' : '#b8ff40'; [[36, 30], [54, 22], [72, 26], [88, 34]].forEach((q, k) => { disc(x, '#1e4a26', q[0], q[1], 5); disc(x, col, q[0], q[1], 3 + ((k + i) % 2)); }); };
    scaled('glowmother', 'crawler', 3, [0, 1, 2, 2, 1, 3, 4], { idle: [0], run: [1, 2], tele: [3], atk: [4], hurt: [5], down: [6], dash: [1, 2], special: [3], cheer: [3], cast: [4], a1: [4], a4: [4, 4, 0], jump: [1] }, { tint: ['#2a9a3a', 0.45], paint: sacs });
  }
  const _init = art.init; art.init = function () { _init(); try { bakeCast(); } catch (e) { console.error(e); } };

  Object.assign(D.speakers, {
    pip: { name: 'Pip', sheet: 'pip', pitch: 760 }, dov: { name: 'Dov', sheet: 'dov', pitch: 300 }, coil: { name: 'Nan Coil', sheet: 'coil', pitch: 420 }, sprocket: { name: 'Sprocket', sheet: 'sprocket', pitch: 340 },
    juniper: { name: 'Juniper', sheet: 'juniper', pitch: 580 }, echo: { name: 'Frozen Tidesinger', sheet: 'thessaly', pitch: 380 }, raider: { name: 'Dune Raider', sheet: 'raider', pitch: 280 },
    holt: { name: 'Kennel-Master Holt', sheet: 'holt', pitch: 260 }, crake: { name: 'Foreman Crake', sheet: 'crake', pitch: 200 }, bellows: { name: 'Big Bellows', sheet: 'bellows', pitch: 190 }, korr: { name: 'Gunsmith Korr', sheet: 'korr', pitch: 300 },
    voss: { name: 'Handler Voss', sheet: 'voss', pitch: 360 }, ilse: { name: 'Fire Marshal Ilse', sheet: 'ilse', pitch: 440 }, dren: { name: 'Chief Stoker Dren', sheet: 'dren', pitch: 210 }, hale: { name: 'Proctor Hale', sheet: 'hale', pitch: 320 },
    baron: { name: 'The Scrap Baron', sheet: 'baron', pitch: 170 }
  });

  // ================= enemies and scripted bosses =================
  // script: [move, options, [weight when close, weight when far]]. Options: p2 = only once enraged.
  Object.assign(E, {
    digger:  { name: 'Shaft Guard', sheet: 'digger', hp: 40, dmg: 8, speed: 0.85, xp: 12, creds: 6, ai: 'melee', range: 28, aggro: 150, windup: 26 },
    hazmat:  { name: 'Hazmat Tech', sheet: 'hazmat', hp: 38, dmg: 7, speed: 0.9, xp: 12, creds: 6, ai: 'melee', range: 28, aggro: 150, windup: 24 },
    raider:  { name: 'Dune Raider', sheet: 'raider', hp: 72, dmg: 12, speed: 1.1, xp: 26, creds: 14, ai: 'melee', range: 28, aggro: 180, blockEvery: 4, windup: 20, commit: true },
    gunner:  { name: 'Raider Gunner', sheet: 'gunner', hp: 48, dmg: 11, speed: 0.8, xp: 24, creds: 12, ai: 'ranged', range: 160, aggro: 230, cd: 100, shot: '#ff8a3a' },
    stalker: { name: 'Glow Stalker', sheet: 'stalker', hp: 44, dmg: 11, speed: 2.0, xp: 22, creds: 5, ai: 'leaper', aggro: 190, w: 16, h: 18, anims: { idle: 'fidle', run: 'frun', jump: 'fleap', atk: 'fatk' } },
    holt:    { name: 'KENNEL-MASTER HOLT', sub: 'Keeper of the beast pens', sheet: 'holt', sheet2: 'holt2', hp: 480, dmg: 11, speed: 1.1, xp: 90, creds: 60, idle: 28, w: 14, h: 36,
      script: [['swings', { n: 2, reach: 52, col: '#bfefff' }, [3, 1]], ['lunge', {}, [1, 3]], ['summon', { kind: 'feral', max: 2, hp: 20 }, [2, 2]]] },
    crake:   { name: 'FOREMAN CRAKE', sub: 'Overseer of Shaft Nine', sheet: 'crake', sheet2: 'crake2', hp: 540, dmg: 12, speed: 0.85, xp: 90, creds: 60, idle: 32, w: 22, h: 48,
      script: [['swings', { n: 1, reach: 64, wind: 30, col: '#ffd0a0' }, [3, 1]], ['slam', {}, [2, 2]], ['lob', { n: 2, col: '#ff8a3a' }, [1, 3]]] },
    bellows: { name: 'BIG BELLOWS', sub: 'The Breath Guild collects', sheet: 'bellows', sheet2: 'bellows2', hp: 500, dmg: 11, speed: 1.0, xp: 90, creds: 60, idle: 30, w: 18, h: 42,
      script: [['charge', {}, [1, 3]], ['swings', { n: 2, reach: 50, col: '#c8ffe4' }, [3, 1]], ['slam', { col: '#7dffb2' }, [2, 2]]] },
    korr:    { name: 'GUNSMITH KORR', sub: 'Master of the Scrapworks', sheet: 'korr', sheet2: 'korr2', hp: 440, dmg: 10, speed: 1.1, xp: 90, creds: 60, idle: 28, w: 14, h: 36,
      script: [['volley', { n: 3, kind: 'bullet', col: '#ffd24a', speed: 3.4, gap: 12 }, [1, 3]], ['lob', { n: 2, col: '#ff8a3a' }, [1, 2]], ['swings', { n: 2, reach: 52, col: '#ffffff' }, [3, 1]]] },
    voss:    { name: 'HANDLER VOSS', sub: 'Custodian of Cryo Vault 9', sheet: 'voss', sheet2: 'voss2', hp: 480, dmg: 11, speed: 1.0, xp: 90, creds: 60, idle: 28, w: 16, h: 40,
      script: [['swings', { n: 2, reach: 50, col: '#bfefff' }, [3, 1]], ['volley', { n: 3, col: '#7fd8ff' }, [1, 3]], ['summon', { kind: 'drone', max: 2, hp: 14, fly: true }, [2, 2]]] },
    ilse:    { name: 'FIRE MARSHAL ILSE', sub: 'Halcyon suppression team', sheet: 'ilse', sheet2: 'ilse2', hp: 520, dmg: 11, speed: 0.9, xp: 90, creds: 60, idle: 30, w: 22, h: 48,
      script: [['lob', { n: 3, col: '#e8ecf4' }, [1, 3]], ['swings', { n: 1, reach: 64, wind: 28, col: '#ffd0d0' }, [3, 1]], ['charge', {}, [1, 2]]] },
    dren:    { name: 'CHIEF STOKER DREN', sub: 'Keeper of the Core Sump', sheet: 'dren', sheet2: 'dren2', hp: 520, dmg: 11, speed: 0.95, xp: 90, creds: 60, idle: 30, w: 18, h: 42,
      script: [['slam', { col: '#ff8a3a' }, [2, 2]], ['swings', { n: 2, reach: 50, col: '#ffd0a0' }, [3, 1]], ['lob', { n: 2, col: '#6fd3e8' }, [1, 3]]] },
    hale:    { name: 'PROCTOR HALE', sub: 'Warden of the Night Ward', sheet: 'hale', sheet2: 'hale2', hp: 470, dmg: 11, speed: 1.2, xp: 90, creds: 60, idle: 26, w: 16, h: 40,
      script: [['lunge', {}, [1, 3]], ['volley', { n: 2, kind: 'crescent', col: '#b06cff', speed: 4, gap: 20 }, [1, 2]], ['swings', { n: 3, reach: 50, col: '#d0c8f0' }, [3, 1]]] },
    baron:   { name: 'THE SCRAP BARON', sub: 'Raider king of the Ash Dunes', sheet: 'baron', sheet2: 'baron2', hp: 760, dmg: 14, speed: 1.0, xp: 320, creds: 220, idle: 24, w: 22, h: 48,
      script: [['swings', { n: 3, reach: 64, col: '#ffb060' }, [3, 1]], ['charge', {}, [1, 3]], ['lob', { n: 3, col: '#ff8a3a' }, [1, 2]], ['summon', { kind: 'raider', max: 2, p2: true }, [2, 2]], ['slam', { p2: true }, [2, 2]]] },
    alpha:   { name: 'THE PALE ALPHA', sub: 'It answered the howl', sheet: 'alpha', beast: true, hp: 700, dmg: 13, speed: 1.5, xp: 260, creds: 160, idle: 20, w: 30, h: 44,
      script: [['lunge', { speed: 7.5 }, [1, 3]], ['swings', { n: 2, reach: 62, col: '#ffffff' }, [3, 1]], ['slam', {}, [2, 2]], ['summon', { kind: 'feral', max: 2, p2: true }, [2, 2]]] },
    glowmother: { name: 'THE GLOWMOTHER', sub: 'What the relay was feeding', sheet: 'glowmother', beast: true, heavy: true, hp: 900, dmg: 14, speed: 0.8, xp: 400, creds: 260, idle: 30, w: 84, h: 44,
      script: [['charge', { speed: 4 }, [1, 3]], ['stomp', { col: '#b8ff40' }, [3, 1]], ['lob', { n: 3, col: '#b8ff40' }, [2, 2]], ['summon', { kind: 'stalker', max: 2 }, [1, 2]]] },
    warden3: { name: 'RETRIEVAL UNIT 03', sub: 'Halcyon recovery mech', sheet: 'warden3', hp: 640, dmg: 13, speed: 0.7, xp: 260, creds: 160, boss: 'warden', idle: 40, w: 44, h: 72, heavy: true }
  });

  // ---------- balance ----------
  // Tuned with ST.bench() in tools/story-test.js against the two scripted players the original bosses were tuned
  // with: one that only hammers attack (should lose about half the time or more) and one that guards, slipsteps and
  // heals (should win, ending around half health). tune(name, stats, moves): stats merge into the enemy; moves merge
  // options / weights into a script entry ({ o, w }), add it if missing, or remove it (null).
  //   counter  how hard the boss answers five free hits (x its damage; default 1.4)     tell  frames of warning for it
  function tune(name, stats, moves) {
    const e = E[name];
    if (!e) return;
    Object.assign(e, stats || {});
    Object.keys(moves || {}).forEach(m => {
      const v = moves[m], s = e.script.find(q => q[0] === m);
      if (v === null) e.script = e.script.filter(q => q[0] !== m);
      else if (s) { Object.assign(s[1], v.o || {}); if (v.w) s[2] = v.w; }
      else e.script.push([m, v.o || {}, v.w || [2, 2]]);
    });
  }
  story.tune = tune;
  tune('holt', { hp: 600, dmg: 12, counter: 1.2 }, { lunge: { w: [2, 3] } });
  tune('voss', { hp: 640, dmg: 12 }, { lunge: { w: [1, 2] } });
  tune('crake', { hp: 480, dmg: 11 }, { lob: { o: { dmg: 6 } } });
  tune('ilse', { hp: 560 }, { lob: { o: { dmg: 6 } } });
  tune('bellows', { hp: 540, dmg: 11 });
  tune('dren', { hp: 540, dmg: 9, counter: 2 }, { lob: { o: { dmg: 4, n: 1 } }, swings: { o: { n: 1, wind: 28 } }, slam: { w: [1, 2] } });   // Ashka swings slowly: give her room
  tune('korr', { hp: 420 }, { lob: { o: { dmg: 5, n: 1 } }, volley: { o: { n: 2 } } });
  tune('hale', { hp: 550, dmg: 10, counter: 2 }, { lunge: { w: [1, 2] }, volley: { o: { n: 1 } } });
  tune('baron', { hp: 860 });
  tune('glowmother', { hp: 960, dmg: 16 });

  function* wait(n) { for (let i = 0; i < n; i++) yield; }
  function* tele(b, n, anim, f) { b.setPose(anim, f); b.tele = n; b.vx = 0; SW.audio.sfx('tele'); yield* wait(n); b.tele = 0; }
  function* approach(b, g, dist, max) { const p = g.player; for (let i = 0; i < max && Math.abs(p.x - b.x) > dist; i++) { b.faceTo(p); b.vx = b.face * b.spd() * 1.6; b.setPose('run', Math.floor(i / 5) % 2); yield; } b.vx = 0; b.faceTo(p); }
  const shock = (z, b, s, r, col) => z.shots.push(new SW.Shot({ kind: 'shock', team: 'enemy', x: b.x + s * r, y: b.y - 5, fy: b.y, vx: s * 3.6, dmg: b.def.dmg - 3, life: 60, w: 14, h: 12, col: col || '#c8ccd8', kx: 3, ky: -3 }));
  const MV = {
    // after a few free hits the boss shrugs them off and swings back (same rule as the Act 1 bosses)
    *counter(b, g) {
      b.invuln = 10; b.faceTo(g.player);
      yield* tele(b, b.def.tell || 22, 'a4', 0);                       // a clear tell: a player who stops hammering has time to guard
      b.setPose('a4', 1); SW.audio.sfx('heavy'); b.vx = b.face * 2.5; fx.slash(b.x + b.face * 20, b.y - b.h * 0.6, b.face, 1, '#ffffff', 44);
      const hs = new Set();
      for (let i = 0; i < 7; i++) { b.hitFront(g, b.w / 2 + 56, b.h + 14, Math.round(b.def.dmg * (b.def.counter || 1.4)), hs, { kx: 6, ky: -3.4, heavy: true }); b.vx *= 0.8; yield; }   // the answer to button-mashing: guard it and it is nothing
      b.setPose('a4', 2); yield* wait(22);
    },
    *phase(b, g) {
      b.invuln = 84; b.vx = 0; b.setPose('cheer', 0); SW.audio.sfx('roar'); fx.shake(8, 40); fx.flash('#ffffff', 10); g.toast(b.def.name + ' is enraged!');
      for (let i = 0; i < 64; i++) { if (i % 8 === 0) fx.ring(b.x, b.y - b.h / 2, '#ff5a5a', 8, 64, 16); if (i === 30 && b.def.sheet2) b.sheet = b.def.sheet2; yield; }
    },
    *swings(b, g, z, o) {
      const n = o.n || 1;
      yield* approach(b, g, o.reach - 14, 60);
      for (let k = 0; k < n; k++) {
        const last = k === n - 1, an = last ? 'a4' : 'a1';
        b.faceTo(g.player); yield* tele(b, k ? 9 : (o.wind || 22) - (b.phase === 2 ? 6 : 0), an, 0);
        b.setPose(an, 1); b.vx = b.face * 2.6; SW.audio.sfx(last ? 'heavy' : 'swing'); fx.slash(b.x + b.face * 18, b.y - b.h * 0.6, b.face, k % 2 ? 2 : 1, o.col || '#ffffff', o.reach * 0.7);
        const hs = new Set();
        for (let i = 0; i < 7; i++) { b.hitFront(g, o.reach, b.h + 12, last ? b.def.dmg : b.def.dmg - 3, hs, last ? { kx: 5, ky: -3, heavy: true } : { kx: 2 }); b.vx *= 0.8; yield; }
        yield* wait(6);
      }
      b.setPose('a4', 2); yield* wait(b.phase === 2 ? 22 : 32);
    },
    *lunge(b, g, z, o) {
      const twice = b.phase === 2 && !o.again;
      b.faceTo(g.player); yield* tele(b, o.again ? 14 : 26, 'special', 0);
      SW.audio.sfx('dash');
      const hs = new Set();
      for (let i = 0; i < 20; i++) {
        b.vx = b.face * (o.speed || 7); b.setPose('dash', 0);
        if (i % 2 === 0) fx.ghost(b.sheet, 'dash', 0, b.x, b.y, b.face < 0);
        b.hitFront(g, b.w / 2 + 26, b.h + 4, b.def.dmg, hs, { kx: 5, ky: -2.6, heavy: true, unblockable: true });
        yield;
        if (b.hitWall) break;
      }
      b.vx = 0; b.setPose('a4', 2); yield* wait(twice ? 12 : 30);
      if (twice) yield* MV.lunge(b, g, z, Object.assign({}, o, { again: true }));
    },
    *charge(b, g, z, o) {
      b.faceTo(g.player); yield* tele(b, 40, 'special', 0);
      SW.audio.sfx('roar');
      const hs = new Set(), sp = (o.speed || 4.4) * (b.phase === 2 ? 1.25 : 1);
      for (let i = 0; i < 100; i++) {
        b.vx = b.face * sp; b.setPose('dash', Math.floor(i / 5) % 2);
        if (i % 3 === 0) fx.dust(b.x - b.face * b.w / 2, b.y, 2);
        b.hitBody(g, b.def.dmg + 2, hs, { kx: 6, ky: -4, heavy: true, unblockable: true });
        yield;
        if (b.hitWall) { fx.shake(8, 16); SW.audio.sfx('explode'); fx.debris(b.x + b.face * b.w / 2, b.y - b.h / 2, '#8a92a8', 12); b.vx = -b.face * 2; b.vy = -2.5; b.stun = 96; g.toast(b.def.name + ' is dazed - hit it now!'); return; }
      }
      b.vx = 0; b.setPose('idle', 0); yield* wait(22);
    },
    *slam(b, g, z, o) {
      const p = g.player, r = b.w / 2 + 24; b.faceTo(p);
      yield* tele(b, 24, 'cast', 0);
      b.vy = -7.6; b.vx = SW.clamp((p.x - b.x) / 34, -3.4, 3.4); b.setPose('jump', 0); SW.audio.sfx('jump');
      yield;
      for (let i = 0; i < 100 && !b.onGround; i++) { if (b.vy > 0) b.setPose('a4', 1); yield; }
      b.vx = 0; fx.shake(8, 14); SW.audio.sfx('explode'); fx.dust(b.x, b.y, 12);
      SW.strike(g, { team: 'enemy', x: b.x - r, y: b.y - 30, w: r * 2, h: 30, dmg: b.def.dmg, kx: 5, ky: -4, heavy: true, hitSet: new Set(), srcX: b.x, src: b });
      shock(z, b, -1, r - 10, o.col); shock(z, b, 1, r - 10, o.col);
      b.setPose('a4', 2); yield* wait(38);
    },
    *stomp(b, g, z, o) {
      const r = b.w / 2 + 28;
      yield* approach(b, g, r + 10, 70);
      yield* tele(b, 24, 'special', 0);
      b.setPose('a4', 0); fx.shake(8, 14); SW.audio.sfx('explode'); fx.dust(b.x, b.y, 14);
      SW.strike(g, { team: 'enemy', x: b.x - r, y: b.y - 34, w: r * 2, h: 34, dmg: b.def.dmg, kx: 5, ky: -4, heavy: true, hitSet: new Set(), srcX: b.x, src: b });
      shock(z, b, -1, r - 10, o.col); shock(z, b, 1, r - 10, o.col);
      b.setPose('idle', 0); yield* wait(40);
    },
    *lob(b, g, z, o) {
      const p = g.player;
      for (let i = 0, n = (o.n || 3) + (b.phase === 2 ? 1 : 0); i < n; i++) {
        b.faceTo(p); yield* tele(b, 14, 'cast', 0);
        b.setPose('cast', 1);
        z.shots.push(new SW.Shot({ kind: 'flask', team: 'enemy', x: b.x + b.face * 8, y: b.y - b.h * 0.85, vx: (p.x + SW.rand(-34, 34) - b.x) / 46, vy: -5.2, g: 0.24, dmg: o.dmg || b.def.dmg - 2, life: 130, w: 6, h: 6, col: o.col || '#5cff7a' })); SW.audio.sfx('swing');
        yield* wait(12);
      }
      b.setPose('idle', 0); yield* wait(26);
    },
    *volley(b, g, z, o) {
      const p = g.player; b.faceTo(p);
      yield* tele(b, 24, 'cast', 0);
      for (let i = 0, n = (o.n || 3) + (b.phase === 2 ? 2 : 0); i < n; i++) {
        b.setPose('cast', 1); b.faceTo(p);
        const ox = b.x + b.face * (b.w / 2 + 10), oy = b.y - b.h * 0.7, dx = p.x - ox, dy = p.y - 16 - oy, m = Math.hypot(dx, dy) || 1, sp = o.speed || 2.8;
        z.shots.push(new SW.Shot({ kind: o.kind || 'orb', team: 'enemy', x: ox, y: oy, vx: dx / m * sp, vy: dy / m * sp, dmg: b.def.dmg - 3, life: 150, w: 8, h: 8, col: o.col || '#ff5a5a' })); SW.audio.sfx('shoot');
        yield* wait(o.gap || 16);
      }
      b.setPose('idle', 0); yield* wait(30);
    },
    *summon(b, g, z, o) {
      yield* tele(b, 30, 'cheer', 0);
      SW.audio.sfx('roar');
      const lo = b.ax0 === undefined ? b.x - 160 : b.ax0, hi = b.ax1 === undefined ? b.x + 160 : b.ax1;
      const alive = z.ents.filter(e => e.type === o.kind && !e.dead && e.x > lo && e.x < hi).length, n = Math.min(b.phase === 2 ? 2 : 1, (o.max || 2) - alive);
      for (let i = 0; i < n; i++) {
        const ex = lo + 30 + Math.random() * (hi - lo - 60), e = SW.spawnEnemy(o.kind, ex, b.y - (o.fly ? 90 : 70), o.hp ? { hp: o.hp } : null);
        e.state = 'chase'; e.ax0 = lo; e.ax1 = hi; z.add(e); fx.spark(ex, b.y - 70, '#ffffff', 8);
      }
      yield* wait(28);
    }
  };
  const NAMES = { lunge: 'xLunge', charge: 'xCharge' };   // the test harness bot recognises unblockable moves by name
  class Boss2 extends SW.Boss {
    pose() {
      if (!this.def.beast) return super.pose();
      const ps = this.dead ? ['down', 0] : this.stun > 0 ? ['hurt', 0] : this.forcePose ? this.forcePose : Math.abs(this.vx) > 0.15 ? ['run', Math.floor(this.runT / 6)] : ['idle', 0];
      return [ps[0], ps[1] % art.frames(this.sheet, ps[0])];
    }
    think(g, z, p) {
      const d = this.def;
      if (this.phase === 1 && this.hp <= this.hpMax / 2) { this.phase = 2; this.gen = MV.phase(this, g); this.tele = 0; }
      if (!this.gen) {
        this.forcePose = null; this.faceTo(p);
        const dist = Math.abs(p.x - this.x);
        this.vx = dist > 130 && this.groundAhead(z, this.face) ? this.face * this.spd() : 0;
        if (this.poise >= (d.poise || 5)) { this.poise = 0; this.stun = 0; this.gen = MV.counter(this, g); }
        else if (--this.idleT <= 0) {
          const opts = d.script.map(s => [(s[1].p2 && this.phase < 2 ? 0 : 1) * s[2][dist < 100 + this.w / 2 ? 0 : 1], s]).filter(o => o[0] > 0 && (o[1] !== this.pick || Math.random() < 0.3));
          if (opts.length) {
            let r = Math.random() * opts.reduce((a, o) => a + o[0], 0), pick = opts[0];
            for (const o of opts) { r -= o[0]; if (r <= 0) { pick = o; break; } }
            this.pick = pick[1]; this.last = { name: NAMES[pick[1][0]] || pick[1][0] }; this.poise = 0;
            this.gen = MV[pick[1][0]](this, g, z, pick[1][1]);
          }
        }
      }
      if (this.gen) {
        const r = this.gen.next();
        if (r.done) { this.gen = null; this.forcePose = null; this.idleT = (d.idle || 30) * (this.phase === 2 ? 0.6 : 1) + Math.random() * 16; }
      }
    }
  }
  SW.Boss2 = Boss2;
  const _spawn = SW.spawnEnemy;
  SW.spawnEnemy = (type, x, y, o) => (E[type] && E[type].script ? new Boss2(type, x, y, o) : _spawn(type, x, y, o));

  // ================= small engine extensions =================
  // an arena can wait for a flag before it springs (secret bosses)
  const _au = SW.Arena.prototype.update;
  SW.Arena.prototype.update = function (g, z) { if (this.state === 0 && this.armed && !this.armed(g) && !g.flag('arena:' + z.id + ':' + this.id)) return; _au.call(this, g, z); };
  // a breakable can be "soft": heavy blows (the last hit of a combo) or fire will do, not only a wall-breaker
  const _bt = SW.Breakable.prototype.takeHit;
  SW.Breakable.prototype.takeHit = function (atk, g) {
    if (this.soft && !atk.breaker) {
      const ok = (this.soft === 'heavy' && atk.heavy) || (this.soft === 'burn' && atk.status && atk.status.burn);
      if (!ok) { if (!atk.quiet) { fx.text(this.cx, this.y + 6, this.soft === 'burn' ? 'NEEDS FIRE' : 'HIT HARDER', '#c8ccd8'); SW.audio.sfx('block'); } return 'block'; }
      atk = Object.assign({}, atk, { breaker: true });
    }
    const r = _bt.call(this, atk, g);
    if (r === 'hit' && this.onBreak) this.onBreak(g);
    return r;
  };
  // a wide floor plate instead of a small switch: forgiving enough to hit with something thrown in an arc
  function plate(t) {
    const d = t.draw;
    t.box = () => ({ x: t.x - 10, y: t.y - 10, w: 20, h: 20 });
    t.draw = function (ctx, cam, g) { const x = Math.round(t.x - cam.x), y = Math.round(t.y - cam.y); rect(ctx, '#3a3f55', x - 10, y - 10, 20, 20); rect(ctx, '#5a6078', x - 10, y - 10, 20, 2); d.call(t, ctx, cam, g); };
    return t;
  }
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const fire = (z, x, y, col) => z.prop('firebarrel', x, y, { glow: col || '#ff8a3a', gy: 16, gr: 24 });
  function patch(id, fn) { const def = Z[id]; if (!def) return; const b = def.build; def.build = function (z, g) { b.call(this, z, g); fn(z, g); }; }

  // ================= ACT 1: one tutorial per hero =================
  // Each tutorial is assembled from the same teaching beats, but in its own order, with its own shapes, enemies,
  // skill test, boss and words. order: the beats; climb / start / test pick the variant of that beat.
  const TUT = {
    fenn: { zone: 'pens', name: 'The Beast Pens', theme: 'pens', music: 'metro', mission: 'F1-1', title: 'The Stray That Bites', p: 'f', exit: ['market', 'pit', 'door', 'Stairs up to the Neon Market'],
      order: ['start', 'climb', 'fight', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'cage', bars: true, climb: 'stairs', guide: ['pip', 'Pip'], save: 'glyph', col: '#ff3ea5', deco: ['pen', 'trash', 'firebarrel', 'barrel'],
      foes: [['feral', { hp: 22 }], ['feral', { hp: 22 }], ['feral', { hp: 22 }]], liquid: 'trench', pick: ['crate', 'Take the charm'], test: 'lock', boss: 'holt',
      steps: ['Try the latch on your cage (E)', 'Put down the loosed ferals (J)', 'Take back your fang charm past the trench', 'Arc a Chain Bolt through the bars into the lock (U)', 'Defeat Kennel-Master Holt'] },
    brakk: { zone: 'dig', name: 'Shaft Nine', theme: 'mine', music: 'metro', mission: 'B1-1', title: 'The Man in the Rock', p: 'b', exit: ['market', 'lift', 'hatch', 'Ride the lift up to the Neon Market'],
      order: ['start', 'fight', 'climb', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'talk', rubble: true, climb: 'tower', guide: ['dov', 'Dov'], save: 'glyph', col: '#f5c542', deco: ['minecart', 'crate', 'lamp', 'barrel'],
      foes: [['digger'], ['digger'], ['digger']], liquid: 'sump', pick: ['boulder', 'Lift the boulder', true], test: 'plate', boss: 'crake',
      steps: ['Talk to Dov, then smash the rubble (J x4)', 'Beat the shaft guards (J)', 'Lift the loose boulder past the sumps', 'Lob a boulder through the bars onto the winch plate (U)', 'Defeat Foreman Crake'] },
    gale: { zone: 'stacks', name: 'The Vent Stacks', theme: 'stacks', music: 'metro', mission: 'G1-1', title: 'What the Wind Set Down', p: 'w', exit: ['market', 'lift', 'hatch', 'Ride the service lift up to the Neon Market'],
      order: ['start', 'gaps', 'climb', 'fight', 'skill', 'test', 'shard', 'boss'], start: 'talk', climb: 'catwalk', guide: ['coil', 'Nan Coil'], save: 'glyph', col: '#7dffb2', deco: ['pump', 'barrel', 'crate', 'lamp'],
      foes: [['brawler', { hp: 40 }], ['brawler', { hp: 40 }]], liquid: 'coolant sluice', pick: ['banner', 'Free your scarf'], test: 'row', testFoes: [['rat'], ['rat'], ['rat'], ['rat']], boss: 'bellows',
      steps: ['Talk to Nan Coil, the fan-keeper (E)', 'Shake off the Breath Guild toughs (J)', 'Free your scarf from the intake grille', 'Cut the whole line of vent-rats with one Wind Blade (U)', 'Defeat Big Bellows'] },
    dyna: { zone: 'works', name: 'The Scrapworks', theme: 'works', music: 'slums', mission: 'D1-1', title: 'Number-Four Fuse Wrench', p: 'y', exit: ['market', 'lift', 'hatch', 'Ride the goods lift up to the Neon Market'],
      order: ['start', 'fight', 'gaps', 'climb', 'skill', 'test', 'shard', 'boss'], start: 'cage', bars: true, climb: 'stairs', guide: ['sprocket', 'Sprocket'], save: 'glyph', col: '#f5c542', deco: ['crate', 'barrel', 'trash', 'lamp'],
      foes: [['ganger', { hp: 30 }], ['ganger', { hp: 30 }]], liquid: 'slag channel', pick: ['crate', 'Open your toolkit'], test: 'plate', boss: 'korr',
      steps: ['Pull the pin on your shackle (E)', "Get through Korr's gunners (hold S to guard)", 'Take back your toolkit from the test range', 'Bounce a grenade through the bars onto the plate (U)', 'Defeat Gunsmith Korr'] },
    isolde: { zone: 'cryo', name: 'Cryo Vault 9', theme: 'cryo', music: 'lab', mission: 'S1-1', title: 'Cold Storage', p: 's', exit: ['medlab', 'admin', 'door', 'Through to the admin wing'],
      order: ['start', 'climb', 'fight', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'console', climb: 'zigzag', save: 'pod', col: '#7fd8ff', deco: ['cryotank', 'shelf', 'tank', 'console'],
      foes: [['guard', { hp: 40 }], ['guard', { hp: 40 }]], liquid: 'nitrogen', pick: ['shelf', 'Open the evidence locker'], test: 'drones', testFoes: [['drone', { hp: 14 }], ['drone', { hp: 14 }]], boss: 'voss',
      steps: ['Reach the thaw controls and press E', 'Deal with the vault guards (J)', 'Open the evidence locker past the spill', 'Freeze the drones out of the air (W + U)', 'Defeat Handler Voss'] },
    pyra: { zone: 'furnace', name: 'The Burn Ward', theme: 'furnace', music: 'lab', mission: 'P1-1', title: 'Burn Notice', p: 'p', exit: ['medlab', 'admin', 'door', 'Through to the admin wing'],
      order: ['start', 'climb', 'fight', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'cage', climb: 'catwalk', save: 'pod', col: '#ff8a3a', deco: ['char', 'tankb', 'shelf', 'firebarrel'],
      foes: [['hazmat'], ['hazmat'], ['hazmat']], liquid: 'foam vats', pick: ['console', 'Collar release'], test: 'burn', boss: 'ilse',
      steps: ['Push open the cell door (E)', 'Drop the hazmat techs (J)', 'Reach the collar release past the foam vats', 'Burn down the barricade (U)', 'Defeat Fire Marshal Ilse'] },
    ashka: { zone: 'core', name: 'The Core Sump', theme: 'core', music: 'lab', mission: 'H1-1', title: 'Off the Tap', p: 'h', exit: ['medlab', 'admin', 'door', 'Lift up to the admin wing'],
      order: ['start', 'fight', 'climb', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'console', climb: 'tower', save: 'pod', col: '#ff5a1f', deco: ['pump', 'console', 'tank', 'barrel'],
      foes: [['hazmat'], ['guard', { hp: 40 }], ['hazmat']], liquid: 'coolant', pick: ['console', 'Unlock the regulator'], test: 'shields', testFoes: [['enforcer', { hp: 46 }], ['enforcer', { hp: 46 }]], boss: 'dren',
      steps: ['Release the coupling at the console (E)', 'Clear out the reactor crew (J)', 'Reach the regulator past the coolant channels', "Burn the Enforcers out from behind their shields (U)", 'Defeat Chief Stoker Dren'] },
    vesper: { zone: 'ward', name: 'The Night Ward', theme: 'ward', music: 'lab', mission: 'V1-1', title: 'Lights Out', p: 'v', exit: ['medlab', 'admin', 'door', 'Through to the admin wing'],
      order: ['start', 'gaps', 'fight', 'climb', 'skill', 'test', 'shard', 'boss'], start: 'cage', climb: 'zigzag', save: 'pod', col: '#8b5cf6', deco: ['cage', 'shelf', 'bed', 'console'],
      foes: [['enforcer', { hp: 36 }], ['enforcer', { hp: 36 }]], liquid: 'drains', pick: ['shelf', 'Take back your kit'], test: 'lock', boss: 'hale',
      steps: ['Open your cell door (E)', 'Get BEHIND the Enforcers (dash past with L)', 'Take back your kit from the evidence drawer', 'Put a throwing star through the bars into the lock (U)', 'Defeat Proctor Hale'] }
  };
  story.tutorials = TUT;
  const COMBO = 'J: attack - tap for a 4-hit combo. W + J launches, S + J sweeps. Hold S to guard.';
  // tutorial conversations: [speaker, text]
  const TXT = {
    fenn: {
      wake: [['sys', 'Deepline. Under the Pit Arena, where the crowd cannot see: the beast pens.'], ['pip', "Psst. Hey. Wolf-man. You're awake. Don't growl, they'll hear."], ['hero', '...Bars. Straw. I do not know this den. I do not know my own name.'],
        ['pip', "They netted you by the sky-pipes. You bit a collector. With LIGHTNING. So the pit-boss calls you Fang."], ['pip', "I'm Pip. I feed the beasts. The latch on your cage is on YOUR side - nobody ever tried it. Walk over with A and D and press E."]],
      start: [['sys', 'The latch is rusted, not locked. It gives.'], ['pip', "Oh no. You actually did it. Holt's going to skin me. Here - half my pepper bun. Press Q when you're hurt."], ['pip', "Go EAST, over the feed lofts. Jump with K."]],
      guide: [['pip', "Kennel-Master Holt sells the ones that fight and feeds the ones that don't. Don't be either."]],
      fight: [['holt', "Stray's out of its box. Good. Loose the ferals - I want to see the lightning before I put a price on it."], ['sys', 'J: attack - tap for a 4-hit combo. Ferals LEAP: hold S to guard, or dash (L) under them.']],
      skill: [['hero', 'A fang on a cord, hung up like a trophy. It is mine. I know it the way I know my own teeth.'], ['hero', '(It bites back when I hold it. The storm is in it. The storm was always in it.)']],
      boss: [['holt', "Three ferals. Dead. Do you know what a feral COSTS, stray?"], ['hero', 'Open the gate.'], ['holt', "I'll open YOU. Then I'll sell the pelt to Grist."],
        ['sys', 'Hold S to GUARD his shock-prod. When he flashes white and lunges, DASH (L) through it.\nHe whistles for ferals - a Chain Bolt (U) hits the whole pack.']],
      win: [['pip', "You dropped HOLT. Nobody drops Holt. Listen - every beast in the pens is howling!"], ['hero', "(Fenn. My name is Fenn. The pack-name can wait. 'Fang' will do down here.)"],
        ['pip', "The stairs go up to the Neon Market. There's an old map-maker there who pays for stories about strays with storms in them."]] },
    brakk: {
      wake: [['sys', 'Deepline. Shaft Nine, the deepest dig in the city. Nobody is supposed to be down here. Nothing is supposed to be down here.'], ['dov', "...It's a man. Saints below, there's a MAN in the rock. He's breathing!"],
        ['hero', '...Stone. All around. It was quiet. Why is it loud now? Who... am I?'], ['dov', "You tell me, big fella. We cut into a pocket and there you were, asleep in solid granite. The crew's calling you Boulder."],
        ['dov', "I'm Dov. The foreman's sealed the gallery - says you're 'company property'. Walk with A and D. Come here and press E."]],
      start: [['dov', "Crake's coming down with his guards to crate you up and sell you topside. I've got kids. I can't fight him."], ['dov', "Take my lunch. Pepper bun, from a stall up in the slums. Press Q when you're hurting."],
        ['dov', "That rubble is all that's between you and the main gallery. Hit it. Finish the combo: the LAST hit is the heavy one."]],
      guide: [['dov', "Four hits, big fella. J, J, J, J. The last one brings the roof down. In a good way."]],
      fight: [['crake', "That's company property walking around loose. Shaft guards - put it back in its hole."], ['sys', COMBO]],
      skill: [['hero', 'A loose boulder. A crew of six could not shift it.'], ['hero', '(It comes up like it was waiting. The stone is not heavy. The stone is... glad.)']],
      boss: [['crake', "There's my find. Do you know what Aurelia pays for a thing that sleeps in granite?"], ['hero', 'I am not a thing.'], ['crake', "You're whatever the manifest says you are. Crate him."],
        ['sys', 'Hold S to GUARD his hammer. When he LEAPS, get out from under him, then jump the shockwave.\nHe throws blasting charges - do not stand in the fire.']],
      win: [['dov', "He's down. Crake is DOWN. Twenty years I've wanted to see that."], ['hero', "(Brakk. That is the name the mountain gave me. 'Boulder' is close enough for now.)"],
        ['dov', "Take the lift up to the Neon Market. The old Cartographer there pays miners for news of anything strange in the deep. That's you."]] },
    gale: {
      wake: [['sys', "Deepline. The Vent Stacks: the fan shafts that pull breathable air down from the surface. The city's lungs."], ['coil', "Well. The filter net's caught a lot of things. Never a boy."],
        ['hero', '...I was falling. I think I have been falling for a long time. I do not remember landing. I do not remember me.'], ['coil', "You came down Stack Four on a gust that should've killed you, and it set you down like a cup on a saucer. I've been calling you Drifter."],
        ['coil', "I'm Nan Coil. I keep the fans turning. Come over here - A and D - and press E. Quietly. The Guild is listening."]],
      start: [['coil', "The Breath Guild owns the air down here and Big Bellows collects for it. He's heard there's a boy the wind LIKES. He wants to bottle you."], ['coil', "Pepper bun. Eat. Press Q when you're hurt."],
        ['coil', "The sluice ahead is open - coolant, don't swim. Jump, then dash in mid-air with L. Your scarf blew on ahead of you; it's snagged past the catwalks."]],
      guide: [['coil', "Wind's a patient thing, Drifter. It goes round what it can't go through."]],
      fight: [['bellows', "There's the little draught. Boys - hold him down. Gently. I want him breathing."], ['sys', COMBO]],
      skill: [['hero', 'My scarf, snagged on an intake grille. It is the only thing I own that I am sure is mine.'], ['hero', '(It lifts when I touch it. There is no wind in here. ...There is now.)']],
      test: [['hero', '(Vent-rats. A whole line of them, nose to tail. ...One cut.)']],
      boss: [['bellows', "Do you know what a lungful costs down here, boy? I do. I set the price."], ['hero', "The wind isn't yours."], ['bellows', "Everything that moves air in Deepline is mine. Now so are you."],
        ['sys', 'Hold S to GUARD his fists. When he flashes white he CHARGES: dash (L) through him and he dazes himself on the wall.\nWhen he leaps, do not be under him.']],
      win: [['coil', "You've knocked the wind out of Big Bellows. Forty years I've waited to say that sentence."], ['hero', "(Gale. That is what they called after me, when I ran along the ridge. 'Drifter' is not wrong either.)"],
        ['coil', "Ride the service lift up to the Neon Market. The Cartographer there collects people who fall out of the sky. Tell him Nan sent a gust."]] },
    dyna: {
      wake: [['sys', "Deepline. The Scrapworks, where the Rivet Crew turns the city's junk into things that go bang."], ['sprocket', "Don't sit up fast. You've got a shackle on and a head full of smoke."],
        ['hero', '...Bench. Tools. My hands know every one of them. I do not know my own NAME, but I know that is a number-four fuse wrench.'],
        ['sprocket', "You fell through the roof three nights back. The Crew chained you to a bench to see what you'd build. You built a lock-pick out of a spoon. They call you Fuse."],
        ['sprocket', "I'm Sprocket. I'm chained to the NEXT bench. Your shackle pin is loose - walk to it, A and D, and press E."]],
      start: [['sys', 'The pin slides out. You filed it down yourself, apparently, in your sleep.'], ['sprocket', "Ha! Here - pepper bun, they feed us those. Q to eat."],
        ['sprocket', "Korr's gunners are in the next bay. Bullets hurt: hold S to guard, or dash through the shot with L."]],
      guide: [['sprocket', "Korr took your toolkit to the test range, past the slag channel. A weapon artist without her tools is just a girl with opinions."]],
      fight: [['korr', "The bench-girl's loose. Gunners - wing her. Not the hands. I need the hands."], ['sys', 'J: attack - tap for a 4-hit combo. Gunners keep their distance: hold S to GUARD the shot, then close in.']],
      skill: [['hero', 'My toolkit. Somebody has gone through it and understood none of it.'], ['hero', '(Powder, casing, fuse. My hands finish before I have decided to start. ...Oh. Oh, I am GOOD at this.)']],
      boss: [['korr', "You're the best pair of hands that ever fell into my shop, Fuse. Shame about the rest of you."], ['hero', "I don't build for people who chain me to things."], ['korr', "Then you'll build with a gun in your ear."],
        ['sys', 'Hold S to GUARD his shots and cuts. His bombs leave fire on the floor - keep moving.\nA grenade (U) bounces once before it blows: aim short.']],
      win: [['sprocket', "You blew up KORR. With his own powder. I'm going to be telling this one for years."], ['hero', '(Dyna. It was stencilled inside the toolkit lid. D-Y-N-A. That is me.)'],
        ['sprocket', "Goods lift's that way - up to the Neon Market. The Cartographer there buys news of anything strange. A girl who fell through a roof and built a bomb counts."]] },
    isolde: {
      wake: [['sys', 'Aurelia. Med-Lab cold storage: Cryo Vault 9. Halcyon keeps what it cannot use yet on ice.'], ['hero', '(Cold. But the wrong cold: a dead, humming cold. I cannot feel my hands. I cannot find my name.)'],
        ['wren', "- Subject 52? Blink if you can hear me. Okay. You blinked. I'm choosing to believe you blinked."], ['wren', "I'm Wren. I live in the walls. Somebody just broke out of Sector 7 and the alarms tripped your thaw cycle. You have maybe ten minutes."],
        ['wren', "Move with A and D. The thaw controls are on the console to your right: press E before the tank re-freezes you."]],
      start: [['sys', 'The tank hisses. Feeling comes back like needles.'], ['wren', "There. Grab the med-gel from the dispenser - press Q to use it."], ['wren', "The floor ahead is flooded with liquid nitrogen. Climb the cryo-racks: K jumps, S + K drops through a ledge."]],
      fight: [['wren', "Two guards doing a tank count. They filed your staff under 'stick' and left it with you. Their mistake."], ['sys', 'J: attack - tap for a 4-hit combo. Hold S to guard. Guard at the last moment for a PERFECT guard.']],
      skill: [['hero', "An evidence locker. Inside: a falconer's glove, stiff with old frost. My hand knows the shape of it."], ['hero', '(The air goes sharp round my fingers. Feathers. No - ice, shaped like feathers.)']],
      test: [['wren', "Drones, above you. They hover out of reach - so reach. Hold W and press U."]],
      boss: [['voss', "Subject 52 is ambulatory. That is not on my schedule."], ['hero', 'I am leaving.'], ['voss', "You are inventory. Inventory does not leave. Drones - bring it back to temperature."],
        ['sys', 'Hold S to GUARD his ice-axe. Dash (L) through the blue orbs.\nHe calls drones: aim your shards up (W + U) to freeze them out of the air.']],
      win: [['wren', "You just put the vault custodian on ice. I'd say 'poetic' but I'm busy deleting the footage."], ['hero', "(Isolde. That is what the wind over the eyrie was called... no. That is what I am called.)"],
        ['wren', "The door ahead opens on the admin wing. Three terminals: plug me into each one (E) and I can open Block C. Someone is locked in there who sounds like you."]] },
    pyra: {
      wake: [['sys', 'Aurelia. Med-Lab Sector 4 - or what is left of it. The staff call it the Burn Ward now.'], ['hero', '(Smoke. Old smoke. Everything is black except this cell. ...Did I do this? Who was I, that I could do THIS?)'],
        ['wren', "- hello? Subject 44? Please don't set fire to the speaker. I'm a friend. I'm fairly sure I'm a friend."], ['wren', "I'm Wren. You burned this wing down six days ago, so they put you in the one fireproof box they own. Then they collared you."],
        ['wren', "Sector 7 just had a breakout, so nobody is watching you. Your cell door melted in the fire. Walk to it - A and D - and press E."]],
      start: [['sys', 'The door was never locked. It was welded - by you, from the inside. It breaks like burnt sugar.'], ['wren', "Take the med-gel from the wall kit: press Q to use it."],
        ['wren', "That collar is choking your fire down to nothing. The release console is past the foam vats. Until then: fists. Climb with K."]],
      fight: [['wren', "Hazmat techs, sweeping for hot spots. That's you. You're the hot spot."], ['sys', COMBO]],
      skill: [['wren', "That's the console. Hold still, I've never done this bef- oh. It's just a button."], ['hero', '(The collar drops. And everything I was holding back comes UP. It does not hurt. It never hurt ME.)']],
      boss: [['ilse', "Subject 44. Collar off. Of course it is."], ['hero', 'You should run.'], ['ilse', "I put you out once, girl. I'll do it again. Suppression team - foam it."],
        ['sys', 'Hold S to GUARD her axe. When she flashes white she CHARGES: dash (L) through and she dazes herself on the wall.\nStay out of the foam: it smothers you.']],
      win: [['wren', "The Fire Marshal. On fire. I'm not going to say anything. I'm going to think it very loudly."], ['hero', "(Pyra. They wrote 44 on the door. But the forge had a name for me, and it was Pyra.)"],
        ['wren', "Next door is the admin wing. Three terminals: plug me into each (E) and I can open Block C. There's a prisoner in there Halcyon is very careful NOT to burn."]] },
    ashka: {
      wake: [['sys', 'Aurelia. Med-Lab Sub-Level 2: the Core Sump. Halcyon heats half the sector from this room. From one cradle in it.'],
        ['hero', '(Hot. Not burning - the other way. Something is pulling the heat OUT of me. I cannot remember being warm. I cannot remember being anyone.)'],
        ['wren', "- Subject 60? Oh good, you're conscious. That's either very good or about to be very bad."], ['wren', "I'm Wren. I live in the walls. They've had you coupled to the geothermal tap as a living boiler. Sector 7's breakout just pulled every guard off this level."],
        ['wren', "The coupling release is on the console to your right. Walk over - A and D - and press E. Then we see how angry you are."]],
      start: [['sys', 'The coupling lets go. The heat stops leaving. For the first time you can remember, it stays.'], ['wren', "Med-gel in the wall kit: press Q to use it."],
        ['wren', "They've cuffed your output down to a pilot light. The regulator is past the coolant channels. Until then, you hit like a furnace door anyway. J to swing."]],
      fight: [['wren', "Reactor crew. They've noticed the room getting colder."], ['sys', 'J: attack - tap for a 4-hit combo. Yours is slow and HEAVY: start it early. Hold S to guard.']],
      skill: [['wren', "That's the regulator. I'm cutting the cuffs in three, two -"], ["hero", "(It comes up from somewhere under the floor of me. Rock, made soft. It was never fire. It was the mountain's blood.)"]],
      test: [['wren', "Enforcers, shields up. Don't punch the shield. Put the floor on fire UNDER the shield."]],
      boss: [['dren', "Subject 60 is off the tap. The whole sector's going cold. Do you know what that does to my quarterly numbers?"], ['hero', 'Find another boiler.'], ['dren', "I'll put you back in the cradle myself."],
        ['sys', 'Hold S to GUARD his fists. When he LEAPS, move - then jump the shockwave that runs along the floor.\nHe throws coolant: it hurts, and it lingers.']],
      win: [['wren', "Chief Stoker Dren, down in his own sump. The thermostats upstairs are having a breakdown."], ['hero', '(Ashka. The word for the ember you carry from the old fire to light the new one. That is my name.)'],
        ['wren', "The lift ahead opens on the admin wing. Three terminals: plug me into each (E) and I can open Block C. Someone's locked in there - and she's very cold."]] },
    vesper: {
      wake: [['sys', 'Aurelia. Med-Lab detention: the Night Ward. The lights have been off down here for eleven days. On purpose.'],
        ['hero', '(Dark. Good. The dark is the one thing in here that feels like mine. I reach for a name and find only a number on a wristband.)'],
        ['wren', "- Subject 77. I know you're awake: the motion sensors just lost you, and you haven't moved."], ['wren', "I'm Wren. Friend. They keep it dark because the guards kept failing to find you in the light. Then they took your blades, which was smarter."],
        ['wren', "Sector 7 just went loud and pulled the night shift. Your cell lock is a model I own. Walk to the door - A and D - and press E."]],
      start: [['sys', 'The lock clicks over. You were through the door before the sound finished.'], ['wren', "Med-gel, wall kit, press Q. The drains ahead are open: jump, then dash in mid-air with L."],
        ['wren', "Two Enforcers past that. Riot shields. Don't hit the shield - be BEHIND it. You can walk right through people, apparently. I'm not asking."]],
      fight: [['wren', "There they are. Shields front. So don't be in front."], ['sys', 'J: attack - tap for a 4-hit combo. A shield stops everything from the FRONT.\nDash (L) past an Enforcer and cut him from behind. They turn slowly.']],
      skill: [['hero', 'An evidence drawer. My kit, tagged and bagged. Twelve stars, two blades, one scarf.'], ['hero', '(The weight goes back where it belongs - sleeves, belt, spine. I am not armed. I am COMPLETE.)']],
      boss: [['hale', "Seventy-seven. Out of the dark at last. I've read your file. It's mostly blank pages and casualty lists."], ['hero', 'Then you know how this ends.'], ['hale', "I wrote the ending. Lights."],
        ['sys', 'Hold S to GUARD his blade. When he flashes white and lunges, DASH (L) through it - he lunges twice once he is hurt.\nJump his crescents, or guard them.']],
      win: [['wren', "Proctor Hale, face down in his own ward. I've turned the lights back on. It felt symbolic."], ['hero', '(Vesper. The hour the lamps are lit. Someone gave me that name gently, once. I will find out who.)'],
        ['wren', "Next door is the admin wing. Three terminals: plug me into each (E) and I open Block C. There's a prisoner in there Halcyon is very careful not to lose."]] }
  };
  L.k_mags_other = [{ s: 'mags', t: "Don't know you, stranger, but you've a hungry look. Buns are two creds. ...Oh, go on. This one's free.", heal: true }];

  const WID = { start: 18, stairs: 38, zigzag: 40, tower: 31, catwalk: 31, fight: 30, gaps: 26, skill: 8, lock: 11, plate: 11, burn: 7, shields: 30, drones: 30, row: 30, shard: 18, boss: 34, exit: 9 };
  const segW = (T, s) => WID[s === 'climb' ? T.climb : s === 'test' ? T.test : s];
  const tutW = T => T.order.reduce((a, s) => a + segW(T, s), 0) + WID.exit;
  const spread = (n, x) => (n === 2 ? [x + 17, x + 23] : n === 3 ? [x + 15, x + 20, x + 24] : [x + 13, x + 17, x + 21, x + 24]);
  const foeList = (list, x) => { const xs = spread(list.length, x); return list.map((f, i) => [f[0], xs[i], E[f[0]].fly ? 12 + (i % 2) : 19, f[1]]); };

  function buildTutorial(z, g, id) {
    const T = TUT[id], P = T.p, MS = T.mission, hero = D.heroes[id], route = hero.route || id, W = z.w;
    const skill = () => hero.kit[0], has = gg => !!gg.state.abilities[skill()];
    const step = k => gg => gg.step(MS + ':' + k);
    z.ground(0, W - 1, 20).fill(0, 0, W, 2).fill(0, 2, 1, 18).fill(W - 1, 2, 1, 18);
    const begin = gg => gg.say(P + '_start', () => { gg.setFlag(T.zone + '_open'); gg.state.items = Math.min(5, gg.state.items + 1); gg.toast('+1 ' + gg.hero().item); gg.step(MS + ':start'); });
    const SEG = {
      start(x) {
        z.spawn('start', x + 4, 19);
        if (T.start === 'cage') {
          z.fill(x + 9, 2, 3, 12); z.gate(x + 10, 14, 6, { flag: T.zone + '_open', bars: !!T.bars, col: '#5a3a30' });
          z.thing('latch', x + 8, 19, { prompt: T.steps[0].replace(' (E)', ''), when: gg => !gg.flag(T.zone + '_open'), hide: gg => gg.flag(T.zone + '_open'), use: begin, glow: T.col });
          if (T.guide) z.npc(T.guide[0], x + 14, 19, { name: T.guide[1], talk: P + '_guide', when: gg => gg.flag(T.zone + '_open') });
        } else if (T.start === 'talk') {
          const n = z.npc(T.guide[0], x + 9, 19, { name: T.guide[1], talk: true });
          n.interact = gg => (gg.state.steps[MS + ':start'] ? gg.say(P + '_guide') : begin(gg));
        } else z.thing('console', x + 11, 19, { prompt: 'Use the console', when: gg => !gg.state.steps[MS + ':start'], use: begin, glow: T.col });
        if (T.rubble && T.start !== 'cage') { z.fill(x + 14, 2, 2, 14); Object.assign(z.breakable(x + 14, 16, 2, 4, 'r1'), { soft: 'heavy' }); z.hint(x + 9, 13, 5, 7, 'J: attack - tap four times.\nThe LAST hit of a combo is heavy: it smashes loose rubble.'); }
        z.hint(x + 1, 13, 8, 7, 'A / D: move\nE: ' + (T.start === 'talk' ? 'talk' : 'interact'));
      },
      stairs(x) {
        z.fill(x + 2, 18, 4, 2).fill(x + 8, 16, 4, 4).plat(x + 14, 14, 4).fill(x + 20, 11, 8, 9).ladder(x + 19, 11, 9).plat(x + 29, 13, 3).plat(x + 33, 16, 3);
        z.hint(x - 2, 12, 9, 8, 'K: jump (hold for height)').hint(x + 14, 5, 6, 9, 'W / S: climb ladders').hint(x + 21, 4, 8, 7, 'S + K: drop through thin ledges');
        z.shard(T.zone + '_a', x + 24, 5);
      },
      zigzag(x) {
        z.clear(x + 2, 20, 26, 1).liquid(x + 2, 21, 26, 2).plat(x + 2, 18, 3).plat(x + 7, 16, 3).plat(x + 12, 14, 4).plat(x + 18, 16, 3).plat(x + 23, 18, 3);
        z.fill(x + 33, 14, 2, 6).ladder(x + 32, 14, 6).ladder(x + 35, 14, 6);
        z.hint(x - 3, 12, 5, 8, 'K: jump (hold for height)\nS + K: drop through thin ledges').hint(x + 28, 8, 5, 12, 'W / S: climb ladders');
        z.shard(T.zone + '_a', x + 14, 10);
      },
      tower(x) {
        z.fill(x + 2, 18, 3, 2).plat(x + 7, 16, 4).plat(x + 13, 14, 4).fill(x + 19, 12, 6, 8).ladder(x + 18, 12, 8).plat(x + 26, 15, 3);
        z.hint(x - 2, 12, 8, 8, 'K: jump (hold for height)').hint(x + 13, 6, 6, 8, 'W / S: climb ladders').hint(x + 20, 5, 6, 7, 'S + K: drop through thin ledges');
        z.shard(T.zone + '_a', x + 22, 6);
      },
      catwalk(x) {
        z.fill(x + 2, 18, 4, 2).fill(x + 8, 16, 4, 4).plat(x + 14, 14, 5).ladder(x + 17, 8, 6).plat(x + 18, 8, 6).fill(x + 21, 16, 3, 4).plat(x + 26, 18, 3);
        z.hint(x - 2, 12, 9, 8, 'K: jump (hold for height)').hint(x + 14, 6, 5, 8, 'W / S: climb ladders\nS + K: drop through thin ledges');
        z.shard(T.zone + '_a', x + 22, 6);
      },
      fight(x) { z.arena({ id: 'foes', x0: x + 2, x1: x + 27, gy: 19, gh: 8, intro: P + '_fight', enemies: foeList(T.foes, x), onWin: step('foes') }); },
      gaps(x) {
        z.clear(x + 6, 20, 6, 1).liquid(x + 6, 21, 6, 2).clear(x + 17, 20, 6, 1).liquid(x + 17, 21, 6, 2);   // runway first: a jump off the climb must not land in the pit
        z.hint(x + 1, 13, 5, 7, 'L: dash. Jump, then dash in mid-air\nto cross the ' + T.liquid + '.');
      },
      skill(x) {
        z.thing(T.pick[0], x + 3, 19, { prompt: T.pick[1], col: T.col, when: gg => !has(gg), hide: gg => !!T.pick[2] && has(gg), glow: T.col, ph: T.pick[0] === 'boulder' ? 52 : 44,
          use: gg => gg.say(P + '_skill', () => {
            const h = gg.hero(), a = D.abilities[skill()];
            gg.unlock(skill()); gg.state.energy = 300; gg.step(MS + ':skill');
            L['@skill'] = [{ s: 'sys', raw: true, t: a.name.toUpperCase() + ' - press U (costs ' + a.cost + ' ' + h.energy + ').\n' + a.desc + '\nHold J + K to charge ' + h.energy + '. Landing hits charges it too.' }];
            gg.say('@skill');
          }) });
      },
      lock(x, wide) {
        z.fill(x + 2, 2, 3, 12); z.gate(x + 3, 14, 6, { flag: T.zone + '_lock', bars: true });
        const t = z.target(x + 7, wide ? 17 : T.lockY || 17, T.zone + '_lock'); t.onHit = step('test');   // straight shots want the lock at shot height (lockY 18)
        if (wide) plate(t);
        z.hint(x - 5, 13, 7, 7, 'Hold J + K: charge energy\nU: ' + D.abilities[skill()].name + (wide ? ' - lob it through the bars onto the plate' : ' - it goes through the bars to the lock'));
      },
      plate(x) { SEG.lock(x, true); },
      burn(x) {
        z.fill(x + 2, 2, 2, 14); Object.assign(z.breakable(x + 2, 16, 2, 4, 'bar'), { soft: 'burn', onBreak: step('test') });
        z.hint(x - 4, 13, 6, 7, 'Hold J + K: charge energy\nU: ' + D.abilities[skill()].name + ' - burn the barricade down');
      },
      gated(x, gh) {
        z.fill(x, 2, 3, 12); z.gate(x + 1, 14, 6, { openIf: has, col: '#4a4f68' });
        z.arena({ id: 'test', x0: x + 4, x1: x + 27, gy: 19, gh, intro: L[P + '_test'] ? P + '_test' : null, enemies: foeList(T.testFoes, x + 2), onWin: step('test') });
        z.hint(x - 5, 13, 5, 7, 'Hold J + K: charge energy\nU: ' + D.abilities[skill()].name + '    W + U: aim it upward');
      },
      shields(x) { SEG.gated(x, 8); }, drones(x) { SEG.gated(x, 9); }, row(x) { SEG.gated(x, 7); },
      shard(x) {
        z.shard(T.zone + '_mem', x + 3, 18, { memory: route + '_1', then: MS + ':shard' });
        z.save(x + 9, 19, T.save); z.pickup('item', x + 12, 19);
        z.hint(x + 5, 13, 8, 7, 'E: rest and save here\nQ: use a healing item   M: map   Esc: menu').hint(x + 14, 13, 4, 7, 'S + L: Slipstep - blink through an enemy (60 energy).\nIt works even while you are being hit.');
      },
      boss(x) { z.arena({ id: 'boss', x0: x + 1, x1: x + 32, gy: 19, gh: 10, boss: true, enemies: [[T.boss, x + 25, 19]], intro: P + '_boss', win: P + '_win', music: 'boss', onWin: step('boss') }); }
    };
    let x = 0;
    T.order.forEach(s => { const k = s === 'climb' ? T.climb : s === 'test' ? T.test : s; SEG[k](x); x += WID[k]; });
    z.spawn('exit', x + 3, 19);
    z.thing(T.exit[2], x + 5, 19, { prompt: T.exit[3], use: gg => gg.gotoZone(T.exit[0], T.exit[1]) });
    // dressing: only on open floor
    for (let dx = 6, i = 0; dx < W - 6; dx += 7, i++) {
      if (z.grid[20][dx] !== '#' || z.grid[19][dx] !== ' ' || z.grid[18][dx] !== ' ') continue;
      const kind = T.deco[i % T.deco.length];
      if (kind === 'lamp') lamp(z, dx, 19, T.col); else if (kind === 'firebarrel') fire(z, dx, 19); else z.prop(kind, dx, 19, { col: T.col });
    }
  }
  // registers one hero's tutorial: T is its recipe (see TUT), tx its conversations (see TXT). Other files call this too.
  function addTutorial(id, T, tx) {
    const h = D.heroes[id];
    if (!h) return;
    TUT[id] = T;
    const route = h.route || id;
    Z[T.zone] = { name: T.name, theme: T.theme, music: T.music, w: tutW(T), h: 23, build(z, g) { buildTutorial(z, g, id); } };
    h.start = { zone: T.zone, spawn: 'start' }; h.mission = T.mission;
    M[T.mission] = { id: T.mission, title: T.title, hero: id, xp: 60, creds: 40, next: route === 'kael' ? 'N1-2' : 'I1-2', steps: [
      { id: 'start', t: T.steps[0] }, { id: 'foes', t: T.steps[1] }, { id: 'skill', t: T.steps[2] }, { id: 'test', t: T.steps[3] }, { id: 'shard', t: 'Touch the Memory Shard' }, { id: 'boss', t: T.steps[4] }] };
    Object.keys(tx).forEach(k => { L[k === 'wake' ? (route === 'kael' ? 'k_wake' : 'n_wake') + '@' + id : T.p + '_' + k] = tx[k].map(q => ({ s: q[0], t: q[1], raw: true })); });
  }
  Object.keys(TUT).forEach(id => addTutorial(id, TUT[id], TXT[id]));

  // ---------- the Act 1 zones every road shares: doors to the new tutorials, and less of somebody else's tutorial ----------
  patch('slums', (z, g) => {
    const S = g.state;
    if (S.hero === 'kael' || S.mission === 'N1-1') return;                 // this is Kael's tutorial, not theirs
    z.ents = z.ents.filter(e => !(e instanceof SW.Shard && e.memory));
    z.ents.forEach(e => {
      if (e instanceof SW.Arena && e.id === 'tusk') { e.intro = null; e.win = null; }
      if (e instanceof SW.NPC && e.sheet === 'mags') e.talk = gg => (gg.flag('arena:slums:tusk') ? 'k_mags3' : 'k_mags_other');
    });
    z.triggers = z.triggers.filter(t => t.flag !== 'slums_pa');
  });
  patch('medlab', (z, g) => {
    const S = g.state, T = TUT[S.hero];
    z.spawn('admin', 210, 19);
    if (S.hero === 'nyra' || S.mission === 'I1-1') return;                 // Nyra's tutorial: for everyone else the test hall is sealed
    z.fill(205, 2, 2, 18);
    z.thing('door', 207, 19, { prompt: T ? 'Back to ' + T.name : 'Sealed: Sector 7 lockdown', use: gg => (T ? gg.gotoZone(T.zone, 'exit') : gg.toast('LOCKDOWN: the Sector 7 test hall is sealed after the SUBJECT 31 breach.')) });
  });
  patch('market', (z, g) => {
    const T = TUT[g.state.hero];
    z.spawn('lift', 100, 13);
    if (T && T.exit[0] === 'market') z.thing('hatch', T.exit[1] === 'pit' ? 84 : 100, 13, { prompt: 'Down to ' + T.name, use: gg => gg.gotoZone(T.zone, 'exit') });
  });
  patch('scrapton', (z, g) => {
    const S = g.state, st = S.steps;
    z.spawn('west', 3, 19).spawn('east', 176, 19);
    z.exit(0, 8, 1, 12, 'dunes', 'east', { need: gg => !!gg.state.steps['A2-2:board'], msg: 'Raider country. Read the bounty board in Scrapton before you walk into the Ash Dunes.' });
    z.exit(179, 8, 1, 12, 'glowwild', 'west', { need: gg => gg.flag('rad_filter'), msg: 'The air to the east ticks and glows. You need a radiation filter to go on.' });
    z.ents.forEach(e => {
      if (e instanceof SW.NPC && e.sheet === 'marlo') e.talk = () => (!st['A2-1:marlo'] ? 'r_marlo' : st['A2-2:boss'] && !st['A2-2:marlo'] ? 'r_marlo_back' : S.done['A2-2'] ? 'r_marlo3' : 'r_marlo2');
      if (e instanceof SW.Thing && e.kind === 'board') e.use = gg => gg.say(!S.done['A2-1'] ? 'r_board_early' : !st['A2-2:board'] ? 'r_board' : S.done['A2-2'] ? 'r_board_done' : 'r_board_wait');
      if (e instanceof SW.Thing && e.kind === 'sign' && e.x < 200) e.use = gg => gg.toast('WEST: THE ASH DUNES. Raider country.');
      if (e instanceof SW.Thing && e.kind === 'sign' && e.x > 2700) e.use = gg => gg.toast('EAST: THE GLOWWILD. Radiation filter required.');
    });
  });

  // ================= ACT 2: the same road for every hero =================
  // a spot only one hero can wake; anyone else gets a line saying it is not theirs
  function spot(z, g, id, kind, tx, o) {
    const s = story.secrets[id], mine = g.state.hero === s.hero;
    return z.thing(kind, tx, 19, Object.assign({ prompt: o.prompt, ph: o.ph, glow: mine ? D.heroes[s.hero].color : null,
      when: gg => !(mine && gg.state.secrets[id] && !o.again),
      use: gg => { if (!mine) { gg.toast(story.notYours[id]); SW.audio.sfx('deny'); } else o.use(gg); } }, o.extra || {}));
  }

  // secret spots registered by later files: story.spots[zone] = [{ id, kind, tx, prompt, say, ph, col }]
  story.spots = { dunes: [], glowwild: [] };
  const extraSpots = (z, g) => (story.spots[z.id] || []).forEach(s => spot(z, g, s.id, s.kind, s.tx, { prompt: s.prompt, ph: s.ph, use: gg => gg.say(s.say), extra: s.col ? { col: s.col } : null }));
  Object.assign(story, { addTutorial, recolor, scaled, spot, patch, comboHint: COMBO });

  Z.dunes = {
    name: 'Ash Dunes', theme: 'ash', music: 'dunes', w: 210, h: 23,
    build(z, g) {
      const hero = g.state.hero;
      z.ground(0, 209, 20).fill(0, 2, 1, 18);
      z.spawn('east', 205, 19).spawn('cave', 82, 19);
      z.exit(209, 8, 1, 12, 'scrapton', 'west');
      z.trigger(197, 6, 5, 14, gg => gg.say('d_enter'), { flag: 'dunes_in' });
      // drifts and wrecks
      z.fill(184, 19, 9, 1).fill(187, 18, 4, 1).fill(170, 19, 8, 1).fill(173, 18, 3, 1);
      [201, 166, 124, 58].forEach(x => z.prop('turbine', x, 19));
      z.prop('bones', 195, 19).prop('bones', 168, 19).prop('bones', 120, 19).prop('barrel', 183, 19);
      z.enemy('raider', 188, 17); z.enemy('gunner', 174, 17);
      spot(z, g, 'chimes', 'chimes', 180, { prompt: 'Listen to the chimes', ph: 76, use: gg => gg.say('x_chimes') });
      spot(z, g, 'stones', 'stones', 162, { prompt: 'Touch the stones', ph: 52, use: gg => gg.say('x_stones') });
      // raider outpost
      z.plat(140, 16, 5);
      z.arena({ id: 'camp', x0: 128, x1: 156, gy: 19, gh: 12, intro: 'd_camp', win: 'd_camp_win', enemies: [['raider', 136, 19], ['raider', 132, 19], ['gunner', 142, 15]], onWin: gg => gg.step('A2-2:camp') });
      z.prop('tent', 146, 19, { col: '#7a2a2a' }).prop('tent', 151, 19, { col: '#5a4634' }).prop('banner', 130, 19, { col: '#7a2a2a' }).prop('banner', 154, 19, { col: '#7a2a2a' }).prop('crate', 138, 19);
      fire(z, 135, 19);
      // a ruined overpass to climb, either way
      z.fill(122, 18, 3, 2).fill(117, 16, 4, 4).fill(115, 18, 2, 2).plat(111, 14, 3);
      z.shard('dunes_a', 112, 11); z.shard('dunes_b', 104, 18, { hidden: true });
      z.enemy('bandit', 118, 15);
      // the bone cairn: only the Storm Hound can call what sleeps here
      spot(z, g, 'alpha', 'cairn', 98, { prompt: 'Inspect the cairn', use: gg => { if (!gg.flag('alpha_called')) gg.say('x_cairn'); } });
      if (hero === 'fenn') z.arena({ id: 'alpha', x0: 86, x1: 110, gy: 19, gh: 12, boss: true, enemies: [['alpha', 90, 19]], intro: 'x_alpha', win: 'x_alpha_win', music: 'boss', armed: gg => gg.flag('alpha_called') });
      // the plugged cave: only the Mountain can move it
      z.prop('cave', 79, 19);
      spot(z, g, 'hollow', 'boulder', 79, { prompt: 'Inspect the boulder', ph: 52, again: true, use: gg => (gg.flag('hollow_open') ? gg.gotoZone('hollow', 'mouth') : gg.say('x_boulder')),
        extra: { hide: gg => gg.flag('hollow_open'), tick: (gg, t) => { if (gg.flag('hollow_open')) t.prompt = 'Enter the Hollow'; } } });
      z.enemy('raider', 73, 19);
      spot(z, g, 'dud', 'dud', 68, { prompt: 'Examine the bomb', use: gg => gg.say('x_dud') });
      z.save(62, 19, 'glyph'); z.pickup('item', 65, 19);
      z.hint(54, 13, 5, 7, "The Baron's wreck is just ahead. Rest first.");
      // the Scrap Baron
      z.arena({ id: 'baron', x0: 20, x1: 52, gy: 19, gh: 12, boss: true, enemies: [['baron', 27, 19]], intro: 'd_baron', win: 'd_baron_win', music: 'boss' });
      z.prop('cart', 25, 19).prop('banner', 22, 19, { col: '#c82a1a' }).prop('banner', 50, 19, { col: '#c82a1a' }).prop('bones', 34, 19).prop('bones', 44, 19);
      fire(z, 30, 19); fire(z, 47, 19);
      // his stash
      z.prop('crate', 6, 19).prop('crate', 7, 19).prop('barrel', 13, 19);
      z.thing('crate', 10, 19, { prompt: "Open the Baron's strongbox", when: gg => !gg.flag('baron_box'), glow: '#f5c542', use: gg => { gg.setFlag('baron_box'); gg.state.creds += 150; SW.audio.sfx('coin'); gg.toast("The Baron's strongbox: +150 creds", '#f5c542'); } });
      z.shard('dunes_c', 4, 18);
      extraSpots(z, g);
    }
  };

  Z.hollow = {
    name: 'The Hollow', theme: 'mine', music: 'memory', w: 64, h: 23,
    build(z, g) {
      z.ground(0, 63, 20).fill(0, 0, 64, 2).fill(63, 2, 1, 18);
      z.spawn('mouth', 4, 19);
      z.exit(0, 8, 1, 12, 'dunes', 'cave');
      [11, 19, 27, 35, 43, 51].forEach(x => z.prop('stones', x, 19));
      z.plat(15, 16, 4).plat(23, 13, 4).plat(31, 16, 4);
      z.shard('hollow_a', 25, 10); z.shard('hollow_b', 47, 18); z.shard('hollow_c', 59, 18);
      z.enemy('crawler', 30, 19); z.enemy('crawler', 44, 19);
      lamp(z, 8, 19, '#c8a05a'); lamp(z, 54, 19, '#c8a05a');
      z.thing('crate', 56, 19, { prompt: "Open the warden's cache", when: gg => !gg.state.secrets.hollow, use: gg => gg.say('x_hollow'), glow: '#c8a05a' });
    }
  };

  Z.glowwild = {
    name: 'Glowwild', theme: 'glow', music: 'glow', w: 222, h: 23,
    build(z, g) {
      const hero = g.state.hero, st = g.state.steps;
      z.ground(0, 221, 20).fill(221, 2, 1, 18);
      z.spawn('west', 4, 19).spawn('seam', 114, 19);
      z.exit(0, 8, 1, 12, 'scrapton', 'east');
      z.trigger(6, 6, 4, 14, gg => { gg.step('A2-3:enter'); gg.say('g_enter'); }, { flag: 'glow_in' });
      // Juniper's camp
      z.prop('tent', 12, 19, { col: '#3a5a34' }); fire(z, 17, 19, '#b8ff40');
      z.npc('juniper', 15, 19, { name: 'Juniper', talk: () => (st['A2-3:scout'] ? 'g_juniper2' : 'g_juniper') });
      z.save(21, 19, 'glyph');
      // the pools
      z.clear(28, 20, 8, 1).liquid(28, 21, 8, 2).plat(30, 18, 3);
      z.clear(42, 20, 10, 1).liquid(42, 21, 10, 2).plat(44, 18, 2).plat(48, 18, 2);
      z.shard('glow_a', 46, 14);
      z.enemy('stalker', 38, 19); z.enemy('stalker', 56, 19); z.enemy('husk', 60, 19); z.enemy('stalker', 64, 19);
      spot(z, g, 'eyrie', 'frosttree', 71, { prompt: 'Raise your arm', ph: 72, use: gg => gg.say('x_eyrie') });
      // a broken overpass, with a glowing sink under the middle span
      z.fill(78, 18, 4, 2).fill(84, 16, 5, 4).plat(91, 14, 4).fill(97, 16, 5, 4).fill(104, 18, 3, 2);
      z.clear(89, 20, 8, 1).liquid(89, 21, 8, 2);
      z.shard('glow_b', 92, 11, { hidden: true });
      z.enemy('husk', 86, 15); z.enemy('stalker', 99, 15);
      spot(z, g, 'courier', 'bones', 112, { prompt: 'Search the roots', use: gg => gg.say('x_courier') });
      spot(z, g, 'choir', 'iceseam', 117, { prompt: 'Listen at the ice', ph: 50, again: true, use: gg => (gg.flag('choir_open') ? gg.gotoZone('choir', 'seam') : gg.say('x_seam')),
        extra: { tick: (gg, t) => { if (gg.flag('choir_open')) t.prompt = 'Enter the Drowned Choir'; } } });
      // the drop-pod: only Subject 44 sets it off
      spot(z, g, 'unit03', 'beacon', 135, { prompt: 'Inspect the pod', use: gg => { if (!gg.flag('unit_called')) gg.say('x_beacon'); } });
      if (hero === 'pyra') z.arena({ id: 'unit03', x0: 122, x1: 148, gy: 19, gh: 12, boss: true, enemies: [['warden3', 143, 19]], intro: 'x_unit', win: 'x_unit_win', music: 'boss', armed: gg => gg.flag('unit_called') });
      else { z.enemy('husk', 127, 19); z.enemy('husk', 144, 19); }
      spot(z, g, 'vent', 'vent', 151, { prompt: 'Lay hands on the plug', use: gg => gg.say('x_vent') });
      // the relay
      z.save(155, 19, 'glyph'); z.pickup('item', 158, 19);
      z.prop('relay', 162, 19, { glow: '#d9b45a', gy: 82, gr: 24 });
      z.thing('console', 164, 19, { prompt: 'Relay controls', when: gg => !gg.flag('relay_off'), use: gg => gg.say('g_relay'), glow: '#d9b45a' });
      z.fill(167, 0, 3, 14); z.gate(168, 14, 6, { flag: 'relay_off', col: '#3a5a34' });
      // what it was feeding
      z.arena({ id: 'mother', x0: 171, x1: 207, gy: 19, gh: 12, boss: true, enemies: [['glowmother', 198, 19]], intro: 'g_mother', win: 'g_mother_win', music: 'boss' });
      z.shard('glow_mem', 213, 18, { memory: 'hero_4', then: () => { g.step('A2-3:shard'); story.card('act2'); } });
      [9, 24, 40, 54, 67, 76, 108, 121, 140, 160, 176, 190, 216].forEach((x, i) => z.prop(i % 3 ? 'bones' : 'turbine', x, 19));
      extraSpots(z, g);
    }
  };

  Z.choir = {
    name: 'The Drowned Choir', theme: 'ice', music: 'memory', w: 64, h: 23,
    build(z, g) {
      z.ground(0, 63, 20).fill(0, 0, 64, 2).fill(63, 2, 1, 18);
      z.spawn('seam', 4, 19);
      z.exit(0, 8, 1, 12, 'glowwild', 'seam');
      // the tilted decks of a frozen ship
      z.fill(10, 18, 6, 2).fill(18, 16, 6, 4).plat(26, 14, 5).fill(33, 16, 6, 4).fill(41, 18, 5, 2);
      z.shard('choir_a', 28, 11); z.shard('choir_b', 21, 13); z.shard('choir_c', 59, 18);
      z.enemy('husk', 36, 15); z.enemy('husk', 48, 19);
      [7, 30, 46].forEach(x => z.prop('cryotank', x, 19));
      z.prop('cell', 54, 19, { glow: '#7fd8ff', gy: 26, gr: 30 });
      z.npc('thessaly', 54, 19, { name: 'Frozen Tidesinger', fixed: true, face: -1, talk: gg => (gg.state.secrets.choir ? 'x_choir2' : 'x_choir') });
    }
  };
})();
