'use strict';
// Shattered Worlds - The Hollow Crown: THE TRAVEL MAP (the user, 2026-11-20: "let player able to travel to different
// heroes or locations to improve game experience").
// While a Hollow Crown game runs, the map (M, the Map button, or Esc > J in the rescue) is this one: the three layers
// as three bands (Aurelia, the Surface, Deepline), every place of the rescue on its band with the faces of the heroes
// there, and the Crown over the Crater.
//   - A face's mark says the hero's plight: a violet crown (Called), red (a champion), orange (the Legion), gold (a
//     Siege Walker); a green tick when they are rescued. A place whose heroes are all rescued is freed (it glows), and
//     a whole layer freed says so. "YOU" marks where the hero stands.
//   - Arrows choose a hero (or the Crown); J travels there and starts that rescue. The Crown opens once enough heroes
//     are rescued (saga-rescue.js: 8, at least 2 from each layer); J on it starts the finale.
//   - Before the rescue (chapters 1-5) and in the finale the map only shows where the story is; it does not travel.
// Only wraps: ui.drawMap, I.update. Loaded after js/saga/saga-rescue.js.
(function () {
  const SW = window.SW, G = SW && SW.game, ui = SW && SW.ui, I = SW && SW.input, art = SW && SW.art, SG = SW && SW.saga, D = SW && SW.data, W = SW && SW.W, H = SW && SW.H;
  if (!G || !ui || !I || !SG || !SG.rescue) return;
  const HR = D.heroes, Rs = SG.rescue;
  const on = () => !!(G.state && G.state.saga && G.scene === 'play');
  const txt = (ctx, s, x, y, c, o) => SW.text(ctx, s, x, y, c, o);
  const sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no audio yet */ } };
  const zname = z => (SW.zones[z] ? SW.zones[z].name : z);
  const tr = s => (SW.i18n && SW.i18n.tr ? SW.i18n.tr(s) : s);
  const fill = (s, ...a) => a.reduce((o, v, i) => o.split('{' + i + '}').join(v), s);   // a pattern, filled after it is translated

  // the places of each layer, west to east (roughly as the world lies)
  const BANDS = [
    { id: 'sky', name: 'AURELIA', sub: 'the Sky', col: '#d9b45a', zones: ['medlab', 'cryo', 'furnace', 'blank', 'hydro', 'ward', 'range', 'archive', 'noble', 'shrine', 'gallery', 'stacks', 'skyport', 'skylift', 'pylon', 'ballast'] },
    { id: 'land', name: 'THE SURFACE', sub: 'the ground', col: '#c8642a', zones: ['dunes', 'meridian', 'sinkhole', 'milezero', 'saloon', 'scrapton', 'dig', 'hollow', 'village', 'pens', 'glowwild', 'icehouse', 'tethers', 'anchor', 'glasssea', 'crater'] },
    { id: 'deep', name: 'DEEPLINE', sub: 'below', col: '#ff3ea5', zones: ['slums', 'market', 'pit', 'metro', 'platform', 'yard', 'works', 'core', 'shafts', 'docks', 'waterworks', 'choir', 'rootways'] }
  ];
  const BY = [28, 92, 156], BH = 60, PANEL = 220;
  const MARK = { called: '#b48cff', champion: '#ff5a5a', legion: '#ff9a3a', walker: '#ffd04a', rescued: '#7dffa0', here: '#22d3ee' };
  // every selectable thing on the map: { band, zone, id (a hero, or 'crown'), x, y }
  function layout() {
    const items = [], nodes = [], me = G.state.hero;
    BANDS.forEach((b, bi) => {
      const n = b.zones.length;
      b.zones.forEach((z, i) => {
        const x = Math.round(22 + i * (436 / (n - 1))), y = BY[bi] + 20 + (i % 2) * 20;
        const ids = z === 'crater' ? ['crown'] : Rs.others().filter(id => Rs.plan(id).zone === z && id !== me);
        const node = { band: bi, zone: z, x, y, ids, w: z === 'crater' ? 22 : Math.max(1, ids.length) * 15 + 1 };
        nodes.push(node);
        ids.forEach((id, k) => items.push({ band: bi, zone: z, id, node, x: x - node.w / 2 + 1 + k * 15 + 7, y }));
      });
    });
    return { items, nodes };
  }
  const M = SG.map = { sel: null, held: null };
  const canTravel = () => { const sg = G.state.saga; return (sg.ch === 6 && sg.phase === 'play') || (sg.phase === 'end' && sg.endSeen); };
  const free = node => node.ids.length && node.ids[0] !== 'crown' && node.ids.every(id => Rs.status(id) === 'rescued');

  // a face, scaled from the hero's splash art (lore/screen.js crops faces 1:1, too big for a map pin)
  function miniFace(ctx, id, x, y, s, alpha) {
    const hh = HR[id], img = art.bg['hero_' + id];
    ctx.save(); if (alpha !== undefined) ctx.globalAlpha = alpha;
    if (img) { const cx = (hh.gridX || 27) + 22, cy = 33, r = 19; ctx.drawImage(img, Math.round(cx - r), Math.round(cy - r), r * 2, r * 2, x, y, s, s); }
    else { art.rect(ctx, art.shade ? art.shade(hh.color, 0.3) : hh.color, x, y, s, s); const sh = art.sheets[hh.sheet], hd = sh && sh.head; if (hd) ctx.drawImage(hd, x, y, s, s); }
    ctx.restore();
  }
  function crownIcon(ctx, x, y, col, a) {
    ctx.globalAlpha = a; art.rect(ctx, col, x - 8, y, 17, 2);
    [[-8, 5], [-4, 7], [0, 9], [4, 7], [8, 5]].forEach(([dx, h]) => art.rect(ctx, col, x + dx, y - h, 1, h));
    ctx.globalAlpha = 1;
  }

  // ================= drawing =================
  function bandBack(ctx, b, bi) {
    const y0 = BY[bi], t = SW.frame;
    ctx.globalAlpha = 0.13; art.rect(ctx, b.col, 6, y0, W - 12, BH); ctx.globalAlpha = 1;
    art.rect(ctx, b.col, 6, y0, W - 12, 1);
    ctx.globalAlpha = 0.22;
    if (b.id === 'sky') for (let i = 0; i < 24; i++) { const x = 10 + i * 19, h = 8 + ((i * 37) % 17); art.rect(ctx, b.col, x, y0 + BH - h, 6, h); }
    if (b.id === 'land') { art.rect(ctx, b.col, 6, y0 + BH - 6, W - 12, 6); for (let i = 0; i < 14; i++) art.rect(ctx, b.col, 14 + i * 33, y0 + BH - 9 - (i % 3) * 2, 18, 3 + (i % 3) * 2); }
    if (b.id === 'deep') for (let i = 0; i < 8; i++) { const x = 18 + i * 58; art.rect(ctx, b.col, x, y0 + 8, 36, 2); art.rect(ctx, b.col, x, y0 + 8, 2, BH - 10); art.rect(ctx, b.col, x + 34, y0 + 8, 2, BH - 10); }
    ctx.globalAlpha = 1;
    // the Legion: drifting violet motes over a layer it still holds
    const held = BANDS[bi].zones.some(z => Rs.others().some(id => Rs.plan(id).zone === z && Rs.status(id) !== 'rescued'));
    if (held && canTravel()) for (let i = 0; i < 10; i++) { const x = (i * 53 + t * (0.2 + (i % 3) * 0.1)) % (W - 20) + 10, y = y0 + 6 + ((i * 17 + (t >> 2)) % (BH - 10)); ctx.globalAlpha = 0.35; art.rect(ctx, '#b48cff', Math.round(x), Math.round(y), 1, 1); ctx.globalAlpha = 1; }
    txt(ctx, b.name, 10, y0 + 3, b.col);
    const rs = Rs.others().filter(id => Rs.realmOf(id) === b.id), nd = rs.filter(id => Rs.status(id) === 'rescued').length;
    if (canTravel()) txt(ctx, rs.length && nd === rs.length ? 'FREED' : nd + ' / ' + rs.length + ' rescued', W - 10, y0 + 3, rs.length && nd === rs.length ? '#7dffa0' : '#8a92b8', { align: 'right' });
  }
  function drawNode(ctx, node, sel, live) {
    const { x, y } = node, t = SW.frame, here = G.zone && G.zone.id === node.zone;
    if (node.zone === 'crater') {
      const ok = Rs.ready(), a = ok ? 0.75 + 0.25 * Math.sin(t * 0.1) : 0.5;
      art.glow(ctx, x, y + 4, 18, ok ? '#f5c542' : '#b48cff', ok ? 0.35 : 0.15);
      crownIcon(ctx, x, y + 6, ok ? '#f5c542' : '#b48cff', a);
      txt(ctx, 'THE CROWN', Math.min(x, W - 10 - SW.textW('THE CROWN') / 2), y + 10, ok ? '#f5c542' : '#8a7aa8', { align: 'center' });
    } else if (!node.ids.length) {   // the played hero's own place: nobody there to rescue
      art.rect(ctx, BANDS[node.band].col, x - 1, y + 6, 3, 3);
    } else {
      const fr = free(node);
      if (fr && live) art.glow(ctx, x, y + 6, 16, '#7dffa0', 0.18 + 0.05 * Math.sin(t * 0.06));
      ui.panel(ctx, x - node.w / 2, y - 1, node.w, 16, fr && live ? '#7dffa0' : '#3a3d55', 0.85);
      node.ids.forEach((id, k) => {
        const fx0 = x - node.w / 2 + 2 + k * 15, st = Rs.status(id);
        if (live) {
          miniFace(ctx, id, fx0, y + 1, 13, st === 'rescued' ? 1 : 0.8);
          art.rect(ctx, MARK[st] || '#ffffff', fx0, y + 13, 13, 2);
          if (st === 'called') crownIcon(ctx, fx0 + 6, y - 3, '#b48cff', 0.6 + 0.4 * Math.sin(t * 0.12 + k));
          if (st === 'rescued') { art.rect(ctx, '#7dffa0', fx0 + 9, y + 8, 2, 2); art.rect(ctx, '#7dffa0', fx0 + 11, y + 4, 2, 5); }
          if (st === 'here') { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 0.2); art.ring(ctx, '#22d3ee', fx0 + 6, y + 7, 9); ctx.globalAlpha = 1; }
        } else art.rect(ctx, BANDS[node.band].col, fx0 + 5, y + 5, 3, 3);
      });
    }
    if (here && SW.frame % 40 < 28) { txt(ctx, 'YOU', x, y - 12, '#22d3ee', { align: 'center' }); art.rect(ctx, '#22d3ee', x - 1, y - 4, 3, 2); }
  }
  function draw(ctx) {
    const sg = G.state.saga, live = canTravel(), L = layout();
    if (M.sel && !L.items.some(i => i.id === M.sel)) M.sel = null;
    if (!M.sel) { const here = L.items.find(i => G.zone && i.zone === G.zone.id && i.id !== 'crown' && Rs.status(i.id) !== 'rescued') || L.items.find(i => i.id !== 'crown' && Rs.status(i.id) !== 'rescued') || L.items[0]; M.sel = here && here.id; }
    ctx.globalAlpha = 0.96; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    txt(ctx, 'THE THREE LAYERS', 8, 4, '#ffffff', { scale: 2 });
    txt(ctx, live ? 'Arrows: choose    J: travel    M / Esc: close' : 'M / Esc: close', 8, 19, '#5a6078');
    if (live) {
      const n = Rs.count(), p = Rs.perLayer();
      txt(ctx, 'THE MUSTER  ' + n + ' / ' + Rs.total(), W - 8, 4, '#ffe066', { align: 'right' });
      txt(ctx, sg.phase === 'end' ? (Rs.all() ? 'Every one came home' : 'The Crown has fallen. Bring the rest home') : Rs.ready() ? 'The Crown can be stormed' : 'Crown: ' + Rs.NEED + ' rescued, ' + Rs.PER + ' per layer (' + p.sky + ' / ' + p.land + ' / ' + p.deep + ')', W - 8, 14, Rs.ready() ? '#f5c542' : '#8a92b8', { align: 'right' });
    } else txt(ctx, 'Chapter ' + Math.min(SG.LAST || 7, sg.ch) + ': ' + (SG.KIND ? SG.KIND[Math.min(SG.LAST || 7, sg.ch) - 1] : ''), W - 8, 8, '#8a92b8', { align: 'right' });
    BANDS.forEach((b, bi) => bandBack(ctx, b, bi));
    // the shafts between the layers: the Skylift (Sky to Surface) and the Metro Shaft (Surface to Deepline)
    ctx.globalAlpha = 0.5; for (let y = BY[0] + BH; y < BY[1]; y += 2) art.rect(ctx, '#8b5cf6', 330, y, 1, 1); for (let y = BY[1] + BH; y < BY[2]; y += 2) art.rect(ctx, '#8b5cf6', 150, y, 1, 1); ctx.globalAlpha = 1;
    L.nodes.forEach(nd => drawNode(ctx, nd, false, live));
    // the chosen one
    const it = L.items.find(i => i.id === M.sel);
    if (it) {
      const a = 0.6 + 0.4 * Math.sin(SW.frame * 0.2);
      ctx.globalAlpha = a;
      if (it.id === 'crown') art.ring(ctx, '#ffffff', it.node.x, it.node.y + 4, 13); else { art.rect(ctx, '#ffffff', it.x - 8, it.y - 2, 17, 1); art.rect(ctx, '#ffffff', it.x - 8, it.y + 16, 17, 1); art.rect(ctx, '#ffffff', it.x - 8, it.y - 2, 1, 19); art.rect(ctx, '#ffffff', it.x + 8, it.y - 2, 1, 19); }
      ctx.globalAlpha = 1;
      const lbl = SG.placeName ? SG.placeName(it.id === 'crown' ? 'crater' : it.zone) : it.id === 'crown' ? 'The Crater' : zname(it.zone), lx = Math.max(6 + SW.textW(lbl) / 2, Math.min(W - 6 - SW.textW(lbl) / 2, it.node.x));
      art.rect(ctx, '#05060c', Math.round(lx - SW.textW(lbl) / 2 - 2), it.node.y + 17, SW.textW(lbl) + 4, 10);
      txt(ctx, lbl, lx, it.node.y + 18, '#ffffff', { align: 'center' });
    }
    panel(ctx, it, live);
  }
  function panel(ctx, it, live) {
    const y = PANEL, sg = G.state.saga;
    ui.panel(ctx, 6, y, W - 12, 48, it && it.id !== 'crown' && HR[it.id] ? HR[it.id].color : '#b48cff', 0.95);
    if (!it) return;
    if (!live) {
      const z = SG.chap ? SG.chap(G.state.hero, Math.min(SG.LAST || 7, sg.ch)).zone : null;
      txt(ctx, sg.phase === 'end' ? 'The map opens for travel when the ending card is closed.' : sg.ch < 6 ? 'The map opens for travel once the Convergence has fallen and Vael has come.' : 'The finale is under way at the Crater.', 14, y + 6, '#e8ecf4');
      if (z && sg.phase !== 'end') txt(ctx, fill(tr('The story goes on in: {0}'), SG.placeName ? SG.placeName(z) : zname(z)), 14, y + 20, '#22d3ee', { raw: true });
      txt(ctx, 'M / Esc: close', W - 14, y + 36, '#8a92b8', { align: 'right' });
      return;
    }
    if (it.id === 'crown') {
      const ok = Rs.ready(), p = Rs.perLayer();
      crownIcon(ctx, 32, y + 22, ok ? '#f5c542' : '#b48cff', 1);
      txt(ctx, 'THE HOLLOW CROWN', 56, y + 5, '#f5c542');
      const s = sg.phase === 'end' ? 'The Crown has fallen. Bring the rest home: all ' + Rs.total() + ' for the true ending.'
        : ok ? 'Itsuki, the last champion, and Sovereign Vael. Every rescued hero strikes beside you.' : 'Rescue ' + Rs.NEED + ' heroes, at least ' + Rs.PER + ' from each layer, to storm it (now ' + Rs.count() + ': ' + p.sky + ' / ' + p.land + ' / ' + p.deep + ').';
      let yy = y + 17; SW.wrap(s, 400).slice(0, 2).forEach(l => { txt(ctx, l, 56, yy, '#e8ecf4', { raw: true }); yy += 10; });
      txt(ctx, ok && sg.phase !== 'end' ? 'J: storm the Crown' : '', W - 14, y + 36, '#f5c542', { align: 'right' });
      return;
    }
    const id = it.id, h = HR[id], st = Rs.status(id), X = Rs.text(id);
    ui.panel(ctx, 10, y + 4, 40, 40, h.color, 0.9); miniFace(ctx, id, 11, y + 5, 38);
    txt(ctx, h.name.toUpperCase(), 56, y + 4, h.color);
    txt(ctx, (X.title ? tr(X.title) + '  -  ' : '') + (SG.placeName ? SG.placeName(it.zone) : tr(zname(it.zone))), 56 + SW.textW(h.name.toUpperCase()) + 8, y + 4, '#8a92b8', { raw: true });
    const line = st === 'rescued' ? tr('Rescued. In the muster.') : st === 'here' ? fill(tr('You are on your way: {0}'), Rs.kindLine(id)) : Rs.kindLine(id);
    txt(ctx, line, 56, y + 15, MARK[st] || '#ffffff', { raw: true });
    if (X.place) SW.wrap(X.place, 400).slice(0, 2).forEach((l, i) => txt(ctx, l, 56, y + 26 + i * 10, '#c8ccd8', { raw: true }));
    txt(ctx, st === 'rescued' ? 'M: close' : 'J: travel', W - 14, y + 4, st === 'rescued' ? '#8a92b8' : '#22d3ee', { align: 'right' });
  }

  // ================= keys =================
  function move(dx, dy) {
    const L = layout(), cur = L.items.find(i => i.id === M.sel) || L.items[0]; if (!cur) return;
    let best = null;
    if (dx) {
      const row = L.items.filter(i => i.band === cur.band).sort((a, b) => a.x - b.x), k = row.indexOf(cur);
      best = row[(k + dx + row.length) % row.length];
    } else {
      const b = (cur.band + dy + 3) % 3, row = L.items.filter(i => i.band === b);
      let bd = 1e9; row.forEach(i => { const d = Math.abs(i.x - cur.x); if (d < bd) { bd = d; best = i; } });
    }
    if (best && best.id !== M.sel) { M.sel = best.id; sfx('move'); }
  }
  function update() {
    if (I.hit('pause') || I.hit('map') || I.hit('jump')) { G.overlay = null; sfx('back'); return; }
    if (I.hit('left')) move(-1, 0); else if (I.hit('right')) move(1, 0); else if (I.hit('up')) move(0, -1); else if (I.hit('down')) move(0, 1);
    if (I.ok() && canTravel() && M.sel) {
      if (M.sel === 'crown') { if (G.state.saga.phase !== 'end' && Rs.ready()) { sfx('select'); Rs.storm(); } else sfx('deny'); return; }
      if (Rs.status(M.sel) === 'rescued') { sfx('deny'); return; }
      sfx('select'); Rs.go(M.sel);
    }
  }
  const _iu = I.update;
  I.update = function () {
    if (M.held) I.now = M.held;
    const out = _iu.apply(this, arguments);
    M.held = null;
    if (on() && G.overlay === 'map' && !(G.fade && G.fade.dir)) {
      try { update(); } catch (e) { console.error(e); G.overlay = null; }
      M.held = I.now; I.now = {};
    }
    return out;
  };
  const _dm = ui.drawMap;
  ui.drawMap = function (ctx, g) { if (!on()) return _dm.apply(this, arguments); try { draw(ctx); } catch (e) { console.error(e); _dm.apply(this, arguments); } };
})();
