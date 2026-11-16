'use strict';
// Shattered Worlds — Hidden Clans, wave five (Versus only; registered with ninja-kit.js). All original characters.
//   Lux     prism: her beams bounce once off the edges of the screen, and hit 50% harder after the bounce.
//   Fumi    steam: blocked hits and hits taken build pressure; full, her next skill vents for 60% more.
//   Slick   slime: his hits leave slime under the target; enemies in it are slowed, he heals and runs faster in it.
//   Kova    beast forms: each skill changes his form: tiger (+20% damage), eagle (+20% speed), tortoise (30% less damage taken).
//   Hart    spear: when an enemy steps into his reach while he is not attacking, he thrusts by himself.
//   Elixa   alchemy: red, blue and green potions mark the enemy; a different colour on a marked enemy sets off a reaction.
//   Tor     shield: while he guards, shots that reach his shield are thrown back.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja, V = SW.versus, K = SW.skillfx, I = SW.input;
  if (!N || !N.kit) return;
  const rand = SW.rand;
  const { clan, shot, area, boom, dash, column, ult, holder, refund, drag, pop, emit, hit, hurt, front, slide, ahead, nearest, floorY, fighterOf, pose, Later, Vis, Drive, sfx, pips } = N;
  if (art.WEAPONS) Object.assign(art.WEAPONS, { spear: { len: 26, w: 2, col: '#a68a64', tip: '#e0e6f0', hilt: '#5a3a20' }, flask: { len: 7, w: 4, col: '#9b5de5', tip: '#00f5d4', hilt: '#f1e3ff' } });
  const opponentShots = (p, z) => { const of = G.scene === 'vs' && V && V.f ? V.f.find(f => f.p && f.p !== p) : null; return of ? of.shots : z.shots.filter(s => s.team === 'enemy'); };

  // ================= Lux =================
  // a beam that bounces once off the edge of the screen (her trait), harder after the bounce
  const RAY = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
  const beam = (p, z, dmg, vx, vy, o) => shot(p, z, 'prism', Object.assign({ dmg, vx, vy: vy || 0, life: 70, w: 12, h: 6, ghost: true, kx: 1.5,
    paint(ctx, x, y, s) { const d = Math.sign(s.vx) || 1; for (let i = 0; i < 5; i++) art.rect(ctx, RAY[i], x - d * (i * 3 + 4), y - 2 + (i % 2), 3, 2); art.rect(ctx, '#ffffff', x - 2, y - 1, 4, 2); },
    tick(s) { if (!s.bounced && (s.x < G.cam.x + 4 || s.x > G.cam.x + W - 4)) { s.bounced = true; s.vx = -s.vx; s.dmg = Math.round(s.dmg * 1.5); s.hitSet.clear(); emit('prism', s.x, s.y, 8); sfx('block'); } } }, o));
  clan('lux', {
    hero: { name: 'Lux', alias: 'Spectrum', title: 'The Prism Lance', energy: 'Light', color: '#4cc9f0', colorHi: '#ffffff', element: 'Prism', sig: 'Refraction', combo: 'blade', route: 'nyra', modeKind: 'speed', pitch: 600, trait: 'refraction', blurb: 'One beam goes in.\nSeven come out.' },
    style: { name: 'prism', def: { c: ['#4cc9f0', '#ffffff', '#f72585', '#ffca3a'], shape: 'ray', g: 0, spd: 2.8, life: 14, drag: 0.88 } },
    moves: {
      u: { id: 'prism_shot', name: 'Prism Shot', cost: 20, dmg: 9, desc: 'A fast beam of colour. Your beams bounce once off the edge of the screen and hit 50% harder after the bounce. Hold W to aim up.',
        cast(p, z, dmg, up) { sfx('zap'); beam(p, z, dmg, p.face * 9, up ? -4.5 : 0); } },
      su: { id: 'split_beam', name: 'Split Beam', dmg: 7, desc: 'Three beams at once, high, straight and low.',
        cast(p, z, dmg) { sfx('zap'); [-2.2, 0, 2.2].forEach(vy => beam(p, z, dmg, p.face * 8, vy)); } },
      i: { id: 'spectrum_lance', name: 'Spectrum Lance', dmg: 6, desc: 'A lance of light reaches across most of the screen and burns along its length four times. Smashes cracked walls.',
        cast(p, z, dmg) { const dir = p.face, len = 230, hs = new Set(); sfx('charge'); pose(p, 'special', 1, 26);
          z.shots.push(new Vis(p.x, p.y, 26, (ctx, x, y, t) => { const px = Math.round(p.x - G.cam.x) + dir * 10, py = Math.round(p.y - G.cam.y) - 22, l = Math.round(len * Math.min(1, t / 4)); RAY.forEach((c, i) => art.rect(ctx, c, dir > 0 ? px : px - l, py - 5 + i * 2, l, 2)); art.rect(ctx, '#ffffff', dir > 0 ? px : px - l, py - 1, l, 1); art.glow(ctx, px + dir * l / 2, py, 20, '#4cc9f0', 0.1); },
            v => { if (v.t % 6 === 2) { hs.clear(); hit(dir > 0 ? p.x + 10 : p.x - 10 - len, p.y - 30, len, 16, dmg, { kx: dir * 1, ky: -1, stun: 22, hitSet: hs, breaker: v.t > 18, srcX: p.x }); } })); } },
      si: { id: 'mirror_field', name: 'Mirror Field', dmg: 6, desc: 'Set two prisms ahead of you. For three seconds each one fires a beam at the nearest enemy every half second.',
        cast(p, z, dmg) { sfx('perfect'); [50, 90].forEach((dx, k) => { const x = p.x + p.face * dx, y = p.y - 34 - k * 14;
          z.shots.push(new Vis(x, y, 180, (ctx, sx, sy, t) => { art.rect(ctx, '#e0f7ff', sx - 3, sy - 5, 6, 10); art.rect(ctx, RAY[(t >> 3) % 5], sx - 1, sy - 3, 2, 6); art.glow(ctx, sx, sy, 10, '#4cc9f0', 0.12); }, v => { if (v.t % 30 === 10 + k * 8) { const e = nearest(z, v.x, v.y, 260); if (e) { const ax = e.x - v.x, ay = e.y - e.h / 2 - v.y, m = Math.hypot(ax, ay) || 1; sfx('zap'); beam(p, z, dmg, ax / m * 8, ay / m * 8, { x: v.x, y: v.y }); } } })); }); } },
      sig: { id: 'blinding_flash', name: 'Blinding Flash', dmg: 8, desc: 'A burst of white light around you: everyone close is dazzled and stands still.',
        cast(p, z, d) { sfx('perfect'); fx.flash('#ffffff', 6); fx.ring(p.x, p.y - 20, '#ffffff', 6, 80, 14); emit('prism', p.x, p.y - 20, 20, { power: 1.6 }); N.around(z, p.x, p.y - 18, 90).forEach(e => hurt(e, d, { ky: 0, kx: 0, stun: 50, heavy: false, status: { freeze: 50 } })); } },
      ult: { id: 'rainbow_road', name: 'Rainbow Road', dmg: 10, desc: 'beams of every colour cross the screen from every side, again and again, then meet in one point.',
        fn: ult({ st: 'prism', every: 6, each(p, z, e, d, k) { const b = e.box(), y = b.y + b.h / 2, c = RAY[k % 5]; fx.list.push({ k: 'b', pts: [[G.cam.x - 10, y + rand(-20, 20)], [G.cam.x + W + 10, y + rand(-20, 20)]], col: c, life: 8, max: 8 }); } }) }
    },
    mode: ['bright', 'Bright'], awaken: ['white_light', 'White Light'],
    fin(p, z, d) { sfx('zap'); beam(p, z, d, p.face * 9, 0, { life: 24 }); },
    lines: [['All the colours of defeat.', '敗北の、すべての色。', 'Todos los colores de la derrota.', '失败的所有颜色。'], ['Light always finds a way.', '光は必ず道を見つける。', 'La luz siempre encuentra el camino.', '光总能找到路。'], ['Dazzling, right?', 'まぶしいでしょ？', 'Deslumbrante, ¿verdad?', '很耀眼，对吧？']],
    rig: { head: 'long', weapon: 'aurora', armed: 1, c: { skin: '#f4dcc8', hair: '#e0f7ff', top: '#1982c4', arm: '#1982c4', fore: '#4cc9f0', hand: '#f4dcc8', pants: '#14213d', boots: '#4cc9f0', belt: '#f72585', chest: '#ffca3a', trail: '#e0f7ff' }, trailLen: 5 }, borrow: 'nyra',
    tr: {
      'The Prism Lance': ['La Lanza Prisma', '棱镜之枪'], 'Prism': ['Prisma', '棱镜'], 'Refraction': ['Refracción', '折射'], 'One beam goes in.': ['Entra un rayo.', '射进去一道光，'], 'Seven come out.': ['Salen siete.', '射出来七道。'],
      'Prism Shot': ['Disparo Prisma', '棱光弹'], 'A fast beam of colour. Your beams bounce once off the edge of the screen and hit 50% harder after the bounce. Hold W to aim up.': ['Un rayo de color rápido. Tus rayos rebotan una vez en el borde de la pantalla y pegan un 50% más fuerte tras el rebote. Mantén W para apuntar arriba.', '一道快速的彩光。你的光束会在屏幕边缘反弹一次，反弹后伤害提升50%。按住W向上瞄准。'],
      'Split Beam': ['Rayo Dividido', '分光'], 'Three beams at once, high, straight and low.': ['Tres rayos a la vez: alto, recto y bajo.', '同时射出三道光束：上、中、下。'],
      'Spectrum Lance': ['Lanza Espectral', '光谱长枪'], 'A lance of light reaches across most of the screen and burns along its length four times. Smashes cracked walls.': ['Una lanza de luz cruza casi toda la pantalla y quema a lo largo cuatro veces. Rompe muros agrietados.', '一杆光枪横贯大半个屏幕，沿途灼烧四次。能击碎裂墙。'],
      'Mirror Field': ['Campo de Espejos', '镜阵'], 'Set two prisms ahead of you. For three seconds each one fires a beam at the nearest enemy every half second.': ['Colocas dos prismas delante. Durante tres segundos, cada uno dispara un rayo al enemigo más cercano cada medio segundo.', '在前方放下两块棱镜。三秒内，每块每半秒向最近的敌人射出一道光。'],
      'Blinding Flash': ['Destello Cegador', '致盲闪光'], 'A burst of white light around you: everyone close is dazzled and stands still.': ['Un estallido de luz blanca a tu alrededor: todos los que están cerca quedan deslumbrados e inmóviles.', '你周围爆出一阵白光：附近的人都被晃得动弹不得。'],
      'Bright': ['Brillo', '明亮'], 'White Light': ['Luz Blanca', '白光'], 'Rainbow Road': ['Camino Arcoíris', '彩虹之路']
    },
    ultTr: ['rayos de todos los colores cruzan la pantalla desde todos lados, una y otra vez, y luego se juntan en un punto.', '各色光束从四面八方一次次横穿屏幕，最后汇聚于一点。']
  });

  // ================= Fumi =================
  const vent = p => { if ((p.press || 0) < 100) return 1; p.press = 0; pop(p, 'VENT!', '#ffffff'); sfx('burst'); fx.ring(p.x, p.y - 18, '#ffffff', 6, 60, 16); emit('steam', p.x, p.y - 20, 24, { power: 1.6 }); return 1.6; };
  clan('fumi', {
    hero: { name: 'Fumi', alias: 'Kettle', title: 'The Pressure Valve', energy: 'Pressure', color: '#ced4da', colorHi: '#ffffff', element: 'Steam', sig: 'Pressure', combo: 'heavy', route: 'kael', pitch: 300, trait: 'pressure', blurb: 'Keeps it all in.\nThen does not.' },
    style: { name: 'steam', def: { c: ['#e9ecef', '#ffffff', '#adb5bd'], shape: 'puff', g: -0.05, spd: 1.4, life: 30, drag: 0.9 } },
    moves: {
      u: { id: 'steam_jet', name: 'Steam Jet', dmg: 7, desc: 'A scalding jet of steam that pushes twice. Blocking and taking hits build pressure; full, your next skill vents for 60% more.',
        cast(p, z, dmg) { dmg = Math.round(dmg * vent(p)); sfx('burst'); [1, 8].forEach(d => z.shots.push(new Later(d, () => { if (p.dead) return; emit('steam', p.x + p.face * 20, p.y - 22, 12, { dir: p.face, spread: 0.4, power: 1.6 }); hit(...front(p, 74, 34, 0), dmg, { kx: p.face * 3, ky: -1, stun: 22, status: { burn: 1 }, srcX: p.x }); }))); } },
      su: { id: 'scald_step', name: 'Scald Step', dmg: 10, desc: 'Dash forward in a cloud of steam, leaving a scalding cloud behind for two seconds.',
        cast(p, z, dmg) { dmg = Math.round(dmg * vent(p)); const x0 = p.x; dash(p, z, 'steam', { n: 12, step: 6, dmg, end(q) { area(q, z, 'steam', { x: (x0 + q.x) / 2, y: q.y, w: Math.abs(q.x - x0) + 20, h: 40, life: 120, every: 20, dmg: Math.max(1, Math.round(dmg * 0.25)), n: 2, atk: { status: { burn: 2 } } }); } }); } },
      i: { id: 'boiler_burst', name: 'Boiler Burst', dmg: 22, desc: 'Hold it in for a breath, then blow: a ring of steam bursts out all around you. Smashes cracked walls.',
        cast(p, z, dmg) { dmg = Math.round(dmg * vent(p)); sfx('charge'); z.shots.push(new Drive(p, 12, t => { p.vx = 0; p.pose = ['charge', t % 2]; emit('steam', p.x + rand(-10, 10), p.y - rand(0, 30), 1); }, q => boom(q, 'steam', q.x, q.y - 18, 62, dmg, { ky: -5, breaker: true }))); } },
      si: { id: 'geyser_field', name: 'Geyser Field', dmg: 13, desc: 'Three geysers burst up along the floor ahead, one after another.',
        cast(p, z, dmg) { dmg = Math.round(dmg * vent(p)); sfx('burst'); [40, 80, 120].forEach((dx, k) => { const x = p.x + p.face * dx; column(z, 'steam', x, floorY(z, x, p.y - 20), 6 + k * 8, dmg, { w: 18, h: 70, spike: false, atk: { ky: -7, launch: true, status: { burn: 2 } } }); }); } },
      sig: { id: 'whistle', name: 'Whistle', dmg: 6, desc: 'A shrill whistle: everyone near you is stunned for a moment, and some pressure escapes into your next skill.',
        cast(p, z, d) { p.press = Math.min(100, (p.press || 0) + 40); sfx('zap'); for (let i = 0; i < 3; i++) fx.ring(p.x, p.y - 26, '#ffffff', 6 + i * 8, 100, 10 + i * 4); N.around(z, p.x, p.y - 18, 120).forEach(e => hurt(e, d, { ky: 0, kx: 0, stun: 44, heavy: false, status: { freeze: 40 } })); } },
      ult: { id: 'meltdown', name: 'Meltdown', dmg: 10, desc: 'every valve opens at once: the arena fills with scalding steam, and then it all goes up.',
        fn: ult({ st: 'steam', every: 8, during(p, z) { for (let i = 0; i < 3; i++) emit('steam', G.cam.x + rand(0, W), p.y - rand(0, 80), 1, { up: true }); }, atk: { status: { burn: 2 } }, start(p) { p.press = 0; } }) }
    },
    mode: ['high_pressure', 'High Pressure'], awaken: ['full_boil', 'Full Boil'],
    trait: {
      after(p, atk, r) { if (r === 'block') p.press = Math.min(100, (p.press || 0) + 25); else if (r === 'hit') p.press = Math.min(100, (p.press || 0) + 12); if ((p.press || 0) >= 100 && !p.pressFull) { p.pressFull = true; pop(p, 'PRESSURE FULL', '#ffffff'); } if ((p.press || 0) < 100) p.pressFull = false; },
      tick(p) { if (p.press >= 100 && SW.frame % 6 === 0) emit('steam', p.x + rand(-6, 6), p.y - 30, 1, { up: true }); },
      mark(ctx, p, x, y) { const n = p.press || 0; if (!n) return; art.rect(ctx, '#05060c', x - 9, y - 53, 19, 4); art.rect(ctx, n >= 100 ? '#ffffff' : '#adb5bd', x - 8, y - 52, Math.round(17 * n / 100), 2); }
    },
    fin(p, z, d) { sfx('burst'); emit('steam', p.x + p.face * 24, p.y - 22, 14, { dir: p.face, power: 1.4 }); hit(p.face > 0 ? p.x + 8 : p.x - 62, p.y - 36, 54, 30, d, { kx: p.face * 2.5, stun: 22, srcX: p.x }); },
    lines: [['Let off some steam.', 'ちょっと、息抜き。', 'Para desahogarme.', '发泄一下。'], ['Boiling point.', '沸点だ。', 'Punto de ebullición.', '沸点到了。'], ['You pushed. I popped.', '押したのはそっち。弾けたのはこっち。', 'Tú presionaste. Yo estallé.', '你施压，我爆发。']],
    rig: { head: 'ninja', sc: 1.08, bulk: 9, limb: 4, c: { skin: '#d8b090', hair: '#495057', acc: '#ced4da', top: '#6c757d', arm: '#6c757d', fore: '#343a40', hand: '#d8b090', pants: '#495057', boots: '#212529', belt: '#ffffff', chest: '#ced4da' } }, borrow: 'brakk',
    tr: {
      'The Pressure Valve': ['La Válvula de Presión', '泄压阀'], 'Steam': ['Vapor', '蒸汽'], 'Pressure': ['Presión', '压力'], 'Keeps it all in.': ['Se lo guarda todo.', '什么都憋在心里。'], 'Then does not.': ['Hasta que no.', '直到憋不住。'],
      'Steam Jet': ['Chorro de Vapor', '蒸汽喷射'], 'A scalding jet of steam that pushes twice. Blocking and taking hits build pressure; full, your next skill vents for 60% more.': ['Un chorro de vapor hirviente que empuja dos veces. Bloquear y recibir golpes acumula presión; al máximo, tu siguiente habilidad la libera con un 60% más.', '一股滚烫的蒸汽，推击两次。格挡和受击会积攒压力；满压时，下一个技能释放压力，伤害提升60%。'],
      'Scald Step': ['Paso Escaldante', '烫步'], 'Dash forward in a cloud of steam, leaving a scalding cloud behind for two seconds.': ['Te lanzas hacia delante en una nube de vapor y dejas atrás una nube hirviente durante dos segundos.', '在蒸汽中向前冲刺，身后留下持续两秒的烫人蒸汽。'],
      'Boiler Burst': ['Estallido de Caldera', '锅炉爆裂'], 'Hold it in for a breath, then blow: a ring of steam bursts out all around you. Smashes cracked walls.': ['Lo aguantas un instante y luego estallas: un anillo de vapor sale a tu alrededor. Rompe muros agrietados.', '憋一口气，然后爆发：一圈蒸汽从你周身炸开。能击碎裂墙。'],
      'Geyser Field': ['Campo de Géiseres', '间歇泉'], 'Three geysers burst up along the floor ahead, one after another.': ['Tres géiseres brotan del suelo delante de ti, uno tras otro.', '三道间歇泉在前方地面接连喷出。'],
      'Whistle': ['Silbido', '鸣笛'], 'A shrill whistle: everyone near you is stunned for a moment, and some pressure escapes into your next skill.': ['Un silbido agudo: todos los que están cerca quedan aturdidos un momento, y algo de presión pasa a tu siguiente habilidad.', '一声尖锐的鸣笛：附近的人都被震住片刻，部分压力转入你的下一个技能。'],
      'High Pressure': ['Alta Presión', '高压'], 'Full Boil': ['Ebullición', '沸腾'], 'Meltdown': ['Fusión', '熔毁'], 'VENT!': ['¡ESCAPE!', '泄压！'], 'PRESSURE FULL': ['PRESIÓN MÁXIMA', '压力已满']
    },
    ultTr: ['todas las válvulas se abren a la vez: la arena se llena de vapor hirviente y luego todo salta por los aires.', '所有阀门同时打开：竞技场充满滚烫的蒸汽，然后一切轰然炸开。']
  });

  // ================= Slick =================
  // a slime puddle (his trait leaves them under what he hits; four at most)
  function puddle(p, z, x, y, life) {
    const mine = z.shots.filter(s => s.isSlime && s.p === p && !s.gone); if (mine.length >= 4) mine[0].gone = true;
    const gy = floorY(z, x, y - 20), w = 26;
    const v = new Vis(x, gy, life || 240, (ctx, sx, sy, t) => { const a = Math.min(1, t / 6, ((life || 240) - t) / 20); ctx.globalAlpha = 0.85 * a; art.rect(ctx, '#2d6a4f', sx - w, sy - 2, w * 2, 3); art.rect(ctx, '#52b788', sx - w + 3, sy - 3, w * 2 - 6, 2); if ((t >> 4) % 3 === 0) art.rect(ctx, '#d8f3dc', sx + ((t * 3) % (w * 2)) - w, sy - 4, 2, 2); ctx.globalAlpha = 1; },
      // enemies wading through it are slowed (no stagger: a stun every half second locked them down, and the bot won 80%)
      // Not while they are reeling from a hit: slowing the knock-back left them inside Slick's reach, so his 4th J whiffed
      (s, g, zz) => { zz.ents.forEach(e => { if (N.isFoe(e) && Math.abs(e.x - s.x) < w && Math.abs(e.y - s.y) < 10 && e.vx !== undefined) { const f = N.fighterOf(e), q = f ? f.p : e; if (q.state !== 'hurt') e.vx *= 0.55; } }); });
    v.isSlime = true; v.p = p; z.shots.push(v);
  }
  const inSlime = (p, z) => z && z.shots.some(s => s.isSlime && s.p === p && !s.gone && Math.abs(s.x - p.x) < 28 && Math.abs(s.y - p.y) < 8);
  clan('slick', {
    hero: { name: 'Slick', alias: 'Gloop', title: 'The Living Puddle', energy: 'Ooze', color: '#52b788', colorHi: '#d8f3dc', element: 'Slime', sig: 'Slick', combo: 'fist', route: 'nyra', pitch: 520, trait: 'slick', blurb: 'Squash him flat.\nHe just comes back together.' },
    style: { name: 'slime', def: { c: ['#52b788', '#d8f3dc', '#2d6a4f'], shape: 'drop', g: 0.15, spd: 2.2, life: 26, drag: 0.95 } },
    moves: {
      u: { id: 'slime_ball', name: 'Slime Ball', cost: 20, dmg: 10, desc: 'Lob a ball of slime that splats where it lands. Your hits leave slime under the enemy: it slows them, and heals you and speeds you up when you stand in it.',
        cast(p, z, dmg, up) { sfx('swing'); shot(p, z, 'slime', { dmg, vx: up ? p.face * 3 : N.lobVx(p, z, -3, 0.25, p.y - 22, 5), vy: up ? -6 : -3, g: 0.25, life: 60, r: 5, onEnd(g, zz) { puddle(p, zz, this.x, this.y, 200); } }); } },
      su: { id: 'slide', name: 'Slide', dmg: 11, desc: 'Flatten into a puddle and slide under and through the enemy.',
        cast(p, z, dmg) { p.iframes = Math.max(p.iframes, 10); dash(p, z, 'slime', { n: 14, step: 6, dmg, pose: ['down', 0], atk: { ky: -5, launch: true, stun: 34 } }); } },
      i: { id: 'engulf', name: 'Engulf', dmg: 5, desc: 'Roll forward as a big blob, swallowing whatever you meet and chewing four times. Smashes cracked walls.',
        cast(p, z, dmg) { const dir = p.face, hs = new Set(); sfx('burst');
          z.shots.push(new Drive(p, 32, t => { p.vx = 0; slide(p, z, dir, 3); p.pose = ['down', 0]; if (t % 8 === 0) { hs.clear(); sfx('heavy'); } hit(p.x - 26, p.y - 34, 52, 36, dmg, { kx: dir * 1, ky: -0.5, stun: 22, hitSet: hs, breaker: t > 28, srcX: p.x }); z.shots.push(new Vis(p.x, p.y, 1, (ctx, x, y) => { art.disc(ctx, '#2d6a4f', x, y - 16, 17); art.disc(ctx, '#52b788', x, y - 17, 14); art.rect(ctx, '#d8f3dc', x - 6, y - 26, 4, 3); })); })); } },
      si: { id: 'split', name: 'Split', dmg: 9, desc: 'Two blobs of you split off and bounce at the enemy, then pop into slime.',
        cast(p, z, dmg) { sfx('burst'); [-1, 1].forEach(s => shot(p, z, 'slime', { x: p.x, y: p.y - 14, dmg, vx: p.face * (3 + s), vy: -5, g: 0.3, life: 90, w: 16, h: 16, r: 7, tick(q) { if (q.vy > 0 && z.hit(q.x - 3, q.y + 6, 6, 3, true)) { q.vy = -4.5; q.bounces = (q.bounces || 0) + 1; q.hitSet.clear(); if (q.bounces > 2) q.life = 1; } }, onEnd(g, zz) { puddle(p, zz, this.x, this.y, 200); boom(p, 'slime', this.x, this.y, 24, Math.round(dmg * 0.6), { ky: -3 }); } })); } },
      sig: { id: 'belly_flop', name: 'Belly Flop', dmg: 16, desc: 'Jump and come down flat: a splash all round you and a wide puddle.',
        cast(p, z, d) { sfx('jump'); p.vy = -7; p.onGround = false; p.y -= 1; z.shots.push(new Drive(p, 40, t => { p.vx = 0; p.pose = ['air', 1]; if (t > 6 && p.onGround) return false; }, q => { boom(q, 'slime', q.x, q.y - 8, 50, d, { ky: -5 }); puddle(q, z, q.x - 26, q.y, 240); puddle(q, z, q.x + 26, q.y, 240); })); } },
      ult: { id: 'tidal_goo', name: 'Tidal Goo', dmg: 10, desc: 'a wave of slime rolls over the arena, sticks to everyone, and squeezes.',
        fn: ult({ st: 'slime', every: 8, start(p, z) { for (let i = 0; i < 4; i++) puddle(p, z, G.cam.x + 60 + i * 120, p.y, 300); }, atk: { status: { freeze: 20 } } }) }
    },
    mode: ['ooze_out', 'Ooze Out'], awaken: ['king_slime', 'King Slime'],
    trait: {
      hit(p, atk, e) { if (atk.slime || !e || e.dead || SW.frame - (p.slimeAt || 0) < 40) return; p.slimeAt = SW.frame; puddle(p, G.zone, e.x, e.y, 240); },
      tick(p, g, z) { p.inSlime = inSlime(p, z); if (p.inSlime && SW.frame % 40 === 0 && g.state.hp < p.hpMax()) { g.state.hp = Math.min(p.hpMax(), g.state.hp + 1); } },
      spd(p) { return p.inSlime ? 1.2 : 1; }
    },
    fin(p, z, d) { sfx('swing'); emit('slime', p.x + p.face * 30, p.y - 20, 12, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 58, p.y - 34, 50, 30, d, { kx: p.face * 2, stun: 24, srcX: p.x }); },
    lines: [['Squish.', 'ぐしゃっ。', 'Plaf.', '噗叽。'], ['You stepped in it.', '踏んじゃったね。', 'Lo pisaste.', '你踩到了。'], ["Can't hold me down.", '押さえつけられないよ。', 'No puedes retenerme.', '你压不住我。']],
    rig: { head: 'bald', limb: 4, bulk: 9, c: { skin: '#74c69d', hair: '#52b788', top: '#2d6a4f', arm: '#74c69d', fore: '#74c69d', hand: '#d8f3dc', pants: '#1b4332', boots: '#2d6a4f', belt: '#d8f3dc', chest: '#d8f3dc' } }, borrow: 'bando',
    tr: {
      'The Living Puddle': ['El Charco Viviente', '活体水洼'], 'Slime': ['Baba', '黏液'], 'Slick': ['Resbaladizo', '滑溜'], 'Squash him flat.': ['Aplástalo.', '把他压扁，'], 'He just comes back together.': ['Él vuelve a juntarse.', '他又会重新聚起来。'],
      'Slime Ball': ['Bola de Baba', '黏液球'], 'Lob a ball of slime that splats where it lands. Your hits leave slime under the enemy: it slows them, and heals you and speeds you up when you stand in it.': ['Lanzas una bola de baba que se aplasta al caer. Tus golpes dejan baba bajo el enemigo: lo frena, y a ti te cura y te acelera cuando estás encima.', '抛出一团黏液，落地摊开。你的攻击会在敌人脚下留下黏液：让他减速，而你站在上面会回血并加速。'],
      'Slide': ['Deslizamiento', '滑行'], 'Flatten into a puddle and slide under and through the enemy.': ['Te aplanas como un charco y te deslizas bajo el enemigo y a través de él.', '摊成一滩，从敌人身下滑过。'],
      'Engulf': ['Engullir', '吞没'], 'Roll forward as a big blob, swallowing whatever you meet and chewing four times. Smashes cracked walls.': ['Ruedas hacia delante como una gran masa, tragándote lo que encuentras y masticándolo cuatro veces. Rompe muros agrietados.', '化作一大团向前滚动，吞下遇到的东西嚼四下。能击碎裂墙。'],
      'Split': ['División', '分裂'], 'Two blobs of you split off and bounce at the enemy, then pop into slime.': ['Dos trozos de ti se separan y rebotan hacia el enemigo, y luego revientan en baba.', '你分裂出两团黏液弹向敌人，然后炸成一滩。'],
      'Belly Flop': ['Panzazo', '肚皮砸'], 'Jump and come down flat: a splash all round you and a wide puddle.': ['Saltas y caes de plano: una salpicadura a tu alrededor y un charco ancho.', '跳起后平拍落地：四周溅开，留下一大滩。'],
      'Ooze Out': ['Desborde', '渗出'], 'King Slime': ['Rey Baba', '黏液之王'], 'Tidal Goo': ['Marea de Baba', '黏液狂潮']
    },
    ultTr: ['una ola de baba cubre la arena, se pega a todos y aprieta.', '一股黏液浪潮淹过竞技场，粘住所有人并挤压。']
  });

  // ================= Kova =================
  const FORMS = { tiger: ['T', '#ff8c42'], eagle: ['E', '#e0f0ff'], tortoise: ['S', '#6a994e'] };
  const form = (p, f) => { if (p.form !== f) { p.form = f; pop(p, f.toUpperCase(), FORMS[f][1]); emit('beast', p.x, p.y - 20, 10); } };
  clan('kova', {
    hero: { name: 'Kova', alias: 'Three Beasts', title: 'The Shapeshifter', energy: 'Instinct', color: '#e76f51', colorHi: '#ffe8d6', element: 'Beast forms', sig: 'Forms', combo: 'claw', route: 'kael', pitch: 340, trait: 'forms', blurb: 'Tiger in the morning, eagle by noon,\ntortoise by night.' },
    style: { name: 'beast' },
    moves: {
      u: { id: 'tiger_pounce', name: 'Tiger Pounce', dmg: 12, desc: 'Pounce on the enemy ahead with both claws. Each skill changes your form: tiger (+20% damage), eagle (+20% speed), tortoise (30% less damage taken).',
        cast(p, z, dmg) { form(p, 'tiger'); dash(p, z, 'beast', { n: 9, step: 7, dmg, pose: ['a4', 1], end(q) { fx.slash(q.x + q.face * 14, q.y - 20, q.face, 3, '#ff8c42', 40); } }); } },
      su: { id: 'eagle_dive', name: 'Eagle Dive', dmg: 13, desc: 'Leap up as an eagle and dive down onto the nearest enemy, talons first.',
        cast(p, z, dmg) { form(p, 'eagle'); const e = nearest(z, p.x, p.y - 16, 200), hs = new Set(); sfx('jump'); p.vy = -8; p.onGround = false; p.y -= 1;
          z.shots.push(new Drive(p, 40, t => { p.iframes = Math.max(p.iframes, 2); if (t < 9) { p.vx = 0; return; } p.pose = ['air', 1]; p.vx = 0; p.vy = 8; const gx = e && !e.dead ? e.x : p.x + p.face * 40; if (Math.abs(gx - p.x) > 3) slide(p, z, Math.sign(gx - p.x), 5); hit(p.x - 16, p.y - 34, 32, 36, dmg, { ky: 3, stun: 30, hitSet: hs, srcX: p.x }); if (p.onGround && t > 9) return false; })); } },
      i: { id: 'tortoise_shell', name: 'Tortoise Shell', dmg: 20, desc: 'Pull into a shell of stone, roll forward through everything and stop with a crash. Smashes cracked walls.',
        cast(p, z, dmg) { form(p, 'tortoise'); p.iframes = Math.max(p.iframes, 20); dash(p, z, 'rock', { n: 18, step: 5, dmg: Math.round(dmg * 0.4), every: 6, pose: ['down', 0], end(q) { boom(q, 'rock', q.x + q.face * 14, q.y - 14, 36, dmg, { ky: -4, breaker: true }); } }); } },
      si: { id: 'three_beasts', name: 'Three Beasts', dmg: 9, desc: 'All three at once: a tiger charge, an eagle\'s rise, and a tortoise crashing down.',
        cast(p, z, dmg) { form(p, 'tiger'); const dir = p.face, hs = new Set(); sfx('roar');
          z.shots.push(new Drive(p, 42, t => {
            p.iframes = Math.max(p.iframes, 2);
            if (t <= 12) { p.vx = 0; slide(p, z, dir, 7); p.pose = ['dash', 0]; hit(...front(p, 30, 40, 10), dmg, { kx: dir * 1, ky: -1, stun: 26, hitSet: hs, srcX: p.x }); return; }
            if (t === 13) { form(p, 'eagle'); hs.clear(); p.vy = -8; p.onGround = false; p.y -= 1; hit(...front(p, 40, 70, 8), dmg, { ky: -8, launch: true, stun: 40, srcX: p.x }); }
            if (t > 13 && t < 24) { p.vx = 0; p.pose = ['jump', 0]; return; }
            if (t === 24) form(p, 'tortoise');
            p.vy = 9; p.pose = ['down', 0]; if (p.onGround) return false;
          }, q => boom(q, 'rock', q.x, q.y - 10, 44, dmg * 2, { ky: -5 }))); } },
      sig: { id: 'pack_charge', name: 'Pack Charge', dmg: 8, desc: 'Spirit beasts, a tiger, an eagle and a tortoise, charge out ahead of you one after another.',
        cast(p, z, d) { sfx('roar'); ['#ff8c42', '#e0f0ff', '#6a994e'].forEach((c, k) => z.shots.push(new Later(1 + k * 8, () => { if (p.dead) return; shot(p, z, 'beast', { dmg: d, vx: p.face * (7 - k), vy: k === 1 ? -0.6 : 0, life: 40, w: 22, h: 18, pierce: true, maxHits: 2, kx: 3, paint(ctx, x, y, s) { ctx.globalAlpha = 0.75; art.disc(ctx, c, x, y, 8); art.rect(ctx, c, x + Math.sign(s.vx) * 6, y - 4, 6, 5); art.rect(ctx, '#ffffff', x + Math.sign(s.vx) * 9, y - 3, 1, 1); ctx.globalAlpha = 1; } }); }))); } },
      ult: { id: 'primal_parade', name: 'Primal Parade', dmg: 10, desc: 'he becomes every beast at once: claws, talons and a falling shell, over and over.',
        fn: ult({ st: 'beast', every: 7, each(p, z, e, d, k) { const b = e.box(); fx.slash(b.x + b.w / 2, b.y + b.h / 2, k % 2 ? 1 : -1, 3, ['#ff8c42', '#e0f0ff', '#6a994e'][k % 3], 44); } }) }
    },
    mode: ['wild_heart', 'Wild Heart'], awaken: ['chimera', 'Chimera'],
    trait: {
      dmg(p) { return p.form === 'tiger' ? 1.2 : 1; },
      spd(p) { return p.form === 'eagle' ? 1.2 : 1; },
      hurt(p, atk) { return p.form === 'tortoise' ? Object.assign({}, atk, { dmg: Math.max(1, Math.round(atk.dmg * 0.7)) }) : null; },
      mark(ctx, p, x, y) { const f = FORMS[p.form]; if (!f) return; art.rect(ctx, '#05060c', x - 4, y - 58, 9, 9); SW.text(ctx, f[0], x, y - 56, f[1], { align: 'center' }); }
    },
    fin(p, z, d) { sfx('heavy'); fx.slash(p.x + p.face * 20, p.y - 22, p.face, 3, '#ff8c42', 44); emit('beast', p.x + p.face * 26, p.y - 22, 10, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 52, p.y - 38, 44, 34, d, { kx: p.face * 2.5, stun: 24, srcX: p.x }); },
    lines: [['The wild wins.', '野生の勝ちだ。', 'Gana lo salvaje.', '野性赢了。'], ['Pick an animal. Any animal.', '好きな獣を選べ。', 'Elige un animal. Cualquiera.', '随便挑一种野兽吧。'], ['Claw, wing and shell.', '爪、翼、そして甲羅。', 'Garra, ala y caparazón.', '爪、翼与壳。']],
    rig: { head: 'feral', limb: 3, bulk: 8, c: { skin: '#c8906a', hair: '#e76f51', top: '#7a3a20', arm: '#c8906a', fore: '#e76f51', hand: '#c8906a', pants: '#5a3020', boots: '#2a1a10', belt: '#ffe8d6', chest: '#e76f51', glow: '#ffd24a' } }, borrow: 'fenn',
    tr: {
      'The Shapeshifter': ['El Cambiaformas', '变形者'], 'Beast forms': ['Formas bestiales', '兽形'], 'Forms': ['Formas', '形态'], 'Tiger in the morning, eagle by noon,': ['Tigre por la mañana, águila al mediodía,', '清晨是虎，正午是鹰，'], 'tortoise by night.': ['tortuga por la noche.', '入夜是龟。'],
      'Tiger Pounce': ['Salto del Tigre', '猛虎扑'], 'Pounce on the enemy ahead with both claws. Each skill changes your form: tiger (+20% damage), eagle (+20% speed), tortoise (30% less damage taken).': ['Saltas sobre el enemigo con ambas garras. Cada habilidad cambia tu forma: tigre (+20% de daño), águila (+20% de velocidad), tortuga (30% menos daño recibido).', '双爪扑向前方的敌人。每个技能都会改变形态：虎（伤害+20%）、鹰（速度+20%）、龟（受到的伤害-30%）。'],
      'Eagle Dive': ['Picado del Águila', '鹰击'], 'Leap up as an eagle and dive down onto the nearest enemy, talons first.': ['Saltas como un águila y caes en picado sobre el enemigo más cercano, garras por delante.', '化鹰跃起，利爪向下俯冲最近的敌人。'],
      'Tortoise Shell': ['Caparazón', '龟壳'], 'Pull into a shell of stone, roll forward through everything and stop with a crash. Smashes cracked walls.': ['Te metes en un caparazón de piedra, ruedas a través de todo y te detienes con un estruendo. Rompe muros agrietados.', '缩进石壳，向前滚过一切，最后轰然停下。能击碎裂墙。'],
      'Three Beasts': ['Tres Bestias', '三兽'], "All three at once: a tiger charge, an eagle's rise, and a tortoise crashing down.": ['Las tres a la vez: la carga del tigre, el vuelo del águila y la tortuga cayendo con estruendo.', '三兽合一：猛虎冲锋、雄鹰腾空、巨龟砸落。'],
      'Pack Charge': ['Carga de la Manada', '群兽冲锋'], 'Spirit beasts, a tiger, an eagle and a tortoise, charge out ahead of you one after another.': ['Bestias espirituales, un tigre, un águila y una tortuga, cargan delante de ti una tras otra.', '灵兽虎、鹰、龟依次向前冲出。'],
      'Wild Heart': ['Corazón Salvaje', '野性之心'], 'Chimera': ['Quimera', '奇美拉'], 'Primal Parade': ['Desfile Primigenio', '原始游行'], 'TIGER': ['TIGRE', '虎'], 'EAGLE': ['ÁGUILA', '鹰'], 'TORTOISE': ['TORTUGA', '龟']
    },
    ultTr: ['se convierte en todas las bestias a la vez: garras, zarpas y un caparazón que cae, una y otra vez.', '他同时化身所有野兽：利爪、鹰爪与砸落的龟壳，一次又一次。']
  });

  // ================= Hart =================
  const thrust = (p, z, reach, dmg, o) => { const dir = p.face; fx.slash(p.x + dir * (reach / 2), p.y - 22, dir, 1, '#f2e8cf', reach); emit('spear', p.x + dir * reach, p.y - 22, 4, { dir }); return hit(dir > 0 ? p.x + 6 : p.x - reach, p.y - 30, reach - 6, 16, dmg, Object.assign({ kx: dir * 2.5, ky: -1, stun: 24, srcX: p.x }, o)); };
  clan('hart', {
    hero: { name: 'Hart', alias: 'Longreach', title: 'The Long Spear', energy: 'Focus', color: '#bc4749', colorHi: '#f2e8cf', element: 'Spear', sig: 'Reach', combo: 'blade', route: 'kael', pitch: 400, trait: 'reach', blurb: 'Keep your distance.\nHe will keep it for you.' },
    style: { name: 'spear', def: { c: ['#f2e8cf', '#bc4749', '#ffffff'], shape: 'streak', g: 0, spd: 3.4, life: 10, drag: 0.85 } },
    moves: {
      u: { id: 'long_thrust', name: 'Long Thrust', dmg: 12, desc: 'One long thrust that reaches far ahead. When an enemy steps into your reach while you are not attacking, you thrust by yourself.',
        cast(p, z, dmg) { sfx('swing'); pose(p, 'b3', 1, 12); thrust(p, z, 96, dmg, { heavy: true }); } },
      su: { id: 'pole_vault', name: 'Pole Vault', dmg: 14, desc: 'Plant the spear and vault over the enemy, striking down at them on the way.',
        cast(p, z, dmg) { const dir = p.face, hs = new Set(); sfx('jump'); p.vy = -8.5; p.onGround = false; p.y -= 1; p.iframes = Math.max(p.iframes, 16);
          z.shots.push(new Drive(p, 30, t => { p.vx = 0; slide(p, z, dir, 5); p.pose = [t < 10 ? 'jump' : 'air', t < 10 ? 0 : 1]; if (t > 8) hit(p.x - 18, p.y - 10, 36, 40, dmg, { ky: 3, stun: 30, hitSet: hs, srcX: p.x }); if (t > 6 && p.onGround) return false; }, q => { q.face = -dir; })); } },
      i: { id: 'hundred_thrusts', name: 'Hundred Thrusts', dmg: 3, desc: 'Ten thrusts too fast to see, then one that sends them flying. Smashes cracked walls.',
        cast(p, z, dmg) { const hs = new Set(); sfx('charge');
          z.shots.push(new Drive(p, 32, t => { p.vx = 0; p.pose = [t % 4 < 2 ? 'b3' : 'b1', 1]; if (t % 3 === 0) { hs.clear(); sfx('swing'); thrust(p, z, 84 + (t % 9), dmg, { hitSet: hs, kx: p.face * 0.3, stun: 14 }); } }, q => { sfx('heavy'); thrust(q, z, 100, dmg * 5, { kx: q.face * 7, ky: -4, stun: 40, heavy: true, down: true, breaker: true }); })); } },
      si: { id: 'skewer_rush', name: 'Skewer Rush', dmg: 7, desc: 'Charge with the spear down, carry the enemy along, and drive them into whatever is behind them.',
        cast(p, z, dmg) { const dir = p.face, hs = new Set(), carried = new Set(); sfx('roar');
          z.shots.push(new Drive(p, 20, t => { p.vx = 0; p.vy = Math.min(p.vy, 0); p.iframes = Math.max(p.iframes, 2); p.pose = ['b3', 1]; const ok = slide(p, z, dir, 7); if (t % 5 === 1) hs.clear(); hit(...front(p, 46, 30, 0), dmg, { kx: dir * 7, ky: -0.5, stun: 26, hitSet: hs, srcX: p.x - dir * 10 }); hs.forEach(e => carried.add(e)); carried.forEach(e => drag(z, e, p.x + dir * 40, 8)); if (!ok) return false; },
            q => { sfx('explode'); fx.shake(6, 10); carried.forEach(e => hurt(e, dmg * 3, { kx: dir * 4, ky: -5, stun: 44, down: true })); })); } },
      sig: { id: 'spear_throw', name: 'Spear Throw', dmg: 11, desc: 'Throw the spear through everything in a line; it comes back to your hand and hits again.',
        cast(p, z, d) { sfx('swing'); shot(p, z, 'spear', { dmg: d, vx: p.face * 10, life: 36, w: 24, h: 6, ghost: true, pierce: true, kx: 2, paint(ctx, x, y, s) { const dd = Math.sign(s.vx) || 1; art.rect(ctx, '#a68a64', x - 12, y - 1, 24, 2); art.rect(ctx, '#e0e6f0', x + (dd > 0 ? 10 : -14), y - 2, 4, 4); }, tick(s) { if (s.t === 18) { s.vx = -s.vx; s.hitSet.clear(); } } }); } },
      ult: { id: 'thousand_spears', name: 'A Thousand Spears', dmg: 10, desc: 'spears rain down across the whole arena, then he drives one through everyone at once.',
        fn: ult({ st: 'spear', every: 7, during(p, z) { if (p.st % 2 === 0) { const x = G.cam.x + rand(0, W); z.shots.push(new Vis(x, G.cam.y, 14, (ctx, sx, sy, t) => { const y = sy + t * 16; art.rect(ctx, '#a68a64', sx, y - 20, 2, 20); art.rect(ctx, '#e0e6f0', sx - 1, y, 4, 4); })); } } }) }
    },
    mode: ['keen_eye', 'Keen Eye'], awaken: ['dragon_lance', 'Dragon Lance'],
    trait: {
      tick(p, g, z) {
        if (p.pokeCd > 0) { p.pokeCd--; return; }
        if (['idle', 'run', 'guard', 'jump', 'fall'].indexOf(p.state) < 0) return;
        const e = z.ents.find(q => N.isFoe(q) && (q.x - p.x) * p.face > 8 && Math.abs(q.x - p.x) < 50 && Math.abs(q.y - p.y) < 30);
        if (!e) return;
        p.pokeCd = 90; sfx('swing'); thrust(p, z, 60, Math.max(2, Math.round(5 * p.dmgMul())), { kx: p.face * 4, ky: -1, stun: 20, heavy: false });
      },
      mark(ctx, p, x, y) { if (!(p.pokeCd > 0)) { art.rect(ctx, '#05060c', x + p.face * 10 - 1, y - 50, 4, 4); art.rect(ctx, '#f2e8cf', x + p.face * 10, y - 49, 2, 2); } }
    },
    fin(p, z, d) { sfx('swing'); thrust(p, z, 90, d, { kx: p.face * 3 }); },
    lines: [['Too close.', '近すぎる。', 'Demasiado cerca.', '太近了。'], ['Mind the point.', '穂先に気をつけろ。', 'Cuidado con la punta.', '小心枪尖。'], ['Reach decides everything.', 'リーチがすべてを決める。', 'El alcance lo decide todo.', '攻击距离决定一切。']],
    rig: { head: 'cap', weapon: 'spear', armed: 1, c: { skin: '#d8b090', hair: '#5a3a20', acc: '#bc4749', top: '#386641', arm: '#386641', fore: '#f2e8cf', hand: '#d8b090', pants: '#2a3a20', boots: '#5a3a20', belt: '#bc4749', chest: '#f2e8cf', trail: '#bc4749' }, trailLen: 3 }, borrow: 'aldric',
    tr: {
      'The Long Spear': ['La Lanza Larga', '长枪'], 'Spear': ['Lanza', '枪'], 'Reach': ['Alcance', '攻击距离'], 'Keep your distance.': ['Mantén la distancia.', '保持距离。'], 'He will keep it for you.': ['Él la mantendrá por ti.', '他会替你保持。'],
      'Long Thrust': ['Estocada Larga', '长刺'], 'One long thrust that reaches far ahead. When an enemy steps into your reach while you are not attacking, you thrust by yourself.': ['Una estocada larga que llega muy lejos. Cuando un enemigo entra en tu alcance mientras no atacas, lanzas una estocada tú solo.', '一记远距离长刺。当你没有攻击时，敌人一踏进你的攻击范围，你就会自动出枪。'],
      'Pole Vault': ['Salto con Pértiga', '撑杆跳'], 'Plant the spear and vault over the enemy, striking down at them on the way.': ['Clavas la lanza y saltas por encima del enemigo, atacándolo desde arriba al pasar.', '把枪往地上一撑，跃过敌人头顶，途中向下刺击。'],
      'Hundred Thrusts': ['Cien Estocadas', '百刺'], 'Ten thrusts too fast to see, then one that sends them flying. Smashes cracked walls.': ['Diez estocadas demasiado rápidas para verlas y luego una que lo manda volando. Rompe muros agrietados.', '快得看不清的十次突刺，最后一枪把敌人刺飞。能击碎裂墙。'],
      'Skewer Rush': ['Embestida Ensartadora', '贯穿冲锋'], 'Charge with the spear down, carry the enemy along, and drive them into whatever is behind them.': ['Cargas con la lanza baja, arrastras al enemigo y lo estrellas contra lo que tenga detrás.', '压低长枪冲锋，挑着敌人一路推进，把他钉在身后的东西上。'],
      'Spear Throw': ['Lanzamiento de Lanza', '掷枪'], 'Throw the spear through everything in a line; it comes back to your hand and hits again.': ['Lanzas la lanza a través de todo lo que hay en línea; vuelve a tu mano y golpea otra vez.', '把长枪掷出，贯穿一线上的一切；它会飞回手中，再打一次。'],
      'Keen Eye': ['Ojo Agudo', '锐眼'], 'Dragon Lance': ['Lanza del Dragón', '龙枪'], 'A Thousand Spears': ['Mil Lanzas', '千枪']
    },
    ultTr: ['llueven lanzas por toda la arena y luego clava una a través de todos a la vez.', '长枪如雨落满整个竞技场，最后他一枪同时贯穿所有人。']
  });

  // ================= Elixa =================
  const POT = { red: ['#ef476f', 'burn'], blue: ['#4cc9f0', 'freeze'], green: ['#80ed99', 'acid'] };
  // a potion marks what it hits; a different colour on a marked target sets off a reaction (her trait)
  function dose(p, e, color) {
    if (!e || e.dead) return; const h = holder(e);
    if (h.potion && h.potionT > SW.frame && h.potion !== color) {
      const b = e.box(), x = b.x + b.w / 2, y = b.y + b.h / 2; h.potion = null;
      pop(p, 'REACTION!', '#fee440'); sfx('explode'); fx.ring(x, y, POT[color][0], 6, 40, 14); emit('alchemy', x, y, 20, { power: 1.6 });
      hurt(e, Math.max(2, Math.round(14 * p.dmgMul())), { ky: -4, stun: 36, status: color === 'red' ? { burn: 3 } : color === 'blue' ? { freeze: 60 } : null, alchemy: true });
      return;
    }
    h.potion = color; h.potionT = SW.frame + 240;
  }
  const flask = (p, z, color, dmg, o) => shot(p, z, 'alchemy', Object.assign({ dmg, vx: N.lobVx(p, z, -3.6, 0.24, p.y - 22, 4.6), vy: -3.6, g: 0.24, life: 60, w: 10, h: 10, status: color === 'red' ? { burn: 2 } : color === 'blue' ? { freeze: 30 } : null,
    paint(ctx, x, y) { art.rect(ctx, '#f1e3ff', x - 1, y - 6, 2, 3); art.disc(ctx, POT[color][0], x, y, 4); art.rect(ctx, '#ffffff', x - 2, y - 2, 1, 2); },
    onEnd(g, zz) { const x = this.x, y = this.y; emit('alchemy', x, y, 10); fx.ring(x, y, POT[color][0], 4, 22, 10); this.hitSet.forEach(e => dose(p, e, color)); zz.ents.forEach(e => { if (N.isFoe(e) && !this.hitSet.has(e) && Math.hypot(e.x - x, e.y - e.h / 2 - y) < 26) { hurt(e, Math.round(dmg * 0.5), { stun: 16, heavy: false }); dose(p, e, color); } }); } }, o));
  clan('elixa', {
    hero: { name: 'Elixa', alias: 'Flask', title: 'The Mad Alchemist', energy: 'Reagent', color: '#9b5de5', colorHi: '#f1e3ff', element: 'Alchemy', sig: 'Reaction', combo: 'flame', route: 'nyra', pitch: 660, trait: 'reaction', blurb: 'Two flasks, one enemy.\nShe just wants to see what happens.' },
    style: { name: 'alchemy', def: { c: ['#9b5de5', '#00f5d4', '#fee440'], shape: 'drop', g: 0.1, spd: 2.4, life: 24, drag: 0.94 } },
    moves: {
      u: { id: 'red_flask', name: 'Red Flask', cost: 20, dmg: 10, desc: 'Lob a flask of fire that burns. Potions mark what they hit; a different colour on a marked enemy sets off a reaction.',
        cast(p, z, dmg) { sfx('swing'); flask(p, z, 'red', dmg); } },
      su: { id: 'blue_flask', name: 'Blue Flask', dmg: 10, desc: 'Lob a flask of frost that holds the enemy still.',
        cast(p, z, dmg) { sfx('swing'); flask(p, z, 'blue', dmg); } },
      i: { id: 'green_cauldron', name: 'Green Cauldron', dmg: 4, desc: 'Tip a cauldron of acid across the floor ahead: it eats at whoever stands in it and marks them green. Smashes cracked walls.',
        cast(p, z, dmg) { const x = p.x + p.face * 60, gy = floorY(z, x, p.y - 20); sfx('burst'); area(p, z, 'alchemy', { x, y: gy, w: 80, h: 22, life: 180, every: 18, dmg, n: 1, atk: { breaker: true }, tick(s) { if (s.t % 18 === 0) z.ents.forEach(e => { if (N.isFoe(e) && Math.abs(e.x - s.x) < 40 && Math.abs(e.y - s.y) < 10) dose(p, e, 'green'); }); },
          paint(ctx, sx, sy, t, s, a) { ctx.globalAlpha = 0.8 * a; art.rect(ctx, '#38b000', sx - 40, sy - 3, 80, 3); for (let i = -40; i < 40; i += 10) if ((t + i) % 24 < 8) art.rect(ctx, '#80ed99', sx + i, sy - 5, 3, 2); ctx.globalAlpha = 1; } }); } },
      si: { id: 'grand_experiment', name: 'Grand Experiment', dmg: 9, desc: 'Throw red, blue and green one after another at the same spot, and stand back.',
        cast(p, z, dmg) { ['red', 'blue', 'green'].forEach((c, k) => z.shots.push(new Later(1 + k * 8, () => { if (!p.dead) { sfx('swing'); flask(p, z, c, dmg); } }))); } },
      sig: { id: 'transmute', name: 'Transmute', dmg: 10, desc: 'Turn whatever potion the nearest enemy is marked with into a reaction at once, and drink a little of it yourself: heal 8%.',
        cast(p, z, d) { const e = nearest(z, p.x, p.y - 16, 240); sfx('perfect'); p.heal(Math.round(p.hpMax() * 0.08)); if (!e) return; const h = holder(e), c = h.potion && h.potionT > SW.frame ? h.potion : 'red'; dose(p, e, c === 'red' ? 'blue' : 'red'); hurt(e, d, { stun: 24 }); } },
      ult: { id: 'magnum_opus', name: 'Magnum Opus', dmg: 9, desc: 'the great work: every potion she has ever made rains on the arena, and everything reacts with everything.',
        fn: ult({ st: 'alchemy', every: 6, each(p, z, e, d, k) { const c = ['red', 'blue', 'green'][k % 3], b = e.box(); fx.ring(b.x + b.w / 2, b.y + b.h / 2, POT[c][0], 4, 26, 10); emit('alchemy', b.x + b.w / 2, b.y + b.h / 2, 8); } }) }
    },
    mode: ['catalyst', 'Catalyst'], awaken: ['philosophers_stone', "Philosopher's Stone"],
    trait: { mark(ctx, p, x, y) { const z = G.zone, e = z && z.ents.find(N.isFoe), h = e && holder(e); if (h && h.potion && h.potionT > SW.frame) { art.rect(ctx, '#05060c', x - 4, y - 55, 9, 9); art.disc(ctx, POT[h.potion][0], x, y - 50, 3); } } },
    fin(p, z, d) { sfx('swing'); const c = ['red', 'blue', 'green'][(Math.random() * 3) | 0]; flask(p, z, c, d, { vx: p.face * 5, vy: -2.5 }); },
    lines: [['Fascinating. Again?', '興味深いわ。もう一回？', 'Fascinante. ¿Otra vez?', '真有意思。再来一次？'], ['Results: conclusive.', '結果：決定的。', 'Resultado: concluyente.', '实验结果：确凿无疑。'], ['Do not drink that.', 'それ、飲まないでね。', 'No te bebas eso.', '那个可别喝。']],
    rig: { head: 'braid', weapon: 'flask', c: { skin: '#f0d8c8', hair: '#9b5de5', top: '#f1e3ff', arm: '#f1e3ff', fore: '#9b5de5', hand: '#f0d8c8', pants: '#3a2a5a', boots: '#2a1a3a', belt: '#00f5d4', chest: '#fee440', trail: '#9b5de5' }, trailLen: 4 }, borrow: 'tessa',
    tr: {
      'The Mad Alchemist': ['La Alquimista Loca', '疯狂炼金师'], 'Alchemy': ['Alquimia', '炼金术'], 'Reaction': ['Reacción', '反应'], 'Two flasks, one enemy.': ['Dos frascos, un enemigo.', '两个药瓶，一个敌人。'], 'She just wants to see what happens.': ['Solo quiere ver qué pasa.', '她只是想看看会发生什么。'],
      'Red Flask': ['Frasco Rojo', '红瓶'], 'Lob a flask of fire that burns. Potions mark what they hit; a different colour on a marked enemy sets off a reaction.': ['Lanzas un frasco de fuego que quema. Las pociones marcan lo que tocan; un color distinto sobre un enemigo marcado provoca una reacción.', '抛出一瓶会燃烧的火焰药剂。药剂会标记被击中的目标；对已标记的敌人用不同颜色的药剂会引发反应。'],
      'Blue Flask': ['Frasco Azul', '蓝瓶'], 'Lob a flask of frost that holds the enemy still.': ['Lanzas un frasco de escarcha que deja quieto al enemigo.', '抛出一瓶冰霜药剂，让敌人动弹不得。'],
      'Green Cauldron': ['Caldero Verde', '绿釜'], 'Tip a cauldron of acid across the floor ahead: it eats at whoever stands in it and marks them green. Smashes cracked walls.': ['Vuelcas un caldero de ácido por el suelo delante: corroe a quien lo pisa y lo marca de verde. Rompe muros agrietados.', '把一釜酸液倒在前方地上：腐蚀站在里面的人，并给他打上绿色标记。能击碎裂墙。'],
      'Grand Experiment': ['Gran Experimento', '伟大实验'], 'Throw red, blue and green one after another at the same spot, and stand back.': ['Lanzas rojo, azul y verde uno tras otro al mismo sitio, y te apartas.', '把红、蓝、绿三瓶依次扔向同一处，然后退后。'],
      'Transmute': ['Transmutar', '嬗变'], 'Turn whatever potion the nearest enemy is marked with into a reaction at once, and drink a little of it yourself: heal 8%.': ['Conviertes al instante la poción que marca al enemigo más cercano en una reacción, y bebes un poco: te curas un 8%.', '立刻把最近的敌人身上的药剂标记变成反应，自己也喝上一口：回复8%生命。'],
      'Catalyst': ['Catalizador', '催化剂'], "Philosopher's Stone": ['Piedra Filosofal', '贤者之石'], 'Magnum Opus': ['Magnum Opus', '伟业'], 'REACTION!': ['¡REACCIÓN!', '反应！']
    },
    ultTr: ['la gran obra: todas las pociones que ha hecho llueven sobre la arena, y todo reacciona con todo.', '伟大之作：她做过的所有药剂倾盆落下，一切都与一切起反应。']
  });

  // ================= Tor =================
  // shots that reach his raised shield are thrown back: in Versus they move into his own list, so they hit their owner
  function reflect(p, z, r) {
    opponentShots(p, z).slice().forEach(s => {
      if (s.gone || s.vx === undefined || s.isPuppet || s.isClone || s.isGlyph || !s.update) return;
      const fx0 = p.x + p.face * 12, dx = s.x - fx0, dy = s.y - (p.y - 20);
      if (Math.abs(dx) > (r || 40) || Math.abs(dy) > 28 || Math.sign(s.vx || 0) === Math.sign(p.face)) return;
      const of = G.scene === 'vs' && V && V.f ? V.f.find(f => f.p && f.p !== p) : null;
      if (of) { const i = of.shots.indexOf(s); if (i >= 0) of.shots.splice(i, 1); z.shots.push(s); } else s.team = 'player';
      s.vx = -s.vx * 1.2; if (s.vy) s.vy = -Math.abs(s.vy) * 0.5; if (s.hitSet) s.hitSet.clear(); if (s.life !== undefined) s.life = Math.max(s.life, 40); s.x = fx0 + p.face * 8;
      fx.spark(s.x, s.y, '#e0f0ff', 6, 2); sfx('block'); pop(p, 'REFLECT', '#e0f0ff');
    });
  }
  clan('tor', {
    hero: { name: 'Tor', alias: 'Bulwark', title: 'The Last Wall', energy: 'Resolve', color: '#577590', colorHi: '#e0f0ff', element: 'Shield', sig: 'Aegis', combo: 'heavy', route: 'kael', pitch: 220, trait: 'aegis', blurb: 'Nothing has ever got past him.\nNothing is about to start now.' },
    style: { name: 'shield', def: { c: ['#e0f0ff', '#577590', '#ffffff'], shape: 'shard', g: 0.15, spd: 2.8, life: 16, drag: 0.92 } },
    moves: {
      u: { id: 'shield_toss', name: 'Shield Toss', dmg: 11, desc: 'Throw your shield: it flies out and comes back, hitting both ways. While you guard, shots that reach your shield are thrown back.',
        cast(p, z, dmg) { sfx('swing'); shot(p, z, 'shield', { dmg, vx: p.face * 7, life: 44, w: 16, h: 16, ghost: true, pierce: true, kx: 2.5, paint(ctx, x, y) { art.disc(ctx, '#577590', x, y, 7); art.disc(ctx, '#e0f0ff', x, y, 4); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 2); }, tick(s) { if (s.t === 20) { s.hitSet.clear(); } if (s.t > 20) { const dx = p.x - s.x; s.vx = Math.sign(dx) * 7; s.vy = (p.y - 22 - s.y) * 0.1; if (Math.abs(dx) < 10) s.life = 1; } } }); } },
      su: { id: 'shield_bash', name: 'Shield Bash', dmg: 13, desc: 'Charge behind your shield: nothing can hurt you from the front, and whoever you hit is stunned.',
        cast(p, z, dmg) { p.iframes = Math.max(p.iframes, 14); dash(p, z, 'shield', { n: 12, step: 6, dmg, pose: ['guard', 0], atk: { stun: 44, status: { freeze: 30 }, kx: p.face * 4 } }); } },
      i: { id: 'bulwark_slam', name: 'Bulwark Slam', dmg: 18, desc: 'Bring the shield down on the floor: a shockwave runs out both ways. Smashes cracked walls.',
        cast(p, z, dmg) { sfx('heavy'); pose(p, 'a3', 1, 16); z.shots.push(new Later(6, () => { if (p.dead) return; fx.shake(6, 10); fx.dust(p.x, p.y, 10); [-1, 1].forEach(d => shot(p, z, 'shield', { x: p.x + d * 10, y: p.y - 8, vx: d * 5, dmg, life: 28, w: 18, h: 18, ghost: true, pierce: true, maxHits: 2, ky: -5, breaker: true, paint(ctx, x, y, s) { art.rect(ctx, '#e0f0ff', x - 3, y - 6 - (s.t % 4), 6, 10); art.rect(ctx, '#577590', x - 5, y + 2, 10, 3); } })); })); } },
      si: { id: 'phalanx', name: 'Phalanx', dmg: 22, desc: 'Become a wall for a second and a half: nothing gets through from the front, every shot comes back, and then you bash.',
        cast(p, z, dmg) { sfx('block'); const lk = (q => (q && (fighterOf(q) ? fighterOf(q).p : q).state === 'hurt' ? q : null))(ahead(p, z, 140));  z.shots.push(new Drive(p, lk ? 30 : 90, t => { p.vx = 0; p.iframes = Math.max(p.iframes, 2); p.pose = ['guard', 0]; reflect(p, z, 56); if (t % 10 === 0) fx.ring(p.x + p.face * 14, p.y - 20, '#e0f0ff', 4, 20, 8); }, q => { sfx('heavy'); fx.slash(q.x + q.face * 20, q.y - 22, q.face, 3, '#e0f0ff', 50); hit(...front(q, 56, 50, 4), dmg, { kx: q.face * 7, ky: -4, stun: 40, heavy: true, down: true, srcX: q.x }); })); } },
      sig: { id: 'unbreakable', name: 'Unbreakable', dmg: 10, desc: 'For a moment nothing can touch you; then the shield bursts with everything it caught.',
        cast(p, z, d) { p.iframes = Math.max(p.iframes, 40); sfx('awaken'); fx.ring(p.x, p.y - 20, '#e0f0ff', 30, 10, 20); z.shots.push(new Later(36, () => { if (!p.dead) boom(p, 'shield', p.x, p.y - 20, 60, d * 2, { ky: -5 }); })); } },
      ult: { id: 'last_stand', name: 'Last Stand', dmg: 11, desc: 'he plants himself in the middle of the arena: wall after wall of force rolls out from his shield through everyone.',
        fn: ult({ st: 'shield', every: 8, each(p, z, e) { fx.ring(p.x, p.y - 20, '#e0f0ff', 10, 200, 10); } }) }
    },
    mode: ['hold_the_line', 'Hold the Line'], awaken: ['iron_wall', 'Iron Wall'],
    trait: {
      tick(p, g, z) { if (p.state === 'guard') reflect(p, z, 40); },
      mark(ctx, p, x, y) { if (p.state === 'guard') { art.rect(ctx, '#e0f0ff', x + p.face * 12 - 1, y - 34, 2, 22); art.glow(ctx, x + p.face * 12, y - 22, 12, '#e0f0ff', 0.15); } }
    },
    fin(p, z, d) { sfx('heavy'); emit('shield', p.x + p.face * 22, p.y - 20, 10, { dir: p.face }); hit(...front(p, 48, 44, 0), d, { kx: p.face * 4, stun: 30, srcX: p.x }); },
    lines: [['Nothing gets past.', '何も通さん。', 'Nada pasa.', '什么都过不去。'], ['Hit the wall. Lose.', '壁を殴れば、負ける。', 'Golpeas el muro. Pierdes.', '撞上墙，就输了。'], ['I am still standing.', 'まだ立っている。', 'Sigo en pie.', '我还站着。']],
    rig: { head: 'helmet', sc: 1.08, limb: 4, bulk: 9, shield: 1, c: { skin: '#d8b090', hair: '#577590', glow: '#e0f0ff', top: '#577590', arm: '#577590', fore: '#8d99ae', hand: '#d8b090', pants: '#2b3a4a', boots: '#1a2430', belt: '#e0f0ff', chest: '#e0f0ff', shield: '#577590' } }, borrow: 'aldric',
    tr: {
      'The Last Wall': ['El Último Muro', '最后的城墙'], 'Shield': ['Escudo', '盾'], 'Aegis': ['Égida', '神盾'], 'Nothing has ever got past him.': ['Nada ha logrado pasar nunca.', '从来没有东西能越过他。'], 'Nothing is about to start now.': ['Y nada va a empezar ahora.', '现在也不会有。'],
      'Shield Toss': ['Lanzamiento de Escudo', '掷盾'], 'Throw your shield: it flies out and comes back, hitting both ways. While you guard, shots that reach your shield are thrown back.': ['Lanzas tu escudo: sale volando y vuelve, golpeando a la ida y a la vuelta. Mientras te defiendes, los disparos que alcanzan tu escudo salen rebotados.', '掷出盾牌：飞出去再飞回来，来回都会命中。格挡时，打到盾上的飞行道具会被反弹回去。'],
      'Shield Bash': ['Golpe de Escudo', '盾击'], 'Charge behind your shield: nothing can hurt you from the front, and whoever you hit is stunned.': ['Cargas tras tu escudo: nada puede herirte por delante, y quien golpeas queda aturdido.', '举盾冲锋：正面什么都伤不了你，被撞到的人会被击晕。'],
      'Bulwark Slam': ['Golpe Bastión', '堡垒重击'], 'Bring the shield down on the floor: a shockwave runs out both ways. Smashes cracked walls.': ['Golpeas el suelo con el escudo: una onda de choque sale hacia ambos lados. Rompe muros agrietados.', '用盾猛砸地面：冲击波向两侧扩散。能击碎裂墙。'],
      'Phalanx': ['Falange', '方阵'], 'Become a wall for a second and a half: nothing gets through from the front, every shot comes back, and then you bash.': ['Te conviertes en un muro durante segundo y medio: nada pasa por delante, cada disparo vuelve, y luego embistes.', '化作一堵墙，持续一秒半：正面什么都打不进来，所有飞行道具都被弹回，然后你一盾撞出。'],
      'Unbreakable': ['Inquebrantable', '坚不可摧'], 'For a moment nothing can touch you; then the shield bursts with everything it caught.': ['Por un momento nada puede tocarte; luego el escudo estalla con todo lo que atrapó.', '片刻之间什么都碰不到你；随后盾牌把接下的一切全数爆发出去。'],
      'Hold the Line': ['Mantener la Línea', '坚守防线'], 'Iron Wall': ['Muro de Hierro', '铁壁'], 'Last Stand': ['Última Resistencia', '背水一战'], 'REFLECT': ['REFLEJO', '反弹']
    },
    ultTr: ['se planta en medio de la arena: muro tras muro de fuerza sale de su escudo y atraviesa a todos.', '他立于竞技场中央：一道道力墙从他的盾上推出，穿过所有人。']
  });
  // Versus balance (versus.js V.tune), fitted with tools/versus-balance.js against the fifteen regular heroes, both sides, bots on Normal: untuned 37-80% (Slick's slime stunned on a timer then; it only slows now), with this table about 41-61%.
  if (SW.versus && SW.versus.tune) Object.assign(SW.versus.tune, { lux: 0.9, fumi: 1.25, slick: 1.45, kova: 0.89, hart: 0.77, elixa: 1.25, tor: 0.98 });
})();
