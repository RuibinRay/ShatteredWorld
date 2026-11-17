'use strict';
// Shattered Worlds — the final boss in Versus. Loaded after finalboss.js and vsintro.js; only adds and wraps.
//   THE CONVERGENCE (the story's last form) joins the Versus roster, and only Versus: the story's hero select never shows it.
//   * Boss fight: in Player vs Bot, give the BOT the Convergence and you fight the real boss, with its own attacks (World
//     Rend, Blink, Last Light, the last stand) and its own health, scaled by the bot level. There is no round clock.
//   * Playable: anywhere else (your own pick, Player vs Player, Bot vs Bot, Tournament, Arcade, 3 vs 3) it is a fighter
//     like the others, with the boss's moves turned into a player's:
//       U Void Shard   S+U Rift Step   I World Rend   S+I Engine Light   W+O Engine Collapse
//       S+O Unravel    O Engine Form   W+I World's End (its own ultimate)
//   Its sprite is Noct's frames in the Convergence's white and violet (the boss sheet lacks a player's frames).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, V = SW.versus, story = SW.story, text = SW.text, W = SW.W, H = SW.H, rand = SW.rand;
  const HR = D.heroes, A = D.abilities, P = SW.Player.prototype, CASTS = SW.casts, K = SW.skillfx, sfx = n => SW.audio.sfx(n);
  if (!V || !CASTS || !D.enemies.convergence || !HR.nyra || !HR.noct) return;
  const ID = 'convergence', VIOLET = '#b48cff', WHITE = '#e8d8ff';

  // ================= the fighter =================
  HR[ID] = { id: ID, name: 'Convergence', alias: 'Convergence',   // (short: the roster tiles are narrow)
    title: 'What He Became', energy: 'Engine', color: VIOLET, colorHi: WHITE, element: 'Convergence', sig: 'Unravel',
    combo: 'blade', route: 'nyra', start: HR.nyra.start, item: HR.nyra.item, spark: true, sheet: 'conv_p', sheetAw: 'conv_p_aw', ult: 'line', pitch: 200, versusOnly: true,
    awaken: 'engine_form', ultimate: 'worlds_end', mode: 'unravel', need: 'versus_only',
    blurb: 'The final boss, playable in Versus.\nWhat the Director became inside the Engine.',
    kit: ['void_shard', 'rift_step', 'world_rend_p', 'magnet_grip', 'unravel', 'engine_form', 'worlds_end'] };
  Object.assign(A, {
    void_shard: { name: 'Void Shard', input: 'U', cost: 25, dmg: 14, desc: 'Throw a shard of void that cuts through the first thing it meets. W + U throws it upward.' },
    rift_step: { name: 'Rift Step', input: 'S + U', cost: 50, dmg: 18, desc: 'Step through a rift and come out behind the nearest foe, cutting.' },
    world_rend_p: { name: 'World Rend', input: 'I', cost: 50, dmg: 16, desc: 'Void columns burst out of the ground ahead, a first row and then a second that fills its gaps.' },
    unravel: { name: 'Unravel', input: 'S + O', cost: 100, desc: '+30% damage for 10 s.' },
    engine_form: { name: 'Engine Form', input: 'O (awakening full)', desc: 'Awakening: +40% damage and super armour for 15 s.' },
    worlds_end: { name: "World's End", input: 'W + I (full energy)', cost: 100, dmg: 110, desc: 'Ultimate: void columns rain on every foe, then the Engine bursts in one huge ring. Costs all three bars, or one while awakened.' },
    engine_light: { name: 'Engine Light', input: 'S + I', cost: 100, dmg: 22, desc: 'Rise, gather the Engine\'s light and burst it outward in a ring, with shards flying in every direction.' },
    engine_collapse: { name: 'Engine Collapse', input: 'W + O', cost: 75, dmg: 6, desc: 'A rift opens ahead and drags everything in before it collapses.' }
  });
  HR[ID].kit.push('engine_light', 'engine_collapse');
  if (K && K.BY_HERO) K.BY_HERO[ID] = 'void';
  // Versus balance: at full damage it won 65% of 264 bot rounds against the other heroes; at 0.72 about 55%, still the
  // strongest fighter in the pool, as a final boss should be (V.tune is the Versus damage table, js/versus.js)
  if (V.tune) V.tune[ID] = 0.72;
  if (SW.bossfx && SW.bossfx.COL) SW.bossfx.COL[ID] = WHITE;

  // the sprite: Noct's frames in white and violet, and a brighter one for the awakening
  const SWAP = { top: WHITE, hair: '#ffffff', pants: '#5a4a88', boots: '#2a2440', trail: VIOLET, belt: VIOLET, chest: '#ffffff', arm: WHITE };
  function sheets() { try { if (art.sheets.noct && !art.sheets.conv_p) story.recolor('conv_p', 'noct', SWAP); if (art.sheets.noct_aw && !art.sheets.conv_p_aw) story.recolor('conv_p_aw', 'noct_aw', Object.assign({}, SWAP, { pants: VIOLET, trail: '#ffffff' })); if (!art.sheets.conv_p_aw && art.sheets.conv_p) story.recolor('conv_p_aw', 'conv_p', { pants: VIOLET }); } catch (e) { console.error(e); } }
  const _init = art.init; art.init = function () { _init.apply(this, arguments); sheets(); };
  sheets();

  // ================= its moves =================
  const ground = (z, x, y) => { for (let ty = Math.floor((y - 24) / 16); ty < (z.h || 40); ty++) { const c = z.tile(Math.floor(x / 16), ty); if (c === '#' || c === '=') return ty * 16; } return y; };
  const hit = (p, x, y, w, h, dmg, o) => SW.strike(G, Object.assign({ team: 'player', x, y, w, h, dmg, kx: p.face * 2, ky: -3, stun: 26, energy: true, heavy: true, hitSet: new Set(), srcX: p.x, quiet: true }, o || {}));
  const foesOf = z => z.ents.filter(e => e.hittable && e.team === 'enemy' && !e.dead);
  const nearest = (p, z, r) => { let best = null, bd = r; foesOf(z).forEach(e => { const d = Math.hypot(e.x - p.x, e.y - p.y); if (d < bd) { bd = d; best = e; } }); return best; };
  // a void column: a line on the floor for `warn` frames, then it erupts
  function column(p, z, x, warn, dmg, o) {
    const gy = ground(z, x, p.y);
    z.shots.push({ t: 0, team: 'player', hz: { x, half: 10, at: warn }, update() {   // hz: where and when it erupts (js/hardcore.js reads it)
      this.t++;
      if (this.t < warn && this.t % 3 === 0 && K) K.add('void', x + rand(-6, 6), gy - 2, 0, rand(-1.2, -0.4), { life: 10 });
      if (this.t === warn) { hit(p, x - 10, gy - 110, 20, 110, dmg, Object.assign({ kx: p.face * 1.4, ky: -4.6, srcX: x }, o)); if (K) K.emit('void', x, gy - 30, 6, { up: true }); sfx('burst'); }
      if (this.t > warn + 12) this.gone = true;
    }, draw(ctx, cam) {
      const sx = Math.round(x - cam.x), sy = Math.round(gy - cam.y);
      if (this.t < warn) { ctx.globalAlpha = 0.5 + 0.4 * this.t / warn; art.rect(ctx, VIOLET, sx - 10, sy - 1, 20, 2); ctx.globalAlpha = 1; return; }
      const k = Math.max(0, 1 - (this.t - warn) / 12), w = Math.max(1, Math.round(10 * k));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.55 * k; art.rect(ctx, VIOLET, sx - w - 2, sy - 110, w * 2 + 4, 110); ctx.restore();
      art.rect(ctx, WHITE, sx - (w >> 1), sy - 110, Math.max(1, w), 110); art.rect(ctx, '#ffffff', sx - 1, sy - 110, 2, 110);
    } });
  }
  Object.assign(CASTS, {
    void_shard(p, z, dmg, up) {
      sfx('shoot');
      z.shots.push(new SW.Proj({ x: p.x + p.face * 14, y: p.y - 22, vx: p.face * (up ? 4.6 : 6.4), vy: up ? -3.6 : 0, dmg, w: 12, h: 10, life: 50, kx: 1.6, stun: 22,
        render(ctx, x, y) { art.rect(ctx, VIOLET, x - 4, y - 2, 8, 4); art.rect(ctx, WHITE, x - 2, y - 1, 5, 2); art.rect(ctx, '#ffffff', x + (this.vx > 0 ? 2 : -3), y - 1, 1, 2); } }));
    },
    rift_step(p, z, dmg) {
      const e = nearest(p, z, 170); if (K) K.emit('void', p.x, p.y - 18, 10); fx.ghost(p.sheet(), 'idle', 0, p.x, p.y, p.face < 0); sfx('tele');
      if (e) { const bx = e.x + (e.x > p.x ? 22 : -22); if (!(z.hit && z.hit(bx - p.w / 2, p.y - p.h, p.w, p.h))) p.x = bx; p.face = e.x > p.x ? 1 : -1; }
      else if (!(z.hit && z.hit(p.x + p.face * 60 - p.w / 2, p.y - p.h, p.w, p.h))) p.x += p.face * 60;
      if (K) K.emit('void', p.x, p.y - 18, 10); fx.slash(p.x + p.face * 14, p.y - 20, p.face, 3, WHITE, 34); sfx('heavy');
      hit(p, p.face > 0 ? p.x : p.x - 40, p.y - 40, 40, 40, dmg, { kx: p.face * 3, ky: -3, stun: 30 });
    },
    world_rend_p(p, z, dmg) {
      sfx('roar'); fx.flash(VIOLET, 4);
      [28, 60, 92, 124].forEach((off, i) => column(p, z, p.x + p.face * off, 14 + i * 2, dmg));
      [44, 76, 108].forEach((off, i) => column(p, z, p.x + p.face * off, 34 + i * 2, Math.round(dmg * 0.8)));
    }
  });
  // S + I and W + O go through moves.js and signature.js
  if (SW.moves && SW.moves.BURST) SW.moves.BURST[ID] = { id: 'engine_light', cast(p, z, dmg) {
    const y0 = p.y; p.vy = -4.6; p.onGround = false; sfx('awaken'); fx.flash('#ffffff', 6);
    z.shots.push({ t: 0, hz: { get x() { return p.x; }, half: 76, at: 18 }, update() {
      this.t++;
      if (this.t < 18) { if (K && this.t % 2 === 0) K.gather('void', p.x, p.y - 20, 3, 46); if (this.t % 6 === 0) fx.ring(p.x, p.y - 20, '#ffffff', 70, 12, 10); return; }
      if (this.t === 18) {
        sfx('explode'); fx.shake(6, 12); for (let i = 0; i < 3; i++) fx.ring(p.x, p.y - 20, i % 2 ? VIOLET : '#ffffff', 8 + i * 8, 76 + i * 10, 18);
        if (K) K.emit('void', p.x, p.y - 20, 30, { power: 2.2 });
        hit(p, p.x - 76, p.y - 70, 152, 80, dmg, { kx: p.face * 4, ky: -5, stun: 36 });
        for (let i = 0; i < 6; i++) { const a = i * 1.047; z.shots.push(new SW.Proj({ x: p.x, y: p.y - 20, vx: Math.cos(a) * 3.6, vy: Math.sin(a) * 3.6, dmg: Math.round(dmg * 0.35), w: 8, h: 8, life: 40, render(ctx, x, y) { art.rect(ctx, WHITE, x - 2, y - 2, 4, 4); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 2); } })); }
      }
      if (this.t > 20) this.gone = true;
    }, draw() {} });
  } };
  if (SW.signature && SW.signature.SIG) SW.signature.SIG[ID] = { id: 'engine_collapse', cast(p, z, dmg) {
    const x = p.x + p.face * 64, y = p.y - 20, r = 48; sfx('tele');
    z.shots.push({ t: 0, hz: { x, half: 48, at: 48, every: 12 }, update() {
      this.t++;
      foesOf(z).forEach(e => { const dx = x - e.x, d = Math.abs(dx); if (d < r && Math.abs(e.y - e.h / 2 - y) < r && !e.isBoss) { try { e.x += Math.sign(dx) * Math.min(d, 2); } catch (er) { e.vx = Math.sign(dx) * 2; } } });
      if (this.t % 12 === 0) hit(p, x - 28, y - 28, 56, 56, dmg, { kx: 0, ky: -0.5, stun: 16, srcX: x, heavy: false });
      if (K && this.t % 2 === 0) { const a = Math.random() * 6.283; K.add('void', x + Math.cos(a) * r, y + Math.sin(a) * r * 0.6, -Math.cos(a) * 2.4, -Math.sin(a) * 1.4, { g: 0, life: 12 }); }
      if (this.t === 48) { hit(p, x - r, y - r, r * 2, r * 2, Math.round(dmg * 1.5), { kx: p.face * 3, ky: -4.5, stun: 30, srcX: x }); fx.ring(x, y, VIOLET, 4, r + 10, 14); if (K) K.burst('void', x, y, 2); sfx('explode'); }
      if (this.t > 50) this.gone = true;
    }, draw(ctx, cam) { const sx = Math.round(x - cam.x), sy = Math.round(y - cam.y); for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.6 - i * 0.15; art.ring(ctx, i ? VIOLET : WHITE, sx, sy, Math.round(r * (0.35 + i * 0.25) * (0.9 + 0.1 * Math.sin(this.t * 0.4 + i)))); } ctx.globalAlpha = 1; art.rect(ctx, '#1a0a2e', sx - 2, sy - 2, 4, 4); } });
  } };
  // its ultimate: columns rain on every foe, then one huge ring
  const _ult = SW.ultFx; SW.ultFx = function (p, g, z, foes) {
    if (!g.state || g.state.hero !== ID) return _ult ? _ult.apply(this, arguments) : false;
    const dmg = Math.round(A.worlds_end.dmg * p.specMul());
    if (p.st === 8) { fx.flash(WHITE, 10); sfx('roar'); fx.shake(6, 50); }
    if (p.st >= 10 && p.st <= 50 && p.st % 8 === 2) { (foes.length ? foes : [{ x: p.x + p.face * 80 }]).forEach(e => column(p, z, e.x + rand(-10, 10), 10, Math.round(dmg * 0.18), { kx: 0, ky: -3 })); }
    if (p.st === 60) { fx.flash('#ffffff', 14); fx.shake(10, 20); sfx('explode'); for (let i = 0; i < 4; i++) fx.ring(p.x, p.y - 20, i % 2 ? VIOLET : '#ffffff', 10 + i * 10, 140 + i * 16, 22); if (K) K.emit('void', p.x, p.y - 20, 40, { power: 2.6 }); foes.forEach(e => { const b = e.box(); const atk = { team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg: Math.round(dmg * 0.6), kx: Math.sign(e.x - p.x || 1) * 5, ky: -6, stun: 44, energy: true, heavy: true, down: true, hitSet: new Set(), quiet: true }; if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); }); }
    return true;
  };

  // ================= Versus only =================
  // it sits at the end of the roster, and is taken out while the story's hero select or a new story game is being set up
  if (D.heroOrder.indexOf(ID) < 0) D.heroOrder.push(ID);
  function withoutIt(fn, self, args) { const a = D.heroOrder, i = a.indexOf(ID); if (i >= 0) a.splice(i, 1); try { return fn.apply(self, args); } finally { if (a.indexOf(ID) < 0) a.push(ID); } }
  ['selectUpdate', 'drawSelect', 'drawPrologue'].forEach(k => { const f = ui[k]; if (typeof f === 'function') ui[k] = function () { return withoutIt(f, this, arguments); }; });
  const _ng = G.newGame; G.newGame = function () { return withoutIt(_ng, this, arguments); };

  // ================= the boss fight =================
  const HPM = [0.7, 0.9, 1.3, 1.6], DMM = [0.8, 0.95, 1.15, 1.35];   // by bot level (Easy, Normal, Hard, Nightmare), against Versus fighters
  let boss = null, setFor = null;
  const bossMode = () => V.mode === 'pvb' && V.fmt !== 1 && V.f && V.f.length === 2 && V.f[1].hero === ID;
  function setup() {
    const a = V.f[0], b = V.f[1], z = V.zone;
    setFor = a.p;
    a.ents = a.ents.filter(e => !e.isProxy); b.ents = [];
    const lv = SW.clamp(V.diff === undefined ? 1 : V.diff, 0, 3);
    boss = SW.spawnEnemy('convergence', b.p.x, b.p.y);
    boss.hp = boss.hpMax = Math.round(boss.hpMax * HPM[lv]); boss.def = Object.assign({}, boss.def, { dmg: Math.round(boss.def.dmg * DMM[lv]) });
    boss.ax0 = 24; boss.ax1 = (z.pw || W) - 24; boss.state = 'chase'; boss.dormant = true; boss.face = -1; boss.vsBoss = true;
    a.ents.push(boss);
    // the bot's own fighter stays where the boss is, out of sight and out of play
    const q = b.p; q.update = function () {}; q.settle = function () {}; q.draw = function () {}; q.invuln = 1e9;
  }
  function sync() {
    if (!boss || !V.f) return;   // (menus: no fighters yet)
    const b = V.f[1];
    if (!b || !b.p) return;
    boss.dormant = V.phase !== 'fight';
    if (V.phase === 'fight') V.timer = 60 * 60;   // no clock against the boss
    b.p.x = boss.x; b.p.y = boss.y; b.p.vx = 0; b.p.vy = 0;
    b.state.hp = boss.dead ? 0 : Math.max(1, Math.round(boss.hp / boss.hpMax * b.p.hpMax()));
    if (boss.dead && !b.p.dead && V.phase === 'fight') { b.p.dead = true; b.p.state = 'down'; }
  }
  const _up = V.update; V.update = function () {
    if (bossMode() && V.f[0].p && V.f[0].p !== setFor) setup();
    if (!bossMode()) { boss = null; setFor = null; }
    sync();
    const r = _up.apply(this, arguments);
    if (bossMode()) sync();
    return r;
  };
  // the roster tiles fit about six letters: a short name on the tile only (the line under the grid keeps the full one)
  if (typeof ui.heroGrid === 'function') { const _hg = ui.heroGrid; ui.heroGrid = function () { const h = HR[ID], n = h.name; h.name = 'Conv.'; try { return _hg.apply(this, arguments); } finally { h.name = n; } }; }
  // on the pick screen: say what giving the bot the Convergence means
  const _draw = V.draw; V.draw = function (ctx, g) {
    _draw.apply(this, arguments);
    if (V.phase === 'pick' && V.mode === 'pvb' && V.fmt !== 1 && V.step === 1 && D.heroOrder[V.pick[1]] === ID) {
      art.rect(ctx, '#05060c', 0, H - 30, W, 14); text(ctx, 'BOSS FIGHT: you face the real Convergence, with all its attacks', W / 2, H - 27, WHITE, { align: 'center' });
    }
  };

  SW.vsboss = { ID, active: () => !!(bossMode() && boss), boss: () => boss, HPM, DMM };
})();
