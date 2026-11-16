'use strict';
// Shattered Worlds — ACT 3, the Surface, made bigger. Loaded after story-middle.js; only adds and wraps.
//   Two new regions on the Surface road, each with its own maps, enemies and boss:
//   BURIED MERIDIAN (after the Scrap Baron, mission BC-1): a sinkhole behind his wreck drops into a city that was buried
//     under the Ash Dunes before anyone now alive was born. Halcyon is digging out its Lantern Archive, a vault of the old
//     city's memories, and shipping them to the relay in the Glowwild. Boss: THE EXCAVATOR, a dig rig that burrows.
//   THE GLASS SEA (after the Glowwild, mission GS-1): the fused-glass desert between the Glowwild and the Crater. Halcyon
//     mirror masts throw mirages across it: the first test of the trick waiting at Field Post 3. Boss: THE LENSWRIGHT, who
//     fights with mirror copies of himself.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, story = SW.story, Z = SW.zones;
  const L = D.dialogue, M = D.missions, E = D.enemies, TH = art.themes, W = SW.W, H = SW.H;
  if (!story || !story.patch || !story.tune || !SW.Boss2) return;
  const rect = art.rect, line = art.line, disc = art.disc, ring = art.ring, sh = art.shade;
  const sfx = n => SW.audio.sfx(n);
  const say = (s, t, o) => Object.assign({ s, t }, o || {});
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const T = 16;
  const onRoad = (g, pre) => (g.state.mission || '').indexOf(pre) === 0;

  // ================= look: themes, music, backdrops, props =================
  const theme = (base, o) => Object.assign({}, TH[base], o);
  Object.assign(TH, {
    buried:   theme('metro', { style: 'brick', a: '#5a4632', b: '#4a3a28', top: '#a08060', hi: '#d8b888', deep: '#22180e', plat: '#8a6a3a', sky: ['#120c08', '#3a2818'], mid: 'ruins', midCol: '#1a120a', bg: 'none', dim: 0, haz: '#f5c542', win: ['#f5c542'] }),
    sinkhole: theme('metro', { style: 'dirt', a: '#6a5238', b: '#5a442e', top: '#c8a070', hi: '#e8c890', deep: '#2a1e12', plat: '#8a6a3a', sky: ['#d89a5a', '#3a2818'], mid: 'ruins', midCol: '#1a120a', bg: 'none', dim: 0, haz: '#f5c542', win: ['#f5c542'] }),
    glass:    theme('surface', { style: 'dirt', a: '#7ab0b8', b: '#6a9aa2', top: '#d8f8ff', hi: '#ffffff', deep: '#2a5a68', plat: '#9adfe8', sky: ['#6aa8d0', '#f0d0a0'], mid: 'ruins', midCol: '#5a8a98', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#9af0ff'] }),
    lens:     theme('surface', { style: 'plate', a: '#c8ccd6', b: '#b4b8c4', top: '#ffffff', hi: '#ffffff', deep: '#5a6078', plat: '#9af0ff', sky: ['#6aa8d0', '#f0d0a0'], mid: 'ruins', midCol: '#5a8a98', bg: 'none', dim: 0, haz: '#ff8a3a', win: ['#9af0ff'] })
  });
  SW.audio.tracks.buried = { bpm: 84, root: 40, prog: [0, -3, -5, -2], arp: [0, 3, 7, 12, 7, 3, 10, 3], bass: 'triangle', drums: 0.5 };
  SW.audio.tracks.glass = { bpm: 100, root: 44, prog: [0, 4, -1, 5], arp: [0, 7, 11, 14, 11, 7, 4, 7], bass: 'triangle', drums: 0.4 };

  function bakeBackdrops() {
    const paint = (id, fn) => { const cv = SW.canvas(512, 300); fn(cv[1], SW.rng(id.length * 151 + 3)); art.bg['srf_' + id] = cv[0]; TH[id].bg = 'srf_' + id; TH[id].dim = 0; };
    const buried = (x, r) => {
      // skyscrapers of the old city, leaning in the sand, a few windows still lit by Halcyon floodlights
      for (let i = 0; i < 7; i++) {
        const bx = i * 76 + (r() * 24 | 0), w = 40 + (r() * 26 | 0), h = 160 + (r() * 120 | 0), lean = (r() - 0.5) * 0.25;
        x.save(); x.translate(bx + w / 2, 300); x.rotate(lean);
        rect(x, i % 2 ? '#2a1e14' : '#241a10', -w / 2, -h, w, h); rect(x, '#34261a', -w / 2, -h, 3, h);
        for (let wy = -h + 10; wy < -20; wy += 12) for (let wx = -w / 2 + 5; wx < w / 2 - 6; wx += 9) rect(x, r() < 0.06 ? '#c8902a' : '#1a120a', wx, wy, 4, 6);
        x.restore();
      }
      for (let i = 0; i < 6; i++) { const sx = r() * 512 | 0; x.globalAlpha = 0.35; rect(x, '#c8a070', sx, 0, 2, 300); rect(x, '#e8c890', sx + 1, 0, 1, 300); x.globalAlpha = 1; }
      for (let i = 0; i < 7; i++) { const dx = i * 80 + (r() * 30 | 0); disc(x, '#3a2a1a', dx, 300, 40 + (r() * 30 | 0)); }
      for (let i = 0; i < 40; i++) rect(x, sh('#e8c890', 0.4 + r() * 0.3), r() * 512 | 0, r() * 300 | 0, 1, 1);
    };
    paint('buried', buried);
    paint('sinkhole', (x, r) => { buried(x, r); x.globalAlpha = 0.25; for (let i = 0; i < 5; i++) { const lx = 60 + i * 100; rect(x, '#ffe0a0', lx, 0, 18, 300); } x.globalAlpha = 1; });
    const glass = (x, r) => {
      // the Crater's violet glow on the eastern horizon, glass dunes catching the sun, heat shimmer
      x.globalAlpha = 0.35; disc(x, '#b06cff', 420, 300, 120); x.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { const cx = i * 96 + (r() * 30 | 0), w = 120 + (r() * 80 | 0), hgt = 40 + (r() * 50 | 0); for (let k = 0; k < hgt; k += 2) { const ww = w * Math.sqrt(1 - k / hgt); rect(x, k < 4 ? '#e8fbff' : k % 6 < 2 ? '#a8d8e0' : '#8ac0cc', cx - ww / 2, 300 - k, ww, 2); } line(x, '#ffffff', cx - w / 4, 300 - hgt * 0.6, cx + w / 6, 300 - hgt * 0.85, 1); }
      for (let i = 0; i < 14; i++) { const sy = 150 + (r() * 100 | 0), sx = r() * 512 | 0; x.globalAlpha = 0.3; rect(x, '#ffffff', sx, sy, 24 + (r() * 30 | 0), 1); x.globalAlpha = 1; }
      for (let i = 0; i < 10; i++) { const gx = r() * 512 | 0, gy = 180 + (r() * 110 | 0); rect(x, '#ffffff', gx, gy, 1, 3); rect(x, '#ffffff', gx - 1, gy + 1, 3, 1); }
    };
    paint('glass', glass);
    paint('lens', (x, r) => { glass(x, r); for (let i = 0; i < 5; i++) { const px = 40 + i * 104; rect(x, '#d8dce4', px, 120, 4, 180); rect(x, '#9af0ff', px - 10, 112, 24, 14); rect(x, '#ffffff', px - 8, 114, 6, 4); } });
  }

  const PROPS = {
    sinkhole: [76, 30, x => { disc(x, '#1a120a', 38, 30, 34); rect(x, '#1a120a', 4, 26, 68, 4); ring(x, '#c8a070', 38, 30, 35); line(x, '#8a6a3a', 30, 0, 32, 30, 1); rect(x, '#8a6a3a', 26, 0, 10, 3); }],
    facade: [96, 124, (x, c) => { rect(x, '#4a3a2a', 4, 6, 88, 118); rect(x, '#5a4834', 4, 6, 88, 4); rect(x, '#3a2c1e', 86, 6, 6, 118); for (let wy = 16; wy < 104; wy += 16) for (let wx = 12; wx < 82; wx += 14) rect(x, (wx * 7 + wy * 3) % 11 === 0 ? c : '#1a120a', wx, wy, 8, 10); rect(x, '#2a1e12', 38, 96, 20, 28); for (let i = 0; i < 6; i++) disc(x, '#a08060', 10 + i * 16, 124, 9); }],
    mural: [68, 44, x => { rect(x, '#3a2c1e', 0, 0, 68, 44); rect(x, '#6aa8d0', 3, 3, 62, 24); rect(x, '#f5d080', 3, 27, 62, 14); disc(x, '#fff0a0', 50, 12, 6); for (let i = 0; i < 8; i++) { const h = 6 + (i * 37 % 13); rect(x, '#5a6a8a', 6 + i * 7, 27 - h, 6, h); } rect(x, '#a08060', 3, 38, 62, 3); x.globalAlpha = 0.35; rect(x, '#c8a070', 30, 3, 35, 38); x.globalAlpha = 1; }],
    kiosk: [24, 40, x => { rect(x, '#4a5060', 4, 4, 16, 36); rect(x, '#6a7088', 4, 4, 16, 3); rect(x, '#b9a0ff', 7, 10, 10, 12); rect(x, '#ffffff', 9, 12, 3, 2); rect(x, '#2a2e3a', 6, 26, 12, 3); }],
    vault: [88, 100, x => { rect(x, '#3a3632', 0, 0, 88, 100); disc(x, '#5a5650', 44, 52, 40); ring(x, '#d9b45a', 44, 52, 40); ring(x, '#8a7a50', 44, 52, 34); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; rect(x, '#2a2622', 44 + Math.cos(a) * 30 - 3, 52 + Math.sin(a) * 30 - 3, 6, 6); } disc(x, '#1a1612', 44, 52, 14); disc(x, '#b9a0ff', 44, 52, 6); }],
    core: [26, 46, x => { rect(x, '#4a5060', 2, 38, 22, 8); rect(x, '#4a5060', 2, 0, 22, 6); rect(x, '#b9a0ff', 5, 6, 16, 32); rect(x, '#e8dcff', 8, 8, 4, 28); rect(x, '#8b5cf6', 16, 8, 3, 28); }],
    mirrorpanel: [32, 56, x => { rect(x, '#8a92a8', 14, 30, 4, 26); rect(x, '#5a6078', 8, 52, 16, 4); rect(x, '#d8dce4', 1, 1, 30, 32); rect(x, '#9adfe8', 3, 3, 26, 28); rect(x, '#e8fbff', 5, 5, 8, 4); line(x, '#ffffff', 20, 8, 26, 26, 1); }],
    glasscairn: [30, 26, x => { [[2, 14, 10, 12], [10, 6, 10, 20], [19, 12, 9, 14]].forEach(q => { rect(x, '#9adfe8', q[0], q[1], q[2], q[3]); rect(x, '#e8fbff', q[0], q[1], 2, q[3]); rect(x, '#5aa8b8', q[0] + q[2] - 2, q[1], 2, q[3]); }); }]
  };
  const pcache = {}, _prop = art.prop, _psize = art.propSize;
  art.prop = function (ctx, kind, x, y, col) {
    const d = PROPS[kind];
    if (!d) return _prop.apply(this, arguments);
    const c0 = col || '#f5c542', key = kind + c0;
    let c = pcache[key];
    if (!c) { const cv = SW.canvas(d[0], d[1]); d[2](cv[1], c0); c = pcache[key] = cv[0]; }
    ctx.drawImage(c, Math.round(x - d[0] / 2), Math.round(y - d[1]));
  };
  art.propSize = kind => (PROPS[kind] ? [PROPS[kind][0], PROPS[kind][1]] : _psize(kind));

  // ================= the new faces =================
  function bakeSurface() {
    const custom = art.custom, recolor = story.recolor;
    // sand burrower: a mound with eyes until it lunges out
    const worm = (pose, eye) => x => {
      if (pose === 'mound') { disc(x, '#a08060', 16, 20, 9); rect(x, '#a08060', 4, 18, 24, 6); rect(x, '#c8a070', 10, 14, 10, 2); rect(x, eye, 18, 16, 2, 2); rect(x, eye, 22, 17, 2, 2); return; }
      const up = pose === 'leap' ? 6 : pose === 'bite' ? 3 : 0;
      for (let i = 0; i < 5; i++) { const cx = 6 + i * 5, cy = 20 - up - Math.sin(i * 0.9) * (pose === 'leap' ? 6 : 3); disc(x, i % 2 ? '#8a5a3a' : '#9a6a44', cx, cy, 4 + (i === 4 ? 1 : 0)); rect(x, '#c8a070', cx - 2, cy - 4, 4, 1); }
      const hx = 29, hy = 18 - up - (pose === 'leap' ? 6 : 3);
      rect(x, '#5a2e1a', hx - 1, hy - 3, 4, 7); rect(x, pose === 'bite' ? '#ffe0a0' : '#3a1a10', hx + 1, hy - 2, 2, 5); rect(x, eye, hx - 3, hy - 4, 2, 2);
      disc(x, '#a08060', 8, 24, 6);
    };
    custom('burrower', 36, 26, 24, { idle: [worm('mound', '#ff8a3a')], run: [worm('crawl', '#ff8a3a'), worm('mound', '#ff8a3a')], leap: [worm('leap', '#ff8a3a')], bite: [worm('bite', '#ffffff'), worm('bite', '#ff5a3a')], hurt: [worm('crawl', '#ffffff')], down: [worm('mound', '#3a2a1a')] });
    // THE EXCAVATOR: Halcyon's dig rig. Tracks, a white cab, a drill the size of a car
    const rig = (o, hot) => x => {
      const lift = o.lift || 0, tr = o.tr || 0, lean = o.lean || 0, spin = o.spin || 0, lamp = o.lamp || (hot ? '#ff5a3a' : '#fff7d0');
      // tracks
      disc(x, '#2a2620', 20, 76, 10); disc(x, '#2a2620', 98, 76, 10); rect(x, '#2a2620', 20, 66, 78, 20);
      for (let i = 0; i < 9; i++) rect(x, '#4a463e', 18 + ((i * 10 + tr * 5) % 84), 84, 6, 2);
      for (let i = 0; i < 5; i++) { disc(x, '#5a564c', 26 + i * 17, 76, 6); disc(x, '#3a362e', 26 + i * 17, 76, 2); }
      // chassis in Halcyon yellow, hazard stripes
      rect(x, hot ? '#e8a040' : '#d9b45a', 16 + lean, 44, 84, 24); rect(x, '#f5d080', 16 + lean, 44, 84, 3);
      for (let i = 0; i < 10; i++) rect(x, i % 2 ? '#1a1612' : '#f5c542', 18 + lean + i * 8, 62, 8, 4);
      rect(x, '#8a7a50', 24 + lean, 50, 22, 8); rect(x, '#3a3632', 26 + lean, 52, 18, 4);
      // cab and exhaust
      rect(x, '#e8e4d8', 30 + lean, 20, 32, 26); rect(x, '#ffffff', 30 + lean, 20, 32, 3); rect(x, '#2a2e3a', 34 + lean, 25, 24, 11); rect(x, hot ? '#ff8a3a' : '#6fd3e8', 36 + lean, 27, 20, 7);
      rect(x, '#3a3632', 22 + lean, 6, 5, 40); rect(x, '#5a5650', 21 + lean, 4, 7, 3);
      rect(x, lamp, 60 + lean, 28, 4, 4); rect(x, '#d9b45a', 34 + lean, 16, 24, 4);
      // the drill arm and bit
      const ay = 50 - lift, tipX = 124 + (o.reach || 0);
      line(x, '#6a665c', 88 + lean, 54, 100, ay, 6); rect(x, '#4a463e', 96, ay - 6, 10, 12);
      for (let k = 0; k < 20; k++) { const hh = Math.max(1, 12 - k * 0.6); rect(x, (k + spin) % 4 < 2 ? (hot ? '#ff8a3a' : '#c8ccd8') : (hot ? '#ffd0a0' : '#8a92a8'), 106 + k, ay - hh / 2, 1, hh); }
      rect(x, hot ? '#ffffff' : '#e8ecf4', tipX - 1, ay - 1, 2, 2);
      if (hot) { line(x, '#ff5a3a', 40 + lean, 46, 48 + lean, 66, 1); line(x, '#ff5a3a', 80 + lean, 46, 74 + lean, 64, 1); }
    };
    const xsheet = (id, hot) => custom(id, 132, 92, 90, {
      idle: [rig({}, hot), rig({ spin: 1 }, hot)], run: [rig({ tr: 0, spin: 1 }, hot), rig({ tr: 1, spin: 3 }, hot)],
      a1: [rig({ lift: 14, lean: -2 }, hot), rig({ lift: -4, reach: 4, lean: 3, spin: 2 }, hot)], a4: [rig({ lift: 26, lean: -3 }, hot), rig({ lift: -10, lean: 4, spin: 2 }, hot)],
      special: [rig({ lift: 6, lean: -3, lamp: '#ffffff', spin: 1 }, hot)], dash: [rig({ tr: 0, lean: 4, spin: 1 }, hot), rig({ tr: 1, lean: 4, spin: 3 }, hot)],
      cast: [rig({ lift: 20 }, hot), rig({ lift: 8, reach: 3 }, hot)], jump: [rig({ lift: 22 }, hot)], cheer: [rig({ lift: 28, lamp: '#ffffff' }, hot)],
      tele: [rig({ lift: 6, lamp: '#ffffff' }, hot)], hurt: [rig({ lean: -4, lamp: '#ffffff' }, hot)], down: [rig({ lift: -14, lean: -6, lamp: '#2a2620' }, hot)]
    }, '#120e08');
    xsheet('excavator', false); xsheet('excavator2', true);
    // the Lenswright: a new rig, white coat, glass visor, a mirror-staff
    art.bake('lenswright', { head: 'long', sc: 1.1, weapon: 'staff', armed: 1, c: { skin: '#e0c8b8', hair: '#e8fbff', top: '#e8ecf4', pants: '#5a6a8a', boots: '#2b2f3a', belt: '#9af0ff', chest: '#9af0ff', trail: '#9af0ff', acc: '#9af0ff' }, trailLen: 4, trailW: 3 }, 'enemy');
    recolor('lenswright2', 'lenswright', { top: '#9af0ff', hair: '#ffffff' });
    // rank and file
    recolor('digcrew', 'guard', { top: '#e8e4d8', pants: '#c86a2a', hair: '#ff8a3a' });
    recolor('rusk', 'brawler', { top: '#e8e4d8', pants: '#c86a2a', hair: '#3a2a20' });
    recolor('mirage', 'raider', { top: '#9adfe8', hair: '#e8fbff', pants: '#5aa8b8', skin: '#c8f0f8', boots: '#2a5a68' });
    const dr = { '#3a3f4e': '#8a6a2a', '#555b6e': '#b8902a', '#8a92a8': '#e8c86a', '#2b2f3a': '#4a3a1a', '#6fd3e8': '#ff8a3a', '#1c1f28': '#2a2010' };
    recolor('digdrone', 'drone', null, dr);
    recolor('lensdrone', 'drone', null, { '#3a3f4e': '#9adfe8', '#555b6e': '#d8f8ff', '#8a92a8': '#ffffff', '#2b2f3a': '#2a5a68', '#6fd3e8': '#b06cff', '#1c1f28': '#1a3a44' });
    recolor('glasscrawler', 'crawler', null, { '#b8703a': '#9adfe8', '#8a4a26': '#5aa8b8', '#d08a4a': '#e8fbff', '#5a2e18': '#2a5a68', '#ffb040': '#ffffff', '#fff0b0': '#ffffff', '#3a2418': '#1a3a44', '#ff5a3a': '#ff5aa0' });
    // custom sheets without a run / attack frame of their own: give the shared enemy poses something to show
    ['digdrone', 'lensdrone'].forEach(id => { const s = art.sheets[id]; if (s) { s.anims.run = s.anims.idle; s.anims.zap = s.anims.atk; } });
    const gc = art.sheets.glasscrawler; if (gc) gc.anims.lunge = gc.anims.run;
  }
  const _init = art.init; art.init = function () { _init(); try { bakeBackdrops(); bakeSurface(); } catch (e) { console.error(e); } };

  Object.assign(D.speakers, {
    rusk: { name: 'Dig Marshal Rusk', sheet: 'rusk', pitch: 220 }, lenswright: { name: 'The Lenswright', sheet: 'lenswright', pitch: 380 }
  });

  // ================= enemies and bosses =================
  Object.assign(E, {
    burrower:     { name: 'Sand Burrower', sheet: 'burrower', hp: 54, dmg: 12, speed: 1.6, xp: 22, creds: 4, ai: 'leaper', aggro: 170, w: 22, h: 14, anims: { idle: 'idle', run: 'run', jump: 'leap', atk: 'bite' } },
    digcrew:      { name: 'Halcyon Dig Crew', sheet: 'digcrew', hp: 84, dmg: 13, speed: 0.95, xp: 28, creds: 14, ai: 'melee', range: 28, aggro: 170, blockEvery: 4, windup: 22, commit: true },
    digdrone:     { name: 'Dig Drone', sheet: 'digdrone', hp: 28, dmg: 8, speed: 1.1, xp: 16, creds: 6, ai: 'drone', aggro: 210, fly: true, w: 18, h: 14, shot: '#ff8a3a', anims: { atk: 'zap' } },
    glasscrawler: { name: 'Glass Crawler', sheet: 'glasscrawler', hp: 80, dmg: 13, speed: 0.55, xp: 30, creds: 8, ai: 'crawler', aggro: 120, armored: true, w: 30, h: 14, contact: true, anims: { atk: 'lunge' } },
    lensdrone:    { name: 'Lens Drone', sheet: 'lensdrone', hp: 30, dmg: 9, speed: 1.2, xp: 18, creds: 6, ai: 'drone', aggro: 220, fly: true, w: 18, h: 14, shot: '#b06cff', anims: { atk: 'zap' } },
    mirage:       { name: 'Mirage', sheet: 'mirage', hp: 26, dmg: 11, speed: 1.15, xp: 0, creds: 0, ai: 'melee', range: 28, aggro: 260, windup: 22, glassy: true },
    lensclone:    { name: 'Mirror Image', sheet: 'lenswright', hp: 1, dmg: 10, speed: 1.3, xp: 0, creds: 0, ai: 'melee', range: 30, aggro: 300, windup: 20, glassy: true },
    excavator: { name: 'THE EXCAVATOR', sub: 'Halcyon dig rig, Meridian site', sheet: 'excavator', sheet2: 'excavator2', beast: true, heavy: true, hp: 980, dmg: 17, speed: 0.75, xp: 420, creds: 260, idle: 34, w: 80, h: 66, counter: 2, poise: 4,
      script: [['charge', { speed: 4.2 }, [1, 3]], ['stomp', { col: '#d9b45a' }, [3, 1]], ['lob', { n: 2, col: '#c8a070', dmg: 9 }, [1, 2]], ['summon', { kind: 'digdrone', max: 2, hp: 16, fly: true, p2: true }, [2, 2]]] },
    lenswright: { name: 'THE LENSWRIGHT', sub: 'Halcyon optics, Parallax trials', sheet: 'lenswright', sheet2: 'lenswright2', hp: 920, dmg: 14, speed: 1.15, xp: 440, creds: 260, idle: 24, w: 14, h: 38, counter: 2, poise: 4,
      script: [['volley', { n: 3, kind: 'crescent', col: '#9af0ff', speed: 3.8, gap: 16 }, [1, 3]], ['swings', { n: 2, reach: 54, col: '#e8fbff' }, [3, 1]], ['lunge', {}, [1, 2]], ['summon', { kind: 'lensclone', max: 2, hp: 1 }, [2, 2]]] }
  });
  // balance (tools/story-test.js bots, 10-12 fights each; Excavator at level 13, Lenswright at 14, three kit skills): the
  // masher dies 7 in 10 and 9 in 12; careful play never died, losing ~31% (Excavator) and ~48% (Lenswright) health.
  // Players reach the old Act 2 bosses a few levels higher now that Act 2 (The Middle) exists. The Scrap Baron still
  // holds (level 12: masher dies 6 in 8, careful loses ~38%); the Glowmother got soft on mashing (level 14: masher
  // died 2 in 8), so it answers free hits harder now: masher 6 in 10, careful 1 death in 10, losing ~43%.
  story.tune('glowmother', { counter: 2, poise: 4 });
  // mirages and mirror images shimmer: half there
  const EP = SW.Enemy.prototype, _ed = EP.draw;
  EP.draw = function (ctx, cam, g) {
    if (!this.def || !this.def.glassy) return _ed.apply(this, arguments);
    ctx.save(); ctx.globalAlpha = 0.55 + 0.25 * Math.sin((this.t || 0) * 0.15);
    try { return _ed.apply(this, arguments); } finally { ctx.restore(); }
  };
  const _edie = EP.die; EP.die = function (g) {
    if (this.def && this.def.glassy && !this.dead) { fx.spark(this.x, this.y - 18, '#e8fbff', 14, 3); fx.ring(this.x, this.y - 18, '#9af0ff', 3, 20, 10); sfx('burst'); }
    const was = this.dead, r = _edie.apply(this, arguments);
    // the Lenswright's mirror images break with him
    if (!was && this.type === 'lenswright' && G.zone) G.zone.ents.forEach(e => { if (e.type === 'lensclone' && !e.dead) { e.hp = 0; e.die(g); } });
    return r;
  };

  // ---------- the Excavator's own move: it drills under the floor and comes up beneath you ----------
  function drawMound(ctx, cam, b) {
    const x = Math.round(b.x - cam.x), y = Math.round(b.y - cam.y), s = Math.sin((b.t || 0) * 0.6) * 2;
    disc(ctx, '#a08060', x, y + 4, 18); rect(ctx, '#a08060', x - 26, y - 2, 52, 6); rect(ctx, '#c8a070', x - 10 + s, y - 12, 20, 3);
    if (b.burrowWarn) { for (let k = 0; k < 10; k++) rect(ctx, (k + (b.t | 0)) % 4 < 2 ? '#ff8a3a' : '#ffd0a0', x - 1 + s, y - 14 - k, 3 - (k > 6 ? 1 : 0), 1); if ((b.t | 0) % 8 < 5) { rect(ctx, '#ff8a3a', x - 42, y - 2, 84, 2); rect(ctx, '#ff8a3a', x - 42, y - 8, 2, 8); rect(ctx, '#ff8a3a', x + 40, y - 8, 2, 8); } SW.text(ctx, '!', x, y - 48, '#ffe040', { align: 'center' }); }
  }
  function* burrow(b, g) {
    const p = g.player;
    b.faceTo(p); b.vx = 0; b.setPose('special', 0); b.tele = 30; sfx('tele');
    for (let i = 0; i < 30; i++) yield;
    b.tele = 0; sfx('explode'); fx.dust(b.x, b.y, 16); fx.shake(5, 12);
    b.burrowed = true; b.invuln = 9999;
    const lo = (b.ax0 || b.x - 300) + 30, hi = (b.ax1 || b.x + 300) - 30;
    for (let i = 0; i < 120; i++) {
      const tx = SW.clamp(p.x, lo, hi), dx = tx - b.x;
      if (Math.abs(dx) < 6) break;
      b.vx = Math.sign(dx) * Math.min(b.phase === 2 ? 3.6 : 3, Math.abs(dx));
      if (i % 3 === 0) fx.dust(b.x, b.y, 2);
      yield;
    }
    b.vx = 0; b.burrowWarn = true;
    for (let i = 0; i < (b.phase === 2 ? 28 : 36); i++) { if (i % 4 === 0) fx.dust(b.x + SW.rand(-20, 20), b.y, 3); yield; }
    b.burrowed = false; b.burrowWarn = false; b.invuln = 0; b.setPose('a4', 1);
    sfx('explode'); fx.shake(9, 18); fx.debris(b.x, b.y - 10, '#c8a070', 24);
    SW.strike(g, { team: 'enemy', x: b.x - 42, y: b.y - 64, w: 84, h: 64, dmg: b.def.dmg + 3, kx: 4, ky: -6, heavy: true, unblockable: true, hitSet: new Set(), srcX: b.x, src: b });
    for (let i = 0; i < 34; i++) yield;
  }
  const B2 = SW.Boss2.prototype, _think = B2.think, _bdraw = B2.draw;
  B2.draw = function (ctx, cam) { if (this.burrowed) return drawMound(ctx, cam, this); return _bdraw.apply(this, arguments); };
  B2.think = function (g, z, p) {
    if (this.type === 'excavator' && !this.gen && !this.dead) {
      this.bcd = (this.bcd === undefined ? 160 : this.bcd) - 1;
      if (this.bcd <= 0 && this.idleT <= 2) { this.bcd = this.phase === 2 ? 330 : 470; this.gen = burrow(this, g); this.last = { name: 'xBurrowLunge' }; }
    }
    return _think.call(this, g, z, p);
  };

  // ================= small machines =================
  class Banner {
    constructor(sub, col) { this.sub = sub; this.col = col; }
    update(g) { if (g.banner) { g.banner.sub = this.sub; g.banner.col = this.col; } this.gone = true; }
    draw() {}
  }
  // sand pours through a crack overhead: calm, a trickle, then a column that knocks you down
  class SandFall {
    constructor(tx, ty0, ty1) { this.x = tx * T + 8; this.y0 = ty0 * T; this.y1 = (ty1 + 1) * T; this.t = Math.floor(Math.random() * 300); }
    phase() { const c = this.t % 300; return c < 170 ? 'off' : c < 210 ? 'warn' : 'pour'; }
    update(g) {
      this.t++;
      const p = g.player;
      if (!p || p.dead || g.busy() || this.phase() !== 'pour') return;
      if (Math.abs(p.x - this.x) < 11 && p.y > this.y0 && p.y - p.h < this.y1) {
        p.vy = Math.max(p.vy, 3);
        if (this.t % 45 === 0) SW.strike(g, { team: 'enemy', x: this.x - 10, y: this.y0, w: 20, h: this.y1 - this.y0, dmg: 4, kx: 0, ky: 1, unblockable: true, hitSet: new Set(), srcX: this.x });
      }
    }
    draw(ctx, cam) {
      const ph = this.phase(), x = Math.round(this.x - cam.x), y0 = Math.round(this.y0 - cam.y), y1 = Math.round(this.y1 - cam.y);
      if (x < -30 || x > W + 30) return;
      rect(ctx, '#2a1e12', x - 7, y0, 14, 3);
      if (ph === 'off') return;
      if (ph === 'warn') { for (let i = 0; i < 6; i++) rect(ctx, '#e8c890', x - 1 + (i % 2), y0 + ((this.t * 3 + i * 23) % (y1 - y0)), 1, 3); return; }
      for (let i = 0; i < 26; i++) { const yy = y0 + ((this.t * 6 + i * 29) % (y1 - y0)); rect(ctx, i % 3 ? '#c8a070' : '#e8c890', x - 8 + ((i * 5) % 16), yy, 2, 5); }
      ctx.globalAlpha = 0.5; rect(ctx, '#c8a070', x - 9, y0, 18, y1 - y0); ctx.globalAlpha = 1;
      disc(ctx, '#c8a070', x, y1, 10);
    }
  }
  // a Halcyon mirror mast: it throws mirages at whoever walks near, until the lens at its foot is smashed
  class Mast {
    constructor(tx, flag) { this.x = tx * T + 8; this.y = 20 * T; this.flag = flag; this.t = 0; this.cd = 60; this.kids = []; }
    update(g, z) {
      this.t++;
      const p = g.player;
      if (g.flag(this.flag)) { if (!this.cleared) { this.cleared = true; this.kids.forEach(e => { if (!e.dead) { e.hp = 0; e.die(g); } }); } return; }
      if (!p || p.dead || g.busy() || Math.abs(p.x - this.x) > 300) return;
      this.kids = this.kids.filter(e => !e.dead);
      if (--this.cd <= 0 && this.kids.length < 2) {
        this.cd = 230;
        const side = p.x < this.x ? -1 : 1, ex = this.x + side * SW.rand(30, 60), e = SW.spawnEnemy('mirage', ex, this.y);
        e.state = 'chase'; z.add(e); this.kids.push(e); fx.ring(ex, this.y - 18, '#9af0ff', 4, 26, 14); sfx('tele');
      }
    }
    draw(ctx, cam, g) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), up = !g.flag(this.flag);
      if (x < -40 || x > W + 40) return;
      rect(ctx, '#8a92a8', x - 2, y - 96, 4, 96); rect(ctx, '#5a6078', x - 8, y - 6, 16, 6);
      if (up) {
        rect(ctx, '#d8dce4', x - 16, y - 120, 32, 26); rect(ctx, '#9adfe8', x - 14, y - 118, 28, 22); rect(ctx, '#ffffff', x - 12, y - 116, 8, 4);
        const gl = (this.t * 2) % 40; if (gl < 20) rect(ctx, '#ffffff', x - 14 + gl, y - 118, 2, 22);
        art.glow(ctx, x, y - 107, 30, '#9af0ff', 0.1 + 0.05 * Math.sin(this.t * 0.1));
        if (this.t % 50 < 25) { ctx.globalAlpha = 0.25; line(ctx, '#e8fbff', x, y - 107, x - 80, y - 20, 1); line(ctx, '#e8fbff', x, y - 107, x + 80, y - 20, 1); ctx.globalAlpha = 1; }
      } else { rect(ctx, '#5a6078', x - 10, y - 100, 20, 4); for (let i = 0; i < 4; i++) rect(ctx, '#9adfe8', x - 12 + i * 7, y - 2, 3, 2); }
    }
  }

  // ================= missions =================
  Object.assign(M, {
    'BC-1': { id: 'BC-1', title: 'The City Under the Sand', hero: 'all', xp: 300, creds: 150, next: 'A2-3', steps: [
      { id: 'down', t: "Climb down the sinkhole behind the Baron's wreck (Ash Dunes)" }, { id: 'city', t: 'Cross the buried city to the Halcyon dig' },
      { id: 'boss', t: 'Stop the Excavator' }, { id: 'core', t: 'Open the Lantern Archive' }] },
    'GS-1': { id: 'GS-1', title: 'The Glass Sea', hero: 'all', xp: 340, creds: 160, next: 'A2-4', steps: [
      { id: 'enter', t: 'Go east out of the Glowwild, into the Glass Sea' }, { id: 'masts', t: 'Smash the three mirror masts', n: 3 }, { id: 'boss', t: 'Get past the Lenswright' }] }
  });
  if (M['A2-2']) M['A2-2'].next = 'BC-1';
  if (M['A2-3']) M['A2-3'].next = 'GS-1';
  if (M['A2-4']) { const s = M['A2-4'].steps.find(q => q.id === 'enter'); if (s) s.t = 'Go east from the Lensworks, into the Crater'; }
  if (story.cards.act2) story.cards.act2.lines[story.cards.act2.lines.length - 1] = 'Next: east, across the Glass Sea, to the Crater.';
  const _cg = G.continueGame; G.continueGame = function () {
    _cg.apply(this, arguments);
    const S = G.state;
    if (!S || G.scene !== 'play' || S.mission) return;
    if (S.done['BC-1'] && !S.done['A2-3']) S.mission = 'A2-3';
    else if (S.done['GS-1'] && !S.done['A2-4']) S.mission = 'A2-4';
  };

  // ================= BURIED MERIDIAN =================
  Z.sinkhole = {
    name: 'The Sinkhole', theme: 'sinkhole', music: 'buried', w: 44, h: 56,
    build(z, g) {
      z.add(new Banner('BENEATH THE ASH DUNES', '#d8b070'));
      z.fill(0, 0, 1, 56).fill(43, 0, 1, 46).ground(1, 43, 52);
      // ledges stepping down the throat of the hole; drop off the open end of each, or take the rope ladders
      z.fill(1, 8, 28, 2).fill(14, 18, 29, 2).fill(1, 28, 30, 2).fill(12, 38, 31, 2);
      z.clear(27, 8, 1, 2).ladder(27, 8, 10); z.clear(15, 18, 1, 2).ladder(15, 18, 10); z.clear(28, 28, 1, 2).ladder(28, 28, 10); z.clear(14, 38, 1, 2).ladder(14, 38, 14);
      z.spawn('top', 4, 7).spawn('bottom', 40, 51);
      z.exit(43, 46, 1, 6, 'meridian', 'west');
      z.thing('hatch', 2, 7, { prompt: 'Climb back up to the Ash Dunes', use: gg => gg.gotoZone('dunes', 'sink') });
      z.trigger(3, 0, 6, 8, gg => { if (onRoad(gg, 'BC-')) gg.say('bc_sink'); }, { flag: 'bc_sink' });
      z.trigger(1, 42, 42, 10, gg => { if (onRoad(gg, 'BC-')) { gg.step('BC-1:down'); gg.say('bc_floor'); } }, { flag: 'bc_floor' });
      [[36, 0, 17], [8, 20, 27], [36, 30, 37], [6, 40, 51]].forEach(q => z.add(new SandFall(q[0], q[1], q[2])));
      z.enemy('burrower', 18, 7);
      z.enemy('digdrone', 30, 13); z.enemy('burrower', 38, 17);
      z.enemy('digcrew', 9, 27); z.enemy('burrower', 22, 27);
      z.enemy('digcrew', 24, 37); z.enemy('digdrone', 34, 33);
      z.enemy('burrower', 20, 51); z.enemy('digcrew', 30, 51);
      lamp(z, 10, 7, '#ffe0a0'); lamp(z, 34, 37, '#ffffff'); lamp(z, 24, 51, '#ffffff');
      z.prop('crate', 36, 51).prop('crate', 37, 51).prop('barrel', 32, 37);
      z.save(6, 51, 'glyph');
    }
  };
  Z.meridian = {
    name: 'Buried Meridian', theme: 'buried', music: 'buried', w: 200, h: 26,
    build(z, g) {
      z.add(new Banner('BENEATH THE ASH DUNES', '#d8b070'));
      z.fill(0, 0, 200, 3).ground(0, 199, 22);
      z.spawn('west', 2, 21).spawn('east', 196, 21);
      z.exit(0, 3, 1, 19, 'sinkhole', 'bottom');
      // the station
      z.prop('train', 20, 21).prop('facade', 8, 21, { col: '#c8902a' });
      lamp(z, 5, 21, '#ffe0a0');
      z.thing('sign', 13, 21, { prompt: 'Read the plaque', use: gg => gg.say('bc_plaque') });
      z.enemy('burrower', 26, 21);
      // the high street: drifts, buildings, sand pouring through the roof
      [36, 52, 60].forEach((x, i) => z.prop('facade', x, 21, { col: i === 1 ? '#f5c542' : '#c8902a' }));
      z.fill(34, 20, 6, 2).fill(44, 19, 4, 3).fill(45, 18, 2, 1);
      z.add(new SandFall(40, 3, 21)); z.add(new SandFall(55, 3, 21));
      z.enemy('digcrew', 47, 18); z.enemy('digdrone', 50, 11); z.enemy('burrower', 57, 21);
      // the collapsed overpass, the mural on its deck
      z.fill(64, 20, 4, 2).fill(68, 18, 4, 4).fill(72, 16, 16, 6).fill(88, 18, 3, 4).fill(91, 20, 3, 2);
      z.thing('mural', 80, 15, { prompt: 'Look at the mural', use: gg => gg.say('bc_mural') });
      z.enemy('digcrew', 84, 15); z.enemy('burrower', 74, 15);
      // a rest, and the kiosk that explains what this place was
      z.save(96, 21, 'glyph'); lamp(z, 92, 21, '#ffffff'); z.pickup('item', 99, 21);
      z.thing('kiosk', 104, 21, { prompt: 'Read the kiosk', use: gg => gg.say('bc_kiosk') });
      z.prop('facade', 112, 21, { col: '#b9a0ff' });
      z.add(new SandFall(110, 3, 21));
      z.enemy('raider', 118, 21); z.enemy('digcrew', 124, 21); z.enemy('digdrone', 121, 12);
      // Halcyon's camp at the dig
      z.prop('tent', 134, 21, { col: '#e8e4d8' }).prop('tent', 144, 21, { col: '#e8e4d8' }).prop('banner', 130, 21, { col: '#d9b45a' }).prop('crate', 139, 21).prop('crate', 140, 21).prop('crate', 140, 20);
      lamp(z, 132, 21, '#ffffff'); lamp(z, 147, 21, '#ffffff');
      z.enemy('digcrew', 137, 21); z.enemy('burrower', 143, 21);
      z.trigger(128, 3, 3, 19, gg => { if (onRoad(gg, 'BC-')) { gg.step('BC-1:city'); gg.say('bc_dig'); } }, { flag: 'bc_dig' });
      // the dig site, the vault behind it
      z.prop('vault', 194, 21);
      z.add(new SandFall(160, 3, 21)); z.add(new SandFall(178, 3, 21));
      z.arena({ id: 'dig', x0: 150, x1: 190, gy: 21, gh: 19, boss: true, enemies: [['excavator', 182, 21]], intro: 'bc_exc_in', win: 'bc_exc_win', music: 'boss', onWin: gg => gg.step('BC-1:boss') });
      z.thing('core', 194, 21, { prompt: 'Open the Lantern Archive', glow: '#b9a0ff', when: gg => !!gg.flag('arena:meridian:dig') && !gg.flag('bc_core'),
        use: gg => gg.say('bc_core') });
      z.thing('console', 198, 21, { prompt: 'Ride the crate lift up to Scrapton', when: gg => !!gg.flag('arena:meridian:dig'), use: gg => gg.gotoZone('scrapton', 'west') });
    }
  };

  // ================= THE GLASS SEA =================
  Z.glasssea = {
    name: 'The Glass Sea', theme: 'glass', music: 'glass', w: 190, h: 23,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.ground(0, 189, 20);
      z.spawn('west', 3, 19).spawn('east', 186, 19);
      z.exit(0, 4, 1, 16, 'glowwild', 'east'); z.exit(189, 4, 1, 16, 'lensworks', 'west');
      z.trigger(1, 4, 7, 16, gg => { if (onRoad(gg, 'GS-')) { gg.step('GS-1:enter'); gg.say('gs_enter'); } }, { flag: 'gs_in' });
      // glass dunes and pools of glass still molten from the sun
      z.fill(14, 19, 6, 1).fill(16, 18, 2, 1).fill(64, 19, 8, 1).fill(66, 18, 4, 1).fill(122, 19, 7, 1).fill(124, 18, 3, 1);
      z.clear(36, 20, 6, 1).liquid(36, 21, 6, 2).plat(38, 18, 2);
      z.clear(84, 20, 7, 1).liquid(84, 21, 7, 2).plat(86, 18, 3);
      z.clear(140, 20, 8, 1).liquid(140, 21, 8, 2).plat(142, 18, 2).plat(146, 17, 2);
      [10, 28, 58, 76, 108, 134, 160, 176].forEach((x, i) => z.prop(i % 2 ? 'crystal' : 'glasscairn', x, 19));
      // three mirror masts: smash the lens at the foot of each
      const mast = (tx, n) => {
        z.add(new Mast(tx, 'gs_m' + n));
        const tg = z.target(tx, 18, 'gs_m' + n);
        tg.onHit = gg => { gg.count('GS-1:masts'); fx.shake(5, 14); fx.spark(tg.x, tg.y, '#e8fbff', 24, 4); const k = [1, 2, 3].filter(i => gg.flag('gs_m' + i)).length; gg.toast('Mirror mast smashed (' + k + '/3)', '#9af0ff'); if (k === 3) gg.say('gs_masts'); };
      };
      mast(48, 1); mast(100, 2); mast(152, 3);
      z.enemy('glasscrawler', 26, 19); z.enemy('lensdrone', 60, 10); z.enemy('glasshusk', 70, 19);
      z.save(94, 19, 'glyph'); z.pickup('item', 96, 19);
      z.enemy('glasscrawler', 112, 19); z.enemy('lensdrone', 120, 9); z.enemy('glasshusk', 130, 19); z.enemy('glasscrawler', 166, 19);
      z.hint(88, 10, 6, 10, 'The mirror masts throw mirages. Smash the lens at the foot of each mast.');
      z.gate(183, 4, 16, { openIf: gg => [1, 2, 3].every(i => gg.flag('gs_m' + i)) || !onRoad(gg, 'GS-') });
    }
  };
  Z.lensworks = {
    name: 'The Lensworks', theme: 'lens', music: 'glass', w: 96, h: 23,
    build(z, g) {
      z.add(new Banner('THE SURFACE', '#c8642a'));
      z.ground(0, 95, 20);
      z.spawn('west', 3, 19).spawn('east', 92, 19);
      z.exit(0, 4, 1, 16, 'glasssea', 'east'); z.exit(95, 4, 1, 16, 'crater', 'west');
      z.prop('tent', 10, 19, { col: '#e6e8ee' }).prop('tent', 22, 19, { col: '#e6e8ee' }).prop('banner', 6, 19, { col: '#d9b45a' }).prop('crate', 16, 19).prop('crate', 17, 19);
      [28, 44, 58, 72, 84].forEach(x => z.prop('mirrorpanel', x, 19));
      z.enemy('veilguard', 26, 19); z.enemy('lensdrone', 30, 10);
      z.save(4, 19, 'glyph');
      z.arena({ id: 'lens', x0: 36, x1: 88, gy: 19, gh: 16, boss: true, enemies: [['lenswright', 78, 19]], intro: 'gs_lens_in', win: 'gs_lens_win', music: 'boss', onWin: gg => gg.step('GS-1:boss') });
    }
  };

  // ================= hooking the regions into the road =================
  story.patch('dunes', (z, g) => {
    z.spawn('wreck', 58, 19).spawn('sink', 16, 19);
    z.prop('sinkhole', 16, 19);
    z.thing('hatch', 16, 19, { prompt: 'Climb down into the sinkhole', when: gg => !!(gg.state.steps['A2-2:boss'] || gg.state.done['A2-2']), use: gg => gg.gotoZone('sinkhole', 'top') });
  });
  story.patch('scrapton', (z, g) => {
    z.thing('cart', 84, 19, { prompt: "Ride the dune skiff to the Baron's wreck", when: gg => !!gg.state.done['A2-2'], use: gg => gg.gotoZone('dunes', 'wreck') });
    z.ents.forEach(e => { if (e instanceof SW.NPC && e.sheet === 'marlo') { const t0 = e.talk; e.talk = gg => (onRoad(gg, 'BC-') ? 'r_bc_marlo' : onRoad(gg, 'GS-') ? 'r_gs_marlo' : typeof t0 === 'function' ? t0(gg) : t0); } });
  });
  // east of the Glowwild is the Glass Sea now; the Crater's west edge opens onto the Lensworks
  story.patch('glowwild', z => { z.exits.forEach(e => { if (e.to === 'crater') { e.to = 'glasssea'; e.spawn = 'west'; } }); });
  story.patch('crater', z => { z.exits.forEach(e => { if (e.to === 'glowwild') { e.to = 'lensworks'; e.spawn = 'east'; } }); });
  // Marlo sends you down the sinkhole now, not straight to the Glowwild
  if (L.r_marlo_back) L.r_marlo_back.forEach(l => { if (l.step === 'A2-2:marlo') l.t = "Halcyon stamps on raider crates. The drivers say the Baron's crews hauled them up out of a sinkhole behind his wreck. There's a whole city under that sand. Find out what Halcyon is digging for. The dune skiff by the gate will run you out to the wreck."; });

  // ---------- the world map ----------
  D.world.push({ id: 'sinkhole', name: 'Buried Meridian', layer: 1, x: 70, y: 152 }, { id: 'glasssea', name: 'The Glass Sea', layer: 1, x: 400, y: 152 });
  D.routes.push(['dunes', 'sinkhole'], ['glowwild', 'glasssea'], ['glasssea', 'crater']);
  const GROUP = { meridian: 'sinkhole', lensworks: 'glasssea' };
  const _map = SW.ui.drawMap; SW.ui.drawMap = function (ctx, g) {
    const S = g.state, z0 = S.zone;
    if (GROUP[z0]) S.zone = GROUP[z0];
    try { return _map.apply(this, arguments); } finally { S.zone = z0; }
  };

  // ================= the words =================
  const HERO_EXC = {
    kael: "Big drill. Bigger target.", nyra: 'You are digging up people\'s memories with a machine. Stop.',
    fenn: 'It smells of oil and stolen things. I will tear it open.', isolde: 'Let me freeze that drill for you.',
    brakk: 'I have broken rock all my life. I can break you.', pyra: "Oh, you're hot? Let's see who's hotter.",
    gale: 'All that dust. I can work with dust.', ashka: 'That engine runs too hot. I can fix that. Permanently.',
    dyna: 'Ooh. That is a lot of fuel in one place. I\'m just saying.', vesper: 'Machines never look behind them. Neither will this one.',
    orin: 'You opened a door you should have left shut. I am closing it.', mira: 'Look at your reflection in the cab glass, Marshal. It looks worried.',
    noct: '...', bando: 'It has a cab. A cab has a door. A door has a face behind it.', aldric: 'Halt that machine, or I halt it for you.',
    sen: 'Steel against steel. Mine is sharper.', vega: 'Heavy things fall hardest.',
    tessa: 'I have seen how long this dig lasts. Not long.', jax: 'House wins, Marshal. I\'m the house now.',
    ferra: 'I can hear every cracked bolt in that thing. It is singing to me.', kiri: 'Two of me. One of you. Bad odds, Marshal.',
    tarn: "You're blocking the road. Move.", maren: 'You have made people forget who they are. I am the medicine.',
    yara: 'I could put one through the cab glass from here. I would rather watch.', brann: 'Get down off that thing.'
  };
  const HERO_LENS = {
    kael: 'I keep seeing two of you. Fine. I will hit both.', nyra: 'I fell through a sky. I know what is real now.',
    fenn: 'Your copies have no smell. I know which one is you.', isolde: 'Ice does not care how many of you there are.',
    brakk: 'You are made of glass. I am not.', pyra: 'Glass is just sand that met the right fire. Hi.',
    gale: 'Mirrors in the wind. Pretty. They break.', ashka: 'Heat bends light. Watch what I do with yours.',
    dyna: "Know what glass and fuses have in common? Neither will last long round me.", vesper: 'You hide behind copies. I hide behind nothing. Guess who you will not see coming.',
    orin: 'Every mirror is a door. I know the way through.', mira: 'Glass is mine, Lenswright. Ask any mirror.',
    noct: '...', bando: 'I will punch every one of you until I find the one that is real.', aldric: 'A knight fights the man, not his shadow. Stand still.',
    sen: 'The copy blinks before you do. I will cut the one that does not.', vega: 'All your images fall the same way. Down.',
    tessa: 'I already know which one is you. I saw it this morning.', jax: 'Shell game. I never lose a shell game.',
    ferra: 'Your staff is cheap tin under the polish. I can hear it.', kiri: 'Copies? Cute. I invented that.',
    tarn: "You're on the road. All of you. Move.", maren: 'Bring your copies. I can tell a healthy pulse from a picture.',
    yara: 'Real targets leave footprints in the glass. Yours do.', brann: 'Stop multiplying.'
  };
  Object.assign(L, {
    // --- Scrapton, between jobs ---
    r_bc_marlo: [say('marlo', "The skiff by the gate runs out to the Baron's wreck. The sinkhole is right behind it. Whatever Halcyon is pulling out of that sand, I want to know what it's worth to them.")],
    r_gs_marlo: [say('marlo', "East, past the Glowwild, the ground turns to glass. Juniper says there are mirrors out there now, on poles. Halcyon mirrors. Nobody builds a mirror in a desert for the view.")],
    // --- the Sinkhole ---
    bc_sink: [
      say('sys', 'The sinkhole drops away under your feet: a throat of sand and broken concrete, ledges going down into the dark. Ropes and Halcyon floodlights hang off the walls.'),
      say('hero', { K: '(Concrete. Down here? Somebody built something under the dunes.)', N: '(Concrete, under the dunes. Someone built something here, a long time ago.)' }),
      say('sys', 'Sand pours through the cracks. Stay out of it while it falls.')
    ],
    bc_floor: [say('sys', 'The floor of the sinkhole. To the east, through a broken wall, a street. Lamp posts. A station sign. A whole city, under the Ash Dunes.')],
    // --- Buried Meridian ---
    bc_plaque: [say('sys', 'A brass plaque, scrubbed clean by someone recently: "MERIDIAN CENTRAL. TRAINS EVERY FOUR MINUTES. MIND THE GAP."')],
    bc_mural: [
      say('sys', 'A mural on the overpass, half under the sand. A city under a clear blue sky. No Aurelia hanging over it. No crater in the ground.'),
      say('hero', { K: '(One sky. One ground. That is what it looked like before.)', N: '(No city in the sky. Just... sky.)' })
    ],
    bc_kiosk: [
      say('sys', 'A kiosk, still faintly lit: "THE LANTERN ARCHIVE. Deposit your memories, retrieve them anytime. Meridian remembers everything, so you don\'t have to."'),
      say('hero', { K: '(A vault of memories. And Halcyon is digging here.)', N: '(Halcyon steals memories. And here is a whole vault of them.)' })
    ],
    bc_dig: [
      say('sys', 'The Halcyon dig. Crates stamped with the gold seal, a crate lift to the surface, and at the end of the street a round vault door, half cut open.'),
      say('rusk', '(Over a loudspeaker) Dig Marshal Rusk to whoever just walked past my pickets. This is a Halcyon site. Turn round, or get put in a crate.')
    ],
    bc_exc_in: [
      say('rusk', 'Still walking. Fine. Fire up the rig.'),
      say('sys', 'Floodlights swing round. Something the size of a house rolls out of the dark on tracks, drill already turning.'),
      say('hero', HERO_EXC),
      say('sys', 'THE EXCAVATOR. Guard its swings (S). When it dives into the sand, keep moving: a mound follows you, then stops and shakes. Get away from it before it erupts.')
    ],
    bc_exc_win: [
      say('sys', 'The rig grinds to a halt, smoking. Up on the camp, Dig Marshal Rusk drops the loudspeaker and runs for the crate lift without it.'),
      say('sys', 'The vault door stands open. Inside, rows of glass cylinders glow violet in the dark.')
    ],
    bc_core: [
      say('sys', 'You lay a hand on the nearest cylinder. For a moment you are somewhere else: a train platform, rain, a child laughing, a smell of bread. Not your memory. Somebody\'s.'),
      say('sys', 'Shipping labels on the empty racks: HALCYON RELAY, GLOWWILD SECTOR. Half the archive is already gone, crated up to the relay tower in the Glowwild.'),
      say('hero', { K: "(They're feeding a whole city's memories into that tower.) Then the Glowwild is next.", N: '(A whole city\'s memories, fed into a tower.) The Glowwild, then.' }),
      say('sys', 'The crate lift at the back of the dig runs up to the scrap heaps outside Scrapton.', { flag: 'bc_core', step: 'BC-1:core' })
    ],
    // --- the Glass Sea ---
    gs_enter: [
      say('sys', 'East of the Glowwild the ground turns to glass: a whole sea of it, fused by whatever came down here ninety years ago. It rings under your boots.'),
      say('sys', 'Tall masts stand on the glass, mirrors at the top, turning towards you. Halcyon gold on every pole.'),
      say('hero', { K: '(Somebody is watching me through those mirrors.)', N: '(Mirrors. Halcyon likes to watch.)' })
    ],
    gs_masts: [
      say('sys', 'The last mirror shatters. The mirages flicker out, and the glass is quiet again.'),
      say('hero', { K: '(Fake people, thrown by mirrors. Whoever built this is close.)', N: '(Illusions. Halcyon is practising something.)' })
    ],
    gs_lens_in: [
      say('sys', 'Mirror panels on stands, all turned to face one man: thin, white coat, a glass visor over his eyes, a staff tipped with a lens.'),
      say('lenswright', 'Oh, you are early. The Parallax trial is not ready. The subjects are not even in place.'),
      say('hero', HERO_LENS),
      say('lenswright', 'No matter. Let us see how well you tell the real thing from a reflection.'),
      say('sys', 'THE LENSWRIGHT. His mirror images break at a touch, but they hit like the real one. Guard his staff (S); dash (L) through his lunge.')
    ],
    gs_lens_win: [
      say('lenswright', 'Ha... You see clearly. That will not last. Field Post 3 will show you exactly what you want to see.'),
      say('sys', 'He breaks his own visor against the glass and is gone in a flash of light. East, the ground slopes down into the Crater.')
    ]
  });
  story.surface = { Mast, SandFall, burrow };
})();
