'use strict';
// Shattered Worlds — the Hidden Clans fight in their element. Loaded after skillfx.js; only adds and wraps.
//   The eighteen ninjas used to borrow a shared J combo (Dune swung Brakk's fists). Each now has a combo of their own:
//   every hit throws their element (sand, lightning, water, ink, crow feathers ...), and the fourth J ends in an element
//   finisher that reaches past the fist: Dune's sand wave runs along the ground, Nami's water whip lashes out, Corvin's
//   crows fly, Garo's wheel goes out and comes back. The launcher, the sweep and air attacks throw the element too.
//   A finisher deals a quarter of the last hit again: it is the element's flourish, not a second blow (measured in Versus, two thirds lifted the clans about 8 points of win rate over the story heroes, and 40% still about 6).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, P = SW.Player.prototype, rand = SW.rand;
  const HR = D.heroes, C = D.combat, K = SW.skillfx, sfx = n => SW.audio.sfx(n);
  if (!K) return;

  // ================= helpers =================
  const strike = (p, x, y, w, h, dmg, o) => SW.strike(G, Object.assign({ team: 'player', x, y, w, h, dmg, kx: p.face * 1.5, ky: -1.5, stun: 22, hitSet: new Set(), srcX: p.x, quiet: true }, o || {}));
  // something that lives in the zone for a while: tick(self, g, z) every frame, draw(ctx, sx, sy, self)
  class Act {
    constructor(o) { Object.assign(this, { t: 0, life: 30 }, o); }
    update(g, z) { this.t++; if (this.tick) this.tick(this, g, z); if (this.t >= this.life) this.gone = true; }
    draw(ctx, cam) { if (this.paint) this.paint(ctx, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this); }
  }
  // a small projectile in an element: o = { x, y, vx, vy, g, life, w, h, dmg, style, size, pierce, back (returns), paint }
  function shot(p, z, o) {
    const style = o.style, hs = new Set();
    z.shots.push(new Act(Object.assign({}, o, {
      tick(s) {
        if (s.back && s.t === Math.round(s.life / 2)) { s.vx = -s.vx; hs.clear(); }
        s.x += s.vx; s.y += s.vy; s.vy += s.g || 0;
        if (s.t % 2 === 0) K.trail(style, s.x, s.y, s.vx, s.vy);
        const n = strike(p, s.x - s.w / 2, s.y - s.h / 2, s.w, s.h, s.dmg, Object.assign({ hitSet: hs, kx: Math.sign(s.vx) * 2, srcX: s.x - s.vx }, o.atk));
        if (n > 0) { K.burst(style, s.x, s.y, 0.8); if (!s.pierce) s.gone = true; }
        if (z.hit && z.hit(s.x - 2, s.y - 2, 4, 4)) { K.burst(style, s.x, s.y, 0.6); s.gone = true; }
      }
    })));
  }
  const boxOf = (p, a) => { const b = a.box; return { x: p.face > 0 ? p.x + b[0] : p.x - b[0] - b[2], y: p.y + b[1], w: b[2], h: b[3] }; };
  const ground = (p, z, x) => { for (let y = Math.floor((p.y - 8) / 16); y < (z.h || 30); y++) { const c = z.tile ? z.tile(Math.floor(x / 16), y) : '#'; if (c === '#' || c === '=') return y * 16; } return p.y; };
  const nearestFoe = (p, z, r) => { let best = null, bd = r; z.ents.forEach(e => { if (!e.hittable || e.team !== 'enemy' || e.dead) return; const d = Math.abs(e.x - p.x); if ((e.x - p.x) * p.face > -10 && d < bd && Math.abs(e.y - p.y) < 60) { bd = d; best = e; } }); return best; };

  // ================= the finishers =================
  // fin(p, z, dmg, h): runs on the frame the fourth J lands
  const FIN = {
    dune(p, z, d) {   // a sand wave runs along the ground
      const dir = p.face, hs = new Set(); sfx('heavy');
      z.shots.push(new Act({ x: p.x + dir * 18, y: p.y, life: 16, tick(s) {
        s.x += dir * 6; s.y = ground(p, z, s.x);
        for (let i = 0; i < 3; i++) K.add('sand', s.x + rand(-6, 6), s.y - rand(0, 6), dir * rand(0.5, 2), rand(-2.4, -0.6));
        strike(p, s.x - 10, s.y - 16, 20, 16, d, { hitSet: hs, kx: dir * 2.6, ky: -2.6, stun: 26, srcX: s.x - dir * 10 });
      }, paint(ctx, x, y, s) {   // a curling crest: low at the back, high at the front, lighter on top
        const k = Math.min(1, s.t / 3) * (s.t > s.life - 4 ? (s.life - s.t) / 4 : 1), HT = [3, 5, 8, 11, 13, 10];
        HT.forEach((h0, i) => { const h = Math.max(1, Math.round(h0 * k)), cx = x + dir * (i * 3 - 9); art.rect(ctx, '#d9a441', cx - 1, y - h, 3, h); art.rect(ctx, '#f5deb0', cx - 1, y - h, 3, 1); });
        art.rect(ctx, '#f5deb0', x + dir * 8, y - Math.round(13 * k) - 1, 2, 2);
      } }));
    },
    sable(p, z, d) {   // a lightning arc leaps ahead
      const x1 = p.x + p.face * 84, y = p.y - 20; sfx('zap');
      fx.bolt(p.x + p.face * 12, y, x1, y + rand(-8, 8), '#c8b8ff'); fx.bolt(p.x + p.face * 12, y, x1, y + rand(-8, 8), '#ffffff');
      K.emit('bolt', x1, y, 8);
      strike(p, Math.min(p.x, x1), y - 12, 84, 24, d, { stun: 26, kx: p.face * 1.2 });
    },
    moro(p, z, d) {   // a shadow spike rises under the nearest foe and pins them
      const e = nearestFoe(p, z, 110), x = e ? e.x : p.x + p.face * 50, gy = e ? e.y : p.y, hs = new Set();
      z.shots.push(new Act({ x, y: gy, life: 24, tick(s) {
        if (s.t === 7) { strike(p, x - 9, gy - 40, 18, 40, d, { hitSet: hs, kx: 0, ky: -0.5, stun: 40 }); K.emit('shadow', x, gy - 16, 10, { up: true }); sfx('swing'); }
      }, paint(ctx, sx, sy, s) {
        if (s.t < 7) { ctx.globalAlpha = 0.6; art.rect(ctx, '#2a2440', sx - s.t * 1.5, sy - 1, s.t * 3, 2); ctx.globalAlpha = 1; return; }
        const h = Math.round(38 * Math.min(1, (s.t - 6) / 3) * (s.t > 18 ? (24 - s.t) / 6 : 1));
        for (let i = 0; i < h; i += 2) { const w = Math.max(1, Math.round(5 * (1 - i / 40))); art.rect(ctx, i % 6 ? '#2a2440' : '#5b5f97', sx - w, sy - i - 2, w * 2, 2); }
      } }));
    },
    pell(p, z, d) {   // a string catches the foe and jerks them off balance
      const e = nearestFoe(p, z, 100); sfx('swing');
      const x1 = e ? e.x : p.x + p.face * 90, y1 = e ? e.y - e.h / 2 : p.y - 20;
      const dx = x1 - p.x, dy = y1 - (p.y - 22);
      z.shots.push(new Act({ x: p.x, y: p.y - 22, life: 10, paint(ctx, sx, sy, s) { ctx.globalAlpha = 1 - s.t / 10; art.line(ctx, '#f0c0ff', sx, sy, Math.round(sx + dx), Math.round(sy + dy), 1); ctx.globalAlpha = 1; } }));
      K.emit('string', x1, y1, 6, { dir: -p.face });
      if (e) strike(p, e.x - 10, e.y - e.h, 20, e.h, d, { kx: p.face * 0.8, ky: -1, stun: 22 });   // it used to drag them back into the next combo, a loop the Versus bot won 70% with
    },
    hollis(p, z, d) {   // a fist of stone bursts out of the ground ahead and throws them up
      const x = p.x + p.face * 34, gy = ground(p, z, x), hs = new Set();
      z.shots.push(new Act({ x, y: gy, life: 22, tick(s) { if (s.t === 4) { strike(p, x - 12, gy - 34, 24, 34, d, { hitSet: hs, kx: p.face * 1, ky: -6.2, stun: 34, launch: true }); K.emit('rock', x, gy - 8, 10, { up: true, spread: 0.7 }); fx.shake(3, 6); sfx('heavy'); } },
        paint(ctx, sx, sy, s) { if (s.t < 4) return; const h = Math.round(30 * Math.min(1, (s.t - 3) / 3) * (s.t > 14 ? (22 - s.t) / 8 : 1)); art.rect(ctx, '#6a5040', sx - 8, sy - h, 16, h); art.rect(ctx, '#a08060', sx - 6, sy - h, 12, Math.max(2, h - 4)); art.rect(ctx, '#c8a05a', sx - 4, sy - h, 8, 2); } }));
    },
    kestra(p, z, d) {   // a fan of fire that sets them burning
      const dir = p.face; sfx('burst');
      for (let i = 0; i < 14; i++) K.add('fire', p.x + dir * 14, p.y - 20 + rand(-4, 4), dir * rand(2, 4.6), rand(-1.4, 1.2));
      strike(p, dir > 0 ? p.x + 8 : p.x - 64, p.y - 38, 56, 34, d, { status: { burn: 2 }, stun: 20 });
    },
    ivo(p, z, d) {   // three more blows in a heartbeat
      const hs0 = [new Set(), new Set(), new Set()]; sfx('swing');
      [0, 4, 8].forEach((k, i) => z.shots.push(new Act({ x: p.x, y: p.y, life: k + 1, tick(s) { if (s.t !== k + 1) return; strike(p, p.face > 0 ? p.x + 4 : p.x - 34, p.y - 30, 30, 22, Math.max(1, Math.round(d * 0.4)), { hitSet: hs0[i], kx: p.face * (i === 2 ? 3 : 0.6), stun: 16 }); K.emit('impact', p.x + p.face * 22, p.y - 20 + rand(-6, 6), 5, { dir: p.face, spread: 0.5 }); fx.slash(p.x + p.face * 14, p.y - 20, p.face, (i % 2) + 1, '#ffb703', 18); } })));
    },
    nami(p, z, d) {   // a whip of water lashes out
      const dir = p.face, x0 = p.x + dir * 30; sfx('swing');
      z.shots.push(new Act({ x: p.x, y: p.y - 20, life: 10, paint(ctx, sx, sy, s) { const k = Math.min(1, s.t / 3), len = Math.round(80 * k); ctx.globalAlpha = 1 - s.t / 12; for (let i = 0; i < len; i += 3) art.rect(ctx, i % 6 ? '#2a9df4' : '#7fd8ff', sx + dir * (10 + i), sy + Math.round(Math.sin(i * 0.15 + s.t) * 3), 3, 2); ctx.globalAlpha = 1; } }));
      for (let i = 0; i < 8; i++) K.add('water', x0 + dir * rand(0, 50), p.y - 20 + rand(-4, 4), dir * rand(0.5, 2), rand(-2, 0));
      strike(p, dir > 0 ? x0 : x0 - 60, p.y - 30, 60, 22, d, { kx: dir * 0.8, ky: -1, stun: 22 });   // pulling them back in made a combo loop (like Pell's)
    },
    lin(p, z, d) {   // a palm to a pressure point: they lock up for a moment
      const x = p.x + p.face * 30, y = p.y - 22; sfx('perfect');
      fx.ring(x, y, '#bff6ff', 2, 22, 12); K.emit('chi', x, y, 6);
      strike(p, x - 14, y - 14, 28, 28, d, { kx: p.face * 0.4, ky: 0, stun: 44 });
    },
    corvin(p, z, d) {   // three crows take off ahead
      sfx('shoot');
      [-1.1, 0, 1.1].forEach((vy, i) => shot(p, z, { x: p.x + p.face * 12, y: p.y - 24 + i * 4, vx: p.face * 5.2, vy, life: 26, w: 10, h: 8, dmg: Math.max(1, Math.round(d * 0.45)), style: 'feather',
        paint(ctx, x, y, s) { const f = s.t % 6 < 3; art.rect(ctx, '#1a1026', x - 3, y - 1, 6, 2); art.rect(ctx, '#7209b7', x - (f ? 4 : 2), y - (f ? 3 : 2), 3, 1); art.rect(ctx, '#ffd24a', x + (s.vx > 0 ? 3 : -4), y - 1, 1, 1); } }));
    },
    thorne(p, z, d) {   // a row of bone spikes, one after another
      sfx('swing');
      [24, 42, 60].forEach((off, i) => { const x = p.x + p.face * off, gy = ground(p, z, x), hs = new Set();
        z.shots.push(new Act({ x, y: gy, life: 20 + i * 4, tick(s) { if (s.t === 2 + i * 4) { strike(p, x - 6, gy - 26, 12, 26, Math.max(1, Math.round(d * 0.5)), { hitSet: hs, kx: p.face * 1.2, ky: -3, stun: 22 }); K.emit('bone', x, gy - 10, 4, { up: true }); } },
          paint(ctx, sx, sy, s) { const k = s.t - (2 + i * 4); if (k < 0) return; const h = Math.round(24 * Math.min(1, k / 2) * (k > 10 ? Math.max(0, (16 - k) / 6) : 1)); for (let j = 0; j < h; j += 2) { const w = Math.max(1, Math.round(4 * (1 - j / 26))); art.rect(ctx, j % 4 ? '#f0ecd0' : '#c9c6a0', sx - w, sy - j - 2, w * 2, 2); } } })); });
    },
    ume(p, z, d) {   // a cloud of spores that hangs in the air and stings
      const x = p.x + p.face * 36, y = p.y - 18; sfx('burst');
      z.shots.push(new Act({ x, y, life: 90, tick(s) {
        if (s.t % 4 === 0) K.add('spore', x + rand(-14, 14), y + rand(-12, 12), rand(-0.3, 0.3), rand(-0.4, 0.1));
        if (s.t % 22 === 1) strike(p, x - 18, y - 16, 36, 32, Math.max(1, Math.round(d * 0.35)), { kx: 0, ky: 0, stun: 10 });
      }, paint(ctx, sx, sy, s) { ctx.globalAlpha = 0.18 * (1 - s.t / 90); art.rect(ctx, '#9ef01a', sx - 16, sy - 14, 32, 28); ctx.globalAlpha = 1; } }));
    },
    tarek(p, z, d) {   // the chain snaps out to its full length
      const dir = p.face, len = 108; sfx('swing');
      z.shots.push(new Act({ x: p.x, y: p.y - 22, life: 10, paint(ctx, sx, sy, s) { const k = s.t < 5 ? s.t / 4 : (10 - s.t) / 5, l = Math.round(len * Math.min(1, k)); for (let i = 0; i < l; i += 5) { art.rect(ctx, '#8d99ae', sx + dir * (8 + i), sy, 3, 2); art.rect(ctx, '#e0e6f0', sx + dir * (8 + i), sy, 1, 1); } if (l > 8) { art.rect(ctx, '#c9a227', sx + dir * (8 + l) - 2, sy - 3, 5, 5); } } }));
      K.emit('metal', p.x + dir * (len - 10), p.y - 22, 6, { dir });
      strike(p, dir > 0 ? p.x + len - 36 : p.x - len, p.y - 32, 36, 22, d, { kx: dir * 2.2, stun: 24 });
    },
    isa(p, z, d) {   // a blot of ink, thrown in an arc, that splashes where it lands
      sfx('shoot');
      shot(p, z, { x: p.x + p.face * 12, y: p.y - 28, vx: p.face * 3.6, vy: -2.6, g: 0.22, life: 40, w: 10, h: 10, dmg: d, style: 'ink', atk: { stun: 30 },
        paint(ctx, x, y) { art.rect(ctx, '#1a1026', x - 3, y - 3, 6, 6); art.rect(ctx, '#ef476f', x - 1, y - 1, 2, 2); } });
    },
    garo(p, z, d) {   // the wheel goes out and comes back
      sfx('swing');
      shot(p, z, { x: p.x + p.face * 14, y: p.y - 20, vx: p.face * 6, vy: 0, life: 30, w: 16, h: 16, dmg: Math.max(1, Math.round(d * 0.6)), style: 'metal', pierce: true, back: true,
        paint(ctx, x, y, s) { art.ring(ctx, '#8d99ae', x, y, 6); art.ring(ctx, '#e0e6f0', x, y, 4); const a = s.t * 0.9; for (let i = 0; i < 4; i++) art.rect(ctx, '#ffffff', Math.round(x + Math.cos(a + i * 1.57) * 6), Math.round(y + Math.sin(a + i * 1.57) * 6), 1, 1); } });
    },
    mika(p, z, d) {   // twin crescents, one high, one low
      sfx('swing');
      [-30, -12].forEach(off => shot(p, z, { x: p.x + p.face * 12, y: p.y + off, vx: p.face * 5.6, vy: 0, life: 20, w: 12, h: 10, dmg: Math.max(1, Math.round(d * 0.55)), style: 'moon',
        paint(ctx, x, y, s) { const f = s.vx > 0 ? 1 : -1; art.rect(ctx, '#ffffff', x, y - 4, 2, 9); art.rect(ctx, '#b8c0ff', x - f * 2, y - 3, 2, 7); art.rect(ctx, '#7a80c0', x - f * 4, y - 1, 2, 3); } }));
    },
    oda(p, z, d) {   // the bell tolls: a ring that throws everything back
      const x = p.x, y = p.y - 20; sfx('heavy');
      for (let i = 0; i < 3; i++) fx.ring(x, y, i ? '#ffd08a' : '#ffffff', 6 + i * 6, 52 + i * 8, 14 + i * 3);
      K.emit('sound', x, y, 8);
      z.ents.forEach(e => { if (!e.hittable || e.team !== 'enemy' || e.dead) return; if (Math.abs(e.x - x) < 58 && Math.abs(e.y - p.y) < 50) strike(p, e.x - 8, e.y - e.h, 16, e.h, d, { kx: Math.sign(e.x - x || p.face) * 3.6, ky: -2.4, stun: 26, srcX: x }); });
    },
    rook(p, z, d) {   // a clone appears ahead in a puff of smoke and strikes
      const x = p.x + p.face * 40; sfx('swing');
      K.emit('smoke', x, p.y - 16, 10); fx.ghost(p.sheet(), 'a4', 1, x, p.y, p.face < 0);
      z.shots.push(new Act({ x, y: p.y, life: 6, tick(s) { if (s.t === 4) { strike(p, x - 16, p.y - 34, 32, 32, d, { kx: p.face * 2.6, ky: -2, stun: 24 }); K.emit('impact', x, p.y - 18, 6); } } }));
    }
  };

  // ================= the combos =================
  // each ninja's combo is a copy of the one they borrowed, so the shared sets (and every other hero) stay as they were.
  // Extra reach was tried for the weapon fighters (Nami, Tarek, Pell, Garo, Isa); in Versus it lifted them 4-8 points of
  // win rate, so the combos keep their original reach and only the look and the finisher are new.
  const REACH = {};
  Object.keys(HR).forEach(id => {
    const h = HR[id];
    if (!h.clan || !FIN[id] || !C[h.combo]) return;
    const style = K.styleOf(id), key = 'clan_' + id;
    C[key] = C[h.combo].map((a, i, all) => {
      const c = Object.assign({}, a, { el: style, clan: id });
      if (REACH[id] && i > 0) c.box = [a.box[0], a.box[1], a.box[2] + REACH[id], a.box[3]];
      if (i === all.length - 1) c.fin = true;
      return c;
    });
    h.combo = key;
  });

  // ================= on the frame a hit lands =================
  const _up = P.update; P.update = function (g, z) {
    const r = _up.apply(this, arguments);
    const s = this.state, a = this.atk;
    if ((s !== 'attack' && s !== 'airatk') || !a || this.st !== a.hitAt || !g.state) return r;
    const h = g.hero();
    if (!h || !h.clan) return r;
    const style = a.el || K.styleOf(h.id || g.state.hero), b = boxOf(this, a);
    // the element along the swing
    for (let i = 0; i < 5; i++) K.add(style, b.x + rand(0, b.w), b.y + rand(0, b.h), this.face * rand(0.6, 2.2), rand(-1.2, 0.6));
    if (a.fin && FIN[a.clan]) { const d = Math.max(2, Math.round((a.dmg || 8) * 0.25 * (this.comboMul ? this.comboMul() : 1))); FIN[a.clan](this, z || g.zone, d, h); K.cast(this, style, 1); }
    return r;
  };

  SW.clanmelee = { FIN };
})();
