'use strict';
// Shattered Worlds — Opal's Glass Sea (the user, 2026-11-20: "Opal's glass sea"). Her story: from "a world of crystal
// and light, where every garden grows gems"; "everything she touched turned to crystal: half a mile of sand in one
// frightened night"; "pink, mint and blue crystals growing round her feet"; and her card: "Everything she touches
// turns to crystal. Everything crystal breaks." So her crystals are real ones: six-sided spires with a lit face, a
// dark face and a point, in pink, mint and blue; they grow in clusters, bloom, cage, and burst into shards. Sharp,
// not sweet. Crisp pixel art through js/pixel-kit.js; pieces drawn many times are drawn once and reused.
// Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/mira-mirror.js.
//   J      crystal spikes burst out of each hit; the finisher grows a cluster that breaks
//   U      Crystal Shard: a faceted shard; the crystal it leaves is a cluster of three spires
//   S+U    Geode Wall: a split geode, rock outside and crystal inside, with tall spires through it
//   I      Crystal Bloom: spires that open like flowers, smaller crystals splaying out round each
//   S+I    Prism Prison: a great faceted crystal closes on them, cracks, and bursts
//   W+O    Shatter Song: the note goes out as a ring; every crystal it reaches bursts into shards
//   S+O    Gem Heart: small gems at her feet      O  Diamond Skin: a sheen runs across her (both small)
//   W+I    Diamond Dust: in the cinematic finish (js/ult-cinema.js) glass runs along the floor and spires come up
//          toward the target from both sides, a great diamond forms over them, and it drops through them on an
//          impact frame as everything breaks
// SW.opalGlass.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !CASTS || !CASTS.crystal_shard || !CASTS.geode_wall || !CASTS.crystal_bloom) return;
  const OG = SW.opalGlass = { on: true };
  const isO = g => !!(OG.on && g && g.state && g.state.hero === 'opal');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

  // outline violet, slate violet, deep pink, pink, pale pink, teal, mint, pale mint, deep blue, blue, pale blue, cream, white
  const PAL = ['#2a1838', '#5a4a7a', '#b04a8a', '#ff99c8', '#ffd0e4', '#3a9aa8', '#8fdcc8', '#d0f4de', '#4a7ac0', '#a9def9', '#dcf2ff', '#fcf6bd', '#ffffff'];
  const C = { k: PAL[0], vi: PAL[1], pd: PAL[2], pk: PAL[3], pl: PAL[4], tl: PAL[5], mm: PAL[6], mt: PAL[7], bd: PAL[8], bl: PAL[9], bh: PAL[10], cr: PAL[11], w: PAL[12] };
  const RAMP = [[C.pd, C.pk, C.pl], [C.tl, C.mm, C.mt], [C.bd, C.bl, C.bh]];   // dark face, body, lit face: pink, mint, blue
  const OUT = '#2a1838';
  const kept = new Map();
  function stamp(ctx, key, x, y, w, h, draw, a, ax, ay) {
    let cv = kept.get(key);
    if (!cv) {
      w = 2 * Math.ceil(w / 2); h = 2 * Math.ceil(h / 2);
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      PX.sprite(cv.getContext('2d'), w / 2, h / 2, w, h, draw, { pal: PAL, outline: OUT });
      if (kept.size > 500) kept.clear();
      kept.set(key, cv);
    }
    ctx.save(); ctx.imageSmoothingEnabled = false; if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    ctx.drawImage(cv, Math.round(x - (ax || 0)) - cv.width / 2, Math.round(y - (ay || 0)) - cv.height / 2);
    ctx.restore();
  }

  // ================= a crystal spire: its foot at (x0, 0), h tall, w wide, leaning by lean =================
  function spire(c, x0, h, w, tone, lean) {
    const r = RAMP[((tone % 3) + 3) % 3], a = w / 2, s = 0.7, X = (dx, u) => [x0 + dx + lean * h * u, -h * u];
    poly(c, [X(-a, 0), X(-a, s), X(0, 1), X(a, s), X(a, 0)], r[1]);
    poly(c, [X(-a, 0), X(-a, s), X(0, 1), X(-a * 0.25, s), X(-a * 0.25, 0)], r[2]);   // the lit face
    poly(c, [X(a * 0.3, 0), X(a * 0.3, s), X(0, 1), X(a, s), X(a, 0)], r[0]);   // the dark face
    poly(c, [X(-a * 0.25, s), X(0, 1), X(a * 0.3, s), X(0, s - 0.07)], r[2]);   // the facet under the point
    poly(c, [X(-a * 0.72, 0.08), X(-a * 0.72, s - 0.08), X(-a * 0.5, s - 0.03), X(-a * 0.5, 0.08)], C.w);   // a streak of light down it
  }
  // a cluster of three spires and two small ones, H tall; v = which arrangement
  function clusterVec(c, H, v) {
    const t0 = v % 3;
    spire(c, -H * 0.2, H * 0.62, H * 0.24, t0 + 2, -0.24); spire(c, H * 0.2, H * 0.5, H * 0.2, t0 + 1, 0.3);
    spire(c, (v % 2 ? 1 : -1) * H * 0.02, H, H * 0.3, t0, v % 2 ? -0.04 : 0.05);
    spire(c, -H * 0.36, H * 0.26, H * 0.13, t0 + 1, -0.5); spire(c, H * 0.38, H * 0.22, H * 0.12, t0 + 2, 0.55);
  }
  function cluster(ctx, x, y, H, v, grow, a) { const gq = Math.max(1, Math.round(clamp01(grow) * 5)); stamp(ctx, 'cl|' + H + '|' + (v % 6) + '|' + gq, x, y, H * 1.5 + 10, H * 1.2 + 10, c => { c.translate(0, H * 0.55); c.scale(1, gq / 5); clusterVec(c, H, v % 6); }, a, 0, H * 0.55); }
  // a shard of crystal flying: its point toward +x
  function shardVec(c, L, tone) {
    const r = RAMP[tone % 3];
    poly(c, [[-L * 0.5, -L * 0.14], [L * 0.1, -L * 0.2], [L * 0.5, 0], [L * 0.1, L * 0.2], [-L * 0.5, L * 0.14]], r[1]);
    poly(c, [[-L * 0.5, -L * 0.14], [L * 0.1, -L * 0.2], [L * 0.5, 0], [-L * 0.5, 0]], r[2]); poly(c, [[-L * 0.5, 0.5], [L * 0.5, 0], [L * 0.1, L * 0.2], [-L * 0.5, L * 0.14]], r[0]);
    poly(c, [[-L * 0.35, -L * 0.1], [L * 0.1, -L * 0.13], [L * 0.05, -L * 0.07], [-L * 0.35, -L * 0.05]], C.w);
  }
  function shard(ctx, x, y, L, ang, tone, a) { const rq = ((Math.round(ang / (PI / 8)) % 16) + 16) % 16; stamp(ctx, 'sh|' + L + '|' + rq + '|' + (tone % 3), x, y, L + 8, L + 8, c => { c.rotate(rq * PI / 8); shardVec(c, L, tone); }, a); }
  // crystal bursting: shards fly out from (x, y) in the world; timed by the game's frames
  function burst(x, y, n, L, pw) {
    const sh = [], f0 = SW.frame || 0; let draws = 0;
    for (let i = 0; i < n; i++) { const a = i / n * PI * 2 + rand(-0.25, 0.25), v = rand(pw * 0.45, pw); sh.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.8 - 1.4, r: rand(0, 6.28), w: rand(-0.5, 0.5), L: i % 3 ? L : L + 4, tone: i % 3 }); }
    PX.over((ctx, cam) => {
      const t = Math.max((SW.frame || 0) - f0, 0); if (t > 22 || ++draws > 60) return false;
      sh.forEach(q => shard(ctx, x + q.vx * t - cam.x, y + q.vy * t + 0.14 * t * t - cam.y, q.L, q.r + q.w * t, q.tone, t > 14 ? (22 - t) / 8 : 1));
    });
    for (let i = 0; i < 8; i++) part(x + rand(-8, 8), y + rand(-8, 8), ['#ff99c8', '#d0f4de', '#a9def9', '#ffffff'][i % 4], rand(-pw, pw), rand(-pw, 0.5), 18, 2, 0.12);
  }
  function cracks(ctx, x, y, k, seed, R, n) {
    if (k <= 0) return;
    for (let i = 0; i < (n || 6); i++) { let an = i / (n || 6) * PI * 2 + rnd(seed, i) * 0.7, px = x, py = y; const len = R * (0.6 + 0.4 * rnd(seed, i + 9)) * k;
      for (let j = 0; j < 3; j++) { an += (rnd(seed, i * 5 + j) - 0.5) * 0.9; const nx = px + Math.cos(an) * len / 3, ny = py + Math.sin(an) * len / 3; art.line(ctx, '#ffffff', Math.round(px), Math.round(py), Math.round(nx), Math.round(ny), 1); px = nx; py = ny; } }
  }
  const glint = (ctx, x, y, r, col) => { art.rect(ctx, col || '#ffffff', x - r, y, r * 2 + 1, 1); art.rect(ctx, col || '#ffffff', x, y - r, 1, r * 2 + 1); };
  // a spire that opens like a flower: the main spire, and four smaller ones that splay out round its foot
  function bloomVec(c, H, w, tone, open) {
    spire(c, -w * 0.5, H * 0.42, w * 0.5, tone + 1, -(0.45 + 0.75 * open)); spire(c, w * 0.5, H * 0.42, w * 0.5, tone + 2, 0.45 + 0.75 * open);
    spire(c, -w * 0.25, H * 0.6, w * 0.6, tone + 2, -(0.16 + 0.42 * open)); spire(c, w * 0.25, H * 0.6, w * 0.6, tone + 1, 0.16 + 0.42 * open);
    spire(c, 0, H, w, tone, 0.02);
    if (open > 0.5) ell(c, 0, -H * 0.16, w * 0.3, w * 0.22, C.cr);   // a light at its heart
  }
  // a geode split open: rock outside, crystal inside, tall spires through the middle
  function geodeVec(c, H) {
    for (const d of [-1, 1]) {
      poly(c, [[d * 5, 0], [d * 20, 0], [d * 22, -H * 0.3], [d * 19, -H * 0.62], [d * 11, -H * 0.86], [d * 5, -H * 0.74]], C.vi);   // the rock shell
      poly(c, [[d * 16, 0], [d * 20, 0], [d * 22, -H * 0.3], [d * 19, -H * 0.62], [d * 16, -H * 0.5]], C.k);
      for (let i = 0; i < 5; i++) { const y = -H * (0.1 + i * 0.15); poly(c, [[d * 12, y + 3], [d * (3 - i % 2), y - 2], [d * 12, y - 5]], RAMP[(i + (d > 0 ? 1 : 0)) % 3][i % 2 ? 2 : 1]); }   // crystals lining the inside
    }
    spire(c, -5, H * 0.8, 8, 1, -0.06); spire(c, 6, H * 0.7, 7, 2, 0.08); spire(c, 0, H, 10, 0, 0.0);
  }
  // the prison: one great crystal, w wide and h tall, its foot at (0, 0)
  function prisonVec(c, w, h) {
    const a = w / 2, s = 0.74, X = (dx, u) => [dx, -h * u];
    poly(c, [X(-a, 0.06), X(-a, s), X(0, 1), X(a, s), X(a, 0.06), X(a * 0.5, 0), X(-a * 0.5, 0)], C.bl);
    poly(c, [X(-a, 0.06), X(-a, s), X(0, 1), X(-a * 0.3, s), X(-a * 0.3, 0.02), X(-a * 0.5, 0)], C.bh);
    poly(c, [X(a * 0.36, 0.02), X(a * 0.36, s), X(0, 1), X(a, s), X(a, 0.06), X(a * 0.5, 0)], C.pk);
    poly(c, [X(-a * 0.3, s), X(0, 1), X(a * 0.36, s), X(0, s - 0.06)], C.mt);
    poly(c, [X(-a * 0.8, 0.12), X(-a * 0.8, s - 0.08), X(-a * 0.6, s - 0.03), X(-a * 0.6, 0.12)], C.w);
  }
  // a cut diamond, point down, w wide: (0, 0) the middle of its girdle
  function gemVec(c, w) {
    const a = w / 2, tb = a * 0.55, ch = w * 0.24, ph = w * 0.62;
    poly(c, [[-tb, -ch], [tb, -ch], [a, 0], [0, ph], [-a, 0]], C.bl);
    poly(c, [[-tb, -ch], [tb, -ch], [tb * 0.5, 0], [-tb * 0.5, 0]], C.bh);   // the table
    poly(c, [[-tb, -ch], [-a, 0], [-tb * 0.5, 0]], C.w); poly(c, [[tb, -ch], [a, 0], [tb * 0.5, 0]], C.pk);
    poly(c, [[-a, 0], [-tb * 0.5, 0], [0, ph]], C.bh); poly(c, [[-tb * 0.5, 0], [tb * 0.5, 0], [0, ph]], C.mt); poly(c, [[tb * 0.5, 0], [a, 0], [0, ph]], C.pd);
    poly(c, [[-tb * 0.5, 0], [0, ph * 0.5], [tb * 0.5, 0], [0, ph * 0.12]], C.w);
  }
  Object.assign(OG, { cluster, shard, burst, PAL });

  // it is already 70% up on the frame it hits (hit-stop holds that frame), full two frames later, and sinks at the end
  function rise(t, delay, total) {
    const k = t - delay, g = t < delay * 0.4 ? 0 : k < 0 ? 0.7 * ease((t - delay * 0.4) / Math.max(0.01, delay * 0.6)) : Math.min(1, 0.7 + 0.15 * (k + 1)), out = total - delay, fade = k > out - 8 ? Math.max(0, (out - k) / 8) : 1;
    return { k, g: g * (0.25 + 0.75 * fade), a: Math.min(1, fade * 2.5) };
  }

  // ================= S+U: Geode Wall =================
  const _gw = CASTS.geode_wall;
  CASTS.geode_wall = function (p, z) {
    const n0 = z.shots.length, r = _gw.apply(this, arguments);
    if (!isO(G)) return r;
    const v = z.shots.slice(n0).find(s => s.life === 120 && s.render);
    if (v) { v.og = 1; v.render = (ctx, sx, sy, t) => { const q = Math.max(1, Math.round(Math.min(1, (t + 3) / 5) * 4)); stamp(ctx, 'geode|' + q, sx, sy, 60, 76, c => { c.translate(0, 34); c.scale(1, q / 4); geodeVec(c, 58); }, Math.min(1, (120 - t) / 15), 0, 34); if (t % 30 < 6) glint(ctx, sx + (t % 60 < 30 ? -6 : 7), sy - 30 - (t % 90) / 6, 2); }; }
    return r;
  };

  // ================= I: Crystal Bloom =================
  const _cb = CASTS.crystal_bloom;
  CASTS.crystal_bloom = function (p, z) {
    const n0 = z.shots.length, r = _cb.apply(this, arguments);
    if (!isO(G)) return r;
    z.shots.slice(n0).filter(s => s.render && s.life >= 36 && s.life <= 48).forEach((s, i) => {
      const delay = s.life - 30, H = i === 2 ? 66 : 56;
      s.og = 1; s.render = (ctx, sx, sy, t) => {
        const q = rise(t, delay, delay + 30); if (q.g <= 0 || q.a <= 0) { if (t < delay) glint(ctx, sx, sy - 2, 2 + (t % 3), '#ff99c8'); return; }
        PX.sprite(ctx, sx, sy - H / 2, 96, H + 26, c => { c.translate(0, H / 2); c.scale(1, Math.max(0.05, q.g)); bloomVec(c, H, 15, i, ease((q.k - 1) / 7)); }, { pal: PAL, outline: OUT, alpha: q.a });
      };
    });
    return r;
  };

  // ================= S+I: Prism Prison =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.opal;
  if (BU && BU.cast) {
    const _pp = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _pp.apply(this, arguments);
      if (!isO(G)) return r;
      const v = z.shots.slice(n0).find(s => s.life === 60 && s.render);
      if (v) {
        v.og = 1; let done = false;
        v.render = (ctx, x, y, t) => {
          if (t >= 58) { if (!done) { done = true; burst(v.x, v.y - 22, 14, 13, 4.6); } return; }
          const q = Math.max(1, Math.round(Math.min(1, (t + 2) / 5) * 4));
          stamp(ctx, 'prison|' + q, x, y, 44, 64, c => { c.translate(0, 28); c.scale(q / 4, q / 4); prisonVec(c, 34, 54); }, 0.62, 0, 28);   // they show dimly through it
          if (t > 40) cracks(ctx, x, y - 24, (t - 40) / 18, Math.round(v.x), 22, 6);
          if (t % 16 < 4) glint(ctx, x - 9, y - 40 + (t % 32), 2);
        };
      }
      return r;
    };
  }

  // ================= W+O: Shatter Song: the note goes out as a ring =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.opal;
  if (SIG && SIG.cast) {
    const _ss = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _ss.apply(this, arguments);
      if (!isO(G)) return r;
      z.shots.push(new Vis(p.x, p.y - 26, 22, (ctx, sx, sy, t) => {
        const a = 1 - t / 22;
        ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fcf6bd'; ctx.lineWidth = 2; for (let i = 0; i < 2; i++) { const R = 8 + (t - i * 5) * 9; if (R > 4) { ctx.beginPath(); ctx.ellipse(sx, sy, R, R * 0.5, 0, 0, PI * 2); ctx.stroke(); } } ctx.restore();
        for (let i = 0; i < 6; i++) { const an = i * PI / 3 + t * 0.1, R = 10 + t * 8; glint(ctx, Math.round(sx + Math.cos(an) * R), Math.round(sy + Math.sin(an) * R * 0.5), 2, i % 2 ? '#ff99c8' : '#ffffff'); }
      }));
      return r;
    };
  }

  // ================= J finisher: a cluster grows and breaks =================
  const FINS = SW.clanmelee && SW.clanmelee.FIN;
  if (FINS && FINS.opal) {
    const _of = FINS.opal;
    FINS.opal = function (p, z) {
      const r = _of.apply(this, arguments);
      if (isO(G)) { const x = p.x + p.face * 30, y = p.y, seed = Math.round(x); let done = false; z.shots.push(new Vis(x, y, 14, (ctx, sx, sy, t) => { if (t >= 9) { if (!done) { done = true; burst(x, y - 16, 10, 11, 4); } return; } cluster(ctx, sx, sy, 34, seed, (t + 3) / 5, 1); })); }
      return r;
    };
  }

  // ================= J: spikes burst out of each hit; the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 7) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.6 : 22, hx = sx + d * (reach + 2), hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), L = (big ? 20 : 14) * (k < 2 ? 0.7 + k * 0.15 : 1), al = k > 4 ? (7 - k) / 3 : 1;
        for (let i = 0; i < 3; i++) { const an = (d > 0 ? 0 : PI) + (i - 1) * 0.6 * d; shard(ctx, hx + Math.cos(an) * L * 0.5, hy + Math.sin(an) * L * 0.5, Math.round(L), an, i + (a.hitAt % 3), al); }
        if (k < 3) glint(ctx, hx, hy, 4 - k);
        if (k === 0) for (let i = 0; i < (big ? 4 : 2); i++) part(p.x + d * reach + rand(-4, 4), p.y - 22 + rand(-6, 6), ['#ff99c8', '#d0f4de', '#a9def9'][i % 3], d * rand(0.5, 2.5), rand(-2, 0.5), 16, 2, 0.12);
      }
    }
    if (!front && (p.modeT > 0 || p.awakeT > 0)) {   // Gem Heart / Diamond Skin: small gems at her feet (small)
      const fade = Math.min(1, Math.max(p.modeT || 0, p.awakeT || 0) / 30), H = p.awakeT > 0 ? 11 : 8;
      stamp(ctx, 'feet|' + H, sx, sy, 40, 18, c => { c.translate(0, 7); spire(c, -11, H, 4, 0, -0.2); spire(c, 10, H * 0.8, 3.6, 2, 0.25); spire(c, -4, H * 0.6, 3, 1, 0.1); spire(c, 15, H * 0.5, 3, 1, 0.4); }, fade, 0, 7);
    }
    if (front && p.awakeT > 0) { const u = (p.t % 44) / 44; if (u < 0.3) { const y = sy - 40 + u / 0.3 * 36; art.line(ctx, '#ffffff', sx - 7, Math.round(y + 5), sx + 7, Math.round(y - 5), 1); glint(ctx, sx + 3, Math.round(y - 2), 2); } }   // Diamond Skin: a sheen runs across her (small)
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isO(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };

  // ================= her other shots: the flying shard, and the crystals she grows =================
  const grown = [];
  function dress(z) {
    z.shots.forEach(s => {
      if (s.og !== undefined) return;
      s.og = 0;
      if (s instanceof Proj && s.w === 10 && s.h === 8 && s.g === 0.05 && s.render) { s.og = 1; s.render = (ctx, x, y, q) => shard(ctx, x, y, 17, Math.atan2(q.vy, q.vx), 0); }
      else if (s.isCrystal && s.render) { s.og = 1; const seed = Math.round(s.x); grown.push(s); s.render = (ctx, sx, sy, t) => { cluster(ctx, sx, sy, 30, seed, (t + 2) / 7, Math.min(1, (600 - t) / 30)); if ((t + seed) % 50 < 5) glint(ctx, sx - 2, sy - 22, 2); }; }
    });
    for (let i = grown.length - 1; i >= 0; i--) { const c = grown[i]; if (!c.gone) continue; grown.splice(i, 1); if (c.t < 595) burst(c.x, c.y - 14, 10, 12, 4.2); }   // one of them broke (the trait, the song, or a fifth crystal)
  }
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isO(g || this.G) || !z || !z.shots) return r;
    dress(z); if (G.zone && G.zone !== z && G.zone.shots) dress(G.zone);
    if (!this.dead && this.awakeT > a0 + 60) for (let i = 0; i < 12; i++) part(this.x + rand(-8, 8), this.y - 24 + rand(-10, 10), ['#ff99c8', '#d0f4de', '#a9def9', '#ffffff'][i % 4], rand(-2.6, 2.6), rand(-2.6, 0.5), 18, 2, 0.12);   // Diamond Skin begins (small and short)
    return r;
  };

  // ================= W+I: Diamond Dust, the finish =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isO(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    if (T && SW.ultCinema && SW.ultCinema.on && SW.ultCinema.heroes.indexOf('opal') >= 0) finale(p, z, T);
    return r;
  };
  // the cinematic finish (js/ult-cinema.js: the camera pushes in on the target from st 72, the blow at st 100)
  function finale(p, z, T) {
    const FIN = SW.ultCinema.FIN || 100, GW = 34; let broke = false;
    const v = new Vis(T.x, T.y, 400, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < 74 || st > FIN + 18) return;
      const cy = sy - 20, after = st >= FIN, k2 = (st - FIN) / 18, ik = (st - FIN) / 5;
      if (after) PX.impact(ctx, sx, cy, ik, 43);
      // the Glass Sea: glass runs along the floor and spires come up toward them from both sides
      const run = ease((st - 74) / 16), fa = after ? 1 - ease(k2 * 2) : 1;
      if (fa > 0) {
        ctx.save(); ctx.globalAlpha = 0.85 * fa; art.rect(ctx, '#a9def9', Math.round(sx - 110 * run), sy - 1, Math.round(220 * run), 3); art.rect(ctx, '#ffffff', Math.round(sx - 110 * run), sy - 1, Math.round(220 * run), 1); ctx.restore();
        for (let j = 5; j >= 0; j--) for (const d of [-1, 1]) { const g = ease((st - 76 - (5 - j) * 3) / 6); if (g > 0) cluster(ctx, sx + d * (20 + j * 17), sy, 22 + (5 - j) * 5, j + (d > 0 ? 3 : 0), g, fa); }
      }
      // the diamond forms over them, hangs, and drops
      if (!after) { const k = ease((st - 82) / 8), drop = ease((st - (FIN - 5)) / 5), bob = Math.round(Math.sin(st * 0.4) * 2);
        if (k > 0) { stamp(ctx, 'gem|' + GW, sx, cy - 36 + bob - 8 * (1 - k) + 12 * drop * drop, GW + 8, GW + 14, c => { c.translate(0, -6); gemVec(c, GW); }, k); if (st % 10 < 4) glint(ctx, sx - 8, cy - 46 + bob, 4); }
      } else {
        if (!broke) { broke = true; burst(v.x, v.y - 24, 22, 15, 6.8); }
        stamp(ctx, 'gem|' + GW, sx, cy - 20 + Math.min(1, ik) * 6, GW + 8, GW + 14, c => { c.translate(0, -6); gemVec(c, GW); }, 1 - ease(k2 * 2.2));
        cracks(ctx, sx, cy - 6, Math.min(1, ik), 5, 30 + k2 * 40, 8);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
