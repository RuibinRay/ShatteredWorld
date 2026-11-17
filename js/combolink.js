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

  // the nearest enemy ahead that is still in hit-stun: who a cancelled skill is aimed at
  const reeling = (p, z) => { const N = SW.ninja, e = N && N.ahead ? N.ahead(p, z, 140) : null; if (!e || e.dead || e.isBoss || typeof e.stagger !== 'function') return null; const f = fighterOf(e), q = f ? f.p : e; return q && q.state === 'hurt' ? e : null; };
  // two slow skills made into combo enders when they come out of a combo (their objects appear when the cast fires):
  //   Vega's Heavy Star: the well stops at the target and bursts quickly; Mira's Reflection: the decoy shatters soon.
  function quicken(h, z) {
    z.shots.forEach(s => {
      if (h.seen.has(s)) return; h.seen.add(s);
      const e = h.list[0] && h.list[0].e; if (!e) return;
      if (s.travel !== undefined && s.hold !== undefined && s.burst !== undefined && s.vx !== undefined) {   // a gravity well
        s.travel = Math.max(2, Math.min(s.travel, Math.round(Math.abs(e.x - s.x) / Math.max(0.5, Math.abs(s.vx))))); s.hold = Math.min(s.hold, 14);
      } else if (s.sheet && s.flip !== undefined && s.life > 40 && s.dmg !== undefined && s.vx === undefined) s.life = s.t + 28;   // a decoy
    });
  }
  class Hold {
    constructor(list, n, z, pre) { this.n = n; this.t = 0; this.seen = pre || new Set(z ? z.shots : []); this.list = list.map(e => { const f = fighterOf(e); return { e, f, hp: f ? f.state.hp : e.hp }; }); }
    update(g, z) {
      this.t++;
      if (this.t <= 30 && z) quicken(this, z);
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
      let live = this.linkLive && this.hitSet ? [...this.hitSet].filter(e => e && !e.dead && !e.isBoss && typeof e.stagger === 'function') : [];
      if (!live.length) { const e = reeling(this, g.zone); if (e) live = [e]; }   // the link flag is already off for some casts
      const cd0 = Object.assign({}, this.cd || {}), pre = new Set(g.zone.shots);
      const r = f0.apply(this, arguments);
      if (!live.length) return r;
      const cd = this.cd || {}, slot = ['si', 'i', 'su', 'u'].find(s => (cd[s] || 0) > (cd0[s] || 0) + 2);   // the slot that was just used
      if (!slot) return r;
      const id = slotId(g.state.hero, slot), a = id && A[id];
      if (a && !(a.dmg > 0)) return r;
      g.zone.shots.push(new Hold(live, HOLD[slot], g.zone, pre));
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
  // ---------- air J reaches higher ----------
  // After J J J > W+J the target goes up from higher than a launcher off the floor, and the first air J (34 px tall) passed
  // under it: two of three air hits for 50 of 64 heroes. 46 px reach lands all three (Hardcore trainer, JJJLKAAA).
  const AIR = SW.data.combat && SW.data.combat.air;
  if (AIR && AIR.length === 3) { AIR[0].box = [0, -46, 32, 44]; AIR[1].box = [0, -46, 32, 44]; AIR[2].box = [0, -46, 36, 50]; }

  // ---------- no damage boosts ----------
  // A Versus-only damage table for the weakest heroes (MELEE / SKILL multipliers and V.tune overrides) lived here from
  // 2026-11-16 to 2026-11-17. The user chose to remove all of it ("Remove all damage boosts"): the combo fixes in this
  // file only change hit-stun, timing, reach and aim, never damage. The weakest heroes got smoother combo animation
  // instead (js/combo-flow.js). Do not add damage changes here without asking the user.

  SW.combolink = { HOLD, Hold };
})();
