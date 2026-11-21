'use strict';
// Shattered Worlds — Dyna's fireworks (2026-11-20, the hero-look rework: cool, not cute). Her story: the fireworks girl
// from the steppe festival - "the whole sky went gold" - now the Scrapworks demolition artist with round black bombs and
// lit fuses. Gold, red, sooty black. Her bombs were grey squares and every blast the same pair of rings. Now: round
// black bombs with a sputtering fuse, festival rockets (a striped paper cone on a stick) with a sparkle trail, every
// blast a firework - gold chrysanthemums, a star-shell, a string of firecrackers, four coloured bursts - and the smoke
// that hangs after. Crisp pixel art (js/pixel-kit.js; bombs and rockets baked once). Draw-only: every hit, hitbox and
// timing stays as it was. Loaded after js/ashka-furnace.js.
//   U      Grenade: a black bomb with a sputtering fuse; it bursts as a gold chrysanthemum
//   S+U    Proximity Mine: a half-buried bomb with a blinking red cap; it goes off as a string of firecrackers
//   I      Rocket: a festival rocket with a sparkle trail, ending in a gold star-shell that droops like a willow
//   S+I    Recoil Blast: a gold flash, a fat ring of smoke; her cap flies off
//   W+O    Cluster Bomb: the bomb and its four bomblets burst red, green, gold and blue
//   J      every punch pops a little powder star in a puff of soot; the last sets off a string of crackers
//   S+O    Short Fuse: a sparkler fizzing in her hand      O  Demolition Mode: the fuses on her bandolier lit, gold
//          sparks falling round her (both small on purpose: the view stays clear)
//   W+I    Carpet Bomb: festival night - the sky darkens and rockets go up and burst in colour while the bombs fall,
//          each a firework; on the finishing blow (js/ult-grand.js) one great rocket climbs over the target and bursts
//          into a giant gold firework on an impact frame, then the smoke hangs
// SW.dynaFireworks.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj, Mine = SW.Mine;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !Mine || !CASTS.grenade || !CASTS.rocket) return;
  const DF = SW.dynaFireworks = { on: true };
  const isD = g => !!(DF.on && g && g.state && g.state.hero === 'dyna');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#120c08', s: '#22222a', s2: '#4a4a56', s3: '#7a7a88', g: '#ffd24a', g2: '#fff3c0', w: '#ffffff', r: '#e63946', r0: '#9a1a20', gr: '#52d273', bl: '#4cc9f0', pa: '#f1e3c4', st: '#8a5a2a', sm: '#5a5048', sm2: '#8a8078', fu: '#a0784a' };
  const PAL = [C.out, C.s, C.s2, C.s3, C.g, C.g2, C.w, C.r, C.r0, C.gr, C.bl, C.pa, C.st, C.sm, C.sm2, C.fu];
  const GOLD = [C.g, C.g2, C.g], FOUR = [[C.r, '#ff8a8a'], [C.gr, '#b8ffc8'], [C.g, C.g2], [C.bl, '#c8f4ff']];

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  const blit = (ctx, cv, x, y, a) => { if (a !== undefined && a <= 0) return; ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore(); };
  function bomb(ctx, x, y, r, t, o) {   // a round black bomb, its fuse sputtering (x, y its centre)
    o = o || {}; const Rr = Math.max(3, R(r)), b = Rr * 2 + 10;
    const cv = baked('b' + Rr, b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.beginPath(); q.arc(0, 1, Rr, 0, PI * 2); q.fillStyle = C.s; q.fill();
      q.beginPath(); q.arc(-Rr * 0.35, -Rr * 0.3 + 1, Rr * 0.32, 0, PI * 2); q.fillStyle = C.s3; q.fill();
      q.fillStyle = C.s2; q.fillRect(-Rr * 0.35, -Rr - 2, Rr * 0.7, 3);   // the cap
      q.strokeStyle = C.fu; q.lineWidth = 1; q.beginPath(); q.moveTo(0, -Rr - 2); q.quadraticCurveTo(Rr * 0.5, -Rr - 5, Rr * 0.7, -Rr - 3); q.stroke();   // the fuse
    }, { pal: PAL, outline: C.out, keepThin: true }));
    blit(ctx, cv, x, y, o.a);
    if (o.unlit) return;
    const fx0 = R(x + Rr * 0.7), fy0 = R(y - Rr - 3), on = (t >> 1) % 2;   // the spark at the fuse
    art.rect(ctx, on ? C.w : C.g, fx0, fy0, 2, 2);
    if (t % 3 !== 2) { art.rect(ctx, C.g, fx0 + 2 + (t % 2), fy0 - 2, 1, 1); art.rect(ctx, C.r, fx0 - 1, fy0 - 2 - (t % 3), 1, 1); }
  }
  function rocket(ctx, x, y, d, t, s) {   // a festival rocket: a striped paper cone on a stick; (x, y) its nose, flying toward d
    s = s || 1;
    const cv = baked('rk' + (d > 0 ? 1 : 0) + '_' + s, R(44 * s), R(14 * s), (c, cx, cy) => PX.sprite(c, cx, cy, R(44 * s), R(14 * s), q => {
      q.scale(d * s, s);
      q.fillStyle = C.st; q.fillRect(-20, -0.5, 14, 1.5);   // the stick
      q.fillStyle = C.pa; q.fillRect(-8, -3, 10, 6);
      q.fillStyle = C.r; for (let i = 0; i < 3; i++) q.fillRect(-7 + i * 3.5, -3, 1.6, 6);   // stripes
      q.beginPath(); q.moveTo(2, -3); q.lineTo(7, 0); q.lineTo(2, 3); q.closePath(); q.fillStyle = C.g; q.fill();   // the gold nose
    }, { pal: PAL, outline: C.out, keepThin: true }));
    blit(ctx, cv, x - d * 8 * s, y);
    for (let i = 0; i < 6; i++) { const tx = x - d * (18 + i * 5) * s + Math.sin(t * 1.3 + i * 2) * 2, ty = y + Math.cos(t * 1.1 + i * 3) * 2; if ((t + i) % 3 === 0) continue; art.rect(ctx, i < 2 ? C.w : i % 2 ? C.g : C.r, R(tx), R(ty), i < 3 ? 2 : 1, i < 3 ? 2 : 1); }   // the sparkle trail
  }
  DF.bomb = bomb; DF.rocket = rocket;
  // a chrysanthemum firework: trails of stars bursting out and drooping (k 0 -> 1)
  function chrys(ctx, x, y, Rr, k, cols, seed, o) {
    o = o || {};
    if (k >= 1) return;
    const n = o.n || 14, rr = Rr * ease(Math.min(1, k * 2.2)), droop = k * k * Rr * (o.willow ? 0.8 : 0.35), a = 1 - ease((k - 0.55) / 0.45);
    if (k < 0.15) art.disc(ctx, C.w, R(x), R(y), R(3 + Rr * 0.15 * (1 - k / 0.15)));
    ctx.save(); ctx.globalAlpha *= a;
    for (let i = 0; i < n; i++) {
      const an = i / n * PI * 2 + (seed || 0), ca = Math.cos(an), sa = Math.sin(an), col = cols[i % cols.length];
      for (let j = 4; j >= 0; j--) {
        const r2 = Math.max(0, rr - j * (o.willow ? 6 : 4)), dr = droop * (r2 / Math.max(1, Rr)) * (o.willow ? 1.4 : 1);
        const px = R(x + ca * r2), py = R(y + sa * r2 + dr);
        if (j === 0) { if (k > 0.6 && ((i * 7 + R(k * 40)) % 3 === 0)) continue; const hs = Rr > 40 ? 4 : 3; art.rect(ctx, k < 0.3 ? C.w : col, px - 1, py - 1, hs, hs); }   // (2026-11-20 look ranking: thicker stars)
        else if (j < 4 || o.willow) art.rect(ctx, j < 2 ? col : C.g2, px, py, j < 2 ? 2 : 1, j < 2 ? 2 : 1);
      }
    }
    ctx.restore();
  }
  function smoke(ctx, x, y, Rr, k, n, a) {   // a ring of hanging smoke
    ctx.save(); ctx.globalAlpha *= clamp01(a === undefined ? 1 - k : a) * 0.85;
    for (let i = 0; i < (n || 10); i++) { const an = i / (n || 10) * PI * 2, r = Rr * (0.5 + ease(k) * 0.5), px = R(x + Math.cos(an) * r), py = R(y + Math.sin(an) * r * 0.55 - k * 6), s = R(4 + (1 - k) * 3 + (i % 3)); art.disc(ctx, C.sm, px, py, s); art.disc(ctx, C.sm2, px - 1, py - 1, Math.max(1, s - 2)); }
    ctx.restore();
  }
  function crackers(ctx, x, y, d, t, n) {   // a string of firecrackers going off one after another
    for (let i = 0; i < (n || 6); i++) {
      const cx = R(x + d * (i * 7 - 14)), cy = R(y + Math.sin(i * 1.7) * 4), u = t - i * 2;
      if (u < 0) { art.rect(ctx, C.out, cx - 2, cy - 3, 4, 6); art.rect(ctx, C.r, cx - 1, cy - 2, 2, 4); continue; }
      if (u < 6) { const s = 6 - u; art.rect(ctx, C.w, cx - s, cy, s * 2, 1); art.rect(ctx, C.w, cx, cy - s, 1, s * 2); art.rect(ctx, C.g, cx - 1, cy - 1, 3, 3); }
      if (u < 14) { for (let j = 0; j < 3; j++) { const an = j * 2.1 + i, rr = u * 1.6; art.rect(ctx, j % 2 ? C.r : C.pa, R(cx + Math.cos(an) * rr), R(cy + Math.sin(an) * rr + u * u * 0.04), 1, 1); } }   // paper bits
    }
  }

  // ================= every blast is a firework: the blast rings, restyled by where they came from =================
  let next = null, sup = null, four = 0;
  const _ring = fx.ring;
  fx.ring = function (x, y, col, w, r, life) {
    const g = G, z = g && g.zone;
    if (sup && sup.f === SW.frame && col === '#ffffff' && Math.abs(x - sup.x) < 1 && Math.abs(y - sup.y) < 1) return;   // its white inner ring
    if (!isD(g) || !z || !z.shots || (col !== '#f5c542' && col !== '#ffd24a') || (life !== 14 && life !== 12)) return _ring.apply(this, arguments);
    const kind = next || (col === '#ffd24a' && r <= 26 ? 'four' : 'chrys');
    sup = { x, y, f: SW.frame };
    if (kind === 'recoil') return;   // drawn by the blast itself
    const seed = rand(0, PI);
    if (kind === 'crackers') { const d = (g.player && g.player.face) || 1; z.shots.push(new Vis(x, y, 26, (ctx, sx, sy, t) => { crackers(ctx, sx, sy, d, t, 6); chrys(ctx, sx, sy - 10, 18, t / 22, GOLD, seed, { n: 8 }); if (t > 8) smoke(ctx, sx, sy, 14, (t - 8) / 18, 6); })); return; }
    if (kind === 'four') { const c = FOUR[four++ % 4]; z.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => { chrys(ctx, sx, sy, r + 16, t / 22, c, seed, { n: 12 }); })); return; }
    if (kind === 'shell') { z.shots.push(new Vis(x, y, 34, (ctx, sx, sy, t) => { chrys(ctx, sx, sy, r + 40, t / 30, GOLD, seed, { n: 20, willow: true }); if (t > 10) smoke(ctx, sx, sy + 6, 20, (t - 10) / 24, 8); })); return; }
    const cols = kind === 'ult' ? FOUR[four++ % 4] : GOLD;
    z.shots.push(new Vis(x, y, 26, (ctx, sx, sy, t) => { chrys(ctx, sx, sy, r + 26, t / 24, cols, seed, { n: 16 }); if (t > 10) smoke(ctx, sx, sy + 4, 14, (t - 10) / 16, 6); }));
  };
  const tagEnd = (s, kind) => { const _e = s.onEnd; s.onEnd = function () { next = kind; try { return _e ? _e.apply(this, arguments) : undefined; } finally { next = null; } }; };

  // ================= U: Grenade, I: Rocket =================
  function dressProj(z, n0) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.dyna) return;
      if (s.w === 12 && s.h === 12 && s.life === 80) { s.dyna = 1; s.render = (ctx, x, y, q) => bomb(ctx, x, y, 7, q.t || 0); tagEnd(s, 'chrys'); }
      else if (s.w === 16 && s.h === 10 && s.life === 70) { s.dyna = 1; s.render = (ctx, x, y, q) => rocket(ctx, x + (Math.sign(q.vx) || 1) * 9, y, Math.sign(q.vx) || 1, q.t || 0, 1.5); tagEnd(s, 'shell'); }
    });
  }
  const _gr = CASTS.grenade, _rk = CASTS.rocket;
  CASTS.grenade = function (p, z) { const n0 = z.shots.length, r = _gr.apply(this, arguments); if (isD(G)) dressProj(z, n0); return r; };
  CASTS.rocket = function (p, z) { const n0 = z.shots.length, r = _rk.apply(this, arguments); if (isD(G)) dressProj(z, n0); return r; };

  // ================= S+U: Proximity Mine =================
  const _md = Mine.prototype.draw, _mu = Mine.prototype.update;
  Mine.prototype.draw = function (ctx, cam) {
    if (!isD(G)) return _md.apply(this, arguments);
    const x = R(this.x - cam.x), y = R(this.y - cam.y), armed = this.t > 30;
    bomb(ctx, x, y + 1, 5, this.t, { unlit: true });
    art.rect(ctx, C.sm, x - 8, y - 1, 16, 2); art.rect(ctx, C.s2, x - 7, y - 2, 3, 1); art.rect(ctx, C.s2, x + 4, y - 2, 3, 1);   // dirt over its lower half
    art.rect(ctx, C.out, x - 2, y - 9, 4, 3); art.rect(ctx, armed && this.t % 30 < 15 ? C.r : C.r0, x - 1, y - 8, 2, 2);   // the blinking cap
    if (armed && this.t % 30 < 3) art.glow(ctx, x, y - 8, 6, C.r, 0.3);
  };
  Mine.prototype.update = function () { next = 'crackers'; try { return _mu.apply(this, arguments); } finally { next = null; } };

  // ================= S+I: Recoil Blast =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.dyna;
  if (BU && BU.cast) {
    const _rb = BU.cast;
    BU.cast = function (p, z) {
      if (!isD(G)) return _rb.apply(this, arguments);
      const d = p.face, mx = p.x + d * 14, my = p.y - 20;
      next = 'recoil'; let r; try { r = _rb.apply(this, arguments); } finally { next = null; }
      z.shots.push(new Vis(mx, my, 30, (ctx, sx, sy, t) => {
        const k = t / 30;
        if (t < 3) PX.impact(ctx, sx + d * 20, sy, t / 3, 19);
        if (t < 8) { ctx.save(); ctx.globalAlpha *= 1 - t / 8; for (let i = -3; i <= 3; i++) { const an = (d > 0 ? 0 : PI) + i * 0.12; art.line(ctx, i % 2 ? C.g : C.w, sx, sy, R(sx + Math.cos(an) * (40 + t * 8)), R(sy + Math.sin(an) * (40 + t * 8)), 2); } ctx.restore(); }   // the gold flash
        smoke(ctx, sx + d * (26 + k * 20), sy, 16 + k * 14, k, 12, 1 - ease((k - 0.4) / 0.6));
      }));
      const cx0 = p.x, cy0 = p.y - 36;
      z.shots.push(new Vis(cx0, cy0, 36, (ctx, sx, sy, t) => {   // her cap flies off
        const k = t / 36, x = sx - d * k * 30, y = sy - Math.sin(Math.min(1, k * 1.3) * PI) * 30 + k * 20;
        ctx.save(); ctx.globalAlpha *= 1 - ease((k - 0.7) / 0.3); art.rect(ctx, C.out, R(x) - 4, R(y) - 2, 9, 4); art.rect(ctx, C.r, R(x) - 3, R(y) - 1, 7, 2); art.rect(ctx, C.r0, R(x) + (d > 0 ? -5 : 3), R(y), 3, 1); ctx.restore();
      }));
      return r;
    };
  }

  // ================= W+O: Cluster Bomb (bomb and bomblets drawn as bombs) =================
  function dressActs(z) {
    z.shots.forEach(s => { if (s.dyna || !s.paint || s.style !== 'blast' || !(s.w === 8 || s.w === 6) || !(s.g > 0)) return; s.dyna = 1; const r = s.w === 8 ? 6 : 5; s.paint = (ctx, x, y, q) => bomb(ctx, x, y, r, q.t || 0); });
  }

  // ================= J: a powder star in a puff of soot; the last one a string of crackers =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (col !== '#fff3c0' || !isD(g) || !p || !z || !z.shots || (p.state !== 'attack' && p.state !== 'airatk')) return _slash.apply(this, arguments);
    const d = dir || p.face, a = p.atk, fin = !!(a && a.fin), px = x + d * 8;
    z.shots.push(new Vis(px, y, fin ? 26 : 12, (ctx, sx, sy, t) => {
      if (fin) { crackers(ctx, sx + d * 10, sy - 2, d, t, 5); if (t > 6) smoke(ctx, sx + d * 12, sy, 10, (t - 6) / 20, 5); return; }
      const k = t / 12, s = R(7 * (1 - k)) + 1;
      if (t < 5) { art.rect(ctx, C.w, sx - s, sy, s * 2, 1); art.rect(ctx, C.w, sx, sy - s, 1, s * 2); art.rect(ctx, C.g, sx - 1, sy - 1, 3, 3); }
      chrys(ctx, sx, sy, 10, k, GOLD, t + x, { n: 6 });
      smoke(ctx, sx - d * 2, sy + 2, 6, k, 4, 1 - k);
    }));
  };

  // ================= the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, t = p.t || SW.frame;
    if (p.modeT > 0) {   // Short Fuse: a sparkler fizzing in her hand
      const fade = Math.min(1, p.modeT / 30), hx = sx + d * 9, hy = sy - 20;
      ctx.save(); ctx.globalAlpha *= fade;
      art.line(ctx, C.s3, hx, hy, hx + d * 4, hy - 9, 1);
      for (let i = 0; i < 5; i++) { const an = (t * 0.9 + i * 1.3), rr = 2 + ((t + i * 3) % 5); art.rect(ctx, i % 2 ? C.g : C.w, R(hx + d * 4 + Math.cos(an) * rr), R(hy - 9 + Math.sin(an) * rr), 1, 1); }
      art.rect(ctx, C.w, hx + d * 4 - 1, hy - 10, 2, 2);
      ctx.restore();
    }
    if (p.awakeT > 0) {   // Demolition Mode: every fuse on her bandolier lit, gold sparks falling round her
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha *= fade;
      for (let i = 0; i < 4; i++) { const bx = R(sx - 6 + i * 4), by = R(sy - 27 + i * 2); art.rect(ctx, (t + i * 2) % 4 < 2 ? C.w : C.g, bx, by, 1, 1); }
      for (let i = 0; i < 3; i++) { const ph = (t * 0.04 + i / 3) % 1; art.rect(ctx, C.g, R(sx - 14 + i * 14 + Math.sin(t * 0.2 + i) * 3), R(sy - 44 + ph * 40), 1, 2); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isD(g || this.G) && !this.dead) aura(ctx, this, R(this.x - cam.x), R(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isD(g || this.G) && z && z.shots) dressActs(z); return r; };

  // ================= W+I: Carpet Bomb =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isD(g) || !z || !z.shots) return r;
    z.shots.forEach(s => { if (!(s instanceof Proj) || s.dyna || s.w !== 12 || s.h !== 12 || s.life > 90 || s.g !== 0.12) return; s.dyna = 1; s.render = (ctx, x, y, q) => bomb(ctx, x, y, 7, q.t || 0); tagEnd(s, 'ult'); });   // its falling bombs
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('dyna') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const sky = new Vis(p.x, p.y, 600, (ctx) => {   // (screen space) festival night: rockets go up and burst in colour
        const st = p.st; if (p.state !== 'ult' || st > BU2 + 4) return;
        const k = Math.min(1, (st - 6) / 10, (BU2 + 4 - st) / 10);
        ctx.save(); ctx.globalAlpha = 0.34 * k; ctx.fillStyle = '#0a0a2a'; ctx.fillRect(0, 0, W, H); ctx.restore();
        for (let i = 0; i < 6; i++) {
          const per = 26, ph = (st + i * 9) % per, x = 40 + ((i * 97 + Math.floor((st + i * 9) / per) * 53) % (W - 80)), top = 30 + (i * 23) % 50;
          if (ph < 12) { ctx.save(); ctx.translate(x, R(H - 10 - (H - 10 - top) * (ph / 12))); ctx.rotate(-PI / 2); rocket(ctx, 0, 0, 1, st, 1); ctx.restore(); }   // climbing
          else chrys(ctx, x, top, 26 + (i % 3) * 6, (ph - 12) / (per - 12), FOUR[i % 4], i, { n: 12 });
        }
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): a giant demolition bomb thuds down beside the target, its fuse burning down in a
  // shower of sparks while two rockets climb either side; on the impact frame it goes up as a huge firework in every colour
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 28) return;
      const by = sy - 30, bx = sx + dir * 30;
      if (st < FIN) {
        const fall = ease((st - (BU2 - 2)) / 7), y = sy - 140 + 118 * fall, burn = clamp01((st - BU2 - 4) / Math.max(1, FIN - BU2 - 4));
        if (fall >= 1 && st < BU2 + 8) smoke(ctx, bx, sy - 2, 22, (st - BU2 - 5) / 4, 8);   // it lands with a thud
        bomb(ctx, bx, R(y), 22, st);
        for (let i = 0; i < 6; i++) art.rect(ctx, i % 2 ? C.g : C.w, R(bx + 14 - burn * 10 + rand(-4, 4)), R(y - 26 + rand(-4, 4)), 2, 2);   // the fuse, sputtering lower
        for (const d2 of [-1, 1]) { const ry = sy + 10 - 70 * ease((st - (FIN - 14)) / 14); if (st > FIN - 14) { ctx.save(); ctx.translate(R(sx + d2 * 70), R(ry)); ctx.rotate(-PI / 2); rocket(ctx, 0, 0, 1, st, 1.3); ctx.restore(); } }
      } else {
        const u = st - FIN, k = u / 28, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, by, ik, 61);
        chrys(ctx, bx, by, 80, Math.min(0.99, k * 1.05), GOLD, 0.2, { n: 24, willow: true });
        chrys(ctx, bx, by, 52, Math.min(0.99, k * 1.25), [C.r, C.g2], 0.5, { n: 16 });
        for (let i = 0; i < 4; i++) chrys(ctx, R(bx + Math.cos(i * PI / 2 + 0.6) * 56), R(by - 20 + Math.sin(i * PI / 2 + 0.6) * 34), 26, Math.min(0.99, (u - 3 - i * 2) / 18), FOUR[i % 4], i, { n: 10 });
        if (u > 8) smoke(ctx, bx, by + 16, 40, (u - 8) / 20, 14, 1 - ease((u - 14) / 14));
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
