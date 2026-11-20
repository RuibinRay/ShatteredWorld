'use strict';
// Shattered Worlds - The Hollow Crown in Spanish and Chinese (the user, 2026-11-18: "translate").
// The story's text (every chapter's lines, cards and goals, the prologue, the interlude, the menus, toasts and the
// achievements of js/saga/saga-unlocks.js) is translated in js/saga/lang-es.js and js/saga/lang-zh.js, exact-string
// lookup like js/lang/*.js (see js/i18n.js). This file loads the one for the chosen language, the first time that
// language is active. If an English line in js/saga/*.js changes, change its key in both files too, or that line falls
// back to English.
// It also adds the Book II unlock hints on the hero select: the code builds them from hero names and a count
// ("Finish Aldric's or Brann's story, or any 6 stories (2 done)."), so each one is made here, per hero and count.
(function () {
  const SW = window.SW, I = SW && SW.i18n, SG = SW && SW.saga, HR = SW && SW.data && SW.data.heroes;
  if (!I || !SG || !HR) return;
  const LOADED = {};
  const villain = id => !!(SW.lore && SW.lore.heroes && SW.lore.heroes[id] && SW.lore.heroes[id].realm === 'beyond') || id === 'convergence';

  // Book II hints, word for word as saga-core.js unlockInfo() writes them, for 0-5 stories done
  function hints(lang) {
    if (!SG.lines || !SG.chap || !SG.bookOf) return;
    const map = {}, nm = id => (HR[id] ? HR[id].name : id);
    const loc = n => (lang === 'zh' ? I.tr(n) : n);   // Spanish keeps the heroes' English names
    Object.keys(HR).forEach(id => {
      if (SG.bookOf(id) !== 2 || villain(id)) return;
      const by = Object.keys(SG.lines).filter(h => !villain(h) && SG.bookOf(h) < 3 && (SG.chap(h, 2).with === id || SG.chap(h, 3).rival === id)).map(nm).slice(0, 3);
      const ns = by.map(x => x + "'s"), list = ns.length > 1 ? ns.slice(0, -1).join(', ') + ' or ' + ns[ns.length - 1] : ns[0];
      const tn = by.map(loc);
      const es = tn.length > 1 ? tn.slice(0, -1).join(', ') + ' o ' + tn[tn.length - 1] : tn[0];
      const zh = tn.length > 1 ? tn.slice(0, -1).join('、') + '或' + tn[tn.length - 1] : tn[0];
      for (let n = 0; n < 6; n++) {
        const en = (list ? 'Finish ' + list + ' story, or ' : 'Finish ') + 'any 6 stories (' + n + ' done).';
        map[en] = lang === 'zh'
          ? (zh ? '完成' + zh + '的故事，或任意6个故事（已完成' + n + '个）。' : '完成任意6个故事（已完成' + n + '个）。')
          : (es ? 'Termina la historia de ' + es + ', o 6 historias cualesquiera (' + n + ' hechas).' : 'Termina 6 historias cualesquiera (' + n + ' hechas).');
      }
    });
    I.add(lang, map);
  }

  const HINTED = {};
  function ensure() {
    const lg = I.lang;
    if (lg !== 'es' && lg !== 'zh') return;
    // the hints use the game's hero names, so they wait for js/lang/<lg>.js too (settings.js loads it)
    if (LOADED[lg] === 'done' && !HINTED[lg] && I.dict[lg] && I.dict[lg].has('Kael')) { HINTED[lg] = true; try { hints(lg); } catch (e) { console.error(e); } }
    if (LOADED[lg]) return;
    LOADED[lg] = 'loading';
    const sc = document.createElement('script');
    sc.src = 'js/saga/lang-' + lg + '.js';
    // then the campaign's own text (2026-11-20: the Engine Core, Vael, the rescue scenes, the map, the finale)
    // and chapters 1-4 as rewritten that day (lang-p1-*.js)
    sc.onload = () => { LOADED[lg] = 'done'; ['lang-camp-', 'lang-p1-'].forEach(p => { const c = document.createElement('script'); c.src = 'js/saga/' + p + lg + '.js'; document.body.appendChild(c); }); ensure(); };
    sc.onerror = () => { LOADED[lg] = 'missing'; };
    document.body.appendChild(sc);
  }
  SG.langLoaded = LOADED;   // (for tests)
  // the language can change at any time in Settings; checking twice a second is enough (nothing of the story shows
  // in the first half second after a change)
  setInterval(ensure, 500);
  window.addEventListener('load', ensure);
})();
