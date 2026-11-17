'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the invasion from the Beyond (chapters 5 and 6).
//   The Hollow Legion     five soldier types, emptied out of eaten worlds: Halcyon's own troops and machines with the
//                         colour drained to void black and violet (the sprites are baked from the originals at start).
//   Sovereign Vael        the Hollow Crown: the Director's sprite, half again as tall, in void armour with a violet
//                         glow; he pulls, rains crescents, slams, and calls his soldiers down.
//   The Called            the twelve Beyond-born who answer Vael: in their chapter 5 duel (and while they wait for
//                         it) they are drawn in his colours with an empty crown over their heads. Nothing is saved.
// Data and drawing only; js/saga/saga-core.js decides when any of it appears.
(function () {
  const SW = window.SW, D = SW.data, E = D && D.enemies, art = SW.art, HR = D && D.heroes, SG = SW.saga = SW.saga || {};
  if (!E || !art || !HR) return;
  const VIOLET = '#b48cff', VOID = [14, 8, 24], LIGHT = [201, 170, 255];

  // ================= baking sprites =================
  // every pixel keeps its shading but takes the void's colours: dark becomes void, light becomes violet
  function tint(cv, keep) {
    const pair = SW.canvas(cv.width, cv.height), c = pair[0], x = pair[1];
    x.drawImage(cv, 0, 0);
    const im = x.getImageData(0, 0, c.width, c.height), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const l = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255, t = Math.pow(l, 0.8);
      for (let k = 0; k < 3; k++) d[i + k] = Math.round((VOID[k] + (LIGHT[k] - VOID[k]) * t) * (1 - keep) + d[i + k] * keep);
    }
    x.putImageData(im, 0, 0);
    return c;
  }
  function scaled(cv, k) {
    const pair = SW.canvas(Math.round(cv.width * k), Math.round(cv.height * k)), x = pair[1];
    x.imageSmoothingEnabled = false; x.drawImage(cv, 0, 0, pair[0].width, pair[0].height);
    return pair[0];
  }
  function bake(id, src, keep, k) {
    const s = art.sheets[src];
    if (!s || art.sheets[id]) return !!art.sheets[id];
    let img = tint(s.img, keep), flash = s.flash;
    if (k && k !== 1) { img = scaled(img, k); if (flash) flash = scaled(flash, k); }
    art.sheets[id] = Object.assign({}, s, { img, flash, head: s.head ? tint(s.head, keep) : null },
      k && k !== 1 ? { fw: Math.round(s.fw * k), fh: Math.round(s.fh * k), ox: Math.round(s.ox * k), oy: Math.round(s.oy * k) } : null);
    return true;
  }
  SG.bake = bake;

  // ================= the Hollow Legion =================
  const LEGION = [
    ['hollow_soldier', 'guard', 'HOLLOW SOLDIER', 1.25],
    ['hollow_lancer', 'enforcer', 'HOLLOW LANCER', 1.25],
    ['hollow_archer', 'gunner', 'HOLLOW ARCHER', 1.2],
    ['hollow_drone', 'elitedrone', 'HOLLOW DRONE', 1.1],
    ['hollow_walker', 'brute', 'SIEGE WALKER', 1.35]
  ];
  LEGION.forEach(([id, src, name, hp]) => {
    const s = E[src]; if (!s) return;
    E[id] = Object.assign({}, s, { name, hp: Math.round(s.hp * hp), sheet: 'sg_' + id, sheet2: s.sheet2 ? 'sg_' + id : undefined, xp: Math.round((s.xp || 10) * 1.3), creds: Math.round((s.creds || 4) * 1.2) });
  });
  // chapters 5 and 6 fight the Legion (part 3 of the story): [ordinary, tougher, captain] for each layer
  const ok = a => a.filter(t => E[t]);
  SG.FOES = SG.FOES || {};
  SG.FOES[3] = [0, 1, 2].map(() => ({ basic: ok(['hollow_soldier', 'hollow_soldier', 'hollow_archer', 'hollow_drone']), tough: ok(['hollow_lancer', 'hollow_walker']), cap: ok(['hollow_walker']) }));

  // ================= Sovereign Vael =================
  E.vael = { name: 'SOVEREIGN VAEL', sub: 'The Hollow Crown', sheet: 'sg_vael', sheet2: 'sg_vael', hp: 2400, dmg: 15, speed: 1.15, xp: 900, creds: 0, idle: 22, w: 20, h: 56, counter: 1.25,
    script: [['volley', { n: 4, kind: 'crescent', col: VIOLET, speed: 4.4, gap: 12 }, [1, 2]], ['swings', { n: 3, reach: 66, col: '#e8d8ff' }, [3, 1]],
      ['summon', { kind: 'hollow_soldier', max: 3, hp: 40 }, [2, 2]], ['slam', { col: VIOLET }, [2, 2]], ['lunge', { speed: 7.2 }, [1, 3]]] };

  // ================= the Called =================
  SG.CALLED = ['vega', 'lux', 'mika', 'corvin', 'opal', 'apis', 'ryo', 'itsuki', 'noct', 'rue', 'slick', 'hex'];
  const SH = [['sheet', ''], ['sheetAw', '_aw'], ['sheetArmed', '_b']];
  const kept = {};
  SG.calledSheet = id => { const h = HR[id]; return h && bake('sg_called_' + id, h.sheet, 0.45) ? 'sg_called_' + id : (h && h.sheet); };
  // while `on`, the hero is drawn in Vael's colours (for a duel); off puts their own sprites back
  SG.callLook = function (id, on) {
    const h = HR[id]; if (!h) return;
    if (on) {
      if (kept[id]) return;
      kept[id] = {}; SH.forEach(q => { if (h[q[0]]) { kept[id][q[0]] = h[q[0]]; if (bake('sg_called_' + id + q[1], h[q[0]], 0.45)) h[q[0]] = 'sg_called_' + id + q[1]; } });
      SG.crowned = id;
    } else {
      if (!kept[id]) return;
      Object.keys(kept[id]).forEach(k => { h[k] = kept[id][k]; }); delete kept[id];
      if (SG.crowned === id) SG.crowned = null;
    }
  };
  // the empty crown: three violet points over the head, open in the middle, slowly pulsing
  function crown(ctx, x, y) {
    x = Math.round(x); y = Math.round(y);
    const a = 0.75 + 0.25 * Math.sin(SW.frame * 0.12);
    art.glow(ctx, x, y - 3, 12, VIOLET, 0.18 * a);
    ctx.globalAlpha = a;
    art.rect(ctx, VIOLET, x - 7, y, 15, 2);
    art.rect(ctx, VIOLET, x - 7, y - 5, 2, 5); art.rect(ctx, VIOLET, x - 1, y - 7, 2, 7); art.rect(ctx, VIOLET, x + 5, y - 5, 2, 5);
    art.rect(ctx, '#ffffff', x - 1, y - 7, 2, 1); art.rect(ctx, '#ffffff', x - 7, y - 5, 2, 1); art.rect(ctx, '#ffffff', x + 5, y - 5, 2, 1);
    ctx.globalAlpha = 1;
  }
  SG.crown = crown;
  const P = SW.Player && SW.Player.prototype;
  if (P && P.draw) {
    const _pd = P.draw;
    P.draw = function (ctx, cam, g) {
      const out = _pd.apply(this, arguments);
      const V = SW.versus;
      if (SG.crowned && V && V.f && V.f[1] && V.f[1].p === this && V.f[1].hero === SG.crowned && !this.dead) crown(ctx, this.x - cam.x, this.y - cam.y - 44);
      return out;
    };
  }
  const N = SW.NPC && SW.NPC.prototype;
  if (N && N.draw) { const _nd = N.draw; N.draw = function (ctx, cam) { const out = _nd.apply(this, arguments); if (this.sgCalled) crown(ctx, this.x - cam.x, this.y - cam.y - 42); return out; }; }

  // the sprites are baked once the game has made its own
  const _init = art.init;
  art.init = function () {
    const out = _init.apply(this, arguments);
    try {
      LEGION.forEach(([id, src]) => { const s = E[src]; if (s) bake('sg_' + id, s.sheet, 0.12); });
      bake('sg_vael', 'director', 0.08, 1.5);
    } catch (e) { console.error(e); }
    return out;
  };
})();
