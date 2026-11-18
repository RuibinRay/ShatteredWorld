'use strict';
// Shattered Worlds — NIGHTMARE, the fourth Versus bot level (Easy, Normal, Hard, Nightmare). Loaded after the Versus files.
// (It was called Hardcore while it was built: the file, SW.hardcore and the tools keep that name.)
//
// A Hardcore bot presses buttons like anyone else (it gets no extra damage, health or speed); what it has is perfect
// reading and timing:
//   Defence   It knows when the hit coming at it will land: a swing's first active frame, a shot's flight time, and for
//             every other move the timing the trainer measured (data.threats). It raises its guard 0-4 frames before
//             the hit, so its blocks are PERFECT blocks, which stun the attacker. Throws and unblockable moves it jumps
//             away from, and it breaks every throw (js/versus.js gives level 3 a break chance of 1).
//   Offence   On a stunned or hit opponent it runs the strongest combo route its hero has (data.routes, found by
//             tools/hardcore-train.js against a stunned dummy), picking the best one its energy and cooldowns allow.
//             It throws an opponent who sits in guard, punishes whiffed moves, and keeps its ultimate for a sure hit.
//   Style     Spacing, pokes, charging and slipping are tuned per hero by tournaments (data.params).
// The bot's own plan is computed in the Player update (by then readInput has run the ordinary bot, whose presses are
// thrown away), so Hardcore needs nothing from js/versus.js but its level number.
// Recommended combos: Versus Training shows the top routes for the hero being played (from the same data).
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, D = SW.data, P = SW.Player.prototype, text = SW.text;
  if (!V) return;
  const HC = SW.hardcore = { on: true, test: false, data: SW.hardcoreData || { routes: {}, threats: {}, params: {} } };
  const lvOf = f => (f.lv !== undefined ? f.lv : V.diff);
  HC.is = f => !!(f && f.bot && HC.on && lvOf(f) === 3);
  const FREE = { idle: 1, run: 1, jump: 1, fall: 1, guard: 1, charge: 1 };
  const QUIET = { idle: 1, run: 1, jump: 1, fall: 1, guard: 1, charge: 1, dash: 1, hurt: 1, dead: 1, slip: 1 };
  // ultOpen 170: fire the ultimate as pressure when the bar is full and the opponent within 170 px. Against another
  // Nightmare bot (both guard perfectly, rounds go to the clock) it decided 30% of rounds instead of 16%, and changed
  // nothing against Hard bots (98% of rounds won, 90% health left)
  const DEF = { space: 78, poke: 0.3, charge: 1, slip: 1, ultIn: 1, throwR: 30, wait: 0, ultOpen: 170 };
  // switches for testing each piece of play against the others (all on in the game)
  // stepIn (walk to 22 px before a stun punish) is off: in tests it gave the opponent time to recover (health left 80% vs 85%)
  HC.opt = { airOpen: true, juggleWait: true, stepIn: false, whiff: true, ultPulse: true, mirrorShow: true };
  // MIRROR SHOW: when both fighters are Nightmare bots (Bot vs Bot), two perfect defenders never gave each other an opening:
  // no hits landed, both charged far apart and traded blocked ultimates until the clock ran out. In a mirror only, each
  // one defends like a person (an attack is perfect-blocked about half the time, plainly blocked or missed otherwise, a
  // throw broken half the time) and plays a real neutral game (rushes in with strings, jumps in, pokes with every skill,
  // feints, throws, backs off after being blocked; charges only in short bursts; saves the ultimate for an opening).
  // Against Hard bots and players nothing changes. HC.MIR holds the knobs.
  // still: frames the opponent may stand still before an attack is due (2-3 s); attackIn: when it comes after that (1-3 s)
  // boss: heroes the mirror show never softens (Itsuki, the strongest by design: in a mirror he still blocks every hit
  // frame-perfect and breaks every throw, while he plays the same active game)
  const MIR = HC.MIR = { miss: 0.15, plain: 0.3, breakT: 0.5, still: [120, 180], attackIn: [60, 180], boss: { itsuki: 1 } };   // ultPulse off (hold the guard through an ultimate) did worse in tests
  HC.params = hero => Object.assign({}, DEF, HC.data.params[hero] || {});

  // ================= reading the opponent =================
  // frames until the next hit can land on fighter f (99 = nothing coming); grab / ub: it cannot be guarded
  function threat(f, o) {
    const p = f.p, q = o.p, r = { t: 99, grab: false, ub: false, near: false, src: '' };
    if (!q || q.dead) return r;
    const L = p.x - p.w / 2 - 5, R = p.x + p.w / 2 + 5, Tp = p.y - p.h - 6, B = p.y + 3, s = q.state, adx = Math.abs(q.x - p.x);
    if ((s === 'attack' || s === 'airatk') && q.atk && q.atk.box) {
      const a = q.atk, b = a.box;
      if (q.st <= a.hitEnd) {
        const lead = Math.max(0, a.hitAt - q.st), drift = q.vx * Math.min(lead, 6) + (q.face > 0 ? 1 : -1) * 4;
        const x = (q.face > 0 ? q.x + b[0] : q.x - b[0] - b[2]) + drift, y = q.y + b[1] + (s === 'airatk' ? q.vy * lead : 0);
        if (x < R && x + b[2] > L && y < B && y + b[3] > Tp) { r.t = lead; r.grab = !!a.grab; r.ub = !!a.unblockable; r.src = 'body'; }
      }
    } else if (!QUIET[s]) {
      const T = (HC.data.threats[o.hero] || {})[s];
      if (T) {
        if ((s === 'ult' || adx <= T.reach + 14) && q.st <= T.last + 2) {   // an ultimate reaches anyone on screen
          const nx = T.hits ? T.hits.find(v => v >= q.st) : undefined;   // the next frame this move has been seen to hit on
          r.t = nx !== undefined ? nx - q.st : Math.max(0, T.st - q.st); r.ub = !!T.ub; r.src = 'body';
        }
      } else if (adx < 96) { r.t = s === 'ult' ? 0 : 2; r.src = 'body'; }
    }
    for (const sh of o.shots) {
      if (sh.gone) continue;
      if (sh.hz) {   // a delayed eruption (a void column, a gathering burst): where it will go off, and when
        const z = sh.hz, t0 = sh.t || 0, next = z.every ? Math.min(z.at, Math.ceil((t0 + 1) / z.every) * z.every) : z.at;
        if (next >= t0 && Math.abs(z.x - p.x) < z.half + p.w / 2 + 6 && next - t0 < r.t) { r.t = next - t0; r.src = 'shot'; }
        continue;
      }
      // a grab rushing in (Itsuki's Five-Element Seize): it cannot be blocked, but it only takes someone standing in front
      // of it, so it is jumped (the unblockable branch of the defence)
      if (sh.grab) { if (!sh.held && sh.p && Math.sign(p.x - sh.p.x) === sh.dir && Math.abs(p.x - sh.p.x) < 110 && Math.abs(p.y - sh.p.y) < 44 && r.t > 1) { r.t = 1; r.ub = true; r.grab = true; r.src = 'shot'; } continue; }
      if (sh.isMine) continue;   // a planted mine only goes off when stepped near: the footwork jumps over it (see P.update)
      const rel = p.x - sh.x, vx = sh.vx || 0;
      // a summon that chases and keeps biting (a wolf): dangerous whenever it is close, whichever way it faces right now
      if ((sh.life || 0) > 100 && Math.abs(rel) < 46 && Math.abs(sh.y - p.y) < 40) { const tt = sh.cd > 0 ? sh.cd : 1; if (tt < r.t) { r.t = tt; r.src = 'thing'; } continue; }
      // something dropping from above (Ferra's comet, Dyna's carpet bombs, a falling rock): it goes off where it lands.
      // A wide one or one that explodes (it has an onEnd) bursts around itself; a wide one thrown from a platform lands at
      // its thrower's height, above the floor
      if ((sh.vy || 0) > 2 && Math.abs(vx) < 1.5) {
        const wide = (sh.w || 8) >= 24, blast = wide ? 100 : sh.onEnd ? 48 : 0;
        if (Math.abs(rel) < (blast || (sh.w || 8) / 2 + p.w / 2 + 4)) {
          let land = (blast && Math.abs(rel) > p.w / 2 + (sh.w || 8) / 2 ? B - 2 : Tp) - (sh.y + (sh.h || 6) / 2);
          // a wide one passes through (ghost) and bursts 24 px above its thrower's feet or where it meets the floor, on
          // the frame it gets there
          if (wide) land = Math.min(q.y - 24, B - 12) - sh.y + sh.vy;
          const g2 = sh.g || 0, v = sh.vy, L2 = Math.max(0, land);
          const td = g2 > 0 ? Math.floor((-v + Math.sqrt(v * v + 2 * g2 * L2)) / g2) : Math.floor(L2 / v);
          if (td < r.t) { r.t = td; r.src = 'shot'; r.big = !!blast; }
        }
        continue;
      }
      if (Math.abs(rel) > 18 && (!vx || Math.sign(rel) !== Math.sign(vx))) continue;
      const gap = Math.max(0, Math.abs(rel) - p.w / 2 - (sh.w || 8) / 2), tt = vx ? gap / Math.abs(vx) : 0;
      const yy = sh.y + (sh.vy || 0) * tt + (sh.g || 0) * tt * tt / 2;
      if (yy > Tp - (sh.h || 6) - 4 && yy < B + 6 && tt < r.t) { r.t = Math.floor(tt); r.src = 'shot'; r.big = !!sh.onEnd; }
    }
    for (const e of o.ents) if (e && !e.gone && e.x !== undefined && e.dmg !== undefined && Math.abs(e.x - p.x) < 44 && r.t > 3) { r.t = 3; r.near = true; r.src = 'thing'; }
    return r;
  }
  // frames until the opponent can act again after a move that missed (0 if it can act now)
  function recovery(q) {
    if ((q.state === 'attack' || q.state === 'airatk') && q.atk && q.st > q.atk.hitEnd) return Math.max(0, q.atk.dur - q.st);
    if (q.state === 'cast' && q.st > 8) return Math.max(0, 20 - q.st);
    return 0;
  }
  HC.threat = threat;

  // ================= combo routes =================
  // tokens: J attack  L launcher (W+J)  W sweep (S+J)  K jump (after a launcher)  A air attack  T throw (J+L)
  //         U skill  u S+U  I special  i S+I  X ultimate (W+I)
  const TOK = {
    J: { key: 'attack' }, A: { key: 'attack' }, L: { key: 'attack', mod: 'up' }, W: { key: 'attack', mod: 'down' }, K: { key: 'jump' },
    U: { key: 'skill', slot: 'u' }, u: { key: 'skill', mod: 'down', slot: 'su' }, I: { key: 'special', slot: 'i' }, i: { key: 'special', mod: 'down', slot: 'si' },
    X: { key: 'special', mod: 'up' }, T: { key: 'attack', also: 'dash' },
    O: { key: 'awaken', mod: 'up', slot: 'wo' }, M: { key: 'awaken', mod: 'down' }   // W+O signature, S+O timed power-up (js/hardcore-skill.js)
  };
  HC.TOK = TOK;
  HC.notation = r => r.split('').map(c => ({ J: 'J', A: 'J', L: 'W+J', W: 'S+J', K: 'K', U: 'U', u: 'S+U', I: 'I', i: 'S+I', X: 'W+I', T: 'J+L', F: 'STEP', O: 'W+O', M: 'S+O' })[c]).reduce((s, t, i, a) => {
    const prev = r[i - 1], c = r[i];
    const sep = i === 0 ? '' : (c === 'K' || prev === 'K') ? ' > ' : (/[UuIiXOM]/.test(c) ? ' > ' : ' ');
    return s + sep + t;
  }, '');
  const sig = (p, S) => [p.state, p.atk, p.st, S.energy, p.airCombo, p.combo];
  function accepted(tk, b, p, S) {
    if (p.state === 'hurt' || p.dead) return false;
    if (tk === 'K') return p.state === 'jump' || (!p.onGround && p.vy < -2.5);
    const atk = p.state === 'attack' || p.state === 'airatk';
    if (atk && (p.atk !== b[1] || p.st < b[2] || p.state !== b[0])) return true;
    if (S.energy < b[3] - 8) return true;
    return p.state !== b[0] && !QUIET[p.state] && !atk;
  }
  // the energy and skill slots a route needs
  function needs(r) { const o = { e: 0, slots: [] }; for (const c of r) { const t = TOK[c]; if (t && t.slot) o.slots.push(t.slot); if (c === 'X') o.ult = true; } return o; }
  function affordable(f, R) {
    const p = f.p, S = f.state, cd = p.cd || {};
    if (R.cost > S.energy + 4) return false;
    const n = needs(R.r);
    if (n.ult && !(S.energy >= 300 || (p.awakeT > 0 && S.energy >= 100))) return false;
    return n.slots.every(s => !(cd[s] > 4));
  }
  // THE ULTIMATE PLAN (the user, 2026-11-18: "why nightmare dont use ult"). Measured: a Nightmare bot had a full bar only
  // 3-6% of the time and fired 0.24-0.5 ultimates a round, because slips (60 a time), skill combos, zoning and the power
  // mode spent the bar as it filled, and a full bar went into a combo. Now, from ULT.save energy it saves (free combos
  // only, no zoning or power mode; from ULT.noSlip no slips either), and with the bar full it opens with the ultimate on
  // any opening: a stun, a combo that landed, a whiff
  // Tuned on 190 rounds against Hard bots: saving from 180 (no slips from 270) gave 1.04 ultimates a round but 96.8% won;
  // from 240 with slips kept, 0.87 a round (95% land) and 98.4% won, as before the plan (no saving: 0.76, 99.5%)
  const ULT = HC.ULT = { save: 240, noSlip: 999 };
  const ultReady = f => f.state.energy >= 300 || (f.p.awakeT > 0 && f.state.energy >= 100);
  const saving = f => { const prm = (f.hc && f.hc.prm) || HC.params(f.hero); return !!prm.ultIn && !ultReady(f) && !(f.p.awakeT > 0) && f.state.energy >= ULT.save; };
  HC.ultReady = ultReady; HC.saving = saving;
  function bestRoute(f) {
    const list = HC.data.routes[f.hero] || DEFAULT_ROUTES, save = saving(f) || ultReady(f);
    let best = null;
    for (const R of list) if (affordable(f, R) && !(save && R.cost > 0) && (!best || R.dmg > best.dmg)) best = R;
    return best ? best.r : 'JJJ';
  }
  const DEFAULT_ROUTES = [{ r: 'JJJJ', dmg: 30, cost: 0 }, { r: 'JJJU', dmg: 34, cost: 25 }, { r: 'JJJI', dmg: 40, cost: 50 }, { r: 'JJJu', dmg: 36, cost: 40 }];
  function runRoute(f, k) {
    const h = f.hc, p = f.p, S = f.state;
    while (h.r) {
      const tk = h.r[h.ri];
      if (!tk) { h.r = null; h.tk = null; return false; }
      // F: step back into reach (a hit that pushed the target away, as Itsuki's Thunder Palm does, leaves it stunned
      // long enough to walk in for the next J)
      if (tk === 'F') {
        const o = V.f && V.f.find(x => x && x !== f), q = o && o.p, gap = q ? Math.abs(q.x - p.x) : 0;
        if (!h.tk) h.tk = { n: 0, w: 0 };
        const dir = q && q.x > p.x ? 'right' : 'left', faces = q && p.face === (q.x > p.x ? 1 : -1);
        if (FREE[p.state] || p.state === 'dash') h.tk.n++; else h.tk.w++;
        if (p.state === 'dash' && h.tk.n < 30) return true;   // let a dash run out (a J pressed in a dash comes out as a dash attack)
        if (!q || (gap <= reachOf(p) - 6 && faces && p.onGround) || h.tk.n > 30 || h.tk.w > 40) { h.ri++; h.tk = null; continue; }
        if (FREE[p.state]) { k[dir] = true; if (gap > reachOf(p) + 24 && h.tk.n <= 2 && !h.tk.d) { k.dash = true; h.tk.d = 1; } }   // a wide gap: one dash in (walking let the stun run out)
        return true;
      }
      const T = TOK[tk];
      if (!T) { h.ri++; continue; }
      if (!h.tk) h.tk = { n: 0, b: sig(p, S) };
      if (h.tk.n > 0 && accepted(tk, h.tk.b, p, S)) { h.ri++; h.tk = null; continue; }
      h.tk.n++;
      if (h.tk.n > 36) { h.r = null; h.tk = null; return false; }   // the window closed: drop the rest of the route
      if (T.mod) k[T.mod] = true;
      if (h.tk.n % 2 === 1) { k[T.key] = true; if (T.also) k[T.also] = true; }
      return true;
    }
    return false;
  }
  HC.start = (f, r) => { const h = f.hc || (f.hc = {}); h.r = r; h.ri = 0; h.tk = null; h.whiffT = 0; };

  // ================= the mirror show: a neutral game for Nightmare against Nightmare =================
  const SLOTKEYS = { u: ['skill'], su: ['skill', 'down'], i: ['special'], si: ['special', 'down'] };
  const SLOTNAME = { u: 'U', su: 'S+U', i: 'I', si: 'S+I' };
  function mirrorPlay(f, o, k, h, c) {
    const { p, q, S, adx, to, away, facing, reach, cd, say, prm } = c, now = V.t;
    const wallBehind = away === 'left' ? p.x < 40 : p.x > V.zone.pw - 40;
    // in the air from a jump-in: drift in and strike on the way down
    if (!p.onGround) {
      if (h.plan && h.plan.a === 'jumpin') { k[to] = true; if (p.vy > -1 && adx < 60 && h.t % 2) k.attack = true; say('JUMP IN'); return true; }
      return false;
    }
    // nobody turtles: once the opponent has stood still (idle or holding guard) for 2-3 seconds, attack at a random
    // moment within the next 1-3 seconds (a string or a throw up close, a rush or a jump-in from further out)
    const qStill = q.onGround && (q.state === 'idle' || q.state === 'guard') && Math.abs(q.vx || 0) < 0.5;
    if (!qStill) { h.qs = 0; h.qsDue = 0; }
    else {
      h.qs = (h.qs || 0) + 1;
      if (h.qs === 1) h.qsTrig = MIR.still[0] + (Math.random() * (MIR.still[1] - MIR.still[0]) | 0);
      if (h.qs >= h.qsTrig && !h.qsDue) h.qsDue = now + MIR.attackIn[0] + (Math.random() * (MIR.attackIn[1] - MIR.attackIn[0]) | 0);
      if (h.qsDue && now >= h.qsDue) {
        const r = Math.random();
        h.plan = { a: adx < 52 ? (r < 0.65 ? 'string' : 'throw') : (r < 0.6 ? 'rush' : 'jumpin'), t0: now, until: now + 60 };
        h.qs = 0; h.qsDue = 0; h.chg = 99; say('IT WAITED - ATTACK');
      }
    }
    // a boss builds the bar for its one-opening KO (Itsuki: step in and J > I four times, 491 damage, 120 energy: the game's juggle limit, enough to KO anyone from full) before going in
    if (MIR.boss[f.hero] && S.energy < 120 && adx > 110 && !h.qsDue) { k.attack = true; k.jump = true; say('CHARGE FOR THE KILL'); return true; }
    // energy: only short bursts of charging, and only when far apart and low
    if (adx > 150 && S.energy < 120 && (h.chg || 0) < 45) { h.chg = (h.chg || 0) + 1; k.attack = true; k.jump = true; say('CHARGE (SHORT)'); return true; }
    if (adx <= 150 || S.energy >= 120) h.chg = 0;
    if (q.state === 'guard' && h.lastA === 'hit' && !h.blockedT) h.blockedT = now;   // what we threw was blocked
    let pl = h.plan;
    if (!pl || now > pl.until) {
      const r = Math.random(), close = adx < 52, blocked = h.blockedT && now - h.blockedT < 40;
      let a;
      if (blocked && !wallBehind && r < 0.6) a = 'back';
      else if (adx > 130) a = r < 0.8 ? 'approach' : 'poke';
      else if (close) a = r < 0.45 ? 'string' : r < 0.7 ? 'throw' : r < 0.85 ? 'poke' : 'back';
      else a = r < 0.3 ? 'rush' : r < 0.5 ? 'jumpin' : r < 0.72 ? 'poke' : r < 0.86 ? 'feint' : 'ready';
      pl = h.plan = { a, t0: now, until: now + ({ approach: 50, feint: 26, ready: 10 + (Math.random() * 16 | 0), back: 16 })[a] || 40 };
      h.blockedT = 0; h.lastA = null;
    }
    const t = now - pl.t0;
    if (!facing && pl.a !== 'back') { k[to] = true; return true; }
    switch (pl.a) {
      case 'approach': k[to] = true; if (adx > 170 && h.t % 12 === 0) k.dash = true; say('MOVE IN'); return true;
      case 'rush': case 'string': {
        if (adx > reach + 2) { k[to] = true; if (adx > reach + 30 && h.t % 2) k.dash = true; say('RUSH IN'); if (t > 60) pl.until = now; return true; }
        const free = (HC.data.routes[f.hero] || []).filter(x => x.cost === 0 && !/[TX]/.test(x.r)).sort((a, b) => b.dmg - a.dmg)[0];
        // a boss throws one J: if it lands, the confirm starts its one-opening chain. Others, with a bar to spend, now and
        // then go in with the strongest route they can pay for (its skills come out if the first hits land)
        const paid = S.energy >= 75 && Math.random() < 0.45 ? HC.bestRoute(f) : null;
        const r = MIR.boss[f.hero] ? 'J' : paid || (free ? free.r : 'JJJ');
        HC.start(f, r); h.mr = 26; h.lastA = 'hit'; runRoute(f, k); pl.until = now; say('STRING  ' + HC.notation(r)); return true;
      }
      case 'jumpin': if (t < 3) { k.jump = true; k[to] = true; say('JUMP IN'); return true; } pl.until = now; return false;
      case 'poke': {
        if (HC.ext && HC.ext('poke', f, o, k, c)) { pl.until = now; h.mr = 12; h.lastA = 'hit'; return true; }
        const slots = ['u', 'su', 'i', 'si'], start = (h.pk = ((h.pk || 0) + 1) % 4);
        for (let n = 0; n < 4; n++) {
          const sl = slots[(start + n) % 4];
          if (cd[sl] > 0 || S.energy < (sl === 'u' ? 25 : sl === 'si' ? 100 : 50)) continue;
          HC.start(f, ({ u: 'U', su: 'u', i: 'I', si: 'i' })[sl]); h.mr = 12; h.lastA = 'hit'; runRoute(f, k);
          pl.until = now; say('POKE ' + SLOTNAME[sl]); return true;
        }
        pl.a = adx > reach + 6 ? 'rush' : 'string'; return true;   // nothing ready: go in instead
      }
      case 'feint': if (t < 12) { k[to] = true; say('FEINT IN'); } else { k[away] = true; say('FEINT OUT'); } return true;
      case 'throw':
        if (adx > prm.throwR) { k[to] = true; if (t > 40) pl.until = now; say('IN FOR A THROW'); return true; }
        HC.start(f, 'T'); h.mr = 8; runRoute(f, k); pl.until = now; say('THROW'); return true;
      case 'back': if (wallBehind) { pl.until = now; return false; } k[away] = true; if (t < 2) k.dash = true; say('BACK OFF'); return true;
      case 'ready': say('READY'); return true;
    }
    return false;
  }
  // throws in a mirror are broken only part of the time (js/throw.js asks V.breakChance)
  const _bc = V.breakChance;
  if (_bc) V.breakChance = function (f) {
    const o = V.f && V.f.find(x => x && x !== f);
    return HC.opt.mirrorShow && f && o && f.bot && o.bot && HC.is(f) && HC.is(o) && !MIR.boss[f.hero] ? MIR.breakT : _bc.apply(this, arguments);
  };

  // ================= the brain =================
  function think(f, o, k) {
    const p = f.p, q = o.p, S = f.state, h = f.hc || (f.hc = { t: 0 }), prm = h.prm || (h.prm = HC.params(f.hero));
    h.t = (h.t || 0) + 1;
    if (!q || q.dead || p.dead) return;
    if (HC.test) { if (f.labKeys) Object.assign(k, f.labKeys); runRoute(f, k); return; }   // the trainer runs routes on their own (the move lab can hold keys for a dummy)
    const dx = q.x - p.x, adx = Math.abs(dx), to = dx > 0 ? 'right' : 'left', away = dx > 0 ? 'left' : 'right', facing = (dx > 0 ? 1 : -1) === p.face;
    // how long the opponent stays helpless: a perfect-block stun, or the hit-stun of what we just landed
    // open: stunned, or still reeling from a hit; a target knocked into the air stays helpless until it lands, however
    // long its hurt timer was (the air string after a launcher depends on this)
    const openT = Math.max(o.stunT > 0 ? o.stunT : 0, q.state === 'hurt' ? (q.hurtLen || 18) - q.st : 0, q.state === 'hurt' && !q.onGround && HC.opt.airOpen ? 4 : 0), open = openT > 0 && q.state !== 'slip';
    const oS = o.state, ultUp = oS.energy >= 300 || (q.awakeT > 0 && oS.energy >= 100), burstUp = oS.awaken >= 100 && !(q.awakeT > 0);

    const say = w => { h.why = w; h.whyT = V.t; };   // what it is doing, for the training viewer (tools/hardcore-watch.js)

    // hit: slip out of the combo (S + L) if the bar allows and it is not our own route that got interrupted by a trade
    if (p.state === 'hurt') {
      h.mr = 0; h.plan = null;
      // (in the mirror show nobody slips out of a boss's combo: Itsuki's chain is meant to finish)
      const bossCombo = HC.opt.mirrorShow && o.bot && HC.is(o) && MIR.boss[o.hero];
      const keepBar = prm.ultIn && S.energy >= ULT.noSlip && !(p.awakeT > 0);   // nearly full: take the hits (they fill it) and keep it for the ultimate
      if (prm.slip && !bossCombo && !keepBar && S.energy >= 60 && !(f.stunT > 0) && !open) { k.down = true; if (h.t % 2) k.dash = true; say('HIT - SLIP OUT'); }
      else say('HIT');
      h.r = null; return;
    }
    const th = threat(f, o), canGuard = p.onGround && (FREE[p.state] || p.state === 'guard'), cd = p.cd || {};
    const mirror = HC.opt.mirrorShow && o.bot && HC.is(o);
    // with an empty bar an ultimate cannot be blocked (js/ult-guard.js): get away from it like any unblockable
    if (q.state === 'ult' && S.energy < 1 && SW.ultGuard && SW.ultGuard.on) th.ub = true;
    // a ring of blades around the opponent (Ferra's Scrap Halo, I: four blades orbiting 36 px out for six seconds): anyone
    // inside is cut and interrupted every 14 frames, so a combo into it breaks. A route that is not a throw stops
    const aura = o.shots.find(s => s.isHalo && !s.gone && (s.t || 0) < 352);
    // a route in progress keeps going while the target is still open; if it slipped out, stop and defend
    // A whiff punish starts before the target is hurt: give its first hit time to land (the target still recovering, or a
    // few frames), then it needs the target open like any other route
    if (h.r && h.whiffT > 0) { h.whiffT--; if (open) h.whiffT = 0; }
    const opening = open || (h.whiffT > 0 && (recovery(q) > 0 || q.state === 'hurt')) || (h.mr > 0 && h.mr-- > 0);
    if (h.r) {
      if (opening && !(th.src === 'shot' && th.t <= 3 && canGuard) && !(aura && h.r !== 'T')) { if (runRoute(f, k)) { say('COMBO  ' + HC.notation(h.r) + '  [' + Math.min(h.ri + 1, h.r.length) + '/' + h.r.length + ']'); return; } }
      else { h.r = null; h.tk = null; say(q.state === 'slip' ? 'IT SLIPPED OUT - DEFEND' : 'COMBO DROPPED'); }
    }
    const reach = reachOf(p), first = firstHit(p);
    // what this hero knows about its own moves and the opponent's (js/hardcore-skill.js): HC.ext(stage, ...) returns true
    // when it pressed something. c: the readings the stages share
    const X = HC.ext, c = X && { p, q, S, h, th, open, openT, adx, dx, to, away, facing, reach, first, cd, say, prm, mirror, canGuard, ultUp };
    if (X && X('react', f, o, k, c)) return;
    // COUNTER 1: a brace that answers whatever hits it (Aldric's Oathkeeper, S + U): set it a few frames before the hit
    const brace = COUNTER_SLOT[f.hero];
    if (brace && th.src === 'body' && th.t >= 2 && th.t <= 14 && !open && canGuard && !(cd[brace.slot] > 0) && S.energy >= brace.cost && !(p.riposteT > 0)) {
      if (!facing) { k[to] = true; return; }
      k.skill = h.t % 2 === 1; if (brace.slot === 'su') k.down = true;
      say('COUNTER - ' + brace.name + ' (hit in ' + th.t + 'f)'); return;
    }
    if (p.riposteT > 0) { say('COUNTER READY'); return; }
    // defence, frame-perfect (a helpless opponent can still have a shot or a summon in the air)
    // MIRROR: a read on each attack as it comes: perfect (as below), a plain block (guard raised early, so it blocks but
    // does not stun), or a miss (no guard: the hit lands)
    let mirrorMiss = false;
    if (mirror && !MIR.boss[f.hero] && canGuard && !th.grab && !th.ub && th.t <= 12 && !open) {
      if (!h.gdec || V.t > h.gdec.until) { const r = Math.random(); h.gdec = { mode: r < MIR.miss ? 'miss' : r < MIR.miss + MIR.plain ? 'plain' : 'perfect', until: V.t + th.t + 8 }; }
      if (h.gdec.mode === 'plain') { k.down = true; say('GUARD'); return; }
      if (h.gdec.mode === 'miss') mirrorMiss = true;
    }
    if (!mirrorMiss && th.t <= 4 && (!open || th.src === 'shot' || th.src === 'thing')) {
      if (th.grab || th.ub) {
        // COUNTER 2: a grab or an unblockable that starts slowly is hit first (a counter-hit cancels it); else get away
        if (th.src === 'body' && th.t >= first + 1 && adx <= reach && canGuard) { if (!facing) { k[to] = true; return; } HC.start(f, 'J'); runRoute(f, k); say('COUNTER-HIT (' + (th.grab ? 'grab' : 'unblockable') + ')'); return; }
        if (p.onGround && FREE[p.state]) { k.jump = true; k[away] = true; }
        say('UNBLOCKABLE - JUMP AWAY'); return;
      }
      if (canGuard) {
        // let go for a frame so the next press is a fresh, perfect one; against something that keeps biting (a summon, a
        // lingering shot) keep pulsing the guard, since a held guard only blocks and every block costs chip damage
        if (p.state === 'guard' && !(th.big && th.t <= 2) && !(q.state === 'ult' && !HC.opt.ultPulse) && ((p.guardT > 5 && (th.t >= 1 || th.src === 'shot' || th.src === 'thing')) || (p.guardT > 6 && !(th.t === 0 && th.src === 'body')))) { say('PULSE GUARD'); return; }
        k.down = true; say('PERFECT GUARD - hit in ' + th.t + 'f (' + (th.src || 'move') + ')'); return;
      }
    }
    if (aura && th.t > 4) {   // stay outside the blades until they are gone: back off, or guard them against a wall
      const wall = away === 'left' ? p.x < 40 : p.x > V.zone.pw - 40;
      if (adx < 78) {
        if (!wall && FREE[p.state]) { k[away] = true; if (adx < 58 && h.t % 2) k.dash = true; say('BLADES AROUND IT - BACK OFF'); return; }
        if (canGuard) { k.down = true; say('BLADES AROUND IT - GUARD'); return; }
      } else if (adx < 150) { if (!facing) k[to] = true; say('BLADES AROUND IT - WAIT IT OUT'); return; }
    }
    if (X && X('read', f, o, k, c)) return;
    if (p.state === 'guard' && th.t > 4) { say('WAIT'); return; }   // let the guard drop and wait for the next swing
    // punish: a stunned or hit opponent eats the best route this hero has right now
    if (open && q.state !== 'dead') {
      if (!facing) { k[to] = true; return; }
      // stages with platforms (js/stages.js): jump up to a target above, drop through the floor to one below
      const dy = q.y - p.y;
      if (dy < -28 && q.onGround && p.onGround && openT > 24) { k.jump = h.t % 2 === 1; k[to] = true; say('OPEN ABOVE - JUMP UP'); return; }
      if (dy > 28 && q.onGround && p.onGround && openT > 24) { k.down = true; k.jump = h.t % 2 === 1; if (adx > 20) k[to] = true; say('OPEN BELOW - DROP DOWN'); return; }
      if (adx > reach) {
        const travel = (adx - reach) / (adx > 70 ? 5.8 : 2.1);
        if (travel + first > openT) { if (X && X('far', f, o, k, c)) return; say('TOO FAR TO PUNISH'); return; }   // it will be up before we get there: do not run into it
        k[to] = true; if (adx > 70 && h.t % 2) k.dash = true; say((o.stunT > 0 ? 'STUNNED' : 'OPEN') + ' - RUN IN'); return;
      }
      // a ground route only connects with both feet down and the target in reach of a ground swing: a target juggled
      // high overhead is waited for (every swing passes under it), and a new route starts from the ground
      if (HC.opt.juggleWait && !q.onGround && q.y - p.y < -40) { if (!facing) k[to] = true; say('JUGGLED HIGH - WAIT FOR IT'); return; }
      if (HC.opt.juggleWait && !p.onGround) { say('LAND FIRST'); return; }
      // routes were measured from 22 px away: with stun to spare, step in that close first so the later hits still reach
      if (HC.opt.stepIn && o.stunT > 0 && adx > 26 && FREE[p.state] && (adx - 24) / 2.1 + first + 6 < openT) { k[to] = true; say('STUNNED - STEP IN CLOSE'); return; }
      if (first > openT + 1) return;
      let r = bestRoute(f);
      if (prm.ultIn && ultReady(f) && (o.stunT > 10 || openT > 6)) r = 'X';
      HC.start(f, r); runRoute(f, k); say((o.stunT > 0 ? 'PUNISH STUN  ' : 'CONFIRM  ') + HC.notation(r)); return;
    }
    // whiff punish: the opponent is stuck in the end of a move that missed
    const rec = recovery(q);
    if (rec > 0 && th.t > 6 && q.state !== 'guard') {
      const need = Math.max(0, adx - reach) / 5.8 + 6;
      if (!(rec > need) && X && FREE[p.state] && X('whiff', f, o, k, Object.assign(c, { rec }))) return;
      if (rec > need && FREE[p.state]) {
        if (!facing) { k[to] = true; return; }
        if (adx > reach) { k[to] = true; if (adx > reach + 20) k.dash = h.t % 2 === 1; say('WHIFF - RUN IN'); return; }
        const r = prm.ultIn && ultReady(f) && rec > 14 ? 'X' : bestRoute(f); HC.start(f, r); h.whiffT = HC.opt.whiff ? first + 4 : 0; runRoute(f, k); say('WHIFF PUNISH  ' + HC.notation(r)); return;
      }
    }
    if (!FREE[p.state] && p.state !== 'dash') return;
    // a guard up close gets thrown
    if (q.state === 'guard' && adx < prm.throwR && p.onGround) { if (!facing) { k[to] = true; return; } HC.start(f, 'T'); runRoute(f, k); say('THROW THE GUARD'); return; }
    // the timed power-up when it is safe
    if (S.awaken >= 100 && p.awakeT <= 0 && adx > 90 && th.t > 30) { k.awaken = h.t % 2 === 1; say('POWER UP'); return; }
    // neutral: hold the spacing, charge the bar from a distance, poke with the first skill
    // stay out of the reach of a power-up burst (it knocks back anyone within 70) while the opponent has one ready
    if (X && th.t > 6 && !open && FREE[p.state] && X('neutral', f, o, k, c)) return;
    if (mirror && th.t > 6 && !open && FREE[p.state] && mirrorPlay(f, o, k, h, { p, q, S, adx, to, away, facing, reach, cd, say, prm })) return;
    if (burstUp && adx < 88 && !open) { const wall = away === 'left' ? p.x < 40 : p.x > V.zone.pw - 40; if (!wall) { k[away] = true; if (adx < 60 && h.t % 2) k.dash = true; say('KEEP AWAY FROM ITS BURST'); return; } }
    // PRESSURE (a play-style option, off unless a hero's tuned params turn it on): against an opponent that only waits
    // (another Nightmare, for one), a round ends on the clock and goes to whoever has more health left, so landing
    // anything wins it. zone: from mid range, fire every skill that is ready in turn (shots from a distance cannot be
    // punished even when perfect-guarded); ultOpen: fire the ultimate when the bar is full and the opponent in its reach,
    // instead of keeping it for a stunned target
    // GRAB (play-style option): a skill that seizes whoever it reaches and cannot be blocked (Itsuki's S + U in Versus,
    // js/itsuki-edge.js) is the way through a perfect guard: use it when the opponent is in its reach on the ground
    if (prm.grab && FREE[p.state] && p.onGround && q.onGround && adx < prm.grab && adx > 14 && !(cd.su > 0) && S.energy >= 50 && th.t > 6 && !open && FREE[q.state]) {
      if (!facing) { k[to] = true; return; }
      if (h.t % 2) { k.skill = true; k.down = true; }
      say('GRAB - CANNOT BE BLOCKED'); return;
    }
    if (prm.ultOpen && !mirror && FREE[p.state] && p.onGround && (S.energy >= 300 || (p.awakeT > 0 && S.energy >= 100)) && adx < prm.ultOpen && th.t > 8) {
      if (!facing) { k[to] = true; return; }
      HC.start(f, 'X'); runRoute(f, k); say('ULTIMATE - PRESSURE'); return;
    }
    if (prm.zone && FREE[p.state] && p.onGround && adx > 60 && adx < prm.zone && th.t > 10) {
      if (!facing) { k[to] = true; return; }
      const order = ['U', 'u', 'I', 'i', 'Y'], keys = { U: ['skill'], u: ['skill', 'down'], I: ['special'], i: ['special', 'down'], Y: ['skill', 'up'] }, slot = { U: 'u', u: 'su', I: 'i', i: 'si', Y: 'u' };
      for (let n = 0; n < order.length; n++) {
        const t = order[(h.zi = ((h.zi || 0) + 1) % order.length)];
        if (cd[slot[t]] > 0 || S.energy < 25) continue;
        if (h.t % 2) keys[t].forEach(x => { k[x] = true; });
        say('ZONE - ' + ({ U: 'U', u: 'S+U', I: 'I', i: 'S+I', Y: 'W+U' })[t]); return;
      }
    }
    if (adx > 150 && prm.charge && S.energy < 300 && th.t > 24 && p.onGround && !ultUp && !burstUp) { k.attack = true; k.jump = true; say('CHARGE'); return; }
    if (adx > 110 && adx < 230 && S.energy >= 40 && !(cd.u > 0) && th.t > 20 && (h.t % 40) === 0 && Math.random() < prm.poke) { if (!facing) { k[to] = true; return; } k.skill = true; say('POKE'); return; }
    if (adx > prm.space + 16) { k[to] = true; say('CLOSE IN TO ' + prm.space); return; }
    if (adx < prm.space - 22 && th.t > 8) {
      const wall = away === 'left' ? p.x < 40 : p.x > V.zone.pw - 40;
      if (!wall) { k[away] = true; say('SPACING'); return; }
      if (q.onGround && FREE[q.state] && adx < 34 && p.onGround) { if (!facing) { k[to] = true; return; } HC.start(f, 'T'); runRoute(f, k); say('CORNERED - THROW'); return; }
    }
    if (!facing) k[to] = true;
    say(ultUp ? 'WATCH ITS ULTIMATE' : 'READ AND WAIT');
  }
  function firstHit(p) { const a = p.comboSet && p.comboSet()[0]; return a ? a.hitAt + 1 : 6; }
  function reachOf(p) {
    const a = p.comboSet && p.comboSet()[0];
    return a && a.box ? a.box[0] + a.box[2] + 2 : 28;
  }
  HC.think = think;
  Object.assign(HC, { runRoute, recovery, reachOf: p => reachOf(p), firstHit: p => firstHit(p), FREE, QUIET, bestRoute: f => bestRoute(f) });
  // heroes with a counter skill: which slot it is on, its cost and name (read from each hero's kit, so a new hero with one
  // of these abilities picks it up too)
  const COUNTERS = ['riposte'], COUNTER_SLOT = {};
  Object.keys(D.heroes).forEach(id => { const kit = D.heroes[id].kit || []; COUNTERS.forEach(a => { const i = kit.indexOf(a), A = D.abilities[a]; if (i >= 0 && i < 3 && A) COUNTER_SLOT[id] = { slot: ['u', 'su', 'i'][i], cost: A.cost || 0, name: A.name }; }); });
  HC.counters = COUNTER_SLOT;

  // ================= wiring =================
  // Each fighter's turn: readInput has filled in its keys (for a bot, the ordinary bot's) and set the press times; a
  // Hardcore bot's keys are replaced here, and the press times the ordinary bot set are rolled back.
  const _upd = P.update;
  P.update = function (g, z) {
    const f = g.scene === 'vs' && V.cur && V.cur.p === this ? V.cur : null;
    if (f && HC.is(f) && V.phase === 'fight' && V.f.length === 2) {
      const inp = f.inp, k = {};
      // the stage twists (js/stages.js). Glass cracking underfoot: the stage's own bot help has already steered the keys
      // off it, so let it drive. The train through Platform Zero is ignored on purpose: it does 14 damage, and climbing
      // away from it lost far more (85% of rounds won climbing, 99% fighting on)
      const sw = z && z.sw, gp = this.swPlat;
      f.swGoal = null;   // the stage help's own climbs (on a whim, or from the train) are not Hardcore's plan
      if (sw && gp && gp.kind === 'glass' && gp.load > 45) {
        if (f.hc) { f.hc.r = null; f.hc.why = 'GLASS CRACKING - STEP OFF'; }
        const r = _upd.call(this, g, z);
        f.hcLast = Object.assign({}, inp.lastHit);
        return r;
      }
      if (f.hcLast) inp.lastHit = Object.assign({}, f.hcLast);
      if (!(f.stunT > 0)) { try { think(f, V.f[1 - f.i], k); } catch (e) { console.error(e); } }
      // footwork: an armed mine (Dyna's S + U) goes off when anyone steps within 34 px of it; walking toward one, jump it
      const dir = k.right ? 1 : k.left ? -1 : 0;
      if (dir && this.onGround && (this.state === 'idle' || this.state === 'run' || this.state === 'dash')) {
        for (const m of V.f[1 - f.i].shots) if (m.isMine && !m.gone && m.t > 24 && Math.sign(m.x - this.x) === dir && Math.abs(m.x - this.x) < 62 && Math.abs(m.y - this.y) < 20) {
          k.jump = true; k.down = false; if (f.hc) f.hc.why = 'JUMP OVER THE MINE'; break;
        }
      }
      for (const a in inp.now) delete inp.now[a];
      Object.assign(inp.now, k);
      for (const a in k) if (!inp.prev[a]) inp.lastHit[a] = SW.frame;
      SW.input.lastHit = inp.lastHit;
      // the ordinary bot rolls dice inside some moves (moves.js: a bot's I is now and then swapped for S + I): a Hardcore
      // bot plays exactly what it pressed, so its turn runs as a player's
      f.bot = false;
      let r;
      try { r = _upd.call(this, g, z); } finally { f.bot = true; }
      f.hcLast = Object.assign({}, inp.lastHit);
      return r;
    }
    return _upd.call(this, g, z);
  };

  // ================= recommended combos, in Versus Training =================
  // three picks: the strongest with no energy, the strongest for one bar (100) or less, and the strongest of all
  HC.recommend = hero => {
    const list = HC.data.routes[hero] || [], best = lim => list.filter(R => R.cost <= lim).sort((a, b) => b.dmg - a.dmg)[0];
    const out = [];
    [0, 100, 1e9].forEach(lim => { const R = best(lim); if (R && out.indexOf(R) < 0) out.push(R); });
    return out;
  };
  const _draw = V.draw;
  V.draw = function (ctx) {
    _draw.apply(this, arguments);
    if (V.mode !== 'train' || V.phase !== 'fight' || V.paused || !V.f[0] || V.showMoves === false) return;
    const list = HC.recommend(V.f[0].hero);
    if (!list.length) return;
    const x = 8, y = 178, w = 300;
    ctx.globalAlpha = 0.72; art().rect(ctx, '#05060c', x - 4, y - 4, w, 12 + list.length * 11); ctx.globalAlpha = 1;
    text(ctx, 'RECOMMENDED COMBOS', x, y, '#ffe066');
    list.forEach((R, i) => {
      const yy = y + 11 + i * 11;
      text(ctx, HC.notation(R.r), x, yy, '#ffffff');
      text(ctx, R.cost ? R.dmg + ' dmg, ' + R.cost + ' energy' : R.dmg + ' dmg, no energy', x + w - 10, yy, R.cost ? '#8a92b8' : '#7dffb2', { align: 'right' });
    });
  };
  const art = () => SW.art;
  // its few words, in the game's other languages (kept here so the shared language files need no change)
  if (SW.i18n && SW.i18n.add) {
    SW.i18n.add('es', { 'Bot levels': 'Niveles de bots', 'Same': 'Igual', 'Mixed': 'Mezclado', 'Rising': 'En aumento', 'Set each': 'Uno por uno', 'Set each: A / D left bot level, W / S right bot level': 'Uno por uno: A / D nivel del bot izquierdo, W / S del derecho', 'Nightmare': 'Pesadilla', 'RECOMMENDED COMBOS': 'COMBOS RECOMENDADOS', '{0} dmg, {1} energy': '{0} de daño, {1} de energía', '{0} dmg, no energy': '{0} de daño, sin energía' });
    SW.i18n.add('zh', { 'Bot levels': '机器人难度', 'Same': '统一', 'Mixed': '随机', 'Rising': '逐轮提升', 'Set each': '逐个设置', 'Set each: A / D left bot level, W / S right bot level': '逐个设置：A / D 左侧机器人难度，W / S 右侧机器人难度', 'Nightmare': '噩梦', 'RECOMMENDED COMBOS': '推荐连招', '{0} dmg, {1} energy': '{0}伤害，{1}能量', '{0} dmg, no energy': '{0}伤害，无需能量' });
  }
})();
