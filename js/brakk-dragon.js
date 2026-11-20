'use strict';
// Shattered Worlds — Brakk's stone dragon (the user, 2026-11-20: "improve all of the heros skills one by one ... start with
// Brakk his dragon should look like the one in image and open mouth and improve all of his skill"). His lore: a Warden of
// the Standing Stones, "a harness of rock, and the head of a stone dragon rising over his shoulder". So the whole kit is
// one stone dragon with a molten amber core, plus the carved standing stones he guarded. Draw-only: every hit, hitbox and
// timing stays as it was. Loaded after js/nami-shark.js; only wraps.
//   U      Boulder Toss: a carved Warden stone, tumbling, its rune glowing; it shatters into chunks
//   S+U    Quake: rows of stone fangs burst up along both shockwaves, the ground cracks with amber light
//   I      Earth Dragon: a serpentine stone dragon, rock-plated body and spines, horned head with its jaws wide open
//   S+I    Warden's Wall: a standing stone carved with runes ploughs forward, a dragon's head bursting from its face
//   W+O    Avalanche: a huge stone dragon head leans out of the sky and spits the boulders down
//   S+O    Stoneskin: rock plates orbit him
//   O      Titan Form: the dragon erupts behind him with a roar, then rides over his shoulder while he is awake
//   W+I    World Breaker: the two dragons, cracks across the arena, then a giant dragon rears behind the target and
//          brings its jaws down on the finishing blow (js/ult-grand.js's timing)
// SW.brakkDragon.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Dragon = SW.Dragon;
  if (!N || !P || !CASTS || !Dragon || !CASTS.earth_dragon) return;
  const BD = SW.brakkDragon = { on: true };
  const isBrakk = g => !!(BD.on && g && g.state && g.state.hero === 'brakk');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

  // ================= the stone dragon =================
  const C = { dark: '#2b2118', mid: '#5e4e36', stone: '#8a7756', light: '#b19d78', hi: '#d6c49c', crack: '#ff9a3c', glow: '#ffcf6a',
    mouth: '#2a1006', throat: '#7a2a08', tooth: '#f2e8cc', eye: '#ffd24a', moss: '#5f7a3a' };
  function shape(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }
  function paint(ctx, fill, line) { ctx.fillStyle = fill; ctx.fill(); if (line) { ctx.strokeStyle = line; ctx.stroke(); } }
  function crack(ctx, pts, w) { ctx.save(); ctx.strokeStyle = C.crack; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.restore(); }
  // head(ctx, x, y, s, dir, { jaw 0-1, rot (negative = nose up), a, t }): the neck joint at (x, y), the snout s pixels ahead
  function head(ctx, x, y, s, dir, o) {
    o = o || {};
    if (s < 4) return;
    const jaw = clamp01(o.jaw === undefined ? 0.8 : o.jaw), ja = jaw * 0.8, ca = Math.cos(ja), sa = Math.sin(ja), hx = 0.3, hy = 0.04;
    const J = (px, py) => [hx + px * ca - py * sa, hy + px * sa + py * ca];
    ctx.save();
    ctx.translate(x, y); ctx.scale((dir < 0 ? -1 : 1) * s, s); ctx.rotate(o.rot || 0);
    if (o.a !== undefined) ctx.globalAlpha *= clamp01(o.a);
    ctx.lineWidth = Math.max(1, s / 40) / s; ctx.lineJoin = 'round';
    // the far horn and the mane of stone spikes, behind everything
    ctx.beginPath(); ctx.moveTo(0.24, -0.25); ctx.quadraticCurveTo(0.02, -0.52, -0.34, -0.7); ctx.quadraticCurveTo(-0.02, -0.42, 0.12, -0.2); ctx.closePath(); paint(ctx, C.mid, C.dark);
    for (let i = 0; i < 5; i++) { const bx = 0.14 - i * 0.07, by = -0.24 + i * 0.09; shape(ctx, [[bx, by], [bx - 0.3 - i * 0.02, by - 0.1 + i * 0.05], [bx - 0.04, by + 0.08]]); paint(ctx, i % 2 ? C.mid : C.dark, C.dark); }
    // the open mouth: throat, molten glow, then the lower jaw with its fangs and stone beard
    const tip = J(0.62, 0);
    shape(ctx, [[hx - 0.02, hy - 0.01], [0.98, 0.0], tip, J(0.05, 0.1)]); paint(ctx, C.mouth);
    if (jaw > 0.1) {
      const gx = 0.55, gy = 0.05 + jaw * 0.12, gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 0.42);
      gr.addColorStop(0, 'rgba(255,214,110,' + (0.85 * jaw).toFixed(2) + ')'); gr.addColorStop(0.45, 'rgba(255,120,30,' + (0.55 * jaw).toFixed(2) + ')'); gr.addColorStop(1, 'rgba(120,30,0,0)');
      shape(ctx, [[hx - 0.02, hy - 0.01], [0.98, 0.0], tip, J(0.05, 0.1)]); ctx.fillStyle = gr; ctx.fill();
    }
    for (let i = 0; i < 3; i++) { const u = 0.12 + i * 0.13; shape(ctx, [J(u - 0.04, 0.12), J(u + 0.04, 0.12), J(u - 0.06, 0.3 - i * 0.03)]); paint(ctx, C.mid, C.dark); }   // beard
    shape(ctx, [J(0, -0.01), J(0.62, 0), J(0.6, 0.07), J(0.38, 0.12), J(0.05, 0.13), J(-0.04, 0.07)]); paint(ctx, C.stone, C.dark);
    shape(ctx, [J(0.04, 0.08), J(0.58, 0.05), J(0.38, 0.11), J(0.05, 0.12)]); paint(ctx, C.mid);
    ctx.fillStyle = C.tooth;
    for (let i = 0; i < 5; i++) { const u = 0.12 + i * 0.09, L = i === 4 ? 0.13 : 0.06; shape(ctx, [J(u - 0.025, -0.005), J(u + 0.025, -0.005), J(u, -0.005 - L * Math.min(1, jaw * 2.5))]); ctx.fill(); }
    // the upper head
    const top = () => {
      ctx.beginPath(); ctx.moveTo(-0.06, 0.13); ctx.lineTo(-0.06, -0.12);
      ctx.quadraticCurveTo(0.1, -0.31, 0.3, -0.33); ctx.lineTo(0.48, -0.3); ctx.quadraticCurveTo(0.57, -0.22, 0.7, -0.21);
      ctx.quadraticCurveTo(0.92, -0.2, 1.02, -0.12); ctx.lineTo(1.04, -0.04); ctx.lineTo(0.96, 0.0); ctx.lineTo(0.32, 0.03);
      ctx.quadraticCurveTo(0.2, 0.15, -0.06, 0.13); ctx.closePath();
    };
    top(); paint(ctx, C.stone);
    ctx.save(); top(); ctx.clip();
    ctx.fillStyle = C.mid; ctx.fillRect(-0.2, -0.02, 1.4, 0.3);   // the shadowed jaw line
    ctx.globalAlpha *= 0.7; ctx.beginPath(); ctx.moveTo(0.02, -0.16); ctx.quadraticCurveTo(0.3, -0.36, 0.66, -0.2); ctx.quadraticCurveTo(0.86, -0.19, 1.0, -0.13); ctx.lineTo(0.98, -0.1); ctx.quadraticCurveTo(0.5, -0.2, 0.02, -0.1); ctx.closePath(); paint(ctx, C.hi);
    ctx.globalAlpha /= 0.7;
    for (let i = 0; i < 5; i++) { ctx.fillStyle = C.dark; ctx.fillRect(0.58 + i * 0.08, -0.17 + (i % 2) * 0.02, 0.03, 0.012); }   // snout plates
    ctx.restore();
    top(); ctx.strokeStyle = C.dark; ctx.stroke();
    ctx.fillStyle = C.tooth;   // upper fangs: two long ones at the front
    for (let i = 0; i < 6; i++) { const u = 0.4 + i * 0.09, yy = 0.03 - (u - 0.32) * 0.047, L = i >= 4 ? 0.15 : 0.06; shape(ctx, [[u - 0.025, yy], [u + 0.025, yy], [u, yy + L * Math.min(1, jaw * 2.5 + 0.3)]]); ctx.fill(); }
    // brow, eye, nostril, the near horn, the glowing cracks
    shape(ctx, [[0.3, -0.33], [0.55, -0.27], [0.5, -0.21], [0.33, -0.25]]); paint(ctx, C.dark);
    ctx.beginPath(); ctx.ellipse(0.46, -0.19, 0.055, 0.028, -0.15, 0, PI * 2); paint(ctx, C.eye);
    ctx.beginPath(); ctx.ellipse(0.47, -0.19, 0.012, 0.024, 0, 0, PI * 2); paint(ctx, '#140800');
    ctx.beginPath(); ctx.ellipse(0.95, -0.1, 0.025, 0.014, 0.3, 0, PI * 2); paint(ctx, C.dark);
    ctx.beginPath(); ctx.moveTo(0.2, -0.27); ctx.quadraticCurveTo(-0.04, -0.5, -0.42, -0.62); ctx.quadraticCurveTo(-0.08, -0.38, 0.06, -0.19); ctx.closePath(); paint(ctx, C.light, C.dark);
    ctx.strokeStyle = C.mid; for (let i = 1; i < 4; i++) { const u = i / 4; ctx.beginPath(); ctx.moveTo(0.2 - u * 0.5, -0.26 - u * 0.3); ctx.lineTo(0.12 - u * 0.48, -0.2 - u * 0.33); ctx.stroke(); }
    const lw = Math.max(1, s / 36) / s;
    crack(ctx, [[0.06, -0.06], [0.13, -0.01], [0.09, 0.05], [0.16, 0.09]], lw);
    crack(ctx, [[0.6, -0.14], [0.66, -0.09], [0.74, -0.11]], lw);
    crack(ctx, [[0.22, -0.18], [0.28, -0.12]], lw);
    ctx.restore();
    if (o.glow !== false) art.glow(ctx, Math.round(x + dir * Math.cos(o.rot || 0) * s * 0.46), Math.round(y + Math.sin(o.rot || 0) * s * 0.46 - s * 0.19), Math.max(3, Math.round(s * 0.08)), C.eye, 0.25);
  }
  // a plate of rock for the body: r the size, k a seed, up the spine side (0 none)
  function chunk(ctx, x, y, r, k, spine, dir) {
    if (r < 1.5) return;
    const n = 7, pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * PI * 2, rr = r * (0.82 + 0.3 * hash(k, i)); pts.push([x + Math.cos(a) * rr * 1.15, y + Math.sin(a) * rr]); }
    if (spine) { const sh = r * (1.1 + 0.5 * hash(k, 9)); shape(ctx, [[x + dir * r * 0.5, y - r * 0.7], [x - dir * r * 0.9, y - r * 0.6 - sh], [x - dir * r * 0.2, y - r * 0.4]]); paint(ctx, C.mid, C.dark); }
    ctx.lineWidth = 1; shape(ctx, pts); paint(ctx, C.stone, C.dark);
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.35, r * 0.85, r * 0.45, 0, 0, PI); ctx.fillStyle = C.mid; ctx.fill();
    ctx.beginPath(); ctx.ellipse(x - r * 0.2, y - r * 0.35, r * 0.55, r * 0.28, 0, 0, PI * 2); ctx.fillStyle = C.light; ctx.fill();
    if (hash(k, 3) > 0.55 && r > 4) crack(ctx, [[x - r * 0.4, y - r * 0.1], [x, y + r * 0.15], [x + r * 0.35, y - r * 0.05]], 1);
  }
  // a clawed leg hanging from the body at (x, y)
  function leg(ctx, x, y, s, dir, t) {
    const sw = Math.sin(t * 0.3) * 0.3;
    ctx.save(); ctx.translate(x, y); ctx.scale(dir < 0 ? -1 : 1, 1); ctx.rotate(sw);
    ctx.lineWidth = 1; shape(ctx, [[-s * 0.25, 0], [s * 0.25, 0], [s * 0.35, s * 0.8], [s * 0.05, s * 0.85]]); paint(ctx, C.mid, C.dark);
    ctx.fillStyle = C.tooth; for (let i = 0; i < 3; i++) { shape(ctx, [[s * (0.02 + i * 0.13), s * 0.82], [s * (0.1 + i * 0.13), s * 0.82], [s * (0.14 + i * 0.13), s * 1.1]]); ctx.fill(); }
    ctx.restore();
  }
  BD.head = head; BD.chunk = chunk;

  // ================= I: Earth Dragon (and the two in World Breaker): the body follows its path =================
  const _dd = Dragon.prototype.draw;
  Dragon.prototype.draw = function (ctx, cam) {
    if (!BD.on || !this.brakk) return _dd.apply(this, arguments);
    const tr = this.trail, d = this.dir, n = tr.length;
    for (let i = n - 1; i >= 3; i -= 3) {   // tail first, plates growing toward the head
      const q = tr[i], px = q[0] - cam.x, py = q[1] - cam.y, r = Math.max(2.5, 11.5 - i / 4.6);
      chunk(ctx, px, py, r, i + this.seed, i % 6 === 0 && i > 3, d);
      if (i === 9 || i === 27) { const q2 = tr[Math.max(0, i - 2)]; leg(ctx, px + d * 2, py + r * 0.5, r * 1.1, d, this.t + i); if (q2) leg(ctx, q2[0] - cam.x - d * 3, py + r * 0.5, r * 0.9, d, this.t + i + 4); }
    }
    const hx = this.x - cam.x, hy = this.y - cam.y, q = tr[Math.min(4, n - 1)] || [this.x - d, this.y];
    const rot = SW.clamp(Math.atan2(this.y - q[1], Math.abs(this.x - q[0]) || 1), -0.7, 0.7);
    art.glow(ctx, Math.round(hx + d * 22), Math.round(hy + 2), 18, C.crack, 0.12);
    head(ctx, hx - d * 8, hy, 38, d, { rot, jaw: 0.72 + 0.28 * Math.sin(this.t * 0.28), t: this.t });
    if (this.t % 4 === 0) part(this.x + d * 26, this.y + 4, this.t % 8 ? '#c8a878' : C.crack, d * rand(0.5, 1.5), rand(-0.6, 0.6), 14, 2);   // dust and embers from the mouth
  };
  const _ed = CASTS.earth_dragon;
  CASTS.earth_dragon = function (p, z) {
    const n0 = z.shots.length, r = _ed.apply(this, arguments);
    if (isBrakk(G)) z.shots.slice(n0).forEach(s => { if (s instanceof Dragon) { s.brakk = true; s.seed = rand(0, 100) | 0; } });
    return r;
  };

  // ================= U: Boulder Toss: a carved Warden stone =================
  function wardenStone(ctx, x, y, r, rot, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.lineWidth = 1;
    const pts = []; for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2, rr = r * (0.85 + 0.25 * hash(5, i)); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    shape(ctx, pts); paint(ctx, C.stone, C.dark);
    ctx.beginPath(); ctx.ellipse(0, r * 0.3, r * 0.85, r * 0.5, 0, 0, PI); ctx.fillStyle = C.mid; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-r * 0.25, -r * 0.35, r * 0.45, r * 0.25, 0, 0, PI * 2); ctx.fillStyle = C.light; ctx.fill();
    const g = 0.6 + 0.4 * Math.sin(t * 0.4);   // the Warden's rune
    ctx.strokeStyle = 'rgba(255,190,90,' + g.toFixed(2) + ')'; ctx.lineWidth = Math.max(1, r / 6);
    ctx.beginPath(); ctx.moveTo(0, -r * 0.55); ctx.lineTo(0, r * 0.5); ctx.moveTo(-r * 0.35, -r * 0.2); ctx.lineTo(0, r * 0.05); ctx.lineTo(r * 0.35, -r * 0.2); ctx.stroke();
    ctx.restore();
    art.glow(ctx, Math.round(x), Math.round(y), Math.round(r * 1.2), C.crack, 0.1 * g);
  }
  BD.stone = wardenStone;
  const _rt = CASTS.rock_throw;
  CASTS.rock_throw = function (p, z) {
    const n0 = z.shots.length, r = _rt.apply(this, arguments);
    if (!isBrakk(G)) return r;
    const pr = z.shots[n0]; if (!pr || !pr.render) return r;
    const spin = (Math.sign(pr.vx) || 1) * 0.22, _end = pr.onEnd;
    pr.render = (ctx, x, y, s) => { if (s.t % 2) art.rect(ctx, '#c8a878', x - Math.sign(s.vx || 1) * (8 + (s.t % 4)), y + rand(-3, 3), 2, 2); wardenStone(ctx, x, y, 12, s.t * spin, s.t); };
    pr.onEnd = function (g, zz) {
      if (_end) _end.apply(this, arguments);
      for (let i = 0; i < 7; i++) part(this.x, this.y, i % 3 ? C.stone : C.crack, rand(-2.6, 2.6), -rand(1, 3.6), 22, 3, 0.2);   // it shatters into chunks
    };
    return r;
  };

  // ================= S+U: Quake: stone fangs ride the shockwaves =================
  const _qk = CASTS.quake;
  CASTS.quake = function (p, z) {
    const n0 = z.shots.length, r = _qk.apply(this, arguments);
    if (!isBrakk(G)) return r;
    const x0 = p.x, gy = p.y;
    z.shots.push(new Vis(x0, gy, 30, (ctx, sx, sy, t) => {   // the stomp: the ground cracks open in amber
      const k = t / 30, a = 1 - ease((k - 0.5) / 0.5);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.crack; ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) { const d = i < 3 ? 1 : -1, L = (24 + i * 9) * ease(k * 3); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + d * L * 0.5, sy - 1 + (i % 2)); ctx.lineTo(sx + d * L, sy + ((i * 3) % 2)); ctx.stroke(); }
      ctx.restore();
    }));
    z.shots.slice(n0).forEach(s => {
      if (s.kind !== 'shock') return;
      const sp = [];   // stone fangs left behind the wave front
      s.draw = function (ctx, cam) {
        if (this.t % 3 === 0 && sp[sp.length - 1] !== this.t) sp.push(this.t);
        const fang = (x, y, w, h, lean, col) => {
          ctx.lineWidth = 1; shape(ctx, [[x - w, y], [x - w * 0.6, y - h * 0.55], [x + lean, y - h], [x + w * 0.7, y - h * 0.45], [x + w, y]]); paint(ctx, col, C.dark);
          shape(ctx, [[x - w * 0.6, y], [x - w * 0.35, y - h * 0.5], [x + lean, y - h], [x - w * 0.1, y]]); paint(ctx, C.hi);
          art.rect(ctx, C.crack, Math.round(x - w * 0.5), Math.round(y - 1), Math.round(w), 1);
        };
        sp.forEach((t0, i) => {
          const age = this.t - t0, h = (18 + (i % 3) * 8) * Math.sin(clamp01(age / 16) * PI), x = this.x - this.vx * age - cam.x, y = this.fy - cam.y;
          if (h < 2) return;
          fang(x, y, 5 + (i % 2), h, (i % 2 ? 2 : -2), i % 2 ? C.stone : C.light);
          if (i % 3 === 0) fang(x + 6, y, 3, h * 0.55, 1, C.mid);
        });
        const x = this.x - cam.x, y = this.fy - cam.y;   // the front: the tallest fang, glowing at the root
        fang(x, y, 8, 32, Math.sign(this.vx) * 3, C.light); fang(x - Math.sign(this.vx) * 7, y, 4, 16, 0, C.stone);
        art.glow(ctx, Math.round(x), Math.round(y - 3), 11, C.crack, 0.22);
      };
    });
    return r;
  };

  // ================= S+I: Warden's Wall: a standing stone with a dragon in it =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.brakk;
  if (BU && BU.cast) {
    const _ww = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _ww.apply(this, arguments);
      if (!isBrakk(G)) return r;
      const vis = z.shots.slice(n0).find(s => s.life === 34 && s.render); if (!vis) return r;
      const dir = p.face;
      vis.render = (ctx, x, y, t) => {
        const hh = Math.round(58 * Math.min(1, t / 5) * (t > 28 ? (34 - t) / 6 : 1)); if (hh < 2) return;
        ctx.save(); ctx.beginPath(); ctx.rect(x - 60, y - 120, 120, 120); ctx.clip();
        ctx.lineWidth = 1;
        shape(ctx, [[x - 12, y], [x - 13, y - hh * 0.7], [x - 8, y - hh], [x + 6, y - hh + 3], [x + 12, y - hh * 0.6], [x + 11, y]]); paint(ctx, C.stone, C.dark);
        shape(ctx, [[x - 12, y], [x - 13, y - hh * 0.7], [x - 8, y - hh], [x - 5, y - hh], [x - 7, y - hh * 0.6], [x - 6, y]]); paint(ctx, C.light);
        shape(ctx, [[x + 5, y], [x + 7, y - hh * 0.6], [x + 6, y - hh + 3], [x + 12, y - hh * 0.6], [x + 11, y]]); paint(ctx, C.mid);
        art.rect(ctx, C.moss, x - 11, y - hh + 2, 6, 2);
        const g = 0.6 + 0.4 * Math.sin(t * 0.5);   // the Warden runes down its face
        ctx.strokeStyle = 'rgba(255,190,90,' + g.toFixed(2) + ')'; ctx.lineWidth = 1;
        for (let j = 12; j < hh - 6; j += 14) { ctx.beginPath(); ctx.moveTo(x - 3, y - j); ctx.lineTo(x + 1, y - j - 5); ctx.lineTo(x + 3, y - j); ctx.moveTo(x, y - j - 8); ctx.lineTo(x, y - j - 1); ctx.stroke(); }
        ctx.restore();
        if (hh > 30) head(ctx, x + dir * 6, y - hh * 0.62, 30, dir, { jaw: 0.6 + 0.4 * Math.sin(t * 0.45), rot: -0.1 });   // the dragon bursts from its face
        if (t % 2 === 0 && t > 5 && t < 29) part(x - dir * 10, y - 2, '#c8a878', -dir * rand(0.5, 2), -rand(0.5, 2), 16, 3);   // the furrow it ploughs
      };
      return r;
    };
  }

  // ================= W+O: Avalanche: the mountain's dragon spits the boulders =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.brakk;
  if (SIG && SIG.cast) {
    const _av = SIG.cast;
    SIG.cast = function (p, z) {
      const r = _av.apply(this, arguments);
      if (!isBrakk(G)) return r;
      const dir = p.face, hx = p.x + dir * 70, hy = p.y - 150;
      z.shots.push(new Vis(hx, hy, 50, (ctx, sx, sy, t) => {
        const k = t / 50, come = ease(t / 8), go = ease((k - 0.75) / 0.25);
        head(ctx, sx - dir * 30, sy - 40 * (1 - come) - 50 * go, 64, dir, { rot: 0.75, jaw: t < 6 ? t / 6 : 0.75 + 0.25 * Math.sin(t * 0.5), a: 1 - go });
      }, v => {
        const zs = G.zone && G.zone.shots; if (!zs) return;   // dress the boulders it throws as they appear
        zs.forEach(s => { if (s.style === 'rock' && s.w === 18 && !s.bkStone) { s.bkStone = true; const sp = rand(-0.3, 0.3); s.paint = (ctx, x, y, q) => wardenStone(ctx, x, y, 10, q.t * sp, q.t); } });
      }));
      return r;
    };
  }

  // ================= S+O and O: Stoneskin and Titan Form =================
  function aura(ctx, p, sx, sy, front) {
    const top = sy - (p.h || 34);
    if (p.modeT > 0) {   // plates of rock circle him
      const fade = Math.min(1, p.modeT / 30);
      for (let i = 0; i < 5; i++) {
        const a = p.t * 0.06 + i * 1.256, sn = Math.sin(a); if ((sn >= 0) !== front) continue;
        ctx.save(); ctx.globalAlpha *= fade; chunk(ctx, sx + Math.cos(a) * 20, sy - 16 + sn * 4 + Math.sin(p.t * 0.1 + i) * 3, 3.5 + (i % 2), i + 40, false, 1); ctx.restore();
      }
    }
    if (p.awakeT > 0 && !front) {   // the dragon rides over his shoulder
      const d = p.face, fade = Math.min(1, p.awakeT / 30), roar = Math.max(0, Math.sin(p.t * 0.045)) ** 8;
      ctx.save(); ctx.globalAlpha *= fade;
      // the neck comes up from behind his back shoulder; the head rides above and behind his own
      const bx = sx - d * 16, by = top + 14;
      for (let i = 5; i >= 0; i--) chunk(ctx, bx - d * (i % 2), by - (5 - i) * 5, 7 - i * 0.5, i + 70, i === 2 || i === 4, d);
      head(ctx, bx - d * 2, top - 14 + Math.sin(p.t * 0.06) * 1.5, 30, d, { rot: -0.12 - roar * 0.3, jaw: 0.35 + 0.65 * roar, a: fade });
      ctx.restore();
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const nm = isBrakk(g || this.G) && !this.dead, sx = Math.round(this.x - cam.x), sy = Math.round(this.y - cam.y);
    if (nm) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (nm) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, m0 = this.modeT || 0, r = _pu.apply(this, arguments);
    if (isBrakk(g || this.G) && z && z.shots && !this.dead) {
      if (this.awakeT > a0 + 60) {   // Titan Form: the dragon erupts behind him with a roar
        const d = this.face, x = this.x - d * 26, gy = this.y;
        for (let i = 0; i < 14; i++) part(x + rand(-14, 14), gy, i % 3 ? '#c8a878' : C.crack, rand(-2, 2), -rand(1.5, 5), 24, 3, 0.2);
        z.shots.push(new Vis(x, gy, 48, (ctx, sx, sy, t) => {
          const k = t / 48, rise = ease(t / 10) * (1 - ease((k - 0.7) / 0.3));
          ctx.save(); ctx.beginPath(); ctx.rect(sx - 200, sy - 300, 400, 300); ctx.clip();
          for (let i = 6; i >= 1; i--) chunk(ctx, sx - d * i * 3, sy + 10 - rise * (70 - i * 10), 14 - i, i + 90, i % 2 === 0, d);
          head(ctx, sx + d * 4, sy + 10 - rise * 82, 66, d, { rot: -0.55, jaw: t < 8 ? t / 8 : t < 30 ? 1 : 0.4, a: 1 - ease((k - 0.8) / 0.2) });
          ctx.restore();
        }));
      } else if (this.modeT > m0 + 60) {   // Stoneskin: the plates come up out of the ground
        for (let i = 0; i < 10; i++) part(this.x + rand(-18, 18), this.y, i % 2 ? C.stone : C.light, rand(-0.5, 0.5), -rand(2, 4), 18, 3, 0.15);
      }
    }
    return r;
  };

  // ================= W+I: World Breaker =================
  // its own frames (st 1-71) run through here; js/ult-grand.js then plays the build-up and strikes at plan.fin
  const _uf = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isBrakk(g)) return r;
    if (p.st === 8) {
      z.shots.forEach(s => { if (s instanceof Dragon && !s.brakk) { s.brakk = true; s.seed = rand(0, 100) | 0; } });
      const cr = new Vis(p.x, p.y, 60, (ctx, sx, sy, t) => {   // the arena splits from his feet
        const a = 1 - ease((t - 44) / 16);
        ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.crack; ctx.lineWidth = 2;
        for (const d of [-1, 1]) { const L = 260 * ease(t / 24); ctx.beginPath(); ctx.moveTo(sx, sy); for (let u = 12; u < L; u += 12) ctx.lineTo(sx + d * u, sy - ((u / 12) % 2) * 2); ctx.stroke(); }
        ctx.restore();
      });
      cr._ugS = 1; z.shots.push(cr);
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) giant(p, z, T);
    }
    return r;
  };
  // the giant: rears up behind the target through the build-up, jaws wide, and comes down on it at the finishing blow
  function giant(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('brakk') : null, FIN = pl ? pl.fin : 64, BU = pl ? Math.max(74, FIN - 30) : 30;
    const dir = T.x >= p.x ? 1 : -1, S = 150;
    const v0 = new Vis(T.x, T.y, 400, (ctx, sx, sy, t, v) => {
      const st = p.st; if (p.state !== 'ult' || st < BU - 2 || st > FIN + 16) return;
      const rise = ease((st - (BU - 2)) / 14), strike = st >= FIN - 4 ? ease((st - (FIN - 4)) / 4) : 0, after = st > FIN ? ease((st - FIN) / 16) : 0;
      // rearing: just behind and above the target (inside the pushed-in camera), jaws wide; striking: the mouth comes down onto it
      const rot = -0.35 + strike * 0.9, cr = Math.cos(rot), srt = Math.sin(rot);
      const mx = dir * (0.62 * cr - 0.08 * srt) * S, my = (0.62 * srt + 0.08 * cr) * S;   // the middle of the open mouth, from the neck joint
      const rx = sx - dir * 74, ry = sy - 40 + 170 * (1 - rise) + Math.sin(st * 0.2) * 2;
      const ex = sx - mx, ey = sy - 18 - my;
      const nx = rx + (ex - rx) * strike, ny = ry + (ey - ry) * strike + after * 60;
      ctx.save(); ctx.globalAlpha *= 1 - ease((after - 0.5) / 0.5);
      for (let i = 7; i >= 1; i--) chunk(ctx, nx - dir * i * 14, ny + i * 16, 22 - i, i + 120, i % 2 === 1, dir);   // the neck, down into the ground
      head(ctx, nx, ny, S, dir, { rot, jaw: st < FIN - 1 ? Math.min(1, rise * 1.4) : st === FIN - 1 ? 0.5 : 0.05, t: st });
      ctx.restore();
    }, v => { if (T && !T.dead) { v.x = T.x; v.y = T.y; } if (p.state !== 'ult') v.gone = true; });
    v0._ugS = 1;   // placed to the pixel: js/ult-grand.js must not enlarge it
    z.shots.push(v0);
  }
})();
