'use strict';
// Shattered Worlds — online rooms. Loaded last; only adds and wraps. Needs js/vendor/peerjs.min.js (PeerJS 1.5.4, MIT).
//   Title > Online: HOST A ROOM gives a 6-digit room number (and, if the host wants, a 4-digit passcode); a friend picks
//   JOIN A ROOM, types the number (and the passcode) and is in. Then they play Versus, Player vs Player (1 vs 1 or 3 vs 3):
//   the host is Player 1 and runs the game; the guest is Player 2.
//   How: the two browsers connect directly (WebRTC). The host's game picture and sound are streamed to the guest like a
//   video call, and the guest's buttons are sent back, so the game itself runs only once and cannot fall out of step.
//   The guest uses the normal controls (WASD, J K L U I O, or the touch buttons); the host feeds them in as Player 2.
//   The guest also picks their own hero. Menus stay with the host.
//   The room number is only looked up through PeerJS's public matching server; no game data goes through it. The
//   passcode is checked by the host's browser; five wrong tries lock the room for a minute.
//   If the guest leaves (or goes silent for 6 s) during a match, a bot plays Player 2 to the end of it; a guest who
//   rejoins in time takes their fighter back. If the host's game tab goes to the background (the game pauses), or the
//   picture stalls, the guest is told why.
//   Limits: one guest per room; the guest sees the game a moment late (a video delay, usually well under a fifth of a
//   second); some strict networks block direct connections, and then joining fails with a message.
(function () {
  const SW = window.SW, G = SW.game, I = SW.input, ui = SW.ui, V = SW.versus;
  if (!V || !window.Peer) return;
  const tr = s => (SW.i18n && SW.i18n.tr ? SW.i18n.tr(s) : s);
  const PREFIX = 'shattered-worlds-room-', ACTIONS = ['left', 'right', 'up', 'down', 'attack', 'jump', 'dash', 'skill', 'special', 'awaken', 'throw', 'confirm', 'pause'];
  const P2 = { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', attack: 'Numpad1', jump: 'Numpad2', dash: 'Numpad3', skill: 'Numpad4', special: 'Numpad5', awaken: 'Numpad6' };
  const ON = SW.online = { role: null, code: null, peer: null, conn: null, call: null, remote: {}, status: '' };

  // ================= the panel (plain HTML over the game, so phones get their own keyboard) =================
  const css = document.createElement('style');
  css.textContent = '#swo{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;background:rgba(5,6,12,.86);font:14px monospace;color:#fff}' +
    '#swo .box{background:#11131f;border:1px solid #f5c542;padding:16px;width:min(320px,90vw);box-sizing:border-box}#swo h2{margin:0 0 10px;font-size:16px;color:#f5c542}' +
    '#swo button{font:14px monospace;background:#1c2034;color:#fff;border:1px solid #5a6078;padding:8px 10px;margin:4px 4px 4px 0;cursor:pointer}#swo button.go{border-color:#f5c542;color:#f5c542}' +
    '#swo input{font:18px monospace;width:100%;box-sizing:border-box;background:#05060c;color:#fff;border:1px solid #5a6078;padding:6px;margin:4px 0 8px;letter-spacing:3px}' +
    '#swo label{color:#bfe8ff;font-size:12px}#swo .big{font-size:30px;letter-spacing:6px;color:#f5c542;margin:6px 0}#swo .msg{color:#ff8a8a;min-height:18px;font-size:12px;margin-top:6px}#swo p{margin:6px 0;font-size:12px;color:#c8ccd8}' +
    '#swochip{position:fixed;left:6px;top:6px;z-index:40;display:none;font:11px monospace;color:#fff;background:rgba(5,6,12,.8);border:1px solid #f5c542;padding:3px 6px}#swochip button{font:11px monospace;margin-left:6px;background:#1c2034;color:#fff;border:1px solid #5a6078;cursor:pointer}';
  document.head.appendChild(css);
  const el = document.createElement('div'); el.id = 'swo'; document.body.appendChild(el);
  const chip = document.createElement('div'); chip.id = 'swochip'; document.body.appendChild(chip);
  let open = false;
  const show = html => { el.innerHTML = '<div class="box">' + html + '</div>'; el.style.display = 'flex'; open = true; };
  const hide = () => { el.style.display = 'none'; open = false; };
  const $ = id => el.querySelector('#' + id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const digits = (v, n) => String(v || '').replace(/\D/g, '').slice(0, n);
  function setChip(text) { if (!text) { chip.style.display = 'none'; return; } chip.innerHTML = esc(text) + '<button id="swoleave">' + esc(tr('Leave')) + '</button>'; chip.style.display = 'block'; chip.querySelector('#swoleave').onclick = () => leave(); }
  // typing in the panel must not reach the game's key handlers
  ['keydown', 'keyup'].forEach(t => window.addEventListener(t, e => { if (open) e.stopImmediatePropagation(); }, true));

  function menu(msg) {
    show('<h2>' + esc(tr('ONLINE')) + '</h2><p>' + esc(tr('Play Versus with a friend over the internet. One of you hosts a room, the other joins it.')) + '</p>' +
      '<button class="go" id="h">' + esc(tr('HOST A ROOM')) + '</button><button class="go" id="j">' + esc(tr('JOIN A ROOM')) + '</button><button id="x">' + esc(tr('Back')) + '</button><div class="msg">' + esc(msg || '') + '</div>');
    $('h').onclick = hostForm; $('j').onclick = () => joinForm(); $('x').onclick = hide;
  }
  function hostForm() {
    show('<h2>' + esc(tr('HOST A ROOM')) + '</h2><label>' + esc(tr('Passcode: 4 digits, or leave empty for none')) + '</label><input id="p" inputmode="numeric" maxlength="4" autocomplete="off">' +
      '<button class="go" id="go">' + esc(tr('Open the room')) + '</button><button id="x">' + esc(tr('Back')) + '</button><div class="msg" id="m"></div>');
    $('p').oninput = e => { e.target.value = digits(e.target.value, 4); };
    $('x').onclick = () => menu();
    $('go').onclick = () => { const p = $('p').value; if (p && p.length !== 4) { $('m').textContent = tr('A passcode is 4 digits.'); return; } host(p); };
  }
  function joinForm(msg, code) {
    show('<h2>' + esc(tr('JOIN A ROOM')) + '</h2><label>' + esc(tr('Room number')) + '</label><input id="c" inputmode="numeric" maxlength="6" autocomplete="off" value="' + esc(code || '') + '">' +
      '<label>' + esc(tr('Passcode, if the room has one')) + '</label><input id="p" inputmode="numeric" maxlength="4" autocomplete="off">' +
      '<button class="go" id="go">' + esc(tr('Join')) + '</button><button id="x">' + esc(tr('Back')) + '</button><div class="msg" id="m">' + esc(msg || '') + '</div>');
    $('c').oninput = e => { e.target.value = digits(e.target.value, 6); }; $('p').oninput = e => { e.target.value = digits(e.target.value, 4); };
    $('x').onclick = () => { leave(true); menu(); };
    $('go').onclick = () => { const c = $('c').value; if (c.length !== 6) { $('m').textContent = tr('A room number is 6 digits.'); return; } join(c, $('p').value); };
  }

  // ================= hosting =================
  let pass = '', wrong = 0, lockedUntil = 0, stream = null;
  // The picture: the entrance splash, an ultimate's cut-in and a finisher change the whole screen at once. On a real
  // connection WebRTC starts low and learns the line's speed from what is sent; after a quiet menu its guess is low, and
  // those big frames came out dropped or frozen while the plain fight streamed fine. So: start high, keep a floor, keep
  // the frames coming (soften the picture for a moment rather than skip frames), and say it is motion, not a still.
  // the bitrate hints go on every video codec's format line (both the host's offer and the guest's answer carry them;
  // Chrome reads them from the other side's description)
  const XG = 'x-google-start-bitrate=1800;x-google-min-bitrate=700;x-google-max-bitrate=4000';
  function boost(sdp) {
    try {
      const L = sdp.split('\r\n'), codec = {}, hasF = {};
      let v = false;
      for (const l of L) {
        if (l.startsWith('m=')) v = l.startsWith('m=video');
        let m;
        if (v && (m = /^a=rtpmap:(\d+) (VP8|VP9|H264|AV1)\//i.exec(l))) codec[m[1]] = true;
        if ((m = /^a=fmtp:(\d+) /.exec(l))) hasF[m[1]] = true;
      }
      const out = [];
      for (const l of L) {
        const f = /^a=fmtp:(\d+) /.exec(l), r = /^a=rtpmap:(\d+) /.exec(l);
        if (f && codec[f[1]] && l.indexOf('x-google') < 0) { out.push(l + ';' + XG); continue; }
        out.push(l);
        if (r && codec[r[1]] && !hasF[r[1]]) out.push('a=fmtp:' + r[1] + ' ' + XG);   // VP8 has no format line of its own
      }
      return out.join('\r\n');
    } catch (e) { return sdp; }
  }
  function tuneSender(call) {
    try {
      const pc = call && call.peerConnection; if (!pc) return;
      pc.getSenders().forEach(s => {
        if (!s.track || s.track.kind !== 'video') return;
        try { s.track.contentHint = 'motion'; } catch (e) { /* older browsers */ }
        const p = s.getParameters(); if (!p.encodings || !p.encodings.length) p.encodings = [{}];
        p.encodings[0].maxBitrate = 4000000; p.encodings[0].maxFramerate = 30; p.degradationPreference = 'maintain-framerate';
        s.setParameters(p).catch(() => { /* keep the defaults */ });
      });
    } catch (e) { /* the defaults still work */ }
  }
  function hostStream() {
    const s = G.canvas.captureStream(30), a = SW.audio;
    try { if (a && a.ctx && a.sfxG && a.musG) { const d = a.ctx.createMediaStreamDestination(); a.sfxG.connect(d); a.musG.connect(d); d.stream.getAudioTracks().forEach(t => s.addTrack(t)); } } catch (e) { /* picture only */ }
    return s;
  }
  function host(p, tries) {
    leave(true);
    try { if (SW.audio.unlock) SW.audio.unlock(); } catch (e) { /* no sound */ }   // the click that opens the room starts the sound, so it can be streamed
    const code = String(Math.floor(100000 + Math.random() * 900000));
    show('<h2>' + esc(tr('HOST A ROOM')) + '</h2><p>' + esc(tr('Opening the room...')) + '</p>');
    const peer = new window.Peer(PREFIX + code);
    ON.peer = peer; ON.role = 'host'; ON.code = code; pass = p || ''; wrong = 0; lockedUntil = 0;
    peer.on('open', () => {
      show('<h2>' + esc(tr('ROOM OPEN')) + '</h2><p>' + esc(tr('Room number')) + '</p><div class="big">' + code + '</div><p>' + esc(pass ? tr('Passcode') + ': ' + pass : tr('No passcode: anyone with the number can join.')) + '</p>' +
        '<p>' + esc(tr('Tell your friend the number. Waiting for them to join...')) + '</p><button id="x">' + esc(tr('Close the room')) + '</button>');
      $('x').onclick = () => { leave(); menu(); };
      setChip(tr('Room') + ' ' + code);
    });
    peer.on('error', e => { if (e && e.type === 'unavailable-id' && (tries || 0) < 4) return host(p, (tries || 0) + 1); if (ON.conn) return; leave(true); menu(tr('Could not open a room. Check your connection and try again.')); });
    peer.on('connection', conn => {
      conn.on('data', d => {
        if (!d || typeof d !== 'object') return;
        if (d.t === 'hello') {
          if (ON.conn && ON.conn !== conn) { conn.send({ t: 'no', why: 'full' }); return setTimeout(() => conn.close(), 300); }
          if (Date.now() < lockedUntil) { conn.send({ t: 'no', why: 'locked' }); return setTimeout(() => conn.close(), 300); }
          if (pass && String(d.pass || '') !== pass) { if (++wrong >= 5) { wrong = 0; lockedUntil = Date.now() + 60000; } conn.send({ t: 'no', why: 'pass' }); return setTimeout(() => conn.close(), 300); }
          ON.conn = conn; wrong = 0; ON.lastMsg = Date.now(); conn.send({ t: 'ok' }); conn.send({ t: document.hidden ? 'away' : 'back' });
          if (ON.botP2) { ON.botP2 = false; if (V.f && V.f[1]) V.f[1].bot = false; toast(tr('Player 2 is back.')); }   // back in time to take their fighter back
          stream = stream || hostStream(); ON.call = peer.call(conn.peer, stream, { sdpTransform: boost });
          const c0 = ON.call; let n = 0; const tt = setInterval(() => { if (ON.call !== c0 || ++n > 20) return clearInterval(tt); const pc = c0.peerConnection; if (pc && pc.getSenders().some(s => s.track && s.track.kind === 'video')) { tuneSender(c0); clearInterval(tt); } }, 250);
          hide(); setChip(tr('Room') + ' ' + code + ' - ' + tr('Player 2 is here'));
          if (G.scene === 'title') { G.overlay = null; V.open(G); V.mode = 'pvp'; }
        } else if (conn === ON.conn) ON.lastMsg = Date.now();
        if (d.t === 'k' && conn === ON.conn && d.a && typeof d.a === 'object') { const r = {}; ACTIONS.forEach(a => { if (d.a[a]) r[a] = true; }); ON.remote = r; }
      });
      conn.on('close', () => {
        if (conn !== ON.conn) return;
        ON.conn = null; ON.remote = {}; clearP2(); setChip(tr('Room') + ' ' + code + ' - ' + tr('Player 2 left'));
        if (inMatch() && V.f[1]) { ON.botP2 = true; V.f[1].bot = true; toast(tr('Player 2 left: a bot plays for them.')); }   // the match goes on
      });
    });
  }
  const clearP2 = () => { Object.keys(P2).forEach(a => { I.raw[P2[a]] = false; }); };
  const inMatch = () => G.scene === 'vs' && V.f && V.f[0] && ['menu', 'pick', 'order'].indexOf(V.phase) < 0;
  let note = null;
  function toast(text) { note = { text, t: 240 }; }
  document.addEventListener('visibilitychange', () => { if (ON.role === 'host' && ON.conn) try { ON.conn.send({ t: document.hidden ? 'away' : 'back' }); } catch (e) { /* closed */ } });
  let fed = {}, denied = false;
  // every tick on the host: the guest's buttons become Player 2's keys; on the hero select the guest picks for themself
  const _iu = I.update; I.update = function () {
    if (ON.role === 'host' && ON.botP2) { if (!inMatch()) ON.botP2 = false; else if (V.f[1] && !V.f[1].bot) V.f[1].bot = true; }   // in 3 vs 3, each next fighter too
    if (ON.role === 'host' && ON.conn && Date.now() - (ON.lastMsg || 0) > 6000) { try { ON.conn.close(); } catch (e) { /* gone */ } }   // silent for 6 s: gone
    if (ON.role === 'host' && ON.conn) {
      const r = ON.remote, inFight = G.scene === 'vs' && V.f && ['intro', 'fight', 'ko'].indexOf(V.phase) >= 0;
      Object.keys(P2).forEach(a => { I.raw[P2[a]] = !!(inFight && (r[a] || (r.throw && (a === 'attack' || a === 'dash')))); });
      if (G.scene === 'vs' && V.phase === 'menu' && V.mode !== 'pvp') V.mode = 'pvp';   // with a guest in the room, Versus stays Player vs Player
      const picking = G.scene === 'vs' && V.phase === 'pick' && V.mode === 'pvp' && V.step === 1;
      // the guest's turn on the hero select: only the guest's buttons move that cursor
      // a hero still locked on the host's game is refused (the unlock code box would ask the host's keyboard, not the guest)
      const D = SW.data, HR = D.heroes, id = picking && D.heroOrder[V.pick[1]], deny = !!(id && HR[id] && (HR[id].clan ? !(SW.profile && SW.profile.all) : HR[id].legend && G.unlocked && !G.unlocked(id)));
      if (deny && (r.attack || r.confirm) && !denied) { try { SW.audio.sfx('deny'); } catch (e) { /* silent */ } }
      denied = !!(deny && (r.attack || r.confirm));
      ['left', 'right', 'up', 'down', 'attack', 'confirm', 'skill', 'pause'].forEach(a => { if (picking) { I.down[a] = !!r[a] && !(deny && (a === 'attack' || a === 'confirm')); fed[a] = true; } else if (fed[a]) { I.down[a] = false; fed[a] = false; } });
    }
    const out = _iu.apply(this, arguments);
    // the Online entry on the title screen
    if (G.scene === 'title' && !G.overlay && !open && !ON.role) { const it = ui.titleItems(G)[ui.title.sel]; if (it && it[1] === 'online' && I.ok()) { ['confirm', 'attack', 'interact'].forEach(a => { I.prev[a] = true; }); menu(); } }
    if (open) { I.now = {}; }
    return out;
  };
  // Online goes just above the last line (Controls), never above Difficulty: difficulty.js reads the selected row from
  // its own (shorter) list, so a line put in above it would make choosing Online change the difficulty instead.
  const _ti = ui.titleItems; ui.titleItems = function (g) { const a = _ti.apply(this, arguments); a.splice(Math.max(0, a.length - 1), 0, ['Online', 'online']); return a; };

  // ================= joining =================
  let video = null, sendT = null, last = '', beat = 0, hostAway = false, seenT = -1, seenAt = 0, byeSeen = false, statAt = 0, lastStat = null;
  // the room label on the guest's screen says how the picture is arriving: frames a second, and how often it froze
  function pictureRate(code) {
    const pc = ON.call && ON.call.peerConnection;
    if (!pc || !pc.getStats) return;
    pc.getStats().then(st => {
      let r = null; st.forEach(x => { if (x.type === 'inbound-rtp' && x.kind === 'video') r = x; });
      if (!r || ON.role !== 'guest') return;
      const prev = lastStat; lastStat = { f: r.framesDecoded || 0, t: Date.now(), fz: r.freezeCount || 0 };
      if (!prev) return;
      const fps = Math.round((lastStat.f - prev.f) * 1000 / Math.max(1, lastStat.t - prev.t)), froze = lastStat.fz > prev.fz;
      setChip(tr('Room') + ' ' + code + ' - ' + tr('You are Player 2') + ' - ' + tr('Picture') + ': ' + fps + ' fps' + (froze || fps < 15 ? ' (' + tr('slow') + ')' : ''));
    }).catch(() => {});
  }
  function join(code, p) {
    leave(true);
    show('<h2>' + esc(tr('JOIN A ROOM')) + '</h2><p>' + esc(tr('Looking for the room...')) + '</p>');
    const peer = new window.Peer(); ON.peer = peer; ON.role = 'guest'; ON.code = code;
    const fail = msg => { leave(true); joinForm(msg, code); };
    const timer = setTimeout(() => { if (ON.role === 'guest' && !video) fail(tr('No answer from that room. Check the number, or the network may be blocking the connection.')); }, 15000);
    peer.on('error', e => { clearTimeout(timer); if (video) return; fail(e && e.type === 'peer-unavailable' ? tr('There is no room with that number.') : tr('Could not connect. Check your connection and try again.')); });
    peer.on('open', () => {
      const conn = peer.connect(PREFIX + code, { reliable: true }); ON.conn = conn;
      conn.on('open', () => conn.send({ t: 'hello', pass: p || '' }));
      conn.on('data', d => { if (d && (d.t === 'away' || d.t === 'back')) { hostAway = d.t === 'away'; return; } if (d && d.t === 'bye') { byeSeen = true; return; } if (d && d.t === 'no') { clearTimeout(timer); fail(d.why === 'pass' ? tr('Wrong passcode.') : d.why === 'locked' ? tr('Too many wrong passcodes. Try again in a minute.') : tr('That room already has two players.')); } });
      conn.on('close', () => { if (ON.role === 'guest' && video) { const why = byeSeen ? tr('The host closed the room.') : tr('The connection to the room was lost.'); leave(true); menu(why); } });
    });
    peer.on('call', call => {
      clearTimeout(timer); ON.call = call; call.answer(undefined, { sdpTransform: boost });
      call.on('stream', s => {
        if (video) return;
        video = document.createElement('video'); video.autoplay = true; video.playsInline = true; video.srcObject = s;
        video.style.cssText = 'position:fixed;left:-9999px;width:2px;height:2px'; document.body.appendChild(video);
        video.play().catch(() => { video.muted = true; video.play().catch(() => {}); const un = () => { if (video) { video.muted = false; } window.removeEventListener('pointerdown', un); window.removeEventListener('keydown', un); }; window.addEventListener('pointerdown', un); window.addEventListener('keydown', un); });
        hide(); G.manualKeep = G.manual; G.manual = true; try { SW.audio.music(null); } catch (e) { /* silent */ } try { if (SW.audio.musG) SW.audio.musG.gain.value = 0; } catch (e) { /* none */ }
        setChip(tr('Room') + ' ' + code + ' - ' + tr('You are Player 2'));
        sendT = setInterval(() => {   // the guest's buttons, sent when they change (and twice a second anyway)
          _iu.call(I); const a = {}; ACTIONS.forEach(k => { if (I.now[k]) a[k] = 1; });
          const key = Object.keys(a).join(','), now = Date.now(); if (key !== last || now - beat > 1000) { last = key; beat = now; try { ON.conn.send({ t: 'k', a }); } catch (e) { /* closed */ } }
          if (video.currentTime !== seenT) { seenT = video.currentTime; seenAt = now; }
          if (now - statAt > 2000) { statAt = now; pictureRate(code); }
        }, 16);
      });
    });
  }
  // the guest's screen is the host's picture (the guest's own game sits on its title screen, not ticking).
  // Put in once every script has loaded, so it is the outermost: files loaded after this one also draw on the title
  // screen (Hero Stories redraws the menu's last lines), and none of that may land on top of the host's picture.
  const pictureOver = () => { const _dt = ui.drawTitle; ui.drawTitle = function (ctx) {
    if (ON.role === 'guest' && video) {
      ctx.imageSmoothingEnabled = false; if (video.readyState >= 2) ctx.drawImage(video, 0, 0, SW.W, SW.H); else SW.art.rect(ctx, '#05060c', 0, 0, SW.W, SW.H);
      const stalled = seenAt && Date.now() - seenAt > 2500;
      if (hostAway || stalled) {   // say why the picture has stopped
        ctx.globalAlpha = 0.7; SW.art.rect(ctx, '#05060c', 0, SW.H / 2 - 24, SW.W, 48); ctx.globalAlpha = 1;
        SW.text(ctx, hostAway ? "The host's game is paused." : "Waiting for the host's picture...", SW.W / 2, SW.H / 2 - 12, '#f5c542', { align: 'center' });
        SW.text(ctx, hostAway ? 'Their game tab is in the background.' : 'Their connection may be slow.', SW.W / 2, SW.H / 2 + 4, '#c8ccd8', { align: 'center' });
      }
      return;
    }
    return _dt.apply(this, arguments);
  }; };
  if (document.readyState === 'complete') pictureOver(); else window.addEventListener('load', pictureOver);

  function leave(quiet) {
    const wasGuest = ON.role === 'guest' && video;
    if (sendT) { clearInterval(sendT); sendT = null; }
    const c = ON.conn, call = ON.call, peer = ON.peer, shut = () => { try { if (call) call.close(); } catch (e) { /* gone */ } try { if (c) c.close(); } catch (e) { /* gone */ } try { if (peer) peer.destroy(); } catch (e) { /* gone */ } };
    if (ON.role === 'host' && c) { try { c.send({ t: 'bye' }); } catch (e) { /* gone */ } setTimeout(shut, 300); }   // the goodbye first, so the guest can tell a closed room from a lost line
    else shut();
    if (video) { try { video.srcObject = null; video.remove(); } catch (e) { /* gone */ } video = null; }
    if (ON.role === 'host') clearP2();
    ON.role = null; ON.peer = null; ON.conn = null; ON.call = null; ON.code = null; ON.remote = {}; ON.botP2 = false; last = ''; hostAway = false; seenT = -1; seenAt = 0; byeSeen = false; statAt = 0; lastStat = null;
    setChip('');
    if (wasGuest) { G.manual = !!G.manualKeep; try { SW.audio.setVol(); } catch (e) { /* none */ } try { G.toTitle(); } catch (e) { /* none */ } }
    if (!quiet) hide();
  }
  const _vd = V.draw; V.draw = function (ctx) {
    _vd.apply(this, arguments);
    if (!note) return;
    if (--note.t <= 0) { note = null; return; }
    ctx.globalAlpha = Math.min(1, note.t / 20); SW.art.rect(ctx, '#05060c', SW.W / 2 - 150, 58, 300, 14); SW.text(ctx, note.text, SW.W / 2, 61, '#f5c542', { align: 'center' }); ctx.globalAlpha = 1;
  };
  ON.leave = leave; ON.menu = menu;
})();
