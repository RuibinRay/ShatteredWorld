'use strict';
// Shattered Worlds — every ultimate is worth the same in Versus: 47% of the target's full health (the user, 2026-11-20:
// "all hero ult is 55% max health damage for all heros to be same in versus", then "change ult damage to 47% for all").
// Before this, the finishing blows of js/ult-grand.js and js/ult-cinema.js topped an ultimate up to 50%, Sen's Single
// Stroke (js/sen-stroke.js) took 77%, and a few ultimates dealt more than 50% on their own. Now, per ultimate:
//   cap      while a fighter's ultimate runs, the damage it does to the other fighter adds up, and no hit takes the total
//            past 47% of the target's full health (the hits after that still land, for 0)
//   top-up   when the ultimate ends, if it landed at all and the total is short of 47%, the rest is dealt at once
// A fully guarded ultimate (nothing landed) is not topped up. Story mode is not touched. Itsuki's included: the user
// asked for every hero. SW.ultShare.on = false gives back the old totals; SW.ultShare.SHARE is the share.
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, P = SW.Player && SW.Player.prototype, fx = SW.fx;
  if (!V || !P || !P.takeHit) return;
  const U = SW.ultShare = { on: true, SHARE: 0.47, log: [] };
  const live = () => U.on && G.scene === 'vs' && V.f && V.f.length === 2 && V.phase === 'fight';
  const other = f => V.f.find(x => x && x !== f);
  function maxHp(f) { const keep = G.state; G.state = f.state; try { return f.p.hpMax(); } finally { G.state = keep; } }
  // the ultimate a fighter is in now: a new one starts each time it enters 'ult' (Sen's re-enters it: same ultimate)
  function ultOf(a) {
    const p = a.p;
    if (p.state !== 'ult') return null;
    if (!a.u55 || a.u55.done) a.u55 = { dealt: 0, landed: false, done: false, t0: V.t };
    return a.u55;
  }
  // what an ultimate left behind (a shot, a summon: no atk.src) still counts toward its 47% for a second after it ends
  function afterOf(a, atk) {
    const u = a.u55;
    return u && u.done && V.t - u.end < 60 && !(atk && atk.src) ? u : null;
  }
  const _th = P.takeHit;
  P.takeHit = function (atk, g) {
    if (!live()) return _th.apply(this, arguments);
    const f = V.cur, a = f && other(f);
    if (!f || f.p !== this || !a) return _th.apply(this, arguments);
    const u = ultOf(a) || afterOf(a, atk);
    if (!u) return _th.apply(this, arguments);
    const cap = Math.round(maxHp(f) * U.SHARE), room = Math.max(0, cap - u.dealt), hp0 = f.state.hp;
    const a2 = atk && atk.dmg > room ? Object.assign({}, atk, { dmg: room }) : atk;
    const r = _th.call(this, a2, g);
    if (r === 'hit') { u.landed = true; u.dealt += Math.max(0, hp0 - f.state.hp); }
    return r;
  };
  // when the ultimate is over: the rest of the 47%, if it landed
  const _vu = V.update;
  V.update = function () {
    const out = _vu.apply(this, arguments);
    if (!live()) return out;
    V.f.forEach(a => {
      const u = a.u55, f0 = other(a);
      // a burn the ultimate set would go on taking health past its 47%: none while it runs or just after
      if (u && f0 && (!u.done || V.t - u.end < 60) && f0.burnT > 0) f0.burnT = 0;
      if (!u || u.done || a.p.state === 'ult') return;
      u.done = true; u.end = V.t;
      const f = other(a); if (!f || !u.landed || f.p.dead || f.state.hp <= 0) return;
      const cap = Math.round(maxHp(f) * U.SHARE), rest = cap - u.dealt;
      U.log.push({ hero: a.hero, dealt: Math.round(u.dealt), rest: Math.max(0, Math.round(rest)), cap });
      if (U.log.length > 60) U.log.shift();
      if (rest < 1) { u.dealt = Math.max(u.dealt, cap); return; }
      const keep = G.state; G.state = f.state;
      try {
        f.state.hp -= rest; u.dealt = cap; fx.text(f.p.x, f.p.y - 48, '-' + Math.round(rest), '#ffd24a'); fx.shake(4, 10);
        if (f.state.hp <= 0) { f.state.hp = 0; f.p.die(); }
      } finally { G.state = keep; }
    });
    return out;
  };
})();
