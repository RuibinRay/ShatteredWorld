'use strict';
// Shattered Worlds - The Hollow Crown: the finale with the six saviours fighting together, and the invasion's look.
//   The other five    In a saviour's finale (chapter 6), against the Convergence and Sovereign Vael, the other five
//                     saviours drop in one at a time and strike with their element. When Vael is down to his last
//                     eighth, the hero's next hit brings all five in at once: the six strike the last blow together.
//   Sovereign Vael    drawn with a void aura, a slow rain of dark motes and a crown of empty light over his head.
//   The Hollow Legion marching silhouettes on the horizon of chapters 5 and 6 (the hundreds of thousands behind each
//                     wave you fight).
// Draw and fight only; it reads the running chapter from js/saga/saga-core.js (SW.saga) and changes no save.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, HR = D && D.heroes, art = SW.art, fx = SW.fx, SG = SW.saga = SW.saga || {};
  if (!G || !HR || !art || !SW.Zone) return;
  const W = SW.W, H = SW.H;
  const ELEMENT = { kael: 'THUNDER', nyra: 'SONG AND ICE', pyra: 'FIRE', gale: 'WIND', brakk: 'EARTH', nami: 'WATER' };
  const on = () => !!(G.state && G.state.saga && G.scene === 'play');
  const saviourFinale = () => on() && G.state.saga.ch === 6 && SG.roleOf && SG.roleOf(G.state.hero) === 'saviour';
  const isEngine = e => e && !e.dead && (e.type === 'convergence' || e.type === 'vael');

  // ================= the other five =================
  // one strike: drops in beside the boss, hits once, holds the pose, fades
  class Strike {
    constructor(id, boss, side, final) {
      Object.assign(this, { id, boss, side, final, t: 0, x: boss.x + side * (34 + Math.random() * 14), y: boss.y - 110, face: -side, front: true, sg: true });
    }
    update(g, z) {
      this.t++;
      const b = this.boss, landY = b.y;
      if (this.t <= 16) this.y += (landY - this.y) * 0.32;
      if (this.t === 16 && b && !b.dead) {
        const h = HR[this.id], last = this.final === 'last';
        let dmg = this.final ? (last ? b.hp + 50 : Math.max(1, Math.round(b.hpMax * 0.02))) : Math.round(b.hpMax * 0.035);
        // the ordinary strikes never take Vael below the last eighth, and never finish the Convergence: those are the hero's
        if (!this.final) dmg = Math.max(0, Math.min(dmg, b.hp - (b.type === 'vael' ? Math.ceil(b.hpMax * 0.13) : 1)));
        if (dmg > 0) b.takeHit({ dmg, srcX: this.x, kx: -this.side * 2, ky: -1.5, heavy: true, energy: true, team: 'player' }, g);
        fx.ring(b.x, b.y - 24, h.color, 6, 60, 22); fx.spark(b.x, b.y - 24, h.colorHi || '#ffffff', 16, 4); fx.shake(4, 12);
        try { SW.audio.sfx('heavy'); } catch (e) { /* no audio yet */ }
      }
      if (this.t > 64) this.gone = true;
    }
    draw(ctx, cam) {
      const h = HR[this.id]; if (!h) return;
      const a = this.t < 52 ? 1 : Math.max(0, 1 - (this.t - 52) / 12), anim = this.t < 16 ? 'air' : 'special', fr = this.t < 16 ? 0 : Math.min(3, (this.t - 16) >> 2);
      art.glow(ctx, this.x - cam.x, this.y - cam.y - 18, 22, h.color, 0.25 * a);
      art.draw(ctx, h.sheet, anim, fr, this.x - cam.x, this.y - cam.y, this.face < 0, { alpha: a });
      if (!this.final && this.t > 10 && this.t < 52) SW.text(ctx, h.name.toUpperCase() + ' - ' + ELEMENT[this.id], this.x - cam.x, this.y - cam.y - 46, h.colorHi || '#ffffff', { align: 'center', raw: true });
    }
  }
  const A = SG.allies = { t: 0, turn: 0, six: false, boss: null };
  function others() { return (SG.SAVIOURS || []).filter(id => id !== G.state.hero && HR[id]); }
  function strike(z, boss, id, side, final) { const s = new Strike(id, boss, side, final); z.ents.push(s); return s; }
  function tickAllies(z) {
    const boss = G.boss;
    if (!saviourFinale() || !isEngine(boss) || boss.dormant) { A.t = 0; return; }
    if (A.boss !== boss) { A.boss = boss; A.t = 150; if (boss.type === 'vael') A.six = false; G.toast('The other five are with you.', '#ffe066'); }
    if (G.busy()) return;
    if (--A.t > 0) return;
    const list = others(); if (!list.length) return;
    const id = list[A.turn++ % list.length];
    strike(z, boss, id, A.turn % 2 ? 1 : -1, false);
    A.t = 330 + Math.floor(Math.random() * 120);
  }
  // all six at once: the hero's hit on Vael below the last eighth brings the other five in, and the last of them ends it
  const _hit = G.onHit;
  G.onHit = function (atk, e, b) {
    const out = _hit.apply(this, arguments);
    try {
      if (!A.six && saviourFinale() && e && e.type === 'vael' && !e.dead && e.hp <= e.hpMax * 0.125) {
        A.six = true;
        const list = others();
        fx.flash('#ffffff', 18); fx.shake(10, 50);
        G.toast('ALL SIX AT ONCE', '#ffe066');
        list.forEach((id, i) => { const s = strike(G.zone, e, id, i % 2 ? 1 : -1, i === list.length - 1 ? 'last' : true); s.t = -i * 6; });
      }
    } catch (err) { console.error(err); }
    return out;
  };

  // ================= the Hollow Legion on the horizon =================
  // a decor entry the area draws behind its tiles; tickLegion keeps it in view
  // only where there is a horizon to march on
  const OUTDOOR = ['crater', 'dunes', 'glowwild', 'glasssea', 'lensworks', 'tethers', 'tetherclimb', 'anchor', 'scrapton', 'village', 'skyport', 'noble', 'skylift', 'milezero', 'meridian'];
  function wantLegion(z) {
    if (!on() || !SG.chap) return false;
    const S = G.state, n = S.saga.ch;
    return n >= 5 && n <= 6 && S.saga.phase === 'play' && SG.chap(S.hero, n).zone === z.id && OUTDOOR.indexOf(z.id) >= 0;
  }
  function tickLegion(z) {
    let d = z.decor.find(x => x.kind === 'sg_legion');
    if (!wantLegion(z)) { if (d) z.decor.splice(z.decor.indexOf(d), 1); return; }
    if (!d) { d = { kind: 'sg_legion', x: 0, y: 0, front: false }; z.decor.unshift(d); }
    d.x = G.cam.x + W / 2;
  }
  const _dd = SW.Zone.prototype.drawDecor;
  SW.Zone.prototype.drawDecor = function (ctx, d, cx, cy) {
    if (!d || d.kind !== 'sg_legion') return _dd.apply(this, arguments);
    const sheet = art.sheets.sg_hollow_soldier ? 'sg_hollow_soldier' : null;
    if (!sheet) return;
    const horizon = Math.round(H * 0.56), march = SW.frame * 0.35, par = cx * 0.3;
    ctx.save();
    for (let row = 0; row < 3; row++) {
      const k = 0.4 + row * 0.08, y = horizon + row * 7, gap = 13 - row * 2, off = (march * (1 + row * 0.3) - par * (1 + row * 0.15)) % gap;
      ctx.globalAlpha = 0.34 + row * 0.1;
      for (let x = -gap + off; x < W + gap; x += gap) {
        ctx.save(); ctx.translate(Math.round(x), y); ctx.scale(k, k);
        art.draw(ctx, sheet, 'run', Math.floor((SW.frame + x * 3) / 6) % 4, 0, 0, false);
        ctx.restore();
      }
    }
    ctx.restore();
  };

  // ================= Sovereign Vael's presence =================
  const B = SW.Boss && SW.Boss.prototype;
  if (B && B.draw) {
    const _bd = B.draw;
    B.draw = function (ctx, cam, g) {
      const vael = this.type === 'vael' && !this.dead, x = this.x - cam.x, y = this.y - cam.y;
      if (vael) art.glow(ctx, x, y - this.h / 2, 46, '#2a1048', 0.55);
      const out = _bd.apply(this, arguments);
      if (vael) {
        const t = SW.frame;
        // dark motes drifting up off him
        for (let i = 0; i < 6; i++) { const ph = (t * 0.6 + i * 37) % 60, mx = x + Math.sin(i * 2.1 + t * 0.03) * 14, my = y - ph; ctx.globalAlpha = (1 - ph / 60) * 0.7; art.rect(ctx, i % 2 ? '#b48cff' : '#120a24', Math.round(mx), Math.round(my), 2, 2); }
        ctx.globalAlpha = 1;
        // the crown of empty light, larger than his champions'
        // the crown of empty light: five white points over a hollow band, larger and brighter than his champions' crowns
        const cx = Math.round(x), cy = Math.round(y - this.h - 8), pulse = 0.8 + 0.2 * Math.sin(t * 0.08);
        art.glow(ctx, cx, cy - 6, 26, '#b48cff', 0.35 * pulse);
        ctx.globalAlpha = pulse;
        art.rect(ctx, '#ffffff', cx - 13, cy, 27, 2); art.rect(ctx, '#e8d8ff', cx - 13, cy + 2, 27, 1);
        [[-13, 7], [-7, 10], [0, 13], [6, 10], [12, 7]].forEach(([dx, hh]) => { art.rect(ctx, '#ffffff', cx + dx, cy - hh, 2, hh); art.rect(ctx, '#b48cff', cx + dx, cy - hh - 1, 2, 1); });
        ctx.globalAlpha = 1;
      }
      return out;
    };
  }

  // every frame of play
  const _zu = SW.Zone.prototype.update;
  SW.Zone.prototype.update = function (g) {
    const out = _zu.apply(this, arguments);
    if (on() && this === G.zone && this.id !== 'versus') { try { tickAllies(this); tickLegion(this); } catch (e) { console.error(e); } }
    return out;
  };
})();
