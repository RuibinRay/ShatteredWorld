'use strict';
// Shattered Worlds - The Hollow Crown: Itsuki's shield (the user, 2026-11-17: "for story when fighting him his range is ultra
// long and have a shield that have to be broken"). Only in a story duel against him (saga-core.js passes itsukiBoss to
// SW.versus.duel); his ultra-long reach is in js/ninjas7.js.
//   - He starts the duel behind a shield worth 40% of his health. While it holds, hits only wear it down: no damage, no
//     flinch. It shows as a ring around him with a bar above his head.
//   - When it breaks he staggers for a moment, open to a combo.
//   - The first time his health falls below half, it forms again at 60%. After that it is gone for good.
(function () {
  const SW = window.SW, G = SW && SW.game, V = SW && SW.versus, P = SW && SW.Player && SW.Player.prototype, fx = SW && SW.fx, art = SW && SW.art;
  const T = SW && SW.ninja && SW.ninja.TRAITS && SW.ninja.TRAITS.wheel;
  if (!P || !P.takeHit || !V || !T) return;
  const SHIELD = 0.4, REFORM = 0.6, STAGGER = 80;
  const fighterOf = p => (V.f || []).find(f => f.p === p);   // the fighter's own state: G.state swaps between the two
  const boss = p => { if (G.scene !== 'vs' || V.mode !== 'duel' || !V.duelO || !V.duelO.itsukiBoss || !p) return false; const f = fighterOf(p); return !!(f && f.state && f.state.hero === 'itsuki'); };
  const sfx = id => SW.audio && SW.audio.sfx(id);

  function setUp(p) {   // the first frame of the fight (a new round or a retry makes a new fighter, so it starts shielded again)
    if (p.sgShieldMax !== undefined) return;
    const S = fighterOf(p).state; p.sgFull = S.hp; p.sgShieldMax = Math.round(S.hp * SHIELD); p.sgShield = p.sgShieldMax; p.sgReformed = false;
  }
  function burst(p, col) { fx.ring(p.x, p.y - 20, col, 6, 44, 14); fx.ring(p.x, p.y - 20, '#ffffff', 4, 28, 10); fx.spark(p.x, p.y - 20, col, 14, 3); }

  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const gg = g || G;
    if (boss(this) && this.sgShieldMax !== undefined && !(this.sgShield > 0)) { const r = _th.apply(this, arguments); reform(this); return r; }
    if (!boss(this) || !(this.sgShield > 0) || !atk || !atk.dmg || this.dead || this.invuln > 0 || this.iframes > 0 || (gg.busy && gg.busy())) return _th.apply(this, arguments);
    if (this.state === 'guard' && !atk.unblockable) return _th.apply(this, arguments);   // his own guard works as always
    const sx = atk.srcX === undefined ? this.x - this.face : atk.srcX, away = this.x >= sx ? 1 : -1;
    this.sgShield -= atk.dmg; this.invuln = 8; this.vx = away * 0.8; gg.hitstop = Math.max(gg.hitstop || 0, 3);
    fx.text(this.x, this.y - 44, '-' + atk.dmg, '#b48cff'); fx.spark(this.x - away * 10, this.y - 20, '#d6c2ff', 6, 2.4); sfx('block');
    if (this.sgShield > 0) return 'block';
    // broken: he reels, open for a moment
    this.sgShield = 0; burst(this, '#b48cff'); fx.flash('#ffffff', 5); fx.shake(8, 14); sfx('explode');
    fx.text(this.x, this.y - 62, 'SHIELD BROKEN', '#ffffff');
    this.atk = null; this.castFn = null; this.enter('hurt'); this.hurtLen = STAGGER; this.vx = away * 2; this.vy = -2;
    const f = fighterOf(this); if (f) f.stunT = Math.max(f.stunT || 0, STAGGER);
    return 'hit';
  };

  const t0 = T.tick;
  T.tick = function (p) {
    if (t0) t0.apply(this, arguments);
    if (!boss(p) || p.dead || V.phase !== 'fight') return;
    setUp(p); reform(p);
  };
  function reform(p) {   // once, the first time his health falls below half: the shield forms again (checked on every hit he takes, too)
    const f = fighterOf(p);
    if (p.dead || p.sgReformed || p.sgShield > 0 || !f || !(f.state.hp > 0) || f.state.hp >= p.sgFull * 0.5) return;
    p.sgReformed = true; p.sgShield = Math.round(p.sgShieldMax * REFORM); burst(p, '#7a1fff'); sfx('perfect');
    fx.text(p.x, p.y - 62, 'THE SHIELD RE-FORMS', '#d6c2ff');
  }

  const m0 = T.mark;
  T.mark = function (ctx, p, x, y) {
    if (m0) m0.apply(this, arguments);
    if (!boss(p) || !(p.sgShield > 0) || p.dead) return;
    const t = SW.frame, k = p.sgShield / p.sgShieldMax;
    // the ring: violet and white pixels turning around him, flickering as it weakens
    ctx.globalAlpha = 0.25 + 0.45 * k; art.ring(ctx, '#b48cff', Math.round(x), Math.round(y - 20), 24); ctx.globalAlpha = 1;
    for (let i = 0; i < 12; i++) {
      if (k < 0.35 && (i + (t >> 2)) % 3 === 0) continue;
      const a = t * 0.05 + i * Math.PI / 6;
      art.rect(ctx, i % 3 ? '#b48cff' : '#ffffff', Math.round(x + Math.cos(a) * 24), Math.round(y - 20 + Math.sin(a) * 24), 2, 2);
    }
    // the bar above his head
    const w = 34, bx = Math.round(x - w / 2), by = Math.round(y - 66);
    art.rect(ctx, '#05060c', bx - 1, by - 1, w + 2, 5); art.rect(ctx, '#2a1840', bx, by, w, 3); art.rect(ctx, '#b48cff', bx, by, Math.max(1, Math.round(w * k)), 3);
  };
})();
