'use strict';
// Shattered Worlds — Tor's shield (2026-11-20, the hero-look rework: cool, not cute). His story: the gate's shield, and the
// caravans'; "nothing has ever got past him"; his look: a huge round shield Garo forged, held in front, arrows and shards
// bouncing off it. His shield was two discs and his walls plain rings. It is now a round war shield drawn as crisp pixel
// art by js/pixel-kit.js: steel-blue planks under an iron rim with a ring of rivets, a dented domed boss, scratches, and
// two arrowheads still stuck in it; his force comes out as walls of light in its shape. Draw-only: every hit, hitbox and
// timing stays as it was. Loaded after js/mika-moons.js.
//   U      Shield Toss: the shield spins flat out and back, its rim catching the light
//   S+U    Shield Bash: he charges behind the shield, sparks and shards glancing off its face
//   I      Bulwark Slam: the rim hits the floor; a crack and a wall of dust and stone run out both ways
//   S+I    Phalanx: ghost shields lock in a wall above and below his own; a shot thrown back flashes off the face
//   W+O    Unbreakable: the shield glows as it takes everything in, then bursts out in a ring of shields
//   J      the finisher: a bash, with a ring flash off the rim
//   S+O    Hold the Line: a line scored in the floor in front of him, sparking      O  Iron Wall: four small ghost shields
//          stand round him like the village gate (small on purpose: the view stays clear)
//   (guard) the shield is up in front of him; a shot it throws back sparks off it
//   W+I    Last Stand: wall after wall of force rolls out in the shape of his shield; on the finishing blow
//          (js/ult-grand.js) his shield comes down over the target like a gate and slams on an impact frame
// SW.torShield.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.shield_toss || !CASTS.bulwark_slam) return;
  const TS = SW.torShield = { on: true };
  const isT = g => !!(TS.on && g && g.state && g.state.hero === 'tor');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const PAL = ['#0c1218', '#1a2430', '#2b3a4a', '#3d5470', '#577590', '#7a96b4', '#a8c4dc', '#e0f0ff', '#ffffff', '#5a4a3a', '#a08060'];
  const C = { out: PAL[0], d1: PAL[1], d2: PAL[2], m: PAL[3], b: PAL[4], l: PAL[5], hi: PAL[6], ice: PAL[7], w: PAL[8], wood: PAL[9], fl: PAL[10] };

  // ---------- the shield, face-on: (0, 0) its boss, r its radius ----------
  function shieldVec(c, r, o) {
    c.beginPath(); c.arc(0, 0, r, 0, PI * 2); c.fillStyle = C.d2; c.fill();                         // the iron rim
    c.beginPath(); c.arc(0, 0, r * 0.86, 0, PI * 2); c.fillStyle = C.b; c.fill();                 // the face
    c.save(); c.beginPath(); c.arc(0, 0, r * 0.86, 0, PI * 2); c.clip();
    c.fillStyle = C.m; for (let i = -3; i <= 3; i++) c.fillRect(i * r * 0.28 - Math.max(1, r * 0.03), -r, Math.max(1, r * 0.05), r * 2);   // the planks
    c.beginPath(); c.arc(-r * 0.3, -r * 0.35, r * 0.75, 0, PI * 2); c.fillStyle = C.l; c.globalAlpha = 0.45; c.fill(); c.globalAlpha = 1;   // light from the upper left
    c.strokeStyle = C.hi; c.lineWidth = Math.max(1, r * 0.03); [[-0.5, 0.2, 0.2, 0.45], [0.2, -0.55, 0.55, -0.2]].forEach(([a, b, cc, d]) => { c.beginPath(); c.moveTo(a * r, b * r); c.lineTo(cc * r, d * r); c.stroke(); });   // scratches
    c.restore();
    c.fillStyle = C.ice; for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; c.fillRect(Math.cos(a) * r * 0.93 - Math.max(1, r * 0.04), Math.sin(a) * r * 0.93 - Math.max(1, r * 0.04), Math.max(1, r * 0.08), Math.max(1, r * 0.08)); }   // rivets
    c.beginPath(); c.arc(0, 0, r * 0.3, 0, PI * 2); c.fillStyle = C.l; c.fill();                   // the domed boss
    c.beginPath(); c.arc(-r * 0.08, -r * 0.08, r * 0.16, 0, PI * 2); c.fillStyle = C.ice; c.fill();
    c.fillStyle = C.d2; c.fillRect(r * 0.06, r * 0.04, Math.max(1, r * 0.1), Math.max(1, r * 0.07));   // the dent
    if (o.arrows !== false && r >= 8) [[0.45, -0.5, -0.6], [-0.55, 0.35, 0.5]].forEach(([x, y, a]) => {   // two arrowheads still stuck in it, shafts snapped
      c.save(); c.translate(x * r, y * r); c.rotate(a); c.fillStyle = C.wood; c.fillRect(0, -Math.max(1, r * 0.04), r * 0.4, Math.max(1, r * 0.08)); c.fillStyle = C.fl; c.fillRect(r * 0.3, -Math.max(1, r * 0.1), r * 0.12, Math.max(2, r * 0.2)); c.restore();
    });
  }
  // o = { squash (0..1: seen edge-on), spin, a, mono, arrows }
  function shield(ctx, x, y, r, o) {
    o = o || {};
    PX.sprite(ctx, x, y, r * 2.6 + 4, r * 2.6 + 4, c => { c.rotate(o.spin || 0); c.scale(o.squash === undefined ? 1 : Math.max(0.12, o.squash), 1); shieldVec(c, r, o); }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.out, keepThin: true });
  }
  TS.shield = shield;
  function sparks(x, y, n, dir) { for (let i = 0; i < n; i++) part(x, y + rand(-6, 6), i % 2 ? C.ice : '#ffd24a', dir * rand(1, 3.5), rand(-2.5, 1), 12, 1, 0.15); }
  function wall(ctx, x, y, r, k, dir, col) {   // a wall of force in the shield's shape: an arc of light facing dir
    if (k <= 0 || k >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - k;
    ctx.strokeStyle = col || C.ice; ctx.lineWidth = Math.max(1, 3 * (1 - k));
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.35, r, 0, dir > 0 ? -PI / 2 : PI / 2, dir > 0 ? PI / 2 : PI * 1.5); ctx.stroke();
    ctx.fillStyle = C.w; for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * PI / 4; ctx.fillRect(Math.round(x + dir * Math.cos(a) * r * 0.35), Math.round(y + Math.sin(a) * r), 2, 2); }
    ctx.restore();
  }

  // ================= U: Shield Toss =================
  function dressToss(p, z) {
    z.shots.forEach(s => {
      if (s.tor || !(s instanceof Proj) || s.w !== 16 || s.h !== 16 || !s.ghost || s.team === 'enemy') return;
      s.tor = 1;
      s.render = (ctx, x, y, q) => { shield(ctx, x, y, 10, { squash: 0.35 + 0.15 * Math.sin(q.t * 0.9), spin: q.t * 0.05 }); if (q.t % 6 < 2) art.rect(ctx, C.w, Math.round(x) - 1, Math.round(y) - 10, 2, 2); };
    });
  }
  const _st = CASTS.shield_toss;
  CASTS.shield_toss = function (p, z) { const r = _st.apply(this, arguments); if (isT(G)) dressToss(p, z); return r; };

  // ================= S+U: Shield Bash =================
  const _sb = CASTS.shield_bash;
  if (_sb) CASTS.shield_bash = function (p, z) {
    const n0 = z.shots.length, r = _sb.apply(this, arguments);
    if (!isT(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step), d = p.face;
    z.shots.push(new Vis(p.x, p.y, 16, (ctx, sx, sy, t) => { if (drv && drv.gone && t > 2) return; shield(ctx, sx + d * 14, sy - 20, 13, { squash: 0.55 }); for (let i = 0; i < 3; i++) art.line(ctx, C.ice, sx - d * (8 + i * 10), sy - 28 + i * 8, sx - d * (24 + i * 10), sy - 28 + i * 8, 1); }, v => { v.x = p.x; v.y = p.y; if (v.t % 3 === 0 && drv && !drv.gone) sparks(p.x + d * 20, p.y - 20, 2, -d); }));
    return r;
  };

  // ================= I: Bulwark Slam =================
  const _bs = CASTS.bulwark_slam;
  CASTS.bulwark_slam = function (p, z) {
    const r = _bs.apply(this, arguments);
    if (!isT(G)) return r;
    const d = p.face;
    z.shots.push(new Vis(p.x, p.y, 36, (ctx, sx, sy, t) => {
      if (t < 6) { shield(ctx, sx + d * 14, sy - 30 + ease(t / 6) * 18, 13, { squash: 0.5, spin: ease(t / 6) * 0.5 }); return; }
      const k = (t - 6) / 30;
      shield(ctx, sx + d * 14, sy - 12, 13, { squash: 0.5, spin: 0.5, a: 1 - ease((k - 0.5) / 0.5) });
      ctx.save(); ctx.globalAlpha = 1 - k;
      for (const dd of [-1, 1]) { let x = sx + d * 14; for (let i = 0; i < 10 * Math.min(1, k * 4); i++) { const nx = x + dd * 8, ny = sy - Math.round(Math.abs(Math.sin(i * 2.7)) * 2); art.line(ctx, i % 2 ? C.hi : C.w, x, sy - 1, nx, ny, 1); x = nx; } }   // the crack running out both ways
      ctx.restore();
    }, v => { if (v.t === 6) { for (const dd of [-1, 1]) for (let i = 0; i < 8; i++) part(p.x + d * 14 + dd * rand(4, 20), p.y - 2, i % 2 ? '#8a7a6a' : '#c8b8a0', dd * rand(1, 3.5), -rand(1.5, 4), 22, 2, 0.18); } }));
    z.shots.forEach(s => {   // the two shockwaves: walls of stone and dust instead of the plain blocks
      if (s.tor || !s.paint || s.life !== 28 || !s.breaker) return;
      s.tor = 1;
      s.paint = (ctx, x, y, q) => { const t = q.t || 0, h = 12 + (t % 4); ctx.save(); ctx.globalAlpha = 1 - t / 28; for (let i = 0; i < 4; i++) art.rect(ctx, i % 2 ? '#8a7a6a' : '#c8b8a0', x - 6 + i * 3, y + 6 - h + (i % 2) * 3, 3, h - (i % 2) * 3); art.rect(ctx, C.ice, x - 6, y + 6 - h, 12, 1); ctx.restore(); };
    });
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    if (isT(g || this.G) && z && z.shots) { dressToss(this, z); z.shots.forEach(s => { if (!s.tor && s.paint && s.life === 28 && s.breaker) { s.tor = 1; s.paint = (ctx, x, y, q) => { const t = q.t || 0, h = 12 + (t % 4); ctx.save(); ctx.globalAlpha = 1 - t / 28; for (let i = 0; i < 4; i++) art.rect(ctx, i % 2 ? '#8a7a6a' : '#c8b8a0', x - 6 + i * 3, y + 6 - h + (i % 2) * 3, 3, h - (i % 2) * 3); art.rect(ctx, C.ice, x - 6, y + 6 - h, 12, 1); ctx.restore(); }; } }); }
    return r;
  };

  // ================= S+I: Phalanx =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.tor;
  if (BU && BU.cast) {
    const _ph = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ph.apply(this, arguments);
      if (!isT(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step), d = p.face;
      z.shots.push(new Vis(p.x, p.y, 100, (ctx, sx, sy, t) => {
        const k = ease(t / 6), out = drv && drv.gone;
        if (out) return;
        [-1, 1].forEach(j => shield(ctx, sx + d * 16, sy - 20 + j * 22 * k, 11, { squash: 0.45, a: 0.6 * k, arrows: false }));   // ghost shields locked above and below
        shield(ctx, sx + d * 16, sy - 20, 13, { squash: 0.5 });
      }, v => { v.x = p.x; v.y = p.y; if (drv && drv.gone) v.gone = true; }));
      return r;
    };
  }

  // ================= W+O: Unbreakable =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.tor;
  if (SIG && SIG.cast) {
    const _ub = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _ub.apply(this, arguments);
      if (!isT(G)) return r;
      z.shots.push(new Vis(p.x, p.y, 52, (ctx, sx, sy, t) => {
        if (t < 36) { const pulse = 0.5 + 0.5 * Math.sin(t * 0.5); ctx.save(); ctx.globalAlpha = 0.3 + pulse * 0.3; art.disc(ctx, C.ice, sx + p.face * 14, sy - 20, 16 + Math.round(pulse * 2)); ctx.restore(); shield(ctx, sx + p.face * 14, sy - 20, 14, { squash: 0.6 }); }
        else { const k = (t - 36) / 16; for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2, R = 10 + ease(k) * 50; shield(ctx, sx + Math.cos(a) * R, sy - 20 + Math.sin(a) * R * 0.7, 6, { a: 1 - k, arrows: false }); } }
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= the finisher, guard, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (p.state === 'guard') shield(ctx, sx + d * 13, sy - 20, 12, { squash: 0.5 });   // the shield up in front of him
    if (a && (p.state === 'attack' || p.state === 'airatk') && a.fin) {
      const k = p.st - a.hitAt;
      if (k >= -2 && k < 10) { shield(ctx, sx + d * (14 + ease((k + 2) / 3) * 8), sy - 20, 13, { squash: 0.5 }); if (k >= 0) { ctx.save(); ctx.globalAlpha = 1 - k / 10; art.ring(ctx, C.ice, sx + d * 26, sy - 20, Math.round(8 + k * 3)); ctx.restore(); } }
    }
    if (p.modeT > 0) {   // Hold the Line: a line scored in the floor in front of him
      const fade = Math.min(1, p.modeT / 30), x = sx + d * 22;
      ctx.save(); ctx.globalAlpha = fade; art.rect(ctx, C.ice, x, sy - 1, 1, 3); art.rect(ctx, C.l, x - 8, sy, 16, 1); if (p.t % 10 < 2) art.rect(ctx, '#ffd24a', x + rand(-6, 6) | 0, sy - 2, 1, 1); ctx.restore();
    }
    if (p.awakeT > 0) {   // Iron Wall: four small ghost shields stand round him like the village gate
      const fade = Math.min(1, p.awakeT / 30);
      for (let i = 0; i < 4; i++) { const a2 = p.t * 0.02 + i * PI / 2, x = sx + Math.cos(a2) * 18, y = sy - 16 + Math.sin(a2) * 5; shield(ctx, Math.round(x), Math.round(y), 7, { squash: 0.5 + 0.5 * Math.abs(Math.sin(a2)), a: fade * (Math.sin(a2) > 0 ? 0.8 : 0.4), arrows: false }); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isT(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };

  // ================= W+I: Last Stand =================
  const _ls = N.ULT && N.ULT.last_stand;
  if (_ls) N.ULT.last_stand = function (p, z, foes) {
    const L = fx.list, m = L.length, r = _ls.apply(this, arguments);
    if (!isT(G)) return r;
    for (let i = L.length - 1; i >= m; i--) if (L[i] && L[i].col === '#e0f0ff' && (L[i].r1 === 200 || L[i].max === 10)) L.splice(i, 1);   // the plain rings: walls of force replace them
    if (p.st >= 12 && p.st <= 52 && (p.st - 12) % 8 === 0) for (const dd of [-1, 1]) {
      const v = new Vis(p.x, p.y, 30, (ctx, sx, sy, t) => { const k = t / 30; wall(ctx, sx + dd * (14 + ease(k) * 220), sy - 24, 26, k, dd); wall(ctx, sx + dd * (4 + ease(k) * 200), sy - 24, 20, k + 0.1, dd, C.l); });
      v._ugS = 1; z.shots.push(v);
    }
    if (p.st === 6) {
      const v = new Vis(p.x, p.y, 64, (ctx, sx, sy, t) => { if (p.state !== 'ult') return; shield(ctx, sx + p.face * 14, sy - 22, 15, { squash: 0.55 + 0.05 * Math.sin(t * 0.3) }); if (t % 8 === 0) for (let i = 0; i < 3; i++) art.rect(ctx, '#c8b8a0', sx - 8 + i * 8, sy - 1, 2, 1); }, vv => { vv.x = p.x; vv.y = p.y; });   // planted, shield up
      v._ugS = 1; z.shots.push(v);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): his shield, grown huge, hangs over the target like a gate, then slams down
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('tor') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    let dusted = false;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      const cy = sy - 30;
      if (st < FIN) { const k = ease((st - (BU2 - 2)) / (FIN - BU2)), drop = ease((st - (FIN - 4)) / 4); shield(ctx, sx, cy - 8 * (1 - drop) + drop * 8, 30, { a: Math.min(1, k * 3), squash: 1 }); }
      else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? C.w : undefined;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 19);
        shield(ctx, sx, cy + 8, 30, { mono, a: 1 - ease((k - 0.5) / 0.5) });
        wall(ctx, sx, cy + 8, 36, k, 1); wall(ctx, sx, cy + 8, 36, k, -1);
        if (!dusted) { dusted = true; for (let i = 0; i < 20; i++) part(T.x + rand(-30, 30), T.y - 2, i % 2 ? '#c8b8a0' : C.ice, rand(-4, 4), -rand(1, 3.5), 22, 2, 0.15); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
