'use strict';
// Shattered Worlds — Hidden Clans: Itsuki, master of the five elements (Versus only; registered with ninja-kit.js). An original character.
//   The wheel: every skill is cast in his current element, then the wheel turns: fire -> wind -> thunder -> earth -> water -> fire.
//   Fire burns; wind throws the enemy far; thunder stuns; earth hits 30% harder and lifts; water heals him 5%, and closing
//   the circle with water gives back 25 energy. His S + I casts all five seals in order and does not turn the wheel.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja, V = SW.versus;
  if (!N || !N.kit) return;
  const rand = SW.rand;
  const { clan, shot, boom, dash, column, refund, pop, emit, hit, hurt, front, ahead, nearest, floorY, Later, Vis, sfx } = N;

  const EL = [
    { id: 'fire',    name: 'FIRE',    st: 'fire',  c: ['#ff6b35', '#ffd24a'], atk: { status: { burn: 3 } } },
    { id: 'wind',    name: 'WIND',    st: 'wind',  c: ['#7dffb2', '#eafff4'], atk: { kx: 7, ky: -3 } },
    { id: 'thunder', name: 'THUNDER', st: 'bolt',  c: ['#ffe066', '#ffffff'], atk: { status: { freeze: 30 }, stun: 40 } },
    { id: 'earth',   name: 'EARTH',   st: 'rock',  c: ['#c8a05a', '#6a5040'], atk: { heavy: true, ky: -6, launch: true }, mult: 1.3 },
    { id: 'water',   name: 'WATER',   st: 'water', c: ['#4cc9f0', '#ffffff'], atk: { kx: 3 }, heal: 0.05 }
  ];
  const cur = p => EL[(p.wheel || 0) % 5];
  // the element for this skill: its effects now, then the wheel turns
  function take(p) {
    const e = cur(p);
    if (e.heal) { p.heal(Math.round(p.hpMax() * e.heal)); refund(p, 25); }
    p.wheel = ((p.wheel || 0) + 1) % 5; p.wheelT = 60;
    const n = cur(p); pop(p, n.name, n.c[0]);
    return e;
  }
  // the element's effects for a hit; a push (kx) goes away from him (dir = his facing, or away from him for the ultimate)
  const atkOf = (e, dir, o) => Object.assign({}, e.atk, e.atk.kx !== undefined ? { kx: e.atk.kx * dir } : {}, o);
  // the element's own shape for a bolt
  const paintOf = e => (ctx, x, y, s) => {
    if (e.id === 'fire') { art.disc(ctx, '#ff6b35', x, y, 5); art.disc(ctx, '#ffd24a', x, y, 3); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 2); }
    else if (e.id === 'wind') { const d = Math.sign(s.vx) || 1; for (let i = -6; i <= 6; i++) art.rect(ctx, Math.abs(i) < 3 ? '#ffffff' : '#7dffb2', x + d * Math.round((36 - i * i) / 10), y + i, 2, 1); }
    else if (e.id === 'thunder') { art.rect(ctx, '#ffe066', x - 4, y - 2, 8, 4); art.rect(ctx, '#ffffff', x - 2, y - 1, 4, 2); if (s.t % 2) art.rect(ctx, '#ffffff', x + rand(-6, 6), y + rand(-5, 5), 1, 1); }
    else if (e.id === 'earth') { art.disc(ctx, '#6a5040', x, y, 5); art.disc(ctx, '#c8a05a', x - 1, y - 1, 3); }
    else { art.disc(ctx, '#4cc9f0', x, y, 5); art.rect(ctx, '#ffffff', x - 2, y - 3, 2, 2); }
  };
  const bolt = (p, z, e, dmg, o) => shot(p, z, e.st, Object.assign({ dmg: Math.round(dmg * (e.mult || 1)), vx: p.face * 7.5, life: 40, w: 12, h: 12, paint: paintOf(e), kx: (e.atk.kx || 1.5), ky: e.atk.ky, stun: e.atk.stun || 24, status: e.atk.status, heavy: e.atk.heavy }, o));
  // the villain's head (the user: 'his is the final strongest evil villain', then 'remove his crown, change it for horns'
  // and 'calm eye'): two dark curved horns through long white hair; one red eye glowing under a heavy lid (S = lid, g = glow)
  if (art.HEADS) art.HEADS.hollowcrown = ['.M.....M...', '.MM...MM...', '..MhhhMh...', 'hhhhhhhhhhh', 'HHhhssssssh', 'HHhssssSss.', 'HHhssssgss.', '.HHSsssssss', '.HHSssssss.', '..H.Sssss..'];
  if (art.HEADS) art.HEADS.fivefold = ['.h.h.h.h...', '.hhhhhhhh..', 'hhhhhhhhhh.', '.mmmmmmmmg.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'];

  clan('itsuki', {
    hero: { name: 'Itsuki', alias: 'Five Paths', title: 'Champion of the Hollow Crown', energy: 'Chi', color: '#ff2a4a', colorHi: '#ffd6de', element: 'Five elements', sig: 'The Wheel', combo: 'fist', route: 'kael', pitch: 420, trait: 'wheel', blurb: 'Five paths.\nEvery one of them ends at his feet.' },
    style: { name: 'fire' },
    moves: {
      u: { id: 'element_bolt', name: 'Element Bolt', dmg: 11, desc: 'A bolt of your current element. Every skill is cast in your current element, then the wheel turns: fire burns, wind throws far, thunder stuns, earth hits 30% harder, water heals you and closes the circle for 25 energy. Hold W: all five elements rise in a spiral.',
        cast(p, z, dmg, up) { const e = take(p); sfx(e.id === 'thunder' ? 'zap' : 'shoot'); bolt(p, z, e, dmg, { vy: up ? -4.5 : 0 }); } },
      su: { id: 'element_step', name: 'Element Step', dmg: 13, desc: 'Dash through the enemy wrapped in your current element.',
        cast(p, z, dmg) { const e = take(p); dash(p, z, e.st, { n: 12, step: 7, dmg: Math.round(dmg * (e.mult || 1)), atk: atkOf(e, p.face, { stun: e.atk.stun || 30 }) }); } },
      i: { id: 'element_pillar', name: 'Element Pillar', dmg: 20, desc: 'A pillar of your current element bursts up under the nearest enemy ahead. Smashes cracked walls.',
        cast(p, z, dmg) { const e = take(p), t = ahead(p, z, 140), x = t ? t.x : p.x + p.face * 60; sfx('charge'); column(z, e.st, x, floorY(z, x, p.y - 20), 10, Math.round(dmg * (e.mult || 1)), { w: e.id === 'earth' ? 24 : 18, h: e.id === 'wind' ? 90 : 64, spike: e.id === 'earth', cols: [e.c[0], e.c[1], '#ffffff'], atk: atkOf(e, p.face, { breaker: true }) }); if (e.id === 'thunder') z.shots.push(new Later(10, () => fx.bolt(x, G.cam.y, x, p.y, '#ffe066'))); } },
      si: { id: 'five_seals', name: 'Five Seals', dmg: 7, desc: 'Cast all five seals in order, fire, wind, thunder, earth and water, each with its own effect. The wheel stays where it is.',
        cast(p, z, dmg) { sfx('perfect'); EL.forEach((e, k) => z.shots.push(new Later(1 + k * 6, () => { if (p.dead) return; sfx(e.id === 'thunder' ? 'zap' : 'shoot'); bolt(p, z, e, dmg, { vy: (k - 2) * 0.5, life: 44 }); if (e.heal) p.heal(Math.round(p.hpMax() * 0.03)); }))); } },
      sig: { id: 'wheel_turns', name: 'The Wheel Turns', dmg: 10, desc: 'Burst your current element out all around you, and turn the wheel.',
        cast(p, z, d) { const e = take(p); for (let i = 0; i < 2; i++) fx.ring(p.x, p.y - 20, e.c[i], 6 + i * 8, 64, 14); boom(p, e.st, p.x, p.y - 20, 56, Math.round(d * (e.mult || 1)), atkOf(e, p.face)); } },
      ult: { id: 'five_calamities', name: 'Five Calamities', dmg: 10, desc: 'all five at once, one after another: fire falls, a storm wind blows, thunder strikes, the earth breaks, and the flood comes in.',
        fn(p, z, foes, dmg, h) {
          if (p.st === 6) { fx.flash('#fff1e6', 8); sfx('roar'); }
          const k = [12, 22, 32, 42, 52].indexOf(p.st);
          if (k >= 0) {
            const e = EL[k]; fx.flash(e.c[0], 4); sfx(e.id === 'thunder' ? 'zap' : e.id === 'earth' ? 'explode' : 'burst');
            for (let i = 0; i < 18; i++) emit(e.st, G.cam.x + rand(0, W), e.id === 'fire' ? G.cam.y + rand(0, 40) : p.y - rand(0, 100), 1, e.id === 'fire' ? {} : { up: e.id !== 'water' });
            if (e.id === 'earth') { fx.shake(10, 14); for (let i = 0; i < 8; i++) fx.dust(G.cam.x + rand(0, W), p.y, 2); }
            foes.forEach(t => { const b = t.box(); if (e.id === 'thunder') fx.bolt(b.x + b.w / 2, G.cam.y, b.x + b.w / 2, b.y + b.h / 2, '#ffe066'); else emit(e.st, b.x + b.w / 2, b.y + b.h / 2, 12, { power: 1.4 }); hurt(t, Math.round(dmg * (e.mult || 1)), atkOf(e, Math.sign(t.x - p.x) || p.face, { ky: (e.atk.ky || -2), stun: 34 })); });
            if (e.heal) p.heal(Math.round(p.hpMax() * 0.08));
          }
          if (p.st === 62) { fx.flash('#ffffff', 10); fx.shake(12, 18); sfx('explode'); foes.forEach(t => { const b = t.box(); EL.forEach(e => emit(e.st, b.x + b.w / 2, b.y + b.h / 2, 8, { power: 2 })); hurt(t, dmg * 4, { ky: -7, down: true, stun: 50 }); }); }
        } }
    },
    mode: ['flowing_chi', 'Flowing Chi'], awaken: ['five_fold', 'Fivefold'],
    trait: {
      tick(p) { if (p.wheelT > 0) p.wheelT--; },
      mark(ctx, p, x, y) {
        const w = (p.wheel || 0) % 5;
        art.rect(ctx, '#05060c', x - 11, y - 55, 23, 6);
        EL.forEach((e, i) => art.rect(ctx, i === w ? e.c[0] : art.shade(e.c[0], 0.35), x - 10 + i * 4 + (i > 2 ? 1 : 0), y - 54 - (i === w ? 1 : 0), 3, i === w ? 4 : 3));
      }
    },
    // the fourth J throws a burst of the current element (without turning the wheel)
    fin(p, z, d) { const e = cur(p); emit(e.st, p.x + p.face * 26, p.y - 22, 12, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 58, p.y - 36, 50, 30, Math.round(d * (e.mult || 1)), atkOf(e, p.face, { kx: (e.atk.kx || 2) * p.face, stun: e.atk.stun || 24, srcX: p.x })); },
    lines: [['Kneel. All five of them already have.', 'ひざまずけ。五つとも、もうそうした。', 'Arrodíllate. Los cinco ya lo hicieron.', '跪下。五行早已向我臣服。'], ['Fire, wind, thunder, earth, water. And then nothing.', '火、風、雷、土、水。そして、無。', 'Fuego, viento, trueno, tierra, agua. Y luego, nada.', '火、风、雷、土、水。然后，一无所有。'], ['The wheel turns for me now.', '輪は今、俺のために回る。', 'La rueda ahora gira para mí.', '如今，五行之轮只为我而转。']],
    rig: { head: 'hollowcrown', c: { skin: '#d6c6cc', hair: '#ecebf4', hairD: '#9a94b4', acc: '#a83248', accD: '#5a1424', glow: '#ff2a4a', eye: '#ff2a4a', top: '#3a1426', arm: '#2c1222', fore: '#7a1430', hand: '#d6c6cc', pants: '#1e1428', boots: '#4a0c1e', belt: '#ff2a4a', chest: '#9d4edd', trail: '#7a1fff' }, trailLen: 4 }, borrow: 'kael',
    tr: {
      'Champion of the Hollow Crown': ['Campeón de la Corona Hueca', '空冠的勇士'], 'Five paths.': ['Cinco caminos.', '五条道路。'], 'Every one of them ends at his feet.': ['Todos terminan a sus pies.', '每一条都终结在他脚下。'], 'Five elements': ['Cinco elementos', '五行'], 'The Wheel': ['La Rueda', '五行轮'], 'Fire, wind, thunder, earth, water.': ['Fuego, viento, trueno, tierra, agua.', '火、风、雷、土、水。'], 'He learned them all, in that order.': ['Los aprendió todos, en ese orden.', '他全都学会了，就按这个顺序。'],
      'Element Bolt': ['Proyectil Elemental', '元素弹'], 'A bolt of your current element. Every skill is cast in your current element, then the wheel turns: fire burns, wind throws far, thunder stuns, earth hits 30% harder, water heals you and closes the circle for 25 energy. Hold W: all five elements rise in a spiral.': ['Un proyectil de tu elemento actual. Cada habilidad usa tu elemento actual y luego la rueda gira: el fuego quema, el viento lanza lejos, el trueno aturde, la tierra pega un 30% más fuerte y el agua te cura y cierra el círculo por 25 de energía. Mantén W: los cinco elementos suben en espiral.', '一发当前元素的弹。每个技能都以当前元素施放，然后五行轮转动：火会灼烧，风把人吹远，雷会击晕，土伤害提升30%，水为你治疗并在转满一圈时返还25点能量。按住W：五行元素螺旋升起。'],
      'Element Step': ['Paso Elemental', '元素步'], 'Dash through the enemy wrapped in your current element.': ['Atraviesas al enemigo envuelto en tu elemento actual.', '裹着当前元素冲穿敌人。'],
      'Element Pillar': ['Pilar Elemental', '元素之柱'], 'A pillar of your current element bursts up under the nearest enemy ahead. Smashes cracked walls.': ['Un pilar de tu elemento actual brota bajo el enemigo más cercano delante de ti. Rompe muros agrietados.', '一根当前元素的柱子从前方最近的敌人脚下喷出。能击碎裂墙。'],
      'Five Seals': ['Cinco Sellos', '五印'], 'Cast all five seals in order, fire, wind, thunder, earth and water, each with its own effect. The wheel stays where it is.': ['Lanzas los cinco sellos en orden, fuego, viento, trueno, tierra y agua, cada uno con su efecto. La rueda no se mueve.', '按火、风、雷、土、水的顺序施放五道封印，各有各的效果。五行轮不会转动。'],
      'The Wheel Turns': ['La Rueda Gira', '轮转'], 'Burst your current element out all around you, and turn the wheel.': ['Haces estallar tu elemento actual a tu alrededor y giras la rueda.', '让当前元素在你周身爆发，然后转动五行轮。'],
      'Flowing Chi': ['Chi Fluido', '真气流转'], 'Fivefold': ['Quíntuple', '五重'], 'Five Calamities': ['Cinco Calamidades', '五大天灾'],
      'FIRE': ['FUEGO', '火'], 'WIND': ['VIENTO', '风'], 'THUNDER': ['TRUENO', '雷'], 'EARTH': ['TIERRA', '土'], 'WATER': ['AGUA', '水']
    },
    ultTr: ['las cinco a la vez, una tras otra: cae el fuego, sopla un vendaval, golpea el trueno, se rompe la tierra y llega la inundación.', '五行齐至，一个接一个：天火坠落、狂风呼啸、雷霆劈下、大地崩裂、洪水涌来。']
  });
  // ================= the strongest fighter in the game (the user's call, 2026-11-17) =================
  // "make the 5 element guy extremely overpowered ... he will be strongest character in this game". He is not balanced
  // on purpose. In Versus: 2.2x damage (skills 1.7x on top), 60% more health, a third less damage taken, faster energy, half cooldowns. His
  // melee is his own (every J hit in an element, his own S+J, W+J, air string and W+U), and he looks the part. He is
  // locked until every other locked hero is open (the user: "his goal of unlock is to unlock all previous unlock players").
  const IT = 'itsuki', P = SW.Player.prototype, CB = D.combat, vsOn = () => G.scene === 'vs';
  const isIt = p => !!(p && p.G && p.G.state && p.G.state.hero === IT);
  if (V && V.tune) V.tune.itsuki = 2.2;
  const _hp = P.hpMax; P.hpMax = function () { const v = _hp.apply(this, arguments); return vsOn() && isIt(this) ? Math.round(v * 1.6) : v; };
  const _th = P.takeHit; P.takeHit = function (atk, g) { if (vsOn() && isIt(this) && atk && atk.dmg) atk = Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * 0.65)) }); return _th.apply(this, [atk].concat([].slice.call(arguments, 1))); };
  ['element_bolt', 'element_step', 'element_pillar', 'five_seals', 'wheel_turns', 'five_calamities'].forEach(id => { if (D.abilities[id]) D.abilities[id].dmg = Math.round(D.abilities[id].dmg * 1.7); });
  if (SW.moves && SW.moves.CD_FOR && SW.moves.CD) [['element_bolt', 'u'], ['element_step', 'su'], ['element_pillar', 'i'], ['five_seals', 'si']].forEach(([id, s]) => { SW.moves.CD_FOR[id] = Math.round((SW.moves.CD_FOR[id] || SW.moves.CD[s] || 60) * 0.5); });

  // ---------- his own melee ----------
  // the J chain: harder, longer and taller, each hit in an element (fire, wind, thunder, earth)
  const CI = CB['clan_' + IT];
  if (CI) CI.forEach((a, i) => { a.dmg = Math.round(a.dmg * 1.5); a.box = [a.box[0], a.box[1] - 6, a.box[2] + 14, a.box[3] + 8]; a.itsEl = i % 5; a.itsMove = 'j'; });
  const LAUNCH = Object.assign({}, CB.launcher, { dmg: 14, box: [0, -60, 44, 60], stun: 50, itsMove: 'launcher' });                 // W+J: a rising pillar of his element
  const SWEEP = Object.assign({}, CB.sweep, { dmg: 13, box: [2, -16, 66, 16], stun: 46, itsMove: 'sweep' });                       // S+J: a wave of earth along the floor
  const AIRS = CB.air.map((a, i) => Object.assign({}, a, { dmg: Math.round(a.dmg * 1.6), box: [-4, -54, (a.box[2] || 32) + 14, 56], itsMove: 'air' + i, itsEl: [1, 2, 3][i] }));   // wind, thunder, earth crash
  const _sa = P.startAttack;
  P.startAttack = function (def, air) {
    if (!isIt(this)) return _sa.apply(this, arguments);
    const k = CB.air.indexOf(def);
    def = def === CB.launcher ? LAUNCH : def === CB.sweep ? SWEEP : k >= 0 ? AIRS[k] : def;
    const r = _sa.call(this, def, air);
    this.itsFx = false;   // the element burst fires once per swing, on its first hit
    const el = EL[def.itsMove === 'launcher' || def.itsMove === 'sweep' ? ((this.wheel || 0) % 5) : (def.itsEl || 0) % 5];
    fx.slash(this.x + this.face * 16, this.y - (def.itsMove === 'sweep' ? 8 : 24), this.face, (def.slash || 1), el.c[0], 46);
    return r;
  };
  // the bursts on a hit: J hits throw their element, the launcher raises a pillar, the sweep sends a wave, the air string crackles and crashes
  function meleeHit(p, e) {
    const a = p.atk, z = p.G.zone; if (!a || !a.itsMove || p.itsFx || (p.state !== 'attack' && p.state !== 'airatk')) return;
    p.itsFx = true;
    const b = e.box ? e.box() : { x: e.x - 7, y: e.y - 30, w: 14, h: 30 }, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    if (a.itsMove === 'launcher') {
      const el = cur(p); emit(el.st, cx, cy + 10, 16, { up: true, power: 1.6 }); fx.ring(cx, cy, el.c[0], 6, 46, 12); sfx('burst');
      column(z, el.st, e.x, floorY(z, e.x, p.y - 20), 2, 4, { w: 24, h: 96, atk: { ky: -7.4, launch: true, stun: 50 } });
    } else if (a.itsMove === 'sweep') {
      emit('rock', cx, b.y + b.h, 14, { dir: p.face, power: 1.4 }); fx.shake(4, 8); fx.dust(cx, b.y + b.h, 8); sfx('heavy');
      for (let k = 1; k <= 3; k++) z.shots.push(new Later(k * 5, () => { const x = p.x + p.face * (40 + k * 26); emit('rock', x, p.y - 4, 6, { up: true }); fx.dust(x, p.y, 4); hit(x - 14, p.y - 22, 28, 22, 4, { ky: -3.4, kx: p.face * 1, stun: 34, down: true, srcX: p.x }); }));
    } else {
      const el = EL[(a.itsEl || 0) % 5];
      emit(el.st, cx, cy, 12, { dir: p.face, power: 1.3 }); fx.ring(cx, cy, el.c[0], 4, 30, 10);
      if (el.id === 'thunder') fx.bolt(cx, G.cam.y, cx, cy, '#ffe066');
      if (a.itsMove === 'air2') { fx.shake(6, 10); sfx('explode'); boom(p, 'rock', cx, cy + 10, 40, 6, { ky: 4, stun: 30, down: true }); }
    }
  }
  // W+U: a rising spiral of all five elements, one after another
  function risingFive(p, z, dmg) {
    sfx('perfect'); fx.ring(p.x, p.y - 20, '#fff1e6', 6, 50, 12);
    EL.forEach((el, k) => z.shots.push(new Later(1 + k * 4, () => { if (p.dead) return; sfx(el.id === 'thunder' ? 'zap' : 'shoot');
      shot(p, z, el.st, { dmg: Math.round(dmg * 0.7 * (el.mult || 1)), x: p.x + p.face * 10, y: p.y - 16, vx: p.face * (3.6 + Math.sin(k * 1.3) * 0.8), vy: -4.4 - k * 0.35, life: 48, w: 14, h: 14,
        paint: paintOf(el), kx: 1, ky: k === 4 ? -7 : -4.5, stun: 34, status: el.atk.status, launch: k === 4 }); })));
  }
  // element_bolt with W held is the spiral now
  const ub = D.abilities.element_bolt && SW.casts && SW.casts.element_bolt;
  if (ub) SW.casts.element_bolt = function (p, z, dmg, up) { if (up) { take(p); return risingFive(p, z, dmg); } return ub.apply(this, arguments); };

  // ---------- how he looks: five orbs circle him, his strikes leave afterimages in his element ----------
  const T0 = N.TRAITS && N.TRAITS.wheel;
  if (T0) {
    const t0 = T0.tick, m0 = T0.mark;
    T0.hit = function (p, atk, e) { if (e && !e.dead) meleeHit(p, e); };
    T0.tick = function (p, g, z) {
      if (t0) t0.apply(this, arguments);
      if (vsOn() && SW.frame % 10 === 0) refund(p, 1.5);   // chi flows back on its own
      // the villain: crimson and violet afterimages on every strike, dark smoke always rising off him
      if ((p.state === 'attack' || p.state === 'airatk') && p.atk && p.atk.itsMove && SW.frame % 3 === 0) fx.ghost(p.sheet(), p.pose ? p.pose[0] : p.atk.anim, p.pose ? p.pose[1] : 1, p.x, p.y, p.face < 0, SW.frame % 6 < 3 ? '#ff2a4a' : '#7a1fff');
      if (!p.dead && SW.frame % 3 === 0) fx.list.push({ k: 'p', x: p.x + rand(-9, 9), y: p.y - rand(0, 8), vx: rand(-0.3, 0.3), vy: -rand(0.5, 1.2), g: 0, life: 28, max: 28, col: SW.frame % 15 === 0 ? '#ff2a4a' : SW.frame % 9 === 0 ? '#3a0a28' : '#120814', s: 3 });
    };
    T0.mark = function (ctx, p, x, y, g) {
      if (m0) m0.apply(this, arguments);
      const t = SW.frame * 0.06, w = (p.wheel || 0) % 5;
      art.glow(ctx, x, y - 20, 30, '#ff2a4a', 0.06 + 0.03 * Math.sin(SW.frame * 0.08));   // a red menace about him
      // the five elements, corrupted, turn above his head like a hollow crown: dark cores ringed in their colour, the
      // current one larger; the ones passing behind him are dimmer (they used to circle his body and hid the sprite)
      EL.forEach((e, i) => { const a = t + i * 1.2566, ox = Math.round(Math.cos(a) * 13), oy = Math.round(Math.sin(a) * 3), big = i === w, r = big ? 3 : 2, back = Math.sin(a) < 0;
        ctx.globalAlpha = back ? 0.5 : 1;
        art.disc(ctx, '#0a0610', x + ox, y - 46 + oy, r); art.ring(ctx, e.c[0], x + ox, y - 46 + oy, r);
        if (big) art.rect(ctx, '#ff2a4a', x + ox, y - 46 + oy, 1, 1);
        ctx.globalAlpha = 1; });
    };
  }

  // ---------- the lock: open only when every other locked hero is open ----------
  const _lk = SW.lockedVs;
  const othersLocked = () => (_lk ? D.heroOrder.filter(h => h !== IT && _lk(h)).length : 0);
  if (_lk) SW.lockedVs = id => (id === IT ? othersLocked() > 0 || _lk(IT) : _lk(id));
  if (V && V.draw) {
    const _vd = V.draw; V.draw = function (ctx, g) {
      _vd.apply(this, arguments);
      if (V.phase !== 'pick' || !V.pick || D.heroOrder[V.pick[V.step]] !== IT || !SW.lockedVs || !SW.lockedVs(IT)) return;
      const n = othersLocked(), text = SW.text, ui = SW.ui;
      ui.panel(ctx, 6, 230, W - 12, 34, '#f4a261', 0.97);
      text(ctx, 'ITSUKI - THE STRONGEST - LOCKED', 12, 234, '#f4a261');
      text(ctx, n > 0 ? 'Unlock every other hero first. Still locked: {0}'.replace('{0}', n) : 'Unlock every other hero first.', 12, 244, '#ffffff');
      text(ctx, 'A D W S: choose another', 12, 254, '#8a92b8');
    };
  }
  if (SW.i18n && SW.i18n.add) {
    SW.i18n.add('es', { 'ITSUKI - THE STRONGEST - LOCKED': 'ITSUKI - EL MÁS FUERTE - BLOQUEADO', 'Unlock every other hero first. Still locked: {0}': 'Desbloquea primero a todos los demás héroes. Aún bloqueados: {0}', 'Unlock every other hero first.': 'Desbloquea primero a todos los demás héroes.' });
    SW.i18n.add('zh', { 'ITSUKI - THE STRONGEST - LOCKED': 'ITSUKI·最强者·未解锁', 'Unlock every other hero first. Still locked: {0}': '先解锁其他所有英雄。仍未解锁：{0}', 'Unlock every other hero first.': '先解锁其他所有英雄。' });
  }
})();
