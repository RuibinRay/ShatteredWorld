'use strict';
// Shattered Worlds — The Hollow Crown: polish from the Normal playtest (2026-11-20). Only wraps; drawing and names.
//   The Siege Walker   a rescue's "walker" fight was a person-sized captain while the story says "a Siege Walker comes
//                      down the road on legs like towers". Now the walker itself towers behind its captain: an armoured
//                      hull high over the arena on four jointed legs that stamp the floor, a violet eye-slit and a Legion
//                      banner. When the captain falls, the walker kneels and comes apart. Its hitbox is still the captain.
//   HOLLOW BRUTE       the Legion's big wave soldier was also called "SIEGE WALKER" at person size; it is a HOLLOW BRUTE
//                      now, so the name is left to the real thing (es/zh added).
// (The playtest's radiation and night Husks in story chapters are switched off in js/daynight.js; the HUD's "O!" reads
// "O: AWAKEN" in js/ui.js; the ultimate's name slides in on screen in js/heroes3.js.)
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, E = SW.data && SW.data.enemies, Enemy = SW.Enemy, N = SW.ninja;
  if (!E || !Enemy || !art) return;
  const R = Math.round, PI = Math.PI;
  const C = { out: '#08070c', h0: '#2a2832', h: '#4a4856', h2: '#6e6c7c', h3: '#9a98a8', vi: '#b48cff', vi2: '#e8d8ff', rust: '#6a4a3a', ban: '#3a2a4a' };

  // ---------- names ----------
  if (E.hollow_walker) E.hollow_walker.name = 'HOLLOW BRUTE';
  if (SW.i18n && SW.i18n.add) { SW.i18n.add('es', { 'HOLLOW BRUTE': 'BRUTO HUECO', 'O: AWAKEN': 'O: DESPERTAR' }); SW.i18n.add('zh', { 'HOLLOW BRUTE': '空洞蛮兵', 'O: AWAKEN': 'O：觉醒' }); }

  // ---------- the walker ----------
  const isWalker = e => !!(e && typeof e.sgKey === 'string' && e.sgKey.indexOf('walker:') === 0);
  // fx 0..1 how far it has collapsed; t the frame; x, gy its centre and the floor (screen); d its facing
  function walker(ctx, x, gy, d, t, fall) {
    const k = fall || 0, hullY = gy - 118 + k * 86, step = t * 0.05;
    ctx.save(); ctx.globalAlpha *= 1 - Math.max(0, (k - 0.75) / 0.25);
    // four legs: hip on the hull, knee out and up, foot on the floor; pairs lift in turn
    const hips = [-34, -14, 14, 34];
    hips.forEach((hx, i) => {
      const phase = Math.sin(step + (i % 2) * PI), lift = Math.max(0, phase) * 8 * (1 - k), fx0 = x + hx * 1.5 + (i < 2 ? -8 : 8) + phase * 6 * (1 - k), fy = gy - lift;
      const hipX = x + hx, hipY = hullY + 22, kneeX = (hipX + fx0) / 2 + (i < 2 ? -18 : 18) * (1 - k * 0.5), kneeY = Math.min(hipY, fy) - 30 + k * 40;
      const back = i === 1 || i === 2, col = back ? C.h0 : C.h, col2 = back ? C.h : C.h2;
      art.line(ctx, C.out, R(hipX), R(hipY), R(kneeX), R(kneeY), 9); art.line(ctx, col, R(hipX), R(hipY), R(kneeX), R(kneeY), 7); art.line(ctx, col2, R(hipX), R(hipY) - 2, R(kneeX), R(kneeY) - 2, 2);   // thigh
      art.line(ctx, C.out, R(kneeX), R(kneeY), R(fx0), R(fy), 8); art.line(ctx, col, R(kneeX), R(kneeY), R(fx0), R(fy), 6);   // shin
      art.rect(ctx, C.out, R(kneeX) - 5, R(kneeY) - 5, 10, 10); art.rect(ctx, back ? C.h : C.h2, R(kneeX) - 4, R(kneeY) - 4, 8, 8); art.rect(ctx, C.vi, R(kneeX) - 1, R(kneeY) - 1, 2, 2);   // knee joint
      art.rect(ctx, C.out, R(fx0) - 8, R(fy) - 4, 16, 5); art.rect(ctx, col2, R(fx0) - 7, R(fy) - 3, 14, 3);   // foot
    });
    // the hull: armoured, plated, a violet eye-slit facing its way
    const hw = 84, hh = 38, hx0 = R(x - hw / 2), hy0 = R(hullY - hh / 2);
    art.rect(ctx, C.out, hx0 - 2, hy0 - 2, hw + 4, hh + 4);
    art.rect(ctx, C.h, hx0, hy0, hw, hh); art.rect(ctx, C.h2, hx0, hy0, hw, 4); art.rect(ctx, C.h0, hx0, hy0 + hh - 6, hw, 6);
    for (let i = 1; i < 5; i++) art.rect(ctx, C.h0, hx0 + i * hw / 5, hy0 + 4, 1, hh - 10);   // plates
    for (let i = 0; i < 6; i++) art.rect(ctx, C.h3, hx0 + 4 + i * 15, hy0 + 2, 2, 1);   // rivets
    const ex = d > 0 ? hx0 + hw - 26 : hx0 + 6; art.rect(ctx, C.out, ex - 1, hy0 + 12, 22, 7); art.rect(ctx, k > 0.2 ? C.h0 : C.vi, ex, hy0 + 13, 20, 5); if (k < 0.2 && t % 40 < 30) art.rect(ctx, C.vi2, ex + (d > 0 ? 12 : 2), hy0 + 14, 6, 3);   // the eye-slit
    const bx = d > 0 ? hx0 + 6 : hx0 + hw - 8; art.rect(ctx, C.out, bx, hy0 - 30, 2, 30); for (let j = 0; j < 4; j++) art.rect(ctx, C.ban, bx + 2 + Math.round(Math.sin(t * 0.08 + j) * 1), hy0 - 28 + j * 4, 10 - j, 4);   // a Legion banner
    art.rect(ctx, C.vi, bx + 4, hy0 - 24, 2, 2);
    ctx.restore();
  }
  SW.sagaWalker = walker;
  const _ed = Enemy.prototype.draw;
  Enemy.prototype.draw = function (ctx, cam) {
    if (isWalker(this) && !this.dead) {
      const gy = R(this.y - cam.y), x = R(this.x - cam.x - (this.face || 1) * 16);
      walker(ctx, x, gy, this.face || 1, SW.frame, 0);
      if (SW.frame % 40 === 0 || SW.frame % 40 === 20) fx.dust(this.x - (this.face || 1) * 16 + (SW.frame % 40 ? 40 : -40), this.y, 4);
    }
    return _ed.apply(this, arguments);
  };
  // when the captain falls, the walker kneels and comes apart
  const _die = Enemy.prototype.die;
  Enemy.prototype.die = function (g) {
    const was = this.dead, r = _die.apply(this, arguments), z = G.zone;
    if (!was && this.dead && isWalker(this) && z && z.shots && N && N.Vis) {
      const x0 = this.x - (this.face || 1) * 16, y0 = this.y, d = this.face || 1;
      fx.shake(8, 30);
      z.shots.push(new N.Vis(x0, y0, 80, (ctx, sx, sy, t) => {
        const k = Math.min(1, t / 50);
        walker(ctx, sx, sy, d, SW.frame, k);
        if (t % 6 === 0 && t < 60) { fx.debris(x0 + (Math.random() - 0.5) * 80, y0 - 60 + k * 40, '#6e6c7c', 4); fx.dust(x0 + (Math.random() - 0.5) * 70, y0, 6); }
      }));
    }
    return r;
  };
})();
