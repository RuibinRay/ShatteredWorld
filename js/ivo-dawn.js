'use strict';
// Shattered Worlds — Ivo's dawn (2026-11-20, the hero-look rework: cool, not cute). His story: Hollis's student, who
// waited a year of sunrises to be taught; he trains every morning before dawn; his look: gold-wrapped fists, golden steam
// rising off his shoulders. His blows were gold slash arcs like everyone's. Now they are his fists and heels: a gold-
// wrapped fist (bound knuckles, the wrap's tail) that lands as an imprint with a burst of light, heel arcs of gold that
// peel off steam, and the dawn - a sun rising - in his heaviest blows. Drawn as crisp pixel art by js/pixel-kit.js.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/taro-ring.js.
//   U      Whirl Heel: two gold heel arcs, steam peeling off the spin
//   S+U    Sky Kick: a rising heel arc with sun rays streaking behind it
//   I      Fist Storm: a gold fist lands on every punch; the last is a big fist with a sunburst
//   S+I    Meteor Heel: he lands like a rising sun turned over: a half-sun on the floor, rays out both ways
//   W+O    Meteor Rush: a fist lands on each of the six blows
//   J      his combo: a gold fist on every hit (the gold of his wraps)
//   S+O    Second Pulse: golden steam rises off his shoulders in pulses      O  Red Pulse: red-gold steam, and a low
//          sunrise glowing at his heels (small on purpose: the view stays clear)
//   W+I    Seventh Breath: a dawn sky; his fists land on everyone from every side; in the cinematic finish
//          (js/ult-cinema.js) the sun rises behind the target and one great gold fist drives through it on an impact frame
// SW.ivoDawn.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.whirl_heel || !CASTS.fist_storm) return;
  const ID = SW.ivoDawn = { on: true };
  const isI = g => !!(ID.on && g && g.state && g.state.hero === 'ivo');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const PAL = ['#1a0c04', '#5a2a06', '#a04a0a', '#fb8500', '#ffb703', '#ffd65a', '#fff3c4', '#ffffff', '#c8906a', '#ff3a2a'];
  const C = { out: PAL[0], d1: PAL[1], d2: PAL[2], or: PAL[3], g: PAL[4], g2: PAL[5], cream: PAL[6], w: PAL[7], skin: PAL[8], red: PAL[9] };
  const GOLDS = { '#ffb703': 1, '#fff3c4': 1 };

  // ---------- a gold-wrapped fist, knuckles toward +x: (0, 0) its centre, s its size ----------
  function fistVec(c, s) {
    const u = s / 10;
    c.fillStyle = C.g; c.beginPath(); c.moveTo(-4 * u, -4 * u); c.lineTo(3 * u, -4.6 * u); c.quadraticCurveTo(5.2 * u, -4.4 * u, 5.2 * u, -2 * u); c.lineTo(5.2 * u, 2.6 * u); c.quadraticCurveTo(5 * u, 4.6 * u, 3 * u, 4.6 * u); c.lineTo(-4 * u, 4.2 * u); c.closePath(); c.fill();
    c.fillStyle = C.g2; c.fillRect(-3.4 * u, -3.8 * u, 7.6 * u, 1.6 * u);   // light on top
    c.strokeStyle = C.d2; c.lineWidth = Math.max(1, u * 0.45); for (const y of [-1.8, 0.4, 2.6]) { c.beginPath(); c.moveTo(1.6 * u, y * u); c.lineTo(5 * u, y * u); c.stroke(); }   // the folded fingers
    c.strokeStyle = C.or; c.lineWidth = Math.max(1, u * 0.5); for (const x of [-2.6, -0.8, 1]) { c.beginPath(); c.moveTo(x * u, -4.2 * u); c.lineTo(x * u - 0.8 * u, 4.2 * u); c.stroke(); }   // the wraps, bound across
    c.fillStyle = C.cream; c.fillRect(4.4 * u, -3.6 * u, Math.max(1, 0.8 * u), 6.8 * u);   // knuckles catching the light
    c.fillStyle = C.g; c.beginPath(); c.moveTo(-4 * u, 1 * u); c.lineTo(-8 * u, 2.6 * u); c.lineTo(-7.4 * u, 3.8 * u); c.lineTo(-4 * u, 3.4 * u); c.closePath(); c.fill();   // the wrap's tail
  }
  function fist(ctx, x, y, s, dir, o) {
    o = o || {};
    PX.sprite(ctx, x, y, s * 2.2, s * 1.6, c => { if (dir < 0) c.scale(-1, 1); if (o.rot) c.rotate(o.rot); fistVec(c, s); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  ID.fist = fist;
  function burst(ctx, x, y, k, R, col) {   // a burst of light where a fist lands
    if (k >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - k;
    for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2 + 0.2, r0 = R * 0.3 + k * R * 0.4, r1 = R * (0.7 + k * 0.6) * (i % 2 ? 0.7 : 1); art.line(ctx, i % 2 ? (col || C.g) : C.w, Math.round(x + Math.cos(a) * r0), Math.round(y + Math.sin(a) * r0), Math.round(x + Math.cos(a) * r1), Math.round(y + Math.sin(a) * r1), 1); }
    ctx.restore();
  }
  function steam(x, y, n, hot) { for (let i = 0; i < n; i++) part(x + rand(-4, 4), y + rand(-3, 3), hot ? (i % 2 ? C.red : C.or) : (i % 3 ? C.cream : C.g2), rand(-0.4, 0.4), -rand(0.6, 1.6), 16 + (i % 5) * 3, 2, -0.02); }
  function heelArc(ctx, x, y, dir, R, k, rising) {   // a thick gold crescent where the heel swept
    if (k >= 1) return;
    const a0 = rising ? PI * 0.55 : -PI * 0.4, a1 = rising ? -PI * 0.45 : PI * 0.45;
    PX.sprite(ctx, x, y, R * 2.6, R * 2.6, c => {
      if (dir < 0) c.scale(-1, 1);
      const sweep = ease(Math.min(1, k * 3)), aa = a0 + (a1 - a0) * sweep;
      c.beginPath(); c.arc(0, 0, R, Math.min(a0, aa), Math.max(a0, aa)); c.arc(R * 0.15, 0, R * 0.8, Math.max(a0, aa), Math.min(a0, aa), true); c.closePath(); c.fillStyle = C.g; c.fill();
      c.strokeStyle = C.w; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, R, Math.min(a0, aa), Math.max(a0, aa)); c.stroke();
    }, { pal: PAL, alpha: 1 - ease((k - 0.4) / 0.6), outline: C.d2, keepThin: true });
  }
  function sun(ctx, x, y, r, a, rays) {   // a sun rising: a half disc with rays (screen space)
    ctx.save(); ctx.globalAlpha = clamp01(a);
    ctx.beginPath(); ctx.arc(x, y, r * 1.5, PI, 0); ctx.fillStyle = C.or; ctx.globalAlpha = clamp01(a) * 0.25; ctx.fill();
    ctx.globalAlpha = clamp01(a); ctx.beginPath(); ctx.arc(x, y, r, PI, 0); ctx.closePath(); ctx.fillStyle = C.g; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r * 0.65, PI, 0); ctx.closePath(); ctx.fillStyle = C.cream; ctx.fill();
    if (rays) for (let i = 0; i < 9; i++) { const ang = PI + (i + 0.5) / 9 * PI; art.line(ctx, i % 2 ? C.g2 : C.w, Math.round(x + Math.cos(ang) * r * 1.15), Math.round(y + Math.sin(ang) * r * 1.15), Math.round(x + Math.cos(ang) * r * (1.6 + rays)), Math.round(y + Math.sin(ang) * r * (1.6 + rays)), 1); }
    ctx.restore();
  }
  const landFist = (z, x, y, dir, s, big, life) => {
    z.shots.push(new Vis(x, y, life || 9, (ctx, sx, sy, t) => { const k = t / (life || 9), push = ease(Math.min(1, (t + 1) / 2)); fist(ctx, Math.round(sx - dir * (10 - push * 10)), sy, s, dir, { a: 1 - ease((k - 0.55) / 0.45), mono: big && t < 2 ? C.w : undefined }); burst(ctx, sx + dir * s * 0.6, sy, k, big ? 26 : 14); }));
  };

  // ================= every gold blow of his kit goes through fx.slash: draw fists and heels instead =================
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (!isI(g) || !p || !z || !z.shots) return _slash.apply(this, arguments);
    const d = dir || p.face;
    if (GOLDS[col] && (len === 22 || len === 20)) { landFist(z, x + d * 4, y, d, 11, false); return; }                    // Fist Storm, Meteor Rush
    if (col === '#fff3c4' && len === 34 && p.state === 'ult') { landFist(z, x, y, d, 13, false); steam(x, y, 2); return; }   // Seventh Breath, every blow
    if (col === '#fff3c4' && (len === 40 || len === 48)) {                                                                // Whirl Heel, Sky Kick
      const rising = len === 48, ax = x, ay = y;
      z.shots.push(new Vis(ax, ay, 12, (ctx, sx, sy, t) => { heelArc(ctx, sx, sy - (rising ? 6 : 0), d, rising ? 22 : 18, t / 12, rising); if (rising && t < 8) PX.lines(ctx, sx, sy + 10, PI / 2, 30, 5, t, C.g2, 20); }));
      steam(ax, ay - 6, rising ? 6 : 4);
      return;
    }
    if (col === '#ffffff' && (len === 52 || len === 70)) {                                                                // the last of Fist Storm, the ult's finish
      z.shots.push(new Vis(x, y, 16, (ctx, sx, sy, t) => { const k = t / 16; if (t < 4) PX.impact(ctx, sx, sy, t / 4, 47); sun(ctx, sx - d * 4, sy + 12, 12 + k * 10, 1 - k, 1 + k); fist(ctx, sx, sy, 18, d, { a: 1 - ease((k - 0.5) / 0.5), mono: t < 2 ? C.w : undefined }); }));
      steam(x, y, 10, true);
      return;
    }
    return _slash.apply(this, arguments);
  };

  // ================= S+I: Meteor Heel: he lands like a rising sun turned over =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.ivo;
  if (BU && BU.cast) {
    const _mh = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _mh.apply(this, arguments);
      if (!isI(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
      if (drv && drv.end) {
        const _end = drv.end;
        drv.end = function () {
          const L = fx.list, m = L.length, out = _end.apply(this, arguments);
          for (let i = L.length - 1; i >= m; i--) if (L[i] && L[i].k === 'r' && L[i].col === '#ffb703') L.splice(i, 1);
          const x = p.x, y = p.y;
          z.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => {
            const k = t / 22;
            if (t < 4) PX.impact(ctx, sx, sy - 16, t / 4, 29);
            ctx.save(); ctx.translate(sx, sy); ctx.scale(1, -1); sun(ctx, 0, 0, 14 + k * 6, 1 - k, 1.4); ctx.restore();   // the sun, turned over, sunk into the floor
            for (const dd of [-1, 1]) { ctx.save(); ctx.globalAlpha = 1 - k; art.line(ctx, C.g, Math.round(sx + dd * 10), sy - 1, Math.round(sx + dd * (20 + ease(k) * 50)), sy - 1, 2); art.line(ctx, C.w, Math.round(sx + dd * (14 + ease(k) * 40)), sy - 3, Math.round(sx + dd * (20 + ease(k) * 50)), sy - 3, 1); ctx.restore(); }
          }));
          steam(x, y - 8, 10, true);
          return out;
        };
      }
      return r;
    };
  }

  // ================= his combo, and the small auras =================
  let lastHit = -9;
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, a = p.atk;
    if (behind && p.awakeT > 0) {   // Red Pulse: a low sunrise glowing at his heels
      const fade = Math.min(1, p.awakeT / 30);
      sun(ctx, sx - d * 8, sy + 1, 8 + Math.sin(p.t * 0.06), 0.8 * fade, 0.6);
      return;
    }
    if (behind) return;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // a gold fist on every hit
      const k = p.st - a.hitAt;
      if (k >= -1 && k < 6) {
        const hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), reach = a.box ? a.box[0] + a.box[2] * 0.65 : 20, out = ease((k + 2) / 3);
        fist(ctx, Math.round(sx + d * (6 + reach * out)), Math.round(hy), 9, d, { a: k < 3 ? 1 : 1 - (k - 3) / 3 });
        if (k >= 0 && k < 4) burst(ctx, sx + d * (10 + reach), hy, k / 4, 12);
        if (k === 0 && p.t !== lastHit && p.modeT > 0) { lastHit = p.t; steam(p.x, p.y - 30, 4); }   // Second Pulse: a breath of steam per hit
      }
    }
    if (p.modeT > 0 && p.t % 14 === 0) steam(p.x + rand(-5, 5), p.y - 30, 2);   // Second Pulse: golden steam in pulses
    if (p.awakeT > 0 && p.t % 8 === 0) steam(p.x + rand(-5, 5), p.y - 30, 2, true);   // Red Pulse: red-gold steam
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isI(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };

  // ================= W+I: Seventh Breath =================
  const _sb = N.ULT && N.ULT.seventh_breath;
  if (_sb) N.ULT.seventh_breath = function (p, z, foes) {
    const r = _sb.apply(this, arguments);
    if (!isI(G)) return r;
    if (p.st === 6) {
      const sky = new Vis(0, 0, 66, (ctx, x, y, t) => {   // (screen space) the dawn: an orange band low in the sky, the sun's rim
        const k = Math.min(1, t / 12, (66 - t) / 10);
        ctx.save(); ctx.globalAlpha = 0.28 * k; ctx.fillStyle = C.or; ctx.fillRect(0, H * 0.45, W, H * 0.2); ctx.globalAlpha = 0.18 * k; ctx.fillStyle = C.g; ctx.fillRect(0, H * 0.32, W, H * 0.13); ctx.restore();
        sun(ctx, W / 2, Math.round(H * 0.62), 22, 0.55 * k, 0.8);
      });
      sky.draw = function (ctx) { if (this.render) this.render(ctx, 0, 0, this.t, this); };
      sky._ugS = 1; z.shots.push(sky);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('ivo') >= 0) finale(p, z, T);
    }
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100): the sun
  // rises behind the target; on the blow one great gold fist drives through it
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 16) return;
      const dir = T.x >= p.x ? 1 : -1;
      if (st < FIN) {
        const k = ease((st - 74) / (FIN - 74));
        sun(ctx, sx + dir * 10, sy + 2, 14 + k * 16, k, 0.5 + k);
        const back = 30 + ease((st - (FIN - 8)) / 8) * 10;
        fist(ctx, sx - dir * back, sy - 22, 20, dir, { a: Math.min(1, (st - 78) / 6) });
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? C.w : undefined;
        if (ik < 1) PX.impact(ctx, sx, sy - 22, ik, 37);
        sun(ctx, sx + dir * 10, sy + 2, 30 + k * 20, 1 - k, 2);
        fist(ctx, sx + dir * ease(Math.min(1, (st - FIN) / 2)) * 8, sy - 22, 22, dir, { mono, a: 1 - ease((k - 0.55) / 0.45) });
        if (st === FIN) steam(T.x, T.y - 22, 18, true);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
