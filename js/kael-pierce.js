'use strict';
// Shattered Worlds — Kael's Storm Pierce (雷穿), 2026-11-22 (the user: "improve and upgrade all Kael skills, add a
// Chidori-like move for him"). An original move of Kael's own, not a copy of anyone's: the storm-eye boy from the
// Crusher Yard pulls the storm down into one fist. A ball of amber lightning gathers in his hand (it crackles and whines
// as it grows, his forearm glows, the slit of the storm-eye opens in its white core), he dashes in a straight line that
// leaves a jagged bolt behind him, and drives the fist through the target: a lance of light comes out the far side, the
// screen drops to an impact frame and the target is thrown away, knocked down.
//   Input   W + U (up + skill). It takes the place of the old up-angled Spark Dart; U alone is still the dart.
//   Cost    50 energy (25 when it is cancelled out of a landed hit, as U is: js/combo-fluency.js), its own 5 s cooldown
//           (slot "wu", shown on the HUD beside W+O). It goes through the usual U path first, so seals, combo links,
//           cancels, the lasting-guard rule and the cast flourish all treat it as a skill.
//   Timing  16 frames gathering (open to a hit: it can be seen coming), a dash of up to 14 frames at 10.4 px a frame
//           (it reaches about 180 px), one heavy hit (34 x the hero's skill multiplier, knockdown, 11 frames of hit-stop),
//           then 14 frames of recovery on a hit and 22 on a whiff or a block (punishable). Works in the air (he hangs
//           while it gathers).
//   Bots    a Versus bot turns a U (and now and then a neutral I) into it: at dash range (36-184 px, level, facing) when
//           it is ready, and on Easy to Hard as a combo ender. Nightmare bots only for a lone poke, never inside a
//           trained route or a nightmare-kit "use every skill" throw.
//   Tested  (tools/kael-test.js, 10 opponents x both sides x 3 matches) Kael's round win rate with / without it:
//           Easy 14% / 9%, Hard 18% / 13%, Nightmare 39% / 38% (within noise); about one use a round, half of them land
//           (Nightmare: one in six, it gets blocked).
// Loaded after js/kael-storm.js and everything that wraps the skills. SW.kaelPierce.on = false turns it off (W + U is
// the up-angled dart again).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, I = SW.input, V = SW.versus, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, A = D && D.abilities, HR = D && D.heroes;
  if (!P || !A || !HR || !HR.kael || !art || !fx) return;
  const KS = SW.kaelStorm || {}, AP = SW.apex;
  const SP = SW.kaelPierce = { on: true, COST: 50, CD: 300, DMG: 34, GATHER: 16, DASH: 14, SPEED: 10.4, REC_HIT: 14, REC_MISS: 22, BOT: [0.3, 0.4, 0.5, 0.45], BOT_I: 0.35, uses: 0, hits: 0 };
  const PI = Math.PI, R = Math.round, GRAV = SW.GRAV || 0.42, rand = SW.rand;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const isK = g => !!(SP.on && g && g.state && g.state.hero === 'kael');
  const fighterOf = p => (G.scene === 'vs' && V && V.f ? V.f.find(f => f && f.p === p) : null);
  // a Versus bot: the ordinary one (f.bot), or a Nightmare one (js/hardcore.js clears f.bot while it plays its own presses
  // and keeps its route in f.hc.r): only a lone poke of one move ("U" or "I"), never a combo route under way, and never a
  // move js/nightmare-kit.js is throwing so that every skill gets used in the round ("KIT ...")
  const hcFree = h => !h.r || (typeof h.r === 'string' && h.r.length === 1 && !/^KIT/.test(h.why || ''));
  const isBot = p => { const f = fighterOf(p); return !!(f && V.mode !== 'train' && (f.bot || (f.hc && hcFree(f.hc)))); };
  const lvOf = f => (f.lv !== undefined ? f.lv : V.diff || 0);
  const part = (x, y, col, vx, vy, life, s, g) => fx.list.push({ k: 'p', x, y, vx: vx || 0, vy: vy || 0, g: g || 0, life: life || 14, max: life || 14, col, s: s || 2 });
  const C = { k: '#160a04', b: '#b85c0a', a: '#ffa726', y: '#ffd24a', p: '#fff3c4', w: '#ffffff', cy: '#7fe9ff', red: '#c1121f' };

  // ---------- the move's data: the move list (versus.js moveRows) and the hero screen read the kit ----------
  A.storm_pierce = { name: 'Storm Pierce', input: 'W + U', cost: SP.COST, dmg: SP.DMG, desc: 'Gather the storm in one fist, dash in a straight line and drive it through the target. Knocks them flying.' };
  if (HR.kael.kit.indexOf('storm_pierce') < 0) HR.kael.kit.push('storm_pierce');
  const _has = G.has; G.has = id => (id === 'storm_pierce' && G.state && G.state.hero === 'kael' ? _has('spark_dart') : _has(id));   // known with the dart (old saves, the story)
  if (SW.i18n && SW.i18n.add) {
    SW.i18n.add('es', { 'Storm Pierce': 'Estocada de Tormenta', 'Gather the storm in one fist, dash in a straight line and drive it through the target. Knocks them flying.': 'Reúne la tormenta en un puño, avanza en línea recta y atraviesa al objetivo. Lo lanza por los aires.' });
    SW.i18n.add('zh', { 'Storm Pierce': '雷穿', 'Gather the storm in one fist, dash in a straight line and drive it through the target. Knocks them flying.': '将风暴聚于一拳，直线突进，贯穿目标，将其击飞。' });
  }

  // ---------- sound: a whine that climbs with crackle in it, and a split-air thunder crack (synthesised, no voice) ----------
  const au = () => { const a = SW.audio; return a && a.ctx && a.sfxG && a.noiseBuf ? a : null; };
  function tone(type, f0, f1, dur, vol, delay) {
    const a = au(); if (!a) return; const c = a.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.sfxG); o.start(t); o.stop(t + dur + 0.02);
  }
  function hiss(dur, vol, f0, f1, type, delay) {
    const a = au(); if (!a) return; const c = a.ctx, t = c.currentTime + (delay || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = a.noiseBuf; s.loop = true; f.type = type || 'bandpass'; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(a.sfxG); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }
  const SND = {
    gather(k) { try { tone('sawtooth', 160 + k * 420, 190 + k * 480, 0.07, 0.05 + k * 0.04); hiss(0.05, 0.08 + k * 0.08, 3000 + k * 3000, 0, 'highpass'); if (Math.random() < 0.5) tone('square', 1800 + Math.random() * 1400, 900, 0.025, 0.04); } catch (e) { /* best effort */ } },
    dash() { try { hiss(0.22, 0.32, 600, 5200, 'bandpass'); tone('sawtooth', 300, 1400, 0.18, 0.1); } catch (e) { /* best effort */ } },
    pierce() { try { tone('sine', 170, 30, 0.5, 0.55); hiss(0.6, 0.6, 1600, 70, 'lowpass'); tone('square', 2600, 500, 0.09, 0.14); hiss(0.12, 0.3, 6000, 0, 'highpass'); tone('sawtooth', 90, 40, 0.35, 0.2, 0.05); } catch (e) { /* best effort */ } },
    fizzle() { try { hiss(0.18, 0.2, 4000, 800, 'bandpass'); tone('square', 900, 200, 0.12, 0.06); } catch (e) { /* best effort */ } }
  };
  SP.sound = SND;

  // ---------- drawing pieces ----------
  // a jagged bolt (KS.bolt from js/kael-storm.js when it is there)
  function bolt(ctx, x0, y0, x1, y1, seed, w, a) {
    if (KS.bolt) return KS.bolt(ctx, x0, y0, x1, y1, seed, w, a);
    ctx.save(); ctx.globalAlpha *= clamp01(a === undefined ? 1 : a);
    const n = Math.max(3, R(Math.hypot(x1 - x0, y1 - y0) / 14)); let px = x0, py = y0;
    for (let i = 1; i <= n; i++) { const u = i / n, qx = i === n ? x1 : x0 + (x1 - x0) * u + (rnd(seed, i) - 0.5) * 16, qy = i === n ? y1 : y0 + (y1 - y0) * u + (rnd(seed, i + 9) - 0.5) * 16; art.line(ctx, C.a, R(px), R(py), R(qx), R(qy), w + 1); art.line(ctx, C.w, R(px), R(py), R(qx), R(qy), Math.max(1, w - 1)); px = qx; py = qy; }
    ctx.restore();
  }
  // short 1-px crackles leaping off a point
  function crackle(ctx, x, y, r, t, n, col) {
    for (let i = 0; i < n; i++) {
      const sd = (t >> 1) * 7 + i * 13; let px = x, py = y; const ang = rnd(sd, 1) * PI * 2, steps = 3 + (rnd(sd, 2) * 3 | 0);
      for (let k = 0; k < steps; k++) { const L = r / steps * (0.8 + rnd(sd, k + 3) * 0.6), a2 = ang + (rnd(sd, k + 20) - 0.5) * 1.6, qx = px + Math.cos(a2) * L, qy = py + Math.sin(a2) * L; art.line(ctx, k === 0 ? C.w : (col || (k % 2 ? C.y : C.cy)), R(px), R(py), R(qx), R(qy), 1); px = qx; py = qy; }
    }
  }
  // the ball of lightning in his fist: k 0 -> 1 how charged, t a clock
  function ball(ctx, x, y, k, t, face) {
    const r = 2 + k * 3.6 + Math.sin(t * 1.7) * 0.6;
    art.glow(ctx, x, y, r * 2.6, C.a, 0.1 + 0.08 * k);
    art.glow(ctx, x, y, r * 1.5, C.p, 0.14);
    crackle(ctx, x, y, r * (2.4 + k * 1.6), t, 2 + R(k * 4));
    art.disc(ctx, C.b, x, y, R(r + 1)); art.disc(ctx, C.a, x, y, R(r)); art.disc(ctx, C.y, x, y, R(r * 0.72)); art.disc(ctx, C.w, x, y, Math.max(1, R(r * 0.48)));
    if (k > 0.55) {   // the storm-eye opens in the core: a dark slit, a white glint
      const h = Math.max(2, R(r * 0.8 * ease((k - 0.55) / 0.3)));
      art.rect(ctx, C.b, R(x) - (face > 0 ? 0 : 1), R(y) - h, 1, h * 2); art.rect(ctx, C.w, R(x) + (face > 0 ? -2 : 2), R(y) - Math.max(1, h - 1), 1, 1);
    }
    for (let i = 0; i < 4; i++) { const a = t * 0.35 + i * PI / 2, rr = r + 3 + (i % 2) * 2; art.rect(ctx, i % 2 ? C.cy : C.w, R(x + Math.cos(a) * rr), R(y + Math.sin(a) * rr * 0.7), 1, 1); }   // a spark orbiting it
  }
  // his forearm lit up: from the elbow to the fist
  function arm(ctx, ex, ey, hx, hy, k, t) {
    ctx.save(); ctx.globalAlpha *= 0.55 + 0.45 * k;
    art.line(ctx, C.a, R(ex), R(ey), R(hx), R(hy), 3); art.line(ctx, C.w, R(ex), R(ey), R(hx), R(hy), 1);
    ctx.restore();
    crackle(ctx, (ex + hx) / 2, (ey + hy) / 2, 6 + k * 6, t + 3, 1 + R(k * 2));
  }

  // ---------- the move ----------
  class Pierce {
    constructor(p, dmg) { Object.assign(this, { p, dmg, t: 0, hs: new Set(), trail: [], hit: 0, blocked: false, end: 0, x0: p.x, y0: p.y }); }
    hand() { const p = this.p, f = p.face; return this.t <= SP.GATHER ? [p.x + f * 9, p.y - 25] : [p.x + f * 19, p.y - 27]; }
    update(g, z) {
      const p = this.p;
      if (p.dead || p.state !== 'cast' || p._kPierce && p._kPierce !== this && this.t > 0) { this.stop(); return; }
      this.t++; const T = this.t, f = p.face;
      p.state = 'cast'; p.st = 8; p.castFn = null; p._kPierce = this;
      if (T <= SP.GATHER) {                                    // gather
        const k = T / SP.GATHER;
        p.vx *= 0.6; if (!p.onGround) p.vy = Math.min(p.vy, 0) * 0.5 - GRAV * 0.92;   // hangs in the air while it gathers
        p.pose = ['cast', 0];
        if (T % 3 === 1) SND.gather(k);
        const [hx, hy] = this.hand();
        for (let i = 0; i < 2; i++) { const a = Math.random() * PI * 2, d = 18 + Math.random() * 16; part(hx + Math.cos(a) * d, hy + Math.sin(a) * d, i ? C.y : C.w, -Math.cos(a) * d / 7, -Math.sin(a) * d / 7, 7, 1); }   // sparks drawn into the fist
        if (T % 4 === 0 && p.onGround) fx.bolt(hx, hy, hx + rand(-14, 14) - f * 6, p.y, C.y);   // it earths itself in the floor
        if (T === SP.GATHER) { SND.dash(); fx.ring(hx, hy, C.w, 3, 18, 8); fx.dust(p.x, p.y, 6, -f * 1.4); fx.shake(2, 5); }
        return;
      }
      if (!this.end) {                                         // the dash
        const d = T - SP.GATHER;
        p.vx = f * SP.SPEED; p.vy = -GRAV; p.pose = ['special', 1];
        if (d % 2 === 1) fx.ghost(p.sheet(), 'special', 1, p.x, p.y, f < 0);
        this.trail.push([p.x + f * 19, p.y - 27]); if (this.trail.length > 18) this.trail.shift();
        if (p.onGround && d % 3 === 0) part(p.x - f * 6, p.y - 1, C.y, -f * rand(1, 3), -rand(0.5, 2), 12, 1, 0.15);
        const atk = { team: 'player', x: f > 0 ? p.x - 2 : p.x - 38, y: p.y - 38, w: 40, h: 32, dmg: this.dmg, kx: f * 6.6, ky: -3.8, stun: 40, heavy: true, down: true, energy: true, breaker: true, hitSet: this.hs, srcX: p.x - f * 8, quiet: true, kaelPierce: true };
        const n0 = this.hs.size, n = SW.strike(g, atk);
        if (n > 0) { this.strike(g, z, atk); return; }
        if (this.hs.size > n0) { this.blocked = true; this.end = T; p.vx = -f * 2.4; fx.ring(p.x + f * 20, p.y - 26, C.p, 4, 22, 10); fx.spark(p.x + f * 20, p.y - 26, C.y, 8, 2.6); SND.fizzle(); return; }
        if (p.hitWall || d >= SP.DASH) { this.end = T; this.fizzle(); }
        return;
      }
      // recovery
      p.vx *= this.hit ? 0.72 : 0.8; if (!this.hit && !p.onGround) p.vy = Math.max(p.vy, 0);
      p.pose = this.hit && T - this.end < 6 ? ['special', 1] : ['special', 2];
      if (T - this.end >= (this.hit ? SP.REC_HIT : SP.REC_MISS)) this.stop(true);
    }
    strike(g, z, atk) {
      const p = this.p, f = p.face, T = this.t, [hx, hy] = this.hand();
      this.hit = T; this.end = T; SP.hits++;
      p.vx = f * 2.2;   // carried a step through
      g.hitstop = Math.max(g.hitstop || 0, 11);
      fx.shake(7, 14); SND.pierce();
      fx.ring(hx, hy, C.w, 4, 30, 12); fx.ring(hx + f * 30, hy, C.a, 6, 46, 18);
      for (let i = 0; i < 26; i++) part(hx + f * rand(0, 30), hy + rand(-6, 6), i % 3 ? C.y : C.w, f * rand(2, 7.5), rand(-2.2, 1.4), 18 + (i % 8), i % 4 ? 1 : 2, 0.08);   // sprayed out the far side
      for (let i = 0; i < 3; i++) fx.bolt(hx + f * 20, hy, hx + f * rand(50, 90), hy + rand(-26, 26), C.y);
      burst(hx, hy, f, T);
    }
    fizzle() { const [hx, hy] = this.hand(); fx.ring(hx, hy, C.y, 2, 16, 8); fx.spark(hx, hy, C.a, 6, 2); SND.fizzle(); }
    stop(done) {
      const p = this.p; this.gone = true; if (p._kPierce === this) p._kPierce = null; p.pose = null;
      if (done && !p.dead && p.state === 'cast') p.enter(p.onGround ? 'idle' : 'fall');
    }
    draw(ctx, cam) {   // the trail behind him (drawn in the shot layer, behind the fighters)
      const p = this.p, n = this.trail.length; if (n < 2) return;
      const fade = this.end ? clamp01(1 - (this.t - this.end) / 12) : 1; if (fade <= 0) return;
      const a = this.trail[0], b = this.trail[n - 1];
      bolt(ctx, R(a[0] - cam.x), R(a[1] - cam.y), R(b[0] - cam.x), R(b[1] - cam.y), this.t * 5, 3, fade);
      bolt(ctx, R(a[0] - cam.x), R(a[1] - cam.y + 5), R(b[0] - cam.x), R(b[1] - cam.y + 3), this.t * 5 + 17, 1, fade * 0.7);
      if (!this.end && PX && PX.lines) PX.lines(ctx, R(p.x - cam.x - p.face * 26), R(p.y - cam.y - 20), p.face > 0 ? 0 : PI, 60, 8, this.t, C.y, 40);
    }
  }
  // the lance of light through the target and out the far side; an impact frame for its first frames (animates during
  // the hit-stop: it lives in fx.list)
  function burst(x, y, f, seed) {
    const draw = (ctx, q, sx, sy, t) => {
      if (PX && PX.impact && t < 0.22) PX.impact(ctx, sx, sy, 0.4 + t / 0.22 * 0.6, 77 + seed);
      const out = ease(t / 0.25), back = ease((t - 0.45) / 0.55), L = 150 * out, L0 = 150 * back, th = 9 * (1 - back);
      if (L > L0 + 1 && th > 0.5) {   // the lance: a tapered blade of light, white core
        const x0 = sx - f * 14 + f * L0, x1 = sx + f * L;
        ctx.save();
        ctx.fillStyle = C.a; ctx.beginPath(); ctx.moveTo(x0, sy - th * 0.7); ctx.lineTo(x1 - f * 10, sy - th * 0.35); ctx.lineTo(x1, sy); ctx.lineTo(x1 - f * 10, sy + th * 0.35); ctx.lineTo(x0, sy + th * 0.7); ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.w; ctx.beginPath(); ctx.moveTo(x0, sy - th * 0.3); ctx.lineTo(x1 - f * 6, sy - 1); ctx.lineTo(x1 - f * 2, sy); ctx.lineTo(x1 - f * 6, sy + 1); ctx.lineTo(x0, sy + th * 0.3); ctx.closePath(); ctx.fill();
        ctx.restore();
        for (let i = 0; i < 3; i++) bolt(ctx, R(x0), sy, R(x1 - f * 8), R(sy + (i - 1) * 7 * (1 - back)), seed * 3 + i * 11 + (R(t * 30) >> 1), 1, 1 - back);
      }
      // the hole it punches: two flattened rings opening along the line, on the far side
      for (let i = 0; i < 2; i++) { const k = clamp01(t * 2.2 - i * 0.25); if (k <= 0 || k >= 1) continue; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = i ? C.a : C.w; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx + f * (18 + 50 * k + i * 16), sy, 3 + 4 * k, 8 + 22 * k, 0, 0, PI * 2); ctx.stroke(); ctx.restore(); }
      if (t < 0.5) { ctx.save(); ctx.globalAlpha = 1 - t * 2; art.glow(ctx, sx, sy, 30, C.p, 0.5); ctx.restore(); crackle(ctx, sx, sy, 26, R(t * 60), 5); }
    };
    if (AP && AP.fx) AP.fx({ x, y, life: 30, draw });
    else fx.list.push({ k: 'kp', x, y, life: 0 });   // (no apex layer: the rings and sparks still show)
  }
  SP.burst = burst;

  // the fist: ball, glowing arm (drawn after his sprite, so it sits in front of him)
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (this._kPierce && (this._kPierce.gone || this.state !== 'cast')) this._kPierce = null;   // a move cut off from outside (round reset, a throw)
    const m = this._kPierce;
    if (m && !this.dead) {
      const T = m.t, f = this.face, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
      if (T <= SP.GATHER) {
        const k = T / SP.GATHER, hx = sx + f * 9, hy = sy - 25;
        arm(ctx, sx + f * 1, sy - 31, hx, hy, k, T);
        ball(ctx, hx, hy, 0.25 + 0.75 * k, T, f);
        if (k > 0.5) { ctx.save(); ctx.globalAlpha = (k - 0.5) * 0.8; art.line(ctx, C.y, sx - 6, sy, sx + 6, sy, 1); ctx.restore(); }   // the floor lit under him
      } else if (!m.end || (m.hit && T - m.end < 6)) {
        const hx = sx + f * 19, hy = sy - 27;
        arm(ctx, sx + f * 4, sy - 29, hx, hy, 1, T);
        ball(ctx, hx + f * 3, hy, 1, T, f);
        // the spearhead: a wedge of light leading the fist
        ctx.save(); ctx.fillStyle = C.p; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(hx + f * 6, hy - 5); ctx.lineTo(hx + f * 22, hy); ctx.lineTo(hx + f * 6, hy + 5); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    return r;
  };

  // ---------- the input: W + U (and a bot's U now and then) ----------
  function botWants(p, neutralOnly) {
    const f = fighterOf(p), o = f && V.f.find(q => q !== f); if (!f || !o || !o.p || o.p.dead) return false;
    const q = o.p, dx = q.x - p.x, adx = Math.abs(dx), dy = Math.abs(q.y - p.y), lv = lvOf(f), facing = (dx > 0 ? 1 : -1) === p.face;
    if (!facing || dy > 34) return false;
    const hurt = q.state === 'hurt' || q.state === 'down';
    if ((lv >= 3 || neutralOnly) && hurt) return false;                  // Nightmare: keep its trained routes whole
    const far = adx > 36 && adx < 184, chance = SP.BOT[lv] || 0.4;
    if (!hurt && far) return Math.random() < (q.state === 'guard' ? 0.12 : chance);   // neutral (into a raised guard only now and then)
    return hurt && adx < 80 && Math.random() < chance;                                // a combo ender
  }
  function ready(p, g) { return g.has('spark_dart') && !((p.cd || {}).wu > 0) && g.state.energy >= SP.COST - 0.5; }
  const _us = P.useSkill;
  P.useSkill = function (alt) {
    const g = this.G;
    if (!isK(g) || alt || I.held('down')) return _us.apply(this, arguments);
    const asked = I.held('up') || forced, bot = !asked && isBot(this);
    if (!asked && !(bot && ready(this, g) && botWants(this))) return _us.apply(this, arguments);
    if (!ready(this, g)) {
      if (!asked) return _us.apply(this, arguments);
      if (!(this.cdDeny > 0)) { SW.audio.sfx('deny'); this.cdDeny = 24; this.cdFlash = 'wu'; }
      return;
    }
    // through the usual U path (seals, cooldown bookkeeping, combo links, the lasting-guard use, the cast flourish) ...
    const cd = this.cd || (this.cd = {}), cu = cd.u || 0, e0 = g.state.energy, fn0 = this.castFn, st0 = this.state;
    cd.u = 0;
    _us.call(this, false);
    const took = this.state === 'cast' && this.castFn && (this.castFn !== fn0 || st0 !== 'cast') && g.state.energy <= e0;
    if (!took) { if (!(cd.u > 0)) cd.u = cu; return; }
    // ... then the dart becomes the pierce
    g.state.energy = Math.max(0, g.state.energy - (SP.COST - 25));   // the dart took 25 (or nothing, cancelled out of a landed hit): 50 in all, 25 in a combo
    cd.u = cu; cd.wu = SP.CD; this.castFn = null; this._kPierce = null;
    const dmg = Math.round(SP.DMG * (this.specMul ? this.specMul() : 1));
    const m = new Pierce(this, dmg); g.zone.shots.push(m); SP.uses++;
    this.enter('cast'); this.st = 8; this._kPierce = m; this.pose = ['cast', 0];
  };
  // a bot's I in neutral now and then too (Nightmare bots, short of energy, rarely press U with 50 in the bar; I costs 50)
  let forced = false;
  const _usp = P.useSpecial;
  P.useSpecial = function () {
    const g = this.G;
    if (isK(g) && !I.held('up') && !I.held('down') && isBot(this) && ready(this, g) && Math.random() < SP.BOT_I && botWants(this, true)) {
      forced = true; const wu = (this.cd || {}).wu;
      try { this.useSkill(false); } finally { forced = false; }
      if ((this.cd || {}).wu !== wu) return;   // it went
    }
    return _usp.apply(this, arguments);
  };
  // (the "wu" cooldown counts down with the others: js/moves.js ticks every key of p.cd)

  // ---------- HUD: a slot beside W+O ----------
  const text = SW.text, ui = SW.ui, W = SW.W, H = SW.H;
  function pip(ctx, g, p, h, x, y) {
    if (!g.has('spark_dart')) return;
    const left = (p.cd && p.cd.wu) || 0, bad = p.cdFlash === 'wu' && p.cdDeny > 12;
    text(ctx, 'W+U', x, y, bad ? '#ff5a5a' : left > 0 ? '#5a6078' : '#ffffff');
    art.rect(ctx, '#1a1626', x, y + 8, 24, 2); art.rect(ctx, left > 0 ? h.color : h.colorHi, x, y + 8, R(24 * (1 - left / SP.CD)), 2);
  }
  if (ui && ui.hud) {
    const _hud = ui.hud; ui.hud = function (ctx, g) {
      _hud(ctx, g);
      const p = g.player, h = g.hero && g.hero();
      if (!SP.on || !p || !h || g.scene !== 'play' || !isK(g)) return;
      const y = p.modeT > 0 ? 66 : 56; ctx.globalAlpha = 0.5; art.rect(ctx, '#05060c', 161, y - 2, 32, 14); ctx.globalAlpha = 1;
      pip(ctx, g, p, h, 164, y);
    };
  }
  if (V && V.draw) {
    const _vd = V.draw; V.draw = function (ctx, g) {
      _vd(ctx, g);
      if (!SP.on || g.scene !== 'vs' || !V.f || V.f.length < 2 || ['intro', 'fight', 'ko'].indexOf(V.phase) < 0 || V.paused || SW.mvNoHud) return;
      const keep = g.state;
      V.f.forEach((f, i) => { if (!f.p || f.hero !== 'kael') return; g.state = f.state; const x = i ? W - 134 : 162; ctx.globalAlpha = 0.55; art.rect(ctx, '#05060c', x - 2, H - 40, 30, 14); ctx.globalAlpha = 1; pip(ctx, g, f.p, HR.kael, x, H - 38); });
      g.state = keep;
    };
  }
  SP.Pierce = Pierce;
})();
