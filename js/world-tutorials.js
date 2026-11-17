'use strict';
// Shattered Worlds — the heroes' home areas: the 23 tutorial zones where the first story mode woke each hero
// (the Beast Pens, Shaft Nine, the Vent Stacks ... Platform Zero, the Paper Shrine, the Ice House). Moved here from the
// first story's story-world.js, story-heroes4.js and story-heroes5.js when that story was removed; only the world is
// kept: each area's theme, its map (the same recipe-built geometry, props, spawns, save point, pickups, breakables,
// control hints and the exit that travels up to the Neon Market or the Med-Lab admin wing), the tutorial bosses'
// enemy definitions, balance and sprites, and the sprites of the people who lived there. No dialogue, missions,
// memory shards, latches, locks, gates or arenas.
// SW.world (world-kit.js) gives recolor / tune / patch / lamp / fire; SW.world.tutorials holds each hero's recipe
// (difficulty.js reads the tutorial bosses from it). Loads right after heroes5.js (the heroes these areas belong to).
(function () {
  const SW = window.SW, D = SW.data, art = SW.art, world = SW.world, Z = SW.zones;
  if (!world || !world.recolor) return;
  const E = D.enemies, TH = art.themes;
  const { recolor, tune, patch, lamp, fire } = world;
  const TUT = world.tutorials;

  // ================= the first eight, on Kael's and Nyra's roads (from story-world.js) =================
  // ---------- art: themes and recoloured cast ----------
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
  });
  function bakeCast() {
    // people
    recolor('pip', 'kid', { top: '#8a5a3a', hair: '#2a2018' });
    recolor('dov', 'bookie', { acc: '#f5c542', top: '#6a5a48', pants: '#3a3430' });
    recolor('coil', 'mags', { hair: '#d8e4e0', top: '#3a6a5a', pants: '#2a3a36' });
    recolor('sprocket', 'ferro', { top: '#6a4a2a', hair: '#8a8a90', pants: '#3a3028' });
    recolor('juniper', 'ganger', { top: '#3a5a34', pants: '#2a3a28' }, { '#f5c542': '#b8ff40' });
    // tutorial bosses
    recolor('holt', 'brandt', { top: '#5a3a2a', hair: '#3a2a20', pants: '#3a3028' }, { '#ff8a3a': '#7fd8ff', '#ffe0a0': '#ffffff' });
    recolor('crake', 'tusk', { top: '#c8642a', skin: '#9a7a60', pants: '#3a3a44' }, { '#6b5234': '#5a6070', '#b8bcc8': '#f5c542' });
    recolor('bellows', 'anvil', { top: '#2a5a52', skin: '#b08a6a', pants: '#2a3a3a' }, { '#f5c542': '#7dffb2' });
    recolor('korr', 'brandt', { top: '#4a4a3a', hair: '#8a3a2a', pants: '#3a3a30' }, { '#ff8a3a': '#c8ccd8', '#ffe0a0': '#ffffff' });
    recolor('voss', 'grist', { top: '#c8e0f0', hair: '#3e6ea8', pants: '#7a98b0', trail: '#7fd8ff' }, { '#ff4040': '#bfefff', '#aab0b8': '#7fd8ff' });
    recolor('ilse', 'tusk', { top: '#d83a3a', skin: '#d8b090', pants: '#2b2f3a' }, { '#6b5234': '#8a6a3a', '#b8bcc8': '#e8ecf4', '#ff3ea5': '#f5c542' });
    recolor('dren', 'anvil', { top: '#8a4a2a', skin: '#7a5a48', pants: '#3a2a26' }, { '#f5c542': '#ff8a3a' });
    recolor('hale', 'grist', { top: '#2a2040', hair: '#1a1430', pants: '#1a1830', trail: '#8b5cf6' }, { '#ff4040': '#ff4d7a', '#aab0b8': '#d0c8f0' });
    [['holt', '#8a2a1a'], ['crake', '#e83a1a'], ['bellows', '#1a8a6a'], ['korr', '#8a7a2a'], ['voss', '#7fd8ff'], ['ilse', '#ff7a2a'], ['dren', '#d86a1a'], ['hale', '#5a2a8a']].forEach(q => recolor(q[0] + '2', q[0], { top: q[1] }));
  }
  const _init = art.init; art.init = function () { _init(); try { bakeCast(); } catch (e) { console.error(e); } };

  // ---------- the tutorial bosses ----------
  Object.assign(E, {
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
      script: [['lunge', {}, [1, 3]], ['volley', { n: 2, kind: 'crescent', col: '#b06cff', speed: 4, gap: 20 }, [1, 2]], ['swings', { n: 3, reach: 50, col: '#d0c8f0' }, [3, 1]]] }
  });
  // balance (see tune() in world-kit.js)
  tune('holt', { hp: 600, dmg: 12, counter: 1.2 }, { lunge: { w: [2, 3] } });
  tune('voss', { hp: 640, dmg: 12 }, { lunge: { w: [1, 2] } });
  tune('crake', { hp: 480, dmg: 11 }, { lob: { o: { dmg: 6 } } });
  tune('ilse', { hp: 560 }, { lob: { o: { dmg: 6 } } });
  tune('bellows', { hp: 540, dmg: 11 });
  tune('dren', { hp: 540, dmg: 9, counter: 2 }, { lob: { o: { dmg: 4, n: 1 } }, swings: { o: { n: 1, wind: 28 } }, slam: { w: [1, 2] } });   // Ashka swings slowly: give her room
  tune('korr', { hp: 420 }, { lob: { o: { dmg: 5, n: 1 } }, volley: { o: { n: 2 } } });
  tune('hale', { hp: 550, dmg: 10, counter: 2 }, { lunge: { w: [1, 2] }, volley: { o: { n: 1 } } });

  // ---------- the recipes ----------
  // Each area is assembled from the same beats, in its own order, with its own shapes. order: the beats;
  // climb / start / test pick the variant of that beat. (The first story's words, steps, foes and bosses stay in the
  // recipe as data: difficulty.js reads .boss.)
  Object.assign(TUT, {
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
  });

  const WID = { start: 18, stairs: 38, zigzag: 40, tower: 31, catwalk: 31, fight: 30, gaps: 26, skill: 8, lock: 11, plate: 11, burn: 7, shields: 30, drones: 30, row: 30, shard: 18, boss: 34, exit: 9 };
  const segW = (T, s) => WID[s === 'climb' ? T.climb : s === 'test' ? T.test : s];
  const tutW = T => T.order.reduce((a, s) => a + segW(T, s), 0) + WID.exit;
  const spread = (n, x) => (n === 2 ? [x + 17, x + 23] : n === 3 ? [x + 15, x + 20, x + 24] : [x + 13, x + 17, x + 21, x + 24]);
  const foeList = (list, x) => { const xs = spread(list.length, x); return list.map((f, i) => [f[0], xs[i], E[f[0]].fly ? 12 + (i % 2) : 19, f[1]]); };

  function buildTutorial(z, g, id) {
    const T = TUT[id], hero = D.heroes[id], W = z.w;
    const skill = () => hero.kit[0];
    z.ground(0, W - 1, 20).fill(0, 0, W, 2).fill(0, 2, 1, 18).fill(W - 1, 2, 1, 18);
    const SEG = {
      start(x) {
        z.spawn('start', x + 4, 19);
        if (T.start === 'cage') z.fill(x + 9, 2, 3, 12);                  // the cell wall (its door is gone: the way is open)
        if (T.rubble && T.start !== 'cage') { z.fill(x + 14, 2, 2, 14); Object.assign(z.breakable(x + 14, 16, 2, 4, 'r1'), { soft: 'heavy' }); z.hint(x + 9, 13, 5, 7, 'J: attack - tap four times.\nThe LAST hit of a combo is heavy: it smashes loose rubble.'); }
        z.hint(x + 1, 13, 8, 7, 'A / D: move\nE: ' + (T.start === 'talk' ? 'talk' : 'interact'));
      },
      stairs(x) {
        z.fill(x + 2, 18, 4, 2).fill(x + 8, 16, 4, 4).plat(x + 14, 14, 4).fill(x + 20, 11, 8, 9).ladder(x + 19, 11, 9).plat(x + 29, 13, 3).plat(x + 33, 16, 3);
        z.hint(x - 2, 12, 9, 8, 'K: jump (hold for height)').hint(x + 14, 5, 6, 9, 'W / S: climb ladders').hint(x + 21, 4, 8, 7, 'S + K: drop through thin ledges');
      },
      zigzag(x) {
        z.clear(x + 2, 20, 26, 1).liquid(x + 2, 21, 26, 2).plat(x + 2, 18, 3).plat(x + 7, 16, 3).plat(x + 12, 14, 4).plat(x + 18, 16, 3).plat(x + 23, 18, 3);
        z.fill(x + 33, 14, 2, 6).ladder(x + 32, 14, 6).ladder(x + 35, 14, 6);
        z.hint(x - 3, 12, 5, 8, 'K: jump (hold for height)\nS + K: drop through thin ledges').hint(x + 28, 8, 5, 12, 'W / S: climb ladders');
      },
      tower(x) {
        z.fill(x + 2, 18, 3, 2).plat(x + 7, 16, 4).plat(x + 13, 14, 4).fill(x + 19, 12, 6, 8).ladder(x + 18, 12, 8).plat(x + 26, 15, 3);
        z.hint(x - 2, 12, 8, 8, 'K: jump (hold for height)').hint(x + 13, 6, 6, 8, 'W / S: climb ladders').hint(x + 20, 5, 6, 7, 'S + K: drop through thin ledges');
      },
      catwalk(x) {
        z.fill(x + 2, 18, 4, 2).fill(x + 8, 16, 4, 4).plat(x + 14, 14, 5).ladder(x + 17, 8, 6).plat(x + 18, 8, 6).fill(x + 21, 16, 3, 4).plat(x + 26, 18, 3);
        z.hint(x - 2, 12, 9, 8, 'K: jump (hold for height)').hint(x + 14, 6, 5, 8, 'W / S: climb ladders\nS + K: drop through thin ledges');
      },
      fight() {},
      gaps(x) {
        z.clear(x + 6, 20, 6, 1).liquid(x + 6, 21, 6, 2).clear(x + 17, 20, 6, 1).liquid(x + 17, 21, 6, 2);   // runway first: a jump off the climb must not land in the pit
        z.hint(x + 1, 13, 5, 7, 'L: dash. Jump, then dash in mid-air\nto cross the ' + T.liquid + '.');
      },
      skill() {},
      lock(x, wide) {
        z.fill(x + 2, 2, 3, 12);                                            // the barred wall (its gate and lock are gone)
        z.hint(x - 5, 13, 7, 7, 'Hold J + K: charge energy\nU: ' + D.abilities[skill()].name + (wide ? ' - lob it through the bars onto the plate' : ' - it goes through the bars to the lock'));
      },
      plate(x) { SEG.lock(x, true); },
      burn(x) {
        z.fill(x + 2, 2, 2, 14); Object.assign(z.breakable(x + 2, 16, 2, 4, 'bar'), { soft: 'burn' });
        z.hint(x - 4, 13, 6, 7, 'Hold J + K: charge energy\nU: ' + D.abilities[skill()].name + ' - burn the barricade down');
      },
      gated(x) {
        z.fill(x, 2, 3, 12);                                                // the wall (its gate and the test arena are gone)
        z.hint(x - 5, 13, 5, 7, 'Hold J + K: charge energy\nU: ' + D.abilities[skill()].name + '    W + U: aim it upward');
      },
      shields(x) { SEG.gated(x); }, drones(x) { SEG.gated(x); }, row(x) { SEG.gated(x); },
      shard(x) {
        z.save(x + 9, 19, T.save); z.pickup('item', x + 12, 19);
        z.hint(x + 5, 13, 8, 7, 'E: rest and save here\nQ: use a healing item   M: map   Esc: menu').hint(x + 14, 13, 4, 7, 'S + L: Slipstep - blink through an enemy (60 energy).\nIt works even while you are being hit.');
      },
      boss() {}
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
  // registers one hero's area: T is its recipe (see TUT)
  function addTutorial(id, T) {
    if (!D.heroes[id]) return;
    TUT[id] = T;
    Z[T.zone] = { name: T.name, theme: T.theme, music: T.music, w: tutW(T), h: 23, build(z, g) { buildTutorial(z, g, id); } };
  }
  Object.keys(TUT).forEach(id => addTutorial(id, TUT[id]));

  // ---------- the Act 1 places beside them: the way back down to the hero's own area ----------
  patch('medlab', (z, g) => {
    const T = TUT[g.state.hero];
    z.spawn('admin', 210, 19);
    if (T) z.thing('door', 207, 19, { prompt: 'Back to ' + T.name, use: gg => gg.gotoZone(T.zone, 'exit') });
  });
  patch('market', (z, g) => {
    const T = TUT[g.state.hero];
    z.spawn('lift', 100, 13);
    if (T && T.exit[0] === 'market') z.thing('hatch', T.exit[1] === 'pit' ? 84 : 100, 13, { prompt: 'Down to ' + T.name, use: gg => gg.gotoZone(T.zone, 'exit') });
  });

  // ================= the ten in heroes4.js (from story-heroes4.js) =================
  if (SW.heroes4) (function () {
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
    // balance: these ten face LEGEND heroes (+50% damage, +40% health), so their bosses are built bigger.
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
    const _init4 = art.init; art.init = function () {
      _init4();
      try {
        const rc = recolor;
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
    SW.heroes4.forEach(id => { if (TUT[id]) addTutorial(id, TUT[id]); });
  }());

  // ================= the five in heroes5.js (from story-heroes5.js) =================
  if (SW.heroes5) (function () {
    const th = (base, o) => Object.assign({}, TH[base], o);
    Object.assign(TH, {
      shrine:   th('metro', { style: 'brick', a: '#5a2a2e', b: '#4a2226', top: '#a04a4a', hi: '#ffb0a0', deep: '#1c0c0e', plat: '#8a6a4a', sky: ['#0c0406', '#2c1014'], dim: 0.55, haz: '#6fd3e8' }),
      milezero: th('metro', { style: 'plate', a: '#34405a', b: '#2a344a', top: '#5a6e98', hi: '#a8c0f0', deep: '#0e1220', plat: '#7a6238', sky: ['#05070f', '#141c34'], dim: 0.6, haz: '#39ff88' }),
      hydro:    th('lab', { a: '#8ab8b0', b: '#74a49c', top: '#d8f4ee', hi: '#ffffff', deep: '#3a6660', plat: '#5a9a90', sky: ['#4a8078', '#a8d8d0'], dim: 0.45, haz: '#2a9d8f' }),
      range:    th('lab', { a: '#b8b49a', b: '#a09c84', top: '#eeeada', hi: '#ffffff', deep: '#5e5a48', plat: '#8a8460', sky: ['#7a765e', '#d0ccb4'], dim: 0.42, haz: '#6fd3e8' }),
      icehouse: th('metro', { a: '#4a5a6a', b: '#3c4a58', top: '#8aa4b8', hi: '#d6f4ff', deep: '#141c24', plat: '#6a7a8a', sky: ['#060a0e', '#16222c'], dim: 0.6, haz: '#bfefff' })
    });

    Object.assign(E, {
      cinder:  { name: 'BROTHER CINDER', sub: 'What he cannot read, he burns', sheet: 'cinder', sheet2: 'cinder2', hp: 520, dmg: 11, speed: 1.0, xp: 90, creds: 60, idle: 30, w: 14, h: 36,
        script: [['lob', { n: 2, col: '#ff8a3a' }, [1, 3]], ['swings', { n: 2, reach: 50, col: '#ffd0a0' }, [3, 1]], ['lunge', {}, [1, 2]]] },
      ballast: { name: 'GANGER BALLAST', sub: 'Lays a mile of track a day', sheet: 'ballast', sheet2: 'ballast2', hp: 560, dmg: 12, speed: 0.9, xp: 90, creds: 60, idle: 30, w: 18, h: 42,
        script: [['charge', {}, [1, 3]], ['swings', { n: 2, reach: 52, col: '#cfe0ff' }, [3, 1]], ['slam', {}, [2, 2]]] },
      purl:    { name: 'WARD SISTER PURL', sub: 'Hydrotherapy, Sector 5', sheet: 'purl', sheet2: 'purl2', hp: 500, dmg: 10, speed: 1.0, xp: 90, creds: 60, idle: 28, w: 12, h: 30,
        script: [['volley', { n: 3, col: '#b8fff0' }, [1, 3]], ['swings', { n: 2, reach: 48, col: '#ffffff' }, [3, 1]], ['summon', { kind: 'drone', max: 2, hp: 14, fly: true }, [2, 2]]] },
      keen:    { name: 'RANGEMASTER KEEN', sub: 'Forty years without a miss', sheet: 'keen', sheet2: 'keen2', hp: 480, dmg: 10, speed: 1.1, xp: 90, creds: 60, idle: 28, w: 14, h: 36,
        script: [['volley', { n: 3, kind: 'bullet', col: '#ffd24a', speed: 3.4, gap: 12 }, [1, 3]], ['lunge', {}, [1, 2]], ['swings', { n: 2, reach: 46, col: '#fff3b0' }, [3, 1]]] },
      furrier: { name: 'THE FURRIER', sub: 'Collector of rare hides', sheet: 'furrier', sheet2: 'furrier2', hp: 540, dmg: 12, speed: 1.1, xp: 90, creds: 60, idle: 28, w: 16, h: 40,
        script: [['lunge', {}, [1, 3]], ['swings', { n: 3, reach: 50, col: '#bfefff' }, [3, 1]], ['lob', { n: 2, col: '#7fd8ff' }, [1, 2]]] }
    });
    tune('cinder', { hp: 530, dmg: 11 }, { lob: { o: { dmg: 6 } } });
    tune('ballast', { hp: 490, dmg: 11 });
    tune('purl', { hp: 580, dmg: 11 });
    tune('keen', { hp: 480, dmg: 10 });
    tune('furrier', { hp: 720, dmg: 13, counter: 1.8 }, { lob: { o: { dmg: 6 } } });
    const _init5 = art.init; art.init = function () {
      _init5();
      try {
        const rc = recolor;
          rc('ribbon', 'mags', { hair: '#c8c8d0', top: '#b01030', pants: '#3a2a30' });
          rc('spike', 'kid', { top: '#3a86ff', hair: '#1a1a24' });
          rc('mitts', 'kid', { top: '#c8d8e8', hair: '#8a5a3a' });
          rc('cinder', 'brandt', { top: '#8a2a1a', hair: '#1a1a1a', pants: '#3a2a20' }, { '#ffe0a0': '#ffd24a' });
          rc('ballast', 'anvil', { top: '#3a4a6a', skin: '#a8805c', pants: '#2a3040' }, { '#f5c542': '#cfe0ff' });
          rc('purl', 'isolde', { hair: '#5a6478', top: '#e8f4f0', pants: '#2a9d8f' }, { '#9ad8ff': '#b8fff0' });
          rc('keen', 'brandt', { top: '#5a5a2a', hair: '#c8c8a0', pants: '#3a3a20' }, { '#ff8a3a': '#ffd60a', '#ffe0a0': '#fff3b0' });
          rc('furrier', 'grist', { top: '#d8e4f0', hair: '#8a92a8', pants: '#5a6478', trail: '#bfefff' }, { '#ff4040': '#bfefff', '#aab0b8': '#ffffff' });
          [['cinder', '#d83a1a'], ['ballast', '#3a86ff'], ['purl', '#2a9d8f'], ['keen', '#c8a81a'], ['furrier', '#7fd8ff']].forEach(q => rc(q[0] + '2', q[0], { top: q[1] }));
      } catch (e) { console.error(e); }
    };

    const LIFT = what => ['market', 'lift', 'hatch', what], WING = ['medlab', 'admin', 'door', 'Through to the admin wing'];
    const TUT = {
      kiri: { zone: 'shrine', name: 'The Paper Shrine', theme: 'shrine', music: 'metro', mission: 'C1-1', title: 'Ten Thousand Wishes', p: 'ki', exit: LIFT('Climb the shrine stair up to the Neon Market'),
        order: ['start', 'climb', 'fight', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'talk', climb: 'stairs', guide: ['ribbon', 'Old Ribbon'], save: 'glyph', col: '#ff4d6d', deco: ['banner', 'lamp', 'shelf', 'crate'],
        foes: [['thug', { hp: 36 }], ['thug', { hp: 36 }], ['thug', { hp: 36 }]], liquid: 'flooded vent', pick: ['shelf', 'Unfold the first crane'], test: 'lock', lockY: 18, boss: 'cinder',
        steps: ['Talk to Old Ribbon (E)', "Stop Brother Cinder's torch-men (J)", 'Unfold the oldest crane in the shrine', 'Throw a Paper Star through the bars into the lock (U)', 'Defeat Brother Cinder'] },
      tarn: { zone: 'milezero', name: 'Mile Zero', theme: 'milezero', music: 'metro', mission: 'L1-1', title: 'End of the Line', p: 'ta', exit: LIFT('Take the track lift up to the Neon Market'),
        order: ['start', 'gaps', 'climb', 'fight', 'skill', 'test', 'shard', 'boss'], start: 'talk', climb: 'zigzag', guide: ['spike', 'Spike'], save: 'glyph', col: '#3a86ff', deco: ['lamp', 'crate', 'barrel', 'cart'],
        foes: [['digger'], ['digger'], ['digger']], liquid: 'flooded rail bed', pick: ['crate', 'Lace up your boots'], test: 'row', testFoes: [['rat'], ['rat'], ['rat'], ['rat']], boss: 'ballast',
        steps: ['Talk to Spike (E)', "Beat Ballast's track gang (J)", 'Take your boots back', 'Kick through the whole line of rats with one Step Kick (U)', 'Defeat Ganger Ballast'] },
      maren: { zone: 'hydro', name: 'The Hydro Ward', theme: 'hydro', music: 'lab', mission: 'E1-1', title: 'Low Tide', p: 'ma', exit: WING,
        order: ['start', 'fight', 'climb', 'gaps', 'skill', 'test', 'shard', 'boss'], start: 'console', climb: 'catwalk', save: 'pod', col: '#2a9d8f', deco: ['tank', 'pump', 'console', 'bed'],
        foes: [['hazmat'], ['guard', { hp: 40 }], ['hazmat']], liquid: 'drained pool', pick: ['pump', 'Open the salt-water line'], test: 'lock', lockY: 18, boss: 'purl',
        steps: ['Open your tank at the console (E)', 'Get past the ward staff (J)', 'Open the salt-water valve past the pool', 'Crack a Brine Lash through the bars into the lock (U)', 'Defeat Ward Sister Purl'] },
      yara: { zone: 'range', name: 'The Firing Gallery', theme: 'range', music: 'lab', mission: 'Y1-1', title: 'Moving Target', p: 'ya', exit: WING,
        order: ['start', 'climb', 'gaps', 'fight', 'skill', 'test', 'shard', 'boss'], start: 'cage', climb: 'tower', save: 'pod', col: '#ffd60a', deco: ['screen', 'shelf', 'console', 'crate'],
        foes: [['guard', { hp: 36 }], ['guard', { hp: 36 }], ['guard', { hp: 36 }]], liquid: 'coolant', pick: ['shelf', 'String the old bow'], test: 'drones', testFoes: [['drone', { hp: 14 }], ['drone', { hp: 14 }], ['drone', { hp: 14 }]], boss: 'keen',
        steps: ['Lift the latch on the target cell (E)', 'Get past the range guards (J)', 'Take your bow from the trophy case', 'Shoot the target drones out of the rafters (W + U)', 'Defeat Rangemaster Keen'] },
      brann: { zone: 'icehouse', name: 'The Ice House', theme: 'icehouse', music: 'metro', mission: 'U1-1', title: 'Thaw', p: 'br', exit: LIFT('Ride the meat lift up to the Neon Market'),
        order: ['start', 'fight', 'gaps', 'climb', 'skill', 'test', 'shard', 'boss'], start: 'cage', climb: 'tower', guide: ['mitts', 'Mitts'], save: 'glyph', col: '#c1121f', deco: ['crate', 'barrel', 'cage', 'lamp'],
        foes: [['brawler', { hp: 36 }], ['brawler', { hp: 36 }], ['brawler', { hp: 36 }]], liquid: 'meltwater', pick: ['cage', 'Break the last of the ice'], test: 'row', testFoes: [['rat'], ['rat'], ['rat']], boss: 'furrier',
        steps: ['Take the latch off your cage (E)', "Go through the Furrier's packers (J)", 'Break the old ice in the last cage', 'Maul the whole line of rats at once (U)', 'Defeat the Furrier'] }
    };
    SW.heroes5.forEach(id => { if (TUT[id]) addTutorial(id, TUT[id]); });
  }());
})();
