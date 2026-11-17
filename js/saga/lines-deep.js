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
          ['sable', "Cradle's shut. Pell's caught in his own strings, and he isn't even fighting it."],
          ['pell', "Her name is Rue. I taught her your face. She is at the Crater now, wearing it."],
          ['sys', "At the Crater, Mira's mirror finds the Kael with no reflection. Rue runs, and four banners climb the Spire."],
          ['hero', "Up the Spire, then. Director, I'm out of the trash, and I'm coming for you."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: "Stand beside Ryo against Itsuki",
        intro: [
          ['sys', "The Convergence opens the Beyond. A crown the size of a city fills the sky, and the Legion pours down the shafts."],
          ['sys', "At the Neon Market, Kael's thunder breaks the crown over Rue. Then Tarn comes down the shaft, out of breath."],
          ['tarn', "Itsuki's in the Ash Dunes. Called. He's beaten Ivo, Jax, Brann, me. Ryo's going. He asked for you."],
          ['hero', "The guy who wanted to lose to my thunder. Fine. Let's finish our fight."]],
        meet: [
          ['ryo', "Kael. Good. He has fought on five worlds and never lost. I can't reach him alone."],
          ['itsuki', "Thunder of this world. I challenged you once. Vael says I may finish it now."],
          ['hero', "That's not you talking. The Itsuki I met wanted to learn things, not break them."],
          ['itsuki', "Then teach me. Fire, wind, thunder, earth, water. Show me the one that beats all five."],
          ['hero', "Not one. Two. Ryo, together!"]],
        win: [
          ['sys', "Thunder and balance strike as one. The hollow crown over Itsuki cracks, and falls in pieces."],
          ['itsuki', "...Ryo. Kael. How many did I hurt?"],
          ['ryo', "Ivo, Tarn, Jax, Brann. All alive. All angry."],
          ['itsuki', "Then I get up."],
          ['hero', "Course you do. We still haven't finished, you and me. After we break a bigger crown."]],
        lose: [
          ['itsuki', "Five worlds. Five elements. You are one thunder. Again."]] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door into it, and Vega and Lux hold Aurelia steady while everyone crosses."],
          ['convergence', "A number I never bothered to learn. The trash I dropped. You should have stayed in the heap."],
          ['vael', "Twelve were mine. You took them back. Then I will take your worlds instead."],
          ['hero', "Take a number. Deepline's here, and we brought everybody."]],
        win: [
          ['sys', "Tessa holds the moment still. Mira shows Vael a crown with nothing inside it. Itsuki raises his hands."],
          ['itsuki', "Fire from Pyra. Wind from Gale. Earth from Brakk. Water from Nami. Kael. Your thunder."],
          ['hero', "Take it. We'll finish our fight later. Finish this one now!"],
          ['sys', "The Five Calamities fall. The Convergence comes apart into light, and the Crown drops into the Crater."],
          ['hero', "Out of the trash, into the storm!"]] }
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
          ['dyna', "Front row for every eruption from now on. That was the deal."],
          ['hero', "The first one is for Halcyon. Show me their drills."]] },
      5: { zone: 'metro', foe: 'noct', goal: "Keep the Old Metro lit",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls, and twelve answer. Down here, every lamp in the Old Metro goes out."],
          ['vael', "Darkness first. Then my Legion. The Underground was always going to be the easy one."],
          ['hero', "Easy? I am the bottom of everything. And I am still burning."]],
        meet: [
          ['noct', "...Light."],
          ['hero', "You are the one cutting the lamps. Your eyes are violet. That is not your colour, harbour man."],
          ['noct', "The dark is mine to keep. He says you are in it."],
          ['hero', "Then keep it somewhere else. I am a light now, and I do not go out."]],
        win: [
          ['hero', "There. Your blade. In my glow, I can see where it is not. Sen! Now!"],
          ['sys', "Sen steps into Ashka's light, draws once, and the hollow crown over Noct falls in two halves."],
          ['noct', "...The harbour vents. Under the ice. You kept them warm."],
          ['hero', "I did. Come up, watchman. We have a bigger crown to break."]],
        lose: [
          ['noct', "Lights out."]] },
      6: { goal: "Burn the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. The Hollow Legion fills the rim, and Orin's door opens into the dark."],
          ['convergence', "Subject 60. You heated my city for a year. Come back to the furnace."],
          ['hero', "I remember every day of that year. Every one. You have no idea how hot that makes me."]],
        win: [
          ['pyra', "Sister! Itsuki needs my fire. Keep the engine busy!"],
          ['hero', "Busy? I will keep it burning."],
          ['sys', "Ashka pours a year of the Core Sump into the Convergence. It cannot drain her fast enough. Then the Calamities fall."],
          ['hero', "You drained me for a year, engine. You never learned how much there was."],
          ['hero', "The core burns hotter than you."]] }
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
          ['ashka', "Gladly."]] },
      5: { zone: 'market', foe: 'rue', goal: "Blow the masks off Rue",
        intro: [
          ['sys', "The sky over the Crater splits, and the Legion floods up the metro shafts into the Neon Market."],
          ['citizen', "Vesna's selling the Market to the invaders! No, Ferra is! No, it's Kael, he's selling us out!"],
          ['hero', "Three faces, same sneer. That's Rue, under a crown."]],
        meet: [
          ['rue', "Dyna. Bombs. I can do bombs. Watch. Better than you."],
          ['hero', "Copy the bomb all you like. You can't copy the timing. That bit's mine."],
          ['rue', "I am Vesna. I am Ferra. I am anyone Deepline listens to."],
          ['hero', "And every time you put on a face, I'm going to blow it off."]],
        win: [
          ['sys', "The last mask burns away. Under it there is no face yet, only a violet crown going dim."],
          ['sys', "Kael's thunder hits the crown. Pell cuts the last string he ever tied to her. A face comes up out of the smoke."],
          ['rue', "...That one's mine?"],
          ['hero', "Looks good on you. Keep it."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Again?"]] },
      6: { goal: "Blow a hole in the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The Hollow Legion fills the rim, and Mako wades in with Dyna on his shoulders."],
          ['hero', "That is a big crown. I have never blown up anything that big."],
          ['mako', "You've never had a reason that good."]],
        win: [
          ['vael', "Little firework. You think noise can scratch an empire?"],
          ['hero', "Not noise. Timing. Three, two, one."],
          ['sys', "Every bomb in Deepline goes off along the Crown's seam. Through the crack, Itsuki's Five Calamities fall."],
          ['hero', "Boom. That's art."]] }
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
          ['pell', "So I am. What a reach. I never saw it coming."],
          ['hero', "Nobody ever does."]] },
      5: { zone: 'waterworks', foe: 'slick', goal: "Hold back the flood",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls, and the Legion comes down the shafts to the Waterworks."],
          ['fumi', "Slick's answered it. He's flooding the Drowned Line. The pumps can't hold."],
          ['hero', "Then I'll hold the water. Both arms. Somebody find Nami."]],
        meet: [
          ['slick', "Bando. Long arms. Long arms can't hold water."],
          ['hero', "Slick, buddy, your eyes are purple. You're the friendliest puddle in Deepline. Stop flooding it."],
          ['slick', "The voice says home. The water says home. Let it in."],
          ['hero', "Nope. Not past this dock."]],
        win: [
          ['hero', "Holding! Holding... can't hold forever. Nami!"],
          ['nami', "Slick. I stepped in you once, and I said sorry. I'm sorry again. Come home."],
          ['sys', "The crown over Slick cracks like ice in spring, and the water stops rising."],
          ['slick', "...Bando? Did I get your shoes wet? Sorry."]],
        lose: [
          ['slick', "Squash. Splash. Back together. Again?"]] },
      6: { goal: "Reach into the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Aurelia hangs overhead while everyone crosses Orin's door."],
          ['hero', "That's a long way across. Good thing I've got a long arm."],
          ['vael', "The arm of a dockhand, reaching for a throne."]],
        win: [
          ['sys', "As the Five Calamities fall on the Crown, a kite snaps loose high above the Crater. A small figure tumbles."],
          ['sora', "Not again!"],
          ['hero', "Got you! That's twice! Everybody saw it, right? Twice!"],
          ['sora', "Fine. You saved me. Twice. Put me down."],
          ['hero', "Long arm of Deepline!"]] }
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
          ['vex', "You're welcome for the other half."],
          ['hero', "...Fine. Thank you. Don't make it a habit."]] },
      5: { zone: 'rootways', foe: 'hex', goal: "Hold the Roots against Hex",
        intro: [
          ['sys', "The sky over the Crater splits, and Vael calls. Under Deepline, the dead in Thorne's garden start to stand up."],
          ['thorne', "Hex has been Called. My guests are walking. Ferra, I need iron between them and the living."],
          ['hero', "Iron I've got. Scrap against ghosts. Let's see who wins."]],
        meet: [
          ['hex', "Ferra. Scrap queen. Everything you throw hits once. Everything I throw hits twice."],
          ['hero', "Then I'll throw twice as much. I've got a whole yard of it."],
          ['vex', "And I've got the other half. Pull and push, teacher. Together, for once?"],
          ['hero', "For once. Don't tell anybody."]],
        win: [
          ['sys', "Ferra and Vex pin Hex in a cage of floating iron. Thorne steps through it and lays a hand on her crown."],
          ['thorne', "Hex. You came here because it was quiet. Be quiet now. Rest."],
          ['sys', "The crown breaks. The dead lie back down, one by one, in their beds of bone."],
          ['hero', "Vex. You were good. Just this once, I'll say it."]],
        lose: [
          ['hex', "Hit. And hit again. That's the curse, scrap queen."]] },
      6: { goal: "Strip the Crown's metal",
        intro: [
          ['sys', "The Crown over the Crater. It is armoured in the metal of a hundred eaten worlds."],
          ['hero', "That is the most scrap I have ever seen in one place."],
          ['vex', "Pull or push?"],
          ['hero', "Pull. All of it."]],
        win: [
          ['sys', "Ferra pulls, Vex pushes, and the Crown's armour tears away in sheets. Itsuki's Calamities fall through the gap."],
          ['vex', "A hundred worlds of iron. What do we do with all of it?"],
          ['hero', "Take it home. Sort it. Make something good. Same as always."],
          ['hero', "I'll recycle what's left."]] }
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
      3: { zone: 'metro', rival: 'noct', goal: "See Noct's blade",
        meet: [
          ['sys', "The Old Metro. In the dark between the lamps stands the only blade Sen has ever failed to see."],
          ['hero', "Noct. I have sworn to see your blade once."],
          ['noct', "..."],
          ['hero', "Then I will look."]],
        win: [
          ['noct', "...You won."],
          ['hero', "I won the bout. I did not see the blade. That is a loss."],
          ['noct', "There was no blade."],
          ['hero', "Then next time, I will see the nothing."]],
        lose: [
          ['noct', "...Again."]] },
      4: { zone: 'pit', goal: "Cut one line through the Cradle",
        intro: [
          ['sys', "The Strings Cut. Drills in the tunnels, a stolen face on every rumour. In the Pit Arena, Pell's strings are everywhere."],
          ['sable', "Kael's face opened the vents. Nyra's face led the drills. Both faces were lies. The strings run here."],
          ['hero', "Then we do not chase the faces. We cut the hand."],
          ['rook', "There's a thousand strings, sensei. You've got one sword."],
          ['hero', "One line is enough."]],
        win: [
          ['sys', "One stroke. Every string from the rafters to the floor parts at once, and Pell's own Cradle closes on Pell."],
          ['pell', "One line through the Cat's Cradle. You were always the patient one."],
          ['hero', "You sold the student I took in. Sit. Be patient now."]] },
      5: { zone: 'metro', foe: 'noct', goal: "See the blade in the dark",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls, and Noct answers. Every light in the Old Metro goes out."],
          ['vael', "My watchman. Cut their lamps. Let them learn the dark."],
          ['hero', "I have been waiting for the dark. This time, I will see."]],
        meet: [
          ['noct', "Sen."],
          ['hero', "Your eyes are violet. You kept your harbour's dark clean. This dark is dirty."],
          ['noct', "...He calls. I cannot hear anything else."],
          ['hero', "Then hear this. One breath. Then the bell."]],
        win: [
          ['sys', "In the dark, Sen sees it at last: the blade that is not there. He draws once."],
          ['sys', "The hollow crown over Noct falls in two clean halves."],
          ['noct', "...You saw it."],
          ['hero', "There was no blade. I saw that."]],
        lose: [
          ['noct', "Not yet."]] },
      6: { goal: "One stroke for the Crown",
        intro: [
          ['sys', "The Crown over the Crater. Noct stands beside Sen at Orin's door, and neither says a word."],
          ['convergence', "A swordsman. One man with one blade, against the engine of three worlds."],
          ['hero', "One is enough."]],
        win: [
          ['sys', "A line of violet light binds the Convergence to Vael, the last two engines fighting as one. Sen waits."],
          ['hero', "Three breaths. After the bell."],
          ['sys', "One stroke. The two engines come apart, and Itsuki's Five Calamities fall between them."],
          ['hero', "One stroke. Enough."]] }
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
          ['pell', "Because the face that started this war was mine to teach. Her name is Rue."]] },
      5: { zone: 'market', foe: 'rue', goal: "Out-clone Rue at the Market",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls, and Rue answers. In the Neon Market, Deepline's leaders are everywhere at once."],
          ['hero', "Vesna's on two corners. Ferra's on three. Kael's on the roof AND in the fountain. That's Rue."]],
        meet: [
          ['rue', "Rook. I copied your clones once. Remember? Far too many of you."],
          ['hero', "Remember? That was my best week."],
          ['rue', "I'll do it again. Better. A thousand of you, all mine."],
          ['hero', "You copied my clones. You can't copy my friends. And I've got more of those too."]],
        win: [
          ['sys', "Rooks pin every face in the Market. Only one has no reflection in the puddles: the real Rue."],
          ['hero', "Found you. Kael! Pell! Now!"],
          ['sys', "Rook's fist and Kael's thunder hit the crown together, and Pell cuts the last string he ever tied to her."],
          ['rue', "...Too many of you. Even for me."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Want to see your clones again?"]] },
      6: { goal: "Hold the Legion at the Crown",
        intro: [
          ['sys', "The Crown over the Crater. The Hollow Legion fills the rim, more soldiers than anyone can count."],
          ['hero', "More than anyone can count? Cool. I can count too."],
          ['kael', "Rook. Hold the rim?"],
          ['hero', "Hold it? I'm going to fill it."]],
        win: [
          ['sys', "A Thousand Rooks pile on the Legion while the Calamities fall on the Crown. The Legion goes still."],
          ['kiri', "Rook! How many of you are there today?"],
          ['hero', "Ask me after I count. Kael, Kiri, Sable, Moro... everybody's here. Nobody fought alone."],
          ['hero', "There's always more of me!"]] }
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
          ['pell', "The quiet one. I should have watched the quiet one."],
          ['hero', "You should have. Rook held the door for us. ...Thank you, Rook."],
          ['rook', "Wait. Was that a thank-you? Moro! She thanked me!"]] },
      5: { zone: 'metro', foe: 'noct', goal: "Outrun the dark to Noct",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls. The lamps of the Old Metro die one by one, and the Legion marches in."],
          ['hero', "Dark. Fine. Lightning brings its own."]],
        meet: [
          ['noct', "Lightning. I cut the light. You will not see me."],
          ['hero', "I don't need to see you. I need to be there first."],
          ['noct', "Then be there."]],
        win: [
          ['sys', "A violet flash in the black, faster than his cut. For one instant, the Old Metro is bright as noon."],
          ['hero', "Sen. There. Now."],
          ['sys', "In Sable's light, Sen sees the blade, and cuts the crown off Noct's head in one stroke."],
          ['noct', "...Fast."]],
        lose: [
          ['noct', "The cut arrived. You did not."]] },
      6: { goal: "Bring the storm to the Crown",
        intro: [
          ['sys', "The Crown over the Crater. Kael's lightning goes up first, loud as ever."],
          ['kael', "Sable! One thunder too many, remember?"],
          ['hero', "Today, two isn't enough. Move over."]],
        win: [
          ['sys', "Amber thunder and violet thunder go into Itsuki's hands together. The Five Calamities fall on the Crown."],
          ['kael', "So whose thunder was that?"],
          ['hero', "Ours. Don't get used to it."],
          ['hero', "My hand is the storm."]] }
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
          ['pell', "You turned my lesson inside out. Shadows that hold, not hide."],
          ['hero', "You taught it wrong. I fixed it. Sit still, sensei."]] },
      5: { zone: 'metro', foe: 'noct', goal: "Meet the dark with the dark",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls. Noct answers, and the Old Metro goes black from end to end."],
          ['hero', "My station. My dark. He doesn't get to put out my lamps."]],
        meet: [
          ['noct', "Shadow-keeper."],
          ['hero', "Dark-keeper. You kept a harbour clean. Now you're the dirt in it."],
          ['noct', "The dark is all one. Join it."],
          ['hero', "Dark against dark, then. Mine holds."]],
        win: [
          ['sys', "Moro's shadows close round the blade that isn't there, and hold it still for one breath."],
          ['hero', "Sen. It's not moving. Look."],
          ['sys', "Sen looks, and sees, and cuts. The hollow crown over Noct falls in two."],
          ['noct', "...Held."]],
        lose: [
          ['noct', "Lights out, shadow-keeper."]] },
      6: { goal: "Lay the Legion down",
        intro: [
          ['sys', "The Crown over the Crater. The Hollow Legion marches in its millions, emptied out of a thousand eaten worlds."],
          ['hero', "They've been marching longer than our world has been here. Somebody should let them stop."]],
        win: [
          ['sys', "Itsuki's Calamities fall. The Crown drops into the Crater, and the Legion stops, all at once."],
          ['hero', "There. Lie down. Nobody is going to make you march again."],
          ['sys', "Moro's shadows spread over the still Legion like a blanket."],
          ['hero', "The long night begins."]] }
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
          ['sable', "Got you."],
          ['rook', "You could get out of that. Why aren't you?"],
          ['hero', "Because, for once, the strings are in the right hands. Hold them tight. I taught you that."]] },
      5: { zone: 'market', foe: 'rue', goal: "Cut Rue's strings yourself",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls the Beyond-born home, and Rue answers."],
          ['citizen', "Vesna's selling us! Ferra's selling us! Pell's... no, Pell's tied up. Who's selling us?"],
          ['hero', "That is my pupil wearing their faces. And someone else is holding her strings."]],
        meet: [
          ['rue', "Pell. Sensei. He calls me home. He gives me a crown. You only gave me faces."],
          ['hero', "I gave you everyone's face but yours. I never asked for it. I'm asking now."],
          ['rue', "I don't have one."],
          ['hero', "You do. I tied strings over it. Let me cut them."]],
        win: [
          ['sys', "Pell's threads go out one last time, and cut every string on her: his, and the Crown's."],
          ['rue', "...This face. Is it mine?"],
          ['hero', "Yours. Nobody else has ever worn it. Keep it."],
          ['hero', "You were my finest work. Now be nobody's work but your own."]],
        lose: [
          ['rue', "Seen it. Done it. Better. Your strings, sensei."]] },
      6: { goal: "Cut the Crown's twelve chains",
        intro: [
          ['sys', "The Crown over the Crater. Vael raises his hand, and his crown splits into twelve chains, one for each of the Called."],
          ['vael', "Strings, little puppeteer. You understand. They are mine. All twelve."],
          ['hero', "I understand better than anyone. That's why I know exactly where to cut."]],
        win: [
          ['sys', "Pell's threads find every link. Twelve chains fall, and the Called stand free around the Crown."],
          ['sys', "Itsuki's Calamities fall. The Convergence comes apart into light, and the Crown drops into the Crater."],
          ['hero', "Whole worlds on strings, Sovereign. And you never once asked any of them for their faces."],
          ['hero', "You danced beautifully."]] }
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
      2: { zone: 'heartroot', with: 'hex', goal: "Keep the quiet with Hex",
        meet: [
          ['hex', "Thorne. It's me. Is it Sunday? I can never tell. Everything happens twice for me."],
          ['hero', "It is Saturday, Hex. Twice. Sit. Vesna comes tomorrow for tea. You may stay."],
          ['hex', "Your garden's the only quiet place on the near side. Halcyon's people are coming down the stair."],
          ['hero', "Then it will be quiet again shortly. Would you curse them for me? Twice?"],
          ['hex', "With pleasure. Twice."]],
        win: [
          ['hex', "Their captain keeps hitting himself. That's my favourite part."],
          ['hero', "Thank you, Hex. Come back whenever it is loud up there."],
          ['hex', "It's always loud up there. I'll come back twice."]] },
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
          ['vesna', "Nicely done. That's one debt Halcyon owes us both."]] },
      5: { zone: 'rootways', foe: 'hex', goal: "Put the dead back to sleep",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls the Beyond-born home, and Hex answers."],
          ['hero', "My guests are walking. Every one of them. That is not polite."]],
        meet: [
          ['hex', "Thorne. He says wake them. He says the dead are his too. Everything twice."],
          ['hero', "Hex. You came here for the quiet. You are making the only quiet place on the near side very loud."],
          ['hex', "I can't hear the quiet any more. Only him."],
          ['hero', "Then let me put them back to bed, one by one. You, last."]],
        win: [
          ['sys', "One by one, Thorne lays the walking dead back down. Then he lays a hand on Hex's crown."],
          ['hero', "It's Sunday, Hex. Shh."],
          ['sys', "The hollow crown breaks. The garden is quiet again."],
          ['hex', "...Thorne. It was so loud. Thank you. Twice."]],
        lose: [
          ['hex', "Hit, and hit again. Your guests are mine now."]] },
      6: { goal: "Bury the Hollow Legion",
        intro: [
          ['sys', "The Crown over the Crater. The Hollow Legion fills the rim, soldiers emptied out of a thousand worlds."],
          ['hero', "Oh, the poor things. Nobody ever buried a single one of them."],
          ['hex', "Thorne. We can't fight all of them."],
          ['hero', "We don't need to fight them. We need to make room."]],
        win: [
          ['sys', "Itsuki's Calamities fall. The Crown drops into the Crater, and the Legion goes still, all at once."],
          ['hex', "They've stopped. What happens to them now?"],
          ['hero', "Now they rest. There's room under Deepline for everyone. Beds of bone, and flowers. And quiet."],
          ['hero', "Welcome to my garden."]] }
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
          ['vesna', "Not paid in full. But I'll mark it down as a very good month."]] },
      5: { zone: 'rootways', foe: 'hex', goal: "Push back a curse that hits twice",
        intro: [
          ['sys', "The sky over the Crater splits. Hex answers Vael's Call, and the dead of the Roots begin to walk."],
          ['ferra', "Vex. I need your half."],
          ['hero', "You're asking? Out loud? Fine. Pull and push. Together."]],
        meet: [
          ['hex', "Magnet boy. Everything you push comes back once. Everything I curse comes back twice."],
          ['hero', "Then I'll push twice, and pull twice. I'm good at both. That's the whole point."],
          ['hex', "Show me."]],
        win: [
          ['sys', "Vex pulls every curse onto the iron and throws it away twice. Ferra holds the cage shut, and Thorne steps in."],
          ['sys', "Thorne lays a hand on Hex's crown, and it breaks. The dead lie back down."],
          ['ferra', "Good work. Both halves."],
          ['hero', "...Both halves. Yeah."]],
        lose: [
          ['hex', "Pushed once. Cursed twice. Get up, magnet boy."]] },
      6: { goal: "Pull the Crown apart",
        intro: [
          ['sys', "The Crown over the Crater, plated in the iron of a hundred eaten worlds."],
          ['ferra', "Vex. Pull or push?"],
          ['hero', "Both. One force. Let's show them."]],
        win: [
          ['sys', "Ferra pulls and Vex pushes, and the Crown's plating rips loose. Itsuki's Calamities pour through the wound."],
          ['ferra', "All that iron. Where's it going?"],
          ['hero', "Home. Your Yard. Our Yard. Wherever. It always comes back."],
          ['hero', "Iron always comes home."]] }
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
          ['hero', "Halcyon's page, closed. For now. The interest I'll take from the Director himself."]] },
      5: { zone: 'rootways', foe: 'hex', goal: "Make the ghost pay up",
        intro: [
          ['sys', "The sky over the Crater splits. Hex answers Vael's Call, and the Roots wake under Deepline."],
          ['thorne', "Vesna. They're waking my guests. I could use help with the accounts."],
          ['hero', "For you? No charge. There never was."]],
        meet: [
          ['hex', "Bookkeeper. Every cut I make bleeds twice. Can you pay that?"],
          ['hero', "My blood heals me for every hit. Bleed me twice, darling, and I'll collect twice."],
          ['hex', "Then let's see who runs out first."]],
        win: [
          ['sys', "Blood against a ghost. Red Rain falls on the Roots, and Hex slows at last."],
          ['hero', "Thorne. She's yours. I don't collect from your friends."],
          ['sys', "Thorne lays his hand on Hex's crown, and it breaks. The dead lie down."],
          ['hex', "...Ow. Twice."]],
        lose: [
          ['hex', "Bled twice. Paid nothing. Again, bookkeeper?"]] },
      6: { goal: "Collect the Convergence's debt",
        intro: [
          ['sys', "The Crown over the Crater. The Convergence and Vael stand together, the last two engines."],
          ['convergence', "The bookkeeper. Your page on Halcyon is closed. There is no Halcyon now. Only me."],
          ['hero', "Oh, darling. Debts don't die with the company. They pass to the next of kin."]],
        win: [
          ['sys', "Itsuki's Calamities fall. The Convergence comes apart into light, and the Crown drops into the Crater."],
          ['hero', "Every Subject. Every Husk. Every year in a tank. All of it on one page."],
          ['hero', "Closed. Signed. In red."],
          ['hero', "Paid in full."]] }
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
          ['hero', "You're out. I'm... I'm going to sit down a minute."]] },
      5: { zone: 'waterworks', foe: 'slick', goal: "Hold the pumps against Slick",
        intro: [
          ['sys', "The sky over the Crater splits. Slick answers Vael's Call, and the Drowned Line starts to rise."],
          ['hero', "Pumps at full. Not enough. Nami's on her way. Hold, everybody."]],
        meet: [
          ['slick', "Fumi. Your pumps push me back. I'll push harder."],
          ['hero', "Slick. You sleep in my warm pipe every night. Don't do this."],
          ['slick', "Home is coming. The water wants to go home."]],
        win: [
          ['sys', "Steam against flood. The pumps scream, and hold."],
          ['nami', "Slick. I'm sorry. I stepped in you once, and I'm sorry again now. Come home with me."],
          ['sys', "The crown over Slick cracks, and the Drowned Line goes still."],
          ['slick', "...Fumi? Your boiler's very hot. Sorry about the pumps."]],
        lose: [
          ['slick', "Pressure? I don't have any. I just keep coming."]] },
      6: { goal: "Push back at the Crown",
        intro: [
          ['sys', "The Crown over the Crater. Vael's pull drags at everyone, and the Convergence presses down."],
          ['convergence', "The boilerman. All that pressure, and nowhere to put it."],
          ['hero', "Oh, I've got somewhere."]],
        win: [
          ['sys', "Fumi takes the weight of both engines. He blocks, and blocks, and blocks. The gauge goes off the end."],
          ['ashka', "Fumi. Now."],
          ['sys', "Meltdown. Every valve opens at once, and Itsuki's Calamities follow the blast into the Crown."],
          ['hero', "You pushed. I popped."]] }
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
          ['dyna', "That was MY shell."]] },
      5: { zone: 'waterworks', foe: 'slick', goal: "Wade the suit into the flood",
        intro: [
          ['sys', "The sky over the Crater splits. Slick answers the Call, and the Waterworks start to flood."],
          ['fumi', "Mako, the water's over the boilers. If it gets into the suit's boiler..."],
          ['hero', "Then you'll fix it. I'm wading in."]],
        meet: [
          ['slick', "Big suit. Heavy suit. Suits sink."],
          ['hero', "This one's built to stand in anything. Slick, you're friendly. This isn't friendly."],
          ['slick', "The dark says come home. I'm going home. Everybody comes."]],
        win: [
          ['sys', "The suit stands in the flood like a pier, and Slick breaks against it again and again."],
          ['nami', "Slick. I'm sorry I stepped in you. I'm sorry now. Come home."],
          ['sys', "The crown over Slick cracks, and the water starts to go down."],
          ['slick', "...Sorry, big suit. Did I get in your boots?"]],
        lose: [
          ['slick', "Glub. Glub. Suits sink. Again?"]] },
      6: { goal: "Stand under the falling Crown",
        intro: [
          ['sys', "The Crown over the Crater. The Legion fills the rim, and people are still crossing under Aurelia."],
          ['dyna', "Mako, if that Crown comes down, it comes down on all of them."],
          ['hero', "Then I stand under it."]],
        win: [
          ['sys', "Itsuki's Calamities fall. The Crown breaks, and its pieces come down over the crossing."],
          ['hero', "Plating. Thrusters. Hold. Hold."],
          ['sys', "The suit takes the falling Crown on its shoulders, and the people behind it walk out untouched."],
          ['dyna', "Mako? Mako! Say something!"],
          ['hero', "Built to last."]] }
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
      3: { zone: 'choir', rival: 'slick', goal: "Settle things with Slick",
        meet: [
          ['sys', "The Drowned Line. For a month, something has been swallowing the dock workers' boots."],
          ['hero', "...Oh. I stepped in you. You're a puddle."],
          ['slick', "Hello! I'm Slick. Everybody steps in me. It's how I meet people. Want to wrestle? Everybody wrestles."],
          ['hero', "You've been eating boots on my Line. Give them back. Then we'll see."],
          ['slick', "Wrestle first!"]],
        win: [
          ['slick', "You won. You're strong. And cold. I like cold."],
          ['hero', "...I'm sorry. I stepped in you, at the start. That was rude."],
          ['slick', "Nobody ever said sorry before. Can I come home with you?"],
          ['hero', "...Fine. Bring the boots."]],
        lose: [
          ['slick', "Squish! Again! This is the best day!"]] },
      4: { zone: 'choir', goal: "Raise the Line against the drills",
        intro: [
          ['sys', "The Strings Cut. Halcyon's drills come into the Drowned Line, and they say a Sky Subject called Nyra led them."],
          ['hero', "Nyra? Maren kept her alive in a Halcyon tank. She'd never walk drills into anyone's home."],
          ['slick', "The drills are drinking the Line! It tastes like oil."],
          ['fumi', "Nami, if I run the pumps backwards, the whole Line comes up."],
          ['hero', "Then run them backwards. The Line has waited a long time to rise."]],
        win: [
          ['sys', "The Drowned Line rises out of the dark and closes over Halcyon's drills. They do not come back up."],
          ['hero', "The sea took me once, and gave me back. It doesn't give drills back."],
          ['slick', "Can I keep one? As a pet?"]] },
      5: { zone: 'waterworks', foe: 'slick', goal: "Bring Slick home again",
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls, and the friendliest thing on the Drowned Line answers."],
          ['fumi', "Nami! Slick's flooding the Waterworks. His eyes are violet. He doesn't know us."],
          ['hero', "He followed me home once. I'll bring him home again."]],
        meet: [
          ['slick', "Nami. The voice says home. The water says home. I'm making everything home."],
          ['hero', "Slick. Home is the warm pipe and the pile of boots. Not this."],
          ['slick', "The boots... the pipe... no. The voice is louder."],
          ['hero', "Then I'll stop you first. And then I'll tell you something."]],
        win: [
          ['hero', "Slick. I stepped in you once, and I said sorry. I'm saying it again. I'm sorry. Come home."],
          ['sys', "The crown over Slick cracks like ice in spring, and falls into the water."],
          ['slick', "...Nami? You said sorry twice. Nobody says sorry twice."],
          ['hero', "I do. Come on. You're flooding Fumi's boilers."]],
        lose: [
          ['slick', "Home. Home. Everything goes home. Again, Nami?"]] },
      6: { goal: "Give Itsuki the deep water",
        intro: [
          ['sys', "The Crown over the Crater. Inside, the Convergence and Vael fight side by side, the last two engines."],
          ['itsuki', "Nami. I need the deepest water on this world. Will you give it?"],
          ['hero', "The sea gave me back. I can give some of it away."]],
        win: [
          ['sys', "The Drowned Line rises through Nami's cleaver into Itsuki's hands, with fire, wind, thunder and earth."],
          ['itsuki', "Water, last. The deepest. Thank you, Nami."],
          ['sys', "The Five Calamities fall. The Convergence comes apart into light, and the Crown sinks into the Crater."],
          ['hero', "Sink to the abyss."]] }
    }
  });
})();
