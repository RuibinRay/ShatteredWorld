'use strict';
// Shattered Worlds — expansion data: four elemental heroes, their abilities, achievements and upgrades.
// Bonus heroes play through Kael's or Nyra's story (`route`); their kit slots line up with that hero's:
// [0] U skill, [1] S+U alt skill, [2] I special (also smashes cracked walls), [3] traversal, [4] S+I mode, [5] awakening, [6] ultimate.
(function () {
  const D = window.SW.data, H = D.heroes, A = D.abilities, C = D.combat;
  Object.assign(H.kael, { route: 'kael', element: 'Lightning', ult: 'storm', pitch: 480, sig: 'Breaker Rush' });
  Object.assign(H.nyra, { route: 'nyra', element: 'Ice blade', ult: 'line', modeKind: 'speed', pitch: 640, sig: 'Shatterline' });

  C.claw = C.fist.map((a, i) => Object.assign({}, a, { slash: [1, 2, 1, 1][i], dmg: a.dmg + 1, box: [a.box[0], a.box[1] - 2, a.box[2] + 4, a.box[3] + 4] }));
  C.heavy = C.fist.map(a => Object.assign({}, a, { dmg: Math.round(a.dmg * 1.4), dur: a.dur + 3, hitAt: a.hitAt + 1, hitEnd: a.hitEnd + 2, kx: a.kx * 1.4, box: [a.box[0], a.box[1] - 4, a.box[2] + 6, a.box[3] + 6] }));
  C.flame = C.fist.map((a, i) => Object.assign({}, a, { slash: [1, 2, 3, 1][i] }));

  H.fenn = { name: 'Fenn', alias: 'Fang', title: 'The Storm Hound', energy: 'Howl', color: '#a78bfa', colorHi: '#ece4ff', element: 'Thunder', sig: 'Thunder Wolf',
    sheet: 'fenn', sheetAw: 'fenn_aw', combo: 'claw', route: 'kael', start: H.kael.start, item: 'Pepper Bun', ult: 'storm', pitch: 400, need: 'act1_kael',
    blurb: 'A hunter from the storm steppe.\nHis lightning runs on four legs.',
    kit: ['chain_bolt', 'thunderclap', 'thunder_wolf', 'magnet_grip', 'wild_hunt', 'storm_pelt', 'pack_howl'], awaken: 'storm_pelt', ultimate: 'pack_howl', mode: 'wild_hunt' };
  H.isolde = { name: 'Isolde', alias: 'Subject 52', title: 'The Winter Falconer', energy: 'Rime', color: '#7fd8ff', colorHi: '#e6fbff', element: 'Ice', sig: 'Ice Bird',
    sheet: 'isolde', sheetAw: 'isolde_aw', combo: 'blade', route: 'nyra', start: H.nyra.start, item: 'Med-Gel', ult: 'storm', modeKind: 'speed', pitch: 700, need: 'act1_nyra',
    blurb: 'She speaks softly and the air\nfreezes to listen.',
    kit: ['ice_shard', 'frost_nova', 'ice_bird', 'frost_steps', 'whiteout', 'glacier_form', 'absolute_zero'], awaken: 'glacier_form', ultimate: 'absolute_zero', mode: 'whiteout' };
  H.brakk = { name: 'Brakk', alias: 'Boulder', title: 'The Mountain That Walks', energy: 'Grit', color: '#c8a05a', colorHi: '#f6e6b8', element: 'Earth', sig: 'Earth Dragon',
    sheet: 'brakk', sheetAw: 'brakk_aw', combo: 'heavy', route: 'kael', start: H.kael.start, item: 'Pepper Bun', ult: 'storm', pitch: 220, need: 'pit_champ',
    blurb: 'Slow to anger, slower to stop.\nThe ground answers when he calls.',
    kit: ['rock_throw', 'quake', 'earth_dragon', 'magnet_grip', 'stoneskin', 'titan_form', 'world_breaker'], awaken: 'titan_form', ultimate: 'world_breaker', mode: 'stoneskin' };
  H.pyra = { name: 'Pyra', alias: 'Subject 44', title: 'The Girl Who Burned the Lab', energy: 'Ember', color: '#ff7043', colorHi: '#ffe0a8', element: 'Fire', sig: 'Fireball',
    sheet: 'pyra', sheetAw: 'pyra_aw', combo: 'flame', route: 'nyra', start: H.nyra.start, item: 'Med-Gel', ult: 'storm', pitch: 560, need: 'combo_20',
    blurb: 'Halcyon tried to bottle a wildfire.\nIt went about as well as you would expect.',
    kit: ['fireball', 'flame_ring', 'sun_flare', 'frost_steps', 'blaze', 'phoenix_form', 'supernova'], awaken: 'phoenix_form', ultimate: 'supernova', mode: 'blaze' };
  D.heroOrder = ['kael', 'nyra', 'fenn', 'isolde', 'brakk', 'pyra'];

  const AW = 'Awakening: +40% damage and super armour for 15 s.';
  Object.assign(A, {
    chain_bolt:    { name: 'Chain Bolt', input: 'U', cost: 25, dmg: 12, desc: 'Lightning that leaps between up to three enemies.' },
    thunderclap:   { name: 'Thunderclap', input: 'S + U', cost: 50, dmg: 16, desc: 'A shockwave around you that paralyses everything it hits.' },
    thunder_wolf:  { name: 'Thunder Wolf', input: 'I', cost: 50, dmg: 13, desc: 'Summon a wolf of lightning that hunts enemies down. Smashes cracked walls.' },
    wild_hunt:     { name: 'Wild Hunt', input: 'S + I', cost: 100, desc: '+30% damage for 10 s.' },
    storm_pelt:    { name: 'Storm Pelt', input: 'O (awakening full)', desc: AW },
    pack_howl:     { name: 'Pack Howl', input: 'W + I awakened', cost: 100, dmg: 24, status: { freeze: 40 }, desc: 'Ultimate: the pack strikes every enemy on screen.' },
    ice_shard:     { name: 'Ice Shards', input: 'U', cost: 25, dmg: 7, desc: 'A fan of three shards that chill what they hit. Hold W to aim up.' },
    frost_nova:    { name: 'Frost Nova', input: 'S + U', cost: 50, dmg: 10, desc: 'Freeze every enemy around you solid.' },
    ice_bird:      { name: 'Ice Bird', input: 'I', cost: 50, dmg: 20, desc: 'A bird of ice that seeks out up to four enemies and freezes them. Smashes cracked walls.' },
    whiteout:      { name: 'Whiteout', input: 'S + I', cost: 100, desc: '+25% speed and a flash-step dash for 10 s.' },
    glacier_form:  { name: 'Glacier Form', input: 'O (awakening full)', desc: AW },
    absolute_zero: { name: 'Absolute Zero', input: 'W + I awakened', cost: 100, dmg: 22, status: { freeze: 150 }, desc: 'Ultimate: the whole screen freezes and shatters.' },
    rock_throw:    { name: 'Boulder Toss', input: 'U', cost: 25, dmg: 18, desc: 'Lob a boulder in an arc. Knocks enemies flat. Hold W for a high lob.' },
    quake:         { name: 'Quake', input: 'S + U', cost: 50, dmg: 14, desc: 'Stomp: shockwaves run both ways along the ground and launch enemies.' },
    earth_dragon:  { name: 'Earth Dragon', input: 'I', cost: 50, dmg: 11, desc: 'A stone dragon erupts and ploughs forward, hitting again and again. Smashes cracked walls.' },
    stoneskin:     { name: 'Stoneskin', input: 'S + I', cost: 100, desc: '+30% damage for 10 s.' },
    titan_form:    { name: 'Titan Form', input: 'O (awakening full)', desc: AW },
    world_breaker: { name: 'World Breaker', input: 'W + I awakened', cost: 100, dmg: 18, desc: 'Ultimate: the ground erupts under every enemy on screen.' },
    fireball:      { name: 'Fireball', input: 'U', cost: 25, dmg: 15, desc: 'Explodes on impact and sets enemies burning. Hold W to aim up.' },
    flame_ring:    { name: 'Flame Ring', input: 'S + U', cost: 50, dmg: 14, desc: 'A ring of fire bursts out around you.' },
    sun_flare:     { name: 'Sun Flare', input: 'I', cost: 50, dmg: 9, desc: 'A slow, huge fireball that burns through everything, then detonates. Smashes cracked walls.' },
    blaze:         { name: 'Blaze', input: 'S + I', cost: 100, desc: '+30% damage for 10 s.' },
    phoenix_form:  { name: 'Phoenix Form', input: 'O (awakening full)', desc: AW },
    supernova:     { name: 'Supernova', input: 'W + I awakened', cost: 100, dmg: 18, status: { burn: 5 }, desc: 'Ultimate: fire rains on every enemy on screen.' }
  });

  // each achievement unlocks one hero (stored in a profile, separate from the save slot)
  D.achievements = {
    act1_kael: { name: 'Out of the Dark', desc: "Finish Act 1 on Kael's story", hero: 'fenn' },
    act1_nyra: { name: 'Down from the Sky', desc: "Finish Act 1 on Nyra's story", hero: 'isolde' },
    pit_champ: { name: 'Rookie Purse', desc: 'Win 3 ranked fights in the Pit Arena', hero: 'brakk' },
    combo_20:  { name: 'Unbroken', desc: 'Land a 20-hit combo', hero: 'pyra' }
  };
  D.unlockHash = 51537;   // hash of the "unlock all heroes" code (ask the author for the code)

  // bought with creds in the pause menu; five levels each
  D.upgrades = [
    { id: 'attack', name: 'Striking', desc: 'Combo damage +8% per level.' },
    { id: 'skill', name: 'Focus', desc: 'Skill damage (U and S + U) +12% per level.' },
    { id: 'special', name: 'Mastery', desc: 'Special and ultimate damage +12% per level.' },
    { id: 'vital', name: 'Vitality', desc: 'Maximum HP +15 per level.' },
    { id: 'flow', name: 'Flow', desc: 'Energy from hits and charging +15% per level.' },
    { id: 'guard', name: 'Bulwark', desc: 'Guarding costs 12% less HP and energy per level.' },
    { id: 'awaken', name: 'Resolve', desc: 'Awakening lasts 2 s longer per level.' }
  ];
  D.upgradeCost = [120, 240, 420, 680, 1000];
})();
