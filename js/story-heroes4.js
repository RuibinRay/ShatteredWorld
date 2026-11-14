'use strict';
// Shattered Worlds — the story of the ten heroes in heroes4.js, following the rule in story.js:
// each wakes in a tutorial of their own, has their own memories and lines, and one Act 2 secret only they can wake.
// Everything here is data for the builders in story.js / story-world.js.
(function () {
  const SW = window.SW, D = SW.data, art = SW.art, story = SW.story, L = D.dialogue, E = D.enemies, TH = art.themes;
  if (!story || !story.addTutorial || !SW.heroes4) return;
  const COMBO = story.comboHint, ADMIN = "The door ahead opens on the admin wing. Three terminals: plug me into each (E) and I can open Block C. Someone is locked in there who needs to meet you.";

  // ---------- where they wake ----------
  const th = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    platform: th('metro', { a: '#3a2e52', b: '#2e2444', top: '#6a5098', hi: '#b088f0', deep: '#140e24', plat: '#5a4a7a', sky: ['#08040f', '#1c1034'], dim: 0.6, haz: '#e04dff' }),
    docks:    th('metro', { style: 'scrap', a: '#2a4a4a', b: '#203a3a', top: '#4a8a80', hi: '#8ad0c0', deep: '#0c1c1c', plat: '#7a6238', sky: ['#040e0e', '#103030'], dim: 0.55, haz: '#39ff88' }),
    dojo:     th('metro', { a: '#4a3430', b: '#3c2826', top: '#8a5a50', hi: '#d09a88', deep: '#1a100e', plat: '#8a6a4a', sky: ['#0a0606', '#2a1616'], dim: 0.6 }),
    saloon:   th('market', { a: '#4a2a2a', b: '#3a2020', top: '#8a4a3a', hi: '#d08a5a', deep: '#1a0c0c', plat: '#8a6238', sky: ['#0c0606', '#2a1410'], dim: 0.5, haz: '#d9b45a' }),
    yard:     th('slums', { a: '#3a3e48', b: '#2e323c', top: '#6a7488', hi: '#a0b0c8', deep: '#12141a', plat: '#7a5a38', sky: ['#07080c', '#1a1e28'], dim: 0.55, haz: '#ff8a3a' }),
    gallery:  th('lab', { a: '#b8bcd0', b: '#a0a4bc', top: '#eef0ff', hi: '#ffffff', deep: '#6a6e88', plat: '#8a92b8', sky: ['#7a80a0', '#c8cce0'], dim: 0.4, haz: '#c8d4f0' }),
    blank:    th('lab', { a: '#2a3436', b: '#202a2c', top: '#4a6464', hi: '#5ad6c8', deep: '#0c1214', plat: '#3a5a58', sky: ['#040808', '#101c1c'], dim: 0.85, haz: '#5ad6c8' }),
    armoury:  th('lab', { a: '#6a7080', b: '#585e6e', top: '#a0a8bc', hi: '#f0e0a0', deep: '#2a2e3a', plat: '#8a7a50', sky: ['#2a2e3a', '#6a7080'], dim: 0.6, haz: '#6fd3e8' }),
    pylon:    th('lab', { a: '#2e2658', b: '#241e48', top: '#5a4aa0', hi: '#b8a0ff', deep: '#100c24', plat: '#6a5ab0', sky: ['#0a0620', '#2a1e5a'], dim: 0.78, haz: '#9d6cff' }),
    archive:  th('lab', { a: '#5a4a3a', b: '#4a3c2e', top: '#8a7458', hi: '#e8c890', deep: '#1e1810', plat: '#8a6a4a', sky: ['#140e08', '#3a2a1a'], dim: 0.75, haz: '#6fd3e8' })
  });

  // ---------- their tutorial bosses, and the people who find them ----------
  Object.assign(E, {
    conductor: { name: 'THE CONDUCTOR', sub: 'Fares, please', sheet: 'conductor', sheet2: 'conductor2', hp: 460, dmg: 11, speed: 1.15, xp: 90, creds: 60, idle: 28, w: 12, h: 30,
      script: [['lunge', {}, [1, 3]], ['volley', { n: 3, col: '#e04dff' }, [1, 3]], ['swings', { n: 2, reach: 46, col: '#f7d0ff' }, [3, 1]]] },
    graft:     { name: 'DOCKMASTER GRAFT', sub: 'Never lost a crate', sheet: 'graft', sheet2: 'graft2', hp: 520, dmg: 11, speed: 0.9, xp: 90, creds: 60, idle: 30, w: 14, h: 34,
      script: [['slam', {}, [2, 2]], ['swings', { n: 1, reach: 54, wind: 28, col: '#c8ffe4' }, [3, 1]], ['charge', {}, [1, 3]]] },
    whetstone: { name: 'THE WHETSTONE', sub: 'Collector of swords', sheet: 'whetstone', sheet2: 'whetstone2', hp: 450, dmg: 11, speed: 1.2, xp: 90, creds: 60, idle: 26, w: 12, h: 30,
      script: [['lunge', {}, [1, 3]], ['swings', { n: 3, reach: 46, col: '#ffd0a0' }, [3, 1]], ['volley', { n: 2, kind: 'crescent', col: '#ffa0c0', speed: 4, gap: 20 }, [1, 2]]] },
    ante:      { name: 'LADY ANTE', sub: 'The house always wins', sheet: 'ante', sheet2: 'ante2', hp: 440, dmg: 10, speed: 1.1, xp: 90, creds: 60, idle: 28, w: 12, h: 30,
      script: [['volley', { n: 3, kind: 'bullet', col: '#ffd24a', speed: 3.4, gap: 12 }, [1, 3]], ['lob', { n: 2, col: '#ff8a3a' }, [1, 2]], ['swings', { n: 2, reach: 46, col: '#ffd0d0' }, [3, 1]]] },
    slag:      { name: 'YARDMASTER SLAG', sub: 'Forty tonnes an hour', sheet: 'slag', sheet2: 'slag2', hp: 520, dmg: 11, speed: 1.0, xp: 90, creds: 60, idle: 30, w: 18, h: 42,
      script: [['charge', {}, [1, 3]], ['slam', { col: '#ff8a3a' }, [2, 2]], ['lob', { n: 2, col: '#ff8a3a' }, [1, 2]], ['swings', { n: 1, reach: 52, col: '#ffd0a0' }, [3, 0]]] },
    lane:      { name: 'CHIEF OBSERVER LANE', sub: 'Nothing leaves the frame', sheet: 'lane', sheet2: 'lane2', hp: 450, dmg: 10, speed: 1.0, xp: 90, creds: 60, idle: 28, w: 12, h: 30,
      script: [['volley', { n: 3, col: '#c8d4f0' }, [1, 3]], ['swings', { n: 2, reach: 50, col: '#ffffff' }, [3, 1]], ['summon', { kind: 'drone', max: 2, hp: 14, fly: true }, [2, 2]]] },
    crane:     { name: 'AUDITOR CRANE', sub: 'Every line must balance', sheet: 'crane', sheet2: 'crane2', hp: 460, dmg: 11, speed: 1.2, xp: 90, creds: 60, idle: 26, w: 12, h: 30,
      script: [['swings', { n: 3, reach: 48, col: '#d8fff8' }, [3, 1]], ['lunge', {}, [1, 3]], ['volley', { n: 2, kind: 'crescent', col: '#5ad6c8', speed: 4, gap: 20 }, [1, 2]]] },
    hask:      { name: 'DRILLMASTER HASK', sub: 'Master of the Proving Hall', sheet: 'hask', sheet2: 'hask2', hp: 540, dmg: 12, speed: 0.85, xp: 90, creds: 60, idle: 32, w: 22, h: 48,
      script: [['swings', { n: 1, reach: 64, wind: 30, col: '#fff0c0' }, [3, 1]], ['charge', {}, [1, 3]], ['slam', {}, [2, 2]]] },
    tolle:     { name: 'CHIEF RIGGER TOLLE', sub: 'Two degrees off level', sheet: 'tolle', sheet2: 'tolle2', hp: 480, dmg: 11, speed: 1.0, xp: 90, creds: 60, idle: 30, w: 13, h: 32,
      script: [['slam', { col: '#9d6cff' }, [2, 2]], ['lob', { n: 2, col: '#9d6cff' }, [1, 3]], ['volley', { n: 3, col: '#e4d8ff' }, [1, 2]], ['swings', { n: 2, reach: 46, col: '#e4d8ff' }, [3, 0]]] },
    penn:      { name: 'ARCHIVIST PENN', sub: 'Everything in its place', sheet: 'penn', sheet2: 'penn2', hp: 440, dmg: 10, speed: 1.15, xp: 90, creds: 60, idle: 28, w: 12, h: 30,
      script: [['volley', { n: 3, col: '#e8c890' }, [1, 3]], ['lunge', {}, [1, 2]], ['summon', { kind: 'drone', max: 2, hp: 14, fly: true }, [2, 2]], ['swings', { n: 2, reach: 46, col: '#e8c890' }, [3, 0]]] }
  });
  // balance: these ten face LEGEND heroes (+50% damage, +40% health), so their bosses are built bigger. See tune() in story-world.js.
  const tune = story.tune || (() => {});
  tune('conductor', { hp: 760, dmg: 13 });
  tune('graft', { hp: 860, dmg: 14 });
  tune('whetstone', { hp: 800, dmg: 13, counter: 1.8 });
  tune('ante', { hp: 860, dmg: 12 }, { lob: { o: { dmg: 7, n: 1 } } });
  tune('slag', { hp: 840, dmg: 14 }, { lob: { o: { dmg: 7 } } });
  tune('lane', { hp: 860, dmg: 16, counter: 1.8 }, { lunge: { w: [1, 2] } });
  tune('crane', { hp: 900, dmg: 12, counter: 2.2 }, { lunge: { w: [1, 2] }, volley: { o: { n: 1 } }, swings: { o: { n: 2 } } });
  tune('hask', { hp: 1100, dmg: 15, counter: 2 });
  tune('tolle', { hp: 620, dmg: 12 }, { lob: { o: { dmg: 7 } }, volley: { o: { n: 2 } } });
  tune('penn', { hp: 640, dmg: 15 });

  Object.assign(D.speakers, {
    fare: { name: 'Old Fare', sheet: 'fare', pitch: 260 }, tally: { name: 'Tally', sheet: 'tally', pitch: 780 }, hone: { name: 'Granny Hone', sheet: 'hone', pitch: 400 }, dutch: { name: 'Miss Dutch', sheet: 'dutch', pitch: 520 }, bolt: { name: 'Bolt', sheet: 'bolt', pitch: 800 },
    conductor: { name: 'The Conductor', sheet: 'conductor', pitch: 200 }, graft: { name: 'Dockmaster Graft', sheet: 'graft', pitch: 210 }, whetstone: { name: 'The Whetstone', sheet: 'whetstone', pitch: 300 }, ante: { name: 'Lady Ante', sheet: 'ante', pitch: 480 }, slag: { name: 'Yardmaster Slag', sheet: 'slag', pitch: 190 },
    lane: { name: 'Chief Observer Lane', sheet: 'lane', pitch: 460 }, crane: { name: 'Auditor Crane', sheet: 'crane', pitch: 340 }, hask: { name: 'Drillmaster Hask', sheet: 'hask', pitch: 200 }, tolle: { name: 'Chief Rigger Tolle', sheet: 'tolle', pitch: 280 }, penn: { name: 'Archivist Penn', sheet: 'penn', pitch: 420 }
  });
  const _init = art.init; art.init = function () {
    _init();
    try {
      const rc = story.recolor;
      rc('fare', 'marlo', { top: '#4a4458', acc: '#6a5098', hair: '#c8c8d0', pants: '#2e2a40' });
      rc('tally', 'kid', { top: '#f5c542', hair: '#3a2a20' });
      rc('bolt', 'kid', { top: '#2c6fbf', hair: '#d83a3a' });
      rc('hone', 'tamsin', { top: '#5a5248', hair: '#c8c8d0', pants: '#3a3430' });
      rc('dutch', 'quill', { hair: '#d83a3a', top: '#4a2a2a' });
      rc('conductor', 'fenn', { top: '#3a2a5a', hair: '#1a1028', pants: '#1c1830' }, { '#c9b6ff': '#e04dff', '#a78bfa': '#f5c542' });
      rc('graft', 'brakk', { top: '#2a5a5a', skin: '#b08a6a', pants: '#2a3a3a' }, { '#c8a05a': '#f5c542' });
      rc('whetstone', 'vesper', { top: '#5a3a30', pants: '#2a1c18' });
      rc('ante', 'pyra', { hair: '#1a1a24', top: '#8e2430', pants: '#2a1418' }, { '#ff9a3a': '#d9b45a' });
      rc('slag', 'anvil', { top: '#5a5248', skin: '#8a6a50', pants: '#2e2a26' }, { '#f5c542': '#ff8a3a' });
      rc('lane', 'isolde', { hair: '#8a92b8', top: '#e8ecf4', pants: '#8a92b8' }, { '#9ad8ff': '#c8d4f0' });
      rc('crane', 'nyra_b', { hair: '#12181c', top: '#2a3436', pants: '#1a2224' }, { '#bfefff': '#5ad6c8', '#d9b45a': '#5ad6c8' });
      rc('hask', 'tusk', { top: '#6a7080', skin: '#c8a888', pants: '#3a3f4e' }, { '#6b5234': '#4a5060', '#b8bcc8': '#f0e0a0', '#ff3ea5': '#f0e0a0' });
      rc('tolle', 'ashka', { top: '#3a2a70', hair: '#c8ccd8', pants: '#1a1438' }, { '#ff5a1f': '#9d6cff', '#ffd27a': '#e4d8ff' });
      rc('penn', 'gale', { hair: '#8a7458', top: '#5a4a3a', pants: '#3a2a1a' }, { '#7dffb2': '#e8c890', '#f4f1ea': '#e8c890' });
      [['conductor', '#7a2aa8'], ['graft', '#1a8a7a'], ['whetstone', '#8a2a1a'], ['ante', '#d83a3a'], ['slag', '#a85a2a'], ['lane', '#c8d4f0'], ['crane', '#1a6a64'], ['hask', '#c8a04a'], ['tolle', '#7a4ae0'], ['penn', '#a87a3a']].forEach(q => rc(q[0] + '2', q[0], { top: q[1] }));
    } catch (e) { console.error(e); }
  };

  const LIFT = (what) => ['market', 'lift', 'hatch', what], WING = ['medlab', 'admin', 'door', 'Through to the admin wing'];
  const TUT = {
    orin: { zone: 'platform', name: 'Platform Zero', theme: 'platform', music: 'metro', mission: 'O1-1', title: 'One Way', p: 'or', exit: LIFT('Ride the service lift up to the Neon Market'),
      order: ['start', 'gaps', 'fight', 'climb', 'skill', 'test', 'shard', 'boss'], start: 'talk', climb: 'zigzag', guide: ['fare', 'Old Fare'], save: 'glyph', col: '#e04dff', deco: ['lamp', 'barrel', 'poster', 'crate'],
      foes: [['thug', { hp: 36 }], ['thug', { hp: 36 }], ['thug', { hp: 36 }]], liquid: 'drains', pick: ['poster', 'Take your ticket stub'], test: 'lock', lockY: 18, boss: 'conductor',
      steps: ['Talk to Old Fare at the ticket booth (E)', "Deal with the Conductor's fare-dodgers (J)", 'Take your ticket stub past the stacks', 'Send a Rift Bolt through the bars into the lock (U)', 'Defeat the Conductor'] },
    bando: { zone: 'docks', name: 'Dockside Nine', theme: 'docks', music: 'slums', mission: 'R1-1', title: 'Fragile: Do Not Fold', p: 'ba', exit: LIFT('Ride the freight lift up to the Neon Market'),
      order: ['start', 'climb', 'gaps', 'fight', 'skill', 'test', 'shard', 'boss'], start: 'cage', bars: true, climb: 'tower', guide: ['tally', 'Tally'], save: 'glyph', col: '#b6e84a', deco: ['crate', 'barrel', 'cart', 'lamp'],
      foes: [['brawler', { hp: 36 }], ['brawler', { hp: 36 }], ['brawler', { hp: 36 }]], liquid: 'bilge', pick: ['crate', 'Peel off the freight tape'], test: 'lock', lockY: 18, boss: 'graft',
      steps: ['Unhook the chain on your cage (E)', 'Fight off the dock crew (J)', 'Peel the freight tape off your arms', 'Punch the lock through the bars with a Long Jab (U)', 'Defeat Dockmaster Graft'] },
    sen: { zone: 'dojo', name: 'The Rust Dojo', theme: 'dojo', music: 'metro', mission: 'Q1-1', title: 'The Peace-Knot', p: 'se', exit: LIFT('Take the lift past the last car up to the Neon Market'),
      order: ['start', 'fight', 'climb', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'talk', climb: 'stairs', guide: ['hone', 'Granny Hone'], save: 'glyph', col: '#ffa0c0', deco: ['shelf', 'lamp', 'crate', 'banner'],
      foes: [['digger'], ['digger'], ['digger']], liquid: 'flooded rail bed', pick: ['shelf', 'Untie the peace-knot'], test: 'row', testFoes: [['rat'], ['rat'], ['rat'], ['rat']], boss: 'whetstone',
      steps: ['Talk to Granny Hone (E)', "Beat the Whetstone's students (J)", 'Untie the peace-knot on your sword', 'Cut the whole line of rats with one Draw (U)', 'Defeat the Whetstone'] },
    jax: { zone: 'saloon', name: 'The Long Bar', theme: 'saloon', music: 'market', mission: 'J1-1', title: 'Aces and Eights', p: 'ja', exit: LIFT('Take the goods lift behind the stage up to the Neon Market'),
      order: ['start', 'climb', 'fight', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'talk', climb: 'catwalk', guide: ['dutch', 'Miss Dutch'], save: 'glyph', col: '#c86a3a', deco: ['stall', 'barrel', 'crate', 'lamp'],
      foes: [['ganger', { hp: 30 }], ['thug', { hp: 36 }], ['ganger', { hp: 30 }]], liquid: 'spilled rotgut', pick: ['crate', 'Take back your iron'], test: 'drones', testFoes: [['drone', { hp: 14 }], ['drone', { hp: 14 }]], boss: 'ante',
      steps: ['Talk to Miss Dutch at the bar (E)', "Get through Lady Ante's gunhands (hold S to guard)", 'Take your six-gun back from the count room', 'Shoot the camera drones out of the rafters (W + U)', 'Defeat Lady Ante'] },
    ferra: { zone: 'yard', name: 'The Crusher Yard', theme: 'yard', music: 'slums', mission: 'Z1-1', title: 'Jammed', p: 'fe', exit: LIFT('Ride the goods lift up to the Neon Market'),
      order: ['start', 'gaps', 'climb', 'fight', 'skill', 'test', 'shard', 'boss'], start: 'cage', climb: 'tower', guide: ['bolt', 'Bolt'], save: 'glyph', col: '#8aa4c8', deco: ['trash', 'barrel', 'crate', 'lamp'],
      foes: [['thug', { hp: 36 }], ['thug', { hp: 36 }], ['thug', { hp: 36 }]], liquid: 'sump', pick: ['pump', 'Wake the magnet coil'], test: 'row', testFoes: [['rat'], ['rat'], ['rat'], ['rat']], boss: 'slag',
      steps: ['Hit the emergency stop (E)', 'Beat the yard crew (J)', 'Wake the old magnet coil', 'Cut the whole line of scrap-rats with one Sawback (U)', 'Defeat Yardmaster Slag'] },
    mira: { zone: 'gallery', name: 'The Observation Gallery', theme: 'gallery', music: 'lab', mission: 'M1-1', title: 'Out of Frame', p: 'mi', exit: WING,
      order: ['start', 'climb', 'fight', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'console', climb: 'catwalk', save: 'pod', col: '#c8d4f0', deco: ['screen', 'shelf', 'console', 'tank'],
      foes: [['guard', { hp: 40 }], ['hazmat'], ['guard', { hp: 40 }]], liquid: 'coolant', pick: ['shelf', 'Take the mirror shard'], test: 'lock', lockY: 18, boss: 'lane',
      steps: ['Open your cell at the console (E)', 'Get past the observers (J)', 'Take the mirror shard from the sample locker', 'Throw a Glass Fan through the bars into the lock (U)', 'Defeat Chief Observer Lane'] },
    noct: { zone: 'blank', name: 'The Blank Wing', theme: 'blank', music: 'lab', mission: 'X1-1', title: 'Cell Zero', p: 'no', exit: WING,
      order: ['start', 'fight', 'gaps', 'climb', 'skill', 'test', 'shard', 'boss'], start: 'cage', climb: 'zigzag', save: 'pod', col: '#5ad6c8', deco: ['cage', 'shelf', 'console', 'bed'],
      foes: [['guard', { hp: 36 }], ['guard', { hp: 36 }], ['guard', { hp: 36 }]], liquid: 'drains', pick: ['shelf', 'Open the sealed case'], test: 'shields', testFoes: [['enforcer', { hp: 46 }], ['enforcer', { hp: 46 }]], boss: 'crane',
      steps: ['Try the latch on cell zero (E)', 'Empty the corridor (J)', 'Open the sealed case past the drains', 'Cut the Enforcers down behind their shields (U)', 'Defeat Auditor Crane'] },
    aldric: { zone: 'armoury', name: 'The Proving Hall', theme: 'armoury', music: 'lab', mission: 'K1-1', title: 'Specimen, Inert', p: 'al', exit: WING,
      order: ['start', 'fight', 'climb', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'console', rubble: true, climb: 'tower', save: 'pod', col: '#f0e0a0', deco: ['shelf', 'console', 'tank', 'cage'],
      foes: [['hazmat'], ['hazmat'], ['hazmat']], liquid: 'coolant', pick: ['shelf', 'Take your sword from the rack'], test: 'row', testFoes: [['guard', { hp: 30 }], ['guard', { hp: 30 }], ['guard', { hp: 30 }]], boss: 'hask',
      steps: ['Release the restraints (E), then smash the barricade (J x4)', 'Break the suppression team (J)', 'Take your greatsword from the display rack', 'Cleave the whole line with one Earthcleave (U)', 'Defeat Drillmaster Hask'] },
    vega: { zone: 'pylon', name: 'Pylon Chamber Six', theme: 'pylon', music: 'lab', mission: 'W1-1', title: 'Two Degrees', p: 've', exit: WING,
      order: ['start', 'gaps', 'climb', 'fight', 'skill', 'test', 'shard', 'boss'], start: 'console', climb: 'stairs', save: 'pod', col: '#9d6cff', deco: ['pump', 'console', 'tank', 'shelf'],
      foes: [['drone', { hp: 16 }], ['drone', { hp: 16 }], ['drone', { hp: 16 }]], liquid: 'coolant', pick: ['console', 'Pop the inhibitor band'], test: 'drones', testFoes: [['drone', { hp: 14 }], ['drone', { hp: 14 }], ['drone', { hp: 14 }]], boss: 'tolle',
      steps: ['Release the harness at the console (E)', 'Swat the pylon drones (J)', 'Pop your inhibitor band at the next console', 'Drag the drones together with a Heavy Star (W + U)', 'Defeat Chief Rigger Tolle'] },
    tessa: { zone: 'archive', name: 'The Archive', theme: 'archive', music: 'lab', mission: 'T1-1', title: 'Overdue', p: 'te', exit: WING,
      order: ['start', 'climb', 'gaps', 'fight', 'skill', 'test', 'shard', 'boss'], start: 'cage', climb: 'catwalk', save: 'pod', col: '#e8a090', deco: ['shelf', 'poster', 'console', 'shelf'],
      foes: [['guard', { hp: 40 }], ['hazmat'], ['guard', { hp: 40 }]], liquid: 'coolant', pick: ['console', 'Wind your watch'], test: 'lock', lockY: 18, boss: 'penn',
      steps: ['Open your cell latch (E)', 'Get past the archive guards (J)', 'Take back your watch-key from the reading room', 'Put a Stopwatch dart through the bars into the lock (U)', 'Defeat Archivist Penn'] }
  };
  const RIFT = 'Guard at the LAST instant for a PERFECT guard: you slip between worlds, and nothing can touch you until you attack.';
  const TXT = {
    orin: {
      wake: [['sys', 'Deepline. Platform Zero: a metro stop that is on no map, because it is not always here.'], ['fare', "Mind the gap, son. You've been lying in it for three days."], ['hero', '...I was walking through a door. I do not remember which side I started on. I do not remember me.'],
        ['fare', "You flicker. Here, not here, here. So that's what I've been calling you. I'm Old Fare. I sold tickets, when there were trains."], ['fare', "Come over to the booth. A and D. Press E. And stay solid while you do it."]],
      start: [['fare', "The Conductor walks this line collecting from anyone who slips between. He's heard about you. You're the biggest fare he's ever smelled."], ['fare', "Pepper bun. Still warm, somehow. Q when you're hurting."],
        ['fare', "The drains are open east of here: jump, then dash in the air with L. Your ticket's past the stacks. You'll want it."]],
      guide: [['fare', "Block at the very last instant, Flicker, and you'll find you're not there to be hit. Don't ask me how I know."]],
      fight: [['conductor', "Tickets, please."], ['sys', 'J: attack - tap for a 4-hit combo. Hold S to guard.\n' + RIFT]],
      skill: [['hero', 'A ticket stub, punched for a station that does not exist. It has my thumbprint on it.'], ['hero', '(Something opens when I hold it. Not in the wall. In the IDEA of the wall.)']],
      boss: [['conductor', "No ticket. No name. No world to go back to. You are exactly my kind of passenger."], ['hero', 'I am getting off here.'], ['conductor', "Nobody gets off between stations."],
        ['sys', 'A PERFECT guard (block at the last instant) puts you between worlds: untouchable, and your next attack is an AMBUSH.\nWhen he flashes white and lunges, DASH (L) through it.']],
      win: [['fare', "He's gone down the line. First time in forty years the platform's been quiet."], ['hero', '(Orin. It was on the ticket, under the dirt. ORIN, one way. That is my name.)'],
        ['fare', "The service lift goes up to the Neon Market. An old map-maker there draws the places that aren't on maps. He'll want to meet one."]] },
    bando: {
      wake: [['sys', 'Deepline. Dockside Nine, where the freight lifts come down. Nobody down here asks what is in the crates.'], ['tally', "He's awake! The long guy's awake! Don't move, you'll tangle again."], ['hero', '...My arms. Why are my arms all the way over THERE? Who... who do they belong to?'],
        ['tally', "You came down in a cargo net three days back. Took four of us to coil you. The Dockmaster calls you Stretch."], ['tally', "I'm Tally. There's a chain hooked on your cage. Walk to it - A and D - and press E. Bring your hands with you."]],
      start: [['sys', 'You unhook the chain from a full room away. It was easier than standing up.'], ['tally', "That's so gross. Do it again later. Here - pepper bun. Q when you're hurt."],
        ['tally', "Graft sells anything strange that comes down the lifts. You're next on the manifest. Go east, up the crane tower. K jumps."]],
      guide: [['tally', "Your punches go, like, ACROSS the room. You don't have to walk up to people. Just saying."]],
      fight: [['graft', "The long cargo's loose. Dock crew: pack it. Fold it if you have to."], ['sys', 'J: attack - tap for a 4-hit combo. Your arms are LONG: hit them from where they cannot hit you.']],
      skill: [['hero', 'My arms, wrapped in freight tape, labelled FRAGILE. I peel it off.'], ['hero', '(They go where I look. All the way. Then they come back. It does not hurt. It feels like breathing out.)']],
      boss: [['graft', "Thirty years on the docks. Never lost a crate. Not losing one with legs."], ['hero', "I'm not cargo."], ['graft', "Everything's cargo, son. It's just a question of the label."],
        ['sys', 'Hold S to GUARD his fists. When he LEAPS, get out from under him and jump the shockwave.\nWhen he flashes white he CHARGES: dash (L) through, and he dazes himself on the wall. Then hit him from across the room.']],
      win: [['tally', "You punched the Dockmaster from the OTHER SIDE OF THE DOCK."], ['hero', '(Bando. Like the cord the kite-clans tie. Somebody laughed when they named me that. I remember the laugh.)'],
        ['tally', "Freight lift goes up to the Neon Market. The old Cartographer pays for weird. You are SO weird."]] },
    sen: {
      wake: [['sys', 'Deepline. A dead train, six cars long, that someone turned into a sword school and then forgot.'], ['hone', "Breathing's changed. Good. I was running out of things to polish."], ['hero', '...A sword across my knees. Tied shut with a cord. My hands will not let go of it. I do not know my name.'],
        ['hone', "You walked in out of the tunnels with that blade, sat down, and didn't move for three days. I've been calling you Sheath."], ['hone', "I'm Hone. I sharpen things. Come here - A and D - and press E. Slowly. You startle like a drawn bow."]],
      start: [['hone', "There's a man called the Whetstone who collects swords. Takes them off the people holding them. He's heard about yours."], ['hone', "Pepper bun. Eat. Q when you need it."], ['hone', "His students are in the next car. Don't draw - the knot's still on. Use the scabbard. J."]],
      guide: [['hone', "A blade that's always out is just a long knife. Stand still. Breathe. THEN draw."]],
      fight: [['whetstone', "A new sword in my school. Students: bring it to me. The arm can stay attached, or not."], ['sys', COMBO]],
      skill: [['hero', 'The peace-knot on my sword. My fingers know how it comes undone. One pull.'], ['hero', '(It is not a knot. It is a held breath. I have been holding it for a very long time.)']],
      test: [['hero', '(Rats on the rail, in a line. Stand. Breathe out. ...Now.)']],
      boss: [['whetstone', "Four hundred blades on my wall. None of them as quiet as that one. I must have it."], ['hero', 'It is not mine to give. I think it is the other way round.'], ['whetstone', "Then I will take the pair of you."],
        ['sys', 'Hold S to GUARD. When he flashes white and lunges, DASH (L) through it.\nStand without attacking for a moment and your next Draw (U) is a TRUE DRAW: double damage, twice as far.']],
      win: [['hone', "The Whetstone, dulled. I'll be sharpening his collection for a year."], ['hero', '(Sen. One stroke of the brush. That is all the name there was, and all there needed to be.)'],
        ['hone', "There's a lift past the last car. Neon Market. The Cartographer there knows the old clans. Show him the blade. Don't draw it at him."]] },
    jax: {
      wake: [['sys', 'Deepline. The Long Bar: cards, dice, and a tab that is never quite paid off.'], ['dutch', "He lives. Shame. I had twenty creds on 'doesn't'."], ['hero', '...Cards on the table. Aces and eights. An empty holster. I know the hand. I do not know the player.'],
        ['dutch', "You fell through the skylight three nights ago, landed on the high-stakes table and went to sleep. You owe the house for the table. They call you Six. For the chambers."], ['dutch', "I'm Dutch. I pour. Come to the bar - A and D - and press E."]],
      start: [['dutch', "Lady Ante owns the Bar, the tables, and now your debt. She's got your iron locked in the count room."], ['dutch', "Pepper bun, on the house. Q when you're hurting. It's the only thing in here that's on the house."],
        ['dutch', "The gantry's east: K to jump. Her gunhands are on the floor past it. Hold S when they shoot."]],
      guide: [['dutch', "Five shots to make your point, Six. Save the sixth for when you mean it."]],
      fight: [['ante', "My table is walking out. Boys. Collect."], ['sys', 'J: attack - tap for a 4-hit combo. Gunhands keep their distance: hold S to GUARD the shot, then close in.']],
      skill: [['hero', 'A six-gun in a lockbox, with initials worn into the grip. J.A.X.'], ['hero', '(It sits in my hand like it was poured there. The cylinder turns. Six. Of course six.)']],
      test: [['hero', '(Camera drones, up in the rafters. Tilt the barrel - hold W - and take them down.)']],
      boss: [['ante', "You owe me one table, three nights' board, and the cost of the skylight. I'll take the gun and call it interest."], ['hero', 'Deal me out.'], ['ante', "Darling. The house always wins."],
        ['sys', 'Hold S to GUARD her shots. Her bombs leave fire on the floor - keep moving.\nQuick Shot (U) is cheap. Every SIXTH shot is a DEAD-EYE: triple damage, straight through.']],
      win: [['dutch', "The house lost. I want that on a sign."], ['hero', "(Jax. It's on the gun. If it's good enough for the gun, it's good enough for me.)"],
        ['dutch', "Goods lift, behind the stage. Neon Market. The old Cartographer buys stories. Sell him this one - you could use the creds."]] },
    ferra: {
      wake: [['sys', 'Deepline. The Crusher Yard, where everything the city is finished with gets made very small.'], ['bolt', "Lady! LADY! You gotta wake up, you're in the CRUSHER!"], ['hero', '...Metal. All round me. It is leaning in, like it is listening. Who am I, that it listens?'],
        ['bolt', "You fell in with a load of scrap three days ago and the magnets went crazy and nobody could dig you out. We call you Magpie. 'Cause everything shiny sticks to you."], ['bolt', "I'm Bolt! The stop button's right by you. A and D. Press E. PLEASE press E."]],
      start: [['sys', 'The plates stop a hand-width from your face. Every loose screw in the bay is pointing at you.'], ['bolt', "Okay. Okay okay. Here - pepper bun, I was saving it. Q when you're hurt."],
        ['bolt', "Slag runs the Yard. He's coming to see what jammed his crusher. The sumps are open east: jump, then dash in the air with L."]],
      guide: [['bolt', "The scrap LIKES you. I saw a girder move. Girders don't move."]],
      fight: [['slag', "Something's jammed my crusher. Yard crew: un-jam it."], ['sys', COMBO]],
      skill: [['hero', 'A lifting-magnet coil, big as a cartwheel, dead for years.'], ['hero', '(It wakes when I touch it. So does everything else. North, south - it was never the metal. It was me.)']],
      test: [['hero', '(Scrap-rats, nose to tail along the conveyor. A blade that goes out and comes home would meet them twice.)']],
      boss: [['slag', "Forty tonnes an hour, that crusher does. You cost me three days. I'll have it back out of your hide."], ['hero', 'Everything in this yard is made of metal. Think about that.'], ['slag', "I'm thinking you'll fit in the baler."],
        ['sys', 'Hold S to GUARD. When he flashes white he CHARGES: dash (L) through, and he dazes himself on the wall.\nWhen he LEAPS, move, then jump the shockwave. A Sawback (U) cuts on the way out AND on the way home.']],
      win: [['bolt', "You dropped a GIRDER on him! Without touching it!"], ['hero', '(Ferra. Iron, in the old tongue. They named me for what answered when I was born.)'],
        ['bolt', "The goods lift goes up to the Neon Market. There's an old guy with maps who pays for stories. Tell him Bolt sent you! Tell him about the girder!"]] },
    mira: {
      wake: [['sys', 'Aurelia. Med-Lab Observation Gallery: forty cells, each behind one-way glass. The staff watch. The subjects see only themselves.'], ['hero', '(A face in the glass. It moves when I move. It does not feel like mine. I look for a name behind it and there is only more glass.)'],
        ['wren', "- Subject 03. Don't look at the mirror. Look at the speaker grille. Hi. I'm Wren. I live in the walls."], ['wren', "They've studied you for a month because the cameras keep recording you in the wrong place. Sector 7's breakout just emptied the observation deck."],
        ['wren', "The cell console is to your right. A and D, then E. I've unlocked it. Probably."]],
      start: [['sys', 'The door slides. In the glass, your reflection leaves a moment before you do.'], ['wren', "Med-gel from the wall kit: press Q to use it."], ['wren', "Up and over the gantry: K to jump. They kept the mirror shard you came through with in the sample locker. I think you want it back."]],
      fight: [['wren', "Two guards and a tech, staring at an empty cell. Wave."], ['sys', 'J: attack - tap for a 4-hit combo. Hold S to guard.\nGuard at the LAST instant for a PERFECT guard: you step through the glass, and what they hit is only your reflection.']],
      skill: [['hero', 'A sliver of mirror in a sample tray. It shows a harbour locked in ice. It does not show this room.'], ['hero', '(It is not a mirror. It is a window I am on the wrong side of. ...It can be thrown.)']],
      boss: [['lane', "Subject 03. You are out of frame. I do not permit things to be out of frame."], ['hero', 'You watched for a month. What did you see?'], ['lane', "Something that should not be on both sides of the glass at once. Drones: record this."],
        ['sys', 'Hold S to GUARD her staff. Dash (L) through the orbs.\nA PERFECT guard (block at the last instant) puts you through the mirror: untouchable, and you leave a reflection that shatters.']],
      win: [['wren', "Chief Observer Lane, observed. I've saved the footage. You're not in it, obviously."], ['hero', '(Mira. The harbour word for the bright line where the ice meets the sky. Somebody called me that. I think they loved me.)'], ['wren', ADMIN]] },
    noct: {
      wake: [['sys', 'Aurelia. Med-Lab, a wing with no number. Its cameras record an empty corridor. Its staff are told not to count the cells.'], ['hero', '(No light. No sound. No name. I reach for where the sword should be and find the shape of it missing from the air.)'],
        ['wren', "- hello? I'm... talking to cell zero. The log says cell zero is empty. The log is wrong, isn't it."], ['wren', "I'm Wren. I live in the walls. They don't have a file on you. They have a file on the HOLE where a file should be. Subject 00."],
        ['wren', "Sector 7 just broke out, and nobody guards a room that officially isn't there. The door's on a latch. A and D. Press E."]],
      start: [['sys', 'The door opens. You were already on the other side of it.'], ['wren', "Okay, that's upsetting. Med-gel on the wall: Q to use it."], ['wren', "Guards ahead. No blade yet: they keep it in a sealed case past the drains. Scabbard-work for now. J."]],
      fight: [['wren', "Three guards. They've been told this corridor is empty. Prove them right."], ['sys', 'J: attack - tap for a 4-hit combo. Hold S to guard.\nGuard at the LAST instant for a PERFECT guard: you are simply not there, until you choose to be.']],
      skill: [['hero', 'A sealed case. Inside it, a sword-shaped absence, and a hilt.'], ['hero', '(The blade is not in this world. It never was. It only visits, for the length of a cut.)']],
      test: [['wren', "Enforcers. Shields up. ...You're not going AROUND the shields, are you. You're going through the idea of them."]],
      boss: [['crane', "An audit finds what should not be there. You are the only line in this facility that will not balance."], ['hero', '...'], ['crane', "Nothing to say. Good. I shall enter you as zero."],
        ['sys', 'Hold S to GUARD his blade. When he flashes white and lunges, DASH (L) through it.\nA PERFECT guard makes you vanish, and the attack that brings you back is an AMBUSH for DOUBLE damage.']],
      win: [['wren', "Auditor Crane, written off. I've amended the books."], ['hero', '(Noct. The watch between midnight and the first bell, when the harbour lamps go out. It is the only name I was ever called.)'], ['wren', ADMIN]] },
    aldric: {
      wake: [['sys', 'Aurelia. Med-Lab Proving Hall, where Halcyon tests its machines against things that hit back.'], ['hero', '(Armour. Dented. A weight on my back where a sword should hang. I have an oath in my mouth and no memory of who I swore it to.)'],
        ['wren', "- Subject 12? The big one in the tin suit? Oh good. You're upright."], ['wren', "I'm Wren. I live in the walls. They've been using you as a sparring dummy for the Warden mechs. You broke four. They were annoyed; I was delighted."],
        ['wren', "Sector 7 is in uproar. The hall release is on the console, to your right. A and D, then press E."]],
      start: [['sys', 'The restraint field drops. Your sword is across the hall, bolted in a rack like a museum piece.'], ['wren', "Med-gel in the wall kit: Q."], ['wren', "They've stacked practice barricades in the doorway. Hit it, and finish the combo. The LAST swing of yours would open a vault."]],
      fight: [['hask', "Subject 12 is off its mark. Suppression team: put the dummy back on its stand."], ['sys', 'J: attack - tap for a 4-hit combo. Yours is SLOW and enormous: start it early.\nHold S to guard. Your PERFECT guard is generous, and it answers with a counter-cut.']],
      skill: [['hero', 'My sword, in a display rack. A brass plate under it reads: SPECIMEN, INERT.'], ['hero', '(It is not inert. It was waiting to be asked. I ask.)']],
      test: [['wren', "Three in a row, in a corridor. I believe the word is 'cleave'."]],
      boss: [['hask', "I have drilled Wardens against you for a month. You never once attacked first. Why?"], ['hero', 'I swore to guard. Not to strike.'], ['hask', "Then guard THIS."],
        ['sys', 'Hold S to GUARD his hammer: block at the last instant and you COUNTER automatically.\nWhen he flashes white he CHARGES: dash (L) through. When he LEAPS, move, then jump the shockwave.']],
      win: [['wren', "Drillmaster Hask, drilled. The mechs are all standing very still. I think they're impressed."], ['hero', '(Aldric. Captain of the harbour wall. I swore to stand between the ice and the people behind it. I remember now. I am still standing.)'], ['wren', ADMIN]] },
    vega: {
      wake: [['sys', 'Aurelia. Pylon Chamber Six. Somewhere under this floor, an engine holds a whole city in the sky. It has been running hot.'], ['hero', '(Floating. Not the room - me. Everything else is heavy and I am not. I reach for my own name and it drifts out of my fingers.)'],
        ['wren', "- Subject 88? Could you come down off the ceiling? It's making the sensors cry."], ['wren', "I'm Wren. I live in the walls. They've wired you into the anti-grav pylon to keep it stable. You ARE the stabiliser. Sector 7 just broke out, and the riggers have all run upstairs."],
        ['wren', "The release console is on your right. A and D, press E. And maybe... land, first."]],
      start: [['sys', 'The harness lets go. Somewhere below, a city-sized engine shudders and catches itself.'], ['wren', "Med-gel in the wall kit: Q. Hold K in the air and you fall slowly. I'm told that's not normal."], ['wren', "The coolant channels are open ahead: jump, then dash in mid-air with L."]],
      fight: [['wren', "Pylon drones. They think you're a loose part."], ['sys', 'J: attack - tap for a 4-hit combo. Drones swoop down to fire: hit them then. Hold S to guard.']],
      skill: [['wren', "That's your inhibitor band. I'm popping it in three, two -"], ['hero', '(Everything has a weight. I can feel all of them, like strings in my hand. I only have to pull.)']],
      test: [['wren', "More drones, high up. Throw a star in among them - hold W - and let them come to it."]],
      boss: [['tolle', "Subject 88 is off the pylon. The city's listing two degrees. TWO DEGREES. Do you know what that does to my coffee?"], ['hero', 'Find something else to hold your sky up.'], ['tolle', "I'll bolt you back in myself."],
        ['sys', 'Hold S to GUARD. When he LEAPS, move, then jump the shockwave.\nA Heavy Star (U) drags enemies into itself before it bursts. Hold K in the air to fall slowly.']],
      win: [['wren', "Chief Rigger Tolle, grounded. The city's level again. Nobody's sure why. I'm not telling."], ['hero', '(Vega. The falling star the harbour navigators steered by. I was named for a thing that falls and does not land.)'], ['wren', ADMIN]] },
    tessa: {
      wake: [['sys', 'Aurelia. The Med-Lab Archive. Every second of every experiment, logged, stamped, and shelved in the dark.'], ['hero', '(A watch on my wrist, stopped. I know exactly what time it is anyway. I do not know what day. I do not know who is asking.)'],
        ['wren', "- Subject 09. You said 'hello, Wren' eleven seconds before I spoke. I'm trying not to think about that."], ['wren', "They keep you in the Archive because you kept correcting their timestamps. Sector 7 just broke out; the archivists are all upstairs, shouting."],
        ['wren', "Your cell latch is on a timer. It opens in... now. A and D. Press E."]],
      start: [['sys', 'The latch clicks at the exact moment your hand arrives.'], ['wren', "Med-gel, wall kit, Q. You already knew that."], ['wren', "Up the stacks: K jumps. They took your watch-key; it's in the reading room past the coolant. Without it you're just... punctual."]],
      fight: [['wren', "Guards. You've seen how this goes, I assume."], ['sys', COMBO]],
      skill: [['hero', 'The key to my watch, tagged and filed under MISCELLANEOUS.'], ['hero', '(One turn. The second hand moves. And everything else - just for a moment - does not.)']],
      boss: [['penn', "Subject 09. You are overdue. I do not tolerate things being out of order."], ['hero', 'I have seen this conversation. You lose it.'], ['penn', "The record will show otherwise. Drones: correct the record."],
        ['sys', 'Hold S to GUARD. When he flashes white and lunges, DASH (L) through it.\nRewind (S + U) puts you back where you stood three seconds ago, with the health you had then.']],
      win: [['wren', "Archivist Penn, filed. Under 'P', for 'pavement'."], ['hero', '(Tessa. Short for something longer in the harbour tongue: the-one-who-keeps-the-tide-table. I am late. I am never late.)'], ['wren', ADMIN]] }
  };
  SW.heroes4.forEach(id => { if (TUT[id]) story.addTutorial(id, TUT[id], TXT[id]); });

  // ---------- their memories (same beats as the road they share; see story.js) ----------
  const mem = (title, lines) => ({ title, lines }), NAME = n => ['...' + n + '.', 'My name is ' + n + '.'];
  Object.assign(story.memories, {
    orin: {
      1: mem('The Tent With Two Doors', ["A herder's tent on the steppe, with a flap at each end.", 'A boy walks in one side. His mother, watching the other, counts to ten. He does not come out.', "He comes out of a tent three camps away, grinning, with someone else's bread - and hears her shouting for him."].concat(NAME('Orin'))),
      2: mem('Bringing It To You', ['The lambs strayed onto the ice shelf in spring.', 'You did not walk out after them. You opened your hand, and they were standing in it.', '"Stop FETCHING things like that," your mother said. "It frightens the dogs."']),
      3: mem('The Long Corridor', ['The sky tore, and you saw what it was: a door, badly made.', 'You put your shoulder to it and pushed a hallway straight through the storm.', 'Three hundred people walked down it. You held the far end open until it took your hand off the latch.']),
      4: mem("Where the Wall Isn't", ['Cliffs are only walls, and walls are only suggestions.', 'You learned to lean on the places where the rock was thinking about being somewhere else.', 'It holds you. It is too surprised not to.']) },
    bando: {
      1: mem('The Kite Cord', ['Festival day on the steppe. A hundred kites, and one tangled in the only tree for a mile.', 'A lanky boy looks at it. He does not climb. He just... reaches.', 'The whole camp goes quiet. Then somebody starts laughing, and cannot stop, and shouts the nickname that stuck.'].concat(NAME('Bando'))),
      2: mem('Bring It Here', ['The river took a calf at the spring crossing.', 'You stood on the bank and threw your arm after it like a rope.', "It came back with the calf, two fish, and somebody's hat."]),
      3: mem('Winding Up', ['The sky tore, and the storm wall came down on the camp like a fist.', 'You wound your arm back. And back. And back. The herders say it went round the horizon.', 'You hit the storm. For one breath, it stopped to think about that.']),
      4: mem('Long Way Up', ['Why climb, when you can simply be holding the top already?', 'The trick was never the reach. The trick was persuading the rest of you to follow.', 'You got very good at persuading.']) },
    sen: {
      1: mem('One Stroke', ['A brush, a bowl of ink, a square of paper. An old teacher and a restless child.', '"Write your name," she says. The child draws a single line, and puts the brush down.', '"That is all of it?" "That is all of it." The teacher laughs, hangs it on the wall of the school, and reads it aloud.'].concat(NAME('Sen'))),
      2: mem('The Leaf', ['Autumn on the steppe. Your teacher throws a handful of leaves into the wind and tells you to cut one.', 'You wait. You wait so long she sits down.', 'You cut the one that was about to land on her head. She says nothing for a week. Then she gives you her sword.']),
      3: mem('Three Breaths', ['The sky tore. The clan ran. Three riders did not reach the horses.', 'In. The first cut opened a road through the storm. Out. The second held it.', 'In. You do not remember the third. The riders do.']),
      4: mem('Still Feet', ['You were never taught to climb.', 'You were taught to stand so quietly that the wall forgot you were not part of it.', 'It is the same lesson as the sword. It is always the same lesson.']) },
    jax: {
      1: mem('Aces and Eights', ["A card table in a herder's tent, in storm season, with the whole clan crowded round.", 'A boy in a borrowed hat has just beaten his own grandmother at her own game.', 'She throws her cards down, roars with laughter, and tells the whole tent exactly who raised him.'].concat(NAME('Jax'))),
      2: mem('Off the Rim', ['A wolf in the lambing pen, and no clear shot.', 'You shot the cook-pot. The pot shot the tent-pole. The tent-pole had opinions about the wolf.', '"That was LUCK," your grandmother said. So you did it again.']),
      3: mem('All Six', ['The sky tore, and things came through it that were not weather.', 'You stood on the wagon seat and emptied the cylinder so fast it sounded like one shot.', 'Six of them fell. The seventh thought better of it.']),
      4: mem('Spurs', ['You hate climbing. Always have.', 'So you won a pair of iron-grip spurs off a tinker, with a pair of threes and a straight face.', 'Best hand you never had.']) },
    ferra: {
      1: mem('What Answered', ['A smithy on the steppe, the night a child is born. Every tool on the wall turns to face the cradle.', 'The smith crosses herself. The midwife does not: she holds up a nail, and watches it stand on end.', '"Well," she says. "We know what to call this one."'].concat(NAME('Ferra'))),
      2: mem('Both Poles', ['Raiders in mail, riding down on the forge.', 'You called their armour to you. All of it. With them still inside.', 'Then you changed your mind about wanting it.']),
      3: mem('The Crown of Scrap', ['The sky tore. The forge went up in it, anvil and all.', 'You pulled every horseshoe, every blade, every buckle in the camp into a ring around the people.', 'It turned for an hour. Nothing got through. Afterwards you could not lift a spoon for a month.']),
      4: mem('Iron in the Rock', ['There is metal in every cliff, if you know how to feel for it.', 'Your hands find it. It finds your hands.', 'You have never needed a rope in your life.']) },
    mira: {
      1: mem('The Bright Line', ['A frozen harbour at noon, the ice so clear it shows the sky back to itself.', 'A girl lies on her stomach on it, nose to the surface, talking to the girl underneath.', 'The girl underneath answers. Nobody else hears. From the quay, a fisherman calls the one on top in to eat.'].concat(NAME('Mira'))),
      2: mem('Leave Her Standing', ["The tax-collector came for the smiths' silver.", 'He argued with you for an hour before he noticed you had left the room forty minutes earlier.', 'What he had been shouting at smiled, and cracked, and fell in pieces.']),
      3: mem('Three Suns', ['White walls. One-way glass. A lamp they shone in your eyes for days.', 'You gave it back to them. Once from the glass. Once from the floor. Once from yourself.', 'The observation deck had no windows after that. It had no deck.']),
      4: mem('The Girl Underneath', ['You fell through the ice once, as a child.', 'You did not drown. The girl underneath caught your foot and stood you on her shoulders.', 'She is still there. Any surface will do. You only have to step where she is standing.']) },
    noct: {
      1: mem('The Dark Watch', ['The harbour at the hour the lamps go out. No moon. Ice groaning.', 'Something walks the sea wall that the watchmen never see. In the morning the wolves are dead, and there are no tracks.', 'A child leaves bread on the wall each night. One night she whispers a name into the dark, to see if it will answer.'].concat(NAME('Noct'))),
      2: mem('A Cut, Left Waiting', ['A raider climbed the sea wall at the same place three nights running.', 'On the third night you were not there. You had been, an hour before.', 'He put his hand exactly where you had left the stroke.']),
      3: mem('The Unlit Half', ['White walls. A room they could not film.', 'They built a second room around the first, to watch the nothing happen.', 'One line, drawn from inside the nothing. Both rooms came apart along it.']),
      4: mem('No Footing', ['The watch does not use the stairs.', 'There is always somewhere to stand, if you do not insist on it still being there afterwards.', 'You taught the child that, the winter before the sky tore. She laughed the whole way up the wall.']) },
    aldric: {
      1: mem('The Captain of the Wall', ['A sea wall of black ice, and a line of soldiers along it, facing the dark water.', 'One of them is taller than the rest, with a sword nobody else can lift. He has not moved since dusk.', 'A fishwife brings the watch its soup. She serves him first, and bobs her head, and uses his name.'].concat(NAME('Aldric'))),
      2: mem('What a Guard Is For', ['The raiders broke on the wall like a wave, and one of them got a blade inside your guard.', 'You let him. You had seen where his weight would be.', '"Never strike first," the old captain said. "Strike LAST. It is more final."']),
      3: mem('The Turning Blade', ['White walls. A machine as tall as a house, built to break you.', 'You gave it nothing to aim at: only an edge, going round, and round, and round.', 'They needed a new machine. Then another. Then they stopped building them.']),
      4: mem('Standing Firm, Upward', ['Armour is heavy. The sea wall is tall. A captain goes up it anyway, every dusk.', 'You learned to plant a foot on nothing and trust it, the way you trust a shield-mate.', 'It has never once let you down.']) },
    vega: {
      1: mem("The Navigator's Star", ['A harbour roof, at night, in the cold. A girl and an astrolabe taller than she is.', 'She points at a star and says it is falling. The navigators laugh: that star has not moved in a thousand years.', 'She closes her hand. The star drops one finger-width. Nobody laughs. Somebody says her name, very quietly.'].concat(NAME('Vega'))),
      2: mem('Too Heavy to Lift', ['A sledge went through the ice with a family on it.', 'You did not pull them up. You made the water under them weigh nothing, and they rose out of it like bread.', 'Then you made the raiders on the shore weigh a great deal.']),
      3: mem('The Centre of Things', ['White walls. A harness. An engine below, pulling at you like a tide.', 'You stopped holding it up. For one heartbeat you let everything in the room have its true weight.', 'The room found its own middle. You were standing in it.']),
      4: mem('Falling Up', ['The other children ran on ice they froze beneath their feet.', 'You simply told the ground it was not as interested in you as it thought.', 'It is easy to walk on air, once you stop agreeing to fall.']) },
    tessa: {
      1: mem('The Tide Table', ['A harbour office full of clocks, none of which agree.', "A girl with ink on her nose writes tomorrow's tides on a slate. She has never once been wrong.", 'The harbourmaster checks her against the almanac anyway. Then he corrects the almanac, and calls her in to supper.'].concat(NAME('Tessa'))),
      2: mem('Again', ['The ice gave way under the lamplighter, at the turn of the stair.', 'You watched him fall. Then you put the moment back where it had been, and shouted before he took the step.', 'He never knew. You were sick for three days. It was worth it.']),
      3: mem('The Long Hour', ['White walls. A countdown. A voice reading numbers toward a test you had already seen fail.', 'You took the last second and stretched it across the whole room, like a skin over a drum.', 'They are probably still in it. To them it will feel like no time at all.']),
      4: mem('One Step Ago', ['You do not jump further than other people.', 'You only borrow the footing from a moment ago, when there was still something there.', 'Time does not mind. Time has always liked you.']) }
  });

  // ---------- their own words on the shared road ----------
  const add = (id, i, t) => { if (L[id] && L[id][i] && typeof L[id][i].t === 'object') Object.assign(L[id][i].t, t); };
  add('m_ferro1', 0, {
    orin: "You were not here a moment ago. Sit, sit. I have drawn a great many places that are not on maps; I have never met one. See the tags? The storm-eye. The mark of Vharra.",
    bando: "Put the arm down, lad, you'll have a stall over. Look at the tags instead: the storm-eye. The old mark of Vharra.",
    sen: "That blade. I know the school. I thought the tear took every sword of it. Look at the tags, child: the storm-eye. The mark of Vharra.",
    jax: "The Long Bar is short one table, and I am told that is your doing. Sit. Look at the tags: the storm-eye. The mark of Vharra.",
    ferra: "Every pin has come out of my map since you walked in. Stand still. Look at the tags: the storm-eye. The mark of Vharra." });
  add('m_ferro1', 1, { orin: 'A tent with two doors. A boy who came out of the wrong one. I saw it in the shard.', bando: 'A festival. A kite in a tree. Everybody laughing. I saw it in the shard.', sen: 'A brush. One line on white paper. A teacher laughing. I saw it in the shard.',
    jax: "A card table in a storm. My grandmother's laugh. I saw it in the shard.", ferra: 'A smithy. Every tool on the wall turning to look at a cradle. I saw it in the shard.' });
  add('n_thessaly', 0, { mira: "...Two of you. One in the room, and one in the glass of my cell. The harbour's bright-line girl. I had hoped.", noct: "The lamp in my cell just went out, and I am not afraid. So it is you. The dark watch.",
    aldric: "Captain. You are a long way from the wall. ...No. The wall is a long way from us both.", vega: "The weight has gone out of my chains. Navigator's star. They told us you had fallen.", tessa: "You are exactly on time, tide-keeper. You always were. I had stopped counting." });
  add('n_thessaly', 3, { mira: 'She sings one long note. In the glass of the cell, your reflection learns to stay behind when you go.', noct: 'She sings one long note. Somewhere in it is a cut you have not made yet, waiting where you will leave it.',
    aldric: 'She sings one long note. You remember the oldest lesson of the wall: let them strike, and answer.', vega: 'She sings one long note, and for its whole length everything in the cell weighs exactly what you tell it to.',
    tessa: 'She sings one long note. You hear it end before it begins, and learn the way back to where you were standing.' });
  add('r_marlo', 2, {
    orin: "You were by the gate. Then by the fire. I never saw you cross. There's a door out in the Ash Dunes that does the same: just a door, no wall. Thought you should know.",
    bando: "You shook my hand from over THERE. I'm choosing to be fine with it. One of my wagons is sunk to the axles out in the Dunes, if those arms are for hire.",
    sen: "You've not taken your hand off that hilt, and you've not drawn it either. There's an old duelling banner out in the Dunes. Nobody here knows whose.",
    jax: "I know a card-player's eyes. Don't sit at my table. ...There's a wanted poster nailed up out in the Dunes with a face a lot like yours.",
    ferra: "Every buckle on my harness is pointing at you. The mules don't like it. There's a dead war-machine half buried in the Dunes that's been humming since you arrived.",
    mira: "My shaving mirror's shown me the back of my own head since you walked in. Fix that before you leave.",
    noct: "...Somebody's standing there. Aren't they. I can see the dust not settling. All right. Welcome, whoever you are.",
    aldric: "You've stood guard at my gate for an hour, and nobody asked you to. Stay as long as you like, Captain.",
    vega: "My hat's floating. Just the hat. I'd take it as a kindness if you'd let it down.",
    tessa: "You answered that before I asked it. Twice. I'll save us both the time and just nod." });
  add('r_board', 2, { orin: '(Three people on the wrong side of a locked door. I am good with doors.)', bando: "(Raiders, out of arm's reach. They think.)", sen: '(Three lives held to ransom. One stroke should cover it.)', jax: '(Four hundred creds, and a man who thinks he owns a road. I like these odds.)',
    ferra: '(A fortress made of car hoods. Oh, he is going to regret that.)', mira: '(A king in a wreck full of chrome and broken glass. Every surface in there is mine.)', noct: '(Three hostages. He will not see who took them back.)', aldric: '(People taken from the road. Then the road needs a guard.)',
    vega: '(A tyrant on a hill of scrap. Heavy things fall hardest.)', tessa: '(I have seen how this bounty ends. I should go and make sure of it.)' });
  add('d_camp', 1, { orin: 'I left it in another room.', bando: 'Come and take it. From there.', sen: 'I carry one thing.', jax: "I'll see your toll and raise you.", ferra: "That's a lot of metal you're wearing.", mira: 'Ask her. She is standing behind you.', noct: '...',
    aldric: 'Stand aside.', vega: 'It is heavier than it looks.', tessa: 'You are about to say "get her". Do not.' });
  add('d_baron', 2, { orin: 'Everything that crosses the ash, you said. I did not cross it.', bando: "You're standing well back. It won't help.", sen: 'Draw, then.', jax: "You're holding a busted flush, Baron. Fold.", ferra: 'Your whole throne is listening to me.',
    mira: 'Which of us are you talking to?', noct: '...', aldric: 'Release them. I will not strike first. I will not need to.', vega: 'Kneel. No - I was not asking you. I was telling the ground.', tessa: 'In four minutes you are on your back, offering me the filters. We could skip to that.' });
  add('g_juniper', 2, {
    mira: "There's a sheet of old window glass standing in the moss just past my camp. Unbroken, after ninety years. I don't look in it.",
    noct: "...Is someone with you? No? Huh. There's a boulder past the pools with a cut clean through it. Older than the war. No idea why I thought of it just now.",
    aldric: "There's a rusted standard out past the frozen tree. Blue and white, some harbour crest. Nobody's had the heart to take it down.",
    vega: "Past the overpass there's a ring of stones that don't touch the ground. I threw a rock at one. The rock's still up there.",
    tessa: "A Halcyon chronometer came down with the relay crew, just past the second pool. It's still counting. I don't know what to.",
    orin: "You came in without crossing the tree line. I was WATCHING the tree line. Don't do that near the Husks: they notice.",
    bando: "Keep your hands where I can - no, never mind. I can't keep track of where your hands are.",
    sen: "You walk like the stalkers do. Quiet. They'll respect it, right up until they try to eat you.",
    jax: "Bullets work on stalkers. They don't work on Husks. Count your shots.",
    ferra: "The relay's all steel. It's been leaning toward Scrapton since yesterday. Toward YOU, I'm guessing." });
  add('g_mother', 1, { orin: 'There is no door big enough for that.', bando: "I'm going to need both arms.", sen: 'Large. Slow. One stroke.', jax: "Six won't do it. Good thing I reload.", ferra: 'No metal in it at all. Fine. I brought my own.', mira: 'Do not look at it. Look at its reflection.',
    noct: '...', aldric: 'Behind me. All of you.', vega: 'Everything falls. Even you.', tessa: 'I have watched you die eleven ways. I liked the fourth.' });

  // ---------- their secrets: one each, the same rule as everyone else ----------
  const SEC = {
    lonedoor: ['orin', 'dunes', 194, 'door', 'Open the door', 'The Door You Left', { hp: 20, xp: 150, fx: 'frost' }, 'A door, standing by itself in the ash. No wall, no frame, and it is not yours to open.', [
      ['sys', 'A door, standing by itself in the ash. No wall. No frame. The handle is warm.'], ['hero', '(Mine. I made this, on the way down: a way back, in case I needed one. I left myself a door.)'],
      ['sys', 'You open it. On the other side: grass to the horizon, a tent with two flaps, bread on the table. Then it is only ash again.'], ['hero', '(Not yet. But it is still there. It will keep.)']]],
    wagon: ['bando', 'dunes', 168, 'cart', 'Haul it out', 'The Long Haul', { hp: 20, creds: 250 }, 'A wagon sunk to its axles in the ash. It would take a team of mules. Or longer arms than yours.', [
      ['sys', 'A caravan wagon, sunk to its axles in soft ash. Somebody inside is knocking.'], ['hero', '(Four mules could not shift that. Good thing I am not four mules.)'],
      ['sys', 'You plant your feet, throw both arms round the wagon from thirty paces off, and lean. It comes out of the ash like a tooth.'], ['hero', '(Two drivers and a dog. The dog is the only one who says thank you. I like the dog.)']]],
    duelbanner: ['sen', 'dunes', 108, 'banner', 'Kneel', "The Teacher's Mark", { hp: 20, xp: 150, fx: 'frost' }, 'A duelling banner, bleached by the ash. One brush-stroke on it, in a hand you cannot read.', [
      ['sys', 'A duelling banner, bleached by ninety years of ash. One brush-stroke on it, in the old clan hand.'], ['hero', "(My teacher's mark. She was HERE. She came through before me, and left this where I would have to walk past it.)"],
      ['sys', 'You kneel. The cord on your sword loosens by itself, the way it only ever did in front of her.'], ['hero', '("Still waiting to be told, child?" ...No, teacher. Not any more.)']], '#ffa0c0'],
    wanted: ['jax', 'dunes', 92, 'poster', 'Read the poster', 'Wanted: Six', { hp: 15, creds: 350 }, 'A wanted poster on a dead post. The face means nothing to you.', [
      ['sys', 'A wanted poster, nailed to a dead post. The face is yours. The name is not. The reward is enormous.'], ['hero', '(Aurelia stamp. Printed BEFORE I fell. Somebody up there knew I was coming, and wanted me found first.)'],
      ['sys', 'Tucked behind the poster: a pouch of creds and a note. "If you can read this, Six, you beat them here. Spend it loudly."'], ['hero', "(Don't know who you are, friend. But I owe you a drink.)"]]],
    warcore: ['ferra', 'dunes', 57, 'pump', 'Wake the core', 'Old Iron', { hp: 20, xp: 150, fx: 'storm' }, 'A war-machine from the old war, buried to the shoulders. Dead iron. It does not stir for you.', [
      ['sys', 'A war-machine from the Ashfall, buried to the shoulders. Dead for ninety years. Its core is still faintly humming.'], ['hero', '(Old iron. Tired iron. It has been trying to stand up this whole time, and nobody was listening.)'],
      ['sys', 'You put your hand on its chest. Forty tonnes of rust sits up, looks at you, and very gently lies back down.'], ['hero', '(Rest. You did your part. I will take it from here.)']]],
    glass: ['mira', 'glowwild', 25, 'screen', 'Look into the glass', 'The Girl in the Glass', { hp: 20, xp: 150, fx: 'frost' }, 'A pane of old window glass, upright in the moss. It shows you nothing but yourself.', [
      ['sys', 'A pane of window glass, upright in the moss, unbroken. Your reflection is already looking at you.'], ['hero', '(She has been waiting. She got here first. She always gets there first.)'],
      ['sys', 'You press your palm to the glass. A palm presses back, and passes something through.'], ['hero', '("They are still singing, on the ship. Find the one who can hear them." ...I will tell her.)']], '#c8d4f0'],
    oldcut: ['noct', 'glowwild', 62, 'boulder', 'Touch the cut', 'The Cut Not Yet Made', { hp: 20, creds: 250 }, 'A boulder split by one clean cut, older than the war. It is not your stroke.', [
      ['sys', 'A boulder split by a single cut. The faces are smooth as glass. Moss has grown on everything but the edge.'], ['hero', '(This is my stroke. But I have not made it yet.)'],
      ['sys', 'You draw. The blade arrives, crosses the stone along a line that was already there, and is gone.'], ['hero', '(So. I will stand here again some day, coming the other way. Good. That means I live.)']]],
    standard: ['aldric', 'glowwild', 75, 'banner', 'Raise the standard', 'The Last Company', { hp: 25, xp: 150, fx: 'storm' }, 'A rusted harbour standard among empty helmets. It is not your company.', [
      ['sys', 'A harbour-guard standard, rust-stiff, planted in the moss beside a ring of empty helmets.'], ['hero', '(My company. They came through the tear with me. They held a line here, against whatever grows in this place, with nobody to relieve them.)'],
      ['sys', 'You raise the standard. For a moment forty shadows stand to attention behind you.'], ['hero', '(Stand down, all of you. The watch is mine now.)']], '#f0e0a0'],
    floaters: ['vega', 'glowwild', 121, 'stones', 'Let them fall', 'Let Them Fall', { hp: 20, xp: 150, fx: 'frost' }, 'Standing stones that hang a hand-width off the ground. They do not answer to you.', [
      ['sys', 'Standing stones that do not stand: they hang a hand-width off the moss, turning slowly, as they have for ninety years.'], ['hero', '(Someone told them to stop falling, and never told them they could start again. That is my voice in them. I did this in my sleep, on the way down.)'],
      ['sys', 'You open your hand. The stones settle into the earth with a sound like a held breath let go.'], ['hero', '(I am sorry. I did not know I had left you waiting.)']]],
    chrono: ['tessa', 'glowwild', 55, 'console', 'Stop the count', 'One Long Second', { hp: 15, creds: 300, fx: 'frost' }, 'A Halcyon chronometer, counting down to something. You cannot make it stop.', [
      ['sys', 'A Halcyon chronometer, half sunk in the moss, counting down. The label reads: PULSE TWO.'], ['hero', '(Nineteen days, four hours. That is when they fire the Engine again. I knew the number. I did not know that I knew it.)'],
      ['sys', 'You cannot stop the count. But you turn your key once, and the last second on the dial becomes very, very long.'], ['hero', '(That buys everyone an hour they do not know they have. I intend to use it.)']]]
  };
  Object.keys(SEC).forEach(id => {
    const s = SEC[id], zone = s[1] === 'dunes' ? 'Ash Dunes' : 'Glowwild';
    story.secrets[id] = Object.assign({ hero: s[0], kind: 'event', zone, name: s[5] }, s[6]);
    story.notYours[id] = s[7];
    L['x_' + id] = s[8].map((q, i) => Object.assign({ s: q[0], t: q[1], raw: true }, i === 2 ? { fn: 'secret:' + id } : {}));
    story.spots[s[1]].push({ id, kind: s[3], tx: s[2], prompt: s[4], say: 'x_' + id, col: s[9], ph: s[3] === 'boulder' || s[3] === 'stones' ? 52 : 44 });
  });
})();
