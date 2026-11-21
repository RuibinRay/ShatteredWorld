'use strict';
// Shattered Worlds — Lin's open palm (2026-11-20, the hero-look rework: cool, not cute). Her story: the Sky Clan's
// calm open palm - "rings of air rippling out of it"; pressure points and seals. White, slate, pale cyan. Her palms
// were blocks of pixels and her air plain rings. Now every strike is the print of an open hand in pale air - a palm,
// four fingers, a thumb - with rings of air rippling out of it, and what she seals carries the seal itself: a ring of
// meridian ticks with its points lit. Crisp pixel art (js/pixel-kit.js; the palm baked once per size). Draw-only:
// every hit, hitbox and timing stays as it was. Loaded after js/yara-lamp.js.
//   U      Air Palm: an open-palm print of air, rings rippling out from it
//   S+U    Turning Wall: a spinning wall of air round her, a calm still circle at its centre
//   I      Palm Rain: every blow an open-palm print; the last throws a ring of air
//   S+I    Heart Strike: one great palm print, and the seal - a pressure-point ring - flaring on the foe
//   W+O    Rippling Palm: a ripple through the air with a palm print at its heart
//   J      every blow lets a small ring of air go; the last is a two-finger strike that flares the seal
//   S+O    Clear Eyes: calm breath lines, a faint glow in her eyes      O  Still Point: a still circle of air round
//          her, two leaves hanging in it (both small on purpose: the view stays clear)
//   W+I    Hundred Palms: palm prints close in from every side; in the cinematic finish (js/ult-cinema.js) a sphere of
//          palms forms round the target, closes, and the seal flares on an impact frame
// SW.linPalm.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !CASTS.air_palm || !CASTS.palm_rain) return;
  const LP = SW.linPalm = { on: true };
  const isL = g => !!(LP.on && g && g.state && g.state.hero === 'lin');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#2a3a48', sl: '#5a6a7a', c: '#5ec8d8', c2: '#bff6ff', c3: '#e8feff', w: '#ffffff', leaf: '#8ab060', leaf2: '#c8e090' };

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  // an open palm of air, fingers up, facing d; s its size (about its height)
  function palmPrint(ctx, x, y, s, d, a, mono) {
    s *= 1.4;   // (2026-11-20 look ranking: the palms were faint and small)
    const S = Math.max(8, R(s)), b = R(S * 1.5) + 4, side = d < 0 ? 1 : 0;
    const cv = baked('p' + S + '_' + side + (mono ? 'm' : ''), b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.scale(d < 0 ? -1 : 1, 1); const u = S / 12;
      const rr = (x0, y0, w, h, col) => { q.fillStyle = col; q.beginPath(); q.moveTo(x0 + w / 2, y0); q.arc(x0 + w / 2, y0 + w / 2, w / 2, PI, 0); q.lineTo(x0 + w, y0 + h); q.lineTo(x0, y0 + h); q.closePath(); q.fill(); };
      q.fillStyle = C.c2; q.beginPath(); q.ellipse(0, 2 * u, 3.6 * u, 3.6 * u, 0, 0, PI * 2); q.fill();   // the palm
      [[-3.4, -5.4, 4.6], [-1.6, -6.6, 5.6], [0.3, -6.2, 5.2], [2.1, -4.8, 4]].forEach(([fx0, fy0, fh]) => rr(fx0 * u, fy0 * u, 1.5 * u, fh * u, C.c2));   // four fingers
      q.save(); q.translate(3.2 * u, 1.4 * u); q.rotate(0.9); rr(-0.75 * u, -3.4 * u, 1.5 * u, 3.4 * u, C.c2); q.restore();   // the thumb
      q.fillStyle = C.c3; q.beginPath(); q.ellipse(-0.8 * u, 1 * u, 1.8 * u, 2 * u, 0, 0, PI * 2); q.fill();   // light in the palm
      q.strokeStyle = C.c; q.lineWidth = 1; q.beginPath(); q.arc(0, 2.4 * u, 2.2 * u, PI * 0.2, PI * 0.9); q.stroke();   // its crease
    }, { pal: [C.out, C.sl, C.c, C.c2, C.c3, C.w], outline: C.out, keepThin: true, mono }));
    ctx.save(); ctx.globalAlpha *= clamp01(a === undefined ? 1 : a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore();
  }
  LP.palmPrint = palmPrint;
  function airRing(ctx, x, y, r, a, sq) {   // a ring of air: dashes, brighter at the front
    if (r < 2 || a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    const m = Math.max(12, R(r * 1.8));
    for (let j = 0; j < m; j++) { if (j % 3 === 2) continue; const an = j / m * PI * 2; art.rect(ctx, Math.cos(an) > 0.3 ? C.w : C.c2, R(x + Math.cos(an) * r * (sq || 0.55)), R(y + Math.sin(an) * r), 1, 1); }
    ctx.restore();
  }
  function seal(ctx, x, y, r, k, t) {   // the seal: a ring of meridian ticks, its points lit, a lock line through it
    const a = k < 0.2 ? k / 0.2 : 1 - ease((k - 0.6) / 0.4);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const m = 24;
    for (let i = 0; i < m; i++) { const an = i / m * PI * 2 + t * 0.02, r0 = r - (i % 3 === 0 ? 4 : 2); art.line(ctx, i % 3 === 0 ? C.w : C.c2, R(x + Math.cos(an) * r0), R(y + Math.sin(an) * r0), R(x + Math.cos(an) * r), R(y + Math.sin(an) * r), 1); }
    for (let i = 0; i < 5; i++) { const an = -PI / 2 + i / 5 * PI * 2, px = R(x + Math.cos(an) * r * 0.55), py = R(y + Math.sin(an) * r * 0.55); art.rect(ctx, C.out, px - 2, py - 2, 4, 4); art.rect(ctx, (t + i * 3) % 10 < 5 ? C.w : C.c, px - 1, py - 1, 2, 2); }   // the five points
    art.line(ctx, C.c3, R(x - r * 0.6), R(y), R(x + r * 0.6), R(y), 1);
    ctx.restore();
  }
  LP.seal = seal;

  // ================= U: Air Palm =================
  function dressPalm(z, n0) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.lin || s.w !== 20 || s.h !== 24 || s.life !== 15) return;
      s.lin = 1;
      s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1, t = q.t || 0, a = Math.min(1, q.life / 6); for (let i = 0; i < 3; i++) airRing(ctx, x - d * (4 + i * 6), y, 6 + i * 4 + (t % 3), a * (0.9 - i * 0.25)); palmPrint(ctx, x + d * 3, y, 18, d, a); };
    });
  }
  const _ap = CASTS.air_palm;
  CASTS.air_palm = function (p, z) { const n0 = z.shots.length, r = _ap.apply(this, arguments); if (isL(G)) dressPalm(z, n0); return r; };

  // ================= the rings she throws: Turning Wall's, the seal's, and Palm Rain's last =================
  let walling = null;
  const _ring = fx.ring;
  fx.ring = function (x, y, col, r0, r1, life) {
    const g = G, z = g && g.zone;
    if (!isL(g) || !z || !z.shots) return _ring.apply(this, arguments);
    if (r0 === 52 && r1 === 34 && life === 8 && walling && !walling.gone) return;   // Turning Wall: its wall is drawn whole
    if (col === C.c3 && r0 === 30 && r1 === 6 && life === 12) {   // the seal
      z.shots.push(new Vis(x, y, 40, (ctx, sx, sy, t) => seal(ctx, sx, sy, 18 - ease(Math.min(1, t / 6)) * 4, t / 40, t)));
      return;
    }
    return _ring.apply(this, arguments);
  };
  const _tw = CASTS.turning_wall;
  if (_tw) CASTS.turning_wall = function (p, z) {
    const n0 = z.shots.length, r = _tw.apply(this, arguments);
    if (!isL(G)) return r;
    walling = z.shots.slice(n0).find(s => s.p === p && s.step) || { gone: false, t: 0 };
    const w0 = walling;
    z.shots.push(new Vis(p.x, p.y, 22, (ctx, sx, sy, t) => {
      if (w0.gone && t > 2) return;
      const cy = sy - 22, a = Math.min(1, t / 3, (22 - t) / 4);
      ctx.save(); ctx.globalAlpha *= a;
      for (let row = 0; row < 7; row++) { const yy = cy - 21 + row * 7, rx = 40 - Math.abs(row - 3) * 2; for (let j = 0; j < 24; j++) { const an = j / 24 * PI * 2 + t * 0.55 + row * 0.4; if (j % 4 === 3) continue; const front = Math.sin(an) > 0; art.rect(ctx, front ? C.w : C.c, R(sx + Math.cos(an) * rx), R(yy + Math.sin(an) * 3), front ? 2 : 1, 1); } }   // the spinning wall
      ctx.restore();
      airRing(ctx, sx, cy, 7, a * 0.9, 1);   // the still circle at its centre
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= I: Palm Rain, S+I: Heart Strike, W+I: Hundred Palms: palm prints =================
  function dressPrints(z) {
    z.shots.forEach(s => {
      if (s.lin || !(s instanceof Vis) || typeof s.render !== 'function' || !(s.life === 6 || s.life === 8 || s.life === 12 || s.life === 16)) return;
      s.lin = 1; if (String(s.render).indexOf('palm(ctx') < 0) return;   // (only js/ninjas2.js's own palm prints)
      const life = s.life, sz = life === 6 ? 14 : life === 8 ? 13 : life === 12 ? 30 : 36, d = (G.player && G.player.face) || 1;
      s.render = (ctx, x, y, t) => { const k = t / life; palmPrint(ctx, x, y - 2, sz * (1 + k * 0.15), d, 1 - k); if (life >= 12) { airRing(ctx, x, y, sz * 0.4 + k * sz * 0.6, 1 - k); airRing(ctx, x, y, sz * 0.2 + k * sz * 0.5, 0.7 * (1 - k)); } };
    });
  }

  // ================= W+O: Rippling Palm =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.lin;
  if (SIG && SIG.cast) {
    const _rp = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _rp.apply(this, arguments);
      if (!isL(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint || s.lin || s.life !== 32) return;
        s.lin = 1;
        s.paint = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1, t = q.t || 0; for (let i = 0; i < 4; i++) { const ph = ((t * 0.08 + i / 4) % 1); airRing(ctx, x - d * ph * 12, y, 6 + ph * 14, 1 - ph, 0.45); } palmPrint(ctx, x, y, 20, d, 1); };
      });
      return r;
    };
  }

  // ================= J: small rings of air; the last a two-finger strike and the seal =================
  function dressJ(p, z) {
    const a = p.atk;
    if (!a || (p.state !== 'attack' && p.state !== 'airatk') || p.st !== a.hitAt) return;
    const d = p.face, fin = !!a.fin, b = a.box || [0, -40, 40, 40], x = p.x + d * (b[0] + b[2] * 0.8), y = p.y + b[1] + b[3] / 2;
    z.shots.push(new Vis(x, y, fin ? 16 : 9, (ctx, sx, sy, t) => {
      const k = t / (fin ? 16 : 9);
      airRing(ctx, sx, sy, 4 + k * 12, 1 - k); airRing(ctx, sx - d * 4, sy, 2 + k * 7, 0.6 * (1 - k));
      if (fin) { if (t < 6) { ctx.save(); ctx.globalAlpha *= 1 - t / 6; art.line(ctx, C.w, R(sx - d * 14), R(sy - 2), R(sx + d * 4), R(sy - 2), 2); art.line(ctx, C.c2, R(sx - d * 14), R(sy + 2), R(sx + d * 4), R(sy + 2), 2); ctx.restore(); } seal(ctx, sx + d * 6, sy, 14, k, t); }   // two fingers, then the seal
    }));
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (behind && p.awakeT > 0) {   // Still Point: a still circle of air round her, two leaves hanging in it
      const fade = Math.min(1, p.awakeT / 30);
      airRing(ctx, sx, sy - 20, 24, 0.55 * fade, 1);
      [[-14, -34], [12, -10]].forEach(([ox, oy], i) => { const lx = R(sx + ox), ly = R(sy + oy + Math.sin(t * 0.02 + i) * 1); ctx.save(); ctx.globalAlpha *= fade; art.rect(ctx, C.out, lx - 3, ly - 2, 6, 4); art.rect(ctx, i ? C.leaf : C.leaf2, lx - 2, ly - 1, 4, 2); ctx.restore(); });
    }
    if (!behind && p.modeT > 0) {   // Clear Eyes: calm breath lines, a faint glow in her eyes
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade * 0.7;
      for (let i = 0; i < 2; i++) { const ph = ((t * 0.02 + i * 0.5) % 1); art.line(ctx, C.c2, R(sx + d * (6 + ph * 10)), R(sy - 30 - ph * 6), R(sx + d * (10 + ph * 12)), R(sy - 32 - ph * 6), 1); }
      ctx.restore();
      art.rect(ctx, C.c3, sx + (d > 0 ? 1 : -2), sy - 33, 1, 1);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isL(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isL(g || this.G) && z && z.shots && !this.dead) { dressPrints(z); dressJ(this, z); } return r; };

  // ================= W+I: Hundred Palms: the cinematic finish =================
  const UL = N.ULT && N.ULT.hundred_palms;
  if (UL) N.ULT.hundred_palms = function (p, z, foes) {
    const r = UL.apply(this, arguments);
    if (!isL(G) || !z || !z.shots) return r;
    dressPrints(z);
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('lin') >= 0) finale(p, z, T);
    }
    return r;
  };
  // (js/ult-cinema.js: the camera pushes in on the target from st 74, the blow at FIN): a sphere of palms forms round
  // the target and closes; on the blow the seal flares on an impact frame
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const cy = sy - 24;
      if (st < FIN) {
        const k = ease((st - 74) / (FIN - 74)), rr = 60 - k * 34;
        for (let i = 0; i < 12; i++) { const an = i / 12 * PI * 2 + st * 0.02, z3 = Math.sin(an * 2 + st * 0.05); palmPrint(ctx, sx + Math.cos(an) * rr, cy + Math.sin(an) * rr * 0.8, 12 + z3 * 2, Math.cos(an) > 0 ? -1 : 1, Math.min(1, (st - 74) / 6) * (0.75 + z3 * 0.25)); }
        airRing(ctx, sx, cy, rr + 8, 0.5, 0.8);
      } else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 83);
        seal(ctx, sx, cy, 30, Math.min(0.99, 0.2 + k), st);
        for (let i = 0; i < 3; i++) airRing(ctx, sx, cy, 10 + k * (40 + i * 20), 1 - k, 0.8);
        const push = Math.min(1, u / 2), dir = T.x >= p.x ? 1 : -1;
        palmPrint(ctx, sx - dir * (20 - push * 14), cy, 46, dir, 1 - ease((k - 0.5) / 0.5), ik < 0.5 ? C.w : undefined);   // one great open palm, pressed into them
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
