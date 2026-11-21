'use strict';
// Shattered Worlds — Rook's crowd (2026-11-20, the hero-look rework: cool, not cute). His story: the Lantern Cell's
// loudest, who "never fights alone, not even when he is alone"; his clones held the door until the last one went up in
// smoke. His clones were his own sprite drawn faded, and his smoke loose grey dots. Now his clones are see-through teal
// copies with a bright teal edge, and every one steps out of, and goes back into, a crisp puff of smoke with a "poof"
// ring (drawn with js/pixel-kit.js). Draw-only: every hit, hitbox and timing stays as it was. Loaded after
// js/tarn-road.js.
//   U      Twin Rush: a teal clone bursts out of a smoke puff and dashes through, a teal streak behind it
//   S+U    Swap Out: the clone left behind flashes and pops into a smoke ring
//   I      Pile-On: four teal clones charge in one after another
//   S+I    Wheel Toss: two teal clones hold the target and spin it, motion arcs round them
//   W+O    Clone Barrage: three teal clones burst out of a wall of smoke
//   J      the finisher: a teal clone strikes, then pops into smoke with a poof ring
//   (all)  every clone that fights on its own: a teal copy; puffs when it appears and when it goes
//   S+O    Second Self: two faint teal copies stand behind him      O  Many Hands: two small copies flank him (small on
//          purpose: the view stays clear)
//   W+I    A Thousand Rooks: waves of teal clones run across; on the finishing blow (js/ult-grand.js) a crowd of
//          clones piles onto the target and the whole pile goes up in one great puff of smoke on an impact frame
// SW.rookCrowd.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !art || !art.sheets || !CASTS.twin_rush || !CASTS.pile_on) return;
  const RC = SW.rookCrowd = { on: true };
  const isR = g => !!(RC.on && g && g.state && g.state.hero === 'rook');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { teal: '#2ec4b6', light: '#c8fff8', w: '#ffffff', dark: '#0a3a36', smoke0: '#8a92a8', smoke1: '#c8ccd8' };

  // ---------- a see-through teal copy of a sprite frame: a teal body, a bright teal edge ----------
  const kept = new Map();
  function keep(key, w, h, paint) {   // a cached canvas; a canvas the browser drops while the tab is hidden comes back blank, so it is drawn again
    let cv = kept.get(key);
    if (!cv) {
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const drop = () => { if (kept.get(key) === cv) kept.delete(key); };
      cv.addEventListener('contextlost', drop); cv.addEventListener('contextrestored', drop);
      paint(cv.getContext('2d'), w, h);
      if (kept.size > 400) kept.clear();
      kept.set(key, cv);
    }
    return cv;
  }
  function copy(ctx, sheet, anim, fi, x, y, flip, o) {
    o = o || {};
    const s = art.sheets[sheet]; if (!s) return;
    const list = s.anims[anim] || s.anims.idle || s.anims[Object.keys(s.anims)[0]], f = list[Math.max(0, Math.min(list.length - 1, fi | 0))];
    const sx = (f % s.cols) * s.fw, sy = Math.floor(f / s.cols) * s.fh, w = s.fw + 2, h = s.fh + 2, ek = o.edge || C.light;
    const body = keep('b' + sheet + ':' + f + ':' + (flip ? 1 : 0), w, h, (c) => {
      if (flip) { c.save(); c.translate(w, 0); c.scale(-1, 1); c.drawImage(s.img, sx, sy, s.fw, s.fh, 1, 1, s.fw, s.fh); c.restore(); } else c.drawImage(s.img, sx, sy, s.fw, s.fh, 1, 1, s.fw, s.fh);
      c.globalCompositeOperation = 'source-atop'; c.globalAlpha = 0.62; c.fillStyle = C.teal; c.fillRect(0, 0, w, h);
    });
    const edgeC = keep('e' + sheet + ':' + f + ':' + (flip ? 1 : 0) + ek, w, h, (c) => {
      if (flip) { c.save(); c.translate(w, 0); c.scale(-1, 1); c.drawImage(s.img, sx, sy, s.fw, s.fh, 1, 1, s.fw, s.fh); c.restore(); } else c.drawImage(s.img, sx, sy, s.fw, s.fh, 1, 1, s.fw, s.fh);
      c.globalCompositeOperation = 'source-in'; c.fillStyle = ek; c.fillRect(0, 0, w, h);
    });
    const off = body, edge = edgeC;
    const dx = Math.round(x) - (flip ? (s.fw - s.ox) : s.ox) - 1, dy = Math.round(y) - s.oy - 1, a = o.a === undefined ? 0.8 : o.a;
    const sc = o.scale || 1;
    ctx.save(); ctx.imageSmoothingEnabled = false;
    if (sc !== 1) { ctx.translate(Math.round(x), Math.round(y)); ctx.scale(sc, sc); ctx.translate(-Math.round(x), -Math.round(y)); }
    ctx.globalAlpha = a; for (const [ox2, oy2] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.drawImage(edge, 0, 0, w, h, dx + ox2, dy + oy2, w, h);   // the bright edge
    ctx.globalAlpha = a * 0.85; ctx.drawImage(off, 0, 0, w, h, dx, dy, w, h);
    ctx.restore();
  }
  RC.copy = copy;
  // a crisp puff of smoke with a "poof" ring: (x, y) its base
  function puff(z, x, y, big) {
    const n = big ? 9 : 6, R = big ? 16 : 10, vari = (rand(0, 4) | 0), seed = vari * 2.1;
    const v = new Vis(x, y, big ? 22 : 16, (ctx, sx, sy, t) => {
      const k = t / (big ? 22 : 16), a = 1 - ease((k - 0.45) / 0.55), cw = Math.ceil(R * 4), ch = Math.ceil(R * 3.4);
      const cv = keep('p' + (big ? 1 : 0) + vari + ':' + t, cw, ch, (cc) => PX.sprite(cc, cw / 2, ch / 2, cw, ch, c => {
        for (let i = 0; i < n; i++) { const ang = i / n * PI * 2 + seed, d = R * (0.4 + ease(k) * 0.8), r = R * (0.45 + 0.25 * Math.sin(i * 2.3 + seed)) * (1 - k * 0.3); c.beginPath(); c.arc(Math.cos(ang) * d, Math.sin(ang) * d * 0.7 - k * 6, r, 0, PI * 2); c.fillStyle = i % 3 ? C.smoke1 : C.w; c.fill(); }
        c.beginPath(); c.arc(-R * 0.2, -R * 0.2 - k * 6, R * 0.5, 0, PI * 2); c.fillStyle = C.w; c.fill();
      }, { pal: [C.dark, C.smoke0, C.smoke1, C.w, C.teal, C.light], outline: C.smoke0 }));
      ctx.save(); ctx.imageSmoothingEnabled = false; ctx.globalAlpha *= clamp01(a); ctx.drawImage(cv, Math.round(sx) - cw / 2, Math.round(sy - R) - ch / 2); ctx.restore();
      if (t < 8) { ctx.save(); ctx.globalAlpha = 1 - t / 8; art.ring(ctx, C.light, sx, sy - R * 0.6, Math.round(R * 0.6 + t * (big ? 4 : 3))); ctx.restore(); }
    });
    v._ugS = 1; z.shots.push(v);
    return v;
  }
  RC.puff = puff;
  const sheetOf = p => (p && p.sheet ? p.sheet() : null);

  // ================= dressing every clone =================
  function dress(p, z) {
    const sh = sheetOf(p);
    z.shots.forEach(s => {
      if (s.rook) return;
      if (s.isClone && s.p === p) {   // a clone that fights on its own
        s.rook = 1; puff(z, s.x, s.y, false);
        s.draw = function (ctx, cam) { const a = this.atkT > 0 ? ['a1', this.atkT > 6 ? 0 : 1] : this.moving ? ['run', (this.t / 3 | 0) % 8] : ['idle', (this.t / 26 | 0) % 2]; copy(ctx, this.sheet, a[0], a[1], this.x - cam.x, this.y - cam.y, this.face < 0, { a: Math.min(0.85, this.life / 20) }); };
        const _u = s.update; s.update = function (g, zz) { const r = _u.apply(this, arguments); if (this.gone && !this.popped) { this.popped = 1; puff(zz, this.x, this.y, false); } return r; };
        return;
      }
      if (s instanceof Proj && s.w === 26 && s.h === 34 && s.render && /art\.draw/.test(String(s.render))) {   // a clone running in (Twin Rush, Pile-On)
        s.rook = 1;
        s.render = (ctx, sx, sy, q) => { const d = q.vx < 0 ? -1 : 1; ctx.save(); ctx.globalAlpha = 0.5; for (let i = 0; i < 4; i++) art.line(ctx, i % 2 ? C.teal : C.light, sx - d * (10 + i * 2), sy - 6 + i * 5, sx - d * (24 + i * 4), sy - 6 + i * 5, 1); ctx.restore(); copy(ctx, sh, q.anim || 'dash', q.anim === 'run' ? (q.t / 2 | 0) % 8 : 0, sx, sy + 17, q.vx < 0); };
        const _end = s.onEnd; s.onEnd = function (g, zz) { puff(zz, this.x, this.y + 17, false); return _end ? _end.apply(this, arguments) : undefined; };
        puff(z, s.x, s.y + 17, false);
      }
    });
  }
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isR(g || this.G) && z && z.shots) dress(this, z); return r; };
  const _tr = CASTS.twin_rush; CASTS.twin_rush = function (p, z) { const r = _tr.apply(this, arguments); if (isR(G)) dress(p, z); return r; };

  // the afterimages of his kit (fx.ghost of his own sheet): teal copies that fade
  const _ghost = fx.ghost;
  fx.ghost = function (sheet, anim, frame, x, y, flip) {
    const g = G, p = g && g.player, z = g && g.zone;
    if (isR(g) && p && z && z.shots && sheet === sheetOf(p)) {
      const v = new Vis(x, y, 12, (ctx, sx, sy, t) => copy(ctx, sheet, anim, frame, sx, sy, flip, { a: 0.75 * (1 - t / 12) }));
      v._ugS = 1; z.shots.push(v);
      if (anim === 'a4') { const vv = new Vis(x, y, 12, () => {}, q => { if (q.t === 6) puff(z, q.x, q.y, false); }); z.shots.push(vv); }   // the finisher's clone pops after its strike
      return;
    }
    return _ghost.apply(this, arguments);
  };

  // ================= S+U: Swap Out: the clone left behind flashes and pops =================
  const _so = CASTS.swap_out;
  if (_so) CASTS.swap_out = function (p, z) {
    const n0 = z.shots.length, r = _so.apply(this, arguments);
    if (!isR(G)) return r;
    const sh = sheetOf(p), v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 22 && s.render), f0 = v ? (v.x < p.x ? 1 : -1) : 1;
    if (v) { v.render = (ctx, x, y, t) => { copy(ctx, sh, 'guard', 0, x, y, f0 < 0, { a: 0.85, edge: t > 16 && t % 2 === 0 ? C.w : C.light }); }; const _tk = v.tick; v.tick = function (q, g, zz) { const o = _tk ? _tk.apply(this, arguments) : undefined; if (q.t === 21) puff(zz, q.x, q.y, true); return o; }; }
    puff(z, p.x, p.y, false);
    dress(p, z);
    return r;
  };
  const _po = CASTS.pile_on;
  CASTS.pile_on = function (p, z) {
    const n0 = z.shots.length, r = _po.apply(this, arguments);
    if (!isR(G)) return r;
    z.shots.slice(n0).forEach(l => { if (typeof l.fn === 'function') { const fn = l.fn; l.fn = function () { const m = z.shots.length, o = fn.apply(this, arguments); dress(p, z); return o; }; } });
    return r;
  };

  // ================= S+I: Wheel Toss =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.rook;
  if (BU && BU.cast) {
    const _wt = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _wt.apply(this, arguments);
      if (!isR(G)) return r;
      const sh = sheetOf(p), v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 40 && s.render);
      if (v) {
        v.render = (ctx, x, y, t) => {
          const f = (t >> 2) % 2;
          copy(ctx, sh, f ? 'a2' : 'a1', 1, x - 18, y, false); copy(ctx, sh, f ? 'a1' : 'a2', 1, x + 18, y, true);
          ctx.save(); ctx.globalAlpha = 0.8; ctx.strokeStyle = C.light; ctx.lineWidth = 1; for (let i = 0; i < 2; i++) { const a0 = t * 0.5 + i * PI; ctx.beginPath(); ctx.ellipse(x, y - 24, 20, 8, 0, a0, a0 + 1.6); ctx.stroke(); } ctx.restore();   // motion arcs of the spin
        };
        puff(z, v.x - 20, v.y, false); puff(z, v.x + 20, v.y, false);
        const _tk = v.tick; v.tick = function (q, g, zz) { const o = _tk ? _tk.apply(this, arguments) : undefined; if (q.t === 39) { puff(zz, q.x - 18, q.y, false); puff(zz, q.x + 18, q.y, false); } return o; };
      }
      return r;
    };
  }

  // ================= W+O: Clone Barrage: a wall of smoke =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.rook;
  if (SIG && SIG.cast) {
    const _cb = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _cb.apply(this, arguments);
      if (!isR(G)) return r;
      for (let i = 0; i < 3; i++) puff(z, p.x - p.face * 4, p.y - i * 14 + 6, i === 1);
      return r;
    };
  }

  // ================= the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, sh = sheetOf(p), moving = Math.abs(p.vx || 0) > 0.5, anim = moving ? 'run' : 'idle', fi = moving ? (p.t / 3 | 0) % 8 : (p.t / 26 | 0) % 2;
    if (p.modeT > 0) { const fade = Math.min(1, p.modeT / 30); copy(ctx, sh, anim, fi, sx - d * 12, sy, d < 0, { a: 0.35 * fade }); copy(ctx, sh, anim, fi + 1, sx - d * 22, sy, d < 0, { a: 0.22 * fade }); }   // Second Self: two faint copies behind him
    if (p.awakeT > 0) { const fade = Math.min(1, p.awakeT / 30); for (const o of [-1, 1]) copy(ctx, sh, 'idle', (p.t / 26 | 0) % 2, sx + o * 16, sy, o > 0 ? d < 0 : d < 0, { a: 0.55 * fade, scale: 0.55 }); }   // Many Hands: two small copies flank him
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isR(g || this.G) && !this.dead && this.state !== 'ult', sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy);
    return _pd.apply(this, arguments);
  };

  // ================= W+I: A Thousand Rooks =================
  const _tc = N.ULT && N.ULT.thousand_crowd;
  if (_tc) N.ULT.thousand_crowd = function (p, z, foes) {
    const n0 = z.shots.length, r = _tc.apply(this, arguments);
    if (!isR(G)) return r;
    const sh = sheetOf(p), dir = p.face;
    z.shots.slice(n0).forEach(v => {   // the waves of clones running across: teal copies
      if (!(v instanceof Vis) || v.life !== 80 || !v.render) return;
      v._ugS = 1; const fi = rand(0, 8) | 0;
      v.render = (ctx, x, yy, t) => copy(ctx, sh, 'run', (t / 2 + fi | 0) % 8, x, yy, dir < 0, { a: 0.8 });
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): clones pile onto the target from both sides, then the whole pile goes up in one
  // great puff of smoke
  function finale(p, z, T) {
    const UGr = SW.ultGrand, pl = UGr && UGr.on && UGr.planOf ? UGr.planOf('rook') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const sh = sheetOf(p); let popped = false;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 16) return;
      if (st < FIN) {
        const k = (st - (BU2 - 2)) / (FIN - BU2 + 2), n = Math.min(8, Math.floor(k * 10));
        for (let i = 0; i < n; i++) {   // they leap onto the pile, one after another, from either side
          const side = i % 2 ? 1 : -1, row = Math.floor(i / 2), arrive = clamp01((k * 10 - i) / 1.5), x = sx + side * (8 + (row % 2) * 6) + side * (1 - arrive) * 60, y = sy - row * 9 - Math.sin(arrive * PI) * 14 * (1 - arrive);
          copy(ctx, sh, i % 3 ? 'a1' : 'a2', 1, x, y, side > 0, { a: 0.85 });
        }
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5;
        if (ik < 1) PX.impact(ctx, sx, sy - 24, ik, 23);
        if (k < 0.25) for (let i = 0; i < 8; i++) { const side = i % 2 ? 1 : -1, row = Math.floor(i / 2); copy(ctx, sh, 'a2', 1, sx + side * (8 + (row % 2) * 6), sy - row * 9, side > 0, { a: 0.85 * (1 - k * 4), edge: C.w }); }
      }
    };
    const v = new Vis(T.x, T.y, 500, null, vv => {
      if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true;
      if (!popped && p.state === 'ult' && p.st === FIN + 1) { popped = true; puff(z, vv.x, vv.y, true); puff(z, vv.x - 14, vv.y - 18, true); puff(z, vv.x + 14, vv.y - 10, true); }
    });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
