'use strict';
// tools/nk-train.js — MIXED combo routes for the Nightmare bot (not loaded by the game; needs tools/hardcore-train.js as
// HT). The user, 2026-11-20: "make sure combo is long ... dont make combos like JJJJJ you have to mix the skills".
//   NKT.mix(hero, o)      beam search against a stunned dummy, like HT.findRoutes, but:
//                           - a skill within the first 3 inputs, never more than 3 J in a row
//                           - routes are scored on damage plus a bonus for each different skill in them
//                           - the routes kept cover many skill SETS, not only the best per energy budget, so the bot can
//                             pick a combo with the skills it has not used yet this round (js/nightmare-kit.js)
//                           - every route kept is played again from 16 and 30 px and keeps its worst damage
//   NKT.all(list)         runs NKT.mix for each hero in the background, in slices; NKT.res, NKT.done
//   NKT.save()            writes recordings/hardcore-data.js through the record server (copy it to js/hardcore-data.js)
(function () {
  // (a hidden browser tab throttles timers to one a second; a message channel is not throttled)
  const later = fn => { const c = new MessageChannel(); c.port1.onmessage = () => fn(); c.port2.postMessage(0); };
  const SW = window.SW, HT = window.HT, HC = SW.hardcore, D = SW.data;
  if (!HT || !HT.setStage || !HT.testRoute) return;
  const SK = /[UuIiO]/g;
  const skillsOf = r => Array.from(new Set((r.match(SK) || []).map(c => c))).sort().join('');
  const jRun = r => Math.max(0, ...(r.match(/J+/g) || ['']).map(s => s.length));
  // pieces a route grows by: skills cancel into skills and into W+O, a J can follow a skill (js/combo-fluency.js)
  const EXT = ['J', 'JJ', 'U', 'u', 'I', 'i', 'O', 'JU', 'JI', 'Ju', 'Ji', 'JO', 'LKAAA', 'W', 'UI', 'Ui', 'Iu', 'Ii', 'iO', 'uI', 'IU', 'iU'];
  const SEED = ['JU', 'JI', 'Ju', 'Ji', 'JJU', 'JJI', 'JJu', 'JJi', 'JJJU', 'JJJI', 'JJJu', 'JJJi', 'U', 'I', 'u', 'i'];
  const NKT = window.NKT = { res: [], done: true, q: [], o: { depth: 5, width: 4, maxLen: 18, bonus: 18, keep: 10, maxJ: 3 } };
  NKT.mix = function (hero, o) {
    o = Object.assign({}, NKT.o, o || {});
    const dummy = hero === 'kael' ? 'nyra' : 'kael';
    if (!HT.setStage(hero, dummy)) return null;
    const seen = {}, all = [];
    const ok = r => jRun(r) <= o.maxJ && r.search(SK) >= 0 && r.search(SK) <= o.maxJ;   // (maxJ 4: a JJJJ opener, then skills)
    const score = x => x.dmg + o.bonus * skillsOf(x.r).length + (x.r.length >= 6 ? 6 : 0);
    const test = r => { if (seen[r]) return seen[r]; const x = HT.testRoute(r); x.sk = skillsOf(r); seen[r] = x; all.push(x); return x; };
    let beam = SEED.concat(o.maxJ >= 4 ? ['JJJJU', 'JJJJI', 'JJJJu', 'JJJJi'] : []).filter(ok).map(test).filter(x => x.dmg > 0);
    for (let d = 0; d < o.depth; d++) {
      const next = [];
      beam.forEach(b => EXT.forEach(e => { const r = b.r + e; if (r.length > o.maxLen || !ok(r)) return; const x = test(r); if (x.dmg > b.dmg) next.push(x); }));
      if (!next.length) break;
      // keep the best per skill set (so routes with different skills all survive), then per energy budget
      const keep = {};
      next.sort((p, q) => score(q) - score(p)).forEach(x => { const k = x.sk + '|' + Math.min(6, Math.ceil(x.cost / 50)); (keep[k] = keep[k] || []).length < 1 && keep[k].push(x); });
      beam = Object.values(keep).map(a => a[0]).sort((p, q) => score(q) - score(p)).slice(0, o.width * 8);
    }
    // the routes the bot carries: per skill set, the best at each energy budget (25s); robust from 16 and 30 px
    const by = {};
    all.filter(x => x.dmg > 0 && ok(x.r) && x.full !== false).sort((p, q) => score(q) - score(p)).forEach(x => { const k = x.sk + '|' + Math.min(7, Math.ceil(x.cost / 25)); if (!by[k]) by[k] = x; });
    let cand = Object.values(by).sort((p, q) => score(q) - score(p)).slice(0, o.keep * 3);
    cand.forEach(x => { const a = HT.testRoute(x.r, 16), b = HT.testRoute(x.r, 30); x.dmg22 = x.dmg; x.dmg = Math.min(x.dmg, a.dmg, b.dmg); });
    cand = cand.filter(x => x.dmg > 0);
    // drop a route another beats on damage with the same skills at no more energy
    cand = cand.filter(x => !cand.some(y => y !== x && y.sk.length >= x.sk.length && x.sk.split('').every(c => y.sk.indexOf(c) >= 0) && y.cost <= x.cost && y.dmg > x.dmg + 4));
    cand = cand.sort((p, q) => score(q) - score(p)).slice(0, o.keep);
    // always one free route (a landed J makes U free) so a combo never needs energy it does not have
    const free = all.filter(x => x.dmg > 0 && ok(x.r) && x.cost <= 2).sort((p, q) => score(q) - score(p))[0];
    if (free && !cand.some(x => x.r === free.r)) cand.push(free);
    const list = cand.sort((p, q) => p.cost - q.cost).map(x => ({ r: x.r, dmg: Math.round(x.dmg), cost: Math.round(x.cost), sk: x.sk }));
    HC.data.routes[hero] = list;
    return { hero, tested: all.length, n: list.length, best: list.reduce((a, x) => Math.max(a, x.dmg), 0), sets: Array.from(new Set(list.map(x => x.sk))).join(','), routes: list };
  };
  NKT.all = function (list, o) {
    NKT.res = []; NKT.done = false; NKT.q = list.slice(); NKT.t0 = performance.now();
    const step = () => {
      const h = NKT.q.shift();
      if (h) { try { const r = NKT.mix(h, o); NKT.res.push(r || { hero: h, err: 'no stage' }); } catch (e) { NKT.res.push({ hero: h, err: String(e).slice(0, 120) }); } }
      if (NKT.q.length) later(step); else { NKT.done = true; NKT.ms = performance.now() - NKT.t0; }
    };
    later(step);
  };
  NKT.save = () => HT.save();
})();
