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
// 2026-11-23 (the user: every hero's Versus win rate within about +-20 of 50%, then "improve skill dmg if too weak"):
// SW.weakSkills.per multiplies the skill hits of each hero that was below 50% (on top of mul for the 25 above), solved
// with tools/band-balance.js. Story duels and the story are untouched.
(function () {
  const SW = window.SW, V = SW && SW.versus, P = SW && SW.Player && SW.Player.prototype;
  if (!P || !P.takeHit || !V) return;
  const WS = SW.weakSkills = {
    mul: 1.2,
    heroes: ['dune', 'vesna', 'oda', 'lin', 'convergence', 'mako', 'kiri', 'fumi', 'kova', 'nyra', 'coda', 'tarek', 'nami',
      'brann', 'thorne', 'sora', 'ryo', 'slick', 'hollis', 'isolde', 'gale', 'tor', 'opal', 'vex', 'mika'],
    per: {
      aldric: 1.04, apis: 1.07, ashka: 1.88, brakk: 1.11, brann: 1.14, coda: 1.18, convergence: 1.28, dune: 1.04,
      dyna: 1.21, elixa: 1.23, fenn: 1.27, ferra: 1.03, fumi: 1.12, gale: 1.32, garo: 1.35, hart: 1.08, hex: 1.08,
      hollis: 1.25, isa: 1.45, isolde: 1.1, ivo: 1.12, jax: 1.06, kael: 1.33, kestra: 1.46, kiri: 1.59, kova: 1.23,
      lin: 1.54, lux: 2.16, mako: 1.24, maren: 1.09, mika: 1.19, moro: 1.42, nami: 1.5, nyra: 1.09, oda: 1.15,
      opal: 1.36, pell: 1.66, pyra: 1.27, rue: 1.11, ryo: 1.28, sable: 1.14, slick: 1.46, sora: 1.05, tarek: 1.55,
      tarn: 1.27, taro: 1.24, thorne: 1.34, tor: 1.23, ume: 2.05, vesna: 1.55, vesper: 1.5, vex: 1.01, yara: 1.66,
      zara: 1.32
    }
  };
  const isSkill = (atk, p) => !!(atk && atk.energy && atk.dmg > 0 && p && p.state !== 'ult' && p.state !== 'attack' && p.state !== 'airatk');
  // in Versus, takeHit runs on the fighter being hit (js/versus.js has made it the current fighter): the attacker is the other one
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const gg = g || this.G;
    if (gg && gg.scene === 'vs' && V.mode !== 'duel' && V.f && V.f.length === 2) {
      const a = V.f.find(f => f.p !== this);
      const m = a && a.p !== this ? (WS.heroes.indexOf(a.hero) >= 0 ? WS.mul : 1) * ((WS.per && WS.per[a.hero]) || 1) : 1;
      if (m !== 1 && isSkill(atk, a.p))
        return _th.apply(this, [Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * m)) })].concat([].slice.call(arguments, 1)));
    }
    return _th.apply(this, arguments);
  };
})();
