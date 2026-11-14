'use strict';
// Shattered Worlds — physics, hit resolution, the player state machine, projectiles and summons.
(function () {
  const SW = window.SW, art = SW.art, fx = SW.fx, I = SW.input, T = 16;
  const GRAV = 0.42, MAXFALL = 7.5, JUMP = -6.8, DJUMP = -6.0, DASH = 5.8, DASHF = 11;
  SW.GRAV = GRAV;

  // ---------- shared physics ----------
  SW.move = function (a, z) {
    a.hitWall = 0;
    a.x += a.vx;
    if (z.hit(a.x - a.w / 2, a.y - a.h, a.w, a.h)) {
      const s = Math.sign(a.vx) || 1;
      a.x = Math.round(a.x);
      let n = 0;
      while (z.hit(a.x - a.w / 2, a.y - a.h, a.w, a.h) && n++ < 24) a.x -= s;
      a.hitWall = s; a.vx = 0;
    }
    const py = a.y;
    a.onGround = false;
    a.y += a.vy;
    if (z.hit(a.x - a.w / 2, a.y - a.h, a.w, a.h)) {
      const s = Math.sign(a.vy) || 1;
      a.y = s > 0 ? Math.floor(a.y) : Math.ceil(a.y);
      let n = 0;
      while (z.hit(a.x - a.w / 2, a.y - a.h, a.w, a.h) && n++ < 24) a.y -= s;
      if (s > 0) a.onGround = true;
      a.vy = 0;
    } else if (a.vy >= 0 && !(a.drop > 0)) {
      const ty = Math.floor(a.y / T), top = ty * T;
      if (py <= top + 0.01 && a.y >= top) {
        for (let tx = Math.floor((a.x - a.w / 2) / T); tx <= Math.floor((a.x + a.w / 2 - 0.001) / T); tx++) {
          const c = z.tile(tx, ty);
          if (c === '=' || (c === 'H' && z.tile(tx, ty - 1) !== 'H')) { a.y = top; a.vy = 0; a.onGround = true; a.onPlat = true; break; }
        }
      }
    }
  };
  const hitRect = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  // atk: { team, x, y, w, h, dmg, kx, ky, stun, heavy, down, launch, energy, breaker, hitSet, srcX, src, unblockable, quiet }
  SW.strike = function (G, atk) {
    const z = G.zone;
    let n = 0;
    if (atk.team === 'player') {
      for (const e of z.ents) {
        if (!e.hittable || e.dead || e.gone || atk.hitSet.has(e)) continue;
        const b = e.box();
        if (!hitRect(atk, b)) continue;
        atk.hitSet.add(e);
        const r = e.takeHit(atk, G);
        if (r === 'hit') { n++; G.onHit(atk, e, b); }
        else if (r === 'block') { SW.audio.sfx('block'); G.hitstop = Math.max(G.hitstop, 2); fx.spark((Math.max(atk.x, b.x) + Math.min(atk.x + atk.w, b.x + b.w)) / 2, (Math.max(atk.y, b.y) + Math.min(atk.y + atk.h, b.y + b.h)) / 2, '#c8ccd8', 4, 2); }
      }
    } else {
      const p = G.player;
      if (!p || p.dead || atk.hitSet.has(p)) return 0;
      if (hitRect(atk, p.box())) { atk.hitSet.add(p); atk.result = p.takeHit(atk, G); if (atk.result !== 'none') n++; }
    }
    return n;
  };

  // ---------- projectiles ----------
  class Shot {
    constructor(o) { Object.assign(this, { vx: 0, vy: 0, g: 0, team: 'enemy', dmg: 5, life: 90, w: 8, h: 4, kind: 'bullet', col: '#f5c542', t: 0, hitSet: new Set() }, o); }
    update(G, z) {
      this.t++; this.vy += this.g; this.x += this.vx; this.y += this.vy;
      if (--this.life <= 0) { this.end(G, z, false); return; }
      if (this.kind === 'wave' || this.kind === 'shock') {
        // hug the ground
        let gy = null;
        for (let d = -10; d <= 22; d += 2) if (z.hit(this.x - 2, this.fy + d, 4, 2, true)) { gy = this.fy + d; break; }
        if (gy === null || gy < this.fy - 9) { this.end(G, z, true); return; }
        this.fy = Math.floor(gy / 2) * 2; this.y = this.fy - this.h / 2;
        if (z.hit(this.x - 2, this.fy - 12, 4, 8, true) && !this.breaker) { this.end(G, z, true); return; }
        if (this.t % 2 === 0) fx.list.push({ k: 'p', x: this.x, y: this.fy - Math.random() * this.h, vx: -this.vx * 0.2, vy: -Math.random(), g: 0.05, life: 14, max: 14, col: this.col, s: 2 });
      }
      const bx = this.x - this.w / 2, by = this.y - this.h / 2;
      if (!this.ghost && this.kind !== 'wave' && this.kind !== 'shock' && z.hit(bx, by, this.w, this.h, true)) { this.end(G, z, true); return; }
      const n = SW.strike(G, { team: this.team, x: bx, y: by, w: this.w, h: this.h, dmg: this.dmg, kx: (this.kx === undefined ? 2 : this.kx) * (Math.sign(this.vx) || 1), ky: this.ky, stun: this.stun || 18, energy: this.energy, breaker: this.breaker, heavy: this.heavy, down: this.down, hitSet: this.hitSet, srcX: this.x - this.vx * 4, quiet: true });
      if (this.kind === 'wave' && this.breaker && z.hit(this.x - 2, this.fy - 12, 4, 8, true)) { this.end(G, z, true); return; }
      if (n && !this.pierce) this.end(G, z, true);
    }
    end(G, z, impact) {
      this.gone = true;
      if (impact) { fx.spark(this.x, this.y, this.col, 6, 2); if (this.kind === 'orb' || this.kind === 'flask') SW.audio.sfx('burst'); }
      if (this.kind === 'flask') z.add(new Puddle(this.x, this.y + 4, 34, 170, this.dmg, this.col));
      if (this.onEnd) this.onEnd(G, z, this);
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), d = Math.sign(this.vx) || 1;
      if (this.kind === 'dart') { art.rect(ctx, this.col, x - 6 * d - (d < 0 ? 0 : 6), y - 1, 12, 2); art.rect(ctx, '#ffffff', x + (d > 0 ? 2 : -6), y - 1, 4, 2); art.glow(ctx, x, y, 8, this.col, 0.16); }
      else if (this.kind === 'bullet') { art.disc(ctx, this.col, x, y, 2); art.rect(ctx, '#ffffff', x - 1, y - 1, 2, 2); art.glow(ctx, x, y, 7, this.col, 0.15); }
      else if (this.kind === 'orb') { art.disc(ctx, this.col, x, y, 4); art.disc(ctx, '#ffffff', x, y, 2); art.glow(ctx, x, y, 12, this.col, 0.16); }
      else if (this.kind === 'flask') { art.rect(ctx, '#8a92a8', x - 2, y - 4, 4, 3); art.disc(ctx, this.col, x, y + 1, 3); }
      else if (this.kind === 'crescent') { for (let i = -6; i <= 6; i++) { const o = Math.round((36 - i * i) / 8); art.rect(ctx, i % 2 ? '#ffe0a0' : this.col, x + (o - 2) * d, y + i, 3, 1); } art.glow(ctx, x, y, 12, this.col, 0.14); }
      else if (this.kind === 'wave') { const fy = Math.round(this.fy - cam.y); for (let i = 0; i < 3; i++) { const hh = [18, 34, 24][i], xx = x + (i - 1) * 7 * d; for (let j = 0; j < hh; j += 2) { const w = Math.max(1, Math.round((1 - j / hh) * 6)); art.rect(ctx, j < 6 ? '#ffffff' : this.col, xx - w / 2, fy - j - 2, w, 2); } } art.glow(ctx, x, fy - 14, 18, this.col, 0.14); }
      else if (this.kind === 'shock') { const fy = Math.round(this.fy - cam.y); art.rect(ctx, this.col, x - 6, fy - 6, 12, 6); art.rect(ctx, '#ffffff', x - 3, fy - 10, 6, 4); }
    }
  }
  class Puddle {
    constructor(x, y, w, life, dmg, col) { Object.assign(this, { x, y, w, life, dmg, col, t: 0, settled: false }); }
    update(G, z) {
      this.t++;
      if (!this.settled) { let n = 0; while (!z.hit(this.x - 2, this.y, 4, 2, true) && n++ < 40) this.y += 2; this.settled = true; }
      if (--this.life <= 0) { this.gone = true; return; }
      const p = G.player;
      if (p && this.t % 16 === 0 && p.onGround && Math.abs(p.x - this.x) < this.w / 2 + 4 && Math.abs(p.y - this.y) < 8) SW.strike(G, { team: 'enemy', x: this.x - this.w / 2, y: this.y - 8, w: this.w, h: 10, dmg: Math.ceil(this.dmg * 0.5), kx: 0.5, ky: -1, hitSet: new Set(), srcX: this.x, unblockable: true });
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y), a = Math.min(1, this.life / 30);
      ctx.globalAlpha = a; art.rect(ctx, this.col, x - this.w / 2, y - 3, this.w, 3); art.rect(ctx, '#eafff0', x - this.w / 2 + 3, y - 4, this.w - 6, 1);
      if (this.t % 10 < 5) art.rect(ctx, '#eafff0', x - this.w / 2 + ((this.t * 7) % this.w), y - 6, 2, 2);
      ctx.globalAlpha = 1;
    }
  }
  class Totem {
    constructor(x, y, dmg) { Object.assign(this, { x, y, dmg, life: 480, t: 0 }); }
    update(G, z) {
      this.t++;
      if (--this.life <= 0) { this.gone = true; fx.spark(this.x, this.y - 12, '#ffa726', 8); return; }
      if (this.t % 42 === 20) {
        let best = null, bd = 130;
        for (const e of z.ents) if (e.hittable && e.team === 'enemy' && !e.dead) { const d = Math.hypot(e.x - this.x, e.y - this.y); if (d < bd) { bd = d; best = e; } }
        if (best) {
          const b = best.box();
          fx.bolt(this.x, this.y - 22, b.x + b.w / 2, b.y + b.h / 2, '#ffd24a'); SW.audio.sfx('zap');
          const atk = { team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg: this.dmg, kx: 0, stun: 14, energy: true, hitSet: new Set(), srcX: this.x, quiet: true };
          if (best.takeHit(atk, G) === 'hit') G.onHit(atk, best, b);
        }
      }
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      art.rect(ctx, '#6b5234', x - 2, y - 20, 4, 20); art.rect(ctx, '#8a6c46', x - 2, y - 20, 1, 20); art.rect(ctx, '#3a2c1c', x - 4, y - 14, 8, 2); art.rect(ctx, '#3a2c1c', x - 3, y - 8, 6, 1);
      art.rect(ctx, '#ffd24a', x - 3, y - 25, 6, 5); art.rect(ctx, '#ffffff', x - 1, y - 24, 2, 3);
      art.glow(ctx, x, y - 22, 12 + Math.sin(this.t * 0.2) * 3, '#ffa726', 0.16);
      if (this.life < 90 && this.t % 8 < 4) art.rect(ctx, '#0a0a12', x - 2, y - 20, 4, 20);
    }
  }
  class Helper {   // assist ally who pops in beside the player
    constructor(sheet, x, y, face) { Object.assign(this, { sheet, x, y, face, t: 0 }); }
    update() { if (++this.t > 80) this.gone = true; }
    draw(ctx, cam) { art.draw(ctx, this.sheet, 'cheer', 0, this.x - cam.x, this.y - cam.y, this.face < 0, { alpha: Math.min(1, this.t / 8, (80 - this.t) / 10) }); }
  }
  Object.assign(SW, { Shot, Puddle, Totem, Helper });

  // ---------- player ----------
  class Player {
    constructor(G, x, y) {
      Object.assign(this, { G, x, y, vx: 0, vy: 0, w: 10, h: 30, face: 1, onGround: false, team: 'player', state: 'idle', st: 0, t: 0, runT: 0,
        invuln: 0, iframes: 0, dashCd: 0, airDash: false, airJumps: 0, coyote: 0, drop: 0, combo: 0, comboT: 0, airCombo: 0, atk: null, hitSet: new Set(), connected: false, dashCancel: true,
        guardT: 0, modeT: 0, awakeT: 0, assistCd: 0, dead: false, deadT: 0, safeX: x, safeY: y, denyT: 0, wallT: 0 });
    }
    box() { return { x: this.x - this.w / 2, y: this.y - this.h, w: this.w, h: this.h }; }
    hpMax() { const S = this.G.state; return 100 + 12 * (S.level - 1) + (S.hpBonus || 0) + 15 * this.G.upg('vital'); }
    dmgMul() { const S = this.G.state; return (1 + 0.06 * S.stats.power) * (this.awakeT > 0 ? 1.4 : 1) * (this.modeT > 0 && this.G.hero().modeKind !== 'speed' ? 1.3 : 1) * (1 + 0.03 * Math.floor(S.minor / 5)); }
    speed() { const S = this.G.state; return (2.05 + 0.05 * S.stats.speed) * (this.modeT > 0 && this.G.hero().modeKind === 'speed' ? 1.25 : 1) * (this.awakeT > 0 ? 1.1 : 1); }
    sheet() { const G = this.G, h = G.hero(); return this.awakeT > 0 ? h.sheetAw : (h.sheetArmed && G.has('winterline') ? h.sheetArmed : h.sheet); }
    comboSet() { const G = this.G, h = G.hero(); return SW.data.combat[h.comboArmed && G.has('winterline') ? h.comboArmed : h.combo]; }
    heal(n) { const S = this.G.state; S.hp = Math.min(this.hpMax(), S.hp + n); fx.text(this.x, this.y - 40, '+' + Math.round(n), '#7dffa0'); }
    enter(s) { this.state = s; this.st = 0; }
    spend(n) {
      const S = this.G.state;
      if (S.energy < n) { if (this.denyT <= 0) { SW.audio.sfx('deny'); this.G.toast('Not enough ' + this.G.hero().energy + ' - hold J + K to charge'); this.denyT = 50; } return false; }
      S.energy -= n; return true;
    }
    // called while a dialogue / cutscene is on screen
    settle(z) {
      this.vx *= 0.7; this.vy = Math.min(MAXFALL, this.vy + GRAV); SW.move(this, z);
      if (!this.dead && this.onGround && ['hurt', 'climb', 'awaken'].indexOf(this.state) < 0) this.enter('idle');
      this.t++;
    }
    startAttack(def, air) {
      this.atk = def; this.enter(air ? 'airatk' : 'attack'); this.hitSet = new Set(); this.connected = false;
      SW.audio.sfx('swing');
      if (!air) this.vx = this.face * 1.6;
    }
    update(G, z) {
      const S = G.state, hero = G.hero(), dir = (I.held('right') ? 1 : 0) - (I.held('left') ? 1 : 0);
      this.t++; this.st++;
      if (this.invuln > 0) this.invuln--; if (this.iframes > 0) this.iframes--; if (this.dashCd > 0) this.dashCd--; if (this.drop > 0) this.drop--;
      if (this.denyT > 0) this.denyT--; if (this.assistCd > 0) this.assistCd--; if (this.modeT > 0) this.modeT--;
      if (this.comboT > 0 && --this.comboT === 0) this.combo = 0;
      if (this.awakeT > 0) { this.awakeT--; S.awaken = 100 * this.awakeT / (this.awakeMax || 900); if (this.awakeT === 0) { fx.ring(this.x, this.y - 16, hero.color, 6, 40, 20); SW.audio.sfx('back'); } }
      if (this.dead) { this.deadT++; this.vx *= 0.9; this.vy = Math.min(MAXFALL, this.vy + GRAV); SW.move(this, z); if (this.deadT === 110) G.respawn(); return; }
      S.energy = Math.min(300, S.energy + 0.035 * (1 + 0.15 * S.stats.energy) * (1 + 0.1 * Math.floor(S.minor / 5)));
      let grav = true;
      // Slipstep (S + L or W + L): a short intangible blink that also works as an escape while being hit or guarding
      if ((I.held('down') || I.held('up')) && I.buffered('dash', 5) && S.energy >= 60 && ['slip', 'awaken', 'ult', 'climb', 'rush'].indexOf(this.state) < 0) {
        I.consume('dash'); S.energy -= 60; this.startSlip(I.held('up'));
      }
      const st = this.state;
      const free = st === 'idle' || st === 'run' || st === 'jump' || st === 'fall';

      if (free || st === 'guard') {
        // --- movement ---
        const guard = st === 'guard';
        if (dir && !guard) this.face = dir;
        const target = guard ? 0 : dir * this.speed(), acc = this.onGround ? 0.5 : 0.34;
        this.vx += SW.clamp(target - this.vx, -acc, acc);
        if (this.onGround) { this.coyote = 6; this.airJumps = 0; this.airDash = false; this.airCombo = 0; } else if (this.coyote > 0) this.coyote--;
        // ladder
        const onLadder = z.tile(Math.floor(this.x / T), Math.floor((this.y - 10) / T)) === 'H', ladderBelow = z.tile(Math.floor(this.x / T), Math.floor((this.y + 2) / T)) === 'H';
        if ((I.held('up') && onLadder) || (I.held('down') && ladderBelow && this.onGround && !onLadder && !I.held('attack'))) {
          this.enter('climb'); this.x = Math.floor(this.x / T) * T + 8; this.vx = 0; this.vy = 0; if (!onLadder) this.y += 4;
          return;
        }
        // jump
        if (I.buffered('jump', 6) && !I.held('attack')) {
          const below = z.tile(Math.floor(this.x / T), Math.floor((this.y + 1) / T));
          if (I.held('down') && this.onGround && (below === '=' || below === 'H')) { this.drop = 12; this.y += 2; this.onGround = false; I.consume('jump'); this.enter('fall'); }
          else if (this.onGround || this.coyote > 0) { this.vy = JUMP; this.coyote = 0; I.consume('jump'); SW.audio.sfx('jump'); fx.dust(this.x, this.y, 4); this.enter('jump'); }
          else {
            const maxAir = (G.has('double_jump') ? 1 : 0) + (G.has('frost_steps') ? 2 : 0);
            if (this.airJumps < maxAir) {
              this.vy = DJUMP; this.airJumps++; I.consume('jump'); SW.audio.sfx('djump'); fx.ring(this.x, this.y, hero.color, 3, 14, 12);
              if (G.has('frost_steps') && this.airJumps > (G.has('double_jump') ? 1 : 0)) for (let i = -8; i <= 8; i += 4) fx.list.push({ k: 'p', x: this.x + i, y: this.y, vx: 0, vy: 0.3, g: 0.02, life: 18, max: 18, col: '#bfefff', s: 3 });
              this.enter('jump');
            }
          }
        }
        if (!I.held('jump') && this.vy < -2.6 && this.state === 'jump') this.vy = -2.6;
        // wall cling (Magnet Grip)
        if (G.has('magnet_grip') && !this.onGround && dir && this.hitWallLast === dir && this.vy > -1) {
          this.vy = I.held('up') ? -1.3 : I.held('down') ? 1.6 : Math.min(this.vy, 0.5); grav = false; this.wallT = 3; this.airJumps = 0; this.airDash = false;
          if (I.buffered('jump', 6)) { this.vy = JUMP * 0.92; this.vx = -dir * 3.4; this.face = -dir; I.consume('jump'); SW.audio.sfx('jump'); }
        }
        // actions
        if (I.buffered('dash', 5) && this.dashCd <= 0 && (this.onGround || !this.airDash)) { I.consume('dash'); this.startDash(dir); return; }
        const chargeHeld = (I.held('attack') && I.held('jump')) || I.held('charge');
        if (chargeHeld && this.onGround) { this.enter('charge'); I.consume('attack'); I.consume('jump'); return; }
        if (I.buffered('attack', 7)) {
          I.consume('attack');
          const C = SW.data.combat;
          if (!this.onGround) { if (this.airCombo < 3) { this.startAttack(C.air[this.airCombo], true); this.airCombo++; } }
          else if (I.held('up')) this.startAttack(C.launcher);
          else if (I.held('down')) this.startAttack(C.sweep);
          else { this.startAttack(this.comboSet()[0]); this.combo = 1; this.dashCancel = true; }
          return;
        }
        if (I.buffered('skill', 6)) { I.consume('skill'); this.useSkill(I.held('down')); return; }
        if (I.buffered('special', 6)) { I.consume('special'); this.useSpecial(); return; }
        if (I.hit('awaken')) { this.useAwaken(); return; }
        if (I.hit('item')) this.useItem();
        // guard
        const wantGuard = this.onGround && ((I.held('down') && !dir && !ladderBelow) || I.held('guard'));
        if (wantGuard && !guard) { this.enter('guard'); this.guardT = 0; }
        else if (guard) { this.guardT++; if (!wantGuard) this.enter('idle'); }
        else if (this.onGround) this.state = Math.abs(this.vx) > 0.3 || dir ? 'run' : 'idle';
        else this.state = this.vy < 0 ? 'jump' : 'fall';
      } else if (st === 'attack') {
        const a = this.atk;
        this.vx *= 0.8;
        if (this.st >= a.hitAt && this.st <= a.hitEnd) {
          if (this.st === a.hitAt && a.slash) fx.slash(this.x + this.face * 10, this.y - 20, this.face, a.slash, hero.colorHi, a.box[2] * 0.62);
          if (this.hit(a)) this.connected = true;
        }
        if (this.st > a.hitEnd || (this.connected && this.st > a.hitAt + 2)) {
          // cancel a normal into a skill or special (combo: J J J > U > I)
          if (I.buffered('skill', 8)) { I.consume('skill'); if (dir) this.face = dir; this.enter('idle'); this.useSkill(I.held('down')); if (this.state !== 'idle') return; this.enter('attack'); this.st = a.hitEnd + 1; }
          if (I.buffered('special', 8)) { I.consume('special'); if (dir) this.face = dir; this.enter('idle'); this.useSpecial(); if (this.state !== 'idle') return; this.enter('attack'); this.st = a.hitEnd + 1; }
          if (this.connected && a.launch && I.buffered('jump', 8)) { I.consume('jump'); this.vy = JUMP; this.enter('jump'); SW.audio.sfx('jump'); return; }
          if (this.connected && this.dashCancel && I.buffered('dash', 6) && this.dashCd <= 0) { I.consume('dash'); this.dashCancel = false; this.startDash(dir); return; }
          if (I.buffered('attack', 9) && this.comboSet().indexOf(a) >= 0 && this.combo < 4) {
            I.consume('attack'); if (dir) this.face = dir;
            const C = SW.data.combat;
            if (I.held('up')) this.startAttack(C.launcher); else if (I.held('down')) this.startAttack(C.sweep); else { this.startAttack(this.comboSet()[this.combo]); this.combo++; }
            return;
          }
        }
        if (this.st >= a.dur) { this.enter('idle'); this.comboT = 22; }
      } else if (st === 'airatk') {
        const a = this.atk;
        this.vx += SW.clamp(dir * this.speed() - this.vx, -0.3, 0.3);
        if (this.st >= a.hitAt && this.st <= a.hitEnd) {
          if (this.st === a.hitAt) fx.slash(this.x + this.face * 8, this.y - 16, this.face, a.slash, hero.colorHi, 22);
          if (this.hit(a)) { this.connected = true; if (!a.heavy) this.vy = Math.min(this.vy, -1.6); }
        }
        if (this.onGround) { this.enter('idle'); }
        else if (this.st >= a.dur) this.enter('fall');
        else if (this.st > a.hitEnd && I.buffered('attack', 8) && this.airCombo < 3) { I.consume('attack'); this.startAttack(SW.data.combat.air[this.airCombo], true); this.airCombo++; }
      } else if (st === 'dash') {
        grav = false; this.vy = 0; this.vx = this.face * DASH * (this.modeT > 0 && this.G.hero().modeKind === 'speed' ? 1.25 : 1);
        if (this.st % 2 === 0) fx.ghost(this.sheet(), 'dash', 0, this.x, this.y, this.face < 0);
        if (this.st >= DASHF) { this.vx = this.face * 2; this.enter(this.onGround ? 'idle' : 'fall'); }
      } else if (st === 'charge') {
        this.vx *= 0.6;
        const held = (I.held('attack') && I.held('jump')) || I.held('charge');
        S.energy = Math.min(300, S.energy + 1.25 * (1 + 0.15 * S.stats.energy) * (1 + 0.15 * G.upg('flow')));
        if (this.st % 8 === 0) SW.audio.sfx('charge');
        if (this.st % 2 === 0) { const a = Math.random() * Math.PI * 2, r = 26; fx.list.push({ k: 'p', x: this.x + Math.cos(a) * r, y: this.y - 16 + Math.sin(a) * r, vx: -Math.cos(a) * 1.6, vy: -Math.sin(a) * 1.6, g: 0, life: 14, max: 14, col: hero.color, s: 2 }); }
        if (!held || !this.onGround) { this.enter('idle'); I.consume('attack'); I.consume('jump'); }
      } else if (st === 'cast') {
        if (this.onGround) this.vx *= 0.7;
        if (this.st === 6 && this.castFn) { this.castFn(); this.castFn = null; }
        if (this.st >= 20) this.enter(this.onGround ? 'idle' : 'fall');
      } else if (st === 'rush') {
        if (this.st < 7) { this.vx = 0; grav = this.onGround; this.vy = 0; }
        else if (this.st < 21) {
          grav = false; this.vy = 0; this.vx = this.face * 7.2; this.iframes = 2;
          if (this.st === 7) { SW.audio.sfx('zap'); fx.shake(3, 8); }
          if (this.st % 2 === 0) { fx.ghost(this.sheet(), 'special', 1, this.x, this.y, this.face < 0); fx.bolt(this.x - this.face * 20, this.y - 28 + Math.random() * 20, this.x, this.y - 16, hero.color); }
          this.hit({ box: [-4, -38, 34, 38], dmg: SW.data.abilities.breaker_rush.dmg, kx: 5, ky: -3, stun: 30, heavy: true, down: true, energy: true, breaker: true });
          if (this.hitWall) this.st = 20;
        } else { this.vx *= 0.7; if (this.st >= 30) this.enter(this.onGround ? 'idle' : 'fall'); }
      } else if (st === 'wave') {
        this.vx *= 0.7;
        if (this.st === 9) {
          SW.audio.sfx('burst'); fx.slash(this.x + this.face * 12, this.y - 18, this.face, 1, hero.colorHi, 34); fx.shake(3, 8);
          z.shots.push(new Shot({ kind: 'wave', team: 'player', x: this.x + this.face * 16, y: this.y - 18, fy: this.y, vx: this.face * 5.2, dmg: Math.round(SW.data.abilities.shatterline.dmg * this.specMul()), life: 52, w: 20, h: 36, col: '#bfefff', energy: true, breaker: true, pierce: true, heavy: true, kx: 3, ky: -3, down: true, stun: 30 }));
        }
        if (this.st >= 30) this.enter(this.onGround ? 'idle' : 'fall');
      } else if (st === 'awaken') {
        this.vx = 0; this.vy = 0; grav = false; this.iframes = 2;
        if (this.st >= 34) { this.enter('idle'); }
      } else if (st === 'ult') {
        this.vx = 0; this.vy = 0; grav = false; this.iframes = 2;
        const foes = z.ents.filter(e => e.hittable && e.team === 'enemy' && !e.dead && Math.abs(e.x - G.cam.x - SW.W / 2) < SW.W / 2 + 20);
        if (SW.ultFx && SW.ultFx(this, G, z, foes)) { /* this hero has its own ultimate sequence */ }
        else if (hero.ult !== 'line') {
          if (this.st >= 10 && this.st <= 60 && this.st % 10 === 0) {
            fx.flash(hero.colorHi, 4); fx.shake(5, 6); SW.audio.sfx('zap'); SW.audio.sfx('explode');
            foes.forEach(e => { const b = e.box(); fx.bolt(b.x + b.w / 2 + SW.rand(-30, 30), G.cam.y - 10, b.x + b.w / 2, b.y + b.h / 2, hero.colorHi); const atk = { team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg: Math.round(SW.data.abilities[hero.ultimate].dmg * this.specMul()), kx: 0, ky: -2, stun: 24, energy: true, heavy: true, status: SW.data.abilities[hero.ultimate].status, hitSet: new Set(), quiet: true }; if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); });
          }
        } else if (this.st === 30) {
          fx.flash('#d6f4ff', 10); fx.shake(8, 16); SW.audio.sfx('explode'); SW.audio.sfx('perfect');
          fx.list.push({ k: 'b', pts: [[G.cam.x - 10, this.y - 20], [G.cam.x + SW.W + 10, this.y - 20]], col: '#bfefff', life: 22, max: 22 });
          foes.forEach(e => { const b = e.box(); if (Math.abs(b.y + b.h / 2 - (this.y - 20)) < 90) { const atk = { team: 'player', x: b.x, y: b.y, w: b.w, h: b.h, dmg: Math.round(SW.data.abilities[hero.ultimate].dmg * this.specMul()), kx: 4 * this.face, ky: -4, stun: 40, energy: true, heavy: true, down: true, hitSet: new Set(), quiet: true }; if (e.takeHit(atk, G) === 'hit') G.onHit(atk, e, b); } });
        }
        if (this.st >= 72) this.enter('idle');
      } else if (st === 'hurt') {
        if (this.onGround) this.vx *= 0.85;
        // air recovery: L while knocked into the air
        if (!this.onGround && this.st > 6 && I.buffered('dash', 5)) { I.consume('dash'); this.vy = -3.4; this.vx = dir * 2; this.iframes = 16; fx.ring(this.x, this.y - 16, '#ffffff', 3, 18, 10); SW.audio.sfx('djump'); this.enter('fall'); }
        else if (this.st >= (this.hurtLen || 18)) this.enter(this.onGround ? 'idle' : 'fall');
      } else if (st === 'slip') {
        this.iframes = Math.max(this.iframes, 2);
        if (this.st % 2 === 0) fx.ghost(this.sheet(), this.slipUp ? 'jump' : 'dash', 0, this.x, this.y, this.face < 0);
        if (this.slipUp) { if (this.st >= 20) this.enter('fall'); }
        else {
          grav = false; this.vy = 0; this.vx = this.slipDir * 6.4;
          if (this.st >= 14) { this.vx = 0; this.face = -this.slipDir; this.enter(this.onGround ? 'idle' : 'fall'); }
        }
      } else if (st === 'climb') {
        grav = false; this.vx = 0;
        this.vy = I.held('up') ? -1.5 : I.held('down') ? 1.7 : 0;
        if (this.vy) this.runT += 1;
        const tx = Math.floor(this.x / T), feet = z.tile(tx, Math.floor((this.y - 1) / T)), body = z.tile(tx, Math.floor((this.y - 14) / T));
        if (I.buffered('jump', 6)) { I.consume('jump'); this.vy = I.held('down') ? 0 : JUMP * 0.8; if (dir) { this.vx = dir * 2; this.face = dir; } this.drop = 8; this.enter('jump'); SW.audio.sfx('jump'); }
        else if (feet !== 'H' && body !== 'H') { if (this.vy < 0) { this.y = Math.floor(this.y / T) * T; } this.vy = 0; this.enter('idle'); }
        else if (this.vy > 0 && z.hit(this.x - this.w / 2, this.y - this.h + 2, this.w, this.h)) { this.enter('idle'); }
      }

      if (grav) this.vy = Math.min(MAXFALL, this.vy + GRAV);
      const wasGround = this.onGround, vyBefore = this.vy;
      this.onPlat = false;
      SW.move(this, z);
      this.hitWallLast = this.hitWall;
      if (this.onGround && !wasGround && vyBefore > 2.5) { fx.dust(this.x, this.y, 5); SW.audio.sfx('land'); }
      if (this.state === 'run') { this.runT += Math.abs(this.vx) * 0.5; }

      // hazards / safe spot
      if (z.touches(this.x - this.w / 2 + 1, this.y - this.h + 4, this.w - 2, this.h - 4, '^~') || this.y > z.ph + 50) this.hazard(G);
      else if (this.onGround && !this.onPlat && this.t % 6 === 0 && free && !z.touches(this.x - 24, this.y - 8, 48, 24, '^~') && z.hit(this.x - 12, this.y + 2, 24, 4)) { this.safeX = this.x; this.safeY = this.y; }
    }
    startSlip(up) {
      const G = this.G, z = G.zone, hero = G.hero();
      this.enter('slip'); this.slipUp = up; this.iframes = 26; this.atk = null; this.castFn = null; this.dashCd = 20;
      SW.audio.sfx('dash'); SW.audio.sfx('djump'); fx.ring(this.x, this.y - 16, hero.colorHi, 4, 28, 12);
      if (up) { this.vy = -7.2; this.vx = 0; this.onGround = false; return; }
      let dir = this.face, best = 130;
      for (const e of z.ents) if (e.team === 'enemy' && !e.dead) { const d = Math.abs(e.x - this.x); if (d < best && Math.abs(e.y - this.y) < 70) { best = d; dir = e.x >= this.x ? 1 : -1; } }
      this.face = dir; this.slipDir = dir;
    }
    startDash(dir) {
      if (dir) this.face = dir;
      this.enter('dash'); this.dashCd = 26; this.iframes = this.modeT > 0 && this.G.hero().modeKind === 'speed' ? 12 : 9; if (!this.onGround) this.airDash = true;
      SW.audio.sfx('dash'); fx.dust(this.x, this.y, 3, -this.face * 0.6);
    }
    hit(def) {
      const b = def.box, x = this.face > 0 ? this.x + b[0] : this.x - b[0] - b[2];
      return SW.strike(this.G, { team: 'player', x, y: this.y + b[1], w: b[2], h: b[3], dmg: Math.round(def.dmg * (def.energy ? this.specMul() : this.comboMul())), kx: (def.kx || 0) * this.face, ky: def.ky || 0, stun: def.stun, heavy: def.heavy, down: def.down, launch: def.launch, energy: def.energy, breaker: def.breaker, hitSet: this.hitSet, srcX: this.x, src: this, fromAbove: this.state === 'airatk' });
    }
    useSkill(alt) {
      const G = this.G, z = G.zone, hero = G.hero(), A = SW.data.abilities;
      if (SW.elements && SW.elements.skill(this, alt)) return;   // elemental heroes
      if (G.state.hero === 'kael') {
        if (alt && G.has('thunder_totem')) {
          if (!this.onGround || !this.spend(A.thunder_totem.cost)) return;
          this.enter('cast');
          this.castFn = () => { z.ents.filter(e => e instanceof Totem).forEach(e => { e.life = 1; }); z.add(new Totem(this.x + this.face * 14, this.y, Math.round(A.thunder_totem.dmg * this.skillMul()))); SW.audio.sfx('zap'); fx.ring(this.x + this.face * 14, this.y - 10, hero.color, 4, 26, 14); };
        } else if (G.has('spark_dart')) {
          if (!this.spend(A.spark_dart.cost)) return;
          this.enter('cast');
          const up = I.held('up');   // W + U: throw at an upward angle
          this.castFn = () => { z.shots.push(new Shot({ kind: 'dart', team: 'player', x: this.x + this.face * 14, y: this.y - 21, vx: this.face * (up ? 5 : 6.6), vy: up ? -3.8 : 0, dmg: Math.round(A.spark_dart.dmg * this.skillMul()), life: 44, w: 12, h: 6, col: '#ffb840', energy: true, kx: 1.6, stun: 20 })); SW.audio.sfx('shoot'); };
        }
      } else if (G.has('pulse_burst')) {
        if (!this.spend(A.pulse_burst.cost)) return;
        this.enter('cast');
        const up = I.held('up');   // W + U: rising burst that launches
        this.castFn = () => {
          const cx = this.x + this.face * (up ? 12 : 22), cy = this.y - (up ? 44 : 18);
          fx.ring(cx, cy, hero.color, 4, 34, 14); fx.ring(cx, cy, '#ffffff', 2, 24, 10); fx.spark(cx, cy, hero.colorHi, 12, 3.4); SW.audio.sfx('burst'); fx.shake(2, 6);
          const atk = { team: 'player', x: cx - 32, y: cy - 30, w: 64, h: 60, dmg: Math.round(A.pulse_burst.dmg * this.skillMul()), kx: (up ? 0.6 : 3.6) * this.face, ky: up ? -7 : -2.4, stun: up ? 44 : 26, launch: up, energy: true, hitSet: new Set(), srcX: this.x };
          SW.strike(G, atk);
        };
      }
    }
    useSpecial() {
      const G = this.G, hero = G.hero(), A = SW.data.abilities;
      if (I.held('up') && G.has(hero.ultimate) && (this.awakeT > 0 || G.state.energy >= 300)) { if (this.spend(this.awakeT > 0 ? A[hero.ultimate].cost : 300)) { this.enter('ult'); SW.audio.sfx('awaken'); fx.flash(hero.colorHi, 8); G.toast(A[hero.ultimate].name.toUpperCase() + '!'); } return; }
      if (I.held('down') && G.has(hero.mode)) { if (this.spend(A[hero.mode].cost)) { this.modeT = 600; SW.audio.sfx('awaken'); fx.ring(this.x, this.y - 16, hero.colorHi, 6, 50, 20); G.toast(A[hero.mode].name + ' - 10 s'); } return; }
      if (SW.elements && SW.elements.special(this)) return;   // elemental heroes
      if (G.state.hero === 'kael' && G.has('breaker_rush')) { if (this.spend(A.breaker_rush.cost)) { this.enter('rush'); this.hitSet = new Set(); } }
      else if (G.state.hero === 'nyra' && G.has('shatterline')) { if (this.onGround && this.spend(A.shatterline.cost)) this.enter('wave'); }
    }
    useAwaken() {
      const G = this.G, S = G.state, hero = G.hero(), z = G.zone;
      if (S.awaken >= 100 && G.has(hero.awaken) && this.awakeT <= 0) {
        this.awakeT = this.awakeMax = 900 + 120 * G.upg('awaken'); this.enter('awaken'); SW.audio.sfx('awaken'); fx.flash(hero.colorHi, 12); fx.shake(6, 20); fx.ring(this.x, this.y - 16, hero.color, 6, 70, 26);
        G.toast(SW.data.abilities[hero.awaken].name.toUpperCase() + '!');
        z.ents.forEach(e => { if (e.hittable && e.team === 'enemy' && !e.dead && Math.abs(e.x - this.x) < 70 && e.stagger) { e.vx = Math.sign(e.x - this.x) * 4; e.stagger(30); } });
        return;
      }
      if (!S.assist) return;
      if (this.assistCd > 0) { SW.audio.sfx('deny'); return; }
      this.assistCd = 1200;
      if (S.assist === 'tamsin') { z.add(new Helper('tamsin', this.x - this.face * 18, this.y, this.face)); this.heal(Math.round(this.hpMax() * 0.35)); SW.audio.sfx('heal'); fx.ring(this.x, this.y - 16, '#7dffa0', 4, 34, 18); G.toast('Tamsin: "Hold still!"'); }
      else if (S.assist === 'wren') {
        fx.flash('#22d3ee', 6); SW.audio.sfx('zap'); G.toast('Wren: "Scrambling them. Go!"');
        z.ents.forEach(e => { if (e.hittable && e.team === 'enemy' && !e.dead && e.stagger && Math.abs(e.x - this.x) < 300) { e.stagger(e.isBoss ? 70 : 170); fx.bolt(e.x, e.y - 60, e.x, e.y - 10, '#22d3ee'); } });
      }
    }
    useItem() {
      const S = this.G.state;
      if (S.items <= 0 || S.hp >= this.hpMax()) { if (this.denyT <= 0) { SW.audio.sfx('deny'); this.denyT = 30; } return; }
      S.items--; this.heal(Math.round(this.hpMax() * 0.4)); SW.audio.sfx('heal'); fx.ring(this.x, this.y - 16, '#7dffa0', 4, 28, 16);
    }
    hazard(G) {
      const S = G.state;
      if (this.invuln <= 0) { S.hp -= 10; SW.audio.sfx('hurt'); fx.flash('#ff5a5a', 6); fx.text(this.x, this.y - 40, '-10', '#ff5a5a'); }
      this.x = this.safeX; this.y = this.safeY; this.vx = 0; this.vy = 0; this.invuln = 70; this.enter('idle');
      if (S.hp <= 0) this.die();
    }
    die() {
      this.G.state.hp = 0; this.dead = true; this.deadT = 0; this.enter('dead'); this.vy = -3; this.awakeT = 0; this.modeT = 0; SW.audio.sfx('die'); fx.shake(6, 20);
    }
    takeHit(atk, G) {
      if (this.dead || this.invuln > 0 || this.iframes > 0 || G.busy()) return 'none';
      const S = G.state, hero = G.hero(), sx = atk.srcX === undefined ? this.x - this.face : atk.srcX, away = this.x >= sx ? 1 : -1;
      if (this.state === 'guard' && !atk.unblockable) {
        this.face = -away;
        if (this.guardT <= 6) {
          S.energy = Math.min(300, S.energy + 30); SW.audio.sfx('perfect'); fx.ring(this.x - away * 8, this.y - 18, '#ffffff', 3, 26, 12); fx.spark(this.x - away * 8, this.y - 18, hero.colorHi, 10, 3);
          fx.text(this.x, this.y - 42, 'PERFECT', '#ffffff'); G.hitstop = 5;
          if (atk.src && atk.src.stagger && !atk.src.isBoss) atk.src.stagger(46);
          return 'perfect';
        }
        const gk = 1 - 0.12 * G.upg('guard'), d = Math.max(1, Math.ceil(atk.dmg * 0.2 * gk));
        S.hp -= d; S.energy = Math.max(0, S.energy - atk.dmg * 1.1 * gk); this.vx = away * 1.8; SW.audio.sfx('block'); fx.spark(this.x - away * 8, this.y - 18, '#c8ccd8', 5, 2);
        fx.text(this.x, this.y - 40, '-' + d, '#c8ccd8');
        if (S.hp <= 0) { this.die(); return 'hit'; }
        return 'block';
      }
      S.hp -= atk.dmg; S.awaken = this.awakeT > 0 ? S.awaken : Math.min(100, S.awaken + atk.dmg * 0.8);
      SW.audio.sfx('hurt'); fx.shake(4, 8); fx.text(this.x, this.y - 40, '-' + atk.dmg, '#ff5a5a'); fx.spark(this.x, this.y - 18, '#ff5a5a', 6, 2.4);
      this.invuln = 54; G.hitstop = Math.max(G.hitstop, 4); G.combo = null;
      if (this.awakeT <= 0 || atk.heavy) { this.enter('hurt'); this.vx = away * Math.abs(atk.kx || 2.6); this.vy = atk.ky !== undefined && atk.ky !== 0 ? atk.ky : -2.4; this.atk = null; this.castFn = null; }
      if (S.hp <= 0) this.die();
      return 'hit';
    }
    draw(ctx, cam, G) {
      const hero = G.hero(), x = this.x - cam.x, y = this.y - cam.y, s = this.state;
      let anim = 'idle', f = Math.floor(this.t / 26) % 2;
      if (s === 'run') { anim = 'run'; f = Math.floor(this.runT / 2.6) % 8; }
      else if (s === 'jump') { anim = 'jump'; f = 0; } else if (s === 'fall') { anim = 'fall'; f = 0; }
      else if (s === 'dash') { anim = 'dash'; f = 0; } else if (s === 'guard') { anim = 'guard'; f = 0; }
      else if (s === 'charge') { anim = 'charge'; f = Math.floor(this.t / 5) % 2; } else if (s === 'hurt') { anim = 'hurt'; f = 0; }
      else if (s === 'dead') { anim = this.onGround ? 'down' : 'hurt'; f = 0; } else if (s === 'climb') { anim = 'climb'; f = Math.floor(this.runT / 8) % 2; }
      else if (s === 'attack' || s === 'airatk') { anim = this.atk.anim; f = this.st < this.atk.hitAt ? 0 : this.st <= this.atk.hitEnd + 2 ? 1 : 2; }
      else if (s === 'cast') { anim = 'cast'; f = this.st < 5 ? 0 : this.st < 13 ? 1 : 2; }
      else if (s === 'rush') { anim = 'special'; f = this.st < 7 ? 0 : this.st < 21 ? 1 : 2; }
      else if (s === 'wave') { anim = G.has('winterline') ? 'a4' : 'special'; f = this.st < 8 ? 0 : this.st < 18 ? 1 : 2; }
      else if (s === 'awaken' || s === 'ult') { anim = s === 'ult' && this.st > 28 && hero.ult === 'line' ? 'a3' : 'cheer'; f = s === 'ult' && this.st > 28 ? 1 : 0; }
      else if (s === 'slip') { anim = this.slipUp ? 'jump' : 'dash'; f = 0; }
      if (this.wallT > 0) { this.wallT--; anim = 'cling'; f = 0; }
      if (this.awakeT > 0 || this.modeT > 0 || s === 'charge') {
        const c = this.awakeT > 0 ? hero.colorHi : hero.color;
        art.glow(ctx, Math.round(x), Math.round(y - 16), 20 + Math.sin(this.t * 0.3) * 3, c, this.awakeT > 0 ? 0.2 : 0.13);
        if (this.t % 3 === 0) fx.list.push({ k: 'p', x: this.x + SW.rand(-8, 8), y: this.y - SW.rand(0, 30), vx: 0, vy: -1.2, g: 0, life: 12, max: 12, col: c, s: 1 + (Math.random() * 2 | 0) });
      }
      if (this.invuln > 0 && !this.dead && Math.floor(this.invuln / 3) % 2) return;
      art.draw(ctx, this.sheet(), anim, f, x, y, this.face < 0, s === 'slip' ? { alpha: 0.45, flash: true } : { flash: s === 'hurt' && this.st < 4 });
    }
  }
  SW.Player = Player;
})();
