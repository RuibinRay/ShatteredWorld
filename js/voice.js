'use strict';
// Shattered Worlds — hero voices and sound signatures. Loaded after finisher.js; only wraps.
//
// VOICES, in English by default:
//   - The finisher's spoken line (finisher.js) now starts in English (M in the finisher still switches English, Chinese,
//     Japanese or off, and the choice is kept).
//   - Every hero has their own voice: the device's English voices are shared out between the heroes (deeper-sounding
//     voices for the low-voiced heroes, brighter ones for the high), and each hero also gets their own pitch and speed, so
//     no two sound the same even on a device with only one or two voices. The Convergence gets a robotic voice where the
//     device has one.
//   - Heroes call out their ultimate and their awakening by name, in that voice (only while the voice is English).
//   - Phones: iOS lets a page speak only after a tap, so the first tap or key press unlocks speech silently.
// SOUND SIGNATURES:
//   - Each hero's swings, hits and skills carry an extra layer in their element's colour (a crackle for fire, a chime
//     for ice, a zap for lightning, a ring for blades, a thump for earth, and so on), tuned to the hero, so every hero
//     sounds different. Being hit gives a short grunt at the hero's own pitch.
// SW.voice.on = false turns all of it off; SW.voice.profileOf(id) shows a hero's voice.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, A = SW.audio, P = SW.Player.prototype, HR = D.heroes;
  const VO = SW.voice = { on: true, last: 0 };
  const speechOk = () => !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  // ---------- English by default ----------
  const pref = () => (SW.profile && SW.profile.finVoice) || 'en';
  const setDefault = () => { if (SW.profile && !SW.profile.finVoice) SW.profile.finVoice = 'en'; };   // not saved until the player changes it
  setDefault(); window.addEventListener('load', setDefault);

  // ---------- the device's English voices, split into deeper and brighter ----------
  const NOVELTY = /bells|bubbles|boing|cellos|good news|bad news|organ|wobble|jester|superstar|bahh|whisper|zarvox|trinoids|hysterical|deranged|albert/i;
  const ROBOT = /zarvox|trinoids|robot/i;
  const DEEP = /david|mark|guy|ryan|daniel|alex|fred|rishi|aaron|arthur|gordon|lee|oliver|tom\b|eddy|reed|rocko|ralph|junior|james|george|brian|christopher|eric|roger|steffan|thomas|william|liam|male/i;
  let pools = { deep: [], bright: [], all: [], robot: null };
  function loadVoices() {
    if (!speechOk()) return;
    let list = [];
    try { list = speechSynthesis.getVoices() || []; } catch (e) { list = []; }
    const en = list.filter(v => v.lang && /^en([-_]|$)/i.test(v.lang));
    const score = v => (v.localService ? 2 : 0) + (/premium|enhanced|natural|neural/i.test(v.name) ? 3 : 0) + (/^en[-_]us/i.test(v.lang) ? 1 : 0);
    const normal = en.filter(v => !NOVELTY.test(v.name)).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
    pools = { deep: normal.filter(v => DEEP.test(v.name)), bright: normal.filter(v => !DEEP.test(v.name)), all: normal, robot: en.find(v => ROBOT.test(v.name)) || null };
    cache.clear();
  }
  const cache = new Map();
  // a hero's voice: which device voice, pitch and speed. Pitch follows the hero's own dialogue pitch (160 to 720).
  VO.profileOf = function (id) {
    if (cache.has(id)) return cache.get(id);
    const h = HR[id] || {}, k = hash(id), hp = h.pitch || 440;
    const fast = h.modeKind === 'speed', heavy = /heavy|great|maul/.test(h.combo || '');
    const pitch = SW.clamp(0.5 + (hp - 150) / 620 + ((k % 13) - 6) * 0.012, 0.35, 1.75);
    const rate = SW.clamp((fast ? 1.1 : heavy ? 0.9 : 1) + (((k >>> 4) % 11) - 5) * 0.012, 0.75, 1.3);
    let voice = null;
    if (id === 'convergence' && pools.robot) voice = pools.robot;
    else {
      const pool = (hp < 430 ? pools.deep : pools.bright).length ? (hp < 430 ? pools.deep : pools.bright) : pools.all;
      if (pool.length) voice = pool[(k >>> 8) % pool.length];
    }
    const p = { voice, pitch: id === 'convergence' ? 0.4 : pitch, rate: id === 'convergence' ? 0.82 : rate };
    cache.set(id, p);
    return p;
  };
  if (speechOk()) { loadVoices(); try { speechSynthesis.addEventListener('voiceschanged', loadVoices); } catch (e) { /* old browsers */ } }

  // ---------- the finisher's lines: give each its hero's voice ----------
  const lineHero = new Map();
  const indexLines = () => { const L = SW.finisherLines || {}; for (const id in L) (L[id] || []).forEach(row => (row || []).forEach(t => { if (t) lineHero.set(t, id); })); };
  indexLines(); window.addEventListener('load', indexLines);
  if (speechOk()) {
    const ss = window.speechSynthesis, _speak = ss.speak.bind(ss);
    ss.speak = function (u) {
      try {
        const id = u && lineHero.get(u.text);
        if (VO.on && id) {
          const pr = VO.profileOf(id), english = !u.lang || /^en/i.test(u.lang) || pref() === 'en';
          if (english && pr.voice) { u.voice = pr.voice; u.lang = pr.voice.lang; }
          u.pitch = pr.pitch; u.rate = pr.rate;
          VO.last = performance.now();
        }
      } catch (e) { /* speech is best-effort */ }
      return _speak(u);
    };
  }

  // ---------- callouts: the ultimate and the awakening, by name ----------
  function callout(hero, text) {
    if (!VO.on || !speechOk() || !text || pref() !== 'en') return;
    if (document.visibilityState !== 'visible') return;
    if (SW.versus && SW.versus.simulating) return;                       // Tournament matches settled at once
    const now = performance.now();
    if (now - VO.last < 1200 || speechSynthesis.speaking) return;        // never talk over a line or each other
    VO.last = now;
    try {
      const u = new SpeechSynthesisUtterance(text), pr = VO.profileOf(hero);
      if (pr.voice) { u.voice = pr.voice; u.lang = pr.voice.lang; } else u.lang = 'en-US';
      u.pitch = pr.pitch; u.rate = Math.min(1.35, pr.rate * 1.08); u.volume = 0.95;
      speechSynthesis.speak(u);
    } catch (e) { /* none */ }
  }
  const heroIdOf = p => (p && p.G && p.G.state ? p.G.state.hero : null);

  // ---------- sound signatures ----------
  // a few small synth voices, played next to the game's own sounds (core.js) through its effects volume
  function tone(type, f0, f1, dur, vol, delay) {
    const c = A.ctx; if (!c || !A.sfxG) return;
    const t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(A.sfxG); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, freq, ftype, f1, delay) {
    const c = A.ctx; if (!c || !A.sfxG || !A.noiseBuf) return;
    const t = c.currentTime + (delay || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = A.noiseBuf; s.loop = true; f.type = ftype || 'lowpass'; f.frequency.setValueAtTime(freq, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(A.sfxG); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }
  // element -> a layer; m tunes it to the hero (0.8 to 1.2), big for hits that land hard
  const KINDS = [
    [/lightning|thunder|static|volt/i, (m, big) => { tone('square', 1900 * m, 520 * m, big ? 0.12 : 0.07, 0.08); noise(0.05, 0.08, 5200 * m, 'highpass'); }],
    [/ice|frost|rime|winter/i, (m, big) => { tone('sine', 2100 * m, 2100 * m, big ? 0.22 : 0.12, 0.07); tone('sine', 2800 * m, 2800 * m, 0.1, 0.05, 0.03); }],
    [/fire|lava|ember|flame|magma/i, (m, big) => { noise(big ? 0.18 : 0.1, 0.12, 3400 * m, 'highpass', 1200); tone('sine', 140 * m, 70, 0.12, 0.08); }],
    [/wind|breeze|cyclone/i, (m) => noise(0.16, 0.12, 500 * m, 'bandpass', 2600 * m)],
    [/earth|stone|sand|gravity|momentum|magnet|iron|fury/i, (m, big) => { tone('triangle', 110 * m, 46, big ? 0.22 : 0.13, 0.16); noise(0.06, 0.1, 400 * m, 'lowpass'); }],
    [/water|tide|brine/i, (m) => { tone('sine', 520 * m, 240 * m, 0.14, 0.09); tone('sine', 380 * m, 620 * m, 0.08, 0.05, 0.04); }],
    [/shadow|void|ninja|crow|ink|rift|dusk/i, (m) => { tone('sawtooth', 210 * m, 120 * m, 0.12, 0.05); tone('sawtooth', 214 * m, 118 * m, 0.12, 0.05); }],
    [/blade|draw|sword|sickle|shuriken|bone|chain/i, (m, big) => { tone('square', 2900 * m, 2500 * m, big ? 0.16 : 0.08, 0.05); tone('triangle', 1450 * m, 1450 * m, 0.12, 0.05, 0.01); }],
    [/gun|bow|bomb|rocket|shot/i, (m) => { noise(0.07, 0.14, 1800 * m, 'bandpass', 600); tone('square', 300 * m, 120, 0.05, 0.06); }],
    [/time|mirror|glass|paper|spore|puppet|clone|sound|bell/i, (m, big) => { tone('triangle', 880 * m, 1320 * m, big ? 0.16 : 0.09, 0.06); tone('sine', 1760 * m, 1760 * m, 0.06, 0.04, 0.04); }],
    [/convergence|engine/i, (m, big) => { tone('sawtooth', 70, 50, big ? 0.3 : 0.16, 0.12); tone('square', 1100, 300, 0.1, 0.05); }]
  ];
  const sig = new Map();
  function signatureOf(id) {
    if (sig.has(id)) return sig.get(id);
    const h = HR[id] || {}, el = (h.element || '') + ' ' + (h.energy || ''), k = hash(id + ':sound');
    const kind = (KINDS.find(x => x[0].test(el)) || [null, (m, big) => tone('triangle', 660 * m, 990 * m, big ? 0.12 : 0.07, 0.06)])[1];
    const s = { play: kind, m: 0.8 + (k % 41) / 100 };
    sig.set(id, s); return s;
  }
  const LAYER = { swing: 0, hit: 1, heavy: 2, shoot: 0, zap: 0, burst: 1, dash: 0 };
  let heroNow = null;   // the hero whose update (or hit) is running, so their sounds get their layer
  const _sfx = A.sfx;
  A.sfx = function (name) {
    const r = _sfx.apply(this, arguments);
    try {
      if (VO.on && heroNow && A.ctx && LAYER[name] !== undefined && !(SW.versus && SW.versus.simulating)) {
        const s = signatureOf(heroNow); s.play(s.m, LAYER[name] === 2);
      }
    } catch (e) { /* sound is best-effort */ }
    return r;
  };
  // the hero's own grunt when hit: two close saw tones at their pitch, through a mouth-like band
  function grunt(id) {
    const c = A.ctx; if (!c || !A.sfxG) return;
    const hp = (HR[id] && HR[id].pitch) || 440, f = 70 + hp * 0.32, t = c.currentTime;
    const bp = c.createBiquadFilter(), g = c.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 600 + hp * 0.9; bp.Q.value = 4;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    bp.connect(g); g.connect(A.sfxG);
    [1, 1.012].forEach(d => { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * d * 1.2, t); o.frequency.exponentialRampToValueAtTime(f * d * 0.8, t + 0.15); o.connect(bp); o.start(t); o.stop(t + 0.18); });
  }

  // ---------- hooking into the hero ----------
  const _pu = P.update;
  P.update = function () {
    const before = this.state, id = heroIdOf(this);
    heroNow = id;
    try { return _pu.apply(this, arguments); }
    finally {
      heroNow = null;
      if (id && this.state !== before && !this.dead) {
        const h = HR[id], AB = D.abilities;
        if (this.state === 'ult' && h && AB[h.ultimate]) callout(id, AB[h.ultimate].name + '!');
        else if (this.state === 'awaken' && h && AB[h.awaken]) callout(id, AB[h.awaken].name + '!');
      }
    }
  };
  const _ph = P.takeHit;
  P.takeHit = function (atk, g) {
    const r = _ph.apply(this, arguments);
    try { if (VO.on && r === 'hit' && !(SW.versus && SW.versus.simulating)) grunt(heroIdOf(this)); } catch (e) { /* none */ }
    return r;
  };

  // ---------- phones: unlock speech on the first tap or key ----------
  let unlocked = false;
  const unlock = () => {
    if (unlocked || !speechOk()) return; unlocked = true;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* none */ }
    loadVoices();
  };
  ['pointerdown', 'touchstart', 'keydown'].forEach(ev => window.addEventListener(ev, unlock, { once: true, passive: true }));
})();
