'use strict';
// Shattered Worlds — Sen's combo flow (2026-11-21, the user: "improve combo make sure his combo can deal 80% of damage no
// ult no only jjjj if its hard to connect the skills improve it"). Versus only; wraps, changes no damage number.
// Measured first (a passive target that recovers as normal, tools in the session notes): J J J J then a skill landed,
// but almost nothing landed AFTER a skill, so every skill ended the combo:
//   U  Draw          he dashed straight through and on, ending far behind the target, facing away
//   I  Three Breaths the crescents pushed the target out of reach of J and of Falling Leaf
//   S+U Falling Leaf the target flew higher than he jumped, so his air J missed
//   W+O Petal Storm  after J J J J the target stood outside the petal ring
// The fixes:
//   Draw stops a step past the first one it cuts and turns him round to face them (a cross-up: the combo goes on)
//   Three Breaths' crescents knock back a quarter as far, and hold a little longer
//   Falling Leaf lifts the target only as high as he jumps, just in front of him, and it does not drift away
//   Petal Storm draws in anyone within 120 px to the edge of the petals
// SW.senFlow.on = false turns it off.
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, CASTS = SW.casts, Proj = SW.Proj, P = SW.Player && SW.Player.prototype;
  if (!V || !CASTS || !P || !CASTS.draw || !CASTS.falling_leaf) return;
  const SF = SW.senFlow = { on: true, PAST: 20, PULL: 120 };
  const vs = () => SF.on && G.scene === 'vs' && V.f && V.f.length === 2;
  const meIn = p => vs() && V.f.some(f => f && f.p === p && f.hero === 'sen');
  const foeOf = p => { const f = V.f.find(q => q && q.p !== p); return f ? f.p : null; };

  // ---------- U: Draw ends just past the target, facing them ----------
  const _dr = CASTS.draw;
  CASTS.draw = function (p, z) {
    const n0 = z.shots.length, r = _dr.apply(this, arguments);
    if (!meIn(p)) return r;
    const rush = z.shots.slice(n0).find(s => s && s.p === p && s.hs && typeof s.dist === 'number');
    if (rush) {
      rush.atk = Object.assign({}, rush.atk || {}, { kx: rush.dir * 0.5, ky: -1, stun: 38 });   // (cut, not flung away)
      const up = rush.update, end = rush.onEnd;
      rush.update = function (g, zz) {
        const o = up.apply(this, arguments);
        if (!this.gone && this.hs.size) {
          const e = foeOf(p);
          if (e && (p.x - e.x) * this.dir >= SF.PAST) { this.dist = this.moved; this.gone = true; if (end) end.call(this, p); p.face = e.x >= p.x ? 1 : -1; }
        }
        return o;
      };
      rush.onEnd = function (q) { const o = end ? end.apply(this, arguments) : undefined; const e = foeOf(p); if (e && this.hs.size) p.face = e.x >= p.x ? 1 : -1; return o; };
    }
    return r;
  };

  // ---------- I: Three Breaths knock back less ----------
  function calmBreaths(p, z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.senFlow || s.w !== 18 || s.life !== 44 || !s.ghost) return;
      s.senFlow = 1; s.kx = 0.5; s.stun = Math.max(s.stun || 0, 30);
    });
  }

  // ---------- S+U: Falling Leaf lifts the target only as high as he jumps ----------
  const _fl = CASTS.falling_leaf;
  CASTS.falling_leaf = function (p, z) {
    const e = meIn(p) ? foeOf(p) : null, before = e ? e.vy : 0, r = _fl.apply(this, arguments);
    if (e && e.vy < before) {   // it was launched: it rises with him (it was flung to -9 while he rose at -7.6), just in front of his blade
      e.vy = p.vy - 0.3; e.vx = 0;
      const want = p.x + p.face * 24; if ((e.x - want) * p.face > 0) e.x = want;
      e.senLift = 30;
    }
    return r;
  };

  // ---------- W+O: Petal Storm draws them in ----------
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.sen;
  if (SIG && SIG.cast) {
    const _ps = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _ps.apply(this, arguments);
      if (!meIn(p)) return r;
      const e = foeOf(p);
      if (e && !e.dead && Math.abs(e.x - p.x) < SF.PULL && Math.abs(e.y - p.y) < 60) {
        z.shots.push({ t: 0, update() { this.t++; if (this.t > 12 || e.dead || p.dead) { this.gone = true; return; } const want = p.x + (e.x >= p.x ? 1 : -1) * 30, dx = want - e.x; if (Math.abs(dx) > 2) e.x += Math.sign(dx) * Math.min(5, Math.abs(dx)); }, draw() {} });
      }
      return r;
    };
  }

  // ---------- his skills deal 25% less (the user, 2026-11-21: "make his skill dmg -25%"): U, S+U, I, S+I and W+O, not J or
  // the ultimate. Every cast gets its damage as its third argument (js/elements.js, moves.js, signature.js). Then
  // (2026-11-22: "REDUCE SEN SKILL DAMAGE BY 30%") 30% less again: 0.75 x 0.7 = 0.525 of the original ----------
  SF.SKILL = 0.75 * 0.7;
  const BUR = SW.moves && SW.moves.BURST && SW.moves.BURST.sen;
  [[CASTS, 'draw'], [CASTS, 'falling_leaf'], [CASTS, 'three_breaths'], [BUR, 'cast'], [SIG, 'cast']].forEach(([o, k]) => {
    if (!o || typeof o[k] !== 'function') return;
    const fn = o[k];
    o[k] = function (p, z, dmg) {
      if (meIn(p) && typeof dmg === 'number') { const a = Array.prototype.slice.call(arguments); a[2] = Math.max(1, Math.round(dmg * SF.SKILL)); return fn.apply(this, a); }
      return fn.apply(this, arguments);
    };
  });

  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (z && z.shots && meIn(this)) calmBreaths(this, z); return r; };
})();
