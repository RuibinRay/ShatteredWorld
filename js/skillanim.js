'use strict';
// Shattered Worlds — skill animations, one per skill. Loaded after signature.js; draw-only (no timing, hitbox or damage
// changes). Every skill of every fighter (U, S+U, I, S+I, W+O and the ultimate: 264 in all) gets its own cast animation,
// drawn in the hero's colours on top of what the skill already shows:
//   throw   a swoosh of the arm, a muzzle star and streaks ahead          slash   one to three crescents sweeping round
//   burst   spokes and twin rings bursting out                            ground  a crack racing ahead with spikes
//   rise    streaks climbing round the hero, a ring at the feet           dive    streaks falling on a closing reticle
//   dash    speed lines behind, chevrons ahead                            blink   a slit of light closing, sparkles
//   summon  a turning glyph circle with a rising mark                     vortex  spiral arms winding in
//   ult     three rings, long spokes and bands of light across the screen
// MOTIF says which skill uses which; each skill's count, tilt, size and rhythm come from its own name (a hash), and its
// size from its slot, so no two look alike. The effect follows the hero while they move. SW.skillanim.on = false: off.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, P = SW.Player.prototype, W = SW.W, H = SW.H;
  const HR = D.heroes, K = SW.skillfx;
  const SA = SW.skillanim = { on: true };
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rnd = (seed, i) => { let x = Math.imul(seed ^ Math.imul(i + 1, 0x9e3779b1), 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
  const ease = k => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);

  const LISTS = {
    throw: 'spark_dart ice_shard rock_throw fireball wind_blade magma_glob grenade star_volley rift_bolt shard_fan heavy_star stopwatch quick_shot paper_star light_arrow spark_kunai sand_lance shade_dart water_bullet air_palm crow_volley finger_shards spore_puff ink_bolt wheel_throw crescent_toss toll_wave void_shard trick_shot rocket vault_shot fan_of_five lucky_coin ricochet cluster_bomb marrow_lance twin_wheels',
    slash: 'unseen_cut cleave draw sawback brine_lash maul chain_lash null_crescent three_breaths iron_tempest spine_whip brush_stroke after_the_bell whirl_heel step_kick long_jab mountain_palm fan_gust heart_strike rippling_palm',
    burst: 'pulse_burst frost_nova thunderclap flame_ring roar polarity resonance scatter recoil_blast engine_light old_shell echo_chamber stone_garden thunder_toll seal_circle',
    ground: 'winterline shatterline stilled_verse quake molten_wave landslide sinking_sands shadow_snare bone_grove mudslick dune_sea night_spikes shadow_tide ivory_thicket world_rend_p frost_bloom magma_bloom caldera undertow tidal_wave living_script eyrie_spire wardens_wall lava_geyser rising_geyser bloom_field toxic_bloom corpse_flower dune_grip sand_maw shadow_bind',
    rise: 'rising_storm updraft rising_knee sky_kick moon_vault fall_up hounds_leap',
    dive: 'downdraft_kick lights_out phoenix_dive meteor_heel lunar_dive bell_drop falcon_dive chain_drop boulder_fall feral_pounce meteor_wheel avalanche judgment sky_lance arrow_rain static_rain palm_rain door_barrage storm_call',
    dash: 'breaker_rush phantom_rush gate_lance wind_up hundred_paces thunder_pierce twin_rush puppet_lunge riptide_eel thousand_miles rubber_cannon gale_wheel meteor_rush vanguard reel_in sling hook_pull chain_snare bear_hug wheel_toss grind_wheel storm_pack clone_barrage pile_on fist_storm fan_hammer',
    blink: 'smoke_step fold fold_step flash_step sink_step back_door rift_step swap_out rewind afterimage mist_veil pinned_shadow blink_strike',
    summon: 'thunder_totem ice_bird thunder_wolf earth_dragon mine reflection prism crane_flock tide_pool scrap_halo slow_hour second_hand time_bomb hall_of_mirrors crane_ward venom_mist iron_cradle turning_wall iron_guard twin_orbit lunar_halo kaleidoscope petal_storm ember_swarm murder_of_crows hundred_strings cats_cradle binding_script bubble_jail brine_bubble moon_gaze riposte falling_leaf',
    vortex: 'cyclone twin_tornado singularity gravity_well crush scrap_tornado scrap_press paper_gale iron_cyclone engine_collapse ball_lightning black_flame fire_wheel sun_flare forge_breath ember_breath fire_serpent vine_snap'
  };
  const MOTIF = {}; Object.keys(LISTS).forEach(m => LISTS[m].split(' ').forEach(id => { MOTIF[id] = m; }));
  const BY_SLOT = { u: 'throw', su: 'burst', i: 'slash', si: 'burst', wo: 'summon', ult: 'ult' };
  const SIZE = { u: 1, su: 1.2, i: 1.45, si: 1.75, wo: 1.6, ult: 2.4 }, LIFE = { u: 20, su: 24, i: 28, si: 34, wo: 32, ult: 56 };
  SA.MOTIF = MOTIF;

  // ================= which skill was just used =================
  function idOf(g, slot) {
    const h = g.hero(), id = g.state.hero;
    return slot === 'u' ? h.kit[0] : slot === 'su' ? h.kit[1] : slot === 'i' ? h.kit[2] : slot === 'si' ? ((SW.moves && SW.moves.BURST[id]) || {}).id : slot === 'wo' ? ((SW.signature && SW.signature.SIG[id]) || {}).id : h.ultimate;
  }
  function play(p, g, slot) {
    const id = idOf(g, slot), h = g.hero();
    if (!SA.on || !id || !h) return;
    let n = 0; for (const q of fx.list) if (q.k === 'SA') n++;
    if (n > 20) return;
    const m = slot === 'ult' ? 'ult' : MOTIF[id] || BY_SLOT[slot], life = LIFE[slot];
    fx.list.push({ k: 'SA', m, p, x: p.x, y: p.y, face: p.face, col: h.color, hi: h.colorHi || '#ffffff', seed: hash(id), sz: SIZE[slot], life, max: life, gy: p.y });
    if (K && (m === 'throw' || m === 'dash')) K.emit(K.styleOf(g.state.hero), p.x + p.face * 12, p.y - 20, 5, { dir: m === 'dash' ? -p.face : p.face, spread: 0.5 });
  }
  const snap = p => { const c = p.cd || {}; return { u: c.u || 0, su: c.su || 0, i: c.i || 0, si: c.si || 0, wo: c.wo || 0, ult: p.state === 'ult' }; };
  ['useSkill', 'useSpecial', 'useAwaken'].forEach(fn => {
    const f = P[fn]; if (typeof f !== 'function') return;
    P[fn] = function () {
      const g = this.G; if (!g || !g.state) return f.apply(this, arguments);
      const a = snap(this), r = f.apply(this, arguments), b = snap(this);
      if (!a.ult && b.ult) play(this, g, 'ult');
      else for (const s of ['wo', 'si', 'i', 'su', 'u']) if (b[s] > a[s]) { play(this, g, s); break; }
      return r;
    };
  });

  // ================= drawing =================
  const line = (ctx, c, x0, y0, x1, y1, w) => art.line(ctx, c, Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), w || 1);
  const dot = (ctx, c, x, y, s) => art.rect(ctx, c, Math.round(x - s / 2), Math.round(y - s / 2), s, s);
  function arc(ctx, c, cx, cy, r, a0, a1, w, squash) { const n = Math.max(4, Math.round(Math.abs(a1 - a0) * r / 4)); for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; dot(ctx, c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * (squash || 1), w); } }
  const DRAW = {
    throw(ctx, q, x, y, t) {
      const f = q.face, s = q.sz, head = -2.3 + 2.9 * ease(t * 1.6), tail = -2.3 + 2.9 * ease(t * 1.6 - 0.5);
      for (let i = 0; i <= 10; i++) { const a = tail + (head - tail) * i / 10; dot(ctx, i > 7 ? '#ffffff' : q.col, x + Math.cos(a) * 20 * s * f, y + Math.sin(a) * 18 * s, 1 + (i >> 2)); }
      const k = Math.sin(Math.min(1, t * 2) * Math.PI), mx = x + f * 18 * s, r = Math.round(7 * s * k), tilt = rnd(q.seed, 1) * 0.8;
      if (r > 0) for (let i = 0; i < 4; i++) { const a = tilt + i * 1.571; line(ctx, i % 2 ? q.hi : '#ffffff', mx, y, mx + Math.cos(a) * r, y + Math.sin(a) * r, 1); }
      const n = 3 + q.seed % 3;
      for (let i = 0; i < n; i++) { const yy = y + (rnd(q.seed, i + 4) - 0.5) * 22 * s, x0 = mx + f * (6 + 60 * s * t * (0.6 + rnd(q.seed, i + 9) * 0.6)); line(ctx, i % 2 ? q.col : q.hi, x0, yy, x0 + f * 14 * s * (1 - t), yy, 1); }
    },
    slash(ctx, q, x, y, t) {
      const n = 1 + q.seed % 3, f = q.face;
      for (let i = 0; i < n; i++) {
        const tt = t * 1.4 - i * 0.22; if (tt <= 0 || tt > 1.15) continue;
        const tilt = (rnd(q.seed, i) - 0.5) * 1.4, r = (24 + i * 7) * q.sz, a0 = -1.7 + tilt, a1 = 1.3 + tilt, hd = a0 + (a1 - a0) * ease(tt), tl = a0 + (a1 - a0) * ease(tt - 0.35);
        const A0 = f > 0 ? tl : Math.PI - tl, A1 = f > 0 ? hd : Math.PI - hd;
        arc(ctx, q.col, x, y, r, A0, A1, 3, 0.8); arc(ctx, '#ffffff', x, y, r - 1, A0 + (A1 - A0) * 0.5, A1, 1, 0.8);
      }
    },
    burst(ctx, q, x, y, t) {
      const n = 10 + q.seed % 7, k = ease(t), r0 = (10 + 42 * k) * q.sz, off = rnd(q.seed, 2) * 6.28;
      for (let i = 0; i < n; i++) { const a = off + i * 6.283 / n, l = (8 + rnd(q.seed, i + 3) * 10) * q.sz * (1 - t); line(ctx, i % 2 ? q.col : q.hi, x + Math.cos(a) * r0, y + Math.sin(a) * r0 * 0.8, x + Math.cos(a) * (r0 + l), y + Math.sin(a) * (r0 + l) * 0.8, 1); }
      art.ring(ctx, q.col, Math.round(x), Math.round(y), Math.round(48 * q.sz * k)); art.ring(ctx, '#ffffff', Math.round(x), Math.round(y), Math.round(34 * q.sz * ease(t * 1.3)));
    },
    ground(ctx, q, x, y, t, gy) {
      const f = q.face, len = 96 * q.sz * ease(t * 1.3), n = Math.max(2, Math.round(len / 8)); let px = x + f * 8, py = gy - 1;
      for (let i = 1; i <= n; i++) { const nx = x + f * (8 + len * i / n), ny = gy - 1 - (rnd(q.seed, i) > 0.6 ? 2 : 0); line(ctx, i % 3 ? q.col : '#ffffff', px, py, nx, ny, 1); px = nx; py = ny; }
      const sp = 4 + q.seed % 4;
      for (let i = 0; i < sp; i++) { const at = (i + 1) / (sp + 1), tt = t * 1.6 - at; if (tt <= 0) continue; const hh = (8 + rnd(q.seed, i + 20) * 14) * q.sz * Math.sin(Math.min(1, tt) * Math.PI), sx = x + f * (8 + 96 * q.sz * at); line(ctx, q.hi, sx, gy, sx + f * 2, gy - hh, 1); line(ctx, q.col, sx + f * 3, gy, sx + f * 4, gy - hh * 0.6, 1); }
    },
    rise(ctx, q, x, y, t, gy) {
      const n = 6 + q.seed % 4;
      for (let i = 0; i < n; i++) { const ox = (rnd(q.seed, i) - 0.5) * 34 * q.sz, sp = 0.6 + rnd(q.seed, i + 8) * 0.8, yy = gy - 70 * q.sz * ((t * sp + rnd(q.seed, i + 16)) % 1); line(ctx, i % 2 ? q.col : q.hi, x + ox, yy, x + ox, yy - 12 * q.sz * (1 - t), 1); }
      arc(ctx, q.col, x, gy - 1, 22 * q.sz * ease(t), 0, 6.283, 1, 0.3); arc(ctx, '#ffffff', x, gy - 1, 14 * q.sz * ease(t * 1.4), 0, 6.283, 1, 0.3);
    },
    dive(ctx, q, x, y, t, gy) {
      const tx = x + q.face * 44 * (q.seed % 2 ? 1 : 0.4), n = 6 + q.seed % 5;
      for (let i = 0; i < n; i++) { const ox = (rnd(q.seed, i) - 0.5) * 60 * q.sz, yy = gy - 120 + 120 * ((t * (0.8 + rnd(q.seed, i + 7)) + rnd(q.seed, i + 14)) % 1); line(ctx, i % 2 ? q.col : q.hi, tx + ox, yy, tx + ox - q.face * 3, yy - 14 * q.sz, 1); }
      const r = (34 - 24 * ease(t)) * q.sz; arc(ctx, q.hi, tx, gy - 1, r, 0, 6.283, 1, 0.3); line(ctx, '#ffffff', tx - r - 4, gy - 1, tx - r + 2, gy - 1); line(ctx, '#ffffff', tx + r - 2, gy - 1, tx + r + 4, gy - 1);
    },
    dash(ctx, q, x, y, t) {
      const f = q.face, n = 7 + q.seed % 4;
      for (let i = 0; i < n; i++) { const yy = y - 16 + rnd(q.seed, i) * 34, l = (24 + rnd(q.seed, i + 5) * 36) * q.sz * (1 - t * 0.6), x0 = x - f * (10 + 30 * t + rnd(q.seed, i + 11) * 20); line(ctx, i % 3 ? q.col : '#ffffff', x0, yy, x0 - f * l, yy, 1); }
      for (let i = 0; i < 3; i++) { const cx = x + f * (16 + i * 9 + 20 * t), a = 1 - t - i * 0.15; if (a <= 0) continue; ctx.globalAlpha *= a; line(ctx, q.hi, cx - f * 5, y - 8, cx, y); line(ctx, q.hi, cx - f * 5, y + 8, cx, y); ctx.globalAlpha /= a; }
    },
    blink(ctx, q, x, y, t) {
      const w = Math.max(1, Math.round(14 * q.sz * (1 - ease(t * 1.5)))), h = Math.round(56 * q.sz * (0.4 + 0.6 * Math.sin(Math.min(1, t * 1.5) * Math.PI)));
      art.rect(ctx, q.col, Math.round(x - w / 2), Math.round(y - h / 2), w, h); art.rect(ctx, '#ffffff', Math.round(x), Math.round(y - h / 2), 1, h);
      for (let i = 0; i < 6 + q.seed % 4; i++) { const a = rnd(q.seed, i) * 6.283, r = (10 + 34 * ease(t)) * q.sz * (0.5 + rnd(q.seed, i + 9)), px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; line(ctx, q.hi, px - 2, py, px + 2, py); line(ctx, q.hi, px, py - 2, px, py + 2); }
    },
    summon(ctx, q, x, y, t, gy) {
      const cx = x + q.face * 26, cy = y - 2, r = 18 * q.sz * ease(t * 1.5), turn = t * 4 * (q.seed % 2 ? 1 : -1), sides = 3 + q.seed % 4;
      arc(ctx, q.col, cx, cy, r, 0, 6.283, 1, 1); arc(ctx, q.hi, cx, cy, r * 0.72, 0, 6.283, 1, 1);
      for (let i = 0; i < sides; i++) { const a = turn + i * 6.283 / sides, b = turn + (i + 1) * 6.283 / sides; line(ctx, '#ffffff', cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7, cx + Math.cos(b) * r * 0.7, cy + Math.sin(b) * r * 0.7); }
      for (let i = 0; i < 8; i++) { const a = -turn + i * 0.785; dot(ctx, q.hi, cx + Math.cos(a) * (r + 3), cy + Math.sin(a) * (r + 3), 2); }
      line(ctx, q.col, cx, cy + r, cx, cy + r + (gy - cy - r) * (1 - t));
    },
    vortex(ctx, q, x, y, t) {
      const arms = 2 + q.seed % 3, cx = x + q.face * 14, R = 34 * q.sz, spin = t * 7 * (q.seed % 2 ? 1 : -1);
      for (let a = 0; a < arms; a++) for (let i = 0; i < 14; i++) { const k = i / 14, rr = R * k * (1 - t * 0.5), an = spin + a * 6.283 / arms + k * 3.4; dot(ctx, i % 4 ? q.col : '#ffffff', cx + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.7, i > 9 ? 2 : 1); }
      art.ring(ctx, q.hi, Math.round(cx), Math.round(y), Math.round(R * (1 - ease(t)) * 0.9 + 3));
    },
    ult(ctx, q, x, y, t) {
      const k = ease(t);
      for (let i = 0; i < 3; i++) { const tt = t * 1.5 - i * 0.2; if (tt > 0 && tt < 1.2) art.ring(ctx, i % 2 ? '#ffffff' : q.col, Math.round(x), Math.round(y), Math.round(150 * ease(tt))); }
      const n = 18 + q.seed % 8, off = rnd(q.seed, 1) * 6.28 + t * 0.6;
      for (let i = 0; i < n; i++) { const a = off + i * 6.283 / n, r0 = 22 + 60 * k * rnd(q.seed, i + 2), l = (40 + 80 * rnd(q.seed, i + 30)) * (1 - t); line(ctx, i % 3 ? q.col : q.hi, x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * (r0 + l), y + Math.sin(a) * (r0 + l), 1); }
      const a0 = ctx.globalAlpha; ctx.globalAlpha = a0 * 0.5 * (1 - t);
      for (let i = 0; i < 10; i++) { const yy = (i * 29 + q.seed % 17) % H, w = 60 + (i * 41) % 120, xx = ((t * 900 * (i % 2 ? 1 : -1) + i * 97) % (W + w) + W + w) % (W + w) - w; art.rect(ctx, i % 2 ? q.col : '#ffffff', Math.round(xx), yy, w, 1); }
      ctx.globalAlpha = a0;
    }
  };
  const _fd = fx.draw; fx.draw = function (ctx, cam) {
    _fd.apply(this, arguments);
    if (!SA.on) return;
    for (const q of fx.list) {
      if (q.k !== 'SA' || !DRAW[q.m]) continue;
      const p = q.p, live = p && !p.dead && q.m !== 'ground' && q.m !== 'summon' && q.m !== 'dive' && q.m !== 'blink';
      if (live) { q.x = p.x; q.y = p.y; }
      const t = 1 - q.life / q.max;
      // twice: plainly first, so it reads on bright backgrounds, then added as light
      const a = Math.min(1, (q.life / q.max) * 2.4);
      ctx.save(); ctx.globalAlpha = a * 0.7; DRAW[q.m](ctx, q, q.x - cam.x, q.y - 20 - cam.y, t, q.gy - cam.y); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a;
      DRAW[q.m](ctx, q, q.x - cam.x, q.y - 20 - cam.y, t, q.gy - cam.y);
      ctx.restore();
    }
  };
})();
