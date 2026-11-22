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
//   The Tether Fields   (invasion) a gale blows across the field from one side: fighters are pushed, jumps most of all
//   The Heartroot       (invasion) root platforms wither and grow back; rootlight floods the floor: get off it
//   The Crown over      (invasion) the Hollow Crown hangs over the Crater and its legion marches behind; it marks
//     the Crater                   spots on the ground, and chains slam down on them
// Lifts, glass and the Engine's plates are platforms of this file's own (not tiles): fighters land on them from above,
// stand on them, ride them and drop through them like any other platform. The bots climb and drop to reach their foe,
// and get out of the train's way. SW.stages.on = false: the twists stop (the layouts stay).
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, art = SW.art, fx = SW.fx, I = SW.input, T = 16, W = SW.W;
  if (!V || !V.STAGES || !SW.zones || !SW.zones.versus || !SW.move) return;
  // on: the twists run. Off (H on the Versus menu's Stage row, kept in the profile): the layouts stay, lifts still ride
  // and the Engine's plates stay where they start, but no train, gravity shift, gale, rootlight, chains, cracking glass
  // or withering root
  const ST = SW.stages = { on: !(SW.profile && SW.profile.stageHazOff) };
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
      plats: () => ENGINE[0].map(([x, y]) => sp(x, y, 5, 'engine')) },
    // the Hollow Crown's invasion (the new story's chapters 5-6): three of the places it falls on
    sw_tether:  { name: 'The Tether Fields', base: 'tether', tiles(z) { z.plat(4, 11, 6); z.plat(28, 11, 6); z.plat(15, 9, 8); z.plat(8, 6, 4); z.plat(26, 6, 4); } },
    sw_roots:   { name: 'The Heartroot', base: 'heart', tiles(z) { z.plat(16, 5, 6); },
      plats: () => [sp(4, 11, 6, 'root', { ph: 0 }), sp(28, 11, 6, 'root', { ph: 330 }), sp(10, 8, 5, 'root', { ph: 160 }), sp(23, 8, 5, 'root', { ph: 490 })] },
    sw_crown:   { name: 'The Crown over the Crater', base: 'vs_crater', tiles(z) { z.plat(6, 11, 5); z.plat(27, 11, 5); z.plat(15, 8, 8); } }
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
    z.sw = { id: z.theme, d, plats: d.plats ? d.plats() : [], t: 0, key: null, push: 0 };
    z.decor.push({ kind: 'swstage', x: (z.w * T) / 2 });   // draws the stage's own platforms and the train (behind the fighters)
  };

  // ================= physics: our platforms, the drop, low gravity =================
  const _mv = SW.move; SW.move = function (a, z) {
    const s = z && z.sw;
    if (!s) return _mv.apply(this, arguments);
    if (s.lowG && !a.onGround) a.vy -= GRAV * 0.55;   // the ballast has shifted: everything airborne floats
    const py = a.y;
    const gust = s.push && a instanceof SW.Player && !a.dead ? s.push * (a.onGround ? (a.state === 'guard' ? 0.25 : 0.6) : 1.35) : 0;   // the gale
    const vx0 = a.vx;
    if (gust) a.vx = vx0 + gust;
    _mv.apply(this, arguments);
    if (gust && a.vx === vx0 + gust) a.vx = vx0;   // the push moves you, it doesn't stay in your speed (unless a wall stopped it)
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
    for (const q of s.plats) if (q.alive && !(q.kind === 'glass' && q.load > 30) && !(q.kind === 'root' && q.st !== 'up') && p.y - q.y >= 20 && p.y - q.y <= reach) { const x = SW.clamp(p.x, q.x + 14, q.x + q.w - 14), c = cost(x, q.y); if (!best || c < best.c) best = { x, y: q.y, c, q }; }
    return best;
  }
  const floorHaz = s => s.train || s.flood || s.floorHaz;   // the hazards that sweep the floor: the train, the rootlight (floorHaz: crazy-core.js stages)
  const danger = s => { const h = floorHaz(s); return !!(h && (h.warn > 0 || h.run)); };
  // whether this bot heeds a warning: Easy about half the time, Normal three in four, Hard always (asked once per warning)
  const heeds = (f, h) => { if (!h.heed) h.heed = {}; if (h.heed[f.i] === undefined) { const d = V.mode === 'bvb' && f.i === 1 ? V.diff2 : V.diff; h.heed[f.i] = Math.random() < [0.45, 0.75, 1, 1][d | 0]; } return h.heed[f.i]; };
  const quiet = () => { ['attack', 'skill', 'special', 'awaken', 'dash', 'throw', 'down', 'charge', 'guard'].forEach(k => { I.now[k] = false; I.consume(k); }); };   // held and remembered presses alike
  function botHelp(p, f, s) {
    const foe = V.f[1 - f.i] && V.f[1 - f.i].p;
    if (!foe || f.stunT > 0 || p.state === 'hurt') { f.swGoal = null; return; }
    const dy = foe.y - p.y, adx = Math.abs(foe.x - p.x), onFloor = p.y >= FLOOR - 1, reach = s.lowG ? 170 : 92;
    // the Crown's marks: step out from under a chain
    const ch = s.chains || s.marks;   // marks: crazy-core.js stages
    if (ch && ch.warn > 0 && heeds(f, ch)) { const m = ch.xs.find(x => Math.abs(x - p.x) < 28); if (m !== undefined) { f.swGoal = null; quiet(); hold(p.x < m ? -1 : 1); return; } }
    // a climb in progress: run under the platform, jump, jump again near the top, and stop once standing on it
    let g = f.swGoal;
    if (g && (--g.t <= 0 || (p.onGround && p.y <= g.y + 2))) g = f.swGoal = null;
    if (!g && !s.noClimb) {   // noClimb: a hazard sweeps the high air (crazy-core.js)
      const want = (danger(s) && onFloor && heeds(f, floorHaz(s))) || (dy < -30 && adx < 140 && p.onGround && Math.random() < 0.06)
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
    s.push = 0;
    if (s.id === 'sw_tether') s.wind = { next: 540, warn: 0, left: 0, dir: Math.random() < 0.5 ? 1 : -1 };
    if (s.id === 'sw_roots') s.flood = { next: 780, warn: 0, left: 0, run: false };
    if (s.id === 'sw_crown') s.chains = { next: 600, warn: 0, run: 0, xs: [], hit: null };
  }
  const fighters = () => V.f.map(f => f.p).filter(p => p && !p.dead);
  function carry(p, dx, dy) { for (const q of fighters()) if (q.swPlat === p) { q.x += dx; q.y += dy; } }
  function tick(s, z) {
    s.t++;
    const fight = V.phase === 'fight' && ST.on;
    for (const p of s.plats) {
      const ox = p.x, oy = p.y;
      if (p.kind === 'lift') { p.y = Math.round((8.5 + 4 * Math.sin(s.t * 0.012 + p.phase)) * T); }
      if (p.kind === 'glass' && ST.on) glass(p, s);
      if (p.kind === 'root') root(p, s, fight);
      p.vy = p.y - oy;
      if (p.x !== ox || p.y !== oy) carry(p, p.x - ox, p.y - oy);
    }
    if (s.train && fight) train(s, z);
    if (s.grav && fight) gravity(s, z);
    if (s.eng && fight) engine(s);
    if (s.wind && fight) wind(s);
    if (s.flood && fight) flood(s);
    if (s.chains && fight) chains(s);
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
  // a stage hazard hits a fighter (as the train does: counted as that fighter's own hit taken)
  function stageHit(f, atk) {
    const p = f.p, keep = [G.state, G.player]; G.state = f.state; G.player = p;
    try { p.takeHit(Object.assign({ team: 'enemy', hitSet: new Set(), quiet: true, unblockable: true }, atk), G); } finally { G.state = keep[0]; G.player = keep[1]; }
  }
  // --- the Tether Fields: the gale ---
  function wind(s) {
    const w = s.wind;
    if (w.left > 0) {
      s.push = w.dir * Math.min(1, w.left / 30, (300 - w.left) / 20);   // it builds, blows, and dies away
      if (s.t % 2 === 0) fx.list.push({ k: 'p', x: G.cam.x + (w.dir > 0 ? -4 : W + 4), y: G.cam.y + 20 + Math.random() * 200, vx: w.dir * (5 + Math.random() * 3), vy: (Math.random() - 0.5) * 0.4, g: 0, life: 90, max: 90, col: Math.random() < 0.3 ? '#f0d8a8' : '#ffffff', s: 1, a: 0.6 });
      if (--w.left === 0) { s.push = 0; w.next = 600 + Math.floor(Math.random() * 240); w.dir = Math.random() < 0.5 ? 1 : -1; }
      return;
    }
    if (w.warn > 0) { if (--w.warn === 0) { w.left = 300; SW.audio.sfx('dash'); } else if (w.warn % 30 === 0 && fx.list.length < 400) for (let i = 0; i < 4; i++) fx.list.push({ k: 'p', x: G.cam.x + Math.random() * W, y: FLOOR - 2, vx: w.dir * 1.5, vy: -0.3, g: 0, life: 30, max: 30, col: '#f0d8a8', s: 1, a: 0.6 }); return; }
    if (--w.next <= 0) { w.warn = 90; banner(s, w.dir > 0 ? 'GALE FROM THE WEST' : 'GALE FROM THE EAST', '#bfe8ff', 120); }
  }
  // --- the Heartroot: roots wither and grow back ---
  const ROOT_UP = 600;
  function root(p, s, fight) {
    if (p.st === undefined) { p.st = 'up'; p.k = ROOT_UP + p.ph; }
    if (!fight) return;
    if (p.st === 'up' && s.flood && (s.flood.warn > 0 || s.flood.run)) return;   // no root lets go while the rootlight is out
    if (--p.k > 0) {
      if (p.st === 'wither' && p.k % 10 === 0) fx.list.push({ k: 'p', x: p.x + Math.random() * p.w, y: p.y + 4, vx: 0, vy: 0.6, g: 0.1, life: 24, max: 24, col: '#6a5a3a', s: 1 });
      return;
    }
    if (p.st === 'up') { p.st = 'wither'; p.k = 90; }
    else if (p.st === 'wither') {
      p.st = 'gone'; p.k = 240; p.alive = false; SW.audio.sfx('block');
      for (const q of fighters()) if (q.swPlat === p) { q.swPlat = null; q.onGround = false; }
      for (let i = 0; i < 10; i++) fx.list.push({ k: 'p', x: p.x + Math.random() * p.w, y: p.y + 2, vx: (Math.random() - 0.5) * 2, vy: 0.5, g: 0.2, life: 28, max: 28, col: i % 2 ? '#6a5a3a' : '#4a5a2a', s: 2 });
    } else if (p.st === 'gone') { p.st = 'grow'; p.k = 40; }
    else { p.st = 'up'; p.k = ROOT_UP; p.alive = true; }
  }
  // --- the Heartroot: the rootlight floods the floor ---
  function flood(s) {
    const fl = s.flood;
    if (fl.run) {
      if (s.t % 3 === 0) fx.list.push({ k: 'p', x: G.cam.x + Math.random() * W, y: FLOOR - 1, vx: 0, vy: -0.8 - Math.random(), g: 0, life: 40, max: 40, col: Math.random() < 0.4 ? '#eaffd0' : '#9ad890', s: 1, a: 0.8 });
      V.f.forEach(f => {
        const p = f.p;
        if (!p || p.dead || !p.onGround || p.y < FLOOR - 1 || p.swPlat || (p.swBurn || 0) > s.t) return;
        p.swBurn = s.t + 40;
        stageHit(f, { dmg: 6, kx: 0, ky: -5, stun: 18 });
        fx.spark(p.x, p.y - 6, '#b8ff40', 8, 2);
      });
      if (--fl.left <= 0) { fl.run = false; fl.next = 900 + Math.floor(Math.random() * 180); }
      return;
    }
    if (fl.warn > 0) { if (--fl.warn === 0) { fl.run = true; fl.left = 200; SW.audio.sfx('awaken'); fx.shake(2, 10); } else if (fl.warn % 24 === 0) SW.audio.sfx('deny'); return; }
    if (--fl.next <= 0) { fl.warn = 120; fl.heed = null; banner(s, 'ROOTLIGHT RISING', '#9ad890', 120); }
  }
  // --- the Crown over the Crater: chains slam down on marked spots ---
  const CHAIN_FALL = 8, CHAIN_RUN = 44;
  function chains(s, z) {
    const c = s.chains;
    if (c.run > 0) {
      const k = CHAIN_RUN - c.run;   // frames since the drop
      if (k === CHAIN_FALL) { SW.audio.sfx('explode'); fx.shake(4, 10); c.xs.forEach(x => { for (let i = 0; i < 8; i++) fx.list.push({ k: 'p', x: x + (Math.random() - 0.5) * 16, y: FLOOR - 2, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 2.5, g: 0.2, life: 26, max: 26, col: i % 2 ? '#b48cff' : '#5a4a3a', s: 2 }); }); }
      if (k >= CHAIN_FALL - 2 && k <= CHAIN_FALL + 6) V.f.forEach(f => {
        const p = f.p;
        if (!p || p.dead || c.hit.has(p)) return;
        const x = c.xs.find(cx => Math.abs(cx - p.x) < 14);
        if (x === undefined) return;
        c.hit.add(p);
        stageHit(f, { dmg: 13, kx: (p.x < x ? -1 : 1) * 4, ky: -6, stun: 34, heavy: true, down: true, srcX: x });
        fx.spark(p.x, p.y - 18, '#b48cff', 12, 3);
      });
      if (--c.run === 0) c.next = 540 + Math.floor(Math.random() * 180);
      return;
    }
    if (c.warn > 0) {
      if (--c.warn === 0) { c.run = CHAIN_RUN; c.hit = new Set(); SW.audio.sfx('heavy'); }
      else if (c.warn % 20 === 0) SW.audio.sfx('deny');
      return;
    }
    if (--c.next <= 0) {   // one mark under each fighter (where they stand now) and one more somewhere else
      const pw = V.zone.pw || V.zone.w * T, cl = x => SW.clamp(Math.round(x), 24, pw - 24);
      c.xs = fighters().map(p => cl(p.x + (Math.random() - 0.5) * 16));
      c.xs.push(cl(40 + Math.random() * (pw - 80)));
      c.warn = 80; c.heed = null; banner(s, 'THE CROWN STRIKES', '#b48cff', 100);
    }
  }

  // ================= drawing =================
  const _dd = SW.Zone.prototype.drawDecor; SW.Zone.prototype.drawDecor = function (ctx, d, cx, cy) {
    if (d.kind !== 'swstage') return _dd.apply(this, arguments);
    const s = this.sw;
    if (!s) return;
    const th = art.themes[this.theme] || {};
    if (s.id === 'sw_crown') drawCrown(ctx, s, cx, cy);
    if (s.id === 'sw_tether') drawTethers(ctx, s, cx, cy);
    for (const p of s.plats) drawPlat(ctx, p, p.x - cx, p.y - cy, th, s);
    if (s.eng && s.eng.warn > 0 && s.eng.warn % 16 < 10) ENGINE[(s.eng.at + 1) % ENGINE.length].forEach(([x, y]) => outline(ctx, x * T - cx, y * T - cy, 5 * T, '#ffd24a'));
    if (s.train) drawTrain(ctx, s, cx, cy);
    if (s.flood) drawFlood(ctx, s, cx, cy);
    if (s.chains) drawChains(ctx, s, cx, cy);
  };
  // the Hollow Crown: a crown the size of a city with nothing inside it, and the Hollow Legion marching on the far rim
  function drawCrown(ctx, s, cx, cy) {
    const x0 = Math.round(W / 2 - cx * 0.12 + 18), y0 = Math.round(44 - cy * 0.1 + Math.sin(SW.frame * 0.01) * 2), rx = 140, ry = 11;
    const lit = s.chains && (s.chains.warn > 0 || s.chains.run > 0) ? 1 : 0;
    art.glow(ctx, x0, y0, 120, '#b48cff', 0.10 + 0.08 * lit);
    ctx.save(); ctx.lineCap = 'round';
    const band = (col, lw) => {
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.ellipse(x0, y0 + 12, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();   // the band
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {   // the points: tall in front, shorter toward the back
        const a = Math.PI * (i / 8), bx = x0 - Math.cos(a) * rx, by = y0 + 12 + Math.sin(a) * ry * 0.2, h = 20 + Math.sin(a) * 26;
        ctx.moveTo(bx - 10, by); ctx.lineTo(bx, by - h); ctx.lineTo(bx + 10, by);
      }
      ctx.stroke();
    };
    band('#140a24', 6); band(lit ? '#d8c0ff' : '#8a6ac8', 2);
    ctx.restore();
    for (let i = 0; i < 7; i++) { const a = Math.PI * (i + 0.5) / 7, px = x0 - Math.cos(a) * rx, py = y0 + 12 + Math.sin(a) * ry; art.rect(ctx, '#f0e0ff', Math.round(px), Math.round(py), 2, 2); }   // hollow lights on the band
    // the legion: two ranks of small dark soldiers with violet eyes, marching along the crater's far rim (the lit band
    // of the backdrop), dark against it
    const ly = Math.round(98 - cy * 0.3), step = Math.floor(SW.frame / 10) % 2;
    for (let r = 0; r < 2; r++) {
      const off = (SW.frame * (0.25 + r * 0.1) + r * 7) % 10, yy = ly + r * 7, par = 0.3 + r * 0.05;
      ctx.globalAlpha = 0.75 + r * 0.2;
      for (let x = -10 - ((cx * par) % 10) + off; x < W + 10; x += 10) {
        const xx = Math.round(x), bob = (Math.floor(x / 10) + step) % 2;
        art.rect(ctx, '#140a20', xx, yy + bob, 3, 6); art.rect(ctx, '#140a20', xx + (step ? 0 : 1), yy + 6, 1, 2); art.rect(ctx, '#140a20', xx + (step ? 2 : 1), yy + 6, 1, 2);
        art.rect(ctx, '#140a20', xx + 3, yy - 5 + bob, 1, 10);   // spear
        art.rect(ctx, '#e0c0ff', xx + 1, yy + 1 + bob, 1, 1);    // eyes
      }
    }
    ctx.globalAlpha = 1;
  }
  // the Tether Fields: tethers as thick as towers rising from anchor stones into the clouds; they sway in a gale
  function drawTethers(ctx, s, cx, cy) {
    const sway = s.push * 10;
    for (const [ax, lean] of [[110, 40], [330, -30], [520, 25]]) {
      const bx = Math.round(ax - cx * 0.6), by = Math.round(FLOOR - cy), tx = bx + lean + sway;
      art.line(ctx, '#3a2818', bx, by, tx, -10, 9); art.line(ctx, '#8a6a4a', bx, by, tx, -10, 6); art.line(ctx, '#c8a070', bx - 2, by, tx - 2, -10, 1);
      art.line(ctx, '#4a8a4a', bx + 3, by, tx + 3, -10, 2);   // the rootlight pipe clamped along it
      for (let k = 0.15; k < 1; k += 0.2) { const px = Math.round(bx + (tx - bx) * k), py = Math.round(by + (-10 - by) * k); art.rect(ctx, '#5a4a3a', px - 5, py, 11, 3); }   // clamps
      art.rect(ctx, '#5a4a3a', bx - 14, by - 10, 28, 10); art.rect(ctx, '#8a7a5a', bx - 14, by - 10, 28, 2);   // the anchor stone
    }
    if (!s.push) return;
    const a = Math.abs(s.push), d = Math.sign(s.push);   // streaks of the gale, racing across
    for (let i = 0; i < 18; i++) {
      const sp0 = 7 + (i * 5) % 6, len = 18 + (i * 13) % 26, y = 24 + (i * 53) % 190;
      let x = (SW.frame * sp0 + i * 97) % (W + 60) - 30; if (d < 0) x = W - x;
      ctx.globalAlpha = a * (0.35 + 0.25 * (i % 3) / 2); art.rect(ctx, i % 4 ? '#ffffff' : '#f0d8a8', Math.round(x - (d > 0 ? len : 0)), y, len, 1);
    }
    ctx.globalAlpha = 1;
  }
  function drawFlood(ctx, s, cx, cy) {
    const fl = s.flood, fy = FLOOR - cy;
    if (fl.warn > 0) { if (fl.warn % 24 < 12) { ctx.globalAlpha = 0.5; art.rect(ctx, '#9ad890', 0, fy - 2, W, 2); ctx.globalAlpha = 1; } return; }
    if (!fl.run) return;
    const a = Math.min(1, fl.left / 20, (200 - fl.left) / 10);
    ctx.globalAlpha = 0.35 * a; art.rect(ctx, '#b8ff40', 0, fy - 10, W, 10); ctx.globalAlpha = 0.8 * a; art.rect(ctx, '#eaffd0', 0, fy - 2, W, 2);
    for (let i = 0; i < W; i += 6) { const h = 3 + Math.round(3 * Math.sin(SW.frame * 0.2 + i * 0.3)); art.rect(ctx, '#9ad890', i, fy - 2 - h, 2, h); }
    ctx.globalAlpha = 1; art.glow(ctx, W / 2, fy, 260, '#b8ff40', 0.12 * a);
  }
  function drawChains(ctx, s, cx, cy) {
    const c = s.chains, fy = FLOOR - cy;
    if (c.warn > 0) {
      const on = c.warn % 16 < 10;
      for (const x of c.xs) {
        const xx = Math.round(x - cx);
        art.glow(ctx, xx, fy - 2, 22, '#b48cff', on ? 0.4 : 0.2);
        if (on) { art.rect(ctx, '#d8c0ff', xx - 12, fy - 2, 24, 2); art.rect(ctx, '#d8c0ff', xx - 1, fy - 8, 2, 4); }
        ctx.globalAlpha = 0.25; art.rect(ctx, '#b48cff', xx, 0, 1, fy); ctx.globalAlpha = 1;   // where it will fall
      }
      return;
    }
    if (c.run <= 0) return;
    const k = CHAIN_RUN - c.run, down = k < CHAIN_FALL ? k / CHAIN_FALL : k > CHAIN_RUN - 12 ? (CHAIN_RUN - k) / 12 : 1, head = Math.round(fy * down);
    for (const x of c.xs) {
      const xx = Math.round(x - cx);
      art.glow(ctx, xx, head / 2, 30, '#b48cff', 0.12);
      for (let y = head - 10, n = 0; y > -8; y -= 7, n++) { if (n % 2) art.rect(ctx, '#3a2a5a', xx - 3, y, 6, 6), art.rect(ctx, '#c8b0f0', xx - 3, y, 6, 1); else art.rect(ctx, '#8a6ac8', xx - 1, y - 1, 2, 8); }   // links
      art.rect(ctx, '#1c1030', xx - 8, head - 12, 16, 12); art.rect(ctx, '#d8c0ff', xx - 8, head - 12, 16, 2); art.rect(ctx, '#b48cff', xx - 2, head - 8, 4, 4);   // the weight
      if (k >= CHAIN_FALL && k < CHAIN_FALL + 10) art.glow(ctx, xx, fy - 4, 40, '#b48cff', 0.35);
    }
  }
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
    } else if (p.kind === 'root') {
      if (p.st === 'gone') return;
      const grow = p.st === 'grow' ? 1 - p.k / 40 : 1, w = Math.max(2, Math.round(p.w * grow)), x0 = x + Math.round((p.w - w) / 2);
      const shake = p.st === 'wither' && p.k < 45 ? (SW.frame % 2 ? 1 : -1) : 0, dry = p.st === 'wither' ? 1 - p.k / 90 : 0;
      if (p.st === 'grow') ctx.globalAlpha = 0.4 + 0.6 * grow;
      art.rect(ctx, '#2a1e10', x0 + shake, y, w, 9); art.rect(ctx, dry > 0.5 ? '#6a5a3a' : '#4a5a2a', x0 + shake, y, w, 3); art.rect(ctx, '#9a8a5a', x0 + shake, y, w, 1);
      for (let i = 5; i < w - 4; i += 9) { art.rect(ctx, '#2a1e10', x0 + i + shake, y + 9, 2, 3 + (i * 7) % 5); }   // root hairs hanging below
      const pulse = 0.5 + 0.5 * Math.sin(SW.frame * 0.08 + p.x * 0.03);
      if (dry < 0.6) { ctx.globalAlpha *= (1 - dry) * (0.5 + 0.5 * pulse); art.rect(ctx, '#9ad890', x0 + 3 + shake, y + 5, w - 6, 1); ctx.globalAlpha = 1; art.glow(ctx, x0 + w / 2, y + 5, 20, '#7dff9a', 0.08 * (1 - dry)); }
      ctx.globalAlpha = 1;
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
  // ================= the Versus menu: while the Stage row is chosen, a picture of the stage and what it does =================
  const TWIST = {
    sw_noble: 'Two low platforms and one high one. No tricks.',
    sw_skylift: 'Two cargo lifts ride up and down, carrying whoever stands on them.',
    sw_ballast: 'Now and then gravity drops: everyone floats, and the top decks come within reach.',
    sw_glass: 'Glass platforms crack under whoever stands on them, shatter, and grow back.',
    sw_zero: 'After a warning, a train crosses the floor: get up on a platform.',
    sw_engine: 'Every fifteen seconds the Engine turns, and its plates slide into a new layout.',
    sw_tether: 'A gale blows across the field and pushes everyone, jumps most of all.',
    sw_roots: 'Root platforms wither and grow back. Rootlight floods the floor: get off it.',
    sw_crown: 'The Crown marks spots on the ground, and chains slam down on them. Step aside.'
  };
  ST.TWIST = TWIST;   // crazy-core.js adds its stages' lines
  const pv = { id: undefined, zone: null, can: null, ctx: null };
  function previewZone(id) {   // built once per stage shown (the same arena the match builds), kept while it stays chosen
    if (pv.id === id) return pv.zone;
    pv.id = id; pv.zone = null;
    const zv = SW.zones.versus, keep = zv.theme;
    try { zv.theme = art.themes[id] ? id : 'arena'; pv.zone = new SW.Zone('versus', G); } catch (e) { pv.zone = null; } finally { zv.theme = keep; }
    return pv.zone;
  }
  function wrap(s, n) { const out = []; let line = ''; for (const w of s.split(' ')) { if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; } if (line) out.push(line); return out; }
  function drawPreview(ctx) {
    const st = V.STAGES[V.stage]; if (!st) return;
    const id = st[1], x = 28, y = 154, w = 432, h = 88, pw = 144, ph = 81, px = x + 4, py = y + 4;
    art.rect(ctx, '#0b0c1c', x, y, w, h); SW.ui.panel(ctx, x, y, w, h, '#3a3d55', 0.95);   // over the controls help while this row is chosen
    if (id) {
      const z = previewZone(id);
      if (!pv.can) { const c = SW.canvas(W, SW.H); pv.can = c[0]; pv.ctx = c[1]; }
      if (z) {
        const fl = fx.list; fx.list = [];   // the last match's sparks are not part of the stage
        try { z.draw(pv.ctx, { x: Math.max(0, (z.pw - W) / 2), y: Math.max(0, z.ph - SW.H) }, { player: null }); } catch (e) { /* a picture is a nicety */ } finally { fx.list = fl; }
        ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(pv.can, px, py, pw, ph); ctx.restore();
      }
    } else {
      art.rect(ctx, '#1c2034', px, py, pw, ph);
      SW.text(ctx, '?', px + pw / 2, py + ph / 2 - 10, '#f5c542', { align: 'center', scale: 3 });
    }
    outline(ctx, px - 1, py - 1, pw + 2, '#8a92b8'); art.rect(ctx, '#8a92b8', px - 1, py + ph, pw + 2, 1); art.rect(ctx, '#8a92b8', px - 1, py, 1, ph); art.rect(ctx, '#8a92b8', px + pw, py, 1, ph);
    const tx = px + pw + 10;
    const tr = SW.i18n && SW.i18n.tr ? SW.i18n.tr : s => s, name = tr(st[0]);
    SW.text(ctx, name, tx, py + (name.length > 21 ? 8 : 4), '#f5c542', { scale: name.length > 21 ? 1 : 2, raw: true });   // a long name in small type, so it fits
    const twist = !id ? 'A different stage every match.' : TWIST[id] || 'Flat ground, no tricks.';
    const tw = tr(twist), cjk = SW.i18n && SW.i18n.cjk && SW.i18n.cjk();
    (cjk ? (tw.match(/.{1,21}/g) || []) : wrap(tw, 44)).forEach((l, i) => SW.text(ctx, l, tx, py + 26 + i * 11, '#ffffff', { raw: true }));
    if (id && TWIST[id] && id !== 'sw_noble') {   // a stage with a twist: the hazards switch
      SW.text(ctx, tr('A / D: change stage') + '    ' + tr(ST.on ? 'H: hazards on' : 'H: hazards off'), tx, py + ph - 8, '#8a92b8', { raw: true });
      if (!ST.on) SW.text(ctx, 'Hazards off: the layout only.', tx, py + ph - 20, '#ffb020');
    } else SW.text(ctx, 'A / D: change stage', tx, py + ph - 8, '#8a92b8');
  }
  function stageRowChosen() { return G.scene === 'vs' && V.phase === 'menu' && V.menuRows && V.menuRows()[V.row] === 'stage'; }
  // H on the Stage row turns the hazards on or off (read from the raw key, on its press)
  let hWas = false;
  const _vu2 = V.update; V.update = function () {
    const h = !!I.raw.KeyH;
    if (h && !hWas && stageRowChosen()) {
      const st = V.STAGES[V.stage];
      if (st && TWIST[st[1]] && st[1] !== 'sw_noble') {
        ST.on = !ST.on; SW.audio.sfx('select');
        if (SW.profile) { SW.profile.stageHazOff = !ST.on; if (SW.saveProfile) SW.saveProfile(); }
      }
    }
    hWas = h;
    return _vu2.apply(this, arguments);
  };
  const _vd = V.draw; V.draw = function (ctx) {
    _vd.apply(this, arguments);
    if (G.scene === 'vs' && V.phase === 'menu' && V.menuRows && V.menuRows()[V.row] === 'stage') drawPreview(ctx);
    const s = V.zone && V.zone.sw;
    if (G.scene !== 'vs' || !s || !s.banner || V.phase === 'menu' || V.phase === 'pick') return;
    const b = s.banner, a = Math.min(1, b.t / 15, (b.max - b.t) / 8);
    if ((b.max - b.t) % 24 > 16 && b.t > 30) return;   // it blinks while it warns
    ctx.globalAlpha = a * 0.6; art.rect(ctx, '#05060c', 0, 41, W, 20);   // a dark strip, so it reads over any backdrop
    ctx.globalAlpha = a; SW.text(ctx, b.text, W / 2, 46, b.col, { align: 'center', scale: 2 }); ctx.globalAlpha = 1;
  };
})();
