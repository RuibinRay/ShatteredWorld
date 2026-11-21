'use strict';
// Shattered Worlds — Tessa's clock (the user, 2026-11-20: "Tessa's clock"). Her story: "came out of the tear unstuck
// in time"; "she has lived this year more times than she will say"; "a pocket watch held up on its chain, clock hands
// glowing round her"; she wrote tomorrow's tides on a slate and was never wrong. So her things are brass clockwork:
// ornate clock hands with spade tips, dials with tick marks, gears, a brass alarm clock, and the pocket watch. Brass,
// auburn and cream. Crisp pixel art through js/pixel-kit.js; pieces drawn often are drawn once and reused.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/hex-echo.js.
//   J      a clock hand sweeps through each hit
//   U      Stopwatch: the dart is an ornate clock hand; whoever it stops wears a small dial with its hands stopped
//   S+U    Rewind: small dials along the way she came, their hands running backward
//   I      Slow Hour: the bubble is a clock face, ticks round its rim, a second hand that ticks; it ends with a chime
//   S+I    Second Hand: a great brass hand sweeps over a ring of tick marks and strikes the hour where it lands
//   W+O    Time Bomb: a brass alarm clock on the floor, its bells shaking each time it rings
//   S+O    Haste: small hands spin round her, a gear ticks at her waist   O  Clockwork Form: gears at her back, the
//          watch open and glowing on its chain (both small)
//   W+I    The Stopped Clock: the world goes grey and only she stays in colour; in the finish (js/ult-grand.js) her
//          pocket watch hangs beside the target, its hands stop, then one tick: colour and every cut come back at once
// SW.tessaClock.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !CASTS || !CASTS.stopwatch || !CASTS.rewind || !SW.data.heroes.tessa) return;
  const TC = SW.tessaClock = { on: true };
  const isT = g => !!(TC.on && g && g.state && g.state.hero === 'tessa');
  const PI = Math.PI, Vis = N.Vis, part = N.part, R = Math.round, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };

  // ink, bronze, dark brass, brass, bright brass, gold glow, cream, white, auburn, pale auburn, steel
  const PAL = ['#2a1c12', '#5a4020', '#8a6a28', '#d9b45a', '#f0d890', '#ffd24a', '#fff3d8', '#ffffff', '#e8a090', '#ffe4d8', '#8a8e9e'];
  const C = { k: PAL[0], bz: PAL[1], b0: PAL[2], b1: PAL[3], b2: PAL[4], gl: PAL[5], cr: PAL[6], w: PAL[7], au: PAL[8], pa: PAL[9], st: PAL[10] };
  const OUT = '#2a1c12';
  const kept = new Map();
  function stamp(ctx, key, x, y, w, h, draw, a) {
    let cv = kept.get(key);
    if (!cv) {
      w = 2 * Math.ceil(w / 2); h = 2 * Math.ceil(h / 2);
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const drop = () => { if (kept.get(key) === cv) kept.delete(key); };   // a canvas the browser drops while the tab is hidden comes back blank: draw it again
      cv.addEventListener('contextlost', drop); cv.addEventListener('contextrestored', drop);
      PX.sprite(cv.getContext('2d'), w / 2, h / 2, w, h, draw, { pal: PAL, outline: OUT });
      if (kept.size > 400) kept.clear();
      kept.set(key, cv);
    }
    ctx.save(); ctx.imageSmoothingEnabled = false; if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    ctx.drawImage(cv, R(x) - cv.width / 2, R(y) - cv.height / 2);
    ctx.restore();
  }

  // ================= a clock hand: the pivot at (0, 0), pointing +x, L long =================
  function handVec(c, L, glow) {
    const w = Math.max(1.2, L * 0.045);
    ell(c, -L * 0.18, 0, L * 0.07, L * 0.07, C.b0); ell(c, -L * 0.18, 0, L * 0.035, L * 0.035, C.k);   // the counterweight, pierced
    poly(c, [[-L * 0.14, -w * 0.7], [L * 0.62, -w * 0.5], [L * 0.62, w * 0.5], [-L * 0.14, w * 0.7]], C.b1);   // the shaft
    poly(c, [[-L * 0.14, -w * 0.7], [L * 0.62, -w * 0.5], [L * 0.62, 0], [-L * 0.14, 0]], C.b2);
    poly(c, [[L * 0.6, 0], [L * 0.72, -L * 0.09], [L * 0.86, -L * 0.05], [L, 0], [L * 0.86, L * 0.05], [L * 0.72, L * 0.09]], glow ? C.gl : C.b1);   // the spade
    ell(c, L * 0.76, 0, L * 0.035, L * 0.03, C.k);   // its piercing
    poly(c, [[L * 0.6, 0], [L * 0.72, -L * 0.09], [L * 0.86, -L * 0.05], [L, 0]], C.b2);
    ell(c, 0, 0, L * 0.08 + 1, L * 0.08 + 1, C.b1); ell(c, 0, 0, L * 0.04 + 0.5, L * 0.04 + 0.5, C.gl);   // the boss
  }
  function hand(ctx, x, y, L, ang, glow, a) { const rq = ((R(ang / (PI / 12)) % 24) + 24) % 24; stamp(ctx, 'hand|' + L + '|' + rq + '|' + (glow ? 1 : 0), x, y, L * 2.2 + 8, L * 2.2 + 8, c => { c.rotate(rq * PI / 12); handVec(c, L, glow); }, a); }
  // a dial: rim, cream face, twelve ticks (the quarters bold), r its radius; hands drawn separately
  function dialVec(c, r) {
    ell(c, 0, 0, r, r, C.b0); ell(c, 0, 0, r - Math.max(1, r * 0.1), r - Math.max(1, r * 0.1), C.b1); ell(c, 0, 0, r * 0.82, r * 0.82, C.cr);
    ell(c, -r * 0.2, -r * 0.25, r * 0.4, r * 0.3, C.w);
    for (let i = 0; i < 12; i++) { const a = i * PI / 6, q = i % 3 === 0, r0 = r * (q ? 0.56 : 0.66), r1 = r * 0.78, w = q ? Math.max(1, r * 0.07) : Math.max(0.6, r * 0.035); poly(c, [[Math.cos(a) * r0 - Math.sin(a) * w, Math.sin(a) * r0 + Math.cos(a) * w], [Math.cos(a) * r1 - Math.sin(a) * w, Math.sin(a) * r1 + Math.cos(a) * w], [Math.cos(a) * r1 + Math.sin(a) * w, Math.sin(a) * r1 - Math.cos(a) * w], [Math.cos(a) * r0 + Math.sin(a) * w, Math.sin(a) * r0 - Math.cos(a) * w]], q ? C.k : C.bz); }
  }
  function dial(ctx, x, y, r, a) { stamp(ctx, 'dial|' + r, x, y, r * 2 + 6, r * 2 + 6, c => dialVec(c, r), a); }
  // two hands on a dial: hour and minute angles (radians, 0 = 12 o'clock)
  function hands(ctx, x, y, r, ah, am, glow) { hand(ctx, x, y, R(r * 0.55), ah - PI / 2, false); hand(ctx, x, y, R(r * 0.78), am - PI / 2, glow); }
  function clock(ctx, x, y, r, ah, am, a, glow) { dial(ctx, x, y, r, a); if (a === undefined || a > 0.3) hands(ctx, x, y, r, ah, am, glow); }
  // a gear: n teeth, r its radius, turned by rot
  function gearVec(c, r, n, rot) {
    const pts = []; for (let i = 0; i < n * 4; i++) { const a = rot + i / (n * 4) * PI * 2, rr = (i % 4 === 1 || i % 4 === 2) ? r : r * 0.78; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    poly(c, pts, C.b1); ell(c, 0, 0, r * 0.62, r * 0.62, C.b0); ell(c, 0, 0, r * 0.5, r * 0.5, C.b1);
    for (let i = 0; i < 4; i++) { const a = rot + i * PI / 2 + PI / 4; ell(c, Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3, r * 0.1, r * 0.1, C.b0); }
    ell(c, 0, 0, r * 0.14, r * 0.14, C.k); ell(c, -r * 0.3, -r * 0.3, r * 0.15, r * 0.1, C.b2);
  }
  function gear(ctx, x, y, r, n, t, a) { const q = ((t % 8) + 8) % 8; stamp(ctx, 'gear|' + r + '|' + n + '|' + q, x, y, r * 2 + 6, r * 2 + 6, c => gearVec(c, r, n, q / 8 * PI * 2 / n), a); }
  // the brass alarm clock: (0, 0) its foot, s its height; ring = the hammer and bells shake
  function alarmVec(c, s, ring) {
    const sh = ring ? s * 0.05 : 0;
    for (const d of [-1, 1]) { poly(c, [[d * s * 0.2, 0], [d * s * 0.32, 0], [d * s * 0.26, -s * 0.16]], C.b0); }   // legs
    for (const d of [-1, 1]) { const bx = d * s * 0.3 + (ring ? (d > 0 ? sh : -sh) : 0); ell(c, bx, -s * 0.82, s * 0.17, s * 0.13, C.b1); ell(c, bx - s * 0.04, -s * 0.86, s * 0.08, s * 0.05, C.b2); poly(c, [[bx - s * 0.17, -s * 0.78], [bx + s * 0.17, -s * 0.78], [bx + s * 0.17, -s * 0.74], [bx - s * 0.17, -s * 0.74]], C.b0); }   // the bells
    poly(c, [[-s * 0.02, -s * 0.84], [s * 0.02, -s * 0.84], [s * 0.02 + (ring ? Math.sin(sh * 50) * s * 0.1 : 0), -s * 0.98], [-s * 0.02 + (ring ? Math.sin(sh * 50) * s * 0.1 : 0), -s * 0.98]], C.b0);   // the hammer
    ell(c, 0, -s * 0.42, s * 0.38, s * 0.38, C.b0); ell(c, 0, -s * 0.42, s * 0.34, s * 0.34, C.b1); ell(c, 0, -s * 0.42, s * 0.27, s * 0.27, C.cr);   // the body and face
    ell(c, -s * 0.1, -s * 0.52, s * 0.1, s * 0.07, C.w);
    for (let i = 0; i < 12; i++) { const a = i * PI / 6; ell(c, Math.cos(a) * s * 0.21, -s * 0.42 + Math.sin(a) * s * 0.21, s * (i % 3 ? 0.012 : 0.025), s * (i % 3 ? 0.012 : 0.025), C.k); }
  }
  // the pocket watch, open: (0, 0) the dial's middle, r its radius; the lid open to the left, the chain up
  function watchVec(c, r, glow) {
    for (let i = 0; i < 6; i++) ell(c, r * 0.1 + i * r * 0.14, -r * 1.3 - i * r * 0.22, r * 0.09, r * 0.06, i % 2 ? C.b1 : C.b2);   // the chain
    poly(c, [[-r * 0.14, -r * 1.02], [r * 0.14, -r * 1.02], [r * 0.12, -r * 1.24], [-r * 0.12, -r * 1.24]], C.b1); ell(c, 0, -r * 1.28, r * 0.13, r * 0.08, C.b2);   // the crown
    ell(c, -r * 1.7, -r * 0.05, r * 0.82, r, C.b0); ell(c, -r * 1.7, -r * 0.05, r * 0.68, r * 0.86, C.b1); ell(c, -r * 1.76, -r * 0.2, r * 0.4, r * 0.45, C.b2);   // the open lid
    for (let i = 0; i < 3; i++) ell(c, -r * 1.7, -r * 0.05, r * (0.5 - i * 0.13), r * (0.64 - i * 0.16), i % 2 ? C.b1 : C.b0);   // engraving
    poly(c, [[-r * 0.95, -r * 0.15], [-r * 0.9, r * 0.15], [-r * 1.0, r * 0.12], [-r * 1.05, -r * 0.12]], C.b0);   // the hinge
    ell(c, 0, 0, r * 1.06, r * 1.06, C.b0); ell(c, 0, 0, r, r, C.b1);
    c.save(); dialVec(c, r * 0.9); c.restore();
    if (glow) ell(c, 0, 0, r * 0.25, r * 0.25, C.gl);
  }
  Object.assign(TC, { hand, dial, clock, gear, PAL });
  const sparks = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 === 0 ? '#ffd24a' : i % 3 === 1 ? '#fff3d8' : '#e8a090', rand(-pw, pw), -rand(0.3, pw), 20, 2, 0.06); };
  // tick marks on an arc: a ring of the hour round (x, y)
  function tickRing(ctx, x, y, r, a0, a1, k) {
    for (let i = 0; i < 60; i++) { const a = i / 60 * PI * 2; if (!within(a, a0, a1)) continue; const q = i % 5 === 0, r0 = r - (q ? 7 : 3); ctx.save(); ctx.globalAlpha *= k; art.line(ctx, q ? '#ffd24a' : '#fff3d8', R(x + Math.cos(a) * r0), R(y + Math.sin(a) * r0), R(x + Math.cos(a) * r), R(y + Math.sin(a) * r), q ? 2 : 1); ctx.restore(); }
  }
  const within = (a, a0, a1) => { const n = x => ((x % (PI * 2)) + PI * 2) % (PI * 2); const A = n(a - a0), B = n(a1 - a0); return A <= B; };

  // ================= U: Stopwatch: the dart is a clock hand; the stopped wear a dial =================
  const darts = [];
  function stoppedDial(z, e) {
    z.shots.push(new Vis(e.x, e.y, 150, (ctx, sx, sy, t) => { if (e.dead) return; const k = Math.min(1, t / 4, (150 - t) / 10); clock(ctx, sx, sy - (e.h || 34) - 12, 8, 3.1, 0, k); }, v => { if (!e.dead) { v.x = e.x; v.y = e.y; } }));
  }

  // ================= S+U: Rewind: dials along the way she came, hands running backward =================
  const _rw = CASTS.rewind;
  CASTS.rewind = function (p, z) {
    const path = (p.hist || []).map(h => [h.x, h.y]), x1 = p.x, y1 = p.y, r = _rw.apply(this, arguments);
    if (!isT(G) || path.length < 2 || (p.x === x1 && p.y === y1)) return r;
    const pts = path.concat([[x1, y1]]).filter((q, i, a) => i % 3 === 0 || i === a.length - 1);
    z.shots.push(new Vis(0, 0, 24, (ctx, sx, sy, t) => {
      pts.forEach((q, i) => { const u = 1 - i / Math.max(1, pts.length - 1), k = clamp01((t - u * 8) / 3) * (1 - ease((t - 12 - u * 8) / 10)); if (k <= 0) return; const x = q[0] - G.cam.x, y = q[1] - G.cam.y - 24; clock(ctx, x, y, 7, -t * 0.6 - i, -t * 1.4 - i * 2, k); });   // backward
      for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; ctx.save(); ctx.globalAlpha = 0.5 * (1 - t / 24); art.line(ctx, '#e8a090', R(a[0] - G.cam.x), R(a[1] - G.cam.y - 24), R(b[0] - G.cam.x), R(b[1] - G.cam.y - 24), 1); ctx.restore(); }
    }));
    return r;
  };

  // ================= the Slow Hour field (heroes4.js keeps the class to itself): redrawn on its own prototype =================
  function adopt(s) {
    const proto = Object.getPrototypeOf(s), name = s.constructor && s.constructor.name;
    if (!proto || proto._tc || name !== 'Field' || s.r === undefined || typeof proto.draw !== 'function') return;
    proto._tc = 1; const od = proto.draw, ou = proto.update;
    proto.draw = function (ctx, cam) {
      if (!TC.on || !isT(G)) return od.apply(this, arguments);
      const x = R(this.x - cam.x), y = R(this.y - cam.y), r = this.r, t = this.t, k = Math.min(1, t / 6, (181 - t) / 6);
      ctx.save(); ctx.globalAlpha = 0.12 * k; ctx.fillStyle = '#fff3d8'; ctx.beginPath(); ctx.arc(x, y, r - 2, 0, PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.85 * k; art.ring(ctx, '#8a6a28', x, y, r); art.ring(ctx, '#d9b45a', x, y, r - 1); ctx.restore();
      tickRing(ctx, x, y, r - 2, 0, PI * 2 - 0.01, 0.8 * k);
      const step = Math.floor(t / 20), sec = step / 12 * PI * 2 - PI / 2, hr = t * 0.004 - PI / 2;   // the second hand ticks, slowly
      hand(ctx, x, y, R(r * 0.4), hr, false, k); hand(ctx, x, y, R(r * 0.78), sec, t % 20 < 3, k);
    };
    proto.update = function () { const r = ou.apply(this, arguments); if (TC.on && this.gone && !this._tcB) { this._tcB = 1; chime(this.x, this.y, this.r); } return r; };
  }
  function chime(x, y, r) {   // it ends with a chime: rings of brass go out, a bell sounds
    const f0 = SW.frame || 0; let n = 0;
    PX.over((ctx, cam) => {
      const t = Math.max(0, (SW.frame || 0) - f0); if (t > 18 || ++n > 50) return false;
      const sx = R(x - cam.x), sy = R(y - cam.y), a = 1 - t / 18;
      ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 3; i++) { const rr = r * 0.4 + t * 4 + i * 9; art.ring(ctx, i % 2 ? '#ffd24a' : '#fff3d8', sx, sy, R(rr)); } ctx.restore();
      tickRing(ctx, sx, sy, r + t * 3, 0, PI * 2 - 0.01, a);
    });
    sparks(x, y, 14, 3);
  }

  // ================= S+I: Second Hand =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.tessa;
  if (BU && BU.cast) {
    const _sh = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _sh.apply(this, arguments);
      if (!isT(G)) return r;
      const dir = p.face, L = 92, ang = t => -2.2 + Math.min(1, Math.max(0, t) / 16) * 2.9, v = z.shots.slice(n0).find(s => s.life === 22 && s.render);
      if (v) {
        v.tc = 1;
        v.render = (ctx, x, y, t) => {
          const a = ang(t), A = dir > 0 ? a : PI - a, k = t > 18 ? (22 - t) / 4 : 1;
          tickRing(ctx, x, y, L + 4, dir > 0 ? -2.3 : PI - 0.7, dir > 0 ? 0.8 : PI + 2.3, 0.9 * Math.min(1, t / 3) * k);   // the hour round it
          for (let i = 1; i < 4; i++) { const b = ang(t - i * 0.9), B = dir > 0 ? b : PI - b; ctx.save(); ctx.globalAlpha = (0.45 - i * 0.12) * k; art.line(ctx, '#ffe4d8', R(x + Math.cos(B) * L * 0.4), R(y + Math.sin(B) * L * 0.4), R(x + Math.cos(B) * L), R(y + Math.sin(B) * L), 2); ctx.restore(); }   // the blur behind it
          PX.sprite(ctx, x, y, L * 2.3, L * 2.3, c => { c.rotate(A); handVec(c, L, t >= 14); }, { pal: PAL, outline: OUT, alpha: k });
          if (t >= 16 && t < 20) { const ex = x + Math.cos(A) * L, ey = y + Math.sin(A) * L; ctx.save(); ctx.globalAlpha = 1 - (t - 16) / 4; art.line(ctx, '#ffd24a', R(ex - 8), R(ey), R(ex + 8), R(ey), 2); art.line(ctx, '#ffffff', R(ex), R(ey - 8), R(ex), R(ey + 8), 2); ctx.restore(); }   // it strikes the hour
        };
      }
      return r;
    };
  }

  // ================= W+O: Time Bomb: the alarm clock =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.tessa;
  if (SIG && SIG.cast) {
    const _tb = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _tb.apply(this, arguments);
      if (!isT(G)) return r;
      const s0 = z.shots.slice(n0).find(s => s.paint && s.life === 80);
      if (s0) {
        s0.tc = 1;
        s0.paint = (ctx, sx, sy, s) => {
          const ring = s.t % 20 < 5 || s.t > 70, j = ring ? R(Math.sin(s.t * 2.7) * 1) : 0;
          ctx.save(); ctx.globalAlpha = 0.22 + 0.12 * Math.sin(s.t * 0.5); art.ring(ctx, '#e8a090', sx, sy - 8, 48); ctx.restore();
          stamp(ctx, 'alarm|' + (ring ? 1 : 0), sx + j, sy - 11, 30, 30, c => { c.translate(0, 12); alarmVec(c, 22, ring); });
          const fy = sy - 20, a1 = s.t * 0.3, a2 = s.t * 0.05; art.line(ctx, '#2a1c12', sx + j, fy, R(sx + j + Math.cos(a1) * 4), R(fy + Math.sin(a1) * 4), 1); art.line(ctx, '#8a6a28', sx + j, fy, R(sx + j + Math.cos(a2) * 3), R(fy + Math.sin(a2) * 3), 1);
          if (ring) for (const d of [-1, 1]) art.line(ctx, '#ffd24a', sx + d * 10, sy - 30, sx + d * 14, sy - 34, 1);   // it rings
        };
      }
      return r;
    };
  }

  // ================= her shots =================
  function dress(z) {
    z.shots.forEach(s => {
      if (s.tc !== undefined) { if (!s._tcA) { s._tcA = 1; adopt(s); } return; }
      s.tc = 0; s._tcA = 1; adopt(s);
      if (s instanceof Proj && s.render && s.w === 12 && s.h === 6 && s.life === 44 && s.status && s.status.freeze) { s.tc = 1; darts.push(s); s.render = (ctx, x, y, q) => hand(ctx, x - (q.vx >= 0 ? 8 : -8), y, 18, Math.atan2(q.vy, q.vx), true); }
    });
    for (let i = darts.length - 1; i >= 0; i--) {   // a dart that ended early hit someone: they wear a stopped dial
      const s = darts[i]; if (!s.gone) continue; darts.splice(i, 1);
      if (s.t < 43) { const e = N.nearest ? N.nearest(z, s.x, s.y, 40) : null; if (e) stoppedDial(z, e); }
    }
  }

  // ================= W+I: the grey world (only she keeps her colour) =================
  const grey = TC.grey = { on: false, p: null, until: 0 };
  const greyLive = () => grey.on && grey.p && !grey.p.dead && (G.player === grey.p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === grey.p)));   // a match quit mid-ultimate must not leave the next one grey   // (exposed for testing)
  function greyRect(ctx, x, y, w, h, a) {
    ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = a; ctx.fillStyle = '#808080'; ctx.fillRect(x, y, w, h); ctx.restore();
  }

  // ================= J: a clock hand sweeps through each hit; the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 7) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.5 : 20, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), L = big ? 26 : 20, u = ease((k + 1) / 4), a0 = (a.hitAt % 2 ? -1.1 : 1.0), A = (d > 0 ? 0 : PI) + d * (a0 - a0 * 2 * u);
        hand(ctx, sx + d * 6, hy, L, A, big, k > 4 ? (7 - k) / 3 : 1);
        if (k === 0) sparks(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 5 : 3, 2);
      }
    }
    if (front && p.modeT > 0) {   // Haste: small hands spin round her, a gear ticks at her waist (small)
      const fade = Math.min(1, p.modeT / 30);
      gear(ctx, sx - d * 6, sy - 14, 4, 8, p.t >> 1, fade);
      for (let i = 0; i < 2; i++) { const an = p.t * 0.35 + i * PI; ctx.save(); ctx.globalAlpha = fade * 0.8; art.line(ctx, '#ffd24a', R(sx + Math.cos(an) * 9), R(sy - 22 + Math.sin(an) * 9), R(sx + Math.cos(an) * 14), R(sy - 22 + Math.sin(an) * 14), 1); ctx.restore(); }
    }
    if (!front && p.awakeT > 0) {   // Clockwork Form: gears at her back (small)
      const fade = Math.min(1, p.awakeT / 30);
      gear(ctx, sx - d * 9, sy - 30, 6, 10, p.t >> 2, fade); gear(ctx, sx - d * 3, sy - 38, 4, 8, -(p.t >> 1), fade);
    }
    if (front && p.awakeT > 0) {   // and the watch open on its chain, glowing (small)
      const fade = Math.min(1, p.awakeT / 30);
      stamp(ctx, 'watch|5', sx + d * 10, sy - 24, 26, 26, c => { c.translate(4, 3); watchVec(c, 4, true); }, fade);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const gg = g || this.G, on = isT(gg) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (greyLive() && grey.p === this) greyRect(ctx, -W, -H, W * 3, H * 3, 0.88);   // everything drawn so far goes grey; she is drawn after, in colour
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    if (greyLive() && grey.p !== this) greyRect(ctx, sx - 28, sy - 60, 56, 66, 0.88);   // and whoever is drawn after her
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isT(g || this.G) || !z || !z.shots) return r;
    dress(z); if (G.zone && G.zone !== z && G.zone.shots) dress(G.zone);
    if (grey.p === this) { const live = this.state === 'ult' || !!this.ugrand; grey.off = live ? 0 : (grey.off || 0) + 1; if (this.st >= grey.until || grey.off > 6 || this.dead) grey.on = false; }   // (ult-grand carries the ultimate on under its own state: not the end)
    if (!this.dead && this.awakeT > a0 + 60) sparks(this.x, this.y - 24, 14, 2.6);   // Clockwork Form begins (small and short)
    return r;
  };

  // ================= W+I: The Stopped Clock, the finish =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isT(g)) return r;
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('tessa') : null, FIN = pl ? pl.fin : 64;
    if (p.st === 8) { grey.on = true; grey.p = p; grey.until = FIN; }   // time stops: the world goes grey
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    }
    return r;
  };
  // js/ult-grand.js builds up from BU2 and lands its finishing blow at FIN: her watch hangs beside them, its hands stop,
  // then one tick, and colour and every cut come back at once
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1, CUTS = [[-1.0, 34], [0.4, 40], [-0.3, 30], [1.2, 36], [0.0, 44], [-1.4, 28]];
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult' || SW.frame - (v.f0o === undefined ? (v.f0o = SW.frame) : v.f0o) > 400 || !(G.player === p || (SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p)))) return false;   // (a match quit mid-ultimate leaves the old fighter in 'ult' for ever: stop when it is gone)
      const st = p.st; if (st < BU2 - 2 || st > FIN + 18) return;
      const sx = R(v.x - cam.x), sy = R(v.y - cam.y), cy = sy - 20, wx = sx - dir * 50, wy = cy - 14, sw = R(Math.sin(st * 0.08) * 3);
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 8), stop = st >= FIN - 12, am = stop ? -0.0 : st * 0.5, ah = stop ? -0.02 : st * 0.04;
        PX.sprite(ctx, wx + sw, wy, 100, 92, c => { c.scale(dir, 1); watchVec(c, 18, stop); }, { pal: PAL, outline: OUT, alpha: k });
        if (k > 0.3) { hand(ctx, wx + sw, wy, 10, ah - PI / 2, false); hand(ctx, wx + sw, wy, 15, am - PI / 2, stop); }
        CUTS.forEach((c2, i) => { const u = clamp01((st - BU2 - i * 3) / 4); if (u <= 0) return; ctx.save(); ctx.globalAlpha = 0.7; const ca = Math.cos(c2[0]), sa = Math.sin(c2[0]), L = c2[1] * u; art.line(ctx, '#e0e0e0', R(sx - ca * L / 2), R(cy - sa * L / 2), R(sx + ca * L / 2), R(cy + sa * L / 2), 1); ctx.restore(); });   // the cuts she makes, held still, grey
        if (stop && st % 12 < 4) { ctx.save(); ctx.globalAlpha = 0.8; art.line(ctx, '#fff3d8', wx + sw - 4, wy - 30, wx + sw + 4, wy - 30, 1); ctx.restore(); }
      } else {   // tick: colour, and every cut, at once
        if (grey.p === p) grey.on = false;
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, mono = ik < 0.5 ? '#ffffff' : undefined;
        PX.impact(ctx, sx, cy, ik, 59);
        PX.sprite(ctx, wx, wy, 100, 92, c => { c.scale(dir, 1); watchVec(c, 18, true); }, { pal: PAL, outline: OUT, alpha: 1 - ease((k - 0.3) / 0.5), mono });
        if (!mono) { hand(ctx, wx, wy, 10, -0.02 - PI / 2, false, 1 - k); hand(ctx, wx, wy, 15, PI / 30 - PI / 2, true, 1 - k); }   // the second hand moves one tick
        CUTS.forEach(c2 => { const ca = Math.cos(c2[0]), sa = Math.sin(c2[0]), L = c2[1] * (1 + k * 0.4); ctx.save(); ctx.globalAlpha = 1 - ease((k - 0.4) / 0.6); art.line(ctx, '#e8a090', R(sx - ca * L / 2), R(cy - sa * L / 2) + 1, R(sx + ca * L / 2), R(cy + sa * L / 2) + 1, 3); art.line(ctx, '#fff3d8', R(sx - ca * L / 2), R(cy - sa * L / 2), R(sx + ca * L / 2), R(cy + sa * L / 2), 2); ctx.restore(); });
        if (st === FIN) sparks(T.x, T.y - 16, 26, 4.5);
      }
    });
  }
})();
