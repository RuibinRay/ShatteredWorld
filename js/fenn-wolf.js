'use strict';
// Shattered Worlds — Fenn's storm-wolf (the user, 2026-11-20: "Yes, do Fenn"; his story: "his lightning runs on four legs",
// and his look: "a snarling wolf made of violet lightning at his side"). Every move is the wolf: a running wolf of violet
// lightning drawn as crisp pixel art by js/pixel-kit.js (a hue-shifted violet palette, a selective outline), with a
// jointed gallop (shoulder, elbow, paw; hip, hock, paw; the body rises and falls with the stride) and live crackling
// arcs over its fur. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/isolde-falcon.js.
//   U      Chain Bolt: at every link of the chain a lightning wolf's head snaps its jaws on the target
//   S+U    Thunderclap: a great wolf's head snarls out of the ring of lightning round him
//   I      Thunder Wolf: the storm-wolf itself, running down its prey and biting
//   S+I    Hound's Leap: the wolf leaps beside him; where they land it howls
//   W+O    Storm Pack: two lightning wolves tear out along the ground instead of his afterimages
//   S+O    Wild Hunt: a small storm-wolf trots at his heel
//   O      Storm Pelt: the storm-wolf comes down in a lightning strike and stands behind him
//   W+I    Pack Howl: the storm-eye of Vharra opens in the sky, the wolves run; at the finishing blow (js/ult-grand.js)
//          the storm-wolf howls in close-up and the pack runs through the target
// SW.fennWolf.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Wolf = SW.Wolf;
  if (!N || !P || !CASTS || !PX || !Wolf || !CASTS.thunder_wolf) return;
  const FW = SW.fennWolf = { on: true };
  const isF = g => !!(FW.on && g && g.state && g.state.hero === 'fenn');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // violet lightning: deep indigo shadow up to white-lilac light
  const PAL = ['#120a2a', '#2a1660', '#47289a', '#6e46d6', '#a78bfa', '#d6c8ff', '#ffffff'];
  const C = { d0: PAL[0], d1: PAL[1], m: PAL[2], l: PAL[3], v: PAL[4], hi: PAL[5], w: PAL[6] };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, r, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), r || 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const limb = (c, pts, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); };

  // ---------- the wolf, side view: (0, 0) the ground under its middle, facing +x, s its length nose to rump ----------
  // o = { run 0-1 (stride phase), leap (legs stretched out), howl (head up, mouth open), snarl 0-1, sit, t }
  function wolfVec(c, s, o) {
    const ph = (o.run || 0) * PI * 2, g = Math.sin(ph), h = Math.cos(ph), t = o.t || 0;
    const bounce = o.leap || o.sit ? 0 : -Math.abs(Math.sin(ph)) * s * 0.05;
    c.translate(0, bounce + s * 0.08);   // (the body sits 0.08 lower than the original sketch: shorter legs, like a real wolf)
    // legs: a two-joint chain each; far pair first (darker, half a stride on)
    const leg = (hx, hy, a, k, L, col, w) => { const ex = hx + Math.sin(a) * L * 0.5, ey = hy + Math.cos(a) * L * 0.5, px = ex + Math.sin(a + k) * L * 0.5, py = Math.min(-bounce - s * 0.08, ey + Math.cos(a + k) * L * 0.5); ell(c, hx + Math.sin(a) * L * 0.12, hy + Math.cos(a) * L * 0.12, w * 0.95, w * 1.4, -a, col); limb(c, [[hx, hy], [ex, ey], [px, py]], w, col); poly(c, [[px - s * 0.03, py], [px + s * 0.06, py], [px + s * 0.05, py - s * 0.03]], col); };
    const legs = (far) => {
      const q = far ? 0.9 : 0, gg = Math.sin(ph + q), hh = Math.cos(ph + q), col = far ? C.d1 : C.m, w = s * (far ? 0.07 : 0.085);
      if (o.leap) { leg(s * 0.2, -s * 0.42, 1.25, -0.2, s * 0.36, col, w); leg(-s * 0.26, -s * 0.44, -1.2, 0.3, s * 0.38, col, w * 1.15); return; }
      if (o.sit) { leg(s * 0.22, -s * 0.42, 0.05, 0, s * 0.36, col, w); leg(-s * 0.22, -s * 0.3, -1.4, 2.2, s * 0.3, col, w * 1.15); return; }
      leg(s * 0.2, -s * 0.42, 0.75 * gg, -0.6 * Math.max(0, -hh), s * 0.36, col, w);            // front: reach, then fold under
      leg(-s * 0.26, -s * 0.44, -0.75 * gg + 0.15, 0.6 * Math.max(0, hh) + 0.2, s * 0.38, col, w * 1.15);   // hind: push, hock bent back
    };
    legs(true);
    // the tail: a bush of lightning, streaming back and up
    const tw = Math.sin(t * 0.3) * s * 0.04;
    poly(c, [[-s * 0.32, -s * 0.6], [-s * 0.55, -s * 0.72 + tw], [-s * 0.72, -s * 0.66 + tw], [-s * 0.62, -s * 0.6 + tw], [-s * 0.78, -s * 0.56 + tw], [-s * 0.56, -s * 0.52], [-s * 0.34, -s * 0.5]], C.m);
    poly(c, [[-s * 0.34, -s * 0.58], [-s * 0.56, -s * 0.68 + tw], [-s * 0.66, -s * 0.64 + tw], [-s * 0.5, -s * 0.56]], C.l);
    // body: deep chest, tucked belly, lit along the back
    const sit = o.sit ? 1 : 0;
    // (darker underneath, bright along the back: more value range, so it glows)
    poly(c, [[s * 0.36, -s * 0.56], [s * 0.16, -s * 0.72], [-s * 0.08, -s * 0.67 + sit * 0.02 * s], [-s * 0.36, -s * 0.62 + sit * s * 0.18], [-s * 0.38, -s * 0.4 + sit * s * 0.4], [-s * 0.08, -s * 0.38 + sit * s * 0.2], [s * 0.28, -s * 0.3]], C.l);
    poly(c, [[s * 0.3, -s * 0.6], [s * 0.14, -s * 0.71], [-s * 0.08, -s * 0.66], [-s * 0.33, -s * 0.6 + sit * s * 0.18], [-s * 0.1, -s * 0.57], [s * 0.14, -s * 0.6]], C.v);
    poly(c, [[s * 0.2, -s * 0.68], [-s * 0.08, -s * 0.66], [-s * 0.28, -s * 0.61 + sit * s * 0.18], [-s * 0.06, -s * 0.63]], C.hi);
    poly(c, [[s * 0.3, -s * 0.36], [s * 0.06, -s * 0.36], [-s * 0.22, -s * 0.42 + sit * s * 0.3], [s * 0.04, -s * 0.44], [s * 0.26, -s * 0.46]], C.m);
    limb(c, [[s * 0.24, -s * 0.5], [s * 0.1, -s * 0.56], [0, -s * 0.48], [-s * 0.14, -s * 0.55], [-s * 0.27, -s * 0.49 + sit * s * 0.2]], Math.max(1, s * 0.025), C.hi);   // a vein of lightning
    // the mane: a crest of spiky lightning over the neck and shoulders
    for (let i = 0; i < 6; i++) { const u = i / 5, bx = s * (0.4 - u * 0.42), by = -s * (0.74 - u * 0.06), len = s * (0.16 - u * 0.06) * (1 + 0.25 * Math.sin(t * 0.9 + i * 2)); poly(c, [[bx + s * 0.05, by + s * 0.03], [bx - len * 0.6, by - len], [bx - s * 0.05, by + s * 0.04]], i % 2 ? C.v : C.hi); }
    // head: skull, long snout, ears back; the jaw drops for a snarl, a bite or a howl
    const howl = o.howl ? 1 : 0, sn = clamp01(Math.max(o.snarl || 0, howl));
    c.save(); c.translate(s * 0.38, -s * 0.62); c.rotate(-0.75 * howl + (o.leap ? -0.15 : 0)); c.scale(1.25, 1.25);   // a big wolf head
    poly(c, [[-s * 0.04, -s * 0.12], [s * 0.04, -s * 0.28], [s * 0.1, -s * 0.12]], C.l);   // far ear
    poly(c, [[-s * 0.06, s * 0.04], [-s * 0.04, -s * 0.1], [s * 0.12, -s * 0.12], [s * 0.36, -s * 0.04], [s * 0.38, s * 0.01], [s * 0.18, s * 0.03], [s * 0.06, s * 0.1]], C.l);   // skull and snout
    poly(c, [[s * 0.04, -s * 0.11], [s * 0.3, -s * 0.05], [s * 0.12, -s * 0.07]], C.hi);   // light down the brow
    c.save(); c.translate(s * 0.12, s * 0.04); c.rotate(sn * 0.6);
    poly(c, [[0, 0], [s * 0.22, -s * 0.01], [s * 0.2, s * 0.04], [s * 0.02, s * 0.06]], C.m);   // lower jaw
    if (sn > 0.15) { c.fillStyle = C.w; for (let i = 0; i < 3; i++) poly(c, [[s * (0.08 + i * 0.05), -s * 0.005], [s * (0.1 + i * 0.05), -s * 0.005], [s * (0.09 + i * 0.05), -s * 0.04]], C.w); }
    c.restore();
    if (sn > 0.15) { poly(c, [[s * 0.14, s * 0.03], [s * 0.36, s * 0.01], [s * 0.3, s * 0.04 + sn * s * 0.12]], C.d0); for (let i = 0; i < 3; i++) poly(c, [[s * (0.2 + i * 0.05), s * 0.025], [s * (0.22 + i * 0.05), s * 0.025], [s * (0.21 + i * 0.05), s * 0.06]], C.w); }
    poly(c, [[s * 0.34, -s * 0.03], [s * 0.4, -s * 0.01], [s * 0.36, s * 0.02]], C.d0);   // nose
    poly(c, [[-s * 0.02, -s * 0.1], [s * 0.0, -s * 0.3], [s * 0.08, -s * 0.11]], C.v);   // near ear
    poly(c, [[s * 0.11, -s * 0.07], [s * 0.18, -s * 0.06], [s * 0.15, -s * 0.04]], C.w);   // the glowing eye
    c.restore();
    legs(false);
  }
  // crackle: a few live arcs over the wolf, drawn after the sprite (1 px, white and lilac)
  function crackle(ctx, x, y, s, dir, t, n) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (n || 2); i++) {
      const seed = Math.floor(t / 2) * 7 + i * 13, r = k => { const v = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
      let px = x + dir * s * (r(1) * 0.7 - 0.35), py = y - s * (0.45 + r(2) * 0.3);
      ctx.fillStyle = i % 2 ? '#d6c8ff' : '#ffffff';
      for (let k = 0; k < 6; k++) { const nx = px + dir * (r(3 + k) * 6 - 3), ny = py + (r(9 + k) * 6 - 3); art.line(ctx, ctx.fillStyle, Math.round(px), Math.round(py), Math.round(nx), Math.round(ny), 1); px = nx; py = ny; }
    }
    ctx.restore();
  }
  // the wolf as a crisp sprite with its arcs: (x, y) the ground under it
  function wolf(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x, y - s * 0.5, s * 2.4, s * 1.8, c => { c.translate(0, s * 0.5); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); wolfVec(c, s, o); }, { pal: PAL, alpha: o.a });
    if (o.a === undefined || o.a > 0.4) crackle(ctx, x, y, s, dir, o.t || 0, o.arcs);
  }
  FW.wolf = wolf;
  // a wolf's head alone (for the snaps and the close-up): (x, y) the back of the skull
  function head(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x + dir * s * 0.2, y, s * 1.3, s * 1.1, c => { c.translate(-s * 0.2 * (dir < 0 ? -1 : 1), 0); c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); c.translate(-s * 0.38, s * 0.62); wolfHeadOnly(c, s, o); }, { pal: PAL, alpha: o.a });
  }
  function wolfHeadOnly(c, s, o) {   // the mane and head of wolfVec, without body and legs
    const t = o.t || 0;
    for (let i = 0; i < 5; i++) { const u = i / 4, bx = s * (0.4 - u * 0.3), by = -s * (0.74 - u * 0.1), len = s * (0.18 - u * 0.05) * (1 + 0.25 * Math.sin(t * 0.9 + i * 2)); poly(c, [[bx + s * 0.05, by + s * 0.03], [bx - len * 0.6, by - len], [bx - s * 0.05, by + s * 0.04]], i % 2 ? C.v : C.hi); }
    poly(c, [[s * 0.2, -s * 0.5], [s * 0.4, -s * 0.74], [s * 0.5, -s * 0.5]], C.m);   // the neck
    const sn = clamp01(o.snarl === undefined ? 1 : o.snarl);
    c.save(); c.translate(s * 0.38, -s * 0.62);
    poly(c, [[-s * 0.04, -s * 0.12], [s * 0.04, -s * 0.28], [s * 0.1, -s * 0.12]], C.l);
    poly(c, [[-s * 0.06, s * 0.04], [-s * 0.04, -s * 0.1], [s * 0.12, -s * 0.12], [s * 0.36, -s * 0.04], [s * 0.38, s * 0.01], [s * 0.18, s * 0.03], [s * 0.06, s * 0.1]], C.l);
    poly(c, [[s * 0.04, -s * 0.11], [s * 0.3, -s * 0.05], [s * 0.12, -s * 0.07]], C.hi);
    c.save(); c.translate(s * 0.12, s * 0.04); c.rotate(sn * 0.7);
    poly(c, [[0, 0], [s * 0.22, -s * 0.01], [s * 0.2, s * 0.04], [s * 0.02, s * 0.06]], C.m);
    for (let i = 0; i < 3; i++) poly(c, [[s * (0.08 + i * 0.05), -s * 0.005], [s * (0.1 + i * 0.05), -s * 0.005], [s * (0.09 + i * 0.05), -s * 0.045]], C.w);
    c.restore();
    poly(c, [[s * 0.14, s * 0.03], [s * 0.36, s * 0.01], [s * 0.3, s * 0.04 + sn * s * 0.14]], C.d0);
    for (let i = 0; i < 3; i++) poly(c, [[s * (0.2 + i * 0.05), s * 0.025], [s * (0.22 + i * 0.05), s * 0.025], [s * (0.21 + i * 0.05), s * 0.065]], C.w);
    poly(c, [[s * 0.34, -s * 0.03], [s * 0.4, -s * 0.01], [s * 0.36, s * 0.02]], C.d0);
    poly(c, [[-s * 0.02, -s * 0.1], [s * 0.0, -s * 0.3], [s * 0.08, -s * 0.11]], C.v);
    poly(c, [[s * 0.11, -s * 0.07], [s * 0.18, -s * 0.06], [s * 0.15, -s * 0.04]], C.w);
    c.restore();
  }
  FW.head = head;

  // ================= I: Thunder Wolf (and the wolves of Pack Howl) =================
  const _wd = Wolf.prototype.draw;
  Wolf.prototype.draw = function (ctx, cam) {
    if (!FW.on || !this.fenn) return _wd.apply(this, arguments);
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), air = !this.onGround;
    const bite = this.cd > 8 ? (this.cd - 8) / 8 : 0;   // it just bit: jaws open, lunging
    wolf(ctx, x + this.face * bite * 4, y, this.big || 34, this.face, { run: (this.t % 12) / 12, leap: air, snarl: Math.max(bite, 0.25), t: this.t, rot: air ? SW.clamp(this.vy * 0.06, -0.4, 0.4) : 0 });
  };
  const _tw = CASTS.thunder_wolf;
  CASTS.thunder_wolf = function (p, z) {
    const n0 = z.shots.length, r = _tw.apply(this, arguments);
    if (isF(G)) z.shots.slice(n0).forEach(s => { if (s instanceof Wolf) s.fenn = true; });
    return r;
  };

  // ================= U: Chain Bolt: a wolf's head snaps at every link =================
  const _cb = CASTS.chain_bolt;
  CASTS.chain_bolt = function (p, z) {
    if (!isF(G)) return _cb.apply(this, arguments);
    const ends = [], _bolt = fx.bolt;
    fx.bolt = function (x0, y0, x1, y1) { ends.push([x0, y0, x1, y1]); return _bolt.apply(this, arguments); };
    let r; try { r = _cb.apply(this, arguments); } finally { fx.bolt = _bolt; }
    ends.forEach((e, i) => {
      const dir = e[2] >= e[0] ? 1 : -1;
      const v = new Vis(e[2], e[3], 14, (ctx, sx, sy, t) => { if (t < 0) return; const k = t / 14; head(ctx, sx - dir * 26 + dir * k * 6, sy - 4, 34, dir, { snarl: t < 5 ? 1 : Math.max(0, 1 - (t - 5) / 3), t, a: 1 - ease((k - 0.6) / 0.4) }); });
      v.t = -i * 2;   // one after another down the chain
      z.shots.push(v);
      for (let k = 1; k < 4; k++) { const u = k / 4; part(e[0] + (e[2] - e[0]) * u, e[1] + (e[3] - e[1]) * u, '#d6c8ff', 0, -0.3, 14, 2); }   // sparks along the leap
    });
    return r;
  };

  // ================= S+U: Thunderclap: a great wolf's head snarls in the ring =================
  const _tc = CASTS.thunderclap;
  CASTS.thunderclap = function (p, z) {
    const r = _tc.apply(this, arguments);
    if (!isF(G)) return r;
    const dir = p.face;
    z.shots.push(new Vis(p.x, p.y, 22, (ctx, sx, sy, t) => {
      const k = t / 22, up = ease(t / 5);
      head(ctx, sx - dir * 26, sy - 36 - up * 8, 58, dir, { snarl: t < 14 ? 1 : 1 - (t - 14) / 8, rot: -0.25, t, a: 1 - ease((k - 0.65) / 0.35) });
      if (t < 12) crackle(ctx, sx, sy - 10, 60, dir, t, 3);
    }));
    return r;
  };

  // ================= S+I: Hound's Leap: the wolf leaps with him, and howls where they land =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.fenn;
  if (BU && BU.cast) {
    const _hl = BU.cast;
    BU.cast = function (p, z) {
      const r = _hl.apply(this, arguments);
      if (!isF(G)) return r;
      const dir = p.face;
      let landed = -1;
      z.shots.push(new Vis(p.x, p.y, 80, (ctx, sx, sy, t) => {
        if (landed < 0) wolf(ctx, Math.round(p.x - G.cam.x) - dir * 18, Math.round(p.y - G.cam.y) + 4, 30, dir, { leap: true, snarl: 0.6, t, rot: SW.clamp(p.vy * 0.07, -0.5, 0.5) });
        else { const k = (t - landed) / 26; wolf(ctx, sx, sy, 34, dir, { sit: true, howl: true, t, a: 1 - ease((k - 0.7) / 0.3), arcs: 3 }); }
      }, v => {
        if (landed < 0 && v.t > 6 && p.onGround) { landed = v.t; v.x = p.x - dir * 22; v.y = p.y; v.life = v.t + 26; fx.ring(p.x, p.y - 20, '#d6c8ff', 6, 70, 18); }
        if (p.dead) v.gone = true;
      }));
      return r;
    };
  }

  // ================= W+O: Storm Pack: lightning wolves instead of his afterimages =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.fenn;
  if (SIG && SIG.cast) {
    const _sp = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _sp.apply(this, arguments);
      if (!isF(G)) return r;
      const dir = p.face, n0 = z.shots.length, made = new Set();
      z.shots.push(new Vis(p.x, p.y, 14, null, () => {   // dress each runner as it appears
        const zs = G.zone && G.zone.shots; if (!zs) return;
        zs.forEach(s => {
          if (made.has(s) || !s.tick || s.paint || s.life !== 34 || !/ghost/.test(String(s.tick))) return;
          made.add(s);
          const tk = s.tick;
          s.tick = function () { const L = fx.list, m = L.length, res = tk.apply(this, arguments); for (let i = L.length - 1; i >= m; i--) if (L[i].k === 'g') L.splice(i, 1); return res; };   // no afterimages
          s.paint = (ctx, sx, sy, q) => wolf(ctx, sx, sy, 30, dir, { run: (q.t % 10) / 10, snarl: 0.5, t: q.t });
        });
      }));
      void n0;
      return r;
    };
  }

  // ================= S+O and O: Wild Hunt and Storm Pelt =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face;
    if (p.modeT > 0 && !front) {   // a small storm-wolf at his heel, running when he runs
      const fade = Math.min(1, p.modeT / 30), moving = Math.abs(p.vx) > 0.5;
      wolf(ctx, sx - d * 22, sy, 20, d, moving ? { run: (p.t % 10) / 10, t: p.t, a: fade } : { sit: true, t: p.t, a: fade, snarl: (p.t % 180) < 20 ? 1 : 0 });
    }
    if (p.awakeT > 0 && !front) {   // the storm-wolf stands behind him
      const fade = Math.min(1, p.awakeT / 30);
      wolf(ctx, sx - d * 42, sy, 50, d, { sit: true, t: p.t, a: fade * 0.95, snarl: (p.t % 200) < 18 ? 1 : 0.2, howl: (p.t % 400) < 30, arcs: 3 });
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isF(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isF(g || this.G) && z && z.shots && !this.dead && this.awakeT > a0 + 60) {   // Storm Pelt: the wolf comes down in a lightning strike
      const d = this.face, x = this.x - d * 42, y = this.y;
      fx.bolt(x, y - 200, x, y - 10, '#ffffff'); fx.bolt(x + 4, y - 180, x - 2, y - 20, '#a78bfa');
      z.shots.push(new Vis(x, y, 26, (ctx, sx, sy, t) => wolf(ctx, sx, sy, 50 + (1 - ease(t / 10)) * 30, d, { sit: true, howl: true, t, a: ease(t / 4), arcs: 4 })));
    }
    return r;
  };

  // ================= W+I: Pack Howl =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const n0 = z.shots.length, r = _uf.apply(this, arguments);
    if (!isF(g)) return r;
    z.shots.slice(n0).forEach(s => { if (s instanceof Wolf) { s.fenn = true; s.big = 40; } });
    if (p.st === 6) {
      const eye = new Vis(p.x, p.y, 70, (ctx, sx, sy, t) => {   // the storm-eye of Vharra opens over the arena
        const k = ease(t / 12) * (1 - ease((t - 58) / 12)), cx = SW.W / 2, cy = 46;
        ctx.save(); ctx.globalAlpha = 0.85 * k;
        for (let i = 0; i < 4; i++) { ctx.strokeStyle = i % 2 ? '#47289a' : '#2a1660'; ctx.lineWidth = 6 - i; ctx.beginPath(); ctx.ellipse(cx, cy, 30 + i * 22 + Math.sin(t * 0.1 + i) * 2, 10 + i * 7, 0, t * 0.02 * (i % 2 ? 1 : -1), t * 0.02 * (i % 2 ? 1 : -1) + PI * 1.6); ctx.stroke(); }
        ctx.fillStyle = '#d6c8ff'; ctx.beginPath(); ctx.ellipse(cx, cy, 14 * k, 6 * k, 0, 0, PI * 2); ctx.fill();
        ctx.fillStyle = '#120a2a'; ctx.beginPath(); ctx.ellipse(cx, cy, 3, 6 * k, 0, 0, PI * 2); ctx.fill();
        ctx.restore();
      });
      eye.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };   // in screen space, over the arena
      eye._ugS = 1; z.shots.push(eye);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow: the storm-wolf howls in close-up behind the target, then the pack runs straight through it
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('fenn') : null, FIN = pl ? pl.fin : 64, BU = pl ? Math.max(74, FIN - 30) : 30;
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU - 2 || st > FIN + 16) return;
      if (st < FIN - 6) {   // the howl, big, just behind the target
        const k = ease((st - (BU - 2)) / 8);
        head(ctx, sx - dir * 74, sy - 24, 120, dir, { snarl: 0.55 + 0.45 * Math.sin(st * 0.35), rot: -0.12, t: st, a: k });   // its head fills the view beside the target, snarling
        crackle(ctx, sx - dir * 40, sy + 30, 120, dir, st, 3);
      } else {   // the pack: three wolves run through, one after the other
        for (let i = 0; i < 3; i++) {
          const k = (st - (FIN - 6) - i * 3) / 16; if (k < 0 || k > 1) continue;
          wolf(ctx, sx - dir * 120 + dir * 240 * k, sy - i * 4, 44 - i * 4, dir, { run: ((st + i * 3) % 10) / 10, snarl: 0.8, t: st + i, a: 1 - ease((k - 0.8) / 0.2) });
        }
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
