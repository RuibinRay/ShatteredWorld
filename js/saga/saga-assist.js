'use strict';
// Shattered Worlds - The Hollow Crown: fair Easy and Medium, and "bot fights for me" (the user, 2026-11-20: "allow player
// to select bot fight for me mode if they feel its too hard ... improve easy and medium mode so player can defeat easy have
// a better experience and the final boss fight").
//   - THE DUEL EDGE (Easy and Medium). The rival's edge came from the first story's Crater table (a step count per hero,
//     + bonuses for the Called and Itsuki), measured before the Versus changes of 2026-11-17/18. A Normal-level bot
//     playing the hero won 5% of story duels on Medium and 27% on Easy (0% against Itsuki on both). On Easy and Medium
//     the edge is now set per kind of duel, as a ratio to the player (EDGE below). Itsuki keeps his kit, shield, reach and
//     x1.6 health (never less than his plain mirror); the hero gets help against him instead, and he falls back once his
//     shield is broken and his health is down to yieldAt. Hard and Nightmare are unchanged.
//   - MERCY. On Easy and Medium every lost try wears the rival down a little (MERCY; against Itsuki the hero's boost grows
//     instead), and after two lost tries the DEFEATED screen offers the bot.
//   - BOT FIGHTS FOR ME. Esc > SYSTEM > "Bot fights for me", the B key any time in the story, or U on the DEFEATED screen
//     after two lost tries (or the offer after two falls in a fight). In a story duel the Nightmare-level Versus bot plays
//     the hero (V.f[0].bot, AUTO_LV); in the platform fights (waves, the Convergence, Vael, the Siege Walker captain) an
//     autopilot moves, attacks, guards wind-ups, jumps and uses skills, awakening and the ultimate. A banner says so on
//     screen the whole time; B or the same menu row hands control back.
//   - THE CAMPAIGN BOSSES. saga-core.js keeps a boss's health when the hero falls and plays its entrance once; through its
//     SG.onBoss hook this file sets the Convergence's and Vael's health and damage on Easy and Medium (BOSS) and keeps the
//     area banner from drawing under the boss's own.
// Measured with tools/saga-bench.js. Only wraps: SW.versus.duel / update / draw, SW.input.update, SW.Zone.prototype.update,
// SW.Player.prototype.takeHit, ui.hud, ui.pauseUpdate / drawPause; sets SG.onDuel and SG.onBoss (saga-core.js calls them).
// Loaded after the other js/saga/*.js files. New text is English only (the user's call).
(function () {
  const SW = window.SW, G = SW && SW.game, V = SW && SW.versus, SG = SW && SW.saga, ui = SW && SW.ui, I = SW && SW.input;
  if (!G || !V || !V.duel || !SG || !SG.run || !ui || !I || !SW.Zone) return;
  const D = SW.data, HR = D.heroes, fx = SW.fx, art = SW.art, W = SW.W, H = SW.H, R = SG.run;
  const on = () => !!(G.state && G.state.saga);
  const diffId = () => (SW.difficulty && SW.difficulty.cur ? SW.difficulty.cur().id : 'medium');
  const txt = (ctx, s, x, y, c, o) => SW.text(ctx, s, x, y, c, o);
  const sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no audio yet */ } };
  const A = SW.sagaAssist = {};

  // ================= the duel edge =================
  // One row per kind of duel (saga-core.js fight(): o.sgKind): 'rival' (chapter 3), 'hard' (Vael's champions and the
  // Called: 'champion' / 'called', whole kit), 'itsuki' (the last champion).
  // hp: the rival's health at the start over the player's; dmg: the rival's damage over the player's; lv: the rival's
  // bot level (0 Easy, 1 Normal).
  // Itsuki is measured against his own mirror instead (1 = no edge): his x1.6 Versus health, his shield, his reach and his
  // kit are always his (the user: never trim Itsuki). Even the Nightmare bot won only 39% against him on Easy with no
  // help, so on Easy and Medium the PLAYER gets help instead: you = [health, damage] for the hero, and yieldAt: once
  // his shield is broken and his health is down to that share, he falls back to the Crown (the story's own words) and
  // the duel is won. Measured with a Normal-level bot as the player (tools/saga-bench.js; numbers in the notes).
  const EDGE = {
    easy:   { rival: { hp: 0.95, dmg: 0.85, lv: 0 }, hard: { hp: 0.75, dmg: 0.75, lv: 0 }, itsuki: { hp: 1, dmg: 1, lv: 0, you: [2.6, 2.2], yieldAt: 0.6 } },
    medium: { rival: { hp: 1.05, dmg: 0.95, lv: 1 }, hard: { hp: 0.85, dmg: 0.85, lv: 1 }, itsuki: { hp: 1, dmg: 1, lv: 1, you: [2.6, 2.1], yieldAt: 0.5 } }
  };
  const rowOf = (table, o) => (o.rival === 'itsuki' || o.sgKind === 'itsuki' ? table.itsuki : o.full || (o.sgKind && o.sgKind !== 'rival') ? table.hard : table.rival);
  // saga-core.js would add the old table's edge right after the fight starts; on Easy and Medium it adds nothing and the
  // edge comes from EDGE (applyEdge, on the first frame of every try)
  SG.onDuel = function (o) { if (EDGE[diffId()]) { o.rivalHp = 0; o.rivalPower = 0; } };
  // each lost try (up to MERCY_N) wears the rival down by MERCY of its health and damage; against Itsuki, who is never
  // worn below his mirror, the hero's own boost grows by MERCY_YOU instead
  const MERCY = 0.08, MERCY_YOU = 0.15, MERCY_N = 3;
  A.EDGE = EDGE; A.mercy = true;
  const probe = (f, fn) => { const keep = G.state; G.state = f.state; try { return fn(); } finally { G.state = keep; } };
  let duelInfo = null;   // the story duel running now: { base, e, key, lostAt, p }
  const losses = {};     // lost tries per duel (hero:chapter:rival), back to 0 when it is won
  const sgDuel = () => G.scene === 'vs' && V.mode === 'duel' && V.duelO && V.duelO.sgA && duelInfo;

  const _duel = V.duel;
  V.duel = function (o) {
    const story = G.scene === 'play' && on() && o && o.rivalPower !== undefined && HR[o.rival];
    const id = diffId(), table = EDGE[id];
    let e = null;
    if (story && table) {
      e = Object.assign({ itsuki: o.rival === 'itsuki' }, rowOf(table, o));
      o = Object.assign({}, o, { diff: e.lv });
    }
    if (story) o = Object.assign({}, o, { sgA: true });
    const ok = _duel.call(this, o);
    duelInfo = null;
    if (ok && story && V.f && V.f[1]) {
      const r = V.f[1].state, key = G.state && V.duelSaved && V.duelSaved.state ? V.duelSaved.state.hero + ':' + V.duelSaved.state.saga.ch + ':' + o.rival : o.rival;
      // the mirror as Versus made it, before the story adds its edge (saga-core.js does that right after this returns)
      duelInfo = { base: { power: (r.stats && r.stats.power) || 0, hpBonus: r.hpBonus || 0 }, e, key, p: null, lostSeen: null, autoWas: false, diff: id };
    }
    return ok;
  };
  function applyEdge() {   // every new try (the first frame of a round): the rival's health and damage, from the table
    const di = duelInfo, a = V.f[0], b = V.f[1];
    if (!di.e || !a.p || !b.p) return;
    const lost = A.mercy ? Math.min(MERCY_N, losses[di.key] || 0) : 0;
    if (!di.youBase) di.youBase = { power: (a.state.stats && a.state.stats.power) || 0, hpBonus: a.state.hpBonus || 0 };
    a.state.stats.power = di.youBase.power; a.state.hpBonus = di.youBase.hpBonus;   // both back to the plain mirror first
    const pHp = probe(a, () => a.p.hpMax()), pDm = probe(a, () => a.p.dmgMul());
    b.state.stats.power = di.base.power; b.state.hpBonus = di.base.hpBonus;
    const rHp0 = probe(b, () => b.p.hpMax()), rDm0 = probe(b, () => b.p.dmgMul());
    // the target, worn down after lost tries (Itsuki never below his mirror)
    let tHp = di.e.itsuki ? rHp0 * di.e.hp : pHp * di.e.hp, tDm = di.e.itsuki ? rDm0 * di.e.dmg : pDm * di.e.dmg;
    if (di.e.itsuki) { tHp = Math.max(tHp, rHp0); tDm = Math.max(tDm, rDm0); }
    else { tHp *= 1 - MERCY * lost; tDm *= 1 - MERCY * lost; }
    // health through hpBonus, scaled by whatever multiplier hpMax applies (legends x1.4, Itsuki x1.6 in Versus)
    b.state.hpBonus = di.base.hpBonus + 100;
    const k = (probe(b, () => b.p.hpMax()) - rHp0) / 100 || 1;
    b.state.hpBonus = di.base.hpBonus + (tHp - rHp0) / k;
    // damage through the power stat: dmgMul scales with (1 + 0.06 * power)
    const pw = di.base.power;
    b.state.stats.power = ((1 + 0.06 * pw) * (tDm / rDm0) - 1) / 0.06;
    b.state.hp = probe(b, () => b.p.hpMax());
    // the player's own boost (you: [health, damage]), for the fights the edge alone cannot make fair without trimming
    // the rival (Itsuki); it grows after lost tries
    if (di.e.you) {
      const g = 1 + MERCY_YOU * lost, yh = di.e.you[0] * g, yd = di.e.you[1] * g;
      a.state.hpBonus = di.youBase.hpBonus + 100;
      const ka = (probe(a, () => a.p.hpMax()) - pHp) / 100 || 1;
      a.state.hpBonus = di.youBase.hpBonus + pHp * (yh - 1) / ka;
      a.state.stats.power = ((1 + 0.06 * di.youBase.power) * yd - 1) / 0.06;
      a.state.hp = probe(a, () => a.p.hpMax());
    }
    di.hp = [Math.round(a.state.hp), Math.round(b.state.hp)]; di.lost = lost;
  }
  A.duelInfo = () => duelInfo;
  A.losses = losses;

  // ================= bot fights for me =================
  const AUTO_LV = 3;   // the Versus bot level that fights for the player: Nightmare (js/hardcore.js). Measured against Itsuki on
                       // Medium: level 3 won 64% of 36 duels, level 2 (Hard) 6%
  A.AUTO_LV = AUTO_LV;
  A.auto = () => !!(SW.profile && SW.profile.sgAuto);
  A.setAuto = v => {
    if (!SW.profile) return;
    SW.profile.sgAuto = !!v; if (SW.saveProfile) SW.saveProfile();
    sfx(v ? 'awaken' : 'back');
    if (G.toast) G.toast(v ? 'BOT FIGHTS FOR YOU  (B: take control)' : 'You have control again', v ? '#7dffa0' : '#ffffff');
  };
  let bWas = false;
  function keyB() {   // B toggles it any time in the story or a story duel (raw key: nothing else uses B)
    const b = !!(I.raw && I.raw.KeyB), hit = b && !bWas; bWas = b;
    if (hit && (on() || sgDuel())) A.setAuto(!A.auto());
  }

  // ---- the duel: the Versus bot plays the hero; the offer on the DEFEATED screen ----
  const _vu = V.update;
  V.update = function () {
    const di = sgDuel() ? duelInfo : null;
    if (di) {
      keyB();
      const a = V.f[0], b = V.f[1];
      if (b && b.p && b.p !== di.p) { di.p = b.p; try { applyEdge(); } catch (e) { console.error(e); } }
      if (V.phase === 'duelLost' && di.lostSeen !== b.p) { di.lostSeen = b.p; losses[di.key] = (losses[di.key] || 0) + 1; }
      if (V.phase === 'duelEnd') losses[di.key] = 0;
      if (di.e && di.e.yieldAt && V.phase === 'fight' && b && b.p && !b.p.dead && !(b.p.sgShield > 0)) {   // he falls back (Itsuki on Easy / Medium)
        const max = probe(b, () => b.p.hpMax());
        if (b.state.hp <= max * di.e.yieldAt) {
          probe(b, () => b.p.die());
          fx.text(b.p.x, b.p.y - 60, 'HE FALLS BACK', '#ffffff'); fx.flash('#ffffff', 8);
        }
      }
      if (V.phase === 'duelLost' && V.t > 30 && !A.auto() && (losses[di.key] || 0) >= 2 && I.hit('skill')) {   // U: let the bot fight
        A.setAuto(true); I.now.confirm = true; I.prev.confirm = false;
      }
      const want = A.auto();   // switched (or on at the start): hand the hero to the bot, or back
      if (a && want !== di.autoWas) { di.autoWas = want; a.bot = want; a.ai = null; a.lv = AUTO_LV; }
    }
    return _vu.apply(this, arguments);
  };
  const _vd = V.draw;
  V.draw = function (ctx) {
    _vd.apply(this, arguments);
    const di = sgDuel() ? duelInfo : null;
    if (!di) return;
    try {
      if (A.auto()) banner(ctx, 'BOT IS FIGHTING FOR YOU', 'B: take control', 40);
      if (di.e && di.e.yieldAt && (V.phase === 'intro' || V.phase === 'fight')) txt(ctx, 'Break his shield, then drive him down to ' + Math.round(di.e.yieldAt * 100) + '%: he falls back', W / 2, 54, '#d6c2ff', { align: 'center' });
      if (V.phase === 'duelLost') {
        const lost = losses[di.key] || 0;
        const k = Math.min(MERCY_N, lost);
        if (k >= 1 && di.e && A.mercy) txt(ctx, di.e.itsuki ? 'Next try: you fight ' + Math.round(100 * MERCY_YOU * k) + '% stronger' : 'Next try: ' + (V.duelO.rivalName || 'the rival') + ' is worn down (-' + Math.round(100 * MERCY * k) + '%)', W / 2, 186, '#8a92b8', { align: 'center' });
        if (lost >= 2 && !A.auto()) txt(ctx, 'Too hard?  U: let the bot fight for you', W / 2, 200, '#7dffa0', { align: 'center' });
      }
    } catch (e) { console.error(e); }
  };

  // ---- the platform fights: an autopilot on the hero's keys ----
  const AP = { t: 0, lastX: 0, still: 0, jumpT: 0, guardT: 0 };
  const alive = e => e && !e.dead && !e.gone && !e.dormant && e.hittable && e.team === 'enemy' && !e.isProxy;
  function nearestFoe(z, p) {
    let best = null, bd = 1e9;
    if (G.boss && alive(G.boss) && z.ents.indexOf(G.boss) >= 0) return G.boss;
    for (const e of z.ents) if (alive(e)) { const d = Math.abs(e.x - p.x) + Math.abs(e.y - p.y) * 1.5; if (d < bd) { bd = d; best = e; } }
    return best && bd < 900 ? best : null;
  }
  function beaconX() {   // the next wave's beacon (js/saga/saga-pace.js), if the hero has to walk there
    const M = SG.pace;
    if (!M || !M.pts || R.wave < 0 || !R.list || R.wave + 1 >= R.list.length) return null;
    if (!R.foes.every(e => e.dead || e.gone)) return null;
    const x = M.pts[R.wave];
    return x === undefined ? null : x;
  }
  function fightOn(z, p) {
    if (G.boss && !G.boss.dead) return true;
    if (R.wave >= 0 && R.foes.some(e => !e.dead && !e.gone)) return true;
    if (beaconX() !== null) return true;
    const f = nearestFoe(z, p);
    return !!(f && Math.abs(f.x - p.x) < 260 && Math.abs(f.y - p.y) < 120);
  }
  A.autopilotOn = () => A.auto() && on() && G.scene === 'play' && !G.busy() && !!G.player && !G.player.dead && !!G.zone && fightOn(G.zone, G.player);
  function pilot() {   // the keys for this frame
    const p = G.player, z = G.zone, S = G.state, hero = HR[S.hero], k = {};
    AP.t++;
    if (AP.jumpT > 0) AP.jumpT--;
    const f = nearestFoe(z, p), bx = f ? null : beaconX();
    const tx = f ? f.x : bx;
    if (tx === null || tx === undefined) return k;
    const dx = tx - p.x, adx = Math.abs(dx), dy = f ? (f.y - p.y) : 0, to = dx > 0 ? 'right' : 'left';
    const reach = f && f.isBoss ? 40 : 30;
    if (adx > reach) k[to] = true;
    else if ((dx > 0 ? 1 : -1) !== p.face && AP.t % 10 === 0) k[to] = true;   // turn to face it
    // stuck against a wall or a step: jump
    if (k.left || k.right) { if (Math.abs(p.x - AP.lastX) < 0.4) AP.still++; else AP.still = 0; } else AP.still = 0;
    AP.lastX = p.x;
    const wantUp = f && dy < -36 && adx < 140;
    if ((AP.still > 24 || wantUp) && AP.jumpT <= 0) { k.jump = true; AP.jumpT = AP.still > 24 ? 14 : 22; AP.still = 0; }
    else if (!p.onGround && AP.jumpT > 0 && AP.jumpT < 8 && (wantUp || AP.still > 0)) k.jump = true;   // the double jump
    if (!f) return k;
    const close = adx < 64 && Math.abs(dy) < 56;
    // the "!" of a wind-up: guard through it and a moment after (down, no direction), as a careful player would
    if (p.onGround && adx < 200 && Math.abs(dy) < 80 && (f.tele > 0 || f.state === 'windup')) AP.guardT = f.stun > 0 ? 0 : 16;
    if (AP.guardT > 0) { AP.guardT--; if (p.onGround) return { down: true }; }
    // a healing item when low
    if (S.items > 0 && S.hp < p.hpMax() * 0.35 && AP.t % 30 === 0) k.item = true;
    // the bars: awaken when full, the ultimate at 300 energy, skills on a rhythm
    // (O is read as a press: tapped on every fourth frame, never held)
    if (S.awaken >= 100 && p.awakeT <= 0 && hero.awaken && G.has(hero.awaken) && adx < 220) { if (AP.t % 4 === 0) k.awaken = true; return k; }
    if (S.energy >= 300 && hero.ultimate && G.has(hero.ultimate) && adx < 160) { k.up = true; if (AP.t % 4 === 0) k.awaken = true; return k; }
    if (adx < 220 && Math.abs(dy) < 90 && AP.t % 45 === 0 && S.energy >= 40) { k.skill = true; return k; }
    if (adx < 180 && Math.abs(dy) < 90 && AP.t % 75 === 30 && S.energy >= 60) { k.special = true; return k; }
    // close: a string of light attacks (a new press every 7 frames)
    if (close && AP.t % 7 === 0) k.attack = true;
    // hurt and the foe is winding up close by: step back out of it now and then
    if (close && f.tele > 0 && S.hp < p.hpMax() * 0.5 && AP.t % 3 === 0) { delete k.attack; k[dx > 0 ? 'left' : 'right'] = true; delete k[to]; }
    return k;
  }
  const _iu = I.update;
  I.update = function () {
    const out = _iu.apply(this, arguments);
    try {
      if (G.scene === 'play' && on()) {
        keyB();
        if (A.autopilotOn()) {
          const k = pilot();
          for (const a in k) { I.now[a] = true; if (!I.prev[a]) I.lastHit[a] = SW.frame; }
        }
      }
    } catch (e) { console.error(e); }
    return out;
  };

  // ---- the banner, and an offer after two falls in the same fight ----
  function banner(ctx, a, b, y) {
    const t = SW.frame, wA = SW.textW(a) + SW.textW(b) + 28, x = Math.round(W / 2 - wA / 2);
    ctx.globalAlpha = 0.82; art.rect(ctx, '#05140c', x - 6, y - 3, wA + 12, 13); ctx.globalAlpha = 1;
    art.rect(ctx, t % 50 < 25 ? '#7dffa0' : '#3fbf6a', x - 6, y - 3, 3, 13);
    txt(ctx, a, x + 2, y, '#7dffa0');
    txt(ctx, b, x + wA - SW.textW(b), y, '#c8d0ff');
  }
  const deaths = { key: null, n: 0, offerT: 0, was: false };
  function watchDeaths() {
    const p = G.player, sg = G.state.saga, key = G.state.hero + ':' + sg.ch;
    if (deaths.key !== key) { deaths.key = key; deaths.n = 0; deaths.offerT = 0; }
    const dead = !!(p && p.dead);
    if (dead && !deaths.was && (G.boss || R.wave >= 0)) { deaths.n++; if (deaths.n >= 2 && !A.auto()) deaths.offerT = 60 * 14; }
    deaths.was = dead;
    if (deaths.offerT > 0 && !dead) deaths.offerT--;
  }
  const _hud = ui.hud;
  ui.hud = function (ctx, g) {
    _hud.apply(this, arguments);
    if (g.scene !== 'play' || !on()) return;
    try {
      if (A.auto()) banner(ctx, A.autopilotOn() ? 'BOT IS FIGHTING FOR YOU' : 'BOT FIGHTS FOR YOU: ON', 'B: take control', 66);
      else if (deaths.offerT > 0) banner(ctx, 'Too hard?  B: let the bot fight for you', '', 66);
    } catch (e) { console.error(e); }
  };

  // ---- Esc > SYSTEM: "Bot fights for me" (row 7, under the Language row of js/settings.js) ----
  const ROW = 7, ROW_Y = 40 + 9 * 14;
  const eat = () => { I.prev = Object.assign({}, I.now); };
  const _pu = ui.pauseUpdate;
  ui.pauseUpdate = function (g) {
    const pm = ui.pm;
    if (pm.tab === 4 && on()) {
      if (pm.sel === ROW - 1 && I.hit('down')) { pm.sel = ROW; sfx('move'); eat(); }
      else if (pm.sel === ROW) {
        if (I.hit('up')) { pm.sel = ROW - 1; sfx('move'); }
        else if (I.hit('down')) { pm.sel = 0; sfx('move'); }
        else if (I.hit('left') || I.hit('right') || I.ok()) A.setAuto(!A.auto());
        eat();
      }
    }
    return _pu.apply(this, arguments);
  };
  const _dp = ui.drawPause;
  ui.drawPause = function (ctx, g) {
    _dp.apply(this, arguments);
    if (ui.pm.tab !== 4 || !on()) return;
    const sel = ui.pm.sel === ROW, v = A.auto();
    art.rect(ctx, '#080916', 24, ROW_Y - 2, 420, 24);
    txt(ctx, (sel ? '> ' : '  ') + 'Bot fights for me   < ' + (v ? 'On' : 'Off') + ' >', 26, ROW_Y, sel ? '#f5c542' : v ? '#7dffa0' : '#ffffff');
    if (sel) txt(ctx, 'A bot plays your hero in duels and battles. B switches it any time.', 26, ROW_Y + 12, '#8a92b8');
  };

  // ================= the campaign's bosses =================
  // [health, damage] multipliers for the Convergence (chapter 5) and Sovereign Vael (chapter 7) on Easy and Medium, on
  // top of difficulty.js's own boss numbers; Hard and Nightmare unchanged. saga-core.js keeps a boss's health when the
  // hero falls (it heals back a quarter) and plays its entrance once; its SG.onBoss hook lets this file retune the boss
  // as it appears.
  const BOSS = { easy: { convergence: [0.75, 0.75], vael: [0.9, 0.9] }, medium: { convergence: [0.6, 0.55], vael: [0.8, 0.8] } };
  const REFILL = 0.25;   // as saga-core.js: the share of its bar a kept boss heals back
  A.BOSS = BOSS;
  SG.onBoss = function (b, info) {
    if (G.banner) G.banner.t = 0;   // the area's banner (shown again after a fall) would sit under the boss's own
    const q = BOSS[diffId()] && BOSS[diffId()][info.type];
    if (!q) return;
    const sg = G.state.saga, kept = sg.bossHp && sg.bossHp[info.key];
    b.hpMax = Math.max(1, Math.round(b.hpMax * q[0]));
    b.hp = kept > 0 && kept < b.hpMax ? Math.min(b.hpMax, Math.round(kept + REFILL * b.hpMax)) : b.hpMax;   // kept is already in these units
    b.sgaDmg = q[1];
  };
  // their damage on Easy / Medium (difficulty.js scales everything a boss fight throws at the hero on top of this)
  const P = SW.Player.prototype, _th = P.takeHit;
  P.takeHit = function (atk, g) {
    const b = G.boss;
    if (G.scene === 'play' && on() && b && b.sgaDmg && !b.dead && atk && atk.dmg && atk.team !== 'player') atk = Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * b.sgaDmg)) });
    return _th.call(this, atk, g);
  };
  const _zu = SW.Zone.prototype.update;
  SW.Zone.prototype.update = function (g) {
    const out = _zu.apply(this, arguments);
    if (on() && G.scene === 'play' && this === G.zone && this.id !== 'versus' && G.player) {
      try { watchDeaths(); } catch (e) { console.error(e); }
    }
    return out;
  };
})();
