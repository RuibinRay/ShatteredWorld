'use strict';
// Shattered Worlds — skill effects by element. Loaded after moves.js and the Hidden Clans files; only adds and wraps.
//   Every hero has an element style (sand, water, embers, ice shards, crow feathers, ink ...): the colours, the shape of
//   its particles and how they move. Every skill a hero uses now draws that style:
//     cast     a sigil turns under the hero's feet and the element gathers in (bigger for I, S+I, the power-ups and the
//              ultimate, with a light pillar for the last two)
//     impact   energy hits burst in the element where they land
//     trail    the hero's shots shed their element as they fly
//   The particles are an fx kind of their own ('SK' and 'SKC'), drawn on top of the game's own effects. Nothing here
//   changes timing, hitboxes or damage. SW.skillfx is used by clanmelee.js and signature.js.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, P = SW.Player.prototype, rand = SW.rand;
  const HR = D.heroes;

  // ================= styles =================
  // c: colours (first is the main one); shape: how a particle is drawn; g: gravity (negative rises); spd: burst speed;
  // life: frames; drag: speed kept per frame
  const STYLE = {
    bolt:    { c: ['#ffe7a8', '#ffffff', '#ffb840'], shape: 'spark', g: 0, spd: 3.2, life: 10, drag: 0.86, jitter: 1.2 },
    ice:     { c: ['#bfefff', '#ffffff', '#7fd8ff'], shape: 'shard', g: 0.07, spd: 2.4, life: 22, drag: 0.93 },
    fire:    { c: ['#ff8a3a', '#ffd24a', '#ff4d1f'], shape: 'ember', g: -0.07, spd: 1.8, life: 22, drag: 0.92 },
    wind:    { c: ['#d8fff0', '#ffffff', '#7dffb2'], shape: 'streak', g: 0, spd: 3.4, life: 12, drag: 0.9 },
    rock:    { c: ['#a08060', '#c8a05a', '#6a5040'], shape: 'chunk', g: 0.3, spd: 2.8, life: 30, drag: 0.96 },
    sand:    { c: ['#e8c070', '#d9a441', '#f5deb0'], shape: 'grain', g: 0.1, spd: 2.6, life: 28, drag: 0.94, sway: 0.15 },
    water:   { c: ['#7fd8ff', '#ffffff', '#2a9df4'], shape: 'drop', g: 0.22, spd: 2.8, life: 24, drag: 0.96 },
    shadow:  { c: ['#2a2440', '#5b5f97', '#8a8fd0'], shape: 'wisp', g: -0.04, spd: 1.3, life: 26, drag: 0.9 },
    void:    { c: ['#e04dff', '#ffffff', '#5a1a7a'], shape: 'diamond', g: 0, spd: 2.4, life: 16, drag: 0.88 },
    light:   { c: ['#fff3c0', '#ffffff', '#ffd60a'], shape: 'ray', g: 0, spd: 2.6, life: 14, drag: 0.88 },
    glass:   { c: ['#e8f0ff', '#c8d4f0', '#ffffff'], shape: 'shard', g: 0.2, spd: 3, life: 22, drag: 0.95 },
    petal:   { c: ['#ffa0c0', '#ffd0e0', '#ffffff'], shape: 'leaf', g: 0.03, spd: 1.8, life: 36, drag: 0.94, sway: 0.25 },
    star:    { c: ['#9d6cff', '#ffffff', '#c8b0ff'], shape: 'star', g: 0, spd: 2, life: 20, drag: 0.9 },
    time:    { c: ['#e8a090', '#fff3c0', '#ffffff'], shape: 'tick', g: 0, spd: 1.6, life: 20, drag: 0.9 },
    smoke:   { c: ['#c8ccd8', '#8a92b8', '#ffffff'], shape: 'puff', g: -0.03, spd: 1.1, life: 26, drag: 0.9 },
    metal:   { c: ['#e0e6f0', '#8d99ae', '#ffd24a'], shape: 'spark', g: 0.2, spd: 3.4, life: 14, drag: 0.92 },
    paper:   { c: ['#ffffff', '#ffe0e6', '#ff4d6d'], shape: 'leaf', g: 0.04, spd: 2.2, life: 32, drag: 0.94, sway: 0.2 },
    beast:   { c: ['#ff5a5a', '#ffffff', '#c1121f'], shape: 'claw', g: 0.08, spd: 2.6, life: 14, drag: 0.88 },
    string:  { c: ['#f0c0ff', '#ffffff', '#b5179e'], shape: 'thread', g: 0, spd: 2.8, life: 14, drag: 0.9 },
    chi:     { c: ['#bff6ff', '#ffffff', '#5ec8d8'], shape: 'ringlet', g: 0, spd: 1.6, life: 16, drag: 0.88 },
    feather: { c: ['#2a1a3a', '#7209b7', '#b07ae0'], shape: 'feather', g: 0.05, spd: 2, life: 34, drag: 0.94, sway: 0.2 },
    bone:    { c: ['#f0ecd0', '#c9c6a0', '#ffffff'], shape: 'shard', g: 0.25, spd: 2.6, life: 22, drag: 0.95 },
    spore:   { c: ['#9ef01a', '#d8ff80', '#5a8a10'], shape: 'puff', g: -0.02, spd: 0.9, life: 36, drag: 0.92 },
    ink:     { c: ['#1a1026', '#ef476f', '#3a2440'], shape: 'drop', g: 0.18, spd: 2.4, life: 26, drag: 0.95 },
    moon:    { c: ['#b8c0ff', '#ffffff', '#7a80c0'], shape: 'crescent', g: 0, spd: 1.9, life: 20, drag: 0.9 },
    sound:   { c: ['#ffd08a', '#ffffff', '#bc6c25'], shape: 'arc', g: 0, spd: 2.6, life: 14, drag: 0.9 },
    impact:  { c: ['#ffffff', '#ffd24a', '#ff8a3a'], shape: 'streak', g: 0, spd: 3.6, life: 9, drag: 0.85 },
    blast:   { c: ['#ffd24a', '#ff8a3a', '#9a9aa8'], shape: 'ember', g: -0.04, spd: 2.6, life: 20, drag: 0.9, smoke: true },
    gravity: { c: ['#9d6cff', '#1a0a2e', '#ffffff'], shape: 'diamond', g: 0, spd: 2.2, life: 18, drag: 0.9, inward: true },
    magma:   { c: ['#ff5a1f', '#ffd24a', '#5a1a0a'], shape: 'chunk', g: 0.16, spd: 2.4, life: 26, drag: 0.95, glow: true },
    thorns:  { c: ['#7dffa0', '#2a6a3a', '#ffffff'], shape: 'thread', g: 0.05, spd: 2.4, life: 18, drag: 0.92 }
  };
  const BY_HERO = {
    kael: 'bolt', nyra: 'ice', fenn: 'bolt', isolde: 'ice', brakk: 'rock', pyra: 'fire', gale: 'wind', ashka: 'magma', dyna: 'blast',
    vesper: 'shadow', orin: 'void', mira: 'glass', noct: 'void', bando: 'impact', aldric: 'light', sen: 'petal', vega: 'gravity',
    tessa: 'time', jax: 'blast', ferra: 'metal', kiri: 'paper', tarn: 'wind', maren: 'water', yara: 'light', brann: 'beast',
    rook: 'smoke', sable: 'bolt', dune: 'sand', moro: 'shadow', pell: 'string', hollis: 'rock', kestra: 'fire', ivo: 'impact',
    nami: 'water', lin: 'chi', corvin: 'feather', thorne: 'bone', ume: 'spore', tarek: 'metal', isa: 'ink', garo: 'metal',
    mika: 'moon', oda: 'sound'
  };
  const styleOf = id => STYLE[BY_HERO[id]] ? BY_HERO[id] : 'impact';
  const heroStyle = g => styleOf(g && g.state && g.state.hero);

  // ================= particles =================
  const pick = a => a[(Math.random() * a.length) | 0];
  function add(style, x, y, vx, vy, o) {
    const s = STYLE[style] || STYLE.impact; o = o || {};
    if (fx.list.length > 900) return;
    const life = Math.round((o.life || s.life) * (0.7 + Math.random() * 0.6));
    fx.list.push({ k: 'SK', st: style, x, y, vx, vy, g: o.g !== undefined ? o.g : s.g, drag: s.drag, life, max: life, col: o.col || pick(s.c), shape: o.shape || s.shape, rot: Math.random() * 6.28, vr: rand(-0.3, 0.3), sway: s.sway || 0, t: 0, size: o.size || 1 });
  }
  // n particles thrown out from x, y; o: { dir (1 / -1 for a cone that way), spread (radians), power, up }
  function emit(style, x, y, n, o) {
    const s = STYLE[style] || STYLE.impact; o = o || {};
    for (let i = 0; i < n; i++) {
      let a = Math.random() * 6.283;
      if (o.dir) a = (o.dir > 0 ? 0 : Math.PI) + rand(-(o.spread || 0.7), o.spread || 0.7) * (o.dir > 0 ? 1 : -1);
      if (o.up) a = -Math.PI / 2 + rand(-(o.spread || 0.6), o.spread || 0.6);
      const v = s.spd * (o.power || 1) * (0.4 + Math.random() * 0.8);
      add(style, x + rand(-2, 2), y + rand(-2, 2), Math.cos(a) * v, Math.sin(a) * v, o);
    }
    if (s.smoke && n > 3) for (let i = 0; i < Math.ceil(n / 3); i++) add('smoke', x + rand(-4, 4), y + rand(-4, 4), rand(-0.6, 0.6), rand(-0.8, -0.2));
  }
  // particles that start on a circle and fall in toward x, y (the gather before a skill)
  function gather(style, x, y, n, r) {
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, rr = r * (0.7 + Math.random() * 0.4); add(style, x + Math.cos(a) * rr, y + Math.sin(a) * rr, -Math.cos(a) * rr / 10, -Math.sin(a) * rr / 10, { g: 0, life: 10 }); }
  }
  // the turning sigil under a hero's feet (lvl 0-3), and a pillar of light for the biggest moves
  function sigil(x, y, style, lvl) { fx.list.push({ k: 'SKC', x, y, st: style, lvl, life: 18 + lvl * 6, max: 18 + lvl * 6, t: 0 }); }
  function cast(p, style, lvl) {
    const x = p.x, y = p.y;
    sigil(x, y, style, lvl);
    gather(style, x, y - 18, 6 + lvl * 4, 20 + lvl * 8);
    if (lvl >= 2) emit(style, x, y - 4, 4 + lvl * 3, { up: true, spread: 0.4, power: 1.2 });
    if (lvl >= 3) fx.list.push({ k: 'SKC', x, y, st: style, lvl: 9, life: 26, max: 26, t: 0 });
  }
  function burst(style, x, y, power) { emit(style, x, y, Math.round(8 * (power || 1)), { power: 0.9 + 0.4 * (power || 1) }); }
  function trail(style, x, y, vx, vy) { add(style, x + rand(-2, 2), y + rand(-2, 2), -(vx || 0) * 0.15 + rand(-0.3, 0.3), -(vy || 0) * 0.15 + rand(-0.3, 0.3), { life: 12 }); }

  // ================= drawing =================
  const _fu = fx.update; fx.update = function () {
    for (const q of fx.list) {
      if (q.k !== 'SK') { if (q.k === 'SKC') q.t++; continue; }
      q.t++; q.vy += q.g; q.vx *= q.drag; q.vy *= q.drag; q.x += q.vx + (q.sway ? Math.sin(q.t * 0.3 + q.rot) * q.sway : 0); q.y += q.vy; q.rot += q.vr;
    }
    _fu();
  };
  const line = (ctx, col, x0, y0, x1, y1) => art.line(ctx, col, x0, y0, x1, y1, 1);
  function drawSK(ctx, q, x, y) {
    const t = q.life / q.max, sp = Math.hypot(q.vx, q.vy), nx = sp > 0.05 ? q.vx / sp : Math.cos(q.rot), ny = sp > 0.05 ? q.vy / sp : Math.sin(q.rot);
    ctx.globalAlpha = Math.min(1, t * 2.2);
    switch (q.shape) {
      case 'spark': { const l = 2 + Math.min(4, sp * 1.5); line(ctx, q.col, x, y, Math.round(x - nx * l), Math.round(y - ny * l)); art.rect(ctx, '#ffffff', x, y, 1, 1); break; }
      case 'shard': { const l = 3 + (q.size > 1 ? 2 : 0); line(ctx, q.col, Math.round(x - nx * l), Math.round(y - ny * l), x, y); art.rect(ctx, '#ffffff', x, y, 1, 1); break; }
      case 'ember': art.rect(ctx, q.t % 6 < 3 ? q.col : '#ffd24a', x, y, 2, 2); if (q.t % 4 === 0) art.rect(ctx, '#ffffff', x, y, 1, 1); break;
      case 'streak': { const l = 3 + Math.min(7, sp * 2); line(ctx, q.col, x, y, Math.round(x - nx * l), Math.round(y - ny * l)); break; }
      case 'chunk': art.rect(ctx, q.col, x, y, 3, 2); art.rect(ctx, '#2a2018', x, y + 2, 3, 1); break;
      case 'grain': art.rect(ctx, q.col, x, y, 1, 1); if (q.t % 3 === 0) art.rect(ctx, q.col, x + 1, y, 1, 1); break;
      case 'drop': art.rect(ctx, q.col, x, y, 2, 2); art.rect(ctx, q.col, x, y - 1, 1, 1); if (t > 0.5) art.rect(ctx, '#ffffff', x, y, 1, 1); break;
      case 'wisp': { const s = 2 + Math.round((1 - t) * 3); ctx.globalAlpha *= 0.6; art.rect(ctx, q.col, x - (s >> 1), y - (s >> 1), s, s); break; }
      case 'diamond': art.rect(ctx, q.col, x - 1, y, 3, 1); art.rect(ctx, q.col, x, y - 1, 1, 3); art.rect(ctx, '#ffffff', x, y, 1, 1); break;
      case 'ray': { const l = 2 + Math.round((1 - t) * 6); line(ctx, q.col, x, y, Math.round(x + nx * l), Math.round(y + ny * l)); break; }
      case 'leaf': { const h = Math.sin(q.rot) > 0; art.rect(ctx, q.col, x, y, h ? 2 : 1, h ? 1 : 2); break; }
      case 'star': { const k = q.t % 8 < 4; art.rect(ctx, q.col, x - (k ? 1 : 0), y, k ? 3 : 1, 1); art.rect(ctx, q.col, x, y - (k ? 1 : 0), 1, k ? 3 : 1); break; }
      case 'tick': { const c = Math.cos(q.rot) * 3, s = Math.sin(q.rot) * 3; line(ctx, q.col, x, y, Math.round(x + c), Math.round(y + s)); break; }
      case 'puff': { const s = 2 + Math.round((1 - t) * 4); ctx.globalAlpha *= 0.5; art.rect(ctx, q.col, x - (s >> 1), y - (s >> 1), s, s); break; }
      case 'claw': { for (let i = -1; i <= 1; i++) line(ctx, q.col, x + i * 2, y - 3, x + i * 2 + Math.round(nx * 3), y + 3); break; }
      case 'thread': { const l = 4 + Math.min(6, sp * 2); line(ctx, q.col, x, y, Math.round(x - nx * l), Math.round(y - ny * l)); break; }
      case 'ringlet': ctx.globalAlpha *= 0.8; art.ring(ctx, q.col, x, y, 1 + Math.round((1 - t) * 4)); break;
      case 'feather': { art.rect(ctx, q.col, x, y, 3, 1); art.rect(ctx, '#b07ae0', x + (Math.sin(q.rot) > 0 ? 2 : 0), y, 1, 1); break; }
      case 'crescent': art.rect(ctx, q.col, x, y, 2, 1); art.rect(ctx, q.col, x - 1, y + 1, 1, 1); art.rect(ctx, q.col, x + 2, y + 1, 1, 1); break;
      case 'arc': ctx.globalAlpha *= 0.7; art.ring(ctx, q.col, x, y, 2 + Math.round((1 - t) * 5)); break;
      default: art.rect(ctx, q.col, x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
  }
  // the sigil: two rings flattened onto the ground, ticks turning around them; lvl 9 is the light pillar
  function drawSigil(ctx, q, x, y) {
    const s = STYLE[q.st] || STYLE.impact, t = q.life / q.max, k = 1 - t;
    if (q.lvl === 9) {   // a column of light, narrowing as it fades
      const w = Math.max(1, Math.round(14 * t)), h = 120;
      ctx.globalAlpha = 0.35 * t; art.rect(ctx, s.c[0], x - w, y - h, w * 2, h); ctx.globalAlpha = 0.6 * t; art.rect(ctx, '#ffffff', x - (w >> 1), y - h, Math.max(1, w), h); ctx.globalAlpha = 1;
      return;
    }
    const r = Math.round(10 + q.lvl * 6 + k * 6), turn = q.t * 0.12, n = 8 + q.lvl * 2;
    ctx.globalAlpha = Math.min(1, t * 1.6) * 0.85;
    for (let i = 0; i < n; i++) {
      const a = turn + i * 6.283 / n, px = Math.round(x + Math.cos(a) * r), py = Math.round(y + Math.sin(a) * r * 0.3);
      art.rect(ctx, i % 2 ? s.c[0] : s.c[1] || '#ffffff', px, py, 2, 1);
      const a2 = -turn * 1.4 + i * 6.283 / n, r2 = r * 0.6;
      art.rect(ctx, s.c[2] || s.c[0], Math.round(x + Math.cos(a2) * r2), Math.round(y + Math.sin(a2) * r2 * 0.3), 1, 1);
    }
    ctx.globalAlpha = 1;
  }
  const _fd = fx.draw; fx.draw = function (ctx, cam) {
    _fd(ctx, cam);
    for (const q of fx.list) {
      if (q.k !== 'SK' && q.k !== 'SKC') continue;
      const x = Math.round(q.x - cam.x), y = Math.round(q.y - cam.y);
      if (q.k === 'SK') drawSK(ctx, q, x, y); else drawSigil(ctx, q, x, y);
    }
  };

  // ================= every skill, every hero =================
  const spent = (p, e0) => p.G.state && p.G.state.energy < e0 - 0.5;
  const _sk = P.useSkill; P.useSkill = function (alt) {
    const g = this.G, e0 = g.state.energy, r = _sk.apply(this, arguments);
    if (spent(this, e0)) cast(this, heroStyle(g), alt ? 1 : 0);
    return r;
  };
  const _sp = P.useSpecial; P.useSpecial = function () {
    const g = this.G, e0 = g.state.energy, r = _sp.apply(this, arguments), used = e0 - g.state.energy;
    if (used > 0.5) cast(this, heroStyle(g), used >= 250 ? 3 : used >= 100 ? 2 : 1);   // the ultimate costs the whole bar; S + I costs one
    return r;
  };
  const _aw = P.useAwaken; P.useAwaken = function () {
    const g = this.G, a0 = this.awakeT, m0 = this.modeT || 0, r = _aw.apply(this, arguments);
    if (a0 <= 0 && this.awakeT > 0) cast(this, heroStyle(g), 3);
    else if (m0 <= 0 && this.modeT > 0) cast(this, heroStyle(g), 2);
    return r;
  };
  // energy hits burst in the element where they land
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh(atk, e, b);
    if (!atk || atk.team !== 'player' || !atk.energy || !b || !G.state) return;
    burst(heroStyle(G), b.x + b.w / 2, b.y + b.h / 2, atk.heavy ? 1.3 : 0.8);
  };
  // the hero's shots shed their element
  [SW.Proj, SW.Shot].forEach(C => {
    if (!C) return;
    const u = C.prototype.update; C.prototype.update = function (g, z) {
      u.call(this, g, z);
      if (this.team !== 'player' || this.gone || !g.state) return;
      this.skT = (this.skT || 0) + 1;
      if (this.skT % 3 === 0) trail(heroStyle(g), this.x, this.y, this.vx, this.vy);
    };
  });
  // while a power-up or the awakening runs, the element drifts off the hero now and then
  const _pu = P.update; P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    if (!this.dead && g.state && ((this.awakeT > 0 && this.awakeT % 9 === 0) || (this.modeT > 0 && this.modeT % 14 === 0))) emit(heroStyle(g), this.x + rand(-6, 6), this.y - rand(6, 30), 1, { up: true, spread: 0.5, power: 0.5 });
    return r;
  };

  SW.skillfx = { STYLE, BY_HERO, styleOf, heroStyle, add, emit, gather, sigil, cast, burst, trail };
})();
