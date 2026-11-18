'use strict';
// Shattered Worlds — checks for the Nightmare move knowledge (js/hardcore-skill.js). Not loaded by the game.
// Load after tools/harness.js, tools/hardcore-train.js (record server, port 8793). Runs rounds one frame per tick, in
// batches that fit in one console call (the page's timers are slow while its tab is hidden):
//   KT.jobs('hard' | 'mirror')   the round list: every hero against three Hard opponents, or Nightmare against Nightmare
//   KT.run(jobs, ms)             plays rounds from where the last call stopped, for up to ms; then KT.report()
//   KT.report()                  rounds won, health margin, and for every kind of decision how often it was taken, how
//                                often it landed (the opponent lost health within 50 frames) and how often it was hit back
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, HC = SW.hardcore, HT = window.HT;
  if (!HT || !HC) return;
  const ALL = SW.data.heroOrder;
  const KT = window.KT = { pos: 0, res: [], use: {}, eff: {}, pend: [] };
  KT.jobs = function (kind) {
    const out = [];
    if (kind === 'mirror') ALL.forEach((a, i) => { const b = ALL[(i * 11 + 7) % ALL.length]; if (b !== a && b !== 'convergence' && a !== 'convergence') out.push({ a, b, st: 1 + (i % 3), la: 3, lb: 3 }); });
    else ALL.forEach((a, i) => { for (let r = 0; r < 3; r++) { const b = ALL[(i * 7 + 5 + r * 17) % ALL.length]; if (b !== a) out.push({ a, b: b === 'convergence' ? 'kael' : b, st: 1 + ((i + r) % 3), la: 3, lb: 2 }); } });
    return out;
  };
  KT.reset = function () { KT.pos = 0; KT.res = []; KT.use = {}; KT.eff = {}; KT.pend = []; };
  const LAB = /^(ANTI-AIR|ZONE|POKE|PUNISH FROM RANGE|WHIFF PUNISH -|HIT THE CHARGE|BAIT THE COUNTER|POWER UP -|AMBUSH FROM BETWEEN WORLDS|STRIKE THROUGH ITS MOVE|THROW FROM BETWEEN WORLDS|REVERSAL|STRING|THROW|PERFECT GUARD|COUNTER - |PUNISH STUN|CONFIRM|ULTIMATE|POWER UP$)/;
  function watchFrame() {
    if (!(V.f && V.f.length === 2 && V.phase === 'fight')) { KT.pend.length = 0; return; }
    V.f.forEach((f, i) => {
      const h = f.hc; if (!h || !h.why || h.whyT !== V.t || h.why === h.ktLast) return;
      h.ktLast = h.why;
      const m = h.why.match(LAB); if (!m) return;
      const lab = m[1].replace(/ - $/, '').replace(/ -$/, '');
      const mv = / - /.test(h.why) ? h.why.split(' - ')[1].split(' (')[0] : '';
      KT.use[lab] = (KT.use[lab] || 0) + 1;
      if (mv && !/^(PERFECT GUARD|COUNTER)/.test(lab)) { const u = KT.use['moves:' + f.hero] || (KT.use['moves:' + f.hero] = {}); u[mv] = (u[mv] || 0) + 1; }
      const o = V.f[1 - i];
      if (!/PERFECT GUARD|POWER UP/.test(lab)) KT.pend.push({ f, o, lab, t: V.t, hpO: o.state.hp, hpMe: f.state.hp });
    });
    for (let j = KT.pend.length - 1; j >= 0; j--) {
      const e = KT.pend[j]; if (V.t - e.t < 50) continue;
      const E = KT.eff[e.lab] || (KT.eff[e.lab] = { n: 0, hit: 0, dmg: 0, hurt: 0 });
      E.n++; const d = e.hpO - e.o.state.hp; if (d > 0) { E.hit++; E.dmg += d; } if (e.hpMe - e.f.state.hp > 0) E.hurt++;
      KT.pend.splice(j, 1);
    }
  }
  KT.run = function (jobs, ms) {
    const t0 = performance.now(), I = SW.input;
    const tick = G.tick;
    G.tick = function () { const r = tick.apply(this, arguments); watchFrame(); return r; };
    try {
      while (KT.pos < jobs.length && performance.now() - t0 < (ms || 15000)) {
        const j = jobs[KT.pos++]; HT.stageNow = j.st || 1;
        const r = HT.round(j.a, j.b, j.la, j.lb);
        KT.res.push(Object.assign({}, j, { w: r ? r.w : -2, hp: r ? r.hp : null, n: r ? r.n : 0 }));
        KT.pend.length = 0;
      }
    } finally { G.tick = tick; }
    return { done: KT.pos, of: jobs.length };
  };
  KT.report = function () {
    const R = KT.res.filter(r => r.hp), won = R.filter(r => r.w === 0).length, ko = R.filter(r => r.w >= 0).length;
    const margin = R.reduce((s, r) => s + r.hp[0] - r.hp[1], 0) / Math.max(1, R.length);
    const eff = {}; Object.entries(KT.eff).sort((a, b) => b[1].n - a[1].n).forEach(([k, e]) => { eff[k] = e.n + ' used, ' + Math.round(100 * e.hit / e.n) + '% landed (' + Math.round(e.dmg / Math.max(1, e.hit)) + ' dmg), ' + Math.round(100 * e.hurt / e.n) + '% hit back'; });
    const heroes = Object.keys(KT.use).filter(k => k.startsWith('moves:'));
    const distinct = heroes.map(k => Object.keys(KT.use[k]).length);
    return { rounds: R.length, won: Math.round(1000 * won / Math.max(1, R.length)) / 10, ko: Math.round(100 * ko / Math.max(1, R.length)), sec: Math.round(R.reduce((s, r) => s + r.n, 0) / Math.max(1, R.length) / 60), margin: Math.round(100 * margin),
      lost: R.filter(r => r.w !== 0).map(r => r.a + '>' + r.b + (r.w === -1 ? '(time)' : '')).join(' '), eff,
      skillsPerHero: distinct.length ? Math.round(10 * distinct.reduce((a, b) => a + b, 0) / distinct.length) / 10 : 0, heroesUsingSkills: distinct.length };
  };
})();
