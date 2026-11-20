'use strict';
// Shattered Worlds — Sora's kites (the user, 2026-11-20: "Sora's kites"). Her story: born in the kite clans of
// Vharra's steppe; the sky tore and she went up "with nothing but a kite the size of a sail"; "a white and blue kite";
// she flies the high letters for the Paper Post and "cuts loose with the String Cut". So her kite is a steppe fighting
// kite: white and sky blue, a hawk's glare painted across it, fangs under the crossbar, pink tail ribbons, and a
// string that cuts. Its bombs are Paper Post parcels with a lit fuse, and its wind carries letters. Crisp pixel art
// through js/pixel-kit.js. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/thorne-garden.js.
//   J      a small kite swoops through each hit on its string; the finisher throws it out on the line
//   U      String Cut: the kite shoots out on a taut, glinting string
//   S+U    Kite Lift: the sail-sized kite catches the gust above her and hauls her up by two strings
//   I      Kite Bomber: the kite flies out with its ribbons streaming and drops parcels with lit fuses
//   S+I    Dive Bomb: she lets go; the kite tumbles away above her while she dives
//   W+O    Gale Kite: the kite beats the air: rings of wind and a flurry of letters
//   gliding  the big kite above her, a string to each hand
//   S+O    Tailwind: ribbons at her waist      O  High Wind: a small kite at her shoulder (small on purpose)
//   W+I    A Thousand Kites: painted kites fill the sky, each with a string down across the target; in the cinematic
//          finish (js/ult-cinema.js) the strings draw tight through the target one by one, the great kite glares
//          beside it, then dives point-first through it on an impact frame as every string cuts
// SW.soraKite.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !art || !art.line || !CASTS.string_cut || !CASTS.kite_bomber || !CASTS.updraft_kite) return;
  const SK = SW.soraKite = { on: true };
  const isS = g => !!(SK.on && g && g.state && g.state.hero === 'sora');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const fwd = d => (d > 0 ? 0 : PI);
  function strip(c, pts, w0, w1, col) {
    const L = [], R = [], n = pts.length;
    for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = w0 + (w1 - w0) * i / (n - 1); L.push([pts[i][0] - dy / d * w, pts[i][1] + dx / d * w]); R.unshift([pts[i][0] + dy / d * w, pts[i][1] - dx / d * w]); }
    poly(c, L.concat(R), col);
  }

  // navy outline, navy, deep blue, blue, sky, pale sky, white, pink, dark pink, paper, paper shadow, spark gold
  const PAL = ['#0a1830', '#023e8a', '#0077b6', '#48b5e0', '#90e0ef', '#d8f6ff', '#ffffff', '#ef476f', '#9c1f44', '#f6ecd0', '#c9b98f', '#ffd166'];
  const C = { k: PAL[0], nv: PAL[1], db: PAL[2], bl: PAL[3], sky: PAL[4], ps: PAL[5], w: PAL[6], pk: PAL[7], dp: PAL[8], pa: PAL[9], pas: PAL[10], gd: PAL[11] };

  // ================= the kite: (0, 0) where the spars cross... its middle; s its height; up is -y =================
  // o = { t, tail (length of the ribbons, in kite heights; 0 none), alt (pink sail), glare (the eyes blaze) }
  function kiteVec(c, s, o) {
    const t = o.t || 0, tl = o.tail === undefined ? 1 : o.tail, T = [0, -0.5 * s], B = [0, 0.5 * s], L = [-0.4 * s, -0.12 * s], R = [0.4 * s, -0.12 * s], M = [0, -0.12 * s];
    const hi = o.alt ? C.pa : C.w, a1 = o.alt ? C.pk : C.sky, a2 = o.alt ? C.dp : C.bl, a3 = o.alt ? C.nv : C.db;
    if (tl > 0) for (let i = 0; i < 3; i++) {   // the tail: three ribbons that stream and snap, bows tied along the middle one
      const len = s * tl * (i === 1 ? 1.5 : 1.05), pts = [];
      for (let k = 0; k <= 9; k++) { const u = k / 9; pts.push([(i - 1) * s * 0.13 * u + Math.sin(t * 0.33 - u * 5.5 + i * 1.4) * s * 0.09 * u, 0.48 * s + u * len]); }
      strip(c, pts, s * 0.04 + 0.7, 0.5, i === 1 ? C.pk : hi);
      if (i === 1) [3, 6].forEach(k => { const q = pts[k], w = s * 0.07 + 1; poly(c, [[q[0], q[1]], [q[0] - w, q[1] - w * 0.7], [q[0] - w, q[1] + w * 0.7]], C.dp); poly(c, [[q[0], q[1]], [q[0] + w, q[1] - w * 0.7], [q[0] + w, q[1] + w * 0.7]], C.dp); });
    }
    for (const q of [L, R]) { const d = Math.sign(q[0]), pts = []; for (let k = 0; k <= 5; k++) { const u = k / 5; pts.push([q[0] + d * s * 0.05 * u + Math.sin(t * 0.4 - u * 4 + d) * s * 0.05 * u, q[1] + u * s * 0.34]); } strip(c, pts, s * 0.025 + 0.6, 0.4, C.pk); }   // tassels at the wing tips
    poly(c, [T, L, M], hi); poly(c, [T, R, M], a1); poly(c, [L, B, M], a2); poly(c, [R, B, M], a3);   // four panels
    poly(c, [T, [R[0] * 0.5, -0.31 * s], [0, -0.34 * s]], C.ps);   // light along the leading edge
    poly(c, [[-0.2 * s, 0.1 * s], [0, 0.2 * s], [0.2 * s, 0.1 * s], [0, 0.31 * s]], hi);   // a chevron on the keel
    for (let j = -2; j <= 2; j++) { const x = j * 0.12 * s, f = (j === 0 ? 0.07 : 0.11) * s; poly(c, [[x - 0.045 * s, -0.12 * s], [x + 0.045 * s, -0.12 * s], [x, -0.12 * s + f]], C.w); }   // fangs under the crossbar
    for (const d of [-1, 1]) {   // a hawk's glare painted across the sail
      poly(c, [[d * 0.03 * s, -0.215 * s], [d * 0.27 * s, -0.33 * s], [d * 0.3 * s, -0.29 * s], [d * 0.05 * s, -0.185 * s]], C.k);
      poly(c, [[d * 0.05 * s, -0.17 * s], [d * 0.28 * s, -0.275 * s], [d * 0.26 * s, -0.165 * s]], o.glare ? C.w : C.pk);
      poly(c, [[d * 0.12 * s, -0.175 * s], [d * 0.21 * s, -0.215 * s], [d * 0.2 * s, -0.175 * s]], o.glare ? C.pk : C.k);
    }
    strip(c, [T, B], 0.6, 0.6, C.nv); strip(c, [L, R], 0.6, 0.6, C.nv);   // the spars
    poly(c, [[-1.4, T[1] - s * 0.06], [1.4, T[1] - s * 0.06], [0, T[1] + 2]], C.pk);   // a pennant at the peak
  }
  function kite(ctx, x, y, s, o) {
    o = o || {}; const tl = o.tail === undefined ? 1 : o.tail, R = s * (0.62 + 1.6 * tl) + 4;
    PX.sprite(ctx, x, y, R * 2, R * 2, c => { if (o.tilt) c.rotate(o.tilt); kiteVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono });
  }
  // a Paper Post parcel with a lit fuse
  function parcel(ctx, x, y, t) {
    PX.sprite(ctx, x, y, 24, 24, c => {
      c.rotate(Math.sin(t * 0.3) * 0.35);
      poly(c, [[-5, -4], [5, -4], [5, 4], [-5, 4]], C.pa); poly(c, [[-5, 1], [5, 1], [5, 4], [-5, 4]], C.pas);
      poly(c, [[-1, -4], [1, -4], [1, 4], [-1, 4]], C.pk); poly(c, [[-5, -1], [5, -1], [5, 0.6], [-5, 0.6]], C.pk);
      poly(c, [[-0.8, -4], [0.8, -4], [2.4, -7.5], [1.2, -7.5]], C.nv); ell(c, 2 + (t % 2), -8.2, 1.6, 1.6, t % 4 < 2 ? C.gd : C.w);
    }, { pal: PAL });
  }
  const letterVec = (c, w, r) => { c.save(); c.rotate(r); poly(c, [[-w, -w * 0.62], [w, -w * 0.62], [w, w * 0.62], [-w, w * 0.62]], C.w); poly(c, [[-w, -w * 0.62], [0, w * 0.05], [w, -w * 0.62], [w, -w * 0.4], [0, w * 0.3], [-w, -w * 0.4]], C.ps); ell(c, 0, w * 0.1, w * 0.22, w * 0.22, C.pk); c.restore(); };
  Object.assign(SK, { kite, parcel, PAL });
  const scraps = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 === 0 ? '#ef476f' : i % 3 === 1 ? '#ffffff' : '#90e0ef', rand(-pw, pw), -rand(0.5, pw), 22, 2, 0.06); };
  // the string: a white line with glints running along it
  function string(ctx, x0, y0, x1, y1, t, col) {
    art.line(ctx, col || '#ffffff', Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), 1);
    for (let j = 0; j < 3; j++) { const u = (t * 0.13 + j / 3) % 1; art.rect(ctx, '#d8f6ff', Math.round(x0 + (x1 - x0) * u) - 1, Math.round(y0 + (y1 - y0) * u) - 1, 2, 2); }
  }

  // ================= U: String Cut =================
  const _sc = CASTS.string_cut;
  CASTS.string_cut = function (p, z) {
    const n0 = z.shots.length, r = _sc.apply(this, arguments);
    if (!isS(G)) return r;
    const dir = p.face, v = z.shots.slice(n0).find(s => s.life === 12 && s.render);
    if (v) v.render = (ctx, x, y, t) => {
      const k = Math.min(1, t / 4), px = Math.round(p.x - G.cam.x) + dir * 6, py = Math.round(p.y - G.cam.y) - 24, ex = px + Math.round(dir * 100 * k), ey = py - Math.round(26 * k);
      if (t >= 3 && t < 9) { art.line(ctx, '#90e0ef', px, py + 2, ex, ey + 2, 1); art.line(ctx, '#d8f6ff', px, py - 1, ex, ey - 1, 1); }   // it sings as it cuts
      string(ctx, px, py, ex, ey, t);
      kite(ctx, ex, ey, 26, { t, tilt: dir * 1.32, tail: 0.6, a: t > 9 ? (12 - t) / 3 : 1 });
    };
    return r;
  };

  // ================= S+U: Kite Lift =================
  const _uk = CASTS.updraft_kite;
  CASTS.updraft_kite = function (p, z) {
    const r = _uk.apply(this, arguments);
    if (!isS(G)) return r;
    z.shots.push(new Vis(p.x, p.y, 26, (ctx, sx, sy, t) => {
      const a = t > 19 ? (26 - t) / 7 : 1, ky = sy - 78 - Math.min(8, t), sway = Math.sin(t * 0.4) * 0.12;
      PX.lines(ctx, sx, sy - 10, -PI / 2, 60, 6, t, '#d8f6ff', 44);
      string(ctx, sx - 4, sy - 30, sx - 8, ky + 4, t); string(ctx, sx + 4, sy - 30, sx + 8, ky + 4, t + 3);
      kite(ctx, sx, ky, 56, { t, tilt: sway, tail: 0.5, a });
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= I: Kite Bomber =================
  const _kb = CASTS.kite_bomber;
  CASTS.kite_bomber = function (p, z) {
    const n0 = z.shots.length, r = _kb.apply(this, arguments);
    if (!isS(G)) return r;
    const dir = p.face, v = z.shots.slice(n0).find(s => s.life === 70 && s.render);
    if (v) v.render = (ctx, x, y, t) => kite(ctx, x, y + Math.round(Math.sin(t * 0.3) * 2), 32, { t, tilt: dir * (1.05 + Math.sin(t * 0.25) * 0.08), tail: 0.8, a: t > 62 ? (70 - t) / 8 : 1 });
    return r;
  };

  // ================= S+I: Dive Bomb =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.sora;
  if (BU && BU.cast) {
    const _db = BU.cast;
    BU.cast = function (p, z) {
      const r = _db.apply(this, arguments);
      if (!isS(G)) return r;
      const dir = p.face; let free = null;
      z.shots.push(new Vis(p.x, p.y, 58, (ctx, sx, sy, t) => {
        if (!free) {   // climbing: she hangs from it
          const px = Math.round(p.x - G.cam.x), py = Math.round(p.y - G.cam.y);
          string(ctx, px - 3, py - 30, px - 7, py - 62, t); string(ctx, px + 3, py - 30, px + 7, py - 62, t + 3);
          kite(ctx, px, py - 78, 44, { t, tilt: Math.sin(t * 0.5) * 0.1, tail: 0.5 });
        } else {   // let go: it tumbles away above her
          const k = t - free.t, a = 1 - ease((k - 28) / 18);
          kite(ctx, sx, sy, 44, { t, tilt: -dir * (0.2 + k * 0.05) + Math.sin(k * 0.3) * 0.25, tail: 0.5, a });
          if (p.state === 'cast' && !p.onGround) PX.lines(ctx, Math.round(p.x - G.cam.x), Math.round(p.y - G.cam.y) - 34, Math.atan2(-p.vy, -p.vx), 54, 6, t, '#d8f6ff', 22);
        }
      }, v => {
        if (!free && v.t >= 10) { free = { t: v.t }; v.x = p.x; v.y = p.y - 78; }
        if (free) { v.x -= dir * 0.9; v.y -= 1.1; }
      }));
      return r;
    };
  }

  // ================= W+O: Gale Kite =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.sora;
  if (SIG && SIG.cast) {
    const _gk = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _gk.apply(this, arguments);
      if (!isS(G)) return r;
      const dir = p.face, seed = (p.t || 0) % 97;
      z.shots.push(new Vis(p.x, p.y, 22, (ctx, sx, sy, t) => {
        const a = t > 15 ? (22 - t) / 7 : 1, kx = sx + dir * 20, ky = sy - 32;
        PX.sprite(ctx, sx + dir * 76, sy - 28, 150, 96, c => {   // the wind: rings that widen as they go, letters tumbling in it
          c.scale(dir, 1); c.translate(-56, 0);
          for (let i = 0; i < 4; i++) { const u = ((t * 0.07 + i * 0.25) % 1), x = 6 + u * 112, h = 10 + u * 30, pts = []; for (let k = 0; k <= 8; k++) { const an = -1.1 + 2.2 * k / 8; pts.push([x + Math.cos(an) * h * 0.4, Math.sin(an) * h]); } strip(c, pts, 0.4, 0.4 + 1.6 * (1 - u), i % 2 ? C.ps : C.w); }
          for (let i = 0; i < 7; i++) { const u = ((t * 0.06 + rnd(seed, i)) % 1), x = 10 + u * 116, y = (rnd(seed, i + 9) - 0.5) * (20 + u * 44); c.save(); c.translate(x, y); letterVec(c, 4.2, t * 0.4 + i * 1.3); c.restore(); }
        }, { pal: PAL, alpha: a });
        string(ctx, sx + dir * 6, sy - 24, kx, ky + 6, t);
        kite(ctx, kx, ky, 46, { t, tilt: dir * (0.9 + 0.5 * Math.sin(t * 0.9)), tail: 0.45, a });
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= J finisher: the kite goes out on the line =================
  const FINS = SW.clanmelee && SW.clanmelee.FIN;
  if (FINS && FINS.sora) {
    const _sf = FINS.sora;
    FINS.sora = function (p, z) {
      const r = _sf.apply(this, arguments);
      if (isS(G)) {
        const d = p.face;
        z.shots.push(new Vis(p.x, p.y, 14, (ctx, sx, sy, t) => {
          const k = t < 5 ? ease((t + 1) / 4) : 1 - ease((t - 8) / 6), px = sx + d * 6, py = sy - 26, ex = px + d * 68 * k, ey = py - 6 * k;
          string(ctx, px, py, ex, ey, t); kite(ctx, ex, ey, 24, { t, tilt: d * 1.5, tail: 0.6, a: t > 10 ? (14 - t) / 4 : 1 });
        }, v => { v.x = p.x; v.y = p.y; }));
      }
      return r;
    };
  }

  // ================= gliding: the big kite above her =================
  if (N.TRAITS && N.TRAITS.glide && N.TRAITS.glide.mark) {
    const _gm = N.TRAITS.glide.mark;
    N.TRAITS.glide.mark = function (ctx, p, x, y) {
      if (!SK.on) return _gm.apply(this, arguments);
      if (!p.gliding) return;
      string(ctx, x - 3, y - 30, x - 7, y - 50, p.t); string(ctx, x + 3, y - 30, x + 7, y - 50, p.t + 3);
      kite(ctx, x, y - 64, 40, { t: p.t, tilt: (p.face || 1) * 0.15 + Math.sin(p.t * 0.15) * 0.06, tail: 0.5 });
    };
  }

  // ================= J: the small kite swoops; the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 7) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.6 : 24, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), u = ease((k + 1) / 4), up = a.anim === 'launcher';
        const ex = sx + d * (8 + reach * u), ey = up ? hy + 12 - 26 * u : hy - 10 + 14 * Math.sin(u * PI * 0.9);
        string(ctx, sx + d * 6, sy - 24, ex, ey, p.t);
        kite(ctx, ex, ey, big ? 22 : 17, { t: p.t, tilt: up ? d * 0.4 : d * (1.2 + 0.7 * u), tail: 0.6, a: k > 4 ? (7 - k) / 3 : 1 });
        if (k === 0) scraps(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 6 : 3, 2);
      }
    }
    if (!front && p.modeT > 0) {   // Tailwind: ribbons at her waist (small)
      const fade = Math.min(1, p.modeT / 30);
      PX.sprite(ctx, sx - d * 10, sy - 16, 30, 18, c => { c.scale(-d, 1); for (let i = 0; i < 2; i++) { const pts = []; for (let k = 0; k <= 6; k++) { const u = k / 6; pts.push([-8 + u * 20, (i ? 3 : -2) + Math.sin(p.t * 0.4 - u * 4 + i * 2) * 2.5 * u]); } strip(c, pts, 1.3, 0.5, i ? C.w : C.pk); } }, { pal: PAL, alpha: fade });
    }
    if (!front && p.awakeT > 0) {   // High Wind: a small kite at her shoulder (small)
      const fade = Math.min(1, p.awakeT / 30), kx = sx - d * 11, ky = sy - 48 + Math.round(Math.sin(p.t * 0.12) * 2);
      art.line(ctx, '#ffffff', sx - d * 3, sy - 28, kx, ky + 5, 1);
      kite(ctx, kx, ky, 14, { t: p.t, tilt: -d * 0.25, tail: 0.7, a: fade });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isS(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };

  // ================= her leftover shots: the parcels, and the thousand kites =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.sk) return;
      if (s.render && s.w === 10 && s.h === 10 && s.g === 0.3) { s.sk = 1; s.render = (ctx, x, y, q) => parcel(ctx, x, y, q && q.t !== undefined ? q.t : SW.frame || 0); return; }   // (js/ninja-kit.js's shot: a Proj)
      if (p.state !== 'ult' || !s.render || s.vx !== undefined || s.life !== 40) return;
      const seed = Math.round(s.x * 3 + s.y), size = 18 + (seed % 3) * 5, alt = seed % 3 === 1, T = N.nearest ? N.nearest(z, p.x, p.y - 16, 900) : null, off = (rnd(seed, 2) - 0.5) * 70;
      s.sk = 1; s._ugS = 1;
      s.render = (ctx, sx, sy, t) => {
        const x = sx + Math.round(Math.sin(t * 0.2) * 6), y = sy + Math.round(t * 0.5), a = t > 32 ? (40 - t) / 8 : Math.min(1, t / 3);
        if (T && !T.dead && t > 2) { ctx.globalAlpha = 0.75 * a; art.line(ctx, '#ffffff', x, y + 4, Math.round(T.x + off - G.cam.x), Math.round(T.y - 14 - G.cam.y), 1); ctx.globalAlpha = 1; }   // its string, down across them
        kite(ctx, x, y, size, { t: t + seed, tilt: Math.sin(t * 0.2 + seed) * 0.3, tail: 0.6, alt, a });
      };
    });
  }
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isS(g || this.G) || !z || !z.shots) return r;
    dress(this, z);
    if (!this.dead && this.awakeT > a0 + 60) scraps(this.x, this.y - 24, 14, 2.6);   // High Wind begins (small and short)
    return r;
  };

  // ================= W+I: A Thousand Kites, the finish =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isS(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('sora') >= 0) finale(p, z, T);
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100)
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1, WEB = [-2.75, -2.3, -1.85, -1.3, -0.85, -0.4, -2.05, -1.05];
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const cy = sy - 20, kx = sx - dir * 54, ky = cy - 12, after = st >= FIN, ik = (st - FIN) / 5, k2 = (st - FIN) / 18;
      WEB.forEach((an, i) => {   // the strings come down through the target one by one, and draw tight
        const u = ease((st - 76 - i * 2) / 5); if (u <= 0) return;
        const x0 = sx + Math.cos(an) * 170, y0 = cy + Math.sin(an) * 170, x1 = sx - Math.cos(an) * 46, y1 = cy - Math.sin(an) * 46, q = st > FIN - 8 && !after ? (st + i) % 2 : 0;
        if (after) { if (ik < 0.5) art.line(ctx, '#ffffff', Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), 2); else { ctx.globalAlpha = Math.max(0, 1 - k2 * 1.6); art.line(ctx, '#d8f6ff', Math.round(x0), Math.round(y0 + k2 * 30), Math.round(sx), Math.round(cy + k2 * 46), 1); ctx.globalAlpha = 1; } }
        else string(ctx, x0 + q, y0, x0 + (x1 - x0) * u + q, y0 + (y1 - y0) * u, st + i * 3);
      });
      if (!after) {   // the great kite beside them, glaring; it draws back before the dive
        const k = ease((st - 74) / 8), back = ease((st - (FIN - 6)) / 5);
        kite(ctx, kx - dir * 12 * back, ky - 8 * back + Math.round(Math.sin(st * 0.3) * 2), 58, { t: st, tilt: dir * (0.45 + 0.9 * back), tail: 0.3, glare: st > 84, a: k });
      } else {
        PX.impact(ctx, sx, cy, ik, 37);
        const u = Math.min(1.6, ik * 1.2);
        kite(ctx, kx + (sx - kx) * u, ky + (cy - ky) * u, 58, { t: st, tilt: dir * 1.75, tail: 0.3, glare: true, mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease((k2 - 0.35) / 0.4) });
        if (st === FIN) scraps(T.x, T.y - 16, 28, 4.5);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
