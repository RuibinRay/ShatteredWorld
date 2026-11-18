'use strict';
// Shattered Worlds — cinematic ultimates for the twenty weakest heroes (the user, 2026-11-17, after a Hard and a Nightmare
// tournament at normal speed: "improve each of their ult like sen but less time, improve animation and zoom in, and their
// ult deals 50% of total life, and if before damage is higher then keep that"). Loaded after js/sen-stroke.js; only wraps.
// Each hero keeps its own ultimate (its hits and its look). Around it:
//   st 1-6      the hold: the opponent cannot act until the finishing blow (Versus)
//   st 30-62    CLOSE-UP on the hero, letterbox bars, the hero's name and the ultimate's
//   st 72-100   the camera pushes in on the target while the hero's element gathers on it, the world goes dark
//   st 100      the finishing blow in the hero's element: it takes the target to half of its full health in all (whatever
//               the ultimate dealt counts; if the ultimate already dealt more, the blow adds nothing and the higher stays)
//   st 100-124  the camera pulls back
// It runs 124 frames (every other ultimate: 71; Sen's: 230). SW.ultCinema.on = false turns it off.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, V = SW.versus, P = SW.Player && SW.Player.prototype, ui = SW.ui;
  const A = D.abilities, N = SW.ninja, K = SW.skillfx, W = SW.W, H = SW.H, rand = SW.rand, text = SW.text;
  if (!P || !N || !N.hurt || !SW.ultFx) return;
  // the twenty weakest in the two tournaments (Hard and Nightmare, 960 rounds each, both levels together)
  const HEROES = ['nami', 'tarek', 'sora', 'fumi', 'isolde', 'mako', 'rue', 'ryo', 'convergence', 'apis', 'thorne', 'nyra', 'lin', 'ivo', 'opal', 'moro', 'yara', 'brann', 'pyra', 'vesper'];
  const LEN = 124, FIN = 100, SHARE = 0.5;
  const UC = SW.ultCinema = { on: true, heroes: HEROES, LEN, FIN, SHARE };
  const on = g => UC.on && g && g.state && HEROES.indexOf(g.state.hero) >= 0;
  const sfx = n => SW.audio.sfx(n);
  const colsOf = g => { const st = K ? K.heroStyle(g) : 'impact'; return { st, c: (K && K.STYLE[st] ? K.STYLE[st].c : ['#ffffff', '#c8ccd8', '#8a92a8']) }; };
  const vsFoe = p => (G.scene === 'vs' && V && V.f && V.f.length === 2 ? V.f.find(f => f.p !== p) : null);
  function maxHp(f) { const keep = G.state; G.state = f.state; try { return f.p.hpMax(); } finally { G.state = keep; } }

  // ---------- the sequence, around the hero's own ultimate ----------
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    if (!on(g)) return _uf.apply(this, arguments);
    const st = p.st, f2 = vsFoe(p);
    if (st <= 1 || !p.ucine) p.ucine = { hp0: f2 ? f2.state.hp : null, hero: g.state.hero };
    const C = p.ucine;
    if (f2 && st < FIN) f2.stunT = Math.max(f2.stunT || 0, 3);   // held until the finishing blow
    // the hero's own ultimate runs as before for its first 72 frames
    const r = st < 72 ? _uf.apply(this, arguments) : true;
    const { st: style, c } = colsOf(g);
    const emit = (x, y, n, o) => { if (K) K.emit(style, x, y, n, o); };
    const T = f2 ? f2.p : foes.filter(e => !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    if (T && st >= 74 && st < FIN && st % 2 === 0) { const b = T.box ? T.box() : { x: T.x - 8, y: T.y - 32, w: 16, h: 32 }; emit(b.x + b.w / 2 + rand(-30, 30), b.y + b.h / 2 + rand(-30, 30), 1, { power: 0.4, spread: 0.2 }); }   // the element gathers on the target
    if (st === 74) sfx('charge');
    if (st === FIN - 6) { sfx('select'); fx.ring(p.x, p.y - 20, c[0], 40, 6, 12); }
    if (st === FIN) {
      fx.flash('#ffffff', 12); fx.shake(10, 18); sfx('explode'); sfx('perfect'); sfx('heavy');
      const targets = foes.filter(e => !e.dead);   // (in Versus the opponent's stand-in in this fighter's list: hits go through versus.js)
      targets.forEach(e => {
        if (!e || e.dead) return;
        const b = e.box ? e.box() : { x: e.x - 8, y: e.y - 32, w: 16, h: 32 }, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
        for (let i = 0; i < 5; i++) fx.slash(cx + rand(-8, 8), cy + rand(-10, 10), i % 2 ? 1 : -1, 1 + (i % 3), i % 2 ? c[0] : '#ffffff', 48);
        fx.ring(cx, cy, '#ffffff', 6, 84, 20); fx.ring(cx, cy, c[0], 4, 58, 16);
        for (let i = 0; i < 36; i++) emit(cx, cy, 1, { power: 2.2, spread: 1 });
        // the top-up: half of the target's full health in all, counting what the ultimate already did
        let add = 0;
        const fe = N.fighterOf ? N.fighterOf(e) : null;
        if (fe && C.hp0 !== null) {
          const want = Math.round(maxHp(fe) * SHARE), dealt = Math.max(0, C.hp0 - fe.state.hp);
          add = Math.max(0, want - dealt) / ((V.tune && V.tune[C.hero]) || 1);   // the Versus balance table multiplies every hit by the hero's entry
          fe.p.juggle = 0;
        }
        N.hurt(e, Math.max(1, Math.round(add)), { unblockable: true, heavy: true, ky: -6, launch: true, down: true, stun: 50, kx: (Math.sign(e.x - p.x) || p.face) * 2, srcX: p.x });
      });
    }
    if (st > FIN && st < LEN && st % 3 === 0) emit(G.cam.x + rand(0, W), G.cam.y + rand(0, 50), 1, { spread: 0.3, power: 0.3 });
    return r;
  };
  // it lasts LEN frames (actors.js ends every ultimate at 72)
  const _up = P.update;
  P.update = function (g, z) {
    const was = this.state === 'ult' && this.ucine && on(g), st0 = this.st;
    const r = _up.apply(this, arguments);
    if (was && this.state !== 'ult' && !this.dead && st0 + 1 < LEN && this.state !== 'hurt') { this.state = 'ult'; this.st = st0 + 1; }
    if (this.state !== 'ult' && this.ucine) this.ucine = null;
    return r;
  };
  // the finishing blow's pose: a strike, then the hero's own victory pose
  let POSE = null;
  const _ad = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    if (POSE && id === POSE[0]) { const s = art.sheets[id]; if (s && s.anims && s.anims[POSE[1]]) { anim = POSE[1]; fi = POSE[2]; } POSE = null; }
    return _ad.call(this, ctx, id, anim, fi, x, y, flip, o);
  };
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    if (this.state === 'ult' && this.ucine && on(g)) {
      const st = this.st, s = st >= 72 && st < FIN - 6 ? ['charge', (this.t >> 2) % 2] : st >= FIN - 6 && st < FIN + 10 ? ['special', st < FIN ? 0 : st < FIN + 4 ? 1 : 2] : null;
      if (s) POSE = [this.sheet(), s[0], s[1]];
    }
    try { return _pd.apply(this, arguments); } finally { POSE = null; }
  };

  // ---------- the camera ----------
  const tmp = document.createElement('canvas'), tctx = tmp.getContext('2d');
  const ease = t => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
  function zoomAt(st) {   // { z: how close (1 normal), bars: letterbox 0-1, on: 'hero' | 'target' }
    if (st >= 30 && st < 62) return { z: 1 + 1.0 * ease((st - 30) / 8) * (1 - ease((st - 55) / 7)), bars: ease((st - 28) / 5) * (1 - ease((st - 57) / 5)), on: 'hero' };
    if (st >= 72 && st < FIN) return { z: 1 + 1.3 * ease((st - 74) / 12), bars: ease((st - 72) / 6), on: 'target' };
    if (st >= FIN && st < FIN + 18) return { z: 1 + 0.6 * (1 - ease((st - FIN) / 16)), bars: 1 - ease((st - FIN - 4) / 12), on: 'target' };
    return { z: 1, bars: 0 };
  }
  UC.zoomAt = zoomAt;
  function caster() {
    if (G.scene === 'vs' && V && V.f && V.phase === 'fight') { const f = V.f.find(x => HEROES.indexOf(x.hero) >= 0 && x.p.state === 'ult' && x.p.ucine); return f ? { p: f.p, hero: f.hero } : null; }
    if (G.scene === 'play' && G.state && HEROES.indexOf(G.state.hero) >= 0 && G.player && G.player.state === 'ult' && G.player.ucine) return { p: G.player, hero: G.state.hero };
    return null;
  }
  let shot = false;
  const Z = SW.Zone && SW.Zone.prototype;
  if (Z && Z.draw) {
    const _zd = Z.draw;
    Z.draw = function (ctx) {
      const r = _zd.apply(this, arguments);
      const c0 = UC.on && caster(); shot = false;
      if (c0 && zoomAt(c0.p.st).z > 1.01) {
        const c = ctx.canvas;
        if (tmp.width !== c.width || tmp.height !== c.height) { tmp.width = c.width; tmp.height = c.height; }
        tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, c.width, c.height); tctx.drawImage(c, 0, 0); shot = true;
      }
      return r;
    };
  }
  function post(ctx) {
    const cs = UC.on && caster(); if (!cs) { shot = false; return; }
    const p = cs.p, st = p.st, c = ctx.canvas, k = c.width / W, zm = zoomAt(st), h = D.heroes[cs.hero];
    const f2 = vsFoe(p), T = f2 ? f2.p : null;
    if (zm.z > 1.01 && shot) {
      // the world goes dark before the blow (drawn into the scene, so it is pushed in with it)
      if (st >= 76 && st < FIN) { tctx.save(); tctx.setTransform(k, 0, 0, k, 0, 0); tctx.globalAlpha = 0.4 * ease((st - 76) / 10); art.rect(tctx, '#05060c', 0, 0, W, H); tctx.restore(); }
      const fx0 = zm.on === 'target' && T ? T.x : p.x, fy0 = (zm.on === 'target' && T ? T.y : p.y) - 22;   // the target is often knocked away by then: follow it
      const sw = c.width / zm.z, sh = c.height / zm.z, tx = fx0 - G.cam.x, ty = fy0 - G.cam.y;
      const sx = SW.clamp(tx * k - sw / 2, 0, c.width - sw), sy = SW.clamp(ty * k - sh * 0.5, 0, c.height - sh);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(tmp, sx, sy, sw, sh, 0, 0, c.width, c.height); ctx.restore();
    }
    shot = false;
    if (zm.bars > 0.01) {
      ctx.save(); ctx.setTransform(k, 0, 0, k, 0, 0);
      const bh = Math.round(30 * zm.bars), u = A[h.ultimate];
      art.rect(ctx, '#000000', 0, 0, W, bh); art.rect(ctx, '#000000', 0, H - bh, W, bh);
      ctx.globalAlpha = zm.bars;
      if (st >= 32 && st < 60) { text(ctx, h.name.toUpperCase(), W / 2, H - 25, h.colorHi || '#ffffff', { align: 'center' }); if (u) text(ctx, u.name.toUpperCase(), W / 2, H - 14, '#ffffff', { align: 'center' }); }
      ctx.restore();
    }
  }
  if (V && V.draw) {
    const _vd = V.draw;
    V.draw = function (ctx) {
      const cs = UC.on && caster(), f2 = cs ? vsFoe(cs.p) : null, keep = f2 ? f2.stunT : 0;
      if (f2) f2.stunT = 0;   // the hold uses the stun timer: no "stunned" stars over the target
      let r;
      try { r = _vd.apply(this, arguments); } finally { if (f2) f2.stunT = keep; }
      try { post(ctx); } catch (e) { console.error(e); }
      return r;
    };
  }
  if (ui && ui.hud) { const _hud = ui.hud; ui.hud = function (ctx, g) { const r = _hud.apply(this, arguments); if (g && g.scene === 'play') { try { post(ctx); } catch (e) { console.error(e); } } return r; }; }
})();
