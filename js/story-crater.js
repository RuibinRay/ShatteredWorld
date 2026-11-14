'use strict';
// Shattered Worlds — ACT 2 finale: the Crater. Loaded last; like the other story files it only adds and wraps.
//
//   The road is the same for every hero (mission A2-4, zone `crater`, east of the Glowwild). What changes is what
//   each hero says, and WHO is waiting on the Crater floor: the lead hero of the other road (Nyra for Kael's road,
//   Kael for Nyra's). Halcyon's PARALLAX VEIL shows each of them the other as a Halcyon agent, so they fight:
//   SW.versus.duel() runs the fight with the rival drawn in Halcyon white. The veil does not break here - that is
//   Act 3 - but it slips: the white figure flickers to its real face, more often as the fight goes on.
//
//   Win or lose, the story goes on (the flag `crater_duel` holds 'win' or 'lose' for Act 3 to read). Winning pays a
//   bonus. Either way the rift opens, the "agent" goes up it, and the act ends at the rift.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, story = SW.story, Z = SW.zones, V = SW.versus;
  const L = D.dialogue, M = D.missions, E = D.enemies, TH = art.themes, HR = D.heroes;
  const rect = art.rect, line = art.line, disc = art.disc;
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const rival = () => (G.route() === 'kael' ? 'nyra' : 'kael');
  const VIOLET = '#b48cff';

  // ================= look and sound =================
  TH.crater = Object.assign({}, TH.vs_crater || TH.surface, { dim: 0.36 });
  SW.audio.tracks.crater = { bpm: 72, root: 37, prog: [0, -5, 3, -2], arp: [0, 7, 12, 15, 12, 7, 3, 7], bass: 'triangle', drums: 0.3 };

  // props: [width, height, draw], anchored bottom-centre
  const husk = (x, body, hi) => { rect(x, body, 7, 8, 8, 16); rect(x, hi, 7, 8, 2, 16); disc(x, body, 11, 6, 5); disc(x, hi, 9, 5, 2); rect(x, body, 3, 11, 4, 9); rect(x, body, 15, 11, 4, 9); rect(x, body, 7, 24, 3, 6); rect(x, body, 12, 24, 3, 6); };
  const trooper = (x, body, hi) => { rect(x, body, 2, 6, 26, 6); rect(x, hi, 2, 6, 26, 2); disc(x, body, 30, 8, 4); rect(x, '#2b2f3a', 29, 7, 4, 2); rect(x, body, 6, 3, 4, 4); rect(x, '#4a5060', 12, 1, 14, 2); };
  const PROPS = {
    crystal: [26, 34, x => { [[4, 14, 5, 20], [10, 2, 7, 32], [18, 10, 5, 24]].forEach(q => { for (let i = 0; i < q[3]; i++) { const w = Math.max(1, Math.round(q[2] * Math.min(1, (i + 2) / 8))); rect(x, i % 5 ? '#6a4aa8' : '#8a6ac8', q[0] + (q[2] - w) / 2, q[1] + i, w, 1); } rect(x, '#e0d0ff', q[0] + q[2] / 2, q[1] + 3, 1, q[3] - 6); }); }],
    huskice: [22, 30, x => { husk(x, '#9ad8f4', '#ffffff'); line(x, '#ffffff', 2, 22, 20, 18, 1); rect(x, '#d6f4ff', 0, 28, 22, 2); }],
    huskburnt: [22, 30, x => { husk(x, '#2a2420', '#4a3a30'); line(x, '#ffd24a', 11, 29, 6, 20, 1); line(x, '#ffd24a', 6, 20, 9, 12, 1); line(x, '#ffd24a', 11, 29, 16, 18, 1); rect(x, '#1a1512', 0, 28, 22, 2); }],
    trooperice: [34, 12, x => { trooper(x, '#bfe6f8', '#ffffff'); rect(x, '#d6f4ff', 0, 11, 34, 1); }],
    trooperburnt: [34, 12, x => { trooper(x, '#3a3230', '#5a4a40'); rect(x, '#ffd24a', 14, 6, 1, 5); rect(x, '#ffd24a', 20, 7, 1, 4); }],
    emitter: [30, 96, x => { rect(x, '#4a5060', 13, 26, 4, 70); rect(x, '#6a7088', 13, 26, 1, 70); line(x, '#4a5060', 2, 95, 14, 60, 2); line(x, '#4a5060', 28, 95, 16, 60, 2); art.ring(x, '#e6e8ee', 15, 14, 12); art.ring(x, '#d9b45a', 15, 14, 9); disc(x, VIOLET, 15, 14, 6); disc(x, '#ffffff', 15, 14, 2); for (let i = 0; i < 4; i++) rect(x, '#8a92a8', 10, 36 + i * 14, 10, 1); }],
    seawall: [54, 46, x => { for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) { rect(x, (i + j) % 2 ? '#7f9eb8' : '#9ab8d0', 2 + i * 13 - (j % 2) * 4, 6 + j * 8, 12, 7); } rect(x, '#e6f4ff', 0, 2, 54, 5); rect(x, '#ffffff', 4, 0, 10, 3); rect(x, '#ffffff', 30, 0, 14, 3); rect(x, '#3e5c8a', 0, 44, 54, 2); }],
    grassring: [50, 14, x => { const r = SW.rng(5); for (let i = 0; i < 46; i++) { const h = 4 + r() * 9; rect(x, i % 3 ? '#9ac84a' : '#c8e86a', 2 + i, 14 - h, 1, h); } rect(x, '#5a7a2a', 0, 12, 50, 2); }]
  };
  const pcache = {}, _prop = art.prop, _psize = art.propSize;
  art.prop = function (ctx, kind, x, y, col, flip) {
    const d = PROPS[kind];
    if (!d) return _prop(ctx, kind, x, y, col, flip);
    let c = pcache[kind];
    if (!c) { const cv = SW.canvas(d[0], d[1]); d[2](cv[1]); c = pcache[kind] = cv[0]; }
    ctx.drawImage(c, Math.round(x - d[0] / 2), Math.round(y - d[1]));
  };
  art.propSize = kind => (PROPS[kind] ? [PROPS[kind][0], PROPS[kind][1]] : _psize(kind));

  // The veil: the two lead heroes' own sprites, repainted in Halcyon white and gold. Same silhouette on purpose.
  const VEIL = { skin: '#cfd4de', hair: '#8e2430', top: '#f1f3f7', pants: '#b9c0ce', boots: '#5a6478', acc: '#d9b45a', belt: '#d9b45a', chest: '#d9b45a', trail: '#ff5a5a', arm: '#cfd4de', fore: '#f1f3f7', hand: '#f1f3f7' };
  const SHEETS = [['sheet', ''], ['sheetAw', '_aw'], ['sheetArmed', '_b']];
  function bake() {
    ['kael', 'nyra'].forEach(id => SHEETS.forEach(q => { if (HR[id][q[0]]) story.recolor('veil_' + id + q[1], HR[id][q[0]], VEIL); }));
    story.recolor('veilguard', 'guard', { top: '#e6e8ee', pants: '#6a4aa8' });
    story.recolor('veilenf', 'enforcer', { top: '#e6e8ee', pants: '#6a4aa8' });
    story.recolor('glasshusk', 'husk', null, { '#b9a0ff': '#ffffff' });
  }
  const _init = art.init; art.init = function () { _init(); try { bake(); } catch (e) { console.error(e); } };

  // While a veiled duel runs, the rival hero's sheets, name and title are swapped for the agent's; all of it is put
  // back when the duel ends. Nothing here is saved.
  let veil = null;
  const paint = on => { const h = HR[veil.id]; SHEETS.forEach(q => { if (veil.keep[q[0]]) h[q[0]] = on && art.sheets['veil_' + veil.id + q[1]] ? 'veil_' + veil.id + q[1] : veil.keep[q[0]]; }); };
  function raiseVeil(id) { const h = HR[id]; veil = { id, max: 1, keep: { sheet: h.sheet, sheetAw: h.sheetAw, sheetArmed: h.sheetArmed, name: h.name, title: h.title } }; h.name = 'Halcyon Agent'; h.title = 'Retrieval Asset'; paint(true); }
  function dropVeil() { if (!veil) return; paint(false); const h = HR[veil.id]; h.name = veil.keep.name; h.title = veil.keep.title; veil = null; }
  if (V && V.update) {
    const _vu = V.update; V.update = function (g) {
      _vu(g);
      if (!veil) return;
      if (g.scene !== 'vs' || V.mode !== 'duel' || !V.f || !V.f[1]) { if (g.scene === 'vs') { dropVeil(); retune(); } return; }
      const hp = Math.max(0, V.f[1].state.hp); veil.max = Math.max(veil.max, hp);
      const k = hp / veil.max, every = k < 0.35 ? 60 : k < 0.7 ? 130 : 240;
      paint(!(V.phase === 'fight' ? V.t % every < 3 : V.phase === 'ko' && V.winner === 0 ? V.t % 14 < 5 : false));   // the veil slips
    };
  }

  Object.assign(D.speakers, {
    agent: { name: 'Halcyon Agent', sheet: 'veil_nyra_b', pitch: 230 },
    tech: { name: 'Veil Technician', sheet: 'hazmat', pitch: 520 }
  });
  Object.assign(E, {
    veilguard: Object.assign({}, E.guard, { name: 'Veil Trooper', sheet: 'veilguard', hp: 96, dmg: 13, xp: 30, creds: 16 }),
    veilenf: Object.assign({}, E.enforcer, { name: 'Veil Enforcer', sheet: 'veilenf', hp: 132, dmg: 16, xp: 40, creds: 22 }),
    glasshusk: Object.assign({}, E.husk, { name: 'Glass Husk', sheet: 'glasshusk', hp: 70, dmg: 12, xp: 26, creds: 8 })
  });

  // ================= the duel =================
  // Balance. The rival copies the player's level, upgrades, stats and unlocked moves, and on those terms the Versus bot
  // loses to plain button-mashing almost every time. So the rival gets an EDGE of its own, in steps: each step is
  // +18% damage over the player (rivalPower 3) and +50 health. How many steps is set per hero, from measured fights
  // (ST.duelBench in tools/story-test.js), so that a player who only mashes usually loses and one who guards and
  // uses skills usually wins with about half their health. The ten legends, who hit for +50% with +40% health, keep
  // an advantage on purpose: their steps stop at 10 (Bando gets 13: his reach keeps the bot out, and at 10 mashing
  // won 23 fights in 24). DUEL is the default for a hero with no row (LEGEND for a legend).
  // diff is the bot's level (0 Easy, 1 Normal, 2 Hard): Normal is deliberate, the Hard bot guards more and so
  // attacks less, which makes it EASIER to mash down. hpBonus is extra health for both sides.
  const edge = t => ({ rivalPower: Math.round(3 * t), rivalHp: 50 * t });
  const DUEL = Object.assign({ diff: 1, hpBonus: 100 }, edge(4)), LEGEND = edge(9), FOR = {};
  [['kael', 3], ['nyra', 6], ['fenn', 8], ['isolde', 6.5], ['brakk', 4], ['pyra', 4], ['gale', 3.5], ['ashka', 7], ['dyna', 3.5], ['vesper', 5],
    ['orin', 8], ['mira', 10], ['noct', 10], ['bando', 13], ['aldric', 10], ['sen', 10], ['vega', 8], ['tessa', 9], ['jax', 8], ['ferra', 10],
    ['kiri', 5], ['tarn', 3], ['maren', 4], ['yara', 5], ['brann', 6]].forEach(q => { FOR[q[0]] = edge(q[1]); });
  const duelOpts = () => {
    const id = G.state.hero, o = Object.assign({ rival: rival(), title: 'THE CRATER', rivalName: 'HALCYON AGENT', stage: 'vs_crater', canQuit: true }, DUEL, HR[id].legend ? LEGEND : null, FOR[id]);
    const dl = SW.difficulty && SW.difficulty.cur();   // story difficulty (difficulty.js): the rival's bot level and edge
    if (dl && dl.id !== 'medium') { o.diff = dl.duelDiff; o.rivalPower = Math.round(o.rivalPower * dl.duelEdge); o.rivalHp = Math.round(o.rivalHp * dl.duelEdge); }
    return o;
  };
  // Versus has its own balance table (V.tune in versus.js: a damage multiplier per hero, from a bot tournament). The duel
  // is balanced here instead, by the rival's edge, so for its length both fighters deal their normal damage; otherwise
  // the two tables would stack and every change to one would spoil the other. keepTune: true leaves the table on (tests).
  let tuned = null;
  const untune = ids => { if (!V || !V.tune) return; tuned = {}; ids.forEach(id => { tuned[id] = V.tune[id]; V.tune[id] = 1; }); };
  const retune = () => { if (!tuned) return; Object.keys(tuned).forEach(id => { if (tuned[id] === undefined) delete V.tune[id]; else V.tune[id] = tuned[id]; }); tuned = null; };
  // start the fight exactly as the story does; onEnd(result, G) gets 'win' or 'lose'. False if Versus could not start it.
  function begin(onEnd, over) {
    const o = Object.assign(duelOpts(), over);
    raiseVeil(o.rival);
    if (!o.keepTune) untune([G.state.hero, o.rival]);
    let ok = false;
    try { ok = !!(V && V.duel && V.duel(Object.assign({}, o, { onEnd(result, gg) { dropVeil(); retune(); onEnd(result, gg); } }))); }
    catch (e) { console.error(e); }
    if (!ok) { dropVeil(); retune(); return false; }
    const r = V.f[1].state;
    if (o.rivalHp) { r.hpBonus = (r.hpBonus || 0) + o.rivalHp; r.hp += o.rivalHp; }
    if (o.rivalPower) r.stats.power = ((1 + 0.06 * (r.stats.power || 0)) * (1 + 0.06 * o.rivalPower) - 1) / 0.06;   // the same +6% per point over the player, however many points the player has put into Power
    return true;
  }
  function startDuel(g) { if (!begin((result, gg) => afterDuel(gg, result))) afterDuel(g, 'win', true); }   // if Versus cannot start it, the story must still be finishable
  function afterDuel(g, result, unfought) {
    const S = g.state, won = result === 'win';
    g.setFlag('crater_duel', won ? 'win' : 'lose');
    g.say(won ? 'c_win' : 'c_lose', () => {
      if (won && !unfought && !g.flag('crater_prize')) { g.setFlag('crater_prize'); S.creds += 300; S.points++; SW.audio.sfx('level'); g.toast('DUEL WON:  +300 creds   +1 stat point (Esc > Stats)', '#f5c542'); }
      g.step('A2-4:duel');
      fx.flash(VIOLET, 14); fx.shake(6, 30); SW.audio.sfx('shard');
      g.toast('The Crater Rift is open.', VIOLET);
      g.saveGame();
    });
  }
  story.crater = { startDuel, begin, duelOpts, rival, veiled: () => !!veil, DUEL, LEGEND, FOR };

  // the white figure waiting on the Crater floor: gone once the duel is settled
  class Veiled {
    constructor(x, y) { this.x = x; this.y = y; this.t = 0; }
    update(g) { this.t++; if (g.state.steps['A2-4:duel']) this.gone = true; }
    draw(ctx, cam, g) {
      const id = rival(), h = HR[id], tag = h.sheetArmed ? '_b' : '', real = (veil ? veil.keep.sheetArmed || veil.keep.sheet : h.sheetArmed || h.sheet);
      const res = g.state.flags.crater_duel, slip = this.t % 170 < 3 || (res && this.t % 40 < 6), x = this.x - cam.x, y = this.y - cam.y;
      art.glow(ctx, x, y - 18, 20, VIOLET, 0.1 + 0.03 * Math.sin(this.t * 0.08));
      art.draw(ctx, slip || !art.sheets['veil_' + id + tag] ? real : 'veil_' + id + tag, res === 'win' ? 'hurt' : 'idle', Math.floor(this.t / 28) % 2, x, y, true);
    }
  }
  // the rift: opens once the duel is settled; the act ends when the hero walks up to it
  class Rift {
    constructor(x, y) { Object.assign(this, { x, y, w: 30, h: 60, t: 0, prompt: 'Step up to the rift' }); }
    update(g) {
      this.t++; this.on = !!g.state.steps['A2-4:duel'];
      this.prompt = g.state.steps['A2-4:rift'] ? 'Look up into the rift' : 'Step up to the rift';
      if (this.on && this.t % 5 === 0) fx.list.push({ k: 'p', x: this.x + SW.rand(-10, 10), y: this.y - SW.rand(0, 20), vx: 0, vy: -SW.rand(1.4, 3), g: 0, life: 50, max: 50, col: this.t % 10 ? VIOLET : '#ffffff', s: 2 });
    }
    canInteract() { return this.on; }
    interact(g) { if (g.state.steps['A2-4:rift']) g.toast('The Crater Rift: the way up to the Spire. Halcyon has sealed the top.', VIOLET); else g.say('c_rift'); }
    draw(ctx, cam) {
      if (!this.on) return;
      const x = this.x - cam.x, y = this.y - cam.y;
      for (let i = 0; i < 22; i++) { const w = 5 + 4 * Math.sin(this.t * 0.09 + i * 0.8) + (i < 2 ? 4 : 0), yy = y - i * 14; rect(ctx, '#6a4aa8', x - w - 2, yy - 14, (w + 2) * 2, 14); rect(ctx, VIOLET, x - w, yy - 14, w * 2, 14); rect(ctx, '#ffffff', x - w / 3, yy - 14, w * 2 / 3, 14); }
      art.glow(ctx, x, y - 50, 70, VIOLET, 0.16 + 0.05 * Math.sin(this.t * 0.07));
    }
  }

  // ================= the map =================
  Z.crater = {
    name: 'The Crater', theme: 'crater', music: 'crater', w: 184, h: 23,
    build(z, g) {
      const K = g.route() === 'kael', st = g.state.steps;
      D.speakers.agent.sheet = K ? 'veil_nyra_b' : 'veil_kael';
      z.ground(0, 183, 20).fill(183, 0, 1, 20);
      // the rim: glass terraces stepping down to the floor
      z.fill(0, 10, 12, 10).fill(12, 12, 6, 8).fill(18, 14, 6, 6).fill(24, 16, 6, 4).fill(30, 18, 6, 2);
      z.spawn('west', 3, 9).spawn('floor', 132, 19);
      z.exit(0, 0, 1, 10, 'glowwild', 'east');
      z.trigger(5, 0, 4, 10, gg => { gg.step('A2-4:enter'); gg.say('c_enter'); }, { flag: 'crater_in' });
      z.prop('crystal', 9, 9).prop('crystal', 15, 11).prop('crystal', 27, 15).prop('bones', 21, 13);
      // the glass field: pieces of two other worlds, and the first sign that someone crossed it ahead of you
      z.prop(K ? 'grassring' : 'seawall', 40, 19).prop('crystal', 37, 19).prop('crystal', 58, 19);
      z.enemy('glasshusk', 44, 19); z.enemy('stalker', 50, 19); z.enemy('glasshusk', 56, 19);
      z.thing(K ? 'huskice' : 'huskburnt', 47, 19, { prompt: 'Look at the Husks', glow: K ? '#7fd8ff' : '#ffd24a', when: gg => !gg.flag('crater_tracks'), use: gg => gg.say('c_tracks') });
      z.prop(K ? 'huskice' : 'huskburnt', 45, 19).prop(K ? 'huskice' : 'huskburnt', 49, 19);
      z.plat(52, 16, 3); z.shard('crater_a', 53, 13);
      // a sink of rift-light
      z.clear(62, 20, 8, 1).liquid(62, 21, 8, 2).plat(64, 18, 4);
      z.prop(K ? 'seawall' : 'grassring', 74, 19).prop('crystal', 71, 19);
      z.enemy('stalker', 76, 19);
      // Halcyon field post 3: the veil's emitter, its crew, and the barrier across the road
      z.prop('tent', 86, 19, { col: '#e6e8ee' }).prop('tent', 104, 19, { col: '#e6e8ee' }).prop('banner', 82, 19, { col: '#d9b45a' }).prop('banner', 107, 19, { col: '#d9b45a' }).prop('crate', 90, 19).prop('crate', 91, 19);
      z.prop('emitter', 99, 19, { glow: VIOLET, gy: 82, gr: 26, flicker: true });
      z.arena({ id: 'post', x0: 80, x1: 108, gy: 19, gh: 12, intro: 'c_post_in', win: 'c_post_win', enemies: [['veilguard', 93, 19], ['veilenf', 99, 19], ['drone', 96, 14], ['veilguard', 103, 19]] });
      z.thing('console', 96, 19, { prompt: 'Read the field console', glow: VIOLET, when: gg => gg.flag('arena:crater:post') && !gg.flag('veil_read'), use: gg => gg.say('c_post') });
      z.fill(110, 0, 3, 14); z.gate(111, 14, 6, { flag: 'veil_read', col: '#6a4aa8' });
      // the last quiet stretch
      z.save(116, 19, 'glyph'); z.pickup('item', 119, 19);
      z.thing(K ? 'trooperice' : 'trooperburnt', 123, 19, { prompt: 'Look at the troopers', when: gg => !gg.flag('crater_troopers'), use: gg => gg.say('c_troopers') });
      z.prop(K ? 'trooperice' : 'trooperburnt', 126, 19).prop('crystal', 129, 19);
      z.hint(128, 12, 6, 8, 'Someone is standing on the Crater floor ahead. Rest first.');
      // the floor of the Crater
      let busy = false;
      z.trigger(146, 0, 3, 20, gg => { if (busy || gg.state.flags.crater_duel || gg.busy()) return; busy = true; gg.player.vx = 0; gg.say('c_meet', () => startDuel(gg)); }, { once: false });
      if (!st['A2-4:duel']) z.add(new Veiled(154 * 16 + 8, 20 * 16));
      z.add(new Rift(160 * 16 + 8, 20 * 16));
      z.prop('seawall', 137, 19).prop('grassring', 166, 19).prop('crystal', 142, 19).prop('crystal', 171, 19).prop('crystal', 177, 19);
      z.shard('crater_b', 174, 18); z.shard('crater_c', 180, 18, { hidden: true });
    }
  };
  // the way in: the east end of the Glowwild, past where the Glowmother fell
  story.patch('glowwild', z => {
    z.clear(221, 8, 1, 12);
    z.spawn('east', 217, 19);
    z.exit(221, 8, 1, 12, 'crater', 'west', { need: gg => !!gg.state.done['A2-3'], msg: 'Something further east is pulling at you. Touch the Memory Shard first.' });
  });
  story.patch('scrapton', (z, g) => {
    const S = g.state;
    z.ents.forEach(e => { if (e instanceof SW.NPC && e.sheet === 'marlo') { const t0 = e.talk; e.talk = gg => (S.done['A2-4'] ? 'r_marlo5' : S.done['A2-3'] ? 'r_marlo4' : typeof t0 === 'function' ? t0(gg) : t0); } });
  });
  D.world.forEach(w => { if (w.id === 'crater') delete w.soon; });

  // ================= mission, card, old saves =================
  M['A2-4'] = { id: 'A2-4', title: 'Where the Sky Came Down', hero: 'all', xp: 420, creds: 200, next: null, steps: [
    { id: 'enter', t: 'Go east out of the Glowwild, into the Crater' }, { id: 'post', t: 'Find out what Halcyon is doing on the Crater floor' },
    { id: 'duel', t: 'Face whoever is waiting in the middle of the Crater' }, { id: 'rift', t: 'Step up to the Crater Rift' }] };
  if (M['A2-3']) M['A2-3'].next = 'A2-4';
  const _cg = G.continueGame; G.continueGame = function () {
    _cg();
    const S = G.state;
    if (S && G.scene === 'play' && !S.mission && S.done['A2-3'] && !S.done['A2-4']) S.mission = 'A2-4';   // saves from before the Crater existed
  };
  story.cards.act2end = { title: 'ACT 2 COMPLETE', lines: ['The Baron is broken. The relay is dark.', 'The Crater Rift stands open, all the way to the Spire.', '', 'Someone else fell out of that sky with you.', 'Halcyon made sure you would meet as enemies.', 'The veil is still up. You have not truly seen their face.', '',
    'ACT 3 - CONVERGENCE - begins now.', 'The veil mast is still standing at Field Post 3.', '', 'Esc > Mission shows what to do next.'] };
  story.cards.act2.lines[story.cards.act2.lines.length - 1] = 'Next: east, past where she fell. The Crater.';

  // ================= the words =================
  Object.assign(L, {
    r_marlo4: [
      say('marlo', "East of the Glowwild the ground just stops. The Crater. I've sent four scouts out there. Three came back swearing they'd fought Halcyon agents."),
      say('marlo', "Halcyon doesn't walk the Crater floor, friend. Nobody does. Whatever my scouts fought out there - be very sure of what you're looking at.")
    ],
    r_marlo5: [say('marlo', "There's a pillar of light over the Crater you could read by, and you walked back from under it. I'm not asking. I'm pouring.")],
    c_enter: [
      say('sys', 'The Crater. The bombs dug it. Then the torn sky fell into it - and it has not finished landing.'),
      say('sys', 'The ground is fused to violet glass. Pieces of two other worlds stand in it at wrong angles: a harbour wall with the ice still on it, a ring of green grass that will not burn.'),
      say('hero', {
        kael: '(Grass. Real grass, growing out of glass. ...I know that smell. Why do I know that smell?)',
        nyra: '(A sea wall, with the ice still on it, standing in a desert. Oh. Oh, it is all HERE.)',
        fenn: '(Steppe grass, and no wind in it. A place this quiet is a place where something is waiting.)',
        isolde: '(Harbour stone. I could name the quarry. The cold has not left it. Neither have I.)',
        brakk: '(This ground was hurt twice. It is trying to be three places at once. Easy. Easy.)',
        pyra: "(Glass. Miles of it. Somebody out-burned me. I'd like a word with them.)",
        gale: '(The air is going UP. All of it. As if the whole sky were breathing in.)',
        ashka: '(Melted, and set, and melted again. Whoever did this had heat and no patience.)',
        dyna: '(Two detonations. One chemical, ninety years old. One that is not on any chart I ever drew. I need to see the middle.)',
        vesper: '(Glass underfoot. Every step rings. If someone is here, they already know that I am.)',
        orin: '(Three places in one place. The doors here do not lead anywhere. They ARE the anywhere.)',
        mira: '(A whole floor of mirror, and none of the reflections are mine. Do not look down.)',
        noct: '(Even the dark here is lit from inside. There is nowhere to put a secret.)',
        bando: "(A whole lot of nothing between me and the middle. Good. Nothing's ever been out of reach.)",
        aldric: '(A battlefield with no dead on it. Those are the worst kind. The fight has not happened yet.)',
        sen: '(One stroke did this. From above. I would like to meet the hand.)',
        vega: '(Everything here is falling, very slowly, toward the middle. I can feel the slope of it.)',
        tessa: '(My watch has stopped. No - it is running. All three hands, at three different speeds.)',
        jax: "(A hole this size, and somebody's still raising. Alright. I'll see it.)",
        ferra: "(Not a scrap of honest iron for a mile. Just glass. I don't like a place that won't answer me.)" })
    ],
    c_tracks: [
      say('sys', { K: 'Three Husks, frozen solid where they stood. Each has been cut through by a single low stroke, drawn along the ground. The ice has not begun to melt.',
        N: 'Three Husks, burnt hollow. The glass around them is scored in branching lines, like roots. Like lightning that came UP out of the floor.' }),
      say('hero', { kael: "(One cut each. Whoever is ahead of me is good - and carries winter around with them. Halcyon's got a new toy.)",
        nyra: '(Someone crossed ahead of me, and the storm came when they called. No weapon in the test hall ever did this.)',
        K: '(Someone came through ahead of me, carrying winter. One stroke each. That was no patrol. That was one person.)',
        N: '(Someone came through ahead of me, carrying a storm. That was no patrol. That was one person.)' }, { flag: 'crater_tracks' })
    ],
    c_post_in: [
      say('tech', "Contact! West side - it's one of the SUBJECTS! It's off its line. It was not supposed to come THROUGH us -"),
      say('tech', "It can see us! The veil doesn't cover US, you idiots. Put it down before it reaches the emitter!")
    ],
    c_post_win: [say('sys', 'The post goes quiet. One console is still lit, under a mast that hums like a held note.')],
    c_post: [
      say('sys', 'HALCYON FIELD POST 3. PROJECT: PARALLAX VEIL. STATUS: ACTIVE - carrier fed from the Spire.'),
      say('sys', "Most of the screen is dead glass. What is left reads:\n'...two rift-signatures converging on the Crater floor. Do NOT intercept. Let the subjects solve each oth-'"),
      say('hero', {
        kael: "(Two signatures. Mine - and one more. Somebody else is down here, and Halcyon WANTS us to meet. That's never good news.)",
        nyra: '(Two signatures. I am one. Then there is another on the floor of this place - and they have arranged our meeting.)',
        fenn: '(Two tracks, driven toward one clearing. I know a drive when I am in one. Who are the beaters - and who is the other quarry?)',
        isolde: "(Two of us, flown at each other like hawks at a lure. I do not strike for a stranger's whistle.)",
        brakk: '(Someone else is down there. They want us to break each other. ...I will go and see. Carefully.)',
        pyra: "('Subjects.' Plural. There's another one down there - and the lab coats are selling tickets.)",
        gale: "(Two of us, blown into the same corner on purpose. I don't like being steered. I like it less when it WORKS.)",
        ashka: '(Two fires, banked toward each other. Someone wants a blaze. I will decide what burns.)',
        dyna: "(Two signatures, one floor, 'do not intercept'. That's not a patrol plan. That's a test rig. And I'm one of the charges.)",
        vesper: '(Two targets. One list. I have read orders like this. I have never been ON one before.)',
        orin: '(Two of us, and every door between closed except one. Someone built this room on purpose.)',
        mira: '(Two signatures. I am used to there being two of me. This other one is not mine.)',
        noct: '(Another one, walking toward the same light I am. They want to watch which of us it goes out for.)',
        bando: "(Somebody else down there, and the suits want a fight out of it. Bad luck for them. I only fight for my OWN reasons.)",
        aldric: '(A duel arranged by people who will not attend it. There is no honour in this. There may still be need.)',
        sen: '(Two blades, set on one line. The hand that drew the line is not here. Cowardly brushwork.)',
        vega: '(Two bodies, one well, falling toward each other. They did not push us. They only tilted the floor.)',
        tessa: '(Two signatures converging. And the log is stamped four minutes from NOW. They are very sure how this goes.)',
        jax: "(Two players, one table, and the house not even in the room. That's a rigged game. Good thing I cheat.)",
        ferra: "(Two of us, pulled to the same spot. I know what it looks like when somebody else is holding the magnet.)" }),
      say('sys', "You find the breaker for the barrier and pull it. The field across the road drops. The mast keeps humming: whatever a 'veil' is, it is not switched off from here.", { flag: 'veil_read', step: 'A2-4:post' })
    ],
    c_troopers: [
      say('sys', { K: 'Two Halcyon troopers, frozen to the glass in mid-stride. Their rifles are sheared in half.', N: 'Two Halcyon troopers, armour scorched black, rifles fused shut in their hands.' }),
      say('hero', { K: "(Halcyon's own. So whoever is ahead of me is not on their side either. ...Or does not care who is in the way.)",
        N: "(Halcyon's own soldiers. Then whoever walks ahead of me is no friend of theirs. ...Or spares no one at all.)" }, { flag: 'crater_troopers' })
    ],
    c_meet: [
      say('sys', 'The floor of the Crater. The middle of the wound. Someone is standing in it, waiting - in Halcyon white.'),
      say('hero', { K: "(So that's the second signature. Not another one like me. Their hunter.)", N: '(So that is the second signature. Not one of us. The one they sent to collect.)' }),
      say('agent', { K: 'SUBJECT LOCATED. STAND DOWN FOR RETRIEV- ...I am not going back in the glass. Not for you. Not for anyone.',
        N: "SUBJECT LOCATED. STAND DOWN FOR RETRIEV- ...I'm done running from you people. You want me? Come and get me." }),
      say('sys', 'The voice slips. For half a breath it is not a helmet reading a script. It is someone young, and worn out, and furious.'),
      say('hero', {
        kael: "Heard that speech in Deepline. From bigger people. I'm still here.",
        nyra: 'I have been "retrieved" once. You will find it harder the second time.',
        fenn: 'You hunt alone. On another day I would pity that.',
        isolde: 'I do not wish to harm you. I will not be taken. Decide which of those matters more to you.',
        brakk: 'I do not want this. Step aside, and nobody is hurt.',
        pyra: "You brought a helmet. Smart. You're going to want the rest of the fire suit.",
        gale: "Catch me, then. Everybody says it like it's easy.",
        ashka: 'You are standing on glass. Think about what made it.',
        dyna: "ONE of you? They rate me at one? I'm insulted. Let me show you the maths.",
        vesper: 'You announced yourself. That was courteous. It will not be returned.',
        orin: 'You are standing in front of the only door. I would rather not go through you.',
        mira: 'Look at you. All in white, and nothing in the glass behind you. What ARE you?',
        noct: '...',
        bando: "You're out of your own reach, friend. And a long way inside mine.",
        aldric: 'Name yourself. ...No. Of course not. Then I will fight a uniform, and regret it.',
        sen: 'Your stance is honest. Your masters are not. Draw.',
        vega: 'You are heavier than you look. Something is weighing on you. It is about to be me.',
        tessa: "I have seen how this ends. I have seen it three ways. Let's find out which.",
        jax: "You're bluffing, white-hat. I can hear it. Call.",
        ferra: "No metal on you anywhere. Just that white. ...Fine. We do this the hard way." }),
      say('sys', 'Whatever you said, it does not land the way you said it. The agent flinches, as if it had been given an order - and sets its feet.'),
      say('agent', { K: 'HOSTILE CONFIRMED. ...Then I will sing you off this rock.', N: 'HOSTILE CONFIRMED. ...Fine. Loud it is.' }),
      say('sys', 'RIVAL DUEL. One fall decides it. You fight with everything you have learned - and so do they.\nEsc pauses: the move list, or give up the duel. The story goes on either way.')
    ],
    c_win: [
      say('sys', 'The agent goes down on one knee. The white armour shivers like heat over a road - and for one heartbeat there is no armour at all.'),
      say('sys', { K: 'Dark hair, stiff with frost. A lab gown under a stolen coat. A blade of clear ice, in a hand that will not stop shaking.',
        N: "White hair, full of static. Split knuckles, badly wrapped. A scavenger's coat, three sizes too big." }),
      say('hero', {
        kael: "(...That's no soldier. That's a kid. A kid as scared as I am.)",
        nyra: '(...That is not a soldier. That is a boy. He is as frightened as I am.)',
        fenn: '(That is no hound of theirs. That is a stray. I know one when I see one.)',
        isolde: '(A child. They flew me at a child, and dressed him as a wolf.)',
        brakk: '(Small. Hurt. Not a soldier. ...What did I just do?)',
        pyra: "(Wait. Wait. That's not staff. That's somebody they did it TO.)",
        gale: "(She's... just somebody. Somebody who fell, same as me.)",
        ashka: '(Not their creature. Their fuel. Like me.)',
        dyna: '(None of that is issue kit. Not one piece. I have made a targeting error.)',
        vesper: '(Bare hands. No insignia. I have been pointed at the wrong throat.)',
        orin: '(A door stood open for one heartbeat, and someone was standing in it. Not who I was told.)',
        mira: '(There. In the glass. For one moment the reflection was a boy, and the armour was the lie.)',
        noct: '(I know what it looks like when something is wearing a shadow that is not its own.)',
        bando: "(Hold on. That's a girl in a hospital shirt. Who am I FIGHTING?)",
        aldric: '(No crest. No colours. I have struck someone who never swore to anything.)',
        sen: '(The cut was true. The target was false. That is on my hand, not hers.)',
        vega: '(So light. There is hardly anything to him. All that weight was painted on.)',
        tessa: '(Stop. Go back. One second ago - that was a face. That was a real face.)',
        jax: "(That ain't a house dealer. That's another mark, same as me. We've both been played.)",
        ferra: "(Rags, and a coat of frost. No armour. Nothing for me to take hold of. There never was.)" }),
      say('sys', 'Then the veil closes over the face again, seamless, and it is only an agent, getting to its feet.'),
      say('sys', 'The Crater floor splits with light. A rift, opening straight up - through the cloud, toward the Spire. The agent looks at it. Looks at you. And runs for the light.'),
      say('hero', '(Gone. Straight up. ...I saw a face. I am SURE I saw a face.)')
    ],
    c_lose: [
      say('sys', 'You are down on the glass, and your arms will not lift you. The agent stands over you. Its weapon comes up.'),
      say('sys', 'It stays up. For one heartbeat the white armour shivers like heat over a road - and whoever is under it is breathing as hard as you are.'),
      say('hero', {
        kael: "(Halcyon doesn't hesitate. I've SEEN them not hesitate. ...Why is it hesitating?)",
        nyra: '(The orderlies never paused. Not once. ...Why does this one pause?)',
        fenn: '(A hunter that will not finish the kill is not hunting. It was driven here. Like me.)',
        isolde: '(Its hand is shaking. Their machines do not shake.)',
        brakk: '(It could end this. It does not want to. ...Neither did I.)',
        pyra: "(Go on, then. ...It's not going to. Lab staff ALWAYS finish the procedure.)",
        gale: "(It's looking at me like it has just seen something. What did it see?)",
        ashka: '(It will not strike a banked fire. Then it is not one of theirs. Theirs would.)',
        dyna: '(Clean shot. Zero range. Not taking it. That is NOT in the Halcyon manual.)',
        vesper: '(I would not have waited. Whoever that is, they are kinder than I am. Or less sure.)',
        orin: '(The door is open and it will not walk through. I know that look. It is afraid of the next room.)',
        mira: '(In the glass under me, the thing standing over me has no armour on at all.)',
        noct: '(It had the light in its hand, and did not put it out. I will remember that.)',
        bando: "(Beat me fair. And now it's just standing there, looking sorry. Suits don't look sorry.)",
        aldric: '(It holds the stroke. That is mercy. Halcyon has never once shown me mercy.)',
        sen: '(It will not cut a fallen opponent. Whoever trained that hand was no soldier.)',
        vega: '(The weight has gone out of it, all at once. As if it had set something down.)',
        tessa: '(This is the one ending I never saw. It does not strike. Why did I never see that?)',
        jax: "(Winning hand, and it won't lay it down. Nobody the house hired plays like that.)",
        ferra: "(It won. It's got me. And it's the one that's shaking.)" }),
      say('sys', 'The Crater floor splits with light. A rift, opening straight up toward the Spire. The agent lowers its weapon, looks at you a moment longer - and runs for the light.'),
      say('hero', '(Up. It went UP. ...Get up. Whoever that was - get UP.)')
    ],
    c_rift: [
      say('sys', 'THE CRATER RIFT. A tear of light from the glass at your feet to the underside of Aurelia - and through it, to the Halcyon Spire.'),
      say('hero', { K: "(Everything that goes UP pays somebody. Not this time. This one I'm taking for free.)", N: '(I fell out of that city. I am going back in by the front door.)' }),
      say('sys', 'Whoever was under that white armour went up ahead of you. You mean to find out who.', { step: 'A2-4:rift', fn: 'card:act2end' })
    ]
  });
})();
