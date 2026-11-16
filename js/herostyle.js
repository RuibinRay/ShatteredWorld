'use strict';
// Shattered Worlds — a look of their own for every fighter. Loaded last; draw-only (no timing, hitbox or damage changes).
//   1. Victory poses. The winner of a Versus round used to strike one of four shared poses. Every fighter now has their
//      own: one of sixteen stances (fist to the sky, arms folded, blade raised, a bow, both arms up, pointing, kneeling,
//      flexing, a salute, looking back over the shoulder, arms spread, a low crouch, weapon planted, a shrug, a jump for
//      joy, hands together) bent to that hero (every joint is shifted by the hero's own amount, and the pose breathes at
//      the hero's own pace), with their element rising, circling, raining or bursting around them. POSE says who strikes
//      which; fighters not listed get one from their name. The frames are baked per hero the first time they win.
//   2. Melee of their own. Every J hit of a Hidden Clans fighter, not only the fourth, draws that fighter's own
//      swing (everyone else swings by how they fight: a blade cuts arcs, down and up in turn; fists jab, hook and burst): an arc, claw marks, a thrust, a palm ring, a fan, a ribbon wave, a ground stomp, a spiral, a cross cut or
//      magnetic pulses, in their colours, growing with each hit of the combo (Itsuki's turn through his five elements).
//      SWING says who uses which.
//   SW.herostyle.on = false turns both off.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, P = SW.Player.prototype, K = SW.skillfx;
  const POSES = art.POSES, SETS = art.SETS;
  if (!POSES || !SETS || !art.bake) return;
  const HS = SW.herostyle = { on: true };
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rnd = (seed, i) => { let x = Math.imul(seed ^ Math.imul(i + 1, 0x9e3779b1), 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };

  // ================= 1. victory poses =================
  // [lean, front arm, its elbow, back arm, its elbow, front leg, its knee, back leg, its knee, extras]
  const BASE = {
    skyfist: [-6, 170, 10, -20, 30, 12, 6, -12, 6, { tr: 40 }],
    folded: [-4, 68, 122, 72, 118, 10, 6, -10, 6, {}],
    blade: [6, 118, 0, -30, 40, 20, 10, -15, 6, { wp: -60 }],
    bow: [40, 30, 30, -10, 20, 10, 10, -10, 10, {}],
    cheer: [-5, 165, 14, 158, 16, 12, 6, -12, 6, { tr: 50 }],
    point: [-2, 88, 4, -38, 96, 16, 6, -12, 6, {}],
    kneel: [10, 42, 58, 18, 62, 72, 118, -30, 96, {}],
    flex: [0, 122, 104, 116, 108, 26, 14, -26, 14, {}],
    salute: [-3, 124, 138, -14, 24, 8, 4, -8, 4, {}],
    lookback: [-12, -28, 40, -52, 30, 8, 4, -8, 4, { tr: -30 }],
    spread: [-8, 96, 6, 100, 8, 18, 6, -18, 6, { tr: 30 }],
    crouch: [22, 60, 70, -30, 80, 42, 72, -36, 62, {}],
    planted: [4, 38, 22, -20, 30, 10, 6, -10, 6, { wp: 96 }],
    shrug: [0, 52, -58, 50, -60, 8, 4, -8, 4, {}],
    joy: [-6, 160, 20, 150, 25, 22, 42, -10, 52, { air: 1, hy: -8, tr: 60 }],
    calm: [2, 62, 112, 58, 114, 12, 8, -12, 8, {}]
  };
  const NAMES = Object.keys(BASE);
  const LIST = {
    skyfist: 'kael brakk tarn ivo taro', folded: 'noct vesper moro hex tor', blade: 'aldric sen nami mika hart', bow: 'isolde lin hollis coda ryo',
    cheer: 'gale kiri bando rook sora', point: 'jax dyna zara corvin vex', kneel: 'nyra maren oda itsuki', flex: 'brann fenn kova mako',
    salute: 'yara tessa garo lux', lookback: 'orin mira sable rue', spread: 'pyra kestra vega convergence apis', crouch: 'dune tarek thorne slick',
    planted: 'ferra pell isa opal', shrug: 'ashka ume fumi elixa', joy: 'vesna', calm: ''
  };
  const POSE = {}; Object.keys(LIST).forEach(k => LIST[k].split(' ').forEach(id => { if (id) POSE[id] = k; }));
  HS.POSE = POSE;
  const FLOURISH = ['rise', 'orbit', 'rain', 'burst'];
  const made = {};
  function victory(hero, sid) {   // bakes (once) and returns the name of this hero's victory frames on sheet sid + '!'
    const key = sid + '|' + hero, name = 'vic_' + hero;
    if (made[key] !== undefined) return made[key];
    made[key] = null;
    const s = art.sheets[sid]; if (!s || !s.cfg) return null;
    const seed = hash(hero), b = BASE[POSE[hero] || NAMES[seed % NAMES.length]];
    const frame = k => { const o = Object.assign({}, b[9]), v = (i, amt) => Math.round((rnd(seed, i) - 0.5) * 2 * amt);
      return Object.assign({ lean: b[0] + v(0, 4) - k * 2, aF: b[1] + v(1, 12) + k * 5, aFe: b[2] + v(2, 12) - k * 4, aB: b[3] + v(3, 12) - k * 4, aBe: b[4] + v(4, 12) + k * 4, lF: b[5] + v(5, 5) + k, lFk: b[6] + v(6, 4) + k * 2, lB: b[7] + v(7, 5), lBk: b[8] + v(8, 4) }, o, o.tr !== undefined ? { tr: o.tr + k * 6 } : {}, o.hy !== undefined ? { hy: o.hy - k * 4 } : {}); };
    try { POSES[name] = [frame(0), frame(1)]; SETS[name] = [name]; art.bake(sid + '!', s.cfg, name); made[key] = name; } catch (e) { HS.failed = hero; }
    return made[key];
  }
  HS.victory = victory;
  let WIN = null;
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    const V = SW.versus; WIN = null;
    if (HS.on && g.scene === 'vs' && V && V.f && V.winner >= 0 && V.f[V.winner] && V.f[V.winner].p === this && !this.dead && this.onGround && ((V.phase === 'ko' && V.t > 40) || V.phase === 'result' || V.phase === 'duelEnd')) {
      const hero = V.f[V.winner].hero, sid = this.sheet(), name = victory(hero, sid);
      if (name) {
        const seed = hash(hero), pace = 14 + seed % 14;
        WIN = { sid, name, f: Math.floor(SW.frame / pace) % 2 };
        if (K) {   // the element around the winner, in the hero's own pattern
          const st = K.styleOf(hero), kind = FLOURISH[(seed >>> 3) % 4], x = this.x, y = this.y;
          if (this._hsWin !== V.round + ':' + V.phase) { this._hsWin = V.round + ':' + V.phase; K.cast(this, st, 2); }
          if (!g.hitstop && SW.frame % 4 === 0) {
            if (kind === 'rise') K.add(st, x + (Math.random() - 0.5) * 30, y - 2, 0, -1.2 - Math.random(), { g: -0.02 });
            else if (kind === 'orbit') { const a = SW.frame * 0.09; K.add(st, x + Math.cos(a) * 20, y - 20 + Math.sin(a) * 9, -Math.sin(a) * 0.6, -0.2, { g: 0, life: 14 }); }
            else if (kind === 'rain') K.add(st, x + (Math.random() - 0.5) * 60, y - 70, 0, 1.4 + Math.random(), { g: 0.03, life: 30 });
            else if (SW.frame % 28 === 0) K.emit(st, x, y - 22, 8, { power: 1.1 });
          }
        }
      }
    }
    try { return _pd.apply(this, arguments); } finally { WIN = null; }
  };
  const _ad = art.draw; art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    if (WIN && id === WIN.sid && art.sheets[id + '!']) { if (SW.anim2) SW.anim2.sub = null; const w = WIN; WIN = null; return _ad.call(this, ctx, id + '!', w.name, w.f, x, y, flip, o); }
    return _ad.apply(this, arguments);
  };

  // ================= 2. the Hidden Clans' swings =================
  const SLIST = {
    arc: 'rook isa sora', claw: 'thorne vesna kova', thrust: 'sable lux hart', palm: 'hollis ivo lin fumi taro', fan: 'kestra corvin zara apis elixa opal',
    wave: 'pell nami tarek coda slick', stomp: 'dune tor mako', spiral: 'ume garo rue itsuki', cross: 'moro mika hex ryo', pulse: 'oda vex'
  };
  // Itsuki's hits turn the five-element wheel in colour: fire, wind, thunder, earth, water (as his skills do)
  const WHEEL = [['#ff6b35', '#ffd24a'], ['#7dffb2', '#eafff4'], ['#ffe066', '#ffffff'], ['#c8a05a', '#f0d9a8'], ['#4cc9f0', '#ffffff']];
  const SWING = {}; Object.keys(SLIST).forEach(k => SLIST[k].split(' ').forEach(id => { SWING[id] = k; }));
  const KINDS = Object.keys(SLIST);
  HS.SWING = SWING;
  const line = (ctx, c, x0, y0, x1, y1) => art.line(ctx, c, Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), 1);
  const dot = (ctx, c, x, y, s) => art.rect(ctx, c, Math.round(x - s / 2), Math.round(y - s / 2), s, s);
  const ease = k => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);
  const DRAW = {
    arc(ctx, q, x, y, t) { const f = q.face, r = 22 * q.sz, up = q.n % 2 ? -1 : 1, a0 = -1.6 * up, a1 = 1.2 * up, hd = a0 + (a1 - a0) * ease(t * 1.5), tl = a0 + (a1 - a0) * ease(t * 1.5 - 0.4); for (let i = 0; i <= 12; i++) { const a = tl + (hd - tl) * i / 12; dot(ctx, i > 8 ? '#ffffff' : q.col, x + Math.cos(a) * r * f, y + Math.sin(a) * r * 0.8, 1 + (i >> 2)); } },
    claw(ctx, q, x, y, t) { const f = q.face, l = 26 * q.sz * ease(t * 1.6); for (let i = -1; i <= 1; i++) { const x0 = x + f * 10, y0 = y - 12 + i * 6, k = q.n % 2 ? -1 : 1; line(ctx, i ? q.col : '#ffffff', x0, y0 - k * 6, x0 + f * l, y0 + k * 8); line(ctx, q.hi, x0, y0 - k * 6 + 1, x0 + f * l * 0.8, y0 + k * 7 + 1); } },
    thrust(ctx, q, x, y, t) { const f = q.face, l = 46 * q.sz * ease(t * 1.8), yy = y + (q.n % 3 - 1) * 5; line(ctx, '#ffffff', x + f * 8, yy, x + f * (8 + l), yy); line(ctx, q.col, x + f * 8, yy - 1, x + f * (4 + l), yy - 1); line(ctx, q.col, x + f * 8, yy + 1, x + f * (4 + l), yy + 1); const tx = x + f * (8 + l); line(ctx, q.hi, tx, yy - 4, tx, yy + 4); },
    palm(ctx, q, x, y, t) { const cx = x + q.face * 22, k = ease(t); art.ring(ctx, q.col, Math.round(cx), Math.round(y), Math.round(4 + 14 * q.sz * k)); art.ring(ctx, '#ffffff', Math.round(cx), Math.round(y), Math.round(2 + 8 * q.sz * k)); for (let i = 0; i < 5; i++) { const a = -0.9 + i * 0.45; line(ctx, q.hi, cx + q.face * Math.cos(a) * 8, y + Math.sin(a) * 8, cx + q.face * Math.cos(a) * (8 + 12 * k), y + Math.sin(a) * (8 + 12 * k)); } },
    fan(ctx, q, x, y, t) { const f = q.face, n = 4 + q.n, k = ease(t * 1.4); for (let i = 0; i < n; i++) { const a = -0.7 + 1.4 * i / (n - 1), r = (12 + 26 * k) * q.sz, px = x + f * Math.cos(a) * r, py = y + Math.sin(a) * r; art.rect(ctx, i % 2 ? q.col : q.hi, Math.round(px - 2), Math.round(py - 1), 4, 3); dot(ctx, '#ffffff', px, py, 1); } },
    wave(ctx, q, x, y, t) { const f = q.face, len = 54 * q.sz * ease(t * 1.5); for (let i = 0; i < len; i += 2) { const yy = y + Math.sin(i * 0.22 + q.n * 1.6 + t * 6) * 6 * (i / 54 + 0.3); dot(ctx, i % 6 ? q.col : '#ffffff', x + f * (8 + i), yy, 2); } },
    stomp(ctx, q, x, y, t, gy) { const f = q.face, k = ease(t); for (let i = 0; i < 6; i++) { const sx = x + f * (10 + i * 7 * q.sz), h = (10 - i) * q.sz * Math.sin(Math.min(1, t * 1.6) * Math.PI); art.rect(ctx, i % 2 ? q.col : q.hi, Math.round(sx - 2), Math.round(gy - h), 4, Math.max(1, Math.round(h))); } line(ctx, '#ffffff', x + f * 6, gy - 1, x + f * (6 + 50 * q.sz * k), gy - 1); },
    spiral(ctx, q, x, y, t) { const cx = x + q.face * 18, spin = t * 8 * (q.n % 2 ? 1 : -1); for (let i = 0; i < 18; i++) { const k = i / 18, r = 18 * q.sz * k, a = spin + k * 5; dot(ctx, i % 4 ? q.col : '#ffffff', cx + Math.cos(a) * r, y + Math.sin(a) * r * 0.8, i > 12 ? 2 : 1); } },
    cross(ctx, q, x, y, t) { const cx = x + q.face * 20, l = 16 * q.sz * ease(t * 1.7); line(ctx, q.col, cx - l, y - l, cx + l, y + l); line(ctx, '#ffffff', cx - l, y - l + 1, cx + l, y + l + 1); if (q.n > 0) { line(ctx, q.hi, cx - l, y + l, cx + l, y - l); line(ctx, '#ffffff', cx - l, y + l + 1, cx + l, y - l + 1); } },
    // fists (the story heroes): short and tight, at the fist
    jab(ctx, q, x, y, t) { const f = q.face, k = ease(t * 2), l = 14 * q.sz * k, x0 = x + f * 12, yy = y + (q.n % 2 ? -2 : 2); for (let i = -1; i <= 1; i++) line(ctx, i ? q.col : '#ffffff', x0 - f * (i ? 4 : 0), yy + i * 3, x0 + f * (l - Math.abs(i) * 4), yy + i * 3); if (t < 0.45) { const tx = x0 + f * l; line(ctx, '#ffffff', tx - 3, yy, tx + 3, yy); line(ctx, q.hi, tx, yy - 3, tx, yy + 3); } },
    hook(ctx, q, x, y, t) { const f = q.face, cx = x + f * 10, r = 13 * q.sz, a0 = 2.2, a1 = -0.6, hd = a0 + (a1 - a0) * ease(t * 1.8), tl = a0 + (a1 - a0) * ease(t * 1.8 - 0.35); for (let i = 0; i <= 9; i++) { const a = tl + (hd - tl) * i / 9; dot(ctx, i > 6 ? '#ffffff' : q.col, cx + Math.cos(a) * r * f, y + Math.sin(a) * r, i > 6 ? 2 : 1); } },
    smash(ctx, q, x, y, t) { const f = q.face, cx = x + f * 18, k = ease(t * 1.5), r = (4 + 10 * k) * q.sz; for (let i = 0; i < 8; i++) { const a = i * 0.785 + 0.39, rr = i % 2 ? r : r * 0.55; line(ctx, i % 2 ? q.col : '#ffffff', cx + Math.cos(a) * 2, y + Math.sin(a) * 2, cx + Math.cos(a) * rr, y + Math.sin(a) * rr); } if (t < 0.4) dot(ctx, '#ffffff', cx, y, 3); },
    pulse(ctx, q, x, y, t) { const cx = x + q.face * 20; for (let i = 0; i < 3; i++) { const tt = t * 1.6 - i * 0.25; if (tt > 0 && tt < 1) art.ring(ctx, i % 2 ? q.hi : q.col, Math.round(cx + q.face * i * 6), Math.round(y), Math.round(3 + 16 * q.sz * tt)); } }
  };
  const _pu = P.update; P.update = function (g, z) {
    const r = _pu.apply(this, arguments);
    const s = this.state, a = this.atk;
    if (!HS.on || (s !== 'attack' && s !== 'airatk') || !a || this.st !== a.hitAt || !g.state) return r;
    const h = g.hero(), id = g.state.hero;
    if (!h) return r;
    let n = 0; for (const q of fx.list) if (q.k === 'HM') n++;
    if (n > 12) return r;
    const hitNo = Math.max(0, (this.combo || 1) - 1);
    // the Hidden Clans swing their own way; everyone else by how they fight: a blade cuts arcs, fists jab, hook and burst
    let kind = h.clan ? SWING[id] || KINDS[hash(id) % KINDS.length] : null;
    if (!kind) { const sh = art.sheets[this.sheet()], armed = !!(sh && sh.cfg && sh.cfg.weapon && sh.cfg.armed), seq = armed ? ['arc', 'arc', 'arc', 'arc'] : ['jab', 'jab', 'hook', 'smash']; kind = s === 'airatk' ? (armed ? 'arc' : 'hook') : seq[Math.min(hitNo, 3)]; }
    const wheel = id === 'itsuki' ? WHEEL[(this._hsWheel = ((this._hsWheel === undefined ? -1 : this._hsWheel) + 1) % WHEEL.length)] : null;   // the five-element master: every hit in the next element, combo after combo
    fx.list.push({ k: 'HM', m: kind, x: this.x, y: this.y, face: this.face, col: wheel ? wheel[0] : h.color, hi: wheel ? wheel[1] : h.colorHi || '#ffffff', n: hitNo, sz: h.clan ? 0.9 + hitNo * 0.18 + (a.fin ? 0.3 : 0) : 0.8 + Math.min(hitNo, 3) * 0.1, life: 12, max: 12 });
    return r;
  };
  const _fd = fx.draw; fx.draw = function (ctx, cam) {
    _fd.apply(this, arguments);
    for (const q of fx.list) {
      if (q.k !== 'HM' || !DRAW[q.m]) continue;
      const t = 1 - q.life / q.max, a = Math.min(1, (q.life / q.max) * 2.2), x = q.x - cam.x, y = q.y - 20 - cam.y, gy = q.y - cam.y;
      ctx.save(); ctx.globalAlpha = a * 0.7; DRAW[q.m](ctx, q, x, y, t, gy); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; DRAW[q.m](ctx, q, x, y, t, gy); ctx.restore();
    }
  };
})();
