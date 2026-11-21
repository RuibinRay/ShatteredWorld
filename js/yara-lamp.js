'use strict';
// Shattered Worlds — Yara's lamp (2026-11-20, the hero-look rework: cool, not cute). Her story: Subject 57, the marksman
// who lit the sea-wall lamp - "Lux taught her to put light on the string"; a pale longbow, olive, a yellow sash, lamp
// gold. Her arrows were a brown line and a glow. Now they are arrows - a wooden shaft, olive fletching, a steel head -
// with a lamp flame burning at the tip, brighter the further it flies; and when she aims at the sky the light comes
// back down like a lighthouse beam sweeping the water. Crisp pixel art; the beams are soft light. Draw-only: every hit,
// hitbox and timing stays as it was. Loaded after js/maren-tide.js.
//   U      Light Arrow: a real arrow, a lamp flame at its tip that grows as it flies
//   S+U    Vault Shot: a lamp-flash at the release mid-vault; the pinning arrow leaves a stake of light in the floor
//   I      Arrow Rain: the arrows fall as streaks of lamp light under a soft beam from above
//   S+I    Fan of Five: five lamp-tipped arrows fanning out like a lighthouse beam opening
//   W+O    Sky Lance: one arrow up; the six that come down each ride a beam of light sweeping in
//   J      her blows: quick arcs of lamp light
//   S+O    Steady Hand: a calm reticle ahead of her, a lamp glow on her drawing hand      O  Zenith Form: a lighthouse
//          lamp-halo behind her head with a slow turning beam (both small on purpose: the view stays clear)
//   W+I    Meridian: a lamp lights on the string as she draws, and the shot is a beam of lamplight the length of the
//          world; in the cinematic finish (js/ult-cinema.js) a lighthouse beam sweeps in and locks on the target, and
//          on the blow a shaft of light goes through it on an impact frame
// SW.yaraLamp.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.light_arrow || !CASTS.arrow_rain) return;
  const YL = SW.yaraLamp = { on: true };
  const isY = g => !!(YL.on && g && g.state && g.state.hero === 'yara');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#1a1408', wood: '#8a5a2a', wood2: '#b07a3a', ol: '#6b7a3a', ol2: '#a8b860', st: '#c8ccd8', g0: '#c08a10', g: '#ffd60a', g2: '#fff3b0', w: '#ffffff', beam: '#fff3b0' };

  function flame(ctx, x, y, s, t) {   // a lamp flame (x, y its base), s its size
    const f = (t >> 1) % 3;
    art.glow(ctx, R(x), R(y - s * 0.4), R(4 + s * 2), C.g, 0.18 + s * 0.02);
    art.rect(ctx, C.g0, R(x - s / 2), R(y - s), Math.max(2, R(s)), Math.max(2, R(s)));
    art.rect(ctx, C.g, R(x - s / 2) + 1, R(y - s * 1.4 - f), Math.max(1, R(s) - 2), Math.max(2, R(s * 1.2)));
    art.rect(ctx, C.w, R(x) - 1, R(y - s * 0.9), 2, Math.max(1, R(s * 0.6)));
  }
  // an arrow flying along (ux, uy) with its head at (x, y); far 0..1 how far it has flown
  function arrowAt(ctx, x, y, ux, uy, far, t) {
    const L = 22, tx = x - ux * L, ty = y - uy * L, nx = -uy, ny = ux;   // (2026-11-20 look ranking: heavier, the arrows were hairlines)
    art.line(ctx, C.out, R(tx), R(ty), R(x), R(y), 4); art.line(ctx, C.wood, R(tx), R(ty), R(x), R(y), 2);   // the shaft
    for (let j = 0; j < 2; j++) { const fx0 = tx + ux * j * 2, fy0 = ty + uy * j * 2; art.line(ctx, j ? C.ol2 : C.ol, R(fx0), R(fy0), R(fx0 - ux * 5 + nx * 4), R(fy0 - uy * 5 + ny * 4), 2); art.line(ctx, j ? C.ol2 : C.ol, R(fx0), R(fy0), R(fx0 - ux * 5 - nx * 4), R(fy0 - uy * 5 - ny * 4), 2); }   // fletching
    art.line(ctx, C.st, R(x - ux * 3 + nx * 3), R(y - uy * 3 + ny * 3), R(x + ux * 3), R(y + uy * 3), 2); art.line(ctx, C.st, R(x - ux * 3 - nx * 3), R(y - uy * 3 - ny * 3), R(x + ux * 3), R(y + uy * 3), 2);   // the head
    flame(ctx, x + ux * 2, y + uy * 2 + 1, 2 + (far || 0) * 4, t);
    ctx.save(); ctx.globalAlpha *= 0.5; art.line(ctx, C.g2, R(tx), R(ty), R(tx - ux * (6 + far * 14)), R(ty - uy * (6 + far * 14)), 1); ctx.restore();   // a thread of light behind
  }
  YL.arrowAt = arrowAt;
  function beam(ctx, x0, y0, x1, y1, w0, w1, a) {   // a soft wedge of lamplight from (x0, y0) to (x1, y1)
    if (a <= 0) return;
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    ctx.save();
    for (let i = 0; i < 3; i++) { const f = 1 - i * 0.33; ctx.globalAlpha = a * (0.12 + i * 0.1); ctx.fillStyle = i === 2 ? C.w : C.beam; ctx.beginPath(); ctx.moveTo(x0 + nx * w0 * f, y0 + ny * w0 * f); ctx.lineTo(x1 + nx * w1 * f, y1 + ny * w1 * f); ctx.lineTo(x1 - nx * w1 * f, y1 - ny * w1 * f); ctx.lineTo(x0 - nx * w0 * f, y0 - ny * w0 * f); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }

  // ================= every arrow of hers: a real arrow with a lamp at the tip =================
  function dressArrows(z) {
    z.shots.forEach(s => {
      if (!(s instanceof Proj) || s.yara) return;
      const plain = s.w === 10 && s.h === 6 && s.life === 46, rain = s.w === 10 && s.h === 16 && s.life === 44, fan = s.w === 12 && s.h === 8 && s.life === 40;
      if (!plain && !rain && !fan) return;
      s.yara = 1;
      s.render = (ctx, x, y, q) => { const m = Math.hypot(q.vx, q.vy) || 1; arrowAt(ctx, x, y, q.vx / m, q.vy / m, rain ? 0.6 : q.far || 0, q.t || 0); if (rain) { ctx.save(); ctx.globalAlpha *= 0.55; art.line(ctx, C.g2, R(x), R(y - 30), R(x), R(y - 14), 1); ctx.restore(); } };
      if (plain && s.heavy && s.status && s.status.freeze) {   // Vault Shot's pinning arrow: it leaves a stake of light in the floor
        const _e = s.onEnd;
        s.onEnd = function (g, zz) {
          const r = _e ? _e.apply(this, arguments) : undefined, x = this.x, y = this.y, m = Math.hypot(this.vx, this.vy) || 1, ux = this.vx / m, uy = this.vy / m;
          if (zz && zz.shots) zz.shots.push(new Vis(x, y, 60, (ctx, sx, sy, t) => { const a = t < 40 ? 1 : 1 - (t - 40) / 20; ctx.save(); ctx.globalAlpha *= a; arrowAt(ctx, sx, sy, ux, uy, 0.3, t); ctx.restore(); beam(ctx, sx, sy - 40, sx, sy, 1, 5, 0.6 * a); }));
          return r;
        };
      }
    });
  }

  // ================= S+U: Vault Shot: a lamp-flash at the release =================
  const _vs = CASTS.vault_shot;
  if (_vs) CASTS.vault_shot = function (p, z) {
    const r = _vs.apply(this, arguments);
    if (!isY(G)) return r;
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 14, (ctx, sx, sy, t) => { if (t < 7) return; const k = (t - 7) / 7; flame(ctx, sx + d * 10, sy - 18, 6 * (1 - k) + 1, t); ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; art.line(ctx, C.g2, R(sx + d * 10 + Math.cos(a) * 4), R(sy - 22 + Math.sin(a) * 4), R(sx + d * 10 + Math.cos(a) * (8 + k * 10)), R(sy - 22 + Math.sin(a) * (8 + k * 10)), 1); } ctx.restore(); }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= I: Arrow Rain: under a soft beam from above =================
  const _ar = CASTS.arrow_rain;
  CASTS.arrow_rain = function (p, z) {
    const e = isY(G) && N.ahead ? N.ahead(p, z, 220) : null, tx = e ? e.x : p.x + p.face * 110, r = _ar.apply(this, arguments);
    if (!isY(G)) return r;
    const gy = p.y;
    z.shots.push(new Vis(tx, gy, 40, (ctx, sx, sy, t) => { const a = Math.min(1, t / 6, (40 - t) / 8); beam(ctx, sx, sy - 160, sx, sy, 6, 18, 0.7 * a); }, v => { if (e && !e.dead) v.x = e.x; }));
    return r;
  };

  // ================= S+I: Fan of Five: a lighthouse beam opening =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.yara;
  if (BU && BU.cast) {
    const _ff = BU.cast;
    BU.cast = function (p, z) {
      const r = _ff.apply(this, arguments);
      if (!isY(G)) return r;
      const d = p.face, x0 = p.x + d * 8, y0 = p.y - 22;
      z.shots.push(new Vis(x0, y0, 12, (ctx, sx, sy, t) => { const k = t / 12, L = 40 + k * 60; [-0.28, -0.14, 0, 0.14, 0.28].forEach(a => beam(ctx, sx, sy, sx + d * Math.cos(a) * L, sy + Math.sin(a) * L, 1, 4, 0.8 * (1 - k))); flame(ctx, sx, sy + 2, 5 * (1 - k) + 1, t); }));
      return r;
    };
  }

  // ================= W+O: Sky Lance: beams sweeping down =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.yara;
  if (SIG && SIG.cast) {
    const _sl = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _sl.apply(this, arguments);
      if (!isY(G)) return r;
      const d = p.face;
      const dress = () => z.shots.forEach(s => {
        if (!s.paint || s.yara || s.style !== 'light') return;
        if (s.w === 2 && s.h === 2) { s.yara = 1; s.paint = (ctx, x, y, q) => arrowAt(ctx, x, y, 0, -1, 0.5, q.t || 0); }
        else if (s.w === 6 && s.h === 14) { s.yara = 1; s.paint = (ctx, x, y, q) => { const t = q.t || 0, a = Math.min(1, t / 4); beam(ctx, x - d * 30, y - 90, x, y, 4, 5, 0.7 * a); arrowAt(ctx, x, y, 0.06 * d, 1, 0.8, t); }; }
      });
      dress();
      z.shots.push(new Vis(p.x, p.y, 40, () => {}, () => dress()));   // (the six come later: dress them as they appear)
      return r;
    };
  }

  // ================= J: arcs of lamp light =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (col !== '#fff3b0' || !isY(g) || !p || !z || !z.shots || (p.state !== 'attack' && p.state !== 'airatk')) return _slash.apply(this, arguments);
    const d = dir || p.face, a = p.atk, fin = !!(a && a.fin), Rr = Math.max(12, Math.min(24, (len || 22) * 0.7)), life = fin ? 12 : 9, up = kind === 2 ? -1 : 1;
    z.shots.push(new Vis(x, y, life, (ctx, sx, sy, t) => {
      const k = t / life, sw = ease(Math.min(1, k * 3)), al = 1 - ease((k - 0.4) / 0.6);
      ctx.save(); ctx.globalAlpha *= al;
      let px, py; for (let i = 0; i <= 10; i++) { const u = i / 10; if (u > sw) break; const an = (d > 0 ? -1.1 * up : PI + 1.1 * up) + d * 2.2 * u * up, nx = sx - d * Rr * 0.3 + Math.cos(an) * Rr, ny = sy + Math.sin(an) * Rr; if (i) { art.line(ctx, C.g0, R(px), R(py), R(nx), R(ny), 3); art.line(ctx, i > 7 ? C.w : C.g2, R(px), R(py), R(nx), R(ny), 1); } px = nx; py = ny; }
      ctx.restore();
      if (fin && t < 6) flame(ctx, sx + d * Rr * 0.6, sy, 5, t);
    }));
  };

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (behind && p.awakeT > 0) {   // Zenith Form: a lighthouse lamp-halo behind her head, a slow turning beam
      const fade = Math.min(1, p.awakeT / 30), hx = sx - d * 2, hy = sy - 38, an = t * 0.03;
      beam(ctx, hx, hy, hx + Math.cos(an) * 34, hy + Math.sin(an) * 8, 1, 6, 0.45 * fade);
      ctx.save(); ctx.globalAlpha *= fade; for (let i = 0; i < 16; i++) { const a = i / 16 * PI * 2; art.rect(ctx, i % 2 ? C.g : C.g2, R(hx + Math.cos(a) * 8), R(hy + Math.sin(a) * 8), 1, 1); } ctx.restore();
    }
    if (!behind && p.modeT > 0) {   // Steady Hand: a calm reticle ahead of her, a lamp glow on her drawing hand
      const fade = Math.min(1, p.modeT / 30), rx = sx + d * 60, ry = sy - 22;
      ctx.save(); ctx.globalAlpha *= fade * 0.7;
      for (let i = 0; i < 4; i++) { const a = i * PI / 2 + t * 0.01; art.line(ctx, C.g2, R(rx + Math.cos(a) * 4), R(ry + Math.sin(a) * 4), R(rx + Math.cos(a) * 8), R(ry + Math.sin(a) * 8), 1); }
      art.rect(ctx, C.g, rx, ry, 1, 1);
      ctx.restore();
      art.glow(ctx, sx - d * 4, sy - 22, 6, C.g, 0.2 * fade);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isY(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isY(g || this.G) && z && z.shots) dressArrows(z); return r; };

  // ================= W+I: Meridian =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isY(g) || !z || !z.shots) return r;
    if (p.st === 8) {   // a lamp lights on the string as she draws
      z.shots.push(new Vis(p.x, p.y, 36, (ctx, sx, sy, t) => { if (p.state !== 'ult') return; flame(ctx, sx + p.face * 12, sy - 20, 2 + t / 6, t); }, v => { v.x = p.x; v.y = p.y; }));
    }
    if (p.st === 44) {   // the shot: a beam of lamplight the length of the world
      const y = p.y - 22, d = p.face, x0 = p.x + d * 14;
      const v = new Vis(x0, y, 18, (ctx, sx, sy, t) => { const k = t / 18, a = 1 - ease((k - 0.3) / 0.7); beam(ctx, sx, sy, sx + d * (W + 60), sy, 3 + (1 - k) * 4, 12 * (1 - k) + 3, a); ctx.save(); ctx.globalAlpha *= a; art.rect(ctx, C.w, d > 0 ? sx : sx - W - 60, sy - 1, W + 60, 2); ctx.restore(); });
      z.shots.push(v);
    }
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('yara') >= 0) finale(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 74, the blow at FIN): a lighthouse
  // beam sweeps in and locks on the target; on the blow a shaft of light goes through it on an impact frame
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 16) return;
      const cy = sy - 24;
      if (st < FIN) {
        const k = ease((st - 74) / (FIN - 74)), an = -PI / 2 - 0.9 + k * 0.9; beam(ctx, sx + Math.cos(an) * 120, cy + Math.sin(an) * 120, sx, cy, 3, 10 - k * 6, 0.5 + k * 0.4); flame(ctx, sx + Math.cos(an) * 110, cy + Math.sin(an) * 110 + 4, 6, st);
        const dir = T.x >= p.x ? 1 : -1, d = 30 + 26 * (1 - k), ux = dir, uy = 0;   // a great arrow, burning, aimed at them level with the eyes
        ctx.save(); ctx.translate(R(sx - ux * d), R(cy - uy * d)); ctx.scale(3, 3); arrowAt(ctx, 0, 0, ux, uy, 1, st); ctx.restore();
      }
      else {
        const u = st - FIN, k = u / 16, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 79);
        beam(ctx, sx, cy - 140, sx, cy + 30, 10 * (1 - k) + 2, 14 * (1 - k) + 2, 1 - ease((k - 0.4) / 0.6));
        if (ik >= 0.5 && k < 0.7) { const dir = T.x >= p.x ? 1 : -1; ctx.save(); ctx.globalAlpha *= 1 - k / 0.7; ctx.translate(R(sx + dir * (50 + k * 60)), R(cy)); ctx.scale(3, 3); arrowAt(ctx, 0, 0, dir, 0, 1, st); ctx.restore(); }   // through them and out the far side
        ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; art.line(ctx, i % 2 ? C.g : C.w, R(sx + Math.cos(a) * 6), R(cy + Math.sin(a) * 6), R(sx + Math.cos(a) * (14 + k * 30)), R(cy + Math.sin(a) * (14 + k * 30)), 1); } ctx.restore();
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
