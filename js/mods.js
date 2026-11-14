'use strict';
// Shattered Worlds — cyber mods and crafting (design document: "Cyber Mods: 3 slots (4 after A3-1)... Crafting: scrap plus
// monster parts"). Only wraps; nothing in the shared files is edited.
//   Materials drop from foes in the story: scrap from everything, a part by kind of foe (chips from machines, gunners and
//   shielded troops; gel from beasts and husks), and a core from every boss.
//   Mods are crafted at any save point and equipped anywhere, in Esc > MODS (a seventh tab). Three slots, four once A3-1
//   is done. Effects apply only in the story (not in Versus).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, ui = SW.ui, I = SW.input, art = SW.art, fx = SW.fx, text = SW.text, P = SW.Player.prototype;
  const MATS = {
    scrap: { name: 'Scrap', col: '#b8b8c8' },
    chip:  { name: 'Chip',  col: '#22d3ee' },
    gel:   { name: 'Gel',   col: '#7dffa0' },
    core:  { name: 'Core',  col: '#b48cff' }
  };
  const MAT_IDS = Object.keys(MATS);
  // [id, name, part colour, recipe, description]
  const MODS = [
    ['servo',     'Servo Fists',      'chip', { scrap: 18, chip: 2 },          'Combo damage +10%.'],
    ['capacitor', 'Capacitor',        'chip', { scrap: 20, chip: 3 },          'Skills and specials cost 15% less energy.'],
    ['flux',      'Flux Cell',        'chip', { scrap: 16, chip: 2, gel: 1 },  'Energy regen and energy from hits +25%.'],
    ['plating',   'Ablative Plating', 'scrap', { scrap: 24, chip: 1 },         'Take 10% less damage. Run 8% slower.'],
    ['overclock', 'Overclock',        'chip', { scrap: 16, chip: 2 },          'Dashes 15% faster and further. Max HP -10%.'],
    ['reflex',    'Reflex Chip',      'chip', { scrap: 14, chip: 3 },          'Perfect guards are easier to time (window 6 to 10 frames).'],
    ['thorns',    'Static Skin',      'chip', { scrap: 18, chip: 2, gel: 1 },  'A foe that hits you up close takes 40% of the damage back.'],
    ['leech',     'Leech Coil',       'gel',  { scrap: 16, gel: 3 },           'Heal 1.5% of the damage you deal.'],
    ['hearth',    'Hearth Reactor',   'gel',  { scrap: 14, gel: 2 },           'Awakening heals 15% of your max HP as it starts.'],
    ['mender',    'Field Mender',     'gel',  { scrap: 12, gel: 3 },           'Healing items heal 65% of max HP instead of 40%.'],
    ['adrenal',   'Adrenal Pump',     'gel',  { scrap: 14, gel: 2 },           'Below 30% HP you deal 25% more damage.'],
    ['rad_filter', 'Rad Filter',      'gel',  { scrap: 10, gel: 1 },           'Radiation builds half as fast. Spikes and falls cost half the HP. (Free with the caravan filter in Act 2.)'],
    ['magnet',    'Scrap Magnet',     'scrap', { scrap: 10 },                  'Foes drop 30% more creds and an extra scrap.'],
    ['bounty',    'Bounty Tag',       'scrap', { scrap: 12, chip: 1, gel: 1 }, 'XP from foes +25%.'],
    ['surge',     'Surge Core',       'core', { scrap: 20, core: 1 },          'The awakening bar fills 30% faster.'],
    ['prism',     'Prism Lens',       'core', { scrap: 24, chip: 2, core: 1 }, 'Specials, big skills and ultimates +15% damage.'],
    ['ghost',     'Ghost Step',       'core', { scrap: 20, gel: 2, core: 1 },  'Dash cooldown -30% and a longer dodge window.'],
    ['second',    'Second Wind',      'core', { scrap: 30, core: 2 },          'Once per area, a killing blow leaves you at 1 HP instead.'],
    // black-market gear: never crafted, only bought from the Ember Ledger (ledger.js), which also gives them their effects
    ['ghost_tag',   'Ghost Tag',      'ember', {}, 'Heat rises 40% slower.'],
    ['night_eyes',  'Night Eyes',     'ember', {}, 'At night you deal 15% more damage, and the dark is lighter for you.'],
    ['lead_lining', 'Lead Lining',    'ember', {}, 'Radiation builds 25% slower, and radiation sickness drains half as much.'],
    ['ember_heart', 'Ember Heart',    'ember', {}, 'Every foe you defeat (not bosses) heals 3% of your max HP.']
  ].map(m => ({ id: m[0], name: m[1], kind: m[2], cost: m[3], desc: m[4] }));
  // [standing needed with the Ledger, price in creds, cores]
  const MARKET = { ghost_tag: [15, 250], night_eyes: [40, 400], lead_lining: [40, 350], ember_heart: [70, 700, 1] };
  MODS.forEach(m => { const k = MARKET[m.id]; if (k) m.market = { tier: k[0], price: k[1], core: k[2] || 0 }; });
  const kcol = k => (MATS[k] ? MATS[k].col : '#ff7a3a');
  const BY = {}; MODS.forEach(m => { BY[m.id] = m; });

  // ---- save data (old saves get it on first use) ----
  const ensure = S => {
    if (!S) return null;
    if (!S.mats) S.mats = { scrap: 0, chip: 0, gel: 0, core: 0 };
    if (!S.mods) S.mods = { own: {}, slots: [null, null, null, null] };
    if (G.flag && G.flag('rad_filter') && !S.mods.own.rad_filter) S.mods.own.rad_filter = true;
    return S;
  };
  const slots = S => 3 + (S.done && S.done['A3-1'] ? 1 : 0);
  const story = () => G.scene === 'play' && !!G.state;
  const has = id => { if (!story()) return false; const S = ensure(G.state); return S.mods.slots.slice(0, slots(S)).indexOf(id) >= 0; };
  // what a recipe costs right now (heat.js lowers the scrap with caravan standing)
  const costOf = m => (SW.mods && SW.mods.costHook ? SW.mods.costHook(m) : m.cost);
  const canPay = (S, m) => { const c = costOf(m); return Object.keys(c).every(k => (S.mats[k] || 0) >= c[k]); };
  const atBench = () => { const p = G.player, z = G.zone; return !!(p && z && z.ents.some(e => e.prompt === 'Rest & Save' && Math.abs(e.x - p.x) < 64 && Math.abs(e.y - p.y) < 48)); };
  SW.mods = { MODS, MATS, BY, has, ensure, slots, atBench, kcol };

  // ---- drops ----
  // [part, chance]: beasts give gel and machines / gunners / shielded troops give chips, 40% of the time; anyone else
  // (street fighters, Halcyon guards) a chip 12% of the time. A playthrough is roughly 100-150 kills and 12+ bosses,
  // enough for six to ten mods; the core mods need the bosses.
  const partFor = d => {
    if (d.ai === 'leaper' || d.ai === 'hopper' || d.beast || d.energyOnly || d.contact) return ['gel', 0.4];
    if (d.fly || d.ai === 'drone' || d.ai === 'ranged' || d.shield || d.shot) return ['chip', 0.4];
    return ['chip', 0.12];
  };
  class Part extends SW.Pickup {
    constructor(mat, x, y) { super('part', x, y, { loose: true, vx: SW.rand(-2, 2), vy: SW.rand(-4.5, -2.5) }); this.mat = mat; }
    update(G, z) {
      super.update(G, z);
      const p = G.player;
      if (!this.gone || this.got || !p || Math.hypot(p.x - this.x, p.y - 16 - this.y) > 16) return;
      this.got = true;
      const S = ensure(G.state); S.mats[this.mat] = (S.mats[this.mat] || 0) + 1;
      if (this.mat !== 'scrap') fx.text(p.x, p.y - 48, '+1 ' + MATS[this.mat].name, MATS[this.mat].col);
      if (!G.flag('mods_seen')) { G.setFlag('mods_seen'); G.toast('Salvage! Craft cyber mods at any save point: Esc > MODS', '#22d3ee'); }
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), c = MATS[this.mat].col;
      if (this.mat === 'core') { art.glow(ctx, x, y, 12, c, 0.2); art.rect(ctx, c, x - 3, y - 3, 6, 6); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 2); }
      else if (this.mat === 'chip') { art.rect(ctx, c, x - 3, y - 2, 6, 4); art.rect(ctx, '#0a2a33', x - 1, y - 1, 2, 2); }
      else if (this.mat === 'gel') { art.rect(ctx, c, x - 2, y - 2, 4, 4); art.rect(ctx, c, x - 3, y - 1, 6, 2); art.rect(ctx, '#ffffff', x - 1, y - 2, 1, 1); }
      else { art.rect(ctx, c, x - 2, y - 2, 4, 4); art.rect(ctx, '#55556a', x - 1, y - 1, 2, 2); }
    }
  }
  SW.mods.drop = (mat, n, x, y) => { const z = G.zone; if (z) for (let i = 0; i < n; i++) z.add(new Part(mat, x, y)); };
  const _kill = G.onKill; G.onKill = function (e) {
    _kill.call(this, e);
    if (!story() || !e || !e.def) return;
    const d = e.def, z = G.zone, drop = (m, n) => { for (let i = 0; i < n; i++) z.add(new Part(m, e.x, e.y - 14)); };
    if (e.isBoss) { drop('scrap', 8); drop('core', 1); drop('chip', 2); drop('gel', 2); }
    else {
      drop('scrap', 1 + (Math.random() < 0.5 ? 1 : 0) + (has('magnet') ? 1 : 0));
      const part = partFor(d); if (Math.random() < part[1]) drop(part[0], 1);
    }
    if (has('magnet') && d.creds) z.add(new SW.Pickup('creds', e.x, e.y - 12, { loose: true, amt: Math.max(1, Math.round(d.creds * 0.3)), vx: SW.rand(-2, 2), vy: -3 }));
    if (has('bounty') && d.xp) G.addXP(Math.round(d.xp * 0.25));
  };

  // ---- effects ----
  const _hp = P.hpMax; P.hpMax = function () { const v = _hp.call(this); return has('overclock') ? Math.round(v * 0.9) : v; };
  const _dm = P.dmgMul; P.dmgMul = function () { const v = _dm.call(this), S = this.G.state; return has('adrenal') && S.hp < this.hpMax() * 0.3 ? v * 1.25 : v; };
  const _cm = P.comboMul; P.comboMul = function () { return _cm.call(this) * (has('servo') ? 1.1 : 1); };
  const _sm = P.specMul; P.specMul = function () { return _sm.call(this) * (has('prism') ? 1.15 : 1); };
  const _sp = P.speed; P.speed = function () { return _sp.call(this) * (has('plating') ? 0.92 : 1); };
  const _spend = P.spend; P.spend = function (n) { return _spend.call(this, has('capacitor') ? Math.round(n * 0.85) : n); };
  const _move = SW.move; SW.move = function (ent, z) { if (ent === G.player && ent.state === 'dash' && has('overclock')) ent.vx *= 1.15; return _move.apply(this, arguments); };
  const _dash = P.startDash; P.startDash = function (dir) { _dash.call(this, dir); if (has('ghost')) { this.dashCd = Math.round(this.dashCd * 0.7); this.iframes += 6; } };
  const _th = P.takeHit; P.takeHit = function (atk, g) {
    if (!story() || !atk) return _th.call(this, atk, g);
    const S = g.state, aw = S.awaken;
    if (has('reflex') && this.state === 'guard' && !atk.unblockable && this.guardT > 6 && this.guardT <= 10) this.guardT = 6;
    const a = has('plating') && atk.dmg ? Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * 0.9)) }) : atk;
    const r = _th.call(this, a, g);
    if (has('surge') && this.awakeT <= 0 && S.awaken > aw) S.awaken = Math.min(100, S.awaken + (S.awaken - aw) * 0.3);
    const src = atk.src;
    if (r === 'hit' && has('thorns') && src && src.team === 'enemy' && !src.dead && src.takeHit && Math.abs(src.x - this.x) < 70) {
      const b = src.box(), back = { team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg: Math.max(1, Math.round(a.dmg * 0.4)), kx: Math.sign(src.x - this.x) || 1, stun: 10, energy: true, hitSet: new Set(), srcX: this.x, quiet: true };
      fx.bolt(this.x, this.y - 18, b.x + b.w / 2, b.y + b.h / 2, '#22d3ee');
      if (src.takeHit(back, g) === 'hit') { back.thorns = true; g.onHit(back, src, b); }
    }
    return r;
  };
  const _die = P.die; P.die = function () {
    if (has('second') && !this.secondUsed) {
      this.secondUsed = true; this.G.state.hp = 1; this.invuln = 100;
      fx.flash('#b48cff', 10); fx.ring(this.x, this.y - 16, '#b48cff', 5, 44, 22); SW.audio.sfx('awaken'); this.G.toast('SECOND WIND', '#b48cff');
      return;
    }
    return _die.call(this);
  };
  const _aw = P.useAwaken; P.useAwaken = function () {
    const was = this.awakeT; _aw.call(this);
    if (was <= 0 && this.awakeT > 0 && has('hearth')) this.heal(Math.round(this.hpMax() * 0.15));
  };
  const _item = P.useItem; P.useItem = function () {
    const S = this.G.state, n = S.items; _item.call(this);
    if (S.items < n && has('mender')) { S.hp = Math.min(this.hpMax(), S.hp + Math.round(this.hpMax() * 0.25)); }
  };
  const _hz = P.hazard; P.hazard = function (g) { if (has('rad_filter') && this.invuln <= 0) g.state.hp += 5; return _hz.call(this, g); };
  const _up = P.update; P.update = function (g, z) {
    if (!has('flux')) return _up.call(this, g, z);
    const S = g.state, e0 = S.energy; _up.call(this, g, z);
    if (S.energy > e0) S.energy = Math.min(300, S.energy + (S.energy - e0) * 0.25);
  };
  const _hit = G.onHit; G.onHit = function (atk, e, b) {
    const S = G.state, e0 = S && S.energy, a0 = S && S.awaken, p = G.player;
    _hit.call(this, atk, e, b);
    if (!story() || !p) return;
    if (has('flux') && S.energy > e0) S.energy = Math.min(300, S.energy + (S.energy - e0) * 0.25);
    if (has('surge') && p.awakeT <= 0 && S.awaken > a0) S.awaken = Math.min(100, S.awaken + (S.awaken - a0) * 0.3);
    if (has('leech') && !p.dead && !atk.thorns) S.hp = Math.min(p.hpMax(), S.hp + (atk.dealt || atk.dmg || 0) * 0.015);   // measured: 5% erased most boss damage, 2% still too much with two other mods
  };
  const _rest = G.rest; G.rest = function (sp) {
    _rest.call(this, sp);
    if (G.player) G.player.secondUsed = false;
    if (!G.flag('mods_bench')) { G.setFlag('mods_bench'); G.toast('Save points are crafting benches: Esc > MODS', '#22d3ee'); }
  };

  // ---- extra pause tabs: after the six base tabs come SW.pauseTabs in order ({ name, update(g), draw(ctx, g) }):
  //      MODS (here, tab 6), then FACTIONS (heat.js, tab 7). A / D walk through all of them and wrap around. ----
  const BASE_TABS = ['MISSION', 'SKILLS', 'JOURNAL', 'STATS', 'SYSTEM', 'UPGRADES'], XT = SW.pauseTabs = SW.pauseTabs || [];
  const eat = () => { I.prev = Object.assign({}, I.now); };
  SW.pauseEat = eat;
  const msg = { t: 0, s: '', col: '#ffffff' };
  const say = (s, col) => { msg.s = s; msg.col = col || '#ffffff'; msg.t = 150; };
  function act(g) {
    const S = ensure(g.state), m = MODS[ui.pm.sel], n = slots(S), sl = S.mods.slots, at = sl.indexOf(m.id);
    if (at >= 0 && at < n) { sl[at] = null; SW.audio.sfx('back'); say(m.name + ' removed.'); }
    else if (S.mods.own[m.id]) {
      const free = sl.slice(0, n).indexOf(null);
      if (free < 0) { SW.audio.sfx('deny'); say('All ' + n + ' slots are full. Remove a mod first.', '#ff8a8a'); return; }
      sl[free] = m.id; SW.audio.sfx('select'); say(m.name + ' equipped.', '#7dffa0');
    } else if (m.market) { SW.audio.sfx('deny'); say('Black-market gear: bought from the Ember Ledger, not crafted.', '#ff8a8a'); return; }
    else if (!atBench()) { SW.audio.sfx('deny'); say('Crafting needs a bench: stand at a save point.', '#ff8a8a'); return; }
    else if (!canPay(S, m)) { SW.audio.sfx('deny'); say('Not enough materials.', '#ff8a8a'); return; }
    else { const c = costOf(m); Object.keys(c).forEach(k => { S.mats[k] -= c[k]; }); S.mods.own[m.id] = true; SW.audio.sfx('level'); say(m.name + ' crafted. J again to equip it.', '#7dffa0'); }
    const p = g.player; if (p) S.hp = Math.min(S.hp, p.hpMax());
    g.saveGame();
  }
  const _pu = ui.pauseUpdate; ui.pauseUpdate = function (g) {
    const pm = ui.pm, last = 5 + XT.length;
    if (msg.t > 0) msg.t--;
    if (pm.tab > 5) {
      if (I.hit('pause') || I.hit('jump')) return _pu(g);
      const tab = XT[pm.tab - 6];
      if (I.hit('right')) { pm.tab = pm.tab >= last ? 0 : pm.tab + 1; pm.sel = 0; msg.t = 0; SW.audio.sfx('move'); eat(); }
      else if (I.hit('left')) { pm.tab--; pm.sel = 0; msg.t = 0; SW.audio.sfx('move'); eat(); }
      else if (tab) tab.update(g);
      return _pu(g);
    }
    if (pm.tab === 5 && I.hit('right')) { pm.tab = 6; pm.sel = 0; msg.t = 0; SW.audio.sfx('move'); eat(); }
    else if (pm.tab === 0 && I.hit('left')) { pm.tab = last; pm.sel = 0; msg.t = 0; SW.audio.sfx('move'); eat(); }
    return _pu(g);
  };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    const pm = ui.pm, W = SW.W, all = BASE_TABS.concat(XT.map(t => t.name)), sp = Math.min(68, Math.floor((W - 8) / all.length)), x0 = Math.round((W - sp * all.length + sp) / 2);
    art.rect(ctx, '#05060c', 0, 0, W, 26);
    all.forEach((t, i) => { const x = x0 + i * sp; text(ctx, t, x, 12, i === pm.tab ? '#f5c542' : '#5a6078', { align: 'center' }); if (i === pm.tab) art.rect(ctx, '#f5c542', x - Math.min(24, sp / 2 - 4), 23, Math.min(48, sp - 8), 1); });
    const tab = pm.tab > 5 ? XT[pm.tab - 6] : null;
    if (tab) tab.draw(ctx, g);
  };
  function modsUpdate(g) {
    const pm = ui.pm;
    if (I.hit('down')) { pm.sel = (pm.sel + 1) % MODS.length; SW.audio.sfx('move'); eat(); }
    else if (I.hit('up')) { pm.sel = (pm.sel + MODS.length - 1) % MODS.length; SW.audio.sfx('move'); eat(); }
    else if (I.ok()) { act(g); eat(); }
  }
  XT.push({ name: 'MODS', update: modsUpdate, draw: modsDraw });
  function modsDraw(ctx, g) {
    const pm = ui.pm, S = ensure(g.state), n = slots(S), x0 = 26, bench = atBench();
    text(ctx, 'CYBER MODS', x0, 34, '#f5c542', { scale: 2 });
    MAT_IDS.forEach((k, i) => { const x = 236 + i * 58; art.rect(ctx, MATS[k].col, x, 37, 5, 5); text(ctx, MATS[k].name + ' ' + (S.mats[k] || 0), x + 8, 36, '#ffffff'); });
    // slots
    for (let i = 0; i < 4; i++) {
      const x = x0 + i * 106, y = 54, id = S.mods.slots[i], open = i < n;
      ui.panel(ctx, x, y, 100, 14, open ? (id ? kcol(BY[id].kind) : '#3a3d55') : '#1c1e2c', 0.7);
      text(ctx, open ? (id ? BY[id].name : '- empty -') : 'opens in Act 3', x + 50, y + 4, open ? (id ? '#ffffff' : '#5a6078') : '#3a3d55', { align: 'center' });
    }
    // list: 18 rows on screen, scrolling with the selection
    const ROWS = 18, top = Math.max(0, Math.min(pm.sel - 9, MODS.length - ROWS));
    MODS.slice(top, top + ROWS).forEach((m, k) => {
      const i = top + k, y = 76 + k * 9, on = pm.sel === i, own = !!S.mods.own[m.id], eq = S.mods.slots.slice(0, n).indexOf(m.id) >= 0, craft = !own && !m.market && canPay(S, m);
      art.rect(ctx, own ? kcol(m.kind) : '#2a2c40', x0, y + 1, 5, 5);
      text(ctx, (on ? '> ' : '') + m.name, x0 + 9, y, on ? '#f5c542' : own ? '#ffffff' : craft ? '#c8ccd8' : '#5a6078');
      if (eq) text(ctx, 'ON', x0 + 112, y, '#7dffa0'); else if (craft) text(ctx, 'craft', x0 + 112, y, '#22d3ee'); else if (m.market && !own) text(ctx, 'buy', x0 + 112, y, '#b8643a');
    });
    if (top > 0) text(ctx, '^', x0 + 140, 76, '#8a92b8');
    if (top + ROWS < MODS.length) text(ctx, 'v', x0 + 140, 76 + (ROWS - 1) * 9, '#8a92b8');
    // details
    const m = MODS[pm.sel], own = !!S.mods.own[m.id], eq = S.mods.slots.slice(0, n).indexOf(m.id) >= 0;
    ui.panel(ctx, 176, 76, 280, 120, kcol(m.kind), 0.5);
    text(ctx, m.name, 184, 82, '#f5c542');
    text(ctx, eq ? 'EQUIPPED' : own ? 'OWNED' : m.market ? 'NOT BOUGHT' : 'NOT CRAFTED', 448, 82, eq ? '#7dffa0' : own ? '#ffffff' : '#8a92b8', { align: 'right' });
    SW.wrap(m.desc, 262).forEach((l, i) => text(ctx, l, 184, 98 + i * 10, '#ffffff'));
    if (!own && m.market) {
      text(ctx, 'BLACK MARKET', 184, 134, '#ff7a3a');
      SW.wrap(m.market.price + ' creds' + (m.market.core ? ' and ' + m.market.core + ' core' : '') + ', once the Ember Ledger trusts you (standing ' + m.market.tier + ').', 262)
        .forEach((l, i) => text(ctx, l, 184, 146 + i * 10, '#c8ccd8'));
    } else if (!own) {
      text(ctx, 'RECIPE', 184, 134, '#8a92b8');
      let x = 184;
      const c = costOf(m);
      Object.keys(c).forEach(k => { const have = S.mats[k] || 0, s = MATS[k].name + ' ' + have + '/' + c[k]; art.rect(ctx, MATS[k].col, x, 147, 5, 5); text(ctx, s, x + 8, 146, have >= c[k] ? '#ffffff' : '#ff8a8a'); x += 8 + SW.textW(s) + 12; });
    }
    const hint = eq ? 'J: remove' : own ? 'J: equip' : m.market ? 'Sold by the Ember Ledger' : bench ? 'J: craft' : 'Craft at a save point (a bench)';
    text(ctx, hint, 184, 176, bench || own ? '#22d3ee' : '#8a92b8');
    SW.wrap('Scrap drops from every foe, chips from machines and gunners, gel from beasts, a core from every boss. ' + (bench ? 'You are at a bench: crafting is open.' : 'Equip and remove anywhere.'), 280)
      .forEach((l, i) => text(ctx, l, 176, 202 + i * 10, '#5a6078'));
    if (msg.t > 0) text(ctx, msg.s, 176, 232, msg.col);
  };
})();
