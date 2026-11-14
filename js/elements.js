'use strict';
// Shattered Worlds — expansion: elemental heroes' abilities and summons, status effects, achievements and
// hero unlocks, the upgrade shop, the hero-select screen, and a visual pass (shadows, vignette).
// Loaded last; it extends the base game by wrapping a few functions rather than rewriting them.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, W = SW.W, H = SW.H, text = SW.text;
  const P = SW.Player.prototype, E = SW.Enemy.prototype, B = SW.Boss.prototype;

  // ---------- profile: achievements and unlocked heroes (kept apart from the save slot) ----------
  const PK = 'shattered-worlds-profile-v1';
  const prof = SW.profile = (() => { try { return JSON.parse(localStorage.getItem(PK)) || {}; } catch (e) { return {}; } })();
  prof.ach = prof.ach || {};
  const saveProf = () => { try { localStorage.setItem(PK, JSON.stringify(prof)); } catch (e) { /* storage is optional */ } };
  const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100003, 7);
  G.unlocked = id => !D.heroes[id].need || !!prof.all || !!prof.ach[D.heroes[id].need];
  G.achieve = function (id) {
    const a = D.achievements[id];
    if (!a || prof.ach[id]) return;
    prof.ach[id] = true; saveProf(); SW.audio.sfx('shard');
    G.toast('ACHIEVEMENT: ' + a.name, '#f5c542'); G.toast('NEW HERO UNLOCKED: ' + D.heroes[a.hero].name.toUpperCase(), D.heroes[a.hero].color);
  };
  const _step = G.step; G.step = function (key) { _step(key); if (key === 'A2-1:marlo') G.achieve('act1_' + G.route()); };
  const _setFlag = G.setFlag; G.setFlag = function (k, v) { _setFlag(k, v); if (k === 'pit_won') G.achieve('pit_champ'); };
  const _onHit = G.onHit; G.onHit = function (atk, e, b) { _onHit(atk, e, b); if (G.combo && G.combo.n >= 20) G.achieve('combo_20'); };

  // ---------- damage multipliers fed by the upgrade shop ----------
  P.comboMul = function () { return this.dmgMul() * (1 + 0.08 * G.upg('attack')); };
  P.skillMul = function () { return this.dmgMul() * (1 + 0.12 * G.upg('skill')); };
  P.specMul = function () { return this.dmgMul() * (1 + 0.12 * G.upg('special')); };

  // ---------- status effects: burn (damage over time) and freeze (held in place) ----------
  function status(e, s) {
    if (!s || e.dead) return;
    if (s.burn) { e.burnT = 150; e.burnD = s.burn; }
    if (s.freeze) { const n = e.isBoss ? Math.min(40, s.freeze / 3) : s.freeze; e.frozen = n; e.stagger(n); }
  }
  [E, B].forEach(proto => { const th = proto.takeHit; proto.takeHit = function (atk, g) { const r = th.call(this, atk, g); if (r === 'hit' && atk.status) status(this, atk.status); return r; }; });
  const eu = E.update; E.update = function (g, z) {
    if (this.frozen > 0) this.frozen--;
    if (this.burnT > 0 && !this.dead && !g.busy()) {
      this.burnT--;
      if (this.burnT % 30 === 0) { this.hp -= this.burnD; this.showHp = 120; fx.text(this.x + SW.rand(-6, 6), this.y - this.h - 4, String(this.burnD), '#ff8a3a'); if (this.hp <= 0) { this.gen = null; this.beam = null; this.aim = null; this.die(g, {}); } }
      if (this.burnT % 5 === 0) fx.list.push({ k: 'p', x: this.x + SW.rand(-6, 6), y: this.y - SW.rand(4, this.h), vx: 0, vy: -0.9, g: 0, life: 12, max: 12, col: this.burnT % 10 ? '#ff8a3a' : '#ffd24a', s: 2 });
    }
    eu.call(this, g, z);
  };

  // ---------- visual pass: contact shadows, frozen tint, vignette ----------
  function shadow(ctx, x, y, w) { ctx.globalAlpha = 0.3; art.rect(ctx, '#05060c', x - w / 2, y - 1, w, 2); art.rect(ctx, '#05060c', x - w / 2 + 2, y + 1, w - 4, 1); ctx.globalAlpha = 1; }
  const ed = E.draw; E.draw = function (ctx, cam, g) {
    if (!this.def.fly && this.onGround && !this.dead) shadow(ctx, this.x - cam.x, this.y - cam.y, this.w + 8);
    ed.call(this, ctx, cam, g);
    if (this.frozen > 0 && !this.dead) { const ps = this.pose(); art.draw(ctx, this.sheet, ps[0], ps[1], this.x - cam.x, this.y - cam.y, this.face < 0, { flash: true, alpha: 0.45 }); art.rect(ctx, '#bfefff', this.x - cam.x - 4, this.y - cam.y - this.h - 5, 8, 2); }
  };
  const pd = P.draw; P.draw = function (ctx, cam, g) { if (this.onGround) shadow(ctx, this.x - cam.x, this.y - cam.y, 18); pd.call(this, ctx, cam, g); };
  const nd = SW.NPC.prototype.draw; SW.NPC.prototype.draw = function (ctx, cam) { shadow(ctx, this.x - cam.x, this.y - cam.y, 16); nd.call(this, ctx, cam); };
  const vig = SW.canvas(W, H);
  (() => { const g = vig[1].createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 300); g.addColorStop(0, 'rgba(5,6,12,0)'); g.addColorStop(1, 'rgba(5,6,12,0.6)'); vig[1].fillStyle = g; vig[1].fillRect(0, 0, W, H); })();
  const BRIGHT = { sky: 1, lab: 1, surface: 1 };
  const zd = SW.Zone.prototype.draw; SW.Zone.prototype.draw = function (ctx, cam, g) { zd.call(this, ctx, cam, g); ctx.globalAlpha = BRIGHT[this.theme] ? 0.5 : 1; ctx.drawImage(vig[0], 0, 0); ctx.globalAlpha = 1; };

  // ---------- summons and projectiles ----------
  const near = (z, x, y, r, skip) => { let best = null, bd = r; for (const e of z.ents) if (e.hittable && e.team === 'enemy' && !e.dead && !(skip && skip.has(e))) { const d = Math.hypot(e.x - x, e.y - e.h / 2 - y); if (d < bd) { bd = d; best = e; } } return best; };
  const puff = (x, y, col, n, up) => { for (let i = 0; i < (n || 1); i++) fx.list.push({ k: 'p', x: x + SW.rand(-3, 3), y: y + SW.rand(-3, 3), vx: SW.rand(-0.4, 0.4), vy: SW.rand(-1.2, -0.2) * (up === undefined ? 1 : up), g: -0.02, life: 12 + Math.random() * 8, max: 20, col, s: 2 }); };
  function boom(x, y, r, dmg, col, st, o) {
    fx.ring(x, y, col, 4, r, 14); fx.ring(x, y, '#ffffff', 2, Math.round(r * 0.6), 10); fx.spark(x, y, col, 14, 3.4); fx.shake(4, 8); SW.audio.sfx('explode');
    SW.strike(G, Object.assign({ team: 'player', x: x - r, y: y - r, w: r * 2, h: r * 2, dmg, kx: 0, ky: -3, stun: 26, energy: true, heavy: true, status: st, hitSet: new Set(), srcX: x, quiet: true }, o || {}));
  }
  class Proj {
    constructor(o) { Object.assign(this, { vx: 0, vy: 0, g: 0, life: 60, w: 10, h: 8, t: 0, hits: 0, hitSet: new Set() }, o); }
    update(g, z) {
      this.t++; this.vy += this.g;
      if (this.think) this.think(g, z);
      this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0) return this.end(g, z, false);
      if (!this.ghost && z.hit(this.x - 2, this.y - 2, 4, 4, true)) return this.end(g, z, true);
      if (this.rehit && this.t % this.rehit === 0) this.hitSet.clear();
      const n = SW.strike(g, { team: 'player', x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h, dmg: this.dmg, kx: (this.kx === undefined ? 2 : this.kx) * (Math.sign(this.vx) || 1), ky: this.ky, stun: this.stun || 20,
        energy: true, breaker: this.breaker, heavy: this.heavy, down: this.down, status: this.status, hitSet: this.hitSet, srcX: this.x - this.vx * 4, quiet: true });
      if (n) { this.hits += n; if (!this.pierce || (this.maxHits && this.hits >= this.maxHits)) this.end(g, z, true); }
    }
    end(g, z, impact) { this.gone = true; if (this.onEnd) this.onEnd(g, z, impact); }
    draw(ctx, cam) { this.render(ctx, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this); }
  }
  const R = {
    fire(ctx, x, y, p) { art.disc(ctx, '#ff7043', x, y, p.r); art.disc(ctx, '#ffd24a', x, y, Math.max(1, p.r - 2)); art.disc(ctx, '#ffffff', x, y, Math.max(1, p.r - 4)); art.glow(ctx, x, y, p.r * 3, '#ff7043', 0.15); },
    shard(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; art.rect(ctx, '#bfefff', x - 5, y - 1, 10, 2); art.rect(ctx, '#ffffff', x + (d > 0 ? 1 : -5), y - 2, 4, 4); art.rect(ctx, '#7fd8ff', x - 2, y - 2, 4, 1); art.glow(ctx, x, y, 8, '#7fd8ff', 0.14); },
    rock(ctx, x, y, p) { art.disc(ctx, '#6b5a3a', x, y, p.r); art.disc(ctx, '#a89a80', x - 1, y - 1, p.r - 2); art.rect(ctx, '#4a4030', x + 1, y + 1, 2, 2); }
  };
  // Ice Bird: seeks out up to four enemies and freezes them
  class Bird extends Proj {
    constructor(x, y, dir, dmg) { super({ x, y, vx: dir * 4.4, dir, dmg, w: 20, h: 16, life: 170, pierce: true, maxHits: 4, ghost: true, breaker: true, status: { freeze: 80 }, kx: 2, ky: -2, stun: 30 }); }
    think(g, z) {
      const tg = near(z, this.x, this.y, 260, this.hitSet);
      if (tg) { const ax = tg.x - this.x, ay = tg.y - tg.h / 2 - this.y, m = Math.hypot(ax, ay) || 1; this.vx += (ax / m * 4.6 - this.vx) * 0.13; this.vy += (ay / m * 4.6 - this.vy) * 0.13; }
      else { this.vx += (this.dir * 4.4 - this.vx) * 0.06; this.vy *= 0.9; }
      if (this.t % 2 === 0) fx.list.push({ k: 'p', x: this.x - this.vx * 2, y: this.y + SW.rand(-3, 3), vx: 0, vy: 0.3, g: 0.02, life: 16, max: 16, col: this.t % 4 ? '#bfefff' : '#ffffff', s: 2 });
    }
    onEnd() { fx.spark(this.x, this.y, '#bfefff', 12, 3); fx.ring(this.x, this.y, '#bfefff', 3, 22, 12); }
    render(ctx, x, y) {
      const d = this.vx >= 0 ? 1 : -1, f = Math.floor(this.t / 5) % 2, m = (dx, w) => x + (d > 0 ? dx : -dx - w);
      art.glow(ctx, x, y, 16, '#7fd8ff', 0.16);
      art.rect(ctx, '#7fd8ff', m(-12, 7), y - 1, 7, 2); art.rect(ctx, '#bfefff', m(-15, 4), y, 4, 1);
      if (f) { art.rect(ctx, '#e6fbff', m(-4, 10), y - 8, 10, 4); art.rect(ctx, '#7fd8ff', m(-2, 6), y - 12, 6, 4); } else { art.rect(ctx, '#e6fbff', m(-4, 10), y + 3, 10, 4); art.rect(ctx, '#7fd8ff', m(-2, 6), y + 7, 6, 3); }
      art.rect(ctx, '#bfefff', m(-6, 12), y - 3, 12, 6); art.rect(ctx, '#ffffff', m(-4, 8), y - 3, 8, 2);
      art.rect(ctx, '#e6fbff', m(5, 6), y - 5, 6, 6); art.rect(ctx, '#27456e', m(8, 1), y - 4, 1, 2); art.rect(ctx, '#ffd24a', m(11, 3), y - 2, 3, 2);
    }
  }
  // Thunder Wolf: runs along the ground, hunts the nearest enemy and bites up to six times
  class Wolf {
    constructor(x, y, dir, dmg, col) { Object.assign(this, { x, y, vx: dir * 4, vy: 0, w: 20, h: 14, face: dir, dmg, col, t: 0, life: 250, bites: 6, cd: 0, hitSet: new Set(), onGround: false, hitWall: 0 }); fx.bolt(x, y - 60, x, y - 8, col); }
    update(g, z) {
      this.t++;
      if (--this.life <= 0 || this.bites <= 0 || this.y > z.ph + 60) { this.gone = true; fx.spark(this.x, this.y - 8, this.col, 12, 3); return; }
      const tg = near(z, this.x, this.y - 8, 230);
      if (tg) this.face = tg.x >= this.x ? 1 : -1;
      if (this.onGround && (this.hitWall || (tg && tg.y < this.y - 26 && Math.abs(tg.x - this.x) < 50))) this.vy = -6;
      this.vx += (this.face * 4.2 - this.vx) * 0.2; this.vy = Math.min(7, this.vy + SW.GRAV);
      SW.move(this, z);
      if (this.cd > 0) this.cd--;
      else {
        this.hitSet.clear();
        const n = SW.strike(g, { team: 'player', x: this.x - 15, y: this.y - 24, w: 30, h: 26, dmg: this.dmg, kx: this.face * 2, ky: -2, stun: 24, energy: true, breaker: true, hitSet: this.hitSet, srcX: this.x - this.face * 8, quiet: true });
        if (n) { this.bites--; this.cd = 16; fx.bolt(this.x - this.face * 10, this.y - 22, this.x + this.face * 14, this.y - 8, this.col); SW.audio.sfx('zap'); }
      }
      if (this.t % 3 === 0) fx.list.push({ k: 'p', x: this.x - this.face * 10, y: this.y - SW.rand(2, 12), vx: 0, vy: -0.4, g: 0, life: 10, max: 10, col: this.t % 6 ? this.col : '#ffffff', s: 2 });
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), d = this.face, f = Math.floor(this.t / 4) % 2, m = (dx, w) => x + (d > 0 ? dx : -dx - w), c = this.col;
      art.glow(ctx, x, y - 8, 20, c, 0.18);
      art.rect(ctx, c, m(-14, 5), y - 15 - f, 5, 2); art.rect(ctx, '#ffffff', m(-16, 3), y - 16 - f, 3, 1);
      (f ? [[-8, 0], [-3, 2], [4, 2], [8, 0]] : [[-9, 2], [-4, 0], [3, 0], [9, 2]]).forEach(q => art.rect(ctx, c, m(q[0], 2), y - 6, 2, 6 - q[1]));
      art.rect(ctx, c, m(-10, 20), y - 14, 20, 8); art.rect(ctx, '#ffffff', m(-8, 15), y - 13, 15, 3);
      art.rect(ctx, c, m(8, 8), y - 18, 8, 7); art.rect(ctx, '#ffffff', m(10, 5), y - 17, 5, 3); art.rect(ctx, c, m(15, 4), y - 14, 4, 3);
      art.rect(ctx, c, m(9, 2), y - 21, 2, 3); art.rect(ctx, c, m(13, 2), y - 21, 2, 3); art.rect(ctx, '#1a1030', m(13, 1), y - 16, 1, 1);
    }
  }
  // Earth Dragon: a stone serpent that erupts and ploughs forward in a wave, hitting along its whole body
  class Dragon {
    constructor(x, y, dir, dmg) { Object.assign(this, { x, y: y - 6, by: y - 28, vx: dir * 3.6, dir, dmg, t: 0, life: 120, trail: [], hitSet: new Set() }); fx.debris(x, y, '#a89a80', 16); fx.shake(6, 14); SW.audio.sfx('roar'); }
    update(g) {
      this.t++; this.x += this.vx; this.y = this.by - Math.sin(this.t * 0.13) * 24 + Math.max(0, 10 - this.t) * 2.4;
      this.trail.unshift([this.x, this.y]); if (this.trail.length > 46) this.trail.pop();
      if (--this.life <= 0) { this.gone = true; this.trail.forEach((p, i) => { if (i % 6 === 0) fx.debris(p[0], p[1], '#a89a80', 3); }); SW.audio.sfx('explode'); fx.shake(4, 10); return; }
      if (this.t % 9 === 0) this.hitSet.clear();
      for (let i = 0; i < this.trail.length; i += 11) { const p = this.trail[i]; SW.strike(g, { team: 'player', x: p[0] - 14, y: p[1] - 14, w: 28, h: 28, dmg: this.dmg, kx: this.dir * 2.4, ky: -3, stun: 26, energy: true, heavy: i === 0, breaker: true, hitSet: this.hitSet, srcX: p[0] - this.dir * 10, quiet: true }); }
      if (this.t % 3 === 0) fx.list.push({ k: 'p', x: this.x - this.dir * 8 + SW.rand(-4, 4), y: this.y + 8, vx: 0, vy: 0.6, g: 0.1, life: 16, max: 16, col: '#8a7a5a', s: 2 });
    }
    draw(ctx, cam) {
      for (let i = this.trail.length - 1; i >= 4; i -= 4) {
        const p = this.trail[i], px = Math.round(p[0] - cam.x), py = Math.round(p[1] - cam.y), r = Math.max(3, 9 - (i / 7 | 0));
        art.disc(ctx, '#5a4a30', px, py, r); art.disc(ctx, '#a89a80', px, py - 1, r - 2);
        if (i % 8 === 0) art.rect(ctx, '#c8a05a', px - 1, py - r - 3, 3, 4);
      }
      const hx = Math.round(this.x - cam.x), hy = Math.round(this.y - cam.y), d = this.dir, m = (dx, w) => hx + (d > 0 ? dx : -dx - w);
      art.glow(ctx, hx, hy, 22, '#c8a05a', 0.13);
      art.rect(ctx, '#c8a05a', m(-7, 3), hy - 16, 3, 7); art.rect(ctx, '#c8a05a', m(-2, 3), hy - 15, 3, 6);
      art.disc(ctx, '#5a4a30', hx, hy, 11); art.disc(ctx, '#a89a80', hx, hy - 1, 9);
      art.rect(ctx, '#a89a80', m(5, 13), hy - 6, 13, 7); art.rect(ctx, '#c8bca0', m(6, 11), hy - 6, 11, 2); art.rect(ctx, '#5a4a30', m(5, 13), hy + 2, 13, 4);
      art.rect(ctx, '#f0dca8', m(8, 2), hy + 1, 2, 2); art.rect(ctx, '#f0dca8', m(13, 2), hy + 1, 2, 2); art.rect(ctx, '#ffd24a', m(1, 3), hy - 5, 3, 3); art.rect(ctx, '#ffffff', m(2, 1), hy - 5, 1, 1);
    }
  }
  Object.assign(SW, { Proj, Bird, Wolf, Dragon, boom, puff, near, saveProfile: saveProf, codeHash: hash });

  // ---------- ability table: what each elemental ability does when it fires ----------
  const CASTS = {
    fireball(p, z, dmg, up) { SW.audio.sfx('shoot'); z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 20, vx: p.face * 5.2, vy: up ? -3.2 : 0, dmg: Math.round(dmg * 0.6), r: 5, w: 12, h: 12, life: 60, status: { burn: 3 }, render: R.fire,
      think() { puff(this.x, this.y, this.t % 2 ? '#ff7043' : '#ffd24a'); }, onEnd() { boom(this.x, this.y, 30, Math.round(dmg * 0.6), '#ff7043', { burn: 3 }); } })); },
    flame_ring(p, z, dmg) { boom(p.x, p.y - 16, 58, dmg, '#ff7043', { burn: 4 }); for (let a = 0; a < 16; a++) puff(p.x + Math.cos(a * 0.39) * 40, p.y - 16 + Math.sin(a * 0.39) * 24, a % 2 ? '#ffd24a' : '#ff7043', 2); },
    sun_flare(p, z, dmg) { SW.audio.sfx('awaken'); z.shots.push(new Proj({ x: p.x + p.face * 18, y: p.y - 22, vx: p.face * 2.8, dmg, r: 12, w: 30, h: 30, life: 100, pierce: true, rehit: 10, ghost: true, breaker: true, heavy: true, kx: 1, status: { burn: 4 }, render: R.fire,
      think() { puff(this.x + SW.rand(-10, 10), this.y + SW.rand(-10, 10), this.t % 2 ? '#ff7043' : '#ffd24a', 2); }, onEnd() { boom(this.x, this.y, 46, dmg * 2, '#ffd24a', { burn: 5 }); } })); },
    ice_shard(p, z, dmg, up) { SW.audio.sfx('shoot'); [-0.22, 0, 0.22].forEach(a => { const ang = (up ? -0.6 : 0) + a; z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 21, vx: p.face * Math.cos(ang) * 6.4, vy: Math.sin(ang) * 6.4, dmg, w: 10, h: 6, life: 40, kx: 1, status: { freeze: 34 }, render: R.shard })); }); },
    frost_nova(p, z, dmg) { boom(p.x, p.y - 16, 62, dmg, '#bfefff', { freeze: 130 }, { ky: 0, heavy: false }); SW.audio.sfx('perfect'); for (let a = 0; a < 14; a++) puff(p.x + Math.cos(a * 0.45) * 44, p.y - 16 + Math.sin(a * 0.45) * 26, '#ffffff', 1, -0.6); },
    ice_bird(p, z, dmg) { SW.audio.sfx('perfect'); fx.ring(p.x + p.face * 14, p.y - 30, '#bfefff', 3, 20, 12); z.shots.push(new Bird(p.x + p.face * 14, p.y - 30, p.face, dmg)); },
    chain_bolt(p, z, dmg, up) {
      SW.audio.sfx('zap');
      let x = p.x + p.face * 10, y = p.y - 22, tg = null, bd = 190, n = 0;
      for (const e of z.ents) if (e.hittable && !e.dead && !e.gone && (e.x - p.x) * p.face > -10) { const b = e.box(), d = Math.hypot(b.x + b.w / 2 - x, b.y + b.h / 2 - y); if (d < bd) { bd = d; tg = e; } }
      if (!tg) { fx.bolt(x, y, x + p.face * 110, y + (up ? -60 : SW.rand(-10, 10)), '#a78bfa'); return; }
      const seen = new Set();
      while (tg && n < 3) {
        const b = tg.box(), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
        fx.bolt(x, y, cx, cy, '#a78bfa');
        const atk = { team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg: Math.round(dmg * (n ? 0.7 : 1)), kx: p.face, stun: 26, energy: true, hitSet: new Set(), srcX: p.x, quiet: true };
        if (tg.takeHit(atk, G) === 'hit' && tg.team === 'enemy') G.onHit(atk, tg, b);
        seen.add(tg); x = cx; y = cy; n++; tg = near(z, x, y, 120, seen);
      }
    },
    thunderclap(p, z, dmg) { boom(p.x, p.y - 16, 60, dmg, '#a78bfa', { freeze: 70 }); SW.audio.sfx('zap'); for (let a = 0; a < 6; a++) fx.bolt(p.x, p.y - 16, p.x + Math.cos(a * 1.05) * 56, p.y - 16 + Math.sin(a * 1.05) * 40, '#a78bfa'); },
    thunder_wolf(p, z, dmg) { SW.audio.sfx('roar'); SW.audio.sfx('zap'); fx.shake(4, 10); z.shots.push(new Wolf(p.x + p.face * 16, p.y, p.face, dmg, '#a78bfa')); },
    rock_throw(p, z, dmg, up) { SW.audio.sfx('swing'); z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 26, vx: p.face * (up ? 3 : 4.6), vy: up ? -6 : -3.2, g: 0.26, dmg, r: 6, w: 14, h: 14, life: 90, heavy: true, down: true, kx: 4, ky: -3, render: R.rock,
      onEnd(g, zz, hit) { fx.debris(this.x, this.y, '#a89a80', 8); if (hit) { fx.shake(3, 6); SW.audio.sfx('heavy'); } } })); },
    quake(p, z, dmg) {
      fx.shake(7, 14); SW.audio.sfx('explode'); fx.dust(p.x, p.y, 12); fx.debris(p.x, p.y, '#a89a80', 10);
      SW.strike(G, { team: 'player', x: p.x - 30, y: p.y - 30, w: 60, h: 32, dmg, kx: 0, ky: -6, stun: 40, energy: true, heavy: true, hitSet: new Set(), srcX: p.x, quiet: true });
      for (const s of [-1, 1]) z.shots.push(new SW.Shot({ kind: 'shock', team: 'player', x: p.x + s * 20, y: p.y - 5, fy: p.y, vx: s * 4, dmg, life: 46, w: 16, h: 14, col: '#c8a05a', kx: 2, ky: -6, stun: 40, energy: true, heavy: true, pierce: true }));
    },
    earth_dragon(p, z, dmg) { z.shots.push(new Dragon(p.x + p.face * 10, p.y, p.face, dmg)); }
  };
  SW.casts = CASTS;   // other files add their heroes' abilities to this table
  SW.elements = {
    // U / W+U / S+U for the elemental heroes. Returns true when this hero is handled here.
    skill(p, alt) {
      const S = G.state, h = G.hero(), A = D.abilities;
      if (S.hero === 'kael' || S.hero === 'nyra') return false;
      const id = alt && G.has(h.kit[1]) ? h.kit[1] : G.has(h.kit[0]) ? h.kit[0] : null;
      if (!id || !CASTS[id] || (id === 'quake' && !p.onGround)) return true;   // a quake needs the ground
      if (!p.spend(A[id].cost)) return true;
      const dmg = Math.round(A[id].dmg * p.skillMul()), up = I.held('up'), z = G.zone;
      p.enter('cast'); p.castFn = () => CASTS[id](p, z, dmg, up);
      return true;
    },
    // I for the elemental heroes: the signature summon
    special(p) {
      const S = G.state, h = G.hero(), A = D.abilities, id = h.kit[2];
      if (S.hero === 'kael' || S.hero === 'nyra') return false;
      if (!G.has(id) || !CASTS[id] || !p.spend(A[id].cost)) return true;
      const dmg = Math.round(A[id].dmg * p.specMul()), z = G.zone;
      p.enter('cast'); p.st = -8; p.castFn = () => CASTS[id](p, z, dmg);
      fx.ring(p.x, p.y - 16, h.colorHi, 34, 6, 12); SW.audio.sfx('charge');
      return true;
    }
  };

  // ---------- upgrade shop (pause menu > UPGRADES) ----------
  const _pu = ui.pauseUpdate; ui.pauseUpdate = function (g) {
    const pm = ui.pm, S = g.state;
    if (pm.tab === 5 && I.ok()) {
      const u = D.upgrades[pm.sel], lv = g.upg(u.id), cost = D.upgradeCost[lv];
      if (lv >= 5 || S.creds < cost) SW.audio.sfx('deny');
      else { S.creds -= cost; S.upg = S.upg || {}; S.upg[u.id] = lv + 1; if (u.id === 'vital') S.hp += 15; SW.audio.sfx('level'); g.saveGame(); }
    }
    _pu(g);
  };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    const pm = ui.pm, S = g.state, hero = g.hero();
    if (pm.tab !== 5) return;
    const x0 = 26; let y = 40;
    text(ctx, 'UPGRADES', x0, y, '#f5c542', { scale: 2 }); art.rect(ctx, '#f5c542', 380, y + 6, 4, 4); text(ctx, S.creds + ' creds', 388, y + 4, '#f5c542'); y += 28;
    D.upgrades.forEach((u, i) => {
      const lv = g.upg(u.id), on = pm.sel === i;
      text(ctx, (on ? '> ' : '  ') + u.name, x0, y, on ? '#f5c542' : '#ffffff');
      for (let k = 0; k < 5; k++) art.rect(ctx, k < lv ? hero.color : '#2a2c40', x0 + 88 + k * 9, y + 1, 7, 6);
      text(ctx, lv >= 5 ? 'MAX' : D.upgradeCost[lv] + ' creds', x0 + 140, y, lv >= 5 ? '#7dffa0' : S.creds >= D.upgradeCost[lv] ? '#ffffff' : '#ff8a8a');
      y += 14;
    });
    const u = D.upgrades[pm.sel];
    ui.panel(ctx, 250, 68, 204, 62, hero.color, 0.5); text(ctx, u.name + '   level ' + g.upg(u.id) + ' / 5', 258, 74, '#f5c542');
    SW.wrap(u.desc, 188).forEach((l, i) => text(ctx, l, 258, 88 + i * 10, '#ffffff'));
    text(ctx, 'J / Enter: buy.  Creds come from fights, missions and the Pit Arena.', x0, 226, '#5a6078');
  };

  // ---------- hero select: six heroes, achievement locks, and the unlock-all code ----------
  ui.selectUpdate = function (g) {
    const s = ui.sel, n = D.heroOrder.length, keys = I.keys.splice(0);
    if (s.msgT > 0) s.msgT--;
    if (typeof s.code === 'string') {
      for (const k of keys) { if (/^[0-9]$/.test(k) && s.code.length < 4) { s.code += k; SW.audio.sfx('move'); } else if (k === 'Backspace') s.code = s.code.slice(0, -1); }
      if (I.hit('pause')) { s.code = null; SW.audio.sfx('back'); }
      else if (s.code.length === 4) {
        if (hash(s.code) === D.unlockHash) { prof.all = true; saveProf(); s.code = null; s.msg = 'ALL HEROES UNLOCKED'; s.msgT = 240; SW.audio.sfx('level'); SW.audio.sfx('shard'); }
        else { s.code = ''; s.msg = 'Wrong code. Ask the author for it.'; s.msgT = 180; SW.audio.sfx('deny'); }
      }
      return;
    }
    if (I.hit('left')) { s.i = (s.i + n - 1) % n; SW.audio.sfx('move'); }
    if (I.hit('right')) { s.i = (s.i + 1) % n; SW.audio.sfx('move'); }
    if (I.hit('up') || I.hit('down')) { s.i = (s.i + 3) % n; SW.audio.sfx('move'); }
    const id = D.heroOrder[s.i];
    if (I.hit('pause')) { g.scene = 'title'; SW.audio.sfx('back'); }
    else if (I.hit('skill')) { s.code = ''; SW.audio.sfx('select'); }
    else if (I.ok()) {
      if (g.unlocked(id)) { SW.audio.sfx('select'); g.scene = 'prologue'; ui.pro.i = 0; ui.pro.t = 0; }
      else { SW.audio.sfx('deny'); s.msg = 'Locked. ' + D.achievements[D.heroes[id].need].desc + ' - or press U and enter the code.'; s.msgT = 240; }
    }
  };
  ui.drawSelect = function (ctx, g) {
    const bg = art.bg.title, s = ui.sel;
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'WHO WAKES UP?', W / 2, 8, '#ffffff', { align: 'center', scale: 2 });
    D.heroOrder.forEach((id, i) => {
      const h = D.heroes[id], x = 9 + (i % 3) * 155, y = 30 + Math.floor(i / 3) * 106, on = s.i === i, open = g.unlocked(id), img = art.bg['hero_' + id], tx = x + 80;
      ui.panel(ctx, x, y, 151, 102, on ? (open ? h.color : '#ff5a5a') : '#3a3d55', on ? 0.95 : 0.72);
      if (img) { ctx.globalAlpha = open ? (on ? 1 : 0.55) : 0.16; ctx.drawImage(img, 0, 0, 96, 128, x + 3, y + 3, 72, 96); ctx.globalAlpha = 1; }
      else art.draw(ctx, h.sheet, 'idle', 0, x + 38, y + 94, false, { alpha: open ? 1 : 0.3 });
      if (open) {
        text(ctx, h.name.toUpperCase(), tx, y + 6, on ? h.color : '#c8ccd8');
        SW.wrap(h.title, 68).slice(0, 3).forEach((l, k) => text(ctx, l, tx, y + 18 + k * 9, '#ffffff'));
        text(ctx, h.element, tx, y + 52, h.color);
        SW.wrap(h.sig, 68).slice(0, 2).forEach((l, k) => text(ctx, l, tx, y + 63 + k * 9, '#f5c542'));
        text(ctx, h.route === id ? 'Own story' : D.heroes[h.route].name + "'s story", tx, y + 88, '#5a6078');
      } else {
        text(ctx, 'LOCKED', tx, y + 6, '#ff5a5a');
        SW.wrap(D.achievements[h.need].desc, 68).forEach((l, k) => text(ctx, l, tx, y + 20 + k * 9, '#c8ccd8'));
        text(ctx, '? ? ?', tx, y + 88, '#5a6078');
      }
    });
    if (s.msgT > 0 && s.msg) text(ctx, s.msg, W / 2, 242, s.msg.indexOf('UNLOCKED') >= 0 ? '#7dffa0' : '#ff8a8a', { align: 'center' });
    else text(ctx, prof.all ? 'All heroes unlocked.' : 'Locked heroes open by achievement, or with the unlock code (ask the author).', W / 2, 242, '#8a92b8', { align: 'center' });
    text(ctx, 'A D W S: choose    J / Enter: begin    U: unlock code    Esc: back', W / 2, 255, '#8a92b8', { align: 'center' });
    if (typeof s.code === 'string') {
      ctx.globalAlpha = 0.82; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
      ui.panel(ctx, 116, 80, 248, 108, '#f5c542');
      text(ctx, 'UNLOCK ALL HEROES', W / 2, 90, '#f5c542', { align: 'center', scale: 2 });
      text(ctx, 'Type the 4-digit code.', W / 2, 114, '#ffffff', { align: 'center' });
      text(ctx, 'No code? Ask the author.', W / 2, 125, '#8a92b8', { align: 'center' });
      for (let k = 0; k < 4; k++) { const bx = 180 + k * 32; ui.panel(ctx, bx, 138, 24, 26, s.code.length === k && SW.frame % 40 < 24 ? '#ffffff' : '#8a92b8', 0.9); if (s.code[k]) text(ctx, s.code[k], bx + 12, 144, '#ffffff', { align: 'center', scale: 2 }); }
      text(ctx, 'Backspace: delete    Esc: cancel', W / 2, 172, '#5a6078', { align: 'center' });
    }
  };
})();
