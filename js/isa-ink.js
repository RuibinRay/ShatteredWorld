'use strict';
// Shattered Worlds — Isa's ink and seal (2026-11-20, the hero-look rework: cool, not cute). Her story: the seal-writer of
// the Archive, "ribbons of black ink and crimson glyphs", "every word she writes is a door she can slam"; when the Final
// Word falls across the sky, she lifts the brush. Her ink was 4-pixel blobs and squares, her glyphs 2-pixel crosses.
// Now her ink is brushwork: tapered strokes with dry-brush streaks and spatter, and her glyphs are written characters
// (brush-script, rendered into crisp pixel art by js/pixel-kit.js with a crimson rim so black ink reads on any arena).
// The words: 封 seal, 爆 burst, 止 halt, 縛 bind, 禁 forbid, 閉 shut (a door, slammed). Draw-only: every hit, hitbox and
// timing stays as it was. Loaded after js/coda-ribbon.js.
//   U      Ink Bolt: a brush flick, thick at the head, thinning into dry streaks; it lands in a splash of ink
//   (all)  the glyph each skill leaves: a written character on the floor, pulsing crimson; it flares up when it bursts
//   S+U    Brush Stroke: one great tapering crescent of ink, dry-brush streaks at its tail
//   I      Seal Circle: a ring brushed on the floor round a vermilion seal; it wakes in four columns of rising ink
//   S+I    Binding Script: written characters wrap round the foe in a turning helix, then burst one by one
//   W+O    Living Script: four characters scuttle along the floor on legs of ink
//   J      her combo: a brush stroke through every hit; the last leaves a blot with a character in it
//   S+O    Wet Ink: ink drips from her brush hand      O  Grand Script: three small crimson characters circle her
//          (small on purpose: the view stays clear)
//   W+I    The Final Word: one huge 閉 is written across the sky stroke by stroke and stamped with her seal before it
//          falls; on the finishing blow (js/ult-grand.js) it comes down on the target with the seal, on an impact frame
// SW.isaInk.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !PX.over || !Proj || !CASTS.ink_bolt || !CASTS.seal_circle) return;
  const IK = SW.isaInk = { on: true };
  const isI = g => !!(IK.on && g && g.state && g.state.hero === 'isa');
  const PI = Math.PI, Vis = N.Vis, part = N.part, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // sumi ink, its wet sheen, vermilion and crimson, paper
  const PAL = ['#0d0d18', '#1b1b2f', '#34344f', '#5a1020', '#b0182e', '#e0303a', '#ef476f', '#ff8fa8', '#ffe3ea', '#ffffff'];
  const C = { ink: PAL[0], ink1: PAL[1], sheen: PAL[2], blood: PAL[3], verm: PAL[4], verm2: PAL[5], crim: PAL[6], pink: PAL[7], paper: PAL[8], w: PAL[9] };
  const RIM = '#ef476f';   // the crimson rim round her ink
  const FONT = s => '900 ' + s + 'px "KaiTi", "STKaiti", "Kaiti SC", "Noto Serif CJK SC", "Noto Serif SC", "Songti SC", "SimSun", "Microsoft YaHei", serif';
  const WORDS = ['封', '爆', '止', '縛', '禁'];

  // ---------- a written character: (x, y) its centre, s its size in pixels; o = { col, rim, a, mono, reveal 0-1 (written top to bottom), rot } ----------
  function word(ctx, x, y, s, ch, o) {
    o = o || {};
    const box = Math.ceil(s * 1.5) + 6;
    PX.sprite(ctx, x, y, box, box, c => {
      if (o.rot) c.rotate(o.rot);
      if (o.reveal !== undefined && o.reveal < 1) { c.beginPath(); c.rect(-box, -s * 0.6, box * 2, s * 1.2 * clamp01(o.reveal)); c.clip(); }
      c.font = FONT(Math.round(s)); c.textAlign = 'center'; c.textBaseline = 'middle';
      if (s >= 18 && !o.mono) { const d = Math.max(1, Math.round(s / 40)); c.fillStyle = (o.col || C.ink) === C.ink ? C.sheen : C.pink; c.fillText(ch, -d, s * 0.04 - d); }   // the wet edge, catching the light
      c.fillStyle = o.col || C.ink; c.fillText(ch, 0, s * 0.04);
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: o.rim || RIM, clean: false, keepThin: true });
  }
  IK.word = word;
  // ---------- a brush stroke along points pts (screen): w its widest; thick at the start, tapering; dry streaks at the tail ----------
  function stroke(ctx, pts, w, o) {
    o = o || {};
    if (pts.length < 2) return;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(q => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, n = pts.length;
    PX.sprite(ctx, cx, cy, x1 - x0 + w * 2 + 6, y1 - y0 + w * 2 + 6, c => {
      for (let i = 0; i < n - 1; i++) {
        const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
        const u0 = i / (n - 1), u1 = (i + 1) / (n - 1), wf = u => w * (o.even ? 0.8 : Math.min(1, 0.55 + u * 4) * (1 - u * 0.85)) / 2, w0 = wf(u0), w1 = wf(u1);
        c.beginPath(); c.moveTo(a[0] - cx + nx * w0, a[1] - cy + ny * w0); c.lineTo(b[0] - cx + nx * w1, b[1] - cy + ny * w1); c.lineTo(b[0] - cx - nx * w1, b[1] - cy - ny * w1); c.lineTo(a[0] - cx - nx * w0, a[1] - cy - ny * w0); c.closePath();
        c.fillStyle = o.col || C.ink; c.fill();
        if (u0 < 0.5 && !o.flat) { c.strokeStyle = C.sheen; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0] - cx + nx * w0 * 0.45, a[1] - cy + ny * w0 * 0.45); c.lineTo(b[0] - cx + nx * w1 * 0.45, b[1] - cy + ny * w1 * 0.45); c.stroke(); }   // the wet sheen
        if (u0 > 0.55 && !o.even) { c.globalCompositeOperation = 'destination-out'; c.lineWidth = 1; for (let k = -1; k <= 1; k += 2) { c.beginPath(); c.moveTo(a[0] - cx + nx * w0 * 0.35 * k, a[1] - cy + ny * w0 * 0.35 * k); c.lineTo(b[0] - cx + nx * w1 * 0.35 * k, b[1] - cy + ny * w1 * 0.35 * k); c.stroke(); } c.globalCompositeOperation = 'source-over'; }   // dry-brush streaks
      }
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: o.rim || RIM, keepThin: true });
  }
  IK.stroke = stroke;
  const arc = (x, y, r, a0, a1, n, sq) => { const pts = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r * (sq || 1)]); } return pts; };
  function splash(z, x, y, n, sp) { for (let i = 0; i < n; i++) part(x + rand(-3, 3), y + rand(-3, 3), i % 4 ? C.ink : C.crim, rand(-sp, sp), rand(-sp, sp * 0.5), 16 + (i % 6), 2, 0.18); }
  function seal(ctx, x, y, s, o) {   // a vermilion seal: a square, a white border, 封 cut into it
    o = o || {};
    PX.sprite(ctx, x, y, s * 1.6, s * 1.6, c => {
      if (o.rot) c.rotate(o.rot);
      c.fillStyle = C.verm; c.fillRect(-s / 2, -s / 2, s, s);
      c.strokeStyle = C.paper; c.lineWidth = Math.max(1, s * 0.07); c.strokeRect(-s / 2 + s * 0.12, -s / 2 + s * 0.12, s * 0.76, s * 0.76);
      c.font = FONT(Math.round(s * 0.62)); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = C.paper; c.fillText('封', 0, s * 0.03);
    }, { pal: PAL, alpha: o.a, mono: o.mono, outline: C.blood, clean: false, keepThin: true });
  }
  IK.seal = seal;

  // ================= dressing what she makes: the ink bolt, the glyphs on the floor, the living script =================
  let wi = 0;
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.isGlyph && s.p === p) {
        if (!s.isa) { s.isa = 1; s.ch = WORDS[(wi++) % 3]; s.render = (ctx, sx, sy, t) => { const a = Math.min(1, t / 10, (600 - t) / 30), pulse = 0.5 + 0.5 * Math.sin(t * 0.12); ctx.save(); ctx.globalAlpha = a * (0.35 + 0.35 * pulse); art.rect(ctx, C.crim, sx - 8, sy - 1, 16, 1); ctx.restore(); word(ctx, sx, sy - 8, 13, s.ch, { a, rim: pulse > 0.75 ? C.pink : RIM }); }; }
        if (s.done && !s.isaBurst) { s.isaBurst = 1; const ch = s.ch; z.shots.push(new Vis(s.x, s.y, 16, (ctx, sx, sy, t) => { const k = t / 16; word(ctx, sx, sy - 10 - k * 18, 13 + ease(k) * 14, ch, { col: C.crim, rim: C.paper, a: 1 - ease((k - 0.4) / 0.6) }); })); }
        return;
      }
      if (s.isa) return;
      if (s instanceof Proj && s.w === 12 && s.h === 10 && s.life === 40 && s.team !== 'enemy') {   // the ink bolt
        s.isa = 1;
        s.render = (ctx, x, y, q) => {
          const d = Math.sign(q.vx) || 1, sp = Math.hypot(q.vx, q.vy) || 1, ux = q.vx / sp, uy = q.vy / sp, pts = [];
          for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([x - ux * u * 26 + -uy * Math.sin(u * 3 + q.t * 0.5) * 2, y - uy * u * 26 + ux * Math.sin(u * 3 + q.t * 0.5) * 2]); }
          stroke(ctx, pts, 9, {});
          if (q.t % 3 === 0) art.rect(ctx, C.ink, Math.round(x - ux * 30 + rand(-3, 3)), Math.round(y - uy * 30 + rand(-3, 3)), 1, 1);   // spatter
          void d;
        };
        const _end = s.onEnd;
        s.onEnd = function (g, zz, impact) {
          if (zz && zz.shots) { const ex = this.x, ey = this.y; zz.shots.push(new Vis(ex, ey, 12, (ctx, sx, sy, t) => { const k = t / 12; for (let i = 0; i < 7; i++) { const a = i / 7 * PI * 2 + 0.4, L = 4 + ease(k) * (8 + (i % 3) * 4); stroke(ctx, [[sx, sy], [sx + Math.cos(a) * L, sy + Math.sin(a) * L]], 4, { a: 1 - ease((k - 0.5) / 0.5), flat: true }); } })); }
          return _end ? _end.apply(this, arguments) : undefined;
        };
      }
    });
  }

  // ================= U: Ink Bolt =================
  const _ib = CASTS.ink_bolt;
  CASTS.ink_bolt = function (p, z) { const r = _ib.apply(this, arguments); if (isI(G)) dress(p, z); return r; };

  // ================= S+U: Brush Stroke: one great tapering crescent =================
  const _bs = CASTS.brush_stroke;
  CASTS.brush_stroke = function (p, z) {
    const n0 = z.shots.length, r = _bs.apply(this, arguments);
    if (!isI(G)) return r;
    dress(p, z);
    const dir = p.face, v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 16 && s.render && !s.isGlyph);
    if (v) v.render = (ctx, x, y, t) => {
      const k = Math.min(1, 0.45 + t / 6), a = Math.min(1, (16 - t) / 6), a1 = -1.2 + 2.4 * k;   // already half drawn on the hit frame
      const pts = arc(0, 0, 46, -1.2, a1, 18).map(q => [x + dir * (8 + q[0]), y - 20 + q[1]]);
      stroke(ctx, pts, 16, { a });
      if (t < 8) { const tip = pts[pts.length - 1]; art.rect(ctx, C.ink, Math.round(tip[0] + dir * 3), Math.round(tip[1] + 2), 2, 2); art.rect(ctx, C.crim, Math.round(tip[0] + dir * 6), Math.round(tip[1] - 2), 1, 1); }
    };
    return r;
  };

  // ================= I: Seal Circle =================
  const _sc = CASTS.seal_circle;
  CASTS.seal_circle = function (p, z) {
    const n0 = z.shots.length, r = _sc.apply(this, arguments);
    if (!isI(G)) return r;
    dress(p, z);
    const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 60 && s.render && !s.isGlyph);
    if (v) v.render = (ctx, sx, sy, t) => {
      const k = ease(t / 14), a = t > 52 ? (60 - t) / 8 : 1;
      if (k > 0.05) { const pts = arc(sx, sy - 2, 32, -PI / 2, -PI / 2 + PI * 2 * k, 26, 0.24); stroke(ctx, pts, 4, { even: true, flat: true, a }); }   // the ring, brushed round
      seal(ctx, sx, sy - 3 - (t >= 14 && t < 18 ? (18 - t) * 2 : 0), 12, { a: t < 14 ? 0 : a, rot: 0.08 });   // stamped
      if (t >= 18 && t < 52) for (let i = -2; i <= 2; i++) {   // awake: columns of rising ink, each wave
        const wave = Math.floor((t - 18) / 9), q = ((t - 18) % 9) / 9, hh = Math.round((30 + Math.abs(Math.sin(wave + i)) * 20) * ease(Math.min(1, q * 3))), cx = sx + i * 11;
        stroke(ctx, [[cx, sy - 2], [cx + Math.sin(i + t * 0.3) * 2, sy - hh * 0.5], [cx - Math.sin(i) * 2, sy - hh]], 7, { a: a * (1 - Math.max(0, q - 0.7) / 0.3) });
        if (q < 0.5 && i % 2 === 0) word(ctx, cx, sy - hh - 6, 9, WORDS[(wave + i + 5) % WORDS.length], { col: C.crim, rim: C.ink, a });
      }
    };
    return r;
  };

  // ================= S+I: Binding Script =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.isa;
  if (BU && BU.cast) {
    const _bd = BU.cast;
    BU.cast = function (p, z) {
      const n0 = z.shots.length, r = _bd.apply(this, arguments);
      if (!isI(G)) return r;
      const v = z.shots.slice(n0).find(s => s instanceof Vis && s.life === 60 && s.render);
      const CH = ['縛', '封', '止', '禁', '縛', '封', '止', '禁'];
      if (v) v.render = (ctx, x, y, t) => {
        const order = [];
        for (let i = 0; i < 8; i++) { const ang = t * 0.15 + i * 0.785, burstAt = 30 + Math.floor(i / 2) * 8; order.push({ i, ang, front: Math.sin(ang) > 0, burstAt }); }
        order.sort((a, b) => a.front - b.front);   // the far side first
        order.forEach(o => {
          const lx = x + Math.cos(o.ang) * 20, ly = y - 20 + Math.sin(o.ang) * 7 - o.i * 3 + 10, k = t - o.burstAt;
          if (k < 0) word(ctx, Math.round(lx), Math.round(ly), 9, CH[o.i], { col: o.front ? C.ink : C.ink1, rim: o.front ? RIM : C.blood, a: Math.min(1, t / 6) });
          else if (k < 8) { word(ctx, Math.round(lx), Math.round(ly - k), 9 + k * 1.5, CH[o.i], { col: C.crim, rim: C.paper, a: 1 - k / 8 }); }
        });
        if (t < 26) { const pts = arc(x, y - 18, 22, t * 0.15, t * 0.15 + PI * 1.4, 16, 0.32); stroke(ctx, pts, 3, { even: true, flat: true, a: 0.85 }); }   // the line of script, still wet
      };
      return r;
    };
  }

  // ================= W+O: Living Script: characters on legs of ink =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.isa;
  if (SIG && SIG.cast) {
    const _ls = SIG.cast;
    SIG.cast = function (p, z) {
      const n0 = z.shots.length, r = _ls.apply(this, arguments);
      if (!isI(G)) return r;
      z.shots.slice(n0).forEach((s, i) => {
        if (!s.paint) return;
        const ch = ['爆', '走', '爆', '走'][i % 4];
        s.paint = (ctx, x, y, q) => {
          const d = q.dir || 1, ph = q.t * 0.7 + i;
          for (let k = 0; k < 3; k++) { const fx2 = x - 5 + k * 5, lift = Math.sin(ph + k * 2) > 0 ? 2 : 0; art.line(ctx, C.ink, fx2, y - 6, fx2 - d * 2 + (k - 1) * 2, y - lift, 1); }   // legs of ink, scuttling
          word(ctx, x, y - 12 + (Math.sin(ph * 2) > 0 ? -1 : 0), 12, ch, { col: i % 2 ? C.crim : C.ink, rim: i % 2 ? C.ink : RIM });
        };
      });
      return r;
    };
  }

  // ================= her combo, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk')) {   // a brush stroke through every hit
      const k = p.st - a.hitAt, set = p.comboSet ? p.comboSet() : null, last = !!(set && a === set[set.length - 1]);
      if (k >= -1 && k < 7) {
        const hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), reach = a.box ? a.box[0] + a.box[2] : 26, q = Math.min(1, 0.4 + (k + 1) / 3), up = (a.ky || 0) < -2;
        const a0 = up ? 0.9 : -0.9, a1 = a0 + (up ? -1.8 : 1.8) * q;
        const pts = arc(0, 0, reach * 0.75, a0, a1, 10).map(pt => [sx + d * (6 + pt[0]), hy + pt[1] * 0.7]);
        stroke(ctx, pts, last ? 10 : 8, { col: C.crim, rim: C.ink, a: k < 4 ? 1 : 1 - (k - 4) / 3 });   // crimson, so it reads on a dark arena
      }
      if (last && k >= 0 && k < 14) {   // the last hit: a blot with a character in it
        const bx = sx + d * (reach0(a) + 4), by = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), q = k / 14;
        for (let i = 0; i < 8; i++) { const ang = i / 8 * PI * 2, L = 6 + ease(Math.min(1, k / 3)) * (6 + (i % 3) * 3); stroke(ctx, [[bx, by], [bx + Math.cos(ang) * L, by + Math.sin(ang) * L * 0.8]], 5, { col: C.verm, rim: C.ink, a: 1 - ease((q - 0.5) / 0.5), flat: true }); }
        word(ctx, bx, by, 13, '止', { col: C.ink, rim: C.paper, a: 1 - ease((q - 0.6) / 0.4) });
      }
    }
    if (p.modeT > 0) {   // Wet Ink: drips fall from her brush hand
      const fade = Math.min(1, p.modeT / 30);
      ctx.save(); ctx.globalAlpha = fade;
      for (let i = 0; i < 3; i++) { const u = ((p.t * 0.03 + i * 0.34) % 1), x = sx + d * (9 + i), y = sy - 20 + u * 20; art.rect(ctx, C.ink, Math.round(x), Math.round(y), 1, 2 + (i % 2)); if (i === 0) art.rect(ctx, C.crim, Math.round(x), Math.round(y) - 1, 1, 1); }
      ctx.restore();
    }
    if (p.awakeT > 0) {   // Grand Script: three small crimson characters circle her
      const fade = Math.min(1, p.awakeT / 30);
      for (let i = 0; i < 3; i++) { const u = p.t * 0.05 + i * 2.09; if (Math.sin(u) < -0.2) continue; word(ctx, Math.round(sx + Math.cos(u) * 14), Math.round(sy - 18 + Math.sin(u) * 4), 7, ['封', '止', '禁'][i], { col: C.crim, rim: C.blood, a: fade * 0.9 }); }
    }
  }
  const reach0 = a => (a.box ? a.box[0] + a.box[2] * 0.8 : 22);
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isI(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isI(g || this.G) && z && z.shots) dress(this, z); return r; };

  // ================= W+I: The Final Word =================
  const ULT = N.ULT;
  const _fw = ULT && ULT.final_word;
  if (_fw) ULT.final_word = function (p, z, foes) {
    const n0 = z.shots.length, r = _fw.apply(this, arguments);
    if (!isI(G)) return r;
    z.shots.slice(n0).forEach(v => {   // the word across the sky: written stroke by stroke, sealed, then it falls
      if (!(v instanceof Vis) || v.life !== 62 || !v.render) return;
      v._ugS = 1;
      v.render = (ctx, x, y, t) => {
        const k = Math.min(1, t / 26), fall = t > 44 ? (t - 44) * 12 : 0, cx = W / 2, cy = 58 + fall;
        word(ctx, cx, cy, 92, '閉', { reveal: k, rim: RIM });
        if (k < 1) { const by = cy - 46 + 92 * k; art.rect(ctx, C.ink, cx - 20 + Math.round(Math.sin(t * 1.3) * 18), Math.round(by) - 2, 4, 4); }   // the brush tip, writing
        if (t >= 27) seal(ctx, cx + 46, cy + 30 - (t < 31 ? (31 - t) * 4 : 0), 20, { rot: -0.1 });
      };
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): the word hangs over the target, then comes down on it with the seal
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('isa') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const draw = (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const cy = sy - 24;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 12), drop = ease((st - (FIN - 4)) / 4);
        word(ctx, sx, cy - 14 + drop * 10, 64, '閉', { reveal: k, a: Math.min(1, k * 1.5) });
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, mono = ik < 0.5 ? '#ffffff' : undefined;
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 61);
        word(ctx, sx, cy - 4, 64, '閉', { mono, a: 1 - ease((k - 0.55) / 0.45) });
        seal(ctx, sx + 22, cy + 16, 22, { rot: -0.1, mono, a: 1 - ease((k - 0.65) / 0.35) });
        if (st === FIN && !splashed) { splashed = true; splash(z, T.x, T.y - 20, 26, 4); }
      }
    };
    let splashed = false;
    // on the top layer: js/ult-grand.js draws its own dark sphere over the target, and the word must be seen over it
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    const t0o = SW.frame, live = () => G.player === p || !!(SW.versus && SW.versus.f && SW.versus.f.some(f => f && f.p === p));   // (a match quit or reset mid-ultimate leaves the old fighter in 'ult' for ever: stop with it)
    PX.over((ctx, cam) => { if (v.gone || p.state !== 'ult' || SW.frame - t0o > 400 || !live()) return false; draw(ctx, Math.round(v.x - cam.x), Math.round(v.y - cam.y)); });
  }
})();
