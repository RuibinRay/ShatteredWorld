'use strict';
// Shattered Worlds - THE HOLLOW CROWN: the new story mode. All 64 heroes, a storyline of six chapters for each
// (1 Home, 2 Bond, 3 Rival, 4 The Three-Layer War, 5 The Big War, 6 The Crown over the Crater), and nobody has lost
// their memory. The story runs: the three layers at war, then the Convergence (shown between chapters 4 and 5), then
// the big war against the Hollow Legion. The Convergence is the villain and is never playable here. Design: "Shattered Worlds - New Story Mode.md" in the game folder.
//
// It is the game's only story mode: the first story mode was removed (the user's call, 2026-11-17).
//   - New Game goes straight to its prologue and hero select; Continue loads its save (shattered-worlds-saga-v1).
//     The first story's save is left in the browser untouched, but nothing loads it any more.
//   - The first story's files stay loaded: its map areas, enemies, bosses, art and duel balance are what this story
//     is built on (and some Versus stages use them). Its own scenes, missions and menus never run.
//   - It plays on the same map, "clean": the first story's people, triggers, bosses, shards and locked doors are taken
//     out of every area while a Hollow Crown game is running (see clean()), and its dialogue cannot start.
//   - A chapter: a card (js/saga/saga-cards.js), then the hero is taken to the chapter's area, the opening lines play,
//     and the chapter's goal runs: waves of enemies (Home, Bond, War), a hero to talk to and duel (Rival, the Called
//     in chapter 5), the final battle (chapter 6). The lines are in js/saga/lines-*.js; the places and enemies in
//     js/saga/saga-world.js. Missions SG1-SG6 show the goal on the HUD and in Esc > Mission.
//   - Abilities come from the story: the hero starts with their kit, learns their power mode in chapter 1, their
//     awakening in chapter 2 and their ultimate in chapter 3. Chapters 4 and 5 give stat points.
// Loaded last; only wraps: SW.store.save, G.fresh, G.say, G.memory, G.minorShard, story.card, every zone's build,
// SW.Zone.prototype.update, I.update, ui.titleItems / drawTitle / drawCard / drawPause / pauseUpdate, SW.i18n.tr, SW.wrap.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, ui = SW.ui, I = SW.input, art = SW.art, fx = SW.fx, W = SW.W, H = SW.H, T = 16;
  const SG = SW.saga = SW.saga || {}, HR = D && D.heroes, L = SW.lore, V = SW.versus, story = SW.story;
  if (!G || !ui || !HR || !SW.store || !SW.Zone) return;
  SG.lines = SG.lines || {};
  SG.add = o => { Object.assign(SG.lines, o); };
  const txt = (ctx, s, x, y, c, o) => SW.text(ctx, s, x, y, c, o);
  const tw = s => SW.textW(s);
  const sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no audio yet */ } };
  const on = () => !!(G.state && G.state.saga);
  const nm = id => (HR[id] ? HR[id].name : id);

  // ================= the save slot =================
  const SKEY = 'shattered-worlds-saga-v1', MKEY = 'shattered-worlds-saga-meta-v1';
  const ls = {
    get(k) { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } },
    set(k, o) { try { localStorage.setItem(k, JSON.stringify(o)); return true; } catch (e) { return false; } }
  };
  const _save = SW.store.save;
  SW.store.save = function (o) { if (o && o.saga) return ls.set(SKEY, o); return _save.apply(this, arguments); };
  SG.load = () => ls.get(SKEY);
  const rawLoad = SW.store.load;   // the first story's save only
  SW.store.load = function () { return SG.load(); };   // the only story's save (the first story's is no longer loaded)
  SG.meta = () => ls.get(MKEY) || { finished: {} };
  const finishedAny = () => Object.keys(SG.meta().finished || {}).length > 0;
  // the Beyond-born are the villains of this story and are not playable in it (the user's call; design section 11).
  // Only the Director and Rue are on the planet at the start; the rest come with Vael in chapter 5.
  const VILLAIN = ['convergence', 'vega', 'tessa', 'orin', 'noct', 'mira', 'hex', 'corvin', 'opal', 'lux', 'slick', 'apis', 'mika', 'ryo', 'itsuki', 'rue'];
  const locked = () => false;

  // ================= the chapters =================
  const KIND = ['Home', 'Bond', 'Rival', 'The Three-Layer War', 'The Big War', 'The Crown over the Crater'];
  const cardOf = (id, n) => {
    const base = ((SG.cards && SG.cards[id]) || [])[n - 1] || [KIND[n - 1], '', ''], c = (SG.lines[id] || {})[n];
    if (!c || !c.card) return base;
    const z = n === 6 ? 'crater' : c.zone;
    return [base[0], z && SW.zones[z] ? SW.zones[z].name : base[1], c.card];
  };
  // a place named in the design -> the area on the map
  const PLACE = [[/med-lab/i, 'medlab'], [/cryo vault/i, 'cryo'], [/vent stacks/i, 'stacks'], [/proving hall/i, 'armoury'], [/burn ward/i, 'furnace'],
    [/firing gallery/i, 'range'], [/paper shrine/i, 'shrine'], [/ballast/i, 'ballast'], [/skylift/i, 'skylift'], [/skyport/i, 'skyport'],
    [/noble ring|house edge/i, 'noble'], [/hydro ward/i, 'hydro'], [/archive/i, 'archive'], [/night ward/i, 'ward'], [/beast pens/i, 'pens'],
    [/shaft nine/i, 'dig'], [/long bar/i, 'saloon'], [/mile zero/i, 'milezero'], [/ice house/i, 'icehouse'], [/ash dunes/i, 'dunes'],
    [/village|last toll/i, 'village'], [/glowwild/i, 'glowwild'], [/rust flats/i, 'scrapton'], [/sinkhole/i, 'sinkhole'], [/crusher yard/i, 'yard'],
    [/core sump/i, 'core'], [/scrapworks/i, 'works'], [/dockside/i, 'docks'], [/rust dojo/i, 'dojo'], [/slums/i, 'slums'], [/old metro/i, 'metro'],
    [/pit arena|strings cut/i, 'pit'], [/rootways|the roots/i, 'rootways'], [/neon market/i, 'market'], [/waterworks/i, 'waterworks'],
    [/drowned line/i, 'choir'], [/pylon/i, 'pylon'], [/platform zero/i, 'platform'], [/blank wing/i, 'blank'], [/observation gallery/i, 'gallery'],
    [/crater/i, 'crater'], [/glass sea/i, 'glasssea'], [/tether/i, 'tethers'], [/spire/i, 'spire'], [/buried meridian/i, 'meridian'],
    [/engine core/i, 'enginecore'], [/near side/i, 'crater']];
  const placeZone = s => { for (const [re, z] of PLACE) if (re.test(s || '')) return z; return null; };
  const heroIn = s => { const m = (s || '').toLowerCase().match(/^(the )?([a-z]+)/); return m && HR[m[2]] ? m[2] : null; };
  // the chapter as it is played: the written lines (lines-*.js) over defaults read from the chapter's card
  function chap(id, n) {
    const card = cardOf(id, n), c = Object.assign({}, (SG.lines[id] || {})[n]);
    if (n === 6) { c.zone = 'crater'; c.foe = 'itsuki'; }
    if (!c.zone || !SW.zones[c.zone]) c.zone = placeZone(card[1]) || (n > 1 ? chap(id, n - 1).zone : 'scrapton');
    const who = heroIn(card[1]);
    if (n === 2 && !HR[c.with]) c.with = who && who !== id ? who : null;
    if (n === 3 && !HR[c.rival]) c.rival = who && who !== id ? who : 'kael';
    if (n === 5 && !HR[c.foe]) c.foe = who && who !== id ? who : 'itsuki';
    if (!c.goal) c.goal = [null, 'Fight your way out', 'Hold the line together', 'Duel ' + nm(c.rival), 'Win the battle', 'Break the Call', 'Break the Hollow Crown'][n];
    const sum = [['sys', card[2] || card[1]]];
    if (!c.intro) c.intro = sum;
    if (!c.meet) c.meet = sum;
    if (!c.win) c.win = [['hero', 'Done.']];
    if (!c.lose) c.lose = [['hero', 'Again.']];
    return c;
  }
  SG.chap = chap;
  const STEPS = {
    1: c => [{ id: 'fight', t: c.goal }],
    2: c => [{ id: 'talk', t: 'Find ' + nm(c.with) + ' (E to talk)' }, { id: 'fight', t: c.goal }],
    3: c => [{ id: 'talk', t: 'Talk to ' + nm(c.rival) + ' (E)' }, { id: 'duel', t: c.goal }],
    4: c => [{ id: 'fight', t: c.goal }],
    5: c => [{ id: 'fight', t: 'Cut through the Hollow Legion' }, { id: 'talk', t: 'Face ' + nm(c.foe) + ' (E)' }, { id: 'duel', t: c.goal }],
    6: c => [{ id: 'fight', t: 'Hold the Crater against the Legion' }, { id: 'talk', t: 'Face Itsuki (E)' }, { id: 'duel', t: 'Beat Itsuki, the last champion' }, { id: 'boss', t: c.goal }]
  };
  const XP = [0, 120, 200, 280, 420, 560, 0], CR = [0, 60, 90, 120, 180, 240, 0];
  function setupMissions(id) {
    for (let n = 1; n <= 6; n++) {
      const c = chap(id, n);
      D.missions['SG' + n] = { id: 'SG' + n, title: 'Chapter ' + n + ': ' + cardOf(id, n)[0], xp: XP[n], creds: CR[n], next: n < 6 ? 'SG' + (n + 1) : null, steps: STEPS[n](c) };
    }
  }
  const mis = n => D.missions['SG' + n];
  const done = (n, sid) => { const m = mis(n); return !!(m && G.state.steps[m.id + ':' + sid]); };

  // ================= dialogue =================
  function speaker(s) {
    if (s === 'hero' || s === 'sys') return s;
    if (HR[s]) { const k = 'h:' + s; if (!D.speakers[k]) { const h = HR[s]; D.speakers[k] = { name: h.name, sheet: h.sheet, pitch: h.pitch || 480, col: h.color }; } return k; }
    if (s === 'vael' && !D.speakers.vael) D.speakers.vael = { name: 'Sovereign Vael', sheet: (D.speakers.director || {}).sheet || 'director', pitch: 140 };
    return D.speakers[s] ? s : 'sys';
  }
  function say(key, lines, cb) {
    if (!lines || !lines.length) { if (cb) cb(); return; }
    const id = 'sg:' + key;
    D.dialogue[id] = lines.map(l => ({ s: speaker(l[0]), t: String(l[1]), raw: true }));
    G.say(id, cb);
  }
  SG.say = say;
  // while a Hollow Crown game runs, the first story cannot start its own scenes, memories, shards or act cards
  const _say = G.say; G.say = function (id) { if (on() && String(id).indexOf('sg:') !== 0) { SG.dropped = id; return; } return _say.apply(this, arguments); };
  const _mem = G.memory; G.memory = function () { if (on()) return; return _mem.apply(this, arguments); };
  const _ms = G.minorShard; G.minorShard = function () { if (on()) return; return _ms.apply(this, arguments); };
  if (story && story.card) { const _sc = story.card; story.card = function () { if (on()) return; return _sc.apply(this, arguments); }; }

  // ================= the clean map =================
  function keepEnt(e) {
    if (e instanceof SW.NPC || e instanceof SW.Shard || e instanceof SW.Target || e instanceof SW.Arena || e instanceof SW.Gate) return !!e.sg;
    if (e instanceof SW.SavePoint || e instanceof SW.Pickup || e instanceof SW.Breakable) return true;
    if (e instanceof SW.Thing) return !e.use || !!e.sg || /gotoZone/.test(String(e.use));
    if (e.def) return !(e.isBoss || e.def.boss || e.def.script);
    return !e.talk;
  }
  function clean(z) {
    z.triggers.length = 0;
    z.hints = z.hints.filter(h => !/memor|shard/i.test(h.text || ''));
    z.exits.forEach(e => { delete e.need; });
    z.ents = z.ents.filter(keepEnt);
    // the way back into the Hidden Village from the places beside it
    const lk = SG.LINKS && SG.LINKS[z.id], sp = lk && (z.spawns[lk.side === 'west' ? 'east' : 'west'] || z.spawns[Object.keys(z.spawns)[0]]);
    if (sp) { const tx = Math.floor(sp.x / T) + (lk.side === 'west' ? -3 : 3), ty = Math.round(sp.y / T) - 1; z.thing('sign', tx, ty, { sg: true, prompt: 'To the Hidden Village', use: g => g.gotoZone(lk.to, lk.spawn) }); }
  }
  function wrapZones() {
    Object.keys(SW.zones).forEach(id => {
      const d = SW.zones[id];
      if (!d || d._sg || id === 'versus' || typeof d.build !== 'function') return;
      const b = d.build;
      d.build = function (z, g) { b.apply(this, arguments); if (on()) { try { clean(z); } catch (e) { console.error(e); } } };
      d._sg = true;
    });
  }
  window.addEventListener('load', wrapZones);

  // ================= positions on the map =================
  const solid = c => c === '#' || c === '=';
  const standable = (z, tx, ty) => solid(z.tile(tx, ty + 1)) && z.tile(tx, ty + 1) !== '^' && !solid(z.tile(tx, ty)) && !solid(z.tile(tx, ty - 1)) && z.tile(tx, ty) !== '~' && z.tile(tx, ty - 1) !== '~';
  function groundNear(z, tx, ty0) { for (const dy of [0, -1, 1, -2, 2, -3, 3, 4, -4, 5, 6, -5, 7, 8, -6]) { const ty = ty0 + dy; if (ty >= 1 && ty < z.h - 1 && standable(z, tx, ty)) return ty; } return -1; }
  function spotNear(z, x, y, dist, dir) {
    const tx0 = Math.floor(x / T), ty0 = Math.floor((y - 1) / T);
    for (const d of [dist, dist + 2, dist - 2, dist + 4, dist - 4, dist + 7, dist - 6, 3]) for (const s of [dir, -dir]) {
      const tx = tx0 + s * Math.max(2, d);
      if (tx < 2 || tx > z.w - 3) continue;
      const ty = groundNear(z, tx, ty0);
      if (ty >= 0) return { tx, ty };
    }
    return { tx: tx0, ty: ty0 };
  }
  SG.spotNear = spotNear;

  // ================= the running chapter (rebuilt whenever an area loads) =================
  const R = { zone: null, wave: -1, list: null, foes: [], t: 0, npc: null, cardShown: false, cardT: 0, awayT: 0, boss: null };
  SG.run = R;   // (for tests)
  function newZone(z) {
    Object.assign(R, { zone: z, wave: -1, list: null, foes: [], t: 70, npc: null, boss: null });
    const S = G.state, sg = S.saga, n = sg.ch, c = chap(S.hero, n);
    if (sg.phase !== 'play') return;
    if (z.id !== c.zone) { G.toast('Chapter ' + n + ' goes on in ' + SW.zones[c.zone].name + '  (Esc > Mission: travel)', '#22d3ee'); return; }
    if (n === 2 && !done(2, 'fight')) placeNpc(z, c.with, () => !done(2, 'talk'));
    if (n === 3 && !done(3, 'duel')) placeNpc(z, c.rival);
    if ((n === 5 || n === 6) && done(n, 'fight') && !done(n, 'duel')) placeNpc(z, c.foe);
  }
  function dropNpc() { const z = G.zone, e = R.npc; if (z && e) { const i = z.ents.indexOf(e); if (i >= 0) z.ents.splice(i, 1); fx.ring(e.x, e.y - 16, '#b48cff', 4, 40, 18); } R.npc = null; }
  function placeNpc(z, who, when) {
    if (!HR[who] || R.npc) return;
    const p = G.player, s = spotNear(z, p.x, p.y, 7, p.face || 1);
    const called = G.state.saga.ch >= 5 && SG.CALLED && SG.CALLED.indexOf(who) >= 0;
    const npc = new SW.NPC(called && SG.calledSheet ? SG.calledSheet(who) : HR[who].sheet, s.tx * T + 8, (s.ty + 1) * T, { sg: true, sgWho: who, sgCalled: called, prompt: called ? 'Face' : 'Talk', talk: () => { talk(); return null; }, when });
    z.add(npc); R.npc = npc;
    fx.ring(npc.x, npc.y - 16, HR[who].color, 4, 36, 18);
  }
  function foeLists(n, zone) {
    const part = SG.partOf(n), lay = SG.layerOf(zone), F = (SG.FOES[part] || SG.FOES[1])[lay] || SG.FOES[1][1], waves = SG.WAVES[n] || SG.WAVES[1];
    const pick = a => { const ok = (a || []).filter(t => D.enemies[t]); return ok.length ? ok[Math.floor(Math.random() * ok.length)] : 'guard'; };
    return waves.map(w => { const out = []; w.forEach(([k, cnt]) => { for (let i = 0; i < cnt; i++) out.push(pick(F[k])); }); return out; });
  }
  function spawnWave(z, list) {
    const p = G.player; R.foes = [];
    list.forEach((type, i) => {
      const side = (i % 2 ? -1 : 1) * (p.face || 1), s = spotNear(z, p.x, p.y, 9 + (i >> 1) * 3, side), fly = D.enemies[type].fly;
      const e = z.enemy(type, s.tx, fly ? Math.max(1, s.ty - 3) : s.ty);
      e.state = 'chase'; e.sgT = 0;
      fx.ring(e.x, e.y - 14, '#ff3ea5', 4, 30, 16);
      R.foes.push(e);
    });
    G.alert(); sfx('roar');
  }
  const gone = (z, e) => !e.wait && (e.dead || e.gone || z.ents.indexOf(e) < 0 || e.y > z.ph + 64);
  function runWaves(z, n, c) {
    const p = G.player;
    // a foe stuck somewhere it cannot reach the hero for a long time is let go
    R.foes.forEach(e => { if (!gone(z, e)) { e.sgT = Math.hypot(e.x - p.x, e.y - p.y) > 300 ? e.sgT + 1 : 0; if (e.sgT > 900) { e.dead = true; e.gone = true; } } });
    if (R.wave >= 0 && !R.foes.every(e => gone(z, e))) return;
    if (R.t > 0) { R.t--; return; }
    if (!R.list) R.list = foeLists(n, z.id);
    R.wave++;
    if (R.wave >= R.list.length) {
      R.wave = -1; R.list = null; R.foes = []; R.t = 70;
      if (n === 5 || n === 6) { G.step('SG' + n + ':fight'); G.toast(n === 5 ? 'The Legion breaks. Someone is waiting.' : 'The Legion falters. Itsuki is waiting.', '#b48cff'); placeNpc(z, c.foe); return; }
      say('w' + n, c.win, () => complete(n, 'fight'));
      return;
    }
    spawnWave(z, R.list[R.wave]); R.t = 80;
    const war = n === 4 ? 'THE THREE-LAYER WAR  -  ' : n >= 5 ? 'THE HOLLOW LEGION  -  ' : '';
    G.toast(war + 'WAVE ' + (R.wave + 1) + ' / ' + R.list.length, n >= 5 ? '#b48cff' : '#ff3ea5');
  }
  // chapter 6: the Convergence and Sovereign Vael, one after the other - the last two engines (the Convergence's
  // own storyline fights Vael alone: he turns on him at the end)
  const VAEL_IN = [['sys', 'The sky over the Crater splits. Something the size of a city lowers itself through the gap: a crown with nothing inside it.'],
    ['vael', 'The little engine is spent. It was only ever a door.'], ['vael', 'I have emptied nine worlds. Kneel, and yours ends quietly.']];
  const VAEL_CONV = [['vael', 'You opened the door, little engine. Did you think I would knock?'], ['vael', 'Kneel. Your throne was always going to be a feed line.']];
  function runBoss(z, c) {
    const conv = G.state.hero === 'convergence', order = (conv ? ['vael'] : ['convergence', 'vael']).filter(t => D.enemies[t]);
    if (!order.length) order.push('eliteenf');
    if (R.boss && !gone(z, R.boss)) return;
    if (R.boss) { if (R.t > 0) { R.t--; return; } R.bossN = (R.bossN || 0) + 1; R.boss = null; G.boss = null; }
    const k = R.bossN || 0;
    if (k >= order.length) { R.bossN = 0; R.boss = { dead: true }; SW.audio.music(z.music); say('w6', c.win, () => complete(6, 'boss')); return; }
    const spawn = () => {
      const p = G.player, s = spotNear(z, p.x, p.y, 10, p.face || 1);
      R.boss = z.enemy(order[k], s.tx, s.ty); R.boss.state = 'chase'; R.boss.dormant = false; G.boss = R.boss; R.t = 90;
      // the first story's finale was balanced for level 16; a hero comes to this one around level 8 to 12
      const lv = G.state.level || 1, scale = Math.min(1, (lv + 4) / 20) * (order[k] === 'convergence' ? 0.8 : 1);   // Vael is the last and hardest
      R.boss.hp = R.boss.hpMax = Math.max(300, Math.round(R.boss.hpMax * scale));
      SW.audio.music('boss'); fx.flash('#b48cff', 12); fx.shake(6, 30); sfx('roar');
    };
    R.boss = { dead: false, wait: true };   // nothing to fight while the scene plays
    if (order[k] === 'vael') say('v6', conv ? VAEL_CONV : VAEL_IN, spawn); else spawn();
  }
  function talk() {
    const S = G.state, n = S.saga.ch, c = chap(S.hero, n);
    if (n === 2) { if (!done(2, 'talk')) say('m2', c.meet, () => { G.step('SG2:talk'); R.t = 40; }); return; }
    if (n === 3 || n === 5 || n === 6) {
      const who = n === 3 ? c.rival : c.foe, go = () => duel(who, n, c);
      if (!done(n, 'talk')) say('m' + n, c.meet, () => { G.step('SG' + n + ':talk'); go(); }); else go();
    }
  }

  // ================= duels =================
  // the same rules as the first story's Crater duel (story-crater.js): the rival mirrors the hero's progress and gets
  // a measured edge; Versus' own balance table is set aside for the fight
  let tuned = null;
  const untune = ids => { if (!V || !V.tune) return; tuned = {}; ids.forEach(id => { tuned[id] = V.tune[id]; V.tune[id] = 1; }); };
  const retune = () => { if (!tuned) return; Object.keys(tuned).forEach(id => { if (tuned[id] === undefined) delete V.tune[id]; else V.tune[id] = tuned[id]; }); tuned = null; };
  function duel(who, n, c) {
    const cr = story && story.crater, hero = G.state.hero;
    const o = Object.assign({ diff: 1, hpBonus: 100, rivalPower: 12, rivalHp: 200 }, cr && cr.DUEL, cr && HR[hero].legend ? cr.LEGEND : null, cr && cr.FOR && cr.FOR[hero],
      { rival: who, title: n === 6 ? 'THE LAST CHAMPION' : n === 5 ? 'THE BIG WAR' : 'RIVAL DUEL', rivalName: (n >= 5 ? 'CHAMPION: ' : '') + nm(who).toUpperCase(), stage: SG.stageFor(c.zone), canQuit: true });
    const dl = SW.difficulty && SW.difficulty.cur && SW.difficulty.cur();
    if (dl && dl.id !== 'medium') { o.diff = dl.duelDiff; o.rivalPower = Math.round(o.rivalPower * dl.duelEdge); o.rivalHp = Math.round(o.rivalHp * dl.duelEdge); }
    if (n >= 5) { o.full = true; o.rivalHp += 100; }                    // Vael's champions fight with everything they have
    if (who === 'itsuki') { o.full = true; o.rivalPower += 4; o.rivalHp += 150; }   // the strongest fighter in any world
    const called = n >= 5 && SG.CALLED && SG.CALLED.indexOf(who) >= 0 && SG.callLook;
    untune([hero, who]);
    if (called) SG.callLook(who, true);
    const undo = () => { retune(); if (called) SG.callLook(who, false); };
    let ok = false;
    try { ok = !!(V && V.duel && V.duel(Object.assign({}, o, { onEnd(result) { undo(); afterDuel(result, n, c); } }))); } catch (e) { console.error(e); }
    if (!ok) { undo(); afterDuel('win', n, c); return; }   // the story must stay finishable even if Versus cannot start the fight
    const r = V.f[1].state;
    if (o.rivalHp) { r.hpBonus = (r.hpBonus || 0) + o.rivalHp; r.hp += o.rivalHp; }
    if (o.rivalPower) r.stats.power = ((1 + 0.06 * (r.stats.power || 0)) * (1 + 0.06 * o.rivalPower) - 1) / 0.06;
  }
  function afterDuel(result, n, c) {
    if (result === 'win' && n === 6) { dropNpc(); G.step('SG6:duel'); R.t = 70; G.toast('Itsuki falls back to the Crown. The sky opens.', '#b48cff'); return; }   // then the Convergence and Vael
    if (result === 'win') { if (n === 5) dropNpc(); say('w' + n, c.win, () => complete(n, 'duel')); }
    else say('l' + n, c.lose, () => G.toast('Face ' + nm(n === 3 ? c.rival : c.foe) + ' again (E).', '#8a92b8'));
  }

  // ================= moving through the story =================
  function reward(n) {
    const S = G.state, h = G.hero();
    if (n === 1 && h.mode) G.unlock(h.mode);
    if (n === 2 && h.awaken) G.unlock(h.awaken);
    if (n === 3 && h.ultimate) G.unlock(h.ultimate);
    if (n === 4 || n === 5) { S.points += 2; G.toast('+2 stat points  (Esc > Stats)', '#7dffa0'); }
    S.hp = G.player ? G.player.hpMax() : S.hp; S.energy = Math.max(S.energy, 200);
  }
  function complete(n, sid) {
    const S = G.state, sg = S.saga;
    G.step('SG' + n + ':' + sid);
    reward(n);
    if (R.npc) R.npc.talk = null;
    if (n >= 6) { finish(); return; }
    sg.ch = n + 1; sg.phase = 'card'; R.cardShown = false; R.cardT = 110; R.npc = null;
    G.saveGame();
  }
  function finish() {
    const S = G.state, m = SG.meta();
    m.finished = m.finished || {}; m.finished[S.hero] = true; ls.set(MKEY, m);
    S.saga.phase = 'end'; S.saga.ch = 7; R.cardShown = false; R.cardT = 140;
    G.saveGame();
  }
  function showCard() { G.card = 'sg'; G.overlay = 'card'; R.cardShown = true; sfx('level'); }
  function travel(zone) { if (G.zone && G.zone.id === zone) { newZone(G.zone); return; } G.gotoZone(zone); }
  function begin() {
    const S = G.state, sg = S.saga;
    sg.phase = 'play'; R.cardShown = false;
    travel(chap(S.hero, sg.ch).zone);
    G.saveGame();
  }
  SG.travel = () => { if (on() && G.state.saga.phase === 'play') travel(chap(G.state.hero, G.state.saga.ch).zone); };

  // every frame of play (from the area's update, which runs whenever the game is not paused)
  function tick(z) {
    const S = G.state, sg = S.saga;
    if (R.zone !== z) newZone(z);
    if (sg.phase === 'card' || (sg.phase === 'end' && !sg.endSeen)) {
      if (G.busy()) return;
      if (R.cardT > 0) { R.cardT--; return; }
      if (!R.cardShown) {
        if (sg.phase === 'card' && sg.ch === 5 && !sg.seen.conv) { sg.seen.conv = true; R.inter = true; showCard(); R.cardShown = false; R.cardT = 8; return; }   // first the Convergence
        R.inter = false; showCard(); if (sg.phase === 'end') sg.endSeen = true; return;
      }
      if (sg.phase === 'card') begin();
      return;
    }
    if (sg.phase !== 'play' || G.busy() || !G.player || G.player.dead) return;
    const n = sg.ch, c = chap(S.hero, n);
    if (z.id !== c.zone) return;
    if (!sg.seen['i' + n]) { sg.seen['i' + n] = true; if (n !== 2 && n !== 3) { say('i' + n, c.intro); return; } }
    const steps = mis(n).steps.map(s => s.id);
    if (steps.indexOf('fight') >= 0 && !done(n, 'fight') && (n !== 2 || done(2, 'talk'))) { runWaves(z, n, c); return; }
    if (n === 6 && done(6, 'duel') && !done(6, 'boss')) runBoss(z, c);
  }
  const _zu = SW.Zone.prototype.update;
  SW.Zone.prototype.update = function (g) {
    const out = _zu.apply(this, arguments);
    if (on() && G.scene === 'play' && this === G.zone && this.id !== 'versus' && G.player) { try { tick(this); } catch (e) { console.error(e); } }
    return out;
  };

  // ================= starting and continuing =================
  let starting = null;
  const _fresh = G.fresh;
  G.fresh = function (hero) {
    const s = _fresh.apply(this, arguments);
    if (starting === hero) {
      const h = HR[hero];
      s.saga = { v: 1, ch: 1, phase: 'card', seen: {} };
      s.mission = 'SG1'; s.flags.name_known = true;
      s.abilities.double_jump = true;
      h.kit.forEach(k => { if (k !== h.mode && k !== h.awaken && k !== h.ultimate) s.abilities[k] = true; });   // they know who they are, and what they can do
    }
    return s;
  };
  function newSaga(hero) {
    if (!HR[hero] || VILLAIN.indexOf(hero) >= 0) return;
    wrapZones(); setupMissions(hero);
    const h = HR[hero], keep = h.start, c = chap(hero, 1);
    h.start = { zone: c.zone, spawn: SG.SPAWN && SG.SPAWN[c.zone] };
    starting = hero;
    try { G.newGame(hero); } finally { starting = null; h.start = keep; }
    if (!on()) return;
    Object.assign(R, { zone: null, cardShown: false, cardT: 30 });
    G.saveGame();
  }
  function continueSaga() {
    const s = SG.load(); if (!s || !HR[s.hero] || VILLAIN.indexOf(s.hero) >= 0) return;
    wrapZones(); setupMissions(s.hero);
    const _ld = SW.store.load; SW.store.load = () => s;
    try { G.continueGame(); } finally { SW.store.load = _ld; }
    if (!on()) return;
    const sg = G.state.saga; sg.seen = sg.seen || {};
    Object.assign(R, { zone: null, cardShown: false, cardT: 20 });
  }
  SG.newSaga = newSaga; SG.continueSaga = continueSaga;

  // ================= the chapter card =================
  const _dc = ui.drawCard;
  ui.drawCard = function (ctx, g) {
    if (g.card !== 'sg' || !on()) return _dc.apply(this, arguments);
    if (R.inter) return drawInterlude(ctx);
    const S = g.state, sg = S.saga, h = HR[S.hero], end = sg.phase === 'end', n = Math.min(6, sg.ch), card = cardOf(S.hero, n), c = chap(S.hero, n);
    ctx.globalAlpha = 0.92; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    ui.panel(ctx, 30, 30, 420, 206, h.color, 0.95);
    if (L && L.ui) L.ui.splash(ctx, S.hero, 44, 44); else art.rect(ctx, h.color, 44, 44, 96, 128);
    txt(ctx, h.name.toUpperCase(), 92, 178, h.color, { align: 'center' });
    const x = 154, wrapW = 284;
    if (end) {
      txt(ctx, 'THE HOLLOW CROWN', x, 44, '#8a92b8');
      txt(ctx, 'THE END', x, 58, '#f5c542', { scale: 3 });
      const q = (L && L.ui) ? L.ui.quote(S.hero) : '';
      let y = 96; SW.wrap('The Hollow Crown fell into the Crater, and the Legion went still. ' + h.name + "'s story is told.", wrapW).forEach(l => { txt(ctx, l, x, y, '#e8ecf4', { raw: true }); y += 11; });
      y += 8; if (q) SW.wrap('"' + q + '"', wrapW).forEach(l => { txt(ctx, l, x, y, h.colorHi || '#ffffff', { raw: true }); y += 11; });
      y += 10; txt(ctx, finishedAny() ? 'Another hero, another story: New Game > The Hollow Crown.' : '', x, y, '#8a92b8');
    } else {
      txt(ctx, 'CHAPTER ' + n + '  of 6', x, 44, '#8a92b8');
      txt(ctx, card[0].toUpperCase(), x, 56, '#f5c542', { scale: 2 });
      txt(ctx, SW.zones[c.zone] ? SW.zones[c.zone].name : card[1], x, 78, h.color);
      let y = 96; SW.wrap(card[2], wrapW).forEach(l => { txt(ctx, l, x, y, '#e8ecf4', { raw: true }); y += 11; });
      y += 10; txt(ctx, 'GOAL', x, y, '#8a92b8'); txt(ctx, c.goal, x + 30, y, '#ffffff');
      const rw = ['', 'Learn: power mode (S + O)', 'Learn: awakening (O)', 'Learn: ultimate (W + I)', '+2 stat points', '+2 stat points', 'The ending'][n];
      y += 12; txt(ctx, 'REWARD', x, y, '#8a92b8'); txt(ctx, rw, x + 42, y, '#7dffa0');
    }
    if (SW.frame % 40 < 26) txt(ctx, end ? 'J / Enter: free roam' : 'J / Enter: begin', W / 2, 222, '#8a92b8', { align: 'center' });
  };

  // between chapters 4 and 5: the three-layer war ends at the Engine Core, and the big war begins
  const INTER = ['Four banners climbed the Halcyon Spire. On the floor of his Engine, the Director was beaten.',
    'He stepped back into its light, and the Engine took him in. What came out was the Convergence.',
    'It opened the Beyond all the way, and called. The sky over the Crater split from horizon to horizon,',
    'and Sovereign Vael answered: the Hollow Legion, hundreds of thousands of soldiers emptied out of the worlds he has eaten, and his champions, fourteen Beyond-born who serve him.'];
  function drawInterlude(ctx) {
    ctx.globalAlpha = 0.95; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    art.glow(ctx, W / 2, 70, 120, '#b48cff', 0.12 + 0.04 * Math.sin(SW.frame * 0.05));
    txt(ctx, 'THE THREE-LAYER WAR IS OVER', W / 2, 26, '#8a92b8', { align: 'center' });
    txt(ctx, 'THE CONVERGENCE', W / 2, 40, '#e8d8ff', { align: 'center', scale: 3 });
    let y = 84; INTER.forEach(p => { SW.wrap(p, 400).forEach(l => { txt(ctx, l, W / 2, y, '#e8ecf4', { align: 'center', raw: true }); y += 11; }); y += 4; });
    txt(ctx, 'THE BIG WAR BEGINS', W / 2, y + 8, '#b48cff', { align: 'center', scale: 2 });
    if (SW.frame % 40 < 26) txt(ctx, 'J / Enter: keep going', W / 2, 238, '#8a92b8', { align: 'center' });
  }

  // ================= Esc: the pause screen =================
  // no memory journal and no "locked memory": the journal tells the story so far, and a skill not learned yet says
  // which part of the story teaches it
  let SUB = null;
  const SUBS = { 'Locked memory': 'Not learned yet', 'Recover a Major Memory Shard to remember this.': 'The story teaches it: chapter 1, 2 or 3.',
    'MEMORY JOURNAL': 'THE STORY SO FAR', 'Nothing yet. Everything you were is scattered across this world.': '' };
  if (SW.i18n && SW.i18n.tr) { const _tr = SW.i18n.tr; SW.i18n.tr = function (s) { if (SUB && typeof s === 'string') { if (SUB[s] !== undefined) s = SUB[s]; else if (s.indexOf('Minor shards:') === 0) s = ''; } return _tr.apply(this, [s].concat([].slice.call(arguments, 1))); }; }
  const _wrap = SW.wrap; SW.wrap = function (s) { if (SUB && SUB[s] !== undefined) s = SUB[s]; return _wrap.apply(this, [s].concat([].slice.call(arguments, 1))); };
  const _dp = ui.drawPause;
  ui.drawPause = function (ctx, g) {
    if (!on()) return _dp.apply(this, arguments);
    SUB = SUBS;
    try { _dp.apply(this, arguments); } finally { SUB = null; }
    const pm = ui.pm, S = g.state, sg = S.saga;
    if (pm.tab === 0 && sg.phase === 'play' && g.zone) {
      const c = chap(S.hero, sg.ch);
      if (g.zone.id !== c.zone) { art.rect(ctx, '#0b0c18', 24, 218, 300, 12); txt(ctx, 'J: travel to ' + SW.zones[c.zone].name, 26, 220, '#22d3ee'); }
    }
    if (pm.tab === 2) {
      let y = 58; const x0 = 26;
      for (let n = 1; n <= 6; n++) {
        const card = cardOf(S.hero, n), past = n < sg.ch || sg.phase === 'end', now = n === sg.ch && !past;
        if (!past && !now) { txt(ctx, n + '.  ' + card[0], x0, y, '#5a6078'); y += 12; continue; }
        txt(ctx, n + '.  ' + card[0] + '  -  ' + card[1], x0, y, now ? '#f5c542' : '#7dffa0'); y += 11;
        SW.wrap(card[2], 410).forEach(l => { txt(ctx, l, x0 + 14, y, '#c8ccd8', { raw: true }); y += 10; });
        y += 4;
      }
    }
  };
  const _pu = ui.pauseUpdate;
  ui.pauseUpdate = function (g) {
    if (on() && ui.pm.tab === 0 && I.ok() && g.state.saga.phase === 'play' && g.zone && g.zone.id !== chap(g.state.hero, g.state.saga.ch).zone) {
      g.overlay = null; sfx('select'); SG.travel(); return;
    }
    return _pu.apply(this, arguments);
  };

  // ================= the title menu, and the new story's own screens =================
  const M = SG.menu = { open: false, view: 'mode', sel: 0, tab: 0, idx: 0, page: 0, t: 0, skip: false, held: null, confirm: false };
  const REALMS = (L && L.order ? L.order.slice(0, 4) : ['sky', 'land', 'deep', 'beyond']).filter(r => r !== 'beyond');
  const realm = r => (L && L.realms && L.realms[r]) || { name: r.toUpperCase(), sub: '', col: '#8fd3ff', hi: '#ffffff', desc: '' };
  const listOf = r => (L && L.ui ? L.ui.list(r) : []).filter(id => VILLAIN.indexOf(id) < 0);
  const PRO = [
    '2091. The Ashfall War burns the world in forty-one days.\nThe rich rise to Aurelia, a gold city on anti-gravity pylons.\nThe poor go down into the old metro lines: Deepline.\nEveryone else is left on the Surface.',
    'A handful of families refuse to choose.\nBy a mountain fire they swear the Pact of Three Layers:\nthe Hidden Clans, living in all three layers\nto keep them from killing each other.',
    "2187. Halcyon's Convergence Engine runs at full power.\nIt tears two worlds into ours: Vharra, the storm steppe,\nand the Frozen Harbour. Their people land everywhere,\nand they remember everything they lost.",
    'The Engine tears one more hole: into the Beyond,\nthe dark between worlds. It never closes.\nHalcyon hunts whoever has power, numbers them as Subjects,\nand drains them into the Engine. What is left is a Husk.',
    'And far away, on the other side of the dark,\nsomething hears the Engine turning.',
    '64 heroes. 64 stories. One war.\nChoose who you are.'
  ];
  const rp = {};
  function rep(a) {
    if (I.hit(a)) { rp[a] = 0; return true; }
    if (I.held(a)) { rp[a] = (rp[a] || 0) + 1; return rp[a] > 16 && rp[a] % 4 === 0; }
    rp[a] = 0; return false;
  }
  function open(view) { Object.assign(M, { open: true, view, sel: 0, skip: true, page: 0, t: 0, confirm: false }); if (L && L.ui) L.ui.ensureLang(); sfx('select'); }
  function close() { M.open = false; I.keys.length = 0; }
  function update() {
    if (M.skip) { M.skip = false; return; }
    const k = { ok: I.ok(), back: I.hit('pause') || (M.view !== 'pro' && I.hit('jump')), up: rep('up'), down: rep('down'), left: rep('left'), right: rep('right'), prev: I.hit('skill'), next: I.hit('special') };
    if (M.view === 'mode' || M.view === 'cont') {
      if (k.up || k.down) { M.sel = 1 - M.sel; sfx('move'); }
      else if (k.back) { close(); sfx('back'); }
      else if (k.ok) {
        sfx('select');
        if (M.view === 'mode') { if (M.sel === 0) { M.view = 'pro'; M.page = 0; M.t = 0; } else { close(); G.scene = 'select'; } }
        else { close(); if (M.sel === 0) continueSaga(); else G.continueGame(); }
      }
      return;
    }
    if (M.view === 'pro') {
      M.t++;
      const len = PRO[M.page].length;
      if (I.hit('pause')) { M.view = 'pick'; sfx('select'); }
      else if (k.ok || I.hit('jump')) { if (M.t * 0.9 < len) M.t = len * 2; else { M.page++; M.t = 0; sfx('select'); if (M.page >= PRO.length) M.view = 'pick'; } }
      return;
    }
    // the hero select
    const r = REALMS[M.tab], ids = listOf(r), n = ids.length;
    if (M.confirm) {
      if (k.ok) { const id = ids[M.idx]; close(); sfx('select'); newSaga(id); }
      else if (k.back) { M.confirm = false; sfx('back'); }
      return;
    }
    if (k.prev || k.next) { M.tab = (M.tab + (k.next ? 1 : REALMS.length - 1)) % REALMS.length; M.idx = Math.min(M.idx, listOf(REALMS[M.tab]).length - 1); sfx('move'); return; }
    let i = M.idx;
    if (k.left) { if (i % 8 === 0) { M.tab = (M.tab + REALMS.length - 1) % REALMS.length; sfx('move'); return; } i--; }
    if (k.right) { if (i % 8 === 7 || i === n - 1) { M.tab = (M.tab + 1) % REALMS.length; M.idx = Math.min(i - (i % 8), listOf(REALMS[M.tab]).length - 1); sfx('move'); return; } i++; }
    if (k.down && i + 8 < n) i += 8;
    if (k.up && i >= 8) i -= 8;
    if (i !== M.idx) { M.idx = Math.max(0, Math.min(n - 1, i)); sfx('move'); }
    if (k.ok && ids[M.idx]) { if (locked(ids[M.idx])) { sfx('deny'); } else { M.confirm = true; sfx('select'); } }
    else if (k.back) { close(); sfx('back'); }
  }

  // ---- drawing ----
  function backdrop(ctx, col) {
    if (L && L.ui) return L.ui.backdrop(ctx, col);
    art.rect(ctx, '#05060c', 0, 0, W, H);
  }
  function choice(ctx, x, y, w, on1, title, sub, col) {
    ui.panel(ctx, x, y, w, 46, on1 ? col : '#3a3d55', on1 ? 0.95 : 0.75);
    if (on1) { ctx.globalAlpha = 0.18; art.rect(ctx, col, x + 1, y + 1, w - 2, 44); ctx.globalAlpha = 1; }
    txt(ctx, (on1 ? '> ' : '  ') + title, x + 10, y + 8, on1 ? '#ffffff' : '#8a92b8', { scale: 2 });
    txt(ctx, sub, x + 28, y + 30, on1 ? '#e8ecf4' : '#5a6078');
  }
  function drawMode(ctx) {
    backdrop(ctx, '#b48cff');
    txt(ctx, M.view === 'mode' ? 'NEW GAME' : 'CONTINUE', W / 2, 30, '#ffffff', { align: 'center', scale: 2 });
    txt(ctx, M.view === 'mode' ? 'Which story?' : 'Which save?', W / 2, 52, '#8a92b8', { align: 'center' });
    if (M.view === 'mode') {
      choice(ctx, 60, 76, 360, M.sel === 0, 'THE HOLLOW CROWN', 'NEW  -  all 64 heroes, a story of their own for each one', '#b48cff');
      choice(ctx, 60, 132, 360, M.sel === 1, 'THE FIRST STORY', 'Kael and Nyra\'s road, as it was first told', '#f5c542');
    } else {
      const s = SG.load() || {}, c = rawLoad() || {}, sh = HR[s.hero], ch = HR[c.hero];
      const sgL = sh ? sh.name + '  -  ' + (s.saga && s.saga.ch > 6 ? 'finished' : 'chapter ' + ((s.saga && s.saga.ch) || 1) + ' of 6') + '  -  level ' + (s.level || 1) : '';
      choice(ctx, 60, 76, 360, M.sel === 0, 'THE HOLLOW CROWN', sgL, '#b48cff');
      choice(ctx, 60, 132, 360, M.sel === 1, 'THE FIRST STORY', ch ? ch.name + '  -  level ' + (c.level || 1) : '', '#f5c542');
    }
    txt(ctx, 'W / S: choose    J or Enter: select    Esc: back', W / 2, 259, '#8a92b8', { align: 'center' });
  }
  function drawPro(ctx) {
    backdrop(ctx, '#b48cff');
    txt(ctx, 'THE HOLLOW CROWN', W / 2, 40, '#b48cff', { align: 'center', scale: 2 });
    const ln = PRO[M.page].split('\n'), nCh = Math.floor(M.t * 0.9);
    let left = nCh;
    ln.forEach((l, i) => { if (left > 0) txt(ctx, l.slice(0, left), W / 2 - tw(l) / 2, 104 + i * 14, '#ffffff', { raw: true }); left -= l.length; });
    txt(ctx, (M.page + 1) + ' / ' + PRO.length, W / 2, 226, '#5a6078', { align: 'center' });
    if (SW.frame % 40 < 26) txt(ctx, 'J / Enter: next    Esc: skip', W / 2, 250, '#8a92b8', { align: 'center' });
  }
  function drawPick(ctx) {
    const r = REALMS[M.tab], R0 = realm(r), ids = listOf(r), lu = L && L.ui;
    backdrop(ctx, R0.col);
    txt(ctx, 'THE HOLLOW CROWN', 10, 4, '#ffffff', { scale: 2 });
    txt(ctx, 'Choose who to play', W - 10, 9, '#8a92b8', { align: 'right' });
    REALMS.forEach((t, i) => {
      const Rr = realm(t), x = 10 + i * 116, onT = M.tab === i;
      ui.panel(ctx, x, 25, 112, 15, onT ? Rr.col : '#3a3d55', onT ? 0.95 : 0.7);
      if (onT) { ctx.globalAlpha = 0.28; art.rect(ctx, Rr.col, x + 1, 26, 110, 13); ctx.globalAlpha = 1; }
      txt(ctx, Rr.name, x + 56, 28, onT ? '#ffffff' : '#8a92b8', { align: 'center' });
    });
    ids.forEach((id, i) => {
      const hh = HR[id], c = i % 8, row = Math.floor(i / 8), x = 12 + c * 57, y = 44 + row * 58, sel = M.idx === i, lk = locked(id);
      ui.panel(ctx, x, y, 55, 56, sel ? hh.color : '#3a3d55', 0.85);
      if (lu) lu.face(ctx, id, x + 1, y + 1, 53, 45, lk ? 0.18 : sel ? 1 : 0.62);
      ctx.globalAlpha = 0.85; art.rect(ctx, '#05060c', x + 1, y + 46, 53, 9); ctx.globalAlpha = 1;
      const name = lu ? lu.nameOf(id) : hh.name;
      if (lu) lu.tightName(ctx, lk ? 'LOCKED' : name, x + 27, y + 46, sel ? hh.color : '#c8ccd8', 52); else txt(ctx, name, x + 27, y + 46, '#c8ccd8', { align: 'center' });
    });
    const id = ids[M.idx], hh = HR[id];
    if (!hh) return;
    const lk = locked(id), card = cardOf(id, 1);
    ui.panel(ctx, 10, 162, 460, 94, hh.color, 0.9);
    txt(ctx, lu ? lu.nameOf(id) : hh.name, 18, 166, hh.color, { scale: 2, raw: true });
    txt(ctx, hh.title, 18 + tw(lu ? lu.nameOf(id) : hh.name) * 2 + 10, 172, hh.colorHi || '#ffffff');
    if (lk) {
      txt(ctx, 'The villain\'s storyline: the Director, who becomes the Convergence.', 18, 190, '#e8ecf4');
      txt(ctx, 'Finish The Hollow Crown once, with any hero, to play it.', 18, 204, '#f5c542');
    } else {
      txt(ctx, 'CHAPTER 1  -  ' + card[0].toUpperCase() + '  -  ' + card[1], 18, 188, '#8a92b8');
      let y = 200; SW.wrap(card[2], 440).slice(0, 2).forEach(l => { txt(ctx, l, 18, y, '#e8ecf4', { raw: true }); y += 10; });
      const c3 = chap(id, 3), c5 = chap(id, 5);   // (both from the rewritten lines)
      txt(ctx, 'Rival: ' + nm(c3.rival) + '     The Big War: ' + nm(c5.foe), 18, 226, '#c8ccd8');
    }
    if (M.confirm) {
      ui.panel(ctx, 120, 96, 240, 50, hh.color, 0.97);
      txt(ctx, 'Play ' + hh.name + '\'s story?', W / 2, 106, '#ffffff', { align: 'center' });
      txt(ctx, 'J: begin    Esc: back', W / 2, 126, '#8a92b8', { align: 'center' });
    }
    txt(ctx, M.confirm ? '' : 'Arrows: choose    U / I: realm    J: play    Esc: back', W / 2, 259, '#8a92b8', { align: 'center' });
  }
  function draw(ctx) { if (M.view === 'pro') drawPro(ctx); else if (M.view === 'pick') drawPick(ctx); else drawMode(ctx); }

  // the keys: while a screen of this file is open it owns them
  const _iu = I.update;
  I.update = function () {
    if (M.held) I.now = M.held;
    const out = _iu.apply(this, arguments);
    M.held = null;
    if (!M.open && G.scene === 'title' && !G.overlay && !(SW.stories && SW.stories.open) && I.ok()) {
      const it = ui.titleItems(G)[ui.title.sel], a = it && it[1];
      if (a === 'new') open('pro');
      else if (a === 'continue' && SG.load()) { M.held = I.now; I.now = {}; continueSaga(); return out; }
    }
    // nothing reaches the first story's hero select or prologue any more; if anything still tries, it gets this story's
    if (!M.open && (G.scene === 'select' || G.scene === 'prologue')) { G.scene = 'title'; open('pro'); }
    if (M.open) {
      try { update(); } catch (e) { console.error(e); M.open = false; }
      M.held = I.now; I.now = {};
    }
    return out;
  };
  const _dt = ui.drawTitle;
  ui.drawTitle = function (ctx, g) { _dt.apply(this, arguments); if (M.open) draw(ctx); };
})();
