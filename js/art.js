'use strict';
// Shattered Worlds — procedural pixel art: character rigs, creatures, tiles, props, backdrops.
// Every sprite is baked to a canvas at boot. To swap in hand-made art later, replace a sheet in
// SW.art.sheets (same frame size / anim names) or drop PNGs into assets/bg for backdrops.
(function () {
  const SW = window.SW, art = SW.art = { sheets: {}, props: {}, bg: {}, mids: {} };
  const R = Math.PI / 180;

  // ---------- pixel helpers ----------
  function rect(x, col, a, b, w, h) { x.fillStyle = col; x.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h)); }
  function pline(x, col, x0, y0, x1, y1, w) {
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
    x.fillStyle = col;
    for (let i = 0; i <= n; i++) { const t = i / n; x.fillRect(Math.round(x0 + (x1 - x0) * t - w / 2), Math.round(y0 + (y1 - y0) * t - w / 2), w, w); }
  }
  function disc(x, col, cx, cy, r) {
    x.fillStyle = col;
    for (let dy = -r; dy <= r; dy++) { const dx = Math.floor(Math.sqrt(r * r - dy * dy)); x.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1); }
  }
  function ring(x, col, cx, cy, r) {
    x.fillStyle = col;
    const n = Math.max(8, Math.ceil(r * 6.3));
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; x.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 1, 1); }
  }
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((n >> 16) & 255) * f) | 0, g = Math.min(255, ((n >> 8) & 255) * f) | 0, b = Math.min(255, (n & 255) * f) | 0;
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  Object.assign(art, { rect, line: pline, disc, ring, shade });
  art.glow = function (ctx, x, y, r, col, a) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 3; i >= 1; i--) { ctx.globalAlpha = (a || 0.12) * (4 - i) / 3; disc(ctx, col, x, y, Math.round(r * i / 3)); }
    ctx.restore();
  };

  // ---------- head templates (11x10, facing right) ----------
  const HEADS = {
    shaggy: ['....hhhh...', '..hhhhhhhh.', '.hhhhhhhhhh', 'hhhhhhhhhh.', 'Hhmmmmmmmm.', 'HHhssssess.', '.HHssssess.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    braid:  ['...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', '.hhhhhhhhh.', 'Hhhhhsshhh.', 'Hhhsssesss.', 'Hhhsssesss.', 'HHhsssssss.', '.HSsssssss.', '...Sssss...'],
    short:  ['...........', '...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    bald:   ['...........', '...sssss...', '..sssssss..', '.Sssssssss.', '.Sssssssss.', '.Ssssssess.', '.Ssssssess.', '..Sssssssss', '..Sssssmm..', '...Sssss...'],
    mohawk: ['....hhhh...', '...hhhhhh..', '....hhhh...', '...sssss...', '..Sssssss..', '.Sssssesss.', '.Sssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    hood:   ['...hhhhh...', '..hhhhhhhh.', '.hhhhhhhhh.', '.hhhhHHHHh.', '.hhhHSSSSS.', '.hhHSSSgSS.', '.hhHSSSSSS.', '.hhhSSSSSS.', '.hhhhSSSS..', '..hhhhh....'],
    helmet: ['...........', '...hhhhh...', '..hhhhhhhh.', '.hhhhhhhhh.', '.hhhhggggg.', '.Hhhhggggg.', '.Hhhhhhhhh.', '..Hsssssss.', '..Hssssss..', '...Sssss...'],
    bun:    ['.hh........', 'hhhhhhhh...', '.hhhhhhhhh.', '.hhhhhhhhh.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    long:   ['...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhhsssss..', 'hhhsssesss.', 'hhhsssesss.', 'hhHSsssssss', 'hhH.Ssssss.', 'hH..Sssss..'],
    hat:    ['...mmmmm...', '..mmmmmmm..', '..MMMMMMM..', 'mmmmmmmmmmm', '..hsssss...', '..hsssess..', '..Sssssesss', '..Sssswwww.', '..Ssssss...', '...Sssss...'],
    beard:  ['...........', '...sssss...', '..hssssss..', '.hhsssssss.', '.hhsssssss.', '.hhsssesss.', '.hhsssesss.', '..hwwwwwwww', '..wwwwwww..', '...wwwww...'],
    cap:    ['...........', '...mmmmm...', '..mmmmmmm..', '.mmmmmmmmmm', '.hhsssssMMM', '.hssssess..', '.Sssssess..', '..Sssssssss', '..Sssssss..', '...Sssss...'],
    mask:   ['...hhhhh...', '..hhhhhhh..', '.hhhwwwww..', '.hhwwwwwww.', '.hhwwwwwww.', '.hhwwgwgww.', '.hhwwwwwww.', '..hwwWWwww.', '..hhwwwww..', '...hhww....'],
    ninja:  ['...........', '...mmmmm...', '..mmmmmmm..', '.mmmmmmmmm.', '.mmmsssess.', '.Mmmsssess.', '.Mmmmmmmmm.', '..Mmmmmmmmm', '..Mmmmmmm..', '...MMmmm...'],
    feral:  ['...........', '...sssss...', '..sssssss..', '.Sssssssss.', '.Ssssssgss.', '.Sssssssss.', '.SssssSSSSS', '..SsswwwwwS', '..SssSSSSS.', '...Ssss....']
  };

  // ---------- poses ----------
  // P(lean, armF, elbowF, armB, elbowB, legF, kneeF, legB, kneeB, opts)
  // angles in degrees: 0 = hanging down, + = toward facing. opts: air, hy, wp (weapon angle), tr (trail angle)
  const P = (lean, aF, aFe, aB, aBe, lF, lFk, lB, lBk, o) => Object.assign({ lean, aF, aFe, aB, aBe, lF, lFk, lB, lBk }, o || {});
  const mir = p => Object.assign({}, p, { aF: p.aB, aFe: p.aBe, aB: p.aF, aBe: p.aFe, lF: p.lB, lFk: p.lBk, lB: p.lF, lBk: p.lFk });
  const run = [P(12, -40, 60, 45, 70, 40, 5, -35, 30, { tr: 70 }), P(14, -25, 65, 30, 70, 25, 25, -45, 60, { tr: 78 }), P(12, 0, 70, 5, 70, 5, 10, 10, 80, { tr: 70 }), P(10, 25, 70, -25, 60, -15, 10, 40, 60, { tr: 62 })];
  const frun = [P(72, 40, 0, -30, 0, 70, 90, 20, 120), P(66, -20, 10, 30, 0, 20, 60, 60, 130)];
  const POSES = {
    idle: [P(2, 12, 20, -12, 15, 10, 8, -10, 6), P(3, 14, 24, -12, 18, 12, 12, -11, 9)],
    run: run.concat(run.map(mir)),
    jump: [P(4, 120, 30, -40, 30, 35, 55, -5, 35, { air: 1, tr: 30 })],
    fall: [P(-2, 110, 20, -80, 20, 18, 25, -22, 35, { air: 1, tr: 150 })],
    dash: [P(32, 70, 95, -45, 35, 55, 60, -50, 20, { air: 1, hy: 3, tr: 90 })],
    guard: [P(-4, 80, 110, 60, 120, 22, 22, -20, 16)],
    hurt: [P(-18, -30, 20, -50, 10, 22, 12, -6, 22, { tr: 30 })],
    down: [P(-85, -100, 10, -80, 10, 88, 4, 80, 6, { air: 1, hy: 11, tr: 80 })],
    a1: [P(4, 50, 100, 20, 90, 20, 12, -18, 10), P(14, 88, 4, 0, 80, 28, 16, -24, 6, { tr: 50 }), P(8, 60, 60, 10, 80, 22, 12, -18, 8)],
    a2: [P(8, 40, 100, -20, 100, 22, 14, -18, 10), P(18, 30, 110, 92, 2, 30, 18, -28, 4, { tr: 55 }), P(10, 40, 90, 50, 50, 24, 14, -20, 8)],
    a3: [P(-6, 60, 90, 30, 90, 30, 60, -5, 5), P(-14, 40, 80, -30, 40, 85, 4, -8, 6, { tr: 40 }), P(-4, 50, 80, 0, 60, 40, 40, -6, 6)],
    a4: [P(10, -40, 40, 150, 20, 25, 25, -25, 15), P(24, 20, 60, 70, 0, 35, 20, -30, 5, { tr: 70 }), P(12, 30, 60, 40, 40, 26, 16, -22, 8)],
    b1: [P(0, 150, 30, -20, 40, 18, 10, -16, 8, { wp: -20 }), P(14, 55, 10, -30, 40, 28, 16, -24, 6, { wp: 25, tr: 50 }), P(8, 40, 20, -20, 40, 22, 12, -18, 8, { wp: 30 })],
    b2: [P(10, 20, 20, -20, 40, 22, 14, -18, 10, { wp: 30 }), P(-4, 130, 10, -30, 40, 26, 14, -22, 6, { wp: -10, tr: 40 }), P(0, 140, 20, -20, 40, 20, 12, -18, 8, { wp: -20 })],
    b3: [P(-4, 40, 110, -30, 40, 16, 10, -16, 10, { wp: -60 }), P(18, 88, 2, -40, 30, 34, 16, -28, 4, { wp: 0, tr: 60 }), P(10, 70, 20, -30, 40, 26, 14, -22, 8, { wp: 0 })],
    b4: [P(-10, 175, 20, 160, 40, 22, 22, -20, 16, { wp: -30 }), P(26, 45, 5, 60, 30, 36, 22, -30, 6, { wp: 35, tr: 75 }), P(14, 40, 20, 40, 40, 28, 16, -24, 8, { wp: 35 })],
    launcher: [P(14, -20, 60, 20, 90, 60, 100, -30, 60), P(-6, 165, 6, -30, 40, 12, 6, -14, 6, { wp: 0, tr: 5 }), P(-2, 120, 30, -20, 40, 10, 6, -10, 6, { wp: 0 })],
    sweep: [P(20, 60, 80, 20, 80, 50, 110, 60, 130), P(24, 70, 60, -20, 40, 85, 5, 60, 130, { tr: 50 }), P(20, 60, 70, 0, 60, 55, 115, 60, 130)],
    air: [P(6, 140, 20, -20, 60, 30, 50, -10, 50, { air: 1, wp: -20, tr: 60 }), P(16, 60, 0, -40, 40, 60, 10, -30, 60, { air: 1, wp: 20, tr: 110 }), P(10, 40, 30, -30, 50, 30, 40, -20, 50, { air: 1, tr: 120 })],
    cast: [P(-4, -30, 60, -40, 30, 16, 10, -14, 8), P(10, 90, 0, -30, 50, 24, 14, -20, 6, { wp: 0, tr: 50 }), P(6, 70, 20, -20, 40, 20, 12, -18, 8)],
    special: [P(8, 30, 120, 10, 120, 24, 24, -20, 18, { wp: -90 }), P(16, 85, 5, 70, 10, 30, 14, -26, 6, { wp: 0, tr: 70 }), P(10, 70, 20, 50, 30, 26, 14, -22, 8, { wp: 0 })],
    charge: [P(0, 20, 130, -10, 130, 26, 24, -22, 20, { tr: 150, wp: -120 }), P(-2, 22, 134, -8, 134, 27, 26, -23, 22, { tr: 165, wp: -120 })],
    climb: [P(0, 160, 20, 120, 60, 30, 60, 5, 10, { air: 1, hy: -2 }), P(0, 120, 60, 160, 20, 5, 10, 30, 60, { air: 1, hy: -2 })],
    cling: [P(-6, 100, 40, 80, 60, 40, 80, 10, 40, { air: 1 })],
    cheer: [P(-8, 170, 10, 165, 10, 10, 4, -10, 4, { wp: 0 })],
    fidle: [P(68, 10, 0, -10, 0, 50, 110, 40, 100)],
    frun: frun.concat(frun.map(mir)),
    fleap: [P(50, 100, 10, 80, 10, -30, 10, -50, 20, { air: 1 })],
    fatk: [P(60, 60, 60, 40, 60, 50, 100, 40, 100), P(50, 95, 0, 85, 0, 20, 40, -20, 40)]
  };
  const SETS = {
    hero: ['idle', 'run', 'jump', 'fall', 'dash', 'guard', 'hurt', 'down', 'a1', 'a2', 'a3', 'a4', 'launcher', 'sweep', 'air', 'cast', 'special', 'charge', 'climb', 'cling', 'cheer'],
    enemy: ['idle', 'run', 'jump', 'fall', 'dash', 'guard', 'hurt', 'down', 'a1', 'a4', 'cast', 'special', 'cheer', 'sweep'],
    npc: ['idle', 'cheer'],
    feral: ['fidle', 'frun', 'fleap', 'fatk', 'hurt', 'down']
  };
  const WEAPONS = {
    blade: { len: 18, w: 2, col: '#bfefff', hi: '#ffffff', hilt: '#6f7ea8' },
    aurora: { len: 20, w: 2, col: '#ffffff', hi: '#aef4ff', hilt: '#7fe9ff' },
    tanto: { len: 11, w: 2, col: '#d8e0f0', hi: '#ffffff', hilt: '#ff4d7a' },
    staff: { len: 20, w: 2, col: '#9ad8ff', tip: '#ffffff', hilt: '#3e6ea8' },
    pipe: { len: 12, w: 2, col: '#8f97a8', hilt: '#5a6070' },
    baton: { len: 11, w: 2, col: '#2b2f3a', tip: '#6fd3e8', hilt: '#2b2f3a' },
    club: { len: 14, w: 4, col: '#6b5234', tip: '#b8bcc8', hilt: '#3a2c1c' },
    cleaver: { len: 13, w: 4, col: '#aab0b8', hi: '#e8ecf0', hilt: '#4a3828' },
    saber: { len: 19, w: 2, col: '#ff8a3a', hi: '#ffe0a0', hilt: '#d9b45a' }
  };

  function makeHead(cfg) {
    const C = cfg.c, [c, x] = SW.canvas(11, 10);
    const map = { h: C.hair, H: C.hairD, s: C.skin, S: C.skinD, e: C.eye || '#15121c', w: C.white || '#f2f2f6', W: '#a8acb8', m: C.acc || C.hair, M: C.accD || C.acc || C.hairD, g: C.glow || '#6fd3e8' };
    HEADS[cfg.head].forEach((row, y) => { for (let i = 0; i < row.length; i++) { const col = row[i] === 'h' && y < 2 ? shade(C.hair, 1.2) : map[row[i]]; if (col) rect(x, col, i, y, 1, 1); } });
    return c;
  }

  function drawRig(x, cfg, p, fw, fh, head) {
    const sc = cfg.sc || 1, C = cfg.c;
    const TH = 7 * sc, SH = 7 * sc, UA = 6 * sc, FA = 6 * sc, TO = 12 * sc;
    const lw = Math.max(2, Math.round((cfg.limb || 3) * sc)), bw = Math.round((cfg.bulk || 7) * sc);
    const leg = (t, k) => { const kx = Math.sin(t * R) * TH, ky = Math.cos(t * R) * TH, a = (t - k) * R; return [kx, ky, kx + Math.sin(a) * SH, ky + Math.cos(a) * SH]; };
    const arm = (s, e) => { const ex = Math.sin(s * R) * UA, ey = Math.cos(s * R) * UA, a = (s + e) * R; return [ex, ey, ex + Math.sin(a) * FA, ey + Math.cos(a) * FA, a]; };
    const LF = leg(p.lF, p.lFk), LB = leg(p.lB, p.lBk), AF = arm(p.aF, p.aFe), AB = arm(p.aB, p.aBe);
    const gy = fh - 4;
    const hipY = p.air ? gy - (TH + SH) + (p.hy || 0) * sc : gy - Math.max(LF[3], LB[3]);
    const hipX = fw / 2 + (p.hx || 0) * sc;
    const sl = Math.sin(p.lean * R), cl = Math.cos(p.lean * R);
    const sx = hipX + sl * TO, sy = hipY - cl * TO;
    const drawLeg = (ox, L, back) => {
      const pc = back ? C.pantsD : C.pants, bc = back ? C.bootsD : C.boots, mx = ox + (L[0] + L[2]) / 2, my = hipY + (L[1] + L[3]) / 2;
      pline(x, pc, ox, hipY, ox + L[0], hipY + L[1], lw + 1);
      pline(x, pc, ox + L[0], hipY + L[1], mx, my, lw);
      pline(x, bc, mx, my, ox + L[2], hipY + L[3], lw);
      rect(x, bc, ox + L[2] - lw / 2, hipY + L[3] - lw / 2 + 1, lw + 2 * sc, lw - 1);
    };
    const drawArm = (ox, oy, Aq, back) => {
      const ac = back ? (C.armD || C.topD) : (C.arm || C.top), hc = back ? (C.handD || C.skinD) : (C.hand || C.skin);
      const fc = C.fore ? (back ? C.foreD : C.fore) : hc;
      pline(x, ac, ox, oy, ox + Aq[0], oy + Aq[1], lw);
      pline(x, fc, ox + Aq[0], oy + Aq[1], ox + Aq[2], oy + Aq[3], Math.max(2, lw - 1));
      rect(x, hc, ox + Aq[2] - lw / 2, oy + Aq[3] - lw / 2, lw, lw);
    };
    drawArm(sx - sc, sy + 2 * sc, AB, true);
    drawLeg(hipX - sc, LB, true);
    if (C.trail) {
      let tx = sx - 2 * sc + sl * (cfg.trailHead ? 7 : 0) * sc, ty = sy - cl * (cfg.trailHead ? 7 : 0) * sc;
      const ta = p.tr === undefined ? 14 : p.tr, tw = Math.max(2, Math.round((cfg.trailW || 2) * sc));
      for (let i = 0; i < (cfg.trailLen || 4); i++) {
        const a = (ta + (i % 2 ? 9 : -7)) * R, nx = tx - Math.sin(a) * 3.2 * sc, ny = ty + Math.cos(a) * 3.2 * sc;
        pline(x, i % 2 ? C.trailD : C.trail, tx, ty, nx, ny, tw);
        tx = nx; ty = ny;
      }
    }
    pline(x, C.top, hipX, hipY, sx, sy, bw);
    const bo = bw / 2 - 1;
    pline(x, C.topD, hipX - cl * bo, hipY - sl * bo, sx - cl * bo, sy - sl * bo, 2);
    pline(x, shade(C.top, 1.3), hipX + cl * bo, hipY + sl * bo, sx + cl * bo, sy + sl * bo, 1);   // rim light on the front edge
    if (C.chest) rect(x, C.chest, (hipX + sx) / 2 + cl * (bo - 1) - 1, (hipY + sy) / 2 - 3 * sc, 2 * sc, 3 * sc);
    if (C.belt && Math.abs(p.lean) < 45) rect(x, C.belt, hipX - bw / 2, hipY - sc, bw, 2 * sc);
    drawLeg(hipX + sc, LF, false);
    const hx = sx + sl * 6 * sc + sc, hy = sy - cl * 6 * sc;
    x.drawImage(head, Math.round(hx - 5.5 * sc), Math.round(hy - 5 * sc), Math.round(11 * sc), Math.round(10 * sc));
    const ax = sx + sc, ay = sy + 2 * sc;
    if (cfg.weapon) {
      const W = WEAPONS[cfg.weapon], a = AF[4] + (p.wp === undefined ? 30 : p.wp) * R, len = W.len * sc;
      const wx = ax + AF[2], wy = ay + AF[3], ex = wx + Math.sin(a) * len, ey = wy + Math.cos(a) * len, ww = Math.max(2, Math.round(W.w * sc));
      const WD = art.WEAPON_DRAW && art.WEAPON_DRAW[cfg.weapon];   // a weapon with a shape of its own (js/weapon-looks.js)
      if (WD) WD(x, wx, wy, a, len, sc, W, { rect, pline, disc });
      else {
        pline(x, W.col, wx, wy, ex, ey, ww);
        if (W.hi) pline(x, W.hi, wx + Math.sin(a) * len * 0.25, wy + Math.cos(a) * len * 0.25, ex, ey, 1);
        if (W.tip) rect(x, W.tip, ex - ww / 2, ey - ww / 2, ww, ww);
        rect(x, W.hilt, wx - 1.5 * sc, wy - 1.5 * sc, 3 * sc, 3 * sc);
      }
    }
    drawArm(ax, ay, AF, false);
    if (cfg.shield) { rect(x, C.shield || '#6fd3e8', sx + 6 * sc, sy - 3 * sc, 3 * sc, 18 * sc); rect(x, '#e8fbff', sx + 6 * sc, sy - 3 * sc, 1, 18 * sc); }
  }

  function outline(c, x, col) {
    const w = c.width, h = c.height, im = x.getImageData(0, 0, w, h), d = im.data, src = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) src[i] = d[i * 4 + 3] > 0 ? 1 : 0;
    const n = parseInt(col.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
      const i = y * w + xx;
      if (src[i]) continue;
      if ((xx > 0 && src[i - 1]) || (xx < w - 1 && src[i + 1]) || (y > 0 && src[i - w]) || (y < h - 1 && src[i + w])) { d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255; }
    }
    x.putImageData(im, 0, 0);
  }
  function whiten(c) {
    const [f, x] = SW.canvas(c.width, c.height);
    x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
    return f;
  }
  function finish(c) {
    const D = ['skin', 'hair', 'top', 'pants', 'boots', 'acc', 'trail', 'arm', 'hand', 'fore'];
    D.forEach(k => { if (c[k] && !c[k + 'D']) c[k + 'D'] = shade(c[k], 0.7); });
    return c;
  }
  function bake(id, cfg, setName) {
    cfg.c = finish(cfg.c);
    const sc = cfg.sc || 1, fw = Math.round(80 * sc / 2) * 2, fh = Math.round(72 * sc / 2) * 2, frames = [], anims = {};
    SETS[setName].forEach(n => {
      const src = (cfg.weapon && cfg.armed && POSES['b' + n.slice(1)] && /^a[1-4]$/.test(n)) ? POSES['b' + n.slice(1)] : POSES[n];
      anims[n] = src.map(p => { frames.push(p); return frames.length - 1; });
    });
    const cols = 10, rows = Math.ceil(frames.length / cols), [c, x] = SW.canvas(cols * fw, rows * fh), head = makeHead(cfg);
    frames.forEach((p, i) => { x.save(); x.translate((i % cols) * fw, Math.floor(i / cols) * fh); drawRig(x, cfg, p, fw, fh, head); x.restore(); });
    outline(c, x, cfg.outline || '#0a0a12');
    art.sheets[id] = { img: c, flash: whiten(c), fw, fh, cols, ox: fw / 2, oy: fh - 2, anims, head, cfg };
  }
  function custom(id, fw, fh, oy, anims, olc) {
    const names = Object.keys(anims), frames = [], map = {};
    names.forEach(n => { map[n] = anims[n].map(f => { frames.push(f); return frames.length - 1; }); });
    const cols = 8, rows = Math.ceil(frames.length / cols), [c, x] = SW.canvas(cols * fw, rows * fh);
    frames.forEach((f, i) => { x.save(); x.translate((i % cols) * fw, Math.floor(i / cols) * fh); f(x); x.restore(); });
    outline(c, x, olc || '#0a0a12');
    art.sheets[id] = { img: c, flash: whiten(c), fw, fh, cols, ox: fw / 2, oy, anims: map };
  }

  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    const s = art.sheets[id];
    if (!s) return;
    const list = s.anims[anim] || s.anims.idle || s.anims[Object.keys(s.anims)[0]];
    const f = list[Math.max(0, Math.min(list.length - 1, fi | 0))];
    const sx = (f % s.cols) * s.fw, sy = Math.floor(f / s.cols) * s.fh, img = o && o.flash ? s.flash : s.img;
    x = Math.round(x); y = Math.round(y);
    if (o && o.alpha !== undefined) ctx.globalAlpha = o.alpha;
    if (flip) { ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1); ctx.drawImage(img, sx, sy, s.fw, s.fh, -s.ox, y - s.oy, s.fw, s.fh); ctx.restore(); }
    else ctx.drawImage(img, sx, sy, s.fw, s.fh, x - s.ox, y - s.oy, s.fw, s.fh);
    if (o && o.alpha !== undefined) ctx.globalAlpha = 1;
  };
  art.frames = (id, anim) => { const s = art.sheets[id]; return s && s.anims[anim] ? s.anims[anim].length : 1; };

  // portrait: 36x36, head x3 over shoulders
  art.portrait = function (ctx, id, x, y, bg) {
    const s = art.sheets[id];
    rect(ctx, bg || '#1a1c30', x, y, 36, 36);
    if (!s || !s.head) return;
    const C = s.cfg.c;
    rect(ctx, C.topD, x + 3, y + 28, 30, 8); rect(ctx, C.top, x + 6, y + 27, 24, 9);
    if (C.trail && !s.cfg.trailHead) rect(ctx, C.trail, x + 6, y + 27, 20, 3);
    ctx.drawImage(s.head, x + 1, y - 1, 33, 30);
  };

  // ---------- cast ----------
  const CAST = {
    // heroes
    kael: ['hero', { head: 'shaggy', c: { skin: '#9a6240', hair: '#eef0f6', hairD: '#b4bbd2', acc: '#22d3ee', top: '#3b4a6b', arm: '#9a6240', fore: '#d9c7a0', pants: '#2b2f3a', boots: '#5a4634', belt: '#c8642a', trail: '#d83a3a' }, trailLen: 5 }],
    kael_aw: ['hero', { head: 'shaggy', outline: '#5a3a00', c: { skin: '#c98a50', hair: '#fff2b0', hairD: '#ffd24a', acc: '#ffffff', top: '#5a4a2b', arm: '#ffd98a', fore: '#fff2b0', hand: '#ffffff', pants: '#3a3020', boots: '#8a6a34', belt: '#ffd24a', trail: '#ffd24a' }, trailLen: 6 }],
    nyra: ['hero', { head: 'braid', c: { skin: '#f0c8a8', hair: '#2c3a7a', top: '#d8dde6', pants: '#b9c0ce', boots: '#4a5066', belt: '#d9b45a', chest: '#d9b45a', trail: '#2c3a7a' }, trailHead: 1, trailLen: 5 }],
    nyra_b: ['hero', { head: 'braid', weapon: 'blade', armed: 1, c: { skin: '#f0c8a8', hair: '#2c3a7a', top: '#d8dde6', pants: '#b9c0ce', boots: '#4a5066', belt: '#d9b45a', chest: '#d9b45a', trail: '#2c3a7a' }, trailHead: 1, trailLen: 5 }],
    nyra_aw: ['hero', { head: 'braid', weapon: 'aurora', armed: 1, outline: '#0a3a5a', c: { skin: '#f6e0d0', hair: '#aef4ff', hairD: '#5fd0f0', top: '#f4fbff', pants: '#cfe8f4', boots: '#6fa8c8', belt: '#7fe9ff', chest: '#7fe9ff', trail: '#7fe9ff' }, trailHead: 1, trailLen: 6 }],
    // elemental heroes (unlockable)
    fenn: ['hero', { head: 'hood', c: { skin: '#3a3048', hair: '#8a8f9c', glow: '#c9b6ff', top: '#2e2a52', arm: '#2e2a52', fore: '#c8ccd8', hand: '#e8ecf4', pants: '#1f1d3a', boots: '#4a4460', belt: '#a78bfa', chest: '#a78bfa', trail: '#8a8f9c' }, trailLen: 4, trailW: 3 }],
    fenn_aw: ['hero', { head: 'hood', outline: '#3a1a7a', c: { skin: '#4a3a6a', hair: '#ece4ff', glow: '#ffffff', top: '#4a3a8a', arm: '#4a3a8a', fore: '#ffffff', hand: '#ffffff', pants: '#2a2452', boots: '#6a5aa0', belt: '#ece4ff', chest: '#ffffff', trail: '#a78bfa' }, trailLen: 5, trailW: 3 }],
    isolde: ['hero', { head: 'long', weapon: 'staff', armed: 1, c: { skin: '#f4dcd0', hair: '#e6f4ff', top: '#3e6ea8', pants: '#27456e', boots: '#1a2e4a', belt: '#7fd8ff', chest: '#e6fbff', trail: '#e6f4ff' }, trailHead: 1, trailLen: 5 }],
    isolde_aw: ['hero', { head: 'long', weapon: 'staff', armed: 1, outline: '#0a3a5a', c: { skin: '#f8ece6', hair: '#ffffff', top: '#7fd8ff', pants: '#bfefff', boots: '#6fa8c8', belt: '#ffffff', chest: '#ffffff', trail: '#bfefff' }, trailHead: 1, trailLen: 6 }],
    brakk: ['hero', { head: 'bald', sc: 1.16, limb: 4, bulk: 9, c: { skin: '#7a5a40', acc: '#c8a05a', top: '#6b5a3a', arm: '#7a5a40', fore: '#a89a80', hand: '#c8bca0', pants: '#4a4030', boots: '#8a7a5a', belt: '#c8a05a', chest: '#f0dca8' } }],
    brakk_aw: ['hero', { head: 'bald', sc: 1.16, limb: 4, bulk: 9, outline: '#5a3a00', c: { skin: '#a8905a', acc: '#ffd24a', top: '#8a7a4a', arm: '#a8905a', fore: '#f0dca8', hand: '#ffffff', pants: '#5a5038', boots: '#c8a05a', belt: '#ffd24a', chest: '#ffffff' } }],
    pyra: ['hero', { head: 'long', c: { skin: '#f0c090', hair: '#ff7043', top: '#4a1f2a', arm: '#4a1f2a', fore: '#ff9a3a', pants: '#2a1a22', boots: '#7a2a20', belt: '#ffd24a', chest: '#ffd24a', trail: '#ff9a3a' }, trailHead: 1, trailLen: 5 }],
    pyra_aw: ['hero', { head: 'long', outline: '#6a1a00', c: { skin: '#f8d8b0', hair: '#fff2b0', top: '#8a2a10', arm: '#8a2a10', fore: '#ffffff', hand: '#fff2b0', pants: '#4a1a10', boots: '#c8642a', belt: '#fff2b0', chest: '#ffffff', trail: '#ffd24a' }, trailHead: 1, trailLen: 6 }],
    gale: ['hero', { head: 'shaggy', c: { skin: '#d8a878', hair: '#3fd6a8', acc: '#f4f1ea', top: '#e6f4e8', arm: '#d8a878', fore: '#f4f1ea', pants: '#3a6a5a', boots: '#2a4a40', belt: '#7dffb2', trail: '#7dffb2' }, trailLen: 5 }],
    gale_aw: ['hero', { head: 'shaggy', outline: '#0a5a3a', c: { skin: '#e8c8a0', hair: '#eafff4', acc: '#ffffff', top: '#ffffff', arm: '#e8c8a0', fore: '#ffffff', pants: '#5ac8a0', boots: '#3a8a70', belt: '#ffffff', trail: '#eafff4' }, trailLen: 6 }],
    ashka: ['hero', { head: 'short', sc: 1.05, bulk: 8, c: { skin: '#6a4030', hair: '#2a1a1a', top: '#2a2024', arm: '#2a2024', fore: '#ff5a1f', hand: '#ffd27a', pants: '#1c1618', boots: '#4a2a20', belt: '#ff5a1f', chest: '#ff7a2a' } }],
    ashka_aw: ['hero', { head: 'short', sc: 1.05, bulk: 8, outline: '#6a1a00', c: { skin: '#8a5038', hair: '#ff7a2a', top: '#4a2018', arm: '#4a2018', fore: '#ffd27a', hand: '#ffffff', pants: '#2a1810', boots: '#ff5a1f', belt: '#ffd27a', chest: '#ffffff' } }],
    dyna: ['hero', { head: 'cap', c: { skin: '#f0c8a0', hair: '#e8c860', acc: '#f5c542', top: '#5a6a3a', arm: '#5a6a3a', fore: '#8a6a3a', pants: '#3a3a30', boots: '#2a2a20', belt: '#3a2a1a', chest: '#f5c542' } }],
    dyna_aw: ['hero', { head: 'cap', outline: '#5a4a00', c: { skin: '#f8d8b8', hair: '#fff3c0', acc: '#ffffff', top: '#8a8a3a', arm: '#8a8a3a', fore: '#f5c542', hand: '#fff3c0', pants: '#4a4a30', boots: '#f5c542', belt: '#ffffff', chest: '#ffffff' } }],
    vesper: ['hero', { head: 'ninja', weapon: 'tanto', armed: 1, c: { skin: '#e8c0a0', hair: '#1c2440', acc: '#1c2440', top: '#1c2440', arm: '#1c2440', fore: '#2a3458', pants: '#141a30', boots: '#0c1020', belt: '#ff4d7a', trail: '#ff4d7a' }, trailLen: 5 }],
    vesper_aw: ['hero', { head: 'ninja', weapon: 'tanto', armed: 1, outline: '#5a0a20', c: { skin: '#ffd0dc', hair: '#3a1830', acc: '#3a1830', top: '#3a1830', arm: '#3a1830', fore: '#ff4d7a', hand: '#ffd0dc', pants: '#2a1020', boots: '#ff4d7a', belt: '#ffffff', trail: '#ffd0dc' }, trailLen: 6 }],
    // npcs
    mags: ['npc', { head: 'bun', c: { skin: '#d8a888', hair: '#9a9aa8', top: '#7a4a5a', pants: '#3a3448', boots: '#2a2630', belt: '#d9b45a', chest: '#f2e2b0' }, bulk: 8 }],
    kid: ['npc', { head: 'short', sc: 0.75, c: { skin: '#c99878', hair: '#6a4a30', top: '#2e8b7a', pants: '#3a3a4a', boots: '#2a2a30' } }],
    ferro: ['npc', { head: 'beard', c: { skin: '#b88a68', hair: '#d8d8e0', top: '#4a3f6b', pants: '#2e2a40', boots: '#3a3028', belt: '#c8a050', trail: '#4a3f6b' }, trailLen: 4, trailW: 3 }],
    quill: ['npc', { head: 'long', c: { skin: '#e8c0a0', hair: '#b06cff', top: '#1f1f33', pants: '#1f1f33', boots: '#101018', belt: '#d9b45a', chest: '#d9b45a', trail: '#b06cff' }, trailHead: 1 }],
    tamsin: ['npc', { head: 'bun', c: { skin: '#b9825e', hair: '#1c1a22', top: '#2a9d8f', pants: '#e8ece8', boots: '#40464a', chest: '#ffffff', belt: '#1f7a6f' } }],
    bookie: ['npc', { head: 'cap', c: { skin: '#d0a080', hair: '#3a3030', acc: '#39c070', top: '#4a4a5a', pants: '#2a2a34', boots: '#1a1a20', chest: '#f5c542' } }],
    anvil: ['enemy', { head: 'bald', sc: 1.3, limb: 4, bulk: 9, c: { skin: '#5e4030', acc: '#5e4030', top: '#3b3b44', arm: '#5e4030', pants: '#2a2a32', boots: '#1a1a20', belt: '#f5c542' } }],
    marlo: ['npc', { head: 'hat', c: { skin: '#c89870', hair: '#8a8a90', acc: '#a8824e', white: '#c8c8d0', top: '#8c6a4a', pants: '#4a4038', boots: '#2e241c', belt: '#3a2c20', trail: '#a8643a' }, bulk: 8, trailLen: 3, trailW: 3 }],
    odile: ['npc', { head: 'long', c: { skin: '#d8b090', hair: '#7a4a2a', top: '#6a8f4e', pants: '#d8d0b8', boots: '#5a4634', chest: '#f4f1ea', trail: '#7a4a2a' }, trailHead: 1 }],
    thessaly: ['npc', { head: 'long', c: { skin: '#e0c8b8', hair: '#d8e4f0', top: '#3e5c8a', pants: '#2c4268', boots: '#1e2c48', belt: '#aef4ff', chest: '#aef4ff', trail: '#d8e4f0' }, trailHead: 1, trailLen: 5 }],
    wren: ['npc', { head: 'short', c: { skin: '#e8c8a8', hair: '#2ad0b8', top: '#30344a', pants: '#22242e', boots: '#15161c', chest: '#22d3ee' } }],
    corvane: ['npc', { head: 'long', c: { skin: '#e8d8c8', hair: '#1a1a24', top: '#f4f1ea', pants: '#e0d8c4', boots: '#d9b45a', belt: '#d9b45a', chest: '#d9b45a', trail: '#1a1a24' }, trailHead: 1 }],
    kessen: ['npc', { head: 'bun', c: { skin: '#e0c0a8', hair: '#8b5cf6', top: '#f4f1ea', pants: '#2b2f3a', boots: '#1a1c24', chest: '#8b5cf6' } }],
    // enemies
    thug: ['enemy', { head: 'mohawk', weapon: 'pipe', c: { skin: '#c9a184', hair: '#ff3ea5', top: '#3a3a58', pants: '#252638', boots: '#15161f', belt: '#f5c542' } }],
    ganger: ['enemy', { head: 'hood', c: { skin: '#3a3040', hair: '#2b5d5a', glow: '#f5c542', top: '#2b5d5a', pants: '#1e2c34', boots: '#12181c', belt: '#22d3ee' } }],
    brawler: ['enemy', { head: 'bald', bulk: 8, limb: 4, c: { skin: '#b08060', acc: '#b08060', top: '#7a2a3a', arm: '#b08060', pants: '#2a2a34', boots: '#1a1a20', belt: '#22d3ee' } }],
    bandit: ['enemy', { head: 'hood', weapon: 'pipe', c: { skin: '#5a4030', hair: '#8c6a4a', glow: '#e8c48a', top: '#c8642a', pants: '#5a4634', boots: '#2e241c', belt: '#3a2c20', trail: '#8c6a4a' }, trailLen: 3 }],
    guard: ['enemy', { head: 'helmet', weapon: 'baton', c: { skin: '#d8b090', hair: '#e6e8ee', glow: '#6fd3e8', top: '#e6e8ee', pants: '#9aa2b4', boots: '#2b2f3a', belt: '#d9b45a' } }],
    enforcer: ['enemy', { head: 'helmet', weapon: 'baton', shield: 1, bulk: 8, c: { skin: '#d8b090', hair: '#2b2f3a', glow: '#ff5a5a', top: '#2b2f3a', pants: '#3a3f4e', boots: '#15171e', belt: '#d9b45a', shield: '#6fd3e8' } }],
    feral: ['feral', { head: 'feral', limb: 3, c: { skin: '#7d8a6a', glow: '#c8ff5a', top: '#4a4033', arm: '#7d8a6a', pants: '#3a3428', boots: '#6a765a' } }],
    husk: ['enemy', { head: 'mask', outline: '#2a1a4a', c: { skin: '#e8e8f0', hair: '#14141e', glow: '#8b5cf6', top: '#1a1a28', arm: '#1a1a28', hand: '#e8e8f0', pants: '#14141e', boots: '#0c0c14', chest: '#8b5cf6' } }],
    // bosses
    tusk: ['enemy', { head: 'bald', sc: 1.55, limb: 4, bulk: 10, weapon: 'club', c: { skin: '#8f7a6a', acc: '#f2f2f6', top: '#5a2a2a', arm: '#8f7a6a', pants: '#2e2a34', boots: '#1a1820', belt: '#ff3ea5' } }],
    tusk2: ['enemy', { head: 'bald', sc: 1.55, limb: 4, bulk: 10, weapon: 'club', outline: '#3a0010', c: { skin: '#b0685a', acc: '#f2f2f6', top: '#8a1a2a', arm: '#b0685a', pants: '#2e2a34', boots: '#1a1820', belt: '#ff3ea5', eye: '#ffe040' } }],
    grist: ['enemy', { head: 'hood', sc: 1.25, weapon: 'cleaver', bulk: 8, c: { skin: '#3a4034', hair: '#5a5248', glow: '#ff4040', top: '#3d4a3a', pants: '#2a3028', boots: '#1a1e18', belt: '#8a7a50', trail: '#6b6257' }, trailLen: 5, trailW: 3 }],
    grist2: ['enemy', { head: 'hood', sc: 1.25, weapon: 'cleaver', bulk: 8, outline: '#0a3a10', c: { skin: '#3a4034', hair: '#3a6a3a', glow: '#b8ff40', top: '#2a5a2a', pants: '#2a3028', boots: '#1a1e18', belt: '#b8ff40', trail: '#3a8a3a' }, trailLen: 5, trailW: 3 }],
    brandt: ['enemy', { head: 'short', sc: 1.15, weapon: 'saber', armed: 1, c: { skin: '#e0b898', hair: '#c8ccd8', top: '#8e2430', pants: '#f4f1ea', boots: '#2b2f3a', belt: '#d9b45a', chest: '#d9b45a', trail: '#8e2430' }, trailLen: 4, trailW: 3 }],
    brandt2: ['enemy', { head: 'short', sc: 1.15, weapon: 'saber', armed: 1, outline: '#4a1a00', c: { skin: '#e0b898', hair: '#ffe0a0', top: '#c84a20', pants: '#f4f1ea', boots: '#2b2f3a', belt: '#ffe0a0', chest: '#ffe0a0', trail: '#ff8a3a' }, trailLen: 5, trailW: 3 }]
  };

  function bakeCreatures() {
    // security drone
    const drone = (rot, eye) => x => {
      rect(x, '#3a3f4e', 8, 12, 18, 9); rect(x, '#555b6e', 9, 11, 16, 2); rect(x, '#2b2f3a', 10, 20, 14, 2);
      rect(x, '#8a92a8', 11, 9, 10, 3); rect(x, eye, 20, 14, 5, 4); rect(x, '#ffffff', 23, 14, 1, 1);
      rect(x, '#1c1f28', 24, 19, 6, 2); rect(x, '#d9b45a', 9, 16, 6, 1); rect(x, '#ff5a5a', 12, 22, 2, 1);
      rect(x, '#2b2f3a', 16, 6, 1, 4); rect(x, '#c8ccd8', rot ? 8 : 12, 5, rot ? 18 : 10, 1);
    };
    custom('drone', 34, 28, 26, { idle: [drone(0, '#6fd3e8'), drone(1, '#6fd3e8')], atk: [drone(0, '#ff5a5a'), drone(1, '#ffffff')], hurt: [drone(1, '#ff5a5a')], down: [drone(0, '#2b2f3a')] });
    // sewer rat
    const rat = f => x => {
      rect(x, '#5a5248', 5, 6, 12, 6); rect(x, '#6b6257', 6, 5, 10, 2); rect(x, '#5a5248', 15, 5, 6, 5); rect(x, '#7a7066', 20, 7, 2, 2);
      rect(x, '#8a7a70', 15, 3, 2, 2); rect(x, '#ff4040', 18, 6, 1, 1); pline(x, '#8a6a6a', 5, 9, 1, 7 + (f ? 1 : -1), 1);
      rect(x, '#3a3430', f ? 6 : 8, 12, 2, 2); rect(x, '#3a3430', f ? 14 : 12, 12, 2, 2);
    };
    custom('rat', 24, 16, 14, { idle: [rat(0)], run: [rat(0), rat(1)], hurt: [rat(1)], down: [rat(0)] });
    // rust crawler (armoured beetle, weak point on its back)
    const crawler = f => x => {
      for (let i = 0; i < 6; i++) { const w = [14, 22, 28, 30, 30, 28][i]; rect(x, i < 2 ? '#b8703a' : '#8a4a26', 20 - w / 2, 6 + i * 2, w, 2); }
      rect(x, '#d08a4a', 10, 7, 12, 1); rect(x, '#5a2e18', 6, 16, 28, 2); rect(x, '#ffb040', 13, 4, 6, 3); rect(x, '#fff0b0', 15, 5, 2, 1);
      rect(x, '#3a2418', 33, 13, 5, 4); rect(x, '#ff5a3a', 36, 14, 1, 1); rect(x, '#3a2418', 37, 16, 3, 1);
      for (let i = 0; i < 3; i++) { const lx = 8 + i * 9 + ((i + f) % 2 ? 2 : 0); rect(x, '#3a2418', lx, 18, 2, 3); rect(x, '#3a2418', lx + ((i + f) % 2 ? 1 : -1), 20, 2, 2); }
    };
    custom('crawler', 40, 24, 22, { idle: [crawler(0)], run: [crawler(0), crawler(1)], hurt: [crawler(1)], down: [crawler(0)] });
    // Warden-01 security mech
    const mech = (leg, eye, lean, arm) => x => {
      const b = 4 + (leg === 1 ? 1 : 0);
      rect(x, '#3a3f4e', 30 + (leg === 1 ? 3 : leg === 2 ? -3 : 0), 62, 9, 26); rect(x, '#2b2f3a', 28 + (leg === 1 ? 3 : leg === 2 ? -3 : 0), 86, 15, 6);
      rect(x, '#555b6e', 52 + (leg === 1 ? -3 : leg === 2 ? 3 : 0), 62, 9, 26); rect(x, '#3a3f4e', 50 + (leg === 1 ? -3 : leg === 2 ? 3 : 0), 86, 15, 6);
      rect(x, '#2b2f3a', 30, 56 + b, 34, 8);
      rect(x, '#e6e8ee', 24 + lean, 24 + b, 44, 34); rect(x, '#b9c0ce', 24 + lean, 24 + b, 8, 34); rect(x, '#f8fafc', 32 + lean, 24 + b, 36, 3);
      rect(x, '#d9b45a', 28 + lean, 50 + b, 36, 3); rect(x, '#2b2f3a', 40 + lean, 32 + b, 26, 9); rect(x, eye, 44 + lean, 34 + b, 20, 5);
      rect(x, '#9aa2b4', 34 + lean, 14 + b, 20, 10); rect(x, '#ff5a5a', 48 + lean, 17 + b, 4, 3); rect(x, '#2b2f3a', 40 + lean, 10 + b, 3, 5);
      rect(x, '#555b6e', 16 + lean, 28 + b, 9, 22); rect(x, '#3a3f4e', 14 + lean, 48 + b, 12, 8);
      rect(x, '#9aa2b4', 62 + lean, 30 + b + arm, 10, 12); rect(x, '#3a3f4e', 68 + lean, 34 + b + arm, 18, 7); rect(x, eye, 84 + lean, 35 + b + arm, 4, 5);
    };
    custom('warden', 100, 96, 94, {
      idle: [mech(0, '#ff5a5a', 0, 0), mech(1, '#ff5a5a', 0, 0)], run: [mech(1, '#ff5a5a', 2, 0), mech(0, '#ff5a5a', 2, 0), mech(2, '#ff5a5a', 2, 0), mech(0, '#ff5a5a', 2, 0)],
      tele: [mech(0, '#ffffff', -2, -6)], atk: [mech(0, '#ffe040', 3, 2)], hurt: [mech(0, '#ffffff', -4, 0)], down: [mech(1, '#2b2f3a', 6, 10)]
    }, '#14161e');
  }

  // ---------- props (baked lazily, anchored bottom-centre) ----------
  const PROPS = {
    crate: [16, 16, x => { rect(x, '#6b5234', 0, 0, 16, 16); rect(x, '#8a6c46', 1, 1, 14, 14); rect(x, '#6b5234', 1, 7, 14, 2); rect(x, '#a88858', 2, 2, 12, 1); rect(x, '#4a3824', 0, 15, 16, 1); rect(x, '#4a3824', 7, 1, 2, 14); }],
    barrel: [12, 16, x => { rect(x, '#4a5a6a', 1, 0, 10, 16); rect(x, '#6a7c8e', 2, 0, 3, 16); rect(x, '#2e3a46', 1, 4, 10, 1); rect(x, '#2e3a46', 1, 11, 10, 1); rect(x, '#39ff88', 5, 6, 3, 3); }],
    trash: [44, 22, x => { const r = SW.rng(5); for (let i = 0; i < 26; i++) { const w = 4 + r() * 8, px = r() * 36, py = 22 - (1 - Math.abs(px + w / 2 - 22) / 24) * 20 * r() - 4; rect(x, ['#3a3f4e', '#4a4438', '#2e3440', '#5a4a3a', '#39505a'][i % 5], px, Math.max(2, py), w, 22 - py); } rect(x, '#8a92a8', 14, 8, 5, 2); rect(x, '#c8642a', 26, 12, 6, 3); }],
    lamp: [12, 52, (x, c) => { rect(x, '#3a3d55', 5, 8, 2, 44); rect(x, '#3a3d55', 1, 7, 10, 2); rect(x, c || '#f5c542', 2, 2, 8, 5); rect(x, '#fff7d0', 4, 3, 4, 3); rect(x, '#2a2c40', 3, 50, 6, 2); }],
    neon: [30, 14, (x, c) => { rect(x, '#101224', 0, 0, 30, 14); rect(x, c, 0, 0, 30, 1); rect(x, c, 0, 13, 30, 1); rect(x, c, 0, 0, 1, 14); rect(x, c, 29, 0, 1, 14); const r = SW.rng(c.charCodeAt(2) * 7 + c.charCodeAt(4)); for (let i = 0; i < 5; i++) { const gx = 3 + i * 5; rect(x, '#ffffff', gx, 4 + (r() * 2 | 0), 1 + (r() * 3 | 0), 1); rect(x, c, gx, 6, 3, 1); rect(x, c, gx + (r() * 3 | 0), 6, 1, 4); rect(x, '#ffffff', gx, 9 + (r() * 2 | 0), 3, 1); } }],
    stall: [52, 44, (x, c) => { rect(x, '#3a2c2c', 2, 14, 2, 30); rect(x, '#3a2c2c', 48, 14, 2, 30); rect(x, '#5a4638', 2, 28, 48, 16); rect(x, '#7a6248', 2, 28, 48, 2); rect(x, '#3e3028', 4, 32, 44, 10); for (let i = 0; i < 7; i++) rect(x, i % 2 ? c : '#f2e8d8', i * 8 - 2, 6, 8, 9); rect(x, shade(c, 0.7), 0, 14, 52, 2); rect(x, '#f5c542', 10, 17, 4, 5); rect(x, '#ff5a5a', 38, 17, 4, 5); rect(x, '#c8ccd8', 20, 24, 8, 4); rect(x, '#e8ecf4', 22, 21, 1, 3); rect(x, '#e8ecf4', 25, 20, 1, 4); }],
    tank: [26, 48, (x, c) => { rect(x, '#5a6478', 0, 0, 26, 5); rect(x, '#5a6478', 0, 43, 26, 5); rect(x, '#8a94a8', 1, 1, 24, 2); rect(x, c || '#6fd3e8', 2, 5, 22, 38); rect(x, '#bff0fa', 3, 6, 3, 36); rect(x, shade(c || '#6fd3e8', 0.75), 18, 6, 5, 36); rect(x, '#e8fbff', 9, 20, 1, 1); rect(x, '#e8fbff', 13, 30, 2, 2); rect(x, '#e8fbff', 8, 36, 1, 1); rect(x, '#d9b45a', 10, 44, 6, 2); }],
    tankb: [26, 48, x => { rect(x, '#5a6478', 0, 0, 26, 5); rect(x, '#5a6478', 0, 43, 26, 5); rect(x, '#8a94a8', 1, 1, 24, 2); rect(x, '#2b3a4a', 2, 5, 22, 38); rect(x, '#bff0fa', 2, 5, 3, 14); rect(x, '#bff0fa', 21, 5, 3, 22); rect(x, '#6fd3e8', 2, 36, 22, 7); pline(x, '#bff0fa', 5, 18, 12, 26, 1); pline(x, '#bff0fa', 21, 26, 14, 32, 1); rect(x, '#ff5a5a', 10, 44, 6, 2); }],
    console: [18, 24, x => { rect(x, '#3a3f4e', 2, 10, 14, 14); rect(x, '#555b6e', 0, 8, 18, 3); rect(x, '#1c1f28', 3, 0, 12, 8); rect(x, '#22d3ee', 4, 1, 10, 6); rect(x, '#0b3a44', 5, 2, 6, 1); rect(x, '#0b3a44', 5, 4, 8, 1); rect(x, '#d9b45a', 5, 14, 3, 2); rect(x, '#ff5a5a', 10, 14, 3, 2); }],
    pod: [26, 40, x => { rect(x, '#5a6478', 0, 34, 26, 6); rect(x, '#e6e8ee', 3, 2, 20, 34); rect(x, '#b9c0ce', 3, 2, 4, 34); rect(x, '#6fd3e8', 8, 7, 12, 24); rect(x, '#bff0fa', 9, 8, 3, 22); rect(x, '#d9b45a', 3, 0, 20, 2); rect(x, '#39ff88', 11, 35, 4, 2); }],
    glyph: [18, 18, x => { pline(x, '#f5c542', 9, 1, 5, 8, 2); pline(x, '#f5c542', 5, 8, 12, 9, 2); pline(x, '#f5c542', 12, 9, 7, 17, 2); ring(x, '#22d3ee', 9, 9, 8); pline(x, '#fff7d0', 9, 2, 6, 7, 1); }],
    sign: [16, 20, x => { rect(x, '#5a4638', 7, 8, 2, 12); rect(x, '#8a6c46', 0, 0, 16, 10); rect(x, '#a88858', 1, 1, 14, 1); rect(x, '#3e3028', 3, 4, 10, 1); rect(x, '#3e3028', 3, 6, 7, 1); }],
    shelf: [22, 34, x => { rect(x, '#9aa2b4', 0, 0, 2, 34); rect(x, '#9aa2b4', 20, 0, 2, 34); for (let i = 0; i < 4; i++) { rect(x, '#b9c0ce', 0, 8 + i * 8, 22, 2); rect(x, ['#6fd3e8', '#d9b45a', '#ff5a5a', '#e6e8ee'][i], 4 + i * 3, 3 + i * 8, 4, 5); rect(x, '#e6e8ee', 12 - i, 4 + i * 8, 5, 4); } }],
    poster: [14, 18, x => { rect(x, '#e8dcc0', 0, 0, 14, 18); rect(x, '#8c6a4a', 0, 0, 14, 1); rect(x, '#3a3038', 4, 3, 6, 6); rect(x, '#c8a078', 5, 5, 4, 4); rect(x, '#b02a2a', 2, 11, 10, 2); rect(x, '#5a5048', 3, 14, 8, 1); }],
    screen: [40, 24, (x, c) => { rect(x, '#101224', 0, 0, 40, 24); rect(x, '#2a2c44', 0, 0, 40, 1); rect(x, '#2a2c44', 0, 23, 40, 1); const r = SW.rng(11); for (let i = 0; i < 8; i++) { const h = 3 + r() * 14 | 0; rect(x, i % 3 ? c : '#f5c542', 3 + i * 4.5, 20 - h, 3, h); } rect(x, '#ffffff', 3, 3, 14, 1); }],
    tent: [48, 32, (x, c) => { for (let i = 0; i < 16; i++) rect(x, i % 4 < 2 ? c : shade(c, 0.8), 24 - i * 1.5, i * 2, i * 3, 2); rect(x, '#2e241c', 20, 16, 8, 16); rect(x, '#5a4634', 23, 0, 2, 4); }],
    cart: [56, 30, x => { rect(x, '#6b5234', 4, 8, 44, 14); rect(x, '#8a6c46', 4, 8, 44, 2); rect(x, '#e8dcc0', 8, 0, 36, 9); rect(x, '#c8b890', 8, 6, 36, 3); disc(x, '#2e241c', 14, 24, 5); disc(x, '#8a6c46', 14, 24, 2); disc(x, '#2e241c', 40, 24, 5); disc(x, '#8a6c46', 40, 24, 2); rect(x, '#5a4634', 48, 14, 8, 2); }],
    firebarrel: [14, 16, x => { rect(x, '#3a3038', 1, 4, 12, 12); rect(x, '#5a4a4a', 2, 4, 3, 12); rect(x, '#1e181c', 1, 8, 12, 1); rect(x, '#c8642a', 2, 2, 10, 2); }],
    bed: [34, 14, x => { rect(x, '#5a6478', 0, 8, 34, 3); rect(x, '#e6e8ee', 1, 4, 32, 4); rect(x, '#2a9d8f', 12, 4, 20, 4); rect(x, '#5a6478', 1, 11, 2, 3); rect(x, '#5a6478', 31, 11, 2, 3); }],
    medcrate: [16, 14, x => { rect(x, '#e6e8ee', 0, 0, 16, 14); rect(x, '#b9c0ce', 0, 12, 16, 2); rect(x, '#d83a3a', 6, 3, 4, 8); rect(x, '#d83a3a', 4, 5, 8, 4); }],
    banner: [12, 34, (x, c) => { rect(x, '#5a4634', 5, 0, 2, 34); rect(x, c, 0, 2, 12, 18); rect(x, shade(c, 0.75), 0, 16, 12, 4); rect(x, '#f4f1ea', 4, 6, 4, 6); }],
    train: [120, 44, x => { rect(x, '#2e3a3a', 0, 6, 120, 34); rect(x, '#3e4e4c', 0, 6, 120, 4); rect(x, '#1e2828', 0, 34, 120, 6); for (let i = 0; i < 6; i++) { rect(x, '#0e1616', 6 + i * 19, 14, 13, 10); rect(x, '#243434', 6 + i * 19, 14, 13, 1); } rect(x, '#5a4030', 44, 12, 14, 22); rect(x, '#8a5a34', 0, 28, 120, 2); disc(x, '#141c1c', 18, 40, 4); disc(x, '#141c1c', 102, 40, 4); rect(x, '#39ff88', 70, 30, 9, 3); }],
    hatch: [34, 10, x => { rect(x, '#5a6070', 0, 2, 34, 8); rect(x, '#8a92a8', 0, 2, 34, 2); rect(x, '#f5c542', 2, 6, 6, 2); rect(x, '#f5c542', 14, 6, 6, 2); rect(x, '#f5c542', 26, 6, 6, 2); }],
    pump: [20, 30, x => { rect(x, '#5a6a6a', 4, 8, 12, 22); rect(x, '#7a8c8a', 5, 8, 3, 22); rect(x, '#3a4444', 2, 4, 16, 5); rect(x, '#c8642a', 8, 0, 4, 5); rect(x, '#6fd3e8', 8, 16, 4, 6); }],
    board: [30, 30, x => { rect(x, '#5a4638', 3, 14, 2, 16); rect(x, '#5a4638', 25, 14, 2, 16); rect(x, '#8a6c46', 0, 0, 30, 20); rect(x, '#a88858', 1, 1, 28, 1); rect(x, '#e8dcc0', 3, 4, 7, 9); rect(x, '#e8dcc0', 12, 3, 7, 9); rect(x, '#e8dcc0', 21, 5, 6, 9); rect(x, '#b02a2a', 4, 6, 5, 1); rect(x, '#b02a2a', 13, 5, 5, 1); }],
    cell: [30, 50, x => { rect(x, '#2b2f3a', 0, 0, 30, 4); rect(x, '#2b2f3a', 0, 46, 30, 4); rect(x, '#3e5c8a', 3, 4, 24, 42); rect(x, '#8b5cf6', 3, 4, 24, 2); rect(x, '#8b5cf6', 3, 44, 24, 2); for (let i = 0; i < 4; i++) rect(x, '#aef4ff', 5 + i * 6, 6, 1, 38); rect(x, '#d9b45a', 12, 47, 6, 2); }],
    chute: [34, 26, x => { rect(x, '#3a3f4e', 0, 0, 34, 26); rect(x, '#101218', 4, 4, 26, 22); rect(x, '#f5c542', 0, 0, 34, 2); for (let i = 0; i < 5; i++) rect(x, '#1c1f28', i * 8, 0, 4, 2); }],
    door: [22, 34, x => { rect(x, '#2a1418', 0, 0, 22, 34); rect(x, '#8e2430', 2, 2, 18, 32); rect(x, '#b83a48', 3, 3, 16, 2); rect(x, '#5a1620', 10, 2, 2, 32); rect(x, '#f5c542', 14, 18, 2, 3); rect(x, '#ff3ea5', 0, 0, 22, 1); }],
    bones: [18, 8, x => { rect(x, '#d8d4c4', 2, 5, 12, 2); rect(x, '#d8d4c4', 1, 4, 2, 4); rect(x, '#d8d4c4', 13, 4, 2, 4); disc(x, '#e8e4d4', 14, 3, 2); }],
    cage: [12, 40, x => { for (let i = 0; i < 3; i++) rect(x, '#5a6078', 1 + i * 4, 0, 2, 40); rect(x, '#8088a0', 0, 0, 12, 2); rect(x, '#8088a0', 0, 19, 12, 2); }],
    turbine: [14, 84, x => { rect(x, '#8c7a6a', 6, 10, 3, 74); rect(x, '#a89888', 6, 10, 1, 74); rect(x, '#5a4a40', 4, 80, 7, 4); disc(x, '#c8b8a0', 7, 9, 3); }]
  };
  art.prop = function (ctx, kind, x, y, col, flip) {
    const d = PROPS[kind];
    if (!d) return;
    const key = kind + (col || '');
    let c = art.props[key];
    if (!c) { const cv = SW.canvas(d[0], d[1]); d[2](cv[1], col); c = art.props[key] = cv[0]; }
    ctx.drawImage(c, Math.round(x - d[0] / 2), Math.round(y - d[1]));
  };
  art.propSize = kind => (PROPS[kind] ? [PROPS[kind][0], PROPS[kind][1]] : [16, 16]);

  // ---------- zone themes ----------
  art.themes = {
    slums:   { style: 'scrap', a: '#2b2e4e', b: '#222443', top: '#565c8c', hi: '#7f86bd', deep: '#14152b', plat: '#7a6238', sky: ['#0b0c1c', '#1a1c3a'], mid: 'shanty', midCol: '#10112a', bg: 'slums', dim: 0.38, haz: '#39ff88', win: ['#f5c542', '#ff3ea5', '#22d3ee'] },
    market:  { style: 'scrap', a: '#322a52', b: '#282046', top: '#6a4f98', hi: '#9a78d0', deep: '#16122c', plat: '#7a6238', sky: ['#0d0a20', '#221a44'], mid: 'shanty', midCol: '#130f2c', bg: 'market', dim: 0.42, haz: '#39ff88', win: ['#ff3ea5', '#22d3ee', '#f5c542'] },
    metro:   { style: 'brick', a: '#2c3c3a', b: '#223130', top: '#4e6a62', hi: '#739a8a', deep: '#0e1818', plat: '#5a5040', sky: ['#050c0c', '#0f201c'], mid: 'arches', midCol: '#091413', bg: 'metro', dim: 0.42, haz: '#5cff7a', win: ['#5cff7a'] },
    lab:     { style: 'panel', a: '#c2c8d4', b: '#aab2c0', top: '#f4f1ea', hi: '#ffffff', deep: '#7a8294', plat: '#7f93a8', sky: ['#8a96aa', '#c4ccd8'], mid: 'lab', midCol: '#7e889c', bg: 'medlab', dim: 0.3, haz: '#6fd3e8', win: ['#6fd3e8', '#ff5a5a'] },
    sky:     { style: 'plate', a: '#e4dfd2', b: '#cfc8b6', top: '#f8f5ee', hi: '#ffffff', deep: '#8f8a7c', plat: '#d9b45a', sky: ['#6fd3e8', '#f6e3b4'], mid: 'clouds', midCol: '#ffffff', bg: 'skyport', dim: 0.12, haz: '#6fd3e8', win: ['#d9b45a'] },
    surface: { style: 'dirt', a: '#9a5a30', b: '#84492a', top: '#d08a4a', hi: '#e8c48a', deep: '#4a2a1c', plat: '#6a5a4a', sky: ['#5f8a8b', '#e0a060'], mid: 'ruins', midCol: '#5a4038', bg: 'surface', dim: 0.1, haz: '#39ff88', win: ['#f5c542'] },
    arena:   { style: 'scrap', a: '#33304c', b: '#28263e', top: '#6a5a8a', hi: '#9a88c0', deep: '#14122a', plat: '#7a6238', sky: ['#0a0a1c', '#1c1838'], mid: 'stands', midCol: '#100e24', bg: 'pit', dim: 0.35, haz: '#39ff88', win: ['#ff3ea5', '#22d3ee'] }
  };

  art.bakeTiles = function (z) {
    const T = 16, th = art.themes[z.theme], [c, x] = SW.canvas(z.w * T, z.h * T), rnd = SW.rng(z.w * 31 + z.h * 7);
    const sol = (tx, ty) => (tx < 0 || tx >= z.w || ty >= z.h ? true : ty < 0 ? false : z.grid[ty][tx] === '#');
    const dk = shade(th.b, 0.7);
    for (let ty = 0; ty < z.h; ty++) for (let tx = 0; tx < z.w; tx++) {
      const ch = z.grid[ty][tx], px = tx * T, py = ty * T, r1 = rnd(), r2 = rnd();
      if (ch === '#') {
        const up = sol(tx, ty - 1), dn = sol(tx, ty + 1), lf = sol(tx - 1, ty), rt = sol(tx + 1, ty);
        if (up && dn && lf && rt && sol(tx - 1, ty - 1) && sol(tx + 1, ty - 1) && sol(tx - 1, ty + 1) && sol(tx + 1, ty + 1)) {
          rect(x, th.deep, px, py, T, T);
          if (r1 < 0.2) rect(x, shade(th.deep, 1.35), px + (r2 * 12 | 0), py + (r1 * 60 | 0) % 13, 3, 2);
          continue;
        }
        rect(x, th.a, px, py, T, T);
        if (th.style === 'scrap') {
          for (let i = 0; i < 4; i++) rect(x, th.b, px + i * 4 + 3, py, 1, T);
          if (r1 < 0.25) { rect(x, th.b, px + 3, py + 4, 10, 8); rect(x, dk, px + 3, py + 11, 10, 1); rect(x, th.top, px + 4, py + 5, 1, 1); rect(x, th.top, px + 11, py + 5, 1, 1); }
          else if (r1 < 0.4) rect(x, '#5a3a2a', px + (r2 * 9 | 0), py + 6, 5, 3);
        } else if (th.style === 'brick') {
          for (let r = 0; r < 4; r++) { rect(x, th.b, px, py + r * 4 + 3, T, 1); rect(x, th.b, px + (r % 2 ? 4 : 12), py + r * 4, 1, 3); }
          if (r1 < 0.2) rect(x, '#3a5a3a', px + (r2 * 10 | 0), py + 9, 4, 5);
        } else if (th.style === 'panel' || th.style === 'plate') {
          rect(x, th.b, px, py + 15, T, 1); rect(x, th.b, px + 15, py, 1, T);
          if (r1 < 0.12) rect(x, th.style === 'plate' ? '#d9b45a' : '#6fd3e8', px + 3, py + 4, 4, 1);
          else if (r1 < 0.2) rect(x, th.b, px + 4, py + 6, 8, 5);
        } else {
          rect(x, th.b, px, py + 5 + (r2 * 4 | 0), T, 2); rect(x, th.b, px + (r1 * 10 | 0), py + 11, 6, 2);
          if (r1 < 0.3) rect(x, th.top, px + (r2 * 12 | 0), py + 8, 2, 2);
        }
        if (!dn) rect(x, dk, px, py + 14, T, 2);
        if (!lf) rect(x, th.top, px, py, 1, T);
        if (!rt) rect(x, th.deep, px + 15, py, 1, T);
        if (!up) { rect(x, th.top, px, py, T, 3); rect(x, th.hi, px, py, T, 1); rect(x, dk, px, py + 3, T, 1); }
      } else if (ch === '=') {
        rect(x, th.plat, px, py, T, 4); rect(x, shade(th.plat, 1.4), px, py, T, 1); rect(x, shade(th.plat, 0.6), px, py + 4, T, 1);
        rect(x, shade(th.plat, 0.6), px + 3, py + 5, 1, 3); rect(x, shade(th.plat, 0.6), px + 12, py + 5, 1, 3);
      } else if (ch === 'H') {
        rect(x, '#8a7a50', px + 3, py, 2, T); rect(x, '#8a7a50', px + 11, py, 2, T);
        for (let i = 0; i < 4; i++) rect(x, '#b8a878', px + 3, py + 2 + i * 4, 10, 1);
      } else if (ch === '^') {
        for (let i = 0; i < 4; i++) { rect(x, '#c8ccd8', px + i * 4 + 1, py + 9, 2, 7); rect(x, '#8a92a8', px + i * 4, py + 13, 4, 3); rect(x, '#ffffff', px + i * 4 + 1, py + 8, 1, 2); }
      } else if (ch === 'G') {
        for (let i = 0; i < 4; i++) rect(x, '#5a6078', px + 1 + i * 4, py, 2, T);
        rect(x, '#8088a0', px, py + 7, T, 2);
      }
    }
    return c;
  };

  // ---------- backdrops ----------
  ['slums', 'market', 'metro', 'medlab', 'skyport', 'surface', 'pit', 'title', 'mem_kael', 'mem_nyra', 'hero_kael', 'hero_nyra', 'hero_fenn', 'hero_isolde', 'hero_brakk', 'hero_pyra', 'hero_gale', 'hero_ashka', 'hero_dyna', 'hero_vesper'].forEach(n => {
    const im = new Image();
    im.onload = () => { art.bg[n] = im; };
    im.src = 'assets/bg/' + n + '.png';
  });
  art.mid = function (themeId) {
    if (art.mids[themeId]) return art.mids[themeId];
    const th = art.themes[themeId], W = 512, H = 300, [c, x] = SW.canvas(W, H), r = SW.rng(themeId.length * 97 + themeId.charCodeAt(0));
    const col = th.midCol;
    if (th.mid === 'shanty') {
      for (let bx = 0; bx < W; ) {
        const w = 26 + (r() * 30 | 0), h = 70 + (r() * 150 | 0);
        rect(x, col, bx, H - h, w - 3, h); rect(x, shade(th.a, 0.55), bx, H - h, w - 3, 2);
        for (let wy = H - h + 8; wy < H - 30; wy += 14) for (let wx = bx + 4; wx < bx + w - 9; wx += 9) if (r() < 0.1) rect(x, shade(th.win[(r() * th.win.length) | 0], 0.5), wx, wy, 2, 3);
        if (r() < 0.5) rect(x, col, bx + 4, H - h - 12, 3, 12);
        bx += w;
      }
      for (let i = 0; i < 5; i++) { const y = 20 + r() * 80; rect(x, col, 0, y, W, 3); rect(x, shade(th.a, 0.5), 0, y, W, 1); }
    } else if (th.mid === 'arches') {
      for (let bx = 0; bx < W; bx += 128) {
        rect(x, col, bx, 0, 22, H); rect(x, shade(th.a, 0.5), bx + 20, 0, 2, H);
        for (let i = 0; i < 12; i++) rect(x, col, bx + 22 + i * 2, 0, 2, 40 - i * 3), rect(x, col, bx + 126 - i * 2, 0, 2, 40 - i * 3);
        if (r() < 0.7) rect(x, th.win[0], bx + 60 + (r() * 30 | 0), 60 + (r() * 40 | 0), 3, 2);
      }
      rect(x, col, 0, 0, W, 14);
    } else if (th.mid === 'lab') {
      for (let bx = 0; bx < W; bx += 64) { rect(x, col, bx, 0, 6, H); rect(x, shade(col, 1.2), bx + 6, 0, 1, H); rect(x, shade(col, 1.12), bx + 10, 40, 50, 1); rect(x, shade(col, 1.12), bx + 10, 150, 50, 1); if (r() < 0.6) rect(x, th.win[r() < 0.75 ? 0 : 1], bx + 20, 20, 24, 3); }
      rect(x, col, 0, 0, W, 10);
    } else if (th.mid === 'clouds') {
      for (let i = 0; i < 22; i++) { const cx = r() * W, cy = 150 + r() * 130, w = 40 + r() * 80; for (let k = 0; k < 4; k++) { const ww = w * (1 - k * 0.22); rect(x, k ? '#fdf6e6' : '#ffffff', cx - ww / 2, cy - k * 4, ww, 5); rect(x, '#fdf6e6', cx - ww / 2 - W, cy - k * 4, ww, 5); rect(x, '#fdf6e6', cx - ww / 2 + W, cy - k * 4, ww, 5); } }
    } else if (th.mid === 'ruins') {
      for (let bx = 0; bx < W; ) {
        const w = 18 + (r() * 40 | 0), h = 20 + (r() * 90 | 0);
        if (r() < 0.6) { rect(x, col, bx, H - 40 - h, w, h + 40); for (let k = 0; k < 4; k++) rect(x, col, bx + r() * w, H - 44 - h - r() * 8, 3, 10); for (let wy = H - 36 - h; wy < H - 50; wy += 10) for (let wx = bx + 3; wx < bx + w - 4; wx += 7) if (r() < 0.3) rect(x, shade(col, 0.7), wx, wy, 3, 4); }
        bx += w + (r() * 30 | 0);
      }
      rect(x, col, 0, H - 44, W, 44);
    } else if (th.mid === 'stands') {
      for (let row = 0; row < 7; row++) {
        const y = 60 + row * 24;
        rect(x, shade(col, 1.0 + row * 0.12), 0, y, W, 24); rect(x, shade(th.a, 0.6), 0, y, W, 1);
        for (let i = 0; i < 60; i++) { const px = r() * W; rect(x, shade(col, 0.6), px, y - 6, 5, 7); rect(x, r() < 0.12 ? th.win[(r() * 2) | 0] : shade(col, 0.6), px + 1, y - 9, 3, 3); }
      }
      for (let bx = 0; bx < W; bx += 16) rect(x, shade(th.a, 0.8), bx, 40, 1, H);
    }
    return (art.mids[themeId] = c);
  };

  // ---------- boot ----------
  Object.assign(art, { bake, custom, HEADS, WEAPONS, POSES, SETS });   // so expansion files (heroes4.js) can add sprites of their own
  art.init = function () {
    Object.keys(CAST).forEach(id => bake(id, CAST[id][1], CAST[id][0]));
    bakeCreatures();
  };
})();
