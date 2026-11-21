'use strict';
// Shattered Worlds — Mako's mech (2026-11-20, the hero-look rework: cool, not cute). His story: a gentle dock hand inside
// an ever-bigger suit of armour, orange and grey, with Dyna riding his shoulder and painting her stripes on his shells.
// His shots were plain dots and his blasts plain rings. Now it is hardware: striped shells with a brass base and a
// muzzle flash, little missiles with hand-painted fins on smoke trails, thruster jets burning blue at the core and
// orange at the edge, blasts that throw grey smoke and steel chunks, floor plates that crack, welding sparks as plates
// bolt back on, and his plating as a row of armour plates. Crisp pixel art. Draw-only: every hit, hitbox and timing
// stays as it was. Loaded after js/rue-mask.js.
//   U      Arm Cannon: a muzzle flash and recoil smoke, a shell with Dyna's red stripes
//   S+U    Thruster Dash: back jets, blue at the core and orange at the edge, a heat trail
//   I      Missile Pod: the shoulder hatch flips open; little missiles with painted fins arc out on smoke trails
//   S+I    Ground Pound: jets fire on the way down; the floor plates crack and lift where he lands
//   W+O    Field Repair: welding sparks and plates bolting back onto him
//   (all)  every blast: a flash, a ring of grey smoke, steel chunks
//   J      the last blow: the cannon kicks with a muzzle ring
//   S+O    Overdrive: vents glowing red-hot, exhaust pouring from his back      O  Siege Mode: stabiliser legs
//          planted, the missile pod open over his shoulder (both small on purpose: the view stays clear)
//   (trait) his plating: a row of armour plates over him instead of a bar
//   W+I    Full Barrage: tracers from every gun; in the cinematic finish (js/ult-cinema.js) a shell the size of a car
//          drops over the target, Dyna's stripes on it, and bursts on an impact frame
// SW.makoMech.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Proj || !CASTS.arm_cannon || !CASTS.missile_pod) return;
  const MM = SW.makoMech = { on: true };
  const isM = g => !!(MM.on && g && g.state && g.state.hero === 'mako');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#120c08', st0: '#3a3f4e', st: '#5a6070', st2: '#8a92a8', st3: '#c8ccd8', or: '#f8961e', or2: '#ffc46b', pale: '#ffe8c2', red: '#d62828', brass: '#c8a040', w: '#ffffff', blue: '#4cc9f0', blue2: '#c8f4ff', sm: '#4a4a54', sm2: '#7a7a86' };

  function shell(ctx, x, y, d, s, a) {   // a shell flying toward d, (x, y) its nose; s scale
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    PX.sprite(ctx, R(x - d * 5 * s), R(y), R(22 * s), R(12 * s), c => {
      c.scale(d * s, s);
      c.fillStyle = C.brass; c.fillRect(-9, -3, 4, 6);   // the casing base
      c.fillStyle = C.st2; c.fillRect(-5, -3, 8, 6);
      c.fillStyle = C.red; c.fillRect(-3, -3, 1.6, 6); c.fillRect(0, -3, 1.6, 6);   // Dyna's stripes
      c.beginPath(); c.moveTo(3, -3); c.quadraticCurveTo(8, -2, 9, 0); c.quadraticCurveTo(8, 2, 3, 3); c.closePath(); c.fillStyle = C.st3; c.fill();
      c.fillStyle = C.w; c.fillRect(-4, -3, 10, 1);
    }, { outline: C.out, keepThin: true });
    ctx.restore();
  }
  MM.shell = shell;
  function missile(ctx, x, y, ang, t) {   // a little missile with hand-painted fins, (x, y) its middle
    PX.sprite(ctx, R(x), R(y), 18, 18, c => {
      c.rotate(ang);
      c.fillStyle = C.st3; c.fillRect(-4, -1.5, 7, 3); c.beginPath(); c.moveTo(3, -1.5); c.lineTo(6, 0); c.lineTo(3, 1.5); c.closePath(); c.fillStyle = C.red; c.fill();
      c.fillStyle = C.or; c.beginPath(); c.moveTo(-4, -1.5); c.lineTo(-6, -4); c.lineTo(-2, -1.5); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-4, 1.5); c.lineTo(-6, 4); c.lineTo(-2, 1.5); c.closePath(); c.fill();   // the fins
      c.fillStyle = C.w; c.fillRect(-1, -1.5, 1, 1);   // a doodle on its side
    }, { outline: C.out, keepThin: true });
    const bx = x - Math.cos(ang) * 6, by = y - Math.sin(ang) * 6;
    art.rect(ctx, t % 2 ? C.w : C.or2, R(bx) - 1, R(by) - 1, 2, 2);
  }
  function jet(ctx, x, y, ang, len, t, a) {   // a thruster jet: blue core, orange edge
    if (a <= 0) return;
    const ca = Math.cos(ang), sa = Math.sin(ang), L = len * (0.85 + 0.15 * Math.sin(t * 2.3));
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    art.line(ctx, C.or, R(x), R(y), R(x + ca * L), R(y + sa * L), 5);
    art.line(ctx, C.or2, R(x), R(y), R(x + ca * L * 0.75), R(y + sa * L * 0.75), 3);
    art.line(ctx, C.blue2, R(x), R(y), R(x + ca * L * 0.4), R(y + sa * L * 0.4), 2);
    art.line(ctx, C.w, R(x), R(y), R(x + ca * L * 0.2), R(y + sa * L * 0.2), 1);
    ctx.restore();
  }
  function blast(ctx, x, y, r, k, seed) {   // a flash, a ring of grey smoke, steel chunks
    if (k < 0.2) art.disc(ctx, k < 0.1 ? C.w : C.or2, R(x), R(y), R(r * 0.6 * (1 - k * 3)) + 2);
    const a = 1 - ease((k - 0.35) / 0.65);
    ctx.save(); ctx.globalAlpha *= a;
    for (let i = 0; i < 10; i++) { const an = i / 10 * PI * 2 + seed, rr = r * 0.4 + r * 0.6 * ease(Math.min(1, k * 2)), px = R(x + Math.cos(an) * rr), py = R(y + Math.sin(an) * rr * 0.75 - k * 8), s = R(3 + r * 0.08 + (i % 3)); art.disc(ctx, C.sm, px, py + 1, s); art.disc(ctx, C.sm2, px - 1, py - 1, Math.max(1, s - 1)); }
    if (k < 0.45) for (let i = 0; i < 6; i++) { const an = i / 6 * PI * 2 + seed * 2, rr = r * 0.3 + r * k * 1.4; art.rect(ctx, i % 2 ? C.or : C.or2, R(x + Math.cos(an) * rr * 0.6), R(y + Math.sin(an) * rr * 0.5), 2, 2); }   // fire licks
    ctx.restore();
    for (let i = 0; i < 6; i++) { const an = -PI * 0.15 - i / 5 * PI * 0.7 + seed * 0.3, rr = k * (r * 0.8 + i * 3), px = R(x + Math.cos(an) * rr), py = R(y + Math.sin(an) * rr + k * k * 30); ctx.save(); ctx.globalAlpha *= 1 - k; art.rect(ctx, C.out, px - 1, py - 1, 4, 3); art.rect(ctx, i % 2 ? C.st2 : C.st, px, py, 2, 1); ctx.restore(); }   // steel chunks
  }

  // ================= every blast of his (js/ninja-kit.js boom: its orange ring) =================
  const _ring = fx.ring;
  fx.ring = function (x, y, col, r0, r1, life) {
    const g = G, z = g && g.zone;
    if (!isM(g) || !z || !z.shots) return _ring.apply(this, arguments);
    if (col === C.or && r0 === 4 && life === 14) { const seed = rand(0, PI), big = r1 >= 60; z.shots.push(new Vis(x, y, big ? 30 : 22, (ctx, sx, sy, t) => blast(ctx, sx, sy, r1, t / (big ? 30 : 22), seed))); return; }
    if (col === C.pale && r0 === 2 && life === 10) return;   // its pale inner ring (the blast above stands for it)
    return _ring.apply(this, arguments);
  };

  // ================= U: Arm Cannon =================
  function dressShots(p, z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.mako || s.team === 'enemy') return;
      if (s.r === 4 && s.w === 12 && s.h === 12 && s.life === 40) { s.mako = 1; s.render = (ctx, x, y, q) => { const d = Math.sign(q.vx) || 1; shell(ctx, x, y, d, 1); ctx.save(); ctx.globalAlpha *= 0.5; art.line(ctx, C.sm2, R(x - d * 12), R(y), R(x - d * 20), R(y), 1); ctx.restore(); }; }
      else if (s.w === 8 && s.h === 8 && s.life === 90 && s.ghost) { s.mako = 1; s.render = (ctx, x, y, q) => missile(ctx, x, y, Math.atan2(q.vy, q.vx), q.t || 0); }
    });
  }
  const _ac = CASTS.arm_cannon;
  CASTS.arm_cannon = function (p, z) {
    const r = _ac.apply(this, arguments);
    if (!isM(G)) return r;
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 10, (ctx, sx, sy, t) => { const mx = sx + d * 18, my = sy - 22; if (t < 3) { art.disc(ctx, C.or2, mx + d * 4, my, 6 - t); for (let i = -1; i <= 1; i++) art.line(ctx, C.w, mx, my, R(mx + d * 12), R(my + i * 5), 1); } ctx.save(); ctx.globalAlpha *= 1 - t / 10; art.disc(ctx, C.sm2, R(mx - d * t), R(my - t * 0.8), 3 + (t >> 2)); ctx.restore(); }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= S+U: Thruster Dash: back jets =================
  const _td = CASTS.thruster_dash;
  if (_td) CASTS.thruster_dash = function (p, z) {
    const n0 = z.shots.length, r = _td.apply(this, arguments);
    if (!isM(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), d = p.face;
    z.shots.push(new Vis(p.x, p.y, 14, (ctx, sx, sy, t) => { if (drv && drv.gone && t > 1) return; jet(ctx, sx - d * 8, sy - 26, d > 0 ? PI : 0, 26, t, 1); jet(ctx, sx - d * 8, sy - 16, d > 0 ? PI : 0, 20, t + 1, 0.9); ctx.save(); ctx.globalAlpha *= 0.4; for (let i = 0; i < 3; i++) art.line(ctx, C.or2, R(sx - d * (30 + i * 10)), R(sy - 24 + i * 4), R(sx - d * (44 + i * 12)), R(sy - 24 + i * 4), 1); ctx.restore(); }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= I: Missile Pod: the hatch flips open =================
  const _mp = CASTS.missile_pod;
  CASTS.missile_pod = function (p, z) {
    const r = _mp.apply(this, arguments);
    if (!isM(G)) return r;
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 30, (ctx, sx, sy, t) => {
      const hx = sx - d * 6, hy = sy - 40, open = ease(Math.min(1, t / 4)) * (t > 26 ? (30 - t) / 4 : 1);
      art.rect(ctx, C.out, hx - 6, hy - 1, 12, 7); art.rect(ctx, C.st, hx - 5, hy, 10, 5); for (let i = 0; i < 3; i++) art.rect(ctx, C.out, hx - 4 + i * 3, hy + 1, 2, 2);   // the pod, its tubes
      ctx.save(); ctx.translate(hx - d * 6, hy); ctx.rotate(-d * open * 1.6); art.rect(ctx, C.out, d > 0 ? -1 : -11, -2, 12, 3); art.rect(ctx, C.or, d > 0 ? 0 : -10, -1, 10, 1); ctx.restore();   // the hatch
      if (t % 4 === 1 && t < 24) { ctx.save(); ctx.globalAlpha *= 0.8; art.disc(ctx, C.sm2, hx, hy - 4, 3); ctx.restore(); }
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= S+I: Ground Pound: jets on the way down, floor plates cracking =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.mako;
  if (BU && BU.cast) {
    const _gp = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _gp.apply(this, arguments);
      if (!isM(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
      z.shots.push(new Vis(p.x, p.y, 46, (ctx, sx, sy, t) => { if (drv && drv.gone) return; if (t >= 12) { jet(ctx, sx - 6, sy - 30, -PI / 2 - 0.15, 18, t, 1); jet(ctx, sx + 6, sy - 30, -PI / 2 + 0.15, 18, t + 1, 1); } else jet(ctx, sx, sy, PI / 2, 14, t, 0.8); }, v => { v.x = p.x; v.y = p.y; }));
      if (drv && drv.end) {
        const _e = drv.end;
        drv.end = function (q, zz) {
          const o = _e.apply(this, arguments), x = p.x, y = p.y;
          (zz || z).shots.push(new Vis(x, y, 40, (ctx, sx, sy, t) => {
            const k = t / 40, a = 1 - ease((k - 0.6) / 0.4);
            for (let i = 0; i < 8; i++) { const s = i % 2 ? 1 : -1, row = i >> 1, px = sx + s * (8 + row * 14), lift = Math.sin(Math.min(1, t / 5) * PI) * (6 - row) * (1 - k); ctx.save(); ctx.globalAlpha *= a; ctx.translate(R(px), R(sy - lift)); ctx.rotate(s * lift * 0.06); art.rect(ctx, C.out, -7, -3, 14, 4); art.rect(ctx, C.st, -6, -2, 12, 2); art.rect(ctx, C.st2, -6, -2, 12, 1); ctx.restore(); }   // the floor plates
            ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 6; i++) { const s = i % 2 ? 1 : -1; art.line(ctx, C.out, sx, sy - 1, R(sx + s * (16 + i * 9)), R(sy - 1 + (i % 3 - 1)), 1); } ctx.restore();   // cracks
          }));
          return o;
        };
      }
      return r;
    };
  }

  // ================= W+O: Field Repair: welding sparks, plates bolting back on =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.mako;
  if (SIG && SIG.cast) {
    const _fr = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _fr.apply(this, arguments);
      if (!isM(G)) return r;
      z.shots.push(new Vis(p.x, p.y, 30, (ctx, sx, sy, t) => {
        const spots = [[-8, -30], [8, -24], [-6, -14], [7, -36]];
        spots.forEach(([ox, oy], i) => { const k = clamp01((t - i * 5) / 8); if (k <= 0) return; const fx0 = sx + ox, fy0 = sy + oy - (1 - ease(k)) * 10; art.rect(ctx, C.out, R(fx0) - 4, R(fy0) - 3, 8, 6); art.rect(ctx, i % 2 ? C.or : C.st2, R(fx0) - 3, R(fy0) - 2, 6, 4); art.rect(ctx, C.st3, R(fx0) - 3, R(fy0) - 2, 1, 1); art.rect(ctx, C.st3, R(fx0) + 2, R(fy0) - 2, 1, 1);   // a plate, bolted
          if (k < 1 && t % 2 === 0) { art.rect(ctx, C.w, R(fx0) - 1, R(fy0) - 1, 2, 2); for (let j = 0; j < 3; j++) art.rect(ctx, j % 2 ? C.blue2 : C.or2, R(fx0 + Math.cos(t + j * 2) * 6), R(fy0 + Math.sin(t + j * 2) * 4), 1, 1); } });   // welding sparks
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= J: the last blow, the cannon kicks with a muzzle ring =================
  function dressJ(p, z) {
    const a = p.atk;
    if (!a || !a.fin || (p.state !== 'attack' && p.state !== 'airatk') || p.st !== a.hitAt) return;
    const d = p.face, x = p.x + d * 16, y = p.y - 22;
    z.shots.push(new Vis(x, y, 10, (ctx, sx, sy, t) => { const k = t / 10; ctx.save(); ctx.globalAlpha *= 1 - k; for (let j = 0; j < 14; j++) { const an = j / 14 * PI * 2; art.rect(ctx, j % 2 ? C.or2 : C.w, R(sx + d * 4 + Math.cos(an) * 2 * (2 + k * 6)), R(sy + Math.sin(an) * (4 + k * 12)), 1, 1); } ctx.restore(); }));
  }

  // ================= the small auras, and his plating =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (behind && p.modeT > 0) {   // Overdrive: exhaust pouring from his back
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade * 0.7;
      for (let i = 0; i < 4; i++) { const ph = ((t * 0.04 + i / 4) % 1); art.disc(ctx, C.sm2, R(sx - d * (8 + ph * 10)), R(sy - 30 - ph * 18), R(2 + ph * 3)); }
      ctx.restore();
    }
    if (!behind && p.modeT > 0) {   // vents glowing red-hot
      const fade = Math.min(1, p.modeT / 30), glow = t % 12 < 6 ? C.or2 : C.red;
      ctx.save(); ctx.globalAlpha *= fade; for (let i = 0; i < 3; i++) art.rect(ctx, glow, sx - d * 5, sy - 32 + i * 3, 2, 1); ctx.restore();
    }
    if (p.awakeT > 0) {   // Siege Mode: stabiliser legs planted, the missile pod open over his shoulder
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha *= fade;
      if (behind) [-1, 1].forEach(s => { art.line(ctx, C.out, sx + s * 5, sy - 10, sx + s * 15, sy, 4); art.line(ctx, C.st2, sx + s * 5, sy - 10, sx + s * 15, sy, 2); art.rect(ctx, C.st0, sx + s * 15 - 3, sy - 1, 6, 2); });
      else { const hx = sx - d * 6, hy = sy - 42; art.rect(ctx, C.out, hx - 6, hy - 1, 12, 6); art.rect(ctx, C.st, hx - 5, hy, 10, 4); for (let i = 0; i < 3; i++) art.rect(ctx, C.red, hx - 4 + i * 3, hy + 1, 2, 2); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isM(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isM(g || this.G) && z && z.shots && !this.dead) { dressShots(this, z); dressJ(this, z); } return r; };
  const TR = N.TRAITS && N.TRAITS.plating;
  if (TR && TR.mark) {   // his plating: a row of armour plates
    const _mk = TR.mark;
    TR.mark = function (ctx, p, x, y) {
      if (!MM.on) return _mk.apply(this, arguments);
      const n = p.plate === undefined ? 30 : p.plate, lit = Math.ceil(5 * Math.min(1, n / 30));
      for (let i = 0; i < 5; i++) { const bx = x - 12 + i * 5; art.rect(ctx, '#05060c', bx - 1, y - 54, 6, 5); art.rect(ctx, i < lit ? C.or : C.st0, bx, y - 53, 4, 3); if (i < lit) art.rect(ctx, C.pale, bx, y - 53, 4, 1); }
    };
  }

  // ================= W+I: Full Barrage: the cinematic finish =================
  const _fb = N.ULT && N.ULT.full_barrage;
  if (_fb) N.ULT.full_barrage = function (p, z, foes) {
    const r = _fb.apply(this, arguments);
    if (!isM(G) || !z || !z.shots) return r;
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('mako') >= 0) finale(p, z, T);
    }
    return r;
  };
  // (js/ult-cinema.js: the camera pushes in on the target from st 74, the blow at FIN): a shell the size of a car drops
  // over the target with Dyna's stripes on it, and bursts on an impact frame
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 24) return;
      const cy = sy - 22;
      if (st < FIN) {
        const k = ease((st - 74) / (FIN - 74)), y = cy - 52 + k * 30;   // (low enough to stay in the close-up)
        ctx.save(); ctx.translate(R(sx), R(y)); ctx.rotate(PI / 2); shell(ctx, 14, 0, 1, 2.4); ctx.restore();
        jet(ctx, sx, y - 28, -PI / 2, 10, st, 0.7);
      } else {
        const u = st - FIN, k = u / 24, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 103);
        blast(ctx, sx, cy, 60, Math.min(0.99, k), 0.7);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
