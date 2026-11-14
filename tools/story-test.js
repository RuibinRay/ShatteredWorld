// Story play-test bot. Load after tools/harness.js (browser console, or a <script> tag):
//   ST.tutorial('fenn')   play a hero's own Act 1 tutorial with real inputs, start to exit; reports where it ended
//   ST.act2('pyra')       play Act 2 (Scrapton -> Ash Dunes -> Glowwild) as that hero, including their secret
//   ST.all()              every hero's tutorial, then Act 2 as every hero
// The bot walks, jumps at ledges, climbs, air-dashes over pits, presses E on anything it can use and fires the
// hero's skill at locks. Fights are resolved instantly: it checks that the road can be WALKED, not the balance.
// It never writes the save slot or the unlock profile.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, T = window.T;
  SW.store.save = () => true; G.achieve = () => {}; SW.saveProfile = () => {};   // the bot never writes the save slot or the unlock profile (finished tutorials are recorded there)
  const ST = window.ST = {};
  const boot = hero => { G.lastError = null; G.newGame(hero); T.step(30); T.skip(); T.step(10); };
  // o: { dir, until(G), max }
  ST.nav = function (o) {
    o = o || {};
    const z0 = G.state.zone, dir = o.dir || 1, used = new Set(), slow = {};
    let best = -1e9, idle = 0, jump = 0, deaths = 0, i = 0;
    for (; i < (o.max || 14000); i++) {
      const p = G.player, z = G.zone, S = G.state;
      if (S.zone !== z0 || (o.until && o.until(G))) break;
      if (SW.ui.dlg.active || G.overlay) { T.hold([]); T.skip(); continue; }
      if (p.dead) { deaths++; T.hold([]); T.step(130); best = -1e9; continue; }
      if (z.ents.some(e => e.team === 'enemy' && !e.dead && Math.abs(e.x - p.x) < 440)) z.ents.forEach(e => { if (e.team === 'enemy' && !e.dead) { e.hp = 0; e.die(G, {}); } });
      S.energy = 300;
      const pe = G.promptEnt;
      if (pe && p.onGround && !used.has(pe) && !(o.skip && o.skip(pe))) { used.add(pe); T.hold([]); T.step(2); T.press('interact', 2); T.step(3); continue; }
      const keys = [dir > 0 ? 'right' : 'left'], fy = Math.floor((p.y + 1) / 16), tx = Math.floor(p.x / 16);
      const solid = (x, y) => { const c = z.tile(x, y); return c === '#' || c === '=' || (c === 'H' && z.tile(x, y - 1) !== 'H'); };
      const pit = x => { for (let y = fy; y < z.h; y++) if (solid(x, y)) return false; return true; };
      if (p.x * dir > best + 2) { best = p.x * dir; idle = 0; } else idle++;
      if (idle > 8) slow[tx] = (slow[tx] || 0) + 1;
      if (p.state === 'climb') { keys.length = 0; keys.push('up'); }
      else if (p.onGround) {
        const ph = idle % 150;
        if (idle > 8 && z.tile(tx, Math.floor((p.y - 10) / 16)) === 'H' && ph < 50) { keys.length = 0; keys.push('up'); }
        else if (idle > 8 && (ph === 9 || ph === 40)) jump = 20;
        else if (idle > 8 && ph >= 70 && ph < 120) { if (i % 7 < 2) keys.push('attack'); }
        else if (idle > 8 && ph === 130) keys.push('skill');
        else if (idle <= 8 && !solid(Math.floor((p.x + dir * 12) / 16), fy)) jump = 20;
      } else if (p.vy > 0.5 && !p.airDash && pit(tx) && pit(tx + dir)) keys.push('dash');
      if (jump > 0) { keys.push('jump'); jump--; }
      T.hold(keys); G.tick();
    }
    T.hold([]);
    return { zone: G.state.zone, tx: G.player ? +(G.player.x / 16).toFixed(1) : null, frames: i, deaths, stuck: Object.keys(slow).filter(k => slow[k] > 200).map(k => k + ':' + slow[k]) };
  };
  ST.tutorial = function (hero) {
    boot(hero);
    const from = G.state.zone, r = ST.nav();
    return Object.assign({ hero, from, mission: G.state.mission, done: Object.keys(G.state.done).join(','), skill: Object.keys(G.state.abilities).join(','), memory: (D.memories[G.route() + '_1'] || {}).title, hp: Math.round(G.state.hp), err: G.lastError }, r);
  };
  const useAt = (tx, ty) => { T.tp(tx, ty === undefined ? 19 : ty); T.step(4); T.press('interact', 2); T.step(6); const n = T.skip(); T.step(6); T.skip(); return n; };
  const thing = f => G.zone.ents.find(f);
  ST.act2 = function (hero) {
    const log = [], S = () => G.state, sec = SW.story.mine(hero)[0], sd = SW.story.secrets[sec];
    boot(hero);
    const h = G.hero();
    ['double_jump', h.kit[0], h.kit[1], h.kit[2]].forEach(a => G.unlock(a, true));
    S().level = 7; S().hp = G.player.hpMax(); S().mission = 'A2-1'; G.setFlag('name_known');
    T.warp('scrapton', 'hatch'); T.step(20); T.skip();
    T.tp(84, 19); T.hold(['right']); T.step(40); T.hold([]);          // walk in through the town gate
    log.push('scrapton board early: ' + useAt(108));
    log.push('marlo lines=' + useAt(102) + ' mission=' + S().mission + ' card=' + G.flag('card:act1'));
    log.push('board lines=' + useAt(108) + ' step=' + !!S().steps['A2-2:board']);
    T.tp(1, 19); T.hold(['left']); T.step(60); T.hold([]); T.skip(); T.step(20); T.skip();
    log.push('west exit -> ' + S().zone);
    const want = id => sd.zone === (id === 'dunes' ? 'Ash Dunes' : 'Glowwild') ? sec : null;
    const secret = () => {
      if (sd.kind === 'map') {
        const sp = thing(e => e.prompt && /boulder|ice|Hollow|Choir/.test(e.prompt)); useAt(Math.floor(sp.x / 16)); useAt(Math.floor(sp.x / 16)); T.step(60); T.skip();
        const zone = S().zone, r = ST.nav({ until: g => !!g.state.secrets[sec] }); T.step(30); T.skip();
        const back = ST.nav({ dir: -1 }); T.step(40); T.skip();
        return 'map ' + zone + ' reached@' + r.tx + ' found=' + !!S().secrets[sec] + ' back=' + back.zone + '@' + back.tx;
      }
      return sd.kind + ' found=' + !!S().secrets[sec];
    };
    let r = ST.nav({ dir: -1, until: g => g.player.x < 19 * 16, skip: e => /boulder|Hollow/.test(e.prompt || '') });
    log.push('dunes nav ' + JSON.stringify(r) + ' camp=' + !!S().steps['A2-2:camp'] + ' boss=' + !!S().steps['A2-2:boss'] + ' filter=' + G.flag('rad_filter'));
    if (want('dunes')) log.push('secret ' + sec + ': ' + secret() + ' hpBonus=' + S().hpBonus);
    T.warp('scrapton', 'west'); T.step(10);
    log.push('marlo back lines=' + useAt(102) + ' mission=' + S().mission);
    T.tp(178, 19); T.hold(['right']); T.step(60); T.hold([]); T.skip(); T.step(20); T.skip();
    log.push('east exit -> ' + S().zone);
    r = ST.nav({ until: g => g.state.done['A2-3'] || g.player.x > 216 * 16, skip: e => /ice|Choir/.test(e.prompt || '') });
    T.step(40); T.skip();
    log.push('glowwild nav ' + JSON.stringify(r) + ' steps=' + ['enter', 'scout', 'relay', 'boss', 'shard'].map(k => k[0] + (S().steps['A2-3:' + k] ? '+' : '-')).join('') + ' mission=' + S().mission + ' card=' + G.flag('card:act2'));
    log.push('memory 4 "' + D.memories[G.route() + '_4'].title + '" traversal=' + !!S().abilities[h.kit[3]]);
    if (want('glowwild')) log.push('secret ' + sec + ': ' + secret() + ' hpBonus=' + S().hpBonus);
    log.push('secret found=' + !!S().secrets[sec] + ' (' + sd.kind + ') err=' + G.lastError);
    return log;
  };
  // ----- Act 2 finale: the Crater (story-crater.js). Starts with Act 2's first chapter already done, walks out of the
  // Glowwild and across the Crater with real inputs, then settles the rival duel by force: result 'win' (default)
  // knocks the rival out, 'lose' knocks the player out and gives up the duel. Both must end the act.
  ST.crater = function (hero, result) {
    const log = [], S = () => G.state, V = SW.versus, C = SW.story.crater;
    boot(hero);
    const h = G.hero();
    ['double_jump'].concat(h.kit.slice(0, 4)).forEach(a => G.unlock(a, true));
    ['A2-1', 'A2-2', 'A2-3'].forEach(m => { S().done[m] = true; });
    ['name_known', 'rad_filter', 'relay_off', 'glow_in', 'arena:glowwild:mother'].forEach(f => G.setFlag(f));
    S().level = 10; S().hp = G.player.hpMax(); S().mission = 'A2-4';
    T.warp('glowwild', 'west'); T.step(20); T.skip();
    T.tp(218, 19); T.hold(['right']); T.step(70); T.hold([]); T.skip(); T.step(20); T.skip();
    log.push('glowwild east exit -> ' + S().zone + ' enter=' + !!S().steps['A2-4:enter']);
    if (S().zone !== 'crater') return log;
    const r = ST.nav({ until: g => g.scene !== 'play', max: 12000 });
    log.push('crater nav ' + JSON.stringify(r) + ' post=' + !!S().steps['A2-4:post'] + ' tracks=' + G.flag('crater_tracks') + ' troopers=' + G.flag('crater_troopers'));
    if (G.scene !== 'vs' || V.mode !== 'duel') { log.push('NO DUEL: scene=' + G.scene + ' err=' + G.lastError); return log; }
    const rv = V.f[1].hero;
    log.push('duel: rival=' + rv + ' drawn as ' + D.heroes[rv].sheet + ' named "' + D.heroes[rv].name + '" veil=' + C.veiled());
    T.hold([]); T.step(100);                                   // intro -> fight
    const lose = result === 'lose', f = V.f[lose ? 0 : 1];
    f.state.hp = 1; f.burnD = 9999; f.burnT = 31; T.step(40);  // one tick of burn settles it
    log.push('ko: phase=' + V.phase + ' winner=' + V.winner);
    T.step(140);
    if (lose) { log.push('defeat screen: ' + V.phase); T.press('pause', 2); T.step(4); } else T.step(130);
    T.step(50);
    log.push('after duel: scene=' + G.scene + ' talking=' + SW.ui.dlg.active + ' flag=' + G.state.flags.crater_duel + ' veil=' + C.veiled() + ' rival sheet back=' + D.heroes[rv].sheet + '/' + D.heroes[rv].name);
    T.skip(); T.step(20); T.skip();
    log.push('duel step=' + !!S().steps['A2-4:duel'] + ' creds=' + S().creds + ' points=' + S().points);
    const r2 = ST.nav({ until: g => !!g.state.steps['A2-4:rift'], max: 3000 });
    T.step(20); T.skip(); T.step(10);
    log.push('rift nav ' + JSON.stringify(r2) + ' rift=' + !!S().steps['A2-4:rift'] + ' done=' + !!S().done['A2-4'] + ' mission=' + S().mission + ' card=' + G.flag('card:act2end') + ' err=' + G.lastError);
    return log;
  };
  ST.craterAll = function () {
    const out = {};
    D.heroOrder.forEach((h, i) => { try { out[h] = ST.crater(h, i % 2 ? 'lose' : 'win'); } catch (e) { out[h] = 'THREW ' + (e && e.stack || e); } });
    return out;
  };
  // ----- Act 3, part 1 (story-act3.js): from the end of Act 2 to the Pit pledge. Fights are resolved instantly. -----
  ST.act3 = function (hero) {
    const log = [], S = () => G.state;
    boot(hero);
    ['double_jump'].concat(G.hero().kit.slice(0, 4)).forEach(a => G.unlock(a, true));
    ['A2-1', 'A2-2', 'A2-3', 'A2-4'].forEach(m => { S().done[m] = true; });
    ['name_known', 'rad_filter', 'relay_off', 'glow_in', 'arena:glowwild:mother', 'crater_in', 'veil_read', 'arena:crater:post', 'card:act2end'].forEach(f => G.setFlag(f));
    G.setFlag('crater_duel', 'win'); ['enter', 'post', 'duel', 'rift'].forEach(s => { S().steps['A2-4:' + s] = true; });
    S().level = 12; S().hp = G.player.hpMax(); S().mission = 'A3-1';
    T.warp('crater', 'floor'); T.step(20); T.skip();
    let r = ST.nav({ dir: -1, until: g => g.flag('veil_down'), max: 9000 }); T.step(10); T.skip();
    log.push('crater west ' + JSON.stringify(r) + ' arena=' + G.flag('arena:crater:mast') + ' mast=' + !!S().steps['A3-1:mast']);
    r = ST.nav({ until: g => !!g.state.steps['A3-1:meet'], max: 6000 }); T.step(10); T.skip(); T.step(10); T.skip();
    log.push('crater east ' + JSON.stringify(r) + ' meet=' + !!S().steps['A3-1:meet'] + ' assist=' + S().assist + ' partner=' + SW.data.speakers.partner.name);
    T.warp('scrapton', 'west'); T.step(20); T.skip();
    log.push('marlo lines=' + useAt(102) + ' council=' + !!S().steps['A3-1:council'] + ' mission=' + S().mission + ' shaft=' + G.flag('shaft_open'));
    log.push('partner npc lines=' + useAt(98));
    T.warp('pit', 'door'); T.step(30); T.skip(); T.step(10);
    log.push('pit enter deep=' + !!S().steps['A3-2:deep']);
    log.push('bookie lines=' + useAt(6, 13) + ' melee=' + (G.melee ? G.melee.state : 'none'));
    let i = 0, champ = false, waves = 0;
    for (; i < 8000 && G.melee; i++) {
      if (SW.ui.dlg.active || G.overlay) { T.skip(); continue; }
      if (G.player.dead) { log.push('DIED'); break; }
      if (G.melee.boss) champ = true;
      if (G.melee.state === 'fight') waves = Math.max(waves, G.melee.wave + 1);
      G.zone.ents.forEach(e => { if (e.team === 'enemy' && !e.dead) { e.hp = 0; e.die(G, {}); } });
      G.tick();
    }
    T.step(20); T.skip(); T.step(10); T.skip();
    log.push('melee frames=' + i + ' champ=' + champ + ' waves=' + waves + ' steps=' + ['deep', 'champ', 'gauntlet', 'pledge'].map(k => k[0] + (S().steps['A3-2:' + k] ? '+' : '-')).join('') + ' done=' + !!S().done['A3-2'] + ' mission=' + S().mission + ' card=' + G.flag('card:act3a') + ' assists=' + S().assists.join(','));
    // call each assist once next to an enemy
    ['partner', 'anvil'].forEach(a => {
      S().assist = a; G.player.assistCd = 0; S().awaken = 0;
      const e = G.zone.enemy('thug', Math.floor(G.player.x / 16) + 3, 13, { hp: 400 }); T.step(2); const hp0 = e.hp;
      T.press('awaken', 2); T.step(40);
      log.push('assist ' + a + ': hit for ' + Math.round(hp0 - e.hp) + ' cd=' + G.player.assistCd);
      e.hp = 0; e.die(G, {}); T.step(5);
    });
    log.push('err=' + G.lastError);
    return log;
  };
  // ----- A3-3, the Skylift (story-skylift.js): from Scrapton to the Skyport. Fights are resolved instantly. -----
  ST.skylift = function (hero) {
    const log = [], S = () => G.state;
    boot(hero);
    ['double_jump'].concat(G.hero().kit.slice(0, 4)).forEach(a => G.unlock(a, true));
    ['A2-1', 'A2-2', 'A2-3', 'A2-4', 'A3-1', 'A3-2'].forEach(m => { S().done[m] = true; });
    ['name_known', 'rad_filter', 'shaft_open', 'veil_down', 'card:act3a'].forEach(f => G.setFlag(f));
    S().assists = ['partner', 'anvil']; S().assist = 'partner';
    S().level = 13; S().hp = G.player.hpMax(); S().mission = 'A3-3';
    T.warp('scrapton', 'west'); T.step(20); T.skip();
    log.push('marlo lines=' + useAt(102));
    log.push('road door lines=' + useAt(134) + ' zone=' + S().zone);
    T.step(30); T.skip(); T.step(10); T.skip();
    log.push('enter road=' + !!S().steps['A3-3:road']);
    const r = ST.nav({ until: g => !!g.state.steps['A3-3:top'] || g.player.x > 106 * 16, max: 16000 });
    T.step(20); T.skip(); T.step(10); T.skip();
    log.push('lift nav ' + JSON.stringify(r) + ' steps=' + ['road', 'gate', 'ride', 'top'].map(k => k[0] + (S().steps['A3-3:' + k] ? '+' : '-')).join('') + ' done=' + !!S().done['A3-3'] + ' mission=' + S().mission + ' card=' + G.flag('card:act3b'));
    const r2 = ST.nav({ max: 3000 }); T.step(30); T.skip(); T.step(10);
    log.push('off the lift -> ' + S().zone + '@' + (G.player ? Math.round(G.player.x / 16) : '?') + ' brandt arena flagged=' + G.flag('arena:skyport:brandt') + ' boss=' + (G.boss ? G.boss.def.name : 'none'));
    log.push('err=' + G.lastError);
    return log;
  };
  // ----- A3-4, the Noble Ring (story-noble.js): from the Skyport to Vane joining. Fights are resolved instantly. -----
  ST.noble = function (hero) {
    const log = [], S = () => G.state;
    boot(hero);
    ['double_jump'].concat(G.hero().kit.slice(0, 4)).forEach(a => G.unlock(a, true));
    ['A2-1', 'A2-2', 'A2-3', 'A2-4', 'A3-1', 'A3-2', 'A3-3'].forEach(m => { S().done[m] = true; });
    ['name_known', 'shaft_open', 'veil_down', 'card:act3a', 'card:act3b'].forEach(f => G.setFlag(f));
    S().assists = ['partner', 'anvil']; S().assist = 'partner';
    S().level = 14; S().hp = G.player.hpMax(); S().mission = 'A3-4';
    T.warp('skyport', 'lift'); T.step(20); T.skip();
    let r = ST.nav({ max: 4000 }); T.step(30); T.skip(); T.step(10); T.skip();
    log.push('skyport east -> ' + S().zone + ' ' + JSON.stringify(r) + ' enter=' + !!S().steps['A3-4:enter']);
    if (S().zone !== 'noble') return log;
    r = ST.nav({ until: g => !!g.state.steps['A3-4:vane'], max: 20000 }); T.step(20); T.skip(); T.step(10); T.skip();
    log.push('ring nav ' + JSON.stringify(r) + ' relays=' + ['a', 'b', 'c'].map(k => G.flag('relay_' + k) ? k : '-').join('') + ' count=' + (S().counts['A3-4:chips'] || 0) + ' steps=' + ['enter', 'chips', 'prefect', 'vane'].map(k => k[0] + (S().steps['A3-4:' + k] ? '+' : '-')).join('')
      + ' done=' + !!S().done['A3-4'] + ' mission=' + S().mission + ' card=' + G.flag('card:act3c') + ' assists=' + S().assists.join(','));
    S().assist = 'vane'; G.player.assistCd = 0; S().awaken = 0;
    const e = G.zone.enemy('thug', Math.floor(G.player.x / 16) + 4, 19, { hp: 400 }); T.step(2); const hp0 = e.hp; G.player.face = 1;
    T.press('awaken', 2); T.step(60);
    log.push('assist vane: hit for ' + Math.round(hp0 - e.hp));
    log.push('err=' + G.lastError);
    return log;
  };
  // ----- A3-5, the Spire (story-spire.js): from the Chancery to the core key. Fights are resolved instantly. -----
  ST.spire = function (hero) {
    const log = [], S = () => G.state;
    boot(hero);
    ['double_jump'].concat(G.hero().kit.slice(0, 4)).forEach(a => G.unlock(a, true));
    ['A2-1', 'A2-2', 'A2-3', 'A2-4', 'A3-1', 'A3-2', 'A3-3', 'A3-4'].forEach(m => { S().done[m] = true; });
    ['name_known', 'shaft_open', 'veil_down', 'card:act3a', 'card:act3b', 'card:act3c', 'relay_a', 'relay_b', 'relay_c'].forEach(f => G.setFlag(f));
    S().assists = ['partner', 'anvil', 'vane']; S().assist = 'vane';
    S().level = 15; S().hp = G.player.hpMax(); S().mission = 'A3-5';
    T.warp('noble', 'spire'); T.step(20); T.skip();
    log.push('chancery door lines=' + useAt(166) + ' zone=' + S().zone);
    T.step(30); T.skip(); T.step(10); T.skip();
    log.push('enter gate=' + !!S().steps['A3-5:gate']);
    const r = ST.nav({ until: g => !!g.state.steps['A3-5:key'], max: 30000 }); T.step(20); T.skip(); T.step(10); T.skip();
    log.push('spire nav ' + JSON.stringify(r) + ' floors=' + [1, 2, 3, 4, 5, 6].filter(n => G.flag('spire_f' + n)).join('') + ' steps=' + ['gate', 'ledger', 'morrow', 'kessen', 'key'].map(k => k[0] + (S().steps['A3-5:' + k] ? '+' : '-')).join('')
      + ' done=' + !!S().done['A3-5'] + ' mission=' + S().mission + ' card=' + G.flag('card:act3d'));
    log.push('err=' + G.lastError);
    return log;
  };
  // ----- A3-6, the Engine core (story-finale.js): the three phases and the ending. Fights are resolved instantly. -----
  //   minor: how many minor shards the hero holds (60 shows the secret ending card too)
  ST.finale = function (hero, minor) {
    const log = [], S = () => G.state;
    boot(hero);
    ['double_jump'].concat(G.hero().kit.slice(0, 4)).forEach(a => G.unlock(a, true));
    ['A2-1', 'A2-2', 'A2-3', 'A2-4', 'A3-1', 'A3-2', 'A3-3', 'A3-4', 'A3-5'].forEach(m => { S().done[m] = true; });
    ['name_known', 'veil_down', 'card:act3a', 'card:act3b', 'card:act3c', 'card:act3d'].forEach(f => G.setFlag(f));
    S().assists = ['partner', 'anvil', 'vane']; S().assist = 'partner'; S().minor = minor || 0;
    S().level = 16; S().hp = G.player.hpMax(); S().mission = 'A3-6';
    T.warp('spire', 'top'); T.step(20); T.skip();
    log.push('core door lines=' + useAt(240) + ' zone=' + S().zone);
    T.step(30); T.skip();
    const seen = new Set(); let i = 0, ult = false, calls = 0, cards = [];
    for (; i < 20000; i++) {
      const m = G.finale;
      if (m) seen.add(m.state);
      if (m && m.state === 'done') break;
      if (G.overlay === 'card') { cards.push(G.card); T.skip(); continue; }
      if (SW.ui.dlg.active) { T.skip(); continue; }
      if (m && m.state === 'p3') { if (G.has(G.hero().ultimate)) ult = true; }
      if (!m) { T.hold(['right']); G.tick(); continue; }
      T.hold([]);
      const n0 = G.zone.ents.length;
      G.zone.ents.forEach(e => { if (e.team === 'enemy' && !e.dead && e.isBoss !== undefined) { e.hp = 0; e.die(G, {}); } else if (e.team === 'enemy' && !e.dead) { e.hp = 0; e.die(G, {}); } });
      G.tick();
      if (m && m.state === 'p3' && G.zone.ents.length > n0) calls++;
    }
    T.hold([]); T.step(10);
    log.push('finale frames=' + i + ' phases=' + Array.from(seen).join(',') + ' ultimate=' + ult + ' steps=' + ['descend', 'director', 'reverse'].map(k => k[0] + (S().steps['A3-6:' + k] ? '+' : '-')).join('')
      + ' done=' + !!S().done['A3-6'] + ' mission=' + S().mission + ' cards=' + Array.from(new Set(cards)).join(',') + ' secret=' + G.flag('card:secret'));
    log.push('err=' + G.lastError);
    return log;
  };
  // ----- the rival duel, fought for real against the Versus bot (the story's own settings, story-crater.js) -----
  //   mash     walks up and hammers attack; never guards                         -> should LOSE most of the time
  //   careful  guards the rival's attacks, punishes a stunned rival, uses skills  -> should WIN most of the time
  // ST.duelTrial(hero, bot, { lvl, kit, over }) fights once; `over` overrides the duel settings for experiments.
  // ST.duelBench(heroes?, n?, over?) runs n fights per bot and reports wins, health left and length.
  const VK = { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', attack: 'KeyJ', jump: 'KeyK', dash: 'KeyL', skill: 'KeyU', special: 'KeyI', awaken: 'KeyO' };
  const vhold = keys => { const R = SW.input.raw; Object.keys(VK).forEach(a => { R[VK[a]] = false; }); keys.forEach(a => { R[VK[a]] = true; }); };
  ST.duelTrial = function (hero, bot, o) {
    o = o || {};
    const V = SW.versus;
    boot(hero);
    ['double_jump'].concat(G.hero().kit.slice(0, o.kit || 4)).forEach(a => G.unlock(a, true));
    G.state.level = o.lvl || 10; G.setFlag('name_known');
    if (o.stats) Object.assign(G.state.stats, o.stats);        // e.g. { power: 9 }: stat points the player has spent
    let result = null;
    if (!SW.story.crater.begin(r => { result = r; }, o.over)) return { err: 'the duel did not start' };
    const hp0 = [V.f[0].state.hp, V.f[1].state.hp];
    let i = 0, last = [hp0[0], hp0[1]], guards = 0, mine = 0, theirs = 0, was = [false, false];   // perfect blocks: mine stun the rival, theirs stun me
    for (; i < (o.max || 7200) && result === null; i++) {
      if (V.phase === 'duelLost') { vhold([]); T.press('pause', 2); continue; }             // fell: give up, so the fight counts once
      if (V.phase !== 'fight') { vhold([]); G.tick(); continue; }
      const me = V.f[0], it = V.f[1], p = me.p, q = it.p, S = me.state, dx = q.x - p.x, adx = Math.abs(dx), to = dx > 0 ? 'right' : 'left', facing = (dx > 0 ? 1 : -1) === p.face, keys = [];
      last = [S.hp, it.state.hp];
      if (it.stunT > 0 && !was[1]) mine++; if (me.stunT > 0 && !was[0]) theirs++; was = [me.stunT > 0, it.stunT > 0];
      const qAtk = ['attack', 'airatk', 'rush', 'wave', 'cast', 'ult'].indexOf(q.state) >= 0;
      const press = () => { if (adx > 26 || !facing) keys.push(to); if (i % 7 < 2) keys.push('attack'); };
      if (bot !== 'careful') press();
      else if (it.stunT > 8) press();                                                           // a perfect block: punish it
      else if (qAtk && adx < 84 && p.onGround) { keys.push('down'); guards++; }                 // guard what is coming
      else if (p.state === 'hurt' && S.energy >= 60 && i % 24 === 0) keys.push('down', 'dash');  // slip out of a combo
      else if (adx > 110 && S.energy >= 25 && i % 45 < 3) { if (!facing) keys.push(to); else keys.push('skill'); }
      else if (adx > 50 && adx <= 110 && S.energy >= 50 && i % 80 < 3) { if (!facing) keys.push(to); else keys.push('special'); }
      else press();
      vhold(keys); G.tick();
    }
    vhold([]);
    if (result === null) { const f = V.f[0]; f.state.hp = 1; f.burnD = 9999; f.burnT = 31; for (let k = 0; k < 400 && result === null; k++) { if (V.phase === 'duelLost') T.press('pause', 2); else G.tick(); } result = 'timeout'; }
    return { result, sec: Math.round(i / 60), me: Math.round(100 * Math.max(0, last[0]) / hp0[0]), rival: Math.round(100 * Math.max(0, last[1]) / hp0[1]), perfects: mine, stunned: theirs, guards, err: G.lastError };
  };
  ST.duelBench = function (heroes, n, over, stats) {
    n = n || 6;
    return (heroes || D.heroOrder).map(h => {
      const row = { hero: h };
      ['mash', 'careful'].forEach(bot => {
        let wins = 0, me = 0, rival = 0, sec = 0, perf = 0, stun = 0, to = 0, err = null;
        for (let i = 0; i < n; i++) { const r = ST.duelTrial(h, bot, { over, stats }); if (r.err) { err = r.err; continue; } if (r.result === 'win') { wins++; me += r.me; } else { rival += r.rival; if (r.result === 'timeout') to++; } sec += r.sec; perf += r.perfects; stun += r.stunned; }
        row[bot] = wins + '/' + n + ' won' + (wins ? ', ' + Math.round(me / wins) + '% health left' : '') + (wins < n ? ', rival at ' + Math.round(rival / (n - wins)) + '% when lost' : '') + ', ' + Math.round(sec / n) + 's, perfect blocks ' + (perf / n).toFixed(1) + ' made / ' + (stun / n).toFixed(1) + ' suffered' + (to ? ', ' + to + ' timeouts' : '') + (err ? ' ERR ' + err : '');
      });
      return row;
    });
  };
  // ----- moves (js/moves.js): every skill fired, and every combo route tried, on a Training dummy that stands still -----
  // ST.fire(hero)    throws each move once from close range: hits, damage, and whether anything broke
  // ST.combo(hero)   J J J cancelled into each skill: does the skill land while the dummy is still reeling?
  // ST.movesAll()    both, for every hero
  const train = hero => {
    const V = SW.versus, I = SW.input, ok = I.ok, hit = I.hit;
    G.lastError = null; V.open(G); V.mode = 'train'; V.phase = 'pick'; V.step = 1; V.pick = [D.heroOrder.indexOf(hero), D.heroOrder.indexOf('brakk')];
    I.ok = () => true; I.hit = () => false; try { V.update(G); } finally { I.ok = ok; I.hit = hit; }
    V.dummy = 0; V.endless = true;
    return V;
  };
  const face = V => { const p = V.f[0].p, q = V.f[1].p; for (let i = 0; i < 200 && Math.abs(q.x - p.x) > 30; i++) { vhold([q.x > p.x ? 'right' : 'left']); G.tick(); } vhold([q.x > p.x ? 'right' : 'left']); G.tick(); vhold([]); for (let i = 0; i < 20; i++) G.tick(); };
  const rest = V => { vhold([]); const f = V.f[0], d = V.f[1]; for (let i = 0; i < 110; i++) G.tick(); f.p.cd = {}; d.cm = null; d.state.hp = d.p.hpMax ? d.state.hp : d.state.hp; };
  const MOVES = [['U', ['skill']], ['W+U', ['up', 'skill']], ['S+U', ['down', 'skill']], ['I', ['special']], ['S+I', ['down', 'special']], ['W+I', ['up', 'special']], ['S+O', ['down', 'awaken']]];
  ST.fire = function (hero) {
    const V = train(hero), out = { hero };
    if (G.scene !== 'vs' || V.phase !== 'fight' || !V.f || V.f[0].hero !== hero) return { hero, err: 'training did not start (' + G.scene + '/' + V.phase + ')' };
    MOVES.forEach(m => {
      face(V); rest(V); face(V);
      const d = V.f[1], p = V.f[0].p, hp0 = d.state.hp, e0 = V.f[0].state.energy; let hits = 0, low = hp0, spent = false, mode = false;
      for (let i = 0; i < 150; i++) { vhold(i < 3 ? m[1] : []); G.tick(); if (V.f[0].state.energy < e0 - 1) spent = true; if (p.modeT > 0) mode = true; if (d.cm) hits = Math.max(hits, d.cm.hits); low = Math.min(low, d.state.hp); if (i === 3) e0 > 0; }
      out[m[0]] = (m[0] === 'S+O' ? (mode ? 'mode on' : 'NO MODE') : hits + ' hits ' + Math.round(hp0 - low) + ' dmg') + (G.lastError ? ' ERR ' + G.lastError : '');
      G.lastError = null; p.modeT = 0;
    });
    vhold([]);
    return out;
  };
  // J J J, then the skill the moment the third hit connects. linked = the skill added hits to the same combo.
  ST.combo = function (hero) {
    const out = { hero };
    [['J x4', null], ['JJJ > U', ['skill']], ['JJJ > S+U', ['down', 'skill']], ['JJJ > I', ['special']], ['JJJ > S+I', ['down', 'special']]].forEach(r => {
      const V = train(hero);
      if (G.scene !== 'vs' || V.phase !== 'fight') { out[r[0]] = 'no training'; return; }
      face(V);
      const f = V.f[0], p = f.p, d = V.f[1]; let cm = null, resets = 0, before = 0, max = 0, fired = -1, e0 = 0;
      for (let i = 0; i < 260; i++) {
        const keys = [];
        if (fired < 0) {
          if (r[1] && p.state === 'attack' && p.combo >= 3 && p.connected) { fired = i; before = d.cm ? d.cm.hits : 0; e0 = f.state.energy; }
          else if (i % 6 < 2 && i < 120) keys.push('attack');
        }
        if (fired >= 0) r[1].forEach(k => { if (i - fired < (k === 'down' || k === 'up' ? 16 : 6)) keys.push(k); });   // the direction is held a little longer than the button, as a hand does
        vhold(keys); G.tick();
        if (d.cm && d.cm !== cm) { if (cm) resets++; cm = d.cm; }
        if (d.cm) max = Math.max(max, d.cm.hits);
      }
      vhold([]);
      out[r[0]] = !r[1] ? max + ' hits' + (resets ? ' (dropped ' + resets + 'x)' : '') : fired < 0 ? 'never reached the third hit' : (max > before && !resets ? 'linked ' : max > before ? 'DROPPED ' : 'no hit ') + before + '>' + max + (G.lastError ? ' ERR ' + G.lastError : '');
      G.lastError = null;
    });
    return out;
  };
  ST.movesAll = function (heroes) { return (heroes || D.heroOrder).map(h => { try { return { fire: ST.fire(h), combo: ST.combo(h) }; } catch (e) { return { hero: h, threw: String(e && e.stack || e).slice(0, 300) }; } }); };
  // ----- boss balance: the same two scripted players the original bosses were tuned against (T.fight in harness.js) -----
  //   mash     walks up and hammers attack; never guards, dodges or heals   -> should LOSE most of the time
  //   careful  guards telegraphs, slipsteps what cannot be blocked, heals   -> should WIN with roughly 30-45% health lost
  // ST.bosses() lists every boss with the hero and level that meets it; ST.bench(names?, n?) runs n fights per bot.
  ST.bosses = function () {
    const out = [{ name: 'tusk', hero: 'kael', zone: 'slums', arena: 'tusk', lvl: 2 }, { name: 'warden', hero: 'nyra', zone: 'medlab', arena: 'warden', lvl: 2 }];
    D.heroOrder.forEach(h => { const t = SW.story.tutorials[h]; if (t) out.push({ name: t.boss, hero: h, zone: t.zone, arena: 'boss', lvl: 2 }); });
    ['kael', 'nyra', 'bando', 'aldric'].forEach(h => out.push({ name: 'baron/' + h, hero: h, zone: 'dunes', arena: 'baron', lvl: 7, kit: 3, left: true }));
    ['kael', 'nyra', 'orin', 'vega'].forEach(h => out.push({ name: 'glowmother/' + h, hero: h, zone: 'glowwild', arena: 'mother', lvl: 9, kit: 3, flags: ['relay_off'] }));
    out.push({ name: 'alpha', hero: 'fenn', zone: 'dunes', arena: 'alpha', lvl: 8, kit: 3, flags: ['alpha_called'], left: true }, { name: 'unit03', hero: 'pyra', zone: 'glowwild', arena: 'unit03', lvl: 9, kit: 3, flags: ['unit_called'] });
    return out;
  };
  ST.trial = function (B, bot) {
    boot(B.hero);
    const h = G.hero(), S = G.state;
    ['double_jump'].concat(h.kit.slice(0, B.kit || 1)).forEach(a => G.unlock(a, true));
    S.level = B.lvl; (B.flags || []).forEach(f => G.setFlag(f)); G.setFlag('name_known');
    if (S.zone !== B.zone) { T.warp(B.zone); T.step(10); T.skip(); }
    const a = G.zone.ents.find(e => e instanceof SW.Arena && e.id === B.arena);
    if (!a) return { err: 'no arena ' + B.arena };
    S.hp = G.player.hpMax(); S.energy = 200; S.items = 2; S.awaken = 0;
    T.tp(B.left ? a.x1 - 4 : a.x0 + 4, a.gy); T.hold([B.left ? 'left' : 'right']); T.step(40); T.hold([]); T.skip(); T.step(3); T.skip();
    const boss = G.boss;
    if (!boss) return { err: 'no boss' };
    const hp0 = S.hp, r = T.fight(9000, bot === 'careful' ? { smart: true, reach: 470, arena: true } : { reach: 470, arena: true });
    return { frames: r.frames, lost: Math.round(100 * (hp0 - Math.max(0, S.hp)) / hp0), dead: !!(r.dead || G.player.dead), left: boss.dead ? 0 : Math.max(0, Math.round(100 * boss.hp / boss.hpMax)), err: G.lastError };
  };
  ST.bench = function (names, n) {
    n = n || 5;
    return ST.bosses().filter(B => !names || names.indexOf(B.name) >= 0 || names.indexOf(B.name.split('/')[0]) >= 0).map(B => {
      const row = { boss: B.name, hero: B.hero };
      ['mash', 'careful'].forEach(bot => {
        let fr = 0, lost = 0, deaths = 0, left = 0, err = null;
        for (let i = 0; i < n; i++) { const r = ST.trial(B, bot); if (r.err) { err = r.err; continue; } fr += r.frames; lost += r.lost; deaths += r.dead ? 1 : 0; left += r.left; }
        row[bot] = { deaths: deaths + '/' + n, lost: Math.round(lost / n), sec: Math.round(fr / n / 60), bossLeft: Math.round(left / n), err };
      });
      return row;
    });
  };
  ST.all = function () {
    const out = { tutorials: [], act2: {} };
    D.heroOrder.forEach(h => { if (SW.story.tutorials[h]) out.tutorials.push(ST.tutorial(h)); });
    D.heroOrder.forEach(h => { try { out.act2[h] = ST.act2(h); } catch (e) { out.act2[h] = 'THREW ' + (e && e.stack || e); } });
    return out;
  };
})();
