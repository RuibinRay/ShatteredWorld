'use strict';
// Shattered Worlds — Hidden Clans, third six (Versus only; see ninja-core.js). All original characters.
//   Ume     spores: her skill hits stack Blight on the target (up to five); each stack drains 1 health a second for four seconds.
//   Tarek   chain sickle: skill hits from further than a few steps away reel the target toward him.
//   Isa     ink: every U, S+U and I leaves a glyph on the floor (three at most) that bursts when an enemy steps on it.
//   Garo    giant shuriken: his thrown wheels come back to him and hit again; catching one gives back energy.
//   Mika    twin blades: her hits in the air deal 25% more, and an air hit gives her air jumps back.
//   Oda     temple bell: a perfect block rings his bell, resets his skill cooldowns and throws the attacker back.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja, V = SW.versus;
  if (!N) return;
  const CASTS = SW.casts, Proj = SW.Proj, boom = SW.boom, rand = SW.rand;
  const { hit, hurt, isFoe, part, front, slide, ahead, nearest, every, floorY, fighterOf, pose, Later, Vis, Drive, pillar, smoke, sfx, ULT, TRAITS, pips, RIG, BORROW } = N;
  const NEW = ['ume', 'tarek', 'isa', 'garo', 'mika', 'oda'];
  // energy given back to the hero: in Versus it has to go where the frame's energy is settled (see versus.js fightTick)
  const refund = (p, n) => { if (G.scene === 'vs' && V.cur && V.cur.p === p) V.cur.bonus += n; else G.state.energy = Math.min(300, G.state.energy + n); };
  // move an enemy (or a Versus opponent) toward x by up to n pixels, stopping at walls
  const drag = (z, e, x, n) => { if (!e || e.dead) return; const f = fighterOf(e), q = f ? f.p : (e.isBoss || (e.def && e.def.heavy) ? null : e); if (!q) return; const d = Math.sign(x - q.x); for (let s = 0; s < n && Math.abs(x - q.x) > 2; s++) { if (z.hit(q.x + d - (q.w || 12) / 2, q.y - (q.h || 30), q.w || 12, q.h || 30)) break; q.x += d; } };

  // ================= heroes =================
  N.hero('ume', { name: 'Ume', alias: 'Bloom', title: 'The Poison Garden', energy: 'Sap', color: '#9ef01a', colorHi: '#efffd0', element: 'Spores', sig: 'Blight', combo: 'swift', route: 'nyra', modeKind: 'speed', pitch: 600,
    trait: 'blight', blurb: 'Everything she grows is beautiful.\nDo not touch any of it.', kit: ['spore_puff', 'vine_snap', 'bloom_field', 'frost_steps', 'sap_rush', 'full_bloom', 'last_spring'] });
  N.hero('tarek', { name: 'Tarek', alias: 'Hook', title: 'The Long Chain', energy: 'Reach', color: '#c9a227', colorHi: '#fff1c1', element: 'Chain sickle', sig: 'Reel', combo: 'dagger', route: 'kael', pitch: 380,
    trait: 'reel', blurb: 'He never has to come to you.\nYou always come to him.', kit: ['chain_lash', 'hook_pull', 'iron_cyclone', 'magnet_grip', 'long_reach', 'iron_coil', 'chain_prison'] });
  N.hero('isa', { name: 'Isa', alias: 'Quill', title: 'The Ink Scholar', energy: 'Ink', color: '#ef476f', colorHi: '#ffe3ea', element: 'Ink', sig: 'Glyph', combo: 'flame', route: 'nyra', pitch: 560,
    trait: 'glyph', blurb: 'Every word she writes\nis a door she can slam.', kit: ['ink_bolt', 'brush_stroke', 'seal_circle', 'frost_steps', 'wet_ink', 'grand_script', 'final_word'] });
  N.hero('garo', { name: 'Garo', alias: 'Millstone', title: 'The Iron Wheel', energy: 'Iron', color: '#8d99ae', colorHi: '#edf2f4', element: 'Giant shuriken', sig: 'Return', combo: 'heavy', route: 'kael', pitch: 200,
    trait: 'return', blurb: 'He throws it once.\nIt hits you twice.', kit: ['wheel_throw', 'iron_guard', 'grind_wheel', 'magnet_grip', 'iron_will', 'iron_mountain', 'thousand_wheels'] });
  N.hero('mika', { name: 'Mika', alias: 'Crescent', title: 'The Twin Moons', energy: 'Moonlight', color: '#b8c0ff', colorHi: '#ffffff', element: 'Twin blades', sig: 'Moonstep', combo: 'dagger', route: 'nyra', modeKind: 'speed', pitch: 700,
    trait: 'moonstep', blurb: 'She has not touched the ground\nsince the fight began.', kit: ['crescent_toss', 'moon_vault', 'twin_orbit', 'frost_steps', 'night_sky', 'full_moon', 'moonfall'] });
  N.hero('oda', { name: 'Oda', alias: 'Tolling', title: 'The Temple Bell', energy: 'Toll', color: '#bc6c25', colorHi: '#fefae0', element: 'Sound', sig: 'Ring', combo: 'heavy', route: 'nyra', pitch: 160,
    trait: 'ring', blurb: 'A monk who took a vow of silence.\nThe bell did not.', kit: ['toll_wave', 'bell_drop', 'resonance', 'frost_steps', 'deep_toll', 'great_bell', 'last_toll'] });

  N.abilities('ume', {
    spore_puff:     { name: 'Spore Puff', input: 'U', cost: 20, dmg: 7, desc: 'A slow cloud of spores drifts forward. Your skill hits stack Blight, up to five: each stack drains 1 health a second for four seconds.' },
    vine_snap:      { name: 'Vine Snap', input: 'S + U', cost: 50, dmg: 13, desc: 'A vine whips up out of the ground ahead, catches the enemy and lifts them.' },
    bloom_field:    { name: 'Bloom Field', input: 'I', cost: 50, dmg: 5, desc: 'Plant three flowers ahead of you. They open a moment later and puff spores for a few seconds.' },
    last_spring:    { name: 'Last Spring', dmg: 10, desc: 'flowers open across the whole floor and fill the air with spores, then all burst at once.' }
  }, 'Sap Rush', 'Full Bloom');
  N.abilities('tarek', {
    chain_lash:     { name: 'Chain Lash', input: 'U', cost: 20, dmg: 9, desc: 'Throw the weighted end of your chain a long way and snap it back. Skill hits from a few steps away reel the enemy toward you.' },
    hook_pull:      { name: 'Hook Pull', input: 'S + U', cost: 50, dmg: 12, desc: 'Hook the nearest enemy ahead with the sickle, yank them to your feet and knee them into the air.' },
    iron_cyclone:   { name: 'Iron Cyclone', input: 'I', cost: 50, dmg: 4, desc: 'Swing the chain around you in a wide circle while you walk forward. Smashes cracked walls.' },
    chain_prison:   { name: 'Chain Prison', dmg: 11, desc: 'chains shoot in from both sides of the arena, wrap everyone, and he swings them all into the floor.' }
  }, 'Long Reach', 'Iron Coil');
  N.abilities('isa', {
    ink_bolt:       { name: 'Ink Bolt', input: 'U', cost: 20, dmg: 9, desc: 'Flick a bolt of ink from your brush. Every U, S+U and I leaves a glyph on the floor that bursts when an enemy steps on it (three at most).' },
    brush_stroke:   { name: 'Brush Stroke', input: 'S + U', cost: 50, dmg: 14, desc: 'One great stroke of the brush cuts a wide arc in front of you.' },
    seal_circle:    { name: 'Seal Circle', input: 'I', cost: 50, dmg: 6, desc: 'Draw a seal on the floor ahead. It wakes a moment later and strikes four times. Smashes cracked walls.' },
    final_word:     { name: 'The Final Word', dmg: 12, desc: 'she writes one enormous word across the sky, and it falls on everyone.' }
  }, 'Wet Ink', 'Grand Script');
  N.abilities('garo', {
    wheel_throw:    { name: 'Wheel Throw', input: 'U', cost: 25, dmg: 11, desc: 'Hurl your giant shuriken. It flies out, comes back, and hits on both ways. Catching it gives back 10 energy.' },
    iron_guard:     { name: 'Iron Guard', input: 'S + U', cost: 50, dmg: 10, desc: 'Hold the shuriken in front of you as a wall: nothing gets through for half a second, then you shove it forward.' },
    grind_wheel:    { name: 'Grind Wheel', input: 'I', cost: 50, dmg: 5, desc: 'Roll the shuriken along the floor. It grinds whatever it meets and rolls back to you. Smashes cracked walls.' },
    thousand_wheels: { name: 'A Thousand Wheels', dmg: 10, desc: 'shuriken cross the arena from every side, then one the size of a house comes down.' }
  }, 'Iron Will', 'Iron Mountain');
  N.abilities('mika', {
    crescent_toss:  { name: 'Crescent Toss', input: 'U', cost: 20, dmg: 8, desc: 'Throw both blades in a cross; they curve back to your hands. Hits in the air deal 25% more and give your air jumps back.' },
    moon_vault:     { name: 'Moon Vault', input: 'S + U', cost: 50, dmg: 12, desc: 'Somersault up and over the enemy, cutting down at them as you pass.' },
    twin_orbit:     { name: 'Twin Orbit', input: 'I', cost: 50, dmg: 5, desc: 'Two moon blades circle you for three seconds, cutting anything that comes close.' },
    moonfall:       { name: 'Moonfall', dmg: 11, desc: 'two moons rise, and she cuts across the whole arena six times by their light.' }
  }, 'Night Sky', 'Full Moon');
  N.abilities('oda', {
    toll_wave:      { name: 'Toll Wave', input: 'U', cost: 25, dmg: 10, desc: 'A ring of sound rolls forward, growing as it goes. A perfect block rings your bell: your skill cooldowns reset and the attacker is thrown back.' },
    bell_drop:      { name: 'Bell Drop', input: 'S + U', cost: 50, dmg: 14, desc: 'A bronze bell drops over the nearest enemy ahead, traps them, and rings twice.' },
    resonance:      { name: 'Resonance', input: 'I', cost: 50, dmg: 5, desc: 'Strike the floor three times; each blow sends rings of sound out both ways. Smashes cracked walls.' },
    last_toll:      { name: 'The Last Toll', dmg: 13, desc: 'a bell as big as the arena hangs over it, and tolls four times.' }
  }, 'Deep Toll', 'Great Bell');

  // ================= Ume =================
  const LEAF = ['#9ef01a', '#efffd0', '#38b000', '#c77dff'];
  const cloud = (ctx, x, y, r, t, a) => { ctx.globalAlpha = a; for (let i = 0; i < 5; i++) art.disc(ctx, i % 2 ? LEAF[0] : '#70e000', x + Math.round(Math.cos(t * 0.1 + i * 1.3) * r * 0.5), y + Math.round(Math.sin(t * 0.08 + i) * r * 0.35), Math.round(r * 0.5)); ctx.globalAlpha = 1; };
  const flower = (ctx, x, y, open, col) => { art.rect(ctx, LEAF[2], x - 1, y - 8, 2, 8); const r = Math.round(2 + 4 * open); for (let i = 0; i < 5; i++) { const a = i * 1.257; art.disc(ctx, col || LEAF[3], x + Math.round(Math.cos(a) * r), y - 10 + Math.round(Math.sin(a) * r), Math.max(1, Math.round(1 + 2 * open))); } art.disc(ctx, '#ffe066', x, y - 10, 2); };
  // Blight lives on whatever it is stacked on: the opponent fighter in Versus, the enemy itself in the story
  const holder = e => fighterOf(e) || e;
  function blight(e, n) { if (!e || e.dead) return; const h = holder(e); h.blight = Math.min(5, (h.blight || 0) + (n || 1)); h.blightT = 240; }
  Object.assign(CASTS, {
    spore_puff(p, z, dmg, up) {
      sfx('burst'); pose(p, 'a2', 1, 10);
      z.shots.push(new Proj({ x: p.x + p.face * 16, y: p.y - 22, vx: p.face * 3.4, vy: up ? -2.2 : 0, dmg, w: 24, h: 24, life: 54, ghost: true, pierce: true, maxHits: 2, rehit: 16, kx: 0.6, ky: -0.5, stun: 20,
        render(ctx, x, y, pr) { cloud(ctx, x, y, 14 + Math.min(6, pr.t / 6), pr.t, 0.55); }, think() { if (this.t % 3 === 0) part(this.x + rand(-10, 10), this.y + rand(-8, 8), LEAF[this.t % 2], 0, -0.3, 16, 2); } }));
    },
    vine_snap(p, z, dmg) {
      const e = ahead(p, z, 110), x = e ? e.x : p.x + p.face * 64, gy = floorY(z, x, p.y - 20); sfx('swing');
      z.shots.push(new Vis(x, gy, 30, (ctx, sx, sy, t) => { const hh = Math.round(58 * Math.min(1, t / 6) * (t > 22 ? (30 - t) / 8 : 1)); for (let i = 0; i < hh; i += 3) art.rect(ctx, i % 6 ? LEAF[2] : LEAF[0], sx - 2 + Math.round(Math.sin(i * 0.2 + t * 0.4) * 4), sy - i - 3, 4, 3); if (hh > 10) flower(ctx, sx + Math.round(Math.sin(hh * 0.2 + t * 0.4) * 4), sy - hh + 8, 1); },
        v => { if (v.t === 6) hit(v.x - 16, v.y - 58, 32, 60, dmg, { ky: -7, stun: 44, launch: true, heavy: true, status: { freeze: 30 }, srcX: v.x }); }));
    },
    bloom_field(p, z, dmg) {
      sfx('charge'); pose(p, 'cast', 1, 16);
      [30, 62, 94].forEach((dx, k) => { const x = p.x + p.face * dx, gy = floorY(z, x, p.y - 20), hs = new Set();
        z.shots.push(new Vis(x, gy, 170 + k * 6, (ctx, sx, sy, t) => { const o = Math.min(1, Math.max(0, (t - 12 - k * 6) / 8)); flower(ctx, sx, sy, o); if (o >= 1 && (t >> 3) % 2) cloud(ctx, sx, sy - 22, 14, t, 0.25); },
          v => { const t0 = 20 + k * 6; if (v.t >= t0 && (v.t - t0) % 20 === 0) { hs.clear(); for (let i = 0; i < 6; i++) part(v.x + rand(-8, 8), v.y - 12, LEAF[i % 2], rand(-1, 1), -rand(0.5, 1.5), 22, 2); hit(v.x - 20, v.y - 44, 40, 44, dmg, { ky: -0.5, kx: 0, stun: 16, hitSet: hs, srcX: v.x, breaker: k === 2 && v.t === t0 }); } })); });
    }
  });
  N.burst('ume', 'corpse_flower', 'Corpse Flower', 12, 'A giant flower opens under the nearest enemy and snaps shut on them three times.', (p, z, dmg) => {
    const e = ahead(p, z, 220) || nearest(z, p.x, p.y - 16, 140), x0 = e ? e.x : p.x + p.face * 70, gy = floorY(z, x0, p.y - 20); sfx('charge'); pose(p, 'cheer', 0, 18);
    z.shots.push(new Vis(x0, gy, 60, (ctx, x, y, t) => {
      const o = Math.min(1, t / 8), c = [16, 30, 44].some(s => t >= s && t < s + 4) ? 0.25 : 1;
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.45 * c; art.line(ctx, i % 2 ? LEAF[3] : '#9d4edd', x, y - 4, x + Math.round(Math.cos(a) * 30 * o), y - 4 + Math.round(Math.sin(a) * 40 * o), 4); }
      art.disc(ctx, '#ffe066', x, y - 6, Math.round(5 * o));
    }, v => {
      if (e && !e.dead && v.t < 50) v.x += (e.x - v.x) * 0.3;
      if (v.t === 16 || v.t === 30 || v.t === 44) { sfx('heavy'); hit(v.x - 20, v.y - 48, 40, 50, dmg, { ky: v.t === 44 ? -6 : 0, kx: 0, stun: 30, status: { freeze: v.t === 44 ? 0 : 20 }, heavy: v.t === 44, srcX: v.x }); }
    }));
  });
  ULT.last_spring = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(LEAF[1], 8); sfx('perfect'); for (let i = 0; i < 14; i++) { const x = G.cam.x + 16 + i * 34; z.shots.push(new Vis(x, floorY(z, x, p.y - 20), 62, (ctx, sx, sy, t) => { flower(ctx, sx, sy, Math.min(1, t / 10), i % 2 ? LEAF[3] : '#ff70a6'); if (t > 12 && t < 56) cloud(ctx, sx, sy - 26 - (t % 20), 12, t + i * 7, 0.22); })); } }
    if (every(p, 14, 52, 8)) { sfx('burst'); foes.forEach(e => { hurt(e, dmg, { ky: -1, stun: 30 }); blight(e, 1); }); }
    if (p.st === 62) { fx.flash(LEAF[0], 8); fx.shake(10, 16); sfx('explode'); foes.forEach(e => { const b = e.box(); for (let i = 0; i < 12; i++) part(b.x + b.w / 2, b.y + b.h / 2, LEAF[i % 4], rand(-3, 3), rand(-3, 0), 24, 3, 0.1); hurt(e, dmg * 4, { ky: -6, down: true, stun: 50 }); blight(e, 5); }); }
  };
  TRAITS.blight = {
    hit(p, atk, e) { if (atk.energy) blight(e, 1); },
    tick(p, g, z) {
      if (G.scene === 'vs' && V.phase === 'fight' && V.t < 3) z.ents.forEach(e => { const h = holder(e); h.blight = 0; h.blightT = 0; });   // a new round starts clean
      z.ents.forEach(e => {
        if (!isFoe(e)) return; const h = holder(e); if (!(h.blightT > 0)) return;
        h.blightT--; if (h.blightT <= 0) { h.blight = 0; return; }
        if (h.blightT % 5 === 0) { const b = e.box(); part(b.x + rand(0, b.w), b.y + rand(0, b.h), LEAF[3], 0, -0.6, 12, 2); }
        if (h.blightT % 60 !== 0 || !h.blight) return;
        const n = h.blight, b = e.box(); fx.text(b.x + b.w / 2, b.y - 6, String(n), LEAF[0]);
        if (h.state && h.p) { h.state.hp -= n; if (h.state.hp <= 0) { if (V.mode === 'train') h.state.hp = 1; else h.p.die(); } }
        else if (e.hp !== undefined) { e.hp = Math.max(1, e.hp - n); e.showHp = 120; }
      });
    },
    mark(ctx, p, x, y) { const z = G.zone, e = z && z.ents.find(isFoe), h = e && holder(e); if (h && h.blightT > 0 && h.blight) pips(ctx, x, y - 50, h.blight, 5, LEAF[3]); }
  };

  // ================= Tarek =================
  const BRASS = ['#c9a227', '#fff1c1', '#6c757d'];
  const chainLine = (ctx, x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 5)); for (let i = 0; i <= n; i++) { const k = i / n; art.rect(ctx, i % 2 ? BRASS[2] : '#adb5bd', Math.round(x0 + (x1 - x0) * k) - 1, Math.round(y0 + (y1 - y0) * k) - 1, 3, 2); } };
  Object.assign(CASTS, {
    chain_lash(p, z, dmg, up) {
      const dir = p.face, len = 140, hs = new Set(); sfx('swing'); pose(p, 'a4', 1, 18);
      z.shots.push(new Vis(p.x, p.y, 18, (ctx, x, y, t) => { const k = t < 8 ? t / 8 : 1 - (t - 8) / 10, px = Math.round(p.x - G.cam.x) + dir * 8, py = Math.round(p.y - G.cam.y) - 22, ex = px + Math.round(dir * len * k), ey = py + (up ? -Math.round(len * k * 0.5) : 0); chainLine(ctx, px, py, ex, ey); art.disc(ctx, BRASS[0], ex, ey, 4); art.rect(ctx, BRASS[1], ex - 1, ey - 2, 2, 2); },
        v => { const k = v.t < 8 ? v.t / 8 : 1 - (v.t - 8) / 10, ex = p.x + dir * (8 + len * k), ey = p.y - 22 - (up ? len * k * 0.5 : 0); if (v.t <= 10) hit(ex - 8, ey - 8, 16, 16, dmg, { kx: dir * 1, ky: -1.5, stun: 26, hitSet: hs, srcX: p.x }); }));
    },
    hook_pull(p, z, dmg) {
      const e = ahead(p, z, 160), dir = p.face; sfx('swing'); pose(p, 'a3', 1, 22);
      const tx = e ? e.x : p.x + dir * 120;
      z.shots.push(new Vis(p.x, p.y, 20, (ctx, x, y, t) => { const k = t < 8 ? t / 8 : 1 - (t - 8) / 12, px = Math.round(p.x - G.cam.x) + dir * 8, py = Math.round(p.y - G.cam.y) - 22, ex = px + Math.round((tx - p.x - dir * 8) * k); chainLine(ctx, px, py, ex, py); art.rect(ctx, BRASS[1], ex - 3 * dir, py - 6, 2, 8); art.rect(ctx, BRASS[1], ex - 3 * dir, py - 6, 6 * dir, 2); },
        v => {
          if (v.t !== 8 || !e || e.dead || Math.abs(e.x - p.x) > 170) return;
          sfx('heavy'); hurt(e, Math.round(dmg * 0.4), { ky: 0, kx: 0, stun: 40, heavy: false }); drag(z, e, p.x + dir * 22, 200);
          z.shots.push(new Later(6, () => { if (p.dead) return; fx.slash(p.x + dir * 14, p.y - 26, dir, 2, BRASS[1], 40); hit(...front(p, 44, 60, 6), dmg, { ky: -8, kx: dir * 0.5, stun: 44, launch: true, heavy: true, srcX: p.x }); }));
        }));
    },
    iron_cyclone(p, z, dmg) {
      const dir = p.face, hs = new Set(); sfx('dash');
      z.shots.push(new Drive(p, 40, t => {
        p.vx = 0; if (t % 2) slide(p, z, dir, 1); p.pose = [t % 8 < 4 ? 'cheer' : 'cast', 0];
        if (t % 6 === 1) { hs.clear(); sfx('swing'); }
        const a = t * 0.5; z.shots.push(new Vis(p.x, p.y, 2, (ctx, x, y) => { const cy = y - 24, ex = x + Math.round(Math.cos(a) * 60), ey = cy + Math.round(Math.sin(a) * 16); chainLine(ctx, x, cy, ex, ey); art.disc(ctx, BRASS[0], ex, ey, 4); }));
        hit(p.x - 62, p.y - 48, 124, 50, dmg, { kx: dir * 1.2, ky: -1.5, stun: 20, hitSet: hs, srcX: p.x, breaker: t === 39 });
      }));
    }
  });
  N.burst('tarek', 'chain_drop', 'Chain Drop', 9, 'Throw the chain high; it falls in a loop around the nearest enemy, binds them, and pulls tight.', (p, z, dmg) => {
    const e = nearest(z, p.x, p.y - 16, 240), x0 = e ? e.x : p.x + p.face * 90, gy = floorY(z, x0, p.y - 20); sfx('swing'); pose(p, 'cheer', 0, 20);
    z.shots.push(new Vis(x0, gy, 50, (ctx, x, y, t) => {
      const fall = Math.max(0, 1 - t / 12), r = t < 24 ? 22 : Math.max(8, 22 - (t - 24)), cy = y - 22 - Math.round(fall * 120);
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + t * 0.1; art.rect(ctx, i % 2 ? BRASS[2] : '#adb5bd', x + Math.round(Math.cos(a) * r) - 1, cy + Math.round(Math.sin(a) * r * 0.6) - 1, 3, 2); }
    }, v => {
      if (e && !e.dead && v.t < 40) v.x = e.x;
      if (v.t === 12) { sfx('block'); hit(v.x - 22, v.y - 50, 44, 52, dmg, { ky: 0, kx: 0, stun: 50, status: { freeze: 50 }, srcX: v.x }); }
      if (v.t === 24 || v.t === 32) hit(v.x - 22, v.y - 50, 44, 52, dmg, { ky: 0, kx: 0, stun: 30, srcX: v.x });
      if (v.t === 44) { sfx('heavy'); fx.shake(5, 10); hit(v.x - 24, v.y - 52, 48, 54, dmg * 2, { ky: -6, stun: 40, heavy: true, srcX: v.x }); }
    }));
  });
  ULT.chain_prison = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(BRASS[1], 8); sfx('roar'); }
    // the chains (the user: "for tarek ult show the chains", then "multiple chains locking in different angle"): eight
    // chains shoot in one after another from the arena's edges, ceiling and floor, each hooks a different point of the
    // body, they rattle on every hit and pull taut for the slam. (They used to be drawn by 1-frame Vis that were removed
    // before they were ever drawn, so nothing showed.)
    // from: where on screen it comes from ([fx, fy] as a share of the screen, or 'f' = the floor beside the target);
    // to: where it locks on, as a share of the body box from its centre
    const LOCKS = [
      { from: [0, 0.35], to: [-0.5, -0.3] }, { from: [1, 0.3], to: [0.5, -0.25] }, { from: [0.22, 0], to: [-0.2, -0.5] }, { from: [0.8, 0], to: [0.25, -0.45] },
      { from: [0, 0.75], to: [-0.45, 0.25] }, { from: [1, 0.8], to: [0.45, 0.3] }, { from: ['f', -70], to: [-0.2, 0.5] }, { from: ['f', 70], to: [0.2, 0.5] }];
    if (p.st === 8) foes.forEach(e => {
      const v = new Vis(0, 0, 999, (ctx, x0, y0, t) => {
        const b = e.box(), sx = Math.round(b.x + b.w / 2 - G.cam.x), sy = Math.round(b.y + b.h / 2 - G.cam.y), H0 = SW.H, gy = Math.round(b.y + b.h - G.cam.y);
        const jig = p.st >= 16 && p.st <= 58 && p.st % 6 < 2 ? 1 : 0, slam = p.st >= 58 ? Math.min(1, (p.st - 58) / 2) : 0;
        let locked = 0;
        LOCKS.forEach((L, i) => {
          const k = Math.min(1, Math.max(0, (t - i * 2) / 6)); if (k <= 0) return;   // one after another, 6 frames each
          const ax = L.from[0] === 'f' ? sx + L.from[1] : Math.round(L.from[0] * W), ay = L.from[0] === 'f' ? gy + 2 : Math.round(L.from[1] * H0 - (L.from[1] > 0.5 ? 0 : slam * 20));
          const tx = sx + Math.round(L.to[0] * (b.w + 4)) + (i % 2 ? jig : -jig), ty = sy + Math.round(L.to[1] * b.h) + jig, hx = Math.round(ax + (tx - ax) * k), hy = Math.round(ay + (ty - ay) * k);
          chainLine(ctx, ax, ay, hx, hy);
          if (k < 1) { art.disc(ctx, BRASS[0], hx, hy, 3); art.rect(ctx, BRASS[1], hx - 1, hy - 1, 2, 2); }   // the hook in flight
          else { locked++; art.disc(ctx, BRASS[0], hx, hy, 2); if (t - i * 2 - 6 < 3) { ctx.globalAlpha = 0.8; art.ring(ctx, BRASS[1], hx, hy, 5); ctx.globalAlpha = 1; } }   // set, with a glint as it bites
        });
        if (locked < LOCKS.length) return;
        // once every hook is set, two loops of chain bind the body tight (links behind it dimmer)
        [-8, 6].forEach((dy, j) => { const rx = b.w / 2 + 4, w0 = t * 0.12 + j * 1.7;
          for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + w0; ctx.globalAlpha = Math.sin(a) < 0 ? 0.45 : 1;
            art.rect(ctx, i % 2 ? BRASS[2] : '#adb5bd', sx + Math.round(Math.cos(a) * rx) - 1, sy + dy + Math.round(Math.sin(a) * 3) + jig, 3, 2); }
          ctx.globalAlpha = 1; });
      });
      v.tick = vv => { if (p.state !== 'ult' || p.dead || e.dead || p.st > 61) vv.gone = true; };
      z.shots.push(v);
    });
    if (every(p, 16, 52, 6)) { sfx('block'); foes.forEach(e => hurt(e, dmg, { ky: 0, kx: 0, stun: 30, status: { freeze: 20 } })); }
    if (p.st === 60) { fx.flash(BRASS[0], 8); fx.shake(12, 18); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.dust(b.x + b.w / 2, b.y + b.h, 12); hurt(e, dmg * 4, { ky: -7, down: true, stun: 50 }); }); }
  };
  TRAITS.reel = {
    hit(p, atk, e) {
      if (!atk.energy || p.reeling || !e || e.dead || Math.abs(e.x - p.x) < 60) return;
      p.reeling = true; try { drag(G.zone, e, p.x, 20); const b = e.box(); part(b.x + b.w / 2, b.y + b.h / 2, BRASS[1], Math.sign(p.x - e.x) * 2, 0, 10, 2); } finally { p.reeling = false; }
    }
  };

  // ================= Isa =================
  const INK = ['#1b1b2f', '#ef476f', '#ffe3ea'];
  const glyphArt = (ctx, x, y, t, a) => { ctx.globalAlpha = a; art.rect(ctx, INK[0], x - 8, y - 2, 16, 2); art.rect(ctx, INK[1], x - 6, y - 3, 12, 1); art.rect(ctx, INK[0], x - 1, y - 6, 2, 4); art.rect(ctx, INK[0], x - 5, y - 5, 3, 1); art.rect(ctx, INK[0], x + 3, y - 5, 3, 1); if ((t >> 4) % 2) art.rect(ctx, INK[2], x - 1, y - 4, 2, 1); ctx.globalAlpha = 1; };
  // a glyph on the floor: bursts the first time an enemy stands on it (three per hero; the oldest goes)
  function glyph(p, z, x) {
    const gy = floorY(z, x, p.y - 20), dmg = Math.max(2, Math.round(8 * p.dmgMul()));
    const mine = z.shots.filter(s => s.isGlyph && s.p === p && !s.gone); if (mine.length >= 3) mine[0].gone = true;
    const g = new Vis(x, gy, 600, (ctx, sx, sy, t) => glyphArt(ctx, sx, sy, t, Math.min(1, t / 10, (600 - t) / 30)), v => {
      if (v.t < 20 || v.done) return;
      const e = z.ents.find(q => isFoe(q) && Math.abs(q.x - v.x) < 16 && Math.abs(q.y - v.y) < 10);
      if (!e) return;
      v.done = true; v.life = v.t + 1; sfx('burst'); fx.ring(v.x, v.y - 8, INK[1], 4, 26, 12);
      for (let i = 0; i < 10; i++) part(v.x + rand(-6, 6), v.y - rand(0, 20), i % 2 ? INK[0] : INK[1], rand(-1.5, 1.5), -rand(1, 3), 20, 2, 0.1);
      hit(v.x - 18, v.y - 44, 36, 46, dmg, { ky: -4, stun: 34, status: { freeze: 30 }, srcX: v.x });
    });
    g.isGlyph = true; g.p = p; z.shots.push(g);
  }
  Object.assign(CASTS, {
    ink_bolt(p, z, dmg, up) {
      sfx('swing'); pose(p, 'a2', 1, 10); glyph(p, z, p.x);
      z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 22, vx: p.face * 8, vy: up ? -4.5 : 0, dmg, w: 12, h: 10, life: 40, kx: 1.4, stun: 22,
        render(ctx, x, y, pr) { const d = Math.sign(pr.vx) || 1; art.disc(ctx, INK[0], x, y, 4); for (let i = 1; i < 4; i++) art.rect(ctx, INK[0], x - d * (i * 4 + 2), y - 1 + (i % 2), 3, 2); art.rect(ctx, INK[1], x, y - 2, 2, 2); },
        onEnd() { for (let i = 0; i < 6; i++) part(this.x, this.y, INK[i % 2], rand(-2, 2), rand(-2, 1), 16, 2, 0.15); } }));
    },
    brush_stroke(p, z, dmg) {
      const dir = p.face; sfx('heavy'); pose(p, 'a4', 1, 16); glyph(p, z, p.x);
      z.shots.push(new Vis(p.x, p.y, 16, (ctx, x, y, t) => { const k = Math.min(1, t / 5); ctx.globalAlpha = Math.min(1, (16 - t) / 6); for (let i = 0; i <= 14 * k; i++) { const a = -1.2 + i * 0.17, r = 46; art.rect(ctx, i % 3 ? INK[0] : INK[1], Math.round(x + dir * (8 + Math.cos(a) * r)) - 3, Math.round(y - 20 + Math.sin(a) * r) - 3, 6, 6); } ctx.globalAlpha = 1; }));
      hit(...front(p, 70, 70, 10), dmg, { kx: dir * 4, ky: -3, stun: 34, heavy: true, srcX: p.x });
    },
    seal_circle(p, z, dmg) {
      // cancelled out of a combo, the seal is drawn under whoever is being hit (76 px ahead was past the target, every time)
      const lk = (q => (q && (fighterOf(q) ? fighterOf(q).p : q).state === 'hurt' ? q : null))(ahead(p, z, 140)); 
      const x = lk ? lk.x : p.x + p.face * 76, gy = floorY(z, x, p.y - 20), hs = new Set(); sfx('charge'); pose(p, 'cast', 1, 18); glyph(p, z, p.x);
      z.shots.push(new Vis(x, gy, 60, (ctx, sx, sy, t) => {
        const k = Math.min(1, t / 14), r = Math.round(30 * k); ctx.globalAlpha = 0.85;
        for (let i = 0; i < 20 * k; i++) { const a = i / 20 * Math.PI * 2; art.rect(ctx, INK[0], sx + Math.round(Math.cos(a) * r) - 1, sy - 2 + Math.round(Math.sin(a) * r * 0.25), 3, 2); }
        art.rect(ctx, INK[1], sx - 2, sy - 3, 4, 2); ctx.globalAlpha = 1;
        if (t >= 18 && t < 50) for (let i = -2; i <= 2; i++) { const hh = Math.round(30 + Math.abs(Math.sin(t * 0.5 + i)) * 20); art.rect(ctx, i % 2 ? INK[1] : INK[0], sx + i * 10 - 1, sy - hh, 3, hh); }
      }, v => { if (lk && !lk.dead && v.t < 18) v.x = lk.x;   // the ink follows them until it wakes
        if (v.t >= 18 && v.t <= 45 && (v.t - 18) % 9 === 0) { hs.clear(); sfx('swing'); hit(v.x - 30, v.y - 54, 60, 56, dmg, { ky: v.t === 45 ? -6 : -1, kx: 0, stun: 28, hitSet: hs, srcX: v.x, breaker: v.t === 45, heavy: v.t === 45 }); } }));
    }
  });
  N.burst('isa', 'binding_script', 'Binding Script', 7, 'Lines of script wrap around the nearest enemy and hold them, then every letter bursts.', (p, z, dmg) => {
    const e = nearest(z, p.x, p.y - 16, 240); sfx('perfect'); pose(p, 'cast', 1, 20);
    const tg = e || { x: p.x + p.face * 80, y: p.y };
    z.shots.push(new Vis(tg.x, tg.y, 60, (ctx, x, y, t) => {
      for (let i = 0; i < 8; i++) { const a = t * 0.15 + i * 0.785, r = 18, lx = x + Math.round(Math.cos(a) * r), ly = y - 20 + Math.round(Math.sin(a) * 8) - i * 3; art.rect(ctx, INK[0], lx - 2, ly - 2, 4, 4); art.rect(ctx, INK[1], lx - 1, ly - 1, 2, 1); }
    }, v => {
      if (e && !e.dead) { v.x = e.x; v.y = e.y; }
      if (v.t === 6) hit(v.x - 18, v.y - 46, 36, 48, Math.round(dmg * 0.5), { ky: 0, kx: 0, stun: 60, status: { freeze: 70 }, srcX: v.x });
      if (v.t >= 30 && v.t <= 54 && (v.t - 30) % 8 === 0) { sfx('burst'); fx.ring(v.x + rand(-10, 10), v.y - 20 + rand(-14, 14), INK[1], 3, 14, 8); hit(v.x - 20, v.y - 48, 40, 50, dmg, { ky: v.t === 54 ? -6 : -0.5, kx: 0, stun: 28, srcX: v.x, heavy: v.t === 54 }); }
    }));
  });
  ULT.final_word = (p, z, foes, dmg) => {
    if (p.st === 6) {
      fx.flash(INK[2], 8); sfx('perfect');
      z.shots.push(new Vis(0, 0, 62, (ctx, x, y, t) => {
        const k = Math.min(1, t / 26), fall = t > 44 ? (t - 44) * 12 : 0, cx = W / 2, cy = 50 + fall;
        const strokes = [[-60, -20, 60, -20], [0, -40, 0, 40], [-50, 10, -10, 30], [50, 10, 10, 30], [-40, 40, 40, 40]];
        strokes.forEach((s, i) => { const kk = SW.clamp(k * strokes.length - i, 0, 1); if (!kk) return; const n = 16; for (let j = 0; j <= n * kk; j++) { const q = j / n; art.rect(ctx, INK[0], Math.round(cx + s[0] + (s[2] - s[0]) * q) - 4, Math.round(cy + s[1] + (s[3] - s[1]) * q) - 4, 9, 9); } });
        if (k >= 1) art.rect(ctx, INK[1], cx + 50, cy - 46, 14, 14);
      }));
    }
    if (every(p, 12, 40, 7)) { sfx('swing'); foes.forEach(e => hurt(e, dmg, { ky: -1, stun: 30 })); }
    if (p.st === 54) { fx.flash(INK[1], 10); fx.shake(14, 20); sfx('explode'); foes.forEach(e => { const b = e.box(); for (let i = 0; i < 14; i++) part(b.x + b.w / 2, b.y + b.h, i % 2 ? INK[0] : INK[1], rand(-4, 4), -rand(1, 4), 24, 3, 0.15); hurt(e, dmg * 5, { ky: -7, down: true, stun: 50 }); }); }
  };
  TRAITS.glyph = { mark(ctx, p, x, y) { const n = G.zone ? G.zone.shots.filter(s => s.isGlyph && s.p === p && !s.gone).length : 0; if (n) pips(ctx, x, y - 50, n, 3, INK[1]); } };

  // ================= Garo =================
  const STEEL = ['#8d99ae', '#edf2f4', '#2b2d42'];
  const wheel = (ctx, x, y, r, t) => { for (let i = 0; i < 4; i++) { const a = t * 0.6 + i * Math.PI / 2; art.line(ctx, STEEL[0], x, y, x + Math.round(Math.cos(a) * r), y + Math.round(Math.sin(a) * r), 4); art.line(ctx, STEEL[1], x, y, x + Math.round(Math.cos(a) * r * 0.8), y + Math.round(Math.sin(a) * r * 0.8), 1); } art.disc(ctx, STEEL[2], x, y, Math.max(2, Math.round(r / 4))); art.disc(ctx, STEEL[1], x, y, 1); };
  // a wheel that flies out `out` frames, then homes back to Garo; caught: +10 energy (his trait)
  function boomerang(p, z, o) {
    const hs = new Set();
    z.shots.push(new Proj(Object.assign({ x: p.x + p.face * 18, y: p.y - 24, vx: p.face * 7, dmg: o.dmg, w: 26, h: 26, life: 90, ghost: true, pierce: true, rehit: 0, kx: 2, ky: -2, stun: 26, r: 13, back: false, hitSet: hs,
      render(ctx, x, y, pr) { wheel(ctx, x, y, pr.r, pr.t); },
      think() {
        if (this.t % 4 === 0) sfx('swing');
        if (!this.back && this.t >= o.out) { this.back = true; this.hitSet.clear(); }
        if (this.back) { const dx = p.x - this.x, dy = p.y - 24 - this.y, m = Math.hypot(dx, dy) || 1; this.vx = dx / m * 7.5; this.vy = dy / m * 7.5; this.kx = Math.sign(dx) * -2;
          if (m < 14 && !p.dead) { this.gone = true; refund(p, 10); fx.ring(p.x, p.y - 24, STEEL[1], 4, 18, 10); sfx('block'); } }
        else if (o.roll) { this.vy = 0; }
      } }, o.extra || {})));
  }
  Object.assign(CASTS, {
    wheel_throw(p, z, dmg) { sfx('heavy'); pose(p, 'a4', 1, 12); boomerang(p, z, { dmg, out: 22 }); },
    iron_guard(p, z, dmg) {
      const dir = p.face; sfx('block');
      z.shots.push(new Drive(p, 30, t => {
        p.vx = 0; p.iframes = Math.max(p.iframes, 2); p.pose = ['guard', 0];
        z.shots.push(new Vis(p.x, p.y, 1, (ctx, x, y) => wheel(ctx, x + dir * 14, y - 22, 16, 0)));
        const of = G.scene === 'vs' && V.f ? V.f.find(f => f.p && f.p !== p) : null;
        (of ? of.shots : z.shots.filter(s => s.team === 'enemy')).forEach(s => { if (s.dmg !== undefined && s.x !== undefined && !s.isPuppet && !s.isClone && !s.isGlyph && Math.hypot(s.x - p.x - dir * 14, s.y - p.y + 22) < 40) { s.gone = true; fx.spark(s.x, s.y, STEEL[1], 4, 1.5); } });
      }, () => { sfx('heavy'); fx.shake(4, 8); fx.slash(p.x + dir * 20, p.y - 22, dir, 3, STEEL[1], 50); hit(...front(p, 52, 50, 4), dmg, { kx: dir * 7, ky: -3, stun: 36, heavy: true, srcX: p.x }); }));
    },
    grind_wheel(p, z, dmg) {
      sfx('heavy'); pose(p, 'sweep', 1, 12); const gy = floorY(z, p.x, p.y - 20);
      boomerang(p, z, { dmg, out: 34, roll: true, extra: { y: gy - 14, vx: p.face * 3.6, rehit: 7, r: 14, breaker: true, kx: 1, ky: -1, stun: 18, life: 120,
        think() {
          if (this.t % 3 === 0) fx.spark(this.x, this.y + 12, '#ffd166', 2, 1.5);
          if (!this.back && this.t >= 34) { this.back = true; this.hitSet.clear(); this.vx = -this.vx * 1.4; }
          if (this.back) { if (Math.abs(p.x - this.x) < 14 && !p.dead) { this.gone = true; refund(p, 10); fx.ring(p.x, p.y - 24, STEEL[1], 4, 18, 10); sfx('block'); } else this.vx = Math.sign(p.x - this.x) * Math.abs(this.vx); }
        } } });
    }
  });
  N.burst('garo', 'meteor_wheel', 'Meteor Wheel', 20, 'Leap and hurl the shuriken down at the floor ahead. It bursts on impact, then flies back to you.', (p, z, dmg) => {
    const dir = p.face; sfx('jump'); p.vy = -7.5; p.onGround = false; p.y -= 1; p.pose = ['jump', 0];
    z.shots.push(new Later(10, (g, zz) => {
      if (p.dead) return; sfx('heavy'); pose(p, 'air', 1, 12);
      zz.shots.push(new Proj({ x: p.x + dir * 12, y: p.y - 20, vx: dir * 5, vy: 7, dmg: Math.round(dmg * 0.5), w: 28, h: 28, life: 50, kx: 2, ky: 2, stun: 26, render(ctx, x, y, pr) { wheel(ctx, x, y, 15, pr.t); },
        onEnd(gg, z2) { boom(this.x, this.y - 6, 44, dmg, STEEL[1], null, { ky: -6, stun: 40, breaker: true }); fx.dust(this.x, this.y, 10); boomerang(p, z2, { dmg: Math.round(dmg * 0.4), out: 0, extra: { x: this.x, y: this.y - 10, vx: 0 } }); } }));
    }));
  });
  ULT.thousand_wheels = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(STEEL[1], 8); sfx('roar'); }
    if (p.st >= 8 && p.st <= 50 && p.st % 3 === 0) { const d = (p.st / 3) % 2 ? 1 : -1, y = p.y - 10 - ((p.st * 37) % 90); z.shots.push(new Vis(G.cam.x + (d > 0 ? -20 : W + 20), y, 60, (ctx, x, yy, t) => wheel(ctx, x + d * t * 10, yy, 10, t))); }
    if (every(p, 12, 48, 6)) { sfx('swing'); foes.forEach(e => hurt(e, dmg, { ky: -1.5, stun: 30 })); }
    if (p.st === 52) z.shots.push(new Vis(0, 0, 14, (ctx, x, y, t) => wheel(ctx, W / 2, Math.round(-40 + t * 14), 50, t)));
    if (p.st === 64) { fx.flash('#ffffff', 10); fx.shake(14, 20); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.debris(b.x + b.w / 2, b.y + b.h, STEEL[0], 12); hurt(e, dmg * 5, { ky: -7, down: true, stun: 50 }); }); }
  };
  TRAITS.return = {};

  // ================= Mika =================
  const MOON = ['#b8c0ff', '#ffffff', '#3d348b'];
  const crescent = (ctx, x, y, t, s) => { s = s || 1; for (let i = -6; i <= 6; i++) { const a = t * 0.5 + i * 0.22, r = 7 * s; art.rect(ctx, Math.abs(i) < 3 ? MOON[1] : MOON[0], x + Math.round(Math.cos(a) * r), y + Math.round(Math.sin(a) * r), 2, 2); } };
  Object.assign(CASTS, {
    crescent_toss(p, z, dmg) {
      sfx('swing'); pose(p, 'a4', 1, 10); const dir = p.face;
      [-1, 1].forEach(s => z.shots.push(new Proj({ x: p.x + dir * 12, y: p.y - 22, vx: dir * 7, vy: s * 2.2, dmg, w: 14, h: 14, life: 44, ghost: true, pierce: true, maxHits: 2, kx: 1, stun: 22,
        render(ctx, x, y, pr) { crescent(ctx, x, y, pr.t); }, think() { this.vx -= dir * 0.32; this.vy -= s * 0.1; if (this.t === 22) this.hitSet.clear(); if (this.t > 26 && Math.abs(this.x - p.x) < 12) this.gone = true; } })));
    },
    moon_vault(p, z, dmg) {
      const dir = p.face, hs = new Set(); sfx('jump'); p.vy = -8; p.onGround = false; p.y -= 1;
      z.shots.push(new Drive(p, 22, t => {
        p.vx = 0; slide(p, z, dir, 4); if (t > 4 && p.onGround) return false;
        p.pose = [t % 6 < 3 ? 'air' : 'jump', t % 6 < 3 ? 1 : 0];
        if (t % 4 === 0) fx.ghost(p.sheet(), 'air', 1, p.x, p.y, dir < 0);
        hit(p.x - 26, p.y - 20, 52, 50, dmg, { kx: dir * 1.5, ky: 3, stun: 30, hitSet: hs, srcX: p.x });
        if (t === 10) fx.slash(p.x, p.y + 6, dir, 3, MOON[1], 50);
      }));
    },
    twin_orbit(p, z, dmg) {
      z.shots.forEach(s => { if (s.isOrbit && s.p === p) s.gone = true; }); sfx('charge');
      const hs = new Set(), o = new Vis(p.x, p.y, 180, (ctx, x, y, t) => { [0, Math.PI].forEach(ph => { const a = t * 0.2 + ph, px = Math.round(p.x - G.cam.x + Math.cos(a) * 28), py = Math.round(p.y - G.cam.y - 20 + Math.sin(a) * 12); crescent(ctx, px, py, t); art.glow(ctx, px, py, 8, MOON[0], 0.15); }); },
        v => { if (p.dead || p.state === 'hurt' && v.t > 20) { v.gone = true; return; } if (v.t % 10 === 0) hs.clear(); hit(p.x - 34, p.y - 40, 68, 44, dmg, { kx: 0, ky: -1.5, stun: 18, hitSet: hs, srcX: p.x }); });
      o.isOrbit = true; o.p = p; z.shots.push(o);
    }
  });
  N.burst('mika', 'lunar_dive', 'Lunar Dive', 6, 'Leap above the nearest enemy and spin down through them, cutting four times.', (p, z, dmg) => {
    const e = nearest(z, p.x, p.y - 16, 240), hs = new Set(); sfx('jump'); p.vy = -9; p.onGround = false; p.y -= 1; p.pose = ['jump', 0];
    z.shots.push(new Drive(p, 50, t => {
      p.iframes = Math.max(p.iframes, 2);
      if (t < 12) { p.vx = 0; if (e && !e.dead) slide(p, z, Math.sign(e.x - p.x) || 1, Math.min(6, Math.abs(Math.round(e.x - p.x)))); return; }
      p.vx = 0; p.vy = 7; p.pose = [t % 4 < 2 ? 'air' : 'a3', 1];
      if (t % 4 === 0) { hs.clear(); sfx('swing'); fx.slash(p.x, p.y - 16, t % 8 ? 1 : -1, 1 + (t % 3), MOON[1], 36); }
      hit(p.x - 22, p.y - 40, 44, 46, dmg, { kx: 0, ky: 1.5, stun: 26, hitSet: hs, srcX: p.x });
      if (p.onGround && t > 13) return false;
    }, () => { sfx('heavy'); fx.ring(p.x, p.y - 4, MOON[0], 4, 40, 12); hit(p.x - 36, p.y - 30, 72, 32, dmg * 2, { ky: -6, stun: 40, heavy: true, srcX: p.x }); }));
  });
  ULT.moonfall = (p, z, foes, dmg) => {
    if (p.st === 6) { sfx('perfect'); z.shots.push(new Vis(0, 0, 66, (ctx, x, y, t) => { const k = Math.min(1, t / 14); ctx.globalAlpha = 0.35 * k; art.rect(ctx, MOON[2], 0, 0, W, SW.H); ctx.globalAlpha = 1; art.disc(ctx, MOON[1], 120, Math.round(70 - 30 * k), 18); art.disc(ctx, MOON[0], W - 120, Math.round(70 - 30 * k), 14); })); }
    if (every(p, 14, 54, 8)) { const d = ((p.st - 14) / 8) % 2 ? -1 : 1; sfx('swing'); foes.forEach(e => { const b = e.box(); fx.list.push({ k: 'b', pts: [[G.cam.x + (d > 0 ? 0 : W), b.y + b.h / 2 + rand(-20, 20)], [G.cam.x + (d > 0 ? W : 0), b.y + b.h / 2 + rand(-20, 20)]], col: MOON[1], life: 10, max: 10 }); fx.ghost(p.sheet(), 'a3', 1, b.x + b.w / 2 + d * 24, b.y + b.h, d < 0); hurt(e, dmg, { kx: d * 1.5, ky: -2, stun: 30 }); }); }
    if (p.st === 62) { fx.flash(MOON[1], 10); fx.shake(10, 16); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.ring(b.x + b.w / 2, b.y + b.h / 2, MOON[0], 4, 50, 14); hurt(e, dmg * 5, { ky: -7, down: true, stun: 50 }); }); }
  };
  TRAITS.moonstep = {
    dmg(p) { return p.onGround ? 1 : 1.25; },
    hit(p) { if (!p.onGround) { p.airJumps = 0; p.airDash = false; } }
  };

  // ================= Oda =================
  const BRONZE = ['#bc6c25', '#fefae0', '#6f4518'];
  const bell = (ctx, x, y, s) => { const w = Math.round(14 * s), h = Math.round(22 * s); art.rect(ctx, BRONZE[2], x - Math.round(w * 0.5), y - h, w, Math.round(h * 0.2)); art.rect(ctx, BRONZE[0], x - Math.round(w * 0.7), y - Math.round(h * 0.8), Math.round(w * 1.4), Math.round(h * 0.65)); art.rect(ctx, BRONZE[0], x - w, y - Math.round(h * 0.2), w * 2, Math.round(h * 0.2)); art.rect(ctx, '#dda15e', x - Math.round(w * 0.5), y - Math.round(h * 0.7), Math.max(1, Math.round(2 * s)), Math.round(h * 0.4)); art.rect(ctx, BRONZE[2], x - w, y - 2, w * 2, 2); };
  const ringWave = (ctx, x, y, r, col) => { for (let j = -10; j <= 10; j += 2) { const yy = Math.round(j * r / 14); art.rect(ctx, col, x + Math.round(Math.sqrt(Math.max(0, 100 - j * j)) * r / 14), y + yy, 2, 2); art.rect(ctx, col, x - Math.round(Math.sqrt(Math.max(0, 100 - j * j)) * r / 14), y + yy, 2, 2); } };
  Object.assign(CASTS, {
    toll_wave(p, z, dmg) {
      sfx('block'); pose(p, 'a2', 1, 12);
      z.shots.push(new Proj({ x: p.x + p.face * 16, y: p.y - 22, vx: p.face * 4.6, dmg, w: 16, h: 20, life: 40, ghost: true, pierce: true, maxHits: 2, kx: 3.5, ky: -2, stun: 28,
        render(ctx, x, y, pr) { const r = 8 + pr.t * 0.4; ringWave(ctx, x, y, r, pr.t % 4 < 2 ? BRONZE[1] : BRONZE[0]); ringWave(ctx, x - Math.sign(pr.vx) * 6, y, r * 0.7, BRONZE[0]); },
        think() { this.w = 16 + this.t * 0.8; this.h = 20 + this.t * 0.8; } }));
    },
    bell_drop(p, z, dmg) {
      const e = ahead(p, z, 170) || nearest(z, p.x, p.y - 16, 100), x0 = e ? e.x : p.x + p.face * 80, gy = floorY(z, x0, p.y - 20); sfx('charge'); pose(p, 'cheer', 0, 16);
      z.shots.push(new Vis(x0, gy, 56, (ctx, x, y, t) => { const yy = t < 12 ? -140 + Math.round(t * t * 0.97) : 0, sh = [20, 36].some(s => t >= s && t < s + 4) ? Math.round(rand(-2, 2)) : 0; ctx.globalAlpha = t > 48 ? (56 - t) / 8 : 1; bell(ctx, x + sh, y + yy, 2.2); ctx.globalAlpha = 1; },
        v => {
          if (v.t === 12) { sfx('heavy'); fx.shake(6, 10); fx.dust(v.x, v.y, 8); hit(v.x - 26, v.y - 50, 52, 52, Math.round(dmg * 0.6), { ky: 0, kx: 0, stun: 50, status: { freeze: 46 }, srcX: v.x }); }
          if (v.t === 20 || v.t === 36) { sfx('block'); fx.ring(v.x, v.y - 24, BRONZE[1], 10, 46, 12); hit(v.x - 28, v.y - 52, 56, 54, dmg, { ky: v.t === 36 ? -6 : 0, kx: 0, stun: 34, heavy: v.t === 36, srcX: v.x }); }
        }));
    },
    resonance(p, z, dmg) {
      sfx('charge'); const gy = floorY(z, p.x, p.y - 20);
      z.shots.push(new Drive(p, 36, t => {
        p.vx = 0; p.pose = [t % 12 < 6 ? 'a3' : 'sweep', 1];
        if (t % 12 !== 6) return;
        const k = t / 12 | 0; sfx('explode'); fx.shake(4, 8); fx.dust(p.x, p.y, 6);
        [-1, 1].forEach(d => z.shots.push(new Proj({ x: p.x + d * 10, y: gy - 14, vx: d * 5, dmg, w: 18, h: 28, life: 26, ghost: true, pierce: true, maxHits: 2, kx: 3, ky: -2, stun: 24, breaker: k === 2,
          render(ctx, x, y, pr) { ringWave(ctx, x, y, 8 + pr.t * 0.3, pr.t % 4 < 2 ? BRONZE[1] : BRONZE[0]); } })));
      }));
    }
  });
  N.burst('oda', 'thunder_toll', 'Thunder Toll', 22, 'Strike the bell right in the enemy\'s face: a blast of sound that throws them back and leaves them reeling.', (p, z, dmg) => {
    const dir = p.face; sfx('charge'); p.pose = ['charge', 0];
    z.shots.push(new Drive(p, 12, t => { p.vx = 0; p.pose = t < 8 ? ['charge', t % 2] : ['a2', 1]; z.shots.push(new Vis(p.x + dir * 18, p.y - 6, 1, (ctx, x, y) => bell(ctx, x, y, 1.2))); }, () => {
      sfx('explode'); sfx('block'); fx.shake(9, 16); fx.flash(BRONZE[1], 5);
      for (let i = 0; i < 4; i++) fx.ring(p.x + dir * 24, p.y - 22, i % 2 ? BRONZE[1] : BRONZE[0], 6 + i * 4, 40 + i * 14, 12 + i * 3);
      hit(...front(p, 60, 56, 4), dmg, { kx: dir * 8, ky: -4, stun: 44, heavy: true, breaker: true, down: true, status: { freeze: 40 }, srcX: p.x - dir * 10 });
    }));
  });
  ULT.last_toll = (p, z, foes, dmg) => {
    if (p.st === 6) { fx.flash(BRONZE[1], 8); sfx('roar'); z.shots.push(new Vis(0, 0, 66, (ctx, x, y, t) => { const yy = Math.round(Math.min(1, t / 12) * 110), sw = Math.round(Math.sin(t * 0.3) * 4); bell(ctx, W / 2 + sw, yy, 5); })); }
    [18, 30, 42, 58].forEach((s, k) => {
      if (p.st !== s) return;
      sfx('block'); sfx('explode'); fx.shake(8 + k * 2, 14); for (let i = 0; i < 3; i++) fx.ring(G.cam.x + W / 2, G.cam.y + 80, i % 2 ? BRONZE[1] : BRONZE[0], 20 + i * 10, 260, 18);
      foes.forEach(e => hurt(e, dmg * (k === 3 ? 4 : 1), { ky: k === 3 ? -7 : -2, down: k === 3, stun: 40 }));
    });
  };
  TRAITS.ring = {
    after(p, atk, r) {
      if (r !== 'perfect') return;
      p.cd = {}; sfx('block'); fx.ring(p.x, p.y - 20, BRONZE[1], 6, 46, 14); fx.ring(p.x, p.y - 20, BRONZE[0], 12, 60, 18);
      const e = nearest(G.zone, p.x, p.y - 16, 90); if (e && !e.dead) e.vx = (Math.sign(e.x - p.x) || p.face) * 6;
    }
  };

  // ================= sprites =================
  Object.assign(RIG, {
    ume:   { head: 'bun', c: { skin: '#f0d0b0', hair: '#38b000', top: '#2d6a4f', arm: '#2d6a4f', fore: '#9ef01a', hand: '#f0d0b0', pants: '#1b4332', boots: '#c77dff', belt: '#c77dff', chest: '#efffd0', trail: '#38b000' }, trailLen: 3 },
    tarek: { head: 'bandana', c: { skin: '#b07850', hair: '#2a1a10', acc: '#6c757d', top: '#3a2e1a', arm: '#3a2e1a', fore: '#c9a227', hand: '#b07850', pants: '#2a2418', boots: '#1a140c', belt: '#c9a227', chest: '#fff1c1', trail: '#6c757d' }, weapon: 'tanto', trailLen: 3 },
    isa:   { head: 'knot', weapon: 'staff', c: { skin: '#f4dccc', hair: '#14141e', top: '#f4f1ea', arm: '#f4f1ea', fore: '#14141e', hand: '#f4dccc', pants: '#e4dfd2', boots: '#14141e', belt: '#ef476f', chest: '#ef476f', trail: '#ef476f' }, trailLen: 4 },
    garo:  { head: 'helmet', sc: 1.12, limb: 4, bulk: 10, c: { skin: '#c89070', hair: '#4a4e5a', glow: '#edf2f4', top: '#4a4e5a', arm: '#4a4e5a', fore: '#8d99ae', hand: '#c89070', pants: '#2b2d42', boots: '#1a1c28', belt: '#edf2f4', chest: '#8d99ae' }, shield: 1 },
    mika:  { head: 'ponytail', weapon: 'tanto', armed: 1, c: { skin: '#f0d8c8', hair: '#e8ecff', top: '#3d348b', arm: '#3d348b', fore: '#b8c0ff', hand: '#f0d8c8', pants: '#2a2460', boots: '#b8c0ff', belt: '#ffffff', chest: '#b8c0ff', trail: '#e8ecff' }, trailHead: 1, trailLen: 5 },
    oda:   { head: 'bald', sc: 1.08, limb: 4, bulk: 9, c: { skin: '#c08860', hair: '#c08860', acc: '#6f4518', top: '#bc6c25', arm: '#c08860', fore: '#c08860', hand: '#c08860', pants: '#6f4518', boots: '#3a2410', belt: '#fefae0', chest: '#fefae0', trail: '#bc6c25' }, trailLen: 4, trailW: 3 }
  });
  Object.assign(BORROW, { ume: 'pyra', tarek: 'vesper', isa: 'nyra', garo: 'brakk', mika: 'gale', oda: 'brakk' });
  N.portraits(NEW);

  // Versus balance (see ninjas1.js): fitted against the fifteen regular heroes. Untuned they won 33-67%; with this table about 44-54%.
  if (V && V.tune) Object.assign(V.tune, { ume: 1.15, tarek: 1.15, isa: 1.15, garo: 0.9, mika: 0.85, oda: 1.45 });   // re-solved 2026-11-15 (see js/versus.js)

  // ================= translations =================
  const ES = {
    'The Poison Garden': 'El Jardín Venenoso', 'Spores': 'Esporas', 'Blight': 'Plaga', 'Everything she grows is beautiful.': 'Todo lo que cultiva es precioso.', 'Do not touch any of it.': 'No toques nada.',
    'Spore Puff': 'Nube de Esporas', 'A slow cloud of spores drifts forward. Your skill hits stack Blight, up to five: each stack drains 1 health a second for four seconds.': 'Una lenta nube de esporas avanza flotando. Tus golpes de habilidad acumulan Plaga, hasta cinco: cada carga quita 1 de salud por segundo durante cuatro segundos.',
    'Vine Snap': 'Latigazo de Enredadera', 'A vine whips up out of the ground ahead, catches the enemy and lifts them.': 'Una enredadera brota del suelo delante de ti, atrapa al enemigo y lo levanta.',
    'Bloom Field': 'Campo en Flor', 'Plant three flowers ahead of you. They open a moment later and puff spores for a few seconds.': 'Plantas tres flores delante de ti. Se abren un momento después y sueltan esporas durante unos segundos.',
    'Corpse Flower': 'Flor Cadáver', 'A giant flower opens under the nearest enemy and snaps shut on them three times.': 'Una flor gigante se abre bajo el enemigo más cercano y se cierra sobre él tres veces.',
    'Sap Rush': 'Savia Veloz', 'Full Bloom': 'Plena Floración', 'Last Spring': 'Última Primavera',
    'The Long Chain': 'La Cadena Larga', 'Chain sickle': 'Hoz y cadena', 'Reel': 'Arrastre', 'He never has to come to you.': 'Él nunca tiene que ir hacia ti.', 'You always come to him.': 'Siempre eres tú quien va hacia él.',
    'Chain Lash': 'Latigazo de Cadena', 'Throw the weighted end of your chain a long way and snap it back. Skill hits from a few steps away reel the enemy toward you.': 'Lanzas lejos el extremo con peso de tu cadena y lo recoges de golpe. Los golpes de habilidad desde unos pasos de distancia arrastran al enemigo hacia ti.',
    'Hook Pull': 'Tirón de Gancho', 'Hook the nearest enemy ahead with the sickle, yank them to your feet and knee them into the air.': 'Enganchas con la hoz al enemigo más cercano delante de ti, lo arrastras hasta tus pies y lo lanzas al aire de un rodillazo.',
    'Iron Cyclone': 'Ciclón de Hierro', 'Swing the chain around you in a wide circle while you walk forward. Smashes cracked walls.': 'Haces girar la cadena a tu alrededor en un amplio círculo mientras avanzas. Rompe muros agrietados.',
    'Chain Drop': 'Caída de Cadena', 'Throw the chain high; it falls in a loop around the nearest enemy, binds them, and pulls tight.': 'Lanzas la cadena muy alto; cae en un lazo alrededor del enemigo más cercano, lo ata y se aprieta.',
    'Long Reach': 'Largo Alcance', 'Iron Coil': 'Espiral de Hierro', 'Chain Prison': 'Prisión de Cadenas',
    'The Ink Scholar': 'La Erudita de Tinta', 'Ink': 'Tinta', 'Glyph': 'Glifo', 'Every word she writes': 'Cada palabra que escribe', 'is a door she can slam.': 'es una puerta que puede cerrar de golpe.',
    'Ink Bolt': 'Proyectil de Tinta', 'Flick a bolt of ink from your brush. Every U, S+U and I leaves a glyph on the floor that bursts when an enemy steps on it (three at most).': 'Lanzas un proyectil de tinta con el pincel. Cada U, S+U e I deja en el suelo un glifo que estalla cuando lo pisa un enemigo (tres como máximo).',
    'Brush Stroke': 'Trazo de Pincel', 'One great stroke of the brush cuts a wide arc in front of you.': 'Un gran trazo de pincel corta un amplio arco delante de ti.',
    'Seal Circle': 'Círculo de Sello', 'Draw a seal on the floor ahead. It wakes a moment later and strikes four times. Smashes cracked walls.': 'Dibujas un sello en el suelo delante de ti. Despierta un momento después y golpea cuatro veces. Rompe muros agrietados.',
    'Binding Script': 'Escritura Atadora', 'Lines of script wrap around the nearest enemy and hold them, then every letter bursts.': 'Líneas de escritura envuelven al enemigo más cercano y lo retienen; luego cada letra estalla.',
    'Wet Ink': 'Tinta Fresca', 'Grand Script': 'Gran Caligrafía', 'The Final Word': 'La Última Palabra',
    'The Iron Wheel': 'La Rueda de Hierro', 'Giant shuriken': 'Shuriken gigante', 'Return': 'Retorno', 'He throws it once.': 'Lo lanza una vez.', 'It hits you twice.': 'Te golpea dos veces.',
    'Wheel Throw': 'Lanzamiento de Rueda', 'Hurl your giant shuriken. It flies out, comes back, and hits on both ways. Catching it gives back 10 energy.': 'Lanzas tu shuriken gigante. Sale volando, vuelve y golpea a la ida y a la vuelta. Atraparlo te devuelve 10 de energía.',
    'Iron Guard': 'Guardia de Hierro', 'Hold the shuriken in front of you as a wall: nothing gets through for half a second, then you shove it forward.': 'Sostienes el shuriken delante como un muro: nada pasa durante medio segundo, y luego lo empujas hacia delante.',
    'Grind Wheel': 'Rueda Trituradora', 'Roll the shuriken along the floor. It grinds whatever it meets and rolls back to you. Smashes cracked walls.': 'Haces rodar el shuriken por el suelo. Tritura lo que encuentra y vuelve rodando hacia ti. Rompe muros agrietados.',
    'Meteor Wheel': 'Rueda Meteoro', 'Leap and hurl the shuriken down at the floor ahead. It bursts on impact, then flies back to you.': 'Saltas y lanzas el shuriken contra el suelo delante de ti. Estalla al impactar y luego vuelve volando hacia ti.',
    'Iron Will': 'Voluntad de Hierro', 'Iron Mountain': 'Montaña de Hierro', 'A Thousand Wheels': 'Mil Ruedas',
    'The Twin Moons': 'Las Lunas Gemelas', 'Twin blades': 'Hojas gemelas', 'Moonstep': 'Paso Lunar', 'She has not touched the ground': 'No ha tocado el suelo', 'since the fight began.': 'desde que empezó la pelea.',
    'Crescent Toss': 'Lanzamiento Creciente', 'Throw both blades in a cross; they curve back to your hands. Hits in the air deal 25% more and give your air jumps back.': 'Lanzas las dos hojas en cruz; vuelven curvándose a tus manos. Los golpes en el aire hacen un 25% más y te devuelven los saltos aéreos.',
    'Moon Vault': 'Salto Lunar', 'Somersault up and over the enemy, cutting down at them as you pass.': 'Das una voltereta por encima del enemigo y lo cortas desde arriba al pasar.',
    'Twin Orbit': 'Órbita Gemela', 'Two moon blades circle you for three seconds, cutting anything that comes close.': 'Dos hojas lunares giran a tu alrededor durante tres segundos y cortan todo lo que se acerca.',
    'Lunar Dive': 'Picado Lunar', 'Leap above the nearest enemy and spin down through them, cutting four times.': 'Saltas sobre el enemigo más cercano y caes girando a través de él, cortando cuatro veces.',
    'Night Sky': 'Cielo Nocturno', 'Full Moon': 'Luna Llena', 'Moonfall': 'Caída Lunar',
    'The Temple Bell': 'La Campana del Templo', 'Sound': 'Sonido', 'Ring': 'Tañido', 'A monk who took a vow of silence.': 'Un monje que hizo voto de silencio.', 'The bell did not.': 'La campana, no.',
    'Toll Wave': 'Onda de Campanada', 'A ring of sound rolls forward, growing as it goes. A perfect block rings your bell: your skill cooldowns reset and the attacker is thrown back.': 'Un anillo de sonido avanza creciendo a su paso. Un bloqueo perfecto hace sonar tu campana: tus recargas se reinician y el atacante sale despedido.',
    'Bell Drop': 'Caída de Campana', 'A bronze bell drops over the nearest enemy ahead, traps them, and rings twice.': 'Una campana de bronce cae sobre el enemigo más cercano delante de ti, lo atrapa y suena dos veces.',
    'Resonance': 'Resonancia', 'Strike the floor three times; each blow sends rings of sound out both ways. Smashes cracked walls.': 'Golpeas el suelo tres veces; cada golpe lanza anillos de sonido hacia ambos lados. Rompe muros agrietados.',
    'Thunder Toll': 'Campanada Atronadora', 'Strike the bell right in the enemy\'s face: a blast of sound that throws them back and leaves them reeling.': 'Golpeas la campana en la cara del enemigo: una explosión de sonido que lo lanza hacia atrás y lo deja aturdido.',
    'Deep Toll': 'Campanada Profunda', 'Great Bell': 'Gran Campana', 'The Last Toll': 'La Última Campanada'
  };
  const ZH = {
    'The Poison Garden': '毒之花园', 'Spores': '孢子', 'Blight': '枯萎', 'Everything she grows is beautiful.': '她种的一切都很美。', 'Do not touch any of it.': '但一样都别碰。',
    'Spore Puff': '孢子云', 'A slow cloud of spores drifts forward. Your skill hits stack Blight, up to five: each stack drains 1 health a second for four seconds.': '一团孢子云缓缓向前飘去。技能命中会叠加枯萎，最多五层：每层在四秒内每秒扣1点生命。',
    'Vine Snap': '藤鞭', 'A vine whips up out of the ground ahead, catches the enemy and lifts them.': '一根藤蔓从前方地面甩出，缠住敌人并将其挑起。',
    'Bloom Field': '花田', 'Plant three flowers ahead of you. They open a moment later and puff spores for a few seconds.': '在前方种下三朵花。片刻后花开，喷洒孢子数秒。',
    'Corpse Flower': '尸花', 'A giant flower opens under the nearest enemy and snaps shut on them three times.': '一朵巨花在最近的敌人脚下绽放，然后三次合拢咬住他。',
    'Sap Rush': '树液奔涌', 'Full Bloom': '盛放', 'Last Spring': '最后的春天',
    'The Long Chain': '长链', 'Chain sickle': '锁镰', 'Reel': '收链', 'He never has to come to you.': '他从不需要走向你。', 'You always come to him.': '总是你走向他。',
    'Chain Lash': '链击', 'Throw the weighted end of your chain a long way and snap it back. Skill hits from a few steps away reel the enemy toward you.': '把锁链带锤的一端远远甩出再猛地收回。在几步之外命中的技能会把敌人拉向你。',
    'Hook Pull': '钩拉', 'Hook the nearest enemy ahead with the sickle, yank them to your feet and knee them into the air.': '用镰刀钩住前方最近的敌人，拽到脚边，再一记膝撞送上天。',
    'Iron Cyclone': '铁旋风', 'Swing the chain around you in a wide circle while you walk forward. Smashes cracked walls.': '边前进边让锁链在身边大圈旋转。能击碎裂墙。',
    'Chain Drop': '落链', 'Throw the chain high; it falls in a loop around the nearest enemy, binds them, and pulls tight.': '把锁链高高抛起，落下时套住最近的敌人，将其绑住并勒紧。',
    'Long Reach': '长臂', 'Iron Coil': '铁环', 'Chain Prison': '锁链牢笼',
    'The Ink Scholar': '墨之学者', 'Ink': '墨', 'Glyph': '符文', 'Every word she writes': '她写下的每一个字，', 'is a door she can slam.': '都是一扇能猛然关上的门。',
    'Ink Bolt': '墨弹', 'Flick a bolt of ink from your brush. Every U, S+U and I leaves a glyph on the floor that bursts when an enemy steps on it (three at most).': '用笔甩出一道墨弹。每次使用U、S+U和I都会在地上留下一个符文，敌人踩上就会爆开（最多三个）。',
    'Brush Stroke': '一笔', 'One great stroke of the brush cuts a wide arc in front of you.': '大笔一挥，在面前斩出一道宽弧。',
    'Seal Circle': '封印阵', 'Draw a seal on the floor ahead. It wakes a moment later and strikes four times. Smashes cracked walls.': '在前方地上画下封印。片刻后封印苏醒，攻击四次。能击碎裂墙。',
    'Binding Script': '缚字', 'Lines of script wrap around the nearest enemy and hold them, then every letter bursts.': '一行行文字缠住最近的敌人将其定住，然后每个字都爆开。',
    'Wet Ink': '湿墨', 'Grand Script': '大书', 'The Final Word': '终字',
    'The Iron Wheel': '铁轮', 'Giant shuriken': '巨型手里剑', 'Return': '回旋', 'He throws it once.': '他只扔一次。', 'It hits you twice.': '却打你两次。',
    'Wheel Throw': '掷轮', 'Hurl your giant shuriken. It flies out, comes back, and hits on both ways. Catching it gives back 10 energy.': '掷出巨型手里剑。它飞出去再飞回来，来回都会命中。接住时返还10点能量。',
    'Iron Guard': '铁壁', 'Hold the shuriken in front of you as a wall: nothing gets through for half a second, then you shove it forward.': '把手里剑举在身前当墙：半秒内什么都打不进来，然后向前推出。',
    'Grind Wheel': '碾轮', 'Roll the shuriken along the floor. It grinds whatever it meets and rolls back to you. Smashes cracked walls.': '让手里剑沿地面滚动，碾过遇到的一切再滚回你身边。能击碎裂墙。',
    'Meteor Wheel': '流星轮', 'Leap and hurl the shuriken down at the floor ahead. It bursts on impact, then flies back to you.': '跃起把手里剑砸向前方地面。落地时爆开，然后飞回你手中。',
    'Iron Will': '铁意', 'Iron Mountain': '铁山', 'A Thousand Wheels': '千轮',
    'The Twin Moons': '双月', 'Twin blades': '双刃', 'Moonstep': '月步', 'She has not touched the ground': '从战斗开始，', 'since the fight began.': '她的脚就没沾过地。',
    'Crescent Toss': '新月掷', 'Throw both blades in a cross; they curve back to your hands. Hits in the air deal 25% more and give your air jumps back.': '十字形掷出双刃，它们会弧线飞回手中。空中命中伤害提升25%，并恢复空中跳跃次数。',
    'Moon Vault': '月跃', 'Somersault up and over the enemy, cutting down at them as you pass.': '翻身越过敌人头顶，经过时向下斩击。',
    'Twin Orbit': '双轨', 'Two moon blades circle you for three seconds, cutting anything that comes close.': '两把月刃绕身旋转三秒，斩开靠近的一切。',
    'Lunar Dive': '月坠', 'Leap above the nearest enemy and spin down through them, cutting four times.': '跃到最近的敌人上方，旋转着贯穿而下，斩击四次。',
    'Night Sky': '夜空', 'Full Moon': '满月', 'Moonfall': '月落',
    'The Temple Bell': '寺钟', 'Sound': '音', 'Ring': '鸣钟', 'A monk who took a vow of silence.': '一位立下禁语誓言的僧人。', 'The bell did not.': '但钟没有。',
    'Toll Wave': '钟波', 'A ring of sound rolls forward, growing as it goes. A perfect block rings your bell: your skill cooldowns reset and the attacker is thrown back.': '一圈声波向前滚动，越滚越大。完美格挡会敲响你的钟：技能冷却全部重置，攻击者被震退。',
    'Bell Drop': '落钟', 'A bronze bell drops over the nearest enemy ahead, traps them, and rings twice.': '一口铜钟落在前方最近的敌人身上，将其罩住并鸣响两次。',
    'Resonance': '共鸣', 'Strike the floor three times; each blow sends rings of sound out both ways. Smashes cracked walls.': '连击地面三次，每一击都向两侧发出声波。能击碎裂墙。',
    'Thunder Toll': '雷鸣钟', 'Strike the bell right in the enemy\'s face: a blast of sound that throws them back and leaves them reeling.': '对着敌人的脸敲响钟：一股声浪把他震飞，让他头晕目眩。',
    'Deep Toll': '沉钟', 'Great Bell': '大钟', 'The Last Toll': '最后的钟声'
  };
  const ULTS = {
    last_spring: ['las flores se abren por todo el suelo y llenan el aire de esporas; luego estallan todas a la vez.', '花朵在整片地面绽放，孢子弥漫空中，然后同时爆开。'],
    chain_prison: ['las cadenas salen disparadas desde ambos lados de la arena, envuelven a todos y él los estampa contra el suelo.', '锁链从竞技场两侧射出，缠住所有人，他把所有人一起砸向地面。'],
    final_word: ['escribe una palabra enorme en el cielo, y cae sobre todos.', '她在天空写下一个巨大的字，然后它砸向所有人。'],
    thousand_wheels: ['los shuriken cruzan la arena desde todos lados, y luego cae uno del tamaño de una casa.', '手里剑从四面八方飞过竞技场，然后一个房子大小的手里剑砸了下来。'],
    moonfall: ['salen dos lunas, y a su luz ella cruza la arena entera cortando seis veces.', '两轮明月升起，她借着月光六次斩过整个竞技场。'],
    last_toll: ['una campana tan grande como la arena cuelga sobre ella y tañe cuatro veces.', '一口与竞技场一样大的钟悬在上空，鸣响四次。']
  };
  Object.keys(ULTS).forEach(id => { const en = D.abilities[id].desc.replace(/^Ultimate: /, '').replace(/ Costs all three bars, or one while awakened\.$/, ''); Object.assign(ES, N.ultText('es', en, ULTS[id][0])); Object.assign(ZH, N.ultText('zh', en, ULTS[id][1])); });
  N.tr('es', ES); N.tr('zh', ZH);
})();
