'use strict';
// Shattered Worlds — touch controls for phones and tablets.
//
// On a touchscreen the game shows a floating joystick (touch anywhere on the left half and drag) and action buttons on
// the right. Each button carries the keyboard letter the game's hints use (J, K, L, U, I, O, Q, E, M, Esc) and the
// action's name in the current language. The buttons feed the same actions as the keyboard (SW.input), so every
// screen works: menus with the joystick and J (confirm) / K (back), the story, Versus against the bot, Training.
// Player vs Player stays a keyboard mode. Typing the unlock code needs a keyboard too.
//
// On touch devices the canvas also fills the screen (it is scaled by whole steps on desktops), the page cannot be
// scrolled or zoomed, and a note asks to turn the phone sideways while it is held upright.
// Settings > Touch controls: Auto (show on touchscreens), On, Off. Kept with the other settings.
(function () {
  const SW = window.SW, G = SW.game, I = SW.input, W = SW.W, H = SW.H;
  const KEY = 'shattered-worlds-settings-v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const T = SW.touch = { held: {}, tap: {}, mode: read().touch || 'auto', used: false };   // tap: pressed since the last frame (a tap quicker than one frame still counts)
  const coarse = () => (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0;
  T.on = () => T.mode === 'on' || (T.mode === 'auto' && (coarse() || T.used));
  T.setMode = function (m) {
    T.mode = m; const s = read(); s.touch = m;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private window */ }
    layout();
  };

  // ---------- the touch actions join the keyboard's and the gamepad's ----------
  const _u = I.update;
  I.update = function () {
    _u();
    for (const a in Object.assign({}, T.held, T.tap)) if (T.held[a] || T.tap[a]) { if (!I.now[a] && !I.prev[a]) I.lastHit[a] = SW.frame; I.now[a] = true; }
    T.tap = {};
  };
  window.addEventListener('blur', () => { T.held = {}; });

  // ---------- page setup: no scrolling, no zoom, no text selection ----------
  const vp = document.querySelector('meta[name=viewport]');
  if (vp) vp.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  const css = document.createElement('style');
  css.textContent = `
    #sw-touch { position: fixed; inset: 0; z-index: 10; pointer-events: none; font-family: "Trebuchet MS", "Microsoft YaHei", sans-serif; user-select: none; -webkit-user-select: none; }
    #sw-touch.on { pointer-events: auto; touch-action: none; }
    #sw-touch .zone { position: absolute; left: 0; top: 18%; width: 48%; bottom: 0; }
    #sw-touch .stick, #sw-touch .knob { position: absolute; border-radius: 50%; pointer-events: none; display: none; transform: translate(-50%, -50%); }
    #sw-touch .stick { border: 2px solid rgba(255,255,255,.35); background: rgba(10,12,24,.25); }
    #sw-touch .knob { background: rgba(255,255,255,.35); border: 2px solid rgba(255,255,255,.6); }
    #sw-touch .btn { position: absolute; border-radius: 50%; border: 2px solid rgba(255,255,255,.45); background: rgba(10,12,24,.35);
      color: rgba(255,255,255,.9); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; transform: translate(-50%, -50%); }
    #sw-touch .btn b { font-size: 1.15em; font-weight: bold; }
    #sw-touch .btn i { font-style: normal; font-size: .52em; opacity: .85; margin-top: .2em; white-space: nowrap; }
    #sw-touch .btn.down { background: rgba(245,197,66,.45); border-color: #f5c542; }
    #sw-touch .rot { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(5,6,12,.92);
      color: #fff; font-size: 20px; text-align: center; padding: 24px; pointer-events: auto; }
    body.sw-touch { touch-action: none; overscroll-behavior: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
  `;
  document.head.appendChild(css);

  // ---------- controls ----------
  const root = document.createElement('div'); root.id = 'sw-touch';
  const zone = document.createElement('div'); zone.className = 'zone';
  const stick = document.createElement('div'); stick.className = 'stick';
  const knob = document.createElement('div'); knob.className = 'knob';
  const rot = document.createElement('div'); rot.className = 'rot';
  root.append(zone, stick, knob, rot);
  // [action, key letter shown, word, x from the right edge, y from the bottom (or, if negative, from the top), size], in button units
  const BTNS = [
    ['attack', 'J', 'Attack', 1.0, 1.0, 1.35], ['jump', 'K', 'Jump', 2.45, 0.75, 1.1], ['dash', 'L', 'Dash', 0.85, 2.45, 1.0],
    ['skill', 'U', 'Skill', 2.3, 2.1, 0.95], ['special', 'I', 'Special', 1.7, 3.45, 0.95], ['awaken', 'O', 'Awaken', 0.65, 3.7, 0.85],
    ['charge', 'J+K', 'Charge', 3.75, 0.65, 0.75], ['interact', 'E', 'Talk', 3.6, 1.95, 0.75], ['item', 'Q', 'Item', 3.25, 3.15, 0.7],
    ['map', 'M', 'Map', 1.75, -0.6, 0.62], ['pause', 'Esc', 'Menu', 0.6, -0.6, 0.62]
  ];
  const btns = BTNS.map(([a, k, w, x, y, s]) => {
    const el = document.createElement('div'); el.className = 'btn';
    el.innerHTML = '<b></b><i></i>'; el.firstChild.textContent = k;
    const ids = new Set();
    const up = e => { if (!ids.delete(e.pointerId)) return; if (!ids.size) { T.held[a] = false; el.classList.remove('down'); } };
    el.addEventListener('pointerdown', e => { e.preventDefault(); ids.add(e.pointerId); try { el.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } T.held[a] = true; T.tap[a] = true; el.classList.add('down'); first(); });
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
    root.appendChild(el);
    return { el, a, w, x, y, s };
  });
  root.appendChild(rot);   // the "turn sideways" note covers the buttons too
  // floating joystick: put a thumb down anywhere on the left, drag to move; down is guard, up aims and climbs
  let sid = null, ox = 0, oy = 0, R = 50;
  const setDir = (dx, dy) => {
    const dz = R * 0.3, h = Math.abs(dx) > dz, v = Math.abs(dy) > dz * 1.5;
    const d = { left: h && dx < 0, right: h && dx > 0, up: v && dy < 0, down: v && dy > 0 };
    for (const k in d) { if (d[k] && !T.held[k]) T.tap[k] = true; T.held[k] = d[k]; }   // a flick quicker than one frame still moves the menu
  };
  const show = (on, x, y) => { for (const [el, d] of [[stick, R * 2.4], [knob, R * 0.9]]) { el.style.display = on ? 'block' : 'none'; el.style.width = el.style.height = d + 'px'; el.style.left = x + 'px'; el.style.top = y + 'px'; } };
  zone.addEventListener('pointerdown', e => { if (sid !== null) return; e.preventDefault(); sid = e.pointerId; ox = e.clientX; oy = e.clientY; try { zone.setPointerCapture(sid); } catch (x) { /* ignore */ } show(true, ox, oy); setDir(0, 0); first(); });
  zone.addEventListener('pointermove', e => {
    if (e.pointerId !== sid) return;
    let dx = e.clientX - ox, dy = e.clientY - oy; const d = Math.hypot(dx, dy);
    if (d > R) { ox += dx * (1 - R / d); oy += dy * (1 - R / d); dx = e.clientX - ox; dy = e.clientY - oy; stick.style.left = ox + 'px'; stick.style.top = oy + 'px'; }   // the base follows a long drag
    knob.style.left = (ox + dx) + 'px'; knob.style.top = (oy + dy) + 'px'; setDir(dx, dy);
  });
  const end = e => { if (e.pointerId !== sid) return; sid = null; show(false); setDir(0, 0); };
  zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end); zone.addEventListener('lostpointercapture', end);

  // first touch: sound may start now, and the page goes full screen (where the browser allows it)
  let started = false;
  function first() {
    T.used = true; if (SW.audio.unlock) SW.audio.unlock();
    if (started) return; started = true;
    const d = document.documentElement;
    try { const p = d.requestFullscreen && d.requestFullscreen(); if (p && p.then) p.then(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (x) { /* ignore */ } }).catch(() => {}); } catch (x) { /* not allowed here */ }
  }
  window.addEventListener('touchstart', () => { if (T.mode === 'auto' && !T.used) { T.used = true; layout(); } }, { passive: true });

  // ---------- layout: sizes from the screen, canvas fills it on touch devices ----------
  function layout() {
    const on = T.on(), vw = window.innerWidth, vh = window.innerHeight, u = Math.max(40, Math.min(72, Math.min(vw, vh) * 0.16));
    root.classList.toggle('on', on); root.style.display = on ? 'block' : 'none'; document.body.classList.toggle('sw-touch', on);
    R = u * 0.75;
    for (const b of btns) {
      const d = u * b.s; b.el.style.width = b.el.style.height = d + 'px'; b.el.style.fontSize = (u * 0.34 * Math.max(0.8, b.s)) + 'px';
      b.el.style.left = (vw - b.x * u - 8) + 'px'; b.el.style.top = (b.y < 0 ? -b.y * u + 6 : vh - b.y * u - 6) + 'px';
    }
    rot.style.display = on && vh > vw ? 'flex' : 'none';
    const c = G.canvas;
    if (c) {
      if (on) { const s = Math.min(vw / W, vh / H); c.style.width = Math.floor(W * s) + 'px'; c.style.height = Math.floor(H * s) + 'px'; }
      else { const s = Math.max(1, Math.floor(Math.min(vw / W, vh / H))); c.style.width = W * s + 'px'; c.style.height = H * s + 'px'; }   // as game.js does
    }
    labels();
  }
  let lang = null;
  function labels() {   // words follow the language setting
    const L = SW.i18n, cur = L ? L.lang : 'en';
    if (cur === lang && L && L.dict[cur] !== undefined) return;
    lang = cur;
    for (const b of btns) b.el.lastChild.textContent = L ? L.tr(b.w) : b.w;
    rot.textContent = L ? L.tr('Turn your phone sideways to play.') : 'Turn your phone sideways to play.';
  }
  setInterval(() => { if (T.on()) labels(); }, 500);
  window.addEventListener('load', () => {
    document.body.appendChild(root);
    window.addEventListener('resize', layout);   // registered after game.js's own resize handler, so this one has the last word
    window.addEventListener('orientationchange', () => setTimeout(layout, 150));
    layout();
  });
  T.layout = layout;
})();
