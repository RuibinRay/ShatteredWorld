'use strict';
// Shattered Worlds - combos that flow. Draw-only: no timing, hitbox, damage or physics changes (the user asked for
// smoother combo animation, not stronger heroes). For the ten heroes whose combos measured weakest:
// Fenn, Corvin, Rook, Apis, Ume, Thorne, Lux, Mika, Hart and the Convergence.
//
//   1. No snap between hits. A J chain starts the next hit 3 frames after the last one lands, so the picture jumped
//      straight from the strike (arm or weapon out) to the next wind-up (arm or weapon pulled back). Now the first two
//      frames of a chained hit are in-betweens, baked from the same skeleton: strike -> two thirds -> one third -> wind-up.
//      The same for J > launcher (W+J) and J > sweep (S+J).
//   2. A settle at the end. When an attack ends the fighter used to pop back to standing; now the recovery pose eases
//      into the stance over six frames.
//   3. Thrusting weapons thrust. Hart's spear and Lux's lance used the sword poses: raised overhead, chopped down, and
//      the swing left a curved sword arc. They now have thrust poses of their own (spear drawn back at the hip, driven
//      out level, high, low, and a full lunge for the fourth hit), with matching in-betweens, and no sword arc (their
//      own straight thrust line, from herostyle.js, stays).
//
// The new frames go on a side sheet per fighter (sheet id + '#'), baked in the background like anim2.js does; until a
// sheet is ready the fighter simply draws the old frames. SW.comboflow.on = false turns it all off.
// To give another hero this treatment add them to HEROES (and to THRUST if they fight with a spear or a lance).
(function () {
  const SW = window.SW, art = SW.art, fx = SW.fx, P = SW.Player && SW.Player.prototype, D = SW.data;
  if (!art || !P || !art.POSES || !art.SETS || !art.bake) return;
  const POSES = art.POSES, SETS = art.SETS, HR = D.heroes;
  const CF = SW.comboflow = { on: true, cur: null, drawn: {} };   // drawn: how often each new frame was used (for tests)
  const HEROES = ['fenn', 'corvin', 'rook', 'apis', 'ume', 'thorne', 'lux', 'mika', 'hart', 'convergence'];
  const THRUST = ['hart', 'lux'];

  // ================= poses =================
  const Pz = (lean, aF, aFe, aB, aBe, lF, lFk, lB, lBk, o) => Object.assign({ lean, aF, aFe, aB, aBe, lF, lFk, lB, lBk }, o || {});
  const DEF = { wp: 30, tr: 14 };   // what the skeleton drawer uses when a pose leaves them out
  function mix(a, b, t) {
    const o = {};
    new Set(Object.keys(a).concat(Object.keys(b))).forEach(k => {
      let x = a[k], y = b[k];
      if (x === undefined && DEF[k] !== undefined) x = DEF[k];
      if (y === undefined && DEF[k] !== undefined) y = DEF[k];
      o[k] = typeof x === 'number' && typeof y === 'number' ? x + (y - x) * t : (t < 0.5 ? (x !== undefined ? x : y) : (y !== undefined ? y : x));
    });
    return o;
  }
  // spear and lance: held level, drawn back to the hip, driven straight out (weapon angle = forearm angle + wp; 90 = level)
  const TP = {
    a1: [Pz(-2, 15, 75, -25, 60, 18, 14, -18, 10, { wp: 0 }), Pz(16, 86, 4, -35, 40, 32, 18, -28, 6, { wp: 0, tr: 60 }), Pz(8, 62, 28, -25, 45, 24, 14, -20, 8, { wp: 0 })],
    a2: [Pz(0, 28, 72, -25, 60, 20, 14, -18, 10, { wp: 0 }), Pz(14, 102, 0, -40, 40, 30, 16, -26, 6, { wp: -2, tr: 50 }), Pz(8, 78, 20, -25, 45, 24, 14, -20, 8, { wp: -2 })],
    a3: [Pz(6, 10, 70, -25, 60, 42, 70, -10, 30, { wp: 0 }), Pz(22, 76, 0, -40, 40, 56, 48, -30, 10, { wp: 4, tr: 70 }), Pz(12, 60, 20, -25, 45, 40, 40, -20, 10, { wp: 2 })],
    a4: [Pz(-10, -12, 102, -30, 60, 20, 20, -22, 14, { wp: 0 }), Pz(28, 90, 0, -60, 30, 48, 12, -45, 6, { wp: 0, tr: 80 }), Pz(16, 70, 15, -40, 40, 36, 18, -32, 8, { wp: 0 })]
  };
  // the attack poses each style draws (armed heroes swing b1..b4 where others use a1..a4; see art.js bake)
  const STYLE = { f: n => POSES[n], b: n => (/^a[1-4]$/.test(n) ? POSES['b' + n.slice(1)] : POSES[n]), t: n => TP[n] || POSES[n] };
  const CHAIN = [['a1', 'a2'], ['a2', 'a3'], ['a3', 'a4'], ['a1', 'launcher'], ['a2', 'launcher'], ['a3', 'launcher'], ['a1', 'sweep'], ['a2', 'sweep'], ['a3', 'sweep']];
  const ENDS = ['a1', 'a2', 'a3', 'a4', 'launcher', 'sweep'];
  Object.keys(STYLE).forEach(s => {
    const pose = STYLE[s], names = [];
    CHAIN.forEach(([a, b]) => { const n = 'cf' + s + '_' + a + '_' + b, A = pose(a), B = pose(b); if (!A || !B) return; POSES[n] = [mix(A[1], B[0], 0.36), mix(A[1], B[0], 0.7)]; names.push(n); });
    ENDS.forEach(a => { const n = 'cf' + s + '_end_' + a, A = pose(a); if (!A) return; POSES[n] = [mix(A[2], POSES.idle[0], 0.4), mix(A[2], POSES.idle[0], 0.75)]; names.push(n); });
    if (s === 't') ['a1', 'a2', 'a3', 'a4'].forEach(a => { const f = TP[a]; POSES['cft_' + a] = f; POSES['cft_' + a + '~'] = [mix(f[0], f[1], 0.55), mix(f[1], f[2], 0.45)]; names.push('cft_' + a, 'cft_' + a + '~'); });
    SETS['cf_' + s] = names;
  });

  // ================= which fighter, which sheet =================
  const OWNER = {};   // sheet id -> hero id, for the heroes above (their sheet, awakened sheet and armed sheet)
  HEROES.forEach(id => { const h = HR[id]; if (!h) return; [h.sheet, h.sheetAw, h.sheetArmed].forEach(s => { if (s) OWNER[s] = id; }); });
  const styleOf = id => { const hero = OWNER[id]; if (!hero) return null; if (THRUST.indexOf(hero) >= 0) return 't'; const s = art.sheets[id]; return s && s.cfg && s.cfg.weapon && s.cfg.armed ? 'b' : 'f'; };
  const heroOf = p => { try { const G = p.G; return G && G.state ? G.state.hero : null; } catch (e) { return null; } };

  // side sheets, baked a few at a time in the background
  const want = new Set(), failed = new Set();
  function pump() {
    const t0 = performance.now();
    for (const id of Array.from(want)) {
      want.delete(id);
      const s = art.sheets[id], st = styleOf(id);
      if (!s || !s.cfg || !st || failed.has(id)) continue;
      const side = art.sheets[id + '#'];
      if (side && side.src === s.img) continue;
      try { art.bake(id + '#', s.cfg, 'cf_' + st); art.sheets[id + '#'].src = s.img; } catch (e) { failed.add(id); }
      if (performance.now() - t0 > 6) break;
    }
  }
  setInterval(pump, 60);
  const ready = id => { const s = art.sheets[id], x = art.sheets[id + '#']; if (x && s && x.src === s.img) return true; want.add(id); return false; };

  // ================= remembering how the last move ended =================
  const frameOf = (a, st) => (st < a.hitAt ? 0 : st <= a.hitEnd + 2 ? 1 : 2);
  const _pu = P.update;
  P.update = function () {
    const s0 = this.state, a0 = this.atk, st0 = this.st;
    const r = _pu.apply(this, arguments);
    if (!CF.on || HEROES.indexOf(heroOf(this)) < 0) return r;
    const a = this.atk;
    if (this.state === 'attack' && a && (a !== a0 || s0 !== 'attack')) {   // a ground attack started this frame
      this._cfFrom = s0 === 'attack' && a0 && a0 !== a && frameOf(a0, st0) >= 1 ? a0.anim : null;
      this._cfEnd = null;
    }
    if (s0 === 'attack' && a0 && this.state === 'idle') { this._cfEnd = a0.anim; this._cfEndT = 6; }
    else if (this.state !== 'idle' || !this.onGround) this._cfEnd = null;
    else if (this._cfEndT > 0 && --this._cfEndT <= 0) this._cfEnd = null;
    // a thrusting weapon leaves no curved sword arcs: drop the two this hit just made, the sword combo's slash
    // (actors.js fx.slash) and anim.js's smear; the straight thrust line from herostyle.js stays
    if (THRUST.indexOf(heroOf(this)) >= 0 && this.state === 'attack' && a && this.st === a.hitAt && /^a[1-4]$/.test(a.anim)) {
      for (let i = fx.list.length - 1; i >= Math.max(0, fx.list.length - 12); i--) {
        const e = fx.list[i];
        if (e && (e.k === 'AS' || e.k === 's') && Math.abs(e.x - this.x) < 16 && Math.abs(e.y - (this.y - 19)) < 6) e.life = 0;
      }
    }
    return r;
  };

  // ================= picking the picture =================
  // returns [anim on the side sheet, frame] for what the fighter is drawing as (anim, frame) right now, or null
  function pick(p, st) {
    const s = p.state, a = p.atk;
    if (s === 'attack' && a) {
      if (p._cfFrom && p.st <= 1 && POSES['cf' + st + '_' + p._cfFrom + '_' + a.anim]) return { when: a.anim, anim: 'cf' + st + '_' + p._cfFrom + '_' + a.anim, fi: p.st <= 0 ? 0 : 1 };
      if (st === 't' && /^a[1-4]$/.test(a.anim)) {   // the thrust's own in-betweens (anim2.js would draw sword ones)
        if (p.st >= a.hitAt - 2 && p.st < a.hitAt) return { when: a.anim, anim: 'cft_' + a.anim + '~', fi: 0 };
        if (p.st > a.hitEnd + 2 && p.st <= a.hitEnd + 5) return { when: a.anim, anim: 'cft_' + a.anim + '~', fi: 1 };
      }
      return null;
    }
    if (s === 'idle' && p._cfEnd && p._cfEndT > 0 && POSES['cf' + st + '_end_' + p._cfEnd]) return { when: 'idle', anim: 'cf' + st + '_end_' + p._cfEnd, fi: p._cfEndT > 3 ? 0 : 1 };
    return null;
  }
  const _pd = P.draw;
  P.draw = function () {
    CF.cur = null;
    if (CF.on && HEROES.indexOf(heroOf(this)) >= 0) { try { CF.cur = { p: this }; } catch (e) { CF.cur = null; } }
    try { return _pd.apply(this, arguments); } finally { CF.cur = null; }
  };
  const _draw = art.draw;
  art.draw = function (ctx, id, anim, fi, x, y, flip, o) {
    if (CF.on && OWNER[id]) {
      const st = styleOf(id);
      if (st && ready(id)) {
        const c = CF.cur, side = id + '#', sh = art.sheets[side];
        const r = c ? pick(c.p, st) : null;
        if (r && r.when === anim && sh.anims[r.anim]) {
          if (SW.anim2) SW.anim2.sub = null;   // this picture is decided: anim2.js keeps its hands off it
          CF.drawn[r.anim] = (CF.drawn[r.anim] || 0) + 1;
          return _draw.call(this, ctx, side, r.anim, r.fi, x, y, flip, o);
        }
        if (st === 't' && /^a[1-4]$/.test(anim) && sh.anims['cft_' + anim]) {   // spear and lance: thrust poses, ghosts included
          if (SW.anim2 && c) SW.anim2.sub = null;
          return _draw.call(this, ctx, side, 'cft_' + anim, fi, x, y, flip, o);
        }
      }
    }
    return _draw.apply(this, arguments);
  };
  // bake the side sheets of these heroes soon after start-up, so the first combo already flows
  setTimeout(() => { Object.keys(OWNER).forEach(id => { if (art.sheets[id]) want.add(id); }); }, 1500);
  // for tests and recordings: bake every side sheet now (returns how many are ready)
  CF.prepare = function () {
    Object.keys(OWNER).forEach(id => { const s = art.sheets[id], x = art.sheets[id + '#']; if (s && s.cfg && !(x && x.src === s.img)) { try { art.bake(id + '#', s.cfg, 'cf_' + styleOf(id)); art.sheets[id + '#'].src = s.img; } catch (e) { failed.add(id); } } });
    return Object.keys(OWNER).filter(id => art.sheets[id + '#']).length;
  };
})();
