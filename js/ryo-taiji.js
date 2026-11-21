'use strict';
// Shattered Worlds — Ryo's taiji (2026-11-20, the hero-look rework: cool, not cute). His story: the closer of tears,
// light in one hand and dark in the other; a gi white on one side and black on the other. His taiji was a split disc
// of stacked bars and his palms plain orbs. Now it is the real figure - two halves curled round each other in an S,
// each holding an eye of the other, a thin gold line round it, turning - and his palms are palm prints of light and of
// dark, each with the other's dot at its heart. Crisp pixel art (js/pixel-kit.js; the taiji baked once per turn).
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/mako-mech.js.
//   U      Light Palm: a white palm print with a small dark dot, a trail of light
//   S+U    Light Step: a white streak, and a faint black dot left where he stood
//   I      Dark Palm: a black palm print with a white dot, lines of air pulled in toward it
//   S+I    Eclipse: a white orb and a black orb circle the foe and meet as a taiji that flares gold
//   W+O    Taiji Turn: the great circle as a full turning yin-yang with a gold rim
//   J      the last blow: a half circle, white or dark by the side he is on
//   S+O    Centered: a small yin-yang turning behind him      O  Oneness: a larger one, and both palms glowing, one
//          white, one dark (both small on purpose: the view stays clear)
//   (trait) his Balance: beads, white and black
//   W+I    Harmony: a great taiji turning over the arena; in the cinematic finish (js/ult-cinema.js) its two halves
//          come apart and close on the target like two hands, flaring gold on an impact frame
// SW.ryoTaiji.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !CASTS.light_palm || !CASTS.dark_palm) return;
  const RT = SW.ryoTaiji = { on: true };
  const isR = g => !!(RT.on && g && g.state && g.state.hero === 'ryo');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0a0a0e', blk: '#1a1a1a', blk2: '#3a3a44', wh: '#ffffff', wh2: '#fff8e8', gold: '#d4a017', gold2: '#ffe08a' };

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  // the taiji, radius r, turned to ang; ring draws the gold line round it
  function taiji(ctx, x, y, r, ang, a, ring) {
    const Rr = Math.max(3, R(r)), step = ((R(ang / (PI / 12)) % 24) + 24) % 24, b = Rr * 2 + 6;
    const cv = baked('t' + Rr + '_' + step + (ring ? 'g' : ''), b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.rotate(step * PI / 12);
      q.beginPath(); q.arc(0, 0, Rr, 0, PI * 2); q.fillStyle = C.blk; q.fill();
      q.beginPath(); q.arc(0, 0, Rr, -PI / 2, PI / 2); q.arc(0, Rr / 2, Rr / 2, PI / 2, -PI / 2, true); q.arc(0, -Rr / 2, Rr / 2, PI / 2, -PI / 2, false); q.closePath(); q.fillStyle = C.wh; q.fill();   // the white half, curled
      q.beginPath(); q.arc(0, -Rr / 2, Math.max(1, Rr / 6), 0, PI * 2); q.fillStyle = C.blk; q.fill();   // the dark eye in the light
      q.beginPath(); q.arc(0, Rr / 2, Math.max(1, Rr / 6), 0, PI * 2); q.fillStyle = C.wh; q.fill();    // the light eye in the dark
      if (ring) { q.strokeStyle = C.gold; q.lineWidth = Math.max(1, Rr * 0.08); q.beginPath(); q.arc(0, 0, Rr + 1, 0, PI * 2); q.stroke(); }
    }, { pal: [C.out, C.blk, C.blk2, C.wh, C.wh2, C.gold, C.gold2], outline: C.out, keepThin: true }));
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore();
  }
  RT.taiji = taiji;
  // a palm print, white (light) or black (dark), the other's dot at its heart
  function palm(ctx, x, y, s, d, light, a) {
    const S = Math.max(8, R(s)), b = R(S * 1.5) + 4, side = d < 0 ? 1 : 0;
    const cv = baked('p' + S + side + (light ? 'l' : 'd'), b, b, (c, cx, cy) => PX.sprite(c, cx, cy, b, b, q => {
      q.scale(d < 0 ? -1 : 1, 1); const u = S / 12, col = light ? C.wh : C.blk, dot = light ? C.blk : C.wh;
      q.fillStyle = col; q.beginPath(); q.ellipse(0, 2 * u, 3.6 * u, 3.6 * u, 0, 0, PI * 2); q.fill();
      [[-3.4, -5.4, 4.6], [-1.6, -6.6, 5.6], [0.3, -6.2, 5.2], [2.1, -4.8, 4]].forEach(([fx0, fy0, fh]) => { q.beginPath(); q.arc(fx0 * u + 0.75 * u, fy0 * u + 0.75 * u, 0.75 * u, PI, 0); q.lineTo(fx0 * u + 1.5 * u, fy0 * u + fh * u); q.lineTo(fx0 * u, fy0 * u + fh * u); q.closePath(); q.fill(); });
      q.save(); q.translate(3.2 * u, 1.4 * u); q.rotate(0.9); q.fillRect(-0.75 * u, -3.4 * u, 1.5 * u, 3.4 * u); q.restore();
      q.fillStyle = dot; q.beginPath(); q.arc(0, 2 * u, 1.1 * u, 0, PI * 2); q.fill();
    }, { outline: light ? C.blk2 : C.gold, keepThin: true }));
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore();
  }
  function orb(ctx, x, y, r, light, t) { art.disc(ctx, C.out, R(x), R(y), r + 1); art.disc(ctx, light ? C.wh : C.blk, R(x), R(y), r); art.disc(ctx, light ? C.blk : C.wh, R(x), R(y), Math.max(1, R(r / 3))); if (light) art.glow(ctx, R(x), R(y), r + 5, C.wh2, 0.16); void t; }

  // ================= U / I: the palms =================
  function dressShots(z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.ryo || s.team === 'enemy' || s.w !== 12 || s.h !== 12 || s.life !== 40) return;
      if (s.r === 5 && !s.ghost) { s.ryo = 1; s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1; ctx.save(); ctx.globalAlpha *= 0.6; for (let i = 1; i <= 3; i++) art.rect(ctx, C.wh2, R(x - d * (6 + i * 5)), R(y - 1 + (i % 2)), 3, 1); ctx.restore(); palm(ctx, x, y, 16, d, true); }; }
      else if (s.r === 6 && s.ghost) { s.ryo = 1; s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1, t = q.t || 0; for (let i = 0; i < 6; i++) { const an = i / 6 * PI * 2 + 0.3, ph = ((t * 0.08 + i / 6) % 1), rr = 26 * (1 - ph) + 8; ctx.save(); ctx.globalAlpha *= 0.7 * ph; art.line(ctx, C.blk2, R(x + Math.cos(an) * rr), R(y + Math.sin(an) * rr), R(x + Math.cos(an) * (rr - 5)), R(y + Math.sin(an) * (rr - 5)), 1); ctx.restore(); } palm(ctx, x, y, 18, d, false); }; }   // air pulled in toward it
    });
  }

  // ================= S+U: Light Step =================
  const _ls = CASTS.light_step;
  if (_ls) CASTS.light_step = function (p, z) {
    const x0 = p.x, y0 = p.y, n0 = z.shots.length, r = _ls.apply(this, arguments);
    if (!isR(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
    z.shots.push(new Vis(x0, y0, 40, (ctx, sx, sy, t) => {
      const dx = p.x - x0, a = t < 10 ? 1 : 1 - (t - 10) / 30;
      if (!drv || !drv.gone || t < 14) { ctx.save(); ctx.globalAlpha *= Math.min(1, a); art.line(ctx, C.wh, sx, sy - 22, R(sx + dx), sy - 22, 2); art.line(ctx, C.wh2, sx, sy - 18, R(sx + dx), sy - 18, 1); ctx.restore(); }
      orb(ctx, sx, sy - 20, 3, false, t);   // the dark dot left behind
    }));
    return r;
  };

  // ================= S+I: Eclipse =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.ryo;
  const HOST = BU && BU.cast ? BU : null, _ec = HOST ? HOST.cast : null;   // (Eclipse is his S+I: SW.moves.BURST.ryo)
  if (_ec) HOST.cast = function (p, z) {
    const n0 = z.shots.length, r = _ec.apply(this, arguments);
    if (!isR(G)) return r;
    const v = z.shots.slice(n0).find(s => s && s.life === 40 && typeof s.render === 'function');
    if (v) v.render = (ctx, x, y, t) => {
      t = typeof t === 'number' ? t : (v.t || 0);
      const rr = Math.max(2, 30 - t * 0.75), an = t * 0.3;
      if (t < 34) { orb(ctx, x + Math.cos(an) * rr, y - 20 + Math.sin(an) * rr * 0.5, 5, true, t); orb(ctx, x - Math.cos(an) * rr, y - 20 - Math.sin(an) * rr * 0.5, 5, false, t); }
      if (t >= 30) { const k = (t - 30) / 10; taiji(ctx, x, y - 20, 8 + k * 10, t * 0.4, 1 - ease((k - 0.6) / 0.4), true); if (t >= 38) { ctx.save(); ctx.globalAlpha *= 0.8; for (let i = 0; i < 12; i++) { const a2 = i / 12 * PI * 2; art.line(ctx, i % 2 ? C.gold : C.gold2, R(x + Math.cos(a2) * 18), R(y - 20 + Math.sin(a2) * 18), R(x + Math.cos(a2) * 30), R(y - 20 + Math.sin(a2) * 30), 1); } ctx.restore(); } }
    };
    return r;
  };

  // ================= W+O: Taiji Turn, and the ultimate's great circle: the real taiji =================
  function dressCircles(p, z) {
    z.shots.forEach(s => {
      if (s.ryo || !(s instanceof Vis) || typeof s.render !== 'function' || !(s.life === 30 || s.life === 64)) return;
      const src = String(s.render); s.ryo = 1;
      if (src.indexOf('taiji(ctx') < 0) return;
      if (s.life === 30) s.render = (ctx, x, y, t) => { const px = R(p.x - G.cam.x), py = R(p.y - G.cam.y) - 20; taiji(ctx, px, py, 26, t * 0.25, Math.min(1, (30 - t) / 10), true); if (t < 8) { ctx.save(); ctx.globalAlpha *= 1 - t / 8; for (let j = 0; j < 30; j++) { const an = j / 30 * PI * 2; art.rect(ctx, C.gold2, R(px + Math.cos(an) * (28 + t * 2)), R(py + Math.sin(an) * (28 + t * 2)), 1, 1); } ctx.restore(); } };
      else s.render = (ctx, x, y, t) => taiji(ctx, W / 2, 70, 40, t * 0.08, 0.75 * Math.min(1, t / 10, (64 - t) / 10), true);
    });
  }

  // ================= J: the last blow, a half circle by side =================
  function dressJ(p, z) {
    const a = p.atk;
    if (!a || !a.fin || (p.state !== 'attack' && p.state !== 'airatk') || p.st !== a.hitAt) return;
    const d = p.face, light = p.side !== 'dark', x = p.x + d * 22, y = p.y - 20;
    z.shots.push(new Vis(x, y, 12, (ctx, sx, sy, t) => { const k = t / 12, sw = ease(Math.min(1, k * 3)); ctx.save(); ctx.globalAlpha *= 1 - ease((k - 0.5) / 0.5); for (let i = 0; i <= 12; i++) { const u = i / 12; if (u > sw) break; const an = -PI / 2 + d * PI * u, px = R(sx + Math.cos(an) * 14 * d * (d > 0 ? 1 : -1)), py = R(sy + Math.sin(an) * 14); art.rect(ctx, C.out, px - 2, py - 2, 5, 5); art.rect(ctx, light ? C.wh : C.blk, px - 1, py - 1, 3, 3); } ctx.restore(); }));
  }

  // ================= the small auras, and his Balance =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (behind && p.awakeT > 0) { const fade = Math.min(1, p.awakeT / 30); taiji(ctx, sx - d * 4, sy - 24, 16, t * 0.03, 0.55 * fade, true); }   // Oneness: a larger one
    else if (behind && p.modeT > 0) { const fade = Math.min(1, p.modeT / 30); taiji(ctx, sx - d * 6, sy - 30, 7, t * 0.05, 0.75 * fade, true); }   // Centered: a small one
    if (!behind && p.awakeT > 0) { const fade = Math.min(1, p.awakeT / 30); art.glow(ctx, sx + d * 9, sy - 20, 6, C.wh2, 0.3 * fade); ctx.save(); ctx.globalAlpha *= fade; art.rect(ctx, C.wh, sx + d * 9 - 1, sy - 21, 3, 3); art.rect(ctx, C.out, sx - d * 5 - 2, sy - 22, 5, 5); art.rect(ctx, C.blk, sx - d * 5 - 1, sy - 21, 3, 3); ctx.restore(); }   // both palms glowing
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isR(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isR(g || this.G) && z && z.shots && !this.dead) { dressShots(z); dressCircles(this, z); dressJ(this, z); } return r; };
  const TR = N.TRAITS && N.TRAITS.balance;
  if (TR && TR.mark) {   // his Balance: beads, white and black
    const _mk = TR.mark;
    TR.mark = function (ctx, p, x, y) {
      if (!RT.on) return _mk.apply(this, arguments);
      if (!p.bal) return;
      for (let i = 0; i < 3; i++) { const bx = x - 7 + i * 6, on = i < p.bal, white = (i % 2 === 0) === (p.side === 'light'); art.rect(ctx, '#05060c', bx - 1, y - 52, 5, 5); art.rect(ctx, on ? (white ? C.wh : C.blk2) : '#2a2a30', bx, y - 51, 3, 3); if (on) art.rect(ctx, white ? C.blk : C.wh, bx + 1, y - 50, 1, 1); }
    };
  }

  // ================= W+I: Harmony: the cinematic finish =================
  const _hm = N.ULT && N.ULT.harmony;
  if (_hm) N.ULT.harmony = function (p, z, foes) {
    const r = _hm.apply(this, arguments);
    if (!isR(G) || !z || !z.shots) return r;
    dressCircles(p, z);
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('ryo') >= 0) finale(p, z, T);
    }
    return r;
  };
  // (js/ult-cinema.js: the camera pushes in on the target from st 74, the blow at FIN): the two halves come apart and
  // close on the target like two hands, flaring gold on an impact frame
  function half(ctx, x, y, r, light, ang) {   // one curled half of the taiji
    PX.sprite(ctx, R(x), R(y), r * 2 + 6, r * 2 + 6, q => {
      q.rotate(ang + (light ? 0 : PI));
      q.beginPath(); q.arc(0, 0, r, -PI / 2, PI / 2); q.arc(0, r / 2, r / 2, PI / 2, -PI / 2, true); q.arc(0, -r / 2, r / 2, PI / 2, -PI / 2, false); q.closePath(); q.fillStyle = light ? C.wh : C.blk; q.fill();
      q.beginPath(); q.arc(0, r / 2, Math.max(1, r / 6), 0, PI * 2); q.fillStyle = light ? C.blk : C.wh; q.fill();
    }, { outline: light ? C.gold : C.gold2, keepThin: true });
  }
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const cy = sy - 24;
      if (st < FIN) { const k = ease((st - 74) / (FIN - 74)), gap = 50 * (1 - k) + 2, ang = st * 0.05; half(ctx, sx - gap, cy, 24, true, ang); half(ctx, sx + gap, cy, 24, false, ang); }
      else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 107);
        taiji(ctx, sx, cy, 24 + k * 6, FIN * 0.05 + u * 0.3, 1 - ease((k - 0.5) / 0.5), true);
        ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 16; i++) { const a2 = i / 16 * PI * 2; art.line(ctx, i % 2 ? C.gold : C.gold2, R(sx + Math.cos(a2) * (28 + k * 10)), R(cy + Math.sin(a2) * (28 + k * 10)), R(sx + Math.cos(a2) * (36 + k * 40)), R(cy + Math.sin(a2) * (36 + k * 40)), 1); } ctx.restore();
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
