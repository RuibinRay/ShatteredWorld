'use strict';
// Shattered Worlds — Garo's forged wheel (2026-11-20, the hero-look rework: cool, not cute). His story: the smith and
// gatekeeper of the Hidden village; "throws once, hits twice"; his look: a four-bladed shuriken as wide as his chest,
// forged from a Halcyon drill bit the width of a door, sparks glancing off its edge. His wheel was four lines round a
// dot. It is now a forged shuriken drawn as crisp pixel art by js/pixel-kit.js: four hooked blades of blued steel with a
// bright honed edge and hammer marks, a drill-bit spiral at the hub, a bronze ring rivet; it spins with a smear and
// throws sparks off its edge. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/oda-bell.js.
//   U      Wheel Throw: the shuriken spins out and back, sparks off its edge; a spark ring when he catches it
//   S+U    Iron Guard: the shuriken held flat before him as a wall, sparks off everything it stops, then the shove
//   I      Grind Wheel: the shuriken rolls on its edge with a rooster-tail of sparks off the floor
//   S+I    Meteor Wheel: it comes down red-hot like metal fresh off the forge and leaves a glowing crater
//   W+O    Twin Wheels: two shuriken, one high, one low, with spark trails
//   J      his combo: the shuriken in his hand cuts through every hit; the last throws a spark ring
//   S+O    Iron Will: forge glow along his arms      O  Iron Mountain: an anvil glow at his feet, embers rising (small on
//          purpose: the view stays clear)
//   W+I    A Thousand Wheels: shuriken cross the arena; the house-sized one comes down red-hot; on the finishing blow
//          (js/ult-grand.js) a hammer rings on it over the target - one burst of sparks - and it falls, on an impact frame
// SW.garoWheel.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.wheel_throw || !CASTS.iron_guard || !CASTS.grind_wheel) return;
  const GW = SW.garoWheel = { on: true };
  const isG = g => !!(GW.on && g && g.state && g.state.hero === 'garo');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // blued steel, the honed edge, bronze; forge heat
  const PAL = ['#0c0e16', '#1e2433', '#2b2d42', '#4a5570', '#8d99ae', '#c5cedd', '#edf2f4', '#ffffff', '#6a4a20', '#b0823a', '#ffd166', '#ff8a3a', '#e0401a', '#801a10'];
  const C = { out: PAL[0], d1: PAL[1], d2: PAL[2], m: PAL[3], s: PAL[4], l: PAL[5], edge: PAL[6], w: PAL[7], br0: PAL[8], br: PAL[9], spark: PAL[10], hot: PAL[11], hot2: PAL[12], hot3: PAL[13] };

  // ---------- the shuriken, (0, 0) its hub, r its radius; o.heat 0-1 turns it forge-hot ----------
  function wheelVec(c, r, o) {
    const heat = o.heat || 0, body = heat > 0.66 ? C.hot2 : heat > 0.33 ? C.hot3 : C.m, face = heat > 0.66 ? C.hot : heat > 0.33 ? C.hot2 : C.s, edge = heat > 0.5 ? C.spark : C.edge;
    for (let i = 0; i < 4; i++) {
      c.save(); c.rotate(i * PI / 2);
      // a hooked blade: wide at the root, sweeping to a point, the cutting edge on the leading side
      c.beginPath(); c.moveTo(-r * 0.2, -r * 0.18); c.quadraticCurveTo(r * 0.35, -r * 0.42, r * 1.0, -r * 0.14); c.quadraticCurveTo(r * 0.6, r * 0.02, r * 0.18, r * 0.2); c.closePath(); c.fillStyle = body; c.fill();
      c.beginPath(); c.moveTo(-r * 0.1, -r * 0.16); c.quadraticCurveTo(r * 0.35, -r * 0.36, r * 0.92, -r * 0.14); c.quadraticCurveTo(r * 0.5, -r * 0.14, r * 0.12, -r * 0.02); c.closePath(); c.fillStyle = face; c.fill();
      c.strokeStyle = edge; c.lineWidth = Math.max(1, r * 0.06); c.beginPath(); c.moveTo(r * 0.05, -r * 0.24); c.quadraticCurveTo(r * 0.4, -r * 0.4, r * 0.98, -r * 0.15); c.stroke();   // the honed edge
      if (r >= 10) { c.fillStyle = heat > 0.5 ? C.hot3 : C.d2; c.fillRect(r * 0.42, -r * 0.18, Math.max(1, r * 0.06), Math.max(1, r * 0.06)); c.fillRect(r * 0.62, -r * 0.13, Math.max(1, r * 0.05), Math.max(1, r * 0.05)); }   // hammer marks
      c.restore();
    }
    // the hub: a bronze ring round the drill-bit spiral
    c.beginPath(); c.arc(0, 0, r * 0.3, 0, PI * 2); c.fillStyle = C.br; c.fill();
    c.beginPath(); c.arc(0, 0, r * 0.22, 0, PI * 2); c.fillStyle = C.d1; c.fill();
    c.strokeStyle = heat > 0.5 ? C.spark : C.l; c.lineWidth = Math.max(1, r * 0.05);
    c.beginPath(); for (let k = 0; k <= 20; k++) { const a = k / 20 * PI * 3, rr = r * 0.2 * (1 - k / 22); if (k) c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.stroke();
  }
  // as a sprite: (x, y) the hub; o = { spin (radians), heat, a, mono, flat (seen edge-on: squashed, for the guard and the roll) }
  function wheel(ctx, x, y, r, o) {
    o = o || {};
    PX.sprite(ctx, x, y, r * 2.4 + 4, r * 2.4 + 4, c => { if (o.flat) c.scale(o.flat, 1); c.rotate(o.spin || 0); wheelVec(c, r, o); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: r < 9 });
  }
  GW.wheel = wheel;
  function smear(ctx, x, y, r, t, heat) {   // the blur of the blade tips: arcs just inside the rim
    ctx.save(); ctx.globalAlpha = 0.6;
    for (let k = 0; k < 4; k++) { const a0 = t * 0.6 + k * PI / 2; for (let i = 1; i < 5; i++) { const a = a0 - i * 0.12; art.rect(ctx, heat ? C.hot : C.l, Math.round(x + Math.cos(a) * r * 0.92), Math.round(y + Math.sin(a) * r * 0.92), r > 14 ? 2 : 1, r > 14 ? 2 : 1); } }
    ctx.restore();
  }
  const sparks = (x, y, n, vx, vy, hot) => { for (let i = 0; i < n; i++) part(x + rand(-2, 2), y + rand(-2, 2), i % 3 ? C.spark : hot ? C.hot : C.w, vx + rand(-1.5, 1.5), vy + rand(-1.5, 1), 10 + (i % 5) * 2, 1, 0.2); };
  const isWheel = s => !!(s && s.render && /wheel\(ctx/.test(String(s.render)));

  // ================= every wheel he throws =================
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.garo || !(s instanceof Proj) || !isWheel(s)) return;
      s.garo = 1;
      const meteor = s.w === 28 && !s.ghost, roll = !!s.breaker && s.rehit === 7;
      s.render = (ctx, x, y, q) => {
        const r = Math.round((q.r || 13) * 1.4), spin = q.t * (roll ? 0.45 : 0.6) * (q.vx < 0 ? -1 : 1), heat = meteor ? 1 : 0;
        if (meteor) { ctx.save(); ctx.globalAlpha = 0.6; for (let i = 1; i < 6; i++) art.rect(ctx, i % 2 ? C.hot : C.spark, Math.round(x - q.vx * i * 1.4), Math.round(y - q.vy * i * 1.4), 5, 5); ctx.restore(); }   // a trail of heat
        wheel(ctx, x, y, r + 2, { spin, heat });
        smear(ctx, x, y, r + 2, q.t, heat);
      };
      const tick = s.think;
      s.think = function () {
        const r = tick ? tick.apply(this, arguments) : undefined;
        if (this.t % 3 === 0) { const a = this.t * 0.6, rr = (this.r || 13) + 2; sparks(this.x + Math.cos(a) * rr, this.y + Math.sin(a) * rr, 1, -this.vx * 0.3, -1, meteor); }   // sparks off the edge
        if (roll && this.t % 2 === 0) sparks(this.x - Math.sign(this.vx) * 4, this.y + (this.r || 14), 3, -Math.sign(this.vx) * 3, -3.5, false);   // the rooster-tail
        if (this.gone && !this.garoCaught && !meteor && p && Math.abs(p.x - this.x) < 18) { this.garoCaught = 1; const px = p.x, py = p.y; z.shots.push(new Vis(px, py, 10, (ctx, sx, sy, t) => { ctx.save(); ctx.globalAlpha = 1 - t / 10; art.ring(ctx, C.spark, sx, sy - 24, 6 + t * 2); art.ring(ctx, C.w, sx, sy - 24, 3 + t * 2); ctx.restore(); })); sparks(px, py - 24, 8, 0, -1, false); }
        return r;
      };
    });
  }
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isG(g || this.G) && z && z.shots) dress(this, z); return r; };
  const _wt = CASTS.wheel_throw;
  CASTS.wheel_throw = function (p, z) { const r = _wt.apply(this, arguments); if (isG(G)) dress(p, z); return r; };
  const _gw = CASTS.grind_wheel;
  CASTS.grind_wheel = function (p, z) { const r = _gw.apply(this, arguments); if (isG(G)) dress(p, z); return r; };

  // ================= S+U: Iron Guard: the shuriken held flat as a wall =================
  let guardUntil = -1, guardDir = 1;   // while it is up, the shots it stops throw sparks off it
  const _sp = fx.spark;
  fx.spark = function (x, y, col) { if (col === '#edf2f4' && SW.frame < guardUntil) sparks(x, y, 8, -guardDir * 2, -1, false); return _sp.apply(this, arguments); };
  const _ig = CASTS.iron_guard;
  CASTS.iron_guard = function (p, z) {
    const n0 = z.shots.length, r = _ig.apply(this, arguments);
    if (!isG(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face;
    if (drv) {
      const _st = drv.step;
      drv.step = function () {
        const m = z.shots.length, out = _st.apply(this, arguments);
        z.shots.slice(m).forEach(s => { if (s instanceof Vis && s.life === 1 && s.render) s.render = (ctx, x, y) => { wheel(ctx, x + dir * 15, y - 22, 17, { spin: SW.frame * 0.05, flat: 0.45 }); if (SW.frame % 6 < 2) art.rect(ctx, C.w, x + dir * 17, y - 34, 1, 1); }; });
        return out;
      };
      const _end = drv.end;
      drv.end = function () { const out = _end ? _end.apply(this, arguments) : undefined; sparks(p.x + dir * 24, p.y - 22, 14, dir * 3, -1.5, false); z.shots.push(new Vis(p.x, p.y, 10, (ctx, sx, sy, t) => wheel(ctx, sx + dir * (16 + ease(t / 4) * 18), sy - 22, 22, { spin: t * 0.4, flat: 0.45 + t * 0.05, a: 1 - ease((t - 5) / 5) }))); return out; };
    }
    // sparks off everything it stops
    guardUntil = SW.frame + 34; guardDir = dir;
    return r;
  };

  // ================= S+I: Meteor Wheel: red-hot, a glowing crater =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.garo;
  if (BU && BU.cast) {
    const _mw = BU.cast;
    BU.cast = function (p, z) {
      const r = _mw.apply(this, arguments);
      if (!isG(G)) return r;
      const v = new Vis(p.x, p.y, 70, null, vv => {
        const m = z.shots.find(s => s instanceof Proj && s.w === 28 && !s.ghost && isWheel(s) || (s.garo && s.w === 28 && !s.ghost));
        if (m) { vv.mx = m.x; vv.my = m.y; vv.seen = true; dress(p, z); }
        else if (vv.seen && !vv.crater) { vv.crater = vv.t; const x = vv.mx, y = N.floorY ? N.floorY(z, vv.mx, vv.my - 10) : vv.my; sparks(x, y - 4, 26, 0, -4, true); z.shots.push(new Vis(x, y, 60, (ctx, sx, sy, t) => { const k = t / 60, ik = t / 5; if (ik < 1) PX.impact(ctx, sx, sy - 10, ik, 29); ctx.save(); ctx.globalAlpha = 1 - k; art.rect(ctx, C.hot3, sx - 22, sy - 2, 44, 3); art.rect(ctx, C.hot2, sx - 16, sy - 2, 32, 2); art.rect(ctx, C.spark, sx - 8, sy - 2, 16, 1); for (let i = 0; i < 3; i++) { const u = ((t * 0.03 + i * 0.33) % 1); art.rect(ctx, C.hot, Math.round(sx - 10 + i * 10 + Math.sin(t * 0.2 + i) * 2), Math.round(sy - 4 - u * 18), 1, 1); } ctx.restore(); })); vv.gone = true; }
      });
      z.shots.push(v);
      return r;
    };
  }

  // ================= W+O: Twin Wheels =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.garo;
  if (SIG && SIG.cast) {
    const _tw = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _tw.apply(this, arguments);
      if (!isG(G)) return r;
      const watch = new Vis(p.x, p.y, 14, null, () => {   // the two arrive a few frames apart (later): dress each as it appears
        (G.zone ? G.zone.shots : []).forEach(s => {
          if (s.garoTw || !s.paint || !s.back || s.life !== 34) return;
          s.garoTw = 1;
          s.paint = (ctx, x, y, q) => { ctx.save(); ctx.globalAlpha = 0.7; for (let i = 1; i < 5; i++) art.rect(ctx, i % 2 ? C.spark : C.w, Math.round(x - (q.vx || 0) * i * 1.6), Math.round(y + (i % 2)), 1, 1); ctx.restore(); wheel(ctx, x, y, 16, { spin: q.t * 0.7 }); smear(ctx, x, y, 16, q.t); };
        });
      });
      z.shots.push(watch);
      void n0;
      return r;
    };
  }

  // ================= his combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // the shuriken in his hand cuts through every hit
      const k = p.st - a.hitAt, set = p.comboSet ? p.comboSet() : null, last = !!(set && a === set[set.length - 1]);
      if (k >= -2 && k < 6) {
        const hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), reach = a.box ? a.box[0] + a.box[2] * 0.55 : 22, q = ease((k + 2) / 3);
        wheel(ctx, sx + d * (6 + reach * q), hy, last ? 13 : 11, { spin: d * (q * 3 + p.t * 0.2), a: k < 3 ? 1 : 1 - (k - 3) / 3 });
        if (k >= 0 && k < 3) for (let i = 0; i < 3; i++) art.rect(ctx, i % 2 ? C.spark : C.w, Math.round(sx + d * (6 + reach + 6 + i * 3)), Math.round(hy - 4 + i * 3), 1, 1);
      }
      if (last && k >= 0 && k < 10) { const bx = sx + d * ((a.box ? a.box[0] + a.box[2] : 30) + 4), q = k / 10; ctx.save(); ctx.globalAlpha = 1 - q; art.ring(ctx, C.spark, bx, sy - 22, Math.round(6 + q * 22)); art.ring(ctx, C.w, bx, sy - 22, Math.round(3 + q * 16)); ctx.restore(); }
    }
    if (p.modeT > 0) {   // Iron Will: forge glow along his arms
      const fade = Math.min(1, p.modeT / 30), pulse = 0.5 + 0.5 * Math.sin(p.t * 0.15);
      ctx.save(); ctx.globalAlpha = fade * (0.5 + pulse * 0.4);
      for (const o of [-5, 5]) { art.rect(ctx, C.hot2, sx + o, sy - 24, 1, 8); art.rect(ctx, C.spark, sx + o, sy - 22, 1, 3); }
      ctx.restore();
      if (p.t % 12 === 0) part(p.x + rand(-6, 6), p.y - 20, C.hot, rand(-0.3, 0.3), -0.6, 18, 1, -0.01);
    }
    if (p.awakeT > 0) {   // Iron Mountain: an anvil glow at his feet, embers rising
      const fade = Math.min(1, p.awakeT / 30), pulse = 0.5 + 0.5 * Math.sin(p.t * 0.1);
      ctx.save(); ctx.globalAlpha = fade * (0.45 + pulse * 0.35); art.rect(ctx, C.hot3, sx - 12, sy - 1, 24, 2); art.rect(ctx, C.hot2, sx - 8, sy - 1, 16, 1); ctx.restore();
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < 4; i++) { const u = ((p.t * 0.015 + i * 0.25) % 1), x = sx - 9 + i * 6 + Math.sin(p.t * 0.05 + i) * 2; art.rect(ctx, u < 0.5 ? C.spark : C.hot, Math.round(x), Math.round(sy - 2 - u * 30), 1, 1); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isG(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: A Thousand Wheels =================
  const _tk = N.ULT && N.ULT.thousand_wheels;
  if (_tk) N.ULT.thousand_wheels = function (p, z, foes) {
    const n0 = z.shots.length, r = _tk.apply(this, arguments);
    if (!isG(G)) return r;
    z.shots.slice(n0).forEach(v => {
      if (!(v instanceof Vis) || !v.render) return;
      v._ugS = 1;
      if (v.life === 60) { const d = v.x < G.cam.x + W / 2 ? 1 : -1; v.render = (ctx, x, yy, t) => { const xx = x + d * t * 10; wheel(ctx, xx, yy, 15, { spin: t * 0.7 * d }); if (t % 2 === 0) art.rect(ctx, C.spark, Math.round(xx - d * 12), yy + 2, 1, 1); }; }
      else if (v.life === 14) v.render = (ctx, x, y, t) => { const yy = Math.round(-40 + t * 14); wheel(ctx, W / 2, yy, 64, { spin: t * 0.25, heat: 0.7 }); smear(ctx, W / 2, yy, 64, t, true); };   // the house-sized one, red-hot
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the giant shuriken hangs over the target, a hammer rings on its hub - one burst
  // of sparks - and it comes down on them on an impact frame
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('garo') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    let sparked = false;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const cy = sy - 36;   // low enough for the pushed-in view
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 10), heat = clamp01((st - (BU2 + 4)) / 14), strike = FIN - 10, hk = st - strike;
        wheel(ctx, sx, cy + (1 - k) * -40, 44, { spin: st * 0.03, heat, a: k });
        if (hk > -8 && hk < 6) {   // the hammer: a heavy head on a haft, swung down onto the hub
          const ang = hk < 0 ? -1.2 + ease((hk + 8) / 8) * 1.2 : 0, hx = sx + 40, hy = cy - 10;
          ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); ctx.scale(1.6, 1.6);
          art.rect(ctx, C.br0, -2, 0, 4, 30); art.rect(ctx, C.out, -12, -8, 24, 12); art.rect(ctx, C.s, -11, -7, 22, 10); art.rect(ctx, C.l, -11, -7, 22, 2);
          ctx.restore();
          if (hk >= 0 && hk < 4) { ctx.save(); ctx.globalAlpha = 1 - hk / 4; art.ring(ctx, C.spark, sx + 14, cy - 4, 8 + hk * 12); art.ring(ctx, C.w, sx + 14, cy - 4, 4 + hk * 8); ctx.restore(); }
        }
        if (hk === 0 && !sparked) { sparked = true; sparks(T.x + 10, T.y - 38, 30, 0, -2, true); }
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, drop = ease(Math.min(1, (st - FIN) / 2));
        if (ik < 1) PX.impact(ctx, sx, sy - 24, ik, 37);
        wheel(ctx, sx, cy + drop * 22, 44, { spin: st * 0.3, heat: 1, mono: ik < 0.5 ? C.w : undefined, a: 1 - ease((k - 0.55) / 0.45) });
        if (st === FIN) sparks(T.x, T.y - 10, 36, 0, -4, true);
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
