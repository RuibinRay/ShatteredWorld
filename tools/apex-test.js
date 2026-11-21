'use strict';
// tools/apex-test.js — checks for an apex hero (not loaded by the game). Needs tools/harness.js, tools/nami-test.js and
// tools/look-test.js loaded first, on the record server (port 8793). Never clears localStorage.
//   AT.check(hero)            the weapon baked, the ultimate hooked, the Versus numbers
//   AT.ult(hero, offs)        recordings/apex-<hero>-ult.png: the ultimate at its own frames (strings: from the blow)
//   AT.j(hero)                recordings/apex-<hero>-j.png: the J chain, frame by frame
//   AT.bots(hero)             three Hard bot matches against varied heroes: errors, ultimates seen
(function () {
  const SW = window.SW, LT = window.LT, NT = window.NT;
  const AT = window.AT = {
    check(hero) {
      const h = SW.data.heroes[hero], s = SW.art.sheets[h.sheet], pl = SW.ultGrand.planOf(hero), B = SW.versusBalance;
      return { weapon: s.cfg.weapon, armed: s.cfg.armed, apexUlt: !!pl.apex, len: pl.len, fin: pl.fin, dmg: B.DMG[hero], hp: B.HP[hero], err: SW.game.lastError || null };
    },
    async ult(hero, offs) {
      const pl = SW.ultGrand.planOf(hero);
      offs = offs || [14, 24, 40, 60, 84, 100, pl.bu || pl.fin - 24, '-10', '-2', '0', '3', '6', '14', '30', '48'];
      return LT.ult('apex-' + hero + '-ult.png', hero, offs);
    },
    async j(hero) {
      NT.start('kael', hero); NT.step(30);
      return LT.cap('apex-' + hero + '-j.png', { 2: ['KeyJ'], 14: ['KeyJ'], 26: ['KeyJ'], 38: ['KeyJ'] }, [4, 6, 8, 16, 18, 20, 28, 30, 32, 40, 42, 44, 48, 52, 56], [-30, -70, 150, 90], 50, 3);
    },
    bots(hero) { return LT.bots(hero, ['kael', 'tessa', 'rook'].filter(x => x !== hero).concat(hero === 'rook' || hero === 'tessa' ? ['nyra'] : [])); }
  };
  AT.setup = async function () {
    (function () { const m = {}; Storage.prototype.setItem = function (k, v) { m[k] = String(v); }; Storage.prototype.removeItem = function (k) { delete m[k]; }; Storage.prototype.clear = function () {}; })();
    SW.profile.all = true; SW.game.unlocked = () => true;
  };
})();
