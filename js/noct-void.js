'use strict';
// Shattered Worlds — Noct the void (the user, 2026-11-20: "Noct the void"). His story: "a hooded swordsman in matte black
// and dark teal, his face lost in shadow except for one glowing teal eye, gripping a hilt whose blade is only a thin
// teal outline in the air"; "the cut arrives. He does not"; Halcyon kept him in "a room with no shadows in it". So
// nothing of his travels: a hairline appears where the cut will be, then it opens, black inside with teal lips. His
// crescent is only an edge with the dark inside it darker than the world. Hairlines and pixel cuts drawn as lines;
// the hood and eye are a pixel sprite. Draw-only: every hit, hitbox and timing stays as it was. After js/tessa-clock.js.
//   J      each blow leaves a hairline that opens into a cut
//   U      Unseen Cut: a hairline appears on the target, then opens
//   S+U    Afterimage: an outline of a cut hangs in the air, breathing, and opens twice
//   I      Null Crescent: a crescent drawn only as its teal edge, the inside blacker than the background
//   S+I    Lights Out: the screen goes black but for his one eye, then he is above the target
//   W+O    Blink Strike: a teal glint marks where he reappears; an outline of him is left where he was
//   S+O    Quiet Mind: the eye burns brighter     O  Eclipse Form: a dark ring of shadow close round him (both small)
//   W+I    Last Light: in the finish (js/ult-grand.js) his hood looms beside the target with its one eye; a single teal
//          line splits the screen through the target, and on the impact frame everything on one side slides off it
// SW.noctVoid.on = false turns the drawing off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, N = SW.ninja, rand = SW.rand, PX = SW.pix;
  const P = SW.Player && SW.Player.prototype, Proj = SW.Proj, CASTS = SW.casts;
  if (!N || !P || !PX || !PX.impact || !PX.over || !Proj || !art || !art.line || !CASTS || !CASTS.unseen_cut || !CASTS.afterimage || !CASTS.null_crescent || !SW.data.heroes.noct) return;
  const NV = SW.noctVoid = { on: true };
  const isN = g => !!(NV.on && g && g.state && g.state.hero === 'noct');
  const PI = Math.PI, Vis = N.Vis, part = N.part, R = Math.round, W = SW.W, H = SW.H;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const poly = (c, pts, col) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); };
  const TEAL = '#5ad6c8', PALE = '#d8fff8', DEEP = '#1f6a64', VOID = '#020305';

  // a cut: from (x, y) along ang, L long; k 0 = a hairline, 1 = wide open; a = alpha
  function cut(ctx, x, y, ang, L, k, a) {
    const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca, h = L / 2, w = Math.max(0, Math.min(8, L * 0.11) * ease(k));
    ctx.save(); ctx.globalAlpha *= clamp01(a === undefined ? 1 : a);
    if (w >= 1) {   // open: black inside, teal lips
      ctx.beginPath(); ctx.moveTo(x - ca * h, y - sa * h); ctx.quadraticCurveTo(x + nx * w, y + ny * w, x + ca * h, y + sa * h); ctx.quadraticCurveTo(x - nx * w, y - ny * w, x - ca * h, y - sa * h); ctx.closePath(); ctx.fillStyle = VOID; ctx.fill();
      ctx.imageSmoothingEnabled = false; ctx.lineWidth = 1; ctx.strokeStyle = TEAL; ctx.stroke();
      art.line(ctx, PALE, R(x - ca * h), R(y - sa * h), R(x - ca * h * 0.6), R(y - sa * h * 0.6), 1); art.line(ctx, PALE, R(x + ca * h), R(y + sa * h), R(x + ca * h * 0.6), R(y + sa * h * 0.6), 1);
    } else {   // a hairline
      art.line(ctx, TEAL, R(x - ca * h), R(y - sa * h), R(x + ca * h), R(y + sa * h), 1);
      art.rect(ctx, PALE, R(x) - 1, R(y), 3, 1);
    }
    ctx.restore();
  }
  // the one eye: a teal glint, r its size
  function eye(ctx, x, y, r, a) {
    x = R(x); y = R(y); ctx.save(); ctx.globalAlpha *= clamp01(a === undefined ? 1 : a);
    art.rect(ctx, DEEP, x - r * 2, y, r * 4 + 1, 1); art.rect(ctx, TEAL, x - r, y, r * 2 + 1, 1); art.rect(ctx, TEAL, x, y - Math.max(1, r >> 1), 1, Math.max(1, r >> 1) * 2 + 1); art.rect(ctx, PALE, x, y, 1, 1);
    if (r >= 3) { art.rect(ctx, PALE, x - 1, y, 3, 1); art.rect(ctx, TEAL, x - r * 3, y, r, 1); art.rect(ctx, TEAL, x + r * 2 + 1, y, r, 1); }
    ctx.restore();
  }
  // the crescent: its tips toward the back, (x, y) its middle, h tall, dir which way it flies
  function crescent(ctx, x, y, h, dir, t) {
    const o = h / 2, bulge = h * 0.34, back = h * 0.12;
    const path = c => { c.beginPath(); c.moveTo(x - dir * back, y - o); c.quadraticCurveTo(x + dir * bulge * 2, y, x - dir * back, y + o); c.quadraticCurveTo(x + dir * bulge * 0.6, y, x - dir * back, y - o); c.closePath(); };
    ctx.save(); path(ctx); ctx.fillStyle = VOID; ctx.fill(); ctx.restore();   // darker than the world
    ctx.save(); ctx.imageSmoothingEnabled = false; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x - dir * back, y - o); ctx.quadraticCurveTo(x + dir * bulge * 2, y, x - dir * back, y + o); ctx.strokeStyle = TEAL; ctx.stroke();   // the edge: the only lit part
    ctx.beginPath(); ctx.moveTo(x - dir * back, y - o * 0.5); ctx.quadraticCurveTo(x + dir * bulge * 1.9, y, x - dir * back, y + o * 0.5); ctx.strokeStyle = PALE; ctx.globalAlpha = 0.6; ctx.stroke();
    ctx.restore();
    for (let i = 0; i < 3; i++) { const u = ((t * 0.12 + i / 3) % 1) * 2 - 1, yy = y + u * o * 0.9, xx = x - dir * back + dir * bulge * 2 * (1 - u * u) * 0.5; art.rect(ctx, PALE, R(xx), R(yy), 1, 1); }
  }
  // the hood, close: (0, 0) the middle, s tall, facing +x
  function hoodVec(c, s) {
    poly(c, [[-s * 0.46, s * 0.5], [-s * 0.42, -s * 0.06], [-s * 0.2, -s * 0.44], [s * 0.14, -s * 0.52], [s * 0.4, -s * 0.3], [s * 0.48, s * 0.1], [s * 0.4, s * 0.5]], '#162226');
    poly(c, [[-s * 0.42, -s * 0.06], [-s * 0.2, -s * 0.44], [s * 0.14, -s * 0.52], [-s * 0.1, -s * 0.36]], '#243a3c');
    poly(c, [[-s * 0.06, s * 0.5], [-s * 0.12, -s * 0.12], [s * 0.1, -s * 0.32], [s * 0.36, -s * 0.16], [s * 0.42, s * 0.2], [s * 0.3, s * 0.5]], '#05080a');
    poly(c, [[-s * 0.46, s * 0.5], [-s * 0.3, s * 0.36], [-s * 0.16, s * 0.5]], '#0e1618');
  }
  Object.assign(NV, { cut, eye, crescent });
  const motes = (x, y, n, pw) => { for (let i = 0; i < n; i++) part(x + rand(-6, 6), y + rand(-6, 6), i % 3 ? '#1a1430' : TEAL, rand(-pw, pw), rand(-pw, pw), 18, 2, 0); };

  // ================= U: Unseen Cut: a hairline, then it opens =================
  const _uc = CASTS.unseen_cut;
  CASTS.unseen_cut = function (p, z) {
    const e = N.nearest ? N.nearest(z, p.x + p.face * 70, p.y - 16, 200) : null, r = _uc.apply(this, arguments);
    if (!isN(G)) return r;
    const x = e ? e.x : p.x + p.face * 72, y = e ? e.y - (e.h || 34) / 2 : p.y - 18, ang = p.face > 0 ? -0.7 : PI + 0.7;
    z.shots.push(new Vis(x, y, 18, (ctx, sx, sy, t) => { cut(ctx, sx, sy, ang, 74, t < 3 ? 0 : (t - 3) / 5, t > 12 ? (18 - t) / 6 : 1); if (t >= 3 && t < 9) cut(ctx, sx, sy, ang + (ang > 0 ? -1.2 : 1.2), 40, (t - 3) / 4, 1 - (t - 3) / 6); if (t < 3) eye(ctx, sx, sy, 2); }, v => { if (e && !e.dead) { v.x = e.x; v.y = e.y - (e.h || 34) / 2; } }));
    return r;
  };

  // ================= S+U: Afterimage: an outline of a cut hangs in the air, and opens twice =================
  const _ai = CASTS.afterimage;
  CASTS.afterimage = function (p, z) {
    const n0 = z.shots.length, r = _ai.apply(this, arguments);
    if (!isN(G)) return r;
    const m = z.shots.slice(n0).find(s => s.n === 44 && typeof s.draw === 'function'), f = p.face;
    if (m) {
      m.draw = function (ctx, cam) {
        const x = R(this.x - cam.x), y = R(this.y - cam.y), b = 0.5 + 0.5 * Math.sin(this.n * 0.5);
        cut(ctx, x, y, f > 0 ? -0.75 : PI + 0.75, 70, 0, 0.6 + 0.4 * b); cut(ctx, x, y, f > 0 ? 0.75 : PI - 0.75, 70, 0, 0.6 + 0.4 * (1 - b));   // two hairlines waiting
        if (this.n < 6) { eye(ctx, x, y, 3); }
      };
      const x = m.x, y = m.y;
      z.shots.push(new Vis(x, y, 60, (ctx, sx, sy, t) => { if (t < 44) return; const k = t - 44; cut(ctx, sx, sy, f > 0 ? -0.75 : PI + 0.75, 76, k / 4, k > 10 ? (16 - k) / 6 : 1); cut(ctx, sx, sy, f > 0 ? 0.75 : PI - 0.75, 76, (k - 3) / 4, k > 12 ? (16 - k) / 4 : 1); }));
    }
    return r;
  };

  // ================= S+I: Lights Out =================
  const BU = SW.moves && SW.moves.BURST && SW.moves.BURST.noct;
  if (BU && BU.cast) {
    const _lo = BU.cast;
    BU.cast = function (p, z) {
      const x0 = p.x, y0 = p.y, r = _lo.apply(this, arguments);
      if (!isN(G)) return r;
      const f0 = SW.frame || 0; let n = 0;
      PX.over((ctx, cam) => {
        const t = Math.max(0, (SW.frame || 0) - f0); if (t > 14 || ++n > 40) return false;
        const a = t < 8 ? 0.94 : 0.94 * (1 - (t - 8) / 6);
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = VOID; ctx.fillRect(0, 0, W, H); ctx.restore();   // the light goes
        const ex = t < 5 ? x0 : p.x, ey = (t < 5 ? y0 : p.y) - 34;   // only his eye is left, then it is above them
        eye(ctx, ex - cam.x + p.face * 2, ey - cam.y, 3, 1);
      });
      return r;
    };
  }

  // ================= W+O: Blink Strike =================
  const SIG = SW.signature && SW.signature.SIG && SW.signature.SIG.noct;
  if (SIG && SIG.cast) {
    const _bs = SIG.cast;
    SIG.cast = function (p, z) {
      const x0 = p.x, y0 = p.y, sheet = p.sheet && p.sheet(), r = _bs.apply(this, arguments);
      if (!isN(G)) return r;
      const x1 = p.x, y1 = p.y, d = p.face;
      z.shots.push(new Vis(x1, y1, 16, (ctx, sx, sy, t) => {
        const ox = R(x0 - G.cam.x), oy = R(y0 - G.cam.y);
        if (sheet && art.draw) { ctx.save(); ctx.globalAlpha = 0.5 * (1 - t / 16); ctx.globalCompositeOperation = 'source-over'; art.draw(ctx, sheet, 'idle', 0, ox, oy, d < 0, { alpha: 0.35, flash: t % 4 < 2 }); ctx.restore(); }   // the outline he left
        eye(ctx, sx + d * 3, sy - 34, t < 4 ? 4 : 2, 1 - t / 16);   // the glint where he is
        cut(ctx, sx + d * 16, sy - 20, d > 0 ? -0.5 : PI + 0.5, 40, t / 4, t > 10 ? (16 - t) / 6 : 1);
      }));
      return r;
    };
  }

  // ================= his crescent =================
  function dress(z) {
    z.shots.forEach(s => {
      if (s.nv !== undefined) return;
      s.nv = 0;
      if (s instanceof Proj && s.render && s.w === 22 && s.h === 48 && s.pierce && s.ghost) { s.nv = 1; s.render = (ctx, x, y, q) => crescent(ctx, x, y, 50, Math.sign(q.vx) || 1, q.t); }
    });
  }

  // ================= J: hairlines that open; the small auras =================
  function aura(ctx, p, sx, sy, front) {
    const d = p.face, a = p.atk;
    if (front && a && (p.state === 'attack' || p.state === 'airatk')) {
      const k = p.st - a.hitAt;
      if (k >= 0 && k < 10) {
        const big = a.heavy || a.down, reach = a.box ? a.box[0] + a.box[2] * 0.6 : 22, hy = sy + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), up = a.anim === 'launcher';
        const ang = up ? (d > 0 ? -1.2 : PI + 1.2) : (a.hitAt % 2 ? (d > 0 ? -0.5 : PI + 0.5) : (d > 0 ? 0.45 : PI - 0.45));
        cut(ctx, sx + d * reach, hy, ang, big ? 46 : 32, k < 2 ? 0 : (k - 2) / 4, k > 6 ? (10 - k) / 4 : 1);
        if (k === 0) motes(p.x + d * reach, p.y + (a.box ? a.box[1] + a.box[3] * 0.5 : -22), 3, 1.5);
      }
    }
    if (!front && p.awakeT > 0) {   // Eclipse Form: a ring of shadow close round him (small)
      const fade = Math.min(1, p.awakeT / 30);
      ctx.save(); ctx.globalAlpha = 0.45 * fade; ctx.fillStyle = VOID; ctx.beginPath(); ctx.ellipse(sx, sy - 20, 20, 26, 0, 0, PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.5 * fade; ctx.strokeStyle = DEEP; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx, sy - 20, 20, 26, 0, 0, PI * 2); ctx.stroke(); ctx.restore();
    }
    if (front && (p.modeT > 0 || p.awakeT > 0)) eye(ctx, sx + d * 2, sy - 35, p.modeT > 0 && p.t % 24 < 8 ? 3 : 2, Math.min(1, Math.max(p.modeT || 0, p.awakeT || 0) / 30));   // Quiet Mind: the eye burns brighter (small)
  }
  const _pd = P.draw;
  P.draw = function (ctx, cam, g) {
    const on = isN(g || this.G) && !this.dead, sx = R(this.x - cam.x), sy = R(this.y - cam.y);
    if (on) aura(ctx, this, sx, sy, false);
    const r = _pd.apply(this, arguments);
    if (on) aura(ctx, this, sx, sy, true);
    return r;
  };
  const _pu = P.update;
  P.update = function (g, z) {
    const a0 = this.awakeT || 0, r = _pu.apply(this, arguments);
    if (!isN(g || this.G) || !z || !z.shots) return r;
    dress(z); if (G.zone && G.zone !== z && G.zone.shots) dress(G.zone);
    if (!this.dead && this.awakeT > a0 + 60) motes(this.x, this.y - 24, 14, 2.4);   // Eclipse Form begins (small and short)
    return r;
  };

  // ================= W+I: Last Light, the finish =================
  const _uf = SW.ultFx;
  if (_uf) SW.ultFx = function (p, g, z, foes) {
    const r = _uf.apply(this, arguments);
    if (!isN(g) || p.st !== 6) return r;
    const T = foes.filter(e => e && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    const UG = SW.ultGrand, pl = UG && UG.on && UG.planOf ? UG.planOf('noct') : null;
    if (T && pl) finale(p, z, T, pl.fin, Math.max(74, pl.fin - 30));
    return r;
  };
  // js/ult-grand.js builds up from BU2 and lands its finishing blow at FIN
  function finale(p, z, T, FIN, BU2) {
    const dir = T.x >= p.x ? 1 : -1, ANG = -0.42 * dir;
    const v = new Vis(T.x, T.y, 500, null, vv => { if (T && !T.dead) { vv.x = T.x; vv.y = T.y; } if (p.state !== 'ult') vv.gone = true; });
    z.shots.push(v);
    PX.over((ctx, cam) => {
      if (v.gone || p.state !== 'ult') return false;
      const st = p.st; if (st < BU2 - 2 || st > FIN + 22) return;
      const sx = R(v.x - cam.x), sy = R(v.y - cam.y), cy = sy - 20, ca = Math.cos(ANG), sa = Math.sin(ANG), L = 400;
      if (st < FIN) {
        const k = ease((st - (BU2 - 2)) / 8), line = ease((st - (FIN - 12)) / 6);
        ctx.save(); ctx.globalAlpha = 0.5 * k; ctx.fillStyle = VOID; ctx.fillRect(0, 0, W, H); ctx.restore();   // the light drains out
        PX.sprite(ctx, sx - dir * 66, cy - 6, 70, 70, c => { c.scale(dir, 1); hoodVec(c, 56); }, { pal: ['#05080a', '#0e1618', '#162226', '#243a3c'], outline: DEEP, alpha: k });
        eye(ctx, sx - dir * 66 + dir * 8, cy - 14, st > FIN - 14 ? 4 : 3, k);
        if (line > 0) { const h = L * line; art.line(ctx, TEAL, R(sx - ca * h), R(cy - sa * h), R(sx + ca * h), R(cy + sa * h), 1); }   // one hairline splits the screen
      } else {   // and everything on one side of it slides off
        const k = (st - FIN) / 22, ik = (st - FIN) / 5, slip = ease(Math.min(1, (st - FIN - 2) / 8)) * 7 * (1 - ease((k - 0.6) / 0.4));
        if (ik < 0.5) { ctx.save(); ctx.fillStyle = VOID; ctx.fillRect(0, 0, W, H); ctx.restore(); art.line(ctx, PALE, R(sx - ca * L), R(cy - sa * L), R(sx + ca * L), R(cy + sa * L), 3); eye(ctx, sx - dir * 58, cy - 14, 5); return; }
        const c0 = ctx.canvas, kk = c0.width / W, nx = -sa, ny = ca;
        if (slip > 0.3) {
          ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.beginPath(); const P0 = [(sx - ca * L) * kk, (cy - sa * L) * kk], P1 = [(sx + ca * L) * kk, (cy + sa * L) * kk];
          ctx.moveTo(P0[0], P0[1]); ctx.lineTo(P1[0], P1[1]); ctx.lineTo(P1[0] - nx * L * kk, P1[1] - ny * L * kk); ctx.lineTo(P0[0] - nx * L * kk, P0[1] - ny * L * kk); ctx.closePath(); ctx.clip();
          ctx.imageSmoothingEnabled = false; ctx.drawImage(c0, R(ca * slip * kk), R(sa * slip * kk));   // the upper half slides along the cut
          ctx.restore();
        }
        ctx.save(); ctx.globalAlpha = 1 - ease((k - 0.5) / 0.5);
        art.line(ctx, VOID, R(sx - ca * L), R(cy - sa * L) + 1, R(sx + ca * L), R(cy + sa * L) + 1, 2); art.line(ctx, TEAL, R(sx - ca * L), R(cy - sa * L), R(sx + ca * L), R(cy + sa * L), 1);
        ctx.restore();
        if (st === FIN + 3) motes(T.x, T.y - 18, 24, 4);
      }
    });
  }
})();
