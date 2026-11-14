'use strict';
// Shattered Worlds — the story of the five heroes in heroes5.js, following the rule in story.js: each wakes in a
// tutorial of their own, has their own memories and lines on the shared road (Act 1, Act 2, the Crater), and one
// Act 2 secret only they can wake. Everything here is data for the builders in story.js / story-world.js.
(function () {
  const SW = window.SW, D = SW.data, art = SW.art, story = SW.story, L = D.dialogue, E = D.enemies, TH = art.themes;
  if (!story || !story.addTutorial || !SW.heroes5) return;
  const COMBO = story.comboHint, ADMIN = "The door ahead opens on the admin wing. Three terminals: plug me into each (E) and I can open Block C. Someone is locked in there who needs to meet you.";
  const say = (s, t, o) => Object.assign({ s, t }, o || {});

  // ---------- where they wake ----------
  const th = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    shrine:   th('metro', { style: 'brick', a: '#5a2a2e', b: '#4a2226', top: '#a04a4a', hi: '#ffb0a0', deep: '#1c0c0e', plat: '#8a6a4a', sky: ['#0c0406', '#2c1014'], dim: 0.55, haz: '#6fd3e8' }),
    milezero: th('metro', { style: 'plate', a: '#34405a', b: '#2a344a', top: '#5a6e98', hi: '#a8c0f0', deep: '#0e1220', plat: '#7a6238', sky: ['#05070f', '#141c34'], dim: 0.6, haz: '#39ff88' }),
    hydro:    th('lab', { a: '#8ab8b0', b: '#74a49c', top: '#d8f4ee', hi: '#ffffff', deep: '#3a6660', plat: '#5a9a90', sky: ['#4a8078', '#a8d8d0'], dim: 0.45, haz: '#2a9d8f' }),
    range:    th('lab', { a: '#b8b49a', b: '#a09c84', top: '#eeeada', hi: '#ffffff', deep: '#5e5a48', plat: '#8a8460', sky: ['#7a765e', '#d0ccb4'], dim: 0.42, haz: '#6fd3e8' }),
    icehouse: th('metro', { a: '#4a5a6a', b: '#3c4a58', top: '#8aa4b8', hi: '#d6f4ff', deep: '#141c24', plat: '#6a7a8a', sky: ['#060a0e', '#16222c'], dim: 0.6, haz: '#bfefff' })
  });

  // ---------- their tutorial bosses, and the people who find them ----------
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
  // balance: measured with ST.bench in tools/story-test.js, like every other tutorial boss (see README)
  const tune = story.tune || (() => {});
  tune('cinder', { hp: 530, dmg: 11 }, { lob: { o: { dmg: 6 } } });
  tune('ballast', { hp: 490, dmg: 11 });
  tune('purl', { hp: 580, dmg: 11 });
  tune('keen', { hp: 480, dmg: 10 });
  tune('furrier', { hp: 720, dmg: 13, counter: 1.8 }, { lob: { o: { dmg: 6 } } });

  Object.assign(D.speakers, {
    ribbon: { name: 'Old Ribbon', sheet: 'ribbon', pitch: 430 }, spike: { name: 'Spike', sheet: 'spike', pitch: 780 }, mitts: { name: 'Mitts', sheet: 'mitts', pitch: 820 },
    cinder: { name: 'Brother Cinder', sheet: 'cinder', pitch: 220 }, ballast: { name: 'Ganger Ballast', sheet: 'ballast', pitch: 180 }, purl: { name: 'Ward Sister Purl', sheet: 'purl', pitch: 470 },
    keen: { name: 'Rangemaster Keen', sheet: 'keen', pitch: 290 }, furrier: { name: 'The Furrier', sheet: 'furrier', pitch: 330 }
  });
  const _init = art.init; art.init = function () {
    _init();
    try {
      const rc = story.recolor;
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
  const TXT = {
    kiri: {
      wake: [['sys', 'Deepline. A shrine built into a dead air shaft, hung floor to roof with paper wishes. Nobody remembers who it was for.'], ['ribbon', "There. Eyes open. I'd started folding you a funeral crane, and I'm not unfolding it now, so mind yourself."], ['hero', '...Paper. Everywhere, paper. My hands want to fold it. I look for my own name and there is only a blank sheet.'],
        ['ribbon', "You fell down the shaft three nights back in a cloud of the stuff. Not a mark on you. I've been calling you Crease."], ['ribbon', "I'm Ribbon. I keep the wishes. Come over here - A and D - and press E. Don't tread on anybody's hopes."]],
      start: [['ribbon', "Brother Cinder is coming up the shaft. He burns whatever he can't read, and he can't read. He's heard there's a new wish in my shrine: you."], ['ribbon', "Pepper bun. Eat. Q when you're hurting."],
        ['ribbon', "Up the stair, then over the flooded vent: jump with K, and dash in the air with L. The first crane ever folded here is past it. I think it's yours."]],
      guide: [['ribbon', "Whatever you do, girl, something made of paper does it again behind you. Use that. Throw once, hit twice."]],
      fight: [['cinder', "Paper. Paper everywhere, and not one word of it mine. Burn the shrine, boys. Start with the new one."], ['sys', COMBO]],
      skill: [['hero', 'The oldest crane in the shrine, brown with age. It unfolds in my hands as if it had been waiting.'], ['hero', '(Inside, in my own writing: FOLD YOURSELF SMALL AND GO. ...There are two of me standing here. One of us is paper.)']],
      boss: [['cinder', "Ten thousand wishes, and every one of them says the same thing: not you, Cinder. Never you."], ['hero', 'Nobody wrote that. You only think they did.'], ['cinder', "Then I'll burn them, and read what they say in the smoke."],
        ['sys', "Hold S to GUARD his torch. His firebombs leave burning ground - keep moving.\nWhen he flashes white and lunges, DASH (L) through it. Your paper double repeats every skill: throw once, hit twice."]],
      win: [['ribbon', "He's gone down the shaft, still smouldering. And not one wish singed. I'll fold him a crane too. He needs one more than most."], ['hero', '(Kiri. It was written on the inside of the first fold, where nobody would look. KIRI. That is my name.)'],
        ['ribbon', "The shrine stair comes up in the Neon Market. There's an old map-maker there who paints storm-eyes on the walls. Take him a crane."]] },
    tarn: {
      wake: [['sys', 'Deepline. Mile Zero: the buffer stop where the last metro line ends, and the people who walk the tracks make camp.'], ['spike', "He's up! Hey - HEY - don't stand yet, you've got no skin on your feet."], ['hero', "...I was walking. I've been walking a long time. I don't know where from. I don't know who that makes me."],
        ['spike', "You came in off the dead line three days back, still walking, fast asleep. Nine hundred miles of tunnel behind you, the gangers reckon. I've been calling you Miles."], ['spike', "I'm Spike. I walk track. Come here - A and D - and press E. Slow."]],
      start: [['spike', "Ganger Ballast owns this camp. Anybody who walks in owes him a mile of laid track. You owe him nine hundred."], ['spike', "Pepper bun. Q when you're hurting."],
        ['spike', "The rail bed's flooded east of here: jump, then dash in the air with L. Your boots are on the far side. Ballast took them. He said nobody walks out of Mile Zero."]],
      guide: [['spike', "You hit harder the longer you keep hitting. I watched you do it in your SLEEP. Don't stop once you've started."]],
      fight: [['ballast', "Nine hundred miles of my track, walked without paying. Gang: lay him down."], ['sys', 'J: attack - tap for a 4-hit combo. Every hit in a row adds to your MOMENTUM: keep the combo going and each one lands harder.']],
      skill: [['hero', 'My boots. The soles are worn through, and I know every mile that did it.'], ['hero', "(I lace them up, and my legs remember. Not where I've been. Only how to GO.)"]],
      boss: [['ballast', "You owe me nine hundred miles, walker. I'll take it out of your legs."], ['hero', "I'm not stopping here."], ['ballast', "Everybody stops here. That's what the buffer's FOR."],
        ['sys', "Hold S to GUARD his sledge. When he LEAPS, get out from under him and jump the shockwave.\nWhen he flashes white he CHARGES: dash (L) through, and he dazes himself on the wall. Then keep your combo going: MOMENTUM does the rest."]],
      win: [['spike', "You kicked Ballast over his own buffer stop. Nobody's ever gone past the buffer stop."], ['hero', '(Tarn. A small cold lake, high up, where a road ends. Someone named me for the place they stopped walking. I was not meant to stop.)'],
        ['spike', "Track lift goes up to the Neon Market. There's an old map-maker there. Ask him how far it is to wherever you're going."]] },
    maren: {
      wake: [['sys', 'Aurelia. Med-Lab Sector 5: the Hydro Ward. Forty therapy tanks, and in one of them, a woman they could not keep dry.'], ['hero', '(Water. Warm, still, the wrong salt. I reach for the tide and there is no tide. I reach for my name and there is no tide there either.)'],
        ['wren', "- Subject 21? Oh good, you're a floater, not a sinker. I'm Wren. I live in the walls."], ['wren', "They've had you in that tank a month. Every time they drain it, it fills back up. Nobody can work out where you keep the water. Sector 7's breakout just pulled the whole shift off this floor."],
        ['wren', "The tank release is on the console to your right. A and D, then E."]],
      start: [['sys', 'The tank opens. The water does not spill. It follows you out and waits at your heel.'], ['wren', "...Right. Okay. Med-gel on the wall: Q to use it."], ['wren', "Two techs and a guard ahead, mopping. They cut the salt-water line to this ward to weaken you. The valve is past the drained pool. I'd open it."]],
      fight: [['wren', "They've got mops. You've got the thing the mops are FOR."], ['sys', COMBO]],
      skill: [['hero', 'A valve wheel, chained shut. Behind it I can hear the sea, the real one, a mile below the city.'], ['hero', '(I open it. The water that comes knows me. It asks where it should go. I tell it: out, and then back to me.)']],
      boss: [['purl', "Subject 21. You are dripping on my floor. I run a DRY ward."], ['hero', 'You kept me in a tank for a month.'], ['purl', "For your own good. You leak. Drones: towels."],
        ['sys', "Hold S to GUARD her baton. Dash (L) through the orbs.\nYour skills MEND you: a quarter of the damage they do comes back as health. A Tide Pool (S + U) heals you while you stand in it."]],
      win: [['wren', "Ward Sister Purl, discharged. Against medical advice."], ['hero', '(Maren. Of the sea. The harbour midwives give it to a child born at the turn of the tide. I was the tide doctor. I set bones, and I drowned fevers.)'], ['wren', ADMIN]] },
    yara: {
      wake: [['sys', 'Aurelia. Med-Lab weapons annex: the Firing Gallery. A hundred paces of white corridor, and at the far end of it, a cell with a target painted on the door.'], ['hero', '(A hundred paces. I know it is a hundred. I do not know how I know. I do not know who is doing the knowing.)'],
        ['wren', "- Subject 57! Don't stand in front of the door. They test rifles on that door. I'm Wren. I live in the walls."], ['wren', "They brought you in because you put an arrow through a patrol drone from the next island over. They wanted to know how. Then they wanted to know if you'd still do it scared."],
        ['wren', "Sector 7's breakout emptied the gallery. The cell's on a manual latch. A and D. Press E."]],
      start: [['sys', 'The door swings. From here you can see every lamp in the corridor, and exactly how far away each one is.'], ['wren', "Med-gel on the wall: Q to use it."], ['wren', "Up the scoring tower - K to jump. They hung your bow in the trophy case, unstrung. It's past the coolant spill."]],
      fight: [['wren', "Three guards, close range. Not your distance, is it? Use your elbows."], ['sys', COMBO]],
      skill: [['hero', 'A bow of pale wood, hung on a wall like something dead. My hands string it before I have decided to.'], ['hero', '(It hums. Not at what is near. At what is FAR. The further away I look, the surer it gets.)']],
      test: [['wren', "Target drones, up in the rafters. They were built to be hard to hit. Hold W and show them what that means."]],
      boss: [['keen', "Subject 57. Forty years on this range and I never missed. Then you arrive and make it look easy."], ['hero', 'It is easy. You are standing too close.'], ['keen', "Close is where I LIKE it."],
        ['sys', "Hold S to GUARD. When he flashes white and lunges, DASH (L) through it.\nYour arrows hit harder the FURTHER they fly. Vault Shot (S + U) springs you backward: make room, then shoot."]],
      win: [['wren', "Rangemaster Keen, missed. First time for everything."], ['hero', '(Yara. In the harbour tongue: the far light, the one a ship steers by. They called me that because I never looked at anything close.)'], ['wren', ADMIN]] },
    brann: {
      wake: [['sys', 'Deepline. The Ice House: a meat locker the size of a station, where something very large has been kept frozen in a cage for longer than the staff have worked here.'], ['mitts', "It's dripping. Oh no. Oh no, it's DRIPPING. Mister? Mister Bear? Please don't be awake."],
        ['hero', '...Cold. I know cold. This is not my cold. Mine had a sky over it. There was a name. It is under the ice.'], ['mitts', "The Furrier bought you off a salvage crew, frozen solid in a block. Said you were the last of something. He's been waiting for the price to go up."],
        ['mitts', "I'm Mitts. I stack crates. The cage latch is right there - A and D, then E. I'm not opening it. I'm just SAYING where it is."]],
      start: [['sys', 'The latch comes off in your hand. So does part of the door.'], ['mitts', "Okay. Okay okay okay. Here - pepper bun. Q when you're hurt. Please don't eat me instead."], ['mitts', "His packers are in the next bay. He wants your hide in one piece, so they'll go easy. You, uh. Don't have to."]],
      guide: [['mitts', "The madder you get the harder you hit. I've SEEN the dents in the cage. Just - point it away from me."]],
      fight: [['furrier', "My centrepiece is up and walking. Packers: back in the box with it. Mind the coat."], ['sys', 'J: attack - tap for a 4-hit combo. Your FURY grows as your health falls: the worse it gets, the harder you hit.']],
      skill: [['hero', 'A block of old ice in the last cage. Inside it, a carved bear, no bigger than my thumb. A child made this.'], ['hero', '(I break the ice. I remember the child. I remember what I did to keep the cold off her. I remember being very, very angry.)']],
      boss: [['furrier', "The last of the great northern bear-men. Do you know what a pelt like yours is worth, with the head on?"], ['hero', 'More than you have.'], ['furrier', "I'll take it at cost."],
        ['sys', "Hold S to GUARD his skinning knives. His ice flasks leave freezing ground - keep moving.\nWhen he flashes white and lunges, DASH (L) through it. The lower your health, the harder you hit: FURY."]],
      win: [['mitts', "You put the Furrier in his own freezer. I'm - I'm going to leave the door open a bit. So he doesn't keep."], ['hero', '(Brann. The children could not say the long name, so they said that. It means the one who stands in the door when the winter comes.)'],
        ['mitts', "Meat lift goes up to the Neon Market. There's an old map-maker up there. He's nice. He won't mind the, uh. Size."]] }
  };
  SW.heroes5.forEach(id => { if (TUT[id]) story.addTutorial(id, TUT[id], TXT[id]); });

  // ---------- their memories (same beats as the road they share; see story.js) ----------
  const mem = (title, lines) => ({ title, lines }), NAME = n => ['...' + n + '.', 'My name is ' + n + '.'];
  Object.assign(story.memories, {
    kiri: {
      1: mem('The First Fold', ["A herder's wagon on the steppe, rain on the canvas, a child with nothing to do.", 'She tears a page from the tally-book and folds it. And folds it. A bird stands up in her palm and looks at her.', 'Her father, coming in wet, finds two of his daughter sitting on the bed, and laughs until he has to sit down, and says which one he means.'].concat(NAME('Kiri'))),
      2: mem('Twice', ['Wolves at the lambing pen, and only one of you on watch.', 'So you made it two. The paper one shouted on the left while you shouted on the right.', 'The wolves counted, and went looking for a smaller family.']),
      3: mem('Ten Thousand Hands', ['The sky tore. The camp ran, and there were not enough hands to carry the children.', 'You folded every page of every book the clan owned. Ten thousand paper hands, each one holding somebody.', 'They held until the tear closed over you. Paper remembers the shape it was folded in.']),
      4: mem('Light as That', ['A sheet of paper does not fall. It argues with the air all the way down.', 'You learned to argue the same way: flat against the cliff, weighing nothing, catching every draught.', 'Your father said it was cheating. Your father was afraid of heights.']) },
    tarn: {
      1: mem('The Runner', ['The steppe, end to end, is forty days on a good horse.', 'A boy with a message in his shirt does it on foot in nineteen, because the horse went lame on the second day and he did not think to stop.', 'When he walks into the far camp they do not ask for the message. They ask who in the world he is, and he tells them.'].concat(NAME('Tarn'))),
      2: mem('Uphill', ['A rider cut off on the ridge, raiders below.', 'You went up the slope at them knee-first, and did not come down again until you were on the other side of all of them.', '"You could have gone ROUND," the rider said. It had not occurred to you.']),
      3: mem('Nine Hundred Miles', ['The sky tore, and the tear moved: east, at the pace of a walking man.', 'So you walked in front of it. Nine hundred miles, shouting at every camp to run, never once slower than it was.', 'At the edge of the steppe there was no more east. You turned round and hit it.']),
      4: mem('Straight Up', ['A road does not stop being a road because it has turned into a cliff.', 'You kept walking. Your boots found the iron in the rock, and held.', 'It is the same as flat ground. It is only that the horizon is behind you.']) },
    maren: {
      1: mem('The Turn of the Tide', ['A frozen harbour, and under the ice the sea still breathing in and out.', 'A woman kneels at a hole in the ice with a sick child, and waits for the exact moment the tide turns. Then she dips him, once.', 'The fever goes out with the water. On the quay the mother is crying, and saying the same word over and over.'].concat(NAME('Maren'))),
      2: mem('Still Water', ['A fishing crew carried in off the ice, frost-bitten to the knee.', 'You poured a ring of sea water on the infirmary floor and made them stand in it.', 'By morning they could feel their toes. By evening they were complaining about the smell.']),
      3: mem('The Drain', ['White walls. A tank. Pumps that ran all night, taking the water away.', 'You let them. You are patient. You were counting how much they took.', 'Then you asked for it back. All of it. At once. Through the walls.']),
      4: mem('Stepping on the Swell', ['The harbour children ran on ice they froze under their feet.', 'You never bothered with ice. You stepped on the water, and the water lifted you to the next step.', 'A tide doctor is always wanted on the far side of something.']) },
    yara: {
      1: mem('The Far Light', ['The harbour mouth at night, and a ship out in the pack ice, lost, a mile off.', "A girl on the sea wall lights one arrow and looses it. It comes down in the ship's dead lantern, and the lantern burns.", 'The pilot steers by it all the way in. On the quay he asks which of them shot, and they push her forward, and tell him.'].concat(NAME('Yara'))),
      2: mem('Backwards', ['A white bear on the ice, too close, and coming.', 'You did not run. You jumped back the length of yourself and shot between its paws as you went.', 'It thought again. You had already nocked the second.']),
      3: mem('The Whole Sky', ['White walls. A hundred paces of corridor. Men with rifles who wanted to see you frightened.', 'You asked for your bow. They laughed, and gave it to you with one arrow.', 'You shot the light. In the dark, every arrow you had ever loosed came back down.']),
      4: mem('A Line to Stand On', ['Shoot an arrow with a cord on it into the far side of anything.', 'Then walk the cord. The harbour children freeze their steps. You string yours.', 'It only has to hold for as long as you are looking at the other end.']) },
    brann: {
      1: mem('The One in the Door', ['A long-house on the high steppe, snowed in to the eaves, and something scratching at the door.', 'A very large man gets up from the fire, opens it, and stands in the gap. All night. In the morning there are tracks, and they stop a pace from his feet.', 'The children cannot manage his whole name. They make it shorter, and shout it when they are frightened.'].concat(NAME('Brann'))),
      2: mem('Loud', ['Raiders at the winter stores, forty of them.', 'You did not fight them. You stood up on the roof-beam and told them, at the top of your voice, what you were.', 'The horses left first. The riders had no choice in the matter.']),
      3: mem('Rolling Down', ['The sky tore above the high pasture, and the herd bolted for the cliff.', 'You went down the mountain faster than the herd. You do not remember your feet touching it.', 'You were at the bottom when they arrived. You were in the way. That was the point.']),
      4: mem('Claws', ['Bears climb. People forget that.', 'You learned from the old sow on the ridge, who went up a rock face after honey as if it were a staircase.', 'She let you watch. Once. Then she chased you up it.']) }
  });

  // ---------- their own words on the shared road ----------
  const add = (id, i, t) => { if (L[id] && L[id][i] && typeof L[id][i].t === 'object') Object.assign(L[id][i].t, t); };
  // Act 1
  add('m_ferro1', 0, {
    kiri: "There are two of you in my doorway, and one of you is rustling. Sit down, both. Look at the tags: the storm-eye. The old mark of Vharra.",
    tarn: "You walked here. From Mile Zero. Without once asking the way. Sit, lad, before you wear a groove in my floor. Look at the tags: the storm-eye. The mark of Vharra.",
    brann: "Mind the lintel. And the shelves. And - never mind, I can draw another. Look at the tags, big one: the storm-eye. The old mark of Vharra." });
  add('m_ferro1', 1, { kiri: 'A wagon in the rain. A paper bird standing in my hand. I saw it in the shard.', tarn: 'The steppe, end to end, on foot. A camp asking who I was. I saw it in the shard.', brann: 'A long-house under snow. Children shouting a short name. I saw it in the shard.' });
  add('m_ferro1', 2, {
    kiri: "A folder. The paper-clans kept our tally and our stories; I thought every page of them burned. The tear shredded what we WERE, girl - memory, power - into Memory Shards.",
    tarn: "A runner of the far camps. You carried word faster than horses. The tear shredded what we WERE, lad - memory, power - into Memory Shards.",
    brann: "One of the door-wardens of the high steppe. There were never many. The tear shredded what we WERE - memory, power - into Memory Shards." });
  add('n_thessaly', 0, { maren: "...The tide just turned in my cell. In a sealed room. Then it is the tide doctor. I had hoped you drowned quickly. I am glad you did not.", yara: "I felt you look at me from the far end of the block. Through four walls. The far light. So they took even you." });
  add('n_thessaly', 2, { maren: "To feed their Engine. There is little of me left, and none of it is yours to mend, doctor. Take it instead.", yara: "To feed their Engine. There is little of me left. Better that it flies with your arrows than turns their wheels." });
  add('n_thessaly', 3, { maren: 'She sings one long, cold note. The water at your heel stands up to listen - and learns how to hold a shape.', yara: 'She sings one long note, and for its whole length you can see to the far end of everything. Something lands in your quiver.' });
  Object.assign(L, {
    'o_grist@kiri': [say('grist', "The paper girl. Cinder paid me to keep that shrine burnable. Now I've a refund to find."), say('grist', "Everything that goes UP pays me. Both of you.", { fn: 'boss_start' })],
    'o_grist@tarn': [say('grist', "The walker. Ballast laid my track for twenty years, until you kicked him over his own buffer."), say('grist', "Everything that goes UP pays me. However far it walked to get here.", { fn: 'boss_start' })],
    'o_grist@brann': [say('grist', "The Furrier's bear. He promised me the paws. I'll collect them myself."), say('grist', "Everything that goes UP pays me. Even you, big one.", { fn: 'boss_start' })],
    's_brandt@maren': [say('brandt', "Subject 21. Sector 5 is under a metre of sea water. On the FORTIETH floor."), say('hero', 'It wanted to come with me.'), say('brandt', "It can stay. You are going back in the tank.", { fn: 'boss_start' })],
    's_brandt@yara': [say('brandt', "Subject 57. You shot out every camera between the annex and this door. From the annex."), say('hero', 'You are closer than they were.'), say('brandt', "Close is where this ends.", { fn: 'boss_start' })]
  });
  // Act 2
  add('r_marlo', 2, {
    kiri: "There were two of you at the gate, and the guard only charged one toll. Funny thing: there's a line of paper birds strung on a post out in the Dunes. Ninety years of ash-storms, and not one has torn.",
    tarn: "My outrider says you WALKED the Flats, in a straight line. There's an old milestone out in the Dunes with no number on it. The drivers say the number comes when the right feet pass.",
    brann: "The dogs are hiding under my wagon. All of them. Last time they did that, we were passing a rock in the Dunes with claw marks on it as long as my arm.",
    maren: "Odile says the water barrels have filled themselves since you came in. In a desert. Whatever you're doing, girl, don't stop.",
    yara: "You've been looking past me this whole time, at something a mile behind my head. People from up there don't usually look that far." });
  add('r_marlo_back', 2, {
    kiri: "My drivers say there were a dozen of you, all in white. Then there was one. I've stopped trying to count.",
    tarn: "They say you walked in the front of the Baron's wreck and out the back, and didn't slow down for him.",
    maren: "My drivers came back with their cuts already closed. One of them has a tooth growing back. I'm putting you on the payroll.",
    yara: "The drivers never saw you. They saw the Baron's lamps go out, one at a time, from a very long way off.",
    brann: "They say the Baron's men heard you coming and half of them simply left. I'd have left." });
  add('r_board', 2, { kiri: '(Three drivers. One of me. ...Well. Two of me.)', tarn: '(West. A road with something standing in the middle of it. Good.)', maren: '(Three people hurt and held. That is a house call.)',
    yara: '(A wreck in open country. I can see his throne from here.)', brann: '(He took people from the fire. In winter that is the one thing you do not do.)' });
  add('d_enter', 1, { kiri: "(Ash. Ninety years of burnt paper. Somebody's whole library is under my feet.)", tarn: '(Flat, and far, and no walls. I could walk this for a year.)', maren: '(Dry. Bone dry, all the way down. This ground has been thirsty a long time.)',
    yara: '(At last. A horizon.)', brann: '(Grey as old snow, and warm. That is wrong. Snow should be honest.)' });
  add('d_camp', 1, { kiri: 'Which one of us are you talking to?', tarn: "I'm only passing through. So is my foot.", maren: 'You look unwell. Let me see to that.', yara: 'You should have asked from further away.', brann: 'Ask again. Louder.' });
  add('d_baron', 2, { kiri: "You're counting heads, Baron. Count again.", tarn: "It's a road. I'm on it. Move.", maren: 'Let the drivers go, and I will set that arm for you afterwards.', yara: 'I could have done this from the gate. I wanted you to see me.', brann: 'You took people from their fire. Stand up.' });
  add('g_enter', 1, { kiri: '(Everything here is damp. Paper hates damp. I am going to hate this.)', tarn: '(No road. Only roots. Then I will make one.)', maren: '(The water here is sick. All of it. I can hear it asking.)',
    yara: '(I cannot see twenty paces. I have never been so blind.)', brann: '(Something large lives here. Larger than me. Good.)' });
  add('g_juniper', 2, {
    kiri: "You're leaving paper footprints. On MOSS. I'm not even going to ask.",
    tarn: "You're the first person who's ever walked in here in a straight line. The Glowwild doesn't have straight lines. It's going to be offended.",
    brann: "The stalkers cleared out of this end an hour before you arrived. I thought it was weather.",
    maren: "There's an old hand-pump past the pools that's been dry since the war. The moss round it is the only moss in here that isn't glowing. I fill my canteen there by HOPING.",
    yara: "There's a sighting stone past the drop-pod, the kind the old surveyors used. Somebody's scratched a mark on it that points at nothing. Nothing I can see, anyway." });
  add('g_relay', 2, { kiri: '(They are writing over a place that already had a story. I know that crime.)', tarn: '(A tower in the road, feeding on what is under it. Then it comes down.)', maren: '(They are bleeding the ground and calling it medicine.)',
    yara: '(It is aimed UP. Everything they build is aimed up.)', brann: '(They fed something and left it hungry. I know what that makes.)' });
  add('g_mother', 1, { kiri: 'I am going to need a great deal more paper.', tarn: "It's in the road.", maren: 'Hold still. This will hurt.', yara: 'Too close. Far too close.', brann: 'Finally. Something my own size.' });
  // the Crater
  add('c_enter', 2, { kiri: '(Glass. Nothing folds here. Nothing even bends.)', tarn: '(The road ends here. Every road ends here. So this is where they have all been going.)', maren: '(A wound that was never closed. Ninety years, and it is still open.)',
    yara: '(I can see the far rim. And someone standing between me and it.)', brann: "(Steppe grass, growing out of glass. Somebody's pasture fell here. I know the smell of it.)" });
  add('c_post', 2, { kiri: '(Two signatures. I am used to being two. This time the other one is not mine.)', tarn: '(Two of us, walking toward one spot. Somebody drew both roads.)', maren: '(Two patients, sent to the same room, and told nothing. I have seen wards run like this.)',
    yara: "(Two marks on one range. They mean us to find each other's distance.)", brann: '(Two of us, driven into one pen. That is how you make animals fight.)' });
  add('c_meet', 4, { kiri: 'There are two of me and one of you. I would think about that.', tarn: 'You are standing in the road.', maren: 'You are hurt already. I can see it from here. Do not make me add to it.',
    yara: 'You let me get this close. That was kind of you.', brann: 'I have stood in a door against worse than you. Come on, then.' });
  add('c_win', 2, { kiri: '(Under the white there is only a girl. Folded up small, the way I was.)', tarn: '(She has walked as far as I have. I can see it in how she stands.)', maren: '(Split knuckles, wrapped wrong. Nobody has looked after this boy in a long time.)',
    yara: '(I saw his face. From this close I could not miss it. I have been shooting at a child.)', brann: "(Small. Cold. Somebody's cub. ...I have been fighting somebody's cub.)" });
  add('c_lose', 2, { kiri: '(It could tear me in half. It is holding the page as if it were afraid to crease it.)', tarn: '(It stopped. Nothing stops me, and nothing that fights like that stops ITSELF.)', maren: '(It is checking whether I am breathing. Soldiers do not check.)',
    yara: '(It will not take the shot. At this range. I would not either.)', brann: '(It has me down, and it steps back from the door. That is not what a hunter does.)' });

  // ---------- their secrets: one each, the same rule as everyone else ----------
  const SEC = {
    cranes: ['kiri', 'dunes', 198, 'banner', 'Count the cranes', 'A Thousand and One', { hp: 20, xp: 150, fx: 'frost' }, 'A string of paper cranes on a dead post. Ninety years of ash-storms have not torn one. They are not yours to count.', [
      ['sys', 'A string of paper cranes, tied to a dead post. A thousand of them. Ninety years of ash-storms, and not one is torn.'], ['hero', '(My folds. Every one. I made these on the way down, one for each of the clan, so I could count who I had lost.)'],
      ['sys', 'You count them. A thousand. Then you fold one more, for yourself, and tie it on the end.'], ['hero', '(A thousand and one. Nobody is missing. I only had to stop leaving myself out.)']], '#ff4d6d'],
    milestone: ['tarn', 'dunes', 126, 'sign', 'Read the milestone', 'The Stone With No Number', { hp: 20, creds: 250 }, 'An old milestone, worn smooth. Whatever was carved on it, the ash has taken. It tells you nothing.', [
      ['sys', 'A milestone at the side of a road that is no longer there. The face is blank.'], ['hero', "(Not worn. Never carved. This is the stone they set at the end of a runner's road, for the runner to mark when he gets there.)"],
      ['sys', 'You put your palm on it. Under your hand, a number cuts itself into the stone: nine hundred, and one more.'], ['hero', '(So I am not finished. Good. I would not know what to do with myself if I were.)']]],
    clawrock: ['brann', 'dunes', 84, 'boulder', 'Set your hand to the marks', 'Her Mark', { hp: 25, xp: 150, fx: 'storm' }, 'A boulder scored with claw marks as long as your arm. Whatever made them, you would not want to meet it.', [
      ['sys', "A boulder scored with five claw marks, each as long as a man's arm. Lower down, five small ones, where a child copied them."], ['hero', '(Mine. And hers. The little one from the long-house. She came through the tear holding on to my coat, and I set her down HERE, and told her to wait.)'],
      ['sys', 'You set your hand in the big marks. The small ones are fresh. Somebody has been coming back to this rock, and growing.'], ['hero', '(She waited. She is alive, and she waited, and she is taller. ...I am coming, little one.)']]],
    handpump: ['maren', 'glowwild', 66, 'pump', 'Prime the pump', 'Sweet Water', { hp: 20, xp: 150, fx: 'frost' }, 'An old hand-pump, dry since the war. The handle will not move for you.', [
      ['sys', 'A hand-pump from before the war, rusted dry. The moss around it is plain green: the only moss in the Glowwild that does not glow.'], ['hero', '(Clean water, a long way down, under all this sickness. It has been waiting ninety years for someone to ask it up.)'],
      ['sys', 'You work the handle once. Water comes, clear and cold. Where it runs, the glow goes out of the ground.'], ['hero', '(One spring. It is not a cure. But every cure I ever worked started with one clean cup.)']], '#2a9d8f'],
    sightstone: ['yara', 'glowwild', 147, 'stones', 'Sight along the mark', 'What the Stone Points At', { hp: 15, creds: 300, fx: 'frost' }, "A surveyor's sighting stone, with a mark scratched on it that points at nothing you can see.", [
      ['sys', "A surveyor's sighting stone. Someone has scratched a line across it, pointing east at nothing at all."], ['hero', '(Not nothing. It is only very far. Further than anyone here can see.)'],
      ['sys', 'You sight along the mark and loose one arrow, high. A long breath later, far past the Crater, something made of glass and gold stops humming.'], ['hero', '(That was one of their towers. They have eight more. I have the range now.)']]]
  };
  Object.keys(SEC).forEach(id => {
    const s = SEC[id], zone = s[1] === 'dunes' ? 'Ash Dunes' : 'Glowwild';
    story.secrets[id] = Object.assign({ hero: s[0], kind: 'event', zone, name: s[5] }, s[6]);
    story.notYours[id] = s[7];
    L['x_' + id] = s[8].map((q, i) => Object.assign({ s: q[0], t: q[1], raw: true }, i === 2 ? { fn: 'secret:' + id } : {}));
    story.spots[s[1]].push({ id, kind: s[3], tx: s[2], prompt: s[4], say: 'x_' + id, col: s[9], ph: s[3] === 'boulder' || s[3] === 'stones' ? 52 : 44 });
  });
})();
