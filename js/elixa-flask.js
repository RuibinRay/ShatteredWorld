'use strict';
// Shattered Worlds — Elixa's flasks (2026-11-20, the hero-look rework: cool, not cute). Her story: Halcyon's chief
// alchemist, maker of the serums - "three bubbling flasks of red, blue and green"; lab white with violet. Her flasks
// were a dot with a stub, her reactions plain rings. Now they are glassware: round-bottomed flasks with a cork, the
// liquid sloshing with bubbles in it, a glint on the glass; each breaks into its own smoke - red fire-smoke, blue frost
// vapour, green acid fumes with skull-shaped bubbles - and a reaction is the three colours boiling up together in a cloud
// round an alchemy sigil. Crisp pixel art (js/pixel-kit.js; the flasks baked once per colour and tilt). Draw-only: every
// hit, hitbox and timing stays as it was. Loaded after js/slick-ooze.js.
//   U / S+U  Red Flask, Blue Flask: a corked flask turning as it flies; it shatters in glass and its own smoke
//   I        Green Cauldron: an iron cauldron tips and the acid spreads, bubbling, skulls rising out of it
//   S+I      Grand Experiment: the three flasks, and where they meet the reaction boils up
//   W+O      Transmute: an alchemy circle turns under the foe
//   J        the last blow lobs a flask (the same glass)
//   S+O      Catalyst: coloured smoke curling round her      O  Philosopher's Stone: a red stone floating over her
//            palm in a small turning circle (both small on purpose: the view stays clear)
//   W+I      Magnum Opus: a great alembic hangs over the arena pouring flasks; on the finishing blow (js/ult-grand.js)
//            a giant flask swings over the target, boils, and bursts on an impact frame in all three colours
// SW.elixaFlask.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !CASTS.red_flask || !CASTS.green_cauldron) return;
  const EF = SW.elixaFlask = { on: true };
  const isE = g => !!(EF.on && g && g.state && g.state.hero === 'elixa');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#140c20', glass: '#e8f4ff', glass2: '#a8b8d0', cork: '#a0784a', cork2: '#6a4a2a', iron: '#3a3a44', iron2: '#6a6a78', vi: '#9b5de5', vi2: '#f1e3ff', w: '#ffffff', gold: '#fee440' };
  const LIQ = { red: ['#ef476f', '#ff8fa3', '#8a1a30'], blue: ['#4cc9f0', '#b8f0ff', '#1a5a80'], green: ['#80ed99', '#c8ffd0', '#2a7a3a'] };
  const colOf = s => (s.status && s.status.burn ? 'red' : s.status && s.status.freeze ? 'blue' : 'green');

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  // a round-bottomed flask with a cork, s its size, turned to ang
  function flask(ctx, x, y, s, ang, col, t, a) {
    const S = Math.max(4, R(s)), step = ((R(ang / (PI / 8)) % 16) + 16) % 16, b = S * 4 + 6, L = LIQ[col];
    const cv = baked('f' + S + col + step, b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.rotate(step * PI / 8); const u = S / 5;
      q.fillStyle = C.glass2; q.fillRect(-1.2 * u, -6 * u, 2.4 * u, 3.4 * u);   // the neck
      q.beginPath(); q.arc(0, 0.6 * u, 3.2 * u, 0, PI * 2); q.fillStyle = C.glass; q.fill();   // the bulb
      q.beginPath(); q.arc(0, 0.6 * u, 2.7 * u, 0.1, PI - 0.1); q.lineTo(-2.6 * u, 0.2 * u); q.lineTo(2.6 * u, 0.2 * u); q.closePath(); q.fillStyle = L[0]; q.fill();   // the liquid
      q.fillStyle = L[1]; q.fillRect(-2.4 * u, 0.2 * u, 4.8 * u, 0.6 * u);
      q.fillStyle = C.cork; q.fillRect(-1.4 * u, -7.4 * u, 2.8 * u, 1.6 * u); q.fillStyle = C.cork2; q.fillRect(-1.4 * u, -6.2 * u, 2.8 * u, 0.4 * u);
      q.fillStyle = C.w; q.fillRect(-2 * u, -1.6 * u, 0.8 * u, 1.4 * u);   // the glint
    }, { outline: C.out, keepThin: true }));
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore();
    if (t % 6 < 2) art.rect(ctx, L[1], R(x + Math.sin(t) * 2), R(y + 1), 1, 1);   // a bubble rising in it
  }
  EF.flask = flask;
  function smoke(ctx, x, y, col, k, Rr, n, seed) {   // a burst of coloured smoke (k 0 -> 1)
    const L = LIQ[col], a = 1 - ease((k - 0.4) / 0.6);
    ctx.save(); ctx.globalAlpha *= a;
    for (let i = 0; i < n; i++) { const an = i / n * PI * 2 + (seed || 0), rr = Rr * ease(Math.min(1, k * 1.8)) * (0.6 + (i % 3) * 0.2), px = R(x + Math.cos(an) * rr), py = R(y + Math.sin(an) * rr * 0.7 - k * 10), s = R(3 + (1 - k) * 4 + (i % 2)); art.disc(ctx, L[2], px, py + 1, s); art.disc(ctx, L[0], px, py, s); art.disc(ctx, L[1], px - 1, py - 1, Math.max(1, s - 2)); }
    ctx.restore();
  }
  function shards(ctx, x, y, k, seed) {   // broken glass
    for (let i = 0; i < 6; i++) { const an = -PI * 0.1 - i / 5 * PI * 0.8 + (seed || 0) * 0.1, rr = k * (14 + i * 3), px = R(x + Math.cos(an) * rr), py = R(y + Math.sin(an) * rr + k * k * 24); ctx.save(); ctx.globalAlpha *= 1 - k; art.rect(ctx, i % 2 ? C.glass : C.glass2, px, py, 2, 1); ctx.restore(); }
  }
  function skull(ctx, x, y, a) {   // a skull-shaped bubble
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    art.rect(ctx, LIQ.green[2], R(x) - 3, R(y) - 3, 7, 6); art.rect(ctx, LIQ.green[1], R(x) - 2, R(y) - 2, 5, 3); art.rect(ctx, LIQ.green[1], R(x) - 1, R(y) + 1, 3, 1);
    art.rect(ctx, LIQ.green[2], R(x) - 1, R(y) - 1, 1, 1); art.rect(ctx, LIQ.green[2], R(x) + 1, R(y) - 1, 1, 1);
    ctx.restore();
  }
  function sigil(ctx, x, y, r, t, a, col) {   // an alchemy circle (flat on the floor: y squashed)
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    const m = Math.max(20, R(r * 2.4)), sq = 0.32;
    for (let i = 0; i < m; i++) { const an = i / m * PI * 2 + t * 0.03; art.rect(ctx, i % 4 ? (col || C.vi) : C.vi2, R(x + Math.cos(an) * r), R(y + Math.sin(an) * r * sq), 1, 1); }
    for (let i = 0; i < 3; i++) { const a0 = -t * 0.04 + i / 3 * PI * 2, a1 = a0 + PI * 2 / 3; art.line(ctx, col || C.vi, R(x + Math.cos(a0) * r), R(y + Math.sin(a0) * r * sq), R(x + Math.cos(a1) * r), R(y + Math.sin(a1) * r * sq), 1); }   // the triangle
    for (let i = 0; i < 3; i++) { const an = -t * 0.04 + i / 3 * PI * 2; art.rect(ctx, [LIQ.red[0], LIQ.blue[0], LIQ.green[0]][i], R(x + Math.cos(an) * r) - 1, R(y + Math.sin(an) * r * sq) - 1, 3, 2); }
    ctx.restore();
  }
  function reaction(ctx, x, y, k, seed) {   // the three colours boiling up together round a sigil
    sigil(ctx, x, y + 18, 20 + k * 10, k * 60, 1 - k, C.gold);
    ['red', 'blue', 'green'].forEach((c, i) => smoke(ctx, x + Math.cos(i * 2.09 + seed) * 6, y - 4 - k * 8, c, Math.min(0.99, k * 1.1), 26, 6, i * 1.1 + seed));
    if (k < 0.2) art.disc(ctx, C.w, R(x), R(y), R(10 * (1 - k * 5)) + 1);
  }

  // ================= flasks in flight (Red, Blue, the experiment's three, the finisher's) =================
  function dressFlasks(z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.elixa || s.w !== 10 || s.h !== 10 || s.life !== 60 || !(s.g > 0.2 && s.g < 0.3)) return;
      s.elixa = 1; const col = colOf(s), spin = (Math.sign(s.vx) || 1) * 0.35;
      s.render = (ctx, x, y, q) => flask(ctx, x, y, 5, (q.t || 0) * spin, col, q.t || 0);
    });
  }
  // where they land: their smoke and glass (the landing ring), and the reaction (the reaction ring)
  const _ring = fx.ring;
  fx.ring = function (x, y, col, r0, r1, life) {
    const g = G, z = g && g.zone;
    if (!isE(g) || !z || !z.shots) return _ring.apply(this, arguments);
    const c = Object.keys(LIQ).find(k => LIQ[k][0] === col);
    if (!c) return _ring.apply(this, arguments);
    const seed = rand(0, PI);
    if (r0 === 4 && r1 === 22 && life === 10) { z.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => { const k = t / 22; smoke(ctx, sx, sy, c, k, 18, 7, seed); shards(ctx, sx, sy, k, seed); if (c === 'green' && t % 6 === 0) skull(ctx, sx + Math.sin(t) * 6, sy - k * 16, 1 - k); })); return; }
    if (r0 === 6 && r1 === 40 && life === 14) { z.shots.push(new Vis(x, y, 30, (ctx, sx, sy, t) => reaction(ctx, sx, sy, t / 30, seed))); return; }
    if (r0 === 4 && r1 === 26 && life === 10) { z.shots.push(new Vis(x, y, 20, (ctx, sx, sy, t) => smoke(ctx, sx, sy, c, t / 20, 16, 6, seed))); return; }   // the ultimate's each-hit
    return _ring.apply(this, arguments);
  };

  // ================= I: Green Cauldron =================
  const _gc = CASTS.green_cauldron;
  CASTS.green_cauldron = function (p, z) {
    const n0 = z.shots.length, r = _gc.apply(this, arguments);
    if (!isE(G)) return r;
    const d = p.face, ac = z.shots.slice(n0).find(s => s && s.life === 180 && typeof s.render === 'function');
    if (ac) ac.render = (ctx, sx, sy, t) => {
      t = typeof t === 'number' ? t : (ac.t || 0);
      const a = Math.min(1, t / 8, (180 - t) / 12), spread = 40 * ease(Math.min(1, t / 10));
      ctx.save(); ctx.globalAlpha *= a;
      art.rect(ctx, LIQ.green[2], R(sx - spread), sy - 3, R(spread * 2), 3); art.rect(ctx, LIQ.green[0], R(sx - spread) + 2, sy - 3, R(spread * 2) - 4, 2);
      for (let i = -36; i < 36; i += 8) { if (Math.abs(i) > spread) continue; const ph = ((t * 0.05 + (i + 40) * 0.07) % 1); if (ph < 0.5) art.rect(ctx, LIQ.green[1], R(sx + i), R(sy - 4 - ph * 4), 2, 2); }   // bubbling
      ctx.restore();
      if (t % 30 < 20) skull(ctx, sx + ((t * 7) % 60) - 30, sy - 6 - (t % 30) * 0.6, a * (1 - (t % 30) / 20));
      if (t < 18) {   // the cauldron tipping out
        const k = t / 18, cx = R(sx - d * 44), cy = sy - 10, tilt = Math.min(1, t / 6) * 0.9 * d;
        PX.sprite(ctx, cx, cy, 30, 30, c => { c.rotate(tilt); c.fillStyle = C.iron; c.beginPath(); c.arc(0, 0, 9, 0, PI); c.lineTo(-9, -2); c.lineTo(9, -2); c.closePath(); c.fill(); c.fillStyle = C.iron2; c.fillRect(-10, -3, 20, 2); c.fillStyle = LIQ.green[0]; c.fillRect(-8, -2, 16, 2); }, { alpha: 1 - ease((k - 0.7) / 0.3), outline: C.out, keepThin: true });
        ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 5; i++) art.rect(ctx, LIQ.green[i % 2], R(cx + d * (6 + i * 3)), R(cy + i * 2), 2, 2); ctx.restore();
      }
    };
    return r;
  };

  // ================= W+O: Transmute: an alchemy circle turns under the foe =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.elixa;
  if (SIG && SIG.cast) {
    const _tm = SIG.cast;
    SIG.cast = function (p, z) {
      const e = isE(G) && N.nearest ? N.nearest(z, p.x, p.y - 16, 240) : null, r = _tm.apply(this, arguments);
      if (!isE(G)) return r;
      const tx = e ? e.x : p.x + p.face * 60, ty = e ? e.y : p.y;
      z.shots.push(new Vis(tx, ty, 30, (ctx, sx, sy, t) => { const k = t / 30; sigil(ctx, sx, sy - 1, 22 * ease(Math.min(1, t / 6)), t * 3, 1 - ease((k - 0.6) / 0.4), C.gold); if (t < 10) { ctx.save(); ctx.globalAlpha *= 1 - t / 10; art.rect(ctx, C.gold, sx - 1, sy - 50, 2, 50); ctx.restore(); } }, v => { if (e && !e.dead) { v.x = e.x; v.y = e.y; } }));
      z.shots.push(new Vis(p.x, p.y, 20, (ctx, sx, sy, t) => { for (let i = 0; i < 3; i++) { const ph = ((t / 20 + i / 3) % 1); art.rect(ctx, LIQ.green[1], R(sx - 6 + i * 6), R(sy - 10 - ph * 20), 1, 1); } }, v => { v.x = p.x; v.y = p.y; }));   // drinking a little of it
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (p.modeT > 0 && behind) {   // Catalyst: coloured smoke curling round her
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade * 0.6;
      for (let i = 0; i < 3; i++) { const an = t * 0.05 + i * 2.09, c = ['red', 'blue', 'green'][i]; for (let j = 0; j < 4; j++) { const a2 = an - j * 0.25; art.disc(ctx, LIQ[c][0], R(sx + Math.cos(a2) * 14), R(sy - 18 + Math.sin(a2) * 5 - j * 2), 3 - (j >> 1)); } }
      ctx.restore();
    }
    if (p.awakeT > 0 && !behind) {   // Philosopher's Stone over her palm, a small turning circle under it
      const fade = Math.min(1, p.awakeT / 30), hx = sx + d * 10, hy = sy - 32 + Math.sin(t * 0.08) * 2;
      ctx.save(); ctx.globalAlpha *= fade;
      for (let i = 0; i < 14; i++) { const an = i / 14 * PI * 2 + t * 0.05; art.rect(ctx, i % 3 ? C.vi : C.gold, R(hx + Math.cos(an) * 6), R(hy + 4 + Math.sin(an) * 2), 1, 1); }
      art.rect(ctx, C.out, hx - 3, hy - 4, 6, 6); art.rect(ctx, '#c1121f', hx - 2, hy - 3, 4, 4); art.rect(ctx, '#ff6b81', hx - 2, hy - 3, 2, 1);
      ctx.restore();
      art.glow(ctx, hx, hy, 8, '#ef476f', 0.18 * fade);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isE(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isE(g || this.G) && z && z.shots) dressFlasks(z); return r; };

  // ================= W+I: Magnum Opus =================
  const _mo = N.ULT && N.ULT.magnum_opus;
  if (_mo) N.ULT.magnum_opus = function (p, z, foes) {
    const r = _mo.apply(this, arguments);
    if (!isE(G) || !z || !z.shots) return r;
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('elixa') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const sky = new Vis(p.x, p.y, 600, (ctx) => {   // (screen space) a great alembic over the arena, pouring flasks
        const st = p.st; if (p.state !== 'ult' || st > BU2 + 4) return;
        const k = Math.min(1, (st - 6) / 10, (BU2 + 4 - st) / 10), ax = W / 2, ay = 34;
        ctx.save(); ctx.globalAlpha *= k;
        PX.sprite(ctx, ax, ay, 90, 60, c => { c.beginPath(); c.arc(0, 4, 20, 0, PI * 2); c.fillStyle = C.glass; c.fill(); c.beginPath(); c.arc(0, 6, 17, 0.2, PI - 0.2); c.closePath(); c.fillStyle = C.vi; c.fill(); c.fillStyle = C.glass2; c.fillRect(-4, -26, 8, 12); c.save(); c.translate(4, -20); c.rotate(0.5); c.fillRect(0, -2, 40, 4); c.restore(); c.fillStyle = C.w; c.fillRect(-12, -6, 3, 6); }, { outline: C.out, keepThin: true });
        ctx.restore();
        for (let i = 0; i < 8; i++) { const ph = ((st * 0.04 + i / 8) % 1), fx0 = 60 + ((i * 97 + Math.floor(st * 0.04 + i / 8) * 61) % (W - 120)), fy0 = 50 + ph * (H - 70); flask(ctx, fx0, fy0, 4, st * 0.4 + i, ['red', 'blue', 'green'][i % 3], st, k); }   // the flasks raining
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): a giant flask swings over the target, boils, and bursts in all three colours
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 22) return;
      const cy = sy - 48;
      if (st < FIN) { const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2)), sh = k > 0.7 ? (st % 2 ? 1 : -1) : 0; flask(ctx, sx + sh, cy - (1 - k) * 20, 9, Math.sin(st * 0.15) * 0.4 * (1 - k), ['red', 'blue', 'green'][(st >> 3) % 3], st); sigil(ctx, sx, sy - 1, 18 + k * 12, st * 2, k, C.gold); }
      else {
        const u = st - FIN, k = u / 22, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 97);
        reaction(ctx, sx, sy - 24, Math.min(0.99, k), 0.4);
        shards(ctx, sx, cy, Math.min(1, k * 1.5), 2); shards(ctx, sx, cy, Math.min(1, k * 1.5), 5);
        for (let i = 0; i < 3; i++) if ((u + i * 3) % 8 < 4) skull(ctx, sx - 16 + i * 16, sy - 30 - k * 30, 1 - k);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
