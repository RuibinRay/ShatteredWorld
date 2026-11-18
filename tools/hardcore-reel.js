'use strict';
// Shattered Worlds — a highlight reel of the Nightmare bots using their moves (js/hardcore-skill.js). Not loaded by the game.
// Load after tools/harness.js and tools/hardcore-train.js on the record server (port 8793). Plays Bot vs Bot one game
// frame per tick, draws every second frame (30 fps) into a small canvas, keeps the last 1.5 s, and when a bot makes one of
// the new reads (anti-air, ranged punish, a counter read, power mode, zoning...) keeps that moment and 2.5 s after it as
// a clip, with both bots' decisions drawn on screen and a caption. Clips go to recordings/reel_<n>_<part>.raw (RGBA,
// 480x270); tools/hardcore-reel.sh joins them into recordings/nightmare_reel.mp4.
//   RL.setup(jobs)   jobs: [{a, b, lb}] (lb: the right bot's level, 3 = Nightmare)
//   await RL.film(ms)   films for up to ms (call again until RL.done)
(function () {
  const SW = window.SW, G = SW.game, V = SW.versus, D = SW.data, HC = SW.hardcore, T = window.T, text = SW.text, art = SW.art, I = SW.input;
  if (!T || !HC) return;
  const W = 480, H = 270, PRE = 45, POST = 75, MAXLEN = 240;
  const RL = window.RL = { clips: 0, max: 12, per: {}, perMax: 2, done: false, log: [] };
  const KNOW = /^(ANTI-AIR|PUNISH FROM RANGE|WHIFF PUNISH - |HIT THE CHARGE|BAIT THE COUNTER|POWER UP - |STRIKE THROUGH ITS MOVE|THROW FROM BETWEEN WORLDS|REVERSAL|ZONE|POKE - |IT IS BRACED|IT IS BETWEEN WORLDS|COUNTER - |BETWEEN WORLDS - )/;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  let ring = [], clip = null, cap = null, part = 0;

  // the overlay: what each bot is doing, and the caption for the moment being kept
  const _draw = V.draw;
  V.draw = function (ctx) {
    _draw.apply(this, arguments);
    if (!RL.on || !V.f.length || V.phase !== 'fight') return;
    V.f.forEach((f, i) => {
      const w = (f.hc && f.hc.why) || '', name = D.heroes[f.hero].name.toUpperCase(), s = w.length > 34 ? w.slice(0, 34) : w;
      ctx.globalAlpha = 0.6; art.rect(ctx, '#05060c', i ? W - 186 : 0, 34, 186, 20); ctx.globalAlpha = 1;
      text(ctx, name + ' (NIGHTMARE)', i ? W - 4 : 4, 37, '#ffe066', i ? { align: 'right' } : undefined);
      text(ctx, s, i ? W - 4 : 4, 46, KNOW.test(w) ? '#7fe3ff' : '#ffffff', i ? { align: 'right' } : undefined);
    });
    if (cap && cap.t > 0) {
      ctx.globalAlpha = 0.78; art.rect(ctx, '#05060c', 0, 58, W, 22); ctx.globalAlpha = 1;
      text(ctx, cap.s, W / 2, 61, '#7fe3ff', { align: 'center' });
      text(ctx, cap.sub, W / 2, 71, '#c8d0ff', { align: 'center' });
    }
  };
  const SUB = {
    'ANTI-AIR': 'it jumped in with nothing out: met in the air', 'PUNISH FROM RANGE': 'stunned but too far to run to: a skill that gets there',
    'WHIFF PUNISH': 'its move missed: punished from where it stands', 'HIT THE CHARGE': 'charging its bar at a distance: a free hit',
    'BAIT THE COUNTER': 'braced to counter: popped from outside its swing', 'POWER UP': 'out of reach, a bar to spare: the timed power mode',
    'STRIKE THROUGH ITS MOVE': 'between worlds: let it swing through, then strike', 'THROW FROM BETWEEN WORLDS': 'between worlds: a guard gets thrown',
    'REVERSAL': 'invincible right through the incoming hit', 'ZONE': 'from the range this skill reaches and is safe at',
    'POKE': 'the skill that reaches from here', 'IT IS BRACED': 'it is braced to counter: no swing into it',
    'IT IS BETWEEN WORLDS': 'nothing touches it now: guard and wait', 'COUNTER': 'its counter stance, set just before the hit', 'BETWEEN WORLDS': 'untouchable: walking in'
  };
  function begin(j) {
    G.manual = true;
    V.open(G); V.mode = 'bvb'; V.fmt = 0; V.speed = 0; V.diff = 3; V.diff2 = j.lb === undefined ? 3 : j.lb; V.gain = 1; V.stage = j.st || 1;
    V.pick = [D.heroOrder.indexOf(j.a), D.heroOrder.indexOf(j.b)]; V.phase = 'pick'; V.step = 1;
    T.press('confirm'); T.step(2);
    if (!V.f.length) { T.press('confirm'); T.step(2); }
    if (V.f.length) { V.f[0].lv = 3; V.f[1].lv = V.diff2; }
    ring = []; RL.round = j;
  }
  RL.setup = function (jobs) { RL.jobs = jobs; RL.ji = 0; RL.done = false; RL.clips = 0; RL.per = {}; part = 0; begin(jobs[0]); };
  async function send(frames, n) {
    for (let i = 0; i < frames.length; i += 30) {
      const chunk = frames.slice(i, i + 30), buf = new Uint8Array(chunk.length * W * H * 4);
      chunk.forEach((f, k) => buf.set(f, k * W * H * 4));
      await fetch('/__rec/reel_' + String(n).padStart(2, '0') + '_' + String(part++).padStart(3, '0') + '.raw', { method: 'POST', body: buf });
    }
  }
  RL.film = async function (ms) {
    const t0 = performance.now(), keep = G.ctx; RL.on = true; G.ctx = cx;
    try {
      while (!RL.done && performance.now() - t0 < (ms || 8000)) {
        if (V.phase === 'ko' || V.phase === 'result' || V.phase === 'menu' || !V.f.length || V.t > 60 * 70) {
          if (clip) { const c = clip; clip = null; await send(c.frames, c.n); }
          RL.ji++; if (RL.ji >= RL.jobs.length || RL.clips >= RL.max) { RL.done = true; break; }
          begin(RL.jobs[RL.ji]); continue;
        }
        I.raw = {}; G.tick();
        if (cap) cap.t--;
        // a new read by either bot?
        if (V.phase === 'fight') V.f.forEach(f => {
          const h = f.hc; if (!h || !h.why || h.whyT !== V.t || h.why === h.rlLast) return;
          h.rlLast = h.why; const m = h.why.match(KNOW); if (!m) return;
          const lab = m[1].replace(/ - ?$/, '').trim();
          if (clip) { if (clip.left < 50 && clip.frames.length < MAXLEN - 40) clip.left += 40; cap = { s: D.heroes[f.hero].name.toUpperCase() + ':  ' + h.why.split('  ')[0], sub: SUB[lab] || '', t: 70 }; return; }
          if ((RL.per[lab] || 0) >= RL.perMax || RL.clips >= RL.max) return;
          RL.per[lab] = (RL.per[lab] || 0) + 1;
          clip = { n: RL.clips++, frames: ring.slice(), left: POST, lab };
          cap = { s: D.heroes[f.hero].name.toUpperCase() + ':  ' + h.why.split('  ')[0], sub: SUB[lab] || '', t: 70 };
          RL.log.push(clip.n + ' ' + RL.round.a + ' v ' + RL.round.b + ': ' + h.why);
        });
        if (SW.frame % 2) continue;
        G.render();
        const img = cx.getImageData(0, 0, W, H).data;
        if (clip) {
          clip.frames.push(new Uint8Array(img)); clip.left--;
          if (clip.left <= 0 || clip.frames.length >= MAXLEN) { const c = clip; clip = null; await send(c.frames, c.n); }
        } else { ring.push(new Uint8Array(img)); if (ring.length > PRE) ring.shift(); }
      }
    } finally { G.ctx = keep; RL.on = false; }
    return { done: RL.done, clips: RL.clips, job: RL.ji + '/' + RL.jobs.length };
  };
})();
