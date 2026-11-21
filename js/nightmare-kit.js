'use strict';
// Shattered Worlds — NIGHTMARE knows its whole kit (the user, 2026-11-20: "make sure each nightmare hero knows their
// skills well ... in a round uses all 5 skills 90% at least once per round ... create combo, make sure combo is long ...
// dont make combos like JJJJJ, you have to mix the skills ... if its long range then at what distance").
// Measured before this: a Nightmare bot used all five skills (U, S+U, I, S+I, W+O) in 7% of its rounds (3.15 a round);
// 12% of its combos mixed two skills and 27% were J only. It saved its bar for the ultimate (from 240 energy it refused
// every skill) and always ran its single strongest route. Now, while some of the five are still unused this round:
//   combos   a route is picked for the skills it brings in, not only its damage: each unused skill in it is worth
//            KIT.W damage, each different skill KIT.MIX; the routes are mixed ones (tools/nk-train.js: a skill in the
//            first 3 inputs, never more than 3 J in a row, many skill sets per hero)
//   bar      the bar is not saved for the ultimate (it goes back to saving once all five are used)
//   neutral  an unused skill is thrown when it reaches the opponent from where the bot stands (the move lab's
//            frames-to-hit at each distance, js/hardcore-moves.js); a shot from its range, a melee skill only into an
//            opponent who cannot answer (busy, recovering, in the air) unless it is safe on block. If none reaches, the bot
//            walks to the distance where its next unused skill lands best; short of energy, it charges (J + K) from afar
//   the kill once the opponent is at 47% of full health or less (an ultimate's share), one ultimate ends the round (js/ult-share.js): the bar is
//            kept for it, a combo on an opponent who cannot answer becomes the ultimate, and in neutral it is thrown when the
//            move lab says it reaches from here into someone not guarding (else: charge for it, or walk into its reach)
// Only Nightmare bots (level 3); Itsuki uses his skills in neutral too but keeps his own hand-made routes. SW.nightmareKit.on = false turns
// it off. Loaded after js/hardcore-skill.js.
(function () {
  const SW = window.SW, V = SW.versus, HC = SW.hardcore, D = SW.data;
  if (!V || !HC || !HC.start || !HC.runRoute || !HC.hitT) return;
  const MD = SW.hardcoreMoves || {}, SIG = (SW.signature && SW.signature.SIG) || {}, BURST = (SW.moves && SW.moves.BURST) || {};
  const KIT = SW.nightmareKit = { on: true, W: 150, MIX: 14, gap: 40, late: false, patience: 180, staleT: 60, log: false };   // (late: unsafe unused skills once the round is half over; measured worse, 76% vs 82%)
  const TOKS = ['U', 'u', 'I', 'i', 'O'], SLOT = { U: 'u', u: 'su', I: 'i', i: 'si', O: 'wo' };
  const KEYS = { U: ['skill'], u: ['skill', 'down'], I: ['special'], i: ['special', 'down'], O: ['awaken', 'up'] };
  const FREE = HC.FREE || { idle: 1, run: 1, jump: 1, fall: 1, guard: 1, charge: 1 };
  const costOf = (hero, t) => { const A = D.abilities, k = D.heroes[hero] && D.heroes[hero].kit; if (t === 'O') return (SW.signature && SW.signature.COST) || 75; if (t === 'i') return 100; const id = t === 'U' ? k && k[0] : t === 'u' ? k && k[1] : k && k[2], a = id && A[id]; return a && a.cost !== undefined ? a.cost : ({ U: 25, u: 50, I: 50 })[t]; };
  const has = (hero, t) => (t === 'O' ? !!SIG[hero] : t === 'i' ? !!BURST[hero] : true);

  // ---------- which of the five it has used this round ----------
  function track(f) {
    const n = f.nk || (f.nk = { used: {}, prev: {}, live: false });
    if (V.phase !== 'fight') { n.live = false; return n; }
    if (!n.live) { n.live = true; n.used = {}; n.wait = {}; n.prev = Object.assign({}, f.p.cd || {}); }
    const cd = f.p.cd || {};
    TOKS.forEach(t => { const s = SLOT[t], v = cd[s] || 0; if (v > (n.prev[s] || 0) + 2) n.used[t] = 1; n.prev[s] = v; });
    // how long each unused skill has been ready (off cooldown and paid for) without going out
    n.wait = n.wait || {}; TOKS.forEach(t => { n.wait[t] = !n.used[t] && !(cd[SLOT[t]] > 0) && f.state.energy >= costOf(f.hero, t) ? (n.wait[t] || 0) + 1 : 0; });
    return n;
  }
  const unused = f => { const n = f.nk; return n ? TOKS.filter(t => !n.used[t] && has(f.hero, t)) : []; };
  KIT.unused = unused;
  const mine = f => KIT.on && HC.is(f) && !HC.test;
  const boss = f => !!(HC.MIR && HC.MIR.boss && HC.MIR.boss[f.hero]);   // (Itsuki: his own hand-made routes stay)
  // ---------- the kill: an ultimate is 47% of full health (js/ult-share.js), so at 47% or less one ultimate ends it ----------
  // (the user, 2026-11-20: "make nightmares know when opponent hp 55% or lower use ult"; the share is now 47%)
  const foe = f => V.f && V.f.find(x => x && x !== f);
  function hpMax(f) { const G = SW.game, keep = G.state; G.state = f.state; try { return f.p.hpMax(); } finally { G.state = keep; } }
  const lethal = o => !!(o && o.state && o.p && o.state.hp > 0 && o.state.hp <= hpMax(o) * (SW.ultShare && SW.ultShare.on ? SW.ultShare.SHARE : 0.5) + 0.5);
  KIT.lethal = lethal; KIT.kill = true;
  const killing = f => KIT.kill && mine(f) && lethal(foe(f));
  const _vu = V.update;
  // slips (S + L out of a combo) cost the bar the unused skills need: none while some are unused and health is above 45%
  function slips(f) {
    const h = f.hc; if (!h || !h.prm || boss(f)) return;
    if (h.slip0 === undefined) h.slip0 = h.prm.slip;
    h.prm.slip = mine(f) && f.nk && f.nk.live && unused(f).length && f.state.hp > hpMax(f) * 0.45 ? 0 : h.slip0;
  }
  V.update = function () { const out = _vu.apply(this, arguments); if (V.f) V.f.forEach(f => { if (f && f.p && HC.is(f)) { track(f); slips(f); } }); return out; };

  // ---------- the bar: not saved for the ultimate while skills are still unused ----------
  const _sav = HC.saving;
  // (with the opponent in killing range the bar IS kept: every point goes to the ultimate that ends the round)
  // (charging fills 100 in about 90 frames, so the unused skills still go out first while the bar is under 200)
  if (_sav) HC.saving = function (f) { if (killing(f)) { if (unused(f).length && f.state.energy < 200) return false; return !HC.ultReady(f); } if (mine(f) && unused(f).length) return false; return _sav.apply(this, arguments); };

  // ---------- spending: a skill already used this round goes out only if the bar still pays for the next unused one ----------
  // (js/hardcore-skill.js asks this before each move it throws: before this, Gale threw Wind Blade over and over and never
  // had the 100 for S+I)
  HC.spendOk = function (f, tk) {
    if (!mine(f) || boss(f) || tk === 'X' || tk === 'M' || !SLOT[tk]) return true;
    const n = f.nk; if (!n || !n.live || !n.used[tk]) return true;
    const cd = f.p.cd || {}, un = unused(f).filter(t => !(cd[SLOT[t]] > 30)); if (!un.length) return true;
    const need = Math.max(...un.map(t => costOf(f.hero, t)));   // (the dearest: S+I's 100 is the one most often never paid for)
    return f.state.energy - costOf(f.hero, tk) >= need;
  };

  // ---------- combos: picked for the skills they bring in ----------
  function affordable(f, R) {
    const p = f.p, S = f.state, cd = p.cd || {};
    if (R.cost > S.energy + 4) return false;
    for (const c of R.r) { const s = SLOT[c]; if (s && cd[s] > 4) return false; if (c === 'X') return false; }
    return true;
  }
  function pick(f, r0) {
    const list = HC.data.routes[f.hero]; if (!list || !list.length) return r0;
    const un = unused(f); if (!un.length) return r0;
    let best = null, bs = -1;
    const cd = f.p.cd || {}, open = un.filter(t => !(cd[SLOT[t]] > 30)), need = open.length ? Math.max(...open.map(t => costOf(f.hero, t))) : 0;
    for (const R of list) {
      if (!affordable(f, R)) continue;
      const sk = new Set((R.r.match(/[UuIiO]/g) || [])), gain = un.filter(t => sk.has(t)).length;
      if (!gain && R.cost > 2 && f.state.energy - R.cost < need) continue;   // (keep the bar for an unused skill)
      // each unused skill in the route is worth KIT.W, more when it comes early (a combo that drops still got it out)
      let w = 0; un.forEach(t => { const i = R.r.indexOf(t); if (i >= 0) w += 1 - 0.5 * i / R.r.length; });
      const s = R.dmg + KIT.W * w + KIT.MIX * sk.size;
      if (s > bs) { bs = s; best = R; }
    }
    // no trained route with an unused skill fits the bar (they bundle several skills): a short one built for it, J J J > U
    // (free out of a landed J) > the unused skill (skills cancel into skills, js/combo-fluency.js)
    const gainOf = R => R && un.some(t => R.r.indexOf(t) >= 0);
    if (!gainOf(best)) {
      const t = un.filter(t => !(cd[SLOT[t]] > 0) && f.state.energy >= costOf(f.hero, t) + 2).sort((a, b) => costOf(f.hero, b) - costOf(f.hero, a))[0];
      if (t) return t === 'U' ? 'JJJU' : 'JJJU' + t;
    }
    if (best) return best.r;
    const free = list.filter(R => R.cost <= 2).sort((a, b) => b.dmg - a.dmg)[0];   // nothing fits: the free combo
    return free ? free.r : r0;
  }
  // a route's skill that is not ready is swapped for one that is (js/hardcore.js runRoute): the unused ones first
  HC.subOrder = f => { const base = ['U', 'u', 'I', 'i', 'O']; if (!mine(f) || !f.nk || !f.nk.live) return base; const un = unused(f); return un.concat(base.filter(t => un.indexOf(t) < 0)); };
  // the move-knowledge layer (js/hardcore-skill.js) picks its punishes and anti-airs by damage: a skill not used yet this
  // round counts KIT.FRESH damage more
  KIT.FRESH = 40;
  HC.unusedBonus = (f, tk) => (mine(f) && f.nk && f.nk.live && SLOT[tk] && !f.nk.used[tk] && has(f.hero, tk) ? KIT.FRESH : 0);
  const _start = HC.start;
  HC.start = function (f, r) {
    // a combo starting on an opponent who cannot answer (stunned, reeling, in the air) becomes the ultimate when it kills
    if (typeof r === 'string' && r.length >= 2 && !/[XFT]/.test(r) && killing(f) && HC.ultReady(f)) {
      const o = foe(f);
      if (o && (o.stunT > 4 || !FREE[o.p.state] || !o.p.onGround)) { r = 'X'; f.nk && (f.nk.kill = (f.nk.kill || 0) + 1); }
    }
    if (mine(f) && !boss(f) && typeof r === 'string' && r.length >= 3 && !/[XFT]/.test(r) && !(killing(f) && f.state.energy >= 200)) r = pick(f, r);
    return _start.call(this, f, r);
  };

  // ---------- neutral: each unused skill at its own distance ----------
  function fire(f, k, t, c, why) {
    const h = f.hc || (f.hc = {});
    HC.start(f, t); h.mr = 10; HC.runRoute(f, k);
    (h.used || (h.used = {}))[t] = V.t; f.nk.last = V.t;
    if (c && c.say) c.say(why + ' - ' + (HC.moveName ? HC.moveName(f.hero, t) : t));
    return true;
  }
  const GX = [16, 36, 62, 95, 135, 180, 235, 300];
  // the distance where the move lands soonest; of the distances that land about as soon, the one nearest to where the
  // fighter stands (a long shot is thrown from afar, not walked up to 16 px for)
  function bestRange(m, adx) {
    if (!m || !m.g) return -1;
    const ok = m.g.filter(v => v >= 0); if (!ok.length) return -1;
    const lo = Math.min(...ok); let bi = -1;
    m.g.forEach((v, i) => { if (v >= 0 && v <= lo + 4 && (bi < 0 || Math.abs(GX[i] - (adx || 0)) < Math.abs(GX[bi] - (adx || 0)))) bi = i; });
    return GX[bi];
  }
  // the kill from neutral: the ultimate when it reaches from here (the move lab's frames-to-hit) into someone who is not
  // guarding; short of the bar, charge it (from afar) or back off to charge; ready but out of reach, walk into its reach
  function kill(f, o, k, c) {
    const n = f.nk; if (!n || !n.live || !c) return false;
    const p = f.p, q = o.p, S = f.state, m = (MD[f.hero] || {}).X;
    if (!p.onGround || !FREE[p.state] || c.th.t <= 8) return false;
    if (HC.ultReady(f)) {
      const ht = m ? HC.hitT(m, c.adx) : (c.adx < 150 ? 12 : -1);
      const busy = !FREE[q.state] || !q.onGround || (HC.recovery && HC.recovery(q) > 6);
      if (ht >= 0 && ht <= 64 && (busy || (q.state !== 'guard' && (n.rawT === undefined || V.t - n.rawT > 120)))) {
        if (!c.facing) { k[c.to] = true; return true; }
        if (!busy) n.rawT = V.t;
        HC.start(f, 'X'); h(f).mr = 10; HC.runRoute(f, k); n.kill = (n.kill || 0) + 1;
        c.say && c.say('ULTIMATE - IT KILLS (' + Math.round(100 * o.state.hp / hpMax(o)) + '%)'); return true;
      }
      if (ht < 0) { const want = bestRange(m, c.adx); if (want > 0 && Math.abs(c.adx - want) > 10) { k[c.adx > want ? c.to : c.away] = true; c.say && c.say('INTO ULTIMATE RANGE'); return true; } }
      return false;
    }
    if (c.adx > 100 && c.th.t > 24) return charge(f, k, c, 300, 'CHARGE FOR THE KILL');
    const wall = c.away === 'left' ? p.x < 50 : p.x > V.zone.pw - 50;
    if (!wall && c.th.t > 16 && FREE[q.state] && Math.abs(q.vx || 0) < 3) { k[c.away] = true; if (c.adx < 70 && V.t % 2) k.dash = true; c.say && c.say('BACK OFF - CHARGE FOR THE KILL'); return true; }
    return false;
  }
  const h = f => f.hc || (f.hc = {});
  // once it starts charging for something, it charges until it can pay for it (unless the opponent comes close or attacks)
  function charge(f, k, c, to, why) {
    const n = f.nk; n.chgTo = Math.min(300, to); n.chgWhy = why;
    k.attack = true; k.jump = true; c.say && c.say(why); return true;
  }
  function charging(f, k, c) {
    const n = f.nk; if (!n.chgTo) return false;
    if (f.state.energy >= n.chgTo || !c || c.th.t <= 14 || c.adx < 70 || !f.p.onGround) { n.chgTo = 0; return false; }
    k.attack = true; k.jump = true; c.say && c.say(n.chgWhy + ' (' + Math.round(f.state.energy) + '/' + n.chgTo + ')'); return true;
  }
  function neutral(f, o, k, c) {
    const n = f.nk; if (!n || !n.live) return false;
    if (charging(f, k, c)) return true;
    const un = unused(f);
    if (killing(f) && (HC.ultReady(f) || !un.length || f.state.energy >= 200)) return kill(f, o, k, c);
    if (!un.length) return false;
    const p = f.p, q = o.p, S = f.state, cd = p.cd || {}, M = MD[f.hero] || {};
    if (n.last !== undefined && V.t - n.last < KIT.gap) return false;
    if (!p.onGround || !FREE[p.state] || !c || c.th.t <= 10) return false;
    const adx = c.adx, busy = !FREE[q.state] || !q.onGround || (HC.recovery && HC.recovery(q) > 6);
    const ready = un.filter(t => !(cd[SLOT[t]] > 0) && S.energy >= costOf(f.hero, t));
    // the round half over (either fighter under 60%): an unused skill goes out even unsafe when it lands soon and nothing is coming
    const late = f.state.hp < hpMax(f) * 0.6 || o.state.hp < hpMax(o) * 0.6;
    // what lands from here: a shot, or something safe, or anything into a busy opponent
    let pickT = null, pt = 99;
    for (const t of ready) {
      const m = M[t]; if (!m) continue;
      const ht = HC.hitT(m, adx); if (ht < 0) continue;
      const shot = !m.body && ht >= 0 && adx > 70;
      // (ready for KIT.patience frames and still unused: it goes out even unsafe, when it lands soon and nothing is coming)
      const stale = (n.wait[t] || 0) > KIT.patience && ht <= KIT.staleT && c.th.t > 20;
      if (!(m.safe || shot || busy || ht <= 8 || stale || (KIT.late && late && ht <= 30 && c.th.t > 20))) continue;
      if (ht > (m.body ? 45 : 75)) continue;   // (a shot or a drop from the sky may take longer: it still lands)
      if (ht < pt) { pt = ht; pickT = t; }
    }
    if (pickT) {
      if (!c.facing) { k[c.to] = true; return true; }
      return fire(f, k, pickT, c, 'KIT (' + un.length + ' left)');
    }
    // nothing lands from here: short of energy, charge from afar; else go to the next skill's distance
    if (!ready.length) {
      // an unused skill off cooldown that the bar cannot pay for: charge for it (all of them on cooldown: play on)
      if (!un.some(t => !(cd[SLOT[t]] > 0))) return false;
      if (adx > 100 && c.th.t > 24 && S.energy < 300) return charge(f, k, c, Math.max(...un.filter(t => !(cd[SLOT[t]] > 0)).map(t => costOf(f.hero, t))) + 5, 'CHARGE FOR ' + un.join(' '));
      // too close to charge: back off to where it can (not into a wall, and not while the opponent is coming in fast)
      const wall = c.away === 'left' ? p.x < 50 : p.x > V.zone.pw - 50;
      if (!wall && c.th.t > 16 && FREE[q.state] && Math.abs(q.vx || 0) < 3) { k[c.away] = true; if (adx < 70 && V.t % 2) k.dash = true; c.say && c.say('BACK OFF TO CHARGE'); return true; }
      return false;
    }
    // the dearest unused one cannot be paid for yet: from afar, charge for it first (the cheap ones come up in combos)
    const dear = un.filter(t => !(cd[SLOT[t]] > 0)).sort((a, b) => costOf(f.hero, b) - costOf(f.hero, a))[0];
    if (dear && S.energy < costOf(f.hero, dear) && adx > 130 && c.th.t > 30) return charge(f, k, c, costOf(f.hero, dear) + 5, 'CHARGE FOR ' + (HC.moveName ? HC.moveName(f.hero, dear) : dear));
    // (the dear ones first: the cheap ones come up in combos anyway)
    const t = ready.slice().sort((a, b) => costOf(f.hero, b) - costOf(f.hero, a))[0], want = bestRange(M[t], adx);
    if (want < 0) return fire(f, k, t, c, 'KIT (no range data)');
    if (Math.abs(adx - want) < 10) { if (!c.facing) { k[c.to] = true; return true; } return fire(f, k, t, c, 'KIT AT ITS RANGE'); }
    const wall = c.away === 'left' ? p.x < 40 : p.x > V.zone.pw - 40;
    if (adx > want) k[c.to] = true; else if (!wall) k[c.away] = true; else return fire(f, k, t, c, 'KIT (cornered)');
    c.say && c.say('TO ' + want + ' FOR ' + (HC.moveName ? HC.moveName(f.hero, t) : t));
    return true;
  }
  const _ext = HC.ext;
  HC.ext = function (stage, f, o, k, c) {
    if (mine(f) && (stage === 'neutral' || stage === 'far') && neutral(f, o, k, c)) return true;
    return _ext ? _ext.apply(this, arguments) : false;
  };
})();
