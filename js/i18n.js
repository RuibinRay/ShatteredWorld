'use strict';
// Shattered Worlds — languages. Loaded right after core.js, before any other file keeps a reference to SW.text.
//
// Every string the game shows goes through SW.text / SW.textW / SW.wrap, so translation happens there, with the English
// text as the key. Dictionaries live in js/lang/<id>.js (built by tools/i18n-build.ps1); each calls SW.i18n.add(id, map).
// Only the chosen language's file is loaded (js/settings.js does that). Anything not yet translated stays in English.
//
// Lookup order for a string: exact match; the same with surrounding spaces / punctuation / "> " markers set aside; its
// ALL-CAPS form; patterns with {0} placeholders; then known fragments inside it, for text the code glues together
// ("Learned: " + name). With SW.i18n.track on, strings that found nothing are counted in SW.i18n.misses.
//
// Spanish uses the pixel font (core.js has the accented letters). Chinese cannot be drawn in a 5x7 font, so a line
// with characters the font lacks is drawn with a system font. While Chinese is active the canvas is rendered at screen
// resolution (SW.view) so that text is sharp; pixel art is still drawn with nearest-neighbour scaling, so it looks the same.
(function () {
  const SW = window.SW, F = SW.font, W = SW.W, H = SW.H;
  const LANGS = [{ id: 'en', name: 'English' }, { id: 'es', name: 'Español' }, { id: 'zh', name: '简体中文', cjk: true }];
  const I = SW.i18n = { langs: LANGS, lang: 'en', dict: {}, up: {}, pats: {}, frags: {}, cache: new Map(), done: new Set(), misses: new Map(), track: false };
  I.info = id => LANGS.find(l => l.id === (id || I.lang)) || LANGS[0];
  I.cjk = () => !!I.info().cjk;

  // ---------- dictionaries ----------
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  I.add = function (lang, map) {
    const d = I.dict[lang] || (I.dict[lang] = new Map()), up = I.up[lang] || (I.up[lang] = new Map()), pats = I.pats[lang] || (I.pats[lang] = []);
    for (const k in map) {
      const v = map[k];
      if (typeof v !== 'string' || !v) continue;
      if (/\{(\d|[A-Z]+)\}/.test(k)) {   // pattern: "Lv {0}" -> "Nv {0}"; also named slots the code fills in, like {NAME}
        let rx = '^', lit = ''; const order = [];
        k.split(/\{(\d|[A-Z]+)\}/).forEach((p, i) => { if (i % 2) { rx += '(.+?)'; order.push(p); } else { rx += esc(p); lit += p; } });
        if (/[A-Za-z]{2}/.test(lit)) pats.push({ re: new RegExp(rx + '$'), order, v });   // a pattern needs words of its own, or it matches everything
        continue;
      }
      d.set(k, v);
      const ku = k.toUpperCase(); if (ku !== k && !up.has(ku)) up.set(ku, v.toUpperCase());
      const kt = k.trim(); if (kt && kt !== k && !d.has(kt)) d.set(kt, v.trim());
    }
    I.frags[lang] = null; I.cache.clear(); I.done.clear();
  };

  // ---------- lookup ----------
  const isW = c => !!c && /[A-Za-z0-9]/.test(c);
  function frags() {
    const l = I.lang; if (I.frags[l]) return I.frags[l];
    const a = []; for (const [k, v] of I.dict[l]) if (k.length >= 3 && /[A-Za-z]{2}/.test(k)) a.push([k, v]);
    for (const [k, v] of I.up[l]) if (k.length >= 3 && /[A-Z]{2}/.test(k)) a.push([k, v]);   // "P1 " + name.toUpperCase()
    a.sort((p, q) => q[0].length - p[0].length);
    return (I.frags[l] = a);
  }
  function fragment(s) {   // replace every known piece inside s, longest first, never inside a word
    let parts = [{ t: s }], hit = false;
    for (const [k, v] of frags()) {
      if (s.indexOf(k) < 0) continue;
      const next = [];
      for (const p of parts) {
        if (p.v !== undefined || p.t.indexOf(k) < 0) { next.push(p); continue; }
        const t = p.t; let from = 0, last = 0, at;
        while ((at = t.indexOf(k, from)) >= 0) {
          if ((isW(k[0]) && isW(t[at - 1])) || (isW(k[k.length - 1]) && isW(t[at + k.length]))) { from = at + 1; continue; }
          if (at > last) next.push({ t: t.slice(last, at) });
          next.push({ t: k, v }); hit = true; last = from = at + k.length;
        }
        if (last < t.length) next.push({ t: t.slice(last) });
      }
      parts = next;
    }
    if (!hit) return null;
    // only when what is left is numbers, keys and punctuation: half-translated sentences read worse than English
    if (parts.some(p => p.v === undefined && /[A-Za-z]{3,}/.test(p.t))) return null;
    return parts.map(p => (p.v !== undefined ? p.v : p.t)).join('');
  }
  let depth = 0;
  function look(s) {
    const d = I.dict[I.lang], up = I.up[I.lang]; if (!d) return s;
    let v = d.get(s); if (v !== undefined) return v;
    if (s.indexOf('\n') >= 0) return s.split('\n').map(x => (/[A-Za-z]/.test(x) ? I.tr(x) : x)).join('\n');
    const m = /^([\s>*\-"'(]*)(.*?)([\s.!?:;,"')]*)$/.exec(s);
    if (m && m[2] && (m[1] || m[3])) { v = d.get(m[2]); if (v === undefined) v = up.get(m[2]); if (v !== undefined) return m[1] + v + m[3]; }
    v = up.get(s); if (v !== undefined) return v;
    if (depth < 4) for (const p of I.pats[I.lang] || []) {
      const r = p.re.exec(s);
      if (r) { depth++; try { let out = p.v; p.order.forEach((n, i) => { const c = r[i + 1]; out = out.split('{' + n + '}').join(c === s ? c : I.tr(c)); }); return out; } finally { depth--; } }
    }
    const f = fragment(s); if (f !== null) return f;
    if (I.track) I.misses.set(s, (I.misses.get(s) || 0) + 1);
    return s;
  }
  I.tr = function (s) {
    if (I.lang === 'en' || s === undefined || s === null) return s;
    s = String(s);
    if (I.done.has(s) || !/[A-Za-z]/.test(s)) return s;
    let r = I.cache.get(s);
    if (r === undefined) {
      r = look(s);
      if (I.cache.size > 8000) I.cache.clear();
      I.cache.set(s, r);
      if (r !== s) { if (I.done.size > 20000) I.done.clear(); I.done.add(r); }
    }
    return r;
  };

  // ---------- drawing ----------
  const _text = SW.text, _textW = SW.textW, _wrap = SW.wrap;
  const pix = s => { for (const ch of s) if (ch !== ' ' && ch !== '\n' && F.pos[ch] === undefined) return false; return true; };
  const FONT = '"Microsoft YaHei UI","Microsoft YaHei","PingFang SC","Hiragino Sans GB","Noto Sans SC","Noto Sans CJK SC","Source Han Sans SC","WenQuanYi Micro Hei",sans-serif';
  const SZ = 9, mc = document.createElement('canvas').getContext('2d'), wc = new Map();
  mc.font = SZ + 'px ' + FONT;
  const sysW1 = ln => { let w = wc.get(ln); if (w === undefined) { w = Math.ceil(mc.measureText(ln).width); if (wc.size > 6000) wc.clear(); wc.set(ln, w); } return w; };
  const sysW = s => String(s).split('\n').reduce((a, ln) => Math.max(a, sysW1(ln)), 0);
  I.font = FONT;

  SW.textW = function (str) { str = I.tr(String(str)); return pix(str) ? _textW(str) : sysW(str); };
  // opts.raw: draw exactly this text, untranslated (language names in the language menu)
  SW.text = function (ctx, str, x, y, color, opts) {
    opts = opts || {};
    str = opts.raw ? String(str) : I.tr(String(str));
    if (pix(str)) return _text(ctx, str, x, y, color, opts);
    const sc = opts.scale || 1, lines = str.split('\n');
    ctx.save();
    if (sc !== 1) { ctx.translate(x, y); ctx.scale(sc, sc); x = 0; y = 0; }
    ctx.font = SZ + 'px ' + FONT; ctx.textBaseline = 'top';
    lines.forEach((ln, i) => {
      const w = sysW1(ln); let lx = x; const ly = y + i * F.lh - 1;
      if (opts.align === 'center') lx -= w / 2; else if (opts.align === 'right') lx -= w;
      if (opts.shadow !== false) { ctx.fillStyle = opts.shadow || '#05060c'; ctx.fillText(ln, lx + 0.75, ly + 0.75); }
      ctx.fillStyle = color || '#fff'; ctx.fillText(ln, lx, ly);
    });
    ctx.restore();
  };
  // word wrap that also breaks Chinese (no spaces) and keeps closing punctuation off the start of a line
  const NOSTART = '，。！？：；、）」』”’…—,.!?:;)%';
  SW.wrap = function (str, maxW) {
    if (I.lang === 'en' && pix(String(str))) return _wrap(str, maxW);
    str = I.tr(String(str));
    const p = pix(str), wf = p ? _textW : sysW1, out = [];
    str.split('\n').forEach(par => {
      const toks = p ? par.split(' ').map((w, i) => (i ? ' ' : '') + w) : (par.match(/[A-Za-z0-9'\-.,!?:;%+/()]+|\s+|./gu) || ['']);
      let line = '';
      for (const tk of toks) {
        const t = line + tk;
        if (line && wf(t) > maxW && NOSTART.indexOf(tk) < 0) { out.push(line.replace(/\s+$/, '')); line = tk.replace(/^\s+/, ''); } else line = t;
      }
      out.push(line);
    });
    if (I.lang !== 'en') out.forEach(l => I.done.add(l));
    return out;
  };

  // ---------- sharp text: render at screen resolution while a CJK language is active ----------
  const V = SW.view = { s: 1 };
  V.fit = function () {
    const c = SW.game && SW.game.canvas; if (!c) return;
    const css = Math.max(1, Math.floor(Math.min(window.innerWidth / W, window.innerHeight / H)));
    const s = I.cjk() ? SW.clamp(Math.round(css * (window.devicePixelRatio || 1)), 2, 4) : 1;
    if (s === V.s && c.width === W * s) return;
    V.s = s; c.width = W * s; c.height = H * s;
  };
  V.begin = function (ctx) { ctx.setTransform(V.s, 0, 0, V.s, 0, 0); };
  window.addEventListener('resize', () => V.fit());
})();
