'use strict';
// Shattered Worlds — enemies: shared base, per-type AI, and generator-scripted bosses.
(function () {
  const SW = window.SW, art = SW.art, fx = SW.fx, GRAV = SW.GRAV;
  const CUSTOM = { drone: 1, rat: 1, crawler: 1, warden: 1 };

  class Enemy {
    constructor(type, x, y, o) {
      const d = SW.data.enemies[type];
      Object.assign(this, { type, def: d, x, y, vx: 0, vy: 0, w: d.w || 12, h: d.h || 30, face: -1, hp: d.hp, hpMax: d.hp, state: 'idle', st: 0, t: Math.random() * 60 | 0, runT: 0,
        stun: 0, juggle: 0, downed: false, lying: 0, dead: false, deadT: 0, cool: 30 + Math.random() * 40, home: x, pdir: Math.random() < 0.5 ? -1 : 1, hits: 0,
        flashT: 0, showHp: 0, hittable: true, team: 'enemy', invuln: 0, tele: 0, blockT: 0, contactCd: 0, turnWait: 0, sheet: d.sheet, onGround: false }, o || {});
      if (o && o.hp) this.hpMax = this.hp = o.hp;
      if (d.ai === 'drone') this.cool = 70 + Math.random() * 150;
      if (d.ai === 'leaper') this.cool = 8 + Math.random() * 30;
    }
    box() { return { x: this.x - this.w / 2, y: this.y - this.h, w: this.w, h: this.h }; }
    // some enemies commit to their swing: light hits no longer interrupt the last frames of the wind-up
    superArmor() { const d = this.def; return !!d.heavy || (!!d.commit && ((this.state === 'windup' && this.st > d.windup - 12) || (this.state === 'strike' && this.st < 8))); }
    stagger(n) { if (this.dead) return; this.stun = Math.max(this.stun, n); this.state = 'chase'; this.st = 0; this.tele = 0; }
    groundAhead(z, dir) { const c = z.tile(Math.floor((this.x + dir * (this.w / 2 + 5)) / 16), Math.floor((this.y + 3) / 16)); return c === '#' || c === '=' || z.hit(this.x + dir * (this.w / 2 + 5) - 1, this.y + 1, 2, 4); }
    takeHit(atk, G) {
      if (this.dead || this.invuln > 0) return 'none';
      const d = this.def, ax = atk.srcX !== undefined ? atk.srcX : G.player.x, front = (ax - this.x) * this.face > 0, cx = this.x, cy = this.y - this.h - 6;
      if (this.juggle > 12) return 'none';
      if (d.energyOnly && !atk.energy) { if (!atk.quiet) fx.text(cx, cy, 'NO EFFECT', '#b9a0ff'); return 'block'; }
      if (d.shield && front && !atk.energy && this.stun <= 0) { this.blockT = 12; fx.text(cx, cy, 'SHIELD', '#6fd3e8'); return 'block'; }
      if (d.blockEvery && !atk.heavy && !atk.energy && !atk.launch && ++this.hits % d.blockEvery === 0) { this.blockT = 14; this.vx = (atk.kx || 0) * 0.5; this.stun = 0; this.state = 'windup'; this.st = Math.max(0, d.windup - 16); return 'block'; }
      let dmg = atk.dmg;
      if (d.armored && front && !atk.energy && !atk.fromAbove) { dmg = Math.max(1, Math.ceil(dmg * 0.2)); fx.text(cx, cy, 'ARMOUR', '#d08a4a'); }
      this.hp -= dmg; this.flashT = 5; this.showHp = 150; atk.dealt = dmg;
      if (!this.superArmor()) {
        this.stun = atk.stun || 16; this.vx = atk.kx || 0; this.state = 'chase'; this.st = 0; this.tele = 0; this.juggle++;
        if (this.def.fly) { this.vy = (atk.ky || 0) * 0.4; }
        else if (atk.ky) { this.vy = atk.ky; this.onGround = false; this.y -= 1; } else if (!this.onGround) this.vy = -2.2;
        if (atk.down || atk.launch) this.downed = true;
      }
      if (this.hp <= 0) this.die(G, atk);
      return 'hit';
    }
    die(G, atk) {
      if (this.dead) return;
      this.dead = true; this.hittable = false; this.deadT = 0; this.vy = -3.4; this.vx = atk && atk.kx ? Math.sign(atk.kx) * 2.6 : 0; this.tele = 0;
      G.onKill(this);
    }
    think(G, z, p) { AI[this.def.ai](this, G, z, p); }
    update(G, z) {
      this.t++;
      if (this.flashT > 0) this.flashT--; if (this.showHp > 0) this.showHp--; if (this.invuln > 0) this.invuln--; if (this.tele > 0) this.tele--;
      if (this.cool > 0) this.cool--; if (this.contactCd > 0) this.contactCd--; if (this.blockT > 0) this.blockT--;
      const fly = this.def.fly && !this.dead, p = G.player;
      if (this.dead) {
        this.deadT++; this.vy = Math.min(7, this.vy + GRAV); this.vx *= 0.95; SW.move(this, z);
        if (this.def.ai === 'drone' && !this.boomed && (this.onGround || this.deadT > 45)) {
          this.boomed = true; fx.ring(this.x, this.y - 6, '#ff8a3a', 4, 32, 14); fx.spark(this.x, this.y - 6, '#ffb040', 14, 3.4); SW.audio.sfx('explode'); fx.shake(4, 10);
          SW.strike(G, { team: 'enemy', x: this.x - 26, y: this.y - 30, w: 52, h: 44, dmg: 9, kx: 4, ky: -3, hitSet: new Set(), srcX: this.x }); this.gone = true;
        }
        if (this.deadT > (this.isBoss ? 120 : 60)) this.gone = true;
        return;
      }
      if (this.dormant && !G.busy()) this.dormant = false;
      if (G.busy() || this.dormant || !p) { if (!fly) { this.vy = Math.min(7, this.vy + GRAV); this.vx *= 0.7; SW.move(this, z); } return; }
      if (this.stun > 0) {
        this.stun--;
        if (fly) { this.vy *= 0.9; this.vx *= 0.9; } else { this.vy = Math.min(7, this.vy + GRAV * (this.juggle > 12 ? 1.7 : 1)); this.vx *= this.onGround ? 0.8 : 0.985; }
        SW.move(this, z);
        if (this.onGround && this.downed) { this.downed = false; this.lying = 36; this.stun = Math.max(this.stun, 36); fx.dust(this.x, this.y, 4); }
        if (this.lying > 0) this.lying--;
        if (this.stun <= 0) { this.juggle = 0; this.lying = 0; this.st = 0; }
        return;
      }
      this.think(G, z, p);
      if (!fly) this.vy = Math.min(7, this.vy + GRAV);
      SW.move(this, z);
      this.runT += Math.abs(this.vx);
      if ((this.def.contact || this.state === 'leap' || this.state === 'charge') && this.contactCd <= 0 && !p.dead) {
        const b = this.box();
        if (SW.strike(G, { team: 'enemy', x: b.x, y: b.y, w: b.w, h: b.h, dmg: this.def.dmg, kx: 3, hitSet: new Set(), srcX: this.x, src: this })) this.contactCd = 40;
      }
      if (this.y > z.ph + 80) { this.hp = 0; this.die(G); }
    }
    pose() {
      const d = this.def, A = n => (d.anims && d.anims[n]) || n, cu = CUSTOM[this.sheet];
      if (this.dead) return [this.onGround || cu ? 'down' : 'hurt', 0];
      if (this.lying > 0) return ['down', 0];
      if (this.stun > 0) return ['hurt', 0];
      if (this.blockT > 0 && !cu) return ['guard', 0];
      if (this.forcePose) return this.forcePose;
      const s = this.state;
      if (cu) {
        if (s === 'windup' || s === 'strike' || s === 'burst') return ['atk', s === 'windup' ? 0 : 1];
        return Math.abs(this.vx) > 0.1 || d.fly ? ['run', Math.floor(this.t / 6) % art.frames(this.sheet, 'run')] : ['idle', Math.floor(this.t / 20) % art.frames(this.sheet, 'idle')];
      }
      if (s === 'windup') return d.ai === 'ranged' ? ['cast', 0] : [A('atk') === 'atk' ? 'a1' : A('atk'), 0];
      if (s === 'strike') return d.ai === 'ranged' ? ['cast', this.st < 10 ? 1 : 2] : [A('atk') === 'atk' ? 'a1' : A('atk'), this.st < 9 ? 1 : (d.anims ? 1 : 2)];
      if (s === 'leap') return [A('jump'), 0];
      if (!this.onGround && !d.anims) return [this.vy < 0 ? 'jump' : 'fall', 0];
      if (Math.abs(this.vx) > 0.15) { const n = art.frames(this.sheet, A('run')); return [A('run'), Math.floor(this.runT / (d.anims ? 7 : 5)) % n]; }
      return [A('idle'), Math.floor(this.t / 28) % art.frames(this.sheet, A('idle'))];
    }
    draw(ctx, cam, G) {
      const x = this.x - cam.x, y = this.y - cam.y;
      if (x < -80 || x > SW.W + 80) return;
      const ps = this.pose(), o = {};
      if (this.flashT > 0 || (this.tele > 0 && Math.floor(this.tele / 3) % 2 === 0) || (this.state === 'windup' && this.def.windup - this.st < 12 && Math.floor(this.st / 3) % 2 === 0)) o.flash = true;
      if (this.dead) o.alpha = SW.clamp(1 - (this.deadT - (this.isBoss ? 80 : 30)) / 30, 0, 1);
      art.draw(ctx, this.sheet, ps[0], ps[1], x, y, this.face < 0, o);
      if (this.showHp > 0 && !this.isBoss && !this.dead) {
        const bw = 20, hx = Math.round(x - bw / 2), hy = Math.round(y - this.h - 8);
        art.rect(ctx, '#0a0a12', hx - 1, hy - 1, bw + 2, 4); art.rect(ctx, '#ff5a5a', hx, hy, Math.max(0, Math.round(bw * this.hp / this.hpMax)), 2);
      }
      if (this.state === 'windup' || this.tele > 0) SW.text(ctx, '!', Math.round(x), Math.round(y - this.h - 18), '#ffe040', { align: 'center' });
      if (this.stun > 60 && !this.dead) for (let i = 0; i < 3; i++) art.rect(ctx, '#ffe040', x + Math.cos(this.t * 0.2 + i * 2.1) * 8, y - this.h - 6 + Math.sin(this.t * 0.2 + i * 2.1) * 2, 2, 2);
    }
  }

  // ---------- regular AI ----------
  function patrol(e, z, speed) {
    if (e.hitWall) e.pdir = -e.hitWall;
    else if (!e.groundAhead(z, e.pdir)) e.pdir = -e.pdir;
    else if (e.x - e.home > 46) e.pdir = -1; else if (e.x - e.home < -46) e.pdir = 1;
    e.vx = e.pdir * speed; e.face = e.pdir;
  }
  const sees = (e, p, dx, dy) => !p.dead && Math.abs(dx) < e.def.aggro && Math.abs(dy) < 84;
  function turn(e, want, delay) { if (want !== e.face) { if (++e.turnWait > delay) { e.face = want; e.turnWait = 0; } } else e.turnWait = 0; }
  const AI = {
    melee(e, G, z, p) {
      const d = e.def, dx = p.x - e.x, adx = Math.abs(dx), dy = p.y - e.y, want = dx >= 0 ? 1 : -1;
      if (e.state === 'idle') { patrol(e, z, d.speed * 0.4); if (sees(e, p, dx, dy)) { e.state = 'chase'; G.alert(); } }
      else if (e.state === 'chase') {
        // flank: if an ally already stands between me and the player, circle round to the far side
        if (e.flankT > 0) e.flankT--;
        const side = dx >= 0 ? -1 : 1;
        if (!e.flank && !(e.flankT > 0) && !d.shield && adx < 100 && z.ents.some(o => o !== e && o.team === 'enemy' && !o.dead && o.def.ai === 'melee' && (o.x - p.x) * side > 0 && Math.abs(o.x - p.x) < adx)) { e.flank = -side; e.flankT = 220; }
        if (e.flank) {
          const ddx = p.x + e.flank * (d.range - 6) - e.x, fd = ddx > 0 ? 1 : -1;
          if (Math.abs(ddx) < 6 || e.flankT < 100 || !e.groundAhead(z, fd) || e.hitWall) e.flank = 0;
          else { e.face = fd; e.vx = fd * d.speed * 1.6; return; }
        }
        turn(e, want, d.shield ? 34 : 0);
        e.vx = e.face === want && adx > d.range - 8 && e.groundAhead(z, e.face) ? e.face * d.speed : 0;
        if (adx < d.range + 2 && Math.abs(dy) < 40 && e.cool <= 0 && e.face === want) { e.state = 'windup'; e.st = 0; e.vx = 0; }
        if (adx > d.aggro * 2.4 || p.dead) { e.state = 'idle'; e.home = e.x; }
      } else if (e.state === 'windup') {
        e.vx = 0;
        if (++e.st >= d.windup) { e.state = 'strike'; e.st = 0; e.hitSet = new Set(); e.vx = e.face * 1.4; SW.audio.sfx('swing'); }
      } else if (e.state === 'strike') {
        e.st++; e.vx *= 0.8;
        if (e.st <= 6) SW.strike(G, { team: 'enemy', x: e.face > 0 ? e.x - 2 : e.x - d.range - 6, y: e.y - e.h, w: d.range + 8, h: e.h, dmg: d.dmg, kx: 3, hitSet: e.hitSet, srcX: e.x, src: e });
        if (e.st > 24) { e.state = 'chase'; e.cool = 46 + Math.random() * 40; }
      }
    },
    ranged(e, G, z, p) {
      const d = e.def, dx = p.x - e.x, adx = Math.abs(dx), dy = p.y - e.y;
      if (e.state === 'idle') { patrol(e, z, d.speed * 0.4); if (sees(e, p, dx, dy)) { e.state = 'chase'; G.alert(); } }
      else if (e.state === 'chase') {
        e.face = dx >= 0 ? 1 : -1;
        if (adx < 76 && e.groundAhead(z, -e.face) && !e.hitWall) e.vx = -e.face * d.speed; else if (adx > d.range && e.groundAhead(z, e.face)) e.vx = e.face * d.speed; else e.vx = 0;
        if (e.cool <= 0 && adx < d.range + 30 && Math.abs(dy) < 60) { e.state = 'windup'; e.st = 0; }
        if (adx > d.aggro * 2.2 || p.dead) { e.state = 'idle'; e.home = e.x; }
      } else if (e.state === 'windup') {
        e.vx = 0; e.face = dx >= 0 ? 1 : -1;
        if (++e.st >= 28) {
          e.state = 'strike'; e.st = 0; SW.audio.sfx('shoot');
          const sx = e.x + e.face * 12, sy = e.y - 21, tt = Math.max(20, adx / 3.1);
          z.shots.push(new SW.Shot({ kind: 'bullet', team: 'enemy', x: sx, y: sy, vx: e.face * 3.1, vy: SW.clamp((p.y - 16 - sy) / tt, -1.3, 1.3), dmg: d.dmg, life: 110, w: 5, h: 5, col: d.shot }));
        }
      } else if (e.state === 'strike') { if (++e.st > 20) { e.state = 'chase'; e.cool = d.cd * (0.8 + Math.random() * 0.4); } }
    },
    leaper(e, G, z, p) {
      const d = e.def, dx = p.x - e.x, adx = Math.abs(dx), dy = p.y - e.y;
      if (e.state === 'idle') { patrol(e, z, d.speed * 0.35); if (sees(e, p, dx, dy)) { e.state = 'chase'; G.alert(); } }
      else if (e.state === 'chase') {
        e.face = dx >= 0 ? 1 : -1;
        e.vx = adx > 34 && e.groundAhead(z, e.face) ? e.face * d.speed : 0;
        if (e.onGround && adx < 96 && e.cool <= 0 && Math.abs(dy) < 50) { e.state = 'windup'; e.st = 0; }
        if (adx > d.aggro * 2.4 || p.dead) { e.state = 'idle'; e.home = e.x; }
      } else if (e.state === 'windup') {
        e.vx = 0;
        if (++e.st >= 18) { e.state = 'leap'; e.st = 0; e.vx = e.face * SW.clamp(adx / 22, 2.6, 4.4); e.vy = -4.6; e.contactCd = 0; SW.audio.sfx('swing'); }
      } else if (e.state === 'leap') {
        e.st++;
        if (e.onGround && e.st > 4) { e.state = 'chase'; e.cool = 40 + Math.random() * 30; e.vx = 0; }
      }
    },
    hopper(e, G, z, p) {
      const d = e.def, dx = p.x - e.x, dy = p.y - e.y;
      if (e.state === 'idle') { patrol(e, z, d.speed * 0.5); if (sees(e, p, dx, dy)) e.state = 'chase'; }
      else {
        if (e.onGround) { e.vx *= 0.7; if (e.cool <= 0) { e.face = dx >= 0 ? 1 : -1; e.vx = e.face * d.speed * 1.5; e.vy = -2.9; e.cool = 24 + Math.random() * 16; } }
        if (Math.abs(dx) > d.aggro * 3) e.state = 'idle';
      }
    },
    // hovers out of reach, then swoops down to head height to fire a 3-shot burst: that is the moment to hit it
    drone(e, G, z, p) {
      const d = e.def, dx = p.x - e.x, dy = p.y - e.y;
      if (e.state === 'idle') { e.vx = Math.sin(e.t * 0.03) * 0.4; e.vy = Math.cos(e.t * 0.05) * 0.25; e.face = e.vx >= 0 ? 1 : -1; if (!p.dead && Math.abs(dx) < d.aggro && Math.abs(dy) < 130) { e.state = 'chase'; G.alert(); } return; }
      e.face = dx >= 0 ? 1 : -1;
      const low = e.state !== 'chase', k = low ? 2 : 1;
      const tx = low ? e.dtx : p.x + Math.sin(e.t * 0.022 + e.home) * 70, ty = low ? e.dty : p.y - 62 + Math.sin(e.t * 0.06) * 6;   // a dive commits to one spot
      e.vx = SW.clamp(e.vx + SW.clamp((tx - e.x) * 0.03, -0.09 * k, 0.09 * k), -d.speed * 1.5 * k, d.speed * 1.5 * k);
      e.vy = SW.clamp(e.vy + SW.clamp((ty - e.y) * 0.03, -0.09 * k, 0.09 * k), -d.speed * k, d.speed * k);
      if (e.state === 'chase') { if (e.cool <= 0 && Math.abs(dx) < 190) { e.state = 'dive'; e.st = 0; e.dtx = p.x - e.face * 30; e.dty = p.y - 18; } }
      else if (e.state === 'dive') { if (++e.st > 70 || (Math.abs(ty - e.y) < 8 && Math.abs(tx - e.x) < 30)) { e.state = 'windup'; e.st = 0; } }
      else if (e.state === 'windup') { e.vx *= 0.85; e.vy *= 0.85; if (++e.st >= 30) { e.state = 'burst'; e.st = 0; } }
      else if (e.state === 'burst') {
        e.vx *= 0.85; e.vy *= 0.85;
        if (e.st % 9 === 0 && e.st < 27) {
          const sx = e.x + e.face * 12, sy = e.y - 6, ddx = p.x - sx, ddy = p.y - 16 - sy, m = Math.hypot(ddx, ddy) || 1;
          z.shots.push(new SW.Shot({ kind: 'bullet', team: 'enemy', x: sx, y: sy, vx: ddx / m * 2.5, vy: ddy / m * 2.5, dmg: d.dmg, life: 120, w: 5, h: 5, col: d.shot })); SW.audio.sfx('shoot');
        }
        if (++e.st > 66) { e.state = 'chase'; e.cool = 150 + Math.random() * 90; }   // lingers low for a moment after firing
      }
    },
    crawler(e, G, z, p) {
      const d = e.def, dx = p.x - e.x, dy = p.y - e.y;
      if (e.state === 'idle' || e.state === 'chase') {
        patrol(e, z, d.speed);
        if (!p.dead && Math.abs(dx) < d.aggro && Math.abs(dy) < 30 && Math.sign(dx) === e.face && e.cool <= 0) { e.state = 'windup'; e.st = 0; }
      } else if (e.state === 'windup') { e.vx = 0; if (++e.st > 24) { e.state = 'charge'; e.st = 0; SW.audio.sfx('dash'); } }
      else if (e.state === 'charge') {
        e.vx = e.face * d.speed * 4.4; if (e.st % 4 === 0) fx.dust(e.x - e.face * 14, e.y, 2);
        if (++e.st > 44 || e.hitWall || !e.groundAhead(z, e.face)) { e.state = 'idle'; e.cool = 70; e.pdir = e.face; e.home = e.x; }
      }
    }
  };

  // ---------- bosses ----------
  function* wait(n) { for (let i = 0; i < n; i++) yield; }
  function* tele(b, n, anim, f) { b.setPose(anim, f); b.tele = n; b.vx = 0; SW.audio.sfx('tele'); yield* wait(n); b.tele = 0; }
  function* approach(b, G, dist, max, mul) {
    const p = G.player;
    for (let i = 0; i < max && Math.abs(p.x - b.x) > dist; i++) { b.faceTo(p); b.vx = b.face * b.spd() * (mul || 1.5); b.setPose('run', Math.floor(i / 5) % art.frames(b.sheet, 'run')); yield; }
    b.vx = 0; b.faceTo(p);
  }
  const M = {
    // punish button-mashing: after a few free hits the boss shrugs them off and swings back
    *counter(b, G) {
      b.invuln = 10; b.faceTo(G.player);
      yield* tele(b, b.def.boss === 'tusk' ? 20 : 15, 'a4', 0);
      b.setPose('a4', 1); SW.audio.sfx('heavy'); b.vx = b.face * 2.5; fx.slash(b.x + b.face * 20, b.y - b.h * 0.6, b.face, 1, '#ffffff', 44);
      const hs = new Set();
      for (let i = 0; i < 7; i++) { b.hitFront(G, 66, b.h + 14, b.def.dmg, hs, { kx: 6, ky: -3.4, heavy: true }); b.vx *= 0.8; yield; }
      b.setPose('a4', 2); yield* wait(22);
    },
    *phase(b, G) {
      b.invuln = 84; b.vx = 0; b.setPose(CUSTOM[b.sheet] ? 'tele' : 'cheer', 0); SW.audio.sfx('roar'); fx.shake(8, 40); fx.flash('#ffffff', 10); G.toast(b.def.name + ' is enraged!');
      for (let i = 0; i < 64; i++) { if (i % 8 === 0) fx.ring(b.x, b.y - b.h / 2, '#ff5a5a', 8, 64, 16); if (i === 30 && b.def.sheet2) b.sheet = b.def.sheet2; yield; }
    },
    // --- Tusk ---
    *tuskSwing(b, G) {
      yield* approach(b, G, 50, 70, 1.6);
      yield* tele(b, b.phase === 2 ? 22 : 30, 'a4', 0);
      b.setPose('a4', 1); SW.audio.sfx('heavy'); b.vx = b.face * 2; fx.slash(b.x + b.face * 22, b.y - 34, b.face, 1, '#ffd0d0', 46);
      const hs = new Set();
      for (let i = 0; i < 8; i++) { b.hitFront(G, 62, 64, b.def.dmg, hs, { kx: 5, ky: -3, heavy: true }); b.vx *= 0.8; yield; }
      fx.dust(b.x + b.face * 44, b.y, 8); fx.shake(4, 8);
      b.setPose('a4', 2); yield* wait(b.phase === 2 ? 24 : 34);
    },
    *tuskCharge(b, G) {
      b.faceTo(G.player);
      yield* tele(b, 40, 'special', 0);
      SW.audio.sfx('roar');
      const hs = new Set(), sp = 4.4 * (b.phase === 2 ? 1.25 : 1);
      for (let i = 0; i < 100; i++) {
        b.vx = b.face * sp; b.setPose('dash', 0);
        if (i % 3 === 0) fx.dust(b.x - b.face * 12, b.y, 2);
        b.hitBody(G, b.def.dmg + 2, hs, { kx: 6, ky: -4, heavy: true, unblockable: true });
        yield;
        if (b.hitWall) { fx.shake(8, 16); SW.audio.sfx('explode'); fx.debris(b.x + b.face * 14, b.y - 30, '#8a92a8', 12); b.vx = -b.face * 2; b.vy = -2.5; b.stun = 96; G.toast('Tusk is dazed - hit him!'); return; }
      }
      b.vx = 0; b.setPose('idle', 0); yield* wait(22);
    },
    *tuskSlam(b, G, z) {
      const p = G.player; b.faceTo(p);
      yield* tele(b, 24, 'launcher', 0);
      b.vy = -7.6; b.vx = SW.clamp((p.x - b.x) / 34, -3.4, 3.4); b.setPose('jump', 0); SW.audio.sfx('jump');
      yield;
      for (let i = 0; i < 100 && !b.onGround; i++) { if (b.vy > 0) b.setPose('a4', 1); yield; }
      b.vx = 0; fx.shake(8, 14); SW.audio.sfx('explode'); fx.dust(b.x, b.y, 12);
      SW.strike(G, { team: 'enemy', x: b.x - 34, y: b.y - 30, w: 68, h: 30, dmg: b.def.dmg, kx: 5, ky: -4, heavy: true, hitSet: new Set(), srcX: b.x, src: b });
      for (const s of [-1, 1]) z.shots.push(new SW.Shot({ kind: 'shock', team: 'enemy', x: b.x + s * 22, y: b.y - 5, fy: b.y, vx: s * 3.6, dmg: 9, life: 60, w: 14, h: 12, col: '#c8ccd8', kx: 3, ky: -3 }));
      b.setPose('a4', 2); yield* wait(38);
    },
    // --- Warden-01 ---
    *wardenBeam(b, G, z, high) {
      b.faceTo(G.player);
      const by = high ? b.y - 62 : b.y - 18;
      b.aim = { y: by }; yield* tele(b, b.phase === 2 ? 30 : 44, 'tele', 0);
      b.aim = null; b.beam = { y: by, t: 0 }; b.setPose('atk', 0); SW.audio.sfx('zap'); SW.audio.sfx('explode'); fx.shake(4, 16);
      const hs = new Set(), x0 = b.face > 0 ? b.x + 24 : b.x - 24 - 460;
      for (let i = 0; i < 16; i++) { b.beam.t = i; SW.strike(G, { team: 'enemy', x: x0, y: by - 6, w: 460, h: 12, dmg: b.def.dmg, kx: 4, ky: -2, hitSet: hs, srcX: b.x, src: b }); yield; }
      b.beam = null; b.setPose('idle', 0); yield* wait(high ? 20 : 30);
    },
    *wardenCombo(b, G, z) { yield* M.wardenBeam(b, G, z, false); yield* M.wardenBeam(b, G, z, true); },
    *wardenOrbs(b, G, z) {
      const p = G.player; b.faceTo(p);
      yield* tele(b, 26, 'tele', 0);
      for (let i = 0, n = b.phase === 2 ? 5 : 3; i < n; i++) {
        b.setPose('atk', 0); b.faceTo(p);
        const ox = b.x + b.face * 46, oy = b.y - 52, dx = p.x - ox, dy = p.y - 16 - oy, m = Math.hypot(dx, dy) || 1;
        z.shots.push(new SW.Shot({ kind: 'orb', team: 'enemy', x: ox, y: oy, vx: dx / m * 2.8, vy: dy / m * 2.8, dmg: 7, life: 160, w: 8, h: 8, col: '#ff5a5a', ghost: false })); SW.audio.sfx('shoot');
        yield* wait(16);
      }
      b.setPose('idle', 0); yield* wait(32);
    },
    *wardenStomp(b, G, z) {
      yield* approach(b, G, 70, 70, 1.6);
      yield* tele(b, 22, 'tele', 0);
      b.setPose('atk', 0); fx.shake(8, 14); SW.audio.sfx('explode'); fx.dust(b.x, b.y, 14);
      SW.strike(G, { team: 'enemy', x: b.x - 56, y: b.y - 34, w: 112, h: 34, dmg: b.def.dmg, kx: 5, ky: -4, heavy: true, hitSet: new Set(), srcX: b.x, src: b });
      for (const s of [-1, 1]) z.shots.push(new SW.Shot({ kind: 'shock', team: 'enemy', x: b.x + s * 40, y: b.y - 5, fy: b.y, vx: s * 3.4, dmg: 7, life: 70, w: 14, h: 12, col: '#6fd3e8', kx: 3, ky: -3 }));
      b.setPose('idle', 0); yield* wait(40);
    },
    // --- Grist ---
    *gristLunge(b, G, z, again) {
      b.faceTo(G.player);
      yield* tele(b, again ? 14 : 26, 'special', 0);
      SW.audio.sfx('dash');
      const hs = new Set();
      for (let i = 0; i < 20; i++) {
        b.vx = b.face * 7; b.setPose('dash', 0);
        if (i % 2 === 0) fx.ghost(b.sheet, 'dash', 0, b.x, b.y, b.face < 0);
        b.hitFront(G, 34, 42, b.def.dmg, hs, { kx: 5, ky: -2.6, heavy: true, unblockable: true });
        yield;
        if (b.hitWall) break;
      }
      b.vx = 0; b.setPose('a4', 2); yield* wait(b.phase === 2 && !again ? 12 : 30);
      if (b.phase === 2 && !again) yield* M.gristLunge(b, G, z, true);
    },
    *gristRats(b, G, z) {
      yield* tele(b, 30, 'cheer', 0);
      SW.audio.sfx('roar');
      const alive = z.ents.filter(e => e.type === 'rat' && !e.dead && e.x > b.ax0 && e.x < b.ax1).length, n = Math.min(b.phase === 2 ? 3 : 2, 4 - alive);
      for (let i = 0; i < n; i++) { const ex = b.ax0 + 30 + Math.random() * (b.ax1 - b.ax0 - 60), r = new Enemy('rat', ex, b.y - 70); r.state = 'chase'; z.add(r); fx.spark(ex, b.y - 70, '#5cff7a', 8); }
      yield* wait(28);
    },
    *gristFlasks(b, G, z) {
      const p = G.player;
      for (let i = 0, n = b.phase === 2 ? 4 : 3; i < n; i++) {
        b.faceTo(p); yield* tele(b, 14, 'cast', 0);
        b.setPose('cast', 1);
        z.shots.push(new SW.Shot({ kind: 'flask', team: 'enemy', x: b.x + b.face * 8, y: b.y - 34, vx: (p.x + SW.rand(-34, 34) - b.x) / 46, vy: -5.2, g: 0.24, dmg: 10, life: 130, w: 6, h: 6, col: '#5cff7a' })); SW.audio.sfx('swing');
        yield* wait(12);
      }
      b.setPose('idle', 0); yield* wait(26);
    },
    *gristCombo(b, G) {
      yield* approach(b, G, 40, 60, 1.7);
      yield* tele(b, 16, 'a1', 0); b.setPose('a1', 1); SW.audio.sfx('swing'); b.vx = b.face * 2; fx.slash(b.x + b.face * 16, b.y - 26, b.face, 1, '#d8ffd0', 34);
      let hs = new Set(); for (let i = 0; i < 6; i++) { b.hitFront(G, 48, 46, b.def.dmg - 3, hs, { kx: 3 }); yield; }
      yield* wait(8); b.faceTo(G.player);
      yield* tele(b, 14, 'a4', 0); b.setPose('a4', 1); SW.audio.sfx('heavy'); b.vx = b.face * 2.5; fx.slash(b.x + b.face * 18, b.y - 28, b.face, 2, '#d8ffd0', 38);
      hs = new Set(); for (let i = 0; i < 8; i++) { b.hitFront(G, 54, 52, b.def.dmg, hs, { kx: 5, ky: -3, heavy: true }); b.vx *= 0.8; yield; }
      b.setPose('a4', 2); yield* wait(32);
    },
    // --- Captain Brandt ---
    *brandtThrust(b, G, z) {
      b.faceTo(G.player);
      yield* tele(b, b.phase === 2 ? 18 : 24, 'special', 0);
      SW.audio.sfx('dash'); fx.slash(b.x + b.face * 20, b.y - 22, b.face, 3, '#ffb060', 50);
      const hs = new Set();
      for (let i = 0; i < 16; i++) {
        b.vx = b.face * 8.2; b.setPose('special', 1);
        if (i % 2 === 0) fx.ghost(b.sheet, 'special', 1, b.x, b.y, b.face < 0);
        b.hitFront(G, 46, 32, b.def.dmg, hs, { kx: 5, ky: -2, heavy: true, unblockable: true });
        if (b.phase === 2 && i % 4 === 1) z.add(new SW.Puddle(b.x, b.y - 4, 24, 120, 8, '#ff8a3a'));
        yield;
        if (b.hitWall) break;
      }
      b.vx = 0; b.setPose('special', 2); yield* wait(b.phase === 2 ? 20 : 30);
    },
    *brandtTriple(b, G) {
      yield* approach(b, G, 52, 50, 1.8);
      for (let k = 0; k < 3; k++) {
        const an = k === 2 ? 'a4' : 'a1';
        b.faceTo(G.player); yield* tele(b, k ? 9 : 16, an, 0);
        b.setPose(an, 1); b.vx = b.face * 3.2; SW.audio.sfx('swing'); fx.slash(b.x + b.face * 18, b.y - 24, b.face, k === 1 ? 2 : 1, '#ffb060', 40);
        const hs = new Set();
        for (let i = 0; i < 6; i++) { b.hitFront(G, 56, 50, b.def.dmg - 4, hs, { kx: k === 2 ? 5 : 2, ky: k === 2 ? -3 : 0, heavy: k === 2 }); b.vx *= 0.8; yield; }
        yield* wait(6);
      }
      b.setPose('a4', 2); yield* wait(30);
    },
    *brandtCrescent(b, G, z) {
      const p = G.player; b.faceTo(p);
      yield* tele(b, 12, 'launcher', 0);
      b.vy = -6.6; b.vx = -b.face * 2.2; b.setPose('jump', 0); SW.audio.sfx('jump');
      yield;
      for (let i = 0; i < 40 && b.vy < 0; i++) yield;
      b.faceTo(p); b.setPose('a4', 1); SW.audio.sfx('swing');
      const ox = b.x + b.face * 10, oy = b.y - 22, base = Math.atan2(p.y - 16 - oy, p.x - ox), n = b.phase === 2 ? 3 : 1;
      for (let i = 0; i < n; i++) { const a = base + (i - (n - 1) / 2) * 0.32; z.shots.push(new SW.Shot({ kind: 'crescent', team: 'enemy', x: ox, y: oy, vx: Math.cos(a) * 4.2, vy: Math.sin(a) * 4.2, dmg: 11, life: 90, w: 10, h: 12, col: '#ff8a3a' })); }
      for (let i = 0; i < 90 && !b.onGround; i++) yield;
      b.vx = 0; b.setPose('idle', 0); yield* wait(24);
    }
  };
  const PICK = {
    tusk: (b, d) => [[d < 100 ? 3 : 1, M.tuskSwing], [d > 60 ? 3 : 1, M.tuskCharge], [b.phase === 2 ? 3 : 0, M.tuskSlam]],
    warden: (b, d) => [[b.phase === 2 ? 1 : 3, (bb, G, z) => M.wardenBeam(bb, G, z, false)], [b.phase === 2 ? 0 : 1, (bb, G, z) => M.wardenBeam(bb, G, z, true)], [b.phase === 2 ? 3 : 0, M.wardenCombo], [2, M.wardenOrbs], [d < 130 ? 3 : 1, M.wardenStomp]],
    grist: (b, d) => [[d > 50 ? 3 : 1, M.gristLunge], [2, M.gristRats], [d > 70 ? 3 : 1, M.gristFlasks], [d < 110 ? 3 : 1, M.gristCombo]],
    brandt: (b, d) => [[d > 60 ? 3 : 1, M.brandtThrust], [d < 120 ? 3 : 1, M.brandtTriple], [2, M.brandtCrescent]]
  };

  class Boss extends Enemy {
    constructor(type, x, y, o) { super(type, x, y, o); Object.assign(this, { isBoss: true, phase: 1, gen: null, idleT: 50, poise: 0, state: 'chase', last: null }); }
    spd() { return this.def.speed * (this.phase === 2 ? 1.25 : 1); }
    faceTo(p) { this.face = p.x >= this.x ? 1 : -1; }
    setPose(a, f) { this.forcePose = [a, f || 0]; }
    superArmor() { return true; }
    stagger(n) { if (!this.dead && !this.gen) this.stun = Math.max(this.stun, Math.min(n, 70)); }
    hitFront(G, reach, height, dmg, hs, ex) { return SW.strike(G, Object.assign({ team: 'enemy', x: this.face > 0 ? this.x - 6 : this.x + 6 - reach, y: this.y - height, w: reach, h: height, dmg, kx: 3, hitSet: hs, srcX: this.x, src: this }, ex || {})); }
    hitBody(G, dmg, hs, ex) { const b = this.box(); return SW.strike(G, Object.assign({ team: 'enemy', x: b.x - 3, y: b.y, w: b.w + 6, h: b.h, dmg, kx: 4, hitSet: hs, srcX: this.x - this.face * 10, src: this }, ex || {})); }
    takeHit(atk, G) {
      if (this.dead || this.invuln > 0 || this.dormant) return 'none';
      // a duelist parries every few plain hits while he is not attacking; skills and heavy blows get through
      if (this.def.parry && !this.gen && this.stun < 40 && !atk.energy && !atk.heavy && !atk.launch && ++this.hits % this.def.parry === 0) { this.blockT = 12; this.poise++; fx.text(this.x, this.y - this.h - 6, 'PARRY', '#ffe0a0'); return 'block'; }
      this.hp -= atk.dmg; this.flashT = 5; atk.dealt = atk.dmg;
      if (!this.gen && !this.def.heavy && this.stun < 12) { this.stun = Math.max(this.stun, 9); this.vx = (atk.kx || 0) * 0.25; this.poise++; }
      if (this.hp <= 0) { this.gen = null; this.beam = null; this.aim = null; this.die(G, atk); G.hitstop = 22; fx.flash('#ffffff', 14); fx.shake(10, 40); SW.audio.sfx('explode'); }
      return 'hit';
    }
    think(G, z, p) {
      if (this.phase === 1 && this.hp <= this.hpMax / 2 && this.def.boss) { this.phase = 2; this.gen = M.phase(this, G, z); this.beam = null; this.aim = null; this.tele = 0; }
      if (!this.gen) {
        this.forcePose = null; this.faceTo(p);
        const d = Math.abs(p.x - this.x);
        this.vx = d > 130 && this.groundAhead(z, this.face) ? this.face * this.spd() : 0;
        if (this.poise >= 5) { this.poise = 0; this.stun = 0; this.gen = M.counter(this, G, z); }
        else if (--this.idleT <= 0) {
          const opts = PICK[this.def.boss](this, d).filter(o => o[0] > 0 && (o[1] !== this.last || Math.random() < 0.3));
          let r = Math.random() * opts.reduce((s, o) => s + o[0], 0), pick = opts[0];
          for (const o of opts) { r -= o[0]; if (r <= 0) { pick = o; break; } }
          this.last = pick[1]; this.gen = pick[1](this, G, z); this.poise = 0;
        }
      }
      if (this.gen) {
        const r = this.gen.next();
        if (r.done) { this.gen = null; this.forcePose = null; this.idleT = (this.def.idle || 30) * (this.phase === 2 ? 0.6 : 1) + Math.random() * 16; }
      }
    }
    draw(ctx, cam, G) {
      super.draw(ctx, cam, G);
      const y = this.aim ? this.aim.y : this.beam ? this.beam.y : null;
      if (y === null) return;
      const sx = Math.round(this.x - cam.x + this.face * 30), sy = Math.round(y - cam.y), x0 = this.face > 0 ? sx : 0, w = this.face > 0 ? SW.W - sx : sx;
      if (this.aim) { if (SW.frame % 4 < 2) for (let i = 0; i < w; i += 8) art.rect(ctx, '#ff5a5a', x0 + i, sy, 4, 1); }
      else {
        const k = this.beam.t < 3 ? this.beam.t + 1 : this.beam.t > 12 ? 16 - this.beam.t : 4;
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5; art.rect(ctx, '#ff5a5a', x0, sy - k * 2, w, k * 4); ctx.restore();
        art.rect(ctx, '#ffb0b0', x0, sy - k, w, k * 2); art.rect(ctx, '#ffffff', x0, sy - Math.max(1, k / 2), w, Math.max(2, k));
      }
    }
  }
  SW.Enemy = Enemy; SW.Boss = Boss;
  SW.spawnEnemy = (type, x, y, o) => (SW.data.enemies[type].boss ? new Boss(type, x, y, o) : new Enemy(type, x, y, o));
})();
