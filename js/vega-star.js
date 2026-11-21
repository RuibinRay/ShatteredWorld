'use strict';
// Shattered Worlds — Vega's black star (2026-11-20, the hero-look rework: cool, not cute). Her look: "a small black
// sphere ringed in violet light over her palm, tiny stars orbiting it"; her story: named for a falling star, fell up
// into the dark between worlds, "came back carrying the weight of one". So her kit is that sphere at every size: a
// black star with a tilted ring, a true black hole with a turning disc of light, space itself sagging under her, and
// at the end the falling star she was named for. Crisp pixel art through js/pixel-kit.js. Draw-only: every hit,
// hitbox and timing stays as it was. Loaded after js/kael-storm.js.
//   U      Heavy Star: the black sphere, a violet ring, three tiny stars in orbit; light streaks into it as it pulls
//   S+U    Crush: the floor's grid sags round her and bars of weight come down
//   I      Singularity: a black hole: a turning disc of light, a bright ring bent round it, streaks spiralling in
//   S+I    Fall Up: a tear of night sky opens overhead and everything is drawn up into it
//   W+O    Gravity Well: two arms of starlight spiral into a dark centre
//   S+O    Zero-G: tiny stars circle her        O  Nova Form: two thin pylon rings hum at her feet (small on purpose)
//   W+I    Event Horizon: the stars come out, a great black sphere rises over the arena; at the finishing blow
//          (js/ult-grand.js) the falling star comes down on the target on an impact frame
// SW.vegaStar.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.heavy_star || !CASTS.singularity) return;
  const VS = SW.vegaStar = { on: true };
  const isV = g => !!(VS.on && g && g.state && g.state.hero === 'vega');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

  // the dark between worlds up to starlight; a little gold for her circlet and the falling star
  const PAL = ['#05030c', '#120a2a', '#2a1466', '#5a34c0', '#9d6cff', '#c8b0ff', '#ece4ff', '#ffffff', '#ffd86a', '#b8860b'];
  const C = { k: PAL[0], n0: PAL[1], n1: PAL[2], v0: PAL[3], v: PAL[4], l: PAL[5], p: PAL[6], w: PAL[7], g: PAL[8], gd: PAL[9] };

  // a four-point sparkle
  const spark = (c, x, y, r, col) => { poly(c, [[x, y - r], [x + r * 0.28, y], [x, y + r], [x - r * 0.28, y]], col); poly(c, [[x - r, y], [x, y - r * 0.28], [x + r, y], [x, y + r * 0.28]], col); };
  // half of a tilted ring (an elliptical band): back = the half behind the sphere
  function ringHalf(c, rx, ry, tilt, back, wd, col, hot) {
    c.save(); c.rotate(tilt);
    c.beginPath(); c.ellipse(0, 0, rx, ry, 0, back ? PI : 0, back ? PI * 2 : PI); c.ellipse(0, 0, Math.max(0.5, rx - wd), Math.max(0.3, ry - wd * 0.45), 0, back ? PI * 2 : PI, back ? PI : 0, true); c.closePath(); c.fillStyle = col; c.fill();
    if (hot !== undefined) { const a = hot, on = back ? Math.sin(a) < 0 : Math.sin(a) >= 0; if (on) { c.fillStyle = C.w; c.fillRect(Math.round(Math.cos(a) * (rx - wd / 2)) - 1, Math.round(Math.sin(a) * (ry - wd * 0.22)) - 1, 3, 2); } }
    c.restore();
  }
  // the black star: r its radius; o = { t, stars (how many orbit), hole (a black hole: a disc of light), squeeze }
  function starVec(c, r, o) {
    const t = o.t || 0, tilt = -0.36;
    if (o.hole) {   // the far side of the disc of light, bent up over the top
      ringHalf(c, r * 2.6, r * 0.8, tilt, true, r * 0.8, C.v0); ringHalf(c, r * 2.3, r * 0.66, tilt, true, r * 0.4, C.l, t * 0.2);
      c.beginPath(); c.arc(0, 0, r * 1.28, PI, PI * 2); c.arc(0, 0, r * 1.05, PI * 2, PI, true); c.closePath(); c.fillStyle = C.p; c.fill();   // light bent round the top
    } else ringHalf(c, r * 1.9, r * 0.55, tilt, true, Math.max(1.5, r * 0.3), C.v, t * 0.25);
    c.beginPath(); c.arc(0, 0, r, 0, PI * 2); c.fillStyle = C.k; c.fill();
    c.beginPath(); c.arc(0, 0, r, -2.5, -0.9); c.arc(-r * 0.12, r * 0.14, r * 0.94, -0.9, -2.5, true); c.closePath(); c.fillStyle = C.n1; c.fill();   // a rim of dim light
    if (o.hole) { ringHalf(c, r * 2.6, r * 0.8, tilt, false, r * 0.8, C.v); ringHalf(c, r * 2.3, r * 0.66, tilt, false, r * 0.4, C.w, t * 0.2); ringHalf(c, r * 1.5, r * 0.4, tilt, false, r * 0.25, C.g); }
    else ringHalf(c, r * 1.9, r * 0.55, tilt, false, Math.max(1.5, r * 0.3), C.l, t * 0.25);
    for (let i = 0; i < (o.stars || 0); i++) { const a = t * 0.13 + i * PI * 2 / o.stars, x = Math.cos(a) * r * 2.5, y = Math.sin(a) * r * 1.1 - Math.cos(a) * r * 0.5; spark(c, x, y, Math.max(2, r * 0.42), i % 2 ? C.g : C.w); }
  }
  function star(ctx, x, y, r, o) { o = o || {}; const b = r * (o.hole ? 6.2 : 6); PX.sprite(ctx, x, y, b, b * 0.8, c => starVec(c, r, o), { pal: PAL, alpha: o.a, mono: o.mono, outline: PAL[1] }); }
  VS.star = star;
  // light falling into (x, y): n streaks spiralling in from radius R
  function infall(ctx, x, y, R, t, n, a) {
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    for (let i = 0; i < n; i++) { const ph = ((t * 0.035 + rnd(i, 1)) % 1), ang = rnd(i, 2) * PI * 2 + ph * 2.4, r0 = R * (1 - ph), r1 = R * (1 - Math.min(1, ph + 0.16)); art.line(ctx, i % 3 ? '#c8b0ff' : '#ffffff', Math.round(x + Math.cos(ang) * r0), Math.round(y + Math.sin(ang) * r0 * 0.7), Math.round(x + Math.cos(ang + 0.38) * r1), Math.round(y + Math.sin(ang + 0.38) * r1 * 0.7), 1); }
    ctx.restore();
  }
  // a field of stars over a rectangle of screen (fixed stars that twinkle)
  function starfield(ctx, x0, y0, w, h, t, n, a) {
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    for (let i = 0; i < n; i++) { const tw = Math.sin(t * 0.15 + i * 1.7); if (tw < -0.5) continue; const x = Math.round(x0 + rnd(i, 5) * w), y = Math.round(y0 + rnd(i, 6) * h); art.rect(ctx, i % 5 === 0 ? '#ffd86a' : i % 2 ? '#ffffff' : '#c8b0ff', x, y, 1, 1); if (i % 7 === 0 && tw > 0.6) { art.rect(ctx, '#ffffff', x - 1, y, 3, 1); art.rect(ctx, '#ffffff', x, y - 1, 1, 3); } }
    ctx.restore();
  }

  // ================= U and I: the wells =================
  function wellDraw(ctx, cam) {
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), held = this.t > this.travel, left = (this.travel + this.hold) - this.t;
    if (this.big) {   // Singularity
      infall(ctx, x, y, this.r * 0.8, this.t, 14);
      star(ctx, x, y, 11 + Math.sin(this.t * 0.3) * 0.6, { t: this.t, hole: true, stars: 0 });
      if (this.tick && this.t % this.tick < 3) { ctx.save(); ctx.globalAlpha = 0.7; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 30, 18, -0.36, 0, PI * 2); ctx.stroke(); ctx.restore(); }   // each grind
    } else {   // Heavy Star: it shrinks just before it bursts
      if (held) infall(ctx, x, y, this.r * 0.75, this.t, 9);
      star(ctx, x, y, left < 8 ? Math.max(2, 7 * left / 8) : 7, { t: this.t, stars: 3 });
    }
  }
  ['heavy_star', 'singularity'].forEach(id => {
    const f0 = CASTS[id];
    CASTS[id] = function (p, z) {
      const n0 = z.shots.length, r = f0.apply(this, arguments);
      if (isV(G)) z.shots.slice(n0).forEach(s => { if (s.travel !== undefined && s.hold !== undefined && s.r) s.draw = wellDraw; });
      return r;
    };
  });

  // ================= S+U: Crush: space sags =================
  const _cr = CASTS.crush;
  CASTS.crush = function (p, z) {
    const r = _cr.apply(this, arguments);
    if (!isV(G)) return r;
    const v = new Vis(p.x, p.y, 22, (ctx, sx, sy, t) => {
      const k = ease(t / 5), a = 1 - ease((t - 12) / 10), dip = 9 * k;
      ctx.save(); ctx.globalAlpha = a;
      for (let j = 0; j < 4; j++) {   // the grid lines along the floor, bending down toward her
        let px = sx - 120, py = sy - 2 - j * 3;
        for (let i = 1; i <= 24; i++) { const x = sx - 120 + i * 10, u = (x - sx) / 120, y = sy - 2 - j * 3 + dip * Math.exp(-u * u * 9) * (1 - j * 0.2); art.line(ctx, j % 2 ? '#5a34c0' : '#9d6cff', Math.round(px), Math.round(py), Math.round(x), Math.round(y), 1); px = x; py = y; }
      }
      for (let i = -6; i <= 6; i++) { const x = sx + i * 18, u = i * 18 / 120; art.line(ctx, '#5a34c0', Math.round(x), sy - 11, Math.round(x - u * 6 * k), Math.round(sy - 2 + dip * Math.exp(-u * u * 9)), 1); }
      for (let i = 0; i < 9; i++) { const x = sx - 108 + i * 27, y1 = sy - 96 + ease(t / 6) * 84; art.line(ctx, '#ffffff', x, sy - 120, x, Math.round(y1), 1); art.rect(ctx, '#ece4ff', x - 2, Math.round(y1), 5, 2); }   // bars of weight coming down
      ctx.restore();
      if (t < 8) star(ctx, sx, sy - 48 + t * 2, 9, { t, stars: 0, a: 1 - t / 8 });   // the black star over her, pressing down
    });
    v._ugS = 1; z.shots.push(v);
    return r;
  };

  // ================= S+I: Fall Up: a tear of night sky overhead =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.vega;
  if (BU && BU.cast) {
    const _fu = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _fu.apply(this, arguments);
      if (!isV(G)) return r;
      const vis = z.shots.slice(n0).find(s => s.life === 64 && s.render); if (!vis) return r;
      vis.render = (ctx, x, y, t) => {
        const k = ease(t / 8) * (t > 54 ? (64 - t) / 10 : 1), down = t >= 46;
        ctx.save(); ctx.globalAlpha = 0.9 * k; ctx.fillStyle = '#05030c'; ctx.beginPath(); ctx.ellipse(x, y - 118, 58 * k, 16 * k, 0, 0, PI * 2); ctx.fill();   // the tear
        ctx.strokeStyle = '#9d6cff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 118, 58 * k, 16 * k, 0, 0, PI * 2); ctx.stroke(); ctx.restore();
        starfield(ctx, x - 50 * k, y - 130, 100 * k, 24, t, 26, k);
        ctx.save(); ctx.globalAlpha = 0.5 * k;   // everything in the column streams up into it (and back down at the end)
        for (let i = 0; i < 12; i++) { const px = x - 50 + ((i * 37) % 100), ph = ((t * (down ? -7 : 5) + i * 29) % 110 + 110) % 110; art.line(ctx, i % 3 ? '#c8b0ff' : '#ffffff', px, Math.round(y - ph), px, Math.round(y - ph - 9), 1); }
        ctx.restore();
        art.rect(ctx, '#c8b0ff', x - 54, y - 1, 108, 1);
      };
      return r;
    };
  }

  // ================= W+O: Gravity Well: a spiral of starlight =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.vega;
  if (SIG && SIG.cast) {
    const _gw = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _gw.apply(this, arguments);
      if (!isV(G)) return r;
      const s0 = z.shots.slice(n0).find(s => s.life === 50 && s.paint); if (!s0) return r;
      s0.paint = (ctx, sx, sy, s) => {
        const a = s.t > 42 ? (50 - s.t) / 8 : Math.min(1, s.t / 5);
        ctx.save(); ctx.globalAlpha = a;
        for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 16; i++) {   // two arms of stars winding in
          const u = i / 16, ang = arm * PI + u * 5 + s.t * 0.16, rr = 52 * (1 - u * 0.85), x = Math.round(sx + Math.cos(ang) * rr), y = Math.round(sy + Math.sin(ang) * rr * 0.6);
          art.rect(ctx, i % 4 === 0 ? '#ffd86a' : i % 2 ? '#ffffff' : '#c8b0ff', x, y, i < 5 ? 2 : 1, i < 5 ? 2 : 1);
        }
        ctx.restore();
        star(ctx, sx, sy, 6, { t: s.t, stars: 0, a });
      };
      return r;
    };
  }

  // ================= S+O and O: small =================
  function aura(ctx, p, sx, sy, front) {
    if (p.modeT > 0) { const fade = Math.min(1, p.modeT / 30); for (let i = 0; i < 3; i++) { const a = p.t * 0.09 + i * 2.09, sn = Math.sin(a); if ((sn >= 0) !== front) continue; ctx.save(); ctx.globalAlpha = fade; const x = Math.round(sx + Math.cos(a) * 15), y = Math.round(sy - 22 + sn * 5); art.rect(ctx, i % 2 ? '#ffd86a' : '#ffffff', x - 1, y, 3, 1); art.rect(ctx, i % 2 ? '#ffd86a' : '#ffffff', x, y - 1, 1, 3); ctx.restore(); } }   // tiny stars circle her
    if (p.awakeT > 0 && !front) {   // two thin pylon rings humming at her feet: she held a city up
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = 0.8 * fade; ctx.lineWidth = 1;
      for (let i = 0; i < 2; i++) { const u = ((p.t * 0.02 + i * 0.5) % 1); ctx.strokeStyle = i ? '#c8b0ff' : '#9d6cff'; ctx.beginPath(); ctx.ellipse(sx, sy - u * 8, 12 + u * 4, 3 + u, 0, 0, PI * 2); ctx.stroke(); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isV(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };

  // ================= W+I: Event Horizon =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isV(g)) return r;
    if (p.st === 6) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('vega') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const sky = new Vis(p.x, p.y, 500, (ctx) => {   // (screen space) the stars come out, and a great black sphere rises over the arena
        const st = p.st; if (p.state !== 'ult' || st > BU2 + 4) return;
        const k = ease((st - 6) / 12), a = st > BU2 - 6 ? 1 - (st - (BU2 - 6)) / 10 : 1;
        ctx.save(); ctx.globalAlpha = 0.5 * k * a; ctx.fillStyle = '#05030c'; ctx.fillRect(0, 0, W, H); ctx.restore();
        starfield(ctx, 0, 0, W, 150, st, 70, k * a);
        infall(ctx, W / 2, 70, 150, st, 16, k * a);
        star(ctx, W / 2, 70 + 60 * (1 - k), 26, { t: st, hole: true, stars: 4, a: k * a });
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the falling star: a white-gold head and a long tail, from (x0, y0) to (x1, y1), k how far it has come
  function comet(ctx, x0, y0, x1, y1, k, mono) {
    const hx = x0 + (x1 - x0) * k, hy = y0 + (y1 - y0) * k, ang = Math.atan2(y1 - y0, x1 - x0), L = 150;
    PX.sprite(ctx, hx - Math.cos(ang) * L * 0.45, hy - Math.sin(ang) * L * 0.45, L * 1.3, L * 1.3, c => {
      c.translate(Math.cos(ang) * L * 0.45, Math.sin(ang) * L * 0.45); c.rotate(ang);
      poly(c, [[6, -9], [-L, -2], [-L, 2], [6, 9]], C.v0); poly(c, [[6, -7], [-L * 0.8, -1], [-L * 0.8, 1], [6, 7]], C.v); poly(c, [[7, -5], [-L * 0.55, 0], [7, 5]], C.g); poly(c, [[8, -3], [-L * 0.3, 0], [8, 3]], C.w);
      c.beginPath(); c.arc(4, 0, 9, 0, PI * 2); c.fillStyle = C.g; c.fill(); c.beginPath(); c.arc(5, 0, 6, 0, PI * 2); c.fillStyle = C.w; c.fill();
      spark(c, 5, 0, 16, C.w);
    }, { pal: PAL, mono, outline: PAL[2] });
  }
  // the finishing blow: the black star holds the target while the falling star she was named for comes down on it
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 20, x0 = sx - dir * 110, y0 = cy - 130;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 10), fall = clamp01((st - (FIN - 12)) / 12);
        starfield(ctx, sx - 110, cy - 64, 220, 70, st, 40, k);
        infall(ctx, sx, cy, 70, st, 14, k);
        star(ctx, sx - dir * 2, cy - 30, 10, { t: st, hole: true, stars: 3, a: k });   // the weight of a star, hanging over them
        if (fall > 0) comet(ctx, x0, y0, sx, cy, fall);   // seen coming for the last half-dozen frames
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 71);
        if (k < 0.5) comet(ctx, x0, y0, sx, cy, 1, ik < 0.5 ? '#ffffff' : undefined);
        ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#ffd86a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy, 12 + k * 110, 3 + k * 16, 0, 0, PI * 2); ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx, sy, 8 + k * 70, 2 + k * 10, 0, 0, PI * 2); ctx.stroke(); ctx.restore();   // the shock along the floor
        if (st === FIN) for (let i = 0; i < 26; i++) part(T.x + rand(-14, 14), T.y - rand(0, 30), i % 3 ? '#ffffff' : '#ffd86a', rand(-5, 5), -rand(1, 6), 24, 2, 0.14);
      }
    };
    // on the top layer: js/ult-grand.js draws its own dark sphere over the target, and the falling star must be seen
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - (v.f0o === undefined ? (v.f0o = SW.frame) : v.f0o) > 400 || !(G.player === p || (SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p)))) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
