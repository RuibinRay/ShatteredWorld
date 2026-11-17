'use strict';
// Shattered Worlds — melee in every hero's element (the user, 2026-11-17: "improve all heros melee animation too").
// Drawing only: nothing here changes damage, hit boxes, timing or state.
// The body is not touched here: the poses, in-betweens, stances, swing arcs and hit flashes are js/anim.js, anim2.js,
// combo-flow.js, herostyle.js and clan-poses.js. What was missing was the element: the Hidden Clans throw theirs on every
// hit (js/clanmelee.js), but the other heroes' punches and blades showed none of it (Kael's fists never crackled, Pyra's
// never burned). For every hero who is not a Hidden Clans fighter, in Versus and the story alike:
//   strike     while a melee hit is live, the fist or blade glows in the element and sheds it along the swing
//   contact    every J, W+J, S+J and air hit that lands bursts in the element where it lands, bigger with each hit of
//              the combo
//   finisher   the fourth J, the launcher and the sweep add a flourish by element family (a crackle of lightning, frost
//              shards, a flare of embers, a gust, grit and dust, a splash, a ring of dark closing in, rays, a slash)
// One target takes a full contact effect at most every 3 frames, so multi-hit boxes stay clean.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, K = SW.skillfx, P = SW.Player && SW.Player.prototype, rand = SW.rand;
  if (!K || !P) return;
  const C = D.combat, HR = D.heroes;
  const FAMILY = (SW.ultFx2 && SW.ultFx2.FAMILY) || {};
  const heroOf = g => (g && g.state && HR[g.state.hero]) || null;
  const mine = g => { const h = heroOf(g); return !!(h && !h.clan); };   // the Hidden Clans have js/clanmelee.js
  const styleOf = g => K.heroStyle(g);
  const colsOf = st => (K.STYLE[st] || K.STYLE.impact).c;
  const melee = p => p && !p.dead && (p.state === 'attack' || p.state === 'airatk') && p.atk && !p.atk.energy;
  // which hit this is: 1-4 in the J chain, 'up' launcher, 'low' sweep, 'air'
  function kindOf(p) {
    const a = p.atk; if (a === C.launcher) return 'up'; if (a === C.sweep) return 'low'; if (C.air && C.air.indexOf(a) >= 0) return 'air';
    return Math.max(1, Math.min(4, p.combo || 1));
  }
  // where the strike is: the far middle of the hit box
  const strikeAt = p => { const b = p.atk.box || [0, -30, 30, 30], f = p.face || 1, x = p.x + f * (b[0] + b[2] * 0.85), y = p.y + b[1] + b[3] / 2; return [x, y]; };

  // ================= strike: the hand or blade glows and sheds the element =================
  const _pu = P.update; P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    if (!melee(this) || !mine(g)) return r;
    const a = this.atk;
    if (this.st >= (a.hitAt || 0) - 1 && this.st <= (a.hitEnd || 0) + 1) {
      const st = styleOf(g), [x, y] = strikeAt(this), k = kindOf(this);
      K.add(st, x + rand(-3, 3), y + rand(-3, 3), (this.face || 1) * rand(0.4, 1.4), rand(-0.6, 0.6), { life: 10 });
      if (k === 4 || k === 'up' || k === 'low') K.add(st, x + rand(-5, 5), y + rand(-5, 5), (this.face || 1) * rand(0.8, 2), rand(-1, 1), { life: 12 });
    }
    return r;
  };
  // the glow itself, drawn over the fighter while the hit is live
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (melee(this) && mine(g)) {
      const a = this.atk;
      if (this.st >= (a.hitAt || 0) && this.st <= (a.hitEnd || 0)) {
        const c = colsOf(styleOf(g)), [x, y] = strikeAt(this), sx = Math.round(x - cam.x), sy = Math.round(y - cam.y), big = kindOf(this) === 4;
        art.glow(ctx, sx, sy, big ? 16 : 11, c[0], big ? 0.32 : 0.24);
        ctx.globalAlpha = 0.8; art.rect(ctx, c[1] || '#ffffff', sx - 1, sy - 1, 2, 2); ctx.globalAlpha = 1;
      }
    }
    return r;
  };

  // ================= contact: the element bursts where the hit lands =================
  const last = new WeakMap();
  function flourish(fam, st, c, x, y, f) {
    if (fam === 'sky') { fx.bolt(x + rand(-10, 10), y - 46, x, y, c[0]); fx.ring(x, y, '#ffffff', 2, 18, 8); }
    else if (fam === 'frost') { for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; K.add(st, x, y, Math.cos(a) * 2.2, Math.sin(a) * 2.2, { life: 16 }); } }
    else if (fam === 'flame') K.emit(st, x, y + 4, 9, { up: true, spread: 0.6, power: 1.3 });
    else if (fam === 'swirl') { fx.ring(x, y, c[0], 4, 22, 10); K.emit(st, x, y, 6, { dir: f, spread: 0.35, power: 1.6 }); }
    else if (fam === 'quake') { fx.debris(x, y, c[0], 5); fx.dust(x, y + 12, 3); }
    else if (fam === 'splash') K.emit(st, x, y, 9, { up: true, spread: 0.9, power: 1.3 });
    else if (fam === 'dark') { K.gather(st, x, y, 8, 22); fx.ring(x, y, c[1] || '#ffffff', 22, 3, 10); }
    else if (fam === 'shine') { for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; K.add(st, x, y, Math.cos(a) * 2.6, Math.sin(a) * 2.6, { life: 10 }); } fx.ring(x, y, '#ffffff', 2, 18, 8); }
    else fx.slash(x, y, f, 1, c[0], 30);
  }
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh.apply(this, arguments);
    const p = G.player;
    if (!atk || atk.team !== 'player' || atk.energy || !e || !b || !melee(p) || !mine(G) || p.state === 'ult') return;
    const now = SW.frame, l = last.get(e); if (l !== undefined && now - l < 3) return;
    last.set(e, now);
    const st = styleOf(G), c = colsOf(st), k = kindOf(p), f = p.face || 1, x = b.x + b.w / 2, y = b.y + b.h / 2;
    const n = typeof k === 'number' ? k : 4;   // the launcher, the sweep and air hits count as big ones
    K.emit(st, x, y, 3 + n * 2, { dir: f, spread: 0.8, power: 0.9 + n * 0.15 });
    fx.ring(x, y, c[0], 2, 10 + n * 4, 8);
    if (k === 4 || k === 'up' || k === 'low') flourish(FAMILY[st] || 'smash', st, c, x, y, f);
  };

  SW.meleeElement = { on: true };
})();
