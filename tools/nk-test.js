'use strict';
// tools/nk-test.js — measures Nightmare play (not loaded by the game; needs tools/hardcore-train.js loaded first, as HT).
//   NK.measure(heroes, o)   runs rounds in the background, in small slices; NK.res holds per-hero rows, NK.sum() the totals
//     o: { opp: 'mirror' (another Nightmare) | 'hard', reps: rounds per hero, lb: opponent level }
//   per round, per fighter: which of the 5 skills it used (U, S+U, I, S+I, W+O), its ultimates, and every combo it landed
//   (hits in a row on a reeling target: length, distinct skills, J share)
(function () {
  // (a hidden browser tab throttles timers to one a second; a message channel is not throttled)
  const later = fn => { const c = new MessageChannel(); c.port1.onmessage = () => fn(); c.port2.postMessage(0); };
  const SW = window.SW, G = SW.game, V = SW.versus, D = SW.data, HT = window.HT;
  const SLOTS = ['u', 'su', 'i', 'si', 'wo'];
  const NK = window.NK = { res: {}, done: false, q: [], log: [] };
  // per-fighter watch: a slot's cooldown starting = that skill used; a combo = the target's hits while it stays hurt
  function watch() {
    V.f.forEach((f, i) => {
      const p = f.p; if (!p) return;
      const w = f.nkw || (f.nkw = { used: {}, ult: 0, prev: {}, combos: [], cur: null, lastSt: null });
      const cd = p.cd || {};
      SLOTS.forEach(s => { const v = cd[s] || 0; if (v > (w.prev[s] || 0) + 2) { w.used[s] = 1; w.skill = s; w.skillT = V.t; } w.prev[s] = v; });
      // the kill (js/nightmare-kit.js): the opponent at an ultimate's share (47%) or less with the bar ready, and an ultimate started then
      const o = V.f[1 - i], leth = o && SW.nightmareKit && SW.nightmareKit.lethal && SW.nightmareKit.lethal(o);
      if (leth && SW.hardcore.ultReady && SW.hardcore.ultReady(f)) w.chance = 1;
      if (p.state === 'ult' && w.lastSt !== 'ult') { w.ult++; if (leth) w.killUlt = (w.killUlt || 0) + 1; }
      // what this fighter is doing now, as a token (for the combo it is building on the other)
      const tok = p.state === 'ult' ? 'X' : p.state === 'attack' || p.state === 'airatk' ? 'J' : w.skill && V.t - w.skillT < 40 ? w.skill : null;
      w.tok = tok; w.lastSt = p.state;
    });
    // combos: hits landed on fighter j while j stays in hurt; count the attacker's tokens
    V.f.forEach((f, j) => {
      const a = V.f[1 - j], w = a && a.nkw; if (!w) return;
      const q = f.p, hurt = q.state === 'hurt' || f.stunT > 0;
      if (hurt) {
        if (!w.cur) w.cur = { hits: 0, toks: [], hp0: f.state.hp };
        if (f.nkHp !== undefined && f.state.hp < f.nkHp - 0.5) { w.cur.hits++; w.cur.toks.push(w.tok || '?'); }
      } else if (w.cur) { if (w.cur.hits >= 3) w.combos.push(w.cur); w.cur = null; }
      f.nkHp = f.state.hp;
    });
  }
  // which slot a cast came from: wrap the bot's skill keys through cd changes instead (castSlot is a best guess)
  function round(a, b, la, lb) {
    const _t = G.tick; let rows = null;
    G.tick = function () { const r = _t.apply(this, arguments); if (V.phase === 'fight' && V.f && V.f.length === 2) watch(); return r; };
    try {
      if (V.f) V.f.forEach(f => { delete f.nkw; });
      const r = HT.round(a, b, la, lb, 5400);
      rows = r && V.f.map(f => f.nkw || { used: {}, ult: 0, combos: [] });
      return r && { r, rows };
    } finally { G.tick = _t; }
  }
  NK.round = round;
  function addRow(hero, w, won) {
    const R = NK.res[hero] || (NK.res[hero] = { rounds: 0, all5: 0, skills: 0, ult: 0, combos: 0, comboHits: 0, comboMixed: 0, comboJonly: 0, won: 0, miss: {}, chance: 0, killUse: 0, all5Won: 0 });
    R.rounds++; const n = SLOTS.filter(s => w.used[s]).length; R.skills += n; if (n === 5) R.all5++; R.ult += w.ult; if (won) { R.won++; if (n === 5) R.all5Won++; } if (w.chance) { R.chance++; if (w.killUlt) R.killUse++; }
    SLOTS.forEach(s => { if (!w.used[s]) R.miss[s] = (R.miss[s] || 0) + 1; });
    (w.combos || []).forEach(c => { R.combos++; R.comboHits += c.hits; const sk = new Set(c.toks.filter(t => t !== 'J' && t !== '?')); if (sk.size >= 2) R.comboMixed++; if (!sk.size) R.comboJonly++; });
  }
  NK.measure = function (heroes, o) {
    o = Object.assign({ opp: 'mirror', reps: 2, lb: 3 }, o || {});
    NK.res = {}; NK.done = false; NK.q = []; NK.t0 = performance.now();
    const all = D.heroOrder.filter(h => D.heroes[h]);
    heroes.forEach((h, i) => { for (let k = 0; k < o.reps; k++) NK.q.push([h, all[(i * 7 + k * 13 + 5) % all.length]]); });
    const step = () => {
      const t = performance.now();
      while (NK.q.length && performance.now() - t < 1200) {
        const [h, opp0] = NK.q.shift(), opp = opp0 === h ? 'kael' : opp0;
        const x = round(h, opp, 3, o.opp === 'hard' ? 2 : o.lb);
        if (!x) { NK.log.push('no round ' + h); continue; }
        addRow(h, x.rows[0], x.r.w === 0);
        if (o.opp === 'mirror' && x.rows[1]) addRow(opp, x.rows[1], x.r.w === 1);
      }
      if (NK.q.length) later(step); else { NK.done = true; NK.ms = performance.now() - NK.t0; }
    };
    later(step);
  };
  NK.sum = function (only) {
    const rows = Object.keys(NK.res).filter(h => !only || only.indexOf(h) >= 0).map(h => Object.assign({ hero: h }, NK.res[h]));
    const T = rows.reduce((a, r) => { Object.keys(r).forEach(k => { if (typeof r[k] === 'number') a[k] = (a[k] || 0) + r[k]; }); return a; }, {});
    const pct = (a, b) => (b ? Math.round(100 * a / b) : 0);
    return { heroes: rows.length, rounds: T.rounds, all5: pct(T.all5, T.rounds) + '%', skillsPerRound: (T.skills / T.rounds).toFixed(2), ultPerRound: (T.ult / T.rounds).toFixed(2),
      comboLen: (T.comboHits / Math.max(1, T.combos)).toFixed(1), combosMixed: pct(T.comboMixed, T.combos) + '%', combosJonly: pct(T.comboJonly, T.combos) + '%', killChances: T.chance, killUltUsed: pct(T.killUse, T.chance) + '%', won: pct(T.won, T.rounds) + '%', all5Winners: pct(T.all5Won, T.won) + '%', all5Losers: pct(T.all5 - T.all5Won, T.rounds - T.won) + '%',
      worst: rows.map(r => [r.hero, pct(r.all5, r.rounds), Object.keys(r.miss).sort((a, b) => r.miss[b] - r.miss[a]).slice(0, 2).join('/')]).sort((a, b) => a[1] - b[1]).slice(0, 12) };
  };
})();
