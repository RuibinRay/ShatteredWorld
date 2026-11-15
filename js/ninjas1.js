'use strict';
// Shattered Worlds — Hidden Clans, first six (Versus only; see ninja-core.js). All original characters.
//   Rook    clones: every U, S+U and I leaves a clone that fights beside him for three seconds (two at most).
//   Sable   lightning: skill hits build Static; at five, her next combo hit discharges it all.
//   Dune    sand: takes 20% less damage; each hit she takes adds a layer, and four layers make her next skill hit 50% harder.
//   Moro    shadow: every third skill hit holds the target in place.
//   Pell    puppets: a puppet on strings floats beside him, does his skills, and stabs at enemies in front on its own.
//   Hollis  stone: standing still gathers Stillness; each point makes his next skill 12% stronger, up to four.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja;
  if (!N) return;
  const A = D.abilities, CASTS = SW.casts, Proj = SW.Proj, boom = SW.boom, rand = SW.rand;
  const { hit, hurt, part, front, slide, ahead, nearest, every, floorY, pose, Later, Vis, Drive, pillar, smoke, sfx, ULT, TRAITS, pips, RIG, BORROW } = N;
  const NEW = ['rook', 'sable', 'dune', 'moro', 'pell', 'hollis'];

  // ================= heroes =================
  N.hero('rook', { name: 'Rook', alias: 'Sixfold', title: 'The Crowd of One', energy: 'Spirit', color: '#2ec4b6', colorHi: '#c8fff8', element: 'Clones', sig: 'Crowd', combo: 'fist', route: 'kael', pitch: 520,
    trait: 'crowd', blurb: 'Never fights alone.\nNot even when he is alone.', kit: ['twin_rush', 'swap_out', 'pile_on', 'magnet_grip', 'second_self', 'many_hands', 'thousand_crowd'] });
  N.hero('sable', { name: 'Sable', alias: 'Hum', title: 'The Thunder Hand', energy: 'Charge', color: '#8f7bff', colorHi: '#e6e0ff', element: 'Lightning', sig: 'Static', combo: 'dagger', route: 'nyra', modeKind: 'speed', pitch: 460,
    trait: 'static', blurb: 'Quiet, until the air starts to hum.\nThen it is already over.', kit: ['spark_kunai', 'flash_step', 'thunder_pierce', 'frost_steps', 'storm_hum', 'thunder_heart', 'thunderhead'] });
  N.hero('dune', { name: 'Dune', alias: 'Old Glass', title: 'The Walking Desert', energy: 'Grit', color: '#d9a441', colorHi: '#fff0c8', element: 'Sand', sig: 'Sandskin', combo: 'heavy', route: 'kael', pitch: 260,
    trait: 'sandskin', blurb: 'Slow to start, slower to stop.\nNothing gets through all that sand.', kit: ['sand_lance', 'dune_grip', 'sinking_sands', 'magnet_grip', 'grit_up', 'glass_storm', 'buried_city'] });
  N.hero('moro', { name: 'Moro', alias: 'Dusk', title: 'The Long Shadow', energy: 'Shade', color: '#5b5f97', colorHi: '#d0d2ff', element: 'Shadow', sig: 'Snare', combo: 'swift', route: 'nyra', modeKind: 'speed', pitch: 380,
    trait: 'snare', blurb: 'He would rather not fight at all.\nHe is very good at making it short.', kit: ['shade_dart', 'sink_step', 'shadow_snare', 'frost_steps', 'long_dusk', 'night_mind', 'long_night'] });
  N.hero('pell', { name: 'Pell', alias: 'Strings', title: 'The Stringmaster', energy: 'Thread', color: '#b5179e', colorHi: '#ffc8f0', element: 'Puppets', sig: 'Marionette', combo: 'flame', route: 'kael', pitch: 340,
    trait: 'marionette', blurb: 'He stands at the back and smiles.\nThe thing in front of him does not.', kit: ['puppet_lunge', 'venom_mist', 'iron_cradle', 'magnet_grip', 'taut_strings', 'grand_strings', 'grand_theatre'] });
  N.hero('hollis', { name: 'Hollis', alias: 'Old Moss', title: 'The Mountain Sage', energy: 'Stillness', color: '#6a994e', colorHi: '#e0ffc8', element: 'Stone', sig: 'Stillness', combo: 'heavy', route: 'nyra', pitch: 240,
    trait: 'stillness', blurb: 'Moves like a mountain.\nHits like one, too.', kit: ['mountain_palm', 'mudslick', 'old_shell', 'frost_steps', 'deep_root', 'mountain_heart', 'elder_mountain'] });

  N.abilities('rook', {
    twin_rush:      { name: 'Twin Rush', input: 'U', cost: 25, dmg: 11, desc: 'A clone dashes ahead through everything in its way. Every U, S+U and I leaves a clone that fights beside you for three seconds.' },
    swap_out:       { name: 'Swap Out', input: 'S + U', cost: 50, dmg: 14, desc: 'Leave a clone where you stand and reappear behind the nearest enemy with a kick. The clone goes up in smoke.' },
    pile_on:        { name: 'Pile-On', input: 'I', cost: 50, dmg: 7, desc: 'Four clones charge in one after another. The last one throws them into the air and smashes cracked walls.' },
    thousand_crowd: { name: 'A Thousand Rooks', dmg: 12, desc: 'wave after wave of clones runs over everyone on screen, then they all pile on.' }
  }, 'Second Self', 'Many Hands');
  N.abilities('sable', {
    spark_kunai:    { name: 'Spark Kunai', input: 'U', cost: 20, dmg: 9, desc: 'A charged knife that shocks its target again a moment later. Skill hits build Static; at five, your next combo hit lets it all out. Hold W to aim up.' },
    flash_step:     { name: 'Flash Step', input: 'S + U', cost: 50, dmg: 15, desc: 'Blink forward through enemies, cutting everything you pass.' },
    thunder_pierce: { name: 'Thunder Pierce', input: 'I', cost: 50, dmg: 24, desc: 'Charge your hand for a breath, then lunge a long way with it. Smashes cracked walls.' },
    thunderhead:    { name: 'Thunderhead', dmg: 11, desc: 'the sky closes over the arena and strikes everyone, again and again, then all at once.' }
  }, 'Storm Hum', 'Thunder Heart');
  N.abilities('dune', {
    sand_lance:     { name: 'Sand Lance', input: 'U', cost: 25, dmg: 12, desc: 'A spear of sand bursts out of the ground ahead, under the nearest enemy if one is close. Every hit you take adds a layer of sand; four make your next skill 50% stronger.' },
    dune_grip:      { name: 'Dune Grip', input: 'S + U', cost: 50, dmg: 10, desc: 'A hand of sand rises under the nearest enemy, holds them still and squeezes.' },
    sinking_sands:  { name: 'Sinking Sands', input: 'I', cost: 50, dmg: 8, desc: 'A mound of sand rolls forward, grinding whatever it covers, and bursts at the end. Smashes cracked walls.' },
    buried_city:    { name: 'Buried City', dmg: 10, desc: 'sand rises over the whole arena and holds everyone in it, then the whole weight comes down.' }
  }, 'Grit', 'Glass Storm');
  N.abilities('moro', {
    shade_dart:     { name: 'Shade Dart', input: 'U', cost: 20, dmg: 8, desc: 'Your shadow darts along the floor and pins the first enemy it touches. Every third skill hit holds the target in place.' },
    sink_step:      { name: 'Sink Step', input: 'S + U', cost: 50, dmg: 14, desc: 'Sink into your shadow and come up behind the nearest enemy with an elbow that lifts them.' },
    shadow_snare:   { name: 'Shadow Snare', input: 'I', cost: 50, dmg: 6, desc: 'Shadows spread out on both sides of you, hold everyone they reach and squeeze four times.' },
    long_night:     { name: 'Long Night', dmg: 10, desc: 'the lights go out. Hands of shadow rise under everyone, then close.' }
  }, 'Long Dusk', 'Night Mind');
  N.abilities('pell', {
    puppet_lunge:   { name: 'Puppet Lunge', input: 'U', cost: 25, dmg: 11, desc: 'Your puppet shoots forward on its strings, cutting everything on the way, and comes back. Left alone, it stabs at enemies in front of you.' },
    venom_mist:     { name: 'Venom Mist', input: 'S + U', cost: 50, dmg: 4, desc: 'The puppet breathes out a cloud of poison that burns whoever stands in it.' },
    iron_cradle:    { name: 'Iron Cradle', input: 'I', cost: 50, dmg: 7, desc: 'The puppet flies to the nearest enemy, opens, and shuts on them. Smashes cracked walls.' },
    grand_theatre:  { name: 'Grand Theatre', dmg: 11, desc: 'puppets drop on strings all over the stage, cut everyone, and close in together.' }
  }, 'Taut Strings', 'Grand Strings');
  N.abilities('hollis', {
    mountain_palm:  { name: 'Mountain Palm', input: 'U', cost: 25, dmg: 12, desc: 'A push of force that travels and shoves enemies back. Standing still gathers Stillness: each point makes your next skill 12% stronger, up to four.' },
    mudslick:       { name: 'Mudslick', input: 'S + U', cost: 50, dmg: 6, desc: 'Spill mud ahead of you for four seconds. Enemies in it trip and slow down.' },
    old_shell:      { name: 'Old Shell', input: 'I', cost: 50, dmg: 24, desc: 'Call down a giant stone tortoise on the spot ahead. Smashes cracked walls.' },
    elder_mountain: { name: 'Elder Mountain', dmg: 12, desc: 'a stone guardian taller than the arena rises behind him and stamps three times.' }
  }, 'Deep Root', 'Mountain Heart');

  // ================= Rook =================
  const TEAL = ['#2ec4b6', '#c8fff8', '#ffffff'];
  class Clone {   // fights on its own for a while: walks up to the nearest enemy and throws punches
    constructor(p, z, x, life) { Object.assign(this, { p, x, y: floorY(z, x, p.y - 20), face: p.face, life, t: 0, cd: 12, atkT: 0, isClone: true, sheet: p.sheet(), dmg: Math.max(2, Math.round(4 * p.dmgMul())) }); smoke(this.x, this.y, 8, TEAL); }
    update(g, z) {
      this.t++;
      if (--this.life <= 0 || this.p.dead) { this.gone = true; smoke(this.x, this.y, 10, TEAL); return; }
      if (this.cd > 0) this.cd--;
      if (this.atkT > 0) { if (--this.atkT === 6) { sfx('swing'); fx.slash(this.x + this.face * 14, this.y - 20, this.face, 1, TEAL[1], 26); hit(...front(this, 32, 38, 4), this.dmg, { kx: this.face * 1.5, ky: -1.5, stun: 20, srcX: this.x }); } return; }
      const e = nearest(z, this.x, this.y - 16, 240); this.moving = false;
      if (!e) return;
      this.face = e.x >= this.x ? 1 : -1;
      if (Math.abs(e.x - this.x) > 24) { this.moving = true; for (let s = 0; s < 2; s++) { if (z.hit(this.x + this.face - 5, this.y - 30, 10, 28)) break; this.x += this.face; } }
      else if (this.cd <= 0) { this.atkT = 12; this.cd = 34; }
    }
    draw(ctx, cam) {
      const a = this.atkT > 0 ? ['a1', this.atkT > 6 ? 0 : 1] : this.moving ? ['run', (this.t / 3 | 0) % 8] : ['idle', (this.t / 26 | 0) % 2];
      art.draw(ctx, this.sheet, a[0], a[1], this.x - cam.x, this.y - cam.y, this.face < 0, { alpha: Math.min(0.75, this.life / 20) });
    }
  }
  function clone(p, z, x) { const mine = z.shots.filter(s => s.isClone && s.p === p && !s.gone); if (mine.length >= 2) { mine[0].gone = true; smoke(mine[0].x, mine[0].y, 8, TEAL); } z.shots.push(new Clone(p, z, x, 180)); }
  const runner = (p, sheet, x, y, vx, dmg, o) => new Proj(Object.assign({ x, y, vx, dmg, w: 26, h: 34, life: 22, kx: 2, render(ctx, sx, sy, pr) { art.draw(ctx, sheet, pr.anim || 'dash', pr.anim === 'run' ? (pr.t / 2 | 0) % 8 : 0, sx, sy + 17, pr.vx < 0, { alpha: 0.8 }); } }, o || {}));
  Object.assign(CASTS, {
    twin_rush(p, z, dmg) {
      const sheet = p.sheet(); sfx('dash'); smoke(p.x + p.face * 10, p.y, 6, TEAL);
      z.shots.push(runner(p, sheet, p.x + p.face * 10, p.y - 17, p.face * 7.5, dmg, { pierce: true, maxHits: 2, stun: 28, think() { if (this.t % 3 === 0) fx.ghost(sheet, 'dash', 0, this.x, this.y + 17, this.vx < 0); }, onEnd(g, zz) { clone(p, zz, this.x); } }));
    },
    swap_out(p, z, dmg) {
      const x0 = p.x, e = nearest(z, p.x, p.y - 16, 220), side = e && e.x >= p.x ? 1 : -1, sheet = p.sheet(), f0 = p.face;
      z.shots.push(new Vis(x0, p.y, 22, (ctx, x, y, t) => art.draw(ctx, sheet, 'guard', 0, x, y, f0 < 0, { alpha: 0.8, flash: t > 16 && t % 2 === 0 }), v => { if (v.t === 21) { smoke(v.x, v.y, 14, TEAL); boom(v.x, v.y - 16, 30, Math.round(dmg * 0.5), TEAL[0]); } }));
      smoke(p.x, p.y, 10, TEAL); sfx('dash');
      let tx = e ? e.x + side * 22 : p.x + p.face * 90;
      if (z.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) tx = e ? e.x - side * 22 : p.x;
      if (!z.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) p.x = tx;
      if (e) p.face = e.x >= p.x ? 1 : -1;
      p.iframes = Math.max(p.iframes, 14); smoke(p.x, p.y, 10, TEAL); pose(p, 'a3', 1, 12); sfx('heavy');
      fx.slash(p.x + p.face * 12, p.y - 24, p.face, 2, TEAL[1], 40);
      hit(...front(p, 44, 50, 8), dmg, { kx: p.face * 2, ky: -6, stun: 40, heavy: true, launch: true, srcX: p.x - p.face * 8 });
      clone(p, z, x0);
    },
    pile_on(p, z, dmg) {
      const dir = p.face, sheet = p.sheet(); sfx('roar');
      for (let k = 0; k < 4; k++) z.shots.push(new Later(1 + k * 7, () => {
        const last = k === 3; sfx('dash'); smoke(p.x - dir * 24, p.y, 5, TEAL);
        z.shots.push(runner(p, sheet, p.x - dir * 24, p.y - 17, dir * 6.6, dmg * (last ? 2 : 1), { anim: 'run', life: 40, ghost: true, stun: last ? 44 : 26, ky: last ? -8 : -1.5, kx: last ? 1 : 2.5, heavy: last, breaker: last, launch: last, onEnd(g, zz, impact) { smoke(this.x, this.y + 17, 6, TEAL); if (impact) fx.slash(this.x, this.y, dir, last ? 3 : 1, TEAL[1], 34); } }));
      }));
      z.shots.push(new Later(30, (g, zz) => { if (!p.dead) clone(p, zz, p.x + dir * 30); }));
    },
    // magnet_grip / frost_steps (traversal, story only) are other heroes' and already exist
  });
  N.burst('rook', 'wheel_toss', 'Wheel Toss', 13, 'Two clones catch the nearest enemy, spin them, and throw them skyward.', (p, z, dmg) => {
    const e = nearest(z, p.x, p.y - 16, 150), dir = p.face, spot = { x: e ? e.x : p.x + dir * 50, y: e ? floorY(z, e.x, e.y - 20) : p.y }, sheet = p.sheet();
    smoke(spot.x - 20, spot.y, 6, TEAL); smoke(spot.x + 20, spot.y, 6, TEAL); sfx('dash');
    z.shots.push(new Vis(spot.x, spot.y, 40, (ctx, x, y, t) => { const f = (t >> 2) % 2; art.draw(ctx, sheet, f ? 'a2' : 'a1', 1, x - 18, y, false, { alpha: 0.8 }); art.draw(ctx, sheet, f ? 'a1' : 'a2', 1, x + 18, y, true, { alpha: 0.8 }); }));
    p.pose = ['cheer', 0];
    z.shots.push(new Drive(p, 34, t => {
      p.vx = 0;
      if (e && !e.dead) spot.x = e.x;
      if (t % 6 === 0 && t < 32) { sfx('swing'); fx.slash(spot.x, spot.y - 22, t % 12 ? 1 : -1, 1 + (t % 3), TEAL[1], 30); hit(spot.x - 22, spot.y - 50, 44, 50, Math.round(dmg * 0.5), { ky: -1, kx: 0, stun: 30, srcX: spot.x }); }
    }, () => { sfx('heavy'); fx.shake(5, 10); fx.ring(spot.x, spot.y - 20, TEAL[0], 4, 34, 12); hit(spot.x - 26, spot.y - 56, 52, 56, dmg * 2, { ky: -9.5, kx: dir * 0.5, stun: 46, heavy: true, launch: true, srcX: spot.x }); p.vy = -5; p.onGround = false; }));
  });
  ULT.thousand_crowd = (p, z, foes, dmg) => {
    const dir = p.face, sheet = p.sheet();
    if (p.st === 6) { fx.flash(TEAL[1], 8); sfx('roar'); }
    if (p.st >= 8 && p.st <= 54 && p.st % 3 === 0) {
      const x0 = G.cam.x + (dir > 0 ? -24 : W + 24), y = p.y - (p.st % 9 === 0 ? 0 : 0), fi = rand(0, 8) | 0;
      z.shots.push(new Vis(x0, y, 80, (ctx, x, yy, t) => art.draw(ctx, sheet, 'run', (t / 2 + fi | 0) % 8, x, yy, dir < 0, { alpha: 0.75 }), v => { v.x += dir * 8; if (v.t % 4 === 0) fx.dust(v.x, v.y, 1, -dir); }));
    }
    if (every(p, 12, 54, 6)) { sfx('heavy'); foes.forEach(e => { const b = e.box(); fx.slash(b.x + b.w / 2, b.y + b.h / 2, dir, 1 + (p.st % 3), TEAL[1], 34); hurt(e, dmg, { kx: dir * 1, ky: -1, stun: 30 }); }); }
    if (p.st === 62) { fx.flash(TEAL[0], 8); fx.shake(10, 18); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.dust(b.x + b.w / 2, b.y + b.h, 10); smoke(b.x + b.w / 2, b.y + b.h, 16, TEAL); hurt(e, dmg * 5, { ky: -6, down: true, stun: 50 }); }); }
  };
  TRAITS.crowd = { mark(ctx, p, x, y) { const n = G.zone ? G.zone.shots.filter(s => s.isClone && s.p === p && !s.gone).length : 0; if (n) pips(ctx, x, y - 50, n, 2, TEAL[0]); } };

  // ================= Sable =================
  const VIO = ['#8f7bff', '#e6e0ff', '#ffffff'];
  const R = {
    kunai(ctx, x, y, pr) { const d = Math.sign(pr.vx) || 1; art.rect(ctx, '#c8ccd8', x - 5, y - 1, 10, 2); art.rect(ctx, '#ffffff', x + (d > 0 ? 3 : -5), y - 1, 2, 2); art.rect(ctx, '#6c5aff', x - d * 6 - 1, y - 1, 2, 2); art.glow(ctx, x, y, 8, VIO[0], 0.2); if (pr.t % 3 === 0) art.rect(ctx, VIO[1], x + rand(-6, 6), y + rand(-4, 4), 1, 1); }
  };
  const zap = (e, dmg, o) => { if (!e || e.dead) return; const b = e.box(); fx.bolt(b.x + b.w / 2 + rand(-14, 14), b.y - 24, b.x + b.w / 2, b.y + b.h / 2, VIO[1]); sfx('zap'); hurt(e, dmg, Object.assign({ ky: 0, stun: 18, heavy: false }, o || {})); };
  Object.assign(CASTS, {
    spark_kunai(p, z, dmg, up) {
      sfx('shoot');
      z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 21, vx: p.face * 9.5, vy: up ? -4.5 : 0, dmg, w: 10, h: 6, life: 36, kx: 1, render: R.kunai,
        onEnd(g, zz) { this.hitSet.forEach(e => zz.shots.push(new Later(18, () => zap(e, Math.max(1, Math.round(dmg * 0.5)))))); } }));
    },
    flash_step(p, z, dmg) {
      const dir = p.face, x0 = p.x, hs = new Set(); let moved = 0;
      sfx('zap'); p.iframes = Math.max(p.iframes, 14);
      while (moved < 96 && slide(p, z, dir, 4)) { moved += 4; if (moved % 16 === 0) fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, dir < 0); }
      hit(Math.min(x0, p.x) - 8, p.y - 40, moved + 16, 42, dmg, { kx: dir * 1, stun: 30, heavy: true, hitSet: hs, srcX: p.x });
      fx.bolt(x0, p.y - 20, p.x, p.y - 20, VIO[1]); fx.slash(x0 + dir * moved / 2, p.y - 20, dir, 2, VIO[2], 50);
    },
    thunder_pierce(p, z, dmg) {
      const dir = p.face, hs = new Set();
      z.shots.push(new Drive(p, 26, t => {
        if (t <= 10) {
          p.vx = 0; p.pose = ['charge', t % 2]; if (t === 1) sfx('charge');
          const hx = p.x + dir * 10, hy = p.y - 22; part(hx + rand(-8, 8), hy + rand(-8, 8), t % 2 ? VIO[1] : VIO[0], 0, 0, 6, 2); if (t % 3 === 0) fx.bolt(hx, hy, hx + rand(-12, 12), hy + rand(-12, 12), VIO[1]);
          return;
        }
        if (t === 11) { sfx('zap'); fx.shake(3, 8); }
        p.pose = ['special', 1]; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2);
        const ok = slide(p, z, dir, 8);
        hit(...front(p, 34, 40, 10), dmg, { kx: dir * 6, ky: -3, stun: 36, heavy: true, down: true, breaker: true, hitSet: hs, srcX: p.x - dir * 12 });
        fx.bolt(p.x - dir * 24, p.y - 20 + rand(-6, 6), p.x + dir * 12, p.y - 22, VIO[1]); if (t % 2) fx.ghost(p.sheet(), 'special', 1, p.x, p.y, dir < 0);
        if (!ok) return false;
      }));
    }
  });
  N.burst('sable', 'storm_call', 'Storm Call', 15, 'Three bolts come down on the nearest enemy ahead. The last one holds them in place.', (p, z, dmg) => {
    const e = ahead(p, z, 260), tx = e ? e.x : p.x + p.face * 100; sfx('charge'); pose(p, 'cheer', 0, 16);
    fx.bolt(p.x + p.face * 4, p.y - 30, p.x + p.face * 10, G.cam.y - 10, VIO[1]);
    for (let k = 0; k < 3; k++) z.shots.push(new Later(10 + k * 12, (g, zz) => {
      const x = e && !e.dead ? e.x : tx, gy = floorY(zz, x, p.y - 30);
      fx.bolt(x + rand(-20, 20), G.cam.y - 10, x, gy, VIO[1]); fx.bolt(x + rand(-10, 10), G.cam.y - 10, x, gy, VIO[2]); fx.ring(x, gy - 4, VIO[0], 4, 30, 12); fx.shake(4, 8); sfx('zap');
      hit(x - 14, gy - 90, 28, 90, dmg, { ky: -3, stun: 34, heavy: true, status: k === 2 ? { freeze: 40 } : null, srcX: x });
    }));
  });
  ULT.thunderhead = (p, z, foes, dmg, h) => {
    if (p.st === 6) { fx.flash('#1a1040', 10); sfx('roar'); }
    if (p.st >= 6 && p.st <= 60) for (let i = 0; i < 2; i++) part(G.cam.x + rand(0, W), G.cam.y + rand(2, 22), i ? '#3a2a6a' : '#5a4a8a', rand(-0.5, 0.5), 0, 20, 4);
    if (every(p, 12, 48, 6)) { sfx('zap'); foes.forEach(e => { const b = e.box(); fx.bolt(b.x + b.w / 2 + rand(-30, 30), G.cam.y - 10, b.x + b.w / 2, b.y + b.h / 2, h.colorHi); hurt(e, dmg, { ky: -2, stun: 30 }); }); }
    if (p.st === 58) { fx.flash(VIO[1], 10); fx.shake(10, 18); sfx('explode'); foes.forEach(e => { const b = e.box(); for (let i = 0; i < 6; i++) fx.bolt(b.x + b.w / 2 + rand(-60, 60), G.cam.y - 10, b.x + b.w / 2, b.y + b.h / 2, i % 2 ? VIO[2] : VIO[0]); hurt(e, dmg * 5, { ky: -6, down: true, stun: 50 }); }); }
  };
  TRAITS.static = {
    hit(p, atk, e) {
      if (p.discharging) return;
      if (atk.energy) { p.stat = Math.min(5, (p.stat || 0) + 1); return; }
      if ((p.stat || 0) < 5 || !e || e.dead) return;
      p.stat = 0; p.discharging = true; fx.ring(p.x, p.y - 18, VIO[1], 4, 40, 12);
      try { zap(e, Math.round(10 * p.dmgMul()), { ky: -3, stun: 40, heavy: true, status: { freeze: 30 } }); } finally { p.discharging = false; }
    },
    mark(ctx, p, x, y) { if (p.stat) pips(ctx, x, y - 50, p.stat, 5, p.stat >= 5 && SW.frame % 8 < 4 ? '#ffffff' : VIO[0]); }
  };

  // ================= Dune =================
  const SAND = ['#d9a441', '#fff0c8', '#8a6a2a'];
  const sandBoost = p => { if ((p.sand || 0) < 4) return 1; p.sand = 0; fx.ring(p.x, p.y - 16, SAND[1], 6, 40, 14); return 1.5; };
  Object.assign(CASTS, {
    sand_lance(p, z, dmg) {
      dmg = Math.round(dmg * sandBoost(p)); const e = ahead(p, z, 90), x = e ? e.x : p.x + p.face * 60; sfx('land');
      pillar(z, x, floorY(z, x, p.y - 20), 8, dmg, { w: 14, h: 58, cols: SAND, spike: true, sfx: 'heavy', atk: { ky: -6, stun: 36, launch: true } });
    },
    dune_grip(p, z, dmg) {
      dmg = Math.round(dmg * sandBoost(p)); const e = ahead(p, z, 170), x0 = e ? e.x : p.x + p.face * 80, gy = floorY(z, x0, p.y - 20); sfx('land');
      z.shots.push(new Vis(x0, gy, 52, (ctx, x, y, t) => {
        const r = Math.min(1, t / 8), cl = t > 10 ? Math.min(1, (t - 10) / 6) : 0, hh = Math.round(40 * r);
        art.rect(ctx, SAND[0], x - 14, y - hh, 6, hh); art.rect(ctx, SAND[0], x + 8, y - hh, 6, hh); art.rect(ctx, SAND[2], x - 10, y - 6, 20, 6);
        art.rect(ctx, SAND[1], x - 14 + Math.round(cl * 6), y - hh - 4, 6, 4); art.rect(ctx, SAND[1], x + 8 - Math.round(cl * 6), y - hh - 4, 6, 4);
        if (t % 3 === 0) part(x + rand(-14, 14), y - rand(0, hh), SAND[t % 2], rand(-0.4, 0.4), 0.6, 12, 2, 0.05);
      }, v => {
        if (e && !e.dead && v.t < 40) v.x += (e.x - v.x) * 0.3;
        if (v.t === 10) hit(v.x - 18, v.y - 46, 36, 48, dmg, { ky: 0, kx: 0, stun: 50, status: { freeze: 70 }, srcX: v.x });
        if (v.t === 40) { sfx('heavy'); fx.debris(v.x, v.y - 20, SAND[0], 8); hit(v.x - 18, v.y - 46, 36, 48, Math.round(dmg * 0.8), { ky: -4, stun: 34, heavy: true, srcX: v.x }); }
      }));
    },
    sinking_sands(p, z, dmg) {
      dmg = Math.round(dmg * sandBoost(p)); const dir = p.face; sfx('burst');
      z.shots.push(new Proj({ x: p.x + dir * 20, y: p.y - 12, vx: dir * 3, dmg, w: 40, h: 26, life: 54, ghost: true, pierce: true, rehit: 12, kx: 0.8, ky: -0.5, stun: 22, status: { freeze: 12 },
        render(ctx, x, y, pr) { const k = Math.min(1, pr.t / 6); for (let i = -20; i <= 20; i += 4) { const hh = Math.round((14 - Math.abs(i) * 0.5) * k + Math.sin(pr.t * 0.4 + i) * 2); art.rect(ctx, i % 8 ? SAND[0] : SAND[2], x + i - 2, y + 13 - hh, 4, hh); } art.rect(ctx, SAND[1], x - 8, y + 13 - Math.round(14 * k), 16, 2); },
        think() { if (this.t % 2 === 0) part(this.x + rand(-20, 20), this.y + 10, SAND[0], rand(-1, 1), -rand(0.5, 2), 14, 2, 0.12); },
        onEnd() { boom(this.x, this.y, 40, Math.round(dmg * 1.6), SAND[0], null, { breaker: true, ky: -5 }); fx.debris(this.x, this.y, SAND[0], 10); } }));
    }
  });
  N.burst('dune', 'dune_sea', 'Dune Sea', 16, 'A wall of sand rises behind you and rolls across the floor, carrying enemies with it.', (p, z, dmg) => {
    dmg = Math.round(dmg * sandBoost(p)); const dir = p.face; sfx('roar'); fx.shake(5, 20);
    z.shots.push(new Proj({ x: p.x - dir * 10, y: p.y - 30, vx: dir * 4.6, dmg, w: 32, h: 60, life: 70, ghost: true, pierce: true, maxHits: 4, rehit: 14, kx: 4, ky: -4, stun: 32, heavy: true, breaker: true,
      render(ctx, x, y, pr) { const d = Math.sign(pr.vx) || 1, k = Math.min(1, pr.t / 8); for (let i = 0; i < 60 * k; i += 3) { const o = Math.round(Math.sin(i * 0.25 + pr.t * 0.4) * 3 + (60 - i) * 0.22); art.rect(ctx, i % 6 ? SAND[0] : SAND[1], x - d * o - 4, y + 30 - i - 3, 10, 3); } art.glow(ctx, x, y, 22, SAND[0], 0.1); },
      think() { for (let i = 0; i < 2; i++) part(this.x + rand(-12, 12), this.y + rand(-30, 30), i ? SAND[1] : SAND[0], Math.sign(this.vx) * rand(0.5, 2), -rand(0, 1.5), 16, 2, 0.1); } }));
  });
  ULT.buried_city = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(SAND[1], 8); sfx('roar'); }
    if (p.st >= 8 && p.st <= 46) for (let i = 0; i < 4; i++) part(G.cam.x + rand(0, W), p.y - rand(0, (p.st - 6) * 3), i % 2 ? SAND[0] : SAND[2], rand(-0.6, 0.6), -rand(0.5, 1.5), 18, 3);
    if (every(p, 12, 44, 8)) { sfx('burst'); foes.forEach(e => hurt(e, dmg, { ky: 0, kx: 0, stun: 30, status: { freeze: 24 } })); }
    if (p.st === 52) { fx.flash(SAND[0], 8); fx.shake(12, 20); sfx('explode'); for (let i = 0; i < 14; i++) fx.dust(G.cam.x + rand(0, W), p.y, 2); foes.forEach(e => { const b = e.box(); fx.debris(b.x + b.w / 2, b.y + b.h / 2, SAND[0], 10); hurt(e, dmg * 5, { ky: -6, down: true, stun: 50 }); }); }
  };
  TRAITS.sandskin = {
    hurt(p, atk) { return Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * 0.8)) }); },
    after(p, atk, r) { if (r === 'hit' && (p.sand || 0) < 4) { p.sand = (p.sand || 0) + 1; for (let i = 0; i < 6; i++) part(p.x + rand(-8, 8), p.y - rand(4, 30), SAND[0], rand(-1, 1), rand(-1, 0), 14, 2, 0.1); } },
    mark(ctx, p, x, y) { if (p.sand) pips(ctx, x, y - 52, p.sand, 4, p.sand >= 4 && SW.frame % 8 < 4 ? '#ffffff' : SAND[0]); }
  };

  // ================= Moro =================
  const SHADE = ['#1c1d33', '#5b5f97', '#d0d2ff'];
  const hold = e => { if (!e || e.dead) return; const b = e.box(); fx.ring(b.x + b.w / 2, b.y + b.h, SHADE[1], 4, 26, 14); for (let i = 0; i < 6; i++) part(b.x + rand(0, b.w), b.y + b.h - rand(0, 10), SHADE[0], 0, -rand(0.5, 1.5), 18, 3); hurt(e, 1, { ky: 0, kx: 0, stun: 44, heavy: false, status: { freeze: 50 } }); };
  Object.assign(CASTS, {
    shade_dart(p, z, dmg) {
      sfx('dash'); const gy = floorY(z, p.x, p.y - 20);
      z.shots.push(new Proj({ x: p.x + p.face * 12, y: gy - 6, vx: p.face * 6.5, dmg, w: 16, h: 12, life: 42, ghost: true, kx: 0, ky: 0, stun: 40, status: { freeze: 40 },
        render(ctx, x, y, pr) { const d = Math.sign(pr.vx) || 1; ctx.globalAlpha = 0.85; for (let i = 0; i < 6; i++) art.rect(ctx, i % 2 ? SHADE[0] : SHADE[1], x - d * (i * 6 + 6), y + 4, 6, 2); art.rect(ctx, SHADE[0], x - 4, y + 3, 8, 3); ctx.globalAlpha = 1; art.rect(ctx, SHADE[2], x + d * 3, y + 3, 2, 1); },
        onEnd(g, zz, impact) { if (impact) this.hitSet.forEach(hold); } }));
    },
    sink_step(p, z, dmg) {
      const e = nearest(z, p.x, p.y - 16, 220), side = e && e.x >= p.x ? 1 : -1, x0 = p.x; sfx('dash');
      const puddle = (x, y, n) => z.shots.push(new Vis(x, y, n, (ctx, sx, sy, t) => { const w = Math.round(14 * Math.sin(Math.PI * t / n)); ctx.globalAlpha = 0.8; art.rect(ctx, SHADE[0], sx - w, sy - 2, w * 2, 3); ctx.globalAlpha = 1; }));
      puddle(x0, p.y, 20);
      z.shots.push(new Drive(p, 14, t => {
        p.vx = 0; p.iframes = Math.max(p.iframes, 3); p.pose = ['down', 0];
        if (t === 7) {
          let tx = e ? e.x + side * 22 : p.x + p.face * 80;
          if (z.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) tx = e ? e.x - side * 22 : p.x;
          if (!z.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) p.x = tx;
          if (e) p.face = e.x >= p.x ? 1 : -1;
          puddle(p.x, p.y, 20);
        }
        if (t > 7) p.pose = ['launcher', 1];
      }, () => { sfx('heavy'); fx.slash(p.x + p.face * 12, p.y - 26, p.face, 2, SHADE[2], 40); hit(...front(p, 42, 54, 8), dmg, { kx: p.face * 1, ky: -7.5, stun: 44, heavy: true, launch: true, srcX: p.x - p.face * 8 }); }));
    },
    shadow_snare(p, z, dmg) {
      const x0 = p.x, gy = floorY(z, p.x, p.y - 20), hs = new Set(); sfx('charge'); pose(p, 'cast', 1, 20);
      z.shots.push(new Vis(x0, gy, 60, (ctx, x, y, t) => {
        const r = Math.round(Math.min(110, t * 10) * (t > 50 ? (60 - t) / 10 : 1)); ctx.globalAlpha = 0.75; art.rect(ctx, SHADE[0], x - r, y - 2, r * 2, 3); ctx.globalAlpha = 1;
        for (let i = -r; i <= r; i += 12) { const hh = Math.round(4 + Math.abs(Math.sin(t * 0.3 + i)) * 10); art.rect(ctx, SHADE[1], x + i, y - hh, 2, hh); }
      }, v => {
        const r = Math.min(110, v.t * 10);
        if (v.t >= 12 && v.t <= 36 && (v.t - 12) % 8 === 0) { hs.clear(); hit(v.x - r, v.y - 40, r * 2, 42, dmg, { ky: 0, kx: 0, stun: 30, status: { freeze: 30 }, hitSet: hs, srcX: v.x }); }
        if (v.t === 44) { sfx('heavy'); hit(v.x - r, v.y - 44, r * 2, 46, dmg * 2, { ky: -5, stun: 34, heavy: true, srcX: v.x }); }
      }));
    }
  });
  N.burst('moro', 'night_spikes', 'Night Spikes', 14, 'Three spikes of shadow burst out of the ground around the nearest enemy.', (p, z, dmg) => {
    const e = ahead(p, z, 240), x = e ? e.x : p.x + p.face * 80, gy = floorY(z, x, p.y - 20); sfx('charge'); pose(p, 'cast', 1, 18);
    [[-20, 6, 46], [20, 12, 46], [0, 20, 70]].forEach(([dx, d, hgt], k) => pillar(z, (k === 2 && e && !e.dead ? e.x : x) + dx, gy, d, k === 2 ? Math.round(dmg * 1.5) : dmg, { w: k === 2 ? 16 : 10, h: hgt, cols: SHADE, spike: true, sfx: 'heavy', atk: { ky: k === 2 ? -7 : -3, stun: 36, launch: k === 2 } }));
  });
  ULT.long_night = (p, z, foes, dmg) => {
    if (p.st === 6) { sfx('roar'); z.shots.push(new Vis(0, 0, 66, (ctx, x, y, t) => { ctx.globalAlpha = 0.65 * Math.min(1, t / 8, (66 - t) / 8); art.rect(ctx, '#05060c', 0, 0, W, SW.H); ctx.globalAlpha = 1; })); }
    if (every(p, 12, 52, 10)) { sfx('charge'); foes.forEach(e => { const b = e.box(); for (let i = 0; i < 5; i++) part(b.x + rand(0, b.w), b.y + b.h, SHADE[i % 2 + 1], 0, -rand(1, 3), 16, 3); hurt(e, dmg, { ky: 0, kx: 0, stun: 34, status: { freeze: 30 } }); }); }
    if (p.st === 60) { fx.flash(SHADE[2], 8); fx.shake(10, 16); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.ring(b.x + b.w / 2, b.y + b.h / 2, SHADE[1], 30, 4, 12); hurt(e, dmg * 5, { ky: -6, down: true, stun: 50 }); }); }
  };
  TRAITS.snare = {
    hit(p, atk, e) { if (!atk.energy || p.snaring) return; p.snN = (p.snN || 0) + 1; if (p.snN < 3) return; p.snN = 0; p.snaring = true; try { hold(e); } finally { p.snaring = false; } },
    mark(ctx, p, x, y) { if (p.snN) pips(ctx, x, y - 50, p.snN, 3, SHADE[2]); }
  };

  // ================= Pell =================
  const PLUM = ['#b5179e', '#ffc8f0', '#6a3a2a'];
  class Puppet {   // floats behind Pell on strings; a job (lunge, cradle ...) moves it for a while, then it drifts back
    constructor(p) { Object.assign(this, { p, x: p.x - p.face * 16, y: p.y - 12, t: 0, face: p.face, job: null, cd: 60, isPuppet: true, open: 0 }); }
    update(g, z) {
      const p = this.p; this.t++;
      if (this.job) { const j = this.job; j.t++; if (j.step(j.t, this, z) === false || j.t >= j.n) this.job = null; return; }
      const hx = p.x - p.face * 16, hy = p.y - 12 + Math.sin(this.t * 0.08) * 2;
      this.x += (hx - this.x) * 0.2; this.y += (hy - this.y) * 0.2; this.face = p.face; this.open = Math.max(0, this.open - 1);
      if (this.cd > 0) { this.cd--; return; }
      if (!p.dead && ahead(p, z, 70)) { this.cd = 110; lunge(this, z, 44, Math.max(2, Math.round(4 * p.dmgMul())), 10); }
    }
    draw(ctx, cam) {
      const p = this.p, x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), d = this.face, hx = Math.round(p.x - cam.x + p.face * 6), hy = Math.round(p.y - cam.y - 26);
      ctx.globalAlpha = 0.45; art.line(ctx, PLUM[1], hx, hy, x, y - 14, 1); art.line(ctx, PLUM[1], hx, hy, x - 4, y - 6, 1); art.line(ctx, PLUM[1], hx, hy, x + 4, y - 6, 1); ctx.globalAlpha = 1;
      const sw = Math.round(Math.sin(this.t * 0.2) * 2), op = this.open > 0 ? 3 : 0;
      art.rect(ctx, PLUM[2], x - 4 - op, y - 8, 8 + op * 2, 12); art.rect(ctx, '#8a5a3a', x - 3, y - 7, 6, 2); art.rect(ctx, PLUM[0], x - 4 - op, y - 2, 8 + op * 2, 2);
      art.disc(ctx, '#f0e6d8', x, y - 12, 4); art.rect(ctx, PLUM[0], x + d * 1, y - 13, 2, 1); art.rect(ctx, '#2a1a1a', x - 1, y - 10, 3, 1);
      art.line(ctx, '#8a5a3a', x, y - 6, x + d * 8, y - 2 + sw, 1); art.rect(ctx, '#e8ecf4', x + (d > 0 ? 8 : -12), y - 3 + sw, 4, 1);
      art.line(ctx, '#8a5a3a', x, y - 6, x - d * 6, y + sw, 1); art.rect(ctx, '#4a2a1a', x - 3, y + 4, 2, 5); art.rect(ctx, '#4a2a1a', x + 1, y + 4, 2, 5);
      if (this.open > 0) { art.glow(ctx, x, y - 4, 10, PLUM[0], 0.16); for (let i = -1; i <= 1; i++) art.rect(ctx, '#e8ecf4', x - 1 + i * 3, y - 6, 1, 8); }
    }
  }
  const puppetOf = (p, z) => { let pu = z.shots.find(s => s.isPuppet && s.p === p && !s.gone); if (!pu) { pu = new Puppet(p); z.shots.push(pu); } return pu; };
  // shoot forward `dist`, cutting, then come back
  function lunge(pu, z, dist, dmg, n, o) {
    const dir = pu.p.face, hs = new Set(), x0 = pu.x, out = Math.max(4, n >> 1); pu.face = dir; sfx('swing');
    pu.job = { t: 0, n: n + out, step(t, q) {
      if (t <= out) { q.x = x0 + dir * dist * (t / out); q.y += (pu.p.y - 20 - q.y) * 0.4; hit(q.x - 14, q.y - 16, 28, 30, dmg, Object.assign({ kx: dir * 2, ky: -1.5, stun: 26, hitSet: hs, srcX: q.x - dir * 10 }, o || {})); if (t === out) fx.slash(q.x + dir * 8, q.y - 4, dir, 1, PLUM[1], 26); }
      else { const hx = pu.p.x - pu.p.face * 16; q.x += (hx - q.x) * 0.3; q.y += (pu.p.y - 12 - q.y) * 0.3; }
    } };
  }
  Object.assign(CASTS, {
    puppet_lunge(p, z, dmg) { const pu = puppetOf(p, z); pu.x = p.x + p.face * 6; lunge(pu, z, 92, dmg, 20, { pierce: true }); },
    venom_mist(p, z, dmg) {
      const pu = puppetOf(p, z), x = p.x + p.face * 44, gy = floorY(z, x, p.y - 20); pu.open = 30; sfx('burst');
      z.shots.push(new Vis(x, gy, 160, (ctx, sx, sy, t) => {
        const k = Math.min(1, t / 12, (160 - t) / 20);
        ctx.globalAlpha = 0.32 * k; for (let i = 0; i < 6; i++) art.disc(ctx, i % 2 ? '#7a1a6a' : PLUM[0], sx + Math.round(Math.sin(t * 0.05 + i * 1.7) * 22), sy - 14 - Math.round(Math.cos(t * 0.04 + i) * 8) - (i % 3) * 6, 10 + (i % 3) * 3); ctx.globalAlpha = 1;
      }, v => { if (v.t % 4 === 0) part(v.x + rand(-30, 30), v.y - rand(2, 36), PLUM[v.t % 8 ? 0 : 1], rand(-0.3, 0.3), -0.3, 18, 2); if (v.t % 15 === 5) hit(v.x - 34, v.y - 46, 68, 46, dmg, { ky: 0, kx: 0, stun: 12, status: { burn: 2 }, srcX: v.x }); }));
    },
    iron_cradle(p, z, dmg) {
      const pu = puppetOf(p, z), e = ahead(p, z, 170), dir = p.face, spot = { x: e ? e.x : p.x + dir * 80, y: e ? floorY(z, e.x, e.y - 20) : floorY(z, p.x, p.y - 20) }; sfx('dash');
      const sx0 = pu.x, sy0 = pu.y;
      pu.job = { t: 0, n: 52, step(t, q) {
        if (t <= 8) { q.x = sx0 + (spot.x - sx0) * (t / 8); q.y = sy0 + (spot.y - 22 - sy0) * (t / 8); return; }
        if (e && !e.dead && t < 40) spot.x += (e.x - spot.x) * 0.25;
        q.x = spot.x; q.y = spot.y - 22; q.open = 2;
        if (t === 9) { sfx('heavy'); fx.ring(spot.x, spot.y - 22, PLUM[0], 30, 6, 10); }
        if (t === 12 || t === 18 || t === 24 || t === 30) { sfx('swing'); fx.slash(spot.x, spot.y - 22, t % 12 ? 1 : -1, 1, '#e8ecf4', 24); hit(spot.x - 18, spot.y - 46, 36, 48, dmg, { ky: 0, kx: 0, stun: 30, status: { freeze: 24 }, srcX: spot.x }); }
        if (t === 38) { sfx('explode'); fx.shake(5, 10); fx.spark(spot.x, spot.y - 22, PLUM[1], 12, 3); hit(spot.x - 22, spot.y - 50, 44, 52, dmg * 2, { ky: -6, kx: dir * 3, stun: 40, heavy: true, breaker: true, srcX: spot.x - dir * 10 }); }
      } };
      z.shots.push(new Vis(spot.x, spot.y, 40, (ctx, x, y, t) => { if (t < 9) return; const c = Math.max(0, 18 - (t - 9) * 4), sx = Math.round(spot.x - G.cam.x); art.rect(ctx, '#3a2a2a', sx - 18 - c, y - 48, 8, 46); art.rect(ctx, '#3a2a2a', sx + 10 + c, y - 48, 8, 46); art.rect(ctx, PLUM[0], sx - 18 - c, y - 48, 8, 2); art.rect(ctx, PLUM[0], sx + 10 + c, y - 48, 8, 2); for (let i = 0; i < 4; i++) { art.rect(ctx, '#c8ccd8', sx - 10 - c, y - 42 + i * 10, 3, 1); art.rect(ctx, '#c8ccd8', sx + 7 + c, y - 42 + i * 10, 3, 1); } }));
    }
  });
  N.burst('pell', 'hundred_strings', 'Hundred Strings', 5, 'The puppet rises and fires a fan of twelve needles at the nearest enemy.', (p, z, dmg) => {
    const pu = puppetOf(p, z), e = nearest(z, p.x, p.y - 16, 260), dir = p.face, y0 = pu.y; sfx('charge');
    pu.job = { t: 0, n: 34, step(t, q) {
      if (t <= 8) { q.y = y0 - 46 * (t / 8); q.x += (p.x + dir * 8 - q.x) * 0.3; return; }
      q.open = 2;
      if (t <= 20) {
        const tx = e && !e.dead ? e.x : q.x + dir * 120, ty = e && !e.dead ? e.y - 14 : p.y - 10, a = Math.atan2(ty - q.y, tx - q.x) + (t - 15) * 0.03; sfx('shoot');
        z.shots.push(new Proj({ x: q.x, y: q.y, vx: Math.cos(a) * 8.5, vy: Math.sin(a) * 8.5, dmg, w: 10, h: 10, life: 40, kx: 0.6, ky: -0.5, stun: 16, render(ctx, x, y, pr) { const m = Math.hypot(pr.vx, pr.vy) || 1; art.line(ctx, '#e8ecf4', x - pr.vx / m * 6, y - pr.vy / m * 6, x, y, 1); art.rect(ctx, PLUM[0], x - 1, y - 1, 2, 2); } }));
      }
    } };
  });
  ULT.grand_theatre = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(PLUM[1], 8); sfx('perfect'); }
    if (every(p, 10, 54, 6)) {
      sfx('swing');
      foes.forEach(e => {
        const b = e.box(), x = b.x + b.w / 2 + rand(-30, 30), ty = b.y + b.h / 2;
        z.shots.push(new Vis(x, G.cam.y, 14, (ctx, sx, sy, t) => { const y = Math.round(sy + (ty - G.cam.y) * Math.min(1, t / 6)); ctx.globalAlpha = 0.5; art.line(ctx, PLUM[1], sx, sy, sx, y - 10, 1); ctx.globalAlpha = 1; art.rect(ctx, PLUM[2], sx - 3, y - 8, 6, 10); art.disc(ctx, '#f0e6d8', sx, y - 11, 3); art.rect(ctx, '#e8ecf4', sx - 8, y - 4, 16, 1); }));
        fx.slash(b.x + b.w / 2, ty, x > b.x + b.w / 2 ? -1 : 1, 1 + (p.st % 3), '#e8ecf4', 30); hurt(e, dmg, { ky: -1, stun: 30 });
      });
    }
    if (p.st === 62) { fx.flash(PLUM[0], 8); fx.shake(9, 16); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.ring(b.x + b.w / 2, b.y + b.h / 2, PLUM[0], 40, 4, 12); hurt(e, dmg * 4, { ky: -6, down: true, stun: 50 }); }); }
  };
  TRAITS.marionette = { tick(p, g, z) { puppetOf(p, z); } };

  // ================= Hollis =================
  const MOSS = ['#6a994e', '#e0ffc8', '#3a5a2a'], ROCK = ['#7a6a58', '#b0a088', '#4a3e32'];
  const still = p => { const n = p.still || 0; if (!n) return 1; p.still = 0; fx.ring(p.x, p.y - 16, MOSS[1], 6, 36, 14); return 1 + 0.12 * n; };
  Object.assign(CASTS, {
    mountain_palm(p, z, dmg) {
      dmg = Math.round(dmg * still(p)); sfx('heavy'); pose(p, 'a2', 1, 12); fx.ring(p.x + p.face * 14, p.y - 20, MOSS[1], 4, 18, 10);
      z.shots.push(new Proj({ x: p.x + p.face * 16, y: p.y - 20, vx: p.face * 5.2, dmg, w: 22, h: 32, life: 24, ghost: true, pierce: true, maxHits: 2, kx: 5, ky: -2, stun: 30, heavy: true,
        render(ctx, x, y, pr) { const d = Math.sign(pr.vx) || 1; for (let i = 0; i < 3; i++) for (let j = -10; j <= 10; j += 2) art.rect(ctx, i ? MOSS[0] : MOSS[1], x - d * i * 5 + d * Math.round(Math.sqrt(Math.max(0, 100 - j * j)) / 2), y + j, 2, 2); } }));
    },
    mudslick(p, z, dmg) {
      dmg = Math.round(dmg * still(p)); const x = p.x + p.face * 46, gy = floorY(z, x, p.y - 20); sfx('land');
      z.shots.push(new Vis(x, gy, 240, (ctx, sx, sy, t) => {
        const k = Math.min(1, t / 8, (240 - t) / 20), w = Math.round(40 * k);
        art.rect(ctx, '#4a3a22', sx - w, sy - 2, w * 2, 3); art.rect(ctx, '#6a5432', sx - w + 2, sy - 3, Math.max(0, w * 2 - 4), 1);
        for (let i = -w; i < w; i += 9) if ((t + i) % 40 < 12) art.rect(ctx, '#8a7448', sx + i, sy - 4, 2, 2);
      }, v => { if (v.t % 20 === 6) hit(v.x - 40, v.y - 22, 80, 24, dmg, { down: true, ky: -1, kx: 0, stun: 30, status: { freeze: 20 }, srcX: v.x }); }));
    },
    old_shell(p, z, dmg) {
      dmg = Math.round(dmg * still(p)); const dir = p.face, x = p.x + dir * 56, gy = floorY(z, x, p.y - 20); sfx('charge'); pose(p, 'cheer', 0, 16);
      z.shots.push(new Vis(x, gy, 50, (ctx, sx, sy, t) => {
        const yy = t < 14 ? -150 + Math.round(t * t * 0.76) : 0, a = t > 40 ? (50 - t) / 10 : 1, y = sy + yy;
        ctx.globalAlpha = a;
        art.rect(ctx, ROCK[2], sx - 30, y - 12, 8, 12); art.rect(ctx, ROCK[2], sx + 22, y - 12, 8, 12);
        art.rect(ctx, MOSS[2], sx - 32, y - 26, 64, 16); art.rect(ctx, MOSS[0], sx - 28, y - 34, 56, 10); art.rect(ctx, '#8ab86e', sx - 20, y - 38, 40, 6);
        for (let i = -24; i <= 16; i += 12) art.rect(ctx, MOSS[2], sx + i, y - 32, 8, 2);
        art.rect(ctx, ROCK[1], sx + dir * 32 - 5, y - 22, 10, 9); art.rect(ctx, '#2a1a1a', sx + dir * 34 - 1, y - 20, 2, 2);
        ctx.globalAlpha = 1;
        if (t < 14) { ctx.globalAlpha = 0.3; art.rect(ctx, '#05060c', sx - 30, sy - 2, 60, 3); ctx.globalAlpha = 1; }
      }, v => { if (v.t === 14) { sfx('explode'); fx.shake(8, 14); fx.dust(v.x, v.y, 12); fx.debris(v.x, v.y - 10, ROCK[1], 10); hit(v.x - 38, v.y - 46, 76, 48, dmg, { heavy: true, breaker: true, down: true, ky: -4, kx: dir * 3, stun: 40, srcX: v.x - dir * 20 }); } }));
    }
  });
  N.burst('hollis', 'boulder_fall', 'Boulder Fall', 28, 'A boulder the size of a house drops on the nearest enemy ahead.', (p, z, dmg) => {
    dmg = Math.round(dmg * still(p)); const e = ahead(p, z, 240), tx = e ? e.x : p.x + p.face * 90, gy = floorY(z, tx, p.y - 20); sfx('charge'); pose(p, 'cheer', 0, 18);
    const mark = new Vis(tx, gy, 22, (ctx, sx, sy, t) => { const w = Math.round(6 + t); ctx.globalAlpha = 0.4; art.rect(ctx, '#05060c', sx - w, sy - 2, w * 2, 3); ctx.globalAlpha = 1; }, v => { if (e && !e.dead) v.x += (e.x - v.x) * 0.2; });
    z.shots.push(mark);
    z.shots.push(new Later(22, (g, zz) => {
      sfx('dash');
      zz.shots.push(new Proj({ x: mark.x, y: G.cam.y - 20, vy: 9, g: 0.4, dmg: Math.round(dmg * 0.4), w: 30, h: 30, life: 80, kx: 0, ky: 2, stun: 30, heavy: true,
        render(ctx, x, y) { art.disc(ctx, ROCK[2], x, y, 15); art.disc(ctx, ROCK[0], x - 1, y - 1, 13); art.disc(ctx, ROCK[1], x - 4, y - 5, 6); art.rect(ctx, MOSS[0], x - 8, y - 14, 10, 3); },
        onEnd() { boom(this.x, this.y, 44, dmg, ROCK[1], null, { breaker: true, down: true, ky: -5, stun: 44 }); fx.debris(this.x, this.y, ROCK[1], 14); fx.dust(this.x, this.y + 10, 10); fx.shake(9, 16); } }));
    }));
  });
  ULT.elder_mountain = (p, z, foes, dmg) => {
    const dir = p.face;
    if (p.st === 6) {
      fx.flash(MOSS[1], 8); sfx('roar');
      z.shots.push(new Vis(p.x - dir * 8, p.y, 70, (ctx, sx, sy, t) => {
        const rise = Math.max(0, 120 - t * 5), y = sy + rise, stomp = [30, 44, 58].some(s => t + 6 >= s && t + 6 < s + 4) ? 4 : 0, a = t > 62 ? (70 - t) / 8 : 1;
        ctx.globalAlpha = 0.92 * a;
        art.rect(ctx, ROCK[2], sx - 34, y - 96 + stomp, 68, 70); art.rect(ctx, ROCK[0], sx - 30, y - 92 + stomp, 60, 62);
        art.rect(ctx, ROCK[2], sx - 52, y - 88 + stomp, 18, 56); art.rect(ctx, ROCK[2], sx + 34, y - 88 + stomp, 18, 56);
        art.rect(ctx, ROCK[2], sx - 28, y - 26, 20, 26); art.rect(ctx, ROCK[2], sx + 8, y - 26, 20, 26);
        art.rect(ctx, ROCK[0], sx - 16, y - 122 + stomp, 32, 28); art.rect(ctx, MOSS[0], sx - 18, y - 124 + stomp, 36, 6); art.rect(ctx, MOSS[0], sx - 34, y - 98 + stomp, 68, 4);
        art.rect(ctx, MOSS[1], sx - 9, y - 112 + stomp, 5, 3); art.rect(ctx, MOSS[1], sx + 4, y - 112 + stomp, 5, 3);
        ctx.globalAlpha = 1; art.glow(ctx, sx, y - 110 + stomp, 20, MOSS[1], 0.1 * a);
      }));
    }
    [30, 44, 58].forEach((s, k) => {
      if (p.st !== s) return;
      fx.shake(10 + k * 2, 16); sfx('explode'); fx.flash(k === 2 ? MOSS[0] : MOSS[1], 5);
      for (let i = 0; i < 12; i++) fx.dust(G.cam.x + rand(0, W), p.y, 2);
      foes.forEach(e => hurt(e, dmg * (k === 2 ? 5 : 2), { ky: k === 2 ? -7 : -5, launch: k < 2, down: k === 2, stun: 40 }));
    });
  };
  TRAITS.stillness = {
    tick(p) {
      if (p.state === 'idle' || p.state === 'charge' || p.state === 'guard') { p.stillT = (p.stillT || 0) + 1; if (p.stillT % 30 === 0 && (p.still || 0) < 4) { p.still = (p.still || 0) + 1; fx.ring(p.x, p.y - 16, MOSS[1], 20, 6, 10); } }
      else p.stillT = 0;
    },
    mark(ctx, p, x, y) { if (p.still) pips(ctx, x, y - 54, p.still, 4, p.still >= 4 ? MOSS[1] : MOSS[0]); }
  };

  // ================= sprites =================
  Object.assign(RIG, {
    rook:   { head: 'headband', c: { skin: '#e8b890', hair: '#1c3a3a', acc: '#2a2a34', white: '#c8ccd8', top: '#1c5a58', arm: '#1c5a58', fore: '#e8b890', hand: '#e8b890', pants: '#22303a', boots: '#2ec4b6', belt: '#2ec4b6', chest: '#c8fff8', trail: '#2ec4b6' }, trailLen: 3 },
    sable:  { head: 'scarf', weapon: 'tanto', armed: 1, c: { skin: '#d8c0b0', hair: '#14122a', acc: '#3a2e6a', top: '#3d3470', arm: '#3d3470', fore: '#8f7bff', hand: '#e6e0ff', pants: '#1a1830', boots: '#3a2e6a', belt: '#8f7bff', chest: '#e6e0ff', trail: '#3a2e6a' }, trailHead: 1, trailLen: 5 },
    dune:   { head: 'veil', sc: 1.06, limb: 3, bulk: 9, c: { skin: '#b08060', hair: '#d9a441', acc: '#c8a878', accD: '#8a6a2a', glow: '#fff0c8', top: '#c89a5a', arm: '#c89a5a', fore: '#e8d0a0', hand: '#b08060', pants: '#8a6a3a', boots: '#5a4020', belt: '#fff0c8', chest: '#d9a441', trail: '#c89a5a' }, trailLen: 4, trailW: 3 },
    moro:   { head: 'knot', c: { skin: '#d8b498', hair: '#1a1a24', top: '#4a4f78', arm: '#4a4f78', fore: '#2a2a3a', hand: '#d8b498', pants: '#22243a', boots: '#14141e', belt: '#5b5f97', chest: '#d0d2ff' } },
    pell:   { head: 'mask', c: { skin: '#c8a890', hair: '#2a1a2a', white: '#f0e6d8', glow: '#b5179e', top: '#4a1a44', arm: '#4a1a44', fore: '#b5179e', hand: '#c8a890', pants: '#2a1428', boots: '#1a0c18', belt: '#ffc8f0', chest: '#b5179e', trail: '#4a1a44' }, trailLen: 5 },
    hollis: { head: 'sage', sc: 1.1, limb: 4, bulk: 9, c: { skin: '#c89a78', hair: '#c8ccc0', acc: '#6a994e', white: '#e8ece0', top: '#4a6a3a', arm: '#4a6a3a', fore: '#c89a78', hand: '#c89a78', pants: '#3a3a2a', boots: '#2a2418', belt: '#e0ffc8', chest: '#6a994e', trail: '#6a994e' }, trailLen: 4, trailW: 3 }
  });
  Object.assign(BORROW, { rook: 'kael', sable: 'vesper', dune: 'brakk', moro: 'gale', pell: 'pyra', hollis: 'brakk' });
  N.portraits(NEW);

  // Versus balance (same table as js/versus.js V.tune): fitted with tools/versus-balance.js, each hero against the fifteen
  // regular heroes, both sides, bots on Normal. Untuned they won 38-57%; with this table about 44-58%.
  if (SW.versus && SW.versus.tune) Object.assign(SW.versus.tune, { rook: 0.8, sable: 0.85, dune: 1, moro: 1.3, pell: 1.05, hollis: 1.3 });   // re-solved 2026-11-15 with everyone in one pool (see js/versus.js)

  // ================= translations =================
  const ES = {
    'The Crowd of One': 'La Multitud de Uno', 'Clones': 'Clones', 'Crowd': 'Multitud', 'Never fights alone.': 'Nunca pelea solo.', 'Not even when he is alone.': 'Ni siquiera cuando está solo.',
    'Twin Rush': 'Doble Embestida', 'A clone dashes ahead through everything in its way. Every U, S+U and I leaves a clone that fights beside you for three seconds.': 'Un clon se lanza hacia delante atravesando todo lo que encuentra. Cada U, S+U e I deja un clon que pelea a tu lado durante tres segundos.',
    'Swap Out': 'Relevo', 'Leave a clone where you stand and reappear behind the nearest enemy with a kick. The clone goes up in smoke.': 'Deja un clon donde estás y reaparece detrás del enemigo más cercano con una patada. El clon se deshace en humo.',
    'Pile-On': 'Montón', 'Four clones charge in one after another. The last one throws them into the air and smashes cracked walls.': 'Cuatro clones cargan uno tras otro. El último lanza al enemigo por los aires y rompe muros agrietados.',
    'Wheel Toss': 'Rueda y Lanzamiento', 'Two clones catch the nearest enemy, spin them, and throw them skyward.': 'Dos clones atrapan al enemigo más cercano, lo hacen girar y lo lanzan hacia el cielo.',
    'Second Self': 'Segundo Yo', 'Many Hands': 'Muchas Manos', 'A Thousand Rooks': 'Mil Rooks',
    'The Thunder Hand': 'La Mano del Trueno', 'Static': 'Estática', 'Quiet, until the air starts to hum.': 'Callada, hasta que el aire empieza a zumbar.', 'Then it is already over.': 'Para entonces ya ha terminado.',
    'Spark Kunai': 'Kunai Chispa', 'A charged knife that shocks its target again a moment later. Skill hits build Static; at five, your next combo hit lets it all out. Hold W to aim up.': 'Un cuchillo cargado que vuelve a electrocutar a su objetivo un momento después. Los golpes de habilidad acumulan Estática; con cinco, tu siguiente golpe de combo la descarga toda. Mantén W para apuntar arriba.',
    'Flash Step': 'Paso Relámpago', 'Blink forward through enemies, cutting everything you pass.': 'Te teletransportas hacia delante entre los enemigos, cortando todo lo que atraviesas.',
    'Thunder Pierce': 'Perforación de Trueno', 'Charge your hand for a breath, then lunge a long way with it. Smashes cracked walls.': 'Cargas la mano un instante y luego te lanzas muy lejos con ella. Rompe muros agrietados.',
    'Storm Call': 'Llamada de Tormenta', 'Three bolts come down on the nearest enemy ahead. The last one holds them in place.': 'Caen tres rayos sobre el enemigo más cercano delante de ti. El último lo deja inmóvil.',
    'Storm Hum': 'Zumbido de Tormenta', 'Thunder Heart': 'Corazón de Trueno', 'Thunderhead': 'Nube de Tormenta',
    'The Walking Desert': 'El Desierto Andante', 'Sand': 'Arena', 'Sandskin': 'Piel de Arena', 'Slow to start, slower to stop.': 'Lenta al empezar, más lenta al parar.', 'Nothing gets through all that sand.': 'Nada atraviesa tanta arena.',
    'Sand Lance': 'Lanza de Arena', 'A spear of sand bursts out of the ground ahead, under the nearest enemy if one is close. Every hit you take adds a layer of sand; four make your next skill 50% stronger.': 'Una lanza de arena brota del suelo delante de ti, bajo el enemigo más cercano si está cerca. Cada golpe que recibes añade una capa de arena; con cuatro, tu siguiente habilidad es un 50% más fuerte.',
    'Dune Grip': 'Garra de Duna', 'A hand of sand rises under the nearest enemy, holds them still and squeezes.': 'Una mano de arena surge bajo el enemigo más cercano, lo inmoviliza y lo aprieta.',
    'Sinking Sands': 'Arenas Movedizas', 'A mound of sand rolls forward, grinding whatever it covers, and bursts at the end. Smashes cracked walls.': 'Un montículo de arena rueda hacia delante, tritura lo que cubre y estalla al final. Rompe muros agrietados.',
    'Dune Sea': 'Mar de Dunas', 'A wall of sand rises behind you and rolls across the floor, carrying enemies with it.': 'Un muro de arena se alza detrás de ti y rueda por el suelo arrastrando a los enemigos.',
    'Glass Storm': 'Tormenta de Vidrio', 'Buried City': 'Ciudad Enterrada',
    'The Long Shadow': 'La Sombra Larga', 'Shadow': 'Sombra', 'Snare': 'Atadura', 'He would rather not fight at all.': 'Preferiría no pelear en absoluto.', 'He is very good at making it short.': 'Y es muy bueno acabando rápido.',
    'Shade Dart': 'Dardo de Sombra', 'Your shadow darts along the floor and pins the first enemy it touches. Every third skill hit holds the target in place.': 'Tu sombra corre por el suelo e inmoviliza al primer enemigo que toca. Cada tercer golpe de habilidad deja al objetivo inmóvil.',
    'Sink Step': 'Paso Hundido', 'Sink into your shadow and come up behind the nearest enemy with an elbow that lifts them.': 'Te hundes en tu sombra y sales detrás del enemigo más cercano con un codazo que lo levanta.',
    'Shadow Snare': 'Trampa de Sombras', 'Shadows spread out on both sides of you, hold everyone they reach and squeeze four times.': 'Las sombras se extienden a ambos lados, atrapan a todos los que alcanzan y aprietan cuatro veces.',
    'Night Spikes': 'Púas Nocturnas', 'Three spikes of shadow burst out of the ground around the nearest enemy.': 'Tres púas de sombra brotan del suelo alrededor del enemigo más cercano.',
    'Long Dusk': 'Largo Ocaso', 'Night Mind': 'Mente Nocturna', 'Long Night': 'Larga Noche',
    'The Stringmaster': 'El Titiritero', 'Puppets': 'Marionetas', 'Marionette': 'Marioneta', 'He stands at the back and smiles.': 'Él se queda atrás y sonríe.', 'The thing in front of him does not.': 'La cosa que tiene delante, no.',
    'Puppet Lunge': 'Estocada de Marioneta', 'Your puppet shoots forward on its strings, cutting everything on the way, and comes back. Left alone, it stabs at enemies in front of you.': 'Tu marioneta sale disparada con sus hilos, corta todo a su paso y vuelve. Por su cuenta, apuñala a los enemigos que tienes delante.',
    'Venom Mist': 'Niebla Venenosa', 'The puppet breathes out a cloud of poison that burns whoever stands in it.': 'La marioneta exhala una nube de veneno que quema a quien se quede dentro.',
    'Iron Cradle': 'Cuna de Hierro', 'The puppet flies to the nearest enemy, opens, and shuts on them. Smashes cracked walls.': 'La marioneta vuela hasta el enemigo más cercano, se abre y se cierra sobre él. Rompe muros agrietados.',
    'Hundred Strings': 'Cien Hilos', 'The puppet rises and fires a fan of twelve needles at the nearest enemy.': 'La marioneta se eleva y dispara un abanico de doce agujas al enemigo más cercano.',
    'Taut Strings': 'Hilos Tensos', 'Grand Strings': 'Grandes Hilos', 'Grand Theatre': 'Gran Teatro',
    'The Mountain Sage': 'El Sabio de la Montaña', 'Stone': 'Piedra', 'Moves like a mountain.': 'Se mueve como una montaña.', 'Hits like one, too.': 'Y golpea como una.',
    'Mountain Palm': 'Palma de Montaña', 'A push of force that travels and shoves enemies back. Standing still gathers Stillness: each point makes your next skill 12% stronger, up to four.': 'Un empujón de fuerza que avanza y hace retroceder a los enemigos. Quedarte quieto acumula Quietud: cada punto hace tu siguiente habilidad un 12% más fuerte, hasta cuatro.',
    'Mudslick': 'Barro Resbaladizo', 'Spill mud ahead of you for four seconds. Enemies in it trip and slow down.': 'Derramas barro delante de ti durante cuatro segundos. Los enemigos que lo pisan tropiezan y se frenan.',
    'Old Shell': 'Viejo Caparazón', 'Call down a giant stone tortoise on the spot ahead. Smashes cracked walls.': 'Haces caer una tortuga gigante de piedra justo delante. Rompe muros agrietados.',
    'Boulder Fall': 'Caída de Roca', 'A boulder the size of a house drops on the nearest enemy ahead.': 'Una roca del tamaño de una casa cae sobre el enemigo más cercano delante de ti.',
    'Deep Root': 'Raíz Profunda', 'Mountain Heart': 'Corazón de Montaña', 'Elder Mountain': 'Montaña Anciana'
  };
  const ZH = {
    'The Crowd of One': '一人成军', 'Clones': '分身', 'Crowd': '人海', 'Never fights alone.': '从不孤军奋战。', 'Not even when he is alone.': '哪怕只有他一个人。',
    'Twin Rush': '双影突袭', 'A clone dashes ahead through everything in its way. Every U, S+U and I leaves a clone that fights beside you for three seconds.': '一个分身向前冲刺，穿过挡路的一切。每次使用U、S+U和I都会留下一个分身，在你身边战斗三秒。',
    'Swap Out': '替身换位', 'Leave a clone where you stand and reappear behind the nearest enemy with a kick. The clone goes up in smoke.': '在原地留下分身，自己出现在最近的敌人身后并踢出一脚。分身随即化作烟雾。',
    'Pile-On': '群起而攻', 'Four clones charge in one after another. The last one throws them into the air and smashes cracked walls.': '四个分身接连冲上。最后一个把敌人抛上空中，并能击碎裂墙。',
    'Wheel Toss': '旋轮抛掷', 'Two clones catch the nearest enemy, spin them, and throw them skyward.': '两个分身抓住最近的敌人，转圈之后把他抛向天空。',
    'Second Self': '第二个我', 'Many Hands': '千手', 'A Thousand Rooks': '千人鲁克',
    'The Thunder Hand': '雷霆之手', 'Static': '静电', 'Quiet, until the air starts to hum.': '一直很安静，直到空气开始嗡鸣。', 'Then it is already over.': '那时一切已经结束了。',
    'Spark Kunai': '电光苦无', 'A charged knife that shocks its target again a moment later. Skill hits build Static; at five, your next combo hit lets it all out. Hold W to aim up.': '带电的飞刀，片刻后会再次电击目标。技能命中会积攒静电；满五层时，下一次连招命中会全部释放。按住W向上瞄准。',
    'Flash Step': '闪步', 'Blink forward through enemies, cutting everything you pass.': '瞬移穿过敌人，斩开经过的一切。',
    'Thunder Pierce': '雷霆贯穿', 'Charge your hand for a breath, then lunge a long way with it. Smashes cracked walls.': '手中蓄力片刻，然后带着雷电长距离突刺。能击碎裂墙。',
    'Storm Call': '唤雷', 'Three bolts come down on the nearest enemy ahead. The last one holds them in place.': '三道雷落在前方最近的敌人身上。最后一道会将其定住。',
    'Storm Hum': '风暴低鸣', 'Thunder Heart': '雷之心', 'Thunderhead': '雷暴云',
    'The Walking Desert': '行走的沙漠', 'Sand': '沙', 'Sandskin': '沙肤', 'Slow to start, slower to stop.': '起步慢，停下更慢。', 'Nothing gets through all that sand.': '那么多沙，什么都穿不透。',
    'Sand Lance': '沙枪', 'A spear of sand bursts out of the ground ahead, under the nearest enemy if one is close. Every hit you take adds a layer of sand; four make your next skill 50% stronger.': '一支沙枪从前方地面刺出，附近有敌人时会刺在最近的敌人脚下。每受到一次攻击就多一层沙；满四层时，下一个技能威力提升50%。',
    'Dune Grip': '沙丘之握', 'A hand of sand rises under the nearest enemy, holds them still and squeezes.': '一只沙手从最近的敌人脚下升起，将其定住并挤压。',
    'Sinking Sands': '流沙', 'A mound of sand rolls forward, grinding whatever it covers, and bursts at the end. Smashes cracked walls.': '一堆沙向前滚动，碾磨所覆盖的一切，最后炸开。能击碎裂墙。',
    'Dune Sea': '沙海', 'A wall of sand rises behind you and rolls across the floor, carrying enemies with it.': '一道沙墙在你身后升起，滚过地面，把敌人一起卷走。',
    'Glass Storm': '琉璃风暴', 'Buried City': '沙埋之城',
    'The Long Shadow': '长影', 'Shadow': '暗影', 'Snare': '缚影', 'He would rather not fight at all.': '他其实宁愿不打。', 'He is very good at making it short.': '但他很擅长速战速决。',
    'Shade Dart': '影镖', 'Your shadow darts along the floor and pins the first enemy it touches. Every third skill hit holds the target in place.': '你的影子沿地面疾射，定住碰到的第一个敌人。每第三次技能命中都会将目标定在原地。',
    'Sink Step': '沉影步', 'Sink into your shadow and come up behind the nearest enemy with an elbow that lifts them.': '沉入自己的影子，从最近的敌人身后冒出，一记肘击将其挑起。',
    'Shadow Snare': '影缚', 'Shadows spread out on both sides of you, hold everyone they reach and squeeze four times.': '暗影向你两侧蔓延，缠住触及的所有人并挤压四次。',
    'Night Spikes': '夜棘', 'Three spikes of shadow burst out of the ground around the nearest enemy.': '三根暗影尖刺从最近的敌人周围的地面刺出。',
    'Long Dusk': '长暮', 'Night Mind': '夜之心', 'Long Night': '长夜',
    'The Stringmaster': '提线师', 'Puppets': '傀儡', 'Marionette': '提线傀儡', 'He stands at the back and smiles.': '他站在后面微笑。', 'The thing in front of him does not.': '他面前那个东西可不会。',
    'Puppet Lunge': '傀儡突刺', 'Your puppet shoots forward on its strings, cutting everything on the way, and comes back. Left alone, it stabs at enemies in front of you.': '傀儡顺着丝线向前飞出，斩开沿途的一切再飞回来。无人操控时，它会自己刺向你面前的敌人。',
    'Venom Mist': '毒雾', 'The puppet breathes out a cloud of poison that burns whoever stands in it.': '傀儡吐出一团毒雾，灼伤站在里面的人。',
    'Iron Cradle': '铁摇篮', 'The puppet flies to the nearest enemy, opens, and shuts on them. Smashes cracked walls.': '傀儡飞到最近的敌人身边，张开再把他关进去。能击碎裂墙。',
    'Hundred Strings': '百丝', 'The puppet rises and fires a fan of twelve needles at the nearest enemy.': '傀儡升起，向最近的敌人扇形射出十二根针。',
    'Taut Strings': '紧绷之丝', 'Grand Strings': '大丝阵', 'Grand Theatre': '大剧场',
    'The Mountain Sage': '山之贤者', 'Stone': '岩石', 'Moves like a mountain.': '动如大山。', 'Hits like one, too.': '打起人来也是。',
    'Mountain Palm': '山岳掌', 'A push of force that travels and shoves enemies back. Standing still gathers Stillness: each point makes your next skill 12% stronger, up to four.': '一股向前推进的力量，把敌人推开。静止不动会积攒静心：每一点让下一个技能威力提升12%，最多四点。',
    'Mudslick': '泥沼', 'Spill mud ahead of you for four seconds. Enemies in it trip and slow down.': '在前方铺下泥浆，持续四秒。踩进去的敌人会摔倒并减速。',
    'Old Shell': '古龟', 'Call down a giant stone tortoise on the spot ahead. Smashes cracked walls.': '召唤一只巨大的石龟砸在前方。能击碎裂墙。',
    'Boulder Fall': '巨石坠', 'A boulder the size of a house drops on the nearest enemy ahead.': '一块房子大小的巨石砸在前方最近的敌人身上。',
    'Deep Root': '深根', 'Mountain Heart': '山之心', 'Elder Mountain': '远古山灵'
  };
  const ULTS = {
    thousand_crowd: ['oleada tras oleada de clones arrolla a todos en pantalla, y luego se le echan todos encima.', '一波又一波的分身冲过屏幕上的所有人，然后一起扑上去。'],
    thunderhead: ['el cielo se cierra sobre la arena y golpea a todos una y otra vez, y luego todo a la vez.', '天空在竞技场上方合拢，一次又一次地劈向所有人，最后同时落下。'],
    buried_city: ['la arena cubre toda la arena de combate y atrapa a todos; luego cae todo su peso.', '黄沙淹没整个竞技场，困住所有人，然后全部重量一齐压下。'],
    long_night: ['se apagan las luces. Manos de sombra surgen bajo todos y se cierran.', '灯光熄灭。暗影之手从每个人脚下升起，然后合拢。'],
    grand_theatre: ['caen marionetas con hilos por todo el escenario, cortan a todos y se cierran juntas.', '傀儡顺着丝线落满整个舞台，斩向所有人，然后一起合围。'],
    elder_mountain: ['un guardián de piedra más alto que la arena se alza detrás de él y pisa tres veces.', '一尊比竞技场还高的石之守护者在他身后升起，踏地三次。']
  };
  Object.keys(ULTS).forEach(id => { const en = D.abilities[id].desc.replace(/^Ultimate: /, '').replace(/ Costs all three bars, or one while awakened\.$/, ''); Object.assign(ES, N.ultText('es', en, ULTS[id][0])); Object.assign(ZH, N.ultText('zh', en, ULTS[id][1])); });
  N.tr('es', ES); N.tr('zh', ZH);
  void A;
})();
