'use strict';
// Shattered Worlds — Tarn's long road (2026-11-20, the hero-look rework: cool, not cute). His story: the runner of the
// Surface post, who walked in front of the tear for nine hundred miles; nineteen days across the steppe; blue streaks
// behind him, a message in his shirt. His kicks were pale slash arcs and ghosts. Now the road is in every move, drawn as
// crisp pixel art by js/pixel-kit.js: each kick lands as the sole of a runner's boot stamped in blue light (heel, tread,
// the worn ball of the foot), his feet leave prints along the floor, blue streaks run behind him, and white mile posts
// flash past. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/ivo-dawn.js.
//   U      Step Kick: blue streaks behind him and a line of footprints along the floor; the kick stamps a boot sole
//   S+U    Rising Knee: a rising blue arc and dust thrown up from the planted foot
//   I      Hundred Paces: a boot sole stamps on every kick, footprints counting up ahead; the last a great boot print
//   S+I    Thousand Miles: as he switches sides, mile posts flash past and a boot sole lands on each kick
//   W+O    Gale Wheel: a wheel of kicking legs, radial blue streaks, road dust thrown off behind
//   J      his combo: a boot sole stamps on every kick
//   S+O    Second Wind: breath puffs in rhythm, his headband tails streaming      O  Open Road: a faint road with a centre
//          line under his feet, and a small mile post counting his hits in a row (small on purpose)
//   W+I    End of the Road: the road unrolls from his feet to the horizon, the violet tear far off, mile posts streaming
//          past; on the finishing blow (js/ult-grand.js) every mile comes in one punch: a great blue fist with the road's
//          centre line driving into the target on an impact frame
// SW.tarnRoad.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix, text = SW.text;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !CASTS.step_kick || !CASTS.hundred_paces) return;
  const TRd = SW.tarnRoad = { on: true };
  const isT = g => !!(TRd.on && g && g.state && g.state.hero === 'tarn');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const PAL = ['#06102a', '#0e2a6a', '#1d4fb0', '#3a86ff', '#7ab0ff', '#cfe0ff', '#ffffff', '#8a7a6a', '#c8b8a0', '#9b5de5', '#e0c8ff'];
  const C = { out: PAL[0], b0: PAL[1], b1: PAL[2], b: PAL[3], b2: PAL[4], pale: PAL[5], w: PAL[6], dust: PAL[7], dust2: PAL[8], tear: PAL[9], tear2: PAL[10] };

  // ---------- a boot sole, toe toward +y: (0, 0) its middle, s its length ----------
  function soleVec(c, s) {
    const u = s / 10;
    c.beginPath(); c.ellipse(0, -2.4 * u, 2.6 * u, 2.8 * u, 0, 0, PI * 2); c.fillStyle = C.b; c.fill();   // the ball of the foot
    c.beginPath(); c.ellipse(0, 3 * u, 2 * u, 2.2 * u, 0, 0, PI * 2); c.fill();                          // the heel
    c.fillRect(-1.6 * u, -1 * u, 3 * u, 3.4 * u);                                                         // the arch
    c.fillStyle = C.b2; c.beginPath(); c.ellipse(-0.6 * u, -3.2 * u, 1.4 * u, 1.5 * u, 0, 0, PI * 2); c.fill();   // the worn ball, lit
    c.fillStyle = C.b0; for (let i = -1; i <= 1; i++) c.fillRect(-2 * u, (-2.6 + i * 1.3) * u, 4 * u, Math.max(1, 0.45 * u));   // tread
    for (let i = 0; i < 2; i++) c.fillRect(-1.4 * u, (2.4 + i * 1.3) * u, 2.8 * u, Math.max(1, 0.45 * u));
  }
  function sole(ctx, x, y, s, rot, o) {
    o = o || {};
    PX.sprite(ctx, x, y, s * 1.6, s * 1.6, c => { c.rotate(rot || 0); soleVec(c, s); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  TRd.sole = sole;
  // a stamp: the sole lands with a ring of light, then fades (rot: the kick's direction)
  function stamp(z, x, y, dir, s, big) {
    z.shots.push(new Vis(x, y, big ? 14 : 9, (ctx, sx, sy, t) => {
      const k = t / (big ? 14 : 9), push = ease(Math.min(1, (t + 1) / 2));
      sole(ctx, Math.round(sx - dir * (6 - push * 6)), sy, s, dir > 0 ? -PI / 2 : PI / 2, { a: 1 - ease((k - 0.5) / 0.5), mono: big && t < 2 ? C.w : undefined });
      ctx.save(); ctx.globalAlpha = 1 - k; art.ring(ctx, k < 0.4 ? C.w : C.b2, sx + dir * 4, sy, Math.round(s * 0.5 + k * s)); ctx.restore();
    }));
  }
  // a footprint on the floor (seen from the side: a flat dark sole-mark and a scuff of dust), fading
  function footprint(z, x, y, n) {
    z.shots.push(new Vis(x, y, 70, (ctx, sx, sy, t) => { ctx.save(); ctx.globalAlpha = 0.85 * (1 - t / 70); art.rect(ctx, C.b1, sx - 3, sy - 1, 6, 1); art.rect(ctx, C.b, sx - 2, sy - 1, 2, 1); if (n !== undefined && t < 40) { ctx.globalAlpha *= 0.9; art.rect(ctx, C.pale, sx, sy - 3 - ((n % 2) ? 1 : 0), 1, 1); } ctx.restore(); }));
  }
  function streaks(ctx, x, y, dir, t, n, len) {   // blue speed streaks behind him
    ctx.save();
    for (let i = 0; i < (n || 6); i++) { const yy = y - 32 + i * 6 + ((t + i) % 2), L = (len || 22) + ((i * 7) % 12), off = ((t * 3 + i * 5) % 10); ctx.globalAlpha = 0.55 + (i % 2) * 0.3; art.line(ctx, i % 3 ? C.b : C.pale, Math.round(x - dir * (8 + off)), yy, Math.round(x - dir * (8 + off + L)), yy, 1); }
    ctx.restore();
  }
  function milePost(ctx, x, y, n, a) {   // a white mile post with a blue cap and its number
    ctx.save(); ctx.globalAlpha = clamp01(a);
    art.rect(ctx, C.out, x - 3, y - 17, 7, 17); art.rect(ctx, C.w, x - 2, y - 16, 5, 16); art.rect(ctx, C.b1, x - 2, y - 16, 5, 3); art.rect(ctx, C.pale, x + 2, y - 13, 1, 13);
    if (n !== undefined && text) text(ctx, String(n), x + 1, y - 11, C.b0, { align: 'center' });
    ctx.restore();
  }

  // ================= U: Step Kick: streaks and footprints =================
  const _sk = CASTS.step_kick;
  CASTS.step_kick = function (p, z) {
    const n0 = z.shots.length, r = _sk.apply(this, arguments);
    if (!isT(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), dir = p.face;
    if (drv) {
      const _st = drv.step; let hit = false;
      drv.step = function (t) { const out = _st.apply(this, arguments); if (t % 3 === 0) footprint(z, p.x - dir * 4, p.y, t); if (!hit && t === 3) { hit = true; stamp(z, p.x + dir * 22, p.y - 24, dir, 18, false); } return out; };
    }
    z.shots.push(new Vis(p.x, p.y, 14, (ctx, sx, sy, t) => { if (drv && drv.gone) return; streaks(ctx, sx, sy, dir, t, 7, 28); }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= the kicks that go through fx.slash =================
  const BLUE = '#cfe0ff';
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (!isT(g) || !p || !z || !z.shots) return _slash.apply(this, arguments);
    const d = dir || p.face;
    if (col === BLUE && len === 44) {   // Rising Knee: a rising blue arc and dust from the planted foot
      z.shots.push(new Vis(x, y, 12, (ctx, sx, sy, t) => { const k = t / 12; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = C.b2; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sx - d * 6, sy + 10, 20, d > 0 ? -PI * 0.5 : -PI * 0.5, d > 0 ? -PI * 0.5 + ease(k * 2) * 1.6 : -PI * 0.5 - ease(k * 2) * 1.6, d < 0); ctx.stroke(); ctx.strokeStyle = C.w; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }));
      stamp(z, x + d * 4, y - 4, d, 17, false);
      for (let i = 0; i < 8; i++) part(p.x + rand(-6, 6), p.y - 1, i % 2 ? C.dust : C.dust2, rand(-2, 2), -rand(1, 3), 18, 2, 0.15);
      return;
    }
    if (col === BLUE && (len === 26 || len === 40)) {   // Hundred Paces and Thousand Miles: a boot sole on every kick
      stamp(z, x, y, d, 16, false);
      if (len === 26) footprint(z, p.x + d * 6, p.y, 0);
      return;
    }
    if (col === '#ffffff' && len === 50) { stamp(z, x, y, d, 26, true); for (let i = 0; i < 3; i++) footprint(z, p.x + d * (8 + i * 8), p.y, i); return; }   // the last of Hundred Paces
    if (col === '#7dffb2' && len === 24) return;   // Gale Wheel: drawn below as a wheel of legs
    return _slash.apply(this, arguments);
  };

  // ================= S+I: Thousand Miles: mile posts flash past =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.tarn;
  if (BU && BU.cast) {
    const _tm = BU.cast;
    BU.cast = function (p, z) {
      const r = _tm.apply(this, arguments);
      if (!isT(G)) return r;
      const base = 100 + ((SW.frame / 7) | 0) % 800;
      z.shots.push(new Vis(p.x, p.y, 30, (ctx, sx, sy, t) => {
        for (let i = 0; i < 3; i++) { const u = ((t * 0.09 + i * 0.33) % 1), x = Math.round(sx + 120 - u * 240); milePost(ctx, x, sy, base + i + ((t / 10) | 0), Math.sin(u * PI) * 0.85); }   // the posts rush past behind the fight
        streaks(ctx, sx, sy, p.face, t, 5, 30);
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= W+O: Gale Wheel: a wheel of kicking legs =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.tarn;
  if (SIG && SIG.cast) {
    const _gw = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _gw.apply(this, arguments);
      if (!isT(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
      z.shots.push(new Vis(p.x, p.y, 18, (ctx, sx, sy, t) => {
        if (drv && drv.gone && t > 1) return;
        const cx = sx, cy = sy - 20, d = p.face;
        ctx.save();
        for (let i = 0; i < 8; i++) { const a = t * 0.7 * d + i * PI / 4, r0 = 6, r1 = 22; ctx.globalAlpha = 0.5 + (i % 2) * 0.4; art.line(ctx, i % 2 ? C.b2 : C.pale, Math.round(cx + Math.cos(a) * r0), Math.round(cy + Math.sin(a) * r0), Math.round(cx + Math.cos(a) * r1), Math.round(cy + Math.sin(a) * r1), 2); }
        ctx.restore();
        for (let i = 0; i < 2; i++) { const a = t * 0.7 * d + i * PI; sole(ctx, Math.round(cx + Math.cos(a) * 20), Math.round(cy + Math.sin(a) * 20), 10, a + PI / 2); }   // two soles at the rim
        if (t % 2 === 0) part(p.x - d * 14, p.y - 1, C.dust2, -d * rand(1, 3), -rand(0.5, 2), 16, 2, 0.12);   // road dust behind
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= his combo, and the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, a = p.atk;
    if (behind && p.awakeT > 0) {   // Open Road: a faint road with a centre line under his feet
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = 0.55 * fade; art.rect(ctx, C.b0, sx - 30, sy - 1, 60, 3); ctx.globalAlpha = 0.9 * fade; for (let x = -28; x < 28; x += 8) art.rect(ctx, C.pale, sx + x + ((p.t >> 1) % 8) * (d > 0 ? -1 : 1), sy, 4, 1); ctx.restore();
      return;
    }
    if (behind) return;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= -1 && k < 6) { const hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), reach = a.box ? a.box[0] + a.box[2] * 0.7 : 22, out = ease((k + 2) / 3); sole(ctx, Math.round(sx + d * (6 + reach * out)), Math.round(hy), 11, d > 0 ? -PI / 2 : PI / 2, { a: k < 3 ? 1 : 1 - (k - 3) / 3 }); if (k >= 0 && k < 3) { ctx.save(); ctx.globalAlpha = 1 - k / 3; art.ring(ctx, C.b2, sx + d * (10 + reach), hy, 6 + k * 3); ctx.restore(); } }
    }
    if (p.modeT > 0) {   // Second Wind: breath puffs in rhythm; headband tails streaming
      const fade = Math.min(1, p.modeT / 30), ph = p.t % 30, hx = sx + d * 6, hy = sy - (p.h || 34) + 6;
      if (ph < 10) { ctx.save(); ctx.globalAlpha = fade * (1 - ph / 10) * 0.8; art.rect(ctx, C.w, hx + d * (3 + ph), hy - 1, 2 + (ph >> 2), 2); ctx.restore(); }
      ctx.save(); ctx.globalAlpha = fade; for (let i = 0; i < 2; i++) { let x = sx - d * 3, y = sy - (p.h || 34) + 2 + i * 2; for (let j = 0; j < 5; j++) { const nx = x - d * 2, ny = y + Math.round(Math.sin(p.t * 0.4 + j + i) * 0.8); art.rect(ctx, C.b, nx, ny, 2, 1); x = nx; y = ny; } } ctx.restore();
    }
    if (p.awakeT > 0 && p.momN && SW.frame - (p.momAt || 0) <= 120) milePost(ctx, sx - d * 16, sy, p.momN, Math.min(1, p.awakeT / 30) * 0.9);   // Open Road: his hits in a row, counted in miles
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isT(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };

  // ================= W+I: End of the Road =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const L = fx.list, m = L.length, r = _uf.apply(this, arguments);
    if (!isT(g)) return r;
    for (let i = L.length - 1; i >= m; i--) if (L[i] && L[i].k === 'r' && L[i].col === BLUE) L.splice(i, 1);   // the plain rings: the road replaces them
    if (p.st === 6) {
      const d = p.face, gy = p.y;
      const road = new Vis(0, 0, 66, (ctx, x, y, t) => {   // (screen space) the road unrolls from his feet to the horizon, the tear far off
        if (p.state !== 'ult') return;
        const k = ease(t / 14), a = Math.min(1, (66 - t) / 8), fx0 = Math.round(p.x - G.cam.x), fy = Math.round(gy - G.cam.y), hx = fx0 + d * Math.round(W * 0.7 * k), hy = Math.round(H * 0.42);
        ctx.save(); ctx.globalAlpha = 0.75 * a;
        ctx.fillStyle = C.b1; ctx.beginPath(); ctx.moveTo(fx0 - 24, fy); ctx.lineTo(fx0 + 24, fy); ctx.lineTo(hx + 2, hy); ctx.lineTo(hx - 2, hy); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C.b2; ctx.lineWidth = 1; ctx.stroke();
        for (let i = 0; i < 12; i++) { const u0 = ((i / 12) + t * 0.02) % 1, u1 = u0 + 0.03; if (u1 > k) continue; art.line(ctx, C.pale, Math.round(fx0 + (hx - fx0) * u0), Math.round(fy + (hy - fy) * u0), Math.round(fx0 + (hx - fx0) * u1), Math.round(fy + (hy - fy) * u1), Math.max(1, Math.round(2 * (1 - u0)))); }   // the centre line, running
        ctx.globalAlpha = a * k; art.rect(ctx, C.tear, hx - 1, hy - 26, 3, 26); art.rect(ctx, C.tear2, hx, hy - 22, 1, 18); art.glow && art.glow(ctx, hx, hy - 13, 12, C.tear, 0.25);   // the tear, far off
        ctx.restore();
        for (let i = 0; i < 3; i++) { const u = ((t * 0.05 + i * 0.33) % 1), px = Math.round(fx0 + (hx - fx0) * (1 - u) + d * 14 * (1 - u)), py = Math.round(fy + (hy - fy) * (1 - u)); if (1 - u < k) milePost(ctx, px, py, 900 - Math.floor(t / 6) - i * 3, a * (0.4 + u * 0.6)); }   // posts streaming past
      });
      road.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      road._ugS = 1; z.shots.push(road);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): every mile in one punch - a great blue fist driving down the road's centre line
  function fistVec(c, s) {
    const u = s / 10;
    c.fillStyle = C.b; c.beginPath(); c.moveTo(-4 * u, -4 * u); c.lineTo(3 * u, -4.4 * u); c.quadraticCurveTo(5 * u, -4.2 * u, 5 * u, -2 * u); c.lineTo(5 * u, 2.6 * u); c.quadraticCurveTo(4.8 * u, 4.4 * u, 3 * u, 4.4 * u); c.lineTo(-4 * u, 4 * u); c.closePath(); c.fill();
    c.fillStyle = C.b2; c.fillRect(-3.4 * u, -3.6 * u, 7.6 * u, 1.5 * u);
    c.strokeStyle = C.b0; c.lineWidth = Math.max(1, u * 0.45); for (const y of [-1.8, 0.4, 2.6]) { c.beginPath(); c.moveTo(1.6 * u, y * u); c.lineTo(4.8 * u, y * u); c.stroke(); }
    c.fillStyle = C.w; c.fillRect(-2 * u, -1.4 * u, 4 * u, Math.max(1, 0.8 * u));   // the white wrap
  }
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('tarn') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    let done = false;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const dir = T.x >= p.x ? 1 : -1, cy = sy - 22;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2)), back = 70 - k * 30;
        ctx.save(); ctx.globalAlpha = 0.7 * k; for (let i = 0; i < 6; i++) { const u = ((st * 0.06 + i / 6) % 1); art.line(ctx, C.pale, Math.round(sx - dir * (back + 80 - u * 70)), cy, Math.round(sx - dir * (back + 74 - u * 70)), cy, 2); } ctx.restore();   // the centre line, running in
        PX.sprite(ctx, sx - dir * back, cy, 60, 50, c => { if (dir < 0) c.scale(-1, 1); fistVec(c, 22); }, { pal: PAL, alpha: Math.min(1, k * 3), outline: C.out, keepThin: true });
        streaks(ctx, sx - dir * (back - 10), sy, dir, st, 7, 34);
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? C.w : undefined;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 43);
        PX.sprite(ctx, sx - dir * 14, cy, 60, 50, c => { if (dir < 0) c.scale(-1, 1); fistVec(c, 22); }, { pal: PAL, alpha: 1 - ease((k - 0.55) / 0.45), mono, outline: C.out, keepThin: true });
        if (!done) { done = true; for (let i = 0; i < 20; i++) part(T.x + rand(-10, 10), T.y - rand(10, 34), i % 2 ? C.pale : C.b, dir * rand(1, 6), rand(-2, 2), 22, 2, 0.06); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult') return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
