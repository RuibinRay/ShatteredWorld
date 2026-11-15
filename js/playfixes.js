'use strict';
// Shattered Worlds — fixes from recorded playtests (tools/autoplay.js). Only wraps; nothing in the shared files is edited.
//   Med-Lab Sector 7, the admin wing (every hero who wakes in Aurelia passes through it): of the three terminals Block C
//   needs, the second is up a ladder on a gantry, and the recorded run walked straight under it to the sealed door.
//   A hint at the foot of the ladder now points up, until that terminal is hacked.
(function () {
  const SW = window.SW, G = SW.game, Z = SW.zones, T = 16;
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
