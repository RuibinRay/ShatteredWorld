'use strict';
// Shattered Worlds — Nyra's verse (2026-11-20, the hero-look rework: cool, not cute). Her story: Halcyon Subject 31,
// whose power is a song - "a note held so long the air gives up and freezes"; ice blue, the gold trim of her test suit.
// Her moves were plain rings and grey spikes. Now they are the frozen note: rings of sound that crystallise into halos
// of ice needles and shatter, a blade that rings (resonance strokes beside every arc, a frost note left hanging),
// tuning-fork spikes of ice, breaths drawn as sung arcs, ice flowers on a hum, and a musical staff across the arena.
// Crisp pixel art (js/pixel-kit.js for the arcs, the wall and the great note). Draw-only: every hit, hitbox and timing
// stays as it was. Loaded after js/fumi-boiler.js.
//   U      Pulse Burst: a ring of sound leaves her hand and freezes mid-air into a halo of ice needles that shatters
//   I      Shatterline: the ground wave is a run of ice tuning forks that ring as they rise, then crack and drop
//   S+I    Stilled Verse: three breaths as three widening sung arcs; the third freezes into a wall of glass-ice
//   W+O    Frost Bloom: ice flowers - fans of needle petals - bloom on a pulsing hum ring
//   J      her blade rings: a two-tone ice arc with thin resonance strokes beside it, a frost note left hanging;
//          the last blow freezes into a halo
//   S+O    Stillwater: a quiet ripple under her feet; moving fast she leaves frozen notes behind
//   O      Aurora: a gold-and-blue aurora band over her (small on purpose: the view stays clear)
//   W+I    Last Verse: a musical staff frosts across the whole arena from her, notes freezing on it, and the cut
//          shatters it like glass; in the cinematic finish (js/ult-cinema.js) sound rings close on the target and
//          freeze into one great note of ice, which shatters on the blow on an impact frame
// SW.nyraVerse.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype;
  if (!N || !N.Vis || !P || !PX || !PX.impact || !PX.sprite || !SW.ultFx) return;
  const NV = SW.nyraVerse = { on: true };
  const isN = g => !!(NV.on && g && g.state && g.state.hero === 'nyra');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0a2238', d: '#1d4e7a', i0: '#3a8fc8', i: '#7fd8ff', i2: '#bfefff', w: '#ffffff', g: '#d9b45a', g2: '#ffe9a0', a: '#4fc3f7' };
  const PAL = [C.out, C.d, C.i0, C.i, C.i2, C.w, C.g, C.g2, C.a];
  const R = Math.round;

  // ---------- pieces ----------
  function needle(ctx, x, y, len, ang, a) {   // an ice needle centred on (x, y)
    if (a !== undefined && a <= 0) return;
    const ca = Math.cos(ang) * len / 2, sa = Math.sin(ang) * len / 2;
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    art.line(ctx, C.out, R(x - ca), R(y - sa), R(x + ca), R(y + sa), 4);
    art.line(ctx, C.i, R(x - ca), R(y - sa), R(x + ca), R(y + sa), 2);
    art.line(ctx, C.w, R(x - ca * 0.3), R(y - sa * 0.3), R(x + ca), R(y + sa), 1);
    ctx.restore();
  }
  function note(ctx, x, y, s, a) {   // an eighth note of ice (x, y its head)
    if (a !== undefined && a <= 0) return;
    x = R(x); y = R(y); s = R(s);
    ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    art.rect(ctx, C.out, x - 3, y - 2, 7, 5); art.rect(ctx, C.out, x + 1, y - s - 1, 3, s + 2); art.rect(ctx, C.out, x + 2, y - s - 1, 4, 4);
    art.rect(ctx, C.i, x - 2, y - 1, 5, 3); art.rect(ctx, C.w, x - 1, y - 1, 2, 1);
    art.rect(ctx, C.i2, x + 2, y - s, 1, s); art.rect(ctx, C.i2, x + 3, y - s + 1, 2, 1); art.rect(ctx, C.i2, x + 4, y - s + 2, 1, 1);
    ctx.restore();
  }
  function soundRing(ctx, x, y, r, a, sq) {   // a dashed ring of sound
    if (r < 2 || a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    const m = Math.max(12, R(r * 1.6));
    for (let j = 0; j < m; j++) { if (j % 4 === 3) continue; const an = j / m * PI * 2; art.rect(ctx, j % 4 === 0 ? C.w : C.i2, R(x + Math.cos(an) * r), R(y + Math.sin(an) * r * (sq || 1)), 2, 2); }
    ctx.restore();
  }
  // a ring of sound that freezes into a halo of needles and shatters (k 0 -> 1)
  function frozenRing(ctx, x, y, Rr, k, n) {
    n = n || 12;
    if (k < 0.3) { soundRing(ctx, x, y, Rr * (0.4 + k * 2), 1); soundRing(ctx, x, y, Rr * (0.2 + k * 2), 0.6); return; }
    const u = (k - 0.3) / 0.7, out = u < 0.3 ? 0 : (u - 0.3) / 0.7;
    for (let i = 0; i < n; i++) { const an = i / n * PI * 2 + 0.2, rr = Rr * (1 + out * 0.6) + (i % 2 ? 3 : 0); needle(ctx, x + Math.cos(an) * rr, y + Math.sin(an) * rr, 9 - out * 3, an + (out > 0 ? out * (i % 2 ? 1.2 : -1.2) : 0), 1 - ease(out)); }
    if (u < 0.3) soundRing(ctx, x, y, Rr, 1 - u / 0.3);
  }
  NV.frozenRing = frozenRing;
  function fork(ctx, x, gy, h, a, ring) {   // a tuning fork of ice rising h from the floor at x
    if (h < 3 || a <= 0) return;
    x = R(x); gy = R(gy); h = R(h);
    const st = R(h * 0.55), tine = h - st;
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    art.rect(ctx, C.out, x - 3, gy - st - 1, 6, st + 1); art.rect(ctx, C.out, x - 6, gy - h - 1, 4, tine + 2); art.rect(ctx, C.out, x + 2, gy - h - 1, 4, tine + 2); art.rect(ctx, C.out, x - 6, gy - st - 2, 12, 4);
    art.rect(ctx, C.i, x - 2, gy - st, 4, st); art.rect(ctx, C.w, x - 2, gy - st, 1, st);
    art.rect(ctx, C.i, x - 5, gy - h, 2, tine); art.rect(ctx, C.i, x + 3, gy - h, 2, tine); art.rect(ctx, C.i0, x - 5, gy - st - 1, 10, 2);
    art.rect(ctx, C.w, x - 5, gy - h, 1, tine); art.rect(ctx, C.i2, x + 3, gy - h, 1, tine);
    if (ring) for (let j = 0; j < 2; j++) { const rr = 5 + j * 4 + (ring % 4); [-1, 1].forEach(e => { for (let q = -2; q <= 2; q++) art.rect(ctx, j ? C.i2 : C.w, R(x + e * (4 + Math.cos(q * 0.4) * rr)), R(gy - h + tine * 0.3 + Math.sin(q * 0.4) * rr), 1, 1); }); }
    ctx.restore();
  }
  function iceArc(ctx, x, y, d, Rr, k, tilt, big) {   // the blade's arc: two-tone ice, resonance strokes beside it
    if (k >= 1) return;
    const sweep = ease(Math.min(1, k * 3)), a = 1 - ease((k - 0.45) / 0.55), s = R(Rr * 2.8);
    PX.sprite(ctx, x, y, s, s, c => {
      c.scale(d, 1); c.rotate(tilt || 0);
      const a0 = -1.15, a1 = a0 + 2.3 * sweep;
      c.lineCap = 'round';
      c.strokeStyle = C.i0; c.lineWidth = big ? 6 : 4; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr, a0, a1); c.stroke();
      c.strokeStyle = C.i2; c.lineWidth = big ? 3 : 2; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr + 1, a0 + 0.15, a1); c.stroke();
      c.strokeStyle = C.w; c.lineWidth = 1; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr + 2, a1 - 0.6, a1); c.stroke();
      c.strokeStyle = C.i; c.lineWidth = 1; [-5, 6].forEach((o, j) => { c.beginPath(); for (let q = 0; q <= 10; q++) { const an = a0 + (a1 - a0) * q / 10, rr = Rr + o + Math.sin(q * 2.2 + k * 30 + j) * 1.5; const px = -Rr * 0.3 + Math.cos(an) * rr, py = Math.sin(an) * rr; if (q) c.lineTo(px, py); else c.moveTo(px, py); } c.stroke(); });   // resonance strokes
    }, { pal: PAL, alpha: a, outline: C.out, keepThin: true });
  }
  function glassWall(ctx, x, gy, h, a, crack) {
    const s = R(h * 1.3);
    PX.sprite(ctx, x, gy - h / 2, s, s, c => {
      const pts = [[-9, h / 2], [-11, -h * 0.2], [-5, -h / 2], [6, -h * 0.38], [10, h * 0.15], [8, h / 2]];
      c.beginPath(); pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); c.closePath(); c.fillStyle = C.i; c.fill();
      c.beginPath(); c.moveTo(-5, -h / 2); c.lineTo(-1, h / 2); c.lineTo(-9, h / 2); c.lineTo(-11, -h * 0.2); c.closePath(); c.fillStyle = C.i2; c.fill();
      c.strokeStyle = C.w; c.lineWidth = 1; c.beginPath(); c.moveTo(-8, -h * 0.15); c.lineTo(-4, -h * 0.42); c.moveTo(-6, h * 0.1); c.lineTo(-3, -h * 0.1); c.stroke();
      if (crack) { c.strokeStyle = C.d; c.beginPath(); c.moveTo(0, -h * 0.3); c.lineTo(3, -h * 0.05); c.lineTo(-1, h * 0.12); c.lineTo(4, h * 0.35); c.moveTo(3, -h * 0.05); c.lineTo(8, -h * 0.1); c.stroke(); }
    }, { pal: PAL, alpha: a, outline: C.out, keepThin: true });
  }
  function bigNote(ctx, x, y, s, o) {   // one great note of ice (x, y its centre)
    o = o || {};
    PX.sprite(ctx, x, y, s * 1.6, s * 1.8, c => {
      c.save(); c.translate(-s * 0.18, s * 0.42); c.rotate(-0.45); c.beginPath(); c.ellipse(0, 0, s * 0.24, s * 0.16, 0, 0, PI * 2); c.fillStyle = C.i; c.fill(); c.beginPath(); c.ellipse(-s * 0.06, -s * 0.05, s * 0.1, s * 0.06, 0, 0, PI * 2); c.fillStyle = C.w; c.fill(); c.restore();
      c.fillStyle = C.i2; c.fillRect(s * 0.02, -s * 0.62, s * 0.07, s * 1.02);
      c.beginPath(); c.moveTo(s * 0.09, -s * 0.62); c.quadraticCurveTo(s * 0.42, -s * 0.4, s * 0.3, -s * 0.05); c.quadraticCurveTo(s * 0.32, -s * 0.3, s * 0.09, -s * 0.38); c.closePath(); c.fillStyle = C.i; c.fill();
      c.fillStyle = C.w; c.fillRect(s * 0.02, -s * 0.62, Math.max(1, s * 0.025), s * 0.9);
      if (o.crack) { c.strokeStyle = C.d; c.lineWidth = 1; c.beginPath(); c.moveTo(-s * 0.2, s * 0.35); c.lineTo(-s * 0.05, s * 0.45); c.lineTo(-s * 0.14, s * 0.55); c.moveTo(s * 0.05, -s * 0.2); c.lineTo(s * 0.0, s * 0.05); c.stroke(); }
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }

  // ================= U: Pulse Burst (its blue ring) =================
  const _ring = fx.ring;
  fx.ring = function (x, y, col, w, r, life) {
    const g = G, z = g && g.zone, p = g && g.player;
    if (col === C.a && r === 34 && life === 14 && isN(g) && z && z.shots && p && p.state === 'cast') {
      z.shots.push(new Vis(x, y, 18, (ctx, sx, sy, t) => { frozenRing(ctx, sx, sy, 22, t / 18, 12); if (t < 3) art.disc(ctx, C.w, sx, sy, 5 - t); }));
      return;
    }
    return _ring.apply(this, arguments);
  };

  // ================= J: her blade rings =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (col !== '#d6f4ff' || !isN(g) || !p || !z || !z.shots || (p.state !== 'attack' && p.state !== 'airatk')) return _slash.apply(this, arguments);
    const d = dir || p.face, a = p.atk, fin = !!(a && a.fin), Rr = Math.max(14, Math.min(30, (len || 24) * 0.75)), tilt = kind === 2 ? 0.5 : kind === 3 ? -0.5 : 0;
    z.shots.push(new Vis(x, y, fin ? 16 : 11, (ctx, sx, sy, t) => {
      iceArc(ctx, sx, sy, d, Rr, t / (fin ? 16 : 11), tilt, fin);
      if (fin) frozenRing(ctx, sx + d * Rr * 0.7, sy, 14, Math.min(1, t / 14), 8);
    }));
    z.shots.push(new Vis(x + d * Rr * 0.7, y - 6, 24, (ctx, sx, sy, t) => note(ctx, sx, sy - t * 0.4, 7, t < 4 ? t / 4 : 1 - (t - 14) / 10)));   // a frost note left hanging
  };

  // ================= I: Shatterline: a run of ringing ice tuning forks =================
  function waveDraw(ctx, cam) {
    const x = R(this.x - cam.x), gy = R((this.fy !== undefined ? this.fy : this.y + 18) - cam.y), d = this.vx >= 0 ? 1 : -1;
    const tr = this._nyTrail || (this._nyTrail = []);
    if (!tr.length || Math.abs(this.x - tr[tr.length - 1].x) >= 14) tr.push({ x: this.x, t: this.t });
    tr.forEach(q => {   // the ones behind: crack and drop
      const age = this.t - q.t; if (age <= 0 || age > 18) return;
      const k = age / 18, qx = R(q.x - cam.x);
      fork(ctx, qx, gy + R(k * k * 10), 30 * (1 - k * 0.5), 1 - k, 0);
      if (age === 6) for (let i = 0; i < 2; i++) part(q.x + rand(-4, 4), (this.fy || this.y) - rand(10, 26), C.i2, rand(-1, 1), -rand(0.5, 1.5), 14, 2, 0.25);
    });
    fork(ctx, x, gy, Math.min(36, 12 + this.t * 6), 1, this.t);
    ctx.save(); ctx.globalAlpha = 0.7; art.line(ctx, C.i2, x - d * 30, gy - 1, x, gy - 1, 1); ctx.restore();
  }
  function dressShots(z) {
    z.shots.forEach(s => { if (s.nyra || s.kind !== 'wave' || s.team !== 'player' || s.col !== '#bfefff') return; s.nyra = 1; s.draw = waveDraw; });
  }

  // ================= S+I: Stilled Verse: three sung breaths, the third a wall of ice =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.nyra;
  if (BU && BU.cast) {
    const _sv = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _sv.apply(this, arguments);
      if (!isN(G)) return r;
      const d = p.face, x0 = p.x, y0 = p.y;
      z.shots.slice(n0).forEach(s => { if (s && s.life === 30 && typeof s.render === 'function' && !s.nyra) { s.nyra = 1; s.render = () => {}; } });   // (its grey spikes: the arcs and the wall stand for them)
      z.shots.push(new Vis(x0, y0, 34, (ctx, sx, sy, t) => {
        for (let k = 0; k < 3; k++) {
          const t0 = 1 + k * 7, u = (t - t0) / 10; if (u < 0 || u >= 1) continue;
          const reach = 54 + k * 34, rr = reach * ease(Math.min(1, u * 2.2)), a = 1 - ease((u - 0.5) / 0.5);
          for (let j = 0; j < 3; j++) { const r2 = rr - j * 7; if (r2 < 6) continue; ctx.save(); ctx.globalAlpha *= a * (1 - j * 0.25); for (let q = -6; q <= 6; q++) { const an = q * 0.09; art.rect(ctx, j ? C.i2 : C.w, R(sx + d * (10 + Math.cos(an) * r2)), R(sy - 26 + Math.sin(an) * r2 * 0.9), 2, 2); } ctx.restore(); }
          if (u < 0.6) note(ctx, sx + d * (rr * 0.6), sy - 34 - k * 4 - u * 6, 7, a);
        }
        if (t >= 15) {   // the third freezes solid
          const u = t - 15, a = u > 14 ? 1 - (u - 14) / 5 : 1, h = 48 * ease(Math.min(1, u / 3));
          glassWall(ctx, sx + d * 104, sy, Math.max(6, h), a, u > 10);
          if (u < 3) frozenRing(ctx, sx + d * 104, sy - 24, 20, 0.5 + u / 6, 10);
        }
      }));
      return r;
    };
  }

  // ================= W+O: Frost Bloom: ice flowers on a hum =================
  function flower(ctx, sx, sy, h, grow, a, t) {
    const L = h * ease(grow);
    soundRing(ctx, sx, sy - 1, 8 + (t % 10) * 0.8, a * (1 - (t % 10) / 10), 0.3);
    for (let i = -2; i <= 2; i++) { const an = -PI / 2 + i * 0.36, len = L * (1 - Math.abs(i) * 0.17); if (len < 3) continue; needle(ctx, sx + Math.cos(an) * len / 2, sy + Math.sin(an) * len / 2, len, an, a); }
    if (L > 8) { art.rect(ctx, C.out, R(sx) - 2, R(sy - L * 0.35) - 2, 5, 5); art.rect(ctx, C.w, R(sx) - 1, R(sy - L * 0.35) - 1, 3, 3); }
  }
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.nyra;
  if (SIG && SIG.cast) {
    const _fb = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _fb.apply(this, arguments);
      if (!isN(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint || s.nyra) return;
        const delay = s.life - 24; if (delay < 2 || delay > 20) return;
        s.nyra = 1; const h = [30, 27, 24][Math.round((delay - 4) / 5)] || 26;
        s.paint = (ctx, sx, sy, q) => {
          const t = q.t;
          if (t < delay) { soundRing(ctx, sx, sy - 1, 4 + t, 0.8, 0.3); return; }
          const k = t - delay, a = k > 16 ? Math.max(0, (24 - k) / 8) : 1;
          flower(ctx, sx, sy, h, Math.min(1, k / 3), a, t);
        };
      });
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const t = p.t || SW.frame;
    if (behind && p.awakeT > 0) {   // Aurora: a gold-and-blue band over her
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save();
      for (let x = -22; x <= 22; x += 2) { const e = 1 - Math.abs(x) / 24; ctx.globalAlpha = fade * 0.55 * e; const y1 = sy - 52 + Math.sin(x * 0.16 + t * 0.06) * 3, y2 = sy - 47 + Math.sin(x * 0.13 - t * 0.05) * 3; art.rect(ctx, C.g2, sx + x, R(y1), 2, 3); art.rect(ctx, C.a, sx + x, R(y2), 2, 4); }
      ctx.restore();
    }
    if (!behind && p.modeT > 0) {   // Stillwater: a quiet ripple under her feet
      const fade = Math.min(1, p.modeT / 30), k = (t % 40) / 40;
      soundRing(ctx, sx, sy, 6 + k * 14, fade * (1 - k) * 0.8, 0.2);
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isN(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    if (isN(g || this.G) && z && z.shots) {
      dressShots(z);
      if (this.modeT > 0 && Math.abs(this.vx) > 2.5 && (this.t || 0) % 7 === 0) { const nx = this.x - this.face * 8, ny = this.y - 24 + rand(-6, 6); z.shots.push(new Vis(nx, ny, 30, (ctx, sx, sy, t) => note(ctx, sx, sy - t * 0.3, 6, 1 - t / 30))); }   // frozen notes left behind
    }
    return r;
  };

  // ================= W+I: Last Verse =================
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isN(g) || !z || !z.shots) return r;
    if (p.st === 4) {
      const yW = p.y - 20, xW = p.x;
      const staff = new Vis(xW, yW, 70, (ctx) => {   // (screen space) the staff frosts across the arena, then the cut shatters it
        const st = p.st; if (p.state !== 'ult' || st > 58) return;
        const cx = R(xW - G.cam.x), cy = R(yW - G.cam.y);
        if (st < 30) {
          const reach = (W + 40) * ease((st - 4) / 24);
          ctx.save(); ctx.globalAlpha = 0.85;
          for (let l = -2; l <= 2; l++) { art.rect(ctx, l ? C.i2 : C.w, R(cx - reach), cy + l * 4, R(reach * 2), 1); }
          ctx.restore();
          for (let i = 1; i < 12; i++) [-1, 1].forEach(e => { const nx = cx + e * i * 34; if (Math.abs(nx - cx) < reach) note(ctx, nx, cy + ((i * 3 + (e > 0 ? 1 : 0)) % 5 - 2) * 4, 8, Math.min(1, (reach - Math.abs(nx - cx)) / 30)); });
          if (st > 22) frozenRing(ctx, cx, cy, 16, (st - 22) / 8 * 0.45, 10);
        } else {
          const u = st - 30, a = 1 - ease(u / 28);
          if (u < 3) { ctx.save(); ctx.globalAlpha = 1 - u / 3; art.rect(ctx, C.w, 0, cy - 2, W, 5); ctx.restore(); }
          for (let s = 0; s < 40; s++) { const sx = (s * 13) % (W + 20) - 10, l = (s % 5) - 2, fall = u * u * 0.06 * (1 + (s % 3)) + u * 0.4, ang = (s % 2 ? 0.3 : -0.3) * u * 0.2; needle(ctx, sx, cy + l * 4 + fall, 10, ang, a); }
        }
      }, vv => { if (p.state !== 'ult') vv.gone = true; });
      staff.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      staff._ugS = 1; z.shots.push(staff);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('nyra') >= 0) finale(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 74, the blow at FIN): sound rings
  // close on the target and freeze into one great note of ice; on the blow it shatters on an impact frame
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const cx = sx, cy = sy - 30;
      if (st < FIN) {
        const k = ease((st - 74) / (FIN - 74));
        for (let j = 0; j < 3; j++) { const q = ((st * 0.04 + j / 3) % 1); soundRing(ctx, cx, cy, 60 * (1 - q) + 6, q * 0.9 * (1 - k * 0.5)); }
        bigNote(ctx, cx, cy, 14 + k * 22, { a: Math.min(1, (st - 76) / 6), crack: st >= FIN - 6 });
        if (st % 4 === 0) part(T.x + rand(-20, 20), T.y - rand(10, 50), C.i2, 0, -rand(0.2, 0.6), 18, 1, -0.01);
      } else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, cx, cy, ik, 31);
        if (u < 2) bigNote(ctx, cx, cy, 36, { mono: C.w });
        for (let i = 0; i < 16; i++) { const an = i / 16 * PI * 2 + 0.1, rr = 8 + 64 * ease(Math.min(1, k * 1.6)); needle(ctx, cx + Math.cos(an) * rr, cy + Math.sin(an) * rr * 0.8 + 20 * k * k, 12 - k * 5, an, 1 - ease((k - 0.5) / 0.5)); }
        for (let i = 0; i < 5; i++) { const an = i / 5 * PI * 2 + 0.6, rr = 20 + 40 * k; note(ctx, cx + Math.cos(an) * rr, cy + Math.sin(an) * rr * 0.7 - 10 * k, 7, 1 - k); }
      }
    };
    // (drawn over the cinema's own ice burst, so the note is not hidden behind it)
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    if (PX.over) PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
