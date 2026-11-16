'use strict';
// Shattered Worlds — ACT 4: ROOTS AND TETHERS, the words. Loaded right after story-roots.js; only adds and wraps.
(function () {
  const SW = window.SW, D = SW.data, L = D.dialogue, story = SW.story;
  if (!story || !story.roots) return;
  const say = (s, t, o) => Object.assign({ s, t }, o || {});

  const HERO_GRANE = {
    kael: "Roots, pipes, a lady with a stick. I've fought weirder. Probably.", nyra: 'You are bleeding a living thing to light a city. I lived in that city. Stop.',
    fenn: 'The roots smell afraid. I know that smell. I was in a cage once.', isolde: 'Roots stop growing when it gets cold enough. Shall we find out how cold?',
    brakk: 'I dug in the rock for years. Nothing down here ever needed hurting. You found a way.', pyra: 'Roots, huh? Funny thing about roots. They burn all the way down.',
    gale: 'There is no wind down here. I brought my own.', ashka: 'You run pipes into something alive and call it a power station. I was one of those once.',
    dyna: "Lady, I've got a bag full of things that go boom and a lot of feelings about your pipes.", vesper: 'You listen to the roots. Good. Listen harder. You will not hear me.',
    orin: 'There is a door under everything. You put a valve on it.', mira: 'Your staff is grown over. So is your face. You have been down here a long time.',
    noct: '...', bando: "Put the stick down. I'll still hit you, but I'll feel better about it.", aldric: 'A warden guards what is in her keeping. You have been robbing it.',
    sen: 'Roots bend. My blade does not.', vega: 'Everything you have pulled up out of the deep wants to go back down. I can help with that.',
    tessa: 'I have seen how this cave ends. You are not in it.', jax: "You tapped the house's water, lady. The house always notices.",
    ferra: 'Your pipes are screaming. Rotten welds, every one. I can hear them from here.', kiri: 'Your roots and my shadows. Let us see who has more of them.',
    tarn: "You're standing between me and the way up. Move.", maren: 'You call this tending? I have seen better care in a war hospital. I worked in one.',
    yara: 'I can see the tap in your staff from here. I could shoot it out. I would rather watch you drop it.', brann: 'Leave the roots alone.'
  };
  const HERO_ORRO = {
    kael: 'You walk a rope over nothing all day? Respect. Now get off it.', nyra: 'I lived up there. I never once asked what held it up. I am asking you.',
    fenn: 'You smell of oil and high wind. And fear. Good.', isolde: 'I grew up above the clouds. Heights do not frighten me. You might.',
    brakk: 'A cable this thick. Strong. Like a man who thinks he cannot be moved.', pyra: "Big tower, lots of oil, one signal fire. I've been looking forward to this all day.",
    gale: 'Your wind is my wind, Linewarden. Watch whose side it takes.', ashka: 'That pipe is carrying heat up to the sky. I can feel it through my boots. Give it here.',
    dyna: 'Fun fact: everything up this high falls a really long way.', vesper: 'You watch the road all day. You never once looked behind you.',
    orin: 'Every line has two ends. I came from the other one.', mira: 'You polish that helmet every morning. I can see myself in it. I look angry.',
    noct: '...', bando: 'Eleven years up a pole? Pal, come down and have a sandwich. After this.', aldric: 'You have kept your post well. Yield it with honour.',
    sen: 'You hold the high ground. I have cut down men on higher.', vega: 'Down is my favourite direction. You are about to learn why.',
    tessa: 'You fall off this tower in about a minute. I am sorry. I like your hat.', jax: 'Eleven years on one line? Friend, you need a new game.',
    ferra: 'Your line is singing out of tune. Halcyon has been cheap with your bolts.', kiri: 'One of you on the cable, two of me on the deck. Count again.',
    tarn: "I've walked further than eleven years. You're in my road.", maren: "Eleven years in wind like this? Your joints are a disaster. I'll look at them after.",
    yara: 'I had you in my sights from the field below. I let you keep your beacon a little longer.', brann: 'Come down off the line.'
  };

  Object.assign(L, {
    // ----- Scrapton, between jobs -----
    r_rt_marlo: [say('marlo', "The crack is at the bottom of the Metro Shaft, by the junction. Water doesn't run out of Deepline on its own. Something down there is drinking it. Find out what, then go and win me that army.")],
    r_tf_marlo: [
      say('marlo', "The army's camped on the Skylift road, and it can't march in daylight. Halcyon has spotters on the tether anchors along that road. One flash of their beacons and the gate is ready for us."),
      say('marlo', 'Cut the beacons. Then climb the big tether at the end and light a fire up top, so every crew on the road knows it is time.')
    ],
    // ----- RT-1, the Old Metro -----
    rt_crack: [
      say('sys', 'At the foot of the Metro Shaft the tunnel floor has split open. Pale green light leaks up through the crack, and water from the sludge channels runs into it with a hiss, down into the dark.'),
      say('partner', { K: 'Water does not fall out of a city on its own. Something down there is drinking it.', N: "That's Deepline's water going down that hole. Somebody down there has a straw in it." }),
      say('hero', { K: "Halcyon ropes on the edge. Fresh ones. Let's see where they go.", N: '(Halcyon rope on the edge, still new.) We follow it down.' })
    ],
    // ----- RT-1, the Roots -----
    rt_stair: [
      say('sys', 'Below Deepline the rock gives way to roots: pale, as thick as tunnels, glowing from the inside. They twist down out of sight, and Halcyon pipes are clamped to them all the way down.'),
      say('sys', 'Where the roots twitch, light gathers in the floor first. Get off it before it brightens.')
    ],
    rt_floor: [
      say('sys', 'The bottom of the stair. The roots run east into a long tunnel, and the pipes go with them.'),
      say('partner', { K: 'They are hurt. Listen. Every root down here is humming the same note.', N: "Hear that hum? It's coming out of the roots. Like they're straining." })
    ],
    rt_ways: [
      say('sys', 'The Rootways. Halcyon has driven taps into the biggest roots: steel valves, pipes running up through the rock. Wherever a tap bleeds light, the roots around it thrash and tear loose.'),
      say('sys', 'Shut each tap: hit the valve wheel at its foot.')
    ],
    rt_taps: [
      say('sys', 'The last valve wheel spins shut. Up and down the tunnel the roots go still, and the light in them steadies.'),
      say('partner', { K: 'Better. ...Someone is coming to see why the pressure dropped.', N: "That's done it. Pressure's dropped. Somebody's going to come and see why." })
    ],
    rt_grane_in: [
      say('sys', 'At the end of the Rootways the tunnel opens into a cave around a single root, wider than a house, beating with slow light. A woman in a stained Halcyon lab coat stands in front of it, her staff grown over with green.'),
      say('grane', 'Three taps shut. Do you know how long it took to coax those roots into giving?'),
      say('grane', 'Careful where you step. Everything down here is alive, and all of it listens to me.'),
      say('hero', HERO_GRANE),
      say('sys', 'ROOT WARDEN GRANE. When the floor under you starts to glow, move: roots come up where the light gathers.')
    ],
    rt_grane_win: [
      say('grane', 'You think a city floats on good intentions? Aurelia drinks. It always has. Shut three taps and there are three hundred more.'),
      say('sys', 'Grane drives her staff into the root. It answers: a wall of tendrils closes in front of her, and when it opens again she is gone, up the pipes.'),
      say('sys', 'The great root is still beating. It is the only light left in the cave.')
    ],
    rt_heart: [
      say('sys', 'You put your hand on the heartroot. Light runs up your arm and you are somewhere else: one country under one sky, no Deepline, no Aurelia. Then a white flash, the ground tears open, and these roots come pouring through the wound.'),
      say('sys', 'You are back. Your hand is shaking. Along the walls the Halcyon pipes climb up through the rock, toward the Surface.'),
      say('partner', { K: 'The pipes go up to the Tether Fields, the great cables along the Skylift road. That is what holds Aurelia steady... and this is what it drinks.', N: "They run up to the Tether Fields. The big cables along the Skylift road. So that's how the sky city stays up. It drinks this." }),
      say('hero', { K: "Then Deepline should hear about this. All of it. Let's go and win them in the Pit.", N: 'Deepline will want to know who has been drinking their water. The Pit, then.' }),
      say('sys', 'The tap-pipe lift at the back of the cave runs up to the Old Metro.', { flag: 'rt_heart', step: 'RT-1:heart' })
    ],
    // ----- TF-1, the Tether Fields -----
    tf_fields: [
      say('sys', 'The Tether Fields. Cables as thick as towers rise out of the plain at a slant, up into the clouds, to the underside of Aurelia. Along each one a pipe glows faintly green.'),
      say('partner', { K: 'The pipes from the Roots. They climb the tethers all the way up.', N: 'There. The same pipes as down in the Roots, running up the cables.' }),
      say('sys', 'Halcyon spotter beacons sit on the anchor stones. Cut all three before they see the army. The wind comes off the cables in gusts: watch for the dust.')
    ],
    tf_beacons: [
      say('sys', 'The last beacon goes dark. Far down the road behind you, someone in the army waves a rag on a stick.'),
      say('partner', { K: 'The great anchor at the end of the field. Its tether has a maintenance ladder. We climb.', N: "Right. The big anchor at the end of the field. There's a ladder up its tether. Up we go." })
    ],
    tf_climb: [say('sys', 'The great tether. A maintenance ladder climbs the anchor tower beside it, platform after platform. The wind is stronger up here.')],
    tf_orro_in: [
      say('sys', 'The crown of the anchor: a flat stone deck, the tether humming beside it, the whole Rust Flats spread out below. A big man in Halcyon yellow clips a hook to the cable and turns round.'),
      say('orro', "Eleven years I've walked this line. Nobody climbs it but me."),
      say('orro', "Whatever you think is in these pipes, it's what keeps the sky up. Go home."),
      say('hero', HERO_ORRO),
      say('sys', 'LINEWARDEN ORRO. When he swings up onto the tether, watch the deck: his shadow shows where he will land.')
    ],
    tf_orro_win: [
      say('orro', "Hah... fine. Fine. Light your fire. They'll see it from the Skylift too, you know."),
      say('sys', 'Orro unclips his hook and lets the cable take him: a long hiss, and he is a speck sliding down toward the clouds.'),
      say('sys', "Halcyon's own signal brazier stands at the edge of the deck, full of oil. It will do.")
    ],
    tf_signal: [
      say('sys', 'You light the brazier. Fire roars up beside the tether, and far below on the Skylift road one fire answers, then ten, then a hundred.'),
      say('partner', { K: 'They are moving. All of them.', N: "Look at that. That's the whole Deep and half the Surface, marching." }),
      say('hero', { K: 'Then we meet them at the Skylift gate.', N: 'The Skylift gate, then. We should not keep them waiting.' }),
      say('sys', 'A zipline runs from the anchor crown down to the Skylift gate.', { flag: 'tf_signal', step: 'TF-1:signal', fn: 'card:act4end' })
    ]
  });

  // the war council now sends you past the crack on the way down; the Pit sends you on to the Tether Fields
  if (L.r_council && !L.r_council.some(l => l.rt)) L.r_council.push(say('marlo', "One more thing. Word came up the shaft this morning: the tunnel floor at the bottom split open in the night, and Deepline's water is running down into it. Have a look on your way to the Pit.", { rt: true }));
  if (L.p3_win) L.p3_win.forEach(l => { if (l.t === 'Take the news back up the shaft. The Skylift is the next road.') l.t = 'Take the news back up the shaft. Next, the Tether Fields along the Skylift road.'; });

  story.roots.words = { HERO_GRANE, HERO_ORRO };
})();
