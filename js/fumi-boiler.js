'use strict';
// Shattered Worlds — Fumi's boiler (2026-11-20, the hero-look rework: cool, not cute). His story: "Kettle", the Pressure
// Valve - keeps it all in, then does not; blocking and taking hits build pressure until a skill vents it. His steam was
// soft white rings and grey bars like any element. Now he is a boiler about to go: brass valves and flanges, a pressure
// gauge whose needle climbs into the red, hard-edged pixel steam (shaded clouds, white-hot cores) and scalding red specks.
// Crisp pixel art through js/pixel-kit.js; the steam clouds are baked once per size. Draw-only: every hit, hitbox and
// timing stays as it was. Loaded after js/vex-field.js.
//   U      Steam Jet: a brass nozzle at his palm; each push is a hard jet of steam with a white-hot core
//   S+U    Scald Step: he rides an exhaust jet out of his back; the cloud he leaves is a low scalding bank with red
//          specks rising out of it
//   I      Boiler Burst: a gauge over his head, the needle climbing into the red and shaking, the rivets round him
//          glowing; then the boiler goes - an impact frame, a ring of steam, brass rivets and the gauge blown off
//   S+I    Geyser Field: an iron floor vent rattles open where each geyser will come, then a column of steam bursts out
//   W+O    Whistle: a brass steam whistle over his head, a plume of steam and sharp chevrons of sound
//   J      his palms vent steam through a brass flange; the finisher spins a valve wheel open
//   S+O    High Pressure: short pipes on his shoulders blowing off steam      O  Full Boil: a small red-hot gauge on his
//          chest, heat specks at his feet (both small on purpose: the view stays clear)
//   (trait) his pressure: a little brass gauge over him instead of a bar; at full it shakes in the red and leaks
//   W+I    Meltdown: a brass pipe runs over the arena and every valve on it blows open; in the cinematic finish
//          (js/ult-cinema.js) a great gauge swings into the red over the target, its glass cracks, and on the blow it
//          bursts on an impact frame in a blast of steam, glass and brass
// SW.fumiBoiler.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !CASTS.steam_jet || !CASTS.boiler_burst) return;
  const FB = SW.fumiBoiler = { on: true };
  const isF = g => !!(FB.on && g && g.state && g.state.hero === 'fumi');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#16181c', sh: '#5c636a', iron: '#2b3035', iron2: '#495057', st0: '#adb5bd', st: '#dee2e6', w: '#ffffff', br0: '#5a3d1c', br: '#a8792f', br2: '#e0b860', br3: '#fff0b0', red: '#e03131', red2: '#ff8787', glass: '#eef2f5' };
  const PAL = [C.out, C.sh, C.iron, C.iron2, C.st0, C.st, C.w, C.br0, C.br, C.br2, C.br3, C.red, C.red2, C.glass];

  // ---------- baked sprites (drawn once per size through the pixel kit; dropped if the canvas loses its context) ----------
  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) {
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2));
      cv.addEventListener('contextlost', () => cache.delete(key));
      cache.set(key, cv);
    }
    return cv;
  }
  const blit = (ctx, cv, x, y, a) => { if (a !== undefined && a <= 0) return; ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, Math.round(x - cv.width / 2), Math.round(y - cv.height / 2)); ctx.restore(); };

  // a hard-edged cloud of steam, radius r: three shaded lobes and a white top
  function puff(ctx, x, y, r, o) {
    o = o || {};
    const R = Math.max(2, Math.round(r)), w = R * 3 + 4, h = Math.round(R * 2.6) + 4, mono = o.mono || '';
    const cv = baked('p' + R + mono, w, h, (c, cx, cy) => PX.sprite(c, cx, cy, w, h, q => {
      const L = [[-0.55, 0.2, 0.6], [0.5, 0.25, 0.55], [0, -0.15, 0.78]];
      L.forEach(([lx, ly, s]) => { q.beginPath(); q.arc(lx * R, ly * R, s * R, 0, PI * 2); q.fillStyle = C.st0; q.fill(); });
      L.forEach(([lx, ly, s]) => { q.beginPath(); q.arc(lx * R - s * R * 0.15, ly * R - s * R * 0.22, s * R * 0.76, 0, PI * 2); q.fillStyle = C.st; q.fill(); });
      q.beginPath(); q.arc(-R * 0.2, -R * 0.5, R * 0.3, 0, PI * 2); q.fillStyle = C.w; q.fill();
    }, { pal: PAL, outline: C.sh, keepThin: true, mono: o.mono }));
    blit(ctx, cv, x, y, o.a);
  }
  FB.puff = puff;
  const A = v => PI * 0.75 + v * PI * 1.5;   // the gauge's sweep: 0 bottom-left, over the top, 1 bottom-right
  // a brass pressure gauge, radius r; v the needle (0..1, past 0.75 is the red)
  function gauge(ctx, x, y, r, v, o) {
    o = o || {};
    const R = Math.max(4, Math.round(r)), s = R * 2 + 6, crack = o.crack ? 1 : 0;
    const cv = baked('g' + R + '_' + crack + (o.mono || ''), s, s, (c, cx, cy) => PX.sprite(c, cx, cy, s, s, q => {
      q.beginPath(); q.arc(0, 0, R, 0, PI * 2); q.fillStyle = C.br0; q.fill();
      q.beginPath(); q.arc(-R * 0.08, -R * 0.08, R * 0.92, 0, PI * 2); q.fillStyle = C.br; q.fill();
      q.beginPath(); q.arc(-R * 0.2, -R * 0.2, R * 0.7, PI * 0.9, PI * 1.6); q.lineWidth = Math.max(1, R * 0.12); q.strokeStyle = C.br2; q.stroke();
      q.beginPath(); q.arc(0, 0, R * 0.74, 0, PI * 2); q.fillStyle = C.glass; q.fill();
      q.beginPath(); q.arc(0, 0, R * 0.56, A(0.75), A(1)); q.lineWidth = Math.max(1, R * 0.18); q.strokeStyle = C.red; q.stroke();
      if (R >= 7) { q.strokeStyle = C.iron2; q.lineWidth = 1; for (let i = 0; i <= 6; i++) { const a = A(i / 6); q.beginPath(); q.moveTo(Math.cos(a) * R * 0.5, Math.sin(a) * R * 0.5); q.lineTo(Math.cos(a) * R * 0.7, Math.sin(a) * R * 0.7); q.stroke(); } }
      if (crack) { q.strokeStyle = C.iron; q.lineWidth = 1; q.beginPath(); q.moveTo(-R * 0.1, -R * 0.1); q.lineTo(R * 0.35, -R * 0.45); q.lineTo(R * 0.3, -R * 0.7); q.moveTo(-R * 0.1, -R * 0.1); q.lineTo(-R * 0.55, R * 0.1); q.moveTo(-R * 0.1, -R * 0.1); q.lineTo(R * 0.1, R * 0.6); q.stroke(); }
    }, { pal: PAL, outline: C.out, keepThin: true, mono: o.mono }));
    blit(ctx, cv, x, y, o.a);
    if (o.mono || o.noNeedle) return;
    ctx.save(); if (o.a !== undefined) ctx.globalAlpha *= clamp01(o.a);
    const a = A(Math.min(1.06, v)) + (v > 0.8 ? Math.sin(SW.frame * 1.9) * 0.07 : 0), L = R * 0.62;
    art.line(ctx, C.red, Math.round(x), Math.round(y), Math.round(x + Math.cos(a) * L), Math.round(y + Math.sin(a) * L), R >= 10 ? 2 : 1);
    art.rect(ctx, C.iron, Math.round(x) - 1, Math.round(y) - 1, 2, 2);
    ctx.restore();
  }
  FB.gauge = gauge;
  // a brass hand-wheel (four spokes), turned to ang
  function wheel(ctx, x, y, r, ang, o) {
    o = o || {};
    const R = Math.max(4, Math.round(r)), s = R * 2 + 6, step = (((Math.round(ang / (PI / 16))) % 8) + 8) % 8;
    const cv = baked('w' + R + '_' + step + (o.mono || ''), s, s, (c, cx, cy) => PX.sprite(c, cx, cy, s, s, q => {
      q.rotate(step * PI / 16);
      q.lineWidth = Math.max(2, R * 0.28); q.strokeStyle = C.br; q.beginPath(); q.arc(0, 0, R * 0.8, 0, PI * 2); q.stroke();
      q.lineWidth = Math.max(1, R * 0.1); q.strokeStyle = C.br2; q.beginPath(); q.arc(0, 0, R * 0.8, PI * 1.05, PI * 1.55); q.stroke();
      q.lineWidth = Math.max(1, R * 0.16); q.strokeStyle = C.br0; for (let i = 0; i < 4; i++) { const a = i * PI / 2; q.beginPath(); q.moveTo(0, 0); q.lineTo(Math.cos(a) * R * 0.72, Math.sin(a) * R * 0.72); q.stroke(); }
      q.beginPath(); q.arc(0, 0, R * 0.24, 0, PI * 2); q.fillStyle = C.iron2; q.fill();
    }, { pal: PAL, outline: C.out, keepThin: true, mono: o.mono }));
    blit(ctx, cv, x, y, o.a);
  }
  // a brass steam whistle: a slotted bell with a lever (screen point x, y its base)
  function whistle(ctx, x, y, o) {
    o = o || {};
    const cv = baked('wh' + (o.mono || ''), 20, 26, (c, cx, cy) => PX.sprite(c, cx, cy, 20, 26, q => {
      q.fillStyle = C.br0; q.fillRect(-4, -2, 8, 12);                              // the stem
      q.fillStyle = C.br; q.fillRect(-4, -10, 8, 12); q.fillStyle = C.br2; q.fillRect(-4, -10, 2, 12);   // the bell
      q.fillStyle = C.iron; q.fillRect(-3, -1, 6, 2);                              // its slot
      q.beginPath(); q.arc(0, -10, 4, PI, 0); q.fillStyle = C.br; q.fill();        // the dome
      q.fillStyle = C.br0; q.fillRect(3, 4, 6, 2); q.fillRect(8, 2, 2, 5);         // the lever
    }, { pal: PAL, outline: C.out, keepThin: true, mono: o.mono }));
    blit(ctx, cv, x, y - 8, o.a);
  }
  // a brass pipe stub with a bolted flange at its mouth (the mouth at x, y, facing d)
  function nozzle(ctx, x, y, d) {
    const x0 = d > 0 ? x - 9 : x + 1;
    art.rect(ctx, C.out, x0 - 1, y - 3, 10, 7); art.rect(ctx, C.br, x0, y - 2, 8, 5); art.rect(ctx, C.br2, x0, y - 2, 8, 1); art.rect(ctx, C.br0, x0, y + 2, 8, 1);
    const fx0 = d > 0 ? x - 1 : x - 2;
    art.rect(ctx, C.out, fx0 - 1, y - 5, 5, 11); art.rect(ctx, C.br, fx0, y - 4, 3, 9); art.rect(ctx, C.br3, fx0, y - 4, 1, 9);
    art.rect(ctx, C.iron, fx0 + 1, y - 3, 1, 1); art.rect(ctx, C.iron, fx0 + 1, y + 3, 1, 1);
  }
  // a hard jet of steam from (x, y) along angle ang (or dir ±1 level), len long; k 0..1 its life
  function jet(ctx, x, y, ang, len, k, t, o) {
    o = o || {};
    if (k < 0 || k >= 1) return;
    const ca = Math.cos(ang), sa = Math.sin(ang), L = len * (o.snap ? 1 : ease(Math.min(1, k * 4 + 0.15))), fade = 1 - ease((k - 0.55) / 0.45);
    ctx.save(); ctx.globalAlpha *= fade;
    art.line(ctx, C.st, Math.round(x), Math.round(y), Math.round(x + ca * L * 0.8), Math.round(y + sa * L * 0.8), o.thin ? 2 : 4);
    art.line(ctx, C.w, Math.round(x), Math.round(y), Math.round(x + ca * L * 0.65), Math.round(y + sa * L * 0.65), o.thin ? 1 : 2);
    ctx.restore();
    const n = Math.max(2, Math.round(len / 12));
    for (let i = 1; i <= n; i++) {
      const u = i / n; if (u * len > L + 2) continue;
      const wob = Math.sin(t * 0.9 + i * 1.7) * u * 3, px = x + ca * u * L - sa * wob, py = y + sa * u * L + ca * wob;
      puff(ctx, px, py, 1.6 + u * len * (o.thin ? 0.07 : 0.11), { a: fade });
    }
    if (len > 30 && PX.lines) { ctx.save(); ctx.globalAlpha *= fade * 0.8; PX.lines(ctx, x + ca * L * 0.5, y + sa * L * 0.5, ang, L * 0.4, 3, t, C.st, 10); ctx.restore(); }
  }
  FB.jet = jet;
  const dirAng = d => (d < 0 ? PI : 0);
  const specks = (ctx, x, y, w, h, t, n, a) => {   // scalding red specks rising
    ctx.save();
    for (let j = 0; j < n; j++) { const ph = (t * 0.035 + j / n) % 1, sx = x - w / 2 + ((j * 37 + Math.floor((t * 0.035 + j / n)) * 13) % Math.max(1, w)); ctx.globalAlpha = (a === undefined ? 1 : a) * (1 - ph); art.rect(ctx, j % 2 ? C.red2 : C.red, Math.round(sx), Math.round(y - ph * h), 1, 2); }
    ctx.restore();
  };

  // ================= every steam hit lands as a burst of steam (fx.slash in the steam colour) =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, z = g && g.zone;
    if (col !== '#e9ecef' || !isF(g) || !z || !z.shots) return _slash.apply(this, arguments);
    const big = len >= 38, life = big ? 14 : 10, n = big ? 5 : 3;
    z.shots.push(new Vis(x, y, life, (ctx, sx, sy, t) => {
      const k = t / life, a = 1 - ease((k - 0.45) / 0.55);
      for (let i = 0; i < n; i++) { const an = i / n * PI * 2 + 0.5, rr = (big ? 14 : 9) * ease(Math.min(1, k * 1.6)); puff(ctx, sx + Math.cos(an) * rr, sy + Math.sin(an) * rr * 0.7, (big ? 6 : 4) * (1 - k * 0.5), { a }); }
      if (t < 3) { art.disc(ctx, C.w, sx, sy, big ? 6 : 4); }
    }));
    for (let i = 0; i < (big ? 5 : 3); i++) part(x, y, i % 2 ? C.red2 : C.red, rand(-2, 2), -rand(1, 3), 14, 1, 0.15);
  };

  // ================= U: Steam Jet =================
  const _sj = CASTS.steam_jet;
  CASTS.steam_jet = function (p, z) {
    const r = _sj.apply(this, arguments);
    if (!isF(G)) return r;
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 18, (ctx, sx, sy, t) => {
      const hx = sx + d * 16, hy = sy - 22;
      nozzle(ctx, hx, hy, d);
      [-1, 7].forEach(t0 => jet(ctx, hx + d * 3, hy, dirAng(d), 70, (t - t0) / 10, t, { snap: true }));   // (the first push lands on the cast frame itself)
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= S+U: Scald Step: an exhaust jet out of his back, then a low scalding bank =================
  function bank(ctx, x, y, w, t, life) {
    const a = Math.min(1, t / 8, (life - t) / 12); if (a <= 0) return;
    const n = Math.max(3, Math.round(w / 13));
    for (let i = 0; i < n; i++) { const px = x - w / 2 + (i + 0.5) * w / n, r = 6 + Math.sin(i * 2.1 + t * 0.08) * 1.5; puff(ctx, px, y - 7 - Math.sin(i * 1.3 + t * 0.05) * 2, r, { a: 0.8 * a }); }
    for (let i = 0; i < n - 1; i++) { const px = x - w / 2 + (i + 1) * w / n, r = 4 + Math.sin(i * 1.7 + t * 0.06) * 1; puff(ctx, px, y - 17 - Math.sin(i * 0.9 + t * 0.07) * 2, r, { a: 0.6 * a }); }
    specks(ctx, x, y - 6, w, 34, t, 5, a);
  }
  const _ss = CASTS.scald_step;
  if (_ss) CASTS.scald_step = function (p, z) {
    const x0 = p.x, n0 = z.shots.length, r = _ss.apply(this, arguments);
    if (!isF(G)) return r;
    const d = p.face, drv = z.shots.slice(n0).find(s => s.p === p && s.step);
    z.shots.push(new Vis(p.x, p.y, 14, (ctx, sx, sy, t) => {
      if (drv && drv.gone && t > 2) return;
      jet(ctx, sx - d * 8, sy - 20, dirAng(-d), 30, (t % 6) / 6, t, { thin: true });
    }, v => { v.x = p.x; v.y = p.y; }));
    if (drv && drv.end) {
      const _e = drv.end;
      drv.end = function (q, zz) {
        const m = zz && zz.shots ? zz.shots.length : 0, o = _e.apply(this, arguments);
        if (zz && zz.shots) zz.shots.slice(m).forEach(s => {
          if (!(s instanceof Vis) || !s.render || s.fumi) return;
          s.fumi = 1; const w = Math.abs(q.x - x0) + 20, life = s.life;
          s.render = (ctx, x, y, t) => bank(ctx, x, y, w, typeof t === 'number' ? t : (s.t || 0), life);
        });
        return o;
      };
    }
    return r;
  };

  // ================= I: Boiler Burst: the needle climbs, then the boiler goes =================
  function rivets(ctx, x, y, R, k, t) {   // the boiler's seam round him, its rivets heating up
    const hot = k > 0.6;
    for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2 + 0.3, rx = Math.round(x + Math.cos(a) * R), ry = Math.round(y + Math.sin(a) * R * 0.75); art.rect(ctx, C.out, rx - 1, ry - 1, 4, 4); art.rect(ctx, hot && (t + i) % 3 ? C.red : C.br2, rx, ry, 2, 2); }
    if (k > 0.3 && t % 3 === 0) { const a = (t * 1.3) % (PI * 2); puff(ctx, x + Math.cos(a) * R, y + Math.sin(a) * R * 0.75 - 3, 2.5); }
  }
  function blowout(ctx, x, y, R, k, t) {   // the boiler goes: a ring of steam, rivets and the gauge blown off
    const a = 1 - ease((k - 0.5) / 0.5);
    for (let i = 0; i < 12; i++) { const an = i / 12 * PI * 2, rr = R * ease(Math.min(1, k * 2.2)); puff(ctx, x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.6, 8 * (1 - k) + 3, { a }); }
    ctx.save(); ctx.globalAlpha *= a;
    for (let i = 0; i < 8; i++) { const an = i / 8 * PI * 2 + 0.2, rr = R * 1.3 * k, gx = x + Math.cos(an) * rr, gy = y + Math.sin(an) * rr * 0.7 + 40 * k * k; art.rect(ctx, C.out, Math.round(gx) - 1, Math.round(gy) - 1, 4, 4); art.rect(ctx, i % 2 ? C.br2 : C.br, Math.round(gx), Math.round(gy), 2, 2); }
    ctx.restore();
    if (k < 0.25) art.disc(ctx, C.w, x, y, Math.round(14 * (1 - k * 4)) + 1);
    gauge(ctx, x + 14 * k, y - 36 - 50 * k + 70 * k * k, 9, 1.06, { a, crack: true });   // blown off, still pinned in the red
  }
  const _bb = CASTS.boiler_burst;
  CASTS.boiler_burst = function (p, z) {
    const n0 = z.shots.length, r = _bb.apply(this, arguments);
    if (!isF(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
    let fired = false, tb = -1;
    if (drv && drv.end) { const _e = drv.end; drv.end = function () { fired = true; return _e.apply(this, arguments); }; }
    z.shots.push(new Vis(p.x, p.y, 34, (ctx, sx, sy, t) => {
      if (fired && tb < 0) tb = t;
      if (!fired) {
        if (drv && drv.gone) return;   // knocked out of it
        const k = Math.min(1, t / 12), sh = k > 0.6 ? (t % 2 ? 1 : -1) : 0;
        rivets(ctx, sx, sy - 18, 22, k, t);
        gauge(ctx, sx + sh, sy - 54, 9, 0.15 + ease(k) * 0.95);
        return;
      }
      const u = t - tb, k = u / 20;
      if (k >= 1) return;
      if (u < 4) PX.impact(ctx, sx, sy - 18, u / 4, 29);
      blowout(ctx, sx, sy - 18, 62, k, t);
    }, v => { if (!fired) { v.x = p.x; v.y = p.y; } }));
    return r;
  };

  // ================= S+I: Geyser Field: a floor vent rattles open, then the geyser =================
  function grate(ctx, x, y, w, k, t) {
    const ww = Math.max(2, Math.round(w * ease(k))), rat = k > 0.6 && t % 2 ? 1 : 0, y0 = y - 3 - rat;
    art.rect(ctx, C.out, Math.round(x - ww / 2) - 3, y0 - 1, ww + 6, 5);
    art.rect(ctx, C.iron2, Math.round(x - ww / 2), y0, ww, 3);
    for (let i = 2; i < ww - 1; i += 3) art.rect(ctx, C.iron, Math.round(x - ww / 2) + i, y0, 1, 3);
    art.rect(ctx, C.br, Math.round(x - ww / 2) - 2, y0, 2, 3); art.rect(ctx, C.br, Math.round(x + ww / 2), y0, 2, 3);
  }
  function geyser(ctx, sx, sy, t, delay) {
    if (t < delay) {
      const k = t / delay; grate(ctx, sx, sy, 18, k, t);
      if (k > 0.4 && t % 4 < 2) puff(ctx, sx + Math.sin(t) * 4, sy - 7 - (t % 4) * 2, 2.5, { a: 0.8 });
      return;
    }
    const k = t - delay, hh = Math.round(72 * Math.min(1, k / 4) * (k > 22 ? Math.max(0, 1 - (k - 22) / 8) : 1));
    grate(ctx, sx, sy, 18, 1, 0);
    if (hh <= 0) return;
    for (let i = 0; i < hh; i += 4) {   // the column: grey edges, pale body, a white-hot core
      const w = Math.round(12 + Math.sin(i * 0.4 + k * 0.9) * 2), ox = Math.round(Math.sin(i * 0.15 + k * 0.5) * 2);
      art.rect(ctx, C.sh, sx - w / 2 - 1 + ox, sy - i - 8, w + 2, 4); art.rect(ctx, C.st0, sx - w / 2 + ox, sy - i - 8, w, 4); art.rect(ctx, C.st, sx - w / 2 + 2 + ox, sy - i - 8, w - 5, 4); art.rect(ctx, C.w, sx - 1 + ox, sy - i - 8, 2, 4);
    }
    for (let i = 10; i < hh; i += 14) puff(ctx, sx + Math.sin(i * 0.3 + k * 0.7) * 5, sy - i - 6, 4 + i * 0.04);
    puff(ctx, sx, sy - hh - 4, 8 + Math.min(4, k * 0.5));   // the crown
    if (k < 4) puff(ctx, sx, sy - 6, 9, { mono: C.w });
    specks(ctx, sx, sy - hh * 0.6, 24, 30, t, 3, 1 - k / 30);
  }
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.fumi;
  if (BU && BU.cast) {
    const _gf = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _gf.apply(this, arguments);
      if (!isF(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!(s instanceof Vis) || !s.render || s.fumi || [36, 44, 52].indexOf(s.life) < 0) return;
        s.fumi = 1; const delay = s.life - 30;
        s.render = (ctx, x, y, t) => geyser(ctx, x, y, typeof t === 'number' ? t : (s.t || 0), delay);
      });
      return r;
    };
  }

  // ================= W+O: Whistle =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.fumi;
  if (SIG && SIG.cast) {
    const _wh = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _wh.apply(this, arguments);
      if (!isF(G)) return r;
      z.shots.push(new Vis(p.x, p.y, 26, (ctx, sx, sy, t) => {
        const a = 1 - ease((t - 18) / 8), wx = sx, wy = sy - 44;
        jet(ctx, wx, wy - 14, -PI / 2, 26, (t % 8) / 8 * 0.7, t, { thin: true });
        whistle(ctx, wx, wy, { a, mono: t < 2 ? C.w : undefined });
        ctx.save(); ctx.globalAlpha *= a;
        for (let i = 0; i < 3; i++) {   // chevrons of sound, sharp, both ways
          const rr = ((t * 3 + i * 12) % 36) + 10, s = 4 + rr * 0.08;
          ctx.globalAlpha = a * (1 - rr / 48);
          [-1, 1].forEach(e => { const cx = Math.round(wx + e * rr), cy = wy - 8; art.line(ctx, C.w, cx - e * s, Math.round(cy - s), cx, cy, 1); art.line(ctx, C.w, cx - e * s, Math.round(cy + s), cx, cy, 1); });
        }
        ctx.restore();
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= J: his palms vent steam through a brass flange; the finisher spins a valve open =================
  function dressJ(p, z) {
    const a = p.atk;
    if (!a || (p.state !== 'attack' && p.state !== 'airatk') || p.st !== a.hitAt) return;
    const d = p.face, fin = !!a.fin, life = fin ? 16 : 9;
    z.shots.push(new Vis(p.x, p.y, life, (ctx, sx, sy, t) => {
      const hx = sx + d * 18, hy = sy - 20, k = t / life;
      if (fin) { wheel(ctx, hx, hy, 8, t * 0.5 * d, { a: 1 - ease((k - 0.6) / 0.4), mono: t < 2 ? C.w : undefined }); jet(ctx, hx + d * 6, hy, dirAng(d), 46, k, t); }
      else {
        // (the hit spark sits on the fist, so the vent shows round it: a brass flange at the wrist, steam blown up and
        // back off the palm, and a short jet angled up past the spark)
        ctx.save(); ctx.globalAlpha *= 1 - ease((k - 0.5) / 0.5);
        const fx0 = Math.round(hx - d * 6);
        art.rect(ctx, C.out, fx0 - 2, hy - 7, 5, 14); art.rect(ctx, C.br, fx0 - 1, hy - 6, 3, 12); art.rect(ctx, C.br3, fx0 - 1, hy - 6, 1, 12); art.rect(ctx, C.iron, fx0, hy - 4, 1, 1); art.rect(ctx, C.iron, fx0, hy + 3, 1, 1);
        ctx.restore();
        for (let i = 0; i < 3; i++) puff(ctx, hx - d * (3 + i * 5), hy - 6 - ease(k) * 12 - i * 3, 3 + k * 3 - i * 0.5, { a: 1 - k });
        jet(ctx, hx + d * 2, hy - 4, d > 0 ? -0.55 : PI + 0.55, 26, k, t, { snap: true });
      }
    }, v => { v.x = p.x; v.y = p.y; }));
  }

  // ================= the small auras, and his pressure gauge =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, t = p.t || SW.frame;
    if (p.modeT > 0) {   // High Pressure: short pipes on his shoulders blowing off steam
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade;
      [-1, 1].forEach(e => { const px = Math.round(sx - d * 4 + e * 5), py = sy - 36; art.rect(ctx, C.out, px - 2, py - 1, 4, 6); art.rect(ctx, C.br, px - 1, py, 2, 4); art.rect(ctx, C.br3, px - 1, py, 1, 1); });
      ctx.restore();
      const k = (t % 18) / 18; if (k < 0.6) { jet(ctx, sx - d * 4 - 5, sy - 38, -PI / 2 - 0.25, 12, k / 0.6, t, { thin: true }); jet(ctx, sx - d * 4 + 5, sy - 38, -PI / 2 + 0.25, 12, k / 0.6, t, { thin: true }); }
    }
    if (p.awakeT > 0) {   // Full Boil: a small red-hot gauge on his chest, heat specks at his feet
      const fade = Math.min(1, p.awakeT / 30);
      gauge(ctx, sx + d * 2, sy - 25, 4, 1.02, { a: fade });
      specks(ctx, sx, sy - 2, 22, 18, t, 3, fade);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isF(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isF(g || this.G) && z && z.shots && !this.dead) dressJ(this, z); return r; };
  const TR = N.TRAITS && N.TRAITS.pressure;
  if (TR && TR.mark) {   // his pressure: a little brass gauge; at full it shakes in the red and leaks
    const _mk = TR.mark;
    TR.mark = function (ctx, p, x, y) {
      if (!FB.on) return _mk.apply(this, arguments);
      const n = p.press || 0; if (!n) return;
      const full = n >= 100;
      gauge(ctx, x + (full && SW.frame % 4 < 2 ? 1 : 0), y - 56, 5, full ? 1.02 : n / 100 * 0.78);
      if (full && SW.frame % 16 < 8) art.rect(ctx, C.st, x + 4, y - 64 - (SW.frame % 16) / 3, 2, 2);
    };
  }

  // ================= W+I: Meltdown =================
  const _md = N.ULT && N.ULT.meltdown;
  if (_md) N.ULT.meltdown = function (p, z, foes) {
    const r = _md.apply(this, arguments);
    if (!isF(G)) return r;
    if (p.st === 6) {
      const sky = new Vis(0, 0, 72, (ctx, x, y, t) => {   // (screen space) a brass pipe over the arena; every valve on it blows
        const k = Math.min(1, t / 10, (72 - t) / 10), py = Math.round(H * 0.19);   // (below the cinematic letterbox)
        ctx.save(); ctx.globalAlpha = 0.22 * k; ctx.fillStyle = '#3a1414'; ctx.fillRect(0, 0, W, H); ctx.restore();
        ctx.save(); ctx.globalAlpha *= k;
        art.rect(ctx, C.out, 0, py - 4, W, 9); art.rect(ctx, C.br, 0, py - 3, W, 7); art.rect(ctx, C.br2, 0, py - 3, W, 2); art.rect(ctx, C.br0, 0, py + 3, W, 1);
        ctx.restore();
        for (let i = 0; i < 6; i++) {
          const vx = Math.round(W * (i + 0.5) / 6), t0 = 6 + i * 5;
          art.rect(ctx, C.out, vx - 4, py - 6, 9, 13); art.rect(ctx, C.br, vx - 3, py - 5, 7, 11);   // the flange
          wheel(ctx, vx, py - 12, 6, t >= t0 ? (t - t0) * 0.6 : 0, { a: k });
          if (t >= t0) jet(ctx, vx, py + 6, PI / 2 + (i % 2 ? 0.12 : -0.12), 60, ((t - t0) % 14) / 14 * 0.8, t + i);
        }
      });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('fumi') >= 0) finale(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target, the blow at FIN): a great gauge swings
  // into the red over the target, its glass cracks; on the blow it bursts on an impact frame - steam, glass and brass
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const gx = sx, gy = sy - 30;
      if (st < FIN) {
        const k = ease((st - 74) / (FIN - 74)), sh = k > 0.6 ? ((st % 2) ? 1 : -1) * Math.round(k * 2) : 0;
        if (st % 3 === 0) puff(ctx, gx + Math.sin(st) * 14, gy + 12, 3 + k * 2, { a: 0.8 });
        gauge(ctx, gx + sh, gy, 12 + k * 6, 0.25 + k * 0.85, { a: Math.min(1, (st - 74) / 5), crack: st >= FIN - 8 });
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, gx, gy, ik, 41);
        const a = 1 - ease((k - 0.5) / 0.5);
        for (let i = 0; i < 10; i++) { const an = i / 10 * PI * 2, rr = 52 * ease(Math.min(1, k * 2)); puff(ctx, gx + Math.cos(an) * rr, gy + Math.sin(an) * rr * 0.65, 11 * (1 - k) + 4, { a, mono: ik < 0.5 ? C.w : undefined }); }
        ctx.save(); ctx.globalAlpha *= a;
        for (let i = 0; i < 12; i++) { const an = i / 12 * PI * 2 + 0.3, rr = 70 * k, bx = Math.round(gx + Math.cos(an) * rr), by = Math.round(gy + Math.sin(an) * rr * 0.7 + 30 * k * k); art.rect(ctx, C.out, bx - 1, by - 1, 4, 4); art.rect(ctx, i % 3 ? C.glass : C.br2, bx, by, 2, 2); }
        ctx.restore();
        if (k < 0.3) art.disc(ctx, C.w, gx, gy, Math.round(18 * (1 - k / 0.3)) + 1);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
