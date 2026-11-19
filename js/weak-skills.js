'use strict';
// Shattered Worlds — the 25 weakest heroes' skills hit 20% harder (the user, 2026-11-18: "weakest 25 heroes in tournament
// increase their skill damage by 20%", then "run multiple tournaments"). Versus only; story duels and the story are untouched.
// The ranking: 16 tournaments run headless with tools/hardcore-train.js, 8 on Hard and 8 on Nightmare, both sides on the
// same level. Each tournament was 10 rounds of random pairings with random sides, so every hero fought 160 times.
// Weakest first, with the share of fights won:
//   dune 28.1, vesna 30, oda 32.5, lin 33.8, convergence 33.8, mako 34.4, kiri 35.6, fumi 35.6, kova 35.6, nyra 36.3,
//   coda 36.9, tarek 37.5, nami 38.1, brann 38.8, thorne 38.8, sora 39.4, ryo 39.4, slick 40, hollis 40, isolde 40.6,
//   gale 41.3, tor 41.9, opal 41.9, vex 42.5, mika 42.5   (26th: moro 43.1; the strongest: itsuki 98.1)
// A skill hit is an energy hit of U, S+U, I, S+I or W+O. It is not his ultimate, and not the element burst some J swings
// carry (the same test as js/itsuki-tune.js). It comes on top of any other tuning (js/combo-tune.js and the rest).
// SW.weakSkills.mul = 1 turns it off.
(function () {
  const SW = window.SW, V = SW && SW.versus, P = SW && SW.Player && SW.Player.prototype;
  if (!P || !P.takeHit || !V) return;
  const WS = SW.weakSkills = {
    mul: 1.2,
    heroes: ['dune', 'vesna', 'oda', 'lin', 'convergence', 'mako', 'kiri', 'fumi', 'kova', 'nyra', 'coda', 'tarek', 'nami',
      'brann', 'thorne', 'sora', 'ryo', 'slick', 'hollis', 'isolde', 'gale', 'tor', 'opal', 'vex', 'mika']
  };
  const isSkill = (atk, p) => !!(atk && atk.energy && atk.dmg > 0 && p && p.state !== 'ult' && p.state !== 'attack' && p.state !== 'airatk');
  // in Versus, takeHit runs on the fighter being hit (js/versus.js has made it the current fighter): the attacker is the other one
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const gg = g || this.G;
    if (WS.mul !== 1 && gg && gg.scene === 'vs' && V.mode !== 'duel' && V.f && V.f.length === 2) {
      const a = V.f.find(f => f.p !== this);
      if (a && a.p !== this && WS.heroes.indexOf(a.hero) >= 0 && isSkill(atk, a.p))
        return _th.apply(this, [Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * WS.mul)) })].concat([].slice.call(arguments, 1)));
    }
    return _th.apply(this, arguments);
  };
})();
