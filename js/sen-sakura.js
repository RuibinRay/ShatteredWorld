'use strict';
// Shattered Worlds — Sen, the sakura swordsman (2026-11-21, the user: "improve sen ... combine it with sakura and his look
// like character appearance make it look handsome", "like in game appearance", then "make him not look like girl and
// hair like the image"). His sprite is rebaked after his art (assets/source/hero_sen.png): black hair swept back and tied
// in a topknot bun with a pink tie, a lock at the side of his face, a dark brow over a dark eye, a firm jaw, broad
// shoulders; a white kimono with dark wrapped forearms, a pink sash whose end flutters behind him, a black belt, pale
// lavender hakama. Awakened (One Mind) his hair goes dark crimson and the kimono blossom-pink, as in his ultimate's art.
// A few petals fall from him while he stands still. Loaded after js/apex/sen.js. Draw-only.
(function () {
  const SW = window.SW, art = SW.art, D = SW.data;
  if (!art || !art.bake || !art.HEADS || !D || !D.heroes.sen) return;
  const SK = SW.senSakura = { on: true };

  // 11 x 10, facing right. h hair, H hair shade, m the pink hair tie, s skin, S skin shade, e brow and eye
  art.HEADS.sen_sakura = [
    '...hhh.....',
    '...hmhh....',
    '..hhhhhhh..',
    '.hhhhhhhhh.',
    '.Hhhhhhhss.',
    '.HhHsssees.',
    '.HhHssssess',
    '..HSssssss.',
    '...SSsssS..',
    '....SSSS...'
  ];
  const LOOK = {
    head: 'sen_sakura', sc: 1.06, bulk: 8, trailHead: 0, trailLen: 3, trailW: 2,
    c: { skin: '#e8b48c', hair: '#16121c', eye: '#100c14', acc: '#ff4f93', top: '#ece8f2', arm: '#ece8f2', fore: '#1c1820', hand: '#e8b48c',
      pants: '#8c80a6', boots: '#1c1820', belt: '#1c1820', chest: '#ff4f93', trail: '#ff4f93' }
  };
  const LOOK_AW = {
    head: 'sen_sakura', sc: 1.06, bulk: 8, trailHead: 0, trailLen: 3, trailW: 2, outline: '#3a0a1c',
    c: { skin: '#f0c4a0', hair: '#6a1430', eye: '#1a0610', acc: '#ffffff', top: '#ffe0ec', arm: '#ffe0ec', fore: '#ff4f93', hand: '#f0c4a0',
      pants: '#6a4a86', boots: '#22162a', belt: '#ffffff', chest: '#ffffff', trail: '#ffffff' }
  };
  // ---------- his katana (the user, 2026-11-21: "improve weapon look"): a curved blade, steel with a dark spine and a white
  // edge, a pink temper line (hamon) waving along it, a bright point; a gold collar, a round black guard set with five pink
  // petals, a grip wrapped in red-and-black diamonds and a gold end cap. Drawn into the sprite sheets (T: rect/pline/disc).
  const KC = { spine: '#4a4e60', steel: '#b8c2d6', steel2: '#dfe6f2', edge: '#ffffff', hamon: '#ff9cbc', hamon2: '#ffd6e2', petal2: '#c0507a', gold: '#e8c070', gold2: '#a07a38',
    guard: '#1c1620', petal: '#ff8fb1', wrap: '#1a0e14', wrap2: '#c0305a' };
  function katana(x, wx, wy, a, len, sc, Wp, T) {
    const dx = Math.sin(a), dy = Math.cos(a), px = dy, py = -dx;   // p: across the blade, toward its back (fixed in the hand, as a real grip: the edge leads the cut, never faces him)
    const P = (u, v) => [wx + dx * u + px * v, wy + dy * u + py * v], L = Math.round(len), r = Math.round;
    // the grip, behind the hand: diamonds of red cord over black, a gold cap
    const G0 = Math.round(6 * sc);
    for (let i = 1; i <= G0; i++) for (let v = -1; v <= 1; v++) { const [gx, gy] = P(-i, v * 0.9); T.rect(x, (i + v + 8) % 3 === 0 ? KC.wrap2 : KC.wrap, r(gx), r(gy), 1, 1); }
    { const [cx, cy] = P(-G0 - 1, 0); T.disc(x, KC.gold2, cx, cy, Math.max(1, r(1.2 * sc))); T.rect(x, KC.gold, r(cx), r(cy), 1, 1); }
    // the blade: three rows (back, body, edge) bending back toward the point (the sori)
    for (let i = 3; i <= L; i++) {
      const u = i / L, bend = 1.6 * sc * u * u, w = u > 0.93 ? 0 : 1;
      for (let v = -1; v <= w; v++) {
        const [bx, by] = P(i, v + bend);
        let col = v === -1 ? KC.edge : v === 0 ? (Math.sin(i * 1.1) > -0.2 ? KC.hamon : KC.hamon2) : KC.spine;   // the temper line, waving along the middle
        if (u > 0.9) col = KC.edge;   // the bright point
        T.rect(x, col, r(bx), r(by), 1, 1);
      }
      if (i % 4 === 0 && u < 0.85) { const [bx, by] = P(i, 1 + bend); T.rect(x, KC.steel, r(bx), r(by), 1, 1); }   // light along the back
    }
    // the gold collar and the guard with its petals
    { const [hx, hy] = P(2, 0); T.rect(x, KC.gold, r(hx) - 1, r(hy) - 1, 2, 2); }
    for (let u = 0; u <= 1; u++) for (let v = -3; v <= 3; v++) { const [gx, gy] = P(u, v); T.rect(x, Math.abs(v) === 3 ? KC.petal : Math.abs(v) === 2 && u === 0 ? KC.petal2 : KC.guard, r(gx), r(gy), 1, 1); }   // the guard: a black oval across the blade, pink at its rim
  }
  art.WEAPONS.sen_katana = { len: 22, w: 2, col: KC.steel, hi: KC.edge, hilt: KC.wrap };
  (art.WEAPON_DRAW = art.WEAPON_DRAW || {}).sen_katana = katana;
  SK.katana = katana;

  function setOf(s) { const have = Object.keys(s.anims || {}).sort().join(','); for (const k of Object.keys(art.SETS || {})) if (art.SETS[k].slice().sort().join(',') === have) return k; return 'hero'; }
  // the blade's angle in a few shared poses pointed it behind him or hung it from a raised hand like a reverse grip (the
  // user: "make sure he is not holding katana backwards"). For his sheets only, these poses get an absolute blade angle
  // (degrees, 0 = straight down, 90 = straight ahead, 180 = straight up); null keeps the pose as it is.
  const BLADE = { guard: [125], dash: [100], charge: [125, 125], climb: [150, 150], cling: [150], special: [65, null, null], hurt: [70], fall: [140] };
  function withBlade(fn) {
    const PO = art.POSES, keep = {};
    if (!PO) return fn();
    Object.keys(BLADE).forEach(n => {
      if (!PO[n]) return; keep[n] = PO[n];
      PO[n] = PO[n].map((p, i) => { const A = BLADE[n][i]; if (A === null || A === undefined) return p; return Object.assign({}, p, { wp: A - ((p.aF || 0) + (p.aFe || 0)) }); });
    });
    try { return fn(); } finally { Object.keys(keep).forEach(n => { PO[n] = keep[n]; }); }
  }
  function rebake() { withBlade(rebakeAll); }
  function rebakeAll() {
    const h = D.heroes.sen;
    [[h.sheet || 'sen', LOOK], [h.sheetAw || 'sen_aw', LOOK_AW]].forEach(([sid, look]) => {
      const s = art.sheets[sid]; if (!s || !s.cfg) return;
      const cfg = JSON.parse(JSON.stringify(s.cfg));
      Object.assign(cfg, { head: look.head, sc: look.sc, bulk: look.bulk, trailHead: look.trailHead, trailLen: look.trailLen, trailW: look.trailW });
      if (look.outline) cfg.outline = look.outline;
      cfg.c = Object.assign({}, look.c);   // (the shades are made fresh by bake)
      cfg.weapon = 'sen_katana'; cfg.armed = 1;
      const set = setOf(s);
      try { art.bake(sid, cfg, set); } catch (e) { console.error('sen-sakura', e); }
      if (sid === (h.sheet || 'sen')) {   // the same, the blade still in its sheath (his entrance)
        const c2 = JSON.parse(JSON.stringify(cfg)); delete c2.weapon; c2.armed = 0; c2.c = Object.assign({}, look.c);
        try { art.bake('sen_sheathed', c2, set); } catch (e) { console.error('sen-sakura sheathed', e); }
      }
    });
  }
  // ---------- his entrance (the user, 2026-11-21: "add entry pose animation of taking out the blade") ----------
  // In the Versus intro (the 80 frames before FIGHT!) he stands low with the blade in its sheath at his hip, his hand on
  // the grip, petals drifting in toward him; a glint runs along the guard; at DRAW he draws: one pink brush arc, a burst
  // of petals, the scabbard left empty at his hip; then he holds his guard until the fight starts. Draw-only.
  const SAYA = { lac: '#1c1620', lac2: '#3a2c40', cord: '#ff8fb1', gold: '#e8c070', wrap: '#1a0e14', wrap2: '#c0305a', guard: '#1c1620' };
  const DRAW = 46;
  function saya(ctx, x, y, d, full) {   // the scabbard at his hip, slanting back and down; full: the blade's grip and guard sit in its mouth
    const L = (a, b, c2, e, col, w) => art.line(ctx, col, Math.round(a), Math.round(b), Math.round(c2), Math.round(e), w);
    const mx = x + d * 4, my = y - 18, tx = x - d * 18, ty = y - 8;
    L(mx, my, tx, ty, SAYA.lac, 3); L(mx, my - 1, tx, ty - 1, SAYA.lac2, 1);
    art.rect(ctx, SAYA.gold, Math.round(tx) - 1, Math.round(ty) - 1, 2, 2);   // the end cap
    art.rect(ctx, SAYA.cord, Math.round(mx - d * 5) - 1, Math.round(my + 1), 3, 2); art.rect(ctx, SAYA.cord, Math.round(mx - d * 7), Math.round(my + 3), 1, 3);   // the cord knot
    if (full) {
      const gx = mx + d * 1, gy = my - 1, ex = gx + d * 8, ey = gy - 3;
      for (let v = -2; v <= 2; v++) art.rect(ctx, Math.abs(v) === 2 ? SAYA.cord : SAYA.guard, Math.round(gx), Math.round(gy + v), 2, 1);   // the guard
      for (let i = 1; i <= 7; i++) { const u = i / 8; art.rect(ctx, i % 2 ? SAYA.wrap2 : SAYA.wrap, Math.round(gx + (ex - gx) * u), Math.round(gy + (ey - gy) * u) - 1, 1, 3); }   // the grip
      art.rect(ctx, SAYA.gold, Math.round(ex), Math.round(ey) - 1, 2, 2);
    }
  }
  SK.saya = saya;
  function entry(p, ctx, cam) {
    const V = SW.versus;
    if (!V || V.phase !== 'intro' || !V.f || !V.f.some(f => f && f.p === p)) return false;
    const sh = p.sheet && p.sheet(); if (sh !== 'sen' && sh !== 'sen_aw') return false;
    if (!art.sheets.sen_sheathed) return false;
    const t = V.t, x = Math.round(p.x - cam.x), y = Math.round(p.y - cam.y), d = p.face, flip = d < 0, SI = SW.senInk;
    if (t < DRAW) {
      saya(ctx, x, y, d, true);
      art.draw(ctx, 'sen_sheathed', 'cast', 0, x, y, flip);
      if (t > DRAW - 12 && t < DRAW - 4) { const k = (t - (DRAW - 12)) / 8, gx = x + d * (5 + k * 8), gy = y - 20; art.rect(ctx, '#ffffff', gx - 2, gy, 5, 1); art.rect(ctx, '#ffffff', gx, gy - 2, 1, 5); }   // a glint runs along the guard
      if (t % 6 === 0 && part) { const a = SW.rand(0, Math.PI * 2); part(p.x + Math.cos(a) * 46, p.y - 20 + Math.sin(a) * 26, t % 12 ? '#ffa0c0' : '#ffe4ee', -Math.cos(a) * 0.9, -Math.sin(a) * 0.5, 40, 2, 0); }   // petals drawn in toward him
      return true;
    }
    const k = t - DRAW;
    if (!p.senDrawn) {
      p.senDrawn = 1;
      try { SW.audio.sfx('swing'); fx.shake(3, 6); } catch (e) { /* (sound off) */ }
      if (part) for (let i = 0; i < 22; i++) part(p.x + d * SW.rand(6, 40), p.y - SW.rand(10, 36), i % 3 ? '#ffa0c0' : i % 2 ? '#ffe4ee' : '#ffffff', d * SW.rand(0.5, 2.6), -SW.rand(0.2, 1.6), 40, 2, 0.02);
    }
    saya(ctx, x, y, d, false);
    art.draw(ctx, 'sen', k < 4 ? 'special' : k < 12 ? 'special' : 'a4', k < 4 ? 1 : k < 12 ? 2 : 1, x, y, flip);
    if (k < 14 && SI && SI.brush) {   // the draw: one pink-hearted brush arc from the hip, up and out
      const pts = []; for (let i = 0; i <= 10; i++) { const a = 0.9 - i / 10 * 1.9; pts.push([x + d * (6 + Math.cos(a) * 30), y - 16 - Math.sin(a) * 22]); }
      SI.brush(ctx, pts, 5, Math.min(1, (k + 1) / 3), 1 - Math.max(0, (k - 6) / 8));
    }
    return true;
  }
  const fx = SW.fx;
  // a petal now and then from his shoulders while he stands still (draw-only particles)
  const P = SW.Player && SW.Player.prototype, part = SW.ninja && SW.ninja.part;
  if (P && part) {
    const _pd = P.draw;
    P.draw = function (ctx, cam, g) {
      if (SK.on && entry(this, ctx, cam)) return;
      const r = _pd.apply(this, arguments);
      if (SK.on && !this.dead && this.state === 'idle' && SW.frame % 34 === 0) {
        const sh = this.sheet && this.sheet();
        if (sh === 'sen' || sh === 'sen_aw') part(this.x - this.face * 4 + SW.rand(-5, 5), this.y - 30, SW.frame % 68 ? '#ffa0c0' : '#ffe4ee', -this.face * SW.rand(0.1, 0.5), 0.15, 70, 2, 0.004);
      }
      return r;
    };
  }
  const _init = art.init;
  art.init = function () { const r = _init.apply(this, arguments); if (SK.on) rebake(); return r; };
  SK.rebake = rebake;
})();
