'use strict';
// The Hollow Crown: story-duel and boss bench (js/saga/saga-assist.js). Not loaded by the game: inject it in the page
//   (const s = document.createElement('script'); s.src = 'tools/saga-bench.js?' + Date.now(); document.head.appendChild(s))
// It starts real story games (SW.saga.newSaga), so BACK UP localStorage first and restore it afterwards: finished
// stories award real achievements. G.manual is set; ticks run in 40 ms slices (a MessageChannel), so it keeps going
// while you poll SB.st / SB.agg(tag).
//   SB.start(SB.duels(tag, diff, fights, lv))   lv: the Versus bot level that plays the hero (1 = Normal)
//   SB.start(SB.bosses(tag, diff, tries))        the Convergence and Vael with the autopilot (js/saga/saga-assist.js)
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, SG = SW.saga, D = SW.data, I = SW.input, ui = SW.ui, A = SW.sagaAssist;
  function prep(hero, n, lvl) {
    ui.dlg.active = false; G.overlay = null; G.scene = 'title'; SG.menu.open = false;
    SG.newSaga(hero);
    if (!G.state || !G.state.saga || G.state.hero !== hero) return false;
    const S = G.state, sg = S.saga, h = D.heroes[hero];
    S.level = lvl; sg.ch = n; sg.phase = 'play';
    if (h.mode) S.abilities[h.mode] = true; if (h.awaken) S.abilities[h.awaken] = true; if (n > 3 && h.ultimate) S.abilities[h.ultimate] = true;
    S.hp = G.player.hpMax(); S.energy = 200;
    G.overlay = null; ui.dlg.active = false;
    return true;
  }
  function* duel(job) {
    if (!prep(job.hero, job.n, job.lvl)) { job.err = 'prep'; return; }
    for (let k = 0; k < 5; k++) G.tick();
    G.overlay = null; ui.dlg.active = false;
    SG.fight(job.rival, Object.assign({ title: 'BENCH', onEnd() {} }, job.x));
    if (G.scene !== 'vs') { job.err = 'noduel'; return; }
    job.res = [];
    for (let i = 0; i < job.fights; i++) {
      let fr = 0, h0 = null;
      while (V.phase !== 'duelEnd' && V.phase !== 'duelLost') {
        if (job.lv >= 0) { V.f[0].bot = true; V.f[0].lv = job.lv; }
        G.tick(); fr++;
        if (!h0 && V.phase === 'fight') h0 = [V.f[0].state.hp, V.f[1].state.hp];
        if (fr > 60 * 240) break;
        if (fr % 200 === 0) yield;
      }
      const win = V.phase === 'duelEnd';
      job.meHp = h0 && h0[0]; job.rivalHp = h0 && h0[1];
      job.res.push({ win, me: Math.max(0, V.f[0].state.hp) / (h0 ? h0[0] : 1), riv: Math.max(0, V.f[1].state.hp) / (h0 ? h0[1] : 1), s: Math.round(fr / 60) });
      // job.mercy: lost tries count (js/saga/saga-assist.js wears the rival down); a win starts the count again
      const di = A && A.duelInfo && A.duelInfo();
      if (di && (win || !job.mercy)) { di.lostSeen = V.f[1].p; A.losses[di.key] = 0; }
      if (i < job.fights - 1) { V.phase = 'duelLost'; V.t = 31; I.down.confirm = true; G.tick(); I.down.confirm = false; G.tick(); }
      yield;
    }
    V.phase = 'duelLost'; V.t = 31; I.down.pause = true; G.tick(); I.down.pause = false; G.tick();
    if (G.scene === 'vs') job.err = 'stuck';
    ui.dlg.active = false;
  }
  // a campaign boss with the autopilot: the hero at full health next to it; one try = until the boss or the hero falls
  function* boss(job) {
    job.res = [];
    for (let i = 0; i < job.tries; i++) {
      if (!prep(job.hero, job.n, job.lvl)) { job.err = 'prep'; return; }
      for (let k = 0; k < 5; k++) G.tick();
      G.overlay = null; ui.dlg.active = false;
      const S = G.state, sg = S.saga;   // the chapter's own arena, nothing else going on in it
      ['fight', 'talk', 'duel'].forEach(s => { S.steps['SG' + job.n + ':' + s] = true; });
      S.steps['SG' + job.n + ':boss'] = true; sg.seen['i' + job.n] = true;
      if (job.zone && SG.goto) { SG.goto(job.zone); let k = 0; while ((G.zone.id !== job.zone || G.fade.a > 0) && k++ < 400) { G.tick(); G.overlay = null; ui.dlg.active = false; } }
      G.fade.a = 0; G.fade.dir = 0;
      S.hp = G.player.hpMax();
      SW.profile.sgAuto = true;
      const z = G.zone, b = SG.spawnBoss(z, job.type, job.scale(job.lvl, job.type), {});
      G.boss = b; b.state = 'chase';
      const hp0 = G.state.hp, bhp0 = b.hp;
      let fr = 0, deadAt = null;
      while (!b.dead && !(G.player && G.player.dead)) {
        G.tick(); fr++;
        if (G.overlay) G.overlay = null; if (ui.dlg.active) ui.dlg.active = false;
        if (fr > 60 * 300) break;
        if (fr % 200 === 0) yield;
      }
      const win = b.dead;
      job.res.push({ win, me: Math.max(0, G.state.hp) / hp0, boss: Math.max(0, b.hp) / bhp0, s: Math.round(fr / 60), bhp: bhp0, hp: hp0 });
      SW.profile.sgAuto = false;
      if (G.state.saga.bossHp) G.state.saga.bossHp = {};
      yield;
    }
  }
  const st = { q: [], done: [], cur: null, gen: null, running: false };
  const ch = new MessageChannel();
  ch.port1.onmessage = () => {
    const t = performance.now();
    try {
      while (performance.now() - t < 40) {
        if (!st.gen) {
          st.cur = st.q.shift(); if (!st.cur) { st.running = false; return; }
          if (st.cur.diff) SW.difficulty.set(st.cur.diff); if (st.cur.pre) st.cur.pre();
          st.gen = st.cur.type ? boss(st.cur) : duel(st.cur);
        }
        const r = st.gen.next(); if (r.done) { st.done.push(st.cur); st.gen = null; }
      }
    } catch (e) { st.error = String(e.stack || e); st.running = false; return; }
    ch.port2.postMessage(0);
  };
  function start(jobs) { st.q.push(...jobs); if (!st.running) { st.running = true; G.manual = true; if (A) A.mercy = false; ch.port2.postMessage(0); } }
  const pct = (w, n) => w + '/' + n + ' = ' + Math.round(100 * w / Math.max(1, n)) + '%';
  function summary(tag) {
    return st.done.filter(j => !tag || j.tag === tag).map(j => {
      const R = j.res || [], w = R.filter(r => r.win).length, n = R.length, avg = f => n ? +(R.reduce((a, r) => a + f(r), 0) / n).toFixed(2) : null;
      if (j.type) return [j.tag, j.hero + ' vs ' + j.type, w + '/' + n, 'boss hp ' + (R[0] && R[0].bhp), 'me ' + avg(r => r.me), 'boss ' + avg(r => r.boss), avg(r => r.s) + 's', j.err || ''].join(' | ');
      return [j.tag, j.hero + '>' + j.rival + ' ' + j.kind, w + '/' + n, j.meHp + '/' + j.rivalHp, 'me ' + avg(r => r.me), 'riv ' + avg(r => r.riv), avg(r => r.s) + 's', j.err || ''].join(' | ');
    });
  }
  // with job.mercy: how many tries each win took (a run of losses then a win), and how often 1 or 2 tries were enough
  function tries(tag) {
    const runs = [];
    st.done.filter(j => j.tag === tag).forEach(j => { let n = 0; (j.res || []).forEach(r => { n++; if (r.win) { runs.push(n); n = 0; } }); if (n) runs.push(99); });
    const k = runs.length || 1;
    return { wins: runs.filter(n => n < 99).length, unfinished: runs.filter(n => n >= 99).length, avg: +(runs.filter(n => n < 99).reduce((a, b) => a + b, 0) / Math.max(1, runs.filter(n => n < 99).length)).toFixed(2), in1: Math.round(100 * runs.filter(n => n === 1).length / k) + '%', in2: Math.round(100 * runs.filter(n => n <= 2).length / k) + '%', in3: Math.round(100 * runs.filter(n => n <= 3).length / k) + '%' };
  }
  function agg(tag) {
    const by = {};
    st.done.filter(j => j.tag === tag).forEach(j => { const k = j.kind || j.type; by[k] = by[k] || [0, 0]; (j.res || []).forEach(r => { by[k][1]++; if (r.win) by[k][0]++; }); });
    const tot = Object.values(by).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]); by.all = tot;
    Object.keys(by).forEach(k => { by[k] = pct(by[k][0], by[k][1]); });
    return by;
  }
  // Book I heroes (open from the start): their chapter 3 rival, a Called / champion foe for the Rescue, and Itsuki
  const R3 = { isolde: 'brann', tarn: 'ivo', sen: 'pell', kiri: 'rue', maren: 'vesna', ferra: 'vex', rook: 'pell', hollis: 'oda', dune: 'tarek' };
  const RH = { isolde: 'corvin', tarn: 'mira', sen: 'noct', kiri: 'corvin', maren: 'vega', ferra: 'hex', rook: 'rue', hollis: 'ryo', dune: 'opal' };
  function duels(tag, diff, fights, lv, extra) {
    const o = [];
    Object.keys(R3).forEach(h => {
      o.push(Object.assign({ tag, diff, hero: h, rival: R3[h], n: 3, lvl: 5, kind: 'rival', x: { kind: 'rival' }, fights, lv }, extra));
      o.push(Object.assign({ tag, diff, hero: h, rival: RH[h], n: 6, lvl: 10, kind: 'hard', x: { kind: 'called', hard: true, called: true }, fights, lv }, extra));
      o.push(Object.assign({ tag, diff, hero: h, rival: 'itsuki', n: 7, lvl: 12, kind: 'itsuki', x: { kind: 'itsuki', hard: true, itsuki: true, stage: 'sw_crown' }, fights, lv }, extra));
    });
    return o;
  }
  // the scale saga-core.js gives its bosses (bossScale): read from it if exported, else the same formula
  const scale = (lv, type) => (SG.bossScale ? SG.bossScale(type) : Math.min(1, (lv + 4) / 20) * (type === 'convergence' ? 0.8 : 1));
  function bosses(tag, diff, tries, heroes, extra) {
    const o = [];
    (heroes || ['isolde', 'tarn', 'sen', 'kiri', 'maren', 'ferra', 'rook', 'hollis', 'dune']).forEach(h => {
      o.push(Object.assign({ tag, diff, hero: h, type: 'convergence', n: 5, lvl: 10, zone: 'enginecore', tries, scale }, extra));
      o.push(Object.assign({ tag, diff, hero: h, type: 'vael', n: 7, lvl: 12, zone: 'crater', tries, scale }, extra));
    });
    return o;
  }
  window.SB = { st, start, summary, agg, tries, duels, bosses, prep };
})();
