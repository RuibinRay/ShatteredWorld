'use strict';
// Shattered Worlds — Itsuki's skills hit 30% softer (the user, 2026-11-17: "reduce all itsuki skill damages by 30%").
// Every hit of his skills (U, S+U, I, S+I and his W+O signature: the hits marked as energy hits) deals 0.7 of what it did,
// in Versus, in story duels (they run on the Versus engine) and when he is played in the story. His J combo, throw and
// ultimate are not skills and are unchanged. It comes on top of js/ninjas7.js, where Heaven's Thunder and Thunder Palm
// already deal 0.75 in Versus (so those two now deal about 0.53 of their first numbers there).
// SW.itsukiTune.skill = 1 gives the old damage back.
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, P = SW.Player && SW.Player.prototype;
  if (!P || !P.takeHit) return;
  const IT = SW.itsukiTune = { skill: 0.7 };
  const soft = atk => Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * IT.skill)) });
  // a skill hit: an energy hit, not during his ultimate, and not the element burst his J swings and W+J carry (that one is
  // an energy hit too, landing on the same frame as the blade: it belongs to his melee, which stays as it was)
  const isSkill = (atk, p) => !!(atk && atk.energy && atk.dmg > 0 && p && p.state !== 'ult' && p.state !== 'attack' && p.state !== 'airatk');
  // Versus: a fighter is being hit, and the other fighter is Itsuki (by the time takeHit runs, js/versus.js has already
  // made the one being hit the current fighter, so the attacker is the other one)
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const gg = g || this.G, a = gg && gg.scene === 'vs' && V && V.f && V.f.length === 2 ? V.f.find(f => f.p !== this) : null;
    if (IT.skill !== 1 && gg && gg.scene === 'vs' && a && a.hero === 'itsuki' && a.p !== this && isSkill(atk, a.p)) return _th.apply(this, [soft(atk)].concat([].slice.call(arguments, 1)));
    return _th.apply(this, arguments);
  };
  // the story: Itsuki is the hero, and an enemy is being hit
  [SW.Enemy, SW.Boss].forEach(C => {
    const E = C && C.prototype; if (!E || !Object.prototype.hasOwnProperty.call(E, 'takeHit')) return;
    const _et = E.takeHit;
    E.takeHit = function (atk, g) {
      const gg = g || G;
      if (IT.skill !== 1 && gg && gg.scene !== 'vs' && gg.state && gg.state.hero === 'itsuki' && atk && atk.team === 'player' && isSkill(atk, gg.player)) return _et.apply(this, [soft(atk)].concat([].slice.call(arguments, 1)));
      return _et.apply(this, arguments);
    };
  });
})();
