'use strict';
// Shattered Worlds — Brann's frost bear (2026-11-20, the hero-look rework: cool, not cute). His story: "the last bear of
// the north", "bears that walked like men, and men who fought like bears"; his look: frost on the shoulders, steaming
// breath, a dark red sash. Every move is the bear's spirit: a great bear of winter, drawn as crisp pixel art by
// js/pixel-kit.js (a hue-shifted ice palette, a selective outline): a massive shoulder hump crowned with ice shards, a
// small low head with slanted brows and red slit eyes, long white claws. It walks on all fours, rears up on its hind legs
// and slams down. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/dune-meridian.js.
//   U      Maul: the bear's foreleg rakes out twice, four gouges each, frost flying
//   S+U    Roar: the bear's head roars over him, a blast of frozen breath; shots it eats burst into snow
//   I      Landslide: the bear charges on all fours round him, then rears and slams down where he lands (impact frame)
//   S+I    Bear Hug: the bear rears behind him and its forelegs close round the foe on every squeeze; the throw is an
//          impact frame (a miss is one huge rake)
//   W+O    Feral Pounce: the bear leaps with him and rakes on every maul; the last one is an impact frame
//   J      his combo: the bear's paw rakes out on every hit
//   S+O    Blood Up: steam with a red breath rises off him        O  Great Bear: a short snarl over his shoulder, then
//          frost on his shoulders and a little snow (small on purpose: the view stays clear)
//   W+I    The Last Winter: a great bear rears behind him and brings both paws down with his four blows, frost cracking
//          across the floor; in the cinematic finish (js/ult-cinema.js) it rears over the target and the paws come down on
//          an impact frame
// SW.brannBear.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.maul || !CASTS.roar || !CASTS.landslide) return;
  const BB = SW.brannBear = { on: true };
  const isB = g => !!(BB.on && g && g.state && g.state.hero === 'brann');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // winter: blue-black shadow up to snow white; blood red for the eyes, the mouth and his fury
  const PAL = ['#070b14', '#121d30', '#223852', '#3a5c80', '#6a92b8', '#a6cbe6', '#e2f3ff', '#ffffff', '#4a0a10', '#a3121c', '#ff3b30'];
  const C = { d0: PAL[0], d1: PAL[1], m: PAL[2], l: PAL[3], v: PAL[4], hi: PAL[5], sn: PAL[6], w: PAL[7], mouth: PAL[8], red: PAL[9], eye: PAL[10] };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, rot, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), rot || 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const limb = (c, pts, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); };

  // ---------- the head: (0, 0) where the neck meets the skull, facing +x; roar 0-1 drops the jaw ----------
  function headVec(c, s, o) {
    const S = (x, y) => [x * s, y * s], Q = a => a.map(q => S(q[0], q[1])), roar = clamp01(o.roar || 0);
    poly(c, Q([[0.0, -0.1], [0.02, -0.17], [0.075, -0.115]]), C.m);                                   // a short ear, laid back
    poly(c, Q([[-0.05, -0.07], [0.04, -0.12], [0.15, -0.1], [0.25, -0.055], [0.285, -0.025], [0.26, 0.015], [0.13, 0.035], [0.01, 0.06], [-0.05, 0.03]]), C.l);   // skull and long muzzle
    poly(c, Q([[0.06, -0.1], [0.15, -0.085], [0.25, -0.05], [0.16, -0.065]]), C.hi);                  // light down the muzzle
    poly(c, Q([[0.06, -0.09], [0.18, -0.06], [0.17, -0.045], [0.07, -0.07]]), C.d1);                   // the heavy brow, slanted down at the eye
    poly(c, Q([[0.1, -0.066], [0.175, -0.05], [0.11, -0.03]]), C.eye);                             // red slit eye
    poly(c, Q([[0.25, -0.045], [0.3, -0.025], [0.28, 0.005], [0.255, 0.0]]), C.d0);                    // nose
    c.save(); c.translate(0.03 * s, 0.03 * s); c.rotate(roar * 0.8);
    if (roar > 0.1) { for (let i = 0; i < 2; i++) poly(c, Q([[0.15 + i * 0.05, -0.002], [0.17 + i * 0.05, -0.002], [0.16 + i * 0.05, -0.05]]), C.w); }   // lower fangs
    poly(c, Q([[0, 0], [0.22, -0.005], [0.2, 0.04], [0.02, 0.06]]), C.m);                              // lower jaw
    poly(c, Q([[0.02, 0.045], [0.18, 0.035], [0.1, 0.06]]), C.d1);
    c.restore();
    if (roar > 0.1) {   // the open mouth and the upper fangs
      poly(c, Q([[0.06, 0.03], [0.26, 0.012], [0.2, 0.035 + roar * 0.16]]), C.mouth);
      for (let i = 0; i < 3; i++) poly(c, Q([[0.13 + i * 0.045, 0.02], [0.155 + i * 0.045, 0.018], [0.142 + i * 0.045, 0.07]]), C.w);
    }
  }
  // ---------- a foreleg from the shoulder: (0, 0) the shoulder, pointing down (+y) at rest; a, k: shoulder and elbow bends ----------
  function foreleg(c, s, a, k, col, w, claws) {
    const L = s * 0.2, ex = Math.sin(-a) * L, ey = Math.cos(a) * L, px = ex + Math.sin(-a - k) * L, py = ey + Math.cos(a + k) * L;
    ell(c, 0, 0, w * 0.9, w * 1.3, -a, col);                       // the heavy shoulder
    limb(c, [[0, 0], [ex, ey], [px, py]], w, col);
    const pa = a + k;   // the paw, broad, with four long claws curling forward
    c.save(); c.translate(px, py); c.rotate(-pa);
    ell(c, s * 0.03, s * 0.01, s * 0.075, s * 0.05, 0, col);
    if (claws !== false) for (let i = 0; i < 4; i++) { const cx = s * (0.07 + i * 0.006), cy = -s * 0.04 + i * s * 0.024; poly(c, [[cx, cy - s * 0.012], [cx + s * 0.15, cy + s * 0.045], [cx + s * 0.01, cy + s * 0.024]], i % 2 ? C.sn : C.w); }
    c.restore();
    return [px, py];
  }
  // ---------- the whole bear, side view: (0, 0) the ground under its middle, facing +x, s its length nose to rump ----------
  // o = { run 0-1 (stride phase), r 0-1 (rearing up on its hind legs), raise 0-1 (forelegs up, when rearing), roar 0-1, reach 0-1 (forelegs forward, a hug), t }
  function bearVec(c, s, o) {
    const S = (x, y) => [x * s, y * s], Q = a => a.map(q => S(q[0], q[1])), t = o.t || 0;
    const r = clamp01(o.r || 0), run = o.run !== undefined, ph = (o.run || 0) * PI * 2;
    const bob = run && r < 0.2 ? -Math.abs(Math.sin(ph)) * s * 0.03 : 0;
    c.translate(0, bob);
    const H = S(-0.28, -0.42);
    const hind = far => {   // hip, knee forward, heel back, the paw flat
      const a = run ? 0.45 * Math.sin(ph + (far ? PI : 0)) : r * 0.35, col = far ? C.d1 : C.m, w = s * (far ? 0.12 : 0.14);
      const hx = H[0] + (far ? s * 0.03 : 0), hy = H[1], kx = hx + Math.sin(a) * s * 0.18 + s * 0.04, ky = hy + Math.cos(a) * s * 0.18, fx2 = kx - s * 0.05, fy = Math.min(-bob, ky + s * 0.2);
      ell(c, hx, hy, w * 1.1, w * 1.35, 0, col);
      limb(c, [[hx, hy], [kx, ky], [fx2, fy]], w, col);
      ell(c, fx2 + s * 0.04, fy - s * 0.015, s * 0.07, s * 0.03, 0, col);
    };
    hind(true);
    c.save(); c.translate(H[0], H[1]); c.rotate(-r * 1.2); c.translate(-H[0], -H[1]);   // the front of the bear rears up round its hips
    const fore = far => {
      const sh = S(far ? 0.2 : 0.16, -0.52), col = far ? C.d1 : C.l, w = s * (far ? 0.12 : 0.14);
      let a, k;
      if (r > 0.15) { a = -(o.raise || 0) * 0.75 - (o.reach || 0) * 0.5 + (far ? 0.2 : 0); k = -(o.raise || 0) * 0.6 + (o.reach || 0) * 0.15; }
      else if (run) { a = 0.55 * Math.sin(ph + (far ? 0 : PI) + 0.6); k = -0.5 * Math.max(0, Math.cos(ph + (far ? 0 : PI))); }
      else { a = 0; k = 0; }
      const long = 1 + 0.6 * (o.reach || 0);   // a hug: the forelegs stretch out round the foe
      c.save(); c.translate(sh[0], sh[1]); foreleg(c, s * long, a, k, col, w); c.restore();
    };
    fore(true);
    // the body: a massive shoulder hump, a lower back, a heavy belly with a ragged fringe of fur
    poly(c, Q([[-0.48, -0.36], [-0.47, -0.52], [-0.38, -0.62], [-0.12, -0.66], [0.06, -0.8], [0.22, -0.76], [0.33, -0.62], [0.37, -0.46], [0.28, -0.3], [0.0, -0.28], [-0.3, -0.28]]), C.m);
    poly(c, Q([[-0.44, -0.56], [-0.37, -0.62], [-0.12, -0.66], [0.06, -0.8], [0.22, -0.76], [0.3, -0.66], [0.12, -0.7], [-0.12, -0.6], [-0.36, -0.55]]), C.l);
    poly(c, Q([[-0.06, -0.66], [0.06, -0.78], [0.2, -0.74], [0.08, -0.72]]), C.v);
    poly(c, Q([[-0.44, -0.55], [-0.37, -0.615], [-0.12, -0.655], [0.0, -0.72], [-0.1, -0.64], [-0.36, -0.595]]), C.hi);
    poly(c, Q([[-0.3, -0.33], [0.22, -0.34], [0.3, -0.42], [0.26, -0.31], [0.0, -0.29]]), C.d1);
    for (let i = 0; i < 6; i++) { const x = -0.36 + i * 0.11; poly(c, Q([[x, -0.31], [x + 0.06, -0.31], [x + 0.02, -0.22 - (i % 2) * 0.03]]), C.d1); }   // the ragged fringe under the belly
    // ice shards grown through the fur of the hump, catching the light
    for (let i = 0; i < 5; i++) {
      const u = i / 4, bx = -0.1 + u * 0.3, by = -0.66 - Math.sin(u * PI) * 0.12, len = 0.09 + Math.sin(u * PI) * 0.07 + 0.012 * Math.sin(t * 0.2 + i);
      poly(c, Q([[bx - 0.035, by + 0.02], [bx - 0.07, by - len], [bx + 0.03, by + 0.01]]), i % 2 ? C.hi : C.sn);
      poly(c, Q([[bx - 0.03, by + 0.01], [bx - 0.06, by - len * 0.8], [bx - 0.04, by]]), C.w);
    }
    // the neck and the head, held low and level whatever the body does
    poly(c, Q([[0.22, -0.76], [0.44, -0.62], [0.44, -0.45], [0.3, -0.4]]), C.m);
    c.save(); c.translate(0.44 * s, -0.55 * s); c.rotate(r * 1.05 + (o.headTilt || 0)); headVec(c, s, o); c.restore();
    fore(false);
    c.restore();
    hind(false);
  }
  // the bear as a crisp sprite: (x, y) the ground under it
  function bear(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x, y - s * 0.85, s * 2.3, s * 2.1, c => { c.translate(0, s * 0.85); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); bearVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono });
  }
  BB.bear = bear;
  // the head alone, big (the roar, the awakening): (x, y) the back of the skull, L the head's length in pixels
  function head(ctx, x, y, L, dir, o) {
    o = o || {};
    const s = L / 0.3;
    PX.sprite(ctx, x + dir * s * 0.1, y + s * 0.02, s * 0.66, s * 0.56, c => { c.translate(-dir * s * 0.1, 0); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot);
      poly(c, [[-0.12, -0.16], [0.06, -0.12], [0.04, 0.1], [-0.05, 0.15], [-0.09, 0.08], [-0.15, 0.11], [-0.13, 0.03], [-0.2, -0.01], [-0.14, -0.06], [-0.19, -0.12]].map(q => [q[0] * s, q[1] * s]), C.m);   // the neck's ragged ruff
      for (let i = 0; i < 3; i++) poly(c, [[-s * (0.12 - i * 0.05), -s * 0.12], [-s * (0.16 - i * 0.05), -s * (0.24 + (i % 2) * 0.04)], [-s * (0.07 - i * 0.05), -s * 0.12]], i % 2 ? C.hi : C.sn);   // ice on the ruff
      headVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono });
  }
  BB.head = head;
  // a foreleg alone, sweeping (Maul, the combo, a missed hug): (x, y) the shoulder; ang the arm's direction; s the bear's size
  function paw(ctx, x, y, s, ang, o) {
    o = o || {};
    PX.sprite(ctx, x, y, s * 1.2, s * 1.2, c => { c.rotate(ang - PI / 2); foreleg(c, s * 1.35, 0, -0.25, C.v, s * 0.17); c.strokeStyle = C.hi; c.lineWidth = Math.max(1, s * 0.05); c.beginPath(); c.moveTo(-s * 0.05, s * 0.05); c.lineTo(-s * 0.05, s * 0.4); c.stroke(); }, { pal: PAL, alpha: o.a, mono: o.mono });   // frost-lit, so it reads on a dark arena
  }
  const gouge = (ctx, x, y, ang, size, k) => PX.claws(ctx, x, y, ang, size, k, [C.d0, C.m, C.hi], 4);
  const frost = (x, y, n, sp) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 ? '#e2f3ff' : '#ffffff', rand(-sp, sp), -rand(0.5, sp), 18 + rand(0, 10) | 0, 2, 0.12); };
  function breath(ctx, x, y, dir, k, n, red) {   // a cloud of frozen breath: pixel puffs streaming forward
    if (k <= 0 || k >= 1) return;
    ctx.save();
    for (let i = 0; i < (n || 14); i++) {
      const u = (i * 0.137 + k * 1.3) % 1, sp = (Math.sin(i * 12.9) * 0.5 + 0.5), px = x + dir * u * (30 + sp * 40), py = y + (Math.sin(i * 7.3) * 0.5) * u * 26 - u * 6, sz = 2 + Math.floor(u * 4);
      ctx.globalAlpha = 0.75 * (1 - u) * (1 - Math.max(0, k - 0.7) / 0.3);
      art.rect(ctx, red && i % 3 === 0 ? '#ff6a5a' : i % 2 ? '#e2f3ff' : '#ffffff', Math.round(px - sz / 2), Math.round(py - sz / 2), sz, sz);
    }
    ctx.restore();
  }
  // frost cracking out across the floor from x, both ways; k 0 -> 1
  function cracks(ctx, sx, sy, k, len, seed) {
    if (k >= 1) return;
    const grow = ease(k / 0.3), fade = k < 0.5 ? 1 : 1 - (k - 0.5) / 0.5, r = i => { const v = Math.sin((seed + i) * 91.7) * 43758.5; return v - Math.floor(v); };
    ctx.save(); ctx.globalAlpha = fade;
    for (const d of [-1, 1]) for (let b = 0; b < 3; b++) {
      let x = sx, y = sy - 1; const L = len * (0.5 + r(b * 7 + (d > 0 ? 3 : 0)) * 0.5) * grow;
      for (let n = 0; n * 8 < L; n++) {
        const nx = x + d * 8, ny = sy - 1 - Math.round(r(n * 3 + b * 11 + (d > 0 ? 5 : 0)) * (2 + b)) + (b === 2 ? -1 : 0);
        art.line(ctx, n % 3 ? '#a6cbe6' : '#ffffff', Math.round(x), Math.round(y), Math.round(nx), Math.round(ny), 1);
        if (r(n + b * 5) > 0.7) art.line(ctx, '#e2f3ff', Math.round(nx), Math.round(ny), Math.round(nx + d * 3), Math.round(ny - 4), 1);   // a shard standing up
        x = nx; y = ny;
      }
    }
    ctx.restore();
  }
  // a Vis that stays on Brann
  const onHim = (p, life, render, tick) => new Vis(p.x, p.y, life, render, v => { v.x = p.x; v.y = p.y; if (p.dead) v.gone = true; if (tick) tick(v); });

  // ================= U: Maul: the bear's foreleg rakes out twice =================
  const _maul = CASTS.maul;
  CASTS.maul = function (p, z) {
    const r = _maul.apply(this, arguments);
    if (!isB(G)) return r;
    const dir = p.face;
    z.shots.push(onHim(p, 24, (ctx, sx, sy, t) => {
      [1, 9].forEach((h, i) => {
        const k = (t - h + 2) / 12; if (k < 0 || k >= 1) return;
        const sw = ease(k / 0.35), a = dir > 0 ? -1.3 + sw * 1.9 : PI + 1.3 - sw * 1.9;   // from up and back, raked down and through
        if (k < 0.75) paw(ctx, sx + dir * 4, sy - 34 + i * 4, 40 + i * 8, a, { a: 1 - ease((k - 0.5) / 0.25) });
        if (k > 0.15) gouge(ctx, sx + dir * 30, sy - 24 + i * 6, dir > 0 ? 0.7 : PI - 0.7, 22 + i * 6, (k - 0.15) / 0.85);
        if (t === h + 1) frost(p.x + dir * 30, p.y - 22, 8, 2.4);
      });
    }));
    return r;
  };

  // ================= S+U: Roar =================
  const _roar = CASTS.roar;
  CASTS.roar = function (p, z) {
    const near = isB(G) ? z.shots.filter(s => s.team === 'enemy' && !s.gone && Math.hypot(s.x - p.x, s.y - p.y + 16) < 110) : [];
    const r = _roar.apply(this, arguments);
    if (!isB(G)) return r;
    const dir = p.face;
    near.forEach(s => { if (s.gone) { for (let i = 0; i < 10; i++) part(s.x + rand(-4, 4), s.y + rand(-4, 4), i % 2 ? '#ffffff' : '#a6cbe6', rand(-2, 2), rand(-1.5, 1), 26, 2, 0.08); } });   // the shots it ate, as snow
    z.shots.push(onHim(p, 26, (ctx, sx, sy, t) => {
      const k = t / 26, up = ease(t / 5), a = 1 - ease((k - 0.7) / 0.3);
      breath(ctx, sx + dir * 22, sy - 44 - up * 6, dir, t / 22, 20);
      breath(ctx, sx + dir * 22, sy - 44 - up * 6, -dir, t / 22, 10);
      head(ctx, sx - dir * 14, sy - 50 - up * 10, 44, dir, { roar: t < 18 ? 1 : 1 - (t - 18) / 8, rot: -0.22, a });
    }));
    frost(p.x, p.y - 30, 14, 3);
    return r;
  };

  // ================= I: Landslide: the bear charges round him, then rears and slams =================
  const _ls = CASTS.landslide;
  CASTS.landslide = function (p, z) {
    const n0 = z.shots.length, r = _ls.apply(this, arguments);
    if (!isB(G)) return r;
    const dir = p.face, drv = z.shots.slice(n0).find(s => s.p === p && s.step);
    let end = -1, ex = 0, ey = 0;
    z.shots.push(onHim(p, 60, (ctx, sx, sy, t) => {
      if (end < 0) {   // charging on all fours, rearing over the last frames of the run
        const rear = ease((t - 10) / 5);
        bear(ctx, sx - dir * 6, sy, 52, dir, { run: (t % 8) / 8, r: rear, raise: rear, roar: 0.4 + rear * 0.6, t });
        if (t < 12) PX.lines(ctx, sx - dir * 30, sy - 22, dir > 0 ? PI : 0, 40, 6, t, '#a6cbe6', 40);
      } else {   // down: slammed where he landed, an impact frame, frost cracking out
        const k = (t - end) / 22, ik = (t - end) / 5, x = Math.round(ex - G.cam.x), y = Math.round(ey - G.cam.y);
        if (ik < 1) PX.impact(ctx, x + dir * 18, y - 10, ik, 41);
        cracks(ctx, x + dir * 18, y, k, 70, 3);
        bear(ctx, x - dir * 6, y, 52, dir, { r: 0.12, roar: 1 - k, headTilt: 0.15, t, a: 1 - ease((k - 0.6) / 0.4), mono: ik < 0.5 ? '#ffffff' : undefined });
      }
    }, v => {
      if (end < 0) {
        if (v.t % 2 === 0) { part(p.x - dir * 14, p.y - 2, '#e2f3ff', -dir * rand(1, 3), -rand(1, 3), 18, 2, 0.15); part(p.x - dir * 10, p.y - 4, '#5a3a2a', -dir * rand(1, 3), -rand(1, 2.5), 16, 2, 0.15); }   // snow and earth thrown up
        if (!drv || drv.gone || v.t > 20) { end = v.t; ex = p.x; ey = p.y; v.life = v.t + 22; frost(p.x + dir * 18, p.y - 8, 16, 3); }
      }
      return;
    }));
    return r;
  };

  // ================= S+I: Bear Hug =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.brann;
  if (BU && BU.cast) {
    const _bh = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _bh.apply(this, arguments);
      if (!isB(G)) return r;
      const dir = p.face, drv = z.shots.slice(n0).find(s => s.p === p && s.step);
      if (!drv) {   // nothing to hold: one huge rake
        z.shots.push(onHim(p, 16, (ctx, sx, sy, t) => { const k = t / 16, sw = ease(k / 0.3); if (k < 0.7) paw(ctx, sx + dir * 2, sy - 38, 58, dir > 0 ? -1.2 + sw * 1.8 : PI + 1.2 - sw * 1.8, { a: 1 - ease((k - 0.45) / 0.25) }); gouge(ctx, sx + dir * 34, sy - 26, dir > 0 ? 0.6 : PI - 0.6, 34, k); }));
        return r;
      }
      let end = -1;
      z.shots.push(onHim(p, 60, (ctx, sx, sy, t) => {
        if (end < 0) {   // reared behind him, the forelegs closing round the foe on every squeeze
          const sq = (t % 8) / 8, pulse = t > 2 && t < 28 ? Math.max(0, 1 - Math.abs(sq - 0.75) * 5) : 0, up = ease(t / 6);
          bear(ctx, sx - dir * 12, sy, 56, dir, { r: 0.85 * up, reach: 0.7 + pulse * 0.3, raise: 0.25 - pulse * 0.25, roar: 0.3 + pulse * 0.7, t });
          if (pulse > 0.8) frost(p.x + dir * 18, p.y - 20, 3, 1.5);
        } else {   // the throw
          const k = (t - end) / 18, ik = (t - end) / 5;
          if (ik < 1) PX.impact(ctx, sx + dir * 30, sy - 24, ik, 57);
          bear(ctx, sx - dir * 12, sy, 56, dir, { r: 0.7 - k * 0.3, raise: 1, roar: 1, t, a: 1 - ease((k - 0.55) / 0.45), mono: ik < 0.5 ? '#ffffff' : undefined });
          if (k > 0.1) gouge(ctx, sx + dir * 34, sy - 30, dir > 0 ? -0.5 : PI + 0.5, 30, (k - 0.1) / 0.9);
        }
      }, v => { if (end < 0 && (drv.gone || v.t > 32)) { end = v.t; v.life = v.t + 18; frost(p.x + dir * 24, p.y - 24, 18, 3.4); } }));
      return r;
    };
  }

  // ================= W+O: Feral Pounce: the bear leaps with him and rakes on every maul =================
  let pounce = null;   // { p, n, z }: while it lasts, its maul slashes (colour #ff5a5a) become the bear's rakes
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col) {
    if (pounce && col === '#ff5a5a' && pounce.p && Math.abs(x - pounce.p.x) < 40) {
      const q = pounce, n = ++q.n, d = dir || 1;
      q.z.shots.push(new Vis(x, y, 14, (ctx, sx, sy, t) => {
        if (n >= 2 && t < 5) PX.impact(ctx, sx + d * 6, sy, t / 5, 63);
        paw(ctx, sx - d * 10, sy - 18, 46, d > 0 ? -1.1 + ease(t / 4) * 1.8 : PI + 1.1 - ease(t / 4) * 1.8, { a: 1 - ease((t - 6) / 6), mono: n >= 2 && t < 3 ? '#ffffff' : undefined });
        gouge(ctx, sx + d * 8, sy + 2, n % 2 ? (d > 0 ? 0.8 : PI - 0.8) : (d > 0 ? -0.6 : PI + 0.6), 24 + n * 4, t / 14);
      }));
      frost(x + d * 6, y, 8, 2.6);
    }
    return _slash.apply(this, arguments);
  };
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.brann;
  if (SIG && SIG.cast) {
    const _fp = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _fp.apply(this, arguments);
      if (!isB(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step), q = pounce = { p, n: 0, z };
      z.shots.push(onHim(p, 44, (ctx, sx, sy, t) => {
        const air = !p.onGround, k = t / 44;
        bear(ctx, sx - p.face * 10, sy + (air ? 6 : 0), 46, p.face, air ? { run: 0.15, r: 0.25, raise: 0.6, roar: 1, rot: SW.clamp(p.vy * 0.06, -0.35, 0.35), t } : { r: 0.5, raise: 0.9, roar: 0.8, t, a: 1 - ease((k - 0.7) / 0.3) });
      }, v => { if ((drv && drv.gone && v.t > 4) || v.t >= 43) { v.gone = true; if (pounce === q) pounce = null; } }));
      return r;
    };
  }

  // ================= his combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // the bear's paw rakes out on every hit
      const k = p.st - a.hitAt;
      if (k >= -1 && k < 8) {
        const big = Math.min(1, (a.dmg || 6) / 14), reach = a.box ? a.box[0] + a.box[2] * 0.5 : 20, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22);
        const sw = ease((k + 2) / 3), up = a.ky < -2 || /launch|up/.test(a.anim || '');
        const ang = up ? (d > 0 ? 0.8 - sw * 1.7 : PI - 0.8 + sw * 1.7) : (d > 0 ? -0.9 + sw * 1.6 : PI + 0.9 - sw * 1.6);   // level with the target on the hit frame
        if (k < 5) paw(ctx, sx + d * 6, hy - 6, 32 + big * 14, ang, { a: k < 3 ? 1 : 1 - (k - 3) / 2 });
        if (k >= 0) gouge(ctx, sx + d * (8 + reach), hy, up ? (d > 0 ? -0.9 : PI + 0.9) : (d > 0 ? 0.7 : PI - 0.7), 18 + big * 12, k / 8);
      }
    }
    if (p.modeT > 0) {   // Blood Up: steam off his shoulders, his breath gone red
      const fade = Math.min(1, p.modeT / 30);
      ctx.save();
      for (let i = 0; i < 5; i++) { const u = ((p.t * 0.02 + i * 0.2) % 1), x = sx + (i - 2) * 4 + Math.sin(p.t * 0.1 + i) * 2, y = sy - 30 - u * 18; ctx.globalAlpha = 0.6 * (1 - u) * fade; art.rect(ctx, i % 2 ? '#e2f3ff' : '#ffffff', Math.round(x), Math.round(y), 2, 2); }
      ctx.restore();
      if (p.t % 50 < 14) breath(ctx, sx + d * 6, sy - 28, d, (p.t % 50) / 14, 6, true);
    }
    if (p.awakeT > 0) {   // Great Bear: frost on his shoulders, a little snow
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = fade;
      for (const o of [-6, 5]) { art.rect(ctx, '#e2f3ff', sx + o, sy - 30, 3, 1); art.rect(ctx, '#ffffff', sx + o + 1, sy - 31, 1, 1); }
      for (let i = 0; i < 4; i++) { const u = ((p.t * 0.012 + i * 0.25) % 1), x = sx + Math.sin(i * 2.3 + p.t * 0.03) * 16; ctx.globalAlpha = 0.8 * fade * Math.min(1, (1 - u) * 3); art.rect(ctx, '#ffffff', Math.round(x), Math.round(sy - 46 + u * 46), 1, 1); }
      ctx.restore();
      if (p.t % 70 < 12 && !(p.modeT > 0)) breath(ctx, sx + d * 6, sy - 28, d, (p.t % 70) / 12, 6);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isB(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isB(g || this.G) && z && z.shots && !this.dead && this.awakeT > a0 + 60) {   // Great Bear: a short snarl over his shoulder
      const p = this, d = p.face;
      z.shots.push(onHim(p, 18, (ctx, sx, sy, t) => head(ctx, sx - d * 8, sy - 36 - ease(t / 5) * 4, 20, d, { roar: t < 12 ? 1 : 1 - (t - 12) / 6, rot: -0.2, a: 1 - ease((t - 11) / 7) })));
      frost(p.x, p.y - 28, 10, 2);
    }
    return r;
  };

  // ================= W+I: The Last Winter =================
  const SM = [14, 30, 46, 62];
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isB(g)) return r;
    if (p.st === 6) {
      const dir = p.face;
      const v = onHim(p, 72, (ctx, sx, sy) => {
        const st = p.st; if (p.state !== 'ult' || st > 71) return;
        let rear = 0.3, slam = -1;
        for (const m of SM) { if (st >= m - 10 && st < m) rear = ease((st - (m - 10)) / 8); if (st >= m && st < m + 6) { rear = 0.1; slam = st - m; } }
        const fade = Math.min(ease((st - 4) / 6), 1 - ease((st - 66) / 6));
        if (st >= 62 && st < 67) PX.impact(ctx, sx - dir * 10, sy - 30, (st - 62) / 5, 71);
        bear(ctx, sx - dir * 34, sy, 84, dir, { r: rear, raise: rear, roar: slam >= 0 ? 1 : 0.3 + rear * 0.7, headTilt: slam >= 0 ? 0.2 : 0, t: st, a: fade, mono: st >= 62 && st < 65 ? '#ffffff' : undefined });
        if (st >= 6 && st < 22) breath(ctx, sx - dir * 34 + dir * 56, sy - 104, dir, (st - 6) / 16, 26);   // the first breath clouds the screen
      });
      v._ugS = 1; z.shots.push(v);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('brann') >= 0) finale(p, z, T);
    }
    if (SM.indexOf(p.st) >= 0) {   // each blow: frost cracks out across the whole floor
      const k0 = p.st, x0 = p.x, y0 = p.y, last = k0 === 62;
      const c = new Vis(x0, y0, 30, (ctx, sx, sy, t) => cracks(ctx, sx, sy, t / 30, last ? 260 : 150 + SM.indexOf(k0) * 30, k0));
      c._ugS = 1; z.shots.push(c);
      frost(x0 - p.face * 10, y0 - 6, last ? 24 : 12, 3.5);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js pushes the camera in on the target from st 72, the blow at st 100): the bear
  // rears over the target, roaring; on the blow both paws come down on it
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 16) return;
      const bx = sx - dir * 30;   // leaning over the target, low enough to stay inside the pushed-in view
      if (st < FIN) {
        const k = ease((st - 74) / 10), down = ease((st - (FIN - 4)) / 4);
        bear(ctx, bx, sy, 52, dir, { r: 0.62 - down * 0.5, raise: 1 - down * 0.8, roar: 1, t: st, a: k });
        if (st > 80) breath(ctx, bx + dir * 46, sy - 62, dir, ((st - 80) % 14) / 14, 10);
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 18, ik, 99);
        bear(ctx, bx, sy, 52, dir, { r: 0.12, roar: 1 - k, headTilt: 0.25, t: st, a: 1 - ease((k - 0.6) / 0.4), mono: ik < 0.5 ? '#ffffff' : undefined });
        gouge(ctx, sx - dir * 2, sy - 22, dir > 0 ? 1.1 : PI - 1.1, 40, k);
        cracks(ctx, sx, sy, k, 120, 5);
        if (st === FIN) for (let i = 0; i < 24; i++) part(T.x + rand(-14, 14), T.y - rand(2, 34), i % 2 ? '#ffffff' : '#a6cbe6', rand(-4, 4), -rand(0, 4), 24, 2, 0.1);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
