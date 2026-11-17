'use strict';
// Shattered Worlds — skills in every hero's element (the user, 2026-11-17: "improve all heros skill animation too").
// Drawing only: nothing here changes damage, hit boxes, timing or state.
// What was there: the sigil and the gather at the feet (js/skillfx.js), a motif per skill (js/skillanim.js), cast poses
// (js/cast-motion.js) and shot trails (js/combatfeel.js, skillfx.js). What was missing was the element in the hand and
// on the target. For every hero but Itsuki (his five skills each draw their own element, js/ninjas7.js):
//   cast      the element gathers into the casting hand, which glows and sheds it while the cast lasts; on release a
//             flash and a ring go out from the hand
//   contact   every skill hit bursts in the element with a ring and an extra by element family (a crackle of
//             lightning, frost shards, embers, a gust, grit, a splash, the dark closing in, rays, a slash); heavy,
//             launching and knock-down hits burst bigger
//   linger    the element clings to whoever a skill hit for a moment afterwards: embers rise off them, frost falls,
//             sparks crackle, and a faint glow in its colour sits on them
//   shots     a hero's shot that ends on a wall or a foe pops in the element
// Ultimates are js/ult-fx.js's, melee is js/melee-element.js's. One target takes a full contact effect at most every
// 4 frames. SW.skillElement.on = false turns it off.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, K = SW.skillfx, P = SW.Player && SW.Player.prototype, rand = SW.rand;
  if (!K || !P) return;
  const HR = D.heroes;
  const SE = SW.skillElement = { on: true, skip: { itsuki: 1 } };
  const FAMILY = (SW.ultFx2 && SW.ultFx2.FAMILY) || {};
  const heroId = g => g && g.state && g.state.hero;
  const mine = g => { const id = heroId(g); return SE.on && !!(id && HR[id] && !SE.skip[id]); };
  const styleOf = g => K.heroStyle(g);
  const colsOf = st => (K.STYLE[st] || K.STYLE.impact).c;
  const hand = p => [p.x + (p.face || 1) * 12, p.y - 26];

  // ================= cast: the element in the hand =================
  const _pu = P.update; P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    if (!mine(g)) { this._seCast = null; return r; }
    if (this.state === 'cast' && !this.dead) {
      const st = styleOf(g), [x, y] = hand(this), f = this.face || 1;
      if (this._seCast == null) {   // the cast starts: gather in, then a flash and a ring out from the hand
        this._seCast = 0;
        K.gather(st, x, y, 6, 18);
        fx.ring(x, y, colsOf(st)[0], 2, 16, 8);
        K.emit(st, x, y, 5, { dir: f, spread: 0.5, power: 1.3 });
      }
      const t = ++this._seCast;
      if (t % 2 === 0) K.add(st, x + rand(-3, 3), y + rand(-3, 3), f * rand(0.2, 0.9), rand(-0.7, 0.2), { life: 10 });
      if (t % 12 === 6) K.gather(st, x, y, 3, 12);
    } else this._seCast = null;
    return r;
  };
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (this.state === 'cast' && !this.dead && this._seCast != null && mine(g)) {
      const c = colsOf(styleOf(g)), [x, y] = hand(this), sx = Math.round(x - cam.x), sy = Math.round(y - cam.y), t = this._seCast;
      const k = t < 6 ? 1 - t / 8 : 0.25 + 0.1 * Math.sin(t * 0.5);   // bright on release, then a steady pulse
      art.glow(ctx, sx, sy, 10 + Math.round(k * 8), c[0], 0.18 + k * 0.2);
      ctx.globalAlpha = 0.85; art.rect(ctx, c[1] || '#ffffff', sx - 1, sy - 1, 2, 2); ctx.globalAlpha = 1;
    }
    return r;
  };

  // ================= contact and linger =================
  function extra(fam, st, c, x, y, big, f) {
    if (fam === 'sky') { fx.bolt(x + rand(-12, 12), y - (big ? 60 : 40), x, y, c[0]); if (big) fx.ring(x, y, '#ffffff', 2, 22, 8); }
    else if (fam === 'frost') { const n = big ? 8 : 5; for (let i = 0; i < n; i++) { const a = i / n * 6.283; K.add(st, x, y, Math.cos(a) * 2.4, Math.sin(a) * 2.4, { life: 16 }); } }
    else if (fam === 'flame') K.emit(st, x, y + 4, big ? 12 : 7, { up: true, spread: 0.6, power: 1.3 });
    else if (fam === 'swirl') { fx.ring(x, y, c[0], 4, big ? 30 : 20, 10); K.emit(st, x, y, big ? 8 : 5, { dir: f, spread: 0.4, power: 1.5 }); }
    else if (fam === 'quake') { fx.debris(x, y, c[0], big ? 7 : 4); fx.dust(x, y + 12, big ? 5 : 3); }
    else if (fam === 'splash') K.emit(st, x, y, big ? 12 : 7, { up: true, spread: 0.9, power: 1.3 });
    else if (fam === 'dark') { K.gather(st, x, y, big ? 10 : 6, big ? 28 : 20); fx.ring(x, y, c[1] || '#ffffff', big ? 28 : 20, 3, 10); }
    else if (fam === 'shine') { for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; K.add(st, x, y, Math.cos(a) * 2.8, Math.sin(a) * 2.8, { life: 11 }); } fx.ring(x, y, '#ffffff', 2, big ? 26 : 18, 8); }
    else fx.slash(x, y, f, 1, c[0], big ? 38 : 28);
  }
  const last = new WeakMap();
  const cling = [];   // { e, st, fam, c, t, max }
  function hold(e, st, fam, c, big) {
    for (const q of cling) if (q.e === e) { q.st = st; q.fam = fam; q.c = c; q.t = 0; q.max = big ? 36 : 24; return; }
    if (cling.length >= 12) cling.shift();
    cling.push({ e, st, fam, c, t: 0, max: big ? 36 : 24 });
  }
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh.apply(this, arguments);
    const p = G.player;
    if (!atk || atk.team !== 'player' || !atk.energy || !e || !b || !p || p.state === 'ult' || !mine(G)) return;
    const now = SW.frame, l = last.get(e); if (l !== undefined && now - l < 4) return;
    last.set(e, now);
    const st = styleOf(G), c = colsOf(st), fam = FAMILY[st] || 'smash', f = Math.sign((b.x + b.w / 2) - p.x) || p.face || 1;
    const x = b.x + b.w / 2, y = b.y + b.h / 2, big = !!(atk.heavy || atk.launch || atk.down || (atk.ky !== undefined && atk.ky <= -5));
    fx.ring(x, y, c[0], 3, big ? 30 : 20, big ? 12 : 9);
    if (big) fx.ring(x, y, c[1] || '#ffffff', 6, 40, 14);
    extra(fam, st, c, x, y, big, f);
    hold(e, st, fam, c, big);
  };
  const _fu = fx.update; fx.update = function () {
    _fu.apply(this, arguments);
    for (let i = cling.length - 1; i >= 0; i--) {
      const q = cling[i], e = q.e;
      if (++q.t > q.max || !e || e.dead || e.gone) { cling.splice(i, 1); continue; }
      if (q.t % 3) continue;
      const h = e.h || 30, x = e.x + rand(-6, 6), y = e.y - rand(4, h - 2);
      const up = q.fam === 'flame' || q.fam === 'dark' || q.fam === 'shine';
      if (q.fam === 'frost' || q.fam === 'quake' || q.fam === 'splash') K.add(q.st, x, y, rand(-0.3, 0.3), rand(0.2, 0.8), { life: 14 });
      else if (q.fam === 'sky' && q.t % 6 === 0) fx.bolt(x + rand(-6, 6), y - 10, x, y + 6, q.c[0]);
      else K.emit(q.st, x, y, 1, up ? { up: true, spread: 0.5, power: 0.6 } : { power: 0.6 });
    }
  };
  const _fd = fx.draw; fx.draw = function (ctx, cam) {
    _fd.apply(this, arguments);
    for (const q of cling) {
      const e = q.e, k = 1 - q.t / q.max;
      if (!e || k <= 0) continue;
      art.glow(ctx, Math.round(e.x - cam.x), Math.round(e.y - (e.h || 30) / 2 - cam.y), 16, q.c[0], 0.2 * k);
    }
  };

  // ================= a shot that ends on a wall or a foe pops in the element =================
  function pop(g, s) {
    if (!mine(g) || s.seDone) return;
    s.seDone = true;
    const st = styleOf(g), c = colsOf(st);
    K.emit(st, s.x, s.y, 6, { power: 1.1 });
    fx.ring(s.x, s.y, c[0], 2, 14, 8);
  }
  if (SW.Shot) {
    const _se = SW.Shot.prototype.end; SW.Shot.prototype.end = function (g, z, impact) {
      const r = _se.apply(this, arguments);
      if (impact && this.team === 'player') pop(g, this);
      return r;
    };
  }
  if (SW.Proj) {
    const _je = SW.Proj.prototype.end; SW.Proj.prototype.end = function (g, z, impact) {
      const r = _je.apply(this, arguments);
      if (impact && this.team !== 'enemy') pop(g, this);
      return r;
    };
  }
})();
