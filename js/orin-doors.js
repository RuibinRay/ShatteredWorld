'use strict';
// Shattered Worlds — Orin's doorways (the user, 2026-11-20: "Orin's doorways"). His story: a boy who walked into a tent
// flap and out of one three camps away; he "fell through the tear, and through the dark beyond it, and found that the
// dark was full of doors"; "one hand pushing through a tall magenta doorway hanging in the air"; forearms wrapped in
// glowing magenta cloth. So every move goes through a real doorway: a tall arched frame of dark indigo with magenta
// trim, its door leaf swinging open on a slab of magenta light. Crisp pixel art through js/pixel-kit.js; doors are
// drawn once per size and opening and reused. Draw-only: hits, hitboxes and timing stay as they were.
// Loaded after js/noct-void.js.
//   J      a slit of a door opens on each hit
//   U      Rift Bolt: it leaves through a small door; the bolt is a shard of magenta light
//   S+U    Fold: a door opens by the target and one at his feet, and they come out of the second
//   I      Gate Lance: the lance fires out of a doorway and crosses the screen
//   S+I    Back Door: a door swings open behind the target and the hit comes out of it
//   W+O    Door Barrage: three doors open in the air above them, each drops a bolt
//   S+O    Half-Step: a faint doorframe flickers round him     O  Threshold Form: a doorway outline behind him, his
//          forearm cloth glowing (both small)
//   W+I    Thousand Doors: a door opens beside them for every blow; in the finish (js/ult-grand.js) doors open all round
//          the target and his hand reaches through the nearest; then every door slams shut at once on an impact frame
// SW.orinDoors.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !CASTS || !CASTS.rift_bolt || !CASTS.fold || !CASTS.gate_lance || !SW.data.heroes.orin) return;
  const OD = SW.orinDoors = { on: true };
  const isO = g => !!(OD.on && g && g.state && g.state.hero === 'orin');
  const PI = Math.PI, Vis = N.Vis, part = N.part, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };

  // black-indigo, indigo, deep violet, violet, magenta, pink, pale pink, white
  const PAL = ['#0c0818', '#1c1830', '#3a2a5a', '#7a2aa0', '#e04dff', '#f08aff', '#f7d0ff', '#ffffff'];
  const C = { k: PAL[0], i0: PAL[1], i1: PAL[2], v: PAL[3], m: PAL[4], pk: PAL[5], pp: PAL[6], w: PAL[7] };
  const kept = new Map();
  function stamp(ctx, key, x, y, w, h, draw, a, ay) {
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
    ctx.drawImage(cv, R(x) - cv.width / 2, R(y - (ay || 0)) - cv.height / 2);
    ctx.restore();
  }

  // ================= the doorway: (0, 0) its middle, h tall; open 0 shut .. 1 wide open; the leaf hinges on the left =================
  function doorVec(c, h, open, slam) {
    const w = h * 0.5, a = w / 2, b = h / 2, t = Math.max(2, h * 0.09), arch = h * 0.3;
    const frame = [[-a, b], [-a, -b + arch], [-a * 0.55, -b + arch * 0.45], [0, -b], [a * 0.55, -b + arch * 0.45], [a, -b + arch], [a, b]];
    poly(c, frame, C.i1);   // the frame
    poly(c, [[-a, b], [-a, -b + arch], [-a * 0.6, -b + arch * 0.3], [0, -b], [0, -b + t], [-a + t * 0.6, -b + arch + t * 0.2], [-a + t * 0.6, b]], C.v);
    const ia = a - t, ib = b - t * 0.4, inner = [[-ia, ib], [-ia, -b + arch + t * 0.5], [-ia * 0.5, -b + arch * 0.45 + t * 0.7], [0, -b + t * 1.6], [ia * 0.5, -b + arch * 0.45 + t * 0.7], [ia, -b + arch + t * 0.5], [ia, ib]];
    for (let j = 1; j < 5; j++) { const y = -b + arch + (ib + b - arch) * j / 5; poly(c, [[-a, y], [-ia, y], [-ia, y + 1], [-a, y + 1]], C.k); poly(c, [[ia, y + (j % 2 ? 3 : 0)], [a, y + (j % 2 ? 3 : 0)], [a, y + 1 + (j % 2 ? 3 : 0)], [ia, y + 1 + (j % 2 ? 3 : 0)]], C.k); }   // stone joints
    poly(c, inner, C.k);   // the dark before it opens
    if (open > 0.02) {   // the slab of light
      const lx = -ia + 2 * ia * (1 - open);
      c.save(); c.beginPath(); inner.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.clip();
      poly(c, [[lx, ib], [lx, -b], [ia + 1, -b], [ia + 1, ib]], C.m);
      poly(c, [[lx + (ia - lx) * 0.3, ib], [lx + (ia - lx) * 0.3, -b], [ia * 0.6, -b], [ia * 0.6, ib]], C.pk);
      poly(c, [[lx + (ia - lx) * 0.5, ib], [lx + (ia - lx) * 0.5, -b], [lx + (ia - lx) * 0.62, -b], [lx + (ia - lx) * 0.62, ib]], slam ? C.w : C.pp);
      c.restore();
    }
    const lw = 2 * ia * (1 - open) + 0.6;   // the leaf: swung back toward the hinge, seen edge-on as it opens
    poly(c, [[-ia, ib], [-ia, -b + arch + t * 0.5], [-ia * 0.6 + (1 - open) * 0, -b + arch * 0.3 + t * 0.7], [-ia + lw, -b + arch * 0.3 + t * 0.7], [-ia + lw, ib]], C.i0);
    if (lw > 3) { poly(c, [[-ia + 1, ib - 2], [-ia + 1, -b + arch + t], [-ia + lw - 1, -b + arch + t], [-ia + lw - 1, ib - 2]], C.i1); ell(c, -ia + lw - 1.6, 0, 1, 1, C.m); }   // its panel, its handle
    poly(c, [[-a - 1, b], [a + 1, b], [a + 1, b + t * 0.6], [-a - 1, b + t * 0.6]], C.v);   // the sill
    for (const d of [-1, 1]) { const cy = -b * 0.1; poly(c, [[d * a, cy - h * 0.08], [d * (a + h * 0.07), cy - h * 0.02], [d * (a + h * 0.05), cy + h * 0.2], [d * a, cy + h * 0.12]], C.m); }   // magenta cloth tied to the posts
    ell(c, 0, -b + arch * 0.5, Math.max(1, t * 0.5), Math.max(1, t * 0.5), open > 0.5 ? C.w : C.pk);   // a glint at the keystone
  }
  function door(ctx, x, y, h, open, a, slam) {
    const q = Math.max(0, Math.min(4, R(clamp01(open) * 4)));
    stamp(ctx, 'door|' + h + '|' + q + '|' + (slam ? 1 : 0), x, y, h * 0.7 + 8, h + 10, c => doorVec(c, h, q / 4, slam), a);
  }
  // a door that opens, holds, and closes over `life` frames; returns its opening at frame t
  const swing = (t, life, hold) => (t < 4 ? ease(t / 4) : t > life - 5 ? 1 - ease((t - (life - 5)) / 5) : 1) * (hold === undefined ? 1 : hold);
  Object.assign(OD, { door, PAL });
  const glints = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-4, 4), y + rand(-14, 14), i % 2 ? '#e04dff' : '#f7d0ff', rand(-pw, pw), rand(-pw, pw * 0.5), 16, 2, 0); };
  function doorAt(z, x, y, h, life, follow) {
    z.shots.push(new Vis(x, y, life, (ctx, sx, sy, t) => door(ctx, sx, sy, h, swing(t, life), Math.min(1, (t + 2) / 3)), follow));
  }

  // ================= U: Rift Bolt =================
  const _rb = CASTS.rift_bolt;
  CASTS.rift_bolt = function (p, z) {
    const n0 = z.shots.length, r = _rb.apply(this, arguments);
    if (!isO(G)) return r;
    doorAt(z, p.x + p.face * 16, p.y - 21, 22, 14);
    z.shots.slice(n0).forEach(s => { if (s instanceof Proj && s.w === 12 && s.h === 10) { s.od = 1; s.render = (ctx, x, y, q) => bolt(ctx, x, y, Math.atan2(q.vy || 0, q.vx || 1), q.t); } });
    return r;
  };
  // a shard of magenta light, pointed the way it flies
  function bolt(ctx, x, y, ang, t) {
    const rq = ((R(ang / (PI / 8)) % 16) + 16) % 16, f = t % 4 < 2 ? 0 : 1;
    stamp(ctx, 'bolt|' + rq + '|' + f, x, y, 30, 30, c => { c.rotate(rq * PI / 8); poly(c, [[-12, 0], [-2, -4], [9, 0], [-2, 4]], C.m); poly(c, [[-8, 0], [0, -2.4], [8, 0], [0, 2.4]], C.pp); poly(c, [[-3, 0], [1, -1], [6, 0], [1, 1]], C.w); for (let i = 0; i < 2; i++) poly(c, [[-12 - i * 4 - f * 2, (i ? 2 : -2)], [-6 - i * 4, 0], [-12 - i * 4 - f * 2, (i ? 3 : -3)]], C.pk); });
  }

  // ================= S+U: Fold: a door by them, one at his feet =================
  const _fo = CASTS.fold;
  CASTS.fold = function (p, z) {
    const e = N.nearest ? N.nearest(z, p.x, p.y - 16, 230) : null, ex = e ? e.x : 0, ey = e ? e.y : 0, r = _fo.apply(this, arguments);
    if (!isO(G)) return r;
    doorAt(z, p.x + p.face * 28, p.y - 20, 44, 22);
    if (e) doorAt(z, ex, ey - 20, 44, 16);
    return r;
  };

  // ================= I: Gate Lance: fired out of a doorway =================
  const _gl = CASTS.gate_lance;
  CASTS.gate_lance = function (p, z) {
    const n0 = z.shots.length, r = _gl.apply(this, arguments);
    if (!isO(G)) return r;
    doorAt(z, p.x + p.face * 16, p.y - 21, 44, 20);
    const bm = z.shots.slice(n0).find(s => s.len === 330 && typeof s.draw === 'function');
    if (bm) bm.draw = function (ctx, cam) {
      const k = Math.max(1, 8 - Math.abs(this.t - 5)), x = R((this.dir > 0 ? this.x : this.x - this.len) - cam.x), y = R(this.y - cam.y), c2 = Math.ceil(k / 3);
      ctx.save(); ctx.globalAlpha = SW.clamp((17 - this.t) / 8, 0, 1);
      art.rect(ctx, '#7a2aa0', x, y - k - 1, this.len, k * 2 + 2); art.rect(ctx, '#e04dff', x, y - k, this.len, k * 2); art.rect(ctx, '#f7d0ff', x, y - c2, this.len, c2 * 2); art.rect(ctx, '#ffffff', x, y - Math.max(1, c2 >> 1), this.len, Math.max(1, c2 >> 1) * 2);
      for (let j = 0; j < 6; j++) { const u = ((this.t * 0.1 + j / 6) % 1) * this.len; art.rect(ctx, '#ffffff', x + R(this.dir > 0 ? u : this.len - u) - 2, y - k - 2, 4, 1); art.rect(ctx, '#ffffff', x + R(this.dir > 0 ? u : this.len - u) - 2, y + k + 1, 4, 1); }
      ctx.restore();
    };
    return r;
  };

  // ================= S+I: Back Door =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.orin;
  if (BU && BU.cast) {
    const _bd = BU.cast;
    BU.cast = function (p, z) {
      const e = N.nearest ? N.nearest(z, p.x + p.face * 60, p.y - 16, 230) : null, dir = p.face, r = _bd.apply(this, arguments);
      if (!isO(G)) return r;
      const sx = p.x + dir * 16, tx = e ? e.x + dir * 46 : p.x + dir * 150, ty = e ? e.y - e.h / 2 : p.y - 20;
      doorAt(z, sx, p.y - 22, 40, 24); doorAt(z, tx, ty, 48, 26);   // the door behind them is the bigger one: the hit comes out of it
      return r;
    };
  }

  // ================= W+O: Door Barrage: doors in the air =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.orin;
  if (SIG && SIG.cast) {
    const _db = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _db.apply(this, arguments);
      if (!isO(G)) return r;
      z.shots.slice(n0).forEach(s => { if (s.paint && s.end && s.life >= 16 && s.life <= 28) { s.od = 1; const L = s.life; s.paint = (ctx, sx, sy, q) => door(ctx, sx, sy - 6, 26, ease(q.t / 6) * (q.t > L - 2 ? 0.6 : 1)); } });
      return r;
    };
  }

  // ================= his other shots: the barrage's bolts =================
  function dress(z) {
    z.shots.forEach(s => {
      if (s.od !== undefined) return;
      s.od = 0;
      if (s.paint && s.style === 'void' && s.w === 12 && s.h === 14 && s.vy === 6) { s.od = 1; s.paint = (ctx, x, y, q) => bolt(ctx, x, y, PI / 2, q.t); }
    });
  }

  // ================= J: a slit of a door opens on each hit; the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 8) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.6 : 22, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22);
        door(ctx, sx + d * (reach + 10), hy - 2, big ? 40 : 30, k < 2 ? 0.25 + k * 0.35 : k > 5 ? (8 - k) / 3 : 1, k > 5 ? (8 - k) / 3 : 1);
        if (k === 0) glints(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), big ? 5 : 3, 1.5);
      }
    }
    if (!front && p.awakeT > 0) {   // Threshold Form: a doorway outline behind him (small)
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = 0.5 * fade; const a2 = 13, b = 26, cy = sy - 24; ctx.strokeStyle = '#e04dff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx - a2, cy + b); ctx.lineTo(sx - a2, cy - b + 8); ctx.lineTo(sx, cy - b); ctx.lineTo(sx + a2, cy - b + 8); ctx.lineTo(sx + a2, cy + b); ctx.stroke(); ctx.restore();
    }
    if (front && p.awakeT > 0) { const fade = Math.min(1, p.awakeT / 30); ctx.save(); ctx.globalAlpha = fade * (0.6 + 0.4 * Math.sin(p.t * 0.2)); art.rect(ctx, '#f08aff', sx + d * 5 - 1, sy - 22, 3, 4); art.rect(ctx, '#f08aff', sx - d * 4 - 1, sy - 21, 3, 4); ctx.restore(); }   // the cloth on his forearms glows
    if (!front && p.modeT > 0 && (p.t >> 2) % 3 !== 0) {   // Half-Step: a faint doorframe flickers round him (small)
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha = 0.35 * fade; ctx.strokeStyle = '#f7d0ff'; ctx.lineWidth = 1; const a2 = 11, b = 22, cy = sy - 22, j = (p.t % 7) - 3; ctx.strokeRect(sx - a2 + j * 0.3, cy - b, a2 * 2, b * 2); ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isO(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isO(g || this.G) || !z || !z.shots) return r;
    dress(z); if (G.zone && G.zone !== z && G.zone.shots) dress(G.zone);
    if (!this.dead && this.awakeT > a0 + 60) glints(this.x, this.y - 24, 14, 2.4);   // Threshold Form begins (small and short)
    return r;
  };

  // ================= W+I: Thousand Doors =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isO(g)) return r;
    if (p.st >= 10 && p.st <= 58 && (p.st - 10) % 8 === 0) foes.forEach(e => { const b = e.box(), d = (p.st >> 3) % 2 ? 1 : -1; doorAt(z, b.x + b.w / 2 + d * 44, b.y + b.h / 2, 40, 14); });   // a door beside them for every blow
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('orin') : null;
      if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    }
    return r;
  };
  // his hand, reaching through: (0, 0) the wrist, pointing +x, s long; the cloth wrapped up the forearm
  function handVec(c, s) {
    poly(c, [[-s * 0.9, -s * 0.16], [0, -s * 0.12], [0, s * 0.12], [-s * 0.9, s * 0.18]], C.m); for (let i = 0; i < 4; i++) poly(c, [[-s * (0.8 - i * 0.2), -s * 0.17], [-s * (0.72 - i * 0.2), -s * 0.17], [-s * (0.66 - i * 0.2), s * 0.17], [-s * (0.74 - i * 0.2), s * 0.17]], C.pk);   // the wrapped forearm
    poly(c, [[0, -s * 0.14], [s * 0.28, -s * 0.16], [s * 0.34, s * 0.1], [0, s * 0.14]], '#c8a080');   // the palm
    for (let i = 0; i < 4; i++) poly(c, [[s * 0.28, -s * 0.14 + i * s * 0.07], [s * (0.56 - Math.abs(i - 1.5) * 0.05), -s * 0.15 + i * s * 0.08], [s * (0.56 - Math.abs(i - 1.5) * 0.05), -s * 0.1 + i * s * 0.08], [s * 0.28, -s * 0.08 + i * s * 0.07]], '#d8b090');   // fingers, reaching
    poly(c, [[s * 0.06, -s * 0.12], [s * 0.2, -s * 0.3], [s * 0.26, -s * 0.26], [s * 0.16, -s * 0.08]], '#d8b090');   // the thumb
  }
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1, RING = [[-1, -0.55], [0, -1], [1, -0.55], [1.1, 0.35], [-1.1, 0.35]];
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult' || SW.frame - (v.f0o === undefined ? (v.f0o = SW.frame) : v.f0o) > 400 || !(G.player === p || (SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p)))) return false;   // (a match quit mid-ultimate leaves the old fighter in 'ult' for ever: stop when it is gone)
      const st = p.st; if (st < BU2 - 2 || st > FIN + 18) return;
      const sx = R(v.x - cam.x), sy = R(v.y - cam.y), cy = sy - 20;
      if (st < FIN) {   // doors open all round them; from the nearest, his hand comes through
        RING.forEach((q, i) => { const o = ease((st - BU2 - i * 3) / 5); if (o > 0) door(ctx, sx + q[0] * 62, cy + q[1] * 40, 40, o, Math.min(1, o * 2)); });
        const dx = sx - dir * 70, k = ease((st - (BU2 + 4)) / 8), reach = ease((st - (BU2 + 10)) / 10);
        door(ctx, dx, cy - 4, 56, k, Math.min(1, k * 2));
        if (reach > 0) PX.sprite(ctx, dx + dir * (6 + reach * 22), cy - 6, 70, 34, c => { c.scale(dir, 1); handVec(c, 30); }, { pal: PAL.concat(['#c8a080', '#d8b090']), outline: C.k });
      } else {   // and every door slams shut at once
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, shut = 1 - ease(ik * 1.6);
        PX.impact(ctx, sx, cy, ik, 47);
        const a = 1 - ease((k - 0.5) / 0.5);
        RING.forEach(q => door(ctx, sx + q[0] * 62, cy + q[1] * 40, 40, shut, a, ik < 0.5));
        door(ctx, sx - dir * 70, cy - 4, 56, shut, a, ik < 0.5);
        if (st === FIN) glints(T.x, T.y - 18, 24, 4);
      }
    });
  }
})();
