'use strict';
// Shattered Worlds — fight animation polish. Draw-only: nothing here changes timing, hitboxes, damage or physics.
//
// The heroes' attacks are three baked poses (wind-up, strike, recovery) and used to snap between them. This adds,
// for every hero, every foe, the story and Versus alike:
//   - anticipation and follow-through: the body draws back a pixel in the wind-up and lunges two forward on the strike
//   - a swing smear: an arc in the hero's colour, shaped by the move (side swing, uppercut, low sweep, air strike),
//     with two fading after-images of the wind-up pose behind it
//   - impact: a burst of rays where a hit lands (bigger for heavy hits) and a recoil on whoever was hit
//   - squash and stretch: on take-off, on a hard landing (with a puff of dust), on a dash and when hurt
// Esc > SYSTEM has no switch for it; to turn it off for a test, set SW.anim.on = false.
(function () {
  const SW = window.SW, art = SW.art, fx = SW.fx, P = SW.Player.prototype, E = SW.Enemy.prototype;
  const A = SW.anim = { on: true, tf: null };

  // ---------- one transform for the next sprite drawn: shift and scale around the feet ----------
  const _draw = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    const t = A.tf; A.tf = null;
    if (!t || !A.on || (!t.dx && t.sx === 1 && t.sy === 1)) return _draw.apply(this, arguments);
    const px = Math.round(x) + (t.dx || 0), py = Math.round(y);
    ctx.save(); ctx.translate(px, py); ctx.scale(t.sx, t.sy); ctx.translate(-px, -py);
    _draw.call(this, ctx, id, anim, fi, px, py, flip, o);
    ctx.restore();
  };

  // squash (k > 0) or stretch (k < 0) keeping the area about the same
  const sq = k => ({ sx: 1 + k, sy: 1 - k });
  const ease = (t, n) => Math.max(0, t) / n;

  // ---------- heroes (the story player and both Versus fighters) ----------
  const _pu = P.update;
  P.update = function (g, z) {
    const wasGround = this.onGround, vy0 = this.vy, st0 = this.state;
    const r = _pu.apply(this, arguments);
    if (!A.on || this.dead) return r;
    if (!wasGround && this.onGround && vy0 > 3.2) { this._land = 7; fx.dust(this.x, this.y, vy0 > 5 ? 6 : 3); }
    if (wasGround && !this.onGround && this.vy < -2) this._lift = 6;
    if (this.state === 'hurt' && st0 !== 'hurt') this._hurt = 8;
    const a = this.atk;
    if ((this.state === 'attack' || this.state === 'airatk') && a && this.st === a.hitAt && this._smearOf !== a) {
      this._smearOf = a;
      const h = g.hero ? g.hero() : null;
      smear(this, a, h ? h.colorHi : '#ffffff', h ? h.color : '#ffffff');
    }
    if (this.state !== 'attack' && this.state !== 'airatk') this._smearOf = null;
    if (this._land > 0) this._land--; if (this._lift > 0) this._lift--; if (this._hurt > 0) this._hurt--;
    return r;
  };
  const _pd = P.draw;
  P.draw = function (ctx, cam, G) {
    if (A.on) A.tf = heroTf(this);
    const r = _pd.apply(this, arguments);
    A.tf = null;
    return r;
  };
  function heroTf(p) {
    const s = p.state, f = p.face, a = p.atk;
    let dx = 0, k = 0;
    if ((s === 'attack' || s === 'airatk') && a) {
      if (p.st < a.hitAt) { dx = -f; k = 0.04; }                                      // wind-up: draw back, crouch a little
      else if (p.st <= a.hitAt + 2) { dx = 2 * f; k = -0.07; }                       // the strike: lunge and stretch
      else if (p.st <= a.hitEnd + 2) dx = f;                                          // follow-through
    } else if (s === 'dash') k = -0.1;
    else if (s === 'hurt' && p._hurt > 0) { k = 0.1 * ease(p._hurt, 8); dx = -f * (p._hurt > 4 ? 2 : 1); }
    else if (p._land > 0) k = 0.16 * ease(p._land, 7);
    else if (p._lift > 0) k = -0.12 * ease(p._lift, 6);
    else if (s === 'cast' || s === 'rush' || s === 'wave') { if (p.st < 5) { dx = -f; k = 0.05; } else if (p.st < 9) { dx = f; k = -0.05; } }
    return { dx, sx: sq(k).sx, sy: sq(k).sy };
  }

  // ---------- the swing smear ----------
  // shape by the move: [start angle, end angle] in degrees, 0 = straight ahead, -90 = up; radius from the hitbox
  const ARCS = { launcher: [70, -110], sweep: [100, 10], air: [-80, 60], a3: [60, -40], b4: [-120, 40], special: [-60, 40] };
  function smear(p, a, col, col2) {
    const box = a.box || [0, 0, 30, 24], r = SW.clamp(box[2] * 0.55, 12, 30), heavy = !!(a.heavy || a.launch || a.down);
    const arc = ARCS[a.anim] || (a.anim && a.anim[0] === 'b' ? [-70, 50] : [-40, 40]);
    fx.list.push({ k: 'AS', x: p.x + p.face * 2, y: p.y - 18, face: p.face, r, a0: arc[0], a1: arc[1], col, col2, w: heavy ? 5 : 4, life: 7, max: 7 });
    // two after-images of the wind-up pose, trailing behind
    const sh = p.sheet ? p.sheet() : null;
    if (sh) for (let i = 1; i <= 2; i++) fx.list.push({ k: 'AG', sheet: sh, anim: a.anim, frame: 0, x: p.x - p.face * 4 * i, y: p.y, flip: p.face < 0, a: 0.32 / i, col, life: 5, max: 5 });
  }

  // ---------- impact ----------
  function impact(x, y, dir, col, heavy) {
    fx.list.push({ k: 'AI', x, y, dir, col: col || '#ffffff', n: heavy ? 8 : 6, r: heavy ? 22 : 15, life: heavy ? 8 : 6, max: heavy ? 8 : 6 });
  }
  const _et = E.takeHit;
  E.takeHit = function (atk, G) {
    const r = _et.apply(this, arguments);
    if (A.on && r === 'hit') {
      const sx = atk.srcX !== undefined ? atk.srcX : (G.player ? G.player.x : this.x), dir = this.x >= sx ? 1 : -1;
      this._hitT = 8; this._hitDir = dir;
      const h = G.hero ? G.hero() : null;   // in Versus this is the attacking fighter (its context is swapped in)
      impact(this.x - dir * Math.min(12, this.w / 2 + 4), this.y - this.h * 0.6, dir, h ? h.colorHi : '#ffffff', !!(atk.heavy || atk.launch || atk.dmg >= 30));
    }
    return r;
  };
  const _ph = P.takeHit;
  P.takeHit = function (atk, G) {
    const r = _ph.apply(this, arguments);
    if (A.on && r === 'hit') {
      const sx = atk.srcX !== undefined ? atk.srcX : this.x - this.face, dir = this.x >= sx ? 1 : -1;
      impact(this.x - dir * 6, this.y - 18, dir, '#ffe0e0', !!(atk.heavy || atk.dmg >= 30));
    }
    return r;
  };

  // ---------- foes: wind-up and hit recoil ----------
  const _eu = E.update;
  E.update = function (G, z) { const r = _eu.apply(this, arguments); if (this._hitT > 0) this._hitT--; return r; };
  const _ed = E.draw;
  E.draw = function (ctx, cam, G) {
    if (A.on && !this.dead) {
      let dx = 0, k = 0;
      if (this._hitT > 0) { dx = this._hitDir * (this._hitT > 4 ? 2 : 1); k = -0.08 * ease(this._hitT, 8); }   // knocked back, stretched by the blow
      else if (this.state === 'windup' && !this.isBoss) { dx = -this.face; k = 0.05; }
      if (dx || k) A.tf = { dx, sx: sq(k).sx, sy: sq(k).sy };
    }
    const r = _ed.apply(this, arguments);
    A.tf = null;
    return r;
  };

  // ---------- drawing the new effects ----------
  const _fd = fx.draw;
  fx.draw = function (ctx, cam) {
    _fd.apply(this, arguments);
    for (const p of fx.list) {
      if (p.k !== 'AS' && p.k !== 'AG' && p.k !== 'AI') continue;
      const x = Math.round(p.x - cam.x), y = Math.round(p.y - cam.y), t = p.life / p.max;
      if (p.k === 'AG') { ctx.globalAlpha = p.a * t; _draw(ctx, p.sheet, p.anim, p.frame, x, y, p.flip, { flash: true, alpha: p.a * t }); ctx.globalAlpha = 1; }
      else if (p.k === 'AS') arcSmear(ctx, x, y, p, t);
      else if (p.k === 'AI') {
        const grow = 1 - t, rr = p.r * (0.35 + 0.65 * grow);
        ctx.globalAlpha = Math.min(1, t * 1.6);
        for (let i = 0; i < p.n; i++) {
          const ang = (i / p.n) * Math.PI * 2 + (p.n % 2 ? 0.3 : 0), len = i % 2 ? rr * 0.55 : rr;
          ray(ctx, x + 1, y + 1, ang, rr * 0.3, len, '#1a1020');   // a dark edge underneath, so it reads on a white flash
          ray(ctx, x, y, ang, rr * 0.3, len, i % 2 ? '#ffe066' : p.col);
        }
        if (t > 0.6) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 2, y - 2, 5, 5); ctx.fillStyle = p.col; ctx.fillRect(x - 1, y - 1, 3, 3); }
        ctx.globalAlpha = 1;
      }
    }
  };
  function ray(ctx, x, y, ang, r0, r1, col) {
    const c = Math.cos(ang), s = Math.sin(ang);
    ctx.fillStyle = col;
    for (let d = r0; d < r1; d += 1) ctx.fillRect(Math.round(x + c * d), Math.round(y + s * d), 1, 1);
  }
  function arcSmear(ctx, x, y, p, t) {
    // the swept band: a solid crescent, white at the outer edge, thinning toward the tail, which fades first as it ages
    const a0 = p.a0 * Math.PI / 180, a1 = p.a1 * Math.PI / 180, done = 1 - t;
    const steps = Math.max(12, Math.ceil(Math.abs(a1 - a0) * p.r)), alpha = Math.min(1, t * 1.8);
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      if (u < done * 0.9) continue;                                   // the tail disappears first
      const ang = a0 + (a1 - a0) * u, w = Math.max(1, Math.round(p.w * (0.3 + 0.7 * u)));   // thick at the leading edge
      const cx = Math.cos(ang) * p.face, cy = Math.sin(ang);
      for (let band = 0; band < w; band++) {
        const rr = p.r - band;
        ctx.globalAlpha = alpha * (0.4 + 0.6 * u);
        ctx.fillStyle = band === 0 ? '#ffffff' : band < 2 ? p.col : p.col2;
        ctx.fillRect(Math.round(x + cx * rr), Math.round(y + cy * rr), 1, 1);
      }
    }
    ctx.globalAlpha = 1;
  }
})();
