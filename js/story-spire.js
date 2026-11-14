'use strict';
// Shattered Worlds — ACT 3, A3-5: the Halcyon Spire. Loaded after story-noble.js; only adds and wraps.
//   Vane opens the Spire's gate from the Chancery at the east end of the Noble Ring. Six floors, one after another:
//   1 the Atrium, 2 the Shard Vault (where Halcyon keeps the memories it harvested), 3 Lab 9, 4 Dr. Ilsa Morrow, head of
//   Lab 9, in the "final form" she made of herself, 5 the Engine Gallery, 6 Dr. Veyra Kessen in the Convergence mech.
//   Beaten, Kessen gives up the Engine core key and names who is waiting in the core. (The design document's lab chief is
//   an original character here; Kessen was already one.)
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, HR = D.heroes, text = SW.text;
  if (!story || !story.patch || !story.noble) return;
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const VIOLET = '#b48cff';

  // ================= cast =================
  E.morrow = { name: 'DR. ILSA MORROW', sub: 'Head of Lab 9, and what she made of herself', sheet: 'morrow', sheet2: 'morrow2', hp: 1100, dmg: 14, speed: 0.95, xp: 520, creds: 400, idle: 28, w: 22, h: 48,
    script: [['swings', { n: 2, reach: 60, col: '#c8ff9a' }, [3, 1]], ['lunge', {}, [1, 3]], ['lob', { n: 2, col: '#b8ff40', dmg: 7 }, [1, 2]], ['slam', { col: '#b8ff40', p2: true }, [2, 2]]] };
  // Morrow balance (level 15, four moves): the masher dies most fights; the careful player wins losing 40 to 63%. A Glass Husk
  // summon was tried and taken out, as with Vane's drones: the pile-up killed even the careful player half the time.
  // Kessen's mech uses the Act 1 Warden's fight patterns. The careful test player was written against exactly those patterns
  // and dodges nearly everything (5 to 21% lost at any setting tried), so its difficulty for a real player is unmeasured; at
  // this setting, with an Enforcer and a drone as escort, the masher dies about two fights in three.
  E.kessen = { name: 'DR. VEYRA KESSEN', sub: 'In the Convergence mech', sheet: 'kessenmech', hp: 1400, dmg: 20, speed: 0.9, xp: 640, creds: 520, boss: 'warden', idle: 36, w: 44, h: 72, heavy: true };
  Object.assign(D.speakers, {
    morrow: { name: 'Dr. Ilsa Morrow', sheet: 'morrow', pitch: 420 }, kessen: { name: 'Dr. Veyra Kessen', sheet: 'kessen', pitch: 470 },
    spire: { name: 'Spire Systems', sheet: 'hazmat', pitch: 620 }
  });
  const _init = art.init; art.init = function () {
    _init();
    try {
      const rc = story.recolor;
      rc('morrow', 'tusk', { top: '#3a2e5a', skin: '#a8b89a', pants: '#1c1830' }, { '#6b5234': '#4a5a3a', '#b8bcc8': '#c8ff9a', '#ff3ea5': '#b8ff40' }); rc('morrow2', 'morrow', { top: '#5a2a6a' });
      rc('kessen', 'isolde', { hair: '#c8c8d0', top: '#e8ecf4', pants: '#3a2e5a' }, { '#9ad8ff': VIOLET });
      rc('kessenmech', 'warden', null, { '#e6e8ee': '#3a3058', '#b9c0ce': '#2a2440', '#f8fafc': '#5a4a88', '#9aa2b4': '#463a6a', '#d9b45a': VIOLET });
    } catch (e) { console.error(e); }
  };

  // ================= mission =================
  M['A3-5'] = { id: 'A3-5', title: 'The Spire', hero: 'all', xp: 640, creds: 500, next: null, steps: [
    { id: 'gate', t: 'Enter the Halcyon Spire through the Chancery (east end of the Noble Ring)' }, { id: 'ledger', t: 'Read the harvest ledger in the Shard Vault' },
    { id: 'morrow', t: 'Get through Lab 9' }, { id: 'kessen', t: 'Reach the top floor and stop Dr. Kessen' }, { id: 'key', t: 'Take the Engine core key' }] };
  if (M['A3-4']) M['A3-4'].next = 'A3-5';
  const _cg = G.continueGame; G.continueGame = function () {
    _cg();
    const S = G.state;
    if (S && G.scene === 'play' && !S.mission && S.done['A3-4'] && !S.done['A3-5']) S.mission = 'A3-5';
  };
  D.world.forEach(w => { if (w.id === 'spire') delete w.soon; });
  story.cards.act3c.lines = ['The control relays are cut. The Noble Ring is awake,', 'and very, very angry.', '', 'Lord Castellan Vane rides with you now.', 'Halcyon has one place left to stand: the Spire.', '',
    'NEXT: the Spire. Vane will open its gate from the Chancery.', 'Esc > Mission.'];
  story.cards.act3d = { title: 'THE SPIRE HAS FALLEN', lines: ['Six floors. Dr. Morrow. Dr. Kessen.', 'You hold the key to the Engine core.', '', 'Kessen built the Engine to save this city.', 'Somebody else is using it now - and has been for a year.', '',
    'Next build: the Engine core, and the ending.', '', 'Until then: free roam.'] };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 0 || M[g.state.mission] || !g.state.done['A3-5']) return;
    art.rect(ctx, '#080916', 16, 34, 440, 44);
    text(ctx, 'Act 3: you hold the Engine core key', 26, 40, '#f5c542', { scale: 2 });
    text(ctx, 'Free roam. Next build: the Engine core, and the ending.', 26, 64, '#ffffff');
  };

  // ================= the zone: six floors end to end =================
  const FLOORS = [['THE ATRIUM', 0], ['THE SHARD VAULT', 40], ['LAB 9', 80], ['DR. MORROW', 120], ['THE ENGINE GALLERY', 162], ['THE SUMMIT', 202]];
  Z.spire = {
    name: 'The Halcyon Spire', theme: 'vs_spire', music: 'lab', w: 244, h: 23,
    build(z, g) {
      const on = gg => gg.state.mission === 'A3-5';
      z.ground(0, 243, 20).fill(243, 0, 1, 20);
      z.spawn('gate', 3, 19).spawn('top', 238, 19);
      z.exit(0, 8, 1, 12, 'noble', 'spire');
      z.trigger(3, 6, 4, 14, gg => { if (on(gg)) { gg.step('A3-5:gate'); gg.say('s3_enter'); } }, { flag: 'a3_spire_in' });
      FLOORS.forEach((f, i) => {
        const x = f[1];
        if (i) { z.prop('door', x, 19).prop('banner', x - 2, 19, { col: VIOLET }).prop('banner', x + 2, 19, { col: VIOLET }); }
        z.trigger(i ? x + 1 : 5, 0, 2, 20, gg => gg.toast('FLOOR ' + (i + 1) + ' / 6 - ' + f[0], VIOLET), { flag: 'spire_f' + (i + 1) });
      });
      // 1 the Atrium
      [10, 26].forEach(x => z.prop('lamp', x, 19, { glow: VIOLET, gy: 46, gr: 22 }));
      z.arena({ id: 'atrium', x0: 8, x1: 38, gy: 19, gh: 12, intro: 's3_atrium', armed: on, enemies: [['veilguard', 26, 19], ['veilguard', 32, 19], ['veilenf', 34, 19], ['drone', 30, 14]] });
      // 2 the Shard Vault
      z.save(42, 19, 'glyph');
      [48, 54, 66, 72].forEach(x => z.prop('cryotank', x, 19));
      z.thing('console', 60, 19, { prompt: 'Read the harvest ledger', glow: VIOLET, when: gg => on(gg) && !gg.state.steps['A3-5:ledger'], use: gg => gg.say('s3_ledger') });
      z.arena({ id: 'vault', x0: 44, x1: 78, gy: 19, gh: 12, armed: on, enemies: [['glasshusk', 62, 19], ['glasshusk', 70, 19], ['hazmat', 66, 19], ['veilguard', 74, 19]] });
      // 3 Lab 9
      [86, 94, 104, 112].forEach((x, i) => z.prop(i % 2 ? 'pod' : 'tank', x, 19));
      z.arena({ id: 'lab9', x0: 82, x1: 118, gy: 19, gh: 12, intro: 's3_lab9', armed: on, enemies: [['stalker', 100, 19], ['stalker', 108, 19], ['veilenf', 104, 19], ['glasshusk', 112, 19]] });
      // 4 Dr. Morrow
      z.save(122, 19, 'glyph');
      z.prop('cell', 140, 19, { glow: '#b8ff40', gy: 26, gr: 30 });
      z.arena({ id: 'morrow', x0: 124, x1: 160, gy: 19, gh: 12, boss: true, intro: 's3_morrow', win: 's3_morrow_win', music: 'boss', armed: on, enemies: [['morrow', 150, 19]], onWin: gg => gg.step('A3-5:morrow') });
      // 5 the Engine Gallery
      [168, 180, 192].forEach(x => z.prop('relay', x, 19, { glow: VIOLET, gy: 82, gr: 24 }));
      z.arena({ id: 'gallery', x0: 164, x1: 200, gy: 19, gh: 12, intro: 's3_gallery', armed: on, enemies: [['veilenf', 184, 19], ['veilenf', 192, 19], ['veilguard', 188, 19], ['drone', 180, 14], ['drone', 196, 14]] });
      // 6 the Summit
      z.save(204, 19, 'glyph');
      z.prop('emitter', 236, 19, { glow: VIOLET, gy: 82, gr: 30 });
      z.arena({ id: 'kessen', x0: 206, x1: 242, gy: 19, gh: 12, boss: true, intro: 's3_kessen', win: 's3_kessen_win', music: 'boss', armed: on, enemies: [['kessen', 232, 19], ['veilenf', 222, 19, { hp: 110 }], ['drone', 226, 14, { hp: 22 }]], onWin: gg => gg.step('A3-5:kessen') });
      z.npc('kessen', 230, 19, { name: 'Dr. Veyra Kessen', face: -1, fixed: true, when: gg => !!gg.state.steps['A3-5:kessen'], talk: gg => (gg.state.steps['A3-5:key'] ? 's3_kessen3' : 's3_kessen2') });
    }
  };
  // NPCs that only stand there once their moment has come
  const _nd = SW.NPC.prototype.draw; SW.NPC.prototype.draw = function (ctx, cam) { if (this.when && G.zone && G.zone.id === 'spire' && !this.when(G)) return; return _nd.call(this, ctx, cam); };
  story.patch('noble', (z, g) => {
    z.spawn('spire', 164, 19);
    z.thing('door', 166, 19, { prompt: 'Enter the Spire', glow: VIOLET, when: gg => !!(gg.state.done['A3-4'] || gg.state.mission === 'A3-5'), use: gg => gg.gotoZone('spire', 'gate') });
  });

  // ================= the words =================
  const HERO_KESSEN = {
    kael: "You built the thing that dropped me in the trash. I'd like a word. Several.", nyra: 'You built the tank I woke up in. I have come to return it.',
    fenn: 'You hunted us across two worlds. The hunt has turned.', isolde: 'You took the sky from the falcons. I have come to take it back.',
    brakk: 'You tore the ground out from under my people. Step down.', pyra: "Hi. Remember Sector 4? I do.",
    gale: "Your Engine stopped the wind on my ridge. I'm here to start it again.", ashka: 'You tapped me like a well. I am not dry yet.',
    dyna: "So you're the one with the big machine. Mine's smaller. Mine works.", vesper: 'I have read your name on forty files. Now I have seen your face.',
    orin: 'You opened a door you did not know how to close. I do.', mira: "Look at the glass behind you, Doctor. That's you. That's what you did.",
    noct: '...It ends here.', bando: "You're a long way up, Doctor. Not far enough.", aldric: 'Climb down from the machine and answer for it.',
    sen: 'One stroke. You know which.', vega: 'Everything you built is very heavy now. Let it fall.',
    tessa: "I've seen what happens if you fire that Engine again. You won't.", jax: "Last hand, Doctor. Show your cards.",
    ferra: "That suit's got forty tonnes of metal in it. Every bolt of it can hear me.", kiri: 'You tore our pages out. I have come to put them back.',
    tarn: "End of the road, Doctor.", maren: 'You have been ill a long time, Doctor. This is the cure.',
    yara: 'I have been aiming at this floor since the bottom of the lift.', brann: 'You let the winter in. I am closing the door.'
  };
  Object.assign(L, {
    s3_enter: [
      say('sys', 'The Halcyon Spire. Six floors of glass and violet light, stacked on the underside of the sky. Vane holds the door behind you.'),
      say('vane', 'The core is under the summit, and only Kessen holds its key. Every floor between here and there will try to stop you.'),
      say('partner', { K: 'Six floors. One at a time, then.', N: "Six floors. Let's take 'em one at a time." })
    ],
    s3_atrium: [say('spire', 'INTRUDERS IN THE ATRIUM. LOCKDOWN. ALL FLOORS.')],
    s3_ledger: [
      say('sys', 'HARVEST LEDGER. Shard yields by subject, by date, by weight. Thousands of lines. Some of the names you know.'),
      say('hero', { K: "(Every name on this list is somebody's whole life, crushed into a stone and weighed.)", N: '(They did not only take our power. They took the memories and catalogued them like ore.)' }),
      say('partner', { K: 'Look at the bottom. The yields go up, every month. They are not storing these. They are FEEDING them to something.', N: "Check the last column. They're not keeping them. They're feeding them to something. Up top." }),
      say('sys', 'Destination, every line: CORE. Authorised by: THE DIRECTOR.', { step: 'A3-5:ledger' })
    ],
    s3_lab9: [say('spire', 'LAB 9 SPECIMENS RELEASED. LET THEM PLAY.')],
    s3_morrow: [
      say('sys', 'At the back of Lab 9, something large rises out of a nutrient tank. It still wears what is left of a lab coat.'),
      say('morrow', 'Lab 9 is closed to visitors. ...You. YOU. I know you. I took you apart, cell by cell, and you got up and walked out.'),
      say('hero', { K: "You put me in a jar. I'm going to put you in one.", N: 'You took me apart. I am back. And you are not.' }),
      say('morrow', 'I took the residue into myself. I am what the Engine was meant to make of everyone. Let me show you what you could have been.', { fn: 'boss_start' }),
      say('sys', 'Hold S to GUARD her claws. Dash (L) through the glowing spit.\nWhen she is badly hurt she starts slamming the floor: jump the shockwave.')
    ],
    s3_morrow_win: [
      say('morrow', '...It was... supposed to... make us... better.'),
      say('partner', { K: 'It made her what she did to everyone else. ...Come on. Two more floors.', N: "It made her exactly what she did to us. ...Two floors left. Let's finish it." })
    ],
    s3_gallery: [say('spire', 'ENGINE GALLERY. FINAL LINE. NO RETREAT AUTHORISED.')],
    s3_kessen: [
      say('sys', 'The summit. Through the floor you can feel it: the Convergence Engine, turning over, slow and enormous. A woman stands at the controls of a war-mech.'),
      say('kessen', 'Dr. Veyra Kessen. I built the Engine. I am the reason any of you are here, and I am the reason this city is still in the sky.'),
      say('hero', HERO_KESSEN),
      say('kessen', 'You do not understand what is under this floor. I am the only one who does. I will not let you near it.'),
      say('sys', 'The mech is heavy and armoured, and it has an escort. Hold S to GUARD the sweeps; jump or dash (L) through the beam.\nAt half health it changes how it fights.')
    ],
    s3_kessen_win: [
      say('sys', 'The mech goes down on one knee, smoking. The cockpit opens. Kessen climbs out, and does not run.'),
      say('kessen', 'Enough. ...Enough. You fight like people who have something to go home to. I had forgotten what that looks like.')
    ],
    s3_kessen2: [
      say('kessen', 'I built the Engine to keep Aurelia in the sky. The first test tore two worlds into ours. I have spent every day since trying to put them back.'),
      say('kessen', "The Director would not let me. He said a second pulse would weld the three worlds together for good, and the power would never run out. He built the veil. He built the chips. A year ago he went down into the core, and he has not come out."),
      say('partner', { K: 'Then he is the one who put the veil on us.', N: "So he's the one who set us on each other." }),
      say('kessen', 'The core key. The Engine can be run backwards, once. Everyone home, with everything they lost. I could never get past him to do it. Perhaps you can.', { step: 'A3-5:key', fn: 'card:act3d' })
    ],
    s3_kessen3: [say('kessen', 'The core is under this floor. The Director is waiting in it. He knows you are coming. He has known for a very long time.')]
  });
  story.spire = { FLOORS };
})();
