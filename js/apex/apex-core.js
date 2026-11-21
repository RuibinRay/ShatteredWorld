'use strict';
// Shattered Worlds — APEX: the sixteen strongest heroes (the user, 2026-11-20: "rank strongest 16 heros through multiple
// tournaments and improve their ability look and ult look with zoom and a cinematic effect and their weapons and melee
// combos and you can adjust their skill and everything improved, ignore balance"). The ranking: game2 world/
// strongest-16.md (four tournaments, 3,722 Nightmare rounds, tools/nk-rank.js).
// This file is the shared kit; each hero has a file of its own in js/apex/ that calls SW.apex.reg(hero, def):
//   def.ult      its own cinematic ultimate, run by js/ult-grand.js (which asks SW.apex.ult(hero)):
//                  len, fin (the blow), own (frames of the old ultimate kept), bu (the build-up starts), c (colours)
//                  zoom(st)  the camera: { z, bars, on: 'hero' | 'target' | 'mid', dx, dy } (AP.shots makes one)
//                  every(st, o) / build(k, dur, o) / finish(o) / pose(st, p) / card(ctx, st, zm, h, u)
//                  look(st, o)  the film around it: { impact: 'ink' | 'neg' | 'red', lines: n, grade: [col, a],
//                               vig: a, split: px } for this frame (drawn over the finished frame)
//   def.weapon   a weapon of its own, baked into its sprites: { name, len, w, col, hi, hilt, armed, draw(...) }
//                (same contract as js/weapon-looks.js)
//   def.melee    its J chain: { swing(ctx, q, x, y, t) | kinds: [...], hit(x, y, n, p) } (replaces js/herostyle.js's
//                marks for that hero; q.n is the hit of the chain, 0-3, q.air in the air, q.fin the last hit)
//   def.tune     Versus only: { dmg, hp } multipliers (they replace the balance tables' numbers for the hero)
//   def.init()   anything else (its skills' looks): called once the game has loaded
// The film tricks here (impact frames, speed lines, grade, vignette, colour split, hit-stop) only draw; the hit-stop
// pauses the whole fight for a few frames at a blow (G.hitstop, as every heavy hit does).
// SW.apex.on = false turns every apex hero back to what it was (their files also check it).
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, V = SW.versus;
  const P = SW.Player && SW.Player.prototype, W = SW.W, H = SW.H, R = Math.round, PI = Math.PI;
  if (!art || !fx || !P || !D) return;
  const TOP = ['itsuki', 'corvin', 'tessa', 'orin', 'noct', 'mira', 'vega', 'jax', 'sen', 'rook', 'ferra', 'apis', 'hex', 'maren', 'bando', 'vex'];
  const AP = SW.apex = { on: true, film: true, melee: true, weapons: true, TOP, defs: {}, inits: [] };
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const easeOut = t => { t = clamp01(t); return 1 - (1 - t) * (1 - t) * (1 - t); };
  Object.assign(AP, { clamp01, ease, easeOut, R, PI });
  AP.reg = function (id, def) { AP.defs[id] = def; if (def.init) AP.inits.push(def.init); };
  AP.ult = id => (AP.on && AP.defs[id] && AP.defs[id].ult) || null;
  AP.is = (g, id) => !!(AP.on && g && g.state && g.state.hero === id && AP.defs[id]);
  const heroOf = p => { try { const g = p && p.G; return g && g.state ? g.state.hero : G.state && G.state.hero; } catch (e) { return null; } };
  AP.heroOf = heroOf;

  // ---------- the camera: keyframes -> a zoom function for js/ult-grand.js ----------
  // keys: [[st, z, bars, on, dx, dy], ...]; between two keys it eases; on/dx/dy come from the key it is leaving
  AP.shots = function (keys) {
    return st => {
      if (st < keys[0][0] || st > keys[keys.length - 1][0]) return { z: 1, bars: 0 };
      let i = 0; while (i < keys.length - 2 && st >= keys[i + 1][0]) i++;
      const a = keys[i], b = keys[i + 1], k = b[0] > a[0] ? ease((st - a[0]) / (b[0] - a[0])) : 1;
      const cut = a[6] === 'cut';   // a hard cut: hold the key's framing until the next
      return { z: cut ? a[1] : a[1] + (b[1] - a[1]) * k, bars: cut ? a[2] : a[2] + (b[2] - a[2]) * k, on: a[3] || 'hero', dx: a[4] || 0, dy: a[5] || 0 };
    };
  };

  // ---------- effects with their own drawing (front or back of the others) ----------
  // AP.fx({ x, y, life, draw(ctx, q, x, y, t, cam), back }) — t runs 0 -> 1 over its life; x, y are world positions
  AP.fx = function (o) { const q = Object.assign({ k: 'APX', x: 0, y: 0, life: 12 }, o); q.max = q.max || q.life; fx.list.push(q); return q; };
  const _fd = fx.draw;
  fx.draw = function (ctx, cam) {
    let any = false; for (const q of fx.list) if (q.k === 'APX') { any = true; break; }
    if (!any) return _fd.apply(this, arguments);
    const all = fx.list, back = [], front = [], rest = [];
    for (const q of all) (q.k === 'APX' ? (q.back ? back : front) : rest).push(q);
    const one = q => { const t = 1 - q.life / q.max; ctx.save(); try { q.draw(ctx, q, R(q.x - cam.x), R(q.y - cam.y), t, cam); } catch (e) { q.life = 0; console.error(e); } ctx.restore(); };
    try { back.forEach(one); fx.list = rest; _fd.call(this, ctx, cam); } finally { fx.list = all; }
    front.forEach(one);
  };

  // ---------- drawing helpers (pixel-style: no smoothing) ----------
  const D2 = AP.draw = {
    // a tapered crescent: centre, radius, from angle a0 to a1 (radians, 0 = facing), width w at its middle
    crescent(ctx, cx, cy, r, a0, a1, w, face, cols, k) {
      const n = Math.max(6, R(Math.abs(a1 - a0) * r / 3)), f = face || 1;
      for (let pass = 0; pass < cols.length; pass++) {
        const ww = w * (1 - pass / cols.length);
        for (let i = 0; i <= n; i++) {
          const u = i / n, a = a0 + (a1 - a0) * u, th = Math.max(1, R(ww * Math.sin(u * PI) * (k === undefined ? 1 : k)));
          const x = cx + Math.cos(a) * r * f, y = cy + Math.sin(a) * r;
          art.rect(ctx, cols[pass], R(x - th / 2), R(y - th / 2), th, th);
        }
      }
    },
    // a straight streak with a bright head
    streak(ctx, x0, y0, x1, y1, w, cols) { cols.forEach((c, i) => art.line(ctx, c, R(x0), R(y0), R(x1), R(y1), Math.max(1, w - i * 2))); },
    // a jagged star burst (impact)
    burst(ctx, x, y, r, n, cols, rot) {
      for (let i = 0; i < n; i++) { const a = (rot || 0) + i * 2 * PI / n, rr = i % 2 ? r : r * 0.45; art.line(ctx, cols[i % cols.length], R(x), R(y), R(x + Math.cos(a) * rr), R(y + Math.sin(a) * rr), i % 2 ? 2 : 1); }
      art.rect(ctx, '#ffffff', R(x) - 2, R(y) - 2, 4, 4);
    },
    ring(ctx, x, y, r, col, w) { for (let i = 0; i < (w || 1); i++) art.ring(ctx, col, R(x), R(y), Math.max(1, R(r) - i)); },
    glow(ctx, x, y, r, col, a) { if (art.glow) art.glow(ctx, R(x), R(y), R(r), col, a); },
    // a filled pixel disc
    disc(ctx, x, y, r, col) { art.disc(ctx, col, R(x), R(y), Math.max(1, R(r))); }
  };

  // ---------- the film: what the current apex ultimate wants drawn over this frame ----------
  const UG = () => SW.ultGrand;
  function caster() {
    if (!AP.on || !AP.film) return null;
    if (G.scene === 'vs' && V && V.f && V.phase === 'fight') { const f = V.f.find(x => AP.defs[x.hero] && AP.defs[x.hero].ult && x.p.state === 'ult' && x.p.ugrand); return f ? { p: f.p, hero: f.hero, T: (V.f.find(y => y !== f) || {}).p } : null; }
    if (G.scene === 'play' && G.state && AP.defs[G.state.hero] && AP.defs[G.state.hero].ult && G.player && G.player.state === 'ult' && G.player.ugrand) return { p: G.player, hero: G.state.hero, T: null };
    return null;
  }
  AP.caster = caster;
  const tmp = document.createElement('canvas'), tc = tmp.getContext('2d');
  function snap(c) { if (tmp.width !== c.width || tmp.height !== c.height) { tmp.width = c.width; tmp.height = c.height; } tc.setTransform(1, 0, 0, 1, 0, 0); tc.filter = 'none'; tc.clearRect(0, 0, c.width, c.height); tc.drawImage(c, 0, 0); }
  function film(ctx) {
    const cs = caster(); if (!cs) return;
    const def = AP.defs[cs.hero], u = def.ult, st = cs.p.st; if (!u.look) return;
    const T = cs.T, L = u.look(st, { p: cs.p, T }); if (!L) return;
    const c = ctx.canvas, k = c.width / W;
    // the screen position of the focus (for speed lines and the vignette): the zoom is already applied, so aim at the centre
    // of where the camera looks, or at the target
    const zm = UG() && UG().zoomAt ? UG().zoomAt(cs.p.ugrand.pl, st) : { z: 1 };
    let fxp = W / 2, fyp = H / 2;
    if (!(zm.z > 1.01)) { const tg = L.at === 'hero' || !T ? cs.p : T; fxp = tg.x - G.cam.x; fyp = tg.y - 22 - G.cam.y; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
    if (L.impact) {   // an impact frame: the whole picture as ink, a negative, or blood-red
      snap(c);
      ctx.filter = L.impact === 'neg' ? 'invert(1) grayscale(1) contrast(3)' : 'grayscale(1) contrast(6) brightness(1.15)';
      ctx.drawImage(tmp, 0, 0); ctx.filter = 'none';
      const tint = L.impact === 'red' ? '#d0102a' : L.impact === 'gold' ? '#ffc23a' : L.impact === 'tint' ? L.tint : null;   // ink, then the white parts take a colour
      if (tint) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = tint; ctx.fillRect(0, 0, c.width, c.height); ctx.globalCompositeOperation = 'source-over'; }
    }
    if (L.split) {   // colour split: the picture twice, offset, in two colours
      snap(c); const s = R(L.split * k);
      ctx.globalAlpha = 0.35; ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'sepia(1) saturate(6) hue-rotate(-50deg)'; ctx.drawImage(tmp, -s, 0);
      ctx.filter = 'sepia(1) saturate(6) hue-rotate(150deg)'; ctx.drawImage(tmp, s, 0);
      ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    if (L.grade) { ctx.globalAlpha = L.grade[1]; ctx.globalCompositeOperation = L.grade[2] || 'multiply'; ctx.fillStyle = L.grade[0]; ctx.fillRect(0, 0, c.width, c.height); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    ctx.setTransform(k, 0, 0, k, 0, 0);
    if (L.lines) {   // speed lines: from the edges toward the focus, a gap round it
      const n = L.lines, col = L.lineCol || '#ffffff', seed = (st * 7919) % 997;
      for (let i = 0; i < n; i++) {
        const a = ((i * 137.5 + seed * 0.37) % 360) * PI / 180, r0 = 300, r1 = 54 + ((i * 31 + seed) % 40);
        const x0 = fxp + Math.cos(a) * r0, y0 = fyp + Math.sin(a) * r0 * 0.7, x1 = fxp + Math.cos(a) * r1, y1 = fyp + Math.sin(a) * r1 * 0.7;
        ctx.globalAlpha = 0.55 + 0.4 * ((i * 13) % 5) / 5; art.line(ctx, i % 5 ? col : '#000000', R(x0), R(y0), R(x1), R(y1), i % 3 ? 1 : 2);
      }
      ctx.globalAlpha = 1;
    }
    if (L.vig) {   // the edges go dark
      const g = ctx.createRadialGradient(fxp, fyp, 40, fxp, fyp, 260); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + L.vig + ')');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    if (L.draw) L.draw(ctx, { st, p: cs.p, T, fxp, fyp, zm });   // anything else the hero's film wants, in screen pixels
    ctx.restore();
  }
  AP.film = true;
  if (V && V.draw) { const _vd = V.draw; V.draw = function (ctx) { const r = _vd.apply(this, arguments); try { film(ctx); } catch (e) { console.error(e); } return r; }; }
  const ui = SW.ui;
  if (ui && ui.hud) { const _hud = ui.hud; ui.hud = function (ctx, g) { if (g && g.scene === 'play') { try { film(ctx); } catch (e) { console.error(e); } } return _hud.apply(this, arguments); }; }
  // a blow that stops the world for n frames
  AP.stop = n => { G.hitstop = Math.max(G.hitstop || 0, n); };
  // a skill's cast, with something drawn round it (after the cast itself has run): fn(p, z, dmg, result)
  AP.onCast = function (ability, fn) {
    const C = SW.casts, old = C && C[ability]; if (!old) return false;
    C[ability] = function (p, z, dmg) { const r = old.apply(this, arguments); try { if (AP.on) fn(p, z, dmg, r); } catch (e) { console.error('apex cast', ability, e); } return r; };
    return true;
  };

  // ---------- a title card (letterbox bars are js/ult-grand.js's; this draws in them) ----------
  // style: { c1, c2, glyph(ctx, x, y, t) } — the name slides in on a stripe, the ultimate's name under it
  AP.card = function (o) {
    return function (ctx, st, zm, h, u) {
      const a = o.from, b = o.to; if (st < a || st >= b) return;
      const t = (st - a) / (b - a), inK = easeOut((st - a) / 8), outK = 1 - ease((st - (b - 6)) / 6), k = inK * outK;
      const bh = R(30 * (zm.bars || 0)), y0 = H - bh, sx = R(-W * (1 - inK) + (o.side === 'right' ? W * 0.18 : 0));
      ctx.globalAlpha = Math.min(1, k * 1.2);
      art.rect(ctx, o.c2 || '#000000', sx, y0 + 3, R(W * 0.62), 2);   // the stripe
      art.rect(ctx, o.c1, sx + 4, y0 + 6, R(W * 0.4 * inK), 1);
      SW.text(ctx, h.name.toUpperCase(), sx + 10, y0 + 8, o.c1, {});
      if (u) SW.text(ctx, u.name.toUpperCase(), sx + 10, y0 + 18, '#ffffff', {});
      if (o.tag) SW.text(ctx, o.tag, W - 8 + R(W * (1 - inK)), 6, o.c1, { align: 'right' });
      if (o.glyph) o.glyph(ctx, W - 40 + R(60 * (1 - inK)), H - bh / 2 - 2, t);
      ctx.globalAlpha = 1;
    };
  };

  // ---------- melee: the hero's own marks for its J chain (instead of js/herostyle.js's) ----------
  const _pu = P.update;
  P.update = function (g, z) {
    const s0 = this.state, c0 = this.connected;
    const r = _pu.apply(this, arguments);
    if (!AP.on || !AP.melee) return r;
    const id = g && g.state && g.state.hero, def = id && AP.defs[id], m = def && def.melee;
    if (!m) return r;
    const s = this.state, a = this.atk;
    if ((s === 'attack' || s === 'airatk') && a && this.st === a.hitAt) {
      for (let i = fx.list.length - 1; i >= 0 && i >= fx.list.length - 6; i--) { const q = fx.list[i]; if (q.k === 'HM' && q.x === this.x && q.y === this.y && q.life === q.max) { q.m = '_apex'; break; } }
      const n = Math.max(0, (this.combo || 1) - 1), air = s === 'airatk', fin = !!a.fin || n >= 3, face = this.face;
      const kind = m.kinds ? m.kinds[air ? 4 : Math.min(n, 3)] || m.kinds[Math.min(n, 3)] : null;
      const sw = m.swing || (kind && SWINGS[kind]);
      if (sw) AP.fx({ x: this.x, y: this.y, face, n, air, fin, kind, col: m.col, hi: m.hi, dk: m.dk, life: m.life || 13, draw: (ctx, q, x, y, t) => sw(ctx, q, x, y, t) });
    }
    if (m.hit && (s === 'attack' || s === 'airatk') && this.connected && !c0 && a) {
      const n = Math.max(0, (this.combo || 1) - 1);
      m.hit(this.x + this.face * 22, this.y - 22, n, this, !!a.fin || n >= 3);
    }
    void s0;
    return r;
  };
  // a library of swings (q: face, n, air, fin, col, hi, dk) — x, y are the fighter's feet on screen
  const SWINGS = AP.SWINGS = {
    crescent(ctx, q, x, y, t) {   // a wide sword arc
      const f = q.face, k = easeOut(t * 1.6), up = q.n % 2 ? 1 : -1, a0 = up < 0 ? -2.0 : 1.6, a1 = up < 0 ? 1.3 : -1.4, sz = 1 + (q.fin ? 0.4 : 0) + q.n * 0.08;
      const a = a0 + (a1 - a0) * k, tail = a0 + (a1 - a0) * Math.max(0, k - 0.55);
      ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5);
      D2.crescent(ctx, x + f * 6, y - 20 - (q.air ? 4 : 0), 22 * sz, tail, a, 7 * sz, f, [q.dk || '#000000', q.col, q.hi, '#ffffff']);
    },
    thrust(ctx, q, x, y, t) {   // a lance-straight stab with streaks
      const f = q.face, k = easeOut(t * 2), L = (30 + q.n * 6 + (q.fin ? 14 : 0)) * k, yy = y - 20 + (q.n === 2 ? -6 : q.n === 1 ? 4 : 0);
      ctx.globalAlpha = 1 - ease((t - 0.45) / 0.55);
      D2.streak(ctx, x + f * 8, yy, x + f * (8 + L), yy, 5, [q.dk || '#000000', q.col, q.hi, '#ffffff']);
      for (let i = -1; i <= 1; i += 2) art.line(ctx, q.hi, R(x + f * (4 + L * 0.3)), R(yy + i * 6), R(x + f * (L * 0.9)), R(yy + i * 3), 1);
      if (t < 0.4) D2.burst(ctx, x + f * (8 + L), yy, 7 + q.n, 8, [q.hi, '#ffffff']);
    },
    rake(ctx, q, x, y, t) {   // three claw lines raking down
      const f = q.face, k = easeOut(t * 1.8);
      ctx.globalAlpha = 1 - ease((t - 0.5) / 0.5);
      for (let i = 0; i < 3; i++) { const ox = x + f * (12 + i * 6), y0 = y - 38 + i * 2, y1 = y0 + 30 * k; art.line(ctx, q.dk || '#000000', R(ox - f * 6), R(y0), R(ox + f * 4), R(y1), 3); art.line(ctx, i === 1 ? '#ffffff' : q.col, R(ox - f * 6), R(y0), R(ox + f * 4), R(y1), 1); }
    },
    palm(ctx, q, x, y, t) {   // an open palm: a shock ring out from the hand
      const f = q.face, cx = x + f * (16 + q.n * 2), cy = y - 22, r = (4 + 18 * easeOut(t * 1.5)) * (1 + (q.fin ? 0.5 : 0));
      ctx.globalAlpha = 1 - ease((t - 0.4) / 0.6);
      D2.ring(ctx, cx, cy, r, q.col, 2); D2.ring(ctx, cx, cy, r * 0.6, q.hi, 1);
      if (t < 0.3) D2.burst(ctx, cx, cy, 8, 8, [q.hi, '#ffffff']);
    },
    xcut(ctx, q, x, y, t) {   // two quick diagonal cuts
      const f = q.face, cx = x + f * 22, cy = y - 22, l = 14 * easeOut(t * 2) * (q.fin ? 1.5 : 1);
      ctx.globalAlpha = 1 - ease((t - 0.45) / 0.55);
      D2.streak(ctx, cx - f * l, cy - l, cx + f * l, cy + l, 4, [q.col, q.hi, '#ffffff']);
      if (t > 0.15) D2.streak(ctx, cx - f * l, cy + l, cx + f * l, cy - l, 4, [q.col, q.hi, '#ffffff']);
    },
    shot(ctx, q, x, y, t) {   // a muzzle flash and a tracer
      const f = q.face, mx = x + f * 18, my = y - 24 + (q.n % 2 ? -2 : 2);
      ctx.globalAlpha = 1 - ease((t - 0.3) / 0.7);
      if (t < 0.35) D2.burst(ctx, mx, my, 9 + q.n * 2, 10, [q.hi, '#ffffff', q.col]);
      D2.streak(ctx, mx + f * 8, my, mx + f * (40 + 120 * easeOut(t * 2)), my, 2, [q.col, '#ffffff']);
    }
  };

  // ---------- weapons: baked into the hero's sprites at boot (after everyone else's art) ----------
  function setOf(s) {   // which animation set a sheet was baked with (js/art.js SETS)
    const have = Object.keys(s.anims || {}).sort().join(',');
    for (const k of Object.keys(art.SETS || {})) if (art.SETS[k].slice().sort().join(',') === have) return k;
    return null;
  }
  function arm(id, def) {
    const w = def.weapon, h = D.heroes[id]; if (!w || !h) return;
    art.WEAPONS[w.name] = { len: w.len, w: w.w || 2, col: w.col, hi: w.hi, hilt: w.hilt, tip: w.tip };
    if (w.draw) (art.WEAPON_DRAW = art.WEAPON_DRAW || {})[w.name] = w.draw;
    [h.sheet, h.sheetAw, h.sheetArmed].filter((x, i, a) => x && a.indexOf(x) === i).forEach(sid => {
      const s = art.sheets[sid]; if (!s || !s.cfg) return;
      const set = setOf(s); if (!set) return;
      const cfg = Object.assign({}, s.cfg, { weapon: w.name, armed: w.armed ? 1 : s.cfg.armed });
      if (w.cfg) Object.assign(cfg, w.cfg(s.cfg, sid));
      try { art.bake(sid, cfg, set); AP.armed = (AP.armed || 0) + 1; } catch (e) { console.error('apex weapon', id, e); }
    });
  }
  const _init = art.init;
  art.init = function () {
    const r = _init.apply(this, arguments);
    if (AP.on && AP.weapons) Object.keys(AP.defs).forEach(id => arm(id, AP.defs[id]));
    return r;
  };

  // ---------- Versus numbers and the rest, once everything has loaded ----------
  function ready() {
    const B = SW.versusBalance;
    Object.keys(AP.defs).forEach(id => {
      const t = AP.defs[id].tune; if (!t || !B) return;
      if (t.dmg) B.DMG[id] = t.dmg; else delete B.DMG[id];
      if (t.hp) B.HP[id] = t.hp; else delete B.HP[id];
    });
    if (B && B.apply) B.apply();
    // an apex hero's ultimate is its own: js/ult-cinema.js (another session's file) is told to leave it to js/ult-grand.js
    const UC = SW.ultCinema; if (UC && UC.heroes) Object.keys(AP.defs).forEach(id => { const i = UC.heroes.indexOf(id); if (i >= 0 && AP.defs[id].ult) UC.heroes.splice(i, 1); });
    AP.inits.forEach(fn => { try { fn(); } catch (e) { console.error('apex init', e); } });
  }
  if (document.readyState === 'complete') setTimeout(ready, 0); else window.addEventListener('load', ready);
})();
