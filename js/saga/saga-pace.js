'use strict';
// Shattered Worlds - The Hollow Crown: pacing and clarity (the user, 2026-11-18, after a playtest: "Pacing and writing pass").
//   - THE MARCH. A chapter's waves no longer all land on the spot where the hero arrives. The first wave meets the hero
//     at the start; every later wave waits further across the area (towards its far side, up to ~64 tiles), at a
//     beacon of light the hero has to reach. The last wave (and a Holder's Siege Walker captain) is at the far end. If
//     the hero cannot get closer to a beacon for 25 seconds, the wave comes to them instead, so nothing can stall.
//   - THE TASK. Under the HUD goal, a second line says what to do right now ("Next fight: 23 m east", "Wave 2/3:
//     4 left"); the chapter card gets a TASK line ("Fight through 3 waves across the area").
//   - FALSE FACES. Before chapter 4 a briefing explains the Three-Layer War (the same way the Convergence interlude
//     comes before chapter 5), so the war's events make sense whichever story you play first.
//   (The saviours' finale split that was here is gone: chapter 6 of the lines files is no longer played; the campaign's
//   finale is js/saga/campaign-lines.js, 2026-11-20.)
// Only wraps: SW.Zone.prototype.update / draw, ui.hud, ui.drawCard. Loaded after js/saga/saga-lang.js.
(function () {
  const SW = window.SW, G = SW && SW.game, SG = SW && SW.saga, ui = SW && SW.ui, art = SW && SW.art, T = 16, W = SW && SW.W;
  if (!G || !SG || !SG.run || !ui || !SW.Zone) return;
  const R = SG.run, HR = SW.data.heroes;
  const on = () => !!(G.state && G.state.saga);
  const done = (n, sid) => !!(G.state.steps && G.state.steps['SG' + n + ':' + sid]);
  const txt = (ctx, s, x, y, c, o) => SW.text(ctx, s, x, y, c, o);
  const tr = s => (SW.i18n && SW.i18n.tr ? SW.i18n.tr(s) : s);
  const nm = id => (HR[id] ? HR[id].name : id);
  const fill = (s, ...a) => a.reduce((o, v, i) => o.split('{' + i + '}').join(v), s);   // a pattern, filled after it is translated
  const gone = (z, e) => !e.wait && (e.dead || e.gone || z.ents.indexOf(e) < 0 || e.y > z.ph + 64);

  // ================= the march =================
  const M = { key: null, pts: null, dir: 1, best: 1e9, hold: 0, gy: {} };
  const waveChapter = (n, c) => {
    const st = (SW.data.missions['SG' + n] || {}).steps || [];
    return st.some(s => s.id === 'fight') && !done(n, 'fight') && (n !== 2 || done(2, 'talk'));
  };
  function plan(z, n) {   // when the first wave appears: the route from here to the far side
    const p = G.player, N = (R.list || []).length, left = p.x - 3 * T, right = z.pw - 3 * T - p.x, dir = right >= left ? 1 : -1;
    const dist = Math.min((dir > 0 ? right : left) * 0.85, 64 * T);
    M.key = z.id + ':' + n; M.dir = dir; M.best = 1e9; M.hold = 0; M.gy = {};
    M.pts = N > 1 && dist >= 14 * T ? Array.from({ length: N - 1 }, (_, i) => Math.round(p.x + dir * dist * (i + 1) / (N - 1))) : null;
    // each beacon on solid ground near its mark, never over a pool or spikes (SG.spotNear only picks standable tiles)
    if (M.pts && SG.spotNear) M.pts = M.pts.map(x => { const s = SG.spotNear(z, x, p.y, 0, dir); return s ? s.tx * T + 8 : x; });
  }
  // which beacon the hero is walking to now (index into M.pts), or -1
  function waiting(z) {
    if (!M.pts || R.wave < 0 || !R.list || R.wave + 1 >= R.list.length || !R.foes.every(e => gone(z, e))) return -1;
    return R.wave;   // wave R.wave + 1 waits at M.pts[R.wave]
  }
  function marchTick(z) {
    const S = G.state, sg = S.saga, n = sg.ch;
    if (sg.phase !== 'play' || G.busy() || !G.player || G.player.dead) return;
    const c = SG.chap(S.hero, n);
    if (z.id !== c.zone || !waveChapter(n, c)) { M.key = null; return; }
    if (R.wave < 0) { M.key = null; return; }
    if (M.key !== z.id + ':' + n) plan(z, n);
    const k = waiting(z); if (k < 0) { M.best = 1e9; M.hold = 0; return; }
    const d = Math.abs(G.player.x - M.pts[k]);
    if (d <= 40) return;   // arrived: the wave comes (saga-core counts its own short delay down)
    if (d < M.best - 6) { M.best = d; M.hold = 0; } else M.hold++;
    if (M.hold > 25 * 60) { M.pts[k] = G.player.x; return; }   // stuck (25 s without getting closer): the fight comes here instead
    R.t = Math.max(R.t, 2);   // hold the next wave until the hero gets there
  }

  // ================= before chapter 4: the briefing =================
  const BRIEF = ['The Director knows the three layers would turn on him together. So he turns them on each other.',
    "Every screen in the world shows the same two films. A white-haired Deepline boy opens the Core Sump's vents onto the Sky's laboratories. A singer from the Sky leads Halcyon's drills into Deepline's tunnels.",
    'Each layer believes the other struck first. Three battles begin on the same night: the Siege of the Noble Ring, the Drills at the Buried Meridian, and the Pit Arena, where someone has been pulling strings for years.',
    'The faces are real. The people behind them are not.'];
  const briefing = () => { const sg = G.state.saga; return sg.phase === 'card' && sg.ch === 4 && !(sg.seen && sg.seen.war); };
  function briefTick() {   // the briefing was closed: show the chapter's own card next
    const sg = G.state.saga;
    if (briefing() && R.cardShown && !G.overlay) { sg.seen = sg.seen || {}; sg.seen.war = true; R.cardShown = false; R.cardT = 8; }
  }
  function drawBrief(ctx) {
    const H = SW.H;
    ctx.globalAlpha = 0.95; art.rect(ctx, '#05060c', 0, 0, W, H); ctx.globalAlpha = 1;
    art.glow(ctx, W / 2, 70, 120, '#ff3ea5', 0.10 + 0.04 * Math.sin(SW.frame * 0.05));
    txt(ctx, 'THE THREE-LAYER WAR', W / 2, 26, '#8a92b8', { align: 'center' });
    txt(ctx, 'FALSE FACES', W / 2, 40, '#ffd0e4', { align: 'center', scale: 3 });
    let y = 84; BRIEF.forEach(p => { SW.wrap(p, 400).forEach(l => { txt(ctx, l, W / 2, y, '#e8ecf4', { align: 'center', raw: true }); y += 11; }); y += 5; });
    txt(ctx, 'THE WAR BEGINS', W / 2, y + 6, '#ff3ea5', { align: 'center', scale: 2 });
    if (SW.frame % 40 < 26) txt(ctx, 'J / Enter: keep going', W / 2, 250, '#8a92b8', { align: 'center' });
  }

  // ================= frame hooks =================
  const _zu = SW.Zone.prototype.update;
  SW.Zone.prototype.update = function (g) {
    if (on() && G.scene === 'play' && this === G.zone && this.id !== 'versus' && G.player) {
      try { briefTick(); marchTick(this); } catch (e) { console.error(e); }
    }
    return _zu.apply(this, arguments);
  };

  // the beacon: a column of light where the next wave waits, and an arrow at the screen's edge when it is off screen
  function groundY(z, x) {
    const k = Math.round(x / T); if (M.gy[k] !== undefined) return M.gy[k];
    const s = SG.spotNear ? SG.spotNear(z, x, G.player.y, 0, M.dir) : null;
    return (M.gy[k] = s ? (s.ty + 1) * T : G.player.y);
  }
  const _zd = SW.Zone.prototype.draw;
  SW.Zone.prototype.draw = function (ctx, cam, g) {
    const r = _zd.apply(this, arguments);
    try {
      if (!on() || this !== G.zone || !G.player || G.state.saga.phase !== 'play' || M.key !== this.id + ':' + G.state.saga.ch) return r;
      const k = waiting(this); if (k < 0) return r;
      const tx = M.pts[k], gy = groundY(this, tx), sx = Math.round(tx - cam.x), sy = Math.round(gy - cam.y), t = SW.frame;
      if (sx > -8 && sx < W + 8) {
        const a = 0.18 + 0.08 * Math.sin(t * 0.08);
        ctx.globalAlpha = a; art.rect(ctx, '#b48cff', sx - 6, 0, 12, sy); ctx.globalAlpha = a * 1.6; art.rect(ctx, '#e8d8ff', sx - 2, 0, 4, sy); ctx.globalAlpha = 1;
        art.glow(ctx, sx, sy - 6, 22, '#b48cff', 0.35);
        for (let i = 0; i < 3; i++) { const py = sy - ((t * 1.5 + i * 40) % 120); art.rect(ctx, '#ffffff', sx - 1 + (i - 1) * 4, py, 2, 2); }
      } else {
        const right = sx >= W, ax = right ? W - 14 : 14, ay = Math.max(40, Math.min(SW.H - 50, sy - 20)), bob = Math.round(Math.sin(t * 0.15) * 2);
        for (let i = 0; i < 5; i++) art.rect(ctx, '#b48cff', ax + (right ? -i + bob : i - bob), ay - i, 1, i * 2 + 1);
      }
    } catch (e) { console.error(e); }
    return r;
  };

  // the task line under the HUD goal
  const _hud = ui.hud;
  ui.hud = function (ctx, g) {
    const r = _hud.apply(this, arguments);
    try {
      if (!on() || g.scene !== 'play' || g.overlay || !g.zone || !g.player || g.state.saga.phase !== 'play') return r;
      const st = g.currentStep && g.currentStep(); if (!st) return r;
      const rows = SW.wrap(st.t, 190).length, y = 17 + rows * 10 + 1;
      let s = null;
      const k = M.key === g.zone.id + ':' + g.state.saga.ch ? waiting(g.zone) : -1;
      if (k >= 0) s = fill(tr(M.dir > 0 ? 'Next fight: {0} m east' : 'Next fight: {0} m west'), String(Math.max(1, Math.round(Math.abs(M.pts[k] - g.player.x) / T))));
      else if ((st.id === 'fight' || st.id === 'rescue') && R.wave >= 0 && R.list) { const left = R.foes.filter(e => !gone(g.zone, e)).length; if (left) s = fill(tr('Wave {0}/{1}: {2} left'), String(R.wave + 1), String(R.list.length), String(left)); }
      if (s) txt(ctx, s, W - 8, y, '#b48cff', { align: 'right', raw: true });
    } catch (e) { console.error(e); }
    return r;
  };

  // the chapter card: a TASK line (and the briefing before chapter 4)
  function taskOf(id, n) {
    const c = SG.chap(id, n), N = ((SG.WAVES && SG.WAVES[n]) || []).length, w = String(N);
    if (n === 1 || n === 4) return fill(tr('Fight through {0} waves across the area'), w);
    if (n === 2) return fill(tr('Find {0}, then fight {1} waves at their side'), tr(nm(c.with)), w);
    if (n === 3) return fill(tr('Find {0} and win the duel'), tr(nm(c.rival)));
    if (n === 5) return fill(tr("Break {0} waves of Halcyon's guard, then the Convergence"), w);
    if (n === 6) return tr('Travel the map and rescue the other heroes; 8 (2 per layer) to storm the Crown');
    return fill(tr('Break {0} waves, beat Itsuki, then Vael, with the muster beside you'), w);
  }
  const _dc = ui.drawCard;
  ui.drawCard = function (ctx, g) {
    if (g.card === 'sg' && on() && !R.inter && briefing()) { drawBrief(ctx); return; }
    const r = _dc.apply(this, arguments);
    try {
      const S = g.state, sg = S && S.saga;
      if (g.card !== 'sg' || !on() || R.inter || sg.phase !== 'card' || sg.ch > (SG.LAST || 7)) return r;
      const n = sg.ch, text = SG.cardOf ? SG.cardOf(S.hero, n)[2] : '';
      const x = 154, rows = SW.wrap(text, 284).length, y = 96 + rows * 11 + 10 + 12 + 12;
      const lab = tr('TASK'), lw = SW.textW(lab) + 6, lines = SW.wrap(taskOf(S.hero, n), 284 - lw);
      if (y + lines.length * 11 > 214) return r;   // a long card: no room (the HUD line still says it)
      txt(ctx, 'TASK', x, y, '#8a92b8');
      lines.forEach((l, i) => txt(ctx, l, x + lw, y + i * 11, '#b48cff', { raw: true }));
    } catch (e) { console.error(e); }
    return r;
  };
  SG.pace = M;   // (for tests)
})();
