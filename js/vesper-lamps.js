'use strict';
// Shattered Worlds — Vesper's lamps (the user, 2026-11-20: "Vesper's lamps"). Her story: the lamplighter of the
// sea wall; "every lamp on the sea wall came alight at dusk and nobody saw who lit them: only a red scarf against the
// snow, already at the next lamp"; "a slim figure wrapped in dark navy cloth with only the eyes showing, a long
// crimson scarf, a short blade in a reverse grip and stars between her fingers". So: black-steel throwing stars
// with a glint of lamp gold, her crimson scarf left behind wherever she has been, iron harbour lamps that light as
// she passes, and shadows that take hold. Crisp pixel art through js/pixel-kit.js; small pieces drawn once and reused.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/orin-doors.js.
//   J      reverse-grip cuts, and the scarf flicks after each one
//   U      Star Volley: black-steel stars, spinning, a lamp-gold glint on each
//   S+U    Smoke Step: smoke where she was, and the scarf trailing from there to where she is
//   I      Phantom Rush: a long crimson scarf through everyone she passes
//   S+I    Pinned Shadow: a kunai nails their shadow to the floor; it struggles, then bites
//   W+O    Shadow Bind: shadow hands come out of the floor and hold them, and a lamp above gutters out
//   S+O    Shadow Veil: her scarf streams     O  Night Form: three small lamp flames hang round her (both small)
//   W+I    Thousand Cuts: a harbour lamp lights beside them each time she appears; in the cinematic finish
//          (js/ult-cinema.js) her eyes and scarf fill the frame beside them, then one red cut and every lamp flares
// SW.vesperLamps.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !CASTS || !CASTS.star_volley || !CASTS.smoke_step || !CASTS.phantom_rush || !SW.data.heroes.vesper) return;
  const VL = SW.vesperLamps = { on: true };
  const isV = g => !!(VL.on && g && g.state && g.state.hero === 'vesper');
  const PI = Math.PI, Vis = N.Vis, part = N.part, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  function strip(c, pts, w0, w1, col) {
    const L = [], Rr = [], n = pts.length;
    for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = w0 + (w1 - w0) * i / Math.max(1, n - 1); L.push([pts[i][0] - dy / d * w, pts[i][1] + dx / d * w]); Rr.unshift([pts[i][0] + dy / d * w, pts[i][1] - dx / d * w]); }
    poly(c, L.concat(Rr), col);
  }

  // ink, navy, slate, steel, pale steel, white, deep crimson, crimson, pink, lamp amber, lamp gold, flame white, iron
  const PAL = ['#0a0a14', '#1a1a2e', '#3a3f5a', '#7a8098', '#c8ccd8', '#ffffff', '#8a1030', '#ff4d7a', '#ffd0dc', '#d88a20', '#ffd24a', '#fff3c0', '#2a2838'];
  const C = { k: PAL[0], nv: PAL[1], sl: PAL[2], st: PAL[3], ps: PAL[4], w: PAL[5], dc: PAL[6], cr: PAL[7], pk: PAL[8], am: PAL[9], gd: PAL[10], fw: PAL[11], ir: PAL[12] };
  const kept = new Map();
  function stamp(ctx, key, x, y, w, h, draw, a, oy) {
    let cv = kept.get(key);
    if (!cv) {
      w = 2 * Math.ceil(w / 2); h = 2 * Math.ceil(h / 2);
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const drop = () => { if (kept.get(key) === cv) kept.delete(key); };   // a canvas the browser drops while the tab is hidden comes back blank: draw it again
      cv.addEventListener('contextlost', drop); cv.addEventListener('contextrestored', drop);
      PX.sprite(cv.getContext('2d'), w / 2, h / 2, w, h, draw, { pal: PAL, outline: C.k });
      if (kept.size > 400) kept.clear();
      kept.set(key, cv);
    }
    ctx.save(); ctx.imageSmoothingEnabled = false; if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    ctx.drawImage(cv, R(x) - cv.width / 2, R(y - (oy || 0)) - cv.height / 2);
    ctx.restore();
  }

  // ================= a throwing star: four blades of black steel, a gold glint =================
  function starVec(c, s, glint) {
    for (let i = 0; i < 4; i++) { const a = i * PI / 2; c.save(); c.rotate(a); poly(c, [[-s * 0.16, -s * 0.12], [s * 0.5, -s * 0.04], [s * 0.18, s * 0.16]], C.st); poly(c, [[-s * 0.16, -s * 0.12], [s * 0.5, -s * 0.04], [s * 0.1, -s * 0.02]], C.ps); c.restore(); }
    ell(c, 0, 0, s * 0.14, s * 0.14, C.nv); ell(c, 0, 0, s * 0.06, s * 0.06, C.k);
    if (glint) { poly(c, [[s * 0.18, -s * 0.06], [s * 0.42, -s * 0.05], [s * 0.2, 0]], C.gd); poly(c, [[s * 0.2, -s * 0.05], [s * 0.3, -s * 0.05], [s * 0.21, -s * 0.02]], C.fw); }
  }
  function star(ctx, x, y, s, t) { const q = ((t % 4) + 4) % 4; stamp(ctx, 'star|' + s + '|' + q, x, y, s * 1.4 + 6, s * 1.4 + 6, c => { c.rotate(q * PI / 8); starVec(c, s, q % 2 === 0); }); }
  // a harbour lamp on an iron post: (0, 0) its foot, h tall; lit 0 dark .. 1 burning
  function lampVec(c, h, lit) {
    poly(c, [[-h * 0.03, 0], [h * 0.03, 0], [h * 0.025, -h * 0.78], [-h * 0.025, -h * 0.78]], C.ir);   // the post
    poly(c, [[-h * 0.08, 0], [h * 0.08, 0], [h * 0.05, -h * 0.04], [-h * 0.05, -h * 0.04]], C.ir);
    poly(c, [[0, -h * 0.78], [h * 0.14, -h * 0.82], [h * 0.14, -h * 0.79], [0, -h * 0.75]], C.ir);   // its arm
    const lx = h * 0.14, ly = -h * 0.8;
    poly(c, [[lx - h * 0.06, ly + h * 0.04], [lx + h * 0.06, ly + h * 0.04], [lx + h * 0.08, ly + h * 0.2], [lx - h * 0.08, ly + h * 0.2]], lit > 0.1 ? C.gd : C.sl);   // the glass
    if (lit > 0.1) { ell(c, lx, ly + h * 0.13, h * 0.035, h * 0.055 * (0.7 + 0.3 * lit), C.fw); poly(c, [[lx - h * 0.06, ly + h * 0.04], [lx - h * 0.02, ly + h * 0.04], [lx - h * 0.03, ly + h * 0.2], [lx - h * 0.08, ly + h * 0.2]], C.am); }
    poly(c, [[lx - h * 0.09, ly + h * 0.04], [lx, ly - h * 0.03], [lx + h * 0.09, ly + h * 0.04]], C.ir); poly(c, [[lx - h * 0.09, ly + h * 0.2], [lx + h * 0.09, ly + h * 0.2], [lx + h * 0.07, ly + h * 0.23], [lx - h * 0.07, ly + h * 0.23]], C.ir);
  }
  function lamp(ctx, x, y, h, lit, a, dir) {
    const q = lit > 0.6 ? 2 : lit > 0.1 ? 1 : 0;
    stamp(ctx, 'lamp|' + h + '|' + q + '|' + (dir || 1), x, y, h * 0.6, h + 8, c => { c.translate(0, h / 2); c.scale(dir || 1, 1); lampVec(c, h, q / 2); }, a, h / 2);
    if (lit > 0.1) { ctx.save(); ctx.globalAlpha *= 0.18 * lit * (a === undefined ? 1 : a); ctx.fillStyle = '#ffd24a'; ctx.beginPath(); ctx.arc(R(x + (dir || 1) * h * 0.14), R(y - h * 0.67), h * 0.25, 0, PI * 2); ctx.fill(); ctx.restore(); }   // its pool of light
  }
  // her scarf through points, getting thinner at the end, a dark edge under it
  function scarf(ctx, pts, w, a) {
    if (pts.length < 2) return;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(q => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    PX.sprite(ctx, cx, cy, x1 - x0 + w * 4 + 8, y1 - y0 + w * 4 + 8, c => { const loc = pts.map(q => [q[0] - cx, q[1] - cy]); strip(c, loc, w, 0.6, C.dc); strip(c, loc.map(q => [q[0], q[1] - w * 0.35]), w * 0.7, 0.4, C.cr); strip(c, loc.map(q => [q[0], q[1] - w * 0.6]), w * 0.25, 0.2, C.pk); }, { pal: PAL, outline: C.k, alpha: a });
  }
  Object.assign(VL, { star, lamp, scarf, PAL });
  const smoke = (x, y, n) => { for (let i = 0; i < n; i++) part(x + rand(-8, 8), y - rand(0, 30), i % 3 ? '#3a3f5a' : '#7a8098', rand(-1, 1), rand(-0.8, 0.2), 22, 3, -0.01); };
  const embers = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-4, 4), y + rand(-4, 4), i % 2 ? '#ffd24a' : '#ff4d7a', rand(-pw, pw), rand(-pw, 0.4), 16, 2, 0.04); };

  // ================= U: Star Volley =================
  const _sv = CASTS.star_volley;
  CASTS.star_volley = function (p, z) {
    const n0 = z.shots.length, r = _sv.apply(this, arguments);
    if (!isV(G)) return r;
    z.shots.slice(n0).forEach((s, i) => { if (s instanceof Proj && s.w === 10 && s.h === 10) { s.vl = 1; s.render = (ctx, x, y, q) => star(ctx, x, y, 15, q.t + i); } });
    return r;
  };

  // ================= S+U: Smoke Step: the scarf trails from where she was =================
  const _ss = CASTS.smoke_step;
  CASTS.smoke_step = function (p, z) {
    const x0 = p.x, y0 = p.y, r = _ss.apply(this, arguments);
    if (!isV(G) || Math.abs(p.x - x0) < 4) return r;
    const x1 = p.x, y1 = p.y;
    z.shots.push(new Vis(x0, y0, 18, (ctx, sx, sy, t) => {
      const ox = x0 - G.cam.x, oy = y0 - G.cam.y - 30, nx = x1 - G.cam.x, ny = y1 - G.cam.y - 30, u = ease(t / 6), pts = [];
      for (let k = 0; k <= 10; k++) { const v = k / 10 * u; pts.push([ox + (nx - ox) * v, oy + (ny - oy) * v - Math.sin(v * PI) * 14 + Math.sin(t * 0.5 + k) * 1.5]); }
      scarf(ctx, pts.reverse(), 3, t > 10 ? (18 - t) / 8 : 1);
    }));
    return r;
  };

  // ================= I: Phantom Rush: the scarf through everyone =================
  const _pr = CASTS.phantom_rush;
  CASTS.phantom_rush = function (p, z) {
    const r = _pr.apply(this, arguments);
    if (!isV(G)) return r;
    const trail = [];
    z.shots.push(new Vis(p.x, p.y, 40, (ctx, sx, sy, t) => {
      if (trail.length < 2) return;
      const a = t > 26 ? (40 - t) / 14 : 1, pts = trail.map(q => [q[0] - G.cam.x, q[1] - G.cam.y]);
      scarf(ctx, pts, 3.5, a);
    }, v => { if (v.t < 24 && !p.dead) { trail.unshift([p.x - p.face * 4, p.y - 30 + Math.sin(v.t * 0.7) * 3]); if (trail.length > 22) trail.pop(); } }));
    return r;
  };

  // ================= S+I: Pinned Shadow =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.vesper;
  if (BU && BU.cast) {
    const _ps = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ps.apply(this, arguments);
      if (!isV(G)) return r;
      const v = z.shots.slice(n0).find(s => s.life === 54 && s.render);
      if (v) v.render = (ctx, x, y, t) => {
        const wr = Math.sin(t * 0.9) * (t < 34 ? 3 : 1), bite = t > 34 ? ease((t - 34) / 10) : 0;
        ctx.save(); ctx.globalAlpha = 0.8; ctx.fillStyle = '#0a0a14'; ctx.beginPath(); ctx.ellipse(x + wr, y - 1, 18 + Math.abs(wr), 4, 0, 0, PI * 2); ctx.fill(); ctx.restore();   // the shadow, struggling
        for (const d of [-1, 1]) { ctx.save(); ctx.globalAlpha = 0.7; art.line(ctx, '#0a0a14', R(x + d * 16 + wr), y - 1, R(x + d * (22 + Math.abs(wr) * 2)), R(y - 3 - Math.abs(wr)), 2); ctx.restore(); }   // its arms pulling at the pin
        stamp(ctx, 'kunai', x, y - 7, 14, 22, c => { poly(c, [[-1, -9], [1, -9], [1, -2], [-1, -2]], C.ir); ell(c, 0, -10, 2, 2, C.ir); poly(c, [[-2.5, -2], [2.5, -2], [0, 8]], C.st); poly(c, [[-2.5, -2], [0, -2], [0, 8]], C.ps); poly(c, [[-1, -7], [5, -5], [1, -4]], C.cr); });   // the kunai, a red tassel
        if (bite > 0) for (let i = 0; i < 4; i++) { const bx = x - 12 + i * 8, h = 22 * bite * (i % 2 ? 0.8 : 1); stamp(ctx, 'fang|' + R(h / 4), bx, y - h / 2, 10, h + 6, c => { poly(c, [[-3, h / 2], [3, h / 2], [0.5, -h / 2], [-0.5, -h / 2]], C.nv); poly(c, [[-3, h / 2], [-0.5, h / 2], [-0.2, -h / 2]], C.sl); }, 0.95); }   // and bites
      };
      return r;
    };
  }

  // ================= W+O: Shadow Bind: shadow hands, a lamp going out =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.vesper;
  if (SIG && SIG.cast) {
    const _sb = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _sb.apply(this, arguments);
      if (!isV(G)) return r;
      const s0 = z.shots.slice(n0).find(s => s.paint && s.life >= 30);
      if (s0) {
        const delay = s0.life - 24, side = p.face;
        s0.paint = (ctx, sx, sy, s) => {
          const k = s.t - delay, up = k < 0 ? 0.5 * ease((s.t - delay * 0.4) / (delay * 0.6)) : Math.min(1, 0.7 + 0.15 * (k + 1)), fade = k > 16 ? Math.max(0, (24 - k) / 8) : 1;
          const flick = k < 0 ? 1 : k < 6 ? (k % 2 ? 0.3 : 1) : 0;   // the lamp above gutters out as they take hold
          lamp(ctx, sx + side * 26, sy, 64, flick, 0.9 * fade, -side);
          if (up <= 0) return;
          for (let i = 0; i < 4; i++) {   // shadow hands, clawing up out of the floor
            const hx = sx - 15 + i * 10, h = 40 * up * (i % 2 ? 0.85 : 1) * fade, lean = (i - 1.5) * 0.12, grip = k > 0 ? 1 : 0;
            stamp(ctx, 'hand|' + R(h / 4) + '|' + i + '|' + grip, hx, sy - h / 2, 22, h + 12, c => {
              c.translate(0, h / 2);
              poly(c, [[-3, 0], [3, 0], [3 + lean * h, -h * 0.75], [-3 + lean * h, -h * 0.75]], C.nv); poly(c, [[-3, 0], [-1.2, 0], [-1.2 + lean * h, -h * 0.75], [-3 + lean * h, -h * 0.75]], C.dc);
              for (let f = 0; f < 4; f++) { const fx0 = -3.5 + f * 2.3 + lean * h, ang = -PI / 2 + (f - 1.5) * 0.35 + (grip ? (1.5 - f) * 0.25 : 0); c.save(); c.translate(fx0, -h * 0.75); c.rotate(ang + PI / 2); poly(c, [[-0.9, 0], [0.9, 0], [0.4, -h * 0.25], [-0.2, -h * 0.28]], C.nv); poly(c, [[-0.5, -h * 0.18], [0.5, -h * 0.18], [-0.2, -h * 0.28]], C.cr); c.restore(); }
            }, 1);
          }
        };
      }
      return r;
    };
  }

  // ================= J: reverse-grip cuts, the scarf flicking after; the small auras =================
  const CUT = ['#1a1a2e', '#ff4d7a', '#ffffff'];
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 8) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.55 : 22, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), up = a.anim === 'launcher';
        PX.claws(ctx, sx + d * (reach + 2), hy, up ? (d > 0 ? -1.0 : PI + 1.0) : (a.hitAt % 2 ? (d > 0 ? 0.6 : PI - 0.6) : (d > 0 ? -0.5 : PI + 0.5)), big ? 34 : 24, k / 8, CUT, 2);
        if (k === 0) embers(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), 2, 1.5);
      }
    }
    const veil = p.modeT > 0, ult = p.state === 'ult';
    if (!front && (veil || (a && (p.state === 'attack' || p.state === 'airatk')))) {   // the scarf: it streams behind her in Shadow Veil, and flicks after each blow
      const fade = veil ? Math.min(1, p.modeT / 30) : 0.9, len = veil ? 30 : 18, pts = [];
      for (let k2 = 0; k2 <= 7; k2++) { const u = k2 / 7; pts.push([sx - d * (2 + u * len), sy - 30 + u * 8 + Math.sin(p.t * 0.4 - u * 5) * 3 * u]); }
      scarf(ctx, pts, 2.2, fade);
    }
    if (front && p.awakeT > 0 && !ult) {   // Night Form: three small lamp flames hang round her (small)
      const fade = Math.min(1, p.awakeT / 30);
      for (let i = 0; i < 3; i++) { const an = p.t * 0.03 + i * 2.09, fx0 = R(sx + Math.cos(an) * 16), fy0 = R(sy - 26 + Math.sin(an) * 9 - 6); ctx.save(); ctx.globalAlpha = fade * (0.8 + 0.2 * Math.sin(p.t * 0.6 + i)); art.rect(ctx, '#d88a20', fx0 - 1, fy0 - 1, 3, 4); art.rect(ctx, '#ffd24a', fx0, fy0 - 2, 1, 4); art.rect(ctx, '#fff3c0', fx0, fy0, 1, 1); ctx.globalAlpha *= 0.25; art.rect(ctx, '#ffd24a', fx0 - 3, fy0 - 3, 7, 7); ctx.restore(); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isV(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isV(g || this.G) || !z || !z.shots) return r;
    if (!this.dead && this.awakeT > a0 + 60) embers(this.x, this.y - 24, 12, 2.2);   // Night Form begins (small and short)
    return r;
  };

  // ================= W+I: Thousand Cuts =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isV(g)) return r;
    if (p.st >= 8 && p.st <= 60 && p.st % 6 === 2) foes.forEach((e, i) => {   // each time she appears beside them, a harbour lamp lights there
      const s = ((p.st / 6 | 0) + i) % 2 ? 1 : -1, lx = e.x - s * 30;
      z.shots.push(new Vis(lx, e.y, 70, (ctx, sx, sy, t) => { const lit = t < 3 ? t / 3 : t > 60 ? (70 - t) / 10 : 1; lamp(ctx, sx, sy, 60, lit, Math.min(1, t / 2) * (t > 60 ? (70 - t) / 10 : 1), s); }));
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('vesper') >= 0) finale(p, z, T);
    }
    return r;
  };
  // her face, close: navy cloth wrapped to the eyes, the crimson scarf blowing; (0, 0) the middle, s tall, facing +x
  function faceVec(c, s, t) {
    for (let i = 0; i < 3; i++) { const pts = []; for (let k = 0; k <= 9; k++) { const u = k / 9; pts.push([-s * 0.1 - u * s * (1.2 - i * 0.2), s * 0.28 + i * s * 0.08 + Math.sin(t * 0.3 - u * 5 + i) * s * 0.1 * u]); } strip(c, pts, s * 0.09, s * 0.02, i === 1 ? C.cr : C.dc); }   // the scarf, blowing back
    poly(c, [[-s * 0.4, s * 0.5], [-s * 0.44, -s * 0.1], [-s * 0.2, -s * 0.46], [s * 0.18, -s * 0.48], [s * 0.42, -s * 0.24], [s * 0.46, s * 0.12], [s * 0.3, s * 0.5]], C.nv);   // the wrapped head
    poly(c, [[-s * 0.44, -s * 0.1], [-s * 0.2, -s * 0.46], [s * 0.18, -s * 0.48], [-s * 0.1, -s * 0.34]], C.sl);
    poly(c, [[-s * 0.1, -s * 0.12], [s * 0.44, -s * 0.12], [s * 0.45, s * 0.02], [-s * 0.1, s * 0.02]], '#e8c0a8');   // the strip of face
    poly(c, [[-s * 0.1, s * 0.02], [s * 0.45, s * 0.02], [s * 0.45, s * 0.05], [-s * 0.1, s * 0.05]], '#a87860');
    for (const ex of [0.1, 0.32]) { poly(c, [[s * ex - s * 0.07, -s * 0.07], [s * ex + s * 0.07, -s * 0.09], [s * ex + s * 0.06, -s * 0.02], [s * ex - s * 0.06, -s * 0.02]], C.k); ell(c, s * ex + s * 0.02, -s * 0.05, s * 0.025, s * 0.025, C.cr); ell(c, s * ex + s * 0.01, -s * 0.06, s * 0.01, s * 0.01, C.w); }   // the eyes
    poly(c, [[-s * 0.3, s * 0.18], [s * 0.4, s * 0.16], [s * 0.36, s * 0.34], [-s * 0.3, s * 0.38]], C.dc); poly(c, [[-s * 0.3, s * 0.18], [s * 0.4, s * 0.16], [s * 0.38, s * 0.22], [-s * 0.3, s * 0.24]], C.cr);   // the scarf round her neck
  }
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const cy = sy - 20;
      if (st < FIN) {   // her eyes and scarf beside them, close
        const k = ease((st - 74) / 8), sh = st > FIN - 8 ? Math.sin(st * 2.3) * 1.2 : 0;
        PX.sprite(ctx, sx - dir * 60 + sh, cy - 12, 120, 80, c => { c.scale(dir, 1); faceVec(c, 44, st); }, { pal: PAL.concat(['#e8c0a8', '#a87860']), outline: C.k, alpha: k });
      } else {   // one red cut, and every lamp flares
        const k = (st - FIN) / 18, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 67);
        if (ik >= 0.5) {
          const L = 70 * ease(Math.min(1, (st - FIN) / 3)), a = 1 - ease((k - 0.5) / 0.5);
          ctx.save(); ctx.globalAlpha = a; art.line(ctx, '#8a1030', R(sx - L), R(cy + L * 0.35) + 1, R(sx + L), R(cy - L * 0.35) + 1, 4); art.line(ctx, '#ff4d7a', R(sx - L), R(cy + L * 0.35), R(sx + L), R(cy - L * 0.35), 3); art.line(ctx, '#ffffff', R(sx - L * 0.7), R(cy + L * 0.25), R(sx + L * 0.7), R(cy - L * 0.25), 1); ctx.restore();
          for (const d2 of [-1, 1]) { ctx.save(); ctx.globalAlpha = 0.35 * (1 - k); ctx.fillStyle = '#ffd24a'; ctx.beginPath(); ctx.arc(R(sx + d2 * 30 - d2 * 8), R(sy - 40), 14 + k * 24, 0, PI * 2); ctx.fill(); ctx.restore(); }   // the lamps she lit flare
        }
        if (st === FIN) embers(T.x, T.y - 18, 24, 4);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
