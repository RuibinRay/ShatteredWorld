// Test harness: load this in the browser console (or via <script>) to drive the game frame by frame.
//   T.boot('kael')        start a fresh game as a hero, skipping menus
//   T.hold(['right'])     hold inputs;  T.step(60) advance 60 frames;  T.press('attack')
//   T.skip()              fast-forward dialogue and memory cutscenes
//   T.walk(tx)            run toward a tile column, jumping when blocked;  T.info() state summary
(function () {
  const SW = window.SW, G = SW.game;
  G.manual = true;
  const T = window.T = {
    hold(keys) { SW.input.down = {}; (keys || []).forEach(k => { SW.input.down[k] = true; }); },
    step(n) { for (let i = 0; i < (n || 1); i++) G.tick(); G.render(); },
    press(k, n) { SW.input.down[k] = true; this.step(n || 2); SW.input.down[k] = false; this.step(1); },
    skip(max) { let n = 0; while ((SW.ui.dlg.active || G.overlay === 'memory' || G.overlay === 'card') && n++ < (max || 400)) { this.press('confirm', 1); this.step(3); } return n; },
    boot(hero) { try { localStorage.clear(); } catch (e) { /* ignore */ } G.newGame(hero); this.step(30); this.skip(); this.step(10); return this.info(); },
    info() {
      const p = G.player, s = G.state, st = s && G.currentStep();
      return JSON.stringify({ scene: G.scene, ov: G.overlay, dlg: SW.ui.dlg.active, zone: s && s.zone, tx: p && +(p.x / 16).toFixed(1), ty: p && +(p.y / 16).toFixed(1), st: p && p.state, gr: p && p.onGround,
        hp: s && Math.round(s.hp), en: s && Math.round(s.energy), lvl: s && s.level, creds: s && s.creds, mission: s && s.mission, step: st && st.id, abil: s && Object.keys(s.abilities), foes: G.zone ? G.zone.ents.filter(e => e.team === 'enemy' && !e.dead).length : 0,
        boss: G.boss ? Math.round(G.boss.hp) : null, toasts: G.toasts.map(t => t.text), err: G.lastError });
    },
    // run toward tile column tx; hop when a wall blocks, optionally auto-fight
    walk(tx, o) {
      o = o || {};
      const max = o.max || 1500;
      let stuck = 0, lastX = -1;
      for (let i = 0; i < max; i++) {
        const p = G.player;
        if (SW.ui.dlg.active || G.overlay) { this.hold([]); this.skip(); continue; }
        if (p.dead) { this.hold([]); this.step(1); continue; }
        const dir = p.x < tx * 16 + 8 ? 'right' : 'left';
        if (Math.abs(p.x - (tx * 16 + 8)) < 6) break;
        const keys = [dir];
        if (Math.abs(p.x - lastX) < 0.2) stuck++; else stuck = 0;
        lastX = p.x;
        if ((stuck > 2 || o.hop) && (i % 40) < 14) keys.push('jump');
        if (o.fight && i % 12 < 2) keys.push('attack');
        this.hold(keys); this.step(1);
      }
      this.hold([]); this.step(1);
      return this.info();
    },
    // force a fresh compositor frame (needed for screenshots when the tab is in the background)
    paint() { const c = G.canvas; this._k = !this._k; c.style.opacity = this._k ? '0.999' : '1'; c.style.transform = this._k ? 'translateZ(0)' : 'none'; G.render(); return new Promise(r => setTimeout(r, 200)); },
    // save the current frame as a PNG through the test server (POST /__shot/<name>); crop = [x, y, w, h] in game pixels
    async shot(name, scale, crop) {
      G.render();
      const s = scale || 2, r = crop || [0, 0, 480, 270], c = document.createElement('canvas');
      c.width = r[2] * s; c.height = r[3] * s;
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(G.canvas, r[0], r[1], r[2], r[3], 0, 0, c.width, c.height);
      const blob = await new Promise(res => c.toBlob(res, 'image/png'));
      const resp = await fetch('/__shot/' + name, { method: 'POST', body: blob });
      return resp.status;
    },
    // simple fighting bot: walk at the nearest enemy and mash a button; returns damage taken and time
    fight(frames, opt) {
      opt = opt || {};
      const hp0 = G.state.hp, log = {};
      let i = 0;
      for (; i < frames; i++) {
        const p = G.player;
        if (SW.ui.dlg.active || G.overlay) { this.hold([]); this.skip(); continue; }
        const foes = G.zone.ents.filter(e => e.team === 'enemy' && !e.dead && (!opt.reach || (Math.abs(e.x - p.x) < opt.reach && (e.isBoss || Math.abs(e.y - p.y) < 70))) && (!opt.arena || !G.boss || (e.x > G.boss.ax0 - 20 && e.x < G.boss.ax1 + 20)));
        if (opt.arena && (!G.boss || G.boss.dead) && !foes.length) break;
        if (!foes.length || p.dead) break;
        foes.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
        const f = foes[0], dx = f.x - p.x, keys = [];
        const threat = e => e.tele > 0 || (e.state === 'windup' && e.st > (e.def.windup || 24) - 16) || e.state === 'leap' || e.state === 'charge' || (e.state === 'strike' && e.st < 7);
        const danger = foes.some(e => Math.abs(e.x - p.x) < (e.isBoss ? 130 : 64) && threat(e));
        // "smart" boss play: guard what can be blocked, slipstep through what cannot, heal when low
        const S = G.state, bs = opt.smart ? foes.find(e => e.isBoss) : null;
        let handled = false;
        if (bs) {
          const unb = /Charge|Lunge|Thrust/.test(bs.last ? bs.last.name : ''), bdx = bs.x - p.x;
          if (S.hp < p.hpMax() * 0.45 && i % 40 === 0) { if (S.items > 0) keys.push('item'); else if (S.assist === 'tamsin' && p.assistCd <= 0) keys.push('awaken'); }
          if (bs.gen && unb && bs.tele > 0) { keys.push('down'); if (bs.tele <= 6 && S.energy >= 60) keys.push('dash'); handled = true; }
          else if (bs.gen && unb && Math.abs(bdx) < 110) { keys.push(bdx > 0 ? 'left' : 'right'); if (i % 16 < 8) keys.push('jump'); handled = true; }
          else if (bs.gen && (bs.tele > 0 || bs.beam || bs.aim || threat(bs)) && p.onGround) { keys.push('down'); handled = true; }
        }
        if (handled) { /* defensive frame */ }
        else if (opt.guard && danger && p.onGround && !f.isBoss) keys.push('down');
        else if (opt.dodge && danger && Math.abs(dx) < 130) { keys.push(dx > 0 ? 'left' : 'right'); if (i % 30 < 3) keys.push('dash'); if (opt.jump && i % 30 > 10 && i % 30 < 24) keys.push('jump'); }
        else {
          if (Math.abs(dx) > (opt.range || 26)) keys.push(dx > 0 ? 'right' : 'left'); else if ((dx > 0 ? 1 : -1) !== p.face) keys.push(dx > 0 ? 'right' : 'left');
          const above = f.y < p.y - 24, ph = i % 40;
          if (above && ph < 10) keys.push('jump');                      // hop first (J + K together would charge)
          else if (i % 7 < 2) keys.push(opt.key && i % (opt.every || 40) < 8 ? opt.key : 'attack');
        }
        this.hold(keys); G.tick();
      }
      this.hold([]); G.render();
      log.frames = i; log.dmgTaken = Math.round(hp0 - G.state.hp); log.dead = G.player.dead; log.left = G.zone.ents.filter(e => e.team === 'enemy' && !e.dead).length; log.boss = G.boss ? Math.round(G.boss.hp) : null;
      return log;
    },
    zoom(s, cx, cy) { const c = G.canvas; c.style.position = 'fixed'; c.style.width = 480 * s + 'px'; c.style.height = 270 * s + 'px'; c.style.left = Math.round(innerWidth / 2 - cx * s) + 'px'; c.style.top = Math.round(innerHeight / 2 - cy * s) + 'px'; },
    pz(s) { const p = G.player; this.zoom(s || 4, p.x - G.cam.x, p.y - G.cam.y - 30); },
    unzoom() { const c = G.canvas, s = Math.max(1, Math.floor(Math.min(innerWidth / 480, innerHeight / 270))); c.style.position = ''; c.style.left = ''; c.style.top = ''; c.style.width = 480 * s + 'px'; c.style.height = 270 * s + 'px'; },
    // run a list of [keys, frames] and return the trace of positions
    seq(list) { const out = []; for (const [keys, n] of list) { this.hold(keys); for (let i = 0; i < n; i++) { G.tick(); } const p = G.player; out.push([+(p.x / 16).toFixed(2), +(p.y / 16).toFixed(2), p.state]); } this.hold([]); G.render(); return out; },
    // ----- balance benchmarks: run an encounter with a bot several times and average the outcome -----
    prep(hero, lvl, abil) {
      this.boot(hero);
      const S = G.state;
      (abil || []).forEach(a => G.unlock(a, true));
      S.level = lvl; S.hp = G.player.hpMax(); S.energy = 200; S.items = 0; G.setFlag('name_known');
    },
    encounters: {
      thugs:   { hero: 'kael', lvl: 1, abil: [], zone: 'slums', at: [86, 19], walk: 'right' },
      pit:     { hero: 'kael', lvl: 3, abil: ['spark_dart', 'double_jump'], zone: 'pit', pit: true },
      ferals:  { hero: 'kael', lvl: 4, abil: ['spark_dart', 'double_jump', 'thunder_totem'], zone: 'metro', spots: [[73, 27], [95, 29]] },
      bandits: { hero: 'kael', lvl: 6, abil: ['spark_dart', 'double_jump', 'thunder_totem', 'breaker_rush'], zone: 'scrapton', spots: [[46, 18], [62, 19], [134, 19]] },
      drones:  { hero: 'nyra', lvl: 1, abil: [], zone: 'medlab', at: [66, 19], walk: 'right' },
      guards:  { hero: 'nyra', lvl: 3, abil: ['pulse_burst', 'double_jump'], zone: 'medlab', spots: [[215, 19], [230, 19]] },
      tusk:    { hero: 'kael', lvl: 2, abil: ['spark_dart', 'double_jump'], zone: 'slums', at: [186, 19], walk: 'right', boss: true },
      warden:  { hero: 'nyra', lvl: 2, abil: ['pulse_burst', 'double_jump'], zone: 'medlab', at: [176, 19], walk: 'right', boss: true },
      grist:   { hero: 'kael', lvl: 5, abil: ['spark_dart', 'double_jump', 'thunder_totem'], zone: 'metro', at: [166, 29], walk: 'right', boss: true },
      brandt:  { hero: 'nyra', lvl: 4, abil: ['pulse_burst', 'double_jump', 'winterline'], zone: 'skyport', at: [50, 19], walk: 'right', boss: true }
    },
    trial(name, bot) {
      const E = this.encounters[name];
      this.prep(E.hero, E.lvl, E.abil);
      if (G.state.zone !== E.zone) this.warp(E.zone);
      G.state.hp = G.player.hpMax(); G.lastError = null;
      const hp0 = G.state.hp, opt = bot === 'careful' ? (E.boss ? { smart: true } : { guard: true }) : {};
      if (E.boss) { G.state.items = 2; if (name === 'grist') G.addAssist('tamsin'); }
      let frames = 0, dead = false;
      const run = (max, stop) => { const r = this.fight(max, opt); frames += r.frames; dead = dead || r.dead; return r; };
      if (E.pit) {
        G.pit = { wave: 0, t: 5, foes: [], state: 'rest' };
        for (let k = 0; k < 40 && G.pit && !dead; k++) { this.hold([]); this.step(20); frames += 20; if (G.pit && G.pit.state === 'fight') run(3000); if (G.player.dead) dead = true; }
      } else if (E.spots) {
        opt.reach = 190;
        for (const sp of E.spots) { if (dead) break; this.tp(sp[0], sp[1]); this.step(20); run(1800); if (G.player.dead) dead = true; }
      } else {
        this.tp(E.at[0], E.at[1]); this.hold([E.walk]); this.step(60); this.hold([]); this.skip();
        if (E.boss) { opt.reach = 470; opt.arena = true; run(9000); } else { opt.reach = 340; run(4000); }
      }
      const left = E.boss && G.boss ? Math.max(0, Math.round(100 * G.boss.hp / G.boss.hpMax)) : 0;
      return { frames, lost: Math.round(100 * (hp0 - Math.max(0, G.state.hp)) / hp0), dead: dead || G.player.dead, bossLeft: left, err: G.lastError };
    },
    bench(names, n) {
      const out = {};
      (names || Object.keys(this.encounters)).forEach(name => {
        ['mash', 'careful'].forEach(bot => {
          let fr = 0, lost = 0, deaths = 0, bl = 0, err = null;
          for (let i = 0; i < (n || 3); i++) { const r = this.trial(name, bot); fr += r.frames; lost += r.lost; deaths += r.dead ? 1 : 0; bl += r.bossLeft; err = err || r.err; }
          const k = n || 3;
          out[name + ':' + bot] = { sec: Math.round(fr / k / 60), lostPct: Math.round(lost / k), deaths: deaths + '/' + k, bossLeftPct: Math.round(bl / k), err };
        });
      });
      return out;
    },
    tp(tx, ty) { const p = G.player; p.x = tx * 16 + 8; p.y = (ty + 1) * 16; p.vx = p.vy = 0; p.safeX = p.x; p.safeY = p.y; this.step(2); return this.info(); },
    god(on) { G.player.takeHit = on === false ? SW.Player.prototype.takeHit : () => 'none'; },
    killAll() { G.zone.ents.forEach(e => { if (e.team === 'enemy' && !e.dead) { e.hp = 0; e.die(G); } }); this.step(5); },
    warp(zone, spawn) { G.gotoZone(zone, spawn); this.step(40); this.skip(); return this.info(); }
  };
})();
