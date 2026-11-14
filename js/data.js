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

  D.speakers = {
    hero: {}, sys: { name: '' },
    mags: { name: 'Mags', sheet: 'mags', pitch: 380 }, kid: { name: 'Slum Kid', sheet: 'kid', pitch: 760 },
    ferro: { name: 'The Cartographer', sheet: 'ferro', pitch: 300 }, quill: { name: 'Madame Quill', sheet: 'quill', pitch: 560 },
    tamsin: { name: 'Tamsin', sheet: 'tamsin', pitch: 600 }, bookie: { name: 'Bookie', sheet: 'bookie', pitch: 450 },
    anvil: { name: 'Anvil', sheet: 'anvil', pitch: 220 }, marlo: { name: 'Marlo', sheet: 'marlo', pitch: 280 },
    odile: { name: 'Odile', sheet: 'odile', pitch: 620 }, thessaly: { name: 'Thessaly', sheet: 'thessaly', pitch: 420 },
    wren: { name: 'Wren', sheet: 'wren', pitch: 700 }, corvane: { name: 'Magistrate Corvane', sheet: 'corvane', pitch: 260 },
    brandt: { name: 'Captain Brandt', sheet: 'brandt', pitch: 330 }, tusk: { name: 'Tusk', sheet: 'tusk', pitch: 180 },
    grist: { name: 'Grist', sheet: 'grist', pitch: 240 }, kessen: { name: 'Dr. Kessen', sheet: 'kessen', pitch: 500 }
  };

  // line: { s: speaker, t: text, flag, unlock, give: {creds,item,xp}, step: 'MISSION:step', assist, heal, memory, end }
  D.dialogue = {
    // ----- Kael / Deepline -----
    k_wake: [
      { s: 'sys', t: 'Deepline. The city under the city. Ninety years of rust, neon and people the sky threw away.' },
      { s: 'kid', t: "He's moving! Trash-heap guy is ALIVE!" },
      { s: 'hero', t: '...Where is this? Who... who am I?' },
      { s: 'kid', t: 'Dunno! You dropped out of a sky-pipe three nights back. Your hair crackles when you sleep. We call you Sparks.' },
      { s: 'kid', t: 'Mags has been feeding you. Go say thanks - her bun stall is just east. Move with A and D.' }
    ],
    k_mags1: [
      { s: 'mags', t: 'On your feet at last. Sit. Eat. Pepper bun, straight off the steamer.' },
      { s: 'hero', t: "(It's hot. It's good. I know this taste... why am I crying?)" },
      { s: 'mags', t: "That one's on credit, Sparks. Here, take a spare for the road. Press Q when you need it.", give: { item: 1 } },
      { s: 'mags', t: "Tusk's crew shake my stall down every week. Three of them are waiting past the rooftops. I can't pay." },
      { s: 'mags', t: "You don't know who you are. But I watched you get up. Go and see what your hands remember.", step: 'N1-1:mags' }
    ],
    k_mags2: [{ s: 'mags', t: 'Rooftops are east. Jump with K. Drop through a ledge with S + K. Mind the long fall.' }],
    k_mags3: [{ s: 'mags', t: "Tusk is DOWN? Ha! Buns are free for you, Sparks. For a week. Maybe two.", heal: true }],
    k_darts: [
      { s: 'hero', t: 'Throwing darts, buried in the junk. My hand already knows the weight.' },
      { s: 'hero', t: "(They hum when I hold them. Something in me is... charged.)", unlock: 'spark_dart', energy: 300 },
      { s: 'sys', t: 'SPARK DART - press U to throw (costs 25 Volt).\nHold J + K to charge Volt. Landing hits charges it too.', step: 'N1-1:darts' }
    ],
    k_tusk: [
      { s: 'grist', t: "So this is the stray that crawled out of my trash and broke three of my collectors." },
      { s: 'hero', t: "The stall's closed for collections." },
      { s: 'grist', t: "Tusk. Put him back in the heap. I have a shaft to run." },
      { s: 'tusk', t: "With pleasure, boss.", fn: 'boss_start' },
      { s: 'sys', t: 'Hold S to GUARD. When he flashes white, get ready - and DASH (L) through his charge.' }
    ],
    k_tusk_win: [
      { s: 'kid', t: 'SPARKS BEAT TUSK! Did you see that?! He did the lightning thing!' },
      { s: 'hero', t: "(My name is Kael. I'll tell them later. 'Sparks' isn't so bad.)" },
      { s: 'kid', t: "The old Cartographer in the Neon Market has been asking about you. Go east - follow the storm-eye tags.", step: 'N1-1:tusk' }
    ],
    k_pa: [{ s: 'sys', t: 'PUBLIC NOTICE FROM AURELIA: "Halcyon Ascendancy seeks escaped SUBJECT 31. Dangerous. Reward: full citizenship."' }, { s: 'hero', t: "(Subject 31. Someone up there fell out of the sky too.)" }],
    // ----- Neon Market -----
    m_ferro1: [
      { s: 'ferro', t: "So the tags led you here. I painted them - the storm-eye, the old mark of Vharra. Our mark, boy." },
      { s: 'hero', t: 'Vharra. The grass. The thunderheads. I saw it in the shard.' },
      { s: 'ferro', t: "When the sky tore, it did not only take our home. It shredded what we WERE - memory, power - into Memory Shards." },
      { s: 'ferro', t: "Find them and you find yourself. The Pit pays in creds and rumours: win three ranked fights and people will talk to you.", step: 'N1-2:ferro' },
      { s: 'ferro', t: "And know this: Grist the Rat King holds the only shaft to the surface. You are not ready for the Sump. Yet." }
    ],
    m_ferro_n: [
      { s: 'ferro', t: "You carry frost on you, girl. Not one of mine - Ilmaren, yes? Another world the sky swallowed." },
      { s: 'ferro', t: "A white-haired boy came through here. Stubborn as weather. If you meet him - you are hunting the same people." }
    ],
    m_ferro2: [{ s: 'ferro', t: "The shards hum when you are near. Listen for them. The world is wider than these tunnels." }],
    m_quill: [{ s: 'quill', t: "Madame Quill's. Everything here fell off a maglev. No refunds, no questions.", fn: 'shop' }],
    m_kid: [{ s: 'kid', t: "The Pit's through the red door. Anvil's the champ. Nobody's ever knocked him down." }],
    // ----- Pit Arena -----
    p_bookie: [{ s: 'bookie', t: "Fresh meat! Three ranked wins gets you the rookie purse. Step in the cage?", choice: [{ t: 'Fight', fn: 'pit_start' }, { t: 'Not yet' }] }],
    p_bookie_done: [{ s: 'bookie', t: "Rookie purse is paid, champ-in-waiting. Higher tiers open when the Pit reopens next season.", choice: [{ t: 'Spar anyway', fn: 'pit_start' }, { t: 'Leave' }] }],
    p_win_k: [
      { s: 'bookie', t: "THREE FOR THREE! Rookie purse: 500 creds. Don't spend it all on buns.", give: { creds: 500 } },
      { s: 'anvil', t: "You fight like someone with something to remember. I know that stubbornness. Don't know from where." },
      { s: 'anvil', t: "Found this in the cage sand after my first title. It never hummed for me. It's humming now.", memory: 'kael_2', step: 'N1-3:wins' }
    ],
    p_win_n: [
      { s: 'bookie', t: "THREE FOR THREE! Rookie purse: 500 creds. The crowd likes the cold one.", give: { creds: 500 } },
      { s: 'anvil', t: "You move like you're listening to something the rest of us can't hear. Keep listening.", give: { xp: 80 } }
    ],
    // ----- Old Metro -----
    o_tamsin1: [
      { s: 'tamsin', t: "Easy - you're bleeding on my floor. Sit still.", heal: true },
      { s: 'tamsin', t: "I'm Tamsin. I patch up half of Deepline with whatever I can scrounge." },
      { s: 'tamsin', t: "Grist's gangers dragged my medicine crate into the flooded tunnels. Without it, the clinic closes." },
      { s: 'tamsin', t: "Bring it back and I'll keep you standing for as long as you keep picking fights.", step: 'N1-4:tamsin' }
    ],
    o_tamsin_wait: [{ s: 'tamsin', t: "The crate is east, past the dead trains. Watch the green water - it bites.", heal: true }],
    o_tamsin2: [
      { s: 'tamsin', t: "You got it back. All of it. Hold still, let me look at that arm." },
      { s: 'sys', t: 'She hums while she works. An old tune. You know the next line before she sings it.' },
      { s: 'tamsin', t: "...How do you know that song? That's a Vharran cradle-song. Nobody down here -" },
      { s: 'hero', t: "I don't know. I just do." },
      { s: 'tamsin', t: "Then we're from the same sky. Call me when it gets bad out there, Sparks. I'll come running.", assist: 'tamsin', step: 'N1-4:return' },
      { s: 'sys', t: 'ASSIST unlocked: TAMSIN. Press O to call her - she heals you. 20 s cooldown.' }
    ],
    o_tamsin3: [{ s: 'tamsin', t: "Clinic's open. Sit down, you look terrible.", heal: true }],
    o_grist: [
      { s: 'grist', t: "You climbed out of my trash. You broke my Tusk. Now you stand in my Sump." },
      { s: 'grist', t: "Everything that goes UP pays me. And you have nothing left to pay with but bones.", fn: 'boss_start' }
    ],
    o_grist_win: [
      { s: 'grist', t: "...The shaft... is yours. It was only ever... a way out." },
      { s: 'sys', t: 'Something bright is lodged in the wall behind his throne. It has been waiting.', memory: 'hero_3', step: 'ACT1:boss' }
    ],
    o_shaft_locked: [{ s: 'sys', t: "A heavy hatch seals the Metro Shaft. A rat-skull crest is welded over the lock. Grist's." }],
    // ----- Nyra / Med-Lab -----
    n_wake: [
      { s: 'sys', t: 'Aurelia. The city above the clouds. Med-Lab Sector 7, property of the Halcyon Ascendancy.' },
      { s: 'hero', t: '(Glass. Cold. Alarms. I do not know this place. I do not know ME.)' },
      { s: 'wren', t: "- can you hear me? Subject 31? Don't answer. Just move. A and D." },
      { s: 'wren', t: "There's a wall panel to your right. Get to it and press E. I'll explain when you're not standing in a puddle." }
    ],
    n_panel: [
      { s: 'wren', t: "There you are. I'm Wren. I live in the walls - don't think about it too hard." },
      { s: 'wren', t: "Halcyon fished you out of a tear in the sky and bottled you like a battery. I want to know why." },
      { s: 'wren', t: "Take this med-gel from the dispenser. Press Q to use it.", give: { item: 1 } },
      { s: 'wren', t: "The floor east of you is flooding with coolant. Climb the shelving: K jumps, S + K drops through a ledge.", step: 'I1-1:panel' }
    ],
    n_husk: [
      { s: 'wren', t: "Something is in that corridor. My cameras show nothing. But you're staring right at it." },
      { s: 'hero', t: '(A white mask. Empty eyes. Nobody else can see them. My hand - it is GLOWING.)', unlock: 'pulse_burst', energy: 300 },
      { s: 'sys', t: 'PULSE BURST - press U (costs 25 Resonance). Fists pass straight through a Husk.\nHold J + K to charge Resonance.', step: 'I1-1:burst' }
    ],
    n_warden: [
      { s: 'brandt', t: "Subject 31 is out of its bottle. Disappointing." },
      { s: 'brandt', t: "Warden-01: contain. I want it intact - the Engine does not run on corpses.", fn: 'boss_start' },
      { s: 'sys', t: 'Hold S to GUARD. Watch for the red aiming line: JUMP the low beam, stay down for the high one.' }
    ],
    n_warden_win: [
      { s: 'wren', t: "You just scrapped a Warden with your bare hands. I'm updating my threat model." },
      { s: 'wren', t: "The admin wing is ahead. Three terminals. Plug me into each (E) and I can open Block C.", step: 'I1-1:warden' }
    ],
    n_term1: [{ s: 'sys', t: 'FILE: SUBJECT 31. Origin: ILMAREN (extra-dimensional). Resonance output 400% of baseline.\nRecommended use: POWER SOURCE.', step: 'I1-2:t1' }],
    n_term2: [{ s: 'sys', t: 'FILE: CONVERGENCE ENGINE. First full-power test tore two worlds into ours.\nSECOND PULSE: charging. Projected result: permanent merge. Donor worlds drained.', step: 'I1-2:t2' }],
    n_term3: [
      { s: 'sys', t: "FILE: BLOCK C. Captive 'Tidesinger'. Output stable. DO NOT OPEN.", step: 'I1-2:t3' },
      { s: 'wren', t: "That's three. I'm in. I can scramble their guards for you now - press O when you're cornered.", assist: 'wren' },
      { s: 'sys', t: 'ASSIST unlocked: WREN. Press O - she stuns every enemy on screen. 20 s cooldown.' }
    ],
    n_term_need: [{ s: 'wren', t: "Not yet - I need the other two terminals first. One is back near the Warden's hall, one is up on the catwalk." }],
    n_poster: [{ s: 'sys', t: "A notice on the wall: WANTED IN DEEPLINE - agitator known as 'SPARKS'. White hair, red scarf. Assaulted licensed collectors." }, { s: 'hero', t: '(Someone down there is giving them trouble too.)' }],
    n_blockc_locked: [{ s: 'wren', t: "Block C is sealed. I need all three admin terminals first." }],
    n_thessaly: [
      { s: 'thessaly', t: "Child of the ice... I do not know your face. But I know your note." },
      { s: 'hero', t: "They're draining you." },
      { s: 'thessaly', t: "To feed their Engine. There is little of me left. Better that it sings in your hand than in their machine." },
      { s: 'sys', t: 'She sings one long, cold note. Coolant climbs out of the cell wall and hardens in your grip.', memory: 'nyra_2', step: 'I1-3:free' },
      { s: 'thessaly', t: "Go. The docks. In this city the only way out is DOWN." }
    ],
    n_thessaly2: [{ s: 'thessaly', t: "Do not wait for me. A song does not need its singer to be carried." }],
    // ----- Skyport -----
    s_brandt: [
      { s: 'brandt', t: "End of the line, Subject 31. The Skylift does not run for runaways." },
      { s: 'hero', t: "Then I'll find another way down." },
      { s: 'brandt', t: "You'll find the floor.", fn: 'boss_start' }
    ],
    s_brandt_win: [
      { s: 'brandt', t: "...Magistrate. I had it contained -" },
      { s: 'corvane', t: "Enough, Captain. The board does not chase strays across its own docks." },
      { s: 'corvane', t: "You carry a stolen song, girl. Carry it somewhere lower." },
      { s: 'sys', t: 'The deck opens beneath you. The Garbage Chute swallows the sky.', memory: 'hero_3', step: 'ACT1:boss', fn: 'chute' }
    ],
    // ----- Scrapton -----
    r_arrive_k: [{ s: 'sys', t: 'Sunlight. Real, dusty, orange sunlight.' }, { s: 'hero', t: "(There's a city. In the SKY.)" }],
    r_arrive_n: [{ s: 'sys', t: 'You hit a mountain of scrap, then sand. The sky you fell from is a shadow far above.' }, { s: 'hero', t: '(I fell out of the world. And I lived.)' }],
    r_marlo: [
      { s: 'marlo', t: "Easy, stranger. Scrapton's caravans take in anyone who walks out of the Flats alive." },
      { s: 'marlo', t: "Name's Marlo. That shadow up there is Aurelia. Everything down here is what it threw away. Us included." },
      { s: 'marlo', t: "Odile will see to your cuts. When you can stand up straight, the bounty board always has work.", step: 'A2-1:marlo', fn: 'slice_end' }
    ],
    r_marlo2: [{ s: 'marlo', t: "West is the Ash Dunes. East, the Glowwild. Neither one is safe, which is why the pay is good." }],
    r_odile: [{ s: 'odile', t: "Hold still. ...There. You're not from here either, are you? It's all right. Hardly anyone is.", heal: true }],
    r_board: [{ s: 'sys', t: 'BOUNTY BOARD. Jobs for the Ash Dunes and the Glowwild are pinned here.\n(Act 2 opens in the next build.)' }],
    r_hatch_n: [{ s: 'sys', t: "An old metro shaft, sealed from below. You cut the rat-skull lock off the hatch. Something down there smells of neon and noodles.", flag: 'shaft_open' }]
  };

  // main missions. Steps complete in any order; the HUD shows the first unfinished one.
  D.missions = {
    'N1-1': { title: 'Trash and Buns', hero: 'kael', xp: 60, creds: 40, next: 'N1-2', steps: [
      { id: 'mags', t: 'Talk to Mags at the bun stall (E)' }, { id: 'thugs', t: 'Beat the three collectors (J)', n: 3 },
      { id: 'darts', t: 'Search the junk pile past the gaps' }, { id: 'switch', t: 'Hit the lock through the bars (U)' },
      { id: 'shard', t: 'Touch the Memory Shard' }, { id: 'tusk', t: 'Defeat Tusk' }] },
    'N1-2': { title: 'The Storm-Eye Tags', hero: 'kael', xp: 40, creds: 0, next: 'N1-3', steps: [{ id: 'ferro', t: 'Find the Cartographer in the Neon Market' }] },
    'N1-3': { title: 'Pit Rookie', hero: 'kael', xp: 120, creds: 0, next: 'N1-4', steps: [{ id: 'wins', t: 'Win 3 ranked fights in the Pit Arena' }] },
    'N1-4': { title: 'Medicine in the Dark', hero: 'kael', xp: 120, creds: 60, next: 'N1-5', steps: [
      { id: 'tamsin', t: "Find Tamsin's clinic in the Old Metro" }, { id: 'crate', t: 'Recover the medicine crate' }, { id: 'return', t: 'Bring the crate back to Tamsin' }] },
    'N1-5': { title: 'The Rat King', hero: 'kael', xp: 200, creds: 100, next: 'A2-1', steps: [{ id: 'boss', t: 'Defeat Grist in the Sump', alias: 'ACT1:boss' }, { id: 'shaft', t: 'Climb the Metro Shaft to the surface' }] },
    'I1-1': { title: 'Wake Protocol', hero: 'nyra', xp: 60, creds: 40, next: 'I1-2', steps: [
      { id: 'panel', t: 'Reach the wall panel and press E' }, { id: 'drones', t: 'Destroy the security drones (J)', n: 3 },
      { id: 'burst', t: 'Get past the thing in the corridor' }, { id: 'shard', t: 'Touch the Memory Shard' }, { id: 'warden', t: 'Defeat Warden-01' }] },
    'I1-2': { title: 'Voice in the Wire', hero: 'nyra', xp: 100, creds: 60, next: 'I1-3', steps: [
      { id: 't1', t: 'Hack admin terminal 1 (E)' }, { id: 't2', t: 'Hack admin terminal 2 (E)' }, { id: 't3', t: 'Hack admin terminal 3 (E)' }] },
    'I1-3': { title: 'The Prisoner in Block C', hero: 'nyra', xp: 120, creds: 0, next: 'I1-5', steps: [{ id: 'free', t: 'Reach the captive in Block C' }] },
    'I1-5': { title: "The Captain's Deck", hero: 'nyra', xp: 200, creds: 100, next: 'A2-1', steps: [{ id: 'dock', t: 'Reach the Skyport docks' }, { id: 'boss', t: 'Defeat Captain Brandt', alias: 'ACT1:boss' }] },
    'A2-1': { title: 'Scrapton', hero: 'both', xp: 150, creds: 100, next: null, steps: [{ id: 'reach', t: 'Reach the town of Scrapton' }, { id: 'marlo', t: 'Speak with Marlo, the caravan boss' }] }
  };

  // major memory shards: flashback + ability
  D.memories = {
    kael_1: { title: 'The Boy and the Storm', img: 'mem_kael', unlock: 'double_jump', name: true, lines: [
      'Grass to the horizon. Thunderheads stacked like mountains.', 'A boy runs ahead of the storm, laughing. The lightning never touches him.',
      'Someone calls a name from the camp, over and over.', '...Kael.', 'My name is Kael.'] },
    kael_2: { title: 'The Standing Stones', img: 'mem_kael', unlock: 'thunder_totem', lines: [
      'A ring of stones, humming before the rain.', 'An old woman plants a carved stake in the earth - and the lightning OBEYS her.', '"You do not chase the storm, Kael. You give it somewhere to land."'] },
    kael_3: { title: 'The Night the Sky Tore', img: 'mem_kael', unlock: 'breaker_rush', lines: [
      'The sky over the camp split like wet cloth. Violet light. Screaming.', 'You stood at the edge and drove your whole body through the storm wall.', 'It did not stop the tear. But everyone behind you had time to run.'] },
    nyra_1: { title: 'The Frozen Harbour', img: 'mem_nyra', unlock: 'double_jump', name: true, lines: [
      'A harbour locked in ice. Ships asleep in the floes.', 'A woman at a forge of blue fire sings one long note - and a blade rises out of the sea.',
      'She turns. She is smiling. She says a name.', '...Nyra.', 'My name is Nyra.'] },
    nyra_2: { title: "The Smith's Note", img: 'mem_nyra', unlock: 'winterline', lines: [
      'Every Tidesinger blade is one held note, frozen.', 'Yours was sung the winter you were born. It was waiting for your hand.', 'This one is borrowed. It is enough. WINTERLINE.'] },
    nyra_3: { title: 'One Cut', img: 'mem_nyra', unlock: 'shatterline', lines: [
      'Falling. Wind. The sky shrinking above you.', 'The blade remembers before you do: one cut, drawn along the ground.', 'The ice runs ahead of you like a lit fuse.'] }
  };

  // world map: 12 zones on 3 layers (x, y on the 480x270 map screen)
  D.world = [
    { id: 'medlab', name: 'Med-Lab Sector 7', layer: 0, x: 70, y: 56 }, { id: 'noble', name: 'Noble Ring', layer: 0, x: 180, y: 56, soon: true },
    { id: 'skyport', name: 'Skyport', layer: 0, x: 290, y: 56 }, { id: 'spire', name: 'Halcyon Spire', layer: 0, x: 400, y: 56, soon: true },
    { id: 'dunes', name: 'Ash Dunes', layer: 1, x: 70, y: 126, soon: true }, { id: 'scrapton', name: 'Rust Flats', layer: 1, x: 180, y: 126 },
    { id: 'glowwild', name: 'Glowwild', layer: 1, x: 290, y: 126, soon: true }, { id: 'crater', name: 'The Crater', layer: 1, x: 400, y: 126, soon: true },
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
