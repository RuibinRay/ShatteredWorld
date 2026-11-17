'use strict';
// Shattered Worlds — the world kit: the shared helpers the world files (world-surface, world-deep, world-sky,
// world-tutorials) are built with. Moved here from the first story mode's story-world.js when that story was removed;
// the code is unchanged.
//   recolor / scaled   new sprite sheets made from existing ones (palette swap; scaled-up beasts)
//   tune               boss balance: merge stats and script move options into an enemy definition
//   patch              wrap a zone's build with extra building
//   lamp / fire / plate   small building helpers
//   SW.Boss2           the scripted boss (script: [move, options, [weight close, weight far]]) and its moves (MV);
//                      SW.spawnEnemy makes one for every enemy with a script
//   Arena 'armed', Breakable 'soft'   two small engine extensions
// SW.world holds them (plus SW.world.tutorials, filled by world-tutorials.js, and SW.world.crater, the duel balance,
// filled by world-surface.js). SW.story is kept as another name for SW.world, so the files that called the old story
// object (heat.js, ledger.js, vsboss.js recolor; difficulty.js tutorials; finalboss.js patch) keep working unchanged.
(function () {
  const SW = window.SW, art = SW.art, fx = SW.fx, Z = SW.zones, D = SW.data, E = D.enemies;
  const rect = art.rect;
  const world = SW.world = SW.story = SW.world || { tutorials: {}, crater: {} };
  world.tutorials = world.tutorials || {}; world.crater = world.crater || {};

  // new characters are existing sprite sheets with the palette swapped (and, for two beasts, scaled up)
  const hex = c => parseInt(c.slice(1), 16);
  const DK = ['skin', 'hair', 'top', 'pants', 'boots', 'acc', 'trail', 'arm', 'hand', 'fore'];
  function recolor(id, src, swap, raw) {
    const s = art.sheets[src];
    if (!s) return;
    const C = (s.cfg && s.cfg.c) || {}, map = {}, nc = Object.assign({}, C);
    const put = (from, to) => { if (from && to) map[hex(from)] = hex(to); };
    Object.keys(swap || {}).forEach(k => {
      const to = swap[k];
      put(C[k], to); nc[k] = to;
      if (DK.indexOf(k) >= 0) { put(C[k + 'D'], art.shade(to, 0.7)); nc[k + 'D'] = art.shade(to, 0.7); }
      if (k === 'top' && C.top) put(art.shade(C.top, 1.3), art.shade(to, 1.3));
      if (k === 'hair' && C.hair) put(art.shade(C.hair, 1.2), art.shade(to, 1.2));
    });
    Object.keys(raw || {}).forEach(k => put(k, raw[k]));
    const paint = cv => {
      const pair = SW.canvas(cv.width, cv.height), c = pair[0], x = pair[1];
      x.drawImage(cv, 0, 0);
      const im = x.getImageData(0, 0, c.width, c.height), d = im.data;
      for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const to = map[(d[i] << 16) | (d[i + 1] << 8) | d[i + 2]]; if (to !== undefined) { d[i] = to >> 16; d[i + 1] = (to >> 8) & 255; d[i + 2] = to & 255; } }
      x.putImageData(im, 0, 0);
      return c;
    };
    art.sheets[id] = Object.assign({}, s, { img: paint(s.img), head: s.head ? paint(s.head) : null, cfg: s.cfg ? Object.assign({}, s.cfg, { c: nc }) : null });
  }
  // frames: source frame numbers; paint(ctx, i) may draw over frame i; anims name the new frames
  function scaled(id, src, k, frames, anims, o) {
    const s = art.sheets[src];
    if (!s) return;
    const fw = s.fw * k, fh = s.fh * k, pair = SW.canvas(frames.length * fw, fh), c = pair[0], x = pair[1];
    x.imageSmoothingEnabled = false;
    frames.forEach((f, i) => x.drawImage(s.img, (f % s.cols) * s.fw, Math.floor(f / s.cols) * s.fh, s.fw, s.fh, i * fw, 0, fw, fh));
    if (o && o.tint) { x.globalCompositeOperation = 'source-atop'; x.globalAlpha = o.tint[1]; x.fillStyle = o.tint[0]; x.fillRect(0, 0, c.width, c.height); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
    if (o && o.paint) frames.forEach((f, i) => { x.save(); x.translate(i * fw, 0); o.paint(x, i); x.restore(); });
    const fl = SW.canvas(c.width, c.height);
    fl[1].drawImage(c, 0, 0); fl[1].globalCompositeOperation = 'source-in'; fl[1].fillStyle = '#fff'; fl[1].fillRect(0, 0, c.width, c.height);
    art.sheets[id] = { img: c, flash: fl[0], fw, fh, cols: frames.length, ox: fw / 2, oy: s.oy * k, anims };
  }

  // ---------- balance ----------
  // Tuned with ST.bench() in the old tools/story-test.js against the two scripted players the original bosses were tuned
  // with: one that only hammers attack (should lose about half the time or more) and one that guards, slipsteps and
  // heals (should win, ending around half health). tune(name, stats, moves): stats merge into the enemy; moves merge
  // options / weights into a script entry ({ o, w }), add it if missing, or remove it (null).
  //   counter  how hard the boss answers five free hits (x its damage; default 1.4)     tell  frames of warning for it
  function tune(name, stats, moves) {
    const e = E[name];
    if (!e) return;
    Object.assign(e, stats || {});
    Object.keys(moves || {}).forEach(m => {
      const v = moves[m], s = e.script.find(q => q[0] === m);
      if (v === null) e.script = e.script.filter(q => q[0] !== m);
      else if (s) { Object.assign(s[1], v.o || {}); if (v.w) s[2] = v.w; }
      else e.script.push([m, v.o || {}, v.w || [2, 2]]);
    });
  }

  function* wait(n) { for (let i = 0; i < n; i++) yield; }
  function* tele(b, n, anim, f) { b.setPose(anim, f); b.tele = n; b.vx = 0; SW.audio.sfx('tele'); yield* wait(n); b.tele = 0; }
  function* approach(b, g, dist, max) { const p = g.player; for (let i = 0; i < max && Math.abs(p.x - b.x) > dist; i++) { b.faceTo(p); b.vx = b.face * b.spd() * 1.6; b.setPose('run', Math.floor(i / 5) % 2); yield; } b.vx = 0; b.faceTo(p); }
  const shock = (z, b, s, r, col) => z.shots.push(new SW.Shot({ kind: 'shock', team: 'enemy', x: b.x + s * r, y: b.y - 5, fy: b.y, vx: s * 3.6, dmg: b.def.dmg - 3, life: 60, w: 14, h: 12, col: col || '#c8ccd8', kx: 3, ky: -3 }));
  const MV = {
    // after a few free hits the boss shrugs them off and swings back (same rule as the Act 1 bosses)
    *counter(b, g) {
      b.invuln = 10; b.faceTo(g.player);
      yield* tele(b, b.def.tell || 22, 'a4', 0);                       // a clear tell: a player who stops hammering has time to guard
      b.setPose('a4', 1); SW.audio.sfx('heavy'); b.vx = b.face * 2.5; fx.slash(b.x + b.face * 20, b.y - b.h * 0.6, b.face, 1, '#ffffff', 44);
      const hs = new Set();
      for (let i = 0; i < 7; i++) { b.hitFront(g, b.w / 2 + 56, b.h + 14, Math.round(b.def.dmg * (b.def.counter || 1.4)), hs, { kx: 6, ky: -3.4, heavy: true }); b.vx *= 0.8; yield; }   // the answer to button-mashing: guard it and it is nothing
      b.setPose('a4', 2); yield* wait(22);
    },
    *phase(b, g) {
      b.invuln = 84; b.vx = 0; b.setPose('cheer', 0); SW.audio.sfx('roar'); fx.shake(8, 40); fx.flash('#ffffff', 10); g.toast(b.def.name + ' is enraged!');
      for (let i = 0; i < 64; i++) { if (i % 8 === 0) fx.ring(b.x, b.y - b.h / 2, '#ff5a5a', 8, 64, 16); if (i === 30 && b.def.sheet2) b.sheet = b.def.sheet2; yield; }
    },
    *swings(b, g, z, o) {
      const n = o.n || 1;
      yield* approach(b, g, o.reach - 14, 60);
      for (let k = 0; k < n; k++) {
        const last = k === n - 1, an = last ? 'a4' : 'a1';
        b.faceTo(g.player); yield* tele(b, k ? 9 : (o.wind || 22) - (b.phase === 2 ? 6 : 0), an, 0);
        b.setPose(an, 1); b.vx = b.face * 2.6; SW.audio.sfx(last ? 'heavy' : 'swing'); fx.slash(b.x + b.face * 18, b.y - b.h * 0.6, b.face, k % 2 ? 2 : 1, o.col || '#ffffff', o.reach * 0.7);
        const hs = new Set();
        for (let i = 0; i < 7; i++) { b.hitFront(g, o.reach, b.h + 12, last ? b.def.dmg : b.def.dmg - 3, hs, last ? { kx: 5, ky: -3, heavy: true } : { kx: 2 }); b.vx *= 0.8; yield; }
        yield* wait(6);
      }
      b.setPose('a4', 2); yield* wait(b.phase === 2 ? 22 : 32);
    },
    *lunge(b, g, z, o) {
      const twice = b.phase === 2 && !o.again;
      b.faceTo(g.player); yield* tele(b, o.again ? 14 : 26, 'special', 0);
      SW.audio.sfx('dash');
      const hs = new Set();
      for (let i = 0; i < 20; i++) {
        b.vx = b.face * (o.speed || 7); b.setPose('dash', 0);
        if (i % 2 === 0) fx.ghost(b.sheet, 'dash', 0, b.x, b.y, b.face < 0);
        b.hitFront(g, b.w / 2 + 26, b.h + 4, b.def.dmg, hs, { kx: 5, ky: -2.6, heavy: true, unblockable: true });
        yield;
        if (b.hitWall) break;
      }
      b.vx = 0; b.setPose('a4', 2); yield* wait(twice ? 12 : 30);
      if (twice) yield* MV.lunge(b, g, z, Object.assign({}, o, { again: true }));
    },
    *charge(b, g, z, o) {
      b.faceTo(g.player); yield* tele(b, 40, 'special', 0);
      SW.audio.sfx('roar');
      const hs = new Set(), sp = (o.speed || 4.4) * (b.phase === 2 ? 1.25 : 1);
      for (let i = 0; i < 100; i++) {
        b.vx = b.face * sp; b.setPose('dash', Math.floor(i / 5) % 2);
        if (i % 3 === 0) fx.dust(b.x - b.face * b.w / 2, b.y, 2);
        b.hitBody(g, b.def.dmg + 2, hs, { kx: 6, ky: -4, heavy: true, unblockable: true });
        yield;
        if (b.hitWall) { fx.shake(8, 16); SW.audio.sfx('explode'); fx.debris(b.x + b.face * b.w / 2, b.y - b.h / 2, '#8a92a8', 12); b.vx = -b.face * 2; b.vy = -2.5; b.stun = 96; g.toast(b.def.name + ' is dazed - hit it now!'); return; }
      }
      b.vx = 0; b.setPose('idle', 0); yield* wait(22);
    },
    *slam(b, g, z, o) {
      const p = g.player, r = b.w / 2 + 24; b.faceTo(p);
      yield* tele(b, 24, 'cast', 0);
      b.vy = -7.6; b.vx = SW.clamp((p.x - b.x) / 34, -3.4, 3.4); b.setPose('jump', 0); SW.audio.sfx('jump');
      yield;
      for (let i = 0; i < 100 && !b.onGround; i++) { if (b.vy > 0) b.setPose('a4', 1); yield; }
      b.vx = 0; fx.shake(8, 14); SW.audio.sfx('explode'); fx.dust(b.x, b.y, 12);
      SW.strike(g, { team: 'enemy', x: b.x - r, y: b.y - 30, w: r * 2, h: 30, dmg: b.def.dmg, kx: 5, ky: -4, heavy: true, hitSet: new Set(), srcX: b.x, src: b });
      shock(z, b, -1, r - 10, o.col); shock(z, b, 1, r - 10, o.col);
      b.setPose('a4', 2); yield* wait(38);
    },
    *stomp(b, g, z, o) {
      const r = b.w / 2 + 28;
      yield* approach(b, g, r + 10, 70);
      yield* tele(b, 24, 'special', 0);
      b.setPose('a4', 0); fx.shake(8, 14); SW.audio.sfx('explode'); fx.dust(b.x, b.y, 14);
      SW.strike(g, { team: 'enemy', x: b.x - r, y: b.y - 34, w: r * 2, h: 34, dmg: b.def.dmg, kx: 5, ky: -4, heavy: true, hitSet: new Set(), srcX: b.x, src: b });
      shock(z, b, -1, r - 10, o.col); shock(z, b, 1, r - 10, o.col);
      b.setPose('idle', 0); yield* wait(40);
    },
    *lob(b, g, z, o) {
      const p = g.player;
      for (let i = 0, n = (o.n || 3) + (b.phase === 2 ? 1 : 0); i < n; i++) {
        b.faceTo(p); yield* tele(b, 14, 'cast', 0);
        b.setPose('cast', 1);
        z.shots.push(new SW.Shot({ kind: 'flask', team: 'enemy', x: b.x + b.face * 8, y: b.y - b.h * 0.85, vx: (p.x + SW.rand(-34, 34) - b.x) / 46, vy: -5.2, g: 0.24, dmg: o.dmg || b.def.dmg - 2, life: 130, w: 6, h: 6, col: o.col || '#5cff7a' })); SW.audio.sfx('swing');
        yield* wait(12);
      }
      b.setPose('idle', 0); yield* wait(26);
    },
    *volley(b, g, z, o) {
      const p = g.player; b.faceTo(p);
      yield* tele(b, 24, 'cast', 0);
      for (let i = 0, n = (o.n || 3) + (b.phase === 2 ? 2 : 0); i < n; i++) {
        b.setPose('cast', 1); b.faceTo(p);
        const ox = b.x + b.face * (b.w / 2 + 10), oy = b.y - b.h * 0.7, dx = p.x - ox, dy = p.y - 16 - oy, m = Math.hypot(dx, dy) || 1, sp = o.speed || 2.8;
        z.shots.push(new SW.Shot({ kind: o.kind || 'orb', team: 'enemy', x: ox, y: oy, vx: dx / m * sp, vy: dy / m * sp, dmg: b.def.dmg - 3, life: 150, w: 8, h: 8, col: o.col || '#ff5a5a' })); SW.audio.sfx('shoot');
        yield* wait(o.gap || 16);
      }
      b.setPose('idle', 0); yield* wait(30);
    },
    *summon(b, g, z, o) {
      yield* tele(b, 30, 'cheer', 0);
      SW.audio.sfx('roar');
      const lo = b.ax0 === undefined ? b.x - 160 : b.ax0, hi = b.ax1 === undefined ? b.x + 160 : b.ax1;
      const alive = z.ents.filter(e => e.type === o.kind && !e.dead && e.x > lo && e.x < hi).length, n = Math.min(b.phase === 2 ? 2 : 1, (o.max || 2) - alive);
      for (let i = 0; i < n; i++) {
        const ex = lo + 30 + Math.random() * (hi - lo - 60), e = SW.spawnEnemy(o.kind, ex, b.y - (o.fly ? 90 : 70), o.hp ? { hp: o.hp } : null);
        e.state = 'chase'; e.ax0 = lo; e.ax1 = hi; z.add(e); fx.spark(ex, b.y - 70, '#ffffff', 8);
      }
      yield* wait(28);
    }
  };
  const NAMES = { lunge: 'xLunge', charge: 'xCharge' };   // the test harness bot recognises unblockable moves by name
  class Boss2 extends SW.Boss {
    pose() {
      if (!this.def.beast) return super.pose();
      const ps = this.dead ? ['down', 0] : this.stun > 0 ? ['hurt', 0] : this.forcePose ? this.forcePose : Math.abs(this.vx) > 0.15 ? ['run', Math.floor(this.runT / 6)] : ['idle', 0];
      return [ps[0], ps[1] % art.frames(this.sheet, ps[0])];
    }
    think(g, z, p) {
      const d = this.def;
      if (this.phase === 1 && this.hp <= this.hpMax / 2) { this.phase = 2; this.gen = MV.phase(this, g); this.tele = 0; }
      if (!this.gen) {
        this.forcePose = null; this.faceTo(p);
        const dist = Math.abs(p.x - this.x);
        this.vx = dist > 130 && this.groundAhead(z, this.face) ? this.face * this.spd() : 0;
        if (this.poise >= (d.poise || 5)) { this.poise = 0; this.stun = 0; this.gen = MV.counter(this, g); }
        else if (--this.idleT <= 0) {
          const opts = d.script.map(s => [(s[1].p2 && this.phase < 2 ? 0 : 1) * s[2][dist < 100 + this.w / 2 ? 0 : 1], s]).filter(o => o[0] > 0 && (o[1] !== this.pick || Math.random() < 0.3));
          if (opts.length) {
            let r = Math.random() * opts.reduce((a, o) => a + o[0], 0), pick = opts[0];
            for (const o of opts) { r -= o[0]; if (r <= 0) { pick = o; break; } }
            this.pick = pick[1]; this.last = { name: NAMES[pick[1][0]] || pick[1][0] }; this.poise = 0;
            this.gen = MV[pick[1][0]](this, g, z, pick[1][1]);
          }
        }
      }
      if (this.gen) {
        const r = this.gen.next();
        if (r.done) { this.gen = null; this.forcePose = null; this.idleT = (d.idle || 30) * (this.phase === 2 ? 0.6 : 1) + Math.random() * 16; }
      }
    }
  }
  SW.Boss2 = Boss2;
  const _spawn = SW.spawnEnemy;
  SW.spawnEnemy = (type, x, y, o) => (E[type] && E[type].script ? new Boss2(type, x, y, o) : _spawn(type, x, y, o));

  // ================= small engine extensions =================
  // an arena can wait for a flag before it springs (secret bosses)
  const _au = SW.Arena.prototype.update;
  SW.Arena.prototype.update = function (g, z) { if (this.state === 0 && this.armed && !this.armed(g) && !g.flag('arena:' + z.id + ':' + this.id)) return; _au.call(this, g, z); };
  // a breakable can be "soft": heavy blows (the last hit of a combo) or fire will do, not only a wall-breaker
  const _bt = SW.Breakable.prototype.takeHit;
  SW.Breakable.prototype.takeHit = function (atk, g) {
    if (this.soft && !atk.breaker) {
      const ok = (this.soft === 'heavy' && atk.heavy) || (this.soft === 'burn' && atk.status && atk.status.burn);
      if (!ok) { if (!atk.quiet) { fx.text(this.cx, this.y + 6, this.soft === 'burn' ? 'NEEDS FIRE' : 'HIT HARDER', '#c8ccd8'); SW.audio.sfx('block'); } return 'block'; }
      atk = Object.assign({}, atk, { breaker: true });
    }
    const r = _bt.call(this, atk, g);
    if (r === 'hit' && this.onBreak) this.onBreak(g);
    return r;
  };
  // a wide floor plate instead of a small switch: forgiving enough to hit with something thrown in an arc
  function plate(t) {
    const d = t.draw;
    t.box = () => ({ x: t.x - 10, y: t.y - 10, w: 20, h: 20 });
    t.draw = function (ctx, cam, g) { const x = Math.round(t.x - cam.x), y = Math.round(t.y - cam.y); rect(ctx, '#3a3f55', x - 10, y - 10, 20, 20); rect(ctx, '#5a6078', x - 10, y - 10, 20, 2); d.call(t, ctx, cam, g); };
    return t;
  }
  const lamp = (z, x, y, col) => z.prop('lamp', x, y, { col: col || '#f5c542', glow: col || '#f5c542', gy: 47, gr: 26 });
  const fire = (z, x, y, col) => z.prop('firebarrel', x, y, { glow: col || '#ff8a3a', gy: 16, gr: 24 });
  function patch(id, fn) { const def = Z[id]; if (!def) return; const b = def.build; def.build = function (z, g) { b.call(this, z, g); fn(z, g); }; }

  Object.assign(world, { recolor, scaled, patch, tune, lamp, fire, plate, MV, Boss2 });
})();
