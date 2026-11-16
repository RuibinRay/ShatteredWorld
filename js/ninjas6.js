'use strict';
// Shattered Worlds — Hidden Clans, wave six (Versus only; registered with ninja-kit.js). All original characters.
//   Opal    crystal: her skills grow crystals on the floor (four at most); hitting an enemy near one shatters it for more.
//   Taro    sumo: combo hits do not knock him off balance, and his throws cannot be guarded.
//   Rue     mimicry: her U and S+I copy the last skill the enemy used, 20% stronger.
//   Mako    mech: armour plating soaks 30 damage before his health; it rebuilds when he has not been hit for three seconds.
//   Sora    kite: hold jump while falling to glide.
//   Ryo     balance: U and S+U are light, I and S+I dark; switching sides builds Balance (+12% each, up to three), repeating a side loses it.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, W = SW.W, N = SW.ninja, V = SW.versus, K = SW.skillfx, I = SW.input;
  if (!N || !N.kit) return;
  const rand = SW.rand, HR = D.heroes, A = D.abilities, CASTS = SW.casts, P = SW.Player.prototype;
  const { clan, shot, area, boom, dash, column, ult, holder, refund, drag, pop, emit, hit, hurt, front, slide, ahead, nearest, floorY, fighterOf, pose, Later, Vis, Drive, sfx, pips } = N;

  // ================= Opal =================
  const CRY = ['#ff99c8', '#d0f4de', '#a9def9'];
  const crystalArt = (ctx, x, y, s) => { for (let i = 0; i < 3; i++) { const h = [14, 20, 12][i], ox = (i - 1) * 5; art.rect(ctx, CRY[i], x + ox - 2, y - h, 4, h); art.rect(ctx, '#ffffff', x + ox - 1, y - h, 1, Math.round(h / 2)); } };
  function grow(p, z, x) {
    const mine = z.shots.filter(s => s.isCrystal && s.p === p && !s.gone); if (mine.length >= 4) mine[0].gone = true;
    const gy = floorY(z, x, p.y - 20), c = new Vis(x, gy, 600, (ctx, sx, sy, t) => { ctx.globalAlpha = Math.min(1, t / 8, (600 - t) / 30); crystalArt(ctx, sx, sy); ctx.globalAlpha = 1; });
    c.isCrystal = true; c.p = p; z.shots.push(c); emit('crystal', x, gy - 8, 6, { up: true });
  }
  const shatter = (p, c, dmg) => { c.gone = true; sfx('block'); emit('crystal', c.x, c.y - 10, 16, { power: 1.6 }); fx.ring(c.x, c.y - 10, '#ff99c8', 4, 30, 10); N.hit(c.x - 26, c.y - 40, 52, 42, dmg, { ky: -4, stun: 26, srcX: c.x, shard: true }); };
  clan('opal', {
    hero: { name: 'Opal', alias: 'Geode', title: 'The Crystal Garden', energy: 'Lustre', color: '#ff99c8', colorHi: '#fcf6bd', element: 'Crystal', sig: 'Shatter', combo: 'flame', route: 'nyra', pitch: 700, trait: 'shatter', blurb: 'Everything she touches turns to crystal.\nEverything crystal breaks.' },
    style: { name: 'crystal', def: { c: CRY, shape: 'shard', g: 0.2, spd: 3, life: 22, drag: 0.95 } },
    moves: {
      u: { id: 'crystal_shard', name: 'Crystal Shard', cost: 20, dmg: 14, desc: 'A spike of crystal that grows a crystal where it lands. Hitting an enemy near one of your crystals shatters it for 10 more damage.',
        cast(p, z, dmg, up) { sfx('shoot'); shot(p, z, 'crystal', { dmg, vx: p.face * 8, vy: up ? -4 : 0.4, g: 0.05, life: 40, w: 10, h: 8, paint(ctx, x, y, s) { const d = Math.sign(s.vx) || 1; art.rect(ctx, '#ff99c8', x - 4, y - 2, 8, 4); art.rect(ctx, '#ffffff', x + (d > 0 ? 2 : -4), y - 1, 2, 2); }, onEnd(g, zz) { grow(p, zz, this.x); } }); } },
      su: { id: 'geode_wall', name: 'Geode Wall', dmg: 10, desc: 'Raise a wall of crystal in front of you for two seconds. Shots break on it; whoever is in its way is thrown back.',
        cast(p, z, dmg) { const x = p.x + p.face * 34, gy = floorY(z, x, p.y - 20); sfx('heavy'); hit(x - 18, gy - 50, 36, 52, dmg, { kx: p.face * 5, ky: -3, stun: 30, srcX: p.x });
          z.shots.push(new Vis(x, gy, 120, (ctx, sx, sy, t) => { const h = Math.round(50 * Math.min(1, t / 5)); ctx.globalAlpha = Math.min(1, (120 - t) / 15); art.rect(ctx, '#a9def9', sx - 6, sy - h, 12, h); art.rect(ctx, '#ff99c8', sx - 3, sy - h, 6, h); art.rect(ctx, '#ffffff', sx - 1, sy - h, 1, h); ctx.globalAlpha = 1; },
            v => { const of = G.scene === 'vs' && V.f ? V.f.find(f => f.p && f.p !== p) : null; (of ? of.shots : z.shots.filter(s => s.team === 'enemy')).forEach(s => { if (s.dmg !== undefined && s.x !== undefined && !s.isPuppet && !s.isClone && Math.abs(s.x - v.x) < 10 && s.y > v.y - 54 && s.y < v.y) { s.gone = true; emit('crystal', s.x, s.y, 4); } }); if (v.t === 119) grow(p, z, v.x); })); } },
      i: { id: 'crystal_bloom', name: 'Crystal Bloom', dmg: 15, desc: 'Three spires of crystal burst up in a row ahead, and each leaves a crystal behind. Smashes cracked walls.',
        cast(p, z, dmg) { sfx('charge'); const lk = (q => (q && (fighterOf(q) ? fighterOf(q).p : q).state === 'hurt' ? q : null))(ahead(p, z, 140));  const d0 = lk ? Math.max(16, Math.abs(lk.x - p.x)) : 42;   // out of a combo the first spire comes up under the target
          [d0, d0 + 34, d0 + 68].forEach((dx, k) => { const x = p.x + p.face * dx; column(z, 'crystal', x, floorY(z, x, p.y - 20), 6 + k * 6, dmg, { w: 18, h: 56, atk: { ky: -6, launch: k === 2, breaker: k === 2 } }); z.shots.push(new Later(14 + k * 6, (g, zz) => grow(p, zz, x))); }); } },
      si: { id: 'prism_prison', name: 'Prism Prison', dmg: 24, desc: 'Lock the nearest enemy in crystal for a second, then shatter it.',
        cast(p, z, dmg) { const e = nearest(z, p.x, p.y - 16, 220); if (!e) return; sfx('perfect'); hurt(e, Math.round(dmg * 0.3), { ky: 0, kx: 0, stun: 60, heavy: false, status: { freeze: 66 } });
          z.shots.push(new Vis(e.x, e.y, 60, (ctx, x, y, t) => { ctx.globalAlpha = 0.55; art.rect(ctx, '#a9def9', x - 12, y - 40, 24, 42); ctx.globalAlpha = 1; art.rect(ctx, '#ffffff', x - 12, y - 40, 2, 42); art.rect(ctx, '#ff99c8', x + 10, y - 40, 2, 42); }, v => { if (!e.dead) { v.x = e.x; v.y = e.y; } if (v.t === 59 && !e.dead) { sfx('explode'); emit('crystal', v.x, v.y - 20, 24, { power: 2 }); hurt(e, dmg, { ky: -6, down: true, stun: 44 }); } })); } },
      sig: { id: 'shatter_song', name: 'Shatter Song', dmg: 10, desc: 'Sing one high note: every crystal you have grown bursts at once.',
        cast(p, z, d) { sfx('perfect'); fx.ring(p.x, p.y - 20, '#fcf6bd', 6, 60, 14); const mine = z.shots.filter(s => s.isCrystal && s.p === p && !s.gone); if (!mine.length) { grow(p, z, p.x + p.face * 30); return; } mine.forEach((c, k) => z.shots.push(new Later(1 + k * 4, () => shatter(p, c, d)))); } },
      ult: { id: 'diamond_dust', name: 'Diamond Dust', dmg: 12, desc: 'the air itself turns to crystal and breaks, again and again, through everyone.',
        fn: ult({ st: 'crystal', every: 7, during(p, z) { if (p.st % 2 === 0) emit('crystal', G.cam.x + rand(0, W), G.cam.y + rand(10, 220), 2); } }) }
    },
    mode: ['gem_heart', 'Gem Heart'], awaken: ['diamond_skin', 'Diamond Skin'],
    trait: {
      hit(p, atk, e) { if (atk.shard || !e || e.dead) return; const z = G.zone, c = z && z.shots.find(s => s.isCrystal && s.p === p && !s.gone && Math.abs(s.x - e.x) < 40 && Math.abs(s.y - e.y) < 30); if (c) shatter(p, c, Math.max(2, Math.round(14 * p.dmgMul()))); },
      mark(ctx, p, x, y) { const n = G.zone ? G.zone.shots.filter(s => s.isCrystal && s.p === p && !s.gone).length : 0; if (n) pips(ctx, x, y - 50, n, 4, '#ff99c8'); }
    },
    fin(p, z, d) { sfx('block'); emit('crystal', p.x + p.face * 26, p.y - 20, 10, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 56, p.y - 36, 48, 32, d, { kx: p.face * 2, stun: 24, srcX: p.x }); },
    lines: [['Pretty. And broken.', '綺麗。そして粉々。', 'Bonito. Y roto.', '真美。也真碎。'], ['Flawless.', '完璧。', 'Impecable.', '完美无瑕。'], ['Crystal clear.', '一目瞭然ね。', 'Cristalino.', '一清二楚。']],
    rig: { head: 'bun', c: { skin: '#f8e0d8', hair: '#ff99c8', top: '#a9def9', arm: '#a9def9', fore: '#ff99c8', hand: '#f8e0d8', pants: '#5a4a7a', boots: '#ff99c8', belt: '#fcf6bd', chest: '#d0f4de', trail: '#ff99c8' }, trailLen: 3 }, borrow: 'mira',
    tr: {
      'The Crystal Garden': ['El Jardín de Cristal', '水晶花园'], 'Crystal': ['Cristal', '水晶'], 'Shatter': ['Estallido', '粉碎'], 'Everything she touches turns to crystal.': ['Todo lo que toca se vuelve cristal.', '她碰过的一切都会变成水晶。'], 'Everything crystal breaks.': ['Y todo el cristal se rompe.', '而水晶终会破碎。'],
      'Crystal Shard': ['Esquirla de Cristal', '水晶碎片'], 'A spike of crystal that grows a crystal where it lands. Hitting an enemy near one of your crystals shatters it for 10 more damage.': ['Una púa de cristal que hace crecer un cristal donde cae. Golpear a un enemigo junto a uno de tus cristales lo hace estallar con 10 de daño más.', '一根水晶尖刺，落地处会长出水晶。击中靠近你水晶的敌人时，水晶会碎裂，额外造成10点伤害。'],
      'Geode Wall': ['Muro de Geoda', '晶洞之墙'], 'Raise a wall of crystal in front of you for two seconds. Shots break on it; whoever is in its way is thrown back.': ['Levantas un muro de cristal delante durante dos segundos. Los disparos se rompen contra él; quien esté en medio sale despedido.', '在面前竖起一道水晶墙，持续两秒。飞行道具撞上就碎，挡路的人会被推开。'],
      'Crystal Bloom': ['Floración de Cristal', '水晶绽放'], 'Three spires of crystal burst up in a row ahead, and each leaves a crystal behind. Smashes cracked walls.': ['Tres agujas de cristal brotan en fila delante de ti, y cada una deja un cristal. Rompe muros agrietados.', '三座水晶尖塔在前方接连刺出，每座都会留下一块水晶。能击碎裂墙。'],
      'Prism Prison': ['Prisión Prisma', '棱镜牢笼'], 'Lock the nearest enemy in crystal for a second, then shatter it.': ['Encierras al enemigo más cercano en cristal un segundo y luego lo haces añicos.', '把最近的敌人封进水晶一秒，然后将其击碎。'],
      'Shatter Song': ['Canto Rompedor', '碎晶之歌'], 'Sing one high note: every crystal you have grown bursts at once.': ['Cantas una nota aguda: todos los cristales que has hecho crecer estallan a la vez.', '唱出一个高音：你种下的所有水晶同时炸裂。'],
      'Gem Heart': ['Corazón de Gema', '宝石之心'], 'Diamond Skin': ['Piel de Diamante', '钻石之肤'], 'Diamond Dust': ['Polvo de Diamante', '钻石星尘']
    },
    ultTr: ['el propio aire se vuelve cristal y se rompe, una y otra vez, a través de todos.', '空气本身化为水晶，一次又一次碎裂，穿过所有人。']
  });

  // ================= Taro =================
  clan('taro', {
    hero: { name: 'Taro', alias: 'Mountain', title: 'The Unmovable', energy: 'Spirit', color: '#e9c46a', colorHi: '#fff6d5', element: 'Sumo', sig: 'Grapple', combo: 'heavy', route: 'kael', pitch: 160, trait: 'grapple', blurb: 'You can push him.\nHe would rather you did not.' },
    style: { name: 'salt', def: { c: ['#ffffff', '#fff6d5', '#e9c46a'], shape: 'grain', g: 0.15, spd: 2.4, life: 24, drag: 0.94 } },
    moves: {
      u: { id: 'palm_push', name: 'Palm Push', dmg: 6, desc: 'Three open-hand shoves while you walk forward. Combo hits cannot knock you off balance, and your throws go through any guard.',
        cast(p, z, dmg) { const dir = p.face, hs = new Set(); sfx('heavy'); z.shots.push(new Drive(p, 24, t => { p.vx = 0; slide(p, z, dir, 2); p.pose = [t % 8 < 4 ? 'a1' : 'a2', 1]; if (t % 8 === 1) { hs.clear(); sfx('swing'); fx.slash(p.x + dir * 16, p.y - 22, dir, 1, '#fff6d5', 30); } hit(...front(p, 42, 44, 4), dmg, { kx: dir * 3.5, ky: -1, stun: 22, hitSet: hs, srcX: p.x }); })); } },
      su: { id: 'grab_throw', name: 'Grab and Throw', dmg: 16, desc: 'Grab the enemy in front of you and throw them over your shoulder. It cannot be guarded.',
        cast(p, z, dmg) { const e = z.ents.find(q => N.isFoe(q) && (q.x - p.x) * p.face > -8 && Math.abs(q.x - p.x) < 52 && Math.abs(q.y - p.y) < 30); sfx('swing'); pose(p, 'a4', 1, 18); if (!e) return;
          const f = fighterOf(e), q = f ? f.p : (e.isBoss ? null : e); if (q) { q.x = p.x - p.face * 28; } fx.shake(6, 10); sfx('heavy'); emit('salt', p.x - p.face * 20, p.y - 10, 12); hurt(e, dmg, { kx: -p.face * 3, ky: -5, stun: 44, down: true, unblockable: true }); } },
      i: { id: 'shiko_stomp', name: 'Shiko Stomp', dmg: 16, desc: 'Raise one leg high and stamp: the floor jumps under everyone near you. Smashes cracked walls.',
        cast(p, z, dmg) { sfx('charge'); z.shots.push(new Drive(p, 16, t => { p.vx = 0; p.pose = t < 10 ? ['a3', 0] : ['sweep', 1]; }, q => { sfx('explode'); fx.shake(9, 14); fx.dust(q.x, q.y, 14); fx.ring(q.x, q.y - 4, '#e9c46a', 6, 90, 14); hit(q.x - 90, q.y - 30, 180, 32, dmg, { ky: -7, launch: true, stun: 40, breaker: true, srcX: q.x }); })); } },
      si: { id: 'belly_slam', name: 'Belly Slam', dmg: 26, desc: 'Grab the nearest enemy, leap with them, and land on them. It cannot be guarded.',
        cast(p, z, dmg) { const e = nearest(z, p.x, p.y - 16, 70); sfx('roar'); if (!e) { pose(p, 'cheer', 0, 16); return; } const f = fighterOf(e), q = f ? f.p : (e.isBoss ? null : e);
          hurt(e, 1, { ky: 0, kx: 0, stun: 60, heavy: false, unblockable: true }); p.vy = -6.5; p.onGround = false; p.y -= 1;   // a lower hop: the slam lands while they are still held
          z.shots.push(new Drive(p, 50, t => { p.vx = 0; p.pose = ['air', 1]; if (q && !e.dead) { q.x = p.x + p.face * 10; q.y = Math.min(q.y, p.y); } if (t > 6 && p.onGround) return false; }, r => { sfx('explode'); fx.shake(10, 16); fx.dust(r.x, r.y, 14); emit('salt', r.x, r.y - 10, 20); hurt(e, dmg, { ky: -4, down: true, stun: 50, unblockable: true }); })); } },
      sig: { id: 'salt_toss', name: 'Salt Toss', dmg: 8, desc: 'Throw a fistful of salt: it stings everyone in front of you and leaves them blinking.',
        cast(p, z, d) { sfx('swing'); emit('salt', p.x + p.face * 14, p.y - 26, 24, { dir: p.face, spread: 0.5, power: 1.8 }); hit(...front(p, 90, 50, 0), d, { ky: -1, kx: p.face * 1, stun: 40, heavy: false, status: { freeze: 36 }, srcX: p.x }); } },
      ult: { id: 'grand_champion', name: 'Grand Champion', dmg: 11, desc: 'he throws everyone in the arena, one after another, and then lands on all of them.',
        fn: ult({ st: 'salt', every: 8, each(p, z, e) { fx.shake(5, 6); fx.dust(e.x, e.y, 6); }, atk: { unblockable: true, ky: -5 }, finalAtk: { unblockable: true } }) }
    },
    mode: ['rikishi', 'Rikishi'], awaken: ['yokozuna', 'Yokozuna'],
    trait: {
      // combo hits do not stagger him: the hit lands, but he keeps his footing (the awakening's super armour, for one hit)
      hurt(p, atk) { if (!atk.heavy && !atk.energy && !(p.awakeT > 0) && p.state !== 'hurt') { p.armorKeep = p.awakeT; p.awakeT = 1; p.armored = true; } return null; },
      after(p) { if (p.armored) { p.awakeT = p.armorKeep || 0; p.armored = false; } }
    },
    fin(p, z, d) { sfx('heavy'); fx.slash(p.x + p.face * 16, p.y - 22, p.face, 2, '#fff6d5', 36); hit(...front(p, 50, 44, 4), d, { kx: p.face * 5, ky: -2, stun: 26, srcX: p.x }); },
    lines: [['Out of the ring.', '土俵の外だ。', 'Fuera del círculo.', '出界了。'], ['Immovable.', '不動。', 'Inamovible.', '岿然不动。'], ['Bow. Then leave.', '礼をして、去れ。', 'Haz una reverencia. Y vete.', '鞠躬，然后离场。']],
    rig: { head: 'topknot', sc: 1.16, limb: 5, bulk: 13, c: { skin: '#d8a878', hair: '#1a1a1a', top: '#d8a878', arm: '#d8a878', fore: '#d8a878', hand: '#d8a878', pants: '#e9c46a', boots: '#d8a878', belt: '#e9c46a' } }, borrow: 'brakk',
    tr: {
      'The Unmovable': ['El Inamovible', '不动之人'], 'Sumo': ['Sumo', '相扑'], 'Grapple': ['Agarre', '擒抱'], 'You can push him.': ['Puedes empujarlo.', '你可以推他。'], 'He would rather you did not.': ['Él preferiría que no.', '但他更希望你别推。'],
      'Palm Push': ['Empujón de Palma', '突张'], 'Three open-hand shoves while you walk forward. Combo hits cannot knock you off balance, and your throws go through any guard.': ['Tres empujones con la palma mientras avanzas. Los golpes de combo no te desequilibran, y tus lanzamientos atraviesan cualquier guardia.', '边前进边推出三掌。连招攻击无法让你失去平衡，你的摔投无视格挡。'],
      'Grab and Throw': ['Agarre y Lanzamiento', '抓摔'], 'Grab the enemy in front of you and throw them over your shoulder. It cannot be guarded.': ['Agarras al enemigo que tienes delante y lo lanzas por encima del hombro. No se puede bloquear.', '抓住面前的敌人，过肩摔出去。无法格挡。'],
      'Shiko Stomp': ['Pisotón Shiko', '四股踏'], 'Raise one leg high and stamp: the floor jumps under everyone near you. Smashes cracked walls.': ['Levantas una pierna y pisas fuerte: el suelo salta bajo todos los que están cerca. Rompe muros agrietados.', '高抬一腿重重踏下：附近所有人脚下的地面都会震起。能击碎裂墙。'],
      'Belly Slam': ['Aplastón', '肚压'], 'Grab the nearest enemy, leap with them, and land on them. It cannot be guarded.': ['Agarras al enemigo más cercano, saltas con él y caes encima. No se puede bloquear.', '抓住最近的敌人，带着他跳起，然后压在他身上。无法格挡。'],
      'Salt Toss': ['Lanzamiento de Sal', '撒盐'], 'Throw a fistful of salt: it stings everyone in front of you and leaves them blinking.': ['Lanzas un puñado de sal: escuece a todos los que tienes delante y los deja parpadeando.', '撒出一把盐：刺痛面前的所有人，让他们睁不开眼。'],
      'Rikishi': ['Rikishi', '力士'], 'Yokozuna': ['Yokozuna', '横纲'], 'Grand Champion': ['Gran Campeón', '大横纲']
    },
    ultTr: ['lanza a todos los de la arena, uno tras otro, y luego cae sobre todos ellos.', '他把竞技场里的人一个接一个摔出去，然后压在所有人身上。']
  });

  // ================= Rue =================
  // what each fighter last used (U, S+U or I): Rue copies the opponent's
  ['useSkill', 'useSpecial'].forEach(k => { const f = P[k]; P[k] = function (alt) { const g = this.G, S = g.state, h = S && g.hero(), e0 = S ? S.energy : 0, down = SW.input.held('down'), up = SW.input.held('up'); const r = f.apply(this, arguments);
    if (S && h && S.energy < e0 - 0.5 && !up) { const id = k === 'useSkill' ? h.kit[alt ? 1 : 0] : (!down ? h.kit[2] : null); if (id && CASTS[id]) this.lastMove = id; } return r; }; });
  const theirMove = (p, z) => { const e = nearest(z, p.x, p.y - 16, 600), f = fighterOf(e); const id = f && f.p && f.p.lastMove; return id && CASTS[id] && HR.rue.kit.indexOf(id) < 0 ? id : null; };
  const copy = (p, z, dmg, up, fallback) => {
    const id = theirMove(p, z);
    if (!id) return fallback();
    pop(p, 'COPY: ' + A[id].name.toUpperCase(), '#ffadad'); sfx('perfect'); emit('mimic', p.x, p.y - 20, 12);
    try { CASTS[id](p, z, Math.round((A[id].dmg || 10) * p.skillMul() * 1.2), up); } catch (err) { fallback(); }
  };
  const mimeShot = (p, z, dmg, up) => { sfx('shoot'); shot(p, z, 'mimic', { dmg, vx: p.face * 8, vy: up ? -4 : 0, r: 4 }); };
  clan('rue', {
    hero: { name: 'Rue', alias: 'Copycat', title: 'The Copycat', energy: 'Echo', color: '#ffadad', colorHi: '#fff0f0', element: 'Mimicry', sig: 'Copy', combo: 'swift', route: 'nyra', modeKind: 'speed', pitch: 720, trait: 'copycat', blurb: 'Show her a move once.\nShe will show it back to you.' },
    style: { name: 'mimic', def: { c: ['#ffadad', '#ffffff', '#ffd6a5'], shape: 'diamond', g: 0, spd: 2.2, life: 18, drag: 0.9 } },
    moves: {
      u: { id: 'copy_cat', name: 'Copy', dmg: 12, desc: 'Use the last U, S+U or I the enemy used, 20% stronger. If they have used none yet, a plain mime shot.',
        cast(p, z, dmg, up) { copy(p, z, dmg, up, () => mimeShot(p, z, dmg, up)); } },
      su: { id: 'mirror_step', name: 'Mirror Step', dmg: 15, desc: 'Step through to the mirror side of the nearest enemy, facing them, and strike.',
        cast(p, z, dmg) { const e = nearest(z, p.x, p.y - 16, 220); if (!e) return; sfx('dash'); emit('mimic', p.x, p.y - 18, 10); const tx = e.x + (e.x - p.x > 0 ? 24 : -24); if (!z.hit(tx - p.w / 2, p.y - p.h, p.w, p.h)) p.x = tx; p.face = e.x >= p.x ? 1 : -1; p.iframes = Math.max(p.iframes, 12); emit('mimic', p.x, p.y - 18, 10); fx.slash(p.x + p.face * 12, p.y - 22, p.face, 2, '#ffadad', 40); hit(...front(p, 44, 46, 6), dmg, { kx: p.face * 2, ky: -4, stun: 34, heavy: true, srcX: p.x }); } },
      i: { id: 'masquerade', name: 'Masquerade', dmg: 7, desc: 'Three copies of the enemy themself step out of the air and strike them. Smashes cracked walls.',
        cast(p, z, dmg) { const e = nearest(z, p.x, p.y - 16, 240); if (!e) return; const f = fighterOf(e), sheet = f ? f.p.sheet() : p.sheet(); sfx('perfect');
          [-28, 28, -14].forEach((dx, k) => z.shots.push(new Later(4 + k * 8, () => { if (e.dead) return; const x = e.x + dx, y = e.y, face = dx < 0 ? 1 : -1; z.shots.push(new Vis(x, y, 16, (ctx, sx, sy, t) => art.draw(ctx, sheet, t < 6 ? 'a1' : 'a2', 1, sx, sy, face < 0, { alpha: 0.7, flash: t % 4 < 2 }))); sfx('swing'); hurt(e, dmg, { kx: face * 2, ky: k === 2 ? -6 : -2, stun: 28, breaker: k === 2 }); }))); } },
      si: { id: 'perfect_copy', name: 'Perfect Copy', dmg: 14, desc: 'Use the enemy\'s last skill twice in a row, 20% stronger each time.',
        cast(p, z, dmg) { const go = () => copy(p, z, dmg, false, () => { sfx('shoot'); [-0.2, 0.2].forEach(a => shot(p, z, 'mimic', { dmg, vx: p.face * Math.cos(a) * 8, vy: Math.sin(a) * 8, r: 5 })); }); go(); z.shots.push(new Later(16, () => { if (!p.dead) go(); })); } },
      sig: { id: 'echo_step', name: 'Echo', dmg: 9, desc: 'An echo of you appears where you stood a second ago and throws a mime shot; you keep moving.',
        cast(p, z, d) { const x = p.x, y = p.y, sheet = p.sheet(), face = p.face; sfx('perfect'); z.shots.push(new Vis(x, y, 24, (ctx, sx, sy, t) => art.draw(ctx, sheet, 'cast', 1, sx, sy, face < 0, { alpha: 0.5 }), v => { if (v.t === 10) shot({ x, y, face }, z, 'mimic', { dmg: d, vx: face * 8, r: 4 }); })); p.vx = p.face * 4; } },
      ult: { id: 'masquerade_ball', name: 'Masquerade Ball', dmg: 10, desc: 'every face she has ever copied steps into the arena, and each of them strikes.',
        fn: ult({ st: 'mimic', every: 6, each(p, z, e, d, k) { const ids = D.heroOrder, id = ids[(k * 7 + 3) % ids.length], sh = HR[id] && art.sheets[HR[id].sheet] ? HR[id].sheet : p.sheet(), dx = k % 2 ? -24 : 24; z.shots.push(new Vis(e.x + dx, e.y, 12, (ctx, sx, sy, t) => art.draw(ctx, sh, 'a2', 1, sx, sy, dx > 0, { alpha: 0.75 }))); } }) }
    },
    mode: ['quick_study', 'Quick Study'], awaken: ['thousand_faces', 'Thousand Faces'],
    trait: { mark(ctx, p, x, y) { const z = G.zone, id = z && theirMove(p, z); if (id) { art.rect(ctx, '#05060c', x - 4, y - 55, 9, 9); art.rect(ctx, '#ffadad', x - 3, y - 54, 7, 7); art.rect(ctx, '#ffffff', x - 1, y - 52, 3, 3); } } },
    fin(p, z, d) { sfx('swing'); emit('mimic', p.x + p.face * 24, p.y - 20, 10, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 52, p.y - 36, 44, 32, d, { kx: p.face * 2, stun: 24, srcX: p.x }); },
    lines: [['Your move. Mine now.', 'あなたの技、もう私のもの。', 'Tu movimiento. Ahora es mío.', '你的招式，现在是我的了。'], ['Seen it. Done it. Better.', '見た、やった、もっと上手に。', 'Lo vi. Lo hice. Mejor.', '看过，做过，做得更好。'], ['Copy that.', '了解、コピーね。', 'Copiado.', '收到，已复制。']],
    rig: { head: 'mask', c: { skin: '#f8e0d8', hair: '#5a3a4a', white: '#ffffff', glow: '#ffadad', top: '#ffd6a5', arm: '#ffd6a5', fore: '#ffadad', hand: '#f8e0d8', pants: '#5a3a4a', boots: '#ffadad', belt: '#ffffff', chest: '#ffadad', trail: '#5a3a4a' }, trailLen: 4 }, borrow: 'mira',
    tr: {
      'The Copycat': ['La Imitadora', '模仿者'], 'Mimicry': ['Mímica', '模仿'], 'Copy': ['Copia', '复制'], 'Show her a move once.': ['Enséñale un movimiento una vez.', '给她看一次招式，'], 'She will show it back to you.': ['Te lo devolverá.', '她就会还给你。'],
      'Use the last U, S+U or I the enemy used, 20% stronger. If they have used none yet, a plain mime shot.': ['Usas la última U, S+U o I que usó el enemigo, un 20% más fuerte. Si aún no ha usado ninguna, un simple disparo mímico.', '使用敌人最后用过的U、S+U或I，伤害提升20%。如果他还没用过，就打出一发普通的模仿弹。'],
      'Mirror Step': ['Paso Espejo', '镜步'], 'Step through to the mirror side of the nearest enemy, facing them, and strike.': ['Pasas al lado espejo del enemigo más cercano, de cara a él, y golpeas.', '闪到最近的敌人的镜像一侧，面对他出手。'],
      'Masquerade': ['Mascarada', '假面舞'], 'Three copies of the enemy themself step out of the air and strike them. Smashes cracked walls.': ['Tres copias del propio enemigo salen del aire y lo golpean. Rompe muros agrietados.', '三个敌人自己的复制体凭空出现，攻击他本人。能击碎裂墙。'],
      'Perfect Copy': ['Copia Perfecta', '完美复制'], "Use the enemy's last skill twice in a row, 20% stronger each time.": ['Usas dos veces seguidas la última habilidad del enemigo, un 20% más fuerte cada vez.', '连续两次使用敌人的最后一个技能，每次伤害提升20%。'],
      'Echo': ['Eco', '回声'], 'An echo of you appears where you stood a second ago and throws a mime shot; you keep moving.': ['Un eco de ti aparece donde estabas hace un segundo y lanza un disparo mímico; tú sigues moviéndote.', '一秒前你站的地方出现你的回声，打出一发模仿弹；你继续移动。'],
      'Quick Study': ['Aprendizaje Rápido', '速学'], 'Thousand Faces': ['Mil Caras', '千面'], 'Masquerade Ball': ['Baile de Máscaras', '假面舞会']
    },
    ultTr: ['todas las caras que ha copiado entran en la arena, y cada una golpea.', '她模仿过的每一张面孔都走进竞技场，每一个都出手。']
  });
  N.tr('es', { 'COPY: {0}': 'COPIA: {0}' }); N.tr('zh', { 'COPY: {0}': '复制：{0}' });

  // ================= Mako =================
  const PLATE = 30;
  clan('mako', {
    hero: { name: 'Mako', alias: 'Tin Can', title: 'The Walking Tank', energy: 'Fuel', color: '#f8961e', colorHi: '#ffe8c2', element: 'Mech', sig: 'Plating', combo: 'heavy', route: 'kael', pitch: 260, trait: 'plating', blurb: 'Built a suit of armour.\nThen kept building.' },
    style: { name: 'mech', def: { c: ['#f8961e', '#ffe8c2', '#5a6070'], shape: 'chunk', g: 0.25, spd: 2.8, life: 22, drag: 0.95 } },
    moves: {
      u: { id: 'arm_cannon', name: 'Arm Cannon', dmg: 12, desc: 'A shell from the arm cannon that bursts where it hits. Your plating soaks 30 damage before your health and rebuilds when you have not been hit for three seconds.',
        cast(p, z, dmg, up) { sfx('shoot'); p.vx = -p.face * 1.5; shot(p, z, 'mech', { dmg: Math.round(dmg * 0.5), vx: p.face * 7, vy: up ? -4 : 0, r: 4, onEnd() { boom(p, 'mech', this.x, this.y, 26, Math.round(dmg * 0.6), { ky: -3 }); } }); } },
      su: { id: 'thruster_dash', name: 'Thruster Dash', dmg: 12, desc: 'Fire the back thrusters and ram straight through the enemy.',
        cast(p, z, dmg) { dash(p, z, 'mech', { n: 12, step: 8, dmg, atk: { kx: p.face * 5, stun: 32, heavy: true } }); } },
      i: { id: 'missile_pod', name: 'Missile Pod', dmg: 5, desc: 'Six small missiles arc up out of the shoulder pod and come down on the nearest enemy. Smashes cracked walls.',
        cast(p, z, dmg) { const e = ahead(p, z, 260) || nearest(z, p.x, p.y, 220); sfx('charge');
          for (let k = 0; k < 6; k++) z.shots.push(new Later(1 + k * 4, () => { if (p.dead) return; sfx('shoot'); shot(p, z, 'mech', { x: p.x - p.face * 4, y: p.y - 40, vx: p.face * rand(1, 3), vy: -6, dmg, life: 90, w: 8, h: 8, ghost: true, breaker: k === 5, paint(ctx, x, y) { art.rect(ctx, '#e0e6f0', x - 2, y - 2, 4, 4); art.rect(ctx, '#f8961e', x - 1, y + 2, 2, 2); },
            tick(s) { s.vy += 0.35; if (e && !e.dead && s.t > 10) { s.vx += SW.clamp((e.x - s.x) * 0.02, -0.4, 0.4); s.vx *= 0.96; } if (s.t > 12 && z.hit(s.x - 2, s.y, 4, 4, true)) s.life = 1; }, onEnd() { boom(p, 'mech', this.x, this.y - 4, 18, dmg, { ky: -2 }); } }); })); } },
      si: { id: 'ground_pound', name: 'Ground Pound', dmg: 24, desc: 'Jump on the jets and drop the whole suit on the floor: a shockwave that throws everyone near you up.',
        cast(p, z, dmg) { sfx('jump'); p.vy = -8; p.onGround = false; p.y -= 1; z.shots.push(new Drive(p, 46, t => { p.vx = 0; p.pose = t < 12 ? ['jump', 0] : ['down', 0]; if (t >= 12) p.vy = 10; if (t > 12 && p.onGround) return false; }, q => { sfx('explode'); fx.shake(10, 16); fx.dust(q.x, q.y, 16); boom(q, 'mech', q.x, q.y - 10, 70, dmg, { ky: -7, launch: true, breaker: true }); })); } },
      sig: { id: 'field_repair', name: 'Field Repair', dmg: 6, desc: 'Weld the plating back on at once, and add a bit more for a while; sparks fly at anyone close.',
        cast(p, z, d) { p.plate = PLATE + 15; p.plateT = 0; sfx('heal'); emit('mech', p.x, p.y - 20, 16, { up: true }); N.around(z, p.x, p.y - 18, 60).forEach(e => hurt(e, d, { stun: 20 })); } },
      ult: { id: 'full_barrage', name: 'Full Barrage', dmg: 10, desc: 'every gun on the suit opens up at once, and the last shell is the size of a car.',
        fn: ult({ st: 'mech', every: 6, each(p, z, e) { const b = e.box(); fx.bolt(p.x + p.face * 10, p.y - 30, b.x + b.w / 2, b.y + b.h / 2, '#f8961e'); fx.ring(b.x + b.w / 2, b.y + b.h / 2, '#ffe8c2', 4, 20, 8); } }) }
    },
    mode: ['overdrive', 'Overdrive'], awaken: ['siege_mode', 'Siege Mode'],
    trait: {
      hurt(p, atk) { if (p.plate === undefined) p.plate = PLATE; p.plateT = 0; if (!(p.plate > 0) || !atk.dmg) return null; const soak = Math.min(p.plate, atk.dmg); p.plate -= soak; emit('mech', p.x, p.y - 20, 4); if (p.plate <= 0) pop(p, 'PLATING DOWN', '#ff8a8a'); return Object.assign({}, atk, { dmg: Math.max(1, atk.dmg - soak) }); },
      tick(p) { if (p.plate === undefined) p.plate = PLATE; p.plateT = (p.plateT || 0) + 1; if (p.plateT > 180 && p.plate < PLATE && p.plateT % 15 === 0) p.plate++; },
      mark(ctx, p, x, y) { const n = p.plate === undefined ? PLATE : p.plate; art.rect(ctx, '#05060c', x - 9, y - 53, 19, 4); art.rect(ctx, '#f8961e', x - 8, y - 52, Math.round(17 * Math.min(1, n / PLATE)), 2); }
    },
    fin(p, z, d) { sfx('explode'); boom(p, 'mech', p.x + p.face * 30, p.y - 20, 18, d, { kx: p.face * 3 }); },
    lines: [['Armour holds. You do not.', '装甲はもつ。お前はもたない。', 'La armadura aguanta. Tú no.', '装甲还在，你不行了。'], ['Built to last.', '長持ちするように作った。', 'Hecho para durar.', '经久耐用。'], ['Scrap.', 'スクラップだ。', 'Chatarra.', '废铁。']],
    rig: { head: 'helmet', sc: 1.12, limb: 5, bulk: 11, c: { skin: '#c89070', hair: '#5a6070', glow: '#ffe8c2', top: '#f8961e', arm: '#5a6070', fore: '#f8961e', hand: '#3a3f4a', pants: '#5a6070', boots: '#3a3f4a', belt: '#ffe8c2', chest: '#ffe8c2' } }, borrow: 'ferra',
    tr: {
      'The Walking Tank': ['El Tanque Andante', '行走的坦克'], 'Mech': ['Meca', '机甲'], 'Plating': ['Blindaje', '装甲'], 'Built a suit of armour.': ['Se construyó una armadura.', '他造了一套盔甲。'], 'Then kept building.': ['Y siguió construyendo.', '然后一直造下去。'],
      'Arm Cannon': ['Cañón de Brazo', '臂炮'], 'A shell from the arm cannon that bursts where it hits. Your plating soaks 30 damage before your health and rebuilds when you have not been hit for three seconds.': ['Un proyectil del cañón del brazo que estalla al impactar. Tu blindaje absorbe 30 de daño antes que tu salud y se reconstruye si no te golpean durante tres segundos.', '臂炮射出一发炮弹，命中即爆。你的装甲会先承受30点伤害，三秒内没被击中就会自动修复。'],
      'Thruster Dash': ['Embestida Propulsada', '推进冲撞'], 'Fire the back thrusters and ram straight through the enemy.': ['Enciendes los propulsores traseros y embistes de frente al enemigo.', '点燃背后的推进器，直接撞穿敌人。'],
      'Missile Pod': ['Lanzamisiles', '导弹舱'], 'Six small missiles arc up out of the shoulder pod and come down on the nearest enemy. Smashes cracked walls.': ['Seis pequeños misiles salen del hombro en arco y caen sobre el enemigo más cercano. Rompe muros agrietados.', '六枚小导弹从肩部发射舱呈弧线升空，落向最近的敌人。能击碎裂墙。'],
      'Ground Pound': ['Golpe Sísmico', '地面重击'], 'Jump on the jets and drop the whole suit on the floor: a shockwave that throws everyone near you up.': ['Saltas con los propulsores y dejas caer todo el traje contra el suelo: una onda que lanza por los aires a todos los que están cerca.', '借推进器跃起，整套机甲砸向地面：冲击波把附近所有人掀上天。'],
      'Field Repair': ['Reparación de Campo', '战地维修'], 'Weld the plating back on at once, and add a bit more for a while; sparks fly at anyone close.': ['Vuelves a soldar el blindaje al instante y añades un poco más durante un rato; las chispas saltan sobre quien esté cerca.', '立刻把装甲焊回去，还额外加厚一阵；火花溅向附近的人。'],
      'Overdrive': ['Sobremarcha', '超速'], 'Siege Mode': ['Modo Asedio', '攻城模式'], 'Full Barrage': ['Bombardeo Total', '全弹发射'], 'PLATING DOWN': ['BLINDAJE ROTO', '装甲击破']
    },
    ultTr: ['todas las armas del traje abren fuego a la vez, y el último proyectil es del tamaño de un coche.', '机甲上的所有武器同时开火，最后一发炮弹有一辆车那么大。']
  });

  // ================= Sora =================
  const kiteArt = (ctx, x, y, s) => { art.rect(ctx, '#90e0ef', x - 6, y - 1, 12, 2); art.rect(ctx, '#90e0ef', x - 1, y - 6, 2, 12); art.rect(ctx, '#ffffff', x - 3, y - 3, 6, 6); art.rect(ctx, '#ef476f', x - 1, y - 1, 2, 2); };
  clan('sora', {
    hero: { name: 'Sora', alias: 'Skylark', title: 'The Kite Rider', energy: 'Wind', color: '#90e0ef', colorHi: '#ffffff', element: 'Kite', sig: 'Glide', combo: 'swift', route: 'nyra', modeKind: 'speed', pitch: 680, trait: 'glide', blurb: 'She has a kite the size of a sail.\nShe rarely comes down.' },
    style: { name: 'kite', def: { c: ['#90e0ef', '#ffffff', '#ef476f'], shape: 'streak', g: 0, spd: 3.2, life: 12, drag: 0.9 } },
    moves: {
      u: { id: 'string_cut', name: 'String Cut', cost: 20, dmg: 13, desc: 'Whip the kite string out like a blade, ahead and a little up. Hold jump while falling to glide.',
        cast(p, z, dmg) { const dir = p.face, hs = new Set(); sfx('swing'); if (!p.onGround) p.vy = Math.min(p.vy, 0);
          z.shots.push(new Vis(p.x, p.y, 12, (ctx, x, y, t) => { const k = Math.min(1, t / 4), px = Math.round(p.x - G.cam.x), py = Math.round(p.y - G.cam.y) - 24; art.line(ctx, '#ffffff', px, py, px + Math.round(dir * 100 * k), py - Math.round(26 * k), 1); kiteArt(ctx, px + Math.round(dir * 100 * k), py - Math.round(26 * k)); }, v => { if (v.t === 4) hit(dir > 0 ? p.x : p.x - 100, p.y - 54, 100, 34, dmg, { kx: dir * 2, ky: -2, stun: 26, hitSet: hs, srcX: p.x }); })); } },
      su: { id: 'updraft_kite', name: 'Kite Lift', dmg: 12, desc: 'The kite catches a gust and lifts you high, cutting anything above you on the way up.',
        cast(p, z, dmg) { sfx('dash'); p.vy = -10; p.onGround = false; p.y -= 1; emit('kite', p.x, p.y, 12, { up: true }); hit(p.x - 20, p.y - 90, 40, 90, dmg, { ky: -7, launch: true, stun: 40, srcX: p.x }); pose(p, 'jump', 0, 12); } },
      i: { id: 'kite_bomber', name: 'Kite Bomber', dmg: 11, desc: 'Your kite flies out ahead and drops four bombs as it goes. Smashes cracked walls.',
        cast(p, z, dmg) { const dir = p.face; sfx('swing'); const y0 = p.y - 70;
          z.shots.push(new Vis(p.x, y0, 70, (ctx, x, y) => kiteArt(ctx, x, y), v => { v.x += dir * 3.5; if (v.t % 14 === 6) { sfx('shoot'); shot(p, z, 'kite', { x: v.x, y: v.y + 6, vx: dir * 1, vy: 2, g: 0.3, dmg: Math.round(dmg * 0.5), life: 60, w: 10, h: 10, breaker: v.t > 50, paint(ctx, x, y) { art.disc(ctx, '#1c1c24', x, y, 4); art.rect(ctx, '#ef476f', x - 1, y - 6, 2, 2); }, onEnd() { boom(p, 'kite', this.x, this.y, 24, dmg, { ky: -3 }); } }); } })); } },
      si: { id: 'dive_bomb', name: 'Dive Bomb', dmg: 27, desc: 'Climb, then let go of the kite and dive onto the nearest enemy.',
        cast(p, z, dmg) { const e = nearest(z, p.x, p.y - 16, 240); sfx('jump'); if (p.onGround) { p.vy = -9; p.onGround = false; p.y -= 1; }
          z.shots.push(new Drive(p, 50, t => { p.iframes = Math.max(p.iframes, 2); if (t < 10) { p.vx = 0; return; } p.pose = ['air', 1]; p.vy = 9; const gx = e && !e.dead ? e.x : p.x + p.face * 40; if (Math.abs(gx - p.x) > 3) slide(p, z, Math.sign(gx - p.x), 6); if (t > 10 && p.onGround) return false; }, q => boom(q, 'kite', q.x, q.y - 10, 44, dmg, { ky: -6 }))); } },
      sig: { id: 'gale_kite', name: 'Gale Kite', dmg: 9, desc: 'The kite beats the air in front of you: a gale that throws the enemy far back.',
        cast(p, z, d) { sfx('dash'); emit('kite', p.x + p.face * 20, p.y - 24, 20, { dir: p.face, power: 1.8 }); hit(...front(p, 110, 60, 0), d, { kx: p.face * 9, ky: -3, stun: 34, srcX: p.x }); } },
      ult: { id: 'thousand_kites', name: 'A Thousand Kites', dmg: 10, desc: 'the sky fills with kites, their strings cut across everyone, and they all come down at once.',
        fn: ult({ st: 'kite', every: 7, during(p, z) { if (p.st % 3 === 0) { const x = G.cam.x + rand(0, W), y = G.cam.y + rand(20, 120); z.shots.push(new Vis(x, y, 40, (ctx, sx, sy, t) => kiteArt(ctx, sx + Math.round(Math.sin(t * 0.2) * 6), sy + Math.round(t * 0.5)))); } } }) }
    },
    mode: ['tailwind', 'Tailwind'], awaken: ['high_wind', 'High Wind'],
    trait: {
      tick(p) { if (!p.onGround && I.held('jump') && p.vy > 0.6 && p.state !== 'hurt') { p.vy = 0.6; p.gliding = true; if (SW.frame % 6 === 0) emit('kite', p.x, p.y - 40, 1); } else p.gliding = false; },
      spd(p) { return p.gliding ? 1.25 : 1; },
      mark(ctx, p, x, y) { if (p.gliding) kiteArt(ctx, x, y - 50); }
    },
    fin(p, z, d) { sfx('swing'); emit('kite', p.x + p.face * 30, p.y - 26, 10, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 76, p.y - 44, 68, 30, d, { kx: p.face * 2, ky: -2, stun: 24, srcX: p.x }); },
    lines: [['Up and away.', 'さあ、空へ。', 'Arriba y lejos.', '飞向远方。'], ['The wind is on my side.', '風は私の味方。', 'El viento está de mi lado.', '风站在我这边。'], ['Never touched the ground.', '一度も地面に触れなかった。', 'Ni toqué el suelo.', '脚都没沾地。']],
    rig: { head: 'spiky', c: { skin: '#f0d0b0', hair: '#ef476f', top: '#90e0ef', arm: '#90e0ef', fore: '#ffffff', hand: '#f0d0b0', pants: '#0077b6', boots: '#ffffff', belt: '#ef476f', chest: '#ffffff', trail: '#ef476f' }, trailLen: 5 }, borrow: 'gale',
    tr: {
      'The Kite Rider': ['La Jinete de la Cometa', '风筝骑手'], 'Kite': ['Cometa', '风筝'], 'Glide': ['Planeo', '滑翔'], 'She has a kite the size of a sail.': ['Tiene una cometa del tamaño de una vela.', '她有一只船帆那么大的风筝。'], 'She rarely comes down.': ['Casi nunca baja.', '她很少落地。'],
      'String Cut': ['Corte de Hilo', '线切'], 'Whip the kite string out like a blade, ahead and a little up. Hold jump while falling to glide.': ['Lanzas el hilo de la cometa como una hoja, hacia delante y algo arriba. Mantén salto mientras caes para planear.', '把风筝线像刀一样甩出，向前偏上。下落时按住跳跃即可滑翔。'],
      'Kite Lift': ['Ascenso en Cometa', '风筝升空'], 'The kite catches a gust and lifts you high, cutting anything above you on the way up.': ['La cometa atrapa una ráfaga y te eleva, cortando todo lo que hay encima al subir.', '风筝兜住一阵风，把你高高带起，沿途斩开头顶的一切。'],
      'Kite Bomber': ['Cometa Bombardera', '风筝轰炸'], 'Your kite flies out ahead and drops four bombs as it goes. Smashes cracked walls.': ['Tu cometa sale volando hacia delante y suelta cuatro bombas al pasar. Rompe muros agrietados.', '风筝向前飞去，沿途投下四颗炸弹。能击碎裂墙。'],
      'Dive Bomb': ['Bombardeo en Picado', '俯冲轰炸'], 'Climb, then let go of the kite and dive onto the nearest enemy.': ['Subes, sueltas la cometa y caes en picado sobre el enemigo más cercano.', '先爬升，再松开风筝，俯冲向最近的敌人。'],
      'Gale Kite': ['Cometa Vendaval', '狂风筝'], 'The kite beats the air in front of you: a gale that throws the enemy far back.': ['La cometa bate el aire delante de ti: un vendaval que lanza al enemigo muy lejos.', '风筝拍打你面前的空气：一阵狂风把敌人吹得老远。'],
      'Tailwind': ['Viento a Favor', '顺风'], 'High Wind': ['Viento Alto', '高空风'], 'A Thousand Kites': ['Mil Cometas', '千风筝']
    },
    ultTr: ['el cielo se llena de cometas, sus hilos cortan a todos y caen todas a la vez.', '天空布满风筝，风筝线划过每个人，然后它们同时落下。']
  });

  // ================= Ryo =================
  const side = (p, s) => { const prev = p.side; p.side = s; if (prev && prev !== s) { p.bal = Math.min(3, (p.bal || 0) + 1); pop(p, 'BALANCE ' + p.bal, '#ffffff'); } else if (prev === s && p.bal) { p.bal = 0; pop(p, 'OFF BALANCE', '#8a92b8'); } return 1 + 0.12 * (p.bal || 0); };
  const taiji = (ctx, x, y, r, t) => { for (let i = -r; i <= r; i++) { const w = Math.round(Math.sqrt(r * r - i * i)); art.rect(ctx, '#ffffff', x - w, y + i, w, 1); art.rect(ctx, '#1a1a1a', x, y + i, w, 1); } art.disc(ctx, '#ffffff', x, y - Math.round(r / 2), Math.max(1, Math.round(r / 4))); art.disc(ctx, '#1a1a1a', x, y + Math.round(r / 2), Math.max(1, Math.round(r / 4))); };
  clan('ryo', {
    hero: { name: 'Ryo', alias: 'Two Halves', title: 'The Balance', energy: 'Balance', color: '#d6ccc2', colorHi: '#ffffff', element: 'Yin and yang', sig: 'Balance', combo: 'fist', route: 'kael', pitch: 380, trait: 'balance', blurb: 'Light in one hand, dark in the other.\nBoth hands hit.' },
    style: { name: 'taiji', def: { c: ['#ffffff', '#1a1a1a', '#d6ccc2'], shape: 'ringlet', g: 0, spd: 1.8, life: 18, drag: 0.9 } },
    moves: {
      u: { id: 'light_palm', name: 'Light Palm', dmg: 12, desc: 'A palm of white light (light). U and S+U are light, I and S+I dark: switching sides builds Balance, +12% damage each, up to three; using the same side twice loses it.',
        cast(p, z, dmg, up) { dmg = Math.round(dmg * side(p, 'light')); sfx('shoot'); shot(p, z, 'taiji', { dmg, vx: p.face * 7.5, vy: up ? -4 : 0, r: 5, paint(ctx, x, y) { N.orb(ctx, x, y, 5, ['#ffffff', '#fff8e8']); } }); } },
      su: { id: 'light_step', name: 'Light Step', dmg: 14, desc: 'Flash forward in white light, striking through the enemy and healing a little (light).',
        cast(p, z, dmg) { dmg = Math.round(dmg * side(p, 'light')); p.heal(Math.round(p.hpMax() * 0.04)); dash(p, z, 'taiji', { n: 10, step: 8, dmg }); } },
      i: { id: 'dark_palm', name: 'Dark Palm', dmg: 17, desc: 'A palm of black that drags the enemy in before it bursts (dark). Smashes cracked walls.',
        cast(p, z, dmg) { dmg = Math.round(dmg * side(p, 'dark')); sfx('charge'); shot(p, z, 'taiji', { dmg, vx: p.face * 5, life: 40, ghost: true, r: 6, breaker: true, paint(ctx, x, y) { N.orb(ctx, x, y, 6, ['#1a1a1a', '#3a3a44']); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 2); }, tick(s) { z.ents.forEach(e => { if (N.isFoe(e) && Math.abs(e.x - s.x) < 60) drag(z, e, s.x, 1); }); } }); } },
      si: { id: 'eclipse_palm', name: 'Eclipse', dmg: 15, desc: 'A white orb and a black orb circle the nearest enemy and crash together on them (dark).',
        cast(p, z, dmg) { dmg = Math.round(dmg * side(p, 'dark')); const e = nearest(z, p.x, p.y - 16, 240); if (!e) return; sfx('perfect');
          z.shots.push(new Vis(e.x, e.y, 40, (ctx, x, y, t) => { const r = Math.max(2, 30 - t * 0.75), a = t * 0.3; N.orb(ctx, x + Math.round(Math.cos(a) * r), y - 20 + Math.round(Math.sin(a) * r * 0.5), 4, ['#ffffff', '#fff8e8']); N.orb(ctx, x - Math.round(Math.cos(a) * r), y - 20 - Math.round(Math.sin(a) * r * 0.5), 4, ['#1a1a1a', '#3a3a44']); }, v => { if (!e.dead) { v.x = e.x; v.y = e.y; } if (v.t === 39 && !e.dead) { sfx('explode'); fx.flash('#ffffff', 4); emit('taiji', v.x, v.y - 20, 20, { power: 2 }); hurt(e, dmg * 2, { ky: -6, down: true, stun: 44 }); } })); } },
      sig: { id: 'taiji_turn', name: 'Taiji Turn', dmg: 11, desc: 'Draw the great circle around you: shots that touch it are turned aside and everyone close is thrown down.',
        cast(p, z, d) { sfx('perfect'); z.shots.push(new Vis(p.x, p.y, 30, (ctx, x, y, t) => { const px = Math.round(p.x - G.cam.x), py = Math.round(p.y - G.cam.y) - 20; ctx.globalAlpha = Math.min(1, (30 - t) / 10); taiji(ctx, px, py, 26, t); ctx.globalAlpha = 1; }, v => { const of = G.scene === 'vs' && V.f ? V.f.find(f => f.p && f.p !== p) : null; (of ? of.shots : z.shots.filter(s => s.team === 'enemy')).forEach(s => { if (s.dmg !== undefined && s.x !== undefined && !s.isPuppet && !s.isClone && Math.hypot(s.x - p.x, s.y - p.y + 20) < 34) s.gone = true; }); if (v.t === 6) N.around(z, p.x, p.y - 20, 60).forEach(e => hurt(e, d, { ky: -4, down: true, stun: 36 })); })); } },
      ult: { id: 'harmony', name: 'Harmony', dmg: 13, desc: 'light and dark turn together over the arena, and everything caught between them is set right, hard.',
        fn: ult({ st: 'taiji', every: 8, start(p, z) { z.shots.push(new Vis(0, 0, 64, (ctx, x, y, t) => { ctx.globalAlpha = 0.5 * Math.min(1, t / 10, (64 - t) / 10); taiji(ctx, W / 2, 70, 36, t); ctx.globalAlpha = 1; })); }, each(p, z, e) { const b = e.box(); emit('taiji', b.x + b.w / 2, b.y + b.h / 2, 10); fx.ring(b.x + b.w / 2, b.y + b.h / 2, '#ffffff', 4, 22, 8); } }) }
    },
    mode: ['centered', 'Centered'], awaken: ['oneness', 'Oneness'],
    trait: { mark(ctx, p, x, y) { if (p.bal) pips(ctx, x, y - 50, p.bal, 3, p.side === 'light' ? '#ffffff' : '#3a3a44'); } },
    fin(p, z, d) { sfx('swing'); emit('taiji', p.x + p.face * 24, p.y - 20, 10, { dir: p.face }); hit(p.face > 0 ? p.x + 8 : p.x - 54, p.y - 36, 46, 32, d, { kx: p.face * 2.5, stun: 24, srcX: p.x }); },
    lines: [['Balance restored.', '調和は戻った。', 'Equilibrio restaurado.', '平衡已恢复。'], ['Two hands. One answer.', '両の手、ひとつの答え。', 'Dos manos. Una respuesta.', '两只手，一个答案。'], ['Light and dark agree.', '光と闇の意見が一致した。', 'La luz y la oscuridad están de acuerdo.', '光与暗意见一致。']],
    rig: { head: 'short', c: { skin: '#d8b498', hair: '#1a1a1a', top: '#ffffff', arm: '#ffffff', fore: '#1a1a1a', hand: '#d8b498', pants: '#1a1a1a', boots: '#ffffff', belt: '#d6ccc2', chest: '#1a1a1a' } }, borrow: 'kael',
    tr: {
      'The Balance': ['El Equilibrio', '平衡'], 'Yin and yang': ['Yin y yang', '阴阳'], 'Balance': ['Equilibrio', '平衡'], 'Light in one hand, dark in the other.': ['Luz en una mano, oscuridad en la otra.', '一手是光，一手是暗。'], 'Both hands hit.': ['Las dos manos golpean.', '两只手都会打人。'],
      'Light Palm': ['Palma de Luz', '光掌'], 'A palm of white light (light). U and S+U are light, I and S+I dark: switching sides builds Balance, +12% damage each, up to three; using the same side twice loses it.': ['Una palma de luz blanca (luz). U y S+U son luz, I y S+I oscuridad: alternar acumula Equilibrio, +12% de daño cada uno, hasta tres; usar el mismo lado dos veces lo pierde.', '一记白光之掌（光）。U和S+U属光，I和S+I属暗：交替使用会积攒平衡，每层伤害+12%，最多三层；连续用同一边就会失去。'],
      'Light Step': ['Paso de Luz', '光步'], 'Flash forward in white light, striking through the enemy and healing a little (light).': ['Destellas hacia delante en luz blanca, atravesando al enemigo y curándote un poco (luz).', '化作白光向前一闪，穿过敌人并回复少许生命（光）。'],
      'Dark Palm': ['Palma Oscura', '暗掌'], 'A palm of black that drags the enemy in before it bursts (dark). Smashes cracked walls.': ['Una palma negra que atrae al enemigo antes de estallar (oscuridad). Rompe muros agrietados.', '一记黑暗之掌，先把敌人吸过来再爆开（暗）。能击碎裂墙。'],
      'Eclipse': ['Eclipse', '日蚀'], 'A white orb and a black orb circle the nearest enemy and crash together on them (dark).': ['Un orbe blanco y uno negro rodean al enemigo más cercano y chocan sobre él (oscuridad).', '一白一黑两颗光球绕着最近的敌人旋转，然后撞在他身上（暗）。'],
      'Taiji Turn': ['Giro Taiji', '太极回旋'], 'Draw the great circle around you: shots that touch it are turned aside and everyone close is thrown down.': ['Trazas el gran círculo a tu alrededor: los disparos que lo tocan se desvían y todos los que están cerca caen al suelo.', '在身边画出太极大圆：碰到它的飞行道具被化解，附近的人都被摔倒。'],
      'Centered': ['Centrado', '守中'], 'Oneness': ['Unidad', '合一'], 'Harmony': ['Armonía', '和谐'], 'OFF BALANCE': ['DESEQUILIBRIO', '失衡'], 'BALANCE {0}': ['EQUILIBRIO {0}', '平衡 {0}']
    },
    ultTr: ['la luz y la oscuridad giran juntas sobre la arena, y todo lo que queda entre ellas vuelve a su sitio, con fuerza.', '光与暗在竞技场上空一同旋转，夹在其间的一切都被狠狠地拨回正轨。']
  });
  // Versus balance (versus.js V.tune), fitted with tools/versus-balance.js against the fifteen regular heroes, both sides, bots on Normal: untuned 25-45%, with this table about 46-57%.
  if (SW.versus && SW.versus.tune) Object.assign(SW.versus.tune, { opal: 1.18, taro: 1.12, rue: 1.2, mako: 0.99, sora: 1.29, ryo: 1.4 });
})();
