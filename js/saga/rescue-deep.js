'use strict';
// Shattered Worlds - The Hollow Crown: the rescue scenes for the heroes of Deepline.
// Data only; js/saga/saga-rescue.js plays them. Speakers: 'hero' (the hero being played: any of the 48), 'sys'
// (narration), the rescued hero's id, the champion's id, 'vael'. {hero} in a line is the played hero's name.
(function () {
  const SG = window.SW && window.SW.saga; if (!SG) return;
  SG.rescueText = SG.rescueText || {};
  Object.assign(SG.rescueText, {

    // ---------------------------------------------------------------- KAEL (called)
    kael: {
      title: "The Sky That Dropped Him",
      place: "The Crusher Yard. Kael throws Vharra's storm at the Yard that raised him.",
      intro: [
        ['sys', "The Crusher Yard. Lightning walks the scrap piles, and every car door in the heap is scorched the same amber."],
        ['sys', "The Hollow Legion stands among the wrecks, grey and silent. Not one of them flinches when the thunder comes down."],
        ['hero', "That isn't a storm. That's someone shouting with nobody left to hear."],
        ['sys', "On top of the heap, under an empty crown of violet light, a white-haired boy stands perfectly quiet. Kael is never quiet."]],
      meet: [
        ['kael', "{hero}. Hear that? Under the noise. Thunderheads. Vharra's calling, and it knows my name."],
        ['kael', "Ferra says salvage. Rook says brother. Fenn says kin. That sky says son. Nobody down here ever said son."],
        ['vael', "Storm-child. The sky that dropped you wants you back. I keep every sky I take. Come home, and rain on them."],
        ['kael', "Step off the heap. I'm going home, and I'm taking the thunder with me."]],
      lose: [
        ['kael', "Down you go. Same as I did. The trash heap's soft, once you stop fighting it."]],
      win: [
        ['sys', "The crown cracks like a struck pane. The thunder stops halfway down and forgets which way it was going."],
        ['kael', "...It sounded like the thunderheads. Like home. I'd have followed it off the edge of the world."],
        ['kael', "I carved that storm-eye so I'd never forget which sky dropped me. Forgot which one caught me, though."],
        ['kael', "The Crater, right? The one with the crown over it. Put me at the front of the muster. I owe a crown some thunder."]],
      tie: {
        fenn: [
          ['hero', "Easy, kid. I said I'd stay till you could put a captain on his back alone. Looks like I'm staying a while yet."],
          ['kael', "Nobody asked for a big brother. ...Glad you came anyway, wolf man."]],
        nyra: [
          ['hero', "I saw your face on the feed once, wearing a lie. That wasn't the boy in front of me either."],
          ['kael', "Nyra. That's twice you've sung louder than my storm, and twice you've told me who I'm not."]],
        rook: [
          ['hero', "Brother! You went QUIET! You're never quiet! I brought six of me to shout you awake!"],
          ['kael', "Heard every one of you. Even the reprints."]],
        sable: [
          ['hero', "The air stopped humming round you. That's how I knew it wasn't you up there."],
          ['kael', "So you listen for me. In public. I'm telling everyone."]]
      }
    },

    // ---------------------------------------------------------------- ASHKA (called)
    ashka: {
      title: "The Furnace Gone Cold",
      place: "The Core Sump. Ashka lets the furnace die, and Deepline freezes above her.",
      intro: [
        ['sys', "The Core Sump. For the first time in years the furnace is dark, and frost climbs the pipes toward the Slums."],
        ['sys', "Legion soldiers stand in the cold ash like grey candles nobody lit."],
        ['sys', "At the bottom, under a crown of violet light, Ashka sits with her hands buried in the ashes. The ashes do not glow."]],
      meet: [
        ['ashka', "{hero}. Feel that? Deepline, cold. A year it slept warm on my pain, and never once asked whose pain it was."],
        ['vael', "Tender of the vents. Your harbour's fires went out long ago. Mine never do. Come home and keep them."],
        ['ashka', "He knows the vents. Red, warm, patient. He says no one will ever chain them again."],
        ['ashka', "Let the layers freeze. I have been their furnace. Now I go home to mine."]],
      lose: [
        ['ashka', "Cold, isn't it? Now you know a little of what I gave them. Lie there and learn the rest."]],
      win: [
        ['sys', "The crown breaks with a sound like ice on a harbour. In the ash, one coal turns red. Then another."],
        ['ashka', "...He spoke with the voice of the vents at home. To hear it once more, I would have let Deepline freeze."],
        ['ashka', "No. I said Deepline must learn to warm itself. Not that it must die cold."],
        ['sys', "The furnace catches. Far above, the frost on the pipes begins to weep."],
        ['ashka', "The Crater, then. That crown wants a fire to stand in. I will bring it one."]],
      tie: {
        fumi: [
          ['hero', "...Three taps. You didn't answer. First time in a year."],
          ['ashka', "I heard them. Through the cold, through his voice, I heard them. Tap back, boiler man. I'm here."]],
        pyra: [
          ['hero', "Hey. Sister. You let the fire go out? Nobody gets to do that. Not even you."],
          ['ashka', "Little spark. Sit with me. The chain is gone, and the ash reaches far enough for two."]]
      }
    },

    // ---------------------------------------------------------------- DYNA (walker)
    dyna: {
      title: "Fuse Against the Silence",
      place: "The Scrapworks. Dyna answers a silent army in the only language she has: boom.",
      intro: [
        ['sys', "The Scrapworks. The Legion came in without a sound. Dyna has been answering in sounds ever since."],
        ['dyna', "{hero}! Grab a crate and get behind it. Not that crate. That crate ticks."],
        ['dyna', "They don't shout, they don't scream, they don't even jump. It's like blowing up laundry."]],
      mid: [
        ['sys', "The ground shakes in a slow rhythm. A Siege Walker steps over the Scrapworks wall, legs like towers, its captain riding high."],
        ['dyna', "Oh. Oh, look at it. Do you know how much boom that is? Aim for the knees. I'll aim for everything."]],
      win: [
        ['sys', "The Walker kneels, then keeps kneeling, all the way down. Its captain lands in a bin of Dyna's spare fuses."],
        ['dyna', "Look at that crater. Look at the lip on it. Best one this year, and it's been a busy year."],
        ['dyna', "Nine worlds, all gone quiet. Somebody up there likes quiet. That's the saddest thing I ever heard."],
        ['dyna', "The Crater, right? Tell the muster to bring earplugs. I'm bringing everything that goes bang."]],
      tie: {
        bando: [
          ['hero', "Dyna! I reached across three tunnels to get here. Did I ever tell you about the kite?"],
          ['dyna', "Ten thousand and two, Bando. Tell it again at the Crater. Loudly. They hate loud."]],
        jax: [
          ['hero', "Six in the wheel, six of 'em down. Counted every one."],
          ['dyna', "And I counted the fuse, cowboy. Three, two, one. Told you timing's the whole art."]],
        mako: [
          ['hero', "Bomb girl. You okay?"],
          ['dyna', "Never better, big man. Shoulders free? I need a ride to the Crater."]]
      }
    },

    // ---------------------------------------------------------------- BANDO (legion)
    bando: {
      title: "The Long Arm of Deepline",
      place: "The Drowned Choir. Bando holds the Drowned Line, and every grey soldier is in reach.",
      intro: [
        ['sys', "The Drowned Choir. Black water to the knee, and grey-violet soldiers wading through it without a ripple."],
        ['bando', "{hero}! You came all this way? Good. I can reach them all. There's just an awful lot of them to reach."],
        ['bando', "Did I ever tell you about the kite? No? Great. Later. Duck!"]],
      mid: [
        ['bando', "Funny thing. They never laugh. I've told them the kite story twice now, and nothing. Tough crowd."]],
      win: [
        ['sys', "The last soldier goes under the black water and stays there. The tunnels drip and echo, the old Choir singing to itself."],
        ['bando', "Somebody up there has eaten nine worlds and never laughed once. Somebody ought to tell him a story."],
        ['bando', "The kite one. All the way to the Crater. That's a long way to reach. But look who you're talking to."]],
      tie: {
        dyna: [
          ['hero', "Bando! I blew a hole through two walls to get here. On purpose, mostly."],
          ['bando', "And I reached right through it. Like always. You blow, I reach."]],
        sora: [
          ['hero', "I came all the way down the Skylift shaft for you. That makes it a rescue. Say it."],
          ['bando', "Kite girl saved the long arm. ...I'm telling that one every day now. Every single day."]],
        tarek: [
          ['hero', "Your reach held. I measured it myself, in public. Don't tell anyone I said so."],
          ['bando', "Too late, chain-man. Everybody heard. Hang your chain on my dock, and let's go measure a crown."]]
      }
    },

    // ---------------------------------------------------------------- FERRA (walker)
    ferra: {
      title: "Every Scrap Answers",
      place: "The Crusher Yard. Ferra holds her Yard with fifty tonnes of scrap and a bad temper.",
      intro: [
        ['sys', "The Crusher Yard. Scrap hangs in the air like a held breath, and beneath it the Legion keeps walking in."],
        ['ferra', "{hero}. Good. Pick a pile. Anything with a bolt in it fights on our side."],
        ['ferra', "Empty soldiers. Not an ounce of iron in them. My scrap doesn't know what to make of that, so I'll tell it."]],
      mid: [
        ['sys', "A Siege Walker shoulders over the Yard wall, legs like towers, a captain riding high on its back."],
        ['ferra', "Now that is good steel. Wasted on a walk like that. I'll find it better work."]],
      win: [
        ['sys', "The Walker comes apart in Ferra's hands, plate by plate, and every plate finds a pile of its own."],
        ['ferra', "Scrap is scrap. A Walker is scrap. A crown's scrap too, once somebody takes it down off its shelf."],
        ['ferra', "The Crater? Yes. I've a mind to see what a hollow crown is made of. I decide what's worth saving."]],
      tie: {
        garo: [
          ['hero', "Ferra. Don't look round. It's still not much of a face."],
          ['ferra', "Wasn't going to. Steel up, bread down, big man. Tonight the steel goes to the Crater."]],
        vex: [
          ['hero', "You needed help. Say it. Louder. Slower."],
          ['ferra', "Never. ...You pulled that Walker's leg out from under it. Nicely done, boy. There. Once."]]
      }
    },

    // ---------------------------------------------------------------- SEN (champion: noct)
    sen: {
      title: "The Blade He Swore to See",
      place: "The Old Metro. Sen holds the last lamp against Noct, Vael's watchman of the dark.",
      intro: [
        ['sys', "The Old Metro. Every station lamp is out. One lamp still burns in the Rust Dojo, and Sen stands beneath it."],
        ['sys', "His white robe is cut in a dozen places. He did not see a single one of the cuts arrive."],
        ['sen', "{hero}. Take off your boots. Then stand in the light, and do not leave it."]],
      meet: [
        ['noct', "Swordsman. The lamp. Then you."],
        ['sen', "I swore to see your blade once. I have not seen it yet."],
        ['noct', "I keep the dark for a crown now. In nine worlds no one has seen it. You will not be the first."]],
      lose: [
        ['noct', "You looked into the wrong dark."]],
      win: [
        ['sys', "A thin teal line hangs in the air a hair's width from Sen's throat. Then it goes out."],
        ['noct', "...You saw it."],
        ['sen', "Once."],
        ['sys', "Noct steps back into the dark, and the dark carries him toward the Crown. Sen sweeps the platform where he stood."],
        ['sen', "The Crater. I will come. A crown with nothing inside it needs one clean line."]],
      tie: {
        isa: [
          ['hero', "I wrote you three pages on the way down. I tore them up. One word: alive?"],
          ['sen', "Alive. One line, as always."]],
        pell: [
          ['hero', "Swordsman. I came with strings, and no right to ask you to trust them."],
          ['sen', "Then do not ask. Sit. We will see how patient you have become."]],
        sable: [
          ['hero', "I was there before the cut, sensei. First. The way you taught me."],
          ['sen', "Yes. Now arrive."]]
      }
    },

    // ---------------------------------------------------------------- ROOK (champion: rue)
    rook: {
      title: "Far Too Many Rooks",
      place: "The Neon Market. Rook's clones fight Rook's clones, and Rue wears the grin.",
      intro: [
        ['sys', "The Neon Market, half its signs dead. Rooks fight Rooks in the aisles, and only one of them is bleeding."],
        ['rook', "{hero}! Great timing! Which one am I? No, seriously, I'm asking. I lost count an hour ago."],
        ['rook', "Legion's on the stalls. Clear the stalls, then help me find the real me. He's the handsome one."]],
      meet: [
        ['rue', "Rook. I copied your clones once. Far too many Rooks. Now there are exactly enough, and every one is mine."],
        ['rook', "You copied the trick. You never copied the part where they're friends."],
        ['rue', "Pell gave me other people's faces. He gives me a crown, and a crown is a face nobody can peel off."]],
      lose: [
        ['rue', "Seen it. Done it. Better. Get up, and I'll do you next."]],
      win: [
        ['sys', "Rue's copies go up in smoke one by one, until only the grinning Rook is left. Then it stops grinning."],
        ['rue', "Too many of you. Always too many. ...He'll give me a face of my own. He promised."],
        ['sys', "She runs for the Crater, wearing nobody. Rook's clones stand down and count off, loudly."],
        ['rook', "All present! Every one of me. Now we take the Crater, and give that crown a thousand reasons to fall off."]],
      tie: {
        kael: [
          ['hero', "Brother! Which one's you?"],
          ['rook', "The one who's glad to see you. Okay, that's all of us. The bleeding one."]],
        kiri: [
          ['hero', "Copy of a copy, Rook. She always gets lost in us. Told you it's efficient."],
          ['rook', "Paper girl! Two of you, a thousand of me. Now THAT's a crowd she can't wear."]],
        moro: [
          ['rook', "Moro! You came! Awake and everything!"],
          ['hero', "Mostly. She wore your face. I'll carry that one. You keep being loud."]],
        pell: [
          ['hero', "My best student. Still more of you than I counted."],
          ['rook', "You taught her my clones. Don't be proud. Walk in front, where I can see your strings."]]
      }
    },

    // ---------------------------------------------------------------- SABLE (called)
    sable: {
      title: "Nowhere Left to Run",
      place: "The Deepline Slums. Sable has stopped running, and her lightning falls for Vael.",
      intro: [
        ['sys', "The Deepline Slums, under the Skylift's roots. Violet lightning stands on every rooftop, and the air hums without end."],
        ['sys', "Grey soldiers hold the stairs. Behind the slum doors, nobody breathes."],
        ['sys', "In the open square, under a crown of violet light, Sable stands still: the one place she has never stood."]],
      meet: [
        ['sable', "{hero}. I ran from Pell. Then I ran at Pell. Every day, since the door."],
        ['vael', "Quiet one. You have run so long, and there is nowhere left to run. Stand with me, and arrive."],
        ['sable', "He's right. There's nowhere. So I stopped. It's very quiet, stopping."]],
      lose: [
        ['sable', "Already over. You hadn't noticed yet."]],
      win: [
        ['sys', "The crown splits with a crack of static. All over the Slums, the humming stops at once."],
        ['sable', "...He used Sen's words. Be there first, then arrive. He knew exactly where to put them."],
        ['sable', "Arriving isn't stopping. Sen would have swept the floor with him for that."],
        ['sable', "The Crater. I'll be there first."]],
      tie: {
        kael: [
          ['hero', "You went quiet. Scary quiet. Not your kind. I didn't like it."],
          ['sable', "One thunder too many, I said. ...Fine. Deepline can keep both."]],
        sen: [
          ['hero', "..."],
          ['sable', "I know, sensei. Arriving is not stopping. ...Thank you for not saying it."]]
      }
    },

    // ---------------------------------------------------------------- MORO (champion: orin)
    moro: {
      title: "Doors on Platform Zero",
      place: "Platform Zero. Orin opens doors for the Legion, and Moro's shadows hold them shut.",
      intro: [
        ['sys', "Platform Zero, the oldest stop in Deepline. Magenta doors hang open in the air, and the Legion steps out of them."],
        ['sys', "One by one, long shadows close over the doors and hold them shut. Moro has not slept in two days."],
        ['moro', "{hero}. Good. Hold the platform a minute. I'd like to close my eyes. I won't."]],
      meet: [
        ['orin', "Every wall down here is a door to me now, shadow-keeper. And every door opens on the Crown."],
        ['moro', "You said you'd close the Director's door behind him. Now you hold one open for something worse."],
        ['orin', "The dark between worlds is full of doors. He showed me the last one. Nothing comes back through it."]],
      lose: [
        ['orin', "Wrong door. Try another. They all lead to him."]],
      win: [
        ['sys', "Orin falls back through his own door. It shuts behind him, and Moro's shadow lies across the seam."],
        ['moro', "Gone to the Crater. He'll open more doors there. Somebody ought to be there to hold them."],
        ['moro', "I was going to sleep for a week. I'll sleep after the Crater. Wake me if I'm late. I won't be."]],
      tie: {
        rook: [
          ['hero', "Moro! You held a whole platform by yourself? That's my job! Holding doors!"],
          ['moro', "You held one once. I've carried it since. Today I held the rest."]],
        vesper: [
          ['hero', "Walked through his doors to get here. Didn't knock."],
          ['moro', "Rude. ...Thank you. Next time, knock."]]
      }
    },

    // ---------------------------------------------------------------- PELL (called)
    pell: {
      title: "A Hand Above His Own",
      place: "The Pit Arena. Pell dances on strings for Vael, and the whole Pit dances with him.",
      intro: [
        ['sys', "The Pit Arena. Pink threads glitter from rafter to floor, and the Legion stands among them like a silent audience."],
        ['sys', "Pell is at the front tonight, not the back. Above his crown of violet light, threads rise from his own shoulders into the dark."],
        ['hero', "He's not holding the strings. Something is holding him."]],
      meet: [
        ['pell', "{hero}. Welcome, welcome. Do you hear it? He speaks in my students' voices. They call me sensei again."],
        ['pell', "Ten years I held three layers on three strings. Now another hand holds mine. You can't imagine how restful."],
        ['vael', "Puppeteer. You were so tired of choosing. Let me choose. Dance."]],
      lose: [
        ['pell', "Bravo. Wooden, but wonderful. Take a bow, and try again."]],
      win: [
        ['sys', "The crown breaks. The threads above Pell go slack, and for a moment he hangs on nothing, a marionette after the show."],
        ['pell', "...He used Rook's voice. Sable's. Moro's. Saying the one word I sold."],
        ['pell', "No. I gave away the right to hear it. That was the bargain, and I made it with open eyes."],
        ['pell', "The Crater, then. Put me where the strings are thickest. I have a great many debts and one good pair of hands."]],
      tie: {
        coda: [
          ['hero', "Strings on you, for once. I cut them mid-dance. You always said that was rude."],
          ['pell', "Very rude. Beautifully done. ...Dance at the Crater, my star. Your own star. Let nobody count for you."]],
        oda: [
          ['hero', "(Oda rings the bell once, low. Then once more, softly, for a girl who used to count the tolls.)"],
          ['pell', "Monk. You came all this way to ring at me. I have earned every toll. Ring the rest at the Crater."]],
        rook: [
          ['hero', "Pell! I came to collect! Not to save you! ...Okay. To collect, and also that."],
          ['pell', "More of you than I counted, again. Thank you, Rook. I won't ask you to say it back."]],
        sen: [
          ['hero', "Take off your boots."],
          ['pell', "Swordsman. One line, and every string falls. Three times now. I may learn patience yet."]]
      }
    },

    // ---------------------------------------------------------------- THORNE (champion: hex)
    thorne: {
      title: "The Garden Wakes Twice",
      place: "The Rootways. Hex wakes Thorne's dead for Vael, and the gardener holds the borders.",
      intro: [
        ['sys', "The Rootways. The dead of the Ashfall War climb out of their beds with mint light in their eyes, and walk for the Crown."],
        ['sys', "Thorne holds the stair with a sword grown out of his own arm. He has not raised his voice once."],
        ['thorne', "{hero}. Good evening. Do mind the borders. My guests are not themselves tonight."]],
      meet: [
        ['hex', "Gardener. Your dead only died once. Where I come from, that's half a death. I'm finishing it for him."],
        ['thorne', "You were the only guest who ever came here for the quiet. That is the part I find hardest to forgive."],
        ['hex', "He ended my world, and he remembers it. Everything twice, gardener. Now yours."]],
      lose: [
        ['hex', "Down once. Down again in two seconds. Wait for it."]],
      win: [
        ['sys', "Hex comes apart into ghost light and drifts up the stair toward the Crown. Two seconds later, her laughter follows."],
        ['sys', "One by one, the dead of the Ashfall War lie back down in their beds."],
        ['thorne', "Thank you, everyone. Back to bed now. Mind your neighbours."],
        ['thorne', "The Crater, I think. I have kept a great many empty things, and I know exactly where they belong."]],
      tie: {
        ume: [
          ['hero', "I came down with shears this time. Someone has been pruning your garden very badly."],
          ['thorne', "Ume. Achoo. ...How perfectly timed. Do take a cutting home, after the Crater."]],
        vesna: [
          ['hero', "Sunday, Thorne. I brought the cups. Tea will have to wait for the Crater."],
          ['thorne', "Then I shall bring the tea. And you, my dear, will not charge me. Tell no one."]]
      }
    },

    // ---------------------------------------------------------------- VEX (legion)
    vex: {
      title: "Pull and Push in the Dark",
      place: "The Shafts. Vex holds the Middle Deep with a fist of each charge and a lot of scrap.",
      intro: [
        ['sys', "The Shafts of the Middle Deep. The Legion climbs the walls like grey ivy, and Vex keeps throwing it back down."],
        ['vex', "{hero}. They've got no iron in them. Nothing to pull. So I pull the shaft instead."],
        ['vex', "Opposites attract. Them, and the bottom. Come and help me introduce them."]],
      mid: [
        ['vex', "Iron Storm's charged. Stand right next to me, or very far away. Nothing in between."]],
      win: [
        ['sys', "The last of the Legion goes down the Shafts in a hail of loose bolts. The iron comes back to Vex's hands like dogs called home."],
        ['vex', "One force, two ways. Push them out of Deepline, pull everyone else in. Same thing. Always was."],
        ['vex', "The Crater's next, isn't it. Fine. Tell whoever counts the muster I'm coming, and nobody's charging interest."]],
      tie: {
        ferra: [
          ['vex', "You came all the way down the Shafts. For me?"],
          ['hero', "For the scrap. You happened to be standing on it. Dinner after the Crater, boy. My half."]],
        mako: [
          ['hero', "Vex. Field test."],
          ['vex', "Passed. I'll talk about polarity the whole way to the Crater. You've been warned."]]
      }
    },

    // ---------------------------------------------------------------- VESNA (called)
    vesna: {
      title: "The Longest Page",
      place: "The Neon Market. Vesna calls in every debt in Deepline, in red, for Vael.",
      intro: [
        ['sys', "The Neon Market's Red Quarter. Blood rises from the gutters in fine red threads, drawn up toward one open book."],
        ['sys', "Every debtor in Deepline kneels in the street, paying. The Legion stands over them, counting nothing."],
        ['sys', "At the centre, under a crown of violet light, Vesna reads aloud from the Red Ledger, and does not look up."]],
      meet: [
        ['vesna', "{hero}. Is your name in here? Everyone's is, darling. Tonight they all fall due."],
        ['vesna', "Halcyon's page was the longest in my book. The Director died owing me. Do you know what an unpaid page does to a woman?"],
        ['vael', "Bookkeeper. Every account in every world closes in me. Give me the long page, and I will collect it from nine worlds."]],
      lose: [
        ['vesna', "Overdue. I'll add it to your page, with interest."]],
      win: [
        ['sys', "The crown cracks across like a ruled line. The red threads fall back into the gutters, and the debtors look up."],
        ['vesna', "...He promised to close the page. That's all I ever wanted, darling. One account that balanced."],
        ['vesna', "And he'd have bled Deepline white to settle it. That isn't bookkeeping. That's theft with a ledger."],
        ['vesna', "The Crater, then. Put me down for the muster. He owes me now, nine worlds of it, and I collect in person."]],
      tie: {
        maren: [
          ['hero', "You took their blood for a stranger's account. Even you only ever charged your own, Vesna."],
          ['vesna', "Doctor. Patch my arm. Free of charge. ...I'm writing that down."]],
        thorne: [
          ['hero', "Your tea has gone cold, my dear. I came down to warm it."],
          ['vesna', "Thorne. Tell no one I was written in someone else's book. I have a reputation."]]
      }
    },

    // ---------------------------------------------------------------- FUMI (walker)
    fumi: {
      title: "Pressure in the Pipes",
      place: "The Core Sump. The Legion climbs for Fumi's boilers, and Fumi has stopped keeping it in.",
      intro: [
        ['sys', "The Core Sump. Grey soldiers climb out of the bottom of everything toward the boilers, and frost climbs with them."],
        ['fumi', "{hero}. Stand by the valves. If they shut these boilers, half of Deepline freezes tonight."],
        ['fumi', "I keep it in. Mostly. ...Not tonight."]],
      mid: [
        ['sys', "The Sump shakes. A Siege Walker wades up out of the dark, legs like towers, its captain riding above the steam."],
        ['fumi', "Big. Good. Gauge is in the red. I've been saving this one."]],
      win: [
        ['sys', "Every valve opens at once. The Walker cooks in its own plating and folds into the Sump, captain and all."],
        ['fumi', "...Sorry. That was a lot of pressure."],
        ['fumi', "Boilers hold. Somebody else can mind them for a night."],
        ['fumi', "The Crater. I'll come. I'll bring a gauge."]],
      tie: {
        ashka: [
          ['hero', "Boiler man. I felt your pipes go hot from the bottom of everything."],
          ['fumi', "Tap. Tap. Tap. ...You heard. You burn, I boil. Partners, all the way to the Crater."]],
        mako: [
          ['hero', "Fumi. Suit's fine. You?"],
          ['fumi', "Steaming. Valves held. Take more than a Walker to pop me now."]],
        nami: [
          ['hero', "Pumps and patience. You kept the boilers lit."],
          ['fumi', "Like always. Now let's go and turn something else round."]]
      }
    },

    // ---------------------------------------------------------------- MAKO (walker)
    mako: {
      title: "Not This Time, Crate",
      place: "Dockside Nine. Mako stands his suit between the Legion and the last wharf.",
      intro: [
        ['sys', "Dockside Nine. The cranes are down, the crates are burning, and one walking tank holds the end of the pier."],
        ['mako', "{hero}. Good. Plating's half gone. Grows back. Slowly."],
        ['mako', "They keep coming. They don't stop to breathe. Neither does the cannon."]],
      mid: [
        ['sys', "A Siege Walker climbs out of the Drowned Line, legs like towers, a captain riding high, one foot lifted over the dock."],
        ['mako', "Got crushed under a crate once. That is a very big crate."]],
      win: [
        ['sys', "The Walker comes down across the pier like a felled crane. Mako's suit is smoking. It is still standing."],
        ['mako', "Plating took it. Grows back. Good."],
        ['mako', "Promised myself, under that crate. Never again. Not me. Not anyone on this dock."],
        ['mako', "The Crater. Walking. Tell the muster to make room. The suit's big."]],
      tie: {
        dyna: [
          ['hero', "Big man! Your suit's smoking! Gorgeous! Can I ride up top to the Crater?"],
          ['mako', "Only you. Always only you."]],
        fumi: [
          ['hero', "Your boiler's running hot. Fourth time."],
          ['mako', "Fourth time you stopped it cooking me. Thanks. Come to the Crater. Bring valves."]],
        vex: [
          ['hero', "Suit's pulling left again. You build too fast."],
          ['mako', "Tune it on the way. You can talk about polarity. I'll let you."]]
      }
    },

    // ---------------------------------------------------------------- NAMI (champion: slick)
    nami: {
      title: "The Friendliest Flood",
      place: "The Waterworks. Slick floods the pumps for Vael, and Nami holds the pump-house door.",
      intro: [
        ['sys', "The Waterworks. The Drowned Line has climbed out of its tunnels and into the pumps, green and thick and laughing."],
        ['sys', "Nami holds the pump-house door with her cleaver, soaked to the bone. The water has not got past her yet."],
        ['nami', "{hero}. Careful where you step. That's how this started."]],
      meet: [
        ['slick', "Hello! Hello, Nami! Everybody steps in me. Everybody, always. Today everybody goes under me. Fair's fair!"],
        ['nami', "You followed me home because I said sorry. I'm saying it again. Sorry, Slick. Stop."],
        ['slick', "He says sorry is a very little word. He drank nine seas, and not one of them said sorry back. Squish."]],
      lose: [
        ['slick', "Squash. Splash. All back together! Are you? Again!"]],
      win: [
        ['sys', "Slick splits into a hundred puddles and runs downhill toward the Crown. The pumps cough, and catch."],
        ['nami', "He's still waiting for someone to step in him and say sorry. It won't be that crown."],
        ['nami', "The Crater, then. The sea taught me patience. That crown is about to find out what it's for."]],
      tie: {
        fumi: [
          ['hero', "Pumps are back. I turned them round. Like always."],
          ['nami', "Pumps and patience. Come to the Crater, boiler man. I'll need the water moving."]],
        maren: [
          ['hero', "You're soaked through and shaking. Sit. Doctor's orders."],
          ['nami', "You argued with the sea for me once. Today I argued with a puddle. Come on. I guard your back at the Crater."]]
      }
    }
  });
})();
