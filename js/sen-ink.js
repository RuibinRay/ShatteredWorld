'use strict';
// Shattered Worlds — Sen's ink (2026-11-20, the hero-look rework: cool, not cute). His story: master of the Rust Dojo,
// "stand still a moment, then be done"; his teacher's test was one line of ink on white paper, and the leaf cut just
// before it lands. White, a pink sash, black ink. His cuts were pale crescents like everyone's. Now every cut is a
// stroke of a brush: paper-white with a black ink edge and ink streaks (so it reads on a dark stage), thick in the middle,
// dry-brushed at the tail, drawn on as it cuts; what he cuts falls in two halves; an enso is drawn round him. His
// ultimate stays js/sen-stroke.js; only the white flash of its final split turns the white of paper. Draw-only: every hit,
// hitbox and timing stays as it was. Loaded after js/aldric-oath.js.
//   U      Draw: one clean brush line along the whole draw; a True Draw is a heavier line and a petal cut in half
//   S+U    Falling Leaf: a rising brush crescent, and an autumn leaf spiralling down in two halves
//   I      Three Breaths: three ink crescents, the third heavier, flicking ink spatter
//   S+I    After the Bell: one bell ring (a ripple), a still line of ink where he passed, then the cuts as crossed
//          brush strokes on everything he passed, and the glint of the sheath
//   W+O    Petal Storm: kept, with half-cut leaves turning in it
//   J      every blow is a short brush stroke
//   S+O    Flow State: a faint enso under his feet, petals drifting slowly      O  One Mind: an enso drawn round him,
//          the sheath glinting (both small on purpose: the view stays clear)
//   W+I    The Single Stroke (js/sen-stroke.js): the flash of its final split is the white of paper
// SW.senInk.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !Proj || !CASTS.draw || !CASTS.three_breaths) return;
  const SI = SW.senInk = { on: true };
  const isS = g => !!(SI.on && g && g.state && g.state.hero === 'sen');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { deep: '#d63a6a', ink: '#16121c', ink2: '#3a3040', paper: '#f4ecdc', paper2: '#d8ccb4', pink: '#ffa0c0', pale: '#ffe4ee', w: '#ffffff', lf: '#d9622b', lf2: '#f2a23a', lf0: '#8a2a10' };

  // a brush stroke along a polyline: k how much of it is drawn so far, a its fade; w its widest
  function brush(ctx, pts, w, k, a, o) {
    o = o || {}; w *= 1.6;   // (2026-11-20 look ranking: bolder strokes, they read as thin slashes)
    if (a <= 0 || pts.length < 2) return;
    const segs = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push(l); L += l; }
    const upto = L * clamp01(k), step = 2;
    const at = d => { let acc = 0; for (let i = 0; i < segs.length; i++) { if (acc + segs[i] >= d || i === segs.length - 1) { const u = segs[i] ? (d - acc) / segs[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; } acc += segs[i]; } return pts[pts.length - 1]; };
    const width = u => Math.max(1, w * (u < 0.12 ? 0.5 + u / 0.12 * 0.5 : 1 - (u - 0.12) / 0.88 * 0.75));   // pressed in hard, lifted off slowly
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    let prev = at(0);
    for (let d = step; d <= upto; d += step) { const q = at(d), u = d / L, ww = width(u); art.line(ctx, C.ink, R(prev[0]), R(prev[1]), R(q[0]), R(q[1]), R(ww + 2)); prev = q; }   // the ink edge
    prev = at(0);
    for (let d = step; d <= upto; d += step) {
      const q = at(d), u = d / L, ww = width(u);
      art.line(ctx, u < 0.2 ? C.w : C.paper, R(prev[0]), R(prev[1]), R(q[0]), R(q[1]), R(Math.max(1, ww - 1)));   // the stroke itself: the paper's white, the ink showing at its edge (it reads on a dark stage)
      if (u > 0.55 && ww >= 3 && (R(d / step) % 3 === 0)) { const nx = -(q[1] - prev[1]) / step, ny = (q[0] - prev[0]) / step; art.line(ctx, C.ink, R(prev[0] + nx), R(prev[1] + ny), R(q[0] + nx), R(q[1] + ny), 1); }   // dry brush at the tail: ink streaks through it
      if (!o.nopink && u > 0.1 && u < 0.7 && ww >= 3) art.line(ctx, u < 0.4 ? C.pink : C.pale, R(prev[0]), R(prev[1]), R(q[0]), R(q[1]), ww >= 6 ? 2 : 1);   // (2026-11-21: sakura) the pink heart of the stroke
      prev = q;
    }
    if (o.spatter && k >= 1) for (let i = 0; i < 6; i++) { const q = at(L * (0.5 + i * 0.08)); art.rect(ctx, C.ink, R(q[0] + Math.sin(i * 2.3) * 8), R(q[1] + Math.cos(i * 1.9) * 6 + 4), 2, 2); }
    ctx.restore();
  }
  SI.brush = brush;
  const line = (x0, y0, x1, y1) => [[x0, y0], [x1, y1]];
  const arcPts = (cx, cy, r, a0, a1, n, sq) => { const out = []; for (let i = 0; i <= (n || 10); i++) { const a = a0 + (a1 - a0) * i / (n || 10); out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * (sq || 1)]); } return out; };
  function halfLeaf(ctx, x, y, s, ang, side, a) {   // half of an autumn leaf, cut down its middle
    PX.sprite(ctx, R(x), R(y), s * 3, s * 3, c => {
      c.rotate(ang);
      c.beginPath(); c.moveTo(-s, 0); c.quadraticCurveTo(0, side * s * 0.9, s, 0); c.closePath(); c.fillStyle = C.lf; c.fill();
      c.beginPath(); c.moveTo(-s * 0.5, side * s * 0.15); c.quadraticCurveTo(0, side * s * 0.6, s * 0.5, side * s * 0.15); c.closePath(); c.fillStyle = C.lf2; c.fill();
      c.strokeStyle = C.lf0; c.lineWidth = 1; c.beginPath(); c.moveTo(-s, 0); c.lineTo(s, 0); c.stroke();   // the cut edge
    }, { alpha: a, outline: C.ink, keepThin: true });
  }
  function halfPetal(ctx, x, y, ang, side, a) {
    PX.sprite(ctx, R(x), R(y), 12, 12, c => { c.rotate(ang); c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(0, side * 3, 3, 0); c.closePath(); c.fillStyle = C.pink; c.fill(); c.fillStyle = C.w; c.fillRect(-3, 0, 6, 1); }, { alpha: a, outline: C.ink, keepThin: true });
  }
  // one sakura petal (the user, 2026-11-21: "like sakura petal not sakura flower", then "improve petal look"): a rounded
  // petal with a soft notch at its tip and a slim base; deep rose at the base, pale to white at the tip, folded along its
  // middle (one half lit, one half in shade) and outlined in dark rose. flip (-1..1) squashes it across, so a petal turning
  // in the air shows its edge. side 0 whole, -1 / 1 one half of it, cut down its length
  const PET = { out: '#6e1a3a', base: '#d9406e', body: '#ff8fb1', lit: '#ffc4d6', tip: '#fff2f6', shade: '#ee6f96' };
  function blossom(ctx, x, y, s, ang, side, a, flip) {
    if (a <= 0) return;
    const fx2 = flip === undefined ? 1 : (Math.abs(flip) < 0.22 ? 0.22 * (flip < 0 ? -1 : 1) : flip);
    PX.sprite(ctx, R(x), R(y), s * 2.4 + 4, s * 2.4 + 4, c => {
      c.rotate(ang); c.scale(fx2, 1);
      const outline = k => {   // tip up (y < 0), base down
        c.beginPath();
        c.moveTo(0, s * 0.95 * k);   // (longer than wide, a clear V at the tip: a heart shape read as a heart)
        c.bezierCurveTo(-s * 0.18 * k, s * 0.6 * k, -s * 0.52 * k, s * 0.15 * k, -s * 0.48 * k, -s * 0.45 * k);
        c.quadraticCurveTo(-s * 0.42 * k, -s * 0.9 * k, -s * 0.2 * k, -s * 0.95 * k);
        c.lineTo(0, -s * 0.62 * k);
        c.lineTo(s * 0.2 * k, -s * 0.95 * k);
        c.quadraticCurveTo(s * 0.42 * k, -s * 0.9 * k, s * 0.48 * k, -s * 0.45 * k);
        c.bezierCurveTo(s * 0.52 * k, s * 0.15 * k, s * 0.18 * k, s * 0.6 * k, 0, s * 0.95 * k);
        c.closePath();
      };
      c.save();
      if (side) { c.beginPath(); c.rect(side > 0 ? 0 : -s * 2, -s * 2, s * 2, s * 4); c.clip(); }
      outline(1); c.fillStyle = PET.body; c.fill(); c.save(); c.clip();
      c.fillStyle = fx2 > 0 ? PET.shade : PET.lit; c.fillRect(-s * 2, -s * 2, s * 2, s * 4);   // the fold: one half in shade
      c.fillStyle = fx2 > 0 ? PET.lit : PET.shade; c.fillRect(0, -s * 2, s * 2, s * 4);
      c.fillStyle = PET.tip; c.beginPath(); c.ellipse(s * 0.08, -s * 0.55, s * 0.3, s * 0.2, 0, 0, PI * 2); c.fill();   // pale towards the tip
      c.fillStyle = PET.base; c.beginPath(); c.ellipse(0, s * 0.82, s * 0.16, s * 0.3, 0, 0, PI * 2); c.fill();   // deep rose at the base
      c.fillStyle = PET.body; c.fillRect(-0.5, -s * 0.5, 1, s * 1.1);   // the midrib
      c.restore();
      if (side) { c.fillStyle = C.w; c.fillRect(side > 0 ? 0 : -1, -s * 0.85, 1, s * 1.7); }   // the clean cut
      c.restore();
    }, { alpha: a, outline: PET.out, keepThin: true });
  }
  SI.blossom = blossom;
  const petalBurst = (x, y, n, sp) => { for (let i = 0; i < n; i++) part(x + rand(-4, 4), y + rand(-4, 4), i % 3 ? C.pink : i % 2 ? C.pale : C.w, rand(-sp, sp), rand(-sp, sp * 0.4), 30 + (i % 4) * 6, 2, 0.02); };
  function enso(ctx, x, y, r, sq, k, a, w) {   // the brush circle, left open where the brush lifts
    brush(ctx, arcPts(x, y, r, -PI * 0.55, PI * 1.32, 24, sq), w || 3, k, a);
  }

  // ================= the cuts: brush strokes =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (!isS(g) || !p || !z || !z.shots || (col !== '#ffe4ee' && col !== '#ffffff' && col !== '#ff9ab8')) return _slash.apply(this, arguments);
    const d = dir || p.face;
    if (col === '#ffe4ee' && kind === 3 && (len === 54 || len === 90)) {   // Draw (the True Draw is the longer one)
      const tru = len === 90, x0 = x - d * len * 1.1, x1 = x + d * len * 0.45, life = tru ? 26 : 20;
      for (let i = 0; i < (tru ? 14 : 8); i++) { const u = i / (tru ? 14 : 8); part(x0 + (x1 - x0) * u, y + rand(-3, 3), i % 2 ? C.pink : C.pale, d * rand(0.3, 1.2), -rand(0.2, 1), 34, 2, 0.02); }   // petals shaken off along the line
      z.shots.push(new Vis(x, y, life, (ctx, sx, sy, t) => {
        const ox = sx - x, oy = sy - y, k = Math.min(1, (t + 1) / 3);
        brush(ctx, line(x0 + ox, y + oy + 2, x1 + ox, y + oy - 2), tru ? 7 : 5, k, 1 - ease((t - life * 0.5) / (life * 0.5)));
        { const u = t / life; [-1, 1].forEach(s => blossom(ctx, sx + d * 6 + s * u * 8, sy - 12 + s * u * 10 + u * u * 12, tru ? 9 : 6, u * 2 * s, s, 1 - u)); }   // a blossom cut in two where the draw ends
      }));
      return;
    }
    if (col === '#ffe4ee' && kind === 2 && len === 46) {   // Falling Leaf
      z.shots.push(new Vis(x, y, 16, (ctx, sx, sy, t) => brush(ctx, arcPts(sx - d * 8, sy + 10, 30, d > 0 ? PI * 0.55 : PI * 0.45, d > 0 ? -PI * 0.35 : PI * 1.35, 12), 5, Math.min(1, (t + 1) / 3), 1 - ease((t - 8) / 8))));
      const lx = x + d * 18, ly = y - 26;
      z.shots.push(new Vis(lx, ly, 60, (ctx, sx, sy, t) => { const u = t / 60; [-1, 1].forEach(s => blossom(ctx, sx + s * (u * 16 + Math.sin(t * 0.18 + s) * 6), sy + u * 60, 11, t * 0.12 * s, s, 1 - ease((u - 0.7) / 0.3))); }));
      petalBurst(lx, ly, 10, 1.6);
      return;
    }
    if ((col === '#ffffff' || col === '#ff9ab8') && len === 44 && p.state !== 'attack') {   // After the Bell: crossed strokes on what he passed
      const s = col === '#ffffff' ? 1 : -1;
      if (s > 0) { petalBurst(x, y, 16, 2.4); z.shots.push(new Vis(x, y, 26, (ctx, sx, sy, t) => { const u = t / 26; for (let i = 0; i < 5; i++) { const an = i / 5 * PI * 2 + 0.4, rr = 4 + ease(u * 1.6) * 26; blossom(ctx, sx + Math.cos(an) * rr, sy + Math.sin(an) * rr * 0.8 + u * u * 14, 10, an + PI / 2 + u * 3, 0, 1 - ease((u - 0.5) / 0.5), Math.cos(t * 0.35 + i * 1.3)); } })); }   // big petals fly off the cut
      z.shots.push(new Vis(x, y, 20, (ctx, sx, sy, t) => brush(ctx, line(sx - 16, sy - 16 * s, sx + 16, sy + 16 * s), 5, Math.min(1, (t + 1) / 2), 1 - ease((t - 10) / 10))));
      return;
    }
    if (col === '#ffe4ee' && (p.state === 'attack' || p.state === 'airatk')) {   // his J
      const a = p.atk, fin = !!(a && a.fin), Rr = Math.max(14, Math.min(30, (len || 24) * 0.8)), up = kind === 2 ? -1 : 1;
      z.shots.push(new Vis(x, y, fin ? 14 : 10, (ctx, sx, sy, t) => brush(ctx, arcPts(sx - d * Rr * 0.4, sy, Rr, d > 0 ? -1.1 * up : PI + 1.1 * up, d > 0 ? 0.9 * up : PI - 0.9 * up, 10), fin ? 6 : 4, Math.min(1, (t + 1) / 2), 1 - ease((t - (fin ? 7 : 5)) / (fin ? 7 : 5)), { spatter: fin })));
      return;
    }
    return _slash.apply(this, arguments);
  };

  // ================= I: Three Breaths: ink crescents =================
  function dressBreaths(z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.sen || s.w !== 18 || s.life !== 44 || !s.ghost) return;
      s.sen = 1; const heavy = s.h >= 44;
      s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1, hh = heavy ? 28 : 20; if ((q.t || 0) % 3 === 0) part(x - d * 6 + rand(-2, 2), y + rand(-hh, hh) * 0.8, (q.t || 0) % 2 ? C.pink : C.pale, -d * rand(0.5, 1.5), rand(-0.6, 0.6), 24, 2, 0.02); brush(ctx, arcPts(x - d * hh * 0.6, y, hh, d > 0 ? -1.2 : PI + 1.2, d > 0 ? 1.2 : PI - 1.2, 10), heavy ? 8 : 5, 1, 1, { spatter: heavy && (q.t || 0) % 4 < 2 }); };
    });
  }

  // ================= S+I: After the Bell: the bell's ring, the still line =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.sen;
  if (BU && BU.cast) {
    const _ab = BU.cast;
    BU.cast = function (p, z) {
      const x0 = p.x, r = _ab.apply(this, arguments);
      if (!isS(G)) return r;
      const x1 = p.x, y = p.y - 20, d = x1 >= x0 ? 1 : -1;
      z.shots.push(new Vis(x0, y, 34, (ctx, sx, sy, t) => {
        if (t < 10) { const u = t / 10; ctx.save(); ctx.globalAlpha *= 1 - u; for (let i = 0; i < 2; i++) { const rr = 6 + u * (20 + i * 12); for (let j = 0; j < 18; j++) { const a = j / 18 * PI * 2; art.rect(ctx, C.paper, R(sx + Math.cos(a) * rr), R(sy + Math.sin(a) * rr * 0.6), 1, 1); } } ctx.restore(); }   // the bell's ring
        brush(ctx, line(sx, sy + 1, sx + (x1 - x0), sy - 1), 3, Math.min(1, (t + 1) / 3), t < 26 ? 0.9 : 1 - (t - 26) / 8);   // the still line where he passed
        if (t >= 24 && t < 30) { const gx = R(x1 - G.cam.x) - d * 6, gy = R(p.y - 18 - G.cam.y); art.rect(ctx, C.w, gx - 3, gy, 7, 1); art.rect(ctx, C.w, gx, gy - 3, 1, 7); }   // the sheath's glint
      }));
      return r;
    };
  }

  // ================= W+O: Petal Storm, with half-cut leaves =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.sen;
  if (SIG && SIG.cast) {
    const _ps = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _ps.apply(this, arguments);
      if (!isS(G)) return r;
      z.shots.push(new Vis(p.x, p.y, 72, (ctx, sx, sy, t) => {
        const a = Math.min(1, t / 6, (72 - t) / 10);
        for (let i = 0; i < 8; i++) { const an = t * 0.16 + i / 8 * PI * 2, rr = 40 + (i % 2) * 6; blossom(ctx, sx + Math.cos(an) * rr, sy - 18 + Math.sin(an) * rr * 0.5, i % 2 ? 8 : 10, an + PI / 2 + t * 0.1 * (i % 2 ? 1 : -1), 0, a, Math.cos(t * 0.22 + i * 0.9)); }
        if (t % 4 === 0) petalBurst(sx + rand(-40, 40), sy - 18 + rand(-16, 16), 1, 1.2);
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const t = p.t || SW.frame, d = p.face;
    if (behind && p.awakeT > 0) {   // One Mind: an enso drawn round him, the sheath glinting
      const fade = Math.min(1, p.awakeT / 30);
      enso(ctx, sx, sy - 20, 22, 1, 1, 0.55 * fade, 3);
    }
    if (!behind && p.awakeT > 0 && t % 90 < 4) { const gx = sx - d * 6, gy = sy - 18; art.rect(ctx, C.w, gx - 3, gy, 7, 1); art.rect(ctx, C.w, gx, gy - 3, 1, 7); }
    if (behind && p.modeT > 0) {   // Flow State: a faint enso under his feet, petals drifting slowly
      const fade = Math.min(1, p.modeT / 30);
      enso(ctx, sx, sy - 1, 18, 0.22, 1, 0.5 * fade, 2);
    }
    if (!behind && p.modeT > 0) {
      const fade = Math.min(1, p.modeT / 30);
      for (let i = 0; i < 3; i++) { const an = t * 0.03 + i * 2.1; halfPetal(ctx, sx + Math.cos(an) * 16, sy - 24 + Math.sin(an * 1.3) * 10, an, i % 2 ? 1 : -1, fade * 0.8); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isS(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  // ================= W+I: The Single Stroke: its white flash at the final split becomes the white of paper =================
  const _fl = fx.flash; let held = -1;
  fx.flash = function (col, n) {
    const g = G, p = g && g.player;
    const sen = SW.versus && SW.versus.f ? SW.versus.f.find(f => f && f.p && f.p.state === 'ult' && f.p.senStroke && f.p.st === 188) : null;
    if (col === '#ffffff' && n === 16 && isS(g) && (sen || (p && p.senStroke && p.st === 188))) { held = SW.frame; return _fl.call(this, C.paper, n); }
    if (held === SW.frame && (n || 0) < 16) return;   // (a smaller flash later in the same frame would cover the paper at once)
    return _fl.apply(this, arguments);
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isS(g || this.G) && z && z.shots) dressBreaths(z); return r; };
})();
