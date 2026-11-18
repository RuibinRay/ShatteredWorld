'use strict';
// Shattered Worlds — saved Versus tournaments. Loaded after versus.js; only wraps V.update and V.draw.
//   The bracket is saved to localStorage (KEY, apart from the profile and the story slot) whenever it changes on the
//   bracket screen: at the draw and after every finished match (bot matches settled at once included).
//   While a save exists the Versus menu has a "Continue tournament" row above the others (W from the Mode row, or S from
//   the last row): J brings back the bracket, every result so far, the bot levels and your next match.
//   Starting a new tournament while one is saved asks first. The save is cleared when the tournament ends or when your
//   own hero is knocked out (a Watch tournament runs to the final). Esc on the bracket leaves it, and the save stays.
//   A match left halfway (Esc > quit, or the page closed) is not counted: Continue fights it again from its start.
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, D = SW.data, I = SW.input, art = SW.art, ui = SW.ui, text = SW.text;
  if (!V || !V.update || !V.draw) return;
  const KEY = 'shattered-worlds-tournament-v1';
  const TS = SW.tourSave = { on: false, ask: false, T: null, sig: '', dead: null, cache: undefined };

  function load() {
    if (TS.cache !== undefined) return TS.cache;
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    // a hero that no longer exists (or a broken save) makes it unusable
    if (s && !(s.tour && Array.isArray(s.tour.R) && s.tour.R[0] && s.tour.R.every(r => r.every(id => id === null || D.heroes[id])))) s = null;
    return (TS.cache = s);
  }
  function save(T) {
    const s = { v: 1, at: Date.now(), set: { tsize: V.tsize, entry: V.entry, diff: V.diff, tlv: V.tlv || 0, tskip: V.tskip, speed: V.speed },
      tour: { size: T.size, R: T.R, me: T.me, last: T.last, lv: T.lv, stick: T.stick || null } };
    const str = JSON.stringify(s);
    try { localStorage.setItem(KEY, str); TS.cache = JSON.parse(str); } catch (e) { /* private window: no save */ }   // a copy: the live bracket's arrays keep changing
  }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } TS.cache = null; TS.on = false; TS.ask = false; }
  TS.load = load; TS.clear = clear;

  // your hero lost a match in this bracket
  function knockedOut(T) {
    if (!T.me) return false;
    for (let r = 0; T.R[r + 1]; r++) for (let m = 0; m < T.R[r + 1].length; m++) {
      const w = T.R[r + 1][m];
      if (w !== undefined && w !== T.me && (T.R[r][m * 2] === T.me || T.R[r][m * 2 + 1] === T.me)) return true;
    }
    return false;
  }
  function resume() {
    const s = load(); if (!s) return;
    // a Bots level or level mode picked in the menu wins over the saved one (the user: "after i selected nightmare i
    // entered the tournament and its still hard vs hard"): then every bot takes it (Same and Set each: the menu's level;
    // Mixed: a new random one each; Rising goes by round anyway). Nothing picked (the menu starts at Normal on every page
    // load, so only a real change counts): the saved levels stay, hand-set ones included
    const diff = V.diff, tlv = V.tlv || 0, changed = TS.picked && (diff !== s.set.diff || tlv !== (s.set.tlv || 0));
    Object.assign(V, s.set, changed ? { diff, tlv } : {});
    TS.picked = false;
    V.mode = 'tour'; V.tourBots = false; V.row = 0;
    V.tour = { size: s.tour.size, R: s.tour.R.map(r => r.slice()), me: s.tour.me || null, cur: null, last: s.tour.last || null, done: false, champ: null, lv: Object.assign({}, s.tour.lv) };
    if (changed) Object.keys(V.tour.lv).forEach(id => { V.tour.lv[id] = tlv === 1 ? Math.random() * 4 | 0 : diff; });
    else if (s.tour.stick) V.tour.stick = s.tour.stick.slice();   // Set each: the levels set on the bracket keep sticking
    TS.T = V.tour; TS.sig = sigOf(V.tour); TS.on = false;
    V.phase = 'bracket'; V.t = 0;
  }
  // what a save has to keep up with: the results, and the bot levels (Set each changes them on the bracket)
  const sigOf = T => JSON.stringify([T.R, T.lv, T.stick || null]);
  // after each frame on the bracket screen: save a changed bracket, clear a finished one
  function track() {
    const T = V.tour;
    if (V.mode !== 'tour' || !T || V.phase !== 'bracket' || T.cur || T === TS.dead) return;
    if (T.done || knockedOut(T)) { clear(); TS.dead = T; return; }
    const sig = sigOf(T);
    if (T === TS.T && sig === TS.sig) return;
    save(T); TS.T = T; TS.sig = sig;
  }

  const eat = () => { I.prev = Object.assign({}, I.now); };   // the keypress is used up: versus.js does not see it
  const _vu = V.update; V.update = function () {
    if (V.phase === 'menu' && load()) {
      const up = I.hit('up'), down = I.hit('down'), ok = I.ok(), back = I.hit('pause'), side = I.hit('left') || I.hit('right');
      const last = V.menuRows().length - 1;
      if (TS.ask) {   // "start a new tournament?": J goes on (versus.js sees the key and starts), Esc keeps the save
        if (ok) TS.ask = false;
        else { if (back) { TS.ask = false; SW.audio.sfx('back'); } eat(); }
      } else if (TS.on) {
        if (up) { TS.on = false; V.row = last; SW.audio.sfx('move'); eat(); }
        else if (down) { TS.on = false; V.row = 0; SW.audio.sfx('move'); eat(); }
        else if (ok) { SW.audio.sfx('select'); eat(); resume(); }
        else if (side) eat();
      } else if (up && V.row === 0) { TS.on = true; SW.audio.sfx('move'); eat(); }
      else if (down && V.row === last) { TS.on = true; SW.audio.sfx('move'); eat(); }
      else if (ok && V.mode === 'tour') { TS.ask = true; SW.audio.sfx('select'); eat(); }
    } else { TS.on = false; TS.ask = false; }
    // Esc > "Quit to the Versus menu" in a tournament match: versus.js would forfeit it (a loss for you, or the lead
    // bot's win). Instead the match is left unplayed: the bracket goes back to how it was before the match (the save
    // already holds that), and Continue tournament replays the match from its start.
    const T = V.tour, items = V.tourBots ? ['resume', 'speed', 'moves', 'quit'] : ['resume', 'moves', 'quit'];
    const leaving = V.mode === 'tour' && T && T.cur && V.paused && !V.pPage && items[V.pRow] === 'quit' && I.ok();
    if (leaving) {
      const keep = { R: T.R.map(r => r.slice()), last: T.last }, sfx = SW.audio.sfx;
      SW.audio.sfx = () => {};   // no fanfare for a "result" that is undone straight away
      try { _vu.apply(this, arguments); } finally { SW.audio.sfx = sfx; }
      Object.assign(T, { R: keep.R, last: keep.last, cur: null, done: false, champ: null });
      V.tourBots = false; V.paused = false; V.phase = 'menu'; V.tour = null; V.t = 0; TS.on = !!load();
      sfx('back');
      return;
    }
    const d0 = V.diff, l0 = V.tlv || 0, inMenu = V.phase === 'menu';
    const r = _vu.apply(this, arguments);
    if (inMenu && V.phase === 'menu' && (V.diff !== d0 || (V.tlv || 0) !== l0)) TS.picked = true;   // the Bots level or level mode changed by hand
    track();
    return r;
  };

  const _vd = V.draw; V.draw = function (ctx) {
    const row = V.row, hide = V.phase === 'menu' && TS.on;
    if (hide) V.row = -1;   // the cursor is on our row: versus.js draws none of its own
    try { _vd.apply(this, arguments); } finally { if (hide) V.row = row; }
    if (V.phase !== 'menu') return;
    const s = load(); if (!s) return;
    const size = s.tour.size + ' heroes', y = 60;   // between the mode's description and the first row
    text(ctx, (TS.on ? '> ' : '  ') + 'Continue tournament', 130, y, TS.on ? '#f5c542' : '#7cf0a0');
    text(ctx, size, Math.max(240, 130 + SW.textW('  Continue tournament') + 10), y, TS.on ? '#ffffff' : '#8a92b8');
    if (!TS.ask) return;
    ctx.globalAlpha = 0.85; art.rect(ctx, '#05060c', 0, 0, SW.W, SW.H); ctx.globalAlpha = 1;
    ui.panel(ctx, 84, 92, SW.W - 168, 76, '#f5c542', 0.95);
    text(ctx, 'Start a new tournament?', SW.W / 2, 104, '#f5c542', { align: 'center', scale: 2 });
    text(ctx, 'Your saved tournament will be lost.', SW.W / 2, 128, '#ffffff', { align: 'center' });
    text(ctx, 'J / Enter: start new    Esc: keep it', SW.W / 2, 148, '#8a92b8', { align: 'center' });
  };
})();
