'use strict';
// Shattered Worlds - The Hollow Crown: the muster fighting beside the hero, and the invasion's look.
//   The muster        every hero rescued in chapter 6 (js/saga/saga-rescue.js). In the finale (chapter 7) they drop in
//                     one at a time and strike: the Legion's waves at the Crater, then Sovereign Vael. When Vael is
//                     down to his last eighth, the hero's next hit brings them all in at once, and the last of them
//                     ends it.
//   In a duel         SW.saga.fight passes `sgAllies` to SW.versus.duel: those heroes drop into the arena now and then
//                     and strike the rival (a champion a besieged hero is helping you fight, or Itsuki in the finale).
//                     They never land the last blow; against Itsuki's shield (saga-shield.js) they wear the shield.
//   Sovereign Vael    drawn with a void aura, a slow rain of dark motes and a crown of empty light over his head.
//   The Hollow Legion marching silhouettes on the horizon of an outdoor place the Legion still holds (a place with a
//                     hero not yet rescued) and of the Crater in the finale. A freed place is quiet.
// Draw and fight only; it changes no save.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, HR = D && D.heroes, art = SW.art, fx = SW.fx, SG = SW.saga = SW.saga || {}, V = SW.versus;
  if (!G || !HR || !art || !SW.Zone) return;
  const W = SW.W, H = SW.H;
  const on = () => !!(G.state && G.state.saga && G.scene === 'play');
  const finale = () => on() && G.state.saga.ch === 7 && G.state.saga.phase === 'play';
  const musterList = () => (SG.rescue ? SG.rescue.muster() : []);
  const sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no audio yet */ } };

  // ================= one strike in the world =================
  // drops in beside the target, hits once, holds the pose, fades
  class Strike {
    constructor(id, foe, side, final) {
      Object.assign(this, { id, foe, side, final, t: 0, x: foe.x + side * (34 + Math.random() * 14), y: foe.y - 110, face: -side, front: true, sg: true });
    }
    update(g) {
      this.t++;
      const b = this.foe;
      if (this.t <= 0) return;
      if (this.t <= 16) this.y += (b.y - this.y) * 0.32;
      if (this.t === 16 && b && !b.dead) {
        const h = HR[this.id], last = this.final === 'last', boss = b.type === 'vael' || b.type === 'convergence' || !!(b.def && b.def.boss) || b.isBoss;
        let dmg = this.final ? (last ? b.hp + 50 : Math.max(1, Math.round(b.hpMax * 0.02))) : boss ? Math.round(b.hpMax * 0.035) : (b.hp || 60) + 5;   // an ordinary soldier goes down to one strike
        // the ordinary strikes never take Vael below the last eighth: that blow is the hero's (and then everyone's)
        if (!this.final && boss) dmg = Math.max(0, Math.min(dmg, b.hp - (b.type === 'vael' ? Math.ceil(b.hpMax * 0.13) : 1)));
        if (dmg > 0) b.takeHit({ dmg, srcX: this.x, kx: -this.side * 2, ky: -1.5, heavy: true, energy: true, team: 'player' }, g);
        fx.ring(b.x, b.y - 24, h.color, 6, 60, 22); fx.spark(b.x, b.y - 24, h.colorHi || '#ffffff', 16, 4); fx.shake(4, 12);
        sfx('heavy');
      }
      if (this.t > 64) this.gone = true;
    }
    draw(ctx, cam) {
      const h = HR[this.id]; if (!h || this.t <= 0) return;
      const a = this.t < 52 ? 1 : Math.max(0, 1 - (this.t - 52) / 12), anim = this.t < 16 ? 'air' : 'special', fr = this.t < 16 ? 0 : Math.min(3, (this.t - 16) >> 2);
      art.glow(ctx, this.x - cam.x, this.y - cam.y - 18, 22, h.color, 0.25 * a);
      art.draw(ctx, h.sheet, anim, fr, this.x - cam.x, this.y - cam.y, this.face < 0, { alpha: a });
      if (!this.final && this.t > 10 && this.t < 52) SW.text(ctx, h.name.toUpperCase(), this.x - cam.x, this.y - cam.y - 46, h.colorHi || '#ffffff', { align: 'center', raw: true });
    }
  }
  const A = SG.allies = { t: 0, turn: 0, all: false, boss: null };
  function strike(z, foe, id, side, final) { const s = new Strike(id, foe, side, final); z.ents.push(s); return s; }
  function tickAllies(z) {
    const list = musterList();
    if (!finale() || !list.length || z.id !== 'crater') { A.t = Math.max(A.t, 120); return; }
    const boss = G.boss && !G.boss.dead && G.boss.type === 'vael' && !G.boss.dormant ? G.boss : null;
    if (boss && A.boss !== boss) { A.boss = boss; A.t = 150; A.all = false; G.toast('The muster is with you: ' + list.length + (list.length === 1 ? ' hero.' : ' heroes.'), '#ffe066'); }
    if (G.busy()) return;
    if (--A.t > 0) return;
    const R = SG.run, foes = ((R && R.foes) || []).filter(e => !e.dead && !e.gone && z.ents.indexOf(e) >= 0);
    const tgt = boss || (foes.length ? foes[Math.floor(Math.random() * foes.length)] : null);
    if (!tgt) { A.t = 30; return; }
    const id = list[A.turn++ % list.length];
    strike(z, tgt, id, A.turn % 2 ? 1 : -1, false);
    // more heroes, more often: about every 6 s with one, every 2.5 s with the whole muster
    A.t = Math.max(150, 380 - list.length * 5) + Math.floor(Math.random() * 90);
  }
  // everyone at once: the hero's hit on Vael below the last eighth brings the whole muster in, and the last ends it
  const _hit = G.onHit;
  G.onHit = function (atk, e, b) {
    const out = _hit.apply(this, arguments);
    try {
      if (!A.all && finale() && e && e.type === 'vael' && !e.dead && e.hp <= e.hpMax * 0.125) {
        const list = musterList();
        if (list.length) {
          A.all = true;
          fx.flash('#ffffff', 18); fx.shake(10, 50);
          G.toast(SG.rescue && SG.rescue.all() ? 'ALL OF THEM AT ONCE' : 'THE MUSTER, ALL AT ONCE', '#ffe066');
          const show = list.slice(-12);   // (at most twelve are drawn; the blow is everyone's)
          show.forEach((id, i) => { const s = strike(G.zone, e, id, i % 2 ? 1 : -1, i === show.length - 1 ? 'last' : true); s.t = -i * 5; });
        }
      }
    } catch (err) { console.error(err); }
    return out;
  };

  // ================= strikes inside a duel =================
  const DS = { t: 0, act: null, turn: 0, o: null };
  function duelAllies() { const o = V && V.mode === 'duel' && V.duelO; return o && o.sgAllies && o.sgAllies.length ? o.sgAllies.filter(id => HR[id]) : null; }
  function duelHit() {
    const f = V.f[1], p = f && f.p; if (!p || p.dead || !(f.state.hp > 1)) return;
    if (p.sgShield > 0) {   // Itsuki's shield takes it
      const d = Math.max(1, Math.round((p.sgShieldMax || 100) * 0.25)); p.sgShield = Math.max(1, p.sgShield - d);
      fx.text(p.x, p.y - 44, '-' + d, '#b48cff'); fx.ring(p.x, p.y - 20, '#b48cff', 5, 30, 12); sfx('block'); return;
    }
    const keep = G.state; let max = 300;
    G.state = f.state; try { max = p.hpMax(); } finally { G.state = keep; }
    const dmg = Math.max(1, Math.min(f.state.hp - 1, Math.round(max * 0.06)));
    f.state.hp -= dmg;
    fx.text(p.x, p.y - 44, String(dmg), '#ffe066'); fx.spark(p.x, p.y - 20, '#ffffff', 12, 3); fx.shake(4, 10); sfx('heavy');
    if (!p.atk && p.state !== 'guard') { p.enter('hurt'); p.hurtLen = 22; }
  }
  if (V && V.update && V.draw) {
    const _vu = V.update;
    V.update = function (g) {
      const out = _vu.apply(this, arguments);
      try {
        const list = duelAllies();
        if (!list || V.phase !== 'fight' || V.paused) { if (!list || V.phase === 'intro') { DS.act = null; DS.t = 360; } return out; }
        if (DS.o !== V.duelO) { DS.o = V.duelO; DS.t = 360; DS.turn = 0; DS.act = null; }
        if (DS.act) {
          const a = DS.act; a.t++;
          if (a.t === 14) duelHit();
          if (a.t > 48) DS.act = null;
        } else if (--DS.t <= 0) {
          const p = V.f[1].p, id = list[DS.turn++ % list.length];
          DS.act = { id, t: 0, side: p.x > V.f[0].p.x ? 1 : -1 };
          if (DS.turn === 1) G.toast(list.length === 1 ? HR[id].name + ' strikes beside you' : 'The muster strikes beside you', '#ffe066');
          DS.t = list.length === 1 ? 600 : Math.max(420, 660 - list.length * 6);   // one helper every 10 s; the muster a little more often
        }
      } catch (e) { console.error(e); }
      return out;
    };
    const _vd = V.draw;
    V.draw = function (ctx) {
      const out = _vd.apply(this, arguments);
      try {
        const a = DS.act; if (!a || !duelAllies() || !V.f[1]) return out;
        const h = HR[a.id], p = V.f[1].p, x = p.x + a.side * 30 - G.cam.x, y = p.y - G.cam.y - Math.max(0, 14 - a.t) * 6;
        const al = a.t < 36 ? 1 : Math.max(0, 1 - (a.t - 36) / 12);
        art.glow(ctx, x, y - 18, 22, h.color, 0.25 * al);
        art.draw(ctx, h.sheet, a.t < 14 ? 'air' : 'special', a.t < 14 ? 0 : Math.min(3, (a.t - 14) >> 2), x, y, a.side > 0, { alpha: al });
        if (a.t > 8 && a.t < 40) SW.text(ctx, h.name.toUpperCase(), x, y - 48, h.colorHi || '#ffffff', { align: 'center', raw: true });
      } catch (e) { console.error(e); }
      return out;
    };
  }

  // ================= the Hollow Legion on the horizon =================
  // a decor entry the area draws behind its tiles; tickLegion keeps it in view. Only where there is a horizon to
  // march on, and only while the Legion holds the place.
  const OUTDOOR = ['crater', 'dunes', 'glowwild', 'glasssea', 'lensworks', 'tethers', 'tetherclimb', 'anchor', 'scrapton', 'village', 'skyport', 'noble', 'skylift', 'milezero', 'meridian', 'pens'];
  function held(zid) {   // a hero not yet rescued is still in this place
    const Rs = SG.rescue; if (!Rs) return false;
    return Rs.others().some(id => Rs.plan(id).zone === zid && Rs.status(id) !== 'rescued');
  }
  function wantLegion(z) {
    if (!on() || OUTDOOR.indexOf(z.id) < 0) return false;
    const sg = G.state.saga;
    if (sg.ch === 7 && sg.phase === 'play') return z.id === 'crater';
    if ((sg.ch === 6 && sg.phase === 'play') || sg.phase === 'end') return held(z.id) || (z.id === 'crater' && sg.phase !== 'end');
    return false;
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
    // dimmer while a wave is up, so the live soldiers stand out from the army behind them (playtest)
    const R = SG.run, dim = R && R.wave >= 0 ? 0.55 : 1;
    ctx.save();
    for (let row = 0; row < 3; row++) {
      const k = 0.4 + row * 0.08, y = horizon + row * 7, gap = 13 - row * 2, off = (march * (1 + row * 0.3) - par * (1 + row * 0.15)) % gap;
      ctx.globalAlpha = (0.34 + row * 0.1) * dim;
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
