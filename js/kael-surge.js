'use strict';
// Shattered Worlds — Kael's kit, upgraded (2026-11-22, the user: "improve and upgrade all Kael skills"). Kael leads the
// film made from the game, so every one of his moves has to read at a glance and hit like it means it. js/kael-storm.js
// draws what each move IS (the storm-eye, the scrap nail, the junk totem, the ram, the thunderheads); this file adds the
// FEEL: a wind-up you can read, a release, and an impact for every hit, each sized to the move:
//   U      Spark Dart     muzzle flash at the hand, a spark trail; on a hit a small star-burst and ring, 4 frames of
//                        hit-stop. A taller hitbox (6 -> 10 px) so it no longer sails over a crouch-height target, and
//                        4 frames less recovery (cast 20 -> 16) so a dart links into the next J.
//   S+U    Thunder Totem  a bolt from the sky plants it; each zap ends in a ring on the floor under the target
//   I      Breaker Rush   7 frames of gathering (sparks drawn into his shoulder, the floor crackles), a burst as he goes,
//                        a jagged bolt left along his path; a hit throws a big star-burst, rings and 8 frames of hit-stop.
//                        Its hitbox reaches 6 px further and is 2 px taller.
//   S+I    Rising Storm   a blast ring on the floor as he leaves it, a ring and an upward fork on every hit, a thunder
//                        ring where the column ends
//   W+O    Ball Lightning each zap that lands bursts in sparks on the target
//   S+O    Overcharge     a bolt from the sky strikes him as it switches on; while it lasts his J hits crackle
//   O      Tempest Form   three bolts strike him at once, a double ring, a flash; his J hits crackle
//   W+I    Skyfall        every bolt that lands rings the floor and throws sparks up
//   W+U    Storm Pierce   the new move: js/kael-pierce.js
// No damage number changes. SW.kaelSurge.on = false turns it all off. Loaded after js/kael-storm.js (and everything
// else that wraps the skills), before js/kael-pierce.js.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, PX = SW.pix, AP = SW.apex, V = SW.versus;
  const P = SW.Player && SW.Player.prototype, Totem = SW.Totem, I = SW.input;
  if (!P || !art || !fx) return;
  const KS = SW.kaelStorm || {};
  const KG = SW.kaelSurge = { on: true, STOP: { dart: 4, totem: 3, rush: 8, rise: 4, ball: 3, ult: 5, melee: 1 }, DART_REC: 16, kinds: {} };
  const PI = Math.PI, R = Math.round, rand = SW.rand;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const isK = g => !!(KG.on && g && g.state && g.state.hero === 'kael');
  const C = { b: '#b85c0a', a: '#ffa726', y: '#ffd24a', p: '#fff3c4', w: '#ffffff', cy: '#7fe9ff' };
  const part = (x, y, col, vx, vy, life, s, g) => fx.list.push({ k: 'p', x, y, vx: vx || 0, vy: vy || 0, g: g || 0, life: life || 14, max: life || 14, col, s: s || 2 });
  const layer = o => { if (AP && AP.fx) AP.fx(o); };   // a drawn effect that keeps moving through the hit-stop
  const bolt = (ctx, x0, y0, x1, y1, seed, w, a) => {
    if (KS.bolt) return KS.bolt(ctx, x0, y0, x1, y1, seed, w, a);
    ctx.save(); ctx.globalAlpha *= clamp01(a === undefined ? 1 : a); art.line(ctx, C.a, R(x0), R(y0), R(x1), R(y1), w + 1); art.line(ctx, C.w, R(x0), R(y0), R(x1), R(y1), 1); ctx.restore();
  };

  // ---------- pieces ----------
  // a star-burst: n hard rays out of (x, y) that shoot out and thin away; size in px
  function star(x, y, size, n, life, seed, cols) {
    cols = cols || [C.w, C.y, C.a];
    layer({ x, y, life, draw(ctx, q, sx, sy, t) {
      const out = ease(t * 2.2), thin = 1 - t;
      for (let i = 0; i < n; i++) {
        const a = i / n * PI * 2 + rnd(seed, i) * 0.5, L = size * (0.5 + rnd(seed, i + 30) * 0.7) * out, L0 = L * t * 0.8, w = Math.max(1, R((i % 3 ? 1 : 2) * thin + 0.4));
        art.line(ctx, cols[i % cols.length], R(sx + Math.cos(a) * L0), R(sy + Math.sin(a) * L0), R(sx + Math.cos(a) * L), R(sy + Math.sin(a) * L), w);
      }
      if (t < 0.3) { ctx.save(); ctx.globalAlpha = 1 - t / 0.3; art.disc(ctx, C.w, sx, sy, Math.max(1, R(size * 0.16))); art.glow(ctx, sx, sy, size * 0.6, C.p, 0.35); ctx.restore(); }
    } });
  }
  // a flattened ring on the floor
  function floorRing(x, y, r, life, col) {
    layer({ x, y, life, back: true, draw(ctx, q, sx, sy, t) { ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = col || C.y; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx, sy, Math.max(1, r * ease(t * 1.6)), Math.max(1, r * 0.22 * ease(t * 1.6)), 0, 0, PI * 2); ctx.stroke(); ctx.restore(); } });
  }
  // a heavy bolt from the top of the screen down onto (x, y)
  function skyStrike(x, y, life, w, seed) {
    layer({ x, y, life, draw(ctx, q, sx, sy, t) { const a = 1 - ease((t - 0.3) / 0.7); bolt(ctx, sx + (rnd(seed, 1) - 0.5) * 30, -8, sx, sy, seed + (R(t * life) >> 1), w, a); if (t < 0.25) { ctx.save(); ctx.globalAlpha = 1 - t * 4; art.glow(ctx, sx, sy, 26, C.p, 0.5); ctx.restore(); } } });
  }
  KG.star = star; KG.floorRing = floorRing; KG.skyStrike = skyStrike;
  const stop = n => { if (n > 0) G.hitstop = Math.max(G.hitstop || 0, n); };

  // ---------- which move a hit came from ----------
  let CUR = null;   // set while a tagged shot (or the totem) runs its update
  function tag(s, kind) {
    if (!s || s._kk) return; s._kk = kind;
    const u = s.update; if (typeof u !== 'function') return;
    s.update = function () { const k0 = CUR; CUR = kind; try { return u.apply(this, arguments); } finally { CUR = k0; } };
  }
  if (Totem && Totem.prototype.update) {
    const _tu = Totem.prototype.update;
    Totem.prototype.update = function () { const k0 = CUR; CUR = 'totem'; try { return _tu.apply(this, arguments); } finally { CUR = k0; } };
  }
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.kael, SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.kael;
  [[BU, 'rise'], [SIG, 'ball']].forEach(([o, kind]) => {
    if (!o || !o.cast) return;
    const _c = o.cast;
    o.cast = function (p, z) {
      const n0 = z && z.shots ? z.shots.length : 0, r = _c.apply(this, arguments);
      if (isK(G) && z && z.shots) {
        z.shots.slice(n0).forEach(s => tag(s, kind));
        if (kind === 'rise') riseStart(p);
      }
      return r;
    };
  });
  function kindNow(p) {
    if (CUR) return CUR;
    if (!p) return null;
    if (p.state === 'rush') return 'rush';
    if (p.state === 'ult') return 'ult';
    if (p.state === 'attack' || p.state === 'airatk') return 'melee';
    return null;
  }

  // ---------- every hit Kael lands ----------
  const _oh = G.onHit;
  G.onHit = function (atk, e, b) {
    const r = _oh.apply(this, arguments);
    try { if (isK(G) && !atk.kaelPierce && b) impact(kindNow(G.player), atk, b, G.player); } catch (err) { console.error(err); }
    return r;
  };
  function impact(kind, atk, b, p) {
    if (!kind) return;
    KG.kinds[kind] = (KG.kinds[kind] || 0) + 1;
    const cx = SW.clamp(atk.x + atk.w / 2, b.x, b.x + b.w), cy = SW.clamp(atk.y + atk.h / 2, b.y, b.y + b.h), f = p ? p.face : 1, seed = (SW.frame || 0) % 997;
    const footY = b.y + b.h;
    if (kind === 'dart') {
      star(cx, cy, 18, 7, 9, seed); fx.ring(cx, cy, C.w, 2, 14, 8); fx.spark(cx, cy, C.y, 6, 2.6); stop(KG.STOP.dart);
    } else if (kind === 'totem') {
      fx.ring(cx, cy, C.y, 2, 12, 8); floorRing(cx, footY, 20, 14, C.a); fx.spark(cx, cy, C.p, 4, 2); stop(KG.STOP.totem);
    } else if (kind === 'rush') {
      star(cx, cy, 42, 12, 13, seed); fx.ring(cx, cy, C.w, 4, 34, 12); fx.ring(cx, cy, C.a, 6, 46, 16); floorRing(cx, footY, 40, 16);
      for (let i = 0; i < 14; i++) part(cx, cy + rand(-8, 8), i % 3 ? C.y : C.w, f * rand(1.5, 5.5), rand(-3, 1), 16 + (i % 6), i % 4 ? 1 : 2, 0.12);
      fx.shake(5, 10); stop(KG.STOP.rush);
    } else if (kind === 'rise') {
      fx.ring(cx, cy, C.w, 3, 18, 9); star(cx, cy, 22, 6, 8, seed, [C.w, C.y]); fx.bolt(cx, cy + 8, cx + rand(-6, 6), cy - 34, C.y); stop(KG.STOP.rise);
    } else if (kind === 'ball') {
      fx.spark(cx, cy, C.y, 5, 2.2); fx.ring(cx, cy, C.p, 2, 10, 7); stop(KG.STOP.ball);
    } else if (kind === 'ult') {
      floorRing(cx, footY, 34, 18, C.y); star(cx, cy, 30, 9, 10, seed);
      for (let i = 0; i < 10; i++) part(cx + rand(-10, 10), footY - 2, i % 2 ? C.y : C.w, rand(-1.5, 1.5), -rand(2, 5), 18, 1, 0.14);
      stop(KG.STOP.ult);
    } else if (kind === 'melee' && p && (p.modeT > 0 || p.awakeT > 0)) {   // Overcharge / Tempest: his fists crackle
      fx.bolt(cx, cy, cx + f * rand(12, 22), cy + rand(-14, 6), C.y); fx.ring(cx, cy, C.a, 2, 12, 7); stop(KG.STOP.melee + (G.hitstop || 0));
    }
  }

  // ---------- Rising Storm: off the floor, and the top ----------
  function riseStart(p) {
    const x = p.x, y = p.y;
    floorRing(x, y, 40, 16, C.y); fx.ring(x, y - 6, C.w, 4, 26, 10); fx.dust(x, y, 8); fx.shake(3, 8);
    for (let i = 0; i < 8; i++) part(x + rand(-12, 12), y - 2, i % 2 ? C.y : C.w, rand(-1.4, 1.4), -rand(2, 6), 16, 1, 0.1);
    p._ksRise = 16;
  }

  // ---------- the fighter's own frame: dart tags, the rush, the totem's arrival, the power-ups ----------
  const _us = P.useSkill;
  P.useSkill = function (alt) {
    const g = this.G, e0 = g && g.state ? g.state.energy : 0, st0 = this.state, fn0 = this.castFn;
    const r = _us.apply(this, arguments);
    if (isK(g) && !alt && this.state === 'cast' && this.castFn && (this.castFn !== fn0 || st0 !== 'cast') && g.state.energy <= e0) {
      this._ksDart = true;   // a dart is on its way out of this cast
      const f = this.face, hx = this.x + f * 12, hy = this.y - 21;
      fx.ring(hx, hy, C.y, 2, 10, 6);
    }
    return r;
  };
  ['useSpecial', 'useAwaken'].forEach(k => { const o = P[k]; P[k] = function () { this._ksDart = false; return o.apply(this, arguments); }; });

  const _pu = P.update;
  P.update = function (g, z) {
    if (!isK(g || this.G)) return _pu.apply(this, arguments);
    z = z || (g || this.G).zone;
    const ns = z && z.shots ? z.shots.length : 0, ne = z && z.ents ? z.ents.length : 0, m0 = this.modeT || 0, a0 = this.awakeT || 0;
    const r = _pu.apply(this, arguments);
    const f = this.face;
    // new darts: tag them, a taller hitbox, a muzzle flash
    if (z && z.shots) for (let i = ns; i < z.shots.length; i++) {
      const s = z.shots[i];
      if (s && s.kind === 'dart' && s.team === 'player' && !s._kk) { tag(s, 'dart'); s.h = Math.max(s.h || 6, 10); s.w = Math.max(s.w || 12, 14); fx.ring(s.x, s.y, C.w, 2, 12, 7); star(s.x, s.y, 12, 5, 6, i); }
    }
    if (z && z.shots && (SW.frame || 0) % 2 === 0) z.shots.forEach(s => { if (s && s._kk === 'dart' && !s.gone) part(s.x - Math.sign(s.vx || 1) * 6, s.y + rand(-2, 2), Math.random() < 0.5 ? C.y : C.w, -s.vx * 0.15, rand(-0.5, 0.5), 8, 1); });
    // a totem planted: a bolt from the sky drives it in
    if (z && z.ents) for (let i = ne; i < z.ents.length; i++) { const e = z.ents[i]; if (Totem && e instanceof Totem && !e._ks) { e._ks = 1; skyStrike(e.x, e.y - 20, 12, 3, i * 7 + 3); floorRing(e.x, e.y, 26, 14); fx.shake(2, 6); } }
    // the dart's cast ends a little sooner (smoother links into the next J)
    if (this.state !== 'cast') this._ksDart = false;
    else if (this._ksDart && !this._kPierce && !this.castFn && !this.pose && this.st >= KG.DART_REC) { this._ksDart = false; this.enter(this.onGround ? 'idle' : 'fall'); }
    // Breaker Rush: gather (st 0-6), go (st 7), the path it leaves
    if (this.state === 'rush') {
      const st = this.st, sx = this.x + f * 10, sy = this.y - 22;
      if (st < 7) {
        for (let i = 0; i < 2; i++) { const a = Math.random() * PI * 2, d = 16 + Math.random() * 14; part(sx + Math.cos(a) * d, sy + Math.sin(a) * d, i ? C.y : C.w, -Math.cos(a) * d / 6, -Math.sin(a) * d / 6, 6, 1); }
        if (st === 1) { fx.ring(sx, sy, C.a, 18, 4, 7); this._ksPath = null; }
        if (st % 3 === 0 && this.onGround) fx.bolt(this.x + rand(-10, 10), this.y, this.x - f * rand(8, 20), this.y - rand(2, 8), C.y);
      } else if (st === 7) {
        this._ksPath = { x0: this.x - f * 6, y: this.y - 22, t: 0 };
        fx.ring(this.x - f * 6, this.y - 20, C.w, 4, 24, 10); floorRing(this.x - f * 4, this.y, 30, 12); fx.dust(this.x, this.y, 6, -f * 1.6);
      }
    }
    if (this._ksPath) { const q = this._ksPath; q.t++; if (this.state === 'rush' && this.st < 21) q.x1 = this.x - f * 4; if (q.t > 34) this._ksPath = null; }
    if (this._ksRise > 0 && --this._ksRise === 0 && !this.dead) { fx.ring(this.x, this.y - 30, C.w, 6, 34, 12); star(this.x, this.y - 30, 30, 8, 10, 5); }
    // the power-ups switching on
    if (m0 <= 0 && this.modeT > 0) { skyStrike(this.x, this.y - 2, 12, 4, 11); fx.ring(this.x, this.y - 16, C.y, 4, 40, 16); floorRing(this.x, this.y, 36, 16); fx.flash(C.p, 3); fx.shake(3, 8); }
    if (a0 <= 0 && this.awakeT > 0) {
      for (let i = 0; i < 3; i++) skyStrike(this.x + (i - 1) * 10, this.y - 4, 16, i === 1 ? 5 : 2, 31 + i * 9);
      fx.ring(this.x, this.y - 18, C.w, 6, 60, 20); fx.ring(this.x, this.y - 18, C.a, 8, 80, 26); floorRing(this.x, this.y, 60, 22); fx.flash(C.w, 5); fx.shake(6, 14);
      for (let i = 0; i < 20; i++) part(this.x + rand(-20, 20), this.y - rand(0, 40), i % 2 ? C.y : C.w, rand(-3, 3), -rand(1, 4), 22, i % 3 ? 1 : 2, 0.1);
    }
    return r;
  };
  // the rush's path: a jagged bolt along it, fading (drawn behind him)
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const q = this._ksPath;
    if (q && q.x1 !== undefined && isK(g || this.G)) { const a = clamp01(1 - (q.t - 14) / 20); bolt(ctx, R(q.x0 - cam.x), R(q.y - cam.y), R(q.x1 - cam.x), R(q.y - cam.y), q.t * 3, 3, a); bolt(ctx, R(q.x0 - cam.x), R(q.y - cam.y + 8), R(q.x1 - cam.x), R(q.y - cam.y + 6), q.t * 3 + 9, 1, a * 0.7); }
    return _pd.apply(this, arguments);
  };
  // Breaker Rush reaches a little further
  const _ph = P.hit;
  P.hit = function (def) {
    if (def && this.state === 'rush' && def.breaker && isK(this.G) && def.box && def.box[2] === 34) def = Object.assign({}, def, { box: [def.box[0], def.box[1] - 2, def.box[2] + 6, def.box[3] + 2] });
    return _ph.call(this, def);
  };
})();
