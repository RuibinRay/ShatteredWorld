'use strict';
// Shattered Worlds — the final fight, made much stronger. Loaded after bossfx.js; only adds and wraps.
//   THE CONVERGENCE (the Director's last form) has more health and three new attacks, each with a clear wind-up:
//     World Rend   two waves of void columns across the whole arena; the second wave fills the first one's gaps.
//                  Void cannot be guarded: read the lines on the floor and stand in a gap
//     Blink        it vanishes and strikes from behind you, twice
//     Last Light   at 30% health it rises, gathers the Engine's light and bursts it outward in a huge ring, then falls
//   Below 30% it is unravelling: faster, 20% more damage, attacking more often, and World Rend comes more often.
//   The Director learns Blink once enraged; his first two forms have a little more health.
//   Because the last form is now a real wall, losing to it restarts the fight at the last form (with your partner, a
//   full bar, two healing items and your ultimate), not back at the Director.
//   Balance: see the numbers at the end of README's "The final fight" section.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, story = SW.story, Z = SW.zones;
  const E = D.enemies, L = D.dialogue, rand = SW.rand, W = SW.W, H = SW.H, K = SW.skillfx, B2 = SW.Boss2;
  if (!E.convergence || !B2 || !story) return;
  const sfx = n => SW.audio.sfx(n), VIOLET = '#b48cff';
  const say = (s, t, o) => Object.assign({ s, t }, o || {});

  // ================= stats =================
  E.convergence.hp = Math.round(E.convergence.hp * 1.45); E.convergence.dmg = Math.round(E.convergence.dmg * 1.15); E.convergence.idle = 16;
  E.director.hp = Math.round(E.director.hp * 1.1); E.fused.hp = Math.round(E.fused.hp * 1.1);
  const DESPERATE = 0.3;

  // ================= pieces =================
  function* wait(n) { for (let i = 0; i < n; i++) yield; }
  function* tele(b, n, anim, f) { b.setPose(anim, f); b.tele = n; b.vx = 0; sfx('tele'); for (let i = 0; i < n; i++) { b.tele = n - i; yield; } b.tele = 0; }
  const ground = (z, x, y) => { for (let ty = Math.floor((y - 24) / 16); ty < (z.h || 40); ty++) { const c = z.tile(Math.floor(x / 16), ty); if (c === '#' || c === '=') return ty * 16; } return y; };
  const hit = (g, b, x, y, w, h, dmg, o) => SW.strike(g, Object.assign({ team: 'enemy', x, y, w, h, dmg, kx: 4, ky: -3, heavy: true, hitSet: new Set(), srcX: b.x, src: b }, o || {}));
  // a column of void: a warning line for `warn` frames, then it erupts
  function column(g, z, b, x, warn, dmg) {
    const gy = ground(z, x, b.y);
    z.shots.push({ t: 0, update() {
      this.t++;
      if (this.t < warn && this.t % 3 === 0 && K) K.add('void', x + rand(-8, 8), gy - 2, 0, rand(-1.2, -0.4), { life: 12 });
      if (this.t === warn) { hit(g, b, x - 12, gy - 140, 24, 140, dmg, { kx: 2.5, ky: -5, srcX: x, unblockable: true }); sfx('burst'); fx.shake(2, 5); if (K) K.emit('void', x, gy - 40, 8, { up: true }); }
      if (this.t > warn + 14) this.gone = true;
    }, draw(ctx, cam) {
      const sx = Math.round(x - cam.x), sy = Math.round(gy - cam.y);
      if (this.t < warn) { const k = this.t / warn; ctx.globalAlpha = 0.4 + 0.5 * k; art.rect(ctx, VIOLET, sx - 12, sy - 1, 24, 2); if (this.t % 6 < 3) art.rect(ctx, '#ffffff', sx - Math.round(12 * k), sy - 1, Math.round(24 * k), 1); ctx.globalAlpha = 1; return; }
      const k = Math.max(0, 1 - (this.t - warn) / 14), w = Math.max(1, Math.round(12 * k));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.6 * k; art.rect(ctx, VIOLET, sx - w - 2, sy - 140, w * 2 + 4, 140); ctx.restore();
      art.rect(ctx, '#e8d8ff', sx - (w >> 1), sy - 140, Math.max(1, w), 140); art.rect(ctx, '#ffffff', sx - 1, sy - 140, 2, 140);
    } });
  }

  // ================= the new attacks =================
  const MOVES = {
    *rend(b, g, z) {   // two waves of columns across the arena; the second fills the gaps of the first
      b.last = { name: 'World Rend' };
      yield* tele(b, 30, 'cast', 0);
      b.setPose('cast', 1); sfx('roar'); fx.flash(VIOLET, 6);
      const x0 = b.ax0 !== undefined ? b.ax0 + 16 : b.x - 200, x1 = b.ax1 !== undefined ? b.ax1 - 16 : b.x + 200, step = 64;
      for (let x = x0; x <= x1; x += step) column(g, z, b, x, 40, b.def.dmg);
      yield* wait(30);
      for (let x = x0 + step / 2; x <= x1; x += step) column(g, z, b, x, 40, b.def.dmg);
      yield* wait(56);
      b.setPose('idle', 0); yield* wait(b.desperate ? 14 : 26);
    },
    *blink(b, g, z) {   // vanish, come back behind them, strike
      const p = g.player, twice = true;
      for (let k = 0; k < (twice ? 2 : 1); k++) {
        b.last = { name: 'Blink' };
        yield* tele(b, k ? 10 : 16, 'special', 0);
        if (K) K.emit('void', b.x, b.y - b.h / 2, 12); fx.ghost(b.sheet, 'special', 0, b.x, b.y, b.face < 0); sfx('tele');
        let nx = p.x - (p.face || 1) * 30;
        if (b.ax0 !== undefined) nx = SW.clamp(nx, b.ax0 + 10, b.ax1 - 10);
        b.x = nx; b.vx = 0; b.faceTo(p);
        if (K) K.emit('void', b.x, b.y - b.h / 2, 12);
        yield* tele(b, 12, 'a4', 0);
        b.setPose('a4', 1); sfx('heavy'); fx.slash(b.x + b.face * 18, b.y - b.h * 0.6, b.face, 3, '#e8d8ff', 52);
        const hs = new Set();
        for (let i = 0; i < 6; i++) { b.hitFront(g, 60, b.h + 10, b.def.dmg + 2, hs, { kx: 5, ky: -3, heavy: true }); yield; }
        b.setPose('a4', 2); yield* wait(twice && !k ? 8 : 26);
      }
    },
    *lastLight(b, g, z) {   // rise, gather, burst a huge ring, fall: the desperation move
      b.last = { name: 'Last Light' };
      const y0 = b.y, hy = y0 - 46;
      b.setPose('cast', 0); sfx('awaken'); fx.flash('#ffffff', 10); fx.shake(4, 60);
      for (let i = 0; i < 52; i++) {
        b.tele = 52 - i; b.y = SW.lerp(y0, hy, Math.min(1, i / 14)); b.vy = 0; b.vx = 0;
        if (K && i % 2 === 0) K.gather('void', b.x, b.y - b.h / 2, 3, 70 - i * 0.6);
        if (i % 16 === 0) fx.ring(b.x, b.y - b.h / 2, '#ffffff', 150, 20, 16);
        yield;
      }
      b.tele = 0; b.setPose('cast', 1); sfx('explode'); fx.flash('#ffffff', 18); fx.shake(12, 30);
      for (let i = 0; i < 4; i++) fx.ring(b.x, b.y - b.h / 2, i % 2 ? VIOLET : '#ffffff', 10 + i * 10, 150 + i * 16, 22 + i * 4);
      if (K) K.emit('void', b.x, b.y - b.h / 2, 40, { power: 2.6 });
      hit(g, b, b.x - 150, y0 - 90, 300, 96, Math.round(b.def.dmg * 1.6), { kx: 7, ky: -5 });
      for (let i = 0; i < 8; i++) { const a = i * 0.785; z.shots.push(new SW.Shot({ kind: 'orb', team: 'enemy', x: b.x, y: b.y - b.h / 2, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, dmg: Math.max(4, b.def.dmg - 8), life: 90, w: 8, h: 8, col: '#e8d8ff' })); }
      for (let i = 0; i < 12; i++) { b.y = SW.lerp(hy, y0, i / 11); yield; }
      b.y = y0; b.setPose('idle', 0); fx.dust(b.x, b.y, 12);
      yield* wait(28);   // spent: a short opening to punish it
    }
  };
  // which bosses use them: [move, chance on each pick, when]
  const EXTRA = {
    convergence: [['rend', 0.28, () => true], ['blink', 0.24, () => true]],
    director: [['blink', 0.22, b => b.phase === 2]]
  };

  // ================= choosing them =================
  const _think = B2.prototype.think; B2.prototype.think = function (g, z, p) {
    const ex = EXTRA[this.type];
    if (ex) {
      // the last stand: below 30% the Convergence unravels, and opens with Last Light as soon as it is free
      if (this.type === 'convergence' && !this.desperate && this.hp <= this.hpMax * DESPERATE) { this.desperate = true; this.wantLight = true; g.toast('THE CONVERGENCE IS UNRAVELLING', '#e8d8ff'); this.def = Object.assign({}, this.def, { dmg: Math.round(this.def.dmg * 1.2) }); fx.flash(VIOLET, 10); fx.shake(6, 24); }
      if (!this.gen && this.wantLight && this.phase !== 1) { this.wantLight = false;   // (after the enrage, if one big hit crossed both lines at once)
        this.gen = MOVES.lastLight(this, g, z); this.poise = 0; }
      else if (!this.gen && this.idleT <= 1 && !(this.stun > 0)) {
        for (const [name, ch, ok] of ex) { const c = this.desperate && name === 'rend' ? ch * 1.3 : ch; if (ok(this) && Math.random() < c) { this.gen = MOVES[name](this, g, z); this.poise = 0; break; } }
      }
    }
    const had = !!this.gen, r = _think.apply(this, arguments);
    if (had && !this.gen && this.desperate) this.idleT = Math.round(this.idleT * 0.65);   // attacks come faster at the end
    return r;
  };
  const _spd = SW.Boss.prototype.spd; SW.Boss.prototype.spd = function () { return _spd.apply(this, arguments) * (this.desperate ? 1.2 : 1); };

  // ================= the Convergence's look =================
  // a halo of void shards turning round it (faster, and red-hot, once it unravels), and afterimages when it moves fast
  const _bd = SW.Boss.prototype.draw; SW.Boss.prototype.draw = function (ctx, cam, g) {
    const r = _bd.apply(this, arguments);
    if (this.type !== 'convergence' || this.dead || this.dormant) return r;
    const t = this.fxT || 0, cx = Math.round(this.x - cam.x), cy = Math.round(this.y - this.h / 2 - cam.y), n = this.desperate ? 10 : 7, sp = this.desperate ? 0.11 : 0.05;
    for (let i = 0; i < n; i++) { const a = t * sp + i * 6.283 / n, rr = this.h * 0.75, x = Math.round(cx + Math.cos(a) * rr), y = Math.round(cy + Math.sin(a) * rr * 0.45), front = Math.sin(a) > 0;
      ctx.globalAlpha = front ? 1 : 0.5; const c = this.desperate && i % 2 ? '#ff5a3a' : i % 3 ? VIOLET : '#ffffff'; art.rect(ctx, c, x - 1, y, 3, 1); art.rect(ctx, c, x, y - 1, 1, 3); }
    ctx.globalAlpha = 1;
    return r;
  };
  const _bu = SW.Boss.prototype.update; SW.Boss.prototype.update = function (g, z) {
    const r = _bu.apply(this, arguments);
    if (this.type === 'convergence' && !this.dead && Math.abs(this.vx) > 3 && (this.fxT || 0) % 3 === 0 && this.pose) { const ps = this.pose(); fx.ghost(this.sheet, ps[0], ps[1], this.x, this.y, this.face < 0); }
    return r;
  };
  // the screen's edges pulse violet while it unravels
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    const b = g.boss;
    if (b && b.type === 'convergence' && b.desperate && !b.dead) { const a = 0.12 + 0.08 * Math.sin((b.fxT || 0) * 0.15); ctx.globalAlpha = a; art.rect(ctx, VIOLET, 0, 0, W, 6); art.rect(ctx, VIOLET, 0, H - 6, W, 6); art.rect(ctx, VIOLET, 0, 0, 6, H); art.rect(ctx, VIOLET, W - 6, 0, 6, H); ctx.globalAlpha = 1; }
    _hud(ctx, g);
  };
  const _sp = SW.spawnEnemy; SW.spawnEnemy = function (type) { const e = _sp.apply(this, arguments); if (e && type === 'convergence') e.desperateAt = DESPERATE; return e; };

  // ================= the checkpoint =================
  L.f_checkpoint = [say('sys', 'The Engine core, again. The Convergence turns to face you, white as the inside of a star. Your partner is already at your side, and the Engine\'s light is in your hands: your ULTIMATE is ready.')];
  story.patch('enginecore', (z, g) => {
    const fin = z.ents.find(e => e && e.constructor && e.constructor.name === 'Finale');
    if (!fin) return;
    const _u = fin.update;
    fin.update = function (gg, zz) {
      const m = gg.finale;
      if (m && m.state === 'start' && gg.flag('a3_finale_cp') && !gg.busy() && gg.player) {
        m.state = 'talk'; gg.step('A3-6:descend');
        gg.say('f_checkpoint', () => {
          const h = gg.hero(), p = gg.player; p.heal(p.hpMax()); gg.state.energy = 300; gg.state.awaken = 100; gg.state.items = Math.max(gg.state.items, 2);
          if (h.ultimate && !gg.has(h.ultimate)) gg.unlock(h.ultimate);
          const e = zz.enemy('convergence', 50, 19); e.ax0 = 9 * 16; e.ax1 = 62 * 16; e.state = 'chase'; e.dormant = false; gg.boss = e; m.boss = e; m.callT = 60;
          SW.audio.music('boss'); fx.flash(VIOLET, 8); fx.shake(6, 14); m.state = 'p3';
        });
        return;
      }
      const before = m && m.state;
      const r = _u.call(this, gg, zz);
      const after = gg.finale && gg.finale.state;
      if (after === 'p3' && before !== 'p3' && !gg.flag('a3_finale_cp')) gg.setFlag('a3_finale_cp');
      if (gg.flag('a3_finale_cp') && gg.state.steps['A3-6:director']) gg.setFlag('a3_finale_cp', false);
      return r;
    };
  });

  SW.finalboss = { MOVES, EXTRA, DESPERATE };
})();
