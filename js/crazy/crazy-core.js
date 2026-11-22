'use strict';
// Shattered Worlds — fifteen "crazy" Versus stages (2026-11-21, the user: "design crazy maps now for versus lest say 15
// maps"). This file is the shared machinery; the stages themselves are in crazy-sky.js, crazy-land.js and crazy-far.js.
// Loaded after js/stages.js and builds on it: every stage here is also an entry of SW.stages.DEF, so stages.js builds its
// tile platforms, lands fighters on its moving platforms, drops them through with S + K, lets the bots climb, step out
// from under marks (s.marks) and get off the floor before a sweeping hazard (s.floorHaz), and shows the stage's picture
// and twist on the Versus menu (H there turns the twists off; then only the layout stays).
// A stage: CZ.add(id, {
//   name, twist (one line for the menu), theme (art.themes colours), es / zh (translations of its strings),
//   paint(x, r)            the backdrop, painted once into a 512 x 300 canvas (pixel art: CZ.sky, CZ.disc ... below)
//   floor(x, z, r)         paints over the baked floor tiles (optional)
//   tiles(z), plats()      tile platforms and this stage's own moving ones ({ x, y, w, kind } in px, see CZ.plat)
//   init(s)                fresh state for each round (s.c is this stage's own store)
//   tick(s, z, on)         once per fight frame; on: the fight is running and the twists are on
//   move(a, s, z)          before a fighter moves: may change its vy, and returns a push in px this frame (not kept)
//   back / mid / front(ctx, s, cx, cy)   drawing: behind the platforms, in front of them, in front of the fighters
//   drawPlat(ctx, p, x, y, s)            one of this stage's own platforms
//   bot(p, f, s)           the bots' use of the twist (before stages.js's own help) })
// Shared twist kinds (set them in tick and the bots know them): s.floorHaz = { warn, run } (get up on a platform),
// s.highHaz = { warn, run } (come down and stay down), s.marks = { warn, xs } (step away from those x).
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, art = SW.art, fx = SW.fx, I = SW.input, T = 16, W = SW.W, H = SW.H;
  const ST = SW.stages;
  if (!V || !V.STAGES || !ST || !ST.DEF || !ST.TWIST || !SW.zones || !SW.zones.versus) return;
  const FLOOR = 14 * T, GRAV = SW.GRAV || 0.42, EDGE = 14;
  const CZ = SW.crazy = { DEF: {}, ids: [], FLOOR, T, W, H, GRAV, EDGE };

  // ================= colour and pixel helpers (for the backdrops) =================
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const hex = c => '#' + ((1 << 24) | (c[0] << 16) | (c[1] << 8) | c[2]).toString(16).slice(1);
  CZ.mix = (a, b, k) => { const p = rgb(a), q = rgb(b); return hex(p.map((v, i) => Math.round(v + (q[i] - v) * k))); };
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  CZ.bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];
  // a sky of flat bands with ordered dither between them: stops [[y, '#col'], ...] from the top down
  CZ.sky = function (x, stops, w, h) {
    w = w || 512; h = h || 300;
    const img = x.getImageData(0, 0, w, h), d = img.data, cs = stops.map(s => rgb(s[1]));
    for (let y = 0; y < h; y++) {
      let i = 0; while (i < stops.length - 2 && y >= stops[i + 1][0]) i++;
      const y0 = stops[i][0], y1 = stops[i + 1][0], k = SW.clamp((y - y0) / Math.max(1, y1 - y0), 0, 1);
      for (let xx = 0; xx < w; xx++) {
        const c = k > CZ.bayer(xx, y) ? cs[i + 1] : cs[i], j = (y * w + xx) * 4;
        d[j] = c[0]; d[j + 1] = c[1]; d[j + 2] = c[2]; d[j + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
  };
  // dithered fill of a rectangle from colour a (k = 0) to b (k = 1) along y (or x)
  CZ.ditherRect = function (x, a, b, x0, y0, w, h, horiz) {
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const k = horiz ? xx / Math.max(1, w - 1) : yy / Math.max(1, h - 1);
      x.fillStyle = k > CZ.bayer(x0 + xx, y0 + yy) ? b : a; x.fillRect(x0 + xx, y0 + yy, 1, 1);
    }
  };
  CZ.rgb = rgb; CZ.hex = hex;
  // smooth value noise in 0..1 (for nebulae, planets, sand)
  const hash = (i, j, s) => { const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  CZ.hash = hash;
  CZ.noise = function (x, y, s) {
    const i = Math.floor(x), j = Math.floor(y), fx0 = x - i, fy0 = y - j, u = fx0 * fx0 * (3 - 2 * fx0), v = fy0 * fy0 * (3 - 2 * fy0);
    const a = hash(i, j, s || 0), b = hash(i + 1, j, s || 0), c = hash(i, j + 1, s || 0), e = hash(i + 1, j + 1, s || 0);
    return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v;
  };
  CZ.fbm = (x, y, s, n) => { let t = 0, a = 0.5, f = 1, m = 0; for (let i = 0; i < (n || 4); i++) { t += a * CZ.noise(x * f, y * f, (s || 0) + i * 17); m += a; a *= 0.5; f *= 2; } return t / m; };
  // paint pixel by pixel: fn(px, py) returns '#rrggbb' (or null to keep what is there)
  CZ.pixels = function (x, x0, y0, w, h, fn) {
    x0 = Math.max(0, Math.round(x0)); y0 = Math.max(0, Math.round(y0)); w = Math.min(x.canvas.width - x0, Math.round(w)); h = Math.min(x.canvas.height - y0, Math.round(h));
    if (w <= 0 || h <= 0) return;
    const img = x.getImageData(x0, y0, w, h), d = img.data, cache = {};
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const col = fn(x0 + xx, y0 + yy);
      if (!col) continue;
      const c = cache[col] || (cache[col] = rgb(col)), j = (yy * w + xx) * 4;
      d[j] = c[0]; d[j + 1] = c[1]; d[j + 2] = c[2]; d[j + 3] = 255;
    }
    x.putImageData(img, x0, y0);
  };
  // pick from a ramp (dark -> light) by k in 0..1, dithered at (px, py)
  CZ.ramp = (cols, k, px, py) => { const f = SW.clamp(k, 0, 0.9999) * (cols.length - 1), i = Math.floor(f); return cols[Math.min(cols.length - 1, i + ((f - i) > CZ.bayer(px, py) ? 1 : 0))]; };
  // every run of tile platforms ('=') in the zone: fn(px, py, pw)
  CZ.eachPlat = function (z, fn) { for (let ty = 0; ty < z.h; ty++) { let tx = 0; while (tx < z.w) { if (z.grid[ty][tx] === '=') { let n = 0; while (tx + n < z.w && z.grid[ty][tx + n] === '=') n++; fn(tx * T, ty * T, n * T); tx += n; } else tx++; } } };
  CZ.rect = (x, col, a, b, w, h) => art.rect(x, col, a, b, w, h);
  CZ.disc = (x, col, cx, cy, r) => art.disc(x, col, Math.round(cx), Math.round(cy), Math.round(r));
  CZ.ellipse = function (x, col, cx, cy, rx, ry) {
    x.fillStyle = col; ry = Math.max(1, Math.round(ry));
    for (let dy = -ry; dy <= ry; dy++) { const dx = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry)))); x.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1); }
  };
  CZ.line = (x, col, x0, y0, x1, y1, w) => art.line(x, col, x0, y0, x1, y1, w || 1);
  CZ.stars = function (x, r, n, w, h, cols) {
    for (let i = 0; i < n; i++) { const sx = r() * w | 0, sy = r() * h | 0, c = cols[(r() * cols.length) | 0]; x.fillStyle = c; x.fillRect(sx, sy, 1, 1); if (r() < 0.06) { x.fillRect(sx - 1, sy, 3, 1); x.fillRect(sx, sy - 1, 1, 3); } }
  };
  // a ridge line: for every column the top of the shape at height fn(x); filled down to `bottom`
  CZ.ridge = function (x, col, fn, bottom, w) { x.fillStyle = col; for (let xx = 0; xx < (w || 512); xx++) { const t = Math.round(fn(xx)); x.fillRect(xx, t, 1, bottom - t); } };
  // a crisp pixel-art sprite from a vector drawing (js/pixel-kit.js: palette, no anti-aliasing, outline)
  CZ.sprite = (ctx, cx, cy, w, h, draw, pal, o) => { if (SW.pix && SW.pix.sprite) SW.pix.sprite(ctx, cx, cy, w, h, draw, Object.assign({ pal }, o || {})); else { ctx.save(); ctx.translate(cx, cy); draw(ctx); ctx.restore(); } };
  // a few short shapes many stages want
  CZ.cloud = function (x, cx, cy, s, lit, mid, dark) {
    const puffs = [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.2, 0.75], [-0.45, -0.35, 0.65], [0.45, -0.4, 0.6]];
    for (const [dx, dy, k] of puffs) CZ.disc(x, dark, cx + dx * s, cy + dy * s + 2, s * 0.62 * k + 1);
    for (const [dx, dy, k] of puffs) CZ.disc(x, mid, cx + dx * s, cy + dy * s, s * 0.62 * k);
    for (const [dx, dy, k] of puffs) CZ.disc(x, lit, cx + dx * s - 1, cy + dy * s - 2, s * 0.62 * k * 0.6);
  };

  // ================= registering a stage =================
  const tr = (lang, map) => { if (SW.i18n && SW.i18n.add) SW.i18n.add(lang, map); };
  CZ.add = function (id, d) {
    CZ.DEF[id] = d; CZ.ids.push(id);
    ST.DEF[id] = { name: d.name, base: id, tiles: d.tiles || (() => {}), plats: d.plats };   // stages.js builds and lands
    art.themes[id] = Object.assign({ style: 'plate', mid: 'ruins', midCol: '#000000', dim: 0, win: ['#ffffff'] }, d.theme, { bg: 'cz_' + id });
    V.STAGES.push([d.name, id]);
    ST.TWIST[id] = d.twist;
    if (d.es) tr('es', d.es); if (d.zh) tr('zh', d.zh);
  };
  function paintBg(id) {   // once, the first time the stage is built (the menu's picture or a match)
    const d = CZ.DEF[id], key = 'cz_' + id;
    if (art.bg[key] || !d.paint) return;
    const [c, x] = SW.canvas(512, 300);
    try { d.paint(x, SW.rng(id.length * 977 + id.charCodeAt(3) * 31)); } catch (e) { console.warn('crazy stage backdrop', id, e); }
    art.bg[key] = c;
  }
  // the floor: stages.js bakes the tiles from the theme; a stage may paint its own surface over them
  const _bake = art.bakeTiles; art.bakeTiles = function (z) {
    const c = _bake.apply(this, arguments), d = CZ.DEF[z.theme];
    if (d && d.floor) try { d.floor(c.getContext('2d'), z, SW.rng(z.theme.length * 71 + 5)); } catch (e) { console.warn('crazy stage floor', z.theme, e); }
    return c;
  };
  const _build = SW.zones.versus.build; SW.zones.versus.build = function (z) {
    _build.apply(this, arguments);
    const d = CZ.DEF[z.theme];
    if (!d || !z.sw) return;
    paintBg(z.theme);
    z.sw.cz = d; z.sw.c = {};
    if (d.init) d.init(z.sw, z);
    const mx = (z.w * T) / 2;
    z.decor.unshift({ kind: 'czback', x: mx });   // behind stages.js's own platforms
    z.decor.push({ kind: 'czmid', x: mx }, { kind: 'czfront', x: mx, front: true });
  };

  // ================= moving platforms of a stage's own =================
  CZ.plat = (x, y, w, kind, o) => Object.assign({ x, y, w, kind, alive: true, vy: 0 }, o || {});
  CZ.fighters = () => (V.f || []).map(f => f.p).filter(p => p && !p.dead);
  CZ.place = function (p, x, y) {   // move a platform; whoever stands on it rides along
    x = Math.round(x); y = Math.round(y);
    const dx = x - p.x, dy = y - p.y;
    p.x = x; p.y = y; p.vy = dy;
    if (dx || dy) for (const q of CZ.fighters()) if (q.swPlat === p) { q.x += dx; q.y += dy; }
  };
  CZ.drop = function (p) { for (const q of CZ.fighters()) if (q.swPlat === p) { q.swPlat = null; q.onGround = false; } };

  // ================= twists: timers, banners, hits, launches =================
  // a periodic twist: waits `gap` frames (a number or a function), warns `warn` frames, runs `run` frames.
  // CZ.step returns 'warn' / 'go' / 'end' on the frame each starts, else null; while running, h.k counts up from 0.
  CZ.timer = (gap, warn, run, first) => ({ gap, warnT: warn, runT: run, next: first !== undefined ? first : (typeof gap === 'function' ? gap() : gap), warn: 0, run: false, k: 0, heed: null });
  CZ.step = function (h) {
    if (h.run) { if (++h.k >= h.runT) { h.run = false; h.next = typeof h.gap === 'function' ? h.gap() : h.gap; return 'end'; } return null; }
    if (h.warn > 0) { if (--h.warn === 0) { h.run = true; h.k = 0; return 'go'; } return null; }
    if (--h.next <= 0) { h.warn = Math.max(1, h.warnT); h.heed = null; return 'warn'; }
    return null;
  };
  CZ.idle = h => !h.run && !(h.warn > 0);
  CZ.banner = (s, text, col, t) => { s.banner = { text, col, t: t || 120, max: t || 120 }; };
  // a hazard hits a fighter (counted as that fighter's own hit taken, as stages.js's train does)
  CZ.hit = function (f, atk) {
    const p = f.p, keep = [G.state, G.player]; G.state = f.state; G.player = p;
    try { return p.takeHit(Object.assign({ team: 'enemy', hitSet: new Set(), quiet: true, unblockable: true }, atk), G); } finally { G.state = keep[0]; G.player = keep[1]; }
  };
  CZ.fightersF = () => (V.f || []).filter(f => f.p && !f.p.dead);
  // throws a fighter upward (no damage): springs, geysers, a worm's back
  const FREE = ['idle', 'run', 'jump', 'fall', 'guard', 'charge'];
  CZ.launch = function (p, vy, vx) {
    if (!p || p.dead || p.state === 'ult' || p.held) return false;
    p.vy = Math.min(p.vy, vy); if (vx !== undefined) p.vx = vx;
    p.onGround = false; p.swPlat = null; p.y -= 1; p.coyote = 0; p.airJumps = 0; p.airDash = false;
    if (FREE.indexOf(p.state) >= 0) p.enter('jump');
    return true;
  };
  CZ.onFloor = p => p.onGround && p.y >= FLOOR - 1 && !p.swPlat;
  CZ.spark = (x, y, col, n, sp) => fx.spark(x, y, col, n || 8, sp || 2);
  CZ.part = (o) => { if (fx.list.length < 420) fx.list.push(Object.assign({ k: 'p', vx: 0, vy: 0, g: 0, life: 30, max: 30, s: 1 }, o)); };
  CZ.sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no sound */ } };

  // ================= each fight frame =================
  let lastT = -1;
  const _vu = V.update; V.update = function () {
    const hs = G.hitstop, r = _vu.apply(this, arguments), z = V.zone, s = z && z.sw, d = s && s.cz;
    if (G.scene !== 'vs' || !d || !V.f || !V.f[0] || V.paused) { lastT = V.t; return r; }
    const n = Math.max(0, Math.min(4, V.t - lastT)); lastT = V.t;
    if (hs > 0 || !n) return r;
    if (s.czKey !== V.f[0].p) { s.czKey = V.f[0].p; s.c = {}; s.ct = 0; s.floorHaz = s.highHaz = s.marks = null; s.noClimb = false; if (d.init) d.init(s, z); }   // a new round
    for (let i = 0; i < n; i++) {
      s.ct = (s.ct || 0) + 1;
      if (d.tick) d.tick(s, z, V.phase === 'fight' && ST.on);
      const hh = s.highHaz; s.noClimb = !!(hh && (hh.warn > 0 || hh.run));
    }
    return r;
  };

  // ================= physics: a stage's push and pull =================
  const _mv = SW.move; SW.move = function (a, z) {
    const s = z && z.sw, d = s && s.cz;
    if (!d || !d.move || G.scene !== 'vs' || !(a instanceof SW.Player) || a.dead) return _mv.apply(this, arguments);
    const push = (ST.on && V.phase === 'fight' && d.move(a, s, z)) || 0, vx0 = a.vx;
    if (push) a.vx = vx0 + push;
    const r = _mv.apply(this, arguments);
    if (push && a.vx === vx0 + push) a.vx = vx0;   // the push moves you; it doesn't stay in your speed
    if (d.after) d.after(a, s, z);
    return r;
  };

  // ================= the bots =================
  const press = k => { if (!I.now[k]) { I.now[k] = true; I.lastHit[k] = SW.frame; } };
  CZ.press = press;
  CZ.hold = dir => { I.now.left = dir < 0; I.now.right = dir > 0; };
  CZ.noJump = () => { I.now.jump = false; I.consume('jump'); I.now.up = false; };
  CZ.quiet = () => { ['attack', 'skill', 'special', 'awaken', 'dash', 'throw', 'charge', 'guard', 'down'].forEach(k => { I.now[k] = false; I.consume(k); }); };   // no new moves (so the bot is free when it must jump or step)
  // whether this bot heeds a warning: Easy about half the time, Normal three in four, Hard and Nightmare always
  CZ.heeds = (f, h) => { if (!h.heed) h.heed = {}; if (h.heed[f.i] === undefined) { const dl = V.mode === 'bvb' && f.i === 1 ? V.diff2 : V.diff; h.heed[f.i] = Math.random() < [0.45, 0.75, 1, 1][dl | 0]; } return h.heed[f.i]; };
  const P = SW.Player.prototype, _pu = P.update;
  P.update = function (g, z) {
    const s = z && z.sw, d = s && s.cz;
    if (d && g.scene === 'vs' && !this.dead && V.phase === 'fight' && ST.on) {
      const f = V.f && V.f.find(q => q.p === this);
      if (f && f.bot && !(f.stunT > 0) && this.state !== 'hurt') {
        const hh = s.highHaz;
        if (hh && (hh.warn > 0 || hh.run) && CZ.heeds(f, hh)) {   // the high air is about to be swept: come down, stay down
          f.swGoal = null;
          if (this.onGround && (this.swPlat || this.onPlat) && this.y < FLOOR - 4) { I.now.down = true; press('jump'); }
          else if (this.onGround) CZ.noJump();
        }
        if (d.bot) d.bot(this, f, s);
      }
    }
    return _pu.apply(this, arguments);
  };

  // ================= drawing =================
  const _dd = SW.Zone.prototype.drawDecor; SW.Zone.prototype.drawDecor = function (ctx, dc, cx, cy) {
    const k = dc.kind;
    if (k !== 'czback' && k !== 'czmid' && k !== 'czfront') return _dd.apply(this, arguments);
    const s = this.sw, d = s && s.cz;
    if (!d) return;
    try {
      if (k === 'czback') { if (d.back) d.back(ctx, s, cx, cy); }
      else if (k === 'czmid') {
        if (d.drawPlat) for (const p of s.plats) if (p.alive !== false || p.showDead) d.drawPlat(ctx, p, Math.round(p.x - cx), Math.round(p.y - cy), s);
        if (d.mid) d.mid(ctx, s, cx, cy);
      } else if (d.front) d.front(ctx, s, cx, cy);
    } catch (e) { if (!d.warned) { d.warned = true; console.warn('crazy stage draw', this.theme, e); } }
    ctx.globalAlpha = 1;
  };
  // world x / y to screen helpers for the draw functions
  CZ.sx = (x, cx) => Math.round(x - cx);
  CZ.sy = (y, cy) => Math.round(y - cy);
  // a warning light: blinks while a twist warns
  CZ.blink = (h, every) => h && h.warn > 0 && h.warn % (every || 16) < (every || 16) * 0.6;
})();
