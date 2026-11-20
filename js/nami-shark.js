'use strict';
// Shattered Worlds — Nami fights with sharks (the user, 2026-11-18: "improve nami all skills and ult to look like a real
// shark and boost nami"). Loaded after js/ninjas2.js, js/signature.js, js/clanmelee.js and js/moves.js; only wraps.
// Every move keeps its hits, timing and damage; only what is drawn changes:
//   J J J J     the water-whip finisher: a shark lunges out along the whip and bites
//   U           Water Bullet: a small shark swims out, jaws snapping, and bites on impact
//   S + U       Mist Veil: she dives under, a dorsal fin cuts across the floor to the target, then a shark bursts up and bites
//   I           Riptide Eel: a hunting shark homes in and snaps its jaws on each of its three bites
//   S + I       Bubble Jail: two sharks circle the bubble and dart in to bite, then a big one bursts up through it
//   W + O       Rising Geyser: a shark leaps out of each geyser, jaws open
//   S + O       Flood Stance: a shark breaches beside her; while it lasts a dorsal fin circles her feet
//   O           Deep Blue: a great shark breaches behind her; while awake a shark circles her waist
//   W + I       Abyss Tide: fins cut the flood, sharks tear across everyone, a great shark rises under them; then (the
//               cinematic finish, js/ult-cinema.js) a feeding frenzy round the target and a huge shark close-up whose jaws
//               shut on the finishing blow
// Plus a Versus-only boost (the V.tune entry below). SW.namiShark.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, V = SW.versus;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, rand = SW.rand;
  if (!N || !P || !CASTS || !CASTS.water_bullet) return;
  const NS = SW.namiShark = { on: true };
  const isNami = g => !!(NS.on && g && g.state && g.state.hero === 'nami');
  const PI = Math.PI;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const part = N.part, Vis = N.Vis;

  // ================= the shark =================
  // a great white: slate-blue back, white belly, black eye, gill slits, rows of teeth. Unit = body length L.
  const SK = { top: '#536f86', hi: '#7f9bb1', belly: '#eef4f6', fin: '#435d72', line: '#0b1824', mouth: '#5e0f1d', throat: '#250408', teeth: '#ffffff', eye: '#030508', gill: '#2c3f50' };
  function body(ctx) {
    ctx.beginPath();
    ctx.moveTo(0.5, 0);
    ctx.quadraticCurveTo(0.45, -0.11, 0.25, -0.145);
    ctx.quadraticCurveTo(0.0, -0.18, -0.2, -0.11);
    ctx.quadraticCurveTo(-0.32, -0.06, -0.4, -0.03);
    ctx.lineTo(-0.4, 0.03);
    ctx.quadraticCurveTo(-0.25, 0.08, -0.05, 0.115);
    ctx.quadraticCurveTo(0.12, 0.125, 0.21, 0.075);
    ctx.lineTo(0.3, 0.06);
    ctx.quadraticCurveTo(0.45, 0.045, 0.5, 0);
    ctx.closePath();
  }
  function tri(ctx, a, b, c) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.closePath(); }
  function paint(ctx, fill, line) { ctx.fillStyle = fill; ctx.fill(); if (line) { ctx.strokeStyle = line; ctx.stroke(); } }
  // shark(ctx, x, y, L, dir, { jaw 0-1, t (tail beat), rot (radians, negative = nose up), a (alpha), sil (silhouette colour) })
  function shark(ctx, x, y, L, dir, o) {
    o = o || {};
    if (L < 4) return;
    const jaw = clamp01(o.jaw || 0), sway = Math.sin((o.t || 0) * (o.beat || 0.45)) * 0.3, C = o.sil ? null : SK;
    ctx.save();
    ctx.translate(x, y); ctx.scale((dir < 0 ? -1 : 1) * L, L); ctx.rotate(o.rot || 0);
    if (o.a !== undefined) ctx.globalAlpha *= clamp01(o.a);
    ctx.lineWidth = Math.max(1, L / 70) / L; ctx.lineJoin = 'round';
    const fin = C ? C.fin : o.sil, line = C ? C.line : null;
    // tail: the upper lobe is the long one
    ctx.save(); ctx.translate(-0.38, 0); ctx.rotate(sway);
    ctx.beginPath(); ctx.moveTo(0.02, -0.035); ctx.quadraticCurveTo(-0.08, -0.13, -0.2, -0.29); ctx.quadraticCurveTo(-0.15, -0.12, -0.12, 0);
    ctx.quadraticCurveTo(-0.13, 0.08, -0.15, 0.17); ctx.quadraticCurveTo(-0.06, 0.08, 0.02, 0.035); ctx.closePath(); paint(ctx, fin, line);
    ctx.restore();
    // the fins on the far side
    ctx.beginPath(); ctx.moveTo(0.12, -0.15); ctx.quadraticCurveTo(0.05, -0.3, -0.05, -0.38); ctx.quadraticCurveTo(-0.04, -0.24, -0.1, -0.14); ctx.closePath(); paint(ctx, fin, line);
    tri(ctx, [-0.24, -0.085], [-0.3, -0.145], [-0.3, -0.07]); paint(ctx, fin, line);
    tri(ctx, [-0.22, 0.075], [-0.29, 0.125], [-0.29, 0.05]); paint(ctx, fin, line);
    tri(ctx, [-0.06, 0.11], [-0.16, 0.18], [-0.15, 0.1]); paint(ctx, fin, line);
    // the open mouth behind the body: throat, then the lower jaw hinged under the eye
    const hx = 0.21, hy = 0.07, ja = jaw * 0.85, ca = Math.cos(ja), sa = Math.sin(ja);
    const jp = (px, py) => [hx + px * ca - py * sa, hy + px * sa + py * ca];
    if (jaw > 0.03) {
      const tip = jp(0.22, -0.02);
      ctx.beginPath(); ctx.moveTo(hx - 0.02, hy - 0.01); ctx.lineTo(0.44, 0.05); ctx.lineTo(tip[0], tip[1]); ctx.closePath(); paint(ctx, C ? C.mouth : o.sil);
      if (C) { ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(0.3 + 0.03 * jaw, 0.07 + 0.03 * jaw); ctx.lineTo(hx + 0.02, hy + 0.06 * jaw); ctx.closePath(); paint(ctx, C.throat); }
    }
    ctx.beginPath(); { const a = jp(0, -0.005), b = jp(0.22, -0.02), c = jp(0.18, 0.025), d = jp(0, 0.045); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); }
    paint(ctx, C ? C.belly : o.sil, line);
    if (C && jaw > 0.08) {   // lower teeth, pointing up
      ctx.fillStyle = C.teeth;
      for (let i = 0; i < 6; i++) { const u = 0.03 + i * 0.03, b0 = jp(u - 0.011, -0.006 - u * 0.07), b1 = jp(u + 0.011, -0.006 - u * 0.07), tp = jp(u, -0.04 * Math.min(1, jaw * 2) - u * 0.07); tri(ctx, b0, b1, tp); ctx.fill(); }
    }
    // the body, countershaded
    body(ctx); paint(ctx, C ? C.top : o.sil);
    if (C) {
      ctx.save(); body(ctx); ctx.clip();
      ctx.beginPath(); ctx.moveTo(0.52, 0.015); ctx.quadraticCurveTo(0.15, -0.01, -0.45, 0.04); ctx.lineTo(-0.45, 0.3); ctx.lineTo(0.52, 0.3); ctx.closePath(); paint(ctx, C.belly);
      ctx.globalAlpha *= 0.55; ctx.beginPath(); ctx.moveTo(0.42, -0.08); ctx.quadraticCurveTo(0.1, -0.16, -0.25, -0.08); ctx.quadraticCurveTo(0.05, -0.12, 0.42, -0.06); ctx.closePath(); paint(ctx, C.hi);
      ctx.restore();
      body(ctx); ctx.strokeStyle = C.line; ctx.stroke();
      if (jaw > 0.08) {   // upper teeth, pointing down
        ctx.fillStyle = C.teeth;
        for (let i = 0; i < 6; i++) { const u = 0.25 + i * 0.032, yy = 0.064 - (u - 0.25) * 0.09; tri(ctx, [u - 0.012, yy], [u + 0.012, yy], [u, yy + 0.045 * Math.min(1, jaw * 2)]); ctx.fill(); }
      }
      // gill slits and the eye
      ctx.strokeStyle = C.gill;
      for (let i = 0; i < 4; i++) { const gx = 0.17 - i * 0.03; ctx.beginPath(); ctx.moveTo(gx + 0.01, -0.06); ctx.quadraticCurveTo(gx - 0.01, 0, gx + 0.005, 0.06); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0.37, -0.045, Math.max(0.018, 0.9 / L), 0, PI * 2); paint(ctx, C.eye);
      if (L > 60) { ctx.beginPath(); ctx.arc(0.375, -0.05, 0.005, 0, PI * 2); paint(ctx, '#ffffff'); }
    }
    // the near pectoral fin, over the body
    ctx.beginPath(); ctx.moveTo(0.18, 0.08); ctx.quadraticCurveTo(0.1, 0.2, 0.0, 0.3); ctx.quadraticCurveTo(0.06, 0.17, 0.05, 0.1); ctx.closePath(); paint(ctx, fin, line);
    ctx.restore();
  }
  // a dorsal fin cutting the surface at waterline y, moving toward dir
  function surfFin(ctx, x, y, s, dir, t, a) {
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    ctx.globalAlpha *= 0.4; ctx.fillStyle = '#0a2a44'; ctx.beginPath(); ctx.ellipse(x - dir * s * 0.7, y + 3, s * 1.9, s * 0.32, 0, 0, PI * 2); ctx.fill(); ctx.globalAlpha /= 0.4;
    ctx.lineWidth = 1; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x + dir * s * 0.45, y); ctx.quadraticCurveTo(x + dir * s * 0.18, y - s * 0.75, x - dir * s * 0.3, y - s * 1.1);
    ctx.quadraticCurveTo(x - dir * s * 0.18, y - s * 0.5, x - dir * s * 0.42, y); ctx.closePath(); paint(ctx, SK.fin, SK.line);
    ctx.beginPath(); ctx.moveTo(x + dir * s * 0.4, y); ctx.quadraticCurveTo(x + dir * s * 0.15, y - s * 0.7, x - dir * s * 0.28, y - s * 1.05); ctx.strokeStyle = SK.hi; ctx.stroke();
    ctx.fillStyle = '#ffffff';   // the bow wave and the wake
    for (let i = 0; i < 3; i++) ctx.fillRect(Math.round(x + dir * (s * 0.5 + i)), Math.round(y - 1 - ((t + i) % 3)), 1, 1);
    for (let i = 1; i <= 6; i++) { ctx.globalAlpha *= 0.86; const wx = Math.round(x - dir * (s * 0.4 + i * 3)); ctx.fillRect(wx, Math.round(y - 1 - i * 0.5), 2, 1); ctx.fillRect(wx, Math.round(y + 1 + i * 0.5), 2, 1); }
    ctx.restore();
  }
  NS.shark = shark; NS.fin = surfFin;
  const splash = (x, y, n, up) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y, i % 3 ? '#caf0f8' : (i % 2 ? '#48cae4' : '#ffffff'), rand(-2.2, 2.2), -rand(1, up || 3.5), 20, 2, 0.15); };
  // jaws: a bite that opens then snaps shut at k = 0.6 (k is 0 to 1 over the move)
  const bite = k => (k < 0.45 ? k / 0.45 : k < 0.6 ? 1 : Math.max(0, 1 - (k - 0.6) / 0.12));
  const snap = (z, x, y, dir, L, life) => z.shots.push(new Vis(x, y, life || 12, (ctx, sx, sy, t) => {
    const k = t / (life || 12); shark(ctx, sx - dir * L * 0.3 + dir * k * L * 0.25, sy, L, dir, { jaw: bite(k * 0.7 + 0.25), t, a: 1 - ease((k - 0.7) / 0.3) });
  }));
  // a shark coming up out of the floor at (x, gy), nose up, then falling back (clipped at the floor)
  function breach(ctx, sx, gy, L, dir, k, a) {
    const h = Math.sin(clamp01(k) * PI) * L * 1.05, cy = gy + L * 0.5 - h, tilt = (k - 0.5) * 0.9;
    ctx.save(); ctx.beginPath(); ctx.rect(sx - L * 2, gy - L * 3, L * 4, L * 3); ctx.clip();
    shark(ctx, sx, cy, L, dir, { rot: -PI / 2 + 0.25 + tilt, jaw: k > 0.25 && k < 0.62 ? bite((k - 0.25) / 0.37) : 0, t: k * 30, a });
    ctx.restore();
  }

  // ================= U: Water Bullet =================
  const _wb = CASTS.water_bullet;
  CASTS.water_bullet = function (p, z) {
    const n0 = z.shots.length, r = _wb.apply(this, arguments);
    if (!isNami(G)) return r;
    const pr = z.shots[n0]; if (!pr || !pr.render) return r;
    const _end = pr.onEnd;
    pr.render = (ctx, x, y, s) => {
      if (s.t % 2) art.rect(ctx, '#caf0f8', x - Math.sign(s.vx || 1) * (14 + (s.t % 5)), y + rand(-3, 3), 2, 2);
      shark(ctx, x, y, 32, Math.sign(s.vx) || 1, { t: s.t, beat: 0.8, rot: Math.atan2(s.vy || 0, Math.abs(s.vx) || 1), jaw: 0.25 + 0.75 * Math.max(0, Math.sin(s.t * 0.45)) });
    };
    pr.onEnd = function (g, zz, impact) { if (_end) _end.apply(this, arguments); if (zz && zz.shots) { snap(zz, this.x, this.y, Math.sign(this.vx) || 1, 30, 12); splash(this.x, this.y, 6); } };
    return r;
  };

  // ================= S + U: Mist Veil =================
  const _mv = CASTS.mist_veil;
  CASTS.mist_veil = function (p, z) {
    const n0 = z.shots.length, x0 = p.x, y0 = p.y, r = _mv.apply(this, arguments);
    if (!isNami(G)) return r;
    const add = z.shots.slice(n0), vis = add.find(s => s instanceof Vis), lat = add.find(s => s instanceof N.Later);
    if (vis) {
      const face0 = p.face; let fx0 = x0;
      p.sharkVeil = vis;
      vis.render = (ctx, x, y, t, v) => {
        if (t < 10) { ctx.save(); ctx.globalAlpha = 0.7 * (1 - t / 10); ctx.strokeStyle = '#caf0f8'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 6 + t * 2.4, 2 + t * 0.5, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); }
        if (t < 3 || t > 33) return;
        // the fin cuts across the floor toward whoever she will come up under
        const tx = v.tx === undefined ? p.x : v.tx, k = ease((t - 3) / 30);
        const dir = Math.abs(tx - x0) > 2 ? Math.sign(tx - x0) : face0, fxw = x0 + (tx - x0) * k; fx0 = fxw;
        ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#0077b6'; ctx.beginPath(); ctx.ellipse(Math.round(fxw - v.x + x), y, 16, 3, 0, 0, PI * 2); ctx.fill(); ctx.restore();
        surfFin(ctx, Math.round(fxw - v.x + x), y, 13, dir, t);
      };
      vis.tick = v => {   // (in the update, where G.zone holds this fighter's foes: the same pick as the cut at frame 34)
        const e = N.nearest(G.zone, p.x, p.y - 16, 110); v.tx = e ? e.x - (e.x >= p.x ? 1 : -1) * 22 : p.x;
        if (v.t % 3 === 0) part(fx0 + rand(-8, 8), y0 - 1, '#caf0f8', rand(-0.5, 0.5), -rand(0.3, 1), 14, 1);
      };
    }
    if (lat) {
      const _fn = lat.fn;
      lat.fn = function (g, zz) {
        _fn.apply(this, arguments);
        p.sharkVeil = null; if (p.dead) return;
        // the shark comes up out of the floor under the target, jaws wide, and shuts them on the cut
        const dir = p.face, gy = p.y, bx = p.x + dir * 24, L = 62, life = 28;
        splash(bx, gy, 14, 5);
        (zz || z).shots.push(new Vis(bx, gy, life, (ctx, sx, sy, t) => {
          // (it starts half out: the cut's hit-stop holds this first frame on screen)
          const k = t / life, h = Math.sin(Math.min(1, (t + 6) / 12) * PI / 2) * L * 0.95 * (1 - ease((k - 0.55) / 0.45));
          ctx.save(); ctx.beginPath(); ctx.rect(sx - 200, sy - 300, 400, 300); ctx.clip();
          shark(ctx, sx, sy + L * 0.5 - h, L, dir, { rot: -PI / 2 + 0.3, jaw: t < 4 ? 1 : Math.max(0, 1 - (t - 4) / 3), t, beat: 0.9 });
          ctx.restore();
        }, v => { if (v.t === 6) splash(v.x, v.y - 30, 10, 3); if (v.t === life - 6) splash(v.x, v.y, 8, 2.5); }));
      };
    }
    return r;
  };
  // she is under the water while the fin moves
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const gg = g || this.G, nm = isNami(gg) && !this.dead;
    if (nm && this.sharkVeil && !this.sharkVeil.gone && this.sharkVeil.t >= 3 && this.sharkVeil.t <= 33 && this.state !== 'hurt') return;
    const sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (nm) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (nm) aura(ctx, this, sx, sy, true);
    return r;
  };

  // ================= I: Riptide Eel (now a hunting shark) =================
  const _re = CASTS.riptide_eel;
  CASTS.riptide_eel = function (p, z) {
    const n0 = z.shots.length, r = _re.apply(this, arguments);
    if (!isNami(G)) return r;
    const pr = z.shots[n0]; if (!pr || !pr.render) return r;
    const _think = pr.think; let seen = 0;
    pr.biteT = 0;
    pr.think = function (g, zz) {
      if (_think) _think.apply(this, arguments);
      if (this.hits > seen) { seen = this.hits; this.biteT = 10; splash(this.x + Math.sign(this.vx) * 10, this.y, 5, 2.5); }
      if (this.biteT > 0) this.biteT--;
    };
    pr.render = (ctx, x, y, s) => {
      const dir = Math.sign(s.vx) || 1, near = N.nearest(G.zone, s.x, s.y, 46);
      const jaw = s.biteT > 0 ? bite(1 - s.biteT / 10 * 0.55) : near ? 0.35 + 0.65 * Math.max(0, Math.sin(s.t * 0.6)) : 0.1;
      if (s.t % 3 === 0) art.rect(ctx, '#caf0f8', x - dir * 22, y + rand(-4, 4), 1, 1);
      shark(ctx, x, y, 42, dir, { t: s.t, beat: 0.7, jaw, rot: SW.clamp(Math.atan2(s.vy || 0, Math.abs(s.vx) || 1), -0.6, 0.6) });
    };
    return r;
  };

  // ================= S + I: Bubble Jail =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.nami;
  if (BU && BU.cast) {
    const _bj = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _bj.apply(this, arguments);
      if (!isNami(G)) return r;
      const vis = z.shots.slice(n0).find(s => s instanceof Vis); if (!vis) return r;
      const _r = vis.render, dir0 = p.face;
      vis.render = (ctx, x, y, t, v) => {
        const BITES = [6, 18, 30, 42], bi = BITES.findIndex(b => t >= b - 4 && t < b + 4);
        const draw = i => {
          const a = t * 0.16 + i * PI, darting = bi >= 0 && bi % 2 === i, d = darting ? 1 - Math.abs(t - BITES[bi]) / 4 : 0;
          const rx = 46 * (1 - d * 0.6), ox = Math.cos(a) * rx, oy = Math.sin(a) * 10, dir = -Math.sin(a) >= 0 ? 1 : -1;
          shark(ctx, x + ox, y + oy, 32, darting ? (ox > 0 ? -1 : 1) : dir, { t: t + i * 7, beat: 0.9, jaw: darting ? bite(0.25 + (t - BITES[bi] + 4) / 8 * 0.5) : 0.1 });
        };
        if (t < 50) [0, 1].filter(i => Math.sin(t * 0.16 + i * PI) < 0).forEach(draw);   // the ones behind the bubble
        _r(ctx, x, y, t, v);
        if (t < 50) [0, 1].filter(i => Math.sin(t * 0.16 + i * PI) >= 0).forEach(draw);
        if (t >= 44) {   // a big one bursts up through it and snaps it shut
          const k = (t - 44) / 16;
          shark(ctx, x + dir0 * 6, y + 96 - ease(k * 1.25) * 128, 84, dir0, { rot: -PI / 2 + 0.3, jaw: bite(k * 0.7 + 0.075), t, beat: 0.9, a: 1 - ease((k - 0.85) / 0.15) });   // snaps shut on the burst (t 56)
        }
      };
      return r;
    };
  }

  // ================= W + O: Rising Geyser =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.nami;
  if (SIG && SIG.cast) {
    const _sg = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _sg.apply(this, arguments);
      if (!isNami(G)) return r;
      const dir = p.face;
      [32, 62, 92].forEach((off, i) => {
        const x = p.x + dir * off, gy = (N.floorY ? N.floorY(z, x, p.y - 8) : p.y), d0 = 6 + i * 6;
        z.shots.push(new Vis(x, gy, d0 + 30, (ctx, sx, sy, t) => {
          if (t < d0) { surfFin(ctx, sx - dir * (d0 - t) * 2, sy, 10, dir, t, 0.4 + t / d0); return; }   // the fin, just before it leaps
          // it leaps clear of the jet, jaws open at the top, and turns over on the way down
          const k = (t - d0) / 30, L = 42, y = sy + L * 0.55 - Math.sin(k * PI) * (L * 0.55 + 52);
          ctx.save(); ctx.beginPath(); ctx.rect(sx - 120, sy - 240, 240, 240); ctx.clip();
          shark(ctx, sx + dir * k * 14, y, L, dir, { rot: -PI / 2 + 0.25 + k * 1.6, jaw: k > 0.2 && k < 0.6 ? bite((k - 0.2) / 0.4) : 0, t, beat: 0.9 });
          ctx.restore();
        }, v => { if (v.t === d0) splash(v.x, v.y, 8, 4.5); }));
      });
      return r;
    };
  }

  // ================= J J J J: the water-whip finisher =================
  const FIN = SW.clanmelee && SW.clanmelee.FIN;
  if (FIN && FIN.nami) {
    const _fn = FIN.nami;
    FIN.nami = function (p, z) {
      const r = _fn.apply(this, arguments);
      if (!isNami(G)) return r;
      const dir = p.face, y = p.y - 20, x0 = p.x;
      z.shots.push(new Vis(x0, y, 12, (ctx, sx, sy, t) => {
        const k = t / 12;
        shark(ctx, sx + dir * (14 + ease(k * 1.4) * 58), sy + Math.sin(k * PI) * -4, 34, dir, { t, beat: 1, jaw: bite(k * 0.9 + 0.12), rot: -0.1 + k * 0.2, a: 1 - ease((k - 0.75) / 0.25) });
      }));
      return r;
    };
  }

  // ================= S + O and O: Flood Stance and Deep Blue =================
  function aura(ctx, p, sx, sy, front) {
    if (p.modeT > 0) {   // a dorsal fin circles her feet
      const a = p.t * 0.09, sn = Math.sin(a), fade = Math.min(1, p.modeT / 30);
      if (!front) { ctx.save(); ctx.globalAlpha = 0.4 * fade; ctx.strokeStyle = '#48cae4'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx, sy, 30, 5, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); }
      if ((sn >= 0) === front) surfFin(ctx, Math.round(sx + Math.cos(a) * 30), Math.round(sy + sn * 5), 10, -sn >= 0 ? 1 : -1, p.t, fade);
    }
    if (p.awakeT > 0) {   // a shark circles her waist
      const a = p.t * 0.07 + 1.3, sn = Math.sin(a), fade = Math.min(1, p.awakeT / 30);
      if ((sn >= 0) === front) shark(ctx, sx + Math.cos(a) * 30, sy - 24 + sn * 4, 30, -sn >= 0 ? 1 : -1, { t: p.t, beat: 0.6, jaw: Math.pow(Math.max(0, Math.sin(p.t * 0.11)), 6), a: (front ? 0.95 : 0.7) * fade, rot: Math.cos(a) * 0.12 });
    }
  }
  const _pu = P.update;
  P.update = function (g, z) {
    const m0 = this.modeT || 0, a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (isNami(g || this.G) && z && z.shots && !this.dead) {
      const big = this.awakeT > a0 + 60, mid = !big && this.modeT > m0 + 60;
      if (big || mid) {
        const L = big ? 104 : 56, dir = this.face, x = this.x - dir * (big ? 26 : 30), gy = this.y, life = big ? 46 : 34;
        splash(x, gy, big ? 18 : 10, big ? 5.5 : 4);
        z.shots.push(new Vis(x, gy, life, (ctx, sx, sy, t) => breach(ctx, sx, sy, L, dir, t / life, big ? 0.85 : 0.9), v => { if (v.t === life - 8) splash(v.x, v.y, big ? 14 : 8, 3); }));
      }
    }
    return r;
  };

  // ================= W + I: Abyss Tide =================
  const _ab = N.ULT.abyss_tide;
  if (_ab) N.ULT.abyss_tide = function (p, z, foes) {
    const n0 = z.shots.length, r = _ab.apply(this, arguments);
    if (!isNami(G)) return r;
    const add = z.shots.slice(n0), st = p.st;
    if (st === 6 && add[0] && add[0].render) {   // fins cut the flood's surface
      const _r = add[0].render;
      add[0].render = (ctx, x, y, t, v) => {
        _r(ctx, x, y, t, v);
        const h = Math.round(Math.min(70, t * 4) * (t > 58 ? (66 - t) / 8 : 1)), wy = SW.H - 34 - h;
        if (h < 6) return;
        for (let i = 0; i < 4; i++) { const d = i % 2 ? -1 : 1, fxw = ((i * 137 + d * t * 4.5) % (SW.W + 80) + SW.W + 80) % (SW.W + 80) - 40; surfFin(ctx, Math.round(fxw), wy, 11 + (i % 2) * 3, d, t + i); }
      };
    }
    if (N.every(p, 14, 54, 8)) {   // the eels are sharks now, and they bite as they cross
      const d = (p.st >> 3) % 2 ? 1 : -1;
      add.filter(s => s instanceof Vis && s.life === 14).forEach(s => {
        s.render = (ctx, x, yy, t) => { const k = t / 14; shark(ctx, x + d * t * 9, yy - Math.round(Math.sin(k * PI) * 14), 42, d, { t, beat: 1, jaw: bite(k * 0.95 + 0.1), rot: -Math.cos(k * PI) * 0.35 }); };
      });
    }
    if (st === 62) {   // the whole tide comes down: a great shark rises under each of them
      foes.forEach(e => {
        if (!e || e.dead) return;
        const b = e.box(), x = b.x + b.w / 2, gy = e.y, dir = e.x >= p.x ? -1 : 1;
        splash(x, gy, 16, 5.5);
        z.shots.push(new Vis(x, gy, 24, (ctx, sx, sy, t) => breach(ctx, sx, sy, 96, dir, 0.18 + t / 24 * 0.8)));
      });
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('nami') >= 0) frenzy(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js runs st 72-124 and strikes at st 100): a feeding frenzy round the target, then
  // a huge shark comes up at it with its jaws open and shuts them on the blow
  function frenzy(p, z, T) {
    const FINST = SW.ultCinema.FIN || 100, dir = T.x >= p.x ? 1 : -1;
    z.shots.push(new Vis(T.x, T.y, 70, (ctx, sx, sy, t, v) => {
      const st = p.st; if (p.state !== 'ult') return;
      const cx = sx, cy = sy - 18, gy = sy;
      if (st >= 64 && st < FINST + 4) {
        const k = ease((st - 64) / 10);
        ctx.save(); ctx.globalAlpha = 0.4 * k; ctx.fillStyle = '#0077b6'; ctx.beginPath(); ctx.ellipse(cx, gy, 58, 9, 0, 0, PI * 2); ctx.fill();
        ctx.globalAlpha = 0.6 * k; ctx.strokeStyle = '#caf0f8'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, gy, 58, 9, 0, 0, PI * 2); ctx.stroke(); ctx.restore();
        const rx = 50 - (st - 64) * 0.6;
        for (let i = 0; i < 3; i++) { const a = st * 0.15 + i * 2.09, sn = Math.sin(a); surfFin(ctx, Math.round(cx + Math.cos(a) * rx), Math.round(gy + sn * 7), 11, -sn >= 0 ? 1 : -1, st + i, k); }
      }
      if (st >= 66 && st < 92) {   // sharks dart through, biting
        const ph = (st - 66) % 8, d = ((st - 66) >> 3) % 2 ? -1 : 1, kk = ph / 8;
        shark(ctx, cx + d * (-80 + 160 * kk), cy + (((st - 66) >> 3) % 3 - 1) * 9, 36, d, { t: st, beat: 1.2, jaw: bite(kk * 0.9 + 0.1), rot: (kk - 0.5) * 0.3 });
      }
      if (st >= 82 && st <= FINST + 14) {   // the close-up: a huge shark from below, jaws wide, shutting on the blow
        const u = ease((st - 82) / (FINST - 82)), L = 230, rot = -0.75, cr = Math.cos(rot), sr = Math.sin(rot);
        const hx = dir * cr, hy = sr, after = st > FINST ? (st - FINST) / 14 : 0;
        // the middle of the mouth (0.36, 0.07 along the body) lands on the target as the jaws shut
        const mx = dir * (0.36 * cr - 0.07 * sr) * L, my = (0.36 * sr + 0.07 * cr) * L, back = 170 * (1 - u) - after * 40;
        const ox = cx - mx - hx * back, oy = cy - my - hy * back;
        const jaw = st < 86 ? (st - 82) / 4 : st < FINST ? 1 : st === FINST ? 0.3 : 0;
        if (st === FINST) { splash(T.x, T.y - 16, 24, 5); for (let i = 0; i < 10; i++) part(T.x + rand(-20, 20), T.y - rand(4, 40), '#ffffff', rand(-3, 3), -rand(1, 4), 18, 2, 0.15); }
        shark(ctx, ox, oy, L, dir, { rot, jaw, t: st, beat: 0.5, a: 1 - ease(after * 1.2 - 0.2) });
      }
    }, v => { if (T && !T.dead) { v.x = T.x; v.y = T.y; } if (p.state !== 'ult') v.gone = true; }));
  }

  // ================= the move list says what you now see =================
  // (names stay: the story mode's lines name "Abyss Tide"; es / zh go in through the same hook the hero files use)
  const A = SW.data.abilities;
  const DESC = {
    water_bullet: ['A small shark shoots out, jaws snapping, and bites whatever it hits, knocking it back. Your skill hits steal energy from the enemy.',
      'Un pequeño tiburón sale disparado lanzando dentelladas y muerde lo que alcanza, haciéndolo retroceder. Tus golpes de habilidad le roban energía al enemigo.',
      '一条小鲨鱼张着嘴猛冲而出，咬住击中的目标并将其击退。你的技能命中会偷取敌人的能量。'],
    riptide_eel: ['A shark swims forward, turning toward enemies, and bites three times.',
      'Un tiburón nada hacia delante, gira hacia los enemigos y muerde tres veces.',
      '一条鲨鱼向前游去，转向敌人并咬三口。']
  };
  const ES = {}, ZH = {};
  Object.keys(DESC).forEach(id => { const d = DESC[id]; if (!A[id]) return; A[id].desc = d[0]; ES[d[0]] = d[1]; ZH[d[0]] = d[2]; });
  if (A.abyss_tide) {
    const en = 'the arena floods. Sharks tear through everyone, then a great shark comes up from the deep.';
    A.abyss_tide.desc = 'Ultimate: ' + en + ' Costs all three bars, or one while awakened.';
    Object.assign(ES, N.ultText('es', en, 'la arena se inunda. Los tiburones atraviesan a todos y luego un gran tiburón surge de las profundidades.'));
    Object.assign(ZH, N.ultText('zh', en, '竞技场被淹没。鲨群撕穿所有人，然后一头巨鲨从深渊中冲出。'));
  }
  N.tr('es', ES); N.tr('zh', ZH);

  // ================= the boost (Versus only) =================
  // Measured 2026-11-18 with tools/hardcore-train.js HT.round at normal speed: Nami against all 63 others, both sides, on
  // Hard and on Nightmare, 4 rounds each (1008 rounds per setting). Win rate overall / against the 53 non-legends:
  //   before (damage table 0.75, js/ninjas2.js)   39.9% / 43.2%   (Hard 37.7, Nightmare 42.1)
  //   damage 0.9                                   43.3% / 47.1%
  //   damage 1.0                                   44.8% / 47.5%
  //   damage 0.9  + 10% health                     46.0% / 50.2%
  //   damage 0.95 + 10% health  (kept)             49.9% / 53.3%   (Hard 50.0, Nightmare 49.8)
  //   damage 1.0  + 10% health                     49.7% / 53.8%
  // Versus only: a story duel (V.mode 'duel', e.g. The Hollow Crown) keeps the old 0.75 and her old health.
  NS.dmg = 0.95; NS.hp = 1.1;
  const versusOnly = () => V && V.mode !== 'duel';
  if (V && V.tune) {
    const old = V.tune.nami || 0.75;
    Object.defineProperty(V.tune, 'nami', { configurable: true, enumerable: true, get: () => (versusOnly() ? NS.dmg : old), set: v => { NS.dmg = v; } });
  }
  const _hm = P.hpMax;
  P.hpMax = function () {
    const m = _hm.apply(this, arguments), g = this.G;
    return g && g.scene === 'vs' && versusOnly() && g.state && g.state.hero === 'nami' ? Math.round(m * NS.hp) : m;
  };
})();
