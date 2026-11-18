'use strict';
// Shattered Worlds — Sen's ultimate, THE SINGLE STROKE, as the strongest ultimate in the game (the user, 2026-11-17: "sen is
// going to have the strongest ult in the game and the best animation and longest duration, highest damage, improved
// animation and even close up when he use it"). Loaded after the hero files and the ultimate effects; only wraps.
// Before: three passes and one cut, 71 frames like every ultimate, 180 damage (Itsuki's was the highest, 355).
// Now it runs 230 frames (every other ultimate: 71) and takes 77% of the target's full health (the user, 2026-11-17: "reduce
// the ult damage a bit, lets say it takes 77% of total life"; it was about 420, more than a fighter's whole bar):
//   st 14        the breath: an eye-flash seizes everyone on screen (Versus: the opponent cannot act until the end)
//   st 30-70     CLOSE-UP 1: the camera pushes in on Sen, letterbox bars, his hand on the hilt, a glint in his eye
//   st 72-149    eight passes across the screen, each leaving afterimages and a cut that hangs in the air on the target
//   st 160-187   behind them, back turned, he sheathes the blade. CLOSE-UP 2 on the sheath. "...click."
//   st 188       every cut arrives at once: a stroke that splits the screen, a storm of petals, a launch
//   st 188-230   the camera pulls back; petals fall; his victory pose
// Its hits cannot be guarded, and before the final stroke they never take the last point of health (the fight always
// gets to see the stroke). SW.senStroke.on = false gives back the old ultimate.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, V = SW.versus, P = SW.Player && SW.Player.prototype, ui = SW.ui;
  const A = D.abilities, N = SW.ninja, K = SW.skillfx, W = SW.W, H = SW.H, rand = SW.rand, text = SW.text;
  if (!P || !A.single_stroke || !N || !N.hurt) return;
  const LEN = 230, SEIZE = 14, PASS0 = 72, PASSES = 8, GAP = 11, SHEATHE = 160, CUT = 188;
  // Versus: each hit is a share of the opponent's full health (3% + 8 x 4.5% + 38% = 77%). A story enemy has no such bar
  // to measure against, so there it is in units of the ultimate's base damage (16 x his skill multiplier), the same
  // 10.5 units that 77% of a fighter's health comes to
  const SHARE = { seize: 0.03, pass: 0.045, cut: 0.38 }, U = { seize: 0.3, pass: 0.45, cut: 6.6 };
  const SS = SW.senStroke = { on: true, LEN, U, SHARE, total: 0.77 };
  const PINK = '#ffa0c0', PALE = '#ffe4ee';
  const sfx = n => SW.audio.sfx(n);
  const isSen = g => !!(g && g.state && g.state.hero === 'sen');
  const inStroke = p => SS.on && p && !p.dead && p.state === 'ult' && p.senStroke;
  if (SW.ultMotion && SW.ultMotion.skip) SW.ultMotion.skip.sen = 1;   // he moves through his own poses (below)
  A.single_stroke.desc = 'a breath that holds everyone still, eight passes nobody sees, the blade sheathed, and then every cut arrives at once.';

  // ---------- who is being cut ----------
  const vsFoe = p => (G.scene === 'vs' && V && V.f && V.f.length === 2 ? V.f.find(f => f.p !== p) : null);
  // health left on a target (Versus fighter or story enemy), so a pass never takes the last point
  function hpOf(e) { const f = N.fighterOf ? N.fighterOf(e) : null; return f ? f.state.hp : e.hp; }
  // a fighter's full health, read in its own context (hpMax depends on whose state is current)
  function maxHp(f) { const keep = G.state; G.state = f.state; try { return f.p.hpMax(); } finally { G.state = keep; } }
  // (the final stroke takes what is left of the 77%, so rounding on the way does not add up past it)
  function amount(p, e, part, u) {
    const f = N.fighterOf ? N.fighterOf(e) : null;
    if (!f) return Math.round(u * U[part]);
    const m = maxHp(f), r = k => Math.round(m * SHARE[k]);
    return part === 'cut' ? Math.round(m * SS.total) - r('seize') - PASSES * r('pass') : r(part);
  }
  function cut(p, e, dmg, o, lethal) {
    const f = N.fighterOf ? N.fighterOf(e) : null;
    if (f) f.p.juggle = 0;   // the game's juggle limit (versus.js) would end it early
    if (!lethal) { const hp = hpOf(e); if (hp !== undefined) dmg = Math.max(0, Math.min(dmg, Math.floor(hp) - 1)); }
    if (dmg <= 0) { if (e.stagger) e.stagger(36); return; }
    N.hurt(e, dmg, Object.assign({ unblockable: true, heavy: true, stun: 36, srcX: p.x }, o));
  }

  // ---------- the sequence ----------
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    if (!SS.on || !isSen(g)) return _uf.apply(this, arguments);
    if (p.st <= 1) { p.senStroke = { cuts: [], tgt: null, side: p.face }; return _uf.apply(this, arguments); }   // the splash cut-in and the held breath (heroes3.js)
    const S = p.senStroke || (p.senStroke = { cuts: [], tgt: null, side: p.face }), st = p.st, u = Math.round(A.single_stroke.dmg * p.specMul());
    const style = K ? K.heroStyle(g) : 'petal', emit = (x, y, n, o) => { if (K) K.emit(style, x, y, n, o); };
    const live = foes.filter(e => !e.dead);
    if (!S.tgt || S.tgt.dead) S.tgt = live.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0] || null;
    const T = S.tgt, f2 = vsFoe(p);
    // the opponent is held for the whole stroke
    if (f2 && st >= SEIZE && st < CUT) f2.stunT = Math.max(f2.stunT || 0, 3);
    if (!f2 && st >= SEIZE && st < CUT && st % 20 === 0) live.forEach(e => { if (e.stagger && !e.isBoss) e.stagger(30); });
    const camL = G.cam.x + 18, camR = G.cam.x + W - 18, zw = (g.zone && g.zone.pw) || 9999, clampX = x => SW.clamp(x, Math.max(14, camL), Math.min(zw - 14, camR));
    if (st === 8) { sfx('charge'); fx.ring(p.x, p.y - 20, PALE, 30, 4, 20); }
    if (st === SEIZE) {   // the breath: an eye-flash
      sfx('perfect'); fx.flash(PALE, 6); fx.ring(p.x, p.y - 26, '#ffffff', 4, 120, 18);
      live.forEach(e => { fx.ring(e.x, e.y - 18, PINK, 30, 6, 14); cut(p, e, amount(p, e, 'seize', u), { ky: 0, kx: 0, stun: 60 }); });
    }
    if (st > 16 && st < 70 && st % 3 === 0) emit(p.x + rand(-40, 40), p.y - rand(0, 60), 1, { up: true, spread: 0.6, power: 0.5 });   // petals gathering
    // the eight passes
    if (st >= PASS0 && st < PASS0 + PASSES * GAP && (st - PASS0) % GAP === 0) {
      const k = (st - PASS0) / GAP, side = k % 2 ? -1 : 1, tx = T ? T.x : p.x + p.face * 60;
      const x0 = clampX(tx - side * 110), x1 = clampX(tx + side * 110), y = p.y - 20;
      sfx('dash'); if (k % 2) sfx('swing');
      for (let i = 0; i <= 8; i++) fx.ghost(p.sheet(), 'dash', 0, x0 + (x1 - x0) * i / 8, p.y, side < 0);
      fx.list.push({ k: 'b', pts: [[x0, y + rand(-6, 6)], [x1, y + rand(-6, 6)]], col: k % 2 ? PINK : '#ffffff', life: 10, max: 10 });
      p.x = x1; p.face = -side;
      for (let i = 0; i < 6; i++) emit(x0 + (x1 - x0) * Math.random(), y + rand(-10, 10), 1, { spread: 0.8, power: 0.8 });
      live.forEach(e => {
        const ang = rand(-0.9, 0.9) + (k % 2 ? Math.PI / 2 : 0);
        S.cuts.push({ e, a: ang, l: rand(16, 30), dx: rand(-5, 5), dy: rand(-8, 8) });
        fx.slash(e.x, e.y - e.h / 2, side, 1 + (k % 3), k % 2 ? PINK : '#ffffff', 34);
        cut(p, e, amount(p, e, 'pass', u), { ky: -0.6, kx: 0, stun: 36 });
      });
      fx.shake(3, 4);
    }
    // behind them, back turned, sheathing
    if (st === SHEATHE) {
      const tx = T ? T.x : p.x, side = p.x >= tx ? 1 : -1;
      S.side = side; p.x = clampX(tx + side * 44); p.face = side;   // facing away
      sfx('back'); for (let i = 0; i < 10; i++) emit(p.x + rand(-6, 6), p.y - rand(0, 36), 1, { spread: 0.3, power: 0.3 });
    }
    if (st === CUT - 8) sfx('select');
    if (st === CUT) {   // ...click. Every cut, at once
      fx.flash('#ffffff', 16); fx.shake(12, 22); sfx('explode'); sfx('perfect'); sfx('heavy');
      S.split = { t0: st };
      live.forEach(e => {
        const b = e.box ? e.box() : { x: e.x - 8, y: e.y - 32, w: 16, h: 32 }, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
        for (let i = 0; i < 6; i++) fx.slash(cx + rand(-8, 8), cy + rand(-10, 10), i % 2 ? 1 : -1, 1 + (i % 3), i % 2 ? PINK : '#ffffff', 50);
        fx.ring(cx, cy, '#ffffff', 6, 90, 22); fx.ring(cx, cy, PINK, 4, 60, 18);
        for (let i = 0; i < 40; i++) emit(cx, cy, 1, { power: 2.2, spread: 1 });
        cut(p, e, amount(p, e, 'cut', u), { ky: -7, kx: -S.side * 2, launch: true, down: true, stun: 50 }, true);
      });
      S.cuts.length = 0;
    }
    if (st > CUT && st < LEN && st % 2 === 0) emit(G.cam.x + rand(0, W), G.cam.y + rand(0, 40), 1, { spread: 0.3, power: 0.3 });   // petals falling
    return true;
  };
  // it lasts LEN frames: actors.js ends every ultimate at 72; keep his going
  const _up = P.update;
  P.update = function (g, z) {
    const was = this.state === 'ult' && this.senStroke && SS.on && isSen(g), st0 = this.st;
    const r = _up.apply(this, arguments);
    if (was && this.state !== 'ult' && !this.dead && st0 + 1 < LEN && this.state !== 'hurt') { this.state = 'ult'; this.st = st0 + 1; }
    if (this.state !== 'ult' && this.senStroke) this.senStroke = null;
    return r;
  };

  // ---------- his poses ----------
  function poseAt(p) {
    const st = p.st;
    if (st < 14) return ['charge', (p.t >> 2) % 2];
    if (st < 72) return ['guard', 0];                                   // hand on the hilt, the breath
    if (st < PASS0 + PASSES * GAP) { const ph = (st - PASS0) % GAP; return ph < 3 ? ['special', 1] : ph < 6 ? ['special', 2] : ['dash', 0]; }
    if (st < SHEATHE) return ['dash', 0];
    if (st < CUT - 6) return ['guard', 0];                              // back turned, sliding the blade home
    if (st < CUT + 4) return ['cast', 1];
    if (st < CUT + 22) return ['a3', 2];
    return null;                                                        // his own victory pose (herostyle.js)
  }
  let POSE = null;
  const _ad = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    if (POSE && id === POSE[0]) { const s = art.sheets[id]; if (s && s.anims && s.anims[POSE[1]]) { anim = POSE[1]; fi = POSE[2]; } POSE = null; }
    return _ad.call(this, ctx, id, anim, fi, x, y, flip, o);
  };
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = inStroke(this) && isSen(g), s = on ? poseAt(this) : null;
    if (s) POSE = [this.sheet(), s[0], s[1]];
    // between passes he is not quite there
    const flick = on && this.st >= PASS0 && this.st < SHEATHE && (this.st - PASS0) % GAP > 7;
    try {
      if (flick) { ctx.globalAlpha = 0.35; }
      return _pd.apply(this, arguments);
    } finally {
      ctx.globalAlpha = 1; POSE = null;
      if (on && this.st >= 46 && this.st <= 58) {   // the glint in his eye
        const x = Math.round(this.x - cam.x) + this.face * 3, y = Math.round(this.y - cam.y) - 30, k = 1 - Math.abs(this.st - 52) / 6;
        ctx.globalAlpha = Math.max(0, k); art.rect(ctx, '#ffffff', x - 3, y, 7, 1); art.rect(ctx, '#ffffff', x, y - 3, 1, 7); ctx.globalAlpha = 1;
      }
    }
  };

  // ---------- the camera: close-ups, letterbox, the dark before the stroke ----------
  const tmp = document.createElement('canvas'), tctx = tmp.getContext('2d', { willReadFrequently: false });
  const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
  // how close the camera is at frame st (1 = normal), and how wide the letterbox bars are (0-1)
  function zoomAt(st) {
    if (st >= 30 && st < 70) return { z: 1 + 1.2 * ease((st - 30) / 10) * (1 - ease((st - 62) / 8)), bars: ease((st - 28) / 6) * (1 - ease((st - 64) / 6)) };
    if (st >= 160 && st < CUT) return { z: 1 + 1.6 * ease((st - 162) / 12), bars: ease((st - 160) / 6) };
    if (st >= CUT && st < CUT + 18) return { z: 1 + 0.6 * (1 - ease((st - CUT) / 16)), bars: 1 - ease((st - CUT - 4) / 12) };
    return { z: 1, bars: 0 };
  }
  function senInStroke() {
    if (G.scene === 'vs' && V && V.f && V.phase === 'fight') { const f = V.f.find(x => x.hero === 'sen' && inStroke(x.p)); return f ? f.p : null; }
    if (G.scene === 'play' && G.state && G.state.hero === 'sen' && inStroke(G.player)) return G.player;
    return null;
  }
  // what is drawn over the scene: the dark before the stroke, the cuts hanging in the air, the stroke that splits the screen
  function overlays(c2, p) {
    const st = p.st, S = p.senStroke || {};
    if (st >= SHEATHE - 8 && st < CUT) { c2.globalAlpha = 0.45 * ease((st - SHEATHE + 8) / 10); art.rect(c2, '#140410', 0, 0, W, H); c2.globalAlpha = 1; }
    if (S.cuts && S.cuts.length && st < CUT) {
      const glow = st >= SHEATHE ? 0.7 + 0.3 * Math.sin(st * 0.6) : 0.55;
      for (const q of S.cuts) {
        if (q.e.dead) continue;
        const x = q.e.x - G.cam.x + q.dx, y = q.e.y - (q.e.h || 30) / 2 - G.cam.y + q.dy, dx = Math.cos(q.a) * q.l / 2, dy = Math.sin(q.a) * q.l / 2;
        c2.globalAlpha = glow; art.line(c2, PINK, Math.round(x - dx), Math.round(y - dy), Math.round(x + dx), Math.round(y + dy), 2);
        c2.globalAlpha = Math.min(1, glow + 0.2); art.line(c2, '#ffffff', Math.round(x - dx * 0.8), Math.round(y - dy * 0.8), Math.round(x + dx * 0.8), Math.round(y + dy * 0.8), 1);
      }
      c2.globalAlpha = 1;
    }
    if (S.split && st - S.split.t0 < 22) {
      const t = st - S.split.t0, a = 1 - t / 22, w = 2 + t * 3;
      c2.globalAlpha = a; art.line(c2, '#ffffff', -10, H * 0.78, W + 10, H * 0.22, Math.max(1, Math.round(w / 3)));
      c2.globalAlpha = a * 0.6; art.line(c2, PINK, -10, H * 0.78 + 3, W + 10, H * 0.22 + 3, Math.max(1, Math.round(w / 2)));
      c2.globalAlpha = 1;
    }
  }
  // the scene (stage, fighters, effects) before the health bars and skill pips go on top: kept for the close-up
  let shot = false;
  const Z = SW.Zone && SW.Zone.prototype;
  if (Z && Z.draw) {
    const _zd = Z.draw;
    Z.draw = function (ctx) {
      const r = _zd.apply(this, arguments);
      const p = senInStroke();
      shot = false;
      if (p && zoomAt(p.st).z > 1.01) {
        const c = ctx.canvas;
        if (tmp.width !== c.width || tmp.height !== c.height) { tmp.width = c.width; tmp.height = c.height; }
        tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, c.width, c.height); tctx.drawImage(c, 0, 0); shot = true;
      }
      return r;
    };
  }
  function post(ctx) {
    const p = senInStroke(); if (!p) { shot = false; return; }
    const st = p.st, S = p.senStroke || {}, c = ctx.canvas, k = c.width / W, zm = zoomAt(st);
    if (zm.z > 1.01 && shot) {
      // the close-up: the scene alone (no HUD), pushed in on Sen
      tctx.save(); tctx.setTransform(k, 0, 0, k, 0, 0); overlays(tctx, p); tctx.restore();
      const sw = c.width / zm.z, sh = c.height / zm.z, tx = (st >= CUT && S.tgt && !S.tgt.dead ? (p.x + S.tgt.x) / 2 : p.x) - G.cam.x, ty = p.y - 22 - G.cam.y;
      const sx = SW.clamp(tx * k - sw / 2, 0, c.width - sw), sy = SW.clamp(ty * k - sh * 0.5, 0, c.height - sh);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, sx, sy, sw, sh, 0, 0, c.width, c.height);
      ctx.restore();
    } else { ctx.save(); ctx.setTransform(k, 0, 0, k, 0, 0); overlays(ctx, p); ctx.restore(); }
    shot = false;
    // letterbox and words
    if (zm.bars > 0.01) {
      ctx.save(); ctx.setTransform(k, 0, 0, k, 0, 0);
      const bh = Math.round(34 * zm.bars);
      art.rect(ctx, '#000000', 0, 0, W, bh); art.rect(ctx, '#000000', 0, H - bh, W, bh);
      ctx.globalAlpha = zm.bars;
      if (st >= 34 && st < 66) { text(ctx, 'SEN', W / 2, H - 26, PINK, { align: 'center' }); text(ctx, 'THE SINGLE STROKE', W / 2, H - 15, '#ffffff', { align: 'center' }); }
      if (st >= 40 && st < 66) text(ctx, 'breathe in.', W / 2, 14, PALE, { align: 'center' });
      if (st >= 168 && st < CUT) text(ctx, st >= CUT - 8 ? '...click.' : '...', W / 2, H - 20, '#ffffff', { align: 'center' });
      ctx.restore();
    }
  }
  SS.zoomAt = zoomAt;
  if (V && V.draw) {
    const _vd = V.draw;
    V.draw = function (ctx) {
      // the opponent is held by its stun timer (no input): its "stunned" stars are not drawn while the stroke runs
      const p = senInStroke(), f2 = p ? vsFoe(p) : null, keep = f2 ? f2.stunT : 0;
      if (f2) f2.stunT = 0;
      let r;
      try { r = _vd.apply(this, arguments); } finally { if (f2) f2.stunT = keep; }
      try { post(ctx); } catch (e) { console.error(e); }
      return r;
    };
  }
  if (ui && ui.hud) { const _hud = ui.hud; ui.hud = function (ctx, g) { const r = _hud.apply(this, arguments); if (g && g.scene === 'play') { try { post(ctx); } catch (e) { console.error(e); } } return r; }; }
})();
