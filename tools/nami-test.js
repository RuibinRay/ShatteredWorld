'use strict';
// Test helpers for js/nami-shark.js (not loaded by the game). Load after tools/harness.js on the record server
// (tools/record-server.ps1, port 8793). Never calls T.boot / T.prep (they clear localStorage).
//   NT.start(opp)          Versus Training, Nami (player 1) against a standing dummy
//   NT.sheet(name, o)      press o.codes, capture frames o.at around Nami into one PNG in recordings/
//   NT.clip(name, o)       the same, as a .webm clip
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, I = SW.input, D = SW.data;
  SW.audio.sfx = () => {}; SW.audio.music = () => {}; G.saveGame = () => {}; if (SW.store) SW.store.save = () => {};
  const NT = window.NT = {
    start(opp, hero) { G.manual = true; V.open(G); V.mode = 'train'; V.fmt = 0; V.speed = 0; V.diff = 0; V.diff2 = 0; V.gain = 1; V.stage = 1; V.pick = [D.heroOrder.indexOf(hero || 'nami'), D.heroOrder.indexOf(opp || 'kael')]; V.phase = 'pick'; V.step = 1; T.press('confirm'); T.step(2); let n = 0; while (V.phase !== 'fight' && n++ < 600) G.tick(); return { phase: V.phase, f: V.f.map(f => f.hero) }; },
    prep(gap) { const a = V.f[0], b = V.f[1]; a.state.energy = 300; a.state.awaken = 100; a.p.cd = {}; a.p.modeT = 0; a.p.awakeT = 0; a.p.enter('idle'); b.p.enter('idle'); a.p.x = 200; b.p.x = 200 + (gap || 70); b.p.trainPin = null; a.p.face = 1; b.p.face = -1; a.shots.length = 0; b.shots.length = 0; SW.fx.list.length = 0; },
    hold(codes, n) { I.raw = {}; codes.forEach(c => { I.raw[c] = true; }); for (let i = 0; i < (n || 1); i++) G.tick(); I.raw = {}; },
    step(n) { for (let i = 0; i < n; i++) G.tick(); },
    async post(name, blob) { return (await fetch('/__rec/' + name, { method: 'POST', body: blob })).status; },
    // o = { gap, codes, hold, at: [frames after the press], box: [dx, dy, w, h] around Nami's start, s (scale), cols, pre() }
    async sheet(name, o) {
      NT.prep(o.gap || 70); if (o.pre) o.pre(); NT.step(3);
      const p = V.f[0].p, x0 = p.x, y0 = p.y, [dx, dy, w, h] = o.full ? [G.cam.x - p.x, G.cam.y - p.y, SW.W, SW.H] : (o.box || [-40, -90, 220, 100]), s = o.s || 2, cols = o.cols || 3, n = o.at.length, rows = Math.ceil(n / cols);
      const out = document.createElement('canvas'); out.width = cols * w * s + (cols - 1) * 4; out.height = rows * h * s + (rows - 1) * 4;
      const ox = out.getContext('2d'); ox.fillStyle = '#ff00ff'; ox.fillRect(0, 0, out.width, out.height); ox.imageSmoothingEnabled = false;
      const c = document.querySelector('canvas'), k = c.width / SW.W;
      NT.hold(o.codes, o.hold || 2); let f = o.hold || 2;
      for (let i = 0; i < n; i++) {
        if (o.byst) { let n = 0; while (p.state === 'ult' && p.st < o.at[i] && n++ < 400) G.tick(); }   // o.at are the ultimate's own frames (p.st)
        else while (f < o.at[i]) { G.tick(); f++; }
        G.render();
        const sx = o.full ? 0 : Math.round(x0 + dx - G.cam.x), sy = o.full ? 0 : Math.round(y0 + dy - G.cam.y), cx = (i % cols) * (w * s + 4), cy = Math.floor(i / cols) * (h * s + 4);
        ox.drawImage(c, sx * k, sy * k, w * k, h * k, cx, cy, w * s, h * s);
        ox.fillStyle = '#ffffff'; ox.font = '14px monospace'; ox.fillText('f' + o.at[i], cx + 4, cy + 16);
      }
      const b = await new Promise(ok => out.toBlob(ok, 'image/png'));
      return { st: await NT.post(name, b), err: G.lastError, hp: V.f[1].state.hp };
    },
    // a whole-screen clip at normal speed (frames drawn one by one into a recorder)
    async clip(name, o) {
      NT.prep(o.gap || 70); if (o.pre) o.pre(); NT.step(3);
      const c = document.querySelector('canvas'), st = c.captureStream(0), tr = st.getVideoTracks()[0], rec = new MediaRecorder(st, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 6e6 }), parts = [];
      rec.ondataavailable = e => parts.push(e.data); rec.start();
      const frame = () => new Promise(ok => { G.render(); tr.requestFrame(); setTimeout(ok, 1000 / 60); });
      for (let i = 0; i < (o.lead || 10); i++) await frame();
      I.raw = {}; (o.codes || []).forEach(cd => { I.raw[cd] = true; });
      for (let i = 0; i < (o.len || 90); i++) { if (i === (o.hold || 2)) I.raw = {}; G.tick(); await frame(); }
      I.raw = {};
      await new Promise(ok => { rec.onstop = ok; rec.stop(); });
      return { st: await NT.post(name, new Blob(parts, { type: 'video/webm' })), err: G.lastError };
    }
  };
})();
