'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the spoken lines of every chapter for the heroes of Deepline, the Underground.
// Data only; js/saga/saga-core.js plays it. Speakers: 'hero' (the hero being played), 'sys' (narration), a hero id,
// or 'director', 'kessen', 'vael', 'agent', 'citizen'.
(function () {
  const SW = window.SW; if (!SW.saga || !SW.saga.add) return;
  SW.saga.add({

    // ---------------------------------------------------------------- KAEL
    kael: {
      1: { zone: 'yard', goal: "Fight your way out of the Crusher Yard",
        card: "A thunderstorm splits open over the Crusher Yard and drops a boy in the trash. Halcyon's collectors are already coming to number him.",
        intro: [
          ['sys', "The Crusher Yard. Rain on rust, a crane groaning in the dark. The air over the heap tears open, and a boy falls out of a storm."],
          ['hero', "Vharra. Thunderheads. The storm clans. I know exactly where I'm from, and it never smelled like this."],
          ['ferra', "You. Under the car door. Breathing, or salvage?"],
          ['hero', "Breathing! Name's Kael. And I'm nobody's salvage."],
          ['agent', "Collection order. Charged object landed in the Yard. Bag it, tag it, number it, send it up."],
          ['hero', "Number me? Sure. Start by counting these."]],
        win: [
          ['ferra', "Lightning out of a scrap pile. I'm keeping you. Salvage rights."],
          ['citizen', "Look at his hands, they're crackling! Sparks! The new kid's called Sparks!"],
          ['hero', "It's Kael. ...Fine. Sparks. Don't wear it out."],
          ['hero', "Halcyon wants the storm in a jar? Let's find out what thunder does to glass."]] },
      2: { zone: 'slums', with: 'fenn', goal: "Hold the Slums with Fenn and Rook",
        card: "Kael scratched Vharra's storm-eye on his jacket to remember where he came from. A hunter from the steppe reads it, just as Halcyon's collectors hit the stairs.",
        meet: [
          ['fenn', "That storm-eye on your jacket. Who carved Vharra's mark into Deepline tin?"],
          ['hero', "Me. So I don't forget which sky dropped me. You're from the steppe too?"],
          ['fenn', "Hunting clans. My wolf ran at the tear when it took me. You're storm-clan, kid. And you're down here alone."],
          ['rook', "He is NOT alone. Rook. His brother. We've done a whole week of brothering. Ask anyone. Ask me. Ask me."],
          ['fenn', "Then I'm the big brother, and nobody gets a vote. Collectors on the stairs. Show me your thunder."],
          ['hero', "Front row, wolf man. Rook, clones out!"]],
        win: [
          ['fenn', "Wild and loud. You throw lightning like it owes you money. We'll work on that."],
          ['rook', "Don't work on him too much. Loud is our whole plan."],
          ['hero', "One week down here and I've got two brothers. Deepline's better than it smells."]] },
      3: { zone: 'crater', rival: 'nyra', goal: "Duel Nyra at the Crater",
        card: "Halcyon tells Kael an escaped Subject called Nyra sold out the tunnels. At the Crater he meets a singer who was told the very same thing about him.",
        meet: [
          ['sys', "The Crater, under a bruised violet sky. Wind off the rim, ash in the teeth. A girl in a Subject's grey is waiting."],
          ['hero', "Nyra. They say you sold Halcyon every hideout in Deepline, door by door."],
          ['nyra', "And they showed me you, opening the Sump's vents on the labs. People choked in those labs."],
          ['hero', "I've never been near those vents! Somebody's lying, and it isn't me."],
          ['nyra', "Then fight louder than I sing, Deepline. Let's hear it."]],
        win: [
          ['nyra', "Stop. You fight like someone who never learned to lie. Halcyon never learned anything else."],
          ['hero', "So who'd they show you? Because that wasn't me in those vents."],
          ['nyra', "Someone with your face. And someone with mine walking your tunnels, I'd bet."],
          ['hero', "Somebody's wearing us like coats. I'll find them, and hand them back their own face."]],
        lose: [
          ['nyra', "Up. If you really opened those vents, I've barely started."]] },
      4: { zone: 'pit', goal: "Fight through the Pit Arena to Pell",
        intro: [
          ['sys', "The Three-Layer War. Every screen in every layer plays two films: Kael unsealing the Core Sump over the Sky's labs, Nyra leading Halcyon's drills into Deepline."],
          ['sys', "The Sky blames Deepline. Deepline blames the Sky. Tonight the Noble Ring burns, drills chew at the Buried Meridian, and Halcyon floods the Pit Arena."],
          ['rook', "Everyone up top says you gassed their labs. You were snoring on my floor all night!"],
          ['hero', "Somebody wore my face to start a war. Faces don't walk around by themselves. Somebody's holding the strings."],
          ['sable', "The strings run to the Pit. To Pell. They always did."],
          ['hero', "Then we cut every last one, and I go meet the thief who wears me."]],
        win: [
          ['pell', "Her name is Rue, dear boy. A thing with no face of its own. I taught her yours. She's at the Crater now, wearing it."],
          ['kiri', "Then the Crater hears it from me first! Hang on, Kael. My crane outflies any rumour going."],
          ['sys', "The Crater. Kael and Nyra stand face to face between two roaring crowds, each layer sure the other is Halcyon's."],
          ['sys', "A shout: there's a second Kael in the crowd. Kael turns to look. The copy meets his eyes, and runs. Rue is gone."],
          ['sys', "Hollis raises a fourth banner under the Pact's three. Four banners climb the Halcyon Spire toward the Engine Core, which hums like it's calling something."],
          ['hero', "Up the Spire, then. Director, you threw me in the trash. I'm hauling it all back up to you."]],
        card: "Every screen shows Kael gassing the Sky's labs, and the Sky believes it. Kael was asleep on Rook's floor. Somebody is wearing his face, and the strings lead to the Pit." },
      5: { zone: 'dunes', foe: 'itsuki', goal: "Hold Itsuki in the Ash Dunes",
        intro: [
          ['sys', "The Convergence tears the Beyond wide. A crown-ship the size of a city blots out the sky. Sovereign Vael has come."],
          ['sys', "His Legion pours down the shafts; his champions go out to all three layers. Tarn stumbles down the stairs, bleeding."],
          ['tarn', "Ash Dunes. One of Vael's. White hair, horns, five elements. He went through Ivo, Jax, me. Brann's holding him. Nobody else can."],
          ['hero', "Then he hasn't met Deepline yet. Point me at him."]],
        meet: [
          ['sys', "The Ash Dunes. Brann goes down in the sand. A stranger with calm red eyes turns to the next one standing."],
          ['itsuki', "Fire, wind, thunder, earth, water. I learned each on a different world. You carry one. Step aside."],
          ['hero', "I fell out of a storm into a trash heap and climbed out. I don't step aside. Not for Halcyon. Not for you."],
          ['itsuki', "Then hold me as long as you can. Everyone behind you is counting on it."]],
        win: [
          ['sys', "Kael's thunder holds Itsuki longer than anyone in the Dunes. Then the wheel of elements turns once more, and Kael is in the sand."],
          ['itsuki', "The longest of them all. Good. I will wait beneath the Crown. Come and finish it there, thunder."],
          ['sys', "He walks back across the Dunes toward the Crater. No one stands in his way."],
          ['hero', "Brann. Tarn. Everybody's breathing. Next time, I'm the one who walks away."]],
        lose: [
          ['itsuki', "Not yet. Rise. They need you to last longer than that."]],
        card: "Vael comes through with his champions. In the Ash Dunes Kael meets Itsuki for the first time and outlasts everyone, but Itsuki walks back to wait beneath the Crown." },
      6: { goal: "Bring the storm down on the Crown",
        intro: [
          ['sys', "The Crater. Sky, Surface and Deepline share one rim, and the Hollow Legion spills down from the crown-ship."],
          ['nyra', "Deepline. You're late. Fight louder than I sing, and stay at my side this time."],
          ['hero', "At your side, with Pyra's fire, Gale's wind, Brakk's stone and Nami's water. Six of us. One crown. Up we go."],
          ['nami', "The Line came up with me. Go on, Kael. The deep is at your back."],
          ['hero', "Rook, Ferra, hold the rim! Make way, Legion. Six coming through."]],
        meet: [
          ['sys', "At the foot of the Crown, a man with white hair and calm red eyes waits on the path. Five elements wheel around him."],
          ['itsuki', "Thunder. I said I would wait beneath the Crown. You brought five more. The ending does not change."],
          ['hero', "In the Dunes I held you alone. Today there are six of us. Count again."],
          ['itsuki', "Then come, all six of you. This time I hold nothing back."]],
        lose: [
          ['itsuki', "The wheel turns, and you fall under it. Again, thunder."]],
        win: [
          ['sys', "Itsuki gives ground against the Crown, still calm, and the six go past him. Inside, the Convergence and Vael stand side by side."],
          ['convergence', "The trash I dropped, and five more numbers. You should all have stayed where I filed you."],
          ['hero', "Now, all six! Fire, wind, stone, water, song... and thunder!"],
          ['sys', "Pyra's fire, Gale's wind, Brakk's stone, Nami's tide, Nyra's song and Kael's bolt land as one. The crown-ship breaks."],
          ['sys', "It falls into the Crater. The door to the Beyond drags back the Legion and every champion. Itsuki goes last, eyes on Kael."],
          ['sys', "Morning, in the Crusher Yard. Ferra is already sorting the crown-ship into piles. Rook is asleep on one of them."],
          ['hero', "Ferra wants the crown for scrap. Rook wants breakfast. Me? I want to hear what a quiet sky sounds like."],
          ['hero', "Out of the trash, into the storm!"]],
        card: "Kael climbs into the Crown with the other five, gets past Itsuki, and his thunder joins the single strike of all six that brings the crown-ship down." }
    },

    // ---------------------------------------------------------------- ASHKA
    ashka: {
      1: { zone: 'core', goal: "Burn the wardens out of the Core Sump",
        card: "Half of Deepline sleeps warm because Subject 60 is in pain. For a year Ashka has hung in the furnace at the bottom of everything, and tonight the wardens come to stoke her hotter.",
        intro: [
          ['sys', "The Core Sump. The furnace under all of Deepline, where Aurelia's rubbish burns and a chain glows cherry-red around one woman."],
          ['hero', "At home I kept the vents under the Frozen Harbour. Red, slow, patient. Nobody had to chain them."],
          ['agent', "Slum heat's down four degrees. Stoke Sixty. Prods on three, and log the noise as output."],
          ['hero', "A year of your prods. A year of the Slums sleeping warm on it."],
          ['hero', "Tonight I give the heat back. All of it. Come closer."]],
        win: [
          ['hero', "The chain holds. The wardens do not. One of those will change."],
          ['sys', "Far above, something knocks on the iron. Three taps come ringing down the pipes, as they have every night for a year."],
          ['hero', "Still burning, whoever you are. Keep knocking."]] },
      2: { zone: 'core', with: 'fumi', goal: "Hold the Core Sump with Fumi",
        card: "After a year of taps through the pipes, someone climbs down the boiler shaft into the Sump. Ashka is about to hear her own name in a voice, and the wardens have seen him come.",
        meet: [
          ['fumi', "...Hello. It's me. The taps. Found the hatch. Took a year."],
          ['hero', "You are bigger than your knocking. And quieter."],
          ['fumi', "Fumi. Boilers, up top. Every night my pipes ran hot, and the heat was you. Couldn't sleep warm on it."],
          ['hero', "Ashka. Not Sixty. Say it once, so I know it still sounds like a name."],
          ['fumi', "Ashka."],
          ['agent', "Unlogged civilian in the Sump. Bring the cold lances. Freeze the pair of them if you must."],
          ['fumi', "I hold things in. Most nights. Not this one."]],
        win: [
          ['fumi', "That door. Give me time. Enough pressure in my pipes and it leaves its hinges."],
          ['hero', "I have waited a year on a chain. I can wait on a gauge."],
          ['sys', "Then the vents above them roar. Fire is pouring down from somewhere far overhead, and it is not hers."]] },
      3: { zone: 'core', rival: 'pyra', goal: "Duel Pyra in the Core Sump",
        card: "A girl falls out of the vents in a rain of burning ash, with the Burn Ward's fire chasing her all the way down. Neither knows the other is from the Harbour. Both want to know who burns hotter.",
        meet: [
          ['sys', "Ash pours from the vent mouth, then a girl, then the fire behind her. The Burn Ward has burned all the way to the bottom."],
          ['pyra', "Oh, come ON. Another furnace? They built one down here too? I just melted theirs to the bolts."],
          ['hero', "I am not their furnace. I am the fuel. And you are on fire in my house."],
          ['pyra', "Everything's on fire, lava lady. Let's see which of us is hotter."],
          ['hero', "Come, little spark. The Sump has all night."]],
        win: [
          ['pyra', "...Fine. FINE. You're hotter. Nobody's hotter than me. Who even are you?"],
          ['hero', "Ashka. Of the Frozen Harbour. I tended the deep vents there, before they chained me to this one."],
          ['pyra', "Pyra. Harbour too, the blue forge on the north quay. Six weeks in their Burn Ward nearly did me in. You did a year?"],
          ['hero', "A year. Sit with me, sister. The chain reaches far enough for two."]],
        lose: [
          ['pyra', "Aw. Did you go out? Up, lava lady. I'm barely warm."]] },
      4: { zone: 'core', goal: "Hold the Sump until the door blows",
        intro: [
          ['sys', "The night of the Strings Cut. Every screen in the three layers plays two films, over and over."],
          ['sys', "In one, Deepline's Kael opens the Sump's vents on the Sky's labs. In the other, the Sky's Nyra waves Halcyon's drills into Deepline."],
          ['hero', "I saw that boy at my vents. White hair, his face. He stood in my heat and did not sweat. Everyone sweats down here."],
          ['fumi', "Drills in the tunnels. Gauge in the red. Dyna's at the door with a bag that ticks."],
          ['dyna', "One door, four kilos, lots of love. Stand back, Ashka. Or don't. You're basically lava."],
          ['hero', "Open it. The wardens come through me first."]],
        win: [
          ['sys', "The door leaves the Sump like a cork from a bottle. Ashka walks out of the furnace for the first time in a year. The chain stays."],
          ['hero', "Deepline is cold without me. Good. Let it learn to warm itself without a prisoner."],
          ['sys', "Each layer blamed the other, as the Director meant. In the Pit, Pell hangs in his own Cradle and names his faceless spy: Rue wore both faces."],
          ['sys', "The Sky's knights have turned and the Surface's bell has rung three times. Hollis raises a fourth banner, and four climb the Spire."],
          ['hero', "The Engine Core waits at the top. It has been calling into the dark a long time. I am done being its fuel."]],
        card: "Every screen shows a Deepline boy gassing the Sky's labs from her furnace, and a Sky girl leading drills into Deepline. Ashka was there when the boy came. Tonight Fumi's pressure and Dyna's bombs come for her door." },
      5: { zone: 'metro', foe: 'noct', goal: "Keep the Old Metro lit",
        intro: [
          ['sys', "A crown-ship fills the sky over the Crater. Vael has come with his champions, and every lamp in the Old Metro dies."],
          ['vael', "First the dark, then my Legion. Of all three layers, the one beneath was always going to kneel first."],
          ['hero', "Kneel? I am the bottom of everything. And I am still burning."]],
        meet: [
          ['noct', "...Light."],
          ['hero', "That teal. The night lamps of the Frozen Harbour burned that colour. Were you ours, once?"],
          ['noct', "Once. Now I keep his dark. Go out, little lamp."],
          ['hero', "I burned a year so this place had heat and light. You do not get to blow it out."]],
        win: [
          ['sys', "Ashka's glow floods the tunnel wall to wall. In it, at last, the dark has nowhere left to stand."],
          ['hero', "There is your blade. In my light, I see exactly where it is not."],
          ['sys', "Noct steps back into a fold of shadow and is gone, up to the crown-ship. The lamps wake one by one."],
          ['hero', "Run home to your Sovereign, watchman. The harbour deserved better of you."]],
        lose: [
          ['noct', "Lights out."]],
        card: "Vael's champion Noct snuffs every light in the Old Metro; Ashka burns brighter than his dark and drives him back to the crown-ship." },
      6: { goal: "Keep the rim burning for the six",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours down on the rim and the three layers meet it, Ashka's glow red across the whole slope."],
          ['pyra', "Sister. Six of us go up, and I'm one. Come with me?"],
          ['hero', "No, little spark. You go up. I am the bottom of everything. Someone has to hold the floor."],
          ['sys', "Pyra runs through the Legion and up into the Crown with Kael, Nyra, Gale, Brakk and Nami. The rim burns behind them."]],
        meet: [
          ['sys', "Itsuki comes down the flank of the Crown after the six. Fire is one of the five elements wheeling round him."],
          ['itsuki', "Fire. The first I learned, on a world that burned. You burn the way that world did."],
          ['hero', "That world is ash. I am not. You want my sister, you walk through a year of the Core Sump."],
          ['itsuki', "Then I walk through a year."]],
        lose: [
          ['itsuki', "Fire was the first thing I learned. It will be the first thing you lose. Again."]],
        win: [
          ['sys', "A year of the Core Sump pours across the rim, slow and red. Itsuki cannot cross it fast enough."],
          ['itsuki', "Hot enough, and long enough. They are nearly at the top. I go back up."],
          ['sys', "He turns back to the Crown. From the rim Ashka sees fire flare inside it, and then the crown-ship falls into the Crater."],
          ['sys', "The door to the Beyond drags the Legion and every champion back through. Itsuki goes last."],
          ['sys', "Next morning, Ashka sits on the Crater rim in the sun. Far above, the Burn Ward chimney smokes: Pyra is baking."],
          ['hero', "A year without a sky. I will sit here until it goes dark and watch every minute of it. My sister can bring the bread."],
          ['hero', "The core burns hotter than you."]],
        card: "Ashka sends her sister Pyra up with the six, then pours a year of the Core Sump across the rim until Itsuki has to turn back to the Crown." }
    },

    // ---------------------------------------------------------------- DYNA
    dyna: {
      1: { zone: 'works', goal: "Blast Halcyon out of the Scrapworks",
        card: "On Vharra she set one tube in the grass and turned the festival sky gold. In the Scrapworks every problem is a demolition job, and tonight Halcyon's collection crew is the problem.",
        intro: [
          ['sys', "The Scrapworks. Scorched benches, a reek of sulphur, and a girl with no eyebrows humming over a box of wires."],
          ['hero', "Problem: Halcyon sent a collection crew for the girl who makes things go boom. Solution, and sorry, it's obvious: boom."],
          ['agent', "Collection target, explosives class. Approach with caution. She's... she is lighting something."],
          ['hero', "Grenade, mine or rocket? Pick a favourite. Trick question. You're getting all three."]],
        win: [
          ['hero', "Look at that crater. Look at the lip on it. Somebody frame that."],
          ['hero', "Halcyon wants my bombs in a jar? Tell them to bring a bigger jar. And earplugs. And a new building."]] },
      2: { zone: 'works', with: 'mako', goal: "Hold the Scrapworks with Mako",
        card: "Dyna needs someone who can stand next to her work without falling over. Mako, a dock hand, has built a suit that nothing will ever crush again, and he wants it tested.",
        meet: [
          ['mako', "YOU'RE THE BOMB GIRL. ...Sorry. Suit's loud. I've got a cannon on it. Cannon's empty."],
          ['hero', "A walking cannon with nothing in it? Saddest thing I've ever seen. Can it take a blast?"],
          ['mako', "Got crushed under a crate once. Built this so nothing crushes me again. Go on. Try."],
          ['hero', "Ooh. Okay. Three, two... hold very still, big man."],
          ['mako', "...That tickled."],
          ['hero', "Oh, I love you. Professionally. Partners: I make, you carry, and I ride on your shoulders."]],
        win: [
          ['mako', "Their captain's down. Suit's fine. You?"],
          ['hero', "Never better. Hey. Fumi up at the boilers says there's a door under his floor, and a woman chained in a furnace behind it."],
          ['hero', "That door needs a year of steam and the biggest bang I've ever built. I want it. I want it so much."]] },
      3: { zone: 'works', rival: 'jax', goal: "Duel Jax in the Scrapworks",
        card: "Jax, who keeps the Long Bar at Mile Zero up on the Surface, has ridden all the way down to the Scrapworks. Word up top is that Dyna can't keep time. She has offered to show him a fuse.",
        meet: [
          ['jax', "Long ride down from Mile Zero, partner. Folks up top say you got no sense of timing."],
          ['hero', "Folks say a lot of things. I said I'd show you a real fuse, cowboy, and you came. Sweet."],
          ['jax', "Six in the wheel. I count every one. You count anything?"],
          ['hero', "Three, two, one. That's all the counting a fuse ever needs."]],
        win: [
          ['jax', "...Huh. You knew to the heartbeat when every one of those would go."],
          ['hero', "Timing's the whole art. The bang's just the applause."],
          ['jax', "Drinks at the Long Bar, then. Water's cold. Floor's fireproof. Mostly."],
          ['hero', "Deal. Keep me away from the stove."]],
        lose: [
          ['jax', "Six for six. That's timing, kid. Light another."]] },
      4: { zone: 'core', goal: "Fight to the Sump door and blow it",
        intro: [
          ['sys', "The night of the Strings Cut. Drills grind through Deepline's walls, and every screen plays two films on a loop."],
          ['sys', "Down here: the Sky's Nyra waving the drills in. Up in Aurelia: Deepline's Kael opening the Sump's vents on their labs. Each side blames the other."],
          ['citizen', "I saw her! Ice girl, right out in front of the drills, waving them on like a parade!"],
          ['hero', "A singer Halcyon kept in a tank, leading Halcyon's drills? Wrong colour smoke. Somebody's faking the show."],
          ['fumi', "Whoever it was. Ashka's still down there. Gauge is red. The door, Dyna."],
          ['hero', "Biggest job of my life. Mako, hold the stairs. Everybody else: ears!"]],
        win: [
          ['sys', "Every valve in Fumi's pipes and every bomb Dyna owns go off at once. Where the Sump's door stood: a hole shaped like a sunrise."],
          ['ashka', "...You made that? It was beautiful."],
          ['hero', "Front-row seat for every eruption you ever have. That's my fee."],
          ['sys', "In the Pit, Pell hangs in his own Cradle and names his faceless spy. Rue wore both faces, on the Director's orders."],
          ['sys', "Kiri's crane flies the name to the Crater. The Sky and the Surface have risen too. Under four banners, the layers climb the Spire toward the Engine Core."],
          ['hero', "Something's ticking at the top of that tower. I know a fuse when I hear one. Let's go cut it."]],
        card: "Halcyon's drills are in Deepline, and each layer's screens blame the other's people. Under all the shouting, a door in the Core Sump is still shut, and Dyna has saved her biggest bang for it." },
      5: { zone: 'market', foe: 'rue', goal: "Blow the masks off Rue",
        intro: [
          ['sys', "A crown-ship blots out the sky. Vael comes through with his champions, and Rue sells herself to him for a crown."],
          ['citizen', "Vesna's selling the Market to the invaders! No, Ferra is! No, it's Kael! He's selling us out!"],
          ['hero', "Three faces, one sneer. That's Rue, with a new boss."]],
        meet: [
          ['rue', "Dyna. Bombs. I can do bombs. Watch. Bigger than yours."],
          ['hero', "Copy the bomb all you like. You can't copy the timing. That part's mine."],
          ['rue', "He gives me a crown. A crown is a face nobody can peel off. Your Market is the price."],
          ['hero', "This Market sold me my first fuse. Every face you put on, I'm blowing off."]],
        win: [
          ['sys', "The last mask burns away like paper. Rook's clones pin the copies, and Pell's threads cut the rest."],
          ['rue', "Not mine. None of them were ever mine. ...He'll give me one."],
          ['sys', "Rue slips away into the smoke, faceless, running for the crown-ship."],
          ['hero', "Run, then. Three, two, one, and the Market's still standing. That's timing."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Again?"]],
        card: "Rue sells herself to Vael and wears the faces of Deepline's leaders in the Neon Market; Dyna blows the masks off one by one, and Rue runs for the crown-ship." },
      6: { goal: "Hold the Scrapworks to the end",
        intro: [
          ['sys', "The Scrapworks. Far above, the Crater's sky burns violet. Down here, the Legion's last push comes for the workshops."],
          ['citizen', "They're coming down every stair! Thousands!"],
          ['hero', "Then I've got a fuse for every stair. Mako's on the docks, so nobody's carrying me today. Fine. I'll walk."]],
        meet: [
          ['sys', "A Siege Walker stamps out of the stairwell, a Legion captain on its back. One step flattens a row of workshops."],
          ['hero', "Ooh. Look at the size of it. I've never blown up anything that tall."]],
        win: [
          ['sys', "Three, two, one. The Siege Walker's legs leave in four directions, and its captain comes down in the scrap."],
          ['sys', "Then the ground shakes once, far away. The Legion in the Scrapworks goes still and is drawn up the shafts like smoke."],
          ['hero', "That was the Crater. Somebody else's boom. Huh. Not bad. I'll allow it."],
          ['sys', "Next morning, Dyna sits on the Scrapworks roof drawing a rocket on a paper bag. Mako's suit clanks up the street."],
          ['hero', "Vharra had festivals. Deepline never did. Fireworks up every shaft, for everyone. That's the next job."],
          ['hero', "Boom. That's art."]],
        card: "Dyna holds the Scrapworks against the Legion's last push and sends a Siege Walker's legs four ways, while far away the Crown falls." }
    },

    // ---------------------------------------------------------------- BANDO
    bando: {
      1: { zone: 'docks', goal: "Hold Dockside Nine against Halcyon",
        card: "Dockside Nine sits where the Drowned Line runs out. Everything there is out of reach except to Bando. Halcyon has heard about his arms, and sent a net.",
        intro: [
          ['sys', "Dockside Nine, the last wharf on the Drowned Line. Black water, wet rope, crane hooks nobody can reach. Except him."],
          ['hero', "Did I ever tell you about the kite? Festival day on Vharra. One little girl, one tall tree. Everybody climbs. Not me. I reach."],
          ['citizen', "Every day, Bando. Every day of my life. Also, Halcyon's at the end of the pier."],
          ['agent', "That's the stretchy one. Reach like that is Subject grade. Net him and log the arms."],
          ['hero', "Net me? From way over there? Buddy, way over there is eleven arm's lengths. Easy."]],
        win: [
          ['hero', "You came all the way down here to get punched from the far end of the dock. Respect. Wrong, but respect."],
          ['citizen', "You're telling this one tomorrow too, aren't you."],
          ['hero', "Right after the kite. It goes kite, then this. It's a set."]] },
      2: { zone: 'docks', with: 'dyna', goal: "Hold the cargo tunnel with Dyna",
        card: "Halcyon has bricked up the old cargo tunnel with Bando's crates behind it. Dyna is offering him a hole, and something small and paper is drifting down the shaft toward them.",
        meet: [
          ['dyna', "Bando! Halcyon bricked up the cargo tunnel with your crates behind it. Want a hole? I've got a hole. Hole's free."],
          ['hero', "I always want a hole. You blow it, I reach through it. Best job on the docks."],
          ['dyna', "Stand back. Or, you know. Stretch back."],
          ['hero', "Wait! Look up! A Paper Post kite, down the whole shaft, with a note pinned to its tail."],
          ['hero', "It's from Sora! The kite girl! She says Gale still owes me a kite. See? SEE? It happened!"],
          ['dyna', "Nobody said it didn't, Bando. We just heard it a lot. Halcyon's coming through the hole. Reach, hero."]],
        win: [
          ['dyna', "Their captain went a long way. Did you throw him?"],
          ['hero', "Reeled him in, let him go. Elastic. It's science."],
          ['hero', "Write back to Sora for me, Dyna. Tell her the arm's still long, and I tell it right every time."]] },
      3: { zone: 'docks', rival: 'tarek', goal: "Duel Tarek for the longest reach",
        card: "Tarek, chief of the Surface's chain raiders, has come down to Dockside Nine to settle whose reach is longer. Bando has made very sure the whole dock turned out to watch.",
        meet: [
          ['tarek', "So this is Dockside Nine. Smells like rope and bragging. Heard you tell the Surface your reach beats mine."],
          ['hero', "Told everybody. Every day. And you came down to measure! Did you bring a tape?"],
          ['tarek', "Brought a chain. Garo forged it, and nothing's slipped it yet. Terms: you lose, the kite story gets my name in it."],
          ['hero', "Ha! Deal. Everybody watching? Good. Somebody count arms."]],
        win: [
          ['citizen', "Bando by an arm! An actual whole arm!"],
          ['tarek', "...By a hand. One. Next time you come up to me, dockhand. They always do."],
          ['hero', "Any time. Leave the chain, though. I'll hang it on the dock as a trophy."]],
        lose: [
          ['tarek', "Reeled in, dockhand. Come again when the arm's grown."]] },
      4: { zone: 'pit', goal: "Fight up to Pell's rafters in the Pit",
        intro: [
          ['sys', "The night of the Strings Cut. Drills punch into the Drowned Line, and every screen in Deepline shows who led them: Nyra, a Sky singer."],
          ['sys', "Every screen in the Sky shows Kael of the Crusher Yard gassing their labs. Each layer swears the other hit first, and both are marching."],
          ['hero', "The Sky? Only Sky person I know writes me letters on kites. This stinks of Halcyon. A whole crate of Halcyon."],
          ['rook', "Pell's up in the Pit's rafters, working the strings! Sable and Moro have the Cradle set below. Problem: nobody, not even all of us, can get up there."],
          ['hero', "Nobody? Rook. Buddy. Look who you're talking to. Forty arm's lengths, tops."]],
        win: [
          ['sys', "Bando's arm climbs into the dark of the rafters and comes down holding every one of Pell's strings. Pell drops into his own Cat's Cradle."],
          ['hero', "Got 'em. Every string. How's it hanging, Pell? I mean that literally."],
          ['pell', "Breathtaking reach. Bravo. Very well: both faces were Rue's. I taught her. Do tell the Crater, before they kill each other."],
          ['sys', "Kiri's crane flies the name to the Crater, and a second Kael bolts from the crowd. The Ring has turned, the bell has rung, and Hollis raises a fourth banner."],
          ['pell', "Hurry, though. The Director's Engine has been calling to something for years, and I don't believe it was ever us."],
          ['hero', "Four banners, one big Spire, Engine Core at the top. Long way up. Good thing I'm long."]],
        card: "Deepline's screens blame a Sky singer for Halcyon's drills, and the Sky's screens blame a Deepline kid for its labs. In the Pit Arena, Pell hangs in the rafters pulling strings, where nobody can reach him." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Hold back the flood",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael is here, and his champions come down into Deepline with the Legion at their backs."],
          ['fumi', "Something made of slime is in the Waterworks, and the Drowned Line's rising. Dockside Nine's going under."],
          ['hero', "My dock? Then I hold the water. Both arms, all day."]],
        meet: [
          ['slick', "Hello! I'm Slick. Everybody steps in me. Today everybody goes under me! Fair's fair."],
          ['hero', "Buddy, that's my dock you're drowning. Every crate on it, and every kid who fishes off the end."],
          ['slick', "Long arms! Long arms can't hold water. Squish!"],
          ['hero', "Watch me."]],
        win: [
          ['sys', "Bando's arms close round the flood like a dam, and hold. Fumi's pumps and Nami's tide shove the rest back."],
          ['hero', "Squash! And again! Off my dock, puddle!"],
          ['sys', "Slick bursts into a hundred drops and slides up the shafts, back to the crown-ship. The water stops climbing."],
          ['hero', "Dock's still there. Kids, you can tell this one tomorrow. I'll tell it first, and longer."]],
        lose: [
          ['slick', "Squash. Splash. All back together. Again?"]],
        card: "Vael's champion Slick floods the Waterworks to drown Dockside Nine; Bando holds the water back with both arms until Slick runs for the crown-ship." },
      6: { goal: "Hold Dockside Nine to the end",
        intro: [
          ['sys', "Dockside Nine. Far away, the sky over the Crater burns. Here, the Hollow Legion marches down the last pier."],
          ['citizen', "Bando! They're on the boats! On the crates! They're on the kids' fishing spot!"],
          ['hero', "The fishing spot? Okay. Now it's personal."]],
        meet: [
          ['sys', "A Siege Walker wades up out of the Drowned Line, a Legion captain on its back, taller than the dock cranes."],
          ['hero', "Taller than the cranes? Buddy, I've been reaching higher than cranes since I was nine."]],
        win: [
          ['sys', "Bando's arm goes up, wraps the captain, and comes down. The Siege Walker topples off the end of the pier."],
          ['sys', "Then the water shivers. Every Legion soldier on the dock stops, still as a mooring post, and drifts up the shafts like smoke."],
          ['citizen', "A crane! A paper crane, all the way down the shaft! It says... it says the Crown fell!"],
          ['hero', "Course it did. Who do you think was holding the dock?"],
          ['sys', "Next morning, Bando sits at the end of the pier with the kids, a fishing line in the water."],
          ['hero', "Did I ever tell you about the kite? ...No? Fine. Did I ever tell you about the walker?"],
          ['hero', "Long arm of Deepline!"]],
        card: "Bando holds Dockside Nine against the Legion's last push and throws a Siege Walker off the end of the pier, while far away the Crown falls." }
    },

    // ---------------------------------------------------------------- FERRA
    ferra: {
      1: { zone: 'yard', goal: "Throw Halcyon out of the Crusher Yard",
        card: "Everything Aurelia throws away ends up in the Crusher Yard, and Ferra decides what is worth saving. Halcyon has come to take her stock, and her.",
        intro: [
          ['sys', "The Crusher Yard. Hills of scrap under work lamps. Whatever the Sky throws away rolls down here, and Ferra sorts it."],
          ['hero', "The night I was born, every tool on the smithy wall turned to face my cradle. Down here it's every bolt."],
          ['agent', "Crusher Yard. Seize the scrap stock and the woman who moves it. She's flagged for the Engine."],
          ['hero', "You're standing on fifty tonnes of my scrap. Every ounce of it answers to me. Shall I ask it?"]],
        win: [
          ['hero', "Halcyon. Shiny outside, hollow in the middle. Into the press with the rest."],
          ['kael', "Ferra! I heard banging! Did you need... oh. You didn't need."],
          ['hero', "Never have, Sparks. Go sort the copper. And stay out from under car doors."]] },
      2: { zone: 'shafts', with: 'garo', goal: "Hold the hidden tunnel with Garo",
        card: "For years Ferra's steel has gone up the hidden tunnels and Garo's bread has come down, hand to hand, never face to face. Tonight Halcyon's lamps are in the tunnel.",
        meet: [
          ['sys', "The tunnels no map shows. Steel goes up, bread comes down. Tonight there are Halcyon lamps bobbing in the dark."],
          ['garo', "You'd be Ferra. Nobody else's steel comes cut that clean."],
          ['hero', "And you're Garo. Bread's too good for a smith. Years of trade, and not one face."],
          ['garo', "Never needed one. The Pact runs on steel."],
          ['hero', "Halcyon's found our tunnel. Pity. For Halcyon."]],
        win: [
          ['garo', "That captain's armour is decent iron. Sin to leave it lying."],
          ['hero', "Take it up. Make something honest of it. Steel up, bread down."],
          ['garo', "Same as always. Only now I know whose face to thank."]] },
      3: { zone: 'yard', rival: 'vex', goal: "Duel Vex in the Crusher Yard",
        card: "Vex left Ferra's Yard half-taught, sure that pulling and pushing are one and the same. Now he walks back in to prove it on his old teacher.",
        meet: [
          ['vex', "Ferra. Still sorting junk into little piles? Pull and push are one force. I proved it, across the tunnel."],
          ['hero', "You proved you can't take a lesson without arguing with it. You left half-taught, boy."],
          ['vex', "I left right. Opposites attract, teacher. Come close and find out."],
          ['hero', "I know every bad habit you've got. I gave you half of them."]],
        win: [
          ['vex', "...You read the Flux Flip before I threw it."],
          ['hero', "I taught you the half you kept. You're good, Vex. Better than me at the other half. There. Once."],
          ['vex', "Say it again. Louder. Slower."],
          ['hero', "Never. Go home to your yard. Come to mine for dinner some night. Bring nothing."]],
        lose: [
          ['vex', "Pull and push. One thing. Told you. Again, teacher?"]] },
      4: { zone: 'pit', goal: "Bury the drills in the Pit under scrap",
        intro: [
          ['sys', "The Three-Layer War. Every screen shows two films: Kael venting the Core Sump onto the Sky's labs, Nyra leading Halcyon's drills into Deepline."],
          ['sys', "Each layer is sure the other struck first. The Noble Ring is in uproar, the Surface holds the Buried Meridian, and down here the drills reach the Pit."],
          ['hero', "Kael spent that night in my Yard, sorting copper. Somebody's selling faces. I want the shop."],
          ['vex', "Whoever it is, their drills are in the Pit. Pull, or push?"],
          ['hero', "Both. Every bolt, every car door, every rusted rail in Deepline. Up. All of you."]],
        win: [
          ['sys', "Every scrap of junk in Deepline rises at Ferra's word, hangs there like a held breath, and drops on Halcyon's drills."],
          ['hero', "Good drill steel, wasted on Halcyon. I'll find it better work."],
          ['sys', "Snared in his own Cradle, Pell gives up the thief: Rue. At the Crater a second Kael flees the first, and the puppet show is over."],
          ['sys', "Four banners climb the Halcyon Spire toward the Engine Core. Ferra's scrap shields the stairs."],
          ['hero', "Sparks will want to hear it from me. Later. Now up. I've a mind to see what the Director's Engine is made of."]],
        card: "Two stolen faces on every screen have set the layers at war, and Halcyon's drills have reached the Pit Arena. Ferra knows where Kael was that night, and she has a whole Yard to throw." },
      5: { zone: 'rootways', foe: 'hex', goal: "Hold the Roots against Hex",
        intro: [
          ['sys', "A crown-ship fills the sky. One of Vael's champions walks into the Roots, and the dead in Thorne's garden sit up."],
          ['thorne', "A girl made half of ghost is waking my guests. Ferra, I need iron between the dead and the living."],
          ['hero', "The Yard sits right on top of your garden. If they walk, they walk into my people. Iron I've got."]],
        meet: [
          ['hex', "Scrap queen. You throw, it hits once. I throw, it hits twice. Do the sums."],
          ['hero', "Then I'll throw twice as much. I've a whole yard to throw."],
          ['vex', "And I've got the other half. Pull and push, teacher. Together, just once?"],
          ['hero', "For once. Tell anybody and you're scrap."]],
        win: [
          ['sys', "Ferra and Vex close a cage of floating iron round Hex. Her curses strike the bars twice, and the bars hold twice."],
          ['hex', "Heavy. Heavy twice. ...He'll want this garden later. I'll come back for it."],
          ['sys', "Hex drifts up through the iron like smoke, away to the crown-ship. Thorne tucks his guests back into bed."],
          ['hero', "Vex. You were good. I'll say it once."]],
        lose: [
          ['hex', "Hit, and hit again. That's how a curse counts, scrap queen."]],
        card: "Vael's champion Hex wakes the dead in the Roots under Ferra's Yard; Ferra and Vex cage her in floating iron until she flees to the crown-ship." },
      6: { goal: "Hold the rim with the Legion's iron",
        intro: [
          ['sys', "The Crater. The Hollow Legion comes down on the rim in full armour. Ferra smiles. That is a great deal of metal."],
          ['sys', "Six go past the Legion and up into the Crown. Kael runs at the front, throwing sparks."],
          ['hero', "Go on, Sparks. I dug you out from under a car door. Don't make me dig you out from under a crown."],
          ['kael', "Hold the rim for me, Ferra. I'll be back by breakfast."],
          ['hero', "Every scrap of Legion iron on this rim is about to learn who it belongs to."]],
        meet: [
          ['sys', "Itsuki comes down the flank of the Crown after the six, unhurried. Five elements wheel around him."],
          ['itsuki', "Iron. On one of my worlds they forged swords from it. You make piles. Step aside."],
          ['hero', "Piles of people who told me to step aside. You'll sit nicely on top."],
          ['itsuki', "Then build your pile, and stand on it."]],
        lose: [
          ['itsuki', "Scrap, then. Get up. Again."]],
        win: [
          ['sys', "Every plate of Legion armour on the rim flies at Itsuki at once. He cuts through it, and through it, and still it comes."],
          ['itsuki', "Enough. You held me. The six will not hold so well. I go back up."],
          ['sys', "He turns back up the Crown. From the rim, Ferra watches the crown-ship crack and fall into the Crater."],
          ['sys', "The door to the Beyond drags the Legion and every champion back through, Itsuki last. Their armour stays behind."],
          ['sys', "Next morning, in the Crusher Yard. Kael limps in with a black eye, grinning."],
          ['hero', "Salvage rights, Sparks. There's a crown-ship lying in the Crater, and every bolt of it answers to me."],
          ['hero', "I'll recycle what's left."]],
        card: "Ferra turns the Legion's own armour against it on the Crater rim while Kael and the six go up, and buries Itsuki in scrap until he turns back." }
    },

    // ---------------------------------------------------------------- SEN
    sen: {
      1: { zone: 'dojo', goal: "Clear the Rust Dojo of Halcyon's men",
        card: "Sen keeps a rusted metro car as his dojo, and keeps it spotless. Halcyon wants his technique on file, and sends men who do not wipe their feet.",
        intro: [
          ['sys', "The Rust Dojo: a dead metro car, scrubbed until it shines. A broom leans by the door. The cleanest room underground."],
          ['hero', "A square of white paper. One line of ink. I waited so long my teacher sat down. ...The line has not come yet."],
          ['agent', "Target: the swordsman. Directive: technique on file, subject intact. Move in."],
          ['hero', "Take off your boots."]],
        win: [
          ['sys', "Petals drift down from nowhere. Not one touches the floor before the last man does."],
          ['hero', "Draw."],
          ['sys', "Boot prints, from the door to where the men lie. Sen regards them for a long time. Then he fetches the broom."]] },
      2: { zone: 'dojo', with: 'sable', goal: "Hold the Rust Dojo with Sable",
        card: "Pell has sold the Lantern Cell. Its quiet one kneels on Sen's mat and asks to learn the Flash Step properly, and Sen does not answer for seven days.",
        meet: [
          ['sable', "Pell sold us. I ran. My Flash Step is fast, but it isn't true. Teach me."],
          ['hero', "..."],
          ['sys', "Seven days. Sable sits. Sen sweeps. On the eighth morning, boots ring on the platform outside, and he lays down the broom."],
          ['hero', "The step is not fast. It is finished before it begins."],
          ['sable', "...That's all?"],
          ['hero', "All. Halcyon followed you. Show me."]],
        win: [
          ['sable', "I was there before the captain swung. Before he knew he would."],
          ['hero', "Yes. Now you will always be there first."],
          ['sys', "A letter waits on the mat: three pages from Isa of the Archive, who once drew lines beside him. Sen answers in a single line."]] },
      3: { zone: 'metro', rival: 'pell', goal: "Duel Pell on the Old Metro platform",
        meet: [
          ['sys', "The Old Metro platform, outside the Rust Dojo. Pell walks the edge, strings glinting, Halcyon's men behind him."],
          ['pell', "Swordsman. You have something of mine. A quiet girl with a quick step. The Director would like her returned."],
          ['hero', "You sold her. She is not yours to want."],
          ['pell', "A thousand strings against one sword? Charming. Show me what you've taught her, then."],
          ['hero', "...Turn around."]],
        win: [
          ['pell', "...One line, and every string falls together. They said you were patient. They undersold it."],
          ['hero', "She stays."],
          ['pell', "Then keep her well, swordsman. Better than I did."],
          ['sys', "Pell rises into the dark on his last string. Sen sweeps the platform."]],
        lose: [
          ['pell', "Patience, swordsman. You haven't arrived yet. Again."]],
        card: "Pell comes down the Old Metro with Halcyon at his back to take Sable home to the Director. Between them stands one swordsman, in no hurry at all." },
      4: { zone: 'pit', goal: "Clear the Pit floor under the strings",
        intro: [
          ['sys', "The Three-Layer War. Two films on every screen: Kael gassing the Sky's labs, Nyra leading Halcyon's drills into Deepline. Each layer blames the other."],
          ['sys', "Above, the Noble Ring burns. On the Surface, drills sink into the Buried Meridian. In the Pit Arena, Pell's strings hang like rain."],
          ['sable', "Two faces. Two lies. One hand. The strings all run here."],
          ['hero', "Then we do not chase faces."],
          ['rook', "There's a thousand strings up there, sensei. You've got one sword."],
          ['hero', "One is enough."]],
        win: [
          ['sys', "One stroke. Every string from rafter to floor parts at once, and Pell's own Cradle folds shut on him."],
          ['pell', "One line through the Cat's Cradle. Twice now, swordsman. ...Her name is Rue. I made her. Send it to the Crater."],
          ['sys', "Kiri's crane carries the name. At the Crater a second Kael runs from the first, and Rue is gone. Three layers, played like puppets."],
          ['hero', "You sold the student I took in. Sit. Now you learn patience."],
          ['sys', "Four banners climb the Halcyon Spire toward the Engine Core, and the Engine hums like something calling. Sen climbs without a word."]],
        card: "Two stolen faces have set the three layers at each other's throats, and every string behind them runs to the Pit Arena. Sen has one sword." },
      5: { zone: 'metro', foe: 'noct', goal: "See the blade in the dark",
        intro: [
          ['sys', "A crown-ship fills the sky over the Crater. Vael sends a champion into the Old Metro, and the lamps go out like pinched wicks."],
          ['vael', "Go, my watchman. Snuff their lamps. Let the deep remember what it was before the first fire."],
          ['hero', "My dojo stands on this line. Sable sleeps in it. No."]],
        meet: [
          ['noct', "..."],
          ['hero', "A hilt with no blade. A swordsman who never arrives. I have never met a cut I could not see."],
          ['noct', "The cut arrives. I do not."],
          ['hero', "Then I will look at what is not there. One breath. Then the bell."]],
        win: [
          ['sys', "In the dark, Sen sees it at last: the blade that is not there. He draws once. Noct's sleeve falls in two halves."],
          ['noct', "...You saw it."],
          ['hero', "There was no blade. I saw that."],
          ['sys', "Noct bows, very slightly, and is gone into the dark toward the crown-ship. The lamps of the Old Metro wake again."]],
        lose: [
          ['noct', "Not yet."]],
        card: "Vael's champion Noct blacks out the Old Metro where Sen's dojo stands; Sen sees the blade that is not there, and Noct falls back to the crown-ship." },
      6: { goal: "Hold Itsuki on the Crater rim",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours down the rim like black rain, and the three layers meet it shoulder to shoulder."],
          ['sys', "Six go through the line and up into the Crown: Kael's thunder first, then Nyra, Pyra, Gale, Brakk and Nami."],
          ['sable', "Sensei. They're through. Whatever goes up after them comes past us."],
          ['hero', "Then we stand still a moment. Then we are done."]],
        meet: [
          ['sys', "A man with white hair comes down the flank of the Crown after the six. Five elements wheel around him. Itsuki."],
          ['itsuki', "A swordsman. They say you see everything. Then see this: you should step aside."],
          ['hero', "I see a man in a hurry. Take off your boots. This rim is my dojo now."],
          ['itsuki', "I do not stop for dojos."],
          ['hero', "One breath. Then we will see."]],
        lose: [
          ['itsuki', "You saw it coming. Seeing is not stopping. Again."]],
        win: [
          ['sys', "Draw. Falling Leaf. Three Breaths. Itsuki cannot pass one man standing very still. Above them, the six reach the top."],
          ['itsuki', "Long enough. You held me long enough. I go back up to finish them with my own hands."],
          ['sys', "He turns and climbs the Crown again. From the rim, Sen watches the crown-ship tip, crack, and fall into the Crater."],
          ['sys', "The door to the Beyond drags the Legion and every champion back through. Itsuki goes last, and does not look down."],
          ['sys', "Next morning, in the Rust Dojo. Sable sleeps on the mat. A letter from Isa waits on the step."],
          ['hero', "One line of ink. My teacher waited a whole autumn for it. Now, at last, I see it."],
          ['hero', "One stroke. Enough."]],
        card: "Sen holds the Crater rim while the six go up, then stands very still in Itsuki's way until even Itsuki has to turn back to the Crown." }
    },

    // ---------------------------------------------------------------- ROOK
    rook: {
      1: { zone: 'slums', goal: "Fight off the collectors in the Slums",
        card: "Rook of the Lantern Cell has never fought by himself, even on his own. Halcyon has come back to the Slums to finish what it started the night the Cell was sold.",
        intro: [
          ['sys', "The Deepline Slums. Washing lines, dripping pipes, a kettle screaming somewhere. Rook never fights alone. Not even when he is alone."],
          ['hero', "Lantern Cell, loudest member, reporting! Also the second loudest! And the third! Twin Rush!"],
          ['agent', "Cell remnant, male. The one who held the door. Collection is overdue. Bring in the original."],
          ['hero', "The door. Sure. Let's talk about anything else. ...And the original? Most mornings even I can't tell."]],
        win: [
          ['hero', "Count 'em up. One of me beat all of you. Fine, six of me. Same guy, mostly."],
          ['kael', "Rook! You started without me? Again?"],
          ['hero', "Never without you, brother. I just started with me. There's plenty of me to go round."]] },
      2: { zone: 'slums', with: 'kael', goal: "Hold the Slums with Kael",
        card: "Halcyon is building a cage on the Slums' stairs. Rook and Kael, brothers out of the trash, mean to decide which way its door opens.",
        meet: [
          ['kael', "Rook! Halcyon's bolting a cage together on the stairs. Big one. Both-of-us big."],
          ['hero', "For us? We're flattered. Oh, and Kiri's crane came down the Stacks. She says some Subject up in the Sky can see Husks."],
          ['kael', "Kiri's the paper girl? The one with two of her?"],
          ['hero', "Two of her. Only person alive who gets it. Anyway. You, me, all of me. Brothers?"],
          ['kael', "Always. Clones out, Rook."],
          ['hero', "Into the cage! ...No. Wait. Other direction."]],
        win: [
          ['kael', "Their captain had a key on his belt. A Halcyon key."],
          ['hero', "Pell had a key once. A key to the Engine. He paid for it with us."],
          ['kael', "Then let's go make him give back the change."]] },
      3: { zone: 'pit', rival: 'pell', goal: "Duel Pell in the Pit Arena",
        card: "In the Pit Arena the sensei who taught Rook his clones, and then sold the Lantern Cell for a key, has kept his old student's seat warm.",
        meet: [
          ['pell', "Rook. My best student. You came to the Pit at last. I've kept your seat warm, front row, as always."],
          ['hero', "You taught me the clones. Then you sold us for a key, and my clones held that door till they were smoke."],
          ['pell', "And you walked out of the smoke behind them. I was so proud of you. Truly."],
          ['hero', "Don't be proud. Start counting. There's always more of me."]],
        win: [
          ['pell', "...More of you than I counted. You were never any good at being only one."],
          ['hero', "It's not a trick, Pell. It's friends. You never had any. Where's the key?"],
          ['pell', "Somewhere the Director can't reach it. Another day, dear boy."],
          ['sys', "The strings draw him up into the rafters like a spider up its own thread, and the Pit is empty."]],
        lose: [
          ['pell', "Strings beat clones, Rook. Did I teach you nothing? Up. Again."]] },
      4: { zone: 'pit', goal: "Hold the Pit while the net closes",
        intro: [
          ['sys', "The Three-Layer War. On every screen, Kael opens the Sump's vents on the Sky's labs, and Nyra walks Halcyon's drills into Deepline."],
          ['sys', "Each layer swears the other struck first. The Noble Ring burns, the Buried Meridian shakes, and Halcyon's drill crews pour into the Pit."],
          ['hero', "Kael was asleep on my floor that night! Snoring! I have witnesses! Mostly me, but a lot of me!"],
          ['sable', "Faces lie. Strings don't. Every string runs here. To Pell."],
          ['moro', "We close his own Cradle on him. You hold the floor. All of you."],
          ['hero', "A whole Pit full of Rooks. Finally, a crowd my size."]],
        win: [
          ['sys', "The Rooks hold the Pit floor. Sable and Moro pull the last thread, and Pell's own Cat's Cradle snaps shut on him."],
          ['pell', "Caught by my own lesson. ...Hold it tight, Rook. I shan't struggle."],
          ['hero', "Why not? You always struggle. You taught us struggling."],
          ['pell', "Because the faces were mine to teach. The thief is Rue. Someone send that to the Crater."],
          ['sys', "Kiri's crane carries the name. At the Crater a second Kael bolts from the crowd, and Rue is gone. The whole war was a puppet show."],
          ['sys', "Hollis sews a fourth banner, for the Hidden Clans, and Rook carries it up the Halcyon Spire toward the Engine Core. Loudly."]],
        card: "Two stolen faces have the three layers at each other's throats. Rook knows exactly where Kael slept that night, and the Cell has a net for the man pulling the strings." },
      5: { zone: 'market', foe: 'rue', goal: "Out-clone Rue at the Market",
        intro: [
          ['sys', "A crown-ship blots out the sky. Vael is here, and Rue has sold herself to him for a crown."],
          ['hero', "Vesna's on two corners. Ferra's on three. Kael's on the roof AND in the fountain. Yep. That's Rue."]],
        meet: [
          ['rue', "Rook. I copied your clones once. Remember? Far too many Rooks. Even for me."],
          ['hero', "Remember? Best week of my life. So who's holding your leash now?"],
          ['rue', "Someone who gives a crown, not strings. A thousand of you, all mine, all his."],
          ['hero', "You can copy my clones. You can't copy my friends. And I've got more of those too."]],
        win: [
          ['sys', "Rooks pin every face in the Market. Only one casts no reflection in the puddles: the real Rue."],
          ['hero', "Found you. Dyna! Pell! Now!"],
          ['sys', "Dyna's blast tears the masks away, and Pell's threads cut the copies. Rue runs for the crown-ship with no face at all."],
          ['hero', "Too many of us. Even for you. Tell your new boss we're coming. All of us."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Want to watch your clones again?"]],
        card: "Rue sells herself to Vael and wears every leader in the Neon Market; Rook's clones find the one face with no reflection, and she runs for the crown-ship." },
      6: { goal: "Hold the rim with a thousand Rooks",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours down on the rim, hundreds of thousands strong. Rook counts. Rook is pleased."],
          ['hero', "Hundreds of thousands? Finally, a fair fight. A Thousand Rooks!"],
          ['kael', "Brother! Six of us go up. Can you hold the rim?"],
          ['hero', "Me, me, me and me. Go! Bring me back a piece of crown!"],
          ['sys', "Kael climbs into the Crown with Nyra, Pyra, Gale, Brakk and Nami. A thousand Rooks close the rim behind them like a door."]],
        meet: [
          ['sys', "Itsuki comes down the flank of the Crown after the six. A hundred Rooks stand in his way."],
          ['itsuki', "Clones. Which of you is real?"],
          ['hero', "Some days I can't tell either! Lantern Cell rule: nobody fights alone. That goes double for my brother."],
          ['itsuki', "Then I will cut all of you, and ask the last."]],
        lose: [
          ['itsuki', "Many of you. Not enough of you. Again."]],
        win: [
          ['sys', "Itsuki cuts through a hundred Rooks, then a hundred more. There is always one more in the way."],
          ['itsuki', "Enough. Wherever the real one stands, he held me. I go back up."],
          ['sys', "Itsuki turns back to the Crown. On the rim, a thousand Rooks look up at once and watch the crown-ship fall into the Crater."],
          ['sys', "The door to the Beyond drags the Legion and every champion back through. Itsuki goes last."],
          ['sys', "Next morning, in the Slums. Kael is asleep on Rook's floor again, a piece of crown under his arm."],
          ['hero', "Sable's home. Moro's asleep. My brother brought me a souvenir. Lantern Cell, reporting. All of us. Every one."],
          ['hero', "There's always more of me!"]],
        card: "Rook sends his brother Kael up with the six, then fills the Crater rim with clones until Itsuki tires of cutting and turns back to the Crown." }
    },

    // ---------------------------------------------------------------- SABLE
    sable: {
      1: { zone: 'slums', goal: "Beat Halcyon's hunters in the Slums",
        card: "Down in the Slums it is quiet. Halcyon has come for the quiet one of the Lantern Cell, and the air is starting to hum.",
        intro: [
          ['sys', "The Deepline Slums, under the Skylift's roots. Pipes drip. Nobody moves. Then the air begins to hum."],
          ['agent', "Cell runaway, female, the quiet one. Secure her before she does anything."],
          ['hero', "Too late."],
          ['sys', "For the first man, it is already over. The rest have not noticed yet."]],
        win: [
          ['hero', "Static has to go somewhere."],
          ['hero', "Pell sold us for a key. Every hand he hires, I go through. Then his."]] },
      2: { zone: 'dojo', with: 'sen', goal: "Hold the Rust Dojo with Sen",
        card: "Sable's Flash Step is quick, not true. She sits seven days in Sen's Rust Dojo while he sweeps, and on the eighth, Halcyon follows her in.",
        meet: [
          ['hero', "Sen. Pell sold the Cell, and I ran. My Flash Step is fast. It isn't true. Teach me."],
          ['sen', "..."],
          ['sys', "Seven days. She sits. He sweeps. Nobody speaks. On the eighth morning, he leans the broom against the wall."],
          ['sen', "The step is finished before it begins. Be there. Then arrive."],
          ['hero', "...A week, for that."],
          ['sen', "Boots on the platform. Show me."]],
        win: [
          ['sen', "You were there before the captain's hand knew it would move."],
          ['hero', "I was. Thank you, sensei. The real kind."],
          ['sen', "Go. Run at him, if you must. Run well."]] },
      3: { zone: 'slums', rival: 'kael', goal: "Duel Kael in the Slums",
        card: "Two kinds of lightning in one slum is one too many. The quiet girl with violet lightning and the loud boy with white are about to settle, in public, whose sky it is.",
        meet: [
          ['kael', "Hey! Quiet girl! You're the one with the purple lightning, right? Big fan. Huge."],
          ['hero', "Violet. You throw yours at everything. Loudly. Deepline has one thunder too many."],
          ['kael', "Agreed. Yours."],
          ['hero', "In public, then. Whoever's standing keeps the sky."]],
        win: [
          ['kael', "Okay. Okay! You're fast. Like, actually lightning fast. Which, fine. Fair."],
          ['hero', "You're loud. Thunder loud. ...You're not bad."],
          ['kael', "So who keeps the sky?"],
          ['hero', "We keep arguing. In public. Same time tomorrow."]],
        lose: [
          ['kael', "Ha! That's the sound of me winning! Again? Say again. Please say again."]] },
      4: { zone: 'pit', goal: "Flash through the Pit Arena to Pell",
        intro: [
          ['sys', "The Three-Layer War. Every screen shows it: Kael opening the Sump's vents onto the Sky's labs. Nyra leading Halcyon's drills into Deepline."],
          ['sys', "The Sky blames Deepline. Deepline blames the Sky. The Noble Ring is burning, the Surface holds the Buried Meridian, and the drills reach the Pit."],
          ['hero', "The Kael in that film was quiet. The air didn't hum. Kael is never quiet."],
          ['moro', "Pell's up in the rafters. Rook's got the floor. Go."],
          ['hero', "I've been running at him since the night he sold us. Tonight I arrive."]],
        win: [
          ['sys', "Flash Step. She is at the last string before Pell knows she has moved. The Cradle closes on its maker."],
          ['pell', "My quiet one. I always should have watched the quiet one. ...The faces were Rue's. Tell the Crater."],
          ['sys', "Kiri's crane flies the name to the Crater. A second Kael bolts from the crowd, and Rue is gone. Somebody was working both sides like puppets."],
          ['hero', "Rook held the door for us. That night. ...Thank you, Rook."],
          ['rook', "Was that a thank-you? Moro! MORO! She thanked me! Somebody write it on a banner!"],
          ['sys', "Four banners climb the Halcyon Spire toward the Engine Core. Sable is first on the stairs. Whatever the Engine is calling, it has to stop now."]],
        card: "Two films on every screen have set the layers at each other's throats. Sable knows whose hands taught those faces, and tonight she means to arrive." },
      5: { zone: 'metro', foe: 'noct', goal: "Outrun the dark to Noct",
        intro: [
          ['sys', "A crown-ship blots out the sky. Vael's champion walks into the Old Metro, and the lamps die one by one."],
          ['hero', "Sen's dojo is down this line. Dark? Fine. Lightning brings its own."]],
        meet: [
          ['noct', "Lightning. I have cut the light. You will not see me come."],
          ['hero', "I don't need to see you. I need to be there first."],
          ['noct', "Then be there."]],
        win: [
          ['sys', "A violet flash in the black, faster than his cut. For one heartbeat the Old Metro is bright as noon."],
          ['hero', "There. I arrived."],
          ['sys', "Caught in the glare, Noct steps back into the last shadow and is gone, up to the crown-ship."],
          ['hero', "Sen. Your dojo's still standing. Let the lamps come back."]],
        lose: [
          ['noct', "The cut arrived. You did not."]],
        card: "Vael's champion Noct cuts the lights on the line where Sen's dojo stands; Sable's lightning gets there first, and Noct falls back to the crown-ship." },
      6: { goal: "Hold the Slums to the end",
        intro: [
          ['sys', "The Deepline Slums. Far above, the sky over the Crater burns, and the Legion pours down the Skylift's roots."],
          ['citizen', "Sable! They're in the stairwells! All of them, all at once!"],
          ['hero', "Rook's on the rim. Sen's on the rim. Then the Slums are mine."]],
        meet: [
          ['sys', "A Siege Walker shoulders down between the roofs, a Legion captain on its back. The air begins to hum."]],
        win: [
          ['sys', "A violet flash. For one heartbeat the Slums are bright as noon. When it fades, the Siege Walker lies on its side."],
          ['sys', "Then the light far up the shafts changes; the violet drains out of it. The Legion stops, and is drawn away like smoke."],
          ['hero', "...The sky closed. Somebody up there arrived first."],
          ['sys', "Next morning, Sable kneels in the Rust Dojo, polishing the floor. Sen comes in. He says nothing. She smiles."],
          ['hero', "Lesson's tomorrow, sensei. Today I sit still. You taught me that too."],
          ['hero', "My hand is the storm."]],
        card: "Sable holds the Slums alone through the Legion's last push and drops a Siege Walker in a single flash, while the sky over the Crater closes." }
    },

    // ---------------------------------------------------------------- MORO
    moro: {
      1: { zone: 'metro', goal: "Clear Halcyon out of the Old Metro",
        card: "Somewhere down the Old Metro, between two dead lamps, Moro is having an excellent nap. Halcyon has come down the line to wake him.",
        intro: [
          ['sys', "The Old Metro, in the long dark between two station lamps. Water ticks off a rail. Moro is asleep on a bench."],
          ['hero', "I was asleep. It was a very good sleep. You owe me the end of it."],
          ['agent', "Cell remnant, male, the sleepy one. Ran with the girl. Wake him and bag him."],
          ['hero', "Fine. I'm very good at making things short."]],
        win: [
          ['hero', "Shadow Snare. Hold still. ...There. Now everybody's resting."],
          ['hero', "Pell taught us shadows are for hiding. He was wrong. They're for holding."]] },
      2: { zone: 'slums', with: 'rook', goal: "Hold the Slums with Rook and Sable",
        card: "Rook has been louder than usual for days, because the door he held still burns behind his eyes. Moro notices, and offers to carry it, while Halcyon climbs the stairs.",
        meet: [
          ['rook', "Moro! Moro moro moro. You awake? Halcyon's in the Slums! We need you! All of us need you!"],
          ['hero', "Awake. Mostly. You've been extra loud all week. What's wrong?"],
          ['rook', "Nothing! Why would anything be wrong? Everything's great! Look how great!"],
          ['hero', "The door you held is still burning behind your eyes. I know. I'll carry it. You keep being loud."],
          ['sable', "Stop talking. Captain on the stairs."]],
        win: [
          ['rook', "...Thanks. For the, you know. The carrying thing."],
          ['hero', "Didn't catch that. You weren't loud enough."],
          ['sable', "Three of us. The Cell's still a Cell."]] },
      3: { zone: 'ward', rival: 'vesper', goal: "Duel Vesper on the Night Ward roofs",
        card: "Every night a red scarf walks through Moro's shadows in muddy boots. Tonight he follows it up onto the Night Ward's rooftops to teach it to knock.",
        meet: [
          ['sys', "The Night Ward roofs, Aurelia. Moro has come up through his own shadow, after a red scarf that keeps walking through it."],
          ['vesper', "You followed me all the way up. That's new. Usually you just sigh."],
          ['hero', "You walk through my shadows like they're doors. Every night. Muddy boots. It's rude."],
          ['vesper', "Lamps go out, doors open. Everybody knows that."],
          ['hero', "Mine don't open. Mine hold on. Come and find out."]],
        win: [
          ['vesper', "...You held me. In my own shadow. All right. That's a very good trick."],
          ['hero', "Knock next time."],
          ['vesper', "On a shadow?"],
          ['hero', "Find a way. You're clever. It's annoying."]],
        lose: [
          ['vesper', "Behind you. Still behind you. Again?"]] },
      4: { zone: 'pit', goal: "Pin the drill crews in the Pit",
        intro: [
          ['sys', "The Three-Layer War. Every screen plays two films: Kael opening the Sump's vents on the Sky's labs, Nyra leading the drills into Deepline."],
          ['sys', "Each layer blames the other. Both are wrong. Both bleed. In the Pit Arena, Halcyon's drill crews break in through the walls."],
          ['hero', "Watch Nyra's film again. Her shadow moves a beat late. Shadows don't lie. Faces do."],
          ['sable', "Pell's in the rafters. Rook has the floor. You?"],
          ['hero', "I'll hold everything else."]],
        win: [
          ['sys', "Moro's shadows pin every drill crew in the Pit, like flies in amber. Not hidden. Held."],
          ['pell', "My own lesson, turned inside out. ...The faces were Rue's, my sleepy one. Send it to the Crater."],
          ['hero', "You taught it wrong. I fixed it. Sit still, sensei. Your turn to be held."],
          ['sys', "Kiri's crane carries the name. At the Crater a second Kael runs from the real one, and Rue is gone. Someone was playing all three layers."],
          ['sys', "Four banners climb the Halcyon Spire toward the Engine Core. Moro climbs too, yawning. Whatever the Engine is calling, he would like it to stop."]],
        card: "Deepline blames the Sky for the drills, and the Sky blames Deepline for its labs. Down in the Pit, Moro, who would rather be asleep, notices a shadow that moves wrong." },
      5: { zone: 'platform', foe: 'orin', goal: "Hold Orin's doors at Platform Zero",
        intro: [
          ['sys', "A crown-ship fills the sky. At Platform Zero, the oldest stop in Deepline, doors open in thin air and the Legion walks out."],
          ['hero', "When the drills came I put the Slums' little ones to sleep down here. Deepest stop. Safest stop."],
          ['hero', "Was. Okay. I'm awake now."]],
        meet: [
          ['orin', "Shadow-keeper. Every wall here is a door to me. And every door now opens for him."],
          ['hero', "You're opening doors into a room full of sleeping kids. That's very rude."],
          ['orin', "Rude? Then shut them, shadow-keeper. If you can."],
          ['hero', "I can't shut doors. I can hold whoever walks through them."]],
        win: [
          ['sys', "Moro's shadows close on every doorway at once, like a hand cupped over a candle. Nothing walks through. Not even Orin."],
          ['orin', "...Held. In a shadow. That's new. Wrong door, then."],
          ['sys', "Orin steps back through the last door and is gone to the crown-ship. The doors seal behind him."],
          ['hero', "There. Back to sleep, everybody. Nothing comes through while I'm here."]],
        lose: [
          ['orin', "Wrong door, shadow-keeper. Again?"]],
        card: "Vael's champion Orin opens doors for the Legion at Platform Zero, where the Slums' children sleep; Moro's shadows hold every doorway shut." },
      6: { goal: "Lay the Legion down",
        intro: [
          ['sys', "The Old Metro. Far above, the sky over the Crater burns. Down here, the Legion's last push comes down the tunnels."],
          ['hero', "The kids are asleep at Platform Zero again. I'd like them to stay asleep."]],
        meet: [
          ['sys', "A Siege Walker grinds down the old line, scraping sparks from both walls, a Legion captain on its back."],
          ['hero', "That's very loud. Shh."]],
        win: [
          ['sys', "Moro's shadows climb the walker's legs, and it lies down in the tunnel like a tired old dog. Its captain sleeps beside it."],
          ['sys', "Then the lamps flicker and the dark changes. Every Legion soldier in the tunnel stands still, then is drawn away like smoke."],
          ['hero', "Oh. Somebody finished it. Up there. Good. Nice and quiet."],
          ['sys', "Next morning, at Platform Zero. A dozen kids wake up in a heap. Moro is asleep in the middle of them."],
          ['hero', "Five more minutes. ...Fine. Ten. Nobody's coming through any doors. I checked."],
          ['hero', "The long night begins."]],
        card: "Moro holds the Old Metro through the Legion's last push and puts a Siege Walker to sleep in the tunnel, while far above the sky over the Crater closes." }
    },

    // ---------------------------------------------------------------- PELL
    pell: {
      1: { zone: 'pit', goal: "Beat the Director's squad in the Pit",
        card: "The Pit Arena roars every night for Pell, the smiling porcelain mask who taught the Lantern Cell. For ten years he has also been the Director's spymaster.",
        intro: [
          ['sys', "The Pit Arena. Strings glint in the rafters like spider silk after rain. Pell, sensei of the Lantern Cell, smiles behind white porcelain."],
          ['director', "Spymaster. Your report is three days late, and I do not keep slack strings. A squad is on its way down to test the tension."],
          ['hero', "Three days? I was rehearsing, Director. Send your squad in. I'll teach them the steps."],
          ['hero', "Three layers, three strings, one pair of hands. Somebody must hold the balance. Why not a man who bows so well?"]],
        win: [
          ['hero', "Do tell the Director his testers were marvellous. Wooden, of course. But marvellous."],
          ['director', "Noted. Keep the layers watching each other, Spymaster. A city that watches its neighbours never looks up at my Engine."],
          ['hero', "Of course. Balance."],
          ['sys', "When the stands are empty, he dusts three seats in the front row. Nobody has sat in them since the night he sold their owners."]] },
      2: { zone: 'blank', with: 'rue', goal: "Break Rue out of the Blank Wing",
        card: "In Halcyon's Blank Wing, where nothing casts a shadow, Pell finds a prisoner with no face and no voice. He means to teach it to wear anyone's.",
        meet: [
          ['sys', "The Blank Wing, high in Aurelia. White walls, white light, not one shadow anywhere. In the last cell sits a shape with no face."],
          ['hero', "Good evening, little nothing. The guards say you become whatever you look at. Shall we test that?"],
          ['rue', "...Evening. Little nothing."],
          ['hero', "Ha! My voice, near enough. A touch flat in the vowels. Now watch my hand. Then yours. ...Oh, yes."],
          ['rue', "Oh, yes. Any face I please. ...Whose?"],
          ['hero', "Whoever is useful, my dear. The guards are coming, and nobody told them you were leaving. Shall we?"]],
        win: [
          ['rue', "Their captain. I wore him. 'Open the door, you idiots.' They opened it."],
          ['hero', "Beautiful. An hour out of the box, and already my finest pupil. You'll want a name. Rue, I think. A small bitter herb."],
          ['sys', "On the long way down to Deepline he teaches her a hundred faces. Not once does he ask what her own looks like."]] },
      3: { zone: 'pit', rival: 'rook', goal: "Duel Rook in the Pit Arena",
        card: "Rook comes to the Pit to collect for the whole Lantern Cell. Pell, who sold it for a key, must face the loudest and most loyal pupil he ever had.",
        meet: [
          ['rook', "Pell! You sold us. Sable, Moro, me, the whole Cell, for one key. We've come to collect. All of us."],
          ['hero', "Rook. Still saying 'we' when you mean 'I'. I did adore that about you."],
          ['rook', "Adore this! Twin Rush!"],
          ['hero', "Strings beat clones, dear boy. Front row, please. Class is in session."]],
        win: [
          ['rook', "...Still. Not. Done. I've got clones left. I've always got clones left."],
          ['hero', "You always did. I counted you wrong, all those years. I am sorry for that."],
          ['hero', "...No. I sold the right to be sorry along with you. Another day, Rook."]],
        lose: [
          ['rook', "That one was for the door. Get up, Pell. The next one's just for me."]] },
      4: { zone: 'pit', goal: "Hold the Pit against Halcyon's crews",
        intro: [
          ['sys', "The Three-Layer War. Every screen plays two films: Kael gassing the Sky's labs, Nyra leading Halcyon's drills into Deepline."],
          ['sys', "Each layer swears the other struck first. Neither film is true. Both faces were worn by Rue, exactly as Pell taught her."],
          ['director', "Splendid work, Spymaster. Sky against Deepline, the Surface caught between, and nobody looks up. Hold the Pit while my drills go deep."],
          ['hero', "I taught her that face. I taught her the boy's. And every night I called it balance."],
          ['hero', "Somewhere up in the Noble Ring my star is cutting her strings mid-aria. Good girl. Your drills are burying Deepliners, Director. Your men come through me."]],
        win: [
          ['sys', "Across the Pit, the Lantern Cell draws Pell's own Cat's Cradle shut around him. He could slip it. He does not."],
          ['rook', "Got you! ...Hang on. You taught us how to get out of this. Why aren't you?"],
          ['hero', "Because for once the strings are in the right hands. The face-thief is Rue. I named her for regret. Kiri, fly it to the Crater."],
          ['sys', "Vesna calls in Halcyon's debts, Ashka walks out of the Sump, and at the Crater a second Kael runs from the first. Rue is gone."],
          ['sys', "Four banners climb the Halcyon Spire toward the Engine Core. They carry Pell up with them, still tied, still bowing."]],
        card: "Halcyon's drills break into Deepline behind a stolen face, and the Director orders Pell to keep the Pit quiet while they dig. Pell taught that face to the thief himself." },
      5: { zone: 'market', foe: 'rue', goal: "Face the pupil you made",
        intro: [
          ['sys', "A crown-ship blots out the sky. Vael is here with his champions, and Rue kneels to him and sells herself for a crown."],
          ['citizen', "Vesna's selling us! Ferra's selling us! Pell's... no, Pell's tied up. Then who's selling us?"],
          ['hero', "My pupil, wearing their faces. Untie me, Rook. This one is my debt."]],
        meet: [
          ['rue', "Sensei. He gives me a crown. A crown is a face nobody can take off. You only ever gave me other people's."],
          ['hero', "I gave you every face but your own. I never asked for yours. I'm asking now."],
          ['rue', "I don't have one. He doesn't ask. He only gives."],
          ['hero', "He gives a crown with nothing inside it. It will fit you perfectly. That is what frightens me."]],
        win: [
          ['sys', "Pell's threads go out one last time, and every copy in the Market drops like a puppet with its strings cut."],
          ['rue', "...You still win. You always win. So I go to someone who lets me."],
          ['sys', "Rue runs through the Legion for the crown-ship, wearing nobody's face at all, not even her own."],
          ['hero', "My finest work, and twice I made her for the wrong master. No more strings. Not for anyone."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Your own strings, sensei."]],
        card: "Rue sells herself to Vael and wears the faces of Deepline's leaders in the Neon Market; Pell faces the pupil he made, and she flees to her new master." },
      6: { goal: "Hold the Pit Arena to the end",
        intro: [
          ['sys', "The Pit Arena. The sky over the Crater burns far away, and the Legion's last push spills over the arena walls."],
          ['hero', "I promised no more strings on anyone. Strings on the arena, though? That is merely architecture."]],
        meet: [
          ['sys', "A Siege Walker climbs over the arena wall, a Legion captain on its back. The stands crack beneath it."],
          ['hero', "Such a large partner. Shall we dance?"]],
        win: [
          ['sys', "Pell's threads loop the walker's legs, once, twice, and it waltzes itself off the arena wall."],
          ['sys', "Then a paper crane drops into the Pit from far above. The Legion in the stands goes still and drifts away like smoke."],
          ['hero', "From Kiri. The Crown is down. My Lantern Cell held the rim. Rook will be unbearable for a year."],
          ['sys', "Next morning, Pell sweeps the empty Pit. He leaves his porcelain mask on a seat and walks out without it."],
          ['hero', "No strings. No master. Only an old man and a broom. ...I think I shall like it."],
          ['hero', "You danced beautifully."]],
        card: "Pell holds the Pit Arena through the Legion's last push and waltzes a Siege Walker off the wall, then reads on Kiri's crane that the Crown has fallen." }
    },

    // ---------------------------------------------------------------- THORNE
    thorne: {
      1: { zone: 'rootways', goal: "Clear Halcyon out of the catacombs",
        card: "Under Deepline's oldest tunnels lie the war dead of 2091, and Thorne keeps them as a garden, borders and all. Halcyon has come down with sacks, wanting the bones for its Engine.",
        intro: [
          ['sys', "The catacombs under the oldest part of Deepline. The dead of the Ashfall War lie in neat rows, planted like bulbs."],
          ['hero', "Good evening. Do mind the borders. The ribs are flowering beautifully this year."],
          ['agent', "Halcyon survey. Bone stock is reclassified as filter material for the Engine. Clear the site. All of it."],
          ['hero', "My guests have rested nearly a century without your help. May I show you to a bed of your own?"]],
        win: [
          ['hero', "Lovely. They'll have taken root by spring."],
          ['hero', "Now, a note to Ume of the Glowwild. Her pollen had the whole garden sneezing for a week. I must thank her. Firmly."]] },
      2: { zone: 'heartroot', with: 'vesna', goal: "Defend Sunday tea with Vesna",
        meet: [
          ['vesna', "Thorne. Sunday. I brought the cups, and a page of the Ledger I can't stop reading."],
          ['hero', "And I the tea. Halcyon's page, I imagine. It does look heavier than the cups, my dear."],
          ['vesna', "It grows every week. And today they've sent men down your stair to read the rest of it."],
          ['hero', "Then we shall finish our tea after. The dead keep their own accounts. Let me help with the living."],
          ['agent', "Targets confirmed: the Ledger woman and the grave man. Secure the book. Bag the bones."],
          ['hero', "During tea. How very rude."]],
        win: [
          ['vesna', "Their captain owed me. Consider him settled."],
          ['hero', "And now he owes me a bed. More tea? It has barely stewed."],
          ['vesna', "Always. And no, I'm not charging you. I never will. Tell no one."]],
        card: "Every Sunday Vesna, keeper of the Red Ledger, brings the cups and Thorne brings the tea. This Sunday Halcyon sends men down the catacomb stair, after the book and the bones both." },
      3: { zone: 'rootways', rival: 'ume', goal: "Duel Ume among the bones",
        card: "Every spring Thorne's cuttings go up to the Glowwild and Ume's pollen comes down to the catacombs. This year Ume, the Glowwild's gardener, has come down herself to settle whose garden is finer.",
        meet: [
          ['ume', "Thorne! I came down to see your famous garden. Your cuttings arrive every spring, so very polite."],
          ['hero', "And your pollen arrives each spring, so very effective. The whole catacomb sneezed for a week."],
          ['ume', "Wasn't it wonderful? Oh, don't touch the purple one. Shall we see whose garden wins?"],
          ['hero', "Cuttings against pollen. How delightful. Do wipe your feet. Those are somebody's grandparents."]],
        win: [
          ['ume', "Your bones bite back! I didn't know bones could bite."],
          ['hero', "Nor I that spores could. My compliments. Do take a cutting home."],
          ['ume', "I'll send pollen."],
          ['hero', "Please don't. ...Achoo."]],
        lose: [
          ['ume', "Oh! Something in your garden is blooming. Oh dear. It's you."]] },
      4: { zone: 'pit', goal: "Fight beside the risen dead in the Pit",
        intro: [
          ['sys', "The night of the Strings Cut. Drills crack the catacomb walls, and Halcyon's crews pour through the graves toward the Pit."],
          ['vesna', "Our screens say the Sky's Nyra led them in. The Sky's screens say our Kael gassed their labs. The Ledger says Halcyon paid for both."],
          ['hero', "So each side blames the other, and the Director sits back. Faces are cheap, my dear. Bones are honest."],
          ['hero', "My guests heard the drills, and would like a word. Rise, please, everyone. The living half of Deepline needs the dead half."]],
        win: [
          ['sys', "The war dead stand up for the living and walk Halcyon's crews, very politely, out of the tunnels."],
          ['hero', "Thank you, everyone. Back to bed now. Mind your neighbours' fingers."],
          ['vesna', "Nicely done. Pell's caught in his own Cradle, and he has named the thief of faces: Rue. Both films were her."],
          ['sys', "Kiri's crane carries the name to the Crater. The Sky and the Surface have risen too. Hollis raises a fourth banner, and four climb the Spire."],
          ['hero', "Then I shall come too. Something at the Engine Core has been calling into the dark for years. My guests hear it. They don't care for it."]],
        card: "Deepline's screens blame a Sky singer for Halcyon's drills, and the Sky's blame a Deepline boy for its labs. The drills have broken into the graves, and Thorne's guests heard them." },
      5: { zone: 'rootways', foe: 'hex', goal: "Put the dead back to sleep",
        intro: [
          ['sys', "A crown-ship blots out the sky. Vael sends a champion into the Roots, and Thorne's guests begin to walk."],
          ['hero', "My guests are walking. Every one of them. On a Sunday. That is not polite."]],
        meet: [
          ['hex', "Gardener. Where I come from, everything happens twice. Your dead only died once. Let them walk again."],
          ['hero', "They died in the Ashfall War, and they have earned their beds. Who are you, to wake them?"],
          ['hex', "Hex. My world ended twice. He says yours will too."],
          ['hero', "Then you are welcome in my garden as a guest, young lady. Never as a gardener."]],
        win: [
          ['sys', "One by one, Thorne lays the walking dead back down. Then his bone cuttings close round Hex like a hedge."],
          ['hex', "Your bones bite. Twice. ...This garden would have been nice to keep."],
          ['sys', "Hex rises through the roots like ghost light, back to the crown-ship. The garden is quiet again."],
          ['hero', "Hush now, everyone. It's Sunday."]],
        lose: [
          ['hex', "Hit, and hit again. Your guests answer to me now."]],
        card: "Vael's champion Hex wakes the dead in Thorne's garden; Thorne tucks his guests back into their beds one by one, and Hex flees to the crown-ship." },
      6: { goal: "Keep the garden to the end",
        intro: [
          ['sys', "The catacombs. Far above, the sky over the Crater burns. The Legion's last push comes down through the Roots."],
          ['hero', "Uninvited guests, and so very many of them. I shall need more beds."]],
        meet: [
          ['sys', "A Siege Walker breaks through the catacomb ceiling, a Legion captain on its back, and sets one foot on the ribs."],
          ['hero', "Mind the borders, please. The ribs are flowering."]],
        win: [
          ['sys', "The dead of the Ashfall War rise one last time and draw the Siege Walker down into the soil. Its captain goes with it."],
          ['sys', "Then the ghost light in the Roots goes out. The Legion goes still, and is drawn up through the earth like smoke."],
          ['hero', "Ah. The door upstairs has closed. And not one new guest out of it. How tidy."],
          ['sys', "Next morning, Thorne replants the ribs the walker trampled. Vesna comes down the stair with the tea."],
          ['hero', "Sit, my dear. It's Monday. The garden is open to visitors again."],
          ['hero', "Welcome to my garden."]],
        card: "Thorne keeps his catacomb garden through the Legion's last push, and the dead pull a Siege Walker into the soil while far above the sky closes." }
    },

    // ---------------------------------------------------------------- VEX
    vex: {
      1: { zone: 'yard', goal: "Hold your yard against Halcyon",
        card: "Vex's yard is smaller than Ferra's, newer, and paid for with a loan from Vesna. Halcyon wants the yard, the scrap and the boy with the magnets.",
        intro: [
          ['sys', "The yard across the tunnel from Ferra's. Smaller. Neater. Vex's. Bought with Vesna's money, and every brick still owes her."],
          ['hero', "Pull and push. One force, pointed two ways. Ferra never saw it. That's why I've got a yard of my own."],
          ['agent', "Magnet boy. The Director wants that trick on file. Take him and inventory the scrap."],
          ['hero', "Opposites attract. Come closer. ...Closer. Now go away."]],
        win: [
          ['hero', "Repel, Attract, Flux Flip. That's the whole lesson. No charge."],
          ['citizen', "Vex! Vesna's runner is at the gate. Says the interest is due today. Says she's smiling."],
          ['hero', "...Charge pending."]] },
      2: { zone: 'docks', with: 'mako', goal: "Hold Dockside Nine with Mako",
        card: "Mako's suit pulls left, so Vex, who kept only one friend from the Yard, tunes its magnets out on Dockside Nine. Halcyon picks that moment to come down the dock.",
        meet: [
          ['mako', "Vex. Suit pulls left. Magnets."],
          ['hero', "Your magnets always pull left. You build too fast. Hold still, let me feel the field."],
          ['mako', "You talk too much. About polarity."],
          ['hero', "You're the only one from the Yard I kept. I talk about polarity because you let me."],
          ['mako', "Halcyon. On the dock."],
          ['hero', "Perfect timing. Field test."]],
        win: [
          ['mako', "Pulls straight now. Thanks."],
          ['hero', "Ferra built most of that suit. I just made it behave. Don't tell her the first part."],
          ['mako', "I'll tell her both parts."]] },
      3: { zone: 'yard', rival: 'ferra', goal: "Duel Ferra in the Crusher Yard",
        card: "Vex walks back into Ferra's Crusher Yard to show his old teacher he was right about magnets, and learns she has been watching his fights.",
        meet: [
          ['ferra', "Vex. Walking back into my Yard. Bold, for a boy who still owes Vesna the walls he sleeps in."],
          ['hero', "I came to show you. Pull and push are one thing. I built a whole yard proving it."],
          ['ferra', "Your Flux Flip leaves your left side open for half a breath. Every time."],
          ['hero', "...You watch my fights? Then watch this one. Up close."]],
        win: [
          ['ferra', "...All right. One force, two ways. You might be right. Might."],
          ['hero', "Say that again. Slower."],
          ['ferra', "Never. You fought well. Come to dinner some day."],
          ['hero', "...Maybe. If you cook on my side of the tunnel."]],
        lose: [
          ['ferra', "All push, no pull. Still. Again, apprentice."]] },
      4: { zone: 'pit', goal: "Tear apart the drills in the Pit",
        intro: [
          ['sys', "The Three-Layer War. On every screen, Kael vents the Sump onto the Sky's labs and Nyra walks the drills into Deepline. Each side blames the other."],
          ['sys', "Vex doesn't care whose face it was. Halcyon's drills are in the Pit Arena, and Vesna is at his gate with the Red Ledger open."],
          ['vesna', "Vex, darling. Tonight I collect Halcyon's page, the longest in the book. And yours is the size of a yard."],
          ['hero', "I don't have it. You know I don't have it."],
          ['vesna', "Then pay me in iron. Every drill in that Pit, in pieces. We'll discuss interest afterwards."]],
        win: [
          ['sys', "Halcyon's drills fly apart in the Pit. Their steel comes to Vex's hands like dogs called home, and stays."],
          ['hero', "That's the yard paid off. Interest and all."],
          ['vesna', "Not in full. But a very good month. And Pell has named the face-thief, darling: Rue. The Crater watched her run."],
          ['sys', "Four banners climb the Halcyon Spire toward the Engine Core. Vex goes up with a drill bit over each shoulder."],
          ['hero', "Up the Spire with you. Does that come with a discount?"],
          ['vesna', "No."]],
        card: "Two stolen faces have set the layers at war, and tonight Vesna opens the Red Ledger to call in every debt. Vex owes her a whole yard." },
      5: { zone: 'rootways', foe: 'hex', goal: "Push back a curse that hits twice",
        intro: [
          ['sys', "A crown-ship fills the sky. A ghost-girl of Vael's walks into the Roots, and the dead start climbing toward the Yards."],
          ['ferra', "Vex. I need your half."],
          ['hero', "You're asking? Out loud? Fine. Pull and push. Together."]],
        meet: [
          ['hex', "Magnet boy. What you push comes back once. What I curse comes back twice."],
          ['hero', "Then I push twice, and pull twice. My yard's up there. Nothing dead walks into it."],
          ['hex', "Show me."]],
        win: [
          ['sys', "Vex pulls every curse onto the iron and flings it away twice. Ferra holds the cage shut."],
          ['hex', "Twice, and twice back. That isn't fair. I'm telling him."],
          ['sys', "Hex drifts out through the bars and away to the crown-ship. Thorne tucks his dead back in."],
          ['ferra', "Good work. Both halves."],
          ['hero', "...Both halves. Yeah."]],
        lose: [
          ['hex', "Pushed once. Cursed twice. Up, magnet boy."]],
        card: "Vael's champion Hex wakes the dead under the Yards; for once Vex and Ferra fight as one force, pull and push, and Hex flees to the crown-ship." },
      6: { goal: "Hold both yards to the end",
        intro: [
          ['sys', "Vex's yard, across the tunnel from Ferra's. Far above, the Crater's sky burns. Here the Legion makes its last push."],
          ['hero', "Ferra's up on the rim, so her yard's mine to hold too. She'll hate that. Good."]],
        meet: [
          ['sys', "A Siege Walker smashes through the tunnel wall between the two yards, a Legion captain on its back. It is iron, head to heel."],
          ['hero', "All iron? Oh, you shouldn't have."]],
        win: [
          ['sys', "Pull and push. Vex drags the walker in, flings it out, drags it in again, and folds it in half. Its captain falls out."],
          ['sys', "Then every scrap of iron in the yard rings at once, from far away. The Legion stops, and is drawn up the shafts like smoke."],
          ['hero', "The Crown. Something that big falls, and iron hears it for miles."],
          ['sys', "Next morning, Ferra comes back down the tunnel to find both yards standing, and her own piles neatly sorted."],
          ['ferra', "You sorted my piles."],
          ['hero', "Both halves, teacher. Don't tell anybody."],
          ['hero', "Iron always comes home."]],
        card: "Vex holds his yard and Ferra's through the Legion's last push and folds a Siege Walker in half, while far away the Crown falls and every scrap of iron rings." }
    },

    // ---------------------------------------------------------------- VESNA
    vesna: {
      1: { zone: 'market', goal: "Beat Halcyon's crew in the Red Quarter",
        card: "Vesna keeps the Red Ledger, the book of every debt underground. Halcyon wants it, because each of those names is a handle to pull, and it has sent collectors.",
        intro: [
          ['sys', "The Neon Market's Red Quarter. Pink light on wet tiles, and every debt in Deepline written in one red book."],
          ['hero', "Everything has a price. Nobody in Deepline has ever paid me late twice."],
          ['agent', "The bookkeeper. Director's instruction: acquire the Ledger. Every name in it is a lever."],
          ['hero', "You want my book? How sweet. Let me open a fresh page for you. Name first, then the amount."]],
        win: [
          ['hero', "Collected. In red. I'll bill your Director for the stains."],
          ['hero', "Halcyon's page grows longer every week. One day I call in all of it, with interest."]] },
      2: { zone: 'rootways', with: 'thorne', goal: "Defend Sunday tea with Thorne",
        card: "Every Sunday Vesna brings the cups down to the catacombs and Thorne, their keeper, brings the tea. This Sunday Halcyon comes down the stair after the Ledger, and tea will have to wait.",
        meet: [
          ['hero', "Thorne. Sunday. Cups, as agreed."],
          ['thorne', "And the tea, as agreed. You look tired, my dear. Is the Ledger heavy today?"],
          ['hero', "Halcyon's page is the longest in the book. I'd like it closed before somebody closes mine."],
          ['thorne', "The dead keep their own accounts. Allow me to help with the living. Ah. Guests."],
          ['agent', "Ledger woman and grave man, co-located. Take the book. Take the bones. Take the cups if they resist."],
          ['hero', "Interrupting tea. That's a surcharge."]],
        win: [
          ['thorne', "Your tea has gone cold. And in all these years you have never once charged me for it."],
          ['hero', "Nor will I. Tell no one, darling. I have a reputation."],
          ['thorne', "Who would I tell? My guests are very discreet."]] },
      3: { zone: 'market', rival: 'maren', goal: "Duel Maren in the Red Quarter",
        card: "Maren, the harbour doctor, has seen what Vesna charges in blood, and has come to the Red Quarter to close the account. Vesna has never lost an argument about money.",
        meet: [
          ['maren', "Vesna. I've read your bills. The ones paid in blood. You call that bookkeeping?"],
          ['hero', "Doctor. You give blood away for free. Do you know what that does to a market?"],
          ['maren', "It keeps people alive. What you do is a sickness, and I've come to treat it."],
          ['hero', "It's a ledger, Doctor. And you're on the wrong page of it."]],
        win: [
          ['maren', "...You heal from every cut you make. That isn't a ledger. It's a wound that pays itself."],
          ['hero', "Clever. I'll write that down."],
          ['maren', "Give me your arm. I'm patching it. Free of charge. Don't argue."],
          ['hero', "...Just this once. And I'm writing that down too."]],
        lose: [
          ['maren', "Sit. Breathe. Your pulse is racing. Try me again when it's steady."]] },
      4: { zone: 'pit', goal: "Hold the Pit while the Ledger collects",
        intro: [
          ['sys', "The night of the Strings Cut. Every screen plays two films: Deepline's Kael gassing the Sky's labs, the Sky's Nyra walking drills into Deepline."],
          ['sys', "Each layer blames the other, and arms itself. Only one woman in Deepline has read the receipts."],
          ['hero', "The Sky didn't send these drills. Halcyon did, and paid for them with Deepline's own money."],
          ['hero', "Their page runs longer than any other. Tonight I open it, and call in every debt at once."],
          ['vex', "Every debt? Even mine?"],
          ['hero', "Especially yours, darling. You may pay in iron. Now."]],
        win: [
          ['sys', "Vesna reads Halcyon's page aloud in the Pit, line by line, and every debtor in Deepline stands up to answer it."],
          ['hero', "Every drill, every crew, every stolen hour. Collected, in full and in red."],
          ['sys', "Snared by the Lantern Cell in his own Cradle, Pell pays his share in a name: Rue. She wore both faces, on the Director's coin."],
          ['sys', "Kiri's crane takes the name to the Crater. The Sky and the Surface have risen too. Hollis raises a fourth banner, and four climb the Spire."],
          ['hero', "Halcyon's page, closed. The interest I collect from the Director, at the Engine Core, in person. And from whatever his Engine has been calling."]],
        card: "The screens swear a Sky singer led Halcyon's drills into Deepline and a Deepline boy gassed the Sky's labs. Vesna has read the real receipts. Tonight, in the Pit, she opens the Red Ledger at Halcyon's page." },
      5: { zone: 'rootways', foe: 'hex', goal: "Make the ghost pay up",
        intro: [
          ['sys', "A crown-ship blots out the sky. One of Vael's champions walks into the Roots and wakes Thorne's dead on a Sunday."],
          ['thorne', "Vesna. Someone is waking my guests. I could use help with the accounts."],
          ['hero', "For you? No charge. There never was one."]],
        meet: [
          ['hex', "Bookkeeper. Every cut I make bleeds twice. Can you afford that?"],
          ['hero', "My blood heals me for every hit. Bleed me twice, darling, and I collect twice."],
          ['hex', "Then let's see who runs dry first."],
          ['hero', "And you walked into Thorne's garden on a Sunday. That's a debt all by itself."]],
        win: [
          ['sys', "Blood against ghost. Red Rain falls on the Roots, warm and heavy, and Hex slows at last."],
          ['hex', "You took it all back. Twice. ...I want to go home to him."],
          ['sys', "Hex drifts up out of the Roots toward the crown-ship. Thorne tucks his dead back in."],
          ['hero', "Run along. I've opened a page for your Sovereign. Thorne, the tea's on me. As it always is."]],
        lose: [
          ['hex', "Bled twice. Paid nothing. Your book's in the red, bookkeeper."]],
        card: "Vael's champion Hex wakes Thorne's dead on a Sunday; Vesna bleeds twice, collects twice, and sends Hex fleeing to the crown-ship." },
      6: { goal: "Hold the Red Quarter to the end",
        intro: [
          ['sys', "The Neon Market's Red Quarter. The Crater's sky burns far away, and the Legion's last push comes for the Market."],
          ['hero', "Thousands of them, darling, and not one has paid at the door."]],
        meet: [
          ['sys', "A Siege Walker stamps into the Red Quarter, a Legion captain on its back, crushing stalls like eggshells."],
          ['hero', "Every stall you step on goes on your account. I hope you brought money."]],
        win: [
          ['sys', "Red Rain falls on the Red Quarter. The walker kneels, its captain comes down, and Vesna has not spilled a drop of her own."],
          ['sys', "Then the neon flickers, and every Legion soldier in the Market goes still and drifts away like smoke."],
          ['hero', "So the Crown has fallen. Well. I did tell your Sovereign I'd opened a page."],
          ['sys', "Next morning, Vesna opens the Red Ledger at the Legion's page and draws one long red line through all of it."],
          ['hero', "Some debts you collect. Some you forgive. ...Thorne's tea is still on me. That account never closes."],
          ['hero', "Paid in full."]],
        card: "Vesna holds the Red Quarter through the Legion's last push and brings a Siege Walker to its knees in red rain, while far away the sky over the Crater closes." }
    },

    // ---------------------------------------------------------------- FUMI
    fumi: {
      1: { zone: 'waterworks', goal: "Hold the boilers against Halcyon",
        card: "Fumi runs the boilers over the Sump, and half of Deepline sleeps warm because of them. For a year someone under the floor has tapped on his pipes, and he has tapped back. Halcyon has noticed.",
        intro: [
          ['sys', "The Waterworks, above the Core Sump. Boilers the size of houses, sweating gauges, and one man who keeps half of Deepline from freezing."],
          ['hero', "Pressure's good. Pumps good. The tapping's... still there. Under the floor. Every night."],
          ['agent', "Boilerman. Logs show unauthorised contact with Subject Sixty through the pipes. Hands off the iron. You're reassigned."],
          ['hero', "I keep it in. Mostly."]],
        win: [
          ['hero', "...Mostly."],
          ['sys', "When the steam thins, Fumi kneels by the main pipe and taps three times. Three taps come back up, slower, and hot."],
          ['hero', "A year I've let them cook you down there. A YEAR. ...Hold on. I'm coming down."]] },
      2: { zone: 'core', with: 'ashka', goal: "Hold the Core Sump beside Ashka",
        card: "Fumi has found the hatch at last. He takes the long ladder down to meet the woman whose pain has kept his pipes warm, and the wardens follow him down.",
        meet: [
          ['sys', "Down the boiler shaft, rung after rung, into heat that bites. At the bottom of everything, a woman in a red-hot chain looks up."],
          ['ashka', "...The tapping. So the boiler man has a face."],
          ['hero', "Fumi. Heard you every night. The heat in my pipes was you hurting. Couldn't stand it."],
          ['ashka', "Ashka. Not Sixty. Say it out loud. I want to hear it in a voice."],
          ['hero', "Ashka. ...Wardens on the stairs. Stay back. I'm building pressure."]],
        win: [
          ['ashka', "You came down. Nobody comes down."],
          ['hero', "Next time I bring enough pressure to put that door through the ceiling. Partners?"],
          ['ashka', "I burn. You boil. Partners."]] },
      3: { zone: 'waterworks', rival: 'mako', goal: "Duel Mako to test his boiler",
        card: "Mako's suit boiler is running hot again. Fumi has stopped it cooking him twice, and Mako wants it hit at full pressure until something gives, here, before Halcyon does it for him.",
        meet: [
          ['mako', "FUMI. Suit boiler's at one-ten and climbing. Dyna wants a full pressure test. You're the gauge man."],
          ['hero', "Full pressure. On a suit. With you inside it."],
          ['mako', "You've stopped it cooking me twice. Hit it till something pops. Better here than in front of Halcyon."],
          ['hero', "...Fine. Brace. Relief lines open."]],
        win: [
          ['sys', "The suit's boiler blows a valve with a shriek like a kettle the size of a train. The suit stays standing."],
          ['mako', "STILL UP. Readings?"],
          ['hero', "Readings fine. Three new valves. Takes more than me to pop it now."],
          ['mako', "Good. ...Thanks, Fumi. Really."]],
        lose: [
          ['mako', "Suit's fine. You're the one venting. Again?"]] },
      4: { zone: 'core', goal: "Hold the Sump while pressure builds",
        intro: [
          ['sys', "The night of the Strings Cut. Halcyon's drills are in Deepline's walls, and every screen plays the same two films."],
          ['sys', "Kael, a Yard kid, opening the Sump's vents on the Sky's labs. Nyra, a Sky singer, waving the drills down. Each layer swears the other struck first."],
          ['hero', "Ashka saw that boy at her vents. Didn't sweat. Two films, two lies. One liar."],
          ['dyna', "Doesn't matter tonight. How much pressure you got, boiler man?"],
          ['hero', "A year. One night for every night I didn't come down. ...OPEN EVERY VALVE. ALL OF THEM. NOW."]],
        win: [
          ['sys', "Every valve in the Waterworks screams down one pipe at once. Dyna lights the fuse. The Sump's door stops existing."],
          ['ashka', "...Fumi. I'm out."],
          ['hero', "You're out. I'm... going to sit down a minute."],
          ['sys', "Not for long. In the Pit, Pell hangs in his own strings and names the face-thief: Rue. The Director paid for both films."],
          ['sys', "The Noble Ring has turned and Oda's bell has rung three times. Hollis raises a fourth banner, and four climb the Spire for the Engine Core."],
          ['hero', "That Engine's been drawing heat for years. Something on the far end's drawing too. Up. I'm bringing a gauge."]],
        card: "On every screen a Deepline boy gasses the Sky's labs and a Sky girl leads Halcyon's drills into Deepline. Fumi doesn't care whose face it was. He has a year of pressure saved, and a door to spend it on." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Hold the pumps against Slick",
        intro: [
          ['sys', "A crown-ship blots out the sky. One of Vael's champions slides into the Waterworks, and the Drowned Line begins to rise."],
          ['hero', "Pumps at full. Not enough. If the water reaches the boilers, Deepline freezes tonight. Hold, everybody."]],
        meet: [
          ['slick', "Hello! Warm pipes! I like warm pipes. Your pumps push me back, so I push harder!"],
          ['hero', "Those boilers keep half of Deepline from freezing. Ashka bled a year for that heat. Not you. Not today."],
          ['slick', "Squish!"]],
        win: [
          ['sys', "Steam against flood. The pumps shriek, and hold. Nami drives the Line back down from below."],
          ['slick', "Too hot! Too hot! Ow! He said this one was easy!"],
          ['sys', "Slick slides up the shafts in a hiss of steam, back to the crown-ship. The Drowned Line goes still."],
          ['hero', "...I kept it in. Mostly."]],
        lose: [
          ['slick', "Pressure? I haven't got any. I just keep coming."]],
        card: "Vael's champion Slick floods the Waterworks to drown the boilers; Fumi's pumps shriek and hold, and Slick flees to the crown-ship in a hiss of steam." },
      6: { goal: "Keep the boilers lit to the end",
        intro: [
          ['sys', "The Waterworks. The Crater's sky burns far above, and the Legion makes one last push for the boilers."],
          ['hero', "Break the boilers and Deepline freezes tonight. Nobody freezes. And nobody burns for the heat. Not ever again."],
          ['citizen', "Fumi! The pressure's past the red line!"],
          ['hero', "Good. Keep it there."]],
        meet: [
          ['sys', "A Siege Walker crashes in through the pump-house wall, a Legion captain on its back, and plants its feet on the boilers."],
          ['hero', "...Off my boilers."]],
        win: [
          ['sys', "Every valve opens at once. A pillar of steam lifts the Siege Walker off the boilers, and its captain rides it up."],
          ['sys', "Then the pipes ring, all at once, from far away. The Legion goes still and is drawn up the shafts like smoke."],
          ['hero', "That wasn't tapping. Something big just fell on the world."],
          ['sys', "Next morning, Fumi turns the boilers down a notch. Somewhere down the pipes, three taps. He taps back."],
          ['hero', "Nobody pays for the heat now. Only me and the pumps. ...Might take a day off. Mostly."],
          ['hero', "You pushed. I popped."]],
        card: "Fumi keeps the boilers lit through the Legion's last push and opens every valve to lift a Siege Walker off them, while far away the Crown falls." }
    },

    // ---------------------------------------------------------------- MAKO
    mako: {
      1: { zone: 'docks', goal: "Hold Dockside Nine in the suit",
        card: "Mako was crushed under a crate at Dockside Nine once and promised himself never again. He built armour and never stopped adding to it, and now Halcyon wants it, with him inside.",
        intro: [
          ['sys', "Dockside Nine. Years ago a crate came down on a dock hand called Mako, and he made himself one promise: never again."],
          ['hero', "So I built a suit. Then kept building. ...New plating this week. Do you, um. Do you like it?"],
          ['agent', "That suit is Halcyon property as of tonight. Peel it. Bring the pilot in one piece, if convenient."],
          ['hero', "Out of the suit, I'm gentle. In it... PLATING SEALED. ARM CANNON HOT. Step back, please."]],
        win: [
          ['hero', "PLATING AT SIXTY PERCENT. REGROWING. ...Good."],
          ['citizen', "Mako! The crates! The whole stack's coming down!"],
          ['hero', "Got it. Not this time, crate."]] },
      2: { zone: 'yard', with: 'dyna', goal: "Hold the Crusher Yard with Dyna",
        card: "Halcyon has dented the plating, cooked the boiler and bent the magnets. Everyone who keeps Mako's suit alive meets in the Crusher Yard to fix it, and Halcyon follows them in.",
        meet: [
          ['dyna', "Mako. You look like a crate fell on you. Again. ...Too soon? Too soon."],
          ['hero', "Halcyon tested it. PLATING DENTED. BOILER AT ONE-THIRTY. MAGNETS PULLING LEFT. ...Sorry. It's loud when it's scared."],
          ['ferra', "Scrap for the plating. Family discount. Don't make that face. I'm protecting my stock, not you."],
          ['vex', "Magnets. Fair warning, I'll be explaining polarity the whole time. To you, to her, to the wall."],
          ['fumi', "Boiler. Third time I've stopped it cooking you. Stop letting it."],
          ['hero', "Everybody who keeps the suit alive, in one yard. And... Halcyon's at the gate. Of course."]],
        win: [
          ['dyna', "Suit's better than new. Can I ride up top now?"],
          ['hero', "Only you. Always only you."],
          ['hero', "Thanks. All of you. Every plate on this thing is somebody's hands."]] },
      3: { zone: 'works', rival: 'dyna', goal: "Duel Dyna in her blast test",
        card: "Dyna has built the biggest bombs of her life for one blast test. If Mako's suit survives these, it survives anything, and she has decided it's more fun if he fights back.",
        meet: [
          ['dyna', "Blast test, big man. Biggest bombs I've ever built. If the suit holds this, it holds anything."],
          ['hero', "And if it doesn't hold?"],
          ['dyna', "Then I build you a better one, and I feel really bad for a minute. Hold still. No, fight back. It's prettier when you fight back."],
          ['hero', "...Okay. TARGETING. Fighting back."]],
        win: [
          ['dyna', "It held! Every single one! Look at that plating, all scorched and gorgeous!"],
          ['hero', "I'm a little dizzy."],
          ['dyna', "Dizzy's fine. Dizzy means alive. I'm writing 'dizzy' on the chart."]],
        lose: [
          ['dyna', "Kaboom. Suit's smoking, big man. Patch it and go again?"]] },
      4: { zone: 'pit', goal: "Smash Halcyon's crews in the Pit",
        intro: [
          ['sys', "The night of the Strings Cut. Halcyon's drills are in Deepline, and the screens say a Sky singer called Nyra led them in."],
          ['sys', "Up in Aurelia the screens say Kael, a Yard kid, gassed the Sky's labs. Each layer blames the other. The Director planned it so."],
          ['hero', "A Sky girl out in front of Halcyon's drills? Ferra says it's wrong. I trust Ferra. Ferra's never wrong about junk."],
          ['dyna', "Doesn't matter whose face. Drills are real. Walk, big man. I've got the ammo."],
          ['hero', "WALKING."]],
        win: [
          ['sys', "A walking tank crosses the Pit with Dyna on its shoulders, and Halcyon's crews break on it like surf on a pier."],
          ['hero', "FULL BARRAGE. Last shell was the size of a car. ...That felt good. Is that bad?"],
          ['dyna', "That was MY shell. And no. Mako, listen: Pell's caught in his own Cradle. He named the face-thief. Rue. Both films were her."],
          ['sys', "Kiri's crane takes the name to the Crater. The Sky and the Surface rose tonight too, and four banners start up the Spire toward the Engine Core."],
          ['dyna', "Something up there hums wrong, big man. Like a fuse nobody lit. Walk."]],
        card: "Every screen blames a Sky singer for Halcyon's drills or a Deepline kid for the Sky's gassed labs. Deepline marches on the Pit Arena, and Mako walks at the front with Dyna on his shoulders." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Wade the suit into the flood",
        intro: [
          ['sys', "A crown-ship blots out the sky. A grinning man of slime slides into the Waterworks for Vael, and the flood begins."],
          ['fumi', "Mako, the water's over the boilers. If it gets in the suit's boiler..."],
          ['hero', "Then you'll fix it. I'm wading in."]],
        meet: [
          ['slick', "Big suit. Heavy suit. Suits sink."],
          ['hero', "This one's built to stand in anything. Every friend I have put a piece in it. You're flooding their shop."],
          ['slick', "Everybody comes. Everybody goes under. He promised."]],
        win: [
          ['sys', "The suit stands in the flood like a pier piling, and Slick breaks on it again and again."],
          ['hero', "Arm Cannon. Full Barrage. Go home."],
          ['sys', "Slick splashes apart and slides up the shafts, back to the crown-ship. The water begins to fall."],
          ['dyna', "Mako! Suit okay? You okay?"],
          ['hero', "Wet. Standing. Good."]],
        lose: [
          ['slick', "Glub. Glub. Suits sink. Again?"]],
        card: "Vael's champion Slick floods the Waterworks; Mako stands in it like a pier, and Slick breaks against the suit until he flees to the crown-ship." },
      6: { goal: "Stand on the dock to the end",
        intro: [
          ['sys', "Dockside Nine. The Crater's sky burns far away, and the Legion's last push comes marching down the piers."],
          ['bando', "Big man! Left pier's yours, right pier's mine, and the middle is the kids'."],
          ['hero', "Nobody gets crushed today. Not under a crate. Not under anything."]],
        meet: [
          ['sys', "A Siege Walker hauls itself out of the Drowned Line onto the dock, a Legion captain on its back. It dwarfs the suit."],
          ['hero', "Bigger than me. ...That's fine. I built for bigger."]],
        win: [
          ['sys', "The walker brings its whole foot down on the suit. The suit holds. Arm Cannon, Full Barrage, and the captain is swimming."],
          ['sys', "Then the whole dock shudders once. The Legion stops where it stands and is drawn up the shafts like smoke."],
          ['bando', "Feel that? That's the Crater. Somebody up there just won it."],
          ['hero', "Good. Suit's dented. I'll fix it."],
          ['sys', "Next morning, Mako sits outside the suit for once, in the light from a shaft, a kid asleep on the warm plating."],
          ['hero', "Out of the suit, I'm gentle. Might stay out a while."],
          ['hero', "Built to last."]],
        card: "Mako stands on Dockside Nine through the Legion's last push and takes a whole Siege Walker's weight on the suit, while far away the Crown falls." }
    },

    // ---------------------------------------------------------------- NAMI
    nami: {
      1: { zone: 'choir', goal: "Hold the Drowned Line against Halcyon",
        card: "The sea took Nami once in the flooded tunnels at the bottom of Deepline, and gave her back with its cold still in her. The Director wants to know how, and has sent men into her water to find out.",
        intro: [
          ['sys', "The Drowned Line. Sunken platforms, a dead train under black water, and fins turning slow circles beneath the surface."],
          ['hero', "Grey and cold, I know. The Line's still in me. It's quieter than it looks."],
          ['agent', "Subject candidate: the drowned woman. Submerged eleven minutes, still ambulatory. The Director wants the mechanism."],
          ['hero', "Come into the water. I'll show you the mechanism."]],
        win: [
          ['hero', "The sea taught me its teeth, down in the dark. First it taught me to wait."],
          ['sys', "Fumi's pumps thump somewhere overhead like a slow heart. The fins sink. The water lies flat."],
          ['hero', "Stay. Nobody else goes under while I'm watching."]] },
      2: { zone: 'waterworks', with: 'maren', goal: "Guard Maren at the Waterworks",
        card: "Maren, the harbour doctor who fought the sea for a whole night to get Nami back, has been let down to check Deepline's water. Halcyon has followed her, and Nami stands guard.",
        meet: [
          ['maren', "Nami. They've let me down to check the water lines. Two hours, they said. I promised I'd be quick."],
          ['hero', "You're never quick. You stop for every cough."],
          ['maren', "I argued with the sea a whole night for you. Let me argue with a few coughs. ...Pulse is good. Breathe for me."],
          ['fumi', "Pumps are up. Halcyon followed the doctor down. Six of them. In the tunnel."],
          ['hero', "Then they're in my water. Stay behind me, doctor."]],
        win: [
          ['maren', "You came back from the sea colder. And kinder. I never wrote that down, but it's true."],
          ['hero', "You gave me back. I keep you safe. That's the deal."],
          ['maren', "There's no deal, Nami. There never was. ...But thank you."]] },
      3: { zone: 'choir', rival: 'fumi', goal: "Duel Fumi on the Drowned Line",
        meet: [
          ['sys', "The Drowned Line. Fumi's pumps run flat out, and the water is falling. Old platforms surface, furred with rust."],
          ['hero', "Fumi. You're draining my Line. The docks float on it. The Ashfall dead sleep under it. Stop."],
          ['fumi', "Halcyon wants it. Coolant for their Engine. I don't pump, they shut my boilers. Deepline freezes."],
          ['hero', "Then Halcyon gets neither. Touch those valves again and you go in the water."],
          ['fumi', "Can't stop now, Nami. ...I'm sorry. I'm so SORRY, all right?"]],
        win: [
          ['fumi', "...You're stronger than my pumps. Always were."],
          ['hero', "And you're kinder than Halcyon. That's why they picked you. Tell them no. We keep the boilers lit together."],
          ['fumi', "Pumps and patience. Like always."],
          ['hero', "Like always. Now turn them round."]],
        lose: [
          ['fumi', "Sorry. Sorry. Pressure's too high to stop. Again?"]],
        card: "Fumi's pumps are draining the Drowned Line for the first time in years. Halcyon wants the water to cool its Engine, and Nami has to fight her friend to keep it where it belongs." },
      4: { zone: 'choir', goal: "Fight the drill crews as the Line rises",
        intro: [
          ['sys', "The night of the Strings Cut. Every screen in Deepline shows the Sky's Nyra waving Halcyon's drills into the Drowned Line."],
          ['sys', "Every screen in the Sky shows Deepline's Kael gassing its labs. Each layer blames the other, and the Director smiles at both."],
          ['hero', "Nyra? Maren kept that girl alive in a Halcyon tank. She'd never lead drills into anyone's home."],
          ['fumi', "Drills are drinking the Line, Nami. Halcyon's coolant after all. Run the pumps backwards and the whole Line comes up."],
          ['hero', "Then run them backwards. The Line has waited a long time to stand up."]],
        win: [
          ['sys', "The Drowned Line rises out of the dark, thick with turning fins, and closes over Halcyon's drills. They do not come back up."],
          ['hero', "The sea gave me back. It doesn't give drills back."],
          ['sys', "In the Pit, Pell hangs in his own Cradle and names his faceless spy: Rue. She wore both faces. The war was a puppet show."],
          ['sys', "Kiri's crane flies the name to the Crater. Above and below, the other layers rose tonight too. Four banners start up the Spire."],
          ['hero', "Something at the Engine Core pulls, like a tide with no moon. We go up. I go dripping."]],
        card: "Halcyon's drills are boring through Nami's water, and every screen says the Sky's Nyra led them. Nyra was Maren's patient, kept in a tank. Nami doesn't believe a word of it." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Keep the Drowned Line down",
        intro: [
          ['sys', "A crown-ship blots out the sky. Vael sends a champion into the Waterworks, and the Drowned Line starts to climb."],
          ['fumi', "Nami! Something made of slime is in my pumps. Violet eyes. And it's grinning."],
          ['hero', "The Line stays where it is. I promised it."]],
        meet: [
          ['slick', "Hello! You stepped in me! Everybody steps in me. And you didn't even say sorry."],
          ['hero', "I'm not sorry. You're drowning my Line, and everyone who lives along it."],
          ['slick', "He says everybody goes under. So I'm making everything one big puddle!"],
          ['hero', "I went under once. The sea gave me back. It won't give you anything."]],
        win: [
          ['sys', "The Drowned Line answers Nami, not Slick. Riptide drags him off the pumps, and Bubble Jail holds him."],
          ['slick', "Cold! Too cold! Not fair! I'm telling!"],
          ['sys', "Slick oozes out of the bubble and up the shafts, back to the crown-ship. The water goes down."],
          ['hero', "Fumi. Your boilers are dry. The Line is mine again."]],
        lose: [
          ['slick', "Squish! Down you go. Again, Nami?"]],
        card: "Vael's champion Slick floods the Waterworks to drown the people of the Line; the water answers Nami instead, and Slick flees to the crown-ship." },
      6: { goal: "Bring the deep water up",
        intro: [
          ['sys', "The Crater. The three layers line the rim, and the Hollow Legion pours down out of the crown-ship like a burst dam."],
          ['maren', "I'm not coming up with you this time. Come back down the same colour you went up."],
          ['hero', "Grey, then. Always grey. Guard the wards for me, doctor. It's my turn to go first."],
          ['kael', "Nami! Brakk's breaking a road through the Legion. Six of us go up, and you're the water."],
          ['hero', "I'm coming. The deep goes where it's needed."]],
        meet: [
          ['sys', "At the foot of the Crown, Itsuki waits on the path. Five elements wheel around him. Water is one of them."],
          ['itsuki', "Water. I learned it on a world that drowned. You drowned too. We are the same."],
          ['hero', "The sea took me and gave me back. It never gave you back. That's the difference."],
          ['itsuki', "Then show me what it gave you."]],
        lose: [
          ['itsuki', "Water waits. So do I. Again."]],
        win: [
          ['sys', "Itsuki gives ground against the Crown, and the six go past him. Inside, the Convergence and Vael wait side by side."],
          ['vael', "The drowned one. I have drunk nine seas dry, little ghost. Kneel, and be the water in my cup."],
          ['hero', "I'm nobody's cup. Now, all of you. Together."],
          ['sys', "Brakk's earth, Pyra's fire, Gale's wind, Kael's thunder, Nyra's song and the Abyss Tide hit as one. The crown-ship breaks."],
          ['sys', "It falls into the Crater, and the door to the Beyond drags the Legion and every champion back through. Itsuki goes last."],
          ['sys', "The morning after. Nami sits on the pump-house steps, her feet in the Drowned Line."],
          ['hero', "Maren says I'm still grey. Fumi says the pumps can rest. The Line is quiet. I think I'll let it stay quiet a while."],
          ['hero', "Sink to the abyss."]],
        card: "Nami climbs into the Crown with Kael, Nyra, Pyra, Gale and Brakk, gets past Itsuki, and the deep water joins the single strike of all six on Vael." }
    }
  });
})();
