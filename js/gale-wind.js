'use strict';
// Shattered Worlds — Gale's wind (2026-11-20, the hero-look rework: cool, not cute). His story: the Paper Post's
// courier, the boy the wind carried up out of Deepline; "wind and leaves spiralling round his open hand", long flowing
// sashes; teal-green and white. His wind was stacked green bars and a plain crescent. Now it carries things you can
// see: leaves (teal-green, a few gone gold) and the Paper Post's letters, wind lines that curl, real funnels (stacked
// rings, narrow at the floor) with leaves riding them, and his sashes streaming. Crisp pixel art (js/pixel-kit.js; the
// leaves and letters are baked once per angle). Draw-only: every hit, hitbox and timing stays as it was. Loaded after
// js/nyra-verse.js.
//   U      Wind Blade: a crescent of wind with leaves caught in it and a streak of sash behind
//   S+U    Updraft: a spiral of leaves lifting off the floor, wind lines winding up with them
//   I      Cyclone: a real funnel, leaves and a letter whirling in it
//   S+I    Downdraft Kick: leaves streak behind him on the way up, wind lines pour down on the dive, and the gust where
//          he lands throws leaves out both ways
//   W+O    Twin Tornado: two small leaf funnels
//   J      every blow is a curl of wind that flings leaves; the last one throws a letter too
//   S+O    Tailwind: his sashes stream long behind him, leaves trail his feet      O  Storm Dancer: a ring of wind
//          round his waist with leaves riding it (both small on purpose: the view stays clear)
//   W+I    Hurricane: the sky goes green-grey, leaves and letters blow across it, the two great funnels are full of
//          them; on the finishing blow (js/ult-grand.js) the wind closes round the target in a tightening ring of
//          leaves and letters and bursts on an impact frame
// SW.galeWind.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj, Twister = SW.Twister;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !Twister || !CASTS.wind_blade) return;
  const GW = SW.galeWind = { on: true };
  const isG = g => !!(GW.on && g && g.state && g.state.hero === 'gale');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0b2a22', g0: '#1f6f4f', g: '#3fbf7f', g2: '#7dffb2', w: '#eafff4', wh: '#ffffff', y0: '#a07a2a', y: '#e9c46a', pa: '#f4efe0', pa2: '#b9ae90', red: '#c0392b', sash: '#2ec4a0', sash0: '#14806a' };
  const PAL = [C.out, C.g0, C.g, C.g2, C.w, C.wh, C.y0, C.y, C.pa, C.pa2, C.red, C.sash, C.sash0];

  // ---------- baked pieces (drawn once per angle through the pixel kit; dropped if the canvas loses its context) ----------
  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  const blit = (ctx, cv, x, y, a) => { if (a !== undefined && a <= 0) return; ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore(); };
  const LEAF = [[C.g, C.g0], [C.g2, C.g], [C.y, C.y0]];
  function leaf(ctx, x, y, ang, kind, a, sz) {   // a leaf, turned to ang; kind 0 green, 1 pale green, 2 gold
    const step = ((R(ang / (PI / 8)) % 8) + 8) % 8, k = kind % 3, S = sz || 1.6, B = R(14 * S);   // (2026-11-20 look ranking: 1.6x, they were specks)
    const cv = baked('l' + step + k + '_' + S, B, B, (c, cx, cy) => PX.sprite(c, cx, cy, B, B, q => {
      q.rotate(step * PI / 8); q.scale(S, S);
      q.beginPath(); q.moveTo(-5, 0); q.quadraticCurveTo(0, -3.4, 5, 0); q.quadraticCurveTo(0, 3.4, -5, 0); q.fillStyle = LEAF[k][0]; q.fill();
      q.strokeStyle = LEAF[k][1]; q.lineWidth = 1; q.beginPath(); q.moveTo(-6, 0); q.lineTo(4, 0); q.stroke();
    }, { pal: PAL, outline: C.out, keepThin: true }));
    blit(ctx, cv, x, y, a);
  }
  function letter(ctx, x, y, ang, a, sz) {   // one of the Paper Post's letters: an envelope with a red seal
    const step = ((R(ang / (PI / 8)) % 8) + 8) % 8, S = sz || 1.6, B = R(16 * S);
    const cv = baked('e' + step + '_' + S, B, B, (c, cx, cy) => PX.sprite(c, cx, cy, B, B, q => {
      q.rotate(step * PI / 8); q.scale(S, S);
      q.fillStyle = C.pa; q.fillRect(-5, -3.5, 10, 7);
      q.strokeStyle = C.pa2; q.lineWidth = 1; q.beginPath(); q.moveTo(-5, -3.5); q.lineTo(0, 0.5); q.lineTo(5, -3.5); q.stroke();
      q.fillStyle = C.red; q.fillRect(-1, 0, 2, 2);
    }, { pal: PAL, outline: C.out, keepThin: true }));
    blit(ctx, cv, x, y, a);
  }
  GW.leaf = leaf; GW.letter = letter;
  // half an ellipse of wind (front half bright, back half dim), dashed so it reads as turning
  function band(ctx, cx, cy, rx, ry, t, front, a) {
    if (rx < 2) return;
    ctx.save(); ctx.globalAlpha *= a === undefined ? 1 : clamp01(a);
    const m = Math.max(14, R(rx * 2.2));
    if (front && rx > 5) { ctx.save(); ctx.globalAlpha *= 0.14; ctx.fillStyle = C.w; ctx.beginPath(); ctx.ellipse(R(cx), R(cy), rx, Math.max(1, ry), 0, 0, PI * 2); ctx.fill(); ctx.restore(); }   // a faint body to the ring
    for (let j = 0; j < m; j++) {
      const an = j / m * PI * 2 + t * 0.35, s = Math.sin(an);
      if ((s > 0) !== front) continue;
      if (((j + R(t * 0.5)) % 6) > 3) continue;
      art.rect(ctx, front ? (j % 2 ? C.w : C.wh) : C.g0, R(cx + Math.cos(an) * rx), R(cy + s * ry), front ? 2 : 1, front ? 2 : 1);
    }
    ctx.restore();
  }
  // a funnel of wind standing on (x, y): stacked rings, narrow at the floor, leaves (and letters) riding it
  function funnel(ctx, x, y, w, h, t, o) {
    o = o || {}; const a = o.a === undefined ? 1 : o.a;
    const n = Math.max(5, R(h / 9)), ring = i => { const k = i / (n - 1); return { k, rx: 3 + k * w / 2, cy: y - 4 - k * (h - 8), off: Math.sin(t * 0.3 + i * 0.8) * (2 + k * 5) }; };
    for (let i = 0; i < n; i++) { const r = ring(i); band(ctx, x + r.off, r.cy, r.rx, r.rx * 0.22, t + i * 3, false, a * 0.8); }
    const L = o.leaves || 0, E = o.letters || 0;
    for (let j = 0; j < L + E; j++) {
      const k = ((j * 0.37 + t * 0.012) % 1), an = t * 0.32 + j * 2.1, rx = 3 + k * w / 2, off = Math.sin(t * 0.3 + k * n * 0.8) * (2 + k * 5);
      const lx = x + off + Math.cos(an) * rx, ly = y - 4 - k * (h - 8) + Math.sin(an) * rx * 0.22;
      if (j < L) leaf(ctx, lx, ly, an + PI / 2, j % 3, a); else letter(ctx, lx, ly, an * 0.5, a);
    }
    for (let i = 0; i < n; i++) { const r = ring(i); band(ctx, x + r.off, r.cy, r.rx, r.rx * 0.22, t + i * 3, true, a); }
  }
  GW.funnel = funnel;
  function curl(ctx, x, y, d, Rr, k, tilt, big) {   // a curl of wind: a white arc with a green edge, sweeping
    if (k >= 1) return;
    const sw = ease(Math.min(1, k * 3)), s = R(Rr * 2.8);
    PX.sprite(ctx, x, y, s, s, c => {
      c.scale(d, 1); c.rotate(tilt || 0); c.lineCap = 'round';
      const a0 = -1.2, a1 = a0 + 2.4 * sw;
      c.strokeStyle = C.g; c.lineWidth = big ? 4 : 3; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr, a0, a1); c.stroke();
      c.strokeStyle = C.wh; c.lineWidth = big ? 2 : 1; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr - 1, a0 + 0.2, a1); c.stroke();
      c.strokeStyle = C.w; c.lineWidth = 1; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr * 0.7, a0 + 0.8, a1); c.stroke();   // an inner curl
    }, { pal: PAL, alpha: 1 - ease((k - 0.45) / 0.55), outline: C.out, keepThin: true });
  }
  function streak(ctx, x, y, ang, len, a, col) {   // a wind line
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    art.line(ctx, col || C.w, R(x), R(y), R(x + Math.cos(ang) * len), R(y + Math.sin(ang) * len), 1);
    ctx.restore();
  }

  // ================= U: Wind Blade =================
  function dressBlade(z, n0) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.gale || s.w !== 16 || s.h !== 20 || s.life !== 38) return;
      s.gale = 1;
      s.render = (ctx, x, y, q) => {
        const d = Math.sign(q.vx) || 1, t = q.t || 0;
        ctx.save(); for (let i = 0; i < 10; i++) { const u = i / 10; ctx.globalAlpha = 0.8 * (1 - u); art.rect(ctx, i % 3 ? C.sash : C.w, R(x - d * (8 + i * 3)), R(y + 4 + Math.sin(t * 0.5 + i * 0.7) * 2), 3, 2); } ctx.restore();   // a streak of sash
        PX.sprite(ctx, x, y, 34, 34, c => { c.scale(d, 1); c.lineCap = 'round'; c.strokeStyle = C.g; c.lineWidth = 4; c.beginPath(); c.arc(-6, 0, 11, -1.15, 1.15); c.stroke(); c.strokeStyle = C.wh; c.lineWidth = 2; c.beginPath(); c.arc(-6, 0, 10, -1.0, 1.0); c.stroke(); c.strokeStyle = C.w; c.lineWidth = 1; c.beginPath(); c.arc(-9, 0, 7, -0.8, 0.8); c.stroke(); }, { pal: PAL, outline: C.out, keepThin: true });
        for (let i = 0; i < 3; i++) { const an = t * 0.5 + i * 2.1; leaf(ctx, x + Math.cos(an) * 5 - d * 2, y + Math.sin(an) * 9, an, i); }   // leaves caught in it
      };
    });
  }
  const _wb = CASTS.wind_blade;
  CASTS.wind_blade = function (p, z) { const n0 = z.shots.length, r = _wb.apply(this, arguments); if (isG(G)) dressBlade(z, n0); return r; };

  // ================= S+U: Updraft: a spiral of leaves lifting =================
  const _ud = CASTS.updraft;
  if (_ud) CASTS.updraft = function (p, z) {
    const r = _ud.apply(this, arguments);
    if (!isG(G)) return r;
    const x = p.x + p.face * 26;
    z.shots.push(new Vis(x, p.y, 26, (ctx, sx, sy, t) => {
      const a = 1 - ease((t - 16) / 10);
      for (let i = 0; i < 2; i++) for (let q = 0; q < 14; q++) { const u = q / 14, hgt = u * 72 * ease(Math.min(1, (t + 3) / 8)), an = t * 0.45 + u * 9 + i * PI, rx = 6 + u * 12; if (((q + t) % 3) === 0) continue; ctx.save(); ctx.globalAlpha *= a * (0.4 + u * 0.6); art.rect(ctx, Math.sin(an) > 0 ? C.wh : C.g, R(sx + Math.cos(an) * rx), R(sy - hgt), 2, 2); ctx.restore(); }   // wind lines winding up
      for (let j = 0; j < 9; j++) { const u = ((t / 22) + j / 9) % 1, hgt = u * 70, an = t * 0.4 + j * 1.9, rx = 5 + u * 13; leaf(ctx, sx + Math.cos(an) * rx, sy - 4 - hgt, an + PI / 2, j % 3, a * (1 - u * 0.4)); }
    }));
    return r;
  };

  // ================= I: Cyclone, and the ultimate's funnels: real funnels =================
  const _tw = Twister.prototype.draw;
  Twister.prototype.draw = function (ctx, cam) {
    if (!isG(G) || this.col !== '#7dffb2') return _tw.apply(this, arguments);
    const x = R(this.x - cam.x), y = R(this.y - cam.y), big = this.h > 100;
    funnel(ctx, x, y, this.w, this.h, this.t, { leaves: big ? 16 : 7, letters: big ? 4 : 1, a: Math.min(1, this.life / 12, (this.t + 2) / 4) });
  };

  // ================= S+I: Downdraft Kick =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.gale;
  if (BU && BU.cast) {
    const _dk = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _dk.apply(this, arguments);
      if (!isG(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
      z.shots.push(new Vis(p.x, p.y, 70, (ctx, sx, sy, t) => {
        if (drv && drv.gone) return;
        if (p.vy < 0) for (let j = 0; j < 4; j++) { const u = ((t * 0.1 + j / 4) % 1); leaf(ctx, sx + Math.sin(j * 2.3) * 8, sy + 4 + u * 26, t * 0.4 + j, j % 3, 1 - u); streak(ctx, sx + Math.sin(j * 2.3) * 8, sy + 2 + u * 20, PI / 2, 8, 1 - u); }   // leaves streaking behind him on the way up
        else for (let j = 0; j < 6; j++) { const u = ((t * 0.12 + j / 6) % 1), ox = (j - 2.5) * 5; streak(ctx, sx + ox - p.face * 6, sy - 60 + u * 40, PI / 2 - p.face * 0.25, 14, 0.9 * (1 - u), j % 2 ? C.wh : C.g2); }   // wind pouring down on the dive
      }, v => { v.x = p.x; v.y = p.y; }));
      if (drv && drv.end) {
        const _e = drv.end;
        drv.end = function () {
          const o = _e.apply(this, arguments);
          const gx = p.x, gy = p.y;
          z.shots.push(new Vis(gx, gy, 22, (ctx, sx, sy, t) => {   // the gust where he lands throws leaves out both ways
            const k = t / 22, a = 1 - ease((k - 0.4) / 0.6);
            band(ctx, sx, sy - 3, 10 + 56 * ease(Math.min(1, k * 2)), 5, t, false, a); band(ctx, sx, sy - 3, 10 + 56 * ease(Math.min(1, k * 2)), 5, t, true, a);
            for (let j = 0; j < 10; j++) { const s = j % 2 ? 1 : -1, sp = 0.6 + (j % 5) * 0.12, lx = sx + s * 70 * sp * ease(Math.min(1, k * 1.6)), ly = sy - 6 - (j % 4) * 6 - Math.sin(k * PI) * 20 * sp; leaf(ctx, lx, ly, t * 0.5 * s + j, j % 3, a); }
            for (let j = 0; j < 4; j++) { const s = j % 2 ? 1 : -1; streak(ctx, sx + s * (8 + 40 * k), sy - 8 - j * 4, s > 0 ? 0 : PI, 14, a, C.wh); }
          }));
          return o;
        };
      }
      return r;
    };
  }

  // ================= W+O: Twin Tornado: two small leaf funnels =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.gale;
  if (SIG && SIG.cast) {
    const _tt = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _tt.apply(this, arguments);
      if (!isG(G)) return r;
      z.shots.slice(n0).forEach(s => { if (!s.paint || s.gale || s.life !== 60) return; s.gale = 1; s.paint = (ctx, sx, sy, q) => funnel(ctx, sx, sy + 18, 30, 46, q.t, { leaves: 5, a: Math.min(1, (60 - q.t) / 10, (q.t + 2) / 4) }); });
      return r;
    };
  }

  // ================= J: curls of wind that fling leaves =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (col !== '#eafff4' || !isG(g) || !p || !z || !z.shots || (p.state !== 'attack' && p.state !== 'airatk')) return _slash.apply(this, arguments);
    const d = dir || p.face, a = p.atk, fin = !!(a && a.fin), Rr = Math.max(12, Math.min(28, (len || 22) * 0.75)), tilt = kind === 2 ? 0.5 : kind === 3 ? -0.5 : 0, life = fin ? 16 : 11;
    z.shots.push(new Vis(x, y, life, (ctx, sx, sy, t) => {
      const k = t / life;
      curl(ctx, sx, sy, d, Rr, k, tilt, fin);
      const n = fin ? 5 : 2;
      for (let j = 0; j < n; j++) { const u = ease(Math.min(1, (t + 1) / life * 1.4)), lx = sx + d * (Rr * 0.6 + u * (16 + j * 6)), ly = sy - 6 + (j - n / 2) * 5 - Math.sin(u * PI) * 6; leaf(ctx, lx, ly, t * 0.6 * d + j, j % 3, 1 - ease((k - 0.5) / 0.5)); }
      if (fin) letter(ctx, sx + d * (Rr * 0.6 + ease(Math.min(1, t / 10)) * 30), sy - 14 - t, t * 0.3 * d, 1 - ease((k - 0.6) / 0.4));
    }));
  };

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (behind && p.modeT > 0) {   // Tailwind: his sashes stream long behind him
      const fade = Math.min(1, p.modeT / 30), sp = Math.min(1, Math.abs(p.vx) / 3);
      ctx.save(); ctx.globalAlpha *= fade;
      for (let s = 0; s < 2; s++) for (let i = 0; i < 12; i++) { const u = i / 12, lx = sx - d * (3 + i * (2.2 + sp * 1.2)), ly = sy - 21 + s * 3 + Math.sin(t * 0.3 + i * 0.6 + s) * (1 + u * 3) + u * (1 - sp) * 8; art.rect(ctx, i === 11 ? C.w : s ? C.sash0 : C.sash, R(lx), R(ly), 2, 2); }
      ctx.restore();
    }
    if (!behind && p.awakeT > 0) {   // Storm Dancer: a ring of wind round his waist, leaves riding it
      const fade = Math.min(1, p.awakeT / 30);
      band(ctx, sx, sy - 18, 16, 4, t, false, fade * 0.8);
      for (let j = 0; j < 3; j++) { const an = t * 0.14 + j * 2.09, lx = sx + Math.cos(an) * 16, ly = sy - 18 + Math.sin(an) * 4; if (Math.sin(an) > 0) leaf(ctx, lx, ly, an + PI / 2, j, fade); }
      band(ctx, sx, sy - 18, 16, 4, t, true, fade);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isG(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    if (isG(g || this.G) && z && z.shots && this.modeT > 0 && this.onGround && Math.abs(this.vx) > 2.5 && (this.t || 0) % 6 === 0) {   // Tailwind: leaves trail his feet
      const lx = this.x - this.face * 6, ly = this.y - 3, s = -this.face, k0 = (this.t || 0) % 3;
      z.shots.push(new Vis(lx, ly, 26, (ctx, sx, sy, t) => leaf(ctx, sx + s * t * 0.8, sy - Math.sin(t / 26 * PI) * 10, t * 0.3, k0, 1 - t / 26)));
    }
    return r;
  };

  // ================= W+I: Hurricane =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isG(g) || !z || !z.shots) return r;
    if (p.st === 10) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('gale') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const sky = new Vis(p.x, p.y, 600, (ctx) => {   // (screen space) the sky goes green-grey; leaves and letters blow across it
        const st = p.st; if (p.state !== 'ult' || st > BU2 + 4) return;
        const k = Math.min(1, (st - 10) / 12, (BU2 + 4 - st) / 10);
        ctx.save(); ctx.globalAlpha = 0.26 * k; ctx.fillStyle = '#25382e'; ctx.fillRect(0, 0, W, H); ctx.restore();
        for (let j = 0; j < 18; j++) { const sp = 1.6 + (j % 5) * 0.5, x = ((j * 61 + st * sp * 3) % (W + 40)) - 20, y = 20 + (j * 37) % (H * 0.55) + Math.sin(st * 0.1 + j) * 8; if (j % 6 === 5) letter(ctx, x, y, st * 0.15 + j, k); else leaf(ctx, x, y, st * 0.3 + j, j % 3, k); if (j % 3 === 0) streak(ctx, x - 26, y + 3, 0, 18, k * 0.7); }
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the wind closes round the target in a tightening ring of leaves and letters,
  // then bursts on an impact frame
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const cy = sy - 24;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2)), rr = 56 - k * 36;
        band(ctx, sx, cy, rr, rr * 0.35, st * 2, false, 0.9);
        for (let j = 0; j < 12; j++) { const an = st * (0.18 + k * 0.25) + j / 12 * PI * 2, lx = sx + Math.cos(an) * rr, ly = cy + Math.sin(an) * rr * 0.35 + Math.sin(j * 1.7) * 10; if (j % 4 === 3) letter(ctx, lx, ly, an, 1); else leaf(ctx, lx, ly, an + PI / 2, j % 3, 1); }
        band(ctx, sx, cy, rr, rr * 0.35, st * 2, true, 1);
        const la = st * 0.22; letter(ctx, sx + Math.cos(la) * (rr + 22), cy - 26 + Math.sin(la) * 10, la * 0.5, Math.min(1, k * 3), 4);   // a great letter rides the wind round them
      } else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 43);
        const a = 1 - ease((k - 0.45) / 0.55), rr = 12 + 70 * ease(Math.min(1, k * 1.8));
        band(ctx, sx, cy, rr, rr * 0.3, st * 3, false, a); band(ctx, sx, cy, rr, rr * 0.3, st * 3, true, a);
        for (let j = 0; j < 16; j++) { const an = j / 16 * PI * 2 + 0.2, lx = sx + Math.cos(an) * rr * (0.8 + (j % 3) * 0.15), ly = cy + Math.sin(an) * rr * 0.5 - 14 * k; if (j % 5 === 4) letter(ctx, lx, ly, an + st * 0.3, a); else leaf(ctx, lx, ly, an + st * 0.5, j % 3, a); }
        for (let j = 0; j < 8; j++) { const an = j / 8 * PI * 2; streak(ctx, sx + Math.cos(an) * rr * 0.6, cy + Math.sin(an) * rr * 0.3, an, 16, a, C.wh); }
        for (let j = 0; j < 14; j++) { const an = j / 14 * PI * 2 + 0.5, d2 = 20 + ease(Math.min(1, k * 1.5)) * (60 + (j % 4) * 14); leaf(ctx, sx + Math.cos(an) * d2, cy - 10 + Math.sin(an) * d2 * 0.6 + k * 20, an + st * 0.6, j % 3, a, 2.4); }   // and bursts into a storm of big leaves
        if (k < 0.4) letter(ctx, sx, cy - 20 - k * 40, st * 0.5, 1 - k / 0.4, 4);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
