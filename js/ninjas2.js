'use strict';
// Shattered Worlds — Hidden Clans, second six (Versus only; see ninja-core.js). All original characters.
//   Kestra  fire and a war fan: her skills hit burning enemies 30% harder.
//   Ivo     bare hands: every combo hit he lands takes a sixth of a second off his skill cooldowns.
//   Nami    water and a heavy blade: her skill hits steal energy from the opponent.
//   Lin     pressure points: every fifth hit she lands seals the opponent's skills for two seconds.
//   Corvin  crows: once every ten seconds a hit that would land meets a crow instead, and he reappears a few steps away.
//   Thorne  bone: whoever lands a combo hit on him cuts themselves on him.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja, V = SW.versus;
  if (!N) return;
  const CASTS = SW.casts, Proj = SW.Proj, boom = SW.boom, rand = SW.rand, P = SW.Player.prototype;
  const { hit, hurt, part, front, slide, ahead, nearest, every, floorY, fighterOf, pose, Later, Vis, Drive, pillar, smoke, sfx, ULT, TRAITS, pips, RIG, BORROW } = N;
  const NEW = ['kestra', 'ivo', 'nami', 'lin', 'corvin', 'thorne'];

  // ================= heroes =================
  N.hero('kestra', { name: 'Kestra', alias: 'Cinder', title: 'The Ember Fan', energy: 'Ember', color: '#ff6b35', colorHi: '#ffe0c8', element: 'Fire fan', sig: 'Kindling', combo: 'swift', route: 'kael', modeKind: 'speed', pitch: 620,
    trait: 'kindling', blurb: 'Fire first.\nThen the fan, to make it worse.', kit: ['ember_breath', 'fan_gust', 'fire_wheel', 'magnet_grip', 'high_flame', 'phoenix_form', 'sunfall'] });
  N.hero('ivo', { name: 'Ivo', alias: 'Bellows', title: 'The Iron Pulse', energy: 'Pulse', color: '#ffb703', colorHi: '#fff3c4', element: 'Martial arts', sig: 'Tempo', combo: 'fist', route: 'kael', modeKind: 'speed', pitch: 420,
    trait: 'tempo', blurb: 'Trains every morning before dawn.\nIt shows.', kit: ['whirl_heel', 'sky_kick', 'fist_storm', 'magnet_grip', 'second_pulse', 'red_pulse', 'seventh_breath'] });
  N.hero('nami', { name: 'Nami', alias: 'Brine', title: 'The Drowned Blade', energy: 'Tide', color: '#0077b6', colorHi: '#caf0f8', element: 'Water blade', sig: 'Riptide', combo: 'great', route: 'nyra', pitch: 300,
    trait: 'riptide', blurb: 'The sea took her once.\nShe came back with its patience.', kit: ['water_bullet', 'mist_veil', 'riptide_eel', 'frost_steps', 'flood_stance', 'deep_blue', 'abyss_tide'] });
  N.hero('lin', { name: 'Lin', alias: 'Petal', title: 'The Open Palm', energy: 'Breath', color: '#5ec8d8', colorHi: '#e8feff', element: 'Pressure points', sig: 'Seal', combo: 'fist', route: 'nyra', modeKind: 'speed', pitch: 680,
    trait: 'seal', blurb: 'She does not hit hard.\nShe hits exactly.', kit: ['air_palm', 'turning_wall', 'palm_rain', 'frost_steps', 'clear_eyes', 'still_point', 'hundred_palms'] });
  N.hero('corvin', { name: 'Corvin', alias: 'Ash', title: 'The Crow Eye', energy: 'Omen', color: '#7209b7', colorHi: '#e0c3fc', element: 'Crows', sig: 'Mirage', combo: 'dagger', route: 'kael', modeKind: 'speed', pitch: 330,
    trait: 'mirage', blurb: 'You hit him.\nYou hit a crow.', kit: ['crow_volley', 'scatter', 'black_flame', 'magnet_grip', 'omen', 'dark_wings', 'crow_eclipse'] });
  N.hero('thorne', { name: 'Thorne', alias: 'Marrow', title: 'The Bone Garden', energy: 'Marrow', color: '#c9c6a0', colorHi: '#ffffff', element: 'Bone', sig: 'Thorns', combo: 'blade', route: 'nyra', pitch: 280,
    trait: 'thorns', blurb: 'Everything he needs,\nhe already carries inside.', kit: ['finger_shards', 'spine_whip', 'bone_grove', 'frost_steps', 'hard_marrow', 'ivory_form', 'ossuary'] });

  N.abilities('kestra', {
    ember_breath:   { name: 'Ember Breath', input: 'U', cost: 25, dmg: 6, desc: 'Breathe three small fireballs in a spread. They set enemies alight, and your skills hit burning enemies 30% harder.' },
    fan_gust:       { name: 'Fan Gust', input: 'S + U', cost: 50, dmg: 10, desc: 'One sweep of the fan blows enemies back and fans any fire on them.' },
    fire_wheel:     { name: 'Fire Wheel', input: 'I', cost: 50, dmg: 7, desc: 'A wheel of flame rolls slowly forward, burning everything it passes. Smashes cracked walls.' },
    sunfall:        { name: 'Sunfall', dmg: 11, desc: 'a second sun gathers over the arena, rains fire on everyone, then falls.' }
  }, 'High Flame', 'Phoenix Form');
  N.abilities('ivo', {
    whirl_heel:     { name: 'Whirl Heel', input: 'U', cost: 25, dmg: 11, desc: 'A spinning kick that carries you forward and hits twice. Every combo hit you land takes a sixth of a second off your skill cooldowns.' },
    sky_kick:       { name: 'Sky Kick', input: 'S + U', cost: 50, dmg: 15, desc: 'Kick the enemy into the air and jump up after them.' },
    fist_storm:     { name: 'Fist Storm', input: 'I', cost: 50, dmg: 4, desc: 'Twelve punches in two seconds, walking forward. The last one knocks them down and smashes cracked walls.' },
    seventh_breath: { name: 'Seventh Breath', dmg: 11, desc: 'he moves faster than the eye, hits everyone from every side, and finishes with one blow.' }
  }, 'Second Pulse', 'Red Pulse');
  N.abilities('nami', {
    water_bullet:   { name: 'Water Bullet', input: 'U', cost: 25, dmg: 12, desc: 'A heavy ball of water that knocks enemies back. Your skill hits steal energy from the enemy.' },
    mist_veil:      { name: 'Mist Veil', input: 'S + U', cost: 50, dmg: 14, desc: 'Vanish in a mist for a moment, where nothing can hit you, then cut whoever is closest.' },
    riptide_eel:    { name: 'Riptide Eel', input: 'I', cost: 50, dmg: 9, desc: 'A water eel swims forward, turning toward enemies, and bites three times.' },
    abyss_tide:     { name: 'Abyss Tide', dmg: 11, desc: 'the arena floods. Eels tear through everyone, then the whole tide comes down.' }
  }, 'Flood Stance', 'Deep Blue');
  N.abilities('lin', {
    air_palm:       { name: 'Air Palm', input: 'U', cost: 20, dmg: 10, desc: 'A burst of air from your palm. Every fifth hit you land seals a pressure point: the enemy cannot use skills for two seconds.' },
    turning_wall:   { name: 'Turning Wall', input: 'S + U', cost: 50, dmg: 8, desc: 'Spin in place: nothing can touch you, enemies around you are thrown off, and their shots break.' },
    palm_rain:      { name: 'Palm Rain', input: 'I', cost: 50, dmg: 3, desc: 'Sixteen palm strikes in a blur. The last one throws them into the air.' },
    hundred_palms:  { name: 'Hundred Palms', dmg: 9, desc: 'a hundred palms open around her and close on everyone at once.' }
  }, 'Clear Eyes', 'Still Point');
  N.abilities('corvin', {
    crow_volley:    { name: 'Crow Volley', input: 'U', cost: 25, dmg: 5, desc: 'Three crows fly out and hunt the nearest enemy. Once every ten seconds, a hit that would land on you meets a crow instead, and you reappear a few steps away.' },
    scatter:        { name: 'Scatter', input: 'S + U', cost: 50, dmg: 10, desc: 'Burst into crows that peck everything around you, and come back together further away.' },
    black_flame:    { name: 'Black Flame', input: 'I', cost: 50, dmg: 6, desc: 'Black fire catches on the nearest enemy ahead and keeps burning for a while.' },
    crow_eclipse:   { name: 'Crow Eclipse', dmg: 10, desc: 'the sky turns red and a storm of crows goes through everyone, again and again.' }
  }, 'Omen', 'Dark Wings');
  N.abilities('thorne', {
    finger_shards:  { name: 'Finger Shards', input: 'U', cost: 20, dmg: 7, desc: 'Fire three shards of bone in a quick line. Anyone who hits you with a combo cuts themselves on you.' },
    spine_whip:     { name: 'Spine Whip', input: 'S + U', cost: 50, dmg: 12, desc: 'Lash out with a long whip of bone that hits on the way out and drags them in on the way back.' },
    bone_grove:     { name: 'Bone Grove', input: 'I', cost: 50, dmg: 9, desc: 'A line of bone spikes bursts out of the floor ahead, one after another. Smashes cracked walls.' },
    ossuary:        { name: 'Ossuary', dmg: 10, desc: 'bone bursts up from the whole floor, again and again, and a cage of ribs closes on everyone.' }
  }, 'Hard Marrow', 'Ivory Form');

  // ================= Kestra =================
  const EMB = ['#ff6b35', '#ffe0c8', '#ffd24a'];
  const fireball = (ctx, x, y, r) => { art.disc(ctx, EMB[0], x, y, r); art.disc(ctx, EMB[2], x, y, Math.max(1, r - 2)); art.disc(ctx, '#ffffff', x, y, Math.max(1, r - 4)); art.glow(ctx, x, y, r * 3, EMB[0], 0.14); };
  Object.assign(CASTS, {
    ember_breath(p, z, dmg, up) {
      sfx('shoot'); pose(p, 'a2', 1, 10);
      [-0.22, 0, 0.22].forEach(a => { const ang = (up ? -0.55 : 0) + a; z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 22, vx: p.face * Math.cos(ang) * 6.5, vy: Math.sin(ang) * 6.5, dmg, w: 10, h: 10, life: 34, kx: 1, stun: 18, status: { burn: 2 },
        render(ctx, x, y) { fireball(ctx, x, y, 4); }, think() { if (this.t % 2 === 0) part(this.x - this.vx, this.y, this.t % 4 ? EMB[0] : EMB[2], 0, -0.4, 10, 2); } })); });
    },
    fan_gust(p, z, dmg) {
      const dir = p.face; sfx('dash'); pose(p, 'a4', 1, 14);
      for (let i = 0; i < 22; i++) part(p.x + dir * rand(10, 30), p.y - rand(4, 40), i % 3 ? '#fff4e0' : EMB[0], dir * rand(4, 8), rand(-0.6, 0.6), 18, 2);
      fx.slash(p.x + dir * 18, p.y - 22, dir, 3, EMB[1], 54);
      hit(...front(p, 84, 52, 6), dmg, { kx: dir * 7, ky: -2.5, stun: 30, heavy: true, srcX: p.x - dir * 10 });
    },
    fire_wheel(p, z, dmg) {
      const dir = p.face; sfx('burst'); fx.ring(p.x + dir * 20, p.y - 24, EMB[0], 4, 24, 12);
      z.shots.push(new Proj({ x: p.x + dir * 24, y: p.y - 26, vx: dir * 2.6, dmg, w: 30, h: 52, life: 92, ghost: true, pierce: true, rehit: 10, kx: 1.2, ky: -2.5, stun: 24, status: { burn: 3 }, breaker: true,
        render(ctx, x, y, pr) { for (let i = 0; i < 10; i++) { const a = pr.t * 0.35 + i * Math.PI / 5, r = 18 + (i % 2) * 4; fireball(ctx, x + Math.round(Math.cos(a) * r * 0.6), y + Math.round(Math.sin(a) * r), 3 + (i % 2)); } art.glow(ctx, x, y, 26, EMB[0], 0.1); },
        think() { if (this.t % 2 === 0) part(this.x + rand(-10, 10), this.y + 24, EMB[0], rand(-0.5, 0.5), -rand(0.5, 1.5), 14, 2); } }));
    }
  });
  N.burst('kestra', 'phoenix_dive', 'Phoenix Dive', 22, 'Leap up, then dive onto the nearest enemy wrapped in fire and explode.', (p, z, dmg) => {
    const e = nearest(z, p.x, p.y - 16, 260), hs = new Set(); let dove = false; sfx('jump'); p.vy = -7.5; p.onGround = false; p.y -= 1; p.pose = ['jump', 0];
    z.shots.push(new Drive(p, 46, t => {
      p.iframes = Math.max(p.iframes, 2); part(p.x + rand(-6, 6), p.y - rand(4, 28), t % 2 ? EMB[0] : EMB[2], 0, 0.5, 14, 3);
      if (t < 12) { p.vx = 0; p.vy = Math.min(p.vy + 0.6, -0.5); return; }
      if (!dove) { dove = true; sfx('dash'); if (e && !e.dead) p.face = e.x >= p.x ? 1 : -1; }
      p.pose = ['air', 1]; const tx = e && !e.dead ? e.x : p.x + p.face * 60;
      p.vx = SW.clamp((tx - p.x) * 0.25, -6, 6); p.vy = 8;
      slide(p, z, Math.sign(p.vx) || p.face, Math.abs(Math.round(p.vx)));
      hit(p.x - 16, p.y - 36, 32, 38, Math.round(dmg * 0.4), { ky: 2, stun: 24, hitSet: hs, srcX: p.x, status: { burn: 3 } });
      if (t % 2) fx.ghost(p.sheet(), 'air', 1, p.x, p.y, p.face < 0);
      if (p.onGround && t > 13) return false;
    }, () => { boom(p.x, p.y - 12, 46, dmg, EMB[0], { burn: 4 }, { ky: -6, stun: 40 }); fx.dust(p.x, p.y, 10); }));
  });
  ULT.sunfall = (p, z, foes, dmg) => {
    const sx = G.cam.x + W / 2, sy = G.cam.y + 40;
    if (p.st === 6) { fx.flash(EMB[2], 8); sfx('roar'); z.shots.push(new Vis(sx, sy, 66, (ctx, x, y, t) => { const r = Math.round(Math.min(24, t * 1.2)), yy = t > 56 ? y + (t - 56) * 18 : y; fireball(ctx, x, yy, r); art.glow(ctx, x, yy, r * 3, EMB[2], 0.12); })); }
    if (every(p, 18, 50, 4)) { const e = foes.length ? foes[(p.st >> 2) % foes.length] : null, tx = e ? e.box().x + rand(-30, 30) : G.cam.x + rand(20, W - 20); z.shots.push(new Vis(sx, sy, 10, (ctx, x, y, t) => fireball(ctx, Math.round(x + (tx - sx) * t / 10), Math.round(y + (p.y - 10 - sy) * t / 10), 4))); }
    if (every(p, 20, 52, 8)) { sfx('burst'); foes.forEach(e => hurt(e, dmg, { ky: -2, stun: 30, status: { burn: 3 } })); }
    if (p.st === 64) { fx.flash('#ffffff', 10); fx.shake(12, 20); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.ring(b.x + b.w / 2, b.y + b.h / 2, EMB[0], 4, 60, 16); hurt(e, dmg * 5, { ky: -7, down: true, stun: 50, status: { burn: 5 } }); }); }
  };
  const burning = e => { const f = fighterOf(e); return f ? f.burnT > 0 : (e.burnT || 0) > 0; };
  TRAITS.kindling = {
    hit(p, atk, e) {
      if (!atk.energy || p.kindling || !e || e.dead || !burning(e) || SW.frame - (p.kinAt || 0) < 4) return;
      p.kinAt = SW.frame; p.kindling = true;
      try { const b = e.box(); for (let i = 0; i < 5; i++) part(b.x + rand(0, b.w), b.y + rand(0, b.h), EMB[i % 3], 0, -1.5, 14, 2); hurt(e, Math.max(1, Math.round((atk.dealt || atk.dmg) * 0.3)), { ky: 0, kx: 0, stun: 10, heavy: false }); } finally { p.kindling = false; }
    }
  };

  // ================= Ivo =================
  const GOLD = ['#ffb703', '#fff3c4', '#fb8500'];
  Object.assign(CASTS, {
    whirl_heel(p, z, dmg) {
      const dir = p.face, hs = new Set(); sfx('swing');
      z.shots.push(new Drive(p, 14, t => {
        p.vx = 0; slide(p, z, dir, 4); p.pose = [t % 6 < 3 ? 'a3' : 'sweep', 1];
        if (t === 3 || t === 9) { hs.clear(); sfx('swing'); fx.slash(p.x + dir * 14, p.y - 18, t === 3 ? dir : -dir, 2, GOLD[1], 40); }
        hit(...front(p, 40, 44, 14), dmg, { kx: dir * 2, ky: t > 8 ? -4 : -1.5, stun: 28, hitSet: hs, srcX: p.x });
      }));
    },
    sky_kick(p, z, dmg) {
      sfx('swing'); fx.slash(p.x + p.face * 12, p.y - 28, p.face, 2, GOLD[1], 48);
      hit(...front(p, 54, 64, 6), dmg, { kx: p.face * 0.5, ky: -9.5, stun: 50, launch: true, heavy: true, srcX: p.x });
      z.shots.push(new Later(4, () => { if (p.dead) return; p.vy = -9; p.onGround = false; p.y -= 1; fx.dust(p.x, p.y, 6); }));
      pose(p, 'launcher', 1, 12);
    },
    fist_storm(p, z, dmg) {
      const dir = p.face, hs = new Set(); p.pose = ['a1', 1]; sfx('roar');
      z.shots.push(new Drive(p, 36, t => {
        p.vx = 0; if (t % 2) slide(p, z, dir, 1); p.pose = [t % 6 < 3 ? 'a1' : 'a2', 1];
        if (t % 3 === 1) { hs.clear(); sfx('swing'); fx.slash(p.x + dir * 18, p.y - 26 + (t % 9) * 2, dir, 1, GOLD[t % 2], 22); }
        hit(...front(p, 44, 44, 4), dmg, { kx: dir * 0.4, ky: -0.5, stun: 16, hitSet: hs, srcX: p.x });
      }, () => { sfx('heavy'); fx.shake(5, 10); fx.slash(p.x + dir * 18, p.y - 22, dir, 3, '#ffffff', 52); hit(...front(p, 54, 50, 6), dmg * 3, { kx: dir * 6.5, ky: -4, stun: 36, heavy: true, down: true, breaker: true, srcX: p.x }); }));
    }
  });
  N.burst('ivo', 'meteor_heel', 'Meteor Heel', 20, 'Leap high and bring your heel down. The landing sends a shockwave both ways.', (p, z, dmg) => {
    const e = nearest(z, p.x, p.y - 16, 200), hs = new Set(); sfx('jump'); p.vy = -9.5; p.onGround = false; p.y -= 1; p.pose = ['jump', 0];
    z.shots.push(new Drive(p, 50, t => {
      p.iframes = Math.max(p.iframes, 2);
      if (t < 10) { p.vx = e && !e.dead ? SW.clamp((e.x - p.x) * 0.08, -3, 3) : p.face * 1.5; p.vy += 0.5; slide(p, z, Math.sign(p.vx) || 1, Math.abs(Math.round(p.vx))); return; }
      p.pose = ['air', 1]; p.vx = 0; p.vy = 11;
      hit(p.x - 16, p.y - 40, 32, 42, Math.round(dmg * 0.5), { ky: 4, stun: 28, hitSet: hs, srcX: p.x });
      if (t % 2) fx.ghost(p.sheet(), 'air', 1, p.x, p.y, p.face < 0);
      if (p.onGround && t > 10) return false;
    }, () => {
      sfx('explode'); fx.shake(8, 14); fx.dust(p.x, p.y, 14); fx.ring(p.x, p.y - 4, GOLD[0], 6, 60, 14);
      hit(p.x - 60, p.y - 30, 120, 32, dmg, { ky: -6, stun: 40, heavy: true, launch: true, srcX: p.x });
    }));
  });
  ULT.seventh_breath = (p, z, foes, dmg, h) => {
    if (p.st === 6) { fx.flash(GOLD[2], 10); sfx('roar'); fx.ring(p.x, p.y - 18, GOLD[0], 6, 70, 18); }
    if (p.st > 6 && p.st < 60 && p.st % 2 === 0) part(p.x + rand(-10, 10), p.y - rand(0, 34), p.st % 4 ? GOLD[2] : '#ff3a2a', 0, -2, 12, 3);
    if (every(p, 12, 52, 5)) {
      sfx('heavy'); const k = (p.st - 12) / 5;
      foes.forEach(e => { const b = e.box(), cx = b.x + b.w / 2, side = k % 2 ? 1 : -1; fx.ghost(p.sheet(), k % 3 ? 'a3' : 'a2', 1, cx + side * 20, b.y + b.h, side > 0); fx.slash(cx, b.y + b.h / 2 - 6 + (k % 3) * 6, -side, 1 + (k % 3), h.colorHi, 34); hurt(e, dmg, { kx: -side * 1, ky: -1.5, stun: 30 }); });
    }
    if (p.st === 60) { fx.flash('#ffffff', 10); fx.shake(12, 18); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.slash(b.x + b.w / 2, b.y + b.h / 2, p.face, 3, '#ffffff', 70); hurt(e, dmg * 5, { kx: p.face * 7, ky: -5, down: true, stun: 50 }); }); }
  };
  TRAITS.tempo = { hit(p, atk) { if (atk.energy || !p.cd) return; for (const k in p.cd) if (p.cd[k] > 0) p.cd[k] = Math.max(0, p.cd[k] - 10); } };

  // ================= Nami =================
  const SEA = ['#0077b6', '#caf0f8', '#03045e'];
  const R = {
    orb(ctx, x, y, pr) { art.disc(ctx, SEA[0], x, y, 7); art.disc(ctx, '#48cae4', x - 1, y - 1, 5); art.rect(ctx, '#ffffff', x - 3, y - 4, 3, 2); art.glow(ctx, x, y, 16, SEA[0], 0.14); if (pr.t % 2) art.rect(ctx, SEA[1], x - Math.sign(pr.vx) * 9, y + rand(-3, 3), 2, 2); },
    eel(ctx, x, y, pr) { const d = Math.sign(pr.vx) || 1; for (let i = 0; i < 9; i++) art.rect(ctx, i % 3 ? SEA[0] : '#48cae4', x - d * i * 4 - 2, y + Math.round(Math.sin(pr.t * 0.5 - i * 0.7) * 3) - 2, 5, 4); art.rect(ctx, '#48cae4', x + d * 2 - 3, y - 3, 7, 6); art.rect(ctx, '#ffffff', x + d * 4 - 1, y - 2, 2, 1); if ((pr.t >> 2) % 2) art.rect(ctx, '#ffffff', x + d * 5 - 1, y + 1, 3, 1); }
  };
  Object.assign(CASTS, {
    water_bullet(p, z, dmg, up) {
      sfx('burst');
      z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 22, vx: p.face * 6.2, vy: up ? -3.4 : 0, dmg, w: 14, h: 14, life: 44, kx: 4.5, ky: -2, stun: 28, heavy: true, render: R.orb,
        onEnd(g, zz) { for (let i = 0; i < 10; i++) part(this.x, this.y, i % 2 ? SEA[1] : '#48cae4', rand(-2.5, 2.5), rand(-3, 0), 18, 2, 0.15); } }));
    },
    mist_veil(p, z, dmg) {
      const x0 = p.x, y0 = p.y; sfx('dash'); p.iframes = Math.max(p.iframes, 40);
      z.shots.push(new Vis(x0, y0, 44, (ctx, x, y, t) => { const a = Math.min(1, t / 6, (44 - t) / 10); ctx.globalAlpha = 0.45 * a; for (let i = 0; i < 7; i++) art.disc(ctx, i % 2 ? '#dfeef5' : '#a8c8d8', x + Math.round(Math.sin(t * 0.06 + i * 0.9) * 26), y - 12 - (i % 3) * 8, 10 + (i % 3) * 3); ctx.globalAlpha = 1; },
        v => { if (v.t % 3 === 0) part(v.x + rand(-30, 30), v.y - rand(0, 34), '#dfeef5', rand(-0.4, 0.4), -0.3, 20, 3); }));
      z.shots.push(new Later(34, (g, zz) => {
        if (p.dead) return; const e = nearest(zz, p.x, p.y - 16, 110);
        if (e) { p.face = e.x >= p.x ? 1 : -1; const tx = e.x - p.face * 22; if (!zz.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) p.x = tx; }
        sfx('heavy'); fx.slash(p.x + p.face * 16, p.y - 22, p.face, 3, SEA[1], 56); hit(...front(p, 56, 50, 8), dmg, { kx: p.face * 4, ky: -4, stun: 36, heavy: true, srcX: p.x - p.face * 10 });
      }));
    },
    riptide_eel(p, z, dmg) {
      const dir = p.face; sfx('burst'); fx.ring(p.x + dir * 16, p.y - 20, SEA[0], 4, 20, 10);
      z.shots.push(new Proj({ x: p.x + dir * 16, y: p.y - 18, vx: dir * 4.8, dmg, w: 26, h: 16, life: 70, ghost: true, pierce: true, maxHits: 3, rehit: 12, kx: 2, ky: -2, stun: 26, render: R.eel,
        think(g, zz) { const e = nearest(zz, this.x, this.y, 160); if (e) { const ty = e.y - e.h / 2; this.vy += SW.clamp((ty - this.y) * 0.02, -0.4, 0.4); this.vy *= 0.92; if ((e.x - this.x) * Math.sign(this.vx) < -10 && this.t > 10) this.vx = -this.vx * 0.9; } if (this.t % 3 === 0) part(this.x, this.y, SEA[1], 0, 0.3, 12, 2); } }));
    }
  });
  N.burst('nami', 'bubble_jail', 'Bubble Jail', 7, 'Trap the nearest enemy in a ball of water. It holds them, hurts them, and bursts.', (p, z, dmg) => {
    const e = ahead(p, z, 170) || nearest(z, p.x, p.y - 16, 120), x0 = e ? e.x : p.x + p.face * 70, y0 = (e ? e.y : p.y) - 18; sfx('burst'); pose(p, 'cast', 1, 16);
    const hs = () => new Set();
    z.shots.push(new Vis(x0, y0, 60, (ctx, x, y, t) => { const r = Math.round(Math.min(22, t * 3)); ctx.globalAlpha = 0.45; art.disc(ctx, '#48cae4', x, y, r); ctx.globalAlpha = 0.8; art.disc(ctx, SEA[1], x - Math.round(r / 2), y - Math.round(r / 2), 3); ctx.globalAlpha = 1; art.glow(ctx, x, y, r + 8, SEA[0], 0.12); },
      v => {
        if (e && !e.dead) { v.x = e.x; v.y = e.y - 18; }
        if (v.t === 6 || v.t === 18 || v.t === 30 || v.t === 42) { sfx('burst'); hit(v.x - 20, v.y - 22, 40, 44, dmg, { ky: 0, kx: 0, stun: 30, status: { freeze: 26 }, hitSet: hs(), srcX: v.x }); }
        if (v.t === 56) { sfx('explode'); for (let i = 0; i < 16; i++) part(v.x, v.y, i % 2 ? SEA[1] : '#48cae4', rand(-3, 3), rand(-3.5, 0.5), 22, 2, 0.15); hit(v.x - 24, v.y - 26, 48, 52, dmg * 3, { ky: -6, stun: 40, heavy: true, srcX: v.x }); }
      }));
  });
  ULT.abyss_tide = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(SEA[1], 8); sfx('burst'); z.shots.push(new Vis(0, 0, 66, (ctx, x, y, t) => { const h = Math.round(Math.min(70, t * 4) * (t > 58 ? (66 - t) / 8 : 1)); ctx.globalAlpha = 0.45; art.rect(ctx, SEA[0], 0, SW.H - 34 - h, W, h + 34); ctx.globalAlpha = 0.8; for (let i = 0; i < W; i += 8) art.rect(ctx, SEA[1], i, SW.H - 34 - h + Math.round(Math.sin(t * 0.3 + i * 0.1) * 2), 5, 1); ctx.globalAlpha = 1; })); }
    if (every(p, 14, 54, 8)) {
      sfx('burst');
      foes.forEach(e => { const b = e.box(), d = (p.st >> 3) % 2 ? 1 : -1, y = b.y + b.h / 2; z.shots.push(new Vis(b.x + b.w / 2 - d * 60, y, 14, (ctx, x, yy, t) => R.eel(ctx, x + d * t * 9, yy - Math.round(Math.sin(t / 14 * Math.PI) * 14), { vx: d, t }))); hurt(e, dmg, { kx: d, ky: -2, stun: 30 }); });
    }
    if (p.st === 62) { fx.flash(SEA[0], 8); fx.shake(12, 18); sfx('explode'); foes.forEach(e => { const b = e.box(); for (let i = 0; i < 14; i++) part(b.x + b.w / 2, b.y, i % 2 ? SEA[1] : '#48cae4', rand(-3, 3), rand(-4, 0), 24, 3, 0.15); hurt(e, dmg * 5, { ky: -6, down: true, stun: 50 }); }); }
  };
  TRAITS.riptide = {
    hit(p, atk, e) {
      if (!atk.energy) return;
      const f = fighterOf(e); if (!f || f.state.energy <= 0) return;
      const n = Math.min(6, f.state.energy); f.state.energy -= n;
      if (V.cur && V.cur.p === p) V.cur.bonus += n; else G.state.energy = Math.min(300, G.state.energy + n);   // Versus settles energy each frame: add it where it is counted
      const b = e.box(); for (let i = 0; i < 3; i++) part(b.x + b.w / 2, b.y + b.h / 2, SEA[1], (p.x - e.x) * 0.04, -0.4, 18, 2);
    }
  };

  // ================= Lin =================
  const PAL = ['#5ec8d8', '#e8feff', '#ffffff'];
  const palm = (ctx, x, y, s, col) => { art.rect(ctx, col, x - 2 * s, y - 3 * s, 4 * s, 5 * s); for (let i = 0; i < 4; i++) art.rect(ctx, col, x - 2 * s + i * s, y - 5 * s, Math.max(1, s - 1) || 1, 2 * s); art.rect(ctx, col, x + 2 * s, y - 2 * s, s, 2 * s); };
  Object.assign(CASTS, {
    air_palm(p, z, dmg, up) {
      sfx('swing'); pose(p, 'a2', 1, 10); fx.ring(p.x + p.face * 14, p.y - 22, PAL[1], 3, 14, 8);
      z.shots.push(new Proj({ x: p.x + p.face * 16, y: p.y - 22, vx: p.face * 8, vy: up ? -4 : 0, dmg, w: 20, h: 24, life: 15, ghost: true, pierce: true, maxHits: 2, kx: 4, ky: -1.5, stun: 26,
        render(ctx, x, y, pr) { const d = Math.sign(pr.vx) || 1; ctx.globalAlpha = Math.min(1, pr.life / 6); for (let j = -9; j <= 9; j += 3) art.rect(ctx, PAL[(j / 3 + pr.t) & 1], x + d * Math.round(Math.sqrt(Math.max(0, 81 - j * j)) / 2), y + j, 2, 2); ctx.globalAlpha = 1; } }));
    },
    turning_wall(p, z, dmg) {
      p.iframes = Math.max(p.iframes, 22); sfx('dash'); const hs = new Set();
      z.shots.push(new Drive(p, 20, t => {
        p.vx = 0; p.pose = [t % 4 < 2 ? 'guard' : 'cheer', 0];
        if (t % 4 === 0) fx.ring(p.x, p.y - 18, t % 8 ? PAL[0] : PAL[1], 52, 34, 8);
        hit(p.x - 52, p.y - 52, 104, 54, dmg, { kx: 0, ky: -3, stun: 30, hitSet: hs, srcX: p.x });
        hs.forEach(e => { if (!e.dead) e.vx = (Math.sign(e.x - p.x) || p.face) * 4.5; });
        const of = G.scene === 'vs' && V.f ? V.f.find(f => f.p && f.p !== p) : null;
        (of ? of.shots : z.shots.filter(s => s.team === 'enemy')).forEach(s => { if (s.dmg !== undefined && s.x !== undefined && !s.isPuppet && !s.isClone && Math.hypot(s.x - p.x, s.y - p.y + 18) < 54) { s.gone = true; fx.spark(s.x, s.y, PAL[1], 4, 1.5); } });
      }));
    },
    palm_rain(p, z, dmg) {
      const dir = p.face, hs = new Set(); sfx('charge');
      z.shots.push(new Drive(p, 34, t => {
        p.vx = 0; p.pose = [t % 4 < 2 ? 'a1' : 'a2', 1];
        if (t % 2 === 0) { hs.clear(); if (t % 4 === 0) sfx('swing'); const k = (t / 2) % 4; z.shots.push(new Vis(p.x + dir * (22 + k * 4), p.y - 34 + k * 7, 6, (ctx, x, y, tt) => { ctx.globalAlpha = 1 - tt / 6; palm(ctx, x, y, 2, PAL[tt % 2]); ctx.globalAlpha = 1; })); }
        hit(...front(p, 48, 48, 4), dmg, { kx: dir * 0.3, ky: -0.5, stun: 14, hitSet: hs, srcX: p.x });
      }, () => { sfx('heavy'); fx.shake(5, 10); fx.ring(p.x + dir * 30, p.y - 22, PAL[1], 4, 30, 12); hit(...front(p, 52, 60, 6), dmg * 4, { kx: dir * 1, ky: -9, stun: 44, heavy: true, launch: true, srcX: p.x }); }));
    }
  });
  N.burst('lin', 'heart_strike', 'Heart Strike', 24, 'One perfect palm that sends the enemy across the arena and seals them at once.', (p, z, dmg) => {
    const dir = p.face; sfx('charge'); p.pose = ['charge', 0];
    z.shots.push(new Drive(p, 14, t => { p.vx = 0; p.pose = t < 9 ? ['charge', t % 2] : ['a2', 1]; if (t < 9) part(p.x + dir * 12 + rand(-6, 6), p.y - 22 + rand(-6, 6), PAL[t % 2], 0, 0, 8, 2); }, () => {
      sfx('explode'); fx.shake(8, 14); fx.flash(PAL[1], 4); fx.ring(p.x + dir * 24, p.y - 22, PAL[1], 4, 44, 14); z.shots.push(new Vis(p.x + dir * 26, p.y - 18, 12, (ctx, x, y, t) => { ctx.globalAlpha = 1 - t / 12; palm(ctx, x, y, 4, PAL[2]); ctx.globalAlpha = 1; }));
      const hs = new Set(); hit(...front(p, 50, 50, 4), dmg, { kx: dir * 9, ky: -4, stun: 44, heavy: true, breaker: true, down: true, hitSet: hs, srcX: p.x - dir * 10 });
      hs.forEach(seal);
    }));
  });
  ULT.hundred_palms = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(PAL[1], 8); sfx('perfect'); }
    if (p.st >= 8 && p.st <= 56 && p.st % 2 === 0) foes.forEach(e => { const b = e.box(), a = rand(0, Math.PI * 2), r = rand(20, 40); z.shots.push(new Vis(b.x + b.w / 2 + Math.cos(a) * r, b.y + b.h / 2 + Math.sin(a) * r, 8, (ctx, x, y, t) => { ctx.globalAlpha = 1 - t / 8; palm(ctx, x, y, 2, PAL[t % 2]); ctx.globalAlpha = 1; })); });
    if (every(p, 10, 54, 4)) { if (p.st % 8 === 2) sfx('swing'); foes.forEach(e => hurt(e, dmg, { ky: -0.5, kx: 0, stun: 26 })); }
    if (p.st === 62) { fx.flash('#ffffff', 10); fx.shake(10, 16); sfx('explode'); foes.forEach(e => { const b = e.box(); z.shots.push(new Vis(b.x + b.w / 2, b.y + b.h / 2, 16, (ctx, x, y, t) => { ctx.globalAlpha = 1 - t / 16; palm(ctx, x, y, 6, PAL[2]); ctx.globalAlpha = 1; })); hurt(e, dmg * 4, { ky: -7, down: true, stun: 50 }); seal(e); }); }
  };
  // the seal: the opponent's U, S+U, I, S+I and ultimate do nothing for two seconds (enemies in the story are just stunned)
  function seal(e) {
    if (!e || e.dead) return;
    const f = fighterOf(e), b = e.box();
    fx.ring(b.x + b.w / 2, b.y + b.h / 2, PAL[1], 30, 6, 12); fx.text(b.x + b.w / 2, b.y - 14, 'SEALED', PAL[1]); sfx('block');
    if (f) f.p.sealT = 120; else if (e.stagger && !e.isBoss) e.stagger(30);
  }
  ['useSkill', 'useSpecial'].forEach(k => { const f = P[k]; P[k] = function () { if (this.sealT > 0) { if (!(this.cdDeny > 0)) { sfx('deny'); this.cdDeny = 24; } return; } return f.apply(this, arguments); }; });
  const _pu = P.update; P.update = function (g, z) { if (this.sealT > 0) this.sealT--; return _pu.call(this, g, z); };
  const _pd = P.draw; P.draw = function (ctx, cam, g) { _pd.call(this, ctx, cam, g); if (this.sealT > 0 && !this.dead) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y) - 46; art.rect(ctx, '#05060c', x - 5, y - 1, 11, 9); art.rect(ctx, PAL[1], x - 4, y + 2, 9, 5); art.rect(ctx, PAL[1], x - 2, y - 2 + (this.sealT % 20 < 10 ? 0 : 1), 5, 1); art.rect(ctx, '#05060c', x, y + 3, 1, 2); } };
  TRAITS.seal = {
    hit(p, atk, e) { if (p.sealing) return; p.linN = (p.linN || 0) + 1; if (p.linN < 5) return; p.linN = 0; p.sealing = true; try { seal(e); } finally { p.sealing = false; } },
    mark(ctx, p, x, y) { if (p.linN) pips(ctx, x, y - 50, p.linN, 5, PAL[1]); }
  };

  // ================= Corvin =================
  const CRW = ['#7209b7', '#e0c3fc', '#14101c'];
  const crow = (ctx, x, y, d, t) => { const f = (t >> 2) % 2; art.rect(ctx, CRW[2], x - 4, y - 2, 8, 4); art.rect(ctx, CRW[2], x + d * 3, y - 4, 4, 4); art.rect(ctx, '#d8a020', x + d * 6 - (d < 0 ? 1 : 0), y - 3, 2, 1); art.rect(ctx, CRW[1], x + d * 4, y - 3, 1, 1); if (f) art.rect(ctx, CRW[2], x - 3, y - 7, 6, 4); else art.rect(ctx, CRW[2], x - 3, y + 2, 6, 3); art.rect(ctx, CRW[2], x - d * 7, y - 1, 3, 2); };
  const flock = (x, y, n) => { for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), s = rand(1.5, 4); G.zone.shots.push(new Vis(x, y, 22, (ctx, sx, sy, t) => crow(ctx, Math.round(sx + Math.cos(a) * s * t), Math.round(sy + Math.sin(a) * s * t - t * 0.5), Math.cos(a) >= 0 ? 1 : -1, t))); } };
  Object.assign(CASTS, {
    crow_volley(p, z, dmg) {
      sfx('swing'); pose(p, 'a4', 1, 10);
      for (let k = 0; k < 3; k++) z.shots.push(new Proj({ x: p.x + p.face * 10, y: p.y - 20 - k * 6, vx: p.face * 4.2, vy: (k - 1) * 1.6, dmg, w: 12, h: 10, life: 80, ghost: true, kx: 1, stun: 20, dir: p.face,
        render(ctx, x, y, pr) { crow(ctx, x, y, pr.vx >= 0 ? 1 : -1, pr.t); },
        think(g, zz) { const e = nearest(zz, this.x, this.y, 240); if (e && this.t > 6) { const ax = e.x - this.x, ay = e.y - e.h / 2 - this.y, m = Math.hypot(ax, ay) || 1; this.vx += (ax / m * 4.8 - this.vx) * 0.12; this.vy += (ay / m * 4.8 - this.vy) * 0.12; } } }));
    },
    scatter(p, z, dmg) {
      const dir = p.face; sfx('dash'); flock(p.x, p.y - 18, 10); p.iframes = Math.max(p.iframes, 18);
      hit(p.x - 46, p.y - 50, 92, 52, dmg, { ky: -3, stun: 30, srcX: p.x });
      let moved = 0; while (moved < 90 && slide(p, z, -dir, 3)) moved += 3;
      flock(p.x, p.y - 18, 6); fx.ring(p.x, p.y - 18, CRW[1], 24, 4, 10);
    },
    black_flame(p, z, dmg) {
      const e = ahead(p, z, 200), x0 = e ? e.x : p.x + p.face * 80, gy = floorY(z, x0, p.y - 20); sfx('burst'); pose(p, 'cast', 1, 16);
      z.shots.push(new Vis(x0, gy, 150, (ctx, x, y, t) => {
        const k = Math.min(1, t / 8, (150 - t) / 16);
        for (let i = 0; i < 8; i++) { const hh = Math.round((14 + Math.abs(Math.sin(t * 0.3 + i * 1.3)) * 22) * k); art.rect(ctx, i % 2 ? CRW[2] : '#2a0a3a', x - 16 + i * 4, y - hh, 4, hh); art.rect(ctx, CRW[0], x - 16 + i * 4 + 1, y - hh, 2, 2); }
        art.glow(ctx, x, y - 16, 22, CRW[0], 0.1 * k);
      }, v => { if (e && !e.dead && v.t < 60) v.x += (e.x - v.x) * 0.15; if (v.t % 15 === 5) hit(v.x - 18, v.y - 44, 36, 46, dmg, { ky: -1, kx: 0, stun: 20, status: { burn: 2 }, srcX: v.x }); }));
    }
  });
  N.burst('corvin', 'moon_gaze', 'Moon Gaze', 16, 'An eye opens over the nearest enemy. When it looks at them, they cannot move.', (p, z, dmg) => {
    const e = nearest(z, p.x, p.y - 16, 260); sfx('perfect'); pose(p, 'cheer', 0, 18);
    const tgt = e || { x: p.x + p.face * 80, y: p.y, h: 34, dead: false };
    z.shots.push(new Vis(tgt.x, tgt.y - 60, 64, (ctx, x, y, t) => {
      const o = Math.min(1, t / 14), h = Math.max(1, Math.round(10 * o));
      art.rect(ctx, '#2a0a1a', x - 14, y - h / 2, 28, h); art.rect(ctx, '#ffffff', x - 12, y - h / 2 + 1, 24, Math.max(1, h - 2)); art.disc(ctx, '#c1121f', x, y, Math.max(1, Math.round(5 * o))); art.disc(ctx, '#14101c', x, y, Math.max(1, Math.round(2 * o)));
      art.glow(ctx, x, y, 24, '#c1121f', 0.12 * o);
    }, v => {
      if (e && !e.dead) { v.x = e.x; v.y = e.y - 64; }
      if (v.t === 18) { sfx('zap'); fx.flash('#3a0a1a', 6); hit(v.x - 18, v.y + 20, 36, 48, dmg, { ky: 0, kx: 0, stun: 60, status: { freeze: 70 }, srcX: v.x, unblockable: true }); }
      if (v.t === 50) { sfx('explode'); fx.ring(v.x, v.y + 44, '#c1121f', 4, 34, 12); hit(v.x - 20, v.y + 18, 40, 52, Math.round(dmg * 1.4), { ky: -5, stun: 40, heavy: true, srcX: v.x }); }
    }));
  });
  ULT.crow_eclipse = (p, z, foes, dmg) => {
    if (p.st === 6) { sfx('roar'); z.shots.push(new Vis(0, 0, 66, (ctx, x, y, t) => { ctx.globalAlpha = 0.4 * Math.min(1, t / 8, (66 - t) / 8); art.rect(ctx, '#5a0a1a', 0, 0, W, SW.H); ctx.globalAlpha = 1; art.disc(ctx, '#c1121f', W - 70, 40, 16); art.disc(ctx, '#14101c', W - 64, 36, 14); })); }
    if (p.st >= 8 && p.st <= 56 && p.st % 2 === 0) { const d = (p.st >> 3) % 2 ? 1 : -1, y = G.cam.y + rand(60, 220); z.shots.push(new Vis(G.cam.x + (d > 0 ? -10 : W + 10), y, 60, (ctx, x, yy, t) => crow(ctx, x + d * t * 9, yy + Math.round(Math.sin(t * 0.3) * 4), d, t))); }
    if (every(p, 12, 54, 6)) { sfx('swing'); foes.forEach(e => { const b = e.box(); fx.slash(b.x + b.w / 2, b.y + b.h / 2, (p.st >> 3) % 2 ? 1 : -1, 1, CRW[1], 30); hurt(e, dmg, { ky: -1, stun: 30 }); }); }
    if (p.st === 62) { fx.flash('#c1121f', 10); fx.shake(10, 16); sfx('explode'); foes.forEach(e => { const b = e.box(); flock(b.x + b.w / 2, b.y + b.h / 2, 14); hurt(e, dmg * 4, { ky: -6, down: true, stun: 50 }); }); }
  };
  const MIRAGE = 600;
  TRAITS.mirage = {
    hurt(p, atk) {
      if (!atk.dmg || p.state === 'ult' || p.state === 'awaken' || SW.frame - (p.mirT === undefined ? -1e9 : p.mirT) < MIRAGE) return null;
      p.mirT = SW.frame; const z = G.zone, sx = atk.srcX === undefined ? p.x - p.face * 20 : atk.srcX, side = sx >= p.x ? 1 : -1;
      flock(p.x, p.y - 18, 12); sfx('dash');
      let moved = 0; while (z && moved < 56 && slide(p, z, -side, 4)) moved += 4;
      p.face = side; p.iframes = Math.max(p.iframes, 20); if (p.state !== 'guard') p.enter('idle');
      flock(p.x, p.y - 18, 6); fx.text(p.x, p.y - 44, 'MIRAGE', CRW[1]);
      return 'none';
    },
    mark(ctx, p, x, y) { if (SW.frame - (p.mirT === undefined ? -1e9 : p.mirT) >= MIRAGE) { art.rect(ctx, '#05060c', x - 3, y - 51, 7, 4); crow(ctx, x, y - 49, p.face, SW.frame); } }
  };

  // ================= Thorne =================
  const BONE = ['#ece6cc', '#ffffff', '#8a1c2a'];
  const shard = (ctx, x, y, pr) => { const d = Math.sign(pr.vx) || 1; art.rect(ctx, BONE[0], x - 5, y - 1, 10, 3); art.rect(ctx, BONE[1], x + (d > 0 ? 2 : -5), y - 1, 3, 2); art.rect(ctx, '#a89c78', x - d * 5 - 1, y, 2, 1); };
  Object.assign(CASTS, {
    finger_shards(p, z, dmg, up) {
      pose(p, 'a2', 1, 14);
      for (let k = 0; k < 3; k++) z.shots.push(new Later(1 + k * 4, (g, zz) => { if (p.dead) return; sfx('shoot'); zz.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 22 + (k - 1) * 2, vx: p.face * 9, vy: up ? -4 : 0, dmg, w: 10, h: 6, life: 36, kx: 1, stun: 18, render: shard })); }));
    },
    spine_whip(p, z, dmg) {
      const dir = p.face, len = 96, hs1 = new Set(), hs2 = new Set(); sfx('swing'); pose(p, 'a4', 1, 22);
      z.shots.push(new Vis(p.x, p.y - 22, 22, (ctx, x, y, t) => {
        const k = t < 10 ? t / 10 : 1 - (t - 10) / 12, n = Math.round(len * k / 6), px = Math.round(p.x - G.cam.x), py = Math.round(p.y - G.cam.y - 22);
        for (let i = 0; i < n; i++) art.rect(ctx, i % 2 ? BONE[0] : '#c8c0a0', px + dir * (8 + i * 6) - 2, py + Math.round(Math.sin(i * 0.8 + t * 0.6) * 2) - 2, 5, 4);
        if (n) art.rect(ctx, BONE[1], px + dir * (8 + n * 6) - 3, py - 3, 6, 6);
      }, v => {
        const k = v.t < 10 ? v.t / 10 : 1 - (v.t - 10) / 12, reach = 8 + len * k, x = dir > 0 ? p.x : p.x - reach;
        if (v.t <= 10) hit(x, p.y - 34, reach, 24, dmg, { kx: dir * 2, ky: -1.5, stun: 28, hitSet: hs1, srcX: p.x });
        else if (v.t === 12) hit(x, p.y - 34, reach, 24, Math.round(dmg * 0.6), { kx: -dir * 5, ky: -2, stun: 32, hitSet: hs2, srcX: p.x + dir * 200 });
      }));
    },
    bone_grove(p, z, dmg) {
      const dir = p.face; sfx('charge'); pose(p, 'cast', 1, 18);
      for (let k = 0; k < 5; k++) { const x = p.x + dir * (28 + k * 26); pillar(z, x, floorY(z, x, p.y - 20), 4 + k * 4, k === 4 ? dmg * 2 : dmg, { w: k === 4 ? 16 : 11, h: k === 4 ? 66 : 46, cols: [BONE[0], BONE[1], BONE[2]], spike: true, sfx: 'heavy', atk: { ky: k === 4 ? -7 : -3.5, stun: 32, breaker: k === 4, launch: k === 4 } }); }
    }
  });
  N.burst('thorne', 'marrow_lance', 'Marrow Lance', 24, 'Grow a lance of bone and drive forward with it, drilling through the enemy.', (p, z, dmg) => {
    const dir = p.face, hs = new Set(); sfx('charge'); p.pose = ['special', 1];
    z.shots.push(new Drive(p, 24, t => {
      p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2);
      if (t < 6) { p.vx = 0; return; }
      if (t === 6) sfx('dash');
      const ok = slide(p, z, dir, 6); if (t % 4 === 0) hs.clear();
      hit(...front(p, 50, 30, 0), Math.round(dmg * 0.3), { kx: dir * 2, ky: -0.5, stun: 22, hitSet: hs, srcX: p.x - dir * 10 });
      for (let i = 0; i < 2; i++) part(p.x + dir * rand(20, 46), p.y - 18 + rand(-3, 3), BONE[i], dir * -1.5, rand(-0.5, 0.5), 10, 2);
      if (t % 2) fx.ghost(p.sheet(), 'special', 1, p.x, p.y, dir < 0);
      if (!ok) return false;
    }, () => { sfx('heavy'); fx.shake(6, 12); fx.slash(p.x + dir * 30, p.y - 18, dir, 3, BONE[1], 60); hit(...front(p, 60, 36, 0), dmg, { kx: dir * 7, ky: -4, stun: 40, heavy: true, down: true, breaker: true, srcX: p.x }); }));
    z.shots.push(new Vis(p.x, p.y, 26, (ctx, x, y, t) => { const px = Math.round(p.x - G.cam.x), py = Math.round(p.y - G.cam.y) - 18, l = Math.min(44, t * 8); art.rect(ctx, BONE[0], p.face > 0 ? px + 8 : px - 8 - l, py - 3, l, 6); art.rect(ctx, BONE[1], p.face > 0 ? px + 8 + l : px - 14 - l, py - 2, 6, 4); art.rect(ctx, '#a89c78', p.face > 0 ? px + 8 : px - 8 - l, py + 1, l, 1); }));
  });
  ULT.ossuary = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(BONE[0], 8); sfx('roar'); }
    if (every(p, 10, 50, 8)) {
      for (let i = 0; i < 5; i++) { const x = G.cam.x + 30 + ((i * 97 + p.st * 13) % (W - 60)); pillar(z, x, floorY(z, x, p.y - 20), 2, 0, { w: 10, h: 40 + (i % 3) * 10, cols: [BONE[0], BONE[1], BONE[2]], spike: true, sfx: 'swing' }); }
      sfx('heavy'); foes.forEach(e => { const b = e.box(); fx.debris(b.x + b.w / 2, b.y + b.h, BONE[0], 4); hurt(e, dmg, { ky: -3, stun: 30 }); });
    }
    if (p.st === 54) foes.forEach(e => { const b = e.box(); z.shots.push(new Vis(b.x + b.w / 2, b.y + b.h, 18, (ctx, x, y, t) => { const c = Math.max(0, 22 - t * 3); for (let i = 0; i < 5; i++) { art.rect(ctx, BONE[0], x - 4 - c - i * 2, y - 10 - i * 9, 3, 10); art.rect(ctx, BONE[0], x + 2 + c + i * 2, y - 10 - i * 9, 3, 10); } })); });
    if (p.st === 62) { fx.flash(BONE[2], 8); fx.shake(10, 16); sfx('explode'); foes.forEach(e => hurt(e, dmg * 4, { ky: -6, down: true, stun: 50 })); }
  };
  TRAITS.thorns = {
    // a combo hit that lands on him costs its owner a little health (no stagger: thorns, not a counter)
    after(p, atk, r) {
      if (r !== 'hit' || atk.energy || !atk.dmg) return;
      const z = G.zone, n = Math.max(1, Math.round(3 * p.dmgMul())), e = z && nearest(z, p.x, p.y - 16, 90); if (!e) return;
      const f = fighterOf(e), b = e.box();
      for (let i = 0; i < 4; i++) part(b.x + b.w / 2, b.y + b.h / 2, i % 2 ? BONE[0] : BONE[2], rand(-1.5, 1.5), rand(-2, 0), 14, 2, 0.1);
      fx.text(b.x + b.w / 2, b.y - 8, '-' + n, BONE[0]);
      if (f) { f.state.hp -= n; if (f.state.hp <= 0) { if (V.mode === 'train') f.state.hp = 1; else f.p.die(); } }
      else if (e.hp !== undefined) e.hp = Math.max(1, e.hp - n);
    }
  };

  // ================= sprites =================
  Object.assign(RIG, {
    kestra: { head: 'ponytail', weapon: 'warfan', armed: 1, c: { skin: '#f0c8a8', hair: '#8a1c0a', top: '#3a1a14', arm: '#3a1a14', fore: '#ff6b35', hand: '#f0c8a8', pants: '#2a1410', boots: '#5a2a1a', belt: '#ffd24a', chest: '#ff6b35', trail: '#8a1c0a' }, trailHead: 1, trailLen: 4 },
    ivo:    { head: 'mohawk', limb: 3, bulk: 7, c: { skin: '#c8906a', hair: '#1a1a1a', top: '#1a1a1a', arm: '#c8906a', fore: '#ffb703', hand: '#fff3c4', pants: '#ffb703', boots: '#2a2a2a', belt: '#fb8500' } },
    nami:   { head: 'shaggy', sc: 1.08, bulk: 8, weapon: 'cleaver2', armed: 1, c: { skin: '#a8c0c8', hair: '#0e2a44', acc: '#caf0f8', top: '#0a3a5a', arm: '#0a3a5a', fore: '#a8c0c8', hand: '#a8c0c8', pants: '#03045e', boots: '#0a1a2a', belt: '#caf0f8', chest: '#48cae4', trail: '#0077b6' }, trailLen: 3, trailW: 3 },
    lin:    { head: 'longhair', c: { skin: '#f4dcc8', hair: '#1a1a2a', white: '#ffffff', top: '#e8feff', arm: '#e8feff', fore: '#f4dcc8', hand: '#f4dcc8', pants: '#3a4a6a', boots: '#2a3048', belt: '#5ec8d8', chest: '#5ec8d8', trail: '#1a1a2a' }, trailHead: 1, trailLen: 6 },
    corvin: { head: 'crowhood', c: { skin: '#c8b0a8', hair: '#14101c', acc: '#d8a020', glow: '#e0c3fc', top: '#1c1428', arm: '#1c1428', fore: '#3a1a5a', hand: '#c8b0a8', pants: '#14101c', boots: '#0c0810', belt: '#7209b7', chest: '#e0c3fc', trail: '#14101c' }, trailLen: 6, trailW: 3 },
    thorne: { head: 'braid', weapon: 'bonesword', armed: 1, c: { skin: '#e0d8d0', hair: '#f4f0e0', top: '#3a2a2a', arm: '#3a2a2a', fore: '#ece6cc', hand: '#e0d8d0', pants: '#2a1c1c', boots: '#ece6cc', belt: '#8a1c2a', chest: '#ece6cc', trail: '#8a1c2a' }, trailLen: 4 }
  });
  Object.assign(BORROW, { kestra: 'pyra', ivo: 'kael', nami: 'isolde', lin: 'nyra', corvin: 'vesper', thorne: 'ashka' });
  N.portraits(NEW);

  // Versus balance (see ninjas1.js). Untuned they won 33-77% (Corvin's crow dodge is worth a lot against bots); with this table about 46-57%.
  if (V && V.tune) Object.assign(V.tune, { kestra: 1.03, ivo: 1.25, nami: 0.84, lin: 1.18, corvin: 0.67, thorne: 0.78 });

  // ================= translations =================
  const ES = {
    'The Ember Fan': 'El Abanico de Brasas', 'Fire fan': 'Abanico de fuego', 'Kindling': 'Yesca', 'Fire first.': 'Primero, el fuego.', 'Then the fan, to make it worse.': 'Luego, el abanico, para empeorarlo.',
    'Ember Breath': 'Aliento de Brasas', 'Breathe three small fireballs in a spread. They set enemies alight, and your skills hit burning enemies 30% harder.': 'Escupes tres pequeñas bolas de fuego en abanico. Prenden fuego a los enemigos, y tus habilidades golpean un 30% más fuerte a los que arden.',
    'Fan Gust': 'Ráfaga de Abanico', 'One sweep of the fan blows enemies back and fans any fire on them.': 'Un barrido del abanico hace retroceder a los enemigos y aviva el fuego que lleven encima.',
    'Fire Wheel': 'Rueda de Fuego', 'A wheel of flame rolls slowly forward, burning everything it passes. Smashes cracked walls.': 'Una rueda de llamas avanza despacio y quema todo lo que toca. Rompe muros agrietados.',
    'Phoenix Dive': 'Picado del Fénix', 'Leap up, then dive onto the nearest enemy wrapped in fire and explode.': 'Saltas y luego caes en picado sobre el enemigo más cercano envuelta en fuego, y estallas.',
    'High Flame': 'Llama Alta', 'Phoenix Form': 'Forma de Fénix', 'Sunfall': 'Caída del Sol',
    'The Iron Pulse': 'El Pulso de Hierro', 'Martial arts': 'Artes marciales', 'Tempo': 'Ritmo', 'Trains every morning before dawn.': 'Entrena cada mañana antes del alba.', 'It shows.': 'Y se nota.',
    'Whirl Heel': 'Talón Giratorio', 'A spinning kick that carries you forward and hits twice. Every combo hit you land takes a sixth of a second off your skill cooldowns.': 'Una patada giratoria que te lleva hacia delante y golpea dos veces. Cada golpe de combo que aciertas quita una sexta parte de segundo a la recarga de tus habilidades.',
    'Sky Kick': 'Patada al Cielo', 'Kick the enemy into the air and jump up after them.': 'Lanzas al enemigo por los aires de una patada y saltas tras él.',
    'Fist Storm': 'Tormenta de Puños', 'Twelve punches in two seconds, walking forward. The last one knocks them down and smashes cracked walls.': 'Doce puñetazos en dos segundos, avanzando. El último lo derriba y rompe muros agrietados.',
    'Meteor Heel': 'Talón Meteoro', 'Leap high and bring your heel down. The landing sends a shockwave both ways.': 'Saltas muy alto y dejas caer el talón. Al aterrizar lanzas una onda de choque hacia ambos lados.',
    'Second Pulse': 'Segundo Pulso', 'Red Pulse': 'Pulso Rojo', 'Seventh Breath': 'Séptimo Aliento',
    'The Drowned Blade': 'La Espada Ahogada', 'Water blade': 'Espada de agua', 'Riptide': 'Resaca', 'The sea took her once.': 'El mar se la llevó una vez.', 'She came back with its patience.': 'Volvió con su paciencia.',
    'Water Bullet': 'Bala de Agua', 'A heavy ball of water that knocks enemies back. Your skill hits steal energy from the enemy.': 'Una pesada bola de agua que hace retroceder a los enemigos. Tus golpes de habilidad le roban energía al enemigo.',
    'Mist Veil': 'Velo de Niebla', 'Vanish in a mist for a moment, where nothing can hit you, then cut whoever is closest.': 'Desapareces un momento en la niebla, donde nada puede golpearte, y luego cortas a quien esté más cerca.',
    'Riptide Eel': 'Anguila de Resaca', 'A water eel swims forward, turning toward enemies, and bites three times.': 'Una anguila de agua nada hacia delante, gira hacia los enemigos y muerde tres veces.',
    'Bubble Jail': 'Prisión de Burbuja', 'Trap the nearest enemy in a ball of water. It holds them, hurts them, and bursts.': 'Atrapas al enemigo más cercano en una bola de agua. Lo retiene, lo daña y estalla.',
    'Flood Stance': 'Postura de Crecida', 'Deep Blue': 'Azul Profundo', 'Abyss Tide': 'Marea Abisal',
    'The Open Palm': 'La Palma Abierta', 'Pressure points': 'Puntos de presión', 'Seal': 'Sello', 'She does not hit hard.': 'No golpea fuerte.', 'She hits exactly.': 'Golpea con exactitud.',
    'Air Palm': 'Palma de Aire', 'A burst of air from your palm. Every fifth hit you land seals a pressure point: the enemy cannot use skills for two seconds.': 'Un estallido de aire desde tu palma. Cada quinto golpe que aciertas sella un punto de presión: el enemigo no puede usar habilidades durante dos segundos.',
    'Turning Wall': 'Muro Giratorio', 'Spin in place: nothing can touch you, enemies around you are thrown off, and their shots break.': 'Giras en el sitio: nada puede tocarte, los enemigos a tu alrededor salen despedidos y sus disparos se rompen.',
    'Palm Rain': 'Lluvia de Palmas', 'Sixteen palm strikes in a blur. The last one throws them into the air.': 'Dieciséis golpes de palma en un instante. El último lo lanza por los aires.',
    'Heart Strike': 'Golpe al Corazón', 'One perfect palm that sends the enemy across the arena and seals them at once.': 'Una palma perfecta que manda al enemigo al otro lado de la arena y lo sella al instante.',
    'Clear Eyes': 'Ojos Claros', 'Still Point': 'Punto Quieto', 'Hundred Palms': 'Cien Palmas', 'SEALED': 'SELLADO',
    'The Crow Eye': 'El Ojo del Cuervo', 'Crows': 'Cuervos', 'Mirage': 'Espejismo', 'You hit him.': 'Le das un golpe.', 'You hit a crow.': 'Le has dado a un cuervo.',
    'Crow Volley': 'Andanada de Cuervos', 'Three crows fly out and hunt the nearest enemy. Once every ten seconds, a hit that would land on you meets a crow instead, and you reappear a few steps away.': 'Tres cuervos salen volando y persiguen al enemigo más cercano. Una vez cada diez segundos, un golpe que te iba a alcanzar da a un cuervo, y reapareces unos pasos más allá.',
    'Scatter': 'Dispersión', 'Burst into crows that peck everything around you, and come back together further away.': 'Te deshaces en cuervos que picotean todo a tu alrededor y vuelves a juntarte más lejos.',
    'Black Flame': 'Llama Negra', 'Black fire catches on the nearest enemy ahead and keeps burning for a while.': 'Un fuego negro prende en el enemigo más cercano delante de ti y sigue ardiendo un rato.',
    'Moon Gaze': 'Mirada Lunar', 'An eye opens over the nearest enemy. When it looks at them, they cannot move.': 'Un ojo se abre sobre el enemigo más cercano. Cuando lo mira, no puede moverse.',
    'Omen': 'Presagio', 'Dark Wings': 'Alas Oscuras', 'Crow Eclipse': 'Eclipse de Cuervos', 'MIRAGE': 'ESPEJISMO',
    'The Bone Garden': 'El Jardín de Hueso', 'Bone': 'Hueso', 'Thorns': 'Espinas', 'Everything he needs,': 'Todo lo que necesita', 'he already carries inside.': 'ya lo lleva dentro.',
    'Finger Shards': 'Esquirlas de Dedo', 'Fire three shards of bone in a quick line. Anyone who hits you with a combo cuts themselves on you.': 'Disparas tres esquirlas de hueso seguidas. Quien te golpee con un combo se corta contigo.',
    'Spine Whip': 'Látigo de Espina', 'Lash out with a long whip of bone that hits on the way out and drags them in on the way back.': 'Lanzas un largo látigo de hueso que golpea al salir y arrastra al enemigo hacia ti al volver.',
    'Bone Grove': 'Arboleda de Hueso', 'A line of bone spikes bursts out of the floor ahead, one after another. Smashes cracked walls.': 'Una hilera de púas de hueso brota del suelo delante de ti, una tras otra. Rompe muros agrietados.',
    'Marrow Lance': 'Lanza de Médula', 'Grow a lance of bone and drive forward with it, drilling through the enemy.': 'Haces crecer una lanza de hueso y avanzas con ella, perforando al enemigo.',
    'Hard Marrow': 'Médula Dura', 'Ivory Form': 'Forma de Marfil', 'Ossuary': 'Osario'
  };
  const ZH = {
    'The Ember Fan': '余烬之扇', 'Fire fan': '火扇', 'Kindling': '引火', 'Fire first.': '先放火。', 'Then the fan, to make it worse.': '再用扇子让它烧得更旺。',
    'Ember Breath': '余烬吐息', 'Breathe three small fireballs in a spread. They set enemies alight, and your skills hit burning enemies 30% harder.': '扇形吐出三颗小火球，点燃敌人。你的技能对燃烧中的敌人伤害提升30%。',
    'Fan Gust': '扇风', 'One sweep of the fan blows enemies back and fans any fire on them.': '扇子一挥，吹退敌人，并让他们身上的火烧得更旺。',
    'Fire Wheel': '火轮', 'A wheel of flame rolls slowly forward, burning everything it passes. Smashes cracked walls.': '一个火焰之轮缓缓向前滚动，烧灼经过的一切。能击碎裂墙。',
    'Phoenix Dive': '凤凰俯冲', 'Leap up, then dive onto the nearest enemy wrapped in fire and explode.': '跃起，然后裹着火焰俯冲向最近的敌人并爆炸。',
    'High Flame': '烈焰高扬', 'Phoenix Form': '凤凰形态', 'Sunfall': '坠日',
    'The Iron Pulse': '铁之脉动', 'Martial arts': '武术', 'Tempo': '节奏', 'Trains every morning before dawn.': '每天天亮前就开始训练。', 'It shows.': '看得出来。',
    'Whirl Heel': '旋踵', 'A spinning kick that carries you forward and hits twice. Every combo hit you land takes a sixth of a second off your skill cooldowns.': '向前旋转踢击，命中两次。每次连招命中都会让技能冷却缩短六分之一秒。',
    'Sky Kick': '冲天踢', 'Kick the enemy into the air and jump up after them.': '把敌人踢上天，然后跟着跳上去。',
    'Fist Storm': '拳风暴', 'Twelve punches in two seconds, walking forward. The last one knocks them down and smashes cracked walls.': '边前进边在两秒内打出十二拳。最后一拳将敌人击倒，并能击碎裂墙。',
    'Meteor Heel': '流星踵', 'Leap high and bring your heel down. The landing sends a shockwave both ways.': '高高跃起，脚跟重重劈下。落地时向两侧发出冲击波。',
    'Second Pulse': '第二脉动', 'Red Pulse': '赤红脉动', 'Seventh Breath': '第七息',
    'The Drowned Blade': '溺水之刃', 'Water blade': '水刃', 'Riptide': '离岸流', 'The sea took her once.': '大海曾经带走过她。', 'She came back with its patience.': '她带着大海的耐心回来了。',
    'Water Bullet': '水弹', 'A heavy ball of water that knocks enemies back. Your skill hits steal energy from the enemy.': '一颗沉重的水球，能击退敌人。你的技能命中会偷取敌人的能量。',
    'Mist Veil': '雾隐', 'Vanish in a mist for a moment, where nothing can hit you, then cut whoever is closest.': '在雾中消失片刻，期间不会被击中，然后斩向最近的人。',
    'Riptide Eel': '激流鳗', 'A water eel swims forward, turning toward enemies, and bites three times.': '一条水鳗向前游去，转向敌人并咬三口。',
    'Bubble Jail': '水泡牢笼', 'Trap the nearest enemy in a ball of water. It holds them, hurts them, and bursts.': '把最近的敌人困在水球里。水球会定住他、伤害他，然后爆开。',
    'Flood Stance': '洪流架势', 'Deep Blue': '深蓝', 'Abyss Tide': '深渊之潮',
    'The Open Palm': '摊开的手掌', 'Pressure points': '穴位', 'Seal': '封穴', 'She does not hit hard.': '她出手不重。', 'She hits exactly.': '但每一下都分毫不差。',
    'Air Palm': '空掌', 'A burst of air from your palm. Every fifth hit you land seals a pressure point: the enemy cannot use skills for two seconds.': '掌中迸出一股气。每命中五次就封住一处穴位：敌人两秒内无法使用技能。',
    'Turning Wall': '回旋之壁', 'Spin in place: nothing can touch you, enemies around you are thrown off, and their shots break.': '原地旋转：任何攻击都碰不到你，周围的敌人被甩开，他们的飞行道具也会被击碎。',
    'Palm Rain': '掌雨', 'Sixteen palm strikes in a blur. The last one throws them into the air.': '眨眼间打出十六掌。最后一掌把敌人抛上空中。',
    'Heart Strike': '心击', 'One perfect palm that sends the enemy across the arena and seals them at once.': '完美的一掌，把敌人打飞到竞技场另一头，并立刻封住穴位。',
    'Clear Eyes': '明眸', 'Still Point': '静点', 'Hundred Palms': '百掌', 'SEALED': '封穴',
    'The Crow Eye': '鸦之眼', 'Crows': '群鸦', 'Mirage': '幻影', 'You hit him.': '你打中了他。', 'You hit a crow.': '你打中的是一只乌鸦。',
    'Crow Volley': '群鸦齐射', 'Three crows fly out and hunt the nearest enemy. Once every ten seconds, a hit that would land on you meets a crow instead, and you reappear a few steps away.': '三只乌鸦飞出，追击最近的敌人。每十秒一次，本该打中你的攻击会打在乌鸦身上，你则在几步之外重新出现。',
    'Scatter': '散鸦', 'Burst into crows that peck everything around you, and come back together further away.': '化作群鸦啄击周围的一切，然后在更远处重新聚合。',
    'Black Flame': '黑炎', 'Black fire catches on the nearest enemy ahead and keeps burning for a while.': '黑色的火焰在前方最近的敌人身上燃起，持续燃烧一段时间。',
    'Moon Gaze': '月之凝视', 'An eye opens over the nearest enemy. When it looks at them, they cannot move.': '一只眼睛在最近的敌人上方睁开。被它注视时，敌人无法动弹。',
    'Omen': '凶兆', 'Dark Wings': '暗翼', 'Crow Eclipse': '鸦蚀', 'MIRAGE': '幻影',
    'The Bone Garden': '骨之庭园', 'Bone': '骨', 'Thorns': '荆棘', 'Everything he needs,': '他需要的一切，', 'he already carries inside.': '早已长在身体里。',
    'Finger Shards': '指骨碎片', 'Fire three shards of bone in a quick line. Anyone who hits you with a combo cuts themselves on you.': '快速连射三枚骨片。用连招打你的人会被你划伤。',
    'Spine Whip': '脊骨鞭', 'Lash out with a long whip of bone that hits on the way out and drags them in on the way back.': '甩出一条长长的骨鞭，出去时打中敌人，收回时把他拖过来。',
    'Bone Grove': '骨林', 'A line of bone spikes bursts out of the floor ahead, one after another. Smashes cracked walls.': '一排骨刺从前方地面接连刺出。能击碎裂墙。',
    'Marrow Lance': '骨髓长枪', 'Grow a lance of bone and drive forward with it, drilling through the enemy.': '长出一支骨枪，带着它向前突进，钻穿敌人。',
    'Hard Marrow': '硬髓', 'Ivory Form': '象牙形态', 'Ossuary': '骸骨堂'
  };
  const ULTS = {
    sunfall: ['un segundo sol se forma sobre la arena, hace llover fuego sobre todos y luego cae.', '第二个太阳在竞技场上空凝聚，向所有人降下火雨，然后坠落。'],
    seventh_breath: ['se mueve más rápido de lo que ve el ojo, golpea a todos desde todos los lados y remata con un solo golpe.', '他快得肉眼看不清，从四面八方攻击所有人，最后一击收尾。'],
    abyss_tide: ['la arena se inunda. Las anguilas atraviesan a todos y luego cae toda la marea.', '竞技场被淹没。水鳗撕穿所有人，然后整片潮水压下。'],
    hundred_palms: ['cien palmas se abren a su alrededor y se cierran sobre todos a la vez.', '一百只手掌在她周围张开，同时合向所有人。'],
    crow_eclipse: ['el cielo se vuelve rojo y una tormenta de cuervos atraviesa a todos una y otra vez.', '天空变红，鸦群风暴一次又一次地穿过所有人。'],
    ossuary: ['el hueso brota de todo el suelo una y otra vez, y una jaula de costillas se cierra sobre todos.', '白骨一次又一次从整片地面刺出，一座肋骨牢笼合拢在所有人身上。']
  };
  Object.keys(ULTS).forEach(id => { const en = D.abilities[id].desc.replace(/^Ultimate: /, '').replace(/ Costs all three bars, or one while awakened\.$/, ''); Object.assign(ES, N.ultText('es', en, ULTS[id][0])); Object.assign(ZH, N.ultText('zh', en, ULTS[id][1])); });
  N.tr('es', ES); N.tr('zh', ZH);
})();
