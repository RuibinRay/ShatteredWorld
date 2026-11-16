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
  SW.combolink = { HOLD, Hold };
})();
