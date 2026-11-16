'use strict';
// Shattered Worlds — Versus stages from the story, with platforms at several heights (jump up, drop through with S + K)
// and a twist each. Loaded last; adds to the Versus stage list (versus.js shares it as V.STAGES).
//   The Noble Ring      (Act 5)  the tournament stage: two low platforms and one high one, no tricks
//   The Skylift         (Act 5)  two cargo lifts ride up and down on either side, carrying whoever stands on them
//   The Ballast Decks   (Act 2)  the ballast shifts: every so often gravity drops and everyone floats; the top decks
//                                are only in easy reach then
//   The Glass Sea       (Act 3)  glass platforms crack under whoever stands on them, shatter, and grow back
//   Platform Zero       (Act 1)  after a warning, a train crosses the floor: get up on a platform or take a heavy hit
//   The Engine Core     (Act 5)  every fifteen seconds the Engine turns and its platforms slide into a new layout
// Lifts, glass and the Engine's plates are platforms of this file's own (not tiles): fighters land on them from above,
// stand on them, ride them and drop through them like any other platform. The bots climb and drop to reach their foe,
// and get out of the train's way. SW.stages.on = false: the twists stop (the layouts stay).
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, art = SW.art, fx = SW.fx, I = SW.input, T = 16, W = SW.W;
  if (!V || !V.STAGES || !SW.zones || !SW.zones.versus || !SW.move) return;
  const ST = SW.stages = { on: true };
  const FLOOR = 14 * T, GRAV = SW.GRAV || 0.42;
  const ease = k => k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k);
  const sp = (x, y, w, kind, o) => Object.assign({ x: x * T, y: y * T, w: w * T, kind, alive: true, vy: 0 }, o || {});

  // ================= the stages =================
  const ENGINE = [   // the Engine Core's layouts: [tile x, tile row] of its four plates
    [[6, 11], [27, 11], [16, 8], [16, 4]],
    [[4, 11], [11, 9], [19, 7], [27, 5]],
    [[3, 7], [30, 7], [11, 11], [22, 11]]
  ];
  const DEF = {
    sw_noble:   { name: 'The Noble Ring', base: 'a3_noble', tiles(z) { z.plat(9, 11, 6); z.plat(23, 11, 6); z.plat(16, 8, 6); } },
    sw_skylift: { name: 'The Skylift', base: 'a3_skylift', tiles(z) { z.plat(15, 10, 8); },
      plats: () => [sp(3, 12, 5, 'lift', { phase: 0 }), sp(30, 12, 5, 'lift', { phase: Math.PI })] },
    sw_ballast: { name: 'The Ballast Decks', base: 'underside', tiles(z) { z.plat(4, 11, 6); z.plat(28, 11, 6); z.plat(15, 9, 8); z.plat(8, 5, 4); z.plat(26, 5, 4); z.plat(17, 3, 4); } },
    sw_glass:   { name: 'The Glass Sea', base: 'glass', tiles() {},
      plats: () => [sp(5, 11, 5, 'glass'), sp(16, 11, 6, 'glass'), sp(28, 11, 5, 'glass'), sp(10, 8, 5, 'glass'), sp(23, 8, 5, 'glass'), sp(16, 5, 6, 'glass')] },
    sw_zero:    { name: 'Platform Zero', base: 'platform', tiles(z) { z.plat(3, 11, 6); z.plat(14, 11, 10); z.plat(29, 11, 6); z.plat(9, 8, 5); z.plat(24, 8, 5); } },
    sw_engine:  { name: 'The Engine Core', base: 'a3_enginecore', tiles() {},
      plats: () => ENGINE[0].map(([x, y]) => sp(x, y, 5, 'engine')) }
  };
  ST.DEF = DEF;
  Object.keys(DEF).forEach(id => {
    const d = DEF[id];
    art.themes[id] = art.themes[d.base] || art.themes.arena;   // the story place's colours and backdrop
    V.STAGES.push([d.name, id]);
  });

  // each match builds its arena from the stage's layout
  const _build = SW.zones.versus.build; SW.zones.versus.build = function (z, g) {
    _build.apply(this, arguments);
    const d = DEF[z.theme];
    if (!d) return;
    d.tiles(z);
    z.sw = { id: z.theme, d, plats: d.plats ? d.plats() : [], t: 0, key: null };
    z.decor.push({ kind: 'swstage', x: (z.w * T) / 2 });   // draws the stage's own platforms and the train (behind the fighters)
  };

  // ================= physics: our platforms, the drop, low gravity =================
  const _mv = SW.move; SW.move = function (a, z) {
    const s = z && z.sw;
    if (!s) return _mv.apply(this, arguments);
    if (s.lowG && !a.onGround) a.vy -= GRAV * 0.55;   // the ballast has shifted: everything airborne floats
    const py = a.y;
    _mv.apply(this, arguments);
    if (a.swDrop > 0) a.swDrop--;
    a.swPlat = null;
    if (a.vy < 0 || a.swDrop > 0 || a.drop > 0 || a.dead) return;
    for (const p of s.plats) {
      if (!p.alive || a.x + (a.w || 16) / 2 <= p.x || a.x - (a.w || 16) / 2 >= p.x + p.w) continue;
      if (py <= p.y + Math.abs(p.vy) + 1 && a.y >= p.y) { a.y = p.y; a.vy = 0; a.onGround = true; a.onPlat = true; a.swPlat = p; return; }
    }
  };
  const P = SW.Player.prototype;
  const _pu = P.update; P.update = function (g, z) {
    const s = z && z.sw;
    if (s && g.scene === 'vs' && !this.dead) {
      // S + K on one of our platforms drops through it (tiles do this themselves)
      if (this.swPlat && this.onGround && I.held('down') && I.buffered('jump', 6)) { I.consume('jump'); this.swDrop = 14; this.swPlat = null; this.y += 2; this.onGround = false; this.enter('fall'); }
      const f = V.f && V.f.find(q => q.p === this);
      if (f && f.bot && V.phase === 'fight') botHelp(this, f, s);
    }
    return _pu.apply(this, arguments);
  };

  // ================= the bots use the stage =================
  const press = k => { if (!I.now[k]) { I.now[k] = true; I.lastHit[k] = SW.frame; } };
  const hold = dir => { I.now.left = dir < 0; I.now.right = dir > 0; };
  function platAbove(s, p, reach) {   // the best place to stand above p within reach: a tile platform or one of ours
    let best = null;
    const z = V.zone, cost = (x, y) => Math.abs(x - p.x) + (p.y - y) * 0.5;
    for (let ty = Math.floor(p.y / T) - 1; ty > 0 && p.y - ty * T <= reach; ty--) for (let tx = 0; tx < z.w; tx++) if (z.grid[ty][tx] === '=' && z.grid[ty - 1][tx] !== '=') { const x = tx * T + 8, y = ty * T, c = cost(x, y); if (p.y - y >= 20 && (!best || c < best.c)) best = { x, y, c }; }
    for (const q of s.plats) if (q.alive && !(q.kind === 'glass' && q.load > 30) && p.y - q.y >= 20 && p.y - q.y <= reach) { const x = SW.clamp(p.x, q.x + 14, q.x + q.w - 14), c = cost(x, q.y); if (!best || c < best.c) best = { x, y: q.y, c, q }; }
    return best;
  }
  const danger = s => !!(s.train && (s.train.warn > 0 || s.train.run));
  // whether this bot heeds the train's warning: Easy about half the time, Normal three in four, Hard always
  const heeds = (f, s) => { const tn = s.train; if (!tn.heed) tn.heed = {}; if (tn.heed[f.i] === undefined) { const d = V.mode === 'bvb' && f.i === 1 ? V.diff2 : V.diff; tn.heed[f.i] = Math.random() < [0.45, 0.75, 1, 1][d | 0]; } return tn.heed[f.i]; };
  const quiet = () => { ['attack', 'skill', 'special', 'awaken', 'dash', 'throw', 'down', 'charge', 'guard'].forEach(k => { I.now[k] = false; I.consume(k); }); };   // held and remembered presses alike
  function botHelp(p, f, s) {
    const foe = V.f[1 - f.i] && V.f[1 - f.i].p;
    if (!foe || f.stunT > 0 || p.state === 'hurt') { f.swGoal = null; return; }
    const dy = foe.y - p.y, adx = Math.abs(foe.x - p.x), onFloor = p.y >= FLOOR - 1, reach = s.lowG ? 170 : 92;
    // a climb in progress: run under the platform, jump, jump again near the top, and stop once standing on it
    let g = f.swGoal;
    if (g && (--g.t <= 0 || (p.onGround && p.y <= g.y + 2))) g = f.swGoal = null;
    if (!g) {
      const want = (danger(s) && onFloor && heeds(f, s)) || (dy < -30 && adx < 140 && p.onGround && Math.random() < 0.06)
        || (p.onGround && onFloor && adx > 70 && Math.random() < (s.lowG ? 0.03 : 0.008));
      if (want) { const t = platAbove(s, p, reach); if (t) g = f.swGoal = { x: t.x, y: t.y, q: t.q, t: 110, jumped: 0 }; }
    }
    if (g) {
      quiet();
      if (g.q) { g.y = g.q.y; g.x = SW.clamp(p.x, g.q.x + 14, g.q.x + g.q.w - 14); if (!g.q.alive) { f.swGoal = null; return; } }   // a lift moves, glass breaks
      const dx = g.x - p.x;
      hold(Math.abs(dx) > 4 ? Math.sign(dx) : 0);
      if (p.onGround) {
        if (g.jumped > 0 && p.y >= g.y + 6) g.jumped = 0;   // came down below it: try again
        I.now.jump = false; I.consume('jump');
        if (g.jumped === 0 && Math.abs(dx) < 40) { press('jump'); g.jumped = 1; }
      } else if (g.jumped === 1) { if (p.vy > -1.2 && p.y > g.y - 4) { I.now.jump = false; g.jumped = 2; } else I.now.jump = true; }   // full height, then
      else if (g.jumped === 2) { press('jump'); g.jumped = 3; }                                                                            // the second jump near the top
      else if (g.jumped >= 3) I.now.jump = true;
      else { I.now.jump = false; I.consume('jump'); }
      return;
    }
    if (danger(s)) { I.now.down = false; return; }   // up on a platform while the train passes: stay there
    if (p.swPlat && p.swPlat.kind === 'glass' && p.swPlat.load > 45) { hold(p.x < p.swPlat.x + p.swPlat.w / 2 ? -1 : 1); return; }   // off cracking glass
    if (dy > 36 && adx < 140 && p.onGround && (p.onPlat || p.swPlat) && Math.random() < 0.05) { quiet(); I.now.down = true; press('jump'); }   // after the foe, down through the platform
  }

  // ================= the twists, once per frame of the fight =================
  let lastT = -1;
  const _vu = V.update; V.update = function () {
    const hs = G.hitstop, r = _vu.apply(this, arguments), z = V.zone, s = z && z.sw;
    if (G.scene !== 'vs' || !s || !V.f || !V.f[0] || V.paused) { lastT = V.t; return r; }
    const n = Math.max(0, Math.min(4, V.t - lastT)); lastT = V.t;
    if (hs > 0 || !n) return r;
    if (s.key !== V.f[0].p) reset(s);   // a new round: everything back to the start
    for (let i = 0; i < n; i++) tick(s, z);
    return r;
  };
  function reset(s) {
    s.key = V.f[0].p; s.t = 0; s.banner = null; s.lowG = false;
    s.plats = s.d.plats ? s.d.plats() : [];
    if (s.id === 'sw_zero') s.train = { next: 600, warn: 0, x: 0, dir: 1, run: false, hit: new Set() };
    if (s.id === 'sw_ballast') s.grav = { next: 720, warn: 0, left: 0 };
    if (s.id === 'sw_engine') s.eng = { at: 0, next: 900, warn: 0, from: null, to: null, k: 0 };
  }
  const fighters = () => V.f.map(f => f.p).filter(p => p && !p.dead);
  function carry(p, dx, dy) { for (const q of fighters()) if (q.swPlat === p) { q.x += dx; q.y += dy; } }
  function tick(s, z) {
    s.t++;
    const fight = V.phase === 'fight' && ST.on;
    for (const p of s.plats) {
      const ox = p.x, oy = p.y;
      if (p.kind === 'lift') { p.y = Math.round((8.5 + 4 * Math.sin(s.t * 0.012 + p.phase)) * T); }
      if (p.kind === 'glass') glass(p, s);
      p.vy = p.y - oy;
      if (p.x !== ox || p.y !== oy) carry(p, p.x - ox, p.y - oy);
    }
    if (s.train && fight) train(s, z);
    if (s.grav && fight) gravity(s, z);
    if (s.eng && fight) engine(s);
    if (s.banner && --s.banner.t <= 0) s.banner = null;
  }
  const banner = (s, text, col, t) => { s.banner = { text, col, t: t || 120, max: t || 120 }; };

  // --- the Glass Sea: crack, shatter, grow back ---
  function glass(p, s) {
    if (!p.alive) { if (--p.gone <= 0) { p.alive = true; p.load = 0; p.grow = 20; } return; }
    if (p.grow > 0) p.grow--;
    const on = fighters().some(q => q.swPlat === p);
    p.load = on ? (p.load || 0) + 1 : Math.max(0, (p.load || 0) - 0.5);
    if (p.load > 40 && p.load % 12 === 0) { SW.audio.sfx('block'); fx.list.push({ k: 'p', x: p.x + Math.random() * p.w, y: p.y, vx: 0, vy: 1, g: 0.2, life: 18, max: 18, col: '#e8f0ff', s: 1 }); }
    if (p.load >= 80) {   // shatter
      p.alive = false; p.gone = 300; p.load = 0;
      for (const q of fighters()) if (q.swPlat === p) { q.swPlat = null; q.onGround = false; }
      SW.audio.sfx('explode'); fx.shake(3, 8);
      for (let i = 0; i < 18; i++) fx.list.push({ k: 'p', x: p.x + Math.random() * p.w, y: p.y + Math.random() * 4, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 2, g: 0.25, life: 30, max: 30, col: i % 3 ? '#c8e8ff' : '#ffffff', s: 2 });
    }
  }
  // --- Platform Zero: the train ---
  const TRAIN_LEN = 300, TRAIN_H = 38, TRAIN_V = 11;
  function train(s, z) {
    const tn = s.train;
    if (tn.run) {
      tn.x += tn.dir * TRAIN_V;
      if (s.t % 3 === 0) fx.shake(2, 4);
      const x0 = Math.min(tn.x, tn.x - tn.dir * TRAIN_LEN), x1 = Math.max(tn.x, tn.x - tn.dir * TRAIN_LEN);
      V.f.forEach(f => {
        const p = f.p;
        if (!p || p.dead || tn.hit.has(p) || p.x + 8 < x0 || p.x - 8 > x1 || p.y < FLOOR - TRAIN_H + 4) return;
        tn.hit.add(p);
        const keep = [G.state, G.player]; G.state = f.state; G.player = p;
        try { p.takeHit({ team: 'enemy', dmg: 14, kx: tn.dir * 7, ky: -6.5, stun: 34, heavy: true, down: true, unblockable: true, srcX: p.x - tn.dir * 20, hitSet: new Set(), quiet: true }, G); } finally { G.state = keep[0]; G.player = keep[1]; }
        fx.spark(p.x, p.y - 20, '#ffd24a', 12, 3.2);
      });
      if ((tn.dir > 0 && tn.x - TRAIN_LEN > z.pw + 20) || (tn.dir < 0 && tn.x + TRAIN_LEN < -20)) { tn.run = false; tn.next = 960; tn.dir = -tn.dir; }
      return;
    }
    if (tn.warn > 0) {
      if (--tn.warn === 0) { tn.run = true; tn.hit = new Set(); tn.x = tn.dir > 0 ? -20 : z.pw + 20; SW.audio.sfx('explode'); }
      else if (tn.warn % 20 === 0) SW.audio.sfx('deny');
      return;
    }
    if (--tn.next <= 0) { tn.warn = 120; tn.heed = null; banner(s, 'TRAIN INCOMING', '#ff5a5a', 120); }
  }
  // --- the Ballast Decks: gravity shifts ---
  function gravity(s, z) {
    const gv = s.grav;
    if (gv.left > 0) {
      if (s.t % 4 === 0) fx.list.push({ k: 'p', x: G.cam.x + Math.random() * W, y: FLOOR, vx: 0, vy: -0.6 - Math.random(), g: -0.005, life: 70, max: 70, col: '#b48cff', s: 1, a: 0.7 });
      if (--gv.left === 0) { s.lowG = false; gv.next = 720; banner(s, 'GRAVITY RETURNS', '#c8ccd8', 70); }
      return;
    }
    if (gv.warn > 0) { if (--gv.warn === 0) { s.lowG = true; gv.left = 360; SW.audio.sfx('awaken'); } return; }
    if (--gv.next <= 0) { gv.warn = 90; banner(s, 'GRAVITY SHIFT', '#b48cff', 150); }
  }
  // --- the Engine Core: the layout turns ---
  function engine(s) {
    const e = s.eng;
    if (e.to) {   // sliding into the new layout
      e.k++;
      const k = ease(e.k / 60);
      s.plats.forEach((p, i) => { const ox = p.x, oy = p.y; p.x = Math.round(e.from[i][0] + (e.to[i][0] * T - e.from[i][0]) * k); p.y = Math.round(e.from[i][1] + (e.to[i][1] * T - e.from[i][1]) * k); p.vy = p.y - oy; if (p.x !== ox || p.y !== oy) carry(p, p.x - ox, p.y - oy); });
      if (e.k >= 60) { e.to = null; e.next = 900; }
      return;
    }
    if (e.warn > 0) {
      if (--e.warn === 0) { e.at = (e.at + 1) % ENGINE.length; e.from = s.plats.map(p => [p.x, p.y]); e.to = ENGINE[e.at]; e.k = 0; SW.audio.sfx('heavy'); fx.shake(4, 20); }
      return;
    }
    if (--e.next <= 0) { e.warn = 120; banner(s, 'THE ENGINE TURNS', '#ffd24a', 120); }
  }

  // ================= drawing =================
  const _dd = SW.Zone.prototype.drawDecor; SW.Zone.prototype.drawDecor = function (ctx, d, cx, cy) {
    if (d.kind !== 'swstage') return _dd.apply(this, arguments);
    const s = this.sw;
    if (!s) return;
    const th = art.themes[this.theme] || {};
    for (const p of s.plats) drawPlat(ctx, p, p.x - cx, p.y - cy, th, s);
    if (s.eng && s.eng.warn > 0 && s.eng.warn % 16 < 10) ENGINE[(s.eng.at + 1) % ENGINE.length].forEach(([x, y]) => outline(ctx, x * T - cx, y * T - cy, 5 * T, '#ffd24a'));
    if (s.train) drawTrain(ctx, s, cx, cy);
  };
  function outline(ctx, x, y, w, col) { art.rect(ctx, col, x, y, w, 1); art.rect(ctx, col, x, y + 5, w, 1); art.rect(ctx, col, x, y, 1, 6); art.rect(ctx, col, x + w - 1, y, 1, 6); }
  function drawPlat(ctx, p, x, y, th, s) {
    x = Math.round(x); y = Math.round(y);
    if (p.kind === 'lift') {
      for (const cxl of [x + 8, x + p.w - 9]) art.rect(ctx, '#5a6078', cxl, 0, 1, y);                    // cables
      art.rect(ctx, '#2a2d40', x, y, p.w, 8); art.rect(ctx, th.plat || '#8a92a8', x, y, p.w, 3); art.rect(ctx, '#e0e6f0', x, y, p.w, 1);
      for (let i = 6; i < p.w - 4; i += 12) art.rect(ctx, '#f5c542', x + i, y + 4, 6, 2);                // hazard stripes
      art.glow(ctx, x + p.w / 2, y + 10, 18, '#ffd24a', 0.12);
    } else if (p.kind === 'glass') {
      if (!p.alive) return;
      const a = p.grow > 0 ? 1 - p.grow / 20 : 1, shake = p.load > 55 ? (SW.frame % 2 ? 1 : -1) : 0;
      ctx.globalAlpha = 0.55 * a; art.rect(ctx, '#bfe8ff', x + shake, y, p.w, 6); ctx.globalAlpha = 0.9 * a; art.rect(ctx, '#ffffff', x + shake, y, p.w, 1); ctx.globalAlpha = 1;
      const gl = (SW.frame * 2 + p.x) % (p.w + 40) - 20; if (gl > 0 && gl < p.w - 4) art.rect(ctx, '#ffffff', x + gl + shake, y + 2, 4, 2);   // a glint runs along
      if (p.load > 40) { const n = p.load > 60 ? 4 : 2; for (let i = 0; i < n; i++) { const cx0 = x + ((p.x * 7 + i * 37) % (p.w - 10)) + 5; art.line(ctx, '#ffffff', cx0, y, cx0 + (i % 2 ? 4 : -4), y + 5, 1); } }
    } else if (p.kind === 'engine') {
      art.rect(ctx, '#2a1e10', x, y, p.w, 8); art.rect(ctx, '#c89a40', x, y, p.w, 3); art.rect(ctx, '#fff3c0', x, y, p.w, 1);
      const pulse = 0.5 + 0.5 * Math.sin(SW.frame * 0.1 + p.x * 0.05);
      ctx.globalAlpha = 0.5 + 0.5 * pulse; art.rect(ctx, '#ffd24a', x + 4, y + 5, p.w - 8, 1); ctx.globalAlpha = 1;
      art.glow(ctx, x + p.w / 2, y + 6, 22, '#ffd24a', 0.08 + 0.06 * pulse);
    }
  }
  function drawTrain(ctx, s, cx, cy) {
    const tn = s.train, fy = FLOOR - cy;
    if (tn.warn > 0 && tn.warn % 20 < 10) for (const lx of [8, W - 14]) { art.rect(ctx, '#ff3b3b', lx, fy - 12, 6, 6); art.glow(ctx, lx + 3, fy - 9, 26, '#ff3b3b', 0.35); }
    if (!tn.run) return;
    const d = tn.dir, head = tn.x - cx;
    for (let c = 0; c < 4; c++) {   // four cars, the first with the cab
      const x1 = head - d * c * (TRAIN_LEN / 4), x0 = x1 - d * (TRAIN_LEN / 4 - 4), lx = Math.min(x0, x1), w = Math.abs(x1 - x0);
      art.rect(ctx, '#1c2034', lx, fy - TRAIN_H, w, TRAIN_H); art.rect(ctx, '#8d99ae', lx, fy - TRAIN_H, w, 3); art.rect(ctx, '#f5c542', lx, fy - 12, w, 2);
      for (let i = 6; i < w - 10; i += 14) art.rect(ctx, '#bfefff', lx + i, fy - TRAIN_H + 8, 9, 8);
    }
    art.rect(ctx, '#fff3c0', head - (d > 0 ? 3 : 0), fy - 20, 3, 6); art.glow(ctx, head + d * 20, fy - 17, 40, '#fff3c0', 0.3);   // the headlight
    for (let i = 0; i < 4; i++) art.rect(ctx, '#ffffff', head - d * (TRAIN_LEN + 10 + i * 18), fy - 30 + i * 7, 12, 1);         // wind behind it
  }
  const _vd = V.draw; V.draw = function (ctx) {
    _vd.apply(this, arguments);
    const s = V.zone && V.zone.sw;
    if (G.scene !== 'vs' || !s || !s.banner || V.phase === 'menu' || V.phase === 'pick') return;
    const b = s.banner, a = Math.min(1, b.t / 15, (b.max - b.t) / 8);
    if ((b.max - b.t) % 24 > 16 && b.t > 30) return;   // it blinks while it warns
    ctx.globalAlpha = a; SW.text(ctx, b.text, W / 2, 46, b.col, { align: 'center', scale: 2 }); ctx.globalAlpha = 1;
  };
})();
