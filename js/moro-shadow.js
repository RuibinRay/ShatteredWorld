'use strict';
// Shattered Worlds — Moro's shadow hands (2026-11-20, the hero-look rework: cool, not cute). His story: the Long Shadow,
// a tired man who decided shadows "should hold things instead"; his look: long shadows reaching out from beneath him
// like hands. His shadows were dark bars and spikes. Now they are hands: long-fingered, clawed hands of shadow drawn as
// crisp pixel art by js/pixel-kit.js, near-black indigo with a pale violet rim so they read on a dark arena, rising out
// of pools of shadow on the floor, reaching, and closing. Draw-only: every hit, hitbox and timing stays as it was.
// Loaded after js/garo-wheel.js.
//   U      Shade Dart: a shadow hand crawls along the floor on its fingers; what it pins, it grabs by the ankle
//   S+U    Sink Step: he sinks into a pool of reaching fingers and rises behind the target; a hand flings them up
//   I      Shadow Snare: the shadow spreads both ways and hands rise along it, closing on every squeeze
//   S+I    Night Spikes: three huge shadow fingers rise round the target and curl in like a fist
//   W+O    Shadow Tide: the shadow pours out and rises as a row of hands instead of spikes
//   J      his combo: a shadow hand lashes up from the floor into every hit; the last grips and squeezes
//   S+O    Long Dusk: his shadow stretches long across the floor, as if a lamp stood behind him
//   O      Night Mind: two small shadow hands at his shoulders (small on purpose: the view stays clear)
//   W+I    Long Night: the station lamps across the top of the screen pop out one by one; hands rise under everyone;
//          in the cinematic finish (js/ult-cinema.js) one huge shadow hand rises behind the target, open, and shuts
//          into a fist on an impact frame
// SW.moroShadow.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.shade_dart || !CASTS.shadow_snare) return;
  const MS = SW.moroShadow = { on: true };
  const isM = g => !!(MS.on && g && g.state && g.state.hero === 'moro');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // shadow: black-indigo up to a pale violet rim; a warm lamp for contrast
  const PAL = ['#05040c', '#0e0d1c', '#1c1d33', '#2e3054', '#5b5f97', '#8a8fd0', '#d0d2ff', '#ffffff', '#ffcf7a', '#ff9a3a'];
  const C = { out: PAL[6], k0: PAL[0], k1: PAL[1], k2: PAL[2], m: PAL[3], v: PAL[4], rim: PAL[5], pale: PAL[6], w: PAL[7], lamp: PAL[8], lamp2: PAL[9] };

  // ---------- a hand rising from the floor: (0, 0) the wrist at the floor, the arm up -y; s the hand's length ----------
  // o = { grip 0 (fingers spread) -> 1 (fist), arm (forearm length in s), lean (radians), thumb side }
  function handVec(c, s, o) {
    const g = clamp01(o.grip || 0), arm = (o.arm === undefined ? 0.9 : o.arm) * s;
    c.rotate(o.lean || 0);
    // the forearm, thinning to the wrist, a little ragged like smoke at the floor
    c.beginPath(); c.moveTo(-s * 0.2, 0); c.lineTo(-s * 0.13, -arm); c.lineTo(s * 0.13, -arm); c.lineTo(s * 0.2, 0); c.closePath(); c.fillStyle = C.k1; c.fill();
    c.fillStyle = C.k2; c.fillRect(-s * 0.03, -arm, s * 0.06, arm);
    for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * s * 0.1 - s * 0.05, 0); c.lineTo(i * s * 0.1, s * 0.08); c.lineTo(i * s * 0.1 + s * 0.05, 0); c.fillStyle = C.k1; c.fill(); }
    c.translate(0, -arm);
    // the palm
    c.beginPath(); c.moveTo(-s * 0.2, 0); c.lineTo(-s * 0.24, -s * 0.34); c.lineTo(s * 0.24, -s * 0.36); c.lineTo(s * 0.18, 0); c.closePath(); c.fillStyle = C.k2; c.fill();
    // four long fingers: spread and straight, curling in to a fist as grip goes to 1
    for (let i = 0; i < 4; i++) {
      const bx = (-0.18 + i * 0.12) * s, by = -0.34 * s, spread = (i - 1.5) * 0.34 * (1 - g), L = s * (0.58 - Math.abs(i - 1.5) * 0.07), seg = [0.45, 0.33, 0.22];
      let x = bx, y = by, a = -PI / 2 + spread;
      c.strokeStyle = C.k2; c.lineCap = 'round'; c.lineWidth = s * 0.07;
      c.beginPath(); c.moveTo(x, y);
      seg.forEach((f, j) => { a += g * (j === 0 ? 1.1 : 1.25); x += Math.cos(a) * L * f; y += Math.sin(a) * L * f; c.lineTo(x, y); });
      c.stroke();
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * s * 0.17, y + Math.sin(a) * s * 0.17); c.strokeStyle = C.rim; c.lineWidth = Math.max(1, s * 0.045); c.stroke();   // the claw, long and hooked
    }
    // the thumb, out to the side
    c.strokeStyle = C.k2; c.lineWidth = s * 0.09; c.beginPath(); c.moveTo(-s * 0.2, -s * 0.12); c.lineTo(-s * (0.36 - g * 0.12), -s * (0.3 + g * 0.06)); c.lineTo(-s * (0.38 - g * 0.24), -s * (0.46 - g * 0.06)); c.stroke();
    // a faint pale vein of light down the back of the hand
    c.strokeStyle = C.m; c.lineWidth = Math.max(1, s * 0.03); c.beginPath(); c.moveTo(0, s * 0.3); c.lineTo(s * 0.02, -s * 0.3); c.stroke();
  }
  // as a sprite: (x, y) the floor under the wrist; o = { grip, arm, lean, dir (mirror), a, mono, rise 0-1 (how far out of the floor) }
  function hand(ctx, x, y, s, o) {
    o = o || {};
    const rise = o.rise === undefined ? 1 : clamp01(o.rise), arm = o.arm === undefined ? 0.9 : o.arm, tall = (arm + 1.0) * s;
    if (rise <= 0) return;
    PX.sprite(ctx, x, y - tall / 2, s * 2.2 + 6, tall * 1.25 + 8, c => {
      c.translate(0, tall / 2);
      c.beginPath(); c.rect(-s * 2, -tall * 1.3, s * 4, tall * 1.3); c.clip();   // nothing below the floor
      c.translate(0, tall * (1 - rise));
      if (o.dir < 0) c.scale(-1, 1);
      handVec(c, s, o);
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  MS.hand = hand;
  function pool(ctx, x, y, w, a) {   // a pool of shadow on the floor, with a pale rim
    if (w < 1 || a <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp01(a);
    art.rect(ctx, C.k0, Math.round(x - w), y - 2, Math.round(w * 2), 3); art.rect(ctx, C.k1, Math.round(x - w * 0.8), y - 3, Math.round(w * 1.6), 1);
    art.rect(ctx, C.v, Math.round(x - w), y - 2, 1, 2); art.rect(ctx, C.v, Math.round(x + w) - 1, y - 2, 1, 2);
    ctx.restore();
  }
  // a hand crawling on its fingertips (seen from the side): (x, y) the floor, facing dir, phase t
  function crawler(ctx, x, y, s, dir, t, o) {
    o = o || {};
    PX.sprite(ctx, x, y - s * 0.4, s * 2.4, s * 1.3, c => {
      c.translate(0, s * 0.4); if (dir < 0) c.scale(-1, 1);
      c.fillStyle = C.k1; c.beginPath(); c.moveTo(-s * 1.0, -s * 0.05); c.lineTo(-s * 0.2, -s * 0.32); c.lineTo(s * 0.2, -s * 0.36); c.lineTo(s * 0.3, -s * 0.2); c.lineTo(-s * 1.0, s * 0.02); c.closePath(); c.fill();   // the back of the hand, trailing off into a smear of shadow
      c.strokeStyle = C.k2; c.lineCap = 'round'; c.lineWidth = s * 0.09;
      for (let i = 0; i < 4; i++) { const ph = t * 0.6 + i * 1.6, lift = Math.max(0, Math.sin(ph)) * s * 0.12, kx = s * (0.05 + i * 0.07), fx2 = s * (0.4 + i * 0.12) + Math.cos(ph) * s * 0.06; c.beginPath(); c.moveTo(kx, -s * 0.3); c.lineTo((kx + fx2) / 2 + s * 0.04, -s * 0.42 - lift); c.lineTo(fx2, -lift * 0.3); c.stroke(); }   // fingers walking: knuckle up, tip down
      c.strokeStyle = C.rim; c.lineWidth = Math.max(1, s * 0.04); c.beginPath(); c.moveTo(-s * 0.2, -s * 0.31); c.lineTo(s * 0.2, -s * 0.35); c.stroke();
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  const smoke = (x, y, n) => { for (let i = 0; i < n; i++) part(x + rand(-8, 8), y - rand(0, 6), i % 3 ? C.k2 : C.v, rand(-0.4, 0.4), -rand(0.4, 1.4), 18 + (i % 5) * 3, 3, -0.01); };
  const onFoe = (e, life, render) => { const v = new Vis(e.x, e.y, life, render, vv => { if (!e.dead) { vv.x = e.x; vv.y = e.y; } }); return v; };

  // ================= U: Shade Dart: a hand crawls along the floor and grabs the ankle =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.moro || !(s instanceof Proj) || !s.ghost || s.w !== 16 || s.h !== 12 || s.life !== 42 || s.team === 'enemy') return;
      s.moro = 1;
      s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1; pool(ctx, x - d * 18, y + 6, 18, 0.7); crawler(ctx, x, y + 6, 20, d, q.t); };
      const _end = s.onEnd;
      s.onEnd = function (g, zz, impact) {
        if (impact && zz && zz.shots) this.hitSet.forEach(e => { if (!e || e.dead) return; zz.shots.push(onFoe(e, 50, (ctx, sx, sy, t) => { const k = t / 50; pool(ctx, sx, sy, 12, 1 - ease((k - 0.6) / 0.4)); hand(ctx, sx + 4, sy, 11, { grip: ease(t / 5) * 0.85, arm: 0.2, rise: ease(t / 4), a: 1 - ease((k - 0.6) / 0.4), lean: -0.2 }); })); });
        return _end ? _end.apply(this, arguments) : undefined;
      };
    });
  }
  const _sd = CASTS.shade_dart;
  CASTS.shade_dart = function (p, z) { const r = _sd.apply(this, arguments); if (isM(G)) dress(p, z); return r; };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isM(g || this.G) && z && z.shots) dress(this, z); return r; };

  // ================= S+U: Sink Step =================
  const _ss = CASTS.sink_step;
  CASTS.sink_step = function (p, z) {
    const n0 = z.shots.length, r = _ss.apply(this, arguments);
    if (!isM(G)) return r;
    const pud = v => { v.render = (ctx, sx, sy, t) => { const k = Math.sin(PI * t / 20), w = Math.round(16 * k); pool(ctx, sx, sy, w, 0.9); for (let i = -1; i <= 1; i++) if (k > 0.4) hand(ctx, sx + i * 9, sy, 7, { grip: 0.2 + Math.abs(Math.sin(t * 0.4 + i)) * 0.4, arm: 0.1, rise: k, lean: i * 0.4 }); }; };
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
    z.shots.slice(n0).forEach(v => { if (v instanceof Vis && v.life === 20 && v.render) pud(v); });
    if (drv) {
      const _st = drv.step;
      drv.step = function () { const m = z.shots.length, out = _st.apply(this, arguments); z.shots.slice(m).forEach(v => { if (v instanceof Vis && v.life === 20 && v.render) pud(v); }); return out; };
      const _end = drv.end;
      drv.end = function () {   // the elbow: a hand rises under them, palm up, and flings
        const out = _end ? _end.apply(this, arguments) : undefined, x = p.x + p.face * 22, y = p.y;
        z.shots.push(new Vis(x, y, 18, (ctx, sx, sy, t) => { const k = t / 18; pool(ctx, sx, sy, 14, 1 - k); hand(ctx, sx, sy, 20, { grip: 0.15, arm: 0.5 + ease(t / 4) * 0.4, rise: ease(t / 3), lean: p.face * (0.2 - ease(t / 6) * 0.6), a: 1 - ease((k - 0.55) / 0.45) }); }));
        smoke(x, y, 8);
        return out;
      };
    }
    return r;
  };

  // ================= I: Shadow Snare: hands rise along the spreading shadow, closing on every squeeze =================
  const _sn = CASTS.shadow_snare;
  CASTS.shadow_snare = function (p, z) {
    const n0 = z.shots.length, r = _sn.apply(this, arguments);
    if (!isM(G)) return r;
    const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 60 && s.render);
    if (v) v.render = (ctx, x, y, t) => {
      const R = Math.round(Math.min(110, t * 10) * (t > 50 ? (60 - t) / 10 : 1)), a = t > 50 ? (60 - t) / 10 : 1;
      pool(ctx, x, y, R, 0.8);
      const beat = [12, 20, 28, 36].map(s => t - s).find(k => k >= 0 && k < 8), big = t >= 40 && t < 52;
      for (let i = -R + 6; i <= R - 6; i += 22) {
        if (Math.abs(i) < 10) continue;
        const grip = big ? ease((t - 40) / 4) : beat !== undefined ? (beat < 3 ? ease(beat / 3) : 1 - (beat - 3) / 5) * 0.8 : 0.1;
        hand(ctx, x + i, y, big ? 15 : 11, { grip, arm: big ? 0.7 : 0.45, rise: ease((R - Math.abs(i)) / 14), lean: Math.sign(i) * -0.25 + Math.sin(t * 0.2 + i) * 0.08, a });
      }
    };
    return r;
  };

  // ================= S+I: Night Spikes: three shadow fingers curl in like a fist =================
  // and W+O Shadow Tide: a row of hands. Both are built from pillars: dress the pillars these moves just made.
  function fingerAt(ctx, sx, sy, s, side, k) {   // one huge finger rising from the floor, curling toward the middle
    const rise = ease(k / 5), curl = ease((k - 6) / 10) * (k > 22 ? 1 : 1), fade = k > 22 ? 1 - (k - 22) / 8 : 1;
    if (rise <= 0 || fade <= 0) return;
    PX.sprite(ctx, sx, sy - s * 0.6, s * 1.6, s * 1.5, c => {
      c.translate(0, s * 0.6);
      c.beginPath(); c.rect(-s, -s * 1.5, s * 2, s * 1.5); c.clip();
      c.translate(0, s * 1.1 * (1 - rise));
      let x = 0, y = 0, a = -PI / 2; const segs = [0.45, 0.35, 0.25];
      c.strokeStyle = C.k2; c.lineCap = 'round'; c.lineWidth = s * 0.16;
      c.beginPath(); c.moveTo(0, s * 0.1);
      segs.forEach(f => { a += side * curl * 0.75; x += Math.cos(a) * s * f; y += Math.sin(a) * s * f; c.lineTo(x, y); });
      c.stroke();
      c.strokeStyle = C.rim; c.lineWidth = s * 0.06; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * s * 0.18, y + Math.sin(a) * s * 0.18); c.stroke();
      c.strokeStyle = C.m; c.lineWidth = Math.max(1, s * 0.03); c.beginPath(); c.moveTo(-side * s * 0.03, 0); c.lineTo(-side * s * 0.03, -s * 0.3); c.stroke();
    }, { pal: PAL, alpha: fade, outline: C.out, keepThin: true });
  }
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.moro;
  if (BU && BU.cast) {
    const _ns = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ns.apply(this, arguments);
      if (!isM(G)) return r;
      const pil = z.shots.slice(n0).filter(s => s instanceof Vis && s.render && [36, 42, 50].indexOf(s.life) >= 0);   // its three pillars (delays 6, 12, 20; js/ninjas1.js)
      pil.forEach((v, i) => {
        const delay = v.life - 30, side = i === 0 ? 1 : i === 1 ? -1 : 0, big = i === 2;
        v.render = (ctx, sx, sy, t) => {
          if (t < delay) { pool(ctx, sx, sy, Math.round(12 * t / delay), 0.7); return; }
          const k = t - delay;
          if (big) hand(ctx, sx, sy, 22, { grip: ease((k - 4) / 8), arm: 0.8, rise: ease(k / 5), a: k > 22 ? 1 - (k - 22) / 8 : 1 });
          else fingerAt(ctx, sx, sy, 40, side, k);
        };
      });
      return r;
    };
  }
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.moro;
  if (SIG && SIG.cast) {
    const _st = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _st.apply(this, arguments);
      if (!isM(G)) return r;
      z.shots.slice(n0).forEach((s, i) => {
        if (!s.paint) return;
        if (/o\.kind/.test(String(s.paint))) {   // a pillar: a hand instead of a spike
          const delay = s.life - 24;
          s.paint = (ctx, sx, sy, q) => { const t = q.t; if (t < delay) { pool(ctx, sx, sy, Math.round(10 * t / delay), 0.6); return; } const k = t - delay; hand(ctx, sx, sy, 16, { grip: ease((k - 4) / 6) * 0.9, arm: 0.7, rise: ease(k / 3), lean: (i % 2 ? 0.15 : -0.15), a: k > 16 ? Math.max(0, (24 - k) / 8) : 1 }); };
        } else {   // the shadow pouring out
          const dir = p.face;
          s.paint = (ctx, sx, sy, q) => { const len = Math.round(110 * Math.min(1, q.t / 16)), a = q.t > 26 ? (34 - q.t) / 8 : 1; pool(ctx, sx + dir * len / 2, sy, len / 2, 0.75 * a); };
        }
      });
      return r;
    };
  }

  // ================= his combo, and the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, a = p.atk;
    if (behind && p.modeT > 0) {   // Long Dusk: his shadow stretched long across the floor
      const fade = Math.min(1, p.modeT / 30), L = 72 + Math.sin(p.t * 0.05) * 5;
      ctx.save(); ctx.globalAlpha = 0.85 * fade;   // (on the floor's surface, which is lighter than the dark air above it)
      const x0 = d > 0 ? Math.round(sx - L - 10) : Math.round(sx), x1 = d > 0 ? Math.round(sx) : Math.round(sx + L + 10);
      art.rect(ctx, C.k0, x0, sy, x1 - x0, 3); art.rect(ctx, C.v, x0, sy + 3, x1 - x0, 1);
      for (let i = 0; i < 4; i++) art.rect(ctx, C.k0, Math.round(sx - d * (L + 12 + i * 3)), sy + (i % 2), 2, 2);   // fingers of it, reaching
      ctx.restore();
      return;
    }
    if (behind) return;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // a shadow hand lashes up into every hit
      const k = p.st - a.hitAt, set = p.comboSet ? p.comboSet() : null, last = !!(set && a === set[set.length - 1]);
      const hx = sx + d * (a.box ? a.box[0] + a.box[2] * 0.6 : 22);
      if (!last && k >= -2 && k < 6) hand(ctx, hx, sy, 12, { grip: ease((k + 1) / 3) * 0.7, arm: 0.55, rise: ease((k + 2) / 2), lean: d * 0.35, a: k < 3 ? 1 : 1 - (k - 3) / 3 });
      if (last && k >= -2 && k < 16) { pool(ctx, hx, sy, 12, 1 - k / 16); hand(ctx, hx, sy, 16, { grip: ease(k / 4), arm: 0.6, rise: ease((k + 2) / 3), lean: d * 0.15, a: 1 - ease((k - 10) / 6), mono: k >= 0 && k < 2 ? C.pale : undefined }); }
    }
    if (p.awakeT > 0) {   // Night Mind: two small hands at his shoulders
      const fade = Math.min(1, p.awakeT / 30);
      for (const o of [-1, 1]) { const sw = Math.sin(p.t * 0.07 + o) * 0.15; hand(ctx, sx - d * 4 + o * 9, sy - 26, 7, { grip: 0.3 + Math.sin(p.t * 0.05 + o) * 0.2, arm: 0.2, lean: o * 0.5 + sw, a: fade * 0.9 }); }
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

  // ================= W+I: Long Night =================
  const _ln = N.ULT && N.ULT.long_night;
  if (_ln) N.ULT.long_night = function (p, z, foes) {
    const r = _ln.apply(this, arguments);
    if (!isM(G)) return r;
    if (p.st === 6) {
      const lamps = new Vis(0, 0, 66, (ctx, x, y, t) => {   // (screen space) a row of station lamps; they pop out one by one
        for (let i = 0; i < 7; i++) {
          const lx = 30 + i * 70, out = 4 + i * 6, on = t < out, pop = t >= out && t < out + 3;
          art.rect(ctx, C.k1, lx - 1, 0, 2, 12); art.rect(ctx, C.m, lx - 6, 12, 12, 4);
          if (on) { ctx.save(); ctx.globalAlpha = 0.25; art.rect(ctx, C.lamp, lx - 14, 16, 28, 40); ctx.restore(); art.rect(ctx, C.lamp, lx - 4, 16, 8, 3); art.rect(ctx, C.w, lx - 2, 16, 4, 1); }
          else if (pop) { for (let j = 0; j < 4; j++) art.rect(ctx, C.lamp2, lx - 6 + j * 4, 18 + (j % 2) * 3, 1, 1); }
          else art.rect(ctx, C.k2, lx - 4, 16, 8, 3);
        }
      });
      lamps.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      lamps._ugS = 1; z.shots.push(lamps);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('moro') >= 0) finale(p, z, T);
    }
    if (p.st >= 12 && p.st <= 52 && (p.st - 12) % 10 === 0) foes.forEach((e, i) => {   // hands rise under everyone and close
      if (!e || e.dead) return;
      const v = onFoe(e, 16, (ctx, sx, sy, t) => { const k = t / 16; pool(ctx, sx, sy, 14, 1 - k); for (const o of [-1, 1]) hand(ctx, sx + o * 8, sy, 14, { grip: ease((t - 3) / 5), arm: 0.6, rise: ease(t / 3), lean: -o * 0.35, a: 1 - ease((k - 0.6) / 0.4) }); });
      v._ugS = 1; z.shots.push(v);
    });
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100): one huge
  // shadow hand rises behind the target, fingers open over it, and shuts into a fist on the blow
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 16) return;
      const hx = sx + dir * 8;
      if (st < FIN) {
        const k = ease((st - 74) / 12), grip = ease((st - (FIN - 5)) / 5) * 0.6;
        pool(ctx, hx, sy, 30, k);
        hand(ctx, hx, sy + 4, 34, { grip, arm: 0.45, rise: k, lean: -dir * 0.1, a: k });
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 30, ik, 47);
        hand(ctx, hx, sy + 4, 46, { grip: 1, arm: 0.25, lean: -dir * 0.1, a: 1 - ease((k - 0.55) / 0.45), mono: ik < 0.5 ? C.w : undefined });
        if (st === FIN) smoke(T.x, T.y, 24);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
