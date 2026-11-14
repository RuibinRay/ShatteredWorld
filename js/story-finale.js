'use strict';
// Shattered Worlds — ACT 3, A3-6: Convergence, and the ending. Loaded after story-spire.js; only adds and wraps.
//   With Kessen's key, go down from the Spire's summit into the Engine core. The Director of Halcyon (an original character
//   in the design document's villain role) has spent a year inside it. Three phases, back to back:
//     1 the Director himself;  2 the Director, fused with the Engine;  3 THE CONVERGENCE, his last form.
//   Before phase 3 your partner arrives and fights beside you (called in every twelve seconds), and your ultimate unlocks.
//   Then the Engine runs backwards, once: everyone goes home with their memories, Aurelia settles slowly to the ground,
//   and its stored power goes to the people below. Secret ending, with all 60 minor shards: a scene after the credits.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, HR = D.heroes, text = SW.text, W = SW.W, H = SW.H, rand = SW.rand;
  if (!story || !story.patch || !story.spire || !story.act3) return;
  const sfx = n => SW.audio.sfx(n);
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const VIOLET = '#b48cff', rival = story.act3.rival;

  // ================= the Director, in three forms =================
  E.director = { name: 'DIRECTOR CALDER SAYLE', sub: 'Head of Halcyon', sheet: 'director', sheet2: 'director2', hp: 900, dmg: 15, speed: 1.15, xp: 300, creds: 0, idle: 24, w: 14, h: 36,
    script: [['swings', { n: 3, reach: 54, col: '#e8d8ff' }, [3, 1]], ['lunge', {}, [1, 3]], ['volley', { n: 3, kind: 'crescent', col: VIOLET, speed: 4.2, gap: 14 }, [1, 2]]] };
  E.fused = { name: 'THE DIRECTOR, FUSED', sub: 'Half man, half Engine', sheet: 'enginebeast', beast: true, heavy: true, hp: 1100, dmg: 15, speed: 0.85, xp: 300, creds: 0, idle: 28, w: 84, h: 44,
    script: [['charge', { speed: 4.2 }, [1, 3]], ['stomp', { col: VIOLET }, [3, 1]], ['lob', { n: 3, col: VIOLET, dmg: 7 }, [2, 2]]] };
  E.convergence = { name: 'THE CONVERGENCE', sub: 'What he became', sheet: 'convergence', sheet2: 'convergence', hp: 1000, dmg: 14, speed: 1.25, xp: 800, creds: 0, idle: 20, w: 16, h: 40, counter: 1.3,
    script: [['swings', { n: 2, reach: 58, col: '#ffffff' }, [3, 1]], ['lunge', { speed: 7.5 }, [1, 3]], ['volley', { n: 3, kind: 'crescent', col: VIOLET, speed: 4.6, gap: 12 }, [1, 2]], ['slam', { col: VIOLET }, [2, 2]]] };
  // balance (scripted fights, level 16, four moves, all three phases back to back, 3 runs each for 6 heroes): the masher dies in
  // phase 1 or 2 nearly every time (Nyra's masher gets through); the careful player wins about 5 runs in 6. Phase 3 first decided
  // everything (the careful player either cruised or died, about half and half); two fewer sweep hits and the partner's two
  // healing items evened it out.
  Object.assign(D.speakers, { director: { name: 'Director Calder Sayle', sheet: 'director', pitch: 240 }, pell: { name: 'Junior Researcher Pell', sheet: 'hazmat', pitch: 600 } });
  const _init = art.init; art.init = function () {
    _init();
    try {
      const rc = story.recolor;
      rc('director', 'brandt', { top: '#1a1626', hair: '#e8ecf4', pants: '#2a2440' }, { '#ff8a3a': VIOLET, '#ffe0a0': '#e8d8ff' });
      rc('director2', 'director', { top: '#3a2a6a' });
      rc('convergence', 'director', { top: '#e8d8ff', hair: '#ffffff', pants: '#5a4a88' });
      const sacs = (x, i) => { [[36, 30], [54, 22], [72, 26], [88, 34]].forEach((q, k) => { art.disc(x, '#2a1a4a', q[0], q[1], 5); art.disc(x, i === 3 ? '#ffffff' : (k + i) % 2 ? VIOLET : '#e8d8ff', q[0], q[1], 3 + ((k + i) % 2)); }); };
      story.scaled('enginebeast', 'crawler', 3, [0, 1, 2, 2, 1, 3, 4], { idle: [0], run: [1, 2], tele: [3], atk: [4], hurt: [5], down: [6], dash: [1, 2], special: [3], cheer: [3], cast: [4], a1: [4], a4: [4, 4, 0], jump: [1] },
        { tint: ['#6a3aa8', 0.5], paint: sacs });
    } catch (e) { console.error(e); }
  };

  // ================= mission, cards =================
  M['A3-6'] = { id: 'A3-6', title: 'Convergence', hero: 'all', xp: 1000, creds: 1000, next: null, steps: [
    { id: 'descend', t: 'Take the core key down into the Engine core (the summit of the Spire)' }, { id: 'director', t: 'Face the Director' }, { id: 'reverse', t: 'Run the Engine backwards' }] };
  if (M['A3-5']) M['A3-5'].next = 'A3-6';
  const _cg = G.continueGame; G.continueGame = function () {
    _cg();
    const S = G.state;
    if (S && G.scene === 'play' && !S.mission && S.done['A3-5'] && !S.done['A3-6']) S.mission = 'A3-6';
  };
  story.cards.act3d.lines = ['Six floors. Dr. Morrow. Dr. Kessen.', 'You hold the key to the Engine core.', '', 'Kessen built the Engine to save this city.', 'The Director has been inside it for a year.', '',
    'NEXT: the Engine core, under the summit.', 'Esc > Mission.'];
  story.cards.ending = { title: 'THE END', lines: ['The Engine turned backwards, once, and the worlds came apart', 'as gently as they had been torn together.', '',
    'Everyone went home with everything they had lost.', 'Aurelia came down out of the sky over a year, slowly,', 'and its stored power went to the people who had lived beneath it.', '',
    'SHATTERED WORLDS', 'Thank you for playing.', '', 'Every hero woke somewhere different. Try another.'] };
  story.cards.secret = { title: 'AFTER THE CREDITS', lines: ['A lab, far below the place Aurelia used to be.', 'A junior researcher, alone, at a console no one remembered.', '',
    '"Dr. Kessen said it could only run backwards once."', '"She never said anything about building a second one."', '',
    'Somewhere, a second Engine turns over, slow and enormous.', '', 'You found all 60 minor Memory Shards.'] };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 0 || M[g.state.mission] || !g.state.done['A3-6']) return;
    art.rect(ctx, '#080916', 16, 34, 440, 44);
    text(ctx, 'The story is complete', 26, 40, '#f5c542', { scale: 2 });
    text(ctx, 'Free roam. Every hero has their own tutorial, lines and secret. Try another.', 26, 64, '#ffffff');
  };

  // ================= the fight =================
  const fighting = g => !!(g.finale && ['talk', 'p1', 'p2', 'p3'].indexOf(g.finale.state) >= 0);
  class Finale {
    constructor() { G.finale = null; this.t = 0; }
    update(g, z) {
      this.t++;
      const m = g.finale, p = g.player;
      if (!m || !p || g.busy()) return;
      const spawn = (type, tx) => { const e = z.enemy(type, tx, 19); e.ax0 = 9 * 16; e.ax1 = 62 * 16; e.state = 'chase'; e.dormant = false; g.boss = e; m.boss = e; SW.audio.music('boss'); fx.flash(VIOLET, 8); fx.shake(6, 14); return e; };
      if (m.state === 'start') { m.state = 'talk'; g.step('A3-6:descend'); g.say('f_director', () => { spawn('director', 50); m.state = 'p1'; }); }
      else if (m.state === 'p1') { g.alert(); if (m.boss.dead) { g.boss = null; m.state = 'talk'; g.say('f_phase2', () => { p.heal(Math.round(p.hpMax() * 0.5)); spawn('fused', 48); m.state = 'p2'; }); } }
      else if (m.state === 'p2') { g.alert(); if (m.boss.dead) { g.boss = null; m.state = 'talk'; g.say('f_phase3', () => {
        const h = g.hero(); p.heal(p.hpMax()); g.state.energy = 300; g.state.awaken = 100; g.state.items = Math.max(g.state.items, 2); /* the partner brings healing items */
        if (h.ultimate && !g.has(h.ultimate)) g.unlock(h.ultimate);
        g.toast('ULTIMATE READY: hold W and press I', '#f5c542'); m.callT = 60; spawn('convergence', 50); m.state = 'p3';
      }); } }
      else if (m.state === 'p3') {
        g.alert();
        if (--m.callT <= 0 && !p.dead) { m.callT = 720; story.act3.callIn(p, rival()); }   // the partner fights beside you
        if (m.boss.dead) { g.boss = null; m.state = 'talk'; g.say('f_reverse', () => { m.state = 'end'; g.step('A3-6:director'); }); }
      }
      else if (m.state === 'end') { m.state = 'epilogue'; SW.audio.music('memory'); fx.flash('#ffffff', 30); g.say('f_epilogue', () => { g.step('A3-6:reverse'); m.state = 'cards'; story.card('ending'); }); }
      else if (m.state === 'cards') { if (!g.overlay) { if (g.state.minor >= 60 && !g.flag('card:secret')) story.card('secret'); else { m.state = 'done'; g.saveGame(); } } }
    }
    draw(ctx, cam, g) {
      // the Engine: a great slow wheel of light behind everything
      const x = Math.round(36 * 16 - cam.x), y = Math.round(9 * 16 - cam.y), t = this.t, done = g.state.done['A3-6'];
      art.glow(ctx, x, y, 90, done ? '#e8ecf4' : VIOLET, done ? 0.06 : 0.12 + 0.04 * Math.sin(t * 0.05));
      for (let i = 0; i < 12; i++) { const a = t * (done ? 0.002 : 0.01) + i * 0.5236; art.line(ctx, i % 3 ? '#5a4a88' : VIOLET, x, y, x + Math.cos(a) * 70, y + Math.sin(a) * 70, 2); }
      art.ring(ctx, VIOLET, x, y, 70); art.ring(ctx, '#e8d8ff', x, y, 24 + (t % 20)); art.disc(ctx, '#1a1626', x, y, 14); art.disc(ctx, done ? '#ffffff' : VIOLET, x, y, 8);
    }
  }
  Z.enginecore = {
    name: 'The Engine Core', theme: 'vs_spire', music: 'boss', w: 64, h: 23,
    build(z, g) {
      const on = gg => gg.state.mission === 'A3-6';
      z.ground(0, 63, 20).fill(63, 0, 1, 20);
      z.spawn('lift', 3, 19);
      z.exit(0, 8, 1, 12, 'spire', 'top');
      z.add(new Finale());
      z.gate(8, 0, 20, { openIf: gg => !fighting(gg) });
      z.trigger(12, 0, 3, 20, gg => { if (on(gg) && !gg.state.steps['A3-6:director'] && !gg.finale) { gg.player.vx = 0; gg.finale = { state: 'start' }; } }, { once: false });
      [16, 56].forEach(x => z.prop('relay', x, 19, { glow: VIOLET, gy: 82, gr: 24 }));
      z.npc('kessen', 6, 19, { name: 'Dr. Veyra Kessen', face: 1, when: gg => !!gg.state.done['A3-6'], talk: () => 'f_kessen_after' });
      z.npc('vane', 4, 19, { name: 'Lord Castellan Vane', face: 1, when: gg => !!gg.state.done['A3-6'], talk: () => 'f_vane_after' });
    }
  };
  const _nd = SW.NPC.prototype.draw; SW.NPC.prototype.draw = function (ctx, cam) { if (this.when && G.zone && G.zone.id === 'enginecore' && !this.when(G)) return; return _nd.call(this, ctx, cam); };
  story.patch('spire', (z, g) => {
    z.thing('door', 240, 19, { prompt: 'Descend into the Engine core', glow: VIOLET, when: gg => !!(gg.state.done['A3-5'] || gg.state.mission === 'A3-6'), use: gg => gg.gotoZone('enginecore', 'lift') });
  });
  const _gs = G.gotoZone; G.gotoZone = function (id, spawn) { G.finale = null; return _gs.call(this, id, spawn); };
  const _gr = G.respawn; G.respawn = function () { G.finale = null; return _gr.apply(this, arguments); };

  // ================= the words =================
  const HERO_DIRECTOR = {
    kael: 'You dropped me in the trash and called it an accident. I climbed out.', nyra: 'You put me in a tank and called it care. I have come to collect what you took.',
    fenn: 'Every hunt ends somewhere. This is where yours does.', isolde: 'You clipped the wings of two worlds to keep one aloft. No more.',
    brakk: 'You moved mountains that were not yours. Put them back.', pyra: "You wanted to know how hot I burn. Front row seat, Director.",
    gale: "You've been holding your breath down here for a year. Let it go.", ashka: 'You drank two worlds dry. I am what is left at the bottom.',
    dyna: "Biggest machine I've ever seen. It's got one off switch. Guess who's standing on it.", vesper: 'A year in the dark, and you still did not see me coming.',
    orin: 'You opened the door between worlds and walked through it. I am here to close it behind you.', mira: 'Look at yourself, Director. There is almost nothing left in the glass.',
    noct: '...', bando: "All this way down. Still in reach.", aldric: 'I swore an oath to the people you fed to this machine. I keep my oaths.',
    sen: 'One line. Then it is finished.', vega: 'Everything you stole is very heavy. It all falls now.',
    tessa: "I've seen every way this ends. In none of them do you win.", jax: "You've been bluffing with other people's chips for a year. I'm calling.",
    ferra: 'Your Engine is the biggest pile of scrap in two worlds. Scrap answers to me.', kiri: 'You folded three worlds into one. I am unfolding them.',
    tarn: 'Every road I walked ended here. So does yours.', maren: 'You are the sickness. I am the doctor.',
    yara: 'I have been aiming at you since the Crater. I just could not see you.', brann: 'You let the winter into three worlds. I am closing the door.'
  };
  const HERO_HOME = {
    kael: 'The grass, and the thunderheads, and an old woman at the standing stones who says: "There you are, storm-boy."',
    nyra: 'The frozen harbour in spring, the ice breaking up, and a choir on a ship that finally lets go of the note.',
    fenn: 'The steppe, the herd, and a wolf made of stormlight running to meet you across the grass.',
    isolde: 'The high eyrie over the harbour, and a white falcon folding out of the sky onto your glove.',
    brakk: 'The ring of standing stones, humming, and the children following your shadow again.',
    pyra: 'The blue forge, still burning, and the old smith calling you in from the cold.',
    gale: 'The ridge where the wind never stops, and your little sister shouting your name from below.',
    ashka: 'The deep vents under the harbour, red and warm and patient, waiting for the ember-carrier.',
    dyna: 'The storm-season festival, and the whole sky going gold because you lit the fuse.',
    vesper: 'The sea wall at dusk, one lamp after another coming alight, and nobody seeing who lit them.',
    orin: 'A tent with two flaps, and your mother at the far one, counting to ten, and you coming out of the right one.',
    mira: 'The harbour ice at noon, and the girl underneath it, smiling up at you.',
    noct: 'The harbour at night, with nothing in the dark that is not supposed to be there. You keep it that way.',
    bando: 'Festival day, a hundred kites, and one still tangled in the only tree for a mile. You reach.',
    aldric: 'The harbour gate, and forty shadows of a company that stands down at last.',
    sen: 'An old school, a teacher, a square of white paper, and one line of ink.',
    vega: 'A sky full of stars that fall only when you let them.',
    tessa: 'The tide table on the harbour wall, and you, for once, exactly on time.',
    jax: 'A card table in a storm, and your grandmother, laughing, dealing you in.',
    ferra: 'A smithy, and every tool on the wall turning to see who has come home.',
    kiri: "A wagon in the rain, a thousand and one paper cranes, and your father laughing until he has to sit down.",
    tarn: 'The far camp at the end of the steppe. They do not ask for the message. They ask your name, and you tell them.',
    maren: 'The harbour at the turn of the tide, and a sick child, and the fever going out with the water.',
    yara: 'The sea wall at night, and a ship far out in the ice, steering home by the light you lit.',
    brann: 'A long-house under the snow, and the children shouting your short name, not because they are afraid.'
  };
  Object.assign(L, {
    f_kessen_after: [say('kessen', 'It is done. I built it to save one city, and it nearly ate three. Thank you for letting me be the one to switch it off.')],
    f_vane_after: [say('vane', 'Aurelia is coming down. Slowly, the engineers say. A year. I think we will all be better for being closer to the ground.')],
    f_director: [
      say('sys', 'The Engine core. A wheel of violet light as tall as a house, turning slowly over the floor. In front of it, a man in black stands with his hands behind his back.'),
      say('director', 'Calder Sayle. Director of Halcyon. I have been waiting for the two of you for a year. Apart, as I arranged it. And yet here you are.'),
      say('director', 'You came through the first pulse at its two ends. Together you could turn it back. Apart, you were only fuel. I hung the veil so you would never stand in the same room.'),
      say('hero', HERO_DIRECTOR),
      say('director', 'Then I will finish it myself. The second pulse welds the three worlds into one, and Aurelia never falls. Stand aside, or be part of it.')
    ],
    f_phase2: [
      say('sys', 'The Director staggers back - into the light of the Engine. It does not throw him out. It takes him in.'),
      say('director', 'Yes. YES. A year in the core, and I never once dared to step INTO it. ...I should have.'),
      say('sys', 'What comes out of the light is no longer a man.')
    ],
    f_phase3: [
      say('sys', 'The fused thing breaks apart, and from the middle of it a single figure rises, white as the inside of a star: THE CONVERGENCE.'),
      say('partner', { K: 'Not alone. Not this time. I am here.', N: "Room for one more? I'm not missing this." }),
      say('hero', { K: 'Together, then.', N: 'Together.' }),
      say('sys', 'Your partner fights beside you, and presses two healing items into your hand (Q). Everything you have lost in two worlds is in your hands at once: your ULTIMATE is ready. Hold W and press I.')
    ],
    f_reverse: [
      say('sys', 'The Convergence comes apart into light. The Engine shudders, and slows, and for the first time in a year it is quiet.'),
      say('partner', { K: 'The key. Kessen said it runs backwards once. Only once.', N: "The key! Backwards, once. Kessen said once. Don't drop it." }),
      say('sys', 'You put the core key into the Engine, together, and turn it the other way.')
    ],
    f_epilogue: [
      say('sys', 'Everything goes white. And then, one at a time, like lamps along a sea wall, the memories come home.'),
      say('sys', HERO_HOME),
      say('partner', { K: 'I can hear the harbour. ...I will see you again. I have decided. Two worlds is not so far.', N: "I can smell the grass. ...See you around, yeah? Two worlds isn't that far. I'll walk it." }),
      say('hero', { K: 'Count on it.', N: 'I will be there.' })
    ]
  });
  story.finale = { fighting };

  // Act 3 backdrops: assets/bg/bg_<map>.png, 600x300 (prompts in tools/higgsfield-act3.json). Each map gets its own copy of
  // the theme it used before, with only the picture changed; while a picture is missing the map looks exactly as it did.
  // [theme it copies, picture, how much the picture is darkened]: the Spire's server columns and the Core's wheel are bright,
  // so they sit further back than the sky pictures.
  const TH = art.themes, ACT3_BG = { skylift: ['sky', 'bg_skylift', 0.14], noble: ['sky', 'bg_noble', 0.16], spire: ['vs_spire', 'bg_spire', 0.32], enginecore: ['vs_spire', 'bg_core', 0.5, { sky: ['#120a26', '#3a1f5c'] }] };
  Object.keys(ACT3_BG).forEach(id => {
    const [base, pic, dim, more] = ACT3_BG[id], t = 'a3_' + id;
    if (!TH[base] || !Z[id]) return;
    TH[t] = Object.assign({}, TH[base], { bg: pic, dim }, more || {});
    Z[id].theme = t;
    const im = new Image(); im.onload = () => { art.bg[pic] = im; }; im.onerror = () => {}; im.src = 'assets/bg/' + pic + '.png';
  });
})();
