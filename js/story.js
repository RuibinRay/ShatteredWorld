'use strict';
// Shattered Worlds — story structure. Loaded after every other script; like elements.js it extends the game by
// wrapping functions and adding data, so nothing else has to change.
//
//   ACT 1   Every hero wakes somewhere different and plays their OWN first tutorial: own zone, mission, cast,
//           boss and first memory (zones and tutorial text are in story-world.js). After it they join Kael's or
//           Nyra's road for the rest of the act, with their own lines where it matters.
//   ACT 2+  One road for everybody: the missions are the same for all heroes. What changes is the conversation
//           (per-hero lines), the abilities each hero brings, and one SECRET per hero that only they can wake:
//           a hidden map, an event, or a boss (story.secrets).
//
// Dialogue lines can now vary per hero:
//   { s, t: 'same for everyone' }
//   { s, t: { kael: '...', pyra: '...', K: 'any hero on Kael\'s road', N: 'any hero on Nyra\'s road', _: 'everyone else' } }
//   { s, t, h: 'fenn brakk' }                 only those heroes get the line
//   D.dialogue['id@fenn'] = [...]             Fenn's own version of a whole conversation
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, ui = SW.ui, art = SW.art, fx = SW.fx, text = SW.text, W = SW.W;
  const L = D.dialogue, M = D.missions;
  const story = SW.story = { secrets: {}, cards: {}, memories: {} };

  // ---------- per-hero dialogue ----------
  const dlg = ui.dlg, _start = dlg.start, _next = dlg.next;
  dlg.start = function (g, id, cb) {
    const hero = g.state.hero, rk = g.route() === 'kael' ? 'K' : 'N', own = L[id + '@' + hero], src = own || L[id];
    if (!src) return _start.call(dlg, g, id, cb);
    const pick = t => (typeof t === 'string' ? t : t[hero] !== undefined ? t[hero] : t[rk] !== undefined ? t[rk] : t._);
    const lines = [];
    src.forEach(l => {
      if (l.h && l.h.split(' ').indexOf(hero) < 0) return;
      const t = pick(l.t);
      if (t !== undefined) lines.push(own || l.h || typeof l.t !== 'string' ? Object.assign({}, l, { t, raw: true }) : l);
    });
    L['@live'] = lines;
    _start.call(dlg, g, '@live', cb);
  };
  // hero-specific lines are already written for that hero: skip the route hero -> this hero name swap
  dlg.next = function (g) { _next.call(dlg, g); const ln = dlg.active && dlg.lines[dlg.i]; if (ln && ln.raw) dlg.wrapped = SW.wrap(ln.t, ln.s === 'sys' ? 420 : 372); };

  // ---------- per-hero memories ----------
  // A bonus hero recovers a memory at the same story beats as the hero whose road they share, and it unlocks the
  // same kit slot - but it is THEIR memory. The ids stay the road's (kael_1, nyra_3 ...) so everything keyed on
  // them keeps working; the title and text are swapped in for whoever is being played.
  Object.assign(D.memories, {
    kael_4: { title: 'Lightning Climbs', img: 'mem_kael', unlock: 'magnet_grip', lines: [
      'The cliffs above the camp, slick with rain.', 'The other children used ropes. You used the storm: the charge in your hands held you to the iron in the rock.', '"Lightning does not fall, Kael. It CLIMBS. Watch it sometime."'] },
    nyra_4: { title: 'A Step, Then a Step', img: 'mem_nyra', unlock: 'frost_steps', lines: [
      'The harbour in spring, the ice breaking up under your feet.', 'You did not stop running. You sang the next step into being, and the next, and the next.', 'The sea never caught you. It only ever held you up.'] }
  });
  const BASE = {};
  ['kael', 'nyra'].forEach(r => { for (let n = 1; n <= 4; n++) BASE[r + '_' + n] = D.memories[r + '_' + n]; });
  function memoriesFor(hero) {
    const h = D.heroes[hero], own = story.memories[hero] || {};
    if (!h) return;
    Object.keys(BASE).forEach(id => { D.memories[id] = BASE[id]; });
    for (let n = 1; n <= 4; n++) { const id = (h.route || hero) + '_' + n; if (own[n] && BASE[id]) D.memories[id] = Object.assign({}, BASE[id], own[n]); }
  }
  const mem = (title, lines) => ({ title, lines });
  const NAME = n => ['...' + n + '.', 'My name is ' + n + '.'];
  story.memories = {
    fenn: {
      1: mem('The First Hunt', ['Grass to the horizon, bending under a wind that smells of rain.', 'A boy lies flat in it beside a wolf made of stormlight. Neither of them breathes.', 'The herd breaks. The wolf goes left. The boy goes right. They have never needed words.', 'A horn sounds from the camp. Someone is calling the hunters home by name.'].concat(NAME('Fenn'))),
      2: mem('The Clap Before the Rain', ['Night on the steppe. Raiders at the edge of the firelight.', 'The pack-mother strikes her palms together once - and the sky answers through her.', '"You do not need teeth for every fight, Fenn. Sometimes you only need to be LOUD."']),
      3: mem('The Wolf That Stayed', ['The sky over the steppe tore open. Violet light. The herd scattering.', 'You whistled, and the storm-wolf came, and stood between the tear and the camp.', 'It did not run when you fell. It is still out there. It has been waiting for the whistle.']),
      4: mem('Claws on Stone', ['The storm-wolf went up the cliff face as if it were level ground.', 'You followed with your hands crackling, each grip a small bite of lightning in the rock.', 'At the top it looked back at you. That was the day it stopped being a hunt and became a pack.']) },
    brakk: {
      1: mem('The Warden of the Stones', ['Mountains like the knuckles of the world, and below them a ring of standing stones.', 'A giant of a man walks the ring at dusk, laying one hand on each stone. Each one hums back.', 'Children follow him, daring each other to touch his shadow.', 'One of them shouts a name, and he turns, slow as weather, and smiles.'].concat(NAME('Brakk'))),
      2: mem('What the Ground Holds', ['A rockslide above the high pasture. Herders frozen on the path.', 'You did not run. You knelt, and put both fists to the ground, and ASKED.', 'The slide parted around them like a river round a stone.']),
      3: mem('The Dragon Under the Ring', ['The sky tore over the standing stones. Violet light pulled at the ring itself.', 'You called down - past the roots, past the bedrock - to the old thing asleep under the mountain.', 'It rose, and held the stones in place while everyone ran. Then the ground closed over you both.']),
      4: mem('Hand-holds', ['You never climbed the mountain. You asked it, and it made room for your hands.', 'Every hold was there before you reached for it.', '"The stone remembers its warden, Brakk. Wherever the sky drops you, put your hand on a wall."']) },
    gale: {
      1: mem('The Ridge Runner', ['A ridge above the steppe where the wind never stops.', 'A boy runs along it with his arms out, scarf snapping behind him like a flag.', 'He jumps a gap between two rocks that no one should be able to jump. The wind holds him a moment too long.', 'Below, the herders shout his name - half scolding, half laughing.'].concat(NAME('Gale'))),
      2: mem('Lift', ['The kite-fliers of the ridge did not pull their kites up. They asked the air to rise.', 'You asked once, as a joke, standing under your little sister.', 'She went up laughing. It took the whole camp to talk her down.']),
      3: mem('The Eye of It', ['The sky tore, and the wind went mad trying to fill the hole.', 'You ran INTO it. Round and round the tear, faster, until the air ran with you.', 'A wall of wind stood between the camp and the wound. You were the middle of it.']),
      4: mem('Holding On', ['The wind taught you to let go. The cliffs taught you the other thing.', 'A gust pinned you to the rock face once, flat as a leaf, and held you there until you found the handholds.', '"See?" it seemed to say. "I can do gentle, too."']) },
    dyna: {
      1: mem('The Fireworks Girl', ['A storm-season festival on the steppe. Every clan has brought something to throw at the sky.', 'A girl with burnt eyebrows sets down a tube she built herself and tells everyone to stand further back. Further.', 'The sky turns gold from one horizon to the other. The thunder itself goes quiet to watch.', 'Then the whole camp is shouting one name.'].concat(NAME('Dyna'))),
      2: mem('Patience, With a Fuse', ['Wolves at the herd, every night for a week.', 'You did not chase them. You buried six clay pots along their trail and went to bed.', 'In the morning there were six craters, and no more wolves.']),
      3: mem('The Big One', ['The sky tore. Everyone ran from it. You ran to your workshop.', 'Everything you had ever built went into one casing, with the shortest fuse you ever cut.', 'You aimed it at the hole in the sky. It did not close the hole. But it made the hole FLINCH.']),
      4: mem('Climbing Irons', ['You hated heights. So you built something about it.', 'Charged grips, one for each hand, that bit into iron-stone and would not let go until you told them to.', '"It is not climbing," you told everyone. "It is controlled falling. Upward."']) },
    isolde: {
      1: mem('The High Eyrie', ['A tower of ice above a frozen harbour. Falcons the colour of snow wheel around it.', 'A woman stands on the highest ledge with one arm raised. She does not call. She waits.', 'The largest bird folds out of the sky and settles on her glove like a held breath.', 'Far below, a child on the harbour ice waves both arms and shouts up at her.'].concat(NAME('Isolde'))),
      2: mem('Stillness', ['A blizzard on the harbour road. Wolves circling a sled.', 'You did not raise your voice. You breathed out, once, and the storm held its breath with you.', 'Everything within ten paces stopped: the snow, the wolves, the fear.']),
      3: mem('The Bird That Came Back', ['Falling. Wind. The sky a shrinking coin above you.', 'You raised your arm out of habit - and something answered. Wings of new ice, shaped from the air itself.', 'It was never one bird. It was the cold, choosing to come when you called.']),
      4: mem('Steps on Air', ['The falcons never taught you to fly. They taught you something smaller.', 'That the air will take your weight for exactly one heartbeat, if you ask it politely and do not look down.', 'One heartbeat is enough, if you take them one after another.']) },
    pyra: {
      1: mem('The Blue Forge', ['A harbour locked in ice, and at its heart a forge that burns blue.', 'A girl feeds it with her bare hands. The ice-smiths sing the blades; she is the reason the song has heat.', 'Sparks climb her arms like they are glad to see her.', 'The old smith laughs and calls her in from the cold.'].concat(NAME('Pyra'))),
      2: mem('Banked Coals', ['The forge at midnight. The smiths asleep. Something clawing at the door from outside.', 'You did not throw the fire. You let it out, all round you, like opening your arms.', '"A flame that only goes forward is a spear, child. A hearth goes EVERYWHERE."']),
      3: mem('The Sun in the Lab', ['White walls. Straps. A voice counting down to another test.', 'They wanted to know how hot you could burn. So you showed them.', 'For one breath there was a second sun in Sector 4. Then there was no Sector 4.']),
      4: mem('Walking on Heat', ['The harbour children ran on the sea-ice, freezing each step ahead of them.', 'You were the forge-girl. You were not supposed to be able to.', 'You learned anyway. Fire is only the cold, given somewhere to go.']) },
    ashka: {
      1: mem('The Ember-Carrier', ['A harbour of ice, and under it, far down, a red glow where the mountain breathes.', 'A woman walks up out of the deep vents with her hands cupped, carrying something that lights her face from below.', 'The smiths make way for her. The forge cannot be lit without what she brings.', 'A child tugs her sleeve and says her name like a question.'].concat(NAME('Ashka'))),
      2: mem('Where the Ground is Thin', ['The harbour ice groaned one winter, and a raiding ship came in over it.', 'You stamped once. The sea-floor remembered it was a mountain.', 'A column of red came up through the ice between the ship and the shore, and stood there, and dared them.']),
      3: mem('The Tide of Stone', ['White walls. A cradle of pipes. Cold going in, heat going out, for days without number.', 'You let it build. You were patient. Mountains are patient.', 'When it finally moved, it went across the floor like a tide, and nothing in the room was the shape it had been.']),
      4: mem('Cooling', ['The children of the harbour ran on ice they made themselves, a step at a time.', 'You could not make ice. But you learned what the forge-masters knew:', 'even molten stone will hold you up, if you ask it to set at exactly the right moment.']) },
    vesper: {
      1: mem('The Lamplighter', ['A frozen harbour at dusk. One by one, lamps come alight along the sea wall.', 'Nobody sees who lights them. There is only a scarf, red against the snow, already at the next lamp.', 'The harbour sleeps safe because something it never sees walks the wall all night.', 'An old watchman raises his cup to the dark and says a name, fondly.'].concat(NAME('Vesper'))),
      2: mem('Behind You', ['A cutpurse on the harbour stair, running, laughing, certain he was clear.', 'He looked back to see how far behind you were.', 'You were not behind him.']),
      3: mem('The Long Cut', ['White light. A room with no shadows in it, built that way on purpose.', 'They forgot the one under the table.', 'You crossed the room in a single line. Everything on that line had been standing. Then it was not.']),
      4: mem('Stepping Stones', ['The harbour children ran on ice they froze under their own feet.', 'You could never do it their way. You did it yours:', 'a foot placed on a falling snowflake, a rooftop, a held breath - anything, for exactly as long as it was there.']) }
  };

  // ---------- game hooks ----------
  const _fresh = G.fresh;
  G.fresh = hero => { const s = _fresh(hero), h = D.heroes[hero]; if (h && h.mission) s.mission = h.mission; s.secrets = {}; return s; };
  const _ng = G.newGame; G.newGame = function (hero) { memoriesFor(hero); _ng(hero); };
  const _cg = G.continueGame; G.continueGame = function () {
    const s = SW.store.load();
    if (s) memoriesFor(s.hero);
    _cg();
    const S = G.state;
    if (S && G.scene === 'play') { S.secrets = S.secrets || {}; if (!S.mission && S.done['A2-1'] && !S.done['A2-2']) S.mission = 'A2-2'; }   // saves from before Act 2 existed
  };
  // dialogue `fn` hooks:  card:<id>   secret:<id>   flag:<name>
  const _hook = G.hook; G.hook = function (fn) {
    if (fn === 'slice_end') story.card('act1');
    else if (fn.indexOf('card:') === 0) story.card(fn.slice(5));
    else if (fn.indexOf('secret:') === 0) story.found(fn.slice(7));
    else if (fn.indexOf('flag:') === 0) G.setFlag(fn.slice(5));
    else _hook(fn);
  };

  // ---------- chapter cards ----------
  story.cards = {
    act1: { title: 'ACT 1 COMPLETE', lines: ['You have reached Scrapton, on the Surface.', '', 'Every hero wakes alone, in a different place.', 'From here on the road is the same for all of them:', 'ACT 2 starts at the bounty board.', '',
      'Each hero still talks their own way through it and', 'fights with their own abilities - and each has one', 'SECRET in Act 2 that nobody else can wake.', '', 'Still below: the Pit Arena, hidden shards, cracked walls.'] },
    act2: { title: 'ACT 2 - CHAPTER 1 COMPLETE', lines: ['The relay is dark and the Glowmother is dead.', 'Halcyon is feeding its second pulse with stolen memories.', '', 'This road is the same whoever walks it. What you find', 'on it is not: every hero has one SECRET here that only', 'they can wake - a hidden map, an event, or a boss.', 'Esc > Mission shows whether you have found yours.', '',
      'Try another hero from the title screen: a different', 'tutorial, different words, a different secret.', 'Next: the Crater, and the rift back up to the Spire.'] }
  };
  story.card = function (id) {
    if (!story.cards[id] || G.flag('card:' + id) || (id === 'act1' && G.flag('slice_card'))) return;
    G.setFlag('card:' + id); G.card = id; G.overlay = 'card'; SW.audio.sfx('level');
  };
  ui.drawCard = function (ctx, g) {
    const c = story.cards[g.card] || story.cards.act1, hero = g.hero();
    ctx.globalAlpha = 0.9; art.rect(ctx, '#05060c', 0, 0, W, SW.H); ctx.globalAlpha = 1;
    ui.panel(ctx, 60, 40, 360, 190, hero.color);
    text(ctx, c.title, W / 2, 52, '#f5c542', { align: 'center', scale: 2 });
    c.lines.forEach((l, i) => text(ctx, l, W / 2, 80 + i * 11, '#ffffff', { align: 'center' }));
    if (SW.frame % 40 < 26) text(ctx, 'J / Enter: keep going', W / 2, 212, '#8a92b8', { align: 'center' });
  };

  // ---------- secrets: one per hero, each a hidden map, an event or a boss ----------
  story.secrets = {
    stones:  { hero: 'kael',   kind: 'event', zone: 'Ash Dunes', name: 'The Standing Stones Answer', hp: 20, xp: 150, fx: 'storm' },
    alpha:   { hero: 'fenn',   kind: 'boss',  zone: 'Ash Dunes', name: 'The Pale Alpha', hp: 20, creds: 200 },
    hollow:  { hero: 'brakk',  kind: 'map',   zone: 'Ash Dunes', name: 'The Hollow', hp: 25, creds: 250 },
    chimes:  { hero: 'gale',   kind: 'event', zone: 'Ash Dunes', name: 'The Wind Remembers', hp: 20, xp: 150, fx: 'frost' },
    dud:     { hero: 'dyna',   kind: 'event', zone: 'Ash Dunes', name: 'The Last Ashfall Bomb', hp: 15, creds: 300, fx: 'storm' },
    choir:   { hero: 'nyra',   kind: 'map',   zone: 'Glowwild',  name: 'The Drowned Choir', hp: 25, creds: 250 },
    eyrie:   { hero: 'isolde', kind: 'event', zone: 'Glowwild',  name: 'The Last Eyrie', hp: 20, xp: 150, fx: 'frost' },
    unit03:  { hero: 'pyra',   kind: 'boss',  zone: 'Glowwild',  name: 'Retrieval Unit 03', hp: 20, creds: 200 },
    vent:    { hero: 'ashka',  kind: 'event', zone: 'Glowwild',  name: 'The Sleeping Vent', hp: 20, xp: 150, fx: 'storm' },
    courier: { hero: 'vesper', kind: 'event', zone: 'Glowwild',  name: "The Courier's Last Run", hp: 15, creds: 300, fx: 'frost' }
  };
  story.found = function (id) {
    const s = story.secrets[id], S = G.state, p = G.player, h = G.hero();
    S.secrets = S.secrets || {};
    if (!s || S.secrets[id]) return;
    S.secrets[id] = true;
    if (s.hp) { S.hpBonus = (S.hpBonus || 0) + s.hp; S.hp += s.hp; }
    if (s.creds) S.creds += s.creds;
    S.energy = 300;
    SW.audio.sfx('shard'); fx.flash(h.colorHi, 12); fx.shake(5, 18);
    if (p) {
      fx.ring(p.x, p.y - 16, h.colorHi, 6, 80, 28);
      if (s.fx === 'storm') for (let i = 0; i < 7; i++) fx.bolt(p.x + SW.rand(-90, 90), G.cam.y - 10, p.x + SW.rand(-40, 40), p.y - SW.rand(0, 30), h.colorHi);
      if (s.fx === 'frost') for (let i = 0; i < 40; i++) fx.list.push({ k: 'p', x: p.x + SW.rand(-70, 70), y: p.y - SW.rand(0, 90), vx: SW.rand(-1, 1), vy: SW.rand(-1.6, -0.2), g: 0, life: 40, max: 40, col: i % 2 ? h.colorHi : '#ffffff', s: 2 });
    }
    G.toast('SECRET FOUND: ' + s.name, '#f5c542');
    G.toast([s.hp ? '+' + s.hp + ' max HP' : '', s.creds ? '+' + s.creds + ' creds' : ''].filter(Boolean).join('    '), '#7dffa0');
    if (s.xp) G.addXP(s.xp);
    G.saveGame();
  };
  story.mine = hero => Object.keys(story.secrets).filter(id => story.secrets[id].hero === hero);

  // pause menu > MISSION: this hero's secret, and the right words once Act 2's first chapter is done
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 0) return;
    const S = g.state, hero = g.hero();
    if (!M[S.mission] && S.done['A2-3']) {
      const end = S.done['A2-4'];   // the Crater (story-crater.js)
      art.rect(ctx, '#080916', 16, 34, 440, 44);
      text(ctx, end ? 'Act 2 complete' : 'Act 2, chapter 1 complete', 26, 40, '#f5c542', { scale: 2 });
      text(ctx, end ? 'Free roam. Act 3, Convergence, is the next build. Every hero has their own tutorial and secret.' : 'Free roam. Next chapter: the Crater. Each hero has their own tutorial and secret - try another.', 26, 64, '#ffffff');
    }
    story.mine(S.hero).forEach((id, i) => {
      const s = story.secrets[id], got = S.secrets && S.secrets[id], y = 186 - i * 52;
      ui.panel(ctx, 286, y, 168, 48, got ? '#7dffa0' : hero.color, 0.6);
      text(ctx, hero.name.toUpperCase() + "'S SECRET", 294, y + 6, '#f5c542');
      SW.wrap(got ? s.name + ' - found.' : 'A hidden ' + s.kind + ' in the ' + s.zone + ' that only ' + hero.name + ' can wake.', 152).slice(0, 3).forEach((l, k) => text(ctx, l, 294, y + 18 + k * 10, got ? '#7dffa0' : '#c8ccd8'));
    });
  };
  // hero select: say where the highlighted hero wakes up
  const _ds = ui.drawSelect; ui.drawSelect = function (ctx, g) {
    _ds(ctx, g);
    const id = D.heroOrder[ui.sel.i], h = D.heroes[id], zn = h && h.start && SW.zones[h.start.zone];
    if (zn && g.unlocked(id) && typeof ui.sel.code !== 'string') text(ctx, 'Wakes in: ' + zn.name, W - 10, 235, '#8a92b8', { align: 'right' });
  };

  // ---------- ACT 1: the road each bonus hero joins, in their own words ----------
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  L.m_ferro1 = [
    say('ferro', { _: "So the tags led you here. I painted them - the storm-eye, the old mark of Vharra. Our mark, boy.",
      fenn: "So the tags led you here. I painted them - the storm-eye, the old mark of Vharra. You know it. I can see that you know it.",
      brakk: "So it is true. The miners dug up a mountain and it walked into my market. Look at the tags, big one: the storm-eye. The mark of Vharra.",
      gale: "A boy who fell down Stack Four and did not break. Nan Coil sent word. Look at the tags, lad: the storm-eye. The mark of Vharra.",
      dyna: "You are the one who blew a hole in the Scrapworks. I felt it through the floor. Look at the tags, girl: the storm-eye. The mark of Vharra." }),
    say('hero', { _: 'Vharra. The grass. The thunderheads. I saw it in the shard.', fenn: 'The steppe. The herd. A wolf made of stormlight. I saw it in the shard.', brakk: 'A ring of stones. Children following my shadow. I saw it in the shard.',
      gale: 'A ridge where the wind never stops. Someone shouting my name. I saw it in the shard.', dyna: 'A festival. A sky gone gold. Everyone shouting my name. I saw it in the shard.' }),
    say('ferro', { _: "When the sky tore, it did not only take our home. It shredded what we WERE - memory, power - into Memory Shards.",
      fenn: "A storm-hound of the hunting clans. I thought the tear took all of you. It shredded what we WERE, hunter - memory, power - into Memory Shards.",
      brakk: "A Warden of the Standing Stones. I did not think to see one again. The tear shredded what we WERE - memory, power - into Memory Shards.",
      gale: "A ridge-runner. The kite clans. The tear did not only take our home, lad: it shredded what we WERE - memory, power - into Memory Shards.",
      dyna: "The festival-makers! We could hear your clan three valleys away. The tear shredded what we WERE - memory, power - into Memory Shards." }),
    say('ferro', "Find them and you find yourself. The Pit pays in creds and rumours: win three ranked fights and people will talk to you.", { step: 'N1-2:ferro' }),
    say('ferro', "And know this: Grist the Rat King holds the only shaft to the surface. You are not ready for the Sump. Yet.")
  ];
  L.n_thessaly = [
    say('thessaly', { _: "Child of the ice... I do not know your face. But I know your note.", isolde: "Falconer. I know the eyrie-cold when I feel it. I did not think any of the high houses lived.",
      pyra: "...Forge-daughter. I can feel the heat of you through the glass. I had forgotten what warm was.", ashka: "Ember-carrier. The deep vents sent one of their own. Then the forge is not wholly dark.",
      vesper: "...There you are. I heard nothing, and so I knew it was you. The harbour's shadow." }),
    say('hero', { _: "They're draining you.", pyra: "They're draining you. I'll melt this thing open -", vesper: 'They are draining you. Tell me who holds the key.' }),
    say('thessaly', { _: "To feed their Engine. There is little of me left. Better that it sings in your hand than in their machine.", isolde: "To feed their Engine. There is little of me left. Better that it flies with you than turns their wheels.",
      pyra: "No. The cell is all that holds me together now. But every blade I ever sang was quenched in a fire like yours. Let me give something back.",
      ashka: "To feed their Engine - as they fed it with you. There is little of me left. Take it, before the machine does.", vesper: "No one you can reach tonight. There is little of me left. Take it - and spend it on them, quietly." }),
    say('sys', { _: 'She sings one long, cold note. Coolant climbs out of the cell wall and hardens in your grip.', isolde: 'She sings one long, cold note. The air in the cell goes still - and something in you remembers how to make it STOP.',
      pyra: 'She sings one long note. The fire in your chest answers: not forward this time, but outward, like a hearth.', ashka: 'She sings one long note. Far under the floor, something molten turns over and listens for your foot.',
      vesper: 'She sings one long note, and for its whole length the cell has no shadows but yours. You learn where the next one will be.' }, { memory: 'nyra_2', step: 'I1-3:free' }),
    say('thessaly', "Go. The docks. In this city the only way out is DOWN.")
  ];
  Object.assign(L, {
    'o_grist@fenn': [say('grist', "Holt's stray. You put down my kennel-master, and now you track mud into my Sump."), say('grist', "I have skinned bigger dogs than you. Everything that goes UP pays me.", { fn: 'boss_start' })],
    'o_grist@brakk': [say('grist', "Crake's 'find'. He promised me a cut of you. Now I will have to take the whole thing."), say('grist', "Everything that goes UP pays me. Even mountains.", { fn: 'boss_start' })],
    'o_grist@gale': [say('grist', "The little draught that blew Big Bellows over. The Breath Guild paid me well. Paid."), say('grist', "Everything that goes UP pays me, boy. Even the wind.", { fn: 'boss_start' })],
    'o_grist@dyna': [say('grist', "The bench-girl. Korr sold me good powder for ten years, until you. I am going to take that out of your hands."), say('grist', "Everything that goes UP pays me. Bang or no bang.", { fn: 'boss_start' })],
    's_brandt@isolde': [say('brandt', "Subject 52. Cold storage was a kindness. I argued for disposal."), say('hero', 'Then you should have argued harder.'), say('brandt', "I intend to correct the oversight.", { fn: 'boss_start' })],
    's_brandt@pyra': [say('brandt', "Subject 44. You cost the Ascendancy an entire sector. The board wants you extinguished. Personally."), say('hero', 'Get in line.'), say('brandt', "I am the line.", { fn: 'boss_start' })],
    's_brandt@ashka': [say('brandt', "Subject 60. Half of Aurelia is wearing coats indoors because of you."), say('hero', 'Good.'), say('brandt', "You will be back on the tap by nightfall.", { fn: 'boss_start' })],
    's_brandt@vesper': [say('brandt', "Subject 77. I did not hear you arrive. I never do. It is the one thing about you I respect."), say('hero', 'You will not hear me leave.'), say('brandt', "You will not be leaving.", { fn: 'boss_start' })]
  });

  // ---------- ACT 2: one road, ten voices ----------
  Object.assign(L, {
    r_marlo: [
      say('marlo', "Easy, stranger. Scrapton's caravans take in anyone who walks out of the Flats alive."),
      say('marlo', "Name's Marlo. That shadow up there is Aurelia. Everything down here is what it threw away. Us included."),
      say('marlo', { kael: "White hair, static coming off you... you're the 'Sparks' off the Deepline posters. Funny: there are old stones out in the Ash Dunes that crackle the same way.",
        nyra: "That's a Halcyon test gown under the dust. Nobody falls out of the sky by accident, girl. I won't ask. Yet.",
        fenn: "The camp dogs have gone quiet since you walked in. Last thing that spooked them like that left a pile of bones out in the Dunes.",
        isolde: "Frost on your sleeves. In THIS heat. I've hauled strange cargo for thirty years; you're the first that made me shiver.",
        brakk: "Saints, you're a big one. There's a cave in the Dunes plugged by a rock with hand-prints on it. Your size. I always wondered.",
        pyra: "You smell like a lab fire. Don't look at me like that - half my drivers have burned a boss's office down. You're among friends.",
        gale: "The turbines all turned to face you when you walked in. Every one. There's a wreck in the Dunes hung with chimes that does the same on still days.",
        ashka: "The sand's gone to glass where you were standing. I'm not complaining. Odile's been wanting a window.",
        dyna: "You've been eyeing my powder store since you got here. There's a dud from the old war half-buried in the Dunes, if you want something worth looking at.",
        vesper: "I counted my knives after you walked past. All there. I counted again. Still all there. That's somehow worse." }),
      say('marlo', "Odile will see to your cuts. When you can stand up straight, read the bounty board: I have a problem only an outsider can fix.", { step: 'A2-1:marlo', fn: 'card:act1' })
    ],
    r_marlo2: [say('marlo', "West is the Ash Dunes. East, the Glowwild. Neither one is safe, which is why the pay is good. The notice is on the board.")],
    r_marlo3: [say('marlo', "The relay's in the Glowwild, east. Juniper is camped at the tree line - she'll point you at it.")],
    r_marlo_back: [
      say('marlo', "All three drivers walked in an hour ago, swearing a ghost story broke the Baron's road. So it's true."),
      say('marlo', "400 creds, as posted.", { give: { creds: 400 } }),
      say('marlo', { kael: "You fight like you're paying something back, Sparks. Whoever taught you to hate a shakedown - I'd shake their hand.",
        nyra: "You didn't touch the Baron's stash. People from up there always take the stash. You're not from up there, are you? Not really.",
        fenn: "The dogs follow you round the camp now. All of them. I'm trying not to take it personally.",
        isolde: "My drivers say you asked each of them if they were hurt before you asked where the Baron was. I noticed that.",
        brakk: "They say you carried two of my drivers out. One under each arm. You've a place at this fire as long as you want it.",
        pyra: "They say the Baron's throne is still burning. I'm not going to ask. I'm going to pour you a drink.",
        gale: "They say the dust storm that's blown over that wreck for ninety years just... stopped, when you walked in. I believe them.",
        ashka: "They say the sand round the Baron's wreck is one sheet of glass now. Tidy. I like tidy.",
        dyna: "They heard it from HERE, girl. Odile dropped a tray. Next time you take a job, warn the camp.",
        vesper: "The drivers say they never saw you. They say the raiders never saw you either. That's the part that's keeping them up." }),
      say('marlo', "Halcyon stamps on raider crates. They're feeding the Baron to keep us out of the east. There's a relay tower in the Glowwild - find out what it's for.", { step: 'A2-2:marlo' }),
      say('odile', "I've fitted one of the filters to a mask for you. It'll hold in the Glowwild. It won't make it SAFE. Nothing does.")
    ],
    r_board: [
      say('sys', "BOUNTY BOARD. One notice is nailed over all the others, in Marlo's hand:"),
      say('sys', "WANTED: 'THE SCRAP BARON'. Raider king of the Ash Dunes. He took the caravan's radiation filters, and the three drivers carrying them.\nReward: 400 creds - and a filter, if you mean to go east.", { step: 'A2-2:board' }),
      say('hero', { kael: "(Someone squeezing people who can't pay. I know how this one goes.)", nyra: "(Filters. The Glowwild is east. Everything Halcyon dumps ends up east.)", fenn: '(A hunt. Good. I was getting tired of being the quarry.)',
        isolde: '(Three drivers taken. Then three people are waiting for someone to come.)', brakk: '(They took people. That is enough reason.)', pyra: "(A king. Of scrap. I've burned better thrones than that.)",
        gale: '(West. Open sky the whole way. I was going to go anyway.)', ashka: '(They took people to make a point. I can make a larger one.)', dyna: "(A fortified wreck full of stolen powder. That's not a bounty. That's a present.)", vesper: '(Three hostages. One way in that he knows about. Good.)' })
    ],
    r_board_early: [say('sys', 'BOUNTY BOARD. A caravan guard waves you off: "Marlo vets every outsider first. Go and talk to him."')],
    r_board_wait: [say('sys', "BOUNTY BOARD. The Scrap Baron's notice is still up. The Ash Dunes are WEST of town.")],
    r_board_done: [say('sys', "BOUNTY BOARD. Someone has drawn a crown on the Scrap Baron's notice and crossed it out. The new jobs are all for the Glowwild, EAST.")],
    // ----- Ash Dunes -----
    d_enter: [
      say('sys', 'The Ash Dunes. Ninety years of fallout, blown into hills. The wind never quite stops talking.'),
      say('hero', { kael: '(No roof. No walls. I keep waiting for the ceiling.)', nyra: '(So much sky. From below, it looks almost kind.)', fenn: '(Open ground. Finally. I can smell them from here.)', isolde: '(Grey as an old winter. But nothing here is cold.)',
        brakk: '(Ash is only stone that gave up. Poor ground. It wants to be solid again.)', pyra: "(Somebody burned a whole world and didn't even stay to watch. Amateurs.)", gale: '(Oh. OH. There is so much ROOM.)',
        ashka: '(Dead ash. No heat left in any of it. I could fix that.)', dyna: '(Blast pattern, ninety years old. Airburst. Sloppy fusing. I could have done it with a third of the yield.)', vesper: '(No cover for a mile. I do not like it. So I will be quick.)' })
    ],
    d_camp: [
      say('raider', "Toll road, stranger. The toll is everything you're carrying."),
      say('hero', { kael: "The road's closed for collections.", nyra: 'I carry nothing you could lift.', fenn: 'You are standing upwind. That was your mistake.', isolde: 'Then come and weigh it.', brakk: 'No.', pyra: "Careful. I'm carrying a LOT.",
        gale: "You'd have to catch me first.", ashka: 'Take it, then. Mind your hands.', dyna: "Sure. Catch.", vesper: '...' })
    ],
    d_camp_win: [say('sys', "The outpost falls quiet. Cut ropes on the ground: the drivers were held here, then dragged WEST, toward the Baron's wreck.")],
    d_baron: [
      say('baron', "So you're what's been breaking my toll road. One outsider. I've had three caravans' worth of guards beg slower than you walked in."),
      say('baron', { K: "You've got Deepline on your boots. Grist's old shaft? I paid that rat for every soul he sent up. You cost me a supplier.", N: "Sky-city cloth. Halcyon pays well for anything that falls off Aurelia - and better for anything that JUMPS." }),
      say('hero', { kael: 'Then put it on my tab.', nyra: 'You will not be collecting.', fenn: 'A king with no pack. Only hired teeth. This will be short.', isolde: 'Let the drivers go. I will not ask again.', brakk: 'Step away from the people.',
        pyra: "Everybody keeps trying to SELL me. It's getting old.", gale: "You can't put a toll on the wind. People keep trying.", ashka: 'You are standing on sand. That was a choice.', dyna: "Nice wreck. Structural? Shame.", vesper: 'You talk a great deal for a man with his back to a door.' }),
      say('baron', "Everything that crosses the ash pays the Baron. Flesh spends as well as creds.", { fn: 'boss_start' }),
      say('sys', 'Hold S to GUARD his club. When he flashes white he CHARGES: dash (L) through him and he dazes himself on the wall.\nHis firebombs leave burning ground - keep moving.')
    ],
    d_baron_win: [
      say('baron', "...Take them. Take the filters. The ash... keeps what it's owed... anyway."),
      say('sys', "Behind his throne of welded car-hoods: three drivers, alive, and a crate of Halcyon-stamped RADIATION FILTERS.", { flag: 'rad_filter', step: 'A2-2:boss' }),
      say('sys', 'The stamp on the crate is fresh. Someone in Aurelia has been SUPPLYING the Baron. Take the news back to Marlo, in Scrapton.')
    ],
    // ----- Glowwild -----
    g_enter: [
      say('sys', 'The Glowwild. The bombs fell hardest here - and then something from the torn sky seeped in and made it GROW.'),
      say('hero', { kael: '(Everything hums. Like a wire right before it bites.)', nyra: '(It is singing. Badly. A note with no one holding it.)', fenn: '(Wrong. Every scent here is wrong. Something sick is at the middle of it.)', isolde: '(Not one clean breath of air in the whole wood.)',
        brakk: '(The roots go down too far. They are drinking something they should not.)', pyra: "(It glows. I glow. One of us is going to have to leave.)", gale: '(The air is thick as soup. It does not want to move. I will have words with it.)',
        ashka: '(Warm ground. But the wrong warm. Rot-warm.)', dyna: '(Residual output after ninety years? That is not fallout. Somebody is still FEEDING this.)', vesper: '(Everything is lit from underneath. Nowhere to stand unseen. Hateful.)' })
    ],
    g_juniper: [
      say('juniper', "Mask on? Good. Rule one of the Glowwild: if it glows, don't touch it. Rule two: everything glows."),
      say('juniper', "I'm Juniper. I scout for Marlo. There's a Halcyon relay tower east of here, humming like a kicked hive. It went up the same week the sky tore."),
      say('juniper', { kael: "Your hair's standing up. Mine does that near the tower, and I don't spark. Whatever it's broadcasting, it LIKES you.",
        nyra: "There's a crack in the rock past the old overpass that SINGS. One note, never stops. Marlo says I'm glow-sick. You hear it too, don't you?",
        fenn: "You're sniffing the air. Don't. ...What do you smell? Because the stalkers have been running FROM something.",
        isolde: "There's a dead tree by the old road that stays frozen. In this heat. I leave it offerings. Don't laugh.",
        brakk: "The ground shakes at night. Not quakes. More like breathing. Something big is under the roots.",
        pyra: "A Halcyon pod came down past the overpass last night. Red light, sweeping. It's LOOKING for something. Not me - I checked.",
        gale: "No wind in here. Ever. You're the first breeze I've felt in the Glowwild in six years, and you're a person.",
        ashka: "There's a vent out by the relay that used to steam. Went cold the day the tower switched on. Like something put its hand over it.",
        dyna: "Don't touch the relay's power cells. I mean it. ...Why are you smiling?",
        vesper: "A Halcyon courier went in ahead of the tower crew and never came out. Carrying something he wasn't supposed to have, the story goes." }),
      say('juniper', "The Husks are thick near the tower. Fists go straight through them - use whatever it is you people use.", { step: 'A2-3:scout' })
    ],
    g_juniper2: [say('juniper', "Tower's east, past the pools and the overpass. Stay off the green water. Stay off the green EVERYTHING.")],
    g_relay: [
      say('sys', 'HALCYON RELAY 7-G. STATUS: HARVEST. Rift residue is being drawn out of the soil and beamed up to the Convergence Engine.'),
      say('sys', "LOG: 'Residue yield insufficient. Accelerant introduced to local fauna. One specimen has exceeded containment mass.'"),
      say('hero', { kael: "(They're farming the wound they made. And they FED something to do it.)", nyra: '(The second pulse. They are fuelling it with what is left of our worlds.)', fenn: '(Bait. They fattened a beast on stolen sky. Now it is loose.)',
        isolde: '(They do not even mourn what they break. They only weigh it.)', brakk: '(That is the breathing under the roots. They woke it.)', pyra: "(Of course there's a lab at the bottom of this. There's ALWAYS a lab.)",
        gale: '(That is why the air will not move. They have been holding its breath for it.)', ashka: '(They capped a vent to feed a machine. Twice now. They do not learn.)', dyna: "(That's a terrible containment spec. I'd be insulted if I weren't about to exploit it.)", vesper: '(A harvest. And a thing they could not hold. Both ends of this are mistakes.)' }),
      say('sys', 'You pull the main breaker. The hum dies. Somewhere east, something very large notices it is no longer being fed.', { flag: 'relay_off', step: 'A2-3:relay' })
    ],
    g_mother: [
      say('sys', 'The ground lifts. It is not the ground.'),
      say('hero', { kael: "...That's a big one.", nyra: 'So this is what they grow.', fenn: 'At last. Something worth hunting.', isolde: 'Poor thing. They made you hungry and left.', brakk: 'Easy. Easy now. ...No. It will not listen.', pyra: 'Oh, you are going to burn BEAUTIFULLY.',
        gale: 'I am going to need a bigger gust.', ashka: 'Come here. I will warm you through.', dyna: "Finally. A target the right SIZE.", vesper: 'Too large to hide from. Then I will not hide.' }, { fn: 'boss_start' }),
      say('sys', 'When it rears and flashes white, it CHARGES: jump it or dash (L) through, and it dazes itself on the wall.\nStay out of the glowing spit.')
    ],
    g_mother_win: [
      say('sys', 'The Glowmother folds in on herself. The light under her shell gutters - and something bright rolls free of the wreckage.'),
      say('sys', 'A Memory Shard. It was INSIDE her. Halcyon was not only harvesting residue. They were harvesting us.', { step: 'A2-3:boss' })
    ],
    // ----- secrets -----
    x_stones: [
      say('sys', 'Three standing stones, half drowned in ash. Under the grey there is a carved eye, with a storm inside it.'),
      say('hero', "(Storm-eye. OUR mark. These didn't fall from the sky. Somebody raised them. Somebody from home was HERE.)"),
      say('sys', 'You lay your hand flat on the stone. Every hair on your body stands up. The sky answers.', { fn: 'secret:stones' }),
      say('hero', '("You do not chase the storm. You give it somewhere to land." ...I hear you, old woman. I hear you.)')
    ],
    x_cairn: [
      say('sys', 'A cairn of bones, stacked the way a pack stacks them: skulls outward. A challenge-marker.'),
      say('hero', '(Something rules these dunes. Not the Baron. Something that hunts the hunters.)', { choice: [{ t: 'Howl', fn: 'flag:alpha_called' }, { t: 'Not yet' }] })
    ],
    x_alpha: [
      say('sys', 'Your howl rolls out across the ash. For a long moment, nothing. Then the dune itself stands up.'),
      say('hero', '(Pale as bone. Twice my height. It has been alpha here for a long time. It looks tired of it.)', { fn: 'boss_start' })
    ],
    x_alpha_win: [
      say('sys', 'The Pale Alpha falls. Out in the dunes, a dozen voices take up your howl. The pack has a new leader.'),
      say('hero', '(A pack. I have a pack again.)', { fn: 'secret:alpha' })
    ],
    x_boulder: [
      say('sys', 'A boulder the size of a house plugs a cave mouth. There are hand-prints worn into it. Very large hand-prints.'),
      say('hero', '(Someone my size moved this. Often. ...I think it was me.)', { choice: [{ t: 'Roll it', fn: 'flag:hollow_open' }, { t: 'Leave it' }] })
    ],
    x_hollow: [
      say('sys', 'The cavern is ringed with standing stones no taller than a child. Practice stones. A warden trained here.'),
      say('hero', '(Each one hums as I pass. They know me. I set them, one a year, for the children who followed me.)'),
      say('sys', "At the centre: a warden's cache, sealed with a slab only one pair of hands could lift.", { fn: 'secret:hollow' }),
      say('hero', '(I was not only pulled through the sky. I had been HERE before. My world and this one were already touching.)')
    ],
    x_chimes: [
      say('sys', 'A wrecked turbine, hung with hundreds of chimes cut from old tin. On a dead-still day, every one of them is ringing.'),
      say('hero', "(Kite-clan chimes. Tuned to the ridge wind. Somebody hung these to call it - and it CAME. It's been waiting here for someone to answer.)"),
      say('sys', 'You hold out your scarf. The whole wreck sings one chord, and the wind comes down out of the sky to stand beside you.', { fn: 'secret:chimes' }),
      say('hero', '(There you are. I thought I had lost you in the fall.)')
    ],
    x_dud: [
      say('sys', 'An Ashfall War bomb, nose-down in the ash, fins still on. Ninety years old. Unexploded. Ticking, very faintly.'),
      say('hero', "(Oh, you beautiful, terrible thing. Barometric trigger, corroded. Secondary still live. Nobody's dared touch you in ninety years.)"),
      say('sys', 'Eleven minutes, one spoon, and a great deal of muttering. The ticking stops. The core comes out in your hands, humming.', { fn: 'secret:dud' }),
      say('hero', "(I am keeping this. For a special occasion.)")
    ],
    x_seam: [
      say('sys', 'A seam of clear ice runs through the glowing rock, cold enough to burn. Inside it, very faintly, someone is singing.'),
      say('hero', "(A held note. A Tidesinger's note. It has been holding for a long time.)", { choice: [{ t: 'Sing back', fn: 'flag:choir_open' }, { t: 'Not yet' }] })
    ],
    x_choir: [
      say('echo', "...A voice. A living voice. Child, how long have we been singing?"),
      say('hero', 'I do not know. I do not remember the harbour. Only that it was cold, and it was home.'),
      say('echo', "Our ship came through the tear with you. We froze the hull so the glow could not take us. It took everything else."),
      say('echo', "We cannot leave the note. But you can carry it. Take what the choir has left - and sing it somewhere warm.", { fn: 'secret:choir' })
    ],
    x_choir2: [say('echo', "Go on, child. A song does not need its singers to be carried.")],
    x_eyrie: [
      say('sys', 'A dead tree, white with frost in the middle of the green heat. In its highest fork: a nest woven from ice.'),
      say('hero', '(An eyrie. Here. One of them came through with me - and it has kept this one tree cold all this time, waiting.)'),
      say('sys', 'You raise your arm. The frost on the branches stirs, and lifts, and becomes wings.', { fn: 'secret:eyrie' }),
      say('hero', '(You waited. Of course you waited. I am sorry it took me so long to remember your name.)')
    ],
    x_beacon: [
      say('sys', 'A Halcyon drop-pod, half sunk in the moss. Its beacon sweeps red. On the hatch: RETRIEVAL - SUBJECT 44.'),
      say('hero', '(They sent a machine all the way down here. For ME.)', { choice: [{ t: 'Kick it', fn: 'flag:unit_called' }, { t: 'Walk away' }] })
    ],
    x_unit: [
      say('sys', '"SUBJECT 44 CONFIRMED. THERMAL RETRIEVAL PROTOCOL. PLEASE REMAIN CALM AND NON-COMBUSTIBLE."'),
      say('hero', "You built it fireproof. That's adorable.", { fn: 'boss_start' })
    ],
    x_unit_win: [
      say('sys', 'Retrieval Unit 03 slumps, its plating run like wax. In its hold: your intake file, and everything they took off you.'),
      say('hero', '("Subject is to be recovered or DENIED TO OTHERS." ...Good. Let them be afraid.)', { fn: 'secret:unit03' })
    ],
    x_vent: [
      say('sys', 'A volcanic vent, capped with a Halcyon steel plug and gone cold. The moss around it is dead in a perfect circle.'),
      say('hero', '(They put a lid on it. To feed their tower. It has been holding its breath for months.)'),
      say('sys', 'You set both palms on the plug. It glows red, then white, then it is not a plug any more. The vent breathes out.', { fn: 'secret:vent' }),
      say('hero', '(There. Sleep, or wake - but nobody decides it for you. Not again.)')
    ],
    x_courier: [
      say('sys', 'A Halcyon courier, long dead, sat against a root as if resting. One hand is still closed round a sealed case.'),
      say('hero', '(He hid before he died. Well enough that his own people never found him. I would have chosen this spot too.)'),
      say('sys', 'The case opens to the third lock-pattern you try. Inside: creds, a field kit, and a list of every subject taken from the ice.', { fn: 'secret:courier' }),
      say('hero', '(Names. Mine is on it. So are forty others. ...Thank you, stranger. I will finish your run.)')
    ]
  });
  // what everyone else gets when they poke at somebody else's secret
  story.notYours = {
    stones: 'Standing stones, cold under the ash. They are waiting for someone else.', alpha: 'A cairn of old bones. Whatever answers here would not answer you.',
    hollow: 'A boulder the size of a house plugs a cave. Nobody could move that. Almost nobody.', chimes: 'A wreck hung with tin chimes. They are ringing, and there is no wind. Not for you.',
    dud: 'An unexploded bomb from the old war. You are not touching that. Someone braver, or madder, might.', choir: 'A seam of ice in the rock, humming one long note. It is not your song.',
    eyrie: 'A frozen tree in the green heat. Something is nesting in it, waiting for someone.', unit03: 'A Halcyon drop-pod. Its scanner sweeps over you and moves on. It wants someone else.',
    vent: 'A cold vent under a steel plug. Whatever could open that is not you.', courier: 'Something is hidden among the roots here. You cannot quite see where. Someone else would.'
  };

  // ---------- missions ----------
  Object.assign(M, {
    'A2-2': { title: 'Dust and Debts', hero: 'all', xp: 260, creds: 0, next: 'A2-3', steps: [
      { id: 'board', t: "Read Marlo's notice on the Scrapton bounty board" }, { id: 'camp', t: 'Break the raider outpost in the Ash Dunes (west)' },
      { id: 'boss', t: 'Bring down the Scrap Baron' }, { id: 'marlo', t: 'Take the news back to Marlo' }] },
    'A2-3': { title: 'What Grows in the Glow', hero: 'all', xp: 320, creds: 150, next: null, steps: [
      { id: 'enter', t: 'Enter the Glowwild (east of Scrapton)' }, { id: 'scout', t: "Find Juniper, Marlo's scout" }, { id: 'relay', t: 'Shut down the Halcyon relay tower' },
      { id: 'boss', t: 'Survive what the relay was feeding' }, { id: 'shard', t: 'Touch the Memory Shard' }] }
  });
  M['A2-1'].next = 'A2-2'; M['A2-1'].hero = 'all';
  Object.keys(M).forEach(k => { M[k].id = k; });
  D.world.forEach(w => { if (w.id === 'dunes' || w.id === 'glowwild') delete w.soon; });
})();
