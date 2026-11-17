'use strict';
// Shattered Worlds — all content lives here as plain data (JSON-shaped): heroes, abilities,
// enemies, combat frames, dialogue, missions, memories, world map. Logic lives in the other files.
(function () {
  const SW = window.SW, D = SW.data = {};

  D.heroes = {
    kael: {
      name: 'Kael', alias: 'Sparks', title: 'The Kid from the Trash', energy: 'Volt', color: '#ffa726', colorHi: '#ffe7a8',
      sheet: 'kael', sheetAw: 'kael_aw', combo: 'fist', start: { zone: 'slums', spawn: 'start' }, item: 'Pepper Bun',
      blurb: 'Wakes in a Deepline trash heap with\nno name, static in his hair and a\nstubbornness he cannot explain.\n\nStarts at the BOTTOM of the world.',
      kit: ['spark_dart', 'thunder_totem', 'breaker_rush', 'magnet_grip', 'overcharge', 'tempest', 'skyfall'], awaken: 'tempest', ultimate: 'skyfall', mode: 'overcharge'
    },
    nyra: {
      name: 'Nyra', alias: 'Subject 31', title: 'Subject 31', energy: 'Resonance', color: '#4fc3f7', colorHi: '#d6f4ff',
      sheet: 'nyra', sheetArmed: 'nyra_b', sheetAw: 'nyra_aw', combo: 'fist', comboArmed: 'blade', start: { zone: 'medlab', spawn: 'start' }, item: 'Med-Gel',
      blurb: 'Wakes in a cracked Halcyon test tank.\nShe sees Husks nobody else can see,\nand she has no blade. Yet.\n\nStarts at the TOP of the world.',
      kit: ['pulse_burst', 'winterline', 'shatterline', 'frost_steps', 'stillwater', 'aurora', 'last_verse'], awaken: 'aurora', ultimate: 'last_verse', mode: 'stillwater'
    }
  };

  D.abilities = {
    double_jump:   { name: 'Second Wind', input: 'K in mid-air', desc: 'Jump once more in mid-air.' },
    spark_dart:    { name: 'Spark Dart', input: 'U', cost: 25, dmg: 14, desc: 'Throw a charged dart. Works in mid-air.' },
    thunder_totem: { name: 'Thunder Totem', input: 'S + U', cost: 50, dmg: 7, desc: 'Plant a totem that zaps nearby enemies for 8 s.' },
    breaker_rush:  { name: 'Breaker Rush', input: 'I', cost: 50, dmg: 30, desc: 'Lightning shoulder-rush. Smashes cracked walls.' },
    magnet_grip:   { name: 'Magnet Grip', input: 'Hold toward a wall', desc: 'Cling to walls and climb them. K to leap off.' },
    overcharge:    { name: 'Overcharge', input: 'S + I', cost: 100, desc: '+30% damage for 10 s. Reveals hidden paths.' },
    tempest:       { name: 'Tempest Form', input: 'O (awakening full)', desc: 'Awakening: +40% damage and super armour for 15 s.' },
    skyfall:       { name: 'Skyfall', input: 'W + I in Tempest Form', cost: 100, dmg: 24, desc: 'Ultimate: lightning hammers every enemy on screen.' },
    pulse_burst:   { name: 'Pulse Burst', input: 'U', cost: 25, dmg: 16, desc: 'Short-range blast of Resonance. Hurts Husks.' },
    winterline:    { name: 'Winterline', input: 'J (upgraded)', desc: 'A blade of sung ice. Longer, stronger combo.' },
    shatterline:   { name: 'Shatterline', input: 'I', cost: 50, dmg: 28, desc: 'A cut that races along the ground. Smashes cracked walls.' },
    frost_steps:   { name: 'Frost Steps', input: 'K in mid-air (x2)', desc: 'Freeze the air underfoot for two extra jumps.' },
    stillwater:    { name: 'Stillwater', input: 'S + I', cost: 100, desc: '+25% speed and a flash-step dash for 10 s.' },
    aurora:        { name: 'Aurora Form', input: 'O (awakening full)', desc: 'Awakening: +40% damage and super armour for 15 s.' },
    last_verse:    { name: 'Last Verse', input: 'W + I in Aurora Form', cost: 100, dmg: 120, desc: 'Ultimate: one cut across the whole screen.' }
  };

  // box = [forward offset, y offset from feet, width, height]
  D.combat = {
    fist: [
      { anim: 'a1', dur: 15, hitAt: 4, hitEnd: 8, box: [4, -30, 26, 18], dmg: 6, kx: 1.4, stun: 18 },
      { anim: 'a2', dur: 15, hitAt: 4, hitEnd: 8, box: [4, -30, 28, 18], dmg: 6, kx: 1.4, stun: 18 },
      { anim: 'a3', dur: 17, hitAt: 5, hitEnd: 9, box: [4, -26, 32, 18], dmg: 8, kx: 2.0, stun: 20 },
      { anim: 'a4', dur: 26, hitAt: 9, hitEnd: 14, box: [2, -38, 36, 36], dmg: 12, kx: 4.6, ky: -3.2, stun: 30, heavy: true, down: true }
    ],
    blade: [
      { anim: 'a1', dur: 15, hitAt: 4, hitEnd: 9, box: [2, -42, 44, 40], dmg: 8, kx: 1.4, stun: 18, slash: 1 },
      { anim: 'a2', dur: 15, hitAt: 4, hitEnd: 9, box: [2, -46, 44, 44], dmg: 8, kx: 1.4, stun: 18, slash: 2 },
      { anim: 'a3', dur: 17, hitAt: 5, hitEnd: 9, box: [6, -30, 48, 14], dmg: 10, kx: 2.4, stun: 20, slash: 3 },
      { anim: 'a4', dur: 28, hitAt: 10, hitEnd: 15, box: [0, -50, 50, 50], dmg: 16, kx: 4.8, ky: -3.4, stun: 30, heavy: true, down: true, slash: 1 }
    ],
    launcher: { anim: 'launcher', dur: 24, hitAt: 6, hitEnd: 12, box: [0, -48, 30, 48], dmg: 8, kx: 0.5, ky: -7.4, stun: 44, launch: true, slash: 2 },
    sweep: { anim: 'sweep', dur: 24, hitAt: 7, hitEnd: 12, box: [2, -12, 36, 12], dmg: 7, kx: 0.8, ky: -3.4, stun: 40, down: true },
    air: [
      { anim: 'air', dur: 13, hitAt: 3, hitEnd: 8, box: [0, -34, 32, 32], dmg: 6, kx: 0.8, ky: -2.2, stun: 24, slash: 1 },
      { anim: 'air', dur: 13, hitAt: 3, hitEnd: 8, box: [0, -34, 32, 32], dmg: 6, kx: 0.8, ky: -2.2, stun: 24, slash: 2 },
      { anim: 'air', dur: 18, hitAt: 5, hitEnd: 11, box: [0, -36, 36, 40], dmg: 10, kx: 2.6, ky: 6, stun: 30, heavy: true, down: true, slash: 1 }
    ]
  };

  D.enemies = {
    thug:     { name: 'Street Thug', sheet: 'thug', hp: 44, dmg: 8, speed: 0.9, xp: 12, creds: 6, ai: 'melee', range: 28, aggro: 150, blockEvery: 3, windup: 24 },
    rat:      { name: 'Sewer Rat', sheet: 'rat', hp: 12, dmg: 5, speed: 1.3, xp: 4, creds: 1, ai: 'hopper', aggro: 130, w: 14, h: 10, contact: true },
    brawler:  { name: 'Pit Brawler', sheet: 'brawler', hp: 60, dmg: 9, speed: 1.1, xp: 20, creds: 12, ai: 'melee', range: 28, aggro: 400, windup: 22, commit: true },
    ganger:   { name: 'Sump Ganger', sheet: 'ganger', hp: 36, dmg: 9, speed: 0.8, xp: 14, creds: 8, ai: 'ranged', range: 150, aggro: 210, cd: 120, shot: '#f5c542' },
    feral:    { name: 'Feral', sheet: 'feral', hp: 28, dmg: 8, speed: 1.8, xp: 12, creds: 3, ai: 'leaper', aggro: 170, w: 16, h: 18, anims: { idle: 'fidle', run: 'frun', jump: 'fleap', atk: 'fatk' } },
    drone:    { name: 'Security Drone', sheet: 'drone', hp: 22, dmg: 5, speed: 1.0, xp: 12, creds: 5, ai: 'drone', aggro: 200, fly: true, w: 18, h: 14, shot: '#ff5a5a' },
    guard:    { name: 'Lab Guard', sheet: 'guard', hp: 48, dmg: 9, speed: 0.9, xp: 14, creds: 8, ai: 'melee', range: 28, aggro: 160, windup: 22 },
    enforcer: { name: 'Halcyon Enforcer', sheet: 'enforcer', hp: 62, dmg: 12, speed: 0.7, xp: 22, creds: 14, ai: 'melee', range: 28, aggro: 170, shield: true, windup: 28, commit: true },
    husk:     { name: 'Husk', sheet: 'husk', hp: 38, dmg: 8, speed: 0.6, xp: 20, creds: 0, ai: 'melee', range: 26, aggro: 220, energyOnly: true, windup: 38 },
    bandit:   { name: 'Scav Bandit', sheet: 'bandit', hp: 60, dmg: 11, speed: 1.0, xp: 20, creds: 10, ai: 'melee', range: 28, aggro: 170, blockEvery: 4, windup: 22, commit: true },
    crawler:  { name: 'Rust Crawler', sheet: 'crawler', hp: 58, dmg: 12, speed: 0.5, xp: 24, creds: 6, ai: 'crawler', aggro: 110, armored: true, w: 30, h: 14, contact: true },
    tusk:     { name: 'TUSK', sub: "Grist's lieutenant", sheet: 'tusk', sheet2: 'tusk2', hp: 460, dmg: 11, speed: 0.9, xp: 90, creds: 60, boss: 'tusk', idle: 30, w: 22, h: 48 },
    warden:   { name: 'WARDEN-01', sub: 'Halcyon security mech', sheet: 'warden', hp: 340, dmg: 10, speed: 0.6, xp: 90, creds: 60, boss: 'warden', idle: 50, w: 44, h: 72, heavy: true },
    grist:    { name: 'GRIST', sub: 'The Rat King', sheet: 'grist', sheet2: 'grist2', hp: 620, dmg: 13, speed: 1.2, xp: 220, creds: 150, boss: 'grist', idle: 26, w: 16, h: 40 },
    brandt:   { name: 'CAPTAIN BRANDT', sub: 'Halcyon Security', sheet: 'brandt', sheet2: 'brandt2', hp: 580, dmg: 13, speed: 1.3, xp: 220, creds: 150, boss: 'brandt', idle: 22, parry: 3, w: 14, h: 36 }
  };

  // speakers: the narrator and the hero; the world files (js/world-*.js), ledger.js and the Hollow Crown add their own
  D.speakers = {
    hero: {}, sys: { name: '' }, kessen: { name: 'Dr. Kessen', sheet: 'kessen', pitch: 500 }
  };

  // line: { s: speaker, t: text, flag, unlock, give: {creds,item,xp}, step: 'MISSION:step', assist, heal, memory, end }
  // The first story's conversations, missions and memories were removed with it; the objects stay for the systems that
  // add their own (ledger.js, finalboss.js, the Hollow Crown's js/saga/).
  D.dialogue = {};

  // main missions. Steps complete in any order; the HUD shows the first unfinished one.
  D.missions = {};

  // major memory shards: flashback + ability
  D.memories = {};

  // world map: 12 zones on 3 layers (x, y on the 480x270 map screen)
  D.world = [
    { id: 'medlab', name: 'Med-Lab Sector 7', layer: 0, x: 70, y: 56 }, { id: 'noble', name: 'Noble Ring', layer: 0, x: 180, y: 56 },
    { id: 'skyport', name: 'Skyport', layer: 0, x: 290, y: 56 }, { id: 'spire', name: 'Halcyon Spire', layer: 0, x: 400, y: 56 },
    { id: 'dunes', name: 'Ash Dunes', layer: 1, x: 70, y: 126 }, { id: 'scrapton', name: 'Rust Flats', layer: 1, x: 180, y: 126 },
    { id: 'glowwild', name: 'Glowwild', layer: 1, x: 290, y: 126 }, { id: 'crater', name: 'The Crater', layer: 1, x: 400, y: 126 },
    { id: 'slums', name: 'Deepline Slums', layer: 2, x: 70, y: 196 }, { id: 'market', name: 'Neon Market', layer: 2, x: 180, y: 196 },
    { id: 'metro', name: 'Old Metro', layer: 2, x: 290, y: 196 }, { id: 'pit', name: 'Pit Arena', layer: 2, x: 180, y: 236 }
  ];
  D.routes = [['metro', 'scrapton', 'Metro Shaft'], ['scrapton', 'skyport', 'Skylift'], ['skyport', 'glowwild', 'Garbage Chute'], ['crater', 'spire', 'Crater Rift'], ['slums', 'market'], ['market', 'metro'], ['market', 'pit'], ['medlab', 'noble'], ['noble', 'skyport'], ['skyport', 'spire'], ['dunes', 'scrapton'], ['scrapton', 'glowwild'], ['glowwild', 'crater']];
  D.layers = [{ name: 'AURELIA - Sky City', col: '#d9b45a' }, { name: 'THE SURFACE', col: '#c8642a' }, { name: 'DEEPLINE - Underground', col: '#ff3ea5' }];

  D.prologue = [
    '2091. The Ashfall War burns the surface in 41 days.',
    'The rich go up, to Aurelia, a city floating on anti-gravity pylons.\nThe poor go down, into the old metro lines. They call it Deepline.',
    '2187. Aurelia is running out of power. Dr. Veyra Kessen builds the\nConvergence Engine to pull energy out of neighbouring dimensions.',
    'The first full-power test tears two other worlds into ours.',
    'Everyone dragged through arrives with nothing.\nNo power. No home. No memory.',
    'Shutting that Engine down is the only way back.'
  ];
})();
