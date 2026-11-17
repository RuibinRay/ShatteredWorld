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
          ['sys', "Med-Lab Sector 7. Tank thirty-one has a crack in it, and the girl inside has been humming at it for a week."],
          ['hero', "My name is Nyra. I was born by the Frozen Harbour. Halcyon calls me thirty-one. Let them."],
          ['hero', "And there it is again. The grey one, standing behind the doctor. Nobody else ever looks at it."],
          ['agent', "Thirty-one is vocalising. Sedate her. Now, before the glass-"],
          ['hero', "Too late. Hold the note... and break."]
        ],
        win: [
          ['hero', "The grey shapes in the halls... they were people. Subjects. Halcyon drank them and left the outline."],
          ['hero', "Husks. That's what the charts call them. They will never put me in that column."],
          ['hero', "Cryo Vault 9 is three floors down. Isolde is in there. She'll say I was too loud."]
        ] },
      2: { zone: 'cryo', with: 'isolde', goal: "Hold Cryo Vault 9 with Isolde",
        meet: [
          ['isolde', "You sang a tank open, Nyra. The whole ward heard it. So did Halcyon."],
          ['hero', "It worked, didn't it?"],
          ['isolde', "A falcon that screams at every mouse starves. Low. Keep the voice low and the blade cold."],
          ['hero', "Low. Cold. Fine. Now are you coming out of that glass, or do I sing it open too?"],
          ['isolde', "Gently. I hate glass. ...Too late for gently. Here they come."],
          ['maren', "Tonight, then. I'll be right behind you with the needle, Nyra. Your heart is already racing."]
        ],
        win: [
          ['maren', "Sit. Your heart is skipping like a stone. Breathe with me. ...Better. Now go, both of you."],
          ['hero', "Come with us, Maren."],
          ['maren', "Someone has to stay with the ones who can't run yet. Come back for them. That's my price."],
          ['hero', "Then I'll come back. For all of them. That's a promise."]
        ] },
      3: { zone: 'crater', rival: 'kael', goal: "Duel Kael at the Crater",
        meet: [
          ['hero', "White hair, red scarf, lightning. You're the one on the feed. You opened the Sump's vents on the labs."],
          ['kael', "I opened what? I've never been near your labs. Halcyon told ME you sold the tunnels to the drills."],
          ['hero', "I was in a tank. Then I was running. I've never seen a tunnel I didn't want out of."],
          ['kael', "Funny. That's exactly what a Halcyon agent would say."],
          ['hero', "So is that. Low voice, cold blade. Let's find out."]
        ],
        win: [
          ['kael', "You fight like someone who's been in a cage. Not like someone who builds them."],
          ['hero', "And you don't fight like someone who floods labs. You fight like a kid off a trash heap."],
          ['kael', "Crusher Yard. Best heap in Deepline. And I never touched those vents. Halcyon lies. Ask anyone down there."],
          ['hero', "...I don't know what I saw on that feed. But I don't think it was you."]
        ],
        lose: [
          ['kael', "Stay down. I don't want to hurt you. I want to know why you sold us out."],
          ['hero', "I didn't. Again."]
        ] },
      4: { zone: 'noble', goal: "Lead the Subjects up to the Ring",
        card: "Nyra leads every numbered Subject up to the Noble Ring, then faces Kael at the Crater as Kiri lands with Pell's word: the false faces were Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen on the Ring plays the same feed: Kael at the vents, again and again."],
          ['sys', "And from Deepline, word comes up the Skylift: Subject 31 led Halcyon's drills into the tunnels."],
          ['hero', "I've never led a drill anywhere. Someone is wearing my face. And his."],
          ['maren', "Then let them see the real one. The wards are open, Nyra. Bring them up."],
          ['hero', "Everyone Halcyon ever numbered: up, now. Stay low, stay close, and sing if you can."]
        ],
        win: [
          ['hero', "The Proving Hall turned. Aldric's knights hold the stairs for us now, not against us."],
          ['sys', "The Crater. Kael stands in front of Nyra, and another Kael watches from the crowd. Kiri's crane lands with Pell's word: Rue."],
          ['hero', "The one in the crowd ran. A face with nothing behind it, and it wore mine too. Sorry, Kael. Next stop: the Spire."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Reach Vega through the Legion",
        card: "Vael's crown-ship splits the sky. In Pylon Chamber Six his champion Vega drags Aurelia down, and Nyra sings the harbour's star song at her until she falls back.",
        intro: [
          ['sys', "The sky over the Crater splits. Sovereign Vael's crown-ship hangs over it, and the Hollow Legion pours out."],
          ['vael', "Near side. Your Director opened the door. I have brought my champions to empty the house."],
          ['sys', "Pylon Chamber Six. Kessen's rerouted pylons scream. A stranger in a gold circlet pulls the whole city toward her."],
          ['hero', "Aurelia's falling again. Not while I'm standing in it."]
        ],
        meet: [
          ['vega', "Little singer. Step aside. Everything falls toward me in the end. This city just gets there first."],
          ['hero', "Gold circlet, a star in your hand. The navigators sang about a harbour girl who fell UP when the tear opened. You?"],
          ['vega', "Vega. The harbour named me for a star. Then I found the real ones. And Vael, who feeds them worlds."],
          ['hero', "The boats came home by your name. You don't get to drop anyone. Low voice, cold blade."]
        ],
        win: [
          ['sys', "Nyra sings the old steering song, low and cold, and the note cuts through the weight. Vega staggers."],
          ['vega', "...That song. Nobody sings that any more. Stop it. STOP it."],
          ['hero', "Somebody always will. Go back to your crown-ship, star. This city stays up."],
          ['sys', "Vega falls back into the sky. Kessen's pylons catch, and Aurelia holds."]
        ],
        lose: [
          ['vega', "Everything falls, little singer. Even you."],
          ['hero', "Again. One more verse."]
        ] },
      6: { goal: "Bring down the Hollow Crown",
        card: "Nyra goes up into the Crown with the other five saviours, gets past Itsuki on the path, and sings her winter into the six-element blow that brings Vael down.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours down out of the crown-ship. Three layers hold the rim, and six go up through the middle."],
          ['kael', "Nyra. Twice I thought you were my enemy. Today you're at my back. Don't fall behind."],
          ['hero', "I spent a year in a tank. I'm done waiting. Pyra, Gale, Brakk, Nami: with us. Up."],
          ['pyra', "Hot side's mine. Sing loud, ice girl, so I can hear where you are."],
          ['hero', "Low voice, cold blade. Isolde taught me that. ...Fine. Loud, just this once."]
        ],
        meet: [
          ['sys', "At the foot of the Crown, a man in a long black coat waits on the path. Five elements turn slowly around him."],
          ['itsuki', "Itsuki. I am the last thing between you and him. Five worlds taught me. You are six children with one each."],
          ['hero', "Six of us, and we each kept ours. Tank thirty-one doesn't step aside any more."],
          ['itsuki', "Then show me what you kept."]
        ],
        win: [
          ['sys', "Itsuki slides back across the stone, looks at the six, and steps off the path. Not beaten. Waiting to see."],
          ['sys', "Inside the crown-ship, the Convergence and Sovereign Vael stand side by side. The six go in together."],
          ['hero', "Kael's thunder, Pyra's fire, Gale's wind, Brakk's stone, Nami's tide. And my winter. All at once. NOW."],
          ['sys', "Six elements strike Vael as one. The crown-ship tips and falls into the Crater, and the door to the Beyond slams shut."],
          ['sys', "The door pulls the Legion and every champion back through it. Itsuki goes last, still looking at the six."],
          ['sys', "The morning after. Nyra walks back into the Hydro Ward, past the empty tanks, to the beds that could not run."],
          ['hero', "I promised Maren I'd come back for you. Here I am. Up, everyone, slowly. Nobody has a number today."],
          ['hero', "Subject thirty-one. Free."]
        ],
        lose: [
          ['itsuki', "Not enough. Get up, singer. The other five are still waiting for you."]
        ] }
    },

    // ---------------------------------------------------------------- ISOLDE
    isolde: {
      1: { zone: 'cryo', goal: "Break the glass of Cryo Vault 9",
        intro: [
          ['sys', "Cryo Vault 9. Halcyon keeps its Subjects colder than they have ever been. The eldest has never minded the cold."],
          ['hero', "Isolde. I kept the white falcons of the eyrie over the Frozen Harbour. The tear took them all but one."],
          ['hero', "She is made of ice now, like everything else in here. What I cannot stand is the glass."],
          ['agent', "Subject 52, step back from the door. Sedation in ten."],
          ['hero', "Ten is generous. My falcon needs three."]
        ],
        win: [
          ['hero', "Glass. Done with it. There, little one. Up. Show me the halls."],
          ['hero', "And the knight at the vault door... I know that stance. My falcons sat on his gate for twenty winters."]
        ] },
      2: { zone: 'cryo', with: 'aldric', goal: "Make Aldric see what he guards",
        meet: [
          ['aldric', "Subject 52. Return to your vault. I have no wish to hurt you."],
          ['hero', "Captain of the harbour wall. You stood under my eyrie every morning and threw scraps to my falcons."],
          ['aldric', "...The white birds on the gate. You are the falconer's girl. You are from home."],
          ['hero', "You have guarded my vault for a year, Captain, and never once looked in."],
          ['aldric', "I was told the Subjects were protected. That was the wall I held."],
          ['agent', "Sir Aldric, stand aside. Subject 52 is reassigned to the feed lines. Director's order."],
          ['aldric', "The Director's word is that she is protected. Nobody passes my wall to say otherwise."]
        ],
        win: [
          ['aldric', "Reassigned. To the feed lines. What is in the feed lines, falconer?"],
          ['hero', "Go and look, Captain. There is a girl on the Night Ward who will show you."],
          ['aldric', "Then I will look. Until I know, no one takes you."],
          ['hero', "Good wall. My falcons always liked you."]
        ] },
      3: { zone: 'icehouse', rival: 'brann', goal: "Settle winter with Brann",
        meet: [
          ['brann', "So. The bird-woman who says winter is hers. Came north at last."],
          ['hero', "You invited me. I came quietly. You are the one who shouts."],
          ['brann', "Winter in Vharra had bears in it. I am the last. Winter answers to me."],
          ['hero', "Winter answers no one. But it listens to whoever is quietest. Shall we find out?"]
        ],
        win: [
          ['brann', "Hah! Frost in my beard and a bird on my head. Fine. Winter listens to you."],
          ['hero', "It listens to both of us. You only have to stop shouting at it."],
          ['brann', "Come north again. Bring the bird. We drink, then we argue."]
        ],
        lose: [
          ['brann', "Warm up, bird-woman. Then come back and lose properly."]
        ] },
      4: { zone: 'noble', goal: "Fly the signal to rise",
        card: "Isolde flies her ice falcon to every ward as the signal to rise; the knights turn, and Pell names the copy behind the war: Rue.",
        intro: [
          ['sys', "The Noble Ring. Every screen loops the same feed: a white-haired Deepline boy opening the Sump's vents on the labs."],
          ['agent', "Deepline has attacked the Sky! The Proving Hall marches on the Skylift at dawn!"],
          ['hero', "My falcon watches that feed and never stirs. She stirs at anything alive. That is not a boy."],
          ['nyra', "The wards are ready, Isolde. They're waiting for your bird."],
          ['hero', "Then up, little one. Every ward, every window. Tell them: rise."]
        ],
        win: [
          ['hero', "Every ward rose on the signal. And the knights... Aldric turned them. Good wall."],
          ['sys', "From the Pit comes Pell's word, and Kiri flies it to the Crater: the faceless one is Rue. Rue runs."],
          ['hero', "A face with nothing inside. Halcyon sold us a copy and called it war. My falcon knew. Now, the Spire."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Keep the sun over the Skyport",
        card: "Corvin, Vael's champion from a dead world, puts out the sun over the Skyport; his crows go for Isolde's falcon, and she drives him back to the crown-ship.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport. A gaunt stranger in a feathered hood lifts his arms, and ten thousand crows put out the sun."],
          ['hero', "Crows. Of course it is crows. Up, little one. Stay close."]
        ],
        meet: [
          ['corvin', "Falconer. I have read your sky's omen. It ends today. The crows only came to watch."],
          ['hero', "Your crows just went for my bird. Nobody touches my bird."],
          ['corvin', "My world ended under an engine like his. I watched. Now I serve the ending, and it does not end me."],
          ['hero', "So you ran to the one who did it. My falcons would starve before they did that. Hold still."]
        ],
        win: [
          ['sys', "The ice falcon stoops through the black wings, straight and certain, and rakes the hood from Corvin's eyes."],
          ['corvin', "...The omen did not show me a bird. It will. Next time."],
          ['hero', "There is no next time. Take your crows back to your master. The sun stays."],
          ['sys', "Corvin and his crows lift away toward the crown-ship. The light comes back over the Skyport."]
        ],
        lose: [
          ['corvin', "The crows have landed, falconer. Time to stop flying."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Isolde holds the Crater rim while Nyra and the other saviours go up, then stands in Itsuki's way with her falcon until the crown-ship falls.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours down from the crown-ship, rank on rank. The three layers hold the rim."],
          ['sys', "Six go up through the middle of it, toward the Crown. Nyra is one of them."],
          ['nyra', "Isolde. Will you watch me?"],
          ['hero', "No, chick. I will be busy. You fly it yourself. Up, little one. Keep the rim clear for them."]
        ],
        meet: [
          ['sys', "Halfway up, a man in a long black coat turns and comes back down the path after the six."],
          ['itsuki', "Falconer. They are past me. I am going after them. Step aside."],
          ['hero', "You put Brann on the sand in the Dunes. That man never stops shouting. He has stopped. You go nowhere."],
          ['itsuki', "Then hold me, if you can. Not many have."]
        ],
        win: [
          ['sys', "Ice and talon, over and over. Itsuki looks up at the Crown, then at Isolde, and turns back up the path."],
          ['itsuki', "Long enough. You held me long enough, falconer. That is rare."],
          ['sys', "From the rim, Isolde watches the crown-ship tip and fall into the Crater. The door to the Beyond slams shut."],
          ['sys', "It pulls the Legion and every champion back through. The crows go first. Itsuki goes last."],
          ['hero', "She flew it herself. Of course she did."],
          ['sys', "The morning after. Isolde climbs to the top of the Skyport, where the wind smells of the harbour's old sky."],
          ['hero', "Home can wait a little. Up, little one. Show me this city from above, now that it is ours."],
          ['hero', "My falcon never misses."]
        ],
        lose: [
          ['itsuki', "Fast bird. Slow falconer. Again."]
        ] }
    },

    // ---------------------------------------------------------------- GALE
    gale: {
      1: { zone: 'stacks', goal: "Ride the updraft up the Stacks",
        intro: [
          ['sys', "The sky over Vharra tears. A kite goes up through the violet. The boy holding the other end goes down."],
          ['sys', "Vent Stack Four, Deepline. A thousand metres under Aurelia. He falls the whole way, and does not break."],
          ['hero', "Ow. Okay. Gale, ridge-runner of Vharra, still in one piece. Sora went UP. So I go up."],
          ['agent', "Torn-through in the stack! Power reading off the chart. Net him!"],
          ['hero', "Net the wind? Good luck with that."]
        ],
        win: [
          ['hero', "Feel that? Hot air, going up. The whole stack breathes."],
          ['hero', "Updraft, take me home. Hang on, Sora. Big brother's coming."]
        ] },
      2: { zone: 'skylift', with: 'sora', goal: "Hold the Skylift with Sora",
        meet: [
          ['sora', "GALE?! You... you fell! I saw you fall!"],
          ['hero', "Down a thousand metres and back up on the wind. Took me a while to find the right towers."],
          ['sora', "And now you're going to hover. I can feel it already."],
          ['hero', "I'm going to hover so hard. Who's the one with the paper bird?"],
          ['kiri', "Kiri. From the steppe too. We carry the letters Halcyon wants unsent. You fly?"],
          ['hero', "Fly? I'm the wind's favourite. Count me in."],
          ['agent', "Unlicensed flyers on the Skylift cables. Bring them down!"]
        ],
        win: [
          ['kiri', "Three flyers, every tower in Aurelia. That's not a delivery run. That's a post. The Paper Post."],
          ['sora', "Fine. He's in. But he doesn't get to follow me on every run."],
          ['hero', "Every run. Every single one."]
        ] },
      3: { zone: 'milezero', rival: 'tarn', goal: "Race number twelve: beat Tarn",
        meet: [
          ['tarn', "Race twelve. Mile Zero to the Crater rim. And no wind this time, flyboy."],
          ['hero', "No wind? The wind's the only reason I bother running."],
          ['tarn', "I walked nine hundred miles in front of the tear. On my feet. That's running. You're cheating."],
          ['hero', "Eleven races, eleven arguments. Let's skip the race and settle it the short way."]
        ],
        win: [
          ['tarn', "Fine. FINE. Fast. Still cheating."],
          ['hero', "Twelve races, twelve arguments. You love it."],
          ['tarn', "Thirteen. Next month. Bring your own legs."]
        ],
        lose: [
          ['tarn', "Legs beat wind. Write it down, flyboy."]
        ] },
      4: { zone: 'noble', goal: "Fly the plan to every ward",
        card: "Gale flies the uprising's plan to every ward before the Proving Hall moves; Kiri flies Pell's word to the Crater, and the four banners start up the Spire.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Halcyon's screens loop the feed: a Deepline boy opening the Sump's vents on the labs."],
          ['kiri', "Down below they say Nyra led the drills in. I took a letter from Nyra that same hour, up here. Someone's lying with faces."],
          ['hero', "Then we fly the truth faster than they can lie. Every ward gets the plan before the Proving Hall moves."],
          ['sora', "High towers are mine. Low wards are yours. Don't follow me!"],
          ['hero', "Wouldn't dream of it. ...Much."]
        ],
        win: [
          ['hero', "Every ward had the plan. Every one of them rose on time. The Paper Post never misses a tower."],
          ['sys', "Kiri carries Pell's word to the Crater: the faces were Rue's. With two Kaels in sight, Rue runs."],
          ['hero', "Fake face, fake war. Four banners, four sides of the Spire. I'm taking the windy one."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Hold the Skylift cars on the wind",
        card: "Mika, a champion of Vael who never comes down, cuts the Skylift cables; Gale holds the swinging cars on the wind and throws her off the last cable.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger in indigo cuts the cables one by one, and the Hollow Legion climbs down what is left."],
          ['hero', "Cars full of people, swinging over nothing. Okay, wind. Big job."]
        ],
        meet: [
          ['mika', "Little wind. You can't hold them all. Let them fall. Everything here falls, and nobody comes back up."],
          ['hero', "I fell a thousand metres once and came back up. These people get the express."],
          ['mika', "Mika. Vael promised me a world with no ground in it. This one first. Then I never come down."],
          ['hero', "The wind says up. And it picked me."]
        ],
        win: [
          ['sys', "Gale holds every car on a column of wind and throws Mika off the last cable, end over end into the sky."],
          ['mika', "...You're stubborn, little wind. The crown-ship will catch me. It always does."],
          ['hero', "Then tell it the cars are full and the wind's busy. Everybody up, everybody safe."]
        ],
        lose: [
          ['mika', "Down you go, little wind."]
        ] },
      6: { goal: "Bring down the Hollow Crown",
        card: "Gale goes up into the Crown with the other five saviours, gets past Itsuki on the path, and puts the wind into the six-element blow that brings Vael down.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours out of the crown-ship like a waterfall. Six go up through the middle of it."],
          ['sora', "High route's mine. Don't foll- ...No. Today you go up. I hold the rim. Go."],
          ['hero', "Huh. No hovering. Okay. Kael, Nyra, Pyra, Brakk, Nami: the wind's carrying us. Hang on."],
          ['brakk', "Stone does not fly, wind boy."],
          ['hero', "It does today."]
        ],
        meet: [
          ['sys', "At the foot of the Crown, Itsuki waits on the path. The wind around Gale dies, and around Itsuki it rises."],
          ['itsuki', "Wind. I learned it on another world. Yours is young. Step aside, all six of you."],
          ['hero', "You put Tarn on the sand in the Dunes. He'll never let me hear the end of who paid you back."],
          ['itsuki', "Then let's give him something to argue about."]
        ],
        win: [
          ['sys', "Itsuki skids back to the edge of the path and lowers his hands. He lets the six pass. He does not look beaten."],
          ['sys', "Inside, the Convergence and Sovereign Vael wait side by side. Six walk in together."],
          ['nami', "Water. Kael, thunder. Pyra, fire. Brakk, stone. Nyra, sing. Gale... everything you've got."],
          ['hero', "Updraft... and DOWN! All six, one blow!"],
          ['sys', "Six elements hit Vael as one. The crown-ship falls into the Crater, and the door to the Beyond slams shut."],
          ['sys', "The door pulls the Legion and every champion back through it, Mika first and Itsuki last."],
          ['hero', "Next morning Sora lands first. Bando gets his kite, Tarn gets race thirteen, and my sister gets hovered at. Forever."],
          ['hero', "The wind picked me. Not you."]
        ],
        lose: [
          ['itsuki', "Wind is young. You'll learn. Get up."]
        ] }
    },

    // ---------------------------------------------------------------- ALDRIC
    aldric: {
      1: { zone: 'armoury', goal: "Hold the Proving Hall",
        intro: [
          ['sys', "The Proving Hall, where the Director's champions are made. Subject 12 has never once been moved."],
          ['hero', "I am Aldric, captain of the harbour wall. The wall is gone. The oath is not: I stand between harm and the people."],
          ['director', "My finest knight. Trial forty, Sir Aldric. Show my guests what a wall looks like."],
          ['hero', "As you command, Director. Send them."]
        ],
        win: [
          ['director', "Flawless. The Subjects sleep safely because men like you stand guard."],
          ['hero', "The guests applaud. But the carts from the wards go down to the feed lines full, and come back empty."],
          ['hero', "I hold a wall for a word. I should know what the word is worth."]
        ] },
      2: { zone: 'enginecore', with: 'vesper', goal: "See the feed lines with Vesper",
        meet: [
          ['vesper', "Knight. You asked about the carts. Don't ask. Look."],
          ['hero', "You are the one from the Night Ward. Seventy-seven. You lit the lamps on my sea wall, once."],
          ['vesper', "Every dusk. You never saw me. Look down there."],
          ['hero', "...Grey shapes on the feed lines. Breathing. Those are Subjects. Those are the ones I was guarding."],
          ['vesper', "Husks. What the Engine leaves. That's your Director's word, knight."],
          ['agent', "Intruders on the feed lines! ...Sir Aldric? Sir, step away from the Subject."]
        ],
        win: [
          ['hero', "I swore to stand between harm and the people. I have been standing in the wrong place."],
          ['vesper', "So move."],
          ['hero', "I will. Not tonight, and not alone. When I turn, every knight in the Hall turns with me."]
        ] },
      3: { zone: 'skyport', rival: 'tor', goal: "Hold the line against Tor",
        meet: [
          ['tor', "So you're the knight in the sky who holds a line. I'm Tor. Nothing has ever got past me."],
          ['hero', "Nor me. Halcyon sent me to test you. I came to see a wall worth the name."],
          ['tor', "Then plant your feet. One of us moves."],
          ['hero', "Or neither. Let us find out."]
        ],
        win: [
          ['tor', "You hit like a gate closing. I'm still standing, mind. Just... further back."],
          ['hero', "Two walls, and neither truly gave. At home we would have stood side by side."],
          ['tor', "Then let's both step forward. Together. When your Hall turns, knight, the Village gate stands with you."]
        ],
        lose: [
          ['tor', "Nothing gets past me. Not even a good knight."]
        ] },
      4: { zone: 'noble', goal: "Turn the knights around",
        card: "Aldric turns the Proving Hall around on the Ring, then holds the door of Pylon Chamber Six while Kessen reroutes the pylons by hand and Aurelia holds.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a white-haired Deepline boy opening the Sump's vents on the labs."],
          ['director', "Deepline has struck at us. The Proving Hall marches. Sir Aldric, lead them down."],
          ['hero', "I saw that boy's face, Director. I also saw your feed lines. One of the two is a lie, and I know which."],
          ['vesper', "The knights are behind you, Aldric. Tell them what you saw."],
          ['hero', "Knights of the Hall! We swore to stand between harm and the people. Turn around. Harm is behind us."]
        ],
        win: [
          ['hero', "The Hall has turned. My oath to the Director is broken. The older one stands."],
          ['sys', "Pell names the face behind the war: Rue. At the Spire, Halcyon cuts the pylons to drop the city."],
          ['kessen', "Pylon Chamber Six. I can reroute them by hand. Hold that door, captain. Let no one through."],
          ['hero', "Nobody passes. ...The city dropped one floor, and holds. Now, the Engine Core."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Hold the floor of a falling city",
        card: "Vael's champion Vega drags Aurelia down from Pylon Chamber Six; Aldric holds the floor and the door against her until she falls back to the crown-ship.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "Pylon Chamber Six again. A stranger with a star in her palm walks in, and Aurelia lurches toward her."],
          ['hero', "I held this door for Kessen once. I will hold it again. Nobody touches her pylons."]
        ],
        meet: [
          ['vega', "Captain of a harbour wall. I know your harbour. I fell out of it, upwards, the night it tore."],
          ['hero', "Then you know what a wall is for. Standing between harm and the people."],
          ['vega', "Everything falls toward me. Walls, cities, knights."],
          ['hero', "Then I will be the one thing that does not."]
        ],
        win: [
          ['sys', "Aldric holds the floor under the whole weight of her star, and his blade drives Vega back to the chamber door."],
          ['vega', "...Stubborn wall. Vael will drop this city on you himself."],
          ['hero', "Let him come. Kessen, the pylons. I have the floor."],
          ['kessen', "Holding. One floor down, and holding. Thank you, captain."]
        ],
        lose: [
          ['vega', "Kneel, knight. Gravity always wins."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Aldric's knights hold the Crater rim while the six go up; when Itsuki comes down after them, Aldric plants his feet on the path and holds him.",
        intro: [
          ['sys', "The Crater. The Hollow Legion comes down from the crown-ship, rank on rank. The three layers form one line on the rim."],
          ['hero', "Knights. One more wall. Every soul behind us is a soul we swore to."],
          ['sys', "Six go through the line and up toward the Crown. The harbour girl from the tanks is one of them."],
          ['hero', "Go, Nyra. The wall holds behind you. Nobody follows you up."]
        ],
        meet: [
          ['sys', "A man in a long black coat comes back down the path after the six. The Legion parts for him."],
          ['itsuki', "A knight. You plant your feet well. They have gone up, and I am going after them. Step aside."],
          ['hero', "I have never once stepped aside for harm. You will not be the first."],
          ['itsuki', "Good. I hoped someone here would say that."]
        ],
        win: [
          ['sys', "Blow after blow, and the knight does not move. Itsuki looks up at the Crown, then turns and climbs back toward it."],
          ['itsuki', "You held. Long enough. Keep your feet, knight."],
          ['sys', "From the rim, the knights watch the crown-ship fall into the Crater. The door to the Beyond slams shut."],
          ['sys', "It pulls the Legion and every champion back through. Itsuki goes last, with a nod down at the knight."],
          ['hero', "We stood between. At last. Every one of us."],
          ['sys', "The morning after. Aldric walks the wards under Vesper's lamps. His knights carry beds now, not blades."],
          ['hero', "A falcon on the gate and the Subjects walking free. A wall again. A better one."],
          ['hero', "My oath is kept."]
        ],
        lose: [
          ['itsuki', "A good wall. Walls fall. Get up."]
        ] }
    },

    // ---------------------------------------------------------------- PYRA
    pyra: {
      1: { zone: 'furnace', goal: "Burn your way out of the Burn Ward",
        intro: [
          ['sys', "The Burn Ward. For six weeks, Halcyon's furnace has run on one girl from the Frozen Harbour."],
          ['hero', "Pyra. At home there was a blue forge that never went out. Here there's a bottle, and I'm in it."],
          ['elixa', "Week seven, Subject 44. Today we try a second colour. Hold still, this will be interesting."],
          ['hero', "Interesting. Sure. Here's something interesting: the bottle's cracking."],
          ['agent', "Temperature spike in the Burn Ward! Contain 44!"]
        ],
        win: [
          ['hero', "Burned the Burn Ward. Funny how that works."],
          ['hero', "There's a girl down the hall with ice in her hair who can't stand up. Guess I'm carrying her. Hang on, Nyra."]
        ] },
      2: { zone: 'core', with: 'ashka', goal: "Follow your fire to the Core Sump",
        meet: [
          ['sys', "Pyra's fire runs down the vents, all the way to the Core Sump. Something at the bottom burns back."],
          ['ashka', "Who sent fire down my vents? ...You. You burn like home."],
          ['hero', "Pyra. Subject 44, ex. I carried a girl out through my own fire tonight, and the fire kept going. To you."],
          ['ashka', "Ashka. Subject 60. Half of Deepline is warm because I'm chained down here. A year of it."],
          ['hero', "I can't melt those chains. I just tried. ...I hate that."],
          ['ashka', "Nothing melts them. But I can still fight inside them. Halcyon's coming down the stairs."]
        ],
        win: [
          ['ashka', "You fight like a forge with the doors open. Like a sister."],
          ['hero', "Then that's what you are. I'll come back with something that breaks chains. Promise."],
          ['ashka', "Keep burning up there. I'll feel it through the pipes."]
        ] },
      3: { zone: 'ballast', rival: 'kestra', goal: "Fight twelve: settle it with Kestra",
        meet: [
          ['kestra', "There she is. Walks out of the Burn Ward in a phoenix and thinks it's hers."],
          ['hero', "It came out of my fire. It's mine. Eleven fights, and I'm winning, by the way."],
          ['kestra', "My family danced the phoenix under this city for a hundred years. Fight twelve. Here, where it's hot."],
          ['hero', "Hot? Oh, honey. Hot is my whole thing."]
        ],
        win: [
          ['kestra', "...Fine. Twelve to you. The phoenix question stays open."],
          ['hero', "It's a bird, Kestra. It's big enough for two."],
          ['lin', "Then please stop setting the beams on fire while you share it."]
        ],
        lose: [
          ['kestra', "Sit down, matchstick. Thirteen whenever you like."]
        ] },
      4: { zone: 'noble', goal: "Burn the Proving Hall's gates",
        card: "Pyra burns down the gates Halcyon shut on the Ring, Pell names the borrowed face behind the war, and the Director waits at the Engine Core.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen shows a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "Ashka saw that boy at the vents from her chains. She says he didn't sweat. In the Sump. Nobody doesn't sweat in the Sump."],
          ['agent', "The Proving Hall marches on Deepline! Shut the gates, nobody leaves!"],
          ['hero', "Gates? Cute. Stand back, everyone. This is the part I'm good at."]
        ],
        win: [
          ['hero', "Gates gone. The knights are coming out, and they're facing the right way. That's Aldric's doing."],
          ['sys', "Pell, caught at the Pit, names the face: Rue. At the Crater she runs. Ashka was right. A copy."],
          ['hero', "Someone lit this war with a borrowed face. Next stop, the Engine Core. I'm going to find the match and snap it."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Walk into Lux's white light",
        card: "Lux, Vael's champion from a world of light, burns the Noble Ring white; Pyra walks straight into the glare with red fire and drives her off.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Noble Ring. A stranger with a crystal lance lands on the opera roof, and her light comes down white and burning."],
          ['hero', "White fire on the Ring, and Nyra's Subjects are down there. Okay. Red fire's here too, and it's in a mood."]
        ],
        meet: [
          ['lux', "Little fire. Stand aside. I carry light, and Vael says this city needs a great deal of it."],
          ['hero', "Six weeks they kept me in a bottle up here. The people I carried out are on that Ring. You don't get them."],
          ['lux', "White is clean. Nothing left to bottle. Nothing left at all."],
          ['hero', "Light's for seeing by, sunshine. Not for burning people blind. Let me show you hot."]
        ],
        win: [
          ['sys', "Pyra walks straight into the white light, red fire on white, and drives Lux off the opera roof."],
          ['lux', "...You burn too hot for my light. I'll bring more."],
          ['hero', "Bring your whole crown-ship. I've got thick skin and a short temper."],
          ['sys', "Lux rises back toward the crown-ship. Behind her, the Ring is scorched, and standing."]
        ],
        lose: [
          ['lux', "Too dim, little fire. Fade."]
        ] },
      6: { goal: "Bring down the Hollow Crown",
        card: "Pyra goes up into the Crown with the other five saviours, out-burns Itsuki on the path, and puts the fire into the six-element blow that brings Vael down.",
        intro: [
          ['sys', "The Crater. Sky, Surface and Deepline on one rim, and the Hollow Legion pouring down out of the crown-ship."],
          ['ashka', "Go up, sister. I'll hold the rim. The core burns hotter than anything in there."],
          ['hero', "I know. Kael, Nyra, Gale, Brakk, Nami. Six of us. Somebody try to keep up with me."],
          ['nyra', "I remember who carried me out of the Burn Ward, Pyra. Today I carry the song."],
          ['hero', "Deal. Hot side's mine."]
        ],
        meet: [
          ['sys', "At the foot of the Crown, Itsuki waits on the path. A small flame turns in his palm, perfectly still."],
          ['itsuki', "Fire. I learned it first, on another world. Yours is wild. Mine isn't. Step aside."],
          ['hero', "Wild's the whole point. Nobody's bottling this one."],
          ['itsuki', "Then let's see whose fire is hotter."]
        ],
        win: [
          ['sys', "Itsuki's flame gutters. He steps back off the path, almost smiling, and lets the six go in."],
          ['sys', "Inside the crown-ship, the Convergence and Sovereign Vael stand together. Six walk in to meet them."],
          ['hero', "Brakk, stone. Nami, water. Gale, wind. Kael, thunder. Nyra, sing. And fire. All of it. Now!"],
          ['sys', "Six elements hit Vael as one. The crown-ship falls into the Crater, and the door to the Beyond slams shut."],
          ['sys', "The door drags back the Legion and every champion. Lux's white light goes with them. Itsuki is the last through."],
          ['sys', "The morning after. Pyra lights the old Burn Ward furnace again. This time it bakes bread."],
          ['hero', "Ashka's on the Crater rim, watching the sky. Kestra wants fight thirteen. Elixa's still on the list. ...Lower down."],
          ['hero', "Too hot for you?"]
        ],
        lose: [
          ['itsuki', "Wild fire burns out. Get up and burn again."]
        ] }
    },

    // ---------------------------------------------------------------- YARA
    yara: {
      1: { zone: 'range', goal: "Turn the Firing Gallery around",
        intro: [
          ['sys', "The Firing Gallery. A target a mile out over the clouds. Subject 57 has never missed one."],
          ['hero', "I'm Yara. I lit the lamp on the sea wall, so the ships could find home. Halcyon says this is the same job."],
          ['agent', "Target at one mile, heading for the Skylift. Fire, 57."],
          ['hero', "Wait. That's not a ship. Those are people, hanging on to a scrap of sail. Runaways from the wards."],
          ['agent', "They're Subjects. Fire, or you take their place."],
          ['hero', "Lamps bring people home. They don't knock them out of the sky. I'll take my chances."]
        ],
        win: [
          ['hero', "The skiff made the Skylift. Every one of them."],
          ['hero', "How many of my mile-away targets were never ships? ...I'll count them later. All of them."]
        ] },
      2: { zone: 'saloon', with: 'jax', goal: "Cover the runaways with Jax",
        card: "Yara follows the runaways down to the Surface, where Jax holds the Long Bar's door; ten paces or a mile, they keep Halcyon's recovery team off them.",
        meet: [
          ['sys', "The Long Bar at Mile Zero. The runaways rode the Skylift down and ran for it. Halcyon's recovery team followed."],
          ['jax', "Easy with that bow, Aurelia. You're the one who wouldn't shoot. The whole skiff's drinking on your account."],
          ['hero', "Yara. I lit the lamp on our sea wall, back home. Those people are mine to bring in."],
          ['jax', "Jax. Nobody's anybody's in my bar. But I'll take the near ones. You take anything past ten paces."],
          ['hero', "Past ten paces is everything worth shooting."],
          ['jax', "Then we'll argue after. Here they come."]
        ],
        win: [
          ['jax', "Fine shooting. At a mile. Up close you'd be dead twice, and I'd have had to watch."],
          ['hero', "And at a mile you missed every one. Call it a draw?"],
          ['jax', "Nobody buys the drinks. Suits me. Go on home, lamp-girl. Your runaways are safe at my bar."]
        ] },
      3: { zone: 'scrapton', rival: 'hart', goal: "Settle the bet with Hart",
        meet: [
          ['hart', "Yara. The bet's been running two years. Bow against spear, Rust Flats, no caravan to guard."],
          ['hero', "A bow reaches further, Hart. That's the whole bet."],
          ['hart', "A bow has never stopped a charge. Keep your distance. I'll keep it for you."],
          ['hero', "Then charge. Every step you take toward me, my arrows hit harder."]
        ],
        win: [
          ['hart', "...I never got close. Not once. Fine. The bow reaches further."],
          ['hero', "Settled. You owe me a drink, and Jax owes me two."],
          ['hart', "Jax will say it wasn't ten paces. Good luck collecting."]
        ],
        lose: [
          ['hart', "Close enough to touch. That's a spear's distance, Yara. Again?"]
        ] },
      4: { zone: 'noble', goal: "Shoot the length of the Ring",
        card: "Yara silences every Halcyon gun on the Ring with one arrow; Rue is named and runs, and at the top of the Spire the Director becomes the Convergence.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy at the vents. Deepline's runners say Nyra led their drills."],
          ['hero', "I watched that feed through my scope. The boy at the vents never blinks. Forty seconds. Nobody goes that long."],
          ['agent', "Gunners to the balconies! Anyone on the Ring without a Halcyon badge is a target."],
          ['hero', "Halcyon guns on every balcony, end to end. One line. One breath. Lamp's lit."]
        ],
        win: [
          ['sys', "One arrow, drawn a whole breath, runs the length of the Noble Ring. Every Halcyon gun on it goes quiet."],
          ['hero', "Clear. The Subjects can cross. And Pell named the face at the Pit: Rue. At the Crater she ran. I knew it."],
          ['sys', "At the top of the Spire, the Director steps into his Engine. What comes out is the Convergence, and it opens the sky."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Pin Lux's light from a mile",
        card: "Lux burns the Noble Ring white for Vael; Yara, who lit the harbour's lamp to bring ships home, steps back a mile and pins her with one arrow.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Noble Ring burns white. A stranger with a crystal lance walks through the glare, and the Hollow Legion follows."],
          ['hero', "That's not a lamp. Lamps bring people home. That light is making them blind."]
        ],
        meet: [
          ['lux', "Archer. You aim with light. So do I. Mine is bigger."],
          ['hero', "I lit the lamp on our sea wall so the ships could find home. You're putting out every way home on this Ring."],
          ['lux', "Light doesn't care about home. It only shines."],
          ['hero', "Mine does. One mile. One breath. Hold still."]
        ],
        win: [
          ['sys', "Yara steps back a mile, draws for one whole breath, and the arrow pins Lux's lance to the opera roof."],
          ['lux', "...From a mile. I never saw it come."],
          ['hero', "Nobody does. Go back to your master. Tell him the lamp's still lit."],
          ['sys', "Lux tears the lance free and flies back toward the crown-ship. The white glare goes with her."]
        ],
        lose: [
          ['lux', "Your light was always too small, archer. Go dark."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Yara holds the Crater rim while the six go up; when Itsuki comes down after them, she keeps him on the path one arrow at a time until the Crown falls.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours down from the crown-ship in endless ranks. The three layers hold the rim."],
          ['sys', "Six go up through the middle of it. Pyra is one of them, still scorched from Lux's light."],
          ['hart', "Keep your distance, Yara. I'll keep it for you."],
          ['hero', "Then I'll keep theirs. Go, Pyra. Every step you climb, I'm watching the path behind you. Lamp's lit."]
        ],
        meet: [
          ['sys', "A man in a long black coat comes back down the path after the six. The arrows already in the air turn aside."],
          ['itsuki', "An archer who never misses. I learned wind on another world. It moves arrows. Step aside."],
          ['hero', "You put Jax on the sand in the Dunes. He owes me two drinks. I'm collecting for him."],
          ['itsuki', "Then shoot, and we'll see whose wind it is."]
        ],
        win: [
          ['sys', "Arrow after arrow, from a mile, from ten paces. Itsuki never reaches her. At last he turns back up toward the Crown."],
          ['itsuki', "You kept me down here long enough. They will be inside by now. Well shot."],
          ['sys', "From the rim, Yara watches the crown-ship fall into the Crater. The door to the Beyond slams shut."],
          ['sys', "It pulls the Legion and every champion back through. Itsuki goes last."],
          ['sys', "The morning after. Yara climbs the Skyport tower and lights the old beacon for the first time in a year."],
          ['hero', "Every ship, every skiff, every runaway: this way home. Jax, Hart, the drinks are on me. For once."],
          ['hero', "Meridian. Your last light."]
        ],
        lose: [
          ['itsuki', "The wind moved it. Again."]
        ] }
    },

    // ---------------------------------------------------------------- KIRI
    kiri: {
      1: { zone: 'shrine', goal: "Fold a crane and fly up the Stacks",
        intro: [
          ['sys', "The Paper Shrine, under Deepline. Folded wishes for the dead, thousands of them. A torn-through girl wakes among them."],
          ['hero', "Okay. Not the steppe. I'm Kiri, a herder's daughter from Vharra, and I have... yes. Still two of me."],
          ['hero', "Sorry, wishes. I'll fold you into something that can fly, and I'll carry you up. Every one."],
          ['agent', "Torn-through in the shrine! Bag her before she wakes up properly!"],
          ['hero', "Too late! We're both awake!"]
        ],
        win: [
          ['hero', "One crane, big enough for two Kiris and every wish in the shrine. Up the Vent Stacks we go!"],
          ['sys', "The first Deepliner ever to reach Aurelia without a ticket lands on a gold rooftop, covered in paper."]
        ] },
      2: { zone: 'slums', with: 'rook', goal: "Hold the Slums with Rook",
        meet: [
          ['sys', "The Deepline Slums. The Paper Post carries a letter Halcyon wants unsent, down to a boy with a lot of himself."],
          ['rook', "Paper girl! Kiri, right? Wait, which one of you do I sign for?"],
          ['hero', "Either. Both. Same girl, twice. Sora flies the high letters, I fold the rest and run them low."],
          ['rook', "Same! Well, I'm the same guy, like eight times. Everyone else thinks it's weird."],
          ['hero', "It's not weird. It's efficient. ...Also, there are Halcyon collectors behind you. All of them."],
          ['rook', "Great! There's more of me than them!"]
        ],
        win: [
          ['rook', "You fold, I clone, nobody gets lonely. Come back anytime, paper girl."],
          ['hero', "The Paper Post delivers to everyone. Even boys who are mostly copies of themselves."],
          ['rook', "Original, thank you. The others are copies of ME."]
        ] },
      3: { zone: 'shrine', rival: 'rue', goal: "Stay yourself against Rue",
        meet: [
          ['sys', "The Paper Shrine. A girl in a white smiling mask stands among the wishes. She has Kiri's face. Then she doesn't."],
          ['rue', "Pell says copy anyone once and you can do it better. So why do I keep getting lost in you?"],
          ['hero', "Because there are two of me, and you can only be one at a time."],
          ['rue', "A copy of a copy is no use to anyone. Hold still and be one girl."],
          ['hero', "Not a chance. Come on, both of us! Fold her in!"]
        ],
        win: [
          ['rue', "Stop... moving... I can't hold your shape. Which one is real?"],
          ['hero', "Both of us. That's the thing you can't copy. We're not pretending."],
          ['sys', "Rue's mask slips. For a moment there is nothing under it at all. Then she is gone, and the wishes settle."]
        ],
        lose: [
          ['rue', "There. Now there are three of you, and the best one is me."]
        ] },
      4: { zone: 'noble', goal: "Fly a thousand cranes over the Ring",
        card: "Kiri flies a thousand cranes of Pell's secrets over the Ring, then carries his last word to the Crater herself: the false faces were Rue, and Rue runs.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Halcyon's screens loop a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I know that trick. I fought it in the shrine. Something with no face, wearing whoever it likes."],
          ['hero', "It wore Kael up here. Rook says down below it wore Nyra and led the drills. Same smile behind both."],
          ['coda', "Then tell the Ring everything. Pell's secrets are in my ribbons. Fold them and fly them."],
          ['hero', "A thousand cranes, one secret each. Every door on the Ring. Go, go, go!"]
        ],
        win: [
          ['sys', "A thousand paper cranes land on a thousand doorsteps. The Ring reads who pays Halcyon, and for what."],
          ['sys', "A letter comes up the Skylift from the Pit. Pell, caught in his own Cat's Cradle, has named the face: Rue."],
          ['sys', "Kiri flies it to the Crater herself. Kael faces Nyra, and another Kael stands in the crowd. She shouts the name. Rue runs."],
          ['hero', "Folded, flown, delivered. Told you. Next stop, the Spire, and the Paper Post flies all four banners."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Fly through Corvin's crows",
        card: "Corvin, Vael's champion, blacks out the Skyport with his crows; Kiri, both of her, tangles them in paper cranes and drives him back to the crown-ship.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport goes dark. A hooded stranger's crows put out the sun, and the Hollow Legion lands in the black."],
          ['hero', "Dark sky, black wings. Okay, cranes. White paper shows up best at night. Let's be loud about it."]
        ],
        meet: [
          ['corvin', "Paper bird. The omen is the end of your sky. Fold yourself a grave."],
          ['hero', "I folded the wishes of the dead into a crane. They wanted to fly, not end. Who even are you?"],
          ['corvin', "Corvin. My world sent its crows to watch it end. Now they watch yours."],
          ['hero', "Then they can watch this. Both of us. Now!"]
        ],
        win: [
          ['sys', "Paper cranes tangle the crows by the hundred. Two Kiris come through the gap from two sides at once."],
          ['corvin', "...Two of you. The omen only showed one. It is wrong. It is never wrong."],
          ['hero', "It's wrong today! Back to your crown-ship, crow-man. The Post's busy."]
        ],
        lose: [
          ['corvin', "Wet paper. Torn wings. It is written."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "While the sky over the Crater burns, the Legion's last assault hits the Paper Shrine; both Kiris hold the wishes of the dead against a Siege Walker.",
        intro: [
          ['sys', "The Paper Shrine, under Deepline. Far above, the sky over the Crater burns. Down here, the Hollow Legion comes for the wishes."],
          ['hero', "The Paper Post flew every letter up to the Crater. Somebody had to stay home and guard the shrine. Two somebodies."],
          ['hero', "Okay, wishes. Nobody burns you. Fold, both of us!"]
        ],
        meet: [
          ['sys', "The shrine floor shakes. A Siege Walker shoulders through the door, and the Legion forms up behind it."],
          ['hero', "That's the big one. Paper beats rock. Probably. Let's find out!"]
        ],
        win: [
          ['sys', "The Siege Walker goes down among the cranes. Then every Legion soldier in the shrine stops at once and goes still."],
          ['sys', "A crane drops down the Vent Stacks into Kiri's hands, in Sora's writing: The sky's closed. They're gone. All of them."],
          ['hero', "Gone. ...Hear that, wishes? Quiet. Real quiet."],
          ['sys', "The morning after. Kiri folds the last wish in the shrine into a crane, and both of her carry it up into the sun."],
          ['hero', "Every wish gets delivered. That's the Post. Next stop Vharra, the day the way home opens. With a LOT of cranes."],
          ['hero', "Folded and finished!"]
        ] }
    },

    // ---------------------------------------------------------------- KESTRA
    kestra: {
      1: { zone: 'ballast', goal: "Keep the undercroft hidden",
        intro: [
          ['sys', "The Ballast Decks, the hot dark under the gold. The pylons hum. The Sky Clan dances fire where nobody looks."],
          ['hero', "Kestra of the Sky Clan. A hundred years we've danced the fire-fan here, under the nobles' feet. They never knew."],
          ['agent', "Heat bloom on the ballast deck. Something's burning down here. Sweep it."],
          ['hero', "Burning? Rude. It's dancing. ...And now it's both."]
        ],
        win: [
          ['hero', "Sweep done. Halcyon's sweep, I mean. Fire first, then the fan to make it worse."],
          ['hero', "Somebody upstairs will notice the scorch marks. Lin's going to give me the look."]
        ] },
      2: { zone: 'ballast', with: 'lin', goal: "Keep the beams from catching",
        meet: [
          ['lin', "Kestra. Three beams scorched. The city sits on those."],
          ['hero', "And I suppose you're about to give me the look."],
          ['lin', "I'm giving it now. Also: Halcyon is sending a full sweep after your heat bloom. A captain this time."],
          ['hero', "Then they get the whole dance. You keep the beams cool, I keep the fire on them."],
          ['lin', "Every fifth strike. Breathe, sister."]
        ],
        win: [
          ['hero', "Not a single beam caught. How do you do that?"],
          ['lin', "I watch the fire. You watch the enemy. Neither of us watches the score."],
          ['hero', "I always watch the score. Speaking of which... I hear there's a new phoenix in the Burn Ward."]
        ] },
      3: { zone: 'ballast', rival: 'pyra', goal: "Prove the real phoenix to Pyra",
        meet: [
          ['pyra', "Kestra. Fight twelve. You picked the hottest room in the city. Cute."],
          ['hero', "My family danced the phoenix here for a hundred years. Then you walk out of a bottle wearing one."],
          ['pyra', "It came out of my fire. It's mine. Eleven fights, and I'm winning."],
          ['hero', "Nobody agrees on that score. Today we settle it."]
        ],
        win: [
          ['pyra', "Okay. Twelve's yours. ...That dive was really something."],
          ['hero', "A hundred years of practice. The phoenix is ours. But... I suppose a phoenix can have two tails."],
          ['lin', "Two tails, one undercroft, zero burning beams. Please."]
        ],
        lose: [
          ['pyra', "Sit down, feather duster. Thirteen whenever you want."]
        ] },
      4: { zone: 'noble', goal: "Raise the undercroft into the Ring",
        card: "Kestra raises the Sky Clan out of the undercroft through the Noble Ring's floor; Rue's false faces are named, and the Hidden Clans march under their own banner.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Up above, the screens loop a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "Look at the fire on that feed. It bends round him like he isn't there. Fire doesn't bend round people. It eats them."],
          ['lin', "And Halcyon is using it to march the Proving Hall down to Deepline. Over our heads."],
          ['hero', "Over our roof, you mean. Sky Clan! A hundred years under the floor. Tonight we come up through it."]
        ],
        win: [
          ['sys', "The floor of the Noble Ring splits, and the Sky Clan rises out of the undercroft on wings of fire."],
          ['hero', "The nobles finally know who's been living under them. Their faces. Worth a hundred years."],
          ['hero', "Pell named the face, and Rue ran at the Crater. Fake face, fake war. Now the Spire, and the Clans get a banner."]
        ] },
      5: { zone: 'gallery', foe: 'mira', goal: "Burn through Mira's mirrors",
        card: "Mira, Vael's champion and a reflection out of the harbour ice, turns the Observation Gallery's glass on Aurelia; Kestra burns through every mirror to reach her.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Observation Gallery. A masked stranger touches the glass, and every pane in Aurelia turns into a mirror."],
          ['hero', "My fire, in a thousand mirrors, pointed at my own city. Oh, I don't like that."]
        ],
        meet: [
          ['mira', "Phoenix. Look. A hundred of you, and every one is mine. What you hit is only my reflection."],
          ['hero', "Then I'll burn the reflections first. A hundred years we danced in the dark under this glass. It's ours."],
          ['mira', "Glass is a door. Vael walks through it. Your city is only the room behind."],
          ['hero', "Then I'm closing the door. Fire first, then the fan to make it worse."]
        ],
        win: [
          ['sys', "Fire moths swarm the Gallery. Mirror after mirror melts, until only one Mira is left standing in the glass."],
          ['mira', "...You found the real one. Nobody finds the real one."],
          ['hero', "Fire finds everything. Back to your crown-ship, mirror. The Gallery's ours."],
          ['sys', "Mira steps into the last pane and is gone. Every window in Aurelia is just a window again."]
        ],
        lose: [
          ['mira', "You burned a reflection, phoenix. The reflection wins."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault comes down into the Ballast Decks; Kestra dances the Sky Clan's fire against a Siege Walker to keep the undercroft standing.",
        intro: [
          ['sys', "The Ballast Decks. Far off, the sky over the Crater burns. Down the cables, the Hollow Legion pours into the undercroft."],
          ['lin', "Three beams already scorched, Kestra. The city sits on those."],
          ['hero', "Then I burn the Legion, not the beams. Sky Clan! Fire first, then the fan to make it worse."]
        ],
        meet: [
          ['sys', "The deck groans. A Siege Walker climbs down out of the cables, and every hollow soldier turns behind it."],
          ['hero', "Big, slow, and made of nothing. A hundred years we danced down here. You don't get the floor."]
        ],
        win: [
          ['sys', "The Siege Walker falls burning off the edge of the deck. Then the pylons hum a new note, and the light changes."],
          ['sys', "Through the ballast vents, the far violet sky over the Crater closes like an eye. The Legion goes still."],
          ['lin', "It's over. Breathe, sister."],
          ['sys', "The morning after. The Sky Clan carries its fans up through the Noble Ring's floor, in daylight, on purpose."],
          ['hero', "No more hiding under the gold. And Pyra owes me fight thirteen. In daylight. Where everyone can watch."],
          ['hero', "Rise again? Not you."]
        ] }
    },

    // ---------------------------------------------------------------- SORA
    sora: {
      1: { zone: 'skyport', goal: "Deliver the letters past the drones",
        intro: [
          ['sys', "The Skyport. A kite the size of a sail rides the wind between the towers of Aurelia."],
          ['hero', "Sora, kite clans of Vharra! Letters for anyone who pays in bread. Halcyon hates that. Love that."],
          ['hero', "I went UP through the tear. My brother went down. I haven't touched the ground since. Not planning to."],
          ['agent', "Unlicensed flyer over the Skyport. Interceptors, take her down."],
          ['hero', "Down? Never heard of it."]
        ],
        win: [
          ['hero', "Every letter delivered. Every drone in the harbour. Not one toe on the ground."],
          ['hero', "...He's down there somewhere. Gale. He fell. I'll find him. From up here."]
        ] },
      2: { zone: 'skylift', with: 'gale', goal: "Hold the Skylift with Gale",
        meet: [
          ['hero', "That's... no. GALE?! You fell! I watched you fall!"],
          ['gale', "A thousand metres, and I rode the updraft all the way back. Took a while to find the right towers."],
          ['hero', "You're here. You're really... you're going to hover now, aren't you."],
          ['gale', "So hard. Every run. Who's your paper friend?"],
          ['kiri', "Kiri. Folder, flyer, and your sister's partner. Also: Halcyon, on the cables. Lots of them."],
          ['hero', "Brother. Partner. Kite. Let's give them a show."]
        ],
        win: [
          ['kiri', "Three flyers, every tower in the city. That's not a delivery run. That's a post. The Paper Post."],
          ['gale', "And I'm on every run."],
          ['hero', "You are NOT on every run. ...Okay. Some runs. Don't look at me like that."]
        ] },
      3: { zone: 'docks', rival: 'bando', goal: "Settle the kite story with Bando",
        card: "Bando tells all of Dockside Nine he saved Sora's kite on festival day; Sora flies down to the docks to set the story straight, without touching the dock.",
        meet: [
          ['sys', "Dockside Nine, the last wharf of the Drowned Line. A kite comes down the Skylift shaft and hangs over the cranes."],
          ['bando', "SORA! Hey, everyone, it's her! The kite girl! The one I saved!"],
          ['hero', "You did NOT save me. You reached for my kite. On festival day. While I was standing right there."],
          ['bando', "Tree, kite, little crying girl, one long arm. That's a rescue. Ask anyone. I've told them all."],
          ['hero', "Then here's a new story for them. Kite girl beats long arm. Without touching the dock."],
          ['bando', "Long arm of Deepline says: come down here and say that."]
        ],
        win: [
          ['bando', "...She never touched the dock. Not once. Okay, okay. Kite girl wins."],
          ['hero', "Say the rest. In front of everyone."],
          ['bando', "I didn't save you. ...I sort of did, though. A little."],
          ['hero', "A little. Fine. You can tell THAT one."]
        ],
        lose: [
          ['bando', "Reach beats string! That's twice I've saved you, kite girl."]
        ] },
      4: { zone: 'noble', goal: "Carry Coda's dance to every tower",
        card: "Sora flies Coda's ribbons of Pell's secrets to every tower in Aurelia while Kiri carries the name to the Crater: the false faces were Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the vents. Deepline says Nyra led the drills."],
          ['hero', "From up here you see everyone. That night Kael was in the Crusher Yard. I flew right over him. Somebody's lying."],
          ['coda', "Then carry the truth. I'm about to dance Pell's secrets out on stage. Fly them to every tower."],
          ['hero', "Every tower, every window. Gale, low route! Don't follow me!"]
        ],
        win: [
          ['sys', "A kite trailing a dancer's ribbons crosses every tower in Aurelia, and Pell's secrets go with it."],
          ['hero', "And Kiri's crane got to the Crater: Pell named the face. Rue. She ran. Told you somebody was lying."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Bring Mika down",
        card: "Mika, Vael's champion who never touches the ground, cuts the Skylift cables; Sora, who never touches it either, takes her on in the air and wins.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger with two crescent blades cuts the cables one by one, and never once touches the ground."],
          ['gale', "I've got the cars! Go get her, Sora!"]
        ],
        meet: [
          ['mika', "Kite girl. You hang off a string and call it flying. I haven't touched the ground on any world."],
          ['hero', "Neither have I, since the tear. My sky, my record. And you're cutting my brother's cables in it."],
          ['mika', "Vael promised me a world with no ground in it at all. Let go of your string and come see."],
          ['hero', "My string's tied to my brother. Mine stays. Yours I'm cutting."]
        ],
        win: [
          ['sys', "Sora's kite string wraps Mika's blades out of the air, and for one moment Mika's feet touch the Skylift roof."],
          ['mika', "...Ground. You put me on the GROUND."],
          ['hero', "First time ever? Don't worry. I won't tell anyone. Much. Now get off my sky."],
          ['sys', "Mika springs off the roof and back up toward the crown-ship, furious, and doesn't look back."]
        ],
        lose: [
          ['mika', "Up here, kite girl, no string is long enough."]
        ] },
      6: { goal: "Hold the Crater against Itsuki",
        card: "Sora lets Gale go up into the Crown with the six, holds the Crater rim from the air, and keeps Itsuki on the path with a thousand kites until the Crown falls.",
        intro: [
          ['sys', "The Crater. The Hollow Legion pours out of the crown-ship. The three layers hold the rim, and six go up the middle."],
          ['gale', "Sora. I'm going up with them. Don't follow me."],
          ['hero', "That's MY line. ...Go. For once I'll stay put. Paper Post, keep the sky over the rim clear!"]
        ],
        meet: [
          ['sys', "A man in a long black coat comes back down the path after the six. The wind turns to follow him."],
          ['itsuki', "Kite girl. I learned wind on another world. It does not need a string. Your brother is up there. Step aside."],
          ['hero', "My brother says wind doesn't need anything. It picks people. It picked us. You don't go after him."],
          ['itsuki', "Then let's see who it picks today."]
        ],
        win: [
          ['sys', "A thousand kites tangle the path. Itsuki cuts through every one, looks up, and climbs back toward the Crown."],
          ['itsuki', "Long enough, kite girl. Your brother has his chance. Keep your string."],
          ['sys', "From the air over the rim, Sora watches the crown-ship fall into the Crater. The door to the Beyond slams shut."],
          ['sys', "It pulls the Legion and every champion back through, Mika still in the air. Itsuki goes last."],
          ['sys', "The morning after. Gale lands on the rim with his hair singed, and Sora comes down to meet him. Almost."],
          ['hero', "One toe off the ground. That's as close as it gets, brother. Now stop hovering. ...No. Don't."],
          ['hero', "Never touched the ground."]
        ],
        lose: [
          ['itsuki', "Strings break. Tie a new one."]
        ] }
    },

    // ---------------------------------------------------------------- CODA
    coda: {
      1: { zone: 'noble', goal: "Dance through the Director's show",
        intro: [
          ['sys', "The Noble Ring opera. Tonight the Director's guests want a show: the star dancer against Halcyon's drones."],
          ['hero', "Coda. I learned rhythm counting the tolls of a temple bell on the Surface. Now I count for them."],
          ['pell', "Smile, my star. Every step on the beat. I'll know if you miss one."],
          ['hero', "I never miss a step, Pell. That's the problem."]
        ],
        win: [
          ['sys', "Applause. Roses on the stage. A noble leans close and whispers about the feed lines, and the ribbons remember."],
          ['hero', "Another secret for Pell's collection. A string on every step. ...One day I'll find the scissors."]
        ] },
      2: { zone: 'noble', with: 'zara', goal: "Take a seat at the House Edge",
        card: "After the opera, Coda slips Pell's strings for one night; Zara gives her a seat at the House Edge, bets on her, and they fight off Pell's collectors together.",
        meet: [
          ['sys', "The House Edge, after the opera. Coda slips Pell's strings for one night and walks into the richest card room on the Ring."],
          ['zara', "The star dancer, at my tables, without her shadow. Sit down, darling, before someone tells Pell."],
          ['hero', "Every step I take, someone holds the string. Tonight I want one step that's mine. Even if it's only to a chair."],
          ['zara', "Then that chair is yours, whenever you need it. I bet on you, star. I never lose."],
          ['hero', "Your doorman says there are men in grey outside. Pell's. Halcyon's. Both."],
          ['zara', "Then you dance, and I deal. Try not to step on the chips."]
        ],
        win: [
          ['zara', "Not one chip on the floor. You fought like nobody was holding the string."],
          ['hero', "Nobody was. One toll, push. Two, fly. I counted it myself."],
          ['hero', "Keep my seat warm, Zara. One day I won't be going back to Pell."]
        ] },
      3: { zone: 'noble', rival: 'pell', goal: "Cut Pell's strings mid-dance",
        meet: [
          ['sys', "The Noble Ring opera, mid-performance. The orchestra plays. The strings go taut."],
          ['pell', "You missed a step last night, my star. At the House Edge, of all places."],
          ['hero', "I didn't miss it. I took it. Without you."],
          ['pell', "I took you from a temple and gave you the sky. Every step you own, I paid for."],
          ['hero', "Then here's your change. Every string. Mid-dance."]
        ],
        win: [
          ['sys', "The ribbons come away in her hands: Pell's strings, cut one by one. The house holds its breath."],
          ['pell', "Cutting your strings mid-performance. How very rude."],
          ['hero', "They aren't your strings any more. They're my ribbons. And this dance is mine."]
        ],
        lose: [
          ['pell', "Back on the beat, my star. My beat."]
        ] },
      4: { zone: 'noble', goal: "Dance Pell's secrets out",
        card: "Mid-opera, Coda dances Pell's whole ledger out for the Ring to read, while Pell, caught at the Pit, names the faceless one: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Outside, the screens loop a Deepline boy opening the vents. Inside, the opera plays on."],
          ['hero', "That boy's face is a lie. Pell taught a girl with no face to wear anyone's. I carried her orders in my ribbons."],
          ['hero', "Kael's face on the vents. Nyra's face on the drills. Both of them Pell's work, and the Director's."],
          ['zara', "You've got the whole Ring watching, darling. The house is yours. Dance."],
          ['hero', "Music, please. Every secret Pell ever sent through me, on the beat, for everyone to read."]
        ],
        win: [
          ['sys', "Ribbon by ribbon, Coda spells out Pell's ledger: the faces, the drills, the vents, the pay. The Ring reads it all."],
          ['hero', "Sora's carrying it to every tower. Kiri's cranes, to every door. Nobody can say they didn't know."],
          ['sys', "From the Pit, Pell's own word: the girl with no face is Rue. At the Crater, Rue runs. The Spire is next."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Out-leap Mika on the cables",
        card: "Mika, Vael's champion, cuts the Skylift cables; Coda, who learned to leap without a net on her own, dances the cables toll by toll and out-leaps her.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger with crescent blades cuts the cables, and the Hollow Legion pours down them."],
          ['hero', "A thousand metres up, no net, cables snapping. One toll, push. Two, fly."]
        ],
        meet: [
          ['mika', "Dancer. On my world, children jump before they walk. You count your steps. How sweet."],
          ['hero', "I counted them for Pell for years. Now they're mine. And these cables are how my city gets home."],
          ['mika', "Not for long. Leap, if you can. There's no net."],
          ['hero', "There never was. Watch."]
        ],
        win: [
          ['sys', "Coda dances along the snapping cables, toll by toll, and every leap lands where Mika's blades are not."],
          ['mika', "...You never missed a step. Who taught you to leap like that?"],
          ['hero', "A temple bell and a card table. Go back to your crown-ship. This dance is mine."]
        ],
        lose: [
          ['mika', "You missed a step, little dancer."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Noble Ring opera; Coda dances its Siege Walker down on the beat, then hears Oda's bell say the sky has closed.",
        intro: [
          ['sys', "The Noble Ring opera. Far off, the sky over the Crater burns. The Hollow Legion pours in through the great doors."],
          ['hero', "The audience is still in the boxes. Nobody leaves this house hurt. Music, please. Last act."]
        ],
        meet: [
          ['sys', "The stage splits. A Siege Walker climbs up through the trapdoor, and the hollow soldiers fall into step behind it."],
          ['hero', "You walk on the beat. That's your mistake. I own the beat now."]
        ],
        win: [
          ['sys', "The Siege Walker falls across the footlights. Then every hollow soldier in the house stops mid-step and goes still."],
          ['sys', "Far below, faint through the broken roof, Oda's bell rings. Once. Coda counts it with her feet."],
          ['hero', "One toll. The sky's closed. They're gone."],
          ['sys', "The morning after. Coda takes the first Skylift car down, alone, with no string on any step."],
          ['hero', "A temple, a bell, and an old man who taught me to count. I'm coming home to count the rest."],
          ['hero', "And... curtain."]
        ] }
    },

    // ---------------------------------------------------------------- ZARA
    zara: {
      1: { zone: 'noble', goal: "Keep the House Edge's secret",
        intro: [
          ['sys', "The House Edge, the richest card room on the Noble Ring. Aurelia's nobles lose fortunes here, politely."],
          ['hero', "Zara. Deepline card sharp. Won my way up the Skylift one hand at a time. Never said what I bet on the last one."],
          ['hero', "The house's winnings go down the Skylift, quietly. Bread, medicine, lamp oil. Nobody up here asks."],
          ['agent', "Halcyon audit. Somebody's money is reaching Deepline, madam. We'll be opening the vault."],
          ['hero', "Darling, nobody opens my vault. Deal them in."]
        ],
        win: [
          ['hero', "Audit complete. Result: the house won. Tell your Director to send better players."],
          ['hero', "Lin was off tonight. Strange. She is never off. ...Let's find out where my bodyguard goes."]
        ] },
      2: { zone: 'ballast', with: 'lin', goal: "Follow Lin into the undercroft",
        meet: [
          ['sys', "Under the gold, the Ballast Decks. Zara follows her bodyguard down a stair no noble knows."],
          ['lin', "You followed me. Of course you did. You see everyone."],
          ['hero', "And now I see you. Sky Clan. You took my job to keep an eye on the Noble Ring."],
          ['lin', "The House Edge sees everyone. The Clan needed eyes there. I would still have stood behind your chair."],
          ['hero', "Darling, that's the best answer you could give. Who's coming down that stair?"],
          ['lin', "Halcyon. Your auditors followed you. Every fifth strike, Zara. Try to keep up."]
        ],
        win: [
          ['hero', "The house keeps its winnings, and its bodyguard. Watch the Ring for your Clan. Just tell me what you see."],
          ['lin', "Everything. Starting with this: your money reaches Deepline, and Halcyon knows."],
          ['hero', "Then it's time to raise the stakes."]
        ] },
      3: { zone: 'saloon', rival: 'jax', goal: "Settle the old hand with Jax",
        meet: [
          ['sys', "The Long Bar at Mile Zero. A card table, two chairs, and a revolver that has never once been put away."],
          ['jax', "Zara. Top hat, red waistcoat. Money looks good on you."],
          ['hero', "Jax. You still deal off the bottom when you're losing."],
          ['jax', "You still leave without paying when you're winning. Some of us remember how that ended."],
          ['hero', "We don't discuss it. Except across a table, armed. Deal."]
        ],
        win: [
          ['jax', "...Jackpot. Of course it was. You always did draw the ten."],
          ['hero', "I stacked the deck, darling. You taught me how."],
          ['jax', "Then we're even. Drinks are on the house. Your house."]
        ],
        lose: [
          ['jax', "Six shots, sweetheart. Still counting the first five?"]
        ] },
      4: { zone: 'noble', goal: "Bet the House on the uprising",
        card: "Zara bets every coin in the House Edge on the uprising and pays for every door, stair and kite; Pell names the face behind the war: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen loops a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I read faces for a living, darling. That boy has a face and nothing behind it. Like a card with no pips."],
          ['lin', "Deepline's runners say Nyra led the drills down there. Same blank behind the eyes."],
          ['hero', "Someone's dealing from a stacked deck. Fine. Every coin in the House, on the uprising."]
        ],
        win: [
          ['hero', "The House paid for the Subjects' doors, the Clan's stairs and every Paper Post kite. All in. Best bet I ever made."],
          ['sys', "From the Pit, Pell's own word: the faceless one is Rue. At the Crater, she runs."],
          ['hero', "Told you. A card with no pips. Now, darlings: the Spire."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Luck against omen: face Corvin",
        card: "Corvin, Vael's champion, reads the end of the sky and blacks out the Skyport; Zara plays him for it, omen against luck, and draws the last card.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport goes black under ten thousand crows. A hooded stranger stands in the middle of them, reading the dark."],
          ['hero', "A dark sky and long odds. My favourite table."]
        ],
        meet: [
          ['corvin', "Gambler. The omen is read. The sky ends. There is no luck in a written ending."],
          ['hero', "I read faces, darling. Yours watched a world end once. And now you work for the house that ended it."],
          ['corvin', "The house always wins. I chose to sit on its side of the table."],
          ['hero', "Then you've never met mine. Let's play."]
        ],
        win: [
          ['sys', "The last card is the jackpot. Coins, cards and crows scatter across the Skyport, and Corvin goes down."],
          ['corvin', "...I did not read this. The omen never shows the gambler."],
          ['hero', "Nobody reads luck, darling. Back to your master. Tell him the House is closed to him."]
        ],
        lose: [
          ['corvin', "The house has fallen, gambler. Omen fulfilled."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault comes for the House Edge and everyone hiding in it; Zara deals with its Siege Walker, Lin behind her chair, until the sky closes.",
        intro: [
          ['sys', "The House Edge. Far off, the sky over the Crater burns. Half the Noble Ring is hiding under Zara's card tables."],
          ['lin', "Legion on the stairs, Zara. A lot of it."],
          ['hero', "Then the House is open, darlings. Everybody in. Nobody out but the Legion."]
        ],
        meet: [
          ['sys', "The doors come off their hinges. A Siege Walker ducks into the card room, and the chandeliers shake."],
          ['hero', "Big stack, no face. Lin, behind my chair. Deal me in."]
        ],
        win: [
          ['sys', "The Siege Walker goes down across the high-stakes table. Then the Legion on the stairs stops, every one, and stands still."],
          ['sys', "A paper crane slides under the door, in Kiri's fold: the sky over the Crater is closed. They're gone."],
          ['lin', "You won, Zara."],
          ['hero', "Of course I did, darling. Pour something for everyone. Put it on the House."],
          ['sys', "The morning after. Zara counts what's left in the vault and sends every coin of it down the Skylift."],
          ['hero', "Jax will say I finally paid my tab. Tell him not to get used to it."],
          ['hero', "The house always wins."]
        ] }
    },

    // ---------------------------------------------------------------- MAREN
    maren: {
      1: { zone: 'hydro', goal: "Keep your patients off the Engine",
        intro: [
          ['sys', "The Hydro Ward. Subject 21 is the doctor of every other Subject, because she is better at it than Halcyon's staff."],
          ['hero', "Maren. At home I sat with fevered children until the fever went out with the tide. Here I sit with Subjects."],
          ['nyra', "Maren... they're coming for beds four to nine. The carts. For the feed lines."],
          ['agent', "Subject 21, step aside. Beds four through nine are past use. Engine's orders."],
          ['hero', "These are my patients. Nobody is past use while I'm still in the room."]
        ],
        win: [
          ['hero', "Beds four through nine, breathing. That's enough for tonight."],
          ['hero', "I took Halcyon's job to stay in the room with them. I'll stay, until every one of them can walk out."]
        ] },
      2: { zone: 'choir', with: 'nami', goal: "Pull Nami out of the Drowned Line",
        meet: [
          ['sys', "The Drowned Line. Halcyon sends its doctor with a collection team. A wall gives way, and a woman goes under."],
          ['hero', "She's been under too long. No. No, sea, you don't get her. Give her BACK."],
          ['nami', "...Cold. Who... who was arguing with the sea?"],
          ['hero', "Your doctor. Maren. Breathe. You were gone, and now you're not."],
          ['agent', "Good, she's alive, and full of power. Bag her for the Spire."],
          ['nami', "...I don't think so."]
        ],
        win: [
          ['nami', "You pulled me out, then fought your own team for me. I'm Nami. I owe you my life."],
          ['hero', "You owe me rest and fluids. I have to go back up. There's a girl in a tank who keeps forgetting to breathe."],
          ['nami', "Then I'll guard the doctor's back, every time she comes down here. That's the debt."]
        ] },
      3: { zone: 'market', rival: 'vesna', goal: "Face Vesna in the Neon Market",
        meet: [
          ['sys', "The Neon Market, Red Quarter. Vesna keeps the Red Ledger, and the Ledger has Maren's patients in it."],
          ['vesna', "The Tide Doctor. You've been giving blood away for free. It's very bad for business."],
          ['hero', "You charge Deepline for its own blood. I call that a sickness."],
          ['vesna', "I call it bookkeeping. Every debt is paid in red, doctor. Even yours."],
          ['hero', "Then let's settle my account. The tide's coming in."]
        ],
        win: [
          ['vesna', "...You heal while you hit. How very annoying."],
          ['hero', "Strike their names out of your ledger, Vesna. The ones who can't pay."],
          ['vesna', "One page, then. Not the long one. That page is Halcyon's, and I mean to collect it."]
        ],
        lose: [
          ['vesna', "Your account is overdrawn, doctor."]
        ] },
      4: { zone: 'noble', goal: "Hold the door while the Subjects run",
        card: "Maren holds the ward door while every Subject runs for the Ring, and word comes from the Pit that the false faces were Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the Sump's vents. There are burns in every ward."],
          ['hero', "I treated those burns myself. And the boy on the feed never breathes. Forty seconds in Sump smoke. That's no boy."],
          ['nyra', "The wards are open, Maren. They're running. Halcyon is coming down the corridor."],
          ['hero', "Then everyone through this door, and nobody through it after them. The doctor is in."]
        ],
        win: [
          ['hero', "Last one through. Everyone's out. Now I can leave the room."],
          ['sys', "From the Pit: Pell names the faceless one. Rue. At the Crater she runs, and the war stops being a war."],
          ['hero', "I knew it. Now, the Spire. Somebody up there needs a very long rest."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Keep the wards alive under Vega",
        card: "Vael's champion Vega drags Aurelia down from Pylon Chamber Six and the wards below begin to crush; Maren fights her off the pylons for her patients.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "Pylon Chamber Six. A stranger pulls Aurelia down, and in the wards below the beds begin to slide."],
          ['hero', "My patients are under this floor. Every one of them. I'm going in."]
        ],
        meet: [
          ['vega', "Doctor. Your city is too heavy. Let it rest. Let it fall."],
          ['hero', "I know what rest looks like. This isn't it. There are children three floors down who can't walk yet."],
          ['vega', "Then they won't feel the fall."],
          ['hero', "They'll feel ME. Tide's coming in."]
        ],
        win: [
          ['sys', "Maren's tide hits Vega again and again, until the star in her palm slips and the city stops sliding."],
          ['vega', "...A doctor. Hitting me. Vael said this world was soft."],
          ['hero', "Go back to him, then. Tell him the doctor is in, and visiting hours are over."]
        ],
        lose: [
          ['vega', "Even doctors fall."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Hydro Ward, where the patients who cannot run are still in bed; Maren stays in the room and holds off its Siege Walker.",
        intro: [
          ['sys', "The Hydro Ward. Far off, the sky over the Crater burns. The Hollow Legion comes down the corridor, bed by bed."],
          ['hero', "Beds four through nine still can't walk. Neither can half the ward. Then I'm not leaving the room."],
          ['hero', "Tide's coming in. The doctor is in."]
        ],
        meet: [
          ['sys', "The ward doors buckle. A Siege Walker ducks into the room, and the water in the basins begins to shake."],
          ['hero', "This is a hospital. Lower your voice."]
        ],
        win: [
          ['sys', "Maren's tide drives the Siege Walker back through the doors and down. Then the Legion in the corridor goes still."],
          ['sys', "Through the ward windows, the far violet sky over the Crater closes. The light on the beds turns plain and warm."],
          ['hero', "Somebody check the wards. ...They're breathing. All of them."],
          ['sys', "The morning after. Nyra comes back, as she promised, with a crowd of freed Subjects to carry the beds out."],
          ['hero', "Everyone out, into the sun, slowly. Me last. Then I sleep for a week."],
          ['hero', "Doctor's orders: rest."]
        ] }
    },

    // ---------------------------------------------------------------- ELIXA
    elixa: {
      1: { zone: 'furnace', goal: "Find out what your serums are for",
        intro: [
          ['sys', "The Burn Ward labs. Halcyon's brightest chemist has never once asked where her Subjects come from."],
          ['hero', "Elixa, chief alchemist. Red burns, blue freezes. Nobody has tried both at once on a living subject. So, naturally..."],
          ['agent', "Doctor, the Director wants 44 ready for the feed lines by week seven. Ready. Not interesting."],
          ['hero', "Feed lines? Nobody told me about feed lines. What happens to her after?"],
          ['agent', "After is the Engine's business. Security, escort the doctor to her quarters."]
        ],
        win: [
          ['hero', "Interesting. They were very keen I not see the after. So I went to look."],
          ['hero', "Grey shapes on the feed lines, still breathing. Husks. My serums made them ready to drain."],
          ['hero', "Every result has a cause. This one is mine. Next experiment: a cure."]
        ] },
      2: { zone: 'glowwild', with: 'ume', goal: "Gather Glowwild spores with Ume",
        meet: [
          ['ume', "Halcyon's chemist, in my garden. Don't touch anything. What do you want the spores for?"],
          ['hero', "A cure, for the Husks. Your spores remember things. I want to see if they can remind a body what it was."],
          ['ume', "That's a good answer. Most Halcyon people say weapons. Most Halcyon people end up as compost."],
          ['hero', "I'd like to avoid compost. Shall we discuss the price first, or the drones behind you?"],
          ['ume', "Drones first. Then price. Step where I step."]
        ],
        win: [
          ['ume', "You fought for the garden. Fine. Spores, every season. I'll ask what for, every time."],
          ['hero', "And I'll answer every time. Green Cauldron, meet the Glowwild. This will react beautifully."]
        ] },
      3: { zone: 'furnace', rival: 'pyra', goal: "Face your result: Pyra",
        meet: [
          ['sys', "The Burn Ward, week seven. The bottle breaks. The fire walks out of it, and turns around."],
          ['pyra', "Elixa. You mixed it. I drank it. Six weeks. You took NOTES."],
          ['hero', "I did. Pages of them. I didn't know what they were for. I know now."],
          ['pyra', "Knowing doesn't put anything back. You're on the list."],
          ['hero', "Then let the result look at me. I'd rather see it than not."]
        ],
        win: [
          ['pyra', "...You stayed. Everyone else from the lab ran."],
          ['hero', "You're my finest result. You burned my lab down and looked me in the eye. A scientist doesn't run from that."],
          ['pyra', "Still on the list. ...Lower down."]
        ],
        lose: [
          ['pyra', "Write this down: ow."]
        ] },
      4: { zone: 'noble', goal: "Turn the serums against Halcyon",
        card: "Elixa reverses her own serums and puts Halcyon's guards to sleep across the Ring, while Pell names the face behind the war: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I ran that feed through my lab. Sump fire all round the boy, and he reads room temperature. That is no boy."],
          ['maren', "Then use your lab for something good, Elixa. Halcyon's guards on the Ring are full of your stimulants."],
          ['hero', "Then I'll give them a second colour. Blue to slow, green to sleep. Grand Experiment, everyone."]
        ],
        win: [
          ['hero', "Halcyon's own soldiers, asleep in the corridors. Serums reversed. Fascinating."],
          ['sys', "From the Pit: Pell, caught in his own Cat's Cradle, names the faceless one. Rue. At the Crater, she runs."],
          ['hero', "No face and no heat. I'd love a sample. Later. The Spire first."]
        ] },
      5: { zone: 'gallery', foe: 'mira', goal: "Find the real Mira in the glass",
        card: "Mira, Vael's champion out of the harbour ice, turns Aurelia's glass on it from the Observation Gallery; Elixa runs the experiment that finds the real one.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Observation Gallery. A masked stranger touches the glass, and every pane in Aurelia turns to face the city."],
          ['hero', "Every window a mirror, every mirror a weapon. Glass is my business. My flasks are glass."]
        ],
        meet: [
          ['mira', "Chemist. What you hit is only my reflection. Hit as many as you like."],
          ['hero', "A reflection still needs light. And light reacts. Red, blue, green: one of them shows the real you."],
          ['mira', "Nobody has found the real one. Vael never needed to. He only needed my glass."],
          ['hero', "Then I'll be first. A reaction no one has tried. Fascinating."]
        ],
        win: [
          ['sys', "Coloured smoke fills the Gallery. Every reflection turns the wrong colour except one, and Elixa's flask hits it."],
          ['mira', "...You found me. By colour. That isn't fair."],
          ['hero', "It's chemistry. Back to your crown-ship, and take your mirrors. My lab has windows I'd like back."]
        ],
        lose: [
          ['mira', "Your flasks are glass, chemist. Glass is mine."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Burn Ward labs, where Elixa is brewing her cure for the Husks; she defends the work and burns down its Siege Walker.",
        intro: [
          ['sys', "The Burn Ward labs. Far off, the sky over the Crater burns. The Hollow Legion pours in through the broken windows."],
          ['hero', "Twelve flasks of Ume's spores. A cure for the Husks, half finished. Nobody touches my bench."],
          ['hero', "Red burns, blue freezes. Green, today, for anything hollow that comes near my cure."]
        ],
        meet: [
          ['sys', "The floor cracks. A Siege Walker shoulders through the Burn Ward wall, and the flasks on the bench start to rattle."],
          ['hero', "A very large sample. Fascinating. Hold still."]
        ],
        win: [
          ['sys', "Every colour at once. The Siege Walker goes down in the smoke, and the Legion behind it stops dead."],
          ['sys', "Through the smoke, the light changes. The violet over the Crater is gone. The sky has closed."],
          ['hero', "They're gone. Good. Back to work. The Husks are still waiting on the feed lines."],
          ['sys', "The morning after. Elixa carries her first finished flask down to the feed lines, with Ume's spores and Maren's hands."],
          ['hero', "One Husk, one dose. Breathing. ...Blinking? Write it down. Write everything down."],
          ['hero', "Results: conclusive."]
        ] }
    },

    // ---------------------------------------------------------------- ISA
    isa: {
      1: { zone: 'archive', goal: "Refuse the Director's seal",
        intro: [
          ['sys', "The Archive. Every contract on the Noble Ring, every law of the Director's, is sealed in one woman's ink."],
          ['hero', "Isa, of the old school on the steppe. Sen and I could draw a line nobody crossed. Now I draw them for Halcyon."],
          ['agent', "Order forty-one, seal-writer. The Director wants it binding by noon."],
          ['hero', "Every Subject past use, to the Engine, without record. ...No. Not in my ink."],
          ['agent', "Then we'll take the brush, and the hand that holds it."]
        ],
        win: [
          ['hero', "Order forty-one, unsealed. It stays unsealed."],
          ['hero', "But every law before it bears my seal. I wrote this cage. I'll have to unwrite it, one word at a time."]
        ] },
      2: { zone: 'archive', with: 'lin', goal: "Hold the Archive with Lin",
        card: "Halcyon comes for the hand that refused order forty-one, and Lin of the Sky Clan steps out of the stacks to guard Isa's brush hand for the first time.",
        meet: [
          ['sys', "The Archive, after order forty-one. Halcyon wants the seal-writer's brush hand, and it is sending a captain to take it."],
          ['lin', "Seal-writer. Breathe. The Sky Clan has read your seals for a year. We read the one you refused, too."],
          ['hero', "You're from under the floor. The ones nobody up here believes in. Why come up for me?"],
          ['lin', "The Pact keeps the layers from killing each other. Your ink is the Director's best weapon. Not today."],
          ['hero', "Then keep them off my hand. I have a lot of words to take back, and I'll need it for every one."],
          ['lin', "Write. I'll be at the door. Every fifth strike seals."]
        ],
        win: [
          ['hero', "Not a drop spilled. Every law in these stacks bears my seal, Lin. I wrote this cage."],
          ['lin', "Then you can unwrite it. One word, big enough for all of them."],
          ['hero', "A Final Word. ...When I'm ready. Stay close to my brush hand."],
          ['lin', "Always."]
        ] },
      3: { zone: 'metro', rival: 'sen', goal: "Draw a line Sen cannot cross",
        card: "Isa goes down to the Old Metro to ask Sen, her old schoolmate, to help unwrite her laws; first he wants to see if her line still holds, and draws.",
        meet: [
          ['sys', "The Old Metro. A rusted metro car, swept clean: the Rust Dojo. Sen sits inside it, with Isa's letters in a neat stack."],
          ['hero', "Sen. You answered every letter with one line. I came for more than one line this time."],
          ['sen', "You sealed Halcyon's laws for a year. Each one drew a line down here. Around people."],
          ['hero', "I know. I'm going to unwrite them. I need to know my line still holds."],
          ['sen', "Then draw it. I will try to cross."]
        ],
        win: [
          ['sen', "...It held. The old school would be proud of that line."],
          ['hero', "You stopped your blade a hair from it. You always did wait too long."],
          ['sen', "Write your one word, Isa. I will answer it with one line. As always."]
        ],
        lose: [
          ['sen', "Crossed. Draw it again. Slower."]
        ] },
      4: { zone: 'noble', goal: "Write the Final Word",
        card: "With Lin guarding her brush hand, Isa writes the Final Word over the Ring and every law the Director sealed comes undone; then the faces are named: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the vents. Deepline says Nyra led the drills."],
          ['hero', "Borrowed faces to start a war, and Halcyon has its war law ready to seal. In my ink, of course."],
          ['lin', "I have your brush hand. Nobody comes near it. Write."],
          ['hero', "Every law the Director ever had me seal. One word for all of them."]
        ],
        win: [
          ['sys', "The Final Word falls across the sky in crimson ink. Every seal on every law of the Director's breaks at once."],
          ['hero', "Unwritten. The Proving Hall has no orders. The wards have no locks. The Subjects have their names."],
          ['sys', "From the Pit, Pell's word: the faces were Rue. At the Crater she runs, and four banners start up the Spire."]
        ] },
      5: { zone: 'archive', foe: 'tessa', goal: "Keep the Archive written",
        card: "Tessa, Vael's champion who has lived this year too many times, comes to unwrite the Archive and the Subjects' names; Isa seals every page and drives her out.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Archive. A stranger in brass goggles walks between the stacks, and the ink runs off every page she passes."],
          ['hero', "Those are the Subjects' names. I gave them back with the Final Word. Nobody takes them again."]
        ],
        meet: [
          ['tessa', "Seal-writer. I've lived this year a hundred times. In every one, these pages burn. I'm only being quick."],
          ['hero', "Then you've read every ending but mine. Who are you?"],
          ['tessa', "Tessa. I wrote tomorrow's tides on a harbour wall once. Vael promised me an ending that stays still."],
          ['hero', "An ending is a line. I draw lines nobody crosses. Try this one."]
        ],
        win: [
          ['sys', "Isa's seals close across every stack at once. The ink stops running, and Tessa's clock hands stop with it."],
          ['tessa', "...I've never seen this page. Not once in a hundred years."],
          ['hero', "Then read it on your way out. Go back to your crown-ship. The Archive stays written."]
        ],
        lose: [
          ['tessa', "I've seen this ending before. You lose here."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Archive, where the Subjects' names are written; Isa seals the stacks against its Siege Walker until the sky closes.",
        intro: [
          ['sys', "The Archive. Far off, the sky over the Crater burns. The Hollow Legion breaks in among the stacks."],
          ['hero', "Every name I gave back with the Final Word is written here. Hollow hands don't touch them."],
          ['hero', "One line. Nobody crosses it."]
        ],
        meet: [
          ['sys', "The shelves topple. A Siege Walker wades through the paper toward the names, and the soldiers follow in its wake."],
          ['hero', "That page is not yours. Nothing in this room is."]
        ],
        win: [
          ['sys', "The seal closes around the Siege Walker, and it falls among the stacks. Then the Legion stops mid-stride and goes still."],
          ['sys', "A paper crane drifts in through the high window and lands on the open ledger. Kiri's fold. The sky has closed."],
          ['hero', "Gone, all of them. And not one name lost."],
          ['sys', "The morning after. Isa sits at her desk with fresh ink and an empty page."],
          ['hero', "Sen. One line, as always: It held. Come up and see the names. ...Two lines. He'll forgive me."],
          ['hero', "Written, sealed, done."]
        ] }
    },

    // ---------------------------------------------------------------- LIN
    lin: {
      1: { zone: 'ballast', goal: "Seal the ballast crews, quietly",
        intro: [
          ['sys', "The Ballast Decks. Halcyon's crews come down to bolt the undercroft's old doors shut and cut the heat."],
          ['hero', "Lin, of the Sky Clan. My family has lived under the gold for a hundred years. These doors are ours."],
          ['kestra', "They're bolting the dance hall, Lin! Let me burn them. Just a little."],
          ['hero', "No fire near the beams. Breathe, sister. I'll be quiet about it."]
        ],
        win: [
          ['hero', "Every fifth strike seals. They forgot their own strength for a moment. A moment was enough."],
          ['kestra', "Fine. That was impressive. Quiet, but impressive."]
        ] },
      2: { zone: 'noble', with: 'zara', goal: "Guard the House Edge with Zara",
        meet: [
          ['sys', "The House Edge, on the Noble Ring. The owner needs a bodyguard. The Sky Clan needs eyes on the Ring."],
          ['zara', "You're the one the Ring is whispering about. Small, quiet, and three of my last guards won't get up."],
          ['hero', "They were rude to a waiter. I sealed their arms. They will wake up."],
          ['zara', "Darling, you're hired. Stand behind my chair. See everyone."],
          ['hero', "That is what I'm here for. ...You have guests. Halcyon. Unhappy about your money."]
        ],
        win: [
          ['zara', "Not a chip on the floor. You really do see everyone, don't you?"],
          ['hero', "Everyone. Including where your winnings go: Deepline. The Clan approves."],
          ['zara', "Then we understand each other. The house keeps its winnings, and its bodyguard."]
        ] },
      3: { zone: 'village', rival: 'ivo', goal: "Seal Ivo a third time",
        meet: [
          ['sys', "The Hidden Village on the Surface. Before dawn, a man with gold fists is already training."],
          ['ivo', "Lin! The soft one. I've been up since three. This time you don't seal me."],
          ['hero', "Your style is loud, Ivo. You announce every punch."],
          ['ivo', "Twelve punches in two seconds. Announce THAT."],
          ['hero', "I don't need to hear them all. Only the fifth."]
        ],
        win: [
          ['ivo', "...Third time. Again?! I can't feel my arms."],
          ['hero', "They will wake up. Loud isn't bad, Ivo. It's only easy to hear."],
          ['ivo', "Tomorrow. Before dawn. I'm working on it."]
        ],
        lose: [
          ['ivo', "Not so soft now, huh? Up. Again!"]
        ] },
      4: { zone: 'noble', goal: "Guard Isa's brush hand",
        card: "Lin guards Isa's brush hand while the Final Word unwrites every law the Director sealed, and the one who stood like nobody is named: Rue.",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the vents. Below, they say Nyra led the drills."],
          ['hero', "Watch the boy on that feed. No weight in his feet. Everyone stands like someone. He stands like nobody."],
          ['isa', "Then let's give Halcyon nothing to stand on. I'm writing the Final Word. Keep them off my hand."],
          ['hero', "Write. Nobody touches the brush."]
        ],
        win: [
          ['sys', "The Final Word crosses the sky in crimson ink. Every law the Director sealed comes undone."],
          ['hero', "Brush hand safe. Not a drop spilled. Breathe, Isa."],
          ['sys', "From the Pit: Pell names the one who stood like nobody. Rue. At the Crater, she runs."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Seal Mika off the cables",
        card: "Mika, Vael's champion, cuts the Skylift cables so the Legion can pour down toward the undercroft; Lin seals her arms, strike by strike, off the cables.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skylift. A stranger cuts the cables, and the Hollow Legion pours down them toward the undercroft."],
          ['hero', "The Clan's home is under those cables. A hundred years we kept it hidden. Not from this."]
        ],
        meet: [
          ['mika', "Quiet one. You stand so still. Up here nobody stands. Everyone falls."],
          ['hero', "Loud is easy to hear. You announce every leap."],
          ['mika', "And you'll never catch one. Two moons taught me to fly. What taught you?"],
          ['hero', "A hundred years under the floor. Every fifth strike seals."]
        ],
        win: [
          ['sys', "Five strikes, five sealed points. Mika's blades drop, and her arms will not lift them."],
          ['mika', "...My arms. What did you DO?"],
          ['hero', "They will wake up. On your crown-ship. Go. The undercroft is closed."]
        ],
        lose: [
          ['mika', "Too slow, quiet one. Under the moons, I'm faster."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault pours down the cables into the Ballast Decks; Lin seals its Siege Walker strike by strike and keeps the undercroft and the Clan safe.",
        intro: [
          ['sys', "The Ballast Decks. Far off, the sky over the Crater burns. The Hollow Legion climbs down the cables into the undercroft."],
          ['kestra', "Let me burn them, Lin. Just a little. Just all of them."],
          ['hero', "Not near the beams. Breathe, sister. I'll be quiet about it."]
        ],
        meet: [
          ['sys', "A Siege Walker drops onto the deck. The beams groan under it, and the Clan's children run for the stair."],
          ['hero', "Loud. Very loud. I only need to hear the fifth step."]
        ],
        win: [
          ['sys', "Five strikes, five sealed points. The Siege Walker kneels and does not rise. Then the Legion on the cables goes still."],
          ['sys', "The pylons change their hum. Through the ballast vents the violet over the Crater closes, and plain daylight comes in."],
          ['kestra', "That's it? That's the end of the world? I didn't even get to burn anything."],
          ['hero', "You burned three beams. ...It's over, Kestra."],
          ['sys', "The morning after. Lin walks the Clan up the hidden stair into the Noble Ring, past Zara's door, in daylight."],
          ['hero', "A hundred years under the floor. Nobody hides now. Ivo can find me before dawn, if he wants a fourth try."],
          ['hero', "Breathe out."]
        ] }
    },

    // ---------------------------------------------------------------- VESPER
    vesper: {
      1: { zone: 'ward', goal: "Light the lower alleys by dawn",
        intro: [
          ['sys', "The Night Ward. Subject 77 is locked in every night. Most nights she leaves anyway."],
          ['hero', "Vesper. On the harbour sea wall I lit every lamp at dusk. Nobody saw who. They only saw the scarf."],
          ['hero', "Aurelia's lower alleys have no lamps. Tonight they will."],
          ['agent', "Movement on the Ward roofs. Red cloth. Find it."],
          ['hero', "You'll find the lamps. Not me."]
        ],
        win: [
          ['hero', "Thirty lamps lit. Back in the cell before the count."],
          ['hero', "But on the way, a cart from the wards, going down to the feed lines. Full. It came back empty."]
        ] },
      2: { zone: 'enginecore', with: 'aldric', goal: "Show Aldric the feed lines",
        card: "Vesper follows the empty carts down to the Engine's feed lines and brings the knight who guards the wards to see the Husks for himself.",
        meet: [
          ['sys', "Below the Spire, the Engine's feed lines. Vesper has followed the carts all night. Tonight she brings company."],
          ['aldric', "Seventy-seven. You are out of your ward. I should take you back."],
          ['hero', "Look first, knight. You held the sea wall I lit every dusk. You never once saw me."],
          ['aldric', "...The scarf on the wall. That was you. Why bring me here?"],
          ['hero', "Look down. Grey shapes, breathing. Those are the Subjects you guard. The Director calls them Husks."],
          ['agent', "Intruders on the feed lines! ...Sir Aldric? Sir, step away from the Subject."]
        ],
        win: [
          ['aldric', "I swore to stand between harm and the people. I have been standing in the wrong place."],
          ['hero', "So move."],
          ['aldric', "When I turn, every knight in the Hall turns with me. Not before. Not alone."],
          ['hero', "Then I'll light your way when you do."]
        ] },
      3: { zone: 'ward', rival: 'moro', goal: "Cross Moro's rooftops",
        meet: [
          ['sys', "The Night Ward roofs. A tired young man sits on the ridge where Vesper always crosses. His shadow is very long."],
          ['moro', "You again. You walk through my shadows like they're doors. It's rude."],
          ['hero', "Shadows are for walking. You hide in yours."],
          ['moro', "Pell taught us shadows hide things. I decided they hold things. Walk through this one."],
          ['hero', "Gladly."]
        ],
        win: [
          ['moro', "...Fine. You walked through. I'm going back to sleep."],
          ['hero', "Your shadows held me a whole second. That's more than most."],
          ['moro', "Use the stairs next time. Please."]
        ],
        lose: [
          ['moro', "Held. Now go home. Quietly."]
        ] },
      4: { zone: 'noble', goal: "Light the way for the Hall",
        card: "As the Proving Hall marches, Vesper lights a road of lamps down to the feed lines so every knight sees the Husks, and the Hall turns around.",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen loops a Deepline boy opening the vents on the labs. The Proving Hall marches."],
          ['hero', "That boy on the feed casts no shadow. Lamp behind him, lamp in front, nothing on the floor. I light lamps. I notice."],
          ['aldric', "Seventy-seven. The knights wait on my word. Show them what you showed me."],
          ['hero', "Every lamp from the Hall to the feed lines, then. Let them walk down and look."]
        ],
        win: [
          ['sys', "Lamp by lamp, a road of light runs down to the feed lines. The knights see the Husks. The Proving Hall turns around."],
          ['aldric', "I have been standing in the wrong place. No longer."],
          ['hero', "And from the Pit: Pell named the face. Rue. At the Crater she ran. No shadow, no face. Nobody."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Light a lamp in Corvin's dark",
        card: "Corvin, Vael's champion, puts out the sun over the Skyport; Vesper, who lit the harbour's lamps unseen, lights them one by one until his crows scatter.",
        intro: [
          ['sys', "The sky over the Crater splits. Vael's crown-ship comes through, and his champions fall with the Hollow Legion."],
          ['sys', "The Skyport. A hooded stranger's crows put out the sun. In the dark, the Hollow Legion marches."],
          ['hero', "He puts out the sun. I light lamps."]
        ],
        meet: [
          ['corvin', "Lamplighter. The omen says dark forever. Your little lamps change nothing."],
          ['hero', "I lit every lamp on the harbour wall for years. Nobody saw who. Your crows won't either."],
          ['corvin', "My world's lamps went out under an engine like his. Every one. I watched."],
          ['hero', "So you came to put out ours. No."]
        ],
        win: [
          ['sys', "Lamp by lamp, the Skyport lights up. The crows scatter, and a red scarf is already at Corvin's back."],
          ['corvin', "...I never saw you. The omen never saw you."],
          ['hero', "Nobody does. Take your crows back to your crown-ship, crow-reader. The lamps stay lit."]
        ],
        lose: [
          ['corvin', "Every lamp goes out, lamplighter."]
        ] },
      6: { goal: "Hold your home against the Legion",
        card: "The Legion's last assault hits the Night Ward and its dark alleys; Vesper lights every lamp and cuts its Siege Walker down where nobody sees her coming.",
        intro: [
          ['sys', "The Night Ward. Far off, the sky over the Crater burns. The Hollow Legion pours into the dark lower alleys."],
          ['hero', "Thirty lamps by dawn, the first night. Tonight, every lamp in the Ward, and a red scarf between them."]
        ],
        meet: [
          ['sys', "A Siege Walker stamps down the alley, crushing the lamps one by one under its feet."],
          ['hero', "You're putting out my lamps. Nobody does that."]
        ],
        win: [
          ['sys', "A red scarf, a thousand cuts. The Siege Walker falls in the last dark alley. Then the Legion goes still."],
          ['sys', "Up on the Ward roofs, Vesper watches the far violet over the Crater close. The night is only night again."],
          ['hero', "Over. Nobody saw who. Good."],
          ['sys', "The morning after. The Night Ward's doors stand open. Nobody locks Subject 77 in. Nobody needs to."],
          ['hero', "Tonight I'll light the lamps anyway. Aldric's knights will be looking for who. Let them look."],
          ['hero', "You never saw me."]
        ] }
    }

  });
})();
