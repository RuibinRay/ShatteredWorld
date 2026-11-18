'use strict';
// Shattered Worlds — Itsuki's combos flow (the user, 2026-11-17: "keep the reduced damage and improve the combo fluency, you
// can change the combo length but each is still each element, and you can change other attack moves, and make him have
// the best combo"). Loaded after js/itsuki-tune.js; only wraps. What was in the way (measured with the move lab):
//   - from 16 px his fourth J missed: every J steps him in after the target, and by the fourth he had walked past it
//   - the fourth J (earth) knocked the target down and away: nothing could follow it on the ground
//   - each J's element burst counted as a second hit toward the game's juggle limit (12), so long strings died early
//   - water, the fifth element, was not in the chain at all
// Now:
//   J x5   fire, wind, thunder, earth, WATER: five hits, one element each. Earth is a heavy link (a short hop, no knock-
//          down); water is the finisher, a rising wave that lifts the target so K (jump) carries the string into the air
//   reach  his step-in stops just in front of whoever he is hitting, so every hit lands from any distance
//   juggle the element burst on a J does not count toward the juggle limit (the J itself still does)
// Damage: his skills stay at the reduced 0.7 (js/itsuki-tune.js); the J chain gains the water hit.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, V = SW.versus, P = SW.Player && SW.Player.prototype, I = SW.input;
  const C = D.combat, CI = C && C.clan_itsuki;
  if (!P || !CI || CI.length < 4) return;
  const IF = SW.itsukiFlow = { on: true };
  const isIt = p => !!(p && p.G && p.G.state && p.G.state.hero === 'itsuki');

  // ---------- the chain: five hits, five elements ----------
  const EARTH = CI[3];
  if (!CI[4]) {
    // the earth hit: still heavy, but a link now (a short hop in place, no knock-down)
    Object.assign(EARTH, { fin: false, down: false, kx: 1.2, ky: -2.2, stun: 30, hitAt: 7, hitEnd: 12, dur: 20 });
    // the water hit: the finisher, a wave that rises under the target (the launcher pose: js/combolink.js gives a launcher
    // pose a full jump, so K after it carries the string into the air)
    CI.push(Object.assign({}, EARTH, { anim: 'launcher', dmg: 16, hitAt: 7, hitEnd: 12, dur: 24, box: [0, -48, 56, 48], kx: 0.5, ky: -6.4, launch: true, down: false, stun: 44, slash: 1, fin: true, itsEl: 4, itsMove: 'j' }));
  }
  const WATER = CI[4];
  // the target in front of him (Versus: the other fighter; the story: the nearest enemy ahead)
  function foeAhead(p) {
    if (G.scene === 'vs' && V && V.f && V.f.length === 2) { const f = V.f.find(x => x.p !== p); return f && f.p && !f.p.dead ? f.p : null; }
    const z = p.G && p.G.zone; if (!z) return null;
    let best = null, bd = 90; for (const e of z.ents) { if (!e.hittable || e.team !== 'enemy' || e.dead) continue; const d = (e.x - p.x) * p.face; if (d > -6 && d < bd && Math.abs(e.y - p.y) < 50) { bd = d; best = e; } }
    return best;
  }
  const _up = P.update;
  P.update = function (g, z) {
    if (IF.on && this.state === 'attack' && isIt(this) && !this.dead) {
      const a = this.atk;
      // the fifth J: the game's own chain stops at four (actors.js), so the water hit is started here, in the same window
      if (a === EARTH && this.combo === 4 && (this.st > a.hitEnd || (this.connected && this.st > a.hitAt + 2)) && I.buffered('attack', 9) && !I.held('up') && !I.held('down')) {
        I.consume('attack');
        const dir = I.held('left') ? -1 : I.held('right') ? 1 : 0; if (dir) this.face = dir;
        this.startAttack(WATER); this.combo = 5;
      }
      // do not walk through the target: the step-in after a connected hit stops just in front of it
      const q = foeAhead(this);
      if (q) { const d = (q.x - this.x) * this.face; if (d < 24 && this.vx * this.face > 0) this.vx = 0; }
    }
    return _up.apply(this, arguments);
  };

  // ---------- the element burst on a J does not use up the juggle limit ----------
  // (and the finisher's own burst, which lands right after the water hit with a small lift, does not cancel the launch)
  // (and the earth crash at the end of his air string, and its burst, spike the target down into a long stagger instead of
  // knocking it flat, so the five Js can start again as they land)
  // DAMAGE SCALING: the long string should not undo the damage cut the user asked to keep (the full loop, J x5 > K > air x3 >
  // J x5, came to 455 with no energy: a knock-out from one opening). Deep in a combo each hit deals less: from the 6th hit
  // on (the game's juggle count) IF.pro[0], from the 10th IF.pro[1]
  IF.pro = [0.55, 0.3];
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const vy0 = this.vy, air0 = this.state === 'hurt' && vy0 < -3;
    if (IF.on && atk && atk.dmg && this.state === 'hurt' && (this.juggle || 0) >= 6 && G.scene === 'vs' && V && V.f && V.f.length === 2) {
      const a = V.f.find(f => f.p !== this);
      if (a && a.hero === 'itsuki' && a.p.state !== 'ult') { const k = this.juggle >= 10 ? IF.pro[1] : IF.pro[0]; atk = arguments[0] = Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * k)) }); }
    }
    // (in the air, his hits barely push sideways, so the target comes down in front of him, not 70 px away)
    if (IF.on && atk && G.scene === 'vs' && V && V.f && V.f.length === 2) {
      const a = V.f.find(f => f.p !== this);
      if (a && a.hero === 'itsuki' && a.p.state === 'airatk') {
        // (a push of 0 means "the default 2.6" in actors.js, so the smallest push is 0.05)
        const o = { kx: (Math.sign(atk.kx || 0) || 1) * SW.clamp(Math.abs(atk.kx || 0), 0.05, 0.6) };
        if (atk.down && a.p.atk && a.p.atk.itsMove === 'air2') Object.assign(o, { down: false, stun: Math.max(atk.stun || 0, 44) });
        arguments[0] = Object.assign({}, atk, o);
      }
    }
    const r = _th.apply(this, arguments);
    if (IF.on && r === 'hit' && air0 && this.vy > vy0 && G.scene === 'vs' && V && V.f && V.f.length === 2) {
      const a = V.f.find(f => f.p !== this);
      if (a && a.hero === 'itsuki' && a.p.atk === WATER) this.vy = vy0;
    }
    if (IF.on && r === 'hit' && atk && atk.energy && G.scene === 'vs' && V && V.f && V.f.length === 2) {
      const a = V.f.find(f => f.p !== this);
      if (a && a.hero === 'itsuki' && (a.p.state === 'attack' || a.p.state === 'airatk') && this.juggle > 0) this.juggle--;
    }
    return r;
  };
})();
