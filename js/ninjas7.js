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
  if (art.HEADS) art.HEADS.fivefold = ['.h.h.h.h...', '.hhhhhhhh..', 'hhhhhhhhhh.', '.mmmmmmmmg.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'];

  clan('itsuki', {
    hero: { name: 'Itsuki', alias: 'Five Paths', title: 'Master of Five', energy: 'Chi', color: '#f4a261', colorHi: '#fff1e6', element: 'Five elements', sig: 'The Wheel', combo: 'fist', route: 'kael', pitch: 420, trait: 'wheel', blurb: 'Fire, wind, thunder, earth, water.\nHe learned them all, in that order.' },
    style: { name: 'fire' },
    moves: {
      u: { id: 'element_bolt', name: 'Element Bolt', dmg: 11, desc: 'A bolt of your current element. Every skill is cast in your current element, then the wheel turns: fire burns, wind throws far, thunder stuns, earth hits 30% harder, water heals you and closes the circle for 25 energy. Hold W to aim up.',
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
    lines: [['Five paths. One end.', '五つの道、ひとつの終わり。', 'Cinco caminos. Un final.', '五条道路，一个终点。'], ['Fire, wind, thunder, earth, water. Done.', '火、風、雷、土、水。終わりだ。', 'Fuego, viento, trueno, tierra, agua. Hecho.', '火、风、雷、土、水。结束了。'], ['The wheel always turns.', '輪は必ず回る。', 'La rueda siempre gira.', '轮回从不停歇。']],
    rig: { head: 'fivefold', c: { skin: '#e0b090', hair: '#1a1a24', acc: '#ff6b35', glow: '#4cc9f0', top: '#2b2d42', arm: '#2b2d42', fore: '#f4a261', hand: '#e0b090', pants: '#1a1a24', boots: '#7dffb2', belt: '#ffe066', chest: '#4cc9f0', trail: '#c8a05a' }, trailLen: 4 }, borrow: 'kael',
    tr: {
      'Master of Five': ['Maestro de los Cinco', '五行宗师'], 'Five elements': ['Cinco elementos', '五行'], 'The Wheel': ['La Rueda', '五行轮'], 'Fire, wind, thunder, earth, water.': ['Fuego, viento, trueno, tierra, agua.', '火、风、雷、土、水。'], 'He learned them all, in that order.': ['Los aprendió todos, en ese orden.', '他全都学会了，就按这个顺序。'],
      'Element Bolt': ['Proyectil Elemental', '元素弹'], 'A bolt of your current element. Every skill is cast in your current element, then the wheel turns: fire burns, wind throws far, thunder stuns, earth hits 30% harder, water heals you and closes the circle for 25 energy. Hold W to aim up.': ['Un proyectil de tu elemento actual. Cada habilidad usa tu elemento actual y luego la rueda gira: el fuego quema, el viento lanza lejos, el trueno aturde, la tierra pega un 30% más fuerte y el agua te cura y cierra el círculo por 25 de energía. Mantén W para apuntar arriba.', '一发当前元素的弹。每个技能都以当前元素施放，然后五行轮转动：火会灼烧，风把人吹远，雷会击晕，土伤害提升30%，水为你治疗并在转满一圈时返还25点能量。按住W向上瞄准。'],
      'Element Step': ['Paso Elemental', '元素步'], 'Dash through the enemy wrapped in your current element.': ['Atraviesas al enemigo envuelto en tu elemento actual.', '裹着当前元素冲穿敌人。'],
      'Element Pillar': ['Pilar Elemental', '元素之柱'], 'A pillar of your current element bursts up under the nearest enemy ahead. Smashes cracked walls.': ['Un pilar de tu elemento actual brota bajo el enemigo más cercano delante de ti. Rompe muros agrietados.', '一根当前元素的柱子从前方最近的敌人脚下喷出。能击碎裂墙。'],
      'Five Seals': ['Cinco Sellos', '五印'], 'Cast all five seals in order, fire, wind, thunder, earth and water, each with its own effect. The wheel stays where it is.': ['Lanzas los cinco sellos en orden, fuego, viento, trueno, tierra y agua, cada uno con su efecto. La rueda no se mueve.', '按火、风、雷、土、水的顺序施放五道封印，各有各的效果。五行轮不会转动。'],
      'The Wheel Turns': ['La Rueda Gira', '轮转'], 'Burst your current element out all around you, and turn the wheel.': ['Haces estallar tu elemento actual a tu alrededor y giras la rueda.', '让当前元素在你周身爆发，然后转动五行轮。'],
      'Flowing Chi': ['Chi Fluido', '真气流转'], 'Fivefold': ['Quíntuple', '五重'], 'Five Calamities': ['Cinco Calamidades', '五大天灾'],
      'FIRE': ['FUEGO', '火'], 'WIND': ['VIENTO', '风'], 'THUNDER': ['TRUENO', '雷'], 'EARTH': ['TIERRA', '土'], 'WATER': ['AGUA', '水']
    },
    ultTr: ['las cinco a la vez, una tras otra: cae el fuego, sopla un vendaval, golpea el trueno, se rompe la tierra y llega la inundación.', '五行齐至，一个接一个：天火坠落、狂风呼啸、雷霆劈下、大地崩裂、洪水涌来。']
  });
  // Versus balance (versus.js V.tune), fitted with tools/versus-balance.js against the fifteen regular heroes, both sides, bots on Normal: untuned 43%, with this table about 48%.
  if (SW.versus && SW.versus.tune) Object.assign(SW.versus.tune, { itsuki: 1.09 });
})();
