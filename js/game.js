'use strict';
// Shattered Worlds — game state, scenes, missions, zone travel, save/load and the main loop.
(function () {
  const SW = window.SW, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, D = SW.data, W = SW.W, H = SW.H;
  const G = SW.game = { scene: 'title', overlay: null, state: null, zone: null, player: null, cam: { x: 0, y: 0 }, hitstop: 0, boss: null, toasts: [], banner: null,
    fade: { a: 0, dir: 0, cb: null }, alertT: 0, pit: null, exitLock: false, promptEnt: null, hintText: null, msgCd: 0 };
  Object.keys(D.missions).forEach(k => { D.missions[k].id = k; });

  // ---------- state helpers ----------
  G.fresh = hero => ({ hero, level: 1, xp: 0, creds: 0, items: 0, hp: 100, energy: 100, awaken: 0, stats: { power: 0, energy: 0, speed: 0 }, points: 0, abilities: {}, flags: {}, steps: {}, counts: {},
    mission: (D.heroes[hero].route || hero) === 'kael' ? 'N1-1' : 'I1-1', upg: {}, done: {}, minor: 0, memories: [], assist: null, assists: [], zone: null, visited: {}, checkpoint: null, hpBonus: 0 });
  G.hero = () => D.heroes[G.state.hero];
  G.route = () => G.hero().route || G.state.hero;
  G.upg = id => (G.state && G.state.upg && G.state.upg[id]) || 0;
  // bonus heroes follow Kael's or Nyra's story: their kit slots stand in for that hero's abilities, and their name in the text
  G.mapAbility = function (id) { const r = D.heroes[G.route()], h = G.hero(), i = r === h ? -1 : r.kit.indexOf(id); return i >= 0 ? h.kit[i] : id; };
  G.txt = function (t) { const r = D.heroes[G.route()], h = G.hero(); return r === h ? t : t.split(r.alias.toUpperCase()).join(h.alias.toUpperCase()).split(r.alias).join(h.alias).split(r.name).join(h.name); };
  G.has = id => !!G.state.abilities[G.mapAbility(id)];
  G.unlock = function (id, quiet) { id = G.mapAbility(id); if (G.state.abilities[id]) return; G.state.abilities[id] = true; if (!quiet) { SW.audio.sfx('level'); G.toast('Learned: ' + D.abilities[id].name + '  [' + D.abilities[id].input + ']', '#f5c542'); } };
  G.flag = k => !!G.state.flags[k];
  G.setFlag = (k, v) => { G.state.flags[k] = v === undefined ? true : v; };
  G.busy = () => ui.dlg.active || !!G.overlay || G.fade.dir === 1 || G.scene !== 'play';
  G.say = (id, cb) => ui.dlg.start(G, id, cb);
  G.toast = function (text, col) { if (!text) return; if (G.toasts.some(t => t.text === text)) return; G.toasts.push({ text, col, t: 0, max: 190 }); if (G.toasts.length > 4) G.toasts.shift(); };
  G.alert = () => { G.alertT = 200; };
  G.xpNeed = () => 50 + G.state.level * 35;
  G.addXP = function (n) {
    const S = G.state;
    S.xp += n;
    while (S.xp >= G.xpNeed() && S.level < 40) { S.xp -= G.xpNeed(); S.level++; S.points++; if (G.player) S.hp = Math.min(G.player.hpMax(), S.hp + Math.round(G.player.hpMax() * 0.3)); SW.audio.sfx('level'); G.toast('LEVEL ' + S.level + '!  +1 stat point (Esc > Stats)', '#7dffa0'); if (G.player) fx.ring(G.player.x, G.player.y - 16, '#7dffa0', 6, 44, 22); }
  };
  G.addAssist = function (id) { const S = G.state; if (S.assists.indexOf(id) < 0) S.assists.push(id); S.assist = id; };

  // ---------- missions ----------
  G.stepDone = (m, s) => !!(G.state.steps[m.id + ':' + s.id] || (s.alias && G.state.steps[s.alias]));
  G.currentStep = function () { const m = D.missions[G.state.mission]; return m ? m.steps.find(s => !G.stepDone(m, s)) : null; };
  G.step = function (key) {
    const S = G.state;
    if (S.steps[key]) return;
    S.steps[key] = true;
    const m = D.missions[S.mission];
    if (m && m.steps.some(s => m.id + ':' + s.id === key || s.alias === key)) SW.audio.sfx('pickup');
    G.checkMission();
  };
  G.count = function (key) {
    const S = G.state, parts = key.split(':'), m = D.missions[parts[0]], s = m && m.steps.find(x => x.id === parts[1]);
    if (!s || S.steps[key]) return;
    S.counts[key] = (S.counts[key] || 0) + 1;
    if (S.counts[key] >= (s.n || 1)) G.step(key);
  };
  G.checkMission = function () {
    const S = G.state;
    for (let guard = 0; guard < 12; guard++) {
      const m = D.missions[S.mission];
      if (!m || !m.steps.every(s => G.stepDone(m, s))) return;
      S.done[m.id] = true; S.creds += m.creds || 0;
      G.toast('MISSION COMPLETE: ' + m.title, '#f5c542');
      G.addXP(m.xp || 0);
      S.mission = m.next;
      if (D.missions[S.mission]) G.toast('New mission: ' + D.missions[S.mission].title, '#22d3ee');
    }
  };
  G.memory = function (id, then) {
    const S = G.state;
    if (id.indexOf('hero_') === 0) id = G.route() + id.slice(4);
    const after = () => { if (typeof then === 'string') G.step(then); else if (then) then(); };
    const m = D.memories[id];
    if (!m || S.memories.indexOf(id) >= 0) { after(); return; }
    S.memories.push(id); G.unlock(m.unlock, true);
    if (m.name) G.setFlag('name_known');
    ui.memStart(G, id, after);
  };
  G.minorShard = function () {
    const S = G.state;
    S.minor++; SW.audio.sfx('shard');
    G.toast('Minor Memory Shard  ' + S.minor + ' / 60', '#b9a0ff');
    if (S.minor % 5 === 0) G.toast('Passive gained: +3% damage, +10% energy regen', '#b9a0ff');
  };
  G.hook = function (fn) {
    if (fn === 'shop') { G.overlay = 'shop'; ui.shop.sel = 0; }
    else if (fn === 'pit_start') G.pit = { wave: 0, t: 50, foes: [], state: 'rest' };
    else if (fn === 'chute') G.gotoZone('scrapton', 'chute');
    else if (fn === 'slice_end') { if (!G.flag('slice_card')) { G.setFlag('slice_card'); G.overlay = 'card'; SW.audio.sfx('level'); } }
  };

  // ---------- combat callbacks ----------
  G.onHit = function (atk, e, b) {
    const S = G.state, p = G.player, dmg = atk.dealt || atk.dmg;
    if (!atk.energy) S.energy = Math.min(300, S.energy + 6 * (1 + 0.15 * G.upg('flow')));
    if (p.awakeT <= 0) S.awaken = Math.min(100, S.awaken + dmg * 0.4);
    G.hitstop = Math.max(G.hitstop, atk.heavy ? 6 : 3);
    if (atk.heavy) fx.shake(4, 8);
    SW.audio.sfx(atk.heavy ? 'heavy' : 'hit');
    const cx = SW.clamp(atk.x + atk.w / 2, b.x, b.x + b.w), cy = SW.clamp(atk.y + atk.h / 2, b.y, b.y + b.h);
    fx.spark(cx, cy, G.hero().colorHi, atk.heavy ? 10 : 5, atk.heavy ? 3.4 : 2.4);
    fx.text(b.x + b.w / 2 + SW.rand(-6, 6), b.y - 4, String(dmg), atk.heavy ? '#f5c542' : '#ffffff');
    const c = G.combo && G.combo.t > 0 ? G.combo : { n: 0, dmg: 0 };
    G.combo = { n: c.n + 1, dmg: c.dmg + dmg, t: 110, pop: 7 };
    G.alert();
  };
  G.onKill = function (e) {
    const d = e.def, z = G.zone;
    G.addXP(d.xp);
    if (!e.isBoss) SW.audio.sfx('heavy');
    fx.spark(e.x, e.y - e.h / 2, '#ffffff', 10, 3);
    const n = Math.min(6, Math.ceil(d.creds / 6));
    for (let i = 0; i < n; i++) z.add(new SW.Pickup('creds', e.x, e.y - 12, { loose: true, amt: Math.ceil(d.creds / n), vx: SW.rand(-2, 2), vy: SW.rand(-4, -2) }));
    if (Math.random() < 0.22 || e.isBoss) z.add(new SW.Pickup('hp', e.x, e.y - 12, { loose: true, amt: e.isBoss ? 40 : 10, vx: SW.rand(-1, 1), vy: -3 }));
    if (z.id === 'slums' && e.type === 'thug') G.count('N1-1:thugs');
    if (z.id === 'medlab' && e.type === 'drone') G.count('I1-1:drones');
  };

  // ---------- Pit Arena ----------
  const WAVES = [[['brawler', 22], ['thug', 25]], [['brawler', 20], ['ganger', 26], ['thug', 9]], [['brawler', 21], ['brawler', 9], ['ganger', 26]]];
  G.pitTick = function (z) {
    const P = G.pit, p = G.player;
    if (!P || G.busy()) return;
    if (P.state === 'rest') {
      if (--P.t <= 0) {
        P.foes = WAVES[P.wave].map(w => { const e = z.enemy(w[0], w[1], 13); e.state = 'chase'; fx.ring(e.x, e.y - 14, '#ff3ea5', 4, 30, 16); return e; });
        P.state = 'fight'; G.toast('ROUND ' + (P.wave + 1) + ' - FIGHT!', '#ff3ea5'); SW.audio.sfx('roar'); G.alert();
      }
    } else if (P.state === 'fight') {
      G.alert();
      if (P.foes.every(f => f.dead)) {
        P.wave++;
        if (P.wave >= WAVES.length) { P.state = 'won'; P.t = 70; }
        else { P.state = 'rest'; P.t = 110; p.heal(Math.round(p.hpMax() * 0.25)); G.toast('Round clear!', '#7dffa0'); }
      }
    } else if (--P.t <= 0) {
      G.pit = null;
      if (!G.flag('pit_won')) { G.setFlag('pit_won'); G.say(G.route() === 'kael' ? 'p_win_k' : 'p_win_n'); }
      else { G.state.creds += 60; G.toast('Sparring purse: 60 creds', '#f5c542'); SW.audio.sfx('coin'); }
    }
  };

  // ---------- travel / save ----------
  function startFade(cb) { G.fade.dir = 1; G.fade.cb = cb; }
  function camera(snap) {
    const p = G.player, z = G.zone;
    const tx = SW.clamp(p.x + p.face * 26 - W / 2, 0, Math.max(0, z.pw - W)), ty = SW.clamp(p.y - 172, 0, Math.max(0, z.ph - H));
    if (snap) { G.cam.x = tx; G.cam.y = ty; } else { G.cam.x += (tx - G.cam.x) * 0.1; G.cam.y += (ty - G.cam.y) * 0.14; }
  }
  function loadZone(id, spawn, pos) {
    const S = G.state;
    fx.clear(); G.boss = null; G.pit = null; G.combo = null; G.promptEnt = null; G.hintText = null; G.hitstop = 0;
    S.zone = id; S.visited[id] = true;
    G.zone = new SW.Zone(id, G);
    const sp = pos || G.zone.spawns[spawn] || G.zone.spawns[Object.keys(G.zone.spawns)[0]];
    G.player = new SW.Player(G, sp.x, sp.y);
    if (sp.x > G.zone.pw / 2 && !pos) G.player.face = -1;
    G.exitLock = true;
    camera(true);
    const wz = D.world.find(w => w.id === id), layer = wz ? D.layers[wz.layer] : null;
    G.banner = { title: G.zone.name.toUpperCase(), sub: layer ? layer.name : '', col: layer ? layer.col : '#f5c542', t: 170, max: 170 };
    SW.audio.music(G.zone.music);
  }
  G.gotoZone = function (id, spawn) {
    if (G.fade.dir === 1) return;
    startFade(() => { loadZone(id, spawn); G.state.checkpoint = { zone: id, spawn }; G.saveGame(); });
  };
  G.respawn = function () {
    startFade(() => {
      const S = G.state, c = S.checkpoint;
      loadZone(c.zone, c.spawn, c.x !== undefined ? { x: c.x, y: c.y } : null);
      S.hp = G.player.hpMax(); S.energy = Math.max(S.energy, 100); S.awaken = 0;
    });
  };
  G.rest = function (sp) {
    const S = G.state, p = G.player;
    S.hp = p.hpMax(); S.energy = 300; if (S.items < 1) S.items = 1;
    S.checkpoint = { zone: S.zone, x: sp.x, y: sp.y };
    G.saveGame(); SW.audio.sfx('save'); fx.ring(sp.x, sp.y - 14, '#ffffff', 4, 40, 24); G.toast('Rested. Game saved.', '#7dffa0');
  };
  G.saveGame = () => { if (G.state) SW.store.save(G.state); };
  G.toTitle = function () { G.scene = 'title'; G.overlay = null; ui.title.sel = 0; ui.dlg.active = false; SW.audio.music('title'); };
  G.newGame = function (hero) {
    G.state = G.fresh(hero);
    const h = D.heroes[hero];
    G.scene = 'play'; G.overlay = null; G.toasts = [];
    loadZone(h.start.zone, h.start.spawn);
    G.state.checkpoint = { zone: h.start.zone, spawn: h.start.spawn };
    G.fade.a = 1; G.fade.dir = -1;
    G.saveGame();
    G.say(G.route() === 'kael' ? 'k_wake' : 'n_wake');
  };
  G.continueGame = function () {
    const s = SW.store.load();
    if (!s) return;
    try {
    G.state = Object.assign(G.fresh(s.hero), s);
    G.scene = 'play'; G.overlay = null; G.toasts = [];
    const c = G.state.checkpoint || { zone: D.heroes[s.hero].start.zone, spawn: D.heroes[s.hero].start.spawn };
    loadZone(c.zone, c.spawn, c.x !== undefined ? { x: c.x, y: c.y } : null);
    if (G.state.hp <= 0) G.state.hp = G.player.hpMax();
    G.fade.a = 1; G.fade.dir = -1;
    } catch (e) {   // a save from an incompatible build must never leave the game on a black screen
      console.error(e); G.scene = 'title'; G.overlay = null; G.zone = null; G.player = null;
      G.loadMsg = 'That save could not be loaded. Start a New Game to replace it.';
    }
  };

  // ---------- per-frame world interactions ----------
  function world() {
    const p = G.player, z = G.zone, pb = p.box();
    for (const t of z.triggers) {
      if (t.done) continue;
      if (t.flag && G.flag(t.flag)) { t.done = true; continue; }
      if (SW.overlap(pb, t)) { if (t.once) t.done = true; if (t.flag) G.setFlag(t.flag); t.fn(G); }
    }
    let touching = false;
    for (const ex of z.exits) {
      if (!SW.overlap(pb, ex)) continue;
      touching = true;
      if (G.exitLock) break;
      if (ex.need && !ex.need(G)) { p.x += p.x < ex.x + ex.w / 2 ? -6 : 6; p.vx = 0; if (G.msgCd <= 0) { G.toast(ex.msg); SW.audio.sfx('deny'); G.msgCd = 150; } }
      else G.gotoZone(ex.to, ex.spawn);
      break;
    }
    if (!touching) G.exitLock = false;
    G.hintText = null;
    for (const h of z.hints) if (SW.overlap(pb, h)) { G.hintText = h.text; break; }
    let best = null, bd = 26;
    for (const e of z.ents) if (e.canInteract && e.canInteract(G)) { const d = Math.abs(e.x - p.x); if (d < bd && Math.abs(e.y - p.y) < 40) { bd = d; best = e; } }
    G.promptEnt = best;
    if (best && I.hit('interact') && p.onGround && !G.busy()) best.interact(G);
  }
  function timers() {
    for (let i = G.toasts.length - 1; i >= 0; i--) if (++G.toasts[i].t >= G.toasts[i].max) G.toasts.splice(i, 1);
    if (G.banner && G.banner.t > 0) G.banner.t--;
    if (G.msgCd > 0) G.msgCd--;
    if (G.alertT > 0) G.alertT--;
    if (G.combo) { if (G.combo.pop > 0) G.combo.pop--; if (--G.combo.t <= 0) G.combo = null; }
    const A = SW.audio, target = G.alertT > 0 || (G.boss && !G.boss.dead) ? 1 : 0;
    A.intensity += (target - A.intensity) * 0.03;
  }
  function debugKeys() {
    const S = G.state;
    if (I.hit('dbgUnlock')) { ['double_jump'].concat(G.hero().kit).forEach(id => G.unlock(id, true)); S.energy = 300; S.awaken = 100; G.toast('DEBUG: every ability unlocked, bars filled', '#ff3ea5'); }
    if (I.hit('dbgHeal')) { S.hp = G.player.hpMax(); S.energy = 300; G.toast('DEBUG: healed', '#ff3ea5'); }
    if (I.hit('dbgWarp')) { const ids = Object.keys(SW.zones); G.gotoZone(ids[(ids.indexOf(S.zone) + 1) % ids.length]); }
  }

  function updatePlay() {
    const p = G.player, z = G.zone, f = G.fade;
    if (f.dir) { f.a += f.dir * 0.09; if (f.dir === 1 && f.a >= 1) { f.a = 1; f.dir = -1; const cb = f.cb; f.cb = null; if (cb) cb(); return; } if (f.dir === -1 && f.a <= 0) { f.a = 0; f.dir = 0; } if (f.dir === 1) return; }
    if (G.overlay) {
      if (G.overlay === 'pause') ui.pauseUpdate(G);
      else if (G.overlay === 'map') { if (I.hit('map') || I.hit('pause') || I.back()) { G.overlay = null; SW.audio.sfx('back'); } }
      else if (G.overlay === 'shop') ui.shopUpdate(G);
      else if (G.overlay === 'memory') ui.memUpdate(G);
      else if (G.overlay === 'card') { if (I.ok()) { G.overlay = null; SW.audio.sfx('select'); G.saveGame(); } }
      else if (G.overlay === 'controls') { if (I.ok() || I.back()) { G.overlay = 'pause'; SW.audio.sfx('back'); } }
      timers();
      return;
    }
    if (ui.dlg.active) { ui.dlg.update(G); G.player.settle(G.zone); G.zone.update(G); fx.update(); camera(); timers(); return; }
    if (G.hitstop > 0) { G.hitstop--; fx.update(); timers(); return; }
    p.update(G, z);
    if (G.zone !== z || G.player !== p) return;
    z.update(G);
    fx.update(); camera(); timers();
    if (!p.dead && !G.busy()) {
      world(); debugKeys();
      if (I.hit('pause')) { G.overlay = 'pause'; ui.pm.sel = 0; SW.audio.sfx('select'); }
      else if (I.hit('map')) { G.overlay = 'map'; SW.audio.sfx('select'); }
    }
  }
  function updateMenus() {
    if (G.scene === 'vs') { SW.versus.update(G); return; }
    if (G.scene === 'title') {
      SW.audio.music('title');
      if (G.overlay === 'controls') { if (I.ok() || I.back()) { G.overlay = null; SW.audio.sfx('back'); } return; }
      const items = ui.titleItems(G);
      if (ui.title.sel >= items.length) ui.title.sel = 0;
      if (I.hit('down')) { ui.title.sel = (ui.title.sel + 1) % items.length; SW.audio.sfx('move'); }
      if (I.hit('up')) { ui.title.sel = (ui.title.sel + items.length - 1) % items.length; SW.audio.sfx('move'); }
      if (I.ok()) {
        SW.audio.sfx('select');
        const a = items[ui.title.sel][1];
        if (a === 'continue') G.continueGame(); else if (a === 'new') { G.scene = 'select'; } else if (a === 'versus') SW.versus.open(G); else G.overlay = 'controls';
      }
    } else if (G.scene === 'select') {
      ui.selectUpdate(G);
    } else if (G.scene === 'prologue') {
      ui.pro.t++;
      const len = D.prologue[ui.pro.i].length, begin = () => G.newGame(D.heroOrder[ui.sel.i]);
      if (I.hit('pause')) begin();
      else if (I.ok() || I.hit('jump')) { if (ui.pro.t * 0.9 < len) ui.pro.t = len * 2; else { ui.pro.i++; ui.pro.t = 0; SW.audio.sfx('select'); if (ui.pro.i >= D.prologue.length) begin(); } }
    }
  }

  // ---------- render ----------
  function render() {
    const ctx = G.ctx;
    ctx.imageSmoothingEnabled = false;
    if (G.scene === 'title') { ui.drawTitle(ctx, G); if (G.overlay === 'controls') ui.drawControls(ctx); return; }
    if (G.scene === 'select') { ui.drawSelect(ctx, G); return; }
    if (G.scene === 'prologue') { ui.drawPrologue(ctx, G); return; }
    if (G.scene === 'vs') { SW.versus.draw(ctx, G); return; }
    if (!G.zone || !G.player) { art.rect(ctx, '#05060c', 0, 0, W, H); return; }
    const sh = fx.shakeT > 0 ? fx.shakeAmt : 0;
    const cam = { x: Math.round(G.cam.x + (sh ? SW.rand(-sh, sh) : 0)), y: Math.round(G.cam.y + (sh ? SW.rand(-sh, sh) : 0)) };
    G.zone.draw(ctx, cam, G);
    if (fx.flashT > 0) { ctx.globalAlpha = 0.7 * fx.flashT / fx.flashMax; art.rect(ctx, fx.flashCol, 0, 0, W, H); ctx.globalAlpha = 1; }
    const p = G.player;
    if (p.dead) { ctx.globalAlpha = SW.clamp(p.deadT / 80, 0, 0.8); art.rect(ctx, '#200008', 0, 0, W, H); ctx.globalAlpha = 1; if (p.deadT > 30) SW.text(ctx, 'YOU FELL', W / 2, 110, '#ff5a5a', { align: 'center', scale: 3 }); }
    if (G.overlay !== 'memory') ui.hud(ctx, G);
    if (ui.dlg.active) ui.dlg.draw(ctx, G);
    if (G.overlay === 'pause') ui.drawPause(ctx, G); else if (G.overlay === 'map') ui.drawMap(ctx, G); else if (G.overlay === 'shop') ui.drawShop(ctx, G);
    else if (G.overlay === 'memory') ui.drawMem(ctx, G); else if (G.overlay === 'card') ui.drawCard(ctx, G); else if (G.overlay === 'controls') ui.drawControls(ctx);
    if (G.fade.a > 0) { ctx.globalAlpha = SW.clamp(G.fade.a, 0, 1); art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1; }
  }

  // ---------- boot + loop ----------
  function tick() {
    SW.frame++;
    I.update();
    if (G.scene === 'play') updatePlay(); else updateMenus();
  }
  G.tick = tick; G.render = render;
  G.boot = function () {
    const c = document.getElementById('game');
    G.canvas = c; G.ctx = c.getContext('2d');
    const fit = () => { const s = Math.max(1, Math.floor(Math.min(window.innerWidth / W, window.innerHeight / H))); c.style.width = W * s + 'px'; c.style.height = H * s + 'px'; };
    window.addEventListener('resize', fit); fit();
    art.init();
    let last = performance.now(), acc = 0;
    const frame = now => {
      acc += Math.min(100, now - last); last = now;
      let n = 0;
      if (G.manual) acc = 0;   // test harness drives ticks itself
      while (acc >= 1000 / 60 && n++ < 5) { try { tick(); } catch (e) { console.error(e); G.lastError = String(e && e.stack || e); } acc -= 1000 / 60; }
      if (n >= 5) acc = 0;
      try { render(); } catch (e) { console.error(e); }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  window.addEventListener('load', G.boot);
  window.addEventListener('beforeunload', () => { if (G.scene === 'play') G.saveGame(); });
})();
