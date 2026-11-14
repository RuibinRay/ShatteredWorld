'use strict';
// Shattered Worlds — zone layouts. Each zone is built with the Zone builder API (tile coordinates;
// a screen is 30 x 17 tiles). build() runs every time the zone is entered, so it can read flags.
(function () {
  const SW = window.SW, Z = SW.zones;
  const neon = (z, x, y, col, o) => z.prop('neon', x, y, Object.assign({ col, glow: col, gy: 7, gr: 20, flicker: (x * 7) % 5 === 0 }, o || {}));
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const NEON = ['#ff3ea5', '#22d3ee', '#f5c542'];

  // ================= DEEPLINE SLUMS (Kael tutorial) =================
  Z.slums = {
    name: 'Deepline Slums', theme: 'slums', music: 'slums', w: 220, h: 23,
    build(z, G) {
      const K = G.route() === 'kael';
      z.ground(0, 219, 20).fill(0, 0, 220, 1);
      // hidden chamber behind a cracked wall at the very start (come back with a wall-breaker)
      z.fill(0, 1, 6, 15).fill(0, 16, 1, 4);
      z.breakable(5, 16, 1, 4, 'w1'); z.shard('slums_b', 2, 19);
      z.spawn('start', 9, 19).spawn('east', 215, 19);
      z.prop('trash', 9, 19).prop('trash', 16, 19).prop('barrel', 13, 19).prop('firebarrel', 21, 19, { glow: '#ff8a3a', gy: 16, gr: 22 });
      z.npc('kid', 14, 19, { name: 'Slum Kid', talk: () => 'm_kid' });
      z.prop('stall', 29, 19, { col: '#c8642a' }); lamp(z, 25, 19); neon(z, 32, 14, '#ff3ea5');
      z.npc('mags', 30, 19, { name: 'Mags', talk: g => (g.flag('arena:slums:tusk') ? 'k_mags3' : g.state.steps['N1-1:mags'] || !K ? 'k_mags2' : 'k_mags1') });
      z.hint(7, 14, 14, 6, 'A / D: move');
      z.hint(24, 14, 10, 6, 'E: talk');
      // rooftops
      z.fill(40, 18, 4, 2).fill(46, 16, 5, 4).plat(53, 14, 4).plat(59, 12, 4);
      z.fill(64, 9, 10, 11).ladder(63, 9, 11).plat(75, 12, 3).plat(79, 15, 3);
      z.hint(37, 12, 12, 8, 'K: jump (hold for height)');
      z.hint(57, 6, 8, 14, 'W / S: climb ladders');
      z.hint(66, 3, 10, 6, 'S + K: drop through thin ledges');
      z.shard('slums_a', 69, 2);
      neon(z, 48, 15, '#22d3ee'); neon(z, 68, 8, '#f5c542'); lamp(z, 44, 17); z.prop('crate', 71, 8).prop('barrel', 66, 8);
      // alley fight
      z.hint(84, 13, 12, 7, 'J: attack - tap for a 4-hit combo\nW + J: launcher   S + J: sweep   hold S: guard');
      z.arena({ id: 'thugs', x0: 84, x1: 110, gy: 19, gh: 7, enemies: [['thug', 97, 19], ['thug', 103, 19], ['thug', 107, 19]] });
      z.prop('stall', 100, 19, { col: '#2a9d8f' }); lamp(z, 88, 19, '#ff3ea5'); lamp(z, 108, 19); neon(z, 94, 13, '#ff3ea5'); z.prop('crate', 92, 19).prop('poster', 105, 17);
      // dash gaps
      z.clear(120, 20, 6, 1).liquid(120, 21, 6, 2).clear(133, 20, 6, 1).liquid(133, 21, 6, 2);
      z.hint(113, 13, 8, 7, 'L: dash. Jump, then dash in mid-air\nto cross the sludge.');
      lamp(z, 117, 19, '#22d3ee'); lamp(z, 129, 19); z.prop('barrel', 128, 19);
      // dart cache + locked bars
      z.prop('trash', 146, 19);
      z.thing('crate', 147, 19, { prompt: 'Search', when: g => !g.has('spark_dart') && K, use: g => g.say('k_darts'), glow: '#ffa726' });
      z.fill(155, 1, 3, 13); z.gate(156, 14, 6, { flag: 'slums_lock', bars: true }); z.target(160, 18, 'slums_lock');
      z.triggers.push({ x: 157 * 16, y: 0, w: 32, h: 400, once: true, fn: g => g.step('N1-1:switch') });
      z.hint(148, 13, 8, 7, 'Hold J + K: charge energy\nU: Spark Dart - shoot the lock');
      // shard + save
      if (K) z.shard('kael_1_s', 167, 18, { memory: 'kael_1', then: 'N1-1:shard' });
      z.save(175, 19, 'glyph'); z.pickup('item', 179, 19);
      z.hint(171, 13, 9, 7, 'E: rest and save at a storm-eye tag\nQ: use a healing item   M: map   Esc: menu');
      lamp(z, 163, 19, '#ffa726'); neon(z, 172, 14, '#22d3ee');
      z.hint(180, 13, 4, 7, 'S + L: Slipstep - blink through an enemy (60 energy).\nIt works even while you are being hit.');
      // Tusk
      z.arena({ id: 'tusk', x0: 184, x1: 213, gy: 19, gh: 9, boss: true, enemies: [['tusk', 206, 19]], intro: K ? 'k_tusk' : null, win: K ? 'k_tusk_win' : null, music: 'boss' });
      lamp(z, 187, 19, '#ff3ea5'); lamp(z, 210, 19, '#ff3ea5'); z.prop('crate', 199, 19).prop('trash', 193, 19);
      z.trigger(214, 10, 2, 10, g => { if (K) g.say('k_pa'); }, { flag: 'slums_pa' });
      z.exit(218, 8, 2, 12, 'market', 'west');
      for (let x = 34; x < 214; x += 17) if (x % 3 === 0) z.prop('barrel', x, 19);
    }
  };

  // ================= MED-LAB SECTOR 7 (Nyra tutorial) =================
  Z.medlab = {
    name: 'Med-Lab Sector 7', theme: 'lab', music: 'lab', w: 272, h: 23,
    build(z, G) {
      const S = G.state.steps;
      z.ground(0, 271, 20).fill(0, 0, 272, 2).fill(0, 2, 1, 18);
      z.spawn('start', 7, 19).spawn('east', 266, 19);
      z.prop('tankb', 6, 19).prop('tank', 11, 19).prop('tank', 15, 19, { col: '#8b5cf6' }).prop('shelf', 24, 19);
      z.hint(4, 13, 12, 7, 'A / D: move');
      z.thing('console', 20, 19, { prompt: 'Use panel', when: () => !S['I1-1:panel'], use: g => g.say('n_panel'), glow: '#22d3ee' });
      z.hint(16, 13, 8, 7, 'E: interact');
      // shelving over the coolant flood
      z.clear(33, 20, 31, 1).liquid(33, 21, 31, 2);
      z.plat(34, 18, 5).plat(40, 16, 5).plat(46, 14, 5).fill(52, 12, 12, 1).ladder(64, 12, 8);
      z.prop('shelf', 36, 17).prop('shelf', 48, 13).prop('console', 57, 11);
      z.hint(28, 12, 10, 8, 'K: jump (hold for height)\nS + K: drop through thin ledges');
      z.hint(60, 5, 6, 8, 'W / S: climb ladders');
      z.shard('medlab_a', 58, 4);
      // drones
      z.hint(66, 13, 10, 7, 'J: attack - tap for a 4-hit combo. Hold S: guard\nDrones swoop down to fire - hit them then');
      z.arena({ id: 'drones', x0: 68, x1: 95, gy: 19, gh: 8, enemies: [['drone', 82, 14, { hp: 16 }], ['drone', 87, 12, { hp: 16 }], ['drone', 91, 15, { hp: 16 }]] });
      z.prop('tank', 74, 19).prop('tank', 79, 19, { col: '#d9b45a' }).prop('console', 90, 19);
      // dash gaps
      z.clear(103, 20, 6, 1).liquid(103, 21, 6, 2).clear(115, 20, 6, 1).liquid(115, 21, 6, 2);
      z.hint(97, 13, 8, 7, 'L: dash. Jump, then dash in mid-air\nto cross the coolant.');
      // husk corridor
      z.fill(131, 2, 20, 12);
      z.trigger(127, 10, 2, 10, g => g.say('n_husk'), { flag: 'medlab_husk' });
      z.arena({ id: 'husk', x0: 131, x1: 150, gy: 19, gh: 6, enemies: [['husk', 144, 19]] });
      z.hint(131, 14, 8, 6, 'Hold J + K: charge energy\nU: Pulse Burst');
      // shard + pod
      z.shard('nyra_1_s', 157, 18, { memory: 'nyra_1', then: 'I1-1:shard' });
      z.save(165, 19, 'pod'); z.pickup('item', 169, 19);
      z.hint(161, 13, 9, 7, 'E: rest and save in a rest pod\nQ: use a healing item   M: map   Esc: menu');
      z.hint(170, 13, 4, 7, 'S + L: Slipstep - blink through an enemy (60 energy).\nIt works even while you are being hit.');
      // Warden-01
      z.arena({ id: 'warden', x0: 174, x1: 205, gy: 19, gh: 10, boss: true, enemies: [['warden', 197, 19]], intro: 'n_warden', win: 'n_warden_win', music: 'boss' });
      // admin wing
      z.thing('poster', 208, 18, { prompt: 'Read', use: g => g.say('n_poster') });
      z.thing('console', 212, 19, { prompt: 'Hack terminal', when: () => !S['I1-2:t1'], use: g => g.say('n_term1'), glow: '#22d3ee' });
      z.enemy('guard', 218, 19); z.fill(221, 14, 9, 1).ladder(220, 14, 6);
      z.thing('console', 225, 13, { prompt: 'Hack terminal', when: () => !S['I1-2:t2'], use: g => g.say('n_term2'), glow: '#22d3ee' });
      z.enemy('drone', 228, 9); z.enemy('enforcer', 233, 19); z.enemy('guard', 239, 19);
      z.thing('console', 243, 19, { prompt: 'Hack terminal', when: () => !S['I1-2:t3'], use: g => g.say(S['I1-2:t1'] && S['I1-2:t2'] ? 'n_term3' : 'n_term_need'), glow: '#22d3ee' });
      z.prop('shelf', 215, 19).prop('tank', 236, 19).prop('shelf', 247, 19);
      // Block C
      z.fill(249, 2, 3, 12).gate(250, 14, 6, { openIf: () => S['I1-2:t1'] && S['I1-2:t2'] && S['I1-2:t3'], col: '#3e5c8a' });
      z.thing('sign', 248, 19, { prompt: 'Block C', when: () => !S['I1-2:t3'], use: g => g.say('n_blockc_locked'), hide: () => true });
      z.prop('cell', 259, 19, { glow: '#8b5cf6', gy: 26, gr: 30 });
      z.npc('thessaly', 259, 19, { name: 'Thessaly', fixed: true, face: -1, talk: g => (g.has('winterline') ? 'n_thessaly2' : 'n_thessaly') });
      z.exit(270, 8, 2, 12, 'skyport', 'west', { need: g => g.has('winterline'), msg: 'Someone is still locked in Block C.' });
    }
  };

  // ================= SKYPORT (Nyra Act 1 boss) =================
  Z.skyport = {
    name: 'Skyport', theme: 'sky', music: 'sky', w: 92, h: 23,
    build(z, G) {
      z.fill(0, 20, 26, 4).fill(31, 20, 15, 4).fill(50, 20, 42, 4);
      z.plat(26, 20, 1).plat(30, 20, 1);
      z.spawn('west', 3, 19);
      z.exit(0, 8, 1, 12, 'medlab', 'east');
      z.trigger(4, 8, 3, 12, g => g.step('I1-5:dock'), { flag: 'sky_dock' });
      for (const x of [6, 18, 36, 56, 84]) z.prop('banner', x, 19, { col: x % 12 ? '#d9b45a' : '#8e2430' });
      lamp(z, 12, 19, '#6fd3e8'); lamp(z, 42, 19, '#6fd3e8'); lamp(z, 70, 19, '#6fd3e8');
      z.prop('pump', 22, 19).prop('crate', 34, 19).prop('crate', 35, 19).prop('chute', 88, 19).prop('cage', 60, 19, { front: true }).prop('cage', 80, 19, { front: true });
      z.enemy('guard', 37, 19); z.enemy('enforcer', 42, 19);
      z.hint(20, 13, 6, 7, 'Jump, then dash (L) across the gap.');
      z.arena({ id: 'brandt', x0: 52, x1: 87, gy: 19, gh: 10, boss: true, enemies: [['brandt', 78, 19]], intro: 's_brandt', win: 's_brandt_win', music: 'boss' });
    }
  };

  // ================= NEON MARKET (hub) =================
  Z.market = {
    name: 'Neon Market', theme: 'market', music: 'market', w: 120, h: 17, safe: true,
    build(z, G) {
      const K = G.route() === 'kael', S = G.state.steps;
      z.ground(0, 119, 14).fill(0, 0, 120, 1);
      z.spawn('west', 3, 13).spawn('east', 116, 13).spawn('pit', 78, 13);
      z.exit(0, 2, 1, 12, 'slums', 'east');
      z.exit(119, 2, 1, 12, 'metro', 'west', { need: g => !K || S['N1-2:ferro'], msg: 'A tunnel guard waves you back: "Old Metro is off limits. Talk to the Cartographer."' });
      // upper walkway
      z.plat(18, 10, 10).plat(34, 8, 8).plat(62, 10, 12).plat(86, 9, 9).fill(46, 11, 6, 3);
      z.shard('market_a', 38, 3);
      const cols = ['#c8642a', '#2a9d8f', '#8b5cf6', '#d83a3a', '#2c6fbf'];
      [8, 22, 54, 68, 92, 106].forEach((x, i) => z.prop('stall', x, 13, { col: cols[i % 5] }));
      [5, 14, 27, 38, 49, 60, 73, 84, 97, 110].forEach((x, i) => neon(z, x, 5 + (i % 3) * 2, NEON[i % 3]));
      [12, 32, 58, 82, 102].forEach((x, i) => lamp(z, x, 13, NEON[(i + 1) % 3]));
      z.prop('stall', 22, 9, { col: '#d83a3a' }).prop('stall', 66, 9, { col: '#2a9d8f' }).prop('barrel', 44, 13).prop('crate', 48, 10).prop('crate', 49, 10);
      z.npc('kid', 16, 13, { name: 'Slum Kid', talk: () => 'm_kid' });
      z.prop('board', 30, 13);
      z.npc('ferro', 33, 13, { name: 'The Cartographer', talk: g => (!K ? 'm_ferro_n' : S['N1-2:ferro'] ? 'm_ferro2' : 'm_ferro1') });
      z.save(42, 13, 'glyph');
      z.npc('quill', 55, 13, { name: 'Madame Quill', talk: () => 'm_quill', prompt: 'Shop' });
      z.prop('screen', 78, 7, { col: '#ff3ea5', glow: '#ff3ea5', gy: 12, gr: 26 });
      z.thing('door', 78, 13, { prompt: 'Enter the Pit', use: g => g.gotoZone('pit', 'door') });
      z.hint(72, 7, 12, 7, 'THE PIT ARENA');
    }
  };

  // ================= PIT ARENA =================
  Z.pit = {
    name: 'Pit Arena', theme: 'arena', music: 'arena', w: 30, h: 17, safe: true,
    build(z, G) {
      z.ground(0, 29, 14).fill(0, 0, 30, 1).fill(0, 1, 1, 13).fill(29, 1, 1, 13);
      z.spawn('door', 3, 13);
      z.thing('door', 2, 13, { prompt: 'Leave', when: g => !g.pit, use: g => g.gotoZone('market', 'pit') });
      z.npc('bookie', 6, 13, { name: 'Bookie', when: g => !g.pit, talk: g => (g.flag('pit_won') ? 'p_bookie_done' : 'p_bookie') });
      z.npc('anvil', 26, 13, { name: 'Anvil', fixed: true, face: -1 });
      [9, 14, 19, 24].forEach(x => z.prop('cage', x, 13, { front: false }));
      z.prop('screen', 10, 5, { col: '#22d3ee', glow: '#22d3ee', gy: 12, gr: 26 }).prop('screen', 20, 5, { col: '#ff3ea5', glow: '#ff3ea5', gy: 12, gr: 26 });
      lamp(z, 4, 13, '#f5c542'); lamp(z, 27, 13, '#f5c542');
      z.add({ update(g, zz) { g.pitTick(zz); }, draw() {} });
    }
  };

  // ================= OLD METRO / THE SUMP =================
  Z.metro = {
    name: 'Old Metro / The Sump', theme: 'metro', music: 'metro', w: 200, h: 33,
    build(z, G) {
      const S = G.state.steps, shaftOpen = g => g.flag('grist_dead') || g.flag('shaft_open');
      z.fill(0, 0, 200, 33);                       // start solid, carve tunnels
      z.clear(1, 2, 119, 12);                      // upper station (floor row 14)
      z.clear(40, 22, 128, 8);                     // lower tunnel (floor row 30)
      z.clear(120, 16, 22, 6);                     // gang camp cave
      z.clear(168, 16, 31, 14);                    // the Sump (boss)
      z.clear(158, 2, 8, 20);                      // metro shaft
      z.clear(47, 14, 1, 8).ladder(47, 14, 16);    // way down from the station
      z.clear(119, 14, 1, 2).ladder(119, 14, 16);  // camp ladder up to the catwalk
      z.spawn('west', 3, 13).spawn('shaft', 161, 3);
      z.exit(0, 2, 1, 12, 'market', 'east');
      // clinic
      z.prop('bed', 12, 13).prop('bed', 16, 13).prop('shelf', 21, 13).prop('train', 32, 13);
      lamp(z, 9, 13, '#7dffa0'); lamp(z, 26, 13);
      z.npc('tamsin', 18, 13, { name: 'Tamsin', talk: g => (!S['N1-4:tamsin'] ? 'o_tamsin1' : S['N1-4:return'] ? 'o_tamsin3' : g.flag('has_crate') ? 'o_tamsin2' : 'o_tamsin_wait') });
      z.save(28, 13, 'glyph');
      // catwalk shortcut back from the camp (switch is on the far side)
      z.fill(58, 2, 1, 6); z.gate(58, 8, 6, { flag: 'metro_short' }); z.target(61, 12, 'metro_short');
      z.enemy('rat', 70, 13); z.enemy('rat', 84, 13); z.enemy('rat', 100, 13); z.prop('train', 92, 13).prop('bones', 76, 13);
      z.hint(50, 8, 7, 6, 'The catwalk is sealed from the far side.');
      // lower tunnel: sludge pools, pipes to hop across
      z.clear(60, 30, 8, 1).liquid(60, 31, 8, 2).plat(62, 28, 4);
      z.clear(84, 30, 9, 1).liquid(84, 31, 9, 2).plat(85, 28, 3).plat(90, 28, 2);
      z.clear(104, 30, 7, 1).liquid(104, 31, 7, 2).plat(106, 28, 3);
      z.fill(72, 28, 8, 2).fill(96, 28, 6, 2);
      z.prop('bones', 54, 29).prop('barrel', 70, 29).prop('barrel', 113, 29);
      lamp(z, 52, 29, '#5cff7a'); lamp(z, 82, 29, '#5cff7a'); lamp(z, 116, 29, '#f5c542');
      z.enemy('rat', 54, 29); z.enemy('feral', 75, 27); z.enemy('feral', 78, 27); z.enemy('feral', 81, 29);
      z.enemy('ganger', 98, 27); z.enemy('feral', 100, 29); z.enemy('feral', 113, 29);
      z.plat(88, 24, 2); z.shard('metro_a', 88, 22);
      // gang camp
      z.prop('firebarrel', 126, 29, { glow: '#ff8a3a', gy: 16, gr: 26 }).prop('tent', 134, 29, { col: '#2b5d5a' }).prop('crate', 139, 29).prop('crate', 140, 29);
      z.plat(128, 25, 5).plat(135, 22, 5);
      z.enemy('thug', 128, 29); z.enemy('ganger', 130, 24); z.enemy('ganger', 137, 21);
      z.thing('medcrate', 138, 21, { prompt: 'Take the medicine', when: g => !g.flag('has_crate'), hide: g => g.flag('has_crate'), use: (g, t) => { g.setFlag('has_crate'); g.step('N1-4:crate'); g.toast('Medicine crate recovered. Take the ladder up - the catwalk leads back.'); SW.audio.sfx('pickup'); }, glow: '#7dffa0' });
      // junction + shaft
      z.enemy('feral', 148, 29); z.enemy('feral', 152, 29);
      z.ladder(161, 4, 26).plat(158, 12, 3).plat(163, 18, 3);
      z.add(new SW.Gate(z, 158 * 16, 21 * 16, 10, { openIf: shaftOpen, horiz: 8 * 16 }));
      z.thing('sign', 156, 29, { prompt: 'Inspect', when: g => !shaftOpen(g), hide: g => shaftOpen(g), use: g => g.say('o_shaft_locked') });
      z.exit(158, 2, 8, 2, 'scrapton', 'hatch');
      lamp(z, 154, 29, '#f5c542'); lamp(z, 166, 29, '#5cff7a');
      // the Sump
      z.arena({ id: 'grist', x0: 169, x1: 198, gy: 29, gh: 9, boss: true, enemies: [['grist', 190, 29]], intro: 'o_grist', win: 'o_grist_win', music: 'boss', onWin: g => g.setFlag('grist_dead') });
      z.prop('bones', 176, 29).prop('bones', 186, 29).prop('trash', 194, 29).prop('firebarrel', 172, 29, { glow: '#5cff7a', gy: 16, gr: 24 }).prop('firebarrel', 196, 29, { glow: '#5cff7a', gy: 16, gr: 24 });
    }
  };

  // ================= RUST FLATS / SCRAPTON =================
  Z.scrapton = {
    name: 'Rust Flats / Scrapton', theme: 'surface', music: 'surface', w: 180, h: 23,
    build(z, G) {
      const K = G.route() === 'kael';
      z.ground(0, 179, 20);
      // gentle dunes and ruins
      z.fill(10, 19, 8, 1).fill(44, 19, 10, 1).fill(47, 18, 4, 1).fill(62, 17, 3, 3).plat(65, 17, 4).fill(72, 15, 4, 5).plat(76, 15, 3)
        .fill(136, 19, 12, 1).fill(140, 18, 5, 1).fill(152, 17, 3, 3).plat(155, 17, 4);
      z.spawn('hatch', 31, 19).spawn('chute', 162, 19);
      z.thing('sign', 4, 19, { prompt: 'Read', use: g => g.toast('WEST: THE ASH DUNES. (Opens in Act 2.)') });
      z.thing('sign', 175, 19, { prompt: 'Read', use: g => g.toast('EAST: THE GLOWWILD. Radiation filter required. (Opens in Act 2.)') });
      z.thing('hatch', 30, 19, { prompt: 'Metro Shaft', use: g => { if (g.flag('grist_dead') || g.flag('shaft_open')) g.gotoZone('metro', 'shaft'); else g.say('r_hatch_n'); } });
      z.prop('trash', 162, 19).prop('trash', 166, 19).prop('chute', 164, 12);
      [22, 58, 84, 126, 150].forEach(x => z.prop('turbine', x, 19));
      z.prop('bones', 40, 19).prop('bones', 68, 19).prop('barrel', 56, 19);
      z.enemy('bandit', 50, 17); z.enemy('crawler', 58, 19); z.enemy('bandit', 68, 19); z.enemy('bandit', 74, 14); z.enemy('crawler', 80, 19);
      z.enemy('bandit', 132, 19); z.enemy('crawler', 142, 17); z.enemy('bandit', 150, 19);
      z.shard('scrap_a', 73, 10); z.shard('scrap_b', 153, 11, { hidden: true });
      // town
      z.prop('banner', 88, 19, { col: '#c8642a' }).prop('banner', 128, 19, { col: '#c8642a' });
      z.prop('tent', 96, 19, { col: '#a8643a' }).prop('cart', 104, 19).prop('tent', 116, 19, { col: '#6a8f4e' }).prop('firebarrel', 110, 19, { glow: '#ff8a3a', gy: 16, gr: 24 }).prop('pump', 122, 19).prop('crate', 100, 19);
      z.save(92, 19, 'glyph');
      z.npc('marlo', 102, 19, { name: 'Marlo', talk: g => (g.state.steps['A2-1:marlo'] ? 'r_marlo2' : 'r_marlo') });
      z.thing('board', 108, 19, { prompt: 'Bounty board', use: g => g.say('r_board') });
      z.npc('odile', 114, 19, { name: 'Odile', talk: () => 'r_odile' });
      z.thing('sign', 124, 19, { prompt: 'Read', use: g => g.toast('SKYLIFT TERMINAL - Aurelia citizens only. Heavily guarded.') });
      z.trigger(86, 6, 2, 14, g => g.step('A2-1:reach'), { flag: 'scrap_reach' }); z.trigger(129, 6, 2, 14, g => g.step('A2-1:reach'), { flag: 'scrap_reach' });
      if (!G.flag('scrap_arrive')) z.trigger(0, 0, 180, 24, g => { g.setFlag('scrap_arrive'); g.step('N1-5:shaft'); g.say(K ? 'r_arrive_k' : 'r_arrive_n'); });
    }
  };
})();
