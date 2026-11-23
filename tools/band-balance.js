'use strict';
// tools/band-balance.js — Versus balance for the whole roster into one band (not loaded by the game; needs
// tools/harness.js, tools/hardcore-train.js as HT and tools/nk-rank.js as NR). The user, 2026-11-23: "rebalance versus
// every hero win rate ... similar +-20%", for everyone, Itsuki and the apex sixteen included (Itsuki v2, 'itsuki2', may
// stay strong and is left out of the tables).
//   BB.run(name)      a full round robin, Nightmare vs Nightmare, both sides (64 x 63 rounds), in the background (NR)
//   BB.step(rows, k)  nudges SW.versusBalance.DMG / HP of every hero toward a 50% win rate from a finished run
//   BB.out(rows)      the heroes outside BB.BAND
//   BB.tables()       the numbers: { apex: for AP.TUNE in js/apex/apex-core.js, rest: for js/versus-balance.js,
//                     skill: for SW.weakSkills.per in js/weak-skills.js }
//   NR.tourney(name, BB.solo(h))   one hero against everyone, both sides
// The mirror-show boss rule (HC.MIR.boss: others may not slip Itsuki's combos in bot-vs-bot shows) is turned off while
// measuring, as tools/apex-balance.js did, so his numbers are what a player meets.
(function () {
  const SW = window.SW, B = SW.versusBalance, AP = SW.apex, NR = window.NR, HC = SW.hardcore;
  const WS = SW.weakSkills;
  const BB = window.BB = { BAND: [30, 70], LIM: { dmg: [0.12, 3], hp: [0.3, 2.2], skill: [1, 2.5] }, SKIP: ['itsuki2'], hist: [] };
  BB.heroes = () => NR.all().filter(h => BB.SKIP.indexOf(h) < 0);
  BB.run = function (name) { if (HC && HC.MIR) HC.MIR.boss = {}; NR.tourney(name, NR.robin(BB.heroes())); };
  const clamp = (v, [a, b]) => Math.max(a, Math.min(b, v)), r2 = v => Math.round(v * 100) / 100;
  // a hero under 50% (or still carrying a skill boost) moves its skill damage first (the user: "improve skill dmg if too
  // weak"; SW.weakSkills.per) and its health a little, and its general damage only once the skill boost is at the cap;
  // a hero over 50% loses damage and health (SW.versusBalance.DMG / HP)
  BB.step = function (rows, k) {
    k = k || 1; WS.per = WS.per || {};
    rows.forEach(r => {
      const h = r.hero; if (BB.SKIP.indexOf(h) >= 0) return;
      const d = (50 - r.win) / 100 + 0.2 * (-r.margin) / 100, f = Math.exp(k * d);
      if (f > 1 || (WS.per[h] || 1) > 1) {
        const s = clamp((WS.per[h] || 1) * Math.pow(f, 0.9), BB.LIM.skill); WS.per[h] = r2(s);
        if (s >= BB.LIM.skill[1] && f > 1) B.DMG[h] = r2(clamp((B.DMG[h] || 1) * Math.pow(f, 0.4), BB.LIM.dmg));
        B.HP[h] = r2(clamp((B.HP[h] || 1) * Math.pow(f, 0.3), BB.LIM.hp));
        if (WS.per[h] <= 1) delete WS.per[h];
      } else {
        B.DMG[h] = r2(clamp((B.DMG[h] || 1) * Math.pow(f, 0.6), BB.LIM.dmg));
        B.HP[h] = r2(clamp((B.HP[h] || 1) * Math.pow(f, 0.4), BB.LIM.hp));
      }
    });
    B.apply();
  };
  // one hero against all the others, both sides (for a single outlier: Itsuki's health was set this way)
  BB.solo = h => { const P = []; BB.heroes().forEach(o => { if (o !== h) { P.push([h, o]); P.push([o, h]); } }); return P; };
  BB.out = rows => rows.filter(r => r.win < BB.BAND[0] || r.win > BB.BAND[1]).map(r => r.hero + ' ' + r.win);
  BB.tables = function () {
    const apex = {}, rest = { DMG: {}, HP: {} };
    BB.heroes().forEach(h => {
      const d = B.DMG[h] || 1, p = B.HP[h] || 1;
      if (AP && AP.TOP.indexOf(h) >= 0) apex[h] = { dmg: d, hp: p }; else { rest.DMG[h] = d; rest.HP[h] = p; }
    });
    return { apex, rest, skill: Object.assign({}, WS.per) };
  };
})();
