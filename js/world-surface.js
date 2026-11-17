'use strict';
// Shattered Worlds — the world: the Surface. Moved here from the first story mode's files (story-world.js,
// story-crater.js, story-surface.js) when that story was removed; only the world is kept: places, looks, music,
// props, sprites, enemies and bosses. No dialogue, missions, secrets, arenas, triggers or shards.
//   Ash Dunes, the Hollow, Glowwild, the Drowned Choir   (from story-world.js)
//   The Crater, and the duel balance on SW.world.crater   (from story-crater.js; the Hollow Crown's duels read it)
//   Buried Meridian (the Sinkhole, Meridian) and the Glass Sea (the Glass Sea, the Lensworks)   (from story-surface.js)
//   Scrapton's west and east edges: the roads to the Ash Dunes and the Glowwild, and the dune skiff to the Baron's wreck.
// The road east: Scrapton -> Glowwild -> the Glass Sea -> the Lensworks -> the Crater. West: Scrapton -> Ash Dunes,
// and from behind the Baron's wreck down the Sinkhole into Buried Meridian (its crate lift goes back up to Scrapton).
// The helpers (recolor, scaled, tune, lamp, fire, patch, SW.Boss2) come from SW.world, made by world-kit.js.
// Loaded right after world-kit.js.

// ================= Ash Dunes, the Hollow, Glowwild, the Drowned Choir (from story-world.js) =================
(function () {
  const SW = window.SW, D = SW.data, art = SW.art, world = SW.world, Z = SW.zones;
  const E = D.enemies, TH = art.themes;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring;
  const recolor = world.recolor, scaled = world.scaled, tune = world.tune, patch = world.patch, lamp = world.lamp, fire = world.fire;

  // ================= art: themes, props, recoloured cast =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
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
  function bakeCast() {
    // rank and file
    recolor('digger', 'thug', { hair: '#f5c542', top: '#5a5248', pants: '#3a3430' });
    recolor('hazmat', 'guard', { top: '#f5c542', pants: '#c89a2a' });
    recolor('raider', 'bandit', { top: '#7a2a2a', hair: '#3a2a20', pants: '#3a3030' });
    recolor('gunner', 'ganger', { top: '#7a4a2a', pants: '#3a2c20' }, { '#f5c542': '#ff8a3a' });
    recolor('stalker', 'feral', { skin: '#3a7a4a', top: '#1e3a2a', pants: '#16281e', boots: '#4e8a52' }, { '#c8ff5a': '#eaff9a' });
    // the Surface's bosses
    recolor('baron', 'tusk', { top: '#8a4a2a', skin: '#c8b8a0', pants: '#3a3028' }, { '#6b5234': '#3a2a20', '#b8bcc8': '#ff5a3a', '#ff3ea5': '#f5c542' });
    recolor('warden3', 'warden', null, { '#e6e8ee': '#4a2a2a', '#b9c0ce': '#3a1e1e', '#f8fafc': '#7a3a3a', '#9aa2b4': '#5a3030', '#d9b45a': '#ff8a3a' });
    recolor('baron2', 'baron', { top: '#c82a1a' });
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

  // ================= enemies and scripted bosses =================
  // script: [move, options, [weight when close, weight when far]]. Options: p2 = only once enraged.
  Object.assign(E, {
    digger:  { name: 'Shaft Guard', sheet: 'digger', hp: 40, dmg: 8, speed: 0.85, xp: 12, creds: 6, ai: 'melee', range: 28, aggro: 150, windup: 26 },
    hazmat:  { name: 'Hazmat Tech', sheet: 'hazmat', hp: 38, dmg: 7, speed: 0.9, xp: 12, creds: 6, ai: 'melee', range: 28, aggro: 150, windup: 24 },
    raider:  { name: 'Dune Raider', sheet: 'raider', hp: 72, dmg: 12, speed: 1.1, xp: 26, creds: 14, ai: 'melee', range: 28, aggro: 180, blockEvery: 4, windup: 20, commit: true },
    gunner:  { name: 'Raider Gunner', sheet: 'gunner', hp: 48, dmg: 11, speed: 0.8, xp: 24, creds: 12, ai: 'ranged', range: 160, aggro: 230, cd: 100, shot: '#ff8a3a' },
    stalker: { name: 'Glow Stalker', sheet: 'stalker', hp: 44, dmg: 11, speed: 2.0, xp: 22, creds: 5, ai: 'leaper', aggro: 190, w: 16, h: 18, anims: { idle: 'fidle', run: 'frun', jump: 'fleap', atk: 'fatk' } },
    baron:   { name: 'THE SCRAP BARON', sub: 'Raider king of the Ash Dunes', sheet: 'baron', sheet2: 'baron2', hp: 760, dmg: 14, speed: 1.0, xp: 320, creds: 220, idle: 24, w: 22, h: 48,
      script: [['swings', { n: 3, reach: 64, col: '#ffb060' }, [3, 1]], ['charge', {}, [1, 3]], ['lob', { n: 3, col: '#ff8a3a' }, [1, 2]], ['summon', { kind: 'raider', max: 2, p2: true }, [2, 2]], ['slam', { p2: true }, [2, 2]]] },
    alpha:   { name: 'THE PALE ALPHA', sub: 'It answered the howl', sheet: 'alpha', beast: true, hp: 700, dmg: 13, speed: 1.5, xp: 260, creds: 160, idle: 20, w: 30, h: 44,
      script: [['lunge', { speed: 7.5 }, [1, 3]], ['swings', { n: 2, reach: 62, col: '#ffffff' }, [3, 1]], ['slam', {}, [2, 2]], ['summon', { kind: 'feral', max: 2, p2: true }, [2, 2]]] },
    glowmother: { name: 'THE GLOWMOTHER', sub: 'What the relay was feeding', sheet: 'glowmother', beast: true, heavy: true, hp: 900, dmg: 14, speed: 0.8, xp: 400, creds: 260, idle: 30, w: 84, h: 44,
      script: [['charge', { speed: 4 }, [1, 3]], ['stomp', { col: '#b8ff40' }, [3, 1]], ['lob', { n: 3, col: '#b8ff40' }, [2, 2]], ['summon', { kind: 'stalker', max: 2 }, [1, 2]]] },
    warden3: { name: 'RETRIEVAL UNIT 03', sub: 'Halcyon recovery mech', sheet: 'warden3', hp: 640, dmg: 13, speed: 0.7, xp: 260, creds: 160, boss: 'warden', idle: 40, w: 44, h: 72, heavy: true }
  });
  // balance (see tune() in world-kit.js)
  tune('baron', { hp: 860 });
  tune('glowmother', { hp: 960, dmg: 16 });

  // ---------- Scrapton's edges: west to the Ash Dunes, east to the Glowwild ----------
  patch('scrapton', z => {
    z.spawn('west', 3, 19).spawn('east', 176, 19);
    z.exit(0, 8, 1, 12, 'dunes', 'east');
    z.exit(179, 8, 1, 12, 'glowwild', 'west');
  });

  // ================= the Ash Dunes, the Glowwild and the two hidden maps =================
  Z.dunes = {
    name: 'Ash Dunes', theme: 'ash', music: 'dunes', w: 210, h: 23,
    build(z, g) {
      z.ground(0, 209, 20).fill(0, 2, 1, 18);
      z.spawn('east', 205, 19).spawn('cave', 82, 19);
      z.exit(209, 8, 1, 12, 'scrapton', 'west');
      // drifts and wrecks
      z.fill(184, 19, 9, 1).fill(187, 18, 4, 1).fill(170, 19, 8, 1).fill(173, 18, 3, 1);
      [201, 166, 124, 58].forEach(x => z.prop('turbine', x, 19));
      z.prop('bones', 195, 19).prop('bones', 168, 19).prop('bones', 120, 19).prop('barrel', 183, 19);
      z.enemy('raider', 188, 17); z.enemy('gunner', 174, 17);
      // raider outpost
      z.plat(140, 16, 5);
      z.prop('tent', 146, 19, { col: '#7a2a2a' }).prop('tent', 151, 19, { col: '#5a4634' }).prop('banner', 130, 19, { col: '#7a2a2a' }).prop('banner', 154, 19, { col: '#7a2a2a' }).prop('crate', 138, 19);
      fire(z, 135, 19);
      // a ruined overpass to climb, either way
      z.fill(122, 18, 3, 2).fill(117, 16, 4, 4).fill(115, 18, 2, 2).plat(111, 14, 3);
      z.enemy('bandit', 118, 15);
      // the plugged cave
      z.prop('cave', 79, 19);
      z.enemy('raider', 73, 19);
      z.save(62, 19, 'glyph'); z.pickup('item', 65, 19);
      // the Scrap Baron's wreck
      z.prop('cart', 25, 19).prop('banner', 22, 19, { col: '#c82a1a' }).prop('banner', 50, 19, { col: '#c82a1a' }).prop('bones', 34, 19).prop('bones', 44, 19);
      fire(z, 30, 19); fire(z, 47, 19);
      // his stash
      z.prop('crate', 6, 19).prop('crate', 7, 19).prop('barrel', 13, 19);
      // the sinkhole behind the wreck, down into Buried Meridian (below)
      z.spawn('wreck', 58, 19).spawn('sink', 16, 19);
      z.prop('sinkhole', 16, 19);
      z.thing('hatch', 16, 19, { prompt: 'Climb down into the sinkhole', use: gg => gg.gotoZone('sinkhole', 'top') });
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
      z.enemy('crawler', 30, 19); z.enemy('crawler', 44, 19);
      lamp(z, 8, 19, '#c8a05a'); lamp(z, 54, 19, '#c8a05a');
    }
  };

  Z.glowwild = {
    name: 'Glowwild', theme: 'glow', music: 'glow', w: 222, h: 23,
    build(z, g) {
      z.ground(0, 221, 20).fill(221, 2, 1, 18);
      z.spawn('west', 4, 19).spawn('seam', 114, 19);
      z.exit(0, 8, 1, 12, 'scrapton', 'east');
      // the scouts' camp
      z.prop('tent', 12, 19, { col: '#3a5a34' }); fire(z, 17, 19, '#b8ff40');
      z.save(21, 19, 'glyph');
      // the pools
      z.clear(28, 20, 8, 1).liquid(28, 21, 8, 2).plat(30, 18, 3);
      z.clear(42, 20, 10, 1).liquid(42, 21, 10, 2).plat(44, 18, 2).plat(48, 18, 2);
      z.enemy('stalker', 38, 19); z.enemy('stalker', 56, 19); z.enemy('husk', 60, 19); z.enemy('stalker', 64, 19);
      // a broken overpass, with a glowing sink under the middle span
      z.fill(78, 18, 4, 2).fill(84, 16, 5, 4).plat(91, 14, 4).fill(97, 16, 5, 4).fill(104, 18, 3, 2);
      z.clear(89, 20, 8, 1).liquid(89, 21, 8, 2);
      z.enemy('husk', 86, 15); z.enemy('stalker', 99, 15);
      z.enemy('husk', 127, 19); z.enemy('husk', 144, 19);
      // the relay
      z.save(155, 19, 'glyph'); z.pickup('item', 158, 19);
      z.prop('relay', 162, 19, { glow: '#d9b45a', gy: 82, gr: 24 });
      z.fill(167, 0, 3, 14);
      [9, 24, 40, 54, 67, 76, 108, 121, 140, 160, 176, 190, 216].forEach((x, i) => z.prop(i % 3 ? 'bones' : 'turbine', x, 19));
      // the way east, past where the Glowmother fell: out onto the Glass Sea
      z.clear(221, 8, 1, 12);
      z.spawn('east', 217, 19);
      z.exit(221, 8, 1, 12, 'glasssea', 'west');
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
      z.enemy('husk', 36, 15); z.enemy('husk', 48, 19);
      [7, 30, 46].forEach(x => z.prop('cryotank', x, 19));
      z.prop('cell', 54, 19, { glow: '#7fd8ff', gy: 26, gr: 30 });
    }
  };
  D.world.forEach(w => { if (w.id === 'dunes' || w.id === 'glowwild') delete w.soon; });
})();

// ================= the Crater (from story-crater.js) =================
// The floor of the wound: the torn sky fell into the bomb crater and has not finished landing. Pieces of the two
// torn-in worlds (a harbour sea wall, a ring of steppe grass) stand in the violet glass, and Halcyon's Field Post 3
// keeps the veil emitter there.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, world = SW.world, Z = SW.zones;
  const E = D.enemies, TH = art.themes, HR = D.heroes;
  const rect = art.rect, line = art.line, disc = art.disc;
  const recolor = world.recolor;
  const VIOLET = '#b48cff';

  // ================= look and sound =================
  TH.crater = Object.assign({}, TH.vs_crater || TH.surface, { dim: 0.36 });
  SW.audio.tracks.crater = { bpm: 72, root: 37, prog: [0, -5, 3, -2], arp: [0, 7, 12, 15, 12, 7, 3, 7], bass: 'triangle', drums: 0.3 };

  // props: [width, height, draw], anchored bottom-centre
  const husk = (x, body, hi) => { rect(x, body, 7, 8, 8, 16); rect(x, hi, 7, 8, 2, 16); disc(x, body, 11, 6, 5); disc(x, hi, 9, 5, 2); rect(x, body, 3, 11, 4, 9); rect(x, body, 15, 11, 4, 9); rect(x, body, 7, 24, 3, 6); rect(x, body, 12, 24, 3, 6); };
  const trooper = (x, body, hi) => { rect(x, body, 2, 6, 26, 6); rect(x, hi, 2, 6, 26, 2); disc(x, body, 30, 8, 4); rect(x, '#2b2f3a', 29, 7, 4, 2); rect(x, body, 6, 3, 4, 4); rect(x, '#4a5060', 12, 1, 14, 2); };
  const PROPS = {
    crystal: [26, 34, x => { [[4, 14, 5, 20], [10, 2, 7, 32], [18, 10, 5, 24]].forEach(q => { for (let i = 0; i < q[3]; i++) { const w = Math.max(1, Math.round(q[2] * Math.min(1, (i + 2) / 8))); rect(x, i % 5 ? '#6a4aa8' : '#8a6ac8', q[0] + (q[2] - w) / 2, q[1] + i, w, 1); } rect(x, '#e0d0ff', q[0] + q[2] / 2, q[1] + 3, 1, q[3] - 6); }); }],
    huskice: [22, 30, x => { husk(x, '#9ad8f4', '#ffffff'); line(x, '#ffffff', 2, 22, 20, 18, 1); rect(x, '#d6f4ff', 0, 28, 22, 2); }],
    huskburnt: [22, 30, x => { husk(x, '#2a2420', '#4a3a30'); line(x, '#ffd24a', 11, 29, 6, 20, 1); line(x, '#ffd24a', 6, 20, 9, 12, 1); line(x, '#ffd24a', 11, 29, 16, 18, 1); rect(x, '#1a1512', 0, 28, 22, 2); }],
    trooperice: [34, 12, x => { trooper(x, '#bfe6f8', '#ffffff'); rect(x, '#d6f4ff', 0, 11, 34, 1); }],
    trooperburnt: [34, 12, x => { trooper(x, '#3a3230', '#5a4a40'); rect(x, '#ffd24a', 14, 6, 1, 5); rect(x, '#ffd24a', 20, 7, 1, 4); }],
    emitter: [30, 96, x => { rect(x, '#4a5060', 13, 26, 4, 70); rect(x, '#6a7088', 13, 26, 1, 70); line(x, '#4a5060', 2, 95, 14, 60, 2); line(x, '#4a5060', 28, 95, 16, 60, 2); art.ring(x, '#e6e8ee', 15, 14, 12); art.ring(x, '#d9b45a', 15, 14, 9); disc(x, VIOLET, 15, 14, 6); disc(x, '#ffffff', 15, 14, 2); for (let i = 0; i < 4; i++) rect(x, '#8a92a8', 10, 36 + i * 14, 10, 1); }],
    seawall: [54, 46, x => { for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) { rect(x, (i + j) % 2 ? '#7f9eb8' : '#9ab8d0', 2 + i * 13 - (j % 2) * 4, 6 + j * 8, 12, 7); } rect(x, '#e6f4ff', 0, 2, 54, 5); rect(x, '#ffffff', 4, 0, 10, 3); rect(x, '#ffffff', 30, 0, 14, 3); rect(x, '#3e5c8a', 0, 44, 54, 2); }],
    grassring: [50, 14, x => { const r = SW.rng(5); for (let i = 0; i < 46; i++) { const h = 4 + r() * 9; rect(x, i % 3 ? '#9ac84a' : '#c8e86a', 2 + i, 14 - h, 1, h); } rect(x, '#5a7a2a', 0, 12, 50, 2); }]
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

  // The veil: the two lead heroes' own sprites, repainted in Halcyon white and gold. Same silhouette on purpose.
  // (The Halcyon Agent speaker below wears them.)
  const VEIL = { skin: '#cfd4de', hair: '#8e2430', top: '#f1f3f7', pants: '#b9c0ce', boots: '#5a6478', acc: '#d9b45a', belt: '#d9b45a', chest: '#d9b45a', trail: '#ff5a5a', arm: '#cfd4de', fore: '#f1f3f7', hand: '#f1f3f7' };
  const SHEETS = [['sheet', ''], ['sheetAw', '_aw'], ['sheetArmed', '_b']];
  function bake() {
    ['kael', 'nyra'].forEach(id => SHEETS.forEach(q => { if (HR[id][q[0]]) recolor('veil_' + id + q[1], HR[id][q[0]], VEIL); }));
    recolor('veilguard', 'guard', { top: '#e6e8ee', pants: '#6a4aa8' });
    recolor('veilenf', 'enforcer', { top: '#e6e8ee', pants: '#6a4aa8' });
    recolor('glasshusk', 'husk', null, { '#b9a0ff': '#ffffff' });
  }
  const _init = art.init; art.init = function () { _init(); try { bake(); } catch (e) { console.error(e); } };

  Object.assign(D.speakers, {
    agent: { name: 'Halcyon Agent', sheet: 'veil_nyra_b', pitch: 230 },
    tech: { name: 'Veil Technician', sheet: 'hazmat', pitch: 520 }
  });
  Object.assign(E, {
    veilguard: Object.assign({}, E.guard, { name: 'Veil Trooper', sheet: 'veilguard', hp: 96, dmg: 13, xp: 30, creds: 16 }),
    veilenf: Object.assign({}, E.enforcer, { name: 'Veil Enforcer', sheet: 'veilenf', hp: 132, dmg: 16, xp: 40, creds: 22 }),
    glasshusk: Object.assign({}, E.husk, { name: 'Glass Husk', sheet: 'glasshusk', hp: 70, dmg: 12, xp: 26, creds: 8 })
  });

  // ================= the duel balance =================
  // Balance. The rival copies the player's level, upgrades, stats and unlocked moves, and on those terms the Versus bot
  // loses to plain button-mashing almost every time. So the rival gets an EDGE of its own, in steps: each step is
  // +18% damage over the player (rivalPower 3) and +50 health. How many steps is set per hero, from measured fights
  // (ST.duelBench in the old tools/story-test.js), so that a player who only mashes usually loses and one who guards and
  // uses skills usually wins with about half their health. The ten legends, who hit for +50% with +40% health, keep
  // an advantage on purpose: their steps stop at 10 (Bando gets 13: his reach keeps the bot out, and at 10 mashing
  // won 23 fights in 24). DUEL is the default for a hero with no row (LEGEND for a legend).
  // diff is the bot's level (0 Easy, 1 Normal, 2 Hard): Normal is deliberate, the Hard bot guards more and so
  // attacks less, which makes it EASIER to mash down. hpBonus is extra health for both sides.
  // The Hollow Crown's duels (js/saga/saga-core.js) read this table from SW.world.crater.
  const edge = t => ({ rivalPower: Math.round(3 * t), rivalHp: 50 * t });
  const DUEL = Object.assign({ diff: 1, hpBonus: 100 }, edge(4)), LEGEND = edge(9), FOR = {};
  [['kael', 3], ['nyra', 6], ['fenn', 8], ['isolde', 6.5], ['brakk', 4], ['pyra', 4], ['gale', 3.5], ['ashka', 7], ['dyna', 3.5], ['vesper', 5],
    ['orin', 8], ['mira', 10], ['noct', 10], ['bando', 13], ['aldric', 10], ['sen', 10], ['vega', 8], ['tessa', 9], ['jax', 8], ['ferra', 10],
    ['kiri', 5], ['tarn', 3], ['maren', 4], ['yara', 5], ['brann', 6]].forEach(q => { FOR[q[0]] = edge(q[1]); });
  Object.assign(world.crater, { DUEL, LEGEND, FOR });

  // ================= the map =================
  Z.crater = {
    name: 'The Crater', theme: 'crater', music: 'crater', w: 184, h: 23,
    build(z, g) {
      const K = g.route() === 'kael';
      D.speakers.agent.sheet = K ? 'veil_nyra_b' : 'veil_kael';
      z.ground(0, 183, 20).fill(183, 0, 1, 20);
      // the rim: glass terraces stepping down to the floor
      z.fill(0, 10, 12, 10).fill(12, 12, 6, 8).fill(18, 14, 6, 6).fill(24, 16, 6, 4).fill(30, 18, 6, 2);
      z.spawn('west', 3, 9).spawn('floor', 132, 19);
      // the Crater's west edge opens onto the Lensworks
      z.exit(0, 0, 1, 10, 'lensworks', 'east');
      z.prop('crystal', 9, 9).prop('crystal', 15, 11).prop('crystal', 27, 15).prop('bones', 21, 13);
      // the glass field: pieces of two other worlds
      z.prop(K ? 'grassring' : 'seawall', 40, 19).prop('crystal', 37, 19).prop('crystal', 58, 19);
      z.enemy('glasshusk', 44, 19); z.enemy('stalker', 50, 19); z.enemy('glasshusk', 56, 19);
      z.prop(K ? 'huskice' : 'huskburnt', 45, 19).prop(K ? 'huskice' : 'huskburnt', 49, 19);
      z.plat(52, 16, 3);
      // a sink of rift-light
      z.clear(62, 20, 8, 1).liquid(62, 21, 8, 2).plat(64, 18, 4);
      z.prop(K ? 'seawall' : 'grassring', 74, 19).prop('crystal', 71, 19);
      z.enemy('stalker', 76, 19);
      // Halcyon field post 3: the veil's emitter, its crew's tents, and the barrier's frame across the road
      z.prop('tent', 86, 19, { col: '#e6e8ee' }).prop('tent', 104, 19, { col: '#e6e8ee' }).prop('banner', 82, 19, { col: '#d9b45a' }).prop('banner', 107, 19, { col: '#d9b45a' }).prop('crate', 90, 19).prop('crate', 91, 19);
      z.prop('emitter', 99, 19, { glow: VIOLET, gy: 82, gr: 26, flicker: true });
      z.fill(110, 0, 3, 14);
      // the last quiet stretch
      z.save(116, 19, 'glyph'); z.pickup('item', 119, 19);
      z.prop(K ? 'trooperice' : 'trooperburnt', 126, 19).prop('crystal', 129, 19);
      // the floor of the Crater
      z.prop('seawall', 137, 19).prop('grassring', 166, 19).prop('crystal', 142, 19).prop('crystal', 171, 19).prop('crystal', 177, 19);
    }
  };
  D.world.forEach(w => { if (w.id === 'crater') delete w.soon; });
})();

// ================= Buried Meridian and the Glass Sea (from story-surface.js) =================
//   BURIED MERIDIAN: a sinkhole behind the Scrap Baron's wreck drops into a city that was buried under the Ash Dunes
//     before anyone now alive was born. Halcyon is digging out its Lantern Archive, a vault of the old city's memories.
//     Its boss: THE EXCAVATOR, a dig rig that burrows.
//   THE GLASS SEA: the fused-glass desert between the Glowwild and the Crater. Halcyon mirror masts throw mirages
//     across it. Its boss: THE LENSWRIGHT, who fights with mirror copies of himself.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, world = SW.world, Z = SW.zones;
  const E = D.enemies, TH = art.themes, W = SW.W, H = SW.H;
  if (!world || !world.patch || !world.tune || !SW.Boss2) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring, sh = art.shade;
  const sfx = n => SW.audio.sfx(n);
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16;

  // ================= look: themes, music, backdrops, props =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    buried:   theme('metro', { style: 'brick', a: '#5a4632', b: '#4a3a28', top: '#a08060', hi: '#d8b888', deep: '#22180e', plat: '#8a6a3a', sky: ['#120c08', '#3a2818'], mid: 'ruins', midCol: '#1a120a', bg: 'none', dim: 0, haz: '#f5c542', win: ['#f5c542'] }),
    sinkhole: theme('metro', { style: 'dirt', a: '#6a5238', b: '#5a442e', top: '#c8a070', hi: '#e8c890', deep: '#2a1e12', plat: '#8a6a3a', sky: ['#d89a5a', '#3a2818'], mid: 'ruins', midCol: '#1a120a', bg: 'none', dim: 0, haz: '#f5c542', win: ['#f5c542'] }),
    glass:    theme('surface', { style: 'dirt', a: '#7ab0b8', b: '#6a9aa2', top: '#d8f8ff', hi: '#ffffff', deep: '#2a5a68', plat: '#9adfe8', sky: ['#6aa8d0', '#f0d0a0'], mid: 'ruins', midCol: '#5a8a98', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#9af0ff'] }),
    lens:     theme('surface', { style: 'plate', a: '#c8ccd6', b: '#b4b8c4', top: '#ffffff', hi: '#ffffff', deep: '#5a6078', plat: '#9af0ff', sky: ['#6aa8d0', '#f0d0a0'], mid: 'ruins', midCol: '#5a8a98', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#9af0ff'] })
  });
  SW.audio.tracks.buried = { bpm: 84, root: 40, prog: [0, -3, -5, -2], arp: [0, 3, 7, 12, 7, 3, 10, 3], bass: 'triangle', drums: 0.5 };
  SW.audio.tracks.glass = { bpm: 100, root: 44, prog: [0, 4, -1, 5], arp: [0, 7, 11, 14, 11, 7, 4, 7], bass: 'triangle', drums: 0.4 };

  function bakeBackdrops() {
    const paint = (id, fn) => { const cv = SW.canvas(512, 300); fn(cv[1], SW.rng(id.length * 151 + 3)); art.bg['srf_' + id] = cv[0]; TH[id].bg = 'srf_' + id; TH[id].dim = 0; };
    const buried = (x, r) => {
      // skyscrapers of the old city, leaning in the sand, a few windows still lit by Halcyon floodlights
      for (let i = 0; i < 7; i++) {
        const bx = i * 76 + (r() * 24 | 0), w = 40 + (r() * 26 | 0), h = 160 + (r() * 120 | 0), lean = (r() - 0.5) * 0.25;
        x.save(); x.translate(bx + w / 2, 300); x.rotate(lean);
        rect(x, i % 2 ? '#2a1e14' : '#241a10', -w / 2, -h, w, h); rect(x, '#34261a', -w / 2, -h, 3, h);
        for (let wy = -h + 10; wy < -20; wy += 12) for (let wx = -w / 2 + 5; wx < w / 2 - 6; wx += 9) rect(x, r() < 0.06 ? '#c8902a' : '#1a120a', wx, wy, 4, 6);
        x.restore();
      }
      for (let i = 0; i < 6; i++) { const sx = r() * 512 | 0; x.globalAlpha = 0.35; rect(x, '#c8a070', sx, 0, 2, 300); rect(x, '#e8c890', sx + 1, 0, 1, 300); x.globalAlpha = 1; }
      for (let i = 0; i < 7; i++) { const dx = i * 80 + (r() * 30 | 0); disc(x, '#3a2a1a', dx, 300, 40 + (r() * 30 | 0)); }
      for (let i = 0; i < 40; i++) rect(x, sh('#e8c890', 0.4 + r() * 0.3), r() * 512 | 0, r() * 300 | 0, 1, 1);
    };
    paint('buried', buried);
    paint('sinkhole', (x, r) => { buried(x, r); x.globalAlpha = 0.25; for (let i = 0; i < 5; i++) { const lx = 60 + i * 100; rect(x, '#ffe0a0', lx, 0, 18, 300); } x.globalAlpha = 1; });
    const glass = (x, r) => {
      // the Crater's violet glow on the eastern horizon, glass dunes catching the sun, heat shimmer
      x.globalAlpha = 0.35; disc(x, '#b06cff', 420, 300, 120); x.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { const cx = i * 96 + (r() * 30 | 0), w = 120 + (r() * 80 | 0), hgt = 40 + (r() * 50 | 0); for (let k = 0; k < hgt; k += 2) { const ww = w * Math.sqrt(1 - k / hgt); rect(x, k < 4 ? '#e8fbff' : k % 6 < 2 ? '#a8d8e0' : '#8ac0cc', cx - ww / 2, 300 - k, ww, 2); } line(x, '#ffffff', cx - w / 4, 300 - hgt * 0.6, cx + w / 6, 300 - hgt * 0.85, 1); }
      for (let i = 0; i < 14; i++) { const sy = 150 + (r() * 100 | 0), sx = r() * 512 | 0; x.globalAlpha = 0.3; rect(x, '#ffffff', sx, sy, 24 + (r() * 30 | 0), 1); x.globalAlpha = 1; }
      for (let i = 0; i < 10; i++) { const gx = r() * 512 | 0, gy = 180 + (r() * 110 | 0); rect(x, '#ffffff', gx, gy, 1, 3); rect(x, '#ffffff', gx - 1, gy + 1, 3, 1); }
    };
    paint('glass', glass);
    paint('lens', (x, r) => { glass(x, r); for (let i = 0; i < 5; i++) { const px = 40 + i * 104; rect(x, '#d8dce4', px, 120, 4, 180); rect(x, '#9af0ff', px - 10, 112, 24, 14); rect(x, '#ffffff', px - 8, 114, 6, 4); } });
  }

  const PROPS = {
    sinkhole: [76, 30, x => { disc(x, '#1a120a', 38, 30, 34); rect(x, '#1a120a', 4, 26, 68, 4); ring(x, '#c8a070', 38, 30, 35); line(x, '#8a6a3a', 30, 0, 32, 30, 1); rect(x, '#8a6a3a', 26, 0, 10, 3); }],
    facade: [96, 124, (x, c) => { rect(x, '#4a3a2a', 4, 6, 88, 118); rect(x, '#5a4834', 4, 6, 88, 4); rect(x, '#3a2c1e', 86, 6, 6, 118); for (let wy = 16; wy < 104; wy += 16) for (let wx = 12; wx < 82; wx += 14) rect(x, (wx * 7 + wy * 3) % 11 === 0 ? c : '#1a120a', wx, wy, 8, 10); rect(x, '#2a1e12', 38, 96, 20, 28); for (let i = 0; i < 6; i++) disc(x, '#a08060', 10 + i * 16, 124, 9); }],
    mural: [68, 44, x => { rect(x, '#3a2c1e', 0, 0, 68, 44); rect(x, '#6aa8d0', 3, 3, 62, 24); rect(x, '#f5d080', 3, 27, 62, 14); disc(x, '#fff0a0', 50, 12, 6); for (let i = 0; i < 8; i++) { const h = 6 + (i * 37 % 13); rect(x, '#5a6a8a', 6 + i * 7, 27 - h, 6, h); } rect(x, '#a08060', 3, 38, 62, 3); x.globalAlpha = 0.35; rect(x, '#c8a070', 30, 3, 35, 38); x.globalAlpha = 1; }],
    kiosk: [24, 40, x => { rect(x, '#4a5060', 4, 4, 16, 36); rect(x, '#6a7088', 4, 4, 16, 3); rect(x, '#b9a0ff', 7, 10, 10, 12); rect(x, '#ffffff', 9, 12, 3, 2); rect(x, '#2a2e3a', 6, 26, 12, 3); }],
    vault: [88, 100, x => { rect(x, '#3a3632', 0, 0, 88, 100); disc(x, '#5a5650', 44, 52, 40); ring(x, '#d9b45a', 44, 52, 40); ring(x, '#8a7a50', 44, 52, 34); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; rect(x, '#2a2622', 44 + Math.cos(a) * 30 - 3, 52 + Math.sin(a) * 30 - 3, 6, 6); } disc(x, '#1a1612', 44, 52, 14); disc(x, '#b9a0ff', 44, 52, 6); }],
    core: [26, 46, x => { rect(x, '#4a5060', 2, 38, 22, 8); rect(x, '#4a5060', 2, 0, 22, 6); rect(x, '#b9a0ff', 5, 6, 16, 32); rect(x, '#e8dcff', 8, 8, 4, 28); rect(x, '#8b5cf6', 16, 8, 3, 28); }],
    mirrorpanel: [32, 56, x => { rect(x, '#8a92a8', 14, 30, 4, 26); rect(x, '#5a6078', 8, 52, 16, 4); rect(x, '#d8dce4', 1, 1, 30, 32); rect(x, '#9adfe8', 3, 3, 26, 28); rect(x, '#e8fbff', 5, 5, 8, 4); line(x, '#ffffff', 20, 8, 26, 26, 1); }],
    glasscairn: [30, 26, x => { [[2, 14, 10, 12], [10, 6, 10, 20], [19, 12, 9, 14]].forEach(q => { rect(x, '#9adfe8', q[0], q[1], q[2], q[3]); rect(x, '#e8fbff', q[0], q[1], 2, q[3]); rect(x, '#5aa8b8', q[0] + q[2] - 2, q[1], 2, q[3]); }); }]
  };
  const pcache = {}, _prop = art.prop, _psize = art.propSize;
  art.prop = function (ctx, kind, x, y, col) {
    const d = PROPS[kind];
    if (!d) return _prop.apply(this, arguments);
    const c0 = col || '#f5c542', key = kind + c0;
    let c = pcache[key];
    if (!c) { const cv = SW.canvas(d[0], d[1]); d[2](cv[1], c0); c = pcache[key] = cv[0]; }
    ctx.drawImage(c, Math.round(x - d[0] / 2), Math.round(y - d[1]));
  };
  art.propSize = kind => (PROPS[kind] ? [PROPS[kind][0], PROPS[kind][1]] : _psize(kind));

  // ================= the new faces =================
  function bakeSurface() {
    const custom = art.custom, recolor = world.recolor;
    // sand burrower: a mound with eyes until it lunges out
    const worm = (pose, eye) => x => {
      if (pose === 'mound') { disc(x, '#a08060', 16, 20, 9); rect(x, '#a08060', 4, 18, 24, 6); rect(x, '#c8a070', 10, 14, 10, 2); rect(x, eye, 18, 16, 2, 2); rect(x, eye, 22, 17, 2, 2); return; }
      const up = pose === 'leap' ? 6 : pose === 'bite' ? 3 : 0;
      for (let i = 0; i < 5; i++) { const cx = 6 + i * 5, cy = 20 - up - Math.sin(i * 0.9) * (pose === 'leap' ? 6 : 3); disc(x, i % 2 ? '#8a5a3a' : '#9a6a44', cx, cy, 4 + (i === 4 ? 1 : 0)); rect(x, '#c8a070', cx - 2, cy - 4, 4, 1); }
      const hx = 29, hy = 18 - up - (pose === 'leap' ? 6 : 3);
      rect(x, '#5a2e1a', hx - 1, hy - 3, 4, 7); rect(x, pose === 'bite' ? '#ffe0a0' : '#3a1a10', hx + 1, hy - 2, 2, 5); rect(x, eye, hx - 3, hy - 4, 2, 2);
      disc(x, '#a08060', 8, 24, 6);
    };
    custom('burrower', 36, 26, 24, { idle: [worm('mound', '#ff8a3a')], run: [worm('crawl', '#ff8a3a'), worm('mound', '#ff8a3a')], leap: [worm('leap', '#ff8a3a')], bite: [worm('bite', '#ffffff'), worm('bite', '#ff5a3a')], hurt: [worm('crawl', '#ffffff')], down: [worm('mound', '#3a2a1a')] });
    // THE EXCAVATOR: Halcyon's dig rig. Tracks, a white cab, a drill the size of a car
    const rig = (o, hot) => x => {
      const lift = o.lift || 0, tr = o.tr || 0, lean = o.lean || 0, spin = o.spin || 0, lamp = o.lamp || (hot ? '#ff5a3a' : '#fff7d0');
      // tracks
      disc(x, '#2a2620', 20, 76, 10); disc(x, '#2a2620', 98, 76, 10); rect(x, '#2a2620', 20, 66, 78, 20);
      for (let i = 0; i < 9; i++) rect(x, '#4a463e', 18 + ((i * 10 + tr * 5) % 84), 84, 6, 2);
      for (let i = 0; i < 5; i++) { disc(x, '#5a564c', 26 + i * 17, 76, 6); disc(x, '#3a362e', 26 + i * 17, 76, 2); }
      // chassis in Halcyon yellow, hazard stripes
      rect(x, hot ? '#e8a040' : '#d9b45a', 16 + lean, 44, 84, 24); rect(x, '#f5d080', 16 + lean, 44, 84, 3);
      for (let i = 0; i < 10; i++) rect(x, i % 2 ? '#1a1612' : '#f5c542', 18 + lean + i * 8, 62, 8, 4);
      rect(x, '#8a7a50', 24 + lean, 50, 22, 8); rect(x, '#3a3632', 26 + lean, 52, 18, 4);
      // cab and exhaust
      rect(x, '#e8e4d8', 30 + lean, 20, 32, 26); rect(x, '#ffffff', 30 + lean, 20, 32, 3); rect(x, '#2a2e3a', 34 + lean, 25, 24, 11); rect(x, hot ? '#ff8a3a' : '#6fd3e8', 36 + lean, 27, 20, 7);
      rect(x, '#3a3632', 22 + lean, 6, 5, 40); rect(x, '#5a5650', 21 + lean, 4, 7, 3);
      rect(x, lamp, 60 + lean, 28, 4, 4); rect(x, '#d9b45a', 34 + lean, 16, 24, 4);
      // the drill arm and bit
      const ay = 50 - lift, tipX = 124 + (o.reach || 0);
      line(x, '#6a665c', 88 + lean, 54, 100, ay, 6); rect(x, '#4a463e', 96, ay - 6, 10, 12);
      for (let k = 0; k < 20; k++) { const hh = Math.max(1, 12 - k * 0.6); rect(x, (k + spin) % 4 < 2 ? (hot ? '#ff8a3a' : '#c8ccd8') : (hot ? '#ffd0a0' : '#8a92a8'), 106 + k, ay - hh / 2, 1, hh); }
      rect(x, hot ? '#ffffff' : '#e8ecf4', tipX - 1, ay - 1, 2, 2);
      if (hot) { line(x, '#ff5a3a', 40 + lean, 46, 48 + lean, 66, 1); line(x, '#ff5a3a', 80 + lean, 46, 74 + lean, 64, 1); }
    };
    const xsheet = (id, hot) => custom(id, 132, 92, 90, {
      idle: [rig({}, hot), rig({ spin: 1 }, hot)], run: [rig({ tr: 0, spin: 1 }, hot), rig({ tr: 1, spin: 3 }, hot)],
      a1: [rig({ lift: 14, lean: -2 }, hot), rig({ lift: -4, reach: 4, lean: 3, spin: 2 }, hot)], a4: [rig({ lift: 26, lean: -3 }, hot), rig({ lift: -10, lean: 4, spin: 2 }, hot)],
      special: [rig({ lift: 6, lean: -3, lamp: '#ffffff', spin: 1 }, hot)], dash: [rig({ tr: 0, lean: 4, spin: 1 }, hot), rig({ tr: 1, lean: 4, spin: 3 }, hot)],
      cast: [rig({ lift: 20 }, hot), rig({ lift: 8, reach: 3 }, hot)], jump: [rig({ lift: 22 }, hot)], cheer: [rig({ lift: 28, lamp: '#ffffff' }, hot)],
      tele: [rig({ lift: 6, lamp: '#ffffff' }, hot)], hurt: [rig({ lean: -4, lamp: '#ffffff' }, hot)], down: [rig({ lift: -14, lean: -6, lamp: '#2a2620' }, hot)]
    }, '#120e08');
    xsheet('excavator', false); xsheet('excavator2', true);
    // the Lenswright: a new rig, white coat, glass visor, a mirror-staff
    art.bake('lenswright', { head: 'long', sc: 1.1, weapon: 'staff', armed: 1, c: { skin: '#e0c8b8', hair: '#e8fbff', top: '#e8ecf4', pants: '#5a6a8a', boots: '#2b2f3a', belt: '#9af0ff', chest: '#9af0ff', trail: '#9af0ff', acc: '#9af0ff' }, trailLen: 4, trailW: 3 }, 'enemy');
    recolor('lenswright2', 'lenswright', { top: '#9af0ff', hair: '#ffffff' });
    // rank and file
    recolor('digcrew', 'guard', { top: '#e8e4d8', pants: '#c86a2a', hair: '#ff8a3a' });
    recolor('rusk', 'brawler', { top: '#e8e4d8', pants: '#c86a2a', hair: '#3a2a20' });
    recolor('mirage', 'raider', { top: '#9adfe8', hair: '#e8fbff', pants: '#5aa8b8', skin: '#c8f0f8', boots: '#2a5a68' });
    const dr = { '#3a3f4e': '#8a6a2a', '#555b6e': '#b8902a', '#8a92a8': '#e8c86a', '#2b2f3a': '#4a3a1a', '#6fd3e8': '#ff8a3a', '#1c1f28': '#2a2010' };
    recolor('digdrone', 'drone', null, dr);
    recolor('lensdrone', 'drone', null, { '#3a3f4e': '#9adfe8', '#555b6e': '#d8f8ff', '#8a92a8': '#ffffff', '#2b2f3a': '#2a5a68', '#6fd3e8': '#b06cff', '#1c1f28': '#1a3a44' });
    recolor('glasscrawler', 'crawler', null, { '#b8703a': '#9adfe8', '#8a4a26': '#5aa8b8', '#d08a4a': '#e8fbff', '#5a2e18': '#2a5a68', '#ffb040': '#ffffff', '#fff0b0': '#ffffff', '#3a2418': '#1a3a44', '#ff5a3a': '#ff5aa0' });
    // custom sheets without a run / attack frame of their own: give the shared enemy poses something to show
    ['digdrone', 'lensdrone'].forEach(id => { const s = art.sheets[id]; if (s) { s.anims.run = s.anims.idle; s.anims.zap = s.anims.atk; } });
    const gc = art.sheets.glasscrawler; if (gc) gc.anims.lunge = gc.anims.run;
  }
  const _init = art.init; art.init = function () { _init(); try { bakeBackdrops(); bakeSurface(); } catch (e) { console.error(e); } };

  // ================= enemies and bosses =================
  Object.assign(E, {
    burrower:     { name: 'Sand Burrower', sheet: 'burrower', hp: 54, dmg: 12, speed: 1.6, xp: 22, creds: 4, ai: 'leaper', aggro: 170, w: 22, h: 14, anims: { idle: 'idle', run: 'run', jump: 'leap', atk: 'bite' } },
    digcrew:      { name: 'Halcyon Dig Crew', sheet: 'digcrew', hp: 84, dmg: 13, speed: 0.95, xp: 28, creds: 14, ai: 'melee', range: 28, aggro: 170, blockEvery: 4, windup: 22, commit: true },
    digdrone:     { name: 'Dig Drone', sheet: 'digdrone', hp: 28, dmg: 8, speed: 1.1, xp: 16, creds: 6, ai: 'drone', aggro: 210, fly: true, w: 18, h: 14, shot: '#ff8a3a', anims: { atk: 'zap' } },
    glasscrawler: { name: 'Glass Crawler', sheet: 'glasscrawler', hp: 80, dmg: 13, speed: 0.55, xp: 30, creds: 8, ai: 'crawler', aggro: 120, armored: true, w: 30, h: 14, contact: true, anims: { atk: 'lunge' } },
    lensdrone:    { name: 'Lens Drone', sheet: 'lensdrone', hp: 30, dmg: 9, speed: 1.2, xp: 18, creds: 6, ai: 'drone', aggro: 220, fly: true, w: 18, h: 14, shot: '#b06cff', anims: { atk: 'zap' } },
    mirage:       { name: 'Mirage', sheet: 'mirage', hp: 26, dmg: 11, speed: 1.15, xp: 0, creds: 0, ai: 'melee', range: 28, aggro: 260, windup: 22, glassy: true },
    lensclone:    { name: 'Mirror Image', sheet: 'lenswright', hp: 1, dmg: 10, speed: 1.3, xp: 0, creds: 0, ai: 'melee', range: 30, aggro: 300, windup: 20, glassy: true },
    excavator: { name: 'THE EXCAVATOR', sub: 'Halcyon dig rig, Meridian site', sheet: 'excavator', sheet2: 'excavator2', beast: true, heavy: true, hp: 980, dmg: 17, speed: 0.75, xp: 420, creds: 260, idle: 34, w: 80, h: 66, counter: 2, poise: 4,
      script: [['charge', { speed: 4.2 }, [1, 3]], ['stomp', { col: '#d9b45a' }, [3, 1]], ['lob', { n: 2, col: '#c8a070', dmg: 9 }, [1, 2]], ['summon', { kind: 'digdrone', max: 2, hp: 16, fly: true, p2: true }, [2, 2]]] },
    lenswright: { name: 'THE LENSWRIGHT', sub: 'Halcyon optics, Parallax trials', sheet: 'lenswright', sheet2: 'lenswright2', hp: 920, dmg: 14, speed: 1.15, xp: 440, creds: 260, idle: 24, w: 14, h: 38, counter: 2, poise: 4,
      script: [['volley', { n: 3, kind: 'crescent', col: '#9af0ff', speed: 3.8, gap: 16 }, [1, 3]], ['swings', { n: 2, reach: 54, col: '#e8fbff' }, [3, 1]], ['lunge', {}, [1, 2]], ['summon', { kind: 'lensclone', max: 2, hp: 1 }, [2, 2]]] }
  });
  // balance (the old tools/story-test.js bots, 10-12 fights each; Excavator at level 13, Lenswright at 14, three kit
  // skills): the masher dies 7 in 10 and 9 in 12; careful play never died, losing ~31% (Excavator) and ~48% (Lenswright)
  // health. The Glowmother got soft on mashing (level 14: masher died 2 in 8), so it answers free hits harder now:
  // masher 6 in 10, careful 1 death in 10, losing ~43%.
  world.tune('glowmother', { counter: 2, poise: 4 });
  // mirages and mirror images shimmer: half there
  const EP = SW.Enemy.prototype, _ed = EP.draw;
  EP.draw = function (ctx, cam, g) {
    if (!this.def || !this.def.glassy) return _ed.apply(this, arguments);
    ctx.save(); ctx.globalAlpha = 0.55 + 0.25 * Math.sin((this.t || 0) * 0.15);
    try { return _ed.apply(this, arguments); } finally { ctx.restore(); }
  };
  const _edie = EP.die; EP.die = function (g) {
    if (this.def && this.def.glassy && !this.dead) { fx.spark(this.x, this.y - 18, '#e8fbff', 14, 3); fx.ring(this.x, this.y - 18, '#9af0ff', 3, 20, 10); sfx('burst'); }
    const was = this.dead, r = _edie.apply(this, arguments);
    // the Lenswright's mirror images break with him
    if (!was && this.type === 'lenswright' && G.zone) G.zone.ents.forEach(e => { if (e.type === 'lensclone' && !e.dead) { e.hp = 0; e.die(g); } });
    return r;
  };

  // ---------- the Excavator's own move: it drills under the floor and comes up beneath you ----------
  function drawMound(ctx, cam, b) {
    const x = Math.round(b.x - cam.x), y = Math.round(b.y - cam.y), s = Math.sin((b.t || 0) * 0.6) * 2;
    disc(ctx, '#a08060', x, y + 4, 18); rect(ctx, '#a08060', x - 26, y - 2, 52, 6); rect(ctx, '#c8a070', x - 10 + s, y - 12, 20, 3);
    if (b.burrowWarn) { for (let k = 0; k < 10; k++) rect(ctx, (k + (b.t | 0)) % 4 < 2 ? '#ff8a3a' : '#ffd0a0', x - 1 + s, y - 14 - k, 3 - (k > 6 ? 1 : 0), 1); if ((b.t | 0) % 8 < 5) { rect(ctx, '#ff8a3a', x - 42, y - 2, 84, 2); rect(ctx, '#ff8a3a', x - 42, y - 8, 2, 8); rect(ctx, '#ff8a3a', x + 40, y - 8, 2, 8); } SW.text(ctx, '!', x, y - 48, '#ffe040', { align: 'center' }); }
  }
  function* burrow(b, g) {
    const p = g.player;
    b.faceTo(p); b.vx = 0; b.setPose('special', 0); b.tele = 30; sfx('tele');
    for (let i = 0; i < 30; i++) yield;
    b.tele = 0; sfx('explode'); fx.dust(b.x, b.y, 16); fx.shake(5, 12);
    b.burrowed = true; b.invuln = 9999;
    const lo = (b.ax0 || b.x - 300) + 30, hi = (b.ax1 || b.x + 300) - 30;
    for (let i = 0; i < 120; i++) {
      const tx = SW.clamp(p.x, lo, hi), dx = tx - b.x;
      if (Math.abs(dx) < 6) break;
      b.vx = Math.sign(dx) * Math.min(b.phase === 2 ? 3.6 : 3, Math.abs(dx));
      if (i % 3 === 0) fx.dust(b.x, b.y, 2);
      yield;
    }
    b.vx = 0; b.burrowWarn = true;
    for (let i = 0; i < (b.phase === 2 ? 28 : 36); i++) { if (i % 4 === 0) fx.dust(b.x + SW.rand(-20, 20), b.y, 3); yield; }
    b.burrowed = false; b.burrowWarn = false; b.invuln = 0; b.setPose('a4', 1);
    sfx('explode'); fx.shake(9, 18); fx.debris(b.x, b.y - 10, '#c8a070', 24);
    SW.strike(g, { team: 'enemy', x: b.x - 42, y: b.y - 64, w: 84, h: 64, dmg: b.def.dmg + 3, kx: 4, ky: -6, heavy: true, unblockable: true, hitSet: new Set(), srcX: b.x, src: b });
    for (let i = 0; i < 34; i++) yield;
  }
  const B2 = SW.Boss2.prototype, _think = B2.think, _bdraw = B2.draw;
  B2.draw = function (ctx, cam) { if (this.burrowed) return drawMound(ctx, cam, this); return _bdraw.apply(this, arguments); };
  B2.think = function (g, z, p) {
    if (this.type === 'excavator' && !this.gen && !this.dead) {
      this.bcd = (this.bcd === undefined ? 160 : this.bcd) - 1;
      if (this.bcd <= 0 && this.idleT <= 2) { this.bcd = this.phase === 2 ? 330 : 470; this.gen = burrow(this, g); this.last = { name: 'xBurrowLunge' }; }
    }
    return _think.call(this, g, z, p);
  };

  // ================= small machines =================
  // sets the layer line under the place name as the area opens
  class Banner {
    constructor(sub, col) { this.sub = sub; this.col = col; }
    update(g) { if (g.banner) { g.banner.sub = this.sub; g.banner.col = this.col; } this.gone = true; }
    draw() {}
  }
  // sand pours through a crack overhead: calm, a trickle, then a column that knocks you down
  class SandFall {
    constructor(tx, ty0, ty1) { this.x = tx * T + 8; this.y0 = ty0 * T; this.y1 = (ty1 + 1) * T; this.t = Math.floor(Math.random() * 300); }
    phase() { const c = this.t % 300; return c < 170 ? 'off' : c < 210 ? 'warn' : 'pour'; }
    update(g) {
      this.t++;
      const p = g.player;
      if (!p || p.dead || g.busy() || this.phase() !== 'pour') return;
      if (Math.abs(p.x - this.x) < 11 && p.y > this.y0 && p.y - p.h < this.y1) {
        p.vy = Math.max(p.vy, 3);
        if (this.t % 45 === 0) SW.strike(g, { team: 'enemy', x: this.x - 10, y: this.y0, w: 20, h: this.y1 - this.y0, dmg: 4, kx: 0, ky: 1, unblockable: true, hitSet: new Set(), srcX: this.x });
      }
    }
    draw(ctx, cam) {
      const ph = this.phase(), x = Math.round(this.x - cam.x), y0 = Math.round(this.y0 - cam.y), y1 = Math.round(this.y1 - cam.y);
      if (x < -30 || x > W + 30) return;
      rect(ctx, '#2a1e12', x - 7, y0, 14, 3);
      if (ph === 'off') return;
      if (ph === 'warn') { for (let i = 0; i < 6; i++) rect(ctx, '#e8c890', x - 1 + (i % 2), y0 + ((this.t * 3 + i * 23) % (y1 - y0)), 1, 3); return; }
      for (let i = 0; i < 26; i++) { const yy = y0 + ((this.t * 6 + i * 29) % (y1 - y0)); rect(ctx, i % 3 ? '#c8a070' : '#e8c890', x - 8 + ((i * 5) % 16), yy, 2, 5); }
      ctx.globalAlpha = 0.5; rect(ctx, '#c8a070', x - 9, y0, 18, y1 - y0); ctx.globalAlpha = 1;
      disc(ctx, '#c8a070', x, y1, 10);
    }
  }
  // a Halcyon mirror mast: it throws mirages at whoever walks near (until its flag is set)
  class Mast {
    constructor(tx, flag) { this.x = tx * T + 8; this.y = 20 * T; this.flag = flag; this.t = 0; this.cd = 60; this.kids = []; }
    update(g, z) {
      this.t++;
      const p = g.player;
      if (g.flag(this.flag)) { if (!this.cleared) { this.cleared = true; this.kids.forEach(e => { if (!e.dead) { e.hp = 0; e.die(g); } }); } return; }
      if (!p || p.dead || g.busy() || Math.abs(p.x - this.x) > 300) return;
      this.kids = this.kids.filter(e => !e.dead);
      if (--this.cd <= 0 && this.kids.length < 2) {
        this.cd = 230;
        const side = p.x < this.x ? -1 : 1, ex = this.x + side * SW.rand(30, 60), e = SW.spawnEnemy('mirage', ex, this.y);
        e.state = 'chase'; z.add(e); this.kids.push(e); fx.ring(ex, this.y - 18, '#9af0ff', 4, 26, 14); sfx('tele');
      }
    }
    draw(ctx, cam, g) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), up = !g.flag(this.flag);
      if (x < -40 || x > W + 40) return;
      rect(ctx, '#8a92a8', x - 2, y - 96, 4, 96); rect(ctx, '#5a6078', x - 8, y - 6, 16, 6);
      if (up) {
        rect(ctx, '#d8dce4', x - 16, y - 120, 32, 26); rect(ctx, '#9adfe8', x - 14, y - 118, 28, 22); rect(ctx, '#ffffff', x - 12, y - 116, 8, 4);
        const gl = (this.t * 2) % 40; if (gl < 20) rect(ctx, '#ffffff', x - 14 + gl, y - 118, 2, 22);
        art.glow(ctx, x, y - 107, 30, '#9af0ff', 0.1 + 0.05 * Math.sin(this.t * 0.1));
        if (this.t % 50 < 25) { ctx.globalAlpha = 0.25; line(ctx, '#e8fbff', x, y - 107, x - 80, y - 20, 1); line(ctx, '#e8fbff', x, y - 107, x + 80, y - 20, 1); ctx.globalAlpha = 1; }
      } else { rect(ctx, '#5a6078', x - 10, y - 100, 20, 4); for (let i = 0; i < 4; i++) rect(ctx, '#9adfe8', x - 12 + i * 7, y - 2, 3, 2); }
    }
  }

  // ================= BURIED MERIDIAN =================
  Z.sinkhole = {
    name: 'The Sinkhole', theme: 'sinkhole', music: 'buried', w: 44, h: 56,
    build(z, g) {
      z.add(new Banner('BENEATH THE ASH DUNES', '#d8b070'));
      z.fill(0, 0, 1, 56).fill(43, 0, 1, 46).ground(1, 43, 52);
      // ledges stepping down the throat of the hole; drop off the open end of each, or take the rope ladders
      z.fill(1, 8, 28, 2).fill(14, 18, 29, 2).fill(1, 28, 30, 2).fill(12, 38, 31, 2);
      z.clear(27, 8, 1, 2).ladder(27, 8, 10); z.clear(15, 18, 1, 2).ladder(15, 18, 10); z.clear(28, 28, 1, 2).ladder(28, 28, 10); z.clear(14, 38, 1, 2).ladder(14, 38, 14);
      z.spawn('top', 4, 7).spawn('bottom', 40, 51);
      z.exit(43, 46, 1, 6, 'meridian', 'west');
      z.thing('hatch', 2, 7, { prompt: 'Climb back up to the Ash Dunes', use: gg => gg.gotoZone('dunes', 'sink') });
      [[36, 0, 17], [8, 20, 27], [36, 30, 37], [6, 40, 51]].forEach(q => z.add(new SandFall(q[0], q[1], q[2])));
      z.enemy('burrower', 18, 7);
      z.enemy('digdrone', 30, 13); z.enemy('burrower', 38, 17);
      z.enemy('digcrew', 9, 27); z.enemy('burrower', 22, 27);
      z.enemy('digcrew', 24, 37); z.enemy('digdrone', 34, 33);
      z.enemy('burrower', 20, 51); z.enemy('digcrew', 30, 51);
      lamp(z, 10, 7, '#ffe0a0'); lamp(z, 34, 37, '#ffffff'); lamp(z, 24, 51, '#ffffff');
      z.prop('crate', 36, 51).prop('crate', 37, 51).prop('barrel', 32, 37);
      z.save(6, 51, 'glyph');
    }
  };
  Z.meridian = {
    name: 'Buried Meridian', theme: 'buried', music: 'buried', w: 200, h: 26,
    build(z, g) {
      z.add(new Banner('BENEATH THE ASH DUNES', '#d8b070'));
      z.fill(0, 0, 200, 3).ground(0, 199, 22);
      z.spawn('west', 2, 21).spawn('east', 196, 21);
      z.exit(0, 3, 1, 19, 'sinkhole', 'bottom');
      // the station
      z.prop('train', 20, 21).prop('facade', 8, 21, { col: '#c8902a' });
      lamp(z, 5, 21, '#ffe0a0');
      z.enemy('burrower', 26, 21);
      // the high street: drifts, buildings, sand pouring through the roof
      [36, 52, 60].forEach((x, i) => z.prop('facade', x, 21, { col: i === 1 ? '#f5c542' : '#c8902a' }));
      z.fill(34, 20, 6, 2).fill(44, 19, 4, 3).fill(45, 18, 2, 1);
      z.add(new SandFall(40, 3, 21)); z.add(new SandFall(55, 3, 21));
      z.enemy('digcrew', 47, 18); z.enemy('digdrone', 50, 11); z.enemy('burrower', 57, 21);
      // the collapsed overpass
      z.fill(64, 20, 4, 2).fill(68, 18, 4, 4).fill(72, 16, 16, 6).fill(88, 18, 3, 4).fill(91, 20, 3, 2);
      z.enemy('digcrew', 84, 15); z.enemy('burrower', 74, 15);
      // a rest
      z.save(96, 21, 'glyph'); lamp(z, 92, 21, '#ffffff'); z.pickup('item', 99, 21);
      z.prop('facade', 112, 21, { col: '#b9a0ff' });
      z.add(new SandFall(110, 3, 21));
      z.enemy('raider', 118, 21); z.enemy('digcrew', 124, 21); z.enemy('digdrone', 121, 12);
      // Halcyon's camp at the dig
      z.prop('tent', 134, 21, { col: '#e8e4d8' }).prop('tent', 144, 21, { col: '#e8e4d8' }).prop('banner', 130, 21, { col: '#d9b45a' }).prop('crate', 139, 21).prop('crate', 140, 21).prop('crate', 140, 20);
      lamp(z, 132, 21, '#ffffff'); lamp(z, 147, 21, '#ffffff');
      z.enemy('digcrew', 137, 21); z.enemy('burrower', 143, 21);
      // the dig site, the vault behind it, and the crate lift up to Scrapton
      z.prop('vault', 194, 21);
      z.add(new SandFall(160, 3, 21)); z.add(new SandFall(178, 3, 21));
      z.thing('console', 198, 21, { prompt: 'Ride the crate lift up to Scrapton', use: gg => gg.gotoZone('scrapton', 'west') });
    }
  };

  // ================= THE GLASS SEA =================
  Z.glasssea = {
    name: 'The Glass Sea', theme: 'glass', music: 'glass', w: 190, h: 23,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.ground(0, 189, 20);
      z.spawn('west', 3, 19).spawn('east', 186, 19);
      z.exit(0, 4, 1, 16, 'glowwild', 'east'); z.exit(189, 4, 1, 16, 'lensworks', 'west');
      // glass dunes and pools of glass still molten from the sun
      z.fill(14, 19, 6, 1).fill(16, 18, 2, 1).fill(64, 19, 8, 1).fill(66, 18, 4, 1).fill(122, 19, 7, 1).fill(124, 18, 3, 1);
      z.clear(36, 20, 6, 1).liquid(36, 21, 6, 2).plat(38, 18, 2);
      z.clear(84, 20, 7, 1).liquid(84, 21, 7, 2).plat(86, 18, 3);
      z.clear(140, 20, 8, 1).liquid(140, 21, 8, 2).plat(142, 18, 2).plat(146, 17, 2);
      [10, 28, 58, 76, 108, 134, 160, 176].forEach((x, i) => z.prop(i % 2 ? 'crystal' : 'glasscairn', x, 19));
      // three mirror masts
      [[48, 1], [100, 2], [152, 3]].forEach(q => z.add(new Mast(q[0], 'gs_m' + q[1])));
      z.enemy('glasscrawler', 26, 19); z.enemy('lensdrone', 60, 10); z.enemy('glasshusk', 70, 19);
      z.save(94, 19, 'glyph'); z.pickup('item', 96, 19);
      z.enemy('glasscrawler', 112, 19); z.enemy('lensdrone', 120, 9); z.enemy('glasshusk', 130, 19); z.enemy('glasscrawler', 166, 19);
    }
  };
  Z.lensworks = {
    name: 'The Lensworks', theme: 'lens', music: 'glass', w: 96, h: 23,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.ground(0, 95, 20);
      z.spawn('west', 3, 19).spawn('east', 92, 19);
      z.exit(0, 4, 1, 16, 'glasssea', 'east'); z.exit(95, 4, 1, 16, 'crater', 'west');
      z.prop('tent', 10, 19, { col: '#e6e8ee' }).prop('tent', 22, 19, { col: '#e6e8ee' }).prop('banner', 6, 19, { col: '#d9b45a' }).prop('crate', 16, 19).prop('crate', 17, 19);
      [28, 44, 58, 72, 84].forEach(x => z.prop('mirrorpanel', x, 19));
      z.enemy('veilguard', 26, 19); z.enemy('lensdrone', 30, 10);
      z.save(4, 19, 'glyph');
    }
  };

  // ================= hooking the regions into the road =================
  // (the Ash Dunes' sinkhole hatch is in its build above; the Glowwild's east exit and the Crater's west exit too)
  world.patch('scrapton', z => {
    z.thing('cart', 84, 19, { prompt: "Ride the dune skiff to the Baron's wreck", use: gg => gg.gotoZone('dunes', 'wreck') });
  });

  // ---------- the world map ----------
  D.world.push({ id: 'sinkhole', name: 'Buried Meridian', layer: 1, x: 70, y: 152 }, { id: 'glasssea', name: 'The Glass Sea', layer: 1, x: 400, y: 152 });
  D.routes.push(['dunes', 'sinkhole'], ['glowwild', 'glasssea'], ['glasssea', 'crater']);
  const GROUP = { meridian: 'sinkhole', lensworks: 'glasssea' };
  const _map = SW.ui.drawMap; SW.ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };
  world.surface = { Mast, SandFall, burrow };
})();
