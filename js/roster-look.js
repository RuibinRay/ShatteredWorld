'use strict';
// Shattered Worlds — sprites that look like their roster art. Draw-only: colours of the sprite rig, nothing else.
// Each hero's roster image (assets/bg/hero_<id>.png) was laid next to their sprite (recordings/look-compare-*.png);
// where the two disagreed, the sprite's colours are set to the art's. Most heroes already matched; these did not:
//   Brakk   bald, dark-skinned, in grey-brown stone armour (was one muddy brown)
//   Dyna    a khaki jacket with orange patches under the yellow hard hat (was army green)
//   Vesper  a red scarf (was pink)            Fenn   navy armour with a purple glow (was grey)
//   Tessa   copper hair (was brown)           Tarn   the blue top (was white trousers, dark top)
//   Yara    khaki with the yellow sash         Sable  a purple bodysuit (was dark navy)
//   Garo    a silver knight (was dark grey)   Kova   orange with dark tiger stripes (was brown)
//   Taro    a black mawashi (was yellow)      Rue    the red coat and pink trousers (was beige)
//   Fumi    the black ninja (was grey)        Vega, Apis, Ryo  the darker skin of their art
// Each sheet is baked again with the new colours (js/clan-poses.js then puts that hero's stances back on top).
// Itsuki and Bando are other sessions' work and are left as they are. SW.rosterLook.LOOK lists every change.
(function () {
  const SW = window.SW, art = SW && SW.art, D = SW && SW.data;
  if (!art || !art.bake || !D) return;
  const LOOK = {
    brakk: { skin: '#5a3a28', arm: '#5a3a28', hand: '#5a3a28', top: '#6e6a62', fore: '#8a857a', pants: '#3a3530', boots: '#5a554c', belt: '#a8906a', chest: '#9a948a' },
    dyna: { top: '#b49a6a', arm: '#b49a6a', fore: '#e07a2a', pants: '#6a5a40', chest: '#e07a2a' },
    vesper: { belt: '#e0283c', trail: '#e0283c' },
    fenn: { top: '#202a68', arm: '#202a68', pants: '#151c48', boots: '#2c2a70', fore: '#3d3a9a', hand: '#c9b6ff' },
    tessa: { hair: '#c8642a' },
    tarn: { top: '#2a5fd0', pants: '#2a3a5a' },
    yara: { top: '#6b6a3a', arm: '#6b6a3a', pants: '#4a4428' },
    sable: { top: '#5a2e9a', arm: '#5a2e9a', pants: '#2a1450', acc: '#7a3ac8', boots: '#2a1450', hair: '#141018' },
    garo: { top: '#9aa4b4', arm: '#9aa4b4', fore: '#c8d0dc', pants: '#5a6270', boots: '#3a404c', hair: '#aab4c0' },
    kova: { top: '#d87a30', fore: '#2a1a10', pants: '#6a5a48', hair: '#ff6a2a' },
    taro: { pants: '#1a1a1a', belt: '#1a1a1a' },
    rue: { top: '#c8283c', arm: '#c8283c', fore: '#a01e30', pants: '#e8a0a0', boots: '#3a1a20', chest: '#ffffff' },
    fumi: { top: '#2a2e34', arm: '#2a2e34', pants: '#1e2226', hair: '#14161a' },
    vega: { skin: '#6a4a34' },
    apis: { skin: '#7a5034', hand: '#7a5034' },
    ryo: { skin: '#6a4a34', hand: '#6a4a34' }
  };
  const RL = SW.rosterLook = { on: true, LOOK, done: {}, failed: [] };
  function apply(hero) {
    const h = D.heroes[hero], id = h && h.sheet, s = id && art.sheets[id];
    if (!s || !s.cfg || !s.cfg.c) return false;
    if (s.cfg._rosterLook) return true;
    const c = s.cfg.c, o = LOOK[hero];
    Object.keys(o).forEach(k => { c[k] = o[k]; delete c[k + 'D']; });   // the darker shade is worked out again from the new colour
    s.cfg._rosterLook = true;
    try { art.bake(id, s.cfg, 'hero'); RL.done[hero] = true; } catch (e) { RL.failed.push(hero + ':' + (e && e.message)); }
    return true;
  }
  // once the sheets exist (and again if one is baked anew from a fresh rig elsewhere)
  function pump() {
    if (!RL.on) return;
    Object.keys(LOOK).forEach(hero => { const h = D.heroes[hero], s = h && art.sheets[h.sheet]; if (s && s.cfg && !s.cfg._rosterLook) apply(hero); });
  }
  setInterval(pump, 300);
})();
