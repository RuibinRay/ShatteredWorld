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
        intro: [
          ['sys', "The Crusher Yard, Deepline. A tear opens over the trash heap, and a boy falls out of a storm."],
          ['hero', "Vharra. Thunderheads. The storm clans. I know exactly where I come from... and this is not it."],
          ['ferra', "You. Under the car door. You alive, or are you salvage?"],
          ['hero', "Alive. Name's Kael. And I'm nobody's salvage."],
          ['agent', "Halcyon collection. Something with power fell in the Yard. Bag it, number it, send it up."],
          ['hero', "Number me? Come and try."]],
        win: [
          ['ferra', "Huh. Lightning out of a scrap kid. I'm keeping you. Salvage rights."],
          ['citizen', "Did you see his hands? Sparks! The new kid's called Sparks!"],
          ['hero', "It's Kael. ...Fine. Sparks works too."],
          ['hero', "Halcyon wants me in a jar? Then Halcyon's my problem now."]] },
      2: { zone: 'slums', with: 'fenn', goal: "Hold the Slums with Fenn and Rook",
        meet: [
          ['fenn', "That storm-eye on your jacket. Who scratched Vharra's mark into Deepline scrap?"],
          ['hero', "Me. So I never forget which sky I fell out of. You're from the steppe too?"],
          ['fenn', "Hunting clans. My wolf ran at the tear when I fell. You're a storm-clan kid, and you're alone down here."],
          ['rook', "He is NOT alone. Rook. His brother. We've had a whole week of brothering."],
          ['fenn', "Then I'm the big brother. Nobody asked. Halcyon's collectors are on the stairs. Show me your thunder."],
          ['hero', "You'll see plenty. Rook, clones out!"]],
        win: [
          ['fenn', "Wild. Loud. You throw lightning like you're angry at it. We'll fix that."],
          ['rook', "Don't fix him too much. Loud is our whole plan."],
          ['hero', "Two brothers in one week. Deepline's better than it looks."]] },
      3: { zone: 'crater', rival: 'nyra', goal: "Duel Nyra at the Crater",
        meet: [
          ['sys', "The Crater, under a violet sky. Halcyon says an escaped Subject called Nyra sold out the tunnels."],
          ['hero', "You. Nyra. They say you sold every hideout in Deepline to Halcyon."],
          ['nyra', "And they showed me you, opening the Sump's vents on the labs. People died in those labs."],
          ['hero', "I've never been near the Sump's vents! Somebody's lying, and it's not me."],
          ['nyra', "Then fight louder than I sing, Deepline. Prove it."]],
        win: [
          ['nyra', "Stop. You fight like someone who has never told a lie. Halcyon lies all the time."],
          ['hero', "Then who did they show you? Because it wasn't me."],
          ['nyra', "Someone with your face. And someone with mine in your tunnels, I'd guess."],
          ['hero', "Somebody's wearing us. I'll find them, and give them back their own face."]],
        lose: [
          ['nyra', "Get up. If you opened those vents, I'm not done."]] },
      4: { zone: 'pit', goal: "Hunt the face that wore yours",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills break into Deepline, and the Sky swears Kael gassed its labs."],
          ['rook', "Everyone up top says you opened the Sump's vents. You were asleep on my floor all night!"],
          ['hero', "Somebody wore my face to start a war. Whoever they are, somebody's holding their strings."],
          ['sable', "The strings run to the Pit Arena. Pell's strings. They always did."],
          ['hero', "Then we cut them. All of them. And I find the one with my face."]],
        win: [
          ['pell', "Her name is Rue. I taught her your face. She is at the Crater now, in the crowd, wearing it."],
          ['kiri', "Then the Crater hears it from me first. Hang on, Kael. My crane is faster than any rumour."],
          ['sys', "At the Crater Kael stands in front of Nyra while a second Kael is seen in the crowd. Rue runs. Four banners climb the Spire."],
          ['hero', "Up the Spire, then. Director, I'm out of the trash, and I'm coming for you."]],
        card: "At the Pit Pell names Rue; Kiri flies the word to the Crater, Rue runs, and four banners climb the Spire, where the Director becomes the Convergence." },
      5: { zone: 'dunes', foe: 'itsuki', goal: "Hold Itsuki in the Ash Dunes",
        intro: [
          ['sys', "The Director, now the Convergence, opens the Beyond. A crown-ship the size of a city fills the sky. Sovereign Vael is here."],
          ['sys', "His Legion pours down the shafts, and his champions go out to all three layers. Tarn comes down the stairs, bleeding."],
          ['tarn', "Ash Dunes. One of Vael's. White hair, horns, five elements. He beat Ivo, Jax, me. Brann's holding him. Nobody else can."],
          ['hero', "Then he hasn't met Deepline yet. Show me."]],
        meet: [
          ['sys', "The Ash Dunes. Brann goes down in the sand. A stranger with calm red eyes turns to the next one up."],
          ['itsuki', "Fire, wind, thunder, earth, water. I learned each on a different world. You have one of them. Step aside."],
          ['hero', "I fell out of a storm into a trash heap and climbed out. I don't step aside. Not for Halcyon, not for you."],
          ['itsuki', "Then hold me as long as you can. Your friends are counting on it."]],
        win: [
          ['sys', "Kael's thunder holds Itsuki longer than anyone in the Dunes. Then the wheel turns once more, and Kael is in the sand."],
          ['itsuki', "Longest of all of them. Good. I will be under the Crown. Come and finish it, thunder."],
          ['sys', "He walks back across the Dunes toward the Crater. Nobody stops him."],
          ['hero', "Brann, Tarn... everybody's breathing. Next time, I'm the one who walks away."]],
        lose: [
          ['itsuki', "Not yet. Get up. They need you to last longer than that."]],
        card: "Vael comes through with his champions. In the Ash Dunes Kael meets Itsuki for the first time and holds him longest of all, but Itsuki walks back to wait." },
      6: { goal: "Bring the storm down on the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The Sky, the Surface and Deepline meet on the rim, and the Hollow Legion pours down out of the dark."],
          ['convergence', "A number I never bothered to learn. The trash I dropped. You should have stayed in the heap."],
          ['hero', "Take a number. Deepline's here, and we brought everybody."]],
        meet: [
          ['itsuki', "Thunder. You came. The others went around me. You came straight to me."],
          ['hero', "We've got a fight to finish. I don't leave fights half-done."],
          ['itsuki', "Neither do I. Come, then. This time I will not hold back."]],
        lose: [
          ['itsuki', "The wheel turns. You fall. Again, thunder."]],
        win: [
          ['sys', "Itsuki goes down. The Convergence comes apart. Vael comes down himself, and Kael's thunder meets him in the air."],
          ['hero', "Hey, Sovereign. Remember the trash heap? That's where I learned to hit things bigger than me!"],
          ['sys', "The last bolt goes through the crown-ship. It falls into the Crater, and the door to the Beyond slams shut behind it."],
          ['sys', "The door drags the Legion and every champion back through. Itsuki goes last, looking at Kael."],
          ['hero', "Ferra's going to want that thing for scrap. ...We're still here. All of us."],
          ['hero', "Out of the trash, into the storm!"]],
        card: "At the Crater Kael beats Itsuki, the Convergence and Vael, and his last bolt drops the crown-ship; the door drags the Legion and every champion home." }
    },

    // ---------------------------------------------------------------- ASHKA
    ashka: {
      1: { zone: 'core', goal: "Burn back the Sump's wardens",
        intro: [
          ['sys', "The Core Sump, the bottom of everything. The furnace that heats Deepline runs on one prisoner. Subject 60."],
          ['hero', "At home I tended the vents under the Frozen Harbour. Red, warm, patient. Nobody chained them."],
          ['agent', "Heat's dropping in the Slums. Stoke Sixty. Prods out."],
          ['hero', "A year of your prods. Half of Deepline is warm because I hurt. Today you get the heat back."]],
        win: [
          ['hero', "The chain holds. The wardens do not."],
          ['sys', "Above the Sump, three taps ring down the pipes. Tap. Tap. Tap."],
          ['hero', "Still there, boiler man. Still burning."]] },
      2: { zone: 'core', with: 'fumi', goal: "Hold the Sump with Fumi",
        meet: [
          ['fumi', "...Hello. It's me. The tapping. I came down the boiler shaft. Took a year to find the hatch."],
          ['hero', "You are bigger than your taps. And quieter."],
          ['fumi', "Fumi. I run the boilers up top. Every night, the heat in my pipes was you. I couldn't sleep warm after that."],
          ['hero', "Ashka. Not Sixty. You are the first in a year to hear it."],
          ['agent', "Unauthorised man in the Sump! Captain, bring the cold lances!"],
          ['fumi', "I keep it in, mostly. Not tonight."]],
        win: [
          ['fumi', "Give me time. Enough pressure in my pipes and that door comes off its hinges."],
          ['hero', "I have been patient for a year. I can be patient for a pressure gauge."],
          ['sys', "The vents roar. Fire is coming down them from somewhere far above, and it is not hers."]] },
      3: { zone: 'core', rival: 'pyra', goal: "Face the fire in the vents",
        meet: [
          ['sys', "A girl drops out of the vent in a fall of burning ash. The Burn Ward's fire came all the way down."],
          ['pyra', "Another furnace? Halcyon's got one down here too? I just burned theirs to the frame."],
          ['hero', "I am not their furnace. I am their prisoner. And you are on fire in my house."],
          ['pyra', "Everything's on fire. Let's find out which of us burns hotter."],
          ['hero', "Come, little spark. The core is patient."]],
        win: [
          ['pyra', "...Okay. You burn hotter. Nobody burns hotter. Who are you?"],
          ['hero', "Ashka. From the Frozen Harbour. They put me in here a year ago."],
          ['pyra', "Pyra. Harbour too. The blue forge. Six weeks in their Burn Ward. You did a year?"],
          ['hero', "A year. Sit with me, sister. The chain is long enough for two."]],
        lose: [
          ['pyra', "Too hot for you? Thought so. Get up, I'm not done."]] },
      4: { zone: 'core', goal: "Walk out of the Core Sump",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills come down the tunnels, and the Sky screams that a Deepliner gassed its labs."],
          ['hero', "I saw him. White hair, at my vents, opening them onto the labs. He stood in my glow and cast no shadow."],
          ['fumi', "Pressure's at the top of the gauge. Dyna's on the door."],
          ['dyna', "One door, four kilos, a lot of love. Stand back, Ashka. Or don't, actually. You'll be fine."],
          ['hero', "Blow it."]],
        win: [
          ['sys', "The Sump's door comes off, and Ashka walks out of the furnace for the first time in a year."],
          ['hero', "Deepline is cold without me. Good. Let it learn to keep warm without a prisoner."],
          ['sys', "In the Pit, Pell names the face that stood at her vents: Rue. Four banners climb the Spire, and Ashka climbs with them."],
          ['hero', "The first fire is for Halcyon. Show me their Engine."]],
        card: "Fumi and Dyna blow the Sump's door and Ashka walks free; Pell names Rue as the face at her vents, and Ashka climbs the Spire with four banners." },
      5: { zone: 'metro', foe: 'noct', goal: "Keep the Old Metro lit",
        intro: [
          ['sys', "A crown-ship fills the sky over the Crater. Vael is here with his champions, and every lamp in the Old Metro goes out."],
          ['vael', "Darkness first, then my Legion. The Underground was always going to be the easy one."],
          ['hero', "Easy? I am the bottom of everything. And I am still burning."]],
        meet: [
          ['noct', "...Light."],
          ['hero', "That teal. The night lamps of the Frozen Harbour were that colour. Were you ours, once?"],
          ['noct', "Once. Now I keep his dark. Go out."],
          ['hero', "I burned for a year so this place had heat and light. You do not get to put it out."]],
        win: [
          ['sys', "Ashka's glow fills the tunnel. In it, at last, there is nowhere the dark can stand."],
          ['hero', "There is your blade. In my light I can see where it is not."],
          ['sys', "Noct steps back into a fold of shadow and is gone, up to the crown-ship. The lamps come on one by one."],
          ['hero', "Run home to your Sovereign, watchman. The harbour deserved better than you."]],
        lose: [
          ['noct', "Lights out."]],
        card: "Vael's champion Noct cuts every light in the Old Metro; Ashka burns brighter than his dark and drives him back to the crown-ship." },
      6: { goal: "Burn the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers come together on the rim, and the Hollow Legion pours down."],
          ['convergence', "Subject 60. You heated my city for a year. Come back to the furnace."],
          ['hero', "I remember every day of that year. Every one. You have no idea how hot that makes me."]],
        meet: [
          ['itsuki', "Fire. I learned it first, on a world that burned. You burn the way that world did."],
          ['hero', "That world is gone. I am not. Stand aside, or melt."],
          ['itsuki', "I do not stand aside. Show me how hot."]],
        lose: [
          ['itsuki', "Fire was the first thing I learned. Again."]],
        win: [
          ['sys', "Itsuki falls. The Convergence tries to drain Ashka and cannot drink fast enough. It comes apart into light."],
          ['hero', "You drained me for a year, engine. You never learned how much there was."],
          ['sys', "Vael stands alone. Ashka pours a year of the Core Sump into his crown-ship, and it falls burning into the Crater."],
          ['sys', "The door to the Beyond slams shut and drags the Legion and every champion back through it. Itsuki goes last."],
          ['hero', "Deepline will be cold tonight. I will light it myself. Nobody pays for its heat in pain again."],
          ['hero', "The core burns hotter than you."]],
        card: "At the Crater Ashka outburns Itsuki, the Convergence and Vael; the crown-ship falls burning, and the door drags the Legion and every champion home." }
    },

    // ---------------------------------------------------------------- DYNA
    dyna: {
      1: { zone: 'works', goal: "Clear the Scrapworks, loudly",
        intro: [
          ['sys', "The Scrapworks. On Vharra she lit up the festival sky. In Deepline, every problem is a demolition job."],
          ['hero', "Problem: Halcyon's sent a collection crew for the girl who makes things go boom. Solution: boom."],
          ['agent', "Subject candidate, explosives. Approach with care. She's... lighting something."],
          ['hero', "Grenade, mine or rocket? Pick a favourite. You're getting all three."]],
        win: [
          ['hero', "Look at that crater. Look at the shape of it. That's a good one."],
          ['hero', "Halcyon wants my bombs in a jar? Tell them to send a bigger jar."]] },
      2: { zone: 'works', with: 'mako', goal: "Test the suit with Mako",
        meet: [
          ['mako', "You're the bomb girl. I've got a suit. I need something to put in the cannon."],
          ['hero', "A suit? I need someone who can stand next to my work without falling over. Can it take a blast?"],
          ['mako', "Got crushed under a crate once. I built it so nothing crushes me again. Try it."],
          ['hero', "Ooh. Okay. Hold still, big man."],
          ['mako', "...That tickled."],
          ['hero', "Partners. I make, you carry. And I'm riding on your shoulders."]],
        win: [
          ['mako', "Captain's down. Suit's fine. You fine?"],
          ['hero', "Never better. Hey, Mako. Fumi says there's a door under his boilers, with a woman locked in a furnace behind it."],
          ['hero', "It needs a lot of pressure and a really big bang. That's the door I want."]] },
      3: { zone: 'works', rival: 'jax', goal: "Show Jax a fuse",
        meet: [
          ['jax', "Came all the way down from Mile Zero. Folks up top say you've got no sense of timing."],
          ['hero', "And you're just a bomb with a slower fuse, cowboy. I offered to show you one."],
          ['jax', "Six shots. I count every one. You count anything?"],
          ['hero', "Three, two, one. That's all the counting a fuse needs."]],
        win: [
          ['jax', "...Huh. You knew exactly when every one of those was going off."],
          ['hero', "Timing's my whole art. You just can't hear it over your bell."],
          ['jax', "Drinks at the Long Bar, then. The water's always cold."],
          ['hero', "Deal. Don't let me near the stove."]],
        lose: [
          ['jax', "Six for six. That's timing, kid. Light another one."]] },
      4: { zone: 'core', goal: "Blow the Core Sump's door",
        intro: [
          ['sys', "The Strings Cut. Drills chew into Deepline, and everyone says the Sky sent them. A Subject called Nyra led them in."],
          ['citizen', "I saw her! Ice girl, right out front of the drills, waving them on!"],
          ['hero', "An ice girl from the Sky walking Halcyon's drills? Doesn't add up. Halcyon kept her in a tank."],
          ['fumi', "Whatever's true up there, Ashka's still down here. Pressure's at the top. The door, Dyna."],
          ['hero', "Biggest job of my life. Mako, hold the stairs. Everybody else, ears!"]],
        win: [
          ['sys', "Every valve in Fumi's pipes and every bomb Dyna owns go off at once. The Core Sump's door is gone."],
          ['ashka', "...You made that? That was beautiful."],
          ['hero', "Front row for every eruption you ever make. That's my fee."],
          ['sys', "In the Pit, Pell names the face that led the drills: Rue. Four banners climb the Spire, and Dyna brings the fuses."]],
        card: "Dyna and Fumi blow the Core Sump's door and free Ashka; at the Pit Pell names Rue, and four banners climb the Spire to the Director's Engine." },
      5: { zone: 'market', foe: 'rue', goal: "Blow the masks off Rue",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael comes through with his champions, and Rue sells herself to him for a crown."],
          ['citizen', "Vesna's selling the Market to the invaders! No, Ferra is! No, it's Kael, he's selling us out!"],
          ['hero', "Three faces, same sneer. That's Rue, with a new boss."]],
        meet: [
          ['rue', "Dyna. Bombs. I can do bombs. Watch. Better than you."],
          ['hero', "Copy the bomb all you like. You can't copy the timing. That bit's mine."],
          ['rue', "He gives me a crown. A crown is a face nobody can take off me. Your Market is the price."],
          ['hero', "This Market sold me my first fuse. Every face you put on, I'm going to blow it off."]],
        win: [
          ['sys', "The last mask burns away. Rook's clones pin the copies, and Pell's threads cut the rest."],
          ['rue', "Not mine. None of them were mine. ...He'll give me one."],
          ['sys', "Rue slips into the smoke and runs for the crown-ship."],
          ['hero', "Run, then. Three, two, one, and the Market's still standing."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Again?"]],
        card: "Rue sells herself to Vael and wears Deepline's leaders in the Neon Market; Dyna blows the masks off, and Rue runs for the crown-ship." },
      6: { goal: "Blow a hole in the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, the Legion pours down, and Mako wades in with Dyna on top."],
          ['hero', "That is a big crown. I have never blown up anything that big."],
          ['mako', "You've never had a reason that good."]],
        meet: [
          ['itsuki', "Fire, but small and many. Clever. It will not be enough."],
          ['hero', "Small and many and right on time, horns. Count with me. Three..."],
          ['itsuki', "I do not count. I finish."]],
        lose: [
          ['itsuki', "Your fuse was short. Light another."]],
        win: [
          ['sys', "Itsuki falls in a ring of smoke. The Convergence comes apart. Vael stands alone under his crown-ship."],
          ['vael', "Little firework. You think noise can scratch an empire?"],
          ['hero', "Not noise. Timing. Three, two, one."],
          ['sys', "Every bomb in Deepline goes off along the seam. The crown-ship falls into the Crater, and the door slams shut."],
          ['sys', "The door drags the Legion and every champion back through. Itsuki is the last to go."],
          ['hero', "Boom. That's art."]],
        card: "At the Crater Dyna beats Itsuki, the Convergence and Vael, and every bomb in Deepline drops the crown-ship; the door drags every champion home." }
    },

    // ---------------------------------------------------------------- BANDO
    bando: {
      1: { zone: 'docks', goal: "Hold Dockside Nine",
        intro: [
          ['sys', "Dockside Nine, the last wharf of the Drowned Line. Everything here is out of reach. Except to him."],
          ['hero', "Did I ever tell you about the kite? Festival day on Vharra, one little girl, one big tree..."],
          ['citizen', "Every day, Bando. Every single day. Also, Halcyon's at the end of the pier."],
          ['agent', "That's the stretchy one. Long reach, Subject material. Net him."],
          ['hero', "Net me? From over there? Buddy, over there is still my reach."]],
        win: [
          ['hero', "You came all the way down here to get punched from the other end of the dock."],
          ['citizen', "You're going to tell this one tomorrow too, aren't you."],
          ['hero', "Every day. Right after the kite."]] },
      2: { zone: 'docks', with: 'dyna', goal: "Reach through Dyna's holes",
        meet: [
          ['dyna', "Bando! Halcyon walled off the old cargo tunnel. Your crates are behind it. Want a hole?"],
          ['hero', "Always want a hole. You blow it, I reach through it."],
          ['dyna', "Usually on purpose. Stand back. Or stretch back."],
          ['hero', "Wait, look! A Paper Post kite, all the way down here. There's a note on it."],
          ['hero', "It's from Sora! The kite girl! She says Gale still owes me a kite. See? I told everyone I saved her."],
          ['dyna', "You've told everyone ten thousand times. Halcyon's coming through the hole. Reach, hero."]],
        win: [
          ['dyna', "Their captain flew a long way. You threw him?"],
          ['hero', "Reeled him in, then let go. Physics."],
          ['hero', "Write back to Sora for me, Dyna. Tell her the arm's still long."]] },
      3: { zone: 'docks', rival: 'tarek', goal: "Settle the reach with Tarek",
        meet: [
          ['tarek', "So this is Dockside Nine. You've been telling the Surface your reach is longer than mine."],
          ['hero', "Telling everyone. Every day. You came down to measure? I invited you. Bring a tape?"],
          ['tarek', "I brought a chain. No one escapes my reach."],
          ['hero', "Then let's see whose reach gets there first. In public. Everybody watching? Good."]],
        win: [
          ['citizen', "Bando by an arm! Literally an arm!"],
          ['tarek', "...Longer by a hand. One hand. I'll be back to measure again."],
          ['hero', "Come back any time. Bring the chain. I'll hang it on the dock as a trophy."]],
        lose: [
          ['tarek', "Reeled in, dockhand. Again, if you've got the arm for it."]] },
      4: { zone: 'pit', goal: "Reach Pell in the rafters",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills break into the Drowned Line, and the docks say the Sky's Nyra led them."],
          ['hero', "The Sky? The Sky's got nobody down here but a kite girl, and she writes nice letters. This stinks of Halcyon."],
          ['rook', "Pell's up in the Pit's rafters, pulling strings. Nobody can get up there."],
          ['hero', "Nobody? Rook, you know who you're talking to."]],
        win: [
          ['sys', "Bando's arm goes all the way up into the dark of the rafters, and comes down holding the end of every string."],
          ['hero', "Got 'em. Every string. Pell, you're dangling."],
          ['pell', "So I am. What a reach. Very well: the faces were Rue's. I taught her. Somebody tell the Crater."],
          ['sys', "Kiri flies the word to the Crater, Rue runs, and four banners climb the Spire. Bando's arm gets to the top first."]],
        card: "Bando reaches into the Pit's rafters and catches every one of Pell's strings; Pell names Rue, Rue runs, and four banners climb the Spire." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Hold back the flood",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael is here, and his champions come down into Deepline with the Legion behind them."],
          ['fumi', "Something made of slime is in the Waterworks, flooding the Drowned Line. Dockside Nine's going under."],
          ['hero', "My dock? Then I'll hold the water. Both arms."]],
        meet: [
          ['slick', "Hello! I'm Slick. Everybody steps in me. Today everybody goes under me."],
          ['hero', "Buddy, that's my dock you're drowning. Every crate, every kid who fishes off the end of it."],
          ['slick', "Long arms. Long arms can't hold water. Squish!"],
          ['hero', "Watch me."]],
        win: [
          ['sys', "Bando's arms close round the flood and hold it. Fumi's pumps and Nami's tide push the rest back."],
          ['hero', "Squash! And again! Out of my water, puddle!"],
          ['sys', "Slick splits into a hundred drops and slides up the shafts, back to the crown-ship. The water stops rising."],
          ['hero', "Dock's still there. Kids, you can tell this one tomorrow. I'll tell it first."]],
        lose: [
          ['slick', "Squash. Splash. Back together. Again?"]],
        card: "Vael's champion Slick floods the Waterworks to drown Dockside Nine; Bando holds the water with both arms until Slick runs for the crown-ship." },
      6: { goal: "Reach into the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers stand on the rim together, and the Hollow Legion pours down."],
          ['hero', "That's a long way up. Good thing I've got a long arm."],
          ['vael', "The arm of a dockhand, reaching for a throne."]],
        meet: [
          ['itsuki', "A long reach. On one of my worlds the mountains reached like that. They fell too."],
          ['hero', "Mountains don't tell stories. I do. Every day. You're going in the next one."],
          ['itsuki', "Then make it a short one."]],
        lose: [
          ['itsuki', "Long arm. Short fight. Again."]],
        win: [
          ['sys', "Itsuki goes down. The Convergence comes apart. Bando's arm goes up past the Legion, into the crown-ship's heart."],
          ['hero', "Got you, Sovereign! Reeled in!"],
          ['sys', "The crown-ship falls into the Crater. The door slams shut, and drags the Legion and every champion back. Itsuki last."],
          ['sys', "A kite snaps loose in the blast, and a small figure tumbles over the Crater."],
          ['hero', "Got you, Sora! That's twice! Everybody saw it, right? Twice!"],
          ['hero', "Long arm of Deepline!"]],
        card: "At the Crater Bando beats Itsuki, the Convergence and Vael, reels in the crown-ship, and catches Sora as the door drags every champion home." }
    },

    // ---------------------------------------------------------------- FERRA
    ferra: {
      1: { zone: 'yard', goal: "Defend the Crusher Yard",
        intro: [
          ['sys', "The Crusher Yard. Everything Aurelia throws away ends up here, and Ferra decides what is worth saving."],
          ['hero', "The night I was born, every tool on the smithy wall turned to face my cradle. Down here, all the junk does."],
          ['agent', "Crusher Yard. Seize the scrap stock, and the woman who moves it. She's on the list."],
          ['hero', "My Yard. My scrap. You're standing on fifty tonnes of it, and all of it listens to me."]],
        win: [
          ['hero', "Scrap is scrap. Halcyon is scrap. All of it goes in the press."],
          ['kael', "Ferra! I heard bangs! Did you need... oh. You didn't need."],
          ['hero', "Never do, Sparks. Go sort the copper. And stay out from under car doors."]] },
      2: { zone: 'shafts', with: 'garo', goal: "Meet Garo in the hidden tunnel",
        meet: [
          ['sys', "The tunnels no map shows. Steel goes up, food comes down. Tonight, Halcyon has found the tunnel."],
          ['garo', "You're Ferra. Nobody else's steel comes cut that clean."],
          ['hero', "And you're Garo. Your bread's too good for a smith. Years of trade, and I've never seen your face."],
          ['garo', "Never needed to. That's what the Pact was for."],
          ['hero', "Halcyon found our tunnel. Shame. For them."]],
        win: [
          ['garo', "That captain's armour is good iron. Wasteful to leave it."],
          ['hero', "Take it up. Make something with it. Steel up, food down, same as always."],
          ['garo', "Same as always. Except now I know whose face to thank."]] },
      3: { zone: 'yard', rival: 'vex', goal: "Settle pull and push with Vex",
        meet: [
          ['vex', "Ferra. Still sorting scrap into piles? Pull and push are one force. I proved it, across the tunnel."],
          ['hero', "You proved you can't take a lesson without arguing it. You left half-taught."],
          ['vex', "I left right. Opposites attract, teacher. Come and find out."],
          ['hero', "I never stopped watching your fights, boy. I know every bad habit you've got."]],
        win: [
          ['vex', "...You saw the Flux Flip coming."],
          ['hero', "I taught you the half you kept. You're good, Vex. Better than me at the other half."],
          ['vex', "Say that again. Louder."],
          ['hero', "Never. Go home to your yard. Come to mine for dinner some day."]],
        lose: [
          ['vex', "Pull and push. Same thing. Told you. Again, teacher?"]] },
      4: { zone: 'pit', goal: "Call Deepline's junk to arms",
        intro: [
          ['sys', "The Strings Cut. Down here they say the Sky's Nyra marched the drills in. Up there they say Kael gassed the labs."],
          ['hero', "Kael was in my Yard sorting copper that night. Somebody's selling faces."],
          ['vex', "Whoever it is, the drills are in the Pit. Pull or push?"],
          ['hero', "Both. Every bolt, every car door, every rusted rail in Deepline. Up!"]],
        win: [
          ['sys', "Every piece of junk in Deepline rises at Ferra's call, and comes down on Halcyon's drills."],
          ['hero', "Drills. Good steel. Wasted on Halcyon. I'll take it."],
          ['sys', "Pell, caught in his own Cradle, names the face: Rue. Four banners climb the Spire, and Ferra's scrap holds the stairs."],
          ['hero', "Told you, Sparks. Somebody was selling faces. Now up. I want the Director's steel."]],
        card: "Ferra calls every piece of Deepline's junk down on Halcyon's drills; Pell names Rue, and four banners climb the Spire to the Engine." },
      5: { zone: 'rootways', foe: 'hex', goal: "Hold the Roots against Hex",
        intro: [
          ['sys', "A crown-ship fills the sky. One of Vael's champions walks into the Roots, and the dead in Thorne's garden stand up."],
          ['thorne', "A girl made half of ghost is waking my guests. Ferra, I need iron between them and the living."],
          ['hero', "The Yard's right above your garden. If they walk, they walk into my people. Iron I've got."]],
        meet: [
          ['hex', "Scrap queen. Everything you throw hits once. Everything I throw hits twice."],
          ['hero', "Then I'll throw twice as much. I've got a whole yard of it."],
          ['vex', "And I've got the other half. Pull and push, teacher. Together, for once?"],
          ['hero', "For once. Don't tell anybody."]],
        win: [
          ['sys', "Ferra and Vex close a cage of floating iron round Hex. Her curses hit the bars twice, and the bars hold twice."],
          ['hex', "Heavy. Heavy twice. ...He'll want this garden later. I'll be back for it."],
          ['sys', "Hex drifts up through the iron like smoke, away to the crown-ship. Thorne puts his guests back to bed."],
          ['hero', "Vex. You were good. Just this once, I'll say it."]],
        lose: [
          ['hex', "Hit. And hit again. That's the curse, scrap queen."]],
        card: "Vael's champion Hex wakes the dead in the Roots under Ferra's Yard; Ferra and Vex cage her in iron until she flees to the crown-ship." },
      6: { goal: "Strip the Crown's metal",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, and the Legion pours out of a ship plated in eaten worlds."],
          ['hero', "That is the most scrap I have ever seen in one place."],
          ['vex', "Pull or push?"],
          ['hero', "Pull. All of it."]],
        meet: [
          ['itsuki', "Earth and iron. I learned earth from a mountain that did not move. Do you move?"],
          ['hero', "I'm a smith's daughter. Every tool on the wall turned to face me. You'll turn too."],
          ['itsuki', "Then turn me."]],
        lose: [
          ['itsuki', "Iron bends. Again."]],
        win: [
          ['sys', "Itsuki falls. The Convergence comes apart. Ferra pulls, Vex pushes, and the crown-ship's plating tears away in sheets."],
          ['hero', "Everything that gets thrown away ends up with me. That includes you, Sovereign."],
          ['sys', "The bare ship falls into the Crater. The door slams shut and drags the Legion and every champion back. Itsuki last."],
          ['vex', "A hundred worlds of iron, left on the rim. What do we do with all of it?"],
          ['hero', "Take it home. Sort it. Make something good. Same as always."],
          ['hero', "I'll recycle what's left."]],
        card: "At the Crater Ferra beats Itsuki and the Convergence, then strips the crown-ship's plating and drops it; the door drags every champion home." }
    },

    // ---------------------------------------------------------------- SEN
    sen: {
      1: { zone: 'dojo', goal: "Keep the Rust Dojo clean",
        intro: [
          ['sys', "The Rust Dojo, a metro car scrubbed until it shines. The cleanest room underground."],
          ['hero', "One line of ink. One falling leaf. My teacher on the steppe waited for me to see. I am still seeing."],
          ['agent', "The swordsman. Halcyon wants that technique catalogued. Take him intact."],
          ['hero', "Take off your boots."]],
        win: [
          ['sys', "Petals drift down. None of them touches the floor before the last man does."],
          ['hero', "Draw. Done."],
          ['hero', "Now the floor must be swept again."]] },
      2: { zone: 'dojo', with: 'sable', goal: "Teach Sable the Flash Step",
        meet: [
          ['sable', "Pell sold us. I ran. My Flash Step is fast. It isn't true. Teach me."],
          ['hero', "..."],
          ['sys', "A week passes. Sable sits. Sen sweeps. Neither speaks. On the eighth day, he lays down the broom."],
          ['hero', "You waited. Good. The step is not fast. It is finished before it begins."],
          ['sable', "...That's it?"],
          ['hero', "That is it. Halcyon has followed you here. Show me."]],
        win: [
          ['sable', "I was there before the captain swung."],
          ['hero', "Yes. Now you will always be there first."],
          ['sys', "A letter from the Archive lies on the mat. Isa writes three pages. Sen answers in one line."]] },
      3: { zone: 'metro', rival: 'pell', goal: "Stand between Pell and Sable",
        meet: [
          ['sys', "The Old Metro, outside the Rust Dojo. Pell walks down the platform, strings glinting, Halcyon's men behind him."],
          ['pell', "Swordsman. You have something of mine. A quiet girl with a fast step. The Director wants her back."],
          ['hero', "She is not yours. You sold her. Take off your boots, or turn around."],
          ['pell', "Strings against one sword? Very well. Show me what you have taught her."]],
        win: [
          ['pell', "...One line, and every string falls. You are as patient as they say."],
          ['hero', "You sold the students who trusted you. Sable stays."],
          ['pell', "Then keep her well. Better than I did."],
          ['sys', "Pell goes up into the dark on the last of his strings. Sen sweeps the platform."]],
        lose: [
          ['pell', "Patience, swordsman. You are not there yet. Again."]],
        card: "Pell comes to the Old Metro to take Sable back for the Director, and Sen stands between them with one sword." },
      4: { zone: 'pit', goal: "Cut one line through the Cradle",
        intro: [
          ['sys', "The Strings Cut. Drills in the tunnels, a stolen face on every rumour. In the Pit Arena, Pell's strings are everywhere."],
          ['sable', "Kael's face opened the vents. Nyra's face led the drills. Both faces were lies. The strings run here."],
          ['hero', "Then we do not chase the faces. We cut the hand."],
          ['rook', "There's a thousand strings, sensei. You've got one sword."],
          ['hero', "One line is enough."]],
        win: [
          ['sys', "One stroke. Every string from the rafters to the floor parts at once, and Pell's own Cradle closes on Pell."],
          ['pell', "One line through the Cat's Cradle. Twice now. ...Her name is Rue. I made her. Send that to the Crater."],
          ['sys', "Kiri carries the word to the Crater, and Rue runs. Four banners climb the Spire, and Sen climbs in silence."],
          ['hero', "You sold the student I took in. Sit. Be patient now."]],
        card: "Sen cuts one line through Pell's Cat's Cradle; Pell names Rue, Kiri flies the word to the Crater, and four banners climb the Spire." },
      5: { zone: 'metro', foe: 'noct', goal: "See the blade in the dark",
        intro: [
          ['sys', "A crown-ship fills the sky over the Crater. Vael sends a champion into the Old Metro, and every light goes out."],
          ['vael', "My watchman. Cut their lamps. Let them learn the dark."],
          ['hero', "My dojo is a metro car on this line. Sable sleeps in it. No."]],
        meet: [
          ['noct', "..."],
          ['hero', "A hilt with no blade. A swordsman who does not arrive. I have never met a cut I could not see."],
          ['noct', "The cut arrives. I do not."],
          ['hero', "Then I will see what is not there. One breath. Then the bell."]],
        win: [
          ['sys', "In the dark, Sen sees it at last: the blade that is not there. He draws once, and Noct's sleeve falls in two."],
          ['noct', "...You saw it."],
          ['hero', "There was no blade. I saw that."],
          ['sys', "Noct bows, very slightly, and is gone into the dark toward the crown-ship. The lamps of the Old Metro come back on."]],
        lose: [
          ['noct', "Not yet."]],
        card: "Vael's champion Noct puts out the Old Metro where Sen's dojo stands; Sen sees the blade that is not there, and Noct falls back to the crown-ship." },
      6: { goal: "One stroke for the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers stand on the rim as one, and the Hollow Legion pours down."],
          ['convergence', "A swordsman. One man with one blade, against the engine of three worlds."],
          ['hero', "One is enough."]],
        meet: [
          ['itsuki', "Wind and steel. I learned wind from a master who never drew twice. You are like him."],
          ['hero', "Then you know how this ends."],
          ['itsuki', "He drew once. So will you. Mine will be first."]],
        lose: [
          ['itsuki', "Faster than one breath. Again."]],
        win: [
          ['sys', "Itsuki falls. A line of violet light binds the Convergence to Vael, the last two engines fighting as one. Sen waits."],
          ['hero', "Three breaths. After the bell."],
          ['sys', "One stroke. The two engines come apart, and the crown-ship falls in two halves into the Crater."],
          ['sys', "The door slams shut and drags the Legion and every champion back. Itsuki goes last. Sen sheathes his sword."],
          ['hero', "Now the floor must be swept again."],
          ['hero', "One stroke. Enough."]],
        card: "At the Crater Sen beats Itsuki, then cuts the Convergence and Vael apart in one stroke; the crown-ship falls and the door drags every champion home." }
    },

    // ---------------------------------------------------------------- ROOK
    rook: {
      1: { zone: 'slums', goal: "Never fight alone in the Slums",
        intro: [
          ['sys', "The Deepline Slums. Rook never fights alone. Not even when he is alone."],
          ['hero', "Lantern Cell, loudest member, reporting! Also second loudest. Also third. Twin Rush!"],
          ['agent', "Hidden Clans brat. The one who held the door. Collect him this time."],
          ['hero', "You want the real one? Good luck. Some days I can't tell either."]],
        win: [
          ['hero', "Count 'em. One of me beat all of you. Well. Six of me. Same thing."],
          ['kael', "Rook! You started without me?"],
          ['hero', "Never without you, brother. I just started with me."]] },
      2: { zone: 'slums', with: 'kael', goal: "Hold the Slums with Kael",
        meet: [
          ['kael', "Rook. Halcyon's building a cage on the stairs. Big one."],
          ['hero', "For us? Flattering. Hey, Kiri's crane came down the Stacks. She says a Subject in the Sky can see Husks."],
          ['kael', "Kiri's the paper one? There's two of her?"],
          ['hero', "Two of her. The only person who gets it. Anyway. You, me, all of me. Brothers?"],
          ['kael', "Always. Out of the trash."],
          ['hero', "Into the cage! ...No, wait. Other way."]],
        win: [
          ['kael', "That captain had a key on his belt. Halcyon key."],
          ['hero', "Pell had a key once. A key to the Engine. He paid for it with us."],
          ['kael', "Then we'll make him give the change back."]] },
      3: { zone: 'pit', rival: 'pell', goal: "Face Pell at the Pit Arena",
        meet: [
          ['pell', "Rook. My best student. You've come to the Pit at last."],
          ['hero', "You taught me the clones. Then you sold the Cell for a key. My clones held that door till they were smoke."],
          ['pell', "And you came out of the smoke behind them. I was so proud. Truly."],
          ['hero', "Don't be proud. Be scared. There's always more of me."]],
        win: [
          ['pell', "...More of you than I counted. That was always your trick."],
          ['hero', "Not a trick. Friends. You never had any. Where's the key, Pell?"],
          ['pell', "Somewhere the Director cannot find it. Another day, Rook."],
          ['sys', "The strings pull him up into the rafters, and he is gone."]],
        lose: [
          ['pell', "Strings beat clones, Rook. Did I not teach you that? Again."]] },
      4: { zone: 'pit', goal: "Hold the Pit while the net closes",
        intro: [
          ['sys', "The Strings Cut. Up top they say Kael gassed the labs. Down here they say the Sky's Nyra brought the drills."],
          ['hero', "Kael was asleep on my floor! Snoring! I have witnesses! Mostly me!"],
          ['sable', "Faces lie. Pell's strings don't. We close the Cradle on him tonight."],
          ['moro', "You hold the Pit. All of you. We do the rest."],
          ['hero', "A thousand Rooks it is."]],
        win: [
          ['sys', "A thousand Rooks hold the Pit. Sable and Moro pull the last thread, and Pell's own Cat's Cradle closes on him."],
          ['pell', "Caught by my own lesson. ...Hold it tight, Rook. I'm not going to struggle."],
          ['hero', "Why not?"],
          ['pell', "Because the face that started this war was mine to teach. Her name is Rue. Somebody tell the Crater."]],
        card: "A thousand Rooks hold the Pit while Sable and Moro close Pell's own Cradle on him, and Pell names Rue; four banners climb the Spire." },
      5: { zone: 'market', foe: 'rue', goal: "Out-clone Rue at the Market",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael is here, and Rue has sold herself to him for a crown."],
          ['hero', "Vesna's on two corners. Ferra's on three. Kael's on the roof AND in the fountain. That's Rue."]],
        meet: [
          ['rue', "Rook. I copied your clones once. Remember? Far too many of you."],
          ['hero', "Remember? That was my best week. So who are you working for now?"],
          ['rue', "Someone who gives me a crown, not strings. A thousand of you, all mine, all his."],
          ['hero', "You copied my clones. You can't copy my friends. And I've got more of those too."]],
        win: [
          ['sys', "Rooks pin every face in the Market. Only one has no reflection in the puddles: the real Rue."],
          ['hero', "Found you. Dyna! Pell! Now!"],
          ['sys', "Dyna's blast tears the masks off, and Pell's threads cut the copies. Rue runs for the crown-ship with no face at all."],
          ['hero', "Too many of us. Even for you. Tell your new boss we're coming."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Want to see your clones again?"]],
        card: "Rue sells herself to Vael and wears every leader in the Neon Market; Rook's clones find the one with no reflection, and she runs for the crown-ship." },
      6: { goal: "Hold the Legion at the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, and the Legion pours down, more than anyone can count."],
          ['hero', "More than anyone can count? Cool. I can count too."],
          ['kael', "Rook. Hold the rim?"],
          ['hero', "Hold it? I'm going to fill it."]],
        meet: [
          ['itsuki', "A thousand of you. It does not matter how many. Only which one is real."],
          ['hero', "That's the trick. They're all real. Every one of them's somebody's friend."],
          ['itsuki', "Then I will beat every one."]],
        lose: [
          ['itsuki', "A thousand. And none left. Again."]],
        win: [
          ['sys', "A Thousand Rooks pile onto Itsuki until he falls. The Convergence comes apart under the rest of them."],
          ['hero', "Vael! Over here! No, here! No, HERE!"],
          ['sys', "The real Rook's fist goes through the crown-ship. It falls into the Crater, and the door slams shut."],
          ['sys', "The Legion and every champion are dragged back through. Itsuki goes last. Kael, Sable and Moro are still standing."],
          ['hero', "Nobody fought alone. Not one of us."],
          ['hero', "There's always more of me!"]],
        card: "At the Crater a thousand Rooks beat Itsuki and the Convergence, and the real one drops Vael's crown-ship; the door drags every champion home." }
    },

    // ---------------------------------------------------------------- SABLE
    sable: {
      1: { zone: 'slums', goal: "Strike first in the Slums",
        intro: [
          ['sys', "The Deepline Slums, under the Skylift's roots. Quiet. Then the air starts to hum."],
          ['agent', "Lantern Cell runaway. The quiet one. Take her before she does anything."],
          ['hero', "..."],
          ['sys', "It is already over for the first man. The rest have not noticed yet."]],
        win: [
          ['hero', "Static has to go somewhere."],
          ['hero', "Pell sold us for a key. Every hand he hired, I go through. Then him."]] },
      2: { zone: 'dojo', with: 'sen', goal: "Earn one lesson from Sen",
        meet: [
          ['hero', "Sen. Pell sold the Cell. I ran. My Flash Step is fast. It isn't true. Teach me."],
          ['sen', "..."],
          ['sys', "A week of silence. She sits. He sweeps. On the eighth day, he lays down the broom."],
          ['sen', "The step is finished before it begins. Be there first. Then arrive."],
          ['hero', "...Worth a week."]],
        win: [
          ['sen', "You were there before the captain's hand moved."],
          ['hero', "I was. Thank you, sensei. The real kind."],
          ['sen', "Go. Run at him, if you must. Run well."]] },
      3: { zone: 'slums', rival: 'kael', goal: "One thunder in Deepline",
        meet: [
          ['kael', "Hey! Quiet girl! You're the one with the purple lightning!"],
          ['hero', "And you throw yours everywhere. Loudly. At everything. Deepline has one thunder too many."],
          ['kael', "Agreed. Yours."],
          ['hero', "In public, then. Whoever is still standing keeps the sky."]],
        win: [
          ['kael', "Okay! Okay. You're fast. Like, actually fast."],
          ['hero', "You're loud. Like, actually loud. ...You're not bad."],
          ['kael', "So who keeps the thunder?"],
          ['hero', "We keep working it out. In public."]],
        lose: [
          ['kael', "Out of the trash, into the storm! Again? I love this!"]] },
      4: { zone: 'pit', goal: "Catch Pell at last",
        intro: [
          ['sys', "The Strings Cut. A face like Kael's opened the vents on the labs. A face like Nyra's led the drills down. Deepline burns."],
          ['hero', "The fake Kael was quiet. The air didn't hum. Kael is never quiet."],
          ['moro', "Pell's in the Pit. Rook will hold the floor."],
          ['hero', "I have run at him since the day he sold us. Tonight I arrive."]],
        win: [
          ['sys', "Flash Step. She is at the last string before Pell knows where she went. The Cradle closes."],
          ['pell', "The quiet one. I should have watched the quiet one. ...Her name is Rue. Tell the Crater."],
          ['hero', "You should have. Rook held the door for us. ...Thank you, Rook."],
          ['rook', "Wait. Was that a thank-you? Moro! She thanked me!"]],
        card: "Sable's Flash Step reaches Pell's last string and the Cradle closes; Pell names Rue, and four banners climb the Spire to the Engine." },
      5: { zone: 'metro', foe: 'noct', goal: "Outrun the dark to Noct",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael's champion walks into the Old Metro, and the lamps die one by one."],
          ['hero', "Sen's dojo is down this line. Dark. Fine. Lightning brings its own."]],
        meet: [
          ['noct', "Lightning. I cut the light. You will not see me."],
          ['hero', "I don't need to see you. I need to be there first."],
          ['noct', "Then be there."]],
        win: [
          ['sys', "A violet flash in the black, faster than his cut. For one instant, the Old Metro is bright as noon."],
          ['hero', "There. I arrived."],
          ['sys', "Caught in the light, Noct steps back into the last shadow and is gone, up to the crown-ship."],
          ['hero', "Sen. Your dojo's still standing. The lamps can come back on."]],
        lose: [
          ['noct', "The cut arrived. You did not."]],
        card: "Vael's champion Noct cuts the lights on the line where Sen's dojo stands; Sable's lightning arrives first, and Noct falls back to the crown-ship." },
      6: { goal: "Bring the storm to the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, and Kael's lightning goes up first, loud as ever."],
          ['kael', "Sable! One thunder too many, remember?"],
          ['hero', "Today, two isn't enough. Move over."]],
        meet: [
          ['itsuki', "Thunder again. The loud boy held me longest of all. Are you faster?"],
          ['hero', "I'm there before you finish asking."],
          ['itsuki', "Show me."]],
        lose: [
          ['itsuki', "Fast. Not first. Again."]],
        win: [
          ['sys', "Itsuki falls. The Convergence comes apart. Amber thunder and violet thunder go up into Vael together."],
          ['kael', "Sable! Last one's yours!"],
          ['sys', "Flash Step. Sable is at the heart of the crown-ship before Vael turns. It falls into the Crater, and the door slams."],
          ['sys', "The door drags the Legion and every champion back through it. Itsuki is the last to go."],
          ['hero', "Pell sold us. Halcyon caught us. Nobody holds us now."],
          ['hero', "My hand is the storm."]],
        card: "At the Crater Sable beats Itsuki, then her Flash Step reaches the heart of Vael's crown-ship first; it falls, and the door drags every champion home." }
    },

    // ---------------------------------------------------------------- MORO
    moro: {
      1: { zone: 'metro', goal: "Keep the Old Metro quiet",
        intro: [
          ['sys', "The Old Metro, in the dark between the station lamps. Moro would rather not fight at all."],
          ['hero', "I was asleep. It was a very good sleep."],
          ['agent', "The sleepy one from the Lantern Cell. He ran with the girl. Wake him up."],
          ['hero', "Fine. I'm very good at making it short."]],
        win: [
          ['hero', "Shadow Snare. Hold still. There. Everyone's resting now."],
          ['hero', "Pell taught us shadows are for hiding. He was wrong. They're for holding."]] },
      2: { zone: 'slums', with: 'rook', goal: "Carry the Cell with Rook",
        meet: [
          ['rook', "Moro! Moro moro moro. You awake? Halcyon's in the Slums. We need you."],
          ['hero', "I'm awake. Mostly. You've been extra loud all week. What's wrong?"],
          ['rook', "Nothing's wrong! Why would anything be wrong?"],
          ['hero', "Because the door you held is still burning in your head. I know. I'll carry it. You keep being loud."],
          ['sable', "Stop talking. Captain's coming."]],
        win: [
          ['rook', "...Thanks. For the carrying thing."],
          ['hero', "Didn't hear you. You weren't loud enough."],
          ['sable', "The Cell's still a Cell."]] },
      3: { zone: 'ward', rival: 'vesper', goal: "Catch Vesper on the Night roofs",
        meet: [
          ['sys', "The Night Ward roofs, Aurelia. Moro came up through his own shadow after a red scarf that keeps walking through it."],
          ['vesper', "You followed me up. That's new. Usually you just sigh."],
          ['hero', "You walk through my shadows like they're doors. Every night. It's rude."],
          ['vesper', "Shadows are for walking through. Everyone knows that."],
          ['hero', "Shadows are for holding. I'll show you."]],
        win: [
          ['vesper', "...You held me. In my own shadow. All right. That's a good trick."],
          ['hero', "Knock next time."],
          ['vesper', "On a shadow?"],
          ['hero', "Find a way."]],
        lose: [
          ['vesper', "You never saw me. Again?"]] },
      4: { zone: 'pit', goal: "Hold the Pit with shadows",
        intro: [
          ['sys', "The Strings Cut. Deepline thinks the Sky sent the drills. The Sky thinks Deepline gassed its labs."],
          ['hero', "Nyra's face led the drills. Her shadow didn't move with her. Shadows don't lie. Faces do."],
          ['sable', "Pell's in the rafters. Rook holds the floor. You?"],
          ['hero', "I hold everything else."]],
        win: [
          ['sys', "Moro's shadows hold the drill crews still across the whole Pit. Not hidden. Held."],
          ['pell', "You turned my lesson inside out. Shadows that hold, not hide. ...The faces were Rue's. Tell the Crater."],
          ['hero', "You taught it wrong. I fixed it. Sit still, sensei."],
          ['sys', "Kiri flies the word to the Crater, Rue runs, and four banners climb the Spire. Moro climbs too, yawning."]],
        card: "Moro's shadows hold the drill crews still across the Pit while Pell is caught and names Rue; four banners climb the Spire." },
      5: { zone: 'platform', foe: 'orin', goal: "Hold Orin's doors at Platform Zero",
        intro: [
          ['sys', "A crown-ship fills the sky. At Platform Zero, the oldest stop in Deepline, doors open in the air and the Legion walks out."],
          ['hero', "I put the Slums' little ones to sleep down here when the drills came. Deepest stop. Safest stop."],
          ['hero', "Was. Okay. I'm awake now."]],
        meet: [
          ['orin', "Shadow-keeper. Every wall here is a door to me. Every door is his now."],
          ['hero', "You're opening doors into a room full of sleeping kids. That's rude."],
          ['orin', "Rude? Then shut them. If you can."],
          ['hero', "I can't shut doors. I can hold whoever walks through them."]],
        win: [
          ['sys', "Moro's shadows close on every doorway at once. Nothing walks through. Not even Orin."],
          ['orin', "...Held. In a shadow. That's new. Wrong door, then."],
          ['sys', "Orin steps back through the last door and is gone to the crown-ship. The doors close behind him."],
          ['hero', "There. Back to sleep, everybody. Nobody comes through while I'm here."]],
        lose: [
          ['orin', "Wrong door, shadow-keeper. Again?"]],
        card: "Vael's champion Orin opens doors for the Legion at Platform Zero, where the Slums' children sleep; Moro's shadows hold every door shut." },
      6: { goal: "Lay the Legion down",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim. The Legion marches down, emptied out of a thousand eaten worlds."],
          ['hero', "They've been marching longer than our world has been here. Somebody should let them stop."]],
        meet: [
          ['itsuki', "Shadow. On no world did I learn shadow. It was never worth learning."],
          ['hero', "It holds. That's all it does. Want to find out?"],
          ['itsuki', "Hold me, then. For as long as you can."]],
        lose: [
          ['itsuki', "Not long enough. Again."]],
        win: [
          ['sys', "Itsuki falls in the snare. The Convergence comes apart. Moro's shadow climbs the crown-ship and holds Vael still."],
          ['hero', "Shadow Snare. Hold still, Sovereign. There. Now rest."],
          ['sys', "The last blow lands. The crown-ship falls into the Crater, and the door to the Beyond slams shut."],
          ['sys', "It drags the Legion and every champion back through. Itsuki goes last. Moro's shadows spread over the rim like a blanket."],
          ['hero', "Nobody is going to make anyone march again. Go to sleep, everybody."],
          ['hero', "The long night begins."]],
        card: "At the Crater Moro snares Itsuki, the Convergence and Vael; the crown-ship falls, the door drags the Legion home, and Moro lets the rim sleep." }
    },

    // ---------------------------------------------------------------- PELL
    pell: {
      1: { zone: 'pit', goal: "Hold court at the Pit Arena",
        intro: [
          ['sys', "The Pit Arena. Pell, sensei of the Lantern Cell. For ten years, also the Director's spymaster."],
          ['director', "Pell. Your report is late. I am sending a squad to see whether your strings have gone slack."],
          ['hero', "Director, you wound me. Send them in. I'll make them dance."],
          ['hero', "Balance, always balance. Three layers on three strings. Someone must hold them."]],
        win: [
          ['hero', "Do tell the Director his testers were wonderful. Wooden, but wonderful."],
          ['director', "Noted. Keep the layers apart, Pell. Keep them away from my Engine."],
          ['hero', "Of course. Balance."]] },
      2: { zone: 'blank', with: 'rue', goal: "Bring Rue out of the Blank Wing",
        meet: [
          ['sys', "The Blank Wing, Aurelia. A room with no shadows. In one cell, a shape with no face."],
          ['hero', "Hello, little nothing. They tell me you copy whatever you see."],
          ['rue', "..."],
          ['hero', "Then see me. Watch my hand. Now yours. ...Yes. Oh, yes. You'll wear any face you like."],
          ['rue', "...Any face. Whose?"],
          ['hero', "Whoever is useful. Come along. The guards weren't told."]],
        win: [
          ['rue', "Their captain. I wore his face. They opened the door for me."],
          ['hero', "Beautiful. My finest pupil, and I've only had you an hour."],
          ['sys', "He never once asks her what her own face looks like."]] },
      3: { zone: 'pit', rival: 'rook', goal: "Teach Rook one last lesson",
        meet: [
          ['rook', "Pell! You sold us. The whole Cell. For a key. I'm here to collect."],
          ['hero', "Rook. My best student. Always the loudest, and the most loyal. Such a waste."],
          ['rook', "Waste this. Twin Rush!"],
          ['hero', "Strings beat clones, dear boy. Let me remind you."]],
        win: [
          ['rook', "...Still. Not. Done. There's always more of me."],
          ['hero', "There always was. I counted wrong, all those years ago. I'm sorry for that."],
          ['hero', "No. I'm not allowed to be sorry. Another day, Rook."]],
        lose: [
          ['rook', "That one's for the door. Get up. The next one's just for me."]] },
      4: { zone: 'pit', goal: "Let the strings be cut",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills break into Deepline. Rue walked them in wearing Nyra's face, as Pell taught her."],
          ['director', "Splendid. Each layer blames the other. Hold the Pit, Pell, while the drills go deep."],
          ['hero', "I taught her that face. I taught her Kael's. I told myself it was balance."],
          ['hero', "Your drills are killing Deepliners, Director. That was never balance. Your men will have to go through me."]],
        win: [
          ['sys', "The Lantern Cell closes his own Cat's Cradle around him. He could slip it. He does not."],
          ['rook', "Got you! ...You could get out of that. Why aren't you?"],
          ['hero', "Because, for once, the strings are in the right hands. Her name is Rue. I taught her. Kiri, fly that to the Crater."],
          ['sys', "Kiri flies it to the Crater, and Rue runs. Four banners climb the Spire, and they take Pell with them, still tied."]],
        card: "Pell lets the Lantern Cell close his own Cradle on him and names Rue; Kiri flies the word to the Crater, and four banners climb the Spire." },
      5: { zone: 'market', foe: 'rue', goal: "Face the pupil you made",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael is here with his champions, and Rue goes to him and sells herself for a crown."],
          ['citizen', "Vesna's selling us! Ferra's selling us! Pell's... no, Pell's tied up. Who's selling us?"],
          ['hero', "My pupil, wearing their faces. Untie me, Rook. This one is mine to answer for."]],
        meet: [
          ['rue', "Sensei. He gives me a crown. A crown is a face nobody can take off. You only gave me other people's."],
          ['hero', "I gave you everyone's face but yours. I never asked for it. I'm asking now."],
          ['rue', "I don't have one. He doesn't ask. He just gives."],
          ['hero', "He gives a crown with nothing inside it. You'll fit it perfectly. That is what frightens me."]],
        win: [
          ['sys', "Pell's threads go out one last time, and every copy in the Market falls with its strings cut."],
          ['rue', "...You still win. You always win. Then I go to someone who lets me."],
          ['sys', "Rue runs through the Legion for the crown-ship, wearing nobody's face at all."],
          ['hero', "My finest work, and I made her for the wrong master twice. No more strings. Not for anyone."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Your strings, sensei."]],
        card: "Rue sells herself to Vael for a crown and wears Deepline's leaders in the Neon Market; Pell faces the pupil he made, and she runs to her new master." },
      6: { goal: "Cut the Crown's chains",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, and Vael's chains lower the Legion down."],
          ['vael', "Strings, little puppeteer. You understand. Whole worlds, on my chains."],
          ['hero', "I understand better than anyone. That's why I know exactly where to cut."]],
        meet: [
          ['itsuki', "The spymaster. You tied a world to strings. I only break things. Which of us is worse?"],
          ['hero', "Oh, me. Without question. Which is why I refuse to lose to an honest man."],
          ['itsuki', "Then lose to a strong one."]],
        lose: [
          ['itsuki', "Strings cut. Again."]],
        win: [
          ['sys', "Itsuki falls, tangled. The Convergence comes apart. Pell's threads find every link of Vael's chains."],
          ['hero', "Whole worlds on strings, Sovereign. And you never once asked any of them for their faces."],
          ['sys', "Pell cuts the last chain. The crown-ship falls into the Crater, and the door to the Beyond slams shut."],
          ['sys', "It drags the Legion and every champion back through. Rue goes without a face. Itsuki goes last."],
          ['hero', "You danced beautifully."]],
        card: "At the Crater Pell beats Itsuki and the Convergence, then cuts Vael's chains; the crown-ship falls and the door drags every champion home, Rue too." }
    },

    // ---------------------------------------------------------------- THORNE
    thorne: {
      1: { zone: 'rootways', goal: "Tend the garden of bone",
        intro: [
          ['sys', "The catacombs under the oldest part of Deepline. The dead of the Ashfall War lie here, in a garden."],
          ['hero', "Good evening. Do mind the borders. The ribs are flowering this year."],
          ['agent', "Halcyon survey. Bone stock for the Engine's filters. Clear the catacombs."],
          ['hero', "My guests are resting. Shall I show you to a bed of your own?"]],
        win: [
          ['hero', "Lovely. They'll take root by spring."],
          ['hero', "Now, a note to Ume. Her pollen made the whole garden sneeze for a week. I must thank her properly."]] },
      2: { zone: 'heartroot', with: 'vesna', goal: "Keep Sunday tea with Vesna",
        meet: [
          ['vesna', "Thorne. It's Sunday. I brought the cups, and a page of the Ledger I can't stop reading."],
          ['hero', "And I the tea. Halcyon's page, I imagine. It does look heavy."],
          ['vesna', "Longer every week. Today they've sent men down your stair to read the rest of it."],
          ['hero', "Then we'll finish our tea after. The dead keep their own accounts. Let me help you with the living."],
          ['agent', "The Ledger woman and the grave man. Take the book, and the bones."],
          ['hero', "During tea. How very rude."]],
        win: [
          ['vesna', "Their captain owed me money. He's settled up."],
          ['hero', "And now he owes me a bed. Lovely. More tea?"],
          ['vesna', "Always. And no, I'm not charging you. I never will. Don't tell anyone."]],
        card: "Halcyon sends men down the stair in the middle of Sunday tea, and Thorne and Vesna defend the catacombs together." },
      3: { zone: 'rootways', rival: 'ume', goal: "Duel Ume among the bones",
        meet: [
          ['ume', "Thorne. I came down to see your famous garden. Your cuttings arrive every spring, very polite."],
          ['hero', "And your pollen arrives every spring, very effective. The whole catacomb sneezed for a week."],
          ['ume', "Beautiful, isn't it? Deadly too. Shall we see whose garden wins?"],
          ['hero', "Cuttings against pollen. How delightful."]],
        win: [
          ['ume', "Your bones bite back. I didn't expect that."],
          ['hero', "Nor I your spores. My compliments, Ume. Take a cutting home."],
          ['ume', "I'll send pollen."],
          ['hero', "Please don't."]],
        lose: [
          ['ume', "Something in your garden is blooming. Oh dear. It's you."]] },
      4: { zone: 'pit', goal: "Raise the dead for the living",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills crack the catacomb walls and pour their crews into Deepline."],
          ['vesna', "They say the Sky's Nyra marched them in. I don't believe a word. The Ledger says Halcyon."],
          ['hero', "Faces are cheap. Bones don't lie. My guests heard the drills, and they would like a word."],
          ['hero', "Rise, please. The living half of Deepline needs the dead half."]],
        win: [
          ['sys', "The dead half of Deepline stands up for the living half, and walks Halcyon's crews out of the tunnels."],
          ['hero', "Thank you, everyone. Back to bed now."],
          ['vesna', "Nicely done. And the Pit says Pell has named the face: Rue. The banners are going up the Spire."],
          ['hero', "Then I shall come too. The Director has filled a great many graves. He may see one."]],
        card: "Thorne raises the dead of the Ashfall War to walk Halcyon's crews out of the tunnels; Pell names Rue, and four banners climb the Spire." },
      5: { zone: 'rootways', foe: 'hex', goal: "Put the dead back to sleep",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael sends a champion into the Roots, and Thorne's guests begin to walk."],
          ['hero', "My guests are walking. Every one of them. That is not polite."]],
        meet: [
          ['hex', "Gardener. Where I come from, everything happens twice. Your dead died once. Now they get to walk again."],
          ['hero', "They died in the Ashfall War. They have earned their beds. Who are you, to wake them?"],
          ['hex', "Hex. My world ended twice. He says yours will too."],
          ['hero', "Then you are welcome in my garden as a guest, young lady. Never as a gardener."]],
        win: [
          ['sys', "One by one, Thorne lays the walking dead back down. Then his bone cuttings close round Hex."],
          ['hex', "Your bones bite. Twice. ...This garden would have been nice to keep."],
          ['sys', "Hex goes up through the roots like ghost light, back to the crown-ship. The garden is quiet again."],
          ['hero', "Hush now, everyone. It's Sunday."]],
        lose: [
          ['hex', "Hit, and hit again. Your guests are mine now."]],
        card: "Vael's champion Hex wakes the dead in Thorne's garden; Thorne lays his guests back down one by one, and Hex flees to the crown-ship." },
      6: { goal: "Bury the Hollow Legion",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, and the Legion pours down, emptied out of a thousand worlds."],
          ['hero', "Oh, the poor things. Nobody ever buried a single one of them."],
          ['vesna', "Thorne. We can't fight all of them."],
          ['hero', "We don't need to fight them. We need to make room."]],
        meet: [
          ['itsuki', "Old man. You raise the dead. On one world I saw that done, and the dead won."],
          ['hero', "Then you saw it done badly. My guests are very well behaved."],
          ['itsuki', "Then bring them. I will put them back."]],
        lose: [
          ['itsuki', "Rest, old man. Then rise."]],
        win: [
          ['sys', "Itsuki falls. The Convergence comes apart. The dead of the Ashfall War climb the crown-ship, and Thorne walks with them."],
          ['hero', "Sovereign. You have made so many graves and never dug one. Allow me."],
          ['sys', "The last blow lands. The crown-ship falls into the Crater, and the door to the Beyond slams shut behind it."],
          ['sys', "It drags the Legion and every champion back through. Itsuki goes last. The Crater is very quiet."],
          ['hero', "There's room under Deepline for everyone who stays. Beds of bone, and flowers. And quiet."],
          ['hero', "Welcome to my garden."]],
        card: "At the Crater Thorne beats Itsuki, the Convergence and Vael, and digs the crown-ship a grave; the door drags the Legion and every champion home." }
    },

    // ---------------------------------------------------------------- VEX
    vex: {
      1: { zone: 'yard', goal: "Defend the yard across the tunnel",
        intro: [
          ['sys', "The yard across the tunnel from Ferra's. Smaller. Vex's own. Bought with Vesna's money."],
          ['hero', "Pull and push. One force, pointed two ways. Ferra never got it. That's why I've got my own yard."],
          ['agent', "Magnet boy. The Director wants that trick. Take him, and the scrap."],
          ['hero', "Opposites attract. Come closer. ...Now go away."]],
        win: [
          ['hero', "Repel, Attract, Flux Flip. That's a full lesson. No charge."],
          ['citizen', "Vesna's runner is at the gate. She says the interest is due."],
          ['hero', "...Charge pending."]] },
      2: { zone: 'docks', with: 'mako', goal: "Tune Mako's magnets",
        meet: [
          ['mako', "Vex. Suit's pulling left. Magnets need tuning."],
          ['hero', "Your magnets always need tuning. You build too fast. Hold still, let me feel the field."],
          ['mako', "You talk too much about polarity."],
          ['hero', "You're the only friend I kept from the Yard. I talk about polarity because you let me."],
          ['mako', "Halcyon's on the dock."],
          ['hero', "Good. Field test."]],
        win: [
          ['mako', "Suit pulls straight now. Thanks."],
          ['hero', "Ferra built most of it. I made it work. Don't tell her I said the first part."],
          ['mako', "I'll tell her both parts."]] },
      3: { zone: 'yard', rival: 'ferra', goal: "Prove pull and push to Ferra",
        meet: [
          ['ferra', "Vex. You came back into my Yard. Bold."],
          ['hero', "Came to show you. Pull and push are the same thing. I built a whole yard proving it."],
          ['ferra', "A yard you borrowed from Vesna. I watch your fights, boy. Your Flux Flip leaves you open."],
          ['hero', "You watch my fights? ...Then watch this one up close."]],
        win: [
          ['ferra', "...All right. One force, two ways. You might be right."],
          ['hero', "Say that again."],
          ['ferra', "Never. You fought well. Come to dinner some time."],
          ['hero', "...Maybe. If you cook on my half of the scrap."]],
        lose: [
          ['ferra', "Push without pull. Still. Again, apprentice."]] },
      4: { zone: 'pit', goal: "Pay the Ledger in iron",
        intro: [
          ['sys', "The Strings Cut. They say the Sky's Nyra walked Halcyon's drills into the tunnels. Vex doesn't care whose face it was."],
          ['vesna', "Vex, darling. The Red Ledger is calling in every debt tonight. Yours is the size of a yard."],
          ['hero', "I don't have it. You know I don't have it."],
          ['vesna', "Then pay in iron. Every drill in that Pit. Pull them apart."]],
        win: [
          ['sys', "Halcyon's drills fly apart in the Pit. Their steel comes to Vex's hands, and stays."],
          ['hero', "That's the yard paid off. Interest included."],
          ['vesna', "Not in full. But a very good month. Now come, darling: Pell named the face, Rue, and the banners are going up the Spire."]],
        card: "Vesna calls in Vex's debt, and he pays it by tearing Halcyon's drills apart in the Pit; Pell names Rue, and four banners climb the Spire." },
      5: { zone: 'rootways', foe: 'hex', goal: "Push back a curse that hits twice",
        intro: [
          ['sys', "A crown-ship fills the sky. A ghost-girl of Vael's walks into the Roots, and the dead start walking up toward the Yards."],
          ['ferra', "Vex. I need your half."],
          ['hero', "You're asking? Out loud? Fine. Pull and push. Together."]],
        meet: [
          ['hex', "Magnet boy. Everything you push comes back once. Everything I curse comes back twice."],
          ['hero', "Then I'll push twice, and pull twice. My yard's up there. Nothing dead walks into it."],
          ['hex', "Show me."]],
        win: [
          ['sys', "Vex pulls every curse onto the iron and throws it away twice. Ferra holds the cage shut."],
          ['hex', "Twice, and twice back. That isn't fair. I'm telling him."],
          ['sys', "Hex drifts out through the bars and away to the crown-ship. Thorne puts his dead back to bed."],
          ['ferra', "Good work. Both halves."],
          ['hero', "...Both halves. Yeah."]],
        lose: [
          ['hex', "Pushed once. Cursed twice. Get up, magnet boy."]],
        card: "Vael's champion Hex wakes the dead under the Yards; Vex and Ferra fight as one force for once, and Hex flees to the crown-ship." },
      6: { goal: "Pull the Crown apart",
        intro: [
          ['sys', "The Crown over the Crater, plated in the iron of a hundred eaten worlds. The three layers stand under it as the Legion pours down."],
          ['ferra', "Vex. Pull or push?"],
          ['hero', "Both. One force. Let's show them."]],
        meet: [
          ['itsuki', "Pull and push. Earth taught me the same. One force, two ways."],
          ['hero', "...Finally. Somebody gets it. Doesn't mean I'll let you through."],
          ['itsuki', "I did not ask."]],
        lose: [
          ['itsuki', "One force. Mine. Again."]],
        win: [
          ['sys', "Itsuki falls. The Convergence comes apart. Ferra pulls, Vex pushes, and the crown-ship's plating rips loose."],
          ['sys', "Flux Flip. The bare ship falls into the Crater, the door slams, and the Legion and every champion go back. Itsuki last."],
          ['ferra', "All that iron. Where's it going?"],
          ['hero', "Home. Your Yard. Our Yard. Wherever. It always comes back."],
          ['hero', "Iron always comes home."]],
        card: "At the Crater Vex beats Itsuki and the Convergence, then flips the crown-ship on its own iron; it falls, and the door drags every champion home." }
    },

    // ---------------------------------------------------------------- VESNA
    vesna: {
      1: { zone: 'market', goal: "Collect in the Red Quarter",
        intro: [
          ['sys', "The Neon Market's Red Quarter. Every debt in Deepline is written in one red book."],
          ['hero', "Everything has a price. Nobody has ever paid me late twice."],
          ['agent', "The bookkeeper. Halcyon wants that Ledger. Every name in it is leverage."],
          ['hero', "You want my book? How sweet. Let me open a page for you."]],
        win: [
          ['hero', "Collected. In red. I'll bill your Director for the cleaning."],
          ['hero', "Halcyon's page grows longer every day. One day, I collect all of it."]] },
      2: { zone: 'rootways', with: 'thorne', goal: "Keep Sunday tea with Thorne",
        meet: [
          ['hero', "Thorne. It's Sunday. I brought the cups."],
          ['thorne', "And I the tea. You look tired, Vesna. Is the Ledger heavy?"],
          ['hero', "Halcyon's page is the longest in the book. I want it closed before I die."],
          ['thorne', "The dead keep their own accounts. I'll help you with the living. Ah. Guests."],
          ['agent', "The Ledger woman and the grave man, together. Take them both."],
          ['hero', "Interrupting tea. That's extra."]],
        win: [
          ['thorne', "Your tea's gone cold. And you've never once charged me for it."],
          ['hero', "Nor ever will. Don't tell anyone."],
          ['thorne', "Who would I tell? My guests are very discreet."]] },
      3: { zone: 'market', rival: 'maren', goal: "Settle the bill with Maren",
        meet: [
          ['maren', "Vesna. I've seen your bills. The blood ones. You call this bookkeeping?"],
          ['hero', "Doctor. You give it all away for free. Do you know what that does to the market?"],
          ['maren', "What you do is a sickness."],
          ['hero', "It's a ledger. And you're on the wrong page of it."]],
        win: [
          ['maren', "...You heal from every cut you make. That's not a ledger. That's a wound that pays itself."],
          ['hero', "Clever. I'll write that down."],
          ['maren', "Patch your arm. Free. Don't argue."],
          ['hero', "...Just this once. And I'm writing that down too."]],
        lose: [
          ['maren', "Doctor's orders: rest. Then try me again."]] },
      4: { zone: 'pit', goal: "Open the Ledger at Halcyon's page",
        intro: [
          ['sys', "The Strings Cut. Drills in Deepline, and rumours that the Sky's Nyra walked them in. Vesna has read the real accounts."],
          ['hero', "The Sky didn't send these drills. Halcyon did, and paid for them with Deepline's money."],
          ['hero', "Their page is the longest in my book. Tonight, I call in every debt at once."],
          ['vex', "Every debt? Including mine?"],
          ['hero', "Especially yours, darling. Pay in iron."]],
        win: [
          ['sys', "Vesna reads Halcyon's page aloud in the Pit, line by line, and every debt in Deepline answers it."],
          ['hero', "Every drill, every crew, every stolen hour. Collected."],
          ['sys', "Pell, caught in his own Cradle, names the face that started it: Rue. Four banners climb the Spire, and Vesna brings the bill."],
          ['hero', "Halcyon's page, closed. For now. The interest I'll take from the Director himself."]],
        card: "Vesna opens the Red Ledger at Halcyon's page and calls in every debt at once; Pell names Rue, and four banners climb the Spire." },
      5: { zone: 'rootways', foe: 'hex', goal: "Make the ghost pay up",
        intro: [
          ['sys', "A crown-ship fills the sky. One of Vael's champions walks into the Roots and wakes Thorne's dead on a Sunday."],
          ['thorne', "Vesna. They're waking my guests. I could use help with the accounts."],
          ['hero', "For you? No charge. There never was."]],
        meet: [
          ['hex', "Bookkeeper. Every cut I make bleeds twice. Can you pay that?"],
          ['hero', "My blood heals me for every hit. Bleed me twice, darling, and I'll collect twice."],
          ['hex', "Then let's see who runs out first."],
          ['hero', "And you've walked into Thorne's garden on a Sunday. That's a debt all by itself."]],
        win: [
          ['sys', "Blood against a ghost. Red Rain falls on the Roots, and Hex slows at last."],
          ['hex', "You took it all back. Twice. ...I'm going home to him."],
          ['sys', "Hex drifts up out of the Roots toward the crown-ship. Thorne lays his dead back down."],
          ['hero', "Run along. I've opened a page for your Sovereign. Thorne, the tea's on me. As ever."]],
        lose: [
          ['hex', "Bled twice. Paid nothing. Again, bookkeeper?"]],
        card: "Vael's champion Hex wakes Thorne's dead on a Sunday; Vesna bleeds twice and collects twice, and Hex flees to the crown-ship." },
      6: { goal: "Collect the Convergence's debt",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, and the Convergence and Vael stand over the Legion."],
          ['convergence', "The bookkeeper. Your page on Halcyon is closed. There is no Halcyon now. Only me."],
          ['hero', "Oh, darling. Debts don't die with the company. They pass to the next of kin."]],
        meet: [
          ['itsuki', "You keep accounts. I have beaten everyone who stood here before you. Write that down."],
          ['hero', "I have, darling. Ivo, Tarn, Jax, Brann, Kael. Every one of them is on your page."],
          ['itsuki', "Then collect."]],
        lose: [
          ['itsuki', "Unpaid. Again."]],
        win: [
          ['sys', "Itsuki falls. Red Rain falls on the Convergence, and it comes apart into light. Vael stands alone."],
          ['hero', "Every Subject. Every Husk. Every eaten world. All of it on one page, Sovereign, and the page is yours."],
          ['sys', "The last blow lands. The crown-ship falls into the Crater, and the door to the Beyond slams shut behind it."],
          ['sys', "It drags the Legion and every champion back through. Itsuki goes last."],
          ['hero', "Closed. Signed. In red."],
          ['hero', "Paid in full."]],
        card: "At the Crater Vesna beats Itsuki, the Convergence and Vael, and closes their page in red; the crown-ship falls and the door drags every champion home." }
    },

    // ---------------------------------------------------------------- FUMI
    fumi: {
      1: { zone: 'waterworks', goal: "Keep the boilers running",
        intro: [
          ['sys', "The Waterworks, the boilers above the Core Sump. Fumi keeps half of Deepline from freezing."],
          ['hero', "Pressure's good. Pumps are good. Tapping's... still there. Every night. Under the floor."],
          ['agent', "Boilerman. You've been tapping back at Subject Sixty. Hands off the pipes, and come with us."],
          ['hero', "I keep it in. Mostly."]],
        win: [
          ['hero', "...Mostly."],
          ['sys', "When the steam clears, Fumi kneels by the pipe and taps three times. Three taps come back."],
          ['hero', "I'm coming down. Soon. Hold on."]] },
      2: { zone: 'core', with: 'ashka', goal: "Find the voice in the pipes",
        meet: [
          ['sys', "Fumi climbs down the boiler shaft into the Core Sump, after a whole year of tapping."],
          ['ashka', "...You. The tapping. You are the boiler man."],
          ['hero', "Fumi. I heard you every night. The heat in my pipes was you hurting. I couldn't stand it any more."],
          ['ashka', "Ashka. Not Sixty. Say it once, so I hear it out loud."],
          ['hero', "Ashka. ...Wardens on the stairs. Time to let off some steam."]],
        win: [
          ['ashka', "You came down. Nobody comes down."],
          ['hero', "Next time I come back with enough pressure to blow that door off. Partners?"],
          ['ashka', "I burn. You boil. Partners."]] },
      3: { zone: 'waterworks', rival: 'mako', goal: "Test Mako's boiler to bursting",
        meet: [
          ['mako', "Fumi. The suit's boiler is running hot again. Dyna wants a full pressure test."],
          ['hero', "Full pressure. On a suit with a man inside it. You trust me that much?"],
          ['mako', "You've kept it from cooking me twice. Hit it till something pops. Better here than in a fight."],
          ['hero', "...All right. Brace."]],
        win: [
          ['sys', "The suit's boiler blows a valve. The suit holds."],
          ['mako', "Still standing. Fixed?"],
          ['hero', "Fixed. Three new valves. It'll take more than me to pop it now."],
          ['mako', "That's what I wanted to hear."]],
        lose: [
          ['mako', "Suit's fine. You're the one steaming, Fumi. Again?"]] },
      4: { zone: 'core', goal: "Blow the Core Sump's door",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills chew into Deepline, and everyone swears the Sky's Nyra walked them down."],
          ['hero', "Ashka saw a Deepline boy at her vents. The Sky saw him too. Now a Sky girl at our drills. Two lies, one liar."],
          ['dyna', "Doesn't matter tonight. How much pressure have you got?"],
          ['hero', "A year of it. Every night I didn't come down."]],
        win: [
          ['sys', "Every valve in the Waterworks opens at once down one pipe. Dyna lights the fuse. The Sump's door is gone."],
          ['ashka', "...Fumi. I'm out."],
          ['hero', "You're out. I'm... I'm going to sit down a minute."],
          ['sys', "Not for long. Pell names the face that started it all: Rue. Four banners climb the Spire, and Fumi brings a pressure gauge."]],
        card: "A year of pressure and Dyna's bombs blow the Core Sump's door and free Ashka; Pell names Rue, and four banners climb the Spire." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Hold the pumps against Slick",
        intro: [
          ['sys', "A crown-ship fills the sky. One of Vael's champions slides into the Waterworks, and the Drowned Line starts to rise."],
          ['hero', "Pumps at full. Not enough. If the water reaches the boilers, Deepline freezes. Hold, everybody."]],
        meet: [
          ['slick', "Hello! Warm pipes! I like warm pipes. Your pumps push me back. I'll push harder."],
          ['hero', "Those boilers keep half of Deepline from freezing. Ashka bled for that heat for a year. Not you. Not today."],
          ['slick', "Squish!"]],
        win: [
          ['sys', "Steam against flood. The pumps scream, and hold. Nami pushes the Line back down from below."],
          ['slick', "Too hot! Too hot! Ow! He said this one was easy!"],
          ['sys', "Slick slides up the shafts in a cloud of steam, back to the crown-ship. The Drowned Line goes still."],
          ['hero', "...I kept it in. Mostly."]],
        lose: [
          ['slick', "Pressure? I don't have any. I just keep coming."]],
        card: "Vael's champion Slick floods the Waterworks to drown the boilers; Fumi's pumps hold, and Slick flees to the crown-ship in a cloud of steam." },
      6: { goal: "Push back at the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim. Vael's pull drags at everyone, and the Legion pours down."],
          ['convergence', "The boilerman. All that pressure, and nowhere to put it."],
          ['hero', "Oh, I've got somewhere."]],
        meet: [
          ['itsuki', "Water and fire in one man. Steam. I never learned steam."],
          ['hero', "You learn it by keeping it in. A long time. Then you don't."],
          ['itsuki', "Then don't."]],
        lose: [
          ['itsuki', "Pressure, let out. Again."]],
        win: [
          ['sys', "Itsuki falls. Fumi takes the weight of both engines. He blocks, and blocks, and blocks. The Convergence cracks apart."],
          ['ashka', "Fumi. Now."],
          ['sys', "Meltdown. Every valve opens at once. The crown-ship falls into the Crater, and the door to the Beyond slams shut."],
          ['sys', "It drags the Legion and every champion back through. Itsuki goes last."],
          ['hero', "You pushed. I popped."]],
        card: "At the Crater Fumi beats Itsuki and takes the weight of both engines, then blows every valve; the crown-ship falls and the door drags every champion home." }
    },

    // ---------------------------------------------------------------- MAKO
    mako: {
      1: { zone: 'docks', goal: "Hold the docks in the suit",
        intro: [
          ['sys', "Dockside Nine. Mako got crushed under a crate once, and decided: never again."],
          ['hero', "Built a suit. Then kept building. The plating's new this week."],
          ['agent', "That suit is Halcyon property now. Strip it. Bring the pilot."],
          ['hero', "Out of the suit, I'm gentle. In it... well. Arm Cannon."]],
        win: [
          ['hero', "Plating soaked it. Rebuilt itself. Good."],
          ['citizen', "Mako! The crate stack's coming down!"],
          ['hero', "Got it. Not this time, crate."]] },
      2: { zone: 'yard', with: 'dyna', goal: "Keep the suit alive",
        meet: [
          ['dyna', "Mako, you look like a crate fell on you. Again."],
          ['hero', "Halcyon tested it. Plating dented, boiler cooking, magnets pulling left."],
          ['ferra', "Scrap for the plating. Family discount."],
          ['vex', "Magnets. I'll talk about polarity the whole time."],
          ['fumi', "Boiler. That's the third time I've saved you from cooking."],
          ['hero', "Everybody who keeps the suit alive, in one yard. And Halcyon's coming to watch."]],
        win: [
          ['dyna', "Suit's better than new. Can I ride on your shoulders now?"],
          ['hero', "Only you. Always only you."],
          ['hero', "Thanks. All of you. The suit's only as strong as the people who keep it."]] },
      3: { zone: 'works', rival: 'dyna', goal: "Take Dyna's blast test",
        meet: [
          ['dyna', "Blast test, big man. Biggest bombs I've ever made. If the suit holds, it'll hold anything."],
          ['hero', "And if it doesn't hold?"],
          ['dyna', "Then I build a better one. Hold still. Or fight back, actually. It's more fun if you fight back."],
          ['hero', "...Okay. Fighting back."]],
        win: [
          ['dyna', "It held! Every one! Look at the plating! That's beautiful!"],
          ['hero', "I'm a little dizzy."],
          ['dyna', "Dizzy is fine. Dizzy means alive."]],
        lose: [
          ['dyna', "Boom. Suit's smoking, Mako. Patch it and go again?"]] },
      4: { zone: 'pit', goal: "Walk the tank through the Pit",
        intro: [
          ['sys', "The Strings Cut. The drills came in behind a face that looked like the Sky's Nyra. Deepline marches on the Pit."],
          ['hero', "A Sky girl, in front of Halcyon's drills? Ferra says it's wrong. I trust Ferra."],
          ['dyna', "Doesn't matter whose face. The drills are real. Walk, big man. I've got the ammo."],
          ['hero', "Walking."]],
        win: [
          ['sys', "A walking tank crosses the Pit with Dyna on its shoulders, and Halcyon's crews break against it."],
          ['hero', "Full Barrage. Last shell was the size of a car."],
          ['dyna', "That was MY shell. ...Mako, the Pit says Pell named the face: Rue. Banners are going up the Spire. Walk."]],
        card: "Mako walks his suit across the Pit with Dyna on his shoulders, breaking Halcyon's crews; Pell names Rue, and four banners climb the Spire." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Wade the suit into the flood",
        intro: [
          ['sys', "A crown-ship fills the sky. A grinning man of slime slides into the Waterworks for Vael, and the flood begins."],
          ['fumi', "Mako, the water's over the boilers. If it gets into the suit's boiler..."],
          ['hero', "Then you'll fix it. I'm wading in."]],
        meet: [
          ['slick', "Big suit. Heavy suit. Suits sink."],
          ['hero', "This one's built to stand in anything. Every friend I have built it. You're flooding their shop."],
          ['slick', "Everybody comes. Everybody goes under. He promised."]],
        win: [
          ['sys', "The suit stands in the flood like a pier, and Slick breaks against it again and again."],
          ['hero', "Arm Cannon. Full Barrage. Go home."],
          ['sys', "Slick splashes apart and slides up the shafts, back to the crown-ship. The water starts to go down."],
          ['dyna', "Mako! Suit okay? You okay?"],
          ['hero', "Wet. Standing. Good."]],
        lose: [
          ['slick', "Glub. Glub. Suits sink. Again?"]],
        card: "Vael's champion Slick floods the Waterworks; Mako stands in it like a pier, and Slick breaks against the suit and flees to the crown-ship." },
      6: { goal: "Stand under the falling Crown",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim. The Legion pours down, and people are still crossing below."],
          ['dyna', "Mako, if that crown-ship comes down, it comes down on all of them."],
          ['hero', "Then I stand under it."]],
        meet: [
          ['itsuki', "A man in a shell of iron. Earth taught me that every shell cracks."],
          ['hero', "Got crushed once. Built this so it never happens again. Try."],
          ['itsuki', "I will."]],
        lose: [
          ['itsuki', "Cracked. Again."]],
        win: [
          ['sys', "Itsuki falls. The Convergence comes apart. Mako's last shell, the size of a car, goes through Vael's crown-ship."],
          ['sys', "It falls into the Crater over the crossing. The suit takes the pieces on its shoulders, and the people walk out."],
          ['sys', "The door to the Beyond slams shut and drags the Legion and every champion back. Itsuki goes last."],
          ['dyna', "Mako? Mako! Say something!"],
          ['hero', "Built to last."]],
        card: "At the Crater Mako beats Itsuki and the Convergence, shoots down Vael's crown-ship, and holds its pieces off the crossing as the door drags the champions home." }
    },

    // ---------------------------------------------------------------- NAMI
    nami: {
      1: { zone: 'choir', goal: "Keep the Drowned Line",
        intro: [
          ['sys', "The Drowned Line, the flooded tunnels at the bottom of Deepline. The sea took Nami once. She came back with its patience."],
          ['hero', "Grey and cold. I know. The Line's still in me. It's quieter than it sounds."],
          ['agent', "That's the drowned woman. Under too long to live, and still standing. The Director wants to know how."],
          ['hero', "Come into the water and I'll show you."]],
        win: [
          ['hero', "Riptide. Bubble Jail. The sea taught me all of it while I was down there."],
          ['sys', "Fumi's pumps thump overhead. The Line stays where it is."],
          ['hero', "Good. Stay. Nobody else goes under on my watch."]] },
      2: { zone: 'waterworks', with: 'maren', goal: "Guard Maren on the Line",
        meet: [
          ['maren', "Nami. They let me down to check the water lines. I told them I'd be quick."],
          ['hero', "You're never quick. You always stop to treat someone. I'll guard you."],
          ['maren', "I argued with the sea a whole night for you. Let me argue with a few coughs."],
          ['fumi', "Pumps are up. Halcyon followed the doctor down. They're in the tunnel."],
          ['hero', "Then they're in my water. Stay behind me, doctor."]],
        win: [
          ['maren', "You came back colder from the sea. And kinder."],
          ['hero', "You gave me back. I keep you safe. That's the deal."],
          ['maren', "There's no deal, Nami. But thank you."]] },
      3: { zone: 'choir', rival: 'fumi', goal: "Settle the Line with Fumi",
        meet: [
          ['sys', "The Drowned Line. Fumi's pumps are running flat out, and the water is going down for the first time in years."],
          ['hero', "Fumi. You're draining my Line. The docks float on it, and the dead of the Ashfall sleep under it. Stop."],
          ['fumi', "Halcyon wants the water for the Engine's coolant. If I don't pump, they shut my boilers off. Deepline freezes."],
          ['hero', "Then Halcyon gets neither. Put your hands on those valves again and I put you in the water."],
          ['fumi', "I keep it in, mostly. Not tonight, Nami. Sorry."]],
        win: [
          ['fumi', "...You're stronger than my pumps. You always were."],
          ['hero', "And you're kinder than Halcyon. That's why they picked you. Tell them no. We'll keep the boilers lit together."],
          ['fumi', "Pumps and patience. Like always."],
          ['hero', "Like always. Now turn them back round."]],
        lose: [
          ['fumi', "Sorry. Sorry. The pressure's too high to stop. Again?"]],
        card: "Halcyon orders Fumi to drain the Drowned Line for the Engine, and Nami fights her friend to keep the water where it belongs." },
      4: { zone: 'choir', goal: "Raise the Line against the drills",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills come into the Drowned Line, and they say a Sky Subject called Nyra led them."],
          ['hero', "Nyra? Maren kept her alive in a Halcyon tank. She'd never walk drills into anyone's home."],
          ['fumi', "The drills are drinking the Line, Nami. Halcyon's coolant, after all. If I run the pumps backwards, the whole Line comes up."],
          ['hero', "Then run them backwards. The Line has waited a long time to rise."]],
        win: [
          ['sys', "The Drowned Line rises out of the dark and closes over Halcyon's drills. They do not come back up."],
          ['hero', "The sea took me once, and gave me back. It doesn't give drills back."],
          ['sys', "In the Pit, Pell names the face that led the drills: Rue. Four banners climb the Spire, and Nami climbs with them, dripping."]],
        card: "Fumi runs the pumps backwards and the Drowned Line rises over Halcyon's drills; Pell names Rue, and four banners climb the Spire." },
      5: { zone: 'waterworks', foe: 'slick', goal: "Keep the Drowned Line down",
        intro: [
          ['sys', "A crown-ship fills the sky. Vael sends a champion into the Waterworks, and the Drowned Line starts to rise."],
          ['fumi', "Nami! Something made of slime is in my pumps. Violet eyes, and it's grinning."],
          ['hero', "The Line stays where it is. I promised."]],
        meet: [
          ['slick', "Hello! You stepped in me! Everybody steps in me. And you didn't even say sorry."],
          ['hero', "I'm not sorry. You're drowning my Line, and everyone who lives on it."],
          ['slick', "He says everybody goes under. I'm making everything one big puddle."],
          ['hero', "I went under once. The sea gave me back. It won't give you anything."]],
        win: [
          ['sys', "The Drowned Line answers Nami, not Slick. Riptide drags him off the pumps, and Bubble Jail holds him."],
          ['slick', "Cold! Too cold! Not fair! I'm telling!"],
          ['sys', "Slick slides out of the bubble and up the shafts, back to the crown-ship. The water goes down."],
          ['hero', "Fumi. Your boilers are dry. The Line is mine again."]],
        lose: [
          ['slick', "Squish! Down you go. Again, Nami?"]],
        card: "Vael's champion Slick floods the Waterworks to drown the Drowned Line's people; the water answers Nami instead, and Slick flees to the crown-ship." },
      6: { goal: "Bring the deep water up",
        intro: [
          ['sys', "The Crown over the Crater. The three layers meet on the rim, and the Hollow Legion pours down out of the dark."],
          ['maren', "Nami. Stay where I can see you. I argued with the sea for you once."],
          ['hero', "You won't need to again, doctor. Watch."]],
        meet: [
          ['itsuki', "Water. The last thing I learned, and the deepest. On my last world it drowned everything."],
          ['hero', "It drowned me too. Then it gave me back. It doesn't do that for everyone."],
          ['itsuki', "Then let us see if it gives you back twice."]],
        lose: [
          ['itsuki', "Under, again. Rise, if you can."]],
        win: [
          ['sys', "Itsuki falls. The Convergence comes apart. The Drowned Line rises through Nami's cleaver, all the way to the sky."],
          ['hero', "Riptide. Take him down, Line."],
          ['sys', "The deep water drags the crown-ship into the Crater. The door slams shut and pulls the Legion and every champion back."],
          ['sys', "Itsuki goes last, looking back at the water."],
          ['hero', "The sea took me once. It never got to keep me. It doesn't get to keep anyone now."],
          ['hero', "Sink to the abyss."]],
        card: "At the Crater Nami beats Itsuki and the Convergence, and the Drowned Line drags Vael's crown-ship down; the door pulls every champion home." }
    }
  });
})();
