'use strict';
// Shattered Worlds — Hidden Clans, wave four (Versus only; registered with ninja-kit.js). All original characters.
// (A seventh, Rivet the gadgeteer, was cut to keep Versus at 64 heroes once Itsuki joined.)
//   Vex     magnetism: his skills push (+) or pull (-); a skill of the other charge within 2.5 s snaps for 40% more.
//   Zara    cards: every skill draws a card from 1 to 10 that scales it (0.76x to 1.24x); a 10 is a jackpot, double.
//   Coda    ribbon dance: a beat pulses every 2/3 s; a skill thrown on the beat hits 35% harder and gives back 10 energy.
//   Vesna   blood: skills cost 4% of her health, every hit she lands heals her for 15% of it, and she hits 20% harder.
//   Apis    bees: every hit she lands adds a bee to her swarm; at eight they all fly at the nearest enemy.
//   Hex     curse: 30% of the damage she deals hits again two seconds later.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja, V = SW.versus, K = SW.skillfx;
  if (!N || !N.kit) return;
  const rand = SW.rand, Proj = SW.Proj;
  const { clan, shot, area, boom, dash, column, ult, holder, refund, drag, pop, emit, hit, hurt, part, front, slide, ahead, nearest, floorY, fighterOf, pose, Later, Vis, Drive, sfx, pips } = N;
  if (art.WEAPONS) Object.assign(art.WEAPONS, { scythe: { len: 20, w: 2, col: '#3a0a0a', hi: '#e5383b', tip: '#ffb3b3', hilt: '#1a0a0a' }, wrench: { len: 12, w: 3, col: '#8d99ae', tip: '#06d6a0', hilt: '#2b2d42' } });

  // ================= Vex =================
  const pol = (p, s) => { p.pol = s; };
  clan('vex', {
    hero: { name: 'Vex', alias: 'Lodestone', title: 'The Iron Pull', energy: 'Charge', color: '#e63946', colorHi: '#a8dadc', element: 'Magnetism', sig: 'Polarity', combo: 'fist', route: 'kael', pitch: 440, trait: 'polarity', blurb: 'Opposites attract.\nHe makes sure of it.' },
    style: { name: 'magnet', def: { c: ['#e63946', '#a8dadc', '#ffffff'], shape: 'spark', g: 0, spd: 2.6, life: 14, drag: 0.88 } },
    moves: {
      u: { id: 'repel_shot', name: 'Repel Shot', dmg: 12, desc: 'A red charge that throws the enemy back (+). His skills push (+) or pull (-): the other charge within 2.5 s snaps for 40% more.',
        cast(p, z, dmg, up) { pol(p, '+'); sfx('shoot'); shot(p, z, 'magnet', { dmg, vy: up ? -4 : 0, vx: p.face * 7.5, kx: 5, ky: -2, r: 5, paint(ctx, x, y, s, c) { N.orb(ctx, x, y, 5, ['#e63946', '#ff8a8a']); art.rect(ctx, '#ffffff', x - 2, y, 5, 1); art.rect(ctx, '#ffffff', x, y - 2, 1, 5); } }); } },
      su: { id: 'attract', name: 'Attract', dmg: 15, desc: 'A blue pulse that drags the nearest enemy in front of you to your fists (-).',
        cast(p, z, dmg) { pol(p, '-'); sfx('charge'); const e = ahead(p, z, 170); fx.ring(p.x + p.face * 30, p.y - 20, '#a8dadc', 40, 6, 12); if (!e) return; drag(z, e, p.x + p.face * 20, 160); z.shots.push(new Later(4, () => { if (!p.dead) { fx.slash(p.x + p.face * 14, p.y - 22, p.face, 2, '#a8dadc', 40); hit(...front(p, 44, 44, 4), dmg, { kx: p.face * 1, ky: -4, stun: 34, heavy: true, srcX: p.x }); } })); } },
      i: { id: 'iron_storm', name: 'Iron Storm', dmg: 8, desc: 'Scrap metal gathers round you and flies out in three rings (+). Smashes cracked walls.',
        cast(p, z, dmg) { pol(p, '+'); sfx('charge'); [0, 10, 20].forEach((d, k) => z.shots.push(new Later(d + 1, () => { if (p.dead) return; sfx('swing'); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + k * 0.5; shot(p, z, 'magnet', { x: p.x, y: p.y - 20, vx: Math.cos(a) * 5.5, vy: Math.sin(a) * 4, dmg, life: 26, w: 10, h: 10, ghost: true, kx: 2, breaker: k === 2, paint(ctx, x, y) { art.rect(ctx, '#8d99ae', x - 3, y - 2, 6, 4); art.rect(ctx, '#e0e6f0', x - 2, y - 2, 3, 1); } }); } }))); } },
      si: { id: 'lodestar', name: 'Lodestar', dmg: 8, desc: 'Plant a magnetic core ahead: it pulls everything to it for a second and a half, then blows (-).',
        cast(p, z, dmg) { pol(p, '-'); const x = p.x + p.face * 70, gy = floorY(z, x, p.y - 20); sfx('charge');
          area(p, z, 'magnet', { x, y: gy, w: 60, h: 50, life: 90, every: 15, dmg, atk: { stun: 20 }, tick(s) { z.ents.forEach(e => { if (N.isFoe(e) && Math.abs(e.x - s.x) < 110) drag(z, e, s.x, 2); }); if (s.t === 89) boom(p, 'magnet', s.x, s.y - 20, 40, dmg * 3, { ky: -6, breaker: true }); },
            paint(ctx, x, y, t) { const r = 6 + Math.sin(t * 0.3) * 2; N.orb(ctx, x, y - 22, Math.round(r), ['#a8dadc', '#ffffff']); for (let i = 0; i < 3; i++) art.ring(ctx, '#a8dadc', x, y - 22, Math.round(40 - ((t * 2 + i * 13) % 40))); } }); } },
      sig: { id: 'flux_flip', name: 'Flux Flip', dmg: 9, desc: 'A ring of force throws everything away, then the field flips and drags it all back into a second hit.',
        cast(p, z, d) { sfx('heavy'); fx.ring(p.x, p.y - 20, '#e63946', 6, 70, 12); N.around(z, p.x, p.y - 18, 80).forEach(e => { hurt(e, d, { ky: -2, stun: 30 }); if (e.vx !== undefined) e.vx = Math.sign(e.x - p.x || p.face) * 6; });
          z.shots.push(new Later(22, () => { if (p.dead) return; fx.ring(p.x, p.y - 20, '#a8dadc', 70, 6, 12); sfx('charge'); N.around(z, p.x, p.y - 18, 150).forEach(e => { drag(z, e, p.x + Math.sign(e.x - p.x || 1) * 18, 120); hurt(e, d, { ky: -4, stun: 36 }); }); })); } },
      ult: { id: 'magnetar', name: 'Magnetar', dmg: 12, desc: 'he becomes a star of iron: everyone is thrown away and dragged back, again and again, then crushed together.',
        fn: ult({ st: 'magnet', every: 8, each(p, z, e, d, k) { const b = e.box(); fx.bolt(p.x, p.y - 20, b.x + b.w / 2, b.y + b.h / 2, k % 2 ? '#a8dadc' : '#e63946'); if (k % 2) drag(z, e, p.x, 30); else if (e.vx !== undefined) e.vx = Math.sign(e.x - p.x || 1) * 5; }, during(p) { if (p.st % 4 === 0) fx.ring(p.x, p.y - 20, p.st % 8 ? '#e63946' : '#a8dadc', 10, 90, 8); }, final(p, z, e) { drag(z, e, p.x + p.face * 20, 300); } }) }
    },
    mode: ['strong_field', 'Strong Field'], awaken: ['north_star', 'North Star'],
    trait: {
      hit(p, atk, e) {
        if (!atk.energy || p.snapping || !e || e.dead) return;
        const s = p.pol || '+';
        if (p.lastPol && p.lastPol !== s && SW.frame - (p.lastPolT || 0) < 150) { p.snapping = true; try { pop(p, 'SNAP!', '#ffffff'); fx.bolt(p.x, p.y - 20, e.x, e.y - 16, '#ffffff'); hurt(e, Math.max(1, Math.round((atk.dealt || atk.dmg) * 0.4)), { ky: 0, kx: 0, stun: 12, heavy: false }); } finally { p.snapping = false; } p.lastPol = null; return; }
        p.lastPol = s; p.lastPolT = SW.frame;
      },
      mark(ctx, p, x, y) { const s = p.pol; if (!s) return; art.rect(ctx, '#05060c', x - 4, y - 54, 9, 9); art.rect(ctx, s === '+' ? '#e63946' : '#a8dadc', x - 3, y - 50, 7, 1); if (s === '+') art.rect(ctx, '#e63946', x, y - 53, 1, 7); }
    },
    fin(p, z, d) { const x = p.x + p.face * 40; sfx('zap'); emit('magnet', x, p.y - 20, 10); fx.bolt(p.x + p.face * 10, p.y - 20, x, p.y - 20, '#a8dadc'); hit(x - 18, p.y - 36, 36, 32, d, { kx: p.face * 3, ky: -2, stun: 24, srcX: p.x }); },
    lines: [["Opposites attract. You lose.", '反発し、引き合う。お前の負けだ。', 'Los opuestos se atraen. Tú pierdes.', '异性相吸。你输了。'], ['Feel the pull?', '引力を感じるか？', '¿Sientes la atracción?', '感受到引力了吗？'], ['Iron always comes home.', '鉄は必ず戻ってくる。', 'El hierro siempre vuelve a casa.', '钢铁总会归来。']],
    rig: { head: 'short', limb: 3, bulk: 8, c: { skin: '#c89a78', hair: '#2a2a34', top: '#3a2a2e', arm: '#c89a78', fore: '#8d99ae', hand: '#e63946', pants: '#2b2d42', boots: '#a8dadc', belt: '#e63946', chest: '#a8dadc' } }, borrow: 'kael',
    tr: {
      'The Iron Pull': ['El Tirón de Hierro', '铁之引力'], 'Magnetism': ['Magnetismo', '磁力'], 'Polarity': ['Polaridad', '极性'], 'Opposites attract.': ['Los opuestos se atraen.', '异性相吸。'], 'He makes sure of it.': ['Él se asegura de ello.', '他会确保这一点。'],
      'Repel Shot': ['Disparo Repulsor', '斥力弹'], 'A red charge that throws the enemy back (+). His skills push (+) or pull (-): the other charge within 2.5 s snaps for 40% more.': ['Una carga roja que lanza al enemigo hacia atrás (+). Sus habilidades empujan (+) o atraen (-): la carga contraria en menos de 2,5 s chasquea con un 40% más.', '一发红色电荷，把敌人推开（+）。他的技能会推开（+）或吸引（-）：2.5秒内用相反电荷命中会额外造成40%伤害。'],
      'Attract': ['Atraer', '吸引'], 'A blue pulse that drags the nearest enemy in front of you to your fists (-).': ['Un pulso azul que arrastra al enemigo más cercano hasta tus puños (-).', '一道蓝色脉冲，把面前最近的敌人拉到你拳下（-）。'],
      'Iron Storm': ['Tormenta de Hierro', '钢铁风暴'], 'Scrap metal gathers round you and flies out in three rings (+). Smashes cracked walls.': ['La chatarra se reúne a tu alrededor y sale volando en tres anillos (+). Rompe muros agrietados.', '废铁聚集在你周围，分三圈飞射出去（+）。能击碎裂墙。'],
      'Lodestar': ['Estrella Imán', '磁极星'], 'Plant a magnetic core ahead: it pulls everything to it for a second and a half, then blows (-).': ['Colocas un núcleo magnético delante: atrae todo hacia sí durante segundo y medio y luego estalla (-).', '在前方安放磁核：一秒半内把一切吸向它，然后爆炸（-）。'],
      'Flux Flip': ['Inversión de Flujo', '磁通反转'], 'A ring of force throws everything away, then the field flips and drags it all back into a second hit.': ['Un anillo de fuerza lo aleja todo; luego el campo se invierte y lo arrastra de vuelta para un segundo golpe.', '一圈力场把一切推开，随后磁场反转，把它们全拉回来再打一次。'],
      'Strong Field': ['Campo Fuerte', '强磁场'], 'North Star': ['Estrella Polar', '北极星'], 'Magnetar': ['Magnetar', '磁星'], 'SNAP!': ['¡CHASQUIDO!', '磁爆！']
    },
    ultTr: ['se convierte en una estrella de hierro: todos salen despedidos y vuelven arrastrados una y otra vez, y al final quedan aplastados juntos.', '他化作一颗钢铁之星：所有人被一次次推开又拉回，最后被挤压在一起。']
  });

  // ================= Zara =================
  const CARD = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  // a card is drawn for every skill: its value scales the skill, a 10 doubles it
  const luck = p => { const v = 1 + (Math.random() * 10 | 0); p.card = v; p.cardT = 90; const m = v === 10 ? 2 : 0.7 + v * 0.06; pop(p, v === 10 ? 'JACKPOT!' : CARD[v - 1], v === 10 ? '#ffd166' : v >= 7 ? '#ffffff' : '#c8ccd8'); if (v === 10) { sfx('level'); emit('card', p.x, p.y - 30, 16, { up: true }); } return m; };
  const cardArt = (ctx, x, y, s, c) => { art.rect(ctx, '#ffffff', x - 3, y - 4, 7, 9); art.rect(ctx, '#e63946', x - 1, y - 2, 3, 3); art.rect(ctx, '#1a1a1a', x - 3, y - 4, 7, 1); };
  clan('zara', {
    hero: { name: 'Zara', alias: 'Lady Luck', title: 'The House Edge', energy: 'Luck', color: '#ffd166', colorHi: '#fff8dc', element: 'Cards', sig: 'The Draw', combo: 'dagger', route: 'nyra', modeKind: 'speed', pitch: 620, trait: 'luck', blurb: 'Every fight is a game of chance.\nShe stacked the deck.' },
    style: { name: 'card', def: { c: ['#ffffff', '#ffd166', '#e63946'], shape: 'leaf', g: 0.03, spd: 2.2, life: 30, drag: 0.94, sway: 0.15 } },
    moves: {
      u: { id: 'card_toss', name: 'Card Toss', cost: 20, dmg: 7, desc: 'Three cards in a fan. Every skill draws a card from 1 to 10 that makes it weaker or stronger; a 10 is a jackpot, double damage. Hold W to aim up.',
        cast(p, z, dmg, up) { dmg = Math.round(dmg * luck(p)); sfx('swing'); [-0.18, 0, 0.18].forEach(a => { const ang = (up ? -0.55 : 0) + a; shot(p, z, 'card', { dmg, vx: p.face * Math.cos(ang) * 8, vy: Math.sin(ang) * 8, life: 34, w: 10, h: 10, paint: cardArt }); }); } },
      su: { id: 'shuffle_step', name: 'Shuffle Step', dmg: 12, desc: 'Flick forward and back in a blur, leaving two cards on the floor that burst when an enemy comes close.',
        cast(p, z, dmg) { dmg = Math.round(dmg * luck(p)); const x0 = p.x; const lk = (q => (q && (fighterOf(q) ? fighterOf(q).p : q).state === 'hurt' ? q : null))(ahead(p, z, 140)); sfx('dash'); p.iframes = Math.max(p.iframes, 12); slide(p, z, p.face, 60);
          [x0, lk && !lk.dead ? lk.x : p.x].forEach(x => { const gy = floorY(z, x, p.y - 20); z.shots.push(new Vis(x, gy - 6, 300, (ctx, sx, sy, t) => cardArt(ctx, sx, sy + (t % 30 < 15 ? 0 : 1)), v => { if (v.t > 15 && !v.done && z.ents.some(e => N.isFoe(e) && Math.abs(e.x - v.x) < 24 && Math.abs(e.y - v.y) < 40)) { v.done = true; v.life = v.t + 1; boom(p, 'card', v.x, v.y, 26, dmg, { ky: -4 }); } })); }); } },
      i: { id: 'house_of_cards', name: 'House of Cards', dmg: 7, desc: 'A tower of cards builds itself on the enemy ahead and falls on them in four waves. Smashes cracked walls.',
        cast(p, z, dmg) { dmg = Math.round(dmg * luck(p)); const e = ahead(p, z, 220), x0 = e ? e.x : p.x + p.face * 90; sfx('charge');
          for (let k = 0; k < 4; k++) z.shots.push(new Later(8 + k * 8, () => { const x = e && !e.dead ? e.x : x0, gy = floorY(z, x, p.y - 20); sfx('swing'); for (let i = 0; i < 6; i++) emit('card', x + rand(-14, 14), gy - 60 + rand(-10, 10), 6, { up: false }); hit(x - 20, gy - 70, 40, 72, dmg, { ky: k === 3 ? -6 : 2, stun: 26, breaker: k === 3, heavy: k === 3, srcX: x }); })); } },
      si: { id: 'royal_flush', name: 'Royal Flush', dmg: 7, desc: 'Five royal cards fly out one by one and hunt the nearest enemy.',
        cast(p, z, dmg) { dmg = Math.round(dmg * luck(p)); sfx('perfect'); for (let k = 0; k < 5; k++) z.shots.push(new Later(1 + k * 5, () => { if (p.dead) return; sfx('swing'); shot(p, z, 'card', { dmg, vx: p.face * 5, vy: (k - 2) * 1.2, life: 70, ghost: true, w: 10, h: 10, paint: cardArt, tick(s) { const e = nearest(z, s.x, s.y, 240); if (e && s.t > 6) { const ax = e.x - s.x, ay = e.y - e.h / 2 - s.y, m = Math.hypot(ax, ay) || 1; s.vx += (ax / m * 6 - s.vx) * 0.12; s.vy += (ay / m * 6 - s.vy) * 0.12; } } }); })); } },
      sig: { id: 'wild_card', name: 'Wild Card', dmg: 10, desc: 'Turn over a wild card: a fire card that burns, an ice card that freezes, or a heart card that heals you.',
        cast(p, z, d) { const r = Math.random() * 3 | 0, e = ahead(p, z, 200), x = e ? e.x : p.x + p.face * 80, y = (e ? e.y : p.y) - 18; sfx('perfect');
          if (r === 0) { pop(p, 'FIRE CARD', '#ff8a3a'); boom(p, 'fire', x, y, 34, d * 2, { status: { burn: 3 } }); }
          else if (r === 1) { pop(p, 'ICE CARD', '#bfefff'); boom(p, 'ice', x, y, 34, d, { status: { freeze: 70 }, ky: 0 }); }
          else { pop(p, 'HEART CARD', '#ff8a8a'); p.heal(Math.round(p.hpMax() * 0.12)); emit('card', p.x, p.y - 20, 12, { up: true }); } } },
      ult: { id: 'all_in', name: 'All In', dmg: 9, desc: 'she bets everything: giant cards slam down on everyone, and the last one is always the jackpot.',
        fn: ult({ st: 'card', every: 7, each(p, z, e) { const b = e.box(); z.shots.push(new Vis(b.x + b.w / 2, b.y - 40, 10, (ctx, x, y, t) => { const yy = y + t * 4; art.rect(ctx, '#ffffff', x - 8, yy - 11, 16, 22); art.rect(ctx, '#e63946', x - 3, yy - 3, 6, 6); art.rect(ctx, '#1a1a1a', x - 8, yy - 11, 16, 1); })); }, final(p) { pop(p, 'JACKPOT!', '#ffd166'); } }) }
    },
    mode: ['hot_streak', 'Hot Streak'], awaken: ['high_roller', 'High Roller'],
    trait: { tick(p) { if (p.cardT > 0) p.cardT--; }, mark(ctx, p, x, y) { if (!(p.cardT > 0)) return; art.rect(ctx, '#05060c', x - 5, y - 60, 11, 12); art.rect(ctx, '#ffffff', x - 4, y - 59, 9, 10); SW.text(ctx, CARD[p.card - 1], x, y - 57, p.card === 10 ? '#e63946' : '#1a1a1a', { align: 'center' }); } },
    fin(p, z, d) { sfx('swing'); shot(p, z, 'card', { dmg: d, vx: p.face * 7, life: 22, w: 10, h: 10, paint: cardArt }); },
    lines: [['The house always wins.', '胴元は必ず勝つのよ。', 'La casa siempre gana.', '庄家永远是赢家。'], ['Read them and weep.', 'よく見て、泣きなさい。', 'Míralas y llora.', '看清楚，然后哭吧。'], ['Jackpot.', '大当たり。', 'Premio gordo.', '中大奖了。']],
    rig: { head: 'hat', c: { skin: '#e8c0a0', hair: '#1a1a24', acc: '#1a1a24', white: '#ffd166', top: '#7a0a1a', arm: '#7a0a1a', fore: '#ffffff', hand: '#e8c0a0', pants: '#1a1a24', boots: '#3a2a20', belt: '#ffd166', chest: '#ffd166', trail: '#7a0a1a' }, trailLen: 3 }, borrow: 'vesper',
    tr: {
      'The House Edge': ['La Ventaja de la Casa', '庄家优势'], 'Cards': ['Cartas', '纸牌'], 'The Draw': ['La Carta', '抽牌'], 'Every fight is a game of chance.': ['Cada pelea es un juego de azar.', '每场战斗都是一场赌局。'], 'She stacked the deck.': ['Ella preparó la baraja.', '而她早就做好了手脚。'],
      'Card Toss': ['Lanzamiento de Cartas', '飞牌'], 'Three cards in a fan. Every skill draws a card from 1 to 10 that makes it weaker or stronger; a 10 is a jackpot, double damage. Hold W to aim up.': ['Tres cartas en abanico. Cada habilidad saca una carta del 1 al 10 que la hace más débil o más fuerte; un 10 es premio gordo, daño doble. Mantén W para apuntar arriba.', '扇形甩出三张牌。每个技能都会抽一张1到10的牌，让它变弱或变强；抽到10是大奖，伤害翻倍。按住W向上瞄准。'],
      'Shuffle Step': ['Paso Barajado', '洗牌步'], 'Flick forward and back in a blur, leaving two cards on the floor that burst when an enemy comes close.': ['Te mueves adelante y atrás en un destello y dejas dos cartas en el suelo que estallan cuando se acerca un enemigo.', '眨眼间前后闪动，在地上留下两张牌，敌人靠近时就会爆开。'],
      'House of Cards': ['Castillo de Naipes', '纸牌屋'], 'A tower of cards builds itself on the enemy ahead and falls on them in four waves. Smashes cracked walls.': ['Una torre de cartas se levanta sobre el enemigo de delante y cae sobre él en cuatro oleadas. Rompe muros agrietados.', '一座纸牌塔在前方敌人头上搭起，分四波砸下。能击碎裂墙。'],
      'Royal Flush': ['Escalera Real', '皇家同花顺'], 'Five royal cards fly out one by one and hunt the nearest enemy.': ['Cinco cartas reales salen volando una a una y persiguen al enemigo más cercano.', '五张王牌依次飞出，追击最近的敌人。'],
      'Wild Card': ['Comodín', '万能牌'], 'Turn over a wild card: a fire card that burns, an ice card that freezes, or a heart card that heals you.': ['Das la vuelta a un comodín: una carta de fuego que quema, una de hielo que congela o una de corazones que te cura.', '翻开一张万能牌：烧灼的火牌、冰冻的冰牌，或为你治疗的红心牌。'],
      'Hot Streak': ['Racha', '手气正旺'], 'High Roller': ['Gran Apostadora', '豪赌客'], 'All In': ['Todo o Nada', '全押'],
      'JACKPOT!': ['¡PREMIO GORDO!', '大奖！'], 'FIRE CARD': ['CARTA DE FUEGO', '火牌'], 'ICE CARD': ['CARTA DE HIELO', '冰牌'], 'HEART CARD': ['CARTA DE CORAZONES', '红心牌']
    },
    ultTr: ['lo apuesta todo: cartas gigantes caen sobre todos, y la última siempre es el premio gordo.', '她押上一切：巨大的纸牌砸向所有人，而最后一张永远是大奖。']
  });

  // ================= Coda =================
  const BEAT = 40;
  const onBeat = () => { const k = SW.frame % BEAT; return k <= 6 || k >= BEAT - 4; };
  const beat = p => { if (!onBeat()) return 1; pop(p, 'ON BEAT!', '#ffe0f3'); N.refund(p, 10); sfx('perfect'); fx.ring(p.x, p.y - 4, '#f15bb5', 6, 30, 10); return 1.35; };
  const ribbon = (ctx, x0, y0, x1, y1, t, col) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 4)); for (let i = 0; i <= n; i++) { const k = i / n; art.rect(ctx, i % 3 ? col : '#ffe0f3', Math.round(x0 + (x1 - x0) * k) - 1, Math.round(y0 + (y1 - y0) * k + Math.sin(k * 9 + t * 0.6) * 4) - 1, 3, 2); } };
  clan('coda', {
    hero: { name: 'Coda', alias: 'Encore', title: 'The Ribbon Dance', energy: 'Rhythm', color: '#f15bb5', colorHi: '#ffe0f3', element: 'Ribbon', sig: 'On the Beat', combo: 'swift', route: 'nyra', modeKind: 'speed', pitch: 680, trait: 'rhythm', blurb: 'She hears music in every fight.\nYou will dance to it.' },
    style: { name: 'ribbon', def: { c: ['#f15bb5', '#ffe0f3', '#9b5de5'], shape: 'thread', g: 0, spd: 2.4, life: 18, drag: 0.9 } },
    moves: {
      u: { id: 'ribbon_lash', name: 'Ribbon Lash', cost: 20, dmg: 10, desc: 'A ribbon cracks out in front of you. A beat pulses under your feet: skills thrown on it hit 35% harder and give back 10 energy.',
        cast(p, z, dmg) { dmg = Math.round(dmg * beat(p)); const dir = p.face, hs = new Set(); sfx('swing'); pose(p, 'a4', 1, 14);
          z.shots.push(new Vis(p.x, p.y, 14, (ctx, x, y, t) => { const k = t < 6 ? t / 6 : 1 - (t - 6) / 8, px = Math.round(p.x - G.cam.x) + dir * 8, py = Math.round(p.y - G.cam.y) - 22; ribbon(ctx, px, py, px + Math.round(dir * 96 * k), py, t, '#f15bb5'); }, v => { const k = v.t < 6 ? v.t / 6 : 1, r = 8 + 96 * k; if (v.t <= 8) hit(dir > 0 ? p.x : p.x - r, p.y - 32, r, 22, dmg, { kx: dir * 2, stun: 26, hitSet: hs, srcX: p.x }); })); } },
      su: { id: 'pirouette', name: 'Pirouette', dmg: 5, desc: 'Spin across the floor, ribbons out, cutting everything you pass three times.',
        cast(p, z, dmg) { dmg = Math.round(dmg * beat(p)); dash(p, z, 'ribbon', { n: 18, step: 5, dmg, every: 6, pose: ['cheer', 0], atk: { kx: p.face * 1, ky: -1.5 } }); } },
      i: { id: 'grand_jete', name: 'Grand Jete', dmg: 20, desc: 'Leap far forward and land in a ring of ribbons that throws everyone up. Smashes cracked walls.',
        cast(p, z, dmg) { dmg = Math.round(dmg * beat(p)); const dir = p.face, e = ahead(p, z, 220), tx = e ? e.x : p.x + dir * 110; sfx('jump'); p.vy = -7; p.onGround = false; p.y -= 1; p.pose = ['jump', 0];
          z.shots.push(new Drive(p, 40, t => { p.vx = 0; const gx = e && !e.dead ? e.x : tx, dx = gx - p.x; if (Math.abs(dx) > 3) slide(p, z, Math.sign(dx), Math.min(4, Math.abs(Math.round(dx)))); p.pose = ['air', 1]; if (t > 6 && p.onGround) return false; }, () => { boom(p, 'ribbon', p.x, p.y - 10, 44, dmg, { ky: -7, launch: true, breaker: true }); })); } },
      si: { id: 'crescendo', name: 'Crescendo', dmg: 7, desc: 'Four rings of ribbon spread from you, each wider and harder than the last.',
        cast(p, z, dmg) { dmg = Math.round(dmg * beat(p)); for (let k = 0; k < 4; k++) z.shots.push(new Later(1 + k * 10, () => { if (p.dead) return; const r = 40 + k * 22; sfx(k === 3 ? 'heavy' : 'swing'); fx.ring(p.x, p.y - 18, k % 2 ? '#9b5de5' : '#f15bb5', 6, r, 12); hit(p.x - r, p.y - 50, r * 2, 52, Math.round(dmg * (1 + k * 0.3)), { ky: k === 3 ? -6 : -2, stun: 28, srcX: p.x }); })); } },
      sig: { id: 'spotlight', name: 'Spotlight', dmg: 12, desc: 'A spotlight finds the nearest enemy: they freeze in it, and the light bursts.',
        cast(p, z, d) { const e = nearest(z, p.x, p.y - 16, 260); if (!e) return; sfx('perfect');
          z.shots.push(new Vis(e.x, e.y, 50, (ctx, x, y, t) => { const a = Math.min(1, t / 6) * (t > 42 ? (50 - t) / 8 : 1); ctx.globalAlpha = 0.3 * a; art.rect(ctx, '#ffe0f3', x - 14, 0, 28, y); ctx.globalAlpha = 1; }, v => { if (!e.dead) { v.x = e.x; v.y = e.y; } if (v.t === 6) hit(v.x - 14, v.y - 46, 28, 48, Math.round(d * 0.5), { ky: 0, kx: 0, stun: 50, status: { freeze: 50 }, srcX: v.x }); if (v.t === 40) boom(p, 'ribbon', v.x, v.y - 20, 30, d, { ky: -5 }); })); } },
      ult: { id: 'finale', name: 'Finale', dmg: 11, desc: 'the music swells: ribbons fill the arena and cut everyone on every beat, then the curtain falls.',
        fn: ult({ st: 'ribbon', every: 8, during(p, z) { if (p.st % 2 === 0) emit('ribbon', G.cam.x + rand(0, W), G.cam.y + rand(20, 200), 1); }, each(p, z, e) { const b = e.box(); fx.slash(b.x + b.w / 2, b.y + b.h / 2, Math.random() < 0.5 ? 1 : -1, 2, '#f15bb5', 40); } }) }
    },
    mode: ['allegro', 'Allegro'], awaken: ['prima', 'Prima'],
    trait: { mark(ctx, p, x, y) { const k = SW.frame % BEAT, on = onBeat(); art.rect(ctx, '#05060c', x - 4, y - 53, 9, 6); art.rect(ctx, on ? '#ffffff' : '#9b5de5', x - 3, y - 52, Math.round(7 * (1 - k / BEAT)) || 1, 4); } },
    fin(p, z, d) { const dir = p.face; sfx('swing'); emit('ribbon', p.x + dir * 30, p.y - 22, 10, { dir }); hit(dir > 0 ? p.x + 6 : p.x - 76, p.y - 34, 70, 22, d, { kx: dir * 1.5, stun: 22, srcX: p.x }); },
    lines: [['And... curtain.', 'そして……幕引き。', 'Y... telón.', '然后……落幕。'], ['You missed a step.', 'ステップを間違えたわね。', 'Te saltaste un paso.', '你漏了一步。'], ['Encore? No.', 'アンコール？ないわ。', '¿Otra? No.', '返场？没有。']],
    rig: { head: 'long', c: { skin: '#f0c8b0', hair: '#9b5de5', top: '#f15bb5', arm: '#f0c8b0', fore: '#ffe0f3', hand: '#f0c8b0', pants: '#3a1a4a', boots: '#f15bb5', belt: '#ffe0f3', chest: '#ffe0f3', trail: '#f15bb5' }, trailLen: 6 }, borrow: 'kiri',
    tr: {
      'The Ribbon Dance': ['La Danza del Lazo', '彩带之舞'], 'Ribbon': ['Lazo', '彩带'], 'On the Beat': ['Al Compás', '踩点'], 'She hears music in every fight.': ['Oye música en cada pelea.', '她在每场战斗中都听见音乐。'], 'You will dance to it.': ['Y tú bailarás al ritmo.', '而你会随之起舞。'],
      'Ribbon Lash': ['Latigazo de Lazo', '彩带鞭'], 'A ribbon cracks out in front of you. A beat pulses under your feet: skills thrown on it hit 35% harder and give back 10 energy.': ['Un lazo restalla delante de ti. Un compás late bajo tus pies: las habilidades lanzadas a tiempo pegan un 35% más fuerte y devuelven 10 de energía.', '彩带在你面前甩出。脚下有节拍跳动：踩点放出的技能伤害提升35%，并返还10点能量。'],
      'Pirouette': ['Pirueta', '旋转'], 'Spin across the floor, ribbons out, cutting everything you pass three times.': ['Giras por el suelo con los lazos extendidos, cortando tres veces todo lo que atraviesas.', '展开彩带在地上旋转前进，斩过经过的一切三次。'],
      'Grand Jete': ['Gran Jeté', '大跳'], 'Leap far forward and land in a ring of ribbons that throws everyone up. Smashes cracked walls.': ['Saltas muy lejos y caes en un anillo de lazos que lanza a todos por los aires. Rompe muros agrietados.', '向前远远跃起，落地时彩带成环，把所有人掀上天。能击碎裂墙。'],
      'Crescendo': ['Crescendo', '渐强'], 'Four rings of ribbon spread from you, each wider and harder than the last.': ['Cuatro anillos de lazo se extienden desde ti, cada uno más amplio y más fuerte que el anterior.', '四圈彩带从你身边扩散，一圈比一圈更大、更猛。'],
      'Spotlight': ['Foco', '聚光灯'], 'A spotlight finds the nearest enemy: they freeze in it, and the light bursts.': ['Un foco encuentra al enemigo más cercano: se queda congelado y la luz estalla.', '聚光灯锁定最近的敌人：他僵在光里，然后光芒炸开。'],
      'Allegro': ['Allegro', '快板'], 'Prima': ['Prima', '首席'], 'Finale': ['Final', '终曲'], 'ON BEAT!': ['¡A TIEMPO!', '踩点！']
    },
    ultTr: ['la música crece: los lazos llenan la arena y cortan a todos en cada compás, y luego cae el telón.', '音乐渐强：彩带布满竞技场，每个节拍都斩向所有人，然后大幕落下。']
  });

  // ================= Vesna =================
  const bleed = p => { const S = G.state, n = Math.round(p.hpMax() * 0.04); if (S && S.hp > n + 1) { S.hp -= n; fx.text(p.x, p.y - 40, '-' + n, '#9d0208'); emit('blood', p.x, p.y - 20, 6); } };
  clan('vesna', {
    hero: { name: 'Vesna', alias: 'Red Thread', title: 'The Bloodprice', energy: 'Blood', color: '#d00000', colorHi: '#ffb3b3', element: 'Blood', sig: 'Bloodprice', combo: 'claw', route: 'kael', pitch: 360, trait: 'bloodprice', blurb: 'Everything has a price.\nShe pays it in red, and collects in red.' },
    style: { name: 'blood', def: { c: ['#9d0208', '#e5383b', '#ffb3b3'], shape: 'drop', g: 0.2, spd: 2.6, life: 22, drag: 0.95 } },
    moves: {
      u: { id: 'blood_needle', name: 'Blood Needle', cost: 20, dmg: 11, desc: 'A needle of blood that goes through two enemies. Skills cost 4% of your health, but you hit 20% harder and every hit heals you for 15% of it.',
        cast(p, z, dmg, up) { bleed(p); sfx('shoot'); shot(p, z, 'blood', { dmg, vx: p.face * 9.5, vy: up ? -4.5 : 0, w: 12, h: 6, life: 30, pierce: true, maxHits: 2, paint(ctx, x, y, s) { const d = Math.sign(s.vx) || 1; art.rect(ctx, '#9d0208', x - 6, y - 1, 12, 2); art.rect(ctx, '#ffb3b3', x + (d > 0 ? 3 : -6), y - 1, 3, 1); } }); } },
      su: { id: 'crimson_step', name: 'Crimson Step', dmg: 13, desc: 'Dash through the enemy in a spray of red.',
        cast(p, z, dmg) { bleed(p); dash(p, z, 'blood', { n: 12, step: 7, dmg, atk: { stun: 30 } }); } },
      i: { id: 'blood_moon_scythe', name: 'Blood Moon Scythe', dmg: 13, desc: 'Two great sweeps of a scythe of blood, front and back. Smashes cracked walls.',
        cast(p, z, dmg) { bleed(p); [0, 12].forEach((d, k) => z.shots.push(new Later(d + 1, () => { if (p.dead) return; sfx(k ? 'heavy' : 'swing'); fx.slash(p.x + p.face * 18, p.y - 22, k ? -p.face : p.face, 3, '#e5383b', 60); emit('blood', p.x + p.face * 30, p.y - 22, 12, { dir: p.face }); hit(p.x - 64, p.y - 52, 128, 54, dmg, { ky: k ? -6 : -2, stun: 34, breaker: k === 1, heavy: true, srcX: p.x }); }))); } },
      si: { id: 'hemorrhage', name: 'Hemorrhage', dmg: 9, desc: 'Open a wound on the nearest enemy: it bleeds four times over two seconds, and every drop comes back to you.',
        cast(p, z, dmg) { bleed(p); const e = nearest(z, p.x, p.y - 16, 200); if (!e) return; sfx('heavy'); hurt(e, dmg, { stun: 30 });
          for (let k = 1; k <= 4; k++) z.shots.push(new Later(k * 30, () => { if (e.dead) return; const b = e.box(); emit('blood', b.x + b.w / 2, b.y + b.h / 2, 8); hurt(e, dmg, { ky: 0, kx: 0, stun: 14, heavy: false }); if (!p.dead) p.heal(Math.round(dmg * 0.5)); })); } },
      sig: { id: 'red_rain', name: 'Red Rain', dmg: 6, desc: 'Blood falls like rain round the nearest enemy, five times.',
        cast(p, z, d) { const e = ahead(p, z, 240) || nearest(z, p.x, p.y, 200), x0 = e ? e.x : p.x + p.face * 80; sfx('charge'); for (let k = 0; k < 5; k++) z.shots.push(new Later(4 + k * 6, () => { const x = (e && !e.dead ? e.x : x0) + rand(-20, 20); shot(p, z, 'blood', { x, y: G.cam.y + 10, vx: 0, vy: 9, dmg: d, life: 40, w: 10, h: 12, ky: 2, paint(ctx, xx, yy) { art.rect(ctx, '#e5383b', xx - 2, yy - 6, 4, 10); art.rect(ctx, '#ffb3b3', xx - 1, yy - 6, 1, 4); } }); })); } },
      ult: { id: 'crimson_eclipse', name: 'Crimson Eclipse', dmg: 10, desc: 'the moon turns red: everyone bleeds again and again, and everything they lose flows into her.',
        fn: ult({ st: 'blood', every: 8, start(p, z) { z.shots.push(new Vis(0, 0, 64, (ctx, x, y, t) => { ctx.globalAlpha = 0.3 * Math.min(1, t / 8, (64 - t) / 8); art.rect(ctx, '#3a0008', 0, 0, W, SW.H); ctx.globalAlpha = 1; art.disc(ctx, '#d00000', W / 2, 40, 18); })); }, each(p, z, e, d) { const b = e.box(); emit('blood', b.x + b.w / 2, b.y + b.h / 2, 10); p.heal(Math.round(d * 0.3)); } }) }
    },
    mode: ['open_veins', 'Open Veins'], awaken: ['red_moon', 'Red Moon'],
    trait: { dmg: () => 1.2, hit(p, atk) { const n = (atk.dealt || atk.dmg || 0) * 0.15; p.vamp = (p.vamp || 0) + n; if (p.vamp >= 2) { const k = Math.floor(p.vamp); p.vamp -= k; const S = G.state; if (S) S.hp = Math.min(p.hpMax(), S.hp + k); } } },
    fin(p, z, d) { sfx('swing'); emit('blood', p.x + p.face * 26, p.y - 22, 12, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 56, p.y - 38, 48, 34, d, { kx: p.face * 2, stun: 24, srcX: p.x }); },
    lines: [['Paid in full.', '全額、支払ってもらったわ。', 'Pagado por completo.', '全部付清了。'], ['Your blood remembers me.', 'あなたの血が私を覚えている。', 'Tu sangre me recuerda.', '你的血会记住我。'], ['Red suits you.', '赤が似合うわね。', 'El rojo te sienta bien.', '红色很适合你。']],
    rig: { head: 'long', weapon: 'scythe', c: { skin: '#e8d0c8', hair: '#3a0008', top: '#2a0a0e', arm: '#2a0a0e', fore: '#9d0208', hand: '#e8d0c8', pants: '#1a0608', boots: '#3a0a0e', belt: '#d00000', chest: '#ffb3b3', trail: '#9d0208' }, trailLen: 5 }, borrow: 'vesper',
    tr: {
      'The Bloodprice': ['El Precio de Sangre', '血之代价'], 'Blood': ['Sangre', '血'], 'Bloodprice': ['Precio de Sangre', '血价'], 'Everything has a price.': ['Todo tiene un precio.', '万物皆有代价。'], 'She pays it in red, and collects in red.': ['Ella lo paga en rojo, y lo cobra en rojo.', '她用鲜血支付，也用鲜血收取。'],
      'Blood Needle': ['Aguja de Sangre', '血针'], 'A needle of blood that goes through two enemies. Skills cost 4% of your health, but you hit 20% harder and every hit heals you for 15% of it.': ['Una aguja de sangre que atraviesa a dos enemigos. Las habilidades cuestan un 4% de tu salud, pero pegas un 20% más fuerte y cada golpe te cura el 15% de su daño.', '一根血针，能贯穿两个敌人。技能消耗4%生命，但伤害提升20%，每次命中都会回复其伤害15%的生命。'],
      'Crimson Step': ['Paso Carmesí', '赤红步'], 'Dash through the enemy in a spray of red.': ['Atraviesas al enemigo en una lluvia roja.', '在一片血雾中冲穿敌人。'],
      'Blood Moon Scythe': ['Guadaña de Luna Roja', '血月镰'], 'Two great sweeps of a scythe of blood, front and back. Smashes cracked walls.': ['Dos grandes barridos de una guadaña de sangre, delante y detrás. Rompe muros agrietados.', '血之镰刀前后两次大横扫。能击碎裂墙。'],
      'Hemorrhage': ['Hemorragia', '大出血'], 'Open a wound on the nearest enemy: it bleeds four times over two seconds, and every drop comes back to you.': ['Abres una herida en el enemigo más cercano: sangra cuatro veces en dos segundos y cada gota vuelve a ti.', '在最近的敌人身上划开伤口：两秒内流血四次，每一滴都回到你身上。'],
      'Red Rain': ['Lluvia Roja', '血雨'], 'Blood falls like rain round the nearest enemy, five times.': ['La sangre cae como lluvia alrededor del enemigo más cercano, cinco veces.', '鲜血如雨般在最近的敌人周围落下五次。'],
      'Open Veins': ['Venas Abiertas', '敞开血脉'], 'Red Moon': ['Luna Roja', '赤月'], 'Crimson Eclipse': ['Eclipse Carmesí', '赤红之蚀']
    },
    ultTr: ['la luna se vuelve roja: todos sangran una y otra vez, y todo lo que pierden fluye hacia ella.', '月亮变红：所有人一次次流血，而他们失去的一切都流向她。']
  });

  // ================= Apis =================
  const beeArt = (ctx, x, y, t) => { art.rect(ctx, '#fca311', x - 2, y - 1, 4, 3); art.rect(ctx, '#1a1a1a', x - 1, y - 1, 1, 3); art.rect(ctx, '#ffffff', x - 1, y - 3 + (t % 4 < 2 ? 0 : 1), 3, 1); };
  const beeShot = (p, z, x, y, dmg, a) => shot(p, z, 'bee', { x, y, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4, dmg, life: 80, ghost: true, w: 8, h: 8, kx: 0.6, stun: 16, paint(ctx, xx, yy, s) { beeArt(ctx, xx, yy, s.t); },
    tick(s) { const e = nearest(z, s.x, s.y, 260); if (e) { const ax = e.x - s.x, ay = e.y - e.h / 2 - s.y, m = Math.hypot(ax, ay) || 1; s.vx += (ax / m * 5 - s.vx) * 0.15; s.vy += (ay / m * 5 - s.vy) * 0.15 + Math.sin(s.t * 0.8) * 0.3; } } });
  const swarm = (p, z, n, dmg) => { for (let i = 0; i < n; i++) z.shots.push(new Later(1 + i * 2, () => { if (!p.dead) beeShot(p, z, p.x + rand(-10, 10), p.y - 24 + rand(-8, 8), dmg, rand(0, Math.PI * 2)); })); };
  clan('apis', {
    hero: { name: 'Apis', alias: 'Queen', title: 'The Hive Mind', energy: 'Nectar', color: '#fca311', colorHi: '#fff1b8', element: 'Bees', sig: 'Swarm', combo: 'flame', route: 'nyra', pitch: 560, trait: 'swarm', blurb: 'She is never alone.\nShe is never quiet, either.' },
    style: { name: 'bee', def: { c: ['#fca311', '#1a1a1a', '#fff1b8'], shape: 'ember', g: 0, spd: 2.2, life: 18, drag: 0.9 } },
    moves: {
      u: { id: 'sting', name: 'Sting', cost: 20, dmg: 9, desc: 'Send one bee after the nearest enemy. Every hit you land adds a bee to your swarm; at eight, they all attack.',
        cast(p, z, dmg) { sfx('shoot'); beeShot(p, z, p.x + p.face * 12, p.y - 24, dmg, p.face > 0 ? 0 : Math.PI); } },
      su: { id: 'honey_trap', name: 'Honey Trap', dmg: 3, desc: 'Pour honey on the floor ahead for four seconds. Enemies in it are stuck fast and stung.',
        cast(p, z, dmg) { const x = p.x + p.face * 56, gy = floorY(z, x, p.y - 20); sfx('land'); area(p, z, 'bee', { x, y: gy, w: 70, h: 26, life: 240, every: 20, dmg, atk: { status: { freeze: 24 }, stun: 20 }, paint(ctx, sx, sy, t, s, a) { ctx.globalAlpha = 0.8 * a; art.rect(ctx, '#e8a317', sx - 35, sy - 3, 70, 4); art.rect(ctx, '#fff1b8', sx - 30, sy - 4, 20, 1); ctx.globalAlpha = 1; } }); } },
      i: { id: 'hive_burst', name: 'Hive Burst', dmg: 4, desc: 'Throw a hive: it breaks where it lands and eight bees pour out and chase. Smashes cracked walls.',
        cast(p, z, dmg) { sfx('swing'); shot(p, z, 'bee', { dmg: dmg * 2, vx: p.face * 4.5, vy: -3.5, g: 0.25, life: 60, w: 14, h: 14, breaker: true, paint(ctx, x, y) { art.disc(ctx, '#e8a317', x, y, 6); for (let i = -4; i <= 4; i += 3) art.rect(ctx, '#a06a10', x - 6, y + i, 12, 1); }, onEnd(g, zz) { const x = this.x, y = this.y; sfx('burst'); for (let i = 0; i < 8; i++) beeShot(p, zz, x, y, dmg, i / 8 * Math.PI * 2); } }); } },
      si: { id: 'royal_jelly', name: 'Royal Jelly', dmg: 5, desc: 'Heal 10% of your health, and your whole swarm, plus four new bees, flies at the enemy.',
        cast(p, z, dmg) { sfx('heal'); p.heal(Math.round(p.hpMax() * 0.1)); const n = (p.bees || 0) + 4; p.bees = 0; swarm(p, z, n, dmg); } },
      sig: { id: 'waggle_dance', name: 'Waggle Dance', dmg: 4, desc: 'Your bees circle the nearest enemy for two seconds, stinging over and over.',
        cast(p, z, d) { const e = nearest(z, p.x, p.y - 16, 240); if (!e) return; sfx('charge');
          z.shots.push(new Vis(e.x, e.y, 120, (ctx, x, y, t) => { for (let i = 0; i < 6; i++) { const a = t * 0.2 + i * 1.05; beeArt(ctx, x + Math.round(Math.cos(a) * 18), y - 18 + Math.round(Math.sin(a) * 10), t + i); } }, v => { if (!e.dead) { v.x = e.x; v.y = e.y; } if (v.t % 15 === 0) hurt(e, d, { ky: 0, kx: 0, stun: 14, heavy: false }); })); } },
      ult: { id: 'killer_swarm', name: 'Killer Swarm', dmg: 8, desc: 'the sky goes dark with bees, and they find everyone.',
        fn: ult({ st: 'bee', every: 6, during(p, z) { if (p.st % 2 === 0) { const d = Math.random() < 0.5 ? 1 : -1; z.shots.push(new Vis(G.cam.x + (d > 0 ? 0 : W), G.cam.y + rand(30, 220), 60, (ctx, x, y, t) => beeArt(ctx, x + d * t * 8, y + Math.round(Math.sin(t * 0.5) * 6), t))); } } }) }
    },
    mode: ['busy_bees', 'Busy Bees'], awaken: ['queen_bee', 'Queen Bee'],
    trait: {
      hit(p, atk) { if (p.launching) return; p.bees = Math.min(8, (p.bees || 0) + 1); },
      tick(p, g, z) { if ((p.bees || 0) >= 8 && N.nearest(z, p.x, p.y - 16, 260)) { p.bees = 0; p.launching = true; pop(p, 'SWARM!', '#fca311'); swarm(p, z, 8, Math.max(2, Math.round(3 * p.dmgMul()))); z.shots.push(new Later(20, () => { p.launching = false; })); } },
      mark(ctx, p, x, y) { const n = p.bees || 0; for (let i = 0; i < n; i++) { const a = SW.frame * 0.12 + i / 8 * Math.PI * 2; beeArt(ctx, x + Math.round(Math.cos(a) * 16), y - 24 + Math.round(Math.sin(a) * 8), SW.frame + i); } }
    },
    fin(p, z, d) { sfx('shoot'); for (let i = 0; i < 3; i++) beeShot(p, z, p.x + p.face * 14, p.y - 24, Math.max(1, Math.round(d * 0.4)), (p.face > 0 ? 0 : Math.PI) + (i - 1) * 0.4); },
    lines: [['Bzzz. Done.', 'ブーン。おしまい。', 'Bzzz. Listo.', '嗡嗡。搞定。'], ['The hive thanks you.', '巣があなたに感謝してる。', 'La colmena te lo agradece.', '蜂巢感谢你。'], ['Never poke a hive.', '巣をつついちゃだめよ。', 'Nunca molestes a una colmena.', '永远别捅马蜂窝。']],
    rig: { head: 'crown', c: { skin: '#d8a878', hair: '#1a1a1a', acc: '#fca311', glow: '#fff1b8', top: '#fca311', arm: '#1a1a1a', fore: '#fca311', hand: '#d8a878', pants: '#1a1a1a', boots: '#fca311', belt: '#1a1a1a', chest: '#fff1b8', trail: '#fff1b8' }, trailLen: 4 }, borrow: 'pyra',
    tr: {
      'The Hive Mind': ['La Mente Colmena', '蜂巢意志'], 'Bees': ['Abejas', '蜂群'], 'Swarm': ['Enjambre', '蜂群'], 'She is never alone.': ['Nunca está sola.', '她从不孤单。'], 'She is never quiet, either.': ['Y tampoco está nunca callada.', '也从不安静。'],
      'Sting': ['Aguijón', '蜂刺'], 'Send one bee after the nearest enemy. Every hit you land adds a bee to your swarm; at eight, they all attack.': ['Mandas una abeja tras el enemigo más cercano. Cada golpe que aciertas añade una abeja a tu enjambre; con ocho, atacan todas.', '派一只蜜蜂追击最近的敌人。每次命中都会让蜂群多一只蜜蜂；满八只时，它们会一起进攻。'],
      'Honey Trap': ['Trampa de Miel', '蜜糖陷阱'], 'Pour honey on the floor ahead for four seconds. Enemies in it are stuck fast and stung.': ['Viertes miel en el suelo delante durante cuatro segundos. Los enemigos que la pisan se quedan pegados y reciben picaduras.', '在前方地面倒上蜂蜜，持续四秒。踩进去的敌人会被粘住并被蜇。'],
      'Hive Burst': ['Estallido de Colmena', '蜂巢爆裂'], 'Throw a hive: it breaks where it lands and eight bees pour out and chase. Smashes cracked walls.': ['Lanzas una colmena: se rompe al caer y salen ocho abejas que persiguen. Rompe muros agrietados.', '扔出一个蜂巢：落地碎开，八只蜜蜂涌出追击。能击碎裂墙。'],
      'Royal Jelly': ['Jalea Real', '蜂王浆'], 'Heal 10% of your health, and your whole swarm, plus four new bees, flies at the enemy.': ['Te curas un 10% de la salud, y todo tu enjambre, más cuatro abejas nuevas, vuela hacia el enemigo.', '回复10%生命，整个蜂群再加四只新蜜蜂一起扑向敌人。'],
      'Waggle Dance': ['Danza de la Abeja', '摇摆舞'], 'Your bees circle the nearest enemy for two seconds, stinging over and over.': ['Tus abejas rodean al enemigo más cercano durante dos segundos, picándole una y otra vez.', '你的蜜蜂围着最近的敌人盘旋两秒，一次次蜇刺。'],
      'Busy Bees': ['Abejas Obreras', '忙碌蜂群'], 'Queen Bee': ['Abeja Reina', '蜂后'], 'Killer Swarm': ['Enjambre Asesino', '杀人蜂群'], 'SWARM!': ['¡ENJAMBRE!', '蜂群出击！']
    },
    ultTr: ['el cielo se oscurece de abejas, y encuentran a todos.', '天空被蜂群遮暗，它们找到了每一个人。']
  });

  // ================= Hex =================
  clan('hex', {
    hero: { name: 'Hex', alias: 'Jinx', title: 'The Delayed Doom', energy: 'Malice', color: '#80ffdb', colorHi: '#ffffff', element: 'Curse', sig: 'Echo of Pain', combo: 'dagger', route: 'kael', modeKind: 'speed', pitch: 400, trait: 'curse', blurb: 'What she does to you\nhappens twice.' },
    style: { name: 'curse', def: { c: ['#80ffdb', '#1b263b', '#ffffff'], shape: 'wisp', g: -0.03, spd: 1.4, life: 26, drag: 0.9 } },
    moves: {
      u: { id: 'hex_bolt', name: 'Hex Bolt', dmg: 10, desc: 'A slow ghostly bolt that turns after the enemy. 30% of all the damage you deal hits again two seconds later.',
        cast(p, z, dmg) { sfx('shoot'); shot(p, z, 'curse', { dmg, vx: p.face * 4.2, life: 70, ghost: true, r: 5, tick(s) { const e = nearest(z, s.x, s.y, 200); if (e && s.t > 6) { const ay = e.y - e.h / 2 - s.y; s.vy += SW.clamp(ay * 0.01, -0.25, 0.25); s.vy *= 0.95; } } }); } },
      su: { id: 'soul_swap', name: 'Soul Swap', dmg: 10, desc: 'Change places with the nearest enemy, and leave them dizzy where you stood.',
        cast(p, z, dmg) { const e = nearest(z, p.x, p.y - 16, 220); if (!e) return; const f = fighterOf(e), q = f ? f.p : (e.isBoss || (e.def && e.def.heavy) ? null : e); sfx('perfect'); emit('curse', p.x, p.y - 18, 12); emit('curse', e.x, e.y - 18, 12);
          if (q) { const x = p.x; p.x = q.x; q.x = x; } p.face = e.x >= p.x ? 1 : -1; p.iframes = Math.max(p.iframes, 12); hurt(e, dmg, { ky: 0, kx: 0, stun: 50, heavy: false, status: { freeze: 30 } }); } },
      i: { id: 'voodoo_pins', name: 'Voodoo Pins', dmg: 5, desc: 'Six pins rain down on the nearest enemy ahead. Smashes cracked walls.',
        cast(p, z, dmg) { const e = ahead(p, z, 240) || nearest(z, p.x, p.y, 200), x0 = e ? e.x : p.x + p.face * 90; sfx('charge');
          for (let k = 0; k < 6; k++) z.shots.push(new Later(6 + k * 4, () => { const x = (e && !e.dead ? e.x : x0) + rand(-8, 8); shot(p, z, 'curse', { x, y: G.cam.y + 10, vx: 0, vy: 10, dmg, life: 40, w: 8, h: 14, ky: 2, breaker: k === 5, paint(ctx, xx, yy) { art.rect(ctx, '#c8ccd8', xx, yy - 8, 1, 12); art.rect(ctx, '#80ffdb', xx - 1, yy - 9, 3, 3); } }); })); } },
      si: { id: 'doom_mark', name: 'Doom Mark', dmg: 30, desc: 'Brand the nearest enemy. Three seconds later the mark goes off, whatever they do.',
        cast(p, z, dmg) { const e = nearest(z, p.x, p.y - 16, 240); if (!e) return; sfx('perfect'); hurt(e, 1, { ky: 0, kx: 0, stun: 10, heavy: false });
          const lk = (q => (q && (fighterOf(q) ? fighterOf(q).p : q).state === 'hurt' ? q : null))(ahead(p, z, 140));  const T0 = lk ? 34 : 180;   // branded in the middle of a combo, the mark bursts while they are still reeling
          z.shots.push(new Vis(e.x, e.y, T0, (ctx, x, y, t) => { const k = t / T0; art.ring(ctx, '#80ffdb', x, y - 50, 6); art.rect(ctx, '#05060c', x - 8, y - 62, 16, 3); art.rect(ctx, '#80ffdb', x - 8, y - 62, Math.round(16 * k), 3); }, v => { if (!e.dead) { v.x = e.x; v.y = e.y; } if (v.t === T0 - 1 && !e.dead) { const b = e.box(); emit('curse', b.x + b.w / 2, b.y + b.h / 2, 24, { power: 2 }); sfx('explode'); fx.shake(6, 10); hurt(e, dmg, { ky: -6, stun: 44, down: true }); } })); } },
      sig: { id: 'hollow', name: 'Hollow', dmg: 9, desc: 'Turn to a ghost for a moment and drift through the enemy, cursing them twice on the way.',
        cast(p, z, d) { p.iframes = Math.max(p.iframes, 30); dash(p, z, 'curse', { n: 16, step: 5, dmg: d, every: 8, pose: ['cheer', 0], atk: { stun: 26 } }); } },
      ult: { id: 'requiem', name: 'Requiem', dmg: 9, desc: 'the dead sing: ghosts pass through everyone again and again, and every wound opens twice.',
        fn: ult({ st: 'curse', every: 8, during(p, z) { if (p.st % 3 === 0) { const d = Math.random() < 0.5 ? 1 : -1; z.shots.push(new Vis(G.cam.x + (d > 0 ? 0 : W), G.cam.y + rand(60, 220), 50, (ctx, x, y, t) => { ctx.globalAlpha = 0.5; art.disc(ctx, '#80ffdb', x + d * t * 10, y, 5); art.rect(ctx, '#80ffdb', x + d * t * 10 - d * 10, y - 2, 10, 4); ctx.globalAlpha = 1; })); } } }) }
    },
    mode: ['ill_omen', 'Ill Omen'], awaken: ['grave_form', 'Grave Form'],
    trait: {
      hit(p, atk, e) {
        if (atk.curse || !e || e.dead) return;
        const n = Math.max(1, Math.round((atk.dealt || atk.dmg || 0) * 0.3)), z = G.zone; if (!z || !n) return;
        z.shots.push(new Later(120, () => { if (e.dead || p.dead) return; const b = e.box(); emit('curse', b.x + b.w / 2, b.y + b.h / 2, 6); hurt(e, n, { ky: 0, kx: 0, stun: 8, heavy: false, curse: true }); }));
      }
    },
    fin(p, z, d) { sfx('shoot'); shot(p, z, 'curse', { dmg: d, vx: p.face * 6, life: 20, r: 4 }); },
    lines: [['Twice the pain. Half the effort.', '痛みは二倍、手間は半分。', 'El doble de dolor. La mitad de esfuerzo.', '双倍痛苦，一半力气。'], ["You'll feel that tomorrow.", '明日も痛むわよ。', 'Lo sentirás mañana.', '你明天还会疼的。'], ['Cursed from the start.', '最初から呪われていたのよ。', 'Maldito desde el principio.', '你从一开始就被诅咒了。']],
    rig: { head: 'hood', c: { skin: '#b8c8c0', hair: '#1b263b', glow: '#80ffdb', top: '#1b263b', arm: '#1b263b', fore: '#0d1b2a', hand: '#b8c8c0', pants: '#0d1b2a', boots: '#1b263b', belt: '#80ffdb', chest: '#80ffdb', trail: '#80ffdb' }, trailLen: 6 }, borrow: 'vesper',
    tr: {
      'The Delayed Doom': ['La Condena Aplazada', '迟来的厄运'], 'Curse': ['Maldición', '诅咒'], 'Echo of Pain': ['Eco de Dolor', '痛苦回响'], 'What she does to you': ['Lo que ella te hace', '她对你做的事，'], 'happens twice.': ['ocurre dos veces.', '会发生两次。'],
      'Hex Bolt': ['Rayo Maldito', '咒弹'], 'A slow ghostly bolt that turns after the enemy. 30% of all the damage you deal hits again two seconds later.': ['Un lento rayo fantasmal que gira tras el enemigo. El 30% de todo el daño que haces vuelve a golpear dos segundos después.', '一道缓慢的幽灵飞弹，会转向追敌。你造成的所有伤害，其中30%会在两秒后再打一次。'],
      'Soul Swap': ['Cambio de Alma', '换魂'], 'Change places with the nearest enemy, and leave them dizzy where you stood.': ['Cambias de sitio con el enemigo más cercano y lo dejas aturdido donde estabas tú.', '与最近的敌人互换位置，让他在你原来的地方头晕目眩。'],
      'Voodoo Pins': ['Alfileres Vudú', '巫毒针'], 'Six pins rain down on the nearest enemy ahead. Smashes cracked walls.': ['Seis alfileres llueven sobre el enemigo más cercano delante de ti. Rompe muros agrietados.', '六根针落向前方最近的敌人。能击碎裂墙。'],
      'Doom Mark': ['Marca de Condena', '厄运印记'], 'Brand the nearest enemy. Three seconds later the mark goes off, whatever they do.': ['Marcas al enemigo más cercano. Tres segundos después la marca estalla, haga lo que haga.', '给最近的敌人打上印记。三秒后印记引爆，无论他做什么。'],
      'Hollow': ['Hueca', '空灵'], 'Turn to a ghost for a moment and drift through the enemy, cursing them twice on the way.': ['Te vuelves fantasma un momento y atraviesas al enemigo, maldiciéndolo dos veces al pasar.', '短暂化为幽灵飘过敌人，途中诅咒他两次。'],
      'Ill Omen': ['Mal Presagio', '不祥之兆'], 'Grave Form': ['Forma Sepulcral', '墓之形态'], 'Requiem': ['Réquiem', '安魂曲']
    },
    ultTr: ['los muertos cantan: los fantasmas atraviesan a todos una y otra vez, y cada herida se abre dos veces.', '亡者歌唱：幽灵一次次穿过所有人，每道伤口都裂开两次。']
  });
  // Versus balance (versus.js V.tune), fitted with tools/versus-balance.js against the fifteen regular heroes, both sides, bots on Normal: untuned 23-62%, with this table about 41-54%.
  if (SW.versus && SW.versus.tune) Object.assign(SW.versus.tune, { vex: 1.33, zara: 1.12, coda: 1.34, vesna: 1.02, apis: 1.08, hex: 0.92 });
})();
