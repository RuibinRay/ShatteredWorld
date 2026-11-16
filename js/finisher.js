'use strict';
// Shattered Worlds — ultimate finishers. Loaded after finisher-lines.js, vsboss.js and skillfx.js; only adds and wraps.
//   When an ultimate lands the final blow (a Versus knockout, the Versus boss fight, or a boss in the story), the moment
//   becomes a short cinematic: slow motion while the camera pushes in on the victim (flash, shake, speed lines, rings),
//   a freeze and a slash of light, then a full-screen finisher: the hero's ultimate art drifting closer over rays in their
//   colours and their element's particles, the ultimate's name stamped in, the hero's name and element, one of their three
//   voice lines spoken aloud with a subtitle, and FINISH! Then back to the knockout or the fight.
//   Any key (or a tap) skips it after the first moment. M switches the voice: Japanese, English, Chinese or off (kept).
//   Voices: recorded files are used when they exist (assets/fin/list.json names them: voice_<hero>_<n>_<ja|en|zh>.mp3);
//   otherwise the browser's own speech voices speak the line, when the browser has one for that language. The subtitle is
//   always shown, in the game's language. Art: assets/fin/fin_<hero>.png replaces the ultimate art when it exists.
//   The music drops while the line is spoken. Only an ultimate that finishes the fight triggers it, never any other blow.
(function () {
  const SW = window.SW, G = SW.game, D = SW.data, art = SW.art, fx = SW.fx, ui = SW.ui, I = SW.input, V = SW.versus, text = SW.text, W = SW.W, H = SW.H, rand = SW.rand;
  const HR = D.heroes, A = D.abilities, K = SW.skillfx, LINES = SW.finisherLines || {}, P = SW.Player.prototype;
  // Silent by the player's wish: no voice, no extra sound effects, and the music plays on untouched. The line is shown
  // as a subtitle only. (SILENT = false brings the spoken line, the M voice switch and the sounds back.)
  const SILENT = true, sfx = n => { if (!SILENT) SW.audio.sfx(n); };
  const SLOW = 42, CUT = 50, VOICE = 64, RECENT = 50;

  // ================= optional art and recorded voices =================
  const files = new Set();
  try { fetch('assets/fin/list.json').then(r => (r.ok ? r.json() : [])).then(list => (list || []).forEach(n => { files.add(n); if (/^fin_.+\.png$/.test(n)) { const im = new Image(); im.onload = () => { art.bg[n.slice(0, -4)] = im; }; im.src = 'assets/fin/' + n; } })).catch(() => {}); } catch (e) { /* no fetch: no extra files */ }

  // ================= voices =================
  const VOICES = ['ja', 'en', 'zh', 'off'], COL_OF = { en: 0, ja: 1, es: 2, zh: 3 };
  let voices = [];
  const loadVoices = () => { try { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { voices = []; } };
  loadVoices(); try { if (window.speechSynthesis) speechSynthesis.onvoiceschanged = loadVoices; } catch (e) { /* none */ }
  const voiceFor = lang => voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang));
  const pref = () => (SW.profile && SW.profile.finVoice) || 'en';   // English unless the player picks another (js/voice.js gives each hero a voice)
  // the language actually spoken: the chosen one if a recording or a browser voice exists for it, else English, else none
  function spokenLang(hero, n) {
    const want = pref(); if (want === 'off') return null;
    for (const l of [want, 'en', 'zh', 'ja']) { if (files.has('voice_' + hero + '_' + n + '_' + l + '.mp3') || voiceFor(l === 'zh' ? 'zh' : l)) return l; }
    return null;
  }
  let audioEl = null;
  function speak(fin) {
    if (SILENT) { fin.speaking = false; fin.lang = null; return; }
    const l = spokenLang(fin.hero, fin.n); fin.lang = l; if (!l) return;
    const line = LINES[fin.hero] && LINES[fin.hero][fin.n]; if (!line) return;
    const file = 'voice_' + fin.hero + '_' + fin.n + '_' + l + '.mp3';
    duck(true); fin.speaking = true;
    if (files.has(file)) { try { audioEl = new Audio('assets/fin/' + file); audioEl.volume = 1; audioEl.onended = () => { fin.speaking = false; }; audioEl.play().catch(() => { fin.speaking = false; }); } catch (e) { fin.speaking = false; } return; }
    try {
      const u = new SpeechSynthesisUtterance(line[COL_OF[l]]), v = voiceFor(l), hp = HR[fin.hero] && HR[fin.hero].pitch;
      if (v) { u.voice = v; u.lang = v.lang; }
      u.pitch = SW.clamp(hp ? 0.55 + (hp - 150) / 500 : 1, 0.4, 1.7); u.rate = 1.02; u.volume = 1;
      u.onboundary = () => { fin.pulse = 1; }; u.onend = u.onerror = () => { fin.speaking = false; };
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { fin.speaking = false; }
  }
  function hush() { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { /* none */ } try { if (audioEl) { audioEl.pause(); audioEl = null; } } catch (e) { /* none */ } }
  function duck(on) { const a = SW.audio; try { if (a && a.musG && a.ctx) a.musG.gain.setTargetAtTime(on ? (a.vol ? a.vol.music : 0.5) * 0.2 : (a.vol ? a.vol.music : 0.5), a.ctx.currentTime, 0.15); } catch (e) { /* audio is best-effort */ } }

  // ================= when it plays =================
  let fin = null, lastPhase = null, liveBoss = null;
  const _pu = P.update; P.update = function () { if (this.state === 'ult') this.ultAt = SW.frame; return _pu.apply(this, arguments); };
  const recentUlt = p => p && SW.frame - (p.ultAt === undefined ? -1e9 : p.ultAt) < RECENT;
  function start(hero, victim, from) {
    if (fin || !HR[hero]) return;
    const n = Math.floor(Math.random() * 3);
    fin = { t: 0, hero, n, vx: victim.x, vy: victim.y - (victim.h || 30) / 2, fx: from ? from.x : victim.x, style: K ? K.styleOf(hero) : 'impact', parts: [], pulse: 0, speaking: false, lang: null, stampAt: 0, skipAt: 0, scene: G.scene, keepOverlay: G.overlay };
    sfx('explode'); fx.flash('#ffffff', 10); fx.shake(10, 30);
  }
  function stop() {
    if (!fin) return;
    hush(); duck(false);
    if (fin.scene === 'play' && G.overlay === 'finisher') G.overlay = fin.keepOverlay || null;
    fin = null;
  }
  function watch() {
    if (fin) return;
    if (G.scene === 'vs' && V && V.f && V.f.length >= 2) {
      if (lastPhase === 'fight' && V.phase === 'ko' && V.winner >= 0) { const w = V.f[V.winner], l = V.f[1 - V.winner]; if (w && w.p && l && l.p && recentUlt(w.p)) start(w.hero, l.p, w.p); }
      lastPhase = V.phase;
      return;
    }
    lastPhase = null;
    if (G.scene === 'play' && G.state) {
      if (G.boss && !G.boss.dead && !G.boss.dormant) liveBoss = G.boss;
      if (liveBoss && liveBoss.dead) { const b = liveBoss; liveBoss = null; if (recentUlt(G.player)) start(G.state.hero, b, G.player); }
    } else liveBoss = null;
  }
  // every tick starts by reading input: the cinematic advances there, and holds the world (the story through an overlay
  // the game does not know, so its update only runs timers; Versus through its update, below)
  const _iu = I.update; I.update = function () {
    const r = _iu.apply(this, arguments);
    watch();
    if (fin) {
      fin.t++;
      const run = fin.t < SLOW && fin.t % 3 === 0;   // slow motion: the world moves one frame in three
      if (fin.scene === 'play') G.overlay = run ? fin.keepOverlay : 'finisher';
      fin.run = run;
      if (fin.t === CUT) { sfx('heavy'); fx.shake(6, 10); }
      if (fin.t === VOICE) speak(fin);
      if (fin.pulse > 0) fin.pulse = Math.max(0, fin.pulse - 0.12);
      if (!fin.stampAt && fin.t > VOICE + (SILENT ? 80 : 40) && (!fin.speaking || fin.t > VOICE + 200)) { fin.stampAt = fin.t; sfx('explode'); }
      if (fin.stampAt && fin.t === fin.stampAt + 46) fin.outAt = fin.t;
      if (fin.outAt && fin.t > fin.outAt + 22) stop();
      else if (fin.skipAt && fin.t > fin.skipAt + 14) stop();
    }
    return r;
  };
  if (V && V.update) { const _vu = V.update; V.update = function () { if (fin && fin.scene === 'vs' && !fin.run) return; return _vu.apply(this, arguments); }; }
  // skipping: any key or a tap, once the impact has landed; M cycles the voice
  const skip = () => { if (fin && fin.t > 16 && !fin.skipAt) { fin.skipAt = fin.t; hush(); duck(false); } };
  window.addEventListener('keydown', e => {
    if (!fin) return;
    if (!SILENT && (e.key === 'm' || e.key === 'M')) { const i = VOICES.indexOf(pref()); if (SW.profile) { SW.profile.finVoice = VOICES[(i + 1) % VOICES.length]; if (SW.saveProfile) SW.saveProfile(); } fin.voiceNote = 90; if (fin.t >= VOICE && !fin.stampAt) { hush(); speak(fin); } return; }
    skip();
  });
  window.addEventListener('pointerdown', () => skip());

  // ================= drawing =================
  const ease = k => 1 - Math.pow(1 - SW.clamp(k, 0, 1), 3);
  let off = null;
  function zoomCanvas(ctx, cx, cy, z) {   // push the camera in on a point of the finished frame
    const c = G.canvas; if (!c) return;
    if (!off || off.width !== c.width || off.height !== c.height) { off = document.createElement('canvas'); off.width = c.width; off.height = c.height; }
    const o = off.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.drawImage(c, 0, 0);
    const s = c.width / W, sw = c.width / z, sh = c.height / z, sx = SW.clamp(cx * s - sw / 2, 0, c.width - sw), sy = SW.clamp(cy * s - sh / 2, 0, c.height - sh);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(off, sx, sy, sw, sh, 0, 0, c.width, c.height); ctx.restore();
  }
  // screen-space particles in the hero's element
  function particles(ctx, f, k) {
    const st = K && K.STYLE[f.style], cols = st ? st.c : ['#ffffff'];
    if (f.parts.length < 90 && f.t % 2 === 0) for (let i = 0; i < 3; i++) f.parts.push({ x: rand(0, W), y: H + 4, vx: rand(-0.6, 0.6), vy: -rand(0.8, 2.4), l: rand(60, 120), c: cols[(Math.random() * cols.length) | 0], s: Math.random() < 0.3 ? 2 : 1 });
    ctx.globalAlpha = k;
    f.parts.forEach(q => { q.x += q.vx + Math.sin((f.t + q.l) * 0.05) * 0.3; q.y += q.vy; q.l--; art.rect(ctx, q.c, Math.round(q.x), Math.round(q.y), q.s + 1, q.s); });
    f.parts = f.parts.filter(q => q.l > 0 && q.y > -6);
    ctx.globalAlpha = 1;
  }
  function slam(ctx, str, x, y, col, size, t0, raw) {   // big type that slams in and settles
    const t = fin.t - t0; if (t < 0) return;
    const s = t < 6 ? Math.max(size, Math.round(size * 2.4 - t * size * 0.24)) : size, a = Math.min(1, t / 4);
    ctx.globalAlpha = a;
    text(ctx, str, x + 2, y + 2, '#05060c', { align: 'center', scale: s, raw });
    text(ctx, str, x, y, col, { align: 'center', scale: s, raw });
    ctx.globalAlpha = 1;
  }
  function draw(ctx) {
    const f = fin, h = HR[f.hero], t = f.t, cam = G.cam || { x: 0, y: 0 }, vx = f.vx - cam.x, vy = f.vy - cam.y;
    // 1) slow motion: the camera pushes in on the victim, rings and speed lines
    if (t < CUT) {
      const z = 1 + 0.7 * ease(t / 20);
      zoomCanvas(ctx, vx, vy, z);
      const k = 1 - t / CUT;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.6 * k; art.ring(ctx, i % 2 ? h.colorHi : '#ffffff', W / 2, H / 2, Math.round((t * (6 + i * 3)) % 220)); }
      ctx.globalAlpha = 0.35 * k;
      for (let i = 0; i < 18; i++) { const a = i * 0.349 + t * 0.02, r0 = 60 + (t * 7 + i * 13) % 80; art.line(ctx, i % 2 ? '#ffffff' : h.colorHi, Math.round(W / 2 + Math.cos(a) * r0), Math.round(H / 2 + Math.sin(a) * r0), Math.round(W / 2 + Math.cos(a) * (r0 + 60)), Math.round(H / 2 + Math.sin(a) * (r0 + 60)), 1); }
      ctx.restore(); ctx.globalAlpha = 1;
      if (t < 6) { ctx.globalAlpha = (6 - t) / 6; art.rect(ctx, '#ffffff', 0, 0, W, H); ctx.globalAlpha = 1; }
      if (t >= SLOW) { const k2 = (t - SLOW) / (CUT - SLOW); ctx.save(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-40, H); ctx.lineTo(-40 + (W + 120) * k2, H); ctx.lineTo(40 + (W + 120) * k2, 0); ctx.lineTo(0, 0); ctx.fill(); ctx.restore(); }
      return;
    }
    // 2) the finisher
    const kin = ease((t - CUT) / 10), kout = f.outAt ? ease((t - f.outAt) / 22) : f.skipAt ? ease((t - f.skipAt) / 14) : 0, k = kin * (1 - kout);
    art.rect(ctx, '#05060c', 0, 0, W, H);
    ctx.save(); ctx.globalAlpha = 0.5 * k; ctx.fillStyle = h.color; ctx.fillRect(0, 0, W, H); ctx.restore();
    // rays turning behind everything
    ctx.save(); ctx.globalAlpha = 0.18 * k; ctx.fillStyle = h.colorHi;
    for (let i = 0; i < 12; i++) { const a = i * 0.5236 + t * 0.006; ctx.beginPath(); ctx.moveTo(W * 0.62, H / 2); ctx.lineTo(W * 0.62 + Math.cos(a) * 600, H / 2 + Math.sin(a) * 600); ctx.lineTo(W * 0.62 + Math.cos(a + 0.18) * 600, H / 2 + Math.sin(a + 0.18) * 600); ctx.fill(); }
    ctx.restore();
    // the element word, huge and faint
    ctx.globalAlpha = 0.12 * k; text(ctx, String(G.txt ? G.txt(h.element || '') : h.element || '').toUpperCase(), W / 2, 104, h.colorHi, { align: 'center', scale: 6 }); ctx.globalAlpha = 1;
    // the art: finisher art if there is some, else the ultimate art, else the portrait; drifting closer, pulsing with the voice
    const im = art.bg['fin_' + f.hero] || art.bg['ult_' + f.hero] || art.bg['hero_' + f.hero];
    if (im) {
      const drift = 1 + (t - CUT) * 0.0012 + f.pulse * 0.02, bw = Math.round(W * 0.86 * drift), bh = Math.round(bw * im.height / im.width), maxH = 150, sh = Math.min(bh, maxH), bx = Math.round(W - bw * 0.96 + (1 - kin) * 80), by = 40;
      ctx.save(); ctx.globalAlpha = k;
      ctx.beginPath(); ctx.moveTo(40, by); ctx.lineTo(W, by); ctx.lineTo(W, by + sh); ctx.lineTo(0, by + sh); ctx.closePath(); ctx.clip();
      ctx.imageSmoothingEnabled = false; ctx.drawImage(im, 0, Math.max(0, (im.height - sh * im.width / bw) / 2), im.width, Math.min(im.height, sh * im.width / bw), bx, by, bw, sh);
      ctx.restore();
      ctx.globalAlpha = k; art.rect(ctx, h.colorHi, 40, by - 2, W - 40, 2); art.rect(ctx, h.colorHi, 0, by + sh, W, 2); ctx.globalAlpha = 1;
    } else { ctx.save(); ctx.globalAlpha = k; ctx.translate(W * 0.7, 190); ctx.scale(5, 5); art.draw(ctx, h.sheet || f.hero, 'cast', 1, 0, 0, false); ctx.restore(); }
    particles(ctx, f, k);
    // the ultimate's name, the hero's name and title
    const ult = A[h.ultimate] ? A[h.ultimate].name : 'ULTIMATE';
    ctx.globalAlpha = k;
    slam(ctx, String(G.txt ? G.txt(ult) : ult).toUpperCase(), W / 2 - 40, 196, h.colorHi, 3, CUT + 6, true);
    text(ctx, (G.txt ? G.txt(h.name) : h.name).toUpperCase(), 14, 14, '#ffffff', { scale: 2, raw: true });
    if (h.title) text(ctx, h.title, 14, 32, h.colorHi);
    // the voice line, typed out in the game's language
    const line = LINES[f.hero] && LINES[f.hero][f.n];
    if (line && t >= VOICE - 4) {
      const ui0 = (SW.i18n && SW.i18n.lang) || 'en', sub = line[COL_OF[ui0] === undefined ? 0 : COL_OF[ui0]], shown = sub.slice(0, Math.max(0, Math.floor((t - VOICE + 4) * 0.9)));
      ctx.globalAlpha = 0.75 * k; art.rect(ctx, '#05060c', 0, 222, W, 26); ctx.globalAlpha = k;
      text(ctx, '"' + shown + (shown.length < sub.length ? '' : '"'), W / 2, 230, '#ffffff', { align: 'center', raw: true });
    }
    ctx.globalAlpha = 1;
    // FINISH!
    if (f.stampAt) {
      const s = t - f.stampAt;
      if (s < 8) { ctx.globalAlpha = (8 - s) / 8 * 0.7; art.rect(ctx, '#ffffff', 0, 0, W, H); ctx.globalAlpha = 1; }
      ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 128); ctx.rotate(-0.12); slam(ctx, 'FINISH!', 0, -14, '#f5c542', 5, f.stampAt, false); ctx.restore();
    }
    // the voice in use, and how to skip
    if (t > CUT + 10 && !f.outAt && !f.skipAt) {
      // (built from parts that are each translated: the lookup matches whole strings)
      const tr = s => (SW.i18n && SW.i18n.tr ? SW.i18n.tr(s) : s), v = pref(), code = v === 'off' ? tr('off') : v.toUpperCase();
      const extra = f.lang && v !== 'off' && f.lang !== v ? ' > ' + f.lang.toUpperCase() : !f.lang && v !== 'off' && t > VOICE + 10 ? ' (' + tr('no voice in this browser') + ')' : '';
      ctx.globalAlpha = 0.6; text(ctx, (SILENT ? '' : tr('M: voice') + ' ' + code + extra + '      ') + tr('Any key: skip'), W / 2, H - 12, f.voiceNote > 0 ? '#ffffff' : '#8a92b8', { align: 'center', raw: true }); ctx.globalAlpha = 1;
      if (f.voiceNote > 0) f.voiceNote--;
    }
    // the white flash back into the fight
    if (f.outAt || f.skipAt) { const s = t - (f.outAt || f.skipAt); if (s > 8) { ctx.globalAlpha = Math.max(0, 1 - (s - 8) / 14) * 0.5; art.rect(ctx, '#ffffff', 0, 0, W, H); ctx.globalAlpha = 1; } }
  }
  const _hud = ui.hud; ui.hud = function (ctx, g) { _hud.apply(this, arguments); if (fin && fin.scene === 'play' && g.scene === 'play') draw(ctx); };
  if (V && V.draw) { const _vd = V.draw; V.draw = function (ctx, g) { _vd.apply(this, arguments); if (fin && fin.scene === 'vs' && g.scene === 'vs') draw(ctx); }; }
  // leaving the scene mid-cinematic (a menu, a new zone) ends it
  const _gz = G.gotoZone; G.gotoZone = function () { stop(); return _gz.apply(this, arguments); };

  SW.finisher = { active: () => !!fin, start, stop, LINES };
})();
