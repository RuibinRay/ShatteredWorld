'use strict';
// Shattered Worlds — side quests, first four (design document: "Side quests (sample of 10)"). Only wraps; nothing in the
// shared files is edited. The document's versions lean on characters from other series; these use the game's own cast.
//   BUN RUN (Mags, Deepline Slums; after Act 1): five hot buns to five people across the Underground before they go cold
//     (the Slum Kid, the Cartographer and Madame Quill in the Neon Market, the Bookie in the Pit, Tamsin in the Old Metro).
//     Reward: +20 max HP for good. If the timer runs out, Mags bakes another batch.
//   ARENA LADDER (the Bookie, Pit Arena; after the first sparring win): ten ranked tiers, one fight each, healed to full
//     first. First clears pay creds (and Syndicate standing); titles at tiers 3, 6 and 10. Tier 10 is Anvil, after the
//     Grand Melee (A3-2), and pays a core.
//   DRY WELLS (Wenna, Ash Dunes; after the Scrap Baron): three broken pumps. Each takes 3 scrap to fix, and the noise
//     brings two raiders (a Husk and a raider at night). Reward: creds, gel and Caravan standing.
//   ODILE'S PATIENTS (Odile, Scrapton; once you have the Glowwild filter): six glowcaps from the Glowwild. Reward: healing
//     items heal 15% more of your max HP, for good.
//   Esc > QUESTS (the ninth tab) lists them; a "!" over a giver means a quest to take, "?" means one to hand in.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, E = D.enemies, Z = SW.zones, ui = SW.ui, I = SW.input, art = SW.art, fx = SW.fx, text = SW.text, T = 16;
  const story = SW.story, HT = SW.heat, M = SW.mods, P = SW.Player.prototype;
  const sfx = n => SW.audio.sfx(n), inStory = () => G.scene === 'play' && !!G.state;
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const GOLD = '#f5c542', GREEN = '#7dffa0';

  // ---- save data ----
  const ensure = S => {
    if (!S) return S;
    if (!S.sq) S.sq = {};
    const q = S.sq;
    if (!q.bun) q.bun = { state: 'none', t: 0, got: {} };
    if (!q.ladder) q.ladder = { best: 0, title: '' };
    if (!q.wells) q.wells = { state: 'none', fixed: {} };
    if (!q.herbs) q.herbs = { state: 'none', got: {} };
    return S;
  };
  const Q = () => ensure(G.state).sq;
  const done = () => (G.state && G.state.done) || {};

  // ================= BUN RUN =================
  // measured with the route bot: Mags to the Slums' east exit 24 s, the Market to the Pit door 10 s, the Pit door to the
  // Old Metro 5.5 s, the Metro entrance to Tamsin 2 s; with five stops and four screen changes a clean run is about 55 s
  const BUN_TIME = 100 * 60;
  const BUN_TO = [['kid'], ['ferro'], ['quill'], ['bookie'], ['tamsin']];   // the Slum Kid, the Cartographer, Madame Quill, the Bookie, Tamsin
  const bunOpen = () => G.flag('scrap_arrive');
  function bunStart() { const b = Q().bun; b.state = 'active'; b.t = BUN_TIME; b.got = {}; sfx('select'); G.toast('Five hot buns. Go!', GOLD); }
  function bunDeliver(sheet) {
    const b = Q().bun; b.got[sheet] = true; sfx('pickup');
    const n = Object.keys(b.got).length;
    if (n >= BUN_TO.length) { b.state = 'delivered'; G.toast('All five delivered, still hot. Tell Mags.', GREEN); }
    else G.toast(`Bun delivered (${n}/5)`, GOLD);
  }
  const _hp = P.hpMax; P.hpMax = function () { const v = _hp.apply(this, arguments); return inStory() && G.state.sq && G.state.sq.bun && G.state.sq.bun.state === 'done' ? v + 20 : v; };

  // ================= ARENA LADDER =================
  // [foes ([type, tile x]), recommended level]. Measured at those levels (Kael and Nyra, the two test players): tiers 1-3
  // cost 0-5% health, tiers 4-9 about 15-50%, and tier 10 (Anvil) kills the masher and costs the careful player ~57%.
  // Two Sump Gangers in one tier (they shoot) cost 70-80%, so no tier has more than one; the ferals moved down to tier 3.
  const TIERS = [
    [[['thug', 22], ['thug', 25]], 3],
    [[['brawler', 22], ['thug', 25], ['thug', 6]], 4],
    [[['feral', 22], ['feral', 25], ['feral', 6], ['feral', 9], ['brawler', 20]], 5],
    [[['brawler', 23], ['brawler', 6], ['ganger', 25]], 6],
    [[['bandit', 22], ['bandit', 6], ['ganger', 25], ['thug', 9]], 8],
    [[['raider', 22], ['gunner', 25], ['bandit', 6], ['raider', 9]], 9],
    [[['stalker', 22], ['stalker', 6], ['raider', 25], ['raider', 9], ['gunner', 20]], 11],
    [[['veilguard', 22], ['veilenf', 25], ['veilguard', 6]], 14],
    [[['elitegd', 22], ['eliteenf', 25], ['veilenf', 6], ['veilguard', 9]], 16],
    [[['champ', 22]], 18]
  ];
  const TITLES = { 3: 'Pit Regular', 6: 'Pit Veteran', 10: 'Pit Legend' };
  const TITLE_MSG = { 3: 'New title: Pit Regular', 6: 'New title: Pit Veteran', 10: 'New title: Pit Legend' };   // whole lines, so they translate
  const ladderOpen = () => G.flag('pit_won');
  const tierOpen = n => n <= Q().ladder.best + 1 && (n < 10 || !!done()['A3-2']);
  const L = { run: null };   // the fight in progress (not saved: leaving or falling ends it)
  function ladderStart(n) {
    if (G.pit || G.melee || L.run) return;
    L.run = { tier: n, state: 'intro', t: 60, foes: [] };
    const p = G.player; p.heal(p.hpMax()); G.state.energy = Math.max(G.state.energy, 200);
    G.toast(`LADDER TIER ${n} - get ready`, '#ff3ea5');
  }
  class Ladder {
    update(g, z) {
      const r = L.run, p = g.player;
      if (!r || g.busy() || !p) return;
      if (r.state === 'intro') {
        if (--r.t > 0) return;
        r.foes = TIERS[r.tier - 1][0].map(f => { const e = z.enemy(f[0], f[1], 13); e.state = 'chase'; e.dormant = false; e.ax0 = 16; e.ax1 = 28 * 16; fx.ring(e.x, e.y - 14, '#ff3ea5', 4, 30, 16); return e; });
        if (r.tier === 10) { g.boss = r.foes[0]; SW.audio.music('boss'); }
        r.state = 'fight'; sfx('roar'); g.toast('FIGHT!', '#ff3ea5');
      } else if (r.state === 'fight') {
        g.alert();
        if (r.foes.every(f => f.dead)) { r.state = 'won'; r.t = 60; if (g.boss && g.boss.dead) g.boss = null; }
      } else if (r.state === 'won' && --r.t <= 0) { L.run = null; SW.audio.music(z.music); ladderPay(r.tier); }
    }
    draw() {}
  }
  function ladderPay(n) {
    const q = Q().ladder, first = n > q.best, creds = Math.round(40 * n * (first ? 1 : 0.25));
    G.state.creds += creds; sfx('coin');
    G.toast(`Tier ${n} won: +${creds} creds`, GOLD);
    if (first) {
      q.best = n; if (HT) HT.gain('syndicate', 2);
      if (TITLES[n]) { q.title = TITLES[n]; G.toast(TITLE_MSG[n], GOLD); }
      if (n === 10 && M) { M.ensure(G.state); G.state.mats.core = (G.state.mats.core || 0) + 1; G.toast('The Pit Legend takes home a core.', GOLD); }
    }
    G.saveGame();
  }

  // ================= DRY WELLS =================
  // every spot in the Dunes and the Glowwild is on flat ground at least 3 tiles from any hero's secret spots, prompts and
  // story fights (all 25 heroes checked: the first try put a pump on top of a secret "Kneel" spot)
  const PUMPS = [74, 113, 158];
  const wellsOpen = () => !!done()['A2-2'];
  const W = { fight: null };
  function pumpUse(g, t) {
    const q = Q().wells, S = g.state;
    if (q.state !== 'active') { g.toast('A dead water pump, choked with ash.', '#8a92b8'); return; }
    if (q.fixed[t.pump] || W.fight) return;
    if (!M) return;
    M.ensure(S);
    if ((S.mats.scrap || 0) < 3) { sfx('deny'); g.toast('The pump needs 3 scrap to fix.', '#ff8a8a'); return; }
    S.mats.scrap -= 3; sfx('gate'); fx.dust(t.x, t.y, 10);
    const night = SW.daynight && SW.daynight.isNight(), tx = Math.floor(t.x / T), z = g.zone;
    // the second and third pumps bring a third attacker, a street thug (measured at level 9: raider + bandit cost the test
    // players 0-12%; adding a gunner as the third killed them)
    const nFixed = Object.keys(q.fixed).length, crew = (night ? ['husk', 'raider'] : ['raider', 'bandit']).concat(nFixed >= 1 ? ['thug'] : []);
    const foes = crew.map((type, i) => { const at = openGround(z, tx, i % 2 ? 1 : -1, i >= 2 ? 12 : 9); const e = SW.spawnEnemy(type, at[0] * T + 8, at[1]); z.add(e); e.state = 'chase'; e.home = t.x; fx.dust(e.x, e.y, 8); return e; });
    W.fight = { pump: t.pump, foes, z };
    g.toast(night ? 'The clanging wakes the dead. Hold them off!' : 'Raiders heard that. Hold them off!', '#ff8a8a');
  }
  // a spot 5 to 13 tiles to one side, standing on the pump's own ground level (playtest: one landed on the overpass ledge
  // above the middle pump, out of reach, and the fight never ended): [tile x, feet y]
  function openGround(z, tx, dir, first) {
    for (const d of [first || 9, 7, 11, 13, 5, 15]) for (const s of [dir, -dir]) {
      const x = tx + s * d, ty = 20;
      if (x < 2 || x > z.w - 3) continue;
      if (z.tile(x, ty) === '#' && z.tile(x, ty - 1) === ' ' && z.tile(x, ty - 2) === ' ' && !z.hit(x * T + 2, ty * T - 30, 12, 28)) return [x, ty * T];
    }
    return [tx + dir * 9, 20 * T];
  }
  function wellsTick(g, z) {
    const f = W.fight; if (!f) return;
    if (f.z !== z) { W.fight = null; return; }
    if (!f.foes.every(e => e.dead)) return;
    W.fight = null;
    const q = Q().wells; q.fixed[f.pump] = true; sfx('level');
    const n = Object.keys(q.fixed).length;
    if (n >= PUMPS.length) { q.state = 'ready'; g.toast('All three pumps are running. Tell Wenna.', GREEN); }
    else g.toast(`Pump fixed (${n}/3). Water!`, GREEN);
    g.saveGame();
  }

  // ================= ODILE'S PATIENTS =================
  const HERBS = [9, 39, 83, 103, 108, 160];
  const herbsOpen = () => G.flag('rad_filter');
  const _item = P.useItem; P.useItem = function () {
    const S = this.G.state, n = S.items; _item.apply(this, arguments);
    if (S.items < n && inStory() && S.sq && S.sq.herbs && S.sq.herbs.state === 'done') S.hp = Math.min(this.hpMax(), S.hp + Math.round(this.hpMax() * 0.15));
  };

  // ================= the words =================
  Object.assign(D.dialogue, {
    sq_bun_offer: [
      say('mags', "You! Good, you've got legs. Five orders came in from across the Underground and my runner's down with the cough."),
      say('mags', 'The Slum Kid, the Cartographer, Madame Quill, the Bookie down in the Pit, and Tamsin at the Old Metro clinic. A hundred seconds and the buns are cold.', { choice: [{ t: 'Take the buns', fn: 'sq_bun_start' }, { t: 'Not now' }] })
    ],
    sq_bun_go: [say('mags', "Why are you still HERE? They're getting cold!")],
    sq_bun_cold: [say('mags', "Cold? Ah well. Pigeons have to eat too. I've got another batch steaming - want to try again?", { choice: [{ t: 'Take the buns', fn: 'sq_bun_start' }, { t: 'Not now' }] })],
    sq_bun_done: [
      say('mags', 'All five, all hot? Ha! Every one of them sent a message back saying so.'),
      say('mags', "Here. My mother's recipe, the one I only make for family. Eat it slow.", { give: { creds: 50 } }),
      say('sys', 'SIDE QUEST COMPLETE: BUN RUN. Max HP +20 for good.')
    ],
    sq_ladder: [say('bookie', 'The Ladder: ten tiers, one fight each, no breaks. Win a tier and the next one opens. Fancy a climb?', { choice: [{ t: 'Climb the Ladder', fn: 'sq_ladder_up' }, { t: 'A sparring night', fn: 'pit_start' }, { t: 'Not now' }] })],
    sq_wells_offer: [
      say('wenna', "You're the one who dropped the Baron. Then maybe you can do what he never would: fix the pumps."),
      say('wenna', 'Three of them, along the road west. Each one wants scrap - three pieces - and the clanging will bring company.', { choice: [{ t: 'Fix the pumps', fn: 'sq_wells_start' }, { t: 'Not now' }] })
    ],
    sq_wells_go: [say('wenna', "Three pumps, west along the road. Bring scrap. Expect trouble. We'll be here, thirsty.")],
    sq_wells_done: [
      say('wenna', 'Listen to that. Water, in the dunes, for the first time since the Baron sat on the valves.'),
      say('wenna', "It isn't much, but it's what the camp has. And the caravans will hear who did this.", { give: { creds: 250 } }),
      say('sys', 'SIDE QUEST COMPLETE: DRY WELLS. +250 creds, 2 gel, Caravan standing +10.')
    ],
    sq_wells_after: [say('wenna', 'The kids have started swimming in the trough. Nobody has the heart to stop them.')],
    sq_herb_offer: [
      say('odile', "Half the camp is coughing glow. There's a mushroom out in the Glowwild - glowcap - that draws the light back out of the lungs."),
      say('odile', 'Six caps would do it. They grow in the open, out by the pools and the old pylons. They shine brighter after dark.', { choice: [{ t: 'Gather glowcaps', fn: 'sq_herb_start' }, { t: 'Not now' }] })
    ],
    sq_herb_go: [say('odile', 'Six glowcaps from the Glowwild. Brighter after dark. Mind the radiation while you look.')],
    sq_herb_done: [
      say('odile', 'Six. Oh, these are good ones.'),
      say('odile', "I'll brew them into your healing supplies too. You won't feel the difference until you need it.", { give: { creds: 100 } }),
      say('sys', "SIDE QUEST COMPLETE: ODILE'S PATIENTS. Healing items now heal 15% more of your max HP.")
    ]
  });
  D.speakers.wenna = { name: 'Wenna', sheet: 'wenna', pitch: 480 };
  const _init = art.init; art.init = function () { _init(); try { story.recolor('wenna', 'tamsin', { top: '#a8643a', hair: '#e8dcc0', pants: '#5a4634' }); } catch (e) { console.error(e); } };

  const _hook = G.hook; G.hook = function (fn) {
    if (fn === 'sq_bun_start') return bunStart();
    if (fn === 'sq_ladder_up') { const n = Math.min(10, Q().ladder.best + 1); if (!tierOpen(n)) { sfx('deny'); G.toast('Tier 10 is Anvil. He only fights people who stood in the Grand Melee.', '#ff8a8a'); return; } return ladderStart(n); }
    if (fn === 'sq_wells_start') { Q().wells.state = 'active'; sfx('select'); return; }
    if (fn === 'sq_herb_start') { Q().herbs.state = 'active'; sfx('select'); return; }
    return _hook.apply(this, arguments);
  };

  // ================= givers, recipients, things in the world =================
  function patch(id, fn) { const def = Z[id]; if (!def) return; const b = def.build; def.build = function (z, g) { b.call(this, z, g); try { fn(z, g); } catch (e) { console.error(e); } }; }
  // a mark over a giver: '!' a quest to take, '?' one to hand in
  function mark(npc, fn) {
    const d0 = npc.draw;
    npc.draw = function (ctx, cam, g) {
      d0.call(this, ctx, cam, g);
      const m = inStory() ? fn() : null;
      if (m) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y - 44 + Math.sin(SW.frame * 0.1) * 2); text(ctx, m, x, y, m === '?' ? GREEN : GOLD, { align: 'center', scale: 2 }); }
    };
  }
  function wrapTalk(npc, fn) { const t0 = npc.talk; npc.talk = g => { const r = fn(g); return r === undefined ? (typeof t0 === 'function' ? t0(g) : t0) : r; }; }
  const npcs = (z, sheet) => z.ents.filter(e => e instanceof SW.NPC && e.sheet === sheet);
  // bun recipients, in whatever zone they stand
  const bunHolder = (z) => BUN_TO.forEach(([sheet]) => npcs(z, sheet).forEach(n => {
    wrapTalk(n, () => { const b = Q().bun; if (b.state === 'active' && !b.got[sheet]) { bunDeliver(sheet); return null; } return undefined; });
    mark(n, () => { const b = Q().bun; return b.state === 'active' && !b.got[sheet] ? '!' : null; });
  }));
  patch('slums', z => {
    bunHolder(z);
    npcs(z, 'mags').forEach(n => {
      wrapTalk(n, () => { const b = Q().bun; if (!bunOpen() || b.state === 'done') return undefined; return b.state === 'delivered' ? (b.state = 'done', 'sq_bun_done') : b.state === 'active' ? 'sq_bun_go' : b.state === 'cold' ? 'sq_bun_cold' : 'sq_bun_offer'; });
      mark(n, () => { const b = Q().bun; return !bunOpen() || b.state === 'done' ? null : b.state === 'delivered' ? '?' : b.state === 'active' ? null : '!'; });
    });
  });
  patch('market', z => bunHolder(z));
  patch('metro', z => bunHolder(z));
  patch('pit', z => {
    bunHolder(z);
    npcs(z, 'bookie').forEach(n => {
      wrapTalk(n, g => { const b = Q().bun; if (b.state === 'active' && !b.got.bookie) return undefined; if (!ladderOpen() || (g.state.mission === 'A3-2' && !g.state.steps['A3-2:gauntlet'])) return undefined; return 'sq_ladder'; });
      const w0 = n.when; n.when = g => (!w0 || w0(g)) && !L.run;
      mark(n, () => (ladderOpen() && Q().ladder.best < 10 && tierOpen(Q().ladder.best + 1) && !L.run ? '!' : null));
    });
    // Anvil steps out of the crowd for tier 10
    npcs(z, 'anvil').forEach(n => { const d0 = n.draw; n.draw = function (ctx, cam, g) { if (L.run && L.run.tier === 10) return; d0.call(this, ctx, cam, g); }; });
    z.add(new Ladder());
  });
  patch('scrapton', z => {
    npcs(z, 'odile').forEach(n => {
      wrapTalk(n, () => { const h = Q().herbs; if (!herbsOpen() || h.state === 'done') return undefined; if (h.state === 'none') return 'sq_herb_offer'; if (Object.keys(h.got).length >= HERBS.length) { h.state = 'done'; return 'sq_herb_done'; } return 'sq_herb_go'; });
      mark(n, () => { const h = Q().herbs; return !herbsOpen() || h.state === 'done' ? null : h.state === 'none' ? '!' : Object.keys(h.got).length >= HERBS.length ? '?' : null; });
    });
  });
  patch('dunes', z => {
    W.fight = null;
    const w = z.npc('wenna', 203, 19, { name: 'Wenna', face: -1, when: () => wellsOpen(),
      talk: () => { const q = Q().wells; return q.state === 'none' ? 'sq_wells_offer' : q.state === 'active' ? 'sq_wells_go' : q.state === 'ready' ? (q.state = 'done', wellsPay(), 'sq_wells_done') : 'sq_wells_after'; } });
    const d0 = w.draw; w.draw = function (ctx, cam, g) { if (wellsOpen()) d0.call(this, ctx, cam, g); };
    mark(w, () => { const q = Q().wells; return !wellsOpen() ? null : q.state === 'none' ? '!' : q.state === 'ready' ? '?' : null; });
    PUMPS.forEach((x, i) => z.thing('pump', x, 19, { pump: i, prompt: 'Fix the pump', when: () => Q().wells.state === 'active' && !Q().wells.fixed[i] && !W.fight, use: pumpUse,
      draw(ctx, cam) {
        const fixed = !!Q().wells.fixed[i], px = Math.round(this.x - cam.x), py = Math.round(this.y - cam.y);
        art.prop(ctx, 'pump', px, py);
        if (fixed) { if (SW.frame % 6 === 0) fx.list.push({ k: 'p', x: this.x + 6, y: this.y - 12, vx: SW.rand(0.3, 0.9), vy: -1.2, g: 0.12, life: 26, max: 26, col: '#6fd3e8', s: 2 }); }
        else if (Q().wells.state === 'active') art.glow(ctx, px, py - 14, 12, GOLD, 0.1 + 0.05 * Math.sin(SW.frame * 0.12));
      } }));
  });
  function wellsPay() { const S = G.state; if (M) { M.ensure(S); S.mats.gel = (S.mats.gel || 0) + 2; } if (HT) HT.gain('caravan', 10); }
  patch('glowwild', z => {
    HERBS.forEach((x, i) => z.thing('crate', x, 19, { prompt: 'Pick the glowcap', when: () => Q().herbs.state === 'active' && !Q().herbs.got[i],
      use: g => { const h = Q().herbs; h.got[i] = true; sfx('pickup'); const n = Object.keys(h.got).length; g.toast(n >= HERBS.length ? 'Six glowcaps. Take them to Odile in Scrapton.' : `Glowcap (${n}/6)`, n >= HERBS.length ? GREEN : '#b8ff40'); },
      draw(ctx, cam) {
        if (Q().herbs.got[i]) return;
        const x0 = Math.round(this.x - cam.x), y0 = Math.round(this.y - cam.y), night = SW.daynight && SW.daynight.isNight();
        art.rect(ctx, '#d8e4c0', x0 - 1, y0 - 5, 2, 5); art.rect(ctx, '#b8ff40', x0 - 4, y0 - 8, 8, 3); art.rect(ctx, '#e8ffb0', x0 - 2, y0 - 9, 4, 1);
        art.glow(ctx, x0, y0 - 7, night ? 16 : 9, '#b8ff40', (night ? 0.22 : 0.1) + 0.05 * Math.sin(SW.frame * 0.1 + i));
      } }));
  });

  // ---- every frame: the bun timer, the pump fights ----
  const _up = P.update; P.update = function (g, z) {
    const r = _up.apply(this, arguments);
    if (this !== g.player || !inStory()) return r;
    const b = Q().bun;
    if (b.state === 'active' && --b.t <= 0) { b.state = 'cold'; sfx('deny'); g.toast('The buns have gone cold. Mags will bake another batch.', '#ff8a8a'); }
    wellsTick(g, z);
    return r;
  };
  const _rs = G.respawn; G.respawn = function () { L.run = null; W.fight = null; return _rs.apply(this, arguments); };
  const _gz = G.gotoZone; G.gotoZone = function () { L.run = null; return _gz.apply(this, arguments); };
  const _ng = G.newGame; G.newGame = function () { L.run = null; W.fight = null; return _ng.apply(this, arguments); };
  const _cg = G.continueGame; G.continueGame = function () { L.run = null; W.fight = null; return _cg.apply(this, arguments); };

  // ---- HUD: the bun timer ----
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    if (!inStory()) return;
    const b = Q().bun;
    if (b.state !== 'active') return;
    const s = Math.ceil(b.t / 60), col = s <= 30 && SW.frame % 30 < 15 ? '#ff5a5a' : GOLD;
    ui.panel(ctx, 5, 70, 100, 14, null, 0.5);
    text(ctx, `BUNS ${Object.keys(b.got).length}/5`, 9, 73, '#ffffff');
    text(ctx, Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'), 101, 73, col, { align: 'right' });
  };

  // ================= Esc > QUESTS =================
  const XT = SW.pauseTabs || (SW.pauseTabs = []);
  const QUESTS = [
    { id: 'bun', name: 'Bun Run', giver: 'From Mags, in the Deepline Slums.', open: bunOpen, lock: 'Opens after Act 1.',
      state: () => { const b = Q().bun; return b.state; },
      lines: () => { const b = Q().bun; return b.state === 'done' ? ['Done. Max HP +20.'] : b.state === 'active' ? ['Deliver five hot buns across the Underground.', `Delivered: ${Object.keys(b.got).length} / 5. ${Math.ceil(b.t / 60)} seconds left.`]
        : b.state === 'delivered' ? ['All delivered. Tell Mags.'] : b.state === 'cold' ? ['The buns went cold. Mags will bake another batch.'] : ['Mags needs a runner. Reward: max HP +20 for good.']; } },
    { id: 'ladder', name: 'Arena Ladder', giver: 'From the Bookie, in the Pit Arena.', open: ladderOpen, lock: 'Opens after your first sparring win in the Pit.',
      state: () => (Q().ladder.best >= 10 ? 'done' : Q().ladder.best > 0 ? 'active' : 'none'),
      lines: () => { const q = Q().ladder, n = Math.min(10, q.best + 1), out = [q.best >= 10 ? 'All ten tiers won.' : `Tiers won: ${q.best} / 10.`];
        if (q.title) out.push(q.title);
        if (q.best < 10) { out.push(`Next: tier ${n} (recommended level ${TIERS[n - 1][1]}).`); if (!tierOpen(n)) out.push('Tier 10 opens after the Grand Melee.'); } else out.push('Rematches pay a quarter.');
        out.push('Titles at tiers 3, 6 and 10. Tier 10 pays a core.'); return out; } },
    { id: 'wells', name: 'Dry Wells', giver: 'From Wenna, at the east end of the Ash Dunes.', open: wellsOpen, lock: 'Opens after the Scrap Baron falls.',
      state: () => Q().wells.state,
      lines: () => { const q = Q().wells, n = Object.keys(q.fixed).length; return q.state === 'done' ? ['Done. The camp has water.'] : q.state === 'ready' ? ['All three pumps run. Tell Wenna.'] : q.state === 'active' ? [`Pumps fixed: ${n} / 3. Each needs 3 scrap, and the noise brings company.`] : ["Wenna's camp has no water. Reward: creds, gel, Caravan standing."]; } },
    { id: 'herbs', name: "Odile's Patients", giver: 'From Odile, in Scrapton.', open: herbsOpen, lock: 'Opens once you have the Glowwild filter.',
      state: () => (Q().herbs.state === 'active' && Object.keys(Q().herbs.got).length >= HERBS.length ? 'ready' : Q().herbs.state),
      lines: () => { const h = Q().herbs, n = Object.keys(h.got).length; return h.state === 'done' ? ['Done. Healing items heal 15% more.'] : h.state === 'active' ? (n >= HERBS.length ? ['Six glowcaps. Take them to Odile.'] : [`Glowcaps: ${n} / 6, in the Glowwild. They shine brighter after dark.`]) : ['Odile needs glowcaps. Reward: stronger healing items for good.']; } }
  ];
  const STATE_TXT = { none: ['not started', '#c8ccd8'], active: ['in progress', GOLD], cold: ['in progress', GOLD], delivered: ['hand in', GREEN], ready: ['hand in', GREEN], done: ['complete', GREEN] };
  const TAB = {
    name: 'QUESTS',
    update() {
      const pm = ui.pm, n = QUESTS.length;
      if (I.hit('down')) { pm.sel = (pm.sel + 1) % n; sfx('move'); SW.pauseEat(); }
      else if (I.hit('up')) { pm.sel = (pm.sel + n - 1) % n; sfx('move'); SW.pauseEat(); }
    },
    draw(ctx, g) {
      const pm = ui.pm, x0 = 26; if (pm.sel >= QUESTS.length) pm.sel = 0;
      text(ctx, 'SIDE QUESTS', x0, 34, GOLD, { scale: 2 });
      QUESTS.forEach((q, i) => {
        const y = 56 + i * 34, on = pm.sel === i, open = q.open(), st = open ? STATE_TXT[q.state()] : ['locked', '#5a6078'];
        ui.panel(ctx, x0, y, 192, 30, on ? GOLD : '#3a3d55', on ? 0.8 : 0.5);
        text(ctx, (on ? '> ' : '') + (open ? q.name : '? ? ?'), x0 + 6, y + 5, on ? GOLD : open ? '#ffffff' : '#5a6078');
        text(ctx, st[0], x0 + 6, y + 17, st[1]);
      });
      const q = QUESTS[pm.sel], open = q.open(), dx = 228, dw = 228;
      ui.panel(ctx, dx, 56, dw, 150, GOLD, 0.5);
      text(ctx, open ? q.name : '? ? ?', dx + 8, 62, GOLD);
      let y = 78; const line = (s, col) => SW.wrap(s, dw - 16).forEach(l => { text(ctx, l, dx + 8, y, col); y += 10; });
      if (!open) line(q.lock, '#8a92b8');
      else { line(q.giver, '#8a92b8'); y += 4; q.lines().forEach(s => { line(s, '#ffffff'); y += 2; }); }
      SW.wrap('W / S: quest.  A ! over someone means a quest to take; ? means one to hand in.', 430).forEach((l, i) => text(ctx, l, x0, 214 + i * 10, '#5a6078'));
    }
  };
  XT.push(TAB);

  SW.sidequests = { Q, ensure, L, W, TIERS, PUMPS, HERBS, BUN_TO, BUN_TIME, ladderStart, bunStart };
})();
