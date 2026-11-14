'use strict';
// Shattered Worlds — the Ember Ledger, the black market. Only wraps; nothing in the shared files is edited.
//   Design document: a fourth faction based in the Ash Dunes, "hostile until a hidden quest after A2-2", whose reward is
//   black-market gear. (The document named it after a group from another series; this one is original.)
//
//   THE HIDDEN QUEST  After the Scrap Baron falls (A2-2), opening his strongbox in the Ash Dunes turns up a burnt ledger page:
//     somebody kept his books, and wants to meet "at the wreck, after dark". An ember is scratched on the Baron's old wreck;
//     by day it lets you wait for nightfall. At night Sable, the Ledger's broker, is there. Her collectors think you work
//     for Halcyon: beat the three of them and the Ledger opens to you (standing 15).
//   THE MARKET  Only at night, only at the wreck. Chips and gel for 40 creds, cores for 280, and four pieces of black-market
//     gear that are never crafted (Ghost Tag, Night Eyes, Lead Lining, Ember Heart; their effects live in heat.js,
//     daynight.js and here). Prices fall 1% per 5 standing. Buying gear: +5 standing. Sable also gives out Ledger jobs.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, E = D.enemies, Z = SW.zones, ui = SW.ui, I = SW.input, art = SW.art, fx = SW.fx, text = SW.text, T = 16;
  const story = SW.story, HT = SW.heat, DN = SW.daynight, M = SW.mods;
  if (!HT || !DN || !M) return;
  const sfx = n => SW.audio.sfx(n), EMBER = '#ff7a3a';
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const open = () => G.flag('ledger_open'), seen = () => G.flag('ledger_clue');
  const H = { test: null };

  // ---- cast ----
  D.speakers.sable = { name: 'Sable', sheet: 'sable', pitch: 330, col: EMBER };
  // measured at level 9 (Kael and Nyra, 3 fights each): as plain bandits (70 HP) the three were over in 8 s for 0-4% health;
  // committing to their swings and blocking every third hit, they cost the careful player 15-32% in about 10 s
  if (E.bandit) E.ledgerman = Object.assign({}, E.bandit, { name: 'Ledger Collector', sheet: 'ledgerman', hp: 85, dmg: 13, speed: 1.1, xp: 24, creds: 12, aggro: 320, commit: true, blockEvery: 3 });
  const _init = art.init; art.init = function () {
    _init();
    try {
      story.recolor('sable', 'quill', { top: '#2a1c1a', hair: '#e8e4dc', pants: '#3a2420', acc: EMBER });
      story.recolor('ledgerman', 'bandit', { top: '#2a1c1a', pants: '#4a2a1a', acc: EMBER });
    } catch (e) { console.error(e); }
  };

  // ---- words ----
  Object.assign(D.dialogue, {
    lg_page: [
      say('sys', "Under the strongbox's false bottom: one page torn from a ledger, burnt at the edges. Water, filters, medicine - debts owed to the Baron by people who never had a choice."),
      say('sys', "At the foot of the page a sum is crossed out, and pressed beside it, a thumbprint in ash. Under that, in a neat hand: 'The wreck. After dark. Come alone or do not come.'", { flag: 'ledger_clue' }),
      say('hero', '(The Baron had a banker. Somebody kept the books on all of this - and wants to meet whoever closed the account.)')
    ],
    lg_day: [
      say('sys', "An ember has been scratched into the Baron's old wreck, fresh. Whoever left it will not come in daylight.", { choice: [{ t: 'Wait until dark', fn: 'ledger_wait' }, { t: 'Not now' }] })
    ],
    lg_meet: [
      say('sable', 'You found the page. Good. That means you can read, which already puts you ahead of the Baron.'),
      say('sable', 'We are the Ember Ledger. We buy what Halcyon loses, and we sell it to the people Halcyon forgot. The Baron owed us. You settled his account. Loudly.'),
      say('hero', 'So you want to be paid.'),
      say('sable', 'I want to know whose side you are on. My collectors think you work for the sky.'),
      say('sable', 'Convince them otherwise.', { fn: 'ledger_fight' })
    ],
    lg_retry: [say('sable', 'My collectors are still waiting to be convinced.', { fn: 'ledger_fight' })],
    lg_pass: [
      say('sable', "Hm. They'll live. They'll also stop calling you 'the sky's dog'."),
      say('sable', "The Ledger is open to you. Chips, gel, cores - and a few things Halcyon would rather nobody had. Find me here after dark.", { flag: 'ledger_open' }),
      say('sys', 'THE EMBER LEDGER will deal with you now. Black-market gear goes in the same slots as cyber mods (Esc > MODS).')
    ],
    lg_hello: [say('sable', 'After dark, as agreed. What do you need?', { choice: [{ t: 'Trade', fn: 'ledger_shop' }, { t: 'Work', fn: 'ledger_jobs' }, { t: 'Nothing' }] })],
    lg_busy: [say('sable', 'Finish with my collectors first.')]
  });

  // ---- the Ash Dunes: the page, the ember mark, and Sable ----
  const WRECK = 40;
  const present = () => seen() && DN.isNight();
  function patch(id, fn) { const def = Z[id]; if (!def) return; const b = def.build; def.build = function (z, g) { b.call(this, z, g); try { fn(z, g); } catch (e) { console.error(e); } }; }
  patch('dunes', (z, g) => {
    H.test = null;
    // the page: lies by the opened strongbox until it is read (old saves that opened the box long ago get it too)
    z.thing('crate', 12, 19, { prompt: 'Pick up the burnt page', when: gg => !!(gg.state.done || {})['A2-2'] && gg.flag('baron_box') && !seen(), glow: EMBER,
      hide: gg => !(gg.flag('baron_box') && !seen()), use: gg => gg.say('lg_page'),
      draw(ctx, cam, gg) { if (this.hide(gg)) return; const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y); art.rect(ctx, '#e8dcc0', x - 4, y - 3, 8, 3); art.rect(ctx, '#3a2418', x - 4, y - 3, 2, 3); art.rect(ctx, EMBER, x + 2, y - 3, 1, 1); art.glow(ctx, x, y - 2, 10, EMBER, 0.15 + 0.05 * Math.sin(SW.frame * 0.12)); } });
    // the ember mark, by day
    z.thing('sign', WRECK, 19, { prompt: 'Look at the ember mark', when: () => seen() && !DN.isNight(), use: gg => gg.say('lg_day'),
      draw(ctx, cam) { if (!seen()) return; const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y); art.rect(ctx, '#3a2418', x - 3, y - 22, 6, 6); art.rect(ctx, EMBER, x - 1, y - 21, 2, 4); art.rect(ctx, '#ffd08a', x - 1, y - 20, 1, 1); art.glow(ctx, x, y - 19, 9, EMBER, 0.12); } });
    // Sable, by night
    const sable = z.npc('sable', WRECK, 19, { name: 'Sable', face: 1, jobPost: 'ledger', present,
      when: () => present(), talk: () => (H.test ? 'lg_busy' : !open() ? (G.flag('ledger_tested') ? 'lg_retry' : 'lg_meet') : 'lg_hello') });
    const nd = SW.NPC.prototype.draw; sable.draw = function (ctx, cam) { if (present()) { nd.call(this, ctx, cam); art.glow(ctx, this.x - cam.x + 8, this.y - cam.y - 14, 8, EMBER, 0.2); } };
  });

  // ---- hooks used by the dialogue choices ----
  const _hook = G.hook; G.hook = function (fn) {
    if (fn === 'shop') ui.shop.ledger = false;
    if (fn === 'ledger_wait') { G.fade.dir = 1; G.fade.cb = () => { DN.setHour(20.25); G.toast('You wait in the wreck until dark.', '#b9a0ff'); }; return; }
    if (fn === 'ledger_fight') { startTest(); return; }
    if (fn === 'ledger_shop') { G.overlay = 'shop'; ui.shop.sel = 0; ui.shop.ledger = true; lmsg.t = 0; return; }
    if (fn === 'ledger_jobs') { HT.openBoard('ledger'); return; }
    return _hook.apply(this, arguments);
  };
  function startTest() {
    const z = G.zone, p = G.player, tx = Math.floor(p.x / T);
    G.setFlag('ledger_tested');
    const foes = [[-7], [8], [11]].map(o => { const e = z.enemy('ledgerman', tx + o[0], 19); e.state = 'chase'; e.ledgerTest = true; fx.dust(e.x, e.y, 8); return e; });
    H.test = { z, foes };
    sfx('roar'); G.toast('Ledger collectors!', EMBER);
  }
  const P = SW.Player.prototype, _up = P.update; P.update = function (g, z) {
    const r = _up.apply(this, arguments);
    if (H.test && this === g.player) {
      if (H.test.z !== z) H.test = null;
      else if (H.test.foes.every(f => f.dead) && !g.busy()) { H.test = null; g.say('lg_pass', () => g.saveGame()); }
    }
    return r;
  };

  // ---- Ember Heart ----
  const _kill = G.onKill; G.onKill = function (e) {
    _kill.apply(this, arguments);
    const p = G.player;
    if (G.scene === 'play' && p && !p.dead && e && !e.isBoss && M.has('ember_heart')) p.heal(Math.max(1, Math.round(p.hpMax() * 0.03)));
  };

  // ================= the market (an overlay that borrows the shop's slot) =================
  const lmsg = { t: 0, s: '', col: '#ffffff' };
  const lsay = (s, col) => { lmsg.s = s; lmsg.col = col || '#ffffff'; lmsg.t = 180; };
  const off = () => Math.floor(HT.rep('ledger') / 5) / 100;
  const cost = n => Math.round(n * (1 - off()));
  const GOODS = () => [
    { mat: 'chip', price: 40 }, { mat: 'gel', price: 40 }, { mat: 'core', price: 280 }
  ].concat(M.MODS.filter(m => m.market).map(m => ({ mod: m, price: m.market.price, core: m.market.core, tier: m.market.tier }))).concat([{ leave: true }]);
  function buy(g, it) {
    const S = M.ensure(g.state), r = HT.rep('ledger');
    if (it.mod) {
      if (S.mods.own[it.mod.id]) { sfx('deny'); lsay('You already have it.', '#ff8a8a'); return; }
      if (r < it.tier) { sfx('deny'); lsay('Sable: "When I trust you more." (standing ' + it.tier + ')', '#ff8a8a'); return; }
      if (S.creds < cost(it.price) || (S.mats.core || 0) < (it.core || 0)) { sfx('deny'); lsay('Not enough ' + (S.creds < cost(it.price) ? 'creds.' : 'cores.'), '#ff8a8a'); return; }
      S.creds -= cost(it.price); if (it.core) S.mats.core -= it.core; S.mods.own[it.mod.id] = true;
      sfx('level'); HT.gain('ledger', 5); lsay(it.mod.name + ' bought. Equip it in Esc > MODS. Ledger standing +5.', '#7dffa0');
    } else {
      if (S.creds < cost(it.price)) { sfx('deny'); lsay('Not enough creds.', '#ff8a8a'); return; }
      S.creds -= cost(it.price); S.mats[it.mat] = (S.mats[it.mat] || 0) + 1; sfx('coin'); lsay('+1 ' + M.MATS[it.mat].name.toLowerCase() + '.', '#7dffa0');
    }
    g.saveGame();
  }
  const _su = ui.shopUpdate; ui.shopUpdate = function (g) {
    if (!ui.shop.ledger) return _su.apply(this, arguments);
    const list = GOODS(), n = list.length, sh = ui.shop;
    if (lmsg.t > 0) lmsg.t--;
    if (sh.sel >= n) sh.sel = 0;
    const close = () => { G.overlay = null; sh.ledger = false; sfx('back'); };
    if (I.hit('pause') || I.hit('jump')) return close();
    if (I.hit('down')) { sh.sel = (sh.sel + 1) % n; sfx('move'); }
    else if (I.hit('up')) { sh.sel = (sh.sel + n - 1) % n; sfx('move'); }
    else if (I.ok()) { const it = list[sh.sel]; if (it.leave) close(); else buy(g, it); }
  };
  const _ds = ui.drawShop; ui.drawShop = function (ctx, g) {
    if (!ui.shop.ledger) return _ds.apply(this, arguments);
    const S = M.ensure(g.state), r = HT.rep('ledger'), list = GOODS(), x0 = 100, y0 = 34, w = 280;
    ui.panel(ctx, x0, y0, w, 200, EMBER);
    art.portrait(ctx, 'sable', x0 + 8, y0 + 8);
    text(ctx, 'THE EMBER LEDGER', x0 + 52, y0 + 10, EMBER);
    text(ctx, 'Creds: ' + S.creds + '    Cores: ' + (S.mats.core || 0), x0 + 52, y0 + 22, '#f5c542');
    text(ctx, HT.tierOf(r) + ' (' + r + '/100)' + (off() > 0 ? '   prices -' + Math.round(off() * 100) + '%' : ''), x0 + 52, y0 + 34, '#c8ccd8');
    list.forEach((it, i) => {
      const y = y0 + 50 + i * 12, on = ui.shop.sel === i, pre = on ? '> ' : '  ';
      if (it.leave) { text(ctx, pre + 'Leave', x0 + 12, y, on ? '#f5c542' : '#ffffff'); return; }
      if (it.mat) {
        art.rect(ctx, M.MATS[it.mat].col, x0 + 20, y + 1, 5, 5);
        text(ctx, pre + '  ' + M.MATS[it.mat].name + '  (have ' + (S.mats[it.mat] || 0) + ')', x0 + 12, y, on ? '#f5c542' : '#ffffff');
        text(ctx, cost(it.price) + ' cr', x0 + w - 12, y, '#f5c542', { align: 'right' });
        return;
      }
      const own = !!S.mods.own[it.mod.id], locked = r < it.tier;
      text(ctx, pre + it.mod.name, x0 + 12, y, on ? '#f5c542' : own ? '#7dffa0' : locked ? '#5a6078' : '#ffffff');
      text(ctx, own ? 'OWNED' : locked ? 'standing ' + it.tier : cost(it.price) + ' cr' + (it.core ? ' + ' + it.core + ' core' : ''), x0 + w - 12, y, own ? '#7dffa0' : locked ? '#5a6078' : '#f5c542', { align: 'right' });
    });
    const it = list[ui.shop.sel] || {};
    const desc = it.mod ? it.mod.desc : it.mat ? { chip: 'Machine parts. Crafting material.', gel: 'Living gel. Crafting material.', core: "A boss-grade power core. Crafting material, and the price of the Ledger's best." }[it.mat] : 'Sable will be here every night.';
    SW.wrap(desc, w - 24).slice(0, 2).forEach((l, i) => text(ctx, l, x0 + 12, y0 + 150 + i * 10, '#8a92b8'));
    if (lmsg.t > 0) SW.wrap(lmsg.s, w - 24).slice(0, 1).forEach(l => text(ctx, l, x0 + 12, y0 + 173, lmsg.col));
    text(ctx, 'W / S choose   J buy   K or Esc leave', x0 + w / 2, y0 + 188, '#5a6078', { align: 'center' });
  };

  SW.ledger = { H, startTest, GOODS, cost, present };
})();
