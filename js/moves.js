'use strict';
// Shattered Worlds — moves update. Loaded last; like the story files it only adds and wraps.
//
//   S + I   a NEW skill for every hero (BURST below): one bar of energy, the hardest-hitting move short of the ultimate.
//           It is known as soon as the hero knows their I move, so old saves and Versus have it at once.
//   S + O   the timed power-up that used to be on S + I (Overcharge, Stillwater ...).
//   Cooldowns: a skill cannot be thrown again straight away (CD, in frames). The HUD shows the four skill slots.
//   Combos: cancelling a normal that connected into any skill holds the target long enough for the skill to land,
//           so J J J > U / S+U / I / S+I is a true combo for every hero. Each skill then waits out its cooldown, so a
//           long combo has to use different moves.
//   Look: every skill gets a gather-and-release flourish, shots leave trails, heavy hits throw streaks, heroes squash
//           and stretch on jumps and landings, and the big moves draw speed lines. Optional effect art in
//           assets/fx/fx_<name>.png (six square frames in a row) is drawn on top if the files exist.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, V = SW.versus;
  const P = SW.Player.prototype, A = D.abilities, HR = D.heroes, text = SW.text, W = SW.W, H = SW.H, rand = SW.rand;
  const sfx = n => SW.audio.sfx(n);

  // ================= helpers =================
  const hit = (x, y, w, h, dmg, o) => SW.strike(G, Object.assign({ team: 'player', x, y, w, h, dmg, kx: 0, ky: -2, stun: 28, energy: true, heavy: true, hitSet: new Set(), quiet: true }, o || {}));
  const hurt = (e, dmg, o) => { if (!e || e.dead) return; const b = e.box(), atk = Object.assign({ team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg, kx: 0, ky: -2, stun: 26, energy: true, heavy: true, hitSet: new Set(), quiet: true }, o || {}); if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); };
  const isFoe = e => e.hittable && e.team === 'enemy' && !e.dead;
  const foes = (z, x, y, r) => z.ents.filter(e => isFoe(e) && Math.hypot(e.x - x, e.y - e.h / 2 - y) < r);
  const light = e => !e.isBoss && !e.isProxy && !(e.def && e.def.heavy);
  const part = (x, y, col, vx, vy, life, s, g) => fx.list.push({ k: 'p', x, y, vx: vx || 0, vy: vy || 0, g: g || 0, life: life || 14, max: life || 14, col, s: s || 2 });
  const front = (p, reach, h, back, up) => [p.face > 0 ? p.x - (back || 0) : p.x - reach, p.y - (up === undefined ? h : up), reach + (back || 0), h];
  const slide = (p, z, dir, n) => { for (let s = 0; s < n; s++) { if (z.hit(p.x + dir - p.w / 2, p.y - p.h, p.w, p.h)) return false; p.x += dir; } return true; };
  // the nearest enemy ahead of the hero (a little behind counts too)
  const aim = (p, z, r) => { let best = null, bd = r; z.ents.forEach(e => { if (!isFoe(e)) return; const d = Math.hypot(e.x - p.x, e.y - p.y); if ((e.x - p.x) * p.face > -24 && d < bd) { bd = d; best = e; } }); return best; };
  const skin = p => { const s = art.sheets[p.sheet()], c = s && s.cfg && s.cfg.c; return (c && (c.fore || c.skin)) || '#d8a878'; };
  const doorFx = (x, y, col) => { fx.ring(x, y, col, 3, 22, 12); for (let i = 0; i < 8; i++) part(x + rand(-4, 4), y + rand(-16, 16), i % 2 ? col : '#ffffff', rand(-0.6, 0.6), rand(-1, 1), 16); };

  class Later { constructor(n, fn) { this.n = n; this.fn = fn; } update(g, z) { if (--this.n <= 0) { this.gone = true; this.fn(g, z); } } draw() {} }
  // holds the hero in the cast pose for up to n frames; step(t, p, z, g) runs every frame and returns false to stop
  class Drive {
    constructor(p, n, step, end) { Object.assign(this, { p, n, step, end, t: 0 }); }
    update(g, z) {
      const p = this.p;
      if (p.dead || p.state === 'hurt') { this.gone = true; p.pose = null; return; }
      this.t++; p.state = 'cast'; p.st = 8; p.castFn = null;
      if (this.step(this.t, p, z, g) === false || this.t >= this.n) { this.gone = true; if (this.end) this.end(p, z, g); p.pose = null; p.enter(p.onGround ? 'idle' : 'fall'); }
    }
    draw() {}
  }
  // something drawn for a while: render(ctx, screenX, screenY, t, self); tick(self, g, z) runs every frame
  class Vis {
    constructor(x, y, life, render, tick) { Object.assign(this, { x, y, life, render, tick, t: 0 }); }
    update(g, z) { this.t++; if (this.tick) this.tick(this, g, z); if (this.t >= this.life) this.gone = true; }
    draw(ctx, cam) { this.render(ctx, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this.t, this); }
  }
  // a column that bursts out of the ground after a short warning: o = { w, h, dmg, cols[3], atk, spike, ring, sfx }
  function pillar(z, x, gy, delay, o) {
    const hs = new Set();
    z.shots.push(new Vis(x, gy, delay + 30, (ctx, sx, sy, t) => {
      if (t < delay) { ctx.globalAlpha = 0.55; art.rect(ctx, o.cols[0], Math.round(sx - o.w / 2 * (t / delay)), sy - 1, Math.round(o.w * (t / delay)), 2); ctx.globalAlpha = 1; return; }
      const k = t - delay, hh = Math.round(o.h * Math.min(1, k / 5) * (k > 22 ? Math.max(0, 1 - (k - 22) / 8) : 1));
      for (let i = 0; i < hh; i += 4) {
        const f = o.spike ? 1 - i / o.h : 0.75 + 0.25 * Math.sin(i * 0.4 + k * 0.6), w = Math.max(2, Math.round(o.w * f));
        art.rect(ctx, o.cols[0], Math.round(sx - w / 2), sy - i - 4, w, 4); art.rect(ctx, o.cols[1], Math.round(sx - w / 4), sy - i - 4, Math.max(1, Math.round(w / 2)), 4);
        if (i % 12 === 0) art.rect(ctx, o.cols[2], Math.round(sx - w / 2) + 1, sy - i - 4, 1, 4);
      }
      art.glow(ctx, sx, sy - hh / 2, o.w, o.cols[0], 0.14);
    }, v => {
      if (v.t !== delay) return;
      hit(x - o.w / 2, gy - o.h, o.w, o.h, o.dmg, Object.assign({ hitSet: hs, srcX: x }, o.atk));
      fx.ring(x, gy - 6, o.ring || o.cols[0], 6, o.w + 14, 12); fx.debris(x, gy - 10, o.cols[1], 8); fx.shake(4, 8); sfx(o.sfx || 'explode'); strip(o.fx, x, gy - o.h / 2, o.h);
    }));
  }

  // ================= optional effect art (assets/fx/fx_<name>.png: six square frames in a row, on black) =================
  const FXNAMES = ['hit', 'bolt', 'ice', 'fire', 'rock', 'wind', 'blast', 'void', 'rift', 'light'], strips = [];
  const ELEM = { kael: 'bolt', fenn: 'bolt', nyra: 'ice', isolde: 'ice', brakk: 'rock', pyra: 'fire', ashka: 'fire', gale: 'wind', dyna: 'blast', vesper: 'void',
    orin: 'rift', mira: 'light', noct: 'void', bando: 'hit', aldric: 'light', sen: 'wind', vega: 'rift', tessa: 'light', jax: 'blast', ferra: 'bolt',
    kiri: 'wind', tarn: 'hit', maren: 'ice', yara: 'light', brann: 'hit' };
  // assets/fx/list.json names the strips that exist (tools/fit-fx.ps1 writes it), so a game without them asks for one file, not ten
  try { fetch('assets/fx/list.json').then(r => (r.ok ? r.json() : [])).then(list => list.forEach(n => { if (FXNAMES.indexOf(n) < 0) return; const im = new Image(); im.onload = () => { art.bg['fx_' + n] = im; }; im.src = 'assets/fx/fx_' + n + '.png'; })).catch(() => {}); } catch (e) { /* no fetch: no effect art */ }
  function strip(name, x, y, size) { if (name && art.bg['fx_' + name] && strips.length < 24) strips.push({ name, x, y, size: size || 48, t: 0 }); }
  const elem = () => (G.state && ELEM[G.state.hero]) || 'hit';
  const _zd = SW.Zone.prototype.draw; SW.Zone.prototype.draw = function (ctx, cam, g) {
    _zd.call(this, ctx, cam, g);
    if (!strips.length) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = strips.length - 1; i >= 0; i--) {
      const s = strips[i], im = art.bg['fx_' + s.name], fs = im.height, n = Math.max(1, Math.round(im.width / fs)), f = Math.floor(s.t / 2);
      if (f >= n) { strips.splice(i, 1); continue; }
      ctx.drawImage(im, f * fs, 0, fs, fs, Math.round(s.x - cam.x - s.size / 2), Math.round(s.y - cam.y - s.size / 2), s.size, s.size);
      if (!g.hitstop) s.t++;
    }
    ctx.restore();
  };

  // ================= cooldowns =================
  // frames at 60 a second. Slots: u (U), su (S+U), i (I), si (S+I). CD_FOR overrides one ability.
  const CD = { u: 45, su: 140, i: 200, si: 420 }, SLOTS = ['u', 'su', 'i', 'si'], KEYS = { u: 'U', su: 'S+U', i: 'I', si: 'S+I' };
  const CD_FOR = { quick_shot: 14, spark_dart: 36, thunder_totem: 300, mine: 80, rewind: 360 };
  const slotId = (h, slot) => (slot === 'si' ? (BURST[h.id] || {}).id : h.kit[slot === 'u' ? 0 : slot === 'su' ? 1 : 2]);
  function ready(p, slot) {
    const cd = p.cd || (p.cd = {});
    if (!(cd[slot] > 0)) return true;
    if (!(p.cdDeny > 0)) { sfx('deny'); p.cdDeny = 24; p.cdFlash = slot; }
    return false;
  }
  function used(p, slot, lvl) {
    const h = p.G.hero(), id = slotId(h, slot);
    (p.cd || (p.cd = {}))[slot] = CD_FOR[id] || CD[slot];
    link(p, slot === 'u' || slot === 'su' ? 30 : slot === 'i' ? 40 : 56);
    flourish(p, h, lvl);
  }
  // a normal that connected, cancelled into a skill: hold what it hit until the skill lands
  function link(p, n) { if (!p.linkLive || !p.hitSet) return; p.hitSet.forEach(e => { if (e && !e.dead && !e.isBoss && e.stagger) { e.stagger(n); e.vx *= 0.25; } }); }
  Object.keys(HR).forEach(id => { HR[id].id = id; });
  // the same for a normal chained into the next normal: J J J J, the launcher and the sweep are true combos
  const _sa = P.startAttack; P.startAttack = function (def, air) {
    const prev = this.linkLive ? this.hitSet : null;
    _sa.call(this, def, air);
    if (!prev || !prev.size) return;
    if (!air) this.vx = this.face * 3.2;                                   // step in after the target, which each hit pushes away
    prev.forEach(e => { if (e && !e.dead && !e.isBoss && e.stagger) { e.stagger((def.hitAt || 6) + 6); e.vx *= 0.3; } });
  };

  const _sk = P.useSkill; P.useSkill = function (alt) {
    const g = this.G, h = g.hero(), slot = alt && g.has(h.kit[1]) ? 'su' : 'u';
    if (!g.has(h.kit[slot === 'u' ? 0 : 1])) return _sk.call(this, alt);
    if (!ready(this, slot)) return;
    const e0 = g.state.energy;
    _sk.call(this, alt);
    if (g.state.energy < e0) used(this, slot, slot === 'u' ? 0 : 1);
  };
  const _sp = P.useSpecial; P.useSpecial = function () {
    const g = this.G, S = g.state, b = BURST[S.hero];
    const bot = g.scene === 'vs' && V && V.cur && V.cur.bot && V.cur.p === this;
    if ((I.held('down') && !I.held('up')) || (bot && !I.held('up') && b && g.has(b.id) && S.energy >= 100 && !((this.cd || {}).si > 0) && Math.random() < 0.4)) { burst(this); return; }   // S + I (a bot throws it now and then in place of I)
    if (I.held('up')) return _sp.call(this);                                 // the ultimate: no cooldown, it costs the whole bar
    if (!ready(this, 'i')) return;
    const e0 = S.energy;
    _sp.call(this);
    if (S.energy < e0) used(this, 'i', 1);
  };
  // the timed power-up, moved from S + I to S + O
  const _aw = P.useAwaken; P.useAwaken = function () {
    const g = this.G, h = g.hero();
    if (I.held('down') && g.has(h.mode)) {
      if (this.modeT > 0) { if (!(this.cdDeny > 0)) { sfx('deny'); this.cdDeny = 24; } }
      else if (this.spend(A[h.mode].cost)) { this.modeT = 600; sfx('awaken'); fx.ring(this.x, this.y - 16, h.colorHi, 6, 50, 20); g.toast(A[h.mode].name + ' - 10 s'); flourish(this, h, 1); }
      return;
    }
    return _aw.call(this);
  };
  Object.keys(HR).forEach(id => { const m = A[HR[id].mode]; if (m) m.input = 'S + O'; });

  // ================= the new S + I skills =================
  const BURST = {};
  const mv = (hero, id, name, dmg, desc, cast, o) => { if (!HR[hero]) return; BURST[hero] = Object.assign({ id, cast }, o || {}); A[id] = { name, input: 'S + I', cost: 100, dmg, desc }; if (HR[hero].kit.indexOf(id) < 0) HR[hero].kit.push(id); };
  function burst(p) {
    const g = p.G, h = g.hero(), b = BURST[g.state.hero];
    if (!b || !g.has(b.id) || !ready(p, 'si')) return;
    if (b.ground && !p.onGround) return;
    if (!p.spend(A[b.id].cost)) return;
    used(p, 'si', 2);
    const dmg = Math.round(A[b.id].dmg * p.specMul()), z = g.zone;
    p.enter('cast'); p.st = -4; p.castFn = () => b.cast(p, z, dmg, h);
  }
  const _has = G.has; G.has = id => { const b = G.state && BURST[G.state.hero]; return b && b.id === id ? _has(G.hero().kit[2]) : _has(id); };

  mv('kael', 'rising_storm', 'Rising Storm', 13, 'A rising lightning uppercut: four hits that carry enemies into the air with you. Follow it with an air combo.', (p, z, dmg, h) => {
    const hs = new Set(); p.vy = -8.6; p.onGround = false; sfx('zap'); fx.shake(4, 10); p.pose = ['launcher', 1];
    z.shots.push(new Drive(p, 16, t => {
      p.vx = p.face * (t < 6 ? 2.6 : 1.2); if (t % 4 === 1) hs.clear();
      hit(...front(p, 44, 60, 12, 54), dmg, { kx: p.face * 0.5, ky: -7.8, stun: 36, launch: true, hitSet: hs, srcX: p.x - p.face * 10 });
      fx.bolt(p.x + rand(-12, 12), p.y + 8, p.x + p.face * 10, p.y - 46, h.colorHi);
      if (t % 2) fx.ghost(p.sheet(), 'launcher', 1, p.x, p.y, p.face < 0);
    }));
  });
  mv('nyra', 'stilled_verse', 'Stilled Verse', 17, 'Three breaths of winter, each reaching further than the last. The third freezes everything it touches solid.', (p, z, dmg) => {
    const dir = p.face, x0 = p.x, y0 = p.y; sfx('perfect');
    [0, 1, 2].forEach(k => z.shots.push(new Later(1 + k * 7, () => {
      const reach = 54 + k * 34;
      hit(dir > 0 ? x0 : x0 - reach, y0 - 46, reach, 48, dmg, { kx: dir * (k < 2 ? 1 : 3), ky: -1.5, stun: 30, status: { freeze: k === 2 ? 100 : 30 }, srcX: x0 });
      for (let i = 0; i < 14; i++) part(x0 + dir * rand(10, reach), y0 - rand(2, 44), i % 3 ? '#bfefff' : '#ffffff', dir * rand(1, 3), rand(-0.6, 0.6), 18, i % 4 ? 2 : 3);
      fx.ring(x0 + dir * reach * 0.6, y0 - 22, '#7fd8ff', 6, 20 + k * 8, 12); strip('ice', x0 + dir * reach * 0.7, y0 - 24, 56);
      if (k === 2) { fx.flash('#d6f4ff', 6); sfx('shard'); }
    })));
    z.shots.push(new Vis(x0, y0, 30, (ctx, x, y, t) => { for (let i = 0; i < 7; i++) { const hh = Math.round(Math.max(0, Math.min(1, (t - i * 2) / 6)) * (10 + (i % 3) * 7) * (t > 22 ? (30 - t) / 8 : 1)); if (hh > 0) { art.rect(ctx, '#7fd8ff', x + dir * (16 + i * 16) - 2, y - hh, 4, hh); art.rect(ctx, '#ffffff', x + dir * (16 + i * 16) - 1, y - hh, 1, hh); } } }));
  });
  mv('fenn', 'hounds_leap', "Hound's Leap", 46, 'Leap in a long arc and come down like a thunderclap. Everything near the landing is thrown into the air.', (p, z, dmg, h) => {
    // land on the nearest enemy ahead; a short hop for a close one, so the leap still lands inside a combo
    const e = aim(p, z, 200), dist = e ? Math.abs(e.x - p.x) : 150, up = 4.8 + 2.6 * Math.min(1, dist / 150), vx = SW.clamp(dist / (2 * up / (SW.GRAV || 0.45)), 0.6, 5);
    p.vy = -up; p.onGround = false; sfx('jump'); p.pose = ['jump', 0];
    z.shots.push(new Drive(p, 50, t => {
      p.vx = p.face * vx; p.iframes = Math.max(p.iframes, 2); p.pose = [p.vy < 0 ? 'jump' : 'fall', 0];
      if (t % 2) fx.ghost(p.sheet(), p.vy < 0 ? 'jump' : 'fall', 0, p.x, p.y, p.face < 0);
      if (t > 6 && p.onGround) return false;
    }, () => {
      p.vx = 0; SW.boom(p.x + p.face * 10, p.y - 8, 58, dmg, h.color, null, { ky: -7.5, launch: true, stun: 40 }); fx.shake(7, 14); fx.dust(p.x, p.y, 10); strip('bolt', p.x, p.y - 30, 80);
      for (let i = 0; i < 6; i++) fx.bolt(p.x + rand(-50, 50), p.y - 80, p.x + rand(-30, 30), p.y, h.colorHi);
    }));
  });
  mv('isolde', 'eyrie_spire', 'Eyrie Spire', 48, 'A spire of ice bursts up under the nearest enemy and throws it skyward, frozen.', (p, z, dmg) => {
    const e = aim(p, z, 190), x = e ? e.x : p.x + p.face * 70, gy = e && Math.abs(e.y - p.y) < 48 ? e.y : p.y; sfx('charge');
    pillar(z, x, gy, 10, { w: 30, h: 92, dmg, spike: true, cols: ['#7fd8ff', '#d6f4ff', '#ffffff'], atk: { ky: -9, launch: true, stun: 44, status: { freeze: 50 } }, sfx: 'shard', fx: 'ice' });
  });
  mv('brakk', 'wardens_wall', "Warden's Wall", 13, 'A slab of bedrock rises and ploughs forward, shoving everything ahead of it. Four hits. Smashes cracked walls.', (p, z, dmg) => {
    const dir = p.face, hs = new Set(); sfx('roar'); fx.shake(5, 12);
    z.shots.push(new Vis(p.x + dir * 12, p.y, 34, (ctx, x, y, t) => {
      const hh = Math.round(50 * Math.min(1, t / 5) * (t > 28 ? (34 - t) / 6 : 1));
      art.rect(ctx, '#4a4030', x - 10, y - hh, 20, hh); art.rect(ctx, '#6b5a3a', x - 8, y - hh, 16, hh); art.rect(ctx, '#a89a80', x - 8, y - hh, 3, hh); art.rect(ctx, '#c8a05a', x - 8, y - hh, 16, 2);
      for (let j = 8; j < hh; j += 12) art.rect(ctx, '#4a4030', x - 4 + (j % 24 ? 0 : 5), y - j, 6, 1);
    }, (v, g, zz) => {
      if (v.t > 5 && v.t < 29) {
        if (!zz.hit(v.x + dir * 12, v.y - 30, 2, 20)) v.x += dir * 5;
        if (v.t % 6 === 0) hs.clear();
        hit(v.x - 14, v.y - 52, 28, 52, dmg, { kx: dir * 6, ky: -2.5, stun: 30, breaker: true, hitSet: hs, srcX: v.x - dir * 14 });
        if (v.t % 3 === 0) fx.dust(v.x - dir * 8, v.y, 2, -dir);
      }
      if (v.t === 33) { fx.debris(v.x, v.y - 24, '#a89a80', 14); strip('rock', v.x, v.y - 24, 64); }
    }));
  }, { ground: true });
  mv('pyra', 'forge_breath', 'Forge Breath', 7, 'Breathe out the forge: a long gout of fire that hits again and again and leaves everything burning.', (p, z, dmg) => {
    const hs = new Set(); sfx('roar'); p.pose = ['special', 1];
    z.shots.push(new Drive(p, 40, t => {
      const dir = p.face, mx = p.x + dir * 12, my = p.y - 24; p.vx = -dir * 0.3;
      for (let i = 0; i < 3; i++) { const sp = rand(3.5, 6.5), a = rand(-0.22, 0.22); part(mx, my, i ? (Math.random() < 0.5 ? '#ff7043' : '#ffd24a') : '#ffffff', dir * sp * Math.cos(a), sp * Math.sin(a), 16 + rand(0, 6), 2 + (Math.random() * 3 | 0), -0.01); }
      if (t % 6 === 1) { hs.clear(); if (t > 1) sfx('burst'); strip('fire', mx + dir * 60, my, 56); }
      hit(dir > 0 ? p.x - 6 : mx - 104, my - 20, 122, 40, dmg, { kx: dir * 1.2, ky: -1, stun: 22, heavy: false, status: { burn: 5 }, hitSet: hs, srcX: p.x - dir * 8 });
      if (t % 8 === 0) fx.shake(2, 4);
    }));
  });
  mv('gale', 'downdraft_kick', 'Downdraft Kick', 24, 'Ride the wind up and dive. The kick hits once, and the gust where you land throws enemies into the air.', (p, z, dmg) => {
    const hs = new Set(); let dove = false, dvx = 6.2; if (p.onGround) { p.vy = -7.8; p.onGround = false; } sfx('jump'); p.pose = ['jump', 0];
    z.shots.push(new Drive(p, 70, t => {
      if (!dove) {
        p.vx = p.face * 0.6;
        if (p.vy > -1.5 || t > 14) {   // dive at the nearest enemy ahead: steeply at one that is close, so the kick does not sail over it
          const e = aim(p, z, 220), fall = e ? Math.max(4, (e.y - 14 - p.y) / 7.4) : 0;
          dove = true; sfx('dash'); p.pose = ['air', 1]; if (e && fall > 0) dvx = SW.clamp(Math.abs(e.x - p.x) / fall, 0.4, 6.2);
        }
        return;
      }
      p.vx = p.face * (hs.size ? 0.6 : dvx); p.vy = 7.4; p.iframes = Math.max(p.iframes, 2);   // once the kick lands, come down beside it
      if (t % 2) fx.ghost(p.sheet(), 'air', 1, p.x, p.y, p.face < 0);
      part(p.x - p.face * 8, p.y - 20, '#c8ffe4', -p.face * 2, -2, 10, 1);
      hit(p.x - 14, p.y - 30, 28, 34, dmg, { kx: p.face * 0.5, ky: 3, stun: 34, hitSet: hs, srcX: p.x - p.face * 10 });
      if (p.onGround) return false;
    }, () => {
      p.vx = 0; SW.boom(p.x, p.y - 6, 62, dmg, '#7dffb2', null, { ky: -7.5, launch: true, stun: 38 }); strip('wind', p.x, p.y - 24, 80);
      for (let i = 0; i < 12; i++) part(p.x + rand(-40, 40), p.y - rand(0, 10), '#c8ffe4', rand(-2, 2), rand(-4, -1), 20, 2);
    }));
  });
  mv('ashka', 'caldera', 'Caldera', 18, 'Stamp once. Columns of lava break out on both sides of you, each further off than the last, and throw what they catch straight up.', (p, z, dmg) => {
    const x0 = p.x, gy = p.y, lava = { w: 26, h: 70, dmg, cols: ['#ff7043', '#ffd24a', '#ffffff'], atk: { kx: 0, ky: -6.5, launch: true, stun: 34, status: { burn: 5 } } }; sfx('roar'); fx.shake(5, 14);
    pillar(z, x0, gy, 2, Object.assign({}, lava, { h: 40, fx: 'fire' }));   // and one under your own feet, for whatever is standing on you
    for (let k = 0; k < 4; k++) [-1, 1].forEach(s => pillar(z, x0 + s * (24 + k * 28), gy, 4 + k * 6, { w: 26, h: 70, dmg, cols: ['#ff7043', '#ffd24a', '#ffffff'], atk: { kx: 0, ky: -6.5, launch: true, stun: 34, status: { burn: 5 } }, fx: k % 2 ? null : 'fire' }));
  }, { ground: true });
  mv('dyna', 'recoil_blast', 'Recoil Blast', 46, "A shaped charge at arm's length. It throws enemies clear across the room and kicks you backwards. Smashes cracked walls.", (p, z, dmg) => {
    const dir = p.face, mx = p.x + dir * 14, my = p.y - 20; sfx('explode'); fx.shake(8, 14); fx.flash('#ffe7a8', 5);
    hit(dir > 0 ? mx - 6 : mx - 96, my - 30, 102, 56, dmg, { kx: dir * 8.5, ky: -3.5, stun: 40, down: true, breaker: true, status: { burn: 4 }, srcX: p.x });
    for (let i = 0; i < 26; i++) { const a = rand(-0.5, 0.5), sp = rand(2, 8); part(mx, my, i % 3 ? (i % 2 ? '#ff8a3a' : '#ffd24a') : '#ffffff', dir * sp * Math.cos(a), sp * Math.sin(a), 12 + rand(0, 12), 2 + (i % 3)); }
    for (let i = 0; i < 8; i++) part(mx + dir * rand(0, 30), my + rand(-10, 10), '#5a5048', dir * rand(0.3, 1.2), rand(-1.2, -0.3), 34, 4, -0.01);
    fx.ring(mx + dir * 20, my, '#ffd24a', 8, 46, 12); strip('blast', mx + dir * 34, my, 90);
    p.vx = -dir * 6.5; p.vy = -3.2; p.onGround = false;
  });
  mv('vesper', 'pinned_shadow', 'Pinned Shadow', 22, "Nail the nearest enemy's shadow to the floor. It cannot move. A moment later, the shadow bites.", (p, z, dmg, h) => {
    const e = aim(p, z, 200); sfx('shoot');
    if (!e) { hit(...front(p, 70, 40, 4), dmg, { kx: p.face * 3 }); fx.slash(p.x + p.face * 30, p.y - 20, p.face, 2, h.colorHi, 40); return; }
    fx.bolt(p.x + p.face * 10, p.y - 22, e.x, e.y - 2, '#b06cff');
    hurt(e, dmg, { ky: 0, kx: 0, stun: 60, status: { freeze: 110 } });
    z.shots.push(new Vis(e.x, e.y, 54, (ctx, x, y, t) => {
      ctx.globalAlpha = 0.7; art.rect(ctx, '#1a0f2e', x - 14, y - 2, 28, 4); ctx.globalAlpha = 1;
      art.rect(ctx, '#d0c8f0', x - 1, y - 12, 2, 12); art.rect(ctx, '#8b5cf6', x - 3, y - 14, 6, 3);
      if (t > 34) for (let i = 0; i < 3; i++) art.line(ctx, '#8b5cf6', x - 10 + i * 10, y, x - 12 + i * 12, y - (t - 34) * 2.2, 2);
    }, v => {
      if (!e.dead) { v.x = e.x; v.y = e.y; }
      if (v.t !== 50) return;
      hurt(e, Math.round(dmg * 1.2), { ky: -7, launch: true, stun: 40 }); fx.ring(v.x, v.y - 14, '#8b5cf6', 4, 40, 14); sfx('heavy'); strip('void', v.x, v.y - 20, 70);
      for (let i = 0; i < 10; i++) part(v.x + rand(-10, 10), v.y - rand(0, 30), i % 2 ? '#8b5cf6' : '#1a0f2e', rand(-1.5, 1.5), rand(-3, -1), 18, 2);
    }));
  });
  mv('orin', 'back_door', 'Back Door', 46, 'Open a door behind the nearest enemy. What comes through it hits from the far side and knocks them back toward you.', (p, z, dmg, h) => {
    const e = aim(p, z, 220), dir = p.face, sx = p.x + dir * 16, tx = e ? e.x + dir * 46 : p.x + dir * 150, ty = e ? e.y - e.h / 2 : p.y - 20;
    doorFx(sx, p.y - 22, h.color); doorFx(tx, ty, h.color); sfx('charge');
    z.shots.push(new Later(9, () => {
      const len = Math.abs(tx - sx) + 26; sfx('zap'); fx.shake(4, 8); strip('rift', tx - dir * 30, ty, 70);   // a little past the near door, so it also catches an enemy standing right on you
      hit(dir > 0 ? tx - len : tx, ty - 10, len, 20, dmg, { kx: -dir * 4.5, ky: -3, stun: 40, breaker: true, srcX: tx });
      z.shots.push(new Vis(tx, ty, 14, (ctx, x, y, t) => { const k = Math.max(1, 7 - Math.abs(t - 4)), c = Math.ceil(k / 3), x0 = dir > 0 ? x - len : x; ctx.globalAlpha = Math.max(0, 1 - t / 14); art.rect(ctx, h.color, x0, y - k, len, k * 2); art.rect(ctx, '#ffffff', x0, y - c, len, c * 2); ctx.globalAlpha = 1; }));
    }));
  });
  mv('mira', 'hall_of_mirrors', 'Hall of Mirrors', 10, 'Four mirrors close round the nearest enemy and each one fires. Then they all break at once.', (p, z, dmg, h) => {
    const e = aim(p, z, 200), spots = [[-44, -26], [44, -26], [-44, 20], [44, 20]]; sfx('perfect');
    z.shots.push(new Vis(e ? e.x : p.x + p.face * 80, (e ? e.y : p.y) - 20, 44, (ctx, x, y, t) => {
      spots.forEach((s, i) => {
        const px = x + s[0], py = y + s[1], k = t - (6 + i * 6);
        if (t > 36) return;
        art.rect(ctx, '#8a9ac8', px - 5, py - 9, 10, 18); art.rect(ctx, '#e8f0ff', px - 4, py - 8, 8, 16); art.rect(ctx, '#ffffff', px - 3, py - 7, 2, 10);
        if (k >= 0 && k < 6) { ctx.globalAlpha = 1 - k / 6; art.line(ctx, '#ffffff', px, py, x, y, 3); art.line(ctx, h.colorHi, px, py, x, y, 1); ctx.globalAlpha = 1; }
      });
    }, v => {
      if (e && !e.dead) { v.x = e.x; v.y = e.y - 20; }
      const k = (v.t - 6) / 6;
      if (v.t >= 6 && v.t <= 24 && Number.isInteger(k)) { hit(v.x - 16, v.y - 22, 32, 44, dmg, { kx: k % 2 ? -1 : 1, ky: -1, stun: 26, heavy: false, srcX: v.x + (k % 2 ? 30 : -30) }); sfx('zap'); }
      if (v.t === 36) { SW.boom(v.x, v.y, 54, Math.round(dmg * 0.9), '#c8d4f0', { freeze: 50 }); fx.debris(v.x, v.y, '#e8f0ff', 18); strip('light', v.x, v.y, 90); }
    }));
  });
  mv('noct', 'lights_out', 'Lights Out', 48, 'The light goes. When it comes back you are above the nearest enemy, blade first.', (p, z, dmg, h) => {
    const e = aim(p, z, 210), hs = new Set(), tx = e ? e.x - p.face * 2 : p.x + p.face * 80, ty = (e ? e.y : p.y) - 78; fx.flash('#05060c', 8); sfx('dash');
    for (let i = 0; i < 10; i++) part(p.x + rand(-8, 8), p.y - rand(0, 34), i % 2 ? '#1a1430' : h.color, rand(-1, 1), rand(-1.5, 0), 18, 2);
    if (!z.hit(tx - p.w / 2, ty - p.h, p.w, p.h)) { p.x = tx; p.y = ty; }
    p.vx = 0; p.vy = 2; p.onGround = false; p.pose = ['air', 2];
    z.shots.push(new Drive(p, 40, t => {
      p.vx = 0; p.vy = Math.max(p.vy, 8.5); p.iframes = Math.max(p.iframes, 2);
      if (t % 2) fx.ghost(p.sheet(), 'air', 2, p.x, p.y, p.face < 0);
      hit(p.x - 16, p.y - 20, 32, 40, dmg, { kx: p.face * 1.5, ky: 4, stun: 40, down: true, hitSet: hs, srcX: p.x });
      if (p.onGround) return false;
    }, () => {
      fx.ring(p.x, p.y - 4, h.color, 6, 46, 14); fx.shake(6, 12); sfx('heavy'); fx.dust(p.x, p.y, 8); strip('void', p.x, p.y - 20, 80);
      for (let i = 0; i < 12; i++) part(p.x + rand(-24, 24), p.y - 2, i % 2 ? '#1a1430' : h.colorHi, rand(-2, 2), rand(-3, -0.5), 20, 2);
    }));
  });
  mv('bando', 'reel_in', 'Reel In', 18, 'The long arm goes out, takes hold of the first enemy it finds and drags it back to you for a second, harder hit.', (p, z, dmg) => {
    const dir = p.face, col = skin(p), hs = new Set(); let len = 0, got = null, back = false, arm = null; sfx('swing'); p.pose = ['a2', 1];
    z.shots.push(new Drive(p, 60, () => {
      p.vx = 0;
      const tx = p.x + dir * (10 + len), ty = p.y - 22;
      if (!back) {
        len += 14;
        // the hit box is the whole arm, so it cannot reach past someone standing close
        if (hit(Math.min(p.x, tx) - 9, ty - 9, Math.abs(tx - p.x) + 18, 18, dmg, { kx: 0, ky: -1, stun: 50, hitSet: hs, srcX: p.x })) { got = Array.from(hs)[0]; back = true; sfx('heavy'); fx.shake(3, 6); }
        else if (len >= 176 || z.hit(tx - 2, ty - 2, 4, 4, true)) back = true;
      } else {
        len -= 16;
        if (got && !got.dead) { if (light(got)) { got.x = p.x + dir * (16 + Math.max(10, len)); got.vx = 0; if (got.stagger) got.stagger(12); } else if (Math.abs(got.x - p.x) > 34) slide(p, z, dir, 9); }
        if (len <= 14 || (got && !light(got) && Math.abs(got.x - p.x) <= 34)) return false;
      }
      arm = [p.x + dir * 5, ty, p.x + dir * (10 + Math.max(0, len))];
    }, () => {
      arm = null;
      if (got && !got.dead) { fx.slash(p.x + dir * 18, p.y - 20, dir, 3, '#ffffff', 44); hurt(got, Math.round(dmg * 1.7), { kx: dir * 5, ky: -6, launch: true, stun: 40 }); sfx('heavy'); fx.shake(6, 10); strip('hit', p.x + dir * 22, p.y - 22, 70); }
    }));
    z.shots.push(new Vis(p.x, p.y, 64, (ctx, x, y, t, v) => {
      if (!arm) return;
      const ox = v.x - x, oy = v.y - y, x0 = Math.round(arm[0] - ox), yy = Math.round(arm[1] - oy), x1 = Math.round(arm[2] - ox);
      art.line(ctx, '#0a0a12', x0, yy, x1, yy, 5); art.line(ctx, col, x0, yy, x1, yy, 3); art.disc(ctx, '#0a0a12', x1, yy, 7); art.disc(ctx, col, x1, yy, 6);
    }, v => { if (!arm && v.t > 2) v.gone = true; }));
  });
  mv('aldric', 'vanguard', 'Vanguard', 7, 'Shoulder down and charge. Everything in the way is carried along, then cut loose with one great stroke. Smashes cracked walls.', (p, z, dmg) => {
    const dir = p.face, hs = new Set(), carried = new Set(); sfx('dash'); p.pose = ['dash', 0];
    z.shots.push(new Drive(p, 18, t => {
      p.vx = 0; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2);
      const ok = slide(p, z, dir, 8);
      if (t % 4 === 1) hs.clear();
      hit(...front(p, 30, 44, 8), dmg, { kx: dir * 7, ky: -1.2, stun: 30, breaker: true, hitSet: hs, srcX: p.x - dir * 12 });
      hs.forEach(e => carried.add(e));
      carried.forEach(e => { if (e.dead) return; if (light(e)) { if ((e.x - p.x) * dir < 20) e.x = p.x + dir * 20; } else e.vx = dir * 8.5; });   // keep them on the shoulder
      if (t % 2) fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, p.face < 0);
      fx.dust(p.x - dir * 10, p.y, 1, -dir);
      if (!ok) return false;
    }, () => {
      fx.slash(p.x + dir * 16, p.y - 22, dir, 3, '#fff0c0', 60); sfx('heavy'); fx.shake(6, 12); strip('light', p.x + dir * 30, p.y - 24, 80);
      hit(...front(p, 62, 60, 10), Math.round(dmg * 2.2), { kx: dir * 6, ky: -6.5, launch: true, stun: 40, breaker: true, srcX: p.x - dir * 10 });
    }));
  }, { ground: true });
  mv('sen', 'after_the_bell', 'After the Bell', 50, 'Pass through everything in front of you. Nothing happens. Then you sheathe the blade, and it does.', (p, z, dmg) => {
    const dir = p.face, x0 = p.x, marked = new Set(); let moved = 0; sfx('dash'); p.iframes = Math.max(p.iframes, 14);
    while (moved < 120 && slide(p, z, dir, 4)) { moved += 4; if (moved % 12 === 0) fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, p.face < 0); }
    z.ents.forEach(e => { if (isFoe(e) && (e.x - x0) * dir > -10 && (e.x - p.x) * dir < 14 && Math.abs(e.y - p.y) < 50) marked.add(e); });
    marked.forEach(e => { if (e.stagger && !e.isBoss) e.stagger(34); });
    z.shots.push(new Vis(x0, p.y - 20, 34, (ctx, x, y, t) => { if (t < 8) { ctx.globalAlpha = 1 - t / 8; art.rect(ctx, '#ffffff', dir > 0 ? x : x - moved, y, moved, 1); ctx.globalAlpha = 1; } }, v => {
      if (v.t !== 26) return;
      sfx('perfect'); if (marked.size) fx.shake(5, 10);
      marked.forEach(e => {
        if (e.dead) return;
        fx.slash(e.x, e.y - e.h / 2, 1, 2, '#ffffff', 44); fx.slash(e.x, e.y - e.h / 2, -1, 3, '#ff9ab8', 44); strip('wind', e.x, e.y - e.h / 2, 70);
        hurt(e, dmg, { kx: dir * 2, ky: -6.5, launch: true, stun: 40 });
        for (let i = 0; i < 6; i++) part(e.x + rand(-10, 10), e.y - rand(4, 30), '#ff9ab8', rand(-1.5, 1.5), rand(-1, 1), 30, 2, 0.03);
      });
    }));
    p.pose = ['guard', 0]; z.shots.push(new Drive(p, 24, () => { p.vx = 0; }));
  });
  mv('vega', 'fall_up', 'Fall Up', 48, 'Turn gravity over in front of you. Enemies fall into the sky, hang there, and are thrown back down.', (p, z, dmg, h) => {
    const cx = p.x + p.face * 62, gy = p.y, held = new Set(); sfx('charge');
    z.shots.push(new Vis(cx, gy, 64, (ctx, x, y, t) => {
      ctx.globalAlpha = 0.22 + 0.08 * Math.sin(t * 0.4); art.rect(ctx, h.color, x - 54, y - 120, 108, 120); ctx.globalAlpha = 1; art.rect(ctx, h.colorHi, x - 54, y - 1, 108, 2);
      for (let i = 0; i < 7; i++) art.rect(ctx, '#ffffff', x - 48 + i * 16, y - ((t * 5 + i * 22) % 120), 1, 6);
    }, (v, g, zz) => {
      const t = v.t;
      if (t < 46) zz.ents.forEach(e => { if (isFoe(e) && Math.abs(e.x - cx) < 70 && e.y > gy - 130 && e.y < gy + 20) { held.add(e); if (light(e)) { e.vy = -2.4; e.vx *= 0.5; } if (e.stagger && !e.isBoss && t % 10 === 1) e.stagger(14); } });
      if (t !== 46) return;
      sfx('heavy'); fx.shake(7, 14); fx.ring(cx, gy - 4, h.colorHi, 8, 60, 14); strip('rift', cx, gy - 40, 100);
      held.forEach(e => { if (e.dead) return; if (light(e)) e.vy = 9; hurt(e, dmg, { ky: 6, kx: 0, down: true, stun: 44 }); });
    }));
  });
  mv('tessa', 'second_hand', 'Second Hand', 24, 'A clock hand as long as a room sweeps over your head and down in front of you. Whatever it catches loses a second or two.', (p, z, dmg) => {
    const dir = p.face, hs = new Set(), L = 92, ang = t => -2.2 + Math.min(1, Math.max(0, t) / 16) * 2.9; sfx('swing');
    z.shots.push(new Vis(p.x, p.y - 22, 22, (ctx, x, y, t) => {
      const a = ang(t), ex = x + dir * Math.cos(a) * L, ey = y + Math.sin(a) * L;
      art.ring(ctx, '#e8a090', x, y, 14); art.line(ctx, '#3a2a20', x, y, ex, ey, 5); art.line(ctx, '#d9b45a', x, y, ex, ey, 3);
      for (let k = 1; k < 5; k++) { const b = ang(t - k * 0.8); ctx.globalAlpha = 0.5 - k * 0.1; art.line(ctx, '#ffe4d8', x + dir * Math.cos(b) * L * 0.5, y + Math.sin(b) * L * 0.5, x + dir * Math.cos(b) * L, y + Math.sin(b) * L, 2); }
      ctx.globalAlpha = 1;
    }, v => {
      v.x = p.x; v.y = p.y - 22;
      if (v.t > 16) return;
      const a = ang(v.t);
      if (v.t === 9) hs.clear();
      for (let d = 4; d <= L; d += 22) hit(v.x + dir * Math.cos(a) * d - 11, v.y + Math.sin(a) * d - 11, 22, 22, dmg, { kx: dir * 3, ky: -2, stun: 30, status: { freeze: 70 }, hitSet: hs, srcX: v.x });
      if (v.t === 16) { sfx('perfect'); strip('light', v.x + dir * 60, v.y + 14, 70); }
    }));
  });
  mv('jax', 'lucky_coin', 'Lucky Coin', 10, 'Flip a coin, shoot it out of the air, and five bullets come off it looking for the nearest enemies.', (p, z, dmg) => {
    const rise = t => t * 3.4 - t * t * 0.07; sfx('coin');
    z.shots.push(new Vis(p.x + p.face * 12, p.y - 34, 16, (ctx, x, y, t) => { const yy = Math.round(y - rise(t)); art.disc(ctx, '#d9b45a', x, yy, 3); art.rect(ctx, '#fff7d0', x - (t % 4 < 2 ? 2 : 0), yy - 1, t % 4 < 2 ? 4 : 1, 2); }, (v, g, zz) => {
      if (v.t !== 15) return;
      const y1 = v.y - rise(15), list = foes(zz, v.x, p.y - 16, 230).sort((a, b) => Math.abs(a.x - v.x) - Math.abs(b.x - v.x));
      sfx('shoot'); fx.bolt(p.x + p.face * 10, p.y - 22, v.x, y1, '#ffd24a'); fx.spark(v.x, y1, '#fff7d0', 12, 3); strip('blast', v.x, y1, 50);
      for (let i = 0; i < 5; i++) {
        const e = list.length ? list[i % list.length] : null;
        zz.shots.push(new Later(2 + i * 4, () => {
          const live = e && !e.dead, tx = live ? e.x : v.x + p.face * (40 + i * 26), ty = live ? e.y - e.h / 2 : p.y;
          fx.bolt(v.x, y1, tx, ty, '#ffd24a'); sfx('shoot');
          if (live) hurt(e, dmg, { kx: Math.sign(e.x - v.x) * 1.5, ky: -1.5, stun: 24, heavy: i === 4 }); else fx.spark(tx, ty, '#c8ccd8', 4, 2);
        }));
      }
    }));
  });
  mv('ferra', 'scrap_press', 'Scrap Press', 46, 'Two walls of scrap slam together on the nearest enemy. Smashes cracked walls.', (p, z, dmg) => {
    const e = aim(p, z, 200); sfx('charge');
    z.shots.push(new Vis(e ? e.x : p.x + p.face * 76, e && Math.abs(e.y - p.y) < 48 ? e.y : p.y, 38, (ctx, x, y, t) => {
      const d = t < 12 ? 70 - t * 5 : t < 26 ? 10 : 10 + (t - 26) * 6;
      ctx.globalAlpha = t > 26 ? Math.max(0, 1 - (t - 26) / 12) : 1;
      [-1, 1].forEach(s => {
        const px = x + s * d;
        art.rect(ctx, '#3a3f4e', px - 9, y - 58, 18, 58); art.rect(ctx, '#8a92a8', px - 7, y - 56, 14, 54); art.rect(ctx, '#c8ccd8', px - 7, y - 56, 3, 54);
        for (let j = 6; j < 54; j += 9) art.rect(ctx, '#5a6478', px - 7, y - j, 14, 1);
        art.rect(ctx, '#ff8a3a', px - s * 9 - 1, y - 40, 2, 6);
      });
      ctx.globalAlpha = 1;
    }, v => {
      if (e && !e.dead && v.t < 12) v.x = e.x;
      if (v.t !== 12) return;
      hit(v.x - 26, v.y - 60, 52, 60, dmg, { kx: 0, ky: -3, stun: 46, breaker: true, srcX: v.x });
      sfx('explode'); fx.shake(8, 14); fx.spark(v.x, v.y - 28, '#ffd24a', 20, 4); fx.debris(v.x, v.y - 28, '#c8ccd8', 10); strip('bolt', v.x, v.y - 28, 90);
    }));
  });

  // the five heroes of heroes5.js
  mv('kiri', 'paper_gale', 'Paper Gale', 11, 'A ring of paper blades turns round you: five cuts at everything close, and the last one lifts them off the floor.', (p, z, dmg) => {
    const hs = new Set(); sfx('swing');
    z.shots.push(new Vis(p.x, p.y - 20, 28, (ctx, x, y, t) => {
      for (let i = 0; i < 8; i++) { const a = t * 0.5 + i * 0.785, r = 20 + Math.min(34, t * 4), px = Math.round(x + Math.cos(a) * r), py = Math.round(y + Math.sin(a) * r * 0.55); art.rect(ctx, i % 2 ? '#ffffff' : '#ff4d6d', px - 3, py - 1, 7, 3); art.rect(ctx, '#ffffff', px - 1, py - 3, 3, 7); }
    }, v => {
      v.x = p.x; v.y = p.y - 20;
      if (v.t % 6 !== 1) return;
      const last = v.t > 22; hs.clear(); sfx(last ? 'heavy' : 'swing');
      hit(p.x - 58, p.y - 58, 116, 62, dmg, { kx: 0.2, ky: last ? -7 : -1.5, stun: last ? 40 : 22, launch: last, heavy: last, hitSet: hs, srcX: p.x });
      if (last) { fx.shake(5, 10); strip('wind', p.x, p.y - 24, 110); }
    }));
    z.shots.push(new Drive(p, 26, () => { p.vx *= 0.5; }));
  });
  mv('tarn', 'thousand_miles', 'Thousand Miles', 11, 'Be on one side of the nearest enemy, then the other, then the first again. Three kicks, and a fourth that sends it up.', (p, z, dmg, h) => {
    const e = aim(p, z, 190), dir = p.face; sfx('dash'); p.pose = ['air', 1];
    for (let k = 0; k < 4; k++) z.shots.push(new Later(1 + k * 7, () => {
      if (p.dead) return;
      const last = k === 3, side = k % 2 ? 1 : -1;
      fx.ghost(p.sheet(), 'air', 1, p.x, p.y, p.face < 0);
      if (e && !e.dead) {
        const nx = e.x + side * dir * 22;
        if (!z.hit(nx - p.w / 2, p.y - p.h, p.w, p.h)) p.x = nx;
        p.face = e.x >= p.x ? 1 : -1;
        fx.slash(e.x, e.y - e.h / 2, p.face, 1 + (k % 3), h.colorHi, 40); sfx(last ? 'heavy' : 'swing');
        hurt(e, last ? Math.round(dmg * 1.6) : dmg, { kx: last ? p.face * 3 : 0, ky: last ? -7.5 : -1, stun: last ? 40 : 26, launch: last, heavy: last });
        if (last) { fx.shake(6, 10); strip('hit', e.x, e.y - e.h / 2, 80); }
      } else {
        slide(p, z, dir, 34); fx.slash(p.x + dir * 14, p.y - 20, dir, 1 + (k % 3), h.colorHi, 40); sfx('swing');
        hit(...front(p, 46, 44, 10), last ? Math.round(dmg * 1.6) : dmg, { kx: dir * 2, ky: last ? -7 : -1, launch: last, srcX: p.x - dir * 10 });
      }
    }));
    z.shots.push(new Drive(p, 26, () => { p.vx = 0; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2); }));
  });
  mv('maren', 'brine_bubble', 'Brine Bubble', 46, 'Seal the nearest enemy in a ball of sea water. It hangs there, helpless, until the bubble bursts - and what bursts out of it mends you.', (p, z, dmg) => {
    const e = aim(p, z, 200); sfx('heal');
    if (!e) { SW.boom(p.x + p.face * 40, p.y - 20, 44, dmg, '#2a9d8f'); return; }
    hurt(e, 1, { ky: 0, kx: 0, stun: 60, heavy: false, status: { freeze: 70 } });
    z.shots.push(new Vis(e.x, e.y - e.h / 2, 60, (ctx, x, y, t) => {
      const r = Math.round(Math.max(e.w, e.h) * 0.6 + 8 + Math.sin(t * 0.3) * 2);
      ctx.globalAlpha = 0.3; art.disc(ctx, '#2a9d8f', x, y, r); ctx.globalAlpha = 1; art.ring(ctx, '#b8fff0', x, y, r); art.ring(ctx, '#ffffff', x, y, r - 2); art.rect(ctx, '#ffffff', x - Math.round(r * 0.5), y - Math.round(r * 0.5), 3, 2);
    }, v => {
      if (!e.dead) { if (light(e) && v.t < 54) { e.vy = v.t < 16 ? -1.6 : -(SW.GRAV || 0.45); e.vx = 0; } if (e.stagger && !e.isBoss && v.t % 12 === 1) e.stagger(16); v.x = e.x; v.y = e.y - e.h / 2; }
      if (v.t !== 56) return;
      sfx('burst'); fx.shake(6, 12); fx.ring(v.x, v.y, '#b8fff0', 6, 50, 14); strip('ice', v.x, v.y, 90);
      for (let i = 0; i < 16; i++) part(v.x, v.y, i % 2 ? '#2a9d8f' : '#b8fff0', rand(-3.5, 3.5), rand(-4, 1), 22, 2, 0.12);
      hurt(e, dmg, { ky: -5, launch: true, stun: 40 });
      if (!p.dead) p.heal(Math.round(p.hpMax() * 0.15));
    }));
  });
  mv('yara', 'fan_of_five', 'Fan of Five', 11, 'Five arrows off one string, in a fan. Up close, all five find the same enemy.', (p, z, dmg) => {
    sfx('shoot'); fx.shake(3, 6); p.vx = -p.face * 2.5;
    [-0.28, -0.14, 0, 0.14, 0.28].forEach(a => z.shots.push(new SW.Proj({ x: p.x + p.face * 8, y: p.y - 22, vx: p.face * Math.cos(a) * 11, vy: Math.sin(a) * 11, dmg, w: 12, h: 8, life: 40, kx: 2, stun: 26,
      render(ctx, x, y, q) { const m = Math.hypot(q.vx, q.vy) || 1, ux = q.vx / m, uy = q.vy / m; art.line(ctx, '#8a5a2a', x - ux * 10, y - uy * 10, x, y, 1); art.line(ctx, '#fff3b0', x - ux * 4, y - uy * 4, x + ux * 3, y + uy * 3, 2); art.glow(ctx, x, y, 7, '#ffd60a', 0.18); } })));
    strip('light', p.x + p.face * 20, p.y - 22, 50);
  });
  mv('brann', 'bear_hug', 'Bear Hug', 16, 'Take hold of the nearest enemy in reach, squeeze three times, and throw what is left.', (p, z, dmg, h) => {
    const dir = p.face; let e = aim(p, z, 76); sfx('roar');
    if (e && Math.abs(e.y - p.y) > 40) e = null;
    if (!e) { fx.slash(p.x + dir * 16, p.y - 24, dir, 3, h.colorHi, 60); fx.shake(5, 10); hit(...front(p, 72, 56, 8), Math.round(dmg * 1.5), { kx: dir * 5, ky: -4, down: true, srcX: p.x - dir * 8 }); return; }
    p.pose = ['guard', 0];
    z.shots.push(new Drive(p, 30, t => {
      p.vx = 0;
      if (e.dead) return false;
      if (light(e)) { e.x = p.x + dir * 14; e.y = Math.min(e.y, p.y); e.vx = 0; e.vy = 0; } else if (Math.abs(e.x - p.x) > 26) slide(p, z, dir, 6);
      if (e.stagger && !e.isBoss && t % 6 === 1) e.stagger(14);
      if (t % 8 === 6 && t < 28) { sfx('heavy'); fx.shake(4, 6); fx.ring(e.x, e.y - e.h / 2, h.colorHi, 20, 6, 8); hurt(e, Math.round(dmg * 0.5), { ky: 0, kx: 0, stun: 30, heavy: false }); }
    }, () => {
      if (e.dead) return;
      sfx('explode'); fx.shake(8, 14); fx.slash(p.x + dir * 14, p.y - 24, dir, 3, '#ffffff', 60); strip('hit', e.x, e.y - e.h / 2, 90);
      hurt(e, Math.round(dmg * 1.6), { kx: dir * 8, ky: -6, launch: true, down: true, stun: 44 });
    }));
  });

  // ================= the look =================
  let lines = null;   // speed lines for the big moves: { t, col, dir }
  function flourish(p, h, lvl) {
    const x = p.x, y = p.y - 18, n = 6 + lvl * 5, r = 18 + lvl * 8;
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.283; part(x + Math.cos(a) * r, y + Math.sin(a) * r, i % 3 ? h.color : h.colorHi, -Math.cos(a) * r / 9, -Math.sin(a) * r / 9, 9, lvl > 1 ? 2 : 1); }
    fx.ring(x, y, h.colorHi, 20 + lvl * 8, 5, 8);
    if (p.onGround) fx.dust(p.x, p.y, 2 + lvl * 2);
    if (lvl >= 2) { fx.flash(h.colorHi, 5); fx.shake(3, 8); lines = { t: 16, col: h.colorHi, dir: p.face }; fx.ghost(p.sheet(), 'cast', 0, p.x, p.y, p.face < 0); }
  }
  function drawLines(ctx) {
    if (!lines) return;
    const k = lines.t / 16;
    ctx.globalAlpha = 0.5 * k;
    for (let i = 0; i < 12; i++) { const y = (i * 53 + lines.t * 7) % H, w = 60 + (i * 37) % 90, x = ((lines.t * 26 * lines.dir + i * 97) % (W + w) + W + w) % (W + w) - w; art.rect(ctx, i % 3 ? lines.col : '#ffffff', x, y, w, 1); }
    ctx.globalAlpha = 1;
    if (--lines.t <= 0) lines = null;
  }
  // shots leave a trail in the hero's colour, and burst where they land
  [SW.Proj, SW.Shot].forEach(C => {
    if (!C) return;
    const u = C.prototype.update; C.prototype.update = function (g, z) {
      u.call(this, g, z);
      if (this.team === 'enemy' || this.gone || !g.state) return;
      this.trailT = (this.trailT || 0) + 1;
      if (this.trailT % 2 === 0) { const h = g.hero(); part(this.x - (this.vx || 0), this.y - (this.vy || 0), this.trailT % 4 ? h.color : h.colorHi, 0, 0, 9, (this.w || 8) > 12 ? 2 : 1); }
    };
  });
  if (SW.Proj) { const e = SW.Proj.prototype.end; SW.Proj.prototype.end = function (g, z, impact) { if (impact && g.state) { fx.ring(this.x, this.y, g.hero().colorHi, 2, 14, 8); strip(elem(), this.x, this.y, 40); } return e.call(this, g, z, impact); }; }
  // heavy hits: a white ring, streaks, and the element's burst
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh(atk, e, b);
    if (!atk.heavy) return;
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, h = G.hero();
    fx.ring(cx, cy, '#ffffff', 3, 20, 7);
    for (let i = 0; i < 6; i++) { const a = i * 1.047 + Math.random() * 0.5; part(cx, cy, i % 2 ? h.colorHi : '#ffffff', Math.cos(a) * 5.5, Math.sin(a) * 5.5, 6, 1); }
    strip(atk.energy ? elem() : 'hit', cx, cy, 44);
  };
  // every frame: cooldowns tick, and the hero kicks up dust and squashes on jumps, landings and dashes
  const _up = P.update; P.update = function (g, z) {
    const cd = this.cd || (this.cd = {});
    for (const k in cd) if (cd[k] > 0) cd[k]--;
    if (this.cdDeny > 0) this.cdDeny--;
    this.linkLive = (this.state === 'attack' || this.state === 'airatk') && this.connected;
    const ground = this.onGround, vy = this.vy, st = this.state;
    _up.call(this, g, z);
    if (!ground && this.onGround && vy > 2.5) { fx.dust(this.x, this.y, 5); this.sq = 6; this.sqDir = -1; }
    else if (ground && !this.onGround && this.vy < -3) { fx.dust(this.x, this.y, 3); this.sq = 6; this.sqDir = 1; }
    if (st !== 'dash' && this.state === 'dash') fx.dust(this.x, this.y, 4, -this.face * 0.8);
    if ((st === 'idle' || st === 'run') && this.state === 'attack' && this.onGround) fx.dust(this.x - this.face * 6, this.y, 2, -this.face * 0.5);
    if (this.sq > 0) this.sq--;
  };
  // a skill can show its own pose (p.pose = [anim, frame]) while the hero is held in the cast state
  let POSE = null;
  const _ad = art.draw; art.draw = function (ctx, id, anim, fi, x, y, flip, o) { if (POSE && id === POSE[0]) { anim = POSE[1]; fi = POSE[2]; POSE = null; } return _ad.call(art, ctx, id, anim, fi, x, y, flip, o); };
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    if (this.pose && this.state === 'cast' && art.sheets[this.sheet()] && art.sheets[this.sheet()].anims[this.pose[0]]) POSE = [this.sheet(), this.pose[0], this.pose[1]];
    if (this.sq > 0) {
      const k = this.sq / 6 * 0.16 * this.sqDir, fx0 = Math.round(this.x - cam.x), fy0 = Math.round(this.y - cam.y);
      ctx.save(); ctx.translate(fx0, fy0); ctx.scale(1 - k, 1 + k); ctx.translate(-fx0, -fy0);
      _pd.call(this, ctx, cam, g);
      ctx.restore();
    } else _pd.call(this, ctx, cam, g);
    POSE = null;
  };

  // ================= HUD: the four skill slots and their cooldowns =================
  function pips(ctx, g, p, h, x0, y0, right) {
    SLOTS.forEach((slot, i) => {
      const id = slotId(h, slot);
      if (!id || !g.has(id)) return;
      const left = (p.cd && p.cd[slot]) || 0, max = CD_FOR[id] || CD[slot], x = right ? x0 - (4 - i) * 30 : x0 + i * 30, bad = p.cdFlash === slot && p.cdDeny > 12;
      text(ctx, KEYS[slot], x, y0, bad ? '#ff5a5a' : left > 0 ? '#5a6078' : '#ffffff');
      art.rect(ctx, '#1a1626', x, y0 + 8, 24, 2); art.rect(ctx, left > 0 ? h.color : h.colorHi, x, y0 + 8, Math.round(24 * (1 - left / max)), 2);
    });
  }
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    const p = g.player, h = g.hero();
    // the slots sit one line below where the hero traits write (heroes4.js, heroes5.js)
    if (p && g.has(h.kit[0])) { const y = p.modeT > 0 ? 66 : 56; ctx.globalAlpha = 0.5; art.rect(ctx, '#05060c', 5, y - 2, 124, 14); ctx.globalAlpha = 1; pips(ctx, g, p, h, 10, y, false); }
    drawLines(ctx);
  };
  if (V && V.draw) {
    const _vd = V.draw; V.draw = function (ctx, g) {
      _vd(ctx, g);
      if (g.scene !== 'vs' || !V.f || V.f.length < 2 || ['intro', 'fight', 'ko'].indexOf(V.phase) < 0 || V.paused) return;
      const keep = g.state;
      ctx.globalAlpha = 0.55; art.rect(ctx, '#05060c', 6, H - 40, 122, 14); art.rect(ctx, '#05060c', W - 134, H - 40, 122, 14); ctx.globalAlpha = 1;   // under each fighter's side, clear of the bars and the Training read-outs
      V.f.forEach((f, i) => { if (!f.p) return; g.state = f.state; pips(ctx, g, f.p, HR[f.hero], i ? W - 10 : 10, H - 38, !!i); });
      g.state = keep;
      drawLines(ctx);
    };
  }

  SW.moves = { BURST, CD, CD_FOR, strip, burst };
})();
