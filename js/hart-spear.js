'use strict';
// Shattered Worlds — Hart's long spear (2026-11-20, the hero-look rework: cool, not cute). His story: caravan guard of the
// long road; "keep your distance. He will keep it for you." His look: a very long spear held on the diagonal, its tip
// glinting; a green cap with a red band. His thrusts were cream slash arcs and his thrown spear a brown bar. Now every
// thrust is the spear itself, drawn as crisp pixel art by js/pixel-kit.js: an ash shaft bound in red cord under the head,
// a long leaf-shaped steel blade with a bright edge and a fuller, a red horsehair tassel, shooting out to full reach and
// snapping back, with a star of light on the tip. Draw-only: every hit, hitbox and timing stays as it was. Loaded after
// js/tor-shield.js.
//   U      Long Thrust: the spear shoots out to its full reach, a glint running down to the tip
//   S+U    Pole Vault: the spear planted in the floor, bending under him; then a downward stab streak
//   I      Hundred Thrusts: a fan of spear tips flickering out, then one long thrust
//   S+I    Skewer Rush: the spear levelled ahead, speed lines along it, dust at the foe's heels
//   W+O    Spear Throw: the whole spear flies out spinning end over end and comes back to his hand
//   J      the finisher, and his trait's auto-thrust: the spear with a long tip glint
//   S+O    Keen Eye: his reach drawn on the floor before him; the tip glints when a foe steps inside
//   O      Dragon Lance: a small red-gold dragon of light coils round his hand (small on purpose: the view stays clear)
//   W+I    A Thousand Spears: real spears rain across the arena; on the finishing blow (js/ult-grand.js) the tip glints at
//          eye level beside the target, then one great spear drives through it on an impact frame
// SW.hartSpear.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !CASTS.long_thrust || !CASTS.pole_vault) return;
  const HS = SW.hartSpear = { on: true };
  const isH = g => !!(HS.on && g && g.state && g.state.hero === 'hart');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const PAL = ['#100c0a', '#3a2614', '#6a4a2a', '#a68a64', '#5a6070', '#a8b4c8', '#e0e6f0', '#ffffff', '#6a1a1c', '#bc4749', '#e87a6a', '#f2e8cf', '#ffd24a'];
  const C = { out: PAL[0], w0: PAL[1], w1: PAL[2], w2: PAL[3], s0: PAL[4], s1: PAL[5], s2: PAL[6], w: PAL[7], r0: PAL[8], r: PAL[9], r2: PAL[10], cream: PAL[11], gold: PAL[12] };

  // ---------- the spear, lying along +x: (0, 0) the butt, L its length; the head is the last 22% ----------
  function spearVec(c, L, o) {
    const hd = Math.min(18, L * 0.22), sh = L - hd, t = Math.max(1.5, L / 60);
    c.fillStyle = C.w1; c.fillRect(0, -t, sh, t * 2); c.fillStyle = C.w2; c.fillRect(0, -t, sh, Math.max(1, t * 0.7));   // the ash shaft, lit on top
    c.fillStyle = C.s0; c.fillRect(0, -t - 0.5, 2, t * 2 + 1);   // the butt cap
    c.fillStyle = C.r; c.fillRect(sh - 6, -t - 0.5, 5, t * 2 + 1); c.fillStyle = C.r0; c.fillRect(sh - 4, -t - 0.5, 1, t * 2 + 1);   // red cord binding
    if (o.tassel !== false) { const sw = o.sway || 0; c.fillStyle = C.r; c.beginPath(); c.moveTo(sh - 3, t); c.lineTo(sh - 9 + sw, t + 7); c.lineTo(sh - 2 + sw, t + 6); c.closePath(); c.fill(); c.fillStyle = C.r2; c.fillRect(sh - 6 + sw * 0.5, t + 2, 1, 3); }   // the horsehair tassel
    const hw = Math.max(2.5, hd * 0.24);   // the leaf-shaped blade
    c.beginPath(); c.moveTo(sh - 1, 0); c.quadraticCurveTo(sh + hd * 0.35, -hw * 1.3, sh + hd, 0); c.quadraticCurveTo(sh + hd * 0.35, hw * 1.3, sh - 1, 0); c.closePath(); c.fillStyle = C.s1; c.fill();
    c.beginPath(); c.moveTo(sh, 0); c.quadraticCurveTo(sh + hd * 0.35, -hw * 1.2, sh + hd, 0); c.lineTo(sh + hd * 0.4, -hw * 0.2); c.closePath(); c.fillStyle = C.s2; c.fill();   // the lit edge
    c.fillStyle = C.s0; c.fillRect(sh + 1, -0.5, hd * 0.6, 1);   // the fuller
  }
  // as a sprite: (x, y) the butt, ang its direction, L its length
  function spear(ctx, x, y, L, ang, o) {
    o = o || {};
    const cx = x + Math.cos(ang) * L / 2, cy = y + Math.sin(ang) * L / 2, box = L + 24;
    PX.sprite(ctx, cx, cy, box, box, c => { c.rotate(ang); c.translate(-L / 2, 0); spearVec(c, L, o); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  HS.spear = spear;
  function glint(ctx, x, y, k, s) {   // a four-point star of light on the tip
    if (k <= 0 || k >= 1) return;
    const L = Math.round((s || 7) * Math.sin(k * PI));
    ctx.save(); art.line(ctx, C.w, x - L, y, x + L, y, 1); art.line(ctx, C.w, x, y - L, x, y + L, 1); art.rect(ctx, C.gold, x - 1, y - 1, 3, 3); art.rect(ctx, C.w, x, y, 1, 1); ctx.restore();
  }
  // a thrust: the spear shoots out from his hands to reach R and snaps back (screen space, re-anchored on him each frame)
  function thrustVis(z, p, R, o) {
    o = o || {};
    const dir = p.face, life = o.life || 10, up = o.up || 0;
    const v = new Vis(p.x, p.y, life, (ctx, sx, sy, t) => {
      const out = t < 2 ? ease((t + 1) / 3) : 1 - ease((t - 3) / (life - 3)), L = 54 + (R - 30) * out * 0.6, hx = sx - dir * (14 - 20 * out), hy = sy - 22 + up;
      if (out <= 0.02) return;
      spear(ctx, hx, hy, L, dir > 0 ? 0 : PI, { sway: t % 2, a: o.a });
      const tx = hx + dir * L;
      if (t >= 1 && t < 5) glint(ctx, Math.round(tx), Math.round(hy), (t - 1) / 4, o.big ? 11 : 7);
      if (t < 3 && out > 0.6) { ctx.save(); ctx.globalAlpha = 0.6; art.line(ctx, C.cream, Math.round(hx + dir * L * 0.3), Math.round(hy - 2), Math.round(tx - dir * 4), Math.round(hy - 2), 1); ctx.restore(); }   // the glint running down to the tip
    }, vv => { vv.x = p.x; vv.y = p.y; });
    z.shots.push(v);
  }
  // every thrust of his kit goes through fx.slash in the cream colour: draw the spear instead of the arc
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player;
    if (col === '#f2e8cf' && isH(g) && p && Math.abs(y - (p.y - 22)) < 4 && g.zone && g.zone.shots) {
      const R = len || 90;
      thrustVis(g.zone, p, R, { big: R >= 96 });
      return;
    }
    return _slash.apply(this, arguments);
  };

  // ================= S+U: Pole Vault: the spear planted, bending under him =================
  const _pv = CASTS.pole_vault;
  CASTS.pole_vault = function (p, z) {
    const n0 = z.shots.length, r = _pv.apply(this, arguments);
    if (!isH(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face, px0 = p.x + dir * 28, py0 = p.y;
    z.shots.push(new Vis(px0, py0, 30, (ctx, sx, sy, t) => {
      if (drv && drv.gone) return;
      const hx = Math.round(p.x - G.cam.x), hy = Math.round(p.y - G.cam.y) - 20;
      if (t < 12) {   // planted: a bent shaft from the floor to his hands
        const bend = Math.sin(clamp01(t / 10) * PI) * 10, n = 8;
        ctx.save(); for (let i = 0; i < n; i++) { const u0 = i / n, u1 = (i + 1) / n, b0 = Math.sin(u0 * PI) * bend, b1 = Math.sin(u1 * PI) * bend; art.line(ctx, i % 2 ? C.w1 : C.w2, Math.round(sx + (hx - sx) * u0 - b0 * dir), Math.round(sy + (hy - sy) * u0), Math.round(sx + (hx - sx) * u1 - b1 * dir), Math.round(sy + (hy - sy) * u1), 2); } ctx.restore();
        art.rect(ctx, C.s1, sx - 1, sy - 3, 3, 3);
      } else {   // over the top: the spear turned point-down, a streak below it
        spear(ctx, hx - 6, hy - 34, 56, PI / 2, { tassel: false });
        ctx.save(); ctx.globalAlpha = 0.7; for (let i = 0; i < 3; i++) art.line(ctx, C.cream, hx - 4 + i * 4, hy + 24, hx - 4 + i * 4, hy + 40, 1); ctx.restore();
      }
    }));
    return r;
  };

  // ================= S+I: Skewer Rush: the spear levelled, speed lines =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.hart;
  if (BU && BU.cast) {
    const _sr = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _sr.apply(this, arguments);
      if (!isH(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face;
      z.shots.push(new Vis(p.x, p.y, 24, (ctx, sx, sy, t) => {
        if (drv && drv.gone) return;
        spear(ctx, sx - dir * 10, sy - 20, 80, dir > 0 ? 0.05 : PI - 0.05, { sway: t % 3 - 1 });
        PX.lines(ctx, sx - dir * 20, sy - 20, dir > 0 ? PI : 0, 50, 7, t, C.cream, 30);
        if (t % 2 === 0) part(p.x + dir * 66, p.y - 2, '#c8a878', -dir * rand(1, 3), -rand(0.5, 2), 14, 2, 0.12);   // dust at the foe's heels
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= W+O: Spear Throw: the whole spear, spinning =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.hart;
  if (SIG && SIG.cast) {
    const _sp = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _sp.apply(this, arguments);
      if (!isH(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint && !s.render) return;
        const draw = (ctx, x, y, q) => { const t = q.t || 0, d = Math.sign(q.vx) || 1, a = t < 18 ? (d > 0 ? 0 : PI) + Math.sin(t * 0.4) * 0.08 : t * 0.7; spear(ctx, x - Math.cos(a) * 34, y - Math.sin(a) * 34, 68, a, { sway: t % 3 - 1 }); if (t < 18 && t % 6 < 2) glint(ctx, Math.round(x + d * 34), y, 0.5, 6); };
        if (s.paint) { const _p = s.paint; s.paint = function (ctx, x, y, q) { if (!isH(G)) return _p.apply(this, arguments); draw(ctx, x, y, q || this); }; }
        else if (s.render) { const _r = s.render; s.render = function (ctx, x, y, q) { if (!isH(G)) return _r.apply(this, arguments); draw(ctx, x, y, q || this); }; }
      });
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face;
    if (p.modeT > 0) {   // Keen Eye: his reach drawn on the floor before him; the tip glints when a foe steps inside
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha = 0.6 * fade;
      for (let i = 0; i <= 20; i++) { const a = -PI / 2 + i / 20 * PI, x = Math.round(sx + d * Math.cos(a) * 52), y = Math.round(sy + Math.sin(a) * 4); art.rect(ctx, i % 4 ? C.cream : C.r, x, y, 1, 1); }
      ctx.restore();
      const z = G.zone, e = z && z.ents.find(q => N.isFoe(q) && (q.x - p.x) * d > 8 && Math.abs(q.x - p.x) < 52 && Math.abs(q.y - p.y) < 30);
      if (e) glint(ctx, sx + d * 50, sy - 22, ((p.t % 20) / 20), 6);
    }
    if (p.awakeT > 0) {   // Dragon Lance: a small dragon of red-gold light coils round his hand
      const fade = Math.min(1, p.awakeT / 30), hx = sx + d * 8, hy = sy - 22;
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < 12; i++) { const a = p.t * 0.2 - i * 0.45, x = Math.round(hx + Math.cos(a) * 6), y = Math.round(hy - 6 + i * 1.2 + Math.sin(a) * 2); art.rect(ctx, i === 0 ? C.gold : i % 2 ? C.r : C.r2, x, y, i === 0 ? 2 : 1, i === 0 ? 2 : 1); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isH(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: A Thousand Spears =================
  const _ts = N.ULT && N.ULT.thousand_spears;
  if (_ts) N.ULT.thousand_spears = function (p, z, foes) {
    const n0 = z.shots.length, r = _ts.apply(this, arguments);
    if (!isH(G)) return r;
    z.shots.slice(n0).forEach(v => {   // the falling spears: real spears, point down
      if (!(v instanceof Vis) || v.life !== 14 || !v.render) return;
      v._ugS = 1; v.render = (ctx, sx, sy, t) => { const y = sy + t * 16; spear(ctx, sx, y - 44, 44, PI / 2, { tassel: true, sway: t % 2 }); };
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the tip glints at eye level beside the target; then one great spear drives
  // through it on an impact frame
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('hart') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    let dusted = false;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const dir = T.x >= p.x ? 1 : -1, cy = sy - 22;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2)), back = 60 + 20 * ease((st - (FIN - 8)) / 8);
        spear(ctx, sx - dir * (back + 70), cy, 70, dir > 0 ? 0 : PI, { a: Math.min(1, k * 3), sway: st % 3 - 1 });   // drawn back, aimed at them
        if (st % 10 < 5) glint(ctx, Math.round(sx - dir * back), cy, (st % 10) / 5, 9);
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? C.w : undefined, push = ease(Math.min(1, (st - FIN) / 2));
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 59);
        spear(ctx, sx - dir * (170 - push * 120), cy, 150, dir > 0 ? 0 : PI, { mono, a: 1 - ease((k - 0.55) / 0.45) });   // through them
        if (!dusted) { dusted = true; for (let i = 0; i < 18; i++) part(T.x + dir * rand(0, 20), T.y - rand(10, 34), i % 2 ? C.cream : C.s2, dir * rand(1, 5), rand(-2, 2), 20, 2, 0.08); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
