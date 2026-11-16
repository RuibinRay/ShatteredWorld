'use strict';
// Shattered Worlds — the Hidden Clans: twelve ninja heroes who fight only in Versus (Player vs Bot, Player vs
// Player, Bot vs Bot, Training, 3 vs 3). They never appear in the story: the story's hero select does not list them.
// All original characters, built on the same move layout as everyone else (U, S+U, I, S+I, S+O, O, W+I).
//
// This file is the shared part: how a ninja is registered, the Versus-only roster, sprites, trait hooks and the
// move helpers. The heroes themselves are in ninjas1.js (Rook, Sable, Dune, Moro, Pell, Hollis) and ninjas2.js
// (Kestra, Ivo, Nami, Lin, Corvin, Thorne). Loaded after moves.js, like the other expansions it only adds and wraps.
//
// Versus-only, how: D.heroOrder is the one list both the story select and Versus read. The ninjas sit at the end of it,
// and while the story select or the prologue is on screen they are taken out (and put back as soon as it is left), so
// the story's indices never change and nothing else needs to know.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, V = SW.versus, W = SW.W, text = SW.text;
  const HR = D.heroes, A = D.abilities, P = SW.Player.prototype, M = SW.moves, rand = SW.rand;
  const sfx = n => SW.audio.sfx(n);
  const IDS = [];
  const isNinja = id => IDS.indexOf(id) >= 0;

  // ---------- the Versus-only roster ----------
  let full = true;   // true: the ninjas are in D.heroOrder
  function view(story) {
    if (story !== full) return;
    const a = D.heroOrder, base = a.filter(id => !isNinja(id));
    a.length = 0; base.forEach(id => a.push(id));
    if (!story) IDS.forEach(id => a.push(id));
    full = !story;
    if (story && ui.sel && ui.sel.i >= a.length) ui.sel.i = 0;
  }
  const before = (obj, key, story) => { const f = obj && obj[key]; if (typeof f !== 'function') return; obj[key] = function () { view(story); return f.apply(this, arguments); }; };
  before(ui, 'selectUpdate', true); before(ui, 'drawSelect', true); before(ui, 'drawPrologue', true);
  before(V, 'open', false); before(V, 'update', false); before(V, 'draw', false); before(V, 'duel', false);
  const _ng = G.newGame; G.newGame = function () { view(true); try { return _ng.apply(this, arguments); } finally { view(false); } };

  // ---------- registering a hero ----------
  const AW = 'Awakening: +40% damage and super armour for 15 s.', SPD = '+25% speed and a flash-step dash for 10 s.', DMG = '+30% damage for 10 s.';
  // kit: [U, S+U, I, traversal (story only, never shown here), S+O mode, O awakening, W+I ultimate]
  function hero(id, o) {
    const r = HR[o.route];
    HR[id] = Object.assign({ id, sheet: id, sheetAw: id + '_aw', ult: 'storm', start: r.start, item: r.item, spark: true, awaken: o.kit[5], ultimate: o.kit[6], mode: o.kit[4], clan: true }, o);
    D.heroOrder.push(id); IDS.push(id);
  }
  // a: { id: { name, input?, cost?, dmg?, desc } } for the U, S+U, I moves and the ultimate; mode and awakening get their standard text
  function abilities(id, a, modeName, awakenName) {
    const h = HR[id];
    Object.assign(A, a);
    A[h.mode] = { name: modeName, input: 'S + O', cost: 100, desc: h.modeKind === 'speed' ? SPD : DMG };
    A[h.awaken] = { name: awakenName, input: 'O (awakening full)', desc: AW };
    const u = A[h.ultimate]; u.input = 'W + I (full energy)'; u.cost = 100; u.desc = 'Ultimate: ' + u.desc + ' Costs all three bars, or one while awakened.';
  }
  // the S + I move, the same way moves.js adds everyone else's
  function burst(heroId, id, name, dmg, desc, cast, o) { if (!M || !M.BURST) return; M.BURST[heroId] = Object.assign({ id, cast }, o || {}); A[id] = { name, input: 'S + I', cost: 100, dmg, desc }; HR[heroId].kit.push(id); }
  const ULT = {};
  const _ult = SW.ultFx; SW.ultFx = function (p, g, z, foes) {
    const r = _ult ? _ult(p, g, z, foes) : false, h = g.hero(), f = ULT[h.ultimate];   // the chain first: heroes3.js starts the portrait cut-in there
    if (!f) return r;
    f(p, z, foes, Math.round(A[h.ultimate].dmg * p.specMul()), h);
    return true;
  };

  // ---------- traits: one hook table, looked up by the hero's trait ----------
  // { dmg(p, g) -> multiplier, hit(p, atk, e, b, g), hurt(p, atk, g) -> atk | 'none' (before the hit lands), tick(p, g, z), mark(ctx, p, x, y, g) }
  const TRAITS = {};
  const trOf = g => { const h = g && g.state && g.hero(); return h && h.clan ? TRAITS[h.trait] : null; };
  const _dm = P.dmgMul; P.dmgMul = function () { const t = trOf(this.G), m = _dm.call(this); return t && t.dmg ? m * t.dmg(this, this.G) : m; };
  const _oh = G.onHit; G.onHit = function (atk, e, b) { _oh(atk, e, b); const t = trOf(G), p = G.player; if (t && t.hit && p && !p.dead) t.hit(p, atk, e, b, G); };
  const _th = P.takeHit; P.takeHit = function (atk, g) {
    const t = trOf(g);
    if (t && t.hurt && !this.dead && !(this.invuln > 0) && !(this.iframes > 0) && !g.busy()) { const a = t.hurt(this, atk, g); if (a === 'none') return 'none'; if (a) atk = a; }
    const r = _th.call(this, atk, g);
    if (t && t.after) t.after(this, atk, r, g);
    return r;
  };
  const _pu = P.update; P.update = function (g, z) { _pu.call(this, g, z); const t = trOf(g); if (t && t.tick && !this.dead) t.tick(this, g, z); };
  const _sp = P.speed; P.speed = function () { const t = trOf(this.G), s = _sp.call(this); return t && t.spd ? s * t.spd(this, this.G) : s; };
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    _pd.call(this, ctx, cam, g);
    const t = trOf(g); if (t && t.mark && !this.dead) t.mark(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y), g);
  };
  // small pips over the head: n of max filled
  function pips(ctx, x, y, n, max, col) { for (let i = 0; i < max; i++) { art.rect(ctx, '#05060c', x - max * 2 + i * 4 - 1, y - 1, 4, 4); art.rect(ctx, i < n ? col : '#3a3d55', x - max * 2 + i * 4, y, 2, 2); } }

  // ---------- helpers for the moves ----------
  const hit = (x, y, w, h, dmg, o) => SW.strike(G, Object.assign({ team: 'player', x, y, w, h, dmg, kx: 0, ky: -2, stun: 26, energy: true, hitSet: new Set(), quiet: true }, o || {}));
  const hurt = (e, dmg, o) => { if (!e || e.dead) return false; const b = e.box(), atk = Object.assign({ team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg, kx: 0, ky: -2, stun: 24, energy: true, heavy: true, hitSet: new Set(), quiet: true }, o || {}); const r = e.takeHit(atk, G); if (r === 'hit') G.onHit(atk, e, b); return r === 'hit'; };
  const isFoe = e => e.hittable && e.team === 'enemy' && !e.dead;
  const around = (z, x, y, r) => z.ents.filter(e => isFoe(e) && Math.hypot(e.x - x, e.y - e.h / 2 - y) < r);
  const light = e => !e.isBoss && !e.isProxy && !(e.def && e.def.heavy);
  const part = (x, y, col, vx, vy, life, s, g) => fx.list.push({ k: 'p', x, y, vx: vx || 0, vy: vy || 0, g: g || 0, life: life || 14, max: life || 14, col, s: s || 2 });
  const front = (o, reach, h, back) => [o.face > 0 ? o.x - (back || 0) : o.x - reach, o.y - h, reach + (back || 0), h];
  const slide = (p, z, dir, n) => { for (let s = 0; s < n; s++) { if (z.hit(p.x + dir - p.w / 2, p.y - p.h, p.w, p.h)) return false; p.x += dir; } return true; };
  const ahead = (p, z, r) => { let best = null, bd = r; z.ents.forEach(e => { if (!isFoe(e)) return; const d = Math.hypot(e.x - p.x, e.y - p.y); if ((e.x - p.x) * p.face > -24 && d < bd) { bd = d; best = e; } }); return best; };
  const nearest = (z, x, y, r) => { let best = null, bd = r; z.ents.forEach(e => { if (!isFoe(e)) return; const d = Math.hypot(e.x - x, e.y - y); if (d < bd) { bd = d; best = e; } }); return best; };
  const every = (p, a, b, n) => p.st >= a && p.st <= b && (p.st - a) % n === 0;
  const floorY = (z, x, y) => { let n = 0; while (!z.hit(x - 2, y, 4, 2, true) && n++ < 60) y += 2; return y; };
  // the fighter a proxy stands for, in Versus (so a move can touch the opponent's energy); null elsewhere
  const fighterOf = e => (G.scene === 'vs' && e && e.isProxy && V.f ? V.f.find(f => f.p && f.state !== G.state && Math.abs(f.p.x - e.x) < 1 && Math.abs(f.p.y - e.y) < 1) || null : null);
  // a pose shown for n frames of the cast state, then cleared
  const pose = (p, anim, f, n) => { const ps = [anim, f]; p.pose = ps; G.zone.shots.push(new Later(n || 14, () => { if (p.pose === ps) p.pose = null; })); };
  class Later { constructor(n, fn) { this.n = n; this.fn = fn; } update(g, z) { if (--this.n <= 0) { this.gone = true; this.fn(g, z); } } draw() {} }
  class Vis {
    constructor(x, y, life, render, tick) { Object.assign(this, { x, y, life, render, tick, t: 0 }); }
    update(g, z) { this.t++; if (this.tick) this.tick(this, g, z); if (this.t >= this.life) this.gone = true; }
    draw(ctx, cam) { if (this.render) this.render(ctx, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this.t, this); }
  }
  class Drive {   // holds the hero in the cast state while a move carries them
    constructor(p, n, step, end) { Object.assign(this, { p, n, step, end, t: 0 }); }
    update(g, z) {
      const p = this.p;
      if (p.dead || p.state === 'hurt') { this.gone = true; p.pose = null; return; }
      this.t++; p.state = 'cast'; p.st = 8; p.castFn = null;
      if (this.step(this.t, p, z, g) === false || this.t >= this.n) { this.gone = true; if (this.end) this.end(p, z, g); p.pose = null; p.enter(p.onGround ? 'idle' : 'fall'); }
    }
    draw() {}
  }
  // a column out of the ground after a short warning: o = { w, h, cols[3], atk, spike, sfx }
  function pillar(z, x, gy, delay, dmg, o) {
    const hs = new Set();
    z.shots.push(new Vis(x, gy, delay + 30, (ctx, sx, sy, t) => {
      if (t < delay) { ctx.globalAlpha = 0.55; art.rect(ctx, o.cols[0], Math.round(sx - o.w / 2 * (t / delay)), sy - 1, Math.round(o.w * (t / delay)), 2); ctx.globalAlpha = 1; return; }
      const k = t - delay, hh = Math.round(o.h * Math.min(1, k / 5) * (k > 22 ? Math.max(0, 1 - (k - 22) / 8) : 1));
      for (let i = 0; i < hh; i += 4) {
        const f = o.spike ? 1 - i / o.h : 0.75 + 0.25 * Math.sin(i * 0.4 + k * 0.6), w = Math.max(2, Math.round(o.w * f));
        art.rect(ctx, o.cols[0], Math.round(sx - w / 2), sy - i - 4, w, 4); art.rect(ctx, o.cols[1], Math.round(sx - w / 4), sy - i - 4, Math.max(1, Math.round(w / 2)), 4);
        if (i % 12 === 0) art.rect(ctx, o.cols[2], Math.round(sx - w / 2) + 1, sy - i - 4, 1, 4);
      }
      art.glow(ctx, sx, sy - hh / 2, o.w, o.cols[0], 0.14);
    }, v => {
      if (v.t !== delay) return;
      hit(x - o.w / 2, gy - o.h, o.w, o.h, dmg, Object.assign({ hitSet: hs, srcX: x, heavy: true }, o.atk));
      fx.ring(x, gy - 6, o.cols[0], 6, o.w + 14, 12); fx.debris(x, gy - 10, o.cols[1], 6); fx.shake(3, 6); sfx(o.sfx || 'explode');
    }));
  }
  // a copy of the hero, drawn from their own sheet (clones, afterimages, doubles)
  const double = (sheet, anim, f, x, y, flip, a) => (ctx, cam) => art.draw(ctx, sheet, anim, f, x - cam.x, y - cam.y, flip, { alpha: a === undefined ? 0.85 : a });
  const smoke = (x, y, n, cols) => { for (let i = 0; i < (n || 12); i++) part(x + rand(-9, 9), y - rand(0, 30), (cols || ['#c8ccd8', '#8a92a8', '#ffffff'])[i % 3], rand(-1.2, 1.2), rand(-1, 0.2), 22, 3, -0.01); };

  // ---------- sprites ----------
  const HEADS = {
    headband: ['.h..h..h...', '.hhhhhhhh..', 'hhhhhhhhhh.', '.mmmmmmwWm.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    scarf:    ['...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhhsssss..', 'hhhsssesss.', 'hhhmmmmmmm.', 'hhHmmmmmmmm', 'hhH.Mmmmmm.', 'hH..MMmmm..'],
    crowhood: ['...hhhhh...', '..hhhhhhhh.', '.hhhhhhhhhh', '.hhhHHHHhh.', '.hhhHSSSSS.', '.hhHSSSgSS.', '.hhHSSSSSSm', '.hhhSSSSS..', '.hhhhSSSS..', '..hhhhh....'],
    veil:     ['...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', '.hhhhhhhhh.', '.Hhhsssss..', '.Hhsssgsss.', '.Hmmmmmmmm.', '..Mmmmmmmmm', '..Mmmmmmm..', '...MMmmm...'],
    sage:     ['...........', '...hhhhh...', '..hhhhhhhh.', '.hhhmmmmmm.', 'hhhhsssss..', 'hhhsssesss.', 'hhHssssesss', 'hhHwwwwwwww', 'hH.wwwwwww.', 'h...wwwww..'],
    knot:     ['.....hh....', '....hhhh...', '...hhhhhh..', '..hhhhhhhh.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...']
  };
  const WEAPONS = {
    warfan:    { len: 9, w: 6, col: '#f0e6d0', hi: '#ff6b35', hilt: '#3a2a20' },
    bonesword: { len: 17, w: 3, col: '#ece6cc', hi: '#ffffff', hilt: '#a89c78' },
    cleaver2:  { len: 22, w: 5, col: '#8aa8c8', hi: '#e8f4ff', hilt: '#2a3a5a' },
    kunai:     { len: 8, w: 2, col: '#c8ccd8', hi: '#ffffff', hilt: '#6c5aff' }
  };
  const RIG = {}, BORROW = {};
  const lit = (cfg, h) => Object.assign({}, cfg, { outline: art.shade(h.color, 0.35), c: Object.assign({}, cfg.c, { hair: h.colorHi, top: h.color, arm: cfg.c.arm === cfg.c.skin ? cfg.c.skin : h.color, belt: '#ffffff', chest: '#ffffff', trail: cfg.c.trail ? h.colorHi : undefined, glow: '#ffffff' }) });
  const borrow = () => IDS.forEach(id => { const b = BORROW[id] || 'kael'; art.sheets[id] = art.sheets[id] || art.sheets[b]; art.sheets[id + '_aw'] = art.sheets[id + '_aw'] || art.sheets[b + '_aw'] || art.sheets[id]; });
  function bake() {
    if (!art.bake) return;
    Object.assign(art.HEADS, HEADS); Object.assign(art.WEAPONS, WEAPONS);
    IDS.forEach(id => { if (!RIG[id]) return; try { art.bake(id, JSON.parse(JSON.stringify(RIG[id])), 'hero'); art.bake(id + '_aw', lit(JSON.parse(JSON.stringify(RIG[id])), HR[id]), 'hero'); } catch (e) { console.error(id, e); } });
  }
  const _init = art.init; art.init = function () { _init(); bake(); borrow(); };
  if (art.sheets && art.sheets.kael) { bake(); borrow(); }   // the game had already started when this file loaded
  // splash art, if it exists: assets/bg/hero_<id>.png (96x128) and ult_<id>.png (520x260); otherwise the sprite is shown
  const portraits = ids => ids.forEach(id => ['hero_', 'ult_'].forEach(k => { const im = new Image(); im.onload = () => { art.bg[k + id] = im; }; im.onerror = () => {}; im.src = 'assets/bg/' + k + id + '.png'; }));

  // ---------- the Versus hero grid: a small clan mark on each ninja's tile, and a line under the name ----------
  // more than 50 heroes: thirteen columns of narrower tiles (five rows hold 65), drawn here instead of heroes4.js's ten
  const COLS13 = 13, CW13 = 35, X13 = 12;
  const big = () => D.heroOrder.length > 50;
  const _gm = ui.gridMove; ui.gridMove = function (i, l, r, u, d) {
    if (!big()) return _gm(i, l, r, u, d);
    const n = D.heroOrder.length, c = COLS13; if (l) i = (i + n - 1) % n; if (r) i = (i + 1) % n; if (u) i = (i - c + n) % n; if (d) i = (i + c) % n; return i;
  };
  function grid13(ctx, o) {
    const n = D.heroOrder.length, rows = Math.ceil(n / COLS13), cw = CW13, ch = Math.min(100, Math.floor(204 / rows) - 2), bg = art.bg.title, locked = SW.lockedVs || (() => false);
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 0, W, SW.H); ctx.globalAlpha = 1;
    text(ctx, o.title, W / 2, 7, '#ffffff', { align: 'center', scale: 2 });
    D.heroOrder.forEach((id, i) => {
      const h = HR[id]; if (!h) return;
      const x = X13 + (i % COLS13) * cw, y = 28 + Math.floor(i / COLS13) * (ch + 2), open = o.open(id) && !locked(id), img = art.bg['hero_' + id];
      const who = o.cursors.map((c, k) => (c === i ? k : -1)).filter(k => k >= 0), on = who.length > 0;
      ui.panel(ctx, x, y, cw - 2, ch, on ? o.colors[who[0]] : '#3a3d55', 0.85);
      ctx.save(); ctx.beginPath(); ctx.rect(x + 1, y + 1, cw - 4, ch - 2); ctx.clip();
      ctx.globalAlpha = open ? (on ? 1 : 0.6) : 0.16;
      if (img) ctx.drawImage(img, (h.gridX || 27) + 2, 12, 40, 46, x + 1, y + 1, cw - 4, ch - 2);
      else { art.rect(ctx, art.shade(h.color, 0.22), x + 1, y + 1, cw - 4, ch - 2); ctx.translate(x + cw / 2 - 1, y + ch - 11); ctx.scale(1.2, 1.2); art.draw(ctx, h.sheet, on ? 'run' : 'idle', on ? Math.floor(SW.frame / 5) % 8 : Math.floor(SW.frame / 28) % 2, 0, 0, false); }
      ctx.restore(); ctx.globalAlpha = 0.78; art.rect(ctx, '#05060c', x + 1, y + ch - 10, cw - 4, 9); ctx.globalAlpha = 1;
      let nm = open ? h.name.toUpperCase() : 'LOCKED'; while (nm.length > 3 && SW.textW(nm) > cw - 4) nm = nm.slice(0, -1);
      text(ctx, nm, x + cw / 2 - 1, y + ch - 9, open ? (on ? h.color : '#c8ccd8') : '#ff5a5a', { align: 'center' });
      if (h.legend) { art.rect(ctx, '#f5c542', x + cw - 8, y + 3, 4, 4); art.rect(ctx, '#fff7d0', x + cw - 7, y + 4, 2, 2); }
      if (isNinja(id)) { const mx = x + cw - 8, my = y + 3, c = h.color; art.rect(ctx, '#05060c', mx - 1, my - 1, 6, 6); art.rect(ctx, c, mx + 1, my, 1, 4); art.rect(ctx, c, mx - 0, my + 1, 4, 1); }
      who.forEach(k => { if (o.tags[k]) { ui.panel(ctx, x + 1, y + 2 + k * 12, 22, 11, o.colors[k], 0.9); text(ctx, o.tags[k], x + 12, y + 4 + k * 12, '#ffffff', { align: 'center' }); } });
    });
  }
  const _grid = ui.heroGrid; ui.heroGrid = function (ctx, o) {
    if (big()) return grid13(ctx, o);
    _grid(ctx, o);
    const n = D.heroOrder.length; if (n <= 10 || !full) return;
    const rows = Math.ceil(n / 10), cw = 46, ch = Math.min(100, Math.floor(204 / rows) - 2);
    D.heroOrder.forEach((id, i) => {
      if (!isNinja(id)) return;
      const x = 10 + (i % 10) * cw + 3, y = 28 + Math.floor(i / 10) * (ch + 2) + 3, c = HR[id].color;
      art.rect(ctx, '#05060c', x - 1, y - 1, 7, 7); art.rect(ctx, c, x + 2, y, 1, 5); art.rect(ctx, c, x, y + 2, 5, 1); art.rect(ctx, '#ffffff', x + 2, y + 2, 1, 1);
    });
  };
  const _vd = V.draw; V.draw = function (ctx, g) {
    _vd.call(this, ctx, g);
    if (V.phase !== 'pick') return;
    const id = D.heroOrder[V.pick[V.step]];
    if (isNinja(id)) text(ctx, 'HIDDEN CLANS  -  VERSUS ONLY', W - 10, 235, HR[id].colorHi, { align: 'right' });
  };

  // ---------- the Hidden Gorge: a Versus stage for the clans (listed in versus.js STAGES; backdrop assets/bg/bg_vs_clans.png,
  // prompt in tools/higgsfield-clans-arena.json). Without the picture the theme's own colours are drawn. ----------
  art.themes.vs_clans = { style: 'dirt', a: '#2a4a4e', b: '#203c40', top: '#5a8a7a', hi: '#ffb060', deep: '#0c1a1e', plat: '#6a5038', sky: ['#0a181e', '#1e4048'], mid: 'ruins', midCol: '#0e2228', bg: 'vs_clans', dim: 0.18, haz: '#ffa046', win: ['#ffa046'] };
  { const im = new Image(); im.onload = () => { art.bg.vs_clans = im; }; im.onerror = () => {}; im.src = 'assets/bg/bg_vs_clans.png'; }

  // ---------- translations (each wave file adds its own; see tr below) ----------
  const tr = (lang, map) => { if (SW.i18n && SW.i18n.add) SW.i18n.add(lang, map); };
  // the full ultimate description as the game builds it, in each language
  const ULT_WRAP = { es: ['Definitiva: ', ' Cuesta las tres barras, o una en Despertar.'], zh: ['终极技：', '消耗全部三格能量，觉醒时只需一格。'] };
  function ultText(lang, en, local) { const w = ULT_WRAP[lang]; const m = {}; m['Ultimate: ' + en + ' Costs all three bars, or one while awakened.'] = w[0] + local + w[1]; return m; }
  tr('es', { 'HIDDEN CLANS  -  VERSUS ONLY': 'CLANES OCULTOS  -  SOLO VERSUS', 'Hidden Gorge': 'Garganta Oculta' });
  tr('zh', { 'HIDDEN CLANS  -  VERSUS ONLY': '隐秘氏族  -  仅限对战', 'Hidden Gorge': '隐秘峡谷' });

  SW.ninja = { IDS, isNinja, view, hero, abilities, burst, ULT, TRAITS, pips, RIG, BORROW, portraits, tr, ultText,
    hit, hurt, isFoe, around, light, part, front, slide, ahead, nearest, every, floorY, fighterOf, pose, Later, Vis, Drive, pillar, double, smoke, sfx };
})();
