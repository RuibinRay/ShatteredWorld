'use strict';
// Shattered Worlds — grand ultimates for every hero (the user, 2026-11-18: "make sure all hero when they use ult it have
// the zoom, the length can vary some longer some shorter, and when using the ult the attack and animation, the elements,
// size and everything should increase, and all does the 50% health damage, if theirs current is higher then keep that,
// and redesign the looks and quality of animation for each ult"). Loaded after js/ult-cinema.js; it only wraps.
//
// 1. THE REST OF THE ROSTER. js/ult-cinema.js gave the twenty weakest a close-up and a finishing blow, js/sen-stroke.js
//    gave Sen his own. Here every other hero gets the same treatment, each with a length of its own and a finishing blow
//    redesigned in one of six forms that fits its element, coloured by the hero:
//      PILLAR   columns of the element erupt under the target        fire, magma, light, blast, blood, prism, mech
//      STORM    the sky darkens and strikes come down on the target  bolt, wind, sound, spear, kite, bee
//      SHATTER  a crown of shards closes on the target and bursts    ice, glass, bone, metal, alchemy, crystal
//      VORTEX   a sphere swallows the target, collapses, explodes    void, gravity, shadow, ink, time, star, moon,
//                                                                     magnet, curse, taiji
//      CROSS    afterimages dash through the target, then a giant X  impact, beast, chi, string, paper, feather,
//                                                                     petal, card, ribbon, mimic
//      QUAKE    waves roll along the ground, then a geyser           rock, sand, water, spore, smoke, thorns, slime,
//                                                                     shield, salt, steam
//    The hero's own ultimate runs first and unchanged (its first 72 frames), then:
//      close-up on the hero (name and ultimate in letterbox bars) | the build-up on the target (the camera pushes in, the
//      world goes dark, the hero gathers) | the finishing blow (a strike pose) | the camera pulls back.
//    The finishing blow tops the ultimate up to half of the target's full health (counting what the ultimate dealt;
//    if it already dealt more, it adds nothing). In Versus the opponent is held until the blow.
//    Lengths: from 112 to 176 frames by hero (LEN below; js/ult-cinema.js's are 124, Sen's 230).
// 2. BIGGER WHILE IT LASTS, FOR EVERY HERO (the twenty and Sen too): during an ultimate the hero is drawn up to 25%
//    larger, and everything the ultimate creates (its effects and its projectiles) is drawn 45% larger. Draw-only:
//    hit areas are unchanged.
// SW.ultGrand.on = false turns 1 off, SW.ultGrand.big = false turns 2 off.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, V = SW.versus, P = SW.Player && SW.Player.prototype, ui = SW.ui;
  const A = D.abilities, N = SW.ninja, K = SW.skillfx, W = SW.W, H = SW.H, rand = SW.rand, text = SW.text;
  if (!P || !N || !N.hurt || !SW.ultFx || !fx || !art) return;
  const UC = SW.ultCinema, SKIP = { sen: 1 };
  const FORM = {
    fire: 'pillar', magma: 'pillar', light: 'pillar', blast: 'pillar',
    bolt: 'storm', wind: 'storm', sound: 'storm',
    ice: 'shatter', glass: 'shatter', bone: 'shatter', metal: 'shatter',
    void: 'vortex', gravity: 'vortex', shadow: 'vortex', ink: 'vortex', time: 'vortex', star: 'vortex', moon: 'vortex',
    impact: 'cross', beast: 'cross', chi: 'cross', string: 'cross', paper: 'cross', feather: 'cross', petal: 'cross',
    rock: 'quake', sand: 'quake', water: 'quake', spore: 'quake', smoke: 'quake', thorns: 'quake',
    // the Hidden Clans' own styles
    magnet: 'vortex', curse: 'vortex', taiji: 'vortex', blood: 'pillar', prism: 'pillar', mech: 'pillar',
    spear: 'storm', kite: 'storm', bee: 'storm', alchemy: 'shatter', crystal: 'shatter',
    slime: 'quake', shield: 'quake', salt: 'quake', steam: 'quake', card: 'cross', ribbon: 'cross', mimic: 'cross'
  };
  const BASE = { pillar: 142, storm: 124, shatter: 134, vortex: 156, cross: 116, quake: 138 };
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };
  const SHARE = 0.5;
  const UG = SW.ultGrand = { on: true, big: true, SHARE, FORM, sprite: 0.25, effects: 0.45 };
  const apexOf = id => (SW.apex && SW.apex.on && SW.apex.ult ? SW.apex.ult(id) : null);   // js/apex/apex-core.js: a hero's own cinematic
  const mine = id => !!(id && D.heroes[id] && (apexOf(id) || (!SKIP[id] && !(UC && UC.heroes && UC.heroes.indexOf(id) >= 0))));
  const on = g => UG.on && g && g.state && mine(g.state.hero);
  const styleOf = id => (K && K.styleOf ? K.styleOf(id) : 'impact');
  // each hero's plan: its form, length, the frame of the finishing blow, its close-up, its colours
  const PLAN = {};
  function planOf(id) {
    if (PLAN[id]) return PLAN[id];
    const h = D.heroes[id], st = styleOf(id), form = FORM[st] || 'cross', j = hash(id);
    let len = BASE[form] + (j % 33) - 16;
    if (id === 'itsuki') len = 176;
    len = SW.clamp(len, 112, 176);
    const fin = len - 22, cu0 = 26 + (j % 7), cu1 = Math.min(fin - 30, cu0 + 28 + (j % 11));
    const sc = K && K.STYLE[st] ? K.STYLE[st].c : ['#ffffff', '#c8ccd8', '#8a92a8'];
    const pl = { id, form, style: st, len, fin, cu0, cu1, own: 72, c: [h.colorHi || sc[1], h.color || sc[0], sc[0], sc[2]], n: 3 + (j % 3), seed: j };
    const ax = apexOf(id);   // an apex hero's own length, blow, close-up and colours (and its build-up, blow, camera and poses below)
    if (ax) { ['len', 'fin', 'cu0', 'cu1', 'own', 'c'].forEach(k => { if (ax[k] !== undefined) pl[k] = ax[k]; }); pl.apex = ax; }
    return (PLAN[id] = pl);
  }
  UG.planOf = planOf;
  const sfx = n => SW.audio.sfx(n);
  const vsFoe = p => (G.scene === 'vs' && V && V.f && V.f.length === 2 ? V.f.find(f => f.p !== p) : null);
  function maxHp(f) { const keep = G.state; G.state = f.state; try { return f.p.hpMax(); } finally { G.state = keep; } }
  const emit = (pl, x, y, n, o) => { if (K) K.emit(pl.style, x, y, n, o); };
  const boxOf = e => (e.box ? e.box() : { x: e.x - 8, y: e.y - 32, w: 16, h: 32 });

  // ---------- custom effects (drawn in fx.draw) ----------
  const add = o => { fx.list.push(Object.assign({ k: 'UGX' }, o)); };
  function drawUG(ctx, q, cam) {
    const t = q.life / q.max, prog = 1 - t, x = Math.round(q.x - cam.x), y = Math.round(q.y - cam.y);
    ctx.save();
    if (q.kind === 'pillar') {   // a column that shoots up and thins out
      const hgt = Math.round(q.h * Math.min(1, prog * 3)), w = Math.max(2, Math.round(q.w * (t < 0.3 ? t / 0.3 : 1)));
      ctx.globalAlpha = Math.min(1, t * 2);
      ctx.fillStyle = q.c2; ctx.fillRect(x - w, y - hgt, w * 2, hgt);
      ctx.fillStyle = q.c1; ctx.fillRect(x - Math.ceil(w * 0.6), y - hgt, Math.ceil(w * 1.2), hgt);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x - Math.ceil(w * 0.2), y - hgt, Math.max(1, Math.ceil(w * 0.4)), hgt);
      ctx.fillStyle = q.c1; ctx.fillRect(x - w - 3, y - 3, w * 2 + 6, 3);
    } else if (q.kind === 'orb') {   // a sphere: grows, then collapses
      const r = Math.max(0, Math.round(q.r0 + (q.r1 - q.r0) * (q.ease === 'in' ? prog * prog : 1 - t * t)));
      if (r > 0) {
        ctx.globalAlpha = 0.85 * Math.min(1, t * 3); ctx.fillStyle = q.c2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.9; ctx.fillStyle = q.c3 || '#05060c'; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r - 3), 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; art.ring(ctx, q.c1, x, y, r); art.ring(ctx, '#ffffff', x, y, Math.max(1, r - 1));
        for (let i = 0; i < 6; i++) { const a = q.spin * (SW.frame * 0.12) + i * Math.PI / 3, rr = r + 6 + Math.sin(SW.frame * 0.3 + i) * 3; ctx.fillStyle = i % 2 ? q.c1 : '#ffffff'; ctx.fillRect(Math.round(x + Math.cos(a) * rr) - 1, Math.round(y + Math.sin(a) * rr * 0.6) - 1, 3, 3); }
      }
    } else if (q.kind === 'shard') {   // a shard that flies in (or out), point first
      const k = q.out ? prog : 1 - prog, d = q.d0 + (q.d1 - q.d0) * (q.out ? prog : prog), px = x + Math.cos(q.a) * d, py = y + Math.sin(q.a) * d * 0.8;
      void k;
      const len = q.len, ux = -Math.cos(q.a), uy = -Math.sin(q.a) * 0.8;
      ctx.globalAlpha = Math.min(1, t * 2.5);
      for (const pass of [0, 1]) for (let i = 0; i < len; i++) {   // a dark edge first, so a pale shard reads on a bright stage
        const w = Math.max(1, Math.round(4 * (1 - i / len))) + (pass ? 0 : 2), sx = Math.round(px + ux * i * (q.out ? -1 : 1)) - (w >> 1), sy = Math.round(py + uy * i * (q.out ? -1 : 1)) - (w >> 1);
        ctx.fillStyle = !pass ? '#120c1e' : i < 2 ? '#ffffff' : i % 3 ? q.c1 : q.c2; ctx.fillRect(sx, sy, w, w);
      }
    } else if (q.kind === 'beam') {   // a strike from the sky
      ctx.globalAlpha = Math.min(1, t * 2);
      const x0 = Math.round(q.x0 - cam.x), y0 = Math.round(q.y0 - cam.y);
      art.line(ctx, q.c2, x0, y0, x, y, 7); art.line(ctx, q.c1, x0, y0, x, y, 4); art.line(ctx, '#ffffff', x0, y0, x, y, 2);
    } else if (q.kind === 'cross') {   // a giant X
      const r = q.r * Math.min(1, prog * 2.5);
      ctx.globalAlpha = Math.min(1, t * 2);
      for (const s of [1, -1]) { art.line(ctx, q.c2, x - r, y - r * s, x + r, y + r * s, 8); art.line(ctx, q.c1, x - r, y - r * s, x + r, y + r * s, 5); art.line(ctx, '#ffffff', x - r, y - r * s, x + r, y + r * s, 2); }
    } else if (q.kind === 'wave') {   // a crest rolling along the ground
      const px = Math.round(q.x0 + (q.x1 - q.x0) * prog - cam.x), hh = Math.round(q.h * Math.sin(Math.PI * Math.min(1, prog * 1.2)));
      ctx.globalAlpha = Math.min(1, t * 2);
      for (let i = -6; i <= 6; i++) { const hgt = Math.max(1, Math.round(hh * (1 - Math.abs(i) / 7))); ctx.fillStyle = Math.abs(i) < 2 ? '#ffffff' : i % 2 ? q.c1 : q.c2; ctx.fillRect(px + i * 2, y - hgt, 2, hgt); }
    } else if (q.kind === 'dark') {   // the world goes dark
      ctx.globalAlpha = q.a * Math.min(1, t * 4, (1 - t) * 6); art.rect(ctx, '#05060c', 0, 0, W, H);
    }
    ctx.restore();
  }
  const _fdraw = fx.draw;
  fx.draw = function (ctx, cam) {
    let mine0 = false, big = false;
    for (const q of fx.list) { if (q.k === 'UGX') mine0 = true; else if (q._ugS) big = true; if (mine0 && big) break; }
    if (!mine0 && !big) return _fdraw.apply(this, arguments);
    const all = fx.list, plain = [], scaled = [], own = [];
    for (const q of all) (q.k === 'UGX' ? own : q._ugS && UG.big ? scaled : plain).push(q);
    try {
      own.forEach(q => { if (q.kind === 'dark') drawUG(ctx, q, cam); });
      fx.list = plain; _fdraw.call(this, ctx, cam);
      for (const q of scaled) {   // everything an ultimate made, drawn larger around where it is
        const x = Math.round(q.x - cam.x), y = Math.round(q.y - cam.y);
        ctx.save(); ctx.translate(x, y); ctx.scale(q._ugS, q._ugS); ctx.translate(-x, -y);
        fx.list = [q]; _fdraw.call(this, ctx, cam);
        ctx.restore();
      }
      own.forEach(q => { if (q.kind !== 'dark') drawUG(ctx, q, cam); });
    } finally { fx.list = all; }
  };
  // the effects and projectiles an ultimate makes: marked as they are made (the hero's own frame and its shots' frame)
  const ultOf = p => p && p.state === 'ult' && !p.dead;
  function marking(p, list, fn) {
    if (!UG.big || !ultOf(p)) return fn();
    const l0 = fx.list, n0 = l0.length, s0 = list ? list.length : 0, keep = list ? list.slice() : null;
    const r = fn();
    if (fx.list === l0) for (let i = n0; i < l0.length; i++) { const q = l0[i]; if (q && q.k !== 't' && q.k !== 'UGX' && !q._ugS) q._ugS = 1 + UG.effects; }
    if (list && list.length) for (const s of list) { if (s && !s._ugS && keep.indexOf(s) < 0 && typeof s.draw === 'function') bigShot(s); }
    void s0;
    return r;
  }
  function bigShot(s) {
    s._ugS = 1 + UG.effects * 0.8;
    const d = s.draw;
    s.draw = function (ctx, cam) {
      if (!UG.big) return d.apply(this, arguments);
      const x = Math.round((this.x || 0) - cam.x), y = Math.round((this.y || 0) - cam.y);
      ctx.save(); ctx.translate(x, y); ctx.scale(this._ugS, this._ugS); ctx.translate(-x, -y);
      try { return d.apply(this, arguments); } finally { ctx.restore(); }
    };
  }
  const Z = SW.Zone && SW.Zone.prototype;
  if (Z && Z.update) {
    const _zu = Z.update;
    Z.update = function (g) {
      const p = G.scene === 'vs' && V && V.cur ? V.cur.p : G.player;
      return marking(p, this.shots, () => _zu.apply(this, arguments));
    };
  }

  // ---------- the sequence, around the hero's own ultimate ----------
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    if (!on(g)) return _uf.apply(this, arguments);
    const pl = planOf(g.state.hero), st = p.st, f2 = vsFoe(p);
    if (st <= 1 || !p.ugrand) p.ugrand = { hp0: f2 ? f2.state.hp : null, hero: g.state.hero, pl };
    const C = p.ugrand;
    if (f2 && st < pl.fin) f2.stunT = Math.max(f2.stunT || 0, 3);   // held until the finishing blow
    const r = st < pl.own ? _uf.apply(this, arguments) : true;   // the hero's own ultimate, as it was (an apex hero may keep less)
    const T = f2 ? f2.p : foes.filter(e => !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    const b = T ? boxOf(T) : { x: p.x + p.face * 60 - 8, y: p.y - 32, w: 16, h: 32 }, cx = b.x + b.w / 2, cy = b.y + b.h / 2, gy = b.y + b.h;
    const ax = pl.apex, bu = ax && ax.bu !== undefined ? ax.bu : Math.max(74, pl.fin - 30), dur = pl.fin - bu;   // the build-up: after the hero's own ultimate, up to 30 frames
    if (ax && ax.every) ax.every(st, { p, T, cx, cy, gy, pl, f2 });
    if (st === bu && !(ax && ax.noDark)) { sfx('charge'); add({ kind: 'dark', x: 0, y: 0, a: 0.38, life: dur + 8, max: dur + 8 }); }
    if (st >= bu && st < pl.fin) (ax && ax.build ? ax.build(st - bu, dur, { p, T, cx, cy, gy, pl }) : buildUp(pl, p, st - bu, dur, cx, cy, gy));
    if (!(ax && ax.build) && st >= 72 && st % 3 === 0 && st < pl.fin) emit(pl, p.x + rand(-14, 14), p.y - rand(4, 40), 1, { power: 0.5, spread: 0.3 });   // the hero gathers
    if (st === pl.fin - 6 && !(ax && ax.finish)) { sfx('select'); fx.ring(p.x, p.y - 20, pl.c[0], 44, 6, 12); }
    if (st === pl.fin) {
      if (ax && ax.finish) ax.finish({ p, T, cx, cy, gy, pl });
      else { fx.flash('#ffffff', 12); fx.shake(11, 20); sfx('explode'); sfx('perfect'); sfx('heavy'); finish(pl, p, cx, cy, gy); }
      foes.filter(e => !e.dead).forEach(e => {
        let add2 = 0;
        const fe = N.fighterOf ? N.fighterOf(e) : null;
        if (fe && C.hp0 !== null) {   // Versus: half of the target's full health in all, counting what the ultimate did
          const want = Math.round(maxHp(fe) * SHARE), dealt = Math.max(0, C.hp0 - fe.state.hp);
          add2 = Math.max(0, want - dealt) / ((V.tune && V.tune[C.hero]) || 1);
          fe.p.juggle = 0;
        } else if (!fe) add2 = A[D.heroes[C.hero].ultimate] ? A[D.heroes[C.hero].ultimate].dmg * p.specMul() : 20;   // the story: one more blow of the ultimate
        N.hurt(e, Math.max(1, Math.round(add2)), { unblockable: true, heavy: true, ky: -6, launch: true, down: true, stun: 50, kx: (Math.sign(e.x - p.x) || p.face) * 2, srcX: p.x });
      });
    }
    if (!(ax && ax.finish) && st > pl.fin && st < pl.len && st % 3 === 0) emit(pl, G.cam.x + rand(0, W), G.cam.y + rand(0, 50), 1, { spread: 0.3, power: 0.3 });
    return r;
  };
  // the build-up on the target (k: frames since it started, dur in all: 16 to 30)
  function buildUp(pl, p, k, dur, cx, cy, gy) {
    const c = pl.c;
    if (pl.form === 'pillar') {
      if (k % 4 === 0) emit(pl, cx + rand(-24, 24), gy - 2, 2, { power: 0.8, up: true });
      if (k % 10 === 0) fx.ring(cx, gy - 2, c[0], 30, 6, 14);
      if (k === dur - 10) add({ kind: 'pillar', x: cx, y: gy, w: 2, h: 30, c1: c[0], c2: c[1], life: 10, max: 10 });
    } else if (pl.form === 'storm') {
      if (k % 6 === 0) { const x = cx + rand(-70, 70); add({ kind: 'beam', x0: x + rand(-10, 10), y0: G.cam.y - 8, x, y: gy - rand(0, 30), c1: c[0], c2: c[1], life: 6, max: 6 }); sfx('zap'); }
      if (k % 2 === 0) emit(pl, cx + rand(-40, 40), cy + rand(-40, 20), 1, { power: 0.6 });
    } else if (pl.form === 'shatter') {
      if (k === 0) for (let i = 0; i < 10 + pl.n * 2; i++) add({ kind: 'shard', x: cx, y: cy, a: i / (10 + pl.n * 2) * Math.PI * 2, d0: 70, d1: 14, len: 12, c1: c[1], c2: c[0], out: false, life: dur, max: dur });
      if (k % 8 === 0) fx.ring(cx, cy, c[0], Math.max(10, 70 - k * 2), Math.max(6, 60 - k * 2), 8);
    } else if (pl.form === 'vortex') {
      if (k === 0) add({ kind: 'orb', x: cx, y: cy, r0: 4, r1: 34 + pl.n * 4, ease: 'out', c1: c[0], c2: c[1], c3: '#05060c', spin: pl.seed % 2 ? 1 : -1, life: dur, max: dur });
      if (k % 2 === 0) { const a = rand(0, Math.PI * 2), d = rand(60, 90); emit(pl, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.7, 1, { power: 0.3 }); }
    } else if (pl.form === 'cross') {
      if (k % 6 === 0) { const s = k % 12 ? 1 : -1; fx.ghost(p.sheet ? p.sheet() : null, 'a4', 1, cx - s * 30, gy, s < 0, c[0]); fx.slash(cx, cy, s, 1 + (k % 3), c[0], 40); sfx('dash'); }
    } else {   // quake
      if (k % 10 === 0) { add({ kind: 'wave', x: 0, y: gy, x0: p.x, x1: cx, h: 14 + pl.n * 3, c1: c[0], c2: c[1], life: 16, max: 16 }); fx.shake(3, 6); sfx('heavy'); }
      if (k % 3 === 0) fx.dust(cx + rand(-20, 20), gy, 2);
    }
  }
  // the finishing blow
  function finish(pl, p, cx, cy, gy) {
    const c = pl.c;
    fx.ring(cx, cy, '#ffffff', 6, 92, 22); fx.ring(cx, cy, c[0], 4, 64, 18);
    for (let i = 0; i < 30; i++) emit(pl, cx, cy, 1, { power: 2.4, spread: 1 });
    if (pl.form === 'pillar') {
      for (let i = -pl.n + 1; i < pl.n; i++) add({ kind: 'pillar', x: cx + i * 26, y: gy, w: i === 0 ? 14 : 8 - Math.abs(i), h: i === 0 ? 170 : 110 - Math.abs(i) * 14, c1: c[0], c2: c[1], life: 26 + Math.abs(i) * 3, max: 26 + Math.abs(i) * 3 });
    } else if (pl.form === 'storm') {
      for (let i = 0; i < 4 + pl.n; i++) add({ kind: 'beam', x0: cx + rand(-80, 80), y0: G.cam.y - 8, x: cx + rand(-6, 6), y: cy, c1: c[0], c2: c[1], life: 10 + i, max: 10 + i });
      fx.bolt(cx, G.cam.y - 10, cx, gy, '#ffffff');
    } else if (pl.form === 'shatter') {
      for (let i = 0; i < 16 + pl.n * 2; i++) add({ kind: 'shard', x: cx, y: cy, a: i / (16 + pl.n * 2) * Math.PI * 2 + 0.2, d0: 6, d1: 110, len: 14, c1: c[1], c2: c[0], out: true, life: 20, max: 20 });
    } else if (pl.form === 'vortex') {
      add({ kind: 'orb', x: cx, y: cy, r0: 34 + pl.n * 4, r1: 0, ease: 'in', c1: c[0], c2: c[1], c3: '#05060c', spin: 1, life: 8, max: 8 });
      fx.ring(cx, cy, c[1], 10, 130, 26);
    } else if (pl.form === 'cross') {
      add({ kind: 'cross', x: cx, y: cy, r: 56 + pl.n * 6, c1: c[0], c2: c[1], life: 22, max: 22 });
      for (let i = 0; i < 6; i++) fx.slash(cx + rand(-10, 10), cy + rand(-12, 12), i % 2 ? 1 : -1, 1 + (i % 3), i % 2 ? c[0] : '#ffffff', 52);
    } else {
      add({ kind: 'pillar', x: cx, y: gy, w: 12, h: 140, c1: c[0], c2: c[1], life: 28, max: 28 });
      for (let i = 0; i < 3; i++) add({ kind: 'wave', x: 0, y: gy, x0: cx, x1: cx + (i - 1) * 120, h: 22, c1: c[0], c2: c[1], life: 18, max: 18 });
      fx.debris(cx, gy - 10, c[1], 14);
    }
  }
  // it lasts the hero's own length (actors.js ends every ultimate at 72)
  const _up = P.update;
  P.update = function (g, z) {
    const was = this.state === 'ult' && this.ugrand && on(g), st0 = this.st, pl = was ? this.ugrand.pl : null;
    const r = marking(this, null, () => _up.apply(this, arguments));
    if (was && this.state !== 'ult' && !this.dead && st0 + 1 < pl.len && this.state !== 'hurt') { this.state = 'ult'; this.st = st0 + 1; }
    if (this.state !== 'ult' && this.ugrand) this.ugrand = null;
    return r;
  };
  // poses: gather, then the strike at the blow, then the hero's victory pose; and the hero drawn larger in any ultimate
  let POSE = null, BIG = null;
  const _ad = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    if (POSE && id === POSE[0]) { const s = art.sheets[id]; if (s && s.anims && s.anims[POSE[1]]) { anim = POSE[1]; fi = POSE[2]; } POSE = null; }
    if (BIG && BIG.ids[id] && BIG.s > 1.001) {
      const px = Math.round(x), py = Math.round(y);
      ctx.save(); ctx.translate(px, py); ctx.scale(BIG.s, BIG.s); ctx.translate(-px, -py);
      try { return _ad.call(this, ctx, id, anim, fi, x, y, flip, o); } finally { ctx.restore(); }
    }
    return _ad.call(this, ctx, id, anim, fi, x, y, flip, o);
  };
  const ease = t => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
  function lenOf(p, g) { const id = g && g.state && g.state.hero; if (p.ugrand) return p.ugrand.pl.len; if (p.ucine && UC) return UC.LEN; if (id === 'sen') return 230; return 72; }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const gg = g || this.G, h = gg && gg.hero && gg.hero();
    if (this.state === 'ult' && this.ugrand && on(gg)) {
      const pl = this.ugrand.pl, st = this.st, bu = Math.max(74, pl.fin - 30);
      const s = pl.apex && pl.apex.pose ? pl.apex.pose(st, this) : st >= 72 && st < pl.fin - 6 ? (st < bu ? ['cast', (this.t >> 3) % 2] : ['charge', (this.t >> 2) % 2]) : st >= pl.fin - 6 && st < pl.fin + 12 ? ['special', st < pl.fin ? 0 : st < pl.fin + 5 ? 1 : 2] : st >= pl.fin + 12 ? ['cheer', 0] : null;
      if (s) POSE = [this.sheet(), s[0], s[1]];
    }
    const keep = BIG;
    if (UG.big && this.state === 'ult' && h) {
      const st = this.st || 0, L = lenOf(this, gg), s = 1 + UG.sprite * ease(st / 12) * (1 - ease((st - (L - 10)) / 10));
      BIG = { s, ids: { [h.sheet]: 1, [h.sheetAw]: 1, [h.sheetArmed]: 1, [this.sheet ? this.sheet() : '']: 1 } };
    } else BIG = null;
    try { return _pd.apply(this, arguments); } finally { POSE = null; BIG = keep; }
  };

  // ---------- the camera ----------
  const tmp = document.createElement('canvas'), tctx = tmp.getContext('2d');
  function zoomAt(pl, st) {   // { z: how close (1 normal), bars: letterbox 0-1, on: 'hero' | 'target' }
    if (pl.apex && pl.apex.zoom) { const z = pl.apex.zoom(st, pl); if (z) return z; }
    const a = pl.cu0, b = pl.cu1, bu = Math.max(66, pl.fin - 28), F = pl.fin;
    if (st >= a && st < b) return { z: 1 + 0.95 * ease((st - a) / 8) * (1 - ease((st - (b - 7)) / 7)), bars: ease((st - a + 2) / 5) * (1 - ease((st - (b - 5)) / 5)), on: 'hero' };
    if (st >= bu && st < F) return { z: 1 + 1.25 * ease((st - bu) / 12), bars: ease((st - bu) / 6), on: 'target' };
    if (st >= F && st < F + 18) return { z: 1 + 0.6 * (1 - ease((st - F) / 16)), bars: 1 - ease((st - F - 4) / 12), on: 'target' };
    return { z: 1, bars: 0 };
  }
  UG.zoomAt = zoomAt;
  function caster() {
    if (G.scene === 'vs' && V && V.f && V.phase === 'fight') { const f = V.f.find(x => mine(x.hero) && x.p.state === 'ult' && x.p.ugrand); return f ? { p: f.p, hero: f.hero } : null; }
    if (G.scene === 'play' && G.state && mine(G.state.hero) && G.player && G.player.state === 'ult' && G.player.ugrand) return { p: G.player, hero: G.state.hero };
    return null;
  }
  let shot = false;
  if (Z && Z.draw) {
    const _zd = Z.draw;
    Z.draw = function (ctx) {
      const r = _zd.apply(this, arguments);
      const c0 = UG.on && caster(); shot = false;
      if (c0 && zoomAt(c0.p.ugrand.pl, c0.p.st).z > 1.01) {
        const c = ctx.canvas;
        if (tmp.width !== c.width || tmp.height !== c.height) { tmp.width = c.width; tmp.height = c.height; }
        tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, c.width, c.height); tctx.drawImage(c, 0, 0); shot = true;
      }
      return r;
    };
  }
  function post(ctx) {
    const cs = UG.on && caster(); if (!cs) { shot = false; return; }
    const p = cs.p, pl = p.ugrand.pl, st = p.st, c = ctx.canvas, k = c.width / W, zm = zoomAt(pl, st), h = D.heroes[cs.hero];
    const f2 = vsFoe(p), T = f2 ? f2.p : null;
    if (zm.z > 1.01 && shot) {
      let fx0 = zm.on === 'target' && T ? T.x : p.x, fy0 = (zm.on === 'target' && T ? T.y : p.y) - 22;
      if (zm.on === 'mid' && T) { fx0 = (p.x + T.x) / 2; fy0 = (p.y + T.y) / 2 - 22; }
      if (zm.dx) fx0 += zm.dx * (p.face || 1); if (zm.dy) fy0 += zm.dy;
      const sw = c.width / zm.z, sh = c.height / zm.z, tx = fx0 - G.cam.x, ty = fy0 - G.cam.y;
      const sx = SW.clamp(tx * k - sw / 2, 0, c.width - sw), sy = SW.clamp(ty * k - sh * 0.5, 0, c.height - sh);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(tmp, sx, sy, sw, sh, 0, 0, c.width, c.height); ctx.restore();
    }
    shot = false;
    if (zm.bars > 0.01) {
      ctx.save(); ctx.setTransform(k, 0, 0, k, 0, 0);
      const bh = Math.round(30 * zm.bars), u = A[h.ultimate];
      art.rect(ctx, '#000000', 0, 0, W, bh); art.rect(ctx, '#000000', 0, H - bh, W, bh);
      ctx.globalAlpha = zm.bars;
      if (pl.apex && pl.apex.card) pl.apex.card(ctx, st, zm, h, u);
      else if (st >= pl.cu0 + 2 && st < pl.cu1 - 2) { text(ctx, h.name.toUpperCase(), W / 2, H - 25, h.colorHi || '#ffffff', { align: 'center' }); if (u) text(ctx, u.name.toUpperCase(), W / 2, H - 14, '#ffffff', { align: 'center' }); }
      ctx.restore();
    }
  }
  if (V && V.draw) {
    const _vd = V.draw;
    V.draw = function (ctx) {
      const cs = UG.on && caster(), f2 = cs ? vsFoe(cs.p) : null, keep = f2 ? f2.stunT : 0;
      if (f2) f2.stunT = 0;   // the hold uses the stun timer: no "stunned" stars over the target
      let r;
      try { r = _vd.apply(this, arguments); } finally { if (f2) f2.stunT = keep; }
      try { post(ctx); } catch (e) { console.error(e); }
      return r;
    };
  }
  if (ui && ui.hud) { const _hud = ui.hud; ui.hud = function (ctx, g) { const r = _hud.apply(this, arguments); if (g && g.scene === 'play') { try { post(ctx); } catch (e) { console.error(e); } } return r; }; }
})();
