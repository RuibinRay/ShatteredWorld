'use strict';
// Shattered Worlds — a hero's journey to watch: one hero plays the whole story in real time (their Act 1 tutorial, then
// every Act 2 and Act 3 mission in autoplay.js's AP.STORY, in order), and between missions makes camp: mission reward,
// level ups, stat points spent in the Stats tab, upgrades bought in the Upgrades tab and items bought from Madame Quill,
// all through the real menus so it can be watched. Level, stats, upgrades, creds and items carry from mission to mission.
// Not loaded by the game. It never writes the save slot (story-test.js stubs saving).
//   for (const f of ['tools/harness.js', 'tools/story-test.js', 'tools/autoplay.js', 'tools/journey.js']) await new Promise(r => { const s = document.createElement('script'); s.src = f; s.onload = r; document.head.appendChild(s); });
//   JR.start('kael')     JR.stop() ends it after the current frame; JR.log is what happened so far
// The pane has to stay visible: browsers slow hidden tabs to a crawl.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, AP = window.AP, T = window.T, ui = SW.ui;
  if (!AP || !T) { console.warn('journey: load tools/harness.js, tools/story-test.js and tools/autoplay.js first'); return; }
  const JR = window.JR = { log: [], label: '', running: false };
  const note = s => { JR.log.push(new Date().toLocaleTimeString() + '  ' + s); };
  // the level each Act 2 / Act 3 mission is played at (AP.STORY's setups), in AP.STORY's order
  const LEVELS = [9, 10, 11, 12, 14, 17, 19, 21, 23];

  // a line over the top of the page saying where we are (a page element: the game's own loop redraws the canvas too)
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;left:0;right:0;top:0;padding:6px 10px;font:bold 15px monospace;color:#f5c542;background:rgba(5,6,12,0.85);text-align:center;z-index:9;pointer-events:none;display:none';
  document.body.appendChild(bar);
  setInterval(() => { const S = G.state; bar.style.display = JR.running ? 'block' : 'none'; if (JR.running) bar.textContent = JR.label + (S ? '   |   Lv ' + S.level + '   |   ' + S.creds + ' creds   |   ' + (G.hero().item) + ' x' + S.items : ''); }, 250);

  // n game frames at 60 a second, drawn; keysAt(i) gives the keys held on frame i
  const frames = (n, keysAt) => new Promise(done => {
    let i = 0, last = performance.now(), acc = 0;
    const loop = () => {
      if (!JR.running) return done();
      const t = performance.now(); acc += Math.min(100, t - last); last = t;
      let k = 0;
      while (acc >= 1000 / 60 && k < 6 && i < n) { acc -= 1000 / 60; k++; T.hold(keysAt ? keysAt(i) || [] : []); G.tick(); i++; }
      if (k) G.render();
      if (i >= n) { T.hold([]); return done(); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  const tap = async (key, after) => { await frames(3, i => (i < 2 ? [key] : [])); await frames(after || 16); };

  // what carries over from one mission to the next (AP.play starts every mission with a new game)
  const snap = () => { const S = G.state; return S && { level: S.level, xp: S.xp, points: S.points, stats: Object.assign({}, S.stats), upg: Object.assign({}, S.upg || {}), creds: S.creds, items: S.items }; };
  const restore = k => { if (!k) return; const S = G.state; Object.assign(S, { level: Math.max(S.level, k.level), xp: k.xp, points: k.points, stats: Object.assign({}, k.stats), upg: Object.assign({}, k.upg), creds: k.creds, items: k.items }); if (G.player) S.hp = G.player.hpMax(); };

  // ---- camp: reward, level ups, stat points, upgrades, items ----
  async function camp(target, title) {
    const S = G.state; if (!S || !G.player || G.scene !== 'play') return;
    JR.label = 'CAMP  -  ' + title;
    await frames(40);
    const m = D.missions[S.mission];
    if (m && m.creds && !JR.paid[m.id]) { JR.paid[m.id] = true; S.creds += m.creds; SW.audio.sfx('coin'); G.toast('Mission reward: +' + m.creds + ' creds', '#f5c542'); note('reward ' + m.creds + ' creds for ' + m.id); await frames(70); }
    while (S.level < target) { G.addXP(Math.max(1, G.xpNeed() - S.xp)); note('level ' + S.level); await frames(50); }
    // stat points: Power and Energy in turn, in the Stats tab
    G.overlay = 'pause'; ui.pm.tab = 3; ui.pm.sel = 0; await frames(40);
    let row = 0;
    while (S.points > 0 && JR.running) { const want = S.stats.power <= S.stats.energy + 1 ? 0 : 1; while (ui.pm.sel !== want) await tap(ui.pm.sel < want ? 'down' : 'up', 8); await tap('confirm', 14); row++; }
    if (row) note('spent ' + row + ' stat points: power ' + S.stats.power + ', energy ' + S.stats.energy);
    // upgrades: the cheapest useful one first, while the creds last (keep 60 for items)
    await tap('right', 20); await tap('right', 30);
    const order = ['attack', 'vital', 'special', 'skill', 'flow', 'guard', 'awaken'];
    for (let pass = 0; pass < 6 && JR.running; pass++) {
      const pick = order.map(id => D.upgrades.findIndex(u => u.id === id)).filter(i => i >= 0).sort((a, b) => G.upg(D.upgrades[a].id) - G.upg(D.upgrades[b].id))[0];
      const lv = G.upg(D.upgrades[pick].id), cost = D.upgradeCost[lv];
      if (lv >= 5 || S.creds - cost < 60) break;
      while (ui.pm.sel !== pick) await tap(ui.pm.sel < pick ? 'down' : 'up', 8);
      await tap('confirm', 30); note('bought ' + D.upgrades[pick].name + ' ' + G.upg(D.upgrades[pick].id));
    }
    await frames(40); await tap('pause', 20);
    // items from Madame Quill
    G.overlay = 'shop'; ui.shop.sel = 0; await frames(40);
    let bought = 0;
    while (S.creds >= 30 && S.items < 5 && JR.running) { await tap('confirm', 22); bought++; }
    if (bought) note('bought ' + bought + ' ' + G.hero().item);
    await frames(30); ui.shop.sel = 1; await tap('confirm', 20); G.overlay = null;
    await frames(30);
  }

  JR.stop = () => { JR.running = false; AP.stop = true; };
  JR.start = async function (hero, o) {
    o = o || {};
    if (JR.running) return 'already running';
    JR.running = true; JR.log = []; JR.paid = {}; JR.hero = hero;
    SW.profile.all = true; if (SW.i18n) SW.i18n.lang = SW.i18n.lang || 'en';
    const name = D.heroes[hero].name.toUpperCase();
    try {
      if (!o.from) {
        JR.label = name + "'S JOURNEY  -  ACT 1"; note('Act 1: tutorial');
        const r = await AP.play(hero, { record: false, minutes: 9, name: 'journey-act1' });
        note('Act 1: ' + r.result + ', deaths ' + r.deaths.length);
      }
      let keep = snap();
      const segs = AP.STORY.slice(o.from || 0);
      for (let i = 0; i < segs.length && JR.running; i++) {
        const seg = segs[i], idx = AP.STORY.indexOf(seg);
        await camp(LEVELS[idx] || 1, seg.title);
        keep = snap() || keep;
        if (!JR.running) break;
        JR.label = name + "'S JOURNEY  -  " + seg.title; note(seg.title + ': start at level ' + keep.level);
        const r = await AP.play(hero, Object.assign({}, seg, { hero, record: false, minutes: 9, setup: (g, t) => { seg.setup(g, t); restore(keep); } }));
        note(seg.title + ': ' + r.result + ', deaths ' + r.deaths.length + ', level ' + G.state.level);
        keep = snap() || keep;
      }
      if (JR.running) { JR.label = name + "'S JOURNEY  -  THE END"; note('journey over'); await frames(600); }
    } catch (e) { note('error: ' + (e && e.message || e)); console.error(e); }
    JR.running = false; T.hold([]);
    return JR.log;
  };
})();
