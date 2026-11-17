'use strict';
// Shattered Worlds - The Hollow Crown: five Versus legends used to be earned by goals of the first story mode, which is
// gone (an Act 2 secret, finishing Act 2, the Scrap Baron, 8 Memory Shards, 3 tutorials). They are now earned in The
// Hollow Crown. Anyone who already earned the old achievement keeps the hero.
//   Mira   finish any story            Tessa  finish three stories      Noct   finish six stories
//   Bando  bring down a Siege Walker captain (a Holder's finale)        Vega   finish a saviour's story
// js/saga/saga-core.js calls SW.saga.checkMilestones() when a story is finished or a captain falls.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, SG = SW.saga = SW.saga || {};
  if (!G || !D || !D.achievements || !D.heroes || typeof G.unlocked !== 'function' || typeof G.achieve !== 'function') return;
  const prof = SW.profile || {};
  const NEW = {
    sg_first:   { name: 'A Story Told', desc: 'Finish any story in The Hollow Crown', hero: 'mira', old: 'secret_1' },
    sg_three:   { name: 'Three Mornings', desc: 'Finish three stories in The Hollow Crown', hero: 'tessa', old: 'tutorials_3' },
    sg_six:     { name: 'What the Dark Kept', desc: 'Finish six stories in The Hollow Crown', hero: 'noct', old: 'act2_done' },
    sg_captain: { name: 'Toll Paid', desc: 'Bring down a Siege Walker captain in The Hollow Crown', hero: 'bando', old: 'baron_down' },
    sg_saviour: { name: 'Stargazer', desc: "Finish a saviour's story in The Hollow Crown", hero: 'vega', old: 'shards_8' }
  };
  const OLD = {};
  Object.keys(NEW).forEach(id => {
    const a = NEW[id], h = D.heroes[a.hero];
    if (!h) return;
    D.achievements[id] = { name: a.name, desc: a.desc, hero: a.hero };
    OLD[a.hero] = a.old; h.need = id;
  });
  const _u = G.unlocked;
  G.unlocked = function (id) { return _u.apply(this, arguments) || !!(OLD[id] && prof.ach && prof.ach[OLD[id]]); };

  // which milestones the story so far has reached; quiet: grant without the toasts (on load, from earlier play)
  function earned() {
    const m = (SG.meta && SG.meta()) || {}, fin = Object.keys(m.finished || {}).filter(h => D.heroes[h]), out = [];
    if (fin.length >= 1) out.push('sg_first');
    if (fin.length >= 3) out.push('sg_three');
    if (fin.length >= 6) out.push('sg_six');
    if (m.captain) out.push('sg_captain');
    if (SG.SAVIOURS && fin.some(h => SG.SAVIOURS.indexOf(h) >= 0)) out.push('sg_saviour');
    return out;
  }
  SG.checkMilestones = function (quiet) {
    earned().forEach(id => {
      if (prof.ach && prof.ach[id]) return;
      if (quiet) { prof.ach = prof.ach || {}; prof.ach[id] = true; if (SW.saveProfile) SW.saveProfile(); }
      else G.achieve(id);
    });
  };
  window.addEventListener('load', () => { try { SG.checkMilestones(true); } catch (e) { console.error(e); } });
})();
