'use strict';
// Shattered Worlds — HUD, dialogue, menus, world map, memory flashbacks.
(function () {
  const SW = window.SW, art = SW.art, I = SW.input, D = SW.data, W = SW.W, H = SW.H;
  const ui = SW.ui = {};
  const text = SW.text;
  function panel(ctx, x, y, w, h, col, a) {
    ctx.globalAlpha = a === undefined ? 0.9 : a; art.rect(ctx, '#080916', x, y, w, h); ctx.globalAlpha = 1;
    if (col) { art.rect(ctx, col, x, y, w, 1); art.rect(ctx, col, x, y + h - 1, w, 1); art.rect(ctx, col, x, y, 1, h); art.rect(ctx, col, x + w - 1, y, 1, h); }
  }
  function bar(ctx, x, y, w, h, f, col, back) {
    art.rect(ctx, '#05060c', x - 1, y - 1, w + 2, h + 2); art.rect(ctx, back || '#1c1e2e', x, y, w, h);
    const fw = Math.round(w * SW.clamp(f, 0, 1));
    if (fw > 0) { art.rect(ctx, col, x, y, fw, h); art.rect(ctx, '#ffffff', x, y, fw, 1); ctx.globalAlpha = 0.45; art.rect(ctx, col, x, y, fw, 1); ctx.globalAlpha = 1; }
  }
  ui.panel = panel; ui.bar = bar;

  // ---------- dialogue ----------
  const dlg = ui.dlg = { active: false, lines: null, i: 0, chars: 0, cb: null, sel: 0, wait: false };
  dlg.start = function (G, id, cb) {
    const lines = D.dialogue[id];
    if (!lines) { G.toast('[missing dialogue: ' + id + ']'); if (cb) cb(); return; }
    dlg.active = true; dlg.lines = lines; dlg.i = -1; dlg.cb = cb || null; dlg.wait = false;
    dlg.next(G);
  };
  dlg.speaker = function (G, s) {
    if (s === 'hero') { const h = G.hero(); return { name: G.flag('name_known') ? h.name : h.alias, sheet: G.player ? G.player.sheet() : h.sheet, pitch: h.pitch || 520, col: h.color }; }
    return D.speakers[s] || { name: '' };
  };
  dlg.next = function (G) {
    dlg.i++;
    if (dlg.i >= dlg.lines.length) { dlg.active = false; const cb = dlg.cb; dlg.cb = null; if (cb) cb(); return; }
    const ln = dlg.lines[dlg.i];
    dlg.chars = 0; dlg.sel = 0; dlg.wrapped = SW.wrap(G.txt(ln.t), ln.s === 'sys' ? 420 : 372);
    if (ln.flag) G.setFlag(ln.flag);
    if (ln.unlock) G.unlock(ln.unlock);
    if (ln.energy) G.state.energy = ln.energy;
    if (ln.give) { if (ln.give.creds) { G.state.creds += ln.give.creds; SW.audio.sfx('coin'); } if (ln.give.item) G.state.items = Math.min(5, G.state.items + ln.give.item); if (ln.give.xp) G.addXP(ln.give.xp); }
    if (ln.assist) G.addAssist(ln.assist);
    if (ln.heal && G.player) { G.state.hp = G.player.hpMax(); SW.audio.sfx('heal'); }
    if (ln.step) G.step(ln.step);
  };
  dlg.update = function (G) {
    if (dlg.wait) return;
    const ln = dlg.lines[dlg.i], full = dlg.wrapped.join('\n').length, sp = dlg.speaker(G, ln.s);
    if (dlg.chars < full) dlg.chars += 1;   // no per-character typing voice (the user asked for no character voices, 2026-11-20)
    if (ln.choice && dlg.chars >= full) {
      if (I.hit('up') || I.hit('down')) { dlg.sel = (dlg.sel + (I.hit('down') ? 1 : ln.choice.length - 1)) % ln.choice.length; SW.audio.sfx('move'); }
    }
    if (I.ok() || I.hit('jump')) {
      if (dlg.chars < full) { dlg.chars = full; return; }
      SW.audio.sfx('select');
      let fn = ln.fn;
      if (ln.choice) fn = ln.choice[dlg.sel].fn;
      const go = () => { if (fn) G.hook(fn); if (dlg.active) dlg.next(G); };
      if (ln.memory) { dlg.wait = true; G.memory(ln.memory, () => { dlg.wait = false; go(); }); } else go();
    }
  };
  dlg.draw = function (ctx, G) {
    if (dlg.wait) return;
    const ln = dlg.lines[dlg.i], sp = dlg.speaker(G, ln.s), sys = ln.s === 'sys', bx = 16, by = 196, bw = W - 32, bh = 66;
    panel(ctx, bx, by, bw, bh, sys ? '#5a7a9a' : (sp.col || '#8a92b8'));
    let shown = Math.floor(dlg.chars), tx = sys ? bx + 12 : bx + 52, ty = sys ? by + 12 : by + 20;
    if (!sys) {
      if (sp.sheet) { art.portrait(ctx, sp.sheet, bx + 8, by + 8); art.rect(ctx, sp.col || '#8a92b8', bx + 7, by + 7, 38, 1); art.rect(ctx, sp.col || '#8a92b8', bx + 7, by + 44, 38, 1); art.rect(ctx, sp.col || '#8a92b8', bx + 7, by + 7, 1, 38); art.rect(ctx, sp.col || '#8a92b8', bx + 44, by + 7, 1, 38); }
      text(ctx, sp.name, tx, by + 7, sp.col || '#f5c542');
    }
    for (const row of dlg.wrapped) {
      if (shown <= 0) break;
      text(ctx, row.slice(0, shown), tx, ty, sys ? '#bfe8ff' : '#ffffff'); shown -= row.length + 1; ty += 10;
    }
    const full = dlg.wrapped.join('\n').length;
    if (dlg.chars >= full) {
      if (ln.choice) ln.choice.forEach((c, i) => { const cy = by + bh - 12 - (ln.choice.length - 1 - i) * 11; text(ctx, (i === dlg.sel ? '> ' : '  ') + c.t, bx + bw - 90, cy, i === dlg.sel ? '#f5c542' : '#c8ccd8'); });
      else if (SW.frame % 40 < 26) text(ctx, 'v', bx + bw - 12, by + bh - 12, '#ffffff');
    }
  };

  // ---------- HUD ----------
  ui.hud = function (ctx, G) {
    const S = G.state, p = G.player, hero = G.hero(), mx = p.hpMax(), cam = G.cam;
    panel(ctx, 5, 4, 158, 37, null, 0.5);
    bar(ctx, 10, 9, 104, 6, S.hp / mx, S.hp / mx < 0.3 ? '#ff5a5a' : '#6fe89a', '#1c2a22');
    text(ctx, Math.max(0, Math.ceil(S.hp)) + '/' + mx, 119, 8, '#ffffff');
    for (let i = 0; i < 3; i++) { const f = SW.clamp((S.energy - i * 100) / 100, 0, 1); bar(ctx, 10 + i * 35, 19, 33, 4, f, f >= 1 ? hero.colorHi : hero.color, '#22202e'); }
    text(ctx, hero.energy.toUpperCase(), 119, 17, hero.color);
    const full = S.awaken >= 100 && p.awakeT <= 0;
    bar(ctx, 10, 27, 104, 2, S.awaken / 100, p.awakeT > 0 ? hero.colorHi : full && SW.frame % 16 < 8 ? '#ffffff' : '#8b5cf6', '#1a1626');
    if (full && G.has(hero.awaken) && SW.frame % 40 < 28) text(ctx, 'O: AWAKEN', 119, 24, '#ffffff');
    text(ctx, 'LV' + S.level, 10, 32, '#ffffff');
    art.rect(ctx, '#f5c542', 38, 34, 4, 4); text(ctx, String(S.creds), 45, 32, '#f5c542');
    art.rect(ctx, '#7dffa0', 76, 35, 6, 2); art.rect(ctx, '#7dffa0', 78, 33, 2, 6); text(ctx, 'x' + S.items, 85, 32, S.items ? '#7dffa0' : '#5a6078');
    if (S.assist) { const cd = Math.ceil(p.assistCd / 60); text(ctx, 'O:' + D.speakers[S.assist].name + (cd > 0 ? ' ' + cd + 's' : ''), 106, 32, cd > 0 ? '#5a6078' : '#22d3ee'); }
    if (p.modeT > 0) text(ctx, D.abilities[hero.mode].name + ' ' + Math.ceil(p.modeT / 60), 10, 44, hero.colorHi);
    // combo counter
    const cb = G.combo;
    if (cb && cb.n >= 2) {
      const a = Math.min(1, cb.t / 20), col = cb.n >= 20 ? '#ff3ea5' : cb.n >= 10 ? '#f5c542' : '#ffffff';
      ctx.globalAlpha = a;
      text(ctx, String(cb.n), W - 44, 62 - (cb.pop > 0 ? 3 : 0), col, { align: 'right', scale: cb.pop > 0 ? 4 : 3 });
      text(ctx, 'HITS', W - 40, 72, col); text(ctx, cb.dmg + ' dmg', W - 12, 86, '#c8ccd8', { align: 'right' });
      ctx.globalAlpha = 1;
    }
    // mission
    const m = D.missions[S.mission];
    if (m) {
      text(ctx, m.title, W - 8, 6, '#f5c542', { align: 'right' });
      const st = G.currentStep();
      if (st) { let t = st.t; if (st.n) t += ' (' + (S.counts[m.id + ':' + st.id] || 0) + '/' + st.n + ')'; SW.wrap(t, 190).forEach((l, i) => text(ctx, l, W - 8, 17 + i * 10, '#ffffff', { align: 'right' })); }
    } else text(ctx, 'Free roam', W - 8, 6, '#8a92b8', { align: 'right' });
    // boss bar
    const b = G.boss;
    if (b && !b.dormant && !b.gone) {
      text(ctx, b.def.name, W / 2, 232, '#ffffff', { align: 'center' }); text(ctx, b.def.sub, W / 2, 256, '#8a92b8', { align: 'center' });
      bar(ctx, 100, 244, 280, 6, b.hp / b.hpMax, b.phase === 2 ? '#ff8a3a' : '#ff5a5a', '#2a1418');
      art.rect(ctx, '#05060c', 239, 243, 2, 8);
    }
    // interact prompt
    const e = G.promptEnt;
    if (e && !G.busy()) {
      const px = Math.round(e.x - cam.x), py = Math.round(e.y - cam.y - (e.ph || 44));
      const label = 'E  ' + e.prompt, tw = SW.textW(label);
      panel(ctx, px - tw / 2 - 4, py - 2, tw + 8, 12, '#f5c542', 0.85); text(ctx, label, px, py, '#ffffff', { align: 'center' });
      if (e.name) text(ctx, e.name, px, py - 11, '#f5c542', { align: 'center' });
    }
    // hint
    if (G.hintText && !G.busy() && !(b && !b.gone)) {
      const lines = G.hintText.split('\n'), tw = Math.max.apply(null, lines.map(SW.textW)), hh = lines.length * 10 + 6, hy = H - hh - 8;
      panel(ctx, W / 2 - tw / 2 - 8, hy, tw + 16, hh, '#22d3ee', 0.8);
      lines.forEach((l, i) => text(ctx, l, W / 2, hy + 4 + i * 10, '#e8fbff', { align: 'center' }));
    }
    // toasts
    G.toasts.forEach((t, i) => {
      const a = Math.min(1, t.t / 12, (t.max - t.t) / 10 + 0.01), tw = SW.textW(t.text);
      ctx.globalAlpha = SW.clamp(a, 0, 1); panel(ctx, W / 2 - tw / 2 - 6, 48 + i * 14, tw + 12, 12, null, 0.75 * SW.clamp(a, 0, 1)); ctx.globalAlpha = SW.clamp(a, 0, 1);
      text(ctx, t.text, W / 2, 50 + i * 14, t.col || '#ffffff', { align: 'center' }); ctx.globalAlpha = 1;
    });
    // zone banner
    const bn = G.banner;
    if (bn && bn.t > 0) {
      const a = SW.clamp(Math.min(bn.t / 20, (bn.max - bn.t) / 20), 0, 1);
      ctx.globalAlpha = a; art.rect(ctx, '#05060c', 0, 112, W, 34); ctx.globalAlpha = a;
      text(ctx, bn.title, W / 2, 116, '#ffffff', { align: 'center', scale: 2 }); if (bn.sub) text(ctx, bn.sub, W / 2, 135, bn.col || '#f5c542', { align: 'center' });
      ctx.globalAlpha = 1;
    }
  };

  // ---------- title / hero select / prologue ----------
  ui.title = { sel: 0 };
  ui.drawTitle = function (ctx, G) {
    const bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0); else art.rect(ctx, '#0b0c1c', 0, 0, W, H);
    ctx.globalAlpha = 0.45; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'SHATTERED WORLDS', W / 2 + 2, 42, '#8b5cf6', { align: 'center', scale: 3, shadow: '#1a0f3a' });
    text(ctx, 'SHATTERED WORLDS', W / 2, 40, '#ffffff', { align: 'center', scale: 3, shadow: false });
    text(ctx, 'A pixel open-world action RPG', W / 2, 72, '#bfe8ff', { align: 'center' });
    const items = ui.titleItems(G);
    items.forEach((it, i) => text(ctx, (i === ui.title.sel ? '> ' : '  ') + it[0], W / 2 - 40, 150 + i * 14, i === ui.title.sel ? '#f5c542' : '#ffffff'));
    if (G.loadMsg) text(ctx, G.loadMsg, W / 2, 128, '#ff8a8a', { align: 'center' });
    text(ctx, 'W / S: choose    J or Enter: select', W / 2, 250, '#8a92b8', { align: 'center' });
    text(ctx, 'First playable build - Act 1', W - 6, 258, '#5a6078', { align: 'right' });
  };
  ui.titleItems = G => { const a = []; if (SW.store.load()) a.push(['Continue', 'continue']); a.push(['New Game', 'new'], ['Controls', 'controls']); return a; };
  ui.sel = { i: 0 };
  ui.drawSelect = function (ctx, G) {
    const bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.72; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'WHO WAKES UP?', W / 2, 12, '#ffffff', { align: 'center', scale: 2 });
    ['kael', 'nyra'].forEach((id, i) => {
      const h = D.heroes[id], x = 24 + i * 222, on = ui.sel.i === i;
      panel(ctx, x, 38, 210, 196, on ? h.color : '#3a3d55', on ? 0.92 : 0.7);
      ctx.save(); ctx.translate(x + 46, 150); ctx.scale(2, 2);
      art.draw(ctx, id === 'nyra' ? 'nyra_b' : 'kael', on ? 'run' : 'idle', on ? Math.floor(SW.frame / 5) % 8 : Math.floor(SW.frame / 28) % 2, 0, 0, false, { alpha: on ? 1 : 0.5 });
      ctx.restore();
      text(ctx, h.name.toUpperCase(), x + 96, 48, on ? h.color : '#8a92b8', { scale: 2 });
      text(ctx, '"' + h.title + '"', x + 96, 68, '#ffffff');
      text(ctx, 'Energy: ' + h.energy, x + 96, 82, h.color);
      text(ctx, h.blurb, x + 12, 160, on ? '#e8ecf4' : '#8a92b8');
    });
    text(ctx, 'A / D: choose    J or Enter: begin    Esc: back', W / 2, 250, '#8a92b8', { align: 'center' });
  };
  ui.pro = { i: 0, t: 0 };
  ui.drawPrologue = function (ctx, G) {
    const bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    const ln = D.prologue[ui.pro.i].split('\n'), n = Math.floor(ui.pro.t * 0.9);
    let left = n;
    ln.forEach((l, i) => { if (left > 0) text(ctx, l.slice(0, left), W / 2 - SW.textW(l) / 2, 116 + i * 14, '#ffffff'); left -= l.length; });
    text(ctx, (ui.pro.i + 1) + ' / ' + D.prologue.length, W / 2, 236, '#5a6078', { align: 'center' });
    if (SW.frame % 40 < 26) text(ctx, 'J / Enter: next    Esc: skip', W / 2, 250, '#8a92b8', { align: 'center' });
  };
  ui.drawControls = function (ctx) {
    art.rect(ctx, '#05060c', 0, 0, W, H);
    text(ctx, 'CONTROLS', W / 2, 10, '#f5c542', { align: 'center', scale: 2 });
    const rows = [['A / D', 'Move'], ['K', 'Jump (hold for height). S + K drops through ledges'], ['J', 'Attack: tap for a 4-hit combo'], ['W + J', 'Launcher (then K to follow up in the air)'], ['S + J', 'Sweep'],
      ['L', 'Dash (brief invulnerability; works in mid-air)'], ['S + L / W + L', 'Slipstep: blink through a foe / upward (60 energy)'], ['L when launched', 'Recover in mid-air'], ['S (hold)', 'Guard. Time it late for a PERFECT guard'], ['J + K (hold)', 'Charge energy'], ['U', 'Skill (25).  W + U: aimed up.  S + U: alternate skill'],
      ['I', 'Special (50).  S + I: big skill (100).  W + I: ultimate'], ['O', 'Awakening when full, else your assist.  S + O: power mode'], ['W + O', 'Signature skill (75 energy, 7 s cooldown)'],['Q', 'Use a healing item'], ['E', 'Talk / interact'], ['W / S', 'Climb ladders'], ['M', 'World map'], ['Esc', 'Menu: missions, skills, journal, stats'],
      ['F9', 'Debug: unlock every ability'], ['Gamepad', 'X attack, A jump, RB dash, Y skill, B special,'], ['', 'RT awaken, LT guard, LB charge, Up interact']].filter(r => r[0] !== 'F9' || SW.dev);   // debug keys: local copies only (playfixes.js)
    rows.forEach((r, i) => { text(ctx, r[0], 118, 30 + i * 10, '#22d3ee', { align: 'right' }); text(ctx, r[1], 128, 30 + i * 10, '#ffffff'); });
    text(ctx, 'J / Esc: back', W / 2, 254, '#8a92b8', { align: 'center' });
  };

  // ---------- pause menu ----------
  const TABS = ['MISSION', 'SKILLS', 'JOURNAL', 'STATS', 'SYSTEM', 'UPGRADES'];
  const pm = ui.pm = { tab: 0, sel: 0 };
  ui.pauseUpdate = function (G) {
    const S = G.state;
    if (I.hit('pause') || (I.hit('jump') && pm.tab !== 3)) { G.overlay = null; SW.audio.sfx('back'); return; }
    if (I.hit('left') && !(pm.tab === 4 && (pm.sel === 1 || pm.sel === 2)) && !(pm.tab === 3 && pm.sel === 3)) { pm.tab = (pm.tab + TABS.length - 1) % TABS.length; pm.sel = 0; SW.audio.sfx('move'); }
    else if (I.hit('right') && !(pm.tab === 4 && (pm.sel === 1 || pm.sel === 2)) && !(pm.tab === 3 && pm.sel === 3)) { pm.tab = (pm.tab + 1) % TABS.length; pm.sel = 0; SW.audio.sfx('move'); }
    const count = pm.tab === 1 ? G.hero().kit.length + 1 : pm.tab === 2 ? Math.max(1, S.memories.length) : pm.tab === 3 ? 4 : pm.tab === 4 ? 5 : pm.tab === 5 ? D.upgrades.length : 1;
    if (I.hit('down')) { pm.sel = (pm.sel + 1) % count; SW.audio.sfx('move'); }
    if (I.hit('up')) { pm.sel = (pm.sel + count - 1) % count; SW.audio.sfx('move'); }
    if (pm.tab === 3) {
      if (pm.sel < 3 && I.ok() && S.points > 0) { const k = ['power', 'energy', 'speed'][pm.sel]; S.stats[k]++; S.points--; SW.audio.sfx('select'); }
      if (pm.sel === 3 && (I.hit('left') || I.hit('right') || I.ok()) && S.assists.length > 1) { S.assist = S.assists[(S.assists.indexOf(S.assist) + 1) % S.assists.length]; SW.audio.sfx('select'); }
    } else if (pm.tab === 4) {
      const A = SW.audio, d = (I.hit('right') ? 0.1 : 0) - (I.hit('left') ? 0.1 : 0);
      if (pm.sel === 1 && d) { A.vol.sfx = SW.clamp(Math.round((A.vol.sfx + d) * 10) / 10, 0, 1); A.setVol(); A.sfx('select'); }
      if (pm.sel === 2 && d) { A.vol.music = SW.clamp(Math.round((A.vol.music + d) * 10) / 10, 0, 1); A.setVol(); }
      if (I.ok()) {
        if (pm.sel === 0) G.overlay = null; else if (pm.sel === 3) G.overlay = 'controls';
        else if (pm.sel === 4) { G.saveGame(); G.overlay = null; G.toTitle(); }
        SW.audio.sfx('select');
      }
    }
  };
  ui.drawPause = function (ctx, G) {
    const S = G.state, hero = G.hero(), p = G.player;
    ctx.globalAlpha = 0.86; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    TABS.forEach((t, i) => { const x = 44 + i * 78; text(ctx, t, x, 12, i === pm.tab ? '#f5c542' : '#5a6078', { align: 'center' }); if (i === pm.tab) art.rect(ctx, '#f5c542', x - 26, 23, 52, 1); });
    panel(ctx, 14, 30, W - 28, 214, '#3a3d55', 0.6);
    const x0 = 26; let y = 40;
    if (pm.tab === 0) {
      const m = D.missions[S.mission];
      if (m) {
        text(ctx, m.title, x0, y, '#f5c542', { scale: 2 }); y += 24;
        m.steps.forEach(s => { const done = G.stepDone(m, s); text(ctx, (done ? '[x] ' : '[ ] ') + s.t + (s.n && !done ? ' (' + (S.counts[m.id + ':' + s.id] || 0) + '/' + s.n + ')' : ''), x0, y, done ? '#5a8a6a' : '#ffffff'); y += 12; });
      } else { text(ctx, 'Act 1 complete', x0, y, '#f5c542', { scale: 2 }); y += 24; text(ctx, 'Free roam. Act 2 (Ash Dunes, Glowwild, the Crater) is the next build.', x0, y, '#ffffff'); y += 14; }
      y += 10; text(ctx, 'COMPLETED', x0, y, '#8a92b8'); y += 12;
      Object.keys(S.done).forEach(id => { text(ctx, id + '  ' + D.missions[id].title, x0, y, '#5a8a6a'); y += 10; });
    } else if (pm.tab === 1) {
      const kit = ['double_jump'].concat(hero.kit);
      kit.forEach((id, i) => {
        const a = D.abilities[id], has = G.has(id), on = i === pm.sel;
        text(ctx, (on ? '> ' : '  ') + (has ? a.name : '? ? ?'), x0, y + i * 12, has ? (on ? '#f5c542' : '#ffffff') : '#5a6078');
        if (has) text(ctx, a.input, x0 + 120, y + i * 12, hero.color);
      });
      const a = D.abilities[kit[pm.sel]], has = G.has(kit[pm.sel]);
      panel(ctx, 250, 40, 204, 70, hero.color, 0.5);
      text(ctx, has ? a.name : 'Locked memory', 258, 46, '#f5c542');
      SW.wrap(has ? a.desc + (a.cost ? ' Cost: ' + a.cost + ' ' + hero.energy + '.' : '') : 'Recover a Major Memory Shard to remember this.', 188).forEach((l, i) => text(ctx, l, 258, 60 + i * 10, '#ffffff'));
      text(ctx, 'BASICS', 250, 122, '#8a92b8');
      ['J x4 combo   W+J launcher   S+J sweep', 'K jump   L dash   S guard', 'S+L / W+L: slipstep escape (60)', 'Hold J+K: charge ' + hero.energy, 'O: awakening / assist   Q: heal item'].forEach((l, i) => text(ctx, l, 250, 134 + i * 11, '#c8ccd8'));
      if (SW.dev) text(ctx, 'F9 unlocks every ability (debug)', 250, 226, '#5a6078');
    } else if (pm.tab === 2) {
      // the shard line sits right-aligned in the panel (inner edge 456) so longer translations still fit beside the title
      const shards = 'Minor shards: ' + S.minor + ' / 60  (every 5: +3% dmg, +10% regen)';
      text(ctx, 'MEMORY JOURNAL', x0, y, '#f5c542'); text(ctx, shards, Math.max(x0 + SW.textW('MEMORY JOURNAL') + 10, 456 - SW.textW(shards)), y, '#b9a0ff'); y += 16;
      if (!S.memories.length) text(ctx, 'Nothing yet. Everything you were is scattered across this world.', x0, y, '#8a92b8');
      S.memories.forEach((id, i) => text(ctx, (i === pm.sel ? '> ' : '  ') + D.memories[id].title, x0, y + i * 12, i === pm.sel ? '#f5c542' : '#ffffff'));
      const mem = D.memories[S.memories[pm.sel]];
      if (mem) {
        // the picture gives up height when the memory's text needs it, so the text always ends inside the panel (it used to
        // run off the bottom for the longer memories)
        const rows = [].concat.apply([], mem.lines.map(l => SW.wrap(G.txt(l), 250))), top = Math.min(174, Math.max(110, 236 - rows.length * 10)), ih = top - 63;
        const im = art.bg[mem.img];
        if (im && ih > 20) { ctx.drawImage(im, 0, 30 + Math.round((210 - ih * 480 / 254) / 2), 480, Math.round(ih * 480 / 254), 200, 56, 254, ih); art.rect(ctx, '#05060c', 200, 56, 254, 1); }
        let yy = top; rows.forEach(r => { text(ctx, r, 200, yy, '#e8ecf4'); yy += 10; });
      }
    } else if (pm.tab === 3) {
      const need = G.xpNeed();
      text(ctx, (G.flag('name_known') ? hero.name : hero.alias) + '   LEVEL ' + S.level, x0, y, '#f5c542', { scale: 2 }); y += 24;
      text(ctx, 'XP ' + S.xp + ' / ' + need, x0, y, '#ffffff'); bar(ctx, x0 + 90, y + 1, 120, 4, S.xp / need, '#22d3ee'); y += 14;
      text(ctx, 'HP ' + Math.ceil(S.hp) + ' / ' + p.hpMax() + '     Creds ' + S.creds + '     ' + hero.item + ' x' + S.items, x0, y, '#ffffff'); y += 18;
      text(ctx, 'STAT POINTS: ' + S.points, x0, y, S.points ? '#7dffa0' : '#8a92b8'); y += 14;
      [['Power', 'power', '+6% damage per point'], ['Energy', 'energy', '+15% charge and regen per point'], ['Speed', 'speed', '+ run speed per point']].forEach((r, i) => {
        text(ctx, (pm.sel === i ? '> ' : '  ') + r[0], x0, y, pm.sel === i ? '#f5c542' : '#ffffff'); text(ctx, String(S.stats[r[1]]), x0 + 70, y, '#22d3ee'); text(ctx, r[2], x0 + 96, y, '#8a92b8'); y += 12;
      });
      y += 8; text(ctx, (pm.sel === 3 ? '> ' : '  ') + 'Assist (O): ' + (S.assist ? '< ' + D.speakers[S.assist].name + ' >' : 'none yet'), x0, y, pm.sel === 3 ? '#f5c542' : '#ffffff');
      y += 22; text(ctx, 'J / Enter: spend a point', x0, y, '#5a6078');
    } else if (pm.tab === 4) {
      const A = SW.audio, rows = ['Resume', 'SFX volume    < ' + Math.round(A.vol.sfx * 10) + ' >', 'Music volume  < ' + Math.round(A.vol.music * 10) + ' >', 'Controls', 'Save and quit to title'];
      rows.forEach((r, i) => text(ctx, (i === pm.sel ? '> ' : '  ') + r, x0, y + i * 14, i === pm.sel ? '#f5c542' : '#ffffff'));
      text(ctx, 'The game also saves at save points and whenever you change zone.', x0, y + 90, '#8a92b8');
    }
    text(ctx, 'A / D: tabs    W / S: select    Esc: close', W / 2, 250, '#8a92b8', { align: 'center' });
  };

  // ---------- world map ----------
  ui.drawMap = function (ctx, G) {
    const S = G.state;
    ctx.globalAlpha = 0.93; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, 'WORLD MAP', W / 2, 8, '#ffffff', { align: 'center', scale: 2 });
    D.layers.forEach((l, i) => { const y = 34 + i * 70; ctx.globalAlpha = 0.14; art.rect(ctx, l.col, 8, y, W - 16, i === 2 ? 80 : 62); ctx.globalAlpha = 1; text(ctx, l.name, 12, y + 2, l.col); });
    const pos = {}; D.world.forEach(z => { pos[z.id] = z; });
    D.routes.forEach(r => {
      const a = pos[r[0]], b = pos[r[1]], named = !!r[2];
      const n = Math.max(2, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 4));
      for (let i = 0; i <= n; i++) if (!named || i % 2 === 0) art.rect(ctx, named ? '#8b5cf6' : '#3a3d55', a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n, named ? 2 : 1, named ? 2 : 1);
      if (named) text(ctx, r[2], (a.x + b.x) / 2 + 6, (a.y + b.y) / 2 - 4, '#b9a0ff');
    });
    D.world.forEach(z => {
      const here = S.zone === z.id, seen = S.visited[z.id], col = D.layers[z.layer].col, bw = 92, bh = 20;
      panel(ctx, z.x - bw / 2, z.y - bh / 2, bw, bh, here ? '#ffffff' : seen ? col : '#3a3d55', seen ? 0.95 : 0.8);
      text(ctx, seen ? z.name : z.soon ? z.name : '? ? ?', z.x, z.y - 8, seen ? '#ffffff' : '#5a6078', { align: 'center' });
      text(ctx, here ? 'YOU ARE HERE' : seen ? 'visited' : z.soon ? 'Act 2 / 3' : 'undiscovered', z.x, z.y + 1, here ? (SW.frame % 30 < 20 ? '#f5c542' : '#8a6a20') : '#5a6078', { align: 'center' });
    });
    text(ctx, 'M / Esc: close', W / 2, 256, '#8a92b8', { align: 'center' });
  };

  // ---------- shop ----------
  ui.shop = { sel: 0 };
  ui.shopUpdate = function (G) {
    const S = G.state;
    if (I.hit('up') || I.hit('down')) { ui.shop.sel = 1 - ui.shop.sel; SW.audio.sfx('move'); }
    if (I.hit('pause') || I.hit('jump') || (I.ok() && ui.shop.sel === 1)) { G.overlay = null; SW.audio.sfx('back'); return; }
    if (I.ok() && ui.shop.sel === 0) {
      if (S.creds >= 30 && S.items < 5) { S.creds -= 30; S.items++; SW.audio.sfx('coin'); } else SW.audio.sfx('deny');
    }
  };
  ui.drawShop = function (ctx, G) {
    const S = G.state, hero = G.hero();
    panel(ctx, 130, 70, 220, 110, '#b06cff');
    art.portrait(ctx, 'quill', 138, 78);
    text(ctx, "MADAME QUILL'S", 182, 80, '#b06cff'); text(ctx, 'Creds: ' + S.creds, 182, 92, '#f5c542'); text(ctx, 'Carrying: ' + S.items + ' / 5', 182, 102, '#ffffff');
    text(ctx, (ui.shop.sel === 0 ? '> ' : '  ') + hero.item + '   30 creds', 142, 126, ui.shop.sel === 0 ? '#f5c542' : '#ffffff');
    text(ctx, '    restores 40% HP (press Q)', 142, 137, '#8a92b8');
    text(ctx, (ui.shop.sel === 1 ? '> ' : '  ') + 'Leave', 142, 152, ui.shop.sel === 1 ? '#f5c542' : '#ffffff');
    text(ctx, 'Supplies are short down here. Come back often.', 142, 166, '#5a6078');   // it used to promise more stock in Act 2, which never came
  };

  // ---------- memory flashback ----------
  const mem = ui.mem = { id: null, i: 0, t: 0, phase: 0, cb: null };
  ui.memStart = function (G, id, cb) { Object.assign(mem, { id, i: 0, t: 0, phase: 0, cb }); G.overlay = 'memory'; SW.audio.sfx('shard'); SW.audio.music('memory'); };
  ui.memUpdate = function (G) {
    const m = D.memories[mem.id];
    mem.t++;
    if (mem.phase === 0) { if (mem.t > 50) { mem.phase = 1; mem.t = 0; } return; }
    if (I.ok() || I.hit('jump')) {
      const ln = mem.phase === 1 ? G.txt(m.lines[mem.i]) : '';
      if (mem.phase === 1 && mem.t < ln.length) { mem.t = ln.length + 1; return; }
      SW.audio.sfx('select');
      if (mem.phase === 1) { mem.i++; mem.t = 0; if (mem.i >= m.lines.length) { mem.phase = 2; SW.audio.sfx('level'); } }
      else { G.overlay = null; SW.audio.music(G.boss ? 'boss' : G.zone.music); const cb = mem.cb; mem.cb = null; if (cb) cb(); }
    }
  };
  ui.drawMem = function (ctx, G) {
    const m = D.memories[mem.id], im = art.bg[m.img], hero = G.hero();
    art.rect(ctx, '#05060c', 0, 0, W, H);
    const a = mem.phase === 0 ? SW.clamp(mem.t / 50, 0, 1) : 1;
    if (im) { ctx.globalAlpha = a; ctx.drawImage(im, 0, 0); ctx.globalAlpha = 1; }
    art.rect(ctx, '#05060c', 0, 0, W, 30); art.rect(ctx, '#05060c', 0, H - 64, W, 64);
    if (mem.phase === 0) { ctx.globalAlpha = 1 - a; art.rect(ctx, '#ffffff', 0, 0, W, H); ctx.globalAlpha = 1; return; }
    text(ctx, 'MEMORY', 12, 10, hero.color); text(ctx, m.title, 60, 10, '#ffffff');
    if (mem.phase === 1) {
      const ln = G.txt(m.lines[mem.i]); let left = Math.floor(mem.t), y = H - 52;
      SW.wrap(ln, 440).forEach(r => { if (left > 0) text(ctx, r.slice(0, left), W / 2 - SW.textW(r) / 2, y, '#ffffff'); left -= r.length + 1; y += 12; });
      if (mem.t > ln.length && SW.frame % 40 < 26) text(ctx, 'v', W - 16, H - 14, '#ffffff');
    } else {
      const ab = D.abilities[G.mapAbility(m.unlock)];
      text(ctx, 'MEMORY RECOVERED', W / 2, H - 56, hero.color, { align: 'center' });
      text(ctx, ab.name.toUpperCase(), W / 2, H - 44, '#ffffff', { align: 'center', scale: 2 });
      text(ctx, ab.input + '  -  ' + ab.desc, W / 2, H - 22, '#e8ecf4', { align: 'center' });
    }
  };

  // ---------- end-of-build card ----------
  ui.drawCard = function (ctx, G) {
    ctx.globalAlpha = 0.9; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    const hero = G.hero();
    panel(ctx, 60, 44, 360, 180, hero.color);
    text(ctx, 'ACT 1 COMPLETE', W / 2, 56, '#f5c542', { align: 'center', scale: 2 });
    ['You have reached Scrapton, on the Surface.', '', 'This is the end of the first playable build:', 'both Act 1 campaigns, 7 of the 12 zones, 4 bosses.', '',
      'Still to do here: the Pit Arena, hidden Memory Shards,', 'cracked walls to smash with your new special,', 'and the other hero\'s story from the title screen.', '',
      'Next build: Act 2 - Ash Dunes, the Glowwild, the Crater.'].forEach((l, i) => text(ctx, l, W / 2, 84 + i * 11, '#ffffff', { align: 'center' }));
    if (SW.frame % 40 < 26) text(ctx, 'J / Enter: keep exploring', W / 2, 206, '#8a92b8', { align: 'center' });
  };
})();
