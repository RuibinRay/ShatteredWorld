'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the spoken lines of every chapter for the heroes of Deepline, the Underground.
// Data only; js/saga/saga-core.js plays it. Speakers: 'hero' (the hero being played), 'sys' (narration), a hero id,
// or 'director', 'kessen', 'vael', 'agent', 'citizen'.
(function () {
  const SW = window.SW; if (!SW.saga || !SW.saga.add) return;
  SW.saga.add({

    // ---------------------------------------------------------------- KAEL
    kael: {
      1: { zone: 'yard', goal: "Climb out of the Crusher Yard",
        card: "The air over the Crusher Yard splits like wet canvas, a boy falls out of a thunderstorm, and Ferra decides he is worth salvaging.",
        intro: [
          ['sys', "The Crusher Yard. The air over the trash heap splits like wet canvas, and a boy falls out of a thunderstorm."],
          ['hero', "Vharra. Thunderheads. The storm clans. I know exactly where I'm from, and it never smelled like this."],
          ['ferra', "You. Under the car door. Breathing, or salvage?"],
          ['hero', "Breathing. Name's Kael. And I'm nobody's salvage."],
          ['agent', "Collection order. Something charged has landed in the Yard. Bag it, tag it, number it, send it up."],
          ['hero', "Number me? Start by counting the sparks."]],
        win: [
          ['ferra', "Lightning out of a scrap kid. I'm keeping you. Salvage rights."],
          ['citizen', "Look at his hands, they're crackling! Sparks! The new kid's called Sparks!"],
          ['hero', "It's Kael. ...Fine. Sparks. Don't wear it out."],
          ['hero', "Halcyon wants the storm in a jar. Let them find out what thunder does to glass."]] },
      2: { zone: 'slums', with: 'fenn', goal: "Hold the Slums with Fenn and Rook",
        card: "Kael carved Vharra's storm-eye into Deepline tin so he would not forget which sky dropped him; a hunter from the steppe reads it and becomes his brother.",
        meet: [
          ['fenn', "That storm-eye scratched on your jacket. Who carved Vharra's mark into Deepline tin?"],
          ['hero', "Me. So I never forget which sky dropped me. You're from the steppe too?"],
          ['fenn', "Hunting clans. My wolf ran at the tear when it took me. You're storm-clan, kid, and you're down here alone."],
          ['rook', "He is NOT alone. Rook. His brother. We've done a whole week of brothering."],
          ['fenn', "Then I'm the big brother, and nobody gets a vote. Collectors on the stairs. Show me your thunder."],
          ['hero', "Front row, wolf man. Rook, clones out!"]],
        win: [
          ['fenn', "Wild and loud. You throw lightning like it owes you money. We'll work on that."],
          ['rook', "Don't work on him too much. Loud is our whole plan."],
          ['hero', "One week, two brothers. Deepline's better than it smells."]] },
      3: { zone: 'crater', rival: 'nyra', goal: "Duel Nyra at the Crater",
        card: "Halcyon tells Kael that a Subject named Nyra sold out the tunnels, and under a bruised violet sky he meets a girl who was told the same of him.",
        meet: [
          ['sys', "The Crater, under a bruised violet sky. Halcyon says an escaped Subject called Nyra sold out the tunnels."],
          ['hero', "Nyra. They say you sold Halcyon every hideout in Deepline, one door at a time."],
          ['nyra', "And they showed me you, opening the Sump's vents on the labs. People choked in those labs."],
          ['hero', "I've never been near those vents! Somebody's lying, and it isn't me."],
          ['nyra', "Then fight louder than I sing, Deepline. Prove it."]],
        win: [
          ['nyra', "Stop. You fight like someone who never learned to lie. Halcyon never learned anything else."],
          ['hero', "Then who did they show you? Because that wasn't me in those vents."],
          ['nyra', "Someone with your face. And someone with mine walking your tunnels, I'd wager."],
          ['hero', "Somebody's wearing us like coats. I'll find them, and hand them back their own face."]],
        lose: [
          ['nyra', "Up. If you opened those vents, I've barely started."]] },
      4: { zone: 'pit', goal: "Hunt the face that wore yours",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills chew through Deepline's walls, and the Sky swears Kael gassed its labs."],
          ['rook', "Everyone up top says you opened the Sump's vents. You were snoring on my floor all night!"],
          ['hero', "Somebody wore my face to start a war. A face doesn't walk on its own. Somebody's holding the strings."],
          ['sable', "The strings run to the Pit Arena. To Pell. They always did."],
          ['hero', "Then we cut every one of them, and I meet the thief who wears me."]],
        win: [
          ['pell', "Her name is Rue. I taught her your face myself. She is at the Crater now, in the crowd, wearing it."],
          ['kiri', "Then the Crater hears it from me first. Hang on, Kael. My crane outflies any rumour."],
          ['sys', "At the Crater, Kael stands before Nyra while a second Kael is seen in the crowd. Rue runs. Four banners climb the Spire."],
          ['hero', "Up the Spire, then. Director, you threw me in the trash. I'm bringing it back up to you."]],
        card: "At the Pit, Pell gives the thief a name; Kiri's crane carries it to the Crater, Rue runs, and four banners climb to where the Director becomes the Convergence." },
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
      1: { zone: 'core', goal: "Burn back the Sump's wardens",
        card: "Half of Deepline sleeps warm because one prisoner in the Core Sump is in pain, and for a year three taps have come down the pipes to say someone knows.",
        intro: [
          ['sys', "The Core Sump, the bottom of everything. The furnace that warms Deepline burns on one prisoner. Subject 60."],
          ['hero', "At home I tended the vents beneath the Frozen Harbour. Red, warm, patient. No one chained them."],
          ['agent', "Heat's falling in the Slums. Stoke Sixty. Prods out."],
          ['hero', "A year of your prods. Half of Deepline sleeps warm because I hurt. Tonight you get the heat back."]],
        win: [
          ['hero', "The chain holds. The wardens do not."],
          ['sys', "Far above the Sump, three taps come ringing down the pipes. Tap. Tap. Tap."],
          ['hero', "Still here, boiler man. Still burning."]] },
      2: { zone: 'core', with: 'fumi', goal: "Hold the Sump with Fumi",
        card: "After a year of tapping, the boiler man climbs down to the bottom of everything, and Ashka hears her own name spoken aloud at last.",
        meet: [
          ['fumi', "...Hello. It's me. The tapping. I came down the boiler shaft. It took a year to find the hatch."],
          ['hero', "You are larger than your taps. And quieter."],
          ['fumi', "Fumi. I run the boilers up top. Every night the heat in my pipes was you. I stopped sleeping warm."],
          ['hero', "Ashka. Not Sixty. You are the first in a year to hear the name."],
          ['agent', "A civilian in the Sump! Captain, bring the cold lances, now!"],
          ['fumi', "I keep it in, mostly. Not tonight."]],
        win: [
          ['fumi', "Give me time. Build enough pressure in my pipes and that door leaves its hinges."],
          ['hero', "I have waited a year on a chain. I can wait on a pressure gauge."],
          ['sys', "The vents roar. Fire is pouring down them from somewhere far above, and it is not hers."]] },
      3: { zone: 'core', rival: 'pyra', goal: "Face the fire in the vents",
        card: "A girl drops out of the vents in a shower of burning ash, and before either learns the other is from the Harbour, they fight to see who burns hotter.",
        meet: [
          ['sys', "A girl drops out of the vent in a shower of burning ash. The Burn Ward's fire has run all the way down."],
          ['pyra', "Another furnace? Halcyon built one down here too? I just burned theirs down to the bolts."],
          ['hero', "I am not their furnace. I am what they burn in it. And you are on fire in my house."],
          ['pyra', "Everything's on fire. Let's see which of us burns hotter."],
          ['hero', "Come, little spark. The core has all night."]],
        win: [
          ['pyra', "...Okay. You burn hotter. Nobody burns hotter than me. Who are you?"],
          ['hero', "Ashka, of the Frozen Harbour. They chained me here a year ago."],
          ['pyra', "Pyra. Harbour too. The blue forge. Six weeks in their Burn Ward nearly finished me. You did a year?"],
          ['hero', "A year. Sit with me, sister. The chain reaches far enough for two."]],
        lose: [
          ['pyra', "Too hot for you? Thought so. Up. I'm not done."]] },
      4: { zone: 'core', goal: "Walk out of the Core Sump",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills grind down the tunnels, and the Sky screams that a Deepliner gassed its labs."],
          ['hero', "I saw him. White hair, at my vents, opening them on the labs. He stood in my glow and cast no shadow."],
          ['fumi', "Gauge is in the red. Dyna's at the door with a bag that ticks."],
          ['dyna', "One door, four kilos, a lot of love. Stand back, Ashka. Or don't. You're basically lava."],
          ['hero', "Open it."]],
        win: [
          ['sys', "The Sump's door tears loose, and Ashka walks out of the furnace for the first time in a year."],
          ['hero', "Deepline is cold without me. Good. Let it learn to warm itself without a prisoner."],
          ['sys', "In the Pit, Pell gives a name to the face at her vents: Rue. Four banners climb the Spire, and Ashka climbs under them."],
          ['hero', "The first fire belongs to Halcyon. Take me to their Engine."]],
        card: "Fumi's pressure and Dyna's bombs tear the Sump's door off and Ashka walks free; Pell names Rue as the face at her vents, and Ashka climbs the Spire under four banners." },
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
      1: { zone: 'works', goal: "Clear the Scrapworks, loudly",
        card: "On Vharra she turned the festival sky gold; in the Scrapworks every problem is a demolition job, and Halcyon's collection crew is a problem.",
        intro: [
          ['sys', "The Scrapworks. On Vharra she turned the festival sky gold. In Deepline, every problem is a demolition job."],
          ['hero', "Problem: Halcyon sent a collection crew for the girl who makes things go boom. Solution: boom."],
          ['agent', "Subject candidate, explosives. Approach with caution. She's... she's lighting something."],
          ['hero', "Grenade, mine or rocket? Pick a favourite. You're getting all three anyway."]],
        win: [
          ['hero', "Look at that crater. Look at the lip on it. That's a good one."],
          ['hero', "Halcyon wants my bombs in a jar? Tell them to bring a bigger jar. And earplugs."]] },
      2: { zone: 'works', with: 'mako', goal: "Test the suit with Mako",
        card: "Dyna needs someone who can stand beside her work without falling over, and Mako has built a suit that nothing will ever crush again.",
        meet: [
          ['mako', "You're the bomb girl. I've got a suit with a cannon on it. Cannon's empty."],
          ['hero', "A suit? I need somebody who can stand next to my work without falling over. Can it take a blast?"],
          ['mako', "Got crushed under a crate once. Built this so nothing crushes me again. Try it."],
          ['hero', "Ooh. Okay. Hold very still, big man."],
          ['mako', "...That tickled."],
          ['hero', "Partners. I make, you carry. And I ride on your shoulders."]],
        win: [
          ['mako', "Captain's down. Suit's fine. You?"],
          ['hero', "Never better. Hey, Mako. Fumi says there's a door under his boilers, and a woman locked in a furnace behind it."],
          ['hero', "That door needs a mountain of pressure and the biggest bang I've ever made. I want it."]] },
      3: { zone: 'works', rival: 'jax', goal: "Show Jax a fuse",
        card: "Jax rides down from Mile Zero to meet a girl with no sense of timing, and Dyna teaches the cowboy exactly how long three seconds are.",
        meet: [
          ['jax', "Rode all the way down from Mile Zero. Folks up top say you've got no sense of timing."],
          ['hero', "And you're a bomb with a slow fuse, cowboy. I offered to show you a real one."],
          ['jax', "Six shots in the wheel. I count every one. You count anything, girl?"],
          ['hero', "Three, two, one. That's all the counting a fuse needs."]],
        win: [
          ['jax', "...Huh. You knew to the heartbeat when every one of those would go."],
          ['hero', "Timing's the whole art. You can't hear it over your bell."],
          ['jax', "Drinks at the Long Bar, then. Water's cold and the floor's fireproof."],
          ['hero', "Deal. Keep me away from the stove."]],
        lose: [
          ['jax', "Six for six. That's timing, kid. Light another."]] },
      4: { zone: 'core', goal: "Blow the Core Sump's door",
        intro: [
          ['sys', "The Strings Cut. Drills chew into Deepline, and everyone swears the Sky sent them. A Subject called Nyra led them in."],
          ['citizen', "I saw her! Ice girl, right out in front of the drills, waving them on!"],
          ['hero', "An ice girl from the Sky, walking Halcyon's drills? Doesn't add up. Halcyon kept her in a tank."],
          ['fumi', "Whatever happened up there, Ashka's still down here. Gauge is in the red. The door, Dyna."],
          ['hero', "Biggest job of my life. Mako, hold the stairs. Everybody else: ears!"]],
        win: [
          ['sys', "Every valve in Fumi's pipes and every bomb Dyna owns go off at once. Where the Sump's door stood: a hole shaped like a sunrise."],
          ['ashka', "...You made that? It was beautiful."],
          ['hero', "Front-row seat for every eruption you ever make. That's my fee."],
          ['sys', "In the Pit, Pell gives the drill-walker a name: Rue. Four banners climb the Spire, and Dyna brings the fuses."]],
        card: "Dyna and Fumi blow the Core Sump's door off its hinges and free Ashka; at the Pit Pell names Rue, and four banners climb the Spire to the Director's Engine." },
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
      1: { zone: 'docks', goal: "Hold Dockside Nine",
        card: "At Dockside Nine everything is out of reach except to Bando, who will tell you about the kite whether or not you ask.",
        intro: [
          ['sys', "Dockside Nine, the last wharf on the Drowned Line. Everything here is out of reach. Except to him."],
          ['hero', "Did I ever tell you about the kite? Festival day on Vharra, one little girl, one tall tree, one very long arm..."],
          ['citizen', "Every day, Bando. Every day of my life. Also, Halcyon's at the end of the pier."],
          ['agent', "That's the stretchy one. Reach like that is Subject material. Net him."],
          ['hero', "Net me? From way over there? Buddy, way over there is still my reach."]],
        win: [
          ['hero', "You came all the way down here to get punched from the far end of the dock."],
          ['citizen', "You're telling this one tomorrow too, aren't you."],
          ['hero', "Every day. Right after the kite. It's tradition."]] },
      2: { zone: 'docks', with: 'dyna', goal: "Reach through Dyna's holes",
        card: "Halcyon bricks up Bando's cargo tunnel, Dyna offers him a hole, and through it drifts a paper kite from the girl he swears he saved.",
        meet: [
          ['dyna', "Bando! Halcyon bricked up the old cargo tunnel with your crates behind it. Want a hole?"],
          ['hero', "I always want a hole. You blow it, I reach through it."],
          ['dyna', "Usually on purpose. Stand back. Or, you know, stretch back."],
          ['hero', "Wait, look! A Paper Post kite, all the way down here, with a note pinned to its tail."],
          ['hero', "It's from Sora! The kite girl! Gale still owes me a kite, she says. See? I told everyone I saved her!"],
          ['dyna', "Ten thousand times, Bando. Ten thousand and one, now. Halcyon's coming through the hole. Reach, hero."]],
        win: [
          ['dyna', "Their captain went a long way. Did you throw him?"],
          ['hero', "Reeled him in, then let go. It's called physics."],
          ['hero', "Write back to Sora for me, Dyna. Tell her the arm's still long, and the story's still true."]] },
      3: { zone: 'docks', rival: 'tarek', goal: "Settle the reach with Tarek",
        card: "Tarek comes down to Dockside Nine with a chain to measure whose reach is longer, and Bando makes very sure everybody is watching.",
        meet: [
          ['tarek', "So this is Dockside Nine. I hear you've been telling the Surface your reach beats mine."],
          ['hero', "Telling everybody. Every day. You came down to measure? I invited you. Bring a tape?"],
          ['tarek', "I brought a chain. Nothing has ever slipped my reach."],
          ['hero', "Then let's see whose reach lands first. In public. Everybody watching? Good. Tell your friends."]],
        win: [
          ['citizen', "Bando by an arm! An actual arm!"],
          ['tarek', "...By a hand. One hand. I'll be back with a longer chain."],
          ['hero', "Come any time. Bring the chain. I'll hang it on the dock as a trophy."]],
        lose: [
          ['tarek', "Reeled in, dockhand. Come again, if your arm's long enough."]] },
      4: { zone: 'pit', goal: "Reach Pell in the rafters",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills punch into the Drowned Line, and the docks whisper that the Sky's Nyra led them."],
          ['hero', "The Sky? Only person from the Sky I know is a kite girl who writes nice letters. This stinks of Halcyon."],
          ['rook', "Pell's up in the Pit's rafters, working the strings. Nobody can get up there."],
          ['hero', "Nobody? Rook. Look who you're talking to."]],
        win: [
          ['sys', "Bando's arm climbs into the dark of the rafters and comes down holding the end of every string."],
          ['hero', "Got 'em. Every string. Pell, you're dangling. How's the view?"],
          ['pell', "Breathtaking. What a reach. Very well: the faces were Rue's. I taught her. Someone tell the Crater."],
          ['sys', "Kiri flies the word to the Crater, Rue runs, and four banners climb the Spire. Bando's arm reaches the top first."]],
        card: "Bando reaches into the Pit's rafters and comes down with every one of Pell's strings; Pell names Rue, Rue runs, and four banners climb the Spire." },
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
      1: { zone: 'yard', goal: "Defend the Crusher Yard",
        card: "Everything Aurelia throws away comes to rest in the Crusher Yard, and Ferra, whose cradle every tool once turned to face, decides what is worth saving.",
        intro: [
          ['sys', "The Crusher Yard. Everything Aurelia throws away comes to rest here, and Ferra decides what is worth saving."],
          ['hero', "The night I was born, every tool on the smithy wall turned to face my cradle. Down here, every scrap does."],
          ['agent', "Crusher Yard. Seize the scrap stock and the woman who moves it. She's on the list."],
          ['hero', "My Yard. My scrap. You're standing on fifty tonnes of it, and every ounce answers to me."]],
        win: [
          ['hero', "Scrap is scrap. Halcyon is scrap. It all goes in the press."],
          ['kael', "Ferra! I heard banging! Did you need... oh. You didn't need."],
          ['hero', "Never have, Sparks. Go sort the copper. And keep out from under car doors."]] },
      2: { zone: 'shafts', with: 'garo', goal: "Meet Garo in the hidden tunnel",
        card: "For years Ferra's steel has gone up the hidden tunnels and Garo's bread has come down, and tonight Halcyon's lamps give the trade a face.",
        meet: [
          ['sys', "The tunnels no map shows. Steel goes up, bread comes down. Tonight, Halcyon's lamps are in the tunnel."],
          ['garo', "You'd be Ferra. Nobody else's steel comes cut that clean."],
          ['hero', "And you're Garo. Your bread is too good for a smith. Years of trade, and not once a face."],
          ['garo', "Never needed one. The Pact trades in steel, not faces."],
          ['hero', "Halcyon found our tunnel. Pity. For Halcyon."]],
        win: [
          ['garo', "That captain's armour is good iron. Be a sin to leave it."],
          ['hero', "Take it up. Make something honest of it. Steel up, bread down, same as always."],
          ['garo', "Same as always. Only now I know whose face to thank."]] },
      3: { zone: 'yard', rival: 'vex', goal: "Settle pull and push with Vex",
        card: "Vex left her Yard half-taught to prove that pull and push are one force, and now he walks back in to prove it on his old teacher.",
        meet: [
          ['vex', "Ferra. Still sorting scrap into little piles? Pull and push are one force. I proved it, across the tunnel."],
          ['hero', "You proved you can't take a lesson without arguing with it. You left half-taught."],
          ['vex', "I left right. Opposites attract, teacher. Come close and find out."],
          ['hero', "I never stopped watching your fights, boy. I know every bad habit you've got. I gave you half of them."]],
        win: [
          ['vex', "...You read the Flux Flip before I threw it."],
          ['hero', "I taught you the half you kept. You're good, Vex. Better than me at the other half. There. Once."],
          ['vex', "Say it again. Louder. Slower."],
          ['hero', "Never. Go home to your yard. Come to mine for dinner some time."]],
        lose: [
          ['vex', "Pull and push. One thing. I told you. Again, teacher?"]] },
      4: { zone: 'pit', goal: "Call Deepline's junk to arms",
        intro: [
          ['sys', "The Strings Cut. Below, they say the Sky's Nyra marched the drills in. Above, they say Kael gassed the labs."],
          ['hero', "Kael was in my Yard sorting copper that night. Somebody is selling faces, and I want the shop."],
          ['vex', "Whoever it is, the drills are in the Pit. Pull, or push?"],
          ['hero', "Both. Every bolt, every car door, every rusted rail in Deepline. Up, all of you!"]],
        win: [
          ['sys', "Every piece of junk in Deepline rises at Ferra's call, hangs there like a held breath, and falls on Halcyon's drills."],
          ['hero', "Halcyon drills. Good steel, wasted on them. I'll find it better work."],
          ['sys', "Pell, snared in his own Cradle, names the face: Rue. Four banners climb the Spire, and Ferra's scrap shields the stairs."],
          ['hero', "Told you, Sparks. Somebody was selling faces. Now up. I've a mind to see the Director's steel."]],
        card: "Ferra calls every piece of Deepline's junk into the air and drops it on Halcyon's drills; Pell names Rue, and four banners climb the Spire to the Engine." },
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
      1: { zone: 'dojo', goal: "Keep the Rust Dojo clean",
        card: "The Rust Dojo is a dead metro car scrubbed until it shines, and its master asks the men Halcyon sends for him to take off their boots.",
        intro: [
          ['sys', "The Rust Dojo: a dead metro car, scrubbed until it shines. The cleanest room underground."],
          ['hero', "One line of ink. One falling leaf. My teacher on the steppe waited for me to see. I am still looking."],
          ['agent', "The swordsman. Halcyon wants that technique on file. Bring him in whole."],
          ['hero', "Take off your boots."]],
        win: [
          ['sys', "Petals drift down. Not one touches the floor before the last man does."],
          ['hero', "Draw. Done."],
          ['hero', "Now the floor must be swept again."]] },
      2: { zone: 'dojo', with: 'sable', goal: "Teach Sable the Flash Step",
        card: "Pell sold the Lantern Cell, and Sable comes to the Rust Dojo for a lesson that takes seven days of silence and one sentence to teach.",
        meet: [
          ['sable', "Pell sold us. I ran. My Flash Step is fast, but it isn't true. Teach me."],
          ['hero', "..."],
          ['sys', "Seven days. Sable sits. Sen sweeps. No one speaks. On the eighth morning, he lays down the broom."],
          ['hero', "You waited. Good. Then hear it once: the step is not fast. It is finished before it begins."],
          ['sable', "...That's all?"],
          ['hero', "That is all of it. Halcyon has followed you here. Show me."]],
        win: [
          ['sable', "I was there before the captain swung. Before he knew he would."],
          ['hero', "Yes. From now on, you will always be there first."],
          ['sys', "A letter from the Archive lies on the mat. Isa has written three pages. Sen answers in a single line."]] },
      3: { zone: 'metro', rival: 'pell', goal: "Stand between Pell and Sable",
        meet: [
          ['sys', "The Old Metro, outside the Rust Dojo. Pell walks the platform, strings glinting, Halcyon's men at his back."],
          ['pell', "Swordsman. You have something of mine. A quiet girl with a fast step. The Director would like her back."],
          ['hero', "She is not yours to want back. You sold her. Take off your boots, or turn around."],
          ['pell', "A thousand strings against one sword? Very well. Show me what you have taught her."]],
        win: [
          ['pell', "...One line, and every string falls at once. You are as patient as they say."],
          ['hero', "You sold the children who trusted you. Sable stays."],
          ['pell', "Then keep her well, swordsman. Better than I did."],
          ['sys', "Pell rises into the dark on the last of his strings. Sen sweeps the platform."]],
        lose: [
          ['pell', "Patience, swordsman. You have not arrived yet. Again."]],
        card: "Pell comes down the Old Metro to take Sable back for the Director, and Sen stands between them with one sword and no hurry at all." },
      4: { zone: 'pit', goal: "Cut one line through the Cradle",
        intro: [
          ['sys', "The Strings Cut. Drills in the tunnels, a stolen face on every rumour. In the Pit Arena, Pell's strings hang like rain."],
          ['sable', "Kael's face opened the vents. Nyra's face led the drills. Two faces, two lies, one hand. The strings run here."],
          ['hero', "Then we do not chase faces. We cut the hand."],
          ['rook', "There's a thousand strings up there, sensei. You've got one sword."],
          ['hero', "One line is enough."]],
        win: [
          ['sys', "One stroke. Every string from rafter to floor parts at once, and Pell's own Cradle folds shut on Pell."],
          ['pell', "One line through the Cat's Cradle. Twice, now. ...Her name is Rue. I made her. Send that to the Crater."],
          ['sys', "Kiri carries the word to the Crater, and Rue runs. Four banners climb the Spire. Sen climbs in silence."],
          ['hero', "You sold the student I took in. Sit. Now you learn patience."]],
        card: "Sen cuts one line through Pell's Cat's Cradle and every string falls; Pell names Rue, Kiri flies the word to the Crater, and four banners climb the Spire." },
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
      1: { zone: 'slums', goal: "Never fight alone in the Slums",
        card: "Rook of the Lantern Cell never fights alone, not even when he is alone, and Halcyon has come back for the boy who held the door.",
        intro: [
          ['sys', "The Deepline Slums. Rook never fights alone. Not even when he is alone."],
          ['hero', "Lantern Cell, loudest member, reporting for duty! And the second loudest! And the third! Twin Rush!"],
          ['agent', "Hidden Clans brat. The one who held the door. He doesn't walk away twice."],
          ['hero', "You want the real one? Good luck. Most mornings I can't tell either."]],
        win: [
          ['hero', "Count 'em. One of me beat all of you. Well. Six of me. Same thing, really."],
          ['kael', "Rook! You started without me? Again?"],
          ['hero', "Never without you, brother. I just started with me. There's lots of me."]] },
      2: { zone: 'slums', with: 'kael', goal: "Hold the Slums with Kael",
        card: "Halcyon is building a cage on the stairs of the Slums, and Rook and Kael, brothers out of the trash, decide which way its door opens.",
        meet: [
          ['kael', "Rook. Halcyon's building a cage on the stairs. A big one."],
          ['hero', "For us? Flattering. Oh, and Kiri's crane came down the Stacks. She says a Subject in the Sky can see Husks."],
          ['kael', "Kiri's the paper one? The one with two of her?"],
          ['hero', "Two of her. Only person who gets it. Anyway. You, me, all of me. Brothers?"],
          ['kael', "Always. Out of the trash."],
          ['hero', "Into the cage! ...No, wait. Other way."]],
        win: [
          ['kael', "That captain had a key on his belt. A Halcyon key."],
          ['hero', "Pell had a key once. A key to the Engine. He bought it with us."],
          ['kael', "Then we make him give back the change."]] },
      3: { zone: 'pit', rival: 'pell', goal: "Face Pell at the Pit Arena",
        card: "In the Pit Arena the sensei who taught Rook his clones, and sold the Cell for a key, has kept his student's seat warm.",
        meet: [
          ['pell', "Rook. My best student. You have come to the Pit at last. I kept your seat warm."],
          ['hero', "You taught me the clones. Then you sold the Cell for a key. My clones held that door until they were smoke."],
          ['pell', "And you walked out of the smoke behind them. I was so proud. Truly."],
          ['hero', "Don't be proud. Be scared. There's always more of me."]],
        win: [
          ['pell', "...More of you than I counted. You never were any good at being just one."],
          ['hero', "It's not a trick. It's friends. You never had any. Where's the key, Pell?"],
          ['pell', "Somewhere the Director cannot reach it. Another day, Rook."],
          ['sys', "The strings draw him up into the rafters, a spider climbing its own thread, and he is gone."]],
        lose: [
          ['pell', "Strings beat clones, Rook. Did I teach you nothing? Again."]] },
      4: { zone: 'pit', goal: "Hold the Pit while the net closes",
        intro: [
          ['sys', "The Strings Cut. Up top they say Kael gassed the labs. Down here they say the Sky's Nyra marched the drills in."],
          ['hero', "Kael was asleep on my floor! Snoring! I have witnesses! Mostly me, but a lot of me!"],
          ['sable', "Faces lie. Pell's strings don't. Tonight we close the Cradle on him."],
          ['moro', "You hold the Pit. All of you. We'll do the rest."],
          ['hero', "A thousand Rooks it is. Finally, enough of me."]],
        win: [
          ['sys', "A thousand Rooks hold the Pit. Sable and Moro draw the last thread tight, and Pell's own Cat's Cradle closes on him."],
          ['pell', "Caught by my own lesson. ...Hold it tight, Rook. I won't struggle."],
          ['hero', "Why not?"],
          ['pell', "Because the face that started this war was mine to teach. Her name is Rue. Someone tell the Crater."]],
        card: "A thousand Rooks hold the Pit while Sable and Moro close Pell's own Cradle on him; Pell names Rue, and four banners climb the Spire." },
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
      1: { zone: 'slums', goal: "Strike first in the Slums",
        card: "In the Slums under the Skylift's roots it is quiet, then the air begins to hum, and for the first of Halcyon's men it is already over.",
        intro: [
          ['sys', "The Deepline Slums, under the Skylift's roots. Quiet. Then the air begins to hum."],
          ['agent', "Lantern Cell runaway, the quiet one. Take her now, before she does anything."],
          ['hero', "..."],
          ['sys', "For the first man, it is already over. The rest have not noticed yet."]],
        win: [
          ['hero', "Static has to go somewhere."],
          ['hero', "Pell sold us for a key. Every hand he ever hired, I go through. Then his."]] },
      2: { zone: 'dojo', with: 'sen', goal: "Earn one lesson from Sen",
        card: "Sable's Flash Step is fast but not true, so she sits seven days in silence at the Rust Dojo while Sen sweeps, waiting for one lesson.",
        meet: [
          ['hero', "Sen. Pell sold the Cell, and I ran. My Flash Step is fast. It isn't true. Teach me."],
          ['sen', "..."],
          ['sys', "Seven days of silence. She sits. He sweeps. On the eighth morning, he lays down the broom."],
          ['sen', "The step is finished before it begins. Be there first. Then arrive."],
          ['hero', "...Worth a week."]],
        win: [
          ['sen', "You were there before the captain's hand knew it would move."],
          ['hero', "I was. Thank you, sensei. The real kind of sensei."],
          ['sen', "Go. Run at him, if you must. But run well."]] },
      3: { zone: 'slums', rival: 'kael', goal: "One thunder in Deepline",
        card: "Deepline has one thunder too many, and the quiet girl with the purple lightning and the loud boy with the white settle in public whose sky it is.",
        meet: [
          ['kael', "Hey! Quiet girl! You're the one with the purple lightning, right?"],
          ['hero', "And you throw yours everywhere. Loudly. At everything. Deepline has one thunder too many."],
          ['kael', "Agreed. Yours."],
          ['hero', "In public, then. Whoever is still standing keeps the sky."]],
        win: [
          ['kael', "Okay! Okay. You're fast. Like, lightning fast. Which, fine, is fair."],
          ['hero', "You're loud. Like, thunder loud. ...You're not bad."],
          ['kael', "So who keeps the thunder?"],
          ['hero', "We keep working it out. In public."]],
        lose: [
          ['kael', "Out of the trash, into the storm! Again? I love this!"]] },
      4: { zone: 'pit', goal: "Catch Pell at last",
        intro: [
          ['sys', "The Strings Cut. A face like Kael's opened the vents on the labs. A face like Nyra's walked the drills down. Deepline burns."],
          ['hero', "The false Kael was quiet. The air didn't hum. Kael is never quiet."],
          ['moro', "Pell's in the Pit. Rook's got the floor."],
          ['hero', "I have been running at him since the day he sold us. Tonight I arrive."]],
        win: [
          ['sys', "Flash Step. She is at the last string before Pell knows she has moved. The Cradle closes."],
          ['pell', "The quiet one. I always should have watched the quiet one. ...Her name is Rue. Tell the Crater."],
          ['hero', "You should have. Rook held the door for us. ...Thank you, Rook."],
          ['rook', "Wait. Was that a thank-you? Moro! MORO! She thanked me!"]],
        card: "Sable's Flash Step reaches Pell's last string before he sees her move, and the Cradle closes; Pell names Rue, and four banners climb the Spire." },
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
      1: { zone: 'metro', goal: "Keep the Old Metro quiet",
        card: "In the long dark between two station lamps of the Old Metro, Moro is having a very good sleep, and Halcyon has come to wake him.",
        intro: [
          ['sys', "The Old Metro, in the long dark between two station lamps. Moro would rather not fight at all."],
          ['hero', "I was asleep. It was a very good sleep. You owe me the end of it."],
          ['agent', "The sleepy one from the Lantern Cell. Ran with the girl. Wake him."],
          ['hero', "Fine. I'm very good at making things short."]],
        win: [
          ['hero', "Shadow Snare. Hold still. There. Everybody's resting now."],
          ['hero', "Pell taught us shadows are for hiding. He was wrong. Shadows are for holding."]] },
      2: { zone: 'slums', with: 'rook', goal: "Carry the Cell with Rook",
        card: "Rook has been extra loud all week because the door he held still burns behind his eyes, and Moro, who notices, offers to carry it.",
        meet: [
          ['rook', "Moro! Moro moro moro. You awake? Halcyon's in the Slums! We need you!"],
          ['hero', "Awake. Mostly. You've been extra loud all week. What's wrong?"],
          ['rook', "Nothing's wrong! Why would anything be wrong? Everything's great!"],
          ['hero', "Because the door you held is still burning behind your eyes. I know. I'll carry it. You keep being loud."],
          ['sable', "Stop talking. The captain's coming."]],
        win: [
          ['rook', "...Thanks. You know. For the carrying thing."],
          ['hero', "Didn't hear you. You weren't loud enough."],
          ['sable', "Three of us. The Cell's still a Cell."]] },
      3: { zone: 'ward', rival: 'vesper', goal: "Catch Vesper on the Night roofs",
        card: "Every night a red scarf walks through Moro's shadows in muddy boots, and at last he climbs to the Night Ward roofs to make her knock.",
        meet: [
          ['sys', "The Night Ward roofs, Aurelia. Moro has climbed up through his own shadow, after a red scarf that keeps walking through it."],
          ['vesper', "You followed me up. That's new. Usually you just sigh at me."],
          ['hero', "You walk through my shadows like they're doors. Every night. Muddy boots. It's rude."],
          ['vesper', "Shadows are for walking through. Everybody knows that."],
          ['hero', "Shadows are for holding. Let me show you."]],
        win: [
          ['vesper', "...You held me. In my own shadow. All right. That's a very good trick."],
          ['hero', "Knock next time."],
          ['vesper', "On a shadow?"],
          ['hero', "Find a way."]],
        lose: [
          ['vesper', "You never even saw me. Again?"]] },
      4: { zone: 'pit', goal: "Hold the Pit with shadows",
        intro: [
          ['sys', "The Strings Cut. Deepline blames the Sky for the drills; the Sky blames Deepline for its labs. Both are wrong. Both bleed."],
          ['hero', "Nyra's face led the drills. Her shadow didn't move with her. Shadows don't lie. Faces do."],
          ['sable', "Pell's in the rafters. Rook has the floor. You?"],
          ['hero', "I hold everything else."]],
        win: [
          ['sys', "Moro's shadows hold the drill crews still across the whole Pit, like flies in amber. Not hidden. Held."],
          ['pell', "My lesson, turned inside out. Shadows that hold, not hide. ...The faces were Rue's. Someone tell the Crater."],
          ['hero', "You taught it wrong. I fixed it. Sit still, sensei. Your turn to be held."],
          ['sys', "Kiri flies the word to the Crater, Rue runs, and four banners climb the Spire. Moro climbs with them, yawning."]],
        card: "Moro's shadows hold the drill crews still across the Pit while Pell is caught and names Rue; four banners climb the Spire, and Moro climbs with them." },
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
      1: { zone: 'pit', goal: "Hold court at the Pit Arena",
        card: "In the Pit Arena Pell, sensei of the Lantern Cell, smiles behind porcelain, and for ten years he has also been the Director's spymaster.",
        intro: [
          ['sys', "The Pit Arena. Pell, sensei of the Lantern Cell, smiles behind porcelain. For ten years he has also been the Director's spymaster."],
          ['director', "Pell. Your report is late, and I do not keep slack strings. A squad is coming to test the tension."],
          ['hero', "Director, you wound me. Send them in. I'll teach them to dance."],
          ['hero', "Balance, always balance. Three layers on three strings. Someone must hold them. It may as well be me."]],
        win: [
          ['hero', "Do tell the Director his testers were wonderful. Wooden, but wonderful."],
          ['director', "Noted. Keep the layers apart, Pell. A city that looks down never looks up at my Engine."],
          ['hero', "Of course. Balance."]] },
      2: { zone: 'blank', with: 'rue', goal: "Bring Rue out of the Blank Wing",
        card: "In the Blank Wing, where nothing casts a shadow, Pell finds a shape with no face and teaches it to wear anyone's, and never asks for its own.",
        meet: [
          ['sys', "The Blank Wing, Aurelia. White walls, white light, no shadows anywhere. In one cell, a shape with no face."],
          ['hero', "Hello, little nothing. They tell me you become whatever you look at."],
          ['rue', "..."],
          ['hero', "Then look at me. Watch my hand. Now yours. ...Yes. Oh, yes. You'll wear any face you please."],
          ['rue', "...Any face. Whose?"],
          ['hero', "Whoever is useful. Come along. Nobody told the guards."]],
        win: [
          ['rue', "Their captain. I wore him. They opened the door for me."],
          ['hero', "Beautiful. My finest pupil, and I've had you an hour."],
          ['sys', "Not once does he ask her what her own face looks like."]] },
      3: { zone: 'pit', rival: 'rook', goal: "Teach Rook one last lesson",
        card: "Rook comes to the Pit to collect for the whole Lantern Cell, and Pell, who sold it for a key, faces the loudest and most loyal of his students.",
        meet: [
          ['rook', "Pell! You sold us. The whole Cell, for a key. I've come to collect."],
          ['hero', "Rook. My best student. Always the loudest, and the most loyal. Such a waste of both."],
          ['rook', "Waste this! Twin Rush!"],
          ['hero', "Strings beat clones, dear boy. Allow me to remind you."]],
        win: [
          ['rook', "...Still. Not. Done. There's always more of me."],
          ['hero', "There always was. I counted wrong, all those years ago. I am sorry for that."],
          ['hero', "No. I gave away the right to be sorry. Another day, Rook."]],
        lose: [
          ['rook', "That one was for the door. Get up. The next one's just for me."]] },
      4: { zone: 'pit', goal: "Let the strings be cut",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills break into Deepline. Rue walked them in wearing Nyra's face, exactly as Pell taught her."],
          ['director', "Splendid. Each layer blames the other, and none of them looks up. Hold the Pit, Pell, while my drills go deep."],
          ['hero', "I taught her that face. I taught her Kael's. And I called it balance."],
          ['hero', "Your drills are killing Deepliners, Director. That was never balance. Your men will have to come through me."]],
        win: [
          ['sys', "His own students close the Cat's Cradle around him. He could slip it. He does not."],
          ['rook', "Got you! ...Wait. You could get out of that. Why aren't you?"],
          ['hero', "Because, for once, the strings are in the right hands. Her name is Rue. I taught her. Kiri, fly it to the Crater."],
          ['sys', "Kiri flies it to the Crater, and Rue runs. Four banners climb the Spire, and they carry Pell up with them, still tied."]],
        card: "Pell lets his own students close the Cat's Cradle on him and names Rue; Kiri flies the word to the Crater, and four banners climb the Spire." },
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
      1: { zone: 'rootways', goal: "Tend the garden of bone",
        card: "The dead of the Ashfall War lie in rows beneath the oldest part of Deepline, and Thorne keeps them like a garden, borders and all.",
        intro: [
          ['sys', "The catacombs beneath the oldest part of Deepline. The dead of the Ashfall War lie here, planted in rows like a garden."],
          ['hero', "Good evening. Do mind the borders. The ribs are flowering beautifully this year."],
          ['agent', "Halcyon survey. Bone stock for the Engine's filters. Clear the catacombs, all of it."],
          ['hero', "My guests are resting. May I show you to a bed of your own?"]],
        win: [
          ['hero', "Lovely. They'll have taken root by spring."],
          ['hero', "Now, a note to Ume. Her pollen had the whole garden sneezing for a week. I must thank her properly."]] },
      2: { zone: 'heartroot', with: 'vesna', goal: "Keep Sunday tea with Vesna",
        meet: [
          ['vesna', "Thorne. Sunday. I brought the cups, and a page of the Ledger I can't stop reading."],
          ['hero', "And I the tea. Halcyon's page, I imagine. It looks heavier than the cups."],
          ['vesna', "It grows every week. And today they've sent men down your stair to read the rest."],
          ['hero', "Then we'll finish our tea after. The dead keep their own accounts. Allow me to help with the living."],
          ['agent', "The Ledger woman and the grave man. Take the book. Take the bones."],
          ['hero', "During tea. How very rude."]],
        win: [
          ['vesna', "Their captain owed me. Consider him settled."],
          ['hero', "And now he owes me a bed. Lovely. More tea?"],
          ['vesna', "Always. And no, I'm not charging you. I never will. Tell no one."]],
        card: "Halcyon sends men down the stair in the middle of Sunday tea, and Thorne and Vesna defend the catacombs between one cup and the next." },
      3: { zone: 'rootways', rival: 'ume', goal: "Duel Ume among the bones",
        card: "Every spring Thorne's cuttings go up to the Glowwild and Ume's pollen comes down to the catacombs, and this year Ume comes down herself.",
        meet: [
          ['ume', "Thorne. I came down to see your famous garden. Your cuttings arrive every spring, so very polite."],
          ['hero', "And your pollen arrives every spring, so very effective. The whole catacomb sneezed for a week."],
          ['ume', "Lovely, isn't it? Deadly, too. Shall we see whose garden wins?"],
          ['hero', "Cuttings against pollen. How delightful. Do wipe your feet."]],
        win: [
          ['ume', "Your bones bite back. I did not expect that of bones."],
          ['hero', "Nor I your spores. My compliments, Ume. Do take a cutting home."],
          ['ume', "I'll send pollen."],
          ['hero', "Please don't."]],
        lose: [
          ['ume', "Something in your garden is blooming. Oh dear. It's you."]] },
      4: { zone: 'pit', goal: "Raise the dead for the living",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills crack the catacomb walls, and their crews pour through the graves into Deepline."],
          ['vesna', "They say the Sky's Nyra marched them in. I don't believe a word of it. The Ledger says Halcyon."],
          ['hero', "Faces are cheap. Bones don't lie. My guests heard the drills, and they would like a word."],
          ['hero', "Rise, please, everyone. The living half of Deepline needs the dead half."]],
        win: [
          ['sys', "The dead half of Deepline stands up for the living half and walks Halcyon's crews, very politely, out of the tunnels."],
          ['hero', "Thank you, everyone. Back to bed now. Mind your neighbours."],
          ['vesna', "Nicely done. And the Pit says Pell has named the face: Rue. The banners are climbing the Spire."],
          ['hero', "Then I shall come too. The Director has filled a great many graves. He may like to see one."]],
        card: "Thorne wakes the dead of the Ashfall War to walk Halcyon's crews out of Deepline; Pell names Rue, and four banners climb the Spire." },
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
      1: { zone: 'yard', goal: "Defend the yard across the tunnel",
        card: "Across the tunnel from Ferra's stands a smaller yard, Vex's own, bought with Vesna's money, and every brick in it still owes interest.",
        intro: [
          ['sys', "The yard across the tunnel from Ferra's. Smaller. Vex's own. Bought with Vesna's money, and every brick still owes her."],
          ['hero', "Pull and push. One force, pointed two ways. Ferra never saw it. That's why I've got a yard of my own."],
          ['agent', "Magnet boy. The Director wants that trick on file. Take him, and the scrap."],
          ['hero', "Opposites attract. Come closer. ...Now go away."]],
        win: [
          ['hero', "Repel, Attract, Flux Flip. That's the full lesson. No charge."],
          ['citizen', "Vesna's runner is at the gate. She says the interest is due today."],
          ['hero', "...Charge pending."]] },
      2: { zone: 'docks', with: 'mako', goal: "Tune Mako's magnets",
        card: "Mako's suit pulls left, and Vex, who kept only one friend from the Yard, tunes its magnets on the dock while Halcyon comes to watch.",
        meet: [
          ['mako', "Vex. Suit pulls left. Magnets."],
          ['hero', "Your magnets always need tuning. You build too fast. Hold still. Let me feel the field."],
          ['mako', "You talk too much about polarity."],
          ['hero', "You're the only friend I kept from the Yard. I talk about polarity because you let me."],
          ['mako', "Halcyon. On the dock."],
          ['hero', "Good. Field test."]],
        win: [
          ['mako', "Pulls straight now. Thanks."],
          ['hero', "Ferra built most of it. I made it work. Don't tell her I said the first part."],
          ['mako', "I'll tell her both parts."]] },
      3: { zone: 'yard', rival: 'ferra', goal: "Prove pull and push to Ferra",
        card: "Vex walks back into Ferra's Yard to show his old teacher that pull and push are one force, and finds she has watched every fight he ever had.",
        meet: [
          ['ferra', "Vex. You walked back into my Yard. Bold."],
          ['hero', "I came to show you. Pull and push are one thing. I built a whole yard proving it."],
          ['ferra', "A yard you borrowed from Vesna. I watch your fights, boy. That Flux Flip leaves you wide open."],
          ['hero', "You watch my fights? ...Then watch this one from close up."]],
        win: [
          ['ferra', "...All right. One force, two ways. You might be right. Might."],
          ['hero', "Say that again."],
          ['ferra', "Never. You fought well. Come to dinner some day."],
          ['hero', "...Maybe. If you cook on my half of the scrap."]],
        lose: [
          ['ferra', "All push, no pull. Still. Again, apprentice."]] },
      4: { zone: 'pit', goal: "Pay the Ledger in iron",
        intro: [
          ['sys', "The Strings Cut. They say the Sky's Nyra walked Halcyon's drills into the tunnels. Vex doesn't care whose face it wore."],
          ['vesna', "Vex, darling. The Red Ledger calls in every debt tonight. Yours is the size of a yard."],
          ['hero', "I don't have it. You know I don't have it."],
          ['vesna', "Then pay me in iron. Every drill in that Pit. Pull them apart."]],
        win: [
          ['sys', "Halcyon's drills fly apart in the Pit. Their steel comes to Vex's hands like dogs called home, and stays."],
          ['hero', "That's the yard paid off. Interest and all."],
          ['vesna', "Not in full. But a very good month. Come, darling: Pell has named the face, Rue. The banners are going up."]],
        card: "Vesna calls in Vex's debt, and he pays it by pulling Halcyon's drills apart in the Pit; Pell names Rue, and four banners climb the Spire." },
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
      1: { zone: 'market', goal: "Collect in the Red Quarter",
        card: "Every debt in Deepline is written in one red book in one careful hand, and Halcyon wants the Ledger, because every name in it is a lever.",
        intro: [
          ['sys', "The Neon Market's Red Quarter. Every debt in Deepline is written in one red book, in one careful hand."],
          ['hero', "Everything has a price. Nobody in Deepline has ever paid me late twice."],
          ['agent', "The bookkeeper. Halcyon wants that Ledger. Every name in it is a lever."],
          ['hero', "You want my book? How sweet. Let me open a fresh page, just for you."]],
        win: [
          ['hero', "Collected. In red. I'll bill your Director for the stains."],
          ['hero', "Halcyon's page grows longer every day. One day I collect all of it, with interest."]] },
      2: { zone: 'rootways', with: 'thorne', goal: "Keep Sunday tea with Thorne",
        card: "Every Sunday Vesna brings the cups and Thorne the tea, and this Sunday Halcyon comes down the stair to read the rest of the Ledger.",
        meet: [
          ['hero', "Thorne. Sunday. I brought the cups."],
          ['thorne', "And I the tea. You look tired, my dear. Is the Ledger heavy today?"],
          ['hero', "Halcyon's page is the longest in the book. I want it closed before somebody closes mine."],
          ['thorne', "The dead keep their own accounts. Let me help you with the living. Ah. Guests."],
          ['agent', "The Ledger woman and the grave man, together. Take them both, book and bones."],
          ['hero', "Interrupting tea. That costs extra."]],
        win: [
          ['thorne', "Your tea has gone cold. And in all these years you've never once charged me for it."],
          ['hero', "Nor ever will. Tell no one. I have a reputation."],
          ['thorne', "Who would I tell? My guests are very discreet."]] },
      3: { zone: 'market', rival: 'maren', goal: "Settle the bill with Maren",
        card: "The Tide Doctor has been giving blood away for free, which is dreadful for business, and in the Red Quarter Vesna calls in the account.",
        meet: [
          ['maren', "Vesna. I've seen your bills. The ones paid in blood. You call this bookkeeping?"],
          ['hero', "Doctor. You give it all away for free. Do you know what that does to a market?"],
          ['maren', "What you do is a sickness, Vesna."],
          ['hero', "It's a ledger, Doctor. And you're on the wrong page of it."]],
        win: [
          ['maren', "...You heal from every cut you make. That's not a ledger. That's a wound that pays itself."],
          ['hero', "Clever. I'll write that down."],
          ['maren', "Patch your arm. Free of charge. Don't argue."],
          ['hero', "...Just this once. And I'm writing that down, too."]],
        lose: [
          ['maren', "Doctor's orders: rest. Then try me again."]] },
      4: { zone: 'pit', goal: "Open the Ledger at Halcyon's page",
        intro: [
          ['sys', "The Strings Cut. Drills in Deepline, and rumours the Sky's Nyra walked them in. Vesna has read the real accounts."],
          ['hero', "The Sky didn't send these drills. Halcyon did, and paid for them with Deepline's money. I've seen the receipts."],
          ['hero', "Their page is the longest in my book. Tonight I call in every debt at once."],
          ['vex', "Every debt? Even mine?"],
          ['hero', "Especially yours, darling. You may pay in iron."]],
        win: [
          ['sys', "Vesna reads Halcyon's page aloud in the Pit, line by line, and every debt in Deepline rises to answer it."],
          ['hero', "Every drill, every crew, every stolen hour. Collected, in full and in red."],
          ['sys', "Pell, snared in his own Cradle, names the face that began it: Rue. Four banners climb the Spire, and Vesna brings the bill."],
          ['hero', "Halcyon's page, closed. For now. The interest I'll take from the Director in person."]],
        card: "Vesna opens the Red Ledger at Halcyon's page and calls in every debt in Deepline at once; Pell names Rue, and four banners climb the Spire." },
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
      1: { zone: 'waterworks', goal: "Keep the boilers running",
        card: "Fumi keeps half of Deepline from freezing in the boilers above the Core Sump, and every night, under the floor, someone taps back.",
        intro: [
          ['sys', "The Waterworks, the boilers above the Core Sump. Fumi keeps half of Deepline from freezing, and says very little about it."],
          ['hero', "Pressure's good. Pumps are good. The tapping's... still there. Every night. Under the floor."],
          ['agent', "Boilerman. You've been tapping back to Subject Sixty. Hands off the pipes. You're coming with us."],
          ['hero', "I keep it in. Mostly."]],
        win: [
          ['hero', "...Mostly."],
          ['sys', "When the steam thins, Fumi kneels by the pipe and taps three times. Three taps answer."],
          ['hero', "I'm coming down. Soon. Hold on a little longer."]] },
      2: { zone: 'core', with: 'ashka', goal: "Find the voice in the pipes",
        card: "At the end of a year of tapping, Fumi climbs down the boiler shaft to meet the woman whose pain has kept his pipes warm.",
        meet: [
          ['sys', "Fumi climbs down the boiler shaft into the Core Sump, at the end of a whole year of tapping."],
          ['ashka', "...You. The tapping. So the boiler man has a face."],
          ['hero', "Fumi. I heard you every night. The heat in my pipes was you hurting. I couldn't bear it any more."],
          ['ashka', "Ashka. Not Sixty. Say it once, so I hear it out loud."],
          ['hero', "Ashka. ...Wardens on the stairs. Time to let off some steam."]],
        win: [
          ['ashka', "You came down. No one comes down."],
          ['hero', "Next time I come back with enough pressure to blow that door into the next layer. Partners?"],
          ['ashka', "I burn. You boil. Partners."]] },
      3: { zone: 'waterworks', rival: 'mako', goal: "Test Mako's boiler to bursting",
        card: "Mako's suit boiler is running hot again, and Fumi, who has stopped it cooking him twice, agrees to hit it until something pops.",
        meet: [
          ['mako', "Fumi. Suit's boiler's running hot again. Dyna wants a full pressure test."],
          ['hero', "Full pressure. On a suit with a man inside. You trust me that much?"],
          ['mako', "You've stopped it cooking me twice. Hit it till something pops. Better here than out there."],
          ['hero', "...All right. Brace."]],
        win: [
          ['sys', "The suit's boiler blows a valve with a shriek like a kettle. The suit holds."],
          ['mako', "Still standing. Fixed?"],
          ['hero', "Fixed. Three new valves. Take more than me to pop it now."],
          ['mako', "Good. That's all I wanted to hear."]],
        lose: [
          ['mako', "Suit's fine. You're the one steaming. Again?"]] },
      4: { zone: 'core', goal: "Blow the Core Sump's door",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills chew through Deepline's walls, and every tongue swears the Sky's Nyra led them."],
          ['hero', "Ashka saw a Deepline boy at her vents. The Sky saw him too. Now a Sky girl at our drills. Two lies. One liar."],
          ['dyna', "Doesn't matter tonight. How much pressure have you got, boiler man?"],
          ['hero', "A year of it. One for every night I didn't come down."]],
        win: [
          ['sys', "Every valve in the Waterworks opens down one pipe at once. Dyna lights the fuse. The Sump's door stops existing."],
          ['ashka', "...Fumi. I'm out."],
          ['hero', "You're out. I'm... I'm going to sit down a minute."],
          ['sys', "Not for long. Pell names the face behind it all: Rue. Four banners climb the Spire, and Fumi brings a pressure gauge."]],
        card: "A year of pressure and Dyna's bombs take the Core Sump's door off and Ashka walks free; Pell names Rue, and four banners climb the Spire." },
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
      1: { zone: 'docks', goal: "Hold the docks in the suit",
        card: "Mako was crushed under a crate at Dockside Nine once and promised himself never again, so he built a suit, and kept building.",
        intro: [
          ['sys', "Dockside Nine. Mako was crushed under a crate once, and made himself one promise: never again."],
          ['hero', "Built a suit. Then kept building. New plating this week."],
          ['agent', "That suit is Halcyon property now. Peel it open. Bring the pilot."],
          ['hero', "Out of the suit, I'm gentle. In it... well. Arm Cannon."]],
        win: [
          ['hero', "Plating took it. Grew back. Good."],
          ['citizen', "Mako! The crates! The stack's coming down!"],
          ['hero', "Got it. Not this time, crate."]] },
      2: { zone: 'yard', with: 'dyna', goal: "Keep the suit alive",
        card: "Halcyon has dented the plating, cooked the boiler and bent the magnets, and everyone who keeps Mako's suit alive gathers in one yard.",
        meet: [
          ['dyna', "Mako. You look like a crate fell on you. Again."],
          ['hero', "Halcyon tested it. Plating dented. Boiler cooking. Magnets pulling left."],
          ['ferra', "Scrap for the plating. Family discount, as always."],
          ['vex', "Magnets. I'll be talking about polarity the whole time. You've been warned."],
          ['fumi', "Boiler. Third time I've stopped it cooking you."],
          ['hero', "Everyone who keeps the suit alive, in one yard. And Halcyon's coming to watch."]],
        win: [
          ['dyna', "Suit's better than new. Can I ride up top now?"],
          ['hero', "Only you. Always only you."],
          ['hero', "Thanks. All of you. The suit's only as strong as the hands that keep it."]] },
      3: { zone: 'works', rival: 'dyna', goal: "Take Dyna's blast test",
        card: "Dyna has built the biggest bombs of her life for one blast test, and if Mako's suit holds against these, it holds against anything.",
        meet: [
          ['dyna', "Blast test, big man. Biggest bombs I've ever built. If the suit holds this, it holds anything."],
          ['hero', "And if it doesn't hold?"],
          ['dyna', "Then I build you a better one. Hold still. Or fight back, actually. It's more fun when you fight back."],
          ['hero', "...Okay. Fighting back."]],
        win: [
          ['dyna', "It held! Every single one! Look at that plating! Gorgeous!"],
          ['hero', "I'm a little dizzy."],
          ['dyna', "Dizzy is fine. Dizzy means alive."]],
        lose: [
          ['dyna', "Boom. Suit's smoking, big man. Patch it and go again?"]] },
      4: { zone: 'pit', goal: "Walk the tank through the Pit",
        intro: [
          ['sys', "The Strings Cut. The drills came in behind a face like the Sky's Nyra. Deepline marches on the Pit."],
          ['hero', "A Sky girl, out in front of Halcyon's drills? Ferra says it's wrong. I trust Ferra."],
          ['dyna', "Doesn't matter whose face. The drills are real. Walk, big man. I've got the ammo."],
          ['hero', "Walking."]],
        win: [
          ['sys', "A walking tank crosses the Pit with Dyna on its shoulders, and Halcyon's crews break against it like surf on a pier."],
          ['hero', "Full Barrage. Last shell was the size of a car. Felt good."],
          ['dyna', "That was MY shell. ...Mako, the Pit says Pell named the face: Rue. Banners are going up the Spire. Walk."]],
        card: "Mako walks his suit across the Pit with Dyna on his shoulders, and Halcyon's crews break against it; Pell names Rue, and four banners climb the Spire." },
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
      1: { zone: 'choir', goal: "Keep the Drowned Line",
        card: "The sea took Nami once in the flooded tunnels at the bottom of Deepline and gave her back with its cold still in her, and the Director wants to know how.",
        intro: [
          ['sys', "The Drowned Line, the flooded tunnels at the bottom of Deepline. The sea took Nami once, and gave her back with its patience."],
          ['hero', "Grey and cold, I know. The Line's still in me. It's quieter than it looks."],
          ['agent', "The drowned woman. Under too long to live, and still walking. The Director wants to know how."],
          ['hero', "Come into the water and I'll show you."]],
        win: [
          ['hero', "Riptide. Bubble Jail. The sea taught me all of it, down there in the dark."],
          ['sys', "Fumi's pumps thump overhead like a slow heart. The Line stays where it is."],
          ['hero', "Good. Stay. Nobody else goes under while I'm watching."]] },
      2: { zone: 'waterworks', with: 'maren', goal: "Guard Maren on the Line",
        card: "The doctor who argued with the sea for a whole night comes down to check the water lines, and Nami, who owes her everything, stands guard.",
        meet: [
          ['maren', "Nami. They let me down to check the water lines. I promised I'd be quick."],
          ['hero', "You're never quick. You stop for every cough. I'll guard you."],
          ['maren', "I argued with the sea a whole night for you. Let me argue with a few coughs."],
          ['fumi', "Pumps are up. And Halcyon followed the doctor down. They're in the tunnel."],
          ['hero', "Then they're in my water. Stay behind me, doctor."]],
        win: [
          ['maren', "You came back colder from the sea. And kinder."],
          ['hero', "You gave me back. I keep you safe. That's our deal."],
          ['maren', "There's no deal, Nami. There never was. But thank you."]] },
      3: { zone: 'choir', rival: 'fumi', goal: "Settle the Line with Fumi",
        meet: [
          ['sys', "The Drowned Line. Fumi's pumps are running flat out, and the water is falling for the first time in years."],
          ['hero', "Fumi. You're draining my Line. The docks float on it, and the Ashfall dead sleep under it. Stop."],
          ['fumi', "Halcyon wants the water to cool the Engine. If I don't pump, they shut my boilers off. Deepline freezes."],
          ['hero', "Then Halcyon gets neither. Put your hands on those valves again and I put you in the water."],
          ['fumi', "I keep it in, mostly. Not tonight, Nami. I'm sorry."]],
        win: [
          ['fumi', "...You're stronger than my pumps. You always were."],
          ['hero', "And you're kinder than Halcyon. That's why they chose you. Tell them no. We keep the boilers lit together."],
          ['fumi', "Pumps and patience. Like always."],
          ['hero', "Like always. Now turn them round."]],
        lose: [
          ['fumi', "Sorry. Sorry. Pressure's too high to stop now. Again?"]],
        card: "Halcyon orders Fumi to drain the Drowned Line to cool its Engine, and Nami has to fight her friend to keep the water where it belongs." },
      4: { zone: 'choir', goal: "Raise the Line against the drills",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills push into the Drowned Line, and they say a Sky Subject called Nyra led them."],
          ['hero', "Nyra? Maren kept her alive in a Halcyon tank. She'd never lead drills into anyone's home."],
          ['fumi', "The drills are drinking the Line, Nami. Halcyon's coolant after all. Run the pumps backwards and the whole Line comes up."],
          ['hero', "Then run them backwards. The Line has waited a long time to rise."]],
        win: [
          ['sys', "The Drowned Line rises out of the dark and closes over Halcyon's drills. They do not come back up."],
          ['hero', "The sea took me once, and gave me back. It doesn't give drills back."],
          ['sys', "In the Pit, Pell gives the drill-leader a name: Rue. Four banners climb the Spire, and Nami climbs with them, dripping."]],
        card: "Fumi turns the pumps backwards, and the Drowned Line rises and swallows Halcyon's drills; Pell names Rue, and four banners climb the Spire." },
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
