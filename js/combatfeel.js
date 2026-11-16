'use strict';
// Shattered Worlds — how hits and shots read. Loaded last; draw-only (no timing, hitbox, damage or physics changes).
//   1. Hit flash. A fighter who is hit used to turn into a solid white silhouette for 7 to 10 frames (the 4-frame flash
//      stood still during hit-stop). Now: 2 frames of white, then the fighter shows through a white glow that fades over
//      5 more, counted in real frames. While the hit-stop holds, the one who was hit shakes by a pixel.
//   2. One damage number per hit in Versus. A hit there made two numbers (the attacker's "hit" and the victim's "hurt");
//      now one: red, gold for a heavy hit, and a quick second hit's number sits above the first instead of on it.
//   3. Shots that read. Every hero's shot (darts, bullets, orbs, crescents, the element shots) leaves a tapered streak in
//      its colour and carries a brighter glow.
//   SW.combatfeel.on = false turns it all off.
(function () {
  const SW = window.SW, G = SW.game, art = SW.art, fx = SW.fx, P = SW.Player && SW.Player.prototype;
  if (!P || !art || !fx) return;
  const CF = SW.combatfeel = { on: true };
  const WHITE = 2, FADE = 5;

  // ================= 1. hit flash =================
  // sprite sheets: normal picture <-> its white copy (looked up when a new picture shows up)
  const N2F = new WeakMap(), F2N = new WeakMap();
  let known = 0;
  function learn() { const ids = Object.keys(art.sheets); if (ids.length === known) return; known = ids.length; ids.forEach(id => { const s = art.sheets[id]; if (s && s.img && s.flash && !N2F.has(s.img)) { N2F.set(s.img, s.flash); F2N.set(s.flash, s.img); } }); }
  const _pd = P.draw; P.draw = function (ctx, cam, g) {
    if (!CF.on) return _pd.apply(this, arguments);
    const hurt = this.state === 'hurt';
    if (hurt && (this._cfPrev !== 'hurt' || this.st < this._cfSt)) this._cfAt = SW.frame;   // a new hit (st starts again)
    this._cfPrev = this.state; this._cfSt = this.st;
    if (!hurt) return _pd.apply(this, arguments);
    learn();
    const age = SW.frame - (this._cfAt || 0), glow = age < WHITE ? 1 : age < WHITE + FADE ? 0.6 * (1 - (age - WHITE) / FADE) : 0;
    const orig = ctx.drawImage, shake = G.hitstop > 0 && age < 14 ? (SW.frame % 2 ? 1 : -1) : 0;
    ctx.drawImage = function (img) {
      const n = F2N.get(img) || img, f = N2F.get(n), a = Array.prototype.slice.call(arguments, 1);
      if (!f) return orig.apply(this, arguments);
      if (glow >= 1) return orig.call(this, f, ...a);
      orig.call(this, n, ...a);
      if (glow > 0) { const ga = this.globalAlpha; this.globalAlpha = ga * glow; orig.call(this, f, ...a); this.globalAlpha = ga; }
    };
    if (shake) { ctx.save(); ctx.translate(shake, 0); }
    try { return _pd.apply(this, arguments); } finally { ctx.drawImage = orig; if (shake) ctx.restore(); }
  };

  // ================= 2. one number per hit in Versus =================
  let lastNum = null;
  const _ft = fx.text; fx.text = function (x, y, str, col) {
    const m = CF.on && G.scene === 'vs' && /^-?(\d+)$/.exec(String(str));
    if (m) {
      const n = m[1];
      if (lastNum && lastNum.f === SW.frame && lastNum.n === n && Math.abs(lastNum.p.x - x) < 24 && fx.list.indexOf(lastNum.p) >= 0) {
        if (col === '#f5c542') lastNum.p.col = col;   // a heavy hit: the number turns gold
        return;
      }
      // a fresh number still where this one would go: this one sits above it, so two quick hits read as two
      let yy = y; for (const t of fx.list) if (t.k === 't' && t.life > t.max - 14 && Math.abs(t.x - x) < 16 && Math.abs(t.y - yy) < 7) yy = t.y - 8;
      _ft.call(this, x, yy, '-' + n, col === '#ffffff' || col === '#fff' || !col ? '#ff5a5a' : col);   // burns and the like keep their colour
      lastNum = { f: SW.frame, n, p: fx.list[fx.list.length - 1] };
      return;
    }
    return _ft.apply(this, arguments);
  };

  // ================= 3. shots =================
  const NO_TRAIL = { wave: 1, shock: 1, flask: 1 };
  function streak(ctx, cam, s, col, r) {
    const tr = s._cfTr || (s._cfTr = []);
    if (!tr.length || tr[tr.length - 1][2] !== SW.frame) { tr.push([s.x, s.y, SW.frame]); if (tr.length > 7) tr.shift(); }
    if (tr.length < 2) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i < tr.length; i++) {
      const k = i / (tr.length - 1), w = Math.max(1, Math.round(r * k)), a = tr[i - 1], b = tr[i];
      ctx.globalAlpha = 0.18 + 0.5 * k;
      const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2));
      for (let j = 0; j <= steps; j++) { const t = j / steps, px = a[0] + (b[0] - a[0]) * t - cam.x, py = a[1] + (b[1] - a[1]) * t - cam.y; art.rect(ctx, k > 0.8 ? '#ffffff' : col, Math.round(px - w / 2), Math.round(py - w / 2), w, w); }
    }
    ctx.globalAlpha = 1; ctx.restore();
    art.glow(ctx, Math.round(s.x - cam.x), Math.round(s.y - cam.y), r * 4 + 4, col, 0.22);
  }
  if (SW.Shot) {
    const _sd = SW.Shot.prototype.draw; SW.Shot.prototype.draw = function (ctx, cam) {
      if (CF.on && this.team === 'player' && !NO_TRAIL[this.kind] && !this.gone) streak(ctx, cam, this, this.col || '#ffffff', this.kind === 'orb' || this.kind === 'crescent' ? 4 : 3);
      return _sd.apply(this, arguments);
    };
  }
  if (SW.Proj) {
    const _jd = SW.Proj.prototype.draw; SW.Proj.prototype.draw = function (ctx, cam) {
      if (CF.on && !this.gone && (this.vx || this.vy)) streak(ctx, cam, this, this.col || this.c || '#ffffff', Math.max(2, Math.min(5, Math.round((this.r || this.h || 6) / 2))));
      return _jd.apply(this, arguments);
    };
  }
})();
