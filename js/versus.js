'use strict';
// Shattered Worlds — Versus mode: two heroes fight, best of three. Player vs Player (two keyboards' worth of
// keys on one keyboard) or Player vs Bot. Every hero is available here, locked or not.
// Player vs Bot, Player vs Player and Bot vs Bot have a Format row: 1 vs 1 (best of three) or 3 vs 3 (teams, see FORMATS).
// Bot vs Bot: two bots fight while you watch, each at its own level, at normal, double or four times speed.
// Training: no timer, no knock-outs, a dummy that does what you tell it, and the move list on screen.
// Esc pauses any fight; the pause screen has the full move list for both fighters.
//
// Both fighters are ordinary Player objects. The base game assumes one player and one global input, so each
// fighter gets a "context" (its own state, input, summons and projectiles) that is swapped in while it updates,
// and it sees its opponent as a proxy "enemy" in its entity list.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, W = SW.W, H = SW.H, text = SW.text;
  const V = SW.versus = { phase: 'menu', mode: 'pvb', diff: 1, stage: 0, gain: 1, row: 0, pick: [0, 1], step: 0, f: [], wins: [0, 0], round: 1, t: 0, cur: null,
    dummy: 0, endless: true, showMoves: true, paused: false, pRow: 0, pPage: null, pWho: 0, diff2: 1, speed: 0, tsize: 0, entry: 0, tskip: 0, tourBots: false, tour: null, fmt: 0, team: [[], []], ti: [0, 0], oRow: 0, oCol: 0, oMark: null };
  // Bot vs Bot: nobody plays, two bots fight each other (each with its own level); Esc > Speed runs it faster
  const MODES = [['pvb', 'Player vs Bot'], ['pvp', 'Player vs Player'], ['bvb', 'Bot vs Bot'], ['tour', 'Tournament'], ['arcade', 'Arcade'], ['surv', 'Survival'], ['train', 'Training'], ['rival', 'Rival Duel']];
  // Tournament: a knockout bracket of 8, 16 or every open hero (byes fill it up to 16 or 32), 1 vs 1, best of three.
  // Entry "Play": you pick a hero and play your own matches against the bots; "Watch": bots only. Every other match is
  // bot against bot at the menu's bot level, watched at the chosen speed, or settled at once with "Bot matches: Skip".
  const TSIZE = [['8 heroes', 8], ['16 heroes', 16], ['All heroes', 0]], ENTRY = ['Play', 'Watch'], TSKIP = ['Watch', 'Skip'];   // while a duel runs V.mode is 'duel'
  const SPEEDS = [['Normal', 1], ['Fast', 2], ['Very fast', 4]];
  const lvOf = f => (f.lv !== undefined ? f.lv : V.diff);   // a bot's level: its own in Bot vs Bot, else the menu's
  const isTour = () => V.mode === 'tour';
  const isBvb = () => V.mode === 'bvb' || (isTour() && !!V.tourBots);   // a tournament match between two bots plays as Bot vs Bot
  // Format (Player vs Bot, Player vs Player, Bot vs Bot): 1 vs 1 is best of three; 3 vs 3 is a team battle. Each side picks
  // three heroes and sets their order; when a hero falls (or loses on time) the next one steps in, and the hero still standing
  // stays in with the health they had left plus TEAM_HEAL of their maximum (energy carries over too). The last team with a hero wins.
  const FORMATS = ['1 vs 1', '3 vs 3'], TEAM_HEAL = 0.2;
  const team3 = () => V.fmt === 1 && (V.mode === 'pvb' || V.mode === 'pvp' || V.mode === 'bvb' || V.mode === 'arcade' || V.mode === 'surv');
  const teamName = s => (isBvb() ? 'BOT ' + (s + 1) : s === 1 && (V.mode === 'pvb' || V.mode === 'arcade') ? 'BOT' : 'PLAYER ' + (s + 1));
  // Arcade: one player against a ladder of RUNGS bot opponents (1 vs 1 or 3 vs 3), each a full match. The bots get harder
  // (RUNG_LV: Easy, Easy, Normal, Normal, Hard, Hard) and the last one is a legend (in 3 vs 3, the last of its team).
  // A lost match can be continued (fight that stage again; continues are counted). The clock counts fighting time only.
  // Best clear per format (fewest continues, then fastest) is kept in localStorage ARC_KEY.
  const RUNGS = 6, RUNG_LV = [0, 0, 1, 1, 2, 2], ARC_KEY = 'shattered-worlds-arcade-v1';
  const isArc = () => V.mode === 'arcade';
  // Survival: one player against bot after bot, one fall each, until the player's hero (or all three of a 3 vs 3 team, who
  // are the player's lives and step in as each falls) is down. The hero still standing after a fight keeps their health plus
  // TEAM_HEAL. Opponents: Easy for fights 1-3, Normal to 8, then Hard and SURV_HP more health per fight after the 10th;
  // every 10th is a legend. Best run per format (most wins, then fastest) is kept in localStorage SURV_KEY.
  const SURV_KEY = 'shattered-worlds-survival-v1', SURV_HP = 10;
  const EDGE = 14;   // px a fighter is kept from the arena's left and right ends
  const isSurv = () => V.mode === 'surv', solo = () => isArc() || isSurv();
  const survBest = () => { try { return JSON.parse(localStorage.getItem(SURV_KEY)) || {}; } catch (e) { return {}; } };
  const arcBest = () => { try { return JSON.parse(localStorage.getItem(ARC_KEY)) || {}; } catch (e) { return {}; } };
  const clock = n => { const s = n / 60, m = Math.floor(s / 60), r = s - m * 60; return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r.toFixed(2); };
  const DUMMY = ['Stands still', 'Guards', 'Attacks', 'Fights back'];   // what the Training dummy does
  const STAGES = [['Random', null], ['Pit Arena', 'arena'], ['Deepline Slums', 'slums'], ['Neon Market', 'market'], ['Old Metro', 'metro'], ['Med-Lab', 'lab'], ['Skyport', 'sky'], ['Rust Flats', 'surface']];
  // three arenas that exist only here (backdrops: assets/bg/vs_*.png, prompts in tools/higgsfield-arenas.json)
  Object.assign(art.themes, {
    vs_crater:  { style: 'dirt',  a: '#4a3a6a', b: '#3c2e58', top: '#8a6ac8', hi: '#c8a8ff', deep: '#1c1430', plat: '#6a5a8a', sky: ['#120a26', '#3a1f5c'], mid: 'ruins',  midCol: '#1a1030', bg: 'vs_crater',  dim: 0.16, haz: '#b48cff', win: ['#b48cff'] },
    vs_spire:   { style: 'plate', a: '#46507a', b: '#384064', top: '#c8ccdc', hi: '#ffe9a8', deep: '#161a30', plat: '#d9b45a', sky: ['#0a1030', '#2a3a78'], mid: 'clouds', midCol: '#ffffff', bg: 'vs_spire',   dim: 0.14, haz: '#6fd3e8', win: ['#d9b45a'] },
    vs_foundry: { style: 'brick', a: '#4a2c24', b: '#3a221c', top: '#a8502a', hi: '#ffb060', deep: '#180c0a', plat: '#6a4a3a', sky: ['#140606', '#3a1208'], mid: 'arches', midCol: '#1a0a08', bg: 'vs_foundry', dim: 0.22, haz: '#ff8a3a', win: ['#ff8a3a'] }
  });
  ['vs_crater', 'vs_spire', 'vs_foundry'].forEach(n => { const im = new Image(); im.onload = () => { art.bg[n] = im; }; im.src = 'assets/bg/' + n + '.png'; });
  STAGES.push(['Crater Rim', 'vs_crater'], ['Aurelia Spire', 'vs_spire'], ['Deep Foundry', 'vs_foundry'], ['Hidden Gorge', 'vs_clans']);   // vs_clans: theme and backdrop in ninja-core.js
  const DIFF = ['Easy', 'Normal', 'Hard'];
  // Energy in Versus comes from fighting, not from standing still. GAIN is the menu's "Energy gain" row: [label, multiplier].
  // Per frame: PASSIVE trickle, CHARGE while holding attack + jump (the story charges at 1.25). Per hit landed: HIT_MELEE for
  // a combo hit, HIT_SKILL for a skill / special / summon hit, nothing during the ultimate. The fighter who is hit gets HIT_TAKEN x damage.
  const GAIN = [['Slow', 0.6], ['Normal', 1], ['Fast', 1.6]], PASSIVE = 0.045, CHARGE = 0.6, HIT_MELEE = 10, HIT_SKILL = 3, HIT_TAKEN = 0.5;
  // Perfect block (guard in the last few frames before a hit): frames the attacker is stunned, and how often a bot's
  // well-timed guard counts as perfect on Easy / Normal / Hard.
  const STUN_MELEE = 60, STUN_RANGED = 30, BOT_PERFECT = [0.1, 0.25, 0.45], BOT_PERFECT_GAP = 180;   // and never two within three seconds
  // Versus balance table: every hit a hero lands in Versus is multiplied by their entry; heroes not listed deal normal
  // damage. The story itself is not affected (and the Crater duel switches the table off for its two fighters).
  // The ten legend heroes are NOT listed, by the user's choice: they are meant to be super strong and stay that way here
  // (they win about 87% of rounds against the rest). The table only evens out the other fifteen against each other.
  // The numbers come from a bot tournament among those fifteen (every pair, both sides, bots on Normal): untuned, their
  // win rates ran from 30% to 77%; with this table they run from about 41% to 59%.
  // To re-measure after changing heroes, see "Versus balance" in the README.
  // Brakk 1.1 -> 1.2 after a recorded tournament: at 1.1 he won 40% of 112 rounds against the other fourteen (1.2: 51%).
  // Re-solved 2026-11-15 with all 34 non-legend fighters in one pool (these fifteen, the Hidden Clans and the Convergence),
  // 2 rounds per ordered pair per pass, 5 passes, then a few edge cases nudged by hand: 37-64% before, about 41-57% after.
  V.tune = {
    kael: 1.35, nyra: 1.1, fenn: 0.6, isolde: 0.8, brakk: 1.3, pyra: 1.25, gale: 1.45, ashka: 0.95, dyna: 1.35, vesper: 1.1,
    kiri: 1.1, tarn: 1.1, maren: 0.95, yara: 1.3, brann: 0.75
  };
  const KEYS = [
    { left: ['KeyA'], right: ['KeyD'], up: ['KeyW'], down: ['KeyS'], attack: ['KeyJ'], jump: ['KeyK'], dash: ['KeyL'], skill: ['KeyU'], special: ['KeyI'], awaken: ['KeyO'], throw: [] },   // throw: the touch button (J + L works anyway)
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
    if (f.bot && p.state === 'guard' && p.guardT <= 6 && (Math.random() > BOT_PERFECT[lvOf(f)] || V.t - (f.pfT === undefined ? -999 : f.pfT) < BOT_PERFECT_GAP)) p.guardT = 7;   // a bot does not get every perfect block
    const r = p.takeHit(Object.assign({}, atk, { dmg, src: null, srcX: atk.srcX === undefined ? (me ? me.p.x : p.x) : atk.srcX }), G);
    if (r === 'perfect') { V.perfects = (V.perfects || 0) + 1; f.pfT = V.t; }
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
      f.ents = [proxy(V.f[1 - i])]; f.shots = []; f.combo = null; f.inp = { now: {}, prev: {}, lastHit: {} }; f.burnT = 0; f.frozen = 0; f.stunT = 0; f.bonus = 0; f.base = 0; f.ai = null; f.cm = null; f.hitT = -999; f.pfT = undefined;
    });
    V.phase = V.mode === 'train' ? 'fight' : 'intro'; V.t = 0; V.timer = 60 * 60; V.winner = -1;
    G.cam.x = Math.max(0, z.pw / 2 - W / 2); G.cam.y = Math.max(0, z.ph - H);
  }
  function sideFighter(s, idx) {   // side 0 (left) or 1 (right) of a Versus match, hero by its index in D.heroOrder
    const f = makeFighter(s, D.heroOrder[idx], s === 0 ? isBvb() : V.mode !== 'pvp');
    if (isBvb()) f.lv = s ? V.diff2 : V.diff;
    if (isArc() && s === 1) f.lv = RUNG_LV[V.arc.rung];
    if (isSurv() && s === 1) { const k = V.sv.n + 1; f.lv = k <= 3 ? 0 : k <= 8 ? 1 : 2; f.state.hpBonus += SURV_HP * Math.max(0, k - 10); }
    return f;
  }
  // a Hidden Clans fighter still locked (no unlock code yet) is never drawn as an opponent
  const clanLocked = i => { const id = D.heroOrder[i], h = D.heroes[id]; return !!(h && h.clan && SW.lockedVs && SW.lockedVs(id)); };
  // ---------- survival ----------
  function survOpp() {   // the next opponent (fight number V.sv.n + 1): a legend every 10th fight
    const all = D.heroOrder.map((id, i) => i), k = V.sv.n + 1, last = V.team[1] && V.team[1][V.team[1].length - 1];
    let pool = all.filter(i => !!D.heroes[D.heroOrder[i]].legend === (k % 10 === 0) && V.sv.mine.indexOf(i) < 0 && i !== last && !clanLocked(i));
    if (!pool.length) pool = all.filter(i => V.sv.mine.indexOf(i) < 0 && !clanLocked(i));
    return pool[Math.random() * pool.length | 0];
  }
  function startSurvival(mine) {
    V.sv = { n: 0, time: 0, mine: mine.slice(), rec: false };
    V.team = [mine.slice(), []]; V.team[1].push(survOpp());
    startMatch();
  }
  function survEnd() {   // the player's last hero is down
    const S = V.sv, best = survBest(), k = S.mine.length === 3 ? '3v3' : '1v1', b = best[k];
    S.rec = S.n > 0 && (!b || S.n > b.n || (S.n === b.n && S.time < b.t));
    if (S.rec) { best[k] = { n: S.n, t: S.time, heroes: S.mine.map(i => D.heroOrder[i]) }; try { localStorage.setItem(SURV_KEY, JSON.stringify(best)); } catch (e) { /* private window */ } }
    quit(true); V.phase = 'svOver'; V.t = 0; SW.audio.sfx(S.rec ? 'level' : 'die');
  }
  // ---------- arcade ladder ----------
  function startArcade() {   // the player's hero or team is chosen (V.pick[0] / V.team[0]): draw up the six opponents
    const n = team3() ? 3 : 1, mine = team3() ? V.team[0] : [V.pick[0]];
    const all = D.heroOrder.map((id, i) => i), shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0, x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
    let pool = all.filter(i => !D.heroes[D.heroOrder[i]].legend && mine.indexOf(i) < 0 && !clanLocked(i));
    if (pool.length < n) pool = all.filter(i => mine.indexOf(i) < 0 && !clanLocked(i));
    const legends = all.filter(i => D.heroes[D.heroOrder[i]].legend), boss = legends.length ? legends[Math.random() * legends.length | 0] : pool[0];
    let deck = [];
    const draw = team => { for (let tries = 0; tries < 99; tries++) { if (!deck.length) deck = shuffle(pool.slice()); const x = deck.pop(); if (team.indexOf(x) < 0 && x !== boss) return x; } return pool[0]; };
    const opp = [];
    for (let r = 0; r < RUNGS; r++) { const t = []; while (t.length < (r === RUNGS - 1 ? n - 1 : n)) t.push(draw(t)); if (r === RUNGS - 1) t.push(boss); opp.push(t); }
    V.arc = { rung: 0, opp, time: 0, cont: 0, mine: mine.slice(), rec: false };
    V.phase = 'ladder'; V.t = 0;
  }
  function arcFight() {   // the current rung's match
    const o = V.arc.opp[V.arc.rung];
    if (team3()) V.team = [V.arc.mine.slice(), o.slice()]; else V.pick = [V.arc.mine[0], o[0]];
    startMatch();
  }
  function arcResult() {   // after a finished match: next rung, the clear screen, or the continue screen
    const A = V.arc, won = V.champ === 0;
    quit(true);
    if (!won) { V.phase = 'arcOver'; V.t = 0; return; }
    A.rung++;
    if (A.rung < RUNGS) { V.phase = 'ladder'; V.t = 0; return; }
    const best = arcBest(), k = team3() ? '3v3' : '1v1', b = best[k];
    A.rec = !b || A.cont < b.cont || (A.cont === b.cont && A.time < b.t);
    if (A.rec) { best[k] = { t: A.time, cont: A.cont, heroes: A.mine.map(i => D.heroOrder[i]) }; try { localStorage.setItem(ARC_KEY, JSON.stringify(best)); } catch (e) { /* private window */ } }
    V.phase = 'arcClear'; V.t = 0; SW.audio.sfx('level'); SW.audio.sfx('shard');
  }
  // ---------- tournament ----------
  // V.tour = { size, R, me, cur, last, done }: R[0] is the draw (hero ids, null for a bye), R[r + 1][m] the winner of
  // match m of round r. The player (if playing) is always side 0 of their own matches.
  // every fighter open in Versus, the Convergence included (outside Player vs Bot it fights as a playable fighter, js/vsboss.js)
  const tourOpen = () => D.heroOrder.filter(id => !(SW.lockedVs && SW.lockedVs(id)));
  const shuffled = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0, x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
  function startTour(meIdx) {
    const me = meIdx === undefined ? null : D.heroOrder[meIdx], want = TSIZE[V.tsize][1];
    const pool = shuffled(tourOpen().filter(id => id !== me)), n = Math.min(want || 64, pool.length + (me ? 1 : 0));
    const size = want || (n <= 8 ? 8 : n <= 16 ? 16 : n <= 32 ? 32 : 64), ent = shuffled((me ? [me] : []).concat(pool).slice(0, n));
    let byes = size - ent.length; const slots = [];
    for (let i = 0; i < size / 2; i++) { slots.push(ent.length ? ent.shift() : null); slots.push(byes > 0 ? (byes--, null) : ent.length ? ent.shift() : null); }
    V.tour = { size, R: [slots], me, cur: null, last: null, done: false, champ: null };
    settle(); V.phase = 'bracket'; V.t = 0;
  }
  function setWin(r, m, w) {
    const T = V.tour; (T.R[r + 1] = T.R[r + 1] || [])[m] = w;
    if (T.R[r].length === 2) { T.done = true; T.champ = w; }
  }
  function settle() {   // move byes along; return the next match that needs fighting, or null when the bracket is done
    const T = V.tour;
    for (let r = 0; T.R[r] && T.R[r].length > 1; r++) for (let m = 0; m < T.R[r].length / 2; m++) {
      if (T.R[r + 1] && T.R[r + 1][m] !== undefined) continue;
      const a = T.R[r][m * 2], b = T.R[r][m * 2 + 1];
      if (a === undefined || b === undefined) continue;
      if (a === null || b === null) { setWin(r, m, a || b); return settle(); }
      return { r, m, a, b };
    }
    return null;
  }
  function tourNext() {
    const T = V.tour, M = settle();
    if (!M) return;
    const mine = !!T.me && (M.a === T.me || M.b === T.me), s0 = mine ? T.me : M.a;
    T.cur = Object.assign(M, { s0, s1: s0 === M.a ? M.b : M.a, mine });
    V.tourBots = !mine; V.diff2 = V.diff;
    V.pick = [D.heroOrder.indexOf(T.cur.s0), D.heroOrder.indexOf(T.cur.s1)];
    if (!mine && V.tskip === 1) { simulate(); return; }
    startMatch();
  }
  function simulate() {   // a bot match settled at once, in silence
    const sfx = SW.audio.sfx, mus = SW.audio.music; SW.audio.sfx = () => {}; SW.audio.music = () => {}; V.simulating = true;   // js/voice.js stays quiet too
    try { startMatch(); let n = 0; while ((V.phase === 'intro' || V.phase === 'fight' || V.phase === 'ko') && n++ < 60 * 60 * 8) fightTick(); }
    finally { SW.audio.sfx = sfx; SW.audio.music = mus; V.simulating = false; }
    tourResult();
  }
  function tourResult() {
    const T = V.tour, M = T.cur; if (!M) return;
    const w = V.champ === 1 ? M.s1 : M.s0;   // a draw goes to side 0
    T.last = { a: M.s0, b: M.s1, sa: V.wins[0], sb: V.wins[1], w };
    setWin(M.r, M.m, w); T.cur = null;
    quit(true); V.tourBots = false; settle(); V.phase = 'bracket'; V.t = 0;
    if (T.done) SW.audio.sfx('level');
  }
  function tourForfeit() {   // Esc > quit during a tournament match: your own match is lost; a bot match goes to whoever leads
    const r = V.f.map(f => { G.state = f.state; return f.p ? Math.max(0, f.state.hp) / f.p.hpMax() : 0; });
    V.champ = V.tour.cur && V.tour.cur.mine ? 1 : r[1] > r[0] ? 1 : 0;
    tourResult();
  }
  function nextFighters(out) {   // 3 vs 3: the sides in `out` lost this fight; their next heroes step in, the other side's hero stays
    const keep = V.f.map(f => { if (out.indexOf(f.i) >= 0) return null; G.state = f.state; return { hp: f.state.hp, en: f.state.energy }; });
    out.forEach(s => { V.f[s] = sideFighter(s, V.team[s][V.ti[s]]); });
    V.round++; startRound();
    keep.forEach((k, s) => { if (!k) return; const f = V.f[s]; G.state = f.state; const mx = f.p.hpMax(); f.state.hp = Math.min(mx, Math.max(1, k.hp) + Math.round(mx * TEAM_HEAL)); f.state.energy = k.en; });
    G.state = V.f[0].state;
  }
  function startMatch() {
    const th = isArc() ? (V.arc.rung === RUNGS - 1 ? 'vs_spire' : STAGES[1 + (Math.random() * (STAGES.length - 1) | 0)][1])   // arcade: the final fight is at the Aurelia Spire
      : (!isSurv() && STAGES[V.stage][1]) || STAGES[1 + (Math.random() * (STAGES.length - 1) | 0)][1];
    SW.zones.versus.theme = th;
    V.ti = [0, 0];
    V.f = [0, 1].map(s => sideFighter(s, team3() || isSurv() ? V.team[s][0] : V.pick[s]));
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
    const p = f.p, q = o.p, S = f.state, c = LV[lvOf(f)], ai = f.ai || (f.ai = { plan: 'approach', t: 0, n: 0 }), R = Math.random;
    if (V.phase !== 'fight' || p.dead) return;
    const dx = q.x - p.x, adx = Math.abs(dx), to = dx > 0 ? 'right' : 'left', away = dx > 0 ? 'left' : 'right', facing = (dx > 0 ? 1 : -1) === p.face;
    const qAtk = ['attack', 'airatk', 'rush', 'wave', 'cast', 'ult'].indexOf(q.state) >= 0, save = (p.awakeT > 0 && S.energy < 100) || (S.energy >= 180 && S.energy < 300);   // awakened: stop spending, build up to the ultimate
    ai.t--; ai.n++;
    if (ai.t <= 0) {
      ai.t = c.every + (R() * c.every | 0); ai.n = 0;
      if (p.state === 'hurt' && S.energy >= 60 && R() < c.react * 0.35) ai.plan = 'slip';
      else if (o.stunT > 8 && R() < c.aggr + 0.2) ai.plan = adx > 44 ? 'approach' : 'combo';   // punish a stunned opponent
      else if (q.state === 'guard' && adx < 34 && p.onGround && R() < 0.4 + 0.5 * c.aggr) ai.plan = 'throw';   // a guard up close: throw it (js/throw.js)
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
      case 'throw': if (!turn()) { if (adx > 22) k[to] = true; else if (ai.n < 4) { k.attack = true; k.dash = true; } } break;
    }
  }
  V.breakChance = f => [0.15, 0.35, 0.6][lvOf(f)];   // how often a bot breaks a throw (js/throw.js)
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
    // nobody is squeezed against the arena's edge half off the screen (playtest: a cornered fighter was drawn at x 5)
    V.f.forEach(f => { if (f.p && !f.p.held) f.p.x = SW.clamp(f.p.x, EDGE, V.zone.pw - EDGE); });
    fx.update();
    const A = V.f[0].p, B = V.f[1].p;
    G.cam.x += (SW.clamp((A.x + B.x) / 2 - W / 2, 0, Math.max(0, z.pw - W)) - G.cam.x) * 0.12;
    if (V.phase === 'intro') { if (V.t > 80) { V.phase = 'fight'; V.t = 0; SW.audio.sfx('roar'); } }
    else if (V.phase === 'fight') {
      if (V.mode !== 'train' && V.mode !== 'duel') V.timer--;
      if (isArc()) V.arc.time++;   // the arcade clock: fighting time only
      if (isSurv()) V.sv.time++;
      const dead = [A.dead, B.dead], out = V.timer <= 0;
      if (dead[0] || dead[1] || out) {
        const r = V.f.map(f => { G.state = f.state; return Math.max(0, f.state.hp) / f.p.hpMax(); });
        V.winner = dead[0] && dead[1] ? -1 : dead[0] ? 1 : dead[1] ? 0 : r[0] === r[1] ? -1 : r[0] > r[1] ? 0 : 1;
        V.phase = 'ko'; V.t = 0; V.timeUp = out && !dead[0] && !dead[1]; G.hitstop = 18; fx.flash('#ffffff', 12); fx.shake(8, 30); SW.audio.sfx('explode');
      }
    } else if (V.phase === 'ko' && V.t > 130 && V.mode === 'duel') {   // one fall decides a duel
      V.phase = V.winner === 0 ? 'duelEnd' : 'duelLost'; V.t = 0; SW.audio.sfx(V.winner === 0 ? 'level' : 'die');
    } else if (V.phase === 'ko' && V.t > 130 && isSurv()) {   // survival: a beaten bot is replaced by the next; a fallen hero by the next of the team
      const out = V.winner < 0 ? [0, 1] : [1 - V.winner];
      if (out.indexOf(1) >= 0) { V.sv.n++; V.team[1].push(survOpp()); }
      out.forEach(s => { V.ti[s]++; });
      if (V.ti[0] >= V.team[0].length) survEnd(); else nextFighters(out);
    } else if (V.phase === 'ko' && V.t > 130 && team3()) {   // 3 vs 3: the loser's next hero steps in (a draw puts both out)
      const out = V.winner < 0 ? [0, 1] : [1 - V.winner];
      out.forEach(s => { V.ti[s]++; V.wins[1 - s]++; });
      if (V.ti[0] >= 3 || V.ti[1] >= 3) finish(V.ti[0] >= 3 && V.ti[1] >= 3 ? -1 : V.ti[0] >= 3 ? 1 : 0);
      else nextFighters(out);
    } else if (V.phase === 'ko' && V.t > 130) {
      if (V.winner >= 0) V.wins[V.winner]++;
      if (V.wins[0] >= 2 || V.wins[1] >= 2 || V.round >= 5) finish(V.wins[0] === V.wins[1] ? -1 : V.wins[0] > V.wins[1] ? 0 : 1);
      else { V.round++; startRound(); }
    }
  }
  function finish(champ) {
    V.phase = 'result'; V.t = 0; SW.audio.sfx('level'); V.champ = champ;
    if (V.mode === 'pvb' && V.champ === 0 && !SW.profile.ach.vs_win) { G.achieve('vs_win'); V.unlocked = D.heroes[D.achievements.vs_win.hero].name; }
  }
  // ---------- menu rows, pause, move list ----------
  const menuRows = () => (V.mode === 'pvb' ? ['mode', 'fmt', 'diff', 'stage', 'gain', 'start'] : V.mode === 'pvp' ? ['mode', 'fmt', 'stage', 'gain', 'start'] : V.mode === 'rival' ? ['mode', 'diff', 'gain', 'start']
    : isBvb() ? ['mode', 'fmt', 'diff', 'diff2', 'stage', 'gain', 'speed', 'start'] : solo() ? ['mode', 'fmt', 'gain', 'start'] : isTour() ? ['mode', 'tsize', 'entry', 'diff', 'tskip', 'speed', 'start']
    : V.dummy === 3 ? ['mode', 'dummy', 'diff', 'stage', 'start'] : ['mode', 'dummy', 'stage', 'start']);
  const pauseItems = () => (V.mode === 'train' ? ['resume', 'myhero', 'dummyhero', 'dummy', 'endless', 'onscreen', 'reset', 'moves', 'quit'] : V.mode === 'duel' && !V.duelO.canQuit ? ['resume', 'moves']
    : isBvb() ? ['resume', 'speed', 'moves', 'quit'] : ['resume', 'moves', 'quit']);
  // who a fighter is, in words: "Player 2", "The bot", "Bot 1"
  const whoIs = i => (isBvb() ? 'Bot ' + (i + 1) : V.f[i].bot ? 'The bot' : 'Player ' + (i + 1));
  const pick3 = (label, value) => label + ':  <  ' + value + '  >';
  const heroName = s => (V.f[s] ? D.heroes[V.f[s].hero].name : '');
  const pauseLabel = id => ({ resume: 'Resume', myhero: pick3('Your hero', heroName(0)), dummyhero: pick3('Dummy hero', heroName(1)), speed: pick3('Speed', SPEEDS[V.speed][0]), dummy: pick3('Dummy', DUMMY[V.dummy]), endless: pick3('Endless energy', V.endless ? 'On' : 'Off'), onscreen: pick3('Moves on screen', V.showMoves ? 'On' : 'Off'),
    reset: 'Reset positions', moves: 'Move list', quit: V.mode === 'duel' ? 'Give up the duel' : 'Quit to the Versus menu' })[id];
  // Training: change your hero or the dummy's from the pause menu (the next open hero either way; locked ones are skipped)
  function swapHero(s, dir) {
    const n = D.heroOrder.length; let i = V.pick[s];
    for (let k = 0; k < n; k++) { i = (i + dir + n) % n; if (!(SW.lockedVs && SW.lockedVs(D.heroOrder[i]))) break; }
    V.pick[s] = i; V.f[s] = sideFighter(s, i); startRound(); V.paused = true;
  }
  function pauseUpdate(ok, back, up, down, left, right) {
    const sfx = SW.audio.sfx;
    if (V.pPage === 'moves') { if (left || right) { V.pWho = 1 - V.pWho; sfx('move'); } if (ok || back) { V.pPage = null; sfx('back'); } return; }
    const items = pauseItems(), d = (right ? 1 : 0) - (left ? 1 : 0);
    if (up) { V.pRow = (V.pRow + items.length - 1) % items.length; sfx('move'); }
    if (down) { V.pRow = (V.pRow + 1) % items.length; sfx('move'); }
    const id = items[V.pRow];
    if (back || (ok && id === 'resume')) { V.paused = false; sfx('back'); }
    else if ((id === 'myhero' || id === 'dummyhero') && (d || ok)) { swapHero(id === 'myhero' ? 0 : 1, d || 1); sfx('move'); }
    else if (id === 'dummy' && (d || ok)) { V.dummy = (V.dummy + DUMMY.length + (d || 1)) % DUMMY.length; V.f[1].ai = null; sfx('move'); }
    else if (id === 'speed' && (d || ok)) { V.speed = (V.speed + SPEEDS.length + (d || 1)) % SPEEDS.length; sfx('move'); }
    else if (id === 'endless' && (d || ok)) { V.endless = !V.endless; sfx('move'); }
    else if (id === 'onscreen' && (d || ok)) { V.showMoves = !V.showMoves; sfx('move'); }
    else if (ok && id === 'reset') { startRound(); V.paused = false; sfx('select'); }
    else if (ok && id === 'moves') { V.pPage = 'moves'; V.pWho = 0; sfx('select'); }
    else if (ok && id === 'quit') { V.paused = false; sfx('back'); if (V.mode === 'duel') endDuel('lose'); else if (isTour() && V.tour) tourForfeit(); else quit(true); }
  }
  // a hero's moves for the lists: the kit without its story-only traversal slot. key is the input with any "(when ...)" note removed.
  function moveRows(hero) {
    const h = D.heroes[hero];
    return h.kit.filter((id, i) => D.abilities[id] && !(h.kit.length >= 7 && i === 3)).map(id => {
      const a = D.abilities[id], ult = id === h.ultimate;
      return { key: String(a.input || '').replace(/\s*\(.*\)\s*/g, '').replace(/ in .*$| awakened$/, '').trim(), name: a.name, cost: ult ? '300' : a.cost ? String(a.cost) : '', long: ult ? '300 energy, or 100 awakened' : a.cost ? a.cost + ' energy' : '', desc: a.desc || '' };
    });
  }

  function toPick() { V.phase = 'pick'; V.step = 0; V.team = [[], []]; }
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
        else if (id === 'diff2') V.diff2 = (V.diff2 + 3 + d) % 3;
        else if (id === 'fmt') V.fmt = 1 - V.fmt;
        else if (id === 'tsize') V.tsize = (V.tsize + TSIZE.length + d) % TSIZE.length;
        else if (id === 'entry') V.entry = 1 - V.entry;
        else if (id === 'tskip') V.tskip = 1 - V.tskip;
        else if (id === 'speed') V.speed = (V.speed + SPEEDS.length + d) % SPEEDS.length;
        else if (id === 'dummy') V.dummy = (V.dummy + DUMMY.length + d) % DUMMY.length;
        else if (id === 'stage') V.stage = (V.stage + STAGES.length + d) % STAGES.length;
        else if (id === 'gain') V.gain = (V.gain + GAIN.length + d) % GAIN.length;
        SW.audio.sfx('move');
      }
      if (back) { quit(false); SW.audio.sfx('back'); }
      else if (ok && isTour() && V.entry === 1) { SW.audio.sfx('select'); startTour(); }   // watching: straight to the bracket
      else if (ok) { SW.audio.sfx('select'); toPick(); }
    } else if (V.phase === 'pick') {
      const i = ui.gridMove(V.pick[V.step], left, right, up, down);
      if (i !== V.pick[V.step]) { V.pick[V.step] = i; SW.audio.sfx('move'); }
      if (rnd) { V.pick[V.step] = Math.random() * D.heroOrder.length | 0; SW.audio.sfx('move'); }
      const tm = V.team;
      if (team3()) {   // three picks per side, in order; Esc takes back the last pick
        if (back) { SW.audio.sfx('back'); if (tm[V.step].length) tm[V.step].pop(); else if (V.step) { V.step = 0; tm[0].pop(); } else V.phase = 'menu'; }
        else if (ok && tm[V.step].indexOf(V.pick[V.step]) >= 0) SW.audio.sfx('deny');   // already on this team
        else if (ok) {
          SW.audio.sfx('select'); tm[V.step].push(V.pick[V.step]);
          if (tm[V.step].length === 3) { if (V.step === 0 && !solo()) V.step = 1; else {   /* arcade: only the player's team is picked */ V.phase = 'order'; V.oRow = 2; V.oCol = 0; V.oMark = null; } }
        }
      } else if (back) { SW.audio.sfx('back'); if (V.step) V.step = 0; else V.phase = 'menu'; }
      else if (ok) {
        SW.audio.sfx('select');
        if (V.mode === 'rival') { const hero = D.heroOrder[V.pick[0]]; V.duel({ hero, rival: D.heroes[hero].route === 'kael' ? 'nyra' : 'kael', diff: V.diff, title: 'THE CRATER' }); }   // the lead hero of the other road
        else if (isArc()) startArcade();
        else if (isSurv()) startSurvival([V.pick[0]]);
        else if (isTour()) startTour(V.pick[0]);
        else if (V.step === 0) V.step = 1; else startMatch();
      }
    } else if (V.phase === 'order') {   // 3 vs 3 team order: W / S team row or Start, A / D slot, J on two heroes of a team swaps them
      if (up || down) { V.oRow = solo() ? (V.oRow ? 0 : 2) : (V.oRow + (up ? 2 : 1)) % 3; SW.audio.sfx('move'); }   // arcade: only the player's team row
      if ((left || right) && V.oRow < 2) { V.oCol = (V.oCol + (right ? 1 : 2)) % 3; SW.audio.sfx('move'); }
      if (back) { SW.audio.sfx('back'); if (V.oMark) V.oMark = null; else { V.phase = 'pick'; V.step = solo() ? 0 : 1; V.team[V.step].pop(); } }
      else if (ok && V.oRow === 2) { SW.audio.sfx('select'); if (isArc()) startArcade(); else if (isSurv()) startSurvival(V.team[0]); else startMatch(); }
      else if (ok && (!V.oMark || V.oMark[0] !== V.oRow)) { V.oMark = [V.oRow, V.oCol]; SW.audio.sfx('select'); }
      else if (ok) { const t = V.team[V.oRow], a = V.oMark[1], x = t[a]; t[a] = t[V.oCol]; t[V.oCol] = x; V.oMark = null; SW.audio.sfx('select'); }
    } else if (V.phase === 'duelEnd') {
      V.t++; if (V.t > 120 || (V.t > 40 && ok)) endDuel('win');
    } else if (V.phase === 'duelLost') {
      V.t++;
      if (V.t > 30 && ok) { SW.audio.sfx('select'); startRound(); }
      else if (back && V.duelO.canQuit) endDuel('lose');
    } else if (V.phase === 'ladder') {   // arcade: the tower before each stage
      V.t++;
      if (V.t > 20 && ok) { SW.audio.sfx('select'); arcFight(); }
      else if (back) { SW.audio.sfx('back'); V.phase = 'menu'; }
    } else if (V.phase === 'arcOver') {
      V.t++;
      if (V.t > 30 && ok) { SW.audio.sfx('select'); V.arc.cont++; V.phase = 'ladder'; V.t = 0; }
      else if (back) { SW.audio.sfx('back'); V.phase = 'menu'; }
    } else if (V.phase === 'svOver') {   // survival is over: try again with the same heroes, or back to the menu
      V.t++;
      if (V.t > 40 && ok) { SW.audio.sfx('select'); startSurvival(V.sv.mine); }
      else if (V.t > 20 && back) { SW.audio.sfx('back'); V.phase = 'menu'; }
    } else if (V.phase === 'arcClear') {
      V.t++;
      if (V.t > 60 && (ok || back)) { SW.audio.sfx('back'); V.phase = 'menu'; }
    } else if (V.phase === 'bracket') {   // tournament: J plays, watches or settles the next match; Esc leaves the tournament
      V.t++;
      if (V.t > 12 && ok) { SW.audio.sfx('select'); if (V.tour.done) V.phase = 'menu'; else tourNext(); }
      else if (back) { SW.audio.sfx('back'); V.phase = 'menu'; V.tour = null; }
    } else if (V.phase === 'result' && isTour()) {
      V.t++;
      if ((V.t > 40 && ok) || (V.tourBots && V.t > 150)) { SW.audio.sfx('select'); tourResult(); }
    } else if (V.phase === 'result' && isArc()) {
      V.t++;
      if (V.t > 40 && ok) { SW.audio.sfx('select'); arcResult(); }
    } else if (V.phase === 'result') {
      V.t++;
      if (V.t > 30 && ok) { SW.audio.sfx('select'); if (team3()) startMatch(); else { V.wins = [0, 0]; V.round = 1; V.unlocked = null; startRound(); SW.audio.music('boss'); } }
      else if (rnd) { quit(true); toPick(); }
      else if (back) quit(true);
    } else {
      V.gin = keep.now;
      if (V.paused) pauseUpdate(ok, back, up, down, left, right);
      else if (back) { V.paused = true; V.pRow = 0; V.pPage = null; SW.audio.sfx('select'); }   // Esc pauses; quitting is on the pause screen
      else {   // Bot vs Bot can run 2 or 4 fight frames per screen frame; a finished match stops it
        const n = isBvb() ? SPEEDS[V.speed][1] : 1;
        for (let k = 0; k < n && (V.phase === 'intro' || V.phase === 'fight' || V.phase === 'ko'); k++) fightTick();
      }
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
      {   // damage leaves a pale chunk that waits a moment, then drains (js/anim2.js does the same for the story bar)
        const hp = SW.clamp(S.hp, 0, mx);
        if (f.lag === undefined || hp > f.lag || f.lagP !== f.p) { f.lag = hp; f.lagP = f.p; }
        if (f.lagHp !== undefined && hp < f.lagHp - 0.01) f.lagT = 28;
        f.lagHp = hp;
        if (f.lagT > 0) f.lagT--; else f.lag = Math.max(hp, f.lag - mx * 0.012);
        const lw = Math.round(190 * (f.lag - hp) / mx);
        if (lw > 0) art.rect(ctx, f.lagT > 20 ? '#ffffff' : '#ff9a5a', left ? bx + hw : bx + 190 - hw - lw, 10, lw, 9);
      }
      art.rect(ctx, S.hp / mx < 0.3 ? '#ff5a5a' : '#6fe89a', left ? bx : bx + 190 - hw, 10, hw, 9); art.rect(ctx, '#ffffff', left ? bx : bx + 190 - hw, 10, hw, 1);
      text(ctx, V.mode === 'duel' ? duelName(i) : (isBvb() ? 'BOT ' + (i + 1) + ' ' : f.bot ? (V.mode === 'train' ? 'DUMMY ' : 'BOT ') : 'P' + (i + 1) + ' ') + h.name.toUpperCase(), left ? bx : bx + 190, 1, h.color, { align: left ? 'left' : 'right' });   // y 1: clear of the top edge
      for (let k = 0; k < 3; k++) { const e = SW.clamp((S.energy - k * 100) / 100, 0, 1), ex = left ? bx + k * 34 : bx + 190 - 32 - k * 34; art.rect(ctx, '#05060c', ex - 1, 21, 34, 6); art.rect(ctx, '#22202e', ex, 22, 32, 4); art.rect(ctx, e >= 1 ? h.colorHi : h.color, left ? ex : ex + 32 - Math.round(32 * e), 22, Math.round(32 * e), 4); }
      const aw = SW.clamp(S.awaken / 100, 0, 1), ax = left ? bx + 106 : bx + 4;
      art.rect(ctx, '#05060c', ax - 1, 22, 82, 4); art.rect(ctx, f.p.awakeT > 0 ? h.colorHi : aw >= 1 && SW.frame % 16 < 8 ? '#ffffff' : '#8b5cf6', left ? ax : ax + 80 - Math.round(80 * aw), 23, Math.round(80 * aw), 2);
      if (team3() && !(isSurv() && i === 1)) for (let k = 0; k < 3; k++) art.rect(ctx, k < V.ti[i] ? '#5a2a30' : k === V.ti[i] ? '#f5c542' : '#ffffff', left ? bx + 190 - 8 - k * 9 : bx + 2 + k * 9, 30, 6, 6);   // the team: out, fighting, waiting
      else if (V.mode !== 'train' && V.mode !== 'duel' && !isSurv()) for (let k = 0; k < 2; k++) art.rect(ctx, k < V.wins[i] ? '#f5c542' : '#3a3d55', left ? bx + 190 - 8 - k * 9 : bx + 2 + k * 9, 30, 6, 6);
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
    if (isBvb() && !V.paused && V.phase !== 'result') text(ctx, 'BOT VS BOT    ' + DIFF[V.diff] + ' - ' + DIFF[V.diff2] + '    Speed: ' + SPEEDS[V.speed][0] + '    Esc: speed and the move list', W / 2, 259, '#8a92b8', { align: 'center' });
    if (V.mode !== 'train' && V.mode !== 'duel') text(ctx, String(Math.max(0, Math.ceil(V.timer / 60))), W / 2, 6, V.timer < 600 ? '#ff5a5a' : '#ffffff', { align: 'center', scale: 2 });
    if (isSurv() && V.sv) text(ctx, (V.sv.n + 1) % 10 === 0 ? 'LEGEND FIGHT' : 'WINS: ' + V.sv.n, W / 2, 24, (V.sv.n + 1) % 10 === 0 ? '#ff5a5a' : '#f5c542', { align: 'center' });
    if (isArc() && V.arc) text(ctx, V.arc.rung === RUNGS - 1 ? 'FINAL STAGE' : 'STAGE ' + (V.arc.rung + 1) + ' / ' + RUNGS, W / 2, 24, V.arc.rung === RUNGS - 1 ? '#ff5a5a' : '#f5c542', { align: 'center' });
    const big = (s, c, sub) => { art.rect(ctx, '#05060c', 0, 96, W, sub ? 52 : 40); text(ctx, s, W / 2, 104, c, { align: 'center', scale: 3 }); if (sub) text(ctx, sub, W / 2, 134, '#ffffff', { align: 'center' }); };
    if (V.phase === 'intro') big(V.t < 50 ? (V.mode === 'duel' ? V.duelO.title || 'RIVAL DUEL' : isSurv() ? 'FIGHT ' + (V.sv.n + 1) : 'ROUND ' + V.round) : 'FIGHT!', V.t < 50 ? '#ffffff' : '#f5c542',
      (team3() || isSurv()) && V.t < 50 ? D.heroes[V.f[0].hero].name.toUpperCase() + '   VS   ' + D.heroes[V.f[1].hero].name.toUpperCase() : '');
    else if (V.phase === 'ko' && V.mode === 'duel') big('K.O.', '#ff5a5a', V.winner < 0 ? 'Both fall' : duelName(V.winner) + ' is still standing');
    else if (V.phase === 'duelEnd') big('DUEL WON', '#f5c542', duelName(1) + ' yields');
    else if (V.phase === 'duelLost') big('DEFEATED', '#ff5a5a', 'J / Enter: try again' + (V.duelO.canQuit ? '        Esc: give up' : ''));
    else if (V.phase === 'ko') big(V.timeUp ? 'TIME UP' : 'K.O.', '#ff5a5a', V.winner < 0 ? 'Draw' : whoIs(V.winner) + ' takes the round');
    else if (V.phase === 'result') {
      const w = V.champ, n = w < 0 ? 'DRAW' : (team3() ? whoIs(w).toUpperCase() : D.heroes[V.f[w].hero].name.toUpperCase()) + ' WINS';
      big(n, w < 0 ? '#ffffff' : D.heroes[V.f[w].hero].color, team3() ? 'Heroes left: ' + (3 - V.ti[0]) + ' - ' + (3 - V.ti[1]) : (w < 0 ? '' : whoIs(w) + '   ') + V.wins[0] + ' - ' + V.wins[1]);
      if (V.unlocked) text(ctx, 'ACHIEVEMENT: Duelist  -  NEW STORY HERO UNLOCKED: ' + V.unlocked.toUpperCase(), W / 2, 156, '#f5c542', { align: 'center' });
      text(ctx, isTour() ? 'J / Enter: back to the bracket' : isArc() ? 'J / Enter: continue' : 'J / Enter: rematch     U: change heroes     Esc: Versus menu', W / 2, 250, '#8a92b8', { align: 'center' });
    }
  }
  function drawFight(ctx) {
    const z = V.zone, A = V.f[0], B = V.f[1];
    G.state = A.state; G.player = A.p; G.combo = null;
    z.ents = A.ents.concat(B.ents, [{ draw(c, cam) { G.state = B.state; G.player = B.p; B.p.draw(c, cam, G); G.state = A.state; G.player = A.p; } }]);
    z.shots = A.shots.concat(B.shots);
    // pop-up words (PERFECT, STUNNED, BREAK, damage) stay whole on the screen
    fx.list.forEach(p => { if (p.k === 't') { const hw = SW.textW(SW.i18n ? SW.i18n.tr(p.str) : p.str) / 2 + 2; p.x = SW.clamp(p.x, G.cam.x + hw, G.cam.x + W - hw); } });
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
    const h = D.heroes[f.hero], rows = moveRows(f.hero), name = h.name.toUpperCase(), who = V.mode === 'duel' ? (f.bot ? 'RIVAL' : 'YOU') : isBvb() ? 'BOT ' + (f.i + 1) : f.bot ? (V.mode === 'train' ? 'DUMMY' : 'BOT') : 'PLAYER ' + (f.i + 1);
    art.rect(ctx, '#05060c', 0, 0, W, H);
    text(ctx, name, 12, 6, h.color, { scale: 2 });
    text(ctx, who + '   -   ' + h.title + '   -   ' + h.element, 22 + SW.textW(name) * 2, 12, '#ffffff');
    text(ctx, 'J combo    W + J launcher    S + J sweep    J in the air: air combo    K jump    L dash', 12, 27, '#8a92b8');
    text(ctx, 'S guard    S + L or W + L slipstep (60 energy)    J + K charge energy    J + L throw (up close)', 12, 36, '#8a92b8');
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
        : isTour() ? 'A knockout bracket, best of three. Fight your way to the title, or watch the bots.'
        : isArc() ? 'Climb six stages against ever harder bots. A legend waits at the top.' : isSurv() ? 'Beat as many bots as you can. Every tenth one is a legend.' : team3() ? 'Teams of three. When a hero falls, the next one steps in.' : isBvb() ? 'Sit back and watch two bots fight, best of three.' : 'Two heroes, best of three. Every hero is available here.', W / 2, 52, '#bfe8ff', { align: 'center' });
      const label = { mode: ['Mode', MODES.find(m => m[0] === V.mode)[1]], fmt: ['Format', FORMATS[V.fmt]], tsize: ['Bracket', TSIZE[V.tsize][0]], entry: ['Your entry', ENTRY[V.entry]], tskip: ['Bot matches', TSKIP[V.tskip]], diff: [isBvb() ? 'Bot 1 level' : 'Bot level', DIFF[V.diff]], diff2: ['Bot 2 level', DIFF[V.diff2]], speed: ['Speed', SPEEDS[V.speed][0]], dummy: ['Dummy', DUMMY[V.dummy]], stage: ['Stage', STAGES[V.stage][0]], gain: ['Energy gain', GAIN[V.gain][0]], start: ['Choose heroes', ''] };
      const rows = menuRows().map(id => label[id]);
      rows.forEach((r, i) => { const on = V.row === i, y = 70 + i * (rows.length > 7 ? 11 : rows.length > 5 ? 12 : 16);   /* Bot vs Bot's seven rows stay above the help panel */ text(ctx, (on ? '> ' : '  ') + r[0], 130, y, on ? '#f5c542' : '#ffffff'); if (r[1]) text(ctx, '<  ' + r[1] + '  >', 240, y, on ? '#ffffff' : '#8a92b8'); });
      ui.panel(ctx, 28, 154, 432, 88, '#3a3d55', 0.7);
      text(ctx, 'P1   W A S D move    J attack   K jump   L dash   U skill   I special   O awaken', 36, 161, '#22d3ee');
      text(ctx, 'P2   arrows move      1 attack   2 jump   3 dash   4 skill   5 special   6 awaken', 36, 173, '#ff8a8a');
      text(ctx, '     (P2 uses the number pad, or 7 8 9 0 - = on the top row)', 36, 183, '#8a92b8');
      text(ctx, 'Ultimate: hold up + special with a full energy bar.  Escape a combo: down + dash.', 36, 196, '#ffffff');
      text(ctx, 'Guard: hold down. A guard timed just as the hit lands stuns the attacker.', 36, 208, '#ffe066');
      text(ctx, 'Energy: land hits or take them. Holding attack + jump charges it slowly.', 36, 220, '#ffffff');
      text(ctx, 'Throw: attack + dash up close beats a guard. Press them back in time to break free.', 36, 232, '#bfe8ff');
      text(ctx, 'W / S: move    A / D: change    J / Enter: next    Esc: back', W / 2, 250, '#8a92b8', { align: 'center' });
    } else if (V.phase === 'pick') {
      const who = team3() ? teamName(V.step) + ': CHOOSE 3 HEROES' : V.mode === 'rival' ? 'CHOOSE YOUR HERO' : isBvb() ? (V.step === 0 ? "CHOOSE BOT 1'S HERO" : "CHOOSE BOT 2'S HERO") : V.step === 0 ? 'PLAYER 1: CHOOSE YOUR HERO' : V.mode === 'pvb' ? "CHOOSE THE BOT'S HERO" : V.mode === 'train' ? "CHOOSE THE DUMMY'S HERO" : 'PLAYER 2: CHOOSE YOUR HERO';
      ui.heroGrid(ctx, { title: who, cursors: V.step === 0 ? [V.pick[0]] : [V.pick[0], V.pick[1]], colors: ['#22d3ee', '#ff5a5a'], tags: isBvb() ? ['BOT 1', 'BOT 2'] : ['P1', V.mode === 'pvb' ? 'BOT' : V.mode === 'train' ? 'DUMMY' : 'P2'], open: () => true });
      const h = D.heroes[D.heroOrder[V.pick[V.step]]];
      text(ctx, h.name.toUpperCase() + '  -  ' + h.title, 10, 235, h.color);
      if (team3()) (solo() ? [0] : [0, 1]).forEach(s => {   // the two teams so far, in fighting order (arcade: the player's only)
        for (let k = 0; k < 3; k++) {
          const id = D.heroOrder[V.team[s][k]], th = id && D.heroes[id], x = s ? W - 10 - (2 - k) * 76 : 10 + k * 76;
          text(ctx, (k + 1) + ' ' + (th ? th.name.toUpperCase() : '---'), x, 245, th ? th.color : s === V.step && k === V.team[s].length ? '#ffffff' : '#5a6078', { align: s ? 'right' : 'left' });
        }
      });
      else text(ctx, h.element + '     Signature: ' + h.sig + '     Ultimate: ' + D.abilities[h.ultimate].name, 10, 245, '#ffffff');
      text(ctx, 'Move: W A S D or arrows    J / Enter: pick    U: random    Esc: back', 10, 257, '#8a92b8');
    } else if (V.phase === 'order') drawOrder(ctx);
    else if (V.phase === 'ladder' || V.phase === 'arcOver' || V.phase === 'arcClear') drawArcade(ctx);
    else if (V.phase === 'svOver') drawSurvival(ctx);
    else if (V.phase === 'bracket') drawBracket(ctx);
    else drawFight(ctx);
  };
  function face(ctx, idx, x, y, w, h, dim) {   // a small hero portrait
    const id = D.heroOrder[idx], img = art.bg['hero_' + id];
    art.rect(ctx, '#05060c', x - 1, y - 1, w + 2, h + 2);
    if (img) { ctx.globalAlpha = dim ? 0.35 : 1; ctx.drawImage(img, 4, 14, 88, 98, x, y, w, h); ctx.globalAlpha = 1; }
    else art.rect(ctx, D.heroes[id].color, x, y, w, h);
  }
  function drawBracket(ctx) {   // two-sided: the first half of the draw runs left to right, the second right to left, the final meets in the middle
    const T = V.tour, bg = art.bg.title, rounds = Math.round(Math.log2(T.size));
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.88; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'TOURNAMENT', W / 2, 4, '#f5c542', { align: 'center', scale: 2 });
    const cur = T.cur || settle();
    let nm = id => (id === null ? 'BYE' : id === undefined ? '' : D.heroes[id].name.toUpperCase());
    // 64: too many names for one tree, so the first round is a list of its matches, and the tree starts at the last 32
    const first = T.R[1] ? T.R[1].filter(x => x !== undefined).length : 0, r0 = T.size > 32 ? 1 : 0;
    if (r0 && first < T.size / 2) { drawRoundList(ctx, T, cur, nm); return; }
    const top = 30, bot = 226, colW = (W / 2 - 34) / (rounds - r0);
    const full = nm, fit = id => { let s = full(id); if (SW.textW(s) <= colW - 6) return s; while (s.length > 3 && SW.textW(s + '.') > colW - 6) s = s.slice(0, -1); return s.trim() + '.'; };   // long names are cut to the column
    nm = fit;
    for (let r = r0; r < rounds; r++) {
      const list = T.R[r] || [], len = T.size >> r, half = len / 2, next = T.R[r + 1] || [], c = r - r0;
      for (let i = 0; i < len; i++) {
        const left = i < half, j = i % half, y = Math.round(top + (j + 0.5) * (bot - top) / half), id = list[i], m = i >> 1, w = next[m];
        const x = left ? 6 + c * colW : W - 6 - c * colW, lost = w !== undefined && id !== undefined && w !== id;
        const live = cur && cur.r === r && cur.m === m, mine = T.me && id === T.me;
        const col = id === undefined ? '#3a3d55' : id === null ? '#3a3d55' : lost ? '#4a4e66' : live ? '#ffffff' : D.heroes[id].color;
        if (id === undefined) art.rect(ctx, '#2a2d45', left ? x : x - 24, y + 3, 24, 1);
        else text(ctx, (live && left ? '>' : '') + nm(id) + (live && !left ? '<' : ''), x, y, col, { align: left ? 'left' : 'right' });
        if (mine && !lost) art.rect(ctx, '#22d3ee', left ? x : x - SW.textW(nm(id)), y + 8, SW.textW(nm(id)), 1);   // you
        // the bracket line joining this pair
        if (i % 2 === 0 && r < rounds - 1) {
          const y2 = Math.round(top + (j + 1.5) * (bot - top) / half), lx = left ? x + colW - 6 : x - colW + 6;
          art.rect(ctx, '#3a3d55', lx, y + 4, 1, y2 - y);
        }
      }
    }
    // the middle: the champion, or what is next
    if (T.done) {
      const h = D.heroes[T.champ];
      text(ctx, 'CHAMPION', W / 2, 98, '#f5c542', { align: 'center' });
      text(ctx, h.name.toUpperCase(), W / 2, 112, h.colorHi, { align: 'center', scale: 2 });
      if (T.me) text(ctx, T.champ === T.me ? 'YOU WON THE TOURNAMENT!' : 'Better luck next time.', W / 2, 136, T.champ === T.me ? '#7dffa0' : '#8a92b8', { align: 'center' });
    } else text(ctx, '?', W / 2, 108, '#5a6078', { align: 'center', scale: 2 });
    if (T.last) {
      const L = T.last, wn = D.heroes[L.w].name, ln = D.heroes[L.w === L.a ? L.b : L.a].name, s = L.w === L.a ? L.sa + '-' + L.sb : L.sb + '-' + L.sa;
      text(ctx, wn + ' beat ' + ln + ' ' + s, W / 2, 232, '#bfe8ff', { align: 'center' });
    }
    let hint;
    if (T.done) hint = 'J / Enter: Versus menu';
    else if (cur) {
      const mine = T.me && (cur.a === T.me || cur.b === T.me);
      hint = 'Next: ' + D.heroes[cur.a].name + ' v ' + D.heroes[cur.b].name + '      J / Enter: ' + (mine ? 'fight' : V.tskip ? 'settle it' : 'watch') + '      Esc: leave';
    }
    if (hint) text(ctx, hint, W / 2, 248, '#8a92b8', { align: 'center' });
  }
  // a 64 bracket's first round: its matches in four columns (byes listed underneath), then the tree takes over
  function drawRoundList(ctx, T, cur, nm) {
    const list = T.R[0], next = T.R[1] || [], pairs = [], byes = [];
    for (let m = 0; m < list.length / 2; m++) { const a = list[m * 2], b = list[m * 2 + 1]; if (a && b) pairs.push(m); else if (a || b) byes.push(a || b); }
    text(ctx, 'ROUND OF 64', W / 2, 22, '#8a92b8', { align: 'center' });
    const rows = Math.ceil(pairs.length / 3), colX = [8, 166, 324];
    pairs.forEach((m, k) => {
      const a = list[m * 2], b = list[m * 2 + 1], w = next[m], x = colX[Math.floor(k / rows)], y = 36 + (k % rows) * 12, live = cur && cur.r === 0 && cur.m === m;
      const shade = id => (w !== undefined && w !== id ? '#4a4e66' : live ? '#ffffff' : D.heroes[id].color);
      let cx = x;
      if (live) { text(ctx, '>', cx, y, '#f5c542'); }
      cx += 7; text(ctx, nm(a), cx, y, shade(a)); cx += SW.textW(nm(a)) + 4;
      text(ctx, 'v', cx, y, '#5a6078'); cx += SW.textW('v') + 4;
      text(ctx, nm(b), cx, y, shade(b));
      if (T.me && (a === T.me || b === T.me)) art.rect(ctx, '#22d3ee', x + 7, y + 8, 4, 1);
    });
    if (byes.length) {
      const by = 40 + rows * 12;
      text(ctx, 'Byes to the round of 32:', 8, by, '#8a92b8');
      SW.wrap(byes.map(nm).join('  '), W - 16).slice(0, 3).forEach((ln, i) => text(ctx, ln, 8, by + 10 + i * 9, '#c8ccd8'));
    }
    if (T.last) {
      const L = T.last, wn = D.heroes[L.w].name, ln = D.heroes[L.w === L.a ? L.b : L.a].name, s = L.w === L.a ? L.sa + '-' + L.sb : L.sb + '-' + L.sa;
      text(ctx, wn + ' beat ' + ln + ' ' + s, W / 2, 232, '#bfe8ff', { align: 'center' });
    }
    if (cur) text(ctx, 'Next: ' + D.heroes[cur.a].name + ' v ' + D.heroes[cur.b].name + '      J / Enter: ' + (T.me && (cur.a === T.me || cur.b === T.me) ? 'fight' : V.tskip ? 'settle it' : 'watch') + '      Esc: leave', W / 2, 248, '#8a92b8', { align: 'center' });
  }
  function drawSurvival(ctx) {   // the run is over
    const S = V.sv, bg = art.bg.title, b = survBest()[S.mine.length === 3 ? '3v3' : '1v1'];
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.85; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'SURVIVAL OVER', W / 2, 36, '#ff5a5a', { align: 'center', scale: 3 });
    S.mine.forEach((idx, k) => face(ctx, idx, W / 2 - S.mine.length * 30 + k * 60 + 5, 76, 50, 56, true));
    text(ctx, 'Wins: ' + S.n + '      Time: ' + clock(S.time), W / 2, 146, '#ffffff', { align: 'center', scale: 2 });
    if (S.rec) text(ctx, 'NEW RECORD!', W / 2, 170, SW.frame % 30 < 20 ? '#7dffa0' : '#ffffff', { align: 'center', scale: 2 });
    else text(ctx, b ? 'Best: ' + b.n + ' wins   ' + clock(b.t) : 'Best: none yet', W / 2, 174, '#8a92b8', { align: 'center' });
    text(ctx, 'J / Enter: try again      Esc: Versus menu', W / 2, 250, '#8a92b8', { align: 'center' });
  }
  function drawArcade(ctx) {   // the ladder, the continue screen and the clear screen
    const A = V.arc, bg = art.bg.title, names = t => t.map(i => D.heroes[D.heroOrder[i]].name.toUpperCase()).join('  ');
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.85; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    const best = arcBest()[team3() ? '3v3' : '1v1'], bestLine = best ? 'Best: ' + clock(best.t) + '   Continues: ' + best.cont : 'Best: none yet';
    if (V.phase === 'arcClear') {
      text(ctx, 'ARCADE CLEAR', W / 2, 40, '#f5c542', { align: 'center', scale: 3 });
      A.mine.forEach((idx, k) => face(ctx, idx, W / 2 - A.mine.length * 30 + k * 60 + 5, 80, 50, 56));
      text(ctx, 'Time: ' + clock(A.time) + '      Continues: ' + A.cont, W / 2, 150, '#ffffff', { align: 'center', scale: 2 });
      if (A.rec) text(ctx, 'NEW RECORD!', W / 2, 172, SW.frame % 30 < 20 ? '#7dffa0' : '#ffffff', { align: 'center', scale: 2 });
      else text(ctx, bestLine, W / 2, 176, '#8a92b8', { align: 'center' });
      text(ctx, 'J / Enter: Versus menu', W / 2, 250, '#8a92b8', { align: 'center' });
      return;
    }
    if (V.phase === 'arcOver') {
      text(ctx, 'DEFEATED', W / 2, 60, '#ff5a5a', { align: 'center', scale: 3 });
      text(ctx, (A.rung === RUNGS - 1 ? 'FINAL STAGE' : 'STAGE ' + (A.rung + 1)) + ':  ' + names(A.opp[A.rung]), W / 2, 100, '#ffffff', { align: 'center' });
      text(ctx, 'Continue? You fight this stage again. The clock keeps running.', W / 2, 124, '#bfe8ff', { align: 'center' });
      text(ctx, 'Continues so far: ' + A.cont, W / 2, 140, '#8a92b8', { align: 'center' });
      text(ctx, 'J / Enter: continue      Esc: give up', W / 2, 250, '#8a92b8', { align: 'center' });
      return;
    }
    text(ctx, 'ARCADE', W / 2, 6, '#f5c542', { align: 'center', scale: 2 });
    text(ctx, 'YOU', 40, 36, '#22d3ee', { align: 'center' });
    A.mine.forEach((idx, k) => face(ctx, idx, 22, 48 + k * 44, 36, 40));
    for (let r = RUNGS - 1; r >= 0; r--) {   // the tower: stage 1 at the bottom, the legend at the top
      const y = 30 + (RUNGS - 1 - r) * 32, cur = r === A.rung, done = r < A.rung, fin = r === RUNGS - 1, t = A.opp[r];
      ui.panel(ctx, 80, y, 380, 28, cur ? '#f5c542' : fin ? '#ff5a5a' : '#3a3d55', cur ? 0.95 : 0.6);
      if (cur) text(ctx, '>', 83, y + 6, '#f5c542');
      text(ctx, fin ? 'FINAL' : 'STAGE ' + (r + 1), 90, y + 6, cur ? '#f5c542' : fin ? '#ff5a5a' : done ? '#5a6078' : '#ffffff');
      text(ctx, DIFF[RUNG_LV[r]], 90, y + 16, done ? '#5a6078' : '#8a92b8');
      t.forEach((idx, k) => face(ctx, idx, 160 + k * 24, y + 3, 20, 22, done));
      text(ctx, done ? 'CLEARED' : names(t), 160 + t.length * 24 + 6, y + 10, done ? '#5a6078' : fin ? '#ff8a8a' : '#ffffff');
    }
    text(ctx, 'Time: ' + clock(A.time) + '     Continues: ' + A.cont + '     ' + bestLine, W / 2, 230, '#bfe8ff', { align: 'center' });
    text(ctx, 'J / Enter: fight      Esc: give up', W / 2, 250, '#8a92b8', { align: 'center' });
  }
  function drawOrder(ctx) {   // 3 vs 3: both teams' fighting order
    const bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.85; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'TEAM ORDER', W / 2, 6, '#f5c542', { align: 'center', scale: 2 });
    if (solo()) text(ctx, isArc() ? 'Your opponents: six bots, each one harder. A legend waits at the top.' : 'Your three heroes are your lives: when one falls, the next steps in.', W / 2, 160, '#8a92b8', { align: 'center' });
    (solo() ? [0] : [0, 1]).forEach(s => {
      const y = 30 + s * 92, col = s ? '#ff5a5a' : '#22d3ee';
      text(ctx, teamName(s), 24, y + 30, col);
      text(ctx, 'fights in this order', 24, y + 42, '#8a92b8');
      V.team[s].forEach((idx, k) => {
        const id = D.heroOrder[idx], h = D.heroes[id], x = 160 + k * 76, img = art.bg['hero_' + id];
        const on = V.oRow === s && V.oCol === k, mk = V.oMark && V.oMark[0] === s && V.oMark[1] === k;
        ui.panel(ctx, x, y, 70, 84, mk ? '#ffffff' : on ? '#f5c542' : col, mk || on ? 0.95 : 0.6);
        if (img) ctx.drawImage(img, 4, 14, 88, 98, x + 1, y + 1, 68, 66); else art.draw(ctx, h.sheet, 'idle', 0, x + 35, y + 64, false);
        ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', x + 1, y + 67, 68, 16); ctx.globalAlpha = 1;
        text(ctx, h.name.toUpperCase(), x + 35, y + 71, h.color, { align: 'center' });
        art.rect(ctx, '#05060c', x + 2, y + 2, 11, 11); text(ctx, String(k + 1), x + 8, y + 4, '#ffffff', { align: 'center' });
      });
    });
    const on = V.oRow === 2;
    text(ctx, (on ? '> ' : '') + 'START', W / 2, 222, on ? '#f5c542' : '#ffffff', { align: 'center', scale: 2 });
    text(ctx, V.oMark ? 'J: swap with this hero    Esc: cancel' : 'J on a hero, then on another of the same team: swap them', W / 2, 242, '#bfe8ff', { align: 'center' });
    text(ctx, 'W / S: team or Start    A / D: hero    J / Enter: choose    Esc: back', W / 2, 254, '#8a92b8', { align: 'center' });
  }
})();
