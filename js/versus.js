'use strict';
// Shattered Worlds — Versus mode: two heroes fight, best of three. Player vs Player (two keyboards' worth of
// keys on one keyboard) or Player vs Bot. Every hero is available here, locked or not.
// Training is the third mode: no timer, no knock-outs, a dummy that does what you tell it, and the move list on screen.
// Esc pauses any fight; the pause screen has the full move list for both fighters.
//
// Both fighters are ordinary Player objects. The base game assumes one player and one global input, so each
// fighter gets a "context" (its own state, input, summons and projectiles) that is swapped in while it updates,
// and it sees its opponent as a proxy "enemy" in its entity list.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, W = SW.W, H = SW.H, text = SW.text;
  const V = SW.versus = { phase: 'menu', mode: 'pvb', diff: 1, stage: 0, gain: 1, row: 0, pick: [0, 1], step: 0, f: [], wins: [0, 0], round: 1, t: 0, cur: null,
    dummy: 0, endless: true, showMoves: true, paused: false, pRow: 0, pPage: null, pWho: 0 };
  const MODES = [['pvb', 'Player vs Bot'], ['pvp', 'Player vs Player'], ['train', 'Training'], ['rival', 'Rival Duel']];   // while a duel runs V.mode is 'duel'
  const DUMMY = ['Stands still', 'Guards', 'Attacks', 'Fights back'];   // what the Training dummy does
  const STAGES = [['Random', null], ['Pit Arena', 'arena'], ['Deepline Slums', 'slums'], ['Neon Market', 'market'], ['Old Metro', 'metro'], ['Med-Lab', 'lab'], ['Skyport', 'sky'], ['Rust Flats', 'surface']];
  // three arenas that exist only here (backdrops: assets/bg/vs_*.png, prompts in tools/higgsfield-arenas.json)
  Object.assign(art.themes, {
    vs_crater:  { style: 'dirt',  a: '#4a3a6a', b: '#3c2e58', top: '#8a6ac8', hi: '#c8a8ff', deep: '#1c1430', plat: '#6a5a8a', sky: ['#120a26', '#3a1f5c'], mid: 'ruins',  midCol: '#1a1030', bg: 'vs_crater',  dim: 0.16, haz: '#b48cff', win: ['#b48cff'] },
    vs_spire:   { style: 'plate', a: '#46507a', b: '#384064', top: '#c8ccdc', hi: '#ffe9a8', deep: '#161a30', plat: '#d9b45a', sky: ['#0a1030', '#2a3a78'], mid: 'clouds', midCol: '#ffffff', bg: 'vs_spire',   dim: 0.14, haz: '#6fd3e8', win: ['#d9b45a'] },
    vs_foundry: { style: 'brick', a: '#4a2c24', b: '#3a221c', top: '#a8502a', hi: '#ffb060', deep: '#180c0a', plat: '#6a4a3a', sky: ['#140606', '#3a1208'], mid: 'arches', midCol: '#1a0a08', bg: 'vs_foundry', dim: 0.22, haz: '#ff8a3a', win: ['#ff8a3a'] }
  });
  ['vs_crater', 'vs_spire', 'vs_foundry'].forEach(n => { const im = new Image(); im.onload = () => { art.bg[n] = im; }; im.src = 'assets/bg/' + n + '.png'; });
  STAGES.push(['Crater Rim', 'vs_crater'], ['Aurelia Spire', 'vs_spire'], ['Deep Foundry', 'vs_foundry']);
  const DIFF = ['Easy', 'Normal', 'Hard'];
  // Energy in Versus comes from fighting, not from standing still. GAIN is the menu's "Energy gain" row: [label, multiplier].
  // Per frame: PASSIVE trickle, CHARGE while holding attack + jump (the story charges at 1.25). Per hit landed: HIT_MELEE for
  // a combo hit, HIT_SKILL for a skill / special / summon hit, nothing during the ultimate. The fighter who is hit gets HIT_TAKEN x damage.
  const GAIN = [['Slow', 0.6], ['Normal', 1], ['Fast', 1.6]], PASSIVE = 0.045, CHARGE = 0.6, HIT_MELEE = 10, HIT_SKILL = 3, HIT_TAKEN = 0.5;
  // Perfect block (guard in the last few frames before a hit): frames the attacker is stunned, and how often a bot's
  // well-timed guard counts as perfect on Easy / Normal / Hard.
  const STUN_MELEE = 60, STUN_RANGED = 30, BOT_PERFECT = [0.15, 0.4, 0.7];
  // Versus balance table: every hit a hero lands in Versus is multiplied by their entry; heroes not listed deal normal
  // damage. The story itself is not affected (and the Crater duel switches the table off for its two fighters).
  // The ten legend heroes are NOT listed, by the user's choice: they are meant to be super strong and stay that way here
  // (they win about 87% of rounds against the rest). The table only evens out the other fifteen against each other.
  // The numbers come from a bot tournament among those fifteen (every pair, both sides, bots on Normal): untuned, their
  // win rates ran from 30% to 77%; with this table they run from about 41% to 59%.
  // To re-measure after changing heroes, see "Versus balance" in the README.
  V.tune = {
    kael: 1.3, nyra: 1.05, fenn: 0.65, isolde: 0.7, brakk: 1.1, pyra: 1.15, gale: 1.35, ashka: 0.95, dyna: 1.35, vesper: 1.05,
    kiri: 1.05, tarn: 0.95, maren: 0.9, yara: 1.15, brann: 0.75
  };
  const KEYS = [
    { left: ['KeyA'], right: ['KeyD'], up: ['KeyW'], down: ['KeyS'], attack: ['KeyJ'], jump: ['KeyK'], dash: ['KeyL'], skill: ['KeyU'], special: ['KeyI'], awaken: ['KeyO'] },
    { left: ['ArrowLeft'], right: ['ArrowRight'], up: ['ArrowUp'], down: ['ArrowDown'], attack: ['Numpad1', 'Digit7'], jump: ['Numpad2', 'Digit8'], dash: ['Numpad3', 'Digit9'], skill: ['Numpad4', 'Digit0'], special: ['Numpad5', 'Minus'], awaken: ['Numpad6', 'Equal'] }
  ];
  SW.zones.versus = { name: 'Versus', theme: 'arena', music: 'boss', w: 38, h: 17, build(z) { z.ground(0, 37, 14); } };

  const _busy = G.busy; G.busy = () => (G.scene === 'vs' ? V.phase !== 'fight' : _busy());
  const _resp = G.respawn; G.respawn = function () { if (G.scene !== 'vs') _resp(); };
  const _ti = ui.titleItems; ui.titleItems = g => { const a = _ti(g); a.splice(a.length - 1, 0, ['Versus', 'versus']); return a; };

  // ---------- fighter contexts ----------
  function ctx(f) {
    if (V.cur) V.cur.combo = G.combo;
    V.cur = f;
    if (!f) return;
    G.state = f.state; G.player = f.p; G.combo = f.combo; V.zone.ents = f.ents; V.zone.shots = f.shots;
    I.now = f.inp.now; I.prev = f.inp.prev; I.lastHit = f.inp.lastHit;
  }
  function stun(f, n, fromX) {   // a perfect block leaves the attacker helpless: no input (see readInput) and open to a full combo
    const q = f.p;
    if (q.dead || q.state === 'ult' || q.state === 'awaken' || q.state === 'slip') return;   // an ultimate cannot be interrupted
    q.enter('hurt'); q.hurtLen = n; q.atk = null; q.castFn = null; q.vx = (q.x >= fromX ? 1 : -1) * 1.2; q.invuln = 0; q.iframes = 0; q.juggle = 0;
    f.stunT = n; fx.text(q.x, q.y - 58, 'STUNNED', '#ffe066'); SW.audio.sfx('heavy');
  }
  function hitFighter(f, atk) {
    const me = V.cur, p = f.p;
    if (V.phase !== 'fight' || p.dead) return 'none';
    if (p.state === 'hurt' && (p.juggle || 0) > 12) return 'none';          // combos cannot go on forever
    ctx(f);
    const train = V.mode === 'train', fresh = p.state !== 'hurt';
    const dmg = me && me !== f ? Math.max(1, Math.round(atk.dmg * (V.tune[me.hero] || 1))) : atk.dmg;   // Versus balance table (TUNE)
    if (train) f.state.hp = Math.max(f.state.hp, dmg + 1);   // nobody is knocked out in Training
    if (f.bot && p.state === 'guard' && p.guardT <= 6 && Math.random() > BOT_PERFECT[V.diff]) p.guardT = 7;   // a bot does not get every perfect block
    const r = p.takeHit(Object.assign({}, atk, { dmg, src: null, srcX: atk.srcX === undefined ? (me ? me.p.x : p.x) : atk.srcX }), G);
    if (r === 'perfect') V.perfects = (V.perfects || 0) + 1;
    if (train && r !== 'none') f.hitT = V.t;
    if (train && r === 'hit') { if (fresh || !f.cm) f.cm = { hits: 0, dmg: 0 }; f.cm.hits++; f.cm.dmg += dmg; }   // combo counter: restarts when the hit lands on a fighter who had recovered
    if (r === 'hit') {
      p.invuln = 0; p.hurtLen = SW.clamp(atk.stun || 18, 14, 36); p.juggle = (p.juggle || 0) + 1; atk.dealt = dmg;
      f.state.energy = Math.min(300, f.state.energy + dmg * HIT_TAKEN * GAIN[V.gain][1]);   // taking a hit builds energy too
      const s = atk.status;
      if (s && s.burn) { f.burnT = 150; f.burnD = s.burn; }
      if (s && s.freeze && p.state === 'hurt') { p.hurtLen = Math.min(60, 20 + s.freeze / 3); f.frozen = p.hurtLen; p.vx = 0; }
    }
    ctx(me);
    if (r === 'perfect' && me && me !== f) stun(me, atk.src ? STUN_MELEE : STUN_RANGED, p.x);   // atk.src is set for the fighter's own blows, not for projectiles and summons
    return r === 'perfect' ? 'block' : r;
  }
  // energy from landing hits: note what the story code just added (base) and what Versus gives instead (bonus); fightTick settles it
  const _onHit = G.onHit; G.onHit = function (atk, e, b) {
    const f = G.scene === 'vs' ? V.cur : null, before = f ? f.state.energy : 0;
    _onHit(atk, e, b);
    if (f) { f.base += f.state.energy - before; if (f.p.state !== 'ult') f.bonus += (atk.energy ? HIT_SKILL : HIT_MELEE) * GAIN[V.gain][1]; }
  };
  function proxy(f) {   // how a fighter appears in its opponent's entity list
    return { hittable: true, team: 'enemy', def: {}, isProxy: true,
      get x() { return f.p.x; }, get y() { return f.p.y; }, get w() { return f.p.w; }, get h() { return f.p.h; }, get dead() { return f.p.dead; },
      get vx() { return f.p.vx; }, set vx(v) { f.p.vx = v; },
      box() { return f.p.box(); }, update() {}, draw() {}, takeHit(atk) { return hitFighter(f, atk); },
      stagger(n) { const p = f.p; if (!p.dead && p.iframes <= 0 && V.phase === 'fight') { p.enter('hurt'); p.hurtLen = Math.min(n, 40); } } };
  }
  function makeFighter(i, hero, bot, own) {   // own: a ready-made state (the story duel passes a copy of the save)
    const st = own || G.fresh(hero);
    if (!own) { ['double_jump'].concat(D.heroes[hero].kit).forEach(a => { st.abilities[a] = true; }); st.level = 10; st.hpBonus = 120; st.flags.name_known = true; }
    return { i, hero, bot, state: st, p: null, ents: [], shots: [], inp: { now: {}, prev: {}, lastHit: {} }, combo: null, burnT: 0, frozen: 0, stunT: 0, bonus: 0, base: 0, ai: null };
  }
  function startRound() {
    const z = V.zone;
    fx.clear(); G.hitstop = 0;
    V.f.forEach((f, i) => {
      G.state = f.state;
      f.p = new SW.Player(G, z.pw / 2 + (i ? 90 : -90), 14 * 16); f.p.face = i ? -1 : 1; f.p.juggle = 0;
      f.state.hp = f.p.hpMax(); f.state.energy = 100; f.state.awaken = 0;
      f.ents = [proxy(V.f[1 - i])]; f.shots = []; f.combo = null; f.inp = { now: {}, prev: {}, lastHit: {} }; f.burnT = 0; f.frozen = 0; f.stunT = 0; f.bonus = 0; f.base = 0; f.ai = null; f.cm = null; f.hitT = -999;
    });
    V.phase = V.mode === 'train' ? 'fight' : 'intro'; V.t = 0; V.timer = 60 * 60; V.winner = -1;
    G.cam.x = Math.max(0, z.pw / 2 - W / 2); G.cam.y = Math.max(0, z.ph - H);
  }
  function startMatch() {
    const th = STAGES[V.stage][1] || STAGES[1 + (Math.random() * (STAGES.length - 1) | 0)][1];
    SW.zones.versus.theme = th;
    V.f = [makeFighter(0, D.heroOrder[V.pick[0]], false), makeFighter(1, D.heroOrder[V.pick[1]], V.mode !== 'pvp')];
    G.state = V.f[0].state;
    V.zone = G.zone = new SW.Zone('versus', G);
    V.wins = [0, 0]; V.round = 1; V.unlocked = null; V.paused = false;
    SW.audio.music('boss');
    startRound();
  }
  V.open = function (g) { g.scene = 'vs'; g.overlay = null; V.phase = 'menu'; V.row = 0; V.paused = false; SW.audio.music('arena'); };

  // ---------- story duel ----------
  // SW.versus.duel({ rival, stage, diff, title, rivalName, full, hpBonus, canQuit, onEnd })
  //   One fight between the current story hero and the hero `rival`, who is driven by the Versus bot at level `diff`
  //   (0 Easy, 1 Normal, 2 Hard; default 1), on the arena theme `stage` (default 'vs_crater', the Crater Rim).
  //   Call it from the story (scene 'play', no dialogue open; after a conversation, from its end callback). The player
  //   fights with their real level, upgrades and unlocked moves, on a COPY of the save, so nothing in the duel can change
  //   it. The rival mirrors that progress slot for slot (`full: true` gives it its whole kit). Both sides get `hpBonus`
  //   extra HP (default 100). Versus rules apply: its energy economy, perfect-block stuns, the pause screen and move list.
  //   The story is frozen meanwhile and comes back exactly as it was; then onEnd(result, G) runs with 'win' or 'lose'.
  //   A lost duel can be retried on the spot. Esc > "Give up the duel" ends it with 'lose' unless canQuit is false.
  //   title: the intro banner (default 'RIVAL DUEL'). rivalName: the name on the rival's bar (default the hero's own).
  //   Returns true if the duel started. Called outside the story (the Versus menu's "Rival Duel") it takes `hero`
  //   instead, uses level-10 Versus fighters and returns to that menu.
  V.duel = function (o) {
    o = Object.assign({ stage: 'vs_crater', diff: 1, hpBonus: 100, canQuit: true }, o);
    const inStory = G.scene === 'play' && !!(G.state && G.zone && G.player), clone = x => JSON.parse(JSON.stringify(x));
    if (!D.heroes[o.rival] || (!inStory && !D.heroes[o.hero]) || (G.scene === 'vs' && V.phase !== 'menu' && V.phase !== 'pick')) return false;
    const saved = inStory ? { state: G.state, zone: G.zone, player: G.player, cx: G.cam.x, cy: G.cam.y, boss: G.boss } : null;
    let a;
    if (inStory) { const st = clone(G.state); st.hpBonus = (st.hpBonus || 0) + o.hpBonus; a = makeFighter(0, st.hero, false, st); } else a = makeFighter(0, o.hero, false);
    const b = makeFighter(1, o.rival, true);
    if (inStory) {   // the rival is as far along as the player is
      const ps = a.state, rs = b.state, pk = D.heroes[ps.hero].kit;
      rs.level = ps.level; rs.hpBonus = ps.hpBonus; rs.upg = clone(ps.upg || {}); rs.stats = clone(ps.stats); rs.minor = ps.minor || 0;
      rs.abilities = { double_jump: !!ps.abilities.double_jump };
      D.heroes[o.rival].kit.forEach((id, i) => { if (o.full || ps.abilities[pk[i]]) rs.abilities[id] = true; });
    }
    V.duelO = o; V.duelSaved = saved; V.modeBefore = V.mode; V.diffBefore = V.diff;
    V.mode = 'duel'; V.diff = SW.clamp(o.diff | 0, 0, 2); V.paused = false;
    SW.zones.versus.theme = art.themes[o.stage] ? o.stage : 'vs_crater';
    V.f = [a, b];
    G.scene = 'vs'; G.overlay = null; G.boss = null; G.combo = null; G.state = a.state;
    V.zone = G.zone = new SW.Zone('versus', G);
    V.wins = [0, 0]; V.round = 1; V.unlocked = null;
    SW.audio.music('boss');
    startRound();
    return true;
  };
  function endDuel(result) {   // hand the game back exactly as the duel found it
    const o = V.duelO, s = V.duelSaved;
    ctx(null); fx.clear(); G.hitstop = 0; G.combo = null; V.paused = false;
    if (G.toasts) G.toasts.length = 0;   // move-name shouts from the fight must not pop up in the story afterwards
    V.mode = V.modeBefore; V.diff = V.diffBefore; V.duelO = null; V.duelSaved = null; V.f = []; V.phase = 'menu';
    if (s) { G.state = s.state; G.zone = s.zone; G.player = s.player; G.cam.x = s.cx; G.cam.y = s.cy; G.boss = s.boss; G.scene = 'play'; G.player.invuln = Math.max(G.player.invuln, 40); SW.audio.music(s.zone.music); }
    else { G.zone = null; G.player = null; G.state = null; G.boss = null; SW.audio.music('arena'); }
    if (o && o.onEnd) o.onEnd(result, G);
  }
  const duelName = k => (k === 1 && V.duelO && V.duelO.rivalName ? V.duelO.rivalName : D.heroes[V.f[k].hero].name.toUpperCase());
  function quit(toMenu) {
    ctx(null); G.zone = null; G.player = null; G.state = null; G.boss = null; G.combo = null; fx.clear();
    if (G.toasts) G.toasts.length = 0;
    if (toMenu) { V.phase = 'menu'; SW.audio.music('arena'); } else { G.scene = 'title'; SW.audio.music('title'); }
  }

  // ---------- bot ----------
  // ult: how readily it fires a full bar; charge: how much it stands back to charge (energy now comes quickly from fighting)
  const LV = [{ react: 0.2, aggr: 0.45, every: 14, ult: 0.15, charge: 0.25 }, { react: 0.55, aggr: 0.75, every: 8, ult: 0.5, charge: 0.6 }, { react: 0.9, aggr: 1, every: 4, ult: 0.9, charge: 1 }];
  function botThink(f, o, k) {
    const p = f.p, q = o.p, S = f.state, c = LV[V.diff], ai = f.ai || (f.ai = { plan: 'approach', t: 0, n: 0 }), R = Math.random;
    if (V.phase !== 'fight' || p.dead) return;
    const dx = q.x - p.x, adx = Math.abs(dx), to = dx > 0 ? 'right' : 'left', away = dx > 0 ? 'left' : 'right', facing = (dx > 0 ? 1 : -1) === p.face;
    const qAtk = ['attack', 'airatk', 'rush', 'wave', 'cast', 'ult'].indexOf(q.state) >= 0, save = (p.awakeT > 0 && S.energy < 100) || (S.energy >= 180 && S.energy < 300);   // awakened: stop spending, build up to the ultimate
    ai.t--; ai.n++;
    if (ai.t <= 0) {
      ai.t = c.every + (R() * c.every | 0); ai.n = 0;
      if (p.state === 'hurt' && S.energy >= 60 && R() < c.react * 0.35) ai.plan = 'slip';
      else if (o.stunT > 8 && R() < c.aggr + 0.2) ai.plan = adx > 44 ? 'approach' : 'combo';   // punish a stunned opponent
      else if (qAtk && adx < 70 && R() < c.react) ai.plan = R() < 0.25 && S.energy >= 60 ? 'slip' : 'guard';
      else if (S.awaken >= 100 && p.awakeT <= 0 && R() < 0.9) ai.plan = 'awaken';
      else if ((p.awakeT > 0 ? S.energy >= 100 : S.energy >= 300) && adx < 260 && R() < c.ult) ai.plan = 'ult';
      else if (save && adx > 90 && R() < 0.7 * c.charge) ai.plan = 'charge';   // save up for the ultimate while awakened
      else if (adx > 170) ai.plan = !save && S.energy >= 25 && R() < 0.45 ? 'skill' : S.energy < 120 && R() < 0.4 * c.charge ? 'charge' : 'approach';
      else if (adx > 60) ai.plan = !save && S.energy >= 50 && R() < 0.3 * c.aggr ? 'special' : !save && S.energy >= 25 && R() < 0.35 ? 'skill' : R() < 0.2 ? 'jumpin' : 'approach';
      else ai.plan = R() < c.aggr ? (R() < 0.15 ? 'launcher' : R() < 0.12 ? 'sweep' : 'combo') : R() < 0.5 ? 'guard' : 'retreat';
      if (ai.plan === 'guard' || ai.plan === 'charge') ai.t = 24 + (R() * 20 | 0);
      if (ai.plan === 'combo') ai.t = 30 + (R() * 20 | 0);
    }
    const turn = () => { if (!facing) { k[to] = true; ai.n = 0; return true; } return false; };
    switch (ai.plan) {
      case 'approach': k[to] = true; if (adx > 140 && ai.n === 2 && R() < 0.5) k.dash = true; if (q.y < p.y - 40 && ai.n % 30 < 8) k.jump = true; break;
      case 'jumpin': k[to] = true; if (ai.n < 10) k.jump = true; else if (ai.n % 6 < 2) k.attack = true; break;
      case 'retreat': k[away] = true; if (ai.n === 1) k.dash = true; break;
      case 'combo': if (!facing || adx > 30) k[to] = true; if (ai.n % 7 < 2) k.attack = true; if (ai.n > 24 && !save && S.energy >= 25 && R() < 0.08) k.skill = true; break;
      case 'launcher': if (!turn()) { k.up = true; if (ai.n > 2 && ai.n < 6) k.attack = true; if (ai.n > 12) k.jump = true; } break;
      case 'sweep': if (!turn()) { k.down = true; if (ai.n > 2 && ai.n < 6) k.attack = true; } break;
      case 'skill': if (!turn() && ai.n < 4) k.skill = true; break;
      case 'special': if (!turn() && ai.n < 4) k.special = true; break;
      case 'ult': k.up = true; if (ai.n > 1 && ai.n < 5) k.special = true; break;
      case 'awaken': if (ai.n < 3) k.awaken = true; break;
      case 'guard': k.down = true; break;
      case 'slip': k.down = true; if (ai.n > 1 && ai.n < 4) k.dash = true; break;
      case 'charge': k.attack = true; k.jump = true; break;
    }
  }
  function dummyThink(f, o, k) {   // the Training partner
    const p = f.p, dx = o.p.x - p.x;
    if (V.dummy === 3) return botThink(f, o, k);
    if (V.dummy === 1) k.down = true;                                      // holds its guard
    else if (V.dummy === 2) {                                              // walks up and throws a combo every two seconds: something to block
      const c = V.t % 120;
      if (Math.abs(dx) > 34) k[dx > 0 ? 'right' : 'left'] = true; else if (c < 40 && c % 12 < 2) k.attack = true;
    }
  }
  function readInput(f) {
    const inp = f.inp; inp.prev = inp.now; inp.now = {};
    if (f.stunT > 0) { f.stunT--; return; }   // stunned by a perfect block: no moves and no escape until it wears off
    if (f.bot) (V.mode === 'train' ? dummyThink : botThink)(f, V.f[1 - f.i], inp.now);
    else {
      const km = KEYS[f.i]; for (const a in km) if (km[a].some(c => I.raw[c])) inp.now[a] = true;
      if (f.i === 0 && V.mode !== 'pvp' && V.gin) for (const a in km) if (V.gin[a]) inp.now[a] = true;   // alone at the keyboard, the story's own controls work too (arrow keys, gamepad)
    }
    for (const a in inp.now) if (!inp.prev[a]) inp.lastHit[a] = SW.frame;
  }

  // ---------- update ----------
  function fightTick() {
    const z = V.zone;
    V.t++;
    if (G.hitstop > 0) { G.hitstop--; fx.update(); return; }
    V.f.forEach(readInput);
    V.f.forEach(f => {
      ctx(f);
      const S = f.state, e0 = S.energy, st0 = f.p.state; f.bonus = 0; f.base = 0;
      if (V.phase === 'fight') f.p.update(G, z); else f.p.settle(z);
      z.update(G);
      if (V.phase === 'fight' && !f.p.dead) {   // Versus energy economy (see GAIN): replace the story's trickle, charge and hit gains
        const m = GAIN[V.gain][1];
        if (S.energy - f.base >= e0) S.energy = e0 + (PASSIVE + (st0 === 'charge' ? CHARGE : 0)) * m;   // nothing spent this frame
        else S.energy -= f.base;
        S.energy = SW.clamp(S.energy + f.bonus, 0, 300);
      }
      if (V.mode === 'train') {
        if (V.endless && !f.bot) { S.energy = 300; if (f.p.awakeT <= 0) S.awaken = 100; }   // every move, any time
        if (V.t - f.hitT > 90) S.hp = Math.min(f.p.hpMax(), S.hp + 6);                        // left alone, both fighters heal back up
      }
      if (f.p.state !== 'hurt') f.p.juggle = 0;
      if (f.frozen > 0) f.frozen--;
      if (f.burnT > 0 && !f.p.dead && V.phase === 'fight') {
        f.burnT--;
        if (f.burnT % 30 === 0) { f.state.hp -= f.burnD; fx.text(f.p.x, f.p.y - 40, String(f.burnD), '#ff8a3a'); if (f.state.hp <= 0) { if (V.mode === 'train') f.state.hp = 1; else f.p.die(); } }
        if (f.burnT % 5 === 0) fx.list.push({ k: 'p', x: f.p.x + SW.rand(-6, 6), y: f.p.y - SW.rand(4, 30), vx: 0, vy: -0.9, g: 0, life: 12, max: 12, col: '#ff8a3a', s: 2 });
      }
    });
    ctx(null);
    fx.update();
    const A = V.f[0].p, B = V.f[1].p;
    G.cam.x += (SW.clamp((A.x + B.x) / 2 - W / 2, 0, Math.max(0, z.pw - W)) - G.cam.x) * 0.12;
    if (V.phase === 'intro') { if (V.t > 80) { V.phase = 'fight'; V.t = 0; SW.audio.sfx('roar'); } }
    else if (V.phase === 'fight') {
      if (V.mode !== 'train' && V.mode !== 'duel') V.timer--;
      const dead = [A.dead, B.dead], out = V.timer <= 0;
      if (dead[0] || dead[1] || out) {
        const r = V.f.map(f => { G.state = f.state; return Math.max(0, f.state.hp) / f.p.hpMax(); });
        V.winner = dead[0] && dead[1] ? -1 : dead[0] ? 1 : dead[1] ? 0 : r[0] === r[1] ? -1 : r[0] > r[1] ? 0 : 1;
        V.phase = 'ko'; V.t = 0; V.timeUp = out && !dead[0] && !dead[1]; G.hitstop = 18; fx.flash('#ffffff', 12); fx.shake(8, 30); SW.audio.sfx('explode');
      }
    } else if (V.phase === 'ko' && V.t > 130 && V.mode === 'duel') {   // one fall decides a duel
      V.phase = V.winner === 0 ? 'duelEnd' : 'duelLost'; V.t = 0; SW.audio.sfx(V.winner === 0 ? 'level' : 'die');
    } else if (V.phase === 'ko' && V.t > 130) {
      if (V.winner >= 0) V.wins[V.winner]++;
      if (V.wins[0] >= 2 || V.wins[1] >= 2 || V.round >= 5) {
        V.phase = 'result'; V.t = 0; SW.audio.sfx('level');
        V.champ = V.wins[0] === V.wins[1] ? -1 : V.wins[0] > V.wins[1] ? 0 : 1;
        if (V.mode === 'pvb' && V.champ === 0 && !SW.profile.ach.vs_win) { G.achieve('vs_win'); V.unlocked = D.heroes[D.achievements.vs_win.hero].name; }
      } else { V.round++; startRound(); }
    }
  }
  // ---------- menu rows, pause, move list ----------
  const menuRows = () => (V.mode === 'pvb' ? ['mode', 'diff', 'stage', 'gain', 'start'] : V.mode === 'pvp' ? ['mode', 'stage', 'gain', 'start'] : V.mode === 'rival' ? ['mode', 'diff', 'gain', 'start']
    : V.dummy === 3 ? ['mode', 'dummy', 'diff', 'stage', 'start'] : ['mode', 'dummy', 'stage', 'start']);
  const pauseItems = () => (V.mode === 'train' ? ['resume', 'dummy', 'endless', 'onscreen', 'reset', 'moves', 'quit'] : V.mode === 'duel' && !V.duelO.canQuit ? ['resume', 'moves'] : ['resume', 'moves', 'quit']);
  const pick3 = (label, value) => label + ':  <  ' + value + '  >';
  const pauseLabel = id => ({ resume: 'Resume', dummy: pick3('Dummy', DUMMY[V.dummy]), endless: pick3('Endless energy', V.endless ? 'On' : 'Off'), onscreen: pick3('Moves on screen', V.showMoves ? 'On' : 'Off'),
    reset: 'Reset positions', moves: 'Move list', quit: V.mode === 'duel' ? 'Give up the duel' : 'Quit to the Versus menu' })[id];
  function pauseUpdate(ok, back, up, down, left, right) {
    const sfx = SW.audio.sfx;
    if (V.pPage === 'moves') { if (left || right) { V.pWho = 1 - V.pWho; sfx('move'); } if (ok || back) { V.pPage = null; sfx('back'); } return; }
    const items = pauseItems(), d = (right ? 1 : 0) - (left ? 1 : 0);
    if (up) { V.pRow = (V.pRow + items.length - 1) % items.length; sfx('move'); }
    if (down) { V.pRow = (V.pRow + 1) % items.length; sfx('move'); }
    const id = items[V.pRow];
    if (back || (ok && id === 'resume')) { V.paused = false; sfx('back'); }
    else if (id === 'dummy' && (d || ok)) { V.dummy = (V.dummy + DUMMY.length + (d || 1)) % DUMMY.length; V.f[1].ai = null; sfx('move'); }
    else if (id === 'endless' && (d || ok)) { V.endless = !V.endless; sfx('move'); }
    else if (id === 'onscreen' && (d || ok)) { V.showMoves = !V.showMoves; sfx('move'); }
    else if (ok && id === 'reset') { startRound(); V.paused = false; sfx('select'); }
    else if (ok && id === 'moves') { V.pPage = 'moves'; V.pWho = 0; sfx('select'); }
    else if (ok && id === 'quit') { V.paused = false; sfx('back'); if (V.mode === 'duel') endDuel('lose'); else quit(true); }
  }
  // a hero's moves for the lists: the kit without its story-only traversal slot. key is the input with any "(when ...)" note removed.
  function moveRows(hero) {
    const h = D.heroes[hero];
    return h.kit.filter((id, i) => D.abilities[id] && !(h.kit.length >= 7 && i === 3)).map(id => {
      const a = D.abilities[id], ult = id === h.ultimate;
      return { key: String(a.input || '').replace(/\s*\(.*\)\s*/g, '').replace(/ in .*$| awakened$/, '').trim(), name: a.name, cost: ult ? '300' : a.cost ? String(a.cost) : '', long: ult ? '300 energy, or 100 awakened' : a.cost ? a.cost + ' energy' : '', desc: a.desc || '' };
    });
  }

  V.update = function (g) {
    const keep = { now: I.now, prev: I.prev, lastHit: I.lastHit }, keys = I.keys.splice(0);
    const ok = I.ok(), back = I.hit('pause'), up = I.hit('up'), down = I.hit('down'), left = I.hit('left'), right = I.hit('right'), rnd = I.hit('skill');
    if (V.phase === 'menu') {
      let rows = menuRows();
      if (up) { V.row = (V.row + rows.length - 1) % rows.length; SW.audio.sfx('move'); }
      if (down) { V.row = (V.row + 1) % rows.length; SW.audio.sfx('move'); }
      const d = (right ? 1 : 0) - (left ? 1 : 0), id = rows[V.row];
      if (d) {
        if (id === 'mode') { V.mode = MODES[(MODES.findIndex(m => m[0] === V.mode) + MODES.length + d) % MODES.length][0]; V.row = 0; }
        else if (id === 'diff') V.diff = (V.diff + 3 + d) % 3;
        else if (id === 'dummy') V.dummy = (V.dummy + DUMMY.length + d) % DUMMY.length;
        else if (id === 'stage') V.stage = (V.stage + STAGES.length + d) % STAGES.length;
        else if (id === 'gain') V.gain = (V.gain + GAIN.length + d) % GAIN.length;
        SW.audio.sfx('move');
      }
      if (back) { quit(false); SW.audio.sfx('back'); }
      else if (ok) { SW.audio.sfx('select'); V.phase = 'pick'; V.step = 0; }
    } else if (V.phase === 'pick') {
      const i = ui.gridMove(V.pick[V.step], left, right, up, down);
      if (i !== V.pick[V.step]) { V.pick[V.step] = i; SW.audio.sfx('move'); }
      if (rnd) { V.pick[V.step] = Math.random() * D.heroOrder.length | 0; SW.audio.sfx('move'); }
      if (back) { SW.audio.sfx('back'); if (V.step) V.step = 0; else V.phase = 'menu'; }
      else if (ok) {
        SW.audio.sfx('select');
        if (V.mode === 'rival') { const hero = D.heroOrder[V.pick[0]]; V.duel({ hero, rival: D.heroes[hero].route === 'kael' ? 'nyra' : 'kael', diff: V.diff, title: 'THE CRATER' }); }   // the lead hero of the other road
        else if (V.step === 0) V.step = 1; else startMatch();
      }
    } else if (V.phase === 'duelEnd') {
      V.t++; if (V.t > 120 || (V.t > 40 && ok)) endDuel('win');
    } else if (V.phase === 'duelLost') {
      V.t++;
      if (V.t > 30 && ok) { SW.audio.sfx('select'); startRound(); }
      else if (back && V.duelO.canQuit) endDuel('lose');
    } else if (V.phase === 'result') {
      V.t++;
      if (V.t > 30 && ok) { SW.audio.sfx('select'); V.wins = [0, 0]; V.round = 1; V.unlocked = null; startRound(); SW.audio.music('boss'); }
      else if (rnd) { quit(true); V.phase = 'pick'; V.step = 0; }
      else if (back) quit(true);
    } else {
      V.gin = keep.now;
      if (V.paused) pauseUpdate(ok, back, up, down, left, right);
      else if (back) { V.paused = true; V.pRow = 0; V.pPage = null; SW.audio.sfx('select'); }   // Esc pauses; quitting is on the pause screen
      else fightTick();
    }
    I.now = keep.now; I.prev = keep.prev; I.lastHit = keep.lastHit;
    void keys;
  };

  // ---------- drawing ----------
  function hud(ctx) {
    V.f.forEach((f, i) => {
      const h = D.heroes[f.hero], S = f.state, left = i === 0, bx = left ? 8 : W - 8 - 190;
      G.state = S;
      const mx = f.p.hpMax(), hw = Math.round(190 * SW.clamp(S.hp / mx, 0, 1));
      art.rect(ctx, '#05060c', bx - 1, 9, 192, 11); art.rect(ctx, '#2a1418', bx, 10, 190, 9);
      art.rect(ctx, S.hp / mx < 0.3 ? '#ff5a5a' : '#6fe89a', left ? bx : bx + 190 - hw, 10, hw, 9); art.rect(ctx, '#ffffff', left ? bx : bx + 190 - hw, 10, hw, 1);
      text(ctx, V.mode === 'duel' ? duelName(i) : (f.bot ? (V.mode === 'train' ? 'DUMMY ' : 'BOT ') : 'P' + (i + 1) + ' ') + h.name.toUpperCase(), left ? bx : bx + 190, 0, h.color, { align: left ? 'left' : 'right' });
      for (let k = 0; k < 3; k++) { const e = SW.clamp((S.energy - k * 100) / 100, 0, 1), ex = left ? bx + k * 34 : bx + 190 - 32 - k * 34; art.rect(ctx, '#05060c', ex - 1, 21, 34, 6); art.rect(ctx, '#22202e', ex, 22, 32, 4); art.rect(ctx, e >= 1 ? h.colorHi : h.color, left ? ex : ex + 32 - Math.round(32 * e), 22, Math.round(32 * e), 4); }
      const aw = SW.clamp(S.awaken / 100, 0, 1), ax = left ? bx + 106 : bx + 4;
      art.rect(ctx, '#05060c', ax - 1, 22, 82, 4); art.rect(ctx, f.p.awakeT > 0 ? h.colorHi : aw >= 1 && SW.frame % 16 < 8 ? '#ffffff' : '#8b5cf6', left ? ax : ax + 80 - Math.round(80 * aw), 23, Math.round(80 * aw), 2);
      if (V.mode !== 'train' && V.mode !== 'duel') for (let k = 0; k < 2; k++) art.rect(ctx, k < V.wins[i] ? '#f5c542' : '#3a3d55', left ? bx + 190 - 8 - k * 9 : bx + 2 + k * 9, 30, 6, 6);
      else if (V.mode === 'train' && f.cm) text(ctx, 'COMBO  ' + f.cm.hits + (f.cm.hits === 1 ? ' hit  ' : ' hits  ') + Math.round(f.cm.dmg) + ' damage', left ? bx : bx + 190, 40, '#f5c542', { align: left ? 'left' : 'right' });   // last combo taken
      if (S.energy >= 300 || (f.p.awakeT > 0 && S.energy >= 100)) text(ctx, 'ULTIMATE READY: W + I', left ? bx : bx + 190, 30, SW.frame % 30 < 20 ? '#ffffff' : h.color, { align: left ? 'left' : 'right' });
      if (f.frozen > 0) art.rect(ctx, '#bfefff', Math.round(f.p.x - G.cam.x) - 6, Math.round(f.p.y - G.cam.y) - 40, 12, 2);
      if (f.stunT > 0 && V.phase === 'fight') for (let k = 0; k < 3; k++) { const a = SW.frame * 0.25 + k * 2.094; art.rect(ctx, k ? '#ffe066' : '#ffffff', Math.round(f.p.x - G.cam.x + Math.cos(a) * 9) - 1, Math.round(f.p.y - G.cam.y - 40 + Math.sin(a) * 3) - 1, 3, 3); }   // stars circling a stunned fighter
    });
    if (V.mode === 'train') {
      text(ctx, 'TRAINING', W / 2, 8, '#f5c542', { align: 'center' });
      if (!V.paused) text(ctx, 'Dummy: ' + DUMMY[V.dummy] + '      Esc: options and the full move list', W / 2, 259, '#8a92b8', { align: 'center' });
      if (V.showMoves && !V.paused) {   // P1's moves, top left under the bars
        const h = D.heroes[V.f[0].hero], rows = moveRows(V.f[0].hero);
        ctx.globalAlpha = 0.6; art.rect(ctx, '#05060c', 6, 50, 176, rows.length * 9 + 5); ctx.globalAlpha = 1;
        rows.forEach((r, i) => { const y = 53 + i * 9; text(ctx, r.key, 10, y, '#f5c542'); text(ctx, r.name, 56, y, h.colorHi); if (r.cost) text(ctx, r.cost, 178, y, '#bfe8ff', { align: 'right' }); });
      }
    } else if (V.mode === 'duel') text(ctx, 'DUEL', W / 2, 8, '#f5c542', { align: 'center' });   // no clock: it ends when one of them falls
    else text(ctx, String(Math.max(0, Math.ceil(V.timer / 60))), W / 2, 6, V.timer < 600 ? '#ff5a5a' : '#ffffff', { align: 'center', scale: 2 });
    const big = (s, c, sub) => { art.rect(ctx, '#05060c', 0, 96, W, sub ? 52 : 40); text(ctx, s, W / 2, 104, c, { align: 'center', scale: 3 }); if (sub) text(ctx, sub, W / 2, 134, '#ffffff', { align: 'center' }); };
    if (V.phase === 'intro') big(V.t < 50 ? (V.mode === 'duel' ? V.duelO.title || 'RIVAL DUEL' : 'ROUND ' + V.round) : 'FIGHT!', V.t < 50 ? '#ffffff' : '#f5c542');
    else if (V.phase === 'ko' && V.mode === 'duel') big('K.O.', '#ff5a5a', V.winner < 0 ? 'Both fall' : duelName(V.winner) + ' is still standing');
    else if (V.phase === 'duelEnd') big('DUEL WON', '#f5c542', duelName(1) + ' yields');
    else if (V.phase === 'duelLost') big('DEFEATED', '#ff5a5a', 'J / Enter: try again' + (V.duelO.canQuit ? '        Esc: give up' : ''));
    else if (V.phase === 'ko') big(V.timeUp ? 'TIME UP' : 'K.O.', '#ff5a5a', V.winner < 0 ? 'Draw' : (V.f[V.winner].bot ? 'The bot' : 'Player ' + (V.winner + 1)) + ' takes the round');
    else if (V.phase === 'result') {
      const w = V.champ, n = w < 0 ? 'DRAW' : D.heroes[V.f[w].hero].name.toUpperCase() + ' WINS';
      big(n, w < 0 ? '#ffffff' : D.heroes[V.f[w].hero].color, (w < 0 ? '' : (V.f[w].bot ? 'The bot' : 'Player ' + (w + 1)) + '   ') + V.wins[0] + ' - ' + V.wins[1]);
      if (V.unlocked) text(ctx, 'ACHIEVEMENT: Duelist  -  NEW STORY HERO UNLOCKED: ' + V.unlocked.toUpperCase(), W / 2, 156, '#f5c542', { align: 'center' });
      text(ctx, 'J / Enter: rematch     U: change heroes     Esc: Versus menu', W / 2, 250, '#8a92b8', { align: 'center' });
    }
  }
  function drawFight(ctx) {
    const z = V.zone, A = V.f[0], B = V.f[1];
    G.state = A.state; G.player = A.p; G.combo = null;
    z.ents = A.ents.concat(B.ents, [{ draw(c, cam) { G.state = B.state; G.player = B.p; B.p.draw(c, cam, G); G.state = A.state; G.player = A.p; } }]);
    z.shots = A.shots.concat(B.shots);
    const sh = fx.shakeT > 0 ? fx.shakeAmt : 0;
    z.draw(ctx, { x: Math.round(G.cam.x + (sh ? SW.rand(-sh, sh) : 0)), y: Math.round(G.cam.y + (sh ? SW.rand(-sh, sh) : 0)) }, G);
    if (fx.flashT > 0) { ctx.globalAlpha = 0.7 * fx.flashT / fx.flashMax; art.rect(ctx, fx.flashCol, 0, 0, W, H); ctx.globalAlpha = 1; }
    hud(ctx);
    if (SW.drawCutin) SW.drawCutin(ctx);   // ultimate splash art (heroes3.js)
    G.state = A.state;
    if (V.paused) drawPause(ctx);
  }
  function drawPause(ctx) {
    if (V.pPage === 'moves') { drawMoves(ctx, V.f[V.pWho]); return; }
    const items = pauseItems(), y0 = 104 - items.length * 7;
    ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, V.mode === 'train' ? 'TRAINING' : 'PAUSED', W / 2, y0 - 36, '#f5c542', { align: 'center', scale: 3 });
    items.forEach((id, i) => { const on = V.pRow === i; text(ctx, (on ? '> ' : '') + pauseLabel(id), W / 2, y0 + i * 16, on ? '#f5c542' : '#ffffff', { align: 'center' }); });
    text(ctx, 'W / S: move    A / D: change    J / Enter: choose    Esc: resume', W / 2, 250, '#8a92b8', { align: 'center' });
  }
  function drawMoves(ctx, f) {   // one fighter's full move list
    const h = D.heroes[f.hero], rows = moveRows(f.hero), name = h.name.toUpperCase(), who = V.mode === 'duel' ? (f.bot ? 'RIVAL' : 'YOU') : f.bot ? (V.mode === 'train' ? 'DUMMY' : 'BOT') : 'PLAYER ' + (f.i + 1);
    art.rect(ctx, '#05060c', 0, 0, W, H);
    text(ctx, name, 12, 6, h.color, { scale: 2 });
    text(ctx, who + '   -   ' + h.title + '   -   ' + h.element, 22 + SW.textW(name) * 2, 12, '#ffffff');
    text(ctx, 'J combo    W + J launcher    S + J sweep    J in the air: air combo    K jump    L dash', 12, 27, '#8a92b8');
    text(ctx, 'S guard    S + L or W + L slipstep (60 energy)    J + K charge energy', 12, 36, '#8a92b8');
    let y = 50;
    rows.forEach(r => {
      text(ctx, r.key, 12, y, '#f5c542'); text(ctx, r.name, 74, y, h.colorHi); if (r.long) text(ctx, r.long, W - 12, y, '#bfe8ff', { align: 'right' });
      y += 9;
      SW.wrap(r.desc, W - 74 - 12).forEach(ln => { text(ctx, ln, 74, y, '#c8ccd8'); y += 8; });
      y += 3;
    });
    if (h.blurb && y < 226) { text(ctx, 'About', 12, y + 2, '#8a92b8'); SW.wrap(String(SW.i18n ? SW.i18n.tr(h.blurb) : h.blurb).replace(/\n/g, ' '), W - 74 - 12).slice(0, 2).forEach((ln, i) => text(ctx, ln, 74, y + 2 + i * 8, '#8a92b8')); }
    if (f.i === 1 && !f.bot) text(ctx, 'Player 2 keys: arrows = W A S D,   1 2 3 = J K L,   4 5 6 = U I O', W / 2, 249, '#ff8a8a', { align: 'center' });
    text(ctx, 'A / D: other fighter      J / Esc: back', W / 2, 260, '#8a92b8', { align: 'center' });
  }
  V.draw = function (ctx) {
    if (V.phase === 'menu') {
      const bg = art.bg.title;
      if (bg) ctx.drawImage(bg, 0, 0);
      ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
      text(ctx, 'VERSUS', W / 2, 22, '#f5c542', { align: 'center', scale: 3 });
      text(ctx, V.mode === 'train' ? 'Practise against a dummy: no timer, endless energy, moves on screen.' : V.mode === 'rival' ? 'One fall, no clock, at the Crater: you against the lead hero of the other road.'
        : 'Two heroes, best of three. Every hero is available here.', W / 2, 52, '#bfe8ff', { align: 'center' });
      const label = { mode: ['Mode', MODES.find(m => m[0] === V.mode)[1]], diff: ['Bot level', DIFF[V.diff]], dummy: ['Dummy', DUMMY[V.dummy]], stage: ['Stage', STAGES[V.stage][0]], gain: ['Energy gain', GAIN[V.gain][0]], start: ['Choose heroes', ''] };
      const rows = menuRows().map(id => label[id]);
      rows.forEach((r, i) => { const on = V.row === i, y = 70 + i * 16; text(ctx, (on ? '> ' : '  ') + r[0], 130, y, on ? '#f5c542' : '#ffffff'); if (r[1]) text(ctx, '<  ' + r[1] + '  >', 240, y, on ? '#ffffff' : '#8a92b8'); });
      ui.panel(ctx, 28, 154, 432, 76, '#3a3d55', 0.7);
      text(ctx, 'P1   W A S D move    J attack   K jump   L dash   U skill   I special   O awaken', 36, 161, '#22d3ee');
      text(ctx, 'P2   arrows move      1 attack   2 jump   3 dash   4 skill   5 special   6 awaken', 36, 173, '#ff8a8a');
      text(ctx, '     (P2 uses the number pad, or 7 8 9 0 - = on the top row)', 36, 183, '#8a92b8');
      text(ctx, 'Ultimate: hold up + special with a full energy bar.  Escape a combo: down + dash.', 36, 196, '#ffffff');
      text(ctx, 'Guard: hold down. A guard timed just as the hit lands stuns the attacker.', 36, 208, '#ffe066');
      text(ctx, 'Energy: land hits or take them. Holding attack + jump charges it slowly.', 36, 220, '#ffffff');
      text(ctx, 'W / S: move    A / D: change    J / Enter: next    Esc: back', W / 2, 250, '#8a92b8', { align: 'center' });
    } else if (V.phase === 'pick') {
      const who = V.mode === 'rival' ? 'CHOOSE YOUR HERO' : V.step === 0 ? 'PLAYER 1: CHOOSE YOUR HERO' : V.mode === 'pvb' ? "CHOOSE THE BOT'S HERO" : V.mode === 'train' ? "CHOOSE THE DUMMY'S HERO" : 'PLAYER 2: CHOOSE YOUR HERO';
      ui.heroGrid(ctx, { title: who, cursors: V.step === 0 ? [V.pick[0]] : [V.pick[0], V.pick[1]], colors: ['#22d3ee', '#ff5a5a'], tags: ['P1', V.mode === 'pvb' ? 'BOT' : V.mode === 'train' ? 'DUMMY' : 'P2'], open: () => true });
      const h = D.heroes[D.heroOrder[V.pick[V.step]]];
      text(ctx, h.name.toUpperCase() + '  -  ' + h.title, 10, 235, h.color);
      text(ctx, h.element + '     Signature: ' + h.sig + '     Ultimate: ' + D.abilities[h.ultimate].name, 10, 245, '#ffffff');
      text(ctx, 'Move: W A S D or arrows    J / Enter: pick    U: random    Esc: back', 10, 257, '#8a92b8');
    } else drawFight(ctx);
  };
})();
