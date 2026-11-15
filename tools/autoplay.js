'use strict';
// Shattered Worlds — autoplay: a bot that plays the story in real time with real inputs and real fights (nothing is
// resolved instantly), records the screen, and logs where it struggles. Not loaded by the game.
//   Serve the game with tools/record-server.ps1 (port 8793: its own origin, so the player's saves at :8765 are never
//   touched), open it, then in the console:
//     for (const f of ['tools/harness.js', 'tools/story-test.js', 'tools/autoplay.js']) await new Promise(r => { const s = document.createElement('script'); s.src = f; s.onload = r; document.head.appendChild(s); });
//     AP.series(['kael', 'nyra', 'brakk', 'vesper'])   -> one video + one log per hero in ../recordings
//   The tab must stay visible while it plays (browsers slow hidden tabs down).
//   The log: every fight (foes, damage taken as % of max HP, seconds, deaths), every boss, every spot where the bot made
//   no progress for 6 s (and where it needed a nudge after 20 s), and damage from hazards (spikes, falls, liquid).
//   It plays more like a person than the first version: double jumps (press, let go, press), jumps gaps earlier the
//   faster it runs, keeps out of pools in a fight, throws its energy attack at Husks from range, leaves foes it cannot
//   reach or hurt, goes back for the last foe of a wave and for glowing consoles it has seen light up, walks back to
//   people when stuck (and talks to them again after a defeat), never nudges past a closed gate, and stops a rival duel
//   after three lost rounds (the duel is measured with its own test players).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, ui = SW.ui, T = window.T, P = SW.Player.prototype;
  const AP = window.AP = { running: false, log: null };
  const now = () => G.state;
  const isFoe = e => e.team === 'enemy' && !e.dead && e.hittable !== false && !e.dormant;
  const hpMax = () => G.player.hpMax();
  // the next frame: requestAnimationFrame while the tab is visible; when it is hidden (browsers stop animation frames in
  // hidden tabs, which stalled a whole recording once) a message-channel loop keeps it going; pacing is by the clock
  const mc = new MessageChannel(); let mcFn = null; mc.port1.onmessage = () => { const f = mcFn; mcFn = null; if (f) f(); };
  const nextFrame = f => { if (document.hidden) { mcFn = f; mc.port2.postMessage(0); } else requestAnimationFrame(f); };
  // a page that is frozen between calls (a hidden pane) can be driven by hand: AP.pump(ms) runs the queued loop for ms
  AP.pump = function (ms) { const t0 = performance.now(); let n = 0; while (performance.now() - t0 < (ms || 30000) && mcFn) { const f = mcFn; mcFn = null; f(); n++; } return n; };

  // ---- damage accounting (only while the bot runs) ----
  let dmgSink = null;
  const _th = P.takeHit; P.takeHit = function (atk, g) {
    const before = g.state.hp, r = _th.apply(this, arguments);
    if (AP.running && this === g.player && g.state.hp < before && dmgSink) dmgSink('hit', before - g.state.hp, atk);
    return r;
  };
  const _hz = P.hazard; P.hazard = function (g) {
    const before = g.state.hp, r = _hz.apply(this, arguments);
    if (AP.running && this === g.player && g.state.hp < before && dmgSink) dmgSink('hazard', before - g.state.hp);
    return r;
  };

  // ---- walking helpers ----
  // prompts the bot leaves alone: shops, job boards, hiding spots, ways back down or out, waiting
  const EXCL = /Shop|jobs|vent|down|Leave|Ride the Skylift|ember|Wait/;
  const JUMP = 28;  // frames of one jump input: 12 held, 4 released, 12 held (the double jump needs a fresh press)
  const solidAt = (z, x, y) => { const c = z.tile(x, y); return c === '#' || c === '=' || (c === 'H' && z.tile(x, y - 1) !== 'H'); };
  // a pool here: the first tile at or under the feet that is not air is liquid
  const wetAt = (z, x, fy) => { for (let y = fy - 1; y < z.h; y++) { const c = z.tile(x, y); if (c === '~') return true; if (c !== ' ') return false; } return false; };
  const pitAt = (z, x, fy) => { for (let y = fy; y < z.h; y++) if (solidAt(z, x, y)) return false; return true; };
  const closedGate =(z, x0, x1) => z.ents.some(e => e.rect && e.closed && e.x + e.w > Math.min(x0, x1) && e.x < Math.max(x0, x1));
  // the nearest open floor 1-12 tiles on in direction dir (two tiles of air over solid ground, not in a solid), with no
  // closed gate in between; null when there is none
  function freeSpot(z, tx, fy, dir) {
    const p = SW.game.player;
    for (let dx = 1; dx <= 12; dx++) {
      const x = tx + dx * dir;
      for (let dy = 0; dy <= 8; dy++) for (const y of dy ? [fy - dy, fy + dy] : [fy]) {
        if (y < 2 || y >= z.h) continue;
        if (!solidAt(z, x, y) || z.tile(x, y - 1) !== ' ' || z.tile(x, y - 2) !== ' ' || z.hit(x * 16 + 2, (y - 2) * 16, 12, 30)) continue;
        if (closedGate(z, p.x, x * 16 + 8)) return null;
        return [x, y - 1];
      }
    }
    return null;
  }

  // ---- the run ----
  AP.play = function (hero, o) {
    o = Object.assign({ minutes: 9, speed: 1, record: true }, o || {});
    return new Promise(done => {
      G.manual = true; G.lastError = null; AP.duelOut = false;
      G.newGame(hero); for (let i = 0; i < 20; i++) G.tick();
      if (o.setup) { o.setup(G, T); for (let i = 0; i < 10; i++) G.tick(); }
      const startZone = now().zone, h = G.hero(), legs = o.legs || (o.until ? [{ dir: 1, until: o.until }] : null);
      let leg = 0, dir = legs ? legs[0].dir : 1;
      const L = AP.log = { hero, name: h.name, segment: o.name || 'tutorial', startZone, fights: [], deaths: [], stuck: [], assists: [], hazards: {}, notes: [], frames: 0, result: 'timeout', levelStart: now().level };
      let enc = null, calm = 0, idle = 0, best = -1e9, jump = 0, used = new Set(), stuckLogged = new Set(), wasDead = false, dlgT = 0, ovT = 0, guardT = 0, skillCd = 60, slipCd = 0, itemCd = 0, note = 'starting', noteT = 0, stall = 0, lastHp = 0, hunt = null, huntEnd = 0, seek = null, seekEnd = 0, duelLost = 0, asked = null, edgeT = 0;
      const ignore = new WeakMap(), seen = new Set(), hpOf = new WeakMap(), busyOn = new WeakMap();
      const say = s => { note = s; noteT = 240; L.notes.push(Math.round(L.frames / 60) + 's ' + s); };
      dmgSink = (kind, n, atk) => {
        const pct = 100 * n / hpMax();
        if (kind === 'hazard') { const k = now().zone; L.hazards[k] = (L.hazards[k] || 0) + pct; return; }
        if (enc) enc.dmg += pct; else { const k = now().zone + ' (outside fights)'; L.hazards[k] = (L.hazards[k] || 0) + pct; }
      };
      // recording: the game canvas at 2x, plus a caption strip
      let rec = null;
      if (o.record && window.MediaRecorder) {
        const c = document.createElement('canvas'); c.width = 960; c.height = 600;
        const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
        const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
        const mr = new MediaRecorder(c.captureStream(30), { mimeType: mime, videoBitsPerSecond: 3500000 }), chunks = [];
        mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        mr.start(1000);
        rec = { c, x, mr, chunks };
      }
      const caption = () => {
        if (!rec) return;
        const x = rec.x, S = now(), z = G.zone;
        x.drawImage(G.canvas, 0, 0, 960, 540);
        x.fillStyle = '#05060c'; x.fillRect(0, 540, 960, 60);
        x.font = 'bold 18px monospace'; x.fillStyle = '#f5c542';
        const t = Math.floor(L.frames / 60);
        x.fillText('AUTOPLAY  ' + h.name.toUpperCase() + (o.title ? '  |  ' + o.title : '') + '  |  ' + (z ? z.name : '') + '  |  ' + String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0') + '  |  deaths ' + L.deaths.length + '  |  Lv ' + S.level, 12, 564);
        x.font = '16px monospace'; x.fillStyle = noteT > 0 ? '#ffffff' : '#8a92b8';
        x.fillText(enc ? 'FIGHT: ' + [...enc.types].join(', ') + '  -' + Math.round(enc.dmg) + '% HP so far' : note, 12, 588);
      };
      const finish = result => {
        AP.running = false; dmgSink = null; T.hold([]); L.result = result; L.seconds = Math.round(L.frames / 60); L.levelEnd = now().level; L.err = G.lastError;
        const base = o.name || 'autoplay-' + hero;
        const post = (name, body) => fetch('/__rec/' + name, { method: 'POST', body }).then(r => r.status).catch(() => 0);
        const end = () => post(base + '.json', JSON.stringify(L, null, 1)).then(() => done(L));
        if (!rec) return end();
        rec.mr.onstop = () => post(base + '.webm', new Blob(rec.chunks, { type: 'video/webm' })).then(end);
        setTimeout(() => rec.mr.stop(), 600);
      };
      const closeEnc = () => {
        if (!enc) return;
        enc.sec = Math.round((L.frames - enc.t0) / 60); enc.dmg = Math.round(enc.dmg); enc.types = [...enc.types];
        L.fights.push(enc);
        say((enc.boss ? 'BOSS ' + enc.boss : enc.types.join(', ')) + ': -' + enc.dmg + '% HP in ' + enc.sec + 's' + (enc.died ? ' (died)' : ''));
        enc = null;
      };

      // ---- one frame of decisions ----
      function decide() {
        const p = G.player, z = G.zone, S = now(), keys = [], i = L.frames;
        if (noteT > 0) noteT--;
        if (G.scene === 'vs') {
          const V = SW.versus; if (V.f && V.f[0]) V.f[0].bot = true;
          if (!enc) { enc = { zone: 'Versus duel', x: 0, t0: L.frames, dmg: 0, types: new Set(['rival duel']), boss: 'RIVAL DUEL', died: false }; }
          if (V.phase === 'ko' && V.winner === 1 && !enc.died) { enc.died = true; L.deaths.push({ zone: 'Crater duel', x: 0, foes: ['rival'], boss: 'RIVAL DUEL' }); duelLost++; say(duelLost < 3 ? 'lost the rival duel: retrying' : 'lost the rival duel 3 times: stopping'); }
          if (V.phase === 'fight') enc.died = false;
          // the bot fights the duel with the Versus AI, which is no measure of a person (the duel's own test players are,
          // ST.duelBench); after three losses the run stops here instead of losing for the rest of its time
          if (duelLost >= 3) { closeEnc(); AP.duelOut = true; return keys; }
          if (V.phase !== 'fight' && V.phase !== 'intro' && V.phase !== 'ko' && ++ovT > 90) { ovT = 0; return ['confirm']; }
          return keys;
        }
        if (enc && enc.zone === 'Versus duel') closeEnc();
        // a talk that never started (the hero slid out of reach as the key went down): that person is still to talk to
        if (asked && (ui.dlg.active || G.overlay)) asked = null;
        if (asked && L.frames - asked.t > 12) { if (asked.e.talk && !G.busy()) used.delete(asked.e); asked = null; }
        if (ui.dlg.active) {
          const ln = ui.dlg.lines[ui.dlg.i], full = ui.dlg.wrapped ? ui.dlg.wrapped.join('\n').length : 0;
          if (ui.dlg.chars < full) { dlgT = 0; return keys; }
          if (++dlgT > 55 + (ln && ln.choice ? 30 : 0)) { dlgT = 0; return ['confirm']; }
          return keys;
        }
        if (G.overlay) {
          if (++ovT > (G.overlay === 'card' ? 150 : G.overlay === 'memory' ? 70 : 20)) { ovT = 0; return [G.overlay === 'memory' || G.overlay === 'card' ? 'confirm' : 'pause']; }
          return keys;
        }
        if (!p) return keys;
        if (p.dead) {
          // after a defeat people can be talked to again (the Bookie restarts the Grand Melee); used to be never. Things
          // stay used, or the bot toured every cairn and milestone again after each fall
          if (!wasDead) { wasDead = true; [...used].forEach(e => { if (e.talk) used.delete(e); }); seek = hunt = null; const near = z.ents.filter(isFoe).filter(e => Math.abs(e.x - p.x) < 260).map(e => e.type); L.deaths.push({ zone: z.name, x: Math.round(p.x / 16), foes: near, boss: G.boss && !G.boss.dead ? G.boss.def.name : null }); if (enc) enc.died = true; say('DIED at ' + z.name + ' x' + Math.round(p.x / 16)); }
          return keys;
        }
        wasDead = false;
        // glowing consoles (not doors: a glowing doorway is usually a side area) the hero has seen light up (within a screen and a half), remembered through the fights that
        // often carry the bot well past them
        if (i % 10 === 0) z.ents.forEach(e => { if (e.glow && e.kind === 'console' && e.prompt && e.canInteract && Math.abs(e.x - p.x) < 360 && Math.abs(e.y - p.y) < 120 && !EXCL.test(e.prompt) && e.canInteract(G)) seen.add(e); });
        const foes =z.ents.filter(isFoe).filter(e => !(ignore.get(e) > L.frames) && Math.abs(e.x - p.x) < 230 && (e.isBoss || Math.abs(e.y - p.y) < 90));
        if (foes.length) {
          calm = 0; idle = 0;
          if (!enc) { enc = { zone: z.name, x: Math.round(p.x / 16), t0: L.frames, dmg: 0, types: new Set(), boss: null, died: false }; stall = 0; lastHp = 1e9; }
          foes.forEach(f => enc.types.add(f.def.name || f.type)); if (G.boss && !G.boss.dead) enc.boss = G.boss.def.name;
          return fight(foes, keys, i);
        }
        if (enc && ++calm > 90) closeEnc();
        // no progress, and a foe somewhere in this area: go and get it (a lift wave's last trooper stayed at the far end of
        // the platform while the bot waited at the shut gate; arenas and lifts only open once every foe is down)
        // out of reach: leave it a minute, and let the nudge come soon if the way on is still blocked
        if (hunt && L.frames > huntEnd && !hunt.dead) { ignore.set(hunt, L.frames + 3600); say('could not get to ' + hunt.def.name + ': leaving it'); idle = 1000; }
        if (hunt && (hunt.dead || L.frames > huntEnd)) hunt = null;
        if (!hunt && idle > 180 && idle < 1000) {
          const far = z.ents.filter(isFoe).filter(e => !(ignore.get(e) > L.frames) && Math.abs(e.y - p.y) < 400).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
          if (far) { hunt = far; huntEnd = L.frames + 1200; idle = 0; say('going back for ' + far.def.name + ' at x' + Math.round(far.x / 16)); }
        }
        if (hunt) return walkTo(hunt.x, keys, i);
        // still no progress: something behind may need using. A console that appears once its guards are down (the Noble
        // Ring's relays) or someone who stepped out after a fight (Vane at the Chancery) is often already behind the bot
        if (seek && L.frames > seekEnd && !used.has(seek)) { ignore.set(seek, L.frames + 3600); say('could not get to ' + (seek.prompt || seek.name) + ': leaving it'); idle = 1000; }
        if (seek && (used.has(seek) || !seek.canInteract(G) || L.frames > seekEnd)) seek = null;
        if (!seek && idle > 240 && idle < 1000) {
          const t = z.ents.filter(e => e.canInteract && !used.has(e) && !(ignore.get(e) > L.frames) && e.canInteract(G) && !EXCL.test(e.prompt || '') && e.name !== 'Citizen' && Math.abs(e.y - p.y) < 400)
            .sort((a, b) => (!!a.talk - !!b.talk) || Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];   // consoles before people
          if (t) { seek = t; seekEnd = L.frames + 1500; idle = 0; say('going back to ' + (t.prompt || t.name) + ' at x' + Math.round(t.x / 16)); }
        }
        if (seek) { if (G.promptEnt === seek && p.onGround && !G.busy()) { used.add(seek); asked = { e: seek, t: L.frames }; return ['interact']; } return walkTo(seek.x, keys, i); }
        return nav(keys, i);
      }

      function fight(foes, keys, i) {
        const p = G.player, S = now(), hero = G.hero();
        foes.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
        const f = foes[0], dx = f.x - p.x, adx = Math.abs(dx), dir = dx > 0 ? 'right' : 'left';
        // a fight where no foe loses health: they are out of reach (a walker behind a rock step in the Dunes kept Kael
        // swinging at the wall for ten minutes). After 4 s jump toward them; after 20 s leave them be for 15 s and walk on
        const hpSum = foes.reduce((s, e) => s + e.hp, 0) + (G.boss && !G.boss.dead ? G.boss.hp : 0);
        if (hpSum < lastHp || foes.some(e => e.isBoss)) { lastHp = hpSum; stall = 0; } else { lastHp = hpSum; stall++; }
        // the same, counted per foe across fights: one that has kept the bot busy for 10 s in all without losing health
        // (a Glow Stalker on the far bank of a pool drifted in and out of range, making 170 two-second "fights")
        if (hpOf.get(f) !== f.hp) { hpOf.set(f, f.hp); busyOn.set(f, 0); } else busyOn.set(f, (busyOn.get(f) || 0) + 1);
        if (!f.isBoss && busyOn.get(f) > 600) { busyOn.set(f, 0); ignore.set(f, L.frames + 1800); say('left ' + f.def.name + ' alone: could not hurt it in 10 s'); return keys; }
        if (stall === 1200) { foes.forEach(e => ignore.set(e, L.frames + 900)); stall = 0; say('could not reach ' + [...new Set(foes.map(e => e.def.name))].join(', ') + ': walking on'); return keys; }
        if (stall > 240 && stall % 90 === 0 && p.onGround && adx > 26) jump = JUMP;
        if (jump > 0) { keys.push(dir); if (jump > 16 || jump <= 12) keys.push('jump'); jump--; return keys; }
        // stay out of pools (the Glowwild's glow pool cost Nyra more health than its Husks did): standing in one, climb
        // out to the nearest dry floor; at the edge of one, let the foe come
        const z = G.zone, tx = Math.floor(p.x / 16), fy = Math.floor((p.y + 1) / 16);
        if (wetAt(z, tx, fy)) { let best = null; for (let d = 1; d <= 10 && best === null; d++) for (const s of [-1, 1]) if (best === null && !wetAt(z, tx + d * s, fy) && !pitAt(z, tx + d * s, fy - 2)) best = s; if (best !== null) { if (p.onGround || p.state === 'swim' || i % 20 === 0) jump = JUMP; return [best > 0 ? 'right' : 'left']; } }
        const ahead = Math.floor((p.x + (dx > 0 ? 14 : -14)) / 16);
        if (adx > 30 && !f.isBoss && wetAt(z, ahead, fy) && !wetAt(z, tx, fy)) {
          // a foe that stays on the far bank (a Glow Stalker waits there) is left for later after 3 s, and the walker
          // crosses the pool the normal way
          if (++edgeT > 180) { edgeT = 0; foes.forEach(e => ignore.set(e, L.frames + 900)); return keys; }
          if (dx > 0 ? p.face < 0 : p.face > 0) return [dir]; return i % 7 < 2 ? ['attack'] : [];
        }
        edgeT = 0;
        const threat = e => e.tele > 0 || (e.state === 'windup' && e.st > (e.def.windup || 24) - 16) || e.state === 'leap' || e.state === 'charge' || (e.state === 'strike' && e.st < 7);
        if (itemCd > 0) itemCd--; if (skillCd > 0) skillCd--; if (slipCd > 0) slipCd--;
        if (S.hp < hpMax() * 0.4 && S.items > 0 && itemCd <= 0) { itemCd = 120; return ['item']; }
        if (S.awaken >= 100 && p.awakeT <= 0 && G.has(hero.awaken) && i % 30 === 0) return ['awaken'];
        const bs = foes.find(e => e.isBoss);
        if (bs) {   // the careful test player's boss play (harness.js T.fight, smart mode)
          const unb = /Charge|Lunge|Thrust/.test(bs.last ? bs.last.name : ''), bdx = bs.x - p.x;
          if (bs.gen && unb && bs.tele > 0) { keys.push('down'); if (bs.tele <= 6 && S.energy >= 60) keys.push('dash'); return keys; }
          if (bs.gen && unb && Math.abs(bdx) < 110) { keys.push(bdx > 0 ? 'left' : 'right'); if (i % 16 < 8) keys.push('jump'); return keys; }
          if (bs.gen && (bs.tele > 0 || bs.beam || bs.aim || threat(bs)) && p.onGround) { keys.push('down'); return keys; }
        }
        const danger = foes.some(e => Math.abs(e.x - p.x) < (e.isBoss ? 130 : 64) && threat(e));
        if (danger && p.onGround && guardT < 24) { guardT++; return ['down']; }
        if (!danger) guardT = 0;
        // shield-bearers facing us: slip through them
        if (f.def.shield && f.face === (dx > 0 ? -1 : 1) && adx < 44 && S.energy >= 60 && slipCd <= 0) { slipCd = 90; return ['down', 'dash']; }
        // Husks only feel energy: skills, and charge when empty
        // (for a hero whose skill is thrown, like Kael's Spark Dart, keep some distance and throw; out of energy, back off
        // and charge. Swinging at them up close does nothing, which is how Kael spent half a minute on two Husks)
        if (f.def.energyOnly) {
          const away = dx > 0 ? 'left' : 'right', thrown = /dart|bolt|shot|orb|flask|throw/i.test(hero.kit[0] || '');
          if (S.energy < 25) return adx > 90 ? ['attack', 'jump'] : [away];
          if (thrown && adx < 44) return [away];
          if (adx < (thrown ? 170 : 150) && (thrown || adx > 28) && skillCd <= 0) { skillCd = thrown ? 24 : 40; return [dir, 'skill']; }
          if (thrown) return i % 20 < 10 ? [dir] : [];
        }
        if (adx > 26) keys.push(dir); else if ((dx > 0 ? 1 : -1) !== p.face) keys.push(dir);
        if (f.y < p.y - 24 && i % 40 < 10) keys.push('jump');
        else if (adx < 150 && S.energy >= 75 && skillCd <= 0 && i % 9 === 0) { skillCd = 150; keys.push('skill'); }
        else if (i % 7 < 2) keys.push('attack');
        return keys;
      }

      // walk toward x (either way), jumping over walls and gaps; used to go back for foes and to people
      function walkTo(x, keys, i) {
        const p = G.player, z = G.zone, d = x > p.x ? 1 : -1, fy = Math.floor((p.y + 1) / 16), fx1 = Math.floor((p.x + d * (12 + Math.abs(p.vx) * 4)) / 16);
        if (Math.abs(x - p.x) > 10) keys.push(d > 0 ? 'right' : 'left');
        if (p.onGround && jump <= 0 && (!solidAt(z, fx1, fy) || solidAt(z, fx1, fy - 1) || (Math.abs(p.vx) < 0.2 && i % 60 === 0))) jump = JUMP;
        else if (!p.onGround && p.vy > 0.5 && !p.airDash && pitAt(z, Math.floor(p.x / 16), fy) && pitAt(z, Math.floor(p.x / 16) + d, fy)) keys.push('dash');   // across wide gaps (the Crater's acid pool)
        if (jump > 0) { if (jump > 16 || jump <= 12) keys.push('jump'); jump--; }
        return keys;
      }

      // the story walker (story-test.js ST.nav), one frame at a time, always heading right
      function nav(keys, i) {
        const p = G.player, z = G.zone, S = now(), fy = Math.floor((p.y + 1) / 16), tx = Math.floor(p.x / 16);
        const pe = G.promptEnt;
        if (pe && p.onGround && !G.busy() && !used.has(pe) && !EXCL.test(pe.prompt || '')) { used.add(pe); asked = { e: pe, t: L.frames }; return ['interact']; }   // (not while the game is busy: it ignores the key then)
        // a glowing console close by (the story marks the ones that matter that way; most appear only once their guards
        // are down, by when the bot has often walked past): go and use it
        const glow = [...seen].filter(e => z.ents.includes(e) && !used.has(e) && !(ignore.get(e) > L.frames) && e.canInteract(G)).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
        if (glow) { seek = glow; seekEnd = L.frames + 1500; say('going to ' + glow.prompt + ' at x' + Math.round(glow.x / 16)); return walkTo(glow.x, keys, i); }
        keys.push(dir > 0 ? 'right' : 'left');
        const solid = (x, y) => { const c = z.tile(x, y); return c === '#' || c === '=' || (c === 'H' && z.tile(x, y - 1) !== 'H'); };
        const pit = x => { for (let y = fy; y < z.h; y++) if (solid(x, y)) return false; return true; };
        if (p.x * dir > best + 2) { best = p.x * dir; idle = 0; } else idle++;
        if (idle === 360) { const k = z.id + ':' + tx; if (!stuckLogged.has(k)) { stuckLogged.add(k); L.stuck.push({ zone: z.name, x: tx }); say('no progress for 6s at ' + z.name + ' x' + tx); } }
        // the nudge (after 20 s without progress) moves the hero a few tiles on, but only onto open floor (two tiles of air
        // over ground) and never past a closed gate: it once dropped Kael inside a rock step in the Dunes, and on the
        // Skylift it slipped through the gate that the lift ride opens
        if (idle > 1200) {
          idle = 0; best = p.x * dir;
          const spot = freeSpot(z, tx, fy, dir);
          if (spot) { L.assists.push({ zone: z.name, x: tx }); say('needed a nudge at ' + z.name + ' x' + tx); T.tp(spot[0], spot[1]); }
          else { const k = z.id + ':gate:' + tx; if (!stuckLogged.has(k)) { stuckLogged.add(k); L.stuck.push({ zone: z.name, x: tx, gate: true }); say('a closed gate at ' + z.name + ' x' + tx); } }
          return keys;
        }
        if (p.state === 'climb') return ['up'];
        // a gap is seen further ahead the faster the hero runs (Nyra ran off the Glowwild's second pool 28 times before
        // the bot looked), and a jump is still taken in the moment after stepping off a ledge
        if (!p.onGround && p.coyote > 0 && p.vy >= 0 && jump <= 0 && pit(tx)) jump = JUMP;
        if (p.onGround) {
          const ph = idle % 150, fx1 = Math.floor((p.x + dir * (12 + Math.abs(p.vx) * 4)) / 16);
          if (idle > 8 && z.tile(tx, Math.floor((p.y - 10) / 16)) === 'H' && ph < 50) return ['up'];
          if (idle > 8 && (ph === 9 || ph === 40)) jump = JUMP;
          else if (idle > 8 && ph >= 70 && ph < 120) { if (i % 7 < 2) keys.push('attack'); }
          else if (idle > 8 && ph === 130) keys.push('skill');
          else if (idle > 8 && ph === 140 && S.energy >= 50) keys.push('special');
          else if (idle <= 8 && (!solid(fx1, fy) || solid(fx1, fy - 1))) jump = JUMP;   // a gap, or a wall/step ahead
        } else if (p.vy > 0.5 && !p.airDash && pit(tx) && pit(tx + dir)) keys.push('dash');
        // a jump is pressed, let go, then pressed again: holding the key down gave only one jump, and steps four tiles
        // high (the Ash Dunes, west of the pumps) need the double jump
        if (jump > 0) { if (jump > 16 || jump <= 12) keys.push('jump'); jump--; }
        return keys;
      }

      AP.running = true;
      const limit = o.minutes * 3600;
      // paced like the game's own loop: 60 game frames per real second whatever the screen's refresh rate (the first test
      // ticked once per redraw, and a 120 Hz pane played it at double speed)
      let last = performance.now(), acc = 0;
      const loop = () => {
        if (!AP.running) return;
        const t = performance.now(); acc += Math.min(100, t - last) * o.speed; last = t;
        let n = 0; while (acc >= 1000 / 60 && n < 6) { acc -= 1000 / 60; n++; }
        if (o.fast) n = 900;
        for (let k = 0; k < n; k++) {
          const keys = decide();
          T.hold(keys); G.tick(); L.frames++;
          if (legs) {
            if (G.scene === 'play' && legs[leg].until(G)) { leg++; if (leg >= legs.length) { closeEnc(); caption(); return finish('finished'); } dir = legs[leg].dir; best = -1e9; idle = 0; say('next leg: heading ' + (dir > 0 ? 'east' : 'west')); }
          } else if (now().zone !== startZone && !G.player.dead && G.fade.dir === 0) { closeEnc(); caption(); return finish('finished'); }
          if (L.frames > limit) { closeEnc(); return finish('timeout'); }
          if (AP.stop) { AP.stop = false; closeEnc(); return finish('stopped'); }
          if (AP.duelOut) { AP.duelOut = false; T.hold([]); return finish('lost the rival duel 3 times'); }
        }
        if (n && !o.fast) { G.render(); caption(); }
        if (o.fast) { mcFn = loop; mc.port2.postMessage(0); } else nextFrame(loop);   // timers crawl in hidden tabs; messages do not
      };
      if (o.fast) { mcFn = loop; mc.port2.postMessage(0); } else nextFrame(loop);
    });
  };
  // ---- Versus: bots on both sides, recorded. matches: [{ a, b, mode: 'pvp' | 'pvb', diff, stage }]
  //      Logs every round (winner, time-up, health left, seconds) and stalemates (15 s without any damage).
  AP.versus = function (name, matches, title) {
    const V = SW.versus;
    return new Promise(done => {
      G.manual = true; SW.profile.all = true;
      const L = AP.log = { name, title, matches: [], frames: 0 }, c = document.createElement('canvas'); c.width = 960; c.height = 600;
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
      const mr = new MediaRecorder(c.captureStream(30), { mimeType: mime, videoBitsPerSecond: 3500000 }), chunks = [];
      mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; mr.start(1000);
      let mi = -1, m = null, t = 0, lastHp = '', still = 0, note = '';
      const start = () => {
        mi++; if (mi >= matches.length) return false;
        const q = matches[mi], A = D.heroOrder.indexOf(q.a), B = D.heroOrder.indexOf(q.b);
        V.open(G); V.mode = q.mode; V.diff = q.diff === undefined ? 1 : q.diff; V.gain = 1; V.stage = q.stage || 0; V.pick = [A, B]; V.phase = 'pick'; V.step = 1;
        I_press('confirm');
        V.f[0].bot = true; V.f[1].bot = true;
        m = { a: q.a, b: q.b, mode: q.mode, rounds: [], stalls: 0, err: null }; L.matches.push(m); t = 0; still = 0; lastHp = '';
        note = (q.mode === 'pvp' ? 'PvP' : 'PvE') + ' match ' + (mi + 1) + '/' + matches.length + ': ' + D.heroes[q.a].name + ' vs ' + D.heroes[q.b].name;
        return true;
      };
      const I_press = k => { SW.input.down[k] = true; G.tick(); G.tick(); SW.input.down[k] = false; G.tick(); };
      let round = 0, phase0 = '';
      const watch = () => {
        const f = V.f; if (!f || f.length < 2) return;
        const hp = f.map(z => Math.round(z.state.hp)).join('/');
        if (V.phase === 'fight') { if (hp === lastHp) { if (++still === 900) { m.stalls++; } } else still = 0; lastHp = hp; }
        if (V.phase === 'ko' && phase0 !== 'ko') m.rounds.push({ winner: V.winner, timeUp: !!V.timeUp, hp: f.map(z => Math.max(0, Math.round(100 * z.state.hp / z.p.hpMax()))), sec: Math.round((60 * 60 - V.timer) / 60) });
        phase0 = V.phase;
      };
      const cap = () => {
        x.drawImage(G.canvas, 0, 0, 960, 540); x.fillStyle = '#05060c'; x.fillRect(0, 540, 960, 60);
        x.font = 'bold 18px monospace'; x.fillStyle = '#f5c542'; x.fillText('AUTOPLAY  ' + title, 12, 564);
        x.font = '16px monospace'; x.fillStyle = '#ffffff';
        const r = m ? m.rounds.map(q => q.winner < 0 ? 'draw' : D.heroes[q.winner ? m.b : m.a].name + (q.timeUp ? ' (time)' : '')).join(', ') : '';
        x.fillText(note + (r ? '   rounds: ' + r : ''), 12, 588);
      };
      start();
      let last = performance.now(), acc = 0;
      const loop = () => {
        const tn = performance.now(); acc += Math.min(100, tn - last); last = tn;
        let n = 0; while (acc >= 1000 / 60 && n < 6) { acc -= 1000 / 60; n++; }
        for (let k = 0; k < n; k++) {
          G.tick(); L.frames++; t++; watch();
          if (G.lastError && m && !m.err) m.err = String(G.lastError).slice(0, 200);
          if (V.phase === 'result' && ++m.resT > 150) {
            m.champ = V.champ;
            if (!start()) {
              const post = (nm, body) => fetch('/__rec/' + nm, { method: 'POST', body }).then(r => r.status).catch(() => 0);
              mr.onstop = () => post(name + '.webm', new Blob(chunks, { type: 'video/webm' })).then(() => post(name + '.json', JSON.stringify(L, null, 1))).then(() => done(L));
              setTimeout(() => mr.stop(), 600); cap(); return;
            }
          }
          if (m && V.phase !== 'result') m.resT = 0;
        }
        if (n) { G.render(); cap(); } nextFrame(loop);
      };
      nextFrame(loop);
    });
  };
  // ---- Acts 2 and 3, one recorded segment per mission, each set up like story-test.js does, at the levels players
  //      really arrive at (difficulty.js notes), with half the stat points in Power ----
  const ACT2 = ['A2-1', 'A2-2', 'A2-3', 'A2-4'], ACT3 = ['A3-1', 'A3-2', 'A3-3', 'A3-4', 'A3-5'];
  function prep(o) {
    return (G, T) => {
      const S = G.state, h = G.hero();
      ['double_jump'].concat(h.kit.slice(0, o.kit || 4)).forEach(a => G.unlock(a, true));
      if (o.awaken) { G.unlock(h.awaken, true); if (h.ultimate) G.unlock(h.ultimate, true); }
      (o.done || []).forEach(m => { S.done[m] = true; });
      ['name_known', 'scrap_arrive'].concat(o.flags || []).forEach(f => G.setFlag(f));
      Object.keys(o.vals || {}).forEach(k => G.setFlag(k, o.vals[k]));
      (o.steps || []).forEach(k => { S.steps[k] = true; });
      S.level = o.lvl; S.stats.power = Math.floor((o.lvl - 1) / 2); S.mission = o.mission; S.items = 3;
      if (o.assists) { S.assists = o.assists.slice(); S.assist = o.assists[0]; }
      T.warp(o.zone, o.spawn); for (let i = 0; i < 30; i++) G.tick(); T.skip();
      S.hp = G.player.hpMax(); S.energy = 200; if (SW.daynight) SW.daynight.setHour(10);
    };
  }
  const st = k => g => !!g.state.steps[k], dn = k => g => !!g.state.done[k];
  AP.STORY = [
    { name: 'act2-1-ash-dunes', hero: 'kael', title: 'A2-2 Dust and Debts', setup: prep({ lvl: 9, kit: 3, done: ['A2-1'], steps: ['A2-2:board'], mission: 'A2-2', zone: 'dunes', spawn: 'east' }), legs: [{ dir: -1, until: st('A2-2:boss') }] },
    { name: 'act2-2-glowwild', hero: 'kael', title: 'A2-3 What Grows in the Glow', setup: prep({ lvl: 10, kit: 3, done: ['A2-1', 'A2-2'], flags: ['rad_filter'], mission: 'A2-3', zone: 'glowwild', spawn: 'west' }), legs: [{ dir: 1, until: g => st('A2-3:shard')(g) || dn('A2-3')(g) }] },
    { name: 'act2-3-crater', hero: 'kael', title: 'A2-4 Where the Sky Came Down', setup: prep({ lvl: 11, done: ACT2.slice(0, 3), flags: ['rad_filter', 'relay_off', 'glow_in', 'arena:glowwild:mother'], mission: 'A2-4', zone: 'crater', spawn: 'west' }), legs: [{ dir: 1, until: g => st('A2-4:rift')(g) || dn('A2-4')(g) }] },
    { name: 'act3-1-crater-mast', hero: 'nyra', title: 'A3-1 Two Worlds, One Plan', setup: prep({ lvl: 12, awaken: true, done: ACT2, flags: ['rad_filter', 'relay_off', 'glow_in', 'arena:glowwild:mother', 'crater_in', 'veil_read', 'arena:crater:post', 'card:act2end'], vals: { crater_duel: 'win' }, steps: ['A2-4:enter', 'A2-4:post', 'A2-4:duel', 'A2-4:rift'], mission: 'A3-1', zone: 'crater', spawn: 'floor' }),
      legs: [{ dir: -1, until: g => g.flag('veil_down') }, { dir: 1, until: st('A3-1:meet') }] },
    { name: 'act3-2-pit-melee', hero: 'nyra', title: 'A3-2 Rally the Deep', setup: prep({ lvl: 14, awaken: true, done: ACT2.concat(['A3-1']), flags: ['rad_filter', 'shaft_open', 'veil_down'], steps: ['A3-1:mast', 'A3-1:meet', 'A3-1:council'], assists: ['partner'], mission: 'A3-2', zone: 'pit', spawn: 'door' }), legs: [{ dir: 1, until: st('A3-2:gauntlet') }] },
    { name: 'act3-3-skylift', hero: 'nyra', title: 'A3-3 Storm the Skylift', setup: prep({ lvl: 17, awaken: true, done: ACT2.concat(ACT3.slice(0, 2)), flags: ['rad_filter', 'shaft_open', 'veil_down', 'card:act3a'], assists: ['partner', 'anvil'], mission: 'A3-3', zone: 'skylift', spawn: 'gate' }), legs: [{ dir: 1, until: st('A3-3:top') }] },
    { name: 'act3-4-noble-ring', hero: 'nyra', title: 'A3-4 The Noble Ring Uprising', setup: prep({ lvl: 19, awaken: true, done: ACT2.concat(ACT3.slice(0, 3)), flags: ['shaft_open', 'veil_down', 'card:act3a', 'card:act3b'], assists: ['partner', 'anvil'], mission: 'A3-4', zone: 'skyport', spawn: 'lift' }), legs: [{ dir: 1, until: st('A3-4:vane') }] },
    { name: 'act3-5-spire', hero: 'nyra', title: 'A3-5 The Spire', setup: prep({ lvl: 21, awaken: true, done: ACT2.concat(ACT3.slice(0, 4)), flags: ['shaft_open', 'veil_down', 'card:act3a', 'card:act3b', 'card:act3c', 'relay_a', 'relay_b', 'relay_c'], assists: ['vane', 'partner', 'anvil'], mission: 'A3-5', zone: 'noble', spawn: 'spire' }), legs: [{ dir: 1, until: st('A3-5:key') }] },
    { name: 'act3-6-finale', hero: 'nyra', title: 'A3-6 Convergence', setup: prep({ lvl: 23, awaken: true, done: ACT2.concat(ACT3), flags: ['veil_down', 'card:act3a', 'card:act3b', 'card:act3c', 'card:act3d'], assists: ['partner', 'anvil', 'vane'], mission: 'A3-6', zone: 'spire', spawn: 'top' }), legs: [{ dir: 1, until: dn('A3-6') }] }
  ];
  AP.story = async function (names, o) {
    const out = [];
    for (const seg of AP.STORY.filter(q => !names || names.includes(q.name))) { AP.current = seg.name; out.push(await AP.play(seg.hero, Object.assign({ minutes: 9 }, o || {}, seg))); }
    await fetch('/__rec/story-summary.json', { method: 'POST', body: JSON.stringify(out.map(l => ({ segment: l.segment, hero: l.hero, result: l.result, seconds: l.seconds, deaths: l.deaths, stuck: l.stuck, assists: l.assists, fights: l.fights.map(f => ({ what: f.boss || f.types.join('+'), dmg: f.dmg, sec: f.sec, died: f.died })), hazards: l.hazards, err: l.err })), null, 1) });
    AP.current = null; AP.storyDone = out; return out;
  };
  AP.series = async function (heroes, o) {
    const out = [];
    for (const h of heroes) { AP.current = h; out.push(await AP.play(h, o)); }
    await fetch('/__rec/autoplay-summary.json', { method: 'POST', body: JSON.stringify(out.map(l => ({ hero: l.hero, result: l.result, seconds: l.seconds, deaths: l.deaths.length, stuck: l.stuck.length, assists: l.assists.length, fights: l.fights.length, worst: l.fights.slice().sort((a, b) => b.dmg - a.dmg).slice(0, 3) })), null, 1) });
    AP.current = null; AP.done = out;
    return out;
  };
})();
