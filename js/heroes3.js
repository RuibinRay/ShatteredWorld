'use strict';
// Shattered Worlds — second expansion: wind / lava / bomb / ninja abilities, a distinct ultimate sequence for
// every elemental hero, element-coloured hit effects, four more unlock achievements, and the 10-hero select grid.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, W = SW.W, H = SW.H, text = SW.text;
  const Proj = SW.Proj, Wolf = SW.Wolf, Dragon = SW.Dragon, boom = SW.boom, puff = SW.puff, near = SW.near, CASTS = SW.casts;
  // direct damage to one target (used by ultimates)
  const hurt = (e, dmg, o) => { const b = e.box(), atk = Object.assign({ team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg, kx: 0, ky: -2, stun: 24, energy: true, heavy: true, hitSet: new Set(), quiet: true }, o || {}); if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); };

  // ---------- summons ----------
  class Twister {   // travelling tornado: juggles whatever it touches
    constructor(x, y, dir, dmg, o) { Object.assign(this, { x, y, vx: dir * 2.3, dmg, w: 34, h: 72, life: 130, t: 0, col: '#7dffb2', hitSet: new Set() }, o || {}); SW.audio.sfx('dash'); }
    update(g, z) {
      this.t++; this.x += this.vx;
      if (--this.life <= 0 || this.x < -60 || this.x > z.pw + 60) { this.gone = true; return; }
      if (this.t % (this.rehit || 8) === 0) this.hitSet.clear();
      SW.strike(g, { team: 'player', x: this.x - this.w / 2, y: this.y - this.h, w: this.w, h: this.h, dmg: this.dmg, kx: Math.sign(this.vx) * 0.6, ky: -3.4, stun: 26, energy: true, breaker: true, hitSet: this.hitSet, srcX: this.x - Math.sign(this.vx) * 10, quiet: true });
      if (this.t % 2 === 0) fx.list.push({ k: 'p', x: this.x + SW.rand(-this.w / 2, this.w / 2), y: this.y - SW.rand(0, this.h), vx: SW.rand(-1.5, 1.5), vy: -1.4, g: 0, life: 14, max: 14, col: this.t % 4 ? this.col : '#ffffff', s: 2 });
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), n = Math.round(this.h / 6);
      for (let i = 0; i < n; i++) { const k = i / n, w = Math.round(6 + k * this.w), off = Math.round(Math.sin(this.t * 0.35 + i * 0.9) * (3 + k * 6)); art.rect(ctx, i % 2 ? this.col : '#eafff4', x - w / 2 + off, y - i * 6 - 5, w, 4); art.rect(ctx, '#ffffff', x - w / 2 + off + 2, y - i * 6 - 5, Math.max(2, w / 3), 1); }
      art.glow(ctx, x, y - this.h / 2, Math.round(this.w * 0.8), this.col, 0.08);
    }
  }
  class Pool {      // burning lava left on the ground
    constructor(x, y, w, life, dmg) { Object.assign(this, { x, y, w, life, dmg, t: 0, set: false }); }
    update(g, z) {
      this.t++;
      if (!this.set) { let n = 0; while (!z.hit(this.x - 2, this.y, 4, 2, true) && n++ < 40) this.y += 2; this.set = true; }
      if (--this.life <= 0) { this.gone = true; return; }
      if (this.t % 18 === 0) SW.strike(g, { team: 'player', x: this.x - this.w / 2, y: this.y - 12, w: this.w, h: 14, dmg: this.dmg, kx: 0, stun: 10, energy: true, status: { burn: 3 }, hitSet: new Set(), srcX: this.x, quiet: true });
      if (this.t % 6 === 0) puff(this.x + SW.rand(-this.w / 2, this.w / 2), this.y - 3, this.t % 12 ? '#ff5a1f' : '#ffd27a');
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), a = Math.min(1, this.life / 30);
      ctx.globalAlpha = a; art.rect(ctx, '#ff5a1f', x - this.w / 2, y - 3, this.w, 3); art.rect(ctx, '#ffd27a', x - this.w / 2 + 3, y - 4, this.w - 6, 1); art.rect(ctx, '#ffffff', x - this.w / 2 + ((this.t * 5) % this.w), y - 5, 2, 2); ctx.globalAlpha = 1;
      art.glow(ctx, x, y - 2, Math.round(this.w / 2), '#ff5a1f', 0.1 * a);
    }
  }
  class Geyser {    // a column erupting from the floor (dmg 0 = effect only)
    constructor(x, y, dmg, col) { Object.assign(this, { x, y, dmg, t: 0, col: col || '#ff5a1f' }); this.hz = { x, half: 16, at: 6 }; }   // hz: where and when it erupts (js/hardcore.js reads it)
    update(g) {
      this.t++;
      if (this.t === 6) { SW.audio.sfx('burst'); fx.shake(3, 6); if (this.dmg) SW.strike(g, { team: 'player', x: this.x - 16, y: this.y - 96, w: 32, h: 96, dmg: this.dmg, kx: 0, ky: -7.5, stun: 40, energy: true, heavy: true, status: { burn: 4 }, hitSet: new Set(), srcX: this.x, quiet: true }); }
      if (this.t > 26) this.gone = true;
      if (this.t > 4 && this.t < 22) for (let i = 0; i < 2; i++) fx.list.push({ k: 'p', x: this.x + SW.rand(-8, 8), y: this.y - SW.rand(0, 80), vx: SW.rand(-1, 1), vy: -2.5, g: 0.2, life: 16, max: 16, col: i ? '#ffffff' : this.col, s: 2 });
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), h = this.t < 6 ? 0 : Math.max(0, 90 - Math.max(0, this.t - 14) * 8);
      if (this.t < 6) { art.rect(ctx, '#ffffff', x - 12, y - 2, 24, 2); return; }
      art.rect(ctx, this.col, x - 10, y - h, 20, h); art.rect(ctx, art.shade(this.col, 1.5), x - 5, y - h, 10, h); art.rect(ctx, '#ffffff', x - 2, y - h, 4, Math.round(h * 0.7));
      art.glow(ctx, x, y - Math.round(h / 2), 30, this.col, 0.12);
    }
  }
  class Mine {      // proximity mine
    constructor(x, y, dmg) { Object.assign(this, { x, y, dmg, t: 0, life: 1200, isMine: true }); }
    update(g, z) { this.t++; if (--this.life <= 0) { this.gone = true; return; } if (this.t > 30 && near(z, this.x, this.y - 8, 34)) { this.gone = true; boom(this.x, this.y - 8, 42, this.dmg, '#f5c542'); } }
    draw(ctx, cam) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y); art.rect(ctx, '#3a3a30', x - 5, y - 4, 10, 4); art.rect(ctx, '#6a6a58', x - 4, y - 5, 8, 1); art.rect(ctx, this.t > 30 && this.t % 30 < 15 ? '#ff5a5a' : '#5a1a1a', x - 1, y - 7, 2, 2); }
  }
  class Rusher {    // drags its owner in a straight line through enemies, cutting as it goes
    constructor(p, dmg) { Object.assign(this, { p, dmg, t: 0, dir: p.face, hitSet: new Set() }); SW.audio.sfx('dash'); }
    update(g, z) {
      const p = this.p; this.t++;
      if (this.t > 14 || p.dead) { this.gone = true; return; }
      p.iframes = Math.max(p.iframes, 3); p.vy = -SW.GRAV;
      for (let s = 0; s < 8; s++) { if (z.hit(p.x + this.dir - p.w / 2, p.y - p.h, p.w, p.h)) break; p.x += this.dir; }
      if (this.t % 4 === 1) this.hitSet.clear();
      SW.strike(g, { team: 'player', x: p.x - 22, y: p.y - 36, w: 44, h: 38, dmg: this.dmg, kx: this.dir * 1.2, ky: -1.5, stun: 26, energy: true, breaker: true, hitSet: this.hitSet, srcX: p.x - this.dir * 10, quiet: true });
      fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, p.face < 0);
      if (this.t % 3 === 0) fx.slash(p.x, p.y - 18, this.dir, (this.t / 3 | 0) % 2 + 1, g.hero().colorHi, 26);
    }
    draw() {}
  }
  Object.assign(SW, { Twister, Pool, Geyser, Mine });

  const R = {
    crescent(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; for (let i = -8; i <= 8; i++) { const o = Math.round((64 - i * i) / 12); art.rect(ctx, Math.abs(i) < 5 ? '#ffffff' : '#7dffb2', x + (o - 3) * d, y + i, 3, 1); } art.glow(ctx, x, y, 12, '#7dffb2', 0.12); },
    glob(ctx, x, y) { art.disc(ctx, '#ff5a1f', x, y, 5); art.disc(ctx, '#ffd27a', x, y - 1, 3); art.rect(ctx, '#ffffff', x - 1, y - 2, 2, 2); art.glow(ctx, x, y, 12, '#ff5a1f', 0.14); },
    bomb(ctx, x, y, p) { art.disc(ctx, '#1c1c24', x, y, 5); art.disc(ctx, '#4a4a5a', x - 1, y - 1, 2); art.rect(ctx, '#8a6a3a', x + 2, y - 7, 2, 3); art.rect(ctx, p.t % 4 < 2 ? '#ffd24a' : '#ff5a1f', x + 3, y - 9, 2, 2); },
    rocket(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; art.rect(ctx, '#c8ccd8', x - 8, y - 3, 16, 6); art.rect(ctx, '#d83a3a', d > 0 ? x + 6 : x - 10, y - 3, 4, 6); art.rect(ctx, '#5a6078', d > 0 ? x - 10 : x + 7, y - 5, 3, 10); art.rect(ctx, '#ffd24a', d > 0 ? x - 14 : x + 10, y - 2, 4, 4); art.glow(ctx, x - d * 12, y, 10, '#ff8a3a', 0.16); },
    star(ctx, x, y, p) { if ((p.t >> 1) % 2) { art.rect(ctx, '#d8e0f0', x - 4, y - 1, 8, 2); art.rect(ctx, '#d8e0f0', x - 1, y - 4, 2, 8); } else for (let i = -3; i <= 3; i++) { art.rect(ctx, '#d8e0f0', x + i, y + i, 2, 1); art.rect(ctx, '#d8e0f0', x + i, y - i, 2, 1); } art.rect(ctx, '#ff4d7a', x - 1, y - 1, 2, 2); },
    meteor(ctx, x, y) { art.disc(ctx, '#ff7043', x, y, 7); art.disc(ctx, '#ffd24a', x, y, 5); art.disc(ctx, '#ffffff', x, y, 2); art.glow(ctx, x, y, 20, '#ff7043', 0.15); }
  };

  // ---------- abilities ----------
  Object.assign(CASTS, {
    wind_blade(p, z, dmg, up) { SW.audio.sfx('swing'); z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 20, vx: p.face * 7.4, vy: up ? -4 : 0, dmg, w: 16, h: 20, life: 38, pierce: true, maxHits: 3, kx: 3, render: R.crescent, think() { if (this.t % 2 === 0) puff(this.x - this.vx, this.y, '#eafff4', 1, 0.3); } })); },
    updraft(p, z, dmg) {
      const x = p.x + p.face * 26; SW.audio.sfx('dash'); fx.ring(x, p.y - 20, '#7dffb2', 4, 30, 14);
      for (let i = 0; i < 18; i++) fx.list.push({ k: 'p', x: x + SW.rand(-16, 16), y: p.y - SW.rand(0, 20), vx: SW.rand(-0.4, 0.4), vy: -SW.rand(2.5, 5), g: 0, life: 18, max: 18, col: i % 2 ? '#7dffb2' : '#ffffff', s: 2 });
      SW.strike(G, { team: 'player', x: x - 24, y: p.y - 70, w: 48, h: 70, dmg, kx: 0, ky: -9, stun: 50, energy: true, heavy: true, launch: true, hitSet: new Set(), srcX: p.x, quiet: true });
    },
    cyclone(p, z, dmg) { z.shots.push(new Twister(p.x + p.face * 20, p.y, p.face, dmg)); },
    magma_glob(p, z, dmg, up) { SW.audio.sfx('swing'); z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 24, vx: p.face * (up ? 3 : 4.4), vy: up ? -6 : -3.4, g: 0.24, dmg: Math.round(dmg * 0.6), w: 12, h: 12, life: 90, status: { burn: 3 }, render: R.glob,
      think() { if (this.t % 2 === 0) puff(this.x, this.y, '#ff5a1f'); }, onEnd(g, zz) { boom(this.x, this.y, 24, Math.round(dmg * 0.5), '#ff5a1f', { burn: 3 }); zz.shots.push(new Pool(this.x, this.y - 6, 40, 200, Math.max(2, Math.round(dmg * 0.2)))); } })); },
    lava_geyser(p, z, dmg) { z.shots.push(new Geyser(p.x + p.face * 34, p.y, dmg)); },
    molten_wave(p, z, dmg) {
      SW.audio.sfx('burst'); fx.shake(3, 8);
      const s = new SW.Shot({ kind: 'wave', team: 'player', x: p.x + p.face * 16, y: p.y - 18, fy: p.y, vx: p.face * 4.6, dmg, life: 56, w: 22, h: 36, col: '#ff5a1f', energy: true, breaker: true, pierce: true, heavy: true, kx: 3, ky: -3, down: true, stun: 30 });
      z.shots.push(s);
      z.shots.push({ t: 0, update(g, zz) { this.t++; if (s.gone || this.t > 60) { this.gone = true; return; } if (this.t % 9 === 0) zz.shots.push(new Pool(s.x, s.fy - 4, 34, 160, Math.max(2, Math.round(dmg * 0.12)))); }, draw() {} });
    },
    grenade(p, z, dmg, up) { SW.audio.sfx('swing'); z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 24, vx: p.face * (up ? 2.8 : 4.2), vy: up ? -6.4 : -3.8, g: 0.26, dmg: Math.round(dmg * 0.4), w: 12, h: 12, life: 80, ghost: true, render: R.bomb,
      think(g, zz) {
        if (this.vy > 0 && zz.hit(this.x - 3, this.y + 4, 6, 3, true)) { if (this.bounced) this.life = 1; else { this.bounced = true; this.vy = -Math.abs(this.vy) * 0.5; this.vx *= 0.6; SW.audio.sfx('land'); } }
        if (zz.hit(this.x + Math.sign(this.vx) * 6 - 2, this.y - 2, 4, 4, true)) this.vx = -this.vx * 0.5;
      }, onEnd() { boom(this.x, this.y, 36, Math.round(dmg * 0.8), '#f5c542'); } })); },
    mine(p, z, dmg) { const m = z.shots.filter(s => s.isMine); if (m.length >= 3) m[0].gone = true; z.shots.push(new Mine(p.x + p.face * 10, p.y, dmg)); SW.audio.sfx('land'); },
    rocket(p, z, dmg) { SW.audio.sfx('shoot'); SW.audio.sfx('dash'); p.vx = -p.face * 2.5; z.shots.push(new Proj({ x: p.x + p.face * 16, y: p.y - 20, vx: p.face * 8, dmg: Math.round(dmg * 0.4), w: 16, h: 10, life: 70, breaker: true, heavy: true, kx: 4, render: R.rocket,
      think() { puff(this.x - this.vx * 1.5, this.y, this.t % 2 ? '#c8ccd8' : '#ff8a3a', 1, 0.4); }, onEnd() { boom(this.x, this.y, 46, Math.round(dmg * 0.8), '#f5c542', null, { breaker: true }); } })); },
    star_volley(p, z, dmg, up) { SW.audio.sfx('swing'); [-0.16, 0, 0.16].forEach(a => { const ang = (up ? -0.6 : 0) + a; z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 22, vx: p.face * Math.cos(ang) * 8, vy: Math.sin(ang) * 8, dmg, w: 10, h: 10, life: 34, kx: 1, render: R.star })); }); },
    smoke_step(p, z, dmg) {
      const smoke = (x, y) => { for (let i = 0; i < 12; i++) fx.list.push({ k: 'p', x: x + SW.rand(-8, 8), y: y - SW.rand(0, 30), vx: SW.rand(-1, 1), vy: SW.rand(-0.8, 0.2), g: -0.01, life: 22, max: 22, col: i % 3 ? '#5a6078' : '#c8ccd8', s: 3, a: 0.8 }); };
      const e = near(z, p.x, p.y - 16, 220), side = e && e.x >= p.x ? 1 : -1;
      smoke(p.x, p.y); SW.audio.sfx('dash');
      let tx = e ? e.x + side * 22 : p.x + p.face * 90;
      if (z.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) tx = e ? e.x - side * 22 : p.x;
      if (!z.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) p.x = tx;
      if (e) p.face = e.x >= p.x ? 1 : -1;
      p.iframes = Math.max(p.iframes, 14); smoke(p.x, p.y); fx.slash(p.x + p.face * 10, p.y - 20, p.face, 1, '#ffd0dc', 34); SW.audio.sfx('heavy');
      SW.strike(G, { team: 'player', x: p.x - 34, y: p.y - 44, w: 68, h: 46, dmg, kx: p.face * 4, ky: -3, stun: 34, energy: true, heavy: true, down: true, hitSet: new Set(), srcX: p.x - p.face * 8, quiet: true });
    },
    phantom_rush(p, z, dmg) { z.shots.push(new Rusher(p, dmg)); }
  });

  // ---------- ultimates: each runs over the ~70 frames of the "ult" state ----------
  const cols = () => G.cam.x + SW.rand(20, W - 20);
  const ULT = {
    hurricane(p, z, foes, dmg) { if (p.st === 10) { fx.flash('#eafff4', 8); fx.shake(6, 30); for (const d of [-1, 1]) z.shots.push(new Twister(p.x + d * 20, p.y, d, dmg, { vx: d * 2.4, w: 70, h: 190, life: 150, rehit: 5 })); } },
    eruption(p, z, foes, dmg) {
      if (p.st === 8) { fx.flash('#ffd27a', 8); SW.audio.sfx('roar'); }
      if (p.st >= 10 && p.st <= 58 && p.st % 6 === 4) { const i = (p.st - 10) / 6 | 0; z.shots.push(new Geyser(G.cam.x + 30 + ((i * 5) % 8) * 60, p.y, dmg)); if (i % 2 === 0) foes.forEach(e => z.shots.push(new Geyser(e.x, p.y, dmg))); fx.shake(4, 6); }
    },
    carpet_bomb(p, z, foes, dmg) {
      if (p.st === 6) SW.audio.sfx('roar');
      if (p.st >= 8 && p.st <= 62 && p.st % 4 === 0) { const tg = foes.length && p.st % 8 === 0 ? foes[(p.st / 8 | 0) % foes.length] : null, x = tg ? tg.x + SW.rand(-8, 8) : cols();   // every other bomb is aimed, and drifts after its target
        z.shots.push(new Proj({ x, y: G.cam.y + 20, vy: 5, g: 0.12, dmg: Math.round(dmg * 0.4), w: 12, h: 12, life: 90, render: R.bomb, think() { if (tg && !tg.dead) this.x += Math.max(-1.6, Math.min(1.6, tg.x - this.x)); }, onEnd() { boom(this.x, this.y, 42, dmg, '#f5c542'); } })); }
    },
    thousand_cuts(p, z, foes, dmg) {
      if (p.st === 6) { fx.flash('#1a0a14', 10); SW.audio.sfx('dash'); }
      if (p.st >= 8 && p.st <= 60 && p.st % 6 === 2) { foes.forEach((e, i) => { const s = ((p.st / 6 | 0) + i) % 2 ? 1 : -1, b = e.box(); fx.ghost(p.sheet(), 'a4', 1, e.x - s * 18, e.y, s < 0); fx.slash(b.x + b.w / 2, b.y + b.h / 2, s, (p.st / 6 | 0) % 3 + 1, '#ffd0dc', 30); hurt(e, dmg, { ky: -1.5, stun: 30 }); }); SW.audio.sfx('swing'); }
      if (p.st === 66) { foes.forEach(e => hurt(e, dmg * 3, { ky: -6, down: true })); fx.flash('#ff4d7a', 8); fx.shake(8, 14); SW.audio.sfx('explode'); }
    },
    pack_howl(p, z, foes, dmg) {
      if (p.st === 6) { SW.audio.sfx('roar'); fx.flash('#ece4ff', 8); }
      if (p.st === 10 || p.st === 30) { const d = p.st === 30 ? -p.face : p.face; z.shots.push(new Wolf(p.x + d * 16, p.y, d, Math.round(dmg * 0.35), '#a78bfa')); fx.shake(4, 8); }
      if (p.st >= 12 && p.st <= 60 && p.st % 12 === 0) foes.forEach(e => { const b = e.box(); fx.bolt(b.x + b.w / 2 + SW.rand(-30, 30), G.cam.y - 10, b.x + b.w / 2, b.y + b.h / 2, '#a78bfa'); hurt(e, Math.round(dmg * 0.5), { status: { freeze: 30 } }); });
    },
    absolute_zero(p, z, foes, dmg) {
      if (p.st === 10) { fx.flash('#e6fbff', 14); SW.audio.sfx('perfect'); fx.shake(5, 20); foes.forEach(e => { hurt(e, dmg * 2, { ky: 0, status: { freeze: 150 } }); z.shots.push(new Geyser(e.x, e.y, 0, '#7fd8ff')); }); for (let i = 0; i < 40; i++) fx.list.push({ k: 'p', x: G.cam.x + SW.rand(0, W), y: G.cam.y + SW.rand(0, H), vx: SW.rand(-0.5, 0.5), vy: 0.6, g: 0, life: 50, max: 50, col: '#ffffff', s: 2 }); }
      if (p.st === 48) { fx.flash('#ffffff', 8); fx.shake(9, 16); SW.audio.sfx('explode'); foes.forEach(e => { const b = e.box(); fx.debris(b.x + b.w / 2, b.y + b.h / 2, '#bfefff', 12); hurt(e, dmg * 4, { ky: -5, down: true }); }); }
    },
    world_breaker(p, z, foes, dmg) {
      if (p.st === 8) { SW.audio.sfx('roar'); fx.shake(9, 50); for (const d of [-1, 1]) z.shots.push(new Dragon(p.x + d * 10, p.y, d, Math.round(dmg * 0.5))); }
      if (p.st >= 12 && p.st <= 52 && p.st % 10 === 2) foes.forEach(e => { fx.debris(e.x, e.y, '#a89a80', 10); z.shots.push(new Geyser(e.x, e.y, 0, '#8a7a5a')); hurt(e, dmg, { ky: -7, stun: 40 }); });
    },
    supernova(p, z, foes, dmg) {
      if (p.st === 10) { boom(p.x, p.y - 16, 70, dmg * 2, '#ff7043', { burn: 5 }); fx.flash('#ffe0a8', 10); }
      if (p.st >= 16 && p.st <= 58 && p.st % 6 === 4) { const x = foes.length ? foes[(p.st / 6 | 0) % foes.length].x + SW.rand(-12, 12) : cols(); z.shots.push(new Proj({ x: x - 78, y: G.cam.y + 20, vx: 2.4, vy: 5.5, dmg: Math.round(dmg * 0.5), w: 16, h: 16, life: 90, status: { burn: 4 }, render: R.meteor, think() { puff(this.x, this.y, '#ff7043', 2); }, onEnd() { boom(this.x, this.y, 40, Math.round(dmg * 0.7), '#ff7043', { burn: 4 }); } })); }
    }
  };
  SW.ultFx = function (p, g, z, foes) { const h = g.hero(), f = ULT[h.ultimate]; if (!f) return false; f(p, z, foes, Math.round(D.abilities[h.ultimate].dmg * p.specMul())); return true; };

  // ---------- ultimate cut-in: a band of splash art crosses the screen when an ultimate starts ----------
  // Art: assets/bg/ult_<hero>.png, 520x260 (prompts in tools/higgsfield-ults.json). CUT_Y is the row of each picture
  // that sits in the middle of the band, so the eyes stay in view. Without a picture the band is plain colour.
  const CUT_LEN = 56, CUT_H = 100, CUT_Y = { kael: 138, nyra: 120, fenn: 120, isolde: 124, brakk: 116, pyra: 112, gale: 142, ashka: 116, dyna: 126, vesper: 122, maren: 196, moro: 200, sable: 145, thorne: 100, isa: 145, garo: 118, mika: 85, coda: 105, vesna: 105, zara: 105, hart: 110, elixa: 85, tor: 85, opal: 105, ryo: 115, itsuki: 135 };
  D.heroOrder.forEach(id => { const im = new Image(); im.onload = () => { art.bg['ult_' + id] = im; }; im.src = 'assets/bg/ult_' + id + '.png'; });
  let cut = null;
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    if (p.st === 1) {
      const v = SW.versus, o = v && v.mode === 'duel' ? v.duelO : null;
      // veil: a story duel that renames its rival (rivalName) is hiding who it is, so that rival's cut-in shows no portrait
      cut = { id: g.state.hero, face: p.face, start: SW.frame, veil: o && o.rivalName && v.cur && v.cur.i === 1 ? String(o.rivalName) : '' };   // veil holds the name to show instead
      g.hitstop = Math.max(g.hitstop, 24);   // the fight holds its breath
    }
    return _uf(p, g, z, foes);
  };
  SW.drawCutin = function (ctx) {
    if (!cut) return;
    const t = SW.frame - cut.start;
    if (t < 0 || t >= CUT_LEN) { cut = null; return; }
    const h = D.heroes[cut.id], im = cut.veil ? null : art.bg['ult_' + cut.id], d = cut.face, col = cut.veil ? '#8a92a8' : h.color, hi = cut.veil ? '#e8ecf4' : h.colorHi;
    const inn = 1 - Math.pow(1 - Math.min(1, t / 8), 3), out = SW.clamp((t - (CUT_LEN - 10)) / 10, 0, 1);
    const bh = Math.max(2, Math.round(CUT_H * (1 - out) / 2) * 2), by = Math.round(H / 2 - 12 - bh / 2);
    const off = Math.round((1 - inn) * W) * -d, x0 = Math.max(0, off), x1 = Math.min(W, off + W);   // slides in from behind the hero
    ctx.globalAlpha = 0.55 * Math.min(1, t / 6) * (1 - out); art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, by, x1 - x0, bh); ctx.clip();
    art.rect(ctx, art.shade(col, 0.25), 0, by, W, bh);
    if (im) {
      const sy = SW.clamp(Math.round((CUT_Y[cut.id] || im.height / 2) - bh / 2), 0, im.height - bh), sx = SW.clamp(20 - Math.round((t - CUT_LEN / 2) * 0.5), 0, im.width - W);
      if (d > 0) ctx.drawImage(im, sx, sy, W, bh, off, by, W, bh);
      else { ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); ctx.drawImage(im, sx, sy, W, bh, -off, by, W, bh); ctx.restore(); }   // the art faces right; mirror it for a hero facing left
    }
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 7; i++) { const lx = ((t * 30 + i * 131) % (W + 160)) - 80; art.rect(ctx, i % 2 ? hi : '#ffffff', d > 0 ? lx : W - lx - 70, by + 6 + (i * 37) % Math.max(1, bh - 12), 70, 1); }
    if (t < 5) { ctx.globalAlpha = 0.8 * (1 - t / 5); art.rect(ctx, '#ffffff', 0, by, W, bh); }
    ctx.globalAlpha = 1;
    if (t > 5) {
      const name = D.abilities[h.ultimate].name.toUpperCase(), sc = SW.textW(name) * 3 > 250 ? 2 : 3, k = 1 - Math.pow(1 - Math.min(1, (t - 5) / 8), 3);
      const sub = cut.veil || h.title, tw = Math.max(SW.textW(name) * sc, SW.textW(sub)), tx = d > 0 ? 12 + Math.round((1 - k) * 30) : W - 12 - Math.round((1 - k) * 30), ty = by + bh - 6 - 7 * sc, al = d > 0 ? 'left' : 'right';
      ctx.globalAlpha = 0.6 * (1 - out) * k; art.rect(ctx, '#05060c', d > 0 ? tx - 12 : tx - tw - 8, ty - 15, tw + 20, 15 + 7 * sc + 6);
      ctx.globalAlpha = (1 - out) * k;   // (it slides in already on screen, fading up: it used to start past the edge, clipped)
      text(ctx, sub, tx, ty - 11, hi, { align: al });
      text(ctx, name, tx, ty, '#ffffff', { align: al, scale: sc });
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    art.rect(ctx, hi, x0, by - 2, x1 - x0, 2); art.rect(ctx, hi, x0, by + bh, x1 - x0, 2);
    art.rect(ctx, col, x0, by - 3, x1 - x0, 1); art.rect(ctx, col, x0, by + bh + 2, x1 - x0, 1);
  };
  const _hud = ui.hud; ui.hud = function (ctx, g) { _hud(ctx, g); SW.drawCutin(ctx); };   // story; Versus calls it from its own HUD

  // ---------- element-coloured sparks on every skill hit ----------
  const EL = { Fire: ['#ff7043', '#ffd24a'], Ice: ['#bfefff', '#ffffff'], 'Ice blade': ['#bfefff', '#ffffff'], Earth: ['#a89a80', '#6b5a3a'], Thunder: ['#a78bfa', '#ffffff'], Lightning: ['#ffd24a', '#ffffff'], Wind: ['#7dffb2', '#ffffff'], Lava: ['#ff5a1f', '#ffd27a'], Bombs: ['#f5c542', '#8a92a8'], Ninja: ['#ff4d7a', '#ffd0dc'] };
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh(atk, e, b);
    const c = EL[G.hero().element];
    if (c && atk.energy) { const x = b.x + b.w / 2, y = b.y + b.h / 2; for (let i = 0; i < 5; i++) fx.list.push({ k: 'p', x, y, vx: SW.rand(-2, 2), vy: SW.rand(-2.5, 0.5), g: 0.1, life: 16, max: 16, col: c[i % 2], s: 2 }); }
  };

  // ---------- achievements for the new heroes; awakening + ultimate arrive with the Act 1 boss memory ----------
  function grant() {
    const S = G.state;
    if (!S || G.scene !== 'play' || S.memories.indexOf(G.route() + '_3') < 0) return;
    const h = G.hero();
    if (S.abilities[h.ultimate]) return;
    G.unlock(h.awaken, true); G.unlock(h.ultimate, true); G.toast('Awakening (O) and Ultimate (W + I, full energy) unlocked', h.color);
  }
  const _ms = G.minorShard; G.minorShard = function () { _ms(); if (G.state.minor >= 3) G.achieve('shards_3'); };
  const _xp = G.addXP; G.addXP = function (n) { _xp(n); if (G.scene === 'play' && G.state.level >= 8) G.achieve('level_8'); };
  const _pu = ui.pauseUpdate; ui.pauseUpdate = function (g) { _pu(g); const u = (g.state && g.state.upg) || {}; if (Object.keys(u).reduce((s, k) => s + u[k], 0) >= 5) g.achieve('upg_5'); };
  const _mem = G.memory; G.memory = function (id, then) { _mem(id, then); grant(); };
  const _cg = G.continueGame; G.continueGame = function () { _cg(); grant(); };

  // ---------- hero grid (story select and Versus share it) ----------
  // o: { title, cursors: [index...], colors: [...], tags: [...], open: id => bool }
  ui.heroGrid = function (ctx, o) {
    const bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, o.title, W / 2, 7, '#ffffff', { align: 'center', scale: 2 });
    D.heroOrder.forEach((id, i) => {
      const h = D.heroes[id], x = 8 + (i % 5) * 93, y = 28 + Math.floor(i / 5) * 104, open = o.open(id), img = art.bg['hero_' + id];
      const who = o.cursors.map((c, k) => (c === i ? k : -1)).filter(k => k >= 0);
      ui.panel(ctx, x, y, 90, 100, who.length ? o.colors[who[0]] : '#3a3d55', 0.85);
      if (img) { ctx.globalAlpha = open ? (who.length ? 1 : 0.55) : 0.14; ctx.drawImage(img, 4, 14, 88, 98, x + 1, y + 1, 88, 98); ctx.globalAlpha = 1; }
      else art.draw(ctx, h.sheet, 'idle', 0, x + 45, y + 90, false, { alpha: open ? 1 : 0.3 });
      ctx.globalAlpha = 0.78; art.rect(ctx, '#05060c', x + 1, y + 80, 88, 19); ctx.globalAlpha = 1;
      text(ctx, open ? h.name.toUpperCase() : 'LOCKED', x + 45, y + 81, open ? (who.length ? h.color : '#c8ccd8') : '#ff5a5a', { align: 'center' });
      text(ctx, open ? h.element : '? ? ?', x + 45, y + 90, open ? h.color : '#5a6078', { align: 'center' });
      who.forEach(k => { if (o.tags[k]) { ui.panel(ctx, x + 2 + k * 66, y + 2, 20, 11, o.colors[k], 0.9); text(ctx, o.tags[k], x + 12 + k * 66, y + 4, '#ffffff', { align: 'center' }); } });
    });
  };
  ui.drawCode = function (ctx, code) {
    ctx.globalAlpha = 0.82; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    ui.panel(ctx, 116, 80, 248, 108, '#f5c542');
    text(ctx, 'UNLOCK ALL HEROES', W / 2, 90, '#f5c542', { align: 'center', scale: 2 });
    text(ctx, 'Type the 4-digit code.', W / 2, 114, '#ffffff', { align: 'center' });
    text(ctx, 'No code? Ask the author.', W / 2, 125, '#8a92b8', { align: 'center' });
    for (let k = 0; k < 4; k++) { const bx = 180 + k * 32; ui.panel(ctx, bx, 138, 24, 26, code.length === k && SW.frame % 40 < 24 ? '#ffffff' : '#8a92b8', 0.9); if (code[k]) text(ctx, code[k], bx + 12, 144, '#ffffff', { align: 'center', scale: 2 }); }
    text(ctx, 'Backspace: delete    Esc: cancel', W / 2, 172, '#5a6078', { align: 'center' });
  };
  // moves a grid cursor with one player's directional presses; returns the new index
  ui.gridMove = function (i, l, r, u, d) { const n = D.heroOrder.length; if (l) i = (i + n - 1) % n; if (r) i = (i + 1) % n; if (u || d) i = (i + 5) % n; return i; };

  ui.selectUpdate = function (g) {
    const s = ui.sel, keys = I.keys.splice(0), prof = SW.profile;
    if (s.msgT > 0) s.msgT--;
    if (s.i >= D.heroOrder.length) s.i = 0;
    if (typeof s.code === 'string') {
      for (const k of keys) { if (/^[0-9]$/.test(k) && s.code.length < 4) { s.code += k; SW.audio.sfx('move'); } else if (k === 'Backspace') s.code = s.code.slice(0, -1); }
      if (I.hit('pause')) { s.code = null; SW.audio.sfx('back'); }
      else if (s.code.length === 4) {
        if (SW.codeHash(s.code) === D.unlockHash) { prof.all = true; SW.saveProfile(); s.code = null; s.msg = 'ALL HEROES UNLOCKED'; s.msgT = 240; SW.audio.sfx('level'); SW.audio.sfx('shard'); }
        else { s.code = ''; s.msg = 'Wrong code. Ask the author for it.'; s.msgT = 180; SW.audio.sfx('deny'); }
      }
      return;
    }
    const ni = ui.gridMove(s.i, I.hit('left'), I.hit('right'), I.hit('up'), I.hit('down'));
    if (ni !== s.i) { s.i = ni; SW.audio.sfx('move'); }
    const id = D.heroOrder[s.i];
    if (I.hit('pause')) { g.scene = 'title'; SW.audio.sfx('back'); }
    else if (I.hit('skill')) { s.code = ''; SW.audio.sfx('select'); }
    else if (I.ok()) {
      if (g.unlocked(id)) { SW.audio.sfx('select'); g.scene = 'prologue'; ui.pro.i = 0; ui.pro.t = 0; }
      else { SW.audio.sfx('deny'); s.msg = 'Locked: ' + D.achievements[D.heroes[id].need].desc + '. Or press U and enter the code.'; s.msgT = 240; }
    }
  };
  ui.drawSelect = function (ctx, g) {
    const s = ui.sel, id = D.heroOrder[s.i] || 'kael', h = D.heroes[id], open = g.unlocked(id);
    ui.heroGrid(ctx, { title: 'WHO WAKES UP?', cursors: [s.i], colors: [open ? h.color : '#ff5a5a'], tags: [''], open: x => g.unlocked(x) });
    if (open) { text(ctx, h.name.toUpperCase() + '  -  ' + h.title, 10, 235, h.color); text(ctx, 'Signature: ' + h.sig + '     ' + (h.route === id ? 'Own story' : 'Plays ' + D.heroes[h.route].name + "'s story"), 10, 245, '#ffffff'); }
    else { text(ctx, 'LOCKED HERO', 10, 235, '#ff5a5a'); text(ctx, 'Unlock: ' + D.achievements[h.need].desc + '.   Every hero is free in Versus.', 10, 245, '#ffffff'); }
    if (s.msgT > 0 && s.msg) text(ctx, s.msg, 10, 257, s.msg.indexOf('UNLOCKED') >= 0 ? '#7dffa0' : '#ff8a8a');
    else text(ctx, 'A D W S: choose    J / Enter: begin    U: unlock code (ask the author)    Esc: back', 10, 257, '#8a92b8');
    if (typeof s.code === 'string') ui.drawCode(ctx, s.code);
  };
})();
