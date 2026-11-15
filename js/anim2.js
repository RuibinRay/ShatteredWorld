'use strict';
// Shattered Worlds — animation update 2. Loaded after anim.js; adds poses and wraps drawing. Draw-only: no timing,
// hitbox, damage or physics changes (the fighters' state machines decide; this only picks better pictures for them).
//
//   1. Smoother attacks: every attack, skill and special gets in-between poses (wind-up -> strike -> recovery), baked
//      from the same skeleton as the rest of the sprite, for every hero, Hidden Clans fighter and humanoid foe.
//   2. Knockdowns: a launched or swept fighter tumbles in the air; a downed foe kneels and gets up instead of popping up.
//   3. Hit reactions: a heavy blow throws the body back, a hit from behind lurches it forward, a light hit flinches.
//   4. Small touches: a crouch after a hard landing, a quick turn when changing direction, breathing while idle.
//   5. Victory poses: the winner of a Versus round strikes their own pose (one of four, chosen per hero).
//   6. Health bars that drain: in the story HUD (Versus does the same in versus.js), damage leaves a pale chunk that
//      shrinks after a moment, so you can see what a combo took.
//   7. Enemy deaths in their own style: machines spark and come apart, beasts collapse in dust, Husks crumble away.
//   8. Livelier backgrounds: banners sway, lamps flicker, and each area has its own drifting particles.
// SW.anim2.on = false turns it all off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, P = SW.Player.prototype, E = SW.Enemy.prototype, D = SW.data;
  const A2 = SW.anim2 = { on: true, sub: null };
  const POSES = art.POSES, SETS = art.SETS;
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  // ================= new poses, baked with everything else when the game boots =================
  const Pz = (lean, aF, aFe, aB, aBe, lF, lFk, lB, lBk, o) => Object.assign({ lean, aF, aFe, aB, aBe, lF, lFk, lB, lBk }, o || {});
  const mix = (a, b, t) => { const o = {}; new Set(Object.keys(a).concat(Object.keys(b))).forEach(k => { const x = a[k], y = b[k]; o[k] = typeof x === 'number' && typeof y === 'number' ? x + (y - x) * t : (t < 0.5 ? (x !== undefined ? x : y) : (y !== undefined ? y : x)); }); return o; };
  // 1. in-betweens: name~ = [between wind-up and strike, between strike and recovery]
  const TWEEN = ['a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3', 'b4', 'launcher', 'sweep', 'air', 'cast', 'special'];
  TWEEN.forEach(n => { const f = POSES[n]; if (f && f.length >= 3) POSES[n + '~'] = [mix(f[0], f[1], 0.55), mix(f[1], f[2], 0.45)]; });
  // 2-5. new poses
  Object.assign(POSES, {
    hurtb: [Pz(-32, -70, 20, -95, 20, 38, 34, -16, 30, { tr: 18 })],                                   // a heavy blow: thrown back
    hurtf: [Pz(26, 45, 40, 35, 45, 12, 22, -28, 30, { tr: 70 })],                                      // hit from behind: lurching forward
    // (heads must stay inside the 72 px cell: hy moves the hips up as the body turns over)
    tumble: [Pz(-55, 150, 25, 120, 25, 55, 85, 20, 95, { air: 1, hy: -4, tr: 120 }), Pz(-100, 170, 15, 150, 15, 75, 60, 45, 70, { air: 1, hy: -4, tr: 150 }), Pz(-145, 165, 20, 140, 20, 95, 45, 65, 55, { air: 1, hy: -12, tr: 175 })],
    getup: [Pz(32, 75, 40, 25, 60, 85, 150, -30, 100), Pz(18, 40, 50, 5, 50, 50, 90, -20, 60)],         // kneel, then rise
    land: [Pz(16, 30, 60, -25, 50, 48, 95, -28, 75)],                                                   // crouched after a hard landing
    turn: [Pz(0, 8, 40, 8, 40, 8, 12, -8, 12)],                                                         // side-on for a moment
    win1: [Pz(-6, 170, 10, -20, 30, 12, 6, -12, 6, { tr: 40 }), Pz(-8, 176, 4, -26, 34, 14, 8, -12, 6, { tr: 44 })],   // a fist to the sky
    win2: [Pz(-4, 68, 122, 72, 118, 10, 6, -10, 6), Pz(-2, 70, 124, 74, 116, 11, 6, -10, 6)],                      // arms folded
    win3: [Pz(6, 118, 0, -30, 40, 20, 10, -15, 6, { wp: -60 }), Pz(8, 124, 0, -32, 40, 20, 10, -15, 6, { wp: -70 })], // blade raised
    win4: [Pz(40, 30, 30, -10, 20, 10, 10, -10, 10), Pz(46, 24, 24, -12, 20, 10, 12, -10, 12)]                      // a bow
  });
  // The new frames go on a small side sheet per fighter (id + '+'), baked in the background after the game has loaded,
  // a few sheets per tick, so start-up is no slower. Until a fighter's side sheet is ready it simply uses the old frames.
  // Armed heroes swing blade poses (b1..b4) where others use a1..a4, so each gets only the in-betweens it can use.
  const XTRA = ['hurtb', 'hurtf', 'tumble', 'getup', 'land', 'turn', 'win1', 'win2', 'win3', 'win4'];
  const MOVES = ['launcher', 'sweep', 'air', 'cast', 'special'].map(n => n + '~');
  SETS.a2fist = ['a1~', 'a2~', 'a3~', 'a4~'].concat(MOVES, XTRA);
  SETS.a2blade = ['b1~', 'b2~', 'b3~', 'b4~'].concat(MOVES, XTRA);
  SETS.a2foe = ['a1~', 'a4~', 'cast~', 'special~', 'sweep~', 'hurtb', 'hurtf', 'tumble', 'getup'];
  const setFor = s => !s.cfg || !s.anims.idle || !s.anims.a1 ? null : s.anims.launcher ? (s.cfg.weapon && s.cfg.armed ? 'a2blade' : 'a2fist') : s.anims.cast ? 'a2foe' : null;
  const want = new Set();   // fighters drawn on screen right now go first
  function pump() {   // bake side sheets for up to ~6 ms, then let the game run
    const t0 = performance.now(), ids = Array.from(want).concat(Object.keys(art.sheets));
    want.clear();
    for (const id of ids) {
      if (id.slice(-1) === '+') continue;
      const s = art.sheets[id], x = art.sheets[id + '+'];
      if (!s || (x && x.src === s.img)) continue;
      const set = setFor(s);
      if (!set) continue;
      try { art.bake(id + '+', s.cfg, set); art.sheets[id + '+'].src = s.img; } catch (e) { A2.failed = id; }
      if (performance.now() - t0 > 6) break;
    }
  }
  setInterval(pump, 60);   // also picks up sheets made later (recoloured or newly unlocked fighters)

  // ================= picking the picture =================
  // A2.sub = (anim, frame) -> [anim, frame] or null, set while one fighter draws; the art.draw wrapper applies it
  const _draw = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    const s = A2.sub, br = A2.breath; A2.sub = null; A2.breath = false;
    const t = SW.anim && SW.anim.tf;   // 4. breathing: a slow rise and fall of the chest while standing still
    if (br && A2.on && (!t || (!t.dx && t.sx === 1 && t.sy === 1))) SW.anim.tf = { dx: 0, sx: 1, sy: 1 + 0.03 * Math.sin(SW.frame * 0.07) };
    if (s && A2.on) { const r = s(anim, fi | 0), x2 = art.sheets[id + '+']; if (r && x2 && x2.anims[r[0]]) { id = id + '+'; anim = r[0]; fi = r[1]; } else if (r && !x2) want.add(id); }
    return _draw.call(this, ctx, id, anim, fi, x, y, flip, o);
  };
  const armed = p => { try { const sh = art.sheets[p.sheet()]; return !!(sh && sh.cfg && sh.cfg.weapon && sh.cfg.armed); } catch (e) { return false; } };
  const tw = (anim, p) => (/^a[1-4]$/.test(anim) && armed(p) ? 'b' + anim.slice(1) : anim) + '~';
  const winPose = id => { const h = D.heroes[id] || {}, k = hash(id || ''); return h.ult === 'line' || /blade|sword|draw|sickle|staff/i.test(h.element || '') ? 'win3' : ['win1', 'win2', 'win4', 'win1'][k % 4]; };

  function heroPick(p) {
    const s = p.state, a = p.atk, st = p.st, V = SW.versus;
    // 5. the round's winner
    if (G.scene === 'vs' && V && V.f && V.winner >= 0 && V.f[V.winner] && V.f[V.winner].p === p && !p.dead && p.onGround && ((V.phase === 'ko' && V.t > 40) || V.phase === 'result' || V.phase === 'duelEnd')) {
      const pose = winPose(V.f[V.winner].hero || '');
      if (!p._winFx) { p._winFx = true; const h = D.heroes[V.f[V.winner].hero]; if (h) { fx.ring(p.x, p.y - 16, h.colorHi, 4, 34, 18); fx.spark(p.x, p.y - 30, h.colorHi, 10, 2.4); } }
      return () => [pose, Math.floor(SW.frame / 22) % 2];
    }
    p._winFx = false;
    if ((s === 'attack' || s === 'airatk') && a) {                     // 1. in-betweens around the strike
      if (st >= a.hitAt - 2 && st < a.hitAt) return n => [tw(n, p), 0];
      if (st > a.hitEnd + 2 && st <= a.hitEnd + 5) return n => [tw(n, p), 1];
      return null;
    }
    if (s === 'cast') { if (st === 3 || st === 4) return n => [n + '~', 0]; if (st >= 13 && st <= 15) return n => [n + '~', 1]; return null; }
    if (s === 'rush' || s === 'wave') { if (st >= 5 && st < 7) return n => [n + '~', 0]; if (st >= 21 && st <= 23) return n => [n + '~', 1]; return null; }
    if (s === 'hurt') {                                                  // 2-3. tumbling, heavy and from-behind reactions
      if (!p.onGround && p._tumble && SW.frame - p._hkT < 90) return () => ['tumble', Math.min(2, Math.floor((SW.frame - p._hkT) / 5))];
      if (p._hk && SW.frame - p._hkT < 30) return () => [p._hk === 'b' ? 'hurtb' : 'hurtf', 0];
      return null;
    }
    if ((s === 'idle' || s === 'run') && p.onGround) {                  // 4. landing crouch and turns
      if (p._land > 3) return () => ['land', 0];
      if (p._turn > 0) return () => ['turn', 0];
    }
    return null;
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    A2.sub = A2.on ? heroPick(this) : null;
    A2.breath = this.state === 'idle' && this.onGround && Math.abs(this.vx) < 0.1 && !(this._land > 0);
    try { return _pd.apply(this, arguments); } finally { A2.sub = null; A2.breath = false; }
  };
  const _pu = P.update;
  P.update = function () {
    const face = this.face, r = _pu.apply(this, arguments);
    if (this._turn > 0) this._turn--;
    if (this.face !== face && this.onGround && (this.state === 'run' || this.state === 'idle')) this._turn = 4;
    return r;
  };
  const hitKind = (who, atk) => {
    const sx = atk.srcX !== undefined ? atk.srcX : who.x - who.face;
    who._hk = atk.heavy || atk.launch || atk.down || (atk.dmg || 0) >= 30 ? 'b' : (sx - who.x) * who.face < 0 ? 'f' : '';
    who._hkT = SW.frame;
    who._tumble = !!(atk.launch || atk.down || (atk.ky || 0) <= -4.5);   // thrown into the air: tumble until landing
  };
  const _ph = P.takeHit;
  P.takeHit = function (atk) { const r = _ph.apply(this, arguments); if (r === 'hit' && atk) hitKind(this, atk); return r; };

  // ---- foes ----
  function foePick(e) {
    if (e.dead || (e.def && e.def.anims)) return null;                  // custom-drawn creatures keep their own frames
    const s = e.state, st = e.st, d = e.def || {};
    if (e.lying > 0 && e.lying <= 14) return () => ['getup', e.lying > 7 ? 0 : 1];
    if (e.stun > 0 && !e.lying) {
      if (!e.onGround && e.downed && !d.fly) return () => ['tumble', Math.min(2, Math.floor((SW.frame - (e._hkT || 0)) / 5))];
      if (e._hk && SW.frame - e._hkT < 24) return () => [e._hk === 'b' ? 'hurtb' : 'hurtf', 0];
      return null;
    }
    if (s === 'windup' && d.windup && d.windup - st <= 4) return n => [n + '~', 0];
    if (s === 'strike' && st >= 9 && st <= 12) return n => [n + '~', 1];
    return null;
  }
  const _ed = E.draw;
  E.draw = function (ctx, cam, g) {
    A2.sub = A2.on ? foePick(this) : null;
    if (A2.on && this.dead && this._death === 'crumble') {                // 7. a Husk crumbles: sinks and thins out
      const k = Math.min(1, (this.deadT || 0) / 40);
      SW.anim.tf = { dx: 0, sx: 1 + k * 0.2, sy: Math.max(0.2, 1 - k * 0.8) };
    }
    try { return _ed.apply(this, arguments); } finally { A2.sub = null; }
  };
  const _et = E.takeHit;
  E.takeHit = function (atk) { const r = _et.apply(this, arguments); if (r === 'hit' && atk) hitKind(this, atk); return r; };

  // ================= 7. deaths in their own style =================
  const kindOf = e => {
    const d = e.def || {}, nm = ((d.name || '') + ' ' + (e.sheet || '')).toLowerCase();
    if (d.energyOnly || /husk/.test(nm)) return 'crumble';
    if (d.fly || d.ai === 'drone' || /drone|turret|mech|unit|bot|enforcer|guard|trooper|warden|sentry|engine/.test(nm)) return 'machine';
    if (d.beast || /rat|feral|hound|wolf|crawler|beast|alpha|mother|spider|bug/.test(nm)) return 'beast';
    return 'person';
  };
  const _eu = E.update;
  E.update = function (g, z) {
    const wasGround = this.onGround, vy0 = this.vy, r = _eu.apply(this, arguments);
    if (!A2.on) return r;
    if (!wasGround && this.onGround && vy0 > 3.5 && this.stun > 0) { fx.dust(this.x, this.y, 5); if (SW.anim && SW.anim.on) this._hitT = Math.max(this._hitT || 0, 4); }   // a thrown foe bounces
    if (this.dead && !this._death) {
      const k = this._death = kindOf(this), x = this.x, y = this.y - (this.h || 24) / 2, big = this.isBoss ? 2 : 1;
      if (k === 'machine') { fx.spark(x, y, '#ffd060', 14 * big, 3.4); fx.debris(x, y, '#8a92a8', 8 * big); fx.ring(x, y, '#ffb040', 4, 22 * big, 12); SW.audio.sfx('zap'); }
      else if (k === 'beast') { fx.dust(this.x, this.y, 8 * big); fx.debris(x, y + 6, '#5a4634', 4 * big); }
      else if (k === 'crumble') { for (let i = 0; i < 16 * big; i++) fx.list.push({ k: 'p', x: x + SW.rand(-8, 8), y: y + SW.rand(-12, 12), vx: SW.rand(-0.4, 0.4), vy: SW.rand(-1.2, -0.3), g: -0.01, life: 40, max: 40, col: i % 2 ? '#b9a0ff' : '#5a5070', s: 2, a: 0.8 }); }
      else { fx.dust(this.x, this.y, 4 * big); }
    }
    if (this.dead && this._death === 'machine' && (this.deadT || 0) < 40 && SW.frame % 6 === 0) fx.spark(this.x + SW.rand(-6, 6), this.y - SW.rand(4, 20), '#ffd060', 2, 1.6);   // it keeps sparking a moment
    return r;
  };

  // ================= 6. the story health bar drains =================
  const ui = SW.ui, _hud = ui.hud;
  let lag = null, lagT = 0, lastHp = null;
  ui.hud = function (ctx, g) {
    if (A2.on && g.player && g.state) {
      const S = g.state, mx = g.player.hpMax(), hp = Math.max(0, S.hp);
      if (lag === null || hp > lag || lastHp === null) lag = hp;
      if (lastHp !== null && hp < lastHp - 0.01) lagT = 28;
      lastHp = hp;
      if (lagT > 0) lagT--; else lag = Math.max(hp, lag - mx * 0.012);
    }
    const r = _hud.apply(this, arguments);
    if (A2.on && g.player && lag !== null && g.state && lag > Math.max(0, g.state.hp)) {   // the chunk, on the empty part of the bar
      const mx = g.player.hpMax(), hp = Math.max(0, g.state.hp), x0 = 10 + Math.round(104 * hp / mx), w = Math.round(104 * (lag - hp) / mx);
      art.rect(ctx, lagT > 20 ? '#ffffff' : '#ff9a5a', x0, 9, Math.max(1, w), 6);
    }
    return r;
  };

  // ================= 8. livelier backgrounds =================
  const Z = SW.Zone.prototype, _dd = Z.drawDecor;
  Z.drawDecor = function (ctx, d, cx, cy) {
    if (!A2.on) return _dd.apply(this, arguments);
    if (d.kind === 'banner' || d.kind === 'flag') {                    // sway from the top of the pole
      const a = Math.sin(SW.frame * 0.035 + d.x * 0.05) * 0.06, px = d.x - cx, py = d.y - cy - 34;
      ctx.save(); ctx.translate(px, py); ctx.transform(1, 0, a, 1, 0, 0); ctx.translate(-px, -py);
      try { return _dd.apply(this, arguments); } finally { ctx.restore(); }
    }
    const r = _dd.apply(this, arguments);
    if (d.kind === 'lamp') {                                           // the bulb hums: a soft pulse, and now and then a dip and a falling spark
      const f = Math.sin(SW.frame * 0.13 + d.x) + Math.sin(SW.frame * 0.31 + d.x * 0.7);
      if (f > -1.3) art.glow(ctx, d.x - cx, d.y - cy - (d.gy || 47), 10, d.col || '#f5c542', 0.04 + 0.03 * Math.sin(SW.frame * 0.05 + d.x));
      if (f < -1.6 && SW.frame % 8 === 0) fx.list.push({ k: 'p', x: d.x + SW.rand(-3, 3), y: d.y - (d.gy || 47) + 1, vx: SW.rand(-0.5, 0.5), vy: 0.6, g: 0.05, life: 14, max: 14, col: '#fff7d0', s: 1 });
    }
    return r;
  };
  // drifting particles by area: ash, dust, spores, glass glints, embers, motes
  const AMBIENT = {
    slums: ['#8a8070', 0.5, 'fall'], market: ['#ff6ad5', 0.25, 'rise'], metro: ['#6fd3e8', 0.35, 'drip'], pit: ['#ffb060', 0.4, 'rise'],
    scrapton: ['#d8c8a0', 0.4, 'wind'], dunes: ['#e8c88a', 0.9, 'wind'], glowwild: ['#7dffa0', 0.7, 'rise'], crater: ['#c8a8ff', 0.6, 'glint'],
    skylift: ['#ffffff', 0.3, 'wind'], skyport: ['#ffffff', 0.25, 'wind'], noble: ['#ffe7a8', 0.35, 'glint'], spire: ['#bfe8ff', 0.4, 'glint'],
    enginecore: ['#b48cff', 0.8, 'rise'], medlab: ['#bfe8ff', 0.2, 'glint'], furnace: ['#ff8a3a', 0.8, 'rise'], works: ['#ffb060', 0.4, 'rise'],
    cryo: ['#eaf6ff', 0.6, 'fall'], icehouse: ['#eaf6ff', 0.7, 'fall'], hollow: ['#9affc0', 0.5, 'rise'], docks: ['#9ad8ff', 0.3, 'drip'],
    stacks: ['#8a8070', 0.4, 'fall'], yard: ['#d8c8a0', 0.4, 'wind'], milezero: ['#e8c88a', 0.6, 'wind'], shrine: ['#ffe7a8', 0.3, 'glint']
  };
  const _zd = Z.draw;
  Z.draw = function (ctx, cam, g) {
    const r = _zd.apply(this, arguments);
    const amb = A2.on && AMBIENT[this.id];
    if (amb && fx.list.length < 260 && Math.random() < amb[1] * 0.25) {
      const [col, , mode] = amb, x = cam.x + Math.random() * SW.W, y = cam.y + Math.random() * SW.H;
      const p = { k: 'p', x, y, vx: 0, vy: 0, g: 0, life: 90, max: 90, col, s: 1, a: 0.55 };
      if (mode === 'fall') { p.y = cam.y - 4; p.vy = 0.35; p.vx = SW.rand(-0.15, 0.15); }
      else if (mode === 'rise') { p.vy = -0.25; p.vx = SW.rand(-0.1, 0.1); }
      else if (mode === 'wind') { p.x = cam.x - 4; p.vx = SW.rand(0.6, 1.4); p.vy = SW.rand(-0.1, 0.1); p.life = p.max = 160; }
      else if (mode === 'drip') { p.y = cam.y + Math.random() * 40; p.vy = 0.2; p.g = 0.08; p.life = p.max = 40; }
      else if (mode === 'glint') { p.life = p.max = 24; p.s = 2; p.a = 0.8; }
      fx.list.push(p);
    }
    return r;
  };
})();
