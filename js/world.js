'use strict';
// Shattered Worlds — zone runtime: tile grid, collision, builder API, rendering, FX, simple world entities.
(function () {
  const SW = window.SW, art = SW.art, T = 16;
  SW.zones = {};
  const MIDA = { slums: 0.9, metro: 0.9 };

  // ---------- FX ----------
  const fx = SW.fx = { list: [], flashT: 0, flashMax: 1, flashCol: '#fff', shakeT: 0, shakeAmt: 0 };
  fx.clear = () => { fx.list.length = 0; };
  fx.spark = function (x, y, col, n, spd) {
    for (let i = 0; i < (n || 6); i++) { const a = Math.random() * Math.PI * 2, s = (spd || 2.4) * (0.4 + Math.random()); fx.list.push({ k: 'p', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.6, g: 0.12, life: 14 + Math.random() * 12, max: 26, col, s: Math.random() < 0.4 ? 2 : 1 }); }
  };
  fx.debris = function (x, y, col, n) {
    for (let i = 0; i < (n || 8); i++) fx.list.push({ k: 'p', x: x + SW.rand(-8, 8), y: y + SW.rand(-8, 8), vx: SW.rand(-2.4, 2.4), vy: SW.rand(-4, -1), g: 0.28, life: 30 + Math.random() * 20, max: 50, col, s: 2 + (Math.random() * 2 | 0) });
  };
  fx.dust = function (x, y, n, dir) {
    for (let i = 0; i < (n || 4); i++) fx.list.push({ k: 'p', x: x + SW.rand(-4, 4), y, vx: SW.rand(-0.8, 0.8) + (dir || 0), vy: SW.rand(-0.9, -0.1), g: -0.01, life: 12 + Math.random() * 10, max: 22, col: '#c8ccd8', s: 2, a: 0.5 });
  };
  fx.text = function (x, y, str, col) { fx.list.push({ k: 't', x, y, vy: -0.9, life: 38, max: 38, str: String(str), col: col || '#fff' }); };
  fx.ring = function (x, y, col, r0, r1, life) { fx.list.push({ k: 'r', x, y, col, r0: r0 || 4, r1: r1 || 30, life: life || 16, max: life || 16 }); };
  fx.slash = function (x, y, face, kind, col, size) { fx.list.push({ k: 's', x, y, face, kind: kind || 1, col: col || '#fff', size: size || 26, life: 9, max: 9 }); };
  fx.bolt = function (x0, y0, x1, y1, col) {
    const pts = [[x0, y0]], n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 12));
    for (let i = 1; i < n; i++) pts.push([x0 + (x1 - x0) * i / n + SW.rand(-6, 6), y0 + (y1 - y0) * i / n + SW.rand(-6, 6)]);
    pts.push([x1, y1]);
    fx.list.push({ k: 'b', pts, col: col || '#ffe7a8', life: 8, max: 8 });
  };
  fx.ghost = function (sheet, anim, frame, x, y, flip, col) { fx.list.push({ k: 'g', sheet, anim, frame, x, y, flip, life: 12, max: 12 }); };
  fx.flash = function (col, frames) { fx.flashCol = col || '#fff'; fx.flashT = fx.flashMax = frames || 8; };
  fx.shake = function (amt, frames) { if (amt >= fx.shakeAmt || fx.shakeT <= 0) { fx.shakeAmt = amt; fx.shakeT = frames || 8; } };
  fx.update = function () {
    for (let i = fx.list.length - 1; i >= 0; i--) {
      const p = fx.list[i];
      if (p.k === 'p') { p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.96; }
      else if (p.k === 't') { p.y += p.vy; p.vy *= 0.94; }
      if (--p.life <= 0) fx.list.splice(i, 1);
    }
    if (fx.flashT > 0) fx.flashT--;
    if (fx.shakeT > 0) fx.shakeT--; else fx.shakeAmt = 0;
  };
  fx.draw = function (ctx, cam) {
    for (const p of fx.list) {
      const x = Math.round(p.x - cam.x), y = Math.round(p.y - cam.y), t = p.life / p.max;
      if (p.k === 'p') { ctx.globalAlpha = (p.a || 1) * Math.min(1, t * 2); ctx.fillStyle = p.col; ctx.fillRect(x, y, p.s, p.s); ctx.globalAlpha = 1; }
      else if (p.k === 't') { ctx.globalAlpha = Math.min(1, t * 3); SW.text(ctx, p.str, x, y, p.col, { align: 'center' }); ctx.globalAlpha = 1; }
      else if (p.k === 'r') { ctx.globalAlpha = t; art.ring(ctx, p.col, x, y, Math.round(SW.lerp(p.r1, p.r0, t))); art.ring(ctx, p.col, x, y, Math.round(SW.lerp(p.r1, p.r0, t)) - 1); ctx.globalAlpha = 1; }
      else if (p.k === 's') {
        const prog = 1 - t, r = p.size;
        let a0, a1;
        if (p.kind === 1) { a0 = -1.9; a1 = 0.9; } else if (p.kind === 2) { a0 = 1.2; a1 = -1.6; } else { a0 = -0.25; a1 = 0.25; }
        const head = SW.lerp(a0, a1, Math.min(1, prog * 1.8)), tail = SW.lerp(a0, a1, Math.max(0, prog * 1.8 - 0.8));
        const n = 14;
        ctx.globalAlpha = Math.min(1, t * 2.2);
        for (let i = 0; i <= n; i++) {
          const a = SW.lerp(tail, head, i / n), w = 1 + Math.round(3 * (i / n));
          const rr = p.kind === 3 ? r * (0.4 + 0.9 * (i / n)) : r;
          ctx.fillStyle = i > n * 0.7 ? '#ffffff' : p.col;
          ctx.fillRect(Math.round(x + Math.cos(a) * rr * p.face - w / 2), Math.round(y + Math.sin(a) * rr - w / 2), w, w);
        }
        ctx.globalAlpha = 1;
      } else if (p.k === 'b') {
        ctx.globalAlpha = t;
        for (let i = 0; i < p.pts.length - 1; i++) { art.line(ctx, p.col, p.pts[i][0] - cam.x, p.pts[i][1] - cam.y, p.pts[i + 1][0] - cam.x, p.pts[i + 1][1] - cam.y, 2); art.line(ctx, '#ffffff', p.pts[i][0] - cam.x, p.pts[i][1] - cam.y, p.pts[i + 1][0] - cam.x, p.pts[i + 1][1] - cam.y, 1); }
        ctx.globalAlpha = 1;
      } else if (p.k === 'g') { art.draw(ctx, p.sheet, p.anim, p.frame, x, y, p.flip, { alpha: t * 0.45, flash: true }); }
    }
  };

  // ---------- Zone ----------
  class Zone {
    constructor(id, G) {
      const def = SW.zones[id];
      this.id = id; this.def = def; this.name = def.name; this.theme = def.theme; this.music = def.music; this.w = def.w; this.h = def.h; this.safe = !!def.safe;
      this.grid = []; for (let y = 0; y < this.h; y++) this.grid.push(new Array(this.w).fill(' '));
      this.ents = []; this.shots = []; this.solids = []; this.exits = []; this.triggers = []; this.spawns = {}; this.hints = []; this.decor = []; this.liquids = [];
      def.build(this, G);
      this.tiles = art.bakeTiles(this);
      this.pw = this.w * T; this.ph = this.h * T;
    }
    // ----- builder -----
    fill(x, y, w, h, ch) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (j >= 0 && j < this.h && i >= 0 && i < this.w) this.grid[j][i] = ch || '#'; return this; }
    clear(x, y, w, h) { return this.fill(x, y, w, h, ' '); }
    ground(x0, x1, y) { return this.fill(x0, y, x1 - x0 + 1, this.h - y, '#'); }
    plat(x, y, w) { return this.fill(x, y, w, 1, '='); }
    ladder(x, y, h) { return this.fill(x, y, 1, h, 'H'); }
    liquid(x, y, w, h) { this.liquids.push({ x, y, w, h }); return this.fill(x, y, w, h, '~'); }
    spikes(x, y, w) { return this.fill(x, y, w, 1, '^'); }
    spawn(name, tx, ty) { this.spawns[name] = { x: tx * T + 8, y: (ty + 1) * T }; return this; }
    exit(tx, ty, tw, th, to, spawn, o) { this.exits.push(Object.assign({ x: tx * T, y: ty * T, w: tw * T, h: th * T, to, spawn }, o || {})); return this; }
    hint(tx, ty, tw, th, text) { this.hints.push({ x: tx * T, y: ty * T, w: tw * T, h: th * T, text }); return this; }
    trigger(tx, ty, tw, th, fn, o) { this.triggers.push(Object.assign({ x: tx * T, y: ty * T, w: tw * T, h: th * T, fn, once: true }, o || {})); return this; }
    prop(kind, tx, ty, o) { this.decor.push(Object.assign({ kind, x: tx * T + 8, y: (ty + 1) * T }, o || {})); return this; }
    add(e) { this.ents.push(e); return e; }
    enemy(type, tx, ty, o) { return this.add(SW.spawnEnemy(type, tx * T + 8, (ty + 1) * T, o)); }
    npc(sheet, tx, ty, o) { return this.add(new NPC(sheet, tx * T + 8, (ty + 1) * T, o)); }
    thing(kind, tx, ty, o) { return this.add(new Thing(kind, tx * T + 8, (ty + 1) * T, o)); }
    save(tx, ty, kind) { return this.add(new SavePoint(tx * T + 8, (ty + 1) * T, kind)); }
    shard(id, tx, ty, o) { return this.add(new Shard(this, id, tx * T + 8, (ty + 1) * T - 14, o)); }
    gate(tx, ty, th, o) { return this.add(new Gate(this, tx * T, ty * T, th * T, o)); }
    breakable(tx, ty, tw, th, id) { return this.add(new Breakable(this, tx * T, ty * T, tw * T, th * T, id)); }
    target(tx, ty, flag) { return this.add(new Target(tx * T + 8, ty * T + 8, flag)); }
    pickup(kind, tx, ty, o) { return this.add(new Pickup(kind, tx * T + 8, (ty + 1) * T - 6, Object.assign({ id: kind + tx + '_' + ty, zone: this.id }, o || {}))); }
    // arena: lock the player in with gates until every listed enemy is dead
    arena(o) { return this.add(new Arena(this, o)); }
    // ----- collision -----
    tile(tx, ty) { return tx < 0 || tx >= this.w ? '#' : ty < 0 || ty >= this.h ? ' ' : this.grid[ty][tx]; }
    hit(x, y, w, h, proj) {
      const x0 = Math.floor(x / T), x1 = Math.floor((x + w - 0.001) / T), y0 = Math.floor(y / T), y1 = Math.floor((y + h - 0.001) / T);
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
        if (tx < 0 || tx >= this.w) return true;
        if (ty < 0 || ty >= this.h) continue;
        const c = this.grid[ty][tx];
        if (c === '#' || (c === 'G' && !proj)) return true;
      }
      for (const s of this.solids) if (!(proj && s.bars) && x < s.x + s.w && x + w > s.x && y < s.y + s.h && y + h > s.y) return true;
      return false;
    }
    touches(x, y, w, h, chars) {
      const x0 = Math.floor(x / T), x1 = Math.floor((x + w - 0.001) / T), y0 = Math.floor(y / T), y1 = Math.floor((y + h - 0.001) / T);
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (chars.indexOf(this.tile(tx, ty)) >= 0 && this.tile(tx, ty) !== '#') return true;
      return false;
    }
    update(G) {
      for (let i = this.ents.length - 1; i >= 0; i--) { const e = this.ents[i]; e.update(G, this); if (e.gone) this.ents.splice(i, 1); }
      for (let i = this.shots.length - 1; i >= 0; i--) { const s = this.shots[i]; s.update(G, this); if (s.gone) this.shots.splice(i, 1); }
    }
    draw(ctx, cam, G) {
      const th = art.themes[this.theme], bg = art.bg[th.bg], W = SW.W, H = SW.H;
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, th.sky[0]); g.addColorStop(1, th.sky[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const maxY = Math.max(1, this.ph - H);
      if (bg) {
        const bw = bg.width, s = cam.x * 0.25, oy = -Math.round((bg.height - H) * SW.clamp(cam.y / maxY, 0, 1));
        for (let k = Math.floor(s / bw); k * bw - s < W; k++) {
          const dx = Math.round(k * bw - s);
          if (k % 2) { ctx.save(); ctx.translate(dx + bw, oy); ctx.scale(-1, 1); ctx.drawImage(bg, 0, 0); ctx.restore(); } else ctx.drawImage(bg, dx, oy);
        }
        ctx.globalAlpha = th.dim; ctx.fillStyle = th.sky[0]; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
      }
      const ma = bg ? (MIDA[this.theme] || 0) : 1;
      if (ma > 0) {
        const m = art.mid(this.theme), s = cam.x * 0.5, my = Math.round((this.ph - cam.y - H) * 0.5 + H - m.height);
        ctx.globalAlpha = ma;
        for (let k = Math.floor(s / m.width); k * m.width - s < W; k++) ctx.drawImage(m, Math.round(k * m.width - s), my);
        ctx.globalAlpha = 1;
      }
      const cx = Math.round(cam.x), cy = Math.round(cam.y);
      for (const d of this.decor) if (!d.front && d.x > cx - 80 && d.x < cx + W + 80) this.drawDecor(ctx, d, cx, cy);
      ctx.drawImage(this.tiles, cx, cy, W, H, 0, 0, W, H);
      for (const l of this.liquids) {
        const lx = l.x * T - cx, ly = l.y * T - cy, lw = l.w * T;
        if (lx > W || lx + lw < 0 || ly > H) continue;
        ctx.globalAlpha = 0.78; ctx.fillStyle = th.haz; ctx.fillRect(lx, ly + 4, lw, l.h * T - 4); ctx.globalAlpha = 1;
        for (let i = 0; i < lw; i += 4) { const wv = Math.sin((SW.frame * 0.08) + (l.x * T + i) * 0.21) * 1.5; ctx.fillStyle = '#eafff0'; ctx.fillRect(lx + i, Math.round(ly + 3 + wv), 4, 1); ctx.fillStyle = th.haz; ctx.fillRect(lx + i, Math.round(ly + 4 + wv), 4, 2); }
        if (SW.frame % 9 === 0 && Math.random() < 0.5) fx.list.push({ k: 'p', x: l.x * T + Math.random() * lw, y: l.y * T + 6, vx: 0, vy: -0.4, g: 0, life: 20, max: 20, col: '#eafff0', s: 1, a: 0.7 });
      }
      for (const e of this.ents) if (!e.front) e.draw(ctx, cam, G);
      if (G.player) G.player.draw(ctx, cam, G);
      for (const e of this.ents) if (e.front) e.draw(ctx, cam, G);
      for (const s of this.shots) s.draw(ctx, cam, G);
      fx.draw(ctx, cam);
      for (const d of this.decor) if (d.front && d.x > cx - 80 && d.x < cx + W + 80) this.drawDecor(ctx, d, cx, cy);
      for (const d of this.decor) if (d.glow && d.x > cx - 60 && d.x < cx + W + 60) {
        const sz = art.propSize(d.kind), fl = d.flicker ? (Math.sin(SW.frame * 0.3 + d.x) > -0.85 ? 1 : 0.3) : 1;
        art.glow(ctx, d.x - cx, d.y - cy - (d.gy !== undefined ? d.gy : sz[1] - 5), d.gr || 22, d.glow, 0.1 * fl);
      }
    }
    drawDecor(ctx, d, cx, cy) {
      if (d.kind === 'turbine') {
        art.prop(ctx, d.kind, d.x - cx, d.y - cy);
        const a = SW.frame * 0.03 + d.x;
        for (let i = 0; i < 3; i++) art.line(ctx, '#d8c8b0', d.x - cx, d.y - cy - 75, d.x - cx + Math.cos(a + i * 2.094) * 22, d.y - cy - 75 + Math.sin(a + i * 2.094) * 22, 2);
      } else if (d.kind === 'firebarrel') {
        art.prop(ctx, d.kind, d.x - cx, d.y - cy);
        for (let i = 0; i < 3; i++) { const h = 4 + Math.abs(Math.sin(SW.frame * 0.2 + i * 2)) * 6; art.rect(ctx, i === 1 ? '#ffe7a8' : '#ff8a3a', d.x - cx - 4 + i * 3, d.y - cy - 14 - h, 3, h); }
      } else art.prop(ctx, d.kind, d.x - cx, d.y - cy, d.col);
    }
  }
  SW.Zone = Zone;

  // ---------- simple world entities ----------
  class NPC {
    constructor(sheet, x, y, o) { Object.assign(this, { sheet, x, y, face: -1, prompt: 'Talk', w: 14, h: 30 }, o || {}); this.t = Math.random() * 100 | 0; }
    update(G) { this.t++; if (G.player && Math.abs(G.player.x - this.x) < 70 && !this.fixed) this.face = G.player.x < this.x ? -1 : 1; }
    canInteract(G) { return !!this.talk && (!this.when || this.when(G)); }
    interact(G) { const id = typeof this.talk === 'function' ? this.talk(G) : this.talk; if (id) G.say(id); }
    draw(ctx, cam) { art.draw(ctx, this.sheet, this.cheer ? 'cheer' : 'idle', Math.floor(this.t / 28) % 2, this.x - cam.x, this.y - cam.y, this.face < 0); }
  }
  class Thing {
    constructor(kind, x, y, o) { Object.assign(this, { kind, x, y, prompt: 'Use', w: 16, h: 20 }, o || {}); }
    update(G) { if (this.tick) this.tick(G, this); }
    canInteract(G) { return !!this.use && !this.gone && (!this.when || this.when(G)); }
    interact(G) { this.use(G, this); }
    draw(ctx, cam, G) {
      if (this.hide && this.hide(G)) return;
      art.prop(ctx, this.kind, this.x - cam.x, this.y - cam.y, this.col);
      if (this.glow) art.glow(ctx, this.x - cam.x, this.y - cam.y - 10, 16, this.glow, 0.1 + 0.04 * Math.sin(SW.frame * 0.1));
    }
  }
  class SavePoint {
    constructor(x, y, kind) { this.x = x; this.y = y; this.kind = kind || 'glyph'; this.prompt = 'Rest & Save'; this.w = 18; this.h = 24; }
    update() {}
    canInteract() { return true; }
    interact(G) { G.rest(this); }
    draw(ctx, cam) {
      art.prop(ctx, this.kind, this.x - cam.x, this.y - cam.y - (this.kind === 'glyph' ? 8 : 0));
      art.glow(ctx, this.x - cam.x, this.y - cam.y - 16, 18 + Math.sin(SW.frame * 0.08) * 3, this.kind === 'glyph' ? '#f5c542' : '#6fd3e8', 0.12);
    }
  }
  class Shard {
    constructor(z, id, x, y, o) { Object.assign(this, { id, x, y, zone: z.id, w: 12, h: 14 }, o || {}); this.t = Math.random() * 60; }
    update(G) {
      this.t++;
      if (G.flag('shard:' + this.id)) { this.gone = true; return; }
      const p = G.player;
      if (p && !this.locked && Math.abs(p.x - this.x) < 12 && p.y - 14 > this.y - 22 && p.y - 14 < this.y + 22) {
        this.gone = true; G.setFlag('shard:' + this.id);
        fx.ring(this.x, this.y, this.memory ? '#ffffff' : '#8b5cf6', 4, 40, 24); fx.spark(this.x, this.y, '#ffffff', 14, 3);
        if (this.memory) G.memory(this.memory, this.then); else G.minorShard();
      }
    }
    draw(ctx, cam, G) {
      if (this.hidden && !(G.player && G.player.modeT > 0) && !G.flag('tracker')) { if (SW.frame % 90 < 4) art.rect(ctx, '#8b5cf6', this.x - cam.x, this.y - cam.y, 1, 1); return; }
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y + Math.sin(this.t * 0.07) * 3), big = !!this.memory, col = big ? (G.hero().color) : '#8b5cf6', r = big ? 6 : 4;
      art.glow(ctx, x, y, big ? 22 : 13, col, 0.13);
      for (let i = -r; i <= r; i++) { const w = (r - Math.abs(i)) * (big ? 0.7 : 0.6) | 0; art.rect(ctx, i < 0 ? '#ffffff' : col, x - w, y + i, w * 2 + 1, 1); }
      art.rect(ctx, '#ffffff', x - 1, y - r + 1, 1, r);
      if (SW.frame % 12 === 0) fx.list.push({ k: 'p', x: this.x + SW.rand(-8, 8), y: this.y + SW.rand(-8, 8), vx: 0, vy: -0.3, g: 0, life: 18, max: 18, col: '#ffffff', s: 1 });
    }
  }
  class Pickup {
    constructor(kind, x, y, o) { Object.assign(this, { kind, x, y, vx: 0, vy: 0, amt: 1, w: 8, h: 8 }, o || {}); this.t = 0; }
    update(G, z) {
      this.t++;
      if (this.id && G.flag('pk:' + this.zone + ':' + this.id)) { this.gone = true; return; }
      if (this.loose) { this.vy += 0.3; this.y += this.vy; this.x += this.vx; this.vx *= 0.94; if (z.hit(this.x - 3, this.y - 3, 6, 9)) { this.y -= this.vy; this.vy *= -0.3; if (Math.abs(this.vy) < 0.6) { this.vy = 0; } } if (this.t > 600) this.gone = true; }
      const p = G.player;
      if (!p || p.dead) return;
      const dx = p.x - this.x, dy = p.y - 16 - this.y, d = Math.hypot(dx, dy);
      if (this.loose && this.t > 20 && d < 60) { this.x += dx / d * 3.2; this.y += dy / d * 3.2; }
      if (d < 14 && this.t > 8) {
        this.gone = true;
        if (this.id) G.setFlag('pk:' + this.zone + ':' + this.id);
        if (this.kind === 'creds') { G.state.creds += this.amt; SW.audio.sfx('coin'); }
        else if (this.kind === 'hp') { p.heal(this.amt); SW.audio.sfx('pickup'); }
        else if (this.kind === 'item') { G.state.items = Math.min(5, G.state.items + this.amt); SW.audio.sfx('pickup'); G.toast('+' + this.amt + ' ' + G.hero().item); }
        fx.spark(this.x, this.y, this.kind === 'creds' ? '#f5c542' : '#7dffa0', 5, 1.6);
      }
    }
    draw(ctx, cam, G) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y + (this.loose ? 0 : Math.sin(this.t * 0.1) * 2));
      if (this.kind === 'creds') { art.rect(ctx, '#f5c542', x - 2, y - 2, 4, 4); art.rect(ctx, '#fff7d0', x - 1, y - 2, 1, 2); }
      else if (this.kind === 'hp') { art.rect(ctx, '#7dffa0', x - 3, y - 1, 6, 2); art.rect(ctx, '#7dffa0', x - 1, y - 3, 2, 6); }
      else { art.glow(ctx, x, y, 10, '#7dffa0', 0.12); art.rect(ctx, '#f2e8d8', x - 4, y - 3, 8, 6); art.rect(ctx, G.hero().color, x - 4, y - 3, 8, 2); art.rect(ctx, '#7dffa0', x - 1, y - 1, 2, 3); }
    }
  }
  class Gate {
    constructor(z, x, y, h, o) {
      Object.assign(this, { x, y, w: 12, h, open: 0 }, o || {});
      if (this.horiz) this.w = this.horiz; else this.x += 2;
      this.rect = { x: this.x, y, w: this.w, h, bars: !!this.bars }; this.z = z; this.closed = false;
    }
    isOpen(G) { return this.openIf ? !!this.openIf(G) : this.flag ? G.flag(this.flag) : !!this.forceOpen; }
    update(G, z) {
      const want = !this.isOpen(G);
      if (want && !this.closed) { z.solids.push(this.rect); this.closed = true; }
      if (!want && this.closed) { z.solids.splice(z.solids.indexOf(this.rect), 1); this.closed = false; SW.audio.sfx('gate'); fx.shake(2, 8); }
      this.open = SW.clamp(this.open + (want ? -0.08 : 0.08), 0, 1);
    }
    draw(ctx, cam) {
      if (this.open >= 1) return;
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), h = Math.round(this.h * (1 - this.open));
      if (this.horiz) { const w = Math.round(this.w * (1 - this.open)); art.rect(ctx, '#4a4f68', x, y, w, this.h); art.rect(ctx, '#7a82a0', x, y, w, 2); for (let i = 6; i < w; i += 16) art.rect(ctx, '#f5c542', x + i, y + 4, 6, 2); }
      else if (this.bars) { for (let i = 0; i < 3; i++) art.rect(ctx, '#7a82a0', x + 1 + i * 4, y, 2, h); art.rect(ctx, '#a0a8c4', x, y, this.w, 2); art.rect(ctx, '#a0a8c4', x, y + h - 3, this.w, 2); }
      else { art.rect(ctx, this.col || '#4a4f68', x, y, this.w, h); art.rect(ctx, '#6a7090', x, y, 2, h); for (let j = 4; j < h; j += 8) art.rect(ctx, '#2e3246', x, y + j, this.w, 1); art.rect(ctx, '#f5c542', x + 4, y + h - 5, 4, 3); }
    }
  }
  class Breakable {
    constructor(z, x, y, w, h, id) {
      Object.assign(this, { x, y, w, h, id, hittable: true, team: 'object', zone: z.id }); this.rect = { x, y, w, h }; this.z = z; this.cx = x + w / 2; this.added = false;
    }
    box() { return this.rect; }
    update(G, z) { if (!this.added) { if (G.flag('brk:' + this.zone + ':' + this.id)) { this.gone = true; return; } z.solids.push(this.rect); this.added = true; } }
    takeHit(atk, G) {
      if (!atk.breaker) { if (!atk.quiet) { fx.text(this.cx, this.y + 6, 'CRACKED', '#c8ccd8'); SW.audio.sfx('block'); } return 'block'; }
      this.gone = true; this.z.solids.splice(this.z.solids.indexOf(this.rect), 1); G.setFlag('brk:' + this.zone + ':' + this.id);
      fx.debris(this.cx, this.y + this.h / 2, art.themes[this.z.theme].top, 22); fx.shake(5, 12); SW.audio.sfx('explode');
      return 'hit';
    }
    draw(ctx, cam) {
      const th = art.themes[this.z.theme], x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      art.rect(ctx, th.b, x, y, this.w, this.h); art.rect(ctx, th.top, x, y, this.w, 2); art.rect(ctx, th.deep, x + this.w - 1, y, 1, this.h);
      for (let j = 3; j < this.h - 4; j += 9) { art.line(ctx, th.deep, x + 3, y + j, x + this.w / 2, y + j + 5, 1); art.line(ctx, th.deep, x + this.w / 2, y + j + 5, x + this.w - 3, y + j + 2, 1); }
      if (SW.frame % 80 < 6) art.rect(ctx, '#ffffff', x + this.w / 2, y + this.h / 2, 1, 1);
    }
  }
  class Target {
    constructor(x, y, flag) { Object.assign(this, { x, y, flag, hittable: true, team: 'object', w: 12, h: 12 }); }
    box() { return { x: this.x - 6, y: this.y - 6, w: 12, h: 12 }; }
    update() {}
    takeHit(atk, G) { if (G.flag(this.flag)) return 'none'; G.setFlag(this.flag); fx.spark(this.x, this.y, '#7dffa0', 12, 3); SW.audio.sfx('zap'); if (this.onHit) this.onHit(G); return 'hit'; }
    draw(ctx, cam, G) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), on = G.flag(this.flag);
      art.rect(ctx, '#3a3f55', x - 6, y - 6, 12, 12); art.rect(ctx, '#5a6078', x - 6, y - 6, 12, 2); art.rect(ctx, on ? '#7dffa0' : '#ff5a5a', x - 3, y - 2, 6, 5);
      art.glow(ctx, x, y, 10, on ? '#7dffa0' : '#ff5a5a', 0.14 + 0.05 * Math.sin(SW.frame * 0.2));
    }
  }
  // Arena: gates slam shut when the player walks in, and open when the listed enemies are dead.
  class Arena {
    constructor(z, o) {
      Object.assign(this, { state: 0, foes: [] }, o); this.z = z;
      this.x0p = this.x0 * T; this.x1p = (this.x1 + 1) * T;
    }
    update(G, z) {
      const p = G.player, key = 'arena:' + z.id + ':' + this.id;
      if (this.state === 0) {
        if (G.flag(key)) { this.state = 3; this.gone = true; return; }
        if (p && p.x > this.x0p + 26 && p.x < this.x1p - 26 && (!this.yMin || p.y > this.yMin * T)) {
          this.state = 1;
          const gh = (this.gh || 5) * T, gy = (this.gy + 1) * T - gh;
          this.g1 = z.add(new Gate(z, this.x0p, gy, gh, { forceOpen: false })); this.g2 = z.add(new Gate(z, this.x1p - T, gy, gh, { forceOpen: false }));
          SW.audio.sfx('gate');
          this.foes = (this.enemies || []).map(e => { const f = z.enemy(e[0], e[1], e[2], e[3]); f.ax0 = this.x0p + T; f.ax1 = this.x1p - T; f.state = 'chase'; return f; });
          if (this.boss) { G.boss = this.foes[0]; this.foes[0].dormant = !!this.intro; }
          if (this.music) SW.audio.music(this.music);
          if (this.intro) G.say(this.intro); else if (this.boss) this.foes[0].dormant = false;
        }
      } else if (this.state === 1) {
        if (this.foes.every(f => f.dead)) {
          this.state = 2; this.t = 0;
        }
      } else if (this.state === 2) {
        if (++this.t > (this.boss ? 70 : 20) && !G.busy()) {
          this.state = 3; G.setFlag(key); this.g1.forceOpen = true; this.g2.forceOpen = true; G.boss = null;
          if (p && !p.dead) { G.state.checkpoint = { zone: z.id, x: p.safeX, y: p.safeY }; G.saveGame(); }   // clearing a fight is a checkpoint
          SW.audio.music(z.music);
          if (this.win) G.say(this.win);
          if (this.onWin) this.onWin(G);
        }
      }
    }
    draw() {}
  }
  Object.assign(SW, { NPC, Thing, SavePoint, Shard, Pickup, Gate, Breakable, Target, Arena });
})();
