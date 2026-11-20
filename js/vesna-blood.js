'use strict';
// Shattered Worlds — Vesna's blood scythe (2026-11-20; the user: "improve weapon look as well like the vampire scythe").
// Her look: "a scythe whose blade is liquid blood, drops floating upward round her". Everything she does is that
// blade, her bats and the red moon: tall crescent sweeps of blood with a white-hot edge, bats with torn wings, drops
// that rise instead of falling. Crisp pixel art through js/pixel-kit.js. Draw-only: hits and timing are unchanged.
// (Her scythe itself, on her sprite, is drawn by js/weapon-looks.js.)
//   U      Blood Needle: a long barbed lance of blood with a white core
//   S+U    Crimson Step: she breaks into a streak of bats and comes out with one crescent cut
//   I      Blood Moon Scythe: two great crescents of blood, the first forward and down, the second back over her head
//   S+I    Hemorrhage: a clawed wound opens on the target; with every beat, blood streams back to her
//   W+O    Red Rain: spears of blood fall under a sliver of red moon
//   J x4   the finisher: a quick crescent from the scythe
//   S+O    Open Veins: drops of blood rise round her
//   O      Red Moon: the moon rises behind her, wings of blood open from her back, bats burst out
//   W+I    Crimson Eclipse: the red moon is eclipsed over the arena, bats cross it, blood streams to her; at the
//          finishing blow (js/ult-grand.js) a giant blood scythe hangs over the target and comes down on an impact frame
// SW.vesnaBlood.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.blood_moon_scythe) return;
  const VB = SW.vesnaBlood = { on: true };
  const isV = g => !!(VB.on && g && g.state && g.state.hero === 'vesna');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };

  // black-red up to white
  const PAL = ['#0e0206', '#3a0008', '#6a040f', '#9d0208', '#d00000', '#e5383b', '#ffb3b3', '#ffffff'];
  const B = { k: PAL[0], d0: PAL[1], d1: PAL[2], m: PAL[3], r: PAL[4], l: PAL[5], p: PAL[6], w: PAL[7] };

  // ================= shapes =================
  // a crescent of blood: an arc of radius R from angle `tail` to `lead`, thick at the lead (T), a point at the tail
  function crescentVec(c, R, tail, lead, T) {
    const n = 18, layer = (k0, k1, col) => {
      const out = [], inn = [];
      for (let i = 0; i <= n; i++) { const u = i / n, a = tail + (lead - tail) * u, th = T * Math.pow(u, 0.75); out.push([Math.cos(a) * (R - th * k0), Math.sin(a) * (R - th * k0)]); inn.unshift([Math.cos(a) * (R - th * k1), Math.sin(a) * (R - th * k1)]); }
      poly(c, out.concat(inn), col);
    };
    layer(0, 1, B.d1); layer(0.12, 0.92, B.r); layer(0.5, 0.92, B.l); layer(0.8, 1, B.w);   // dark back, red body, bright belly, a white-hot cutting edge
    const a = lead, th = T;   // the lead end: a hooked point
    poly(c, [[Math.cos(a) * R, Math.sin(a) * R], [Math.cos(a) * (R - th), Math.sin(a) * (R - th)], [Math.cos(a + (lead > tail ? 0.2 : -0.2)) * (R - th * 0.3), Math.sin(a + (lead > tail ? 0.2 : -0.2)) * (R - th * 0.3)]], B.p);
  }
  // a bat: (0, 0) its body, s its wingspan / 2; pose 0 wings up, 1 level, 2 down
  function batVec(c, s, pose) {
    const up = pose === 0 ? -1 : pose === 2 ? 0.7 : -0.15;
    for (const d of [-1, 1]) {
      poly(c, [[d * s * 0.08, -s * 0.04], [d * s * 0.5, s * 0.5 * up - s * 0.08], [d * s, s * 0.34 * up + s * 0.06], [d * s * 0.76, s * 0.2 * up + s * 0.2], [d * s * 0.62, s * 0.1 * up + s * 0.1], [d * s * 0.46, s * 0.16 * up + s * 0.26], [d * s * 0.32, s * 0.08], [d * s * 0.16, s * 0.22], [d * s * 0.06, s * 0.1]], B.d0);
      poly(c, [[d * s * 0.08, -s * 0.04], [d * s * 0.5, s * 0.5 * up - s * 0.08], [d * s, s * 0.34 * up + s * 0.06], [d * s * 0.5, s * 0.3 * up + s * 0.0]], B.m);   // the leading edge catches the light
    }
    poly(c, [[0, -s * 0.2], [s * 0.1, 0], [0, s * 0.26], [-s * 0.1, 0]], B.k);
    poly(c, [[-s * 0.1, -s * 0.12], [-s * 0.07, -s * 0.34], [0, -s * 0.16]], B.k); poly(c, [[s * 0.1, -s * 0.12], [s * 0.07, -s * 0.34], [0, -s * 0.16]], B.k);   // ears
    c.fillStyle = B.p; c.fillRect(-Math.max(1, s * 0.07), -s * 0.1, Math.max(1, s * 0.05), Math.max(1, s * 0.05)); c.fillRect(Math.max(1, s * 0.03), -s * 0.1, Math.max(1, s * 0.05), Math.max(1, s * 0.05));   // eyes
  }
  // a lance of blood pointing +x
  function lanceVec(c, L) {
    poly(c, [[L * 0.55, 0], [L * 0.05, -L * 0.1], [-L * 0.5, -L * 0.03], [-L * 0.62, 0], [-L * 0.5, L * 0.03], [L * 0.05, L * 0.1]], B.m);
    poly(c, [[L * 0.55, 0], [L * 0.05, -L * 0.06], [-L * 0.5, -L * 0.015], [-L * 0.5, L * 0.015], [L * 0.05, L * 0.06]], B.r);
    poly(c, [[L * 0.55, 0], [L * 0.0, -L * 0.025], [-L * 0.45, 0], [L * 0.0, L * 0.025]], B.w);
    poly(c, [[L * 0.12, -L * 0.08], [-L * 0.08, -L * 0.2], [L * 0.0, -L * 0.07]], B.l); poly(c, [[L * 0.12, L * 0.08], [-L * 0.08, L * 0.2], [L * 0.0, L * 0.07]], B.l);   // barbs
  }
  // the red moon, r its radius; ecl 0-1 how far the black disc has slid across it
  function moonVec(c, r, ecl) {
    c.beginPath(); c.arc(0, 0, r, 0, PI * 2); c.fillStyle = B.r; c.fill();
    c.beginPath(); c.arc(-r * 0.2, -r * 0.2, r * 0.72, 0, PI * 2); c.fillStyle = B.l; c.fill();
    for (const q of [[0.3, 0.2, 0.2], [-0.35, 0.3, 0.14], [0.1, -0.4, 0.12], [-0.1, 0.55, 0.1]]) { c.beginPath(); c.arc(q[0] * r, q[1] * r, q[2] * r, 0, PI * 2); c.fillStyle = B.m; c.fill(); }
    if (ecl > 0) { c.beginPath(); c.arc(r * 2.1 * (1 - ecl), 0, r * 0.97, 0, PI * 2); c.fillStyle = B.k; c.fill(); }
  }
  // a wing of blood from her back: (0, 0) the root, opening to +x
  function wingVec(c, s, open) {
    const o = 0.3 + 0.7 * open;
    poly(c, [[0, 0], [s * 0.5 * o, -s * 0.6], [s * 1.0 * o, -s * 0.5], [s * 0.86 * o, -s * 0.22], [s * 0.94 * o, s * 0.12], [s * 0.66 * o, s * 0.0], [s * 0.7 * o, s * 0.34], [s * 0.42 * o, s * 0.14], [s * 0.4 * o, s * 0.5], [s * 0.18 * o, s * 0.2], [s * 0.1, s * 0.42]], B.d1);
    poly(c, [[0, 0], [s * 0.5 * o, -s * 0.6], [s * 1.0 * o, -s * 0.5], [s * 0.6 * o, -s * 0.36], [s * 0.2 * o, -s * 0.06]], B.r);
    poly(c, [[s * 0.5 * o, -s * 0.6], [s * 1.0 * o, -s * 0.5], [s * 0.7 * o, -s * 0.48]], B.p);
    for (const q of [[0.7, 0.34], [0.4, 0.5], [0.1, 0.42]]) { c.fillStyle = B.r; c.fillRect(Math.round(s * q[0] * (q[0] > 0.2 ? o : 1)), Math.round(s * q[1]), Math.max(1, Math.round(s * 0.04)), Math.max(2, Math.round(s * 0.12))); }   // drips
  }

  // ================= crisp sprites =================
  // a sweep of the scythe round (x, y): the crescent leads at angle `lead` (screen angle, mirrored by dir)
  function crescent(ctx, x, y, R, tail, lead, T, dir, a, mono) { PX.sprite(ctx, x, y, R * 2.3, R * 2.3, c => { c.scale(dir < 0 ? -1 : 1, 1); crescentVec(c, R, tail, lead, T); }, { pal: PAL, alpha: a, mono }); }
  function bat(ctx, x, y, s, pose, a) { PX.sprite(ctx, x, y, s * 2.4, s * 2, c => batVec(c, s, pose), { pal: PAL, alpha: a }); }
  function lance(ctx, x, y, L, ang, a) { PX.sprite(ctx, x, y, L * 1.4, L * 1.4, c => { c.rotate(ang); lanceVec(c, L); }, { pal: PAL, alpha: a }); }
  function moon(ctx, x, y, r, ecl, a) { PX.sprite(ctx, x, y, r * 2.4, r * 2.4, c => moonVec(c, r, ecl), { pal: PAL, alpha: a, outline: PAL[1] }); if (ecl > 0.85) { ctx.save(); ctx.globalAlpha = (a === undefined ? 1 : a) * 0.9; ctx.strokeStyle = '#ffb3b3'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(Math.round(x), Math.round(y), r + 2, 0, PI * 2); ctx.stroke(); ctx.restore(); } }
  function wings(ctx, x, y, s, open, a) { PX.sprite(ctx, x, y, s * 2.4, s * 1.6, c => { wingVec(c, s, open); c.scale(-1, 1); wingVec(c, s, open); }, { pal: PAL, alpha: a }); }
  Object.assign(VB, { crescent, bat, lance, moon, wings });
  const drops = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 ? '#d00000' : '#ffb3b3', rand(-pw, pw), -rand(0.5, pw), 22, 2, -0.04); };   // (blood rises)
  // blood streaming from (x0, y0) to (x1, y1): k 0 -> 1
  function stream(ctx, x0, y0, x1, y1, k, n) {
    for (let i = 0; i < (n || 5); i++) { const u = clamp01(k * 1.4 - i * 0.08); if (u <= 0 || u >= 1) continue; const e = ease(u), x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(u * PI) * (14 + i * 4); art.disc(ctx, i % 2 ? '#e5383b' : '#9d0208', Math.round(x), Math.round(y), 2); art.rect(ctx, '#ffb3b3', Math.round(x) - 1, Math.round(y) - 1, 1, 1); }
  }
  function ride(p, z, life, render, tick) {
    const v = new Vis(p.x, p.y, life, render, vv => { if (!vv.free) { vv.x = p.x; vv.y = p.y; } if (tick) tick(vv); if (p.dead) vv.gone = true; });
    v._ugS = 1; z.shots.push(v); return v;
  }

  // ================= U: Blood Needle =================
  const _bn = CASTS.blood_needle;
  CASTS.blood_needle = function (p, z) {
    const n0 = z.shots.length, r = _bn.apply(this, arguments);
    if (!isV(G)) return r;
    z.shots.slice(n0).forEach(s => { if (s instanceof Proj && s.render) s.render = (ctx, x, y, q) => { lance(ctx, x, y, 30, Math.atan2(q.vy, q.vx)); if (q.t % 2 === 0) art.rect(ctx, '#e5383b', Math.round(x - q.vx * 2.2), Math.round(y - q.vy * 2.2 + rand(-2, 2)), 2, 1); }; });
    return r;
  };

  // ================= S+U: Crimson Step =================
  const _cs = CASTS.crimson_step;
  CASTS.crimson_step = function (p, z) {
    const r = _cs.apply(this, arguments);
    if (!isV(G)) return r;
    const dir = p.face; let end = -1;
    ride(p, z, 40, (ctx, sx, sy, t) => {
      const cy = sy - 22;
      if (end < 0) {
        PX.lines(ctx, sx - dir * 30, cy, dir > 0 ? 0 : PI, 60, 8, t, '#e5383b', 40);
        for (let i = 0; i < 6; i++) bat(ctx, sx - dir * (i * 11 - 8) + Math.sin(t + i * 2) * 3, cy + Math.sin(t * 0.9 + i * 1.7) * 12 - 2, 13 - (i % 2) * 3, (t + i) % 3);   // a streak of bats where she was
      } else {
        const k = (t - end) / 12;
        crescent(ctx, sx - dir * 6, cy, 46, -2.5 + ease(k * 3) * 2.2, -1.7 + ease(k * 3) * 2.6, 13, dir, 1 - ease((k - 0.45) / 0.55));
        for (let i = 0; i < 4; i++) bat(ctx, sx - dir * (20 + i * 14 + k * 30), cy - 6 - i * 5 - k * 20, 11, (t + i) % 3, 1 - k);
      }
    }, v => { if (end < 0 && v.t > 2 && p.state !== 'cast') { end = v.t; v.life = v.t + 12; v.free = true; drops(p.x, p.y - 22, 8, 2); } });
    return r;
  };

  // ================= I: Blood Moon Scythe =================
  const _bs = CASTS.blood_moon_scythe;
  CASTS.blood_moon_scythe = function (p, z) {
    const r = _bs.apply(this, arguments);
    if (!isV(G)) return r;
    const dir = p.face;
    ride(p, z, 30, (ctx, sx, sy, t) => {
      const cy = sy - 24;
      if (t >= 1 && t < 14) {   // the first sweep: over her head and down in front
        const k = (t - 1) / 12, sw = ease(k * 2.2);
        crescent(ctx, sx, cy, 62, -2.9 + sw * 2.6, -2.0 + sw * 2.9, 17, dir, 1 - ease((k - 0.5) / 0.5));
      }
      if (t >= 13 && t < 30) {   // the second: back the other way, up and behind her
        const k = (t - 13) / 16, sw = ease(k * 2.2);
        crescent(ctx, sx, cy, 68, 1.2 - sw * 3.0, 0.3 - sw * 3.4, 20, dir, 1 - ease((k - 0.5) / 0.5));
        if (t < 16) { ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffffff'; ctx.fillRect(sx - 70, cy - 1, 140, 1); ctx.restore(); }
      }
    }, v => { if (v.t === 2 || v.t === 14) drops(p.x + dir * (v.t === 2 ? 34 : -20), p.y - 26, 8, 2.4); });
    return r;
  };

  // ================= S+I: Hemorrhage =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.vesna;
  if (BU && BU.cast) {
    const _hm = BU.cast;
    BU.cast = function (p, z) {
      const e = N.nearest(z, p.x, p.y - 16, 200), r = _hm.apply(this, arguments);
      if (!isV(G) || !e) return r;
      const v = new Vis(e.x, e.y, 134, (ctx, sx, sy, t) => {
        const cy = sy - 20, beat = t % 30, pulse = beat < 6 ? 1 - beat / 6 : 0;
        if (t < 10) PX.claws(ctx, sx, cy, 0.9, 26, t / 10, [PAL[0], PAL[2], PAL[4]], 3);   // the wound is raked open
        ctx.save(); ctx.globalAlpha = 0.9;   // and stays: three red gashes that pulse
        for (let i = -1; i <= 1; i++) art.line(ctx, pulse > 0.3 ? '#ffb3b3' : '#d00000', sx - 7 + i * 5, cy - 8, sx + 3 + i * 5, cy + 8, 1 + (pulse > 0.3 ? 1 : 0));
        ctx.restore();
        if (t >= 30 && beat < 16) stream(ctx, sx, cy, Math.round(p.x - G.cam.x), Math.round(p.y - G.cam.y) - 22, beat / 16, 6);   // every drop comes back to her
      }, vv => { if (e && !e.dead) { vv.x = e.x; vv.y = e.y; } else vv.gone = true; });
      v._ugS = 1; z.shots.push(v);
      return r;
    };
  }

  // ================= W+O: Red Rain =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.vesna;
  if (SIG && SIG.cast) {
    const _rr = SIG.cast;
    SIG.cast = function (p, z) {
      const e = N.ahead(p, z, 240) || N.nearest(z, p.x, p.y, 200), x0 = e ? e.x : p.x + p.face * 80, r = _rr.apply(this, arguments);
      if (!isV(G)) return r;
      const seen = new Set();
      const v = new Vis(x0, p.y, 50, (ctx, sx, sy, t) => {   // a sliver of red moon over the target, dripping
        const a = Math.min(1, t / 6) * (1 - ease((t - 40) / 10));
        crescent(ctx, sx, sy - 150, 16, -0.4, 2.6, 7, 1, a);
      }, () => {
        const zs = G.zone && G.zone.shots; if (!zs) return;
        zs.forEach(s => { if (seen.has(s) || !(s instanceof Proj) || s.w !== 10 || s.h !== 12 || !(s.vy > 5)) return; seen.add(s); s.render = (ctx, x, y) => { lance(ctx, x, y - 6, 26, PI / 2); art.rect(ctx, '#e5383b', Math.round(x), Math.round(y - 30), 1, 10); }; });
      });
      v._ugS = 1; z.shots.push(v);
      return r;
    };
  }

  // ================= J x4: a quick crescent =================
  const FIN = SW.clanmelee && SW.clanmelee.FIN;
  if (FIN && FIN.vesna) {
    const _fv = FIN.vesna;
    FIN.vesna = function (p, z) {
      const r = _fv.apply(this, arguments);
      if (!isV(G)) return r;
      const dir = p.face;
      z.shots.push(new Vis(p.x + dir * 6, p.y - 22, 10, (ctx, sx, sy, t) => { const k = t / 10, sw = ease(k * 2.5); crescent(ctx, sx, sy, 40, -2.2 + sw * 2.0, -1.4 + sw * 2.4, 11, dir, 1 - ease((k - 0.4) / 0.6)); }));
      return r;
    };
  }

  // ================= S+O and O: Open Veins and Red Moon =================
  function aura(ctx, p, sx, sy, front) {
    const top = sy - (p.h || 34);
    if (p.awakeT > 0 && !front) {   // the moon behind her head, wings of blood from her back, two bats
      const fade = Math.min(1, p.awakeT / 30), open = Math.min(1, ((p.awakeMax || 900) - p.awakeT) / 16);
      wings(ctx, sx, sy - 24, 14,   // small wings at her back; no moon (nothing big may stand behind a fighter)
        open * (0.92 + 0.08 * Math.sin(p.t * 0.08)), 0.95 * fade);
      for (let i = 0; i < 2; i++) { const a = p.t * 0.07 + i * PI; bat(ctx, sx + Math.cos(a) * 20, top - 4 + Math.sin(a) * 5, 6, ((p.t >> 2) + i) % 3, fade); }
    }
    if (p.modeT > 0 && front) {   // drops of blood rise round her
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < 9; i++) { const u = ((p.t * 1.2 + i * 23) % 70) / 70, x = sx + Math.sin(i * 2.4) * 16 + Math.sin(p.t * 0.05 + i) * 2, y = sy - u * 46; art.rect(ctx, i % 3 ? '#d00000' : '#e5383b', Math.round(x), Math.round(y), 1, 3); art.rect(ctx, '#ffb3b3', Math.round(x), Math.round(y), 1, 1); }
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
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isV(g || this.G) && z && z.shots && !this.dead && this.awakeT > a0 + 60) {   // Red Moon: bats burst out as the moon rises
      const x = this.x, y = this.y - 24;
      z.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => { const k = t / 22; for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2 + 0.3; bat(ctx, sx + Math.cos(a) * (8 + k * 54), sy + Math.sin(a) * (8 + k * 34) - k * 10, 8, (t + i) % 3, 1 - ease((k - 0.5) / 0.5)); } }));
      drops(x, y, 14, 3);
    }
    return r;
  };

  // ================= W+I: Crimson Eclipse =================
  const _ult = N.ULT.crimson_eclipse;
  if (_ult) N.ULT.crimson_eclipse = function (p, z, foes) {
    const n0 = z.shots.length, r = _ult.apply(this, arguments);
    if (!isV(G)) return r;
    if (p.st === 6) {
      const sky = z.shots.slice(n0).find(s => s.life === 64 && s.render);
      if (sky) {
        sky._ugS = 1;
        sky.render = (ctx, x, y, t) => {   // (screen space) the sky goes dark red; the moon is eclipsed; bats cross it
          const k = Math.min(1, t / 8, (64 - t) / 8), mx = W / 2, my = 78;
          ctx.save(); ctx.globalAlpha = 0.42 * k; ctx.fillStyle = '#2a0006'; ctx.fillRect(0, 0, W, SW.H); ctx.restore();
          const ecl = ease((t - 6) / 26);
          if (ecl > 0.85) { ctx.save(); ctx.globalAlpha = 0.5 * k; ctx.fillStyle = '#e5383b'; for (let i = 0; i < 14; i++) { const a = i / 14 * PI * 2 + t * 0.01; ctx.beginPath(); ctx.moveTo(mx + Math.cos(a) * 40, my + Math.sin(a) * 40); ctx.lineTo(mx + Math.cos(a - 0.03) * 150, my + Math.sin(a - 0.03) * 150); ctx.lineTo(mx + Math.cos(a + 0.03) * 150, my + Math.sin(a + 0.03) * 150); ctx.closePath(); ctx.fill(); } ctx.restore(); }   // the corona
          moon(ctx, mx, my, 34, ecl, k);
          for (let i = 0; i < 7; i++) { const u = ((t * 3 + i * 53) % 220) / 220; bat(ctx, -20 + u * (W + 40), my - 24 + Math.sin(u * 9 + i) * 26 + i * 7, 11 + (i % 3) * 3, ((t >> 1) + i) % 3, k); }
        };
      }
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    if (N.every(p, 12, 52, 8)) foes.forEach(e => {   // everything they lose flows into her
      if (!e || e.dead) return;
      const b = e.box(), v = new Vis(b.x + b.w / 2, b.y + b.h / 2, 16, (ctx, sx, sy, t) => stream(ctx, sx, sy, Math.round(p.x - G.cam.x), Math.round(p.y - G.cam.y) - 22, t / 16, 7));
      v._ugS = 1; z.shots.push(v);
    });
    return r;
  };
  // the finishing blow: a giant scythe of blood hangs over the target, then comes down through it on an impact frame
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('vesna') : null, FIN2 = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN2 - 30) : 30;
    const dir = T.x >= p.x ? 1 : -1;
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN2 + 16) return;
      const cy = sy - 20, hx = sx - dir * 8, hy = cy + 6;   // the scythe turns round a point just behind the target
      if (st < FIN2) {
        const k = ease((st - (BU2 - 2)) / 10), sh = st > FIN2 - 10 ? Math.sin(st * 2.3) * 1.2 : 0, lift = -0.25 * ease((st - (FIN2 - 12)) / 10);
        // raised: the shaft up and back, the blade hooked high over the target
        ctx.save(); ctx.globalAlpha = k; art.line(ctx, '#140608', Math.round(hx - dir * 40), Math.round(hy + 40), Math.round(hx - dir * 14 + sh), Math.round(hy - 78), 3); art.line(ctx, '#4a1016', Math.round(hx - dir * 39), Math.round(hy + 38), Math.round(hx - dir * 13 + sh), Math.round(hy - 78), 1); ctx.restore();
        crescent(ctx, hx - dir * 14 + sh, hy - 20, 62, -2.3 + lift, -0.2 + lift, 22, dir, k);
        if (st % 3 === 0) part(T.x + dir * rand(10, 40), T.y - rand(60, 90), '#e5383b', 0, -0.6, 20, 2, -0.03);
      } else {
        const k = (st - FIN2) / 16, ik = (st - FIN2) / 5, sw = ease(k * 3);
        PX.impact(ctx, sx, cy, ik, 31);
        crescent(ctx, hx - dir * 14, hy - 20, 74, -2.3 + sw * 2.4, -0.2 + sw * 2.6, 26, dir, 1 - ease((k - 0.45) / 0.55), ik < 0.5 ? '#ffffff' : undefined);
        if (k > 0.1 && k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; art.line(ctx, '#ffffff', Math.round(sx - dir * 90), Math.round(cy - 60), Math.round(sx + dir * 70), Math.round(cy + 40), k < 0.3 ? 3 : 1); ctx.restore(); }   // the cut it leaves
        if (st === FIN2) drops(T.x, T.y - 20, 28, 4);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
