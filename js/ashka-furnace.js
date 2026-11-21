'use strict';
// Shattered Worlds — Ashka's furnace (2026-11-20, the hero-look rework: cool, not cute). Her story: Subject 60, the
// Core Sump furnace's prisoner, who once tended the harbour's deep vents; obsidian armour "cracked with glowing lava
// veins", the chains she broke. Her lava was orange blobs, flat bars and plain columns. Now it is molten rock that
// cools: black glass with glowing cracks, pools that crust over from the edge, vents that open in a ring of cracked
// rock before they blow and throw obsidian shards, a wave with a crusted back and a molten belly, chain links that
// snap. Crisp pixel art (js/pixel-kit.js; the rocks are baked once per angle). Draw-only: every hit, hitbox and timing
// stays as it was. Loaded after js/gale-wind.js.
//   U      Magma Glob: a chunk of obsidian crust with glowing cracks, dripping; it lands as a pool that crusts over
//   S+U    Lava Geyser: a ring of cracked rock glows, then erupts in a crusted column that throws obsidian shards
//   I      Molten Wave: a wave with a dark crusted back and a bright molten belly; the trail it leaves cools to glass
//   S+I    Caldera: she stamps and a broken chain link flies off her gauntlet; every column breaks out of a cracked ring
//   W+O    Magma Bloom: vents that open slowly and pulse like breathing before they blow
//   J      her blows are molten: a crusted arc with a glowing edge, spatter of lava; the last one snaps a chain link
//   S+O    Meltdown: lava drips from her gauntlet, heat shimmer over her      O  Core Form: glowing shackles on her
//          wrists, the floor scorched and cracked under her (both small on purpose: the view stays clear)
//   W+I    Eruption: the floor cracks into a web of glowing veins and every geyser comes up crusted; on the finishing
//          blow (js/ult-grand.js) a furnace door forms in the floor under the target, glows white, and is blown off its
//          hinges on an impact frame
// SW.ashkaFurnace.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj, Pool = SW.Pool, Geyser = SW.Geyser;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !Pool || !Geyser || !CASTS.magma_glob) return;
  const AF = SW.ashkaFurnace = { on: true };
  const isA = g => !!(AF.on && g && g.state && g.state.hero === 'ashka');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0a0608', ob: '#1c1418', ob2: '#3a2c34', ob3: '#5c4a58', r: '#b0280c', o: '#ff5a1f', o2: '#ff8a3a', y: '#ffd27a', w: '#fff4d8', iron: '#4a4448', iron2: '#7a7074' };
  const PAL = [C.out, C.ob, C.ob2, C.ob3, C.r, C.o, C.o2, C.y, C.w, C.iron, C.iron2];

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  const blit = (ctx, cv, x, y, a) => { if (a !== undefined && a <= 0) return; ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore(); };
  // a chunk of obsidian, cracks glowing through it (s its size, turned to ang)
  function rock(ctx, x, y, s, ang, a, hot) {
    const S = Math.max(3, R(s)), step = ((R(ang / (PI / 8)) % 16) + 16) % 16, b = S * 3 + 4;
    const cv = baked('r' + S + '_' + step + (hot ? 'h' : ''), b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.rotate(step * PI / 8);
      const pts = [[-1, -0.55], [-0.2, -1], [0.75, -0.6], [1, 0.25], [0.3, 0.9], [-0.7, 0.7]];
      q.beginPath(); pts.forEach(([px, py], i) => (i ? q.lineTo(px * S, py * S) : q.moveTo(px * S, py * S))); q.closePath(); q.fillStyle = C.ob; q.fill();
      q.beginPath(); q.moveTo(-1 * S, -0.55 * S); q.lineTo(-0.2 * S, -1 * S); q.lineTo(0.1 * S, -0.2 * S); q.closePath(); q.fillStyle = C.ob3; q.fill();   // a glassy facet
      q.strokeStyle = hot ? C.y : C.o; q.lineWidth = Math.max(1, S * 0.18); q.beginPath(); q.moveTo(-0.6 * S, 0.1 * S); q.lineTo(0.05 * S, 0.15 * S); q.lineTo(0.5 * S, -0.35 * S); q.moveTo(0.05 * S, 0.15 * S); q.lineTo(0.2 * S, 0.7 * S); q.stroke();   // the cracks
    }, { pal: PAL, outline: C.out, keepThin: true }));
    blit(ctx, cv, x, y, a);
  }
  function link(ctx, x, y, s, ang, a, broken) {   // a chain link, hot
    const S = Math.max(4, R(s)), step = ((R(ang / (PI / 8)) % 8) + 8) % 8, b = S * 3 + 4;
    const cv = baked('k' + S + '_' + step + (broken ? 'b' : ''), b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.rotate(step * PI / 8); q.lineWidth = Math.max(2, S * 0.4);
      q.strokeStyle = C.iron; q.beginPath(); if (broken) q.ellipse(0, 0, S, S * 0.55, 0, 0.5, PI * 2 - 0.5); else q.ellipse(0, 0, S, S * 0.55, 0, 0, PI * 2); q.stroke();
      q.lineWidth = 1; q.strokeStyle = C.o2; q.beginPath(); q.ellipse(0, -S * 0.08, S * 0.9, S * 0.45, 0, PI * 1.1, PI * 1.9); q.stroke();
      if (broken) { q.fillStyle = C.y; q.fillRect(S * 0.75, -S * 0.4, 2, 2); q.fillRect(S * 0.75, S * 0.25, 2, 2); }
    }, { pal: PAL, outline: C.out, keepThin: true }));
    blit(ctx, cv, x, y, a);
  }
  AF.rock = rock; AF.link = link;
  function ventRing(ctx, x, y, w, k, t) {   // a ring of cracked rock on the floor, glowing as k rises
    const n = 8, glow = k > 0.5 && t % 4 < 2 ? C.y : C.o;
    ctx.save(); ctx.globalAlpha *= 0.4 + k * 0.6;
    art.rect(ctx, C.r, R(x - w / 2), y - 2, R(w), 3); art.rect(ctx, glow, R(x - w * 0.35 * k), y - 2, R(w * 0.7 * k), 2);
    ctx.restore();
    for (let i = 0; i < n; i++) { const an = i / n * PI * 2, rx = x + Math.cos(an) * w / 2, ry = y - 1 + Math.sin(an) * 3; if (Math.sin(an) < 0 || i % 2) rock(ctx, rx, ry, 3, i * 1.3, 1, k > 0.6); }
  }
  // a crusted column of lava: bright core, black crust at its edges (sy the floor, hh tall)
  function column(ctx, sx, sy, hh, w, t) {
    if (hh <= 0) return;
    for (let i = 0; i < hh; i += 4) {
      const f = 0.8 + 0.2 * Math.sin(i * 0.4 + t * 0.6), ww = Math.max(4, R(w * f)), ox = R(Math.sin(i * 0.2 + t * 0.4) * 1.5);
      art.rect(ctx, C.ob, sx - ww / 2 - 1 + ox, sy - i - 4, ww + 2, 4); art.rect(ctx, C.o, sx - ww / 2 + 2 + ox, sy - i - 4, ww - 4, 4); art.rect(ctx, C.y, sx - ww / 4 + ox, sy - i - 4, Math.max(2, R(ww / 2)), 4); art.rect(ctx, C.w, sx - 1 + ox, sy - i - 4, 2, 4);
      if ((i / 4 + R(t / 3)) % 3 === 0) art.rect(ctx, C.ob2, sx - ww / 2 + ox, sy - i - 3, 3, 2);   // crust plates
    }
    art.glow(ctx, sx, sy - hh / 2, w, C.o, 0.14);
  }
  function shards(ctx, x, y, k, n, spread, seed) {   // obsidian shards thrown up and out
    for (let i = 0; i < n; i++) { const s = (i % 2 ? 1 : -1), vx = s * (0.6 + ((i * 37 + seed) % 7) / 7) * spread, vy = 2.2 + ((i * 13 + seed) % 5) * 0.4, px = x + vx * k * 30, py = y - vy * k * 30 + k * k * 46; rock(ctx, px, py, 2.5 + (i % 3), k * 8 * s + i, 1 - ease((k - 0.6) / 0.4), i % 3 === 0); }
  }

  // ================= U: Magma Glob =================
  function dressGlob(z, n0) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.ashka || s.w !== 12 || s.h !== 12 || s.life !== 90 || s.g !== 0.24) return;
      s.ashka = 1;
      s.render = (ctx, x, y, q) => { const t = q.t || 0; rock(ctx, x, y, 6, t * 0.4 * (Math.sign(q.vx) || 1), 1, t % 6 < 3); if (t % 3 === 0) part(q.x - q.vx, q.y + 3, t % 2 ? C.o : C.y, 0, 0.6, 12, 2, 0.15); };
    });
  }
  const _mg = CASTS.magma_glob;
  CASTS.magma_glob = function (p, z) { const n0 = z.shots.length, r = _mg.apply(this, arguments); if (isA(G)) dressGlob(z, n0); return r; };

  // ================= pools: molten in the middle, crusting over from the edge =================
  const _pl = Pool.prototype.draw;
  Pool.prototype.draw = function (ctx, cam) {
    if (!isA(G)) return _pl.apply(this, arguments);
    if (this._max === undefined) this._max = this.life;
    const x = R(this.x - cam.x), y = R(this.y - cam.y), w = this.w, cool = clamp01(1 - this.life / this._max), a = Math.min(1, this.life / 20), molten = Math.max(4, R(w * (1 - cool * 0.85)));
    ctx.save(); ctx.globalAlpha *= a;
    art.rect(ctx, C.out, R(x - w / 2) - 1, y - 4, w + 2, 5); art.rect(ctx, C.ob, R(x - w / 2), y - 3, w, 3); art.rect(ctx, C.ob3, R(x - w / 2) + 2, y - 4, R(w * 0.3), 1);
    art.rect(ctx, C.o, R(x - molten / 2), y - 3, molten, 2); art.rect(ctx, C.y, R(x - molten / 3), y - 3, R(molten * 0.66), 1);
    if ((this.t >> 3) % 3 === 0) art.rect(ctx, C.w, R(x - molten / 2 + ((this.t * 3) % Math.max(1, molten))), y - 4, 2, 1);   // a bubble
    for (let i = 0; i < 3; i++) art.rect(ctx, C.r, R(x - w / 2 + 3 + i * (w / 3)), y - 2, 2, 1);   // cracks in the crust
    ctx.restore();
    art.glow(ctx, x, y - 2, R(molten / 2), C.o, 0.1 * a);
  };

  // ================= S+U: Lava Geyser (and the ultimate's geysers) =================
  const _gd = Geyser.prototype.draw;
  Geyser.prototype.draw = function (ctx, cam) {
    if (!isA(G) || this.col !== '#ff5a1f') return _gd.apply(this, arguments);
    const x = R(this.x - cam.x), y = R(this.y - cam.y);
    if (this.t < 6) { ventRing(ctx, x, y, 26, this.t / 6, this.t); return; }
    const k = this.t - 6, h = Math.max(0, 90 - Math.max(0, this.t - 14) * 8) * Math.min(1, k / 2 + 0.3);
    ventRing(ctx, x, y, 26, 1, this.t);
    column(ctx, x, y, R(h), 18, this.t);
    shards(ctx, x, y - h * 0.8, Math.min(1, k / 20), 6, 1.4, R(this.x));
  };

  // ================= I: Molten Wave: a crusted back, a molten belly =================
  function waveDraw(ctx, cam) {
    const x = R(this.x - cam.x), gy = R((this.fy !== undefined ? this.fy : this.y + 18) - cam.y), d = this.vx >= 0 ? 1 : -1, t = this.t || 0, h = Math.min(34, 10 + t * 5);
    for (let i = 0; i < 9; i++) {   // the mound: front steep, back long
      const u = i / 8, hh = R(h * (u < 0.7 ? u / 0.7 : (1 - u) / 0.3)), xx = x - d * (24 - i * 3.4);
      if (hh < 2) continue;
      art.rect(ctx, C.ob, R(xx) - 2, gy - hh - 2, 5, 3);   // crusted back
      art.rect(ctx, C.o, R(xx) - 2, gy - hh + 1, 5, hh - 1); art.rect(ctx, C.y, R(xx) - 1, gy - R(hh * 0.6), 3, R(hh * 0.6));
      if ((i + (t >> 1)) % 3 === 0) art.rect(ctx, C.ob3, R(xx) - 1, gy - hh - 2, 2, 1);
    }
    art.rect(ctx, C.w, x + d * 2 - 1, gy - R(h * 0.5), 2, R(h * 0.4));   // the bright lip
    art.glow(ctx, x, gy - h / 2, 22, C.o, 0.14);
    if (t % 3 === 0) part(this.x + d * rand(0, 6), (this.fy || this.y) - h, C.y, d * rand(0.5, 1.5), -rand(1, 2.5), 14, 2, 0.2);
  }
  function dressShots(z) { z.shots.forEach(s => { if (s.ashka || s.kind !== 'wave' || s.team !== 'player' || s.col !== '#ff5a1f') return; s.ashka = 1; s.draw = waveDraw; }); }

  // ================= S+I: Caldera: a chain link flies off; columns break out of cracked rings =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.ashka;
  if (BU && BU.cast) {
    const _cd = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _cd.apply(this, arguments);
      if (!isA(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!(s instanceof Vis) || !s.render || s.ashka) return;
        const delay = s.life - 30; if (delay < 1 || delay > 24) return;
        s.ashka = 1; const hMax = delay === 2 ? 40 : 70;
        s.render = (ctx, sx, sy, t) => {
          t = typeof t === 'number' ? t : (s.t || 0);
          if (t < delay) { ventRing(ctx, sx, sy, 28, t / delay, t); return; }
          const k = t - delay, hh = R(hMax * Math.min(1, k / 4) * (k > 22 ? Math.max(0, 1 - (k - 22) / 8) : 1));
          ventRing(ctx, sx, sy, 28, 1, t); column(ctx, sx, sy, hh, 22, t);
          shards(ctx, sx, sy - hh * 0.8, Math.min(1, k / 22), 4, 1.1, R(sx * 7));
        };
      });
      const d = p.face, x0 = p.x, y0 = p.y;
      z.shots.push(new Vis(x0, y0, 34, (ctx, sx, sy, t) => {   // the broken link off her gauntlet
        const k = t / 34; link(ctx, sx + d * (8 + k * 40), sy - 24 - Math.sin(k * PI) * 34 + k * 20, 5, t * 0.5 * d, 1 - ease((k - 0.7) / 0.3), true);
      }));
      return r;
    };
  }

  // ================= W+O: Magma Bloom: vents that breathe, then blow =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.ashka;
  if (SIG && SIG.cast) {
    const _mb = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _mb.apply(this, arguments);
      if (!isA(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint || s.ashka) return;
        const delay = s.life - 24; if (delay < 2 || delay > 30) return;
        s.ashka = 1;
        s.paint = (ctx, sx, sy, q) => {
          const t = q.t;
          if (t < delay) { const breath = 0.5 + 0.5 * Math.sin(t * 0.7); ventRing(ctx, sx, sy, 20, (t / delay) * (0.6 + 0.4 * breath), t); if (breath > 0.8) art.glow(ctx, sx, sy - 3, 10, C.o, 0.16); return; }
          const k = t - delay, hh = R(40 * Math.min(1, k / 3) * (k > 16 ? Math.max(0, (24 - k) / 8) : 1));
          ventRing(ctx, sx, sy, 20, 1, t); column(ctx, sx, sy, hh, 16, t);
          shards(ctx, sx, sy - hh * 0.8, Math.min(1, k / 18), 3, 0.9, R(sx * 3));
        };
      });
      return r;
    };
  }

  // ================= J: molten blows =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (col !== '#ffd27a' || !isA(g) || !p || !z || !z.shots || (p.state !== 'attack' && p.state !== 'airatk')) return _slash.apply(this, arguments);
    const d = dir || p.face, a = p.atk, fin = !!(a && a.fin), Rr = Math.max(12, Math.min(28, (len || 22) * 0.75)), tilt = kind === 2 ? 0.5 : kind === 3 ? -0.5 : 0, life = fin ? 16 : 11;
    z.shots.push(new Vis(x, y, life, (ctx, sx, sy, t) => {
      const k = t / life, sw = ease(Math.min(1, k * 3)), s = R(Rr * 2.8);
      PX.sprite(ctx, sx, sy, s, s, c => {
        c.scale(d, 1); c.rotate(tilt); c.lineCap = 'round';
        const a0 = -1.15, a1 = a0 + 2.3 * sw;
        c.strokeStyle = C.ob; c.lineWidth = fin ? 6 : 5; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr, a0, a1); c.stroke();
        c.strokeStyle = C.o; c.lineWidth = fin ? 3 : 2; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr - 1, a0 + 0.2, a1); c.stroke();
        c.strokeStyle = C.y; c.lineWidth = 1; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr - 2, a1 - 0.7, a1); c.stroke();
      }, { pal: PAL, alpha: 1 - ease((k - 0.45) / 0.55), outline: C.out, keepThin: true });
      if (fin) link(ctx, sx + d * (Rr * 0.7 + ease(k) * 22), sy - 8 - Math.sin(k * PI) * 16, 5, t * 0.6 * d, 1 - ease((k - 0.6) / 0.4), true);
    }));
    for (let i = 0; i < (fin ? 6 : 3); i++) part(x + d * rand(4, 12), y + rand(-6, 6), i % 2 ? C.y : C.o, d * rand(0.5, 2.5), -rand(0.5, 2.5), 16, 2, 0.22);   // spatter
  };

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (behind && p.awakeT > 0) {   // Core Form: the floor scorched and cracked under her
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha *= fade;
      art.rect(ctx, C.ob, sx - 16, sy - 1, 32, 2); for (let i = -3; i <= 3; i++) art.rect(ctx, (t + i) % 8 < 4 ? C.o : C.r, sx + i * 4, sy - 1, 2, 1);
      ctx.restore();
    }
    if (!behind && p.awakeT > 0) {   // glowing shackles on her wrists
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha *= fade;
      [[d * 9, -20], [-d * 5, -19]].forEach(([ox, oy]) => { art.rect(ctx, C.out, sx + ox - 3, sy + oy - 1, 6, 4); art.rect(ctx, C.iron2, sx + ox - 2, sy + oy, 4, 2); art.rect(ctx, t % 10 < 5 ? C.o : C.y, sx + ox - 2, sy + oy + 1, 4, 1); });
      ctx.restore();
    }
    if (!behind && p.modeT > 0) {   // Meltdown: lava drips from her gauntlet; heat shimmer over her
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade * 0.6;
      for (let i = 0; i < 3; i++) { const ph = (t * 0.05 + i / 3) % 1; art.rect(ctx, C.o2, R(sx - 6 + i * 6 + Math.sin(t * 0.3 + i * 2) * 2), R(sy - 44 - ph * 12), 1, 3); }
      ctx.restore();
      if (t % 9 === 0) part(p.x + d * 9, p.y - 16, C.o, 0, 0.5, 18, 2, 0.2);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isA(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isA(g || this.G) && z && z.shots) dressShots(z); return r; };

  // ================= W+I: Eruption =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isA(g) || !z || !z.shots) return r;
    if (p.st === 8) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('ashka') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const x0 = p.x, gy = p.y, seeds = [];
      for (let i = 0; i < 14; i++) seeds.push({ a: (i % 2 ? 1 : -1) * (0.15 + (i * 0.37) % 1) , len: 60 + (i * 53) % 220, br: (i * 29) % 7 });
      const web = new Vis(x0, gy, 600, (ctx, sx, sy) => {   // the floor cracks into a web of glowing veins
        const st = p.st; if (p.state !== 'ult' || st > BU2 + 4) return;
        const k = ease((st - 8) / 30), a = Math.min(1, (BU2 + 4 - st) / 10);
        ctx.save(); ctx.globalAlpha *= a;
        seeds.forEach((s, i) => {
          const L = s.len * k, dir = Math.sign(s.a);
          let px = sx, py = sy;
          for (let q = 1; q <= 6; q++) { const u = q / 6; if (u * s.len > L) break; const nx = sx + dir * u * s.len, ny = sy + Math.sin(q * 1.7 + i) * 1.5; art.line(ctx, (st + q + i) % 6 < 3 ? C.o : C.y, R(px), R(py), R(nx), R(ny), q < 3 ? 2 : 1); px = nx; py = ny; }
        });
        ctx.restore();
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      web._ugS = 1; z.shots.push(web);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  function door(ctx, x, y, s, ang, glow, a) {   // a furnace door: riveted iron, a grate window full of fire
    PX.sprite(ctx, x, y, s * 2.2, s * 2.2, c => {
      c.rotate(ang);
      c.fillStyle = C.iron; c.fillRect(-s * 0.7, -s * 0.55, s * 1.4, s * 1.1);
      c.fillStyle = C.iron2; c.fillRect(-s * 0.7, -s * 0.55, s * 1.4, Math.max(1, s * 0.12));
      c.fillStyle = glow > 0.5 ? C.w : C.y; c.fillRect(-s * 0.4, -s * 0.28, s * 0.8, s * 0.4);
      c.fillStyle = C.ob; for (let i = 0; i < 4; i++) c.fillRect(-s * 0.4 + i * s * 0.22, -s * 0.28, Math.max(1, s * 0.06), s * 0.4);   // the grate
      c.fillStyle = C.o; for (let i = 0; i < 6; i++) c.fillRect(-s * 0.6 + (i % 3) * s * 0.55, (i < 3 ? -0.45 : 0.35) * s, 2, 2);   // rivets, hot
      c.fillStyle = C.iron; c.fillRect(-s * 0.85, -s * 0.35, s * 0.18, s * 0.2); c.fillRect(-s * 0.85, s * 0.12, s * 0.18, s * 0.2);   // the hinges
    }, { pal: PAL, alpha: a, outline: C.out, keepThin: true });
  }
  // the finishing blow (js/ult-grand.js): a furnace door forms in the floor under the target and glows white; on the
  // blow it is blown off its hinges on an impact frame, a crusted column under it
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 20) return;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2));
        ventRing(ctx, sx, sy, 34 + k * 10, k, st);
        ctx.save(); ctx.globalAlpha *= 0.5 + k * 0.5; door(ctx, sx, sy - 3, 14, 0, k, 1); ctx.restore();
        if (st % 3 === 0) part(T.x + rand(-14, 14), T.y - 2, k > 0.6 ? C.y : C.o, 0, -rand(0.8, 2), 16, 2, -0.02);
        if (st >= FIN - 6) { const u = (st - (FIN - 6)) / 6; link(ctx, sx - 18 - u * 10, sy - 10 - u * 8, 5, u * 2, 1, true); link(ctx, sx + 18 + u * 10, sy - 10 - u * 8, 5, -u * 2, 1, true); }   // the last links snap
      } else {
        const u = st - FIN, k = u / 20, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 24, ik, 47);
        column(ctx, sx, sy, R(70 * Math.min(1, u / 3) * (1 - ease((k - 0.6) / 0.4))), 26, st);
        door(ctx, sx + 30 * k, sy - 20 - 70 * Math.sin(Math.min(1, k * 1.4) * PI * 0.5) + 40 * k * k, 14, k * 7, 1, 1 - ease((k - 0.7) / 0.3));
        shards(ctx, sx, sy - 30, Math.min(1, k * 1.2), 10, 1.8, 7);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
