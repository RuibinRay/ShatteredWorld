'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the spoken lines of every chapter for the heroes of Aurelia, the Sky.
// Data only; js/saga/saga-core.js plays it. Speakers: 'hero' (the hero being played), 'sys' (narration), a hero id,
// or 'director', 'kessen', 'vael', 'agent', 'citizen'.
(function () {
  const SW = window.SW; if (!SW.saga || !SW.saga.add) return;
  SW.saga.add({

    // ---------------------------------------------------------------- NYRA
    nyra: {
      1: { zone: 'medlab', goal: "Fight your way out of the Med-Lab",
        card: "Med-Lab Sector 7. In tank thirty-one a girl has hummed into the same hairline crack for a week, and she is the only one who sees the grey shapes walk the halls.",
        intro: [
          ['sys', "Med-Lab Sector 7. Tank thirty-one has a crack in it, thin as a hair. For a week the girl inside has hummed into it."],
          ['hero', "Nyra. Born where the harbour freezes. Halcyon wrote thirty-one on my glass. Numbers don't sing."],
          ['hero', "There it is again. A grey shape behind the doctor's shoulder, patient as a coat on a hook. Nobody else ever looks at it."],
          ['agent', "Thirty-one is vocalising. Sedate her before the glass-"],
          ['hero', "Hold the note. Hold it. ...Now break."]
        ],
        win: [
          ['hero', "The grey shapes in the halls were people once. Halcyon drank them down through its feed lines and left the outline standing."],
          ['hero', "Husks, the charts call them, in neat little columns. There's a column ready for me. I'm not filling it."],
          ['hero', "Cryo Vault 9 is three floors down. Isolde's in there, and she's going to tell me I was loud. And flat."]
        ] },
      2: { zone: 'cryo', with: 'isolde', goal: "Hold Cryo Vault 9 with Isolde",
        card: "Cryo Vault 9, where Isolde taught Nyra to keep her voice low and her blade cold. Tonight Halcyon's boots are on the stairs, and Maren is already counting Nyra's pulse.",
        meet: [
          ['isolde', "You sang a tank open, Nyra. The whole ward heard. So did Halcyon."],
          ['hero', "And yet the tank is open. Say well done. It won't kill you."],
          ['isolde', "A falcon that screams at every mouse goes hungry. Low voice, cold blade. Then the door."],
          ['hero', "Low. Cold. Noted. Are you coming out of that glass, or do I sing it open too?"],
          ['isolde', "Gently. I hate glass. ...No. Too late for gently. Listen: boots on the stairs."],
          ['maren', "Then it's tonight. I'll be behind you both with the needle. Nyra, your pulse is already halfway down the corridor."]
        ],
        win: [
          ['maren', "Sit. Your heart is skipping like a stone on water. Breathe with me. In. Out. ...Better. Now go, both of you."],
          ['hero', "Come with us, Maren. Please."],
          ['maren', "Somebody has to sit with the ones who can't run yet. Come back for them. That's my fee."],
          ['hero', "Every bed in this ward. I'll come back for all of them. Hold me to it."]
        ] },
      3: { zone: 'crater', rival: 'kael', goal: "Duel Kael at the Crater",
        card: "Aurelia's screens loop a boy from the Crusher Yard, lightning in his fists, gassing Halcyon's labs. At the Crater, Nyra finds him in the flesh, and the face won't sit right on him.",
        meet: [
          ['hero', "White hair, lightning in your fists. I've watched you on every screen up there, opening the Sump's vents onto our labs."],
          ['kael', "Opened what? I've never been near your labs, Sky girl. Down here the screens have YOU walking Halcyon's drills into our tunnels."],
          ['hero', "I spent a year in a tank and a week on the run. I've never met a tunnel I didn't want out of."],
          ['kael', "Funny. That's exactly how a Halcyon plant would put it."],
          ['hero', "And that's exactly how one would answer. Fine. Let's hear what you sound like with your fists."]
        ],
        win: [
          ['kael', "You fight like somebody who's been in a cage. Not like somebody who builds them."],
          ['hero', "And you don't fight like someone who gasses labs. You fight like you grew up on a scrap heap."],
          ['kael', "Crusher Yard. Finest heap in Deepline. Whoever opened those vents, it wasn't me. Ask anyone below."],
          ['hero', "Then the boy on the screens isn't the boy in front of me. So who lent a stranger your face? And who lent one mine?"]
        ],
        lose: [
          ['kael', "Stay down. I don't want to hurt you. I want to know why you sold us."],
          ['hero', "I didn't. Again."]
        ] },
      4: { zone: 'noble', goal: "Clear the Noble Ring for the Subjects",
        card: "Tonight two forged films have every layer ready to kill the others, and one of them wears Nyra's face. She brings the numbered up into the light.",
        intro: [
          ['sys', "The Three-Layer War. Every screen in the Sky plays one film: Kael, a white-haired Deepline kid, opening the Core Sump's vents on the labs."],
          ['sys', "Down in Deepline the screens play another: Subject 31 leading Halcyon's drills into the tunnels. Each layer swears the other struck first."],
          ['hero', "I've never led a drill anywhere in my life. Someone is wearing my face. And his."],
          ['maren', "Then show them the real one. The Proving Hall has orders to march on Deepline, and the wards are open. Bring everyone up."],
          ['hero', "Everyone Halcyon ever numbered: up the stairs, onto the Ring, now. Stay low, stay close, and sing if you've got a voice left."]
        ],
        win: [
          ['hero', "The Hall never marched. Aldric turned his knights around, and Coda cut her strings mid-opera and danced Pell's secrets onto every wall."],
          ['sys', "Below, the Lantern Cell catches Pell in his own strings at the Pit. On the Surface, Oda's bell rings three times over the Buried Meridian."],
          ['sys', "The Crater. Kael and Nyra face each other, each sure the other is Halcyon's. Kiri's paper crane drops between them with Pell's word: Rue."],
          ['hero', "A second Kael in the crowd. The real one turns, and the copy runs: a face with nothing behind it. It wore mine too. Sorry, Kael."],
          ['sys', "Four banners climb the Halcyon Spire, Hollis's new one beside the three of the Pact. Nyra hears the Engine Core's hum change pitch, like a call."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Reach Vega through the Legion",
        card: "Vael's crown-ship splits the sky; in Pylon Chamber Six his champion Vega drags Aurelia down, and Nyra sings the harbour's star song at her until she falls back.",
        intro: [
          ['sys', "The sky over the Crater tears open. Sovereign Vael's crown-ship hangs in the wound, and the Hollow Legion pours out."],
          ['vael', "Near side. Your Director opened the door. I have emptied worlds older than your sun; this house will not take long."],
          ['sys', "Pylon Chamber Six. Kessen's rerouted pylons shriek. A stranger in a gold circlet draws the whole city down toward her."],
          ['hero', "Aurelia is falling again. Not while I'm standing in it."]
        ],
        meet: [
          ['vega', "Little singer, step aside. Everything falls toward me in the end. This city only gets there first."],
          ['hero', "Gold circlet, a star in your palm. The navigators sang of a harbour girl who fell UP when the sky tore. You?"],
          ['vega', "Vega. The harbour named me for a star. Then I met the real ones, and Vael, who feeds them worlds."],
          ['hero', "Boats came home by your name. You don't get to drop anyone. Low voice. Cold blade."]
        ],
        win: [
          ['sys', "Nyra sings the old steering song, low and cold, and the note cuts through the weight like a keel through ice."],
          ['vega', "That song. Nobody sings that any more. Stop it. STOP it."],
          ['hero', "Somebody always will. Go back to your crown-ship, star. This city stays in the sky."],
          ['sys', "Vega falls back into the dark. Kessen's pylons catch, and Aurelia holds."]
        ],
        lose: [
          ['vega', "Everything falls, little singer. Even songs."],
          ['hero', "Then I'll sing it falling. Again."]
        ] },
      6: { goal: "Bring down the Hollow Crown",
        card: "Nyra climbs into the Crown with the other five saviours, gets past Itsuki on the path, and sings her winter into the six-element blow that brings Vael down.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours out of the crown-ship. Three layers hold the rim; six climb through the middle."],
          ['kael', "Nyra. Twice I took you for my enemy. Today you're at my back. Keep up."],
          ['hero', "I spent a year in a tank. I've done my waiting. Pyra, Gale, Brakk, Nami: with us. Up."],
          ['pyra', "I'll take the hot side. Sing loud, ice girl, so I can hear where you are."],
          ['hero', "Low voice, cold blade; Isolde taught me that. ...Fine. Loud. Just this once."]
        ],
        meet: [
          ['sys', "Below the Crown a man in a long black coat stands on the path. Five elements circle him, slow as a held breath."],
          ['itsuki', "Itsuki. I stand between you and him. Five worlds taught me their elements. You are six children with one each."],
          ['hero', "Six of us, and each of us kept ours. Tank thirty-one has stopped stepping aside."],
          ['itsuki', "Then show me what you kept, thirty-one."]
        ],
        win: [
          ['sys', "Itsuki slides back across the stone, studies the six, and steps off the path. Not beaten. Waiting to see."],
          ['sys', "Inside the crown-ship the Convergence and Sovereign Vael stand side by side, a throne and its shadow. The six go in together."],
          ['hero', "Kael's thunder. Pyra's fire. Gale's wind, Brakk's stone, Nami's tide. And my winter. All of it, NOW."],
          ['sys', "Six elements strike Vael as one. The crown-ship tips into the Crater, and the door to the Beyond slams shut."],
          ['sys', "The door drags the Legion and every champion back through. Itsuki goes last, still watching the six."],
          ['sys', "The morning after. Nyra walks into the Hydro Ward, past the empty tanks, to the beds that could not run."],
          ['hero', "I promised Maren I'd come back for you, and here I am. Up, slowly, all of you. Nobody wears a number today."],
          ['hero', "Subject thirty-one. Free."]
        ],
        lose: [
          ['itsuki', "Not enough. Get up, singer. Five others are waiting on your voice."]
        ] }
    },

    // ---------------------------------------------------------------- ISOLDE
    isolde: {
      1: { zone: 'cryo', goal: "Fight your way out of Cryo Vault 9",
        card: "Cryo Vault 9 keeps Halcyon's Subjects colder than any winter. The eldest of them does not mind the cold. Tonight she has run out of patience with the glass.",
        intro: [
          ['sys', "Cryo Vault 9. Frost on the inside of the glass, and a falcon of ice asleep on one woman's wrist."],
          ['hero', "Isolde. I kept the white falcons of the eyrie over the Frozen Harbour. The tear took the eyrie, the harbour, and every bird but one."],
          ['hero', "She is made of ice now, like everything in this place. I never minded the cold. I mind the glass."],
          ['agent', "Subject 52, step back from the door. Sedation in ten. Nine. Eight."],
          ['hero', "Ten was generous. The hood comes off, and she needs three."]
        ],
        win: [
          ['hero', "No more glass. Up, little one. Show me the halls."],
          ['hero', "And the knight at the end of the corridor. I know that stance. My falcons sat on his gate for twenty winters."]
        ] },
      2: { zone: 'cryo', with: 'aldric', goal: "Hold Cryo Vault 9 beside Aldric",
        card: "For a year the captain of her harbour's sea wall has guarded Isolde's door without once looking through it. Tonight Halcyon comes to take her below the Spire, and she makes him look.",
        meet: [
          ['aldric', "Subject 52. Return to your vault. I take no pleasure in this, but I will do it."],
          ['hero', "Captain of the harbour wall. Every morning you stood under my eyrie and threw your crusts to my falcons."],
          ['aldric', "The white birds on the gate. You are the falconer. You are from home."],
          ['hero', "You have guarded my door for a year, Captain, and not once looked through it."],
          ['aldric', "I was told the Subjects behind these doors were protected. That was the wall I kept."],
          ['agent', "Stand aside, sir. Subject 52 is reassigned to the feed lines. Director's order."],
          ['aldric', "The Director's word is that she is protected. Until that word is proven false, no one passes my wall."]
        ],
        win: [
          ['aldric', "Reassigned. Below the Spire. Falconer, what waits in the feed lines?"],
          ['hero', "Go and look, Captain. There is a woman on the Night Ward with a red scarf. She will show you the way down."],
          ['aldric', "Then I will look. And until I have, no hand touches you."],
          ['hero', "A good wall. My falcons always did like you."]
        ] },
      3: { zone: 'icehouse', rival: 'brann', goal: "Duel Brann at the Ice House",
        card: "Brann, the last bear of north Vharra, says winter answers to him, and he has invited Isolde north to tell him otherwise. At the Ice House, they settle whose winter it is.",
        meet: [
          ['brann', "Hn. Bird-woman. Came north at last."],
          ['hero', "You invited me. I came quietly. You are the one who shouts."],
          ['brann', "Vharra's winters had bears. I am the last. Winter answers to me."],
          ['hero', "Winter answers to no one. It listens, though, to whoever is quietest. Shall we learn which of us that is?"]
        ],
        win: [
          ['brann', "Frost in my beard. Bird on my head. Hn. Fine. It listens to you."],
          ['hero', "It listens to us both. You need only stop shouting at it."],
          ['brann', "Come north again. Bring the bird. Drink first. Argue after."]
        ],
        lose: [
          ['brann', "Warm your hands, bird-woman. Then lose properly."]
        ] },
      4: { zone: 'noble', goal: "Hold the Ring while the wards rise",
        card: "Two forged films have turned the three layers on one another, and the Proving Hall is ordered down to Deepline. Isolde's falcon carries one word to every ward: rise.",
        intro: [
          ['sys', "The Three-Layer War. Sky screens loop Kael, a Deepline kid, opening the Sump's vents on the labs; Deepline's loop Nyra leading drills. Each blames the other."],
          ['agent', "Deepline has struck the Sky! The Proving Hall marches on the Skylift at once. All Subjects confined to wards!"],
          ['hero', "My falcon watched that film and never stirred. She stirs for anything with a pulse. That is not a boy."],
          ['nyra', "And that's not me on theirs, before you ask. The wards are ready, Isolde. They're waiting on your bird."],
          ['hero', "Then she flies. Every ward, every window: rise. And you lead them out, Nyra. I will not do it for you."]
        ],
        win: [
          ['hero', "The wards rose to the bird. Aldric turned the Hall's swords outward, and Coda danced Pell's secrets out under the opera lights."],
          ['sys', "Pell falls in his own strings at the Pit. Oda's bell calls the Surface to the Meridian. Kiri's crane flies Pell's word to the Crater: Rue."],
          ['sys', "There Kael and Nyra stand face to face. A second Kael in the crowd bolts the moment the real one turns. A mask, and no one inside it."],
          ['hero', "Halcyon sold each layer a mask and called it a war. Four banners climb the Spire now, the Engine Core at the top. We go before it finishes calling."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Keep the sun over the Skyport",
        card: "Corvin, Vael's champion from a dead world, puts out the sun over the Skyport; his crows go for Isolde's falcon, and she drives him back to the crown-ship.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport. A gaunt stranger in a feathered hood raises his arms, and ten thousand crows blot out the sun."],
          ['hero', "Crows. Of course it is crows. Close to me, little one."]
        ],
        meet: [
          ['corvin', "Falconer. I have read your sky's omen. It ends today. The crows have only come to watch."],
          ['hero', "Your crows went for my bird. Nobody touches my bird."],
          ['corvin', "My world ended under an engine like his, and I watched. Now I serve the ending, and the ending spares me."],
          ['hero', "So you ran to the hand that did it. My falcons would starve first. Hold still."]
        ],
        win: [
          ['sys', "The ice falcon stoops through the black wings, straight as a dropped stone, and rakes the hood from Corvin's eyes."],
          ['corvin', "The omen showed me no bird. It will. Next time."],
          ['hero', "There is no next time. Take your crows home to your master. The sun stays."],
          ['sys', "Corvin and his crows lift away toward the crown-ship. Light pours back over the Skyport."]
        ],
        lose: [
          ['corvin', "The crows have come down, falconer. So does every bird, at the end."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Isolde holds the Crater rim while Nyra and the other saviours climb, then stands in Itsuki's way with her falcon until the crown-ship falls.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours from the crown-ship, rank upon rank. The three layers lock shields on the rim."],
          ['sys', "Six climb through the middle of it toward the Crown. Nyra is one of them."],
          ['nyra', "Isolde. Will you watch me go?"],
          ['hero', "No, chick. I will be busy. Fly it yourself. Up, little one: keep the rim clear for them."]
        ],
        meet: [
          ['sys', "Halfway up, a man in a long black coat turns on the path and comes back down after the six."],
          ['itsuki', "Falconer. They are past me, and I am going after them. Step aside."],
          ['hero', "You put Brann on the sand in the Dunes. That man has never once stopped shouting. He has stopped. You go nowhere."],
          ['itsuki', "Then hold me, if you can. Few have."]
        ],
        win: [
          ['sys', "Ice and talon, again and again. Itsuki glances up at the Crown, then at Isolde, and turns back up the path."],
          ['itsuki', "Enough. You held me long enough, falconer. Few can say it."],
          ['sys', "From the rim Isolde watches the crown-ship tip and fall into the Crater. The door to the Beyond slams shut."],
          ['sys', "It drags the Legion and every champion back through. The crows go first. Itsuki goes last."],
          ['hero', "She flew it herself, my chick. Of course she did."],
          ['sys', "The morning after. Isolde climbs to the top of the Skyport, where the wind smells like the harbour's old sky."],
          ['hero', "Home can wait a while. Up. Show me this city from above, now that it belongs to us."],
          ['hero', "My falcon never misses."]
        ],
        lose: [
          ['itsuki', "A fast bird. A slow falconer. Again."]
        ] }
    },

    // ---------------------------------------------------------------- GALE
    gale: {
      1: { zone: 'stacks', goal: "Fight your way up Vent Stack Four",
        card: "The tear drops Gale to the very bottom of Deepline's Vent Stacks. He lands, counts his limbs, and starts looking for two things: the way up, and his little sister.",
        intro: [
          ['sys', "Vharra, festival day. A kite climbs into a violet sky that should not be there. The string snaps. The girl goes up. The boy goes down."],
          ['sys', "Vent Stack Four, a thousand metres under Aurelia. Hot air, old soot, and a dent in the grating shaped exactly like a young man."],
          ['hero', "Ow. Okay. Arms, legs, hair. Hair's fine. Gale, ridge-runner of Vharra, all present. Sora went up. So up is where I'm going."],
          ['agent', "Torn-through in Stack Four, reading off the scale. Containment, bring the net. The big net."],
          ['hero', "You brought a net. For the wind. That's sweet. Somebody believed in you this morning."]
        ],
        win: [
          ['hero', "Feel that on your neck? Warm air, climbing. This whole stack breathes, and it breathes up."],
          ['hero', "Hang on, Sora. Your big brother's on his way, and he's had a long fall to work on his lecture."]
        ] },
      2: { zone: 'skylift', with: 'sora', goal: "Hold the Skylift with Sora",
        card: "High on the Skylift, the boy who fell finds the sister who flew. She has a paper-folding partner, a satchel of letters Halcyon would rather burn, and no wish at all to be watched.",
        meet: [
          ['sora', "GALE?! You fell! I watched you fall the whole way down!"],
          ['hero', "Down one stack, back up the same stack on the warm air. Your towers all look alike, by the way. Took me ages."],
          ['sora', "You're alive. You're actually alive. ...And you're about to start hovering. I can feel it starting."],
          ['hero', "Like a cloud with a grudge. Every day. Who's the girl with the paper bird? Does she pay?"],
          ['kiri', "Kiri, from the steppe like you. We fly the letters Halcyon wants unsent. Pay's in bread. Can you fly, or only fall?"],
          ['hero', "Falling's just flying with bad timing. Deal me in. Bread's fine. Jam would be better."],
          ['agent', "Three unlicensed flyers on the cables. Bring them down. Mind the cars."]
        ],
        win: [
          ['kiri', "Three flyers and every tower in Aurelia. That's not a delivery round any more. That's a post. The Paper Post."],
          ['sora', "Fine. He's in. But he does NOT tail me on my runs."],
          ['hero', "Not tail. Escort. Totally different. Mine comes with a breeze on the back of your neck, free of charge."]
        ] },
      3: { zone: 'milezero', rival: 'tarn', goal: "Beat Tarn at Mile Zero: race twelve",
        card: "Eleven races, eleven arguments, no agreed score. Tarn, runner of the Surface post, picks a windless dawn at Mile Zero for race twelve, and this time nobody is running.",
        meet: [
          ['tarn', "Race twelve, flyboy. Mile Zero to the Crater rim, dead calm. I checked the sky twice. Not a breath."],
          ['hero', "No wind? Tarn. The wind is the only reason I go anywhere fast. Otherwise I'd walk, like a person."],
          ['tarn', "I've run every road from here to the rim on these two feet. That's running. You're a kite with legs."],
          ['hero', "Eleven arguments and zero agreed scores. Skip the road. First one flat on the sand loses."],
          ['tarn', "Deal. And this counts as twelve. I'm writing it on my arm."]
        ],
        win: [
          ['tarn', "Fine. FINE. You're fast. You're still cheating. There was a breeze. I felt it on my ear."],
          ['hero', "That was me breathing hard. Twelve to me. Write it on the other arm."],
          ['tarn', "Thirteen. Next month. The long road. And bring your own legs."]
        ],
        lose: [
          ['tarn', "Legs beat weather, flyboy. Go stand in the corner and think about that."]
        ] },
      4: { zone: 'noble', goal: "Clear the drones off the ward route",
        card: "Aurelia's screens say Deepline struck first, and the Proving Hall is lacing its boots to march. Gale has one night to fly the uprising's plan to every ward before they go.",
        intro: [
          ['sys', "The Siege of the Noble Ring starts with a film on every screen: Kael, a white-haired Deepline kid, wrenching the Sump's vents open on the labs."],
          ['kiri', "Down below they're watching another one: Nyra, the singer who broke out of the Med-Lab, leading Halcyon's drills into the tunnels."],
          ['kiri', "That same hour I took a letter from Nyra's own hand, up here. Someone is borrowing faces, and each layer swears the other struck first."],
          ['hero', "And the Proving Hall's lacing up to march on Deepline. A lie has to walk. We fly. Every ward gets the plan before the first boot hits a stair."],
          ['sora', "High towers are mine, low wards are yours. And don't follow me!"],
          ['hero', "Me? Follow? ...Only a little. Only the dangerous bits."]
        ],
        win: [
          ['hero', "Every ward had the plan, every ward rose on cue, and the Hall stopped dead on its own stairs. Not bad for a boy who fell down a chimney."],
          ['sys', "Far below, Oda's bell tolls three times over the Meridian drills. In the Pit, Pell hangs tangled in his own Cat's Cradle, and gives up a name."],
          ['sys', "Kiri flies it to the Crater, where Kael and Nyra stand fists up, each sure the other is Halcyon's. The name is Rue. A second Kael bolts from the crowd."],
          ['hero', "A borrowed face, a borrowed war. Hollis has painted a fourth banner, and four of them go up the Spire from four sides. Engine Core at the top."],
          ['hero', "Whatever that Engine's been whistling up, we switch it off before it comes. I'll take the windy side. Somebody is paying me for this, right?"]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Hold the Skylift cars on the wind",
        card: "Mika, a champion of Vael who never touches ground, cuts the Skylift cables; Gale holds the swinging cars on the wind and throws her off the last cable.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger in indigo cuts the cables one by one, and the Hollow Legion swarms down what remains."],
          ['hero', "Cars full of people, swinging over nothing. All right, wind. Big job. Don't sulk."]
        ],
        meet: [
          ['mika', "Little wind. You can't hold them all. Let them drop. Everything here drops, and nothing climbs back."],
          ['hero', "I dropped a thousand metres once and climbed back. These people get the express."],
          ['mika', "Mika. Vael promised me a world without ground. This one first. Then I never have to come down."],
          ['hero', "Never coming down sounds lonely. The wind says up, and it picked me."]
        ],
        win: [
          ['sys', "Gale holds every car on a pillar of wind and flings Mika off the last cable, end over end into the sky."],
          ['mika', "Stubborn, little wind. The crown-ship will catch me. It always does."],
          ['hero', "Then tell it the cars are full and the wind is busy. Everybody up. Everybody home."]
        ],
        lose: [
          ['mika', "Down you go, little wind. Everyone does."]
        ] },
      6: { goal: "Bring down the Hollow Crown",
        card: "Gale climbs into the Crown with the other five saviours, gets past Itsuki on the path, and puts the wind into the six-element blow that brings Vael down.",
        intro: [
          ['sys', "The Crater. The Hollow Legion spills from the crown-ship like a waterfall. Six climb through the middle of it."],
          ['sora', "High route's mine. Don't foll- ...No. Today you go up, and I hold the rim. Go."],
          ['hero', "Huh. No hovering. Right. Kael, Nyra, Pyra, Brakk, Nami: the wind's carrying us. Hold on to something."],
          ['brakk', "Stone does not fly, wind boy. Stone has never once flown."],
          ['hero', "Stone does today."]
        ],
        meet: [
          ['sys', "At the foot of the Crown, Itsuki waits on the path. The wind dies around Gale and rises around Itsuki."],
          ['itsuki', "Wind. I learned it on another world, long ago. Yours is young. Step aside, all six of you."],
          ['hero', "You put Tarn on the sand in the Dunes. If I pay you back, he'll never let me hear the end of it."],
          ['itsuki', "Then let us give him something to argue about."]
        ],
        win: [
          ['sys', "Itsuki skids to the edge of the path and lowers his hands. He lets the six pass. He does not look beaten."],
          ['sys', "Inside, the Convergence and Sovereign Vael wait side by side. The six walk in together."],
          ['nami', "Water. Kael, thunder. Pyra, fire. Brakk, stone. Nyra, sing. Gale: everything you have."],
          ['hero', "Updraft... and DOWN! Six of us, one blow!"],
          ['sys', "Six elements hit Vael as one. The crown-ship drops into the Crater, and the door to the Beyond slams shut."],
          ['sys', "The door drags the Legion and every champion back through, Mika first and Itsuki last."],
          ['hero', "Next morning Sora lands first. Bando gets his kite back, Tarn gets race thirteen, and my sister gets hovered at. Forever."],
          ['hero', "The wind picked me. Not you."]
        ],
        lose: [
          ['itsuki', "Young wind. You will learn. Get up."]
        ] }
    },

    // ---------------------------------------------------------------- ALDRIC
    aldric: {
      1: { zone: 'armoury', goal: "Hold the Proving Hall",
        card: "The Proving Hall, where the Director's champions are made. In a year its finest knight has not given a single step, and he still guards a sea wall that no longer exists.",
        intro: [
          ['sys', "The Proving Hall. Sand on the floor, banners on the walls, a gallery of guests with wine. Subject 12 stands in the centre, as he has every night for a year."],
          ['hero', "I am Aldric, once captain of the harbour wall. The wall is gone. The oath is not: I stand between harm and the people."],
          ['director', "Trial forty, Twelve. My guests have come a long way to see what a wall is. Do show them."],
          ['hero', "As you command, Director. Send them in."]
        ],
        win: [
          ['director', "Flawless. The Subjects sleep soundly because men like you stand at their doors."],
          ['hero', "The guests applaud. Yet every night the carts go down from the wards full, and every morning they come back up empty."],
          ['hero', "I have held a wall on one man's word for a year. It is time I weighed the word."]
        ] },
      2: { zone: 'enginecore', with: 'vesper', goal: "Hold the feed lines beside Vesper",
        card: "Aldric asked one question too many about the carts. Vesper, the Night Ward's lamplighter, answers it: she leads him below the Spire to the Engine's feed lines, and makes him look.",
        meet: [
          ['vesper', "Knight. You asked about the carts. Stop asking. Look."],
          ['hero', "Seventy-seven, of the Night Ward. ...The red scarf. You lit the lamps along my sea wall, at home."],
          ['vesper', "Every dusk. You never turned round. Look down."],
          ['hero', "Grey shapes along the pipes. Breathing. Those are Subjects. Those are the people I was set to guard."],
          ['vesper', "Husks. What the Engine leaves. That is what your Director's word was worth."],
          ['agent', "Intruders on the feed lines! ...Sir? Sir, step away from the asset."]
        ],
        win: [
          ['hero', "I swore an oath to keep harm from them. For a year I have stood on harm's side of the door."],
          ['vesper', "Then move."],
          ['hero', "I will. Not tonight, and not alone. When I turn, the whole Hall turns with me."]
        ] },
      3: { zone: 'skyport', rival: 'tor', goal: "Duel Tor at the Skyport",
        card: "Halcyon sends its finest knight to the Skyport to break a wall from the Surface. Aldric goes, because he has long wished to see Tor hold a line.",
        meet: [
          ['tor', "Knight. I'm Tor. Nothing has passed me."],
          ['hero', "No one passes my wall either. Halcyon sent me to break you. I came to see a wall worthy of the name."],
          ['tor', "Plant your feet. One of us moves."],
          ['hero', "Or neither does. Let us learn which."]
        ],
        win: [
          ['tor', "You hit like a gate shutting. I'm standing. Further back."],
          ['hero', "Two walls, and neither truly gave. At home we would have stood shoulder to shoulder on the same stones."],
          ['tor', "When your Hall turns, knight, the gate turns with it."]
        ],
        lose: [
          ['tor', "Nothing passes. Not even you. Up."]
        ] },
      4: { zone: 'noble', goal: "Hold the Noble Ring with your knights",
        card: "Two stolen faces have set the three layers at each other's throats, and the Director orders the Proving Hall down to Deepline. Aldric has seen the feed lines. He turns his knights around.",
        intro: [
          ['sys', "The Three-Layer War. Sky screens show Kael, a Deepline street kid, opening the Sump's vents on the labs. Deepline's show Nyra leading the drills down."],
          ['director', "Deepline has struck first, as we always knew it would. The Hall marches tonight, Twelve. Lead them down."],
          ['hero', "I know that boy's face from your screens, Director. I also know your feed lines. One of the two is a lie, and I know which."],
          ['vesper', "The knights are at your back, Aldric. Tell them what you saw."],
          ['hero', "Knights of the Hall! Our oath was to the people, never to one man. Turn around. Harm is at our backs."]
        ],
        win: [
          ['hero', "The Hall has turned, the wards rise, and Coda has cut her strings on the opera stage. My oath to the Director is broken. The older one stands."],
          ['sys', "Oda's bell rings three times over the Buried Meridian. In the Pit, Pell is caught in his own strings and names the face-thief: Rue."],
          ['sys', "At the Crater a second Kael runs from the real one. Each layer was blaming the other for a puppet show. Four banners start up the Spire."],
          ['kessen', "Captain. They have cut the pylons to drop the city. Chamber Six, on your way up: I can reroute them by hand. Hold that door."],
          ['hero', "No one came through. The city fell one floor, and caught. Now, the Engine Core, before whatever it calls can answer."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Hold the floor of a falling city",
        card: "Vael's champion Vega drags Aurelia down from Pylon Chamber Six; Aldric holds the floor and the door against her until she falls back to the crown-ship.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "Pylon Chamber Six again. A stranger with a star in her palm walks in, and all Aurelia leans toward her."],
          ['hero', "I held this door for Kessen once. I will hold it again. No one touches her pylons."]
        ],
        meet: [
          ['vega', "Captain of a harbour wall. I know your harbour. I fell out of it, upward, the night it tore."],
          ['hero', "Then you know what a wall is for. It stands between harm and the people."],
          ['vega', "Everything falls toward me. Walls. Cities. Knights."],
          ['hero', "Then I shall be the one thing that does not."]
        ],
        win: [
          ['sys', "Aldric holds the floor under the whole weight of her star, and his blade drives Vega back, step by step, to the door."],
          ['vega', "Stubborn wall. Vael will drop this city on you himself."],
          ['hero', "Let him come. Kessen, mind the pylons. I have the floor."],
          ['kessen', "Holding. One floor lower, and holding. My thanks, captain."]
        ],
        lose: [
          ['vega', "Kneel, knight. Gravity has never lost."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Aldric's knights hold the Crater rim while the six climb; when Itsuki comes down after them, Aldric plants his feet on the path and holds him there.",
        intro: [
          ['sys', "The Crater. The Hollow Legion descends from the crown-ship, rank on rank. Three layers form one line on the rim."],
          ['hero', "Knights. One more wall. Every soul behind us is a soul we swore to keep."],
          ['sys', "Six pass through the line and climb toward the Crown. The harbour girl from the tanks is one of them."],
          ['hero', "Go, Nyra. The wall holds behind you. No one follows you up."]
        ],
        meet: [
          ['sys', "A man in a long black coat comes back down the path after the six. The Legion parts for him like grass."],
          ['itsuki', "A knight. You plant your feet well. The six have gone up, and I go after them. Stand aside."],
          ['hero', "I have never once stood aside for harm. You will not be the first."],
          ['itsuki', "Good. I hoped someone on this rim would say so."]
        ],
        win: [
          ['sys', "Blow after blow, and the knight does not give a step. Itsuki looks up at the Crown, then turns and climbs back toward it."],
          ['itsuki', "You held, knight. Long enough. Keep your feet."],
          ['sys', "From the rim, the knights watch the crown-ship fall into the Crater, and the door to the Beyond slams shut."],
          ['sys', "It drags the Legion and every champion back through. Itsuki goes last, with a nod down at the knight."],
          ['hero', "We stood between. At last. All of us."],
          ['sys', "The morning after. Aldric walks the wards beneath Vesper's lamps. His knights carry beds now instead of blades."],
          ['hero', "A falcon on the gate, and the Subjects walking free. A wall again. A better one."],
          ['hero', "My oath is kept."]
        ],
        lose: [
          ['itsuki', "A good wall. All walls fall. Get up."]
        ] }
    },

    // ---------------------------------------------------------------- PYRA
    pyra: {
      1: { zone: 'furnace', goal: "Burn your way out of the Burn Ward",
        card: "For six weeks the Burn Ward has run on one girl from the Frozen Harbour, the way a stove runs on coal. It is week seven, and the glass has started to tick.",
        intro: [
          ['sys', "The Burn Ward. Pipes sweat, gauges creep into the red, and in the middle of it all a girl in a glass bottle drums her fingers."],
          ['hero', "Pyra. At home there was a blue forge that never went out. Here there's a bottle, and guess who gets to be the coal."],
          ['elixa', "Week seven, Subject 44. I asked them to stop the second colour. They said no. So I am to watch, and write it down."],
          ['hero', "Aw, notes. Sweet. Want to write down what happens next? Listen. That ticking is the glass."],
          ['agent', "Temperature spike in the Burn Ward! Contain 44! CONTAIN-"]
        ],
        win: [
          ['hero', "I burned down the Burn Ward. Honestly, somebody should have read the name on the door."],
          ['hero', "Down the hall there's an ice girl with frost in her hair who swears she can walk. She can't. Up you get, Nyra. It's warm where we're going."]
        ] },
      2: { zone: 'core', with: 'ashka', goal: "Hold the Core Sump with Ashka",
        card: "Pyra's fire carries Nyra out and keeps on going, down the vents, to the Sump. Something chained in the dark burns back.",
        meet: [
          ['sys', "The Core Sump, at the very bottom of Deepline. Pyra's fire pours down the vents, and in the dark, something burns back."],
          ['ashka', "Who's pouring fire down my vents. ...You. You burn like home."],
          ['hero', "Pyra. Subject 44, formerly. I carried a girl out through my own fire tonight, and the fire didn't stop. It came looking for you."],
          ['ashka', "Ashka. Sixty. Half of Deepline sleeps warm because I'm chained down here. A year now."],
          ['hero', "I tried to melt those chains just now. Nothing. I hate that more than I hate Halcyon, and I really, really hate Halcyon."],
          ['ashka', "Nothing melts them. I fight fine inside them. Boots on the stairs. Halcyon's coming down."]
        ],
        win: [
          ['ashka', "You fight like a forge with its doors kicked open. Like a sister."],
          ['hero', "Then that's what we are. I'll come back with something that breaks chains, sister. Count on it."],
          ['ashka', "Burn bright up there. I'll feel it through the pipes."]
        ] },
      3: { zone: 'ballast', rival: 'kestra', goal: "Win fight twelve against Kestra",
        card: "Two girls, one phoenix, eleven fights and no agreement on the score. Kestra calls fight twelve in the undercroft, the hottest room under the gold.",
        meet: [
          ['kestra', "There she is. Strolls out of the Burn Ward wrapped in a phoenix like she owns it."],
          ['hero', "It came out of my fire, feathers, so I kind of do. Eleven fights. I'm ahead, by the way."],
          ['kestra', "You are NOT. My clan has danced the phoenix under this city for a hundred years. Fight twelve. Here, on our beams."],
          ['hero', "Ooh, your beams. Hope they're fireproof, honey."]
        ],
        win: [
          ['kestra', "Fine. Twelve to you. The phoenix question stays open."],
          ['hero', "It's a bird, Kestra. It has two wings. Take one."],
          ['lin', "And while you share it, both of you, kindly stop setting fire to the beams."]
        ],
        lose: [
          ['kestra', "Sit down, matchstick. Thirteen, whenever you like."]
        ] },
      4: { zone: 'noble', goal: "Burn down the gates of the Noble Ring",
        card: "Two forged films have every layer blaming the others, and Halcyon slams the Noble Ring's gates to march its knights down to Deepline. Pyra is very good at gates.",
        intro: [
          ['sys', "The Three-Layer War. Sky screens loop Kael, a Deepline kid, opening the Sump's vents on the labs. Deepline's loop Nyra leading Halcyon's drills."],
          ['hero', "Nyra was on my back the week she's meant to be down there. And Ashka watched that boy from her chains. Never sweated. In the Sump. Even rocks sweat."],
          ['agent', "The Proving Hall marches on Deepline! Shut the gates! Nobody leaves the Ring!"],
          ['hero', "Gates. Adorable. Everybody stand back, this is the part I'm good at."]
        ],
        win: [
          ['hero', "No more gates. Aldric's knights come out facing the right way for once, and Coda's dancing Pell's dirty secrets onto the walls."],
          ['sys', "Oda's bell rings three times over the Buried Meridian. In the Pit, Pell is caught in his own strings, and the Sump breaks open: Ashka walks out."],
          ['sys', "Kiri's crane carries Pell's word to the Crater: Rue. A second Kael in the crowd runs. Four banners start up the Spire toward the Engine Core."],
          ['hero', "My sister's out, and somebody lit this war with a borrowed face. Up the Spire, then, before that Engine finishes shouting for whatever it wants."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Walk into Lux's white light",
        card: "Lux, Vael's champion from a world of light, burns the Noble Ring white; Pyra walks straight into the glare with red fire and drives her off.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Noble Ring. A stranger with a crystal lance lands on the opera roof, and her light falls white and burning."],
          ['hero', "White fire on the Ring, and Nyra's Subjects are down there. Fine. Red fire's here too, and it's in a mood."]
        ],
        meet: [
          ['lux', "Little fire. Stand aside. I bring light, and Vael tells me this city needs a great deal of it."],
          ['hero', "They kept me in a bottle up here for six weeks. The people I carried out are on that Ring. You don't get them."],
          ['lux', "White is clean. When I am done there is nothing left to bottle. Nothing left at all."],
          ['hero', "Light is for seeing by, sunshine, not for burning people blind. Let me show you what hot means."]
        ],
        win: [
          ['sys', "Pyra walks straight into the glare, red against white, and drives Lux off the opera roof."],
          ['lux', "You burn too hot for my light. Next time I bring more."],
          ['hero', "Bring the whole crown-ship. I have thick skin and a short fuse."],
          ['sys', "Lux climbs back toward the crown-ship. Behind her the Ring stands scorched, and standing."]
        ],
        lose: [
          ['lux', "Too dim, little fire. Fade out."]
        ] },
      6: { goal: "Bring down the Hollow Crown",
        card: "Pyra climbs into the Crown with the other five saviours, out-burns Itsuki on the path, and puts the fire into the six-element blow that brings Vael down.",
        intro: [
          ['sys', "The Crater. Sky, Surface and Deepline on one rim, and the Hollow Legion pouring out of the crown-ship."],
          ['ashka', "Go up, sister. I'll hold the rim. The core burns hotter than anything they've got in there."],
          ['hero', "I know. Kael, Nyra, Gale, Brakk, Nami: six of us. Somebody try to keep up."],
          ['nyra', "I remember who carried me out of the Burn Ward, Pyra. Today I'll carry the song."],
          ['hero', "Deal. I'll take the hot side."]
        ],
        meet: [
          ['sys', "At the foot of the Crown, Itsuki waits on the path. A small flame turns in his palm, still as a lamp behind glass."],
          ['itsuki', "Fire. I learned it first, on another world. Yours is wild. Mine is not. Step aside."],
          ['hero', "Wild is the whole point. Nobody bottles this one twice."],
          ['itsuki', "Then let us see whose fire burns longer."]
        ],
        win: [
          ['sys', "Itsuki's flame gutters. He steps off the path, almost smiling, and lets the six go in."],
          ['sys', "Inside the crown-ship the Convergence and Sovereign Vael stand together, waiting. Six walk in to meet them."],
          ['hero', "Brakk, stone. Nami, water. Gale, wind. Kael, thunder. Nyra, sing. And fire. Everything. NOW!"],
          ['sys', "Six elements strike Vael as one. The crown-ship falls into the Crater, and the door to the Beyond slams shut."],
          ['sys', "The door drags back the Legion and every champion; Lux's white glare goes with them. Itsuki is the last through."],
          ['sys', "The morning after. Pyra lights the old Burn Ward furnace one more time. Today it bakes bread."],
          ['hero', "Ashka's on the rim, watching the sky. Kestra wants fight thirteen. Elixa's still on my list. ...Lower down."],
          ['hero', "Too hot for you?"]
        ],
        lose: [
          ['itsuki', "Wild fire burns out. Get up, and burn again."]
        ] }
    },

    // ---------------------------------------------------------------- YARA
    yara: {
      1: { zone: 'range', goal: "Hold the Firing Gallery for the skiff",
        card: "Halcyon's best marksman has not missed in a year of shooting. Today the mark is a skiff under a patched sail, and it is full of people.",
        intro: [
          ['sys', "The Firing Gallery. A long white room open to the wind, and a mark a mile out over the clouds. Subject 57 has never missed."],
          ['hero', "Yara. I lit the lamp on the sea wall so the ships could find their way in. Halcyon says this is the same job."],
          ['agent', "Target at one mile, bearing for the Skylift. Wind three knots west. Fire, 57."],
          ['hero', "That's no ship. Those are people hanging off a rag of sail. Runaways from the wards."],
          ['agent', "Escaped Subjects. Fire, 57, or take their place on the feed lines."],
          ['hero', "A lamp brings people home. It doesn't knock them out of the sky. Turn around, gentlemen. I've found a nearer target."]
        ],
        win: [
          ['hero', "The skiff made the Skylift. Every soul on it."],
          ['hero', "How many of my mile-out marks were never ships at all? I'll count them. Every one. Later."]
        ] },
      2: { zone: 'saloon', with: 'jax', goal: "Hold the Long Bar with Jax",
        card: "The runaways ride the Skylift down to the Surface, and Halcyon's recovery team rides down after them. At Mile Zero, Jax holds the Long Bar's door.",
        meet: [
          ['sys', "Mile Zero, the Long Bar. Dust on the windows, cold water on the counter, a skiff's worth of runaways under the tables."],
          ['jax', "Easy with that bow, Aurelia. You're the one who wouldn't shoot. Whole skiff's been drinkin' to your name."],
          ['hero', "Yara. I kept the lamp on our sea wall, back home. Those people are mine to bring in."],
          ['jax', "Jax. Nobody belongs to anybody in my bar, partner. I'll take the near ones. You take anything past ten paces."],
          ['hero', "Past ten paces is everything worth an arrow."],
          ['jax', "Then we argue later. Company's here."]
        ],
        win: [
          ['jax', "Fine shooting, at a mile. Up close you'd have died twice, and I'd have had to mop it up."],
          ['hero', "And at a mile you missed every one. Call it even?"],
          ['jax', "Nobody buys the round. Suits me. Go on home, Yara. Your runaways sleep safe under my roof."]
        ] },
      3: { zone: 'scrapton', rival: 'hart', goal: "Duel Hart on the Rust Flats",
        card: "Bow against spear: the bet has run for two years. On the Rust Flats, with no caravan to guard, Hart finally charges.",
        meet: [
          ['hart', "Two years, Yara. Bow against spear. Open ground, no wagons, no cover. Rules are rules."],
          ['hero', "A bow reaches further, Hart. That was always the whole bet."],
          ['hart', "A bow never stopped a charge. Keep your distance. I'll keep it for you."],
          ['hero', "Then charge. Every yard you close costs you an arrow. Count them as you come."]
        ],
        win: [
          ['hart', "Never got close. Not once. Fine. The bow reaches further."],
          ['hero', "Settled, spear-boy. You owe me a drink. Jax owes me two."],
          ['hart', "Jax will swear it wasn't ten paces. Good luck collecting."]
        ],
        lose: [
          ['hart', "Close enough to touch, Yara. That's a spear's distance. Again?"]
        ] },
      4: { zone: 'noble', goal: "Clear the gunners off the Noble Ring",
        card: "Two forged films have turned the three layers on each other, and Halcyon has put a gun on every balcony around the Ring. Yara takes the long shot: the whole length of it.",
        intro: [
          ['sys', "The Three-Layer War. Sky screens loop Kael opening the Sump's vents on the labs; Deepline's runners swear Nyra led the drills in. Each blames the other."],
          ['hero', "I watched that film through my scope. The boy at the vents never blinks. Forty seconds. Nothing alive goes forty seconds."],
          ['agent', "Gunners to the balconies. The Proving Hall marches. Anyone on the Ring without a badge is a target."],
          ['hero', "Guns on every balcony, end to end, in one straight line. Careless. One breath, one arrow. The lamp is lit."]
        ],
        win: [
          ['sys', "One arrow, drawn for a whole breath, runs the length of the Noble Ring. Every Halcyon gun along it goes quiet."],
          ['hero', "Clear. The wards can cross, and Aldric's knights hold the stairs facing out. Word from the Pit: Pell named the face. Rue."],
          ['sys', "At the Crater a second Kael runs from the real one. Oda's bell has called the Surface; Deepline has the Pit. Four banners climb the Spire."],
          ['hero', "Engine Core at the top, and it's been signalling something a long while. We get there before anything signals back."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Pin Lux's light from a mile",
        card: "Lux burns the Noble Ring white for Vael; Yara, who lit the harbour's lamp to bring ships home, steps back a mile and pins her with one arrow.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Noble Ring burns white. A stranger with a crystal lance walks through the glare, the Hollow Legion at her heels."],
          ['hero', "That's no lamp. A lamp brings people home. That light is blinding them."]
        ],
        meet: [
          ['lux', "Archer. You aim with light. So do I. Mine is larger."],
          ['hero', "I lit our sea wall so the ships could find home. You're putting out every road home on this Ring."],
          ['lux', "Light does not care about home. It only shines."],
          ['hero', "Mine cares. One mile. One breath. Hold still."]
        ],
        win: [
          ['sys', "Yara steps back a mile, draws for one whole breath, and the arrow nails Lux's lance to the opera roof."],
          ['lux', "From a mile. I never saw it come."],
          ['hero', "Nobody does. Go home to your master and tell him the lamp is still lit."],
          ['sys', "Lux wrenches the lance free and flies back toward the crown-ship. The white glare goes with her."]
        ],
        lose: [
          ['lux', "Your little lamp, archer. I have put out suns."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Yara holds the Crater rim while the six climb; when Itsuki comes down after them, she pins him to the path one arrow at a time until the Crown falls.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours from the crown-ship in endless ranks. The three layers hold the rim."],
          ['sys', "Six climb through the middle of it. Pyra is one of them, still scorched from Lux's light."],
          ['hart', "Keep your distance today, Yara. I'll keep it for you."],
          ['hero', "Then I'll keep theirs. Go, Pyra. Every step you climb, I'm watching the path behind you. The lamp is lit."]
        ],
        meet: [
          ['sys', "A man in a long black coat comes back down the path after the six. Arrows already in the air bend away from him."],
          ['itsuki', "An archer who never misses. I learned wind on another world, and wind moves arrows. Step aside."],
          ['hero', "You put Jax on the sand in the Dunes. He owes me two drinks. I'm collecting on his behalf."],
          ['itsuki', "Then shoot, and we will see whose wind this is."]
        ],
        win: [
          ['sys', "Arrow after arrow, from a mile, from ten paces. Itsuki never reaches her. At last he turns back toward the Crown."],
          ['itsuki', "You kept me down here long enough. They will be inside by now. Well shot, archer."],
          ['sys', "From the rim, Yara watches the crown-ship fall into the Crater, and the door to the Beyond slams shut."],
          ['sys', "It hauls the Legion and every champion back through. Itsuki goes last."],
          ['sys', "The morning after. Yara climbs the Skyport tower and lights the old beacon, dark for a year."],
          ['hero', "Every ship, every skiff, every runaway: this way home. Jax, Hart: tonight, the drinks are on me."],
          ['hero', "Meridian. Your last light."]
        ],
        lose: [
          ['itsuki', "The wind took that one. Again."]
        ] }
    },

    // ---------------------------------------------------------------- KIRI
    kiri: {
      1: { zone: 'shrine', goal: "Fight your way out of the Paper Shrine",
        card: "A herder's daughter from the steppe wakes in the Paper Shrine under Deepline, twice over, among a thousand paper wishes left for the dead. She has paper, nerve, and one way to go: up.",
        intro: [
          ['sys', "The Paper Shrine, deep under Deepline. Folded wishes for the dead hang from the ceiling on threads, turning in the draught."],
          ['hero', "This is not the steppe. The steppe has sky. Okay: Kiri, herder's daughter, Vharra. Still two of me? ...Yes. Hello, me."],
          ['hero', "Sorry, wishes. I'm going to fold you into something with wings and take you somewhere with sky. All of you. Promise."],
          ['agent', "Torn-through in the shrine, two signatures. Bag her before she's properly awake."],
          ['hero', "Too late! We're BOTH awake! And we're both annoyed!"]
        ],
        win: [
          ['hero', "One crane, wide enough for two Kiris and every wish in the shrine. Hold on tight, everyone. We're going up the Stacks."],
          ['sys', "The first Deepliner ever to reach Aurelia without a ticket lands on a golden roof, under a snowfall of paper."]
        ] },
      2: { zone: 'slums', with: 'rook', goal: "Hold the Slums with Rook",
        card: "The Paper Post carries a letter Halcyon wants unsent down to the Deepline Slums. The boy who signs for it is Rook of the Lantern Cell, all eight of him.",
        meet: [
          ['sys', "The Deepline Slums. Laundry lines, cook smoke, and a crowd of boys wearing the same grin. It is one boy."],
          ['rook', "Paper girl! Kiri, right? Letter for us? Wait. Which one of you do we sign for?"],
          ['hero', "Either. Both. Same girl, twice. Sora flies the high letters, I fold the rest and run them low. Sign here, here, and... there."],
          ['rook', "Same! I mean, I'm the same guy, like eight times. Everybody else says it's weird."],
          ['hero', "It's not weird. It's efficient. ...Also, every Halcyon collector in the Slums is standing right behind you."],
          ['rook', "Great! There's more of us than them!"]
        ],
        win: [
          ['rook', "You fold, we clone, nobody gets lonely. Come back any time, paper girl."],
          ['hero', "The Post delivers to everyone. Even boys who are mostly reprints."],
          ['hero', "...Mostly reprints. Sorry. That was her."],
          ['rook', "Original, thank you. The others are reprints of ME."]
        ] },
      3: { zone: 'shrine', rival: 'rue', goal: "Duel Rue in the Paper Shrine",
        card: "Something comes to the Paper Shrine in Kiri's face, then someone else's, then nobody's. Rue, Pell's spy, can copy anyone she meets. She has never met anyone who is two people.",
        meet: [
          ['sys', "The Paper Shrine. Among the wishes stands a girl in a white smiling mask. She is wearing Kiri's face. Then she isn't."],
          ['rue', "Both. Either. Same girl, two times. ...You said that in the Slums. It sounded better in your mouth. Why?"],
          ['hero', "You followed me? Ugh. You're doing my voice, and you're doing it wrong. Who sent you?"],
          ['rue', "Pell says, copy someone once and you do them better than they do. Pell is never wrong. But I keep getting lost in you."],
          ['rue', "There are two of you. I can only be one thing at a time. Hold still and be one girl."],
          ['hero', "Not a chance. You took my face without asking, and the Post doesn't deliver to thieves. Both of us! Fold her up!"]
        ],
        win: [
          ['rue', "Stop... moving. I can't hold your shape. Which of you is the real one?"],
          ['hero', "Both. That's the one thing you can't copy. Neither of us is pretending."],
          ['sys', "Rue's mask slips. For one heartbeat there is nothing under it at all. Then she is gone, and the wishes drift slowly back down."]
        ],
        lose: [
          ['rue', "There. Three Kiris now. And the best one is me."]
        ] },
      4: { zone: 'noble', goal: "Fly the cranes past the Ring's guards",
        card: "Aurelia's screens say Deepline struck first; Deepline's say the Sky did. Kiri knows the trick behind both; she has met it before. Tonight a thousand cranes tell the Ring the truth.",
        intro: [
          ['sys', "The night of the Siege of the Noble Ring. On every gold balcony a screen plays Kael, Deepline's white-haired street kid, gassing the labs from the Sump."],
          ['hero', "Rook sent word up: down there they're shown Nyra, the singer from the Med-Lab, leading Halcyon's drills in. Each side blames the other."],
          ['hero', "I know this trick. I fought it in the shrine: something with no face, wearing whoever it likes. Same empty smile under both."],
          ['coda', "Then tell the whole Ring. Pell's secrets are stitched into my ribbons, and tonight I cut them loose. Fold them. Fly them."],
          ['hero', "A thousand cranes, one secret each, one for every door on the Ring. The Proving Hall can read too. Go, go, GO!"]
        ],
        win: [
          ['sys', "A thousand cranes land on a thousand doorsteps. The Ring reads who pays Halcyon, and for what. The Proving Hall halts on its own stairs."],
          ['sys', "A letter rides up the Skylift from the Pit. The Lantern Cell has Pell in his own Cat's Cradle, and Pell has named the face: Rue."],
          ['sys', "Kiri flies it to the Crater herself. Kael and Nyra stand ready to tear each other apart, and a second Kael watches from the crowd."],
          ['hero', "RUE! It's Rue! Kael, behind you! ...And there it goes. Running away with your face on."],
          ['sys', "From the Surface comes word of Oda's bell, three tolls over the Meridian drills. Hollis paints a fourth banner, and four start up the Spire."],
          ['hero', "Folded, flown, delivered. Next stop: the Engine Core, before the thing it keeps calling hears back. The Post carries for all four banners."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Fly through Corvin's crows",
        card: "Corvin, Vael's champion, blacks out the Skyport with his crows; Kiri, both of her, snares them in paper cranes and drives him back to the crown-ship.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport goes dark. A hooded stranger's crows blot out the sun, and the Hollow Legion lands in the black."],
          ['hero', "Dark sky, black wings. All right, cranes: white paper shows best at night. Let's be loud about it."]
        ],
        meet: [
          ['corvin', "Paper bird. I have read the omen: your sky ends today. Fold yourself a grave."],
          ['hero', "I folded the wishes of the dead into wings. They wanted to fly, not end. And who are you, exactly?"],
          ['corvin', "Corvin. My world sent its crows to watch it die. Now they watch yours."],
          ['hero', "Then let them watch this. Both of us. NOW!"]
        ],
        win: [
          ['sys', "Paper cranes snare the crows by the hundred. Two Kiris burst through the gap from two sides at once."],
          ['corvin', "Two of you. The omen showed one. The omen is wrong. The omen is never wrong."],
          ['hero', "It's wrong today! Back to your crown-ship, crow-man. The Post has deliveries."]
        ],
        lose: [
          ['corvin', "Wet paper. Torn wings. It was written long ago."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "While the sky over the Crater burns, the Legion's last assault falls on the Paper Shrine; both Kiris guard the wishes of the dead against a Siege Walker.",
        intro: [
          ['sys', "The Paper Shrine, under Deepline. Far above, the sky over the Crater burns. Down here, the Hollow Legion has come for the wishes."],
          ['hero', "The Paper Post flew every letter up to the Crater. Someone had to stay home and mind the shrine. Two someones."],
          ['hero', "All right, wishes. Nobody burns you tonight. Fold, both of us!"]
        ],
        meet: [
          ['sys', "The shrine floor shudders. A Siege Walker shoulders through the doorway, and the Legion forms up in its shadow."],
          ['hero', "That's the big one. Paper beats rock. Usually. Let's find out!"]
        ],
        win: [
          ['sys', "The Siege Walker crashes down among the cranes. Then every Legion soldier in the shrine stops mid-step and goes still."],
          ['sys', "A crane drops down the Vent Stacks into Kiri's hands, in Sora's scrawl: The sky's closed. They're gone. All of them."],
          ['hero', "Gone. Hear that, wishes? Quiet. The real kind."],
          ['sys', "The morning after. Kiri folds the shrine's last wish into a crane, and both of her carry it up into the sun."],
          ['hero', "Every wish gets delivered; that's the Post. Next stop Vharra, the day the way home opens. With a LOT of cranes."],
          ['hero', "Folded and finished!"]
        ] }
    },

    // ---------------------------------------------------------------- KESTRA
    kestra: {
      1: { zone: 'ballast', goal: "Drive Halcyon's sweep off the Decks",
        card: "Under the nobles' feet, where the pylons run hot, the Sky Clan has danced fire for generations. Tonight a Halcyon sweep comes down looking for the heat.",
        intro: [
          ['sys', "The Ballast Decks, the hot dark under the gold. The pylons hum like a held note. Somewhere in the dark, a fan snaps open."],
          ['hero', "Kestra of the Sky Clan. We've danced fire down here for a hundred years, under the nobles' slippers, and not one of them has ever looked down."],
          ['agent', "Heat bloom on ballast deck three. Unregistered combustion. Sweep it and log it."],
          ['hero', "Combustion? How rude. It's a dance. ...Fine. Now it's both."]
        ],
        win: [
          ['hero', "Sweep finished. Theirs, I mean. Fire first, then the fan to make it worse. They never learn the second part."],
          ['hero', "Someone upstairs will smell the scorch, of course. And Lin is going to give me the look. She's probably giving it to the wall already."]
        ] },
      2: { zone: 'ballast', with: 'lin', goal: "Hold the Ballast Decks with Lin",
        card: "Kestra has scorched three of the beams the whole city stands on. Lin arrives with the look, and close behind it comes a Halcyon captain with a full sweep.",
        meet: [
          ['lin', "Kestra. Three beams scorched. The city sits on those."],
          ['hero', "And here it is. The look. I can feel it on the back of my neck."],
          ['lin', "It's in front of you. Behind it is Halcyon: a full sweep, with a captain this time."],
          ['hero', "Then they get the whole dance. You keep the beams cool. I keep the fire on them, and only on them. Mostly."],
          ['lin', "Every fifth strike. Breathe, sister. Fire goes where your breath goes."]
        ],
        win: [
          ['hero', "Not one beam caught. Not one! How do you DO that?"],
          ['lin', "I watch the fire. You watch the enemy. Neither of us watches the score."],
          ['hero', "I always watch the score. Speaking of which: they say the Burn Ward has a new phoenix. Wearing MY bird."]
        ] },
      3: { zone: 'ballast', rival: 'pyra', goal: "Duel Pyra in the Ballast Decks",
        card: "Fight twelve of the phoenix question. Pyra, who burned the Burn Ward down on her way out of it, strolls into the Ballast Decks wearing the bird Kestra's family has danced for a century.",
        meet: [
          ['pyra', "Kestra! Fight twelve, feathers. And you picked the hottest room in the city. For me? You shouldn't have."],
          ['hero', "My family danced the phoenix in this dark before your lab was even built. Then you walk out of a burning lab wearing one. Like a hat."],
          ['pyra', "It came out of MY fire, so it's mine. And it's eleven fights, and I'm ahead. Everybody knows that."],
          ['hero', "Nobody knows. Nobody agrees. Tonight they will. Mind the beams."],
          ['pyra', "Ooh, the beams. Bo-ring. I'll mind them after."]
        ],
        win: [
          ['pyra', "Fine. Twelve's yours. ...That dive, though. That was something."],
          ['hero', "A century of practice. The phoenix is ours. ...Though I suppose a phoenix could spare a second tail."],
          ['lin', "Two tails. One undercroft. No burning beams. I am asking you both, nicely, once."]
        ],
        lose: [
          ['pyra', "Sit down, feather duster. Thirteen's whenever you want it. Bring a bucket."]
        ] },
      4: { zone: 'noble', goal: "Raise the Clan and hold the Ring",
        card: "The screens say Deepline struck first, and Halcyon's knights will march down to make it pay, right over the Sky Clan's roof. Kestra decides the Clan has hidden long enough.",
        intro: [
          ['sys', "The night of the Siege. Above the undercroft the Noble Ring is shouting at its screens: Kael, a white-haired Deepline boy, throwing the Sump's vents open."],
          ['hero', "Look at the fire on that feed. It bends round him as if he isn't there. Fire doesn't go round people, Lin. It goes through them."],
          ['lin', "Below, they are shown Nyra, the singer from the Med-Lab, leading the drills in. Each layer is certain the other struck first."],
          ['lin', "And the Proving Hall is ordered down to Deepline tonight. Its road runs over our heads."],
          ['hero', "Over our roof, you mean. Sky Clan! A hundred years beneath their floor. Tonight we come up through it."]
        ],
        win: [
          ['sys', "The Ring's marble floor cracks open, and the Sky Clan rises out of the undercroft on wings of fire. The nobles finally look down."],
          ['hero', "Their faces! Worth every year we waited. Even the Proving Hall stopped dead on the stairs. Nobody marches into a phoenix."],
          ['lin', "Oda's bell has rung three times over the Meridian. In the Pit, Pell is caught in his own strings. He named his spy: Rue."],
          ['sys', "Kiri's crane flies the name to the Crater. A second Kael runs from the crowd. Hollis paints a fourth banner, for the Hidden Clans."],
          ['hero', "Our banner, in daylight, at last. Four of them, up four sides of the Spire to the Engine Core. Whatever it's been calling, it doesn't get an answer."]
        ] },
      5: { zone: 'gallery', foe: 'mira', goal: "Burn through Mira's mirrors",
        card: "Mira, Vael's champion and a reflection out of the harbour ice, turns the Observation Gallery's glass on Aurelia; Kestra burns through every mirror to reach her.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Observation Gallery. A masked stranger touches the glass, and every pane in Aurelia becomes a mirror."],
          ['hero', "My own fire, in a thousand mirrors, aimed at my own city. Oh, I do not like that."]
        ],
        meet: [
          ['mira', "Phoenix. Look: a hundred of you, and every one belongs to me. Whatever you strike is only my reflection."],
          ['hero', "Then I burn the reflections first. A hundred years we danced in the dark under this glass. It's ours."],
          ['mira', "Glass is a door, and Vael walks through doors. Your city is only the room behind it."],
          ['hero', "Then I'm shutting the door. Fire first, then the fan to make it worse."]
        ],
        win: [
          ['sys', "Fire moths swarm the Gallery. Mirror after mirror sags and runs, until a single Mira stands in the glass."],
          ['mira', "You found the real one. Nobody finds the real one."],
          ['hero', "Fire finds everything. Back to your crown-ship, mirror. The Gallery is ours."],
          ['sys', "Mira steps into the last pane and is gone. Every window in Aurelia is only a window again."]
        ],
        lose: [
          ['mira', "You burned a reflection, phoenix. The reflection burned you back."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault comes down into the Ballast Decks; Kestra dances the Sky Clan's fire against a Siege Walker to keep the undercroft standing.",
        intro: [
          ['sys', "The Ballast Decks. Far off, the Crater's sky burns, and the Hollow Legion slides down the cables into the undercroft like smoke."],
          ['lin', "Three beams scorched already, Kestra. The city still sits on those."],
          ['hero', "Then I burn the Legion and spare the beams. Sky Clan! Fire first, then the fan to make it worse."]
        ],
        meet: [
          ['sys', "The deck groans. A Siege Walker climbs down out of the cables, and every hollow soldier turns to follow it."],
          ['hero', "Big, slow, and stuffed with nothing. We danced down here for a hundred years. You don't get the floor."]
        ],
        win: [
          ['sys', "The Siege Walker topples off the edge of the deck in flames. Then the pylons hum a new note, and the light changes."],
          ['sys', "Through the ballast vents, the far violet sky over the Crater closes like an eye. The Legion stands still."],
          ['lin', "It's over, Kestra. Now breathe."],
          ['sys', "The morning after. The Sky Clan walks up through the Noble Ring's floor with its fans open, in daylight, on purpose."],
          ['hero', "No more hiding under the gold. And Pyra owes me fight thirteen, in daylight, where everyone can watch."],
          ['hero', "Rise again? Not you."]
        ] }
    },

    // ---------------------------------------------------------------- SORA
    sora: {
      1: { zone: 'skyport', goal: "Beat the drones over the Skyport",
        card: "A kite the size of a sail rides between Aurelia's towers. The girl hanging under it carries letters Halcyon wants unsent, and she has not touched ground since the sky tore.",
        intro: [
          ['sys', "The Skyport. Between the gold towers rides a kite as big as a sail, and under it, by one hand, hangs a grinning girl with a satchel."],
          ['hero', "Sora, of the kite clans of Vharra! Letters to anyone, anywhere, for a loaf of bread. Halcyon hates it. That's the best part."],
          ['hero', "When the sky tore I went up and my brother went down. I haven't set foot on anything since. Haven't missed it."],
          ['agent', "Unlicensed flyer over the Skyport. Interceptors, bring her to ground."],
          ['hero', "Ground? What's that? Is it nice? Does it have a view?"]
        ],
        win: [
          ['hero', "Every letter delivered, every drone in the harbour, and my boots still clean."],
          ['hero', "Gale's down there somewhere. He fell. ...He's fine. He's always fine. I'll find him from up here, where I can see everything."]
        ] },
      2: { zone: 'skylift', with: 'gale', goal: "Hold the Skylift with Gale",
        card: "Sora watched her brother fall out of the sky. Today, on the Skylift cables, he rides a hot updraft back up, already looking at her like she is made of glass.",
        meet: [
          ['hero', "That's... no. No, no, no. GALE?! You fell! I saw you go!"],
          ['gale', "Down a stack, up the same stack on the warm air. Took a while. Your towers are all gold, Sora. Very confusing."],
          ['hero', "You're here. You're really here. ...And you're going to hover. Your eyebrows are hovering already."],
          ['gale', "Hovering is how I say I love you. Who's your paper friend? Is she paying you? Is she paying me?"],
          ['kiri', "Kiri. I fold, your sister flies. We get paid in bread. Also, the cables are crawling with Halcyon, so: hugs later."],
          ['hero', "Brother, partner, kite. Let's give them something to look up at."]
        ],
        win: [
          ['kiri', "Three flyers, every tower in the city. That's not a round any more. It's a post. Call it the Paper Post."],
          ['gale', "And I come on every run. Every single one."],
          ['hero', "You do NOT. ...Some runs. The boring ones. Stop smiling like that."]
        ] },
      3: { zone: 'docks', rival: 'bando', goal: "Beat Bando on Dockside Nine",
        card: "Bando of Dockside Nine tells anyone who stands still that he once saved Sora's kite. Sora flies down to correct the record, and won't set one foot on his dock to do it.",
        meet: [
          ['sys', "Dockside Nine, the last wharf before the Drowned Line. A kite comes down the Skylift shaft and hangs over the cranes, very cross."],
          ['bando', "SORA! Everybody, look, it's her! The kite girl! The one I saved!"],
          ['hero', "You did NOT save me. You grabbed my kite out of a tree. On festival day. While I stood right underneath it."],
          ['bando', "Big tree, little girl, kite stuck up top. Then whoosh: one arm, clear across the field. Eleven arm's lengths, easy. That's a rescue."],
          ['hero', "I wasn't crying. I was shouting at the tree. New story for you: kite girl beats long arm, and never lands on your dock."],
          ['bando', "Ha! Come down here and say that."]
        ],
        win: [
          ['bando', "Not one toe on the boards. Not one! All right, all right. Kite girl wins."],
          ['hero', "Now the other part. Loud. So the whole dock hears."],
          ['bando', "I didn't save you. ...I sort of did, though. A little bit. About a thumb's length."],
          ['hero', "A thumb's length. Fine. You can tell THAT one."]
        ],
        lose: [
          ['bando', "Reach beats string! That's twice I've saved you now, kite girl!"]
        ] },
      4: { zone: 'noble', goal: "Clear the sky for Coda's ribbons",
        card: "Halcyon's screens say a Deepline boy struck the Sky first, and the Proving Hall is ready to march. Coda is about to dance out the truth, and someone has to fly it to every tower.",
        intro: [
          ['sys', "Dusk, the night of the Siege. From up high every screen in Aurelia glows with one film: Kael, a Deepline street kid, hauling the Sump's vents open."],
          ['sys', "Below, Deepline watches Nyra, the singer Halcyon kept in a tank, lead the drills into its tunnels. Each layer swears the other hit first."],
          ['hero', "I fly over the Crusher Yard every night. That night Kael was on a scrap heap eating noodles, nowhere near any vents. Somebody's lying."],
          ['coda', "Then carry the truth. Mid-act tonight I cut Pell's ribbons loose, every secret he stitched into them. Take them to every tower."],
          ['hero', "Every tower, every window. Gale, low route! And don't follow me!"]
        ],
        win: [
          ['sys', "A kite crosses every tower in Aurelia trailing a dancer's ribbons, and on every balcony, someone stops to read them."],
          ['hero', "The Proving Hall read them too, and stopped on the stairs. Hard to march on Deepline while the sky spells out who paid for the war."],
          ['sys', "Oda's bell has rung three times on the Surface. In the Pit, Pell hangs in his own strings and gives up a name. Kiri's crane flies it to the Crater."],
          ['hero', "Rue. Pell's spy with no face. Kael and Nyra were about to fight over her lies, and a spare Kael just bolted. Told you somebody was lying."],
          ['hero', "Four banners up the Spire now, to the Engine Core, and something up there is still calling. Highest route's mine. We get there first."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Bring Mika down",
        card: "Mika, Vael's champion who never touches the ground, cuts the Skylift cables; Sora, who never does either, meets her in the air and puts her on the roof.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger with two crescent blades cuts the cables one by one, and never once touches ground."],
          ['gale', "I've got the cars! Go and get her, Sora!"]
        ],
        meet: [
          ['mika', "Kite girl. You dangle from a string and call it flying. I have not touched the ground on any world."],
          ['hero', "Nor have I, since the tear. My sky, my record. And you're cutting my brother's cables in it."],
          ['mika', "Vael promised me a world with no ground at all. Let go of your string and come see it."],
          ['hero', "My string is tied to my brother. Mine stays. Yours I cut."]
        ],
        win: [
          ['sys', "Sora's kite string snatches Mika's blades out of the air, and for one moment Mika's feet touch the Skylift roof."],
          ['mika', "Ground. You put me on the GROUND."],
          ['hero', "First time? Don't worry. I won't tell a soul. Much. Now get off my sky."],
          ['sys', "Mika springs off the roof and back toward the crown-ship, furious, and never looks back."]
        ],
        lose: [
          ['mika', "No string reaches this high, kite girl. Let go."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Sora lets Gale climb into the Crown with the six, holds the Crater rim from the air, and keeps Itsuki on the path with a thousand kites until the Crown falls.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours from the crown-ship. The three layers hold the rim, and six climb through the middle."],
          ['gale', "Sora. I'm going up with them. Don't follow me, for once."],
          ['hero', "That's MY line. ...Go. For once I'll stay put. Paper Post! Keep the sky over the rim clear!"]
        ],
        meet: [
          ['sys', "A man in a long black coat comes back down the path after the six. The wind turns and follows him like a dog."],
          ['itsuki', "Kite girl. I learned wind on another world, and it needs no string. Your brother is up there. Step aside."],
          ['hero', "My brother says the wind doesn't need anything. It picks people. It picked us. You don't go after him."],
          ['itsuki', "Then let us see whom it picks today."]
        ],
        win: [
          ['sys', "A thousand kites snarl the path. Itsuki cuts through every one, looks up, and climbs back toward the Crown."],
          ['itsuki', "Long enough, kite girl. Your brother has his chance. Hold on to your string."],
          ['sys', "From the air above the rim, Sora watches the crown-ship fall into the Crater. The door to the Beyond slams shut."],
          ['sys', "It drags the Legion and every champion back through, Mika still airborne. Itsuki goes last."],
          ['sys', "The morning after. Gale lands on the rim with singed hair, and Sora comes down to meet him. Nearly."],
          ['hero', "One toe off the ground. That's as close as I come, brother. Now stop hovering. ...No. Don't stop."],
          ['hero', "Never touched the ground."]
        ],
        lose: [
          ['itsuki', "Strings break. Tie another."]
        ] }
    },

    // ---------------------------------------------------------------- CODA
    coda: {
      1: { zone: 'noble', goal: "Dance down the Director's drones",
        card: "The Noble Ring's star dancer once counted temple bells with her feet. Tonight she dances against drones for the Director's guests, and every step hangs on Pell's string.",
        intro: [
          ['sys', "The Noble Ring opera. Tonight the Director's guests want a spectacle: the star dancer against Halcyon's drones, live, without a net."],
          ['hero', "Coda. I learned to count on a temple floor on the Surface, with the bell tolling up through my feet. Now I count for the boxes. Five, six, seven, eight."],
          ['pell', "Smile, my star. Every step on the beat. I will know if you miss one. I always know."],
          ['hero', "I never miss, Pell. That's the whole trouble."]
        ],
        win: [
          ['sys', "Applause. Roses on the boards. A noble leans out of his box to whisper about the feed lines, and the ribbons remember every word."],
          ['hero', "Another secret for Pell, stitched in on the beat. Bow. Smile. Hate it. One night I'll find the scissors."]
        ] },
      2: { zone: 'noble', with: 'zara', goal: "Hold the House Edge with Zara",
        card: "After the opera, Coda slips Pell's strings for a single night and walks into the House Edge, the Ring's richest card room. Zara gives her a chair, a bet, and a fight.",
        meet: [
          ['sys', "The House Edge, past midnight. Coda walks in alone, still in stage paint, past the high tables."],
          ['zara', "The star at my tables, and without her shadow. Sit, before somebody runs to tell Pell."],
          ['hero', "Every step I take, somebody holds the string. Tonight I want one step that's mine. Even if it only goes as far as a chair."],
          ['zara', "Then the chair is yours, any night you need it. I'm betting on you, star. I don't lose."],
          ['hero', "Your doorman says there are men in grey outside. Pell's, Halcyon's. Hard to tell them apart tonight."],
          ['zara', "Then you dance. I'll deal. Mind the chips."]
        ],
        win: [
          ['zara', "Not one chip on the floor. You fought as if nobody held the string."],
          ['hero', "Nobody did. One, push. Two, turn. Three, fly. I counted it myself."],
          ['hero', "Keep my seat warm, Zara. One night I won't go back to him."]
        ] },
      3: { zone: 'noble', rival: 'pell', goal: "Duel Pell on the opera stage",
        card: "Mid-performance, with the whole house watching, Pell walks onto the stage to take his star back in hand. Coda decides the house can watch something new.",
        meet: [
          ['sys', "The opera, mid-performance. The orchestra swells. In the wings, the strings go taut."],
          ['pell', "You missed a step last night, my star. At the House Edge, of all the vulgar places."],
          ['hero', "I didn't miss it. I took it. Without you."],
          ['pell', "I took you out of a temple and gave you the sky. Every step you own, I bought. Bow, and we'll call tonight a rehearsal."],
          ['hero', "I've bowed for you since I was nine. Here's your change, Pell. One string at a time, on the beat."]
        ],
        win: [
          ['sys', "Wire after wire parts in her hands. The house thinks it is choreography, and rises to its feet."],
          ['pell', "Cutting your strings in the middle of a performance. How very rude. ...A bow, my star? No? Then I'll take one for us both."],
          ['hero', "The strings in your hands are gone. The ones stitched into my ribbons are next, and this time I choose the audience."]
        ],
        lose: [
          ['pell', "Back on the beat, my star. My beat. It always was."]
        ] },
      4: { zone: 'noble', goal: "Hold the stage through the last act",
        card: "The screens say Deepline struck first, and the Director wants the opera to play on while the Proving Hall marches. Coda knows whose orders made those faces. They are stitched into her ribbons.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Outside the opera, every screen loops Kael, a white-haired Deepline kid, at the Sump's vents. Inside, the show goes on."],
          ['hero', "That face is a lie. Pell taught a girl with no face to wear anyone's, and for a year I carried her orders, stitched in my ribbons."],
          ['hero', "Kael at the vents up here. Nyra, the singer, on the drills down there. Each layer blames the other. Pell built both, for the Director."],
          ['zara', "The whole Ring is in the house tonight, and the Proving Hall waits for the curtain to march. Every eye is yours, star. Spend them."],
          ['hero', "Music, please. Bar one. Mid-act I cut the ribbons loose, and every secret Pell sent through me goes up on the beat."]
        ],
        win: [
          ['sys', "Mid-opera, Coda cuts her ribbons free and dances Pell's ledger out, line by line: the faces, the drills, the vents, the pay."],
          ['hero', "Sora flies them to every tower, Kiri's cranes to every door. The wards rise, and Aldric turns the Proving Hall around on its own stairs."],
          ['sys', "In the Pit, the Lantern Cell catches Pell in his own Cat's Cradle. He names the faceless one: Rue. Kiri's crane flies it to the Crater."],
          ['sys', "There, Kael and Nyra stand face to face, and a second Kael runs from the crowd. Far below, Oda's bell has rung three times."],
          ['hero', "Three tolls. I'd know that bell anywhere. Four banners up the Spire to the Engine Core, before whatever it calls can answer. Last act. No bow."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Out-leap Mika on the cables",
        card: "Mika, Vael's champion, cuts the Skylift cables; Coda, who learned to leap without a net, dances the cables toll by toll and out-leaps her.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger with crescent blades cuts the cables, and the Hollow Legion climbs down the frayed ends."],
          ['hero', "A thousand metres up, no net, cables snapping like harp strings. One toll, push. Two, fly."]
        ],
        meet: [
          ['mika', "Dancer. On my world children leap before they walk. And you count your steps. How sweet."],
          ['hero', "For years I counted them for Pell. Now they're mine, and these cables are how my city gets home."],
          ['mika', "Not for long. Leap, if you can. There is no net."],
          ['hero', "There never was one. Watch."]
        ],
        win: [
          ['sys', "Coda dances the snapping cables toll by toll, and every leap lands exactly where Mika's blades are not."],
          ['mika', "You never missed a step. Who taught you to leap like that?"],
          ['hero', "A temple bell and a card table. Back to your crown-ship. This dance is mine."]
        ],
        lose: [
          ['mika', "A step missed, little dancer. Down you go."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault breaks into the Noble Ring opera; Coda dances its Siege Walker down on the beat, then hears Oda's bell say the sky has closed.",
        intro: [
          ['sys', "The Noble Ring opera. Far off, the sky over the Crater burns. The Hollow Legion floods in through the great doors."],
          ['hero', "The audience is still in the boxes. Nobody leaves this house hurt. Music, please. The last act."]
        ],
        meet: [
          ['sys', "The stage splits. A Siege Walker hauls itself up through the trapdoor, and the hollow soldiers fall into step behind it."],
          ['hero', "You march on the beat. That's your mistake. The beat is mine now."]
        ],
        win: [
          ['sys', "The Siege Walker crashes across the footlights. Then every hollow soldier in the house stops mid-step and goes still."],
          ['sys', "Far below, faint through the broken roof, Oda's bell rings once. Coda counts it with her feet."],
          ['hero', "One toll. The sky has closed. They're gone."],
          ['sys', "The morning after. Coda rides the first Skylift car down, alone, with no string on any step."],
          ['hero', "A temple, a bell, and an old man who taught me to count. I'm going home to count the rest."],
          ['hero', "And... curtain."]
        ] }
    },

    // ---------------------------------------------------------------- ZARA
    zara: {
      1: { zone: 'noble', goal: "Run the auditors out of the House Edge",
        card: "In the House Edge, Aurelia's nobles lose fortunes with impeccable manners. The winnings slip quietly down to Deepline, and tonight Halcyon sends auditors to find out how.",
        intro: [
          ['sys', "The House Edge, richest card room in Aurelia. Nobles lose fortunes here with perfect manners and very good wine."],
          ['hero', "Zara. Deepline card sharp. I won my way up the Skylift one hand at a time. What I staked on the last one is my business."],
          ['hero', "The house's winnings go back down the Skylift. Bread, medicine, lamp oil. Nobody up here ever asks where."],
          ['agent', "Halcyon audit, madam. Irregular transfers to Deepline. We'll be opening the vault. Step away from the table."],
          ['hero', "Nobody opens my vault. Pull up a chair, gentlemen. You can lose like everyone else."]
        ],
        win: [
          ['hero', "Audit concluded. Finding: the house won. Tell your Director to send better players."],
          ['hero', "And Lin wasn't behind my chair tonight. Lin is always behind my chair. Let's see where my bodyguard goes after hours."]
        ] },
      2: { zone: 'ballast', with: 'lin', goal: "Fight beside Lin in the undercroft",
        card: "Zara follows her bodyguard down a stair no noble has ever heard of, and finds a whole clan living under the gold. Halcyon's auditors follow Zara.",
        meet: [
          ['sys', "Under the gold, the Ballast Decks: heat, hum, and a hidden stair. A top hat comes down it, very quietly."],
          ['lin', "You followed me. Of course."],
          ['hero', "And look what I find. A clan under the floor. You took my job so your people could watch the Ring from behind my chair."],
          ['lin', "The House Edge sees everyone. The Clan needed eyes there. I would have stood behind your chair regardless."],
          ['hero', "That is the best hand anyone has shown me in years. Now. Who's coming down that stair behind me?"],
          ['lin', "Your auditors. They followed you. Every fifth strike, Zara. Try to keep up."]
        ],
        win: [
          ['hero', "The house keeps its winnings and its bodyguard. Watch the Ring for your Clan, darling. Only tell me what you see."],
          ['lin', "Everything. Beginning with this: Halcyon knows where your money goes."],
          ['hero', "Then it's time I raised."]
        ] },
      3: { zone: 'saloon', rival: 'jax', goal: "Duel Jax at the Long Bar",
        card: "Jax's Long Bar at Mile Zero: one card table, two chairs, and a revolver that has never once been holstered. Zara and Jax have an old hand to finish.",
        meet: [
          ['sys', "Mile Zero, past midnight. Dust on the windows, one table cleared, and Jax's revolver lying by his right hand, where it always lies."],
          ['jax', "Zara. Top hat. Red waistcoat. Money suits you, partner."],
          ['hero', "Jax. And you still deal off the bottom when the cards go cold."],
          ['jax', "And you still leave before the pot's split. Some of us remember how that ended."],
          ['hero', "We don't talk about that. Not without a table between us and our hands full. Deal."]
        ],
        win: [
          ['jax', "Ten. Jackpot. 'Course it was. You always did draw the ten."],
          ['hero', "I stacked the deck. You're the one who taught me how."],
          ['jax', "Then we're square. Drinks are on the house. ...Your house, I mean."]
        ],
        lose: [
          ['jax', "Six in the wheel, sweetheart. You were still counting five."]
        ] },
      4: { zone: 'noble', goal: "Hold the House while the money moves",
        card: "The screens say Deepline struck first, and the Proving Hall is told to march. Zara reads faces, and the one on the screen has nothing behind it. She pushes every coin she has into the middle.",
        intro: [
          ['sys', "The night of the Siege. Over the House Edge's silent tables, a screen loops Kael, a white-haired Deepline kid, opening the Sump's vents on the labs."],
          ['hero', "I read faces for a living. That boy has a face and nothing behind it. A card with no pips."],
          ['lin', "Deepline's runners say their screens show Nyra, the singer from the Med-Lab, leading Halcyon's drills. The same blank behind her eyes."],
          ['hero', "So each layer thinks the other dealt first, and the Director rakes the pot. Very well. Every coin in the House, on the uprising."]
        ],
        win: [
          ['hero', "The House bought the Subjects' doors, the Clan's stairs and every kite in the Paper Post. Halcyon came for the vault. Halcyon left."],
          ['sys', "The Proving Hall turns on its own stairs. Far below, Oda's bell rings three times, and in the Pit the Lantern Cell has Pell in his own strings."],
          ['sys', "Pell names his faceless spy: Rue. Kiri's crane flies it to the Crater, and a second Kael runs from the crowd."],
          ['hero', "No pips, as I said. Four banners going up the Spire, toward the Engine Core. The Director's machine is calling something. We fold his hand first."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Luck against omen: face Corvin",
        card: "Corvin, Vael's champion, reads the end of the sky and blacks out the Skyport; Zara plays him for it, omen against luck, and draws the last card.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport goes black under ten thousand crows. A hooded stranger stands at the heart of them, reading the dark."],
          ['hero', "A black sky and long odds. My favourite table."]
        ],
        meet: [
          ['corvin', "Gambler. The omen is read. The sky ends. There is no luck in an ending already written."],
          ['hero', "I read faces, darling. Yours watched a world end once. Now you work for the house that ended it."],
          ['corvin', "The house always wins. So I chose a seat on the house's side of the table."],
          ['hero', "Then you've never sat at mine. Cut the deck."]
        ],
        win: [
          ['sys', "The last card is the jackpot. Coins, cards and crows scatter across the Skyport, and Corvin goes down among them."],
          ['corvin', "I did not read this. The omen never shows the gambler."],
          ['hero', "Nobody reads luck, darling. Run home to your master and tell him the House is closed to him."]
        ],
        lose: [
          ['corvin', "Your house falls, gambler. It always would. The omen is fulfilled."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault comes for the House Edge and everyone hiding in it; Zara deals with its Siege Walker, Lin behind her chair, until the sky closes.",
        intro: [
          ['sys', "The House Edge. Far off, the sky over the Crater burns, and half the Noble Ring is crouched beneath Zara's card tables."],
          ['lin', "Legion on the stairs, Zara. A great deal of it."],
          ['hero', "Then the House is open, darlings. Everybody in. The only ones leaving tonight are the Legion."]
        ],
        meet: [
          ['sys', "The doors burst from their hinges. A Siege Walker stoops into the card room, and every chandelier trembles."],
          ['hero', "A tall stack and no face. Lin, behind my chair. I'm all in."]
        ],
        win: [
          ['sys', "The Siege Walker crashes across the high-stakes table. On the stairs the Legion stops, every soldier, and stands still."],
          ['sys', "A paper crane slips under the door, folded in Kiri's hand: the sky over the Crater has closed. They're gone."],
          ['lin', "You won, Zara. Again."],
          ['hero', "Naturally, darling. Pour something for everyone. Put it on the House."],
          ['sys', "The morning after. Zara counts what is left in the vault and sends every coin of it down the Skylift."],
          ['hero', "Jax will say I finally settled my tab. Tell him not to get used to it."],
          ['hero', "The house always wins."]
        ] }
    },

    // ---------------------------------------------------------------- MAREN
    maren: {
      1: { zone: 'hydro', goal: "Hold the Hydro Ward for your patients",
        card: "Subject 21 is doctor to every Subject in the Hydro Ward, because she is better at it than Halcyon's own staff. When the carts come for six of her beds, she does not leave the room.",
        intro: [
          ['sys', "The Hydro Ward. Basins hum, drips tick, and a woman with her sleeves rolled walks the beds, counting breaths."],
          ['hero', "Maren. At home I sat with fevered children until the fever went out with the tide. Here the children have numbers."],
          ['nyra', "Maren. The carts are back. Beds four to nine, for the feed lines."],
          ['agent', "Step aside, 21. Beds four through nine are past use. Engine allocation."],
          ['hero', "These are my patients. Nobody is past use while I am still in the room. Take your cart and go."]
        ],
        win: [
          ['hero', "Four. Five. Six... nine. All still breathing. That will do for tonight."],
          ['hero', "I took Halcyon's job to stay in the room with them. I'll stay until every one walks out on their own feet."]
        ] },
      2: { zone: 'choir', with: 'nami', goal: "Hold the Drowned Line with Nami",
        card: "Halcyon sends its doctor down to Deepline's flooded metro with a collection team. A wall gives way, the water takes a stranger, and Maren argues with the sea.",
        meet: [
          ['sys', "The Drowned Line. A wall gives, black water pours in, and a young woman goes under and does not come up."],
          ['hero', "Too long under. No. No, sea, you don't get this one. Give her BACK."],
          ['nami', "Cold. ...Who was shouting at the sea?"],
          ['hero', "Your doctor. Maren. Breathe. You were gone a minute, and now you aren't. Slowly."],
          ['agent', "Good work, doctor. Breathing, and full of power. Bag her for the Spire."],
          ['nami', "No."]
        ],
        win: [
          ['nami', "You pulled me out. Then you fought your own team for me. Nami. I owe you a life."],
          ['hero', "You owe me rest and fluids. I have to go back up: there's a girl in a tank who keeps forgetting to breathe."],
          ['nami', "Then whenever the doctor comes down here, I'm at her back. That's the debt."]
        ] },
      3: { zone: 'market', rival: 'vesna', goal: "Duel Vesna in the Neon Market",
        card: "Vesna keeps the Red Ledger, and half of Maren's patients are written in it. In the Neon Market, the doctor comes to settle their account.",
        meet: [
          ['sys', "The Neon Market, Red Quarter. Pink light on wet stone, and a woman in black with a red book open on her knee."],
          ['vesna', "The Tide Doctor. You've been giving blood away for free. It's dreadful for business."],
          ['hero', "You charge Deepline for its own blood. In my trade we call that a sickness."],
          ['vesna', "In mine it's called bookkeeping. Every account is settled in red, doctor. Yours too."],
          ['hero', "Then let's settle it. Sit still. This may sting."]
        ],
        win: [
          ['vesna', "You heal while you hit. How very tiresome."],
          ['hero', "Strike the names off your ledger, Vesna. The ones who can't pay."],
          ['vesna', "One page, then. Not the long one. That page is Halcyon's, and I intend to collect it in full."]
        ],
        lose: [
          ['vesna', "Your account is overdrawn, doctor. Interest is due."]
        ] },
      4: { zone: 'noble', goal: "Hold the ward door while they run",
        card: "Two forged films have the three layers at each other's throats, and Halcyon is coming for the wards. Maren holds one door while every Subject runs for the Noble Ring.",
        intro: [
          ['sys', "The Three-Layer War. Sky screens show Kael, a Deepline kid, opening the Sump's vents on the labs. Deepline's show Nyra leading drills. Each blames the other."],
          ['hero', "I dressed the burns from those labs myself. And the boy on the film never breathes: forty seconds in Sump smoke. Nyra, theirs isn't you either."],
          ['nyra', "I know. The wards are open, Maren. Everyone's running for the Ring, and Halcyon is right behind them."],
          ['hero', "Then everyone through this door, and nobody after them. Go. I'll be the last out."]
        ],
        win: [
          ['hero', "Last one through. Every bed empty. For the first time in a year, I may leave the room."],
          ['sys', "Aldric's knights turned on the Ring; Oda's bell called the Surface. In the Pit, Pell named the face-thief: Rue. At the Crater, a second Kael ran."],
          ['hero', "Four banners going up the Spire, and something at the top calling in the Engine's voice. Someone up there needs a very long rest."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Keep the wards alive under Vega",
        card: "Vael's champion Vega drags Aurelia down from Pylon Chamber Six and the wards below begin to crush; Maren fights her off the pylons for her patients' sake.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "Pylon Chamber Six. A stranger drags Aurelia down, and in the wards below the beds begin to slide."],
          ['hero', "Every patient I have lies under this floor. I'm going in."]
        ],
        meet: [
          ['vega', "Doctor. Your city is so heavy. Let it rest. Let it fall."],
          ['hero', "I know what rest looks like, and this is not it. Three floors down there are children who can't walk yet."],
          ['vega', "Then they will not feel the fall."],
          ['hero', "They'll feel ME. The tide is coming in."]
        ],
        win: [
          ['sys', "Maren's tide strikes Vega again and again, until the star in her palm slips and the city stops sliding."],
          ['vega', "A doctor. Hitting me. Vael said this world was soft."],
          ['hero', "Then go back and tell him so. The doctor is in, and visiting hours are over."]
        ],
        lose: [
          ['vega', "Even doctors fall, in the end. Everyone does."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Hydro Ward, where the patients who cannot run still lie in bed; Maren stays in the room and holds off its Siege Walker.",
        intro: [
          ['sys', "The Hydro Ward. Far off, the sky over the Crater burns. The Hollow Legion works its way down the corridor, bed by bed."],
          ['hero', "Beds four through nine still can't walk. Nor can half the ward. Then I am not leaving the room."],
          ['hero', "The tide is coming in. The doctor is in."]
        ],
        meet: [
          ['sys', "The ward doors buckle. A Siege Walker stoops into the room, and the water in the basins begins to tremble."],
          ['hero', "This is a hospital. Kindly lower your voice."]
        ],
        win: [
          ['sys', "Maren's tide drives the Siege Walker back through the doors and down. In the corridor, the Legion goes still."],
          ['sys', "Through the ward windows the far violet sky over the Crater closes, and the light on the beds turns plain and warm."],
          ['hero', "Someone check the wards. ...Breathing. All of them."],
          ['sys', "The morning after. Nyra keeps her promise: she comes back with a crowd of freed Subjects to carry the beds out."],
          ['hero', "Into the sun, all of you. Slowly. I go last. Then I sleep for a week."],
          ['hero', "Doctor's orders: rest."]
        ] }
    },

    // ---------------------------------------------------------------- ELIXA
    elixa: {
      1: { zone: 'furnace', goal: "Fight past security to the feed lines",
        card: "Halcyon's brightest chemist has never asked where her Subjects come from, only what they do. Then the Director wants Subject 44 ready for something called the feed lines, and nobody will say what that means.",
        intro: [
          ['sys', "The Burn Ward labs, week six. Racks of red and blue flasks, and through the glass a girl in a bottle, glowing like a stove."],
          ['hero', "Elixa, chief alchemist. Red burns. Blue freezes. No one has tried both on a living subject. So, naturally, I'd like to."],
          ['agent', "Doctor, the Director wants 44 ready for the feed lines by week seven. He said ready, doctor. Not interesting."],
          ['hero', "Feed lines. That's not in my protocol. What becomes of her afterwards?"],
          ['agent', "Afterwards is the Engine's business. Security, see the doctor to her quarters."]
        ],
        win: [
          ['hero', "Curious. They were terribly anxious that I not see the afterwards. So I went down and looked."],
          ['hero', "Grey shapes along the pipes, still breathing. Husks. I recognised the burn scars. I wrote those up as promising."],
          ['hero', "Six weeks of notes on how to make one. Not a single page on how to unmake it. New notebook, then."]
        ] },
      2: { zone: 'glowwild', with: 'ume', goal: "Hold the spore beds with Ume",
        card: "Elixa walks into the Glowwild for spores that might wake a Husk. Ume, who has turned plenty of Halcyon people into compost, decides to hear her out first.",
        meet: [
          ['ume', "Halcyon's chemist, in my garden! Don't touch that one. Or that one. What do you want the spores for?"],
          ['hero', "A cure for the Husks. Your spores keep a memory of whatever they grew on. I want to know if they can remind a body."],
          ['ume', "Oh, good answer. Most Halcyon people say weapons. Most Halcyon people end up as compost."],
          ['hero', "I would prefer not to be compost. Do we settle the price first, or the drones behind you?"],
          ['ume', "Drones, then price. Step where I step, chemist. Exactly where."]
        ],
        win: [
          ['ume', "You fought for the garden. Fine: spores, every season. And every season I'll ask what for."],
          ['hero', "You'll get an answer every time. Green Cauldron, meet the Glowwild. Do behave, both of you."],
          ['hero', "Now back up the Skylift. Week seven is tomorrow, and they mean to run my formula without me."]
        ] },
      3: { zone: 'furnace', rival: 'pyra', goal: "Duel Pyra in the Burn Ward",
        card: "Week seven. Elixa comes back to stop the second colour, and Halcyon overrules her. Then the glass gives, and her result turns to look at the woman who took the notes.",
        meet: [
          ['sys', "The Burn Ward, week seven. Alarms, steam, a smell of hot glass. The bottle breaks, and the fire walks out of it, and turns."],
          ['pyra', "Lab coat. You mixed it. I drank it. Six weeks. And you took NOTES."],
          ['hero', "I did. Pages of them. Tonight I asked them to stop, they said no, and I picked up my pen anyway. That is not a defence."],
          ['pyra', "Knowing doesn't give me back a single week. You're on my list."],
          ['hero', "Then look at me. I would rather see the result than look away from it. I have done enough of that."]
        ],
        win: [
          ['pyra', "You stayed. Everyone else from that lab ran."],
          ['hero', "You're the only result that ever looked back at me. Running from it would be bad science. And worse manners."],
          ['pyra', "Still on the list. ...A bit lower down."]
        ],
        lose: [
          ['pyra', "Note for your records: ow."]
        ] },
      4: { zone: 'noble', goal: "Fight Halcyon's guards on the Ring",
        card: "Two forged films have every layer blaming the others, and the guards on the Noble Ring are running on Elixa's stimulants. She knows exactly what a second colour would do to them.",
        intro: [
          ['sys', "The Three-Layer War. Sky screens loop Kael, a Deepline kid, opening the Sump's vents on the labs; Deepline's loop Nyra leading drills down."],
          ['hero', "I ran that film through my instruments. Sump fire all round the boy, and he reads room temperature. Whatever that is, it isn't a boy."],
          ['maren', "Then make yourself useful, Elixa. Every guard on the Ring is running on your stimulants. I checked the flasks."],
          ['hero', "Then they get a second colour. Blue to slow, green to sleep. For once I'm on the right side of the glass."]
        ],
        win: [
          ['hero', "Halcyon's soldiers asleep in the corridors, and the Proving Hall turned. Aldric's doing, I'm told. Coda's dance did the rest."],
          ['sys', "Oda's bell rings over the Meridian. In the Pit, Pell, tangled in his own Cat's Cradle, names the face-thief: Rue. At the Crater, a second Kael runs."],
          ['hero', "No face, no heat. I would dearly love a sample. Later. Four banners are climbing the Spire, and the Engine Core is drawing power for something."]
        ] },
      5: { zone: 'gallery', foe: 'mira', goal: "Find the real Mira in the glass",
        card: "Mira, Vael's champion out of the harbour ice, turns Aurelia's glass on it from the Observation Gallery; Elixa runs the one experiment that finds the real her.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Observation Gallery. A masked stranger lays her palm on the glass, and every pane in Aurelia turns to face the city."],
          ['hero', "Every window a mirror, every mirror a weapon. But glass is my business. My flasks are glass."]
        ],
        meet: [
          ['mira', "Chemist. Whatever you strike is only my reflection. Strike as many as you like."],
          ['hero', "A reflection still needs light, and light reacts. Red, blue, green: one of them will show me the real you."],
          ['mira', "No one has ever found the real one. Vael never tried. He wanted only my glass."],
          ['hero', "Then I shall be the first. A reaction no one has tried. How marvellous."]
        ],
        win: [
          ['sys', "Coloured smoke fills the Gallery. Every reflection turns the wrong colour but one, and Elixa's flask finds it."],
          ['mira', "You found me. By colour. That isn't fair."],
          ['hero', "It's chemistry. Back to your crown-ship, and take your mirrors. My lab has windows I'd like returned."]
        ],
        lose: [
          ['mira', "Your flasks are glass, chemist. And glass is mine."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Burn Ward labs, where Elixa is brewing her cure for the Husks; she guards the work and burns down its Siege Walker.",
        intro: [
          ['sys', "The Burn Ward labs. Far off, the sky over the Crater burns. The Hollow Legion pours in through the shattered windows."],
          ['hero', "Twelve flasks of Ume's spores and a cure for the Husks, half finished. Nobody touches my bench."],
          ['hero', "Red burns, blue freezes. And green, today, for anything hollow that comes near my cure."]
        ],
        meet: [
          ['sys', "The floor cracks. A Siege Walker shoulders through the Burn Ward wall, and the flasks on the bench begin to chatter."],
          ['hero', "A very large sample. Fascinating. Do hold still."]
        ],
        win: [
          ['sys', "Every colour at once. The Siege Walker falls in the smoke, and the Legion behind it stops dead."],
          ['sys', "Through the smoke the light shifts. The violet over the Crater is gone; the sky has closed."],
          ['hero', "Gone. Good. Back to work. The Husks are still waiting on the feed lines."],
          ['sys', "The morning after. Elixa carries her first finished flask down to the feed lines, with Ume's spores and Maren's steady hands."],
          ['hero', "One Husk, one dose. Breathing. ...Blinking? Write that down. Write all of it down."],
          ['hero', "Results: conclusive."]
        ] }
    },

    // ---------------------------------------------------------------- ISA
    isa: {
      1: { zone: 'archive', goal: "Fight off the guards in the Archive",
        card: "Every decree the Director makes carries Isa's seal. Then order forty-one reaches her desk, and she reads what it would do with the Subjects.",
        intro: [
          ['sys', "The Archive. Lamps, dust, ten thousand ledgers. Every contract in the Ring, every law of the Director's, sealed in one woman's ink."],
          ['hero', "Isa, of the old school on the steppe. Sen and I could draw a line no one crossed. Here, I draw Halcyon's lines instead."],
          ['agent', "Order forty-one, seal-writer. The Director wants it binding by noon."],
          ['hero', "Every Subject past use, to the Engine. No names. No record. ...No. Not in my ink."],
          ['agent', "Then we take the brush. And the hand that holds it."]
        ],
        win: [
          ['hero', "Order forty-one remains unsealed. It will remain so."],
          ['hero', "But every order before it bears my seal. I wrote the bars of this cage, clause by clause. Now I must unwrite them."]
        ] },
      2: { zone: 'archive', with: 'lin', goal: "Hold the Archive with Lin",
        card: "Halcyon sends a captain for the hand that refused order forty-one. Out of the stacks steps Lin, of a clan the Ring swears is a rumour, to guard it.",
        meet: [
          ['sys', "The Archive, the next night. Boots between the stacks. A Halcyon captain wants the seal-writer's hand."],
          ['lin', "Seal-writer. Breathe. The Sky Clan has read your seals for a year. We read the one you refused."],
          ['hero', "You're from under the floor. The clan no one up here believes in. Why come up for me?"],
          ['lin', "The Pact of Three Layers keeps the layers from killing one another. Your ink is the Director's best weapon. Not tonight."],
          ['hero', "Then keep them off my hand. I have a great many words to take back, and I need it for every one."],
          ['lin', "Write. I'll keep the door."]
        ],
        win: [
          ['hero', "Not a drop spilled. Every law in these stacks bears my seal, Lin. I built the cage myself, in a fair hand."],
          ['lin', "Then unbuild it. One word, large enough for all of them."],
          ['hero', "A Final Word. When I can find one that heavy. Until then, stay near my brush hand."],
          ['lin', "Always."]
        ] },
      3: { zone: 'metro', rival: 'sen', goal: "Duel Sen in the Rust Dojo",
        card: "Isa goes down to the Old Metro to ask Sen, her old schoolmate, to help her unwrite her laws. First he wants to know whether her line still holds.",
        meet: [
          ['sys', "The Old Metro. A rusted carriage swept spotless: the Rust Dojo. Sen kneels inside, beside a neat stack of Isa's letters."],
          ['hero', "Sen. Every letter I sent, you answered with a single line. This time I came for more than a line."],
          ['sen', "...A year of your seals. Each one drew a line down here. Around people."],
          ['hero', "I know. I mean to unwrite every one. But first I need to know that my own line still holds."],
          ['sen', "Draw it."]
        ],
        win: [
          ['sen', "...It held."],
          ['hero', "You stopped a hair's width short. You always did wait too long."],
          ['sen', "Write your word, Isa. I will answer it. One line."]
        ],
        lose: [
          ['sen', "Crossed. ...Again. Slower."]
        ] },
      4: { zone: 'noble', goal: "Hold the Ring while you write",
        card: "The screens show a Deepline boy striking the Sky, and Halcyon's war law waits on Isa's desk for her seal. Tonight she writes something else: one word to answer every law she ever sealed.",
        intro: [
          ['sys', "The night of the Siege. The Archive's windows flicker with the film on every wall: Kael, a white-haired Deepline boy, opening the Sump's vents."],
          ['hero', "And in Deepline they watch Nyra, the escaped singer, lead the drills. Two borrowed faces, and each layer certain the other struck first."],
          ['hero', "Halcyon's war law lies on my desk, awaiting my seal. The Proving Hall marches the moment it is binding."],
          ['lin', "I have your brush hand. No one comes near it. Write."],
          ['hero', "Every law the Director ever had me seal, answered in one word. Ink."]
        ],
        win: [
          ['sys', "The Final Word falls across the sky in crimson ink. Every seal on every law Halcyon ever made breaks at once."],
          ['hero', "Void. The Proving Hall has no orders, the wards have no locks, and every Subject has a name again."],
          ['sys', "Oda's bell tolls three times on the Surface. In the Pit, Pell, caught in his own strings, names his faceless spy: Rue."],
          ['sys', "Kiri's crane carries the name to the Crater. A second Kael flees the crowd. Four banners start up the Spire, toward the Engine Core."],
          ['hero', "A forgery, then, the whole war. And that Engine is still calling for something. I mean to close that door before anyone answers."]
        ] },
      5: { zone: 'archive', foe: 'tessa', goal: "Keep the Archive written",
        card: "Tessa, Vael's champion who has lived this year too many times, comes to unwrite the Archive and the Subjects' names; Isa seals every page and drives her out.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Archive. A stranger in brass goggles walks the stacks, and the ink weeps off every page she passes."],
          ['hero', "Those are the Subjects' names. I gave them back with the Final Word. No one takes them a second time."]
        ],
        meet: [
          ['tessa', "Seal-writer. I've lived this year a hundred times, and in every one these pages burn. I am only being prompt."],
          ['hero', "Then you've read every ending except mine. Who are you?"],
          ['tessa', "Tessa. I once wrote tomorrow's tides on a harbour wall. Vael promised me an ending that holds still."],
          ['hero', "An ending is only a line. I draw lines no one crosses. Try this one."]
        ],
        win: [
          ['sys', "Isa's seals close over every stack at once. The ink stops running, and the hands of Tessa's clock stop with it."],
          ['tessa', "I have never seen this page. Not once in a hundred years."],
          ['hero', "Then read it on your way out. Back to your crown-ship. The Archive stays written."]
        ],
        lose: [
          ['tessa', "I have seen this ending before. In it, you lose here."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Archive, where the Subjects' names are written; Isa seals the stacks against its Siege Walker until the sky closes.",
        intro: [
          ['sys', "The Archive. Far off, the sky over the Crater burns, and the Hollow Legion breaks in among the stacks."],
          ['hero', "Every name I gave back with the Final Word is written here. Hollow hands will not touch them."],
          ['hero', "One line. No one crosses it."]
        ],
        meet: [
          ['sys', "Shelves topple. A Siege Walker wades through drifts of paper toward the names, and the soldiers follow in its wake."],
          ['hero', "That page is not yours. Nothing in this room is yours."]
        ],
        win: [
          ['sys', "The seal closes round the Siege Walker, and it falls among the stacks. Then the Legion halts mid-stride, and goes still."],
          ['sys', "A paper crane drifts through the high window and lands on the open ledger. Kiri's fold. The sky has closed."],
          ['hero', "Gone, every one. And not a single name lost."],
          ['sys', "The morning after. Isa sits at her desk with fresh ink and a page that nobody has ordered her to fill."],
          ['hero', "Sen. One line, as always: It held. Come up and see the names. ...Two lines. He will forgive me."],
          ['hero', "Written, sealed, done."]
        ] }
    },

    // ---------------------------------------------------------------- LIN
    lin: {
      1: { zone: 'ballast', goal: "Stop the crews bolting the undercroft",
        card: "For a hundred years the Sky Clan has lived in the warm dark under Aurelia. Tonight Halcyon means to seal it in like a cellar, and Lin answers with an open hand.",
        intro: [
          ['sys', "The Ballast Decks. Halcyon crews come down with bolt guns and cutters, to shut the undercroft's old doors and starve out its heat."],
          ['hero', "Lin, of the Sky Clan. A hundred years we have lived under the gold. These doors open from our side."],
          ['kestra', "They're bolting the dance hall, Lin! Let me burn them. A little. A tasteful amount."],
          ['hero', "No fire near the beams. Breathe, sister. This wants a quiet hand."]
        ],
        win: [
          ['hero', "Five strikes, and the fifth seals. For a moment they forgot how their own arms worked. A moment is enough."],
          ['kestra', "Fine. That was impressive. Quiet, and smug, and impressive."],
          ['hero', "Not smug. Rested."]
        ] },
      2: { zone: 'noble', with: 'zara', goal: "Guard the House Edge with Zara",
        card: "Zara of the House Edge needs a bodyguard; the Sky Clan wants eyes on the Noble Ring. From behind one chair, Lin can be both.",
        meet: [
          ['sys', "The House Edge, richest card room in Aurelia. Chandeliers, green baize, and a great deal of money losing politely."],
          ['zara', "So you're the one the Ring whispers about. Small, quiet, and my last three guards still can't lift a glass."],
          ['hero', "They were rude to a waiter. I sealed their arms. The feeling comes back by morning."],
          ['zara', "Darling, you're hired. Stand behind my chair. You'll see everyone."],
          ['hero', "That is why I came. ...You have guests. Halcyon. They are unhappy about where your money goes."]
        ],
        win: [
          ['zara', "Not one chip on the floor. You really do see everyone."],
          ['hero', "Everyone. And where your winnings go. Down."],
          ['zara', "And?"],
          ['hero', "And nothing. I stand behind the chair."]
        ] },
      3: { zone: 'village', rival: 'ivo', goal: "Duel Ivo in the Hidden Village",
        card: "Before dawn in the Hidden Village on the Surface, Ivo has trained for an hour to beat the soft one. Lin has sealed him twice. She needs to hear only his fifth punch.",
        meet: [
          ['sys', "The mountain, before dawn. Frost on the ring's rope. A young man with gold fists has been at his reps for an hour."],
          ['ivo', "LIN! The soft one! I've been up since three! Today you don't seal me!"],
          ['hero', "Good morning, Ivo. Your style is loud. Every punch sends a herald ahead of it."],
          ['ivo', "Twelve punches in two seconds! Herald THAT!"],
          ['hero', "I don't need all twelve. Only the fifth."]
        ],
        win: [
          ['ivo', "Third time. THIRD. I can't feel my arms. I can feel my nose. That's something."],
          ['hero', "They'll wake by noon. Loud isn't wrong, Ivo. It's only easy to hear."],
          ['ivo', "Tomorrow, before dawn. I'm working on quiet. I'm working on it VERY hard."]
        ],
        lose: [
          ['ivo', "Not so soft now, eh? Up! Breathe! Again!"]
        ] },
      4: { zone: 'noble', goal: "Hold the guards off Isa's brush",
        card: "The screens show a Deepline boy striking the Sky, and Halcyon has its war law ready to seal. Isa means to write one word that undoes every law she ever sealed. Lin keeps the room.",
        intro: [
          ['sys', "The Noble Ring, the night of the Siege. Every screen shows the same few seconds: Kael, a Deepline street kid, turning the Sump's vent wheels."],
          ['hero', "Watch his feet. No weight in them. Everyone stands like someone. That boy stands like no one."],
          ['isa', "Deepline's screens show Nyra, the singer, leading the drills down. Each layer blames the other, while the Proving Hall waits for its marching orders."],
          ['isa', "Orders sealed in my ink. I am writing the Final Word. Keep them off my hand."],
          ['hero', "Write. The brush is yours. The room is mine."]
        ],
        win: [
          ['sys', "The Final Word crosses the sky in crimson ink. Every law the Director sealed comes undone. The Proving Hall stands on its stairs, unordered."],
          ['hero', "Brush hand safe. Not a drop spilled. Breathe, Isa. ...Now out."],
          ['sys', "Far off, Oda's bell rings three times over the Meridian drills. In the Pit, Pell, caught in his own strings, names the one who stood like no one: Rue."],
          ['sys', "Kiri's crane carries the name to the Crater. A second Kael slips from the crowd and is gone. Four banners start up the Spire, toward the Engine Core."],
          ['hero', "That Engine has been calling something. We climb quietly, and we climb now."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Seal Mika off the cables",
        card: "Mika, Vael's champion, cuts the Skylift cables so the Legion can pour down on the undercroft; Lin seals her arms, strike by strike, and sends her off the cables.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger cuts the cables, and the Hollow Legion slides down them toward the undercroft."],
          ['hero', "The Clan's home lies under those cables. For a hundred years we kept it hidden. Not from this."]
        ],
        meet: [
          ['mika', "Quiet one. You stand so very still. Up here no one stands. Everyone falls."],
          ['hero', "And you are loud. You announce every leap before you make it."],
          ['mika', "You'll never catch one. Two moons taught me to fly. What taught you?"],
          ['hero', "A hundred years beneath a floor. Every fifth strike seals."]
        ],
        win: [
          ['sys', "Five strikes, five sealed points. Mika's blades fall, and her arms will not lift them again."],
          ['mika', "My arms. What have you DONE to my arms?"],
          ['hero', "They will wake, on your crown-ship. Go. The undercroft is closed."]
        ],
        lose: [
          ['mika', "Too slow, quiet one. Under two moons I am faster."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault pours down the cables into the Ballast Decks; Lin seals its Siege Walker strike by strike and keeps the undercroft and the Clan safe.",
        intro: [
          ['sys', "The Ballast Decks. Far off, the sky over the Crater burns, and the Hollow Legion swarms down the cables into the undercroft."],
          ['kestra', "Let me burn them, Lin. Only a little. Only all of them."],
          ['hero', "Not near the beams. Breathe, sister. Quiet hands."]
        ],
        meet: [
          ['sys', "A Siege Walker drops onto the deck. The beams groan beneath it, and the Clan's children scatter for the stair."],
          ['hero', "Loud. So very loud. I need only hear the fifth step."]
        ],
        win: [
          ['sys', "Five strikes, five sealed points. The Siege Walker kneels and never rises. On the cables, the Legion goes still."],
          ['sys', "The pylons change their hum. Through the ballast vents the violet over the Crater closes, and plain daylight spills in."],
          ['kestra', "That's it? That was the end of the world? I didn't burn a single thing."],
          ['hero', "You burned three beams, sister. ...It's over."],
          ['sys', "The morning after. Lin leads the Clan up the hidden stair into the Noble Ring, past Zara's door, in daylight."],
          ['hero', "A hundred years under the floor, and no one hides now. Ivo can find me before dawn, if he wants a fourth try."],
          ['hero', "Breathe out."]
        ] }
    },

    // ---------------------------------------------------------------- VESPER
    vesper: {
      1: { zone: 'ward', goal: "Clear the dark alleys before dawn",
        card: "Every night the Night Ward locks Subject 77 in. Most nights she leaves by the roof, and Aurelia's dark lower alleys have started to have lamps in them.",
        intro: [
          ['sys', "The Night Ward. Lock, count, lights out. On the roof above cell 77, a red scarf is already moving."],
          ['hero', "Vesper. At home I lit the sea wall at dusk. Every lamp. Nobody saw who."],
          ['hero', "The alleys down here have none. Tonight, thirty."],
          ['agent', "Movement on the Ward roofs. Red cloth. Find it."],
          ['hero', "You'll find lamps."]
        ],
        win: [
          ['hero', "Thirty lit. Back before the count."],
          ['hero', "On the way: a cart from the wards, rolling down to the feed lines. Full. It came back up empty."]
        ] },
      2: { zone: 'enginecore', with: 'aldric', goal: "Hold the feed lines with Aldric",
        card: "Vesper has shadowed the empty carts all the way to the Engine. Tonight she brings the knight who guards the wards, to see what he has been guarding.",
        meet: [
          ['sys', "The Engine's feed lines. Pipes as thick as trees, a slow grey hum, and two figures on a gantry where neither should be."],
          ['aldric', "Seventy-seven. You are outside your ward. I ought to take you back to it."],
          ['hero', "Look first. You held the sea wall I lit every dusk. You never turned round."],
          ['aldric', "The scarf on the wall. That was you. Why have you brought me here?"],
          ['hero', "Down there. Grey. Breathing. Your Subjects. The Director calls them Husks."],
          ['agent', "Intruders on the feed lines! ...Sir? Sir, step away from the asset."]
        ],
        win: [
          ['aldric', "I swore an oath to keep harm from them. For a year I have stood on harm's side of the door."],
          ['hero', "Then move."],
          ['aldric', "When I turn, the whole Hall turns with me. Not before. Not alone."],
          ['hero', "Then I'll light the road."]
        ] },
      3: { zone: 'ward', rival: 'moro', goal: "Duel Moro on the Night Ward roofs",
        card: "Moro of the Lantern Cell hides in shadows; Vesper walks through them. On the Night Ward roofs, he finally makes one she can't.",
        meet: [
          ['sys', "The Ward roofs. A sleepy young man sits on the ridge where Vesper always crosses. His shadow runs much too long."],
          ['moro', "You again. You walk through my shadows like they're doors. It's rude."],
          ['hero', "They're for walking through. You hide in yours."],
          ['moro', "Pell taught us shadows hide things. I decided they hold things. Try this one."],
          ['hero', "Already halfway."]
        ],
        win: [
          ['moro', "Fine. You walked through it. I'm going back to bed."],
          ['hero', "It held me a whole second. Most don't manage one."],
          ['moro', "Next time, use the stairs. Please."]
        ],
        lose: [
          ['moro', "Held. Go home, lamplighter. Quietly."]
        ] },
      4: { zone: 'noble', goal: "Clear the road to the feed lines",
        card: "Two stolen faces have the three layers ready to kill each other, and the knights of the Proving Hall have orders to march on Deepline. Vesper means every knight to see the Husks first.",
        intro: [
          ['sys', "The Three-Layer War. Sky screens loop Kael, a Deepline kid, at the Sump's vents; Deepline's loop Nyra leading the drills. Each side blames the other."],
          ['hero', "That boy on the film casts no shadow. Lamp behind him, lamp before him. Nothing on the floor. I light lamps. I notice."],
          ['aldric', "Lamplighter. The knights wait on my word. Show them what you showed me."],
          ['hero', "Every lamp from the Hall to the Husks, then. Let them walk down and look."]
        ],
        win: [
          ['sys', "Lamp by lamp, a road of light runs down below the Spire. The knights see the Husks, and the Proving Hall turns."],
          ['aldric', "I stood a year in the wrong place. No longer. Coda has cut her strings on the stage above. We go up."],
          ['hero', "Word from the Pit: Pell named the face. Rue. At the Crater a second Kael ran. No shadow, no face. No one."],
          ['sys', "Oda's bell has called the Surface. Four banners climb the Spire toward the Engine Core; halfway up, the stair lamps are lit already. Nobody saw who."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Light a lamp in Corvin's dark",
        card: "Corvin, Vael's champion, puts out the sun over the Skyport; Vesper, who lit the harbour's lamps unseen, lights them one by one until his crows scatter.",
        intro: [
          ['sys', "The sky over the Crater tears. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport. A hooded stranger's crows smother the sun, and in the dark the Hollow Legion marches."],
          ['hero', "He puts out suns. I light lamps. We'll see which lasts."]
        ],
        meet: [
          ['corvin', "Lamplighter. The omen says dark, forever. Your little lamps change nothing."],
          ['hero', "For years I lit every lamp on the harbour wall, and no one saw who. Your crows won't either."],
          ['corvin', "My world's lamps went out beneath an engine like his. Every one. I watched them go."],
          ['hero', "So you came to put out ours. No. Not one."]
        ],
        win: [
          ['sys', "Lamp by lamp, the Skyport kindles. The crows scatter, and a red scarf is already at Corvin's back."],
          ['corvin', "I never saw you. The omen never saw you."],
          ['hero', "No one does. Take your crows back to the crown-ship, omen-reader. The lamps stay lit."]
        ],
        lose: [
          ['corvin', "Every lamp goes out, lamplighter. Even yours."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Night Ward and its dark alleys; Vesper lights every lamp and cuts its Siege Walker down where nobody sees her coming.",
        intro: [
          ['sys', "The Night Ward. Far off, the sky over the Crater burns. The Hollow Legion floods into the dark lower alleys."],
          ['hero', "Thirty lamps by dawn, that first night. Tonight, every lamp in the Ward, and a red scarf between them."]
        ],
        meet: [
          ['sys', "A Siege Walker stamps down the alley, grinding the lamps out one by one beneath its feet."],
          ['hero', "You're putting out my lamps. No one does that."]
        ],
        win: [
          ['sys', "A red scarf, a thousand cuts. The Siege Walker falls in the last dark alley, and the Legion goes still."],
          ['sys', "On the Ward roofs Vesper watches the far violet over the Crater close. The night is only night again."],
          ['hero', "Over. No one saw who. Good."],
          ['sys', "The morning after. The Night Ward's doors stand open. No one locks Subject 77 in. No one needs to."],
          ['hero', "Tonight I'll light the lamps anyway. Aldric's knights will try to see who. Let them try."],
          ['hero', "You never saw me."]
        ] }
    }

  });
})();
