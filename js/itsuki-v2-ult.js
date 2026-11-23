'use strict';
// Shattered Worlds — ITSUKI · AWAKENED, part two (part one, the hero and his five combined-element skills, is
// js/itsuki-v2.js). Loaded last, after the apex files: it only adds and wraps.
//   W+I      EVENT HORIZON, a film of its own (206 frames, run by js/ult-grand.js through the apex contract of
//            js/apex/apex-core.js): his close-up and card while a seed of darkness grows in his raised hand; he throws it;
//            on a negative frame a black hole opens over the target: an accretion disc burning white-gold to crimson to
//            violet, a ring of bent light, the picture round it swirling in; the target is torn off the ground and held at
//            its edge while the stage, light and the five elements stream in and it is crushed; then the hole collapses to
//            a point in near silence, and explodes: a negative frame, a white core, jets out of both poles, violet rings,
//            shards, a shockwave along the floor. The damage is the shared rule (js/ult-share.js: 47% of full health).
//   J        each palm strike marked with one of his combined elements in turn (steam, fire-wind, thunder-fire,
//            earth-water, ice), the last one all five at once.
//   Versus   damage and health (APEX tune below): strong, not unbeatable.
//   Bot      Easy / Normal / Hard bots playing him pick among all five skills by distance and by which one they have not
//            used for longest (the ordinary bot only ever presses U and I); a Nightmare bot uses its own data.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, V = SW.versus, AP = SW.apex, N = SW.ninja, rand = SW.rand;
  const S2 = SW.itsuki2, ID = 'itsuki2';
  if (!S2 || !D.heroes[ID] || !art || !fx) return;
  const R = Math.round, PI = Math.PI, W = SW.W, H = SW.H;
  const C = { k: '#000000', ink: '#05000a', v: '#9d4edd', v2: '#6a3ab0', v3: '#2a0a4a', l: '#f0d6ff', w: '#ffffff', g: '#fff3c0', o: '#ff8a3a', r: '#c81e3a' };
  const EL5 = ['#ff6b35', '#7dffb2', '#ffe066', '#c8a05a', '#4cc9f0'];

  // other files' generic layers stay off him: his skills draw their own elements
  if (SW.skillElement && SW.skillElement.skip) SW.skillElement.skip[ID] = 1;
  if (SW.ultGrand && SW.ultGrand.FORM) SW.ultGrand.FORM.singularity = 'vortex';   // (only if the cinematic below is off)

  // the cut-in banner (js/heroes3.js) plays in full before the film, as Itsuki's does (js/ninjas7.js)
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (p.st === 1 && g && g.state && g.state.hero === ID) g.hitstop = Math.max(g.hitstop || 0, 50);
    return r;
  };

  if (AP && AP.reg) {
    const { ease, easeOut } = AP, D2 = AP.draw;
    // ================= J: his combined elements, in turn =================
    let turn = 0;
    function mark(ctx, e, cx, cy, t, s) {
      const k = easeOut(t * 1.8); s = s || 1;
      if (e === 0) { for (let i = 0; i < 5; i++) { const a = i * 1.26 + t * 2, d = 9 * k * s, r = R((3 + (i % 2)) * s * (1 - t * 0.4)); art.disc(ctx, '#6c7088', R(cx + Math.cos(a) * d) + 1, R(cy + Math.sin(a) * d * 0.7) + 1, r); art.disc(ctx, '#e8eaf2', R(cx + Math.cos(a) * d), R(cy + Math.sin(a) * d * 0.7), r); } art.rect(ctx, C.o, R(cx) - 1, R(cy) - 1, 3, 3); }
      else if (e === 1) { for (let i = 0; i < 18; i++) { const u = i / 18, a = u * PI * 3 + t * 7, r = u * 16 * k * s; art.rect(ctx, i % 3 ? '#ff8a1a' : '#ffe27a', R(cx + Math.cos(a) * r), R(cy + Math.sin(a) * r * 0.7), 2, 2); } }
      else if (e === 2) { let px = cx - 8 * s, py = cy - 12 * s; for (let i = 0; i < 4; i++) { const nx = cx + (i % 2 ? 7 : -5) * s, ny = py + 7 * s * k; art.line(ctx, '#5a0e2a', R(px), R(py), R(nx), R(ny), 3); art.line(ctx, i % 2 ? '#ffe866' : '#ff8a1a', R(px), R(py), R(nx), R(ny), 1); px = nx; py = ny; } }
      else if (e === 3) { for (let i = 0; i < 6; i++) { const a = i * PI / 3 + 0.4, d = 12 * k * s; art.disc(ctx, '#1e4a24', R(cx + Math.cos(a) * d), R(cy + Math.sin(a) * d), 3); art.rect(ctx, i % 2 ? '#7ab84a' : '#6e4622', R(cx + Math.cos(a) * d) - 1, R(cy + Math.sin(a) * d) - 1, 2, 2); } }
      else { for (let i = 0; i < 6; i++) { const a = i * PI / 3, d = 4 + 12 * k * s; art.line(ctx, '#2a6a9a', R(cx), R(cy), R(cx + Math.cos(a) * d), R(cy + Math.sin(a) * d), 2); art.line(ctx, i % 2 ? '#bfefff' : '#ffffff', R(cx), R(cy), R(cx + Math.cos(a) * d), R(cy + Math.sin(a) * d), 1); } }
    }
    const COLS = [['#e8eaf2', '#ff8a3a'], ['#ff8a1a', '#ffe27a'], ['#ffe866', '#ff8a1a'], ['#7ab84a', '#6e4622'], ['#bfefff', '#ffffff']];
    const melee = {
      col: C.v, hi: C.l, dk: C.ink, life: 14,
      swing(ctx, q, x, y, t) {
        const f = q.face, cx = x + f * (20 + q.n * 2), cy = y - 26 + (q.n % 2 ? -3 : 2);
        if (q.e === undefined) q.e = q.fin ? -1 : (turn = (turn + 1) % 5);
        ctx.globalAlpha = 1 - ease((t - 0.55) / 0.45);
        AP.SWINGS.palm(ctx, Object.assign({}, q, { col: q.e < 0 ? C.v : COLS[q.e][0], hi: q.e < 0 ? C.l : COLS[q.e][1] }), x, y - 2, t);
        if (q.e >= 0) mark(ctx, q.e, cx, cy, t, 1.15);
        else { D2.disc(ctx, cx, cy, 4 + 3 * (1 - t), C.k); D2.ring(ctx, cx, cy, 6 + 18 * easeOut(t * 1.6), C.v, 2); for (let e = 0; e < 5; e++) { const a = -PI / 2 + e * 2 * PI / 5 + t * 3, d = 24 * easeOut(t * 1.6); mark(ctx, e, cx + Math.cos(a) * d, cy + Math.sin(a) * d, t, 0.6); } }
      },
      hit(x, y, n, p, fin) { AP.bits(x, y, fin ? 16 : 6, { cols: fin ? EL5.concat([C.v]) : COLS[turn], sp: fin ? 3.2 : 2.2, life: 16 }); if (fin) { AP.stop(4); fx.shake(4, 8); } }
    };

    // ================= W+I: EVENT HORIZON =================
    const LEN = 206, FIN = 150, BU = 60, OPEN = 58, THROW = 46, CRUSH = 130;
    const keys = [[0, 1, 0, 'hero'], [12, 1, 0.6, 'hero', 0, 0, 'cut'], [16, 2.6, 1, 'hero', 4, -26], [44, 2.4, 1, 'hero', 4, -26], [THROW, 1.25, 1, 'mid', 0, -34, 'cut'],
      [OPEN, 1.4, 1, 'target', 0, -40], [100, 1.75, 1, 'target', 0, -34], [CRUSH, 2.1, 1, 'target', 0, -30], [FIN - 2, 2.5, 1, 'target', 0, -20], [FIN, 1.3, 1, 'target', 0, -26],
      [FIN + 8, 1.7, 1, 'target', 0, -26], [FIN + 32, 1.15, 0.5, 'mid', 0, -20], [LEN - 4, 1, 0, 'mid']];
    const zoom = AP.shots(keys);
    const H0 = { x: 0, y: 0, on: false };   // where the hole is (world)
    const st0 = () => { const cs = AP.caster(); return cs && cs.hero === ID ? cs.p.st : -1; };
    const RH = 19, radius = st => st < OPEN ? 0 : st < OPEN + 14 ? RH * easeOut((st - OPEN) / 14) : st < CRUSH ? RH + 2 * Math.sin(st * 0.3) : st < FIN ? RH * (1 - ease((st - CRUSH) / (FIN - CRUSH - 4))) + 1 : 0;
    // the accretion disc: a tilted ring of burning matter, hot white-gold where it turns toward us, violet at its edge
    function disc(ctx, x, y, r, st, front) {
      const n = 64, spin = st * (st < CRUSH ? 0.09 : 0.09 + (st - CRUSH) * 0.012);
      const rr = Math.max(r, 5);
      for (let band = 0; band < 4; band++) {
        const rx = rr * (1.5 + band * 0.38), ry = rr * (0.3 + band * 0.08);
        for (let i = 0; i < n; i++) {
          const a = i / n * PI * 2 + spin * (1 - band * 0.12) + band * 0.7, s = Math.sin(a);
          if ((s >= 0) !== front) continue;
          const dop = Math.cos(a), hot = band === 0 ? (dop > 0.3 ? C.w : C.g) : band === 1 ? (dop > 0 ? C.g : C.o) : band === 2 ? (dop > 0 ? C.o : C.r) : (dop > 0 ? C.v : C.v2);
          if (band === 3 && (i + (st >> 1)) % 2) continue;
          art.rect(ctx, hot, R(x + Math.cos(a) * rx) - 1, R(y + s * ry), band < 2 ? 3 : 2, band < 3 ? 2 : 1);
        }
      }
    }
    function hole(ctx, x, y, r, st) {
      if (r < 1) return;
      if (st >= CRUSH) {   // collapsing: the light it held is squeezed into a ring, then a point, white-hot
        const u = (st - CRUSH) / (FIN - CRUSH), fl = R(10 + 70 * u * u), rr = Math.max(2, R(r + 3));
        art.glow(ctx, x, y, R(14 + 34 * u), C.v, 0.3 + 0.3 * u); art.glow(ctx, x, y, R(6 + 14 * u), C.w, 0.2 + 0.5 * u);
        art.line(ctx, C.v, x - fl, y, x + fl, y, 3); art.line(ctx, C.l, x - fl, y, x + fl, y, 1); art.line(ctx, C.v, x, y - R(fl * 0.55), x, y + R(fl * 0.55), 3); art.line(ctx, C.l, x, y - R(fl * 0.55), x, y + R(fl * 0.55), 1);   // a cross flare
        D2.ring(ctx, x, y, rr + 1, C.l, 2); D2.ring(ctx, x, y, rr + 3, C.v, 1);
        if (r <= 3) { D2.disc(ctx, x, y, 3, C.w); }
      }
      art.glow(ctx, x, y, R(r * 3.2), C.v, 0.26);
      art.glow(ctx, x, y, R(r * 1.9), C.r, 0.12);
      ctx.save(); ctx.globalAlpha = 0.5; D2.ring(ctx, x, y, r * 1.55 + Math.sin(st * 0.5), C.l, 1); ctx.restore();   // light bent round it
      disc(ctx, x, y, r, st, false);
      D2.disc(ctx, x, y, r + 2, st >= CRUSH ? C.w : C.v); D2.disc(ctx, x, y, r + 1, C.l); if (r > 2) D2.disc(ctx, x, y, r, C.k);   // the photon ring, the dark
      art.rect(ctx, C.w, R(x + Math.cos(st * 0.2) * (r + 1)), R(y + Math.sin(st * 0.2) * (r + 1)), 1, 1);
      disc(ctx, x, y, r, st, true);
      if (st >= OPEN + 6 && st < CRUSH) { ctx.save(); ctx.globalAlpha = 0.22 + 0.1 * Math.sin(st * 0.4); art.rect(ctx, C.l, R(x) - 1, R(y - r * 5.5), 2, R(r * 4.4)); art.rect(ctx, C.l, R(x) - 1, R(y + r * 1.1), 2, R(r * 2.6)); ctx.restore(); }   // faint jets at the poles
    }
    // things falling in: streaks spiralling to the centre (elements, rubble, light)
    function infall(n, far) {
      for (let i = 0; i < n; i++) {
        const a0 = rand(0, PI * 2), d0 = rand(far ? 120 : 60, far ? 220 : 120), spin = rand(1.6, 2.6), life = R(rand(18, 30)), col = rand(0, 1) < 0.5 ? EL5[i % 5] : rand(0, 1) < 0.5 ? '#8a8a9a' : C.l, sz = rand(0, 1) < 0.25 ? 3 : 2;
        AP.fx({ x: H0.x, y: H0.y, life, draw(ctx, q, sx, sy, t) {
          const u = ease(t), d = d0 * (1 - u), a = a0 + spin * u * u, X = sx + Math.cos(a) * d, Y = sy + Math.sin(a) * d * 0.62;
          if (d < radius(Math.max(0, st0())) + 2) return;   // gone past the horizon
          const d2 = d0 * (1 - Math.max(0, u - 0.08)), a2 = a0 + spin * Math.max(0, u - 0.08) ** 2, X2 = sx + Math.cos(a2) * d2, Y2 = sy + Math.sin(a2) * d2 * 0.62;
          ctx.globalAlpha = Math.min(1, t * 4); art.line(ctx, col, R(X2), R(Y2), R(X), R(Y), sz > 2 ? 2 : 1); if (sz > 2) art.rect(ctx, col, R(X) - 1, R(Y) - 1, 3, 3);
        } });
      }
    }
    function rubble(x, gy) {   // chunks of the floor torn up into it
      for (let i = 0; i < 2; i++) {
        const x0 = x + rand(-90, 90), life = R(rand(26, 40)), c = rand(0, 1) < 0.5 ? '#6a5040' : '#a08060', s = R(rand(2, 5));
        AP.fx({ x: x0, y: gy, life, draw(ctx, q, sx, sy, t, cam) {
          const u = ease(t), X = sx + (H0.x - cam.x - sx) * u + Math.sin(t * 9) * 3 * (1 - u), Y = sy + (H0.y - cam.y - sy) * u * u;
          art.rect(ctx, '#2a1a10', R(X) - 1, R(Y) - 1, R(s * (1 - u * 0.7)) + 2, R(s * (1 - u * 0.7)) + 2); art.rect(ctx, c, R(X), R(Y), R(s * (1 - u * 0.7)), R(s * (1 - u * 0.7)));
        } });
      }
    }
    // the seed of darkness in his raised hand
    function seed(p) {
      AP.fx({ x: p.x, y: p.y, life: 600, draw(ctx, q, sx, sy, t, cam) {
        const st = st0(); if (st < 0 || st >= THROW) { q.life = 0; return; }
        const f = p.face || 1, hx = R(p.x - cam.x + f * 6), hy = R(p.y - cam.y - 66), r = 1 + R(6 * easeOut((st - 14) / 28));   // over his head (he is drawn 1.5x here)
        art.glow(ctx, hx, hy, r * 4, C.v, 0.3);
        for (let e = 0; e < 5; e++) { const a = st * 0.22 + e * 1.2566, d = 22 * (1 - ((st * 0.04 + e * 0.2) % 1)); art.rect(ctx, EL5[e], R(hx + Math.cos(a) * d) - 1, R(hy + Math.sin(a) * d * 0.6) - 1, 2, 2); art.line(ctx, EL5[e], R(hx + Math.cos(a) * d), R(hy + Math.sin(a) * d * 0.6), R(hx + Math.cos(a - 0.4) * (d + 6)), R(hy + Math.sin(a - 0.4) * (d + 6) * 0.6), 1); }   // the five, drawn into it
        D2.disc(ctx, hx, hy, r + 1, C.v); D2.disc(ctx, hx, hy, r, C.k); disc(ctx, hx, hy, Math.max(2, r * 0.8), st, true);
      } });
    }
    function flight(p) {   // the seed thrown to where the hole will open
      const x0 = p.x + (p.face || 1) * 6, y0 = p.y - 66;
      AP.fx({ x: x0, y: y0, life: OPEN - THROW + 1, draw(ctx, q, sx, sy, t, cam) {
        const u = easeOut(t), X = sx + (H0.x - cam.x - sx) * u, Y = sy + (H0.y - cam.y - sy) * u - Math.sin(PI * u) * 24;
        for (let k = 1; k <= 4; k++) { const v = Math.max(0, u - k * 0.05), X2 = sx + (H0.x - cam.x - sx) * v, Y2 = sy + (H0.y - cam.y - sy) * v - Math.sin(PI * v) * 24; ctx.globalAlpha = 0.6 - k * 0.12; D2.disc(ctx, X2, Y2, 4 - k * 0.6, C.v); }
        ctx.globalAlpha = 1; D2.disc(ctx, X, Y, 4, C.v); D2.disc(ctx, X, Y, 3, C.k);
      } });
    }
    function holeFx() {
      AP.fx({ x: 0, y: 0, life: 600, draw(ctx, q, sx, sy, t, cam) {   // (a long life: hit-stops pause the fight, not the effects; it ends itself)
        const st = st0(); if (st < 0 || st >= FIN) { q.life = 0; return; } if (st < OPEN) return;
        hole(ctx, R(H0.x - cam.x), R(H0.y - cam.y), radius(st), st);
      } });
    }
    function blast(cx, cy, gy) {   // the explosion when it collapses
      const SH = []; for (let i = 0; i < 26; i++) SH.push({ a: rand(0, PI * 2), v: rand(60, 150), c: i % 3 ? (i % 2 ? C.v : C.l) : EL5[i % 5] });
      AP.fx({ x: cx, y: cy, life: 46, draw(ctx, q, sx, sy, t) {
        const k = easeOut(t * 2.2), fade = 1 - ease((t - 0.45) / 0.55);
        if (t < 0.5) { const r = 4 + 46 * easeOut(t * 3.2); ctx.globalAlpha = fade; art.glow(ctx, sx, sy, R(r * 1.8), C.v, 0.55); D2.disc(ctx, sx, sy, r, t < 0.1 ? C.w : C.v); D2.disc(ctx, sx, sy, r * 0.72, t < 0.18 ? C.w : C.l); }
        ctx.globalAlpha = fade;   // jets out of both poles
        const jl = 160 * easeOut(t * 2.6), jw = R(7 * (1 - t));
        if (jw > 0) { art.rect(ctx, C.v, R(sx) - jw - 1, R(sy - jl), jw * 2 + 2, R(jl)); art.rect(ctx, C.l, R(sx) - jw + 1, R(sy - jl), jw * 2 - 2 > 0 ? jw * 2 - 2 : 1, R(jl)); art.rect(ctx, C.v, R(sx) - jw - 1, R(sy), jw * 2 + 2, R(jl * 0.5)); art.rect(ctx, C.w, R(sx) - 1, R(sy - jl), 2, R(jl * 1.5)); }
        for (let i = 0; i < 4; i++) { const u = (t - i * 0.06) / 0.75; if (u <= 0 || u >= 1) continue; ctx.globalAlpha = 1 - u; D2.ring(ctx, sx, sy, 10 + 96 * easeOut(u), i % 2 ? C.v : C.l, 2); }
        ctx.globalAlpha = fade;
        SH.forEach(s => { const d = s.v * k, x1 = sx + Math.cos(s.a) * d, y1 = sy + Math.sin(s.a) * d * 0.75, x0 = sx + Math.cos(s.a) * d * 0.72, y0 = sy + Math.sin(s.a) * d * 0.54; D2.streak(ctx, x0, y0, x1, y1, 4, [C.v3, s.c, C.w]); });
        if (t < 0.22) D2.burst(ctx, sx, sy, 58, 22, [C.w, C.l, C.v], t * 2);
        const g = gy - (cy - sy), w = 20 + 150 * easeOut(t * 1.5);
        ctx.save(); ctx.translate(sx, g); ctx.scale(1, 0.18); D2.ring(ctx, 0, 0, w + 3, C.ink, 3); D2.ring(ctx, 0, 0, w, C.v, 2); ctx.restore();
        ctx.globalAlpha = 1;
      } });
    }
    // the picture round the hole swirls in toward it (drawn over the finished frame, in screen pixels)
    const tmp = document.createElement('canvas'), tc = tmp.getContext('2d');
    function screenOf(o, wx, wy) {   // a world point on the screen as js/ult-grand.js's camera crops it this frame
      const c = o.ctx.canvas, k = c.width / W, zm = o.zm || { z: 1 }, p = o.p, T = o.T;
      if (!(zm.z > 1.01)) return [wx - G.cam.x, wy - G.cam.y];
      let fx0 = zm.on === 'target' && T ? T.x : p.x, fy0 = (zm.on === 'target' && T ? T.y : p.y) - 22;
      if (zm.on === 'mid' && T) { fx0 = (p.x + T.x) / 2; fy0 = (p.y + T.y) / 2 - 22; }
      if (zm.dx) fx0 += zm.dx * (p.face || 1); if (zm.dy) fy0 += zm.dy;
      const sw = c.width / zm.z, sh = c.height / zm.z, sx = SW.clamp((fx0 - G.cam.x) * k - sw / 2, 0, c.width - sw), sy = SW.clamp((fy0 - G.cam.y) * k - sh * 0.5, 0, c.height - sh);
      return [((wx - G.cam.x) * k - sx) * zm.z / k, ((wy - G.cam.y) * k - sy) * zm.z / k];
    }
    function swirl(ctx, o, power) {
      const c = ctx.canvas, k = c.width / W, [hx, hy] = screenOf(Object.assign({ ctx }, o), H0.x, H0.y), zz = (o.zm && o.zm.z) || 1;
      if (tmp.width !== c.width || tmp.height !== c.height) { tmp.width = c.width; tmp.height = c.height; }
      tc.setTransform(1, 0, 0, 1, 0, 0); tc.clearRect(0, 0, c.width, c.height); tc.drawImage(c, 0, 0);
      const cx = hx * k, cy = hy * k, RM = 96 * zz * k, r0 = Math.max(4, radius(o.st) * zz * k), n = 9;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
      for (let i = 0; i < n; i++) {
        const ra = RM * (1 - i / n), rb = RM * (1 - (i + 1) / n); if (ra <= r0) break;
        const u = 1 - ra / RM, ang = power * u * u * 1.4, sc = 1 + power * u * 0.22;
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, ra, 0, PI * 2); ctx.arc(cx, cy, Math.max(r0, rb), 0, PI * 2, true); ctx.clip();
        ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(sc, sc); ctx.translate(-cx, -cy); ctx.drawImage(tmp, 0, 0); ctx.restore();
      }
      const bh = Math.round(30 * ((o.zm && o.zm.bars) || 0)) * k;   // the letterbox stays put
      if (bh > 0) { ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, c.width, bh); ctx.fillRect(0, c.height - bh, c.width, bh); }
      ctx.restore();
    }
    const proxyOf = () => { const z = G.zone; return z && z.ents ? z.ents.find(e => e.isProxy && !e.dead) : null; };
    const ult = {
      len: LEN, fin: FIN, bu: BU, own: 2, cu0: 16, cu1: 46, c: [C.l, C.v, C.ink, C.o],
      zoom, noDark: true,
      card: AP.card({ from: 18, to: 46, c1: C.l, c2: C.v, tag: 'AWAKENED', glyph(ctx, x, y, t) { D2.disc(ctx, x, y, 5, C.v); D2.disc(ctx, x, y, 4, C.k); for (let i = 0; i < 6; i++) { const a = t * 6 + i * PI / 3; art.rect(ctx, i % 2 ? C.g : C.o, R(x + Math.cos(a) * 9), R(y + Math.sin(a) * 3), 2, 1); } } }),
      every(st, o) {
        const { p, T } = o;
        if (st === 2) { SW.audio.sfx('charge'); fx.flash(C.v, 3); }
        if (st === 14) seed(p);
        if (st === 16) SW.audio.sfx('select');
        if (st === THROW) {   // where it will open: over the target's head
          const tx = T ? T.x : p.x + p.face * 80, ty = T ? T.y : p.y;
          H0.x = tx; H0.y = Math.max(G.cam.y + 46, ty - 64); H0.on = true; H0.gy = ty; flight(p); SW.audio.sfx('dash');
        }
        if (st === OPEN) { holeFx(); SW.audio.sfx('explode'); SW.audio.sfx('roar'); fx.shake(8, 14); AP.stop(4); }
        if (st > OPEN && st < CRUSH) {
          if (st % 2 === 0) infall(2, st % 6 === 0);
          if (st % 5 === 0) rubble(H0.x, H0.gy);
          if (st % 18 === 0) SW.audio.sfx('charge');
          if (st % 4 === 0) fx.shake(2, 4);
        }
        if (T && st > OPEN && st < FIN) {   // torn off the floor and held at its edge
          const k = Math.min(1, (st - OPEN) / 26) * 0.14, gx = H0.x + Math.sin(st * 0.12) * 3, gy = H0.y + (st < CRUSH ? radius(st) : RH) + 36;
          if (T.state !== 'hurt') { T.enter('hurt'); } T.hurtLen = Math.max(T.hurtLen || 0, 12);
          T.x += (gx - T.x) * k; T.y += (gy - T.y) * k; T.vx = 0; T.vy = 0; T.onGround = false;
          const e = proxyOf();
          if (e && st >= 76 && st <= 142 && (st - 76) % 11 === 0) { N.hurt(e, 3, { kx: 0, ky: 0, stun: 30, heavy: false, unblockable: true }); fx.spark(T.x, T.y - 18, C.l, 6, 2); SW.audio.sfx('heavy'); }   // crushed
        }
        if (st === CRUSH) { SW.audio.sfx('perfect'); }   // then near silence while it collapses
      },
      build() {},
      finish(o) {
        const { gy } = o;
        SW.audio.sfx('explode'); SW.audio.sfx('heavy'); SW.audio.sfx('zap'); SW.audio.sfx('perfect');
        AP.stop(14); fx.shake(20, 30); fx.flash(C.w, 6);
        blast(H0.x, H0.y, gy);
        for (let i = 0; i < 4; i++) fx.ring(H0.x, H0.y, i % 2 ? C.v : C.l, 4 + i * 4, 90 + i * 22, 18 + i * 3);
        AP.bits(H0.x, H0.y, 44, { cols: EL5.concat([C.v, C.l]), sp: 5, life: 28 });
        H0.on = false;
      },
      pose(st) {
        if (st < 2) return null;
        if (st < 16) return ['charge', (st >> 2) % 2];
        if (st < THROW) return ['special', 0];
        if (st < OPEN) return ['a4', 1];
        if (st < FIN) return ['cast', (st >> 3) % 2];
        if (st < FIN + 10) return ['special', 2];
        return ['cheer', 0];
      },
      look(st) {
        if (st >= 16 && st < THROW) return { vig: 0.6, grade: ['#12041e', 0.3] };
        if (st >= OPEN && st < OPEN + 2) return { impact: 'neg' };
        if (st >= OPEN + 2 && st < CRUSH) return { vig: 0.5, grade: ['#1a0630', 0.28], lines: 14, lineCol: '#8a6ad0', draw(ctx, o) { swirl(ctx, o, Math.min(1, (st - OPEN) / 20) * 0.55); } };
        if (st >= CRUSH && st < FIN) { const u = (st - CRUSH) / (FIN - CRUSH); return { vig: 0.5 + 0.25 * u, grade: ['#000000', 0.15 + 0.25 * u], lines: 20, lineCol: '#8a6ad0', draw(ctx, o) { swirl(ctx, o, 0.55 * (1 - u)); } }; }
        if (st >= FIN && st < FIN + 2) return { impact: 'neg' };
        if (st >= FIN + 2 && st < FIN + 4) return { impact: 'tint', tint: C.v };
        if (st >= FIN + 4 && st < FIN + 14) return { lines: 44, lineCol: C.w, split: 3, vig: 0.4 };
        return null;
      }
    };
    // Versus damage and health: measured bot against bot over 20 heroes, half of them apex (js/apex/apex-core.js), three
    // rounds each: Hard vs Hard 72% won, Nightmare vs Nightmare 85%; he still loses to Itsuki, the strongest
    AP.reg(ID, { melee, ult, tune: { dmg: 2.6, hp: 1.9 } });
    S2.ultDef = ult; S2.hole = H0;
  }

  // ================= the bot: all five skills, each where it works =================
  // (Easy / Normal / Hard. The ordinary bot only presses U and I; a Nightmare bot runs its own data in js/hardcore.js.)
  const P = SW.Player && SW.Player.prototype, HC = SW.hardcore;
  const OPTS = [
    { id: 'U', keys: ['skill'], cost: 25, slot: 'u', lo: 0, hi: 190, w: 0.75 },
    { id: 'u', keys: ['skill', 'down'], cost: 50, slot: 'su', lo: 0, hi: 230, w: 1.15, ground: true },
    { id: 'I', keys: ['special'], cost: 50, slot: 'i', lo: 0, hi: 330, w: 1.1 },
    { id: 'i', keys: ['special', 'down'], cost: 100, slot: 'si', lo: 0, hi: 175, w: 1.3, ground: true },
    { id: 'O', keys: ['awaken', 'up'], cost: 75, slot: 'wo', lo: 0, hi: 160, w: 1.3 }
  ];
  const BOT = S2.bot = { on: true, used: {}, every: [[90, 150], [60, 110], [40, 80]] };
  function choose(f, q) {
    const p = f.p, S = f.state, cd = p.cd || {}, adx = Math.abs(q.x - p.x), ai = f.its2 || (f.its2 = { last: {} });
    const keep = S.energy >= 140 && S.energy < 300 && !(p.awakeT > 0) ? 140 : 0;   // past half the bar: save toward the ultimate (cheap U still flows)
    let best = null, bs = 0;
    OPTS.forEach(o => {
      if (S.energy - o.cost < (o.id === 'U' ? 0 : keep) || cd[o.slot] > 0 || adx < o.lo || adx > o.hi || (o.ground && !p.onGround)) return;
      if (o.id === 'O' && (p.state === 'attack' || !(SW.signature && SW.signature.SIG && SW.signature.SIG[ID]))) return;   // (W+O only from a stand: a J cannot be cancelled into it)
      const since = V.t - (ai.last[o.id] === undefined ? -999 : ai.last[o.id]);
      const sc = o.w * (1 + Math.min(3, since / 150)) * (0.6 + Math.random() * 0.8) * (o.id === 'i' && q.state === 'hurt' ? 1.4 : 1) * (o.id === 'O' && adx < 90 ? 1.3 : 1);
      if (sc > bs) { bs = sc; best = o; }
    });
    return best;
  }
  function press(f, k, o) {
    ['skill', 'special', 'awaken', 'up', 'down'].forEach(a => { if (k[a]) { delete k[a]; f.inp.lastHit[a] = undefined; } });
    if (o.keys.indexOf('awaken') >= 0 && f.inp.prev.awaken) { (f.its2 || (f.its2 = { last: {} })).pend = o; return; }   // W+O wants a fresh press: next frame
    o.keys.forEach(a => { k[a] = true; f.inp.lastHit[a] = SW.frame; });
    (f.its2 || (f.its2 = { last: {} })).last[o.id] = V.t;
    BOT.used[o.id] = (BOT.used[o.id] || 0) + 1;
  }
  if (P && V) {
    const _up = P.update;
    P.update = function (g, z) {
      const f = g && g.scene === 'vs' && V.cur && V.cur.p === this ? V.cur : null;
      if (BOT.on && f && f.bot && f.hero === ID && V.phase === 'fight' && V.mode !== 'train' && V.f.length === 2 && !(HC && HC.is && HC.is(f)) && !(f.stunT > 0) && !this.dead) {
        try {
          const q = V.f[1 - f.i].p, k = f.inp.now, pr = f.inp.prev, ai = f.its2 || (f.its2 = { last: {} }), lv = Math.min(2, f.lv !== undefined ? f.lv : V.diff);
          const fresh = a => k[a] && !pr[a], free = this.state === 'idle' || this.state === 'run' || (this.state === 'attack' && this.connected);
          if (ai.pend) {   // turned to face them last frame: now the skill
            const o = ai.pend; ai.pend = null;
            if (free && !(this.cd && this.cd[o.slot] > 0) && f.state.energy >= o.cost) press(f, k, o);
          } else if (q && !q.dead) {
            const asked = fresh('skill') || fresh('special') || (fresh('awaken') && !k.down && !k.up);   // the ordinary bot wants a skill: let it be the right one
            if (ai.next === undefined) ai.next = V.t + 60;
            const due = V.t >= ai.next && (this.state === 'idle' || this.state === 'run');
            const full = (f.state.energy >= 300 || (this.awakeT > 0 && f.state.energy >= 100)) && (this.state === 'idle' || this.state === 'run') && Math.abs(q.x - this.x) < 220 && !q.dead && q.state !== 'ult';
            if (full && Math.random() < [0.02, 0.05, 0.12][lv]) {   // the black hole, when the bar is full and they are in reach
              ['skill', 'special', 'awaken', 'down', 'left', 'right'].forEach(a => { delete k[a]; }); k.up = true; k.special = true; f.inp.lastHit.special = SW.frame; f.inp.lastHit.up = SW.frame; BOT.used.X = (BOT.used.X || 0) + 1;
            } else if (asked || due) {
              const span = BOT.every[lv]; ai.next = V.t + R(span[0] + Math.random() * (span[1] - span[0]));
              const o = choose(f, q);
              if (o) {
                const face = Math.sign(q.x - this.x) || this.face;
                if (face !== this.face && !free) { /* busy and turned away: leave its own press */ }
                else if (face !== this.face && this.state !== 'attack') { ['skill', 'special', 'awaken', 'up', 'down', 'left', 'right'].forEach(a => { delete k[a]; }); k[face > 0 ? 'right' : 'left'] = true; f.inp.lastHit[face > 0 ? 'right' : 'left'] = SW.frame; ai.pend = o; }
                else press(f, k, o);
              }
            }
          }
        } catch (e) { console.error('itsuki2 bot', e); }
      }
      return _up.apply(this, arguments);
    };
  }
})();
