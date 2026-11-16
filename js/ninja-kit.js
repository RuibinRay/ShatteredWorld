'use strict';
// Shattered Worlds — Hidden Clans, the shared kit for the later waves (ninjas4.js, ninjas5.js, ninjas6.js).
// One call, N.clan(id, def), registers a Versus-only ninja everywhere a fighter lives now: their U / S+U / I / S+I moves
// (ninja-core.js), their W+O signature (signature.js), their element (skillfx.js), a combo of their own that ends in an
// element finisher (clanmelee.js), their finisher voice lines (finisher-lines.js), translations, sprite and Versus balance.
// Loaded after finisher.js, so all of those exist; like the other expansions it only adds and wraps.
// Also small builders (shots, areas, bursts, dashes, ultimates) dressed in an element, so each hero stays short.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, V = SW.versus, N = SW.ninja, K = SW.skillfx, W = SW.W;
  if (!N) return;
  const HR = D.heroes, A = D.abilities, C = D.combat, CASTS = SW.casts, Proj = SW.Proj, rand = SW.rand, sfx = N.sfx;
  const SIG = SW.signature && SW.signature.SIG, FIN = SW.clanmelee && SW.clanmelee.FIN, LINES = SW.finisherLines;
  const COST = (SW.signature && SW.signature.COST) || 75;

  // ================= registering a hero =================
  // def: { hero: {name, alias, title, energy, color, colorHi, element, sig, combo, route, modeKind, pitch, trait, blurb},
  //        moves: { u, su, i, si, sig: {id, name, dmg, desc, cast, cost?}, ult: {id, name, dmg, desc, fn} },
  //        mode: [id, name], awaken: [id, name], trait: {hooks}, style: {name, def?}, fin(p, z, d, h), lines: [[en, ja, es, zh] x3],
  //        rig, borrow, tune, tr: { 'English': ['es', 'zh'] }, ultTr: [es, zh] }
  function clan(id, d) {
    const k = d.moves, h0 = d.hero;
    N.hero(id, Object.assign({ kit: [k.u.id, k.su.id, k.i.id, h0.route === 'kael' ? 'magnet_grip' : 'frost_steps', d.mode[0], d.awaken[0], k.ult.id] }, h0));
    const ab = {};
    [['u', 'U', 25], ['su', 'S + U', 50], ['i', 'I', 50]].forEach(([s, inp, cost]) => { const m = k[s]; ab[m.id] = { name: m.name, input: inp, cost: m.cost || cost, dmg: m.dmg, desc: m.desc }; CASTS[m.id] = m.cast; });
    ab[k.ult.id] = { name: k.ult.name, dmg: k.ult.dmg, desc: k.ult.desc };
    N.abilities(id, ab, d.mode[1], d.awaken[1]);
    N.burst(id, k.si.id, k.si.name, k.si.dmg, k.si.desc, k.si.cast);
    if (SIG && k.sig) { SIG[id] = { id: k.sig.id, cast: k.sig.cast }; A[k.sig.id] = { name: k.sig.name, input: 'W + O', cost: COST, dmg: k.sig.dmg, desc: k.sig.desc }; HR[id].kit.push(k.sig.id); }
    N.ULT[k.ult.id] = k.ult.fn;
    if (d.trait) N.TRAITS[h0.trait] = d.trait;
    if (K) { if (d.style.def && !K.STYLE[d.style.name]) K.STYLE[d.style.name] = d.style.def; K.BY_HERO[id] = d.style.name; }
    if (FIN && d.fin && C[HR[id].combo]) {
      FIN[id] = d.fin;
      const key = 'clan_' + id, st = K ? K.styleOf(id) : null;
      C[key] = C[HR[id].combo].map((a, i, all) => Object.assign({}, a, { el: st, clan: id }, i === all.length - 1 ? { fin: true } : {}));
      HR[id].combo = key;
    }
    if (LINES && d.lines) LINES[id] = d.lines;
    N.RIG[id] = d.rig; N.BORROW[id] = d.borrow || 'kael';
    N.portraits([id]);
    if (V && V.tune && d.tune) V.tune[id] = d.tune;
    const es = {}, zh = {};
    Object.keys(d.tr || {}).forEach(en => { es[en] = d.tr[en][0]; zh[en] = d.tr[en][1]; });
    if (d.ultTr) { Object.assign(es, N.ultText('es', k.ult.desc, d.ultTr[0])); Object.assign(zh, N.ultText('zh', k.ult.desc, d.ultTr[1])); }
    N.tr('es', es); N.tr('zh', zh);
  }

  // ================= builders =================
  const cols = st => (K && K.STYLE[st] ? K.STYLE[st].c : ['#ffffff', '#c8ccd8', '#8a92a8']);
  const emit = (st, x, y, n, o) => { if (K) K.emit(st, x, y, n, o); };
  const orb = (ctx, x, y, r, c) => { art.glow(ctx, x, y, r + 5, c[0], 0.18); art.disc(ctx, c[0], x, y, r); art.disc(ctx, c[1], x, y, Math.max(1, r - 2)); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 2); };
  // a projectile in an element. o: Proj options (dmg, vx, vy, life, w, h, pierce ...) plus paint(ctx, x, y, proj, cols), tick(proj, g, z), r (orb size)
  function shot(p, z, st, o) {
    const c = cols(st), paint = o.paint, tick = o.tick, onEnd = o.onEnd, q = Object.assign({}, o); delete q.paint; delete q.tick; delete q.onEnd;
    const pr = new Proj(Object.assign({ x: p.x + p.face * 14, y: p.y - 22, vx: p.face * 7, w: 12, h: 12, life: 40, kx: 1.5, stun: 22, r: 4 }, q, {
      render(ctx, x, y, s) { if (paint) paint(ctx, x, y, s, c); else orb(ctx, x, y, s.r, c); },
      think(g, zz) { if (K && this.t % 2 === 0) K.trail(st, this.x, this.y, this.vx, this.vy); if (tick) tick(this, g, zz); },
      onEnd(g, zz, impact) { if (K) K.burst(st, this.x, this.y, 0.8); if (onEnd) onEnd.call(this, g, zz, impact); } }));
    z.shots.push(pr); return pr;
  }
  // an area that stays for a while and hits whatever is in it every few frames. o: { x, y, w, h, life, every, dmg, atk, paint, tick, n (particles a frame) }
  function area(p, z, st, o) {
    const hs = () => new Set();
    const v = new N.Vis(o.x, o.y, o.life || 120, (ctx, x, y, t, s) => {
      const a = Math.min(1, t / 8, ((o.life || 120) - t) / 12);
      if (o.paint) o.paint(ctx, x, y, t, s, a, cols(st));
      else { ctx.globalAlpha = 0.18 * a; art.rect(ctx, cols(st)[0], x - o.w / 2, y - o.h, o.w, o.h); ctx.globalAlpha = 1; }
    }, (s, g, zz) => {
      if (K && s.t % 3 === 0) for (let i = 0; i < (o.n || 1); i++) K.add(st, s.x + rand(-o.w / 2, o.w / 2), s.y - rand(0, o.h), rand(-0.3, 0.3), rand(-0.8, 0));
      if (o.dmg && s.t >= (o.delay || 0) && (s.t - (o.delay || 0)) % (o.every || 20) === 0) N.hit(s.x - o.w / 2, s.y - o.h, o.w, o.h, o.dmg, Object.assign({ ky: -0.5, kx: 0, stun: 16, hitSet: hs(), srcX: s.x }, o.atk));
      if (o.tick) o.tick(s, g, zz);
    });
    z.shots.push(v); return v;
  }
  // a burst at x, y: particles, rings, and one hit in a circle of radius r
  function boom(p, st, x, y, r, dmg, atk) {
    const c = cols(st); emit(st, x, y, 14, { power: 1.4 }); fx.ring(x, y, c[0], 4, r, 14); fx.ring(x, y, c[1] || '#ffffff', 2, Math.round(r * 0.6), 10); fx.shake(3, 6); sfx('explode');
    return N.hit(x - r, y - r, r * 2, r * 2, dmg, Object.assign({ ky: -3, stun: 26, heavy: true, srcX: x }, atk));
  }
  // a dash that carries the hero forward through enemies: o = { n, step (px a frame), dmg, atk, pose, every (re-hit), end(p, z) }
  function dash(p, z, st, o) {
    const dir = p.face, hs = new Set(); sfx('dash');
    z.shots.push(new N.Drive(p, o.n || 12, t => {
      p.vx = 0; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2); p.pose = o.pose || ['dash', 0];
      const ok = N.slide(p, z, dir, o.step || 7);
      if (o.every && t % o.every === 0) hs.clear();
      N.hit(...N.front(p, 30, 40, 10), o.dmg, Object.assign({ kx: dir * 2, ky: -2, stun: 26, hitSet: hs, srcX: p.x - dir * 12 }, o.atk));
      if (K) K.trail(st, p.x - dir * 6, p.y - 18, dir * 6, 0);
      if (t % 2) fx.ghost(p.sheet(), (o.pose || ['dash'])[0], (o.pose || [0, 0])[1], p.x, p.y, dir < 0);
      if (!ok) return false;
    }, o.end));
  }
  // a column out of the ground in an element's colours
  const basePillar = N.pillar;
  const column = (z, st, x, gy, delay, dmg, o) => basePillar(z, x, gy, delay, dmg, Object.assign({ w: 14, h: 52, cols: cols(st), spike: true, sfx: 'heavy' }, o));
  // an ultimate: o = { st, start(p, z, foes), from, to, every, each(p, z, e, dmg, k), at (finisher frame), mult, final(p, z, e, dmg), atk, finalAtk }
  function ult(o) {
    return (p, z, foes, dmg, h) => {
      const st = o.st;
      if (p.st === 6) { fx.flash(h.colorHi, 8); sfx(o.sfx || 'roar'); if (o.start) o.start(p, z, foes, dmg); }
      if (o.during) o.during(p, z, foes, dmg);
      if (N.every(p, o.from || 12, o.to || 52, o.every || 8)) {
        const k = (p.st - (o.from || 12)) / (o.every || 8); sfx(o.hitSfx || 'swing');
        foes.forEach(e => { if (o.each) o.each(p, z, e, dmg, k); else { const b = e.box(); emit(st, b.x + b.w / 2, b.y + b.h / 2, 8); } N.hurt(e, dmg, Object.assign({ ky: -1, stun: 30 }, o.atk)); });
      }
      if (p.st === (o.at || 60)) {
        fx.flash('#ffffff', 10); fx.shake(10, 18); sfx('explode');
        foes.forEach(e => { const b = e.box(); emit(st, b.x + b.w / 2, b.y + b.h / 2, 24, { power: 2 }); if (o.final) o.final(p, z, e, dmg); N.hurt(e, dmg * (o.mult || 4), Object.assign({ ky: -6, down: true, stun: 50 }, o.finalAtk)); });
      }
    };
  }
  // the opponent fighter (Versus) or the enemy (story) a hit landed on: per-target trait state lives here
  const holder = e => N.fighterOf(e) || e;
  // energy given back: in Versus it has to go where the frame's energy is settled (versus.js fightTick)
  const refund = (p, n) => { if (G.scene === 'vs' && V && V.cur && V.cur.p === p) V.cur.bonus += n; else if (G.state) G.state.energy = Math.min(300, G.state.energy + n); };
  // move an enemy (or a Versus opponent) toward x by up to n pixels, stopping at walls; heavy enemies and bosses do not move
  const drag = (z, e, x, n) => { if (!e || e.dead) return; const f = N.fighterOf(e), q = f ? f.p : (e.isBoss || (e.def && e.def.heavy) ? null : e); if (!q) return; const dd = Math.sign(x - q.x); for (let s = 0; s < n && Math.abs(x - q.x) > 2; s++) { if (z.hit(q.x + dd - (q.w || 12) / 2, q.y - (q.h || 30), q.w || 12, q.h || 30)) break; q.x += dd; } };
  // floating text over the hero, for traits
  const pop = (p, s, col) => fx.text(p.x, p.y - 52, s, col);
  // the sideways speed that makes a lob (start vy, gravity g, from height y0) come down on the nearest enemy ahead; def when there is none
  const lobVx = (p, z, vy, g, y0, def) => {
    const e = N.ahead(p, z, 260); if (!e) return p.face * def;
    const dy = (e.y - 12) - y0, t = (-vy + Math.sqrt(Math.max(0, vy * vy + 2 * g * dy))) / g;
    return SW.clamp((e.x - p.x - p.face * 14) / Math.max(8, t), -7, 7);
  };

  Object.assign(N, { clan, cols, orb, shot, area, boom, dash, column, ult, holder, refund, drag, pop, emit, lobVx });
  N.kit = true;
})();
