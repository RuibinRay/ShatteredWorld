// Shattered Worlds — test helper for the crazy Versus stages (js/crazy/*). Paste into the console of a running game, or
// load with: await import('/tools/crazy-test.js')   (needs a page served by tools/record-server.ps1 for cz.snap)
// Keeps this tab's saves in memory (shattered-worlds* keys), so a test never touches the real profile or saves.
//   cz.match(id, heroA, heroB, lvA, lvB)  one bot-vs-bot match to the end; returns ticks, wins, hazard hits / launches
//   cz.start(id, a, b, lvA, lvB), cz.run(n), cz.until(fn, n)   step a match by hand
//   await cz.snap(name)                   saves the canvas (2x) to recordings/crazy-<name>.png
//   cz.menu(id)                           the Versus menu with that stage chosen (its preview and twist)
(function () {
  if (window.cz) return;
  const mem = window.__mem = {}, P = Storage.prototype, gi = P.getItem, si = P.setItem, ri = P.removeItem;
  P.setItem = function (k, v) { if (String(k).startsWith('shattered-worlds')) { mem[k] = String(v); return; } return si.call(this, k, v); };
  P.getItem = function (k) { if (k in mem) return mem[k]; return gi.call(this, k); };
  P.removeItem = function (k) { if (String(k).startsWith('shattered-worlds')) { delete mem[k]; return; } return ri.call(this, k); };
  P.clear = function () { throw new Error('clear blocked by crazy-test.js'); };
  const SW = window.SW, CZ = SW.crazy, stats = window.czStats = {};
  const count = (k) => { const id = SW.versus.zone && SW.versus.zone.theme; (stats[id] = stats[id] || { hit: 0, launch: 0 })[k]++; };
  const h0 = CZ.hit, l0 = CZ.launch;
  CZ.hit = function () { count('hit'); return h0.apply(this, arguments); };
  CZ.launch = function () { const r = l0.apply(this, arguments); if (r) count('launch'); return r; };
  window.cz = {
    idx: id => SW.versus.STAGES.findIndex(s => s[1] === id),
    start(id, a, b, d1, d2, fmt) {
      const G = SW.game, V = SW.versus, I = SW.input; G.manual = true; V.open(G);
      V.mode = 'bvb'; V.fmt = fmt || 0; V.diff = d1 ?? 2; V.diff2 = d2 ?? 2; V.stage = this.idx(id); V.f = []; V.pick = [a ?? 0, b ?? 1]; V.phase = 'pick'; V.step = 1;
      const k = I.ok; I.ok = () => true;
      try { if (fmt) { V.team = [[a, (a + 1) % 64, (a + 2) % 64], [b, (b + 1) % 64, (b + 2) % 64]]; V.phase = 'order'; V.oRow = 2; G.tick(); } else G.tick(); } finally { I.ok = k; }
      return [V.phase, V.zone && V.zone.theme];
    },
    run(n) { const G = SW.game, V = SW.versus, t0 = performance.now(); let i = 0; for (; i < n && performance.now() - t0 < 15000; i++) { try { G.tick(); } catch (e) { return 'ERR ' + e.stack; } } return { i, phase: V.phase, round: V.round, wins: V.wins, t: V.t, timer: V.timer, err: G.lastError }; },
    until(fn, n) { const t0 = performance.now(); for (let i = 0; i < (n || 3000) && performance.now() - t0 < 15000; i++) { SW.game.tick(); if (fn(SW.versus.zone.sw)) { SW.game.render(); return i; } } SW.game.render(); return -1; },
    async snap(name, scale) {
      SW.game.render(); const src = document.querySelector('canvas'), s = scale || 2, c = document.createElement('canvas'); c.width = src.width * s; c.height = src.height * s;
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(src, 0, 0, c.width, c.height);
      const b = await new Promise(r => c.toBlob(r, 'image/png')); return (await fetch('/__rec/crazy-' + name + '.png', { method: 'POST', body: b })).status;
    },
    match(id, a, b, d1, d2, fmt) {
      this.start(id, a, b, d1, d2, fmt); const V = SW.versus, G = SW.game; let n = 0, timeUps = 0, kos = 0, last = V.phase; const t0 = performance.now();
      while (n < 80000 && V.phase !== 'result' && performance.now() - t0 < 14000) { try { G.tick(); } catch (e) { return { id, err: String(e.stack).slice(0, 300) }; } n++; if (V.phase === 'ko' && last !== 'ko') { kos++; if (V.timeUp) timeUps++; } last = V.phase; }
      return { id, heroes: V.f.map(f => f.hero), ticks: n, phase: V.phase, wins: V.wins.slice(), kos, timeUps, ms: Math.round(performance.now() - t0), err: G.lastError, st: stats[id] };
    },
    menu(id) { const G = SW.game, V = SW.versus; G.manual = true; V.open(G); V.mode = 'bvb'; V.stage = this.idx(id); V.row = V.menuRows().indexOf('stage'); G.tick(); G.render(); return V.row; },
    line: r => [r.id.replace('cz_', ''), r.heroes && r.heroes.join('-'), r.ticks, r.phase, r.wins && r.wins.join(':'), 'ko' + r.kos, 'tu' + r.timeUps, r.st ? r.st.hit + 'h/' + r.st.launch + 'l' : '', r.err || ''].join(' ')
  };
})();
