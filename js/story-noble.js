'use strict';
// Shattered Worlds — ACT 3, A3-4: the Noble Ring Uprising. Loaded after story-skylift.js; only adds and wraps.
//   East of the Skyport lies the Noble Ring, Aurelia's gilded district, where every citizen wears a Halcyon control chip
//   and stands where they are told. Break the three control relays (each guarded) and the citizens wake. At the Chancery,
//   Prefect Sorrel Quist, who runs the chips, makes a stand. Then Lord Castellan Vane, who stood aside at the Skylift,
//   turns on Halcyon and joins you as a third assist (the design document's defector, as a character the player has met).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, HR = D.heroes, P = SW.Player.prototype, text = SW.text, rand = SW.rand;
  if (!story || !story.patch || !story.act3 || !story.skylift) return;
  const sfx = n => SW.audio.sfx(n);
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const isFoe = e => e.hittable && e.team === 'enemy' && !e.dead;
  const VIOLET = '#b48cff';

  // ================= cast =================
  E.quist = { name: 'PREFECT SORREL QUIST', sub: 'Keeper of the control chips', sheet: 'quist', sheet2: 'quist2', hp: 1050, dmg: 16, speed: 1.0, xp: 460, creds: 360, idle: 26, w: 14, h: 36,
    script: [['volley', { n: 3, col: VIOLET }, [1, 3]], ['swings', { n: 2, reach: 50, col: '#e8d8ff' }, [3, 1]], ['lunge', {}, [1, 2]], ['summon', { kind: 'drone', max: 2, hp: 16, fly: true }, [2, 2]]] };
  // balance (scripted fights, level 14, four moves, 4 fights each for 7 heroes): the masher dies most of the time; the careful
  // player wins losing 14 to 70%, about 40% on average (Nyra, Isolde and Brakk find her easiest, Pyra hardest).
  Object.assign(D.speakers, {
    quist: { name: 'Prefect Sorrel Quist', sheet: 'quist', pitch: 380 }, citizen: { name: 'Citizen', sheet: 'noble1', pitch: 460 },
    ward: { name: 'Lady Amsel Ward', sheet: 'noble2', pitch: 520 }
  });
  const _init = art.init; art.init = function () {
    _init();
    try {
      const rc = story.recolor;
      rc('quist', 'brandt', { top: '#5a2a6a', hair: '#c8c8d0', pants: '#2a1a3a' }, { '#ff8a3a': VIOLET, '#ffe0a0': '#e8d8ff' }); rc('quist2', 'quist', { top: '#8a2a8a' });
      rc('noble1', 'bookie', { top: '#e8ecf4', acc: '#d9b45a', pants: '#8a92b8' });
      rc('noble2', 'mags', { top: '#d9b45a', hair: '#5a3418', pants: '#e8ecf4' });
      rc('noble3', 'kid', { top: '#8a92b8', hair: '#c8a05a' });
    } catch (e) { console.error(e); }
  };

  // ================= mission =================
  M['A3-4'] = { id: 'A3-4', title: 'The Noble Ring Uprising', hero: 'all', xp: 560, creds: 400, next: null, steps: [
    { id: 'enter', t: 'Go east from the Skyport into the Noble Ring' }, { id: 'chips', n: 3, t: 'Cut the control relays and wake the citizens' },
    { id: 'prefect', t: 'Bring down the Prefect at the Chancery' }, { id: 'vane', t: 'Hear out the Castellan' }] };
  if (M['A3-3']) M['A3-3'].next = 'A3-4';
  const _cg = G.continueGame; G.continueGame = function () {
    _cg();
    const S = G.state;
    if (S && G.scene === 'play' && !S.mission && S.done['A3-3'] && !S.done['A3-4']) S.mission = 'A3-4';
  };
  D.world.forEach(w => { if (w.id === 'noble') delete w.soon; });
  story.cards.act3b.lines = ['The lift is held. The army is coming up behind you,', 'one platform-load at a time.', '', 'Aurelia is above the clouds, and for the first time', 'in ninety years the people below can see it up close.', '',
    'NEXT: the Noble Ring, east of the Skyport.', 'Esc > Mission.'];
  story.cards.act3c = { title: 'THE RING IS AWAKE', lines: ['The control relays are cut. The Noble Ring is awake,', 'and very, very angry.', '', 'Lord Castellan Vane rides with you now.', 'Halcyon has one place left to stand: the Spire.', '',
    'Next build: the Halcyon Spire, and the Engine core.', '', 'Until then: free roam.'] };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 0 || M[g.state.mission] || !g.state.done['A3-4']) return;
    art.rect(ctx, '#080916', 16, 34, 440, 44);
    text(ctx, 'Act 3: the Noble Ring is awake', 26, 40, '#f5c542', { scale: 2 });
    text(ctx, 'Free roam. Next build: the Halcyon Spire and the Engine core.', 26, 64, '#ffffff');
  };

  // ================= Vane as an assist: three gold crescents =================
  const _aw = P.useAwaken; P.useAwaken = function () {
    const g = this.G, S = g.state, h = g.hero();
    if (g.scene === 'vs' || I.held('down') || S.assist !== 'vane' || (S.awaken >= 100 && g.has(h.awaken) && this.awakeT <= 0)) return _aw.call(this);
    if (this.assistCd > 0) { sfx('deny'); return; }
    this.assistCd = 1200;
    const p = this, z = g.zone, face = p.face, mul = p.specMul ? p.specMul() : 1, x = p.x - face * 20, y = p.y;
    fx.ring(x, y - 16, '#fff3c0', 4, 34, 14); sfx('awaken'); g.toast('Vane: "Stand aside."', '#d9b45a');
    z.add({ t: 0, update(gg, zz) {
      if (++this.t >= 54) this.gone = true;
      if (this.t === 12 || this.t === 20 || this.t === 28) { sfx('swing'); zz.shots.push(new SW.Proj({ x: x + face * 16, y: y - 22 + (this.t - 20) * 0.6, vx: face * 7, dmg: Math.round(11 * mul), w: 18, h: 36, life: 50, ghost: true, pierce: true, heavy: true, kx: 3, ky: -2,
        render(ctx, sx, sy, q) { const d = Math.sign(q.vx) || 1; for (let i = -16; i <= 16; i += 2) { const o = Math.round((256 - i * i) / 26); art.rect(ctx, Math.abs(i) < 9 ? '#ffffff' : '#d9b45a', sx + (o - 4) * d, sy + i, 4, 2); } art.glow(ctx, sx, sy, 14, '#d9b45a', 0.12); } })); }
    }, draw(ctx, cam) { art.draw(ctx, 'vane', this.t < 10 ? 'idle' : 'a1', this.t < 10 ? 0 : 1, x - cam.x, y - cam.y, face < 0, { alpha: Math.min(1, this.t / 6, (54 - this.t) / 10) }); } });
  };

  // ================= the zone =================
  // a citizen: wears a chip (red light at the temple) until their block's relay is cut, then cheers
  class Citizen extends SW.NPC {
    draw(ctx, cam) {
      const awake = G.flag(this.relay), x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      this.cheer = awake && (this.t % 120) < 50;
      super.draw(ctx, cam);
      if (!awake) { art.rect(ctx, '#ff3a3a', x + (this.face < 0 ? -4 : 3), y - 26, 2, 2); art.glow(ctx, x, y - 26, 6, '#ff3a3a', 0.2 + 0.1 * Math.sin(this.t * 0.2)); }
    }
  }
  const RELAYS = [['relay_a', 30, 58], ['relay_b', 72, 100], ['relay_c', 114, 142]];
  const FOES = [
    [['veilguard', 44, 19], ['veilguard', 50, 19], ['drone', 47, 14]],
    [['veilenf', 86, 19], ['veilguard', 92, 19], ['gunner', 96, 19], ['drone', 80, 14]],
    [['veilenf', 126, 19], ['veilenf', 134, 19], ['veilguard', 130, 19], ['drone', 122, 14], ['drone', 138, 14]]
  ];
  Z.noble = {
    name: 'The Noble Ring', theme: 'sky', music: 'sky', w: 170, h: 23,
    build(z, g) {
      const S = g.state, on = gg => gg.state.mission === 'A3-4';
      z.ground(0, 169, 20).fill(169, 0, 1, 20);
      z.spawn('west', 3, 19);
      z.exit(0, 8, 1, 12, 'skyport', 'east');
      z.trigger(3, 6, 4, 14, gg => { if (on(gg)) { gg.step('A3-4:enter'); gg.say('n3_enter'); } }, { flag: 'a3_noble_in' });
      // gilded avenues
      for (let x = 8; x < 168; x += 12) z.prop('banner', x, 19, { col: x % 24 ? '#d9b45a' : '#8e2430' });
      [20, 64, 106, 146].forEach(x => z.prop('lamp', x, 19, { glow: '#fff3c0', gy: 46, gr: 22 }));
      z.save(64, 19, 'glyph'); z.save(106, 19, 'glyph');
      z.shard('noble_a', 62, 18, { hidden: true }); z.shard('noble_b', 148, 18);
      // three relays, each with its guard and its block of citizens
      RELAYS.forEach((r, i) => {
        const [flag, x0, x1] = r, cx = x0 + 14;
        z.prop('relay', cx, 19, { glow: g.flag(flag) ? null : '#ff3a3a', gy: 82, gr: 24 });
        z.arena({ id: flag, x0, x1, gy: 19, gh: 12, intro: i ? null : 'n3_relay_in', armed: gg => on(gg) && !gg.flag(flag), enemies: FOES[i] });
        z.thing('console', cx + 2, 19, { prompt: 'Cut the control relay', glow: '#ff3a3a', when: gg => on(gg) && gg.flag('arena:noble:' + flag) && !gg.flag(flag),
          use: gg => { gg.setFlag(flag); gg.count('A3-4:chips'); fx.flash('#ffffff', 8); fx.shake(6, 14); sfx('explode'); gg.say(['n3_relay1', 'n3_relay2', 'n3_relay3'][Object.keys(gg.state.flags).filter(k => /^relay_[abc]$/.test(k)).length - 1] || 'n3_relay1'); } });
        [x0 + 3, x0 + 6, x1 - 4].forEach((cxp, k) => z.add(new Citizen(['noble1', 'noble2', 'noble3'][(i + k) % 3], cxp * 16 + 8, 20 * 16, { name: 'Citizen', relay: flag, face: k % 2 ? -1 : 1, fixed: true,
          talk: gg => (gg.flag(flag) ? 'n3_citizen_free' : 'n3_citizen') })));
      });
      // the Chancery
      z.gate(146, 0, 20, { openIf: gg => !on(gg) || (gg.state.counts['A3-4:chips'] || 0) >= 3 || !!gg.state.steps['A3-4:chips'] });
      z.prop('door', 166, 19).prop('banner', 150, 19, { col: VIOLET }).prop('banner', 162, 19, { col: VIOLET });
      z.arena({ id: 'prefect', x0: 147, x1: 168, gy: 19, gh: 12, boss: true, intro: 'n3_prefect', win: 'n3_prefect_win', music: 'boss', armed: gg => on(gg) && !!gg.state.steps['A3-4:chips'],
        enemies: [['quist', 162, 19]], onWin: gg => gg.step('A3-4:prefect') });
      z.npc('vane', 158, 19, { name: 'Lord Castellan Vane', face: -1, when: gg => !!gg.state.steps['A3-4:prefect'], talk: gg => (gg.state.steps['A3-4:vane'] ? 'n3_vane2' : 'n3_vane') });
      z.npc('noble2', 152, 19, { name: 'Lady Amsel Ward', face: 1, when: gg => !!gg.state.steps['A3-4:prefect'], talk: () => 'n3_ward' });
    }
  };
  // The NPCs at the Chancery should only be there once it is won: hide them until then
  const _nd = SW.NPC.prototype.draw; SW.NPC.prototype.draw = function (ctx, cam) { if (this.when && G.zone && G.zone.id === 'noble' && !this.when(G)) return; return _nd.call(this, ctx, cam); };
  story.patch('skyport', (z, g) => {
    if (!g.state.done['A3-3']) return;
    z.spawn('east', 89, 19);
    z.exit(91, 8, 1, 12, 'noble', 'west');
  });
  story.patch('skylift', (z, g) => {
    z.ents.forEach(e => { if (e instanceof SW.NPC && e.sheet === 'marlo') e.talk = gg => (gg.state.mission === 'A3-4' ? 'k3_marlo2' : 'k3_marlo'); });
  });

  // ================= the words =================
  const HERO_QUIST = {
    kael: "You put a leash on a whole district. Deepline doesn't even do that.", nyra: 'I have worn one of your leashes. I know where the clasp is.',
    fenn: 'A whole pack, made to stand still. You are no shepherd.', isolde: 'You took the one thing a falcon has. The choice to come back.',
    brakk: 'Let them go.', pyra: "Chips in their heads. Real classy. Let's see how they handle heat.",
    gale: "They couldn't even feel the wind on their faces. Do you know what that is?", ashka: 'You turned them into machines. I know what that is like from the inside.',
    dyna: 'Signal relays, three of them, all on one carrier. Lazy engineering, Prefect.', vesper: 'You never had to watch them. The chips did it for you. That made you careless.',
    orin: 'You locked every door in their heads. I open doors.', mira: 'Look at them in the glass, Prefect. Look at what you made.',
    noct: '...', bando: "You kept them close where you could reach them. So can I.", aldric: 'A lord protects his people. You have done the opposite of that.',
    sen: 'You kept a whole district asleep with its eyes open. That ends with one stroke.', vega: 'You put weights on every mind in this ring. I am taking them off.',
    tessa: 'Ninety years of their lives, filed away. I am returning them. Late.', jax: 'House rules are changing, Prefect.',
    ferra: 'Every one of those chips was metal. Every one of them listened to me on the way in.', kiri: 'You folded them small and put them away. Unfold.',
    tarn: "They haven't taken a step of their own in years. Time they did.", maren: 'I am a doctor. I am going to take these out of them. Starting with you.',
    yara: 'I counted your guards from the Skyport. You should have had more.', brann: "You stood in their door and kept them in. That's my job, done backwards."
  };
  Object.assign(L, {
    k3_marlo2: [say('marlo', "The Noble Ring is east of the Skyport. My people say nobody there looked at them. Not once. Like they weren't there. Be careful up there.")],
    n3_enter: [
      say('sys', 'The Noble Ring. Gold avenues, white houses, gardens that are watered by hand. And everywhere, people standing perfectly still, a small red light blinking at each temple.'),
      say('partner', { K: 'Control chips. They put them in the nobles too. Of course they did. Nobody is free in this city. Not even the people at the top.', N: "Chips. In everybody. Even the rich ones. Huh. I thought this was the part of town that got to be happy." }),
      say('hero', { K: "Then we cut them loose.", N: 'Then we wake them.' }),
      say('partner', { K: 'The chips run off relays. Three of them, along the avenue. Halcyon will be guarding every one.', N: 'Those chips need a signal. Look - relay towers, three of them, down the avenue. Guards on every one.' })
    ],
    n3_relay_in: [say('sys', 'A Halcyon relay tower, ringed by guards. Every chip in this block blinks in time with the light on top.')],
    n3_relay1: [say('sys', 'The relay dies. Up and down the block, people blink, and sway, and look at their own hands.'), say('citizen', '...Where... what day is it? Why am I standing in the street?')],
    n3_relay2: [say('sys', 'The second relay goes dark. Somebody starts crying. Somebody else starts shouting. The shouting spreads.'), say('ward', 'I remember. I REMEMBER. They put it in on my twelfth birthday. They called it a gift.')],
    n3_relay3: [say('sys', 'The last relay dies, and the whole Noble Ring wakes at once. The sound of it goes up past the clouds.'),
      say('partner', { K: 'Listen to them. ...The gates at the Chancery just opened. Whoever was running this is in there.', N: "Listen to that! ...The Chancery doors just opened. Whoever pulled the strings is in there." })],
    n3_citizen: [say('sys', 'The citizen stares straight ahead. The light at their temple blinks. They do not know you are there.')],
    n3_citizen_free: [say('citizen', "I can't remember the last thing I decided for myself. ...I think I'd like to start with breakfast.")],
    n3_prefect: [
      say('quist', 'Do you know what you have done? Those chips kept the peace in this city for sixty years. No crime. No riots. No grief.'),
      say('hero', HERO_QUIST),
      say('quist', 'Peace is a thing you do TO people. I will put it back, one head at a time. Starting with yours.', { fn: 'boss_start' }),
      say('sys', 'Hold S to GUARD her baton. Dash (L) through the violet orbs.\nShe calls drones to her side: knock them out of the air, then go for her.')
    ],
    n3_prefect_win: [
      say('quist', '...Sixty years. Sixty years of quiet. You have no idea what you have let out.'),
      say('sys', 'The doors of the Chancery open behind you. A man in white and gold walks in, unhurried, and looks down at the Prefect.'),
      say('vane', 'I have. It is called a city.')
    ],
    n3_vane: [
      say('vane', 'At the Skylift I told you I would not stop you, and that you should not mistake it for help.'),
      say('vane', "My wife was chipped on the night we married. Quist said it would calm her nerves. I believed him for twenty years. Then I watched you walk through my gate, and I stopped believing anything."),
      say('partner', { K: 'Then help us. The Spire is next. You know its doors.', N: "So help us. You know the Spire. We don't." }),
      say('vane', 'I know every door in it. I will open them for you. Call, and I will come.', { assist: 'vane', fn: 'flag:vane_joined' }),
      say('sys', 'LORD CASTELLAN VANE joins as an assist: three gold crescents across the field. Esc > Assist switches between your allies.', { step: 'A3-4:vane', fn: 'card:act3c' })
    ],
    n3_vane2: [say('vane', 'The Spire is above the Ring, past the Skyport. Its gates have never once opened from the outside. That will be a first.')],
    n3_ward: [say('ward', "I don't know who you are. But my husband does, and he hasn't smiled like that in twenty years. Thank you.")]
  });
  story.noble = { RELAYS };
})();
