'use strict';
// Shattered Worlds — Itsuki, the strongest (Versus only). Loaded after js/heroes4.js and js/ninjas7.js.
// Asked for by the user: Itsuki on Nightmare must beat every hero on Nightmare, and "a skill to grab which can't be
// blocked". Two things, both found with the Nightmare trainer (tools/hardcore-train.js):
//  1. His hits reach between worlds. Orin, Mira and Noct (heroes4.js, trait 'phase') step "between worlds" for 3-5 s
//     after a perfect block and nothing lands until they attack; a Nightmare bot never attacks first, so against Itsuki
//     every round ran out the clock at full health. His hits now land on a fighter between worlds and pull them out.
//  2. Storm Seize (his S + U, in Versus): he rushes in inside a cyclone, and whoever it reaches is seized by the storm and
//     cannot guard, perfect-block, break free or slip out: five wind blades cut them and the storm throws them away. A rush
//     that reaches no one leaves the cyclone where he stops (ninjas7.js, SW.itsukiKit.cyclone). The user (2026-11-16)
//     wanted every skill of his in one element and kept the grab on S + U, so the grab is wind now.
(function () {
  const SW = window.SW, G = SW && SW.game, V = SW && SW.versus, P = SW && SW.Player && SW.Player.prototype, fx = SW && SW.fx;
  if (!P || !P.takeHit || !V) return;
  const vs = () => G.scene === 'vs' && V.f && V.f.length === 2;

  // ---------- 1. between worlds ----------
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const me = V.cur, gg = g || G;
    if (!(this.phaseT > 0) || !gg || gg.scene !== 'vs' || !me || me.hero !== 'itsuki' || me.p === this) return _th.apply(this, arguments);
    const keep = this.phaseT;
    this.phaseT = 0;
    let r;
    try { r = _th.apply(this, arguments); } finally { if (r !== 'hit' && this.phaseT === 0) this.phaseT = keep; }   // a hit pulls them back out
    return r;
  };

  // ---------- 2. Five-Element Seize ----------
  const WIND = [['#7dffb2', '#eafff4'], ['#3fbf86', '#ffffff'], ['#9affd0', '#eafff4'], ['#7dffb2', '#ffffff'], ['#eafff4', '#ffffff']];   // the five blades
  const KIT = SW.itsukiKit, N = SW.ninja;   // the funnel and the cyclone (ninjas7.js)
  const HITS = [6, 11, 16, 21, 26], SLAM = 34, HOLD = 40;
  class Seize {
    constructor(p, me, foe, dmg) { Object.assign(this, { p, me, foe, dmg, t: 0, held: 0, dir: p.face, grab: true }); SW.audio.sfx('dash'); }   // grab: Nightmare's threat reader sees the rush (js/hardcore.js)
    strike(g, q, dmg, o) {
      const atk = Object.assign({ team: 'player', x: q.x - 12, y: q.y - q.h - 4, w: 24, h: q.h + 8, dmg, kx: 0, ky: 0, stun: 30, energy: true, unblockable: true, hitSet: new Set(), srcX: this.p.x, quiet: true }, o);
      SW.strike(g, atk);
    }
    update(g, z) {
      const p = this.p, f = this.foe, q = f.p, d = this.dir;
      if (p.dead || !q || (p.state === 'hurt' && !this.held)) { this.gone = true; p.pose = null; return; }
      this.t++; this.x = p.x; this.y = p.y; p.state = 'cast'; p.st = 8; p.castFn = null; p.vx = 0; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2);
      if (this.t === 1 && KIT && N && N.Vis) {   // the storm: small round him while he rushes, tall round whoever he holds
        const me = this, v = new N.Vis(p.x, p.y, 120, (ctx, x, y, t) => KIT.funnel(ctx, x, y, t, me.held ? 1 : 0.6, me.held ? 26 : 16),
          vv => { const who = me.held ? me.foe.p : me.p; if (who) { vv.x = who.x; vv.y = who.y; } if (me.gone) vv.gone = true; });
        z.shots.push(v);
      }
      if (!this.held) {   // the rush: up to 12 frames, 7 px a frame
        p.pose = ['dash', 0];
        for (let s = 0; s < 7; s++) { if (z.hit(p.x + d * (p.w / 2 + 1), p.y - p.h + 2, 1, p.h - 4)) break; p.x += d; }
        if (this.t % 2 && fx.ghost) fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, d < 0);
        const dx = (q.x - p.x) * d, dy = Math.abs(q.y - p.y);
        if (!q.dead && dx > -8 && dx < 28 && dy < 44 && q.state !== 'ult' && q.state !== 'awaken') {
          this.held = 1; q.atk = null; q.castFn = null; q.enter('hurt'); q.hurtLen = HOLD + 6; f.stunT = Math.max(f.stunT || 0, HOLD + 2);
          if (typeof q.phaseT === 'number') q.phaseT = 0;
          fx.flash('#ff2a4a', 5); fx.text(q.x, q.y - 58, 'SEIZED', '#ffd6de'); SW.audio.sfx('heavy');
        } else if (this.t >= 12) { this.gone = true; p.pose = null; p.enter(p.onGround ? 'idle' : 'fall'); if (KIT) KIT.cyclone(p, z, this.dmg, p.x + d * 24, d); }
        return;
      }
      // held: the target hangs in the storm in front of him, helpless, while five wind blades cut them
      this.held++;
      q.x = p.x + d * 20; q.y = Math.min(q.y, p.y); q.vx = 0; q.vy = 0; f.stunT = Math.max(f.stunT || 0, 3);
      if (q.state !== 'hurt') { q.enter('hurt'); q.hurtLen = HOLD + 6; }
      const k = HITS.indexOf(this.held);
      if (k >= 0) {
        const c = WIND[k]; p.pose = [k % 2 ? 'a2' : 'a3', 0];
        this.strike(g, q, Math.max(1, Math.round(this.dmg * 0.45)), { stun: 30 });
        fx.slash(q.x, q.y - 10 - k * 4, k % 2 ? -d : d, 1, c[1], 36); fx.ring(q.x, q.y - 18, c[0], 4, 26, 10); fx.spark(q.x, q.y - 18, c[1], 10, 3); SW.audio.sfx(k === 4 ? 'burst' : 'swing');
      }
      if (this.held === SLAM) {
        p.pose = ['launcher', 0];
        this.strike(g, q, Math.round(this.dmg * 1.4), { kx: d * 6, ky: -5.5, stun: 44, heavy: true, down: true });
        WIND.forEach((c, i) => fx.ring(q.x, q.y - 18, c[0], 6 + i * 5, 40 + i * 6, 14)); fx.flash('#eafff4', 6); fx.shake(8, 16); SW.audio.sfx('explode');
        if (SW.skillfx && SW.skillfx.emit) SW.skillfx.emit('wind', q.x, q.y - 20, 18, { dir: d, power: 1.8 });
        this.gone = true; p.pose = null; p.enter(p.onGround ? 'idle' : 'fall'); return;   // let go, so the storm really throws them
      }
      if (this.held >= HOLD || q.dead) { this.gone = true; p.pose = null; p.enter(p.onGround ? 'idle' : 'fall'); }
    }
    draw() {}
  }
  const CASTS = SW.casts, base = CASTS && CASTS.element_step;
  if (base) {
    CASTS.element_step = function (p, z, dmg) {
      if (!vs()) return base.apply(this, arguments);
      const me = V.f.find(f => f.p === p), foe = me && V.f[1 - me.i];
      if (!foe || !foe.p) return base.apply(this, arguments);
      z.shots.push(new Seize(p, me, foe, dmg));
    };
  }
  SW.itsukiEdge = { Seize };
})();
