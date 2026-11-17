'use strict';
// Shattered Worlds — the world above the Surface: AURELIA and the roads up to it. Moved from the first story mode's
// story-act3.js, story-skylift.js, story-noble.js, story-spire.js, story-finale.js, story-middle.js (the Underside) and
// story-roots.js (the Tether Fields) when that story was removed: the places, their look, music, props, sprites,
// enemies and bosses are unchanged; the story (missions, scenes, arenas, gates, assists, the ride, the ending) is gone.
// Helpers (recolor, scaled, patch, tune, SW.Boss2) come from world-kit.js (SW.world); shared props and sprites from
// world-surface.js and world-deep.js, which load first.
//   Part 1   the Pit champion (Anvil, as a boss), the Skylift, the Noble Ring, the Halcyon Spire and the Engine Core,
//            with the bosses the Versus final boss and the Hollow Crown use (the Director, fused, the Convergence), the
//            speakers director, pell, citizen and kessen, and the a3_* themes stages.js copies.
//   Part 2   the Underside (Ballast Decks, Cargo Ducts, Cargo Drop) and the Tether Fields (Tether Fields, the Great
//            Tether, the Anchor).
// ---------- part 1: the champion of the Pit, the Skylift, the Noble Ring, the Halcyon Spire and the Engine Core ----------
// (moved from the first story's story-act3.js, story-skylift.js, story-noble.js, story-spire.js and story-finale.js;
// the world only: their missions, scenes, arenas, gates, assists and ending are gone)
(function () {
  const SW = window.SW, D = SW.data, art = SW.art, world = SW.world, Z = SW.zones;
  const E = D.enemies;
  if (!world || !world.patch) return;
  const VIOLET = '#b48cff';

  // ================= the champion of the Pit, as a boss (story-act3.js) =================
  E.champ = { name: 'ANVIL', sub: 'Champion of the Pit, nine years unbeaten', sheet: 'anvil', sheet2: 'champ2', hp: 900, dmg: 18, speed: 1.0, xp: 320, creds: 220, idle: 26, w: 18, h: 42,
    script: [['swings', { n: 3, reach: 56, col: '#f5c542' }, [3, 1]], ['charge', {}, [1, 3]], ['slam', {}, [2, 2]], ['stomp', { col: '#f5c542' }, [2, 1]]] };
  const _init0 = art.init; art.init = function () { _init0(); try { world.recolor('champ2', 'anvil', { top: '#8a2a1a' }); } catch (e) { console.error(e); } };

  // ================= the Skylift (story-skylift.js) =================
  const T = 16, LIFT0 = 64, LIFT1 = 104;   // the lift platform, in tiles
  // the keeper of the lift
  E.vane = { name: 'LORD CASTELLAN VANE', sub: 'Keeper of the Skylift', sheet: 'vane', sheet2: 'vane2', hp: 1000, dmg: 16, speed: 1.2, xp: 420, creds: 320, idle: 24, w: 14, h: 36,
    script: [['lunge', {}, [1, 3]], ['swings', { n: 3, reach: 52, col: '#fff3c0' }, [3, 1]], ['volley', { n: 3, kind: 'crescent', col: '#d9b45a', speed: 4.2, gap: 14 }, [1, 2]]] };
  // balance (scripted fights, level 13, four moves): the masher dies nearly every time; the careful player wins most fights
  // losing 37 to 62%. A drone summon was tried and taken out: it made the fight swing between too easy and a wall.
  const _init1 = art.init; art.init = function () {
    _init1();
    try { world.recolor('vane', 'brandt', { top: '#e8ecf4', hair: '#1a1a24', pants: '#8a92b8' }, { '#ff8a3a': '#d9b45a', '#ffe0a0': '#fff3c0' }); world.recolor('vane2', 'vane', { top: '#d9b45a' }); } catch (e) { console.error(e); }
  };
  // the lift's two cables up into the cloud, and the rails at each end of the platform
  class LiftCables {
    update() {}
    draw(ctx, cam) {
      const x0 = Math.round(LIFT0 * T - cam.x), x1 = Math.round(LIFT1 * T - cam.x), y = Math.round(20 * T - cam.y);
      [x0 + 4, x1 - 4].forEach(x => { art.rect(ctx, '#3a3f4e', x - 1, 0, 3, y - 30); art.rect(ctx, '#8a92a8', x, 0, 1, y - 30); art.rect(ctx, '#d9b45a', x - 6, y - 32, 13, 3); });
      art.rect(ctx, '#8a92a8', x0 + 2, y - 14, x1 - x0 - 4, 2); art.rect(ctx, '#3a3f4e', x0 + 2, y - 12, x1 - x0 - 4, 1);
    }
  }
  Z.skylift = {
    name: 'The Skylift', theme: 'sky', music: 'sky', w: 128, h: 23,
    build(z, g) {
      z.ground(0, 127, 20).fill(127, 0, 1, 20);
      z.spawn('gate', 3, 19).spawn('top', 118, 19);
      z.exit(0, 8, 1, 12, 'scrapton', 'skylift');
      // the camp at the gate
      ['#c8642a', '#7a2a2a', '#c8642a', '#2a6a5a'].forEach((c, i) => z.prop('banner', 4 + i * 4, 19, { col: c }));
      z.prop('tent', 7, 19, { col: '#a8643a' }).prop('cart', 14, 19).prop('firebarrel', 18, 19, { glow: '#ff8a3a', gy: 16, gr: 24 });
      z.save(23, 19, 'glyph');
      // Halcyon's gate
      z.prop('banner', 30, 19, { col: '#d9b45a' }).prop('banner', 56, 19, { col: '#d9b45a' }).prop('crate', 34, 19).prop('crate', 35, 19).prop('crate', 52, 19);
      // the lift
      z.add(new LiftCables());
      z.thing('console', LIFT0 + 2, 19, { prompt: 'Ride the Skylift up', use: gg => gg.gotoZone('skylift', 'top') });
      // the top: the Skyport dock
      z.prop('banner', 108, 19, { col: '#8e2430' }).prop('banner', 120, 19, { col: '#d9b45a' });
      z.thing('door', 112, 19, { prompt: 'Step off at the Skyport', use: gg => gg.gotoZone('skyport', 'lift') });
      z.thing('console', 122, 19, { prompt: 'Ride the Skylift down', use: gg => gg.gotoZone('skylift', 'gate') });
    }
  };
  D.world.forEach(w => { if (w.id === 'skyport') w.note = 'Skylift'; });
  // Scrapton: the road to the gate; the Skyport: where the lift comes in
  world.patch('scrapton', (z, g) => {
    z.spawn('skylift', 134, 19);
    z.prop('sign', 136, 19);
    z.thing('door', 134, 19, { prompt: 'Take the road to the Skylift gate', use: gg => gg.gotoZone('skylift', 'gate') });
  });
  world.patch('skyport', (z, g) => {
    z.spawn('lift', 54, 19);   // on the far side of the gap at 46-49
    z.thing('console', 52, 19, { prompt: 'Ride the Skylift down', use: gg => gg.gotoZone('skylift', 'top') });
  });

  // ================= the Noble Ring (story-noble.js) =================
  E.quist = { name: 'PREFECT SORREL QUIST', sub: 'Keeper of the control chips', sheet: 'quist', sheet2: 'quist2', hp: 1050, dmg: 16, speed: 1.0, xp: 460, creds: 360, idle: 26, w: 14, h: 36,
    script: [['volley', { n: 3, col: VIOLET }, [1, 3]], ['swings', { n: 2, reach: 50, col: '#e8d8ff' }, [3, 1]], ['lunge', {}, [1, 2]], ['summon', { kind: 'drone', max: 2, hp: 16, fly: true }, [2, 2]]] };
  // balance (scripted fights, level 14, four moves, 4 fights each for 7 heroes): the masher dies most of the time; the careful
  // player wins losing 14 to 70%, about 40% on average (Nyra, Isolde and Brakk find her easiest, Pyra hardest).
  D.speakers.citizen = { name: 'Citizen', sheet: 'noble1', pitch: 460 };
  const _init2 = art.init; art.init = function () {
    _init2();
    try {
      const rc = world.recolor;
      rc('quist', 'brandt', { top: '#5a2a6a', hair: '#c8c8d0', pants: '#2a1a3a' }, { '#ff8a3a': VIOLET, '#ffe0a0': '#e8d8ff' }); rc('quist2', 'quist', { top: '#8a2a8a' });
      rc('noble1', 'bookie', { top: '#e8ecf4', acc: '#d9b45a', pants: '#8a92b8' });
      rc('noble2', 'mags', { top: '#d9b45a', hair: '#5a3418', pants: '#e8ecf4' });
      rc('noble3', 'kid', { top: '#8a92b8', hair: '#c8a05a' });
    } catch (e) { console.error(e); }
  };
  D.world.forEach(w => { if (w.id === 'noble') delete w.soon; });
  const RELAYS = [['relay_a', 30, 58], ['relay_b', 72, 100], ['relay_c', 114, 142]];
  Z.noble = {
    name: 'The Noble Ring', theme: 'sky', music: 'sky', w: 170, h: 23,
    build(z, g) {
      z.ground(0, 169, 20).fill(169, 0, 1, 20);
      z.spawn('west', 3, 19);
      z.exit(0, 8, 1, 12, 'skyport', 'east');
      // gilded avenues
      for (let x = 8; x < 168; x += 12) z.prop('banner', x, 19, { col: x % 24 ? '#d9b45a' : '#8e2430' });
      [20, 64, 106, 146].forEach(x => z.prop('lamp', x, 19, { glow: '#fff3c0', gy: 46, gr: 22 }));
      z.save(64, 19, 'glyph'); z.save(106, 19, 'glyph');
      // three control relays, still lit
      RELAYS.forEach(r => z.prop('relay', r[1] + 14, 19, { glow: '#ff3a3a', gy: 82, gr: 24 }));
      // the Chancery
      z.prop('door', 166, 19).prop('banner', 150, 19, { col: VIOLET }).prop('banner', 162, 19, { col: VIOLET });
    }
  };
  // the Skyport: the way east into the Ring
  world.patch('skyport', (z, g) => {
    z.spawn('east', 89, 19);
    z.exit(91, 8, 1, 12, 'noble', 'west');
  });

  // ================= the Halcyon Spire (story-spire.js) =================
  E.morrow = { name: 'DR. ILSA MORROW', sub: 'Head of Lab 9, and what she made of herself', sheet: 'morrow', sheet2: 'morrow2', hp: 1100, dmg: 14, speed: 0.95, xp: 520, creds: 400, idle: 28, w: 22, h: 48,
    script: [['swings', { n: 2, reach: 60, col: '#c8ff9a' }, [3, 1]], ['lunge', {}, [1, 3]], ['lob', { n: 2, col: '#b8ff40', dmg: 7 }, [1, 2]], ['slam', { col: '#b8ff40', p2: true }, [2, 2]]] };
  // Morrow balance (level 15, four moves): the masher dies most fights; the careful player wins losing 40 to 63%. A Glass Husk
  // summon was tried and taken out, as with Vane's drones: the pile-up killed even the careful player half the time.
  // Kessen's mech uses the Act 1 Warden's fight patterns. The careful test player was written against exactly those patterns
  // and dodges nearly everything (5 to 21% lost at any setting tried), so its difficulty for a real player is unmeasured; at
  // this setting, with an Enforcer and a drone as escort, the masher dies about two fights in three.
  E.kessen = { name: 'DR. VEYRA KESSEN', sub: 'In the Convergence mech', sheet: 'kessenmech', hp: 1400, dmg: 20, speed: 0.9, xp: 640, creds: 520, boss: 'warden', idle: 36, w: 44, h: 72, heavy: true };
  D.speakers.kessen = { name: 'Dr. Veyra Kessen', sheet: 'kessen', pitch: 470 };
  const _init3 = art.init; art.init = function () {
    _init3();
    try {
      const rc = world.recolor;
      rc('morrow', 'tusk', { top: '#3a2e5a', skin: '#a8b89a', pants: '#1c1830' }, { '#6b5234': '#4a5a3a', '#b8bcc8': '#c8ff9a', '#ff3ea5': '#b8ff40' }); rc('morrow2', 'morrow', { top: '#5a2a6a' });
      rc('kessen', 'isolde', { hair: '#c8c8d0', top: '#e8ecf4', pants: '#3a2e5a' }, { '#9ad8ff': VIOLET });
      rc('kessenmech', 'warden', null, { '#e6e8ee': '#3a3058', '#b9c0ce': '#2a2440', '#f8fafc': '#5a4a88', '#9aa2b4': '#463a6a', '#d9b45a': VIOLET });
    } catch (e) { console.error(e); }
  };
  D.world.forEach(w => { if (w.id === 'spire') delete w.soon; });
  // six floors end to end: the Atrium, the Shard Vault, Lab 9, Dr. Morrow's lab, the Engine Gallery, the Summit
  const FLOORS = [['THE ATRIUM', 0], ['THE SHARD VAULT', 40], ['LAB 9', 80], ['DR. MORROW', 120], ['THE ENGINE GALLERY', 162], ['THE SUMMIT', 202]];
  Z.spire = {
    name: 'The Halcyon Spire', theme: 'vs_spire', music: 'lab', w: 244, h: 23,
    build(z, g) {
      z.ground(0, 243, 20).fill(243, 0, 1, 20);
      z.spawn('gate', 3, 19).spawn('top', 238, 19);
      z.exit(0, 8, 1, 12, 'noble', 'spire');
      FLOORS.forEach((f, i) => {
        const x = f[1];
        if (i) { z.prop('door', x, 19).prop('banner', x - 2, 19, { col: VIOLET }).prop('banner', x + 2, 19, { col: VIOLET }); }
      });
      // 1 the Atrium
      [10, 26].forEach(x => z.prop('lamp', x, 19, { glow: VIOLET, gy: 46, gr: 22 }));
      // 2 the Shard Vault
      z.save(42, 19, 'glyph');
      [48, 54, 66, 72].forEach(x => z.prop('cryotank', x, 19));
      // 3 Lab 9
      [86, 94, 104, 112].forEach((x, i) => z.prop(i % 2 ? 'pod' : 'tank', x, 19));
      // 4 Dr. Morrow's lab
      z.save(122, 19, 'glyph');
      z.prop('cell', 140, 19, { glow: '#b8ff40', gy: 26, gr: 30 });
      // 5 the Engine Gallery
      [168, 180, 192].forEach(x => z.prop('relay', x, 19, { glow: VIOLET, gy: 82, gr: 24 }));
      // 6 the Summit
      z.save(204, 19, 'glyph');
      z.prop('emitter', 236, 19, { glow: VIOLET, gy: 82, gr: 30 });
    }
  };
  // the Noble Ring: the Spire's gate, at the Chancery
  world.patch('noble', (z, g) => {
    z.spawn('spire', 164, 19);
    z.thing('door', 166, 19, { prompt: 'Enter the Spire', glow: VIOLET, use: gg => gg.gotoZone('spire', 'gate') });
  });

  // ================= the Engine Core (story-finale.js) =================
  // the Director, in three forms (finalboss.js makes the last one stronger; vsboss.js and the Hollow Crown use it too)
  E.director = { name: 'DIRECTOR CALDER SAYLE', sub: 'Head of Halcyon', sheet: 'director', sheet2: 'director2', hp: 900, dmg: 15, speed: 1.15, xp: 300, creds: 0, idle: 24, w: 14, h: 36,
    script: [['swings', { n: 3, reach: 54, col: '#e8d8ff' }, [3, 1]], ['lunge', {}, [1, 3]], ['volley', { n: 3, kind: 'crescent', col: VIOLET, speed: 4.2, gap: 14 }, [1, 2]]] };
  E.fused = { name: 'THE DIRECTOR, FUSED', sub: 'Half man, half Engine', sheet: 'enginebeast', beast: true, heavy: true, hp: 1100, dmg: 15, speed: 0.85, xp: 300, creds: 0, idle: 28, w: 84, h: 44,
    script: [['charge', { speed: 4.2 }, [1, 3]], ['stomp', { col: VIOLET }, [3, 1]], ['lob', { n: 3, col: VIOLET, dmg: 7 }, [2, 2]]] };
  E.convergence = { name: 'THE CONVERGENCE', sub: 'What he became', sheet: 'convergence', sheet2: 'convergence', hp: 1000, dmg: 14, speed: 1.25, xp: 800, creds: 0, idle: 20, w: 16, h: 40, counter: 1.3,
    script: [['swings', { n: 2, reach: 58, col: '#ffffff' }, [3, 1]], ['lunge', { speed: 7.5 }, [1, 3]], ['volley', { n: 3, kind: 'crescent', col: VIOLET, speed: 4.6, gap: 12 }, [1, 2]], ['slam', { col: VIOLET }, [2, 2]]] };
  // balance (scripted fights, level 16, four moves, all three phases back to back, 3 runs each for 6 heroes): the masher dies in
  // phase 1 or 2 nearly every time (Nyra's masher gets through); the careful player wins about 5 runs in 6. Phase 3 first decided
  // everything (the careful player either cruised or died, about half and half); two fewer sweep hits and the partner's two
  // healing items evened it out.
  Object.assign(D.speakers, { director: { name: 'Director Calder Sayle', sheet: 'director', pitch: 240 }, pell: { name: 'Junior Researcher Pell', sheet: 'hazmat', pitch: 600 } });
  const _init4 = art.init; art.init = function () {
    _init4();
    try {
      const rc = world.recolor;
      rc('director', 'brandt', { top: '#1a1626', hair: '#e8ecf4', pants: '#2a2440' }, { '#ff8a3a': VIOLET, '#ffe0a0': '#e8d8ff' });
      rc('director2', 'director', { top: '#3a2a6a' });
      rc('convergence', 'director', { top: '#e8d8ff', hair: '#ffffff', pants: '#5a4a88' });
      const sacs = (x, i) => { [[36, 30], [54, 22], [72, 26], [88, 34]].forEach((q, k) => { art.disc(x, '#2a1a4a', q[0], q[1], 5); art.disc(x, i === 3 ? '#ffffff' : (k + i) % 2 ? VIOLET : '#e8d8ff', q[0], q[1], 3 + ((k + i) % 2)); }); };
      world.scaled('enginebeast', 'crawler', 3, [0, 1, 2, 2, 1, 3, 4], { idle: [0], run: [1, 2], tele: [3], atk: [4], hurt: [5], down: [6], dash: [1, 2], special: [3], cheer: [3], cast: [4], a1: [4], a4: [4, 4, 0], jump: [1] },
        { tint: ['#6a3aa8', 0.5], paint: sacs });
    } catch (e) { console.error(e); }
  };
  // the Engine: a great slow wheel of light behind everything. (Not named Finale: finalboss.js looks for the first story's
  // Finale fight in this area and, finding none, leaves the area alone.)
  class EngineWheel {
    constructor() { this.t = 0; }
    update() { this.t++; }
    draw(ctx, cam) {
      const x = Math.round(36 * 16 - cam.x), y = Math.round(9 * 16 - cam.y), t = this.t;
      art.glow(ctx, x, y, 90, VIOLET, 0.12 + 0.04 * Math.sin(t * 0.05));
      for (let i = 0; i < 12; i++) { const a = t * 0.01 + i * 0.5236; art.line(ctx, i % 3 ? '#5a4a88' : VIOLET, x, y, x + Math.cos(a) * 70, y + Math.sin(a) * 70, 2); }
      art.ring(ctx, VIOLET, x, y, 70); art.ring(ctx, '#e8d8ff', x, y, 24 + (t % 20)); art.disc(ctx, '#1a1626', x, y, 14); art.disc(ctx, VIOLET, x, y, 8);
    }
  }
  Z.enginecore = {
    name: 'The Engine Core', theme: 'vs_spire', music: 'boss', w: 64, h: 23,
    build(z, g) {
      z.ground(0, 63, 20).fill(63, 0, 1, 20);
      z.spawn('lift', 3, 19);
      z.exit(0, 8, 1, 12, 'spire', 'top');
      z.add(new EngineWheel());
      [16, 56].forEach(x => z.prop('relay', x, 19, { glow: VIOLET, gy: 82, gr: 24 }));
    }
  };
  // the Spire's summit: the way down into the core
  world.patch('spire', (z, g) => {
    z.thing('door', 240, 19, { prompt: 'Descend into the Engine core', glow: VIOLET, use: gg => gg.gotoZone('enginecore', 'lift') });
  });

  // Act 3 backdrops: assets/bg/bg_<map>.png, 600x300 (prompts in tools/higgsfield-act3.json). Each map gets its own copy of
  // the theme it used before, with only the picture changed; while a picture is missing the map looks exactly as it did.
  // [theme it copies, picture, how much the picture is darkened]: the Spire's server columns and the Core's wheel are bright,
  // so they sit further back than the sky pictures. stages.js copies these themes for its Versus stages when it loads.
  const TH = art.themes, ACT3_BG = { skylift: ['sky', 'bg_skylift', 0.14], noble: ['sky', 'bg_noble', 0.16], spire: ['vs_spire', 'bg_spire', 0.32], enginecore: ['vs_spire', 'bg_core', 0.5, { sky: ['#120a26', '#3a1f5c'] }] };
  Object.keys(ACT3_BG).forEach(id => {
    const [base, pic, dim, more] = ACT3_BG[id], t = 'a3_' + id;
    if (!TH[base] || !Z[id]) return;
    TH[t] = Object.assign({}, TH[base], { bg: pic, dim }, more || {});
    Z[id].theme = t;
    const im = new Image(); im.onload = () => { art.bg[pic] = im; }; im.onerror = () => {}; im.src = 'assets/bg/' + pic + '.png';
  });
})();

// ---------------------------------------------------------------------------------------------------------------------
// THE UNDERSIDE (moved from story-middle.js): the ballast decks, cargo ducts and drop bay hanging under Aurelia, with
// nothing below them but cloud. Gusts blow between the hull ribs towards the drop; the duct fans blow back down the
// duct. Its boss, the Gravity Clerk, is kept as an enemy. Uses the Middle Deep's props from world-deep.js.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, world = SW.world, Z = SW.zones;
  const E = D.enemies, TH = art.themes, W = SW.W;
  if (!world) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring;
  const sfx = n => SW.audio.sfx(n);
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16;

  // ================= look: themes, music =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    underside:  theme('sky', { style: 'plate', a: '#b8b2a4', b: '#a49e90', top: '#e8e4d8', hi: '#ffffff', deep: '#6a665c', plat: '#d9b45a', sky: ['#9ad8f0', '#f0f4f8'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: '#6fd3e8', win: ['#d9b45a'] }),
    ducts:      theme('lab', { style: 'panel', a: '#5a5448', b: '#4a453a', top: '#8a8068', hi: '#c8b88a', deep: '#22201a', plat: '#a08a50', sky: ['#100e0a', '#2a261c'], mid: 'lab', midCol: '#1a1812', bg: 'none', dim: 0, haz: '#b48cff', win: ['#d9b45a'] }),
    cargo:      theme('sky', { style: 'plate', a: '#8a8478', b: '#76705f', top: '#c8c0a8', hi: '#ffffff', deep: '#4a463c', plat: '#d9b45a', sky: ['#4aa8d8', '#d8eef8'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: '#6fd3e8', win: ['#d9b45a'] })
  });
  SW.audio.tracks.underside = { bpm: 96, root: 45, prog: [0, 5, -3, 2], arp: [0, 7, 12, 16, 12, 7, 4, 7], bass: 'square', drums: 0.45 };

  // ================= the new faces =================
  function bakeUnderside() {
    const custom = art.custom, recolor = world.recolor;
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
    recolor('hullwarden', 'guard', { top: '#e8e4d8', pants: '#6a7088' });
    recolor('clerk', 'brandt', { top: '#3a2a4a', hair: '#e8e4f0', pants: '#4a4a5a' }, { '#ff8a3a': '#b48cff', '#ffe0a0': '#e8d8ff', '#d9b45a': '#b48cff' });
    recolor('clerk2', 'clerk', { top: '#6a3a9a' });
  }
  // the backdrops (quarter scroll speed, behind everything): 512 x 300, they repeat sideways, mirrored every other time
  function bakeMids() {
    const paint = (id, fn) => { const cv = SW.canvas(512, 300); fn(cv[1], SW.rng(id.length * 131 + 7)); art.bg['mid_' + id] = cv[0]; TH[id].bg = 'mid_' + id; TH[id].dim = 0; };
    const sh = art.shade;
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
  const _init = art.init; art.init = function () { _init(); try { bakeUnderside(); bakeMids(); } catch (e) { console.error(e); } };

  // ================= enemies and bosses =================
  Object.assign(E, {
    ballastdrone: { name: 'Ballast Drone', sheet: 'ballastdrone', hp: 24, dmg: 6, speed: 1.1, xp: 14, creds: 6, ai: 'drone', aggro: 220, fly: true, w: 18, h: 14, shot: '#ffe7a8', anims: { atk: 'zap' } },
    hullwarden:   { name: 'Hull Warden', sheet: 'hullwarden', hp: 58, dmg: 10, speed: 0.95, xp: 18, creds: 10, ai: 'melee', range: 28, aggro: 170, blockEvery: 3, windup: 22 },
    wisp:         { name: 'Ballast Wisp', sheet: 'wisp', hp: 20, dmg: 7, speed: 1.3, xp: 12, creds: 3, ai: 'drone', aggro: 200, fly: true, w: 12, h: 14, shot: '#b48cff', anims: { atk: 'zap' } },
    maintunit:    { name: 'Maintenance Unit', sheet: 'maintunit', hp: 70, dmg: 11, speed: 0.7, xp: 24, creds: 12, ai: 'melee', range: 30, aggro: 170, windup: 28, w: 22, h: 30, anims: { atk: 'clamp' }, commit: true },
    clerk: { name: 'THE GRAVITY CLERK', sub: 'Ballast Office, Underside Division', sheet: 'clerk', sheet2: 'clerk2', hp: 760, dmg: 13, speed: 1.1, xp: 320, creds: 200, idle: 26, w: 14, h: 36, counter: 2, poise: 4,
      script: [['volley', { n: 3, kind: 'orb', col: '#b48cff', speed: 3, gap: 14 }, [1, 3]], ['swings', { n: 2, reach: 52, col: '#e8d8ff' }, [3, 1]], ['lunge', {}, [1, 2]], ['summon', { kind: 'ballastdrone', max: 2, hp: 16, fly: true, p2: true }, [2, 2]]] }
  });
  // balance (the old story-test.js bots, level 8, two kit skills, 10-14 fights each): the masher loses every fight
  // against the Clerk; the careful player wins about 8 in 10 (~25%). The Clerk punishes mashing harder (counter 2 after
  // 4 free hits) because it is light.

  // ================= small machines =================
  // the banner under a zone name: these maps are not on the three old layers
  class Banner {
    constructor(sub, col) { this.sub = sub; this.col = col; }
    update(g) { if (g.banner) { g.banner.sub = this.sub; g.banner.col = this.col; } this.gone = true; }
    draw() {}
  }
  const solidAt = (z, p, x) => z.hit(x - p.w / 2, p.y - p.h + 2, p.w, p.h - 4);
  const push = (z, p, dx) => { if (!solidAt(z, p, p.x + dx)) p.x += dx; };
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
  // the drop bay: a cargo pod hanging on its clamps over the open sky
  const P0 = 8, P1 = 56;
  class Pod {
    constructor() { this.t = 0; }
    update() { this.t++; }
    draw(ctx, cam) {
      const x0 = Math.round(P0 * T - cam.x), x1 = Math.round((P1 + 1) * T - cam.x), y = Math.round(13 * T - cam.y);
      // the pod's hull under the deck
      rect(ctx, '#5a564c', x0 + 6, y + 32, x1 - x0 - 12, 26); rect(ctx, '#76705f', x0 + 6, y + 32, x1 - x0 - 12, 3); rect(ctx, '#d9b45a', x0 + 10, y + 44, x1 - x0 - 20, 2);
      rect(ctx, '#4a463c', x0 + 30, y + 58, x1 - x0 - 60, 10); rect(ctx, '#ff8a3a', x0 + 40, y + 66, 6, 4); rect(ctx, '#ff8a3a', x1 - 46, y + 66, 6, 4);
      // the clamps and the bay above
        rect(ctx, '#e4dfd2', 0, 0, W, Math.round(T - cam.y)); rect(ctx, '#8f8a7c', 0, Math.round(T - cam.y), W, 3);
        [x0 + 10, x1 - 14].forEach(cx => { rect(ctx, '#3a3f4e', cx, Math.round(T - cam.y), 4, y - Math.round(T - cam.y) - 2); rect(ctx, '#d9b45a', cx - 4, y - 8, 12, 4); });
    }
  }

  // ================= the Underside =================
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
      z.save(8, 17, 'glyph');
      z.plat(44, 15, 4).plat(68, 15, 4).plat(96, 15, 3).plat(116, 15, 4);
      z.add(new Gust(58, 80, 1)); z.add(new Gust(108, 126, -1)); z.add(new Gust(32, 54, 1));
      z.enemy('ballastdrone', 20, 10); z.enemy('hullwarden', 46, 17); z.enemy('wisp', 66, 11); z.enemy('hullwarden', 74, 17);
      z.enemy('hullwarden', 92, 17); z.enemy('ballastdrone', 98, 9); z.enemy('wisp', 114, 11); z.enemy('hullwarden', 120, 17); z.enemy('wisp', 136, 10);
      // a relay mast at the far end
      z.prop('relay', 140, 17);
    }
  };
  Z.ducts = {
    name: 'The Cargo Ducts', theme: 'ducts', music: 'underside', w: 140, h: 18,
    build(z, g) {
      z.add(new Banner('THE UNDERSIDE', '#9ad8f0'));
      z.fill(0, 0, 140, 8).ground(0, 139, 14);
      z.spawn('west', 2, 13).spawn('east', 136, 13);
      z.exit(0, 8, 1, 6, 'ballast', 'east'); z.exit(139, 8, 1, 6, 'cargodrop', 'top');
      const fan = (tx, n) => z.add(new Fan(tx, 'dc_f' + n));   // the fans run for good: their off-switches were the story's
      z.save(5, 13, 'glyph'); lamp(z, 9, 13, '#d9b45a');
      z.fill(18, 12, 2, 2).prop('crate', 24, 13);
      fan(32, 1);
      z.enemy('maintunit', 44, 13); z.enemy('wisp', 52, 10); z.fill(48, 12, 3, 2).prop('crate', 58, 13);
      z.save(64, 13, 'glyph');
      fan(72, 2);
      z.enemy('maintunit', 86, 13); z.enemy('ballastdrone', 94, 10); z.enemy('wisp', 100, 10); z.fill(90, 12, 2, 2);
      fan(112, 3);
      z.enemy('maintunit', 124, 13);
    }
  };
  Z.cargodrop = {
    name: 'The Cargo Drop', theme: 'cargo', music: 'underside', w: 64, h: 17,
    build(z, g) {
      z.add(new Banner('THE UNDERSIDE', '#9ad8f0'));
      z.fill(P0, 13, P1 - P0 + 1, 2).fill(P0 - 1, 0, 1, 15).fill(P1 + 1, 0, 1, 15);
      z.spawn('top', 12, 12);
      const pod = z.add(new Pod());
      z.prop('crate', 30, 12).prop('crate', 31, 12).prop('crate', 46, 12).prop('barrel', 20, 12);
      z.thing('door', 52, 12, { prompt: 'Climb back into the ducts', use: gg => gg.gotoZone('ducts', 'east') });
    }
  };

  // ---------- the world map ----------
  D.world.push({ id: 'ballast', name: 'The Underside', layer: 0, x: 180, y: 86 });
  D.routes.push(['skyport', 'ballast'], ['ballast', 'scrapton', 'Cargo Drop']);
  const GROUP = { ducts: 'ballast', cargodrop: 'ballast' };
  const _map = ui.drawMap; ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };
})();

// ---------------------------------------------------------------------------------------------------------------------
// THE TETHER FIELDS (moved from story-roots.js): the Skylift road out of Scrapton runs through a plain of tether anchors,
// the cables as thick as towers slanting up to Aurelia. Halcyon spotter beacons call kite drones on anyone close; the
// Great Tether climbs to the Anchor Crown, where a zipline runs down to the Skylift gate. Its boss, Linewarden Orro, is
// kept as an enemy (his sprites and his zipline drop are in world-deep.js with the Roots').
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, world = SW.world, Z = SW.zones;
  const E = D.enemies, TH = art.themes, W = SW.W;
  if (!world) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring, sh = art.shade;
  const sfx = n => SW.audio.sfx(n);
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16, ROOT = '#7dff9a', SAP = '#b8ff40', SKY = '#6fd3e8';

  // ================= look: themes, music, backdrops, props =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    tether:   theme('surface', { style: 'dirt', a: '#8a6a4a', b: '#76583c', top: '#c8a070', hi: '#f0d8a8', deep: '#3a2818', plat: '#a08a50', sky: ['#5a9ad0', '#f0c890'], mid: 'ruins', midCol: '#6a5038', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#f5c542'] }),
    climb:    theme('sky', { style: 'plate', a: '#6a6e7a', b: '#5a5e6a', top: '#a8acb8', hi: '#e8ecf4', deep: '#2a2e3a', plat: '#d9b45a', sky: ['#4a8ad0', '#c8e0f0'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: SKY, win: ['#d9b45a'] }),
    crown:    theme('sky', { style: 'plate', a: '#7a7468', b: '#6a645a', top: '#c8c0a8', hi: '#ffffff', deep: '#3a362e', plat: '#d9b45a', sky: ['#3a7ac8', '#f0d8b0'], mid: 'clouds', midCol: '#ffffff', bg: 'none', dim: 0, haz: SKY, win: ['#d9b45a'] })
  });
  SW.audio.tracks.tether = { bpm: 108, root: 43, prog: [0, 5, 3, -2], arp: [0, 7, 12, 14, 12, 7, 5, 7], bass: 'square', drums: 0.5 };

  function bakeBackdrops() {
    const paint = (id, fn) => { const cv = SW.canvas(512, 300); fn(cv[1], SW.rng(id.length * 173 + 11)); art.bg['rt_' + id] = cv[0]; TH[id].bg = 'rt_' + id; TH[id].dim = 0; };
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
  const _init = art.init; art.init = function () { _init(); try { bakeBackdrops(); } catch (e) { console.error(e); } };

  const PROPS = {
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

  // ================= enemies and bosses =================
  Object.assign(E, {
    lineman:      { name: 'Halcyon Lineman', sheet: 'lineman', hp: 104, dmg: 15, speed: 1, xp: 36, creds: 16, ai: 'melee', range: 30, aggro: 180, blockEvery: 3, windup: 20, commit: true },
    kitedrone:    { name: 'Kite Drone', sheet: 'kitedrone', hp: 36, dmg: 10, speed: 1.3, xp: 20, creds: 7, ai: 'drone', aggro: 230, fly: true, w: 18, h: 14, shot: '#ff5a3a', anims: { atk: 'zap' } },
    clampcrawler: { name: 'Clamp Crawler', sheet: 'clampcrawler', hp: 104, dmg: 15, speed: 0.6, xp: 36, creds: 9, ai: 'crawler', aggro: 120, armored: true, w: 30, h: 14, contact: true, anims: { atk: 'lunge' } },
    orro: { name: 'LINEWARDEN ORRO', sub: 'Halcyon tether line, anchor crown', sheet: 'orro', sheet2: 'orro2', hp: 1120, dmg: 17, speed: 1.25, xp: 520, creds: 300, idle: 24, w: 14, h: 38, counter: 2, poise: 4,
      script: [['swings', { n: 3, reach: 58, col: SKY }, [3, 1]], ['volley', { n: 3, kind: 'crescent', col: '#ff5a3a', speed: 4, gap: 14 }, [1, 3]], ['slam', { col: SKY }, [2, 2]], ['summon', { kind: 'kitedrone', max: 2, hp: 18, fly: true, p2: true }, [1, 2]]] }
  });

  // ================= small machines =================
  class Banner {
    constructor(sub, col) { this.sub = sub; this.col = col; }
    update(g) { if (g.banner) { g.banner.sub = this.sub; g.banner.col = this.col; } this.gone = true; }
    draw() {}
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

  // ================= THE TETHER FIELDS =================
  Z.tethers = {
    name: 'The Tether Fields', theme: 'tether', music: 'tether', w: 210, h: 26,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.ground(0, 209, 21);
      z.spawn('west', 3, 20).spawn('east', 206, 20);
      z.exit(0, 4, 1, 17, 'scrapton', 'skylift'); z.exit(209, 4, 1, 17, 'tetherclimb', 'bottom');
      // tethers behind everything, rising from their anchor stones
      [[24, 21], [48, 17], [109, 15], [140, 21], [163, 13], [196, 21]].forEach(q => z.add(new Tether(q[0], q[1])));
      // three anchor stones, a spotter beacon on top of each
      z.fill(44, 17, 8, 4).plat(40, 19, 3);
      z.fill(104, 15, 10, 6).plat(98, 19, 3).plat(101, 17, 3);
      z.fill(158, 13, 10, 8).plat(149, 19, 3).plat(152, 17, 3).plat(155, 15, 3);
      // a spotter beacon on top of each anchor stone
      [[48, 17, 1], [109, 15, 2], [163, 13, 3]].forEach(q => z.add(new Beacon(q[0], q[1], 'tf_b' + q[2])));
      [[56, 96, 4, 20, -1, 0], [118, 150, 4, 20, -1, 120], [170, 200, 4, 20, -1, 240]].forEach(q => z.add(new Gust(q[0], q[1], q[2], q[3], q[4], q[5])));
      [12, 34, 70, 132, 182].forEach((x, i) => z.prop(i % 2 ? 'anchorstone' : 'turbine', x, 20, { col: '#5aa86a' }));
      z.prop('banner', 30, 20, { col: '#d9b45a' }).prop('crate', 60, 20).prop('crate', 61, 20).prop('banner', 120, 20, { col: '#d9b45a' }).prop('crate', 176, 20);
      z.enemy('lineman', 30, 20); z.enemy('clampcrawler', 60, 20); z.enemy('kitedrone', 74, 10);
      z.save(88, 20, 'glyph'); z.pickup('item', 91, 20);
      z.enemy('lineman', 96, 20); z.enemy('gunner', 120, 20); z.enemy('clampcrawler', 136, 20);
      z.enemy('lineman', 150, 20); z.enemy('kitedrone', 172, 9); z.enemy('lineman', 182, 20); z.enemy('veilguard', 192, 20);
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
      z.thing('zipline', 67, 15, { prompt: 'Ride the zipline down to the Skylift gate', col: SKY, when: () => !!Z.skylift, use: gg => gg.gotoZone('skylift', 'gate') });
    }
  };

  // ---------- the world map ----------
  D.world.push({ id: 'tethers', name: 'Tether Fields', layer: 1, x: 235, y: 100 });
  D.routes.push(['scrapton', 'tethers']);
  const GROUP = { tetherclimb: 'tethers', anchor: 'tethers' };
  const _map = SW.ui.drawMap; SW.ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };
})();
