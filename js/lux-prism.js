'use strict';
// Shattered Worlds — Lux's prism (the user, 2026-11-20: "Lux's light"). Her story: from "a world of crystal and light",
// "the one who carried the light into the gardens. One beam goes in; seven come out"; Halcyon "tried to bottle her and
// found that light does not bottle"; "a thin crystal lance that splits a beam of light into a rainbow". So her light is
// white until it passes through crystal, then it is seven hard bands of colour. Beams are crisp lines and pixel glints
// (light needs no outline); the crystal lance tip and the prisms are faceted pixel sprites, drawn once and reused.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/opal-glass.js.
//   J      each hit leaves a cut of white light with a rainbow edge; the finisher's beam is like her shots
//   U      Prism Shot: a white bolt with a thin rainbow fringe; after it bounces it fans into seven colours
//   S+U    Split Beam: one white ray goes into the crystal tip and three coloured rays come out
//   I      Spectrum Lance: seven bands that pulse along its length, a white core, the crystal tip at her hand
//   S+I    Mirror Field: two faceted prisms that turn; each throws a rainbow when it fires
//   W+O    Blinding Flash: a white starburst inside rings of the seven colours
//   S+O    Bright: seven motes of colour circle her      O  White Light: a white glint in her hair (both small)
//   W+I    Rainbow Road: in the finish (js/ult-grand.js) a great crystal lance tip beside the target takes a white
//          beam and splits it; seven roads of colour close on the target and meet in one white point on an impact frame
// SW.luxPrism.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !art.rect || !CASTS || !CASTS.prism_shot || !CASTS.spectrum_lance || !SW.data.heroes.lux) return;
  const LP = SW.luxPrism = { on: true };
  const isL = g => !!(LP.on && g && g.state && g.state.hero === 'lux');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const R = Math.round;

  const SPEC = ['#ff3b4a', '#ff8c1a', '#ffd23a', '#5ad65a', '#2ec4ff', '#3a5cff', '#9b4dff'];   // the seven
  // crystal: navy outline, deep blue, blue, pale blue, white; gold for the collar
  const PAL = ['#14213d', '#1982c4', '#4cc9f0', '#bfefff', '#ffffff', '#ffca3a', '#b8860b'].concat(SPEC);
  const CR = { k: PAL[0], db: PAL[1], bl: PAL[2], pb: PAL[3], w: PAL[4], gd: PAL[5], gd2: PAL[6] };
  const kept = new Map();
  function stamp(ctx, key, x, y, w, h, draw, a) {
    let cv = kept.get(key);
    if (!cv) {
      w = 2 * Math.ceil(w / 2); h = 2 * Math.ceil(h / 2);
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const drop = () => { if (kept.get(key) === cv) kept.delete(key); };   // a canvas the browser drops while the tab is hidden comes back blank: draw it again
      cv.addEventListener('contextlost', drop); cv.addEventListener('contextrestored', drop);
      PX.sprite(cv.getContext('2d'), w / 2, h / 2, w, h, draw, { pal: PAL, outline: CR.k });
      if (kept.size > 300) kept.clear();
      kept.set(key, cv);
    }
    ctx.save(); ctx.imageSmoothingEnabled = false; if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    ctx.drawImage(cv, R(x) - cv.width / 2, R(y) - cv.height / 2);
    ctx.restore();
  }

  // ================= the crystal lance tip: its point toward +x, L long, (0, 0) its middle =================
  function tipVec(c, L, lit) {
    const h = L * 0.17;
    poly(c, [[-L * 0.5, -h * 0.5], [-L * 0.36, -h * 0.5], [-L * 0.36, h * 0.5], [-L * 0.5, h * 0.5]], CR.gd);   // the gold collar
    poly(c, [[-L * 0.5, 0], [-L * 0.36, 0], [-L * 0.36, h * 0.5], [-L * 0.5, h * 0.5]], CR.gd2);
    poly(c, [[-L * 0.36, -h], [L * 0.05, -h * 0.8], [L * 0.5, 0], [L * 0.05, h * 0.8], [-L * 0.36, h]], CR.bl);
    poly(c, [[-L * 0.36, -h], [L * 0.05, -h * 0.8], [L * 0.5, 0], [-L * 0.36, -h * 0.1]], lit ? CR.w : CR.pb);   // the lit facet
    poly(c, [[-L * 0.36, h], [L * 0.05, h * 0.8], [L * 0.5, 0], [-L * 0.36, h * 0.3]], CR.db);   // the dark facet
    poly(c, [[-L * 0.3, -h * 0.55], [L * 0.02, -h * 0.5], [L * 0.0, -h * 0.3], [-L * 0.3, -h * 0.32]], CR.w);
    if (lit) for (let i = 0; i < 3; i++) poly(c, [[L * (0.12 + i * 0.08), h * (0.05 + i * 0.12)], [L * 0.42, h * 0.05], [L * (0.14 + i * 0.08), h * (0.22 + i * 0.12)]], SPEC[i * 3]);   // colour caught inside it
  }
  function tip(ctx, x, y, L, dir, lit, a, mono) {
    const key = 'tip|' + L + '|' + dir + '|' + (lit ? 1 : 0) + '|' + (mono || '');
    if (mono) { PX.sprite(ctx, x, y, L + 8, L * 0.5 + 8, c => { c.scale(dir, 1); tipVec(c, L, lit); }, { pal: PAL, mono, outline: CR.k, alpha: a }); return; }
    stamp(ctx, key, x, y, L + 8, L * 0.5 + 8, c => { c.scale(dir, 1); tipVec(c, L, lit); }, a);
  }
  // a faceted triangular prism, s across
  function prismVec(c, s, fire) {
    poly(c, [[-s * 0.5, s * 0.36], [0, -s * 0.5], [s * 0.5, s * 0.36]], CR.bl);
    poly(c, [[-s * 0.5, s * 0.36], [0, -s * 0.5], [-s * 0.06, s * 0.1]], fire ? CR.w : CR.pb);
    poly(c, [[s * 0.5, s * 0.36], [0, -s * 0.5], [-s * 0.06, s * 0.1]], CR.db);
    poly(c, [[-s * 0.5, s * 0.36], [s * 0.5, s * 0.36], [-s * 0.06, s * 0.1]], CR.bl);
    if (fire) for (let i = 0; i < 7; i++) poly(c, [[-s * 0.06, s * 0.1], [s * 0.18 + i * s * 0.035, s * 0.3], [s * 0.21 + i * s * 0.035, s * 0.3]], SPEC[i]);
    poly(c, [[-s * 0.32, s * 0.2], [-s * 0.08, -s * 0.28], [-s * 0.04, -s * 0.2], [-s * 0.26, s * 0.2]], CR.w);
  }
  // a four-pointed glint
  function glint(ctx, x, y, r, col) { x = R(x); y = R(y); art.rect(ctx, col || '#ffffff', x - r, y, r * 2 + 1, 1); art.rect(ctx, col || '#ffffff', x, y - r, 1, r * 2 + 1); if (r > 2) { art.rect(ctx, '#ffffff', x - 1, y - 1, 3, 3); } }
  // a beam of white with the seven colours on its edge: from (x0, y0) to (x1, y1); spread 0 a thin fringe, 1 a full fan
  function ray(ctx, x0, y0, x1, y1, w, spread, a) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    const n = spread > 0.5 ? 7 : 3;
    for (let i = 0; i < n; i++) { const c = SPEC[n === 7 ? i : i * 3], o = (i - (n - 1) / 2) * (1 + spread), fan = spread * 0.12 * (i - (n - 1) / 2); art.line(ctx, c, R(x0 + nx * o * 0.4), R(y0 + ny * o * 0.4), R(x1 + nx * (o + fan * L * 0.2)), R(y1 + ny * (o + fan * L * 0.2)), 1); }
    art.line(ctx, '#bfefff', R(x0), R(y0), R(x1), R(y1), w + 1); art.line(ctx, '#ffffff', R(x0), R(y0), R(x1), R(y1), w);
    ctx.restore();
  }
  Object.assign(LP, { tip, glint, ray, SPEC });
  const motes = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 4 === 0 ? '#ffffff' : SPEC[i % 7], rand(-pw, pw), rand(-pw, 0.4), 18, 2, 0.02); };

  // ================= her beams (Prism Shot, Split Beam, Mirror Field, the finisher) =================
  function beamDraw(ctx, x, y, s) {
    const vx = s.vx || 1, vy = s.vy || 0, m = Math.hypot(vx, vy) || 1, ux = vx / m, uy = vy / m, L = s.bounced ? 30 : 24;
    ray(ctx, x - ux * L, y - uy * L, x, y, 2, s.bounced ? 1 : 0);
    if (s.bounced) for (let i = 0; i < 7; i++) art.rect(ctx, SPEC[i], R(x - ux * (L + 4 + i * 3)) - 1, R(y - uy * (L + 4 + i * 3) + (i - 3) * 1.4), 2, 2);   // after the bounce it trails all seven
    glint(ctx, x + ux * 2, y + uy * 2, (s.t % 4 < 2) ? 3 : 2);
  }
  function dress(z) {
    z.shots.forEach(s => {
      if (s.lp !== undefined) return;
      s.lp = 0;
      if (s instanceof Proj && s.w === 12 && s.h === 6 && s.ghost && s.render) { s.lp = 1; s.render = (ctx, x, y, q) => beamDraw(ctx, x, y, q); }
    });
  }

  // ================= S+U: Split Beam: one ray in, three out =================
  const _sb = CASTS.split_beam;
  if (_sb) CASTS.split_beam = function (p, z) {
    const r = _sb.apply(this, arguments);
    if (!isL(G)) return r;
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 12, (ctx, sx, sy, t) => {
      const tx = sx + d * 14, ty = sy - 22, a = t > 8 ? (12 - t) / 4 : 1;
      ray(ctx, tx - d * 46, ty - 24, tx - d * 6, ty, 2, 0, a);   // the white ray comes in from behind and above
      tip(ctx, tx, ty, 22, d, true, a);
      [-2.2, 0, 2.2].forEach((vy, i) => { const c = SPEC[[0, 3, 6][i]], l = 16 + t * 3; art.line(ctx, c, R(tx + d * 10), ty, R(tx + d * (10 + l)), R(ty + vy * l / 8), 2); });
      if (t < 4) glint(ctx, tx + d * 11, ty, 5 - t);
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= I: Spectrum Lance =================
  const _sl = CASTS.spectrum_lance;
  CASTS.spectrum_lance = function (p, z) {
    const n0 = z.shots.length, r = _sl.apply(this, arguments);
    if (!isL(G)) return r;
    const dir = p.face, len = 230, v = z.shots.slice(n0).find(s => s.life === 26 && s.render);
    if (v) {
      v.lp = 1;
      v.render = (ctx, x, y, t) => {
        const px = R(p.x - G.cam.x) + dir * 10, py = R(p.y - G.cam.y) - 22, l = R(len * Math.min(1, t / 4)), a = t > 20 ? (26 - t) / 6 : 1, burn = t % 6 === 2 || t % 6 === 3;
        if (l < 2) return;
        ctx.save(); ctx.globalAlpha = a;
        const x0 = dir > 0 ? px : px - l;
        for (let i = 0; i < 7; i++) { const yy = py - 7 + i * 2, taper = Math.abs(i - 3) * 4; art.rect(ctx, SPEC[i], dir > 0 ? x0 : x0 + taper, yy, l - taper, 2); }   // seven bands, the outer ones end sooner: a point
        for (let j = 0; j < 7; j++) { const u = ((t * 0.09 + j / 7) % 1) * (l - 8); for (let i = 0; i < 7; i++) art.rect(ctx, (i + j) % 2 ? '#ffffff' : SPEC[i], R(px + dir * u) - 1, py - 7 + i * 2, 3, 2); }   // the pulses running along it
        art.rect(ctx, '#bfefff', x0, py - 2, l, 4); art.rect(ctx, '#ffffff', x0, py - (burn ? 2 : 1), l, burn ? 4 : 2);
        ctx.restore();
        glint(ctx, px + dir * l, py, burn ? 6 : 4);   // the far end burns
        tip(ctx, px - dir * 2, py, 24, dir, true, a);
      };
    }
    return r;
  };

  // ================= S+I: Mirror Field =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.lux;
  if (BU && BU.cast) {
    const _mf = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _mf.apply(this, arguments);
      if (!isL(G)) return r;
      z.shots.slice(n0).filter(s => s.life === 180 && s.render).forEach((v, k) => {
        v.lp = 1;
        v.render = (ctx, sx, sy, t) => {
          const f = ((t - (10 + k * 8)) % 30 + 30) % 30, fire = f < 4, bob = R(Math.sin(t * 0.08 + k) * 2), a = Math.min(1, t / 6, (180 - t) / 12);
          stamp(ctx, 'prism|' + (fire ? 1 : 0), sx, sy + bob, 22, 22, c => prismVec(c, 16, fire), a);
          if (fire) { for (let i = 0; i < 7; i++) { const an = -0.5 + i * 0.16, L2 = 10 + f * 4; art.line(ctx, SPEC[i], sx, sy + bob, R(sx + Math.cos(an) * L2 * p.face), R(sy + bob + Math.sin(an) * L2), 1); } glint(ctx, sx, sy + bob - 9, 4 - f); }
          else if ((t + k * 9) % 40 < 4) glint(ctx, sx - 3, sy + bob - 4, 2);
        };
      });
      return r;
    };
  }

  // ================= W+O: Blinding Flash =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.lux;
  if (SIG && SIG.cast) {
    const _bf = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _bf.apply(this, arguments);
      if (!isL(G)) return r;
      z.shots.push(new Vis(p.x, p.y - 20, 18, (ctx, sx, sy, t) => {
        const a = 1 - ease((t - 8) / 10), k = ease(t / 6);
        ctx.save(); ctx.globalAlpha = a;
        for (let i = 0; i < 8; i++) { const an = i * PI / 4 + 0.2, L = (i % 2 ? 26 : 46) * k + 6; art.line(ctx, '#ffffff', sx, sy, R(sx + Math.cos(an) * L), R(sy + Math.sin(an) * L * 0.8), i % 2 ? 1 : 2); }   // the starburst
        for (let c = 0; c < 7; c++) { const Rr = 20 + t * 4.4 + c * 2.2; for (let j = 0; j < 40; j++) { const an = j / 40 * PI * 2; art.rect(ctx, SPEC[c], R(sx + Math.cos(an) * Rr), R(sy + Math.sin(an) * Rr * 0.75), 2, 1); } }   // the halo: seven rings
        ctx.restore();
        glint(ctx, sx, sy, t < 6 ? 8 : 4);
      }, v => { v.x = p.x; v.y = p.y - 20; }));
      return r;
    };
  }

  // ================= J: a cut of white light with a rainbow edge; the small auras =================
  function cut(ctx, x, y, d, size, k, up) {
    const a0 = up ? (d > 0 ? -2.2 : -0.94) : (d > 0 ? -1.1 : PI + 1.1), sweep = (up ? 1.4 : 1.9) * d * (up ? -1 : 1), u = ease(k * 1.6), al = 1 - ease((k - 0.4) / 0.6);
    ctx.save(); ctx.globalAlpha = al;
    for (let b = -1; b < 7; b++) {
      const Rr = size + b * 1.2, col = b < 0 ? '#ffffff' : SPEC[b], n = 14;
      for (let j = 0; j < n; j++) { const s0 = a0 + sweep * u * (j / n), s1 = a0 + sweep * u * ((j + 1) / n); art.line(ctx, col, R(x + Math.cos(s0) * Rr), R(y + Math.sin(s0) * Rr * 0.8), R(x + Math.cos(s1) * Rr), R(y + Math.sin(s1) * Rr * 0.8), b < 0 ? 2 : 1); }
    }
    ctx.restore();
  }
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 8) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.5 : 20, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22);
        cut(ctx, sx + d * (reach * 0.4), hy, d, big ? 24 : 17, k / 8, a.anim === 'launcher');
        if (k < 3) glint(ctx, sx + d * (reach + 4), hy, (big ? 6 : 4) - k);
        if (k === 0) motes(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 5 : 3, 2);
      }
    }
    if (front && p.modeT > 0) {   // Bright: seven motes of colour circle her, slowly (small)
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha = fade; for (let i = 0; i < 7; i++) { const an = p.t * 0.05 + i * PI * 2 / 7, z2 = Math.sin(an); if (z2 < -0.2) continue; art.rect(ctx, SPEC[i], R(sx + Math.cos(an) * 13) - 1, R(sy - 20 + z2 * 4) - 1, 2, 2); } ctx.restore();
    }
    if (!front && p.modeT > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, p.modeT / 30); for (let i = 0; i < 7; i++) { const an = p.t * 0.05 + i * PI * 2 / 7, z2 = Math.sin(an); if (z2 >= -0.2) continue; art.rect(ctx, SPEC[i], R(sx + Math.cos(an) * 13) - 1, R(sy - 20 + z2 * 4) - 1, 2, 2); } ctx.restore(); }
    if (front && p.awakeT > 0) {   // White Light: a white glint in her hair, motes round the lance tip (small)
      const fade = Math.min(1, p.awakeT / 30), ph = p.t % 30;
      ctx.save(); ctx.globalAlpha = fade;
      glint(ctx, sx - d * 2, sy - 41, ph < 6 ? 3 : 2);
      for (let i = 0; i < 7; i++) { const an = p.t * 0.12 + i * PI * 2 / 7; art.rect(ctx, SPEC[i], R(sx + d * 12 + Math.cos(an) * 6), R(sy - 24 + Math.sin(an) * 4), 1, 1); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isL(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isL(g || this.G) || !z || !z.shots) return r;
    dress(z); if (G.zone && G.zone !== z && G.zone.shots) dress(G.zone);
    if (!this.dead && this.awakeT > a0 + 60) motes(this.x, this.y - 24, 14, 2.6);   // White Light begins (small and short)
    return r;
  };

  // ================= W+I: Rainbow Road, the finish =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isL(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('lux') : null;
    if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    return r;
  };
  // js/ult-grand.js builds up from BU2 and lands its finishing blow at FIN
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1, FAR = [[-1.0, -0.62], [-0.2, -1.0], [0.55, -0.9], [1.0, -0.4], [1.0, 0.35], [-1.0, 0.3], [0.25, 0.95]];
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult') return false;
      const st = p.st; if (st < BU2 - 2 || st > FIN + 18) return;
      const sx = R(v.x - cam.x), sy = R(v.y - cam.y), cy = sy - 20, tx = sx - dir * 70, ty = cy - 18;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 8), close = ease((st - (BU2 + 4)) / Math.max(1, FIN - BU2 - 5));
        // the great tip beside them takes a white beam from behind and splits it into seven
        ray(ctx, tx - dir * 140, ty - 60, tx - dir * 26, ty, 3, 0, k);
        for (let i = 0; i < 7; i++) { const off = (i - 3) * 14 * (1 - close); art.line(ctx, SPEC[i], R(tx + dir * 26), ty, R(sx), R(cy + off), 2); }
        tip(ctx, tx, ty, 56, dir, true, k);
        // and seven roads of colour come in across the screen toward them
        FAR.forEach((f, i) => { const u = ease((st - BU2 - i * 2) / 10); if (u <= 0) return; const x0 = sx + f[0] * 230, y0 = cy + f[1] * 150, ex = x0 + (sx - x0) * u * (0.55 + 0.45 * close), ey = y0 + (cy - y0) * u * (0.55 + 0.45 * close); art.line(ctx, SPEC[i], R(x0), R(y0), R(ex), R(ey), 3); art.line(ctx, '#ffffff', R(x0), R(y0), R(ex), R(ey), 1); glint(ctx, ex, ey, 3); });
        if (st > FIN - 8) glint(ctx, sx, cy, 2 + (st % 3));
      } else {   // they meet in one white point
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, mono = ik < 0.5 ? '#ffffff' : undefined;
        PX.impact(ctx, sx, cy, ik, 71);
        FAR.forEach((f, i) => { if (ik < 0.5) art.line(ctx, '#ffffff', R(sx + f[0] * 230), R(cy + f[1] * 150), sx, cy, 3); else { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * 1.6); art.line(ctx, SPEC[i], R(sx + f[0] * 230), R(cy + f[1] * 150), sx, cy, 2); ctx.restore(); } });
        tip(ctx, tx, ty, 56, dir, true, 1 - ease((k - 0.3) / 0.5), mono);
        glint(ctx, sx, cy, R(4 + 18 * (1 - k)));
        if (ik >= 0.5) { ctx.save(); ctx.globalAlpha = 1 - k; for (let c = 0; c < 7; c++) { const Rr = 10 + k * 90 + c * 3; for (let j = 0; j < 48; j++) { const an = j / 48 * PI * 2; art.rect(ctx, SPEC[c], R(sx + Math.cos(an) * Rr), R(cy + Math.sin(an) * Rr * 0.6), 2, 1); } } ctx.restore(); }
        if (st === FIN) motes(T.x, T.y - 16, 28, 4.5);
      }
    });
  }
})();
