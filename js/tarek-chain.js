'use strict';
// Shattered Worlds — Tarek's chain and sickle (2026-11-20, the hero-look rework: cool, not cute). His story: chief of the
// chain raiders, who walked into the desert unarmed and offered Dune his chain; his look: a long iron chain with a brass
// weight, and a short sickle Garo forged. His chain was a dotted line of grey boxes. It is now a real chain: alternating
// links, one seen face-on as a ring, the next edge-on as a bar, iron grey with a lit top edge and a dark underside, that
// sags when slack and snaps straight when taut; a spiked brass weight on the end; the sickle a curved blade that glints.
// Draw-only: every hit, hitbox and timing stays as it was (Chain Prison's eight chains are kept as the user asked for
// them). Loaded after js/ume-garden.js.
//   U      Chain Lash: the chain whips out weight first and cracks straight at full length (a clank of sparks)
//   S+U    Hook Pull: the sickle on the chain's end bites the foe, glinting, and the chain goes taut as it reels
//   I      Iron Cyclone: a full ring of chain whirls round him, the weight a bright point, dust thrown off the floor
//   S+I    Chain Drop: the chain falls from above loop by loop round the foe and clinks tight with sparks
//   W+O    Chain Snare: the chain shoots out taut and the weight snaps round the foe
//   J      the finisher: the chain snaps to full length weight first with a brass flash
//   S+O    Long Reach: a coil of chain hangs from his shoulder and swings      O  Iron Coil: chain wound round his
//          forearms like bracers, scrap rattling at his feet (small on purpose: the view stays clear)
//   W+I    Chain Prison: the eight chains stay; in the cinematic finish (js/ult-cinema.js) he winds the chain round his
//          fist, the brass weight swinging, then hauls every chain taut for the slam on an impact frame
// SW.tarekChain.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts;
  if (!N || !P || !CASTS || !PX || !PX.impact || !CASTS.chain_lash || !CASTS.hook_pull || !CASTS.iron_cyclone) return;
  const TC = SW.tarekChain = { on: true };
  const isT = g => !!(TC.on && g && g.state && g.state.hero === 'tarek');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const C = { out: '#14161c', d: '#3a3f4a', m: '#6c757d', l: '#adb5bd', hi: '#e0e6f0', br0: '#6a4a10', br: '#c9a227', br2: '#fff1c1', w: '#ffffff', dust: '#c8a878' };

  // ---------- a chain from (x0, y0) to (x1, y1), sagging by `sag` pixels at its middle ----------
  function chain(ctx, x0, y0, x1, y1, sag, o) {
    o = o || {};
    const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L / 4));
    ctx.save(); if (o.a !== undefined) ctx.globalAlpha *= clamp01(o.a);
    for (let i = 0; i <= n; i++) {
      const u = i / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u + Math.sin(u * PI) * (sag || 0), X = Math.round(x), Y = Math.round(y);
      if (i % 2) { art.rect(ctx, C.out, X - 2, Y - 1, 4, 3); art.rect(ctx, C.m, X - 1, Y, 2, 1); art.rect(ctx, C.hi, X - 1, Y - 1, 1, 1); }   // a link edge-on: a short bar
      else { art.rect(ctx, C.out, X - 3, Y - 2, 6, 5); art.rect(ctx, C.l, X - 2, Y - 1, 4, 3); art.rect(ctx, C.out, X - 1, Y, 2, 1); art.rect(ctx, C.hi, X - 2, Y - 1, 2, 1); art.rect(ctx, C.d, X, Y + 1, 2, 1); }   // a link face-on: a ring
    }
    ctx.restore();
  }
  TC.chain = chain;
  function weight(ctx, x, y, s, o) {   // the spiked brass weight
    o = o || {};
    PX.sprite(ctx, x, y, s * 3, s * 3, c => {
      c.rotate(o.rot || 0);
      for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4; c.beginPath(); c.moveTo(Math.cos(a - 0.3) * s, Math.sin(a - 0.3) * s); c.lineTo(Math.cos(a) * s * 1.45, Math.sin(a) * s * 1.45); c.lineTo(Math.cos(a + 0.3) * s, Math.sin(a + 0.3) * s); c.fillStyle = C.br0; c.fill(); }
      c.beginPath(); c.arc(0, 0, s, 0, PI * 2); c.fillStyle = C.br; c.fill();
      c.beginPath(); c.arc(-s * 0.3, -s * 0.3, s * 0.4, 0, PI * 2); c.fillStyle = C.br2; c.fill();
    }, { alpha: o.a, mono: o.mono, outline: C.out, keepThin: true, pal: [C.out, C.br0, C.br, C.br2, C.w] });
  }
  function sickle(ctx, x, y, s, dir, o) {   // the short sickle: a curved blade on a stub of handle
    o = o || {};
    PX.sprite(ctx, x, y, s * 3, s * 3, c => {
      c.scale(dir < 0 ? -1 : 1, 1); c.rotate(o.rot || 0);
      c.fillStyle = '#5a3a20'; c.fillRect(-s * 0.9, -s * 0.12, s * 0.6, s * 0.24);
      c.beginPath(); c.moveTo(-s * 0.3, -s * 0.15); c.quadraticCurveTo(s * 0.9, -s * 1.1, s * 0.8, s * 0.1); c.quadraticCurveTo(s * 0.6, -s * 0.6, -s * 0.3, s * 0.1); c.closePath(); c.fillStyle = C.l; c.fill();
      c.strokeStyle = C.hi; c.lineWidth = Math.max(1, s * 0.1); c.beginPath(); c.moveTo(-s * 0.2, -s * 0.18); c.quadraticCurveTo(s * 0.85, -s * 1.05, s * 0.78, s * 0.05); c.stroke();
    }, { alpha: o.a, mono: o.mono, outline: C.out, keepThin: true, pal: [C.out, '#5a3a20', C.d, C.m, C.l, C.hi, C.w] });
    if (o.glint) { ctx.save(); ctx.globalAlpha = o.glint; art.rect(ctx, C.w, Math.round(x + dir * s * 0.5) - 3, Math.round(y - s * 0.6), 7, 1); art.rect(ctx, C.w, Math.round(x + dir * s * 0.5), Math.round(y - s * 0.6) - 3, 1, 7); ctx.restore(); }
  }
  const clank = (x, y, n) => { for (let i = 0; i < n; i++) part(x, y, i % 2 ? C.br2 : C.w, rand(-2.5, 2.5), rand(-2.5, 1), 10, 1, 0.15); };
  const hand = p => [Math.round(p.x - G.cam.x) + p.face * 8, Math.round(p.y - G.cam.y) - 22];

  // ================= U: Chain Lash =================
  const _cl = CASTS.chain_lash;
  CASTS.chain_lash = function (p, z, dmg, up) {
    const n0 = z.shots.length, r = _cl.apply(this, arguments);
    if (!isT(G)) return r;
    const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 18 && s.render), dir = p.face, len = 140;
    if (v) v.render = (ctx, x, y, t) => {
      const k = t < 8 ? ease(t / 8) : 1 - (t - 8) / 10, [px, py] = hand(p), ex = px + Math.round(dir * len * k), ey = py + (up ? -Math.round(len * k * 0.5) : 0);
      chain(ctx, px, py, ex, ey, t < 8 ? 6 * (1 - k) : (t - 8) * 1.2);
      weight(ctx, ex, ey, 4, { rot: t * 0.6 });
    };
    if (v) { const _tk = v.tick; v.tick = function (vv) { const out = _tk ? _tk.apply(this, arguments) : undefined; if (vv.t === 8) clank(p.x + dir * (8 + len), p.y - 22 - (up ? len * 0.5 : 0), 8); return out; }; }
    return r;
  };

  // ================= S+U: Hook Pull =================
  const _hp = CASTS.hook_pull;
  CASTS.hook_pull = function (p, z) {
    const e = isT(G) ? N.ahead(p, z, 160) : null, n0 = z.shots.length, r = _hp.apply(this, arguments);
    if (!isT(G)) return r;
    const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 20 && s.render), dir = p.face, tx = e ? e.x : p.x + dir * 120;
    if (v) v.render = (ctx, x, y, t) => {
      const k = t < 8 ? ease(t / 8) : 1 - (t - 8) / 12, [px, py] = hand(p), ex = px + Math.round((tx - p.x - dir * 8) * k);
      chain(ctx, px, py, ex, py, t < 8 ? 5 * (1 - k) : 0);   // taut as it reels
      sickle(ctx, ex + dir * 4, py - 2, 7, dir, { rot: t < 8 ? -0.6 + k * 0.6 : 0.4, glint: t >= 7 && t < 11 ? 1 - (t - 7) / 4 : 0 });
    };
    return r;
  };

  // ================= I: Iron Cyclone =================
  const _ic = CASTS.iron_cyclone;
  CASTS.iron_cyclone = function (p, z) {
    const n0 = z.shots.length, r = _ic.apply(this, arguments);
    if (!isT(G)) return r;
    const drv = z.shots.slice(n0).find(s => s.p === p && s.step);
    if (drv) {
      const _st = drv.step;
      drv.step = function (t) {
        const m = z.shots.length, out = _st.apply(this, arguments);
        z.shots.slice(m).forEach(s => { if (s instanceof Vis && s.life === 2 && s.render) { const a = t * 0.5; s.render = (ctx, x, y) => {
          const cy = y - 24;
          for (let i = 1; i <= 3; i++) { const b = a - i * 0.35; ctx.save(); ctx.globalAlpha = 0.3 / i; chain(ctx, x, cy, x + Math.cos(b) * 60, cy + Math.sin(b) * 16, 0); ctx.restore(); }   // the smear of the whirl
          chain(ctx, x, cy, x + Math.round(Math.cos(a) * 60), cy + Math.round(Math.sin(a) * 16), 0);
          weight(ctx, x + Math.round(Math.cos(a) * 60), cy + Math.round(Math.sin(a) * 16), 4, { rot: a * 2 });
        }; } });
        if (t % 3 === 0) { const a = t * 0.5; part(p.x + Math.cos(a) * 58, p.y - 2, C.dust, Math.cos(a) * 1.5, -rand(0.5, 1.5), 14, 2, 0.1); }   // dust thrown off the floor
        return out;
      };
    }
    return r;
  };

  // ================= S+I: Chain Drop =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.tarek;
  if (BU && BU.cast) {
    const _cd = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _cd.apply(this, arguments);
      if (!isT(G)) return r;
      const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 50 && s.render);
      if (v) {
        v.render = (ctx, x, y, t) => {
          const fall = Math.max(0, 1 - t / 12), R = t < 24 ? 22 : Math.max(8, 22 - (t - 24)), cy = y - 22 - Math.round(fall * 120);
          for (let j = 0; j < 3; j++) {   // three loops, the back half of each dimmer
            const ly = cy - 12 + j * 12, rr = R - j * 1.5;
            for (let half = 0; half < 2; half++) { ctx.save(); ctx.globalAlpha = half ? 1 : 0.55; const n = 12; for (let i = 0; i < n; i++) { const a0 = (half ? 0 : PI) + i / n * PI + t * 0.1, a1 = a0 + PI / n; chain(ctx, x + Math.cos(a0) * rr, ly + Math.sin(a0) * rr * 0.3, x + Math.cos(a1) * rr, ly + Math.sin(a1) * rr * 0.3, 0); } ctx.restore(); }
          }
          if (t >= 24 && t < 28) { ctx.save(); ctx.globalAlpha = 1 - (t - 24) / 4; art.ring(ctx, C.br2, x, cy, Math.round(R + 6)); ctx.restore(); }
        };
        const _tk = v.tick;
        v.tick = function (vv) { const out = _tk ? _tk.apply(this, arguments) : undefined; if (vv.t === 12 || vv.t === 24 || vv.t === 32 || vv.t === 44) clank(vv.x, vv.y - 22, vv.t === 44 ? 14 : 6); return out; };
      }
      return r;
    };
  }

  // ================= W+O: Chain Snare =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.tarek;
  if (SIG && SIG.cast) {
    const _cs = SIG.cast;
    SIG.cast = function (p, z) {
      const e = isT(G) ? N.nearest(z, p.x, p.y - 16, 170) : null, n0 = z.shots.length, r = _cs.apply(this, arguments);
      if (!isT(G)) return r;
      const ex = e ? e.x : p.x + p.face * 120, ey = e ? e.y - (e.h || 30) / 2 : p.y - 22;
      z.shots.slice(n0).forEach(s => {
        if (!s.paint || s.life !== 14) return;
        s.paint = (ctx, sx, sy, q) => {
          const k = q.t < 6 ? Math.min(1, q.t / 5) : (14 - q.t) / 8, tx = sx + (ex - p.x) * k, ty = sy + (ey - p.y + 22) * k;
          chain(ctx, sx, sy, tx, ty, 0);
          if (q.t >= 5 && q.t < 10) { for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2 + q.t; art.rect(ctx, i % 2 ? C.m : C.l, Math.round(tx + Math.cos(a) * 9), Math.round(ty + Math.sin(a) * 4), 2, 2); } }   // the weight snaps round them
          weight(ctx, Math.round(tx), Math.round(ty), 4, { rot: q.t * 0.8 });
        };
      });
      return r;
    };
  }

  // ================= the finisher, and the small auras =================
  function dressFin(p, z) {
    z.shots.forEach(s => {
      if (s.tarek || !s.paint || s.life !== 10 || !/#c9a227/.test(String(s.paint))) return;
      s.tarek = 1;
      const dir = p.face, len = 108;
      s.paint = (ctx, sx, sy, q) => { const k = q.t < 5 ? q.t / 4 : (10 - q.t) / 5, l = Math.round(len * Math.min(1, k)); chain(ctx, sx + dir * 8, sy, sx + dir * (8 + l), sy, q.t < 4 ? 4 : 0); weight(ctx, sx + dir * (8 + l), sy, 4, { rot: q.t }); if (q.t === 4 || q.t === 5) { ctx.save(); art.rect(ctx, C.br2, sx + dir * (8 + l) - 1, sy - 6, 3, 13); art.rect(ctx, C.br2, sx + dir * (8 + l) - 6, sy - 1, 13, 3); ctx.restore(); } };   // a brass flash at full length
    });
  }
  function aura(ctx, p, sx, sy) {
    const d = p.face;
    if (p.modeT > 0) {   // Long Reach: a coil of chain hangs from his shoulder and swings
      const fade = Math.min(1, p.modeT / 30), sw = Math.sin(p.t * 0.12) * 3 - (p.vx || 0) * 1.5;
      ctx.save(); ctx.globalAlpha = fade;
      chain(ctx, sx - d * 3, sy - 28, sx - d * 8 + sw, sy - 6, 0); chain(ctx, sx - d * 8 + sw, sy - 6, sx - d * 1 + sw * 0.6, sy - 14, 0);
      ctx.restore();
      weight(ctx, sx - d * 1 + Math.round(sw * 0.6), sy - 12, 2.5, { a: fade });
    }
    if (p.awakeT > 0) {   // Iron Coil: chain wound round his forearms; scrap at his feet
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = fade;
      for (const o of [-5, 5]) for (let i = 0; i < 3; i++) { art.rect(ctx, C.out, sx + o - 2, sy - 22 + i * 3, 4, 2); art.rect(ctx, i % 2 ? C.m : C.l, sx + o - 1, sy - 22 + i * 3, 2, 1); }
      for (let i = 0; i < 3; i++) { const j = Math.sin(p.t * 0.6 + i * 2) > 0.7 ? 1 : 0, x = sx - 8 + i * 8; art.rect(ctx, i % 2 ? C.br : C.m, x, sy - 2 - j, 3, 2); }
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isT(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isT(g || this.G) && z && z.shots) dressFin(this, z); return r; };

  // ================= W+I: Chain Prison: the cinematic finish =================
  const _cp = N.ULT && N.ULT.chain_prison;
  if (_cp) N.ULT.chain_prison = function (p, z, foes) {
    const r = _cp.apply(this, arguments);
    if (isT(G) && p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('tarek') >= 0) finale(p, z, T);
    }
    return r;
  };
  // (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100) chains come back in from the
  // edges and hook the target, the brass weight swings on its last length; on the blow they all haul taut and it is
  // slammed on an impact frame
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 16) return;
      const cy = sy - 18, A = [[-170, -70], [170, -60], [-140, 40], [150, 46], [-40, -150], [60, -150]];
      if (st < FIN) {
        const k = ease((st - 74) / 10);
        A.forEach(([dx, dy], i) => { const kk = clamp01(k * 1.4 - i * 0.07); chain(ctx, sx + dx, cy + dy, sx + dx + (-dx * 0.92) * kk, cy + dy + (-dy * 0.92) * kk, 10 * (1 - kk) + 4); });
        const sw = Math.sin(st * 0.35) * 0.9, wx = sx + Math.sin(sw) * 26, wy = cy - 40 + Math.cos(sw) * 26;   // the weight on its last length, swinging over them
        chain(ctx, sx, cy - 40, wx, wy, 0); weight(ctx, wx, wy, 7, { rot: st * 0.3 });
      } else {
        const k = (st - FIN) / 16, ik = (st - FIN) / 5, mono = ik < 0.5 ? '#ffffff' : undefined;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 43);
        A.forEach(([dx, dy]) => { ctx.save(); if (mono) { ctx.globalAlpha = 1; art.line(ctx, '#ffffff', Math.round(sx + dx), Math.round(cy + dy), sx, cy, 3); } else chain(ctx, sx + dx, cy + dy, sx + dx * 0.08, cy + dy * 0.08, 0, { a: 1 - ease((k - 0.5) / 0.5) }); ctx.restore(); });   // all taut
        weight(ctx, sx, cy + 14, 7, { mono, a: 1 - ease((k - 0.5) / 0.5) });
        if (st === FIN) { clank(T.x, T.y - 20, 24); for (let i = 0; i < 14; i++) part(T.x + rand(-20, 20), T.y - 2, C.dust, rand(-3, 3), -rand(1, 3), 20, 2, 0.12); }
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
