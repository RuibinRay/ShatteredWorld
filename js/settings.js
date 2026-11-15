'use strict';
// Shattered Worlds — Settings screen and language switching. Loaded last.
//
// Title screen > Settings: language, sound and music volume. Esc > SYSTEM in the story also has a Language row.
// The choices belong to the player, not to a save: they are kept in localStorage 'shattered-worlds-settings-v1'.
// Choosing a language loads js/lang/<id>.js (see js/i18n.js); until it has loaded the game stays in English.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, ui = SW.ui, I = SW.input, L = SW.i18n, A = SW.audio, art = SW.art, text = SW.text, W = SW.W, H = SW.H;
  const KEY = 'shattered-worlds-settings-v1';
  const S = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private window: settings last this session only */ } };
  const eat = () => { I.prev = Object.assign({}, I.now); };   // the keypress is used up: nothing else sees it this frame

  // ---------- language ----------
  // which js/lang/<id>.js files have loaded. Not L.dict[id]: other scripts add a few lines of their own to a language at
  // boot (SW.i18n.add), so a dictionary can exist before its file is loaded.
  const loading = {}, loaded = L.files = L.files || {};
  let note = '';
  function fixData() {   // text the game types out letter by letter from the source: give it the translated source
    if (!D._prologueEn) D._prologueEn = D.prologue.slice();
    D.prologue = D._prologueEn.map(s => (L.lang === 'en' ? s : L.tr(s)));
  }
  function apply(id) {
    if (S.lang !== id) return;
    L.lang = id; L.cache.clear(); L.done.clear(); note = '';
    SW.view.fit(); fixData();
  }
  function setLang(id) {
    if (!L.langs.some(l => l.id === id)) id = 'en';
    S.lang = id; save();
    if (id === 'en' || loaded[id]) { apply(id); return; }
    if (loading[id]) return;
    loading[id] = true; note = '...';
    const sc = document.createElement('script');
    sc.src = 'js/lang/' + id + '.js';
    sc.onload = () => { loading[id] = false; loaded[id] = true; apply(id); };
    sc.onerror = () => { loading[id] = false; note = 'Translation file missing: js/lang/' + id + '.js'; };
    document.head.appendChild(sc);
  }
  const cycle = d => { const i = L.langs.findIndex(l => l.id === (S.lang || 'en')); setLang(L.langs[(i + L.langs.length + d) % L.langs.length].id); SW.audio.sfx('move'); };

  // names in dialogue: the story swaps the road's lead hero for the hero being played; do the same in the translation
  const _txt = G.txt;
  G.txt = function (t) {
    if (L.lang === 'en') return _txt(t);
    const r = D.heroes[G.route()], h = G.hero();
    let s = L.tr(t);
    if (r && h && r !== h) for (const [a, b] of [[r.alias.toUpperCase(), h.alias.toUpperCase()], [r.alias, h.alias], [r.name, h.name]]) { const ta = L.tr(a), tb = L.tr(b); if (ta && ta !== tb) s = s.split(ta).join(tb); }
    L.done.add(s);
    return s;
  };

  // ---------- volumes are remembered too ----------
  if (typeof S.sfx === 'number') A.vol.sfx = S.sfx; else S.sfx = A.vol.sfx;          // nothing is written until something changes
  if (typeof S.music === 'number') A.vol.music = S.music; else S.music = A.vol.music;
  const keepVol = () => { if (S.sfx !== A.vol.sfx || S.music !== A.vol.music) { S.sfx = A.vol.sfx; S.music = A.vol.music; save(); A.setVol(); } };

  // ---------- title screen > Settings ----------
  const ROWS = SW.touch ? ['lang', 'touch', 'full', 'fs', 'sfx', 'music', 'back'] : ['lang', 'full', 'sfx', 'music', 'back'];   // fs: full screen on rotate (js/touch.js)
  const TOUCH = [['auto', 'Auto'], ['on', 'On'], ['off', 'Off']];   // js/touch.js: Auto shows the controls on touchscreens
  const st = SW.settings = { row: 0 };
  st.open = function () { st.row = 0; };
  st.update = function (g) {
    const d = (I.hit('right') ? 1 : 0) - (I.hit('left') ? 1 : 0), id = ROWS[st.row];
    if (I.back() || I.hit('pause') || (I.ok() && id === 'back')) { g.overlay = null; SW.audio.sfx('back'); keepVol(); return; }
    if (I.hit('down')) { st.row = (st.row + 1) % ROWS.length; SW.audio.sfx('move'); }
    if (I.hit('up')) { st.row = (st.row + ROWS.length - 1) % ROWS.length; SW.audio.sfx('move'); }
    if (id === 'lang' && (d || I.ok())) cycle(d || 1);
    if (id === 'touch' && (d || I.ok())) {
      const i = TOUCH.findIndex(t => t[0] === SW.touch.mode), m = TOUCH[(i + TOUCH.length + (d || 1)) % TOUCH.length][0];
      S.touch = m; save(); SW.touch.mode = m; SW.touch.layout(); SW.audio.sfx('move');
    }
    if (id === 'full' && (d || I.ok())) {   // full screen now, on or off (js/touch.js)
      const T = SW.touch, want = !(T && T.isFs());
      if (!T || !T.canFs()) note = 'Full screen is not available here. On iPhone: Share > Add to Home Screen.'; else { T.fullscreen(want); note = ''; }
      SW.audio.sfx('move');
    }
    if (id === 'fs' && (d || I.ok())) { SW.touch.setAutoFs(!SW.touch.autoFs); SW.audio.sfx('move'); }
    if (id === 'sfx' && d) { A.vol.sfx = SW.clamp(Math.round((A.vol.sfx + d * 0.1) * 10) / 10, 0, 1); A.setVol(); SW.audio.sfx('select'); }
    if (id === 'music' && d) { A.vol.music = SW.clamp(Math.round((A.vol.music + d * 0.1) * 10) / 10, 0, 1); A.setVol(); }
    keepVol();
  };
  const langName = () => L.info(S.lang || 'en').name;
  function valueRow(ctx, x, y, on, draw) {   // "<  value  >"
    text(ctx, '<', x, y, on ? '#ffffff' : '#8a92b8');
    draw(x + 14);
    text(ctx, '>', x + 110, y, on ? '#ffffff' : '#8a92b8');
  }
  st.draw = function (ctx) {
    const bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0); else art.rect(ctx, '#0b0c1c', 0, 0, W, H);
    ctx.globalAlpha = 0.82; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'SETTINGS', W / 2, 30, '#f5c542', { align: 'center', scale: 2 });
    const label = { lang: 'Language', touch: 'Touch controls', full: 'Full screen', fs: 'Full screen on rotate', sfx: 'Sound effects', music: 'Music', back: 'Back' };
    ROWS.forEach((id, i) => {
      const on = st.row === i, y = 84 + i * (ROWS.length > 6 ? 19 : 22), c = on ? '#f5c542' : '#ffffff';
      text(ctx, (on ? '> ' : '  ') + label[id], 120, y, c);
      if (id === 'lang') valueRow(ctx, 250, y, on, x => text(ctx, langName(), x, y, on ? '#ffffff' : '#bfe8ff', { raw: true }));
      if (id === 'touch') valueRow(ctx, 250, y, on, x => text(ctx, (TOUCH.find(t => t[0] === SW.touch.mode) || TOUCH[0])[1], x, y, on ? '#ffffff' : '#bfe8ff'));
      if (id === 'full') valueRow(ctx, 250, y, on, x => text(ctx, SW.touch && SW.touch.isFs() ? 'On' : 'Off', x, y, on ? '#ffffff' : '#bfe8ff'));
      if (id === 'fs') valueRow(ctx, 250, y, on, x => text(ctx, SW.touch.autoFs ? 'On' : 'Off', x, y, on ? '#ffffff' : '#bfe8ff'));
      if (id === 'sfx' || id === 'music') valueRow(ctx, 250, y, on, x => {
        const v = Math.round(A.vol[id === 'sfx' ? 'sfx' : 'music'] * 10);
        for (let k = 0; k < 10; k++) art.rect(ctx, k < v ? (on ? '#f5c542' : '#bfe8ff') : '#2a2d45', x + k * 8, y + 1, 6, 6);
      });
    });
    if (note) text(ctx, note, W / 2, 238, '#ff8a8a', { align: 'center' });
    text(ctx, 'W / S: choose    A / D: change    Esc: back', W / 2, 250, '#8a92b8', { align: 'center' });
  };
  const _ti = ui.titleItems; ui.titleItems = function (g) { const a = _ti(g); a.splice(Math.max(0, a.length - 1), 0, ['Settings', 'settings']); return a; };

  // ---------- Esc > SYSTEM: a Language row under the others (row 6; difficulty.js owns row 5) ----------
  const ROW = 6, Y = 40 + 8 * 14;   // below SYSTEM's own note line
  const _pu = ui.pauseUpdate; ui.pauseUpdate = function (g) {
    const pm = ui.pm;
    if (pm.tab === 4) {
      if (pm.sel === 5 && I.hit('down')) { pm.sel = ROW; SW.audio.sfx('move'); eat(); }
      else if (pm.sel === ROW) {
        if (I.hit('up')) { pm.sel = 5; SW.audio.sfx('move'); }
        else if (I.hit('down')) { pm.sel = 0; SW.audio.sfx('move'); }
        else if (I.hit('left')) cycle(-1);
        else if (I.hit('right') || I.ok()) cycle(1);
        eat();
      }
    }
    const r = _pu(g);
    keepVol();
    return r;
  };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 4) return;
    const on = ui.pm.sel === ROW;
    art.rect(ctx, '#080916', 24, Y - 2, 300, 12);
    text(ctx, (on ? '> ' : '  ') + 'Language', 26, Y, on ? '#f5c542' : '#ffffff');
    text(ctx, '<  ', 140, Y, on ? '#ffffff' : '#8a92b8');
    text(ctx, langName(), 158, Y, on ? '#ffffff' : '#bfe8ff', { raw: true });
    text(ctx, '>', 230, Y, on ? '#ffffff' : '#8a92b8');
    if (note) text(ctx, note, 26, Y + 12, '#ff8a8a');
  };

  // ---------- start in the saved language ----------
  fixData();
  if (S.lang && S.lang !== 'en') setLang(S.lang);
  window.addEventListener('load', () => SW.view.fit());
})();
