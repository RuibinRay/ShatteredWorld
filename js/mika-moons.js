'use strict';
// Shattered Worlds — Mika's twin moons (2026-11-20, the hero-look rework: cool, not cute). Her story: the girl of the
// twin moons who "has not touched the ground since the fight began"; her look: a silver-white ponytail, indigo,
// periwinkle, two crescent blades. Her blades were dotted arcs and three-pixel strips. Now they are crescent moon-blades
// drawn as crisp pixel art by js/pixel-kit.js: a thin hooked crescent with a mirror-bright cutting edge, a pale lit face
// and a cold blue inner curve, spinning with a moonlight trail; her moons are full discs with craters, one silver, one
// periwinkle. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/tarek-chain.js.
//   U      Crescent Toss: two moon-blades curve out, one high one low, and back, trailing moonlight
//   S+U    Moon Vault: a pale arc of moonlight traces her somersault over the target; the downward cut is a crescent slash
//   I      Twin Orbit: two blades orbit her like two moons, their phases waxing and waning as they turn
//   S+I    Lunar Dive: she spirals down leaving four crescent trails, and lands in a ring of moonlight
//   W+O    Lunar Halo: four crescents in orbit, lit like moons, then sent out
//   J      the finisher: twin crescents, high and low, glowing
//   S+O    Night Sky: faint stars twinkle round her      O  Full Moon: two small moons hang behind her shoulders
//          (small on purpose: the view stays clear)
//   W+I    Moonfall: two moons rise over a dark sky; she crosses the arena six times by their light, each cut a silver
//          crescent; on the finishing blow (js/ult-grand.js) the two moons swing together over the target into one
//          eclipse and a giant crescent cuts through it on an impact frame
// SW.mikaMoons.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.crescent_toss || !CASTS.twin_orbit) return;
  const MM = SW.mikaMoons = { on: true };
  const isM = g => !!(MM.on && g && g.state && g.state.hero === 'mika');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  const PAL = ['#0c0a24', '#1e1a4a', '#3d348b', '#5a5ec0', '#7a80c0', '#b8c0ff', '#dfe3ff', '#ffffff', '#8a90b8', '#c8cce8'];
  const C = { out: PAL[0], d1: PAL[1], ind: PAL[2], blue: PAL[3], per: PAL[4], peri: PAL[5], pale: PAL[6], w: PAL[7], crater: PAL[8], silver: PAL[9] };

  // ---------- a crescent blade: (0, 0) its centre, r its radius, the horns toward +x ----------
  function bladeVec(c, r) {
    c.beginPath(); c.arc(0, 0, r, -PI * 0.62, PI * 0.62); c.arc(r * 0.42, 0, r * 0.78, PI * 0.5, -PI * 0.5, true); c.closePath(); c.fillStyle = C.peri; c.fill();
    c.beginPath(); c.arc(0, 0, r, -PI * 0.55, PI * 0.1); c.arc(r * 0.3, -r * 0.1, r * 0.8, PI * 0.1, -PI * 0.5, true); c.closePath(); c.fillStyle = C.pale; c.fill();   // the lit face
    c.strokeStyle = C.w; c.lineWidth = Math.max(1, r * 0.12); c.beginPath(); c.arc(0, 0, r, -PI * 0.58, PI * 0.58); c.stroke();   // the mirror edge
    c.strokeStyle = C.blue; c.lineWidth = Math.max(1, r * 0.1); c.beginPath(); c.arc(r * 0.42, 0, r * 0.78, PI * 0.45, -PI * 0.45, true); c.stroke();   // the cold inner curve
  }
  function blade(ctx, x, y, r, rot, o) {
    o = o || {};
    PX.sprite(ctx, x, y, r * 2.6 + 4, r * 2.6 + 4, c => { c.rotate(rot || 0); bladeVec(c, r); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  MM.blade = blade;
  // ---------- a moon: a disc with craters; phase -1..1 shades one side (0 = full) ----------
  function moon(ctx, x, y, r, o) {
    o = o || {};
    PX.sprite(ctx, x, y, r * 2.4 + 4, r * 2.4 + 4, c => {
      c.beginPath(); c.arc(0, 0, r, 0, PI * 2); c.fillStyle = o.col || C.silver; c.fill();
      c.beginPath(); c.arc(-r * 0.25, -r * 0.25, r * 0.65, 0, PI * 2); c.fillStyle = C.w; c.globalAlpha = 0.6; c.fill(); c.globalAlpha = 1;
      c.fillStyle = C.crater; [[0.3, 0.2, 0.22], [-0.35, 0.35, 0.14], [0.1, -0.4, 0.12], [0.45, -0.15, 0.09]].forEach(([cx, cy, cr]) => { c.beginPath(); c.arc(cx * r, cy * r, cr * r, 0, PI * 2); c.fill(); });
      if (o.phase) { c.globalCompositeOperation = 'source-atop'; c.fillStyle = C.d1; c.beginPath(); c.arc(o.phase * r * 1.2, 0, r, 0, PI * 2); c.fill(); c.globalCompositeOperation = 'source-over'; }
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out });
  }
  MM.moon = moon;
  function trail(ctx, pts, a) {   // moonlight along a path (screen points, newest last)
    ctx.save();
    for (let i = 1; i < pts.length; i++) { ctx.globalAlpha = 0.7 * (a === undefined ? 1 : a) * i / pts.length; art.line(ctx, i > pts.length - 3 ? C.pale : C.per, Math.round(pts[i - 1][0]), Math.round(pts[i - 1][1]), Math.round(pts[i][0]), Math.round(pts[i][1]), 1); }
    ctx.restore();
  }
  function crescentSlash(z, x, y, r, rot, life) {   // a silver crescent cut hanging in the air
    z.shots.push(new Vis(x, y, life || 10, (ctx, sx, sy, t) => { const k = t / (life || 10); ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = C.w; ctx.lineWidth = Math.max(1, 3 * (1 - k)); ctx.beginPath(); ctx.arc(sx, sy, r, rot - 1.1, rot + 1.1); ctx.stroke(); ctx.strokeStyle = C.peri; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sx, sy, r - 3, rot - 0.9, rot + 0.9); ctx.stroke(); ctx.restore(); }));
  }

  // ================= U: Crescent Toss =================
  function dressToss(p, z, n0) {
    z.shots.slice(n0).forEach(s => {
      if (!(s instanceof Proj) || s.mika || s.w !== 14 || s.h !== 14) return;
      s.mika = 1; const pts = [];
      s.render = (ctx, x, y, q) => { pts.push([x + G.cam.x, y + G.cam.y]); if (pts.length > 6) pts.shift(); trail(ctx, pts.map(v => [v[0] - G.cam.x, v[1] - G.cam.y]), 0.8); blade(ctx, x, y, 10, q.t * 0.55); };
    });
  }
  const _ct = CASTS.crescent_toss;
  CASTS.crescent_toss = function (p, z) { const n0 = z.shots.length, r = _ct.apply(this, arguments); if (isM(G)) dressToss(p, z, n0); return r; };

  // ================= S+U: Moon Vault =================
  const _mv = CASTS.moon_vault;
  if (_mv) CASTS.moon_vault = function (p, z) {
    const n0 = z.shots.length, r = _mv.apply(this, arguments);
    if (!isM(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face, pts = [];
    z.shots.push(new Vis(p.x, p.y, 34, (ctx) => { if (pts.length > 1) trail(ctx, pts.map(v => [v[0] - G.cam.x, v[1] - G.cam.y]), 0.9); }, v => {
      if (drv && !drv.gone) pts.push([p.x, p.y - 18]); else if (pts.length) pts.shift();
      if (drv && drv.t === 10 && !v.cut) { v.cut = 1; crescentSlash(z, p.x, p.y + 4, 22, dir > 0 ? PI * 0.5 : PI * 0.5, 12); }
      if (!pts.length && v.t > 6) v.gone = true;
    }));
    return r;
  };

  // ================= I: Twin Orbit: two moon-blades whose phases turn =================
  const _to = CASTS.twin_orbit;
  CASTS.twin_orbit = function (p, z) {
    const r = _to.apply(this, arguments);
    if (!isM(G)) return r;
    const o = z.shots.find(s => s.isOrbit && s.p === p && !s.gone);
    if (o) o.render = (ctx, x, y, t) => {
      [0, PI].forEach(ph => {
        const a = t * 0.2 + ph, px = Math.round(p.x - G.cam.x + Math.cos(a) * 28), py = Math.round(p.y - G.cam.y - 20 + Math.sin(a) * 12), front = Math.sin(a) > 0;
        blade(ctx, px, py, front ? 11 : 9, a + PI / 2 + t * 0.3, { a: front ? 1 : 0.7 });
      });
    };
    return r;
  };

  // ================= S+I: Lunar Dive =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.mika;
  if (BU && BU.cast) {
    const _ld = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ld.apply(this, arguments);
      if (!isM(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step), trails = [[], [], [], []];
      let end = -1, ex = 0, ey = 0;
      z.shots.push(new Vis(p.x, p.y, 80, (ctx, sx, sy, t) => {
        trails.forEach(tr => { if (tr.length > 1) trail(ctx, tr.map(v => [v[0] - G.cam.x, v[1] - G.cam.y]), 0.85); });
        if (end >= 0) { const k = (t - end) / 18, x = Math.round(ex - G.cam.x), y = Math.round(ey - G.cam.y); ctx.save(); ctx.globalAlpha = 1 - k; art.ring(ctx, C.pale, x, y - 4, Math.round(10 + k * 34)); art.ring(ctx, C.peri, x, y - 4, Math.round(6 + k * 24)); ctx.restore(); for (let i = 0; i < 4; i++) blade(ctx, x + Math.cos(i * PI / 2 + k * 3) * (12 + k * 30), y - 8 + Math.sin(i * PI / 2 + k * 3) * (4 + k * 8), 7, i * PI / 2 + k * 6, { a: 1 - k }); }
      }, v => {
        const t = v.t;
        if (end < 0 && drv && !drv.gone && drv.t >= 12) trails.forEach((tr, i) => { const a = t * 0.8 + i * PI / 2; tr.push([p.x + Math.cos(a) * 14, p.y - 18 + Math.sin(a) * 5]); if (tr.length > 14) tr.shift(); });
        if (end < 0 && (!drv || drv.gone) && t > 4) { end = t; ex = p.x; ey = p.y; v.life = t + 18; }
        if (end >= 0) trails.forEach(tr => tr.shift());
      }));
      return r;
    };
  }

  // ================= W+O: Lunar Halo, and the finisher =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.mika;
  if (SIG && SIG.cast) {
    const _lh = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _lh.apply(this, arguments);
      if (!isM(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint) return;
        s.paint = (ctx, sx, sy, q) => { for (let i = 0; i < 4; i++) { const a = q.t * 0.16 + i * 6.283 / 4, x = Math.round(sx + Math.cos(a) * 26), y = Math.round(sy + Math.sin(a) * 26 * 0.7); blade(ctx, x, y, 10, a + PI / 2); } };
        const _end = s.end;
        s.end = function () { const m = z.shots.length, out = _end ? _end.apply(this, arguments) : undefined; z.shots.slice(m).forEach(q => { if (q.paint) { const pts = []; q.paint = (ctx, x, y, qq) => { pts.push([x + G.cam.x, y + G.cam.y]); if (pts.length > 8) pts.shift(); trail(ctx, pts.map(v => [v[0] - G.cam.x, v[1] - G.cam.y]), 0.8); blade(ctx, x, y, 8, (qq ? qq.t : 0) * 0.5); }; } }); return out; };
      });
      return r;
    };
  }
  function dressFin(p, z) {
    z.shots.forEach(s => {
      if (s.mika || !s.paint || s.life !== 20 || !/#7a80c0/.test(String(s.paint))) return;
      s.mika = 1; const pts = [];
      s.paint = (ctx, x, y, q) => { pts.push([x + G.cam.x, y + G.cam.y]); if (pts.length > 6) pts.shift(); trail(ctx, pts.map(v => [v[0] - G.cam.x, v[1] - G.cam.y]), 0.9); blade(ctx, x, y, 9, (q.vx > 0 ? 0 : PI) + (q.t || 0) * 0.4); };
    });
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face;
    if (behind && p.awakeT > 0) {   // Full Moon: two small moons behind her shoulders
      const fade = Math.min(1, p.awakeT / 30), bob = Math.sin(p.t * 0.05) * 1.5;
      moon(ctx, sx - d * 10, sy - 40 + bob, 5, { a: fade * 0.9 });
      moon(ctx, sx + d * 3, sy - 46 - bob, 4, { col: C.peri, a: fade * 0.9 });
      return;
    }
    if (behind) return;
    if (p.modeT > 0) {   // Night Sky: faint stars twinkle round her
      const fade = Math.min(1, p.modeT / 30);
      ctx.save();
      for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.4, r = 14 + (i * 7) % 12, tw = 0.5 + 0.5 * Math.sin(p.t * 0.15 + i * 2); ctx.globalAlpha = fade * tw; const x = Math.round(sx + Math.cos(a) * r), y = Math.round(sy - 20 + Math.sin(a) * r * 0.8); art.rect(ctx, C.w, x, y, 1, 1); if (tw > 0.85) { art.rect(ctx, C.peri, x - 1, y, 3, 1); art.rect(ctx, C.peri, x, y - 1, 1, 3); } }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isM(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isM(g || this.G) && z && z.shots) dressFin(this, z); return r; };

  // ================= W+I: Moonfall =================
  const _mf = N.ULT && N.ULT.moonfall;
  if (_mf) N.ULT.moonfall = function (p, z, foes) {
    const n0 = z.shots.length, L = fx.list, m = L.length, r = _mf.apply(this, arguments);
    if (!isM(G)) return r;
    z.shots.slice(n0).forEach(v => {   // the sky: dark, and two cratered moons rising
      if (!(v instanceof Vis) || v.life !== 66 || !v.render) return;
      v._ugS = 1;
      v.render = (ctx, x, y, t) => { const k = Math.min(1, t / 14); ctx.save(); ctx.globalAlpha = 0.45 * k; ctx.fillStyle = C.d1; ctx.fillRect(0, 0, W, H); ctx.restore(); moon(ctx, 120, Math.round(70 - 30 * k), 18, {}); moon(ctx, W - 120, Math.round(70 - 30 * k), 14, { col: C.peri }); };
    });
    for (let i = L.length - 1; i >= m; i--) {   // each cut across the arena: a silver crescent sweep instead of a plain line
      const q = L[i]; if (!q || q.k !== 'b' || !q.pts) continue;
      const [a, b] = q.pts, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      L.splice(i, 1);
      const s = new Vis(mx, my, 12, (ctx, sx, sy, t) => { const k = t / 12, R = W * 0.6, dir = b[0] > a[0] ? 1 : -1; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = C.w; ctx.lineWidth = 3 * (1 - k) + 1; ctx.beginPath(); ctx.arc(sx, sy + R * 0.96, R, -PI / 2 - 0.42, -PI / 2 + 0.42); ctx.stroke(); ctx.strokeStyle = C.peri; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sx, sy + R * 0.96 + 4, R, -PI / 2 - 0.38, -PI / 2 + 0.38); ctx.stroke(); ctx.restore(); void dir; });
      s._ugS = 1; z.shots.push(s);
    }
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the two moons swing together over the target into one eclipse, and a giant
  // crescent cuts through it on an impact frame
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('mika') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 34;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2)), gap = 46 * (1 - k);
        moon(ctx, sx - gap, cy, 16, { a: Math.min(1, k * 3) });
        moon(ctx, sx + gap, cy, 15, { col: C.peri, a: Math.min(1, k * 3), phase: k > 0.85 ? (k - 0.85) * 6 : 0 });
        if (k > 0.85) { ctx.save(); ctx.globalAlpha = (k - 0.85) * 6; art.ring(ctx, C.w, sx, cy, 19); ctx.restore(); }   // the eclipse's corona
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? C.w : undefined;
        if (ik < 1) PX.impact(ctx, sx, cy + 14, ik, 31);
        moon(ctx, sx, cy, 16, { phase: 0.9, a: 1 - ease((k - 0.4) / 0.6), mono });
        blade(ctx, sx, cy + 14, 30, -0.6 + k * 0.4, { a: 1 - ease((k - 0.5) / 0.5), mono });
        if (st === FIN) for (let i = 0; i < 22; i++) part(T.x + rand(-12, 12), T.y - rand(4, 40), i % 2 ? C.pale : C.peri, rand(-4, 4), -rand(0, 4), 22, 2, 0.08);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
