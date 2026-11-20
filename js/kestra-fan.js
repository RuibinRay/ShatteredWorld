'use strict';
// Shattered Worlds — Kestra's war fan and her festival phoenix (the user, 2026-11-20: "Yes, do Kestra"). Her story: a
// daughter of the Sky Clan who "danced the fire-fan" in the undercroft of Aurelia; "a great folding war fan with flames
// curling off its edge"; fire moths; and she "claims to be the real phoenix". Pyra's phoenix is a bird of raw flame
// with a blue heart (js/pyra-phoenix.js); Kestra's is the opposite: a made thing, crimson lacquer and gold, its wings
// two open war fans and its tail a fan of eyed feathers. Crisp pixel art through js/pixel-kit.js.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/pyra-phoenix.js.
//   J      she strikes with the open fan; the finisher snaps a great fan open
//   U      Ember Breath: the fan opens in her hand and throws three burning phoenix feathers
//   S+U    Fan Gust: the great fan sweeps down and throws a wedge of fire
//   I      Fire Wheel: a fan spun full circle, ribs for spokes, flames off its rim
//   S+I    Phoenix Dive: two fans for wings and a tail of eyed feathers; feathers burst where she lands
//   W+O    Ember Swarm: fire moths with real wings
//   S+O    High Flame: flames ride her hand     O  Phoenix Form: two small fans at her back (small on purpose)
//   W+I    Sunfall: a sun built of open fans turns over the arena and rains burning feathers, then falls on the
//          target; in the finish (js/ult-grand.js) the festival phoenix rises behind the target, opens, and beats
//          its fan wings down on an impact frame
// SW.kestraFan.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.ember_breath || !CASTS.fire_wheel || !CASTS.fan_gust) return;
  const KF = SW.kestraFan = { on: true };
  const isK = g => !!(KF.on && g && g.state && g.state.hero === 'kestra');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const fwd = d => (d > 0 ? 0 : PI);

  // black lacquer, deep crimson, crimson, vermilion, orange, gold, pale gold, white
  const PAL = ['#16060a', '#4a0810', '#8a0f1c', '#c81e2a', '#f04a24', '#ff8a1e', '#ffc83a', '#ffe98a', '#ffffff'];
  const C = { k: PAL[0], d0: PAL[1], d1: PAL[2], c: PAL[3], v: PAL[4], o: PAL[5], g: PAL[6], p: PAL[7], w: PAL[8] };
  // a tongue of flame (or a long feather) from (x0, y0) along ang, L long, w half-wide, leaning by bend
  function tongue(c, x0, y0, ang, L, w, col, core, bend) {
    const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca, b = (bend || 0) * L;
    const Q = (u, off) => [x0 + ca * L * u + nx * off, y0 + sa * L * u + ny * off];
    poly(c, [Q(0, w * 0.7), Q(0.3, w + b * 0.4), Q(0.62, w * 0.55 + b), Q(1, b * 1.7), Q(0.66, -w * 0.3 + b), Q(0.3, -w + b * 0.3), Q(0, -w * 0.7)], col);
    if (core) poly(c, [Q(0, w * 0.35), Q(0.4, w * 0.4 + b * 0.5), Q(0.78, b * 1.2), Q(0.4, -w * 0.4 + b * 0.4), Q(0, -w * 0.35)], core);
  }

  // ================= the war fan: the pivot at (0, 0), opened `spread` radians about the direction ang =================
  // o = { fire (flames off the rim), curl (which way they lean), t }
  function fanVec(c, R, ang, spread, o) {
    o = o || {};
    const t = o.t || 0, full = spread > 6.2, n = Math.max(3, Math.round(spread / 0.25) + 1), a0 = ang - spread / 2;
    const A = i => a0 + spread * i / (n - 1), pt = (a, r) => [Math.cos(a) * r, Math.sin(a) * r];
    if (o.fire) for (let i = 0; i < n; i++) { const a = A(i), q = pt(a, R * 0.94); tongue(c, q[0], q[1], a + (o.curl === undefined ? 0.5 : o.curl), R * (0.32 + 0.13 * Math.sin(t * 0.5 + i * 1.7)), R * 0.085, i % 2 ? C.v : C.o, i % 2 ? null : C.g, 0.18); }
    for (let i = 0; i < n - 1; i++) {   // the leaf, pleat by pleat: crimson paper, a gold band near the rim
      const a = A(i), b = A(i + 1), m = (a + b) / 2;
      poly(c, [pt(a, R * 0.3), pt(a, R), pt(m, R * 0.95), pt(b, R), pt(b, R * 0.3)], i % 2 ? C.c : C.d1);
      poly(c, [pt(a, R * 0.8), pt(a, R * 0.9), pt(m, R * 0.86), pt(b, R * 0.9), pt(b, R * 0.8), pt(m, R * 0.76)], C.g);
      if (R > 26) poly(c, [pt(a, R * 0.42), pt(a, R * 0.48), pt(m, R * 0.455), pt(b, R * 0.48), pt(b, R * 0.42), pt(m, R * 0.395)], C.v);
    }
    if (!full && R >= 18 && spread > 1) { const q = pt(ang, R * 0.62); ell(c, q[0], q[1], R * 0.12, R * 0.12, C.g); ell(c, q[0], q[1], R * 0.06, R * 0.06, C.p); }   // the sun painted on it
    c.strokeStyle = C.k; c.lineWidth = Math.max(1, R * 0.04);
    for (let i = 0; i < n; i++) {   // lacquered ribs with steel tips: it is a war fan
      const a = A(i), q = pt(a, R);
      c.beginPath(); c.moveTo(0, 0); c.lineTo(q[0], q[1]); c.stroke();
      poly(c, [pt(a - 0.05, R * 0.97), pt(a, R * 1.13), pt(a + 0.05, R * 0.97)], C.p);
    }
    ell(c, 0, 0, R * 0.09, R * 0.09, C.g); ell(c, 0, 0, R * 0.04, R * 0.04, C.k);
  }
  function fan(ctx, x, y, R, ang, spread, o) { o = o || {}; PX.sprite(ctx, x, y, R * 3.3, R * 3.3, c => fanVec(c, R, ang, spread, o), { pal: PAL, alpha: o.a, mono: o.mono }); }

  // a phoenix feather: the quill at (0, 0), the tip at +x, an eye of gold near the tip, fire along the quill
  function featherVec(c, L, t) {
    for (let i = 0; i < 3; i++) tongue(c, L * 0.1, (i - 1) * L * 0.06, PI + (i - 1) * 0.3 + Math.sin(t * 0.7 + i) * 0.15, L * (0.5 - Math.abs(i - 1) * 0.12), L * 0.07, i === 1 ? C.o : C.v, i === 1 ? C.g : null, 0.1);
    poly(c, [[0, 0], [L * 0.3, -L * 0.17], [L * 0.75, -L * 0.15], [L, 0], [L * 0.75, L * 0.15], [L * 0.3, L * 0.17]], C.c);
    poly(c, [[0, 0], [L * 0.3, L * 0.17], [L * 0.75, L * 0.15], [L, 0]], C.d1);
    poly(c, [[L * 0.1, 0], [L * 0.4, -L * 0.08], [L * 0.92, 0], [L * 0.4, L * 0.08]], C.v);
    ell(c, L * 0.7, 0, L * 0.11, L * 0.11, C.g); ell(c, L * 0.7, 0, L * 0.055, L * 0.055, C.d1);
    c.strokeStyle = C.p; c.lineWidth = 1; c.beginPath(); c.moveTo(-L * 0.15, 0); c.lineTo(L * 0.55, 0); c.stroke();
  }
  function feather(ctx, x, y, L, ang, t, a) { PX.sprite(ctx, x, y, L * 2.6, L * 2.6, c => { c.rotate(ang); c.translate(-L * 0.5, 0); featherVec(c, L, t || 0); }, { pal: PAL, alpha: a }); }

  // a fire moth, seen from above, flying toward +x: f 0-1 how far its wings are open
  function mothVec(c, s, f, t) {
    const w = 0.3 + 0.7 * f;
    tongue(c, -s * 0.3, 0, PI, s * 0.55, s * 0.07, C.o, C.g, 0.12 * Math.sin(t));   // the ember it trails
    for (const d of [-1, 1]) {
      poly(c, [[-s * 0.1, 0], [-s * 0.5, d * s * 0.3 * w], [-s * 0.72, d * s * 0.08 * w], [-s * 0.3, 0]], C.v);   // hindwing
      poly(c, [[s * 0.2, 0], [-s * 0.2, d * s * 0.62 * w], [-s * 0.62, d * s * 0.5 * w], [-s * 0.2, 0]], C.c);   // forewing
      poly(c, [[-s * 0.2, d * s * 0.62 * w], [-s * 0.62, d * s * 0.5 * w], [-s * 0.4, d * s * 0.38 * w]], C.g);
      ell(c, -s * 0.22, d * s * 0.34 * w, s * 0.08, s * 0.08 * w, C.p); ell(c, -s * 0.22, d * s * 0.34 * w, s * 0.035, s * 0.035 * w, C.k);   // an eye on each wing
      c.strokeStyle = C.g; c.lineWidth = 1; c.beginPath(); c.moveTo(s * 0.34, d * s * 0.03); c.lineTo(s * 0.56, d * s * 0.2); c.stroke();   // feelers
    }
    poly(c, [[-s * 0.34, 0], [0, -s * 0.09], [s * 0.36, 0], [0, s * 0.09]], C.d0); ell(c, s * 0.34, 0, s * 0.08, s * 0.08, C.g);
  }
  function moth(ctx, x, y, s, t, dir, tilt) { PX.sprite(ctx, x, y, s * 2.4, s * 2.4, c => { c.scale(dir, 1); c.rotate(tilt || 0); mothVec(c, s, Math.abs(Math.sin(t * 0.9)), t); }, { pal: PAL }); }

  // ================= the festival phoenix, seen from the front: (0, 0) its breast, s its body height =================
  // o = { open 0-1 (wings and tail unfolding), beat -1 wings raised .. 1 beaten down, t, glare }
  function greatVec(c, s, o) {
    const t = o.t || 0, open = clamp01(o.open === undefined ? 1 : o.open), beat = o.beat === undefined ? -1 : o.beat;
    const tn = 7, tsp = 0.25 + 1.25 * open;   // the tail: a tall fan of long eyed feathers, dark behind everything
    for (let i = 0; i < tn; i++) {
      const a = -PI / 2 - tsp / 2 + tsp * i / (tn - 1) + Math.sin(t * 0.15 + i) * 0.03, L = s * (1.5 - Math.abs(i - 3) * 0.07);
      tongue(c, 0, s * 0.2, a, L, s * 0.1, i % 2 ? C.d1 : C.d0, i % 2 ? C.c : null, 0);
      const ex = Math.cos(a) * L * 0.8, ey = s * 0.2 + Math.sin(a) * L * 0.8; ell(c, ex, ey, s * 0.085, s * 0.085, C.g); ell(c, ex, ey, s * 0.045, s * 0.045, C.d1);
    }
    for (const d of [-1, 1]) {   // the wings: two open war fans, held out to the sides
      c.save(); c.translate(d * s * 0.16, -s * 0.2); c.scale(d, 1);
      fanVec(c, s * 1.05, -0.5 + (beat + 1) * 0.55, 0.3 + 1.4 * open, { fire: true, t, curl: -0.5 });
      c.restore();
    }
    c.save(); c.translate(0, -s * 0.05); c.scale(1.3, 1.3);
    for (const d of [-1, 1]) poly(c, [[d * s * 0.05, s * 0.34], [d * s * 0.19, s * 0.58], [d * s * 0.11, s * 0.5], [d * s * 0.09, s * 0.66], [d * s * 0.02, s * 0.5]], C.g);   // talons
    poly(c, [[0, -s * 0.36], [s * 0.18, -s * 0.14], [s * 0.12, s * 0.22], [0, s * 0.44], [-s * 0.12, s * 0.22], [-s * 0.18, -s * 0.14]], C.c);   // the body
    poly(c, [[0, -s * 0.36], [s * 0.18, -s * 0.14], [s * 0.12, s * 0.22], [0, s * 0.44]], C.d1);
    for (let j = 0; j < 3; j++) { const y = -s * 0.16 + j * s * 0.14, w = s * (0.13 - j * 0.025); poly(c, [[-w, y], [0, y + s * 0.09], [w, y], [0, y + s * 0.04]], C.g); }   // gold chevrons down the breast
    poly(c, [[-s * 0.07, -s * 0.3], [s * 0.07, -s * 0.3], [s * 0.06, -s * 0.5], [-s * 0.06, -s * 0.5]], C.v);   // the neck
    for (let i = 0; i < 3; i++) {   // the crest: three plumes, an eye on each
      const a = -PI / 2 + (i - 1) * 0.5 + Math.sin(t * 0.3 + i) * 0.05, L = s * (i === 1 ? 0.5 : 0.4);
      tongue(c, 0, -s * 0.62, a, L, s * 0.04, C.p, null, 0); ell(c, Math.cos(a) * L * 0.9, -s * 0.62 + Math.sin(a) * L * 0.9, s * 0.055, s * 0.055, C.v); ell(c, Math.cos(a) * L * 0.9, -s * 0.62 + Math.sin(a) * L * 0.9, s * 0.025, s * 0.025, C.p);
    }
    poly(c, [[0, -s * 0.7], [s * 0.15, -s * 0.58], [s * 0.1, -s * 0.44], [0, -s * 0.38], [-s * 0.1, -s * 0.44], [-s * 0.15, -s * 0.58]], C.g);   // the head: a mask of gold
    poly(c, [[0, -s * 0.7], [s * 0.15, -s * 0.58], [0, -s * 0.57], [-s * 0.15, -s * 0.58]], C.p);
    poly(c, [[-s * 0.045, -s * 0.49], [s * 0.045, -s * 0.49], [0, -s * 0.33]], C.w); poly(c, [[-s * 0.018, -s * 0.4], [s * 0.018, -s * 0.4], [0, -s * 0.33]], C.k);   // the beak, pointed down at you
    for (const d of [-1, 1]) {
      poly(c, [[d * s * 0.005, -s * 0.5], [d * s * 0.14, -s * 0.63], [d * s * 0.135, -s * 0.56], [d * s * 0.03, -s * 0.47]], C.k);   // brows drawn down
      poly(c, [[d * s * 0.035, -s * 0.495], [d * s * 0.115, -s * 0.565], [d * s * 0.1, -s * 0.5]], o.glare ? C.w : C.c);   // slit eyes
    }
    c.restore();
  }
  function great(ctx, x, y, s, o) { o = o || {}; PX.sprite(ctx, x, y - s * 0.2, s * 3.9, s * 3.9, c => { c.translate(0, s * 0.2); greatVec(c, s, o); }, { pal: PAL, alpha: o.a, mono: o.mono }); }
  // a sun built of open fans: r its radius
  function sunVec(c, r, t) {
    for (let i = 0; i < 6; i++) { c.save(); c.rotate(t * 0.07 + i * PI / 3); c.translate(r * 0.15, 0); fanVec(c, r * 1.3, 0, 1.25, { fire: true, t: t + i * 3, curl: 0.7 }); c.restore(); }
    ell(c, 0, 0, r * 0.5, r * 0.5, C.g); ell(c, 0, 0, r * 0.36, r * 0.36, C.p); ell(c, 0, 0, r * 0.18, r * 0.18, C.w);
  }
  function sun(ctx, x, y, r, t, a) { PX.sprite(ctx, x, y, r * 4.8, r * 4.8, c => sunVec(c, r, t), { pal: PAL, alpha: a }); }
  Object.assign(KF, { fan, feather, moth, great, sun });
  const sparks = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 === 0 ? '#ffe98a' : i % 3 === 1 ? '#f04a24' : '#c81e2a', rand(-pw, pw), -rand(0.5, pw), 20, 2, -0.02); };

  // ================= U: Ember Breath =================
  const _eb = CASTS.ember_breath;
  CASTS.ember_breath = function (p, z) {
    const n0 = z.shots.length, r = _eb.apply(this, arguments);
    if (!isK(G)) return r;
    z.shots.slice(n0).forEach(s => { if (s instanceof Proj && s.w === 10) { s.kf = 1; s.render = (ctx, x, y, q) => feather(ctx, x, y, 21, Math.atan2(q.vy, q.vx), q.t); } });
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 12, (ctx, sx, sy, t) => fan(ctx, sx + d * 11, sy - 22, 18, fwd(d) - d * 0.35, 0.4 + 1.6 * ease(t / 4), { fire: true, t, a: t > 8 ? (12 - t) / 4 : 1 }), v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= S+U: Fan Gust =================
  const _fg = CASTS.fan_gust;
  CASTS.fan_gust = function (p, z) {
    const r = _fg.apply(this, arguments);
    if (!isK(G)) return r;
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 20, (ctx, sx, sy, t) => {
      const k = ease(t / 7), a = t > 13 ? (20 - t) / 7 : 1, px = sx + d * 6, py = sy - 22, R = 38 + 56 * ease(t / 9);
      PX.sprite(ctx, px + d * R * 0.5, py, R + 60, 120, c => {   // the wedge of fire it throws
        c.scale(d, 1); c.translate(-R * 0.5, 0);
        for (let i = 0; i < 9; i++) tongue(c, 8, 0, (i - 4) * 0.13, R * (1 - Math.abs(i - 4) * 0.05), 5 + R * 0.05, i % 2 ? C.v : C.o, i % 3 === 0 ? C.p : C.g, (rnd(t >> 1, i) - 0.5) * 0.25);
      }, { pal: PAL, alpha: a * (t > 9 ? 1 - (t - 9) / 14 : 1) });
      PX.lines(ctx, px + d * 30, py, fwd(d), 70, 6, t, '#ffe98a', 40);
      fan(ctx, px, py, 40, fwd(d) + d * (-1.25 + 1.75 * k), 2.1, { fire: true, t, a });
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= I: Fire Wheel =================
  const _fw = CASTS.fire_wheel;
  CASTS.fire_wheel = function (p, z) {
    const n0 = z.shots.length, r = _fw.apply(this, arguments);
    if (!isK(G)) return r;
    z.shots.slice(n0).forEach(s => { if (s instanceof Proj && s.w === 30) { s.kf = 1; s.render = (ctx, x, y, q) => { const dd = q.vx >= 0 ? 1 : -1; fan(ctx, x, y, 25, q.t * 0.28 * dd, PI * 2, { fire: true, t: q.t, curl: -dd * 0.9 }); }; } });
    return r;
  };

  // ================= S+I: Phoenix Dive =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.kestra;
  if (BU && BU.cast) {
    const _pd0 = BU.cast;
    BU.cast = function (p, z) { const r = _pd0.apply(this, arguments); if (isK(G)) { p._kfDive = 50; p._kfAir = false; } return r; };
  }
  function landBurst(p, z) {
    z.shots.push(new Vis(p.x, p.y - 14, 16, (ctx, sx, sy, t) => {
      const k = t / 16, a = 1 - ease((k - 0.5) / 0.5);
      for (let i = 0; i < 12; i++) { const an = i / 12 * PI * 2 + 0.2, R = 14 + ease(k * 1.3) * 50; feather(ctx, sx + Math.cos(an) * R, sy + Math.sin(an) * R * 0.7, 15, an, t, a); }
    }));
  }

  // ================= J finisher: the great fan snaps open =================
  const FINS = SW.clanmelee && SW.clanmelee.FIN;
  if (FINS && FINS.kestra) {
    const _kf = FINS.kestra;
    FINS.kestra = function (p, z) {
      const r = _kf.apply(this, arguments);
      if (isK(G)) { const d = p.face; z.shots.push(new Vis(p.x, p.y, 16, (ctx, sx, sy, t) => fan(ctx, sx + d * 10, sy - 22, 46, fwd(d), 0.5 + 1.7 * ease(t / 4), { fire: true, t, a: t > 10 ? (16 - t) / 6 : 1, curl: 0 }), v => { v.x = p.x; v.y = p.y; })); }
      return r;
    };
  }

  // ================= the melee fan, the dive's wings, and the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 7) {
        const big = a.heavy || a.down, up = a.anim === 'launcher', sgn = up ? -1 : ((a.hitAt + (a.dur || 0)) % 2 ? 1 : -1), sw = (-0.9 + 1.8 * ease(k / 4)) * sgn;
        fan(ctx, sx + d * 8, sy - 22, big ? 34 : 26, fwd(d) + d * sw, 1.5, { fire: big, t: p.t, a: k > 4 ? (7 - k) / 3 : 1 });
        if (k === 0) sparks(p.x + d * 24, p.y - 22, big ? 6 : 3, 2);
      }
    }
    if (!front && p._kfDive > 0) {   // Phoenix Dive: two fans for wings, a tail of eyed feathers
      const t = 50 - p._kfDive, dive = p.vy > 3, open = ease(t / 5), va = dive ? Math.atan2(-p.vy, -p.vx * 0.5) : PI / 2;
      PX.sprite(ctx, sx, sy - 22, 170, 170, c => {
        for (let i = 0; i < 5; i++) { const an = va + (i - 2) * 0.17 + Math.sin(p.t * 0.4 + i) * 0.05, L = 46 - Math.abs(i - 2) * 5; tongue(c, 0, 4, an, L, 4.5, i % 2 ? C.c : C.d1, i % 2 ? C.v : null, 0); const ex = Math.cos(an) * L * 0.78, ey = 4 + Math.sin(an) * L * 0.78; ell(c, ex, ey, 3.5, 3.5, C.g); ell(c, ex, ey, 1.8, 1.8, C.d1); }
        for (const dd of [-1, 1]) { c.save(); c.translate(dd * 3, -4); c.scale(dd, 1); fanVec(c, 38, dive ? -1.25 : -0.75 + 0.2 * Math.sin(t * 0.8), (dive ? 0.95 : 1.6) * open, { fire: true, t: p.t, curl: -0.5 }); c.restore(); }
      }, { pal: PAL });
    }
    if (front && p.modeT > 0) {   // High Flame: flames ride her hand (small)
      const fade = Math.min(1, p.modeT / 30);
      PX.sprite(ctx, sx + d * 8, sy - 26, 22, 26, c => { for (let i = 0; i < 3; i++) tongue(c, (i - 1) * 3, 4, -PI / 2 + (i - 1) * 0.3 + Math.sin(p.t * 0.4 + i) * 0.15, 9 + (i === 1 ? 4 : 0), 2.5, i === 1 ? C.g : C.v, i === 1 ? C.p : null, 0.1); }, { pal: PAL, alpha: fade });
    }
    if (!front && p.awakeT > 0 && !(p._kfDive > 0)) {   // Phoenix Form: two small fans at her back (small)
      const fade = Math.min(1, p.awakeT / 30), br = 0.12 * Math.sin(p.t * 0.12);
      PX.sprite(ctx, sx, sy - 28, 60, 50, c => { for (const dd of [-1, 1]) { c.save(); c.translate(dd * 2, 4); c.scale(dd, 1); fanVec(c, 13, -0.8 + br, 1.25, {}); c.restore(); } }, { pal: PAL, alpha: fade });
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

  // ================= her leftover shots: the moths, and Sunfall's sun and rain =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.kf) return;
      if (s.paint && s.home === 0.14 && s.w === 8 && s.style === 'fire' && s.life === 70) { s.kf = 1; const ph = (z.shots.indexOf(s) * 2.3) % 6; s.paint = (ctx, x, y, q) => moth(ctx, x, y + Math.round(Math.sin(q.t * 0.5 + ph) * 3), 17, q.t + ph, q.vx >= 0 ? 1 : -1, SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)), -1, 1)); return; }
      if (p.state !== 'ult' || !s.render || s.vx !== undefined) return;
      if (s.life === 66) {   // the sun: built of fans, and it falls on the nearest of them
        s.kf = 1; s._ugS = 1; const T = N.nearest ? N.nearest(z, p.x, p.y - 16, 900) : null;
        s.render = (ctx, x, y, t) => {
          const u = ease((t - 54) / 9), tx = T && !T.dead ? T.x - G.cam.x : x, ty = T && !T.dead ? T.y - 22 - G.cam.y : y + 150;
          sun(ctx, Math.round(x + (tx - x) * u), Math.round(y + (ty - y) * u), Math.min(24, 6 + t * 0.9), t, Math.min(1, t / 5));
        };
      } else if (s.life === 10 && p.st >= 18 && p.st <= 52) {   // the rain: burning feathers
        s.kf = 1; s._ugS = 1; const T = N.nearest ? N.nearest(z, p.x, p.y - 16, 900) : null, wx = (T && !T.dead ? T.x : p.x) + rand(-34, 34), wy = p.y - 8, x0 = s.x, y0 = s.y;
        s.render = (ctx, x, y, t) => feather(ctx, Math.round(x + (wx - x0) * t / 10), Math.round(y + (wy - y0) * t / 10), 17, Math.atan2(wy - y0, wx - x0), t);
      }
    });
  }
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isK(g || this.G) || !z || !z.shots) return r;
    dress(this, z);
    if (this._kfDive > 0) {
      this._kfDive--;
      if (!this.onGround) this._kfAir = true;
      if (this._kfAir && this.onGround) { landBurst(this, z); this._kfDive = 0; }
      else if (this.state !== 'cast' && this._kfDive < 47) this._kfDive = 0;
    }
    if (!this.dead && this.awakeT > a0 + 60) sparks(this.x, this.y - 24, 14, 2.6);   // Phoenix Form begins (small and short)
    return r;
  };

  // ================= W+I: Sunfall's finish =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isK(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('kestra') : null;
    if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    return r;
  };
  // js/ult-grand.js builds up from BU2 and lands its finishing blow at FIN: the festival phoenix rises behind the
  // target, unfolds, and beats its fan wings down
  function finale(p, z, T, FIN, BU2) {
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult') return false;
      const st = p.st; if (st < BU2 - 2 || st > FIN + 18) return;
      const sx = Math.round(v.x - cam.x), sy = Math.round(v.y - cam.y), cy = sy - 20;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 14), sh = st > FIN - 10 ? Math.sin(st * 2.3) * 1.2 : 0;
        great(ctx, sx + sh, cy + 6 + 40 * (1 - k), 34, { open: k, beat: -1 + 0.12 * Math.sin(st * 0.5), t: st, a: Math.min(1, k * 2.5), glare: st > FIN - 12 });
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 77);
        great(ctx, sx, cy + 6 + 6 * Math.min(1, ik), 34, { open: 1, beat: -1 + 2 * ease(ik * 1.4), t: st, glare: true, mono: ik < 0.5 ? '#ffffff' : undefined, a: 1 - ease((k - 0.5) / 0.5) });
        if (ik >= 0.5) for (let i = 0; i < 14; i++) { const an = i / 14 * PI * 2 + 0.3, R = 16 + ease(k * 1.2) * 92; feather(ctx, sx + Math.cos(an) * R, cy + Math.sin(an) * R * 0.6, 16, an, st, 1 - k); }
        if (st === FIN) sparks(T.x, T.y - 16, 26, 4.5);
      }
    });
  }
})();
