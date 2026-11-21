'use strict';
// Shattered Worlds — Mira's mirror (the user, 2026-11-20: "Mira's ice mirror"). Her story: "Mira is the reflection":
// the girl under the Frozen Harbour's ice who stepped out when the tear cracked it; "a smooth silver mirror mask ...
// with one cyan glint ... and a long mirror shard in which her reflection faces the other way"; "what you hit was
// only her reflection"; "for her, glass was only ever a door". So everything she throws is mirror glass: bevelled
// shards that flash as they turn, standing mirrors with her reflection inside, cracks that spread before a thing
// breaks. Silver and slate with one cyan glint. Crisp pixel art through js/pixel-kit.js; small pieces are drawn once
// and reused. Draw-only: every hit, hitbox and timing stays as it was. Loaded after js/sora-kite.js.
//   J      mirror cuts with a cyan glint where they land
//   U      Glass Fan: bevelled shards that spin and flash
//   S+U    Reflection (and the one a perfect guard leaves): she stands in a pane of glass facing the other way;
//          it cracks, then bursts into shards
//   I      Prism: the beam goes through a prism of glass and splits, a cyan fringe on each ray
//   S+I    Hall of Mirrors: four framed mirrors with her reflection in each; they fire, then break together
//   W+O    Kaleidoscope: six big shards turning round her, then thrown
//   S+O    Silvering: a sheet of mirror ice under her feet     O  Glass Form: the glint on her mask flares (both small)
//   W+I    Seven Years' Luck: in the finish (js/ult-grand.js) a great mirror rises behind the target with her
//          reflection in it, cracks spread across it, and it bursts through them on an impact frame
// SW.miraMirror.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !art.draw || !CASTS || !CASTS.shard_fan || !SW.data || !SW.data.heroes.mira) return;
  const MM = SW.miraMirror = { on: true };
  const isM = g => !!(MM.on && g && g.state && g.state.hero === 'mira');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const ell = (c, x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, Math.max(0.001, rx), Math.max(0.001, ry), 0, 0, PI * 2); c.fillStyle = col; c.fill(); };
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const fwd = d => (d > 0 ? 0 : PI);

  // outline, dark slate, slate, grey-blue, silver, pale silver, white, cyan, deep cyan
  const PAL = ['#101622', '#2a3048', '#5a6078', '#8a92b8', '#c8d4f0', '#e8f0ff', '#ffffff', '#22d3ee', '#0e7490'];
  const C = { k: PAL[0], sd: PAL[1], sl: PAL[2], gb: PAL[3], sv: PAL[4], hi: PAL[5], w: PAL[6], cy: PAL[7], cd: PAL[8] };
  const OUT = '#2a3048';
  // pieces that are drawn many times a frame are drawn once through the pixel kit, kept, and stamped
  const kept = new Map();
  function stamp(ctx, key, x, y, w, h, draw, a) {
    let cv = kept.get(key);
    if (!cv) {
      w = 2 * Math.ceil(w / 2); h = 2 * Math.ceil(h / 2);
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      PX.sprite(cv.getContext('2d'), w / 2, h / 2, w, h, draw, { pal: PAL, outline: OUT });
      if (kept.size > 400) kept.clear();
      kept.set(key, cv);
    }
    ctx.save(); ctx.imageSmoothingEnabled = false; if (a !== undefined) ctx.globalAlpha *= clamp01(a);
    ctx.drawImage(cv, Math.round(x) - cv.width / 2, Math.round(y) - cv.height / 2);
    ctx.restore();
  }

  // ================= a shard of mirror: its point toward +x, L long; g = the glint is on it =================
  function shardVec(c, L, g) {
    poly(c, [[-L * 0.5, -L * 0.1], [-L * 0.1, -L * 0.24], [L * 0.5, 0], [-L * 0.05, L * 0.2], [-L * 0.45, L * 0.13]], C.sv);
    poly(c, [[-L * 0.5, -L * 0.1], [-L * 0.1, -L * 0.24], [L * 0.5, 0], [-L * 0.12, -L * 0.03]], C.hi);   // the lit bevel
    poly(c, [[-L * 0.45, L * 0.13], [-L * 0.05, L * 0.2], [L * 0.5, 0], [-L * 0.12, L * 0.05]], C.gb);   // the dark bevel
    poly(c, [[-L * 0.5, -L * 0.1], [-L * 0.12, -L * 0.03], [-L * 0.12, L * 0.05], [-L * 0.45, L * 0.13]], C.sl);   // the broken end
    poly(c, [[-L * 0.22, -L * 0.15], [L * 0.14, -L * 0.1], [L * 0.1, -L * 0.065], [-L * 0.22, -L * 0.11]], C.w);
    if (g) { poly(c, [[-L * 0.2, 0], [-L * 0.06, -L * 0.03], [L * 0.2, 0], [-L * 0.06, L * 0.03]], C.cy); poly(c, [[-L * 0.08, -L * 0.14], [-L * 0.05, 0], [-L * 0.08, L * 0.14], [-L * 0.11, 0]], C.w); }
  }
  function shard(ctx, x, y, L, ang, g, a) { const rq = ((Math.round(ang / (PI / 8)) % 16) + 16) % 16; stamp(ctx, 'sh|' + L + '|' + rq + '|' + (g ? 1 : 0), x, y, L + 8, L + 8, c => { c.rotate(rq * PI / 8); shardVec(c, L, g); }, a); }

  // her reflection, as a mirror shows it: slate hair, the silver mask with its one cyan glint; s its height, facing dir
  function reflVec(c, s, dir) {
    c.save(); c.scale(dir, 1);
    poly(c, [[-0.13 * s, -0.42 * s], [-0.2 * s, -0.1 * s], [-0.16 * s, 0.14 * s], [-0.04 * s, 0.1 * s], [0.0, -0.3 * s]], C.sl);   // her long hair, behind
    poly(c, [[-0.11 * s, -0.24 * s], [0.11 * s, -0.24 * s], [0.14 * s, 0.14 * s], [0.08 * s, 0.5 * s], [-0.08 * s, 0.5 * s], [-0.14 * s, 0.14 * s]], C.gb);   // the tunic
    poly(c, [[-0.02 * s, -0.2 * s], [0.11 * s, -0.24 * s], [0.14 * s, 0.14 * s], [0.03 * s, 0.14 * s]], C.sl);
    ell(c, 0.01 * s, -0.36 * s, 0.1 * s, 0.11 * s, C.sv);   // her face
    poly(c, [[-0.1 * s, -0.47 * s], [0.1 * s, -0.47 * s], [0.12 * s, -0.36 * s], [-0.09 * s, -0.36 * s]], C.sl);   // hair across the brow
    poly(c, [[-0.06 * s, -0.42 * s], [0.12 * s, -0.42 * s], [0.12 * s, -0.34 * s], [-0.05 * s, -0.34 * s]], C.hi);   // the mask
    poly(c, [[0.04 * s, -0.4 * s], [0.09 * s, -0.4 * s], [0.09 * s, -0.36 * s], [0.04 * s, -0.36 * s]], C.cy);   // its glint
    c.restore();
  }
  // a standing mirror in a pointed frame, w by h, centred; o = { dir (which way her reflection faces; 0 none), fire }
  function mirrorVec(c, w, h, o) {
    const a = w / 2, b = h / 2, t = Math.max(1.5, w * 0.1);
    poly(c, [[-a, b], [-a, -b * 0.45], [0, -b], [a, -b * 0.45], [a, b]], C.sd);   // the frame
    poly(c, [[-a, b], [-a, -b * 0.45], [0, -b], [0, -b + t * 0.8], [-a + t * 0.7, -b * 0.45 + t * 0.3], [-a + t * 0.7, b]], C.sl);
    poly(c, [[-a + t, b - t], [-a + t, -b * 0.45 + t * 0.4], [0, -b + t * 1.5], [a - t, -b * 0.45 + t * 0.4], [a - t, b - t]], o.fire ? C.w : C.sv);   // the glass
    if (!o.fire) {
      poly(c, [[-a + t, -b * 0.1], [-a + t, -b * 0.45 + t * 0.4], [0, -b + t * 1.5], [a * 0.3, -b * 0.62]], C.hi);
      if (o.dir) { c.save(); c.translate(0, b * 0.22); reflVec(c, h * 0.62, o.dir); c.restore(); }
      poly(c, [[-a + t, b * 0.5], [-a + t, b * 0.2], [a * 0.5, -b * 0.75], [a * 0.72, -b * 0.6]], C.w);   // a streak of light across it
    }
    ell(c, 0, -b + t * 0.5, t * 0.55, t * 0.55, C.cy);   // a glint at the peak of the frame
    poly(c, [[-a - 1, b], [a + 1, b], [a + 1, b - t * 0.8], [-a - 1, b - t * 0.8]], C.sd);
  }
  // cracks spreading from (x, y): k 0-1 how far, R how long
  function cracks(ctx, x, y, k, seed, R, n) {
    if (k <= 0) return;
    for (let i = 0; i < (n || 7); i++) {
      let an = i / (n || 7) * PI * 2 + rnd(seed, i) * 0.7, px = x, py = y; const len = R * (0.6 + 0.4 * rnd(seed, i + 9)) * k;
      for (let j = 0; j < 4; j++) { an += (rnd(seed, i * 5 + j) - 0.5) * 0.9; const nx = px + Math.cos(an) * len / 4, ny = py + Math.sin(an) * len / 4 * 0.8; art.line(ctx, '#2a3048', Math.round(px), Math.round(py) + 1, Math.round(nx), Math.round(ny) + 1, 1); art.line(ctx, j % 2 ? '#e8f0ff' : '#ffffff', Math.round(px), Math.round(py), Math.round(nx), Math.round(ny), 1); px = nx; py = ny; }
    }
  }
  // a small four-pointed glint
  function glint(ctx, x, y, r, col) { art.rect(ctx, col || '#22d3ee', x - r, y, r * 2 + 1, 1); art.rect(ctx, col || '#22d3ee', x, y - r, 1, r * 2 + 1); art.rect(ctx, '#ffffff', x, y, 1, 1); }
  // glass bursting: shards fly out from (x, y) in the world, turning as they fall
  function burst(x, y, n, L, pw) {
    const sh = [], f0 = SW.frame || 0; let draws = 0;
    for (let i = 0; i < n; i++) { const a = i / n * PI * 2 + rand(-0.2, 0.2), v = rand(pw * 0.5, pw); sh.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.8 - 1.2, r: rand(0, 6.28), w: rand(-0.5, 0.5), L: i % 3 ? L : L + 5 }); }
    PX.over((ctx, cam) => {
      const t = Math.max((SW.frame || 0) - f0, 0); if (t > 22 || ++draws > 60) return false;
      sh.forEach((q, i) => shard(ctx, x + q.vx * t - cam.x, y + q.vy * t + 0.14 * t * t - cam.y, q.L, q.r + q.w * t, (t + i) % 6 < 2, t > 14 ? (22 - t) / 8 : 1));
    });
    for (let i = 0; i < 8; i++) part(x + rand(-8, 8), y + rand(-8, 8), i % 3 ? '#e8f0ff' : '#22d3ee', rand(-pw, pw), rand(-pw, 0.5), 18, 2, 0.12);
  }
  Object.assign(MM, { shard, cracks, burst, PAL });

  // ================= the things heroes4.js keeps to itself (the Decoy and the Ray): redrawn on their own classes =================
  function adopt(s) {
    const proto = Object.getPrototypeOf(s), name = s.constructor && s.constructor.name;
    if (!proto || proto._mm) return;
    if (name === 'Decoy' && s.sheet && typeof proto.draw === 'function') {
      proto._mm = 1; const od = proto.draw, ou = proto.update;
      proto.draw = function (ctx, cam) {
        if (!MM.on) return od.apply(this, arguments);
        const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), left = this.life - this.t, k = Math.min(1, this.t / 4);
        stamp(ctx, 'pane', x, y - 23, 36, 58, c => mirrorVec(c, 30, 52, { dir: 0 }), 0.55 * k);   // the pane she stands in
        art.draw(ctx, this.sheet, 'guard', 0, x, y, !this.flip, { alpha: 0.85, flash: left < 14 && left % 4 < 2 });   // her reflection faces the other way
        if (left < 16) cracks(ctx, x, y - 22, 1 - left / 16, Math.round(this.x), 26, 6);   // it cracks before it breaks
        if (this.t % 24 < 5) glint(ctx, x + (this.flip ? 3 : -3), y - 35, 2);
      };
      proto.update = function () { const r = ou.apply(this, arguments); if (MM.on && this.gone && !this._mmB) { this._mmB = 1; burst(this.x, this.y - 18, 12, 13, 4.2); } return r; };
    } else if (name === 'Ray' && s.ang !== undefined && s.dir !== undefined && typeof proto.draw === 'function') {
      proto._mm = 1; const od = proto.draw;
      proto.draw = function (ctx, cam) {
        if (!MM.on) return od.apply(this, arguments);
        const x0 = Math.round(this.x - cam.x), y0 = Math.round(this.y - cam.y), dx = this.dir * Math.cos(this.ang), dy = Math.sin(this.ang), x1 = Math.round(x0 + dx * 250), y1 = Math.round(y0 + dy * 250), a = SW.clamp((15 - this.t) / 7, 0, 1), wide = this.t < 6;
        ctx.globalAlpha = a;
        art.line(ctx, '#8a92b8', x0, y0, x1, y1, wide ? 5 : 3); art.line(ctx, '#22d3ee', x0, y0 + (wide ? 3 : 2), x1, y1 + (wide ? 3 : 2), 1);   // a cyan fringe: the glass splits the light
        art.line(ctx, '#e8f0ff', x0, y0, x1, y1, wide ? 3 : 1); art.line(ctx, '#ffffff', x0, y0, x1, y1, 1);
        for (let j = 0; j < 5; j++) { const u = ((this.t * 0.11 + j / 5) % 1) * 250; art.rect(ctx, '#ffffff', Math.round(x0 + dx * u) - 1, Math.round(y0 + dy * u) - 1, 3, 3); }
        ctx.globalAlpha = 1;
        if (this.main) stamp(ctx, 'prism', x0 + this.dir * 2, y0, 26, 26, c => { poly(c, [[-7, 8], [0, -10], [7, 8]], C.sv); poly(c, [[0, -10], [7, 8], [1, 3]], C.gb); poly(c, [[-7, 8], [0, -10], [-1.5, 2]], C.hi); poly(c, [[-2, 5], [0, -3], [2, 5]], C.cy); poly(c, [[-4.5, 4], [-1.5, -5], [-2.5, 4]], C.w); }, a);   // the prism it passes through
      };
    }
  }

  // ================= her other shots =================
  function dress(z) {
    z.shots.forEach(s => {
      if (s.mm !== undefined) return;
      s.mm = 0; adopt(s);
      if (s instanceof Proj && s.w === 10 && s.h === 8 && s.ghost && s.render) { s.mm = 1; const ph = Math.round(rand(0, 9)); s.render = (ctx, x, y, q) => shard(ctx, x, y, 16, Math.atan2(q.vy, q.vx) + (q.t + ph) * 0.45, (q.t + ph) % 9 < 3); }   // Glass Fan: they turn and flash
      else if (s.paint && s.style === 'glass' && s.w === 10 && s.h === 10 && s.life === 30) { s.mm = 1; s.paint = (ctx, x, y, q) => shard(ctx, x, y, 18, Math.atan2(q.vy, q.vx), q.t % 6 < 2); }   // the Kaleidoscope's shards, thrown
    });
  }

  // ================= W+O: Kaleidoscope =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.mira;
  if (SIG && SIG.cast) {
    const _kc = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _kc.apply(this, arguments);
      if (!isM(G)) return r;
      const o = z.shots.slice(n0).find(s => s.paint && s.life === 42);
      if (o) { o.mm = 1; o.paint = (ctx, sx, sy, s) => { for (let i = 0; i < 6; i++) { const a = s.t * 0.16 + i * 6.283 / 6; shard(ctx, sx + Math.cos(a) * 26, sy + Math.sin(a) * 26 * 0.7, 18, a + PI / 2, (s.t + i * 4) % 12 < 3); } }; }
      return r;
    };
  }

  // ================= S+I: Hall of Mirrors =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.mira;
  if (BU && BU.cast) {
    const _hm = BU.cast, SPOTS = [[-44, -26], [44, -26], [-44, 20], [44, 20]];
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _hm.apply(this, arguments);
      if (!isM(G)) return r;
      const v = z.shots.slice(n0).find(s => s.life === 44 && s.render);
      if (v) {
        v.mm = 1;
        v.render = (ctx, x, y, t) => {
          SPOTS.forEach((s, i) => {
            const px = x + s[0], py = y + s[1], k = t - (6 + i * 6), dir = s[0] < 0 ? 1 : -1;
            if (t > 36) { const u = (t - 36) / 8; for (let j = 0; j < 4; j++) { const an = j * PI / 2 + i; shard(ctx, px + Math.cos(an) * u * 22, py + Math.sin(an) * u * 18 + u * u * 8, 13, an + u * 3, j % 2, 1 - u); } return; }   // they break together
            const fire = k >= 0 && k < 6, pop = Math.min(1, (t + 1) / 3);
            if (fire) { ctx.globalAlpha = 1 - k / 6; art.line(ctx, '#8a92b8', px, py, x, y, 5); art.line(ctx, '#22d3ee', px, py + 3, x, y + 3, 1); art.line(ctx, '#ffffff', px, py, x, y, 3); ctx.globalAlpha = 1; }
            stamp(ctx, 'hall|' + dir + '|' + (fire && k < 3 ? 1 : 0), px, py - 2, 24, 40, c => mirrorVec(c, 18, 32, { dir, fire: fire && k < 3 }), pop);
            if (t > 28) cracks(ctx, px, py - 2, (t - 28) / 8, i + 3, 12, 5);
          });
        };
      }
      return r;
    };
  }

  // ================= J: mirror cuts; the small auras =================
  const CUT = ['#2a3048', '#c8d4f0', '#ffffff'];
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 8) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.55 : 22, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), up = a.anim === 'launcher';
        PX.claws(ctx, sx + d * (reach + 2), hy, up ? (d > 0 ? -0.9 : PI + 0.9) : (d > 0 ? 0.5 : PI - 0.5), big ? 32 : 22, k / 8, CUT, 2);
        if (k < 4) glint(ctx, sx + d * (reach + 6), hy, big ? 5 - k : 4 - k);
        if (k === 0) { for (let i = 0; i < (big ? 4 : 2); i++) part(p.x + d * reach + rand(-4, 4), p.y - 22 + rand(-6, 6), i % 2 ? '#e8f0ff' : '#22d3ee', d * rand(0.5, 2.5), rand(-2, 0.5), 16, 2, 0.12); }
      }
    }
    if (!front && (p.modeT > 0 || p.awakeT > 0)) {   // Silvering / Glass Form: a sheet of mirror ice under her feet (small)
      const fade = Math.min(1, Math.max(p.modeT || 0, p.awakeT || 0) / 30);
      stamp(ctx, 'ice', sx, sy + 1, 48, 10, c => { ell(c, 0, 0, 21, 3.2, C.sv); ell(c, -3, -0.6, 15, 1.8, C.hi); poly(c, [[-12, -1], [-4, -1.6], [-6, 0.4], [-14, 1]], C.w); poly(c, [[6, 0.2], [13, -0.6], [11, 1.2]], C.w); }, fade * 0.85);
    }
    if (front && p.awakeT > 0) glint(ctx, sx + d * 3, sy - 35, 2 + (p.t % 20 < 6 ? 2 : p.t % 20 < 10 ? 1 : 0));   // Glass Form: the glint on her mask flares (small)
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isM(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isM(g || this.G) || !z || !z.shots) return r;
    dress(z); if (G.zone && G.zone !== z && G.zone.shots) dress(G.zone);
    if (!this.dead && this.awakeT > a0 + 60) for (let i = 0; i < 12; i++) part(this.x + rand(-8, 8), this.y - 24 + rand(-10, 10), i % 3 ? '#e8f0ff' : '#22d3ee', rand(-2.6, 2.6), rand(-2.6, 0.5), 18, 2, 0.12);   // Glass Form begins (small and short)
    return r;
  };

  // ================= W+I: Seven Years' Luck, the finish =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isM(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('mira') : null;
    if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    return r;
  };
  // js/ult-grand.js builds up from BU2 and lands its finishing blow at FIN: a great mirror rises behind the target
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1, MW = 64, MH = 84;
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    let broke = false;
    const great = (ctx, x, y, a, glass) => PX.sprite(ctx, x, y, MW + 10, MH + 10, c => {
      const A = MW / 2, B = MH / 2, t = 5;
      if (glass) { poly(c, [[-A + t, B - t], [-A + t, -B * 0.45 + 2], [0, -B + t * 1.5], [A - t, -B * 0.45 + 2], [A - t, B - t]], C.sv); poly(c, [[-A + t, -B * 0.05], [-A + t, -B * 0.45 + 2], [0, -B + t * 1.5], [A * 0.3, -B * 0.6]], C.hi); c.save(); c.translate(-dir * 13, B * 0.2); reflVec(c, MH * 0.66, dir); c.restore(); poly(c, [[-A + t, B * 0.55], [-A + t, B * 0.3], [A * 0.55, -B * 0.72], [A * 0.75, -B * 0.58]], C.w); }
      else {   // the frame alone
        poly(c, [[-A, B], [-A, -B * 0.45], [0, -B], [A, -B * 0.45], [A, B], [A - t, B], [A - t, -B * 0.45 + 2], [0, -B + t * 1.5], [-A + t, -B * 0.45 + 2], [-A + t, B]], C.sd);
        poly(c, [[-A, B], [-A, -B * 0.45], [0, -B], [0, -B + 2.5], [-A + 2.5, -B * 0.45 + 1], [-A + 2.5, B]], C.sl);
        poly(c, [[-A - 2, B], [A + 2, B], [A + 2, B - 4], [-A - 2, B - 4]], C.sd); ell(c, 0, -B + 3, 3, 3, C.cy); ell(c, 0, -B + 3, 1.2, 1.2, C.w);
      }
    }, { pal: PAL, outline: glass ? false : OUT, alpha: a });
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult') return false;
      const st = p.st; if (st < BU2 - 2 || st > FIN + 18) return;
      const sx = Math.round(v.x - cam.x), sy = Math.round(v.y - cam.y), cy = sy - 20, my = sy + 2 - MH / 2;
      if (st < FIN) {   // it rises behind them; her reflection is in it; cracks spread from where they stand
        const k = ease((st - (BU2 - 2)) / 9), rise = Math.round((1 - k) * 50), ck = ease((st - (BU2 + 6)) / Math.max(1, FIN - BU2 - 7)), sh = st > FIN - 8 ? Math.round(Math.sin(st * 2.3) * 1.2) : 0;
        great(ctx, sx + sh, my + rise, 0.5 * k, true); great(ctx, sx + sh, my + rise, k, false);
        cracks(ctx, sx + sh, cy, ck, 11, 44, 9);
        if (st % 14 < 5) glint(ctx, sx - dir * 13 + dir * 4, my + rise - 12, 3);
      } else {   // and it bursts through them
        const k = (st - FIN) / 18, ik = (st - FIN) / 5;
        PX.impact(ctx, sx, cy, ik, 61);
        if (!broke) { broke = true; burst(v.x, v.y - 26, 18, 20, 6.5); }
        great(ctx, sx, my, 1 - ease(k * 1.4), false);
        cracks(ctx, sx, cy, 1, 11, 44 + k * 40, 9);
      }
    });
  }
})();
