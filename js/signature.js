'use strict';
// Shattered Worlds — signature skills: one more skill for every hero, on W + O (up + the awakening key).
//   O alone is still the awakening (or the assist) and S + O the timed power-up; W + O throws the hero's signature
//   skill: 75 energy, a 7 s cooldown, a slot of its own on the HUD. In the story it is known as soon as the hero knows
//   their I move (like S + I), so old saves and Versus have it at once. A Versus bot throws it now and then (one I in five) in place of I.
//   Each skill is built from a few shared pieces (a runner along the ground, pillars, a vortex, an orbit, projectiles,
//   a dash) dressed in the hero's element from skillfx.js.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, V = SW.versus;
  const P = SW.Player.prototype, A = D.abilities, HR = D.heroes, rand = SW.rand, text = SW.text, W = SW.W, H = SW.H;
  const K = SW.skillfx, sfx = n => SW.audio.sfx(n);
  if (!K) return;
  const COST = 75, CD = 420;

  // ================= pieces =================
  const hit = (p, x, y, w, h, dmg, o) => SW.strike(G, Object.assign({ team: 'player', x, y, w, h, dmg, kx: p.face * 2, ky: -2, stun: 26, energy: true, hitSet: new Set(), srcX: p.x, quiet: true }, o || {}));
  const foes = z => z.ents.filter(e => e.hittable && e.team === 'enemy' && !e.dead);
  const nearest = (p, z, r, any) => { let best = null, bd = r; foes(z).forEach(e => { const d = Math.hypot(e.x - p.x, e.y - p.y); if ((any || (e.x - p.x) * p.face > -16) && d < bd) { bd = d; best = e; } }); return best; };
  const ground = (z, x, y) => { for (let ty = Math.floor((y - 24) / 16); ty < (z.h || 40); ty++) { const c = z.tile ? z.tile(Math.floor(x / 16), ty) : '#'; if (c === '#' || c === '=') return ty * 16; } return y; };
  class Act {
    constructor(o) { Object.assign(this, { t: 0, life: 30 }, o); }
    update(g, z) { this.t++; if (this.tick) this.tick(this, g, z); if (this.t >= this.life) { this.gone = true; if (this.end) this.end(this, g, z); } }
    draw(ctx, cam) { if (this.paint) this.paint(ctx, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this); }
  }
  const act = (z, o) => { const a = new Act(o); z.shots.push(a); return a; };
  const later = (z, n, fn) => act(z, { x: 0, y: 0, life: n, end: fn });
  // holds the hero in the cast pose; step(t) runs every frame and returns false to stop
  class Drive {
    constructor(p, n, step, end) { Object.assign(this, { p, n, step, end, t: 0 }); }
    update(g, z) {
      const p = this.p;
      if (p.dead || p.state === 'hurt') { this.gone = true; return; }
      this.t++; p.state = 'cast'; p.st = 8; p.castFn = null;
      if (this.step(this.t, p, z, g) === false || this.t >= this.n) { this.gone = true; if (this.end) this.end(p, z, g); p.enter(p.onGround ? 'idle' : 'fall'); }
    }
    draw() {}
  }
  // a glowing ball: cols = [outer, inner, core]
  const orb = (ctx, x, y, r, cols) => { art.glow(ctx, x, y, r + 6, cols[0], 0.2); art.rect(ctx, cols[0], x - r, y - r + 1, r * 2, r * 2 - 2); art.rect(ctx, cols[0], x - r + 1, y - r, r * 2 - 2, r * 2); art.rect(ctx, cols[1], x - r + 2, y - r + 2, r * 2 - 4, r * 2 - 4); art.rect(ctx, cols[2] || '#ffffff', x - 1, y - 1, 2, 2); };
  // a projectile: o = { x, y, vx, vy, g, life, w, h, dmg, style, pierce, every (re-hit), home (turn rate), bounce (times), paint, atk, onEnd }
  function proj(p, z, o) {
    let hs = new Set(), bounces = o.bounce || 0;
    return act(z, Object.assign({}, o, {
      tick(s) {
        if (s.home) { const e = nearest({ x: s.x, y: s.y, face: Math.sign(s.vx) || 1 }, z, 200, true); if (e) { const sp = Math.hypot(s.vx, s.vy), a = Math.atan2(e.y - e.h / 2 - s.y, e.x - s.x), b = Math.atan2(s.vy, s.vx); let d = a - b; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; const nb = b + SW.clamp(d, -s.home, s.home); s.vx = Math.cos(nb) * sp; s.vy = Math.sin(nb) * sp; } }
        s.x += s.vx; s.y += s.vy; s.vy += s.g || 0;
        if (s.t % 2 === 0) K.trail(s.style, s.x, s.y, s.vx, s.vy);
        if (s.every && s.t % s.every === 0) hs = new Set();
        // a shot that does no damage itself (a bomb before it bursts) only checks for touching a foe
        const n = s.dmg > 0 ? hit(p, s.x - s.w / 2, s.y - s.h / 2, s.w, s.h, s.dmg, Object.assign({ hitSet: hs, kx: Math.sign(s.vx || p.face) * 2, srcX: s.x - s.vx }, s.atk))
          : foes(z).some(e => { const b = e.box(); return s.x + s.w / 2 > b.x && s.x - s.w / 2 < b.x + b.w && s.y + s.h / 2 > b.y && s.y - s.h / 2 < b.y + b.h; }) ? 1 : 0;
        if (n > 0) { K.burst(s.style, s.x, s.y, 0.9); if (bounces > 0) { bounces--; s.vx = -s.vx; s.vy = -Math.abs(s.vy) - 1; hs = new Set(); sfx('block'); } else if (!s.pierce) { s.gone = true; if (s.onEnd) s.onEnd(s, z); } }
        if (!s.gone && z.hit && z.hit(s.x - 2, s.y - 2, 4, 4)) { if (bounces > 0 && !s.g) { bounces--; s.vx = -s.vx; hs = new Set(); } else { K.burst(s.style, s.x, s.y, 0.7); s.gone = true; if (s.onEnd) s.onEnd(s, z); } }
      },
      end(s) { if (s.onEnd) s.onEnd(s, z); }
    }));
  }
  // something that runs along the ground: o = { x, dir, speed, life, every, w, h, dmg, style, atk, paint }
  function runner(p, z, o) {
    let hs = new Set();
    return act(z, Object.assign({ y: ground(z, o.x, p.y) }, o, {
      tick(s) {
        s.x += s.dir * s.speed; s.y = ground(z, s.x, s.y);
        if (s.every && s.t % s.every === 0) hs = new Set();
        hit(p, s.x - s.w / 2, s.y - s.h, s.w, s.h, s.dmg, Object.assign({ hitSet: hs, kx: s.dir * 2.2, srcX: s.x - s.dir * 10 }, s.atk));
        if (s.t % 2 === 0) K.add(s.style, s.x + rand(-s.w / 2, s.w / 2), s.y - rand(0, s.h), s.dir * rand(0.2, 1.4), rand(-1.6, -0.2));
        if (z.hit && z.hit(s.x + s.dir * 8 - 2, s.y - 12, 4, 6)) s.gone = true;
      }
    }));
  }
  // a column that rises out of the ground after a warning: o = { w, h, dmg, style, cols[3], atk, kind: 'spike' | 'column' | 'geyser' | 'jaws' }
  function pillar(p, z, x, delay, o) {
    const gy = ground(z, x, p.y), hs = new Set();
    return act(z, { x, y: gy, life: delay + 24, tick(s) {
      if (s.t !== delay) return;
      hit(p, x - o.w / 2, gy - o.h, o.w, o.h, o.dmg, Object.assign({ hitSet: hs, kx: p.face * 1, ky: -5, srcX: x }, o.atk));
      K.emit(o.style, x, gy - o.h / 2, 8, { up: true, spread: 0.6 }); fx.shake(2, 6); sfx(o.sfx || 'burst');
    }, paint(ctx, sx, sy, s) {
      const c = o.cols;
      if (s.t < delay) { ctx.globalAlpha = 0.5; const w = Math.round(o.w * s.t / delay); art.rect(ctx, c[0], sx - (w >> 1), sy - 1, w, 2); ctx.globalAlpha = 1; return; }
      const k = s.t - delay, hh = Math.round(o.h * Math.min(1, k / 3) * (k > 16 ? Math.max(0, (24 - k) / 8) : 1));
      for (let i = 0; i < hh; i += 2) {
        const f = o.kind === 'spike' ? 1 - i / o.h : o.kind === 'geyser' ? 0.7 + 0.3 * Math.sin(i * 0.5 + k) : o.kind === 'jaws' ? (i < hh * 0.6 ? 1 : 0.6) : 1;
        const w = Math.max(1, Math.round(o.w / 2 * f));
        if (o.kind === 'jaws') { art.rect(ctx, c[i % 6 ? 0 : 1], sx - w - 3, sy - i - 2, 4, 2); art.rect(ctx, c[i % 6 ? 0 : 1], sx + w - 1, sy - i - 2, 4, 2); }
        else { art.rect(ctx, c[0], sx - w, sy - i - 2, w * 2, 2); art.rect(ctx, c[1], sx - (w >> 1), sy - i - 2, Math.max(1, w), 2); }
      }
      if (o.kind === 'column') { ctx.globalAlpha = 0.35; art.rect(ctx, c[2], sx - (o.w >> 1) - 2, sy - hh, o.w + 4, hh); ctx.globalAlpha = 1; }
      art.glow(ctx, sx, sy - hh / 2, o.w, c[0], 0.12);
    } });
  }
  // a vortex at x, y that pulls foes in and hits every few frames, then bursts: o = { r, life, pull, every, dmg, burst, style, cols }
  function vortex(p, z, x, y, o) {
    return act(z, { x, y, life: o.life, tick(s) {
      const x = s.x, y = s.y;
      foes(z).forEach(e => { const dx = x - e.x, d = Math.abs(dx); if (d < o.r && Math.abs(e.y - e.h / 2 - y) < o.r) moveFoe(e, Math.sign(dx) * Math.min(d, o.pull)); });
      if (s.t % o.every === 0) hit(p, x - o.r * 0.6, y - o.r * 0.6, o.r * 1.2, o.r * 1.2, o.dmg, { kx: 0, ky: -0.5, stun: 18, srcX: x });
      if (s.t % 2 === 0) { const a = Math.random() * 6.283; K.add(o.style, x + Math.cos(a) * o.r, y + Math.sin(a) * o.r * 0.6, -Math.cos(a) * 2.4, -Math.sin(a) * 1.4, { g: 0, life: 12 }); }
    }, end(s) { if (!o.burst) return; const x = s.x, y = s.y; hit(p, x - o.r, y - o.r, o.r * 2, o.r * 2, o.burst, { kx: p.face * 3, ky: -4.5, stun: 30, heavy: true, srcX: x }); K.burst(o.style, x, y, 2); fx.ring(x, y, o.cols[0], 4, o.r + 10, 14); fx.shake(4, 10); sfx('explode'); },
    paint(ctx, sx, sy, s) { const c = o.cols; for (let i = 0; i < 3; i++) { const r = Math.round(o.r * (0.35 + i * 0.25) * (0.9 + 0.1 * Math.sin(s.t * 0.4 + i))); ctx.globalAlpha = 0.6 - i * 0.15; art.ring(ctx, c[i % c.length], sx, sy, r); } ctx.globalAlpha = 1; art.rect(ctx, c[1] || '#000', sx - 2, sy - 2, 4, 4); } });
  }
  // things circling the hero: o = { n, r, life, every, dmg, style, item(ctx, x, y, i, t), fire (speed: thrown forward at the end) }
  function orbit(p, z, o) {
    let hs = new Set();
    return act(z, { x: p.x, y: p.y, life: o.life, tick(s) {
      s.x = p.x; s.y = p.y - 18;
      if (s.t % o.every === 0) hs = new Set();
      for (let i = 0; i < o.n; i++) { const a = s.t * 0.16 + i * 6.283 / o.n, x = s.x + Math.cos(a) * o.r, y = s.y + Math.sin(a) * o.r * 0.7; if (o.dmg > 0) hit(p, x - 6, y - 6, 12, 12, o.dmg, { hitSet: hs, kx: Math.sign(x - p.x) * 1.6, ky: -1.4, stun: 16, srcX: p.x }); if (s.t % 4 === i % 4) K.trail(o.style, x, y, -Math.sin(a), Math.cos(a)); }
    }, end(s) { if (!o.fire) return; for (let i = 0; i < o.n; i++) { const a = -0.5 + i / Math.max(1, o.n - 1); proj(p, z, { x: s.x, y: s.y, vx: p.face * o.fire, vy: a * 1.6, life: 30, w: 10, h: 10, dmg: Math.max(1, Math.round(o.dmg * (o.fireDmg || 1))), style: o.style, paint: (ctx, x, y) => o.item(ctx, x, y, i, 0) }); } sfx('shoot'); },
    paint(ctx, sx, sy, s) { for (let i = 0; i < o.n; i++) { const a = s.t * 0.16 + i * 6.283 / o.n; o.item(ctx, Math.round(sx + Math.cos(a) * o.r), Math.round(sy + Math.sin(a) * o.r * 0.7), i, s.t); } } });
  }
  // a ring that bursts around x, y
  function nova(p, x, y, r, dmg, style, col, o) { fx.ring(x, y, col, 4, r, 14); fx.ring(x, y, '#ffffff', 2, r - 6, 10); K.emit(style, x, y, 12, { power: 1.4 }); hit(p, x - r, y - r * 0.7, r * 2, r * 1.4, dmg, Object.assign({ kx: p.face * 2.6, ky: -3, stun: 26, srcX: x }, o)); }
  // a ghost of a sprite that runs forward and strikes once (wolves, clones)
  function phantom(p, z, o) {
    const hs = new Set();
    return act(z, { x: p.x, y: p.y, life: o.life, tick(s) {
      s.x += p.face * o.speed; s.y = ground(z, s.x, s.y);
      if (s.t % 3 === 0) fx.ghost(o.sheet || p.sheet(), o.anim || 'run', (s.t >> 2) % 2, s.x, s.y, p.face < 0);
      if (s.t % 2 === 0) K.add(o.style, s.x - p.face * 6, s.y - rand(4, 24), -p.face * rand(0.5, 1.5), rand(-0.8, 0.2));
      if (hit(p, s.x - 12, s.y - 30, 24, 30, o.dmg, Object.assign({ hitSet: hs, kx: p.face * 3, ky: -2.6, stun: 26, srcX: s.x - p.face * 8 }, o.atk)) > 0) { K.burst(o.style, s.x, s.y - 16, 1.2); s.gone = true; }
    } });
  }
  const ahead = (p, d) => p.x + p.face * d;
  // move a foe by dx: directly where it can be (story enemies), by a push where it cannot (the Versus opponent is a
  // read-only stand-in whose x follows the real fighter, but whose speed can be set)
  const settable = e => { for (let o = e; o; o = Object.getPrototypeOf(o)) { const d = Object.getOwnPropertyDescriptor(o, 'x'); if (d) return !!(d.set || d.writable); } return true; };
  function moveFoe(e, dx) { if (!dx || e.isBoss) return; if (settable(e)) e.x += dx; else e.vx = SW.clamp(dx, -6, 6); }

  // ================= the skills =================
  const SIG = {};
  const sg = (hero, id, name, dmg, desc, cast) => { if (!HR[hero]) return; SIG[hero] = { id, cast }; A[id] = { name, input: 'W + O', cost: COST, dmg, desc }; if (HR[hero].kit.indexOf(id) < 0) HR[hero].kit.push(id); };

  sg('kael', 'ball_lightning', 'Ball Lightning', 6, 'A slow ball of lightning drifts ahead and zaps everything near it, again and again.', (p, z, d) => {
    sfx('zap'); proj(p, z, { x: ahead(p, 14), y: p.y - 22, vx: p.face * 1.7, vy: 0, life: 90, w: 44, h: 40, dmg: d, every: 12, pierce: true, style: 'bolt', atk: { stun: 18, kx: p.face * 0.6 },
      paint(ctx, x, y, s) { orb(ctx, x, y, 6, ['#ffb840', '#ffe7a8', '#ffffff']); if (s.t % 6 === 0) { const e = nearest({ x: s.x, y: s.y, face: 1 }, z, 40, true); if (e) fx.bolt(s.x, s.y, e.x, e.y - e.h / 2, '#ffe7a8'); else fx.bolt(s.x, s.y, s.x + rand(-20, 20), s.y + rand(-18, 18), '#ffe7a8'); } } });
  });
  sg('nyra', 'frost_bloom', 'Frost Bloom', 12, 'Ice blooms out of the floor on both sides of her, ring after ring, and freezes whoever it catches.', (p, z, d) => {
    sfx('shard'); [20, 40, 62].forEach((r, i) => [-1, 1].forEach(s => pillar(p, z, p.x + s * r, 4 + i * 5, { w: 14, h: 30 - i * 3, dmg: d, style: 'ice', cols: ['#7fd8ff', '#ffffff', '#bfefff'], kind: 'spike', atk: { status: { freeze: 40 }, kx: s * 1.5 } })));
  });
  sg('fenn', 'storm_pack', 'Storm Pack', 11, 'Two storm wolves tear out ahead of him along the ground, one after the other.', (p, z, d) => {
    sfx('roar'); [0, 8].forEach(k => later(z, k + 1, () => phantom(p, z, { life: 34, speed: 5.4, dmg: d, style: 'bolt', anim: 'dash', atk: { stun: 30 } })));
  });
  sg('isolde', 'falcon_dive', 'Falcon Dive', 30, 'Her falcon drops out of the sky onto the nearest foe and freezes them where they stand.', (p, z, d) => {
    const e = nearest(p, z, 200, true), tx = e ? e.x : ahead(p, 80), ty = e ? e.y - e.h / 2 : p.y - 16, x0 = tx - p.face * 90, y0 = ty - 110; sfx('shard');
    proj(p, z, { x: x0, y: y0, vx: (tx - x0) / 16, vy: (ty - y0) / 16, home: 0.12, life: 26, w: 18, h: 16, dmg: d, style: 'ice', pierce: true, atk: { status: { freeze: 60 }, heavy: true, ky: -2 },
      paint(ctx, x, y, s) { const f = s.t % 4 < 2; art.rect(ctx, '#bfefff', x - 4, y - 1, 8, 3); art.rect(ctx, '#ffffff', x - (f ? 7 : 5), y - (f ? 4 : 1), 4, 1); art.rect(ctx, '#ffffff', x + (f ? 4 : 2), y - (f ? 4 : 1), 4, 1); art.rect(ctx, '#7fd8ff', x + Math.sign(s.vx) * 4, y, 2, 1); } });
  });
  sg('brakk', 'avalanche', 'Avalanche', 10, 'He kicks the mountain awake: boulders come down all over the ground ahead.', (p, z, d) => {
    sfx('roar'); fx.shake(4, 16);
    [34, 58, 82, 106, 130].forEach((off, i) => later(z, 4 + i * 5, () => proj(p, z, { x: ahead(p, off) + rand(-8, 8), y: p.y - 130, vx: p.face * 0.4, vy: 3, g: 0.35, life: 60, w: 18, h: 18, dmg: d, style: 'rock', atk: { ky: -3, stun: 24 },
      onEnd: s => { K.emit('rock', s.x, s.y, 8, { up: true }); fx.shake(2, 5); sfx('explode'); },
      paint(ctx, x, y) { art.rect(ctx, '#6a5040', x - 7, y - 6, 14, 12); art.rect(ctx, '#a08060', x - 6, y - 7, 11, 10); art.rect(ctx, '#c8a05a', x - 4, y - 6, 5, 3); } })));
  });
  sg('pyra', 'fire_serpent', 'Fire Serpent', 7, 'A serpent of flame slithers along the ground, biting again and again and setting what it bites alight.', (p, z, d) => {
    sfx('burst'); runner(p, z, { x: ahead(p, 16), dir: p.face, speed: 3.6, life: 48, every: 10, w: 22, h: 20, dmg: d, style: 'fire', atk: { status: { burn: 2 }, stun: 18, ky: -1.5 },
      paint(ctx, x, y, s) { for (let i = 0; i < 7; i++) { const sx = x - s.dir * i * 4, sy = y - 8 - Math.round(Math.sin(s.t * 0.5 - i * 0.8) * 4); art.rect(ctx, i ? (i % 2 ? '#ff4d1f' : '#ff8a3a') : '#ffd24a', sx - 2, sy - 2, i ? 4 : 5, i ? 4 : 5); } art.rect(ctx, '#ffffff', x + s.dir * 1, y - 10 - Math.round(Math.sin(s.t * 0.5) * 4), 1, 1); } });
  });
  sg('gale', 'twin_tornado', 'Twin Tornado', 6, 'Two small tornadoes spin away from him in both directions, dragging foes into them.', (p, z, d) => {
    sfx('swing'); [-1, 1].forEach(dir => { const v = vortex(p, z, p.x + dir * 20, p.y - 18, { r: 30, life: 60, pull: 1.6, every: 12, dmg: d, burst: 0, style: 'wind', cols: ['#d8fff0', '#7dffb2', '#ffffff'] }); v.tick = (o => function (s, g, zz) { s.x += dir * 2.2; o.call(this, s, g, zz); })(v.tick); });
  });
  sg('ashka', 'magma_bloom', 'Magma Bloom', 12, 'Molten rock bursts up through the floor ahead, one vent after another. It burns.', (p, z, d) => {
    sfx('explode'); [30, 56, 82, 108].forEach((off, i) => pillar(p, z, ahead(p, off), 6 + i * 6, { w: 18, h: 40, dmg: d, style: 'magma', cols: ['#ff5a1f', '#ffd24a', '#ff8a3a'], kind: 'geyser', atk: { status: { burn: 3 } } }));
  });
  sg('dyna', 'cluster_bomb', 'Cluster Bomb', 9, 'A bomb that bursts into four more where it lands. Stand clear.', (p, z, d) => {
    sfx('shoot');
    const paint = (ctx, x, y) => { art.rect(ctx, '#2a2a34', x - 3, y - 3, 6, 6); art.rect(ctx, '#ff5a3a', x - 1, y - 5, 2, 2); };
    const boom = (x, y, r, dd) => { nova(p, x, y, r, dd, 'blast', '#ffd24a', { heavy: true }); sfx('explode'); fx.shake(3, 8); };
    proj(p, z, { x: ahead(p, 10), y: p.y - 28, vx: p.face * 3.4, vy: -3.2, g: 0.22, life: 60, w: 8, h: 8, dmg: 0, style: 'blast', paint,
      onEnd: s => { boom(s.x, s.y, 26, d); [-2.4, -1, 1, 2.4].forEach(vx => proj(p, z, { x: s.x, y: s.y - 6, vx, vy: -3, g: 0.25, life: 40, w: 6, h: 6, dmg: 0, style: 'blast', paint, onEnd: q => boom(q.x, q.y, 18, Math.round(d * 0.7)) })); } });
  });
  sg('vesper', 'shadow_bind', 'Shadow Bind', 18, 'Shadows crawl out of the floor under the nearest foe and hold them fast.', (p, z, d) => {
    const e = nearest(p, z, 160), x = e ? e.x : ahead(p, 60); sfx('tele');
    pillar(p, z, x, 10, { w: 22, h: 44, dmg: d, style: 'shadow', cols: ['#2a2440', '#ff4d7a', '#5b5f97'], kind: 'jaws', atk: { stun: 70, kx: 0, ky: -0.5 } });
  });
  sg('orin', 'door_barrage', 'Door Barrage', 9, 'Three doors open in the air around the nearest foe, and each one drops a rift bolt.', (p, z, d) => {
    sfx('tele'); const tgt = nearest(p, z, 170), cx = tgt ? tgt.x : ahead(p, 70); [-34, 0, 34].forEach((off, i) => { const x = cx + p.face * off, y = p.y - 96;
      act(z, { x, y, life: 16 + i * 6, paint(ctx, sx, sy, s) { const k = Math.min(1, s.t / 6); art.rect(ctx, '#e04dff', sx - Math.round(8 * k), sy - 1, Math.round(16 * k), 3); art.rect(ctx, '#ffffff', sx - Math.round(5 * k), sy, Math.round(10 * k), 1); },
        end: () => proj(p, z, { x, y: y + 4, vx: 0, vy: 6, life: 30, w: 12, h: 14, dmg: d, style: 'void', paint: (ctx, px, py) => { art.rect(ctx, '#e04dff', px - 3, py - 6, 6, 12); art.rect(ctx, '#ffffff', px - 1, py - 4, 2, 8); } }) }); });
  });
  sg('mira', 'kaleidoscope', 'Kaleidoscope', 7, 'Six shards of glass circle her, cutting what comes close, then fly out ahead.', (p, z, d) => {
    sfx('shard'); orbit(p, z, { n: 6, r: 26, life: 42, every: 18, dmg: d, style: 'glass', fire: 6, fireDmg: 0.5,
      item: (ctx, x, y, i, t) => { art.rect(ctx, '#e8f0ff', x - 1, y - 3, 2, 6); art.rect(ctx, (t + i) % 6 < 3 ? '#ffffff' : '#c8d4f0', x, y - 2, 1, 4); } });
  });
  sg('noct', 'blink_strike', 'Blink Strike', 26, 'He is gone, then behind the nearest foe, already cutting.', (p, z, d) => {
    const e = nearest(p, z, 150, true); sfx('tele'); K.emit('void', p.x, p.y - 18, 10);
    fx.ghost(p.sheet(), 'idle', 0, p.x, p.y, p.face < 0);
    if (e) { const bx = e.x + (e.x > p.x ? 22 : -22); if (!(z.hit && z.hit(bx - p.w / 2, p.y - p.h, p.w, p.h))) { p.x = bx; } p.face = e.x > p.x ? 1 : -1; }
    else p.x = ahead(p, 50);
    K.emit('void', p.x, p.y - 18, 10); fx.slash(p.x + p.face * 14, p.y - 20, p.face, 3, '#5ad6c8', 34); sfx('heavy');
    hit(p, p.face > 0 ? p.x : p.x - 40, p.y - 40, 40, 40, d, { heavy: true, kx: p.face * 3, ky: -3, stun: 34 });
  });
  sg('bando', 'rubber_cannon', 'Rubber Cannon', 24, 'He winds himself all the way back, then fires himself across the room fist first.', (p, z, d) => {
    const hs = new Set(); sfx('charge');
    // fist first: his rubber arm (heroes4.js) is pulled back while he winds up, then leads him across the room
    const sc = art.sheets[p.sheet()], col = (sc && sc.cfg && sc.cfg.c && (sc.cfg.c.fore || sc.cfg.c.skin)) || '#d8a878';
    if (SW.rubberArm) z.shots.push({ t: 0, update() { if (++this.t > 30 || p.dead || p.state !== 'cast') this.gone = true; }, draw(ctx, cam) {
      const f = p.face, sx = Math.round(p.x + f * 4 - cam.x), sy = Math.round(p.y - 22 - cam.y), reach = this.t < 10 ? -10 - this.t : 30;
      SW.rubberArm(ctx, sx, sy, sx + f * reach, sy + (this.t < 10 ? -2 : 0), { col: (sc && sc.cfg && sc.cfg.c && sc.cfg.c.skin) || col, glove: col, r: 7, t: this.t, out: this.t >= 10, impact: hs.size > 0 }); } });
    z.shots.push(new Drive(p, 30, t => {
      if (t < 10) { p.vx = -p.face * 0.6; if (t % 2) K.gather('impact', p.x, p.y - 18, 2, 20); return; }
      if (t === 10) { sfx('dash'); fx.shake(3, 6); }
      p.vx = p.face * 7; if (t % 2) fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, p.face < 0);
      if (hit(p, p.face > 0 ? p.x : p.x - 30, p.y - 34, 30, 30, d, { hitSet: hs, heavy: true, kx: p.face * 5, ky: -3, stun: 34 }) > 0) { K.burst('impact', p.x + p.face * 16, p.y - 18, 2); return false; }
      if (t >= 24) return false;
    }, q => { q.vx = 0; }));
  });
  sg('aldric', 'judgment', 'Judgment', 28, 'A circle of light marks the nearest foe. A moment later the sky answers.', (p, z, d) => {
    const e = nearest(p, z, 180), x = e ? e.x : ahead(p, 70); sfx('awaken');
    pillar(p, z, x, 24, { w: 26, h: 140, dmg: d, style: 'light', cols: ['#fff3c0', '#ffffff', '#ffd60a'], kind: 'column', sfx: 'explode', atk: { heavy: true, ky: -2, stun: 34 } });
  });
  sg('sen', 'petal_storm', 'Petal Storm', 5, 'Blossoms whirl around him like blades, cutting everything close for a long breath.', (p, z, d) => {
    sfx('swing'); orbit(p, z, { n: 8, r: 42, life: 72, every: 10, dmg: d, style: 'petal',
      item: (ctx, x, y, i, t) => { art.rect(ctx, i % 2 ? '#ffa0c0' : '#ffd0e0', x - 1, y, 3, 1); art.rect(ctx, '#ffffff', x, y, 1, 1); } });
  });
  sg('vega', 'gravity_well', 'Gravity Well', 6, 'A well of crushing weight opens ahead and drags everything in before it collapses.', (p, z, d) => {
    sfx('tele'); vortex(p, z, ahead(p, 64), p.y - 20, { r: 52, life: 50, pull: 2.2, every: 14, dmg: d, burst: d * 2, style: 'gravity', cols: ['#9d6cff', '#1a0a2e', '#c8b0ff'] });
  });
  sg('tessa', 'time_bomb', 'Time Bomb', 26, 'She sets a clock on the floor. Anyone standing near it when it rings loses a moment, and a lot more.', (p, z, d) => {
    const x = ahead(p, 36), gy = ground(z, x, p.y); sfx('select');
    act(z, { x, y: gy, life: 80, tick(s) { if (s.t % 20 === 0) { sfx('blip'); foes(z).forEach(e => { if (Math.abs(e.x - x) < 48 && e.stagger && !e.isBoss) e.stagger(6); }); } },
      end: () => { nova(p, x, gy - 16, 48, d, 'time', '#e8a090', { heavy: true }); fx.shake(4, 10); sfx('explode'); },
      paint(ctx, sx, sy, s) { art.ring(ctx, '#e8a090', sx, sy - 8, 6); art.ring(ctx, '#fff3c0', sx, sy - 8, 5); const a = s.t * 0.25; art.line(ctx, '#ffffff', sx, sy - 8, Math.round(sx + Math.cos(a) * 4), Math.round(sy - 8 + Math.sin(a) * 4), 1); ctx.globalAlpha = 0.25 + 0.15 * Math.sin(s.t * 0.5); art.ring(ctx, '#e8a090', sx, sy - 8, 48); ctx.globalAlpha = 1; } });
  });
  sg('jax', 'ricochet', 'Ricochet', 12, 'One bullet that will not stop: it bounces off whatever it hits and comes back for more.', (p, z, d) => {
    sfx('shoot'); proj(p, z, { x: ahead(p, 14), y: p.y - 22, vx: p.face * 8, vy: 0, life: 70, w: 8, h: 6, dmg: d, bounce: 3, style: 'blast', atk: { stun: 20 },
      paint(ctx, x, y) { art.rect(ctx, '#ffd24a', x - 2, y - 1, 4, 2); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 1); } });
  });
  sg('ferra', 'scrap_tornado', 'Scrap Tornado', 5, 'A whirl of scrap metal grinds its way forward, chewing up whatever it passes.', (p, z, d) => {
    sfx('swing'); const v = vortex(p, z, ahead(p, 24), p.y - 20, { r: 28, life: 80, pull: 1, every: 10, dmg: d, burst: 0, style: 'metal', cols: ['#8aa4c8', '#e0e6f0', '#ffd24a'] });
    const t0 = v.tick; v.tick = function (s, g, zz) { s.x += p.face * 1.7; t0.call(this, s, g, zz); };
  });
  sg('kiri', 'crane_ward', 'Crane Ward', 9, 'Three paper cranes circle her, and one by one they dive at the nearest foe.', (p, z, d) => {
    sfx('swing'); const o = orbit(p, z, { n: 3, r: 22, life: 66, every: 999, dmg: 0, style: 'paper', item: (ctx, x, y, i, t) => { if (i < left) { art.rect(ctx, '#ffffff', x - 3, y, 6, 1); art.rect(ctx, '#ff4d6d', x - (t % 6 < 3 ? 3 : 1), y - 2, 2, 2); } } });
    let left = 3;
    [20, 40, 60].forEach(k => later(z, k, () => { left--; const e = nearest(p, z, 220, true); proj(p, z, { x: p.x, y: p.y - 30, vx: e ? Math.sign(e.x - p.x) * 4 : p.face * 4, vy: -1, home: 0.12, life: 60, w: 10, h: 8, dmg: d, style: 'paper', paint: (ctx, x, y) => { art.rect(ctx, '#ffffff', x - 4, y, 8, 1); art.rect(ctx, '#ff4d6d', x - 2, y - 2, 3, 2); } }); sfx('shoot'); }));
  });
  sg('tarn', 'gale_wheel', 'Gale Wheel', 8, 'He spins into a wheel of kicks and rolls forward through everything in the way.', (p, z, d) => {
    let hs = new Set(); sfx('swing');
    z.shots.push(new Drive(p, 16, t => {   // short, so a miss is not a long opening
      p.vx = p.face * 4.6; if (t % 4 === 0) hs = new Set();
      hit(p, p.x - 22, p.y - 38, 44, 38, d, { hitSet: hs, kx: p.face * 2.2, ky: -1.8, stun: 18 });
      fx.slash(p.x, p.y - 20, p.face, (t % 2) + 1, '#7dffb2', 24); if (t % 2) K.add('wind', p.x + rand(-18, 18), p.y - rand(4, 34), -p.face * 2, rand(-1, 1));
    }, q => { q.vx = 0; }));
  });
  sg('maren', 'tidal_wave', 'Tidal Wave', 13, 'A wall of seawater rises behind her and rolls forward, carrying foes along with it.', (p, z, d) => {
    sfx('burst'); runner(p, z, { x: ahead(p, 10), dir: p.face, speed: 3.8, life: 34, every: 12, w: 30, h: 42, dmg: d, style: 'water', atk: { kx: p.face * 3.4, ky: -1.4, stun: 24 },
      paint(ctx, x, y, s) { const k = Math.min(1, s.t / 6); for (let i = 0; i < 8; i++) { const h = Math.round((10 + 30 * Math.sin((i + 1) / 9 * Math.PI)) * k), sx = x - s.dir * (i * 4 - 14); art.rect(ctx, i % 2 ? '#2a9df4' : '#7fd8ff', sx - 2, y - h, 4, h); art.rect(ctx, '#ffffff', sx - 2, y - h, 4, 2); } } });
  });
  sg('yara', 'sky_lance', 'Sky Lance', 8, 'One arrow straight up. Six come down on the ground ahead, made of light.', (p, z, d) => {
    sfx('shoot'); proj(p, z, { x: p.x, y: p.y - 30, vx: 0, vy: -9, life: 14, w: 2, h: 2, dmg: 0, style: 'light', paint: (ctx, x, y) => art.rect(ctx, '#fff3c0', x, y - 4, 1, 8) });
    for (let i = 0; i < 6; i++) later(z, 18 + i * 3, () => proj(p, z, { x: ahead(p, 30 + i * 16 + rand(-4, 4)), y: p.y - 140, vx: p.face * 0.6, vy: 8, life: 30, w: 6, h: 14, dmg: d, style: 'light', paint: (ctx, x, y) => { art.rect(ctx, '#ffd60a', x, y - 7, 1, 14); art.rect(ctx, '#ffffff', x, y + 4, 1, 3); } }));
  });
  sg('brann', 'feral_pounce', 'Feral Pounce', 9, 'He leaps on the nearest foe and mauls them three times before they hit the ground.', (p, z, d) => {
    const e = nearest(p, z, 140); let caught = null, n = 0; sfx('roar');
    p.vy = -5.4; p.onGround = false; p.vx = (e ? Math.sign(e.x - p.x) : p.face) * 4.4;
    z.shots.push(new Drive(p, 40, t => {
      if (!caught) { p.vx = (e ? Math.sign(e.x - p.x) || p.face : p.face) * 4.4; const hs = new Set(); if (hit(p, p.face > 0 ? p.x : p.x - 28, p.y - 36, 28, 36, d, { hitSet: hs, kx: 0, ky: -1, stun: 30 }) > 0) { caught = t; K.emit('beast', p.x + p.face * 16, p.y - 20, 8); } if (t > 26) return false; return; }
      p.vx = 0;
      if ((t - caught) % 7 === 0 && n < 2) { n++; const tg = e && !e.dead ? e : null; hit(p, tg ? tg.x - 16 : (p.face > 0 ? p.x : p.x - 30), tg ? tg.y - tg.h - 6 : p.y - 36, tg ? 32 : 30, tg ? tg.h + 12 : 36, d, { kx: n === 2 ? p.face * 3.6 : 0.2, ky: n === 2 ? -3 : -1, stun: 26, heavy: n === 2 }); fx.slash(p.x + p.face * 14, p.y - 20, p.face, (n % 2) + 1, '#ff5a5a', 26); K.emit('beast', p.x + p.face * 16, p.y - 20, 6); sfx('hit'); }
      if (n >= 2 && t - caught > 16) return false;
    }));
  });
  // ----- the Hidden Clans -----
  sg('rook', 'clone_barrage', 'Clone Barrage', 9, 'Three of him burst out of the smoke and charge ahead, one after another.', (p, z, d) => {
    sfx('swing'); K.emit('smoke', p.x, p.y - 16, 10); [0, 7, 14].forEach(k => later(z, k + 1, () => phantom(p, z, { life: 30, speed: 5, dmg: d, style: 'smoke', anim: 'run' })));
  });
  sg('sable', 'static_rain', 'Static Rain', 6, 'He calls the storm down: needles of lightning rain on the ground ahead.', (p, z, d) => {
    sfx('zap'); for (let i = 0; i < 6; i++) later(z, 4 + i * 4, () => { const x = ahead(p, 30 + i * 16 + rand(-6, 6)), gy = ground(z, x, p.y); fx.bolt(x + rand(-10, 10), gy - 150, x, gy, '#c8b8ff'); fx.bolt(x, gy - 150, x + rand(-4, 4), gy, '#ffffff'); K.emit('bolt', x, gy - 4, 5, { up: true }); hit(p, x - 8, gy - 60, 16, 60, d, { stun: 22, kx: p.face * 0.8, ky: -1.5, srcX: x }); sfx('zap'); });
  });
  sg('dune', 'sand_maw', 'Sand Maw', 27, 'The ground under the nearest foe opens into jaws of sand and closes on them.', (p, z, d) => {
    const e = nearest(p, z, 160), x = e ? e.x : ahead(p, 60); sfx('heavy'); K.emit('sand', x, ground(z, x, p.y), 10, { up: true, spread: 1 });
    pillar(p, z, x, 12, { w: 26, h: 40, dmg: d, style: 'sand', cols: ['#d9a441', '#f5deb0', '#e8c070'], kind: 'jaws', sfx: 'heavy', atk: { stun: 52, kx: 0, ky: -1 } });
  });
  sg('moro', 'shadow_tide', 'Shadow Tide', 11, 'His shadow pours out across the floor ahead, then turns to spikes all at once.', (p, z, d) => {
    const x0 = p.x, dir = p.face, gy = ground(z, x0, p.y); sfx('tele');
    act(z, { x: x0, y: gy, life: 34, paint(ctx, sx, sy, s) { const len = Math.round(110 * Math.min(1, s.t / 16)); ctx.globalAlpha = 0.7 * (s.t > 26 ? (34 - s.t) / 8 : 1); art.rect(ctx, '#2a2440', dir > 0 ? sx : sx - len, sy - 2, len, 3); ctx.globalAlpha = 1; } });
    [30, 52, 74, 96].forEach(off => pillar(p, z, x0 + dir * off, 18, { w: 10, h: 30, dmg: d, style: 'shadow', cols: ['#2a2440', '#5b5f97', '#8a8fd0'], kind: 'spike', atk: { stun: 30, ky: -2 } }));
  });
  sg('pell', 'cats_cradle', "Cat's Cradle", 5, 'A web of strings spans the space ahead. Anything inside it is caught, again and again.', (p, z, d) => {
    const x = ahead(p, 64), y = p.y - 26; let hs = new Set(); sfx('swing');
    act(z, { x, y, life: 64, tick(s) { if (s.t % 12 === 0) hs = new Set(); hit(p, x - 36, y - 24, 72, 48, d, { hitSet: hs, kx: 0, ky: -0.4, stun: 16, srcX: x }); },
      paint(ctx, sx, sy, s) { const k = Math.min(1, s.t / 8); ctx.globalAlpha = 0.8 * (s.t > 56 ? (64 - s.t) / 8 : 1); for (let i = 0; i < 5; i++) { art.line(ctx, '#f0c0ff', sx - Math.round(36 * k), sy - 24 + i * 12, sx + Math.round(36 * k), sy + 24 - i * 12, 1); } art.line(ctx, '#b5179e', sx - Math.round(36 * k), sy, sx + Math.round(36 * k), sy, 1); ctx.globalAlpha = 1; } });
  });
  sg('hollis', 'stone_garden', 'Stone Garden', 14, 'Spires of rock burst up all around him at once. Nothing close stays standing.', (p, z, d) => {
    sfx('heavy'); fx.shake(4, 10); [-48, -26, 26, 48].forEach(off => pillar(p, z, p.x + off, 8, { w: 16, h: 34, dmg: d, style: 'rock', cols: ['#6a994e', '#a08060', '#c8a05a'], kind: 'spike', atk: { kx: Math.sign(off) * 2.4, ky: -5.4, launch: true } }));
  });
  sg('kestra', 'ember_swarm', 'Ember Swarm', 5, 'A swarm of fire moths leaves her fan and hunts down whoever is nearest.', (p, z, d) => {
    sfx('burst'); for (let i = 0; i < 5; i++) later(z, 1 + i * 4, () => proj(p, z, { x: ahead(p, 10), y: p.y - 26, vx: p.face * 3, vy: rand(-2, 1), home: 0.14, life: 70, w: 8, h: 8, dmg: d, style: 'fire', atk: { status: { burn: 2 }, stun: 14 },
      paint(ctx, x, y, s) { const f = s.t % 4 < 2; art.rect(ctx, '#ffd24a', x - 1, y - 1, 2, 2); art.rect(ctx, '#ff6b35', x - (f ? 3 : 2), y - (f ? 2 : 1), 2, 1); art.rect(ctx, '#ff6b35', x + (f ? 1 : 0), y - (f ? 2 : 1), 2, 1); } }));
  });
  sg('ivo', 'meteor_rush', 'Meteor Rush', 5, 'Six blows in a heartbeat on the way in, then a rising heel that sends them flying.', (p, z, d) => {
    let n = 0; sfx('dash');
    z.shots.push(new Drive(p, 30, t => {
      if (t <= 18) { p.vx = p.face * 3.2; if (t % 3 === 0) { n++; hit(p, p.face > 0 ? p.x : p.x - 30, p.y - 34, 30, 28, d, { kx: p.face * 0.8, ky: -0.6, stun: 16 }); fx.slash(p.x + p.face * 14, p.y - 18 + rand(-6, 6), p.face, (n % 2) + 1, '#ffb703', 20); K.emit('impact', p.x + p.face * 20, p.y - 18, 3, { dir: p.face }); sfx('hit'); } return; }
      if (t === 20) { p.vx = 0; p.vy = -5; p.onGround = false; hit(p, p.face > 0 ? p.x - 4 : p.x - 30, p.y - 54, 34, 54, d * 2, { heavy: true, kx: p.face * 1.2, ky: -7.6, stun: 40, launch: true }); K.emit('impact', p.x, p.y - 30, 10, { up: true }); fx.shake(3, 8); sfx('heavy'); }
    }));
  });
  sg('nami', 'rising_geyser', 'Rising Geyser', 10, 'Three geysers burst up one after another along the ground ahead and throw foes into the air.', (p, z, d) => {
    sfx('burst'); [32, 62, 92].forEach((off, i) => pillar(p, z, ahead(p, off), 6 + i * 6, { w: 16, h: 50, dmg: d, style: 'water', cols: ['#0077b6', '#7fd8ff', '#ffffff'], kind: 'geyser', atk: { ky: -6.4, launch: true, stun: 34 } }));
  });
  sg('lin', 'rippling_palm', 'Rippling Palm', 12, 'One palm strike sends a ripple through the air that locks up whoever it passes through.', (p, z, d) => {
    sfx('perfect'); proj(p, z, { x: ahead(p, 16), y: p.y - 22, vx: p.face * 4.2, vy: 0, life: 32, w: 18, h: 30, dmg: d, every: 16, pierce: true, style: 'chi', atk: { stun: 44, kx: p.face * 0.6, ky: -0.5 },
      paint(ctx, x, y, s) { for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.8 - i * 0.22; art.ring(ctx, i ? '#5ec8d8' : '#bff6ff', x - Math.sign(s.vx) * i * 5, y, 6 + i * 3); } ctx.globalAlpha = 1; } });
  });
  sg('corvin', 'murder_of_crows', 'Murder of Crows', 4, 'Ten crows burst from his sleeves and sweep the air ahead.', (p, z, d) => {
    sfx('shoot'); for (let i = 0; i < 10; i++) later(z, 1 + i * 2, () => proj(p, z, { x: ahead(p, 8), y: p.y - 22 + rand(-10, 8), vx: p.face * rand(4, 5.6), vy: rand(-0.8, 0.8), life: 36, w: 10, h: 8, dmg: d, style: 'feather', atk: { stun: 10, kx: p.face * 0.8 },
      paint(ctx, x, y, s) { const f = s.t % 6 < 3; art.rect(ctx, '#1a1026', x - 3, y - 1, 6, 2); art.rect(ctx, '#7209b7', x - (f ? 4 : 2), y - (f ? 3 : 2), 3, 1); art.rect(ctx, '#ffd24a', x + (s.vx > 0 ? 3 : -4), y - 1, 1, 1); } }));
  });
  sg('thorne', 'ivory_thicket', 'Ivory Thicket', 8, 'Bone spikes come up all over the ground ahead, in no order anyone could guess.', (p, z, d) => {
    sfx('swing'); for (let i = 0; i < 6; i++) pillar(p, z, ahead(p, 22 + rand(0, 96)), 4 + i * 4, { w: 10, h: 28, dmg: d, style: 'bone', cols: ['#f0ecd0', '#c9c6a0', '#ffffff'], kind: 'spike', atk: { ky: -3.4, stun: 22 } });
  });
  sg('ume', 'toxic_bloom', 'Toxic Bloom', 10, 'A flower pushes up through the floor ahead, bursts, and leaves a cloud of spores that stings.', (p, z, d) => {
    const x = ahead(p, 40), gy = ground(z, x, p.y); sfx('burst');
    act(z, { x, y: gy, life: 140, tick(s) {
      if (s.t === 16) { nova(p, x, gy - 16, 40, d, 'spore', '#9ef01a', {}); sfx('burst'); }
      if (s.t > 16 && s.t % 4 === 0) K.add('spore', x + rand(-30, 30), gy - rand(4, 40), rand(-0.3, 0.3), rand(-0.4, 0.1));
      if (s.t > 16 && s.t % 20 === 0) hit(p, x - 32, gy - 44, 64, 44, Math.max(1, Math.round(d * 0.3)), { kx: 0, ky: 0, stun: 8, srcX: x });
    }, paint(ctx, sx, sy, s) {
      if (s.t <= 16) { const h = Math.round(18 * s.t / 16); art.rect(ctx, '#5a8a10', sx, sy - h, 1, h); art.rect(ctx, '#9ef01a', sx - 3, sy - h - 3, 7, 4); art.rect(ctx, '#d8ff80', sx - 1, sy - h - 2, 3, 2); return; }
      ctx.globalAlpha = 0.16 * (1 - s.t / 140); art.rect(ctx, '#9ef01a', sx - 32, sy - 44, 64, 44); ctx.globalAlpha = 1;
    } });
  });
  sg('tarek', 'chain_snare', 'Chain Snare', 24, 'The chain catches the nearest foe, drags them in, and slams them into the floor.', (p, z, d) => {
    const e = nearest(p, z, 170); sfx('swing');
    const ex = e ? e.x : ahead(p, 120), ey = e ? e.y - e.h / 2 : p.y - 22;
    act(z, { x: p.x, y: p.y - 22, life: 14, paint(ctx, sx, sy, s) { const k = s.t < 6 ? s.t / 5 : (14 - s.t) / 8, dx = (ex - p.x) * Math.min(1, k), dy = (ey - p.y + 22) * Math.min(1, k), n = Math.max(1, Math.round(Math.hypot(dx, dy) / 5)); for (let i = 0; i <= n; i++) { art.rect(ctx, i % 2 ? '#8d99ae' : '#e0e6f0', Math.round(sx + dx * i / n) - 1, Math.round(sy + dy * i / n) - 1, 3, 2); } art.rect(ctx, '#c9a227', Math.round(sx + dx) - 2, Math.round(sy + dy) - 2, 5, 5); } });
    if (!e) return;
    later(z, 6, () => { if (e.dead) return; const pull = p.x + p.face * 20 - e.x; if (settable(e)) moveFoe(e, pull); else act(z, { x: 0, y: 0, life: 6, tick: () => moveFoe(e, (p.x + p.face * 20 - e.x) / 3) }); K.emit('metal', e.x, e.y - e.h / 2, 6); });
    later(z, 12, () => { hit(p, p.face > 0 ? p.x : p.x - 40, p.y - 44, 40, 44, d, { heavy: true, kx: p.face * 1, ky: 4, stun: 40, down: true }); K.emit('rock', p.x + p.face * 20, p.y - 4, 8, { up: true }); fx.shake(4, 8); sfx('heavy'); });
  });
  sg('isa', 'living_script', 'Living Script', 7, 'Four ink glyphs crawl out along the ground and burst on whatever they touch.', (p, z, d) => {
    sfx('swing'); [2.4, 3.2, 4, 4.8].forEach((sp, i) => runner(p, z, { x: ahead(p, 12), dir: p.face, speed: sp, life: 40, w: 14, h: 14, dmg: d, style: 'ink', atk: { stun: 24 },
      paint(ctx, x, y, s) { const c = i % 2 ? '#ef476f' : '#1a1026'; art.rect(ctx, c, x - 4, y - 10, 8, 2); art.rect(ctx, c, x - 1, y - 12, 2, 10); art.rect(ctx, c, x - 4, y - 4, 3, 2); art.rect(ctx, c, x + 2, y - 6, 3, 2); } }));
  });
  sg('garo', 'twin_wheels', 'Twin Wheels', 8, 'Two great wheels fly out, one high and one low, and come back to his hands.', (p, z, d) => {
    sfx('swing'); [-30, -10].forEach((off, i) => later(z, 1 + i * 5, () => proj(p, z, { x: ahead(p, 14), y: p.y + off, vx: p.face * 6, vy: 0, life: 34, w: 18, h: 18, dmg: d, style: 'metal', pierce: true, every: 17, back: true,
      paint(ctx, x, y, s) { art.ring(ctx, '#8d99ae', x, y, 7); art.ring(ctx, '#e0e6f0', x, y, 5); const a = s.t * 0.9; for (let k = 0; k < 4; k++) art.rect(ctx, '#ffffff', Math.round(x + Math.cos(a + k * 1.57) * 7), Math.round(y + Math.sin(a + k * 1.57) * 7), 1, 1); } })));
  });
  sg('mika', 'lunar_halo', 'Lunar Halo', 6, 'Four crescent blades circle her like moons, then she sends them out ahead.', (p, z, d) => {
    sfx('swing'); orbit(p, z, { n: 4, r: 26, life: 54, every: 10, dmg: d, style: 'moon', fire: 5.6,
      item: (ctx, x, y) => { art.glow(ctx, x, y, 8, '#b8c0ff', 0.18); art.rect(ctx, '#ffffff', x, y - 4, 2, 9); art.rect(ctx, '#b8c0ff', x - 2, y - 3, 2, 7); art.rect(ctx, '#7a80c0', x - 4, y - 1, 2, 3); } });
  });
  sg('oda', 'echo_chamber', 'Echo Chamber', 7, 'The bell rings three times, each echo landing further ahead than the last.', (p, z, d) => {
    sfx('heavy'); [36, 76, 116].forEach((off, i) => later(z, 6 + i * 10, () => { const x = ahead(p, off); nova(p, x, p.y - 18, 30, d, 'sound', '#ffd08a', { kx: p.face * 2.2, ky: -2 }); fx.ring(x, p.y - 18, '#bc6c25', 10, 40, 16); sfx('heavy'); }));
  });

  // the projectile helper reads s.back: a returning wheel turns round halfway
  const _act = Act.prototype.update; Act.prototype.update = function (g, z) { if (this.back && this.t === Math.round(this.life / 2)) { this.vx = -this.vx; } return _act.call(this, g, z); };

  // ================= using it =================
  const has = G.has; G.has = id => { const s = G.state && SIG[G.state.hero]; return s && s.id === id ? has(G.hero().kit[2]) : has(id); };
  function ready(p) { const cd = p.cd || (p.cd = {}); if (!(cd.wo > 0)) return true; if (!(p.cdDeny > 0)) { sfx('deny'); p.cdDeny = 24; p.cdFlash = 'wo'; } return false; }
  function signature(p) {
    const g = p.G, h = g.hero(), s = SIG[g.state.hero];
    if (!s || !g.has(s.id) || p.state === 'hurt' || p.dead) return false;
    if (!ready(p)) return true;
    if (!p.spend(COST)) return true;
    (p.cd || (p.cd = {})).wo = CD;
    const style = K.styleOf(g.state.hero), dmg = Math.round(A[s.id].dmg * (p.specMul ? p.specMul() : 1)), z = g.zone;
    K.cast(p, style, 2); fx.flash(h.colorHi, 4);
    p.enter('cast'); p.st = -4; p.castFn = () => s.cast(p, z, dmg, h, style);
    return true;
  }
  const _aw = P.useAwaken; P.useAwaken = function () {
    if (I.held('up') && !I.held('down') && signature(this)) return;
    return _aw.apply(this, arguments);
  };
  // a Versus bot throws it now and then in place of I
  const _sp = P.useSpecial; P.useSpecial = function () {
    const g = this.G, bot = g.scene === 'vs' && V && V.cur && V.cur.bot && V.cur.p === this, s = SIG[g.state.hero];
    if (bot && s && !I.held('up') && !I.held('down') && g.has(s.id) && g.state.energy >= COST + 20 && !((this.cd || {}).wo > 0) && Math.random() < 0.2 && signature(this)) return;
    return _sp.apply(this, arguments);
  };

  // ================= HUD: a fifth slot =================
  function pip(ctx, g, p, h, x, y) {
    const s = SIG[g.state.hero]; if (!s || !g.has(s.id)) return;
    const left = (p.cd && p.cd.wo) || 0, bad = p.cdFlash === 'wo' && p.cdDeny > 12;
    text(ctx, 'W+O', x, y, bad ? '#ff5a5a' : left > 0 ? '#5a6078' : '#ffffff');
    art.rect(ctx, '#1a1626', x, y + 8, 24, 2); art.rect(ctx, left > 0 ? h.color : h.colorHi, x, y + 8, Math.round(24 * (1 - left / CD)), 2);
  }
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    const p = g.player, h = g.hero && g.hero();
    if (!p || !h || g.scene !== 'play' || !g.has(h.kit[0])) return;
    const y = p.modeT > 0 ? 66 : 56; ctx.globalAlpha = 0.5; art.rect(ctx, '#05060c', 129, y - 2, 32, 14); ctx.globalAlpha = 1;
    pip(ctx, g, p, h, 132, y);
  };
  if (V && V.draw) {
    const _vd = V.draw; V.draw = function (ctx, g) {
      _vd(ctx, g);
      if (g.scene !== 'vs' || !V.f || V.f.length < 2 || ['intro', 'fight', 'ko'].indexOf(V.phase) < 0 || V.paused) return;
      const keep = g.state;
      V.f.forEach((f, i) => { if (!f.p || !HR[f.hero]) return; g.state = f.state; const x = i ? W - 166 : 130; ctx.globalAlpha = 0.55; art.rect(ctx, '#05060c', x - 2, H - 40, 30, 14); ctx.globalAlpha = 1; pip(ctx, g, f.p, HR[f.hero], x, H - 38); });
      g.state = keep;
    };
  }

  SW.signature = { SIG, COST, CD, use: signature };
})();
