'use strict';
// Shattered Worlds — ACT 3: Convergence, part 1. Loaded last; like the other story files it only adds and wraps.
// Follows the Act 3 outline in the design document, with original characters in every role:
//   A3-1 Two Worlds, One Plan   break the veil mast at the Crater; the "agent" is the lead hero of the other road, and
//                               becomes your PARTNER (an assist: O when the awakening bar is not full). War council at
//                               Marlo's fire in Scrapton.
//   A3-2 Rally the Deep         the Pit Arena Grand Melee: beat Anvil, the champion, then five waves of every gang's best.
//                               Deepline follows the winner. Anvil joins as a second assist.
//   A3-3 onward (the Skylift, the Noble Ring, the Spire, the Engine core) are not built yet.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, HR = D.heroes, P = SW.Player.prototype, text = SW.text, rand = SW.rand;
  if (!story || !story.patch || !Z.crater) return;
  const sfx = n => SW.audio.sfx(n);
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const rival = () => (G.route() === 'kael' ? 'nyra' : 'kael');
  const isFoe = e => e.hittable && e.team === 'enemy' && !e.dead;

  // ================= the partner: the other road's lead hero, as a speaker and as an assist =================
  D.speakers.partner = { name: 'Partner', sheet: 'nyra', pitch: 400 };
  const sync = () => { if (!G.state || !G.state.hero) return; const r = HR[rival()]; Object.assign(D.speakers.partner, { name: r.name, sheet: r.sheetArmed || r.sheet, pitch: r.pitch || 400 }); };
  const _start = ui.dlg.start; ui.dlg.start = function (g, id, cb) { sync(); return _start.call(ui.dlg, g, id, cb); };

  // what each assist does when called (O while the awakening bar is not full; 20 s cooldown)
  class Vis {
    constructor(x, y, life, render, tick) { Object.assign(this, { x, y, life, render, tick, t: 0 }); }
    update(g, z) { this.t++; if (this.tick) this.tick(this, g, z); if (this.t >= this.life) this.gone = true; }
    draw(ctx, cam) { this.render(ctx, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this.t, this); }
  }
  const hurt = (e, dmg, o) => { if (!e || e.dead) return; const b = e.box(), atk = Object.assign({ team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg, kx: 0, ky: -2, stun: 40, energy: true, heavy: true, hitSet: new Set(), quiet: true }, o || {}); if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); };
  function callIn(p, id) {
    const z = p.G.zone, face = p.face, sheet = id === 'anvil' ? 'anvil' : (HR[id].sheetArmed || HR[id].sheet), x = p.x - face * 22, y = p.y;
    const mul = p.specMul ? p.specMul() : 1, near = r => z.ents.filter(e => isFoe(e) && Math.abs(e.x - p.x) < r && Math.abs(e.y - p.y) < 90).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
    fx.ring(x, y - 16, id === 'anvil' ? '#f5c542' : HR[id].colorHi, 4, 34, 14); sfx('awaken');
    z.add(new Vis(x, y, 56, (ctx, sx, sy, t) => {
      const f = t < 12 ? 0 : t < 30 ? 1 : 2, anim = id === 'anvil' ? (t < 14 ? 'idle' : 'a4') : t < 14 ? 'cast' : 'special';
      art.draw(ctx, sheet, anim, f, sx, sy, face < 0, { alpha: Math.min(1, t / 6, (56 - t) / 10) });
    }, v => {
      if (v.t !== 14) return;
      if (id === 'kael') {        // lightning on up to four enemies
        sfx('zap'); fx.flash('#ffe7a8', 5);
        near(300).slice(0, 4).forEach(e => { fx.bolt(e.x + rand(-10, 10), G.cam.y - 10, e.x, e.y - e.h / 2, '#ffe7a8'); hurt(e, Math.round(26 * mul), { stun: 60 }); });
        G.toast(HR.kael.name + ': "Sparks, coming down!"', HR.kael.color);
      } else if (id === 'nyra') { // a line of frost along the floor ahead
        sfx('shard');
        for (let i = 1; i <= 9; i++) z.add(new Vis(x + face * i * 24, y, 30, (ctx, sx, sy, t) => { const h = Math.round(Math.min(1, (t - i) / 4) * 16 * (t > 22 ? (30 - t) / 8 : 1)); if (h > 0) { art.rect(ctx, '#7fd8ff', sx - 3, sy - h, 6, h); art.rect(ctx, '#ffffff', sx - 1, sy - h, 2, h); } }));
        z.ents.filter(e => isFoe(e) && (e.x - x) * face > -10 && Math.abs(e.x - x) < 230 && Math.abs(e.y - y) < 50).forEach(e => hurt(e, Math.round(22 * mul), { status: { freeze: 100 }, ky: -1 }));
        G.toast(HR.nyra.name + ': "Stay still."', HR.nyra.color);
      } else {                    // Anvil: a slam that floors everything close
        sfx('explode'); fx.shake(8, 14); fx.dust(x, y, 12); fx.ring(x, y - 6, '#f5c542', 8, 90, 14);
        near(110).forEach(e => hurt(e, Math.round(30 * mul), { ky: -6, launch: true, down: true }));
        G.toast('Anvil: "My turn."', '#f5c542');
      }
    }));
  }
  const ASSISTS = { partner: 1, anvil: 1 };
  const _aw = P.useAwaken; P.useAwaken = function () {
    const g = this.G, S = g.state, h = g.hero();
    if (g.scene === 'vs' || I.held('down') || !ASSISTS[S.assist] || (S.awaken >= 100 && g.has(h.awaken) && this.awakeT <= 0)) return _aw.call(this);
    if (this.assistCd > 0) { sfx('deny'); return; }
    this.assistCd = 1200;
    callIn(this, S.assist === 'partner' ? rival() : 'anvil');
  };
  const _hud = ui.hud; ui.hud = function (ctx, g) { sync(); _hud(ctx, g); };

  // ================= the champion of the Pit, as a boss =================
  E.champ = { name: 'ANVIL', sub: 'Champion of the Pit, nine years unbeaten', sheet: 'anvil', sheet2: 'champ2', hp: 900, dmg: 18, speed: 1.0, xp: 320, creds: 220, idle: 26, w: 18, h: 42,
    script: [['swings', { n: 3, reach: 56, col: '#f5c542' }, [3, 1]], ['charge', {}, [1, 3]], ['slam', {}, [2, 2]], ['stomp', { col: '#f5c542' }, [2, 1]]] };
  const _init = art.init; art.init = function () { _init(); try { story.recolor('champ2', 'anvil', { top: '#8a2a1a' }); } catch (e) { console.error(e); } };

  // ================= missions =================
  Object.assign(M, {
    'A3-1': { id: 'A3-1', title: 'Two Worlds, One Plan', hero: 'all', xp: 380, creds: 200, next: 'A3-2', steps: [
      { id: 'mast', t: 'Go back across the Crater and break the veil mast at Field Post 3' }, { id: 'meet', t: 'Find out who is waiting on the Crater floor' },
      { id: 'council', t: "Bring them to Marlo's fire in Scrapton" }] },
    'A3-2': { id: 'A3-2', title: 'Rally the Deep', hero: 'all', xp: 460, creds: 300, next: null, steps: [
      { id: 'deep', t: 'Go down to the Pit Arena (Metro Shaft hatch, west of the Scrapton gate)' }, { id: 'champ', t: 'Call the Grand Melee and beat Anvil' },
      { id: 'gauntlet', t: "Survive the gauntlet: five waves of Deepline's best" }, { id: 'pledge', t: 'Hear what Deepline has to say' }] }
  });
  if (M['A2-4']) M['A2-4'].next = 'A3-1';
  const _cg = G.continueGame; G.continueGame = function () {
    _cg();
    const S = G.state;
    if (S && G.scene === 'play' && !S.mission && S.done['A2-4'] && !S.done['A3-1']) S.mission = 'A3-1';   // saves from before Act 3 existed
  };
  story.cards.act3a = { title: 'ACT 3 - PART 1 COMPLETE', lines: ['The veil is broken. Two roads are one.', 'The caravans of the Surface and the gangs of Deepline', 'answer to the same fire now.', '',
    'Halcyon holds the Skylift: the only way up', "that isn't a hole in the sky.", '', 'Next build: storm the Skylift, the Noble Ring uprising,', 'the Halcyon Spire and the Engine core.', '', 'Until then: free roam, the Pit, and twenty-four other heroes.'] };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 0 || M[g.state.mission] || !g.state.done['A3-2']) return;
    art.rect(ctx, '#080916', 16, 34, 440, 44);
    text(ctx, 'Act 3, part 1 complete', 26, 40, '#f5c542', { scale: 2 });
    text(ctx, 'Free roam. Next build: the Skylift, the Noble Ring and the Spire.', 26, 64, '#ffffff');
  };

  // dialogue hooks: a3:<what>
  const _hook = G.hook; G.hook = function (fn) {
    if (fn === 'a3:mast') { G.setFlag('veil_down'); G.step('A3-1:mast'); fx.flash('#b48cff', 12); fx.shake(9, 24); sfx('explode'); G.toast('The veil is down - everywhere at once.', '#b48cff'); }
    else if (fn === 'a3:meet') { G.step('A3-1:meet'); G.toast('PARTNER: ' + HR[rival()].name + '. O calls them in when your awakening bar is not full.', HR[rival()].color); }
    else if (fn === 'a3:council') { G.setFlag('shaft_open'); G.step('A3-1:council'); }
    else if (fn === 'a3:melee') G.melee = { state: G.state.steps['A3-2:champ'] ? 'rest' : 'intro', t: 40, wave: 0, foes: [] };
    else if (fn === 'a3:pledge') {
      const S = G.state; if (S.assists.indexOf('anvil') < 0) S.assists.push('anvil');
      G.toast('ANVIL joins as an assist. Esc > Assist switches between your allies.', '#f5c542'); G.step('A3-2:pledge');
    }
    else _hook(fn);
  };

  // an NPC that is only there some of the time
  class Shown extends SW.NPC {
    canInteract(g) { return (!this.show || this.show(g)) && super.canInteract(g); }
    draw(ctx, cam, g) { if (this.show && !this.show(G)) return; super.draw(ctx, cam, g); }
  }
  const npc = (z, sheet, tx, ty, o) => z.add(new Shown(sheet, tx * 16 + 8, (ty + 1) * 16, o));

  // ================= A3-1 in the Crater =================
  story.patch('crater', (z, g) => {
    const S = g.state, on = gg => gg.state.mission === 'A3-1';
    z.arena({ id: 'mast', x0: 80, x1: 108, gy: 19, gh: 12, intro: 'c3_mast_in', win: 'c3_mast_win', armed: gg => on(gg) && !gg.flag('veil_down'),
      enemies: [['veilguard', 92, 19], ['veilenf', 99, 19], ['veilguard', 103, 19], ['drone', 96, 14]] });
    z.thing('console', 97, 19, { prompt: 'Overload the veil mast', glow: '#b48cff', when: gg => on(gg) && gg.flag('arena:crater:mast') && !gg.flag('veil_down'), use: gg => gg.say('c3_mast') });
    const r = rival(), h = HR[r];
    npc(z, h.sheetArmed || h.sheet, 152, 19, { name: '???', face: -1, fixed: true, talk: 'c3_meet', show: gg => gg.flag('veil_down') && !gg.state.steps['A3-1:meet'] });
    z.hint(140, 10, 8, 10, 'Someone is sitting on the Crater floor. Talk to them (E).');
    z.hints[z.hints.length - 1].when = gg => gg.flag('veil_down') && !gg.state.steps['A3-1:meet'];
  });
  // hints with a condition
  const _w = G.update; G.update = function () { const z = G.zone; if (z && z.hints) z.hints.forEach(h => { if (h.when) { if (!h.text0) h.text0 = h.text; h.text = h.when(G) ? h.text0 : ''; } }); return _w.apply(this, arguments); };

  // ================= Scrapton: the war council =================
  story.patch('scrapton', (z, g) => {
    const S = g.state, st = S.steps, r = rival(), h = HR[r];
    npc(z, h.sheetArmed || h.sheet, 98, 19, { name: h.name, face: 1, talk: gg => (gg.state.done['A3-2'] ? 'r_partner3' : st['A3-1:council'] ? 'r_partner2' : 'r_partner'), show: gg => !!gg.state.steps['A3-1:meet'] });
    z.ents.forEach(e => {
      if (!(e instanceof SW.NPC) || e.sheet !== 'marlo') return;
      const t0 = e.talk;
      e.talk = gg => (S.mission === 'A3-1' && st['A3-1:meet'] && !st['A3-1:council'] ? 'r_council' : S.mission === 'A3-1' && !st['A3-1:meet'] ? 'r_a3_wait'
        : S.mission === 'A3-2' ? 'r_council2' : S.done['A3-2'] ? 'r_council3' : typeof t0 === 'function' ? t0(gg) : t0);
    });
  });

  // ================= A3-2 in the Pit: the Grand Melee =================
  const WAVES = [
    [['brawler', 22, 13, { hp: 80 }], ['thug', 25, 13, { hp: 70 }], ['thug', 6, 13, { hp: 70 }]],
    [['ganger', 24, 13, { hp: 70 }], ['brawler', 6, 13, { hp: 80 }], ['ganger', 9, 13, { hp: 60 }]],
    [['raider', 23, 13, { hp: 100 }], ['thug', 6, 13, { hp: 70 }], ['brawler', 9, 13, { hp: 80 }]],
    [['enforcer', 22, 13, { hp: 110 }], ['ganger', 6, 13, { hp: 70 }], ['raider', 25, 13, { hp: 90 }]],
    [['raider', 24, 13, { hp: 110 }], ['enforcer', 6, 13, { hp: 110 }], ['brawler', 20, 13, { hp: 90 }], ['thug', 9, 13, { hp: 70 }]]
  ];
  story.WAVES3 = WAVES;
  class Melee {
    constructor() { G.melee = null; }
    update(g, z) {
      const m = g.melee, p = g.player;
      if (!m || g.busy() || !p) return;
      if (m.state === 'intro') { m.state = 'talk'; g.say('p3_champ', () => {
        const e = z.enemy('champ', 22, 13); e.ax0 = 16; e.ax1 = 28 * 16; e.state = 'chase'; e.dormant = false; g.boss = e; m.boss = e; m.state = 'champ';
        SW.audio.music('boss'); fx.ring(e.x, e.y - 20, '#f5c542', 6, 40, 16);
      }); }
      else if (m.state === 'champ') { g.alert(); if (m.boss.dead) { g.boss = null; m.state = 'talk'; g.step('A3-2:champ'); g.say('p3_champ_win', () => { m.state = 'rest'; m.t = 70; m.wave = 0; p.heal(p.hpMax()); }); } }
      else if (m.state === 'rest') { if (--m.t <= 0) {
        m.foes = WAVES[m.wave].map(w => { const e = z.enemy(w[0], w[1], w[2], w[3]); e.state = 'chase'; fx.ring(e.x, e.y - 14, '#ff3ea5', 4, 30, 16); return e; });
        m.state = 'fight'; g.toast('GAUNTLET ' + (m.wave + 1) + ' / ' + WAVES.length, '#ff3ea5'); sfx('roar');
      } }
      else if (m.state === 'fight') { g.alert(); if (m.foes.every(f => f.dead)) {
        m.wave++;
        if (m.wave >= WAVES.length) { m.state = 'won'; m.t = 70; }
        else { m.state = 'rest'; m.t = 90; p.heal(Math.round(p.hpMax() * 0.12)); g.toast('Wave clear!', '#7dffa0'); }
      } }
      else if (m.state === 'won') { if (--m.t <= 0) { g.melee = null; g.step('A3-2:gauntlet'); SW.audio.music('arena'); g.say('p3_win'); } }
    }
    draw() {}
  }
  story.patch('pit', (z, g) => {
    const on = gg => gg.state.mission === 'A3-2';
    z.ents = z.ents.filter(e => !(e instanceof SW.NPC && e.sheet === 'anvil'));
    npc(z, 'anvil', 26, 13, { name: 'Anvil', fixed: true, face: -1, talk: gg => (gg.state.done['A3-2'] ? 'p3_anvil_after' : on(gg) ? 'p3_anvil' : null), show: gg => !gg.melee });
    z.ents.forEach(e => { if (e instanceof SW.NPC && e.sheet === 'bookie') { const t0 = e.talk; e.talk = gg => (on(gg) && !gg.state.steps['A3-2:gauntlet'] ? 'p3_bookie' : typeof t0 === 'function' ? t0(gg) : t0); } });
    z.trigger(2, 2, 5, 12, gg => { if (on(gg)) { gg.step('A3-2:deep'); gg.say('p3_enter'); } }, { flag: 'a3_pit_in' });
    z.add(new Melee());
  });
  const _gs = G.gotoZone; G.gotoZone = function (id, spawn) { G.melee = null; return _gs.call(this, id, spawn); };
  const _gr = G.respawn; G.respawn = function () { G.melee = null; return _gr.apply(this, arguments); };

  // ================= the words =================
  const HERO_MEET = {
    kael: "You're the girl from the white walls. I hit you with a lightning storm. ...Sorry. Mostly sorry.",
    nyra: 'You are the boy from below. I nearly took your arm off with a blade of ice. I am sorry. Not entirely.',
    fenn: 'You smell of the harbour. Not of them. I should have trusted my nose over my eyes.',
    isolde: 'The eyrie taught me to look twice at anything that falls from the sky. I looked once. Forgive me.',
    brakk: 'You are hurt. I did that. Sit. I will stand in front of you until you can stand again.',
    pyra: "Oh. You're not lab staff. You're one of their EXPERIMENTS. That makes two of us. ...Hi.",
    gale: "You were never wearing white. The wind kept trying to tell me. I wasn't listening.",
    ashka: 'They dressed you as a jailer and me as a battery. We should go and find the tailor.',
    dyna: "I wasted a perfectly good charge on you. That is the most insulting thing Halcyon has done to me yet.",
    vesper: 'I aimed for the wrong throat. That has never happened to me before. It will not happen again.',
    orin: 'You were standing in a doorway the whole time. I did not see you behind it. Now I do.',
    mira: 'The glass showed me the truth while my eyes argued with it. I should listen to the glass more.',
    noct: '...I cut the shadow they hung on you. Not you. I would like that to stay true.',
    bando: "I punched you from across the Crater. I'm going to buy you something. I don't know what yet.",
    aldric: 'I struck a stranger who never swore against me. I owe you a debt, and I pay my debts.',
    sen: 'My stroke was true and my eyes were false. I will not draw on a face I have not truly seen again.',
    vega: 'You weighed so little, once the lie was off you. Sit down. Let something carry you for once.',
    tessa: 'I saw three ways that fight could end. None of them had you sitting here. I like this one best.',
    jax: "We were both dealt from a stacked deck, friend. Let's go and find the dealer.",
    ferra: 'No armour on you anywhere. There never was. Just a kid in a coat. ...Same as me, once.',
    kiri: 'There were two of me and one of you, and you were still the frightened one. I am sorry.',
    tarn: "You walked every mile of my road from the other end. We've been walking toward each other.",
    maren: "Those knuckles are wrapped wrong. Hold still. ...No, I insist. I'm a doctor.",
    yara: 'I had you at a hundred paces and never once saw you. I am seeing you now.',
    brann: "Somebody's cub, and I came at you like the winter. Sit by me. Nothing comes through the door."
  };
  Object.assign(L, {
    // ----- A3-1, the Crater -----
    c3_mast_in: [
      say('sys', 'Field Post 3 has new crew. They are rebuilding the barricade around the mast, fast, and badly.'),
      say('tech', "It's the subject again! Hold the emitter! If the veil drops now, the Spire loses BOTH of them!")
    ],
    c3_mast_win: [say('sys', 'The post is empty. Under the mast, a console is still feeding it, humming one held note.')],
    c3_mast: [
      say('sys', 'PARALLAX VEIL - CARRIER FROM SPIRE - LOCAL EMITTER 3 OF 3. Two signatures are still tagged on the screen. One of them is yours.'),
      say('hero', { K: "(They're still painting it on. Right now. On both of us.) ...Not any more.", N: '(It is still running. On both of us, right now.) ...Then I will stop it.' }),
      say('sys', 'You open every valve on the console at once. The mast rings like a struck bell - and then it is only metal, falling over.', { fn: 'a3:mast' }),
      say('sys', 'Far to the east, on the Crater floor, someone who was sitting in Halcyon white is suddenly not.')
    ],
    c3_meet: [
      say('sys', 'On the glass where the white figure stood, someone is sitting with their back to a rock. No armour. No helmet. They look up.'),
      say('partner', { K: '...You. You are the agent. ...No. You are not. You never were. You look exactly as frightened as I feel.',
        N: "...You're the white-hat. ...No. Look at you. You're not one of them. You never were, were you." }),
      say('hero', HERO_MEET),
      say('partner', { K: 'The rift does not go all the way up. Halcyon has sealed the top with a lid of light, under the city. I climbed until it burned. Then I fell.',
        N: "The rift's got a lid on it. Halcyon light, right across the top. I got close enough to read the warning signs. Then I got close enough to bounce." }),
      say('partner', { K: 'They set us on each other so that neither of us would reach them. Somebody up there is watching. I would like to disappoint them.',
        N: "They set us on each other so we'd be too busy to go up. I hate being useful to people like that." }),
      say('hero', { K: "Then we don't go up the hole. We go up the front.", N: 'Then we go up some other way. Together.' }),
      say('partner', { K: 'The front is the Skylift, and Halcyon holds it. Two of us will not be enough. We need everyone who hates them in one room.',
        N: "The Skylift. Halcyon's whole gate guard sits on it. Two of us won't cut it. We need an army. Know anyone?" }),
      say('hero', { K: "There's a caravan boss in Scrapton who knows everyone on the Surface. Marlo.", N: 'There is a caravan master in Scrapton. Marlo. He knows everyone.' }),
      say('sys', 'PARTNER: {NAME} fights beside you now. Press O when your awakening bar is not full to call them in (20 s cooldown).', { assist: 'partner', fn: 'a3:meet' })
    ],
    // ----- A3-1, Scrapton -----
    r_a3_wait: [say('marlo', "There's a pillar of light over the Crater and my scouts swear Halcyon's still out there in it. Whatever you're doing, finish it and come back.")],
    r_partner: [say('partner', { K: 'Marlo is waiting at the fire. I would rather you did the talking. People here keep looking at me as if I were going to freeze them.', N: "Marlo's at the fire. You talk. Everyone here keeps looking at me like I'm about to blow up." })],
    r_partner2: [say('partner', { K: 'The Pit. Deepline. I have never been under the city. I hear it is warm.', N: "The Pit, huh? I fought there, once. Anvil threw me out of the cage. Twice. Tell him I said hi." })],
    r_partner3: [say('partner', { K: 'An army of the Surface and an army of the deep. Halcyon should be worried. I would be.', N: "We've got an army. An actual army. Halcyon's going to need a bigger lift." })],
    r_council: [
      say('marlo', 'So. The Halcyon agent my scouts swore by is sitting at my fire, eating my beans. Somebody explain this to me slowly.'),
      say('partner', { K: 'There was a veil on both of us. Each of us saw the other in Halcyon white. We were meant to finish each other at the Crater.', N: "Halcyon hung a picture on both of us. I saw a white-hat, they saw a white-hat. We were supposed to kill each other at the Crater." }),
      say('odile', "And now you're both here, both breathing, and both bleeding on my clean blankets. I'll take that."),
      say('juniper', "The relay's dark, the Glowmother's dead, and the Crater's quiet for the first time in six years. Whatever you two are, you're on our side."),
      say('marlo', "Here's what I know. Halcyon owns the Skylift: the only way up that isn't a hole in the sky. Three hundred guards on the gate. The caravans alone can't take it."),
      say('partner', { K: 'The gangs under the city could. Hundreds of them, and every one hates Halcyon.', N: "Deepline's got fighters. Hundreds. They just hate each other more than they hate Halcyon. Today." }),
      say('marlo', "The gangs answer to one thing: the Pit. Call the Grand Melee, beat Anvil and whoever comes after him, and every crew in Deepline owes the champion a favour."),
      say('hero', { K: "Then I'll go down and win it.", N: 'Then I am going to the Pit.' }),
      say('marlo', "I've had the Metro Shaft unbarred. The hatch just west of the gate goes straight down. Bring me back an army.", { fn: 'a3:council' })
    ],
    r_council2: [say('marlo', 'The hatch west of the gate goes straight down to the Old Metro, and the Neon Market is past it. The Pit is behind the red door. Go and win us an army.')],
    r_council3: [say('marlo', "Deepline sent word up the shaft: they'll follow you. All of them. I've never seen the Surface and the deep agree on anything. Don't waste it.")],
    // ----- A3-2, the Pit -----
    p3_enter: [
      say('sys', 'The Pit Arena. Word travels fast in Deepline: every gang boss in the city is in the stands tonight, and none of them is cheering.'),
      say('bookie', "Well, well. The one who wants Deepline to go UP. Talk to me when you're ready to lose. Or not.")
    ],
    p3_bookie: [say('bookie', "The Grand Melee? Nobody's called one in nine years. The champion first, then the best of every gang that wants a piece of you, back to back. Win, and Deepline goes where you go.",
      { choice: [{ t: 'Fight', fn: 'a3:melee' }, { t: 'Not yet' }] })],
    p3_anvil: [say('anvil', "I hear you want my title. Funny. Nine years I've waited for somebody to want it for the right reason. Tell the Bookie. I'll be in the cage.")],
    p3_champ: [
      say('anvil', 'No tricks. No crowd paid to cheer. Just the cage, and whoever is still standing in it.'),
      say('hero', { K: "Let's go, champ.", N: 'Ready when you are.' }),
      say('sys', "Hold S to GUARD his fists. When he LEAPS, get out from under him and jump the shockwave.\nWhen he flashes white he CHARGES: dash (L) through him and he dazes himself on the cage wall.")
    ],
    p3_champ_win: [
      say('anvil', '...Nine years. Huh. Go on, then. The gangs have been waiting all night to see who would be left standing.'),
      say('sys', "THE GAUNTLET: five waves of the best of every Deepline gang, back to back. Anvil's corner man patches you up first, and you get your breath back between waves.")
    ],
    p3_win: [
      say('sys', 'The last fighter goes down. For a moment the whole Pit is silent. Then the gang bosses start coming down out of the stands, one at a time.'),
      say('anvil', "The Pit has a champion. That means Deepline has an army. Every crew down here owes you a favour, and I'm calling all of them in."),
      say('bookie', "Never thought I'd see the day. Even the Rat King's old crew is in. Where do you want them?"),
      say('hero', { K: 'Up. The Skylift. Halcyon took everything from everyone down here. We are going to go and ask for it back.', N: 'Up. To the Skylift. They have lived under Aurelia long enough. It is time they saw it.' }),
      say('anvil', "Then you'll want me on the lift beside you. Call when you need a wall. I'm a very good wall.", { fn: 'a3:pledge' }),
      say('sys', 'Take the news back up the shaft. The Skylift is the next road.', { fn: 'card:act3a' })
    ],
    p3_anvil_after: [say('anvil', 'Deepline is waiting on your word, champion. So am I.')]
  });
  // the partner's name in a system line
  const _next = ui.dlg.next; ui.dlg.next = function (g) { _next.call(ui.dlg, g); const ln = ui.dlg.active && ui.dlg.lines[ui.dlg.i]; if (ln && typeof ln.t === 'string' && ln.t.indexOf('{NAME}') >= 0) { ln.t = ln.t.split('{NAME}').join(HR[rival()].name.toUpperCase()); ui.dlg.wrapped = SW.wrap(ln.t, ln.s === 'sys' ? 420 : 372); } };
  story.act3 = { rival, callIn };
})();
