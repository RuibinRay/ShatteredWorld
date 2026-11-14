'use strict';
// Shattered Worlds — second expansion data: wind, lava, bomb and ninja heroes, and their unlock achievements.
(function () {
  const D = window.SW.data, H = D.heroes, A = D.abilities, C = D.combat;
  C.swift = C.fist.map((a, i) => Object.assign({}, a, { dur: a.dur - 2, slash: [1, 2, 3, 2][i] }));
  C.dagger = C.blade.map(a => Object.assign({}, a, { dur: a.dur - 2, dmg: a.dmg - 1, box: [a.box[0], a.box[1], a.box[2] - 10, a.box[3]] }));

  H.gale = { name: 'Gale', alias: 'Drifter', title: 'The Boy the Wind Carried', energy: 'Breeze', color: '#7dffb2', colorHi: '#eafff4', element: 'Wind', sig: 'Cyclone',
    sheet: 'gale', sheetAw: 'gale_aw', combo: 'swift', route: 'kael', start: H.kael.start, item: 'Pepper Bun', ult: 'storm', modeKind: 'speed', pitch: 600, need: 'shards_3',
    blurb: 'Never where you expect him.',
    kit: ['wind_blade', 'updraft', 'cyclone', 'magnet_grip', 'tailwind', 'storm_dancer', 'hurricane'], awaken: 'storm_dancer', ultimate: 'hurricane', mode: 'tailwind' };
  H.ashka = { name: 'Ashka', alias: 'Subject 60', title: 'The Furnace Heart', energy: 'Magma', color: '#ff5a1f', colorHi: '#ffd27a', element: 'Lava', sig: 'Molten Wave',
    sheet: 'ashka', sheetAw: 'ashka_aw', combo: 'heavy', route: 'nyra', start: H.nyra.start, item: 'Med-Gel', ult: 'storm', pitch: 300, need: 'level_8',
    blurb: 'The floor is never safe near her.',
    kit: ['magma_glob', 'lava_geyser', 'molten_wave', 'frost_steps', 'meltdown', 'core_form', 'eruption'], awaken: 'core_form', ultimate: 'eruption', mode: 'meltdown' };
  H.dyna = { name: 'Dyna', alias: 'Fuse', title: 'The Weapon Artist', energy: 'Powder', color: '#f5c542', colorHi: '#fff3c0', element: 'Bombs', sig: 'Rocket',
    sheet: 'dyna', sheetAw: 'dyna_aw', combo: 'fist', route: 'kael', start: H.kael.start, item: 'Pepper Bun', ult: 'storm', pitch: 660, need: 'upg_5',
    blurb: 'Every problem is a demolition job.',
    kit: ['grenade', 'mine', 'rocket', 'magnet_grip', 'short_fuse', 'demolition', 'carpet_bomb'], awaken: 'demolition', ultimate: 'carpet_bomb', mode: 'short_fuse' };
  H.vesper = { name: 'Vesper', alias: 'Subject 77', title: 'The Blade at Dusk', energy: 'Shade', color: '#ff4d7a', colorHi: '#ffd0dc', element: 'Ninja', sig: 'Phantom Rush',
    sheet: 'vesper', sheetAw: 'vesper_aw', combo: 'dagger', route: 'nyra', start: H.nyra.start, item: 'Med-Gel', ult: 'storm', modeKind: 'speed', pitch: 520, need: 'vs_win',
    blurb: 'You only see the scarf.',
    kit: ['star_volley', 'smoke_step', 'phantom_rush', 'frost_steps', 'shadow_veil', 'night_form', 'thousand_cuts'], awaken: 'night_form', ultimate: 'thousand_cuts', mode: 'shadow_veil' };
  D.heroOrder = ['kael', 'nyra', 'fenn', 'isolde', 'brakk', 'pyra', 'gale', 'ashka', 'dyna', 'vesper'];

  const AW = 'Awakening: +40% damage and super armour for 15 s.';
  Object.assign(A, {
    wind_blade:    { name: 'Wind Blade', input: 'U', cost: 25, dmg: 13, desc: 'A fast crescent of wind that cuts through up to three enemies. Hold W to aim up.' },
    updraft:       { name: 'Updraft', input: 'S + U', cost: 50, dmg: 12, desc: 'A column of wind in front of you that throws enemies high into the air.' },
    cyclone:       { name: 'Cyclone', input: 'I', cost: 50, dmg: 8, desc: 'A tornado that travels forward, juggling everything it touches. Smashes cracked walls.' },
    tailwind:      { name: 'Tailwind', input: 'S + I', cost: 100, desc: '+25% speed and a flash-step dash for 10 s.' },
    storm_dancer:  { name: 'Storm Dancer', input: 'O (awakening full)', desc: AW },
    hurricane:     { name: 'Hurricane', dmg: 20, desc: 'Ultimate: twin giant tornadoes tear across the whole arena.' },
    magma_glob:    { name: 'Magma Glob', input: 'U', cost: 25, dmg: 14, desc: 'Lob molten rock in an arc. It leaves a burning pool. Hold W for a high lob.' },
    lava_geyser:   { name: 'Lava Geyser', input: 'S + U', cost: 50, dmg: 18, desc: 'Lava erupts from the ground in front of you, launching and burning.' },
    molten_wave:   { name: 'Molten Wave', input: 'I', cost: 50, dmg: 22, desc: 'A wave of lava runs along the ground and leaves a burning trail. Smashes cracked walls.' },
    meltdown:      { name: 'Meltdown', input: 'S + I', cost: 100, desc: '+30% damage for 10 s.' },
    core_form:     { name: 'Core Form', input: 'O (awakening full)', desc: AW },
    eruption:      { name: 'Eruption', dmg: 30, desc: 'Ultimate: the whole floor erupts in lava geysers.' },
    grenade:       { name: 'Grenade', input: 'U', cost: 25, dmg: 18, desc: 'Bounces once, then explodes. Hold W for a high lob.' },
    mine:          { name: 'Proximity Mine', input: 'S + U', cost: 50, dmg: 24, desc: 'Plant a mine that explodes when an enemy steps close. Up to three at once.' },
    rocket:        { name: 'Rocket', input: 'I', cost: 50, dmg: 34, desc: 'A fast rocket with a big blast. Smashes cracked walls.' },
    short_fuse:    { name: 'Short Fuse', input: 'S + I', cost: 100, desc: '+30% damage for 10 s.' },
    demolition:    { name: 'Demolition Mode', input: 'O (awakening full)', desc: AW },
    carpet_bomb:   { name: 'Carpet Bomb', dmg: 15, desc: 'Ultimate: bombs rain across the whole arena.' },
    star_volley:   { name: 'Star Volley', input: 'U', cost: 25, dmg: 6, desc: 'Three fast throwing stars in a fan. Hold W to aim up.' },
    smoke_step:    { name: 'Smoke Step', input: 'S + U', cost: 50, dmg: 16, desc: 'Vanish in smoke and reappear behind the nearest enemy with a cut.' },
    phantom_rush:  { name: 'Phantom Rush', input: 'I', cost: 50, dmg: 9, desc: 'Flash straight through everything in your path, cutting again and again. Smashes cracked walls.' },
    shadow_veil:   { name: 'Shadow Veil', input: 'S + I', cost: 100, desc: '+25% speed and a flash-step dash for 10 s.' },
    night_form:    { name: 'Night Form', input: 'O (awakening full)', desc: AW },
    thousand_cuts: { name: 'Thousand Cuts', dmg: 10, desc: 'Ultimate: appear beside every enemy at once, over and over.' }
  });
  // every ultimate works the same way: W + I with a full energy bar (all three segments), or one segment while awakened
  D.heroOrder.forEach(id => { const u = A[H[id].ultimate]; u.input = 'W + I (full energy)'; u.cost = 100; if (u.desc.indexOf('Ultimate') < 0) u.desc = 'Ultimate: ' + u.desc; u.desc += ' Costs all three bars, or one while awakened.'; });

  Object.assign(D.achievements, {
    shards_3: { name: 'Shard Hunter', desc: 'Find 3 hidden Memory Shards', hero: 'gale' },
    level_8:  { name: 'Seasoned', desc: 'Reach level 8', hero: 'ashka' },
    upg_5:    { name: 'Tinkerer', desc: 'Buy 5 upgrade levels', hero: 'dyna' },
    vs_win:   { name: 'Duelist', desc: 'Win a Versus match against the bot', hero: 'vesper' }
  });
})();
