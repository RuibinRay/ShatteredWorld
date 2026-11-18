'use strict';
// Shattered Worlds — Corvin, the Crow Eye: the strongest counter fighter in the game (the user, 2026-11-17: "improve the
// crow guy, i want his moves range size to improve and his counter moves, replace a weakest current move with another
// counter, i want to make him the strongest counter hero of the game"). Loaded after the hero files; only adds and wraps.
//   S+U  CROW'S DUE replaces Scatter (his weakest move: 6 damage in the move lab). A stance that starts the moment it is
//        pressed and holds for almost a second: whatever strikes him (a blow, a shot, an unblockable, even a throw) hits a
//        crow instead. He takes nothing, reappears behind whoever did it and the flock tears through them (a launch, a
//        combo after it). A shot is answered from afar: the crows fly back at the shooter. If nothing comes, the energy
//        comes back. (Aldric's Oathkeeper still takes a quarter of the hit, misses throws and swings only forward.)
//   Mirage  his crow double now comes back every 6 s instead of 10, and the crows it leaves strike back.
//   Perfect guard  answered by crows too.
//   Reach   every move reaches further: Crow Volley and Murder of Crows fly about 1.5x as far and the volley hunts from
//        380 px (was 240); Black Flame finds its target 320 px out (was 200) and burns a wider patch; Moon Gaze opens over
//        anyone within 400 px (was 260) on a bigger eye; his combo finisher's crows fly further; his dagger reaches 14 px more.
// The Nightmare bot knows the stance (js/hardcore.js COUNTER_SLOT, js/hardcore-skill.js: nobody strikes into it).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, N = SW.ninja, V = SW.versus;
  if (!N || !D.heroes.corvin) return;
  const A = D.abilities, HR = D.heroes, C = D.combat, CASTS = SW.casts, Proj = SW.Proj, P = SW.Player.prototype, rand = SW.rand;
  const { hit, slide, ahead, nearest, floorY, pose, Later, Vis, sfx, TRAITS } = N;
  const CRW = ['#7209b7', '#e0c3fc', '#14101c'];
  const STANCE = 54, ID = 'crows_due';
  const CV = SW.corvin = { on: true, STANCE };

  // ---------- drawing ----------
  const crow = (ctx, x, y, d, t) => { const f = (t >> 2) % 2; art.rect(ctx, CRW[2], x - 4, y - 2, 8, 4); art.rect(ctx, CRW[2], x + d * 3, y - 4, 4, 4); art.rect(ctx, '#d8a020', x + d * 6 - (d < 0 ? 1 : 0), y - 3, 2, 1); art.rect(ctx, CRW[1], x + d * 4, y - 3, 1, 1); if (f) art.rect(ctx, CRW[2], x - 3, y - 7, 6, 4); else art.rect(ctx, CRW[2], x - 3, y + 2, 6, 3); art.rect(ctx, CRW[2], x - d * 7, y - 1, 3, 2); };
  const flock = (z, x, y, n) => { for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), s = rand(1.5, 4); z.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => crow(ctx, Math.round(sx + Math.cos(a) * s * t), Math.round(sy + Math.sin(a) * s * t - t * 0.5), Math.cos(a) >= 0 ? 1 : -1, t))); } };
  const isCorvin = (p, g) => { const gg = g || p.G || G; return !!(gg && gg.state && gg.state.hero === 'corvin'); };
  // homing crows from (x, y) at whoever is nearest: n of them, dmg each
  function crows(p, z, x, y, n, dmg, o) {
    o = o || {};
    for (let k = 0; k < n; k++) z.shots.push(new Proj({ x, y: y - k * 5, vx: (o.dir || p.face) * (o.v || 5.4), vy: (k - (n - 1) / 2) * 1.4, dmg, w: o.w || 18, h: o.h || 14, life: o.life || 120, ghost: true, kx: 1.2, stun: o.stun || 22, dir: o.dir || p.face, energy: true,
      render(ctx, xx, yy, pr) { crow(ctx, xx, yy, pr.vx >= 0 ? 1 : -1, pr.t); },
      think(g, zz) { const e = nearest(zz, this.x, this.y, o.hunt || 380); if (e && this.t > (o.lag || 6)) { const ax = e.x - this.x, ay = e.y - e.h / 2 - this.y, m = Math.hypot(ax, ay) || 1, sp = o.v || 5.4; this.vx += (ax / m * sp - this.vx) * 0.14; this.vy += (ay / m * sp - this.vy) * 0.14; } } }));
  }

  // ================= S+U: Crow's Due =================
  A[ID] = { name: "Crow's Due", input: 'S + U', cost: 50, dmg: 34, desc: 'Brace among your crows for a moment. Whatever strikes you, even a throw or a shot, hits a crow instead: you reappear behind whoever did it and the flock tears through them. Nothing comes? The energy comes back.' };
  HR.corvin.kit[1] = ID;
  // it starts the moment it is pressed (no cast wind-up): a counter that came late would be no counter
  const ES = SW.elements;
  if (ES && ES.skill) {
    const _sk = ES.skill;
    ES.skill = function (p, alt) {
      if (!(CV.on && alt && G.state && G.state.hero === 'corvin' && G.has(ID))) return _sk.apply(this, arguments);
      if (p.riposteT > 0) return true;
      if (!p.spend(A[ID].cost)) return true;
      p.riposteT = STANCE; p.riposteD = Math.round(A[ID].dmg * p.skillMul()); p.crowDue = true;
      p.enter('cast'); p.st = 2; p.castFn = null; pose(p, 'guard', 0, 12);
      sfx('perfect'); flock(G.zone, p.x, p.y - 18, 6); fx.ring(p.x, p.y - 18, CRW[1], 26, 6, 14); fx.text(p.x, p.y - 50, "CROW'S DUE", CRW[1]);
      return true;
    };
  }
  CASTS[ID] = (p) => { p.riposteT = STANCE; p.crowDue = true; };   // anything that casts it by id (Rue copying it) gets the stance
  // the counter itself, in Corvin's own turn (his zone, his foes)
  function answer(p, g, srcX, far, grab) {
    const z = g.zone, dmg = p.riposteD || Math.round(A[ID].dmg * p.skillMul());
    p.riposteT = 0; p.crowDue = false;
    const vf = g.scene === 'vs' && V && V.f ? V.f.find(x => x.p !== p) : null;
    const foe = vf ? vf.p : nearest(z, srcX === undefined ? p.x : srcX, p.y - 16, 420);
    flock(z, p.x, p.y - 18, 14); sfx('dash'); fx.flash(CRW[0], 4);
    if (!foe || far) {   // a shot: the flock flies back at the shooter
      fx.text(p.x, p.y - 50, 'THE CROWS RETURN', CRW[1]);
      p.iframes = Math.max(p.iframes, 12);
      crows(p, z, p.x + p.face * 8, p.y - 24, 4, Math.round(dmg * 0.4), { v: 6.4, life: 140, hunt: 600, lag: 2, stun: 30, dir: foe ? Math.sign(foe.x - p.x) || p.face : p.face });
      return;
    }
    // behind the attacker, facing it, and the whole flock through it
    const side = Math.sign(foe.x - p.x) || p.face;
    p.x = foe.x; p.vx = 0; p.vy = 0; slide(p, z, side, 26);
    p.face = -side; p.iframes = Math.max(p.iframes, 26); p.enter('idle'); pose(p, 'a4', 1, 14);
    flock(z, p.x, p.y - 18, 10); fx.text(p.x, p.y - 50, grab ? "CROW'S DUE - NO THROW" : "CROW'S DUE", CRW[1]); fx.shake(5, 10);
    const fb = () => (foe.box ? foe.box() : { x: foe.x - 8, y: foe.y - 32, w: 16, h: 32 });
    const b = fb();
    fx.slash(b.x + b.w / 2, b.y + b.h / 2, -side, 2, CRW[1], 56); fx.slash(b.x + b.w / 2, b.y + b.h / 2, side, 3, '#c1121f', 48);
    hit(b.x - 18, b.y - 10, b.w + 36, b.h + 14, dmg, { kx: -side * 2.4, ky: -6.6, launch: true, stun: 44, heavy: true, srcX: p.x, quiet: false });
    // the rest of the flock keeps pecking on the way up: room for a combo after it
    [8, 16].forEach(n => z.shots.push(new Later(n, (gg, zz) => { if (foe.dead) return; const c = fb(); flock(zz, c.x + c.w / 2, c.y + c.h / 2, 4); hit(c.x - 10, c.y - 10, c.w + 20, c.h + 20, Math.max(1, Math.round(dmg * 0.18)), { kx: 0, ky: -2.4, stun: 30, srcX: c.x + c.w / 2 }); })));
  }
  CV.answer = answer;
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const gg = g || this.G;
    if (CV.on && this.crowDue && this.riposteT > 0 && !this.dead && atk && !(gg.busy && gg.busy()) && isCorvin(this, gg)) {
      const sx = atk.srcX === undefined ? this.x + this.face : atk.srcX, foe = gg.scene === 'vs' && V && V.f ? (V.f.find(x => x.p !== this) || {}).p : null;
      const far = foe ? Math.abs(foe.x - this.x) > 130 || Math.abs(foe.y - this.y) > 70 : Math.abs(sx - this.x) > 130;
      answer(this, gg, sx, far, false);
      return 'block';
    }
    const r = _th.apply(this, arguments);
    // a perfect guard is answered by crows too
    if (CV.on && r === 'perfect' && isCorvin(this, gg) && gg.zone) crows(this, gg.zone, this.x + this.face * 8, this.y - 24, 2, Math.max(1, Math.round(8 * this.skillMul())), { v: 6, life: 90, lag: 2 });
    return r;
  };
  // a throw does not go through takeHit (js/throw.js grabs whoever is in reach): in the stance, the grab finds only crows
  // (he is untouchable for that frame) and he answers it in his own turn
  const _hit = P.hit;
  P.hit = function (def) {
    if (CV.on && def && def.grab && G.scene === 'vs' && V && V.f) {
      const f = V.f.find(x => x.p !== this), q = f && f.p;
      if (q && q.crowDue && q.riposteT > 0 && f.hero === 'corvin' && Math.abs(q.x - this.x) < 50 && q.onGround) {
        const keep = q.iframes; q.iframes = 1;
        try { return _hit.apply(this, arguments); } finally { q.iframes = keep; q.crowGrab = this.x; }
      }
    }
    return _hit.apply(this, arguments);
  };
  const _up = P.update;
  P.update = function (g, z) {
    if (this.crowGrab !== undefined && this.crowDue && this.riposteT > 0 && isCorvin(this, g)) { const sx = this.crowGrab; this.crowGrab = undefined; answer(this, g, sx, false, true); }
    else this.crowGrab = undefined;
    if (this.crowDue && !(this.riposteT > 0)) this.crowDue = false;
    const due = this.crowDue;
    const r = _up.apply(this, arguments);
    // nothing came: the energy comes back (heroes4.js gives it back in the story; Versus settles energy itself, so it
    // goes in as this frame's bonus)
    if (due && this.crowDue && !(this.riposteT > 0)) { this.crowDue = false; if (g.scene === 'vs' && V && V.cur && V.cur.p === this) V.cur.bonus += 25; }
    if (this.crowDue && this.riposteT > 0 && SW.frame % 5 === 0 && g.zone) flock(g.zone, this.x + rand(-10, 10), this.y - rand(8, 30), 1);   // crows circling him while it holds
    return r;
  };

  // ================= Mirage: every 6 s, and the crows strike back =================
  const MIR = TRAITS && TRAITS.mirage;
  if (MIR && MIR.hurt) {
    const _mh = MIR.hurt;
    MIR.hurt = function (p, atk) {
      const r = _mh.apply(this, arguments);
      if (r === 'none' && CV.on) {
        p.mirT = SW.frame - 240;   // the trait waits 600 frames from mirT: 360 now (6 s)
        const g = p.G || G, z = g.zone;
        if (z) crows(p, z, p.x, p.y - 24, 3, Math.max(1, Math.round(9 * p.skillMul())), { v: 6, life: 100, lag: 2, dir: p.face });
      }
      return r;
    };
  }
  A.crow_volley.desc = 'Three crows fly out and hunt the nearest enemy. Once every six seconds, a hit that would land on you meets a crow instead, you reappear a few steps away and the crows strike back.';

  // ================= reach =================
  // U: Crow Volley, further and wider, and it hunts from 380 px
  CASTS.crow_volley = function (p, z, dmg) {
    sfx('swing'); pose(p, 'a4', 1, 10);
    crows(p, z, p.x + p.face * 10, p.y - 20, 3, dmg, { v: 5.2, life: 120, hunt: 380, w: 16, h: 14, stun: 20 });
  };
  // I: Black Flame, found 320 px out, a wider and taller patch of fire
  CASTS.black_flame = function (p, z, dmg) {
    const e = ahead(p, z, 320), x0 = e ? e.x : p.x + p.face * 110, gy = floorY(z, x0, p.y - 20); sfx('burst'); pose(p, 'cast', 1, 16);
    z.shots.push(new Vis(x0, gy, 150, (ctx, x, y, t) => {
      const k = Math.min(1, t / 8, (150 - t) / 16);
      for (let i = 0; i < 12; i++) { const hh = Math.round((16 + Math.abs(Math.sin(t * 0.3 + i * 1.3)) * 26) * k); art.rect(ctx, i % 2 ? CRW[2] : '#2a0a3a', x - 24 + i * 4, y - hh, 4, hh); art.rect(ctx, CRW[0], x - 24 + i * 4 + 1, y - hh, 2, 2); }
      art.glow(ctx, x, y - 18, 30, CRW[0], 0.1 * k);
    }, v => { if (e && !e.dead && v.t < 70) v.x += (e.x - v.x) * 0.15; if (v.t % 15 === 5) hit(v.x - 28, v.y - 56, 56, 58, dmg, { ky: -1, kx: 0, stun: 20, status: { burn: 2 }, srcX: v.x }); }));
  };
  // S+I: Moon Gaze, over anyone within 400 px, a bigger eye
  const BURST = SW.moves && SW.moves.BURST;
  if (BURST && BURST.corvin) BURST.corvin.cast = function (p, z, dmg) {
    const e = nearest(z, p.x, p.y - 16, 400); sfx('perfect'); pose(p, 'cheer', 0, 18);
    const tgt = e || { x: p.x + p.face * 100, y: p.y, h: 34, dead: false };
    z.shots.push(new Vis(tgt.x, tgt.y - 60, 64, (ctx, x, y, t) => {
      const o = Math.min(1, t / 14), h = Math.max(1, Math.round(12 * o));
      art.rect(ctx, '#2a0a1a', x - 18, y - h / 2, 36, h); art.rect(ctx, '#ffffff', x - 16, y - h / 2 + 1, 32, Math.max(1, h - 2)); art.disc(ctx, '#c1121f', x, y, Math.max(1, Math.round(6 * o))); art.disc(ctx, '#14101c', x, y, Math.max(1, Math.round(2 * o)));
      art.glow(ctx, x, y, 30, '#c1121f', 0.12 * o);
    }, v => {
      if (e && !e.dead) { v.x = e.x; v.y = e.y - 64; }
      if (v.t === 18) { sfx('zap'); fx.flash('#3a0a1a', 6); hit(v.x - 26, v.y + 16, 52, 56, dmg, { ky: 0, kx: 0, stun: 60, status: { freeze: 70 }, srcX: v.x, unblockable: true }); }
      if (v.t === 50) { sfx('explode'); fx.ring(v.x, v.y + 44, '#c1121f', 4, 44, 12); hit(v.x - 28, v.y + 14, 56, 60, Math.round(dmg * 1.4), { ky: -5, stun: 40, heavy: true, srcX: v.x }); }
    }));
  };
  // W+O: Murder of Crows, ten crows that fly about 1.5x as far
  const SIG = SW.signature && SW.signature.SIG;
  if (SIG && SIG.corvin) SIG.corvin.cast = function (p, z, d) {
    sfx('shoot');
    for (let i = 0; i < 10; i++) z.shots.push(new Later(1 + i * 2, (g, zz) => zz.shots.push(new Proj({ x: p.x + p.face * 8, y: p.y - 22 + rand(-12, 10), vx: p.face * rand(4.4, 6), vy: rand(-0.8, 0.8), life: 58, w: 14, h: 12, dmg: d, ghost: true, kx: p.face * 0.8, stun: 10, energy: true,
      render(ctx, x, y, s) { crow(ctx, x, y, s.vx >= 0 ? 1 : -1, s.t); } }))));
  };
  // the J combo finisher: its three crows fly further
  const FIN = SW.clanmelee && SW.clanmelee.FIN;
  if (FIN && FIN.corvin) FIN.corvin = function (p, z, d) {
    sfx('shoot');
    [-1.1, 0, 1.1].forEach((vy, i) => z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 24 + i * 4, vx: p.face * 5.6, vy, life: 40, w: 14, h: 12, dmg: Math.max(1, Math.round(d * 0.45)), ghost: true, kx: p.face, stun: 20,
      render(ctx, x, y, s) { crow(ctx, x, y, s.vx >= 0 ? 1 : -1, s.t); } })));
  };
  // his dagger: 14 px more reach on every J
  const ck = HR.corvin.combo;
  if (C[ck]) C[ck] = C[ck].map(a => (a.box ? Object.assign({}, a, { box: [a.box[0], a.box[1], a.box[2] + 14, a.box[3]] }) : a));

  // ================= the Nightmare bot =================
  const HC = SW.hardcore;
  if (HC && HC.counters) HC.counters.corvin = { slot: 'su', cost: A[ID].cost, name: A[ID].name };
})();
