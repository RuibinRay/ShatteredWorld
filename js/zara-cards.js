'use strict';
// Shattered Worlds — Zara's deck (2026-11-20, the hero-look rework: cool, not cute). Her story: the Deepline card sharp
// who owns the House Edge; "every fight is a game of chance. She stacked the deck." Her cards were 7x9 white boxes with
// a red dot. They are now real cards, drawn as crisp pixel art by js/pixel-kit.js: ivory faces edged in gold with a pixel
// rank and suit (red or black), backs of deep casino red with a gold lattice and a gold diamond, spinning edge-on as
// they fly. The card every skill draws (her trait) is the card she throws. Draw-only: every hit, hitbox and timing stays
// as it was. Loaded after js/brann-bear.js.
//   U      Card Toss: three spinning cards showing the card she drew, gold streaks behind
//   S+U    Shuffle Step: a riffle of cards arcs between where she was and where she lands; the cards left on the floor
//          stand on edge, red backs out, and glint
//   I      House of Cards: a tower of cards stacks itself on the foe, then falls on them a level at a time; the last
//          fall is an impact frame
//   S+I    Royal Flush: a fan of 10-J-Q-K-A opens in her hand, and those five cards fly in order
//   W+O    Wild Card: a giant card turns face-up showing the fire, the ice or the heart it drew, then shatters
//   J      her combo: a fan of three cards slashes on every hit; the finisher flicks a card
//   S+O    Hot Streak: stacks of chips grow at her heel     O  High Roller: her hat-band burns gold, three small cards
//          circle her hat (small on purpose: the view stays clear)
//   W+I    All In: giant cards slam down on every foe; on the finishing blow (js/ult-grand.js) a huge card comes down
//          face-down over the target, turns over to the ten - JACKPOT - and slams on an impact frame
//   (trait) the card over her head is a real card with its rank
// SW.zaraCards.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, CASTS = SW.casts, Proj = SW.Proj;
  if (!N || !P || !CASTS || !PX || !PX.impact || !Proj || !CASTS.card_toss || !CASTS.house_of_cards) return;
  const ZC = SW.zaraCards = { on: true };
  const isZ = g => !!(ZC.on && g && g.state && g.state.hero === 'zara');
  const PI = Math.PI, Vis = N.Vis, part = N.part;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };

  // casino: near-black, wine to scarlet, old gold to pale gold, ivory and white; the wild card's fire and ice
  const PAL = ['#14060a', '#3a0a14', '#7a0a1a', '#b01a2a', '#e63946', '#8a6410', '#d4a017', '#ffd166', '#fff3c4', '#f8f4e8', '#ffffff', '#1a1a1a', '#ff7a1a', '#ffd04a', '#4aa8d8', '#bfefff'];
  const PALC = PAL.slice(0, 12);   // a plain card's palette: no fire or ice to snap its reds to orange
  const C = { out: PAL[0], wine: PAL[1], red: PAL[2], red2: PAL[3], scar: PAL[4], gold0: PAL[5], gold: PAL[6], gold2: PAL[7], pale: PAL[8], ivory: PAL[9], w: PAL[10], ink: PAL[11], fire: PAL[12], fire2: PAL[13], ice: PAL[14], ice2: PAL[15] };
  // pixel glyphs: ranks 3x5 (the 10 is 5x5), suits 5x5 and 3x3
  const GL = { A: ['010', '101', '111', '101', '101'], 2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '011', '001', '111'], 4: ['101', '101', '111', '001', '001'],
    5: ['111', '100', '111', '001', '111'], 6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '010', '010', '010'], 8: ['111', '101', '111', '101', '111'],
    9: ['111', '101', '111', '001', '111'], 10: ['10111', '10101', '10101', '10101', '10111'], J: ['001', '001', '001', '101', '111'], Q: ['010', '101', '101', '111', '011'], K: ['101', '101', '110', '101', '101'] };
  const SUIT = [['00100', '01110', '11111', '00100', '01110'], ['01010', '11111', '11111', '01110', '00100'], ['00100', '01110', '11111', '01110', '00100'], ['01110', '01110', '11111', '00100', '01110']];   // spade, heart, diamond, club
  const SUIT3 = [['010', '111', '010'], ['101', '111', '010'], ['010', '111', '010'], ['111', '111', '010']];
  const RANKS = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const glyph = (c, rows, x, y, g, col) => { c.fillStyle = col; rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '1') c.fillRect(x + i * g, y + j * g, g, g); }); };

  // ---------- one card, centred on (0, 0): w x h; o = { face, rank, suit 0-3, jack (the jackpot ten, in gold), emblem 'fire'|'ice'|'heart' } ----------
  function cardVec(c, w, h, o) {
    const x0 = Math.round(-w / 2), y0 = Math.round(-h / 2), g = w >= 22 ? 2 : 1;
    c.fillStyle = C.gold; c.fillRect(x0, y0, w, h);   // the gold edge
    if (!o.face) {   // the back: casino red, a gold lattice, a gold diamond
      c.fillStyle = C.red; c.fillRect(x0 + 1, y0 + 1, w - 2, h - 2);
      c.fillStyle = C.red2; for (let j = 2; j < h - 2; j += 3) for (let i = 2 + (j % 2); i < w - 2; i += 3) c.fillRect(x0 + i, y0 + j, 1, 1);
      if (w >= 9) glyph(c, SUIT[2], -Math.round(2.5 * g), -Math.round(2.5 * g), g, C.gold2);
      return;
    }
    c.fillStyle = o.jack ? C.gold2 : C.ivory; c.fillRect(x0 + 1, y0 + 1, w - 2, h - 2);
    if (o.emblem) { emblem(c, o.emblem, w, h); return; }
    const red = o.suit === 1 || o.suit === 2, ink = o.jack ? C.red : red ? C.scar : C.ink, rk = GL[o.rank] || GL.A, s = o.suit || 0;
    if (o.plain) { glyph(c, SUIT[s], -2, -2, 1, ink); return; }   // tilted and small: a 1-pixel rank would not survive the turn, so only the suit
    glyph(c, rk, x0 + 2, y0 + 2, g, ink);
    if (w >= 12) { glyph(c, SUIT3[s], x0 + 2, y0 + 3 + 5 * g, g, ink); glyph(c, SUIT[s], -Math.round(2.5 * g * 1.5), -Math.round(2.5 * g * 1.5) + g, Math.round(g * 1.5) || 1, ink); }
    else glyph(c, SUIT3[s], x0 + w - 5, y0 + h - 5, 1, ink);
    if (w >= 12 && (o.rank === 'J' || o.rank === 'Q' || o.rank === 'K')) { c.fillStyle = C.gold; c.fillRect(-3 * g, y0 + 2 * g + 1, 6 * g, g); for (let i = 0; i < 3; i++) c.fillRect(-3 * g + i * 2 * g + (i === 2 ? g : 0), y0 + g + 1, g, g); }   // a small gold crown on the royals
  }
  function emblem(c, kind, w, h) {   // the wild card's face
    const s = Math.min(w, h) * 0.42;
    if (kind === 'heart') { c.fillStyle = C.scar; c.beginPath(); c.moveTo(0, s * 0.9); c.bezierCurveTo(-s * 1.4, -s * 0.1, -s * 0.6, -s * 1.1, 0, -s * 0.4); c.bezierCurveTo(s * 0.6, -s * 1.1, s * 1.4, -s * 0.1, 0, s * 0.9); c.fill(); c.fillStyle = C.w; c.fillRect(-s * 0.55, -s * 0.5, Math.max(1, s * 0.2), Math.max(1, s * 0.2)); return; }
    if (kind === 'fire') {
      const fl = (sc, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, s * sc); c.bezierCurveTo(-s * sc, s * sc * 0.6, -s * sc * 0.8, -s * sc * 0.2, -s * sc * 0.2, -s * sc * 1.1); c.bezierCurveTo(-s * sc * 0.1, -s * sc * 0.5, s * sc * 0.3, -s * sc * 0.6, s * sc * 0.25, -s * sc * 1.2); c.bezierCurveTo(s * sc * 0.9, -s * sc * 0.4, s * sc, s * sc * 0.5, 0, s * sc); c.fill(); };
      fl(1, C.red2); fl(0.72, C.fire); fl(0.42, C.fire2); return;
    }
    c.strokeStyle = C.ice; c.lineWidth = Math.max(1, s * 0.16); c.lineCap = 'square';   // ice: a snowflake
    for (let i = 0; i < 3; i++) { const a = i * PI / 3; c.beginPath(); c.moveTo(Math.cos(a) * s, Math.sin(a) * s); c.lineTo(-Math.cos(a) * s, -Math.sin(a) * s); c.stroke(); }
    c.strokeStyle = C.ice2; c.lineWidth = Math.max(1, s * 0.08);
    for (let i = 0; i < 6; i++) { const a = i * PI / 3, bx = Math.cos(a) * s * 0.6, by = Math.sin(a) * s * 0.6; for (const d of [-0.6, 0.6]) { c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(a + d) * s * 0.3, by + Math.sin(a + d) * s * 0.3); c.stroke(); } }
  }
  // a card as a crisp sprite: (x, y) its centre; o adds spin (-1..1: the card turned edge-on, the sign picks face or back), rot, a, mono
  function card(ctx, x, y, w, h, o) {
    o = o || {};
    const sp = o.spin === undefined ? 1 : o.spin, face = o.face !== undefined ? o.face && sp >= 0 : sp >= 0, k = Math.max(0.14, Math.abs(sp)), box = Math.ceil(Math.hypot(w, h)) + 4;
    const plain = o.plain || (w < 22 && Math.abs(o.rot || 0) > 0.12);
    PX.sprite(ctx, x, y, box, box, c => { if (o.rot) c.rotate(o.rot); c.scale(k, 1); cardVec(c, w, h, Object.assign({}, o, { face, plain })); }, { pal: o.emblem ? PAL : PALC, alpha: o.a, mono: o.mono, outline: C.out, clean: false });
  }
  ZC.card = card;
  const suitOf = n => (n * 7 + 3) % 4;
  const glint = (ctx, x, y, k) => { if (k <= 0 || k >= 1) return; const L = Math.round(5 * Math.sin(k * PI)); ctx.save(); art.rect(ctx, C.w, x - L, y, L * 2 + 1, 1); art.rect(ctx, C.w, x, y - L, 1, L * 2 + 1); ctx.restore(); };
  function streak(ctx, x, y, vx, vy, n, col) {   // a gold streak behind a flying card
    const sp = Math.hypot(vx, vy) || 1, ux = vx / sp, uy = vy / sp;
    for (let i = 1; i <= n; i++) { ctx.globalAlpha = 0.7 * (1 - i / (n + 1)); art.rect(ctx, i % 2 ? col : C.w, Math.round(x - ux * i * 2.2), Math.round(y - uy * i * 2.2), 1, 1); }
    ctx.globalAlpha = 1;
  }
  function flying(ctx, x, y, q, rank, suit, w, h) {
    const d = q.vx >= 0 ? 1 : -1, spin = Math.cos(q.t * 0.55 + (q.zseed || 0));
    ctx.save(); streak(ctx, x, y, q.vx, q.vy, 6, C.gold2); ctx.restore();
    card(ctx, x, y, w, h, { rank, suit, spin, rot: Math.abs(q.vy) > 2 ? SW.clamp(Math.atan2(q.vy, Math.abs(q.vx)) * d, -0.6, 0.6) : 0 });   // level while it flies flat, so the rank reads
  }
  function cutMark(z, x, y, ang) {   // where a card lands: a thin gold cut and sparks
    z.shots.push(new Vis(x, y, 8, (ctx, sx, sy, t) => { ctx.save(); ctx.globalAlpha = 1 - t / 8; const ca = Math.cos(ang), sa = Math.sin(ang), L = 9; art.line(ctx, C.gold2, Math.round(sx - ca * L), Math.round(sy - sa * L), Math.round(sx + ca * L), Math.round(sy + sa * L), 1); art.line(ctx, C.w, Math.round(sx - ca * L * 0.5), Math.round(sy - sa * L * 0.5), Math.round(sx + ca * L * 0.5), Math.round(sy + sa * L * 0.5), 1); ctx.restore(); }));
    for (let i = 0; i < 4; i++) part(x, y, i % 2 ? C.gold2 : C.w, rand(-2, 2), rand(-2, 1), 12, 1, 0.1);
  }

  // ================= every card she throws: dressed as it appears =================
  // Card Toss: 3 cards (life 34); Royal Flush: 5 (life 70, ghost); the finisher: 1 (life 22). All are 10x10 Projs.
  let royal = 0;
  function dress(p, z) {
    z.shots.forEach(s => {
      if (s.zara || !(s instanceof Proj) || s.w !== 10 || s.h !== 10 || s.team === 'enemy') return;
      s.zara = 1; s.zseed = rand(0, 6);
      let rank, suit, w = 9, h = 13;
      if (s.life === 70 && s.ghost) { rank = ['10', 'J', 'Q', 'K', 'A'][royal % 5]; royal++; suit = 1; w = 11; h = 15; }
      else if (s.life === 22) { rank = 'A'; suit = 0; w = 11; h = 15; }
      else { const v = p.card || 1; rank = RANKS[v - 1]; suit = suitOf(v); }
      if (rank === '10') rank = 10;
      s.render = (ctx, x, y, q) => flying(ctx, x, y, q, rank, suit, w, h);
      const _end = s.onEnd;
      s.onEnd = function (g, zz, impact) { if (impact && zz && zz.shots) cutMark(zz, this.x, this.y, Math.atan2(this.vy, this.vx) + 0.8); return _end ? _end.apply(this, arguments) : undefined; };
    });
  }

  // ================= U: Card Toss =================
  const _ct = CASTS.card_toss;
  CASTS.card_toss = function (p, z) { const r = _ct.apply(this, arguments); if (isZ(G)) dress(p, z); return r; };

  // ================= S+U: Shuffle Step: a riffle between where she was and where she lands =================
  const _ss = CASTS.shuffle_step;
  CASTS.shuffle_step = function (p, z) {
    const x0 = p.x, y0 = p.y, n0 = z.shots.length, r = _ss.apply(this, arguments);
    if (!isZ(G)) return r;
    const x1 = p.x, dir = x1 >= x0 ? 1 : -1;
    z.shots.push(new Vis(x0, y0, 16, (ctx, sx, sy, t) => {
      const span = (x1 - x0), k = t / 16;
      for (let i = 0; i < 9; i++) {   // the riffle: cards cascade in an arc from one end to the other
        const u = clamp01(k * 1.6 - i * 0.07); if (u <= 0 || u >= 1) continue;
        const x = sx + span * u, y = sy - 22 - Math.sin(u * PI) * 18 - (i % 2) * 3;
        card(ctx, Math.round(x), Math.round(y), 8, 12, { face: i % 2 === 0, rank: RANKS[(i * 3) % 10], suit: i % 4, spin: Math.cos(u * PI * 3 + i), a: 1 - Math.max(0, k - 0.75) / 0.25 });
      }
      if (t < 8) PX.lines(ctx, sx + span / 2, sy - 22, dir > 0 ? 0 : PI, Math.abs(span) * 0.6 + 10, 6, t, C.gold2, 26);
    }));
    z.shots.slice(n0).forEach(v => {   // the two cards left on the floor: on edge, red backs out, glinting
      if (!(v instanceof Vis) || v.life !== 300) return;
      v.render = (ctx, sx, sy, t) => { const bob = t % 30 < 15 ? 0 : 1; card(ctx, sx, sy - 1 + bob, 9, 13, { face: false, rot: 0.12 * Math.sin(t * 0.05) }); if (t % 40 < 8) glint(ctx, sx + 3, sy - 5, (t % 40) / 8); };
    });
    return r;
  };

  // ================= I: House of Cards =================
  const _hc = CASTS.house_of_cards;
  CASTS.house_of_cards = function (p, z) {
    const e = isZ(G) ? N.ahead(p, z, 220) : null, x0 = e ? e.x : p.x + p.face * 90, r = _hc.apply(this, arguments);
    if (!isZ(G)) return r;
    const gy = N.floorY ? N.floorY(z, x0, p.y - 20) : p.y, LV = [4, 3, 2, 1], CW = 11, CH = 16, LH = 15;
    const falls = [];   // cards knocked off the tower: { x, y, vx, vy, rot, vr, rank, suit, face, t0 }
    const v = new Vis(x0, gy, 52, (ctx, sx, sy, t) => {
      const gone = Math.min(4, Math.max(0, Math.floor((t - 8) / 8) + 1));   // levels fallen so far (top first)
      const build = ease(t / 7), lit = LV.length - gone;
      if (lit > 0) PX.sprite(ctx, sx, sy - 34, 70, 80, c => {
        c.translate(0, 34);
        for (let L = 0; L < lit; L++) {
          if (build < (L + 1) / LV.length - 0.2) break;   // it stacks itself, bottom to top
          const n = LV[L], y = -L * LH - CH / 2;
          for (let i = 0; i < n; i++) {
            const cx = (i - (n - 1) / 2) * CW * 1.15;
            c.save(); c.translate(cx - 3, y); c.rotate(-0.33); cardVec(c, CW, CH, { face: (i + L) % 2 === 0, rank: RANKS[(i + L * 3) % 10], suit: (i + L) % 4 }); c.restore();
            c.save(); c.translate(cx + 3, y); c.rotate(0.33); cardVec(c, CW, CH, { face: (i + L) % 2 === 1, rank: RANKS[(i * 2 + L) % 10], suit: (i + L + 1) % 4 }); c.restore();
            if (L < lit - 1 && i < n - 1) { c.save(); c.translate(cx + CW * 0.58, y - CH / 2 - 0.5); c.fillStyle = C.gold; c.fillRect(-CW * 0.5, -1, CW, 2); c.restore(); }   // the flat card laid across
          }
        }
      }, { pal: PAL, outline: C.out, clean: false });
      falls.forEach(f => { const k = t - f.t0; if (k < 0 || k > 18) return; card(ctx, Math.round(sx + f.x + f.vx * k), Math.round(sy + f.y + f.vy * k + 0.25 * k * k), CW, CH, { face: f.face, rank: f.rank, suit: f.suit, rot: f.rot + f.vr * k, a: 1 - Math.max(0, k - 12) / 6 }); });
      if (gone === 4 && t >= 32 && t < 37) PX.impact(ctx, sx, sy - 30, (t - 32) / 5, 33);   // the last fall
    }, vv => {
      if (e && !e.dead) vv.x = e.x;
      const t = vv.t;
      if (t >= 8 && t <= 32 && (t - 8) % 8 === 0) {   // a level comes down on them
        const L = LV.length - 1 - (t - 8) / 8, n = LV[L], last = L === 0;
        for (let i = 0; i < n * 2; i++) falls.push({ x: (i / 2 - (n - 1) / 2) * CW * 1.15, y: -L * LH - CH / 2, vx: rand(-1.6, 1.6) * (last ? 1.8 : 1), vy: last ? -rand(2, 4) : rand(-1, 0.5), rot: (i % 2 ? 0.33 : -0.33), vr: rand(-0.4, 0.4), rank: RANKS[(i + L) % 10], suit: i % 4, face: i % 2 === 0, t0: t });
      }
    });
    z.shots.push(v);
    return r;
  };

  // ================= S+I: Royal Flush =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.zara;
  if (BU && BU.cast) {
    const _rf = BU.cast;
    BU.cast = function (p, z) {
      royal = 0;
      const r = _rf.apply(this, arguments);
      if (!isZ(G)) return r;
      const dir = p.face, R5 = [10, 'J', 'Q', 'K', 'A'];
      z.shots.push(new Vis(p.x, p.y, 26, (ctx, sx, sy, t) => {   // the fan opens in her hand, and empties a card at a time
        const open = ease(t / 4);
        for (let k = 0; k < 5; k++) {
          if (t >= 1 + k * 5) continue;
          const a = (k - 2) * 0.28 * open;
          card(ctx, Math.round(sx + dir * 12 + Math.sin(a) * 9), Math.round(sy - 30 - Math.cos(a) * 6), 11, 15, { rank: R5[k], suit: 1, rot: a * dir });
        }
      }, v => { v.x = p.x; v.y = p.y; }));
      return r;
    };
  }

  // ================= W+O: Wild Card =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.zara;
  if (SIG && SIG.cast) {
    const _wc = SIG.cast;
    SIG.cast = function (p, z) {
      if (!isZ(G)) return _wc.apply(this, arguments);
      const e = N.ahead(p, z, 200), x = e ? e.x : p.x + p.face * 80, y = (e ? e.y : p.y) - 18;
      let kind = null; const _tx = fx.text;
      fx.text = function (xx, yy, s) { if (/FIRE CARD/.test(s)) kind = 'fire'; else if (/ICE CARD/.test(s)) kind = 'ice'; else if (/HEART CARD/.test(s)) kind = 'heart'; return _tx.apply(this, arguments); };
      let r; try { r = _wc.apply(this, arguments); } finally { fx.text = _tx; }
      if (!kind) return r;
      const at = kind === 'heart' ? p : null;
      z.shots.push(new Vis(at ? p.x : x, at ? p.y - 44 : y - 18, 26, (ctx, sx, sy, t) => {
        const flip = t < 3 ? 0.55 + 0.15 * t : 1, k = (t - 10) / 16, a = 1 - ease(k);   // already face-up on the hit frame (the hit-stop freezes it there), it finishes its turn, holds, then shatters
        if (t < 12) card(ctx, sx, sy - (t < 3 ? (3 - t) * 3 : 0), 24, 34, { emblem: kind, spin: flip, face: true });
        else for (let i = 0; i < 6; i++) { const ang = i / 6 * PI * 2 + 0.3, d = ease(k) * 26; card(ctx, Math.round(sx + Math.cos(ang) * d), Math.round(sy + Math.sin(ang) * d + k * k * 10), 8, 11, { face: i % 2 === 0, emblem: i % 2 === 0 ? kind : null, rank: 'A', suit: 1, rot: ang + k * 3, a }); }
        if (t < 10) glint(ctx, sx + 8, sy - 12, t / 10);
      }, v => { if (at) { v.x = p.x; v.y = p.y - 44; } }));
      return r;
    };
  }

  // ================= her combo, the trait card, and the small auras =================
  function aura(ctx, p, sx, sy) {
    const d = p.face, a = p.atk;
    if (a && (p.state === 'attack' || p.state === 'airatk') && !a.fin) {   // a fan of three cards slashes on every hit
      const k = p.st - a.hitAt;
      if (k >= -1 && k < 6) {
        const reach = a.box ? a.box[0] + a.box[2] * 0.55 : 18, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), sw = ease((k + 1) / 3), fade = k < 3 ? 1 : 1 - (k - 3) / 3;
        for (let i = 0; i < 3; i++) { const ang = (-0.9 + sw * 1.5) + (i - 1) * 0.32; card(ctx, Math.round(sx + d * (6 + reach * 0.6 + Math.cos(ang) * 10)), Math.round(hy + Math.sin(ang) * 10), 8, 12, { rank: RANKS[(i * 4 + 9) % 10], suit: i, rot: d * ang, a: fade }); }
        if (k >= 0) { ctx.save(); ctx.globalAlpha = fade; art.line(ctx, C.gold2, Math.round(sx + d * (reach - 6)), Math.round(hy - 8), Math.round(sx + d * (reach + 10)), Math.round(hy + 6), 1); art.line(ctx, C.w, Math.round(sx + d * (reach - 3)), Math.round(hy - 5), Math.round(sx + d * (reach + 7)), Math.round(hy + 3), 1); ctx.restore(); }
      }
    }
    if (p.modeT > 0) {   // Hot Streak: stacks of chips at her heel
      const fade = Math.min(1, p.modeT / 30), n = 2 + Math.floor(((p.t / 40) % 4));
      ctx.save(); ctx.globalAlpha = fade;
      for (let s = 0; s < 2; s++) for (let i = 0; i < n - s; i++) { const x = sx - d * (12 + s * 7), y = sy - 2 - i * 2; art.rect(ctx, C.out, x - 3, y, 7, 2); art.rect(ctx, (i + s) % 2 ? C.scar : C.gold, x - 3, y - 1, 7, 2); art.rect(ctx, C.w, x - 1, y - 1, 1, 1); }
      ctx.restore();
    }
    if (p.awakeT > 0) {   // High Roller: her hat-band burns gold; three small cards circle the hat
      const fade = Math.min(1, p.awakeT / 30), hy = sy - (p.h || 34) - 2;
      ctx.save(); ctx.globalAlpha = fade * (0.7 + 0.3 * Math.sin(p.t * 0.2)); art.rect(ctx, C.gold2, sx - 4, hy + 3, 9, 1); ctx.restore();
      for (let i = 0; i < 3; i++) { const u = p.t * 0.06 + i * 2.09, x = sx + Math.cos(u) * 11, y = hy - 2 + Math.sin(u) * 3; card(ctx, Math.round(x), Math.round(y), 5, 7, { face: false, spin: Math.cos(u) < 0 ? -0.6 : 0.6 + 0.4 * Math.abs(Math.cos(u)), a: fade }); }
    }
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const r = _pd.apply(this, arguments);
    if (isZ(g || this.G) && !this.dead) aura(ctx, this, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) { const r = _pu.apply(this, arguments); if (isZ(g || this.G) && z && z.shots) dress(this, z); return r; };
  const TR = N.TRAITS && N.TRAITS.luck;
  if (TR && TR.mark) {
    const _mk = TR.mark;
    TR.mark = function (ctx, p, x, y) {
      if (!ZC.on) return _mk.apply(this, arguments);
      if (!(p.cardT > 0)) return;
      const v = p.card || 1, k = p.cardT > 80 ? (90 - p.cardT) / 10 : 1;
      card(ctx, x, y - 54, 11, 15, { rank: RANKS[v - 1], suit: suitOf(v), jack: v === 10, spin: -1 + 2 * ease(k) });
    };
  }

  // ================= W+I: All In =================
  const _ult = N.ULT.all_in;
  if (_ult) N.ULT.all_in = function (p, z, foes) {
    const n0 = z.shots.length, r = _ult.apply(this, arguments);
    if (!isZ(G)) return r;
    z.shots.slice(n0).forEach((v, i) => {   // the giant cards slamming down on each foe
      if (!(v instanceof Vis) || v.life !== 10 || !v.render) return;
      const rk = RANKS[(p.st + i * 3) % 10], su = (p.st + i) % 4;
      v._ugS = 1;
      v.render = (ctx, x, y, t) => { const yy = y + t * 4; card(ctx, x, yy, 18, 26, { rank: rk, suit: su, rot: 0.25 * (1 - t / 10) * (i % 2 ? 1 : -1), a: t > 7 ? 1 - (t - 7) / 3 : 1 }); if (t === 9) for (let j = 0; j < 3; j++) part(x + rand(-8, 8), yy + 12, C.gold2, rand(-2, 2), -rand(0, 2), 12, 1, 0.1); };
    });
    if (p.st === 6) {
      const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (T) finale(p, z, T);
    }
    return r;
  };
  // the finishing blow (js/ult-grand.js): a huge card comes down face-down over the target, turns over to the ten of
  // diamonds in gold - JACKPOT - and slams on an impact frame, gold chips bursting
  function finale(p, z, T) {
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('zara') : null, FIN = pl ? pl.fin : 64, BU2 = pl ? Math.max(74, FIN - 30) : 30;
    const v = new Vis(T.x, T.y, 500, (ctx, sx, sy) => {
      const st = p.st; if (p.state !== 'ult' || st < BU2 - 2 || st > FIN + 18) return;
      const cy = sy - 24;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 10), flip = st < FIN - 8 ? -1 : -1 + 2 * ease((st - (FIN - 8)) / 6), hover = (1 - k) * 60 + Math.sin(st * 0.2) * 2;
        card(ctx, sx, cy - 14 - hover, 40, 58, { face: flip >= 0, rank: 10, suit: 2, jack: true, spin: flip, rot: 0.08 * Math.sin(st * 0.15), a: k });
        if (flip > 0.5 && st % 3 === 0) glint(ctx, sx + 12, cy - 34, 0.5);
      } else {
        const k = (st - FIN) / 18, ik = (st - FIN) / 5, drop = ease(Math.min(1, (st - FIN) / 2));
        if (ik < 1) PX.impact(ctx, sx, cy, ik, 77);
        card(ctx, sx, cy - 14 + drop * 10, 40, 58, { rank: 10, suit: 2, jack: true, a: 1 - ease((k - 0.55) / 0.45), mono: ik < 0.5 ? '#ffffff' : undefined });
        if (st === FIN) for (let i = 0; i < 26; i++) part(T.x + rand(-10, 10), T.y - rand(4, 40), i % 3 ? C.gold2 : C.scar, rand(-4.5, 4.5), -rand(1, 5), 26, 2, 0.16);
      }
    }, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    v._ugS = 1; z.shots.push(v);
  }
})();
