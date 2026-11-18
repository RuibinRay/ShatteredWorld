'use strict';
// Shattered Worlds — combos that flow through skills (the user, 2026-11-18: "most combo is jjjjj, means the skills are not
// fluent and can't connect ... make sure combo is a combination of different skills that can hit the opponent and land
// before they recover from being hit"). Versus only; loaded late, only wraps. Itsuki keeps his own tuned combo
// (js/itsuki-flow.js) and is left out as the attacker.
// Measured first (tools/hardcore-train.js testRoute on a stunned dummy, all 64 heroes):
//   J J J > a skill connected for 60-64 heroes, but a J after that skill landed for only 18-28 of them: the target was out
//   of hit-stun, or pushed out of reach, by the time the hero had recovered. W+O (the signature) could not be cancelled
//   into at all (3 of 64). And every free combo (0 energy) was J-only, so a bot short of energy only ever pressed J.
// The fixes, after the Bleach vs Naruto engine's own rules (notes: bvn-combo-notes.md) and common fighting-game practice
// (a cancel connects when the hit-stun outlasts the next move's start-up; escapes are limited once a combo has done enough):
//   STUN SLACK   every hit stuns STUN extra frames (BvN adds about 6 to every hit)
//   AIR LIFT     an air attack on a target already in the air lifts it LIFT more, so air strings do not drop
//   SKILL HOLD   a skill that lands on a target already in a combo keeps it reeling until the hero has recovered, plus
//                LINK frames for the next press (at most HOLD frames); it does not slide out of reach meanwhile
//   CANCELS      a skill that has landed can be cancelled into another skill (each slot still has its cooldown), and a J or
//                a skill that landed can be cancelled into the signature (W+O)
//   FREE U       U costs nothing when it is cancelled out of a hit that landed (once a combo: its cooldown sees to that)
//   JUGGLE       a skill counts once toward the juggle limit, however many times it hits
//   CORNER       a target pinned to a wall pushes the attacker back a little, so the next hit still reaches
//   ESCAPE LIMIT once a combo has taken ESCAPE of the target's full health, it can no longer slip or air-recover out of it
// No hit deals more or less damage than before. SW.comboFluency.on = false turns it all off.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, V = SW.versus, P = SW.Player && SW.Player.prototype, I = SW.input, fx = SW.fx;
  if (!P || !V) return;
  const CF = SW.comboFluency = { on: true, STUN: 6, LIFT: 1.4, LINK: 12, HOLD: 64, ESCAPE: 0.3, PAUSE: 16, freeU: true };   // PAUSE 10 cut multi-hit skills short (12 problem combos: 1248 damage vs 1383 before); 16: 1354
  const FREE = { idle: 1, run: 1, jump: 1, fall: 1, guard: 1, charge: 1 };
  const SKILL = { cast: 1, rush: 1, wave: 1 };
  const vs = () => CF.on && G.scene === 'vs' && V.f && V.f.length === 2 && V.phase === 'fight';
  const fighter = p => V.f.find(f => f.p === p);
  const other = p => V.f.find(f => f.p !== p);
  const skip = f => !f || f.hero === 'itsuki';
  function maxHp(f) { const keep = G.state; G.state = f.state; try { return f.p.hpMax(); } finally { G.state = keep; } }

  // ---------- a hit lands: note it for the target's next turn (versus.js sets the hurt time right after takeHit) ----------
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const wasHurt = this.state === 'hurt', juggle = this.juggle || 0;
    const r = _th.apply(this, arguments);
    if (r === 'hit' && vs()) {
      const a = other(this);
      if (a && !skip(a)) {
        const skillHit = !!(SKILL[a.p.state] || (atk && atk.energy && a.p.state !== 'attack' && a.p.state !== 'airatk' && a.p.state !== 'ult'));
        // (the lift is for air strings only: on a skill's hits it carried targets out of the rest of a multi-hit move)
        this.cfHit = { air: !this.onGround && a.p.state === 'airatk', skill: skillHit && (wasHurt || juggle > 0), by: a };
        // JUGGLE: a skill counts once toward the game's juggle limit (12, js/versus.js), however many times it hits: holding
        // the target in hit-stun longer made multi-hit skills run into the limit and lose their later hits. (versus.js adds
        // the 1 after this returns, so taking 1 off here makes this hit count 0)
        if (skillHit && a.p.cfLanded !== undefined && V.t - a.p.cfLanded < 30 && this.juggle > 0) this.juggle--;
        if (SKILL[a.p.state] || skillHit) a.p.cfLanded = V.t;   // this skill has landed: it may be cancelled into the next
        // corner: the target is against a wall, the attacker close: push the attacker back a little
        const z = V.zone, wall = this.x < 22 || (z && this.x > z.pw - 22), d = Math.abs(a.p.x - this.x);
        if (wall && d < 100 && a.p.state !== 'ult') a.p.vx = -Math.sign(this.x - a.p.x || a.p.face) * Math.min(4, 1 + Math.abs((atk && atk.kx) || 2) * 0.6);
      }
    }
    return r;
  };

  // ---------- each fighter's own turn ----------
  const _up = P.update;
  P.update = function (g, z) {
    if (!vs()) { this.cfHold = null; return _up.apply(this, arguments); }
    const me = fighter(this), foe = other(this);
    // 1. the target: stun slack, air lift, skill hold, escape limit
    if (this.cfHit) {
      const h = this.cfHit; this.cfHit = null;
      if (this.state === 'hurt') {
        this.hurtLen = Math.min((this.hurtLen || 18) + CF.STUN, 48);
        if (h.air && !this.onGround) this.vy = Math.min(this.vy, this.vy - CF.LIFT);
        if (h.skill) this.cfHold = { by: h.by, until: V.t + CF.HOLD, freeAt: 0 };
      }
    }
    if (this.cfHold) {
      const H = this.cfHold, ap = H.by.p;
      if (this.state !== 'hurt' || V.t > H.until || ap.dead) this.cfHold = null;
      else {
        if (FREE[ap.state] && !H.freeAt) H.freeAt = V.t + CF.LINK;   // the hero has recovered: a link window, then it ends
        if (H.freeAt && V.t > H.freeAt) this.cfHold = null;
        else {
          if (this.st >= (this.hurtLen || 18) - 1) this.hurtLen = this.st + 2;
          // in the link window (the hero free again) it does not slide out of reach; while the skill still runs it moves as
          // the skill moves it (a multi-hit move that carries its target lost its later hits otherwise)
          // (nor while something the hero threw is still out: a travelling effect that keeps hitting needs the target to move with it)
          if (H.freeAt && !H.by.shots.some(x => x && !x.gone) && Math.abs(this.x - ap.x) > 46 && Math.sign(this.vx) === Math.sign(this.x - ap.x)) this.vx *= 0.55;
        }
      }
    }
    if (me && this.state === 'hurt') {
      if (this.cfComboHp === undefined) this.cfComboHp = me.state.hp;
      if (me.state.hp <= this.cfComboHp - maxHp(me) * CF.ESCAPE) { I.consume('dash'); this.cfLocked = true; }   // no slip, no air recovery
    } else { this.cfComboHp = undefined; this.cfLocked = false; }
    // 2. the attacker: cancels and the free U. Itsuki keeps his own combo; his J > U (Burning Fist, 20 energy) is free out of a
    // landed J like everyone's U
    if (me && me.hero === 'itsuki' && CF.freeU && !this.dead && this.state === 'attack' && this.connected) {
      const e0 = me.state.energy, r = _up.apply(this, arguments);
      if (SKILL[this.state] && Math.round(e0 - me.state.energy) === 20 && V.cur === me) me.bonus += 20;
      return r;
    }
    if (me && !skip(me) && !this.dead) {
      const st0 = this.state, s0 = this.st, cd0 = Object.assign({}, this.cd || {}), e0 = me.state.energy;
      // a skill may be cut short once it has landed and its hits have paused (10 frames since the last one): a multi-hit move
      // cut after its first hit did less than the move alone
      const landedSkill = SKILL[this.state] && !this.castFn && this.cfLanded !== undefined && V.t - this.cfLanded >= CF.PAUSE && V.t - this.cfLanded < 40;
      const landedJ = this.state === 'attack' && this.atk && (this.connected && this.st > this.atk.hitAt + 2);
      if (SKILL[this.state] && !SKILL[this.cfWas]) this.cfCastAt = SW.frame;   // a skill has just started
      this.cfWas = this.state;
      // a fresh press (made after the current skill started: the press that started it is still in the buffer), for a move
      // that is ready (its cooldown done, the energy there): only then is the move cut short
      const fresh = a => I.buffered(a, 8) && !(SKILL[this.state] && I.lastHit[a] <= (this.cfCastAt || 0));
      const cd = this.cd || {}, en = me.state.energy, down = I.held('down');
      const want = fresh('skill') && !(cd[down ? 'su' : 'u'] > 0) && en >= (down ? 50 : 25) ? 'skill'
        : fresh('special') && !I.held('up') && !(cd[down ? 'si' : 'i'] > 0) && en >= (down ? 100 : 50) ? 'special'
        : fresh('awaken') && I.held('up') && !down && !(cd.wo > 0) && en >= 75 ? 'sig' : null;
      let tried = false;
      if (want && (landedSkill || (landedJ && want === 'sig'))) {
        tried = true; const dir = I.held('left') ? -1 : I.held('right') ? 1 : 0;
        I.consume(want === 'sig' ? 'awaken' : want); if (dir) this.face = dir;
        this.enter('idle');
        if (want === 'skill') this.useSkill(I.held('down')); else if (want === 'special') this.useSpecial(); else this.useAwaken();
        if (this.state === 'idle') { this.state = st0; this.st = s0; }   // not ready (cooldown, energy): carry on as before
        else this.cfLanded = undefined;
      }
      const fromHit = landedSkill || landedJ || (st0 === 'attack' && this.connected);
      const r = _up.apply(this, arguments);
      // U cancelled out of a hit that landed costs nothing (versus.js settles energy at the end of the frame: give it back there)
      if (CF.freeU && fromHit && (tried || st0 === 'attack') && SKILL[this.state] && !(cd0.u > 0) && this.cd && this.cd.u > 0 && me.state.energy < e0 && V.cur === me) {
        const h = D.heroes[me.hero], a = h && D.abilities[h.kit[0]];
        me.bonus += (a && a.cost) || 25;
      }
      return r;
    }
    return _up.apply(this, arguments);
  };
})();
