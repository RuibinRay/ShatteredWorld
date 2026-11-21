'use strict';
// Shattered Worlds — The Hollow Crown: goals other than "beat the waves" (the Normal playtest, items 6 and 7: "make a
// few of them real: a timed run for Tarn, a guard objective ... the same wave code with a different win condition").
// Where a chapter's own goal already says it, the fight becomes that task:
//   run      reach the beacon before the time runs out; ambushes on the road (Tarn's checkpoint, Kiri's cranes,
//            Vesper before dawn and her road, Kova's chase, Fenn's and Kova's charge into the drill camp). Too slow:
//            back to the start, and again.
//   escort   a caravan rolls across the area, waiting for you; raiders go for it. Wrecked: again from the start. It
//            gets through: done. (Hart's caravan, Kova's caravan road with Hart.)
//   guard    someone or something with a bar of its own - the chapter's ally, Maren's patients, the ward door - and
//            raiders go for it through the waves. It falls: the waves begin again. (Every "Guard X" / "Keep X safe".)
// The flavour goal on the HUD stays; a second line under it says the real task. Only chapters 1, 2 and 4 of the heroes
// listed in GOALS; every other chapter is unchanged. Uses saga-core's own wave pieces (SG.spawnWave, SG.foeLists) and
// holds its plain waves back while a goal runs. Loaded after js/saga/saga-polish.js.
(function () {
  const SW = window.SW, G = SW && SW.game, SG = SW && SW.saga, D = SW && SW.data, HR = D && D.heroes, art = SW && SW.art, fx = SW && SW.fx, T = 16;
  if (!G || !SG || !SG.run || !SG.spawnWave || !SG.foeLists || !SG.complete || !SG.chap || !SW.Zone) return;
  const R = SG.run, W = SW.W, PI = Math.PI, Rn = Math.round;
  const sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no audio yet */ } };
  const nm = id => (HR[id] ? HR[id].name : id);
  const tr = s => (SW.i18n && SW.i18n.tr ? SW.i18n.tr(s) : s);

  // hero -> { chapter: [kind, what] }; what: for guard, 'with' (the chapter's ally), 'cot', 'door' or 'beds'
  const GOALS = {
    tarn: { 1: ['run', 'the checkpoint'] }, kiri: { 4: ['run', 'the far gate'] },
    vesper: { 1: ['run', 'the end of the alleys'], 4: ['run', 'the feed lines'] }, kova: { 1: ['run', 'the tree line'], 2: ['escort', 'caravan'], 4: ['run', 'the drill camp'] },
    fenn: { 4: ['run', 'the drill camp'] }, hart: { 1: ['escort', 'caravan'] },
    maren: { 1: ['guard', 'cot'], 4: ['guard', 'door'] }, nami: { 2: ['guard', 'with'] }, ume: { 2: ['guard', 'beds'] }, elixa: { 2: ['guard', 'beds'] },
    oda: { 2: ['guard', 'with'] }, lin: { 2: ['guard', 'with'] }, thorne: { 2: ['guard', 'with'] }, vesna: { 2: ['guard', 'with'] }
  };
  SG.GOALS = GOALS;
  SG.goalNow = () => O;   // (for tests)
  let O = null;   // the goal running now: { key, kind, ... }

  // ---------- where things stand ----------
  const sgOn = () => !!(G.state && G.state.saga && G.scene === 'play');
  function current(z) {
    const S = G.state, sg = S.saga; if (!sg || sg.phase !== 'play' || sg.ch > 4) return null;
    const n = sg.ch, g = GOALS[S.hero] && GOALS[S.hero][n]; if (!g) return null;
    const c = SG.chap(S.hero, n); if (!c || z.id !== c.zone) return null;
    const done = SG.chapDone || (() => false);
    if (done(n, 'fight') || (n === 2 && !done(2, 'talk')) || !sg.seen['i' + n]) return null;
    return { n, c, kind: g[0], what: g[1], key: S.hero + n };
  }
  const solidAt = (z, x, y) => { const t = z.tile(Math.floor(x / T), Math.floor(y / T)); return t && t !== '.' && t !== ' ' && t !== '^'; };
  // a spot on the hero's floor about dist tiles along dir, or null
  function spotAlong(z, x, y, dist, dir) {
    const s = SG.floorSpot(z, x, y, dist, dir); if (!s) return null;
    const px = s.tx * T + 8; if (Math.abs(px - x) < (dist - 8) * T) return null;
    return { x: px, y: (s.ty + 1) * T };
  }
  // the floor under x nearest to y (a standable tile within 6 above or 8 below), or null
  function groundAt(z, x, y) {
    const tx = Math.floor(x / T), ty0 = Math.floor((y - 1) / T), solid = c => c === '#' || c === '=';   // (as js/saga/saga-core.js reads the map)
    for (const d of [0, -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6, 7, 8]) { const ty = ty0 + d; if (solid(z.tile(tx, ty + 1)) && !solid(z.tile(tx, ty))) return (ty + 1) * T; }
    return null;
  }
  // how far a cart can roll from (x, y) along dir: on, while each step of the floor is at most 2 tiles up or 4 down
  function roadEnd(z, x, y, dir, max) {
    let gy = y, cx = x;
    for (let i = 1; i <= max; i++) { const nx = x + dir * i * T, ny = groundAt(z, nx, gy); if (ny === null || ny < gy - 2 * T || ny > gy + 4 * T || nx < 3 * T || nx > z.pw - 3 * T) break; gy = ny; cx = nx; }
    return cx;
  }
  function roomDir(z, x) { return (z.pw - x) >= x ? 1 : -1; }
  void solidAt;

  // ---------- the pieces drawn in the world ----------
  function beacon(ctx, x, y, t) {   // the run's goal: a pillar of light with a flag
    ctx.save();
    for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.12 + i * 0.08; art.rect(ctx, i === 2 ? '#ffffff' : '#7dffa0', x - 6 + i * 2, y - 140, 12 - i * 4, 140); }
    ctx.globalAlpha = 1; art.rect(ctx, '#0a0a12', x - 1, y - 40, 3, 40); for (let j = 0; j < 4; j++) art.rect(ctx, '#7dffa0', x + 2, y - 38 + j * 3 + Rn(Math.sin(t * 0.15 + j)), 10 - j * 2, 3);
    for (let j = 0; j < 12; j++) { const a = j / 12 * PI * 2 + t * 0.05; art.rect(ctx, '#c8ffd8', Rn(x + Math.cos(a) * 14), Rn(y - 2 + Math.sin(a) * 3), 1, 1); }
    ctx.restore();
  }
  function cart(ctx, x, y, t, moving, hurt) {   // the caravan: a covered wagon on two wheels, a lantern
    const wob = moving ? Rn(Math.sin(t * 0.3)) : 0;
    art.rect(ctx, '#0a0a12', x - 22, y - 26 + wob, 44, 16);
    art.rect(ctx, hurt ? '#ffffff' : '#8a5a2a', x - 21, y - 25 + wob, 42, 14); art.rect(ctx, '#b07a3a', x - 21, y - 25 + wob, 42, 2);
    art.rect(ctx, '#0a0a12', x - 19, y - 40 + wob, 38, 15); art.rect(ctx, hurt ? '#ffffff' : '#e0d4b8', x - 18, y - 39 + wob, 36, 13);   // the canvas top
    for (let i = 0; i < 3; i++) art.rect(ctx, '#b8a888', x - 12 + i * 12, y - 39 + wob, 1, 13);
    [-12, 12].forEach(dx => { art.disc(ctx, '#0a0a12', x + dx, y - 6, 7); art.disc(ctx, '#5a3a1a', x + dx, y - 6, 6); art.disc(ctx, '#2a1a0a', x + dx, y - 6, 2); const a = moving ? t * 0.2 : 0; art.line(ctx, '#2a1a0a', Rn(x + dx + Math.cos(a) * 5), Rn(y - 6 + Math.sin(a) * 5), Rn(x + dx - Math.cos(a) * 5), Rn(y - 6 - Math.sin(a) * 5), 1); });
    art.rect(ctx, '#0a0a12', x + 22, y - 30, 3, 8); art.rect(ctx, t % 30 < 20 ? '#ffd24a' : '#ffb03a', x + 23, y - 29, 1, 5);   // lantern
  }
  function cot(ctx, x, y, t, hurt) {   // Maren's patients: two cots under a drip stand
    [-14, 14].forEach((dx, i) => { art.rect(ctx, '#0a0a12', x + dx - 12, y - 12, 24, 6); art.rect(ctx, hurt ? '#ffffff' : '#e8f4f0', x + dx - 11, y - 11, 22, 4); art.rect(ctx, '#7a8090', x + dx - 11, y - 7, 2, 7); art.rect(ctx, '#7a8090', x + dx + 9, y - 7, 2, 7); art.rect(ctx, '#c89a78', x + dx - 10, y - 14, 5, 3); art.rect(ctx, i ? '#4a8acf' : '#2a9d8f', x + dx - 5, y - 13, 14, 2); });
    art.rect(ctx, '#7a8090', x - 1, y - 34, 2, 34); art.rect(ctx, '#b8fff0', x - 3, y - 34, 6, 6); if (t % 40 < 4) art.rect(ctx, '#b8fff0', x, y - 26, 1, 2);
  }
  function door(ctx, x, y, t, hurt) {   // the ward door
    art.rect(ctx, '#0a0a12', x - 13, y - 44, 26, 44); art.rect(ctx, hurt ? '#ffffff' : '#5a6070', x - 12, y - 43, 24, 43); art.rect(ctx, '#8a92a8', x - 12, y - 43, 24, 2);
    art.rect(ctx, '#3a3f4e', x - 8, y - 38, 16, 14); art.rect(ctx, '#2a9d8f', x - 2, y - 36, 4, 10); art.rect(ctx, '#2a9d8f', x - 6, y - 32, 12, 3); art.rect(ctx, '#c8ccd8', x + 7, y - 22, 3, 2);
  }
  function beds(ctx, x, y, t, hurt) {   // the spore beds: three glowing mushrooms in soil
    art.rect(ctx, '#0a0a12', x - 24, y - 6, 48, 6); art.rect(ctx, '#3a2a1a', x - 23, y - 5, 46, 4);
    [-14, 0, 14].forEach((dx, i) => { const h = 10 + i * 3; art.rect(ctx, '#c8e8c0', x + dx - 1, y - 5 - h, 3, h); art.disc(ctx, '#0a0a12', x + dx, y - 6 - h, 6); art.disc(ctx, hurt ? '#ffffff' : i === 1 ? '#9d6cff' : '#52b788', x + dx, y - 6 - h, 5); if ((t + i * 13) % 40 < 6) art.rect(ctx, '#e8ffe0', x + dx, y - 14 - h - ((t % 40) >> 1), 1, 1); });
  }
  function bar(ctx, x, y, f, label) {
    art.rect(ctx, '#05060c', x - 21, y - 1, 42, 5); art.rect(ctx, f > 0.35 ? '#7dffa0' : '#ff5a5a', x - 20, y, Rn(40 * Math.max(0, f)), 3);
    if (label) SW.text(ctx, label, x, y - 9, '#e8ecf4', { align: 'center' });
  }

  // ---------- a ward (guard / escort): an entity in the area's shots, drawn and hit ----------
  function makeWard(z, x, y, kind, who) {
    const w = { x, y, kind, who, hp: 100, max: 100, t: 0, hurtT: 0, isWard: true,
      update() { this.t++; if (this.hurtT > 0) this.hurtT--; if (who && R.npc && R.npc.sgWho === who) { this.x = R.npc.x; this.y = R.npc.y; } },
      draw(ctx, cam) {
        const sx = Rn(this.x - cam.x), sy = Rn(this.y - cam.y), h = this.hurtT > 0 && this.hurtT % 4 < 2;
        if (kind === 'caravan') cart(ctx, sx, sy, this.t, O && O.moving, h);
        else if (kind === 'cot') cot(ctx, sx, sy, this.t, h);
        else if (kind === 'door') door(ctx, sx, sy, this.t, h);
        else if (kind === 'beds') beds(ctx, sx, sy, this.t, h);
        else if (h) { ctx.save(); ctx.globalAlpha = 0.5; art.rect(ctx, '#ff5a5a', sx - 8, sy - 32, 16, 32); ctx.restore(); }
        const lab = kind === 'caravan' ? 'The caravan' : kind === 'cot' ? 'Your patients' : kind === 'door' ? 'The ward door' : kind === 'beds' ? 'The spore beds' : nm(who);
        bar(ctx, sx, sy - (kind === 'door' ? 54 : kind === 'caravan' ? 50 : kind === 'with' ? 46 : 34), this.hp / this.max, lab);
      } };
    z.shots.push(w); return w;
  }
  // raiders: half of each wave goes for the ward, unless the hero is on top of them
  function raid(z, ward) {
    const p = G.player;
    R.foes.forEach((e, i) => {
      if (!e.sgRaid || SG.gone(z, e) || e.dead) return;
      if (Math.abs(e.x - p.x) < 50 && Math.abs(e.y - p.y) < 40) return;
      const dx = ward.x - e.x;
      if (Math.abs(dx) > 14) { if (!(e.stun > 0)) { e.x += Math.sign(dx) * 0.9; e.face = Math.sign(dx); } return; }
      if (Math.abs(e.y - ward.y) < 40 && !(e.stun > 0)) {
        e.sgHitT = (e.sgHitT || 0) + 1;
        if (e.sgHitT % 50 === 25) { ward.hp -= ward.kind === 'caravan' ? 5 : 4; ward.hurtT = 10; fx.spark(ward.x, ward.y - 20, '#ff5a5a', 6, 2); sfx('hurt'); }
      }
    });
  }
  function spawnRaiders(z, list) {
    SG.spawnWave(z, list);
    R.foes.forEach((e, i) => { if (i % 2 === 0) e.sgRaid = true; });
  }
  function clearFoes(z) { R.foes.forEach(e => { if (!e.dead) { e.gone = true; fx.ring(e.x, e.y - 14, '#8a92b8', 3, 20, 10); } }); R.foes = []; }

  // ---------- starting, failing, winning ----------
  function start(z, cur) {
    const p = G.player;
    O = { key: cur.key, kind: cur.kind, n: cur.n, c: cur.c, what: cur.what, t: 0, x0: p.x, y0: p.y, wave: -1, list: null, pause: 60 };
    if (cur.kind === 'run') {
      const dir = roomDir(z, p.x), room = (dir > 0 ? z.pw - p.x : p.x) / T;
      const s = spotAlong(z, p.x, p.y, Math.min(70, Math.floor(room) - 6), dir);
      if (!s || Math.abs(s.x - p.x) < 30 * T) { O = { key: cur.key, kind: 'none' }; return; }   // no road here: the plain waves
      Object.assign(O, { dir, gx: s.x, gy: s.y, dist: Math.abs(s.x - p.x), ambush: [0.3, 0.65], hit: 0 });
      O.time = O.limit = Rn(O.dist / 1.2) + 2100;   // (about a minute for the long roads: room to fight the ambushes and cross what is in the way)
      G.toast(tr('Run! Reach ') + tr(cur.what) + tr(' before the time runs out.'), '#7dffa0');
    } else if (cur.kind === 'escort') {
      const dir = roomDir(z, p.x), w0 = SG.floorSpot(z, p.x, p.y, 3, dir), wx0 = w0.tx * T + 8, wy0 = (w0.ty + 1) * T, gx = roadEnd(z, wx0, wy0, dir, 60);
      if (Math.abs(gx - wx0) < 20 * T) { O.kind = 'guard'; O.ward = makeWard(z, wx0, wy0, 'caravan', null); G.toast(tr('Keep ') + tr('the caravan') + tr(' standing.'), '#7dffa0'); return; }   // (no road for it here: it stands, and you hold them off it)
      Object.assign(O, { dir, gx, wx0, wy0, waves: [0, 0.35, 0.7], hit: 0 });
      O.ward = makeWard(z, O.wx0, O.wy0, 'caravan', null);
      G.toast(tr('Get the caravan through. It waits for you.'), '#7dffa0');
    } else {
      const who = cur.what === 'with' ? cur.c.with : null;
      let npc = who && R.npc && R.npc.sgWho === who ? R.npc : null;
      if (who && !npc && HR[who] && SG.placeNpc) npc = SG.placeNpc(z, who, null, { dist: 4, dir: -(p.face || 1), prompt: ' ', talk: () => null });   // (the ally is not standing here: bring them)
      let x = npc ? npc.x : 0, y = npc ? npc.y : 0;
      if (!npc) { const s = SG.floorSpot(z, p.x, p.y, 4, -(p.face || 1)); x = s.tx * T + 8; y = (s.ty + 1) * T; }
      O.ward = makeWard(z, x, y, npc ? 'with' : cur.what === 'with' ? 'beds' : cur.what, npc ? who : null);
      G.toast(tr('Keep ') + tr(O.ward.kind === 'with' ? nm(who) : O.ward.kind === 'cot' ? 'your patients' : O.ward.kind === 'door' ? 'the ward door' : 'the spore beds') + tr(' standing.'), '#7dffa0');
    }
  }
  function fail(z, why) {
    sfx('deny'); G.toast(tr(why) + tr(' Again.'), '#ff8a8a');
    clearFoes(z);
    const p = G.player;
    if (O.kind === 'run') { p.x = O.x0; p.y = O.y0; p.vx = 0; p.vy = 0; O.time = O.limit; O.hit = 0; fx.ring(p.x, p.y - 16, '#7dffa0', 4, 30, 14); }
    if (O.kind === 'escort') { O.ward.x = O.wx0; O.ward.y = O.wy0; O.ward.hp = O.ward.max; O.hit = 0; }
    if (O.kind === 'guard') { O.ward.hp = O.ward.max; O.wave = -1; O.list = null; }
    O.pause = 90;
  }
  function win(z) {
    sfx('level'); clearFoes(z);
    const o = O; o.won = true;
    if (o.ward) o.ward.gone = true;
    R.wave = -1; R.list = null; R.t = 70;
    SG.say('w' + o.n, o.c.win, () => SG.complete(o.n, 'fight'));
  }

  // ---------- every frame ----------
  function tick(z) {
    const p = G.player;
    if (O.pause > 0) { O.pause--; return; }
    if (O.kind === 'run') {
      O.time--;
      const along = (p.x - O.x0) * O.dir / O.dist;
      if (O.hit < O.ambush.length && along >= O.ambush[O.hit]) { spawnRaiders(z, SG.foeLists(O.n, z.id)[O.hit % 2] || ['guard', 'guard']); R.foes.forEach(e => { e.sgRaid = false; }); O.hit++; }
      if (Math.abs(p.x - O.gx) < 20 && Math.abs(p.y - O.gy) < 48) { win(z); return; }
      if (O.time <= 0) fail(z, 'Too slow.');
      return;
    }
    if (O.kind === 'escort') {
      const w = O.ward, along = (w.x - O.wx0) * O.dir / Math.abs(O.gx - O.wx0);
      if (O.hit < O.waves.length && along >= O.waves[O.hit]) { spawnRaiders(z, SG.foeLists(O.n, z.id)[O.hit % 2] || ['guard']); O.hit++; }
      const near = R.foes.some(e => !SG.gone(z, e) && Math.abs(e.x - w.x) < 60 && Math.abs(e.y - w.y) < 40), waits = Math.abs(p.x - w.x) > 150;
      O.moving = !near && !waits;
      if (O.moving) { const nx = w.x + O.dir * 0.5, gy = groundAt(z, nx, w.y); w.x = nx; if (gy !== null) w.y = gy; }   // (it rolls up and down the ground's steps)
      raid(z, w);
      if (w.hp <= 0) { fail(z, 'The caravan is wrecked.'); return; }
      if (along >= 1) win(z);   // (it got through: whoever is left scatters)
      return;
    }
    // guard: the waves, raiders on the ward
    const w = O.ward;
    raid(z, w);
    if (w.hp <= 0) { fail(z, w.kind === 'with' ? nm(w.who) + ' is down.' : 'They broke through.'); return; }
    O.waveT = (O.waveT || 0) + 1;
    if (O.wave >= 0 && O.waveT > 1200 && !R.foes.some(e => !SG.gone(z, e) && (Math.hypot(e.x - G.player.x, e.y - G.player.y) < 120 || Math.abs(e.x - w.x) < 120))) clearFoes(z);   // (stragglers who cannot get to anyone for 20 s)
    if (O.wave >= 0 && !R.foes.every(e => SG.gone(z, e))) return;
    if (!O.list) O.list = SG.foeLists(O.n, z.id);
    O.wave++;
    if (O.wave >= O.list.length) { win(z); return; }
    spawnRaiders(z, O.list[O.wave]); O.pause = 60; O.waveT = 0;
    G.toast('WAVE ' + (O.wave + 1) + ' / ' + O.list.length, '#ff3ea5');
  }
  const _zu = SW.Zone.prototype.update;
  SW.Zone.prototype.update = function (g) {
    const live = sgOn() && this === G.zone && G.player && this.id !== 'versus';
    let cur = null;
    if (live) {
      cur = current(this);
      if (!cur || (O && O.key !== cur.key)) { if (O && O.ward) O.ward.gone = true; if (O && !O.won && O.kind !== 'none') { clearFoes(this); R.t = 0; R.wave = -1; R.list = null; } if (!cur) O = null; }   // (a goal left half-done lets go of the plain waves)
      if (cur && O && O.won) cur = null;
      if (cur && (!O || O.kind !== 'none')) { R.t = Math.max(R.t, 999); if (R.wave < 0) R.wave = 0; }   // hold saga-core's plain waves back
    }
    const out = _zu.apply(this, arguments);
    if (cur && !G.busy() && !G.player.dead) {
      if (!O || O.key !== cur.key) start(this, cur);
      if (O && O.kind === 'none') { R.t = 0; R.wave = -1; }
      else if (O && !O.won) { try { tick(this); } catch (e) { console.error(e); } }
    }
    if (cur && G.player && G.player.dead && O && !O.won && O.kind !== 'none') { O.deadReset = true; }
    if (O && O.deadReset && G.player && !G.player.dead) { O.deadReset = false; fail(this, 'Back up.'); }
    return out;
  };

  // ---------- the HUD: the real task under the goal; the run's timer and the way to the beacon ----------
  const _zd = SW.Zone.prototype.draw;
  SW.Zone.prototype.draw = function (ctx, cam) {
    const out = _zd.apply(this, arguments);
    if (O && !O.won && O.kind === 'run' && this === G.zone && sgOn()) beacon(ctx, Rn(O.gx - cam.x), Rn(O.gy - cam.y), SW.frame);
    return out;
  };
  const _ui = SW.ui && SW.ui.hud;
  if (_ui) SW.ui.hud = function (ctx) {
    const out = _ui.apply(this, arguments);
    if (!O || O.won || O.kind === 'none' || !sgOn() || G.overlay) return out;
    const p = G.player, x = SW.W - 8;
    if (O.kind === 'run') {
      const s = Math.max(0, Math.ceil(O.time / 60)), col = s <= 10 && SW.frame % 30 < 15 ? '#ff5a5a' : '#7dffa0';
      SW.text(ctx, tr('RUN: reach ') + tr(O.what) + '  ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'), x, 37, col, { align: 'right' });
      const sx = O.gx - G.cam.x; if (sx < 0 || sx > SW.W) { const ax = sx < 0 ? 10 : SW.W - 10, d = sx < 0 ? -1 : 1, ay = 120; for (let i = 0; i < 6; i++) art.rect(ctx, '#7dffa0', ax - d * i, ay - 6 + i, 1, 12 - i * 2); }
    } else if (O.ward) {
      const f = Math.max(0, Math.round(100 * O.ward.hp / O.ward.max));
      const lab = O.kind === 'escort' ? tr('ESCORT: the caravan') + '  ' + f + '%  ' + tr('to go: ') + Math.max(0, Math.round(100 - 100 * (O.ward.x - O.wx0) * O.dir / Math.abs(O.gx - O.wx0))) + '%' : tr('GUARD: ') + tr(O.ward.kind === 'with' ? nm(O.ward.who) : O.ward.kind === 'cot' ? 'your patients' : O.ward.kind === 'door' ? 'the ward door' : O.ward.kind === 'caravan' ? 'the caravan' : 'the spore beds') + '  ' + f + '%';
      SW.text(ctx, lab, x, 37, f > 35 ? '#7dffa0' : '#ff8a8a', { align: 'right' });
    }
    void p;
    return out;
  };

  // ---------- Spanish and Chinese for the new lines ----------
  if (SW.i18n && SW.i18n.add) {
    SW.i18n.add('es', { 'Run! Reach ': '¡Corre! Llega a ', ' before the time runs out.': ' antes de que se acabe el tiempo.', 'Get the caravan through. It waits for you.': 'Haz pasar la caravana. Te espera.',
      'Keep ': 'Mantén en pie ', ' standing.': '.', 'Too slow.': 'Demasiado lento.', ' Again.': ' Otra vez.', 'The caravan is wrecked.': 'La caravana está destrozada.', 'They broke through.': 'Han pasado.', 'Back up.': 'Arriba.',
      'RUN: reach ': 'CORRE: llega a ', 'ESCORT: the caravan': 'ESCOLTA: la caravana', 'to go: ': 'falta: ', 'GUARD: ': 'PROTEGE: ',
      'the checkpoint': 'el control', 'the far gate': 'la puerta del fondo', 'the end of the alleys': 'el final de los callejones', 'the feed lines': 'las líneas de alimentación',
      'the tree line': 'la linde del bosque', 'the drill camp': 'el campamento de perforación', 'your patients': 'a tus pacientes', 'the ward door': 'la puerta de la sala', 'the spore beds': 'los lechos de esporas', 'the caravan': 'la caravana',
      'The caravan': 'La caravana', 'Your patients': 'Tus pacientes', 'The ward door': 'La puerta de la sala', 'The spore beds': 'Los lechos de esporas' });
    SW.i18n.add('zh', { 'Run! Reach ': '快跑！在时间耗尽前抵达', ' before the time runs out.': '。', 'Get the caravan through. It waits for you.': '护送商队通过。它会等你。',
      'Keep ': '守住', ' standing.': '。', 'Too slow.': '太慢了。', ' Again.': '再来一次。', 'The caravan is wrecked.': '商队被毁了。', 'They broke through.': '他们突破了防线。', 'Back up.': '站起来。',
      'RUN: reach ': '奔跑：抵达', 'ESCORT: the caravan': '护送：商队', 'to go: ': '剩余：', 'GUARD: ': '守护：',
      'the checkpoint': '检查站', 'the far gate': '远处的大门', 'the end of the alleys': '小巷尽头', 'the feed lines': '供能线路',
      'the tree line': '林线', 'the drill camp': '钻探营地', 'your patients': '你的病人', 'the ward door': '病房大门', 'the spore beds': '孢子苗床', 'the caravan': '商队',
      'The caravan': '商队', 'Your patients': '你的病人', 'The ward door': '病房大门', 'The spore beds': '孢子苗床' });
  }
})();
