'use strict';
// Shattered Worlds — crisp pixel sprites from vector drawings (2026-11-20). The hero rework files (js/nami-shark.js,
// js/brakk-dragon.js, js/hollis-beasts.js, js/isolde-falcon.js ...) draw their creatures with canvas paths, which the
// browser anti-aliases into soft, blurry edges that do not match the game's pixel art (480x270, scaled up). This turns
// such a drawing into real pixel art, the way pixel artists do it by hand:
//   1. no software anti-aliasing: every pixel is either solid or empty (alpha cut at 50%)
//   2. a limited palette: every solid pixel snaps to the nearest colour of the creature's palette (8-16 colours, ramps
//      hue-shifted: cool, dark shadows and warm, light highlights)
//   3. a selective outline: one pixel round the silhouette in the palette's darkest colour (not pure black), so the
//      shape reads on any background
//   4. clean edges: lone pixels sticking out of the silhouette are removed (no noise, no "jaggies")
// Usage: SW.pix.sprite(ctx, x, y, w, h, draw, { pal, outline, alpha }): draw(c) draws with (0, 0) at (x, y) into a w x h
// box centred there. Draw-only; it never touches game state.
(function () {
  const SW = window.SW;
  const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
  const hex = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const palCache = new Map();
  const palOf = list => { const k = list.join(); let p = palCache.get(k); if (!p) { p = list.map(hex); palCache.set(k, p); } return p; };
  function nearest(pal, r, g, b) {
    let best = 0, bd = 1e9;
    for (let i = 0; i < pal.length; i++) { const c = pal[i], dr = c[0] - r, dg = c[1] - g, db = c[2] - b, d = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11; if (d < bd) { bd = d; best = i; } }
    return pal[best];
  }
  function sprite(ctx, x, y, w, h, draw, o) {
    o = o || {};
    w = Math.max(2, Math.ceil(w)); h = Math.max(2, Math.ceil(h));
    if (cv.width < w) cv.width = w; if (cv.height < h) cv.height = h;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; cx.clearRect(0, 0, w, h);
    const ox = Math.round(x) - Math.floor(w / 2), oy = Math.round(y) - Math.floor(h / 2);
    cx.save(); cx.translate(x - ox, y - oy); draw(cx); cx.restore();
    const img = cx.getImageData(0, 0, w, h), d = img.data, pal = o.pal ? palOf(o.pal) : null, mono = o.mono ? hex(o.mono) : null;
    const solid = new Uint8Array(w * h);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      if (d[i + 3] < 128) { d[i + 3] = 0; continue; }
      solid[j] = 1; d[i + 3] = 255;
      if (mono) { d[i] = mono[0]; d[i + 1] = mono[1]; d[i + 2] = mono[2]; }
      else if (pal) { const c = nearest(pal, d[i], d[i + 1], d[i + 2]); d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; }
    }
    // lone pixels: a solid pixel with at most one solid neighbour is noise
    if (o.clean !== false) for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const j = yy * w + xx; if (!solid[j]) continue;
      const n = (xx > 0 && solid[j - 1]) + (xx < w - 1 && solid[j + 1]) + (yy > 0 && solid[j - w]) + (yy < h - 1 && solid[j + w]);
      if (n <= 1 && o.keepThin !== true) { solid[j] = 2; }   // marked, cleared below (so the test above sees the original shape)
    }
    for (let j = 0; j < solid.length; j++) if (solid[j] === 2) { solid[j] = 0; d[j * 4 + 3] = 0; }
    if (o.outline !== false) {
      const oc = hex(o.mono ? '#000000' : (o.outline || (o.pal ? o.pal[0] : '#101018')));
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
        const j = yy * w + xx; if (solid[j]) continue;
        if ((xx > 0 && solid[j - 1] === 1) || (xx < w - 1 && solid[j + 1] === 1) || (yy > 0 && solid[j - w] === 1) || (yy < h - 1 && solid[j + w] === 1)) { const i = j * 4; d[i] = oc[0]; d[i + 1] = oc[1]; d[i + 2] = oc[2]; d[i + 3] = 255; }
      }
    }
    cx.putImageData(img, 0, 0);
    ctx.save(); if (o.alpha !== undefined) ctx.globalAlpha *= Math.max(0, Math.min(1, o.alpha)); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cv, 0, 0, w, h, ox, oy, w, h);
    ctx.restore();
  }
  // ---------- impact, speed and slashes (2026-11-20: "make it cool not cute") ----------
  // What makes a hit read as powerful in 2D animation: an IMPACT FRAME (for one or two frames the screen goes black, the
  // attacker is a white silhouette and white lines burst from the point of contact), SMEARS and SPEED LINES on the fast
  // part of the move, and a held pose after it. These draw into the world layer only (the HUD stays readable).
  const rnd = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  // impact(ctx, x, y, k, seed): k 0 -> 1 over the impact (about 4 frames). Draw it BEFORE the attacker, then draw the
  // attacker with { mono: '#ffffff' } while k < 0.5.
  function impact(ctx, x, y, k, seed) {
    if (k >= 1) return;
    const W = SW.W, H = SW.H;
    ctx.save();
    ctx.globalAlpha = k < 0.5 ? 0.88 : 0.88 * (1 - (k - 0.5) * 2);
    ctx.fillStyle = '#000000'; ctx.fillRect(-60, -60, W + 120, H + 120);
    ctx.globalAlpha = k < 0.5 ? 1 : 1 - (k - 0.5) * 2;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2 + rnd(seed || 1, i) * 0.3, r0 = 16 + rnd(seed || 1, i + 40) * 26, r1 = 120 + rnd(seed || 1, i + 80) * 260, w = 0.012 + rnd(seed || 1, i + 9) * 0.03;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a - w) * r1, y + Math.sin(a - w) * r1); ctx.lineTo(x + Math.cos(a + w) * r1, y + Math.sin(a + w) * r1); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  // speed lines streaking along angle ang past (x, y)
  function lines(ctx, x, y, ang, len, n, t, col, spread) {
    const ca = Math.cos(ang), sa = Math.sin(ang), art = SW.art;
    for (let i = 0; i < n; i++) {
      const off = (rnd(i, 3) - 0.5) * (spread || 50), ph = (rnd(i, 7) + t * 0.13) % 1, l = len * (0.4 + rnd(i, 5) * 0.6);
      const px = x - sa * off - ca * (ph * len * 1.4 - len * 0.2), py = y + ca * off - sa * (ph * len * 1.4 - len * 0.2);
      art.line(ctx, i % 3 ? col : '#ffffff', Math.round(px), Math.round(py), Math.round(px - ca * l), Math.round(py - sa * l), 1);
    }
  }
  // claw marks: n parallel crescents raked through (x, y) along angle ang; k 0 -> 1 (they cut in fast, then fade)
  function claws(ctx, x, y, ang, size, k, pal, n) {
    if (k >= 1 || k < 0) return;
    const cut = Math.min(1, k / 0.25), fade = k < 0.4 ? 1 : 1 - (k - 0.4) / 0.6;
    sprite(ctx, x, y, size * 2.4, size * 2.4, c => {
      c.rotate(ang);
      for (let i = 0; i < (n || 3); i++) {
        const oy = (i - ((n || 3) - 1) / 2) * size * 0.3, L = size * (1 - Math.abs(i - ((n || 3) - 1) / 2) * 0.12) * cut, w = size * 0.17 * fade;
        const x0 = -size * 0.9, x1 = x0 + L * 1.8;
        c.beginPath(); c.moveTo(x0, oy); c.quadraticCurveTo((x0 + x1) / 2, oy - w * 2.2 - size * 0.08, x1, oy); c.quadraticCurveTo((x0 + x1) / 2, oy + w * 0.6 - size * 0.08, x0, oy); c.closePath(); c.fillStyle = pal[2] || '#ff8c42'; c.fill();
        c.beginPath(); c.moveTo(x0 + L * 0.1, oy); c.quadraticCurveTo((x0 + x1) / 2, oy - w * 1.5 - size * 0.08, x1 - L * 0.1, oy); c.quadraticCurveTo((x0 + x1) / 2, oy - w * 0.2 - size * 0.08, x0 + L * 0.1, oy); c.closePath(); c.fillStyle = '#ffffff'; c.fill();
      }
    }, { pal: pal.concat(['#ffffff']), alpha: fade, outline: pal[0] });
  }
  // over(fn): draw on top of every effect (the cinematic ultimates in js/ult-grand.js draw their own finishing form
  // after the shots, which would cover a hero's close-up). fn(ctx, cam) runs after fx.draw each frame until it returns false.
  // The wrap is made on first use, when every script has loaded, so it sits outside the others.
  const overs = []; let wrapped = false;
  function over(fn) {
    if (!wrapped && SW.fx && SW.fx.draw) { wrapped = true; const _fd = SW.fx.draw; SW.fx.draw = function (ctx, cam) { const r = _fd.apply(this, arguments); for (let i = overs.length - 1; i >= 0; i--) { let keep = false; try { ctx.save(); keep = overs[i](ctx, cam) !== false; } catch (e) { keep = false; } finally { ctx.restore(); } if (!keep) overs.splice(i, 1); } return r; }; }
    overs.push(fn);
  }
  SW.pix = { sprite, impact, lines, claws, over };
})();
