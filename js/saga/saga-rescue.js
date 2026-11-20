'use strict';
// Shattered Worlds - The Hollow Crown: chapter 6, THE RESCUE (the user, 2026-11-20: "each hero make their own map and
// scene and the player can rescue them by defeating them or help them defeat a space enemy").
// After the Convergence falls and Vael arrives, every other playable hero (47; the Beyond-born stay villains) is out
// there somewhere on the three layers, in a place of their own, in one of four plights:
//   called     under Vael's Call: cut through their guard, then beat them in a duel and the crown breaks
//   champion   holding out against one of Vael's Beyond-born champions: a wave, then duel the champion while they
//              strike in beside you (js/saga/saga-allies.js)
//   legion     holding out against the Hollow Legion: three waves fought side by side
//   walker     the same, then a Siege Walker and its captain
// The player picks who to go to on the travel map (js/saga/saga-map.js). A rescued hero joins the muster: they
// strike beside the hero in the finale (chapter 7). The Crown can be stormed once NEED heroes are rescued with at least
// PER from each layer; all 47 is the true ending (and after the ending, the rest can still be brought home).
// The scenes are written in js/saga/rescue-sky.js, rescue-land.js, rescue-deep.js (SG.rescueText).
// Save: G.state.saga.res = { done: { id: true }, cur: id being rescued or null, st: that rescue's progress }.
// Loaded after js/saga/saga-core.js; it is called from saga-core's tick (SG.rescue.tick / newZone / begin).
(function () {
  const SW = window.SW, G = SW && SW.game, D = SW && SW.data, HR = D && D.heroes, art = SW && SW.art, fx = SW && SW.fx, SG = SW && SW.saga, T = 16;
  if (!G || !SG || !SG.run || !HR) return;
  const R = SG.run;
  const sfx = n => { try { SW.audio.sfx(n); } catch (e) { /* no audio yet */ } };
  const nm = id => (HR[id] ? HR[id].name : id);
  const NEED = 8, PER = 2;

  // ================= who is where =================
  // [area, kind, champion]: each hero in their own place (home, or where their story put them)
  const PLAN = {
    // Aurelia
    nyra: ['medlab', 'called'], isolde: ['cryo', 'called'], gale: ['skylift', 'champion', 'mika'], aldric: ['pylon', 'champion', 'vega'],
    pyra: ['furnace', 'champion', 'lux'], yara: ['range', 'called'], kiri: ['shrine', 'legion'], kestra: ['gallery', 'champion', 'mira'],
    sora: ['skyport', 'champion', 'corvin'], coda: ['noble', 'called'], zara: ['stacks', 'legion'], maren: ['hydro', 'legion'],
    elixa: ['blank', 'called'], isa: ['archive', 'champion', 'tessa'], lin: ['ballast', 'walker'], vesper: ['ward', 'called'],
    // the Surface
    fenn: ['dunes', 'called'], brakk: ['glasssea', 'champion', 'opal'], jax: ['saloon', 'called'], tarn: ['milezero', 'walker'],
    brann: ['icehouse', 'called'], dune: ['meridian', 'legion'], hollis: ['village', 'legion'], ume: ['glowwild', 'champion', 'apis'],
    kova: ['pens', 'called'], hart: ['scrapton', 'walker'], taro: ['tethers', 'champion', 'ryo'], tarek: ['sinkhole', 'legion'],
    oda: ['village', 'called'], garo: ['dig', 'walker'], ivo: ['hollow', 'called'], tor: ['anchor', 'walker'],
    // Deepline
    kael: ['yard', 'called'], ashka: ['core', 'called'], dyna: ['works', 'walker'], bando: ['choir', 'legion'],
    ferra: ['yard', 'walker'], sen: ['metro', 'champion', 'noct'], rook: ['market', 'champion', 'rue'], sable: ['slums', 'called'],
    moro: ['platform', 'champion', 'orin'], pell: ['pit', 'called'], thorne: ['rootways', 'champion', 'hex'], vex: ['shafts', 'legion'],
    vesna: ['market', 'called'], fumi: ['core', 'walker'], mako: ['docks', 'walker'], nami: ['waterworks', 'champion', 'slick']
  };
  const plan = id => { const p = PLAN[id]; return p ? { zone: p[0], kind: p[1], foe: p[2] || null } : null; };
  const realmOf = id => ((SW.lore && SW.lore.heroes && SW.lore.heroes[id]) || {}).realm || 'land';
  const text = id => (SG.rescueText && SG.rescueText[id]) || {};
  const NONE = { done: {}, cur: null, st: {} };
  // (in a duel G.state is a fighter's copy, without the story)
  const res = () => { const sg = G.state && G.state.saga; if (!sg) return NONE; sg.res = sg.res || { done: {}, cur: null, st: {} }; sg.res.done = sg.res.done || {}; sg.res.st = sg.res.st || {}; return sg.res; };
  const others = () => Object.keys(PLAN).filter(id => id !== G.state.hero && HR[id]);
  const count = () => { const d = res().done; return others().filter(id => d[id]).length; };
  const total = () => others().length;
  const perLayer = () => { const d = res().done, o = { sky: 0, land: 0, deep: 0 }; others().forEach(id => { if (d[id]) o[realmOf(id)]++; }); return o; };
  const ready = () => { const p = perLayer(); return count() >= NEED && p.sky >= PER && p.land >= PER && p.deep >= PER; };
  const muster = () => others().filter(id => res().done[id]);
  // (said on the map: translated as a pattern, then the name goes in; js/saga/lang-camp-*.js)
  const tr = s => (SW.i18n && SW.i18n.tr ? SW.i18n.tr(s) : s);
  const fill = (s, ...a) => a.reduce((o, v, i) => o.split('{' + i + '}').join(v), s);
  const tnm = id => tr(nm(id));
  // a place as the translated scenes name it (js/saga/lang-camp-*.js: SG.zoneNames), or its English name
  const placeName = z => { const l = SW.i18n && SW.i18n.lang, t = l && SG.zoneNames && SG.zoneNames[l]; return (t && t[z]) || tr(SW.zones[z] ? SW.zones[z].name : z); };
  SG.placeName = placeName;
  const KIND_LINE = {
    called: id => fill(tr('Under the Call. Beat {0} in a duel to break the crown.'), tnm(id)),
    champion: id => fill(tr('Holding out against {0}. Duel the champion together.'), tnm(plan(id).foe)),
    legion: () => tr('Holding out against the Legion. Fight three waves together.'),
    walker: () => tr('A Siege Walker is coming. Bring it down together.')
  };
  const status = id => (res().done[id] ? 'rescued' : res().cur === id ? 'here' : plan(id).kind);

  // ================= the HUD line of chapter 6 =================
  function goalLine() {
    const m = D.missions.SG6; if (!m) return;
    const id = res().cur, n = count(), p = perLayer();
    let t;
    if (id) t = fill(tr('Rescue {0} at {1}'), tnm(id), placeName(plan(id).zone));
    else if (ready()) t = 'Storm the Crown (M: map), or rescue more (' + n + '/' + total() + ')';
    else t = 'Rescue heroes: ' + n + '/' + NEED + ', 2 per layer (M: map)';
    m.steps[0].t = t;
    void p;
  }

  // ================= the hero fighting beside you =================
  class Ally {
    constructor(id, x, y) { Object.assign(this, { id, x, y, face: 1, t: 0, cd: 90, act: null, sg: true, front: false, sgAlly: true }); }
    update(g, z) {
      this.t++;
      const p = G.player; if (!p || G.zone !== z) return;
      if (this.act) {
        const a = this.act, e = a.e; a.t++;
        if (a.t === 1) { this.x = e.x - a.side * 22; this.y = e.y; this.face = a.side; fx.ring(this.x, this.y - 16, HR[this.id].color, 4, 30, 14); }
        if (a.t === 7 && !e.dead) {
          const big = e.isBoss || (e.def && e.def.boss) || e === R.boss, mx = e.hpMax || e.hp || 60;
          const dmg = Math.max(1, Math.round(big ? mx * 0.05 : mx * 0.5));
          try { e.takeHit({ dmg, srcX: this.x, kx: a.side * 3, ky: -2, heavy: true, energy: true, team: 'player' }, G); } catch (err) { console.error(err); }
          fx.spark(e.x, e.y - 18, HR[this.id].colorHi || '#ffffff', 10, 3); fx.shake(2, 6); sfx('heavy');
        }
        if (a.t > 28) { this.act = null; this.cd = 130 + Math.floor(Math.random() * 70); }
        return;
      }
      const foes = R.foes.filter(e => !SG.gone(z, e) && !e.dead && !e.wait);
      if (R.boss && R.boss.def && !R.boss.dead) foes.push(R.boss);
      let tgt = null, best = 230;
      foes.forEach(e => { const d = Math.abs(e.x - this.x) + Math.abs(e.y - this.y) * 0.6; if (d < best) { best = d; tgt = e; } });
      if (tgt && --this.cd <= 0) { this.act = { e: tgt, t: 0, side: tgt.x >= this.x ? 1 : -1 }; return; }
      // otherwise keep near the hero, a little behind
      const want = p.x - (p.face || 1) * 30, dx = want - this.x;
      if (Math.abs(dx) > 8) { this.x += Math.max(-2.4, Math.min(2.4, dx * 0.08)); this.moving = true; } else this.moving = false;
      if (Math.abs(p.y - this.y) > 120 || Math.abs(p.x - this.x) > 260) { this.x = want; this.y = p.y; fx.ring(this.x, this.y - 16, HR[this.id].color, 3, 24, 12); }
      else if (p.onGround) this.y += (p.y - this.y) * 0.25;
      this.face = tgt ? (tgt.x >= this.x ? 1 : -1) : (p.x >= this.x ? 1 : -1);
    }
    draw(ctx, cam) {
      const h = HR[this.id]; if (!h) return;
      const anim = this.act ? (this.act.t < 7 ? 'dash' : 'a2') : this.moving ? 'run' : 'idle';
      const n = art.frames(h.sheet, anim), fr = this.act ? Math.min(n - 1, this.act.t >> 2) : Math.floor(this.t / 8) % n;
      art.glow(ctx, this.x - cam.x, this.y - cam.y - 18, 18, h.color, 0.18);
      art.draw(ctx, h.sheet, anim, fr, this.x - cam.x, this.y - cam.y, this.face < 0);
      SW.text(ctx, h.name, this.x - cam.x, this.y - cam.y - 52, h.colorHi || '#ffffff', { align: 'center' });
    }
  }
  let ally = null;
  function dropAlly() { if (ally && G.zone) { const i = G.zone.ents.indexOf(ally); if (i >= 0) G.zone.ents.splice(i, 1); } ally = null; }
  function ensureAlly(z, id) {
    if (ally && ally.id === id && z.ents.indexOf(ally) >= 0) return;
    dropAlly();
    const p = G.player; ally = new Ally(id, p.x - (p.face || 1) * 30, p.y); z.ents.push(ally);
    fx.ring(ally.x, ally.y - 16, HR[id].color, 4, 36, 18);
  }

  // ================= a rescue, played =================
  function newZone(z) {
    ally = null;
    const r = res(), id = r.cur; goalLine();
    if (!id) return;
    const P = plan(id), s = r.st;
    if (z.id !== P.zone) { G.toast(fill(tr('{0} is waiting at {1}  (M: travel map)'), tnm(id), placeName(P.zone)), '#b48cff'); return; }
    if (P.kind !== 'called' && s.intro) ensureAlly(z, id);
    if (s.waves && (P.kind === 'called' || P.kind === 'champion')) placeTarget(z, id);
  }
  function placeTarget(z, id) {
    const P = plan(id), who = P.kind === 'called' ? id : P.foe;
    SG.placeNpc(z, who, null, { called: true, dist: 9, prompt: 'Face', talk: () => meet(id) });
  }
  function label(P) { return P.kind === 'called' ? "VAEL'S GUARD  -  " : 'THE HOLLOW LEGION  -  '; }
  function tick(z) {
    const r = res(), id = r.cur; goalLine();
    if (R.mapT > 0 && --R.mapT === 0 && !G.busy() && !id) { G.overlay = 'map'; sfx('select'); }
    if (!id) return;
    const P = plan(id), s = r.st, X = text(id);
    if (z.id !== P.zone) return;
    if (!s.intro) { s.intro = true; if (P.kind !== 'called') ensureAlly(z, id); SG.say('ri' + id, X.intro || [['sys', KIND_LINE[P.kind](id)]]); return; }
    if (!s.waves) {
      SG.waves(z, 6, () => SG.foeLists(6, z.id, SG.RESCUE_WAVES[P.kind]), () => { s.waves = true; afterWaves(z, id); }, label(P), (k, N) => {
        const at = P.kind === 'legion' ? 1 : P.kind === 'walker' ? N : -1;
        if (k === at && !s.mid && X.mid && X.mid.length) { s.mid = true; SG.say('rm' + id, X.mid); return true; }
        return false;
      });
      return;
    }
    if (P.kind === 'walker' && !s.boss) runWalker(z, id, s);
  }
  function afterWaves(z, id) {
    const P = plan(id);
    if (P.kind === 'legion') { finish(id); return; }
    if (P.kind === 'walker') { R.t = 40; return; }
    placeTarget(z, id);
    G.toast(P.kind === 'called' ? nm(id) + ' waits, crowned. Face them (E).' : nm(P.foe) + ' comes for ' + nm(id) + '. Face the champion (E).', '#b48cff');
  }
  // the Siege Walker: the same captain as the old Holders' finale, with the hero beside you
  function runWalker(z, id, s) {
    const sg = G.state.saga, key = 'walker:' + id;
    if (R.boss && R.boss.def && !R.boss.dead && !SG.gone(z, R.boss)) { sg.bossHp = sg.bossHp || {}; sg.bossHp[key] = R.boss.hp; return; }
    if (R.boss && R.boss.def) {
      if (R.t > 0) { R.t--; return; }
      if (sg.bossHp) delete sg.bossHp[key];
      R.boss = null; G.boss = null; SW.audio.music(z.music); s.boss = true;
      const mm = SG.meta(); if (!mm.captain) { mm.captain = true; try { localStorage.setItem('shattered-worlds-saga-meta-v1', JSON.stringify(mm)); } catch (e) { /* storage full */ } if (SG.checkMilestones) SG.checkMilestones(); }   // Bando's unlock (saga-unlocks.js)
      finish(id); return;
    }
    if (R.boss) return;
    if (R.t > 0) { R.t--; return; }
    const type = D.enemies.siege_captain ? 'siege_captain' : 'eliteenf', lv = G.state.level || 1;
    R.boss = SG.spawnBoss(z, type, Math.min(1, (lv + 6) / 20), { key, min: 400, dist: 11 }); R.t = 80;
    fx.shake(8, 40);
  }
  function meet(id) {
    const s = res().st, X = text(id);
    if (!s.met) { SG.say('rt' + id, X.meet || [], () => { s.met = true; duel(id); }); return; }
    duel(id);
  }
  function duel(id) {
    const P = plan(id), stage = SG.stageFor(P.zone), champ = P.kind === 'champion';
    SG.fight(champ ? P.foe : id, {
      title: champ ? 'CHAMPION OF THE CROWN' : 'BREAK THE CALL', rivalName: (champ ? 'CHAMPION: ' + nm(P.foe) : 'CALLED: ' + nm(id)).toUpperCase(),
      stage, hard: true, called: true, kind: champ ? 'champion' : 'called', allies: champ ? [id] : null,
      onEnd: result => {
        if (result === 'win') { SG.dropNpc(); res().st.duel = true; finish(id); return; }
        SG.say('rl' + id, text(id).lose || [['hero', 'Again.']], () => G.toast('Face ' + nm(champ ? P.foe : id) + ' again (E).', '#8a92b8'));
      }
    });
  }
  // rescued: the tie lines (if the hero being played shares a past with them) and the win, then the muster
  function finish(id) {
    const X = text(id), me = G.state.hero, tie = (X.tie && X.tie[me]) || [];
    SG.say('rw' + id, tie.concat(X.win || [['sys', nm(id) + ' joins the muster.']]), () => {
      const r = res(), S = G.state;
      r.done[id] = true; r.cur = null; r.st = {};
      dropAlly();
      fx.ring(G.player.x, G.player.y - 16, HR[id].color, 6, 50, 24); sfx('level');
      G.addXP(90); S.creds += 40; S.hp = G.player.hpMax(); S.energy = Math.max(S.energy, 200);
      const n = count();
      if (n % 3 === 0) { S.points += 1; G.toast('+1 stat point  (Esc > Stats)', '#7dffa0'); }
      G.toast(nm(id).toUpperCase() + ' JOINS THE MUSTER  (' + n + ' / ' + total() + ')', HR[id].color);
      if (n === NEED && ready()) G.toast('The muster is strong enough. The Crown can be stormed (M: map).', '#f5c542');
      else if (ready() && !S.saga.readySaid) G.toast('The Crown can be stormed now (M: map).', '#f5c542');
      if (ready()) S.saga.readySaid = true;
      goalLine(); G.saveGame();
      // the last of the 47, after the Crown already fell: the true ending
      if (S.saga.phase === 'end' && count() === total() && !S.saga.trueSeen && SG.trueEnding) { SG.trueEnding(); return; }
      R.mapT = 70;   // and the map opens again
    });
  }

  // ================= from the map =================
  function go(id) {
    const P = plan(id), r = res();
    if (!P || r.done[id] || id === G.state.hero) return false;
    if (SG.fighting && SG.fighting()) { G.toast('Not now: the fight is here.', '#ff5a5a'); return false; }
    if (r.cur !== id) { r.cur = id; r.st = {}; }
    G.overlay = null; dropAlly(); SG.dropNpc(); R.mapT = 0;
    G.saveGame();
    SG.goto(P.zone);
    return true;
  }
  function storm() {
    if (!ready() || G.state.saga.ch !== 6) return false;
    if (SG.fighting && SG.fighting()) { G.toast('Not now: the fight is here.', '#ff5a5a'); return false; }
    const r = res(); r.cur = null; r.st = {};
    G.overlay = null; dropAlly(); SG.dropNpc();
    SG.complete(6, 'rescue');
    return true;
  }
  // the start of chapter 6: a few words, then the map
  function begin() {
    const sg = G.state.saga, k = (SG.campaign && SG.campaign.rescue) || {};
    goalLine();
    const open = () => { G.overlay = 'map'; sfx('select'); };
    if (!sg.seen.r6 && k.intro) { sg.seen.r6 = true; SG.say('r6', k.intro.map(l => [l[0], SG.fillIn(l[1], G.state.hero)]), open); } else open();
  }
  const zoneNow = () => { const id = G.state && G.state.saga && res().cur; return id ? plan(id).zone : 'crater'; };

  SG.rescue = { PLAN, NEED, PER, plan, text, status, count, total, perLayer, ready, muster, all: () => total() > 0 && count() === total(), others, realmOf,
    kindLine: id => KIND_LINE[plan(id).kind](id), go, storm, begin, newZone, tick, zoneNow, goalLine };
})();
