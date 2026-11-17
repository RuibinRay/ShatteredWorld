'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the spoken lines of every chapter for the heroes of Aurelia, the Sky.
// Data only; js/saga/saga-core.js plays it. Speakers: 'hero' (the hero being played), 'sys' (narration), a hero id,
// or 'director', 'kessen', 'vael', 'agent', 'citizen'.
(function () {
  const SW = window.SW; if (!SW.saga || !SW.saga.add) return;
  SW.saga.add({

    // ---------------------------------------------------------------- NYRA
    nyra: {
      1: { zone: 'medlab', goal: "Break out of the Med-Lab",
        intro: [
          ['sys', "Med-Lab Sector 7. Tank thirty-one has a crack in it, and for a week the girl inside has been humming into it."],
          ['hero', "My name is Nyra. I was born where the harbour freezes. Halcyon calls me thirty-one. Numbers don't sing."],
          ['hero', "There it is again: the grey shape behind the doctor's shoulder. Nobody else in this room ever looks at it."],
          ['agent', "Thirty-one is vocalising. Sedate her now, before the glass-"],
          ['hero', "Too late. Hold the note. Hold it. Break."]
        ],
        win: [
          ['hero', "The grey shapes in the halls were people. Halcyon drank them down and kept the outline."],
          ['hero', "Husks, the charts call them, in tidy ink. My name goes in no column of theirs."],
          ['hero', "Cryo Vault 9 is three floors down. Isolde is in there, and she will say I was too loud."]
        ] },
      2: { zone: 'cryo', with: 'isolde', goal: "Hold Cryo Vault 9 with Isolde",
        meet: [
          ['isolde', "You sang a tank open, Nyra. The whole ward heard you. So did Halcyon."],
          ['hero', "And the tank is open."],
          ['isolde', "A falcon that screams at every mouse goes hungry. Keep the voice low and the blade cold."],
          ['hero', "Low. Cold. Noted. Now, are you coming out of that glass, or shall I sing it open too?"],
          ['isolde', "Gently. I hate glass. ...No, too late for gently. Listen. Boots."],
          ['maren', "Then it's tonight. I'll be behind you with the needle, Nyra. Your heart is already running ahead of you."]
        ],
        win: [
          ['maren', "Sit. Your heart is skipping like a stone on water. Breathe with me. Slower. ...There. Now go, both of you."],
          ['hero', "Then come with us, Maren."],
          ['maren', "Someone has to sit with the ones who can't run yet. Come back for them. That's my fee."],
          ['hero', "Then I'll come back. For every bed in this ward. Hold me to it."]
        ] },
      3: { zone: 'crater', rival: 'kael', goal: "Duel Kael at the Crater",
        meet: [
          ['hero', "White hair, red scarf, lightning in your fists. I've watched you on the feed, opening the Sump's vents on our labs."],
          ['kael', "Opened what? I've never been near your labs. Halcyon told ME you sold our tunnels to their drills."],
          ['hero', "I've lived in a tank and then on the run. I never met a tunnel I didn't want out of."],
          ['kael', "Funny. That's word for word what a Halcyon agent would say."],
          ['hero', "So is that. Low voice. Cold blade. Let's see what you're made of."]
        ],
        win: [
          ['kael', "You fight like somebody who's been in a cage. Not like somebody who builds them."],
          ['hero', "And you don't fight like a man who floods labs. You fight like a boy raised on a scrap heap."],
          ['kael', "Crusher Yard. Finest heap in Deepline. And I never touched those vents. Halcyon lies; ask anyone below."],
          ['hero', "I don't know what I saw on that feed. But it wasn't the boy in front of me."]
        ],
        lose: [
          ['kael', "Stay down. I don't want to hurt you. I want to know why you sold us."],
          ['hero', "I didn't. Once more."]
        ] },
      4: { zone: 'noble', goal: "Lead the Subjects up to the Ring",
        card: "Nyra brings every numbered Subject up into the light of the Noble Ring, and at the Crater Kiri's crane lands with Pell's word: the false faces were Rue's.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen on the Ring plays one feed, over and over: Kael at the vents."],
          ['sys', "And up the Skylift comes Deepline's answer: Subject 31 led Halcyon's drills into the tunnels."],
          ['hero', "I have never led a drill anywhere. Someone is wearing my face. And his."],
          ['maren', "Then show them the real one. The wards are open, Nyra. Bring them up."],
          ['hero', "Everyone Halcyon ever numbered: up, now. Stay low, stay close, and sing if you have a voice left."]
        ],
        win: [
          ['hero', "The Proving Hall has turned. Aldric's knights hold the stairs for us now, their swords facing outward."],
          ['sys', "The Crater. Kael faces Nyra, and a second Kael watches from the crowd. Kiri's crane lands with Pell's word: Rue."],
          ['hero', "The one in the crowd ran: a face with nothing behind it, and it wore mine too. Sorry, Kael. Now, the Spire."]
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
      1: { zone: 'cryo', goal: "Break the glass of Cryo Vault 9",
        intro: [
          ['sys', "Cryo Vault 9. Halcyon keeps its Subjects colder here than they have ever been. The eldest has never minded the cold."],
          ['hero', "Isolde. I kept the white falcons of the eyrie over the Frozen Harbour. The tear took all of them but one."],
          ['hero', "She is made of ice now, like everything in this place. The cold I can bear. It is the glass I cannot."],
          ['agent', "Subject 52, step away from the door. Sedation in ten. Nine."],
          ['hero', "Ten was generous. My falcon needs three."]
        ],
        win: [
          ['hero', "No more glass. There, little one. Up. Show me the halls."],
          ['hero', "And the knight at the vault door: I know that stance. My falcons sat on his gate for twenty winters."]
        ] },
      2: { zone: 'cryo', with: 'aldric', goal: "Make Aldric see what he guards",
        meet: [
          ['aldric', "Subject 52. Go back to your vault. I take no pleasure in hurting you."],
          ['hero', "Captain of the harbour wall. Every morning you stood under my eyrie and tossed scraps to my falcons."],
          ['aldric', "The white birds on the gate. You are the falconer's girl. You are from home."],
          ['hero', "You have guarded my door for a year, Captain, and never once looked through it."],
          ['aldric', "I was told the Subjects were protected. That was the wall I kept."],
          ['agent', "Stand aside, Sir Aldric. Subject 52 is reassigned to the feed lines. Director's order."],
          ['aldric', "The Director's word is that she is protected. No one passes my wall to say otherwise."]
        ],
        win: [
          ['aldric', "Reassigned. To the feed lines. What waits in the feed lines, falconer?"],
          ['hero', "Go and look, Captain. There is a girl on the Night Ward who will show you the way."],
          ['aldric', "Then I will look. And until I know, no one lays a hand on you."],
          ['hero', "A good wall. My falcons always liked you."]
        ] },
      3: { zone: 'icehouse', rival: 'brann', goal: "Settle winter with Brann",
        meet: [
          ['brann', "So. The bird-woman who says winter belongs to her. Came north at last."],
          ['hero', "You invited me, and I came quietly. You are the one who shouts."],
          ['brann', "Winter on Vharra had bears in it. I am the last bear. Winter answers to me."],
          ['hero', "Winter answers to no one. It listens, though, to whoever is quietest. Shall we see who that is?"]
        ],
        win: [
          ['brann', "Hah! Frost in my beard and a bird on my head. Fine. FINE. Winter listens to you."],
          ['hero', "Winter listens to us both. You need only stop shouting at it."],
          ['brann', "Come north again. Bring the bird. First we drink, then we argue."]
        ],
        lose: [
          ['brann', "Warm your hands, bird-woman. Then come back and lose properly."]
        ] },
      4: { zone: 'noble', goal: "Fly the signal to rise",
        card: "Isolde sends her ice falcon to every ward as the signal to rise; the knights turn, and from the Pit Pell names the copy behind the war: Rue.",
        intro: [
          ['sys', "The Noble Ring. Every screen loops one feed: a white-haired Deepline boy opening the Sump's vents on the labs."],
          ['agent', "Deepline has struck the Sky! The Proving Hall marches on the Skylift at dawn!"],
          ['hero', "My falcon watches that feed and never stirs. She stirs for anything alive. That is not a boy."],
          ['nyra', "The wards are ready, Isolde. They're waiting on your bird."],
          ['hero', "Then go, little one. Every ward, every window. Tell them one word: rise."]
        ],
        win: [
          ['hero', "Every ward rose to the signal. And the knights: Aldric turned them. A good wall."],
          ['sys', "Out of the Pit comes Pell's word, and Kiri's crane carries it to the Crater: the faceless one is Rue. Rue runs."],
          ['hero', "A face with nothing behind it. Halcyon sold us a mask and called it a war. My falcon knew. Now, the Spire."]
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
          ['hero', "Home can wait a while. Up, little one. Show me this city from above, now that it belongs to us."],
          ['hero', "My falcon never misses."]
        ],
        lose: [
          ['itsuki', "A fast bird. A slow falconer. Again."]
        ] }
    },

    // ---------------------------------------------------------------- GALE
    gale: {
      1: { zone: 'stacks', goal: "Ride the updraft up the Stacks",
        intro: [
          ['sys', "The sky over Vharra tears. A kite goes up into the violet. The boy holding the string goes down."],
          ['sys', "Vent Stack Four, Deepline: a thousand metres under Aurelia. He falls every one of them, and does not break."],
          ['hero', "Ow. Right. Gale, ridge-runner of Vharra, all limbs present. Sora went UP. So I go up."],
          ['agent', "Torn-through in Stack Four! Power reading off the chart. Get a net on him!"],
          ['hero', "You brought a net. For the wind. That's adorable."]
        ],
        win: [
          ['hero', "Feel that? Hot air, climbing. The whole stack breathes, and it breathes up."],
          ['hero', "Updraft, take me home. Hold on, Sora. Your big brother's coming, and he's bringing a lecture."]
        ] },
      2: { zone: 'skylift', with: 'sora', goal: "Hold the Skylift with Sora",
        meet: [
          ['sora', "GALE?! You fell! I watched you fall!"],
          ['hero', "A thousand metres down, then all the way back on the wind. The towers up here all look alike, you know."],
          ['sora', "And now you're going to hover over me. I can feel it starting."],
          ['hero', "I'm going to hover like a cloud with a grudge. Who's the one with the paper bird?"],
          ['kiri', "Kiri, from the steppe like you. We carry the letters Halcyon would rather nobody sent. Can you fly?"],
          ['hero', "Can I fly. I'm the wind's favourite. Deal me in."],
          ['agent', "Unlicensed flyers on the Skylift cables. Shoot them down!"]
        ],
        win: [
          ['kiri', "Three flyers and every tower in Aurelia. That's not a delivery run. That's a post. The Paper Post."],
          ['sora', "Fine. He's in. But he does NOT follow me on every run."],
          ['hero', "Every run. Every single one. I'll be the breeze on the back of your neck."]
        ] },
      3: { zone: 'milezero', rival: 'tarn', goal: "Race number twelve: beat Tarn",
        meet: [
          ['tarn', "Race twelve. Mile Zero to the Crater rim, and no wind this time, flyboy."],
          ['hero', "No wind? The wind is the only reason I ever run anywhere."],
          ['tarn', "I walked nine hundred miles ahead of the tear. On these feet. That's running. What you do is cheating."],
          ['hero', "Eleven races, eleven arguments. Let's skip the running and settle it the short way."]
        ],
        win: [
          ['tarn', "Fine. FINE. You're fast. You're still cheating."],
          ['hero', "Twelve races, twelve arguments. Admit it: you'd miss me."],
          ['tarn', "Thirteen. Next month. And bring your own legs."]
        ],
        lose: [
          ['tarn', "Legs beat wind. Carve that on something, flyboy."]
        ] },
      4: { zone: 'noble', goal: "Fly the plan to every ward",
        card: "Gale flies the uprising's plan to every ward before the Proving Hall can march; Kiri flies Pell's word to the Crater, and four banners start up the Spire.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Halcyon's screens loop one feed: a Deepline boy opening the Sump's vents on the labs."],
          ['kiri', "Below, they swear Nyra led the drills in. That same hour I took a letter from her hand, up here. Someone is lying with faces."],
          ['hero', "Then the truth flies faster than the lie. Every ward gets the plan before the Proving Hall gets its boots on."],
          ['sora', "High towers are mine, low wards are yours. And don't follow me!"],
          ['hero', "Me? Follow? ...Only a little."]
        ],
        win: [
          ['hero', "Every ward had the plan, and every ward rose on time. The Paper Post has never missed a tower."],
          ['sys', "Kiri carries Pell's word to the Crater: the faces were Rue's. With two Kaels in plain sight, Rue runs."],
          ['hero', "A borrowed face, a borrowed war. Four banners, four sides of the Spire. I'll take the windy one."]
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
        intro: [
          ['sys', "The Proving Hall, where the Director's champions are forged. In a year, Subject 12 has not given a single step."],
          ['hero', "I am Aldric, captain of the harbour wall. The wall is gone. The oath remains: I stand between harm and the people."],
          ['director', "My finest knight. Trial forty, Sir Aldric. Show my guests what a wall is."],
          ['hero', "As you command, Director. Send them in."]
        ],
        win: [
          ['director', "Flawless. The Subjects sleep soundly because men like you stand at the door."],
          ['hero', "The guests applaud. Yet the carts from the wards go down to the feed lines full, and come back empty."],
          ['hero', "I hold a wall for a man's word. It is time I weighed the word."]
        ] },
      2: { zone: 'enginecore', with: 'vesper', goal: "See the feed lines with Vesper",
        meet: [
          ['vesper', "Knight. You asked about the carts. Stop asking. Look."],
          ['hero', "The one from the Night Ward. Seventy-seven. You lit the lamps on my sea wall, once."],
          ['vesper', "Every dusk. You never saw me. Look down."],
          ['hero', "Grey shapes on the feed lines. Breathing. Those are Subjects. Those are the ones I was guarding."],
          ['vesper', "Husks. What the Engine leaves behind. That is your Director's word, knight."],
          ['agent', "Intruders on the feed lines! ...Sir Aldric? Sir, step away from that Subject."]
        ],
        win: [
          ['hero', "I swore to stand between harm and the people. For a year I have stood on harm's side of the door."],
          ['vesper', "Then move."],
          ['hero', "I will. Not tonight, and not alone. When I turn, the whole Hall turns with me."]
        ] },
      3: { zone: 'skyport', rival: 'tor', goal: "Hold the line against Tor",
        meet: [
          ['tor', "So you're the sky knight who holds a line. I'm Tor. Nothing has ever got past me."],
          ['hero', "Nor past me. Halcyon sent me to test you. I came to see a wall worthy of the name."],
          ['tor', "Then plant your feet. One of us is going to move."],
          ['hero', "Or neither does. Let us learn which."]
        ],
        win: [
          ['tor', "You hit like a gate swinging shut. I'm still standing, mind. Just... further back."],
          ['hero', "Two walls, and neither truly gave. At home we would have stood shoulder to shoulder."],
          ['tor', "Then let's both step forward, together. When your Hall turns, knight, the Village gate turns with it."]
        ],
        lose: [
          ['tor', "Nothing gets past me. Not even a good knight. Up you get."]
        ] },
      4: { zone: 'noble', goal: "Turn the knights around",
        card: "Aldric turns the Proving Hall on the Ring, then holds the door of Pylon Chamber Six while Kessen reroutes the pylons by hand, and Aurelia falls one floor and holds.",
        intro: [
          ['sys', "The Siege of the Noble Ring. On every screen, a white-haired Deepline boy opens the Sump's vents on the labs."],
          ['director', "Deepline has struck at us. The Proving Hall marches. Lead them down, Sir Aldric."],
          ['hero', "I have seen that boy's face, Director. I have also seen your feed lines. One of the two is a lie, and I know which."],
          ['vesper', "The knights are at your back, Aldric. Tell them what you saw."],
          ['hero', "Knights of the Hall! We swore to stand between harm and the people. Turn around. Harm is at our backs."]
        ],
        win: [
          ['hero', "The Hall has turned. My oath to the Director lies broken. The older oath still stands."],
          ['sys', "Pell names the face behind the war: Rue. At the Spire, Halcyon cuts the pylons to let the city fall."],
          ['kessen', "Pylon Chamber Six. I can reroute them by hand. Hold that door, captain. No one comes through."],
          ['hero', "No one did. The city fell one floor, and caught. Now, the Engine Core."]
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
        intro: [
          ['sys', "The Burn Ward. For six weeks Halcyon's furnace has run on one girl from the Frozen Harbour, the way a stove runs on coal."],
          ['hero', "Pyra. At home there was a blue forge that never went out. Here there's a bottle, and I'm the thing inside it."],
          ['elixa', "Week seven, Subject 44. Today we add a second colour. Do hold still; I have never seen what happens next."],
          ['hero', "Want to see what happens next? Listen. That ticking is the glass."],
          ['agent', "Temperature spike in the Burn Ward! Contain 44! CONTAIN-"]
        ],
        win: [
          ['hero', "I burned down the Burn Ward. Somebody should have read the name on the door."],
          ['hero', "Down the hall there's a girl with frost in her hair who can't stand. So I carry her. Hold on, Nyra. It's warm where we're going."]
        ] },
      2: { zone: 'core', with: 'ashka', goal: "Follow your fire to the Core Sump",
        meet: [
          ['sys', "Pyra's fire pours down the vents, all the way to the Core Sump. At the bottom, something burns back."],
          ['ashka', "Who's been pouring fire down my vents? ...You. You burn like home."],
          ['hero', "Pyra. Subject 44, former. I carried a girl out through my own fire tonight, and the fire kept going. Straight to you."],
          ['ashka', "Ashka. Subject 60. Half of Deepline sleeps warm because I'm chained down here. A year of it."],
          ['hero', "I can't melt those chains. I just tried. I hate that more than I hate Halcyon."],
          ['ashka', "Nothing melts them. But I fight fine inside them. Boots on the stairs: Halcyon's coming down."]
        ],
        win: [
          ['ashka', "You fight like a forge with its doors kicked open. Like a sister."],
          ['hero', "Then that's what you are. I'll come back with something that breaks chains. Count on it."],
          ['ashka', "Burn bright up there. I'll feel it through the pipes."]
        ] },
      3: { zone: 'ballast', rival: 'kestra', goal: "Fight twelve: settle it with Kestra",
        meet: [
          ['kestra', "There she is. Strolls out of the Burn Ward wrapped in a phoenix and thinks she owns it."],
          ['hero', "It came out of my fire, so it's mine. Eleven fights, and I'm ahead, by the way."],
          ['kestra', "My family has danced the phoenix under this city for a hundred years. Fight twelve. Here, where it's hot."],
          ['hero', "Hot? Oh, honey. Hot is my whole personality."]
        ],
        win: [
          ['kestra', "Fine. Twelve to you. The phoenix question stays open."],
          ['hero', "It's a bird, Kestra. It has two wings. Take one."],
          ['lin', "Then kindly stop setting fire to the beams while you share it."]
        ],
        lose: [
          ['kestra', "Sit down, matchstick. Thirteen, whenever you like."]
        ] },
      4: { zone: 'noble', goal: "Burn the Proving Hall's gates",
        card: "Pyra burns down the gates Halcyon slammed on the Ring, Pell names the borrowed face behind the war, and the Director waits at the Engine Core.",
        intro: [
          ['sys', "The Siege of the Noble Ring. On every screen, a Deepline boy opens the Sump's vents on the labs."],
          ['hero', "Ashka watched that boy at the vents from her chains. He never sweated. In the Sump. Even the rocks sweat in the Sump."],
          ['agent', "The Proving Hall marches on Deepline! Shut the gates! Nobody leaves the Ring!"],
          ['hero', "Gates. Adorable. Stand back, everybody. This is the part I'm good at."]
        ],
        win: [
          ['hero', "No more gates. The knights are coming out, facing the right way for once. That's Aldric's work."],
          ['sys', "Caught in his own strings at the Pit, Pell names the face: Rue. At the Crater she runs. Ashka was right: a copy."],
          ['hero', "Someone struck this war with a borrowed face. On to the Engine Core. I'll find the hand that held the match."]
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
      1: { zone: 'range', goal: "Turn the Firing Gallery around",
        intro: [
          ['sys', "The Firing Gallery. A target a mile out over the clouds. Subject 57 has never once missed."],
          ['hero', "I'm Yara. I lit the lamp on the sea wall so the ships could find their way in. Halcyon calls this the same job."],
          ['agent', "Target at one mile, bearing for the Skylift. Fire, 57."],
          ['hero', "Wait. That's no ship. Those are people clinging to a rag of sail. Runaways from the wards."],
          ['agent', "They're Subjects. Fire, 57, or take their place."],
          ['hero', "A lamp brings people home. It doesn't knock them out of the sky. I'm done aiming for you."]
        ],
        win: [
          ['hero', "The skiff made the Skylift. Every soul on it."],
          ['hero', "How many of my mile-away targets were never ships at all? I'll count them later. Every one."]
        ] },
      2: { zone: 'saloon', with: 'jax', goal: "Cover the runaways with Jax",
        card: "Yara follows the runaways down to the Surface, where Jax holds the Long Bar's door; ten paces or a mile, together they keep Halcyon's recovery team off them.",
        meet: [
          ['sys', "The Long Bar at Mile Zero. The runaways rode the Skylift down and ran. Halcyon's recovery team rode down after them."],
          ['jax', "Easy with that bow, Aurelia. You're the one who wouldn't shoot. The whole skiff's drinking on your name."],
          ['hero', "Yara. I kept the lamp on our sea wall, back home. Those people are mine to bring in."],
          ['jax', "Jax. Nobody belongs to anybody in my bar. I'll take the near ones. You take anything past ten paces."],
          ['hero', "Past ten paces is everything worth the arrow."],
          ['jax', "Then we argue later. Company."]
        ],
        win: [
          ['jax', "Fine shooting, at a mile. Up close you'd have died twice, and I'd have had to watch."],
          ['hero', "And at a mile you missed every one. Call it even?"],
          ['jax', "Nobody buys the round. Suits me. Go home, lamp-girl. Your runaways sleep safe at my bar."]
        ] },
      3: { zone: 'scrapton', rival: 'hart', goal: "Settle the bet with Hart",
        meet: [
          ['hart', "Yara. Two years this bet has run. Bow against spear, the Rust Flats, no caravan to guard."],
          ['hero', "A bow reaches further, Hart. That was always the whole bet."],
          ['hart', "A bow never stopped a charge. Keep your distance. I'll keep it for you."],
          ['hero', "Then charge. Every step you take toward me, my arrows land harder."]
        ],
        win: [
          ['hart', "I never got close. Not once. Fine. The bow reaches further."],
          ['hero', "Settled. You owe me a drink. Jax owes me two."],
          ['hart', "Jax will swear it wasn't ten paces. Good luck collecting."]
        ],
        lose: [
          ['hart', "Close enough to touch, Yara. That's a spear's distance. Again?"]
        ] },
      4: { zone: 'noble', goal: "Shoot the length of the Ring",
        card: "With one arrow drawn for a whole breath, Yara silences every Halcyon gun on the Ring; Rue is named and runs, and atop the Spire the Director becomes the Convergence.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Screens loop a Deepline boy at the vents; Deepline's runners swear Nyra led their drills."],
          ['hero', "I watched that feed through my scope. The boy at the vents never blinks. Forty seconds. Nobody living goes that long."],
          ['agent', "Gunners to the balconies! Anyone on the Ring without a Halcyon badge is a target. Anyone!"],
          ['hero', "Halcyon guns on every balcony, end to end. One line. One breath. The lamp is lit."]
        ],
        win: [
          ['sys', "One arrow, drawn for a whole breath, runs the length of the Noble Ring. Every Halcyon gun on it falls silent."],
          ['hero', "Clear. The Subjects can cross. Pell named the face at the Pit: Rue. At the Crater she ran. I knew that stare was wrong."],
          ['sys', "At the top of the Spire, the Director steps into his Engine. What steps out is the Convergence, and it opens the sky."]
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
      1: { zone: 'shrine', goal: "Fold a crane and fly up the Stacks",
        intro: [
          ['sys', "The Paper Shrine, under Deepline. Thousands of folded wishes for the dead, and among them a torn-through girl, waking."],
          ['hero', "Not the steppe. Definitely not the steppe. I'm Kiri, a herder's daughter from Vharra, and there are... yes. Still two of me."],
          ['hero', "Sorry, wishes. I'm folding you into something with wings, and I'm taking you up. Every last one."],
          ['agent', "Torn-through in the shrine! Bag her before she's properly awake!"],
          ['hero', "Too late! We're BOTH awake!"]
        ],
        win: [
          ['hero', "One crane, wide enough for two Kiris and every wish in the shrine. Next stop: up."],
          ['sys', "The first Deepliner to reach Aurelia without a ticket lands on a golden roof, snowed under in paper."]
        ] },
      2: { zone: 'slums', with: 'rook', goal: "Hold the Slums with Rook",
        meet: [
          ['sys', "The Deepline Slums. The Paper Post brings a letter Halcyon wants unsent, down to a boy with a great deal of himself."],
          ['rook', "Paper girl! Kiri, right? Wait. Which one of you do I sign for?"],
          ['hero', "Either. Both. Same girl, twice. Sora flies the high letters; I fold the rest and run them low."],
          ['rook', "Same! I mean, I'm the same guy, like eight times over. Everyone else thinks it's weird."],
          ['hero', "It's not weird. It's efficient. ...Also, every Halcyon collector in the Slums is standing behind you."],
          ['rook', "Great! There's more of me than of them!"]
        ],
        win: [
          ['rook', "You fold, I clone, nobody gets lonely. Come back any time, paper girl."],
          ['hero', "The Paper Post delivers to everyone. Even boys who are mostly reprints of themselves."],
          ['rook', "Original, thank you. The others are reprints of ME."]
        ] },
      3: { zone: 'shrine', rival: 'rue', goal: "Stay yourself against Rue",
        meet: [
          ['sys', "The Paper Shrine. A girl in a white smiling mask stands among the wishes. She is wearing Kiri's face. Then she isn't."],
          ['rue', "Pell says copy anyone once and you can do them better than they do. So why do I keep getting lost in you?"],
          ['hero', "Because there are two of me, and you can only be one thing at a time."],
          ['rue', "A copy of a copy is good for nothing. Hold still and be one girl."],
          ['hero', "Not a chance. Come on, both of us! Fold her up!"]
        ],
        win: [
          ['rue', "Stop... moving... I can't hold your shape. Which of you is real?"],
          ['hero', "Both. That's the one thing you can't copy. We aren't pretending."],
          ['sys', "Rue's mask slips. For a heartbeat there is nothing under it at all. Then she is gone, and the wishes settle like snow."]
        ],
        lose: [
          ['rue', "There. Three Kiris now, and the best of them is me."]
        ] },
      4: { zone: 'noble', goal: "Fly a thousand cranes over the Ring",
        card: "Kiri sends a thousand cranes of Pell's secrets over the Ring, then flies his last word to the Crater herself: the false faces were Rue's, and Rue runs.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Halcyon's screens loop one feed: a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I know that trick. I fought it in the shrine: something with no face, wearing whoever it likes."],
          ['hero', "Up here it wore Kael. Rook says down below it wore Nyra and led the drills. The same smile under both."],
          ['coda', "Then tell the Ring everything. Pell's secrets are stitched into my ribbons. Fold them and fly them."],
          ['hero', "A thousand cranes, one secret each, one for every door on the Ring. Go, go, GO!"]
        ],
        win: [
          ['sys', "A thousand paper cranes settle on a thousand doorsteps. The Ring reads who pays Halcyon, and for what."],
          ['sys', "A letter rides up the Skylift from the Pit. Pell, tangled in his own Cat's Cradle, has named the face: Rue."],
          ['sys', "Kiri flies it to the Crater herself. Kael faces Nyra; a second Kael stands in the crowd. She shouts the name. Rue runs."],
          ['hero', "Folded, flown, delivered. Next stop the Spire, and the Paper Post carries word for all four banners."]
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
      1: { zone: 'ballast', goal: "Keep the undercroft hidden",
        intro: [
          ['sys', "The Ballast Decks, the hot dark under the gold. The pylons hum, and the Sky Clan dances fire where no one looks."],
          ['hero', "Kestra of the Sky Clan. A hundred years we've danced the fire-fan here, under the nobles' feet. Not one of them knew."],
          ['agent', "Heat bloom on the ballast deck. Something down here is burning. Sweep it."],
          ['hero', "Burning? How rude. It's dancing. ...And now it's both."]
        ],
        win: [
          ['hero', "Sweep finished. Halcyon's sweep, I mean. Fire first, then the fan to make it worse."],
          ['hero', "Someone upstairs will notice the scorch marks. Lin is going to give me the look."]
        ] },
      2: { zone: 'ballast', with: 'lin', goal: "Keep the beams from catching",
        meet: [
          ['lin', "Kestra. Three beams scorched. The whole city sits on those."],
          ['hero', "And here it comes. The look."],
          ['lin', "It's already here. Also: Halcyon is sending a full sweep after your heat bloom. With a captain, this time."],
          ['hero', "Then they get the whole dance. You keep the beams cool, and I'll keep the fire on them."],
          ['lin', "Every fifth strike. And breathe, sister."]
        ],
        win: [
          ['hero', "Not one beam caught. How do you do that?"],
          ['lin', "I watch the fire, you watch the enemy, and neither of us watches the score."],
          ['hero', "I always watch the score. Speaking of which: I hear the Burn Ward has a new phoenix."]
        ] },
      3: { zone: 'ballast', rival: 'pyra', goal: "Prove the real phoenix to Pyra",
        meet: [
          ['pyra', "Kestra. Fight twelve. You picked the hottest room in the city. How sweet."],
          ['hero', "My family has danced the phoenix here for a hundred years. Then you stroll out of a bottle wearing one."],
          ['pyra', "It came out of my fire, so it's mine. Eleven fights, and I'm ahead."],
          ['hero', "Nobody agrees on that score. Tonight we settle it."]
        ],
        win: [
          ['pyra', "Fine. Twelve's yours. ...That dive was something else."],
          ['hero', "A hundred years of practice. The phoenix is ours. But I suppose a phoenix could spare a second tail."],
          ['lin', "Two tails, one undercroft, no burning beams. I am begging you both."]
        ],
        lose: [
          ['pyra', "Sit down, feather duster. Thirteen, whenever you want it."]
        ] },
      4: { zone: 'noble', goal: "Raise the undercroft into the Ring",
        card: "Kestra raises the Sky Clan out of the undercroft through the Noble Ring's floor; Rue's false faces are named, and the Hidden Clans march under a banner of their own.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Overhead, the screens loop a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "Look at the fire on that feed. It bends round him as if he isn't there. Fire doesn't bend round people. It eats them."],
          ['lin', "And Halcyon is using it to march the Proving Hall down to Deepline, right over our heads."],
          ['hero', "Over our roof, you mean. Sky Clan! A hundred years beneath the floor. Tonight we come up through it."]
        ],
        win: [
          ['sys', "The marble floor of the Noble Ring cracks open, and the Sky Clan rises out of the undercroft on wings of fire."],
          ['hero', "At last the nobles know who has been living under their feet. Those faces were worth a hundred years."],
          ['hero', "Pell named the face, and Rue ran at the Crater. A false face, a false war. Now the Spire, and the Clans carry a banner."]
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
      1: { zone: 'skyport', goal: "Deliver the letters past the drones",
        intro: [
          ['sys', "The Skyport. A kite as big as a sail rides the wind between Aurelia's towers, and a girl hangs from it, grinning."],
          ['hero', "Sora, of the kite clans of Vharra! Letters for anyone who pays in bread. Halcyon hates that. I love that."],
          ['hero', "When the sky tore I went UP. My brother went down. I haven't touched the ground since, and I don't intend to."],
          ['agent', "Unlicensed flyer over the Skyport. Interceptors, bring her down."],
          ['hero', "Down? Never heard of it. Is it nice?"]
        ],
        win: [
          ['hero', "Every letter delivered, every drone in the harbour, and not one toe on the ground."],
          ['hero', "He's down there somewhere. Gale. He fell. I'll find him, from up here, where I can see everything."]
        ] },
      2: { zone: 'skylift', with: 'gale', goal: "Hold the Skylift with Gale",
        meet: [
          ['hero', "That's... no. GALE?! You fell! I saw you fall!"],
          ['gale', "Down a thousand metres, up a thousand on the updraft. Your towers are hard to tell apart, Sora."],
          ['hero', "You're here. You're really here. ...You're going to hover now, aren't you."],
          ['gale', "Like a cloud with a grudge. Every run. Who's your paper friend?"],
          ['kiri', "Kiri. Folder, flyer, your sister's partner. Also: Halcyon, on the cables. A lot of Halcyon."],
          ['hero', "Brother, partner, kite. Let's give them something to look up at."]
        ],
        win: [
          ['kiri', "Three flyers, every tower in the city. Not a delivery run any more. A post. Call it the Paper Post."],
          ['gale', "And I'm on every run. Every one."],
          ['hero', "You are NOT on every run. ...Fine. Some runs. Stop looking at me like that."]
        ] },
      3: { zone: 'docks', rival: 'bando', goal: "Settle the kite story with Bando",
        card: "Bando has told all of Dockside Nine he saved Sora's kite on festival day; Sora flies down to set the story straight, and never once touches the dock.",
        meet: [
          ['sys', "Dockside Nine, last wharf of the Drowned Line. A kite drifts down the Skylift shaft and hangs above the cranes."],
          ['bando', "SORA! Hey, everybody, it's her! The kite girl! The one I saved!"],
          ['hero', "You did NOT save me. You reached for my kite. On festival day. While I stood right there."],
          ['bando', "Tree, kite, little crying girl, one long arm. That's a rescue. Ask anybody. I've told everybody."],
          ['hero', "Then here's a new one to tell. Kite girl beats long arm, and never touches the dock."],
          ['bando', "The long arm of Deepline says: come down here and say that."]
        ],
        win: [
          ['bando', "She never touched the dock. Not once. All right, all right. Kite girl wins."],
          ['hero', "Now say the rest. In front of everyone."],
          ['bando', "I didn't save you. ...I sort of did, though. A bit."],
          ['hero', "A bit. Fine. You can tell THAT one."]
        ],
        lose: [
          ['bando', "Reach beats string! Twice now I've saved you, kite girl."]
        ] },
      4: { zone: 'noble', goal: "Carry Coda's dance to every tower",
        card: "Sora flies Coda's ribbons of Pell's secrets past every tower in Aurelia, while Kiri's crane carries the name to the Crater: the false faces were Rue's.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the vents. Deepline swears Nyra led the drills."],
          ['hero', "From up here you see everyone. That night Kael was in the Crusher Yard. I flew right over him. Someone's lying."],
          ['coda', "Then carry the truth. I'm about to dance Pell's secrets out on stage. Take them to every tower."],
          ['hero', "Every tower, every window. Gale, take the low route! And don't follow me!"]
        ],
        win: [
          ['sys', "A kite trailing a dancer's ribbons crosses every tower in Aurelia, and Pell's secrets ride with it."],
          ['hero', "And Kiri's crane made the Crater: Pell named the face. Rue. She ran. I said someone was lying."]
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
      1: { zone: 'noble', goal: "Dance through the Director's show",
        intro: [
          ['sys', "The Noble Ring opera. Tonight the Director's guests want a spectacle: the star dancer against Halcyon's drones."],
          ['hero', "Coda. I learned rhythm counting the tolls of a temple bell on the Surface. Now I count for the people in the boxes."],
          ['pell', "Smile, my star. Every step on the beat. I will know if you miss one."],
          ['hero', "I never miss a step, Pell. That's the whole trouble."]
        ],
        win: [
          ['sys', "Applause. Roses on the boards. A noble leans close to whisper about the feed lines, and the ribbons remember."],
          ['hero', "One more secret for Pell's collection. A string on every step. Some day I'll find the scissors."]
        ] },
      2: { zone: 'noble', with: 'zara', goal: "Take a seat at the House Edge",
        card: "After the opera Coda slips Pell's strings for one night; Zara gives her a seat at the House Edge, bets on her, and together they see off Pell's collectors.",
        meet: [
          ['sys', "The House Edge, after the opera. Coda slips Pell's strings for a single night and walks into the richest card room on the Ring."],
          ['zara', "The star dancer at my tables, and without her shadow. Sit down, darling, before somebody tells Pell."],
          ['hero', "Every step I take, someone holds the string. Tonight I want one step that's mine, even if it only goes to a chair."],
          ['zara', "Then the chair is yours, whenever you need it. I'm betting on you, star. I never lose."],
          ['hero', "Your doorman says there are men in grey outside. Pell's men. Halcyon's. Both."],
          ['zara', "Then you dance, and I'll deal. Mind the chips."]
        ],
        win: [
          ['zara', "Not one chip on the floor. You fought as if no one held the string."],
          ['hero', "No one did. One toll, push. Two, fly. I counted it myself."],
          ['hero', "Keep my seat warm, Zara. One night I won't go back to Pell."]
        ] },
      3: { zone: 'noble', rival: 'pell', goal: "Cut Pell's strings mid-dance",
        meet: [
          ['sys', "The Noble Ring opera, mid-performance. The orchestra swells. The strings go taut."],
          ['pell', "You missed a step last night, my star. At the House Edge, of all the vulgar places."],
          ['hero', "I didn't miss that step. I took it. Without you."],
          ['pell', "I took you out of a temple and gave you the sky. Every step you own, I paid for."],
          ['hero', "Then here is your change. Every string. Mid-dance."]
        ],
        win: [
          ['sys', "The ribbons come away in her hands: Pell's strings, cut one by one. The whole house holds its breath."],
          ['pell', "Cutting your strings in the middle of a performance. How very rude."],
          ['hero', "They aren't your strings any more. They're my ribbons, and this dance is mine."]
        ],
        lose: [
          ['pell', "Back on the beat, my star. My beat. Always mine."]
        ] },
      4: { zone: 'noble', goal: "Dance Pell's secrets out",
        card: "Mid-opera, Coda dances Pell's whole ledger out for the Ring to read, while Pell, caught at the Pit, names the faceless one: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Outside, the screens loop a Deepline boy at the vents. Inside, the opera plays on."],
          ['hero', "That boy's face is a lie. Pell taught a girl with no face to wear anyone's, and I carried her orders in my ribbons."],
          ['hero', "Kael's face at the vents. Nyra's face on the drills. Both of them Pell's handiwork, and the Director's."],
          ['zara', "You have the whole Ring watching, darling. The house is yours. Dance."],
          ['hero', "Music, please. Every secret Pell ever sent through me, on the beat, for all of them to read."]
        ],
        win: [
          ['sys', "Ribbon by ribbon, Coda spells out Pell's ledger: the faces, the drills, the vents, the pay. The Ring reads every line."],
          ['hero', "Sora flies it to every tower, Kiri's cranes to every door. Nobody can ever say they didn't know."],
          ['sys', "From the Pit, Pell's own word: the girl with no face is Rue. At the Crater, Rue runs. Next, the Spire."]
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
      1: { zone: 'noble', goal: "Keep the House Edge's secret",
        intro: [
          ['sys', "The House Edge, richest card room on the Noble Ring, where Aurelia's nobles lose fortunes with impeccable manners."],
          ['hero', "Zara. Deepline card sharp. I won my way up the Skylift one hand at a time, and never said what I staked on the last."],
          ['hero', "The house's winnings slip down the Skylift. Bread, medicine, lamp oil. Nobody up here thinks to ask."],
          ['agent', "Halcyon audit, madam. Somebody's money is reaching Deepline. We'll be opening the vault."],
          ['hero', "Darling, nobody opens my vault. Pull up a chair and lose like a gentleman."]
        ],
        win: [
          ['hero', "Audit complete. Finding: the house won. Tell your Director to send better players."],
          ['hero', "Lin was missing tonight. Lin is never missing. Let's see where my bodyguard spends her evenings."]
        ] },
      2: { zone: 'ballast', with: 'lin', goal: "Follow Lin into the undercroft",
        meet: [
          ['sys', "Under the gold, the Ballast Decks. Zara follows her bodyguard down a stair no noble has ever heard of."],
          ['lin', "You followed me. Naturally. Nothing on the Ring gets past you."],
          ['hero', "And now I see you. Sky Clan. You took my job so your Clan could keep an eye on the Ring."],
          ['lin', "The House Edge sees everyone, and the Clan needed eyes there. I would have stood behind your chair regardless."],
          ['hero', "Darling, that is the best answer in the deck. Now: who's coming down that stair?"],
          ['lin', "Halcyon. Your auditors followed you down. Every fifth strike, Zara. Do try to keep up."]
        ],
        win: [
          ['hero', "The house keeps its winnings and its bodyguard. Watch the Ring for your Clan, darling. Only tell me what you see."],
          ['lin', "Everything. Beginning with this: your money reaches Deepline, and Halcyon knows it."],
          ['hero', "Then it's time I raised."]
        ] },
      3: { zone: 'saloon', rival: 'jax', goal: "Settle the old hand with Jax",
        meet: [
          ['sys', "The Long Bar at Mile Zero. One card table, two chairs, and a revolver that has never once been holstered."],
          ['jax', "Zara. Top hat, red waistcoat. Money suits you."],
          ['hero', "Jax. And you still deal off the bottom when the cards turn on you."],
          ['jax', "And you still walk out without paying when you're winning. Some of us remember how that ended."],
          ['hero', "We don't speak of it. Except across a table, with our hands full. Deal."]
        ],
        win: [
          ['jax', "Jackpot. Of course it was. You always did draw the ten."],
          ['hero', "I stacked the deck, darling. You're the one who taught me how."],
          ['jax', "Then we're square. Drinks on the house. Your house."]
        ],
        lose: [
          ['jax', "Six chambers, sweetheart. You were still counting the first five."]
        ] },
      4: { zone: 'noble', goal: "Bet the House on the uprising",
        card: "Zara bets every coin in the House Edge on the uprising and pays for every door, stair and kite; from the Pit, Pell names the face behind the war: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen loops one feed: a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I read faces for a living, darling. That boy has a face and nothing behind it. A card with no pips."],
          ['lin', "Deepline's runners say Nyra led the drills down there. The same blank behind her eyes."],
          ['hero', "Someone is dealing from a stacked deck. Very well. Every coin in the House, on the uprising."]
        ],
        win: [
          ['hero', "The House paid for the Subjects' doors, the Clan's stairs and every kite in the Paper Post. All in. My finest bet."],
          ['sys', "From the Pit comes Pell's own word: the faceless one is Rue. At the Crater, she runs."],
          ['hero', "A card with no pips, as I said. Now, darlings: the Spire."]
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
      1: { zone: 'hydro', goal: "Keep your patients off the Engine",
        intro: [
          ['sys', "The Hydro Ward. Subject 21 is doctor to every other Subject, because she is better at it than Halcyon's own staff."],
          ['hero', "Maren. At home I sat with fevered children until the fever went out with the tide. Here I sit with numbered ones."],
          ['nyra', "Maren. The carts are back. Beds four to nine, for the feed lines."],
          ['agent', "Step aside, Subject 21. Beds four through nine are past use. Engine's orders."],
          ['hero', "These are my patients. Nobody is past use while I am still in the room."]
        ],
        win: [
          ['hero', "Beds four through nine, still breathing. That will do for tonight."],
          ['hero', "I took Halcyon's job to stay in the room with them. I'll stay until every one of them walks out on their own feet."]
        ] },
      2: { zone: 'choir', with: 'nami', goal: "Pull Nami out of the Drowned Line",
        meet: [
          ['sys', "The Drowned Line. Halcyon sends its doctor down with a collection team. A wall gives way, and a woman goes under."],
          ['hero', "Too long under. No. No, sea, you don't get her. Give her BACK."],
          ['nami', "Cold. Who... who was arguing with the sea?"],
          ['hero', "Your doctor. Maren. Breathe. You were gone, and now you aren't."],
          ['agent', "Good work, doctor. She's breathing, and she's full of power. Bag her for the Spire."],
          ['nami', "I don't think so."]
        ],
        win: [
          ['nami', "You dragged me out, then fought your own team for me. I'm Nami. I owe you my life."],
          ['hero', "You owe me rest and fluids. I must go back up: there's a girl in a tank who keeps forgetting to breathe."],
          ['nami', "Then I'll guard the doctor's back every time she comes down here. That's the debt, and I pay my debts."]
        ] },
      3: { zone: 'market', rival: 'vesna', goal: "Face Vesna in the Neon Market",
        meet: [
          ['sys', "The Neon Market, Red Quarter. Vesna keeps the Red Ledger, and Maren's patients are written in it."],
          ['vesna', "The Tide Doctor. You've been giving blood away for free. It's dreadful for business."],
          ['hero', "You charge Deepline for its own blood. In my trade, that's called a sickness."],
          ['vesna', "In mine it's called bookkeeping. Every debt is paid in red, doctor. Even yours."],
          ['hero', "Then let us settle my account. The tide is coming in."]
        ],
        win: [
          ['vesna', "You heal while you hit. How very tiresome."],
          ['hero', "Strike their names from your ledger, Vesna. The ones who can't pay."],
          ['vesna', "One page, then. Not the long one. That page is Halcyon's, and I intend to collect it."]
        ],
        lose: [
          ['vesna', "Your account is overdrawn, doctor. Interest is due."]
        ] },
      4: { zone: 'noble', goal: "Hold the door while the Subjects run",
        card: "Maren holds the ward door while every Subject runs for the Ring, and word comes up from the Pit that the false faces were Rue's.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the Sump's vents, and every ward is full of burns."],
          ['hero', "I dressed those burns myself. And the boy on the feed never breathes. Forty seconds in Sump smoke. That is no boy."],
          ['nyra', "The wards are open, Maren. They're running, and Halcyon is coming down the corridor behind them."],
          ['hero', "Then everyone through this door, and no one through it after them. The doctor is in."]
        ],
        win: [
          ['hero', "Last one through. Everyone is out. Now I may leave the room."],
          ['sys', "From the Pit, Pell names the faceless one: Rue. At the Crater she runs, and the war stops being a war."],
          ['hero', "As I thought. Now, the Spire. Someone up there needs a very long rest."]
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
      1: { zone: 'furnace', goal: "Find out what your serums are for",
        intro: [
          ['sys', "The Burn Ward labs. Halcyon's brightest chemist has never once asked where her Subjects come from. Only what they do."],
          ['hero', "Elixa, chief alchemist. Red burns, blue freezes. No one has tried both at once on a living subject. So, naturally."],
          ['agent', "Doctor, the Director wants 44 ready for the feed lines by week seven. He said ready, doctor. Not interesting."],
          ['hero', "Feed lines? No one mentioned feed lines. What becomes of her afterward?"],
          ['agent', "Afterward is the Engine's business. Security, see the doctor to her quarters."]
        ],
        win: [
          ['hero', "Curious. They were most anxious that I not see the afterward. So I went and looked."],
          ['hero', "Grey shapes on the feed lines, still breathing. Husks. And my serums were step one of the method."],
          ['hero', "Every result has a cause, and this cause is me. Next experiment: a cure."]
        ] },
      2: { zone: 'glowwild', with: 'ume', goal: "Gather Glowwild spores with Ume",
        meet: [
          ['ume', "Halcyon's chemist, in my garden. Touch nothing. What do you want the spores for?"],
          ['hero', "A cure, for the Husks. Your spores remember. I want to know if they can remind a body what it used to be."],
          ['ume', "A good answer. Most Halcyon people say weapons. Most Halcyon people end up as compost."],
          ['hero', "I would prefer not to be compost. Shall we settle the price first, or the drones behind you?"],
          ['ume', "Drones, then price. Step where I step."]
        ],
        win: [
          ['ume', "You fought for the garden. Very well: spores, every season. And every season I'll ask what for."],
          ['hero', "And every season I'll answer. Green Cauldron, meet the Glowwild. This will react beautifully."]
        ] },
      3: { zone: 'furnace', rival: 'pyra', goal: "Face your result: Pyra",
        meet: [
          ['sys', "The Burn Ward, week seven. The bottle breaks, and the fire walks out of it, and turns, and looks back."],
          ['pyra', "Elixa. You mixed it. I drank it. Six weeks. And you took NOTES."],
          ['hero', "I did. Pages of them. I didn't know what they were for. Now I do."],
          ['pyra', "Knowing doesn't give back a single week. You're on my list."],
          ['hero', "Then let the result look at me. I would rather see it than look away."]
        ],
        win: [
          ['pyra', "You stayed. Everyone else from that lab ran."],
          ['hero', "You're my finest result. You burned my lab down and looked me in the eye. A scientist does not run from that."],
          ['pyra', "Still on the list. ...A bit lower down."]
        ],
        lose: [
          ['pyra', "Note for your records: ow."]
        ] },
      4: { zone: 'noble', goal: "Turn the serums against Halcyon",
        card: "Elixa reverses her own serums and sends Halcyon's guards to sleep all across the Ring, while from the Pit Pell names the face behind the war: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop one feed: a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I ran that feed through my instruments. Sump fire all round the boy, and he reads room temperature. That is no boy."],
          ['maren', "Then put your lab to some good use, Elixa. Every Halcyon guard on the Ring is full of your stimulants."],
          ['hero', "Then they shall have a second colour. Blue to slow, green to sleep. The Grand Experiment, everyone."]
        ],
        win: [
          ['hero', "Halcyon's own soldiers, snoring in the corridors. The serums run backwards. Fascinating."],
          ['sys', "From the Pit: Pell, tangled in his own Cat's Cradle, names the faceless one. Rue. At the Crater, she runs."],
          ['hero', "No face and no heat. I would dearly love a sample. Later. The Spire first."]
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
      1: { zone: 'archive', goal: "Refuse the Director's seal",
        intro: [
          ['sys', "The Archive. Every contract on the Noble Ring, every law the Director ever made, is sealed in one woman's ink."],
          ['hero', "Isa, of the old school on the steppe. Sen and I could draw a line no one crossed. Now I draw Halcyon's."],
          ['agent', "Order forty-one, seal-writer. The Director wants it binding by noon. Seal it."],
          ['hero', "Every Subject past use, to the Engine, with no record kept. ...No. Not in my ink."],
          ['agent', "Then we take the brush. And the hand that holds it."]
        ],
        win: [
          ['hero', "Order forty-one, unsealed. It will stay unsealed."],
          ['hero', "But every law before it wears my seal. I wrote this cage. Now I must unwrite it, one word at a time."]
        ] },
      2: { zone: 'archive', with: 'lin', goal: "Hold the Archive with Lin",
        card: "Halcyon comes for the hand that refused order forty-one, and Lin of the Sky Clan steps out of the stacks to guard Isa's brush hand for the first time.",
        meet: [
          ['sys', "The Archive, after order forty-one. Halcyon wants the seal-writer's brush hand, and sends a captain to take it."],
          ['lin', "Seal-writer. Breathe. The Sky Clan has read your seals for a year. We read the one you refused as well."],
          ['hero', "You're from under the floor. The ones no one up here believes in. Why come up for me?"],
          ['lin', "The Pact keeps the layers from killing one another. Your ink is the Director's finest weapon. Not today."],
          ['hero', "Then keep them off my hand. I have a great many words to take back, and I need it for every one."],
          ['lin', "Write. I'll keep the door. Every fifth strike seals."]
        ],
        win: [
          ['hero', "Not one drop spilled. Every law in these stacks bears my seal, Lin. I built this cage word by word."],
          ['lin', "Then you can unbuild it. One word, large enough for all of them."],
          ['hero', "A Final Word. ...When I'm ready. Stay near my brush hand."],
          ['lin', "Always. It is the only hand I guard."]
        ] },
      3: { zone: 'metro', rival: 'sen', goal: "Draw a line Sen cannot cross",
        card: "Isa goes down to the Old Metro to ask Sen, her old schoolmate, to help unwrite her laws; first he wants to know if her line still holds, and draws.",
        meet: [
          ['sys', "The Old Metro. A rusted metro car, swept spotless: the Rust Dojo. Sen sits inside, Isa's letters in a neat stack."],
          ['hero', "Sen. You answered every letter with one line. This time I came for more than one line."],
          ['sen', "For a year you sealed Halcyon's laws. Each one drew a line down here. Around people."],
          ['hero', "I know. I mean to unwrite them all. First I need to know my line still holds."],
          ['sen', "Then draw it, and I will try to cross."]
        ],
        win: [
          ['sen', "It held. The old school would be proud of that line."],
          ['hero', "You stopped your blade a hair's width from it. You always did wait too long."],
          ['sen', "Write your one word, Isa. I will answer it with one line, as I always have."]
        ],
        lose: [
          ['sen', "Crossed. Draw it again, and slower."]
        ] },
      4: { zone: 'noble', goal: "Write the Final Word",
        card: "With Lin guarding her brush hand, Isa writes the Final Word over the Ring and every law the Director sealed comes undone; then the faces are named: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy at the vents; Deepline swears Nyra led the drills."],
          ['hero', "Borrowed faces to start a war, and Halcyon has its war law waiting to be sealed. In my ink, of course."],
          ['lin', "I have your brush hand. No one comes near it. Write."],
          ['hero', "Every law the Director ever had me seal. One word to answer all of them."]
        ],
        win: [
          ['sys', "The Final Word falls across the sky in crimson ink, and every seal on every law the Director made breaks at once."],
          ['hero', "Unwritten. The Proving Hall has no orders, the wards have no locks, and the Subjects have their names."],
          ['sys', "From the Pit comes Pell's word: the faces were Rue's. At the Crater she runs, and four banners start up the Spire."]
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
      1: { zone: 'ballast', goal: "Seal the ballast crews, quietly",
        intro: [
          ['sys', "The Ballast Decks. Halcyon's crews come down with bolts and cutters to shut the undercroft's old doors and starve its heat."],
          ['hero', "Lin, of the Sky Clan. For a hundred years my family has lived under the gold. These doors open from our side."],
          ['kestra', "They're bolting the dance hall, Lin! Let me burn them. A little. A tasteful amount."],
          ['hero', "No fire near the beams. Breathe, sister. This needs a quiet hand."]
        ],
        win: [
          ['hero', "Every fifth strike seals. For a moment they forgot their own strength. A moment was all I needed."],
          ['kestra', "Fine. That was impressive. Quiet, and annoying, and impressive."]
        ] },
      2: { zone: 'noble', with: 'zara', goal: "Guard the House Edge with Zara",
        meet: [
          ['sys', "The House Edge, on the Noble Ring. The owner wants a bodyguard; the Sky Clan wants eyes on the Ring. One woman can be both."],
          ['zara', "So you're the one the Ring whispers about. Small, quiet, and three of my last guards still can't lift a glass."],
          ['hero', "They were rude to a waiter. I sealed their arms. The feeling returns by morning."],
          ['zara', "Darling, you're hired. Stand behind my chair and see everyone."],
          ['hero', "That is why I came. ...You have guests. Halcyon. They are unhappy about your money."]
        ],
        win: [
          ['zara', "Not one chip on the floor. You truly do see everyone."],
          ['hero', "Everyone. Even where your winnings go: down, to Deepline. The Clan approves."],
          ['zara', "Then we understand each other. The house keeps its winnings, and now its bodyguard."]
        ] },
      3: { zone: 'village', rival: 'ivo', goal: "Seal Ivo a third time",
        meet: [
          ['sys', "The Hidden Village on the Surface, before dawn. A man with gold fists has already been training for an hour."],
          ['ivo', "Lin! The soft one. I've been up since three. Today you don't seal me."],
          ['hero', "Your style is loud, Ivo. Every punch arrives with a herald."],
          ['ivo', "Twelve punches in two seconds. Herald THAT."],
          ['hero', "I needn't hear all twelve. Only the fifth."]
        ],
        win: [
          ['ivo', "Third time. THIRD. I can't feel my arms."],
          ['hero', "They will wake. Loud isn't wrong, Ivo. It is only easy to hear."],
          ['ivo', "Tomorrow, before dawn. I'm working on quiet."]
        ],
        lose: [
          ['ivo', "Not so soft now, eh? Up. Again! Again!"]
        ] },
      4: { zone: 'noble', goal: "Guard Isa's brush hand",
        card: "Lin guards Isa's brush hand while the Final Word unwrites every law the Director sealed, and the one who stood like no one is named at last: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Screens loop a Deepline boy at the vents. Below, Deepline swears Nyra led the drills."],
          ['hero', "Watch the boy on that feed. No weight in his feet. Everyone stands like someone. He stands like no one."],
          ['isa', "Then give Halcyon nothing to stand on. I'm writing the Final Word. Keep them off my hand."],
          ['hero', "Write. The brush is yours, and the room is mine."]
        ],
        win: [
          ['sys', "The Final Word crosses the sky in crimson ink, and every law the Director sealed comes undone."],
          ['hero', "Brush hand safe. Not a drop spilled. Breathe, Isa. Now out."],
          ['sys', "From the Pit, Pell names the one who stood like no one: Rue. At the Crater, she runs."]
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
      1: { zone: 'ward', goal: "Light the lower alleys by dawn",
        intro: [
          ['sys', "The Night Ward. Every night they lock Subject 77 in. Most nights she leaves anyway, by the roof."],
          ['hero', "Vesper. On the harbour wall I lit every lamp at dusk. No one saw who. Only a red scarf, already at the next lamp."],
          ['hero', "The lower alleys of Aurelia have no lamps. Tonight they will."],
          ['agent', "Movement on the Ward roofs. A flash of red cloth. Find it."],
          ['hero', "You will find lamps. Not me."]
        ],
        win: [
          ['hero', "Thirty lamps lit. Back in my cell before the count."],
          ['hero', "On the way, a cart from the wards, rolling down to the feed lines. Full. It came back up empty."]
        ] },
      2: { zone: 'enginecore', with: 'aldric', goal: "Show Aldric the feed lines",
        card: "Vesper follows the empty carts down to the Engine's feed lines and brings the knight who guards the wards to see the Husks with his own eyes.",
        meet: [
          ['sys', "Below the Spire, the Engine's feed lines. Vesper has shadowed the carts all night. Tonight she has brought company."],
          ['aldric', "Seventy-seven. You are outside your ward. I ought to take you back."],
          ['hero', "Look first, knight. You held the sea wall I lit every dusk, and never once saw me."],
          ['aldric', "The scarf on the wall. That was you. Why have you brought me here?"],
          ['hero', "Look down. Grey shapes, breathing. The Subjects you guard. Your Director calls them Husks."],
          ['agent', "Intruders on the feed lines! ...Sir Aldric? Sir, step away from that Subject."]
        ],
        win: [
          ['aldric', "I swore to stand between harm and the people. For a year I have stood on harm's side of the door."],
          ['hero', "Then move."],
          ['aldric', "When I turn, the whole Hall turns with me. Not before. Not alone."],
          ['hero', "Then I'll light the road when you do."]
        ] },
      3: { zone: 'ward', rival: 'moro', goal: "Cross Moro's rooftops",
        meet: [
          ['sys', "The Night Ward roofs. A tired young man sits on the ridge where Vesper always crosses. His shadow runs far too long."],
          ['moro', "You again. You walk through my shadows as if they were doors. It's rude."],
          ['hero', "Shadows are for walking through. You hide in yours."],
          ['moro', "Pell taught us that shadows hide things. I decided they hold things. Try walking through this one."],
          ['hero', "Watch me."]
        ],
        win: [
          ['moro', "Fine. You walked through it. I'm going back to bed."],
          ['hero', "Your shadow held me a whole second. Most can't hold me for one."],
          ['moro', "Next time, use the stairs. Please."]
        ],
        lose: [
          ['moro', "Held. Go home, lamplighter. Quietly."]
        ] },
      4: { zone: 'noble', goal: "Light the way for the Hall",
        card: "As the Proving Hall marches, Vesper lights a road of lamps down to the feed lines so every knight sees the Husks, and the Hall turns around.",
        intro: [
          ['sys', "The Siege of the Noble Ring. On every screen a Deepline boy opens the vents on the labs. The Proving Hall marches."],
          ['hero', "That boy on the feed casts no shadow. A lamp behind him, a lamp before him, nothing on the floor. I light lamps. I notice."],
          ['aldric', "Seventy-seven. The knights wait for my word. Show them what you showed me."],
          ['hero', "Every lamp from the Hall to the feed lines, then. Let them walk down and see."]
        ],
        win: [
          ['sys', "Lamp by lamp, a road of light runs down to the feed lines. The knights see the Husks, and the Proving Hall turns."],
          ['aldric', "For a year I stood in the wrong place. No longer."],
          ['hero', "And from the Pit: Pell named the face. Rue. At the Crater she ran. No shadow, no face. No one."]
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
