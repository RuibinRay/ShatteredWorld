'use strict';
// Shattered Worlds - HERO STORIES: read the story of every one of the 64 heroes, who they are to each other, and the
// Chronicle (the full storyline). Data: js/lore/sky.js, land.js, deep.js, beyond.js, ties.js, chronicle.js.
//
// Where it opens: "Hero Stories" on the title menu, and M on the Versus hero select (that hero's page; Esc returns).
// Four realm tabs (Aurelia, the Surface, Deepline, the Beyond) of 16 heroes each, then the Chronicle.
// A hero's page has two sides: STORY (origin, role, look, moves read live from the game, story, finisher line) and
// TIES (each relationship; J opens that hero, Esc comes back along the trail).
//
// Loaded last and only wraps: I.update (to own the keys while open), ui.titleItems / ui.drawTitle, versus update / draw.
// Story text in Spanish and Chinese: js/lore/lang-es.js and lang-zh.js, fetched when the screen first opens in that language.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, ui = SW.ui, I = SW.input, W = SW.W, H = SW.H, L = SW.lore, V = SW.versus;
  if (!L || !G || !ui || !L.order) return;
  const HR = D.heroes, A = D.abilities;
  const txt = (ctx, s, x, y, c, o) => SW.text(ctx, s, x, y, c, o);
  const tw = s => SW.textW(s);
  const lang = () => (SW.i18n && SW.i18n.lang) || 'en';
  const tr = s => (SW.i18n && SW.i18n.tr && lang() !== 'en' ? SW.i18n.tr(s) : s);
  const sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no audio yet */ } };
  // the story text in Spanish and Chinese lives in js/lore/lang-es.js / lang-zh.js (English -> translation, like
  // js/lang/*.js); it is fetched the first time the screen opens in that language
  const LOADED = {};
  function ensureLang() {
    const lg = lang(); if (lg === 'en' || LOADED[lg]) return;
    LOADED[lg] = 'loading';
    const sc = document.createElement('script'); sc.src = 'js/lore/lang-' + lg + '.js';
    sc.onload = () => { LOADED[lg] = 'done'; cache.clear(); };
    sc.onerror = () => { LOADED[lg] = 'missing'; };
    document.body.appendChild(sc);
  }
  // hero names on this screen: Spanish keeps the English names (the global lookup would turn Slick into his move,
  // "Resbaladizo"); Chinese uses the game's names, plus these for the newest heroes, which had none
  const ZH_NAMES = { vex: '维克斯', zara: '扎拉', coda: '寇妲', vesna: '维斯娜', apis: '阿琵斯', hex: '赫克丝', lux: '卢克丝', fumi: '芙美',
    kova: '科瓦', hart: '哈特', elixa: '艾莉克莎', tor: '托尔', opal: '欧泊', taro: '太郎', rue: '露', mako: '马科', sora: '索拉', ryo: '亮', itsuki: '一树' };
  if (SW.i18n && SW.i18n.add) { const m = {}; Object.keys(ZH_NAMES).forEach(id => { if (HR[id]) m[HR[id].name] = ZH_NAMES[id]; }); SW.i18n.add('zh', m); }
  // relationship tags name the OTHER hero; Spanish needs the feminine form for a woman (AMIGA, not AMIGO)
  const WOMEN = ['nyra', 'isolde', 'pyra', 'ashka', 'dyna', 'vesper', 'mira', 'vega', 'tessa', 'ferra', 'kiri', 'maren', 'yara', 'sable', 'dune',
    'kestra', 'nami', 'lin', 'ume', 'isa', 'mika', 'zara', 'coda', 'vesna', 'apis', 'hex', 'lux', 'elixa', 'opal', 'rue', 'sora'];
  const ES_F = { friend: 'AMIGA', student: 'ALUMNA', enemy: 'ENEMIGA', partner: 'COMPAÑERA', mentor: 'MAESTRA', saved: 'RESCATADA', debtor: 'DEUDORA' };
  function kindName(kind, other) {
    const K = L.KINDS[kind] || L.KINDS.friend;
    if (lang() === 'es' && ES_F[kind] && WOMEN.indexOf(other) >= 0) return ES_F[kind];
    return K.name;
  }
  function nameOf(id) {
    const n = HR[id].name, lg = lang();
    if (lg === 'zh') return ZH_NAMES[id] || tr(n);
    if (lg === 'es') return id === 'convergence' ? 'Convergencia' : n;
    return n;
  }
  const CHRON = { id: 'chron', name: 'CHRONICLE', sub: 'The Full Story', col: '#8fd3ff', hi: '#e0f4ff' };
  const TABS = L.order.slice(0, 4).concat(['chron']);
  const realmOf = t => (t === 'chron' ? CHRON : L.realms[t]);

  // ================= data helpers =================
  const pos = id => { const i = D.heroOrder.indexOf(id); return i < 0 ? 1000 + Object.keys(L.heroes).indexOf(id) : i; };
  const lists = {};
  function list(r) {   // the heroes of a realm, in Versus order
    const k = r + ':' + D.heroOrder.length;
    if (!lists[k]) lists[k] = Object.keys(L.heroes).filter(id => HR[id] && L.heroes[id].realm === r).sort((a, b) => pos(a) - pos(b));
    return lists[k];
  }
  function ties(id) {
    const out = [];
    L.ties.forEach(t => {
      if (t[0] === id && HR[t[1]]) out.push({ id: t[1], kind: t[2], text: t[4] });
      else if (t[1] === id && HR[t[0]]) out.push({ id: t[0], kind: t[3], text: t[5] });
    });
    return out;
  }
  function quote(id) {   // their finisher line, in the player's language when it has one
    const l = SW.finisherLines && SW.finisherLines[id], h = L.heroes[id]; if (!l) return '';
    const q = l[(h && h.quote) || 0] || l[0], lg = lang();
    return (lg === 'es' ? q[2] : lg === 'zh' ? q[3] : q[0]) || q[0];
  }
  function moves(id) {   // read from the game, so the page follows any change to their kit
    const h = HR[id], skip = ['magnet_grip', 'frost_steps', 'double_jump', h.mode, h.awaken, h.ultimate];
    const nm = k => (A[k] && A[k].name ? tr(A[k].name) : '');
    const a = (h.kit || []).filter((k, i, all) => A[k] && skip.indexOf(k) < 0 && all.indexOf(k) === i).map(nm).filter(Boolean);
    const u = nm(h.ultimate);
    return a.join(', ') + (u ? '.  ' + tr('Ultimate') + ': ' + u + '.' : '');
  }

  // wrapped text, built once per hero / chapter / language
  const cache = new Map();
  const wrap = (s, w) => SW.wrap(s, w);
  const TW = 332;   // story column width
  function storyRows(id) {
    const key = 's|' + id + '|' + lang(); if (cache.has(key)) return cache.get(key);
    const h = L.heroes[id], hh = HR[id], out = [];
    const LW = Math.max(44, ...['ORIGIN', 'ROLE', 'LOOK', 'MOVES'].map(l => tw(l) + 6));   // label column, as wide as the language needs
    const field = (label, s, col) => wrap(s, TW - LW).forEach((ln, i) => out.push({ t: ln, x: LW, c: col, label: i ? null : label }));
    field('ORIGIN', h.origin, '#c8ccd8'); field('ROLE', h.role, '#c8ccd8'); field('LOOK', h.look, '#a8b0c8'); field('MOVES', moves(id), '#e8d8a8');
    out.push({ gap: 7 });
    h.story.forEach((p, i) => { if (i) out.push({ gap: 5 }); wrap(p, TW).forEach(ln => out.push({ t: ln, x: 0, c: '#ffffff' })); });
    const q = quote(id);
    if (q) { out.push({ gap: 7 }); wrap('"' + q + '"', TW - 30).forEach(ln => out.push({ t: ln, x: TW / 2, c: hh.colorHi || hh.color, center: true, q: true })); }
    cache.set(key, out); return out;
  }
  const rowsH = rows => rows.reduce((a, r) => a + (r.gap || 10), 0);
  function tieRows(id) {
    const key = 't|' + id + '|' + lang(); if (cache.has(key)) return cache.get(key);
    const out = ties(id).map(t => { const lines = wrap(t.text, 300); return Object.assign({ lines, h: Math.max(40, 18 + lines.length * 10) }, t); });
    cache.set(key, out); return out;
  }
  function chapRows(i) {
    const key = 'c|' + i + '|' + lang(); if (cache.has(key)) return cache.get(key);
    const out = [];
    L.chapters[i].text.forEach((p, k) => { if (k) out.push({ gap: 6 }); wrap(p, 288).forEach(ln => out.push({ t: ln, c: '#ffffff' })); });
    cache.set(key, out); return out;
  }

  // ================= state =================
  const S = SW.stories = { open: false, from: 'title', view: 'grid', tab: 0, focus: 'grid', idx: 0, hero: null, page: 'story', scroll: 0,
    tie: 0, tscroll: 0, trail: [], chap: 0, cfocus: 'list', cscroll: 0, direct: false, skip: false, held: null };
  function open(from, id) {
    Object.assign(S, { open: true, from, skip: true, trail: [], direct: !!id });
    ensureLang();
    if (id && L.heroes[id]) openHero(id, true);
    else { S.view = 'grid'; if (S.focus !== 'tabs') S.focus = TABS[S.tab] === 'chron' ? 'list' : 'grid'; }
    sfx('select');
  }
  function close() { S.open = false; S.view = 'grid'; S.trail = []; I.keys.length = 0; sfx('back'); }
  function openHero(id, quiet) {
    S.view = 'hero'; S.hero = id; S.page = 'story'; S.scroll = 0; S.tie = 0; S.tscroll = 0;
    const r = L.heroes[id].realm; S.tab = TABS.indexOf(r); S.idx = Math.max(0, list(r).indexOf(id));
    if (!quiet) sfx('select');
  }
  function switchTab(d) {
    S.tab = (S.tab + d + TABS.length) % TABS.length;
    const chron = TABS[S.tab] === 'chron';
    if (!chron) S.idx = Math.min(S.idx, list(TABS[S.tab]).length - 1);
    if (S.focus !== 'tabs') S.focus = chron ? 'list' : 'grid';
    sfx('move');
  }

  // held arrows repeat after a moment
  const rp = {};
  function rep(a) {
    if (I.hit(a)) { rp[a] = 0; return true; }
    if (I.held(a)) { rp[a] = (rp[a] || 0) + 1; return rp[a] > 16 && rp[a] % 4 === 0; }
    rp[a] = 0; return false;
  }

  // ================= input =================
  function update() {
    if (S.skip) { S.skip = false; return; }
    const k = { ok: I.ok(), back: I.back(), up: rep('up'), down: rep('down'), left: rep('left'), right: rep('right'), prev: I.hit('skill'), next: I.hit('special') };
    if (S.view === 'hero') return heroUpdate(k);
    if (k.prev || k.next) return switchTab(k.next ? 1 : -1);
    if (S.focus === 'tabs') {
      if (k.left) switchTab(-1); else if (k.right) switchTab(1);
      else if (k.down || k.ok) { S.focus = TABS[S.tab] === 'chron' ? 'list' : 'grid'; sfx('move'); }
      else if (k.back) close();
      return;
    }
    if (TABS[S.tab] === 'chron') return chronUpdate(k);
    const ids = list(TABS[S.tab]), n = ids.length;
    let i = S.idx;
    if (k.left) i = (i + n - 1) % n;
    if (k.right) i = (i + 1) % n;
    if (k.down && i + 8 < n) i += 8;
    if (k.up) { if (i >= 8) i -= 8; else { S.focus = 'tabs'; sfx('move'); return; } }
    if (i !== S.idx) { S.idx = i; sfx('move'); }
    if (k.ok && ids[S.idx]) openHero(ids[S.idx]);
    else if (k.back) { S.focus = 'tabs'; sfx('back'); }
  }
  function heroUpdate(k) {
    const id = S.hero, ids = list(L.heroes[id].realm), i = ids.indexOf(id);
    if (k.left || k.right) {
      const nid = ids[(i + (k.right ? 1 : -1) + ids.length) % ids.length], page = S.page;
      openHero(nid, true); S.page = page; S.trail = []; sfx('move'); return;
    }
    if (S.page === 'story') {
      const max = Math.max(0, rowsH(storyRows(id)) - 206);
      if (k.up) S.scroll = Math.max(0, S.scroll - 10);
      if (k.down) S.scroll = Math.min(max, S.scroll + 10);
      if (k.ok && tieRows(id).length) { S.page = 'ties'; S.tie = 0; S.tscroll = 0; sfx('select'); }
      else if (k.back) heroBack();
      return;
    }
    const rows = tieRows(id), n = rows.length;
    if (k.up && n) { S.tie = (S.tie + n - 1) % n; sfx('move'); }
    if (k.down && n) { S.tie = (S.tie + 1) % n; sfx('move'); }
    if (k.ok && rows[S.tie]) { S.trail.push({ id, tie: S.tie }); openHero(rows[S.tie].id); }
    else if (k.back) { if (S.trail.length) heroBack(); else { S.page = 'story'; sfx('back'); } }
  }
  function heroBack() {
    if (S.trail.length) { const t = S.trail.pop(); openHero(t.id, true); S.page = 'ties'; S.tie = t.tie; sfx('back'); return; }
    if (S.direct) { close(); return; }
    S.view = 'grid'; S.focus = 'grid'; sfx('back');
  }
  function chronUpdate(k) {
    const n = L.chapters.length;
    if (S.focus === 'list') {
      if (k.up) { if (S.chap > 0) { S.chap--; S.cscroll = 0; sfx('move'); } else { S.focus = 'tabs'; sfx('move'); } }
      else if (k.down && S.chap < n - 1) { S.chap++; S.cscroll = 0; sfx('move'); }
      else if (k.ok || k.right) { S.focus = 'read'; sfx('select'); }
      else if (k.back) { S.focus = 'tabs'; sfx('back'); }
      return;
    }
    const max = Math.max(0, rowsH(chapRows(S.chap)) - 158);
    if (k.up) S.cscroll = Math.max(0, S.cscroll - 10);
    if (k.down) S.cscroll = Math.min(max, S.cscroll + 10);
    if (k.left && S.chap > 0) { S.chap--; S.cscroll = 0; sfx('move'); }
    else if (k.right && S.chap < n - 1) { S.chap++; S.cscroll = 0; sfx('move'); }
    else if (k.back) { S.focus = 'list'; sfx('back'); }
  }

  // ================= drawing =================
  function backdrop(ctx, col) {
    const bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0); else art.rect(ctx, '#0b0c1c', 0, 0, W, H);
    ctx.globalAlpha = 0.86; art.rect(ctx, '#05060c', 0, 0, W, H);
    ctx.globalAlpha = 0.09; art.rect(ctx, col, 0, 0, W, H); ctx.globalAlpha = 1;
  }
  // a hero's face, cut 1:1 from their splash art (or their sprite, for the one without art)
  function face(ctx, id, x, y, w, h, alpha) {
    const hh = HR[id], img = art.bg['hero_' + id];
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (alpha !== undefined) ctx.globalAlpha = alpha;
    if (img) { const cx = (hh.gridX || 27) + 22, cy = 35; ctx.drawImage(img, Math.round(cx - w / 2), Math.round(cy - h / 2), w, h, x, y, w, h); }
    else {
      art.rect(ctx, art.shade(hh.color, 0.22), x, y, w, h);
      const s = art.sheets[hh.sheet], hd = s && s.head;
      if (hd) { const k = Math.min(w / 33, h / 30), dw = Math.round(33 * k), dh = Math.round(30 * k); ctx.drawImage(hd, Math.round(x + (w - dw) / 2), Math.round(y + h - dh), dw, dh); }
    }
    ctx.restore();
  }
  // a name squeezed into a cell: the pixel font without its 1px gaps, when the normal width does not fit
  function tightName(ctx, s, cx, y, col, maxW) {
    if (tw(s) <= maxW || lang() !== 'en') { let t = s; while (t.length > 3 && tw(t) > maxW) t = t.slice(0, -1); txt(ctx, t, cx, y, col, { align: 'center', raw: true }); return; }
    const F = SW.font, wOf = ch => (ch === ' ' ? 3 : (F.w[ch] || 4));
    let x = Math.round(cx - [...s].reduce((a, ch) => a + wOf(ch), 0) / 2);
    for (const ch of s) { if (ch !== ' ') txt(ctx, ch, x, y, col, { raw: true }); x += wOf(ch); }
  }
  function splash(ctx, id, x, y) {
    const hh = HR[id], img = art.bg['hero_' + id];
    if (img) { ctx.drawImage(img, x, y); return; }
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, 96, 128); ctx.clip();
    art.rect(ctx, art.shade(hh.color, 0.18), x, y, 96, 128);
    art.glow(ctx, x + 48, y + 64, 50, hh.color, 0.25);
    ctx.translate(x + 48, y + 118); ctx.scale(2.6, 2.6);
    art.draw(ctx, hh.sheet, 'idle', Math.floor(SW.frame / 28) % 2, 0, 0, false);
    ctx.restore();
  }
  function header(ctx) {
    txt(ctx, 'HERO STORIES', 10, 4, '#ffffff', { scale: 2 });
    txt(ctx, '64 heroes  -  4 realms', W - 10, 9, '#8a92b8', { align: 'right' });
  }
  function tabs(ctx) {
    const blink = Math.floor(SW.frame / 20) % 2 === 0;
    TABS.forEach((t, i) => {
      const R = realmOf(t), x = 10 + i * 92, on = S.tab === i;
      ui.panel(ctx, x, 25, 89, 15, on ? R.col : '#3a3d55', on ? 0.95 : 0.7);
      if (on) { ctx.globalAlpha = 0.28; art.rect(ctx, R.col, x + 1, 26, 87, 13); ctx.globalAlpha = 1; }
      txt(ctx, R.name, x + 45, 28, on ? '#ffffff' : '#8a92b8', { align: 'center' });
      if (on && S.focus === 'tabs' && blink) { txt(ctx, '<', x + 4, 28, '#f5c542'); txt(ctx, '>', x + 81, 28, '#f5c542'); }
    });
  }
  function hint(ctx, s) { txt(ctx, s, W / 2, 259, '#8a92b8', { align: 'center' }); }
  function scrollbar(ctx, x, y, h, total, view, at, col) {
    if (total <= view) return;
    art.rect(ctx, '#1c1e2e', x, y, 2, h);
    const bh = Math.max(10, Math.round(h * view / total)), by = y + Math.round((h - bh) * at / (total - view));
    art.rect(ctx, col, x, by, 2, bh);
  }
  const lines = (ctx, arr, x, y, col, o) => arr.forEach((ln, i) => txt(ctx, ln, x, y + i * 10, col, Object.assign({ raw: true }, o)));

  function drawGrid(ctx) {
    const r = TABS[S.tab], R = L.realms[r], ids = list(r);
    backdrop(ctx, R.col); header(ctx); tabs(ctx);
    ids.forEach((id, i) => {
      const hh = HR[id], c = i % 8, row = Math.floor(i / 8), x = 12 + c * 57, y = 44 + row * 58, on = S.focus === 'grid' && S.idx === i;
      ui.panel(ctx, x, y, 55, 56, on ? hh.color : '#3a3d55', 0.85);
      face(ctx, id, x + 1, y + 1, 53, 45, on ? 1 : 0.62);
      ctx.globalAlpha = 0.85; art.rect(ctx, '#05060c', x + 1, y + 46, 53, 9); ctx.globalAlpha = 1;
      tightName(ctx, nameOf(id), x + 27, y + 46, on ? hh.color : '#c8ccd8', 52);
    });
    // the realm
    ui.panel(ctx, 10, 162, 272, 94, R.col, 0.88);
    txt(ctx, R.name, 16, 166, R.col);
    txt(ctx, R.sub, 16 + tw(R.name) + 8, 166, R.hi);
    lines(ctx, wrap(R.desc, 260).slice(0, 8), 16, 178, '#c8ccd8');
    // the hero under the cursor
    const id = ids[S.idx], hh = HR[id], h = L.heroes[id];
    ui.panel(ctx, 288, 162, 182, 94, S.focus === 'grid' ? hh.color : '#3a3d55', 0.88);
    txt(ctx, nameOf(id), 296, 166, hh.color, { scale: 2, raw: true });
    const t1 = wrap(hh.title, 168).slice(0, 1); lines(ctx, t1, 296, 186, hh.colorHi || '#ffffff');
    const r1 = wrap(h.role, 168).slice(0, 2); lines(ctx, r1, 296, 198, '#8a92b8');
    lines(ctx, wrap('"' + quote(id) + '"', 168).slice(0, 3), 296, 200 + r1.length * 10 + 6, '#ffffff');
    hint(ctx, S.focus === 'tabs' ? 'A / D: realm    S or J: heroes    Esc: close' : 'Arrows: choose    J: read    U / I: realm    Esc: back');
  }

  function drawHero(ctx) {
    const id = S.hero, h = L.heroes[id], hh = HR[id], R = L.realms[h.realm], ids = list(h.realm), i = ids.indexOf(id);
    backdrop(ctx, hh.color);
    txt(ctx, R.name, 10, 6, R.col); txt(ctx, R.sub, 10 + tw(R.name) + 8, 6, R.hi);
    txt(ctx, '< ' + (i + 1) + ' / ' + ids.length + ' >', W - 10, 6, '#8a92b8', { align: 'right', raw: true });
    // left: the art and the name
    ui.panel(ctx, 10, 18, 100, 132, hh.color, 0.9); splash(ctx, id, 12, 20);
    txt(ctx, nameOf(id), 60, 154, hh.color, { align: 'center', scale: 2, raw: true });
    let y = 174;
    if (hh.alias && hh.alias !== hh.name && hh.alias !== hh.title) { txt(ctx, hh.alias, 60, y, '#c8ccd8', { align: 'center' }); y += 11; }
    const tl = wrap(hh.title, 100).slice(0, 2); lines(ctx, tl, 60, y, hh.colorHi || '#ffffff', { align: 'center' }); y += tl.length * 10 + 3;
    if (hh.element) { txt(ctx, hh.element, 60, y, '#8a92b8', { align: 'center' }); y += 12; }
    if (hh.clan) txt(ctx, 'Hidden Clans', 60, y, '#5ad6c8', { align: 'center' });
    else if (hh.legend) txt(ctx, 'Legend', 60, y, '#f5c542', { align: 'center' });
    // right: story / ties
    ui.panel(ctx, 116, 18, 356, 236, hh.color, 0.9);
    const n = tieRows(id).length;
    [['STORY', 'story'], ['TIES', 'ties']].forEach(([lab, pg], k) => {
      const x = 124 + k * 70, on = S.page === pg;
      ui.panel(ctx, x, 22, 64, 13, on ? hh.color : '#3a3d55', on ? 0.95 : 0.6);
      txt(ctx, tr(lab) + (pg === 'ties' ? ' ' + n : ''), x + 32, 24, on ? '#ffffff' : '#8a92b8', { align: 'center', raw: true });
    });
    ctx.save(); ctx.beginPath(); ctx.rect(118, 38, 352, 214); ctx.clip();
    if (S.page === 'story') drawStory(ctx, id, R); else drawTies(ctx, id);
    ctx.restore();
    hint(ctx, S.page === 'story' ? 'A / D: hero    W / S: scroll    J: ties    Esc: back' : 'W / S: choose    J: read their story    Esc: back');
  }
  function drawStory(ctx, id, R) {
    const rows = storyRows(id), top = 42, total = rowsH(rows);
    let y = top - S.scroll;
    rows.forEach(r => {
      if (r.gap) { y += r.gap; return; }
      if (y > top - 12 && y < 252) {
        if (r.label) txt(ctx, r.label, 124, y, R.col);
        txt(ctx, r.t, 124 + r.x, y, r.c, { raw: true, align: r.center ? 'center' : undefined });
      }
      y += 10;
    });
    scrollbar(ctx, 466, 40, 210, total, 206, S.scroll, HR[id].color);
  }
  function drawTies(ctx, id) {
    const rows = tieRows(id), top = 40, view = 212;
    // keep the chosen tie in view
    let at = 0; for (let k = 0; k < S.tie; k++) at += rows[k].h;
    if (at - S.tscroll < 0) S.tscroll = at; else if (at + rows[S.tie].h - S.tscroll > view) S.tscroll = at + rows[S.tie].h - view;
    let y = top - S.tscroll;
    rows.forEach((t, k) => {
      const hh = HR[t.id], K = L.KINDS[t.kind] || L.KINDS.friend, on = k === S.tie;
      if (y + t.h > top - 2 && y < 254) {
        ui.panel(ctx, 122, y, 344, t.h - 3, on ? hh.color : '#2a2d45', on ? 0.95 : 0.6);
        face(ctx, t.id, 124, y + 2, 30, Math.min(36, t.h - 7), on ? 1 : 0.7);
        txt(ctx, nameOf(t.id), 160, y + 3, hh.color, { raw: true });
        const kn = kindName(t.kind, t.id), kx = 160 + tw(nameOf(t.id)) + 6, kw = tw(kn) + 6;
        art.rect(ctx, K.col, kx, y + 2, kw, 11); txt(ctx, kn, kx + 3, y + 3, '#05060c', { shadow: false });
        if (on) txt(ctx, 'J: read', 460, y + 3, '#f5c542', { align: 'right' });
        lines(ctx, t.lines, 160, y + 15, on ? '#ffffff' : '#c8ccd8');
      }
      y += t.h;
    });
    scrollbar(ctx, 466, 40, 210, rows.reduce((a, t) => a + t.h, 0), view, S.tscroll, HR[id].color);
  }

  function drawChron(ctx) {
    backdrop(ctx, CHRON.col); header(ctx); tabs(ctx);
    const reading = S.focus === 'read';
    ui.panel(ctx, 10, 44, 150, 212, S.focus === 'list' ? CHRON.col : '#3a3d55', 0.88);
    L.chapters.forEach((c, i) => {
      const y = 48 + i * 15, on = i === S.chap;
      if (on) { ctx.globalAlpha = 0.3; art.rect(ctx, CHRON.col, 12, y - 1, 146, 13); ctx.globalAlpha = 1; }
      let t = tr(c.title); while (t.length > 4 && tw(t) > 138) t = t.slice(0, -1);
      txt(ctx, t, 16, y + 1, on ? '#ffffff' : '#a8b0c8', { raw: true });
    });
    const ch = L.chapters[S.chap];
    ui.panel(ctx, 166, 44, 304, 212, reading ? CHRON.col : '#3a3d55', 0.88);
    txt(ctx, ch.title, 174, 48, CHRON.hi);
    (ch.cast || []).slice(0, 11).forEach((id, k) => { if (HR[id]) { ui.panel(ctx, 173 + k * 26, 60, 25, 28, HR[id].color, 0.9); face(ctx, id, 174 + k * 26, 61, 23, 26); } });
    const rows = chapRows(S.chap), top = 94, total = rowsH(rows);
    ctx.save(); ctx.beginPath(); ctx.rect(168, 92, 300, 162); ctx.clip();
    let y = top - S.cscroll;
    rows.forEach(r => { if (r.gap) { y += r.gap; return; } if (y > top - 12 && y < 254) txt(ctx, r.t, 174, y, r.c, { raw: true }); y += 10; });
    ctx.restore();
    scrollbar(ctx, 465, 94, 158, total, 158, S.cscroll, CHRON.col);
    hint(ctx, S.focus === 'tabs' ? 'A / D: realm    S or J: chapters    Esc: close'
      : reading ? 'W / S: scroll    A / D: chapter    Esc: back' : 'W / S: chapter    J: read    U / I: realm    Esc: back');
  }

  function draw(ctx) {
    try {
      ensureLang();
      if (S.view === 'hero' && S.hero) drawHero(ctx);
      else if (TABS[S.tab] === 'chron') drawChron(ctx);
      else drawGrid(ctx);
    } catch (e) { console.error(e); S.open = false; }
  }
  S.draw = draw;
  // shared with the new story mode's hero select (js/saga/saga-core.js), so both screens look alike
  L.ui = { face, splash, backdrop, tightName, nameOf, quote, ensureLang, list };

  // ================= hooks =================
  // the keys: while the screen is open it owns them, and nothing under it sees a press
  const _iu = I.update;
  I.update = function () {
    if (S.held) I.now = S.held;   // last frame's real keys (hidden from the game), so a key still held is not a new press
    const out = _iu.apply(this, arguments);
    S.held = null;
    if (!S.open && G.scene === 'title' && !G.overlay) {
      const it = ui.titleItems(G)[ui.title.sel];
      if (it && it[1] === 'stories' && I.ok()) open('title');
    }
    if (!S.open && G.scene === 'vs' && V && V.phase === 'pick' && I.hit('map')) {
      const id = D.heroOrder[V.pick[V.step]];
      if (id && L.heroes[id]) open('vs', id);
    }
    if (S.open) {   // (also on the frame it closes, so the Esc that closed it does not reach the screen underneath)
      try { update(); } catch (e) { console.error(e); S.open = false; }
      S.held = I.now; I.now = {};
    }
    return out;
  };

  // the title menu: "Hero Stories" after Online
  const _ti = ui.titleItems;
  ui.titleItems = function (g) {
    const a = _ti.apply(this, arguments);
    let i = a.findIndex(x => x[1] === 'online'); if (i < 0) i = a.findIndex(x => x[1] === 'versus');
    a.splice(i >= 0 ? i + 1 : a.length, 0, ['Hero Stories', 'stories']);
    return a;
  };
  const _dt = ui.drawTitle;
  ui.drawTitle = function (ctx, g) {
    _dt.apply(this, arguments);
    if (S.open && S.from === 'title') { draw(ctx); return; }
    // with Continue on the menu there are eight lines, and the last one would sit on the key hint: move the hint down
    const items = ui.titleItems(g); if (items.length < 8 || g.overlay) return;
    const y0 = 248, bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, y0, W, H - y0, 0, y0, W, H - y0); else art.rect(ctx, '#0b0c1c', 0, y0, W, H - y0);
    ctx.globalAlpha = 0.45; art.rect(ctx, '#05060c', 0, y0, W, H - y0); ctx.globalAlpha = 1;
    for (let k = 7; k < items.length; k++) txt(ctx, (k === ui.title.sel ? '> ' : '  ') + items[k][0], W / 2 - 40, 150 + k * 14, k === ui.title.sel ? '#f5c542' : '#ffffff');
    txt(ctx, 'W / S: choose    J or Enter: select', W / 2, 260, '#8a92b8', { align: 'center' });
    txt(ctx, 'The Hollow Crown', W - 6, 260, '#5a6078', { align: 'right' });
  };

  // Versus: M on the hero select opens that hero's story
  if (V) {
    const _vu = V.update; V.update = function () { if (S.open) return; return _vu.apply(this, arguments); };
    const _vd = V.draw;
    V.draw = function (ctx) {
      _vd.apply(this, arguments);
      if (S.open && S.from === 'vs') { draw(ctx); return; }
      if (V.phase === 'pick' && !S.open) {
        const id = D.heroOrder[V.pick[V.step]];
        if (id && L.heroes[id]) txt(ctx, 'M: STORY', W - 6, 4, '#8fd3ff', { align: 'right' });
      }
    };
  }

  // ================= checks (console only) =================
  {
    const miss = Object.keys(HR).filter(id => HR[id] && (HR[id].clan || D.heroOrder.indexOf(id) >= 0) && !L.heroes[id]);
    const bad = L.ties.filter(t => !L.heroes[t[0]] || !L.heroes[t[1]] || !L.KINDS[t[2]] || !L.KINDS[t[3]]);
    const few = Object.keys(L.heroes).filter(id => ties(id).length < 3);
    if (miss.length || bad.length || few.length) console.warn('Hero Stories:', { noStory: miss, badTies: bad, underThreeTies: few });
  }

  // ================= the words on the screen, in Spanish and Chinese =================
  const add = (l, m) => { if (SW.i18n && SW.i18n.add) SW.i18n.add(l, m); };
  add('es', {
    'Hero Stories': 'Historias de héroes', 'HERO STORIES': 'HISTORIAS DE HÉROES', '64 heroes  -  4 realms': '64 héroes  -  4 reinos',
    'AURELIA': 'AURELIA', 'THE SURFACE': 'LA SUPERFICIE', 'DEEPLINE': 'DEEPLINE', 'THE BEYOND': 'EL MÁS ALLÁ', 'CHRONICLE': 'CRÓNICA',
    'The Sky': 'El cielo', 'The Land': 'La tierra', 'The Underground': 'El subsuelo', 'Not of This World': 'De otro mundo', 'The Full Story': 'La historia completa',
    'STORY': 'HISTORIA', 'TIES': 'LAZOS', 'ORIGIN': 'ORIGEN', 'ROLE': 'PAPEL', 'LOOK': 'ASPECTO', 'MOVES': 'TÉCNICAS', 'Ultimate': 'Definitiva',
    'Hidden Clans': 'Clanes Ocultos', 'Legend': 'Leyenda', 'J: read': 'J: leer', 'M: STORY': 'M: HISTORIA',
    'RIVAL': 'RIVAL', 'FRIEND': 'AMIGO', 'FAMILY': 'FAMILIA', 'MENTOR': 'MAESTRO', 'STUDENT': 'ALUMNO', 'ENEMY': 'ENEMIGO', 'LOVE': 'AMOR',
    'PARTNER': 'COMPAÑERO', 'IN DEBT': 'EN DEUDA', 'RESCUED': 'RESCATADO', 'DEBTOR': 'DEUDOR', 'WARY': 'RECELO',
    'A / D: realm    S or J: heroes    Esc: close': 'A / D: reino    S o J: héroes    Esc: cerrar',
    'Arrows: choose    J: read    U / I: realm    Esc: back': 'Flechas: elegir    J: leer    U / I: reino    Esc: volver',
    'A / D: hero    W / S: scroll    J: ties    Esc: back': 'A / D: héroe    W / S: desplazar    J: lazos    Esc: volver',
    'W / S: choose    J: read their story    Esc: back': 'W / S: elegir    J: leer su historia    Esc: volver',
    'A / D: realm    S or J: chapters    Esc: close': 'A / D: reino    S o J: capítulos    Esc: cerrar',
    'W / S: scroll    A / D: chapter    Esc: back': 'W / S: desplazar    A / D: capítulo    Esc: volver',
    'W / S: chapter    J: read    U / I: realm    Esc: back': 'W / S: capítulo    J: leer    U / I: reino    Esc: volver'
  });
  add('zh', {
    'Hero Stories': '英雄故事', 'HERO STORIES': '英雄故事', '64 heroes  -  4 realms': '64 位英雄  -  4 个领域',
    'AURELIA': '奥蕾莉亚', 'THE SURFACE': '地表', 'DEEPLINE': '深线', 'THE BEYOND': '彼岸', 'CHRONICLE': '编年史',
    'The Sky': '天空', 'The Land': '大地', 'The Underground': '地下', 'Not of This World': '异界来客', 'The Full Story': '完整故事',
    'STORY': '故事', 'TIES': '关系', 'ORIGIN': '出身', 'ROLE': '身份', 'LOOK': '外貌', 'MOVES': '招式', 'Ultimate': '终极技',
    'Hidden Clans': '隐秘氏族', 'Legend': '传奇', 'J: read': 'J：阅读', 'M: STORY': 'M：故事',
    'RIVAL': '宿敌', 'FRIEND': '朋友', 'FAMILY': '家人', 'MENTOR': '师父', 'STUDENT': '徒弟', 'ENEMY': '仇敌', 'LOVE': '恋人',
    'PARTNER': '搭档', 'IN DEBT': '亏欠', 'RESCUED': '获救', 'DEBTOR': '欠债人', 'WARY': '戒备',
    'A / D: realm    S or J: heroes    Esc: close': 'A / D：领域    S 或 J：英雄    Esc：关闭',
    'Arrows: choose    J: read    U / I: realm    Esc: back': '方向键：选择    J：阅读    U / I：领域    Esc：返回',
    'A / D: hero    W / S: scroll    J: ties    Esc: back': 'A / D：英雄    W / S：滚动    J：关系    Esc：返回',
    'W / S: choose    J: read their story    Esc: back': 'W / S：选择    J：阅读其故事    Esc：返回',
    'A / D: realm    S or J: chapters    Esc: close': 'A / D：领域    S 或 J：章节    Esc：关闭',
    'W / S: scroll    A / D: chapter    Esc: back': 'W / S：滚动    A / D：章节    Esc：返回',
    'W / S: chapter    J: read    U / I: realm    Esc: back': 'W / S：章节    J：阅读    U / I：领域    Esc：返回'
  });
})();
