'use strict';
// Shattered Worlds — what a NIGHTMARE bot knows about its hero's moves (and the opponent's tricks). Loaded after js/hardcore.js.
// The user (2026-11-17): "for nightmare make every hero understand their moves well, when to use counter and use skills
// to make battle visual experience better".
// The move lab (tools/hardcore-moves.js) measured every move of every hero (js/hardcore-moves.js): where it hits standing
// and in the air, how fast, how long the hero is stuck after it, whether a guard can answer it, invincible frames. From
// that, each Nightmare bot uses its own kit where it works:
//   ANTI-AIR        an opponent jumping in without an attack out is met with the move that reaches where it will be
//   RANGED PUNISH   a stunned or whiffing opponent too far to run to is hit with the move that gets there in time;
//                   an opponent charging its bar at a distance is hit too
//   COUNTERS        an Oathkeeper brace (Aldric) is not struck up close: baited with a shot from outside its swing, or
//                   waited out; an opponent between worlds (Orin, Mira, Noct after a perfect guard) cannot be touched, so
//                   it keeps its guard and its distance; between worlds itself, it strikes straight through the opponent's
//                   moves and walks in for the ambush
//   SKILLS          the timed power mode (S+O) and the signature (W+O) when they are safe; skills from the distance they
//                   reach and are safe at; in a Nightmare-vs-Nightmare fight, every skill gets its turn at its own range
// HC.ext(stage, f, o, k, c) is called from js/hardcore.js at each decision point; true means it pressed something.
(function () {
  const SW = window.SW, V = SW.versus, HC = SW.hardcore, D = SW.data;
  if (!HC || !V || !HC.runRoute) return;
  const A = D.abilities, HR = D.heroes, MD = SW.hardcoreMoves || {};
  const BURST = (SW.moves && SW.moves.BURST) || {}, SIG = (SW.signature && SW.signature.SIG) || {}, SIGCOST = (SW.signature && SW.signature.COST) || 75;
  const GX = [16, 36, 62, 95, 135, 180, 235, 300], AIR = [[28, 50], [60, 50], [105, 55], [40, 95], [85, 95]];
  const SLOT = { U: 'u', u: 'su', I: 'i', i: 'si', O: 'wo' };
  const KS = HC.KS = { on: true, aa: true, ranged: true, counters: true, skills: true, mirrorPoke: true, zoneGap: 70, revP: 0.3 };   // switches, for testing each piece
  const MAX_SPEED = 5.8;   // a dash: how fast an opponent can close a gap

  // ---------- reading the measured table ----------
  const idOf = (hero, tk) => { const h = HR[hero]; if (!h) return null; return tk === 'U' ? h.kit[0] : tk === 'u' ? h.kit[1] : tk === 'I' ? h.kit[2] : tk === 'i' ? (BURST[hero] || {}).id : tk === 'O' ? (SIG[hero] || {}).id : tk === 'X' ? h.ultimate : tk === 'M' ? h.mode : null; };
  const nameOf = (hero, tk) => { const id = idOf(hero, tk), a = id && A[id]; return a ? a.name : ({ U: 'U', u: 'S+U', I: 'I', i: 'S+I', O: 'W+O', X: 'W+I', M: 'S+O' })[tk]; };
  const costOf = (hero, tk) => { if (tk === 'X') return 300; if (tk === 'O') return SIGCOST; if (tk === 'i') return 100; const id = idOf(hero, tk), a = id && A[id]; return a && a.cost !== undefined ? a.cost : ({ U: 25, u: 50, I: 50, M: 100 })[tk] || 0; };
  // frames until move m hits a target standing dx px ahead (-1: it does not reach there)
  function hitT(m, dx) {
    if (!m || !m.g) return -1;
    if (dx <= GX[0]) return m.g[0];
    for (let i = 0; i < GX.length - 1; i++) {
      if (dx > GX[i + 1]) continue;
      const a = m.g[i], b = m.g[i + 1], u = (dx - GX[i]) / (GX[i + 1] - GX[i]);
      if (a >= 0 && b >= 0) return Math.round(a + (b - a) * u);
      if (a >= 0 && u < 0.35) return a;
      if (b >= 0 && u > 0.65) return b;
      return -1;
    }
    return dx <= GX[GX.length - 1] + 14 ? m.g[GX.length - 1] : -1;
  }
  HC.hitT = hitT;
  // is the hero ready to throw tk now: energy, cooldown, and (for W+O) a signature at all
  function ready(f, tk) {
    const p = f.p, S = f.state, cd = p.cd || {}, m = (MD[f.hero] || {})[tk];
    if (!m && tk !== 'M') return false;
    if (tk === 'X') return S.energy >= 300 || (p.awakeT > 0 && S.energy >= 100);
    if (tk === 'O' && !SIG[f.hero]) return false;
    if (tk === 'M') return !!(HR[f.hero] && HR[f.hero].mode) && !(p.modeT > 0) && S.energy >= costOf(f.hero, 'M');
    return S.energy >= costOf(f.hero, tk) && !(cd[SLOT[tk]] > 0);
  }
  HC.ready = ready;
  // press tk (a one-token route: the route runner presses it the way the combos do)
  function press(f, k, tk, h, why, say, hold) {
    HC.start(f, tk); h.mr = hold || 10; HC.runRoute(f, k);
    (h.used || (h.used = {}))[tk] = V.t; h.kn = (h.kn || 0) + 1;
    say(why + ' - ' + nameOf(f.hero, tk)); return true;
  }
  // the opponent's next position if it keeps flying as it is (gravity 0.42, stopping at its floor)
  function fly(q, t, floor) { const y = Math.min(floor, q.y + q.vy * t + 0.21 * t * t); return { x: q.x + q.vx * t, y }; }

  // ---------- the stages ----------
  const TK = ['U', 'u', 'I', 'i', 'O', 'X'];
  // the move that hits a target dx away within `within` frames, best damage first (soonest on a tie); opts.safeAt: also safe from there
  function pickGround(f, dx, within, opts) {
    const md = MD[f.hero] || {}; let best = null;
    for (const tk of opts && opts.list || TK) {
      if (tk === 'X' && !(opts && opts.ult)) continue;
      const m = md[tk]; if (!m || !ready(f, tk)) continue;
      const t = hitT(m, dx); if (t < 0 || t > within) continue;
      if (opts && opts.safe && !safeFrom(m, dx, t, opts.pg)) continue;
      if (opts && opts.minDmg && m.dmg < opts.minDmg) continue;
      const score = m.dmg - t * 0.4 - (opts && opts.fresh ? recent(f, tk) : 0);
      if (!best || score > best.s) best = { tk, t, s: score, m };
    }
    return best;
  }
  // safe at this distance: the hero is free again before the opponent could run over and hit it (a guard that answers
  // up close is in the table too). pg: against an opponent that perfect-guards, count the stun a perfect guard leaves
  // (60 frames for the hero's own blow, 30 for a shot: js/versus.js)
  function safeFrom(m, dx, t, pg) {
    if (m.ub) return true;
    if (dx < 50 && !pg) return !!m.safe;
    const stuck = Math.max(0, (m.rec > 0 ? m.rec : 60) - t, pg ? (m.body ? 60 : 30) : 0);
    return stuck <= (dx - 30) / MAX_SPEED + 8;
  }
  // a reversal: a move whose invincible stretch covers the frame the incoming hit lands (most only turn invincible a few
  // frames in, so it is pressed on the frame that lines up), and that hits the attacker from here
  function reversal(f, dx, tHit) {
    const md = MD[f.hero] || {}; let best = null;
    for (const tk of TK) {
      const m = md[tk]; if (!m || tk === 'X' || !m.iv || m.iv[0] > tHit - 1 || m.iv[1] < tHit + 2 || !ready(f, tk)) continue;
      const t = hitT(m, dx); if (t < 0 || t > m.inv + 6) continue;
      if (!best || m.dmg > best.m.dmg) best = { tk, m, t };
    }
    return best;
  }
  const recent = (f, tk) => { const u = f.hc && f.hc.used && f.hc.used[tk]; return u === undefined ? 0 : Math.max(0, 40 - (V.t - u) / 6); };

  function antiAir(f, o, k, c) {
    const { p, q, th, adx, to, facing, say, h } = c;
    if (!KS.aa || q.onGround || q.state === 'hurt' || q.state === 'slip' || q.dead || !p.onGround || !HC.FREE[p.state]) return false;
    const up = p.y - q.y, toward = Math.sign(q.vx || 0) === Math.sign(p.x - q.x) || adx < 70;
    if (up < 20 || adx > 160 || !toward) return false;
    const md = MD[f.hero] || {}; let best = null;
    for (const tk of TK) {
      const m = md[tk]; if (!m || !m.a || tk === 'X' || !ready(f, tk)) continue;
      AIR.forEach(([ax, ay], i) => {
        const t = m.a[i]; if (t < 0 || t > 22 || t + 1 >= th.t) return;
        const at = fly(q, t, p.y), rx = (at.x - p.x) * (q.x > p.x ? 1 : -1), ru = p.y - at.y;   // ahead of the hero once it faces the opponent
        if (ru < 18 || Math.abs(rx - ax) > 22 || Math.abs(ru - ay) > 24) return;
        const s = m.dmg - t * 0.5;
        if (!best || s > best.s) best = { tk, s, t };
      });
    }
    if (!best) return false;
    if (!facing) { k[to] = true; return true; }
    return press(f, k, best.tk, h, 'ANTI-AIR', say, 8);
  }

  // the opponent is braced (Oathkeeper): anything that strikes it is answered with the whole blade, up close
  function braced(q) { return q.riposteT > 0; }
  function phased(q) { return q.phaseT > 0; }

  HC.ext = function (stage, f, o, k, c) {
    if (!KS.on) return false;
    const p = f.p, q = o.p, h = f.hc;
    c.h = h;
    const boss = c.mirror && HC.MIR.boss[f.hero];
    switch (stage) {
      case 'react': {
        // between worlds ourselves: nothing can touch us. Walk in, let it swing through us, and strike as its move ends
        // (the hit that brings us back is an ambush); throw a guard
        if (KS.counters && phased(p) && !c.open && HC.FREE[p.state] && p.onGround && !phased(q)) {
          if (!c.facing) { k[c.to] = true; return true; }
          // the first swing ends the phase: strike only once nothing of theirs can land before it does (their move is
          // past its active frames, no shot on the way)
          // (an ambush on an opponent that only stands there missed every time in tests: it guards or answers first)
          const late = HC.recovery(q) > c.first && c.th.t > c.first + 2;
          if (c.adx <= c.reach + 4 && q.onGround) {
            if (late) { const r = HC.bestRoute(f); HC.start(f, r); h.mr = 30; HC.runRoute(f, k); c.say('STRIKE THROUGH ITS MOVE  ' + HC.notation(r)); return true; }
            if (q.state === 'guard' && c.adx < c.prm.throwR + 4) { HC.start(f, 'T'); HC.runRoute(f, k); c.say('THROW FROM BETWEEN WORLDS'); return true; }
            if (q.state === 'guard') { k[c.to] = true; c.say('BETWEEN WORLDS - IN FOR THE THROW'); return true; }
            c.say('BETWEEN WORLDS - WAIT FOR IT TO MOVE'); return true;
          }
          k[c.to] = true; if (c.adx > 90 && h.t % 2) k.dash = true; c.say('BETWEEN WORLDS - WALK IN'); return true;
        }
        // REVERSAL (Nightmare against Nightmare only: against anyone else a perfect guard pays more): a swing about to land
        // is answered, now and then, by a move that is invincible through it
        const th = c.th;
        if (KS.counters && c.mirror && !boss && c.canGuard && th.src === 'body' && !th.grab && !th.ub && th.t >= 1 && th.t <= 12 && !c.open) {
          if (!h.rv || V.t > h.rv.until) h.rv = { until: V.t + th.t + 8, go: Math.random() < KS.revP };
          const b = h.rv.go && reversal(f, c.adx, th.t);
          if (b) { if (!c.facing) { k[c.to] = true; return true; } h.rv.go = false; return press(f, k, b.tk, h, 'REVERSAL', c.say, 6); }
        }
        return antiAir(f, o, k, c);
      }
      case 'read': {
        if (!KS.counters || c.open) return false;
        // an opponent between worlds cannot be hit: keep the guard for its way back and stay just out of its reach
        if (phased(q)) {
          if (c.adx < 70 && HC.FREE[p.state]) { const wall = c.away === 'left' ? p.x < 40 : p.x > V.zone.pw - 40; if (!wall) { k[c.away] = true; c.say('IT IS BETWEEN WORLDS - KEEP AWAY'); return true; } }
          if (!c.facing) k[c.to] = true;
          c.say('IT IS BETWEEN WORLDS - WAIT FOR IT'); return true;
        }
        // a brace answers what hits it with a swing 70 px wide: pop it with a shot from outside that, or wait it out
        if (braced(q) && HC.FREE[p.state]) {
          if (c.adx > 84) {
            // (Corvin's Crow's Due answers a shot too, from any distance: his stance is only ever waited out)
            const b = KS.ranged && !q.crowDue && pickGround(f, c.adx, 30, {});
            if (b) { if (!c.facing) { k[c.to] = true; return true; } return press(f, k, b.tk, h, 'BAIT THE COUNTER', c.say, 6); }
            if (!c.facing) k[c.to] = true; c.say('IT IS BRACED - WAIT'); return true;
          }
          const wall = c.away === 'left' ? p.x < 40 : p.x > V.zone.pw - 40;
          if (!wall) { k[c.away] = true; if (h.t % 2) k.dash = true; c.say('IT IS BRACED - STEP OUT'); return true; }
          if (c.canGuard) { k.down = true; c.say('IT IS BRACED - GUARD'); return true; }
        }
        // charging its bar at a distance: a free hit for anything that gets there
        if (KS.ranged && q.state === 'charge' && c.adx > c.reach + 10 && HC.FREE[p.state] && p.onGround && c.th.t > 20 && !boss) {
          const b = pickGround(f, c.adx, 34, { minDmg: 8 });
          if (b) { if (!c.facing) { k[c.to] = true; return true; } return press(f, k, b.tk, h, 'HIT THE CHARGE', c.say, 6); }
        }
        return false;
      }
      case 'far': {   // open (stunned, reeling) but too far to run in before it recovers
        if (!KS.ranged || !HC.FREE[p.state] || !p.onGround) return false;
        const b = pickGround(f, c.adx, c.openT - 2, { ult: f.state.energy >= 300 });
        if (!b) return false;
        if (!c.facing) { k[c.to] = true; return true; }
        return press(f, k, b.tk, h, 'PUNISH FROM RANGE', c.say, 6);
      }
      case 'whiff': {   // stuck in the end of a move that missed, too far to run in
        if (!KS.ranged || !p.onGround || c.th.t <= 6) return false;
        const b = pickGround(f, c.adx, c.rec - 1, {});
        if (!b) return false;
        if (!c.facing) { k[c.to] = true; return true; }
        return press(f, k, b.tk, h, 'WHIFF PUNISH', c.say, 6);
      }
      case 'neutral': {
        if (!KS.skills || !p.onGround || boss) return false;
        const S = f.state, now = V.t;
        // the timed power mode, out of the opponent's reach, with a bar to spare for the combos it powers
        if (ready(f, 'M') && c.adx > 130 && c.th.t > 30 && (S.energy >= 200 || p.awakeT > 0) && !(q.state === 'ult')) {
          HC.start(f, 'M'); h.mr = 4; HC.runRoute(f, k); c.say('POWER UP - ' + nameOf(f.hero, 'M')); return true;
        }
        // zoning: from where a skill reaches and is safe, now and then (and never with the bar needed for the combos)
        if ((h.zn || 0) > now) return false;
        const spare = c.mirror ? 0 : 100;
        if (c.adx > KS.zoneGap && c.adx < 310 && c.th.t > 14 && !c.ultUp) {
          const list = TK.filter(t => t !== 'X' && f.state.energy >= costOf(f.hero, t) + spare);
          const b = pickGround(f, c.adx, 40, { safe: true, pg: c.mirror, list, fresh: true, minDmg: 6 });
          if (b && Math.random() < (c.mirror ? 0.5 : 0.25)) {
            h.zn = now + (c.mirror ? 40 : 70) + (Math.random() * 40 | 0);
            if (!c.facing) { k[c.to] = true; return true; }
            return press(f, k, b.tk, h, 'ZONE', c.say, 6);
          }
          h.zn = now + 12;
        }
        return false;
      }
      case 'poke': {   // the mirror show picked "poke": every skill at its own range, not a blind cycle
        if (!KS.mirrorPoke) return false;
        const b = pickGround(f, c.adx, 44, { fresh: true });
        if (!b) return false;
        if (!c.facing) { k[c.to] = true; return true; }
        return press(f, k, b.tk, h, 'POKE', c.say, 12);
      }
    }
    return false;
  };
  HC.moveName = nameOf;
})();
