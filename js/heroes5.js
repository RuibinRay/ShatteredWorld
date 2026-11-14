'use strict';
// Shattered Worlds — fourth hero expansion: five more heroes (twenty-five in all). All original characters.
//   Kiri    paper: every skill leaves a paper double behind, which repeats the skill half a second later at half strength.
//   Tarn    momentum: each hit in a combo adds 4% damage, up to +50%; kicks that carry him through enemies.
//   Maren   water: her skills heal her for a quarter of the damage they do; a healing pool, a wave that drags enemies in.
//   Yara    the long shot: arrows hit harder the further they fly, up to +80%.
//   Brann   fury: the less health he has, the harder he hits, up to +60%; kills heal him.
// They are ordinary heroes, not legends: unlocked by a feat in the story, open in Versus from the start.
// Like the other expansions this only adds data and wraps functions. Their story is in story-heroes5.js, and their
// S + I skills are with everyone else's in moves.js.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, text = SW.text, W = SW.W, H = SW.H;
  const HR = D.heroes, A = D.abilities, C = D.combat, P = SW.Player.prototype, Proj = SW.Proj, boom = SW.boom, CASTS = SW.casts, rand = SW.rand;
  const sfx = n => SW.audio.sfx(n);
  const NEW = [];

  // ---------- data ----------
  C.maul = C.claw.map(a => Object.assign({}, a, { dmg: Math.round(a.dmg * 1.35), dur: a.dur + 5, hitAt: a.hitAt + 2, hitEnd: a.hitEnd + 3, kx: a.kx * 1.3, box: [a.box[0], a.box[1] - 4, a.box[2] + 6, a.box[3] + 6] }));
  // kit slots: [0] U  [1] S+U  [2] I  [3] traversal  [4] S+O mode  [5] awakening  [6] ultimate   (moves.js adds [7], the S+I skill)
  const hero = (id, o) => {
    const r = HR[o.route];
    HR[id] = Object.assign({ sheet: id, sheetAw: id + '_aw', ult: 'storm', start: r.start, item: r.item, spark: true, awaken: o.kit[5], ultimate: o.kit[6], mode: o.kit[4] }, o);
    D.heroOrder.push(id); NEW.push(id);
  };
  hero('kiri', { name: 'Kiri', alias: 'Crease', title: 'The Paper Crane', energy: 'Fold', color: '#ff4d6d', colorHi: '#fff0f0', element: 'Paper', sig: 'Paper Double', combo: 'dagger', route: 'kael', modeKind: 'speed', pitch: 640,
    need: 'duel_won', trait: 'echo', blurb: 'Whatever she does, a paper copy of her\ndoes again a moment later.', kit: ['paper_star', 'fold_step', 'crane_flock', 'magnet_grip', 'quick_fold', 'thousand_folds', 'paper_dragon'] });
  hero('tarn', { name: 'Tarn', alias: 'Miles', title: 'The Long Road', energy: 'Stride', color: '#3a86ff', colorHi: '#cfe0ff', element: 'Momentum', sig: 'Momentum', combo: 'fist', route: 'kael', pitch: 300,
    need: 'act2_end', trait: 'momentum', blurb: 'Every hit lands harder than the last,\nfor as long as he keeps hitting.', kit: ['step_kick', 'rising_knee', 'hundred_paces', 'magnet_grip', 'second_wind', 'open_road', 'end_of_the_road'] });
  hero('maren', { name: 'Maren', alias: 'Subject 21', title: 'The Tide Doctor', energy: 'Tide', color: '#2a9d8f', colorHi: '#b8fff0', element: 'Water', sig: 'Mend', combo: 'flame', route: 'nyra', pitch: 600,
    need: 'tutorials_6', trait: 'mend', blurb: 'What she takes out of them,\nshe puts back into herself.', kit: ['brine_lash', 'tide_pool', 'undertow', 'frost_steps', 'high_tide', 'deep_form', 'spring_tide'] });
  hero('yara', { name: 'Yara', alias: 'Subject 57', title: 'The Far Shot', energy: 'String', color: '#ffd60a', colorHi: '#fff3b0', element: 'Longbow', sig: 'Far Shot', combo: 'swift', route: 'nyra', modeKind: 'speed', pitch: 700,
    need: 'level_15', trait: 'range', gridX: 12, blurb: 'Stand well back.\nIt only makes it worse.', kit: ['light_arrow', 'vault_shot', 'arrow_rain', 'frost_steps', 'steady_hand', 'zenith_form', 'meridian'] });
  hero('brann', { name: 'Brann', alias: 'Bear', title: 'The Last Bear', energy: 'Fury', color: '#c1121f', colorHi: '#ffb3b3', element: 'Fury', sig: 'Fury', combo: 'maul', route: 'kael', pitch: 180,
    need: 'shards_15', trait: 'fury', blurb: 'Hurt him, and find out\nwhy nobody does it twice.', kit: ['maul', 'roar', 'landslide', 'magnet_grip', 'blood_up', 'great_bear', 'last_winter'] });

  const AW = 'Awakening: +40% damage and super armour for 15 s.', SPD = '+25% speed and a flash-step dash for 10 s.', DMG = '+30% damage for 10 s.';
  Object.assign(A, {
    paper_star:    { name: 'Paper Star', input: 'U', cost: 25, dmg: 9, desc: 'A folded star that cuts through two enemies. Your paper double throws a second one. Hold W to aim up.' },
    fold_step:     { name: 'Fold Step', input: 'S + U', cost: 50, dmg: 15, desc: 'Step through everything in front of you, cutting as you pass. The double you leave behind bursts into scraps.' },
    crane_flock:   { name: 'Crane Flock', input: 'I', cost: 50, dmg: 6, desc: 'Six paper cranes weave forward, and your double sends three more. The last crane smashes cracked walls.' },
    quick_fold:    { name: 'Quick Fold', input: 'S + O', cost: 100, desc: SPD },
    thousand_folds: { name: 'Thousand Folds', input: 'O (awakening full)', desc: AW },
    paper_dragon:  { name: 'Paper Dragon', dmg: 11, desc: 'every scrap of paper in the room becomes one long dragon, and it goes through everyone.' },
    step_kick:     { name: 'Step Kick', input: 'U', cost: 25, dmg: 14, desc: 'A flying kick that carries you through a whole line of enemies.' },
    rising_knee:   { name: 'Rising Knee', input: 'S + U', cost: 50, dmg: 16, desc: 'Go up knee-first and take whatever is in front of you into the air.' },
    hundred_paces: { name: 'Hundred Paces', input: 'I', cost: 50, dmg: 4, desc: 'Eight kicks faster than they can be counted, walking forward. The last one sends them flying and smashes cracked walls.' },
    second_wind:   { name: 'Second Wind', input: 'S + O', cost: 100, desc: DMG },
    open_road:     { name: 'Open Road', input: 'O (awakening full)', desc: AW },
    end_of_the_road: { name: 'End of the Road', dmg: 30, desc: 'everything he has walked, in one punch. It reaches everyone.' },
    brine_lash:    { name: 'Brine Lash', input: 'U', cost: 25, dmg: 12, desc: 'A whip of sea water that hits up to three enemies and tugs them toward you. Hold W to lash upward.' },
    tide_pool:     { name: 'Tide Pool', input: 'S + U', cost: 50, dmg: 4, desc: 'A pool at your feet for five seconds. Enemies standing in it are slowed and hurt; you, standing in it, heal.' },
    undertow:      { name: 'Undertow', input: 'I', cost: 50, dmg: 20, desc: 'A wave runs out, turns, and drags everything it caught back to you. Hits twice. Smashes cracked walls.' },
    high_tide:     { name: 'High Tide', input: 'S + O', cost: 100, desc: DMG },
    deep_form:     { name: 'Deep Form', input: 'O (awakening full)', desc: AW },
    spring_tide:   { name: 'Spring Tide', dmg: 14, desc: 'the sea comes in, four times, through everyone. What it takes from them, it gives to you.' },
    light_arrow:   { name: 'Long Arrow', input: 'U', cost: 20, dmg: 10, desc: 'A fast arrow. It hits harder the further it flies, up to +80%. Hold W to aim up.' },
    vault_shot:    { name: 'Vault Shot', input: 'S + U', cost: 50, dmg: 14, desc: 'Spring backward and shoot down as you go. The arrow pins what it hits to the floor.' },
    arrow_rain:    { name: 'Arrow Rain', input: 'I', cost: 50, dmg: 7, desc: 'Six arrows come down on the nearest enemy ahead. Smashes cracked walls.' },
    steady_hand:   { name: 'Steady Hand', input: 'S + O', cost: 100, desc: DMG },
    zenith_form:   { name: 'Zenith Form', input: 'O (awakening full)', desc: AW },
    meridian:      { name: 'Meridian', dmg: 28, desc: 'one arrow, drawn for a long breath, loosed along the whole length of the world.' },
    maul:          { name: 'Maul', input: 'U', cost: 25, dmg: 10, desc: 'Lunge with both paws: two heavy swipes that hit everything in front of you.' },
    roar:          { name: 'Roar', input: 'S + U', cost: 50, dmg: 8, desc: 'A roar that stops everything around you where it stands and knocks shots out of the air.' },
    landslide:     { name: 'Landslide', input: 'I', cost: 50, dmg: 26, desc: 'Charge on all fours, carrying enemies along, and finish by falling on them. Smashes cracked walls.' },
    blood_up:      { name: 'Blood Up', input: 'S + O', cost: 100, desc: DMG },
    great_bear:    { name: 'Great Bear', input: 'O (awakening full)', desc: AW },
    last_winter:   { name: 'The Last Winter', dmg: 18, desc: 'he brings both fists down on the world three times. Then once more.' }
  });
  NEW.forEach(id => { const u = A[HR[id].ultimate]; u.input = 'W + I (full energy)'; u.cost = 100; u.desc = 'Ultimate: ' + u.desc + ' Costs all three bars, or one while awakened.'; });

  // ---------- helpers ----------
  const hit = (x, y, w, h, dmg, o) => SW.strike(G, Object.assign({ team: 'player', x, y, w, h, dmg, kx: 0, ky: -2, stun: 26, energy: true, hitSet: new Set(), quiet: true }, o || {}));
  const hurt = (e, dmg, o) => { if (!e || e.dead) return; const b = e.box(), atk = Object.assign({ team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg, kx: 0, ky: -2, stun: 24, energy: true, heavy: true, hitSet: new Set(), quiet: true }, o || {}); if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); };
  const isFoe = e => e.hittable && e.team === 'enemy' && !e.dead;
  const around = (z, x, y, r) => z.ents.filter(e => isFoe(e) && Math.hypot(e.x - x, e.y - e.h / 2 - y) < r);
  const light = e => !e.isBoss && !e.isProxy && !(e.def && e.def.heavy);
  const part = (x, y, col, vx, vy, life, s, g) => fx.list.push({ k: 'p', x, y, vx: vx || 0, vy: vy || 0, g: g || 0, life: life || 14, max: life || 14, col, s: s || 2 });
  const front = (o, reach, h, back) => [o.face > 0 ? o.x - (back || 0) : o.x - reach, o.y - h, reach + (back || 0), h];
  const slide = (p, z, dir, n) => { for (let s = 0; s < n; s++) { if (z.hit(p.x + dir - p.w / 2, p.y - p.h, p.w, p.h)) return false; p.x += dir; } return true; };
  const ahead = (p, z, r) => { let best = null, bd = r; z.ents.forEach(e => { if (!isFoe(e)) return; const d = Math.hypot(e.x - p.x, e.y - p.y); if ((e.x - p.x) * p.face > -24 && d < bd) { bd = d; best = e; } }); return best; };
  class Later { constructor(n, fn) { this.n = n; this.fn = fn; } update(g, z) { if (--this.n <= 0) { this.gone = true; this.fn(g, z); } } draw() {} }
  class Vis {
    constructor(x, y, life, render, tick) { Object.assign(this, { x, y, life, render, tick, t: 0 }); }
    update(g, z) { this.t++; if (this.tick) this.tick(this, g, z); if (this.t >= this.life) this.gone = true; }
    draw(ctx, cam) { this.render(ctx, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this.t, this); }
  }
  class Drive {   // holds the hero in the cast state while a move carries them
    constructor(p, n, step, end) { Object.assign(this, { p, n, step, end, t: 0 }); }
    update(g, z) {
      const p = this.p;
      if (p.dead || p.state === 'hurt') { this.gone = true; p.pose = null; return; }
      this.t++; p.state = 'cast'; p.st = 8; p.castFn = null;
      if (this.step(this.t, p, z, g) === false || this.t >= this.n) { this.gone = true; if (this.end) this.end(p, z, g); p.pose = null; p.enter(p.onGround ? 'idle' : 'fall'); }
    }
    draw() {}
  }
  // Kiri's trait: a paper double stands where she cast from and repeats the cast (fn gets where it stands) at half strength
  function echo(p, z, fn) {
    const o = { x: p.x, y: p.y, face: p.face, w: p.w, h: p.h }, sheet = p.sheet();
    z.shots.push(new Vis(o.x, o.y, 26, (ctx, x, y, t) => { art.draw(ctx, sheet, 'cast', t < 18 ? 0 : 1, x, y, o.face < 0, { alpha: 0.55, flash: t % 6 < 3 }); }, (v, g, zz) => {
      if (v.t === 20) { fn(o, zz); sfx('swing'); }
      if (v.t === 25) for (let i = 0; i < 8; i++) part(o.x + rand(-6, 6), o.y - rand(4, 30), i % 2 ? '#ffffff' : '#ff4d6d', rand(-1.5, 1.5), rand(-1.5, 0.5), 18, 2, 0.05);
    }));
  }
  const R = {
    star(ctx, x, y, p) { const k = p.t % 4 < 2; art.rect(ctx, '#ffffff', x - 4, y - 1, 8, 2); art.rect(ctx, '#ffffff', x - 1, y - 4, 2, 8); art.rect(ctx, '#ff4d6d', x - (k ? 3 : 1), y - (k ? 1 : 3), k ? 6 : 2, k ? 2 : 6); },
    crane(ctx, x, y, p) { const d = Math.sign(p.vx) || 1, f = p.t % 8 < 4 ? -3 : 2; art.rect(ctx, '#ffffff', x - 4, y - 1, 8, 2); art.rect(ctx, '#ffe0e0', x - 2, y - 1 + f, 5, 2); art.rect(ctx, '#ff4d6d', x + d * 4, y - 2, 2, 2); },
    lash(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; for (let i = 0; i < 6; i++) art.rect(ctx, i % 2 ? '#b8fff0' : '#2a9d8f', x - d * i * 5, y + Math.round(Math.sin((p.t + i) * 0.9) * 3), 5, 3); art.rect(ctx, '#ffffff', x + d * 2, y - 1, 3, 2); },
    wave(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; for (let i = 0; i < p.h; i += 3) { const o = Math.round(Math.sin(i * 0.3 + p.t * 0.5) * 3 + (p.h - i) * 0.25); art.rect(ctx, i % 6 ? '#2a9d8f' : '#b8fff0', x - d * o - 3, y + p.h / 2 - i - 3, 7, 3); } art.rect(ctx, '#ffffff', x - 4, y - p.h / 2, 8, 2); art.glow(ctx, x, y, 18, '#2a9d8f', 0.12); },
    arrow(ctx, x, y, p) { const m = Math.hypot(p.vx, p.vy) || 1, ux = p.vx / m, uy = p.vy / m; art.line(ctx, '#8a5a2a', x - ux * 10, y - uy * 10, x, y, 1); art.line(ctx, '#fff3b0', x - ux * 4, y - uy * 4, x + ux * 3, y + uy * 3, 2); art.glow(ctx, x, y, 6 + Math.min(8, (p.far || 0) * 10), '#ffd60a', 0.18); }
  };

  // ---------- abilities ----------
  const star = (o, z, dmg, up) => z.shots.push(new Proj({ x: o.x + o.face * 12, y: o.y - 21, vx: o.face * 8.5, vy: up ? -4.2 : 0, dmg, w: 10, h: 10, life: 40, pierce: true, maxHits: 2, kx: 1.2, render: R.star }));
  const flock = (o, z, dmg, n, wall) => { for (let i = 0; i < n; i++) z.shots.push(new Later(1 + i * 3, () => { sfx('swing'); z.shots.push(new Proj({ x: o.x + o.face * 12, y: o.y - 14 - (i % 3) * 8, vx: o.face * 6.5, dmg, w: 12, h: 8, life: 50, kx: 1, breaker: wall && i === n - 1, render: R.crane, think() { this.vy = Math.sin(this.t * 0.4 + i) * 1.2; } })); })); };
  // an arrow: its damage grows with the distance flown (Yara's trait)
  const arrow = (z, x, y, vx, vy, dmg, o) => z.shots.push(new Proj(Object.assign({ x, y, x0: x, y0: y, vx, vy, base: dmg, dmg, w: 10, h: 6, life: 46, kx: 1.5, render: R.arrow,
    think() { this.far = Math.min(0.8, Math.hypot(this.x - this.x0, this.y - this.y0) / 220); this.dmg = Math.round(this.base * (1 + this.far)); } }, o || {})));
  Object.assign(CASTS, {
    // Kiri
    paper_star(p, z, dmg, up) { sfx('shoot'); star(p, z, dmg, up); echo(p, z, (o, zz) => star(o, zz, Math.round(dmg * 0.5), up)); },
    fold_step(p, z, dmg) {
      const dir = p.face, x0 = p.x, hs = new Set(); let moved = 0;
      echo(p, z, (o, zz) => { boom(o.x, o.y - 16, 40, Math.round(dmg * 0.5), '#ffffff'); for (let i = 0; i < 10; i++) part(o.x + rand(-8, 8), o.y - rand(4, 30), '#ffffff', rand(-2, 2), rand(-2.5, 0), 22, 2, 0.08); });
      sfx('dash'); p.iframes = Math.max(p.iframes, 12);
      while (moved < 76 && slide(p, z, dir, 4)) { moved += 4; if (moved % 12 === 0) fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, dir < 0); }
      hit(Math.min(x0, p.x) - 8, p.y - 40, moved + 16, 42, dmg, { kx: dir * 1, stun: 30, heavy: true, hitSet: hs, srcX: p.x });
      fx.slash(x0 + dir * moved / 2, p.y - 20, dir, 2, '#ffffff', 50);
    },
    crane_flock(p, z, dmg) { flock(p, z, dmg, 6, true); echo(p, z, (o, zz) => flock(o, zz, Math.max(1, Math.round(dmg * 0.5)), 3, false)); },
    // Tarn
    step_kick(p, z, dmg) {
      const dir = p.face, hs = new Set(); sfx('dash'); p.pose = ['air', 1];
      z.shots.push(new Drive(p, 12, t => {
        p.vx = 0; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2);
        const ok = slide(p, z, dir, 8);
        hit(...front(p, 30, 40, 10), dmg, { kx: dir * 2.5, ky: -3.5, stun: 30, heavy: true, hitSet: hs, srcX: p.x - dir * 12 });
        if (t % 2) fx.ghost(p.sheet(), 'air', 1, p.x, p.y, dir < 0);
        if (!ok) return false;
      }));
    },
    rising_knee(p, z, dmg) {
      sfx('swing'); fx.slash(p.x + p.face * 12, p.y - 26, p.face, 2, '#cfe0ff', 44);
      hit(...front(p, 44, 62, 6), dmg, { kx: p.face * 0.5, ky: -9, stun: 48, launch: true, heavy: true, srcX: p.x });
      p.vy = -7.8; p.onGround = false; p.y -= 1;
    },
    hundred_paces(p, z, dmg) {
      const dir = p.face, hs = new Set(); p.pose = ['a2', 1];
      z.shots.push(new Drive(p, 34, t => {
        p.vx = 0; slide(p, z, dir, 1); p.pose = [t % 8 < 4 ? 'a2' : 'a3', 1];
        if (t % 4 === 1) { hs.clear(); sfx('swing'); fx.slash(p.x + dir * 16, p.y - 14 - (t % 12), dir, 1 + (t % 3), '#cfe0ff', 26); }
        hit(...front(p, 46, 42, 4), dmg, { kx: dir * 0.6, ky: -1, stun: 18, hitSet: hs, srcX: p.x });
      }, () => { sfx('heavy'); fx.shake(5, 10); fx.slash(p.x + dir * 18, p.y - 22, dir, 3, '#ffffff', 50); hit(...front(p, 54, 50, 6), dmg * 2, { kx: dir * 6.5, ky: -4, stun: 36, heavy: true, down: true, breaker: true, srcX: p.x }); }));
    },
    // Maren
    brine_lash(p, z, dmg, up) { sfx('swing'); z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 20, vx: p.face * 9, vy: up ? -5 : 0, dmg, w: 24, h: 12, life: 13, pierce: true, maxHits: 3, kx: -1.6, render: R.lash })); },
    tide_pool(p, z, dmg) {
      z.shots.forEach(s => { if (s.isPool && s.owner === p) s.gone = true; });
      const pool = new Vis(p.x, p.y, 300, (ctx, x, y, t) => {
        const k = t < 10 ? t / 10 : t > 280 ? (300 - t) / 20 : 1, w = Math.round(46 * k);
        ctx.globalAlpha = 0.6; art.rect(ctx, '#2a9d8f', x - w, y - 3, w * 2, 4); ctx.globalAlpha = 1;
        for (let i = -w; i < w; i += 6) art.rect(ctx, '#b8fff0', x + i, y - 4 + Math.round(Math.sin(t * 0.15 + i * 0.3)), 4, 1);
      }, (v, g, zz) => {
        if (v.t % 20 !== 10) return;
        hit(v.x - 46, v.y - 24, 92, 26, dmg, { ky: 0, stun: 14, heavy: false, status: { freeze: 16 }, srcX: v.x });
        if (!p.dead && p.onGround && Math.abs(p.x - v.x) < 48 && Math.abs(p.y - v.y) < 8) { const S = g.state; S.hp = Math.min(p.hpMax(), S.hp + 3); part(p.x + rand(-8, 8), p.y - rand(4, 28), '#7dffa0', 0, -1, 14, 2); }
      });
      pool.isPool = true; pool.owner = p; z.shots.push(pool); sfx('heal'); fx.ring(p.x, p.y - 4, '#b8fff0', 6, 46, 14);
    },
    undertow(p, z, dmg) {
      const dir = p.face; sfx('burst'); fx.shake(3, 8);
      z.shots.push(new Proj({ x: p.x + dir * 16, y: p.y - 16, vx: dir * 5.2, dmg, w: 26, h: 32, life: 30, ghost: true, pierce: true, breaker: true, heavy: true, kx: 1.5, ky: -2, render: R.wave,
        onEnd() { z.shots.push(new Proj({ x: this.x, y: this.y, vx: -dir * 6, dmg: Math.round(dmg * 0.6), w: 26, h: 32, life: 24, ghost: true, pierce: true, kx: 4.5, ky: -1.5, stun: 34, render: R.wave })); } }));
    },
    // Yara
    light_arrow(p, z, dmg, up) { sfx('shoot'); arrow(z, p.x + p.face * 12, p.y - 22, p.face * 11, up ? -5.5 : 0, dmg); },
    vault_shot(p, z, dmg) {
      const dir = p.face; sfx('jump'); p.vx = -dir * 5; p.vy = -6.2; p.onGround = false; p.y -= 1; p.iframes = Math.max(p.iframes, 10); p.pose = ['air', 0];
      z.shots.push(new Later(7, () => { if (p.dead) return; sfx('shoot'); arrow(z, p.x + dir * 10, p.y - 20, dir * 8, 5.5, dmg, { status: { freeze: 60 }, stun: 40, heavy: true }); }));
    },
    arrow_rain(p, z, dmg) {
      const e = ahead(p, z, 220), tx = e ? e.x : p.x + p.face * 110, ty = (e ? e.y : p.y) - 150; sfx('shoot');
      for (let i = 0; i < 6; i++) z.shots.push(new Later(8 + i * 4, () => { sfx('swing'); z.shots.push(new Proj({ x: (e && !e.dead ? e.x : tx) + rand(-9, 9), y: ty, vx: 0, vy: 9.5, dmg, w: 10, h: 16, life: 44, kx: 0.5, ky: 2, breaker: i === 5, heavy: i === 5, render: R.arrow, onEnd(g, zz, impact) { if (impact) part(this.x, this.y, '#fff3b0', 0, -1, 10, 2); } })); }));
      fx.bolt(p.x + p.face * 10, p.y - 24, p.x + p.face * 30, p.y - 110, '#fff3b0');
    },
    // Brann
    maul(p, z, dmg) {
      const dir = p.face; p.vx = dir * 4.6;
      [1, 9].forEach((d, i) => z.shots.push(new Later(d, () => { if (p.dead) return; sfx(i ? 'heavy' : 'swing'); fx.slash(p.x + dir * 14, p.y - 22 + i * 6, dir, 1 + i, '#ffb3b3', 46); hit(...front(p, 58, 48, 6), dmg, { kx: dir * (2 + i), ky: i ? -3 : -1, stun: 26, heavy: true, srcX: p.x - dir * 8 }); })));
    },
    roar(p, z, dmg) {
      sfx('roar'); fx.shake(7, 16); for (let i = 0; i < 3; i++) fx.ring(p.x, p.y - 18, i % 2 ? '#ffffff' : '#c1121f', 8, 60 + i * 22, 12 + i * 4);
      around(z, p.x, p.y - 16, 100).forEach(e => { hurt(e, dmg, { ky: -1, stun: 44, heavy: false, status: { freeze: 70 }, srcX: p.x }); e.vx = (Math.sign(e.x - p.x) || p.face) * 4; });
      z.shots.forEach(s => { if (s.team === 'enemy' && Math.hypot(s.x - p.x, s.y - p.y + 16) < 110) { s.gone = true; fx.spark(s.x, s.y, '#ffb3b3', 4, 1.5); } });
    },
    landslide(p, z, dmg) {
      const dir = p.face, hs = new Set(), carried = new Set(); sfx('roar'); p.pose = ['dash', 0];
      z.shots.push(new Drive(p, 16, t => {
        p.vx = 0; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2);
        const ok = slide(p, z, dir, 8);
        if (t % 5 === 1) hs.clear();
        hit(...front(p, 30, 44, 8), Math.round(dmg * 0.3), { kx: dir * 7, ky: -1, stun: 28, hitSet: hs, srcX: p.x - dir * 12 });
        hs.forEach(e => carried.add(e));
        carried.forEach(e => { if (e.dead) return; if (light(e)) { if ((e.x - p.x) * dir < 20) e.x = p.x + dir * 20; } else e.vx = dir * 8.5; });
        fx.dust(p.x - dir * 10, p.y, 2, -dir);
        if (!ok) return false;
      }, () => { fx.shake(8, 14); fx.dust(p.x + dir * 18, p.y, 10); boom(p.x + dir * 18, p.y - 10, 48, dmg, '#c1121f', null, { down: true, breaker: true, ky: -4, stun: 40 }); }));
    }
  });

  // ---------- ultimates (each runs over the ~70 frames of the "ult" state) ----------
  const every = (p, a, b, n) => p.st >= a && p.st <= b && (p.st - a) % n === 0;
  const ULT = {
    paper_dragon(p, z, foes, dmg) {
      if (p.st === 6) { fx.flash('#fff0f0', 8); sfx('perfect'); }
      if (p.st >= 8 && p.st < 62 && p.st % 2 === 0) { const y = G.cam.y + 60 + Math.sin(p.st * 0.25) * 50, x = G.cam.x + ((p.st - 8) / 54) * (W + 60) * (p.face > 0 ? 1 : -1) + (p.face > 0 ? -30 : W + 30); for (let i = 0; i < 4; i++) part(x - p.face * i * 9, y + Math.sin((p.st - i) * 0.25) * 6, i % 2 ? '#ffffff' : '#ff4d6d', 0, 0, 16, 4); }
      if (every(p, 10, 58, 6)) { sfx('swing'); foes.forEach(e => { const b = e.box(); fx.slash(b.x + b.w / 2, b.y + b.h / 2, (p.st >> 2) % 2 ? 1 : -1, 1 + (p.st % 3), '#ffffff', 40); hurt(e, dmg, { ky: -1, stun: 30 }); }); }
      if (p.st === 64) { fx.flash('#ff4d6d', 8); fx.shake(8, 14); sfx('explode'); foes.forEach(e => { const b = e.box(); for (let i = 0; i < 10; i++) part(b.x + b.w / 2, b.y + b.h / 2, i % 2 ? '#ffffff' : '#ff4d6d', rand(-3, 3), rand(-4, 0), 30, 2, 0.1); hurt(e, dmg * 3, { ky: -6, down: true }); }); }
    },
    end_of_the_road(p, z, foes, dmg) {
      if (every(p, 8, 40, 8)) { sfx('charge'); fx.ring(p.x + p.face * 10, p.y - 22, '#cfe0ff', 40 - (p.st - 8), 4, 8); }
      if (p.st === 44) {
        fx.flash('#cfe0ff', 10); fx.shake(10, 18); sfx('explode');
        for (let i = 0; i < 8; i++) fx.bolt(p.x + p.face * 10, p.y - 22, p.x + p.face * (60 + i * 50), p.y - 22 + rand(-14, 14), '#cfe0ff');
        foes.forEach(e => hurt(e, dmg * 5, { kx: p.face * 8, ky: -5, down: true, stun: 50 }));
      }
    },
    spring_tide(p, z, foes, dmg) {
      if (p.st === 6) { fx.flash('#b8fff0', 8); sfx('burst'); }
      if (every(p, 12, 54, 14)) {
        const d = ((p.st - 12) / 14) % 2 ? -1 : 1; sfx('burst'); fx.shake(5, 10);
        for (let i = 0; i < 26; i++) part(G.cam.x + (d > 0 ? 0 : W) + d * i * 20, G.cam.y + H - 40 - rand(0, 60), i % 3 ? '#2a9d8f' : '#b8fff0', d * 7, rand(-1, 1), 22, 4);
        foes.forEach(e => { hurt(e, dmg * 2, { kx: d * 3, ky: -3, stun: 34 }); });
      }
      if (p.st === 64) { fx.flash('#2a9d8f', 8); sfx('heal'); p.heal(Math.round(p.hpMax() * 0.3)); foes.forEach(e => hurt(e, dmg * 3, { ky: -6, down: true })); }
    },
    meridian(p, z, foes, dmg) {
      const y = p.y - 22;
      if (p.st >= 8 && p.st < 44 && p.st % 2 === 0) { part(p.x + p.face * (14 + (p.st - 8)), y, '#fff3b0', -p.face * 2, 0, 10, 2); if (p.st % 8 === 0) sfx('charge'); }
      if (p.st === 44) {
        fx.flash('#fff3b0', 10); fx.shake(9, 16); sfx('zap');
        for (let i = 0; i < 5; i++) fx.bolt(p.x + p.face * 14, y, p.x + p.face * (W + 40), y + rand(-4, 4), i ? '#ffd60a' : '#ffffff');
        foes.forEach(e => hurt(e, dmg * 6, { kx: p.face * 5, ky: -4, down: true, breaker: true, stun: 50 }));
      }
    },
    last_winter(p, z, foes, dmg) {
      const smash = k => { fx.shake(8 + k * 2, 14); sfx('explode'); fx.flash(k === 3 ? '#c1121f' : '#ffb3b3', 5); for (let i = 0; i < 12; i++) fx.dust(G.cam.x + rand(0, W), p.y, 2); foes.forEach(e => hurt(e, dmg * (k === 3 ? 4 : 2), { ky: k === 3 ? -7 : -5, launch: k < 3, down: k === 3, stun: 40 })); };
      if (p.st === 14) smash(0); if (p.st === 30) smash(1); if (p.st === 46) smash(2); if (p.st === 62) smash(3);
    }
  };
  const _ult = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _ult ? _ult(p, g, z, foes) : false, h = g.hero(), f = ULT[h.ultimate];
    if (!f) return r;
    f(p, z, foes, Math.round(A[h.ultimate].dmg * p.specMul()));
    return true;
  };

  // ---------- traits ----------
  // momentum keeps its own count of hits in a row (two seconds without a hit ends the run), so it works the same in the story and in Versus
  const momentum = g => { const p = g.player; return p && p.momN && SW.frame - p.momAt <= 120 ? Math.min(0.5, 0.04 * p.momN) : 0; };
  const fury = (p, g) => 0.6 * SW.clamp(1 - g.state.hp / Math.max(1, p.hpMax()), 0, 1);
  const _dm = P.dmgMul; P.dmgMul = function () {
    const g = this.G, tr = g.hero().trait, m = _dm.call(this);
    return tr === 'momentum' ? m * (1 + momentum(g)) : tr === 'fury' ? m * (1 + fury(this, g)) : m;
  };
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh(atk, e, b);
    const p = G.player, h = G.hero();
    if (p && h.trait === 'momentum') { p.momN = SW.frame - (p.momAt || 0) <= 120 ? (p.momN || 0) + 1 : 1; p.momAt = SW.frame; }
    if (h.trait !== 'mend' || !atk.energy || !p || p.dead) return;
    p.mend = (p.mend || 0) + (atk.dealt || atk.dmg) * 0.25;
    if (p.mend >= 5) { const n = Math.floor(p.mend); p.mend -= n; G.state.hp = Math.min(p.hpMax(), G.state.hp + n); fx.text(p.x, p.y - 44, '+' + n, '#7dffa0'); }
  };
  const _ok = G.onKill; G.onKill = function (e) { _ok(e); const p = G.player; if (p && !p.dead && G.hero().trait === 'fury') p.heal(Math.round(p.hpMax() * 0.06)); };
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    const p = g.player, h = g.hero();
    if (!p) return;
    const y = p.modeT > 0 ? 54 : 44;
    if (h.trait === 'momentum') { const m = momentum(g); if (m > 0) text(ctx, 'MOMENTUM +' + Math.round(m * 100) + '%', 10, y, m >= 0.5 ? '#ffffff' : h.colorHi); }
    if (h.trait === 'fury') { const f = fury(p, g); if (f > 0.05) text(ctx, 'FURY +' + Math.round(f * 100) + '%', 10, y, f > 0.4 ? '#ffffff' : h.colorHi); }
  };

  // ---------- how each one is unlocked in the story (in Versus they are open from the start) ----------
  Object.assign(D.achievements, {
    duel_won:    { name: 'Still Standing', desc: 'Win the duel at the Crater', hero: 'kiri' },
    act2_end:    { name: 'The Whole Road', desc: 'Finish Act 2: step up to the Crater Rift', hero: 'tarn' },
    tutorials_6: { name: 'Six Mornings', desc: "Finish six different heroes' tutorials", hero: 'maren' },
    level_15:    { name: 'Long Sight', desc: 'Reach level 15', hero: 'yara' },
    shards_15:   { name: 'Deep Winter', desc: 'Find 15 hidden Memory Shards', hero: 'brann' }
  });
  const _st = G.step; G.step = function (key) {
    _st(key);
    if (G.scene !== 'play' || !G.state) return;
    if (key === 'A2-4:rift') G.achieve('act2_end');
    if (key === 'A2-4:duel' && G.state.flags.crater_prize) G.achieve('duel_won');
    if (/^[A-Z]1-1:(boss|tusk|warden)$/.test(key) && Object.keys((SW.profile && SW.profile.tuts) || {}).length >= 6) G.achieve('tutorials_6');
  };
  const _xp = G.addXP; G.addXP = function (n) { _xp(n); if (G.scene === 'play' && G.state && G.state.level >= 15) G.achieve('level_15'); };
  const _ms = G.minorShard; G.minorShard = function () { _ms(); if (G.state.minor >= 15) G.achieve('shards_15'); };

  // ---------- sprites ----------
  const HEADS = {
    bun:      ['....hwwh...', '....hhhh...', '..hhhhhhh..', '.hhhhhhhhh.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    longhair: ['...........', '...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhsssss..', 'hhhsssesss.', 'hhHsssesss.', 'hhHSsssssss', 'hhH.Ssssss.', 'hH..Sssss..'],
    ponytail: ['...........', '...hhhhh...', '..hhhhhhh..', 'hhhhhhhhhh.', 'hHhhsssss..', 'h.Hsssesss.', 'h.Hsssesss.', 'H.Sssssssss', '..Sssssss..', '...Sssss...'],
    beard:    ['...........', '..hhhhhhh..', '.hhhhhhhhh.', '.hhhhhhhhh.', '.Hhhsssss..', '.Hhsssesss.', '.Hhhssesss.', '..hhhhhhhhs', '..Hhhhhhh..', '...Hhhhh...']
  };
  const WEAPONS = { longbow: { len: 17, w: 2, col: '#8a5a2a', hi: '#ffd60a', hilt: '#fff3b0' } };
  const RIG = {
    kiri:  { head: 'bun', c: { skin: '#f0c8a8', hair: '#1c1a22', white: '#ffffff', top: '#f4f1ea', arm: '#f4f1ea', fore: '#ff4d6d', hand: '#f0c8a8', pants: '#b01030', boots: '#3a2a30', belt: '#ff4d6d', chest: '#ff4d6d', trail: '#ffffff' }, trailLen: 4 },
    tarn:  { head: 'bandana', limb: 3, bulk: 5, c: { skin: '#a8724c', hair: '#1a1a24', acc: '#3a86ff', top: '#2a3a5a', arm: '#a8724c', fore: '#e8ecf4', hand: '#a8724c', pants: '#e8ecf4', boots: '#3a86ff', belt: '#3a86ff' } },
    maren: { head: 'longhair', c: { skin: '#c89a78', hair: '#0e3a44', top: '#e8f4f0', arm: '#e8f4f0', fore: '#2a9d8f', hand: '#b8fff0', pants: '#1c5a58', boots: '#0e3a44', belt: '#2a9d8f', chest: '#b8fff0', trail: '#0e3a44' }, trailHead: 1, trailLen: 5 },
    yara:  { head: 'ponytail', weapon: 'longbow', armed: 1, c: { skin: '#e0b088', hair: '#5a3418', top: '#3a4a2a', arm: '#3a4a2a', fore: '#e0b088', hand: '#e0b088', pants: '#2a3020', boots: '#5a4030', belt: '#ffd60a', chest: '#ffd60a', trail: '#5a3418' }, trailHead: 1, trailLen: 4 },
    brann: { head: 'beard', sc: 1.14, limb: 4, bulk: 10, c: { skin: '#b0805c', hair: '#4a2a1a', top: '#5a3a2a', arm: '#b0805c', fore: '#4a2a1a', hand: '#b0805c', pants: '#3a2a20', boots: '#2a1c14', belt: '#c1121f', chest: '#c1121f' } }
  };
  const BORROW = { kiri: 'vesper', tarn: 'kael', maren: 'isolde', yara: 'gale', brann: 'brakk' };
  const lit = (cfg, h) => Object.assign({}, cfg, { outline: art.shade(h.color, 0.35), c: Object.assign({}, cfg.c, { hair: h.colorHi, top: h.color, arm: cfg.c.arm === cfg.c.skin ? cfg.c.skin : h.color, belt: '#ffffff', chest: '#ffffff', trail: cfg.c.trail ? h.colorHi : undefined, glow: '#ffffff' }) });
  const borrow = () => NEW.forEach(id => { art.sheets[id] = art.sheets[id] || art.sheets[BORROW[id]]; art.sheets[id + '_aw'] = art.sheets[id + '_aw'] || art.sheets[BORROW[id] + '_aw'] || art.sheets[id]; });
  function bakeHeroes() {
    if (!art.bake) return borrow();
    Object.assign(art.HEADS, HEADS); Object.assign(art.WEAPONS, WEAPONS);
    NEW.forEach(id => { art.bake(id, JSON.parse(JSON.stringify(RIG[id])), 'hero'); art.bake(id + '_aw', lit(JSON.parse(JSON.stringify(RIG[id])), HR[id]), 'hero'); });
  }
  const _init = art.init; art.init = function () { _init(); try { bakeHeroes(); } catch (e) { console.error(e); } borrow(); };
  // splash art, if it exists: assets/bg/hero_<id>.png (96x128) and ult_<id>.png (520x260); otherwise the sprite is shown
  NEW.forEach(id => ['hero_', 'ult_'].forEach(k => { const im = new Image(); im.onload = () => { art.bg[k + id] = im; }; im.onerror = () => {}; im.src = 'assets/bg/' + k + id + '.png'; }));
  SW.heroes5 = NEW;
})();
