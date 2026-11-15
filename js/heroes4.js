'use strict';
// Shattered Worlds — third hero expansion: ten more heroes (twenty in all).
//   Rift-walkers  Orin, Mira, Noct: a PERFECT guard slips them between worlds. Nothing can touch them until they
//                 attack or the timer runs out, and the attack that brings them back hits harder.
//   Long arm      Bando: every punch reaches across the room; arms that jab, grab, sling and wind up.
//   Swords        Noct (cuts that land where he is not), Aldric (greatsword, counter-guard), Sen (quick-draw:
//                 stand calm, and the next Draw is a true draw).
//   And           Vega (gravity), Tessa (time), Jax (six-shooter), Ferra (magnet and scrap).
// Like the other expansions this only adds data and wraps functions. The single outside change is one line in
// art.js that exposes the sprite baker; without it the new heroes borrow existing sprite sheets.
// Their story (tutorial, memories, Act 2 lines, secret) is in story-heroes4.js.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, W = SW.W, H = SW.H, text = SW.text;
  const HR = D.heroes, A = D.abilities, C = D.combat, P = SW.Player.prototype, Proj = SW.Proj, boom = SW.boom, puff = SW.puff, near = SW.near, CASTS = SW.casts;
  const sfx = n => SW.audio.sfx(n);
  const NEW = [];

  // ---------- data ----------
  C.stretch = C.fist.map(a => Object.assign({}, a, { slash: 0, kx: a.kx * 1.2, box: [a.box[0], a.box[1], a.box[2] + 38, a.box[3]] }));
  C.great = C.blade.map(a => Object.assign({}, a, { dmg: Math.round(a.dmg * 1.6), dur: a.dur + 7, hitAt: a.hitAt + 3, hitEnd: a.hitEnd + 4, kx: a.kx * 1.5, box: [a.box[0], a.box[1] - 6, a.box[2] + 12, a.box[3] + 8] }));
  C.iai = C.blade.map(a => Object.assign({}, a, { dur: a.dur - 3, dmg: a.dmg - 1 }));

  // kit slots: [0] U  [1] S+U  [2] I  [3] traversal  [4] S+I mode  [5] awakening  [6] ultimate
  // trait: phase (perfect guard = untouchable for `phase` frames), reach, bulwark, draw, float, rewind, cylinder
  const hero = (id, o) => {
    const r = HR[o.route];
    HR[id] = Object.assign({ sheet: id, sheetAw: id + '_aw', ult: 'storm', start: r.start, item: r.item, spark: true, awaken: o.kit[5], ultimate: o.kit[6], mode: o.kit[4] }, o);
    D.heroOrder.push(id); NEW.push(id);
  };
  hero('orin', { name: 'Orin', alias: 'Flicker', title: 'The Door Between', energy: 'Fold', color: '#e04dff', colorHi: '#f7d0ff', element: 'Rift', sig: 'Phase Guard', combo: 'swift', route: 'kael', modeKind: 'speed', pitch: 540,
    need: 'perfect_5', trait: 'phase', phase: 300, window: 10, blurb: 'Block at the last instant and he is simply\nsomewhere else.', kit: ['rift_bolt', 'fold', 'gate_lance', 'magnet_grip', 'half_step', 'threshold_form', 'thousand_doors'] });
  hero('mira', { name: 'Mira', alias: 'Subject 03', title: 'The Other Side of the Glass', energy: 'Gleam', color: '#c8d4f0', colorHi: '#ffffff', element: 'Mirror', sig: 'Mirror Guard', combo: 'dagger', route: 'nyra', pitch: 680,
    need: 'secret_1', trait: 'phase', phase: 240, window: 10, decoy: true, blurb: 'What you hit was only her reflection.', kit: ['shard_fan', 'reflection', 'prism', 'frost_steps', 'silvering', 'glass_form', 'seven_years'] });
  hero('noct', { name: 'Noct', alias: 'Subject 00', title: "The Blade That Isn't There", energy: 'Hush', color: '#5ad6c8', colorHi: '#d8fff8', element: 'Void blade', sig: 'Unseen Cut', combo: 'blade', route: 'nyra', modeKind: 'speed', pitch: 360, ult: 'line',
    need: 'act2_done', trait: 'phase', phase: 180, window: 10, ambush: 2, blurb: 'The cut arrives. He does not.', kit: ['unseen_cut', 'afterimage', 'null_crescent', 'frost_steps', 'quiet_mind', 'eclipse_form', 'last_light'] });
  hero('bando', { name: 'Bando', alias: 'Stretch', title: 'The Long Arm of Deepline', energy: 'Snap', color: '#b6e84a', colorHi: '#ecffc0', element: 'Elastic', sig: 'Long Jab', combo: 'stretch', route: 'kael', pitch: 440,
    need: 'baron_down', trait: 'reach', blurb: 'Out of reach is not a thing he understands.', kit: ['long_jab', 'sling', 'wind_up', 'magnet_grip', 'overstretch', 'coil_form', 'hundred_hands'] });
  hero('aldric', { name: 'Aldric', alias: 'Subject 12', title: 'The Last Oath', energy: 'Oath', color: '#f0e0a0', colorHi: '#ffffff', element: 'Greatsword', sig: 'Counter Guard', combo: 'great', route: 'nyra', pitch: 250,
    need: 'level_12', trait: 'bulwark', window: 12, blurb: 'Slow. Certain. A perfect guard answers\nwith the whole sword.', kit: ['cleave', 'riposte', 'iron_tempest', 'frost_steps', 'vow', 'bastion_form', 'skysplitter'] });
  hero('sen', { name: 'Sen', alias: 'Sheath', title: 'The Single Stroke', energy: 'Breath', color: '#ffa0c0', colorHi: '#ffe4ee', element: 'Quick-draw', sig: 'True Draw', combo: 'iai', route: 'kael', modeKind: 'speed', pitch: 500,
    need: 'combo_40', trait: 'draw', blurb: 'Stand still a moment. Then be done.', kit: ['draw', 'falling_leaf', 'three_breaths', 'magnet_grip', 'flow_state', 'one_mind', 'single_stroke'] });
  hero('vega', { name: 'Vega', alias: 'Subject 88', title: 'The Weight of Stars', energy: 'Mass', color: '#9d6cff', colorHi: '#e4d8ff', element: 'Gravity', sig: 'Singularity', combo: 'flame', route: 'nyra', modeKind: 'speed', pitch: 420,
    need: 'shards_8', trait: 'float', blurb: 'Everything falls toward her eventually.', kit: ['heavy_star', 'crush', 'singularity', 'frost_steps', 'zero_g', 'nova_form', 'event_horizon'] });
  hero('tessa', { name: 'Tessa', alias: 'Subject 09', title: 'The Second Hand', energy: 'Tick', color: '#e8a090', colorHi: '#ffe4d8', element: 'Time', sig: 'Rewind', combo: 'swift', route: 'nyra', modeKind: 'speed', pitch: 720,
    need: 'tutorials_3', trait: 'rewind', blurb: 'She has already seen how this ends.\nShe did not like it.', kit: ['stopwatch', 'rewind', 'slow_hour', 'frost_steps', 'haste', 'clockwork_form', 'stopped_clock'] });
  hero('jax', { name: 'Jax', alias: 'Six', title: 'Six Shots', energy: 'Lead', color: '#c86a3a', colorHi: '#ffd0a8', element: 'Gunslinger', sig: 'Dead-Eye', combo: 'swift', route: 'kael', pitch: 320,
    need: 'creds_1500', trait: 'cylinder', blurb: 'Five to make a point.\nThe sixth to end the conversation.', kit: ['quick_shot', 'trick_shot', 'fan_hammer', 'magnet_grip', 'dead_eye', 'outlaw_form', 'high_noon'] });
  hero('ferra', { name: 'Ferra', alias: 'Magpie', title: 'The Scrap Queen', energy: 'Flux', color: '#8aa4c8', colorHi: '#e0ecff', element: 'Magnet', sig: 'Scrap Halo', combo: 'claw', route: 'kael', pitch: 460,
    need: 'upg_12', blurb: 'Every piece of junk in Deepline\nanswers to her.', kit: ['sawback', 'polarity', 'scrap_halo', 'magnet_grip', 'overclock', 'titan_coil', 'junk_comet'] });

  // These ten are the LEGEND heroes: earned, never given - locked in the story AND in Versus until their feat is done
  // (or the unlock code is entered) - and much stronger than the first ten for it.
  const MIGHT = 1.5, TOUGH = 1.4;   // damage and max health multipliers
  NEW.forEach(id => { HR[id].legend = true; });

  const AW = 'Awakening: +40% damage and super armour for 15 s.', SPD = '+25% speed and a flash-step dash for 10 s.', DMG = '+30% damage for 10 s.';
  Object.assign(A, {
    rift_bolt:      { name: 'Rift Bolt', input: 'U', cost: 25, dmg: 13, desc: 'A bolt that skips between worlds: it passes through walls, bars and shields. Hold W to aim up.' },
    fold:           { name: 'Fold', input: 'S + U', cost: 50, dmg: 14, desc: 'Open a door and drag the nearest enemy through it to your feet, stunned.' },
    gate_lance:     { name: 'Gate Lance', input: 'I', cost: 50, dmg: 14, desc: 'A lance of rift-light across the whole screen. Hits twice. Smashes cracked walls.' },
    half_step:      { name: 'Half-Step', input: 'S + I', cost: 100, desc: SPD },
    threshold_form: { name: 'Threshold Form', input: 'O (awakening full)', desc: AW },
    thousand_doors: { name: 'Thousand Doors', dmg: 12, desc: 'a door opens beside every enemy, again and again.' },
    shard_fan:      { name: 'Glass Fan', input: 'U', cost: 25, dmg: 6, desc: 'Three mirror shards that bounce once off walls. Hold W to aim up.' },
    reflection:     { name: 'Reflection', input: 'S + U', cost: 50, dmg: 18, desc: 'Step back and leave your reflection behind. It shatters after a moment, freezing what it cuts.' },
    prism:          { name: 'Prism', input: 'I', cost: 50, dmg: 13, desc: 'One beam split into three. The middle ray smashes cracked walls.' },
    silvering:      { name: 'Silvering', input: 'S + I', cost: 100, desc: DMG },
    glass_form:     { name: 'Glass Form', input: 'O (awakening full)', desc: AW },
    seven_years:    { name: "Seven Years' Luck", dmg: 12, desc: 'the world cracks like a mirror, and every enemy is standing on a crack.' },
    unseen_cut:     { name: 'Unseen Cut', input: 'U', cost: 25, dmg: 15, desc: 'A cut that lands on the nearest enemy without crossing the space between. Shields do not stop it.' },
    afterimage:     { name: 'Afterimage', input: 'S + U', cost: 50, dmg: 12, desc: 'Leave a cut hanging in the air. A moment later it opens twice and launches whatever is there.' },
    null_crescent:  { name: 'Null Crescent', input: 'I', cost: 50, dmg: 24, desc: 'A tall black crescent that passes through everything. Smashes cracked walls.' },
    quiet_mind:     { name: 'Quiet Mind', input: 'S + I', cost: 100, desc: SPD },
    eclipse_form:   { name: 'Eclipse Form', input: 'O (awakening full)', desc: AW },
    last_light:     { name: 'Last Light', dmg: 120, desc: 'one cut, and everything on the screen is on the wrong side of it.' },
    long_jab:       { name: 'Long Jab', input: 'U', cost: 25, dmg: 16, desc: 'Your fist crosses half the screen and snaps back. Reaches through bars. Hold W to punch upward.' },
    sling:          { name: 'Slingshot', input: 'S + U', cost: 50, dmg: 18, desc: 'Grab on. Small enemies are yanked to you; anything too big to pull, you sling yourself into, boots first.' },
    wind_up:        { name: 'Wind-Up', input: 'I', cost: 50, dmg: 30, desc: 'Three turns of the arm, then a fist the size of a door. Smashes cracked walls.' },
    overstretch:    { name: 'Overstretch', input: 'S + I', cost: 100, desc: DMG },
    coil_form:      { name: 'Coil Form', input: 'O (awakening full)', desc: AW },
    hundred_hands:  { name: 'Hundred Hands', dmg: 10, desc: 'fists from every direction at once, then both of them together.' },
    cleave:         { name: 'Earthcleave', input: 'U', cost: 25, dmg: 20, desc: 'An overhead chop that sends a shockwave along the ground and knocks enemies flat.' },
    riposte:        { name: 'Oathkeeper', input: 'S + U', cost: 50, dmg: 26, desc: 'Brace for a moment. If anything strikes you, you take a fraction of it and answer with the whole blade.' },
    iron_tempest:   { name: 'Iron Tempest', input: 'I', cost: 50, dmg: 9, desc: 'Spin forward behind the greatsword, cutting again and again. Nothing stops you. Smashes cracked walls.' },
    vow:            { name: 'Vow', input: 'S + I', cost: 100, desc: DMG },
    bastion_form:   { name: 'Bastion Form', input: 'O (awakening full)', desc: AW },
    skysplitter:    { name: 'Skysplitter', dmg: 36, desc: 'a blade of light falls on every enemy, three times.' },
    draw:           { name: 'Draw', input: 'U', cost: 25, dmg: 16, desc: 'Cut through everything in a short dash. Stand without attacking for a moment first and it is a TRUE DRAW: double damage, twice as far.' },
    falling_leaf:   { name: 'Falling Leaf', input: 'S + U', cost: 50, dmg: 14, desc: 'A rising cut that carries you and your enemy into the air together.' },
    three_breaths:  { name: 'Three Breaths', input: 'I', cost: 50, dmg: 11, desc: 'Three crescents, one after another. The third is the heavy one. Smashes cracked walls.' },
    flow_state:     { name: 'Flow State', input: 'S + I', cost: 100, desc: SPD },
    one_mind:       { name: 'One Mind', input: 'O (awakening full)', desc: AW },
    single_stroke:  { name: 'The Single Stroke', dmg: 16, desc: 'three passes nobody sees, and then every cut arrives at once.' },
    heavy_star:     { name: 'Heavy Star', input: 'U', cost: 25, dmg: 16, desc: 'A dense little star. It stops, drags nearby enemies into itself, then bursts. Hold W to throw it higher.' },
    crush:          { name: 'Crush', input: 'S + U', cost: 50, dmg: 20, desc: 'Everything around you weighs ten times as much. Enemies in the air are hit half again as hard.' },
    singularity:    { name: 'Singularity', input: 'I', cost: 50, dmg: 8, desc: 'A slow black hole that pulls enemies in and grinds them, then collapses. Smashes cracked walls.' },
    zero_g:         { name: 'Zero-G', input: 'S + I', cost: 100, desc: SPD },
    nova_form:      { name: 'Nova Form', input: 'O (awakening full)', desc: AW },
    event_horizon:  { name: 'Event Horizon', dmg: 24, desc: 'every enemy is lifted off the ground. Then gravity remembers them.' },
    stopwatch:      { name: 'Stopwatch', input: 'U', cost: 25, dmg: 10, desc: 'A dart that stops its target in time for two and a half seconds. Hold W to aim up.' },
    rewind:         { name: 'Rewind', input: 'S + U', cost: 50, desc: 'Go back to where you stood three seconds ago, with the health you had then.' },
    slow_hour:      { name: 'Slow Hour', input: 'I', cost: 50, dmg: 18, desc: 'A bubble of slow time: enemies inside keep freezing and their shots simply stop. It ends with a burst that smashes cracked walls.' },
    haste:          { name: 'Haste', input: 'S + I', cost: 100, desc: SPD },
    clockwork_form: { name: 'Clockwork Form', input: 'O (awakening full)', desc: AW },
    stopped_clock:  { name: 'The Stopped Clock', dmg: 11, desc: 'time stops for everyone else. You use it. Then it starts again.' },
    quick_shot:     { name: 'Quick Shot', input: 'U', cost: 15, dmg: 9, desc: 'One fast bullet. Cheap. Every sixth shot is a DEAD-EYE: triple damage, straight through everything. Hold W to aim up.' },
    trick_shot:     { name: 'Trick Shot', input: 'S + U', cost: 50, dmg: 14, desc: 'A bullet that banks off walls up to four times, turning toward the nearest enemy at every bounce.' },
    fan_hammer:     { name: 'Fan the Hammer', input: 'I', cost: 50, dmg: 8, desc: 'All six, as fast as the hammer falls. The last one explodes. Smashes cracked walls.' },
    dead_eye:       { name: 'Dead Eye', input: 'S + I', cost: 100, desc: DMG },
    outlaw_form:    { name: 'Outlaw Form', input: 'O (awakening full)', desc: AW },
    high_noon:      { name: 'High Noon', dmg: 17, desc: 'every enemy is marked. The bell tolls. Six shots each.' },
    sawback:        { name: 'Sawback', input: 'U', cost: 25, dmg: 10, desc: 'A saw blade that flies out and comes home, cutting both ways.' },
    polarity:       { name: 'Polarity', input: 'S + U', cost: 50, dmg: 12, desc: 'A magnetic pulse. The first one PULLS every enemy in to you; the next one PUSHES them away, hard. It alternates.' },
    scrap_halo:     { name: 'Scrap Halo', input: 'I', cost: 50, dmg: 7, desc: 'Four blades of scrap orbit you for six seconds, cutting anything close. Smashes cracked walls.' },
    overclock:      { name: 'Overclock', input: 'S + I', cost: 100, desc: DMG },
    titan_coil:     { name: 'Titan Coil', input: 'O (awakening full)', desc: AW },
    junk_comet:     { name: 'Junkyard Comet', dmg: 20, desc: 'every loose piece of metal on the screen, in one ball, from very high up.' }
  });
  NEW.forEach(id => { const u = A[HR[id].ultimate]; u.input = 'W + I (full energy)'; u.cost = 100; u.desc = 'Ultimate: ' + u.desc + ' Costs all three bars, or one while awakened.'; });

  // ---------- helpers ----------
  const hurt = (e, dmg, o) => { const b = e.box(), atk = Object.assign({ team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg, kx: 0, ky: -2, stun: 24, energy: true, heavy: true, hitSet: new Set(), quiet: true }, o || {}); if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); };
  const hit = (x, y, w, h, dmg, o) => SW.strike(G, Object.assign({ team: 'player', x, y, w, h, dmg, kx: 0, ky: -2, stun: 26, energy: true, hitSet: new Set(), quiet: true }, o || {}));
  const around = (z, x, y, r) => z.ents.filter(e => e.hittable && e.team === 'enemy' && !e.dead && Math.hypot(e.x - x, e.y - e.h / 2 - y) < r);
  const light = e => !e.isBoss && !e.isProxy && !(e.def && e.def.heavy);
  const part = (x, y, col, vx, vy, life, s) => fx.list.push({ k: 'p', x, y, vx: vx || 0, vy: vy || 0, g: 0, life: life || 14, max: life || 14, col, s: s || 2 });
  const door = (x, y, col) => { fx.ring(x, y, col || '#e04dff', 3, 20, 12); for (let i = 0; i < 8; i++) part(x + SW.rand(-4, 4), y + SW.rand(-16, 16), i % 2 ? col || '#e04dff' : '#ffffff', SW.rand(-0.6, 0.6), SW.rand(-1, 1), 16); };
  const armCol = p => { const s = art.sheets[p.sheet()], c = s && s.cfg && s.cfg.c; return (c && (c.fore || c.skin)) || '#d8a878'; };

  // ---------- things the abilities put in the world ----------
  class Later { constructor(n, fn) { this.n = n; this.fn = fn; } update(g, z) { if (--this.n <= 0) { this.gone = true; this.fn(g, z); } } draw() {} }
  class Mark extends Later {   // a cut left hanging in the air
    constructor(x, y, n, fn) { super(n, fn); this.x = x; this.y = y; }
    draw(ctx, cam) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), k = this.n % 6 < 3 ? 1 : 0; art.line(ctx, '#5ad6c8', x - 9, y - 9, x + 9, y + 9, 1 + k); art.line(ctx, '#d8fff8', x + 9, y - 9, x - 9, y + 9, 1); }
  }
  class Beam {   // a straight lance across the screen
    constructor(x, y, dir, dmg, col) { Object.assign(this, { x, y, dir, dmg, col, t: 0, len: 330, hs: new Set() }); sfx('zap'); fx.shake(3, 8); }
    update() { this.t++; if (this.t === 4) this.hs.clear(); if (this.t <= 7) hit(this.dir > 0 ? this.x : this.x - this.len, this.y - 9, this.len, 18, this.dmg, { kx: this.dir * 3, breaker: true, heavy: true, hitSet: this.hs, srcX: this.x }); if (this.t > 16) this.gone = true; }
    draw(ctx, cam) { const k = Math.max(1, 8 - Math.abs(this.t - 5)), x = Math.round((this.dir > 0 ? this.x : this.x - this.len) - cam.x), y = Math.round(this.y - cam.y), c = Math.ceil(k / 3); ctx.globalAlpha = SW.clamp((17 - this.t) / 8, 0, 1); art.rect(ctx, this.col, x, y - k, this.len, k * 2); art.rect(ctx, '#ffffff', x, y - c, this.len, c * 2); ctx.globalAlpha = 1; }
  }
  class Ray {    // one arm of a split beam, at an angle
    constructor(x, y, dir, ang, dmg, main) { Object.assign(this, { x, y, dir, ang, dmg, main, t: 0, hs: new Set() }); }
    update() { this.t++; if (this.t <= 6) for (let d = 10; d < 250; d += 14) hit(this.x + this.dir * Math.cos(this.ang) * d - 8, this.y + Math.sin(this.ang) * d - 8, 16, 16, this.dmg, { kx: this.dir * 2, breaker: this.main, hitSet: this.hs, srcX: this.x }); if (this.t > 14) this.gone = true; }
    draw(ctx, cam) { const x0 = this.x - cam.x, y0 = this.y - cam.y, x1 = x0 + this.dir * Math.cos(this.ang) * 250, y1 = y0 + Math.sin(this.ang) * 250; ctx.globalAlpha = SW.clamp((15 - this.t) / 7, 0, 1); art.line(ctx, '#c8d4f0', x0, y0, x1, y1, 3); art.line(ctx, '#ffffff', x0, y0, x1, y1, 1); ctx.globalAlpha = 1; }
  }
  class Decoy {  // a reflection left standing; it shatters
    constructor(p, dmg, life) { Object.assign(this, { sheet: p.sheet(), x: p.x, y: p.y, flip: p.face < 0, dmg, life, t: 0 }); }
    update() { if (++this.t >= this.life) { this.gone = true; boom(this.x, this.y - 16, 48, this.dmg, '#c8d4f0', { freeze: 50 }); fx.debris(this.x, this.y - 16, '#e8f0ff', 14); } }
    draw(ctx, cam) { art.draw(ctx, this.sheet, 'guard', 0, this.x - cam.x, this.y - cam.y, this.flip, { alpha: 0.65, flash: this.t % 10 < 2 || this.life - this.t < 14 }); }
  }
  class Arm {    // a fist on the end of a very long arm: goes out until it hits something, then snaps back
    constructor(p, dmg, o) { Object.assign(this, { p, dmg, dir: p.face, t: 0, len: 0, max: 150, speed: 13, ang: 0, r: 5, back: false, hs: new Set(), col: armCol(p) }, o || {}); sfx('swing'); }
    tip() { return [this.p.x + this.dir * (8 + this.len * Math.cos(this.ang)), this.p.y - 22 + this.len * Math.sin(this.ang)]; }
    update(g, z) {
      const p = this.p; this.t++;
      if (p.dead) { this.gone = true; return; }
      if (this.back) { this.len -= this.speed * 1.5; if (this.len <= 0) this.gone = true; return; }
      this.len += this.speed;
      const q = this.tip(), r = this.r + 5;
      const n = hit(q[0] - r, q[1] - r, r * 2, r * 2, this.dmg, Object.assign({ kx: this.dir * 4, ky: -2, heavy: true, hitSet: this.hs, srcX: p.x }, this.atk || {}));
      const wall = z.hit(q[0] - 3, q[1] - 3, 6, 6, true);
      if (n) { fx.shake(3, 6); sfx('heavy'); }
      if ((n && !this.pierce) || wall || this.len >= this.max) { this.back = true; if (this.onEnd) this.onEnd(g, z, n ? Array.from(this.hs)[0] : null, wall, q); }
    }
    draw(ctx, cam) { const p = this.p, sx = p.x + this.dir * 5 - cam.x, sy = p.y - 22 - cam.y, q = this.tip(), tx = Math.round(q[0] - cam.x), ty = Math.round(q[1] - cam.y); art.line(ctx, '#0a0a12', sx, sy, tx, ty, 5); art.line(ctx, this.col, sx, sy, tx, ty, 3); art.disc(ctx, '#0a0a12', tx, ty, this.r + 1); art.disc(ctx, this.col, tx, ty, this.r); }
  }
  class ArmFx {  // the arm drawn on Bando's ordinary punches
    constructor(p, def) { this.p = p; this.def = def; this.t = 0; this.col = armCol(p); }
    update() { const a = this.def; if (++this.t > a.hitEnd + 4 || this.p.atk !== a || this.p.dead) this.gone = true; }
    draw(ctx, cam) {
      const p = this.p, a = this.def;
      if (this.t < a.hitAt - 1) return;
      const k = this.t <= a.hitEnd ? 1 : Math.max(0, 1 - (this.t - a.hitEnd) / 4), sx = p.x + p.face * 5 - cam.x, sy = Math.round(p.y + a.box[1] + a.box[3] / 2 - cam.y), tx = Math.round(sx + p.face * (a.box[0] + a.box[2] - 8) * k);
      art.line(ctx, '#0a0a12', sx, sy, tx, sy, 5); art.line(ctx, this.col, sx, sy, tx, sy, 3); art.disc(ctx, '#0a0a12', tx, sy, 5); art.disc(ctx, this.col, tx, sy, 4);
    }
  }
  class Rush {   // carries its owner in a straight line, cutting once on the way
    constructor(p, dmg, o) { Object.assign(this, { p, dmg, dir: p.face, t: 0, dist: 96, speed: 12, moved: 0, hs: new Set() }, o || {}); sfx('dash'); }
    update(g, z) {
      const p = this.p; this.t++;
      if (p.dead) { this.gone = true; return; }
      p.iframes = Math.max(p.iframes, 3); p.vy = -SW.GRAV; p.vx = 0;
      let blocked = false;
      for (let s = 0; s < this.speed && this.moved < this.dist; s++) { if (z.hit(p.x + this.dir - p.w / 2, p.y - p.h, p.w, p.h)) { blocked = true; break; } p.x += this.dir; this.moved++; }
      hit(p.x - 24, p.y - 40, 48, 42, this.dmg, Object.assign({ kx: this.dir * 2, ky: -2, stun: 30, heavy: true, hitSet: this.hs, srcX: p.x - this.dir * 12 }, this.atk || {}));
      if (this.t % 2 === 0) fx.ghost(p.sheet(), 'dash', 0, p.x, p.y, p.face < 0);
      if (blocked || this.moved >= this.dist) { this.gone = true; if (this.onEnd) this.onEnd(p); }
    }
    draw() {}
  }
  class Spin {   // Aldric behind a turning greatsword
    constructor(p, dmg) { Object.assign(this, { p, dmg, dir: p.face, t: 0, hs: new Set() }); }
    update(g, z) {
      const p = this.p; this.t++;
      if (p.dead || this.t > 44) { this.gone = true; return; }
      p.iframes = Math.max(p.iframes, 3);
      for (let s = 0; s < 3; s++) { if (z.hit(p.x + this.dir - p.w / 2, p.y - p.h, p.w, p.h)) break; p.x += this.dir; }
      if (this.t % 8 === 1) { const k = (this.t >> 3) % 2; this.hs.clear(); fx.slash(p.x, p.y - 20, k ? 1 : -1, 1 + k, '#fff0c0', 46); sfx('swing'); }
      hit(p.x - 40, p.y - 46, 80, 48, this.dmg, { kx: this.dir * 1.5, ky: -2, stun: 22, breaker: true, hitSet: this.hs, srcX: p.x - this.dir * 10 });
    }
    draw() {}
  }
  class Well {   // a gravity well: travels, pulls, optionally grinds, then bursts
    constructor(x, y, vx, vy, dmg, o) { Object.assign(this, { x, y, vx, vy, dmg, t: 0, r: 70, travel: 40, hold: 50, burst: 1, col: '#9d6cff' }, o || {}); sfx('charge'); }
    update(g, z) {
      this.t++;
      if (this.t <= this.travel) { this.x += this.vx; this.y += this.vy; }
      around(z, this.x, this.y, this.r).forEach(e => {
        if (e.isBoss || (e.def && e.def.heavy)) return;
        if (e.stagger && !e.isProxy) e.stagger(8);
        e.vx = SW.clamp((this.x - e.x) * 0.1, -2.6, 2.6);
        if (e.def && e.def.fly) e.vy = SW.clamp((this.y - e.y + e.h / 2) * 0.1, -2, 2);
      });
      if (this.tick && this.t % this.tick === 0) hit(this.x - this.r * 0.5, this.y - this.r * 0.5, this.r, this.r, this.dmg, { kx: 0, ky: -1, stun: 14, breaker: this.breaker, srcX: this.x });
      if (this.t % 2 === 0) { const a = Math.random() * 6.28; part(this.x + Math.cos(a) * this.r, this.y + Math.sin(a) * this.r * 0.7, this.t % 4 ? this.col : '#ffffff', -Math.cos(a) * 3, -Math.sin(a) * 2, 14); }
      if (this.t > this.travel + this.hold) { this.gone = true; boom(this.x, this.y, Math.round(this.r * 0.6), Math.round(this.dmg * this.burst), this.col, null, { breaker: this.breaker }); }
    }
    draw(ctx, cam) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), k = this.big ? 9 : 5; art.glow(ctx, x, y, k * 4, this.col, 0.16); art.disc(ctx, this.col, x, y, k + 1 + (this.t % 6 < 3 ? 1 : 0)); art.disc(ctx, '#0a0612', x, y, k); art.ring(ctx, '#ffffff', x, y, k + 3 + (this.t % 8)); }
  }
  class Field {  // a bubble of slow time
    constructor(x, y, dmg) { Object.assign(this, { x, y, dmg, t: 0, r: 80 }); sfx('perfect'); }
    update(g, z) {
      this.t++;
      if (this.t % 20 === 1) around(z, this.x, this.y, this.r).forEach(e => hurt(e, Math.max(1, Math.round(this.dmg * 0.15)), { ky: 0, heavy: false, stun: 10, status: { freeze: 34 } }));
      z.shots.forEach(s => { if (s.team === 'enemy' && Math.hypot(s.x - this.x, s.y - this.y) < this.r) { s.gone = true; fx.spark(s.x, s.y, '#ffe4d8', 4, 1.5); } });
      if (this.t > 180) { this.gone = true; boom(this.x, this.y, 60, this.dmg, '#e8a090', { freeze: 60 }, { breaker: true }); }
    }
    draw(ctx, cam) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), a = this.t * 0.05; ctx.globalAlpha = 0.5 + 0.2 * Math.sin(this.t * 0.2); art.ring(ctx, '#e8a090', x, y, this.r); art.ring(ctx, '#ffe4d8', x, y, this.r - 2); ctx.globalAlpha = 1; art.line(ctx, '#ffe4d8', x, y, x + Math.cos(a) * 26, y + Math.sin(a) * 26, 2); art.line(ctx, '#e8a090', x, y, x + Math.cos(a * 12) * 40, y + Math.sin(a * 12) * 40, 1); }
  }
  class Saw {    // out, then home
    constructor(p, dmg) { Object.assign(this, { p, dmg, x: p.x + p.face * 14, y: p.y - 20, vx: p.face * 7.5, t: 0, back: false, hs: new Set() }); sfx('swing'); }
    update() {
      const p = this.p; this.t++;
      if (!this.back) { this.x += this.vx; this.vx *= 0.955; if (this.t >= 24) { this.back = true; this.hs.clear(); } }
      else { const dx = p.x - this.x, dy = p.y - 20 - this.y, m = Math.hypot(dx, dy) || 1; this.x += dx / m * 7; this.y += dy / m * 7; if (m < 14 || this.t > 140) { this.gone = true; return; } }
      hit(this.x - 9, this.y - 9, 18, 18, this.dmg, { kx: Math.sign(this.vx) * 1.5, ky: -1, stun: 22, hitSet: this.hs, srcX: this.x });
      if (this.t % 3 === 0) part(this.x, this.y, '#ffd24a', SW.rand(-1, 1), SW.rand(-1.5, 0), 8, 1);
    }
    draw(ctx, cam) { const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y); art.disc(ctx, '#5a6478', x, y, 8); art.disc(ctx, '#c8ccd8', x, y, 6); art.disc(ctx, '#3a3f4e', x, y, 2); for (let i = 0; i < 6; i++) { const a = this.t * 0.6 + i * 1.047; art.rect(ctx, '#e8ecf4', x + Math.cos(a) * 8 - 1, y + Math.sin(a) * 8 - 1, 2, 2); } }
  }
  class Halo {   // scrap blades in orbit
    constructor(p, dmg) { Object.assign(this, { p, dmg, t: 0, isHalo: true, hs: new Set() }); sfx('charge'); }
    spot(k) { const a = this.t * 0.13 + k * 1.571; return [this.p.x + Math.cos(a) * 36, this.p.y - 18 + Math.sin(a) * 22, a]; }
    update() {
      if (++this.t > 360 || this.p.dead) { this.gone = true; return; }
      if (this.t % 14 === 0) this.hs.clear();
      for (let k = 0; k < 4; k++) { const q = this.spot(k); hit(q[0] - 8, q[1] - 8, 16, 16, this.dmg, { kx: Math.cos(q[2]) * 2, ky: -1, stun: 10, breaker: true, hitSet: this.hs, srcX: this.p.x }); }
    }
    draw(ctx, cam) { if (this.t > 300 && this.t % 8 < 4) return; for (let k = 0; k < 4; k++) { const q = this.spot(k), x = Math.round(q[0] - cam.x), y = Math.round(q[1] - cam.y); art.rect(ctx, '#8aa4c8', x - 4, y - 2, 8, 4); art.rect(ctx, '#e0ecff', x - 3, y - 2, 6, 1); art.rect(ctx, '#d83a3a', x - 1, y - 1, 2, 2); } }
  }
  const R = {
    rift(ctx, x, y, p) { art.disc(ctx, '#e04dff', x, y, 4 + (p.t % 4 < 2 ? 1 : 0)); art.disc(ctx, '#ffffff', x, y, 2); art.glow(ctx, x, y, 12, '#e04dff', 0.16); },
    shard(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; art.rect(ctx, '#c8d4f0', x - 5, y - 1, 10, 3); art.rect(ctx, '#ffffff', x + (d > 0 ? 1 : -5), y - 2, 4, 2); art.glow(ctx, x, y, 8, '#c8d4f0', 0.14); },
    crescent: (col, hi) => (ctx, x, y, p) => { const d = Math.sign(p.vx) || 1, n = p.h >> 1; for (let i = -n; i <= n; i++) { const o = Math.round((n * n - i * i) / (n * 1.6)); art.rect(ctx, Math.abs(i) < n * 0.55 ? hi : col, x + (o - 4) * d, y + i, 4, 1); } art.glow(ctx, x, y, 14, col, 0.12); },
    bullet(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; art.rect(ctx, '#ffd24a', x - 4, y - 1, 8, 2); art.rect(ctx, '#ffffff', x + (d > 0 ? 2 : -4), y - 1, 2, 2); },
    slug(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; art.rect(ctx, '#ff8a3a', x - 9, y - 2, 18, 4); art.rect(ctx, '#ffffff', x + (d > 0 ? 3 : -9), y - 2, 6, 4); art.glow(ctx, x, y, 14, '#ffd24a', 0.2); },
    hand(ctx, x, y, p) { const d = Math.sign(p.vx) || 1; art.rect(ctx, '#e8a090', x - 6, y - 1, 12, 2); art.rect(ctx, '#ffffff', x + (d > 0 ? 4 : -7), y - 2, 3, 4); art.glow(ctx, x, y, 8, '#e8a090', 0.16); },
    junk(ctx, x, y, p) { art.disc(ctx, '#3a3f4e', x, y, 16); art.disc(ctx, '#5a6478', x - 2, y - 2, 12); for (let i = 0; i < 6; i++) { const a = p.t * 0.2 + i * 1.047; art.rect(ctx, i % 2 ? '#c8ccd8' : '#d83a3a', x + Math.cos(a) * 12 - 2, y + Math.sin(a) * 12 - 2, 5, 4); } art.glow(ctx, x, y, 30, '#ff8a3a', 0.14); }
  };

  // ---------- abilities ----------
  Object.assign(CASTS, {
    // Orin
    rift_bolt(p, z, dmg, up) { sfx('shoot'); z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 20, vx: p.face * 6.5, vy: up ? -3.4 : 0, dmg, w: 12, h: 10, life: 46, ghost: true, pierce: true, maxHits: 2, kx: 2, render: R.rift, think() { if (this.t % 2 === 0) puff(this.x, this.y, '#e04dff', 1, 0.3); } })); },
    fold(p, z, dmg) {
      const e = near(z, p.x, p.y - 16, 230), x = p.x + p.face * 28;
      sfx('dash'); door(x, p.y - 18);
      if (!e) { hit(x - 24, p.y - 44, 48, 46, dmg, { kx: p.face * 3, srcX: p.x }); return; }
      door(e.x, e.y - e.h / 2);
      if (light(e)) { e.x = x; e.y = p.y - (e.def && e.def.fly ? 26 : 0); e.vx = 0; e.vy = 0; }
      hurt(e, dmg, { ky: 0, stun: 60, heavy: false, srcX: p.x });
      if (e.stagger && !e.isProxy) e.stagger(60);
    },
    gate_lance(p, z, dmg) { door(p.x + p.face * 14, p.y - 21); z.shots.push(new Beam(p.x + p.face * 14, p.y - 21, p.face, dmg, '#e04dff')); },
    // Mira
    shard_fan(p, z, dmg, up) {
      sfx('swing');
      [-0.2, 0, 0.2].forEach(a => { const ang = (up ? -0.6 : 0) + a; z.shots.push(new Proj({ x: p.x + p.face * 12, y: p.y - 21, vx: p.face * Math.cos(ang) * 7, vy: Math.sin(ang) * 7, dmg, w: 10, h: 8, life: 64, ghost: true, kx: 1, render: R.shard,
        think(g, zz) { if (!zz.hit(this.x + this.vx - 2, this.y + this.vy - 2, 4, 4, true)) return; if (this.b) { this.life = 1; return; } this.b = 1; this.vx = -this.vx; this.hitSet.clear(); sfx('block'); fx.spark(this.x, this.y, '#ffffff', 3, 1.5); } })); });
    },
    reflection(p, z, dmg) { z.shots.push(new Decoy(p, dmg, 100)); p.vx = -p.face * 5.5; p.iframes = Math.max(p.iframes, 12); sfx('perfect'); fx.ring(p.x, p.y - 16, '#ffffff', 4, 26, 12); },
    prism(p, z, dmg) { sfx('zap'); fx.shake(3, 8); [-0.3, 0, 0.3].forEach((a, i) => z.shots.push(new Ray(p.x + p.face * 12, p.y - 22, p.face, a, dmg, i === 1))); },
    // Noct
    unseen_cut(p, z, dmg) {
      const e = near(z, p.x + p.face * 70, p.y - 16, 200), x = e ? e.x : p.x + p.face * 72, y = e ? e.y - e.h / 2 : p.y - 18;
      sfx('swing'); sfx('perfect'); fx.slash(x, y, 1, 1, '#d8fff8', 34); fx.slash(x, y, -1, 2, '#5ad6c8', 34); fx.ghost(p.sheet(), 'a4', 1, x - p.face * 20, e ? e.y : p.y, p.face < 0);
      hit(x - 30, y - 28, 60, 56, dmg, { kx: p.face * 2, stun: 30, heavy: true, srcX: x - p.face * 30 });
    },
    afterimage(p, z, dmg) {
      const x = p.x + p.face * 22, y = p.y - 20, f = p.face;
      sfx('swing'); fx.ghost(p.sheet(), 'a1', 1, x - f * 8, p.y, f < 0);
      z.shots.push(new Mark(x, y, 44, () => {
        sfx('heavy'); fx.shake(4, 8); fx.slash(x, y, f, 1, '#d8fff8', 46); fx.slash(x, y, -f, 2, '#5ad6c8', 46);
        for (let k = 0; k < 2; k++) hit(x - 38, y - 42, 76, 72, dmg, { ky: -7.5, stun: 46, launch: true, heavy: true, srcX: x });
      }));
    },
    null_crescent(p, z, dmg) { sfx('burst'); fx.shake(3, 8); z.shots.push(new Proj({ x: p.x + p.face * 16, y: p.y - 24, vx: p.face * 6, dmg, w: 22, h: 48, life: 60, ghost: true, pierce: true, breaker: true, heavy: true, down: true, kx: 3, ky: -3, render: R.crescent('#101820', '#5ad6c8') })); },
    // Bando
    long_jab(p, z, dmg, up) { z.shots.push(new Arm(p, dmg, { ang: up ? -0.6 : 0 })); },
    sling(p, z, dmg) {
      z.shots.push(new Arm(p, Math.round(dmg * 0.4), { max: 170, atk: { kx: 0, ky: 0, heavy: false, stun: 50 }, onEnd(g, zz, e, wall, q) {
        if (e && e.team === 'enemy' && light(e)) { e.vx = -this.dir * 8; e.vy = -3; if (e.stagger) e.stagger(50); fx.text(e.x, e.y - e.h - 8, 'YANK', '#b6e84a'); }
        else if (e || wall) zz.shots.push(new Rush(p, dmg, { dir: this.dir, dist: Math.max(16, Math.abs(q[0] - p.x) - 14), speed: 11, atk: { kx: this.dir * 5, ky: -3, down: true } }));
      } }));
    },
    wind_up(p, z, dmg) { z.shots.push(new Later(10, () => { fx.shake(6, 12); z.shots.push(new Arm(p, dmg, { max: 104, speed: 21, r: 13, pierce: true, atk: { kx: p.face * 7, ky: -3, down: true, breaker: true, stun: 36 } })); })); for (let i = 0; i < 3; i++) fx.ring(p.x - p.face * 8, p.y - 24, '#ecffc0', 16 - i * 4, 4, 8 + i * 3); },
    // Aldric
    cleave(p, z, dmg) {
      sfx('heavy'); fx.shake(4, 8); fx.slash(p.x + p.face * 14, p.y - 24, p.face, 1, '#fff0c0', 52); fx.dust(p.x + p.face * 30, p.y, 8);
      hit(p.face > 0 ? p.x : p.x - 62, p.y - 58, 62, 58, dmg, { kx: p.face * 4, ky: -3, stun: 30, heavy: true, down: true, srcX: p.x });
      z.shots.push(new SW.Shot({ kind: 'shock', team: 'player', x: p.x + p.face * 34, y: p.y - 5, fy: p.y, vx: p.face * 4.6, dmg: Math.round(dmg * 0.6), life: 44, w: 16, h: 14, col: '#f0e0a0', kx: 2, ky: -5, stun: 34, energy: true, heavy: true, pierce: true }));
    },
    riposte(p, z, dmg) { p.riposteT = 46; p.riposteD = dmg; sfx('perfect'); fx.ring(p.x, p.y - 18, '#f0e0a0', 30, 8, 14); },
    iron_tempest(p, z, dmg) { z.shots.push(new Spin(p, dmg)); },
    // Sen
    draw(p, z, dmg) {
      const calm = p.calmSnap >= 80; p.calmSnap = 0;
      if (calm) { fx.flash('#ffe4ee', 5); fx.text(p.x, p.y - 46, 'TRUE DRAW', '#ffe4ee'); sfx('perfect'); }
      z.shots.push(new Rush(p, calm ? dmg * 2 : dmg, { dist: calm ? 170 : 92, speed: calm ? 22 : 13, onEnd(q) { fx.slash(q.x - q.face * 30, q.y - 20, q.face, 3, '#ffe4ee', calm ? 90 : 54); sfx('swing'); } }));
    },
    falling_leaf(p, z, dmg) {
      sfx('swing'); fx.slash(p.x + p.face * 12, p.y - 24, p.face, 2, '#ffe4ee', 46);
      hit(p.face > 0 ? p.x - 4 : p.x - 52, p.y - 62, 56, 62, dmg, { kx: p.face * 0.6, ky: -9, stun: 50, launch: true, heavy: true, srcX: p.x });
      p.vy = -7.6; p.onGround = false; p.y -= 1;
    },
    three_breaths(p, z, dmg) {
      [0, 9, 18].forEach((d, i) => z.shots.push(new Later(d + 1, () => { sfx('swing'); z.shots.push(new Proj({ x: p.x + p.face * 16, y: p.y - 22 + (i - 1) * 5, vx: p.face * 8, dmg: i === 2 ? dmg * 2 : dmg, w: 18, h: i === 2 ? 44 : 32, life: 44, ghost: true, pierce: true, breaker: i === 2, heavy: i === 2, kx: 2, render: R.crescent('#ffa0c0', '#ffffff') })); })));
    },
    // Vega
    heavy_star(p, z, dmg, up) { z.shots.push(new Well(p.x + p.face * 14, p.y - 22, p.face * 3.2, up ? -2 : 0, dmg, { burst: 1.4 })); },
    crush(p, z, dmg) {
      sfx('explode'); fx.shake(7, 14); fx.ring(p.x, p.y - 16, '#9d6cff', 120, 10, 16); fx.dust(p.x, p.y, 10);
      around(z, p.x, p.y - 16, 120).forEach(e => { const air = e.onGround === false; hurt(e, Math.round(dmg * (air ? 1.5 : 1)), { ky: 9, stun: 46, down: true, srcX: p.x }); if (!e.isProxy) e.vy = 8; fx.bolt(e.x, e.y - e.h - 40, e.x, e.y - e.h, '#e4d8ff'); });
    },
    singularity(p, z, dmg) { z.shots.push(new Well(p.x + p.face * 20, p.y - 24, p.face * 1.4, 0, dmg, { r: 110, travel: 120, hold: 0, tick: 11, breaker: true, burst: 3, big: true })); },
    // Tessa
    stopwatch(p, z, dmg, up) { sfx('shoot'); z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 21, vx: p.face * 8, vy: up ? -4.4 : 0, dmg, w: 12, h: 6, life: 44, kx: 1, status: { freeze: 150 }, render: R.hand })); },
    rewind(p) {
      const h = p.hist && p.hist[0], S = G.state;
      if (!h) return;
      for (let i = 0; i < p.hist.length; i += 3) fx.ghost(p.sheet(), 'run', i % 8, p.hist[i].x, p.hist[i].y, p.face < 0);
      fx.ring(p.x, p.y - 16, '#e8a090', 30, 4, 12);
      p.x = h.x; p.y = h.y; p.vx = 0; p.vy = 0; p.iframes = Math.max(p.iframes, 24);
      if (h.hp > S.hp) { fx.text(p.x, p.y - 44, '+' + Math.round(h.hp - S.hp), '#7dffa0'); S.hp = h.hp; }
      p.hist = [h]; sfx('perfect'); fx.ring(p.x, p.y - 16, '#ffe4d8', 4, 30, 14);
    },
    slow_hour(p, z, dmg) { z.shots.push(new Field(p.x + p.face * 60, p.y - 20, dmg)); },
    // Jax
    quick_shot(p, z, dmg, up) {
      p.cyl = (p.cyl || 0) + 1;
      const dead = p.cyl % 6 === 0;
      sfx('shoot');
      if (dead) { fx.shake(3, 6); fx.text(p.x, p.y - 44, 'DEAD-EYE', '#ffd0a8'); sfx('heavy'); }
      z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 21, vx: p.face * 11, vy: up ? -5 : 0, dmg: dead ? dmg * 3 : dmg, w: dead ? 18 : 8, h: dead ? 10 : 6, life: 30, ghost: dead, pierce: dead, heavy: dead, kx: dead ? 5 : 1.5, render: dead ? R.slug : R.bullet }));
    },
    trick_shot(p, z, dmg) {
      sfx('shoot');
      z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 21, vx: p.face * 9, vy: -2.5, dmg, w: 8, h: 8, life: 150, ghost: true, pierce: true, maxHits: 4, kx: 2, n: 0, render: R.bullet,
        think(g, zz) {
          if (!zz.hit(this.x + this.vx - 2, this.y + this.vy - 2, 4, 4, true)) return;
          if (++this.n > 4) { this.life = 1; return; }
          const e = near(zz, this.x, this.y, 260); this.hitSet.clear(); sfx('block'); fx.spark(this.x, this.y, '#ffd24a', 4, 2);
          if (e) { const dx = e.x - this.x, dy = e.y - e.h / 2 - this.y, m = Math.hypot(dx, dy) || 1; this.vx = dx / m * 9; this.vy = dy / m * 9; }
          else if (zz.hit(this.x + this.vx - 2, this.y - 2, 4, 4, true)) this.vx = -this.vx; else this.vy = -this.vy;
        } }));
    },
    fan_hammer(p, z, dmg) {
      for (let i = 0; i < 6; i++) z.shots.push(new Later(1 + i * 4, () => {
        const last = i === 5; sfx('shoot'); p.vx = -p.face * 0.8;
        z.shots.push(new Proj({ x: p.x + p.face * 14, y: p.y - 21, vx: p.face * 10, vy: SW.rand(-1.6, 1.6), dmg, w: 8, h: 6, life: 34, kx: 1.5, render: last ? R.slug : R.bullet, onEnd() { if (last) boom(this.x, this.y, 34, dmg * 2, '#ffd24a', null, { breaker: true }); } }));
      }));
    },
    // Ferra
    sawback(p, z, dmg) { z.shots.push(new Saw(p, dmg)); },
    polarity(p, z, dmg) {
      p.pole = !p.pole;
      const inn = p.pole;
      sfx('zap'); fx.shake(4, 8); fx.ring(p.x, p.y - 16, inn ? '#2c6fbf' : '#d83a3a', inn ? 150 : 8, inn ? 8 : 150, 16); fx.text(p.x, p.y - 46, inn ? 'PULL' : 'PUSH', inn ? '#8aa4c8' : '#ff8a8a');
      around(z, p.x, p.y - 16, 150).forEach(e => { const d = Math.sign(e.x - p.x) || p.face; hurt(e, inn ? Math.round(dmg * 0.6) : dmg, { ky: inn ? -2 : -4, stun: inn ? 44 : 30, heavy: !inn, down: !inn, srcX: p.x }); e.vx = inn ? -d * 6.5 : d * 8; });
    },
    scrap_halo(p, z, dmg) { z.shots.forEach(s => { if (s.isHalo) s.gone = true; }); z.shots.push(new Halo(p, dmg)); }
  });

  // ---------- ultimates (each runs over the ~70 frames of the "ult" state) ----------
  const every = (p, a, b, n) => p.st >= a && p.st <= b && (p.st - a) % n === 0;
  const ULT = {
    thousand_doors(p, z, foes, dmg) {
      if (p.st === 6) fx.flash('#f7d0ff', 8);
      if (every(p, 10, 58, 8)) { sfx('zap'); foes.forEach(e => { const b = e.box(), d = (p.st >> 3) % 2 ? 1 : -1, x = b.x + b.w / 2 + d * 44, y = b.y + b.h / 2 + SW.rand(-10, 10); door(x, y); fx.bolt(x, y, b.x + b.w / 2, b.y + b.h / 2, '#e04dff'); hurt(e, dmg, { ky: -1, stun: 30 }); }); }
      if (p.st === 64) { fx.flash('#e04dff', 8); fx.shake(8, 14); sfx('explode'); foes.forEach(e => hurt(e, dmg * 3, { ky: -6, down: true })); }
    },
    seven_years(p, z, foes, dmg) {
      if (p.st === 6) { fx.flash('#ffffff', 10); sfx('perfect'); for (let i = 0; i < 9; i++) fx.bolt(G.cam.x + SW.rand(0, W), G.cam.y, G.cam.x + SW.rand(0, W), G.cam.y + H, '#c8d4f0'); }
      if (every(p, 12, 54, 7)) { sfx('swing'); foes.forEach(e => { const b = e.box(), cx = b.x + b.w / 2, cy = b.y + b.h / 2, a = Math.random() * 6.28; fx.bolt(cx + Math.cos(a) * 70, cy + Math.sin(a) * 50, cx, cy, '#ffffff'); hurt(e, dmg, { ky: -1, stun: 30 }); }); }
      if (p.st === 64) { fx.flash('#ffffff', 8); fx.shake(9, 16); sfx('explode'); foes.forEach(e => { const b = e.box(); fx.debris(b.x + b.w / 2, b.y + b.h / 2, '#e8f0ff', 12); hurt(e, dmg * 3, { ky: -5, down: true, status: { freeze: 60 } }); }); }
    },
    hundred_hands(p, z, foes, dmg) {
      const col = armCol(p);
      if (every(p, 8, 60, 3)) { const tg = foes.length ? foes[(p.st / 3 | 0) % foes.length] : null, x = tg ? tg.x + SW.rand(-10, 10) : G.cam.x + SW.rand(30, W - 30), y = tg ? tg.y - tg.h / 2 + SW.rand(-8, 8) : p.y - SW.rand(10, 70), sx = SW.rand(0, 1) < 0.5 ? G.cam.x - 10 : G.cam.x + W + 10; fx.list.push({ k: 'b', pts: [[sx, y + SW.rand(-30, 30)], [x, y]], col, life: 6, max: 6 }); fx.ring(x, y, col, 3, 12, 6); sfx('swing'); }
      if (every(p, 8, 60, 6)) foes.forEach(e => hurt(e, dmg, { ky: -1.5, stun: 30 }));
      if (p.st === 66) { fx.flash('#ecffc0', 8); fx.shake(10, 16); sfx('explode'); foes.forEach(e => { fx.ring(e.x, e.y - e.h / 2, col, 6, 40, 12); hurt(e, dmg * 4, { ky: -7, down: true }); }); }
    },
    skysplitter(p, z, foes, dmg) {
      if (p.st === 8) { sfx('roar'); fx.flash('#fff0c0', 8); }
      if (p.st === 14 || p.st === 32 || p.st === 50) { fx.shake(7, 12); sfx('heavy'); foes.forEach(e => { z.shots.push(new SW.Geyser(e.x, e.y, 0, '#f0e0a0')); hurt(e, dmg, { ky: -6, stun: 36, down: p.st === 50 }); }); if (!foes.length) z.shots.push(new SW.Geyser(p.x + p.face * 60, p.y, 0, '#f0e0a0')); }
      if (p.st === 52) for (const s of [-1, 1]) z.shots.push(new SW.Shot({ kind: 'shock', team: 'player', x: p.x + s * 20, y: p.y - 5, fy: p.y, vx: s * 5, dmg, life: 60, w: 16, h: 14, col: '#f0e0a0', kx: 2, ky: -6, stun: 40, energy: true, heavy: true, pierce: true }));
    },
    single_stroke(p, z, foes, dmg) {
      if (p.st === 10 || p.st === 22 || p.st === 34) { const d = p.st === 22 ? -1 : 1; sfx('dash'); for (let i = 0; i < 8; i++) fx.ghost(p.sheet(), 'dash', 0, G.cam.x + (d > 0 ? i : 7 - i) * 60 + 30, p.y, d < 0); fx.list.push({ k: 'b', pts: [[G.cam.x - 10, p.y - 20], [G.cam.x + W + 10, p.y - 20]], col: '#ffe4ee', life: 8, max: 8 }); foes.forEach(e => { fx.slash(e.x, e.y - e.h / 2, d, 3, '#ffa0c0', 30); hurt(e, Math.round(dmg * 0.5), { ky: 0, stun: 40, heavy: false }); }); }
      if (p.st === 60) { fx.flash('#ffffff', 10); fx.shake(9, 16); sfx('explode'); sfx('perfect'); foes.forEach(e => { fx.slash(e.x, e.y - e.h / 2, 1, 1, '#ffffff', 44); fx.slash(e.x, e.y - e.h / 2, -1, 2, '#ffa0c0', 44); hurt(e, dmg * 6, { ky: -5, down: true }); }); }
    },
    event_horizon(p, z, foes, dmg) {
      if (p.st === 8) { sfx('charge'); fx.flash('#e4d8ff', 8); foes.forEach(e => { if (e.stagger && !e.isProxy) e.stagger(70); if (light(e)) { e.vy = -5; e.onGround = false; e.y -= 2; } }); }
      if (p.st > 8 && p.st < 46) foes.forEach(e => { if (light(e)) e.vy = Math.min(e.vy, -0.45); if (p.st % 4 === 0) part(e.x + SW.rand(-10, 10), e.y, '#9d6cff', 0, -2, 12); });
      if (p.st === 46) { fx.flash('#9d6cff', 8); fx.shake(11, 18); sfx('explode'); foes.forEach(e => { if (!e.isProxy) e.vy = 9; hurt(e, dmg * 5, { ky: 9, stun: 50, down: true }); fx.bolt(e.x, e.y - e.h - 60, e.x, e.y, '#e4d8ff'); }); }
    },
    stopped_clock(p, z, foes, dmg) {
      if (p.st === 8) { fx.flash('#ffe4d8', 12); sfx('perfect'); foes.forEach(e => hurt(e, 1, { ky: 0, heavy: false, stun: 10, status: { freeze: 200 } })); }
      if (every(p, 14, 56, 6)) { sfx('swing'); foes.forEach((e, i) => { const s = ((p.st / 6 | 0) + i) % 2 ? 1 : -1; fx.ghost(p.sheet(), 'a2', 1, e.x - s * 16, e.y, s < 0); fx.slash(e.x, e.y - e.h / 2, s, (p.st / 6 | 0) % 3 + 1, '#ffe4d8', 26); hurt(e, dmg, { ky: 0, stun: 30, heavy: false }); }); }
      if (p.st === 64) { fx.flash('#e8a090', 8); fx.shake(8, 14); sfx('explode'); foes.forEach(e => hurt(e, dmg * 3, { ky: -6, down: true })); }
    },
    high_noon(p, z, foes, dmg) {
      if (p.st === 6) { fx.flash('#ffd0a8', 6); sfx('roar'); }
      if (every(p, 8, 30, 6)) foes.forEach(e => fx.ring(e.x, e.y - e.h / 2, '#ff5a5a', 22 - (p.st - 8) / 2, 6, 6));
      if (every(p, 36, 66, 6)) { const last = p.st === 66; sfx('shoot'); if (last) sfx('explode'); fx.shake(last ? 8 : 3, 6); foes.forEach(e => { const b = e.box(); fx.list.push({ k: 'b', pts: [[p.x + p.face * 12, p.y - 21], [b.x + b.w / 2, b.y + b.h / 2]], col: '#ffd24a', life: 5, max: 5 }); hurt(e, last ? dmg * 2 : dmg, { ky: last ? -5 : -1, stun: 30, down: last, kx: p.face }); }); }
    },
    junk_comet(p, z, foes, dmg) {
      if (p.st === 6) sfx('charge');
      if (p.st >= 8 && p.st < 44 && p.st % 2 === 0) { const x = G.cam.x + SW.rand(0, W), y = G.cam.y + SW.rand(60, H - 30), tx = p.x + p.face * 70, ty = G.cam.y + 10; part(x, y, p.st % 4 ? '#8aa4c8' : '#d83a3a', (tx - x) / 14, (ty - y) / 14, 14, 3); }
      if (p.st === 44) { const tg = foes[0], x = tg ? tg.x : p.x + p.face * 80; sfx('roar'); z.shots.push(new Proj({ x, y: G.cam.y - 10, vy: 9, dmg: Math.round(dmg * 0.5), w: 30, h: 30, life: 60, ghost: true, render: R.junk, think(g, zz) { if (this.y > p.y - 24 || zz.hit(this.x - 3, this.y + 12, 6, 6, true)) this.life = 1; }, onEnd() { fx.flash('#ffd0a8', 8); fx.shake(12, 20); boom(this.x, this.y, 90, dmg * 5, '#ff8a3a', null, { breaker: true, down: true }); fx.debris(this.x, this.y, '#8aa4c8', 24); } })); }
      if (p.st === 58) foes.forEach(e => hurt(e, dmg, { ky: -4, stun: 30 }));
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
  const ATK = { attack: 1, airatk: 1, cast: 1, rush: 1, wave: 1, ult: 1 };
  function onPerfect(p, g) {
    const h = g.hero(), S = g.state;
    if (h.trait === 'phase') {
      p.phaseT = h.phase; p.ambushT = 0;
      sfx('djump'); fx.flash(h.color, 5); fx.ring(p.x, p.y - 16, h.colorHi, 6, 60, 20); fx.text(p.x, p.y - 54, 'BETWEEN WORLDS', h.colorHi); door(p.x, p.y - 18, h.color);
      if (h.decoy && g.zone) g.zone.shots.push(new Decoy(p, Math.round(14 * p.skillMul()), 70));
    } else if (h.trait === 'bulwark') counter(p, g, Math.round(18 * p.comboMul()));
    else if (h.trait === 'rewind' && g.zone) { fx.ring(p.x, p.y - 16, h.colorHi, 6, 70, 18); around(g.zone, p.x, p.y - 16, 90).forEach(e => hurt(e, 2, { ky: 0, heavy: false, stun: 10, status: { freeze: 70 } })); }
    if (g.scene === 'play') { S.counts.perfect = (S.counts.perfect || 0) + 1; if (S.counts.perfect >= 5) g.achieve('perfect_5'); }
  }
  function counter(p, g, dmg) {
    const h = g.hero();
    sfx('heavy'); fx.shake(5, 10); fx.slash(p.x + p.face * 14, p.y - 24, p.face, 1, h.colorHi, 58); fx.text(p.x, p.y - 54, 'COUNTER', h.colorHi);
    p.iframes = Math.max(p.iframes, 16);
    hit(p.face > 0 ? p.x - 6 : p.x - 66, p.y - 56, 72, 58, dmg, { kx: p.face * 6, ky: -4, stun: 44, heavy: true, down: true, srcX: p.x });
  }
  const _th = P.takeHit; P.takeHit = function (atk, g) {
    const h = g.hero();
    if (this.phaseT > 0) return 'none';                                        // between worlds: nothing lands
    if (this.riposteT > 0 && !this.dead && this.invuln <= 0 && this.iframes <= 0 && !g.busy()) {
      const d = Math.max(1, Math.ceil(atk.dmg * 0.25)), sx = atk.srcX === undefined ? this.x + this.face : atk.srcX;
      this.riposteT = 0; g.state.hp -= d; fx.text(this.x, this.y - 40, '-' + d, '#c8ccd8'); this.face = sx >= this.x ? 1 : -1;
      if (g.state.hp <= 0) { this.die(); return 'hit'; }
      counter(this, g, Math.round(this.riposteD || 20));
      return 'block';
    }
    // these heroes get a wider perfect-guard window (not in Versus, where the bot's timing is already tuned)
    if (h.window && g.scene !== 'vs' && this.state === 'guard' && !atk.unblockable && this.guardT > 6 && this.guardT <= h.window) this.guardT = 6;
    const r = _th.call(this, atk, g);
    if (r === 'perfect') onPerfect(this, g);
    return r;
  };
  const _up = P.update; P.update = function (g, z) {
    const h = g.hero(), tr = h.trait, s0 = this.state, calm = this.calmT || 0;
    _up.call(this, g, z);
    if (g.player !== this && g.scene !== 'vs') return;                         // the zone changed under us
    const now = ATK[this.state];
    if (this.phaseT > 0) {
      this.phaseT--;
      if (this.t % 3 === 0) part(this.x + SW.rand(-8, 8), this.y - SW.rand(0, 32), this.t % 6 ? h.color : '#ffffff', 0, -0.8, 12, 1);
      if (now) { this.phaseT = 0; this.ambushT = 50; fx.ring(this.x, this.y - 16, h.colorHi, 40, 6, 10); fx.text(this.x, this.y - 54, 'AMBUSH', h.colorHi); sfx('perfect'); }
      else if (this.phaseT === 0) { fx.ring(this.x, this.y - 16, h.color, 6, 30, 12); sfx('back'); }
    }
    if (this.ambushT > 0) this.ambushT--;
    if (this.riposteT > 0 && --this.riposteT === 0) { g.state.energy = Math.min(300, g.state.energy + 25); fx.text(this.x, this.y - 44, 'nothing came', '#8a92b8'); }
    if (tr === 'draw') { if (now) { if (!ATK[s0]) this.calmSnap = calm; this.calmT = 0; } else this.calmT = Math.min(120, calm + 1); }
    if (tr === 'float' && !this.onGround && this.vy > 0.9 && I.held('jump') && (this.state === 'jump' || this.state === 'fall')) { this.vy = 0.9; if (this.t % 4 === 0) part(this.x + SW.rand(-6, 6), this.y, h.color, 0, 0.8, 10, 1); }
    if (tr === 'rewind' && this.onGround && !this.onPlat && this.t % 6 === 0) { const hs = this.hist || (this.hist = []); hs.push({ x: this.x, y: this.y, hp: g.state.hp }); if (hs.length > 30) hs.shift(); }
  };
  const _dm = P.dmgMul; P.dmgMul = function () { const h = this.G.hero(); return _dm.call(this) * (h.legend ? MIGHT : 1) * (this.ambushT > 0 ? h.ambush || 1.5 : 1); };
  const _hm = P.hpMax; P.hpMax = function () { return Math.round(_hm.call(this) * (this.G.hero().legend ? TOUGH : 1)); };
  const _ng = G.newGame; G.newGame = function (hero) { _ng(hero); if (G.state && G.player && HR[hero] && HR[hero].legend) G.state.hp = G.player.hpMax(); };   // a legend starts at full (larger) health
  const _sa = P.startAttack; P.startAttack = function (def, air) { _sa.call(this, def, air); const g = this.G; if (g.hero().trait === 'reach' && g.zone && C.stretch.indexOf(def) >= 0) g.zone.shots.push(new ArmFx(this, def)); };
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    const h = g.hero();
    if (this.phaseT > 0) { ctx.globalAlpha = 0.4 + 0.1 * Math.sin(this.t * 0.4); _pd.call(this, ctx, cam, g); ctx.globalAlpha = 1; art.ring(ctx, h.color, Math.round(this.x - cam.x), Math.round(this.y - cam.y - 16), 18 + (this.t % 12)); return; }
    _pd.call(this, ctx, cam, g);
    const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
    if (this.riposteT > 0) { art.ring(ctx, h.colorHi, x, y - 18, 20); art.rect(ctx, h.color, x + this.face * 12 - 1, y - 34, 3, 30); }
    if (h.trait === 'draw' && this.calmT >= 80 && this.t % 20 < 14) { art.rect(ctx, '#ffffff', x - 1, y - 46, 3, 1); art.rect(ctx, '#ffffff', x, y - 47, 1, 3); }
  };
  // story HUD: time left between worlds, Sen's calm, Jax's cylinder
  const _hud = ui.hud; ui.hud = function (ctx, g) {
    _hud(ctx, g);
    const p = g.player, h = g.hero();
    if (!p) return;
    let y = p.modeT > 0 ? 54 : 44;
    if (p.phaseT > 0) { text(ctx, 'BETWEEN WORLDS ' + Math.ceil(p.phaseT / 60) + ' - attack to return', 10, y, h.colorHi); y += 10; }
    if (p.ambushT > 0) { text(ctx, 'AMBUSH x' + (h.ambush || 1.5), 10, y, '#ffffff'); y += 10; }
    if (h.trait === 'draw' && p.calmT >= 80) text(ctx, 'CALM - the next Draw is a true draw', 10, y, h.colorHi);
    if (h.trait === 'cylinder' && g.has(h.kit[0])) { const n = (p.cyl || 0) % 6; for (let i = 0; i < 6; i++) art.rect(ctx, i < n ? '#3a3d55' : i === 5 ? '#ffffff' : h.colorHi, 10 + i * 6, y + 1, 4, 5); }
  };
  const _oh = G.onHit; G.onHit = function (atk, e, b) {
    _oh(atk, e, b);
    const h = G.hero();
    if (h.spark && atk.energy) { const x = b.x + b.w / 2, y = b.y + b.h / 2; for (let i = 0; i < 4; i++) fx.list.push({ k: 'p', x, y, vx: SW.rand(-2, 2), vy: SW.rand(-2.5, 0.5), g: 0.1, life: 16, max: 16, col: i % 2 ? h.colorHi : h.color, s: 2 }); }
    if (h.legend && !atk.energy && G.scene === 'play') G.state.energy = Math.min(300, G.state.energy + 3);   // legends build energy half again as fast
    if (G.scene === 'play' && G.combo && G.combo.n >= 40) G.achieve('combo_40');
  };

  // ---------- how each one is unlocked (in the story and in Versus alike) ----------
  Object.assign(D.achievements, {
    perfect_5:   { name: 'Not There', desc: 'Land 5 perfect guards in the story', hero: 'orin' },
    secret_1:    { name: 'Through the Glass', desc: "Find any hero's Act 2 secret", hero: 'mira' },
    act2_done:   { name: 'What the Relay Fed', desc: 'Finish Act 2, chapter 1', hero: 'noct' },
    baron_down:  { name: 'Toll Paid', desc: 'Bring down the Scrap Baron', hero: 'bando' },
    level_12:    { name: 'Veteran', desc: 'Reach level 12', hero: 'aldric' },
    combo_40:    { name: 'One Breath', desc: 'Land a 40-hit combo', hero: 'sen' },
    shards_8:    { name: 'Stargazer', desc: 'Find 8 hidden Memory Shards', hero: 'vega' },
    tutorials_3: { name: 'Three Mornings', desc: "Finish three different heroes' tutorials", hero: 'tessa' },
    creds_1500:  { name: 'Big Score', desc: 'Hold 1500 creds at once', hero: 'jax' },
    upg_12:      { name: 'Scrap Queen', desc: 'Buy 12 upgrade levels', hero: 'ferra' }
  });
  const _st = G.step; G.step = function (key) {
    _st(key);
    if (G.scene !== 'play' || !G.state) return;
    if (key === 'A2-3:shard') G.achieve('act2_done');
    if (key === 'A2-2:boss') G.achieve('baron_down');
    if (/^[A-Z]1-1:(boss|tusk|warden)$/.test(key)) { const pr = SW.profile; pr.tuts = pr.tuts || {}; if (!pr.tuts[G.state.hero]) { pr.tuts[G.state.hero] = 1; if (SW.saveProfile) SW.saveProfile(); } if (Object.keys(pr.tuts).length >= 3) G.achieve('tutorials_3'); }
  };
  const _xp = G.addXP; G.addXP = function (n) { _xp(n); if (G.scene === 'play' && G.state && G.state.level >= 12) G.achieve('level_12'); };
  const _ms = G.minorShard; G.minorShard = function () { _ms(); if (G.state.minor >= 8) G.achieve('shards_8'); };
  const _sg = G.saveGame; G.saveGame = function () { _sg(); if (G.scene === 'play' && G.state && G.state.creds >= 1500) G.achieve('creds_1500'); };
  const _pu = ui.pauseUpdate; ui.pauseUpdate = function (g) { _pu(g); const u = (g.state && g.state.upg) || {}; if (Object.keys(u).reduce((s, k) => s + u[k], 0) >= 12) g.achieve('upg_12'); };
  if (SW.story) { const _fd = SW.story.found; SW.story.found = function (id) { _fd(id); if (G.state && G.state.secrets && G.state.secrets[id]) G.achieve('secret_1'); }; }

  // ---------- hero grid for more than ten heroes (story select and Versus share it) ----------
  const _grid = ui.heroGrid;
  ui.heroGrid = function (ctx, o) {
    const n = D.heroOrder.length;
    if (n <= 10 || !_grid) return _grid(ctx, o);
    const cols = 10, rows = Math.ceil(n / cols), cw = 46, ch = Math.min(100, Math.floor(204 / rows) - 2), bg = art.bg.title;
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.globalAlpha = 0.8; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    text(ctx, o.title, W / 2, 7, '#ffffff', { align: 'center', scale: 2 });
    D.heroOrder.forEach((id, i) => {
      const h = HR[id], x = 10 + (i % cols) * cw, y = 28 + Math.floor(i / cols) * (ch + 2), open = o.open(id) && !lockedVs(id), img = art.bg['hero_' + id];
      const who = o.cursors.map((c, k) => (c === i ? k : -1)).filter(k => k >= 0), on = who.length > 0;
      ui.panel(ctx, x, y, cw - 2, ch, on ? o.colors[who[0]] : '#3a3d55', 0.85);
      ctx.save(); ctx.beginPath(); ctx.rect(x + 1, y + 1, cw - 4, ch - 2); ctx.clip();
      ctx.globalAlpha = open ? (on ? 1 : 0.6) : 0.16;
      if (img) ctx.drawImage(img, h.gridX || 27, 14, cw - 4, ch - 2, x + 1, y + 1, cw - 4, ch - 2);   // gridX: where the tile's window starts in a portrait whose face is off-centre
      else { art.rect(ctx, art.shade(h.color, 0.22), x + 1, y + 1, cw - 4, ch - 2); const k = ch < 80 ? 1.5 : 2; ctx.translate(x + cw / 2 - 1, y + ch - (ch < 80 ? 13 : 16)); ctx.scale(k, k); art.draw(ctx, h.sheet, on ? 'run' : 'idle', on ? Math.floor(SW.frame / 5) % 8 : Math.floor(SW.frame / 28) % 2, 0, 0, false); }
      ctx.restore(); ctx.globalAlpha = 0.78; art.rect(ctx, '#05060c', x + 1, y + ch - 12, cw - 4, 11); ctx.globalAlpha = 1;
      // a locked card says LOCKED, or shows a padlock when the translated word is wider than the card (Spanish BLOQUEADO)
      if (open || SW.textW('LOCKED') <= cw - 6) text(ctx, open ? h.name.toUpperCase() : 'LOCKED', x + cw / 2 - 1, y + ch - 11, open ? (on ? h.color : '#c8ccd8') : '#ff5a5a', { align: 'center' });
      else { const px = x + cw / 2 - 4, py = y + ch - 11; art.rect(ctx, '#ff5a5a', px + 1, py, 5, 1); art.rect(ctx, '#ff5a5a', px + 1, py, 1, 4); art.rect(ctx, '#ff5a5a', px + 5, py, 1, 4); art.rect(ctx, '#ff5a5a', px, py + 4, 7, 5); art.rect(ctx, '#05060c', px + 3, py + 5, 1, 2); }
      if (h.legend) { art.rect(ctx, '#f5c542', x + cw - 9, y + 3, 5, 5); art.rect(ctx, '#fff7d0', x + cw - 8, y + 4, 3, 3); }   // legend mark
      who.forEach(k => { if (o.tags[k]) { ui.panel(ctx, x + 1 + k * 22, y + 2, 20, 11, o.colors[k], 0.9); text(ctx, o.tags[k], x + 11 + k * 22, y + 4, '#ffffff', { align: 'center' }); } });
    });
  };
  ui.gridMove = function (i, l, r, u, d) { const n = D.heroOrder.length, c = n > 10 ? 10 : 5; if (l) i = (i + n - 1) % n; if (r) i = (i + 1) % n; if (u) i = (i - c + n) % n; if (d) i = (i + c) % n; return i; };
  const _ds = ui.drawSelect; ui.drawSelect = function (ctx, g) {
    _ds(ctx, g);
    const h = HR[D.heroOrder[ui.sel.i]];
    if (h && D.heroOrder.length > 10 && g.unlocked(D.heroOrder[ui.sel.i]) && typeof ui.sel.code !== 'string') text(ctx, h.element + (h.legend ? '   LEGEND: +50% damage, +40% health' : ''), W - 10, 245, h.legend ? '#f5c542' : h.color, { align: 'right' });
  };

  // ---------- legends stay locked in Versus (PvP and PvB, either side) until earned or opened with the code ----------
  // the Hidden Clans (ninja-core.js, `clan`) open only with the unlock code; the legends also by their story feat
  const lockedVs = id => !!(HR[id] && (HR[id].clan ? !(SW.profile && SW.profile.all) : HR[id].legend && !G.unlocked(id)));
  SW.lockedVs = lockedVs;
  const V = SW.versus;
  let vsCode = null, vsMsg = '', vsMsgT = 0;
  if (V && V.update && V.draw) {
    const _vu = V.update; V.update = function (g) {
      if (V.phase === 'pick') {
        if (vsMsgT > 0) vsMsgT--;
        if (typeof vsCode === 'string') {                                      // typing the unlock code
          I.keys.splice(0).forEach(k => { if (/^[0-9]$/.test(k) && vsCode.length < 4) { vsCode += k; sfx('move'); } else if (k === 'Backspace') vsCode = vsCode.slice(0, -1); });
          if (I.hit('pause')) { vsCode = null; sfx('back'); }
          else if (vsCode.length === 4) {
            if (SW.codeHash(vsCode) === D.unlockHash) { SW.profile.all = true; SW.saveProfile(); vsCode = null; vsMsg = 'ALL HEROES UNLOCKED'; vsMsgT = 240; sfx('level'); sfx('shard'); }
            else { vsCode = ''; vsMsg = 'Wrong code.'; vsMsgT = 150; sfx('deny'); }
          }
          return;
        }
        if (I.ok() && lockedVs(D.heroOrder[V.pick[V.step]])) { sfx('deny'); vsCode = ''; I.keys.length = 0; return; }   // not yours yet: offer the code instead
      }
      _vu(g);
      if (V.phase === 'pick' && I.hit('skill') && lockedVs(D.heroOrder[V.pick[V.step]])) {   // "random" never lands on a locked legend
        const open = D.heroOrder.map((h, i) => i).filter(i => !lockedVs(D.heroOrder[i]));
        V.pick[V.step] = open[Math.random() * open.length | 0];
      }
    };
    const _vd = V.draw; V.draw = function (ctx, g) {
      _vd(ctx, g);
      if (V.phase !== 'pick') return;
      const id = D.heroOrder[V.pick[V.step]], h = HR[id];
      if (typeof vsCode === 'string') {
        ui.drawCode(ctx, vsCode);
        if (h && h.need && D.achievements[h.need]) text(ctx, 'Or earn ' + h.name + ' in the story: ' + D.achievements[h.need].desc + '.', W / 2, 196, '#f5c542', { align: 'center' });
        if (vsMsgT > 0) text(ctx, vsMsg, W / 2, 208, '#ff8a8a', { align: 'center' });
      } else if (lockedVs(id)) {
        ui.panel(ctx, 6, 230, W - 12, 34, '#ff5a5a', 0.96);
        if (h.clan) { text(ctx, 'HIDDEN CLANS - LOCKED', 12, 234, '#ff5a5a'); text(ctx, 'The Hidden Clans open only with the unlock code.', 12, 244, '#ffffff'); }
        else { text(ctx, 'LEGEND HERO - LOCKED', 12, 234, '#ff5a5a'); text(ctx, 'Earn it in the story: ' + (h.need && D.achievements[h.need] ? D.achievements[h.need].desc : '?') + '.', 12, 244, '#ffffff'); }
        text(ctx, 'J / Enter: type the unlock code     A D W S: choose another', 12, 254, '#8a92b8');
      } else if (vsMsgT > 0) { ui.panel(ctx, W / 2 - 90, 214, 180, 14, '#7dffa0', 0.95); text(ctx, vsMsg, W / 2, 217, '#7dffa0', { align: 'center' }); }
    };
  }

  // ---------- sprites ----------
  const HEADS = {
    spiky:      ['..h..h..h..', '.hhhhhhhhh.', '.hhhhhhhhhh', 'hhhhhhhhhh.', '.Hhhssssss.', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    topknot:    ['....hh.....', '....hh.....', '..hhhhhhh..', '.hhhhhhhhh.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    goggles:    ['...........', '...hhhhh...', '..hhhhhhh..', '.hhgggggg..', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    mirrormask: ['...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhwwwwww.', 'hhhwwwgwww.', 'hhhwwwwwww.', 'hhhsssssss.', 'hhHSsssssss', 'hhH.Ssssss.', 'hH..Sssss..'],
    crown:      ['...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', 'hhmmgmmgmm.', 'hhhhsssss..', 'hhhsssesss.', 'hhhsssesss.', 'hhHSsssssss', 'hhH.Ssssss.', 'hH..Sssss..'],
    bandana:    ['...........', '...mmmmm...', '..mmmmmmm..', '.mmmmmmmmm.', 'Mmhhsssss..', 'M.hsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...']
  };
  const WEAPONS = {
    katana: { len: 19, w: 2, col: '#d8e0f0', hi: '#ffffff', hilt: '#3a2a50' }, voidblade: { len: 19, w: 2, col: '#101820', hi: '#5ad6c8', hilt: '#5ad6c8' },
    greatsword: { len: 27, w: 4, col: '#c8ccd8', hi: '#ffffff', hilt: '#d9b45a' }, pistol: { len: 7, w: 3, col: '#3a3a44', tip: '#8a92a8', hilt: '#6b4a2a' }, shard: { len: 14, w: 3, col: '#c8d4f0', hi: '#ffffff', hilt: '#8a92b8' }
  };
  const RIG = {
    orin:   { head: 'spiky', c: { skin: '#c8a080', hair: '#2a1a3a', top: '#3a2a5a', arm: '#3a2a5a', fore: '#e04dff', hand: '#f7d0ff', pants: '#1c1830', boots: '#2a2040', belt: '#e04dff', chest: '#f7d0ff', trail: '#e04dff' }, trailLen: 4 },
    mira:   { head: 'mirrormask', weapon: 'shard', armed: 1, c: { skin: '#e8d0c0', hair: '#5a6078', white: '#e8f0ff', glow: '#22d3ee', top: '#8a92b8', pants: '#5a6078', boots: '#3a3f55', belt: '#c8d4f0', chest: '#ffffff', trail: '#5a6078' }, trailHead: 1, trailLen: 5 },
    noct:   { head: 'hood', weapon: 'voidblade', armed: 1, c: { skin: '#1a2428', hair: '#12181c', glow: '#5ad6c8', top: '#162226', arm: '#162226', fore: '#243a3c', hand: '#5ad6c8', pants: '#0e1618', boots: '#0a1012', belt: '#5ad6c8', trail: '#5ad6c8' }, trailLen: 5 },
    bando:  { head: 'bandana', sc: 1.08, limb: 2, bulk: 6, c: { skin: '#d8a878', hair: '#3a2a20', acc: '#b6e84a', top: '#2a6a5a', arm: '#d8a878', fore: '#f0e8d0', hand: '#d8a878', pants: '#3a3a44', boots: '#2a2a30', belt: '#b6e84a' } },
    aldric: { head: 'helmet', sc: 1.12, limb: 4, bulk: 9, weapon: 'greatsword', armed: 1, c: { skin: '#d8b090', hair: '#c8ccd8', glow: '#f0e0a0', top: '#8a92a8', arm: '#8a92a8', fore: '#c8ccd8', hand: '#5a6078', pants: '#4a5068', boots: '#3a3f55', belt: '#f0e0a0', chest: '#f0e0a0', trail: '#8e2430' }, trailLen: 5, trailW: 3 },
    sen:    { head: 'topknot', weapon: 'katana', armed: 1, c: { skin: '#e8c0a0', hair: '#1c1a22', top: '#f4f1ea', arm: '#f4f1ea', pants: '#3a3448', boots: '#2a2630', belt: '#ffa0c0', chest: '#ffa0c0', trail: '#ffa0c0' }, trailLen: 3 },
    vega:   { head: 'crown', c: { skin: '#b08a70', hair: '#1a1438', acc: '#f5c542', glow: '#ffffff', top: '#2a1e5a', arm: '#2a1e5a', fore: '#9d6cff', hand: '#ffffff', pants: '#1a1438', boots: '#3a2a70', belt: '#f5c542', chest: '#9d6cff', trail: '#1a1438' }, trailHead: 1, trailLen: 5 },
    tessa:  { head: 'goggles', c: { skin: '#f0c8a8', hair: '#8a4a3a', glow: '#ffd24a', top: '#7a5a48', arm: '#f4f1ea', fore: '#f4f1ea', pants: '#3a3028', boots: '#5a4030', belt: '#e8a090', chest: '#ffd24a' } },
    jax:    { head: 'hat', weapon: 'pistol', c: { skin: '#c89870', hair: '#3a2a20', acc: '#6b4a2a', white: '#8a7a6a', top: '#8a3a2a', arm: '#8a3a2a', fore: '#c89870', pants: '#3a3430', boots: '#5a4030', belt: '#c86a3a', chest: '#f5c542', trail: '#c86a3a' }, trailLen: 3 },
    ferra:  { head: 'mohawk', bulk: 8, c: { skin: '#b08060', hair: '#d83a3a', top: '#4a5a6a', arm: '#8aa4c8', fore: '#d83a3a', hand: '#2c6fbf', pants: '#2e3440', boots: '#1c2028', belt: '#8aa4c8', chest: '#d83a3a' } }
  };
  const BORROW = { orin: 'gale', mira: 'isolde', noct: 'vesper', bando: 'kael', aldric: 'brakk', sen: 'nyra_b', vega: 'pyra', tessa: 'dyna', jax: 'dyna', ferra: 'ashka' };
  // the awakened look: same rig, lit from inside in the hero's colours
  const lit = (cfg, h) => Object.assign({}, cfg, { outline: art.shade(h.color, 0.35), c: Object.assign({}, cfg.c, { hair: h.colorHi, top: h.color, arm: cfg.c.arm === cfg.c.skin ? cfg.c.skin : h.color, belt: '#ffffff', chest: '#ffffff', trail: cfg.c.trail ? h.colorHi : undefined, glow: '#ffffff' }) });
  function bakeHeroes() {
    if (!art.bake) { NEW.forEach(id => { const s = art.sheets[BORROW[id]]; art.sheets[id] = s; art.sheets[id + '_aw'] = art.sheets[BORROW[id] + '_aw'] || s; }); return; }
    Object.assign(art.HEADS, HEADS); Object.assign(art.WEAPONS, WEAPONS);
    NEW.forEach(id => {
      const c = JSON.parse(JSON.stringify(RIG[id]));
      art.bake(id, c, 'hero'); art.bake(id + '_aw', lit(JSON.parse(JSON.stringify(RIG[id])), HR[id]), 'hero');
    });
  }
  const _init = art.init; art.init = function () { _init(); try { bakeHeroes(); } catch (e) { console.error(e); NEW.forEach(id => { art.sheets[id] = art.sheets[id] || art.sheets[BORROW[id]]; art.sheets[id + '_aw'] = art.sheets[id + '_aw'] || art.sheets[id]; }); } };
  // splash art: assets/bg/hero_<id>.png (96x128) and ult_<id>.png (520x260); a hero whose file is missing falls back to its sprite
  NEW.forEach(id => ['hero_', 'ult_'].forEach(k => { const im = new Image(); im.onload = () => { art.bg[k + id] = im; }; im.onerror = () => {}; im.src = 'assets/bg/' + k + id + '.png'; }));
  SW.heroes4 = NEW;
})();
