'use strict';
// Shattered Worlds — the Versus entrance. Loaded after versus.js and skillfx.js; only wraps.
//   When a new pair of fighters meets (the first round of a match, each new Arcade or Survival opponent, each 3 vs 3
//   swap, the Crater duel), a 2.5 s splash plays before ROUND 1: the screen splits in the two heroes' colours, their
//   portraits slide in from each side with their names and titles, VS slams down between them, sparks run along the
//   split, and it all slides away. J / Enter skips it. Then, in the arena, each fighter arrives in a pillar of light and a
//   burst of their element, with their name over their head until FIGHT!
//   The match waits while the splash plays: nothing in the fight moves. Training has no intro, so no splash.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, I = SW.input, V = SW.versus, text = SW.text, W = SW.W, H = SW.H, rand = SW.rand;
  const HR = D.heroes, K = SW.skillfx, sfx = n => SW.audio.sfx(n);
  if (!V || !V.update || !V.draw) return;
  const LEN = 150, OUT = 124;   // frames: the whole splash, and where it starts to slide away

  let sp = null, lastPair = null, entered = null, checked = null;
  const pairKey = () => V.f && V.f.length >= 2 ? V.f[0].hero + '|' + V.f[1].hero : null;
  const _open = V.open; V.open = function () { lastPair = null; sp = null; return _open.apply(this, arguments); };

  const _up = V.update; V.update = function (g) {
    // a new pair at the start of a round: the splash
    // (checked once per round: each round makes new fighters, so the left one's object marks the round)
    if (!sp && V.phase === 'intro' && V.f && V.f.length >= 2 && V.f[0].p && checked !== V.f[0].p) {
      checked = V.f[0].p;
      const key = pairKey();
      if (key && (key !== lastPair || V.round <= 1)) { lastPair = key; sp = { t: 0, a: V.f[0].hero, b: V.f[1].hero, sparks: [] }; sfx('awaken'); }
    }
    if (sp) {
      sp.t++;
      if (sp.t > 30 && sp.t < OUT && (I.hit('confirm') || I.hit('attack'))) sp.t = OUT;   // skip
      if (sp.t === 26) { sfx('heavy'); fx.shake(6, 12); }
      if (sp.t >= LEN) sp = null;
      else return;   // the match waits
    }
    // the arrival in the arena, once per round, at the start of the intro
    if (V.phase === 'intro' && V.f && V.f[0] && V.f[0].p && entered !== V.f[0].p) {
      entered = V.f[0].p;
      V.f.forEach(f => { if (!f.p) return; const st = K ? K.styleOf(f.hero) : null; if (K) { K.cast(f.p, st, 3); K.emit(st, f.p.x, f.p.y - 16, 18, { power: 1.6 }); } fx.ring(f.p.x, f.p.y - 16, HR[f.hero].colorHi, 4, 40, 18); fx.ghost(f.p.sheet(), 'cast', 0, f.p.x, f.p.y, f.p.face < 0); });
      sfx('burst');
    }
    return _up.apply(this, arguments);
  };

  // ================= drawing =================
  const ease = k => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);
  function portrait(ctx, id, x, y, w, h, flip, glow) {
    const img = art.bg['hero_' + id], hero = HR[id];
    ctx.save();
    art.rect(ctx, '#05060c', x - 2, y - 2, w + 4, h + 4); art.rect(ctx, hero.colorHi || hero.color, x - 2, y - 2, w + 4, 1); art.rect(ctx, hero.colorHi || hero.color, x - 2, y + h + 1, w + 4, 1);
    if (img) {
      const sw = img.width, sh = img.height, r = Math.max(w / sw, h / sh), cw = w / r, ch = h / r;
      if (flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(img, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, w, h); }
      else ctx.drawImage(img, (sw - cw) / 2, (sh - ch) / 2, cw, ch, x, y, w, h);
    } else {   // no picture: the sprite, large
      ctx.translate(x + w / 2, y + h - 8); ctx.scale(flip ? -4 : 4, 4); art.draw(ctx, hero.sheet || id, 'idle', 0, 0, 0, false);
    }
    ctx.restore();
    if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = glow; art.rect(ctx, '#ffffff', x, y, w, h); ctx.restore(); }
  }
  function splash(ctx) {
    const t = sp.t, ha = HR[sp.a], hb = HR[sp.b], kin = ease(t / 16), kout = t > OUT ? ease((t - OUT) / (LEN - OUT)) : 0, k = kin * (1 - kout);
    // the two halves, split on a slant, each in its hero's colour
    ctx.save();
    ctx.globalAlpha = Math.min(1, t / 6) * (1 - kout); art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;   // opaque: the round call underneath must not show through
    const off = Math.round((1 - k) * W / 2), slant = 40;
    ctx.globalAlpha = 0.5 * k; ctx.fillStyle = ha.color; ctx.beginPath(); ctx.moveTo(-off, 0); ctx.lineTo(W / 2 + slant / 2 - off, 0); ctx.lineTo(W / 2 - slant / 2 - off, H); ctx.lineTo(-off, H); ctx.fill();
    ctx.fillStyle = hb.color; ctx.beginPath(); ctx.moveTo(W / 2 + slant / 2 + off, 0); ctx.lineTo(W + off, 0); ctx.lineTo(W + off, H); ctx.lineTo(W / 2 - slant / 2 + off, H); ctx.fill();
    // speed lines running outward on each side
    ctx.globalAlpha = 0.35 * k;
    for (let i = 0; i < 14; i++) { const y = (i * 37 + 11) % H, l = 30 + (i * 23) % 60, x = (t * (6 + i % 4) + i * 53) % (W / 2 + l); art.rect(ctx, i % 2 ? '#ffffff' : ha.colorHi, W / 2 - x - off, y, l, 1); art.rect(ctx, i % 2 ? '#ffffff' : hb.colorHi, W / 2 + x - l + off, (y + 17) % H, l, 1); }
    ctx.globalAlpha = 1; ctx.restore();
    // the split: a jagged line of light, with sparks running along it
    if (k > 0.2) {
      ctx.globalAlpha = k;
      let px = W / 2 + slant / 2, py = 0;
      for (let i = 1; i <= 12; i++) { const ny = i * H / 12, nx = W / 2 + slant / 2 - slant * ny / H + (i < 12 ? rand(-4, 4) : 0); art.line(ctx, '#ffffff', Math.round(px), Math.round(py), Math.round(nx), Math.round(ny), 2); px = nx; py = ny; }
      if (t % 2 === 0 && sp.sparks.length < 40) sp.sparks.push({ y: rand(0, H), v: rand(-3, 3), l: 14 });
      sp.sparks.forEach(s => { s.y += s.v; s.l--; const x = W / 2 + slant / 2 - slant * s.y / H; art.rect(ctx, '#ffffff', Math.round(x + rand(-3, 3)), Math.round(s.y), 2, 2); });
      sp.sparks = sp.sparks.filter(s => s.l > 0);
      ctx.globalAlpha = 1;
    }
    // the portraits slide in (a little past, then back), float, and slide away
    const pw = 124, ph = 166, py = 26 + Math.round(Math.sin(t * 0.06) * 2), over = t < 24 ? Math.sin(Math.min(1, (t - 6) / 18) * Math.PI) * 10 : 0;
    const inA = ease((t - 6) / 16), inB = ease((t - 9) / 16), flash = t >= 22 && t < 30 ? (30 - t) / 8 * 0.7 : 0;
    const ax = Math.round(34 - (1 - inA) * 200 + over - kout * 220), bx = Math.round(W - 34 - pw + (1 - inB) * 200 - over + kout * 220);
    if (t > 5) portrait(ctx, sp.a, ax, py, pw, ph, false, flash);
    if (t > 8) portrait(ctx, sp.b, bx, py, pw, ph, true, flash);
    // names and titles under them, sliding the other way
    // (the same labels the Versus screens use)
    const bvb = V.f[0].bot && V.f[1].bot, na = ease((t - 14) / 12) * (1 - kout), sideA = f => (V.mode === 'duel' ? (V.f[f].bot ? 'RIVAL' : 'YOU') : bvb ? 'BOT ' + (f + 1) : V.f[f].bot ? 'BOT' : 'PLAYER ' + (f + 1));
    if (na > 0) {
      ctx.globalAlpha = na;
      text(ctx, ha.name.toUpperCase(), ax + pw / 2, py + ph + 8, ha.colorHi, { align: 'center', scale: 2 });
      text(ctx, hb.name.toUpperCase(), bx + pw / 2, py + ph + 8, hb.colorHi, { align: 'center', scale: 2 });
      if (ha.title) text(ctx, ha.title, ax + pw / 2, py + ph + 28, '#ffffff', { align: 'center' });
      if (hb.title) text(ctx, hb.title, bx + pw / 2, py + ph + 28, '#ffffff', { align: 'center' });
      text(ctx, sideA(0), ax + 4, py + 4, '#f5c542'); text(ctx, sideA(1), bx + pw - 4, py + 4, '#f5c542', { align: 'right' });
      ctx.globalAlpha = 1;
    }
    // VS slams down: big, then settling, with a white flash and rings
    if (t >= 22) {
      const s = t < 28 ? Math.max(4, Math.round(10 - (t - 22))) : 4, a = 1 - kout;
      if (t >= 26 && t < 34) { ctx.globalAlpha = (34 - t) / 8 * 0.6; art.rect(ctx, '#ffffff', 0, 0, W, H); ctx.globalAlpha = 1; }
      if (t >= 26 && t < 46) { ctx.globalAlpha = (46 - t) / 20; art.ring(ctx, '#ffffff', W / 2, 108, Math.round((t - 26) * 5)); art.ring(ctx, '#f5c542', W / 2, 108, Math.round((t - 26) * 3.4)); ctx.globalAlpha = 1; }
      ctx.globalAlpha = a;
      text(ctx, 'VS', W / 2 + 2, 108 - s * 3 + 2, '#05060c', { align: 'center', scale: s });
      text(ctx, 'VS', W / 2, 108 - s * 3, t % 8 < 4 ? '#f5c542' : '#ffffff', { align: 'center', scale: s });
      ctx.globalAlpha = 1;
    }
    if (t > 40 && t < OUT) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 0.2); text(ctx, 'J / Enter: skip', W / 2, H - 12, '#8a92b8', { align: 'center' }); ctx.globalAlpha = 1; }
  }
  const _draw = V.draw; V.draw = function (ctx, g) {
    _draw.apply(this, arguments);
    if (g.scene !== 'vs' || !V.f || V.f.length < 2) return;
    if (sp) { splash(ctx); return; }
    // names over the fighters' heads while the round is being called
    if (V.phase === 'intro' && V.t < 80) {
      const a = Math.min(1, V.t / 10) * Math.min(1, (80 - V.t) / 10);
      ctx.globalAlpha = a;
      V.f.forEach(f => { if (!f.p) return; const x = Math.round(f.p.x - G.cam.x), y = Math.round(f.p.y - G.cam.y - (f.p.h || 34) - 18); text(ctx, HR[f.hero].name.toUpperCase(), x, y, HR[f.hero].colorHi, { align: 'center' }); });
      ctx.globalAlpha = 1;
    }
  };

  SW.vsintro = { active: () => !!sp };
})();
