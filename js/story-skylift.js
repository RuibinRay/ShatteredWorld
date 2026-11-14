'use strict';
// Shattered Worlds — ACT 3, A3-3: Storm the Skylift. Loaded after story-act3.js; only adds and wraps.
//   The army of the Surface and the deep gathers at the Skylift gate, east of Scrapton. Break Halcyon's gate guard, then
//   board the lift: the gates close and it climbs while Halcyon drops troopers and drones onto the platform, five waves
//   over the whole climb. At the top, Lord Castellan Vane, keeper of the lift, stands in the way (the design document's
//   noble at the top of the lift, as an original character). He stands down when beaten, and the Skyport is open.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, HR = D.heroes, text = SW.text, W = SW.W, H = SW.H, rand = SW.rand;
  if (!story || !story.patch || !story.act3) return;
  const sfx = n => SW.audio.sfx(n);
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const T = 16, LIFT0 = 64, LIFT1 = 104;   // the lift platform, in tiles

  // ================= the keeper of the lift =================
  E.vane = { name: 'LORD CASTELLAN VANE', sub: 'Keeper of the Skylift', sheet: 'vane', sheet2: 'vane2', hp: 1000, dmg: 16, speed: 1.2, xp: 420, creds: 320, idle: 24, w: 14, h: 36,
    script: [['lunge', {}, [1, 3]], ['swings', { n: 3, reach: 52, col: '#fff3c0' }, [3, 1]], ['volley', { n: 3, kind: 'crescent', col: '#d9b45a', speed: 4.2, gap: 14 }, [1, 2]]] };
  // balance (scripted fights, level 13, four moves): the masher dies nearly every time; the careful player wins most fights
  // losing 37 to 62%. A drone summon was tried and taken out: it made the fight swing between too easy and a wall.
  Object.assign(D.speakers, { vane: { name: 'Lord Castellan Vane', sheet: 'vane', pitch: 300 }, liftman: { name: 'Lift Engineer', sheet: 'hazmat', pitch: 540 } });
  const _init = art.init; art.init = function () {
    _init();
    try { story.recolor('vane', 'brandt', { top: '#e8ecf4', hair: '#1a1a24', pants: '#8a92b8' }, { '#ff8a3a': '#d9b45a', '#ffe0a0': '#fff3c0' }); story.recolor('vane2', 'vane', { top: '#d9b45a' }); } catch (e) { console.error(e); }
  };

  // ================= mission =================
  M['A3-3'] = { id: 'A3-3', title: 'Storm the Skylift', hero: 'all', xp: 520, creds: 350, next: null, steps: [
    { id: 'road', t: 'Join the army at the Skylift gate (the east road out of Scrapton)' }, { id: 'gate', t: "Break Halcyon's gate guard" },
    { id: 'ride', t: 'Hold the lift platform all the way up' }, { id: 'top', t: 'Get past whoever holds the top of the lift' }] };
  if (M['A3-2']) M['A3-2'].next = 'A3-3';
  const _cg = G.continueGame; G.continueGame = function () {
    _cg();
    const S = G.state;
    if (S && G.scene === 'play' && !S.mission && S.done['A3-2'] && !S.done['A3-3']) S.mission = 'A3-3';
  };
  story.cards.act3a.lines = ['The veil is broken. Two roads are one.', 'The caravans of the Surface and the gangs of Deepline', 'answer to the same fire now.', '',
    'Halcyon holds the Skylift: the only way up', "that isn't a hole in the sky.", '', 'NEXT: the army gathers at the Skylift gate,', 'east of Scrapton. Esc > Mission.'];
  story.cards.act3b = { title: 'THE SKYLIFT IS OURS', lines: ['The lift is held. The army is coming up behind you,', 'one platform-load at a time.', '', 'Aurelia is above the clouds, and for the first time', 'in ninety years the people below can see it up close.', '',
    'Next build: the Noble Ring uprising, the Halcyon Spire', 'and the Engine core.', '', 'Until then: free roam. The Skyport is open.'] };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 0 || M[g.state.mission] || !g.state.done['A3-3']) return;
    art.rect(ctx, '#080916', 16, 34, 440, 44);
    text(ctx, 'Act 3: the Skylift is held', 26, 40, '#f5c542', { scale: 2 });
    text(ctx, 'Free roam. Next build: the Noble Ring uprising, the Spire and the Engine core.', 26, 64, '#ffffff');
  };

  // ================= the ride =================
  const WAVES = [
    [['veilguard', 74, { hp: 70 }], ['veilguard', 96, { hp: 70 }]],
    [['drone', 72, { hp: 22 }], ['drone', 98, { hp: 22 }], ['veilguard', 86, { hp: 70 }]],
    [['veilenf', 80, { hp: 100 }], ['gunner', 98, { hp: 60 }], ['drone', 70, { hp: 22 }]],
    [['veilguard', 72, { hp: 70 }], ['veilguard', 100, { hp: 70 }], ['veilenf', 86, { hp: 100 }]],
    [['veilenf', 74, { hp: 110 }], ['veilenf', 98, { hp: 110 }], ['drone', 86, { hp: 22 }], ['drone', 90, { hp: 22 }]]
  ];
  story.WAVES_LIFT = WAVES;
  const riding = g => !!(g.lift && ['rest', 'fight', 'dock', 'boss', 'talk'].indexOf(g.lift.state) >= 0);
  class Ride {
    constructor() { G.lift = null; this.t = 0; }
    update(g, z) {
      this.t++;
      const m = g.lift, p = g.player;
      if (!m || !p || g.busy()) return;
      if (m.state === 'start') { m.state = 'talk'; g.say('k3_board', () => { m.state = 'rest'; m.t = 70; m.wave = 0; sfx('gate'); fx.shake(5, 20); g.toast('THE SKYLIFT IS MOVING', '#f5c542'); }); }
      else if (m.state === 'rest') { m.alt = Math.min(m.wave / WAVES.length, (m.alt || 0) + 0.0008); if (--m.t <= 0) {
        m.foes = WAVES[m.wave].map(w => { const e = z.enemy(w[0], w[1], 6, w[2]); e.state = 'chase'; fx.ring(e.x, e.y - 10, '#d9b45a', 4, 26, 14); return e; });
        m.state = 'fight'; g.toast('HALCYON BOARDING PARTY ' + (m.wave + 1) + ' / ' + WAVES.length, '#ff5a5a'); sfx('roar');
      } }
      else if (m.state === 'fight') { g.alert(); if (m.foes.every(f => f.dead)) {
        m.wave++; m.alt = m.wave / WAVES.length;
        if (m.wave >= WAVES.length) { m.state = 'dock'; m.t = 80; g.toast('DOCKING', '#f5c542'); }
        else { m.state = 'rest'; m.t = 100; p.heal(Math.round(p.hpMax() * 0.12)); }
      } }
      else if (m.state === 'dock') { if (--m.t <= 0) { fx.flash('#fff3c0', 10); fx.shake(8, 16); sfx('explode'); g.step('A3-3:ride'); p.heal(p.hpMax()); /* the engineer's med-kit: the boss is tuned from full health */ m.state = 'talk'; g.say('k3_vane', () => {
        const e = z.enemy('vane', 98, 6); e.ax0 = (LIFT0 + 1) * T; e.ax1 = (LIFT1 - 1) * T; e.state = 'chase'; e.dormant = false; g.boss = e; m.boss = e; m.state = 'boss'; SW.audio.music('boss');
      }); } }
      else if (m.state === 'boss') { g.alert(); if (m.boss.dead) { g.boss = null; m.state = 'talk'; g.say('k3_vane_win', () => { m.state = 'done'; SW.audio.music(z.music); }); } }
    }
    draw(ctx, cam, g) {
      const x0 = Math.round(LIFT0 * T - cam.x), x1 = Math.round(LIFT1 * T - cam.x), y = Math.round(20 * T - cam.y);
      // the lift: two cables up into the cloud, rails at each end of the platform
      [x0 + 4, x1 - 4].forEach(x => { art.rect(ctx, '#3a3f4e', x - 1, 0, 3, y - 30); art.rect(ctx, '#8a92a8', x, 0, 1, y - 30); art.rect(ctx, '#d9b45a', x - 6, y - 32, 13, 3); });
      art.rect(ctx, '#8a92a8', x0 + 2, y - 14, x1 - x0 - 4, 2); art.rect(ctx, '#3a3f4e', x0 + 2, y - 12, x1 - x0 - 4, 1);
      if (!riding(g)) return;
      // the climb: cloud falling past, wind streaks
      const t = this.t;
      ctx.globalAlpha = 0.22;
      for (let i = 0; i < 9; i++) { const cy = ((t * 2.2 + i * 53) % (H + 80)) - 40, cx = (i * 97 + 30) % W; art.rect(ctx, '#ffffff', cx - 30, cy, 60, 8); art.rect(ctx, '#ffffff', cx - 18, cy - 5, 36, 5); }
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 14; i++) { const sy = ((t * 7 + i * 41) % (H + 40)) - 20, sx = (i * 67 + 11) % W; art.rect(ctx, '#e8ecf4', sx, sy, 1, 14); }
      ctx.globalAlpha = 1;
    }
  }
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    const m = g.lift;
    if (!m || !riding(g)) return;
    const h = 120, x = W - 16, y = 70, a = SW.clamp(m.alt || 0, 0, 1);
    art.rect(ctx, '#05060c', x - 2, y - 2, 8, h + 4); art.rect(ctx, '#2a2e3a', x, y, 4, h); art.rect(ctx, '#d9b45a', x, y + Math.round(h * (1 - a)), 4, Math.round(h * a));
    text(ctx, 'ALT', x + 2, y + h + 6, '#d9b45a', { align: 'center' });
  };

  // ================= the zone =================
  Z.skylift = {
    name: 'The Skylift', theme: 'sky', music: 'sky', w: 128, h: 23,
    build(z, g) {
      const S = g.state, st = S.steps, on = gg => gg.state.mission === 'A3-3', r = story.act3.rival(), rh = HR[r];
      z.ground(0, 127, 20).fill(127, 0, 1, 20);
      z.spawn('gate', 3, 19).spawn('top', 118, 19);
      z.exit(0, 8, 1, 12, 'scrapton', 'skylift');
      z.trigger(3, 6, 4, 14, gg => { if (on(gg)) { gg.step('A3-3:road'); gg.say('k3_enter'); } }, { flag: 'a3_lift_in' });
      // the army, waiting
      ['#c8642a', '#7a2a2a', '#c8642a', '#2a6a5a'].forEach((c, i) => z.prop('banner', 4 + i * 4, 19, { col: c }));
      z.prop('tent', 7, 19, { col: '#a8643a' }).prop('cart', 14, 19).prop('firebarrel', 18, 19, { glow: '#ff8a3a', gy: 16, gr: 24 });
      z.npc('anvil', 10, 19, { name: 'Anvil', talk: gg => (gg.state.done['A3-3'] ? 'k3_anvil2' : 'k3_anvil') });
      z.npc(rh.sheetArmed || rh.sheet, 16, 19, { name: rh.name, talk: gg => (gg.state.done['A3-3'] ? 'k3_partner2' : 'k3_partner') });
      z.npc('marlo', 20, 19, { name: 'Marlo', talk: () => 'k3_marlo' });
      z.save(23, 19, 'glyph');
      // Halcyon's gate guard
      z.prop('banner', 30, 19, { col: '#d9b45a' }).prop('banner', 56, 19, { col: '#d9b45a' }).prop('crate', 34, 19).prop('crate', 35, 19).prop('crate', 52, 19);
      z.arena({ id: 'gate', x0: 26, x1: 60, gy: 19, gh: 12, intro: 'k3_gate_in', win: 'k3_gate_win', armed: gg => on(gg),
        enemies: [['veilguard', 40, 19], ['veilguard', 48, 19], ['veilenf', 52, 19], ['gunner', 56, 19], ['veilguard', 44, 19]], onWin: gg => gg.step('A3-3:gate') });
      // the lift: boarding starts the climb; the gates at each end are shut until it is over
      const done = gg => !!gg.state.done['A3-3'] || !!gg.state.steps['A3-3:top'];
      // full height: nothing climbs over them (Kael's road can cling to walls)
      z.gate(LIFT0, 0, 20, { openIf: gg => !riding(gg) });
      z.gate(LIFT1, 0, 20, { openIf: gg => done(gg) || (gg.lift && gg.lift.state === 'done') });
      z.trigger(LIFT0 + 4, 0, 3, 20, gg => { if (on(gg) && gg.state.steps['A3-3:gate'] && !gg.state.steps['A3-3:top'] && !gg.lift) { gg.player.vx = 0; gg.lift = { state: 'start', alt: 0, wave: 0, foes: [] }; } }, { once: false });
      z.add(new Ride());
      z.thing('console', LIFT0 + 2, 19, { prompt: 'Ride the Skylift up', when: gg => done(gg) && !gg.lift, use: gg => gg.gotoZone('skylift', 'top') });
      // the top: the Skyport dock
      z.prop('banner', 108, 19, { col: '#8e2430' }).prop('banner', 120, 19, { col: '#d9b45a' });
      z.thing('door', 112, 19, { prompt: 'Step off at the Skyport', when: done, use: gg => gg.gotoZone('skyport', 'lift') });
      z.thing('console', 122, 19, { prompt: 'Ride the Skylift down', when: done, use: gg => gg.gotoZone('skylift', 'gate') });
    }
  };
  D.world.forEach(w => { if (w.id === 'skyport') w.note = 'Skylift'; });
  // Scrapton: the road to the gate; the Skyport: where the lift comes in (and no Act 1 boss waiting for a Kael-road hero)
  story.patch('scrapton', (z, g) => {
    z.spawn('skylift', 134, 19);
    z.prop('sign', 136, 19);
    z.thing('door', 134, 19, { prompt: 'Take the road to the Skylift gate', when: gg => !!(gg.state.done['A3-2'] || gg.state.mission === 'A3-3'), use: gg => gg.gotoZone('skylift', 'gate') });
    z.ents.forEach(e => { if (e instanceof SW.NPC && e.sheet === 'marlo') { const t0 = e.talk; e.talk = gg => (gg.state.mission === 'A3-3' ? 'r_k3' : gg.state.done['A3-3'] ? 'r_k3_done' : typeof t0 === 'function' ? t0(gg) : t0); } });
  });
  story.patch('skyport', (z, g) => {
    if (!g.state.done['A3-3']) return;
    g.setFlag('arena:skyport:brandt');
    z.spawn('lift', 54, 19);   // on the far side of the gap at 46-49
    z.thing('console', 52, 19, { prompt: 'Ride the Skylift down', use: gg => gg.gotoZone('skylift', 'top') });
  });
  const _gs = G.gotoZone; G.gotoZone = function (id, spawn) { G.lift = null; return _gs.call(this, id, spawn); };
  const _gr = G.respawn; G.respawn = function () { G.lift = null; return _gr.apply(this, arguments); };

  // ================= the words =================
  const HERO_VANE = {
    kael: "Your lift's under new management. Mine.", nyra: 'I left this city once by falling. I am coming back in by the front.',
    fenn: 'You keep a gate. I have broken a hundred. Move.', isolde: 'You speak of order. I have seen what you keep in your cells.',
    brakk: 'Step aside. I do not want to hurt you. I will.', pyra: "You built a lift so nobody could climb. I'm here anyway. Funny how that goes.",
    gale: "You can't hold the air shut. Nobody can.", ashka: 'Ninety years of their heat, piped up to you. I have come to collect.',
    dyna: 'Nice lift. Load-bearing, I assume? Shame.', vesper: 'Your guards did not see me board. Neither did you.',
    orin: 'Every door has two sides. You have only ever stood on one.', mira: 'Look behind you. ...No. The other way.',
    noct: '...', bando: "You're standing well out of reach. Doesn't matter.", aldric: 'You swore an oath to a lift. I swore mine to people. Draw.',
    sen: 'Your stance is good. Your cause is not.', vega: 'Everything comes down in the end. You first.',
    tessa: 'I know how this ends, Castellan. You do too, I think.', jax: 'The house is closed, Lord. Cash out.',
    ferra: 'All this gold trim, and not one honest bolt. I can feel it from here.', kiri: 'There are two of me. Count again.',
    tarn: "It's a road. I'm on it.", maren: 'You are pale, my lord. Too long above the clouds. I can fix that.',
    yara: 'I had you in my sights from the bottom of the lift. I waited, so you would see me.', brann: 'Get out of the door.'
  };
  Object.assign(L, {
    r_k3: [say('marlo', 'The army is at the Skylift gate: east road out of town, past the pump. Everyone is waiting for you, champion. Don\'t keep a crowd waiting. It gets ideas.')],
    r_k3_done: [say('marlo', "Lift's running up and down all day with our people on it. I never thought I'd hear myself say that. Go and see Aurelia. Come back and tell me if it's worth it.")],
    k3_enter: [
      say('sys', 'The Skylift gate. A cable as thick as a house goes straight up into the cloud, and at its foot stands everyone who ever had a reason to hate Halcyon.'),
      say('marlo', 'Caravans on the left, the deep on the right, and nobody throwing anything at anybody. I have waited my whole life for this morning.'),
      say('anvil', "Gate guard's dug in behind the crates. Halcyon white, all of them. You hit the front. We'll hold the road behind you."),
      say('partner', { K: 'Once the gate breaks, the lift is ours. They will try to take it back on the way up. Stay on the platform.', N: "Gate first. Then we ride that thing up and they throw everything they've got at us on the way. You ready?" }),
      say('hero', { K: "Let's go and ask for it back.", N: 'Ready.' })
    ],
    k3_anvil: [say('anvil', 'Deepline is here. All of it. I keep looking round for the fight starting between the gangs. It does not start. Strange morning.')],
    k3_anvil2: [say('anvil', "Up and down all day. My crew have never seen the sky from above. One of them cried. I won't tell you which.")],
    k3_partner: [say('partner', { K: 'I fell out of that city. Now I am riding back into it with an army. I do not know what to do with my hands.', N: "I've been looking up at that thing my whole life. I always thought I'd be climbing a drainpipe." })],
    k3_partner2: [say('partner', { K: 'The Noble Ring is up there. Where they keep the people who give the orders. That is where we go next.', N: "Noble Ring next. All the people who signed the orders, living in houses made of gold. Can't wait." })],
    k3_marlo: [say('marlo', 'Take the gate. Then take the lift. Then tell me what the view is like.')],
    k3_gate_in: [
      say('vane', '(Over the gate speakers) Citizens of the Surface. Disperse. The Skylift is Halcyon property. This is the only warning you will receive.'),
      say('sys', 'The gate guard locks shields. Behind you, the whole army roars.')
    ],
    k3_gate_win: [say('sys', 'The gate guard breaks and runs for the lift. They do not get there. The platform is empty, and waiting.')],
    k3_board: [
      say('liftman', "You want it going UP? Fine by me. I've been on the wrong side of these people for thirty years. Hold on to something."),
      say('sys', 'The gates at each end of the platform slam shut. The cable shudders. The ground drops away under you.'),
      say('sys', 'Halcyon will not let you reach the top. Hold the platform: they will drop boarding parties on you all the way up.')
    ],
    k3_vane: [
      say('sys', 'The lift docks with a sound like a bell. The engineer throws you his med-kit. On the landing stands a single man in white and gold, sword at his side, completely unhurried.'),
      say('vane', 'Lord Castellan Vane, keeper of the Skylift. Ninety years, and nothing from below has ever ridden this lift without leave.'),
      say('hero', HERO_VANE),
      say('vane', 'You fight well. That does not make it your city. Come, then. Show me what the Surface has learned.'),
      say('sys', 'Hold S to GUARD his blade. Dash (L) through the golden crescents.\nWhen he flashes white and lunges, DASH through it.')
    ],
    k3_vane_win: [
      say('vane', '...Enough. Enough. I have kept this gate for twenty years, and I have never once been asked why.'),
      say('vane', 'The Noble Ring will hear of this, and they will not like it. I will not stop you. Do not mistake that for my help.'),
      say('partner', { K: 'He is not running. He is just... standing aside.', N: "Huh. He's just letting us through." }),
      say('anvil', "Then we go through. Lift's ours. I'll send the first loads up now.", { step: 'A3-3:top' }),
      say('sys', 'The Skyport is open. The lift will carry the army up behind you, one platform-load at a time.', { fn: 'card:act3b' })
    ]
  });
  story.skylift = { WAVES, riding };
})();
