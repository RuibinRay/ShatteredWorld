'use strict';
// Shattered Worlds — how bosses look. Loaded after skillfx.js; only adds and wraps. Nothing here changes a boss's timing,
// hitboxes or damage (finalboss.js does that for the last fight).
//   entrance  letterbox bars slide in and the boss's name and title are announced in its colour
//   aura      a glow on the ground and motes rising off the body, in the boss's colour; hotter and faster when enraged
//   tells     during a wind-up the boss flashes, a glint shows over its head and its colour gathers in
//   enrage    the switch to the second phase throws rings and a burst of the boss's colour; then it pulses red
//   death     a chain of bursts across the body, then a white flash, rays of light and debris
//   bar       the health bar keeps a pale trail of recent damage, with a frame in the boss's colour
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, text = SW.text, W = SW.W, H = SW.H, rand = SW.rand;
  const B = SW.Boss, K = SW.skillfx;
  if (!B) return;

  // ================= colours =================
  const COL = { director: '#b48cff', fused: '#b48cff', convergence: '#e8d8ff', baron: '#ff8a3a', glowmother: '#b8ff40', champ: '#ff5a3a', vane: '#d9b45a',
    quist: '#c8d4f0', morrow: '#7dffa0', kessen: '#22d3ee', alpha: '#ffffff', warden3: '#6fd3e8', tusk: '#ff8a3a', warden: '#6fd3e8', grist: '#5cff7a',
    brandt: '#ffb060', dren: '#ff8a3a', hale: '#b06cff', crake: '#ffd24a', slag: '#ff8a3a', ante: '#ffd24a', cinder: '#ff5a1f', holt: '#c8d4f0',
    voss: '#ff5a5a', ilse: '#7fd8ff', penn: '#ffd24a', purl: '#e04dff', bellows: '#ff8a3a', korr: '#a0a8c4' };
  const colOf = b => COL[b.type] || (b.def && b.def.col) || '#ff5a5a';
  const VIOLET = '#b48cff';

  // ================= aura, tells, enrage =================
  const _bu = B.prototype.update; B.prototype.update = function (g, z) {
    const ph0 = this.phase, tele0 = this.tele || 0;
    const r = _bu.apply(this, arguments);
    if (this.dead || this.dormant || !g.state) return r;
    const col = colOf(this), hot = this.phase === 2 || this.desperate;
    this.fxT = (this.fxT || 0) + 1;
    // motes rising off the body
    if (this.fxT % (hot ? 3 : 6) === 0 && K) K.add('impact', this.x + rand(-this.w / 2, this.w / 2), this.y - rand(4, this.h), rand(-0.3, 0.3), rand(-1.4, -0.5), { col: hot && this.fxT % 2 ? '#ff5a3a' : col, g: -0.02, life: 18, shape: 'ember' });
    // a wind-up: the colour gathers in, a glint pops over the head as it starts
    if ((this.tele || 0) > 0) {
      if (tele0 <= 0) { this.glintT = 14; fx.ring(this.x, this.y - this.h / 2, col, this.h, 6, 10); }
      if (K && this.fxT % 2 === 0) K.gather('impact', this.x, this.y - this.h / 2, 1, this.h * 0.9);
    }
    if (this.glintT > 0) this.glintT--;
    // enrage: rings, a burst and a shake
    if (ph0 === 1 && this.phase === 2) {
      for (let i = 0; i < 3; i++) fx.ring(this.x, this.y - this.h / 2, i ? col : '#ffffff', 6 + i * 8, 70 + i * 20, 20 + i * 4);
      if (K) K.emit('impact', this.x, this.y - this.h / 2, 24, { power: 1.8, col: '#ff5a3a' });
      fx.flash('#ff5a3a', 8); fx.shake(6, 20);
    }
    return r;
  };
  const _bd = B.prototype.draw; B.prototype.draw = function (ctx, cam, g) {
    if (this.dormant || this.gone) return _bd.apply(this, arguments);
    const col = colOf(this), hot = this.phase === 2 || this.desperate, x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), t = this.fxT || 0;
    if (!this.dead) {   // the glow on the ground under it, and a soft halo
      const w = Math.round(this.w * 0.9 + 14 + Math.sin(t * 0.12) * 3);
      ctx.globalAlpha = hot ? 0.38 : 0.24; art.rect(ctx, hot ? '#ff5a3a' : col, x - w, y - 1, w * 2, 2); art.rect(ctx, hot ? '#ff5a3a' : col, x - (w >> 1), y - 2, w, 1); ctx.globalAlpha = 1;
      art.glow(ctx, x, y - this.h / 2, this.h * 0.9, hot ? '#ff5a3a' : col, hot ? 0.13 + 0.05 * Math.sin(t * 0.3) : 0.08);
    }
    const r = _bd.apply(this, arguments);
    if (this.dead) return r;
    // a wind-up flashes the body; an enraged boss pulses red
    const pose = this.pose ? this.pose() : null;
    const flashA = (this.tele || 0) > 0 ? (t % 6 < 3 ? 0.35 : 0.12) : hot ? 0.1 + 0.08 * Math.sin(t * 0.25) : 0;
    if (pose && flashA > 0 && art.sheets[this.sheet]) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; art.draw(ctx, this.sheet, pose[0], pose[1], x, y, this.face < 0, { alpha: flashA, flash: true }); ctx.restore(); }
    if (this.glintT > 0) { const k = this.glintT / 14, gy = y - this.h - 10, s = Math.round(2 + 6 * k); art.rect(ctx, '#ffffff', x - s, gy, s * 2 + 1, 1); art.rect(ctx, '#ffffff', x, gy - s, 1, s * 2 + 1); art.rect(ctx, col, x - 1, gy - 1, 3, 3); }
    return r;
  };

  // ================= death =================
  const _die = B.prototype.die; B.prototype.die = function (g, atk) {
    const r = _die.apply(this, arguments), z = (g || G).zone, b = this, col = colOf(this);
    if (!z || !z.shots) return r;
    const box = { x: b.x, y: b.y, w: b.w, h: b.h };
    z.shots.push({ t: 0, update() {
      this.t++;
      if (this.t < 56 && this.t % 6 === 0) { const px = box.x + rand(-box.w / 2, box.w / 2), py = box.y - rand(4, box.h); fx.ring(px, py, this.t % 12 ? col : '#ffffff', 2, 18, 10); if (K) K.emit('impact', px, py, 8, { power: 1.2, col }); SW.audio.sfx('burst'); fx.shake(3, 6); }
      if (this.t === 60) { fx.flash('#ffffff', 16); fx.shake(10, 30); SW.audio.sfx('explode'); for (let i = 0; i < 4; i++) fx.ring(box.x, box.y - box.h / 2, i % 2 ? col : '#ffffff', 4 + i * 10, 60 + i * 30, 20 + i * 4); fx.debris(box.x, box.y - box.h / 2, col, 16); if (K) K.emit('impact', box.x, box.y - box.h / 2, 30, { power: 2.2, col }); }
      if (this.t > 90) this.gone = true;
    }, draw(ctx, cam) {   // rays of light from the body as it goes
      if (this.t > 76) return;
      const cx = Math.round(box.x - cam.x), cy = Math.round(box.y - box.h / 2 - cam.y), k = Math.min(1, this.t / 50), fade = this.t > 60 ? (76 - this.t) / 16 : 1;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5 * fade;
      for (let i = 0; i < 10; i++) { const a = i * 0.628 + this.t * 0.02, l = Math.round((30 + (i % 3) * 20) * k); art.line(ctx, i % 2 ? col : '#ffffff', cx, cy, Math.round(cx + Math.cos(a) * l), Math.round(cy + Math.sin(a) * l), 2); }
      ctx.restore();
    } });
    return r;
  };

  // ================= entrance and the health bar =================
  let seen = null, introT = 0;
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    const b = g.boss, live = b && !b.dormant && !b.gone && !b.dead;
    if (live && b !== seen && !g.busy()) { seen = b; introT = 110; }   // after the boss's opening lines, not under them
    if (!b) seen = null;
    _hud(ctx, g);
    if (live) {
      const col = colOf(b);
      // a trail of recent damage behind the bar, and a frame in the boss's colour
      if (b.trailHp === undefined || b.trailHp < b.hp) b.trailHp = b.hp;
      if (b.trailHp > b.hp) b.trailHp = Math.max(b.hp, b.trailHp - b.hpMax * 0.004);
      const x0 = 100, y0 = 244, w0 = 280, a = Math.max(0, b.hp / b.hpMax), tr = Math.max(0, b.trailHp / b.hpMax);
      if (tr > a) art.rect(ctx, '#ffe0a0', x0 + Math.round(w0 * a), y0, Math.max(1, Math.round(w0 * (tr - a))), 6);
      ctx.globalAlpha = 0.85; art.rect(ctx, col, x0 - 2, y0 - 2, w0 + 4, 1); art.rect(ctx, col, x0 - 2, y0 + 7, w0 + 4, 1); art.rect(ctx, col, x0 - 2, y0 - 2, 1, 10); art.rect(ctx, col, x0 + w0 + 1, y0 - 2, 1, 10); ctx.globalAlpha = 1;
      if (b.desperateAt) art.rect(ctx, '#ffffff', x0 + Math.round(w0 * b.desperateAt), y0 - 1, 1, 8);
    }
    if (introT > 0 && b) {
      introT--;
      const k = Math.min(1, (110 - introT) / 12) * Math.min(1, introT / 14), col = colOf(b), bar = Math.round(22 * k);
      art.rect(ctx, '#000000', 0, 0, W, bar); art.rect(ctx, '#000000', 0, H - bar, W, bar);
      ctx.globalAlpha = k; art.rect(ctx, col, 0, bar, W, 1); art.rect(ctx, col, 0, H - bar - 1, W, 1);
      const slide = Math.round((1 - Math.min(1, (110 - introT) / 16)) * 120);
      // below the toasts (the finale's "ULTIMATE READY" shows at the same moment); the area name, shown lower in the
      // middle, only appears when a map is entered, never when a boss steps in
      ctx.globalAlpha = 0.55 * k; art.rect(ctx, '#05060c', 0, 72, W, 46); ctx.globalAlpha = k;
      text(ctx, b.def.name, W / 2 - slide, 78, col, { align: 'center', scale: 2 });
      art.rect(ctx, col, W / 2 - 90 + slide, 96, 180, 1);
      if (b.def.sub) text(ctx, b.def.sub, W / 2 + slide, 102, '#ffffff', { align: 'center' });
      ctx.globalAlpha = 1;
    }
  };

  SW.bossfx = { COL, colOf };
})();
