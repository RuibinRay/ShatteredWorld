'use strict';
// Shattered Worlds — fixes from recorded playtests (tools/autoplay.js). Only wraps; nothing in the shared files is edited.
//   Med-Lab Sector 7, the admin wing (every hero who wakes in Aurelia passes through it): of the three terminals Block C
//   needs, the second is up a ladder on a gantry, and the recorded run walked straight under it to the sealed door.
//   A hint at the foot of the ladder now points up, until that terminal is hacked.
//   Debug keys (F7 heal, F8 warp, F9 unlock every ability) work only in a local copy: on localhost, opened from a file, or
//   with ?debug in the address. The public site ignores them, and the menus only mention F9 where it works (ui.js).
//   The Spire's harvest ledger (a step of A3-5) sits mid-fight in the Shard Vault and was easy to walk past: a hint now
//   points at it until it is read.
//   Full-height gates could be climbed over the top of the map with Magnet Grip (found by the autoplay bot): their solid
//   part now reaches far above the map, and the hero cannot climb more than 2 tiles above the map's top edge.
(function () {
  const SW = window.SW, G = SW.game, Z = SW.zones, T = 16;
  const host = location.hostname;
  SW.dev = location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || /[?&]debug\b/.test(location.search);
  const I = SW.input, _iu = I.update;
  I.update = function () { _iu.apply(this, arguments); if (!SW.dev) { delete I.now.dbgUnlock; delete I.now.dbgHeal; delete I.now.dbgWarp; } };
  if (Z.spire) {
    const sb = Z.spire.build;
    Z.spire.build = function (z, g) {
      sb.call(this, z, g);
      const hint = { x: 52 * T, y: 13 * T, w: 14 * T, h: 7 * T };
      Object.defineProperty(hint, 'text', { get: () => (G.state && G.state.mission === 'A3-5' && !G.state.steps['A3-5:ledger'] ? 'E at the glowing console: read the harvest ledger.' : '') });
      z.hints.push(hint);
    };
  }
  // Gates that reach the top of the map (the Noble Ring's Chancery gate, both Skylift gates, the finale's) could be
  // climbed: Kael's Magnet Grip walked up the gate, over its top edge and down the far side, skipping the three relays.
  // Their solid part now reaches far up into the sky (the picture is unchanged), so nothing gets over.
  // Raising the gate alone did not stop it (a wall-jump climb has no end), so the story's maps also get a ceiling: the
  // hero's feet stay within 2 tiles of the top edge. Ordinary jumps never get that high.
  const PU = SW.Player.prototype, _pu = PU.update;
  PU.update = function (g) { const r = _pu.apply(this, arguments); if (g.scene === 'play' && this.y < -2 * T) { this.y = -2 * T; if (this.vy < 0) this.vy = 0; } return r; };
  const _gate = SW.Zone.prototype.gate;
  SW.Zone.prototype.gate = function (tx, ty, th, o) {
    const g = _gate.apply(this, arguments);
    if (ty === 0 && g && g.rect && !g.horiz) { g.rect.y -= 64 * T; g.rect.h += 64 * T; }
    return g;
  };
  const def = Z.medlab;
  if (def) {
    const b = def.build;
    def.build = function (z, g) {
      b.call(this, z, g);
      const hint = { x: 213 * T, y: 13 * T, w: 10 * T, h: 7 * T };
      Object.defineProperty(hint, 'text', { get: () => (G.state && G.state.steps['I1-2:t2'] ? '' : 'A terminal is up on the gantry: climb the ladder (W).') });
      z.hints.push(hint);
    };
  }
})();
