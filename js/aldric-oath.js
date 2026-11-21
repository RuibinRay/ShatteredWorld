'use strict';
// Shattered Worlds — Aldric's oath (2026-11-20, the hero-look rework: cool, not cute). His story: Subject 12, the knight
// who broke one oath to keep an older one - the oath and the sea wall; a door-length greatsword, gold light at his
// visor, a dark red cape; gold light like "the sky decides". Steel, pale gold, deep red. His blows were pale slash
// arcs, a ring, a light column. Now: heavy steel arcs with a gold leading edge and stone chips, the oath as a sigil (a
// sword in a ring) of gold light, the sea wall as blocks of grey stone, the ground breaking into flagstones, and when
// the sky decides, greatswords of light come down. Crisp pixel art (js/pixel-kit.js; the great sword is baked once).
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/bando-rope.js.
//   U      Earthcleave: a heavy steel arc with a gold edge and stone chips; the shockwave breaks the floor into flagstones
//   S+U    Riposte: an oath sigil - a shield of gold light with a sword in it - stands in front of him while he waits
//   I      Iron Tempest: a full wheel of steel round him, a gold rim, sparks thrown off it
//   S+I    Vanguard: a sea wall of stone blocks rises in front of him as he charges; the great stroke breaks it
//   W+O    Judgment: a gold sigil marks the foe on the floor, then a greatsword of light drops from the sky into it
//   J      every blow is the greatsword: a wide steel arc, gold along its edge
//   S+O    Vow: his visor slit burns gold; a faint sword of light hangs behind him      O  Bastion Form: a ghost of
//          the old harbour wall stands behind him with a gold oath line across it (both small on purpose)
//   W+I    Skysplitter: each of the three blows is a greatsword of light falling into the target; on the finishing
//          blow (js/ult-grand.js) the sigil opens under the target, a vast sword hangs over it, and it comes down on an
//          impact frame and breaks the floor
// SW.aldricOath.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Geyser = SW.Geyser, Shot = SW.Shot;
  if (!N || !N.Vis || !P || !CASTS || !PX || !PX.impact || !PX.sprite || !Geyser || !Shot || !CASTS.cleave || !CASTS.iron_tempest) return;
  const AO = SW.aldricOath = { on: true };
  const isAl = g => !!(AO.on && g && g.state && g.state.hero === 'aldric');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H, R = Math.round;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#0c0c14', st0: '#4a5060', st: '#8a92a8', st2: '#c8ccd8', w: '#ffffff', g0: '#a08030', g: '#f0e0a0', g2: '#fff6d8', gd: '#ffd60a', red: '#7a1018', red2: '#b02030', sn0: '#3a3a44', sn: '#6a6a74', sn2: '#9a9aa4' };
  const PAL = [C.out, C.st0, C.st, C.st2, C.w, C.g0, C.g, C.g2, C.gd, C.red, C.red2, C.sn0, C.sn, C.sn2];

  const cache = new Map();
  function baked(key, w, h, paint) {
    let cv = cache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = w; cv.height = h; paint(cv.getContext('2d'), Math.floor(w / 2), Math.floor(h / 2)); cv.addEventListener('contextlost', () => cache.delete(key)); cache.set(key, cv); }
    return cv;
  }
  const blit = (ctx, cv, x, y, a) => { if (a !== undefined && a <= 0) return; ctx.save(); if (a !== undefined) ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, R(x - cv.width / 2), R(y - cv.height / 2)); ctx.restore(); };
  // a greatsword of light, point down, (x, y) its point; L its length
  function lightSword(ctx, x, y, L, a, mono) {
    const S = R(L), w = R(L * 0.32) + 6, h = S + 8;
    const cv = baked('ls' + S + (mono ? 'm' : ''), w, h, (c, cx, cy) => PX.sprite(c, cx, cy, w, h, q => {
      const top = -h / 2 + 3, bw = Math.max(3, L * 0.075);
      q.fillStyle = C.g; q.beginPath(); q.moveTo(0, h / 2 - 3); q.lineTo(-bw, h / 2 - 3 - bw * 2.2); q.lineTo(-bw, top + L * 0.26); q.lineTo(bw, top + L * 0.26); q.lineTo(bw, h / 2 - 3 - bw * 2.2); q.closePath(); q.fill();   // the blade
      q.fillStyle = C.w; q.fillRect(-Math.max(1, bw * 0.3), top + L * 0.27, Math.max(1, bw * 0.5), L * 0.62);   // its fuller, white
      q.fillStyle = C.gd; q.fillRect(-L * 0.16, top + L * 0.22, L * 0.32, Math.max(2, L * 0.04));   // the crossguard
      q.fillStyle = C.g0; q.fillRect(-bw * 0.6, top + 2, bw * 1.2, L * 0.2);   // the grip
      q.beginPath(); q.arc(0, top + 1, Math.max(2, bw * 0.8), 0, PI * 2); q.fillStyle = C.gd; q.fill();   // the pommel
    }, { pal: PAL, outline: C.out, keepThin: true, mono }));
    blit(ctx, cv, x, y - S / 2, a);
  }
  AO.lightSword = lightSword;
  // the oath sigil: a sword in a ring of gold light (sq < 1 lays it on the floor)
  function sigil(ctx, x, y, r, a, sq, t) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    const m = Math.max(16, R(r * 2.2));
    for (let i = 0; i < m; i++) { const an = i / m * PI * 2 + (t || 0) * 0.03; art.rect(ctx, i % 3 ? C.g : C.w, R(x + Math.cos(an) * r), R(y + Math.sin(an) * r * sq), 2, sq < 0.6 ? 1 : 2); }
    for (let i = 0; i < m; i++) { if (i % 2) continue; const an = i / m * PI * 2 - (t || 0) * 0.05; art.rect(ctx, C.g0, R(x + Math.cos(an) * r * 0.78), R(y + Math.sin(an) * r * 0.78 * sq), 1, 1); }
    const h = r * 0.62 * (sq < 0.6 ? sq * 1.6 : 1);   // the sword glyph
    art.line(ctx, C.w, R(x), R(y - h), R(x), R(y + h), 1); art.line(ctx, C.gd, R(x - r * 0.3), R(y - h * 0.45), R(x + r * 0.3), R(y - h * 0.45), 1);
    ctx.restore();
  }
  // a heavy greatsword arc: steel with a gold leading edge
  function swordArc(ctx, x, y, d, Rr, k, tilt, big) {
    if (k >= 1) return;
    const sw = ease(Math.min(1, k * 3)), s = R(Rr * 2.8);
    PX.sprite(ctx, x, y, s, s, c => {
      c.scale(d, 1); c.rotate(tilt || 0); c.lineCap = 'butt';
      const a0 = -1.3, a1 = a0 + 2.6 * sw;
      c.strokeStyle = C.st0; c.lineWidth = big ? 5 : 3; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr - 3, a0 + 0.3, a1); c.stroke();
      c.strokeStyle = C.st; c.lineWidth = big ? 4 : 3; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr - 1, a0 + 0.15, a1); c.stroke();
      c.strokeStyle = C.st2; c.lineWidth = 2; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr, a0 + 0.4, a1); c.stroke();
      c.strokeStyle = C.gd; c.lineWidth = 2; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr + 2, a1 - 0.9, a1); c.stroke();   // the gold edge
      c.strokeStyle = C.g; c.lineWidth = 1; c.beginPath(); c.arc(-Rr * 0.3, 0, Rr + 4, a0 + 0.2, a1 - 0.2); c.stroke();   // its long trail
    }, { pal: PAL, alpha: 1 - ease((k - 0.45) / 0.55), outline: C.out, keepThin: true });
  }
  function block(ctx, x, y, w, h, a, hi) {   // a block of grey stone
    ctx.save(); ctx.globalAlpha *= clamp01(a);
    art.rect(ctx, C.out, R(x) - 1, R(y) - 1, w + 2, h + 2); art.rect(ctx, C.sn, R(x), R(y), w, h); art.rect(ctx, hi ? C.sn2 : C.sn0, R(x), R(y), w, 1); art.rect(ctx, C.sn0, R(x), R(y) + h - 1, w, 1);
    ctx.restore();
  }
  function chips(ctx, x, y, k, n, seed) {   // stone chips thrown up
    for (let i = 0; i < n; i++) { const s = i % 2 ? 1 : -1, vx = s * (0.5 + ((i * 31 + seed) % 7) / 7) * 1.4, vy = 2 + ((i * 13 + seed) % 5) * 0.5; block(ctx, x + vx * k * 22, y - vy * k * 22 + k * k * 34, 3, 2, 1 - ease((k - 0.6) / 0.4), i % 3 === 0); }
  }

  // ================= U: Earthcleave, Vanguard's stroke, Iron Tempest's turns, his J: greatsword arcs =================
  let spinning = null;
  const _slash = fx.slash;
  fx.slash = function (x, y, dir, kind, col, len) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (!isAl(g) || !p || !z || !z.shots) return _slash.apply(this, arguments);
    const d = dir || p.face;
    if (col === '#fff0c0' && len === 46 && spinning && !spinning.gone) return;   // Iron Tempest: its wheel is drawn whole
    if (col === '#fff0c0' && (len === 52 || len === 60)) {   // Earthcleave, Vanguard's great stroke
      const big = len === 60;
      z.shots.push(new Vis(x, y, 16, (ctx, sx, sy, t) => { const k = t / 16; swordArc(ctx, sx, sy, d, big ? 34 : 30, k, big ? 0.15 : 0.55, true); chips(ctx, sx + d * 20, p.y - G.cam.y + (sy - (y - G.cam.y)), k, 6, R(x)); }));
      return;
    }
    if (col === '#ffffff' && (p.state === 'attack' || p.state === 'airatk')) {   // his J
      p._alJ = SW.frame; const a = p.atk, fin = !!(a && a.fin), Rr = Math.max(16, Math.min(32, (len || 26) * 0.75)), tilt = kind === 2 ? 0.5 : kind === 3 ? -0.5 : 0.2;
      z.shots.push(new Vis(x + d * Rr * 0.45, y, fin ? 16 : 12, (ctx, sx, sy, t) => { swordArc(ctx, sx, sy, d, Rr, t / (fin ? 16 : 12), tilt, fin); if (fin) chips(ctx, sx + d * 10, sy + 16, t / 16, 5, R(x)); }));   // (in front of him, not over him)
      return;
    }
    return _slash.apply(this, arguments);
  };
  // the shockwave: the floor breaking into flagstones as it runs
  function shockDraw(ctx, cam) {
    const x = R(this.x - cam.x), gy = R(this.fy - cam.y), d = this.vx >= 0 ? 1 : -1, t = this.t || 0, tr = this._alTrail || (this._alTrail = []);
    if (!tr.length || Math.abs(this.x - tr[tr.length - 1].x) >= 9) tr.push({ x: this.x, t });
    tr.forEach((q, i) => { const age = t - q.t; if (age > 16) return; const k = age / 16, qx = R(q.x - cam.x), up = Math.sin(Math.min(1, k * 2.2) * PI) * 8; block(ctx, qx - 4, gy - 4 - up, 8, 4, 1 - k, true); if (i % 2) block(ctx, qx + 2, gy - 2 - up * 0.6, 5, 3, 1 - k); });
    ctx.save(); ctx.globalAlpha *= 0.8; art.rect(ctx, C.g, x - 6, gy - 2, 12, 2); art.rect(ctx, C.w, x - 2, gy - 3, 4, 1); ctx.restore();
    if (t % 3 === 0) part(this.x + d * rand(0, 6), this.fy - 4, C.sn2, d * rand(0.3, 1.2), -rand(1, 2.4), 16, 2, 0.2);
  }
  function dressShots(z) { z.shots.forEach(s => { if (s.aldric || s.kind !== 'shock' || s.team !== 'player' || s.col !== '#f0e0a0') return; s.aldric = 1; s.draw = shockDraw; }); }

  // ================= S+U: Riposte: the oath sigil as a shield of light =================
  const _rp = CASTS.riposte;
  if (_rp) CASTS.riposte = function (p, z) {
    const r = _rp.apply(this, arguments);
    if (!isAl(G)) return r;
    z.shots.push(new Vis(p.x, p.y, 46, (ctx, sx, sy, t) => {
      if (!(p.riposteT > 0) && t > 2) return;
      const d = p.face, k = Math.min(1, t / 4), fl = t < 3 ? 1 : 0;
      sigil(ctx, sx + d * 16, sy - 24, 15 * (0.6 + 0.4 * k), 0.95, 1, t);
      ctx.save(); ctx.globalAlpha *= 0.25 + fl * 0.5; art.rect(ctx, C.g, sx + d * 16 - 1, sy - 42, 2, 36); ctx.restore();
    }, v => { v.x = p.x; v.y = p.y; }));
    return r;
  };

  // ================= I: Iron Tempest: a wheel of steel =================
  const _it = CASTS.iron_tempest;
  CASTS.iron_tempest = function (p, z) {
    const n0 = z.shots.length, r = _it.apply(this, arguments);
    if (!isAl(G)) return r;
    const sp = z.shots.slice(n0).find(s => s && s.p === p);
    if (sp) {
      spinning = sp;
      sp.draw = function (ctx, cam) {
        const x = R(p.x - cam.x), y = R(p.y - 22 - cam.y), t = this.t, a = Math.min(1, t / 3, (44 - t) / 6);
        ctx.save(); ctx.globalAlpha *= a;
        for (let i = 0; i < 40; i++) { const an = i / 40 * PI * 2 + t * 0.7 * this.dir, rx = 38, ry = 22; const px = R(x + Math.cos(an) * rx), py = R(y + Math.sin(an) * ry); art.rect(ctx, i % 4 === 0 ? C.st2 : C.st, px - 1, py - 1, 3, 3); }   // the steel wheel
        for (let i = 0; i < 40; i++) { const an = i / 40 * PI * 2 + t * 0.7 * this.dir; art.rect(ctx, i % 2 ? C.gd : C.g, R(x + Math.cos(an) * 41), R(y + Math.sin(an) * 24), 1, 1); }   // its gold rim
        const ba = t * 0.7 * this.dir; art.line(ctx, C.out, x, y, R(x + Math.cos(ba) * 40), R(y + Math.sin(ba) * 23), 5); art.line(ctx, C.st2, x, y, R(x + Math.cos(ba) * 40), R(y + Math.sin(ba) * 23), 3); art.line(ctx, C.gd, R(x + Math.cos(ba) * 30), R(y + Math.sin(ba) * 17), R(x + Math.cos(ba) * 40), R(y + Math.sin(ba) * 23), 1);   // the blade itself
        ctx.restore();
        if (t % 3 === 0) part(p.x + Math.cos(ba) * 40, p.y - 22 + Math.sin(ba) * 23, C.gd, rand(-2, 2), -rand(0.5, 2), 10, 1, 0.2);
      };
    }
    return r;
  };

  // ================= S+I: Vanguard: a sea wall of stone =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.aldric;
  if (BU && BU.cast) {
    const _vg = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _vg.apply(this, arguments);
      if (!isAl(G)) return r;
      const drv = z.shots.slice(n0).find(s => s.p === p && s.step), d = p.face;
      let ended = -1;
      if (drv && drv.end) { const _e = drv.end; drv.end = function () { ended = 0; return _e.apply(this, arguments); }; }
      z.shots.push(new Vis(p.x, p.y, 44, (ctx, sx, sy, t) => {
        if (ended < 0 && drv && drv.gone) return;
        const wx = sx + d * 26;
        if (ended < 0) { const k = ease(Math.min(1, t / 5)); for (let row = 0; row < 5; row++) for (let c = 0; c < 2; c++) { const bh = 8, by = sy - 8 - row * bh * k, bx = wx + d * c * 7 - (row % 2) * 3 - 6; block(ctx, bx, by, 9, bh - 1, 0.7, row === 4); } return; }
        ended++; const k = ended / 20; if (k >= 1) return;
        for (let row = 0; row < 5; row++) for (let c = 0; c < 2; c++) { const s = (row + c) % 2 ? 1 : -1; block(ctx, wx + d * (c * 7 + k * 30 * (1 + row * 0.2)) - 6 + s * k * 8, sy - 8 - row * 8 - Math.sin(k * PI) * 10 + k * k * 40, 9, 7, 0.7 * (1 - k), row === 4); }   // broken by the stroke
      }, v => { if (ended < 0) { v.x = p.x; v.y = p.y; } }));
      return r;
    };
  }

  // ================= W+O: Judgment: the sigil, then a sword of light =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.aldric;
  if (SIG && SIG.cast) {
    const _jd = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _jd.apply(this, arguments);
      if (!isAl(G)) return r;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint || s.aldric || s.life !== 48) return;
        s.aldric = 1;
        s.paint = (ctx, sx, sy, q) => {
          const t = q.t, delay = 24;
          sigil(ctx, sx, sy - 2, 28, t < delay ? Math.min(1, t / 6) : 1 - (t - delay) / 24, 0.3, t);   // (2026-11-20 look ranking: bigger, and the sky's beam warns before the sword falls)
          if (t < delay) { ctx.save(); ctx.globalAlpha = 0.12 + 0.18 * (t / delay); ctx.fillStyle = '#fff3c0'; ctx.fillRect(R(sx - 6 - t * 0.2), 0, R(12 + t * 0.4), R(sy)); ctx.globalAlpha *= 1.6; ctx.fillRect(R(sx - 1), 0, 2, R(sy)); ctx.restore(); }
          if (t < delay - 4) return;
          const u = t - (delay - 4), fall = ease(Math.min(1, u / 4)), L = 130, a = t < delay + 10 ? 1 : 1 - (t - delay - 10) / 14;
          lightSword(ctx, sx, R(sy - 300 * (1 - fall) + 6), L, a, u < 6 && u >= 4 ? C.w : undefined);
          if (u >= 4 && u < 12) { const k = (u - 4) / 8; ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 10; i++) { const an = PI + i / 9 * PI; art.line(ctx, i % 2 ? C.gd : C.w, sx, sy - 2, R(sx + Math.cos(an) * (14 + k * 26)), R(sy - 2 + Math.sin(an) * (6 + k * 14)), 1); } ctx.restore(); chips(ctx, sx, sy - 4, k, 6, 3); }
        };
      });
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy, behind) {
    const d = p.face, t = p.t || SW.frame;
    if (behind && p.awakeT > 0) {   // Bastion Form: a ghost of the old harbour wall behind him, a gold oath line across it
      const fade = Math.min(1, p.awakeT / 30), bx = sx - d * 18;
      for (let row = 0; row < 6; row++) for (let c = -1; c <= 1; c++) block(ctx, bx + c * 9 - (row % 2) * 4 - 4, sy - 8 - row * 8, 8, 7, 0.28 * fade, row === 5);
      ctx.save(); ctx.globalAlpha *= fade * (0.6 + 0.3 * Math.sin(t * 0.1)); art.rect(ctx, C.gd, bx - 16, sy - 30, 32, 1); ctx.restore();
    }
    if (behind && p.modeT > 0) {   // Vow: a faint sword of light hanging behind him
      const fade = Math.min(1, p.modeT / 30);
      lightSword(ctx, sx - d * 12, sy - 6 + Math.sin(t * 0.06) * 2, 44, 0.3 * fade);
    }
    if (!behind && p.modeT > 0) {   // Vow: his visor slit burns gold
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha *= fade * (0.7 + 0.3 * Math.sin(t * 0.3)); art.rect(ctx, C.gd, sx + (d > 0 ? 0 : -4), sy - 40, 5, 1); art.rect(ctx, C.w, sx + (d > 0 ? 2 : -2), sy - 40, 1, 1); ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isAl(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, true);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, false);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isAl(g || this.G) && z && z.shots) { dressShots(z); dressJ(this, z); } return r; };
  // his J swings call no slash effect of their own (the greatsword combo), so the arc goes on at the moment each blow lands
  function dressJ(p, z) {
    const a = p.atk; if (!a || (p.state !== 'attack' && p.state !== 'airatk') || p.st !== a.hitAt || p._alJ === SW.frame) return;
    const d = p.face, fin = !!a.fin, b = a.box || [0, -40, 40, 40], Rr = Math.max(18, Math.min(32, b[2] * 0.62)), x = p.x + d * (10 + b[2] * 0.3), y = p.y + b[1] + b[3] / 2, tilt = b[3] > b[2] ? 0.6 : 0.15;
    z.shots.push(new Vis(x, y, fin ? 16 : 12, (ctx, sx, sy, t) => { swordArc(ctx, sx, sy, d, Rr, t / (fin ? 16 : 12), tilt, fin); if (fin) chips(ctx, sx + d * 16, sy + 16, t / 16, 5, R(x)); }));
  }

  // ================= W+I: Skysplitter: swords of light fall into the target =================
  const _gd = Geyser.prototype.draw;
  Geyser.prototype.draw = function (ctx, cam) {
    if (!isAl(G) || this.col !== '#f0e0a0') return _gd.apply(this, arguments);
    const x = R(this.x - cam.x), y = R(this.y - cam.y), t = this.t;
    sigil(ctx, x, y - 2, 20, t < 20 ? 1 : 1 - (t - 20) / 6, 0.3, t);
    const fall = ease(Math.min(1, t / 6)), a = t < 16 ? 1 : 1 - (t - 16) / 10;
    lightSword(ctx, x, R(y - 320 * (1 - fall) + 8), 120, a, t >= 6 && t < 8 ? C.w : undefined);
    if (t >= 6 && t < 14) chips(ctx, x, y - 4, (t - 6) / 8, 8, R(this.x));
  };
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isAl(g) || !z || !z.shots) return r;
    if (p.st === 8) {
      const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('aldric') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T, FIN, BU2);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the sigil opens under the target, a vast sword hangs over it and comes down
  // on an impact frame, breaking the floor
  function finale(p, z, T, FIN, BU2) {
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / (FIN - BU2 + 2));
        sigil(ctx, sx, sy - 2, 16 + k * 18, k, 0.3, st);
        lightSword(ctx, sx, R(sy - 30 - (1 - k) * 10), 40, 0.4 + k * 0.6);   // (low enough to stay in the close-up)
      } else {
        const u = st - FIN, k = u / 18, ik = u / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 30, ik, 67);
        lightSword(ctx, sx, sy + 10, 90, 1 - ease((k - 0.6) / 0.4), u < 2 ? C.w : undefined);
        sigil(ctx, sx, sy - 2, 34 + k * 20, 1 - k, 0.3, st);
        for (let i = 0; i < 12; i++) { const s = i % 2 ? 1 : -1, row = i >> 1; block(ctx, sx + s * (10 + row * 8 + k * 40) - 4, sy - 6 - Math.sin(Math.min(1, k * 1.6) * PI) * (14 + row * 4) + k * k * 30, 9, 6, 1 - ease((k - 0.6) / 0.4), row % 2 === 0); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, R(v.x - cam.x), R(v.y - cam.y)); });
  }
})();
