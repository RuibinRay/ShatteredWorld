'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the places and the enemies it adds or picks.
//   The Hidden Village   the one new area: the Hidden Clans' village in the Surface mountains. West to east: the
//                        gate (Garo and Tor), Garo's forge, Taro's ring, the training posts, the Temple of the Last
//                        Toll and Oda's bell. Linked to the Ash Dunes (west) and the Glowwild (east).
//   SG.FOES              who attacks in a chapter's waves, by layer and by part of the story.
//   SG.STAGE             which Versus stage a duel is fought on, by area.
// Only adds to SW.zones and D.world; nothing else in the game changes.
(function () {
  const SW = window.SW, D = SW.data, Z = SW.zones, SG = SW.saga = SW.saga || {};
  if (!Z || !D) return;

  // ================= THE HIDDEN VILLAGE =================
  Z.village = {
    name: 'The Hidden Village', theme: 'vs_clans', music: (Z.scrapton && Z.scrapton.music) || 'slums', w: 150, h: 23,
    build(z) {
      // ground, with the temple's stone steps at the east end
      z.fill(0, 20, 150, 3);
      z.fill(112, 19, 38, 1).fill(118, 18, 32, 1).fill(124, 17, 26, 3);
      // the gate: a wall with a doorway, and a lookout above it
      z.fill(10, 13, 2, 5).plat(6, 12, 10);
      // the forge: a stone hearth platform
      z.plat(30, 16, 6).plat(38, 13, 5);
      // the ring: a low fence of platforms either side and a high post over the middle
      z.plat(58, 17, 4).plat(84, 17, 4).plat(70, 13, 6);
      // the training posts: stepping platforms up and down
      z.plat(94, 16, 3).plat(99, 13, 3).plat(104, 10, 3).plat(108, 14, 3);
      // the bell tower over the temple
      z.plat(134, 11, 8).plat(130, 14, 4);
      z.spawn('west', 3, 19).spawn('east', 146, 16).spawn('gate', 16, 19).spawn('forge', 34, 19).spawn('ring', 72, 19).spawn('temple', 128, 16);
      z.exit(0, 8, 1, 12, 'dunes', 'east');
      z.exit(149, 6, 1, 11, 'glowwild', 'west');
      z.prop('banner', 4, 19, { col: '#ffb060' }).prop('banner', 18, 19, { col: '#ffb060' }).prop('lantern', 8, 11, { col: '#ffb060' }).prop('lantern', 14, 11, { col: '#ffb060' });
      z.prop('tent', 24, 19, { col: '#a0503a' }).prop('firebarrel', 32, 15).prop('barrel', 28, 19).prop('crate', 42, 19).prop('crate', 43, 19).prop('cart', 48, 19);
      z.prop('grassring', 72, 19).prop('stones', 62, 19).prop('stones', 82, 19).prop('lantern', 58, 16, { col: '#ffb060' }).prop('lantern', 87, 16, { col: '#ffb060' });
      z.prop('boulder', 92, 19).prop('tent', 112, 18, { col: '#a0503a' }).prop('lantern', 120, 17, { col: '#ffb060' }).prop('stones', 140, 16).prop('banner', 126, 16, { col: '#d9b45a' }).prop('banner', 146, 16, { col: '#d9b45a' });
      z.prop('lantern', 137, 10, { col: '#ffb060' });
      z.save(52, 19);
    }
  };
  // on the world map, beside the Ash Dunes
  if (D.world && !D.world.some(w => w.id === 'village')) {
    const a = D.world.find(w => w.id === 'dunes'), b = D.world.find(w => w.id === 'glowwild');
    if (a && b) D.world.push({ id: 'village', name: 'Hidden Village', layer: 1, x: Math.round((a.x + b.x) / 2), y: Math.round((a.y + b.y) / 2) + 14 });
  }
  // and reachable from the places on either side of it (only while playing the new story: see saga-core.js)
  SG.LINKS = { dunes: { to: 'village', spawn: 'west', side: 'west' }, glowwild: { to: 'village', spawn: 'east', side: 'east' } };

  // ================= who fights in a chapter =================
  // layer of an area: 0 the Sky, 1 the Surface, 2 Deepline (from the world map, or this table for the areas not on it)
  const LAYER = { medlab: 0, cryo: 0, stacks: 0, armoury: 0, furnace: 0, range: 0, shrine: 0, ballast: 0, skyport: 0, skylift: 0, noble: 0, hydro: 0,
    archive: 0, ward: 0, pylon: 0, gallery: 0, blank: 0, spire: 0, enginecore: 0, ducts: 0, cargodrop: 0,
    milezero: 1, saloon: 1, icehouse: 1, dunes: 1, meridian: 1, sinkhole: 1, glowwild: 1, scrapton: 1, crater: 1, glasssea: 1, lensworks: 1,
    tethers: 1, tetherclimb: 1, anchor: 1, village: 1, pens: 1, dig: 1, hollow: 1,
    slums: 2, yard: 2, core: 2, works: 2, docks: 2, dojo: 2, metro: 2, pit: 2, market: 2, shafts: 2, waterworks: 2, hollows: 2, breach: 2,
    choir: 2, rootways: 2, rootstair: 2, heartroot: 2, platform: 2 };
  SG.layerOf = id => (LAYER[id] !== undefined ? LAYER[id] : ((D.world || []).find(w => w.id === id) || { layer: 1 }).layer);
  // [ordinary, tougher, captain] per layer; part 1 is Halcyon's hunt (chapters 1-3), part 2 the war (chapter 4),
  // part 3 the Hollow Legion (chapters 5-6: its own soldiers once they exist, Husks and veil troops until then)
  SG.FOES = {
    1: [
      { basic: ['guard', 'drone', 'hazmat', 'guard'], tough: ['enforcer', 'gunner'], cap: ['elitegd', 'eliteenf'] },
      { basic: ['raider', 'bandit', 'scavenger', 'drone', 'feral'], tough: ['crawler', 'gunner', 'enforcer'], cap: ['elitegd', 'eliteenf'] },
      { basic: ['thug', 'ganger', 'rat', 'cablerat', 'guard'], tough: ['brawler', 'enforcer', 'brute'], cap: ['eliteenf', 'elitegd'] }
    ],
    2: [
      { basic: ['guard', 'veilguard', 'drone', 'gunner'], tough: ['enforcer', 'veilenf'], cap: ['eliteenf', 'elitegd'] },
      { basic: ['guard', 'digcrew', 'digdrone', 'gunner'], tough: ['enforcer', 'veilguard', 'lineman'], cap: ['eliteenf', 'elitegd'] },
      { basic: ['guard', 'tapcrew', 'tapdrone', 'gunner', 'ledgerman'], tough: ['enforcer', 'veilguard', 'brute'], cap: ['eliteenf', 'elitegd'] }
    ],
    3: [
      { basic: ['husk', 'glasshusk', 'elitedrone', 'husk'], tough: ['veilguard', 'veilenf'], cap: ['eliteenf'] },
      { basic: ['husk', 'glasshusk', 'elitedrone', 'mirage'], tough: ['veilguard', 'veilenf', 'clampcrawler'], cap: ['eliteenf'] },
      { basic: ['husk', 'glasshusk', 'elitedrone', 'husk'], tough: ['veilguard', 'veilenf', 'rootknot'], cap: ['eliteenf'] }
    ]
  };
  SG.partOf = n => (n <= 3 ? 1 : n <= 5 ? 2 : 3);   // 5: the Engine Core (Halcyon's last guard); 6-7: the Legion
  // the waves of a chapter: lists of [kind, n] ('basic' | 'tough' | 'cap')
  SG.WAVES = {
    1: [[['basic', 3]], [['basic', 3], ['tough', 1]]],
    2: [[['basic', 3], ['tough', 1]], [['basic', 2], ['tough', 1], ['cap', 1]]],
    4: [[['basic', 4]], [['basic', 3], ['tough', 2]], [['basic', 3], ['tough', 1], ['cap', 1]]],
    5: [[['basic', 4], ['tough', 1]], [['basic', 3], ['tough', 2], ['cap', 1]]],   // the Engine Core: Halcyon's last guard, before the Convergence
    7: [[['basic', 5], ['tough', 2]], [['basic', 5], ['tough', 2], ['cap', 1]]]     // the Crater: the Legion's host, before Itsuki
  };
  // the rescues (js/saga/saga-rescue.js), by kind: the guards around a Called hero, the wave before a champion, the
  // three waves fought beside a hero, and the two before a Siege Walker
  SG.RESCUE_WAVES = {
    called: [[['basic', 3], ['tough', 1]]],
    champion: [[['basic', 4], ['tough', 1]]],
    legion: [[['basic', 4]], [['basic', 4], ['tough', 1]], [['basic', 3], ['tough', 2], ['cap', 1]]],
    walker: [[['basic', 4]], [['basic', 3], ['tough', 2]]]
  };

  // ================= where a duel is fought =================
  // the area's own look (its theme) unless a Versus stage was built for that place
  SG.STAGE = { noble: 'sw_noble', skylift: 'sw_skylift', ballast: 'sw_ballast', glasssea: 'sw_glass', platform: 'sw_zero', enginecore: 'sw_engine',
    tethers: 'sw_tether', heartroot: 'sw_roots', rootways: 'sw_roots', crater: 'vs_crater', spire: 'vs_spire', village: 'vs_clans', anchor: 'sw_tether', tetherclimb: 'sw_tether' };
  SG.stageFor = function (zone) {
    const art = SW.art, s = SG.STAGE[zone] || (Z[zone] && Z[zone].theme);
    return s && art.themes[s] ? s : 'vs_crater';
  };
})();
