'use strict';
// Shattered Worlds — Sen, the sakura swordsman (2026-11-21, the user: "improve sen ... combine it with sakura and his look
// like character appearance make it look handsome", "like in game appearance"). His sprite is rebaked: long black hair
// swept over the brow and tied in a high tail that streams behind him, a sharp eye with a pink glint, a dark haori over a
// white kimono, a pink obi and a sakura crest on the chest, dark hakama. Awakened (One Mind) his hair turns blossom-white
// and the haori sakura-pink. A few petals fall from him while he stands still. Draw-only. Loaded after js/apex/sen.js
// (its Sakura Edge katana stays: this rebake keeps the weapon the sheet already has).
(function () {
  const SW = window.SW, art = SW.art, D = SW.data;
  if (!art || !art.bake || !art.HEADS || !D || !D.heroes.sen) return;
  const SK = SW.senSakura = { on: true };

  // 11 x 10, facing right. h hair, H hair shade, s skin, S skin shade, e eye, g eye glint (pink), w white
  art.HEADS.sen_sakura = [
    '...hhhh....',
    '..hhhhhhh..',
    '.hhhhhhhhhh',
    'Hhhhhhhhhhh',
    'HHhhsshhhh.',
    'HHhsssegsh.',
    'HHssssssSss',
    '.HSssssssS.',
    '.HHSSssss..',
    '..H..SSS...'
  ];
  const LOOK = {
    head: 'sen_sakura', sc: 1.04, bulk: 7, trailHead: 1, trailLen: 6, trailW: 2,
    c: { skin: '#f2cfb4', hair: '#17131f', eye: '#120e18', glow: '#ff7aa8', top: '#f2ece2', arm: '#2b2238', fore: '#2b2238', hand: '#f2cfb4',
      pants: '#272231', boots: '#15121b', belt: '#ff8fb4', chest: '#ff8fb4', trail: '#17131f' }
  };
  const LOOK_AW = {
    head: 'sen_sakura', sc: 1.04, bulk: 7, trailHead: 1, trailLen: 6, trailW: 2, outline: '#3a1426',
    c: { skin: '#f6d8c2', hair: '#fff0f5', eye: '#2a0a1a', glow: '#ff3a7a', top: '#fff6f8', arm: '#ff8fb4', fore: '#ff8fb4', hand: '#f6d8c2',
      pants: '#3a2440', boots: '#22162a', belt: '#ffffff', chest: '#ff3a7a', trail: '#fff0f5' }
  };
  function setOf(s) { const have = Object.keys(s.anims || {}).sort().join(','); for (const k of Object.keys(art.SETS || {})) if (art.SETS[k].slice().sort().join(',') === have) return k; return 'hero'; }
  function rebake() {
    const h = D.heroes.sen;
    [[h.sheet || 'sen', LOOK], [h.sheetAw || 'sen_aw', LOOK_AW]].forEach(([sid, look]) => {
      const s = art.sheets[sid]; if (!s || !s.cfg) return;
      const cfg = JSON.parse(JSON.stringify(s.cfg));
      Object.assign(cfg, { head: look.head, sc: look.sc, bulk: look.bulk, trailHead: look.trailHead, trailLen: look.trailLen, trailW: look.trailW });
      if (look.outline) cfg.outline = look.outline;
      cfg.c = Object.assign({}, look.c);   // (the shades are made fresh by bake)
      try { art.bake(sid, cfg, setOf(s)); } catch (e) { console.error('sen-sakura', e); }
    });
  }
  // a petal now and then from his shoulders while he stands still (draw-only particles)
  const P = SW.Player && SW.Player.prototype, part = SW.ninja && SW.ninja.part;
  if (P && part) {
    const _pd = P.draw;
    P.draw = function (ctx, cam, g) {
      const r = _pd.apply(this, arguments);
      if (SK.on && !this.dead && this.state === 'idle' && SW.frame % 34 === 0) {
        const sh = this.sheet && this.sheet();
        if (sh === 'sen' || sh === 'sen_aw') part(this.x - this.face * 4 + SW.rand(-5, 5), this.y - 30, SW.frame % 68 ? '#ffa0c0' : '#ffe4ee', -this.face * SW.rand(0.1, 0.5), 0.15, 70, 2, 0.004);
      }
      return r;
    };
  }
  const _init = art.init;
  art.init = function () { const r = _init.apply(this, arguments); if (SK.on) rebake(); return r; };
  SK.rebake = rebake;
})();
