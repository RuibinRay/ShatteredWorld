'use strict';
// Shattered Worlds — the throw: one new move for every hero, in the story and in Versus.
//
//   J + L together, on the ground, up close: reach out (5 frames). If someone is there, grab them, hold them for a moment
//   and throw them: heavy damage that goes through a guard, a shield, armour and blocking, and knocks them down. Hold
//   back as it lands to throw them behind you. A missed grab leaves you open for a moment.
//   Bosses are too heavy to throw, fliers cannot be grabbed, Husks still only feel energy (NO EFFECT).
//   Versus: the one who is grabbed can break free by pressing J + L back in time (BREAK); the bot throws a fighter who is
//   guarding up close, and breaks throws sometimes (more often on Hard). After a throw the thrower can cancel into a skill
//   or special, like after any combo hit.
// Touch controls have a Throw button (js/touch.js).
(function () {
  const SW = window.SW, G = SW.game, I = SW.input, fx = SW.fx, P = SW.Player.prototype, E = SW.Enemy.prototype;
  const TH = SW.throwMove = { DMG: 30, BREAK: 8, HOLD: 16 };   // damage before the hero's combo multiplier, frames to break free, hold length
  // the reach: a short grab in front of the hero; then the throw itself (its strike frame is the release)
  const GRAB = { anim: 'a1', hitAt: 5, hitEnd: 5, dur: 26, box: [2, -30, 22, 30], grab: true, dmg: 0, slash: 0 };
  const THROW = { anim: 'a4', hitAt: TH.HOLD, hitEnd: TH.HOLD, dur: TH.HOLD + 14, box: [-20, -34, 60, 34], toss: true, dmg: 0, slash: 0, heavy: true };

  const V = () => SW.versus;
  const fighterOf = proxy => { const v = V(); return v && v.f ? v.f.find(f => f.p && f.p.x === proxy.x && f.p.y === proxy.y) : null; };
  // both keys down, at least one of them pressed in the last 4 frames (the other may already have started a jab or a dash)
  const wantsThrow = () => (I.held('throw') && I.hit('throw')) || (I.held('attack') && I.held('dash') && (I.buffered('attack', 4) || I.buffered('dash', 4)));

  // ---------- starting it ----------
  const _pu = P.update;
  P.update = function (g, z) {
    const s = this.state;
    // J and L a frame or two apart still count: the first jab or the first frames of a dash turn into the grab
    const early = (s === 'attack' && this.combo === 1 && this.st <= 3 && this.atk === this.comboSet()[0]) || (s === 'dash' && this.st <= 2);
    if (!this.dead && this.onGround && (s === 'idle' || s === 'run' || s === 'guard' || early) && wantsThrow()) {
      I.consume('attack'); I.consume('dash'); I.consume('throw');
      this.startAttack(GRAB); this.held = null;
    }
    const r = _pu.apply(this, arguments);
    if (this.held) pin(this);
    return r;
  };
  // ---------- the reach and the release go through the attack's own strike frame ----------
  const _hit = P.hit;
  P.hit = function (def) {
    if (def.grab) return reach(this, def);
    if (def.toss) return toss(this);
    return _hit.apply(this, arguments);
  };
  function reach(p, def) {
    if (p.hitSet.size) return false;
    p.hitSet.add('reach');
    const b = def.box, x0 = p.face > 0 ? p.x + b[0] : p.x - b[0] - b[2], x1 = x0 + b[2], y0 = p.y + b[1], y1 = p.y;
    const z = p.G.zone, over = e => { const r = e.box(); return r.x < x1 && r.x + r.w > x0 && r.y < y1 && r.y + r.h > y0; };   // any part of the body in reach
    const cand = z.ents.filter(e => e.team === 'enemy' && !e.dead && e.hittable !== false && !e.dormant && e.box && over(e));
    cand.sort((a, c) => Math.abs(a.x - p.x) - Math.abs(c.x - p.x));
    const t = cand[0];
    if (!t) { whiff(p); return false; }
    if (t.isProxy) {
      const f = fighterOf(t), q = f && f.p;
      if (!q || q.dead || !q.onGround || q.state === 'slip' || q.state === 'ult' || q.state === 'awaken' || q.iframes > 0 || q.invuln > 0) { whiff(p); return false; }
      p.held = { proxy: t, f, t: 0 };
      q.enter('hurt'); q.hurtLen = 60; q.atk = null; q.castFn = null; q.vx = 0;
    } else {
      if (t.isBoss) { fx.text(t.x, t.y - (t.h || 30) - 8, 'TOO HEAVY', '#ffb060'); SW.audio.sfx('block'); p.vx = -p.face * 2; whiff(p); return false; }
      if (t.def && t.def.fly) { whiff(p); return false; }
      p.held = { e: t, t: 0 };
      t.stun = Math.max(t.stun || 0, 40); t.vx = 0; t.state = 'chase'; t.tele = 0;
    }
    SW.audio.sfx('heavy'); fx.spark(p.x + p.face * 12, p.y - 20, '#ffffff', 6, 2);
    p.atk = THROW; p.st = 0; p.hitSet = new Set(); p.connected = true; p.vx = 0;
    return true;
  }
  function whiff(p) { p.st = Math.max(p.st, GRAB.dur - 16); }   // a missed grab: 16 frames to recover, open to a hit
  // keep the one who is held in the hero's hands; let them break free (Versus) while they still can
  function pin(p) {
    const h = p.held, back = held => held && (held.e ? held.e : held.f && held.f.p);
    if (p.state !== 'attack' || p.atk !== THROW) { p.held = null; return; }
    h.t++;
    const lift = h.t > 4 ? Math.min(16, (h.t - 4) * 2) : 0, px = p.x + p.face * (14 + Math.min(4, h.t / 2)), py = p.y - lift;   // hauled up and out in front
    if (h.e) {
      const e = h.e;
      if (e.dead || e.gone) { p.held = null; return; }
      e.x = px; e.y = py; e.vx = 0; e.vy = 0; e.stun = Math.max(e.stun, 30);
    } else {
      const q = h.f.p;
      if (q.dead || q.state !== 'hurt') { p.held = null; return; }   // slipped out (60 energy) or fell
      q.x = px; q.y = py; q.vx = 0; q.vy = 0; q.hurtLen = Math.max(q.hurtLen || 0, 40); q.st = Math.min(q.st, 2);
      if (h.t <= TH.BREAK && h.tried) broke(p, q);
    }
    void back;
  }
  function broke(p, q) {
    p.held = null;
    fx.text((p.x + q.x) / 2, p.y - 46, 'BREAK', '#ffffff'); fx.ring((p.x + q.x) / 2, p.y - 18, '#ffffff', 3, 24, 12); SW.audio.sfx('perfect');
    q.enter('idle'); q.y = p.y; q.vx = p.face * 3; q.invuln = 0;
    p.enter('idle'); p.vx = -p.face * 3;
  }
  // the release
  function toss(p) {
    const h = p.held; if (!h || p.hitSet.size) return false;
    p.hitSet.add('toss'); p.held = null;
    const dir = (I.held('left') ? -1 : 0) + (I.held('right') ? 1 : 0), behind = dir === -p.face;
    if (behind) p.face = -p.face;
    const f = p.face, atk = { team: 'player', dmg: Math.max(1, Math.round(TH.DMG * p.comboMul())), kx: 4.2 * f, ky: -4.4, stun: 46, heavy: true, down: true, launch: false,
      unblockable: true, throwHit: true, hitSet: new Set(), srcX: p.x - f * 20, src: null };
    const t = h.e || h.proxy;
    if (h.e) { h.e.x = p.x + f * 14; h.e.y = p.y; } else { const q = h.f.p; q.x = p.x + f * 14; q.y = p.y; }
    // through the game's own strike (combo counter, energy, sparks, damage numbers), aimed at the one held and nobody else
    const b = t.box(); Object.assign(atk, { x: b.x - 2, y: b.y - 2, w: b.w + 4, h: b.h + 4, hitSet: new Set(p.G.zone.ents.filter(e => e !== t)) });
    const hitIt = SW.strike(p.G, atk);
    fx.shake(5, 10); fx.ring(p.x + f * 14, p.y - 8, '#ffffff', 4, 30, 14); fx.dust(p.x + f * 14, p.y, 6, f); SW.audio.sfx('explode');
    p.G.hitstop = Math.max(p.G.hitstop, 6);
    return !!hitIt;
  }

  // a throw goes through shields, armour and blocking; Husks still only feel energy
  const _et = E.takeHit;
  E.takeHit = function (atk, g) {
    if (!atk || !atk.throwHit || this.def.energyOnly) return _et.apply(this, arguments);
    const d = this.def; this.def = Object.assign({}, d, { shield: false, armored: false, blockEvery: 0 });
    try { return _et.apply(this, arguments); } finally { this.def = d; }
  };

  // ---------- Versus: breaking free ----------
  // the fighter who is held tries to break with J + L (their own keys); the bot tries on its own, by level
  const _vu = P.update;
  P.update = function (g, z) {
    const v = V();
    if (g.scene === 'vs' && v && v.f && this.state === 'hurt') {
      const att = v.f.find(f => f.p && f.p !== this && f.p.held && f.p.held.f && f.p.held.f.p === this);
      if (att) {
        const me = v.f.find(f => f.p === this), h = att.p.held;
        if (!h.rolled && me && me.bot) { h.rolled = true; if (Math.random() < (v.breakChance ? v.breakChance(me) : 0.25)) h.botAt = 2 + (Math.random() * 5 | 0); }
        if ((h.botAt && h.t >= h.botAt) || (I.held('attack') && I.held('dash')) || I.held('throw')) h.tried = true;
      }
    }
    return _vu.apply(this, arguments);
  };

})();
