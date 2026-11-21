'use strict';
// Shattered Worlds — Hex the ghost (the user, 2026-11-20: "Hex the ghost"). Her story: from "a world that ended before
// the Engine ever found it", where "everything happened twice: once when it happened, and again later, when it was
// remembered"; "a part of everything she does to you hits again two seconds later"; "voodoo pins between her
// fingers, ghost light round her"; she lives in Thorne's Bone Garden. So her things are ghosts and pins: wisps with
// hollow eyes and open mouths trailing mint vapour, long steel pins with round heads, a stitched doll, and the echo:
// two seconds after a hit, a ghost dives back into the wound and it opens again. Mint ghost light on dark navy.
// Crisp pixel art through js/pixel-kit.js; pieces drawn often are drawn once and reused.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/lux-prism.js.
//   echo   every delayed hit (her trait): a ghost dives into the target just as the echo lands, and a mint cut opens
//   J      a pin stabs in at each hit; the finisher throws one pin
//   U      Hex Bolt: a ghost wisp with a face, trailing mint vapour
//   S+U    Soul Swap: two ghosts cross in the middle as they trade places
//   I      Voodoo Pins: big pins with round heads rain down, stick, then fade
//   S+I    Doom Mark: a stitched doll hangs over the target; pins go into it as the count runs down
//   W+O    Hollow: she is see-through while she drifts through them
//   S+O    Ill Omen: a faint ghost of her lags a beat behind     O  Grave Form: wisps circle her (both small)
//   W+I    Requiem: the crossing ghosts are wisps; in the finish (js/ult-grand.js) her hood looms beside the target with
//          glowing eyes, a choir of ghosts rises round them, goes through them on an impact frame, and the wounds open again
// SW.hexEcho.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !CASTS || !CASTS.hex_bolt || !CASTS.voodoo_pins || !SW.data.heroes.hex) return;
  const HE = SW.hexEcho = { on: true };
  const isH = g => !!(HE.on && g && g.state && g.state.hero === 'hex');
  const PI = Math.PI, Vis = N.Vis, part = N.part, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };

  // black, dark navy, navy, deep teal, teal, mint, pale mint, white, steel dark, steel, steel light, pin red, pin violet, burlap
  const PAL = ['#05060c', '#0d1626', '#1b263b', '#1f5c58', '#3aa88a', '#80ffdb', '#c8fff0', '#ffffff', '#4a4e5e', '#8a8e9e', '#c8ccd8', '#e63946', '#9b5de5', '#6a5a48'];
  const C = { k: PAL[0], n0: PAL[1], n1: PAL[2], t0: PAL[3], t1: PAL[4], m: PAL[5], pm: PAL[6], w: PAL[7], s0: PAL[8], s1: PAL[9], s2: PAL[10], red: PAL[11], vio: PAL[12], bur: PAL[13] };
  const OUT = '#0d1626';
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

  // ================= the wisp: a ghost's head trailing vapour; facing +x, (0, 0) the head, s its head size =================
  function wispVec(c, s, ph, mouth) {
    for (let k = 0; k < 3; k++) {   // ragged tails of vapour, waving
      const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([-s * 0.3 - u * s * (2.2 - k * 0.4), (k - 1) * s * 0.32 * u + Math.sin(ph * PI / 2 - u * 5 + k * 1.7) * s * 0.22 * u]); }
      const top = [], bot = []; pts.forEach((q, i) => { const w = s * 0.5 * (1 - i / 8) * (k === 1 ? 1 : 0.7); top.push([q[0], q[1] - w]); bot.unshift([q[0], q[1] + w]); });
      poly(c, top.concat(bot), k === 1 ? C.t1 : C.t0);
    }
    // a skull of ghost light, turned three quarters toward you: a high brow, a long jaw hanging open
    poly(c, [[-s * 0.5, -s * 0.2], [-s * 0.3, -s * 0.62], [s * 0.12, -s * 0.74], [s * 0.5, -s * 0.52], [s * 0.62, -s * 0.08], [s * 0.5, s * 0.32], [s * 0.3, s * (mouth ? 0.86 : 0.6)], [s * 0.0, s * (mouth ? 0.78 : 0.52)], [-s * 0.3, s * 0.36]], C.m);
    poly(c, [[-s * 0.3, -s * 0.62], [s * 0.12, -s * 0.74], [s * 0.5, -s * 0.52], [s * 0.1, -s * 0.46], [-s * 0.24, -s * 0.38]], C.pm);
    poly(c, [[-s * 0.5, -s * 0.2], [-s * 0.3, s * 0.36], [0, s * 0.3], [-s * 0.2, -s * 0.06]], C.t1);
    poly(c, [[-s * 0.12, -s * 0.34], [s * 0.16, -s * 0.2], [s * 0.12, s * 0.02], [-s * 0.12, -s * 0.04]], C.n0);   // eye sockets, slanted down toward the middle
    poly(c, [[s * 0.28, -s * 0.22], [s * 0.54, -s * 0.36], [s * 0.54, -s * 0.06], [s * 0.32, s * 0.0]], C.n0);
    poly(c, [[-s * 0.02, -s * 0.18], [s * 0.08, -s * 0.12], [s * 0.0, -s * 0.06]], C.w); poly(c, [[s * 0.38, -s * 0.14], [s * 0.48, -s * 0.2], [s * 0.46, -s * 0.1]], C.w);   // a cold point in each
    poly(c, [[s * 0.06, s * 0.14], [s * 0.42, s * 0.14], [s * 0.32, s * (mouth ? 0.7 : 0.4)], [s * 0.12, s * (mouth ? 0.64 : 0.36)]], C.n0);   // the mouth, hanging open
    for (let j = 0; j < 3; j++) poly(c, [[s * (0.1 + j * 0.1), s * 0.14], [s * (0.16 + j * 0.1), s * 0.14], [s * (0.13 + j * 0.1), s * 0.26]], C.pm);   // teeth
  }
  function wisp(ctx, x, y, s, dir, t, mouth, a, tilt) {
    const ph = (t >> 2) % 4, tq = Math.max(-2, Math.min(2, R((tilt || 0) / 0.3)));
    stamp(ctx, 'wisp|' + s + '|' + dir + '|' + ph + '|' + (mouth ? 1 : 0) + '|' + tq, x - dir * s * 0.8, y, s * 4.4, s * 2.6, c => { c.translate(s * 0.8 * dir, 0); c.scale(dir, 1); if (tq) c.rotate(tq * 0.3); wispVec(c, s, ph, mouth); }, a);
  }
  // a voodoo pin: its point toward +x, L long, the head a colour
  function pinVec(c, L, head) {
    poly(c, [[-L * 0.42, -1], [L * 0.42, -0.5], [L * 0.5, 0], [L * 0.42, 0.5], [-L * 0.42, 1]], C.s1);
    poly(c, [[-L * 0.42, -1], [L * 0.42, -0.5], [L * 0.5, 0], [-L * 0.42, 0]], C.s2);
    ell(c, -L * 0.44, 0, L * 0.16, L * 0.16, head); ell(c, -L * 0.48, -L * 0.05, L * 0.06, L * 0.06, C.w);
  }
  const HEADS = [C.m, C.red, C.vio];
  function pin(ctx, x, y, L, ang, h, a) { const rq = ((R(ang / (PI / 8)) % 16) + 16) % 16; stamp(ctx, 'pin|' + L + '|' + rq + '|' + (h % 3), x, y, L + 8, L + 8, c => { c.rotate(rq * PI / 8); pinVec(c, L, HEADS[h % 3]); }, a); }
  // a hooded wraith: (0, 0) its middle, h tall, facing +x
  function wraithVec(c, h) {
    poly(c, [[-h * 0.22, -h * 0.3], [h * 0.12, -h * 0.56], [h * 0.26, -h * 0.3], [h * 0.3, h * 0.04], [h * 0.42, h * 0.16], [h * 0.22, h * 0.18], [h * 0.18, h * 0.5], [h * 0.06, h * 0.34], [-h * 0.06, h * 0.52], [-h * 0.16, h * 0.32], [-h * 0.32, h * 0.48], [-h * 0.28, h * 0.02]], C.t1);   // a ragged hooded cloak, one sleeve reaching
    poly(c, [[-h * 0.22, -h * 0.3], [h * 0.12, -h * 0.56], [h * 0.04, -h * 0.28]], C.pm);
    poly(c, [[-h * 0.28, h * 0.02], [-h * 0.32, h * 0.48], [-h * 0.16, h * 0.32], [-h * 0.1, h * 0.0]], C.t0);
    poly(c, [[-h * 0.02, -h * 0.34], [h * 0.22, -h * 0.3], [h * 0.24, -h * 0.08], [-h * 0.02, -h * 0.1]], C.n0);   // the dark of the hood
    poly(c, [[h * 0.02, -h * 0.22], [h * 0.1, -h * 0.2], [h * 0.09, -h * 0.17]], C.pm); poly(c, [[h * 0.14, -h * 0.2], [h * 0.22, -h * 0.22], [h * 0.21, -h * 0.17]], C.pm);   // two slit eyes
  }
  function wraith(ctx, x, y, h, dir, a) { stamp(ctx, 'wraith|' + h + '|' + dir, x, y, h * 0.8, h * 1.2, c => { c.scale(dir, 1); wraithVec(c, h); }, a); }
  // the stitched doll: (0, 0) its middle, s tall
  function dollVec(c, s, pins) {
    for (const d of [-1, 1]) { poly(c, [[d * s * 0.12, -s * 0.06], [d * s * 0.42, -s * 0.16], [d * s * 0.44, -s * 0.04], [d * s * 0.12, s * 0.06]], C.bur); poly(c, [[d * s * 0.06, s * 0.22], [d * s * 0.2, s * 0.5], [d * s * 0.08, s * 0.5], [-d * s * 0.0, s * 0.24]], C.bur); }   // arms and legs
    poly(c, [[-s * 0.16, -s * 0.12], [s * 0.16, -s * 0.12], [s * 0.18, s * 0.26], [-s * 0.18, s * 0.26]], C.bur);   // the body
    ell(c, 0, -s * 0.28, s * 0.2, s * 0.19, C.bur);   // the head
    c.strokeStyle = C.m; c.lineWidth = 1;
    for (const d of [-1, 1]) { c.beginPath(); c.moveTo(d * s * 0.1 - s * 0.04, -s * 0.33); c.lineTo(d * s * 0.1 + s * 0.04, -s * 0.25); c.moveTo(d * s * 0.1 + s * 0.04, -s * 0.33); c.lineTo(d * s * 0.1 - s * 0.04, -s * 0.25); c.stroke(); }   // X-stitch eyes
    c.beginPath(); c.moveTo(-s * 0.08, -s * 0.18); c.lineTo(s * 0.08, -s * 0.18); c.moveTo(0, -s * 0.1); c.lineTo(0, s * 0.24); c.stroke();   // a stitched mouth, a seam down the body
    for (let j = 0; j < 4; j++) { c.beginPath(); c.moveTo(-s * 0.04, -s * 0.06 + j * s * 0.08); c.lineTo(s * 0.04, -s * 0.06 + j * s * 0.08); c.stroke(); }
    const at = [[-0.3, -0.38, -0.6], [0.32, 0.02, 0.5], [-0.05, 0.12, -1.3]];
    for (let i = 0; i < pins; i++) { const q = at[i]; c.save(); c.translate(q[0] * s, q[1] * s); c.rotate(q[2] + PI); pinVec(c, s * 0.55, HEADS[i % 3]); c.restore(); }   // the pins it has taken
  }
  Object.assign(HE, { wisp, pin, wraith, PAL });
  const vapour = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 ? '#80ffdb' : '#c8fff0', rand(-pw, pw), -rand(0.2, pw), 24, 2, -0.03); };
  // a mint cut that opens on a wound
  function cut(ctx, x, y, k, ang, len) {
    if (k <= 0 || k >= 1) return;
    const u = ease(k * 2), a = 1 - ease((k - 0.5) / 0.5), ca = Math.cos(ang), sa = Math.sin(ang), L = len * u;
    ctx.save(); ctx.globalAlpha *= a;
    art.line(ctx, '#1f5c58', R(x - ca * L / 2), R(y - sa * L / 2) + 1, R(x + ca * L / 2), R(y + sa * L / 2) + 1, 3);
    art.line(ctx, '#80ffdb', R(x - ca * L / 2), R(y - sa * L / 2), R(x + ca * L / 2), R(y + sa * L / 2), 2);
    art.line(ctx, '#ffffff', R(x - ca * L * 0.3), R(y - sa * L * 0.3), R(x + ca * L * 0.3), R(y + sa * L * 0.3), 1);
    ctx.restore();
  }

  // ================= the echo: every delayed hit gets a ghost diving into the wound =================
  const TR = N.TRAITS && N.TRAITS.curse;
  if (TR && TR.hit) {
    const _th = TR.hit;
    TR.hit = function (p, atk, e) {
      const r = _th.apply(this, arguments);
      if (!isH(G) || !atk || atk.curse || !e || e.dead || !G.zone) return r;
      const dir = Math.random() < 0.5 ? 1 : -1, ang = rand(-0.9, 0.9);
      G.zone.shots.push(new Vis(e.x, e.y, 132, (ctx, sx, sy, t) => {
        if (t < 110 || e.dead) return;
        const k = (t - 110) / 10, cy = sy - (e.h || 34) / 2;
        if (k < 1) wisp(ctx, sx - dir * 40 * (1 - ease(k)), cy - 26 * (1 - ease(k)), 8, dir, t, true, 0.85, dir * 0.6);   // the ghost dives in
        cut(ctx, sx, cy, (t - 118) / 14, ang, 22);   // and the wound opens again
      }, v => { if (!e.dead) { v.x = e.x; v.y = e.y; } }));
      return r;
    };
  }

  // ================= S+U: Soul Swap: two ghosts cross =================
  const _ss = CASTS.soul_swap;
  if (_ss) CASTS.soul_swap = function (p, z) {
    const x0 = p.x, r = _ss.apply(this, arguments);
    if (!isH(G) || Math.abs(p.x - x0) < 2) return r;
    const xa = x0, xb = p.x, y = p.y;
    z.shots.push(new Vis(xa, y, 16, (ctx, sx, sy, t) => {
      const k = ease(t / 12), a = t > 11 ? (16 - t) / 5 : 0.85, dx = xb - xa;
      wraith(ctx, sx + dx * k, sy - 22 - Math.sin(k * PI) * 10, 30, dx > 0 ? 1 : -1, a);   // hers goes one way
      wraith(ctx, sx + dx * (1 - k), sy - 22 + Math.sin(k * PI) * 10, 30, dx > 0 ? -1 : 1, a * 0.8);   // theirs the other
      if (t === 6) vapour(xa + dx / 2, y - 22, 10, 2);
    }));
    return r;
  };

  // ================= S+I: Doom Mark: the stitched doll =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.hex;
  if (BU && BU.cast) {
    const _dm = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _dm.apply(this, arguments);
      if (!isH(G)) return r;
      const v = z.shots.slice(n0).find(s => s.render && (s.life === 180 || s.life === 34));
      if (v) {
        const T0 = v.life; v.hx = 1;
        v.render = (ctx, x, y, t) => {
          const k = t / T0, pins = Math.min(3, Math.floor(k * 3.4)), sh = k > 0.8 ? R(Math.sin(t * 2.1) * 1.5) : 0, bob = R(Math.sin(t * 0.1) * 2);
          stamp(ctx, 'doll|' + pins, x + sh, y - 56 + bob, 40, 40, c => dollVec(c, 26, pins));
          ctx.save(); ctx.globalAlpha = 0.6; art.line(ctx, '#80ffdb', x + sh, y - 42 + bob, x, y - 34, 1); ctx.restore();   // a thread from it down to them
          art.rect(ctx, '#05060c', x - 9, y - 76 + bob, 18, 3); art.rect(ctx, '#80ffdb', x - 9, y - 76 + bob, R(18 * k), 3);   // the count
        };
      }
      return r;
    };
  }

  // ================= W+O: Hollow: see-through while she drifts =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.hex;
  if (SIG && SIG.cast) {
    const _ho = SIG.cast;
    SIG.cast = function (p, z) { const r = _ho.apply(this, arguments); if (isH(G)) p._hxHollow = 18; return r; };
  }

  // ================= her shots: the bolt, the pins, the finisher's pin, and Requiem's ghosts =================
  const pinsLive = [];
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.hx !== undefined) return;
      s.hx = 0;
      if (s instanceof Proj && s.render && s.ghost && s.r === 5 && s.life === 70) { s.hx = 1; s.render = (ctx, x, y, q) => wisp(ctx, x, y, 9, q.vx >= 0 ? 1 : -1, q.t, q.t % 24 < 12, 1, SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)), -0.6, 0.6)); }   // Hex Bolt
      else if (s instanceof Proj && s.render && s.w === 8 && s.h === 14 && s.vy === 10) { s.hx = 1; s.hp = R(rand(0, 2.99)); pinsLive.push(s); s.render = (ctx, x, y, q) => pin(ctx, x, y - 2, 20, PI / 2, q.hp); }   // Voodoo Pins
      else if (s instanceof Proj && s.render && s.r === 4 && s.life === 20) { s.hx = 1; s.render = (ctx, x, y, q) => pin(ctx, x, y, 18, q.vx >= 0 ? 0 : PI, 1); }   // the finisher's pin
      else if (p.state === 'ult' && s.render && s.life === 50 && s.vx === undefined) {   // Requiem: a ghost crossing
        const d = s.x <= G.cam.x + 1 ? 1 : -1, sz = R(rand(8, 12));
        s.hx = 1; s._ugS = 1; s.render = (ctx, x, y, t) => wisp(ctx, x + d * t * 10, y + R(Math.sin(t * 0.3) * 3), sz, d, t, true, 0.8);
      }
    });
    for (let i = pinsLive.length - 1; i >= 0; i--) {   // a pin that has landed sticks a moment, then fades
      const s = pinsLive[i]; if (!s.gone) continue; pinsLive.splice(i, 1);
      const x = s.x, y = s.y, h = s.hp;
      z.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => pin(ctx, sx, sy - 4, 20, PI / 2 + (h - 1) * 0.15, h, t > 12 ? (22 - t) / 10 : 1)));
    }
  }

  // ================= J: a pin stabs in at each hit; the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 8) {
        const reach = a.box ? a.box[0] + a.box[2] * 0.6 : 22, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), u = ease((k + 1) / 3);
        pin(ctx, sx + d * (reach - 10 + 12 * u), hy - 2, 16, d > 0 ? 0.25 : PI - 0.25, a.hitAt, k > 5 ? (8 - k) / 3 : 1);
        if (k === 0) vapour(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), 3, 1.5);
      }
    }
    if (!front && p.modeT > 0) {   // Ill Omen: a faint ghost of her a beat behind (small)
      const fade = Math.min(1, p.modeT / 30), h = p._hxTrail && p._hxTrail[0];
      if (h) wraith(ctx, R(h[0] - G.cam.x), R(h[1] - G.cam.y) - 20, 34, d, 0.35 * fade);
    }
    if (front && p.awakeT > 0) {   // Grave Form: wisps circle her (small)
      const fade = Math.min(1, p.awakeT / 30);
      for (let i = 0; i < 3; i++) { const an = p.t * 0.07 + i * 2.09; if ((Math.sin(an) >= 0) !== front) continue; wisp(ctx, sx + Math.cos(an) * 15, sy - 22 + Math.sin(an) * 5, 4, -Math.sin(an) >= 0 ? 1 : -1, p.t + i * 5, false, 0.8 * fade); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isH(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const hollow = on && this._hxHollow > 0;
    if (hollow) { ctx.save(); ctx.globalAlpha *= 0.4; }   // Hollow: she is see-through
    let r;
    try { r = _pd.apply(this, arguments); } finally { if (hollow) ctx.restore(); }
    if (hollow) { wraith(ctx, sx, sy - 20, 36, this.face, 0.5); }
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isH(g || this.G) || !z || !z.shots) return r;
    dress(this, z); if (G.zone && G.zone !== z && G.zone.shots) dress(this, G.zone);
    if (this._hxHollow > 0) this._hxHollow--;
    const tr = this._hxTrail || (this._hxTrail = []); tr.push([this.x, this.y]); if (tr.length > 10) tr.shift();
    if (!this.dead && this.awakeT > a0 + 60) vapour(this.x, this.y - 24, 14, 2.4);   // Grave Form begins (small and short)
    return r;
  };

  // ================= W+I: Requiem, the finish =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isH(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('hex') : null;
    if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    return r;
  };
  // her hood, close: glowing mint eyes in the dark of it; (0, 0) the middle, s tall, facing +x
  function hoodVec(c, s, glow) {
    poly(c, [[-s * 0.5, s * 0.5], [-s * 0.42, -s * 0.1], [-s * 0.15, -s * 0.48], [s * 0.2, -s * 0.5], [s * 0.42, -s * 0.24], [s * 0.5, s * 0.2], [s * 0.36, s * 0.5], [s * 0.2, s * 0.38], [s * 0.06, s * 0.52], [-s * 0.1, s * 0.4], [-s * 0.26, s * 0.54]], C.n1);   // the ragged hood
    poly(c, [[-s * 0.42, -s * 0.1], [-s * 0.15, -s * 0.48], [s * 0.2, -s * 0.5], [-s * 0.05, -s * 0.36]], C.t0);   // a rim of ghost light on it
    poly(c, [[-s * 0.06, s * 0.4], [-s * 0.12, -s * 0.12], [s * 0.1, -s * 0.3], [s * 0.36, -s * 0.12], [s * 0.4, s * 0.24], [s * 0.2, s * 0.36]], C.k);   // the dark inside
    poly(c, [[s * 0.02, -s * 0.08], [s * 0.4, -s * 0.06], [s * 0.38, s * 0.04], [s * 0.04, s * 0.06]], '#2c3a3a');   // her pale face, barely
    for (const ex of [0.1, 0.28]) { ell(c, s * ex, -s * 0.02, s * 0.06, s * 0.03, glow ? C.w : C.pm); ell(c, s * ex, -s * 0.02, s * 0.025, s * 0.02, C.m); }   // the eyes
    if (glow) for (const ex of [0.1, 0.28]) { poly(c, [[s * ex - s * 0.12, -s * 0.02], [s * ex, -s * 0.03], [s * ex + s * 0.12, -s * 0.02], [s * ex, -s * 0.01]], C.m); }
    for (let i = 0; i < 3; i++) { const x = -s * 0.3 + i * s * 0.08; poly(c, [[x, s * 0.1], [x + s * 0.02, s * 0.36], [x - s * 0.01, s * 0.36]], C.s2); ell(c, x, s * 0.08, s * 0.03, s * 0.03, HEADS[i]); }   // pins between her fingers
  }
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1, N8 = 8;
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult') return false;
      const st = p.st; if (st < BU2 - 2 || st > FIN + 22) return;
      const sx = R(v.x - cam.x), sy = R(v.y - cam.y), cy = sy - 20;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 9), rise = ease((st - BU2) / 14), sh = st > FIN - 8 ? Math.sin(st * 2.3) * 1.2 : 0;
        PX.sprite(ctx, sx - dir * 74 + sh, cy - 10, 70, 70, c => { c.scale(dir, 1); hoodVec(c, 58, st > BU2 + 8); }, { pal: PAL, outline: OUT, alpha: k });
        for (let i = 0; i < N8; i++) {   // the choir rises round them, mouths open
          const an = st * 0.06 + i * PI * 2 / N8, Rr = 46 - 16 * ease((st - (FIN - 12)) / 12), y = sy - 6 - rise * (14 + (i % 3) * 8) + Math.sin(an) * 6;
          if (Math.sin(an) < 0) wisp(ctx, sx + Math.cos(an) * Rr, y - 20, 8, Math.cos(an) < 0 ? 1 : -1, st + i * 3, true, 0.75 * rise, -0.9 * (Math.cos(an) < 0 ? 1 : -1));
        }
        for (let i = 0; i < N8; i++) { const an = st * 0.06 + i * PI * 2 / N8, Rr = 46 - 16 * ease((st - (FIN - 12)) / 12), y = sy - 6 - rise * (14 + (i % 3) * 8) + Math.sin(an) * 6; if (Math.sin(an) >= 0) wisp(ctx, sx + Math.cos(an) * Rr, y - 20, 9, Math.cos(an) < 0 ? 1 : -1, st + i * 3, true, 0.9 * rise, -0.9 * (Math.cos(an) < 0 ? 1 : -1)); }
      } else {   // they go through, and every wound opens again
        const k = (st - FIN) / 22, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 83);
        PX.sprite(ctx, sx - dir * 74, cy - 10, 70, 70, c => { c.scale(dir, 1); hoodVec(c, 58, true); }, { pal: PAL, outline: OUT, alpha: 1 - ease((k - 0.3) / 0.5), mono: ik < 0.5 ? '#ffffff' : undefined });
        for (let i = 0; i < N8; i++) { const an = i * PI * 2 / N8 + 0.4, u = Math.min(1.6, ik * 0.5); wisp(ctx, sx - Math.cos(an) * 60 * (1 - u), cy - Math.sin(an) * 34 * (1 - u), 9, Math.cos(an) >= 0 ? 1 : -1, st + i, true, 1 - ease((k - 0.3) / 0.4)); }
        for (let j = 0; j < 5; j++) cut(ctx, sx + (j - 2) * 4, cy + ((j * 7) % 5 - 2) * 4, (st - FIN - 4 - j * 3) / 12, -1.2 + j * 0.6, 30);
        if (st === FIN) vapour(T.x, T.y - 18, 26, 4);
      }
    });
  }
})();
