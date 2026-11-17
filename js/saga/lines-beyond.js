'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the spoken lines of every chapter for the heroes of the Beyond, Not of This World.
// Data only; js/saga/saga-core.js plays it. Speakers: 'hero' (the hero being played), 'sys' (narration), a hero id,
// or 'director', 'kessen', 'vael', 'agent', 'citizen'.
(function () {
  const SW = window.SW; if (!SW.saga || !SW.saga.add) return;
  SW.saga.add({

    // The villain's storyline: Director Calder Sayle in chapters 1-3, the Convergence from chapter 4. He never says a name.
    convergence: {
      1: { zone: 'spire', goal: 'Run the Engine at full power',
        intro: [
          ['sys', "2187. The Halcyon Spire. Under it, Dr. Kessen's Convergence Engine turns at half power."],
          ['kessen', "Director, the readings are wrong. There is something on the other side of it. Let me switch it off."],
          ['hero', "Switch it up, Doctor. Full power. A city that floats needs power forever, and I intend to give it forever."],
          ['sys', "The Engine screams. The sky tears in two places, and things that were never human crawl up the shaft."],
          ['agent', "Director! Things in the Spire! They came out of the light!"],
          ['hero', "Then they are not citizens. Contain them. I will show you how."]
        ],
        win: [
          ['kessen', "Two worlds torn into ours, Calder. And a hole into the dark between them. It will not close."],
          ['hero', "Good. Then it will never run dry."],
          ['hero', "Catch whatever came through with power in it. Give each one a number. Never a name."]
        ] },
      2: { zone: 'blank', with: 'pell', goal: 'Inspect the Blank Wing with Pell',
        meet: [
          ['pell', "Director. The new one, beside Subject 00. Show her a face once and she wears it better than its owner."],
          ['rue', "Catch whatever came through. Give each one a number. Never a name."],
          ['hero', "My own voice, out of a thing with no mouth. You are my hands, spymaster. That will be my faces."],
          ['pell', "She might like a name, Director."],
          ['hero', "Names are for things that want something. Numbers are for things that are useful."],
          ['agent', "Director! A captain sold the Wing's keys to Deepline. His squad is coming to bury the evidence!"]
        ],
        win: [
          ['pell', "Strings tidied, Director. That captain will sell nothing else."],
          ['hero', "You keep the layers in balance, spymaster. The faceless one will keep them apart."],
          ['hero', "And when they start to look at each other, she gives them a face to hate."]
        ] },
      3: { zone: 'armoury', rival: 'aldric', goal: 'Face Aldric in the Proving Hall',
        meet: [
          ['sys', "The Proving Hall. The knights' banners have been turned to face the wall."],
          ['aldric', "Director. Vesper took me down to the feed lines. I have seen what you call Husks."],
          ['hero', "Subject 12. My finest knight. You swore an oath to me."],
          ['aldric', "I swore to stand between the ice and the people behind it. You were never the wall, Director. You were the ice."],
          ['hero', "Then I will remind you what I made you for. Draw."]
        ],
        win: [
          ['aldric', "You can put me on the floor. You cannot make me kneel."],
          ['hero', "I do not need you kneeling. I need you out of my way."],
          ['hero', "Spymaster. Send the faceless one to the Core Sump. It is time the layers had someone to blame."]
        ],
        lose: [['aldric', "Yield, Director. That was for every Subject in the feed lines."]] },
      4: { zone: 'spire', goal: 'Hold the Spire against four banners',
        intro: [
          ['sys', "Rue wears Kael's face to open the Sump's vents on the labs, and Nyra's to lead the drills into Deepline."],
          ['rue', "Done, Director. The Sky thinks Deepline gassed its labs. Deepline thinks the Sky drilled its homes."],
          ['hero', "Then let them bleed each other dry while the Engine drinks."],
          ['agent', "Director! At the Crater a girl held a mirror up to the false Kael. It showed nothing. They know!"],
          ['sys', "Hollis crosses out three and writes four. Four banners climb the Halcyon Spire from four sides at once."],
          ['hero', "A Pact of Four. The old man always did write too much. Hold every floor."]
        ],
        win: [
          ['sys', "On the floor of the Engine Core, the Director falls back into its light. The Engine takes him in."],
          ['hero', "For a year I heard a voice inside this Engine. Patient. Hungry. Now I will answer it."],
          ['hero', "I am the Convergence. And I am opening the door all the way."]
        ] },
      5: { zone: 'crater', foe: 'orin', goal: 'Hold the door open for Vael',
        intro: [
          ['sys', "The sky over the Crater splits from horizon to horizon. A crown the size of a city comes down."],
          ['vael', "Little engine. You called me for a year. What does an engine of this world offer me?"],
          ['hero', "A door. Three worlds behind it. A city in the sky. And nobody left who knows how to close it."],
          ['vael', "Then show me you are not fuel. My Legion will weigh you."]
        ],
        meet: [
          ['orin', "Director. Or whatever you are now. That's my kind of door you're holding open."],
          ['hero', "The door-walker. The one thing on the near side that could shut it."],
          ['orin', "Could? I fell through it. I'm here to close it behind you."],
          ['hero', "Then step through, boy. Back into the dark you fell out of."]
        ],
        win: [
          ['orin', "Fine. Not this door. There's always another one."],
          ['vael', "You hold. Good. A throne over three worlds is yours, engine. And an empty Aurelia to sit on."],
          ['hero', "Then call them, Sovereign. Every Beyond-born on the near side. Call them home."]
        ],
        lose: [['vael', "Is this all an engine of this world can do? Fuel, then."]] },
      6: { goal: 'Turn on the Hollow Crown',
        intro: [
          ['sys', "Inside the Hollow Crown. Orin's door is open, and every hero on the near side comes through it."],
          ['vael', "Your heroes, engine. Hold them, as you promised."],
          ['hero', "Twelve crowns broken. Your Legion standing still. You are losing, Sovereign."],
          ['hero', "And a losing engine is only fuel for the next. The last engine eats the other."]
        ],
        win: [
          ['sys', "Tessa holds the moment still. Itsuki calls fire, wind, thunder, earth and water, and the Convergence comes apart."],
          ['hero', "Subject 12. Subject 31. Subject 00. All of you, in one room. I never learned one of your names."],
          ['sys', "In Mira's mirror, for one moment, there is only a man's outline in an engine's light."],
          ['hero', "I wanted a city that would never fall. So I built an engine. And engines only eat."],
          ['hero', "You were always fuel."]
        ] }
    },

    vega: {
      1: { zone: 'pylon', goal: 'Hold the city and fight back',
        intro: [
          ['sys', "Pylon Chamber Six. Subject 88 holds up one corner of a floating city, and has for a year."],
          ['hero', "At home the ships steered by a falling star. They named me for it. Now a whole city falls toward me."],
          ['agent', "Subject 88. The Director wants three more percent from Chamber Six. Hold still for the clamps."],
          ['hero', "Three percent is a street. A school. A thousand people. Come and clamp me yourself."]
        ],
        win: [
          ['hero', "Everything falls toward me eventually. Even Halcyon."],
          ['hero', "I won't drop the city. The people on it never did anything to me. But I won't hold it for him forever."]
        ] },
      2: { zone: 'pylon', with: 'tessa', goal: 'Keep Tessa safe in Chamber Six',
        meet: [
          ['tessa', "Hello again. I said I'd come back. Third time this week. Well, the third time you know about."],
          ['hero', "Tell me the ending again. The one where I let go."],
          ['tessa', "You set the city down one floor at a time. Nobody falls. It takes a year. You're tired, but you smile."],
          ['hero', "And Lux? Is she still in the Med-Lab?"],
          ['tessa', "Still there. Still not bottled. She says you're the only kind star she has met."],
          ['tessa', "Oh, and Halcyon's coming. They found out I visit."],
          ['hero', "Then they'll have to come through the weight first."]
        ],
        win: [
          ['tessa', "That captain had orders to move me where you can't hear me. I've seen that version. I didn't like it."],
          ['hero', "Then stay. Tell me how it ends until I believe it."],
          ['tessa', "That's the plan. It usually takes a few tellings."]
        ] },
      3: { zone: 'pylon', rival: 'convergence', goal: 'Refuse the Director his city',
        meet: [
          ['sys', "The Director comes down to Pylon Chamber Six himself."],
          ['director', "Subject 88. Your output fell four percent last night."],
          ['hero', "I set down a street. Nobody lived on it. I checked."],
          ['director', "You will hold my city, or I will find a star that will."],
          ['hero', "It's not your city. It's the people on it. And I am done holding it for you."]
        ],
        win: [
          ['director', "Drop it now, 88, and they all die. You know that."],
          ['hero', "I know. That's the only reason it's still up. Not you. Never you."],
          ['hero', "Go back up to your Spire, Director. Feel how heavy it gets when I stop being kind."]
        ],
        lose: [['director', "Gravity always wins, Subject 88. So do I."]] },
      4: { zone: 'spire', goal: 'Catch Aurelia when the pylons go',
        intro: [
          ['sys', "Rue wore Kael's face and Nyra's, and the layers went to war. Now four banners climb the Halcyon Spire."],
          ['hero', "When Kael's face opened the Sump's vents on the labs, I felt the whole city flinch. Mira says it was a copy."],
          ['agent', "Orders from the top: cut pylons one to five. If the Spire falls, the city goes with it."],
          ['hero', "He'd drop the whole city to stop us reaching him. Of course he would."],
          ['hero', "Climb, everyone. I'll take the weight. All of it."]
        ],
        win: [
          ['sys', "The pylons go dark. For one terrible second, Aurelia falls. Then it stops."],
          ['hero', "Got you. Every street. Every school. Every one of you."],
          ['hero', "Go. Reach the Engine Core. I can hold this until you do. Not much longer."]
        ] },
      5: { zone: 'pylon', foe: 'tessa', goal: 'Break the crown in Chamber Six',
        intro: [
          ['sys', "The sky splits. A voice older than the dark between worlds calls every Beyond-born home."],
          ['vael', "Star. You have carried their city long enough. Let it fall, and come home."],
          ['hero', "Let it fall... Yes. It's so heavy. It was always so heavy."],
          ['sys', "Her eyes go violet. A hollow crown hangs over her head. Aurelia drops a whole floor."]
        ],
        meet: [
          ['nyra', "Vega! The harbour still steers by you! Aldric has the floor, Maren has you. Hold on!"],
          ['tessa', "Vega. I've seen this ending. The one where you let go like this. Everybody falls."],
          ['hero', "He says it's kind. Put it all down at once, and nothing is ever heavy again."],
          ['tessa', "There's a kinder one. I told it to you in the dark. One floor at a time. Fight me for it."]
        ],
        win: [
          ['sys', "The hollow crown cracks. The violet drains out of her eyes."],
          ['hero', "Tessa. I nearly dropped it. All of it."],
          ['tessa', "But you didn't. That's the ending I kept for you."],
          ['isa', "My seal holds the city. Let go, Vega. Just for one breath."],
          ['hero', "One breath. For the first time in a year, nobody is falling. Not even me."]
        ],
        lose: [['vael', "Heavy, isn't it, little star? Put it down."], ['sys', "Aurelia drops another floor."]] },
      6: { goal: 'Hold Aurelia while everyone crosses',
        intro: [
          ['sys', "Over the Crater hangs the Hollow Crown. Orin opens a door into it, and the whole near side has to cross."],
          ['lux', "Vega! You've got the weight, I've got the light. Together!"],
          ['hero', "Feel that, Vael? Your Legion is falling toward me now."]
        ],
        win: [
          ['sys', "Itsuki strikes the last blow. The Hollow Crown falls into the Crater."],
          ['hero', "Fall, Vael. Everything does, eventually."],
          ['hero', "The Director wanted a city that never falls. Vael wanted it dropped. Neither of them asked me."],
          ['hero', "I'll set it down one floor at a time. Tessa says it takes a year. Nobody falls."],
          ['hero', "Feel the weight of the stars."]
        ] }
    },

    tessa: {
      1: { zone: 'archive', goal: 'Refuse the Director his future',
        intro: [
          ['sys', "The Archive. Subject 09 reads the future for the Director. He never asks the right question."],
          ['hero', "I've lived this year more times than I'll say. It always starts here, with the clock at nine past."],
          ['agent', "Subject 09. The Director wants the Spire projections. Now."],
          ['hero', "You say exactly that in every version. In most of them, I hand them over. Not this time."],
          ['sys', "Archive security closes in."]
        ],
        win: [
          ['hero', "Oh, that's new. I've never fought them before. New is good."],
          ['hero', "I read the Director the bad endings. The good one I keep. Time to start walking toward it."]
        ] },
      2: { zone: 'archive', with: 'isa', goal: 'Guard Isa while she reads',
        meet: [
          ['isa', "Tessa. You promised me the last page. The Director's."],
          ['hero', "Here. He loses. The city doesn't fall. Someone sets it down, slowly, one floor at a time."],
          ['isa', "That isn't in any law I've sealed for him."],
          ['hero', "Then write a different one. Your ink is the only ink that can."],
          ['hero', "The girl who sets it down is in Pylon Chamber Six. I tell her this ending every night. She needs it to be true."],
          ['agent', "Subject 09 is showing the projections to the ink-girl! Lock the Archive!"]
        ],
        win: [
          ['isa', "Every law he sealed, I sealed for him. I'll unwrite them. All of them."],
          ['hero', "That's the Final Word. I've watched you write it. It's beautiful."],
          ['isa', "Then let's see if this time I write it sooner."]
        ] },
      3: { zone: 'archive', rival: 'corvin', goal: 'Duel Corvin in the Archive',
        meet: [
          ['sys', "Crows in the Archive stacks. A gaunt young man in a feathered hood is reading over her shoulder."],
          ['corvin', "You know how it ends, Tessa. Tell me what happens to my sister."],
          ['hero', "If I tell you, you'll try to stop it, and you'll make it worse. I've seen that too."],
          ['corvin', "Then I'll read it off your watch myself. Time is only a crow that hasn't landed yet."],
          ['hero', "And omens are only guesses with feathers on. Come on, then."]
        ],
        win: [
          ['corvin', "...You saw me lose this before."],
          ['hero', "Twice. You were nicer about it the first time."],
          ['hero', "Hex will be all right, Corvin. That's all you get. Let it land on its own."]
        ],
        lose: [['corvin', "The crow landed, Tessa. Even you didn't see that one."], ['hero', "Rewind. Again."]] },
      4: { zone: 'crater', goal: 'Rewind the duel at the Crater',
        intro: [
          ['sys', "The Crater, under a violet sky. Kael and Nyra fight, each sure the other is a Halcyon agent."],
          ['hero', "Rue wore his face to open the vents, and hers to bring the drills down. Every version, they believe it."],
          ['hero', "Every version, this duel ends with one of them dead. I've watched it end nine times."],
          ['hero', "Stopwatch. Rewind. Again, until it ends differently."]
        ],
        win: [
          ['sys', "Mira holds up her mirror to the Kael who opened the vents. The glass shows nothing."],
          ['mira', "A copy has no reflection."],
          ['hero', "There. Both of them alive. I've never seen this part before."],
          ['hero', "Let Rue run. Everyone's going to need every second I just saved."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: 'Talk Vega down in Chamber Six',
        intro: [
          ['sys', "The sky splits. Vael calls every Beyond-born home, and twelve of them answer."],
          ['vael', "Little tide-reader. Come home. You already know how this ends."],
          ['hero', "I do. That's exactly why I'm not coming."],
          ['sys', "Aurelia drops a whole floor. In Pylon Chamber Six, Vega's eyes have gone violet."]
        ],
        meet: [
          ['hero', "Vega. It's me. I came to tell you the ending again."],
          ['vega', "He says letting go is the kind thing. Everyone falls, and then nothing is heavy."],
          ['hero', "I've seen that one. Everyone screaming, all the way down. Not that one."],
          ['vega', "Then make me hold it."],
          ['hero', "No. I'll make you remember how to put it down."]
        ],
        win: [
          ['sys', "The hollow crown over Vega cracks, and the violet drains from her eyes."],
          ['vega', "Tessa... you came back."],
          ['hero', "I always come back. One floor at a time, remember? Never all at once."],
          ['vega', "One floor at a time."]
        ],
        lose: [['vega', "Everything falls, Tessa. Even you."], ['hero', "Rewind. Once more."]] },
      6: { goal: 'Hold the last moment still',
        intro: [
          ['sys', "Inside the Hollow Crown, the Convergence and Vael fight side by side: the last two engines."],
          ['hero', "I've lived this moment so many times. Once, only once, it went right. I'm going to make it stay."],
          ['orin', "Tessa! The door won't hold long!"],
          ['hero', "Then I'll hold the clock."]
        ],
        win: [
          ['hero', "Stopped Clock. Vael, the Convergence, the Legion, all still. Everyone but Itsuki."],
          ['hero', "Go, Itsuki. Five elements, one blow. I've watched you do it. You always do."],
          ['sys', "The Hollow Crown falls into the Crater, and the clock starts again."],
          ['hero', "The one good ending. The one I kept to myself. Nobody I love is dead in it."],
          ['hero', "I've seen this ending before."]
        ] }
    },

    orin: {
      1: { zone: 'platform', goal: 'Get off Platform Zero',
        intro: [
          ['sys', "Platform Zero, the oldest stop in Deepline. A magenta door opens in the air, and a boy steps out of it."],
          ['agent', "That's the anomaly! Nets, now!"],
          ['hero', "Huh. Wrong platform. Hi. I'll just go back the way I..."],
          ['sys', "The door shuts behind him. Halcyon's nets come down, and hold."],
          ['hero', "Okay. Doors on the steppe never did that. Fine. I'll make my own."]
        ],
        win: [
          ['hero', "On Vharra my mum counted to ten at one end of the tent. I came out three camps away. You lot can't count that fast."],
          ['hero', "That door in the Engine? The Director's. He opened it and walked off. Somebody has to close it behind him."]
        ] },
      2: { zone: 'gallery', with: 'mira', goal: 'Hold the Gallery with Mira',
        meet: [
          ['sys', "The Observation Gallery. Orin steps out of the glass, grinning, with somebody else's bread."],
          ['mira', "You came through my glass again. It's a door for me, Orin. Not for you."],
          ['hero', "Everything's a door if you lean on it. Come on. You're one of two people who can follow me."],
          ['mira', "Follow you where?"],
          ['hero', "The Director's door, the big one in the Engine. Somebody has to close it from the other side."],
          ['mira', "And the other one who can follow you?"],
          ['hero', "Tessa. Says she's already been through every door I open. It's maddening."]
        ],
        win: [
          ['mira', "Their captain looked into my glass. He didn't like what looked back."],
          ['hero', "Ha. You, me and Tessa, then. Three Beyond-born nobody can hold."]
        ] },
      3: { zone: 'platform', rival: 'isa', goal: 'Duel Isa on Platform Zero',
        meet: [
          ['isa', "Orin. Every door you open, something comes through it. I'm sealing Platform Zero."],
          ['hero', "Seal it, and the Beyond-born still on the other side have no way out."],
          ['isa', "And if I don't, whatever is behind them gets a way in."],
          ['hero', "Then we settle it the old way. You slam, I open. Best of one."]
        ],
        win: [
          ['isa', "...Fine. Leave it open. But I'm standing beside it with my brush."],
          ['hero', "Deal. You're the only lock I'd want on my door."],
          ['isa', "That is not a compliment where I come from."],
          ['hero', "Same steppe, Isa. It is where I come from."]
        ],
        lose: [['isa', "Sealed. Think about it on the right side of the wall."]] },
      4: { zone: 'blank', goal: 'Open every cell in the Blank Wing',
        intro: [
          ['sys', "Rue wore Kael's face and Nyra's, and the layers are at war. Halcyon pulls its guards to the front."],
          ['hero', "Everyone's watching a fake Kael and a fake Nyra. Nobody's watching the Blank Wing."],
          ['hero', "Cells with no doors at all. Good thing I don't need doors."],
          ['agent', "Lock down the Blank Wing! The anomalies are walking through the walls!"]
        ],
        win: [
          ['noct', "...You opened it."],
          ['hero', "Every cell. Out you come, all of you. Noct, you too."],
          ['hero', "Hollis is writing four on the Pact. Let's go and be the fourth banner."]
        ] },
      5: { zone: 'metro', foe: 'noct', goal: 'Reach Noct in the dark Old Metro',
        intro: [
          ['sys', "The sky splits. Vael calls every Beyond-born home, and the Hollow Legion floods the metro shafts."],
          ['vael', "Door-walker. Come home. Every door leads back to me."],
          ['hero', "Nope. I walk through doors. I don't answer them."],
          ['hero', "Fear won't reach the ones who answered. Something else has to. Noct owes me a door. Let's see if that counts."]
        ],
        meet: [
          ['hero', "Noct. It's Orin. I opened your cell, remember? You never said thanks."],
          ['noct', "...Come home."],
          ['hero', "That's not you talking. You never say that much."]
        ],
        win: [
          ['sys', "The hollow crown over Noct cracks, and breaks."],
          ['noct', "...Orin. You opened my door."],
          ['hero', "And you owed me. That's it! Fear can't break the Call. A bond can. A friend, a debt, a grudge."],
          ['noct', "The Crown has a door. I have seen it, from the dark side."],
          ['hero', "Course it does. Everything's a door. Show me."]
        ],
        lose: [['sys', "The Old Metro goes black. The Call pulls harder."]] },
      6: { goal: 'Open the door into the Crown',
        intro: [
          ['sys', "Over the Crater hangs the Hollow Crown. No ship can reach it. No bridge."],
          ['hero', "Good thing I don't need a bridge. Just a door, and something to lean on."],
          ['hero', "Tessa, Mira, follow me. Everybody else, follow them."]
        ],
        win: [
          ['hero', "Vael came in through the Director's door. The Director held it open for him."],
          ['sys', "Itsuki strikes the last blow. The Crown falls into the Crater. Kessen turns the Engine backwards."],
          ['hero', "And now I'm closing it behind both of them. That's what I came here to do."],
          ['hero', "Hey, Vael. Every door you ever opened ate a world. This one ate you."],
          ['hero', "Wrong door."]
        ] }
    },

    noct: {
      1: { zone: 'blank', goal: 'Walk the dark of the Blank Wing',
        intro: [
          ['sys', "The Blank Wing. A room with no shadows, for Subject 00: the first thing that ever came back out of the Beyond."],
          ['agent', "Lights at full on Subject 00. If they so much as flicker, flood the room."],
          ['sys', "Far below, the Engine drinks. For one second, every light in the Wing flickers."],
          ['hero', "One second is enough."]
        ],
        win: [
          ['hero', "At home, nothing in the dark was there by mistake. I kept it that way."],
          ['hero', "The tear is still open. Things still come through. Someone has to keep the dark clean."]
        ] },
      2: { zone: 'ward', with: 'vesper', goal: 'Hold the Night Ward roofs',
        meet: [
          ['sys', "The Night Ward roofs. A lamp comes on. A red scarf is already at the next one."],
          ['vesper', "You're out."],
          ['hero', "You lit the alley by the Wing. I walked the dark beside it."],
          ['vesper', "Like the harbour. I lit the lamps. You kept the dark clean."],
          ['hero', "Yes."],
          ['vesper', "Halcyon's coming up the stairs. Lamps, or dark?"],
          ['hero', "Both."]
        ],
        win: [
          ['vesper', "You still don't talk much."],
          ['hero', "You still light every lamp yourself."],
          ['vesper', "Somebody has to."],
          ['hero', "Somebody has to keep the dark."]
        ] },
      3: { zone: 'metro', rival: 'sen', goal: 'Duel Sen in the Old Metro',
        meet: [
          ['sen', "Noct. I have sworn to see your blade. Once."],
          ['hero', "There is nothing to see."],
          ['sen', "Things come through the tear into the metro now. If I cannot see your blade, I will not see theirs."],
          ['hero', "...Then look."]
        ],
        win: [
          ['sen', "...I did not see it."],
          ['hero', "You almost did."],
          ['hero', "Keep looking. One day you will need to."]
        ],
        lose: [['sen', "I saw your shoulder move. Not the blade. Again."]] },
      4: { zone: 'blank', goal: 'Walk out of the room with no shadows',
        intro: [
          ['sys', "Rue wore Kael's face and Nyra's, and the layers are at war. Halcyon has locked the Blank Wing at full light."],
          ['hero', "The faceless one in the next cell. Gone a season. Now the Sky and Deepline kill each other over two faces."],
          ['hero', "I watched her cell for a year. I know what is under the faces. Nothing."],
          ['agent', "Lights at maximum! Subject 00 does not leave this room!"],
          ['orin', "Noct! Your door. Dark on the other side. I checked."]
        ],
        win: [
          ['hero', "Every light in this room. Every shadow outside it."],
          ['hero', "Tell Kael. Tell Nyra. The faces came out of the cell beside mine."]
        ] },
      5: { zone: 'metro', foe: 'sen', goal: 'Break the Call in the Old Metro',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the first thing that ever came back out of the dark answers."],
          ['vael', "Watchman. You kept the dark for a harbour. Keep it for me. Put out every light below."],
          ['hero', "...Yes."],
          ['sys', "His eye goes violet. Deepline's lamps go out, one line at a time."]
        ],
        meet: [
          ['sen', "Noct. I swore to see your blade. Tonight I will."],
          ['hero', "There is only dark."],
          ['sen', "Vesper is lighting lamps behind me as fast as you put them out. Look at the light, Noct. Then look at me."],
          ['hero', "...Draw."]
        ],
        win: [
          ['sys', "One stroke. Sen sees it at last: a thin teal line in the air. The crown splits along it."],
          ['sen', "There it was."],
          ['hero', "...You saw it."],
          ['hero', "The dark was mine before it was his. I will keep it clean."]
        ],
        lose: [['sys', "Another line of Deepline's lamps goes dark."]] },
      6: { goal: 'Keep the dark between worlds clean',
        intro: [
          ['sys', "Inside the Hollow Crown it is dark. Vael's dark. Not his."],
          ['hero', "This dark has things in it that should not be there."],
          ['hero', "Vael. Convergence. You first."]
        ],
        win: [
          ['sys', "The Crown falls. Kessen turns the Engine backwards, and the door into the Beyond closes. Almost."],
          ['hero', "Someone must stand on the threshold, and keep the dark beyond it clean."],
          ['vesper', "Then I'll light a lamp beside you."],
          ['sen', "Noct. Before you go. What did I see, in the Metro?"],
          ['hero', "There was no blade."]
        ] }
    },

    mira: {
      1: { zone: 'gallery', goal: 'Step out of the Observation Gallery',
        intro: [
          ['sys', "The Observation Gallery. Subject 03 lives behind glass, so Halcyon's guests can watch her."],
          ['citizen', "Is that the one? She looks just like a girl."],
          ['hero', "Look closer. I'm the one under the ice. The girl is somewhere else."],
          ['agent', "Subject 03 is touching the glass again. Step back from the..."],
          ['hero', "You keep me behind glass. For me, glass was always a door."]
        ],
        win: [
          ['hero', "Somewhere there's a girl with no reflection. She can keep her face. I've got everything else."],
          ['hero', "Every pane in Aurelia is a door now. Let's see who's looking back."]
        ] },
      2: { zone: 'medlab', with: 'lux', goal: 'Guard Lux in Med-Lab Sector 7',
        meet: [
          ['sys', "Med-Lab Sector 7. Mira steps out of the glass of a light-tank."],
          ['lux', "You came through the glass! Nobody comes through the glass."],
          ['hero', "Glass is a door. They've built you a room of doors and don't even know it."],
          ['lux', "They're trying to bottle me."],
          ['hero', "Light doesn't bottle. Bend it through me. Let's see how far it goes."],
          ['lux', "...Further than it's ever gone."]
        ],
        win: [
          ['lux', "Seven colours through your glass. I didn't know light could go there."],
          ['hero', "Come with me. The glass will hold the door."],
          ['lux', "Not yet. When I leave, I'm leaving in a flash. Everyone will see it."],
          ['hero', "Orin's the doors, you're the light, I'm the glass between. Whenever you're ready."]
        ] },
      3: { zone: 'gallery', rival: 'rue', goal: 'Duel Rue at the Gallery glass',
        meet: [
          ['sys', "A guest stands at the Gallery glass. Then the guest's face slides off like water."],
          ['rue', "Hello, Mira. The Director wants you quiet. I'll wear your face for the guests. Nobody will notice."],
          ['hero', "You can wear me. You can't reflect me."],
          ['rue', "What's the difference?"],
          ['hero', "Look in the glass and find out."]
        ],
        win: [
          ['sys', "In every pane of the Gallery there is Mira. Where Rue stands, the glass is empty."],
          ['rue', "Stop it. Stop showing me that."],
          ['hero', "I'm not showing you anything. That's the point. In a mirror, you're nothing."],
          ['hero', "Wear any face you like. The glass will always know."]
        ],
        lose: [['rue', "Your face fits me better than you'd think. Smile for the guests."]] },
      4: { zone: 'crater', goal: 'Find the face with no reflection',
        intro: [
          ['sys', "The Crater, under a violet sky. Kael and Nyra fight, each sure the other is Halcyon's."],
          ['hero', "Nyra saw Kael open the vents. Kael saw Nyra bring the drills down. Neither of them saw a mirror."],
          ['tessa', "I'll hold the moment as long as I can. Find the one that's wrong."],
          ['hero', "Easy. Look for the one with no reflection."]
        ],
        win: [
          ['sys', "Mira holds up her mirror to the Kael who opened the vents. The glass shows nothing."],
          ['hero', "A copy has no reflection."],
          ['kael', "That's not me. That was never me!"],
          ['hero', "Run, Rue. Every pane of glass in three layers is a door to me."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: 'Bend Lux back at the Noble Ring',
        intro: [
          ['sys', "The sky splits. Vael calls every Beyond-born home, and the Hollow Legion pours down the Skylift."],
          ['vael', "Reflection. Come home."],
          ['hero', "You're calling the girl under the ice. She isn't here. Only her reflection. And a reflection answers no one."],
          ['sys', "Over the Noble Ring a white light rises. Lux, Called, with a hollow crown over her head."]
        ],
        meet: [
          ['lux', "Mira. Get out of the light. I'm going to burn it all white."],
          ['hero', "Look into my glass first."],
          ['lux', "I don't need glass. I'm light."],
          ['hero', "You're light with a crown on it. The light that wouldn't bottle, bottled. Look."]
        ],
        win: [
          ['sys', "Mira's glass bends the white light back, and the hollow crown sees itself. It cracks."],
          ['lux', "Mira? The Ring... did I...?"],
          ['hero', "Still standing. A bit melted at the edges."],
          ['hero', "Doors and light, remember? You were never meant to go where he points you."]
        ],
        lose: [['lux', "White. Everything white. Nothing left to reflect."]] },
      6: { goal: 'Show Vael his own reflection',
        intro: [
          ['sys', "Inside the Hollow Crown, the Convergence and Vael fight side by side."],
          ['hero', "An army of the emptied, and a Sovereign who never once looked in a mirror."],
          ['orin', "Mira! Your turn. I'll hold the door."]
        ],
        win: [
          ['sys', "Mira holds her mirror up to the Sovereign. In it: a crown with nothing inside."],
          ['vael', "That... is not what I am."],
          ['hero', "It's all you are. I only show what's there. Itsuki, now. He's looking."],
          ['hero', "Somewhere there's a girl with no reflection. Today I don't mind being the other half."],
          ['hero', "The reflection wins."]
        ] }
    },

    hex: {
      1: { zone: 'rootways', goal: 'Keep the Bone Garden quiet',
        intro: [
          ['sys', "The Rootways under Deepline. Thorne's garden of bone, and the only quiet place on the near side."],
          ['hero', "On my world everything happened twice. Once when it happened, and again when it was remembered."],
          ['hero', "Here the dead just lie still. I love it."],
          ['agent', "Anomaly in the catacombs! Half-visible, female. Bag it for the Engine."],
          ['hero', "Oh, you've done it now. You'll feel this twice."]
        ],
        win: [
          ['hero', "Two seconds later. Always two seconds later. Enjoy."],
          ['hero', "Thorne will be cross about the noise. And Corvin will worry. He always worries."]
        ] },
      2: { zone: 'rootways', with: 'corvin', goal: 'Guard the Bone Garden with Corvin',
        meet: [
          ['corvin', "Hex. You're fainter than last week. Do ghosts eat? Are you eating?"],
          ['hero', "Hello, brother. Curse you. That's hello."],
          ['corvin', "My crows won't settle. They're counting the same signs they counted over our world."],
          ['hero', "You never like anything. Our world ended twice in your head before it ended once."],
          ['thorne', "Children, please. The dead are trying to rest, and Halcyon's dig crew is at the gate."],
          ['hero', "Ooh. Let's give them something to remember. Twice."]
        ],
        win: [
          ['corvin', "I would give the last of our world for you. You know that."],
          ['hero', "I know. That's why I curse you. Someone has to keep you humble."],
          ['thorne', "Tea, both of you. The bones won't mind."]
        ] },
      3: { zone: 'rootways', rival: 'rue', goal: 'Duel Rue in the Rootways',
        meet: [
          ['sys', "Someone walks into the Bone Garden wearing Thorne's face. It walks a little too politely."],
          ['hero', "Nice try. Thorne sneezes all spring. You didn't."],
          ['rue', "The Director wants the anomaly in these catacombs. That's you. Today I'm Thorne, and you come quietly."],
          ['hero', "You copied me once. Felt everything twice for a week. Want to go again?"],
          ['rue', "I can take it."],
          ['hero', "Funny. You said that last time too."]
        ],
        win: [
          ['rue', "Twice... why is it twice again..."],
          ['hero', "Because you copied a curse, faceless. Curses hit back."],
          ['hero', "Tell your Director I'm not for sale. Tell him twice."]
        ],
        lose: [['rue', "Twice the pain, half the effort. That's yours, isn't it? I do it better."]] },
      4: { zone: 'pit', goal: 'Stand with the dead in the Pit',
        intro: [
          ['sys', "Deepline is at war with the Sky. In the Pit Arena, Thorne's dead stand up for the living."],
          ['hero', "Everyone says Kael opened the vents on the labs. I saw that Kael twice. Once when it happened."],
          ['hero', "And again, two seconds later, when the world remembered it. The second time, it had no face. Rue."],
          ['thorne', "Then the war is a costume. And your other warning, Hex? The one about the sky?"],
          ['hero', "On my world, the sky split like a crown before the end. Nobody listened. Not once, not twice."]
        ],
        win: [
          ['thorne', "I believe you. So will Hollis. He is writing a fourth layer into the Pact."],
          ['hero', "Believed. Finally. It only took the end of one world."]
        ] },
      5: { zone: 'rootways', foe: 'thorne', goal: 'Break the Call in the Bone Garden',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the Legion floods down into the Roots."],
          ['vael', "Little ghost. I remember your world. I ended it. Come home, and wake every dead thing below."],
          ['hero', "...You. The crown in our sky. I remember you twice."],
          ['sys', "Her eyes go violet. In the catacombs, the dead stand up."]
        ],
        meet: [
          ['thorne', "Hex. My guests are standing. They do not like standing."],
          ['hero', "They're mine now. They die, and they get up again. Everything twice."],
          ['thorne', "The dead here asked for nothing but quiet. You came here for the same thing. Remember?"],
          ['hero', "...It's so loud."],
          ['thorne', "Then let me put them back to sleep. One by one. You last."]
        ],
        win: [
          ['sys', "One by one, the dead lie down. The hollow crown cracks, and two seconds later it cracks again."],
          ['hero', "Thorne... I woke your guests."],
          ['thorne', "They have forgiven you. The dead are very easygoing."],
          ['hero', "He ended my world, and I nearly helped him end another. Curse him. Twice."]
        ],
        lose: [['sys', "More of the dead stand up."], ['vael', "Everything twice, little ghost. Even the end."]] },
      6: { goal: 'Curse the Crown twice',
        intro: [
          ['sys', "Inside the Hollow Crown. The Legion marches in rows that never end."],
          ['corvin', "Hex. Stay by me. Please."],
          ['hero', "Curse you, brother. Fine. Side by side."],
          ['hero', "Vael. You ended our world once. I've remembered it every day since. Your turn."]
        ],
        win: [
          ['hero', "Doom Mark on the Crown. It goes off whatever you do. Then again, two seconds later."],
          ['sys', "Itsuki's blow lands. The Crown falls into the Crater, and two seconds later it falls again."],
          ['corvin', "Our world, Hex. Answered for."],
          ['hero', "He never had a chance, you know. Not from the first day he wore it."],
          ['hero', "Cursed from the start."]
        ] }
    },

    corvin: {
      1: { zone: 'crater', goal: 'Read the omens at the Crater',
        intro: [
          ['sys', "The Crater. Black crows circle a gaunt young man in a feathered hood."],
          ['hero', "My world sent the crows to watch its own end. They watched. Then they came through with me."],
          ['hero', "Now they circle this world. I don't like what they're counting."],
          ['agent', "Anomaly with birds. Net the birds, then him."],
          ['hero', "You hit me, you hit a crow. Let's see how many you can count."]
        ],
        win: [
          ['hero', "The crows say a crown is coming. They saw one over our sky, once, at the very end."],
          ['hero', "Hex will say I'm worrying. I'll go and worry at her anyway."]
        ] },
      2: { zone: 'rootways', with: 'hex', goal: 'Hold the Roots beside Hex',
        meet: [
          ['hero', "Hex. You're fainter than last week."],
          ['hex', "And you're more annoying. Curse you. Hello."],
          ['hero', "My crows won't settle. They saw the violet over our world before it ended."],
          ['hex', "Then we'll watch this one end twice. We're good at it."],
          ['hero', "No. I would give the last of our world for you. I won't watch you end."],
          ['hex', "Sweet. Halcyon's at the gate. Prove it."]
        ],
        win: [
          ['hex', "You fight like you're apologising."],
          ['hero', "Old habit. Eleven times now, to the falconer."],
          ['hex', "Make it twelve. She won't forgive you either way."]
        ] },
      3: { zone: 'skyport', rival: 'isolde', goal: 'Face Isolde at the Skyport',
        meet: [
          ['sys', "The Skyport. A falcon of ice wheels over the landing pads. Crows rise to meet it."],
          ['isolde', "Call off your birds."],
          ['hero', "I can't. They remember your falcon. They're afraid of it."],
          ['isolde', "They went for her on my first night free. Eleven apologies. Not one of them a reason."],
          ['hero', "Then here's a reason. That night they thought she was the end coming. Everything looked like the end."],
          ['isolde', "Then let's settle it. Bird against birds."]
        ],
        win: [
          ['isolde', "...Your crows didn't touch her this time."],
          ['hero', "I asked them not to. That's the twelfth apology. The first real one."],
          ['isolde', "Not enough. But closer."]
        ],
        lose: [['isolde', "Twelve apologies. Still not enough."]] },
      4: { zone: 'spire', goal: 'Climb the Spire under the crows',
        intro: [
          ['sys', "Mira's mirror has shown the truth at the Crater. Now four banners climb the Halcyon Spire."],
          ['hero', "My crows saw it before the mirror did: a Kael at the Sump's vents whose face slid when nobody was watching."],
          ['hero', "I told everyone. Nobody listens to crows. Nobody listened on my world either."],
          ['hero', "And now the crows won't look at the Spire. They're looking past it. Up."]
        ],
        win: [
          ['hero', "There. Over the Crater. A crown, coming down out of the dark between worlds."],
          ['hero', "Tell Hollis. This isn't the end of the war. It's the start of the end."]
        ] },
      5: { zone: 'skyport', foe: 'isolde', goal: 'Break the Call at the Skyport',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the Hollow Legion pours into Aurelia."],
          ['vael', "Reader of omens. I am the omen your crows watched over your world. Come home."],
          ['hero', "...You. The crown in our sky. The crows... are yours."],
          ['sys', "His eye goes violet. Ten thousand crows rise over the Skyport and put out the sun."]
        ],
        meet: [
          ['isolde', "Corvin. Your crows are back. All of them."],
          ['hero', "Every crow an omen now. The sun goes out."],
          ['isolde', "You'll owe me an apology for this one too."],
          ['hero', "...Thirteen."],
          ['isolde', "Not yet. First my falcon breaks that crown."]
        ],
        win: [
          ['sys', "The ice falcon stoops through the dark. The hollow crown shatters."],
          ['hero', "Isolde... the sun?"],
          ['isolde', "Coming back. Your crows are going home. To you."],
          ['hero', "I'm sorry. Thirteen."],
          ['isolde', "...Accepted. Once. Don't make me regret it."]
        ],
        lose: [['sys', "The crows thicken. The sun dims further."]] },
      6: { goal: 'Turn the crows on the Crown',
        intro: [
          ['sys', "Over the Crater, the Hollow Crown. The Legion fills the sky below it."],
          ['hero', "The crows watched one world end. Today they watch his."],
          ['hex', "Stay by me, brother. Curse you."],
          ['hero', "Always."]
        ],
        win: [
          ['hero', "My world sent the crows to watch its end. They waited all this time to watch his."],
          ['sys', "Itsuki strikes the last blow. The Hollow Crown falls into the Crater."],
          ['hero', "Tessa says omens are only guesses. This one wasn't."],
          ['hero', "An omen, fulfilled."]
        ] }
    },

    rue: {
      1: { zone: 'blank', goal: 'Copy your way out of the Wing',
        intro: [
          ['sys', "The Blank Wing. In the cell beside Subject 00 is something with no face, no voice and no shape."],
          ['agent', "Cell two is empty again. It could be anyone in here. It could be one of us."],
          ['hero', "It could be you. Listen. I even sound like you."],
          ['hero', "Show me a move once. I'll show it back. Better."]
        ],
        win: [
          ['hero', "Six guards, six moves. I wore the last one out to the corridor."],
          ['hero', "No face of my own. Fine. I'll wear everyone else's."],
          ['hero', "The thing in the next cell watched me go. Subject 00. I can't copy him. There's nothing to see."]
        ] },
      2: { zone: 'pit', with: 'pell', goal: 'Learn faces from Pell',
        meet: [
          ['pell', "Again. Walk like a noble. No - like a noble who owes Vesna money."],
          ['hero', "Like this?"],
          ['pell', "Better than the noble. Now a guard. Now a slum boy. Now the Director."],
          ['hero', "Pell. You teach me every face but one."],
          ['pell', "Which one?"],
          ['hero', "...Never mind. Someone's coming. A Halcyon test, you said?"],
          ['pell', "The Director wants to see what you can do. Show him."]
        ],
        win: [
          ['pell', "You wore their captain and sent his own squad home. Bravo."],
          ['hero', "You never ask what I look like. Underneath."],
          ['pell', "Would you tell me?"],
          ['hero', "...I don't know."]
        ] },
      3: { zone: 'shrine', rival: 'kiri', goal: 'Copy Kiri at the Paper Shrine',
        meet: [
          ['sys', "The Paper Shrine. A girl folds wishes for the dead, and a paper girl folds them again a moment later."],
          ['hero', "Halcyon wants the Paper Post's letters. Pell sent me to wear you and take them."],
          ['kiri', "Which me? There's two!"],
          ['hero', "Both. How hard can it be?"],
          ['kiri', "Ha! You'll see!"]
        ],
        win: [
          ['hero', "Got you. Both of you. I think. I copied you, then your double copied me copying you..."],
          ['kiri', "So which one are you now?"],
          ['hero', "...I don't know. I hate this shrine."]
        ],
        lose: [['kiri', "A copy of a copy is no use to anyone!"]] },
      4: { zone: 'crater', goal: "Wear Kael's face at the Crater",
        intro: [
          ['sys', "Rue wears Kael's face to open the Core Sump's vents on the labs, then Nyra's to lead the drills into Deepline."],
          ['hero', "Kael's face. Nyra's face. Neither one fit. I wore them anyway."],
          ['agent', "The Director is pleased. The layers are at war."],
          ['hero', "Now the Crater. The two of them face to face, each sure the other sold them out. My best show."]
        ],
        win: [
          ['sys', "Mira holds up her mirror to the Kael who opened the vents. In it there is nothing at all."],
          ['hero', "No. No, no. Don't show me that."],
          ['sys', "Rue runs, down and down, into the Drowned Line."],
          ['slick', "Oh! Hello! You fell in me. What do you look like? Underneath, I mean. I'll wait."]
        ] },
      5: { zone: 'market', foe: 'pell', goal: 'Find your own face',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home. Something with no face answers first."],
          ['vael', "Faceless one. Wear the faces of their leaders, and lead Deepline into my Legion."],
          ['hero', "Vesna. Ferra. Pell. Any face. Every face."],
          ['sys', "Her mask goes violet. All through the Neon Market, Deepline's leaders give the wrong orders."]
        ],
        meet: [
          ['pell', "Rue. Take off my face. It never suited you."],
          ['hero', "You taught me faces. Every one but mine."],
          ['pell', "I never asked for yours. That was my mistake. I'm asking now."],
          ['hero', "There is no mine!"],
          ['pell', "There is. I'm going to cut every string until we find it."]
        ],
        win: [
          ['sys', "Pell's strings cut the crown's chains one by one. The last borrowed face falls away."],
          ['hero', "Pell... whose face is this?"],
          ['pell', "Yours. It's a good one."],
          ['hero', "Then I'm keeping it."]
        ],
        lose: [['vael', "Another face, little mask. And another. And another."]] },
      6: { goal: 'Face the Crown in your own face',
        intro: [
          ['sys', "Inside the Hollow Crown, the Convergence and Vael fight side by side."],
          ['slick', "Rue! You're wearing your own face! It's a good one!"],
          ['hero', "Shut up, Slick. ...Thanks."],
          ['hero', "Vael. Convergence. Show me your moves once. That's all I need."]
        ],
        win: [
          ['hero', "Vael's chains, the Convergence's light. Copied, and sent back."],
          ['sys', "Itsuki strikes the last blow. The Crown falls into the Crater."],
          ['hero', "Kael. Nyra. I wore your faces to start a war. I won't ask you to forgive me."],
          ['hero', "Just look at me once. This one's mine."],
          ['hero', "Seen it. Done it. Better."]
        ] }
    },

    opal: {
      1: { zone: 'glasssea', goal: 'Keep Halcyon off the Glass Sea',
        intro: [
          ['sys', "The Glass Sea. Half a mile of desert turned to crystal in one frightened night."],
          ['hero', "I fell out of the sky. I was so scared. Everything I touched turned to crystal."],
          ['agent', "That's the anomaly that made the Glass Sea. Take her alive. The Engine wants her."],
          ['hero', "Please don't. When I'm scared, it grows."],
          ['sys', "Crystal grows from her feet."]
        ],
        win: [
          ['hero', "I'm sorry. I'm so sorry. They're crystal to the knee."],
          ['hero', "Lux would know what to do. Lux is somewhere in that sky, and I'm down here making glass."]
        ] },
      2: { zone: 'glasssea', with: 'brakk', goal: 'Hold the Glass Sea with Brakk',
        meet: [
          ['brakk', "Opal. You are crying in the glass again."],
          ['hero', "Brakk! I made more. Halcyon came, and I got scared."],
          ['brakk', "Up. My shoulder."],
          ['hero', "I'm too heavy. I'm glass."],
          ['brakk', "I dug through four hundred metres of rock. Up."],
          ['hero', "...Okay. Lux used to carry me like this, at home."],
          ['brakk', "Then I carry you until she can."]
        ],
        win: [
          ['brakk', "There. Nobody broke."],
          ['hero', "Your shoulder is the safest place on the near side."],
          ['brakk', "Mountains are good for sitting on. Hollis taught me that."]
        ] },
      3: { zone: 'glasssea', rival: 'dune', goal: 'Duel Dune on the Glass Sea',
        meet: [
          ['dune', "Glass-girl. My desert is dying under your crystal."],
          ['hero', "I know. I'm sorry. I'm always sorry."],
          ['dune', "Sorry does not turn glass back into sand."],
          ['hero', "Then what do you want from me?"],
          ['dune', "To see if you can stop it. Fight me, and grow not one crystal."]
        ],
        win: [
          ['dune', "...Not one crystal. So you can control it."],
          ['hero', "Only when I'm not afraid. You didn't scare me. You just wanted your desert back."],
          ['dune', "I have not forgiven the glass."],
          ['hero', "Neither have I."]
        ],
        lose: [['dune', "Crystal again. You are still afraid, glass-girl."]] },
      4: { zone: 'meridian', goal: 'Stop the drills at the Meridian',
        intro: [
          ['sys', "Halcyon's drills sink into the Buried Meridian. Up top, everyone blames everyone else."],
          ['hero', "Tarn says Kael vented the Sump on the Sky, and Nyra led the drills below. Brakk says faces lie. Hands don't."],
          ['dune', "Glass-girl. The drills are under my city. Can your crystal stop a drill bit?"],
          ['hero', "You want my glass? In your desert?"],
          ['dune', "For one night. Only one."]
        ],
        win: [
          ['sys', "Crystal grows around the drill-heads and holds them fast."],
          ['dune', "...The glass helped."],
          ['hero', "Your desert is still sand under there. I didn't touch any of it. I promise."]
        ] },
      5: { zone: 'glasssea', foe: 'brakk', goal: 'Break the Call on the Glass Sea',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the Legion marches across the Surface."],
          ['vael', "Child of crystal. You were afraid on your first night here. Be afraid again. Glass it all."],
          ['hero', "...So scared. Everything I touch..."],
          ['sys', "Her eyes go violet. The Glass Sea starts to spread across the Surface."]
        ],
        meet: [
          ['brakk', "Opal. You are crying in the glass again."],
          ['hero', "Brakk... go away. I'll turn you to crystal."],
          ['brakk', "Then I will be a crystal mountain. Up. My shoulder."],
          ['hero', "I can't stop it."],
          ['brakk', "You do not have to stop. You only have to hold on."]
        ],
        win: [
          ['sys', "Brakk carries her out of the glass on his shoulder. The hollow crown cracks against the sky."],
          ['hero', "Brakk, you're... you're glass to the elbow."],
          ['brakk', "It is pretty. I will keep it."],
          ['hero', "Second time you've carried me out. I'll never be scared up here."]
        ],
        lose: [['vael', "Afraid, child? Good. Glass him too."]] },
      6: { goal: 'Shatter the Crown like glass',
        intro: [
          ['sys', "Inside the Hollow Crown. Far above, Lux and Vega hold Aurelia in the sky."],
          ['lux', "Opal! Stay bright for me!"],
          ['hero', "I'm not scared, Lux. I'm on Brakk's shoulder. Vael, listen. Shatter Song."]
        ],
        win: [
          ['hero', "Every crystal I ever grew, I grew afraid. Today I grew them on purpose, all through the Crown's walls."],
          ['sys', "Shatter Song, and Itsuki's last blow. The Crown cracks like glass and falls into the Crater."],
          ['hero', "Look, Lux. All that light coming through the cracks."],
          ['hero', "Pretty. And broken."]
        ] }
    },

    lux: {
      1: { zone: 'medlab', goal: 'Refuse to be bottled',
        intro: [
          ['sys', "Med-Lab Sector 7. Halcyon has a jar, a lid, and a girl made of light."],
          ['agent', "Containment at ninety percent. Close the lid."],
          ['hero', "One beam goes in, seven come out. Your lid has a lot of maths to do."],
          ['agent', "Why won't it hold her?"],
          ['hero', "Light doesn't bottle. Didn't anyone tell you?"]
        ],
        win: [
          ['hero', "On my world I carried the light into the gardens. Here they want to carry me into an engine."],
          ['hero', "They'll try again tomorrow. Let them. Every time they try, I learn this lab a little better."],
          ['hero', "Opal's out there somewhere. Hold on, little sister. I'm coming."]
        ] },
      2: { zone: 'range', with: 'yara', goal: 'Hold the Firing Gallery with Yara',
        meet: [
          ['sys', "The Firing Gallery. Halcyon wheels in a tank of light and sets it beside its best marksman."],
          ['yara', "They want me to shoot with your light. At that target, a mile out."],
          ['hero', "That's not a ship. That's a town on the Surface. I've seen the maps on the lab wall."],
          ['yara', "...I knew it. I always knew it."],
          ['hero', "Then shoot something else. Put me on the string. I'll show you how."],
          ['yara', "It's carrying further than I've ever shot."],
          ['hero', "Wait till you meet Mira. Her glass bends me further still."]
        ],
        win: [
          ['yara', "Their captain's down. One arrow, the length of the Gallery."],
          ['hero', "Best eye I've met. You gave my light somewhere to go."],
          ['yara', "You gave my arrows something to carry."]
        ] },
      3: { zone: 'range', rival: 'yara', goal: 'Contest the light with Yara',
        meet: [
          ['yara', "Halcyon made me an offer. Keep shooting light for them, and they let the other Gallery Subjects go."],
          ['hero', "With my light? At their targets?"],
          ['yara', "It's my string now, Lux. I'm the one who aims it."],
          ['hero', "Then I'll take my light back off it. Draw."]
        ],
        win: [
          ['yara', "...All right. It's your light."],
          ['hero', "It's ours. But it never flies for Halcyon. Not for any offer."],
          ['yara', "Never at a town. Never for them. You have my word."]
        ],
        lose: [['yara', "A mile, every time. The string decides."]] },
      4: { zone: 'medlab', goal: 'Escape the Med-Lab in a flash',
        intro: [
          ['sys', "The layers are at war. Someone wearing Kael's face opened the Core Sump's vents on these labs."],
          ['agent', "Steam in the labs! Deepline attacked us! Seal the tanks!"],
          ['hero', "I watched that Kael walk through the steam. The light bent wrong round his face. That was a mask."],
          ['hero', "And while everyone's shouting about Deepline, nobody is watching my lid."]
        ],
        win: [
          ['sys', "Blinding Flash. When the lab can see again, the tank is empty."],
          ['hero', "Told you. Light doesn't bottle."],
          ['hero', "Opal, I'm coming. Vega, hold on. Mira, I've got a lot of light for you to bend."]
        ] },
      5: { zone: 'noble', foe: 'yara', goal: 'Break the Call over the Noble Ring',
        intro: [
          ['sys', "The sky splits. Vael calls every Beyond-born home, and the Legion pours down on Aurelia."],
          ['vael', "Light. Every colour you have, in one point. Burn their Ring white."],
          ['hero', "...White. All of it. No colours left."],
          ['sys', "Her eyes go violet. The Noble Ring begins to glow white-hot."]
        ],
        meet: [
          ['yara', "Lux! You taught me light on the string. Look at me."],
          ['hero', "Every colour in one point. White. Nothing left to see."],
          ['yara', "Then I'll put a colour back. From a mile away."],
          ['hero', "You never miss..."],
          ['yara', "I'm not starting now."]
        ],
        win: [
          ['sys', "One arrow, drawn for a whole breath. It takes the crown off her head at a mile."],
          ['hero', "Yara? The Ring... is it...?"],
          ['yara', "Still standing. The opera house is a bit melted."],
          ['hero', "You shot the crown off my head. At a mile."],
          ['yara', "You taught me."]
        ],
        lose: [['sys', "The Noble Ring burns whiter."], ['vael', "No colours, little light. Only white."]] },
      6: { goal: 'Hold Aurelia up with Vega',
        intro: [
          ['sys', "Over the Crater, the Hollow Crown. Orin opens a door into it, and everyone has to cross."],
          ['vega', "Lux. I've got the weight. Give me light to hold it by."],
          ['hero', "Every beam I have. Hold on, kind star."]
        ],
        win: [
          ['hero', "Mira's bending me through the Crown. Opal's on Brakk's shoulder. Yara's taking the shot."],
          ['sys', "Itsuki strikes the last blow. The Hollow Crown falls into the Crater."],
          ['hero', "And the city's still up. Every street. Vega, you did it."],
          ['vega', "We did."],
          ['hero', "Light always finds a way."]
        ] }
    },

    slick: {
      1: { zone: 'waterworks', goal: 'Squelch the Halcyon pump crew',
        intro: [
          ['sys', "The Waterworks above the Sump. A friendly puddle has been stepped in for a month."],
          ['hero', "Hello! Oh, you stepped in me. That's fine. That's how I meet everyone."],
          ['citizen', "The puddle talked!"],
          ['agent', "Slime anomaly in the pipes. Vacuum it up for the Engine."],
          ['hero', "Vacuum? Nobody's ever tried to vacuum me. What a new way to meet people!"]
        ],
        win: [
          ['hero', "Squash me flat, I come back together. Squash me again, still friendly."],
          ['hero', "But I don't want to go in an engine. The bee lady says engines never say sorry."]
        ] },
      2: { zone: 'choir', with: 'nami', goal: 'Hold the Drowned Line with Nami',
        meet: [
          ['nami', "Oh! I'm sorry. I stepped in you."],
          ['hero', "You said sorry! Nobody says sorry! Hello! I'm Slick!"],
          ['nami', "You're... a puddle."],
          ['hero', "Mostly. Can I follow you home?"],
          ['nami', "Home is the Drowned Line. It's flooded."],
          ['hero', "Perfect!"],
          ['nami', "Halcyon's drill crew is coming down the shaft. Stay behind me."]
        ],
        win: [
          ['nami', "You held the flood back. You're harder to hurt than you look."],
          ['hero', "Everyone says that after they hit me. Can I stay?"],
          ['nami', "You already followed me home."],
          ['hero', "Can I bring a friend? There's a lady with no face who walks past sometimes. She looks lonely."]
        ] },
      3: { zone: 'choir', rival: 'nami', goal: 'Hold the water against Nami',
        meet: [
          ['nami', "Slick. If you live on the Drowned Line, you hold the water when the Line rises. Show me you can."],
          ['hero', "A test! I love tests. Do I win something?"],
          ['nami', "A place to sleep that isn't the floor."],
          ['hero', "I am the floor! But okay!"]
        ],
        win: [
          ['nami', "...You won."],
          ['hero', "Did I? Let's say you did. You said sorry once. That's worth more."],
          ['nami', "That's not how winning works."],
          ['hero', "It is for puddles."]
        ],
        lose: [['nami', "Sorry! Did I step in you again?"], ['hero', "Best loss ever!"]] },
      4: { zone: 'choir', goal: 'Hold back the drills with Nami',
        intro: [
          ['sys', "The layers are at war. Halcyon's drills, led by someone wearing Nyra's face, reach the Drowned Line."],
          ['hero', "Everyone says Nyra brought the drills. Nami says Nyra sings for the Husks. That doesn't sound like a driller."],
          ['nami', "Slick, hold the water. The drills are coming through the wall."],
          ['hero', "Holding! Squishing! Being stepped in, mostly!"]
        ],
        win: [
          ['sys', "Someone falls down the shaft into the Drowned Line, and into Slick. She's wearing Kael's face. It slides off."],
          ['hero', "Oh! Hello! You fell in me. You've got two faces. No, three. Which one's yours?"],
          ['rue', "None of them."],
          ['hero', "What do you look like underneath? I'll wait. I'm very good at waiting."]
        ] },
      5: { zone: 'waterworks', foe: 'nami', goal: 'Break the Call at the Waterworks',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the Legion floods up the metro shafts."],
          ['vael', "Little puddle. Everything that walks steps in you. Drown them for it. All of them."],
          ['hero', "...They step in me. Everyone steps in me."],
          ['sys', "His eyes go violet. The Waterworks burst, and the Drowned Line begins to rise."]
        ],
        meet: [
          ['nami', "Slick. Stop. It's me."],
          ['hero', "You stepped in me. Everyone steps in me."],
          ['nami', "I know. And I'm sorry. For the first time, and every time after."],
          ['hero', "...Sorry?"],
          ['nami', "Sorry. Now come home."]
        ],
        win: [
          ['sys', "The hollow crown dissolves like sugar in water."],
          ['hero', "Nami! You said sorry again! That's twice!"],
          ['nami', "Don't make me say it a third time."],
          ['hero', "Okay! Help me put the water back. Apis's bees hate getting wet."]
        ],
        lose: [['sys', "The water rises another metre."]] },
      6: { goal: 'Squash the Hollow Legion flat',
        intro: [
          ['sys', "Inside the Hollow Crown, the Legion marches in rows that never end."],
          ['hero', "That's a lot of feet. Hello, everyone! Watch where you step!"],
          ['rue', "Slick. Stay close."],
          ['hero', "Rue! Your face! It's lovely!"]
        ],
        win: [
          ['hero', "Vael stepped on whole worlds his whole life. Never said sorry once."],
          ['sys', "Itsuki strikes the last blow. The Crown falls into the Crater, right into a very large puddle."],
          ['hero', "Oh. Hello, Crown. You're in me now."],
          ['hero', "You stepped in it."]
        ] }
    },

    apis: {
      1: { zone: 'glowwild', goal: 'Keep the last swarm alive',
        intro: [
          ['sys', "The Glowwild. A cloud of glowing bees, and a girl in a small gold crown."],
          ['hero', "My hive was the size of a world. An engine drank it dry. This is what's left. One swarm, and me."],
          ['hero', "So when I say an engine is coming, I know what an engine looks like."],
          ['agent', "Insect anomaly. Smoke the swarm, bag the queen. The Engine wants her."],
          ['hero', "Smoke? Oh, you poor thing. You poked a hive."]
        ],
        win: [
          ['hero', "Every sting adds a bee. At eight, they all go. Ask your friends."],
          ['hero', "Halcyon's Engine is still a baby. I've seen what it grows up to be."]
        ] },
      2: { zone: 'glowwild', with: 'ume', goal: 'Guard the Glowwild with Ume',
        meet: [
          ['ume', "Your bees are starving. Let them in."],
          ['hero', "Into a garden of poison?"],
          ['ume', "Beautiful poison. They're clever. They'll find the safe flowers."],
          ['hero', "Nobody's let them near anything since we came through."],
          ['ume', "Then I'm the first. Don't touch the purple ones."],
          ['hero', "A puddle called Slick brings us honey too. We don't ask where from. Halcyon's coming. Bees, up!"]
        ],
        win: [
          ['ume', "Their honey is the only safe sweet thing in the Glowwild now."],
          ['hero', "You fed my hive when nobody else would. The hive remembers. So do I."]
        ] },
      3: { zone: 'glowwild', rival: 'kestra', goal: 'Duel Kestra in the Glowwild',
        meet: [
          ['sys', "Fire moths drift over the Glowwild. Every bee goes very quiet."],
          ['kestra', "Your bees stung my moths out of the air over the Ballast vents."],
          ['hero', "Your moths set fire to Ume's hedges. My bees took it personally."],
          ['kestra', "Moths and bees don't share a sky. Matter of principle."],
          ['hero', "Then let's decide whose sky it is."]
        ],
        win: [
          ['kestra', "Fine. The Glowwild is yours. The undercroft is mine."],
          ['hero', "Deal. Keep your moths off Ume's garden."],
          ['kestra', "Keep your bees off my fan."]
        ],
        lose: [['kestra', "Fire beats honey. Every time."]] },
      4: { zone: 'meridian', goal: 'Make them listen at the Meridian',
        intro: [
          ['sys', "Halcyon's drills sink into the Buried Meridian, and the layers blame each other."],
          ['hero', "My bees followed the drill crews. The girl who led them into Deepline wore Nyra's face. She smelled of nothing."],
          ['hero', "And drills are only the start. Listen to me. This is what an engine does before it eats a world."],
          ['citizen', "Lady, there are drills in the sand. Save the bedtime story."]
        ],
        win: [
          ['hero', "Drills stopped. Fine. Now will anybody listen?"],
          ['ume', "I'm listening."],
          ['hero', "One gardener. And a puddle. That's a start. Not enough. Yet."]
        ] },
      5: { zone: 'glowwild', foe: 'ume', goal: 'Break the Call in the Glowwild',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the Legion marches into the Glowwild."],
          ['vael', "Little queen. I drank your hive. There is a place for you in my engine. Come home, and bring the swarm."],
          ['hero', "...Home. The hive is there. All of them, humming."],
          ['sys', "Her eyes go violet. The swarm turns on the Glowwild and starts to eat it."]
        ],
        meet: [
          ['ume', "Apis. Your bees are eating my garden."],
          ['hero', "The hive is calling. The whole world-hive."],
          ['ume', "Your hive is gone. He drank it. The bees you have left live here, in my garden."],
          ['hero', "...Your garden."],
          ['ume', "The one with the purple flowers. Don't touch those."]
        ],
        win: [
          ['sys', "The swarm hangs over the Glowwild. Then it comes back to Ume's flowers, and the crown breaks."],
          ['hero', "Ume... I ate your hedges."],
          ['ume', "They grow back. Beautiful things do."],
          ['hero', "He drank my hive, and then he called me home. Now I'm going to go and poke him."]
        ],
        lose: [['sys', "The swarm eats another acre of the Glowwild."]] },
      6: { goal: 'Sting the Crown from inside',
        intro: [
          ['sys', "Inside the Hollow Crown. An engine the size of a city, humming."],
          ['hero', "I know this hum. It's the last thing my hive ever heard."],
          ['hero', "Waggle Dance. Everybody, this way. I know where an engine keeps its heart."]
        ],
        win: [
          ['hero', "That's what an engine becomes when nobody switches it off. And that's what it looks like switched off."],
          ['sys', "Itsuki strikes the last blow. The Hollow Crown falls into the Crater."],
          ['hero', "My hive, answered for. My swarm, alive. Ume's garden, a little bit eaten."],
          ['hero', "Never poke a hive."]
        ] }
    },

    mika: {
      1: { zone: 'crater', goal: 'Never touch the ground',
        intro: [
          ['sys', "The Crater. A rift tears open and three travellers fall out of it. One of them never lands."],
          ['hero', "One moon? Only one? Everyone here must be so heavy."],
          ['ryo', "Mika. Halcyon troops on the rim."],
          ['itsuki', "Leave some for me!"],
          ['hero', "Not touching the ground, boys. Let's see who keeps up."]
        ],
        win: [
          ['hero', "On my world children jump before they walk. Here they fall over and call it gravity."],
          ['ryo', "This tear is bigger than any we've closed."],
          ['hero', "Then we stay until it's closed. I'm in no hurry to come down anyway."]
        ] },
      2: { zone: 'noble', with: 'coda', goal: 'Teach Coda to leap',
        meet: [
          ['coda', "You're the one who never comes down. Teach me."],
          ['hero', "To leap?"],
          ['coda', "Without a net. Pell ties a string to every step I take. I want one leap that's mine."],
          ['hero', "Then don't look down. Look up. Count the moons."],
          ['coda', "There's only one."],
          ['hero', "Then imagine the other. That's the whole trick."]
        ],
        win: [
          ['coda', "I leapt! No string! Nobody pulled me!"],
          ['hero', "One week. You learned it faster than I did."],
          ['coda', "Faster than you?"],
          ['hero', "...No. But close. Ryo will be unbearable about it. He said you would."]
        ] },
      3: { zone: 'skyport', rival: 'sora', goal: 'Outlast Sora above the Skyport',
        meet: [
          ['sora', "You! Moon girl! You stayed up eleven minutes yesterday!"],
          ['hero', "Twelve. You stopped counting at the end."],
          ['sora', "Kites count. Kites stay up forever."],
          ['hero', "Kites have strings. I don't."],
          ['sora', "First one to touch the ground loses!"]
        ],
        win: [
          ['sora', "...You never came down. Not once."],
          ['hero', "Two moons. You learn young."],
          ['sora', "One day I'll bring you down. Just once."],
          ['hero', "One day. Not today."]
        ],
        lose: [['sora', "Ha! Higher than you! Again?"]] },
      4: { zone: 'noble', goal: 'Hold the rafters while Coda leaps',
        intro: [
          ['sys', "The Siege of the Noble Ring. The layers are at war, and the opera is still playing."],
          ['hero', "Someone wore Kael's face to start this. Now the whole Ring thinks Deepline is coming up the Skylift to kill them."],
          ['coda', "Mika. Tonight I cut the strings. Mid-dance. In front of everyone."],
          ['hero', "Then I'll be in the rafters. Leap, and I'll be there. No net."]
        ],
        win: [
          ['sys', "Coda cuts her strings and leaps. She does not need catching."],
          ['hero', "I didn't catch her. She didn't need me to."],
          ['coda', "No net!"],
          ['hero', "...Okay. I'm crying a bit. Up here, where nobody can see."]
        ] },
      5: { zone: 'skylift', foe: 'sora', goal: 'Break the Call on the Skylift',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the Legion pours down the Skylift."],
          ['vael', "Moon child. This world drags you down. Come home, where nothing ever falls. Cut their cables."],
          ['hero', "...Nothing falls. Nothing lands. Cut them."],
          ['sys', "Her eyes go violet. Her crescent blades bite into the Skylift cables."]
        ],
        meet: [
          ['sora', "Mika! Get off those cables!"],
          ['hero', "Nobody here touches the sky. Let them fall."],
          ['sora', "Gale's holding the cars up on the wind. I'm holding you. Come down!"],
          ['hero', "Nobody brings me down."],
          ['sora', "First time for everything!"]
        ],
        win: [
          ['sys', "Sora's kite wraps round her, and for the first time Mika touches the ground. The crown breaks on it."],
          ['hero', "Sora... I'm on the ground. You brought me down."],
          ['sora', "First time ever! I win!"],
          ['hero', "You win. Just this once. Now help me up. Up, up."]
        ],
        lose: [['sys', "Another Skylift cable snaps."], ['sora', "She's too high! Gale, hold the cars!"]] },
      6: { goal: 'Stay above the Hollow Legion',
        intro: [
          ['sys', "Inside the Hollow Crown. Below it, the Legion fills the Crater from rim to rim."],
          ['ryo', "Mika. With me."],
          ['hero', "Always. Itsuki, try to keep up."],
          ['itsuki', "I'm the strongest in any world."],
          ['hero', "And still on the ground."]
        ],
        win: [
          ['sys', "Itsuki's last blow lands. The Crown falls, and the Legion goes still."],
          ['hero', "Three of us came through the rift. Three of us still here."],
          ['ryo', "Then we close this tear properly. Together."],
          ['hero', "Look up. One moon tonight, and it's full. It'll do."],
          ['hero', "Goodnight, under the full moon."]
        ] }
    },

    ryo: {
      1: { zone: 'crater', goal: 'Hold the Crater rim',
        intro: [
          ['sys', "The Crater rim. Above it hangs the largest tear Ryo has ever seen."],
          ['hero', "We've closed three tears. This one is bigger than all three together."],
          ['itsuki', "So we close it today."],
          ['hero', "So we close it properly. Look. Halcyon is already here."],
          ['agent', "Two anomalies on the rim! Take the one in black and white first!"]
        ],
        win: [
          ['hero', "Light in one hand, dark in the other. Both hands hit."],
          ['hero', "An engine made this tear, Itsuki. Find the engine, and the tear can close."],
          ['itsuki', "Then we find it today."]
        ] },
      2: { zone: 'village', with: 'hollis', goal: 'Hold the Village gate with Hollis',
        meet: [
          ['sys', "The Hidden Village. An old man gives three strangers a room, and listens to them all night."],
          ['hollis', "Two sides in balance, at your age. I kept three for a lifetime."],
          ['hero', "And are they still kept?"],
          ['hollis', "Barely. That's what balance is. Barely, every day."],
          ['hero', "Itsuki wants to rush. I want to wait."],
          ['hollis', "Then between you, you'll be on time. Ah. Halcyon at the gate. On time, too."]
        ],
        win: [
          ['hollis', "You fight like a scale. Left, then right. Never the same side twice."],
          ['hero', "Same side twice, I lose the balance."],
          ['hollis', "Stay as long as you like. The village could use someone who knows that."]
        ] },
      3: { zone: 'crater', rival: 'itsuki', goal: 'Spar with Itsuki on the rim',
        meet: [
          ['itsuki', "Spar. Now. I watched Kael throw thunder in Deepline. I want to try it on you."],
          ['hero', "We have a tear to watch."],
          ['itsuki', "The tear isn't going anywhere. That's the problem!"],
          ['hero', "One round. Then we do it my way."]
        ],
        win: [
          ['itsuki', "...Again. That wasn't a win."],
          ['hero', "It wasn't a loss either."],
          ['itsuki', "Neither wins. Like always."],
          ['hero', "Like always. Now we wait."]
        ],
        lose: [['itsuki', "Fire, wind, thunder. Too fast for you, brother."]] },
      4: { zone: 'tethers', goal: 'Close the small tears',
        intro: [
          ['sys', "The layers are at war. Every time the Engine pulls harder, small tears open across the Surface."],
          ['hero', "Tarn says Kael vented the Sump on the Sky. Itsuki was fighting Kael in the Old Metro that night."],
          ['itsuki', "So somebody's wearing faces. Not our problem. Tears are."],
          ['hero', "Everything is our problem. That's balance. Left side, right side. Close them."]
        ],
        win: [
          ['hero', "Seven small tears closed. Not the big one. Not yet."],
          ['itsuki', "The big one needs the engine stopped."],
          ['hero', "Then the layers have to stop fighting each other first. Tell Hollis."]
        ] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Stand with Kael against Itsuki',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home. At the Tether Fields, Ryo answers, and tips everything over."],
          ['hollis', "Ryo. Two sides, boy. Not one. Come back to the middle."],
          ['sys', "Hollis's palm lands. Ryo's crown breaks. He goes straight to the Ash Dunes, through the Legion."],
          ['tarn', "Ryo! Itsuki beat Ivo, me, Jax and Brann. Nothing stands in front of him!"]
        ],
        meet: [
          ['hero', "Itsuki. Brother. Look at me."],
          ['itsuki', "Step aside, Ryo. Nothing on the near side can stand in front of me."],
          ['kael', "Then two of us will. We never finished, remember?"],
          ['hero', "You always wanted to rush. Today I rush with you."]
        ],
        win: [
          ['sys', "Light, dark and thunder at once. The hollow crown over Itsuki breaks."],
          ['itsuki', "Ryo... how many people did I hurt?"],
          ['hero', "Four. Ivo, Tarn, Jax, Brann. All alive."],
          ['sys', "Itsuki gets up anyway."],
          ['hero', "That's my brother."]
        ],
        lose: [['itsuki', "Not today, brother. Today I win."]] },
      6: { goal: 'Bring the balance back',
        intro: [
          ['sys', "Over the Crater, the Hollow Crown. The Convergence and Vael, side by side."],
          ['hero', "Two engines. One that ate a man, one that ate worlds. Neither knows how to stop."],
          ['itsuki', "Then we stop them. Together, brother."],
          ['hero', "Today, we rush."]
        ],
        win: [
          ['sys', "Itsuki calls the Five Calamities and strikes the last blow. The Crown falls into the Crater."],
          ['kael', "That thunder at the end. That was mine, wasn't it?"],
          ['hero', "It was. You stood beside me when he was lost. Now you stand beside him."],
          ['hero', "Kessen turns the Engine back, and the biggest tear we've ever seen closes. Light and dark. Rush and wait."],
          ['hero', "Brother, between us, we were right on time."],
          ['hero', "Balance restored."]
        ] }
    },

    // The strongest fighter in any world. Vael's champion; strikes the last blow.
    itsuki: {
      1: { zone: 'crater', goal: 'Clear the Crater rim',
        intro: [
          ['sys', "The Crater rim. A calm young man with white hair and crimson horns. Fire, wind, thunder, earth and water turn around him."],
          ['hero', "Five elements, five worlds. On each one I stayed long enough to learn from its best."],
          ['agent', "Anomaly on the rim! Five energy readings! Full squad!"],
          ['hero', "One squad? Send the rest. I'm not warm yet."]
        ],
        win: [
          ['hero', "Nothing on this side has stood in front of me yet."],
          ['ryo', "Itsuki. We came to close the tear."],
          ['hero', "We'll close it. But this world has a best at every element. I want to meet all five."]
        ] },
      2: { zone: 'stacks', with: 'gale', goal: 'Earn a wind lesson from Gale',
        meet: [
          ['hero', "You're Gale. The best wind on this world. Teach me."],
          ['gale', "Sure. For a price."],
          ['hero', "I have no money. I have four other elements."],
          ['gale', "Can't eat elements. Ryo said you'd say that."],
          ['hero', "Ryo talks too much. Name the price."],
          ['gale', "Halcyon's got a squad sitting on my updraft. Clear it with me, and we'll talk."],
          ['ryo', "Mika's watching from the top of the Stacks. She says try not to fall."]
        ],
        win: [
          ['gale', "Okay. That was worth a lesson. Maybe two."],
          ['hero', "Your wind is better than the wind on my second world. Don't tell it I said that."],
          ['gale', "Price just went up."]
        ] },
      3: { zone: 'metro', rival: 'kael', goal: 'Challenge Kael in the Old Metro',
        meet: [
          ['sys', "The Old Metro. A Deepline boy with static in his hair throws thunder down the tunnel."],
          ['hero', "You! The thunder of this world! I challenge you!"],
          ['kael', "Who are you? Some other world's runaway?"],
          ['hero', "Itsuki. I learned thunder on my third world. Yours is wilder. Show me."],
          ['kael', "You want to learn thunder by losing to it? Not yet."]
        ],
        win: [
          ['kael', "...Not bad. Still undecided."],
          ['hero', "We're not finished."],
          ['kael', "Halcyon's coming down the tunnel. We'll finish later."],
          ['hero', "Later, then. Don't lose to anyone else first."]
        ],
        lose: [['kael', "Learn it by losing, huh? Lesson one."]] },
      4: { zone: 'crater', goal: 'Learn from the best of each element',
        intro: [
          ['sys', "The layers are at war over faces Rue wore. Mira's mirror has just shown the truth at the Crater."],
          ['hero', "Kael opened the vents on the Sky? Kael was in the Old Metro that night, fighting me. We never finished."],
          ['hero', "Somebody wore his face. Fine. Meanwhile the best of this world are all in one place."],
          ['pyra', "You're the one who wants to learn fire from me? Keep up."],
          ['hero', "Pyra, fire. Gale, wind. Kael, thunder. Brakk, earth. Nami, water. Show me, and I'll show you Halcyon on its back."]
        ],
        win: [
          ['hero', "Five elements, five teachers, one world. I've never had that before."],
          ['nami', "You learn fast."],
          ['hero', "I learn from the best. And here, the best are finally on the same side."]
        ] },
      5: { zone: 'dunes', foe: 'ryo', goal: 'Break the Call in the Ash Dunes',
        intro: [
          ['sys', "The sky splits. Vael calls the Beyond-born home, and the Legion fills the Ash Dunes from edge to edge."],
          ['vael', "Champion. You learned from five worlds. Now learn from me. Break their Surface, and everything on it."],
          ['hero', "...Nothing on the near side can stand in front of me."],
          ['sys', "His eyes go violet. In the Ash Dunes, Ivo falls. Then Tarn. Then Jax. Then Brann."]
        ],
        meet: [
          ['ryo', "Itsuki. Brother. Look at me."],
          ['hero', "Step aside, Ryo. Nobody can stand in front of me."],
          ['kael', "Two of us can. We never finished, remember?"],
          ['ryo', "You always wanted to rush. Today we rush together."]
        ],
        win: [
          ['sys', "Light, dark and thunder at once. The hollow crown breaks, and Itsuki falls to his knees."],
          ['hero', "Ryo... how many people did I hurt?"],
          ['ryo', "Four. Ivo, Tarn, Jax, Brann. All alive."],
          ['sys', "Itsuki gets up anyway."],
          ['hero', "Then I owe four people. And Vael owes everyone."]
        ],
        lose: [['vael', "My champion. Again. Break them all."]] },
      6: { goal: 'Strike the last blow',
        intro: [
          ['sys', "Inside the Hollow Crown. Tessa holds the moment still. Mira shows Vael his own reflection."],
          ['hero', "Pyra, fire. Gale, wind. Kael, thunder. Brakk, earth. Nami, water. Give me everything you've got."],
          ['kael', "We still haven't finished, you know. Don't you dare lose."]
        ],
        win: [
          ['hero', "The Five Calamities. Not mine. Theirs. Everything I learned, from the people who taught it to me."],
          ['sys', "The last blow lands. The Convergence comes apart into light. The Hollow Crown falls into the Crater."],
          ['sys', "The Hollow Legion goes still, all at once, like an army finally allowed to stop."],
          ['hero', "Ivo. Tarn. Jax. Brann. I'll make it right, one at a time."],
          ['ryo', "Brother. Rest."],
          ['hero', "Five paths. One end."]
        ] }
    }
  });
})();
