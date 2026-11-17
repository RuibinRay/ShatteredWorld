'use strict';
// Shattered Worlds — the Hidden Clans, and every other fighter, in stances of their own. Draw-only: no timing, hitbox, damage or state change.
// Loaded after js/herostyle.js, js/anim2.js and js/combo-flow.js.
// Every fighter's frames are baked from one skeleton pose set (js/art.js), so the Hidden Clans, with their own colours
// and heads, still moved exactly like Kael (recordings/anim-report.md). Here each clan fighter's sheet is baked again
// from poses bent to their fighting style (the swing js/herostyle.js gives them):
//   palm    open-handed strikes from a low stance, the other hand at the chest       Hollis Ivo Lin Fumi Taro
//   claw    hunched, knees bent, raking down with bent fingers                        Vesna Kova
//   fan     the throwing arm wound up high, then flung through                       Kestra Zara Elixa Opal
//   wave    the lash: arm high and loose, then whipped out straight                  Pell Nami Tarek Coda Slick
//   stomp   wide and low, stamping kicks on the heavy hits                           Dune Tor Mako
//   spiral  the body twists, the back arm flung behind, high kicks                   Garo Rue
//   cross   both arms together: crossed overhead, then both thrust out               Moro Hex Ryo
//   pulse   both palms pushed out flat                                               Oda Vex
//   arc     bigger cutting swings, high to low                                       Isa Sora
//   thrust  a lunge with the arm straight out                                        Sable
// The other fighters (the first heroes and the legends) take a style that fits how they fight (OTHER below), five
// of them new: boxer (fists up at the chin, tight jabs: Kael, Tarn), heavy (arms low, big overhead blows: Ashka, Aldric,
// Brann), iai (low, hand at the hilt, a deep lunge: Sen), gun (the pistol held level: Jax), bow (the full draw: Yara).
// plus a small difference of its own for every fighter (lean, knees, elbows). anim2.js's in-between frames are baked
// again from the same poses so the motion between them matches. Itsuki (another session's) and the ten heroes
// js/combo-flow.js already gives poses of their own are left as they were, and so is Bando (his rubber arm, heroes4.js). SW.clanPoses.on = false before the game
// loads turns it off (or SW.clanPoses.restore() puts the old frames back).
(function () {
  const SW = window.SW, art = SW && SW.art, D = SW && SW.data, N = SW && SW.ninja, HS = SW && SW.herostyle;
  if (!art || !art.bake || !art.POSES || !art.SETS || !N || !N.IDS) return;
  const POSES = art.POSES, SETS = art.SETS;
  const SKIP = { itsuki: 1, fenn: 1, corvin: 1, rook: 1, apis: 1, ume: 1, thorne: 1, lux: 1, mika: 1, hart: 1, convergence: 1 };
  const CP = SW.clanPoses = { on: true, styled: {}, failed: [] };
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rnd = (seed, i) => { let x = Math.imul(seed ^ Math.imul(i + 1, 0x9e3779b1), 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
  const c = (v, a, b) => Math.max(a, Math.min(b, v));
  const ATK = { a1: 1, a2: 1, a3: 1, a4: 1, b1: 1, b2: 1, b3: 1, b4: 1, launcher: 1, sweep: 1, air: 1, cast: 1, special: 1 };
  const HEAVY = { a2: 1, a4: 1, b2: 1, b4: 1, sweep: 1 };
  const FWD = { a1: 1, a2: 1, a3: 1, a4: 1, b1: 1, b2: 1, b3: 1, b4: 1, cast: 1, special: 1 };   // the launcher, sweep and air hits keep their arms
  const KICK = { launcher: 1, a3: 1, b3: 1 };
  // style(p, anim, k): bend one pose (a copy) to the style; k = 0 wind-up, 1 strike, 2 recovery
  const STYLE = {
    palm(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 70, aFe: 15, aB: 45, aBe: 100, lean: p.lean + 6, lFk: p.lFk + 20, lBk: p.lBk + 20 });
      else if (ATK[n]) {
        if (k === 1) Object.assign(p, { aF: 90, aFe: 0, aB: 40, aBe: 110, lean: p.lean + 10, lF: p.lF + 12, lFk: p.lFk + 14, lBk: p.lBk + 10 });
        else if (k === 0) Object.assign(p, { aF: 40, aFe: 60, aB: 30, aBe: 100, lean: p.lean - 2 });
      }
    },
    claw(p, n, k) {
      Object.assign(p, { lean: p.lean + 10, lFk: p.lFk + 14, lBk: p.lBk + 14, lF: p.lF + 6, lB: p.lB - 6 });
      if (n === 'idle') Object.assign(p, { aF: 45, aFe: 70, aB: 30, aBe: 80 });
      else if (ATK[n]) { p.aFe = Math.max(p.aFe, 35); if (k === 1) Object.assign(p, { aF: c(p.aF - 20, 30, 120), aB: c(p.aB + 30, -30, 120) }); }
    },
    fan(p, n, k) {
      if (n === 'idle') Object.assign(p, { aB: 110, aBe: 35, aF: 30, aFe: 40, lean: p.lean - 2 });
      else if (ATK[n]) {
        if (k === 0) Object.assign(p, { aB: 155, aBe: 20, aF: 30, aFe: 40, lean: p.lean - 10 });
        else if (k === 1) Object.assign(p, { aF: 110, aFe: 0, aB: -45, aBe: 30, lean: p.lean + 12, lB: p.lB - 20 });
        else p.aB = -15;
      }
    },
    wave(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 35, aFe: 60, aB: -25, aBe: 30 });
      else if (ATK[n]) {
        if (k === 0) Object.assign(p, { aF: 170, aFe: 40, aB: -30, aBe: 20, lean: p.lean - 10 });
        else if (k === 1) Object.assign(p, { aF: 95, aFe: 0, aB: -50, aBe: 20, lean: p.lean - 6, lF: p.lF + 10 });
      }
    },
    stomp(p, n, k) {
      Object.assign(p, { lF: p.lF + 10, lB: p.lB - 10, lFk: p.lFk + 18, lBk: p.lBk + 18, lean: p.lean + 4 });
      if (n === 'idle') Object.assign(p, { aF: 25, aFe: 70, aB: -20, aBe: 70 });
      else if (ATK[n]) { p.aFe = Math.max(p.aFe, 30); if (k === 1 && HEAVY[n]) Object.assign(p, { lF: c(p.lF + 35, 40, 80), lFk: 8 }); }
    },
    spiral(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 40, aFe: 60, aB: -35, aBe: 40, lean: p.lean - 2 });
      else if (ATK[n] && k === 1) {
        Object.assign(p, { aB: c(p.aB - 60, -90, 30), aBe: 15, lean: p.lean - 4 });
        if (KICK[n]) Object.assign(p, { lF: c(p.lF + 40, 30, 95), lFk: 10 });
      }
    },
    cross(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 95, aFe: 110, aB: 90, aBe: 115 });
      else if (ATK[n]) {
        if (k === 0) Object.assign(p, { aF: 150, aB: 155, aFe: 40, aBe: 40, lean: p.lean - 6 });
        else if (k === 1) Object.assign(p, { aF: 90, aFe: 0, aB: 88, aBe: 4, lean: p.lean + 10, lF: p.lF + 8 });
      }
    },
    pulse(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 60, aFe: 90, aB: 55, aBe: 95, lean: p.lean - 4, lF: p.lF + 6, lB: p.lB - 6 });
      else if (ATK[n]) {
        if (k === 1) Object.assign(p, { aF: 95, aFe: 0, aB: 90, aBe: 2, lean: p.lean - 8, lF: p.lF + 10, lB: p.lB - 10 });
        else if (k === 0) Object.assign(p, { aF: 55, aFe: 100, aB: 50, aBe: 105 });
      }
    },
    arc(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 50, aFe: 30, aB: -20, aBe: 40 });
      else if (ATK[n]) {
        if (k === 0) Object.assign(p, { aF: 160, aFe: 20, lean: p.lean - 6, wp: (p.wp || 0) - 35 });
        else if (k === 1) Object.assign(p, { aF: 55, aFe: 0, aB: -30, lean: p.lean + 14, lF: p.lF + 10, wp: (p.wp || 0) + 35 });
      }
    },
    boxer(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 80, aFe: 120, aB: 70, aBe: 125, lean: p.lean + 6, lFk: p.lFk + 10, lBk: p.lBk + 10 });
      else if (ATK[n]) {
        if (k === 1) Object.assign(p, { aF: c(p.aF, 80, 100), aFe: Math.min(p.aFe, 8), aB: 70, aBe: 120, lean: p.lean + 8 });
        else if (k === 0) Object.assign(p, { aF: 75, aFe: 110, aB: 70, aBe: 125 });
      }
    },
    heavy(p, n, k) {
      Object.assign(p, { lean: p.lean + 6, lF: p.lF + 8, lB: p.lB - 8, lFk: p.lFk + 14, lBk: p.lBk + 14 });
      if (n === 'idle') Object.assign(p, { aF: 20, aFe: 40, aB: -10, aBe: 40 });
      else if (ATK[n]) {
        if (k === 0) Object.assign(p, { aF: c(p.aF + 60, 100, 175), aFe: 30 });
        else if (k === 1) Object.assign(p, { aF: c(p.aF - 20, 40, 100), aFe: 10, lean: p.lean + 12 });
      }
    },
    iai(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 25, aFe: 100, aB: 15, aBe: 90, lean: p.lean + 12, lF: p.lF + 10, lB: p.lB - 10, lFk: p.lFk + 20, lBk: p.lBk + 20 });
      else if (ATK[n]) {
        if (k === 0) Object.assign(p, { aF: 20, aFe: 100, lean: p.lean + 14 });
        else if (k === 1) Object.assign(p, { aF: 95, aFe: 0, aB: -40, aBe: 10, lean: p.lean + 18, lF: p.lF + 16, lB: p.lB - 16 });
      }
    },
    gun(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 60, aFe: 30, aB: 10, aBe: 40 });
      else if (ATK[n]) {
        if (k === 1) Object.assign(p, { aF: 92, aFe: 0, aB: 30, aBe: 60, lean: p.lean - 4 });
        else if (k === 0) Object.assign(p, { aF: 70, aFe: 20 });
      }
    },
    bow(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 40, aFe: 20, aB: 30, aBe: 60, lean: p.lean - 2 });
      else if (ATK[n]) {
        if (k === 0) Object.assign(p, { aF: 90, aFe: 0, aB: 85, aBe: 140 });
        else if (k === 1) Object.assign(p, { aF: 92, aFe: 0, aB: 80, aBe: 165, lean: p.lean - 6 });
      }
    },
    thrust(p, n, k) {
      if (n === 'idle') Object.assign(p, { aF: 60, aFe: 20, aB: 40, aBe: 50 });
      else if (ATK[n] && k === 1) Object.assign(p, { aF: 92, aFe: 0, aB: 78, aBe: 15, lean: p.lean + 12, lF: p.lF + 10, lB: p.lB - 14 });
    }
  };
  const OTHER = {
    kael: 'boxer', tarn: 'boxer', ashka: 'heavy', aldric: 'heavy', brann: 'heavy', sen: 'iai', jax: 'gun', yara: 'bow',
    nyra: 'arc', noct: 'arc', isolde: 'thrust', brakk: 'stomp', pyra: 'palm', orin: 'palm', gale: 'spiral',
    dyna: 'fan', mira: 'fan', kiri: 'fan', vesper: 'claw', ferra: 'claw', maren: 'wave', vega: 'pulse', tessa: 'cross'
  };
  CP.OTHER = OTHER;
  const styleOf = hero => (HS && HS.SWING && HS.SWING[hero]) || OTHER[hero];
  const NAMES = ['idle', 'a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3', 'b4', 'launcher', 'sweep', 'air', 'cast', 'special'];
  const TWEEN = ['a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3', 'b4', 'launcher', 'sweep', 'air', 'cast', 'special'];
  const mix = (a, b, t) => { const o = {}; new Set(Object.keys(a).concat(Object.keys(b))).forEach(k => { const x = a[k], y = b[k]; o[k] = typeof x === 'number' && typeof y === 'number' ? x + (y - x) * t : (t < 0.5 ? (x !== undefined ? x : y) : (y !== undefined ? y : x)); }); return o; };
  function posesFor(hero) {
    const style = STYLE[styleOf(hero)], seed = hash(hero), v = (i, amt) => Math.round((rnd(seed, i) - 0.5) * 2 * amt);
    if (!style) return null;
    const out = {};
    NAMES.forEach(n => {
      const base = POSES[n]; if (!base) return;
      out[n] = base.map((p0, k) => {
        const p = Object.assign({}, p0);
        style(p, n, base.length === 1 ? 1 : k);
        if (!FWD[n] && n !== 'idle') ['aF', 'aFe', 'aB', 'aBe', 'wp'].forEach(j => { p[j] = p0[j]; });   // up, down and air: legs and lean only
        if (n === 'idle' || ATK[n]) Object.assign(p, { lean: p.lean + v(0, 3), lFk: p.lFk + v(1, 6), lBk: p.lBk + v(2, 6), aFe: Math.max(0, p.aFe + v(3, 8)), aBe: Math.max(0, p.aBe + v(4, 8)) });
        p.lean = c(p.lean, -40, 40);
        return p;
      });
    });
    TWEEN.forEach(n => { const f = out[n]; if (f && f.length >= 3) out[n + '~'] = [mix(f[0], f[1], 0.55), mix(f[1], f[2], 0.45)]; });
    return out;
  }
  // bake one sheet (and anim2's in-between sheet) with the hero's poses swapped in, then put the shared poses back
  function restyle(hero, id) {
    const s = art.sheets[id]; if (!s || !s.cfg) return false;
    const mine = posesFor(hero); if (!mine) return false;
    const keep = {}; Object.keys(mine).forEach(n => { keep[n] = POSES[n]; POSES[n] = mine[n]; });
    try {
      const old = s;
      art.bake(id, s.cfg, 'hero');
      const ns = art.sheets[id];
      const set = s.cfg.weapon && s.cfg.armed ? 'a2blade' : 'a2fist';
      if (SETS[set]) { art.bake(id + '+', ns.cfg, set); art.sheets[id + '+'].src = ns.img; }
      CP.styled[id] = { img: ns.img, old };
      return true;
    } catch (e) { CP.failed.push(hero + ':' + (e && e.message)); return false; }
    finally { Object.keys(keep).forEach(n => { POSES[n] = keep[n]; }); }
  }
  CP.restore = function () { Object.keys(CP.styled).forEach(id => { const o = CP.styled[id].old; if (o) { art.sheets[id] = o; delete art.sheets[id + '+']; } }); CP.styled = {}; CP.on = false; };
  CP.posesFor = posesFor;
  // a few sheets per tick after the game has loaded; again if a sheet is baked anew elsewhere (a recolour)
  function pump() {
    if (!CP.on) return;
    const t0 = performance.now();
    for (const hero of N.IDS.concat(Object.keys(OTHER))) {
      if (SKIP[hero] || !D.heroes[hero]) continue;
      const h = D.heroes[hero];
      for (const id of [h.sheet, h.sheetAw, h.sheetArmed]) {
        if (!id || !art.sheets[id]) continue;
        const done = CP.styled[id];
        if (done && done.img === art.sheets[id].img) continue;
        restyle(hero, id);
        if (performance.now() - t0 > 8) return;
      }
    }
  }
  setInterval(pump, 120);
})();
