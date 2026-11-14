'use strict';
// Shattered Worlds — core: namespace, utils, input, audio, pixel font, storage.
(function () {
  const SW = window.SW = { W: 480, H: 270, T: 16, frame: 0 };

  // ---------- utils ----------
  SW.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  SW.lerp = (a, b, t) => a + (b - a) * t;
  SW.rng = function (seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  SW.rand = (a, b) => a + Math.random() * (b - a);
  SW.randi = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  SW.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  SW.overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  SW.canvas = function (w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    return [c, x];
  };

  // ---------- event bus ----------
  const handlers = {};
  SW.on = (e, f) => { (handlers[e] = handlers[e] || []).push(f); };
  SW.emit = (e, ...a) => { (handlers[e] || []).forEach(f => f(...a)); };

  // ---------- input ----------
  const KEYMAP = {
    KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
    KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down',
    KeyJ: 'attack', KeyK: 'jump', Space: 'jump', KeyL: 'dash',
    KeyU: 'skill', KeyI: 'special', KeyO: 'awaken', KeyE: 'interact', KeyQ: 'item',
    KeyM: 'map', Escape: 'pause', Enter: 'confirm',
    F7: 'dbgHeal', F8: 'dbgWarp', F9: 'dbgUnlock'
  };
  const PADMAP = { 2: 'attack', 0: 'jump', 5: 'dash', 3: 'skill', 1: 'special', 7: 'awaken', 6: 'guard', 4: 'charge', 8: 'map', 9: 'pause' };
  const I = SW.input = { down: {}, pad: {}, now: {}, prev: {}, lastHit: {}, keys: [], raw: {} };
  window.addEventListener('keydown', e => {
    const a = KEYMAP[e.code];
    I.raw[e.code] = true;   // raw key state by physical key (Versus mode reads two players from it)
    if (a) { I.down[a] = true; e.preventDefault(); } else if (/^Numpad/.test(e.code)) e.preventDefault();
    I.keys.push(e.key); if (I.keys.length > 24) I.keys.shift();   // raw key queue (used for typing the unlock code)
    SW.audio.unlock();
  });
  window.addEventListener('keyup', e => { const a = KEYMAP[e.code]; I.raw[e.code] = false; if (a) { I.down[a] = false; e.preventDefault(); } });
  window.addEventListener('blur', () => { I.down = {}; I.raw = {}; });
  I.update = function () {
    I.pad = {};
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p || !p.connected) continue;
      const ax = p.axes[0] || 0, ay = p.axes[1] || 0, b = i => p.buttons[i] && p.buttons[i].pressed;
      if (ax < -0.4 || b(14)) I.pad.left = true;
      if (ax > 0.4 || b(15)) I.pad.right = true;
      if (ay < -0.5 || b(12)) { I.pad.up = true; }
      if (b(12)) I.pad.interact = true;
      if (ay > 0.5 || b(13)) I.pad.down = true;
      for (const k in PADMAP) if (b(+k)) I.pad[PADMAP[k]] = true;
      if (b(0)) I.pad.confirm = true;
    }
    I.prev = I.now; I.now = {};
    for (const a in I.down) if (I.down[a]) I.now[a] = true;
    for (const a in I.pad) I.now[a] = true;
    for (const a in I.now) if (!I.prev[a]) I.lastHit[a] = SW.frame;
  };
  I.held = a => !!I.now[a];
  I.hit = a => !!I.now[a] && !I.prev[a];
  // buffered press: true if pressed within `n` frames and not consumed
  I.buffered = (a, n) => I.lastHit[a] !== undefined && SW.frame - I.lastHit[a] <= n;
  I.consume = a => { I.lastHit[a] = undefined; };
  I.ok = () => I.hit('confirm') || I.hit('attack') || I.hit('interact');
  I.back = () => I.hit('pause') || I.hit('jump');

  // ---------- audio ----------
  const A = SW.audio = { ctx: null, vol: { sfx: 0.6, music: 0.45 }, intensity: 0, track: null };
  A.unlock = function () {
    if (!A.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      A.ctx = new AC();
      A.sfxG = A.ctx.createGain(); A.sfxG.gain.value = A.vol.sfx; A.sfxG.connect(A.ctx.destination);
      A.musG = A.ctx.createGain(); A.musG.gain.value = A.vol.music; A.musG.connect(A.ctx.destination);
      const len = A.ctx.sampleRate, buf = A.ctx.createBuffer(1, len, len), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      A.noiseBuf = buf;
    }
    if (A.ctx.state === 'suspended') A.ctx.resume();
  };
  A.setVol = function () { if (A.ctx) { A.sfxG.gain.value = A.vol.sfx; A.musG.gain.value = A.vol.music; } };
  function tone(type, f0, f1, dur, vol, delay, dest) {
    const c = A.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || A.sfxG); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, freq, ftype, delay, dest, f1) {
    const c = A.ctx, t = c.currentTime + (delay || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = A.noiseBuf; s.loop = true; f.type = ftype || 'lowpass'; f.frequency.setValueAtTime(freq, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || A.sfxG); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }
  const SFX = {
    swing: () => noise(0.09, 0.22, 900, 'bandpass', 0, null, 2600),
    hit: () => { tone('square', 190, 60, 0.08, 0.3); noise(0.06, 0.3, 2400, 'lowpass'); },
    heavy: () => { tone('square', 130, 38, 0.18, 0.4); noise(0.16, 0.45, 1200, 'lowpass'); },
    block: () => { tone('triangle', 980, 720, 0.06, 0.3); noise(0.04, 0.2, 5000, 'highpass'); },
    perfect: () => { tone('sine', 1200, 1800, 0.12, 0.3); tone('sine', 1800, 2500, 0.16, 0.25, 0.08); },
    jump: () => tone('square', 300, 540, 0.09, 0.12),
    djump: () => tone('square', 440, 800, 0.1, 0.12),
    dash: () => noise(0.14, 0.3, 500, 'bandpass', 0, null, 3200),
    land: () => noise(0.05, 0.18, 400, 'lowpass'),
    shoot: () => tone('sawtooth', 760, 200, 0.12, 0.2),
    zap: () => { tone('square', 1500, 180, 0.14, 0.2); noise(0.1, 0.18, 4000, 'highpass'); },
    burst: () => { tone('sine', 220, 50, 0.28, 0.5); noise(0.22, 0.35, 900, 'lowpass'); },
    explode: () => { noise(0.45, 0.6, 700, 'lowpass', 0, null, 80); tone('sine', 100, 28, 0.4, 0.5); },
    pickup: () => { tone('sine', 880, 880, 0.07, 0.25); tone('sine', 1320, 1320, 0.1, 0.25, 0.06); },
    shard: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone('sine', f, f, 0.3, 0.22, i * 0.09)); },
    heal: () => { tone('sine', 520, 1040, 0.3, 0.25); tone('triangle', 780, 1560, 0.3, 0.12, 0.05); },
    blip: p => tone('square', p || 440, (p || 440) * 0.94, 0.035, 0.09),
    move: () => tone('square', 660, 660, 0.03, 0.1),
    select: () => { tone('square', 880, 880, 0.05, 0.12); tone('square', 1320, 1320, 0.08, 0.12, 0.05); },
    back: () => tone('square', 440, 300, 0.08, 0.12),
    hurt: () => { tone('sawtooth', 320, 90, 0.16, 0.3); noise(0.08, 0.2, 1500, 'lowpass'); },
    die: () => tone('sawtooth', 420, 40, 0.6, 0.35),
    charge: () => tone('sawtooth', 110, 240, 0.12, 0.1),
    level: () => { [392, 523, 659, 784, 1047].forEach((f, i) => tone('square', f, f, 0.14, 0.14, i * 0.07)); },
    roar: () => { tone('sawtooth', 95, 48, 0.7, 0.45); noise(0.6, 0.3, 500, 'lowpass'); },
    tele: () => { tone('sine', 1040, 1040, 0.06, 0.22); tone('sine', 1040, 1040, 0.06, 0.22, 0.1); },
    gate: () => { noise(0.3, 0.3, 300, 'lowpass'); tone('square', 80, 60, 0.25, 0.25); },
    awaken: () => { tone('sawtooth', 90, 900, 0.7, 0.35); noise(0.7, 0.3, 300, 'bandpass', 0, null, 5000); },
    save: () => { [659, 784, 988].forEach((f, i) => tone('triangle', f, f, 0.25, 0.2, i * 0.12)); },
    deny: () => tone('square', 160, 120, 0.12, 0.15),
    coin: () => { tone('square', 988, 988, 0.05, 0.12); tone('square', 1319, 1319, 0.12, 0.12, 0.05); }
  };
  A.sfx = function (name, arg) { if (A.ctx && SFX[name]) { try { SFX[name](arg); } catch (e) { /* audio is best-effort */ } } };

  // --- tiny step sequencer: one synthwave-ish loop per zone, drums/lead fade in with battle intensity ---
  A.tracks = {
    title:   { bpm: 92,  root: 45, prog: [0, -4, -7, -2], arp: [0, 7, 12, 15, 19, 15, 12, 7], bass: 'sawtooth', drums: 0.6 },
    slums:   { bpm: 104, root: 43, prog: [0, 0, -2, -5],  arp: [0, 3, 7, 10, 12, 10, 7, 3],   bass: 'square',   drums: 0.5 },
    market:  { bpm: 112, root: 45, prog: [0, 3, -2, -4],  arp: [0, 7, 3, 10, 12, 7, 15, 10],  bass: 'sawtooth', drums: 1 },
    metro:   { bpm: 88,  root: 40, prog: [0, 1, 0, -2],   arp: [0, 3, 6, 3, 12, 6, 3, 0],     bass: 'triangle', drums: 0.3 },
    lab:     { bpm: 100, root: 47, prog: [0, -3, 2, -5],  arp: [0, 7, 14, 7, 12, 19, 14, 7],  bass: 'square',   drums: 0.4 },
    sky:     { bpm: 116, root: 48, prog: [0, 5, -4, -2],  arp: [0, 4, 7, 11, 12, 11, 7, 4],   bass: 'sawtooth', drums: 0.8, major: true },
    surface: { bpm: 96,  root: 42, prog: [0, -2, -5, -7], arp: [0, 7, 10, 7, 12, 7, 10, 3],   bass: 'sawtooth', drums: 0.5 },
    arena:   { bpm: 132, root: 41, prog: [0, 0, 3, -2],   arp: [0, 12, 7, 12, 3, 12, 7, 10],  bass: 'square',   drums: 1 },
    boss:    { bpm: 140, root: 38, prog: [0, 1, -2, 3],   arp: [0, 12, 3, 12, 7, 12, 6, 12],  bass: 'sawtooth', drums: 1 },
    memory:  { bpm: 70,  root: 57, prog: [0, -4, -7, -5], arp: [0, 7, 12, 16, 19, 16, 12, 7], bass: 'sine',     drums: 0, major: true }
  };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  let seqTimer = null, step = 0, nextT = 0;
  function schedule() {
    const c = A.ctx, tr = A.tracks[A.track];
    if (!c || !tr) return;
    const spb = 60 / tr.bpm / 4;
    while (nextT < c.currentTime + 0.15) { playStep(tr, step, nextT - c.currentTime, spb); nextT += spb; step++; }
  }
  function playStep(tr, step, t, spb) {
    {
      const s = step % 16, bar = Math.floor(step / 16) % tr.prog.length;
      const root = tr.root + tr.prog[bar], third = tr.major ? 4 : 3, dv = tr.drums * (0.35 + 0.65 * A.intensity);
      if (s % 2 === 0) tone(tr.bass, mtof(root - 12 + (s % 8 === 6 ? 12 : 0)), mtof(root - 12 + (s % 8 === 6 ? 12 : 0)), spb * 1.7, 0.2, t, A.musG);
      const n = tr.arp[step % tr.arp.length];
      const semi = n % 12 === 3 || n % 12 === 4 ? Math.floor(n / 12) * 12 + third : n;
      tone('square', mtof(root + 12 + semi), mtof(root + 12 + semi), spb * 0.9, 0.05 + 0.03 * A.intensity, t, A.musG);
      if (s === 0) { [0, third, 7].forEach(k => tone('triangle', mtof(root + k), mtof(root + k), spb * 15, 0.06, t, A.musG)); }
      if (dv > 0) {
        if (s % 4 === 0) tone('sine', 130, 40, 0.12, 0.5 * dv, t, A.musG);
        if (s % 8 === 4) noise(0.1, 0.3 * dv, 1800, 'bandpass', t, A.musG);
        if (s % 2 === 1) noise(0.03, 0.1 * dv, 7000, 'highpass', t, A.musG);
      }
      if (A.intensity > 0.6 && s % 4 === 2) tone('sawtooth', mtof(root + 24 + tr.arp[(step >> 2) % tr.arp.length]), mtof(root + 24), spb * 1.5, 0.045, t, A.musG);
    }
  }
  // runs every sound effect and every music step once (muted) and returns any errors; used by the test harness
  A.selfTest = function () {
    const errs = [];
    if (!A.ctx) return ['no audio context'];
    const v = [A.sfxG.gain.value, A.musG.gain.value];
    A.sfxG.gain.value = 0; A.musG.gain.value = 0;
    Object.keys(SFX).forEach(n => { try { SFX[n](440); } catch (e) { errs.push('sfx ' + n + ': ' + e); } });
    Object.keys(A.tracks).forEach(id => { for (let s = 0; s < 64; s++) { try { playStep(A.tracks[id], s, 0.01 * s, 60 / A.tracks[id].bpm / 4); } catch (e) { errs.push('music ' + id + ' step ' + s + ': ' + e); break; } } });
    setTimeout(() => { A.sfxG.gain.value = v[0]; A.musG.gain.value = v[1]; }, 2500);
    return errs;
  };
  A.music = function (id) {
    if (A.track === id) return;
    A.track = id;
    if (!A.ctx) return;
    step = 0; nextT = A.ctx.currentTime + 0.1;
    if (!seqTimer) seqTimer = setInterval(() => { if (A.ctx && A.track && A.ctx.state === 'running') { if (nextT < A.ctx.currentTime) nextT = A.ctx.currentTime + 0.05; schedule(); } }, 40);
  };

  // ---------- pixel font (5x7 + descender row, proportional) ----------
  const G = {
    A: '.###./#...#/#...#/#####/#...#/#...#/#...#', B: '####./#...#/#...#/####./#...#/#...#/####.', C: '.###./#...#/#..../#..../#..../#...#/.###.',
    D: '####./#...#/#...#/#...#/#...#/#...#/####.', E: '#####/#..../#..../####./#..../#..../#####', F: '#####/#..../#..../####./#..../#..../#....',
    G: '.###./#...#/#..../#.###/#...#/#...#/.###.', H: '#...#/#...#/#...#/#####/#...#/#...#/#...#', I: '###/.#./.#./.#./.#./.#./###',
    J: '..###/...#./...#./...#./...#./#..#./.##..', K: '#...#/#..#./#.#../##.../#.#../#..#./#...#', L: '#..../#..../#..../#..../#..../#..../#####',
    M: '#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#', N: '#...#/##..#/#.#.#/#..##/#...#/#...#/#...#', O: '.###./#...#/#...#/#...#/#...#/#...#/.###.',
    P: '####./#...#/#...#/####./#..../#..../#....', Q: '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#', R: '####./#...#/#...#/####./#.#../#..#./#...#',
    S: '.####/#..../#..../.###./....#/....#/####.', T: '#####/..#../..#../..#../..#../..#../..#..', U: '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
    V: '#...#/#...#/#...#/#...#/#...#/.#.#./..#..', W: '#...#/#...#/#...#/#.#.#/#.#.#/##.##/#...#', X: '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
    Y: '#...#/#...#/.#.#./..#../..#../..#../..#..', Z: '#####/....#/...#./..#../.#.../#..../#####',
    a: '//.###./....#/.####/#...#/.####', b: '#..../#..../####./#...#/#...#/#...#/####.', c: '//.###./#..../#..../#..../.###.',
    d: '....#/....#/.####/#...#/#...#/#...#/.####', e: '//.###./#...#/#####/#..../.###.', f: '..##/.#../###./.#../.#../.#../.#..',
    g: '//.####/#...#/#...#/.####/....#/.###.', h: '#..../#..../####./#...#/#...#/#...#/#...#', i: '#//#/#/#/#/#',
    j: '..#//..#/..#/..#/..#/..#/##.', k: '#.../#.../#..#/#.#./##../#.#./#..#', l: '#./#./#./#./#./#./.#',
    m: '//##.#./#.#.#/#.#.#/#.#.#/#.#.#', n: '//####./#...#/#...#/#...#/#...#', o: '//.###./#...#/#...#/#...#/.###.',
    p: '//####./#...#/#...#/####./#..../#....', q: '//.####/#...#/#...#/.####/....#/....#', r: '//#.##/##../#.../#.../#...',
    s: '//.####/#..../.###./....#/####.', t: '.#../.#../###./.#../.#../.#../..##', u: '//#...#/#...#/#...#/#...#/.####',
    v: '//#...#/#...#/#...#/.#.#./..#..', w: '//#...#/#.#.#/#.#.#/#.#.#/.#.#.', x: '//#...#/.#.#./..#../.#.#./#...#',
    y: '//#...#/#...#/#...#/.####/....#/.###.', z: '//#####/...#./..#../.#.../#####',
    0: '.###./#...#/#..##/#.#.#/##..#/#...#/.###.', 1: '.#./##./.#./.#./.#./.#./###', 2: '.###./#...#/....#/...#./..#../.#.../#####',
    3: '####./....#/....#/.###./....#/....#/####.', 4: '...#./..##./.#.#./#..#./#####/...#./...#.', 5: '#####/#..../####./....#/....#/#...#/.###.',
    6: '.###./#..../#..../####./#...#/#...#/.###.', 7: '#####/....#/...#./..#../..#../..#../..#..', 8: '.###./#...#/#...#/.###./#...#/#...#/.###.',
    9: '.###./#...#/#...#/.####/....#/....#/.###.',
    '.': '//////#', ',': '//////.#/#.', '!': '#/#/#/#/#//#', '?': '.###./#...#/....#/...#./..#..//..#..', ':': '//#///#', ';': '//.#///.#/#.',
    "'": '#/#', '"': '#.#/#.#', '-': '///###', '+': '//.#./###/.#.', '/': '....#/...#./...#./..#../.#.../.#.../#....',
    '(': '.#/#./#./#./#./#./.#', ')': '#./.#/.#/.#/.#/.#/#.', '%': '##..#/##.#./...#./..#../.#.../.#.##/#..##', '*': '/#.#/.#./#.#',
    '#': '/.#.#./#####/.#.#./#####/.#.#.', '=': '///###//###', '<': '/..#/.#./#../.#./..#', '>': '/#../.#./..#/.#./#..',
    '[': '##/#./#./#./#./#./##', ']': '##/.#/.#/.#/.#/.#/##', '_': '//////#####', '&': '.#.../#.#../#.#../.#.../#.#.#/#..#./.##.#',
    '^': '..#../.#.#./#...#', '~': '///.#..#/#.##.', '|': '#/#/#/#/#/#/#', '`': '#####/#####/#####/#####/#####/#####/#####',
    // Spanish (js/i18n.js): accented letters, ñ, and the opening ¿ ¡
    'á': '...#./..#../.###./....#/.####/#...#/.####', 'é': '...#./..#../.###./#...#/#####/#..../.###.', 'í': '.#//#/#/#/#/#',
    'ó': '...#./..#../.###./#...#/#...#/#...#/.###.', 'ú': '...#./..#../#...#/#...#/#...#/#...#/.####', 'ü': '.#.#.//#...#/#...#/#...#/#...#/.####',
    'ñ': '.##.#/#..#./####./#...#/#...#/#...#/#...#', 'Á': '...#./.###./#...#/#####/#...#/#...#/#...#', 'É': '...#./#####/#..../####./#..../#..../#####',
    'Í': '..#/###/.#./.#./.#./.#./###', 'Ó': '...#./.###./#...#/#...#/#...#/#...#/.###.', 'Ú': '...#./#...#/#...#/#...#/#...#/#...#/.###.',
    'Ü': '.#.#./#...#/#...#/#...#/#...#/#...#/.###.', 'Ñ': '.##.#/#...#/##..#/#.#.#/#..##/#...#/#...#', '¿': '..#..//..#../.#.../#..../#...#/.###.', '¡': '#//#/#/#/#/#'
  };
  const F = SW.font = { cw: 6, ch: 9, lh: 10, w: {}, pos: {}, tints: {} };
  (function bake() {
    const keys = Object.keys(G), [c, x] = SW.canvas(keys.length * F.cw, F.ch);
    x.fillStyle = '#fff';
    keys.forEach((k, i) => {
      const rows = G[k].split('/');
      let w = 0;
      rows.forEach((r, y) => { for (let j = 0; j < r.length; j++) if (r[j] === '#') { x.fillRect(i * F.cw + j, y, 1, 1); if (j + 1 > w) w = j + 1; } });
      F.w[k] = w; F.pos[k] = i * F.cw;
    });
    F.w[' '] = 3; F.atlas = c;
  })();
  function tinted(color) {
    if (F.tints[color]) return F.tints[color];
    const [c, x] = SW.canvas(F.atlas.width, F.atlas.height);
    x.drawImage(F.atlas, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    return (F.tints[color] = c);
  }
  SW.textW = function (str) {
    let w = 0;
    for (const ch of String(str)) w += (F.w[ch] !== undefined ? F.w[ch] : F.w['?']) + 1;
    return Math.max(0, w - 1);
  };
  function drawLine(ctx, str, x, y, color) {
    const img = tinted(color);
    for (const ch of str) {
      if (ch === ' ') { x += 4; continue; }
      const k = F.pos[ch] !== undefined ? ch : '?';
      ctx.drawImage(img, F.pos[k], 0, F.cw, F.ch, x, y, F.cw, F.ch);
      x += F.w[k] + 1;
    }
  }
  // opts: { align: 'left'|'center'|'right', shadow: '#000'|false, scale }
  SW.text = function (ctx, str, x, y, color, opts) {
    opts = opts || {};
    const lines = String(str).split('\n'), sc = opts.scale || 1;
    if (sc !== 1) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); x = 0; y = 0; }
    lines.forEach((ln, i) => {
      const w = SW.textW(ln);
      let lx = Math.round(x), ly = Math.round(y + i * F.lh);
      if (opts.align === 'center') lx -= Math.round(w / 2); else if (opts.align === 'right') lx -= w;
      if (opts.shadow !== false) drawLine(ctx, ln, lx + 1, ly + 1, opts.shadow || '#05060c');
      drawLine(ctx, ln, lx, ly, color || '#fff');
    });
    if (sc !== 1) ctx.restore();
  };
  SW.wrap = function (str, maxW) {
    const out = [];
    String(str).split('\n').forEach(par => {
      let line = '';
      par.split(' ').forEach(word => {
        const t = line ? line + ' ' + word : word;
        if (SW.textW(t) > maxW && line) { out.push(line); line = word; } else line = t;
      });
      out.push(line);
    });
    return out;
  };

  // ---------- storage ----------
  const KEY = 'shattered-worlds-save-v1';
  SW.store = {
    load() { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } },
    save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } },
    clear() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } }
  };
})();
