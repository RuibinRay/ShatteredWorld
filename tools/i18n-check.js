'use strict';
// Shattered Worlds — translation check. Not loaded by the game.
// Walks the menus, the Versus screens, every pause tab and every conversation in the current language with
// SW.i18n.track on, and lists the English text that found no translation (text the code builds at runtime,
// or content added after the last translation pass). Run in the browser console on a served copy of the game:
//   for (const f of ['tools/harness.js', 'tools/i18n-check.js']) await new Promise(r => { const s = document.createElement('script'); s.src = f; s.onload = r; document.head.appendChild(s); });
//   await IC.run('es')        -> { misses: [ ... ], ... }   (also 'zh')
// Put the missing strings through translation and add them to tools/i18n/extra.json, then run tools/i18n-build.ps1.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, L = SW.i18n, ui = SW.ui, V = SW.versus, T = window.T;
  const IC = window.IC = {};
  const loadLang = id => new Promise(res => {
    if (id === 'en' || L.dict[id]) return res();
    const s = document.createElement('script'); s.src = 'js/lang/' + id + '.js?' + Date.now(); s.onload = res; s.onerror = res; document.head.appendChild(s);
  });
  const draw = () => { try { G.render(); } catch (e) { IC.errors.push(String(e).slice(0, 160)); } };
  // T.boot clears localStorage (saves, the unlock profile, settings): keep a copy and put it all back afterwards
  IC.run = async function (lang, opts) {
    const keep = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); keep[k] = localStorage.getItem(k); }
    try { return await IC.walk(lang, opts); }
    finally { localStorage.clear(); for (const k in keep) localStorage.setItem(k, keep[k]); }
  };
  IC.walk = async function (lang, opts) {
    opts = opts || {};
    await loadLang(lang);
    IC.errors = [];
    G.manual = true; SW.profile.all = true;
    L.lang = lang; L.cache.clear(); L.done.clear(); L.misses.clear(); L.track = true; SW.view.fit();
    // title, settings, controls, hero select
    G.scene = 'title'; G.overlay = null; draw();
    G.overlay = 'settings'; draw(); G.overlay = 'controls'; draw(); G.overlay = null;
    G.scene = 'select'; draw(); G.scene = 'title';
    // Versus: menu (every mode), pick, a fight with pause and move lists, Training, result
    V.open(G);
    for (const m of ['pvb', 'pvp', 'train', 'rival']) { V.mode = m; V.phase = 'menu'; draw(); V.phase = 'pick'; V.step = 0; draw(); V.step = 1; draw(); }
    V.mode = 'pvb'; V.phase = 'pick'; V.step = 1; V.pick = [0, 1]; T.press('confirm'); T.step(2);
    for (let i = 0; i < 40; i++) { G.tick(); if (i % 10 === 0) draw(); }
    T.press('pause'); draw(); V.pPage = 'moves'; draw(); V.pWho = 1; draw(); V.pPage = null; V.paused = false;
    V.phase = 'result'; V.champ = 0; draw(); V.phase = 'ko'; V.winner = 1; draw();
    T.press('pause'); T.step(2); G.scene = 'title';
    // story: each hero's first zone, HUD, every pause tab, every conversation
    const heroes = opts.heroes || ['kael', 'nyra'];
    for (const h of heroes) {
      T.boot(h); T.step(5); if (ui.dlg.active) T.skip(); draw();
      T.press('pause');
      for (let tab = 0; tab < 12; tab++) { ui.pm.tab = tab; for (let s = 0; s < 8; s++) { ui.pm.sel = s; draw(); } }
      G.overlay = null;
      if (h === heroes[0]) for (const id of Object.keys(D.dialogue)) {
        try { G.say(id); } catch (e) { continue; }
        let n = 0;
        while (ui.dlg.active && n++ < 60) { ui.dlg.chars = 1e9; draw(); ui.dlg.wait = false; try { ui.dlg.next(G); } catch (e) { break; } }
        ui.dlg.active = false;
      }
    }
    L.track = false;
    const misses = [...L.misses.keys()].filter(s => /[A-Za-z]{2}/.test(s));
    // drop prefixes of other misses (dialogue typed out letter by letter)
    const keep = misses.filter(s => !misses.some(o => o !== s && o.startsWith(s)));
    return { lang, misses: keep, count: keep.length, errors: IC.errors };
  };
})();
