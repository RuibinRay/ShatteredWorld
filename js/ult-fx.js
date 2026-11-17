'use strict';
// Shattered Worlds — ultimates look bigger, for every hero (the user, 2026-11-17: "improve all heros ult add improvement
// in elements and when hitting target"). Drawing only: nothing here changes damage, hit boxes or timing.
//   while an ultimate runs   the hero's element (skillfx.js: bolt, ice, fire, wind, rock, water, shadow, void ...) rises
//                            off them, a glow in its colour pulses under their feet and a ring goes out now and then
//   every ultimate hit       a big burst of the element where it lands, a shockwave ring in the hero's colours, and an
//                            extra by element family: a bolt from the sky, frost shards, embers, rock debris, a splash,
//                            a pull into the dark, a swirl of wind ...
//   the finishing hit        (a knock-down or launch, or a hit far above the ultimate's usual) bursts bigger, leaves the
//                            element's sigil under the target and flashes the screen
// Hits on one target are thinned out (a full impact at most every 4 frames), so ultimates that hit every frame stay
// readable and the particle count stays low.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, K = SW.skillfx, P = SW.Player && SW.Player.prototype, rand = SW.rand;
  if (!K || !P) return;
  const HR = D.heroes;

  // element families: which extra an ultimate hit gets
  const FAMILY = {
    bolt: 'sky', ice: 'frost', glass: 'frost', fire: 'flame', magma: 'flame', blast: 'flame', wind: 'swirl', paper: 'swirl', petal: 'swirl', feather: 'swirl',
    rock: 'quake', sand: 'quake', metal: 'quake', bone: 'quake', water: 'splash', ink: 'splash', spore: 'splash',
    shadow: 'dark', void: 'dark', gravity: 'dark', star: 'dark', moon: 'dark', light: 'shine', time: 'shine', chi: 'shine', sound: 'shine',
    impact: 'smash', beast: 'smash', string: 'smash', smoke: 'smash', thorns: 'smash'
  };
  const styleOf = g => K.heroStyle(g);
  const colsOf = st => (K.STYLE[st] || K.STYLE.impact).c;
  const inUlt = p => p && !p.dead && p.state === 'ult';

  // ================= while the ultimate runs =================
  const _pu = P.update; P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    if (!inUlt(this) || !g || !g.state) return r;
    const st = styleOf(g), c = colsOf(st), t = this.st || 0;
    if (t % 2 === 0) K.emit(st, this.x + rand(-10, 10), this.y - rand(2, 34), 1, { up: true, spread: 0.5, power: 0.7 });
    if (t % 14 === 0) fx.ring(this.x, this.y - 4, c[0], 6, 34, 14);
    if (t % 28 === 7) fx.ring(this.x, this.y - 20, c[2] || c[0], 4, 26, 12);
    return r;
  };
  // the glow under their feet, drawn before the hero so it sits behind them
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    if (inUlt(this) && g && g.state) {
      const c = colsOf(styleOf(g)), x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), k = 0.16 + 0.08 * Math.sin((this.st || 0) * 0.3);
      art.glow(ctx, x, y - 16, 34, c[0], k);
      ctx.globalAlpha = 0.35 + 0.15 * Math.sin((this.st || 0) * 0.3); art.rect(ctx, c[0], x - 18, y - 1, 36, 2); art.rect(ctx, c[1] || '#ffffff', x - 10, y - 1, 20, 1); ctx.globalAlpha = 1;
    }
    return _pd.apply(this, arguments);
  };

  // ================= when an ultimate hits =================
  const last = new WeakMap();   // target -> frame of its last full impact
  const avg = {};               // hero -> running average of their ultimate's hit damage, to spot the finisher
  function extra(fam, st, c, x, y, b, big) {
    const top = G.cam.y - 10;
    if (fam === 'sky') { fx.bolt(x + rand(-24, 24), top, x, y, c[0]); if (big) fx.bolt(x + rand(-40, 40), top, x + rand(-4, 4), y, '#ffffff'); fx.flash('#ffffff', 2); }
    else if (fam === 'frost') { for (let i = 0; i < (big ? 8 : 5); i++) { const a = i / (big ? 8 : 5) * 6.283; K.add(st, x, y, Math.cos(a) * 2.6, Math.sin(a) * 2.6, { life: 18 }); } fx.ring(x, y, '#ffffff', 2, big ? 34 : 22, 10); }
    else if (fam === 'flame') { K.emit(st, x, y + 6, big ? 14 : 8, { up: true, spread: 0.7, power: 1.4 }); fx.ring(x, y, c[1] || c[0], 3, big ? 40 : 26, 12); }
    else if (fam === 'swirl') { fx.ring(x, y, c[0], 4, big ? 38 : 26, 12); fx.ring(x, y, c[1] || '#ffffff', 10, big ? 46 : 32, 14); K.emit(st, x, y, big ? 10 : 6, { dir: Math.random() < 0.5 ? 1 : -1, spread: 0.4, power: 1.6 }); }
    else if (fam === 'quake') { fx.debris(x, y, c[0], big ? 10 : 6); if (b) fx.dust(x, b.y + b.h, big ? 8 : 4); if (big) fx.shake(4, 8); }
    else if (fam === 'splash') { K.emit(st, x, y, big ? 14 : 8, { up: true, spread: 0.9, power: 1.5 }); fx.ring(x, y + 8, c[0], 4, big ? 36 : 24, 12); }
    else if (fam === 'dark') { K.gather(st, x, y, big ? 12 : 7, big ? 36 : 24); fx.ring(x, y, c[1] || '#ffffff', big ? 40 : 26, 4, 12); }   // a ring that closes in
    else if (fam === 'shine') { for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; K.add(st, x, y, Math.cos(a) * 3, Math.sin(a) * 3, { life: 12 }); } fx.ring(x, y, '#ffffff', 2, big ? 36 : 22, 10); }
    else { fx.slash(x, y, Math.random() < 0.5 ? 1 : -1, 1, c[0], big ? 44 : 30); fx.ring(x, y, c[0], 3, big ? 34 : 22, 10); }
  }
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh.apply(this, arguments);
    const p = G.player, g = G;
    if (!atk || atk.team !== 'player' || !inUlt(p) || !b || !e || !g.state) return;
    const id = g.state.hero, st = styleOf(g), c = colsOf(st), h = HR[id] || {}, x = b.x + b.w / 2, y = b.y + b.h / 2;
    const dmg = atk.dmg || 0, a = avg[id] || dmg; avg[id] = a * 0.85 + dmg * 0.15;
    const big = !!(atk.down || atk.launch || (atk.ky !== undefined && atk.ky <= -5.5) || (dmg > a * 2.2 && dmg >= 12));
    const f = SW.frame, l = last.get(e);
    if (!big && l !== undefined && f - l < 4) { K.emit(st, x + rand(-4, 4), y + rand(-6, 6), 2, { power: 0.8 }); return; }   // thinned: a spark only
    last.set(e, f);
    K.emit(st, x, y, big ? 22 : 12, { power: big ? 2 : 1.4 });
    fx.ring(x, y, h.colorHi || c[1] || '#ffffff', 3, big ? 44 : 28, big ? 16 : 11);
    if (big) fx.ring(x, y, h.color || c[0], 8, 60, 18);
    extra(FAMILY[st] || 'smash', st, c, x, y, b, big);
    if (big) { K.sigil(x, b.y + b.h, st, 2); fx.flash(h.colorHi || '#ffffff', 4); fx.shake(6, 10); }
  };

  SW.ultFx2 = { FAMILY };
})();
