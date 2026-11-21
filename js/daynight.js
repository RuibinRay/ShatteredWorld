'use strict';
// Shattered Worlds — day/night and radiation. Only wraps; nothing in the shared files is edited.
//   Design document: "Day/night cycle: 20 real minutes per day. Husks spawn only at night." and "Radiation (Glowwild, Crater):
//   a meter fills while you're outside the filter's protection. At full, HP drains 2% per second. The rad filter mod slows
//   it; [the awakening] makes you immune for 10 s."
//
//   CLOCK  A day is 20 minutes of play (dialogue, menus and cutscenes stop it). A new story starts at 08:00; the time is
//          kept in the save. Night is 20:00 to 05:00, with dusk and dawn either side. The HUD shows the time.
//   NIGHT  Outdoors (Scrapton, the Ash Dunes, the Glowwild, the Crater and Aurelia's open decks) the screen darkens, and every
//          lamp, fire and glow lights its own pool. In the wastes (the Ash Dunes, the Glowwild, the Crater, and Rust Flats
//          outside the town once Act 2 has begun) Husks claw out of the ground near you, two at a time at most, never in a
//          story fight, a boss or by a save point. They crumble at dawn.
//   RADIATION  In the Glowwild and the Crater a meter fills: full after 100 s with the caravan filter mask, 200 s with the
//          Rad Filter mod. At full, HP drains 2% of max per second (it never takes the last point: something else has to).
//          Standing at a save point (the filter stations) clears it; so does leaving. Awakening gives 10 s of immunity.
//          The meter stands still during boss fights, so the bosses keep the balance they were measured at.
(function () {
  const SW = window.SW, G = SW.game, E = SW.data.enemies, ui = SW.ui, art = SW.art, fx = SW.fx, text = SW.text, P = SW.Player.prototype, T = 16;
  const inStory = () => G.scene === 'play' && !!G.state;
  const DAY = 72000, START = DAY * 8 / 24;   // 20 minutes at 60 frames a second; new stories wake at 08:00
  const ensure = S => { if (S && typeof S.clock !== 'number') S.clock = START; if (S && typeof S.rad !== 'number') S.rad = 0; return S; };

  // ================= the clock =================
  const hour = () => ((ensure(G.state).clock % DAY) / DAY) * 24;
  const isNight = (h = hour()) => h >= 20 || h < 5;
  const dark = (h = hour()) => (h >= 20 || h < 5 ? 1 : h >= 18 ? (h - 18) / 2 : h < 7 ? 1 - (h - 5) / 2 : 0);
  const warm = (h = hour()) => Math.max(0, 1 - Math.abs(h - 6) / 1.2, 1 - Math.abs(h - 19) / 1.2);
  const clockText = () => { const m = Math.floor(hour() * 60); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  const OUTDOOR = { scrapton: 1, dunes: 1, glowwild: 1, crater: 1, skylift: 1, skyport: 1, noble: 1 };
  const WASTES = { dunes: 1, glowwild: 1, crater: 1, scrapton: 1 };
  const TOWN = { scrapton: [80, 136] };   // tile columns where nothing rises
  const RAD = { glowwild: 1, crater: 1 };
  // frames for the meter to fill with the caravan mask. Measured: walking camp to relay in the Glowwild takes 17 s and
  // the Crater rim to its save point 14 s; with the fights on the way a normal crossing is about 75-80 s. At 75 s to full
  // everyone fell sick on the way; at 100 s a normal crossing ends near 80% and only lingering costs health.
  const FILL = 6000;
  const H = { night: null, huskT: 0, zone: null, imm: 0 };
  const has = id => !!(SW.mods && SW.mods.has(id));

  // ================= night Husks =================
  function groundNear(z, x) {
    const p = G.player, tx = Math.floor(x / T); let best = null;
    if (tx < 3 || tx > z.w - 4) return null;
    for (let ty = 2; ty < z.h; ty++) {
      const c = z.tile(tx, ty);
      if (c === '#' && z.tile(tx, ty - 1) === ' ' && z.tile(tx, ty - 2) === ' ' && z.tile(tx - 1, ty) === '#' && z.tile(tx + 1, ty) === '#') { const y = ty * T; if (best === null || Math.abs(y - p.y) < Math.abs(best - p.y)) best = y; }
    }
    if (best === null || Math.abs(best - p.y) > 64 || z.hit(x - 6, best - 30, 12, 28)) return null;
    return best;
  }
  const arenaLive = z => z.ents.some(e => e instanceof SW.Arena && (e.state === 1 || e.state === 2));
  const nearSave = (z, x, r) => z.ents.some(e => e.prompt === 'Rest & Save' && Math.abs(e.x - x) < r);
  function riseHusk(z) {
    const p = G.player, town = TOWN[z.id];
    for (let k = 0; k < 6; k++) {
      const x = p.x + (Math.random() < 0.5 ? -1 : 1) * SW.rand(130, 210), y = groundNear(z, x);
      if (y === null || nearSave(z, x, 120) || (town && x / T > town[0] && x / T < town[1])) continue;
      const e = SW.spawnEnemy(z.id === 'crater' && E.glasshusk ? 'glasshusk' : 'husk', x, y);
      e.nightHusk = true; e.state = 'chase'; e.home = p.x; e.face = p.x < x ? -1 : 1; e.stun = 40;   // a moment to claw free
      z.add(e); fx.dust(x, y, 10); fx.ring(x, y - 10, '#b9a0ff', 3, 24, 16); SW.audio.sfx('roar');
      return true;
    }
    return false;
  }
  function tickNight(g, z) {
    const n = isNight();
    if (H.night !== null && n !== H.night && OUTDOOR[z.id]) g.toast(n ? 'Night falls.' + (WASTES[z.id] ? ' Husks rise in the wastes.' : '') : 'Dawn.', n ? '#b9a0ff' : '#ffd08a');
    H.night = n;
    const husks = z.ents.filter(e => e.nightHusk && !e.dead);
    if (!n) { husks.forEach(e => { e.gone = true; fx.dust(e.x, e.y, 8); }); return; }
    if (!WASTES[z.id] || (z.id === 'scrapton' && !(g.state.done || {})['A2-1'])) return;
    if (g.busy() || g.player.dead || arenaLive(z) || (g.boss && !g.boss.dead) || nearSave(z, g.player.x, 120)) return;
    if (z.ents.some(e => e.ledgerTest && !e.dead)) return;   // not during the Ember Ledger's test fight (ledger.js)
    if (++H.huskT < 1500 || husks.length >= 2) return;
    if (riseHusk(z)) H.huskT = 0;
  }

  // ================= radiation =================
  function tickRad(g, z) {
    const S = g.state, p = g.player;
    if (!RAD[z.id]) { S.rad = Math.max(0, S.rad - 0.5); return; }
    if (H.imm > 0) H.imm--;
    if (nearSave(z, p.x, 80)) { S.rad = Math.max(0, S.rad - 1); return; }
    if ((g.boss && !g.boss.dead) || p.dead) return;
    if (S.rad < 100) {
      if (H.imm <= 0) {
        const was = S.rad; S.rad = Math.min(100, S.rad + (100 / FILL) * (has('rad_filter') ? 0.5 : 1) * (has('lead_lining') ? 0.75 : 1));
        if (was < 100 && S.rad >= 100 && !g.flag('rad_full_seen')) { g.setFlag('rad_full_seen'); g.toast('Radiation sickness! Get to a save point: the filter stations clear it.', '#b8ff40'); }
      }
    } else if (H.imm <= 0 && S.hp > 1) {
      S.hp = Math.max(1, S.hp - p.hpMax() * (has('lead_lining') ? 0.01 : 0.02) / 60);
      if (SW.frame % 40 === 0) fx.text(p.x, p.y - 44, 'RAD', '#b8ff40');
    }
  }

  // ---- every frame of play, with the player ----
  const _up = P.update; P.update = function (g, z) {
    const r = _up.call(this, g, z);
    if (this !== g.player || !inStory() || this.hideT > 0) return r;
    const S = ensure(g.state);
    S.clock = (S.clock + 1) % (DAY * 1000);
    if (H.zone !== z) {
      H.zone = z; H.huskT = 1200;   // the first one comes 5 s after you arrive in the dark
      if (RAD[z.id] && !g.state.saga && !g.flag('rad_seen')) { g.setFlag('rad_seen'); g.toast('Radiation builds out here. Save points are filter stations: stand at one to clear it.', '#b8ff40'); }
    }
    if (!g.state.saga) { tickNight(g, z); tickRad(g, z); }   // (The Hollow Crown never explains either: no radiation and no night Husks in its chapters - the playtest)
    else { g.state.rad = 0; z.ents.forEach(e => { if (e.nightHusk && !e.dead) e.gone = true; }); }
    return r;
  };
  // Night Eyes (black-market gear, ledger.js): more damage in the dark
  const _dm = P.dmgMul; P.dmgMul = function () { const v = _dm.apply(this, arguments); return inStory() && has('night_eyes') && isNight() ? v * 1.15 : v; };
  const _aw = P.useAwaken; P.useAwaken = function () {
    const was = this.awakeT; _aw.apply(this, arguments);
    if (was <= 0 && this.awakeT > 0 && inStory() && G.zone && RAD[G.zone.id]) { H.imm = 600; G.toast('Awakened: immune to radiation for 10 s', '#b8ff40'); }
  };

  // ================= drawing =================
  let off = null;
  function nightLayer(ctx, g) {
    const z = g.zone, d = dark(), w = warm();
    if (!z || !OUTDOOR[z.id] || (d <= 0 && w <= 0)) return;
    const W = SW.W, Hh = SW.H, cx = Math.round(g.cam.x), cy = Math.round(g.cam.y);
    if (w > 0) { ctx.globalAlpha = 0.16 * w; art.rect(ctx, '#ff8a4a', 0, 0, W, Hh); ctx.globalAlpha = 1; }
    if (d <= 0) return;
    if (!off) off = SW.canvas(W, Hh);
    const [oc, o] = off;
    o.globalCompositeOperation = 'source-over'; o.clearRect(0, 0, W, Hh); o.fillStyle = '#060a22'; o.fillRect(0, 0, W, Hh);
    o.globalCompositeOperation = 'destination-out';
    const light = (x, y, r, a) => { if (x < -r || x > W + r || y < -r || y > Hh + r) return; const gr = o.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,' + a + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = gr; o.fillRect(x - r, y - r, r * 2, r * 2); };
    for (const dc of z.decor) if (dc.glow) { const sz = art.propSize(dc.kind); light(dc.x - cx, dc.y - cy - (dc.gy !== undefined ? dc.gy : sz[1] - 5), (dc.gr || 22) * 2.6, 0.85); }
    for (const e of z.ents) {
      if (e.prompt === 'Rest & Save') light(e.x - cx, e.y - cy - 16, 64, 0.8);
      else if (e.glow && !e.gone) light(e.x - cx, e.y - cy - 10, 40, 0.6);
    }
    const p = g.player; if (p) light(p.x - cx, p.y - cy - 18, 78, 0.7);
    ctx.globalAlpha = (has('night_eyes') ? 0.32 : 0.6) * d; ctx.drawImage(oc, 0, 0); ctx.globalAlpha = 1;
    // the game wrote YOU FELL before the HUD; write it again over the dark (same place, same look)
    if (p && p.dead && p.deadT > 30) text(ctx, 'YOU FELL', W / 2, 110, '#ff5a5a', { align: 'center', scale: 3 });
  }
  // a new or continued story starts fresh: no area change to count, no Husk timer carried over
  const reset = () => { H.zone = null; H.night = null; H.huskT = 0; H.imm = 0; };
  const _ng = G.newGame; G.newGame = function () { reset(); return _ng.apply(this, arguments); };
  const _cg = G.continueGame; G.continueGame = function () { reset(); return _cg.apply(this, arguments); };
  // coming back from a fall: you wake breathing clean air (playtest: respawning in the Glowwild at full radiation
  // started the drain again the moment you stood up)
  const _rs = G.respawn; G.respawn = function () { if (G.state) G.state.rad = 0; H.imm = 0; return _rs.apply(this, arguments); };
  const heatShown = g => !!(SW.heat && SW.heat.heatOn() && (SW.heat.heatHere() || (g.state.heat || 0) > 0));
  function sun(ctx, x, y, night) {
    if (night) { art.rect(ctx, '#e8ecff', x + 1, y, 4, 7); art.rect(ctx, '#e8ecff', x, y + 1, 1, 5); art.rect(ctx, '#0e1024', x + 3, y + 1, 3, 5); }
    else { art.rect(ctx, '#f5c542', x + 1, y + 1, 5, 5); art.rect(ctx, '#f5c542', x + 3, y - 1, 1, 9); art.rect(ctx, '#f5c542', x - 1, y + 3, 9, 1); art.rect(ctx, '#fff3c0', x + 2, y + 2, 2, 2); }
  }
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    if (inStory()) { ensure(g.state); nightLayer(ctx, g); }
    _hud(ctx, g);
    if (!inStory() || !g.zone) return;
    const S = g.state, p = g.player;
    let x = heatShown(g) ? 248 : 168;
    if (!S.saga && (RAD[g.zone.id] || S.rad > 0)) {   // (no meter in The Hollow Crown: it has no radiation)
      const f = S.rad / 100, full = S.rad >= 100, col = full ? (SW.frame % 30 < 18 ? '#ff5a5a' : '#ffffff') : f > 0.7 ? '#ffd24a' : '#b8ff40';
      ui.panel(ctx, x, 4, 76, 14, null, 0.5);
      text(ctx, 'RAD', x + 4, 7, full ? '#ff5a5a' : '#c8ccd8');
      art.rect(ctx, '#1c2a14', x + 24, 8, 46, 5); art.rect(ctx, col, x + 24, 8, Math.round(46 * f), 5);
      const tag = H.imm > 0 && RAD[g.zone.id] ? 'IMMUNE ' + Math.ceil(H.imm / 60) : p && RAD[g.zone.id] && nearSave(g.zone, p.x, 80) && S.rad > 0 ? 'FILTERING' : '';
      if (tag) text(ctx, tag, x + 4, 21, '#7dffa0');
      x += 80;
    }
    ui.panel(ctx, x, 4, 44, 14, null, 0.5);
    sun(ctx, x + 4, 7, isNight());
    text(ctx, clockText(), x + 14, 7, isNight() ? '#b9c4ff' : '#ffffff');
  };

  SW.daynight = { H, hour, isNight, dark, clockText, DAY, ensure, setHour: h => { ensure(G.state).clock = Math.round(((h % 24) / 24) * DAY); } };
})();
