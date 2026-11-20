'use strict';
// Shattered Worlds — Kiri's razor origami (2026-11-20, the hero-look rework running on its own: "make it cool not cute").
// Her story: wishes folded in the Paper Shrine, paper cranes, and a paper double. Paper here is a blade: every fold has
// a hard crease, a crimson edge and a point. Drawn as crisp pixel art by js/pixel-kit.js. Origami does not flex, so the
// cranes snap between folded poses instead of flapping smoothly. Draw-only: hits, hitboxes and timing are unchanged.
//   U      Paper Star: a big four-point folded shuriken, spinning, with a cutting arc behind it
//   S+U    Fold Step: she folds flat and is gone; one long cut line splits the air along her path
//   I      Crane Flock: sharp-winged origami cranes, wings snapping, crimson beaks
//   S+I    Paper Gale: a ring of long paper blades with slash arcs; the last cut flares
//   W+O    Crane Ward: three cranes circle her, then stoop with their wings folded back
//   (all)  her paper double is a white paper cut-out with ink creases that unfolds, strikes and tears apart
//   S+O    Quick Fold: paper scraps whip round her and two small cranes circle
//   O      Thousand Folds: a fan of paper blades opens behind her like wings and turns slowly
//   W+I    Paper Dragon: a real dragon of folded paper (horned head, fangs, whiskers, a body of folded plates) winds
//          across the arena; at the finishing blow (js/ult-grand.js) its head roars in close-up, then it bites through
//          the target on an impact frame
// SW.kiriOrigami.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.paper_star) return;
  const KO = SW.kiriOrigami = { on: true };
  const isK = g => !!(KO.on && g && g.state && g.state.hero === 'kiri');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const stroke = (c, pts, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'butt'; c.lineJoin = 'miter'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); };

  // ink, two crimsons, a hot red, paper in shadow, paper, white
  const PAL = ['#1a0a12', '#5a1024', '#b01030', '#ff4d6d', '#b8b0a6', '#f1ede4', '#ffffff'];
  const C = { ink: PAL[0], d: PAL[1], r: PAL[2], hot: PAL[3], sh: PAL[4], pa: PAL[5], w: PAL[6] };

  // ================= folded shapes (vector; (0, 0) their middle, facing +x) =================
  // an origami crane, s its length. pose 0 wings up, 1 wings out (seen edge-on), 2 wings down; dive: wings folded back
  function craneVec(c, s, o) {
    const pose = o.dive ? 3 : (o.pose || 0), lw = Math.max(1, s * 0.035);
    // a wing: a broad folded triangle from the back, with a crimson leading edge and an ink crease
    const wing = (tx, ty, col, edge) => { poly(c, [[-s * 0.3, 0], [s * 0.3, 0], [tx, ty]], col); poly(c, [[s * 0.3, 0], [tx, ty], [tx + s * 0.16, ty + (ty < 0 ? s * 0.2 : -s * 0.2)]], edge); stroke(c, [[-s * 0.02, 0], [tx, ty]], lw, C.ink); };
    if (pose === 0) wing(s * 0.3, -s * 0.66, C.sh, C.r);   // the far wing
    if (pose === 2) wing(s * 0.26, s * 0.6, C.sh, C.r);
    poly(c, [[-s * 0.06, -s * 0.02], [-s * 0.74, -s * 0.5], [-s * 0.34, s * 0.1]], C.sh);   // tail: a long point
    poly(c, [[-s * 0.06, -s * 0.02], [-s * 0.74, -s * 0.5], [-s * 0.42, -s * 0.14]], C.pa);
    poly(c, [[-s * 0.34, 0], [s * 0.34, 0], [0, s * 0.26]], C.sh);   // body: a folded diamond
    poly(c, [[-s * 0.34, 0], [s * 0.34, 0], [0, -s * 0.1]], C.pa);
    poly(c, [[s * 0.04, -s * 0.02], [s * 0.56, -s * 0.54], [s * 0.34, s * 0.1]], C.pa);   // neck
    poly(c, [[s * 0.34, s * 0.1], [s * 0.56, -s * 0.54], [s * 0.44, -s * 0.12]], C.sh);
    poly(c, [[s * 0.52, -s * 0.56], [s * 0.9, -s * 0.24], [s * 0.46, -s * 0.32]], C.hot);   // the beak: a crimson point, turned down
    stroke(c, [[s * 0.2, s * 0.02], [s * 0.54, -s * 0.5]], lw, C.ink);
    if (pose === 0) wing(-s * 0.1, -s * 0.82, C.pa, C.hot);
    else if (pose === 1) { poly(c, [[-s * 0.34, -s * 0.02], [s * 0.32, -s * 0.02], [-s * 0.04, -s * 0.2]], C.w); poly(c, [[-s * 0.34, s * 0.02], [s * 0.32, s * 0.02], [-s * 0.62, s * 0.16]], C.hot); }
    else if (pose === 2) wing(-s * 0.16, s * 0.74, C.pa, C.hot);
    else { poly(c, [[s * 0.16, -s * 0.04], [-s * 0.86, -s * 0.3], [-s * 0.24, s * 0.1]], C.pa); poly(c, [[s * 0.16, -s * 0.04], [-s * 0.86, -s * 0.3], [-s * 0.4, -s * 0.24]], C.hot); stroke(c, [[s * 0.08, 0], [-s * 0.8, -s * 0.27]], lw, C.ink); }
  }
  // a four-point folded shuriken, r its radius
  function starVec(c, r, rot) {
    c.rotate(rot);
    for (let i = 0; i < 4; i++) {
      const a = i * PI / 2, a2 = a + PI / 4, b = a - PI / 4, tip = [Math.cos(a) * r, Math.sin(a) * r], k = r * 0.44;
      poly(c, [[0, 0], [Math.cos(b) * k, Math.sin(b) * k], tip], C.sh);
      poly(c, [[0, 0], tip, [Math.cos(a2) * k, Math.sin(a2) * k]], C.pa);
      poly(c, [tip, [Math.cos(a2) * k, Math.sin(a2) * k], [Math.cos(a + 0.2) * r * 0.72, Math.sin(a + 0.2) * r * 0.72]], C.hot);   // the cutting edge
      stroke(c, [[0, 0], tip], Math.max(1, r * 0.07), C.ink);
    }
    poly(c, [[-r * 0.14, 0], [0, -r * 0.14], [r * 0.14, 0], [0, r * 0.14]], C.r);
  }
  // a long paper blade pointing +x, L long
  function bladeVec(c, L, wd) {
    poly(c, [[-L * 0.5, -wd], [L * 0.5, 0], [-L * 0.5, wd], [-L * 0.36, 0]], C.sh);
    poly(c, [[-L * 0.5, -wd], [L * 0.5, 0], [-L * 0.36, 0]], C.pa);
    poly(c, [[-L * 0.1, -wd * 0.6], [L * 0.5, 0], [-L * 0.1, -wd * 0.25]], C.hot);
    stroke(c, [[-L * 0.36, 0], [L * 0.5, 0]], Math.max(1, wd * 0.25), C.ink);
  }
  // the paper dragon's head: (0, 0) the back of the skull, facing +x, s its length; o = { jaw 0-1, t }
  function dragonHeadVec(c, s, o) {
    const jaw = clamp01(o.jaw === undefined ? 0.5 : o.jaw), t = o.t || 0;
    for (let i = 0; i < 2; i++) {   // whiskers: long folded strips, streaming back
      const pts = []; for (let k = 0; k <= 6; k++) { const u = k / 6; pts.push([s * 0.86 - u * s * 1.1, s * (0.02 + i * 0.08) + Math.sin(t * 0.25 - u * 4 + i * 2) * s * 0.09 * u - u * s * (0.1 - i * 0.3)]); }
      stroke(c, pts, Math.max(1, s * 0.05), i ? C.r : C.hot);
    }
    for (let i = 0; i < 4; i++) { const bx = -s * (0.06 + i * 0.15), by = -s * (0.14 - i * 0.02), L = s * (0.3 - i * 0.03); poly(c, [[bx + s * 0.08, by + s * 0.06], [bx - L * 0.8, by - L], [bx - s * 0.08, by + s * 0.1]], i % 2 ? C.hot : C.r); }   // the mane: folded spikes
    poly(c, [[s * 0.06, -s * 0.24], [-s * 0.5, -s * 0.74], [-s * 0.08, -s * 0.2]], C.sh);   // the far horn
    c.save(); c.translate(s * 0.02, s * 0.08); c.rotate(jaw * 0.6);   // the lower jaw
    poly(c, [[-s * 0.06, 0], [s * 0.8, s * 0.0], [s * 0.72, s * 0.09], [-s * 0.06, s * 0.16]], C.sh);
    poly(c, [[-s * 0.06, 0], [s * 0.8, s * 0.0], [s * 0.3, s * 0.05]], C.pa);
    c.restore();
    if (jaw > 0.08) poly(c, [[s * 0.0, s * 0.06], [s * 0.86, s * 0.02], [s * 0.02 + Math.cos(jaw * 0.6) * s * 0.8, s * 0.08 + Math.sin(jaw * 0.6) * s * 0.8], [s * 0.02, s * 0.2]], C.d);   // the mouth
    c.save(); c.translate(s * 0.02, s * 0.08); c.rotate(jaw * 0.6);   // the lower fangs, over the mouth
    for (let i = 0; i < 5; i++) poly(c, [[s * (0.2 + i * 0.12), s * 0.005], [s * (0.27 + i * 0.12), s * 0.005], [s * (0.235 + i * 0.12), -s * (i === 4 ? 0.2 : 0.11)]], C.w);
    c.restore();
    poly(c, [[-s * 0.3, s * 0.12], [-s * 0.3, -s * 0.1], [s * 0.0, -s * 0.3], [s * 0.42, -s * 0.24], [s * 0.92, -s * 0.07], [s * 0.98, s * 0.02], [s * 0.3, s * 0.06]], C.pa);   // the skull: flat folded planes
    poly(c, [[s * 0.0, -s * 0.3], [s * 0.42, -s * 0.24], [s * 0.92, -s * 0.07], [s * 0.4, -s * 0.13]], C.w);
    poly(c, [[-s * 0.3, s * 0.12], [-s * 0.3, -s * 0.1], [s * 0.0, -s * 0.02], [s * 0.3, s * 0.06]], C.sh);
    stroke(c, [[s * 0.0, -s * 0.3], [s * 0.4, -s * 0.13], [s * 0.98, s * 0.02]], Math.max(1, s * 0.02), C.ink);
    stroke(c, [[s * 0.0, -s * 0.02], [s * 0.4, -s * 0.13]], Math.max(1, s * 0.02), C.ink);
    for (let i = 0; i < 5; i++) poly(c, [[s * (0.36 + i * 0.12), s * 0.045 - i * s * 0.006], [s * (0.43 + i * 0.12), s * 0.04 - i * s * 0.006], [s * (0.4 + i * 0.12), s * (i === 4 ? 0.26 : 0.15)]], C.w);   // upper fangs
    poly(c, [[s * 0.2, -s * 0.2], [s * 0.5, -s * 0.12], [s * 0.48, -s * 0.07], [s * 0.22, -s * 0.13]], C.ink);   // the brow
    poly(c, [[s * 0.27, -s * 0.13], [s * 0.46, -s * 0.085], [s * 0.3, -s * 0.07]], C.hot);   // the eye: a crimson slit
    poly(c, [[s * 0.9, -s * 0.06], [s * 1.0, -s * 0.02], [s * 0.92, s * 0.0]], C.r);   // the nose
    poly(c, [[s * 0.1, -s * 0.27], [-s * 0.56, -s * 0.9], [-s * 0.02, -s * 0.2]], C.pa);   // the near horn
    poly(c, [[s * 0.1, -s * 0.27], [-s * 0.56, -s * 0.9], [-s * 0.2, -s * 0.5]], C.hot);
  }
  // one plate of the dragon's body, r its size
  function plateVec(c, r, i) {
    poly(c, [[-r, 0], [0, -r * 0.62], [r, 0], [0, r * 0.62]], C.sh);
    poly(c, [[-r, 0], [0, -r * 0.62], [r, 0]], i % 2 ? C.pa : C.w);
    poly(c, [[r * 0.3, -r * 0.4], [-r * 0.5, -r * 1.25], [-r * 0.3, -r * 0.42]], i % 2 ? C.hot : C.r);   // the dorsal fold
    stroke(c, [[-r, 0], [r, 0]], Math.max(1, r * 0.08), C.ink);
  }

  // ================= crisp sprites =================
  function crane(ctx, x, y, s, dir, o) { o = o || {}; PX.sprite(ctx, x, y, s * 2.2, s * 2.2, c => { c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); craneVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono }); }
  function star(ctx, x, y, r, rot, a) { PX.sprite(ctx, x, y, r * 2.6, r * 2.6, c => starVec(c, r, rot), { pal: PAL, alpha: a }); }
  function blade(ctx, x, y, L, ang, a, wd) { PX.sprite(ctx, x, y, L * 1.3, L * 1.3, c => { c.rotate(ang); bladeVec(c, L, wd || L * 0.13); }, { pal: PAL, alpha: a }); }
  function dragonHead(ctx, x, y, s, dir, o) { o = o || {}; PX.sprite(ctx, x + dir * s * 0.2, y - s * 0.1, s * 2.6, s * 2.2, c => { c.translate(-s * 0.2 * (dir < 0 ? -1 : 1), s * 0.1); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); dragonHeadVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono }); }
  Object.assign(KO, { crane, star, blade, dragonHead });
  const scraps = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-8, 8), y + rand(-10, 10), i % 3 ? '#f1ede4' : '#ff4d6d', rand(-pw, pw), rand(-pw, pw * 0.4), 22, 2, 0.06); };
  // one cut through the air from (x0, y) to (x1, y): a white line that opens into two edges; k 0 -> 1
  function cut(ctx, x0, x1, y, k) {
    if (k >= 1) return;
    const grow = Math.min(1, k / 0.2), gap = k < 0.25 ? 0 : (k - 0.25) * 9, a = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4, xe = x0 + (x1 - x0) * grow;
    ctx.save(); ctx.globalAlpha = a;
    art.line(ctx, '#ffffff', Math.round(x0), Math.round(y - gap), Math.round(xe), Math.round(y - gap), k < 0.25 ? 3 : 1);
    if (gap > 0) { art.line(ctx, '#ff4d6d', Math.round(x0), Math.round(y + gap), Math.round(xe), Math.round(y + gap), 1); ctx.globalAlpha = a * 0.25; ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.min(x0, xe), y - gap, Math.abs(xe - x0), gap * 2); }
    ctx.restore();
  }

  // ================= her projectiles: caught by the look of the shot, so the double's copies change too =================
  const isStar = s => s instanceof Proj && s.w === 10 && s.h === 10 && s.maxHits === 2 && s.pierce;
  const isCrane = s => s instanceof Proj && s.w === 12 && s.h === 8 && s.life <= 50 && !s.kiriDone && typeof s.think === 'function';
  function dress(z) {
    z.shots.forEach(s => {
      if (s.kiri) return;
      if (isStar(s)) { s.kiri = 1; s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1; ctx.save(); ctx.globalAlpha = 0.6; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x - d * 10, y, 12, d > 0 ? -0.9 : PI - 0.9, d > 0 ? 0.9 : PI + 0.9); ctx.stroke(); ctx.restore(); star(ctx, x, y, 13, q.t * 0.9 * d); }; }
      else if (isCrane(s)) { s.kiri = 1; s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1; crane(ctx, x, y, 28, d, { pose: [0, 1, 2, 1][(q.t >> 2) % 4], rot: SW.clamp(q.vy * 0.12, -0.4, 0.4) }); if (q.t % 3 === 0) art.rect(ctx, '#ffffff', Math.round(x - d * 14), Math.round(y + rand(-3, 3)), 3, 1); }; }
    });
  }
  // a watcher that dresses shots as they appear, for n frames, and turns the paper doubles into cut-outs
  function watch(p, z, n) {
    const sheet = p.sheet(), face = p.face;
    z.shots.forEach(s => {   // the double made by this cast (a Vis that lives 26 frames)
      if (s.kiriDbl || s.life !== 26 || !s.render || s.vx || s.t > 1) return;
      s.kiriDbl = 1;
      s.render = (ctx, x, y, t) => {
        const open = ease(t / 5), tear = t > 21 ? (t - 21) / 5 : 0;
        PX.sprite(ctx, x, y - 20, 60, 60, c => { c.scale(open, 1); art.draw(c, sheet, 'cast', t < 18 ? 0 : 1, 0, 20, face < 0, {}); }, { mono: '#f1ede4', alpha: 1 - tear });
        ctx.save(); ctx.globalAlpha = (1 - tear) * 0.9;   // ink creases across the cut-out
        art.line(ctx, '#1a0a12', x - Math.round(6 * open), y - 34, x + Math.round(5 * open), y - 6, 1); art.line(ctx, '#b01030', x - Math.round(6 * open), y - 18, x + Math.round(6 * open), y - 22, 1);
        ctx.restore();
      };
    });
    dress(z);
    z.shots.push(new Vis(p.x, p.y, n, null, (v, g, zz) => dress(zz || G.zone)));
  }

  // ================= U, I: Paper Star, Crane Flock =================
  ['paper_star', 'crane_flock'].forEach(id => {
    const f0 = CASTS[id];
    CASTS[id] = function (p, z) { const r = f0.apply(this, arguments); if (isK(G)) watch(p, z, 46); return r; };
  });

  // ================= S+U: Fold Step =================
  const _fs = CASTS.fold_step;
  CASTS.fold_step = function (p, z) {
    const x0 = p.x, r = _fs.apply(this, arguments);
    if (!isK(G)) return r;
    watch(p, z, 30);
    const x1 = p.x, y = p.y - 22, dir = p.face, sheet = p.sheet();
    const v = new Vis(x0, y, 16, (ctx, sx, sy, t) => {
      const k = t / 16, ex = sx + (x1 - x0);
      for (let i = 0; i < 3; i++) {   // she folds flat along the way: three paper slivers of her, thinner each time
        const u = (i + 0.5) / 3, a = 1 - ease(k * 1.6 - u * 0.3); if (a <= 0.02) continue;
        PX.sprite(ctx, sx + (x1 - x0) * u, sy, 60, 60, c => { c.scale(0.5 - i * 0.14, 1); art.draw(c, sheet, 'dash', 0, 0, 22, dir < 0, {}); }, { mono: '#f1ede4', alpha: a });
      }
      cut(ctx, sx - dir * 10, ex + dir * 14, sy, k);
    }, vv => { if (vv.t === 3) scraps((x0 + x1) / 2, y, 10, 2.6); });
    z.shots.push(v);
    return r;
  };

  // ================= S+I: Paper Gale =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.kiri;
  if (BU && BU.cast) {
    const _pg = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _pg.apply(this, arguments);
      if (!isK(G)) return r;
      const vis = z.shots.slice(n0).find(s => s.life === 28 && s.render && !s.vx); if (!vis) return r;   // (js/moves.js has its own Vis class)
      vis.render = (ctx, x, y, t) => {
        const R = 20 + Math.min(34, t * 4), last = t > 22, beat = (t % 6) < 2;
        ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = beat ? 2 : 1; ctx.globalAlpha = beat ? 0.9 : 0.4;   // the slash arcs of the ring
        for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.ellipse(x, y, R + 4, (R + 4) * 0.55, 0, t * 0.5 + i * PI, t * 0.5 + i * PI + 1.9); ctx.stroke(); }
        ctx.restore();
        for (let i = 0; i < 8; i++) {
          const a = t * 0.5 + i * 0.785, px = x + Math.cos(a) * R, py = y + Math.sin(a) * R * 0.55;
          blade(ctx, px, py, last ? 30 : 22, a + PI / 2 + 0.35, 1, last ? 4 : 3);
        }
        if (last) { ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#ff4d6d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, R + 12, (R + 12) * 0.55, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); }
      };
      return r;
    };
  }

  // ================= W+O: Crane Ward =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.kiri;
  if (SIG && SIG.cast) {
    const _cw = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _cw.apply(this, arguments);
      if (!isK(G)) return r;
      const orb = z.shots.slice(n0).find(s => s.life === 66 && s.paint && s.tick); let left = 3; const seen = new Set();
      if (orb) orb.paint = (ctx, sx, sy, s) => { for (let i = 0; i < left; i++) { const a = s.t * 0.16 + i * 6.283 / 3, sn = Math.sin(a); crane(ctx, sx + Math.cos(a) * 28, sy - 4 + sn * 16, 26, -sn >= 0 ? 1 : -1, { pose: [0, 1, 2, 1][((s.t >> 2) + i) % 4] }); } };
      z.shots.push(new Vis(p.x, p.y, 70, null, () => {
        const zs = G.zone && G.zone.shots; if (!zs) return;
        zs.forEach(s => {   // each crane that leaves the ring stoops with its wings folded back
          if (seen.has(s) || s.style !== 'paper' || !s.paint || !s.home || s.w !== 10) return;
          seen.add(s); left = Math.max(0, left - 1);
          s.paint = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1; crane(ctx, x, y, 30, d, { dive: true, rot: SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)), -1.2, 1.2) }); art.rect(ctx, '#ffffff', Math.round(x - q.vx * 2), Math.round(y - q.vy * 2), 2, 1); };
        });
      }));
      return r;
    };
  }

  // ================= S+O and O: Quick Fold and Thousand Folds =================
  function aura(ctx, p, sx, sy, front) {
    if (p.awakeT > 0 && !front) {   // a fan of paper blades behind her, like wings, turning slowly
      const fade = Math.min(1, p.awakeT / 30), cy = sy - 26, open = Math.min(1, (p.awakeMax ? (p.awakeMax - p.awakeT) : 30) / 14);
      for (let i = 0; i < 11; i++) {
        const a = -PI / 2 + (i - 5) * 0.27 * open + Math.sin(p.t * 0.04) * 0.04, L = 44 - Math.abs(i - 5) * 3;
        blade(ctx, sx + Math.cos(a) * L * 0.55, cy + Math.sin(a) * L * 0.55, L, a, fade * 0.95, 4);
      }
    }
    if (p.modeT > 0) {   // paper scraps whip round her, two small cranes circle
      const fade = Math.min(1, p.modeT / 30);
      for (let i = 0; i < 2; i++) { const a = p.t * 0.22 + i * PI, sn = Math.sin(a); if ((sn >= 0) !== front) continue; crane(ctx, sx + Math.cos(a) * 20, sy - 22 + sn * 6, 14, -sn >= 0 ? 1 : -1, { pose: [0, 1, 2, 1][(p.t >> 1) % 4], a: fade }); }
      if (front) { ctx.save(); ctx.globalAlpha = fade; for (let i = 0; i < 6; i++) { const u = ((p.t * 3 + i * 31) % 60) / 60, a = u * PI * 2 + i; art.rect(ctx, i % 2 ? '#f1ede4' : '#ff4d6d', Math.round(sx + Math.cos(a) * (14 + i * 2)), Math.round(sy - 6 - u * 34), 2, 1); } ctx.restore(); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isK(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isK(g || this.G) && z && z.shots && !this.dead && this.awakeT > a0 + 60) {   // Thousand Folds: a storm of blades bursts outward
      const x = this.x, y = this.y - 24;
      z.shots.push(new Vis(x, y, 16, (ctx, sx, sy, t) => { const k = t / 16; for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2 + 0.2; blade(ctx, sx + Math.cos(a) * (10 + k * 90), sy + Math.sin(a) * (10 + k * 90) * 0.7, 26, a, 1 - ease((k - 0.5) / 0.5), 3); } }));
      scraps(x, y, 16, 3.5);
    }
    return r;
  };

  // ================= W+I: Paper Dragon =================
  // the head's place on screen at ultimate frame st (the same sweep the old dotted line made)
  const headAt = (st, dir) => [((st - 8) / 54) * (W + 60) * dir + (dir > 0 ? -30 : W + 30), 104 + Math.sin(st * 0.25) * 40];   // below the HUD
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isK(g)) return r;
    if (p.st === 8) {
      const dir = p.face, N2 = 20;
      const d = new Vis(p.x, p.y, 200, (ctx) => {
        const st = p.st; if (p.state !== 'ult' || st > 92) return;
        const a = st > 78 ? 1 - (st - 78) / 14 : 1;
        PX.sprite(ctx, W / 2, 110, W + 60, 240, c => {
          c.translate(-W / 2, -110);
          for (let i = N2; i >= 1; i--) {   // tail first
            const q0 = headAt(st - i * 1.5, dir), q1 = headAt(st - i * 1.5 + 0.6, dir), rr = Math.max(4, 15 - i * 0.5);
            c.save(); c.translate(q0[0], q0[1]); c.rotate(Math.atan2(q1[1] - q0[1], q1[0] - q0[0])); plateVec(c, rr, i); c.restore();
          }
          const h0 = headAt(st, dir), h1 = headAt(st + 0.6, dir);
          c.save(); c.translate(h0[0] - dir * 14, h0[1]); c.scale(dir, 1); c.rotate(Math.atan2(h1[1] - h0[1], Math.abs(h1[0] - h0[0])) * 0.8); dragonHeadVec(c, 62, { jaw: 0.5 + 0.5 * Math.sin(st * 0.5), t: st }); c.restore();
        }, { pal: PAL, alpha: a });
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      d.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };   // in screen space, across the arena
      d._ugS = 1; z.shots.push(d);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    if (p.st >= 10 && p.st < 62 && p.st % 4 === 0) { const h = headAt(p.st, p.face); scraps(G.cam.x + h[0] - p.face * 40, G.cam.y + h[1], 2, 1.2); }
    return r;
  };
  // the finishing blow: the dragon's head beside the target, roaring; then it bites straight through on an impact frame
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('kiri') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 20;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 8), sh = st > FIN - 12 ? Math.sin(st * 2.3) * 1.5 : 0;
        dragonHead(ctx, sx - dir * 150 + sh, cy - 2, 120, dir, { jaw: st > BU2 + 4 ? 0.75 + 0.25 * Math.sin(st * 0.6) : 0.2, t: st, a: k });
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 21);
        dragonHead(ctx, sx - dir * 150 + dir * ease(k * 2.2) * 150, cy - 2, 120, dir, { jaw: k < 0.15 ? 1 : 0.05, t: st, a: 1 - ease((k - 0.5) / 0.5), mono: ik < 0.5 ? '#ffffff' : undefined });
        cut(ctx, sx - dir * 130, sx + dir * 130, cy, k);
        if (st === FIN) scraps(T.x, T.y - 20, 26, 4);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
