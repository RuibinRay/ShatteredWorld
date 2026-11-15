'use strict';
// Shattered Worlds — story difficulty. Loaded last; only wraps.
//   Medium is the game as it was tuned. Easy, Hard and Nightmare scale ordinary enemies and bosses separately:
//   health when an enemy appears, and the damage of anything that hits you. During a boss fight everything that hits you
//   (the boss, its adds, its shots) counts as boss damage. The Crater duel follows the setting too (the rival's bot level
//   and its edge). Versus is not affected: it has its own bot levels.
//   The setting belongs to the player, not to a save: it is chosen on the title screen or in Esc > SYSTEM, and it applies
//   at once, also to a game already in progress (enemies already standing keep the health they appeared with).
(function () {
  const SW = window.SW, G = SW.game, ui = SW.ui, I = SW.input, art = SW.art, text = SW.text, P = SW.Player.prototype;
  const LEVELS = [
    { id: 'easy',      name: 'Easy',      mobHp: 0.7, mobDmg: 0.6, bossHp: 0.75, bossDmg: 0.65, duelDiff: 0, duelEdge: 0.5, col: '#7dffa0' },
    { id: 'medium',    name: 'Medium',    mobHp: 1,   mobDmg: 1,   bossHp: 1,    bossDmg: 1,    duelDiff: 1, duelEdge: 1,   col: '#ffffff' },
    { id: 'hard',      name: 'Hard',      mobHp: 1.25, mobDmg: 1.25, bossHp: 1.2, bossDmg: 1.15, duelDiff: 1, duelEdge: 1.3, col: '#ffb060' },
    { id: 'nightmare', name: 'Nightmare', mobHp: 1.7, mobDmg: 1.6, bossHp: 1.8,  bossDmg: 1.6,  duelDiff: 2, duelEdge: 1.7, col: '#ff5a5a' }
  ];
  // The first boss of every hero's tutorial is eased at every level (asked for after play: "make the first boss easier"),
  // so boss health climbs through the story: the tutorial bosses come out below the Act 1 finale (Grist 620, Brandt 580),
  // then Act 2 (640 to 960) and Act 3 (900 to 1400). Legend tutorial bosses are bigger because legends hit for +50%.
  const FIRST_HP = 0.75, FIRST_DMG = 0.85, E = SW.data.enemies, TUT = (SW.story && SW.story.tutorials) || {};
  const FIRST = ['tusk', 'warden'].concat(Object.keys(TUT).map(h => TUT[h].boss)).filter((v, i, a) => v && a.indexOf(v) === i);
  FIRST.forEach(n => { const d = E[n]; if (!d || d.eased) return; d.eased = true; d.hp = Math.round(d.hp * FIRST_HP); d.dmg = Math.max(1, Math.round(d.dmg * FIRST_DMG)); });
  // ...then evened out between heroes (a recorded playtest found Brakk losing 88% to Foreman Crake and Kael 13% to Tusk).
  // Measured with ST.bench at level 2, the careful test player first lost from 7% (Holt, Voss) to 57% (Crake); these
  // [health, damage] multipliers bring the medians into about 25-50%. The fights that summon helpers (Holt, Voss, Penn,
  // Purl) stay swingy, because the helpers drop health: one fight in ten the careful player ends with more than they
  // started, another costs half the bar. Penn at 1.6x killed the careful player 2 fights in 10, so it stays at 1.25x.
  const FIRST_TUNE = { crake: [0.9, 0.8], slag: [0.9, 0.8], tusk: [0.9, 0.78], ante: [0.95, 0.85], cinder: [0.95, 0.85], hale: [0.95, 0.9],
    holt: [1.3, 1.1], voss: [1.25, 1.2], ilse: [1.1, 1.1], penn: [1.25, 1], purl: [1.35, 1.15] };
  Object.keys(FIRST_TUNE).forEach(n => { const d = E[n], q = FIRST_TUNE[n]; if (!d || d.evened) return; d.evened = true; d.hp = Math.round(d.hp * q[0]); d.dmg = Math.max(1, Math.round(d.dmg * q[1])); });
  // Later bosses, retuned for the level players really arrive at. Working the XP through the story (every mission, every
  // enemy killed once) puts a player at level 8-9 for the Baron, 10 for the Glowmother, 14 for Anvil, 17 for Vane, 19 for Quist,
  // 20-22 for the Spire and 23 for the Director, against the 7 / 9 / 12 / 13 / 14 / 15 / 16 they were first tuned at, and the
  // first tuning gave the test players no stat points. Re-measured at the real levels with half the points in Power, a
  // button-masher survived most late bosses (the Director cost them 6%). [health, damage] multipliers, from those measurements:
  // Health also climbs boss to boss, never dipping (Anvil, Quist and Morrow get more health and keep their measured damage):
  // Baron 989, Glowmother 1056, Anvil 1080, Vane 1250, Quist 1260, Morrow 1320, Kessen 1400, the Director 1350 + 1650 + 1500.
  const LATE = { baron: [1.15, 1.25], glowmother: [1.1, 1.15], champ: [1.2, 1.1], vane: [1.25, 1.3], quist: [1.2, 0.95], morrow: [1.2, 1.15], kessen: [1, 1.1], director: [1.5, 1.6], fused: [1.5, 1.6], convergence: [1.5, 1.6] };
  Object.keys(LATE).forEach(n => { const d = E[n], q = LATE[n]; if (!d || d.lateTuned) return; d.lateTuned = true; d.hp = Math.round(d.hp * q[0]); d.dmg = Math.round(d.dmg * q[1]); });
  const cur = () => LEVELS.find(l => l.id === (SW.profile && SW.profile.diff)) || LEVELS[1];
  const set = id => { SW.profile.diff = id; if (SW.saveProfile) SW.saveProfile(); };
  const step = d => { const i = LEVELS.indexOf(cur()); set(LEVELS[(i + d + LEVELS.length) % LEVELS.length].id); SW.audio.sfx('select'); };
  SW.difficulty = { LEVELS, cur, set, FIRST };

  // health, when an enemy appears in the story
  const isBoss = e => !!(SW.Boss && e instanceof SW.Boss);
  const _spawn = SW.spawnEnemy; SW.spawnEnemy = function (type, x, y, o) {
    const e = _spawn(type, x, y, o), l = cur();
    if (G.scene === 'play' && l.id !== 'medium') { const m = isBoss(e) ? l.bossHp : l.mobHp; e.hp = Math.max(1, Math.round(e.hp * m)); e.hpMax = Math.max(1, Math.round((e.hpMax || e.hp) * m)); }
    return e;
  };
  // damage, as it reaches the hero in the story
  const _th = P.takeHit; P.takeHit = function (atk, g) {
    const l = cur();
    if (g.scene !== 'play' || l.id === 'medium' || !atk || atk.team === 'player' || !atk.dmg) return _th.call(this, atk, g);
    const boss = (g.boss && !g.boss.dead) || (atk.src && isBoss(atk.src));
    return _th.call(this, Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * (boss ? l.bossDmg : l.mobDmg))) }), g);
  };

  // ---- the setting: a title-screen line and a sixth row in Esc > SYSTEM ----
  const eat = () => { I.prev = Object.assign({}, I.now); };   // the keypress is used up: nothing else on screen sees it this frame
  const _ti = ui.titleItems; ui.titleItems = function (g) {
    const a = _ti(g), at = Math.max(0, a.length - 1);
    a.splice(at, 0, ['Difficulty: ' + cur().name, 'difficulty']);
    if (g.scene === 'title' && !g.overlay && a[ui.title.sel] && a[ui.title.sel][1] === 'difficulty') {
      if (I.ok() || I.hit('right')) { step(1); eat(); a[at][0] = 'Difficulty: ' + cur().name; }
      else if (I.hit('left')) { step(-1); eat(); a[at][0] = 'Difficulty: ' + cur().name; }
    }
    return a;
  };
  const _pu = ui.pauseUpdate; ui.pauseUpdate = function (g) {
    const pm = ui.pm;
    if (pm.tab === 4) {
      if (pm.sel === 4 && I.hit('down')) { pm.sel = 5; SW.audio.sfx('move'); eat(); }
      else if (pm.sel === 5) {
        if (I.hit('up')) { pm.sel = 4; SW.audio.sfx('move'); eat(); }
        else if (I.hit('down')) { pm.sel = 0; SW.audio.sfx('move'); eat(); }
        else if (I.hit('left')) { step(-1); eat(); }
        else if (I.hit('right') || I.ok()) { step(1); eat(); }
      }
    }
    return _pu(g);
  };
  const _dp = ui.drawPause; ui.drawPause = function (ctx, g) {
    _dp(ctx, g);
    if (ui.pm.tab !== 4) return;
    const l = cur(), on = ui.pm.sel === 5, y = 40 + 5 * 14;
    art.rect(ctx, '#080916', 24, y - 2, 300, 12);
    text(ctx, (on ? '> ' : '  ') + 'Difficulty    < ' + l.name + ' >', 26, y, on ? '#f5c542' : l.col);
    if (on) text(ctx, 'Enemies ' + Math.round(l.mobHp * 100) + '% health, ' + Math.round(l.mobDmg * 100) + '% damage.  Bosses ' + Math.round(l.bossHp * 100) + '% health, ' + Math.round(l.bossDmg * 100) + '% damage.', 26, y + 12, '#8a92b8');
  };
  // and on the title screen, under the menu: what the highlighted level does
  const _dt = ui.drawTitle; if (_dt) ui.drawTitle = function (ctx, g) {
    _dt(ctx, g);
    const items = ui.titleItems(g), it = items[ui.title.sel];
    if (it && it[1] === 'difficulty') { const l = cur(); text(ctx, 'A / D or J: change.  Enemies ' + Math.round(l.mobHp * 100) + '% health, ' + Math.round(l.mobDmg * 100) + '% damage; bosses ' + Math.round(l.bossHp * 100) + '% / ' + Math.round(l.bossDmg * 100) + '%.', SW.W / 2, 238, l.col, { align: 'center' }); }
  };
})();
