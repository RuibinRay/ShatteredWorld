'use strict';
// Shattered Worlds — the Training dummy stays put (the user, 2026-11-20: "make sure for training the puppet dont move at
// all"). In Versus Training with the dummy set to "Stands still", the dummy is held on the spot where the round put it:
// hits still land, flash and count, but nothing knocks it back, launches it or drags it. Every other dummy setting
// (Guards, Attacks, Fights back) and every other mode are unchanged. SW.trainPin.on = false turns it off.
(function () {
  const SW = window.SW, V = SW.versus;
  if (!V || typeof V.update !== 'function') return;
  const TP = SW.trainPin = { on: true };
  const pinned = () => TP.on && V.mode === 'train' && V.dummy === 0 && V.f && V.f.length === 2 && V.f[1] && V.f[1].p;
  function hold() {
    if (!pinned()) return;
    const q = V.f[1].p;
    if (!q.trainPin) q.trainPin = { x: q.x, y: q.y };   // a new round (or a new dummy hero) makes a new fighter: a new spot
    q.x = q.trainPin.x; q.y = q.trainPin.y; q.vx = 0; q.vy = 0; q.onGround = true;
  }
  const _up = V.update;
  V.update = function () { const r = _up.apply(this, arguments); hold(); return r; };
  // the player can move it on purpose: a new spot is taken whenever the dummy is switched back to "Stands still"
  let last = V.dummy;
  const _up2 = V.update;
  V.update = function () { if (V.dummy !== last) { last = V.dummy; if (V.f && V.f[1] && V.f[1].p) V.f[1].p.trainPin = null; } return _up2.apply(this, arguments); };
})();
