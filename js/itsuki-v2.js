'use strict';
// Shattered Worlds — ITSUKI · AWAKENED ('itsuki2'), Itsuki's second form (the user, 2026-11-22: "Itsuki version 2 ... he now
// knows how to combine the elements"). A Versus-only Hidden Clans hero, registered with js/ninja-kit.js like the others,
// loaded right after js/ninjas7.js. The original Itsuki is not touched: every Itsuki rule elsewhere checks the id
// 'itsuki', and nothing here changes him.
//   Looks    Itsuki's own sprite (his sheets, not a redraw), drawn 1.2x larger, with a small singularity turning over his
//            head and a faint violet aura.
//   U        SCALDING STEAM (fire + water): a boiling orb bursts into a cloud of steam that scalds, slows and blinds
//            (no perfect blocks inside it). W + U lobs it upward.
//   S+U      FIRE TORNADO (wind + fire): a burning twister that travels forward, drags in and lifts whoever it catches,
//            and bursts into flame at the end.
//   I        THUNDER PHOENIX (thunder + fire): a burning, crackling bird rises and dives through the opponent; lightning
//            and a column of flame where it lands.
//   S+I      THORNWOOD SWAMP (water + earth): the ground ahead turns to sucking swamp (slows, shortens jumps) and three
//            thorned trees burst up through it, the last one throwing the target into the air.
//   W+O      FROST GALE (wind + water): an ice storm blows ahead of him and freezes whoever stays in it solid.
//   W+I      EVENT HORIZON: a black hole. The cinematic (close-up, pull, crush, explosion) is js/itsuki-v2-ult.js,
//            run by js/ult-grand.js like the other grand ultimates; the plain fallback below is only for when that is off.
//   Lock     the same as Itsuki's: open only when Itsuki himself is open (js/ninjas7.js: every other locked hero first).
// Versus balance (damage and health) and the bot's use of the five skills are in js/itsuki-v2-ult.js.
// SW.itsuki2.on = false turns off the 1.2x size; the hero stays.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, N = SW.ninja, V = SW.versus;
  if (!N || !N.kit || !D.heroes.itsuki || !SW.Player) return;
  const rand = SW.rand, P = SW.Player.prototype, HR = D.heroes, I = SW.input;
  const { clan, shot, boom, emit, hit, hurt, ahead, nearest, floorY, Later, Vis, sfx, drag } = N;
  const ID = 'itsuki2', BASE = 'itsuki', SCALE = 1.2;
  const S2 = SW.itsuki2 = { on: true, SCALE, ID };
  const R = Math.round, PI = Math.PI;
  const isMe = g => !!(g && g.state && g.state.hero === ID);
  const vsOn = () => G.scene === 'vs' && V && V.f && V.f.length === 2;
  // the opponent fighters whose bodies overlap a rectangle (Versus); in the story there are none (the hits still land)
  function foesIn(p, x, y, w, h) {
    if (!vsOn()) return [];
    return V.f.filter(f => f.p && f.p !== p && !f.p.dead).map(f => f.p).filter(q => { const b = q.box(); return b.x < x + w && b.x + b.w > x && b.y < y + h && b.y + b.h > y; });
  }
  const mark = (q, k, n) => { q[k] = Math.max(q[k] || 0, n); };
  const pose = (p, z, anim, n) => {   // a pose held while he stays in the cast
    const v = new Vis(p.x, p.y, n || 16, () => {}, vv => { if (p.state !== 'cast' || p.dead) { if (p.pose && p.pose[0] === anim) p.pose = null; vv.gone = true; return; } p.pose = [anim, vv.t < 4 ? 0 : 1]; });
    z.shots.push(v);
  };
  const part = (x, y, col, vx, vy, life, s, g) => fx.list.push({ k: 'p', x, y, vx: vx || 0, vy: vy || 0, g: g || 0, life: life || 14, max: life || 14, col, s: s || 2 });
  const hsh = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

  // ================= SCALDING STEAM (U): fire + water =================
  const STEAM = { rim: '#6c7088', body: '#c8ccd8', lite: '#eef0f6', hot: '#ff8a3a', drop: '#7fd8ff' };
  function puff(ctx, x, y, r, warm) {   // one round puff, lit from the upper left, a dark rim below (warm: lit orange from the boiling water under it)
    if (r < 2) return;
    art.disc(ctx, warm ? '#8a5a48' : STEAM.rim, x + 1, y + 1, r); art.disc(ctx, warm ? '#e8c4a8' : STEAM.body, x, y, r); art.disc(ctx, warm ? '#fff0e0' : STEAM.lite, x - R(r * 0.3), y - R(r * 0.3), Math.max(1, R(r * 0.55)));
  }
  function steamCloud(p, z, x, gy, dmg) {
    const W0 = 84, H0 = 64, LIFE = 100, dir = p.face, hs = () => new Set(), seed = rand(0, 99);
    sfx('burst'); fx.ring(x, gy - 24, STEAM.lite, 6, 46, 14); fx.ring(x, gy - 24, STEAM.hot, 4, 30, 10);
    const v = new Vis(x, gy, LIFE, (ctx, sx, sy, t) => {
      const a = Math.min(1, t / 6, (LIFE - t) / 18), grow = Math.min(1, t / 10);
      ctx.globalAlpha = a; for (let i = -W0 / 2 + 6; i < W0 / 2 - 6; i += 3) { const hh = 1 + R(2 * Math.abs(Math.sin(i * 0.4 + t * 0.3))); art.rect(ctx, (i + t) % 9 < 3 ? '#ffd24a' : STEAM.hot, sx + i, sy - hh, 2, hh); } ctx.globalAlpha = 1;   // the boiling water under it
      ctx.globalAlpha = 0.92 * a;
      for (let i = 0; i < 13; i++) {   // the billows: each puff drifts up and swells, then thins
        const ph = (t * 0.012 + hsh(seed, i)) % 1, px = sx + R((hsh(seed, i + 20) - 0.5) * W0 * grow + Math.sin(t * 0.05 + i) * 4), py = sy - 8 - R(ph * H0 * grow) - R(hsh(seed, i + 40) * 10);
        puff(ctx, px, py, R((6 + hsh(seed, i + 60) * 7) * grow * (0.7 + 0.5 * Math.sin(PI * ph))), ph < 0.22);
      }
      ctx.globalAlpha = a;
      for (let i = 0; i < 6; i++) { const u = ((t * 0.04 + i / 6) % 1), dx = R((hsh(seed, i + 80) - 0.5) * W0 * 0.8); art.rect(ctx, i % 2 ? STEAM.drop : STEAM.hot, sx + dx, sy - 4 - R(u * 26), 2, 2); }   // boiling drops and sparks
      if (t % 4 < 2) art.rect(ctx, '#ffffff', sx + R((hsh(seed, t) - 0.5) * W0 * 0.6), sy - R(hsh(t, seed) * 40) - 10, 1, 1);
      ctx.globalAlpha = 1;
    }, (s) => {
      s.x += dir * 0.35;
      const bx = s.x - W0 / 2, by = s.y - H0;
      foesIn(p, bx, by, W0, H0).forEach(q => { mark(q, 'its2Slow', 22); mark(q, 'its2Blind', 26); });   // inside: scalded, slowed and blinded
      if (s.t > 4 && s.t % 16 === 4) hit(bx, by, W0, H0, Math.max(1, R(dmg * 0.32)), { its2: 'steam', hitSet: hs(), kx: 0, ky: -0.6, stun: 22, status: { burn: 2 }, srcX: s.x });
      if (s.t % 3 === 0) part(s.x + rand(-W0 / 2, W0 / 2), s.y - rand(10, H0), rand(0, 1) < 0.6 ? STEAM.lite : STEAM.body, rand(-0.3, 0.3), -rand(0.4, 1), 26, 3, -0.01);
    });
    z.shots.push(v);
  }
  function castSteam(p, z, dmg, up) {
    pose(p, z, 'a3', 14); sfx('shoot');
    const hx = p.x + p.face * 14, hy = p.y - 24;
    fx.ring(hx, hy, STEAM.drop, 3, 20, 10); fx.ring(hx, hy, STEAM.hot, 2, 14, 8); emit('water', hx, hy, 6, { dir: p.face }); emit('fire', hx, hy, 6, { dir: p.face });
    const pr = shot(p, z, 'water', { its2: 'steam', dmg: R(dmg * 0.6), vx: p.face * (up ? 4.4 : 6.6), vy: up ? -4.6 : 0, g: up ? 0.16 : 0, life: up ? 40 : 28, w: 14, h: 14, kx: 1.5, ky: -2, stun: 26, status: { burn: 2 },
      paint(ctx, x, y, s) {   // a shell of boiling water round a heart of fire, steam streaming off it
        art.disc(ctx, '#0f4c75', x, y, 7); art.disc(ctx, '#2a9df4', x, y, 6); art.disc(ctx, '#7fd8ff', x - 1, y - 1, 4);
        art.disc(ctx, '#e2460e', x, y, 3); art.disc(ctx, '#ffd24a', x, y, 2); art.rect(ctx, '#ffffff', x - 2, y - 4, 2, 2);
        const d = Math.sign(s.vx) || 1; for (let i = 1; i < 5; i++) { ctx.globalAlpha = 0.7 - i * 0.14; puff(ctx, x - d * (6 + i * 5), y - i * 2 + (s.t + i) % 3 - 1, 4 - (i >> 1)); } ctx.globalAlpha = 1;
      },
      onEnd(g, zz) { const gy = floorY(zz, this.x, this.y - 6); steamCloud(p, zz, this.x, Math.min(gy, this.y + 40), dmg); } });
    return pr;
  }

  // ================= FIRE TORNADO (S+U): wind + fire =================
  const FIRE = ['#ffffff', '#ffe27a', '#ffb52e', '#ff7a1a', '#e2460e', '#a81e08', '#5a0e06'];
  function twister(ctx, x, y, t, k, rows, dir) {   // a burning funnel: white-hot at the root, red and smoke at the crown
    const n = Math.round(rows * k);
    art.glow(ctx, x, y - 30, 30, '#ff7a1a', 0.1 * k);
    ctx.globalAlpha = 0.9 * k;
    for (let i = -10; i <= 10; i += 2) art.rect(ctx, Math.abs(i) < 5 ? '#ffe27a' : '#e2460e', x + i * 2, y - 1 - (Math.abs(i) < 4 && (t + i) % 4 < 2 ? 1 : 0), 3, 2);   // the burning ground at its root
    for (let j = 0; j < n; j++) {
      const hy = y - 2 - j * 3, u = j / rows, w = 6 + j * 1.6, sx = R(Math.sin(t * 0.16 + j * 0.13) * j * 0.32 * dir), a = t * 0.62 - j * 0.3, cx = x + sx;
      const ci = Math.min(FIRE.length - 1, Math.floor(u * 5.2) + 1), col = FIRE[ci], dk = FIRE[Math.min(FIRE.length - 1, ci + 1)], top = u > 0.84;
      ctx.globalAlpha = (top ? 0.4 : 0.75) * k; art.rect(ctx, dk, R(cx - w / 2), hy, R(w), 3);   // the body of the funnel
      ctx.globalAlpha = (top ? 0.55 : 1) * k;
      for (let b = 0; b < 3; b++) {   // three bands of flame wound round it: bright in front, dark behind
        const aa = a + b * 2.094, bx = R(cx + Math.cos(aa) * w / 2), front = Math.sin(aa) > 0;
        art.rect(ctx, front ? col : FIRE[Math.min(FIRE.length - 1, ci + 2)], bx - (front ? 3 : 2), hy, front ? 6 : 4, front ? 3 : 2);
      }
      if (u < 0.62) art.rect(ctx, u < 0.25 ? '#ffffff' : FIRE[1], R(cx - w * 0.12), hy, Math.max(1, R(w * 0.24)), 3);   // the white-hot heart
      if (j % 4 === (t >> 1) % 4) { const sd = (j >> 2) % 2 ? 1 : -1; art.rect(ctx, FIRE[2], R(cx + sd * w / 2) + (sd > 0 ? 0 : -4), hy + 1, 4, 1); art.rect(ctx, FIRE[1], R(cx + sd * (w / 2 + 4)) + (sd > 0 ? 0 : -2), hy, 2, 1); }   // a tongue of flame licking out
      if (top && j % 2) { ctx.globalAlpha = 0.5 * k; art.disc(ctx, '#3a2a2a', R(cx + Math.cos(a * 0.5) * w * 0.4), hy - 2, 4); art.disc(ctx, '#5a4040', R(cx + Math.cos(a * 0.5) * w * 0.4) - 1, hy - 3, 2); }   // smoke off the crown
    }
    ctx.globalAlpha = 1;
  }
  function castTornado(p, z, dmg) {
    pose(p, z, 'special', 16); sfx('burst'); fx.ring(p.x + p.face * 20, p.y - 20, '#ffb52e', 4, 34, 12);
    emit('wind', p.x + p.face * 16, p.y - 20, 8, { dir: p.face }); emit('fire', p.x + p.face * 16, p.y - 20, 8, { dir: p.face });
    const dir = p.face, LIFE = 70, x0 = p.x + dir * 30; let hs = new Set();
    const v = new Vis(x0, floorY(z, x0, p.y - 20), LIFE, (ctx, sx, sy, t) => twister(ctx, sx, sy, t, Math.min(1, t / 6, (LIFE - t) / 6), 32, dir),
      (s, g, zz) => {
        if (s.t < LIFE - 8) { const nx = s.x + dir * 2.3; if (!zz.hit(nx - 4, s.y - 40, 8, 30)) s.x = nx; s.y = floorY(zz, s.x, s.y - 30); }
        if (s.t % 9 === 0) hs = new Set();
        const n = hit(s.x - 18, s.y - 96, 36, 96, Math.max(1, R(dmg * 0.42)), { its2: 'tornado', hitSet: hs, kx: dir * 0.6, ky: -2.6, stun: 32, status: { burn: 3 }, srcX: s.x - dir * 30 });
        foesIn(p, s.x - 30, s.y - 100, 60, 100).forEach(q => { if (q.state === 'hurt') { const dx = s.x - q.x; q.x += SW.clamp(dx * 0.25, -3, 3); q.vy = Math.min(q.vy, -1.2); } });   // dragged in and carried up
        if (n && s.t % 9 === 0) sfx('swing');
        if (s.t % 2 === 0) { const a = s.t * 0.6, r = 10 + rand(0, 14); part(s.x + Math.cos(a) * r, s.y - rand(4, 90), rand(0, 1) < 0.5 ? FIRE[2] : FIRE[4], -Math.sin(a) * 1.4, -rand(0.6, 1.6), 18, 2, -0.02); }
        if (s.t === LIFE - 8) {   // it bursts
          boom(p, 'fire', s.x, s.y - 40, 42, R(dmg * 1.3), { its2: 'tornado', kx: dir * 5, ky: -6.2, launch: true, stun: 46, status: { burn: 4 } });
          fx.ring(s.x, s.y - 40, '#ffe27a', 6, 60, 14); fx.ring(s.x, s.y - 40, '#a81e08', 4, 76, 18); fx.flash('#ff7a1a', 2); fx.shake(6, 10);
          for (let i = 0; i < 14; i++) part(s.x + rand(-10, 10), s.y - rand(10, 80), FIRE[1 + (i % 4)], rand(-3, 3), -rand(1, 4), 22, 3, 0.08);
        }
      });
    z.shots.push(v);
  }

  // ================= THUNDER PHOENIX (I): thunder + fire =================
  // the bird, side view, (0, 0) its body, facing +x, s its length: a raptor of fire whose wings are lightning (zig-zag
  // trailing edges, white leading edges) and whose tail streams flame. Drawn crisp through js/pixel-kit.js.
  const PHPAL = ['#1a0612', '#5a0e2a', '#a8183a', '#e2460e', '#ff8a1a', '#ffc23a', '#ffe866', '#ffffff', '#9fe8ff', '#6a3ab0'];
  const PC = { k: PHPAL[0], d: PHPAL[1], r: PHPAL[2], ro: PHPAL[3], o: PHPAL[4], a: PHPAL[5], y: PHPAL[6], w: PHPAL[7], c: PHPAL[8], v: PHPAL[9] };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  function boltWing(c, s, a, far, t) {   // a: 1 raised, -1 beaten down; a broad wing swept back, its trailing edge a row of lightning teeth
    const L = s * 1.35, th = PI + 0.3 + a * 1.0 + (far ? -0.18 : 0);
    const sx = s * 0.05, sy = -s * 0.1, tx = sx + Math.cos(th) * L, ty = sy + Math.sin(th) * L, rx = -s * 0.32, ry = s * 0.04;
    const mx = (sx + tx) / 2, my = (sy + ty) / 2; let nx = -Math.sin(th), ny = Math.cos(th);
    if (nx * (rx - mx) + ny * (ry - my) > 0) { nx = -nx; ny = -ny; }   // n: away from the body
    const bx = mx + nx * s * 0.12, by = my + ny * s * 0.12, pts = [[sx, sy], [bx, by], [tx, ty]];
    for (let i = 1; i <= 5; i++) { const u = i / 6, px = tx + (rx - tx) * u, py = ty + (ry - ty) * u, o = (i % 2 ? 0.2 : 0.02) * s; pts.push([px - nx * o, py - ny * o]); }
    pts.push([rx, ry]);
    for (let i = 1; i <= 5; i += 2) { const u = i / 6, px = tx + (rx - tx) * u, py = ty + (ry - ty) * u; poly(c, [[px, py], [px - nx * s * 0.3 + (rx - tx) * 0.05, py - ny * s * 0.3 + (ry - ty) * 0.05 + Math.sin(t * 0.6 + i) * s * 0.03], [px + (rx - tx) * 0.1, py + (ry - ty) * 0.1]], far ? PC.d : PC.ro); }   // flame under the teeth
    poly(c, pts, far ? PC.v : PC.y);
    poly(c, [[sx, sy], [bx, by], [tx, ty], [mx - nx * s * 0.1, my - ny * s * 0.1]], far ? PC.c : PC.w);   // the bright leading half
    c.strokeStyle = far ? PC.c : PC.c; c.lineWidth = Math.max(1, s * 0.05); c.beginPath(); c.moveTo(sx, sy); c.lineTo(bx, by); c.lineTo(tx, ty); c.stroke();
    c.strokeStyle = far ? PC.w : PC.a; c.lineWidth = Math.max(1, s * 0.035); c.beginPath(); c.moveTo(sx - s * 0.05, sy + s * 0.04);   // a vein of lightning to the tip
    for (let i = 1; i <= 4; i++) { const u = i / 4, px = sx + (tx - sx) * u * 0.92, py = sy + (ty - sy) * u * 0.92, o = (i % 2 ? -0.07 : 0.05) * s; c.lineTo(px - nx * o * 1.6, py - ny * o * 1.6); }
    c.stroke();
  }
  function phoenixVec(c, s, o) {
    const t = o.t || 0, a = o.wing !== undefined ? o.wing : Math.sin(t * 0.55);
    for (let i = 0; i < 3; i++) {   // the tail: three streams of flame
      const len = s * (i === 1 ? 1.6 : 1.2), lift = (i - 1) * 0.18, top = [], bot = [];
      for (let k = 0; k <= 8; k++) { const u = k / 8, x = -s * 0.28 - u * len, y = lift * s * u + Math.sin(t * 0.35 - u * 5 + i) * s * 0.08 * u, w = s * 0.09 * (1 - u); top.push([x, y - w]); bot.unshift([x, y + w]); }
      poly(c, top.concat(bot), i === 1 ? PC.o : PC.ro);
      poly(c, top.slice(0, 6).concat(bot.slice(-6).map(q => [q[0], q[1] - s * 0.04])), i === 1 ? PC.y : PC.a);
    }
    boltWing(c, s, a, true, t);
    poly(c, [[s * 0.4, -s * 0.06], [s * 0.18, -s * 0.18], [-s * 0.14, -s * 0.15], [-s * 0.36, 0], [-s * 0.1, s * 0.13], [s * 0.22, s * 0.1]], PC.ro);   // body
    poly(c, [[s * 0.4, -s * 0.06], [s * 0.18, -s * 0.18], [-s * 0.14, -s * 0.15], [-s * 0.3, -s * 0.03], [s * 0.2, -s * 0.05]], PC.o);
    poly(c, [[s * 0.3, -s * 0.02], [s * 0.1, s * 0.09], [-s * 0.12, s * 0.06], [s * 0.05, -s * 0.03]], PC.a);   // the bright chest
    poly(c, [[s * 0.3, -s * 0.12], [s * 0.46, -s * 0.3], [s * 0.58, -s * 0.24], [s * 0.44, -s * 0.02]], PC.o);   // neck
    const hx = s * 0.56, hy = -s * 0.28;   // the head: a crest of three lightning spikes swept back, a hooked beak, a white eye
    for (let i = 0; i < 3; i++) { const bx = hx - s * 0.04 - i * s * 0.05, by = hy - s * 0.06; poly(c, [[bx, by], [bx - s * 0.32 + i * s * 0.04, by - s * (0.22 - i * 0.05)], [bx - s * 0.16, by - s * 0.04], [bx - s * 0.3, by + s * 0.02]], i === 1 ? PC.y : PC.a); }
    poly(c, [[hx - s * 0.1, hy + s * 0.07], [hx - s * 0.08, hy - s * 0.08], [hx + s * 0.08, hy - s * 0.1], [hx + s * 0.16, hy], [hx + s * 0.04, hy + s * 0.09]], PC.a);
    poly(c, [[hx + s * 0.1, hy - s * 0.07], [hx + s * 0.3, hy - s * 0.03], [hx + s * 0.32, hy + s * 0.06], [hx + s * 0.22, hy + s * 0.02], [hx + s * 0.1, hy + s * 0.02]], PC.w);   // beak
    poly(c, [[hx + s * 0.26, hy], [hx + s * 0.32, hy + s * 0.06], [hx + s * 0.27, hy + s * 0.04]], PC.v);
    poly(c, [[hx - s * 0.02, hy - s * 0.07], [hx + s * 0.12, hy - s * 0.045], [hx + s * 0.1, hy - s * 0.015], [hx - s * 0.01, hy - s * 0.04]], PC.k);   // brow
    poly(c, [[hx + s * 0.02, hy - s * 0.035], [hx + s * 0.1, hy - s * 0.02], [hx + s * 0.04, hy - s * 0.005]], PC.c);   // eye
    boltWing(c, s, a, false, t);
  }
  function phoenix(ctx, x, y, s, dir, o) {
    const PX = SW.pix; o = o || {};
    if (!PX) { art.disc(ctx, PC.o, x, y, R(s * 0.3)); art.disc(ctx, PC.y, x, y, R(s * 0.18)); return; }
    PX.sprite(ctx, x, y, s * 4, s * 3.6, c => { c.scale(dir < 0 ? -1 : 1, 1); if (o.rot) c.rotate(o.rot); phoenixVec(c, s, o); }, { pal: PHPAL, alpha: o.a, mono: o.mono });
  }
  S2.phoenix = phoenix;
  function arc(ctx, x0, y0, x1, y1, col, seed) {   // a crackle of lightning between two points
    const n = 5; let px = x0, py = y0;
    for (let i = 1; i <= n; i++) { const u = i / n, nx = x0 + (x1 - x0) * u + (i < n ? (hsh(seed, i) - 0.5) * 12 : 0), ny = y0 + (y1 - y0) * u + (i < n ? (hsh(i, seed) - 0.5) * 12 : 0); art.line(ctx, col, R(px), R(py), R(nx), R(ny), 1); px = nx; py = ny; }
  }
  function castPhoenix(p, z, dmg) {
    pose(p, z, 'special', 22); sfx('charge'); fx.flash('#ffe866', 2);
    const dir = p.face, x0 = p.x + dir * 10, y0 = p.y - 34, hs = new Set(), RISE = 16, DIVE = 22;
    fx.bolt(p.x, p.y - 40, p.x + rand(-6, 6), G.cam.y, '#ffe866'); fx.ring(x0, y0, '#ffc23a', 4, 40, 12); emit('fire', x0, y0, 10, { up: true }); emit('bolt', x0, y0, 8, {});
    const me = { x: x0, y: y0, vx: 0, vy: 0, rot: 0, aim: null, landed: false };
    const v = new Vis(x0, y0, RISE + DIVE + 30, (ctx, sx, sy, t) => {
      if (me.landed) return;
      const s = 26, flap = t < RISE ? Math.sin(t * 0.7) : -0.35;
      for (let i = 1; i <= 3; i++) { ctx.globalAlpha = 0.5 - i * 0.12; art.disc(ctx, i === 1 ? PC.a : PC.ro, R(sx - me.vx * i * 2.2), R(sy - me.vy * i * 2.2), 7 - i * 2); } ctx.globalAlpha = 1;   // the burning wake of its passing
      art.glow(ctx, sx, sy, 26, '#ffc23a', 0.12);
      phoenix(ctx, sx, sy, s, dir, { t, wing: flap, rot: me.rot });
      const ca = Math.cos(me.rot * dir), sa = Math.sin(me.rot);   // lightning crackles between its wingtips and off its tail
      if (t % 2 === 0) { arc(ctx, sx - dir * 6, sy - 20, sx + dir * 12, sy - 26, '#ffffff', t); arc(ctx, sx - dir * 30 * ca, sy + 6 * sa, sx - dir * 44, sy + rand(-12, 12), '#ffe866', t + 7); }
    }, (s, g, zz) => {
      const t = s.t;
      if (t < RISE) {   // rise in an arc
        const u = t / RISE; me.vx = dir * (3.2 - u); me.vy = -3.6 + u * 3.2; me.rot = -0.5 * (1 - u) * dir;
      } else if (!me.aim) {   // pick the target at the top of the arc and fold the wings to dive
        const q = ahead(p, zz, 320) || nearest(zz, me.x, me.y, 340), b = q && q.box ? q.box() : null;
        me.aim = b ? [b.x + b.w / 2, b.y + b.h * 0.55] : [p.x + dir * 160, p.y - 14];
        const dx = me.aim[0] - me.x, dy = me.aim[1] - me.y, d = Math.max(1, Math.hypot(dx, dy)), sp = Math.max(8.5, d / 12);
        me.vx = dx / d * sp; me.vy = dy / d * sp; me.rot = Math.atan2(me.vy, Math.abs(me.vx)) * (dir > 0 ? 1 : -1) * (Math.sign(me.vx) === dir || !me.vx ? 1 : -1);
        sfx('dash'); fx.bolt(me.x, G.cam.y, me.x, me.y, '#ffffff');
      }
      if (me.landed) return;
      me.x += me.vx; me.y += me.vy; s.x = me.x; s.y = me.y;
      if (t % 2 === 0) { part(me.x - me.vx * 1.5 + rand(-4, 4), me.y - me.vy * 1.5 + rand(-4, 4), rand(0, 1) < 0.5 ? PC.o : PC.y, -me.vx * 0.1, -me.vy * 0.1 - 0.3, 16, 2, -0.02); if (t % 4 === 0) part(me.x + rand(-6, 6), me.y + rand(-6, 6), PC.c, rand(-1, 1), rand(-1, 1), 8, 1); }
      if (me.aim) {   // through whoever it meets
        const n = hit(me.x - 16, me.y - 14, 32, 28, R(dmg * 1.05), { its2: 'phoenix', hitSet: hs, kx: Math.sign(me.vx || dir) * 3, ky: -3.5, stun: 48, heavy: true, status: { burn: 4, freeze: 14 }, srcX: me.x - me.vx * 4 });
        if (n) { fx.flash('#ffffff', 3); fx.shake(7, 10); sfx('explode'); sfx('zap'); fx.ring(me.x, me.y, '#ffe866', 6, 56, 14); fx.ring(me.x, me.y, '#e2460e', 4, 40, 12); emit('bolt', me.x, me.y, 12, { power: 1.6 }); emit('fire', me.x, me.y, 12, { power: 1.4 }); }
      }
      const gy = floorY(zz, me.x, me.y - 4);
      if (me.aim && (me.y >= gy - 4 || t >= RISE + DIVE || zz.hit(me.x - 2, me.y - 2, 4, 4))) {   // lands: lightning and a column of flame
        me.landed = true; const x = me.x, y = Math.min(gy, me.y + 30);
        for (let i = 0; i < 3; i++) fx.bolt(x + rand(-30, 30), G.cam.y, x + rand(-4, 4), y - 6, i % 2 ? '#ffffff' : '#ffe866');
        fx.flash('#ffe866', 3); fx.shake(9, 12); sfx('explode');
        N.column(zz, 'fire', x, y, 1, R(dmg * 0.55), { w: 26, h: 96, cols: ['#ff8a1a', '#ffe866', '#ffffff'], atk: { its2: 'phoenix', ky: -5.6, launch: true, stun: 44, status: { burn: 3 } } });
        boom(p, 'bolt', x, y - 20, 36, R(dmg * 0.35), { its2: 'phoenix', stun: 40, status: { freeze: 10 }, ky: -3 });
        s.gone = true;
      }
    });
    z.shots.push(v);
  }

  // ================= THORNWOOD SWAMP (S+I): water + earth =================
  const MUD = { k: '#141a0c', d: '#22301a', m: '#3a4a1c', l: '#5a7a2a', b: '#8aa84a', sheen: '#9ec0a0' };
  const BARK = { k: '#24160c', d: '#4a2e16', m: '#6e4622', l: '#9a6a34' };
  const LEAF = { k: '#08160c', d: '#123020', m: '#24543a', l: '#4a8a4a', h: '#9ed06a' };
  function tree(ctx, x, y, k, H, t, seed, out) {   // a thorned tree bursting from the swamp: k 0-1 grown, out 0-1 sinking
    const h = R(H * k), sink = R(H * out); if (h < 2) return;
    const bend = (hsh(seed, 1) - 0.5) * 10;
    const at = u => R(x + Math.sin(u * PI) * bend);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 60, y - H - 60, 120, H + 60); ctx.clip();
    ctx.translate(0, sink);
    for (let i = 0; i < h; i += 2) {   // the trunk, twisting up, thick at the root
      const u = i / H, w = Math.max(3, R(9 - u * 5)), cx = at(u);
      art.rect(ctx, BARK.k, cx - w - 1, y - i - 2, w * 2 + 2, 2); art.rect(ctx, BARK.d, cx - w, y - i - 2, w * 2, 2); art.rect(ctx, BARK.m, cx - w + 1, y - i - 2, w, 2);
      if ((i + seed) % 8 < 2) art.rect(ctx, BARK.l, cx - w + 2, y - i - 2, 2, 2);
      if (i % 8 === 4) { const sd = i % 16 < 8 ? 1 : -1; art.line(ctx, '#e8e4c0', cx + sd * w, y - i - 2, cx + sd * (w + 4), y - i - 5, 1); }   // thorns
    }
    [-1, 1].forEach(sd => art.line(ctx, BARK.d, at(0) + sd * 6, y, at(0) + sd * 16, y + 2, 2));   // roots
    [[0.5, 1], [0.66, -1], [0.82, 1]].forEach(([u, sd], i) => {   // branches with thorns
      if (h < H * u) return; const bx = at(u), by = y - R(H * u), L = R((14 - i * 2) * Math.min(1, (h - H * u) / 12));
      art.line(ctx, BARK.k, bx, by + 1, bx + sd * L, by - R(L * 0.7) + 1, 3); art.line(ctx, BARK.m, bx, by, bx + sd * L, by - R(L * 0.7), 2);
      art.rect(ctx, '#e8e4c0', bx + sd * R(L * 0.6), by - R(L * 0.45) - 2, 1, 2);
    });
    if (k > 0.55) {   // the crown of leaves
      const c = (k - 0.55) / 0.45, cx = at(1), cy = y - h - 2;
      const blobs = [[0, -4, 11], [-9, 2, 8], [9, 1, 8], [-4, -10, 7], [6, -9, 7], [0, 5, 7]];
      blobs.forEach(([dx, dy, r]) => art.disc(ctx, LEAF.k, cx + dx, cy + dy + 1, R(r * c) + 1));
      blobs.forEach(([dx, dy, r]) => art.disc(ctx, LEAF.d, cx + dx, cy + dy, R(r * c)));
      blobs.forEach(([dx, dy, r]) => art.disc(ctx, LEAF.m, cx + dx - 1, cy + dy - 1, R(r * c * 0.7)));
      blobs.slice(0, 4).forEach(([dx, dy, r]) => art.disc(ctx, LEAF.l, cx + dx - 2, cy + dy - 3, Math.max(1, R(r * c * 0.35))));
      for (let i = 0; i < 6; i++) art.rect(ctx, LEAF.h, cx + R((hsh(seed, i + 3) - 0.5) * 20 * c), cy + R((hsh(i + 3, seed) - 0.6) * 16 * c), 1, 1);
      for (let i = 0; i < 5; i++) art.rect(ctx, '#e8e4c0', cx + R((hsh(seed, i + 9) - 0.5) * 26 * c), cy + R((hsh(i + 9, seed) - 0.5) * 18 * c), 2, 1);   // thorns in the crown
    }
    ctx.restore();
  }
  function castSwamp(p, z, dmg) {
    pose(p, z, 'sweep', 18); sfx('heavy'); fx.shake(6, 12); fx.dust(p.x + p.face * 12, p.y, 10);
    emit('water', p.x + p.face * 14, p.y - 4, 8, { up: true }); emit('rock', p.x + p.face * 14, p.y - 4, 8, { up: true });
    const dir = p.face, gy = floorY(z, p.x, p.y - 20), L = 156, xa = p.x + dir * 12, LIFE = 176, seed = rand(0, 99), hs = () => new Set();
    const tgt = ahead(p, z, 190), tx = tgt ? SW.clamp((tgt.x - xa) * dir, 30, L - 10) : L * 0.62;
    const TREES = [{ u: Math.max(0.16, tx / L - 0.3), d: 10, H: 62 }, { u: Math.min(0.96, tx / L + 0.24), d: 18, H: 70 }, { u: tx / L, d: 26, H: 92, last: true }];
    const v = new Vis(xa, gy, LIFE, (ctx, sx, sy, t) => {
      const spread = Math.min(1, t / 14), out = Math.max(0, (t - (LIFE - 20)) / 20), len = R(L * spread);
      const x0 = dir > 0 ? sx : sx - len, a = 1 - out;
      ctx.globalAlpha = a;
      for (let i = 0; i < len; i += 2) {   // the mire: dark mud, a skin of green water, the edge rippling
        const xx = x0 + i, edge = Math.min(i, len - i) < 8, wob = R(Math.sin((i + t * 1.5) * 0.18) * 1);
        art.rect(ctx, MUD.k, xx, sy - 6 + wob, 2, 8); art.rect(ctx, MUD.d, xx, sy - 7 + wob, 2, 5); art.rect(ctx, edge ? MUD.d : MUD.m, xx, sy - 8 + wob, 2, 2); if (!edge && (i + (t >> 2)) % 14 < 4) art.rect(ctx, '#2a3a14', xx, sy - 5 + wob, 2, 1);
        if (!edge && (i * 7 + t) % 23 < 3) art.rect(ctx, MUD.sheen, xx, sy - 8 + wob, 2, 1);
      }
      for (let i = 0; i < 6; i++) {   // bubbles rise and burst
        const ph = (t * 0.03 + hsh(seed, i)) % 1, bx = x0 + R(hsh(i, seed) * len), r = R(1 + ph * 3);
        if (ph < 0.85) { art.ring(ctx, MUD.b, bx, sy - 8 - r, r); art.rect(ctx, '#ffffff', bx - 1, sy - 7 - r * 2 + 1, 1, 1); } else { art.rect(ctx, MUD.b, bx - 3, sy - 7, 1, 1); art.rect(ctx, MUD.b, bx + 3, sy - 7, 1, 1); }
      }
      for (let i = 0; i < 4; i++) { const rx = x0 + R(hsh(seed + 5, i) * len), rh = 6 + R(hsh(i, seed + 5) * 6); art.line(ctx, MUD.l, rx, sy - 4, rx + (i % 2 ? 1 : -1), sy - 4 - rh, 1); art.rect(ctx, BARK.m, rx + (i % 2 ? 1 : -1) - 1, sy - 4 - rh - 3, 2, 3); }   // reeds and cattails
      ctx.globalAlpha = 1;
      TREES.forEach((T0, i) => {   // the trees, after their delay
        const k = SW.clamp((t - T0.d) / 7, 0, 1); if (k <= 0) return;
        const outT = SW.clamp((t - T0.d - 52) / 14, 0, 1); if (outT >= 1) return;
        tree(ctx, R(sx + dir * L * T0.u), sy - 3, k < 1 ? 1 - Math.pow(1 - k, 3) : 1, T0.H, t, seed + i * 17, outT);
      });
    }, (s, g, zz) => {
      const t = s.t, len = L * Math.min(1, t / 14), bx = dir > 0 ? s.x : s.x - len;
      if (t < LIFE - 16) foesIn(p, bx, s.y - 30, len, 34).forEach(q => { if (q.onGround || q.y >= s.y - 3) { mark(q, 'its2Slow', 14); mark(q, 'its2Mire', 14); } });   // sucked down
      if (t > 12 && t < LIFE - 16 && t % 26 === 0) hit(bx, s.y - 12, len, 14, Math.max(1, R(dmg * 0.18)), { its2: 'swamp', hitSet: hs(), kx: 0, ky: -0.4, stun: 18, srcX: s.x });
      TREES.forEach((T0, i) => {
        const x = s.x + dir * L * T0.u;
        if (t === T0.d) {   // a tree tears up out of the mire
          sfx(T0.last ? 'explode' : 'heavy'); fx.shake(T0.last ? 9 : 5, 10); fx.debris(x, s.y - 6, MUD.m, 6); fx.ring(x, s.y - 4, LEAF.l, 4, 30, 12); emit('water', x, s.y - 4, 8, { up: true }); emit('thorns', x, s.y - 20, 8, { up: true });
          hit(x - 14, s.y - T0.H, 28, T0.H, R(dmg * (T0.last ? 1.25 : 0.6)), T0.last ? { its2: 'swamp', hitSet: hs(), ky: -8.2, kx: dir * 0.6, launch: true, stun: 58, heavy: true, breaker: true, srcX: x } : { its2: 'swamp', hitSet: hs(), ky: -4.6, kx: dir * 0.4, stun: 40, heavy: true, srcX: x });
        }
      });
    });
    z.shots.push(v);
  }

  // ================= FROST GALE (W+O): wind + water =================
  const ICE = { k: '#0e2a44', d: '#2a6a9a', m: '#7fd8ff', l: '#bfefff', w: '#ffffff' };
  function shard(ctx, x, y, r, col, tall) {   // a splinter of ice: a long thin diamond, dark edged, a white glint
    const hh = r * (tall ? 3 : 2);
    for (let dy = -hh; dy <= hh; dy++) { const w = Math.max(0, R(r * (1 - Math.abs(dy) / hh))); art.rect(ctx, ICE.d, x - w - 1, y + dy, w * 2 + 2, 1); if (w > 0) art.rect(ctx, col, x - w, y + dy, w * 2, 1); }
    art.rect(ctx, ICE.w, x - 1, y - R(hh * 0.4), 1, R(hh * 0.5));
  }
  function castGale(p, z, dmg) {
    pose(p, z, 'cheer', 18); sfx('burst'); fx.ring(p.x, p.y - 22, ICE.l, 6, 44, 14); fx.ring(p.x, p.y - 22, ICE.w, 4, 26, 10); emit('ice', p.x + p.face * 12, p.y - 20, 10, { dir: p.face }); emit('wind', p.x + p.face * 12, p.y - 20, 8, { dir: p.face });
    const dir = p.face, L = 176, H0 = 76, LIFE = 62, x0 = p.x, gy = floorY(z, p.x, p.y - 20), seed = rand(0, 99), hs = () => new Set();
    const v = new Vis(x0, gy, LIFE, (ctx, sx, sy, t) => {
      const a = Math.min(1, t / 5, (LIFE - t) / 10), reach = Math.min(1, t / 8);
      for (let j = 0; j < H0; j += 4) { ctx.globalAlpha = 0.2 * a * (1 - j / H0); art.rect(ctx, ICE.l, dir > 0 ? sx + 8 : sx - 8 - R(L * reach), sy - j - 4, R(L * reach), 4); } ctx.globalAlpha = 1;   // the white-out, thickest at the floor
      ctx.globalAlpha = a;
      for (let i = 0; i < 24; i++) {   // wind streaks, driving ahead
        const u = (hsh(seed, i) + t * 0.035 * (1 + hsh(i, seed))) % 1, xx = sx + dir * R(10 + u * L * reach), yy = sy - 4 - R(hsh(seed + 1, i) * (H0 - 6)) + R(Math.sin(t * 0.3 + i) * 2), l = 8 + R(hsh(i, 3) * 16);
        art.rect(ctx, i % 3 ? ICE.l : ICE.w, dir > 0 ? xx - l : xx, yy, l, 1);
      }
      for (let i = 0; i < 12; i++) {   // ice shards turning in it
        const u = (hsh(seed + 2, i) + t * 0.025) % 1, xx = sx + dir * R(14 + u * L * reach), yy = sy - 8 - R(hsh(i, seed + 2) * (H0 - 14)) + R(Math.sin(t * 0.2 + i * 2) * 4);
        shard(ctx, xx, yy, 2, i % 2 ? ICE.m : ICE.l, (t + i) % 6 < 3);
      }
      for (let i = 0; i < 16; i++) { const xx = sx + dir * R(10 + hsh(seed + 3, i) * L * reach), yy = sy - R(((hsh(i, seed + 3) * H0) + t * 1.4) % H0); art.rect(ctx, ICE.w, xx, yy, 2, 2); }   // snow
      for (let i = 0; i < L * reach; i += 3) { const xx = sx + dir * (8 + i), hh = 1 + R(hsh(seed, i) * 3 * Math.min(1, t / 20)); art.rect(ctx, ICE.l, xx, sy - hh, 3, hh); if (i % 12 === 0) art.rect(ctx, ICE.w, xx + 1, sy - hh - 2, 1, 2); }   // frost on the floor
      ctx.globalAlpha = 1;
    }, (s, g, zz) => {
      const t = s.t, bx = dir > 0 ? s.x + 8 : s.x - 8 - L, by = s.y - H0;
      if (t >= 6 && t <= 42 && t % 9 === 6) hit(bx, by, L, H0, Math.max(1, R(dmg * 0.32)), { its2: 'gale', hitSet: hs(), kx: dir * 1.2, ky: -0.8, stun: 26, srcX: s.x });
      foesIn(p, bx, by, L, H0).forEach(q => mark(q, 'its2Slow', 12));
      if (t === 46) {   // the storm closes: whoever is in it freezes solid
        sfx('explode'); fx.flash('#bfefff', 3); fx.shake(6, 10);
        foesIn(p, bx, by, L, H0).forEach(q => { const b = q.box(); for (let i = 0; i < 3; i++) N.column(zz, 'ice', b.x + b.w / 2 + (i - 1) * 14, floorY(zz, q.x, q.y - 20), i * 2, 0, { w: 12, h: 30 + (i === 1 ? 20 : 0), cols: [ICE.m, ICE.l, ICE.w] }); });
        const n = hit(bx, by, L, H0, R(dmg * 1.5), { its2: 'gale', hitSet: hs(), kx: dir * 0.5, ky: -1.4, stun: 50, heavy: true, status: { freeze: 54 }, srcX: s.x });
        if (n) foesIn(p, bx, by, L, H0).forEach(q => { if (q.state === 'hurt') mark(q, 'its2Ice', 40); });
      }
    });
    z.shots.push(v);
  }

  // ================= the ultimate: the plain version (the cinematic one is js/itsuki-v2-ult.js) =================
  function plainUlt(p, z, foes, dmg) {
    if (p.st === 6) { fx.flash('#9d4edd', 8); sfx('roar'); }
    if (p.st >= 12 && p.st <= 56) foes.forEach(e => { const b = e.box(); if (p.st % 3 === 0) emit('gravity', b.x + b.w / 2 + rand(-40, 40), b.y + rand(-30, 20), 2, {}); if (p.st % 8 === 0) hurt(e, dmg, { ky: -1, kx: 0, stun: 30 }); });
    if (p.st === 60) { fx.flash('#ffffff', 10); fx.shake(10, 18); sfx('explode'); foes.forEach(e => { const b = e.box(); emit('gravity', b.x + b.w / 2, b.y + b.h / 2, 24, { power: 2 }); hurt(e, dmg * 4, { ky: -6, down: true, stun: 50 }); }); }
  }
  S2.ultFn = plainUlt;

  // ================= registering him =================
  const ROWS = { u: castSteam, su: castTornado, i: castPhoenix, si: castSwamp, wo: castGale };
  S2.cast = ROWS;
  const STY = { c: ['#9d4edd', '#ffffff', '#1a0a2e'], shape: 'diamond', g: 0, spd: 2.2, life: 18, drag: 0.9, inward: true };
  const keepPortraits = N.portraits; N.portraits = () => {};   // no splash art of his own: Itsuki's, tinted, below (and no 404 for the missing files)
  try {
    clan(ID, {
      hero: { name: 'Itsuki · Awakened', alias: 'The Singularity', title: 'Champion of the Hollow Crown', energy: 'Chi', color: '#9d4edd', colorHi: '#f0d6ff', element: 'Combined elements', sig: 'Frost Gale', combo: 'fist', route: 'kael', pitch: 380, trait: 'singularity',
        blurb: 'Five paths became one.\nNothing comes back out.', sheet: BASE, sheetAw: BASE + '_aw', gridX: HR[BASE].gridX },
      style: { name: 'singularity', def: STY },
      moves: {
        u: { id: 'its2_steam', name: 'Scalding Steam', dmg: 13, desc: 'Fire and water: a boiling orb bursts into a cloud of steam that scalds, slows and blinds. No perfect block inside it. W + U throws it upward.', cast(p, z, dmg, up) { castSteam(p, z, dmg, up); } },
        su: { id: 'its2_tornado', name: 'Fire Tornado', dmg: 12, desc: 'Wind and fire: a burning twister travels ahead, drags in and lifts whoever it catches, then bursts into flame.', cast(p, z, dmg) { castTornado(p, z, dmg); } },
        i: { id: 'its2_phoenix', name: 'Thunder Phoenix', dmg: 22, desc: 'Thunder and fire: a burning, crackling phoenix rises and dives through the enemy. Lightning and a column of flame where it lands.', cast(p, z, dmg) { castPhoenix(p, z, dmg); } },
        si: { id: 'its2_swamp', name: 'Thornwood Swamp', dmg: 20, desc: 'Water and earth: the ground ahead turns to sucking swamp and three thorned trees burst up through it. The last one throws the enemy into the air.', cast(p, z, dmg) { castSwamp(p, z, dmg); } },
        sig: { id: 'its2_gale', name: 'Frost Gale', dmg: 13, desc: 'Wind and water: an ice storm blows ahead of him and freezes whoever stays in it solid.', cast(p, z, d) { castGale(p, z, d); } },
        ult: { id: 'its2_horizon', name: 'Event Horizon', dmg: 10, desc: 'a black hole opens over the enemy, pulls everything in, crushes it and explodes.', fn: plainUlt }
      },
      mode: ['its2_confluence', 'Confluence'], awaken: ['its2_awakening', 'Singularity'],
      trait: {
        tick(p, g, z) {
          if (!p.dead && SW.frame % 5 === 0) part(p.x + rand(-10, 10), p.y - rand(0, 12), SW.frame % 15 === 0 ? '#9d4edd' : '#1a0a2e', rand(-0.2, 0.2), -rand(0.4, 1.0), 26, 2, 0);   // a faint dark smoke rising off him
        },
        mark(ctx, p, x, y) {
          const s = S2.on ? SCALE : 1, hy = R(y - 46 * s), t = SW.frame;
          art.glow(ctx, x, R(y - 20 * s), R(30 * s), '#7a1fff', (p.modeT > 0 ? 0.13 : 0.06) + 0.02 * Math.sin(t * 0.07));   // the aura, faint
          // the singularity over his head: a black core, a violet ring, the five elements' light spiralling into it
          art.glow(ctx, x, hy, 10, '#9d4edd', 0.18);
          for (let i = 0; i < 5; i++) { const a = t * 0.09 + i * 1.2566, r = 7 - ((t * 0.08 + i * 0.2) % 1) * 3; art.rect(ctx, ['#ff6b35', '#7dffb2', '#ffe066', '#c8a05a', '#4cc9f0'][i], R(x + Math.cos(a) * r), R(hy + Math.sin(a) * r * 0.4), 1, 1); }
          art.disc(ctx, '#05000a', x, hy, 3); art.ring(ctx, '#9d4edd', x, hy, 4); art.rect(ctx, '#f0d6ff', x + (t % 40 < 20 ? 3 : -4), hy, 1, 1);
        }
      },
      fin(p, z, d) {   // the fourth J: a burst of one of the combined elements, in turn
        const k = (p.its2Fin = ((p.its2Fin || 0) + 1) % 5), x = p.x + p.face * 26, y = p.y - 22;
        const kinds = [['smoke', 'fire'], ['fire', 'wind'], ['bolt', 'fire'], ['thorns', 'water'], ['ice', 'wind']][k];
        emit(kinds[0], x, y, 10, { dir: p.face }); emit(kinds[1], x, y, 8, { dir: p.face }); fx.ring(x, y, ['#c8ccd8', '#ff7a1a', '#ffe866', '#7ab84a', '#bfefff'][k], 4, 30, 10);
        hit(p.face > 0 ? p.x + 8 : p.x - 60, p.y - 38, 52, 32, d, { kx: p.face * 2.2, ky: -2.4, stun: 30, srcX: p.x, status: k === 0 ? { burn: 2 } : k === 4 ? { freeze: 12 } : undefined });
      },
      lines: [['Five paths became one. Nothing comes back out.', '五つの道は一つになった。何も戻らない。', 'Cinco caminos se hicieron uno. Nada vuelve a salir.', '五道归一。有去无回。'],
        ['Fire and water. Wind and fire. Did you think I only knew them one at a time?', '火と水。風と火。一つずつしか知らないと思ったか。', 'Fuego y agua. Viento y fuego. ¿Creías que solo los conocía de uno en uno?', '火与水，风与火。你以为我只会一个一个地用？'],
        ['Even light falls in.', '光さえ落ちていく。', 'Hasta la luz cae dentro.', '连光都会坠落。']],
      borrow: BASE,
      tr: {
        'Itsuki · Awakened': ['Itsuki · Despertado', '一树·觉醒'], 'ITSUKI · AWAKENED': ['ITSUKI · DESPERTADO', '一树·觉醒'],
        'The Singularity': ['La Singularidad', '奇点'], 'Combined elements': ['Elementos combinados', '合元素'],
        'Five paths became one.': ['Cinco caminos se hicieron uno.', '五道归一。'], 'Nothing comes back out.': ['Nada vuelve a salir.', '有去无回。'],
        'Scalding Steam': ['Vapor Hirviente', '灼热蒸汽'], 'SCALDING STEAM': ['VAPOR HIRVIENTE', '灼热蒸汽'],
        'Fire and water: a boiling orb bursts into a cloud of steam that scalds, slows and blinds. No perfect block inside it. W + U throws it upward.': ['Fuego y agua: un orbe hirviente estalla en una nube de vapor que quema, ralentiza y ciega. Dentro no hay bloqueo perfecto. W + U lo lanza hacia arriba.', '火与水：一颗沸腾的水球炸成一团蒸汽，烫伤、减速并致盲敌人。身处其中无法完美格挡。W + U 向上抛出。'],
        'Fire Tornado': ['Tornado de Fuego', '炎龙卷'], 'FIRE TORNADO': ['TORNADO DE FUEGO', '炎龙卷'],
        'Wind and fire: a burning twister travels ahead, drags in and lifts whoever it catches, then bursts into flame.': ['Viento y fuego: un torbellino en llamas avanza, atrae y levanta a quien atrapa, y luego estalla en fuego.', '风与火：一道燃烧的龙卷风向前推进，把卷入的人拖进去抬上半空，最后炸成烈焰。'],
        'Thunder Phoenix': ['Fénix del Trueno', '雷火凤凰'], 'THUNDER PHOENIX': ['FÉNIX DEL TRUENO', '雷火凤凰'],
        'Thunder and fire: a burning, crackling phoenix rises and dives through the enemy. Lightning and a column of flame where it lands.': ['Trueno y fuego: un fénix ardiente y chisporroteante se eleva y se lanza en picado a través del enemigo. Rayos y una columna de llamas donde cae.', '雷与火：一只燃烧、噼啪作响的凤凰腾空而起，俯冲穿过敌人。落地处雷电交加，火柱冲天。'],
        'Thornwood Swamp': ['Pantano de Espinos', '荆木沼泽'], 'THORNWOOD SWAMP': ['PANTANO DE ESPINOS', '荆木沼泽'],
        'Water and earth: the ground ahead turns to sucking swamp and three thorned trees burst up through it. The last one throws the enemy into the air.': ['Agua y tierra: el suelo de delante se vuelve un pantano que traga y tres árboles espinosos brotan a través de él. El último lanza al enemigo por los aires.', '水与土：前方地面化为吞人的沼泽，三棵荆棘之树破土而出，最后一棵把敌人掀上半空。'],
        'Frost Gale': ['Vendaval de Escarcha', '霜冻风暴'], 'FROST GALE': ['VENDAVAL DE ESCARCHA', '霜冻风暴'],
        'Wind and water: an ice storm blows ahead of him and freezes whoever stays in it solid.': ['Viento y agua: una tormenta de hielo sopla delante de él y congela por completo a quien se quede dentro.', '风与水：一场冰暴在他面前呼啸而过，把留在其中的人冻成冰块。'],
        'Event Horizon': ['Horizonte de Sucesos', '事件视界'], 'EVENT HORIZON': ['HORIZONTE DE SUCESOS', '事件视界'],
        'Confluence': ['Confluencia', '五行交汇'], 'CONFLUENCE': ['CONFLUENCIA', '五行交汇'], 'Singularity': ['Singularidad', '奇点'], 'SINGULARITY': ['SINGULARIDAD', '奇点'],
        'ITSUKI · AWAKENED - LOCKED': ['ITSUKI · DESPERTADO - BLOQUEADO', '一树·觉醒·未解锁'], 'Opens with Itsuki: unlock every other hero first. Still locked: {0}': ['Se abre con Itsuki: desbloquea primero a todos los demás héroes. Aún bloqueados: {0}', '与一树一同解锁：先解锁其他所有英雄。仍未解锁：{0}'],
        'Opens with Itsuki: unlock every other hero first.': ['Se abre con Itsuki: desbloquea primero a todos los demás héroes.', '与一树一同解锁：先解锁其他所有英雄。'],
        'STEAM': ['VAPOR', '蒸汽'], 'FROZEN': ['CONGELADO', '冻结'], 'MIRED': ['ATASCADO', '深陷'], 'BLINDED': ['CEGADO', '致盲']
      },
      ultTr: ['un agujero negro se abre sobre el enemigo, lo atrae todo, lo aplasta y estalla.', '一个黑洞在敌人上方张开，吞噬一切，将其碾碎，然后爆炸。']
    });
  } finally { N.portraits = keepPortraits; }
  const h2 = HR[ID];
  if (!h2) return;
  h2.sheet = BASE; h2.sheetAw = BASE + '_aw';
  if (SW.moves && SW.moves.CD_FOR) SW.moves.CD_FOR.its2_steam = 75;   // a cloud lingers for 100 frames: no need to pile them up

  // his splash art: Itsuki's, steeped in the violet of the singularity (no new art; the picture is not redrawn)
  function tinted(src, key) {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d');
      x.imageSmoothingEnabled = false; x.drawImage(im, 0, 0);
      x.globalCompositeOperation = 'source-atop'; x.globalAlpha = 0.3; x.fillStyle = '#3a0a6a'; x.fillRect(0, 0, c.width, c.height);
      x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.18; x.fillStyle = '#9d4edd'; x.fillRect(0, 0, c.width, c.height);
      art.bg[key] = c;
    };
    im.onerror = () => {}; im.src = src;
  }
  tinted('assets/bg/hero_itsuki.png', 'hero_' + ID); tinted('assets/bg/ult_itsuki.png', 'ult_' + ID);

  // ================= the lock: the same as Itsuki's =================
  const _lk = SW.lockedVs;
  if (_lk) SW.lockedVs = id => (id === ID ? _lk(BASE) : _lk(id));
  if (V && V.draw) {
    const _vd = V.draw; V.draw = function (ctx, g) {
      _vd.apply(this, arguments);
      if (V.phase !== 'pick' || !V.pick || D.heroOrder[V.pick[V.step]] !== ID || !SW.lockedVs || !SW.lockedVs(ID)) return;
      const base = SW.lockedVs.base || _lk, n = base ? D.heroOrder.filter(h => h !== BASE && h !== ID && base(h)).length : 0, text = SW.text, ui = SW.ui, Wd = SW.W;
      ui.panel(ctx, 6, 230, Wd - 12, 34, '#c77dff', 0.97);
      text(ctx, 'ITSUKI · AWAKENED - LOCKED', 12, 234, '#c77dff');
      text(ctx, n > 0 ? 'Opens with Itsuki: unlock every other hero first. Still locked: {0}'.replace('{0}', n) : 'Opens with Itsuki: unlock every other hero first.', 12, 244, '#ffffff');
      text(ctx, 'A D W S: choose another', 12, 254, '#8a92b8');
    };
  }

  // ================= what his skills do to the one they catch =================
  // its2Slow: moves at half speed   its2Mire: jumps are short   its2Blind: no perfect block   its2Ice: drawn in ice
  const TIMERS = ['its2Slow', 'its2Mire', 'its2Blind', 'its2Ice'];
  const _sp = P.speed; P.speed = function () { const s = _sp.apply(this, arguments); return this.its2Slow > 0 && G.scene === 'vs' ? s * (this.its2Mire > 0 ? 0.45 : 0.6) : s; };
  const _up = P.update; P.update = function (g, z) {
    for (const k of TIMERS) if (this[k] > 0) this[k]--;
    if (this.its2Mire > 0 && this.vy < -4.2 && G.scene === 'vs') this.vy = -4.2;   // the swamp holds the feet: a short hop at most
    return _up.apply(this, arguments);
  };
  const _th = P.takeHit; P.takeHit = function (atk, g) {
    if (this.its2Blind > 0 && this.state === 'guard' && (this.guardT || 0) <= 6 && (g || G).scene === 'vs') this.guardT = 7;   // blinded by the steam: a guard, but never a perfect one
    return _th.apply(this, arguments);
  };

  // ================= drawn 1.2x larger, and the marks his skills leave on others =================
  let BIG = 0;
  const _ad = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    if (BIG > 1.001) {
      const px = R(x), py = R(y);
      ctx.save(); ctx.translate(px, py); ctx.scale(BIG, BIG); ctx.translate(-px, -py);
      try { return _ad.apply(this, arguments); } finally { ctx.restore(); }
    }
    return _ad.apply(this, arguments);
  };
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const gg = g || this.G, keep = BIG;
    BIG = S2.on && isMe(gg) ? SCALE : 0;
    let r;
    try { r = _pd.apply(this, arguments); } finally { BIG = keep; }
    if (!this.dead && (this.its2Ice > 0 || this.its2Blind > 0 || this.its2Mire > 0)) {
      const x = R(this.x - cam.x), y = R(this.y - cam.y), t = SW.frame;
      if (this.its2Mire > 0) {   // mud up to the shins
        art.rect(ctx, MUD.k, x - 8, y - 6, 16, 6); art.rect(ctx, MUD.d, x - 7, y - 7, 14, 6); art.rect(ctx, MUD.m, x - 7, y - 7, 14, 2); if (t % 20 < 4) art.ring(ctx, MUD.b, x + (t % 40 < 20 ? 4 : -4), y - 9, 2);
      }
      if (this.its2Blind > 0) {   // steam round the eyes
        ctx.globalAlpha = 0.75; for (let i = 0; i < 4; i++) puff(ctx, x + R(Math.sin(t * 0.1 + i * 1.6) * 7), y - 28 - (i % 2) * 3, 4); ctx.globalAlpha = 1;
      }
      if (this.its2Ice > 0) {   // frozen in a block of ice
        const k = Math.min(1, this.its2Ice / 8), hh = 40, ww = 22;
        ctx.globalAlpha = 0.5 * k; art.rect(ctx, ICE.m, x - ww / 2, y - hh, ww, hh); ctx.globalAlpha = 0.35 * k; art.rect(ctx, ICE.l, x - ww / 2 + 2, y - hh + 2, 6, hh - 4); ctx.globalAlpha = k;
        art.rect(ctx, ICE.d, x - ww / 2 - 1, y - hh, 1, hh); art.rect(ctx, ICE.d, x + ww / 2, y - hh, 1, hh); art.rect(ctx, ICE.w, x - ww / 2, y - hh - 1, ww, 1); art.rect(ctx, ICE.d, x - ww / 2, y - 1, ww, 1);
        art.line(ctx, ICE.w, x - ww / 2, y - hh, x - 2, y - hh - 6, 1); art.line(ctx, ICE.w, x - 2, y - hh - 6, x + ww / 2, y - hh, 1);   // a pointed crown
        art.line(ctx, ICE.w, x - 6, y - 30, x + 2, y - 18, 1); art.rect(ctx, ICE.w, x + 6, y - 34, 1, 6);
        ctx.globalAlpha = 1;
      }
    }
    return r;
  };
})();
