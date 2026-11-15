'use strict';
// Shattered Worlds — no grinding by dying. Loaded after every other G.onKill wrapper (heroes5, mods, heat, ledger).
//
// Dying, or leaving an area and coming back, brings all of its foes back, and each kill used to pay full XP and creds
// every time, so the quickest way to level was to die on purpose near a crowd. Now each area counts its recent kills:
// the first FREE (the busiest area, the Metro, has 15 foes) pay in full, every kill after that pays STEP less, down to FLOOR. The count goes down by one every
// DECAY frames, so ordinary play (clear a room, move on, come back later) never sees a cut. Bosses always pay in full.
// The count is kept in memory only: it is about the last few minutes, not the save.
(function () {
  const SW = window.SW, G = SW.game;
  const FREE = 18, STEP = 0.06, FLOOR = 0.2, DECAY = 900, OPEN = { pit: true };   // OPEN: arenas, where waves are the point
  const seen = {};   // zone id -> { n, f }: recent kills, and the frame they were last counted at
  const told = {};
  const count = z => {
    const c = seen[z] || (seen[z] = { n: 0, f: SW.frame });
    c.n = Math.max(0, c.n - (SW.frame - c.f) / DECAY); c.f = SW.frame;
    return c;
  };
  const factor = n => Math.max(FLOOR, 1 - Math.max(0, n - FREE) * STEP);
  const _kill = G.onKill;
  G.onKill = function (e) {
    const z = G.zone && G.zone.id;
    if (!z || OPEN[z] || e.isBoss || !e.def || G.scene !== 'play') return _kill.apply(this, arguments);
    const c = count(z), k = factor(c.n);
    c.n++;
    if (k >= 1) return _kill.apply(this, arguments);
    const d = e.def;
    e.def = Object.assign({}, d, { xp: Math.round((d.xp || 0) * k), creds: Math.max(0, Math.round((d.creds || 0) * k)) });
    try { return _kill.apply(this, arguments); } finally { e.def = d; }
  };
  const _k2 = G.onKill;
  G.onKill = function (e) {
    const r = _k2.apply(this, arguments), z = G.zone && G.zone.id;
    if (z && seen[z] && factor(seen[z].n - 1) < 0.7 && !told[z]) { told[z] = true; G.toast('Little left to learn here. Fights pay less for a while.', '#c8ccd8'); }
    return r;
  };
  SW.farming = { seen, factor, count, FREE, STEP, FLOOR, DECAY };
})();
