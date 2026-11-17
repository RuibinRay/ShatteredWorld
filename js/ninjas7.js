'use strict';
// Shattered Worlds — Hidden Clans: Itsuki, master of the five elements (Versus only; registered with ninja-kit.js). An original character.
//   Five skills, one element each (the user, 2026-11-16): U fire, S+U wind, I thunder, S+I earth, W+O water.
//   His own moves that never go on cooldown: W+U (the five rise in a spiral), J > U (Burning Fist), J > I (Thunder Palm).
//   S+O opens the five gates: for 10 s nothing he uses goes on cooldown and the elements fire on their own.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja, V = SW.versus;
  if (!N || !N.kit) return;
  const rand = SW.rand;
  const { clan, shot, boom, dash, column, refund, pop, emit, hit, hurt, front, ahead, nearest, floorY, Later, Vis, sfx } = N;
  const I = SW.input;

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
  // ================= his five skills, one element each =================
  // (the user, 2026-11-16: "the five moves each is one elemnt attack but overpowered"). The crown over his head lights the
  // element he used last (p.wheel); the J chain, the launcher and the sweep take their colour from it.
  const lit = (p, k) => { p.wheel = k; p.wheelT = 60; pop(p, EL[k].name, EL[k].c[0]); };
  // a swirling funnel of wind, k = opacity, tall = rows of 3 px
  function funnel(ctx, x, y, t, k, tall) {
    for (let j = 0; j < tall; j++) {
      const hy = y - j * 3, w = 6 + j * 1.6, a = t * 0.55 + j * 0.32, sx = Math.round(Math.sin(t * 0.2 + j * 0.15) * j * 0.25);
      ctx.globalAlpha = 0.18 * k; art.rect(ctx, '#7dffb2', Math.round(x + sx - w / 2), hy, Math.round(w), 2);
      ctx.globalAlpha = 0.9 * k;
      art.rect(ctx, j % 4 ? '#7dffb2' : '#eafff4', Math.round(x + sx + Math.cos(a) * w / 2) - 2, hy, 4, 2);
      art.rect(ctx, '#3fbf86', Math.round(x + sx + Math.cos(a + Math.PI) * w / 2) - 1, hy, 3, 2);
    }
    ctx.globalAlpha = 1;
  }
  const ROCK = ['#c8a05a', '#6a5040', '#fff1e6'];
  // a cyclone at x: it lifts whoever is in it three times, then the storm throws them toward dir
  function cyclone(p, z, dmg, x, dir) {
    const gy = floorY(z, x, p.y - 20); sfx('burst');
    N.area(p, z, 'wind', { x, y: gy, w: 48, h: 90, life: 44, every: 10, dmg: Math.round(dmg * 0.4), atk: { kx: 0, ky: -2.6, stun: 34 }, n: 2,
      paint: (ctx, sx, sy, t, v, a) => funnel(ctx, sx, sy, t, a, 30) });
    z.shots.push(new Later(40, () => { hit(x - 34, gy - 90, 68, 90, Math.round(dmg * 0.9), { kx: dir * 9, ky: -5, stun: 46, heavy: true, srcX: x - dir * 30 }); fx.ring(x, gy - 40, '#eafff4', 6, 60, 14); emit('wind', x, gy - 40, 16, { dir, power: 1.8 }); sfx('burst'); }));
  }
  SW.itsukiKit = { funnel, cyclone };   // js/itsuki-edge.js draws the storm grab with these
  const S5 = {
    // U, fire: three fireballs in a fan; each bursts into flame where it lands
    fire(p, z, dmg) {
      const e = EL[0]; lit(p, 0); sfx('shoot'); fx.ring(p.x + p.face * 14, p.y - 22, e.c[0], 4, 26, 10); emit('fire', p.x + p.face * 16, p.y - 22, 10, { dir: p.face });
      [-1.1, 0, 1.1].forEach((vy, k) => z.shots.push(new Later(1 + k * 3, () => { if (p.dead) return; sfx('shoot');
        shot(p, z, 'fire', { dmg: Math.round(dmg * 0.7), vx: p.face * 7.6, vy, life: 46, w: 14, h: 14, paint: paintOf(e), kx: 2, ky: -2, stun: 30, status: { burn: 4 },
          onEnd() { boom(p, 'fire', this.x, this.y, 30, Math.round(dmg * 0.5), { status: { burn: 4 }, kx: p.face * 2, ky: -3, stun: 30 }); fx.ring(this.x, this.y, '#ffd24a', 4, 40, 12); } }); })));
    },
    // S+U, wind. In Versus it is Storm Seize (js/itsuki-edge.js): the rush seizes whoever it reaches; a rush that reaches
    // no one leaves this cyclone where he stops. Elsewhere (no Versus) he dashes through and leaves the cyclone behind.
    wind(p, z, dmg) {
      lit(p, 1);
      dash(p, z, 'wind', { n: 14, step: 8, every: 5, dmg: Math.round(dmg * 0.45), atk: { kx: p.face * 1.5, ky: -1.5, stun: 34 }, end(q, zz) { cyclone(q, zz, dmg, q.x - q.face * 30, -q.face); } });
    },
    // I, thunder: lightning strikes the nearest enemy ahead three times, then one great bolt
    thunder(p, z, dmg) {
      lit(p, 2); sfx('charge');
      const t0 = ahead(p, z, 240), at = () => (t0 && !t0.dead ? t0.x : p.x + p.face * 90);
      [6, 13, 20].forEach(d => z.shots.push(new Later(d, () => { const x = at(), gy = floorY(z, x, p.y - 20);
        fx.bolt(x + rand(-30, 30), G.cam.y, x, gy - 10, '#ffe066'); fx.bolt(x + rand(-30, 30), G.cam.y, x, gy - 10, '#ffffff'); fx.flash('#ffffff', 2); sfx('zap'); emit('bolt', x, gy - 20, 8, { up: true });
        hit(x - 16, gy - 84, 32, 84, Math.round(dmg * 0.45), { stun: 32, status: { freeze: 10 }, ky: -1.5, srcX: x, breaker: true }); })));
      z.shots.push(new Later(30, () => { const x = at(), gy = floorY(z, x, p.y - 20);
        for (let i = 0; i < 4; i++) fx.bolt(x + rand(-50, 50), G.cam.y, x + rand(-4, 4), gy - 6, i % 2 ? '#ffffff' : '#ffe066');
        fx.flash('#ffffff', 5); fx.shake(8, 12); sfx('explode'); fx.ring(x, gy - 30, '#ffe066', 6, 70, 16); fx.ring(x, gy - 30, '#ffffff', 4, 44, 12);
        hit(x - 30, gy - 96, 60, 96, Math.round(dmg * 1.1), { stun: 54, status: { freeze: 30 }, ky: -4, heavy: true, srcX: x, breaker: true }); }));
    },
    // S+I, earth: a row of stone fangs tears out of the ground toward the enemy; the last is a mountain that throws them up
    earth(p, z, dmg) {
      lit(p, 3); sfx('heavy'); fx.shake(4, 10);
      const t0 = ahead(p, z, 220), dir = p.face, x0 = p.x, far = t0 ? Math.abs(t0.x - x0) : 150, n = 5, gap = Math.max(18, Math.min(34, (far - 20) / n));
      for (let k = 0; k < n; k++) { const x = x0 + dir * (24 + k * gap); column(z, 'rock', x, floorY(z, x, p.y - 20), 3 + k * 4, Math.round(dmg * 0.6), { w: 16, h: 34 + k * 6, spike: true, cols: ROCK, atk: { ky: -3, stun: 36, heavy: true } }); }
      const xb = t0 && !t0.dead ? t0.x : x0 + dir * (24 + n * gap);
      column(z, 'rock', xb, floorY(z, xb, p.y - 20), 26, Math.round(dmg * 2.2), { w: 34, h: 110, spike: true, cols: ROCK, atk: { ky: -8, launch: true, stun: 60, heavy: true, breaker: true } });
      z.shots.push(new Later(26, () => { fx.shake(12, 16); fx.flash('#c8a05a', 3); }));
    },
    // W+O, water: a wave breaks out on both sides of him and sweeps everything away; he heals 10% and gets 25 energy back
    water(p, z, dmg) {
      lit(p, 4); sfx('burst'); p.heal(Math.round(p.hpMax() * 0.1)); refund(p, 25); fx.ring(p.x, p.y - 20, '#4cc9f0', 6, 50, 14); fx.ring(p.x, p.y - 20, '#ffffff', 4, 30, 10);
      [-1, 1].forEach(dir => { const hs = new Set(), gy = p.y, x0 = p.x;
        z.shots.push(new Vis(x0, gy, 30, (ctx, sx, sy, t) => {
          const k = Math.min(1, t / 4, (30 - t) / 6), hgt = Math.round(52 * k);
          for (let i = 0; i < 26; i += 2) { const hh = Math.max(0, Math.round(hgt * (1 - i / 30) + Math.sin(t * 0.6 + i) * 2)), xx = sx - dir * i;
            art.rect(ctx, '#0f4c75', xx, sy - hh, 2, hh); art.rect(ctx, '#1b6e9e', xx, sy - hh, 2, Math.round(hh * 0.5)); art.rect(ctx, i < 6 ? '#ffffff' : '#4cc9f0', xx, sy - hh - 2, 2, 3); }
          if (t % 2 === 0) art.rect(ctx, '#eafcff', sx + dir * 2, sy - hgt - 4, 2, 2);
        }, v => { v.x = x0 + dir * v.t * 6; if (v.t % 2 === 0) emit('water', v.x, gy - 20, 2, { up: true });
          hit(v.x - 14, gy - 54, 28, 54, Math.round(dmg * 1.4), { hitSet: hs, kx: dir * 6, ky: -3.4, stun: 40, heavy: true, srcX: v.x - dir * 20 }); })); });
    }
  };

  // the villain's head (the user: 'his is the final strongest evil villain', then 'remove his crown, change it for horns'
  // and 'calm eye'): two dark curved horns through long white hair; one red eye glowing under a heavy lid (S = lid, g = glow)
  if (art.HEADS) art.HEADS.hollowcrown = ['.M.....M...', '.MM...MM...', '..MhhhMh...', 'hhhhhhhhhhh', 'HHhhssssssh', 'HHhssssSss.', 'HHhssssgss.', '.HHSsssssss', '.HHSssssss.', '..H.Sssss..'];
  if (art.HEADS) art.HEADS.fivefold = ['.h.h.h.h...', '.hhhhhhhh..', 'hhhhhhhhhh.', '.mmmmmmmmg.', '.Hhhsssss..', '.Hhsssesss.', '.Hssssesss.', '..Sssssssss', '..Sssssss..', '...Sssss...'];

  clan('itsuki', {
    hero: { name: 'Itsuki', alias: 'Five Paths', title: 'Champion of the Hollow Crown', energy: 'Chi', color: '#ff2a4a', colorHi: '#ffd6de', element: 'Five elements', sig: 'The Wheel', combo: 'fist', route: 'kael', pitch: 420, trait: 'wheel', blurb: 'Five paths.\nEvery one of them ends at his feet.' },
    style: { name: 'fire' },
    moves: {
      u: { id: 'element_bolt', name: 'Hellfire', dmg: 11, desc: 'Three fireballs in a fan. Each bursts into flame and sets the enemy burning.',
        cast(p, z, dmg, up) { if (up) return risingFive(p, z, dmg); S5.fire(p, z, dmg); } },
      su: { id: 'element_step', name: 'Storm Seize', dmg: 13, desc: 'He rushes in inside a cyclone. In Versus whoever it reaches is seized by the storm: no guard, perfect block or break gets them out, wind blades cut them five times and the storm throws them away. If it reaches no one, the cyclone forms where he stops.',
        cast(p, z, dmg) { S5.wind(p, z, dmg); } },
      i: { id: 'element_pillar', name: "Heaven's Thunder", dmg: 20, desc: 'Lightning strikes the nearest enemy ahead three times, then one great bolt stuns them. Smashes cracked walls.',
        cast(p, z, dmg) { S5.thunder(p, z, dmg); } },
      si: { id: 'five_seals', name: 'Mountain Fang', dmg: 10, desc: 'A row of stone fangs tears out of the ground toward the enemy. The last one is a mountain that throws them into the air.',
        cast(p, z, dmg) { S5.earth(p, z, dmg); } },
      sig: { id: 'wheel_turns', name: 'Great Flood', dmg: 10, desc: 'A wave breaks out on both sides of him and sweeps everything away. Heals him 10% and gives back 25 energy. Half the usual cooldown.',
        cast(p, z, d) { S5.water(p, z, d); } },
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
      'Hellfire': ['Fuego Infernal', '地狱火'], 'Three fireballs in a fan. Each bursts into flame and sets the enemy burning.': ['Tres bolas de fuego en abanico. Cada una estalla en llamas y deja al enemigo ardiendo.', '扇形射出三颗火球，每颗都会爆成烈焰，让敌人燃烧。'],
      'Storm Seize': ['Captura de la Tormenta', '风暴擒拿'], 'He rushes in inside a cyclone. In Versus whoever it reaches is seized by the storm: no guard, perfect block or break gets them out, wind blades cut them five times and the storm throws them away. If it reaches no one, the cyclone forms where he stops.': ['Se lanza dentro de un ciclón. En Versus, a quien alcanza lo atrapa la tormenta: ni la guardia, ni el bloqueo perfecto, ni zafarse lo libran; cinco cuchillas de viento lo cortan y la tormenta lo lanza lejos. Si no alcanza a nadie, el ciclón se forma donde se detiene.', '他裹在旋风中突进。在对战中，被冲锋碰到的人会被风暴擒住：防御、完美格挡和挣脱都救不了他，五道风刃将其斩中，最后风暴把他甩飞。如果没碰到任何人，旋风会在他停下的地方成形。'],
      "Heaven's Thunder": ['Trueno del Cielo', '天雷'], 'Lightning strikes the nearest enemy ahead three times, then one great bolt stuns them. Smashes cracked walls.': ['Un rayo golpea tres veces al enemigo más cercano delante de él y luego un gran rayo lo aturde. Rompe muros agrietados.', '闪电三次劈向前方最近的敌人，最后一道巨雷将其击晕。能击碎裂墙。'],
      'Mountain Fang': ['Colmillo de Montaña', '山之牙'], 'A row of stone fangs tears out of the ground toward the enemy. The last one is a mountain that throws them into the air.': ['Una hilera de colmillos de piedra brota del suelo hacia el enemigo. El último es una montaña que lo lanza por los aires.', '一排石牙破土而出冲向敌人，最后一根是一座山，把敌人掀上半空。'],
      'Great Flood': ['Gran Diluvio', '大洪水'], 'A wave breaks out on both sides of him and sweeps everything away. Heals him 10% and gives back 25 energy. Half the usual cooldown.': ['Una ola rompe a ambos lados de él y lo barre todo. Lo cura un 10% y devuelve 25 de energía. La mitad del enfriamiento normal.', '巨浪在他两侧涌出，卷走一切。为他恢复10%生命并返还25点能量。冷却时间减半。'],
      'Rising Five': ['Los Cinco Ascienden', '五行升腾'], 'All five elements rise in a spiral and throw the enemy up. Never goes on cooldown.': ['Los cinco elementos suben en espiral y lanzan al enemigo hacia arriba. Nunca entra en enfriamiento.', '五行元素螺旋升起，把敌人抛上天。没有冷却。'],
      'Burning Fist': ['Puño Ardiente', '焚拳'], 'Cancel a J that hit into U: a rush wrapped in fire that ends in a blazing uppercut. Never goes on cooldown.': ['Cancela un J que acertó con U: una embestida envuelta en fuego que acaba en un gancho ardiente. Nunca entra en enfriamiento.', '在J命中后接U：裹着火焰的突进，以一记烈焰上勾拳收尾。没有冷却。'],
      'Thunder Palm': ['Palma del Trueno', '雷掌'], 'Cancel a J that hit into I: an open palm that calls lightning down on what it touched. Never goes on cooldown.': ['Cancela un J que acertó con I: una palma abierta que hace caer un rayo sobre lo que tocó. Nunca entra en enfriamiento.', '在J命中后接I：一记掌击，召来落雷劈向被击中的敌人。没有冷却。'],
      'Five Gates': ['Cinco Puertas', '五门'], 'For 10 s: +30% damage, nothing he uses goes on cooldown, and the five elements fire at the enemy on their own.': ['Durante 10 s: +30% de daño, nada de lo que usa entra en enfriamiento y los cinco elementos disparan solos al enemigo.', '持续10秒：伤害+30%，他使用的任何招式都没有冷却，五行元素还会自动射向敌人。'],
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
      column(z, el.st, e.x, floorY(z, e.x, p.y - 20), 2, 7, { w: 30, h: 112, cols: [el.c[0], el.c[1], '#ffffff'], atk: { ky: -7.6, launch: true, stun: 56 } });
      fx.bolt(cx + rand(-16, 16), G.cam.y, cx, cy, '#ffe066'); fx.ring(cx, cy, '#ff2a4a', 8, 56, 14);
    } else if (a.itsMove === 'sweep') {
      emit('rock', cx, b.y + b.h, 14, { dir: p.face, power: 1.4 }); fx.shake(4, 8); fx.dust(cx, b.y + b.h, 8); sfx('heavy');
      for (let k = 1; k <= 4; k++) z.shots.push(new Later(k * 4, () => { const x = p.x + p.face * (36 + k * 24), last = k === 4; emit('rock', x, p.y - 4, last ? 14 : 6, { up: true, power: last ? 1.6 : 1 }); fx.dust(x, p.y, 4);
        if (last) { fx.ring(x, p.y - 16, '#c8a05a', 4, 34, 12); fx.shake(5, 8); sfx('heavy'); }
        hit(x - 16, p.y - (last ? 40 : 24), 32, last ? 40 : 24, last ? 7 : 5, last ? { ky: -7, kx: p.face * 1, stun: 50, launch: true, srcX: p.x } : { ky: -3.4, kx: p.face * 1, stun: 40, down: true, srcX: p.x }); }));
    } else {
      const el = EL[(a.itsEl || 0) % 5];
      emit(el.st, cx, cy, 12, { dir: p.face, power: 1.3 }); fx.ring(cx, cy, el.c[0], 4, 30, 10);
      if (el.id === 'thunder') fx.bolt(cx, G.cam.y, cx, cy, '#ffe066');
      if (a.itsMove === 'j') {   // every J lands its element too
        p.itsJ = SW.frame;
        if (el.id === 'fire') hurt(e, 3, { status: { burn: 3 }, stun: 24, ky: -1 });
        else if (el.id === 'wind') { hurt(e, 3, { kx: p.face * 1.5, ky: -2, stun: 24 }); fx.ring(cx, cy, '#eafff4', 8, 26, 8); }
        else if (el.id === 'thunder') hurt(e, 3, { stun: 30, status: { freeze: 8 } });
        else if (el.id === 'earth') { hurt(e, 4, { ky: -2, stun: 28 }); fx.dust(cx, b.y + b.h, 6); fx.shake(3, 5); }
        else p.heal(Math.round(p.hpMax() * 0.015));
      }
      if (a.itsMove === 'air2') { fx.shake(6, 10); sfx('explode'); boom(p, 'rock', cx, cy + 10, 40, 6, { ky: 4, stun: 30, down: true }); }
    }
  }
  // W+U: a rising spiral of all five elements, one after another
  function risingFive(p, z, dmg) {
    lit(p, 4); sfx('perfect'); fx.ring(p.x, p.y - 20, '#fff1e6', 6, 50, 12);
    EL.forEach((el, k) => z.shots.push(new Later(1 + k * 4, () => { if (p.dead) return; sfx(el.id === 'thunder' ? 'zap' : 'shoot');
      shot(p, z, el.st, { dmg: Math.round(dmg * 0.9 * (el.mult || 1)), x: p.x + p.face * 10, y: p.y - 16, vx: p.face * (3.6 + Math.sin(k * 1.3) * 0.8), vy: -4.4 - k * 0.35, life: 48, w: 14, h: 14,
        paint: paintOf(el), kx: 1, ky: k === 4 ? -7 : -4.5, stun: 34, status: el.atk.status, launch: k === 4 }); })));
  }
  // J > U: Burning Fist. A rush wrapped in fire that ends in a blazing uppercut.
  function burningFist(p, z, dmg) {
    lit(p, 0); sfx('dash');
    dash(p, z, 'fire', { n: 8, step: 6, dmg: Math.round(dmg * 0.6), atk: { kx: p.face * 1, ky: -1, stun: 34, status: { burn: 3 } }, end(q, zz) {
      const x = q.x + q.face * 22, y = q.y - 24;
      boom(q, 'fire', x, y, 34, Math.round(dmg * 1.1), { ky: -7.2, launch: true, stun: 50, status: { burn: 4 }, kx: q.face * 1 });
      fx.slash(q.x + q.face * 16, q.y - 30, q.face, 1, '#ffd24a', 52); fx.ring(x, y, '#ff6b35', 6, 50, 14); fx.flash('#ff6b35', 2);
    } });
  }
  // J > I: Thunder Palm. An open palm, then lightning comes down on whatever it touched.
  function thunderPalm(p, z, dmg) {
    lit(p, 2); sfx('zap');
    hit(...front(p, 46, 40, 6), Math.round(dmg * 0.8), { kx: p.face * 2.5, ky: -2, stun: 56, status: { freeze: 24 }, heavy: true, srcX: p.x });
    const x = p.x + p.face * 30; fx.ring(x, p.y - 22, '#ffe066', 4, 36, 12); emit('bolt', x, p.y - 22, 12, { dir: p.face, power: 1.4 }); fx.slash(x, p.y - 24, p.face, 1, '#ffffff', 40);
    z.shots.push(new Later(6, () => { const t = ahead(p, z, 100), tx = t ? t.x : x + p.face * 20, gy = floorY(z, tx, p.y - 20);
      fx.bolt(tx + rand(-20, 20), G.cam.y, tx, gy - 8, '#ffe066'); fx.bolt(tx + rand(-20, 20), G.cam.y, tx, gy - 8, '#ffffff'); fx.flash('#ffffff', 3); fx.shake(6, 8); sfx('explode');
      hit(tx - 20, gy - 80, 40, 80, Math.round(dmg * 0.9), { stun: 60, status: { freeze: 30 }, ky: -3, heavy: true, srcX: tx }); }));
  }
  // the moves that never go on cooldown (the user: "they dont count as cd"): they spend energy and nothing else
  function free(p, cost, fn) {
    if (p.dead || p.state === 'hurt' || !p.spend(cost)) return;
    p.enter('cast'); p.castFn = () => fn(p, p.G.zone);
  }
  const jLink = p => p.itsJ !== undefined && SW.frame - p.itsJ < 26;   // one of his J hits connected just now
  const _us = P.useSkill; P.useSkill = function (alt) {
    if (!isIt(this) || alt) return _us.apply(this, arguments);
    const du = Math.round(D.abilities.element_bolt.dmg * this.skillMul());
    if (I.held('up')) return free(this, 25, (p, z) => risingFive(p, z, du));
    if (I.held('attack') || jLink(this)) { this.itsJ = undefined; return free(this, 20, (p, z) => burningFist(p, z, du)); }
    return _us.apply(this, arguments);
  };
  const _usp = P.useSpecial; P.useSpecial = function () {
    if (isIt(this) && !I.held('up') && !I.held('down') && (I.held('attack') || jLink(this))) {
      this.itsJ = undefined; const d = Math.round(D.abilities.element_pillar.dmg * this.specMul());
      return free(this, 30, (p, z) => thunderPalm(p, z, d));
    }
    return _usp.apply(this, arguments);
  };
  // S+O opens the five gates (10 s); W+O waits half as long as everyone else's
  const _ua = P.useAwaken; P.useAwaken = function () {
    if (!isIt(this)) return _ua.apply(this, arguments);
    const m0 = this.modeT > 0, cd = this.cd || (this.cd = {}), w0 = cd.wo || 0;
    const r = _ua.apply(this, arguments);
    if (!m0 && this.modeT > 0) {
      fx.flash('#ff2a4a', 6); fx.shake(6, 10);
      EL.forEach((e, k) => fx.ring(this.x, this.y - 20, e.c[0], 4 + k * 3, 40 + k * 10, 14 + k * 2));
    }
    if ((cd.wo || 0) > w0) cd.wo = Math.round(cd.wo * 0.5);
    return r;
  };
  // in the move list
  const AB = D.abilities, KIT = D.heroes[IT] && D.heroes[IT].kit;
  AB.its_rising_five = { name: 'Rising Five', input: 'W + U', cost: 25, desc: 'All five elements rise in a spiral and throw the enemy up. Never goes on cooldown.' };
  AB.its_burning_fist = { name: 'Burning Fist', input: 'J > U', cost: 20, desc: 'Cancel a J that hit into U: a rush wrapped in fire that ends in a blazing uppercut. Never goes on cooldown.' };
  AB.its_thunder_palm = { name: 'Thunder Palm', input: 'J > I', cost: 30, desc: 'Cancel a J that hit into I: an open palm that calls lightning down on what it touched. Never goes on cooldown.' };
  if (KIT) ['its_rising_five', 'its_burning_fist', 'its_thunder_palm'].forEach(id => { if (KIT.indexOf(id) < 0) KIT.push(id); });
  if (AB.flowing_chi) { AB.flowing_chi.name = 'Five Gates'; AB.flowing_chi.desc = 'For 10 s: +30% damage, nothing he uses goes on cooldown, and the five elements fire at the enemy on their own.'; }

  // ---------- how he looks: five orbs circle him, his strikes leave afterimages in his element ----------
  const T0 = N.TRAITS && N.TRAITS.wheel;
  if (T0) {
    const t0 = T0.tick, m0 = T0.mark;
    T0.hit = function (p, atk, e) { if (e && !e.dead) meleeHit(p, e); };
    T0.tick = function (p, g, z) {
      if (t0) t0.apply(this, arguments);
      if (vsOn() && SW.frame % 10 === 0) refund(p, 1.5);   // chi flows back on its own
      if (p.modeT > 0) {   // the five gates are open
        if (p.cd) Object.keys(p.cd).forEach(k => { p.cd[k] = 0; });
        if (SW.frame % 36 === 0) { const t = nearest(z, p.x, p.y - 16, 220), e = EL[(SW.frame / 36 | 0) % 5];
          if (t) { const dx = t.x - p.x, dy = (t.y - 16) - (p.y - 46), d = Math.max(1, Math.hypot(dx, dy));
            shot(p, z, e.st, { x: p.x, y: p.y - 46, vx: dx / d * 6.5, vy: dy / d * 6.5, dmg: Math.round(6 * p.skillMul()), life: 50, w: 10, h: 10, paint: paintOf(e), kx: 1.2, ky: -1.5, stun: 22, status: e.atk.status }); } }
      }
      // the villain: crimson and violet afterimages on every strike, dark smoke always rising off him
      if ((p.state === 'attack' || p.state === 'airatk') && p.atk && p.atk.itsMove && SW.frame % 3 === 0) fx.ghost(p.sheet(), p.pose ? p.pose[0] : p.atk.anim, p.pose ? p.pose[1] : 1, p.x, p.y, p.face < 0, SW.frame % 6 < 3 ? '#ff2a4a' : '#7a1fff');
      if (!p.dead && SW.frame % 3 === 0) fx.list.push({ k: 'p', x: p.x + rand(-9, 9), y: p.y - rand(0, 8), vx: rand(-0.3, 0.3), vy: -rand(0.5, 1.2), g: 0, life: 28, max: 28, col: SW.frame % 15 === 0 ? '#ff2a4a' : SW.frame % 9 === 0 ? '#3a0a28' : '#120814', s: 3 });
    };
    T0.mark = function (ctx, p, x, y, g) {
      if (m0) m0.apply(this, arguments);
      const t = SW.frame * 0.06, w = (p.wheel || 0) % 5;
      art.glow(ctx, x, y - 20, 30, '#ff2a4a', (p.modeT > 0 ? 0.14 : 0.06) + 0.03 * Math.sin(SW.frame * 0.08));   // a red menace about him (brighter with the gates open)
      // the five elements, corrupted, turn above his head like a hollow crown: dark cores ringed in their colour, the
      // current one larger; the ones passing behind him are dimmer (they used to circle his body and hid the sprite)
      EL.forEach((e, i) => { const a = t + i * 1.2566, ox = Math.round(Math.cos(a) * (p.modeT > 0 ? 17 : 13)), oy = Math.round(Math.sin(a) * 3), big = i === w || p.modeT > 0, r = big ? 3 : 2, back = Math.sin(a) < 0;
        ctx.globalAlpha = back ? 0.5 : 1;
        art.disc(ctx, '#0a0610', x + ox, y - 46 + oy, r); art.ring(ctx, e.c[0], x + ox, y - 46 + oy, r);
        if (big) art.rect(ctx, '#ff2a4a', x + ox, y - 46 + oy, 1, 1);
        ctx.globalAlpha = 1; });
    };
  }

  // ---------- his ultimate, Five Calamities, as the final villain casts it (the user: "improve his ultimate animation") ----------
  // Pictures only: the damage and its timing (st 12 / 22 / 32 / 42 / 52, the finale at 62) stay in the ult above.
  //   st 2   cinematic bars close in, a red vignette pulses, the five elements swell into a great wheel around him
  //   st 12  fire: meteors fall on every foe        st 22  wind: a tornado spins up around them
  //   st 32  thunder: forked lightning, again       st 42  earth: jagged spikes tear out of the ground
  //   st 52  water: a tidal wave sweeps across      st 54  the five orbs leave the wheel and close on the foe
  //   st 62  the finale: crimson and black shockwaves where they meet
  const VIS = (z, x, y, life, render) => z.shots.push(new Vis(x, y, life, render));
  const UV = {
    open(p, z) {
      // letterbox and vignette, in screen space, for as long as the ultimate lasts (the cut-in's hit-stop stretches it)
      const lb = new Vis(p.x, p.y, 600, (ctx, x, y, t, vv) => {
        const k = Math.min(1, t / 8, vv.out === undefined ? 1 : Math.max(0, 1 - (t - vv.out) / 8)), bar = Math.round(26 * k), H0 = SW.H;
        art.rect(ctx, '#000000', 0, 0, W, bar); art.rect(ctx, '#000000', 0, H0 - bar, W, bar);
        ctx.globalAlpha = 0.18 * k * (0.7 + 0.3 * Math.sin(t * 0.4)); art.rect(ctx, '#ff1a3a', 0, bar, 10, H0 - bar * 2); art.rect(ctx, '#ff1a3a', W - 10, bar, 10, H0 - bar * 2);
        ctx.globalAlpha = 0.08 * k; art.rect(ctx, '#ff1a3a', 10, bar, 10, H0 - bar * 2); art.rect(ctx, '#ff1a3a', W - 20, bar, 10, H0 - bar * 2); ctx.globalAlpha = 1;
      });
      lb.tick = vv => { if (vv.out === undefined && (p.state !== 'ult' || p.dead)) vv.out = vv.t; if (vv.out !== undefined && vv.t - vv.out > 8) vv.gone = true; };
      z.shots.push(lb);
      const v = new Vis(p.x, p.y, 58, (ctx, x, y, t) => {   // the wheel of five around him, growing
        const r = Math.min(46, 8 + t * 1.6), a0 = t * 0.12;
        EL.forEach((e, i) => { const a = a0 + i * 1.2566, ox = Math.round(Math.cos(a) * r), oy = Math.round(Math.sin(a) * r * 0.45) - 26;
          ctx.globalAlpha = 0.3; art.disc(ctx, e.c[0], x + ox, y + oy, 9); ctx.globalAlpha = 1; art.disc(ctx, '#0a0610', x + ox, y + oy, 6); art.ring(ctx, e.c[0], x + ox, y + oy, 6); art.disc(ctx, e.c[1], x + ox, y + oy, 2); });
        art.glow(ctx, x, y - 26, 40, '#ff2a4a', 0.12);
      });
      v.tick = vv => { vv.x = p.x; vv.y = p.y; }; z.shots.push(v);
    },
    fire(z, b) {
      for (let i = 0; i < 3; i++) {
        const tx = b.x + b.w / 2 + rand(-18, 18), ty = b.y + b.h, sx = tx - 70 + i * 10, sy = G.cam.y - 20, n = 10 + i * 3;
        VIS(z, sx, sy, n + 10, (ctx, x, y, t, vv) => {
          const k = Math.min(1, t / n), cx = Math.round(x + (tx - sx) * k), cy = Math.round(y + (ty - sy) * k);
          if (t < n) { for (let j = 0; j < 6; j++) { const kk = Math.max(0, k - j * 0.04); art.disc(ctx, j < 2 ? '#ffd24a' : '#ff6b35', Math.round(x + (tx - sx) * kk), Math.round(y + (ty - sy) * kk), Math.max(1, 6 - j)); } art.disc(ctx, '#ffffff', cx, cy, 2); }
          else { const u = t - n; ctx.globalAlpha = Math.max(0, 1 - u / 10); art.disc(ctx, '#ff6b35', cx, cy - 4, 8 + u * 2); art.disc(ctx, '#ffd24a', cx, cy - 4, 4 + u); ctx.globalAlpha = 1; }
        });
      }
    },
    wind(z, foe) {
      const b0 = foe.box(), v = new Vis(b0.x + b0.w / 2, b0.y + b0.h, 30, (ctx, x, y, t) => {
        const k = Math.min(1, t / 5, (30 - t) / 8);
        for (let j = 0; j < 30; j++) {
          const hy = y - j * 3, w = 6 + j * 1.6, a = t * 0.55 + j * 0.32, sx = Math.round(Math.sin(t * 0.2 + j * 0.15) * j * 0.25);
          ctx.globalAlpha = 0.18 * k; art.rect(ctx, '#7dffb2', Math.round(x + sx - w / 2), hy, Math.round(w), 2);
          ctx.globalAlpha = 0.9 * k;
          art.rect(ctx, j % 4 ? '#7dffb2' : '#eafff4', Math.round(x + sx + Math.cos(a) * w / 2) - 2, hy, 4, 2);
          art.rect(ctx, '#3fbf86', Math.round(x + sx + Math.cos(a + Math.PI) * w / 2) - 1, hy, 3, 2);
        }
        for (let i = 0; i < 6; i++) { const a = t * 0.4 + i * 1.05, r = 14 + i * 4; art.rect(ctx, i % 2 ? '#c8ccd8' : '#eafff4', Math.round(x + Math.cos(a) * r), Math.round(y - 10 - i * 12 + Math.sin(a) * 3), 2, 2); }
        ctx.globalAlpha = 1;
      });
      v.tick = () => { if (!foe.dead) { const b = foe.box(); v.x = b.x + b.w / 2; v.y = b.y + b.h; } };
      z.shots.push(v);
    },
    thunder(z, b) {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      [0, 4, 8].forEach(d => z.shots.push(new Later(1 + d, () => { const fx0 = cx + rand(-60, 60); fx.bolt(fx0, G.cam.y, cx + rand(-6, 6), cy, '#ffe066'); fx.bolt(fx0 + rand(-20, 20), G.cam.y, cx, cy, '#ffffff'); fx.flash('#ffffff', 2); })));
    },
    earth(z, b) {
      const cx = b.x + b.w / 2, gy = b.y + b.h;
      [-26, -12, 0, 12, 26].forEach((dx, i) => VIS(z, cx + dx, gy, 24, (ctx, x, y, t) => {
        const hgt = Math.round(Math.min(1, t / 4) * (18 + (i % 2 ? 10 : 22)) * Math.min(1, (24 - t) / 8));
        for (let k = 0; k < hgt; k += 2) { const w = Math.max(1, Math.round(6 * (1 - k / hgt))); art.rect(ctx, k % 6 < 2 ? '#c8a05a' : '#6a5040', x - w, y - k - 2, w * 2, 2); }
        if (hgt > 4) art.rect(ctx, '#fff1e6', x - 1, y - hgt, 2, 2);
      }));
    },
    water(p, z) {
      const dir = p.face, x0 = dir > 0 ? G.cam.x - 40 : G.cam.x + W + 40;
      // a rolling wave in screen space: rises toward its curling front, troughs behind, foam along the crest
      VIS(z, x0, G.cam.y + SW.H - 30, 22, (ctx, x, y, t) => {
        const H0 = SW.H, front = dir > 0 ? (t / 14) * (W + 120) - 20 : W + 20 - (t / 14) * (W + 120), fade = Math.min(1, (22 - t) / 6);
        ctx.globalAlpha = 0.7 * fade;
        for (let cx = 0; cx < W; cx += 3) {
          const d = (front - cx) * dir; if (d < 0 || d > W + 60) continue;   // only behind the front
          const swell = d < 40 ? 30 + d * 1.1 : 74 - Math.min(30, (d - 40) * 0.25), hgt = Math.round(swell + Math.sin((cx + t * 7) / 14) * 5);
          art.rect(ctx, '#0f4c75', cx, H0 - hgt, 3, hgt); art.rect(ctx, '#1b6e9e', cx, H0 - hgt, 3, Math.round(hgt * 0.45)); art.rect(ctx, '#4cc9f0', cx, H0 - hgt, 3, 4);
          if (d < 24 && (cx + t) % 6 < 3) art.rect(ctx, '#ffffff', cx, H0 - hgt - 3 - Math.round((24 - d) * 0.3), 3, 3);   // the curl breaking
          else if ((cx * 7 + t * 3) % 23 < 4) art.rect(ctx, '#eafcff', cx, H0 - hgt - 1, 3, 2);
        }
        ctx.globalAlpha = 1;
      });
    },
    converge(p, z, foe) {
      EL.forEach((e, i) => { const a = i * 1.2566, sx = p.x + Math.cos(a) * 40, sy = p.y - 26 + Math.sin(a) * 18;
        VIS(z, sx, sy, 9, (ctx, x, y, t) => { const b = foe.box(), tx = b.x + b.w / 2, ty = b.y + b.h / 2, k = t / 8, cx = Math.round(x + (tx - sx) * k), cy = Math.round(y + (ty - sy) * k); art.disc(ctx, e.c[0], cx, cy, 5); art.disc(ctx, e.c[1], cx, cy, 2); line(ctx, e.c[0], Math.round(x + (tx - sx) * Math.max(0, k - 0.3)), Math.round(y + (ty - sy) * Math.max(0, k - 0.3)), cx, cy, 2); }); });
    },
    finale(z, b) {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      [0, 3, 6, 9].forEach((d, i) => z.shots.push(new Later(1 + d, () => { fx.ring(cx, cy, i % 2 ? '#05000a' : '#ff2a4a', 6, 90 + i * 20, 14); })));
      VIS(z, cx, cy, 24, (ctx, x, y, t) => { ctx.globalAlpha = Math.max(0, 1 - t / 24); art.disc(ctx, '#05000a', x, y, 10 + t * 3); art.ring(ctx, '#ff2a4a', x, y, 12 + t * 3); art.ring(ctx, '#9d4edd', x, y, 8 + t * 2); ctx.globalAlpha = 1; });
    }
  };
  const line = art.line;
  const u0 = N.ULT && N.ULT.five_calamities;
  if (u0) N.ULT.five_calamities = function (p, z, foes, dmg, h) {
    const st = p.st, live = foes.filter(t => t && !t.dead), boxes = live.map(t => t.box());
    if (st === 2) UV.open(p, z);
    else if (st === 12) boxes.forEach(b => UV.fire(z, b));
    else if (st === 22) live.forEach(t => UV.wind(z, t));
    else if (st === 32) boxes.forEach(b => UV.thunder(z, b));
    else if (st === 42) boxes.forEach(b => UV.earth(z, b));
    else if (st === 52) UV.water(p, z);
    else if (st === 54) live.forEach(t => UV.converge(p, z, t));
    else if (st === 62) boxes.forEach(b => UV.finale(z, b));
    return u0.apply(this, arguments);
  };
  // the name banner (heroes3.js, 56 frames) used to cover fire and wind. For him the fight holds still for the whole banner,
  // so all five calamities play after it, in full view. Both fighters are frozen alike; damage is unchanged.
  const _uf7 = SW.ultFx;
  SW.ultFx = function (p, g, z, foes) {
    const r = _uf7.apply(this, arguments);
    if (p.st === 1 && g && g.state && g.state.hero === 'itsuki') g.hitstop = Math.max(g.hitstop || 0, 50);
    return r;
  };

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
