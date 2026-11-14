'use strict';
// Shattered Worlds — Heat and factions. Only wraps; nothing in the shared files is edited.
//   Design document: "Heat (Aurelia): fighting in public raises Heat 1-5 stars. At 3 or more, elite patrols hunt you.
//   Hide in vents or leave the zone to cool down." and the faction table (Deepline Syndicates, Scrapton Free Caravans,
//   Halcyon Ascendancy; prices shift with standing by up to 20%).
//
//   HEAT  Runs from the start of the assault on Aurelia (Rally the Deep done) until the ending, in the Skyport, the Noble
//         Ring and the Spire. A foe killed there: +8 (+4 for one inside a story fight, +3 for a patrol). Every 20 is a star.
//         It cools by itself after 8 calm seconds (no hits, no kills, no patrol close by), drops two stars when you change
//         area, and a maintenance vent hides you for 2.5 s and takes two stars off (not with a foe watching).
//         3 stars: elite patrols come in from the edge of the screen. 5 stars: one Halcyon Hunter (a mini-boss with a core).
//         Patrols never come during a story fight, a boss or the lift ride. Once those areas are won, a few Halcyon
//         stragglers walk them, so Heat (and the chips the elites drop) can still be had before the ending.
//   FACTIONS  Standing 0-100 with the Syndicates (Deepline) and the Caravans (the Surface): part from the story, the rest
//         from jobs taken at the Neon Market job board and at the caravan job board in Scrapton (kill N of a kind of foe),
//         and from Pit Arena sparring wins. Perks, in Esc > FACTIONS (the eighth tab):
//           Syndicates: Neon Market prices -1% per 5 standing; 40 safe houses (rest in Aurelia clears Heat);
//                       70 smugglers (changing area clears all Heat); 100 their jobs also pay a core.
//           Caravans:   crafting scrap -1% per 5 standing; 40 jobs pay 50% more creds; 70 +1 scrap from every foe;
//                       100 their jobs also pay a core.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, E = D.enemies, Z = SW.zones, ui = SW.ui, I = SW.input, art = SW.art, fx = SW.fx, text = SW.text, P = SW.Player.prototype, T = 16;
  const story = SW.story, sfx = n => SW.audio.sfx(n), inStory = () => G.scene === 'play' && !!G.state;
  const GOLD = '#d9b45a', RED = '#ff5a5a', EMBER = '#ff7a3a';
  const TRADERS = ['syndicate', 'caravan', 'ledger'];   // the factions you can stand well with (Halcyon never)
  // the Ember Ledger (ledger.js): unknown until its page is found after A2-2, hostile until its test is passed
  const ledgerSeen = S => !!(S.flags && S.flags.ledger_clue), ledgerOpen = S => !!(S.flags && S.flags.ledger_open);

  // ---- save data (old saves get it on first use) ----
  const ensure = S => {
    if (!S) return S;
    if (typeof S.heat !== 'number') S.heat = 0;
    if (!S.rep) S.rep = {};
    if (!S.jobs) S.jobs = {};
    if (!S.jobsDone) S.jobsDone = {};
    TRADERS.forEach(f => { if (typeof S.rep[f] !== 'number') S.rep[f] = 0; if (S.jobs[f] === undefined) S.jobs[f] = null; if (typeof S.jobsDone[f] !== 'number') S.jobsDone[f] = 0; });
    return S;
  };

  // ================= factions =================
  const TIERS = [[0, 'Stranger'], [15, 'Known'], [40, 'Friend'], [70, 'Trusted'], [100, 'Honoured']];
  const tierOf = r => TIERS.filter(t => r >= t[0]).pop()[1];
  const done = S => S.done || {};
  // standing the story gives (they remember what you did for them), on top of what jobs earn
  const STORY_REP = {
    caravan: S => (done(S)['A2-2'] ? 10 : 0) + (done(S)['A2-3'] ? 10 : 0) + (done(S)['A3-1'] ? 10 : 0) + (done(S)['A3-3'] ? 10 : 0),
    syndicate: S => (S.flags && S.flags.pit_won ? 10 : 0) + (done(S)['A3-2'] ? 30 : 0),
    ledger: S => (ledgerOpen(S) ? 15 : 0)
  };
  const rep = id => { const S = ensure(G.state); return S && STORY_REP[id] ? Math.min(100, STORY_REP[id](S) + (S.rep[id] || 0)) : 0; };
  const gain = (id, n) => {
    const S = ensure(G.state), before = tierOf(rep(id));
    S.rep[id] = Math.max(0, (S.rep[id] || 0) + n);
    const after = tierOf(rep(id)), f = FBY[id];
    if (after !== before) { G.toast(f.name + ': you are now ' + after.toUpperCase(), f.col); sfx('level'); }
  };
  const FACTIONS = [
    { id: 'syndicate', name: 'Deepline Syndicates', short: 'Syndicate', col: '#ff3ea5', home: 'Deepline', post: 'the job board in the Neon Market',
      perks: r => [[0, 'Neon Market prices -' + Math.floor(r / 5) + '% (up to -20%)'], [40, 'Safe houses: resting at a save point in Aurelia clears your Heat'],
        [70, 'Smugglers: changing area clears all your Heat'], [100, 'Syndicate jobs also pay a core']] },
    { id: 'caravan', name: 'Scrapton Free Caravans', short: 'Caravan', col: '#c8642a', home: 'The Surface', post: 'the caravan job board in Scrapton',
      perks: r => [[0, 'Crafting costs ' + Math.floor(r / 5) + '% less scrap (up to -20%)'], [40, 'Caravan jobs pay 50% more creds'],
        [70, 'Salvage rights: +1 scrap from every foe'], [100, 'Caravan jobs also pay a core']] },
    { id: 'ledger', name: 'The Ember Ledger', short: 'Ledger', col: EMBER, home: 'Ash Dunes', post: "Sable, at the Baron's old wreck in the Ash Dunes, after dark",
      perks: r => [[0, 'Black-market prices -' + Math.floor(r / 5) + '% (up to -20%)'], [15, 'Ghost Tag for sale'], [40, 'Night Eyes and Lead Lining for sale'],
        [70, 'Ember Heart for sale'], [100, 'Ledger jobs also pay a core']] },
    { id: 'halcyon', name: 'Halcyon Ascendancy', short: 'Halcyon', col: GOLD, home: 'Aurelia' }
  ];
  const FBY = {}; FACTIONS.forEach(f => { FBY[f.id] = f; });

  // ---- jobs: [id, faction, name, foe types, how many, where, unlocked when, part paid] ----
  const vis = id => S => !!(S.visited && S.visited[id]);
  const JOBS = [
    ['crawlers', 'caravan', 'Crawler Cull', ['crawler'], 4, 'Rust Flats, the Hollow', () => true, 'gel'],
    ['bandits', 'caravan', 'Bandit Sweep', ['bandit'], 5, 'Rust Flats, the Ash Dunes', () => true, 'chip'],
    ['raiders', 'caravan', 'Raider Remnants', ['raider', 'gunner'], 4, 'the Ash Dunes', vis('dunes'), 'chip'],
    ['glow', 'caravan', 'Glow Hunt', ['stalker'], 4, 'the Glowwild, the Crater', vis('glowwild'), 'gel'],
    ['husks', 'caravan', 'Lay the Husks to Rest', ['husk', 'glasshusk'], 4, 'the Glowwild, the Drowned Choir', vis('glowwild'), 'gel'],
    ['rats', 'syndicate', 'Rat Catcher', ['rat'], 6, 'the Old Metro', () => true, 'gel'],
    ['ferals', 'syndicate', 'Feral Pack', ['feral'], 5, 'the Old Metro', () => true, 'gel'],
    ['rivals', 'syndicate', 'Sump Rivals', ['ganger', 'thug'], 4, 'the gang camp in the Old Metro', () => true, 'chip'],
    ['pit', 'syndicate', 'Pit Night', ['$pit'], 1, 'the Pit Arena (win a sparring night)', S => !!(S.flags && S.flags.pit_won), 'chip'],
    ['halcyon', 'syndicate', 'Halcyon Bounty', ['veilguard', 'veilenf', 'guard', 'enforcer', 'elitegd', 'eliteenf', 'hunter'], 5, 'the Skyport, the Noble Ring, the Spire', S => !!done(S)['A3-2'], 'chip'],
    ['cutthroat', 'ledger', 'Cut-Throat Competition', ['raider', 'gunner', 'bandit'], 5, 'the Ash Dunes, Rust Flats', ledgerOpen, 'chip'],
    ['nightwork', 'ledger', 'Night Work', ['husk', 'glasshusk'], 5, 'the wastes, at night (Husks)', ledgerOpen, 'gel'],
    ['glassrun', 'ledger', 'Glass Harvest', ['glasshusk', 'stalker'], 5, 'the Crater', S => ledgerOpen(S) && vis('crater')(S), 'gel'],
    ['salvage', 'ledger', 'Halcyon Salvage', ['elitegd', 'eliteenf', 'elitedrone', 'hunter'], 3, 'Aurelia (elite patrols come at 3 Heat stars)', S => ledgerOpen(S) && !!done(S)['A3-2'], 'chip']
  ].map(j => ({ id: j[0], fac: j[1], name: j[2], types: j[3], n: j[4], where: j[5], open: j[6], part: j[7] }));
  const JBY = {}; JOBS.forEach(j => { JBY[j.id] = j; });
  const offer = fid => { const S = ensure(G.state), list = JOBS.filter(j => j.fac === fid && j.open(S)); return list.length ? list[(S.jobsDone[fid] || 0) % list.length] : null; };
  function jobCount(type) {
    const S = ensure(G.state);
    TRADERS.forEach(fid => {
      const a = S.jobs[fid], j = a && JBY[a.id];
      if (!j || a.n >= j.n || j.types.indexOf(type) < 0) return;
      a.n++;
      const f = FBY[fid];
      if (a.n >= j.n) { G.toast(f.short + ' job done: ' + j.name + '. Collect at ' + f.post + '.', f.col); sfx('level'); }
      else G.toast(f.short + ' job: ' + j.name + ' ' + a.n + '/' + j.n, f.col);
    });
  }
  function payJob(fid) {
    const S = ensure(G.state), a = S.jobs[fid], j = JBY[a.id], r = rep(fid), f = FBY[fid], M = SW.mods;
    const creds = Math.round(60 * (fid === 'caravan' && r >= 40 ? 1.5 : 1)), pay = { scrap: 6 }; pay[j.part] = 2; if (r >= 100) pay.core = 1;
    S.creds += creds;
    if (M) { M.ensure(S); Object.keys(pay).forEach(k => { S.mats[k] = (S.mats[k] || 0) + pay[k]; }); }
    S.jobs[fid] = null; S.jobsDone[fid] = (S.jobsDone[fid] || 0) + 1;
    gain(fid, 12);
    sfx('coin');
    return 'Paid: ' + creds + ' creds, ' + Object.keys(pay).map(k => pay[k] + ' ' + (M ? M.MATS[k].name.toLowerCase() : k)).join(', ') + '. ' + f.short + ' standing +12.';
  }
  // the job boards: a new one next to the bounty board in Scrapton, and the old notice board in the Neon Market
  const POSTS = { caravan: 'Caravan jobs', syndicate: 'Syndicate jobs' };
  const atPost = () => { const p = G.player, z = G.zone; if (!p || !z) return null; const e = z.ents.find(x => x.jobPost && (!x.present || x.present()) && Math.abs(x.x - p.x) < 40 && Math.abs(x.y - p.y) < 48); return e ? e.jobPost : null; };
  function openBoard(fid) {
    G.overlay = 'pause'; ui.pm.tab = FT(); ui.pm.sel = FACTIONS.findIndex(f => f.id === fid); msg.t = 0; sfx('select');
    if (!G.flag('jobs_seen')) { G.setFlag('jobs_seen'); say('Jobs pay creds, salvage and standing. J: take one.', '#7dffa0'); }
  }
  function patch(id, fn) { const def = Z[id]; if (!def) return; const b = def.build; def.build = function (z, g) { b.call(this, z, g); try { fn(z, g); } catch (e) { console.error(e); } }; }
  patch('scrapton', z => { z.thing('board', 120, 19, { prompt: POSTS.caravan, jobPost: 'caravan', use: () => openBoard('caravan') }); });
  patch('market', z => { z.thing('board', 30, 13, { prompt: POSTS.syndicate, jobPost: 'syndicate', use: () => openBoard('syndicate'), draw() {} }); });   // the board is already drawn there

  // ---- Neon Market prices: Madame Quill's 30-cred item, -1% per 5 Syndicate standing ----
  const BASE_PRICE = 30;
  const price = () => Math.round(BASE_PRICE * (1 - Math.floor(rep('syndicate') / 5) / 100));
  const _su = ui.shopUpdate; ui.shopUpdate = function (g) {
    const S = g.state, d = BASE_PRICE - price();
    if (!d || !(I.ok() && ui.shop.sel === 0)) return _su(g);
    // the base shop charges 30: lend it the discount for this one press, take back what was not spent
    S.creds += d; const items = S.items;
    _su(g);
    if (S.items === items) S.creds -= d;
  };
  const _ds = ui.drawShop; ui.drawShop = function (ctx, g) {
    _ds(ctx, g);
    const p = price(); if (p === BASE_PRICE) return;
    art.rect(ctx, '#0e0f1c', 142, 125, 200, 9);
    text(ctx, (ui.shop.sel === 0 ? '> ' : '  ') + g.hero().item + '   ' + p + ' creds', 142, 126, ui.shop.sel === 0 ? '#f5c542' : '#ffffff');
    text(ctx, '-' + (BASE_PRICE - p) + ' Syndicate', 340, 126, '#ff3ea5', { align: 'right' });
  };
  // ---- crafting: Caravan standing takes scrap off every recipe ----
  if (SW.mods) SW.mods.costHook = m => { const c = Object.assign({}, m.cost), off = Math.floor(rep('caravan') / 5) / 100; if (c.scrap && off > 0) c.scrap = Math.max(1, Math.round(c.scrap * (1 - off))); return c; };

  // ================= Heat =================
  const HEAT_ZONES = { skyport: 1, noble: 1, spire: 1 };
  const heatOn = () => { if (!inStory()) return false; const d = done(G.state); return !!(d['A3-2'] && !d['A3-6']); };
  const heatHere = () => heatOn() && !!G.zone && !!HEAT_ZONES[G.zone.id];
  const stars = () => Math.min(5, Math.floor(((G.state && G.state.heat) || 0) / 20));
  const H = { zone: null, calm: 0, spawnT: 0, hunted: false, hunter: null, warned: 0 };
  // a new or continued story is not an area change (playtest: quitting to the title and continuing took two stars off)
  const fresh = () => { Object.assign(H, { zone: null, calm: 0, spawnT: 0, hunted: false, hunter: null }); };
  const _ng = G.newGame; G.newGame = function () { fresh(); return _ng.apply(this, arguments); };
  const _cg = G.continueGame; G.continueGame = function () { fresh(); return _cg.apply(this, arguments); };
  SW.heat = { H, ensure, rep, gain, stars, heatOn, heatHere, JOBS, FACTIONS, offer, price, openBoard: id => openBoard(id), tierOf };

  // Halcyon's elites, black and gold, and the Hunter, gold and black
  if (E.veilguard && E.veilenf) {
    E.elitegd = Object.assign({}, E.veilguard, { name: 'Halcyon Elite', sheet: 'elitegd', hp: 140, dmg: 15, xp: 40, creds: 24, aggro: 420, speed: 1.05, commit: true, blockEvery: 4 });
    E.eliteenf = Object.assign({}, E.veilenf, { name: 'Elite Enforcer', sheet: 'eliteenf', hp: 160, dmg: 17, xp: 50, creds: 30, aggro: 420 });
    E.elitedrone = Object.assign({}, E.drone, { name: 'Hunter Drone', hp: 40, dmg: 7, xp: 20, creds: 8, aggro: 420 });
    E.hunter = Object.assign({}, E.veilguard, { name: 'HALCYON HUNTER', sub: 'Sent for whoever made all that noise', sheet: 'hunter', hp: 560, dmg: 20, xp: 160, creds: 90, aggro: 640,
      speed: 1.25, windup: 20, commit: true, heavy: true, w: 14, h: 32 });
  }
  const _init = art.init; art.init = function () {
    _init();
    try {
      story.recolor('elitegd', 'guard', { top: '#2a2c3a', pants: GOLD });
      story.recolor('eliteenf', 'enforcer', { top: '#2a2c3a', pants: GOLD });
      story.recolor('hunter', 'guard', { top: GOLD, pants: '#1c1e2c', hair: '#e8ecf4' });
    } catch (e) { console.error(e); }
  };

  function raise(n) {
    const S = ensure(G.state), before = stars();
    if (SW.mods && SW.mods.has('ghost_tag')) n *= 0.6;   // black-market gear (ledger.js)
    S.heat = Math.min(100, S.heat + n); H.calm = 0;
    const after = stars();
    if (after <= before) return;
    sfx('deny');
    const say = after >= 5 ? 'HEAT 5: Halcyon is sending a Hunter.' : after >= 3 ? 'HEAT ' + after + ': elite patrols are hunting you. Hide in a vent or change area.' : 'HEAT ' + after + ': Halcyon has noticed you.';
    G.toast(say, after >= 3 ? RED : GOLD);
    if (!G.flag('heat_seen')) { G.setFlag('heat_seen'); G.toast('Fighting in Aurelia raises Heat. Stop fighting for a while and it cools.', '#8a92b8'); }
  }
  const arenaLive = z => z.ents.some(e => e instanceof SW.Arena && (e.state === 1 || e.state === 2));
  // somewhere on the ground just off the edge of the screen, at the height nearest the player
  function edgeSpot(z, side) {
    const p = G.player, x = side < 0 ? G.cam.x - 30 : G.cam.x + SW.W + 30;
    if (x < 3 * T || x > z.pw - 3 * T) return null;
    const tx = Math.floor(x / T); let best = null;
    for (let ty = 2; ty < z.h; ty++) {
      const c = z.tile(tx, ty);
      if ((c === '#' || c === '=') && z.tile(tx, ty - 1) === ' ' && z.tile(tx, ty - 2) === ' ') { const y = ty * T; if (best === null || Math.abs(y - p.y) < Math.abs(best - p.y)) best = y; }
    }
    if (best === null || z.hit(x - 6, best - 30, 12, 28)) return null;
    return { x, y: best };
  }
  function spawnAt(z, type, at, dx) {
    const fly = E[type].fly, e = SW.spawnEnemy(type, at.x + dx, fly ? at.y - 64 : at.y);
    e.patrol = true; e.state = 'chase'; e.home = e.x; e.face = G.player.x < e.x ? -1 : 1;
    z.add(e); fx.ring(e.x, e.y - 14, GOLD, 4, 26, 14);
    return e;
  }
  const GROUPS = { 3: ['elitegd', 'elitedrone'], 4: ['elitegd', 'eliteenf'], 5: ['eliteenf', 'elitegd', 'elitedrone'] };
  function spawnWave(z, st) {
    const side = Math.random() < 0.5 ? -1 : 1, at = edgeSpot(z, side) || edgeSpot(z, -side);
    if (!at) return;
    if (st >= 5 && !H.hunted && E.hunter) {
      H.hunted = true;
      const h = H.hunter = spawnAt(z, 'hunter', at, 0); h.patrol = false; h.hunter = true;
      G.boss = h; SW.audio.music('boss'); sfx('roar'); fx.shake(4, 12);
      G.toast('A HALCYON HUNTER IS ON YOUR TRAIL', RED);
      return;
    }
    const dir = at.x < G.player.x ? -1 : 1;
    GROUPS[st].forEach((t, i) => spawnAt(z, t, at, dir * i * 22));
    if (SW.frame - H.warned > 600) { H.warned = SW.frame; G.toast('Halcyon patrol inbound!', RED); }
    sfx('gate');
  }
  function enterZone(z) {
    const S = ensure(G.state), was = H.zone;
    H.zone = z; H.hunter = null; H.spawnT = 0; H.calm = 0;
    if (!was || S.heat <= 0) return;
    const smug = rep('syndicate') >= 70, before = stars();
    S.heat = smug ? 0 : Math.max(0, S.heat - 40);
    if (stars() < before) G.toast(smug ? 'Syndicate smugglers got you out clean: Heat cleared.' : 'You slipped away. Heat -' + (before - stars()) + '.', '#7dffa0');
  }
  function tickHeat(g, z) {
    const S = ensure(g.state), p = g.player;
    if (H.zone !== z) enterZone(z);
    if (!heatOn()) { S.heat = 0; return; }
    if (!HEAT_ZONES[z.id]) { S.heat = Math.max(0, S.heat - 0.2); return; }
    if (H.hunter && H.hunter.dead) H.hunter = null;
    // a patrol close by keeps it hot
    if (z.ents.some(e => (e.patrol || e.hunter) && !e.dead && Math.abs(e.x - p.x) < 220)) H.calm = 0;
    if (++H.calm > 480) S.heat = Math.max(0, S.heat - 0.03);
    const st = stars();
    if (st < 3) { H.hunted = false; H.spawnT = 0; return; }
    if (g.busy() || p.dead || arenaLive(z) || (g.boss && !g.boss.dead) || (g.lift && g.lift.state !== 'done')) return;
    if (++H.spawnT < 600 - st * 80) return;
    H.spawnT = 0;
    const live = z.ents.filter(e => e.patrol && !e.dead).length;
    if ((st >= 5 && !H.hunted) || live < st - 1) spawnWave(z, st);
  }

  // ---- the player: Heat ticks with them; hiding in a vent ----
  const HIDE = 150;
  const _up = P.update; P.update = function (g, z) {
    if (this.hideT > 0) {
      const S = ensure(g.state);
      this.hideT--; this.vx = 0; this.vy = 0; this.invuln = Math.max(this.invuln, 2); H.calm = 0;
      S.heat = Math.max(0, S.heat - 40 / HIDE);
      if (SW.frame % 10 === 0) fx.list.push({ k: 'p', x: this.x + SW.rand(-8, 8), y: this.y - 10, vx: 0, vy: -0.5, g: 0, life: 24, max: 24, col: '#c8ccd8', s: 2, a: 0.5 });
      if (this.hideT === 0) {
        let lost = 0;
        z.ents.forEach(e => { if (e.patrol && !e.dead && Math.abs(e.x - this.x) > 160) { e.gone = true; lost++; } });
        g.toast('You climb out of the vent.' + (lost ? ' The patrol lost your trail.' : ''), '#7dffa0');
      }
      return;
    }
    const r = _up.call(this, g, z);
    if (this === g.player && inStory()) tickHeat(g, z);
    return r;
  };
  const _pd = P.draw; P.draw = function (ctx, cam, g) { if (this.hideT > 0) return; return _pd.call(this, ctx, cam, g); };
  // vents: in every Heat area, between the fights
  const VENTS = { skyport: [10, 44], noble: [24, 68, 110], spire: [18, 98, 174] };
  function ventDraw(ctx, cam) {
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
    art.rect(ctx, '#3a3d55', x - 12, y - 16, 24, 16); art.rect(ctx, '#6a7090', x - 12, y - 16, 24, 2); art.rect(ctx, '#14152b', x - 10, y - 13, 20, 12);
    for (let i = 0; i < 4; i++) art.rect(ctx, '#5a6078', x - 9 + i * 5, y - 13, 2, 12);
    if (G.state && G.state.heat > 0 && SW.frame % 14 === 0) fx.list.push({ k: 'p', x: this.x + SW.rand(-8, 8), y: this.y - 16, vx: 0, vy: -0.4, g: 0, life: 22, max: 22, col: '#c8ccd8', s: 1, a: 0.4 });
  }
  function ventUse(g, t) {
    const p = g.player, S = ensure(g.state);
    if (S.heat < 1) { g.toast('A maintenance vent. Somewhere to hide, if Halcyon comes looking.', '#8a92b8'); return; }
    if (g.zone.ents.some(e => e.team === 'enemy' && !e.dead && e.hittable && Math.abs(e.x - p.x) < 150 && Math.abs(e.y - p.y) < 90)) { sfx('deny'); g.toast('Not with them watching. Lose them first.', '#ff8a8a'); return; }
    p.hideT = HIDE; p.x = t.x; p.vx = 0; sfx('gate'); fx.dust(t.x, t.y, 6);
  }
  Object.keys(VENTS).forEach(id => patch(id, (z, g) => {
    if (!heatOn()) return;
    VENTS[id].forEach(x => z.thing('vent', x, 19, { prompt: 'Hide in the vent', draw: ventDraw, when: () => heatOn(), use: ventUse }));
  }));
  // stragglers: once an area's story fight is over, a few Halcyon troops still walk it
  const STRAGGLERS = { noble: [['veilguard', 20], ['drone', 88, 14], ['veilguard', 128]], spire: [['veilguard', 30], ['veilenf', 104], ['drone', 186, 14]] };
  const MISSION = { noble: 'A3-4', spire: 'A3-5' };
  Object.keys(STRAGGLERS).forEach(id => patch(id, (z, g) => {
    const S = g.state;
    if (!heatOn() || !done(S)[MISSION[id]]) return;
    STRAGGLERS[id].forEach(s => z.enemy(s[0], s[1], s[2] || 19));
  }));

  // ---- kills, hits, rests, the Pit ----
  const _kill = G.onKill; G.onKill = function (e) {
    _kill.call(this, e);
    if (!inStory() || !e || !e.def) return;
    const S = ensure(G.state), M = SW.mods;
    jobCount(e.type);
    if (rep('caravan') >= 70 && M && M.drop) M.drop('scrap', 1, e.x, e.y - 14);
    if (e.hunter) {
      if (G.boss === e) G.boss = null;
      S.heat = 0; H.hunter = null; SW.audio.music(G.zone.music);
      if (M && M.drop) { M.drop('core', 1, e.x, e.y - 14); M.drop('chip', 2, e.x, e.y - 14); M.drop('scrap', 6, e.x, e.y - 14); }
      G.toast('The Hunter is down. Halcyon calls off the hunt: Heat cleared.', '#7dffa0'); gain('syndicate', 6);
      return;
    }
    if (e.patrol && M && M.drop && Math.random() < 0.5) M.drop('chip', 1, e.x, e.y - 14);
    if (heatHere()) raise(e.patrol ? 3 : e.ax0 !== undefined ? 4 : 8);
  };
  const _hit = G.onHit; G.onHit = function (atk, e, b) { _hit.call(this, atk, e, b); if (heatHere()) H.calm = 0; };
  const _rest = G.rest; G.rest = function (sp) {
    _rest.call(this, sp);
    const S = ensure(G.state);
    if (heatHere() && S.heat > 0 && rep('syndicate') >= 40) { S.heat = 0; G.toast('A Syndicate safe house: your Heat is cleared.', '#ff3ea5'); G.saveGame(); }
  };
  const _pit = G.pitTick; G.pitTick = function (z) {
    const was = G.pit && G.pit.state === 'won';
    _pit.call(this, z);
    if (was && !G.pit && inStory()) { jobCount('$pit'); gain('syndicate', 3); }
  };

  // ---- HUD: the Heat stars, top centre-left ----
  function star(ctx, x, y, col) { art.rect(ctx, col, x + 3, y, 1, 2); art.rect(ctx, col, x, y + 2, 7, 2); art.rect(ctx, col, x + 1, y + 4, 5, 1); art.rect(ctx, col, x + 1, y + 5, 2, 2); art.rect(ctx, col, x + 4, y + 5, 2, 2); }
  function drawStars(ctx, x, y, S) {
    const n = stars(), part = (S.heat % 20) / 20;
    for (let i = 0; i < 5; i++) {
      star(ctx, x + i * 9, y, '#2a2c40');
      if (i < n) star(ctx, x + i * 9, y, n >= 3 ? (SW.frame % 30 < 20 || n < 5 ? RED : '#ffffff') : GOLD);
      else if (i === n && part > 0) { ctx.globalAlpha = 0.25 + part * 0.5; star(ctx, x + i * 9, y, GOLD); ctx.globalAlpha = 1; }
    }
  }
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    if (!heatOn()) return;
    const S = ensure(g.state);
    if (!heatHere() && S.heat <= 0) return;
    ui.panel(ctx, 168, 4, 76, 14, null, 0.5);
    text(ctx, 'HEAT', 172, 7, stars() >= 3 ? RED : '#c8ccd8');
    drawStars(ctx, 199, 7, S);
    if (g.player && g.player.hideT > 0) text(ctx, 'HIDING', 172, 21, '#7dffa0');
  };

  // ================= Esc > FACTIONS (the eighth tab) =================
  const XT = SW.pauseTabs || (SW.pauseTabs = []);
  const FT = () => 6 + XT.indexOf(TAB);
  const msg = { t: 0, s: '', col: '#ffffff' };
  const say = (s, col) => { msg.s = s; msg.col = col || '#ffffff'; msg.t = 200; };
  const eat = () => { I.prev = Object.assign({}, I.now); };
  function act(g) {
    const f = FACTIONS[ui.pm.sel], S = ensure(g.state);
    if (f.id === 'halcyon') { sfx('deny'); say('Halcyon does not deal with you. Keep your Heat down.', '#ff8a8a'); return; }
    if (f.id === 'ledger' && !ledgerOpen(S)) { sfx('deny'); say(ledgerSeen(S) ? 'The Ledger does not deal with you yet. Meet them after dark at the Baron\'s old wreck.' : 'Nobody here by that name.', '#ff8a8a'); return; }
    if (atPost() !== f.id) { sfx('deny'); say('Take and hand in ' + f.short + ' jobs at ' + f.post + '.', '#ff8a8a'); return; }
    const a = S.jobs[f.id], j = a && JBY[a.id];
    if (!a) {
      const o = offer(f.id);
      if (!o) { sfx('deny'); say('No work on the board right now.', '#ff8a8a'); return; }
      S.jobs[f.id] = { id: o.id, n: 0 }; sfx('select'); say('Job taken: ' + o.name + '.', '#7dffa0');
    } else if (a.n >= j.n) say(payJob(f.id), '#7dffa0');
    else { sfx('deny'); say('Not done yet: ' + j.name + ' ' + a.n + '/' + j.n + '.', '#ff8a8a'); return; }
    g.saveGame();
  }
  const TAB = {
    name: 'FACTIONS',
    update(g) {
      const pm = ui.pm, n = FACTIONS.length;
      if (msg.t > 0) msg.t--;
      if (I.hit('down')) { pm.sel = (pm.sel + 1) % n; sfx('move'); eat(); }
      else if (I.hit('up')) { pm.sel = (pm.sel + n - 1) % n; sfx('move'); eat(); }
      else if (I.ok()) { act(g); eat(); }
    },
    draw(ctx, g) {
      const pm = ui.pm, S = ensure(g.state), post = atPost(), x0 = 26;
      if (pm.sel >= FACTIONS.length) pm.sel = 0;
      text(ctx, 'FACTIONS', x0, 34, '#f5c542', { scale: 2 });
      if (post) text(ctx, post === 'ledger' ? 'With Sable, of the Ledger' : 'At the ' + FBY[post].short + ' job board', 454, 36, FBY[post].col, { align: 'right' });
      const hidden = f => f.id === 'ledger' && !ledgerSeen(S), hostile = f => f.id === 'ledger' && ledgerSeen(S) && !ledgerOpen(S);
      FACTIONS.forEach((f, i) => {
        const y = 52 + i * 38, on = pm.sel === i, col = hidden(f) ? '#5a6078' : f.col;
        ui.panel(ctx, x0, y, 192, 34, on ? col : '#3a3d55', on ? 0.8 : 0.5);
        text(ctx, (on ? '> ' : '') + (hidden(f) ? '? ? ?' : f.name), x0 + 6, y + 4, on ? '#f5c542' : '#ffffff');
        if (hidden(f)) text(ctx, 'unknown', x0 + 6, y + 16, '#5a6078');
        else if (f.id === 'halcyon' || hostile(f)) {
          text(ctx, 'HOSTILE', x0 + 6, y + 16, RED);
          if (hostile(f)) text(ctx, "won't deal with you", x0 + 60, y + 16, '#8a92b8');
          else if (heatOn()) drawStars(ctx, x0 + 60, y + 17, S); else text(ctx, done(S)['A3-6'] ? 'fallen' : 'has not noticed you yet', x0 + 60, y + 16, '#8a92b8');
        } else {
          const r = rep(f.id);
          text(ctx, tierOf(r), x0 + 6, y + 16, f.col);
          ui.bar ? ui.bar(ctx, x0 + 62, y + 18, 92, 4, r / 100, f.col, '#22202e') : (art.rect(ctx, '#22202e', x0 + 62, y + 18, 92, 4), art.rect(ctx, f.col, x0 + 62, y + 18, Math.round(92 * r / 100), 4));
          text(ctx, r + '/100', x0 + 186, y + 16, '#c8ccd8', { align: 'right' });
          const a = S.jobs[f.id], j = a && JBY[a.id];
          if (j) text(ctx, 'Job: ' + j.name + ' ' + Math.min(a.n, j.n) + '/' + j.n, x0 + 6, y + 25, a.n >= j.n ? '#7dffa0' : '#8a92b8');
        }
      });
      // details
      const f = FACTIONS[pm.sel], dx = 228, dw = 228;
      ui.panel(ctx, dx, 52, dw, 154, hidden(f) ? '#5a6078' : f.col, 0.5);
      text(ctx, hidden(f) ? '? ? ?' : f.name, dx + 8, 58, '#f5c542'); text(ctx, f.home, dx + dw - 8, 58, '#5a6078', { align: 'right' });
      let y = 74;
      const line = (s, col) => { SW.wrap(s, dw - 16).forEach(l => { text(ctx, l, dx + 8, y, col); y += 10; }); };
      if (hidden(f)) {
        line(done(S)['A2-2'] ? 'Somebody kept the Scrap Baron\'s books. Whatever was in his strongbox might say who.' : 'There are rumours in Scrapton of a market that sells what Halcyon loses. Nobody says where.', '#c8ccd8');
      } else if (hostile(f)) {
        line('A black market in the Ash Dunes. They buy what Halcyon loses and sell it to the people Halcyon forgot.', '#c8ccd8'); y += 4;
        line('They think you work for the sky. A burnt page says where to meet them: the Baron\'s old wreck, after dark.', '#ffffff'); y += 4;
        line('Night falls at 20:00. An ember scratched on the wreck lets you wait for it.', '#8a92b8');
      } else if (f.id === 'halcyon') {
        if (!heatOn()) line(done(S)['A3-6'] ? 'Halcyon is finished. Nobody is counting Heat any more.' : 'Heat begins when the assault on Aurelia does (Act 3).', '#c8ccd8');
        else {
          line('Heat: ' + stars() + ' / 5 stars.', stars() >= 3 ? RED : '#ffffff'); y += 4;
          line('Fighting in the Skyport, the Noble Ring or the Spire raises it.', '#c8ccd8');
          line('3 stars: elite patrols hunt you. 5: a Halcyon Hunter.', '#c8ccd8'); y += 4;
          line('Cool off: stop fighting for a while, hide in a vent, or change area. The Hunter, beaten, ends the hunt.', '#8a92b8');
        }
      } else {
        const r = rep(f.id);
        f.perks(r).forEach(pk => { const got = r >= pk[0]; line((got ? '+ ' : pk[0] + ': ') + pk[1], got ? '#7dffa0' : '#5a6078'); });
        y += 4;
        const a = S.jobs[f.id], j = a && JBY[a.id], o = !j && offer(f.id);
        if (j) line('JOB: ' + j.name + ' - defeat ' + (j.types[0] === '$pit' ? 'a sparring night' : j.n + ' (' + Math.min(a.n, j.n) + ' so far)') + ' in ' + j.where + '.', a.n >= j.n ? '#7dffa0' : '#ffffff');
        else if (o) line('NEXT JOB: ' + o.name + ' (' + o.where + ').', '#c8ccd8');
      }
      const hint = f.id === 'halcyon' || hidden(f) || hostile(f) ? '' : post === f.id ? (S.jobs[f.id] ? (S.jobs[f.id].n >= JBY[S.jobs[f.id].id].n ? 'J: collect your pay' : 'J: check the job') : 'J: take the job') : 'Jobs are taken at ' + f.post + '.';
      if (hint) SW.wrap(hint, dw - 16).slice(0, 2).forEach((l, i, a) => text(ctx, l, dx + 8, 194 - (a.length - 1 - i) * 10, post === f.id ? '#22d3ee' : '#8a92b8'));
      SW.wrap('W / S: faction.  Standing: the story, jobs, Pit wins, black-market deals.', 420).forEach((l, i) => text(ctx, l, x0, 214 + i * 10, '#5a6078'));
      if (msg.t > 0) SW.wrap(msg.s, 430).forEach((l, i) => text(ctx, l, x0, 232 + i * 10, msg.col));
    }
  };
  XT.push(TAB);
})();
