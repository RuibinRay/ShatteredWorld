'use strict';
// Shattered Worlds - The Hollow Crown: five Versus legends used to be earned by goals of the first story mode, which is
// gone (an Act 2 secret, finishing Act 2, the Scrap Baron, 8 Memory Shards, 3 tutorials). They are now earned in The
// Hollow Crown. Anyone who already earned the old achievement keeps the hero.
//   Mira   finish any story            Tessa  finish three stories      Noct   finish six stories
//   Bando  bring down a Siege Walker captain (a Holder's finale)        Vega   finish a saviour's story
// Later the same day (cleanup), eight more that waited on Act 1, Act 2, Memory Shards, the Pit's ranked fights or tutorials:
//   Kiri   win a rival duel            Tarn   finish two stories        Brann  finish twelve stories
//   Gale   finish a story from each layer        Fenn / Isolde / Brakk  finish a Deepline / Aurelia / Surface story
//   Maren  finish a Vanguard's story
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
    sg_saviour: { name: 'Stargazer', desc: "Finish a saviour's story in The Hollow Crown", hero: 'vega', old: 'shards_8' },
    // eight more that waited on goals the new story does not have: Act 1, Act 2, Memory Shards, the Pit, tutorials (cleanup, 2026-11-17)
    sg_rival:   { name: 'Paper Victory', desc: 'Win a rival duel in The Hollow Crown', hero: 'kiri', old: 'duel_won' },
    sg_two:     { name: 'Second Race', desc: 'Finish two stories in The Hollow Crown', hero: 'tarn', old: 'act2_end' },
    sg_layers:  { name: 'All Three Winds', desc: 'Finish a story from the Sky, the Surface and Deepline', hero: 'gale', old: 'shards_3' },
    sg_twelve:  { name: 'Long Winter', desc: 'Finish twelve stories in The Hollow Crown', hero: 'brann', old: 'shards_15' },
    sg_deep:    { name: 'Out of the Dark', desc: 'Finish a Deepline story in The Hollow Crown', hero: 'fenn', old: 'act1_kael' },
    sg_sky:     { name: 'Down from the Sky', desc: 'Finish an Aurelia story in The Hollow Crown', hero: 'isolde', old: 'act1_nyra' },
    sg_land:    { name: 'Rookie Purse', desc: 'Finish a Surface story in The Hollow Crown', hero: 'brakk', old: 'pit_champ' },
    sg_vanguard: { name: 'Six Mornings', desc: "Finish a Vanguard's story in The Hollow Crown", hero: 'maren', old: 'tutorials_6' }
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
    if (m.rival) out.push('sg_rival');
    if (fin.length >= 2) out.push('sg_two');
    if (fin.length >= 12) out.push('sg_twelve');
    const realm = h => ((SW.lore && SW.lore.heroes && SW.lore.heroes[h]) || {}).realm;
    if (['sky', 'land', 'deep'].every(r => fin.some(h => realm(h) === r))) out.push('sg_layers');
    if (fin.some(h => realm(h) === 'deep')) out.push('sg_deep');
    if (fin.some(h => realm(h) === 'sky')) out.push('sg_sky');
    if (fin.some(h => realm(h) === 'land')) out.push('sg_land');
    if (SG.roleOf && fin.some(h => SG.roleOf(h) === 'vanguard')) out.push('sg_vanguard');
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
