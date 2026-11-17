'use strict';
// Shattered Worlds — combo links that hold. Loaded after the hero files (ninjas7.js); only wraps.
//   moves.js promises that J J J > any skill is a true combo: cancelling a normal that connected into a skill holds the
//   target in hit-stun for a moment (30 frames for U / S+U, 40 for I, 56 for S+I, and Versus caps any one hold at 40).
//   Skills that take longer than that to land (a seal that wakes, a boulder that falls, a strike after a guard, a
//   mark that bursts) missed after J J J every time: the target was back on its feet first (measured with the
//   Hardcore trainer: 0% for about fifteen moves across the roster).
//   Now, when a skill that deals damage is cancelled out of a connected normal, the target stays held until that
//   skill's first hit lands, for at most HOLD frames from the cast. The hold ends at once if the skill hits, if the
//   target is not in hit-stun any more (it slipped out), or if it dies. Utility skills with no damage hold nothing.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, A = D.abilities, HR = D.heroes, P = SW.Player && SW.Player.prototype;
  if (!P || !SW.moves || !SW.moves.BURST) return;
  const BURST = SW.moves.BURST, V = SW.versus;
  const HOLD = { u: 44, su: 44, i: 54, si: 64 };
  const fighterOf = e => (G.scene === 'vs' && e && e.isProxy && V && V.f ? V.f.find(f => f.p && Math.abs(f.p.x - e.x) < 1 && Math.abs(f.p.y - e.y) < 1 && f.p.x === e.x) || null : null);
  const slotId = (hero, slot) => { const h = HR[hero]; if (!h) return null; return slot === 'si' ? (BURST[hero] || {}).id : (h.kit || [])[slot === 'u' ? 0 : slot === 'su' ? 1 : 2]; };

  class Hold {
    constructor(list, n) { this.n = n; this.t = 0; this.list = list.map(e => { const f = fighterOf(e); return { e, f, hp: f ? f.state.hp : e.hp }; }); }
    update() {
      this.t++;
      if (this.t > this.n) { this.gone = true; return; }
      this.list = this.list.filter(o => {
        const e = o.e, q = o.f ? o.f.p : e, hp = o.f ? o.f.state.hp : e.hp;
        if (e.dead || q.dead || hp < o.hp - 2) return false;            // the skill landed (its own stun takes over), or they are down
        if (q.state !== 'hurt') return false;                        // they got out of it
        // stretch the hit-stun they are already in; re-entering 'hurt' (stagger) every few frames shielded them from the
        // very skill it was meant to set up, so it is only the fallback for story enemies, which keep their own timers
        if (o.f) q.hurtLen = Math.max(q.hurtLen || 18, (q.st || 0) + 6);
        else if ((q.hurtLen || 18) - (q.st || 0) < 6) e.stagger(Math.min(40, this.n - this.t + 6));
        return true;                                                 // (slowing their slide as well broke six other moves)
      });
      if (!this.list.length) this.gone = true;
    }
    draw() {}
  }

  function wrap(name) {
    const f0 = P[name];
    P[name] = function () {
      const g = this.G;
      if (!g || !g.state || !g.zone) return f0.apply(this, arguments);
      const live = this.linkLive && this.hitSet ? [...this.hitSet].filter(e => e && !e.dead && !e.isBoss && typeof e.stagger === 'function') : [];
      const cd0 = Object.assign({}, this.cd || {});
      const r = f0.apply(this, arguments);
      if (!live.length) return r;
      const cd = this.cd || {}, slot = ['si', 'i', 'su', 'u'].find(s => (cd[s] || 0) > (cd0[s] || 0) + 2);   // the slot that was just used
      if (!slot) return r;
      const id = slotId(g.state.hero, slot), a = id && A[id];
      if (a && !(a.dmg > 0)) return r;
      g.zone.shots.push(new Hold(live, HOLD[slot]));
      return r;
    };
  }
  wrap('useSkill'); wrap('useSpecial');

  // ---------- W+J > K > J J J: the air string after a launcher ----------
  // The jump-cancel out of the launcher sets vy but the hero still counts as on the ground for that frame, and J is
  // buffered for 7 frames: a J pressed with (or just before) the jump came out as a GROUND a1, which killed the jump and
  // swung under the target the launcher had just thrown up. Measured: 61 of 64 heroes landed at most 1 of the 3 air hits.
  // A normal that starts while rising out of a fresh jump is the next air attack instead.
  const _sa = P.startAttack;
  P.startAttack = function (def, air) {
    const C = SW.data.combat;
    if (!air && this.state === 'jump' && this.vy < -1.5 && C && def !== C.launcher && def !== C.sweep && (this.airCombo || 0) < 3) {
      this.onGround = false;
      const r = _sa.call(this, C.air[this.airCombo || 0], true);
      this.airCombo = (this.airCombo || 0) + 1;
      return r;
    }
    return _sa.apply(this, arguments);
  };
  // ...and the jump out of a launcher is always a full jump. Letting go of jump cuts a rise to a short hop (actors.js),
  // and a tap of K is how almost everyone presses it mid-combo: the hop stopped about 40 px under the target.
  const _pu = P.update;
  P.update = function () {
    const st0 = this.state, a0 = this.atk, vy0 = this.vy, C = SW.data.combat;
    const r = _pu.apply(this, arguments);
    if (C && st0 === 'attack' && a0 === C.launcher && this.state === 'jump') this.ljT = 30;
    if (this.ljT > 0) {
      this.ljT--;
      if (st0 === 'jump' && vy0 < -3 && this.vy > vy0 + 1) this.vy = vy0 + 0.42;   // undo the short-hop cut
      if (this.vy >= 0 || this.onGround && this.state !== 'jump') this.ljT = 0;
    }
    return r;
  };
  // ---------- Versus only: more from the combo for the heroes whose combos paid least ----------
  // From the Hardcore trainer's fluency report (the fifteen weakest). MELEE multiplies a hero's normals (J chain,
  // launcher, sweep, air); SKILL multiplies one skill that connected after J J J but added little. The story is not
  // touched. Where a hero came out too strong in the balance tournament, the move that used to carry them is trimmed
  // (a SKILL entry below 1), so the power moves into the combo instead of being added on top.
  const MELEE = { fenn: 1.4, corvin: 1.3, rook: 1.35, maren: 1.25, kova: 1.2, kestra: 1.2, ivo: 1.2 };
  const SKILL = { spore_puff: 1.8, bloom_field: 1.7, chain_bolt: 1.9, thunderclap: 1.5, twin_rush: 1.6, crow_volley: 1.3, scatter: 1.5,
    three_beasts: 1.4, tiger_pounce: 1.3, sting: 1.4, fan_gust: 1.5, element_bolt: 1.25, element_step: 1.25, element_pillar: 1.25, five_seals: 1.25 };
  // Versus balance after the boosts (tools/versus-balance.js, each against the fifteen regular heroes, both sides, 5-6 rounds a
  // pair): every one of these lands at 47-54%. The table in versus.js / ninjas*.js is overridden here for these heroes only.
  if (V && V.tune) Object.assign(V.tune, { corvin: 0.5, fenn: 0.53, rook: 0.71, kestra: 0.91, apis: 0.95, ume: 1.05, itsuki: 1.18, kova: 0.8 });
  const vs = () => G.scene === 'vs';
  const _cm = P.comboMul; P.comboMul = function () { const k = vs() && this.G && this.G.state ? MELEE[this.G.state.hero] : 0; return _cm.call(this) * (k || 1); };
  // the boost lasts until the cast lands: most U skills work out their damage when the cast animation fires (castFn)
  const boost = p => (p.skMulT > 0 ? p.skMul || 1 : 1);
  const _sm = P.specMul; P.specMul = function () { return _sm.call(this) * boost(this); };
  if (P.skillMul) { const _km = P.skillMul; P.skillMul = function () { return _km.call(this) * boost(this); }; }
  const _up = P.update; P.update = function () { if (this.skMulT > 0) this.skMulT--; return _up.apply(this, arguments); };
  // the skill being cast: the same guess the game makes (S held for S+U / S+I); good enough, the bot's random S+I swap aside
  const castId = (p, name, alt) => {
    const h = HR[p.G.state.hero]; if (!h) return null; const kit = h.kit || [];
    if (name === 'useSkill') return alt && p.G.has(kit[1]) ? kit[1] : kit[0];
    if (SW.input.held('up')) return null;
    return SW.input.held('down') ? (BURST[p.G.state.hero] || {}).id : kit[2];
  };
  ['useSkill', 'useSpecial'].forEach(name => {
    const f0 = P[name];
    P[name] = function (alt) {
      if (!vs() || !this.G || !this.G.state) return f0.apply(this, arguments);
      const id = castId(this, name, alt), k = id && SKILL[id];
      this.skMul = k || 1; this.skMulT = k ? 40 : 0;
      return f0.apply(this, arguments);
    };
  });

  SW.combolink = { HOLD, Hold, MELEE, SKILL };
})();
