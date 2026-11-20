'use strict';
// Shattered Worlds - The Hollow Crown: the rescue scenes for the heroes of Aurelia, the Sky.
// Data only; js/saga/saga-rescue.js plays them. Speakers: 'hero' (the hero being played: any of the 48), 'sys'
// (narration), the rescued hero's id, the champion's id, 'vael'. {hero} in a line is the played hero's name.
(function () {
  const SG = window.SW && window.SW.saga; if (!SG) return;
  SG.rescueText = SG.rescueText || {};
  Object.assign(SG.rescueText, {

    // ---------------------------------------------------------------- NYRA (called)
    nyra: {
      title: "Lullaby for Sector 7",
      place: "Med-Lab Sector 7. Nyra is singing the tanks shut again, one by one, for Vael.",
      intro: [
        ['sys', "Med-Lab Sector 7. Frost climbs the walls in fern shapes, and every tank she ever broke is whole again, sealed in ice."],
        ['sys', "Grey-violet soldiers stand along the rows like orderlies. None of them breathes. None of them needs to."],
        ['sys', "At the far end a girl in a pale suit sings, low and cold. Over her head turns a crown of violet light."]
      ],
      meet: [
        ['nyra', "{hero}. Softly. They're asleep, and for once nobody in this room is afraid."],
        ['vael', "You promised every bed, little singer. Keep your promise. Sing them down where no hand can number them."],
        ['nyra', "He sings in my mother's voice. The harbour song, the one the tear cut off. He knows how it ends."],
        ['nyra', "Wake them and they wake into Halcyon. Let them dream. If you want them, you'll have to sing louder than me."]
      ],
      lose: [
        ['nyra', "Hush now. Lie down with the others. The glass is warmer than it looks."]
      ],
      win: [
        ['sys', "The crown splits like a tank under a held note, and the violet drains out of the frost."],
        ['nyra', "That wasn't her. My mother never knew the last verse either. He made one up, and I believed it."],
        ['nyra', "The tanks. Help me with the tanks. Maren would have my hide if I left a single one sealed."],
        ['nyra', "Every bed, I said. There are a great many beds under that Crown. I'm coming to the Crater, {hero}, and I'm bringing my voice."]
      ],
      tie: {
        isolde: [
          ['nyra', "Isolde. I was loud again, wasn't I. Loud for the wrong side."],
          ['hero', "Loud enough to find. That is all a falconer asks of a chick that strays. Up, little one."]
        ],
        kael: [
          ['nyra', "Kael. You fought like a boy from a scrap heap. Good. A Halcyon agent would have let me win."],
          ['hero', "Finest heap in Deepline. Also the worst singing I've ever heard out of you. That's how I knew it wasn't you."]
        ]
      }
    },

    // ---------------------------------------------------------------- ISOLDE (called)
    isolde: {
      title: "The Falconer's Glass",
      place: "Cryo Vault 9. Isolde, crowned, is freezing the vault shut from the inside.",
      intro: [
        ['sys', "Cryo Vault 9. The cold is worse than Halcyon ever made it. The doors have grown a skin of ice a hand thick."],
        ['sys', "Hollow Legion stand frozen into the walls like specimens, and step out of them when the ice cracks."],
        ['sys', "In the centre stands a woman with silver hair. A falcon of ice turns slow circles round her violet crown."]
      ],
      meet: [
        ['isolde', "{hero}. Speak softly. You are standing in my eyrie."],
        ['vael', "White birds over a frozen harbour. I kept every one, falconer. Come home and hold them again."],
        ['isolde', "Forty falcons, and I named them all. He calls them up out of the dark one at a time. I hear their bells."],
        ['isolde', "I hated glass. Now I build it, and I do not mind. That ought to frighten me. Hush. Let us be quick."]
      ],
      lose: [
        ['isolde', "Lie still. The cold is gentle once you stop fighting it. I have had a long time to learn that."]
      ],
      win: [
        ['sys', "The crown cracks with the sound of lake ice in spring, and the falcon drops onto her wrist, white again."],
        ['isolde', "They were not there. He rang the bells, and I counted wings that were not there."],
        ['isolde', "I would have traded all forty for one more morning over the harbour. He knew my price before I did."],
        ['isolde', "One bird is enough. She has always been enough. Take us to the Crater, {hero}. She wants to see what lied to her."]
      ],
      tie: {
        aldric: [
          ['isolde', "Captain. You came through the door this time."],
          ['hero', "I should have looked through it a year ago, falconer. I will not stand on the wrong side of a door again."]
        ],
        brann: [
          ['isolde', "Brann. You shouted at me the whole fight."],
          ['hero', "And winter listened, for once. Come north when this is done, bird-woman. First we drink, then we argue."]
        ],
        nyra: [
          ['isolde', "Nyra. I heard you singing the whole way down. Too loud."],
          ['hero', "Low voice, cold blade. You taught me. Now, are you coming out of that glass, or shall I sing it open too?"]
        ]
      }
    },

    // ---------------------------------------------------------------- GALE (champion: mika)
    gale: {
      title: "The Cable and the Moon",
      place: "The Skylift. Gale holds the falling cars up on the wind while Mika cuts the cables.",
      intro: [
        ['sys', "The Skylift. Half the cables hang cut and whipping, and the cars on them swing over a thousand-metre drop."],
        ['sys', "One car is not falling. Under it a boy in a white headband holds it up on an updraft, arms shaking, sashes torn."],
        ['gale', "{hero}! Clear the platform, would you? Arms are busy. One cable car, a family of six, and a cat that is NOT helping."]
      ],
      meet: [
        ['mika', "Little wind, holding a box of people up with your breath. Let it go. On my world nobody ever needed a cable."],
        ['gale', "On mine the wind loved me a little too much. Watch what it does to people who cut its strings."],
        ['mika', "Vael has promised me a world with no ground in it. Every cable I cut is one floor less. Come up and stop me."],
        ['gale', "{hero}, she's yours. I'll be the breeze on the back of her neck."]
      ],
      lose: [
        ['mika', "Down you go. Everything on this world goes down. I'll wave."]
      ],
      win: [
        ['sys', "Mika drops past the cable housing, and for once nothing about her is graceful."],
        ['mika', "This world and its ground. Keep them, little wind. The Crown has a higher floor."],
        ['sys', "A violet thread drops from the wound in the sky, catches her wrist, and hauls her up toward the crown-ship."],
        ['gale', "Car's on the platform. Cat's furious. Everybody lives."],
        ['gale', "Things keep going up without me. Not this time. The Crater, {hero}: I'm riding the updraft straight into it."]
      ],
      tie: {
        sora: [
          ['gale', "Sora! You came DOWN. To the Skylift. For me."],
          ['hero', "I flew level, thank you. Level isn't down. ...Now stop hovering at me and let's go."]
        ],
        tarn: [
          ['gale', "Tarn. You ran here? All the way up?"],
          ['hero', "Every step of the service stair, while you sat on a breeze. Still cheating. Race you to the Crater."]
        ]
      }
    },

    // ---------------------------------------------------------------- ALDRIC (champion: vega)
    aldric: {
      title: "The Wall at Chamber Six",
      place: "Pylon Chamber Six. Aldric holds the door while Vega drags Aurelia down.",
      intro: [
        ['sys', "Pylon Chamber Six. The floor tilts a finger's width each minute, and loose bolts roll uphill toward the centre."],
        ['sys', "There a woman hangs in the air with a black star in her palm, and the whole city leans toward her."],
        ['sys', "At the door stands a knight in dented plate. The Legion lie heaped before him like a wall built from the wrong side."],
        ['aldric', "{hero}. Good. The door holds. I am less certain of the floor."]
      ],
      meet: [
        ['vega', "On the harbour the ships steered by my star. Here a city sat on me for a year. Vael was the first to ask if it was heavy."],
        ['aldric', "You were the pylon. I stood guard two floors above you, and never once came down."],
        ['vega', "Then come down now. Everything falls toward me in the end: bolts, towers, knights. Let it rest."],
        ['aldric', "I hold walls, not cities. But I will hold this door until the city remembers how to float."]
      ],
      lose: [
        ['vega', "Down, knight. Gravity remembers everyone at last. Today it remembered you."]
      ],
      win: [
        ['sys', "The black star gutters in Vega's palm. The floor rights itself with a groan that runs up through every tower."],
        ['vega', "Hold it up, then. Hold it forever. The Crown will be waiting when your arms give out."],
        ['sys', "The pull reverses. Vega falls upward through the pylon shaft, toward the violet wound over the Crater."],
        ['aldric', "The city stands. I have held a great many doors, {hero}. Never one with a whole sky behind it."],
        ['aldric', "Then I take my wall to the Crater. Lead, and I will stand where the blows land."]
      ],
      tie: {
        isolde: [
          ['aldric', "Falconer. You came down to the pylons."],
          ['hero', "You stood under my eyrie for twenty winters, Captain. A bird may stand at your gate once."]
        ],
        tor: [
          ['aldric', "The Surface wall. You came up the Skylift a second time."],
          ['hero', "Two walls hold better than one. I said it. Thought I'd better turn up and prove it."]
        ],
        vesper: [
          ['aldric', "Seventy-seven. Of course. I never see you arrive."],
          ['hero', "You never will, knight. The lamps are lit from here to the Crater. Walk."]
        ]
      }
    },

    // ---------------------------------------------------------------- PYRA (champion: lux)
    pyra: {
      title: "Two Fires in the Burn Ward",
      place: "The Burn Ward. Pyra fights Lux in the room where Halcyon once bottled her fire.",
      intro: [
        ['sys', "The Burn Ward, rebuilt since Pyra burned it, and burning again. The new glass runs down the walls in slow orange tears."],
        ['sys', "Light pours through the windows, white enough to bleach the shadows off the walls, and the Legion marches inside it."],
        ['pyra', "{hero}! Hi! Mind the floor, it's mostly ceiling now. I'm busy fighting a lamp."],
        ['pyra', "Every time I put her out, she comes back brighter. It's very rude."]
      ],
      meet: [
        ['lux', "Orange. Smoky. Always going out. I am light, little fire, and light needs nothing to eat."],
        ['pyra', "They tried to bottle you here too, didn't they? Same glass, same notes. And you went and climbed into a bigger bottle."],
        ['lux', "Vael bottles nothing. He burns it all white, and when he is done there is nothing left to put in a jar."],
        ['pyra', "Honey, the hottest fire at home was blue. White is what's left over. {hero}, let's show her a colour."]
      ],
      lose: [
        ['lux', "There. Dim at last. Sleep in the white, both of you."]
      ],
      win: [
        ['sys', "Lux's lance splits, and seven colours spill across the scorched floor like a dropped paintbox."],
        ['lux', "Smoke in my light. You put SMOKE in my light. Vael will burn it clean again."],
        ['sys', "She goes up in one white flash, out through what is left of the roof, toward the Crown."],
        ['pyra', "Second time this ward's burned down with me in it. I'm starting to think it's personal."],
        ['pyra', "A ship in the sky, full of lamps and bottles? I'm coming to the Crater, {hero}. I'm bringing matches."]
      ],
      tie: {
        ashka: [
          ['pyra', "Ashka. You came all the way up for me."],
          ['hero', "I felt you burning through the pipes, sister. Too bright for one. The floor's warm enough for two."]
        ],
        elixa: [
          ['hero', "I took notes in this room once. Today I brought water."],
          ['pyra', "...You're still on the list. A bit lower. Pass the water."]
        ],
        kestra: [
          ['pyra', "Kestra. Come to watch me lose to a lamp?"],
          ['hero', "Came to make sure nobody else puts you out. That's MY job, matchstick. Fight thirteen is still open."]
        ]
      }
    },

    // ---------------------------------------------------------------- YARA (called)
    yara: {
      title: "The Lamp That Aims",
      place: "The Firing Gallery. Yara, crowned, shoots down anything that flies for the Crater.",
      intro: [
        ['sys', "The Firing Gallery. Every few breaths a bowstring sings, and something a mile off over the clouds goes down."],
        ['sys', "Skiffs, kites, a courier drone. Spent arrows litter the gallery floor, and every head is tipped in violet."],
        ['sys', "Hollow Legion fill her quivers like squires. At the far rail stands the archer, one eye closed, crowned in light."]
      ],
      meet: [
        ['yara', "Don't come closer, {hero}. I'm better at a mile. Everyone is better at a mile. You can't see the faces."],
        ['yara', "I promised to count the targets that were never ships. I got to forty. Then he started counting for me."],
        ['vael', "Lamp-keeper. No more counting. When there is no one left to bring home, nobody can blame the lamp."],
        ['yara', "It's quiet when he says it. The first quiet in a year. Hold still. I'm going to light you."]
      ],
      lose: [
        ['yara', "Forty-one. ...No. I don't count any more. He says I don't have to."]
      ],
      win: [
        ['sys', "The crown breaks like a lamp-glass dropped on stone, and the violet runs out of her arrowheads."],
        ['yara', "Forty-one. You'd have been forty-one. I'd have made you a number and called it quiet."],
        ['yara', "He doesn't stop the counting. He only stops you caring what it adds up to. That's worse."],
        ['yara', "A lamp brings people home, and the Crater will want one lit. I'll take the long shot, {hero}."]
      ],
      tie: {
        hart: [
          ['yara', "Hart. You charged me. Across the whole gallery."],
          ['hero', "Kept your distance for you, Yara. Rules are rules. And don't think this one counts for the bet."]
        ],
        jax: [
          ['yara', "Jax. You walked straight into my ten paces."],
          ['hero', "A mile's a long way off to need a friend, lamp-girl. Ten paces is where they stand. Your round."]
        ]
      }
    },

    // ---------------------------------------------------------------- KIRI (legion)
    kiri: {
      title: "Wishes for the Dead",
      place: "The Paper Shrine. Kiri and her double guard the folded wishes from the Legion.",
      intro: [
        ['sys', "The Paper Shrine, under Deepline. The Legion walks through the wishes for the dead, and every step tears a name."],
        ['sys', "Two girls in cream jackets fight back to back in a blizzard of paper cranes, a heartbeat apart."],
        ['kiri', "{hero}! Perfect timing. We were just saying we could use a third Kiri. You'll do."],
        ['kiri', "They don't read. They don't even look down. Every wish in here was folded by somebody's hand."]
      ],
      mid: [
        ['kiri', "First fold done! They don't bleed and they don't burn. Paper cuts, though. Paper cuts work."]
      ],
      win: [
        ['sys', "The last soldier goes down under a cloud of cranes. The wishes settle, snow on snow, back where they belong."],
        ['kiri', "Thousands of wishes, and not one of them asked for any of this. I'll fold them back later. Twice."],
        ['kiri', "Then up, like the first time: one crane, wide enough for two Kiris and a Crater full of trouble."],
        ['kiri', "Paper Post, special delivery: the Crown, by hand. Lead on, {hero}. We're both coming."]
      ],
      tie: {
        rook: [
          ['kiri', "Rook! Which one of you do I thank?"],
          ['hero', "All of us! Sign for us at the Crater, paper girl. There's a lot of us to sign for."]
        ]
      }
    },

    // ---------------------------------------------------------------- KESTRA (champion: mira)
    kestra: {
      title: "A Hundred Phoenixes",
      place: "The Observation Gallery. Kestra burns her way through Mira's hall of mirrors.",
      intro: [
        ['sys', "The Observation Gallery. Every pane has turned to mirror, and every mirror holds a woman with a burning fan."],
        ['sys', "Soot streaks the glass. A hundred Kestras swing a hundred fans, and only one of them is bleeding."],
        ['kestra', "{hero}! Good, a face that isn't mine. It's a lovely face, mine. I'm very tired of it."]
      ],
      meet: [
        ['mira', "Strike them all, phoenix. Every one you break is a door, and every door opens on me."],
        ['kestra', "Fire first, then the fan. It has worked for a hundred years. Your glass is a hundred minutes old."],
        ['mira', "Vael gave me every pane in Aurelia. A city of windows. Soon everyone in it will be a reflection."],
        ['kestra', "Hot glass runs, mirror girl. Let's see how you look melted. {hero}, find the one that's cold."]
      ],
      lose: [
        ['mira', "You struck a reflection. Every time. Lie down in the glass with the others."]
      ],
      win: [
        ['sys', "The mirrors run like wax. In one of them, for a heartbeat, nothing stands where a reflection should."],
        ['mira', "Cracked. Seven years' luck, phoenix, and all of it yours. I will be in the next window."],
        ['sys', "She steps into a pane of molten glass, and a cyan glint races up through the windows toward the Crown."],
        ['kestra', "Fire, then fan, then a great deal of sweeping. Lin is going to give me the look."],
        ['kestra', "A hundred years under the floor, and now there's a crown in the roof. The Sky Clan goes up, {hero}. To the Crater."]
      ],
      tie: {
        lin: [
          ['kestra', "Lin. Don't. I know. I scorched the gallery."],
          ['hero', "Glass, not beams. I noticed. Breathe, sister. Then we go up together."]
        ],
        pyra: [
          ['kestra', "Pyra. A hundred of me, and you picked the right one."],
          ['hero', "Easy. Only one of them was losing. Kidding. Fight thirteen's after the Crater, feather duster."]
        ]
      }
    },

    // ---------------------------------------------------------------- SORA (champion: corvin)
    sora: {
      title: "Kites Against Crows",
      place: "The Skyport. Sora keeps the sky open while Corvin's crows darken it.",
      intro: [
        ['sys', "The Skyport. Crows by the thousand turn over the docks in one black wheel, and the sun comes through in pieces."],
        ['sys', "Through the gaps darts a kite the size of a sail, cutting birds out of the air with its string. Its flyer is bleeding."],
        ['sora', "{hero}! Clear the docks so the skiffs can launch. I'll keep the crows busy. I'm extremely annoying."]
      ],
      meet: [
        ['corvin', "Kite girl. My crows watched one world end. They have come to watch another. Cut your string and fall gracefully."],
        ['sora', "My string snapped once already. I went UP. Your birds should write that down."],
        ['corvin', "I stood under the omen once and lost a world. Now I stand beside it. It is the only safe place to stand."],
        ['sora', "Then stand somewhere lower. {hero}, keep him on the ground. I'll keep him looking up."]
      ],
      lose: [
        ['corvin', "Down, kite girl. Every bird comes down at the end. I read it long ago."]
      ],
      win: [
        ['sys', "The kite's wind tears Corvin's hood back. A thousand crows break formation, screaming, and the sun returns."],
        ['corvin', "The omen never showed me a kite. It will next time. The crows can wait."],
        ['sys', "He comes apart into black wings, and the flock streams off toward the Crater like smoke up a chimney."],
        ['sora', "Every skiff off the dock, every letter dry. And I never touched the ground. You saw that, right?"],
        ['sora', "There's a crown up there that thinks it owns the sky. I've lived up there, {hero}. It doesn't. To the Crater."]
      ],
      tie: {
        bando: [
          ['sora', "Bando. Say you saved me and I drop you in the harbour."],
          ['hero', "Didn't say a thing! ...I'll be telling everybody, though. Twice now. Long arm of Deepline, at your service."]
        ],
        gale: [
          ['sora', "Gale. You're hovering."],
          ['hero', "Like a cloud with a grudge. Every run, Sora. Especially this one."]
        ]
      }
    },

    // ---------------------------------------------------------------- CODA (called)
    coda: {
      title: "The Bell Under Hearing",
      place: "The Noble Ring opera. Coda, crowned, dances for a house full of the Hollow Legion.",
      intro: [
        ['sys', "The Noble Ring opera. Every seat is filled. The audience is grey-violet, and not one of them applauds."],
        ['sys', "On stage a dancer spins in loops of pink silk, perfectly on the beat of a bell no one else can hear."],
        ['sys', "The ribbons that carried Pell's secrets carry orders now. Above her head turns a crown of violet light."]
      ],
      meet: [
        ['coda', "{hero}. You're off the beat. Can't you hear it? One toll, push. Two, fly."],
        ['vael', "Little dancer. You cut every string, and the silence frightened you. Here is a beat. Follow it home."],
        ['coda', "It's the temple bell, the one I counted as a child, before the masks and the sky. He rings it for me now."],
        ['coda', "Pell held the strings. Vael only keeps the beat. It's different. ...It's different. Dance with me, on his count."]
      ],
      lose: [
        ['coda', "Off the beat, and down. Bow, {hero}. The house is watching."]
      ],
      win: [
        ['sys', "The crown breaks on the downbeat. The bell stops, and the silence after it is enormous."],
        ['coda', "That wasn't Oda's bell. Oda's bell never told me where to step. It rang, and I chose."],
        ['coda', "I cut one set of strings and went looking for another the moment it got quiet. Don't tell anyone that."],
        ['coda', "No count but mine from now on. I hear the Crater has a stage and a very rude crowd. I'll dance there, {hero}. Off his beat."]
      ],
      tie: {
        pell: [
          ['coda', "Pell. Come to put the strings back?"],
          ['hero', "My star. You found a worse puppeteer than me. I'm almost offended. ...Go on. Dance it your way."]
        ],
        zara: [
          ['coda', "Zara. You came to the opera. You hate the opera."],
          ['hero', "I hate losing a bet more, darling, and I bet on you. Your seat's still warm."]
        ]
      }
    },

    // ---------------------------------------------------------------- ZARA (legion)
    zara: {
      title: "All In at the Vent Stacks",
      place: "The Vent Stacks. Zara, back in Deepline, holds the stacks so the city below can breathe.",
      intro: [
        ['sys', "The Vent Stacks. The Legion has choked the great chimneys with its dead, and the air below is turning thick."],
        ['sys', "On a catwalk over Stack Four, a woman in a top hat deals cards into the smoke. Each lands like a thrown knife."],
        ['zara', "{hero}, darling. Pull up a catwalk. The house is open, and the house is running out of air."],
        ['zara', "I grew up breathing what came down these stacks, and won my way out of them. Today I'm buying the air back."]
      ],
      mid: [
        ['zara', "First hand to the house. They never bluff, these soldiers. No faces to bluff with. Deal again."]
      ],
      win: [
        ['sys', "The last soldier goes over the rail. Far below, the stacks cough, and warm air begins to climb again."],
        ['zara', "Hear that? Deepline, breathing. The best thing I ever bought, and I've bought a great many."],
        ['zara', "Nobody knows what I staked on my last hand up the Skylift. I'll tell you this much: I'd stake it again."],
        ['zara', "A sovereign with an empty crown is a man bluffing with no cards. I'll call. The Crater, {hero}. All in."]
      ],
      tie: {
        coda: [
          ['zara', "Coda. In Deepline. In those shoes."],
          ['hero', "You kept a seat warm for me, Zara. I came down to keep yours. Every step here was my own."]
        ],
        jax: [
          ['zara', "Jax. Down the Stacks, into Deepline. People will talk."],
          ['hero', "Let 'em. You still owe me for the last hand, sweetheart. Can't collect off a woman who choked on smoke."]
        ],
        lin: [
          ['zara', "Lin. You were missing again. Watching, I suppose."],
          ['hero', "Everyone. From behind your chair, as always. Even when the chair is a catwalk."]
        ]
      }
    },

    // ---------------------------------------------------------------- MAREN (legion)
    maren: {
      title: "The Doctor Is Still In",
      place: "The Hydro Ward. Maren holds the ward door while the Legion comes for the beds.",
      intro: [
        ['sys', "The Hydro Ward. The water tanks have gone violet and still, and the Legion comes down the corridor in step."],
        ['sys', "A woman in a white coat stands in the doorway, sea water coiling round her arm. Behind her, thirty patients breathe."],
        ['maren', "{hero}. Wash your hands, then come and stand by me. Nobody in this ward is past use."]
      ],
      mid: [
        ['maren', "Good. Now the next lot. They come for the weakest first. Every army that ever marched does."]
      ],
      win: [
        ['sys', "The last soldier falls in a slop of violet water, and the tanks clear slowly back to green."],
        ['maren', "All thirty, still breathing. Some of them are complaining about the food already. That's how I know."],
        ['maren', "I've sat with the ones who can't run all my life. The ward can spare me an hour. Perhaps two."],
        ['maren', "I'm coming to the Crater, {hero}. Vael has emptied nine worlds. Somebody ought to have a look at him. Professionally."]
      ],
      tie: {
        nami: [
          ['maren', "Nami. You came up out of the water for this."],
          ['hero', "Doctor's back, every time. That's the debt, and I pay my debts. Breathe, Maren. You forget too."]
        ],
        vesna: [
          ['maren', "Vesna. I don't suppose this one is free."],
          ['hero', "Nothing is, doctor. I'll put it on Vael's page. His is the longest I've ever kept."]
        ]
      }
    },

    // ---------------------------------------------------------------- ELIXA (called)
    elixa: {
      title: "The Violet Flask",
      place: "The Blank Wing. Elixa, crowned, mixes a violet serum for Vael in Halcyon's hidden labs.",
      intro: [
        ['sys', "The Blank Wing, Halcyon's hidden labs. The coloured smoke is all one colour now, and it stains the walls violet."],
        ['sys', "Husks lie in rows on steel tables, grey and breathing. A chemist moves between them with a dripping violet flask."],
        ['sys', "Hollow Legion hold the doors like lab assistants. Above the chemist's head, a crown of violet light turns slowly."]
      ],
      meet: [
        ['elixa', "{hero}. Don't touch the tables. I'm nearly there. A cure, after all this. Look how still they are."],
        ['vael', "Chemist. Every grey shape you made is listening. They forgive you. Finish the experiment, and they will thank you."],
        ['elixa', "They speak to me now. All of them together, in one kind voice. They say it won't hurt where they're going."],
        ['elixa', "I never wanted anything but to know what happens next. Now I know. Hold still. You're a variable."]
      ],
      lose: [
        ['elixa', "Result noted: subject resisted, then didn't. Next table, please."]
      ],
      win: [
        ['sys', "The crown cracks. The flask falls and spins on the steel, violet bleeding out of it into grey."],
        ['elixa', "Forgiveness. Of course it was forgiveness. The one reagent I could never make myself."],
        ['elixa', "They never said it. Husks can't say anything. I wrote their lines for them, and let him read them aloud."],
        ['elixa', "Every result has a cause, and this one wears a crown. I'd like him under glass. The Crater, {hero}. Bring a sample jar."]
      ],
      tie: {
        pyra: [
          ['elixa', "Pyra. You could have let it burn. You never did like my labs."],
          ['hero', "You're on MY list. Nobody else gets to cross you off. Not even a sovereign. Up."]
        ],
        ume: [
          ['elixa', "Ume. You came into a Halcyon lab. Touch nothing."],
          ['hero', "That's my line. Every season I ask what for, chemist. This season you'd better have a very good answer."]
        ]
      }
    },

    // ---------------------------------------------------------------- ISA (champion: tessa)
    isa: {
      title: "The Last Page",
      place: "The Archive. Isa seals the stacks while Tessa stops the clocks and burns the pages.",
      intro: [
        ['sys', "The Archive. Fire walks the stacks in slow motion, each flame held still mid-leap, then let go to eat the next shelf."],
        ['sys', "Between the shelves a woman in a white robe writes glyphs on the air. Each one seals a door the Legion cannot pass."],
        ['isa', "{hero}. Mind the floor. Every tile you see is a seal, and every seal is a sentence. Do not step on the verbs."]
      ],
      meet: [
        ['tessa', "Seal-writer. I've read the last page of this story a hundred times. It ends in ash. I'm only being prompt."],
        ['isa', "You showed me the Director's ending once. You said you were trying the other door. What was behind it?"],
        ['tessa', "Vael. He was behind that one too. An ending that holds still, forever. No more telling it over."],
        ['isa', "Then I will write you another, in ink you cannot wind back. {hero}, keep her watch away from my hand."]
      ],
      lose: [
        ['tessa', "I've read this page before. You fall here. I always hated this part."]
      ],
      win: [
        ['sys', "Tessa's watch skips a second, then another. Every held flame in the Archive falls at once and goes out."],
        ['tessa', "A page I haven't read. How rude. I'll go and ask him how it ends."],
        ['sys', "She winds the watch backwards and steps out of the moment, toward the Crater, gone before her shadow is."],
        ['isa', "I unwrote every law I sealed. Now something means to unwrite the world. That sentence will not stand."],
        ['isa', "The Final Word was written for the Director. It will fit a crown as well. To the Crater, {hero}. I have one word left."]
      ],
      tie: {
        lin: [
          ['isa', "Lin. My brush hand. You came for it."],
          ['hero', "It is the only hand I guard. Write, Isa. The room is mine."]
        ],
        sen: [
          ['isa', "Sen. You came up from the Metro. And you waited too long, as always."],
          ['hero', "I waited until the line held. It held. Write your word, Isa. I will answer it with one line."]
        ]
      }
    },

    // ---------------------------------------------------------------- LIN (walker)
    lin: {
      title: "The Fifth Strike",
      place: "The Ballast Decks. Lin holds the beams under the city against the Legion and a Walker.",
      intro: [
        ['sys', "The Ballast Decks. The Legion comes down the old stairs with cutters, sawing at the beams the whole city stands on."],
        ['sys', "Among the pylons a woman in white moves without hurry. Each soldier she touches stops, and forgets how to stand."],
        ['lin', "{hero}. Breathe. Every fifth strike seals. Count with me, and keep them off the beams."]
      ],
      mid: [
        ['sys', "The decking shudders. A leg like a tower punches through the gold roof, and a Siege Walker lowers itself into the dark."],
        ['lin', "Loud. Very loud. Even loud things take a fifth step. Watch for it."]
      ],
      win: [
        ['sys', "The Walker kneels, sealed at every joint, and its captain tumbles from the saddle into the ballast."],
        ['lin', "Not one beam cut. The city will never know how close it came to falling on us. Good. It never knew we were here."],
        ['lin', "A hundred years beneath the floor, and now the trouble hangs above the roof. The Clan goes where it is needed."],
        ['lin', "To the Crater, {hero}. Even a sovereign has a fifth strike. I mean to find it."]
      ],
      tie: {
        isa: [
          ['lin', "Isa. Your brush hand, out here among the beams?"],
          ['hero', "You guard my hand. Today I came to guard yours. Not a drop spilled, Lin. I counted."]
        ],
        ivo: [
          ['lin', "Ivo. I heard you coming four decks away."],
          ['hero', "That's the plan! Loud and on time. ...I've been working on quiet. It didn't take. Did I help?"]
        ],
        kestra: [
          ['lin', "Kestra. A whole Walker, and not one beam caught."],
          ['hero', "I'm capable of restraint! Occasionally. Tastefully. Don't give me the look."]
        ],
        zara: [
          ['lin', "Zara. You came down the stair no noble knows."],
          ['hero', "Darling, I followed you once. I can do it twice. The house looks after its bodyguard."]
        ]
      }
    },

    // ---------------------------------------------------------------- VESPER (called)
    vesper: {
      title: "The Lamplighter's Dark",
      place: "The Night Ward. Vesper, crowned, puts out every lamp she ever lit in Aurelia.",
      intro: [
        ['sys', "The Night Ward and the alleys below it are dark. Every lamp Vesper ever lit has been pinched out, one by one."],
        ['sys', "Hollow Legion stand in the blackness, waiting. They do not need to see. They only need to be told."],
        ['sys', "A crimson scarf moves along the roofline from lamp to lamp, and behind it each light dies. Violet glints above it."]
      ],
      meet: [
        ['vesper', "{hero}. You brought a light. Put it out."],
        ['vael', "Lamplighter. Your watchman keeps the dark for me now, and he is lonely in it. Put out your lamps and stand by him."],
        ['vesper', "Noct's voice. On the harbour I lit it, he kept it, and we never needed a word. Now he talks to me all night."],
        ['vesper', "Dark is quieter. No one sees who lights anything. No one sees who doesn't."]
      ],
      lose: [
        ['vesper', "Lights out."]
      ],
      win: [
        ['sys', "The crown snaps like a wick. Down in the alley, one lamp gutters back to life on its own."],
        ['vesper', "It wasn't him. Noct never said a word to me in his life. That was how I knew him."],
        ['vesper', "He's still out there, keeping the dark for a crown. I'll light every lamp between here and him."],
        ['vesper', "The Crater, {hero}. I'll be at the next lamp."]
      ],
      tie: {
        aldric: [
          ['vesper', "Knight. You came down to the Ward."],
          ['hero', "You once lit me a road to the truth, Seventy-seven. Tonight I walked it back to you."]
        ],
        moro: [
          ['vesper', "Moro. You held me in my own shadow again."],
          ['hero', "Somebody had to. You were walking through it the wrong way. ...Knock next time."]
        ]
      }
    }
  });
})();
