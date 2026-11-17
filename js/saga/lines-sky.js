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
          ['tessa', "There. The first time this ends with both of you standing. Hold on to that."],
          ['hero', "...I don't know what I saw on that feed. But I don't think it was you."]
        ],
        lose: [
          ['kael', "Stay down. I don't want to hurt you. I want to know why you sold us out."],
          ['hero', "I didn't. Again."]
        ] },
      4: { zone: 'noble', goal: "Lead the Subjects up to the Ring",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen on the Ring plays the same feed: Kael at the vents, again and again."],
          ['sys', "And from Deepline, word comes up the Skylift: Subject 31 led Halcyon's drills into the tunnels."],
          ['hero', "I've never led a drill anywhere. Someone is wearing my face. And his."],
          ['maren', "Then let them see the real one. The wards are open, Nyra. Bring them up."],
          ['hero', "Everyone Halcyon ever numbered: up, now. Stay low, stay close, and sing if you can."]
        ],
        win: [
          ['hero', "The Proving Hall turned. Aldric's knights hold the stairs for us now, not against us."],
          ['sys', "Word from the Crater: in Mira's mirror, the Kael who opened the vents had no reflection. A copy. It ran."],
          ['hero', "A face with nothing behind it, and it wore mine too. Sorry, Kael. Next stop: the Spire."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Reach Vega through the Legion",
        intro: [
          ['sys', "The sky over the Crater splits. A crown the size of a city comes down, with nothing inside it."],
          ['vael', "Children of the dark between worlds. Come home."],
          ['sys', "Pylon Chamber Six. The Hollow Legion pours in. Vega's eyes are violet, and Aurelia begins to fall."],
          ['hero', "She held this city up for a year. I won't let him make her drop it."]
        ],
        meet: [
          ['vega', "Nyra. Go. The weight is going home, and so am I. Let it fall."],
          ['hero', "You're named for the star the harbour steered by. I heard the navigators sing to it."],
          ['vega', "That harbour is gone. The tear ate it."],
          ['hero', "Not while somebody still sings it. Listen, Vega. Low and cold, the way the boats came in."]
        ],
        win: [
          ['sys', "Nyra sings the harbour's old steering song. Above Vega, the hollow crown cracks."],
          ['vega', "...The boats used to sing that. To the star. To me. I remember the water."],
          ['tessa', "And now the ending, Vega. The one where you let go of HIM, and not of the city."],
          ['vega', "The crown is gone. The weight is mine again. Hold on, Aurelia."],
          ['hero', "We've got you. Nobody does the flying for you. But nobody leaves you alone up here either."]
        ],
        lose: [
          ['vega', "Everything falls, little singer. Even you."],
          ['hero', "Again. One more verse."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door into it; Vega and Lux hold Aurelia in the sky while everyone crosses."],
          ['hero', "The Convergence. The Director, wearing his Engine. He put me in a tank and called it care."],
          ['convergence', "Thirty-one. The one who could see the Husks. Still inconvenient."],
          ['vael', "A small voice. I have silenced worlds."],
          ['hero', "Then hear this one."]
        ],
        win: [
          ['hero', "Winter, for the Engine that bottled me. Shatterline. Hold the note... and break."],
          ['sys', "Itsuki calls the Five Calamities. The Convergence comes apart into light; the Crown falls into the Crater."],
          ['hero', "The Legion is just... standing still. Like they've finally been allowed to stop. Rest now. All of you."],
          ['isolde', "You flew that yourself, chick. Every inch."],
          ['hero', "Subject thirty-one. Free."]
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
        intro: [
          ['sys', "The Noble Ring. Every screen loops the same feed: a white-haired Deepline boy opening the Sump's vents on the labs."],
          ['agent', "Deepline has attacked the Sky! The Proving Hall marches on the Skylift at dawn!"],
          ['hero', "My falcon watches that feed and never stirs. She stirs at anything alive. That is not a boy."],
          ['nyra', "The wards are ready, Isolde. They're waiting for your bird."],
          ['hero', "Then up, little one. Every ward, every window. Tell them: rise."]
        ],
        win: [
          ['hero', "Every ward rose on the signal. And the knights... Aldric turned them. Good wall."],
          ['sys', "News from the Crater: in Mira's mirror, the Kael who opened the vents had no reflection. A copy. It ran."],
          ['hero', "A face with nothing inside. Halcyon sold us a copy and called it war. My falcon knew."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Break the crown over Corvin",
        intro: [
          ['sys', "The sky over the Crater splits. A hollow crown descends, and something calls every Beyond-born home."],
          ['sys', "The Skyport. Corvin's crows come by the thousand and put out the sun. Behind them, the Hollow Legion."],
          ['hero', "Crows. Of course it is crows. Eleven apologies, and now he brings ten thousand more."]
        ],
        meet: [
          ['corvin', "Falconer. The omen is the end of your sky. The crows only came to watch."],
          ['hero', "Your crows went for my bird on my first night free. I never forgave it. I am not about to start."],
          ['corvin', "I have apologised eleven times."],
          ['hero', "And I have counted every one. Hold still. This is for all eleven."]
        ],
        win: [
          ['sys', "The ice falcon stoops through the black wings, straight and certain. The hollow crown over Corvin shatters."],
          ['corvin', "...Isolde. The sky is dark. Did I do this? ...I am sorry. Twelve."],
          ['hero', "Twelve. Accepted. Now call your crows off my sun."]
        ],
        lose: [
          ['corvin', "The crows have landed, falconer. Time to stop flying."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin's door is open; Vega and Lux hold Aurelia in the sky while everyone crosses."],
          ['hero', "Inside, the last two engines. One bottled us. One wants to eat whatever is left."],
          ['vael', "A bird of ice. I have swallowed whole winters."],
          ['hero', "Then you have never met a falconer."]
        ],
        win: [
          ['hero', "Down, little one. Find the seam in his crown. There."],
          ['sys', "Itsuki's Five Calamities fall. The Convergence breaks into light, and the Crown drops into the Crater."],
          ['hero', "Nyra flew her own way through it. Aldric held. Even the crows behaved. The harbour would be proud."],
          ['hero', "My falcon never misses."]
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
        intro: [
          ['sys', "The Siege of the Noble Ring. Halcyon's screens loop the feed: a Deepline boy opening the Sump's vents on the labs."],
          ['kiri', "Down below they say Nyra led the drills in. I took a letter from Nyra that same hour, up here. Someone's lying with faces."],
          ['hero', "Then we fly the truth faster than they can lie. Every ward gets the plan before the Proving Hall moves."],
          ['sora', "High towers are mine. Low wards are yours. Don't follow me!"],
          ['hero', "Wouldn't dream of it. ...Much."]
        ],
        win: [
          ['hero', "Every ward had the plan. Every one of them rose on time. The Paper Post never misses a tower."],
          ['sys', "From the Crater: the Kael at the vents had no reflection in Mira's mirror. A copy, and it ran."],
          ['hero', "Fake face, fake war. The wind doesn't care whose face you wear. Up the Spire, then."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Hold the Skylift cars on the wind",
        intro: [
          ['sys', "The sky over the Crater tears open. A hollow crown comes down, and the Called answer it."],
          ['sys', "The Skylift. Mika cuts the cables one by one, and the Hollow Legion pours down what is left."],
          ['hero', "Cars full of people, swinging over nothing. Sora, go after her. I've got the cars."]
        ],
        meet: [
          ['mika', "Little wind. You can't hold them all. Let them fall, the way you fell."],
          ['hero', "I fell a thousand metres and came back up. These people get the express."],
          ['mika', "The moons say down."],
          ['hero', "The wind says up. And it picked me."]
        ],
        win: [
          ['sys', "Gale holds the cars on a column of wind while Sora's kite string wraps Mika out of the air. The crown breaks."],
          ['mika', "...I touched the ground. For the first time. Who... Sora?"],
          ['sora', "First time anybody brought you down, moon girl. Didn't hurt, did it?"],
          ['hero', "Cars are steady. Everyone's up. And that's my sister. Told you she'd do it."]
        ],
        lose: [
          ['mika', "Down you go, little wind."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door into it, and the Hollow Legion fills the sky around them."],
          ['itsuki', "Gale. The wind, now. I'll pay whatever you're asking."],
          ['hero', "Oh, you're paying. Later. With interest."],
          ['vael', "The wind blows where I tell it."],
          ['hero', "Bad news, crown-head. It never told you anything."]
        ],
        win: [
          ['sys', "Fire, wind, thunder, earth, water. Itsuki calls the Five Calamities, and the Convergence comes apart into light."],
          ['hero', "That spin on the second one? My wind. Remember that when people tell the story."],
          ['sora', "You're hovering again."],
          ['hero', "Always. And tell Bando I still owe him a kite. I'm good for it."],
          ['hero', "The wind picked me. Not you."]
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
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a white-haired Deepline boy opening the Sump's vents on the labs."],
          ['director', "Deepline has struck at us. The Proving Hall marches. Sir Aldric, lead them down."],
          ['hero', "I saw that boy's face, Director. I also saw your feed lines. One of the two is a lie, and I know which."],
          ['vesper', "The knights are behind you, Aldric. Tell them what you saw."],
          ['hero', "Knights of the Hall! We swore to stand between harm and the people. Turn around. Harm is behind us."]
        ],
        win: [
          ['hero', "The Hall has turned. My oath to the Director is broken. The older one stands."],
          ['sys', "Word from the Crater: in Mira's mirror, the Kael who opened the vents had no reflection. A copy. It ran."],
          ['hero', "A false face to start a war, and I nearly marched for it. Never again. To the Spire."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Hold the floor of a falling city",
        intro: [
          ['sys', "The sky over the Crater splits. A hollow crown comes down, and every Beyond-born hears it call."],
          ['sys', "Pylon Chamber Six. Vega answers. Aurelia lurches and begins to fall, and the Hollow Legion pours in."],
          ['hero', "The city tilts. Then this floor is my wall. Nyra, go to her. I will hold."]
        ],
        meet: [
          ['vega', "Captain of the harbour wall. Your wall fell once. Let this one fall too."],
          ['hero', "It did fall once. I was the one who stayed standing. I will not do it twice."],
          ['vega', "Everything falls toward me. Even knights."],
          ['hero', "Then I will be the one thing that does not."]
        ],
        win: [
          ['sys', "Aldric holds the floor while Nyra sings. Vega remembers the harbour that steered by her, and the crown breaks."],
          ['vega', "...I almost dropped them. All of them."],
          ['hero', "You did not. You held them for a year. Rest your arms a moment, star. I have the floor."]
        ],
        lose: [
          ['vega', "Kneel, knight. Gravity always wins."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia in the sky while everyone crosses."],
          ['hero', "Knights. One more wall. Every soul behind us is a soul we swore to."],
          ['convergence', "Subject 12. The finest knight I ever owned."],
          ['hero', "Never owned. You only borrowed my oath. I am taking it back."]
        ],
        win: [
          ['hero', "Skysplitter. Three times. Now, world-walker!"],
          ['sys', "Itsuki's Five Calamities strike. The Convergence breaks into light, and the Crown falls into the Crater."],
          ['hero', "The Legion is still. Every one of them was somebody's people. We stood between. At last."],
          ['hero', "My oath is kept."]
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
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen shows a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "Ashka saw that boy at the vents from her chains. She says he didn't sweat. In the Sump. Nobody doesn't sweat in the Sump."],
          ['agent', "The Proving Hall marches on Deepline! Shut the gates, nobody leaves!"],
          ['hero', "Gates? Cute. Stand back, everyone. This is the part I'm good at."]
        ],
        win: [
          ['hero', "Gates gone. The knights are coming out, and they're facing the right way. That's Aldric's doing."],
          ['sys', "From the Crater: Mira's mirror shows the false Kael with no reflection. Ashka was right. A copy."],
          ['hero', "Someone lit this war with a borrowed face. I'm going to find the match and snap it."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Hold back Lux's white light",
        intro: [
          ['sys', "The sky over the Crater tears. A crown with nothing inside it calls, and twelve answer."],
          ['sys', "The Noble Ring. Lux is called, and her light comes down white and burning. The Hollow Legion marches behind it."],
          ['hero', "White fire on the Ring. Okay. Red fire's here too, and it's in a mood."]
        ],
        meet: [
          ['lux', "Pyra. Burn with me. Everything white. Everything clean. Nothing left to bottle."],
          ['hero', "They tried to bottle both of us, Lux. Light doesn't bottle. Neither does fire. Don't let HIM do it."],
          ['lux', "There is no him. Only the light."],
          ['hero', "Light's for seeing by, sunshine. Not for burning people blind. Let me remind you."]
        ],
        win: [
          ['sys', "Red fire holds the white light still for one breath. A mile away, Yara looses, and the arrow takes Lux's crown."],
          ['lux', "...The gardens. Light is for carrying into the gardens. What was I doing?"],
          ['hero', "Nothing that won't heal. Your archer has good aim, and I've got thick skin."]
        ],
        lose: [
          ['lux', "Too dim, little fire. Fade."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin's door opens; Vega and Lux hold Aurelia up while everyone crosses."],
          ['ashka', "Sister. Together. The core burns hotter than anything in there."],
          ['hero', "Then let's show the Engine what it tried to bottle."],
          ['itsuki', "Pyra! Fire, first of five. I need yours."],
          ['hero', "Take it. Bring it back hotter."]
        ],
        win: [
          ['sys', "Itsuki calls the Five Calamities, and the first is Pyra's fire. The Convergence comes apart into light."],
          ['hero', "That first one? Mine. Six weeks in a bottle, and the fire still came out on top."],
          ['hero', "Ashka, we're both out of our bottles. Elixa, write that down. Kestra... fine. The bird's big enough for two."],
          ['hero', "Too hot for you?"]
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
      2: { zone: 'medlab', with: 'lux', goal: "Put light on the string",
        meet: [
          ['sys', "Med-Lab Sector 7, for correction. In the next cell, behind thick glass, a girl made of light refuses to dim."],
          ['lux', "You're the archer who wouldn't shoot. They talk about you on the charts. I'm Lux."],
          ['hero', "Yara. They tried to bottle you?"],
          ['lux', "Light doesn't bottle. Give me your bow. One beam goes in, seven come out. Put it on the string. Breathe."],
          ['hero', "...It's warm. It's like the lamp. The arrow wants to go further."],
          ['agent', "Subject 57 and the light are interacting! Break them up!"]
        ],
        win: [
          ['hero', "Every arrow came home bright. Lux, come on. The door's open."],
          ['lux', "Not yet. Forty Subjects in this lab, and I go when they go. Light always finds a way. You go first."],
          ['hero', "Then I'll keep the lamp lit until you do."]
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
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy at the vents. Deepline's runners say Nyra led their drills."],
          ['hero', "I watched that feed through my scope. The boy at the vents never blinks. Forty seconds. Nobody goes that long."],
          ['agent', "Gunners to the balconies! Anyone on the Ring without a Halcyon badge is a target."],
          ['hero', "Halcyon guns on every balcony, end to end. One line. One breath. Lamp's lit."]
        ],
        win: [
          ['sys', "One arrow, drawn a whole breath, runs the length of the Noble Ring. Every Halcyon gun on it goes quiet."],
          ['hero', "Clear. The Subjects can cross. And Mira says the Kael at the vents had no reflection. I knew it."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Shoot the crown off Lux",
        intro: [
          ['sys', "The sky over the Crater splits. The Hollow Crown calls every Beyond-born home, and Lux answers."],
          ['sys', "The Noble Ring burns white. The Hollow Legion marches through the light, rank on rank."],
          ['hero', "She gave me light for my arrows. Now she's turning it on the Ring. On me."]
        ],
        meet: [
          ['lux', "Yara. I gave you the light. Give it back. Everything white, everything still."],
          ['hero', "You told me light always finds a way. This isn't a way, Lux. It's a cage with no walls."],
          ['lux', "Then shoot me, archer. You never miss."],
          ['hero', "I won't shoot you. I'll shoot the thing on your head. From a mile, if I have to."]
        ],
        win: [
          ['sys', "Yara steps back a mile, draws for one whole breath, and lets go. The arrow takes the hollow crown off Lux's head."],
          ['lux', "...That was my light on your string. You carried it back to me."],
          ['hero', "That's what lamps are for. Bringing people home."]
        ],
        lose: [
          ['lux', "Your light was always mine. I'm taking it back."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens the door. Lux and Vega hold Aurelia in the sky while everyone crosses."],
          ['lux', "Yara. Take some light with you. I'll be busy holding up a city."],
          ['hero', "Borrowed light, my own bow. Everything I aim at, I hit."],
          ['vael', "An archer. I am the dark between worlds. There is nothing to aim at."],
          ['hero', "There's always a lamp somewhere. I'll find yours."]
        ],
        win: [
          ['hero', "One breath. The longest draw I've ever held. Straight through the crown."],
          ['sys', "Itsuki's Five Calamities follow the arrow in. The Convergence comes apart into light, and the Crown falls."],
          ['hero', "Every ship I ever guided home... this is what it was for. Lights on, everybody."],
          ['hero', "Meridian. Your last light."]
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
        intro: [
          ['sys', "The Siege of the Noble Ring. Halcyon's screens loop a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I know that trick. I fought it in the shrine. Something with no face, wearing whoever it likes."],
          ['hero', "It wore Kael up here. Rook says down below it wore Nyra and led the drills. Same smile behind both."],
          ['coda', "Then tell the Ring everything. Pell's secrets are in my ribbons. Fold them and fly them."],
          ['hero', "A thousand cranes, one secret each. Every door on the Ring. Go, go, go!"]
        ],
        win: [
          ['sys', "A thousand paper cranes land on a thousand doorsteps. The Ring reads who pays Halcyon, and for what."],
          ['hero', "Folded, flown, delivered. And from the Crater: in Mira's mirror, the false Kael had no reflection. Told you."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Fly through Corvin's crows",
        intro: [
          ['sys', "The sky over the Crater tears open. A hollow crown calls the Beyond-born home, and Corvin answers."],
          ['sys', "The Skyport goes dark. Crows put out the sun, and the Hollow Legion lands in the black."],
          ['hero', "Dark sky, black wings. Okay, cranes. White paper shows up best at night. Let's be loud about it."]
        ],
        meet: [
          ['corvin', "Paper bird. The omen is the end of the sky. Fold yourself a grave."],
          ['hero', "I folded the wishes of the dead into a crane, Corvin. They wanted to fly, not end."],
          ['corvin', "Every wing comes down."],
          ['hero', "Mine come down when I tell them. Both of us. Now!"]
        ],
        win: [
          ['sys', "Paper cranes tangle the crows. In the gap an ice falcon stoops: Isolde's. The hollow crown over Corvin breaks."],
          ['corvin', "...Paper. And ice. The sky is coming back. I am... sorry. Tell her twelve."],
          ['hero', "Tell her yourself! The Post's busy."]
        ],
        lose: [
          ['corvin', "Wet paper. Torn wings. It is written."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door into it; Vega and Lux hold Aurelia in the sky."],
          ['hero', "Last delivery, Paper Post! One crane each, all the way into the Crown."],
          ['sora', "High route's mine!"],
          ['vael', "Paper. Against the dark between worlds."],
          ['hero', "Paper carries what people want to say. Nobody's ever written to you, have they?"]
        ],
        win: [
          ['hero', "Paper Dragon! Through everyone, both of us, twice!"],
          ['sys', "Itsuki's Five Calamities finish it. The Convergence comes apart into light; the Crown falls into the Crater."],
          ['hero', "Every wish from the shrine got carried up. Every letter got sent. Bow, other me."],
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
        intro: [
          ['sys', "The Siege of the Noble Ring. Up above, the screens loop a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "Look at the fire on that feed. It bends round him like he isn't there. Fire doesn't bend round people. It eats them."],
          ['lin', "And Halcyon is using it to march the Proving Hall down to Deepline. Over our heads."],
          ['hero', "Over our roof, you mean. Sky Clan! A hundred years under the floor. Tonight we come up through it."]
        ],
        win: [
          ['sys', "The floor of the Noble Ring splits, and the Sky Clan rises out of the undercroft on wings of fire."],
          ['hero', "The nobles finally know who's been living under them. Their faces. Worth a hundred years."],
          ['hero', "And the Crater says the false Kael had no reflection. Fake face, fake war. Real fire."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Send fire moths into the white light",
        intro: [
          ['sys', "The sky over the Crater tears. A crown with nothing inside it calls the Beyond-born home."],
          ['sys', "The Noble Ring burns white. Lux walks at the front of the Hollow Legion, and the light comes down."],
          ['hero', "White light on my Ring. Moths go toward the light. Mine bite."]
        ],
        meet: [
          ['lux', "Phoenix. You rise from fire. Rise into the light, and stay there. No more falling."],
          ['hero', "The phoenix falls. That's the whole point. Then it rises again, on its own."],
          ['lux', "There is no again. Only white."],
          ['hero', "Every fire moth I've got, then. Let's see who blinks."]
        ],
        win: [
          ['sys', "Fire moths swarm the white light and turn it red. A mile away, Yara looses. The crown on Lux's head breaks."],
          ['lux', "...Warm. That's what light is for. I forgot."],
          ['hero', "Don't. I'm not lending you moths twice."]
        ],
        lose: [
          ['lux', "The moth always flies into the light. And burns."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens the door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['lin', "Breathe, sister. Fire first."],
          ['hero', "Then the fan to make it worse. Sky Clan, rise!"],
          ['convergence', "A clan that never chose a layer. Fuel, all the same."]
        ],
        win: [
          ['hero', "Phoenix Dive! Down on him like a falling sun!"],
          ['sys', "Itsuki's Five Calamities follow. The Convergence comes apart into light, and the Crown falls into the Crater."],
          ['hero', "The undercroft can come up for good now. No more hiding under their floor. And Pyra? Two tails. Fine."],
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
      3: { zone: 'skyport', rival: 'mika', goal: "Stay up longer than Mika",
        meet: [
          ['mika', "Kite girl. You hang off a string and call it flying. Cute."],
          ['hero', "And you jump and never come down and call it walking. Who stays up longer? Right here, right now."],
          ['mika', "On my world, children jump before they walk. I haven't touched the ground since I got here."],
          ['hero', "Neither have I. So one of us is about to lose a record."]
        ],
        win: [
          ['mika', "...You stayed up. Longer than me. Fine. Fine!"],
          ['hero', "Toes clean. Not a speck of ground on them. Say it: Sora stays up longest."],
          ['mika', "Rematch under two moons, someday. You'll fall."]
        ],
        lose: [
          ['mika', "Down you go, kite girl. One moon's not enough to hold you up."]
        ] },
      4: { zone: 'noble', goal: "Carry Coda's dance to every tower",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the vents. Deepline says Nyra led the drills."],
          ['hero', "From up here you see everyone. That night Kael was in the Crusher Yard. I flew right over him. Somebody's lying."],
          ['coda', "Then carry the truth. I'm about to dance Pell's secrets out on stage. Fly them to every tower."],
          ['hero', "Every tower, every window. Gale, low route! Don't follow me!"]
        ],
        win: [
          ['sys', "A kite trailing a dancer's ribbons crosses every tower in Aurelia, and Pell's secrets go with it."],
          ['hero', "All of it, out in the open. And the Crater says the Kael at the vents had no reflection. Told you so."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Bring Mika down",
        intro: [
          ['sys', "The sky over the Crater splits. A hollow crown calls every Beyond-born home, and Mika answers."],
          ['sys', "The Skylift. Mika cuts the cables one by one, and the Hollow Legion pours down them."],
          ['gale', "I've got the cars! Go get her, Sora!"]
        ],
        meet: [
          ['mika', "Kite girl. Come up. Higher. There's a crown up here, and it says nobody comes down."],
          ['hero', "You never come down. That's your thing. Not his thing. Yours."],
          ['mika', "The moons pull up. The crown pulls up. Let go of your string."],
          ['hero', "My string's tied to my brother. Mine stays. Yours I'm cutting."]
        ],
        win: [
          ['sys', "Sora's kite string wraps Mika out of the air, and for the first time Mika comes down. The crown shatters."],
          ['mika', "...Ground. I'm on the ground. ...Sora? You caught me."],
          ['hero', "First time anyone brought you down. Don't worry. I won't tell anyone. Much."],
          ['mika', "...Thank you. Rematch under two moons."]
        ],
        lose: [
          ['mika', "Up here, kite girl, no string is long enough."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['mika', "Race you to the top, kite girl."],
          ['hero', "Through a crown full of soldiers? You're on."],
          ['vael', "Everything comes down in the end."],
          ['hero', "Not me."]
        ],
        win: [
          ['hero', "A Thousand Kites! Cut, cut, cut, and drop!"],
          ['sys', "Itsuki's Five Calamities fall, Gale's wind among them. The Convergence breaks into light, and the Crown drops."],
          ['hero', "Gale, stop hovering. Mika, I won. Bando, fine, you saved me. Once."],
          ['hero', "Never touched the ground."]
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
      2: { zone: 'skylift', with: 'mika', goal: "Learn to leap without a net",
        meet: [
          ['sys', "The Skylift, a thousand metres up. Coda slipped out after the opera; Zara covered for her at the House Edge."],
          ['mika', "You're the dancer. You want to learn to leap? Here. Cable to cable. No net."],
          ['hero', "Every leap I've ever made, someone was holding the string. I want one that's mine."],
          ['mika', "Then stop counting the floor. Count the air. On my world, children jump before they walk."],
          ['hero', "...Like the bell. One toll, push. Two, fly. Oh. OH."],
          ['agent', "Unlicensed persons on the Skylift cables! Detain them!"]
        ],
        win: [
          ['mika', "Most people need a month. You'll have it in a week."],
          ['hero', "I've been leaping for years. I just never let go of the string before."],
          ['hero', "Thank Zara for the cover story. I owe her another seat at the House Edge."]
        ] },
      3: { zone: 'noble', rival: 'pell', goal: "Cut Pell's strings mid-dance",
        meet: [
          ['sys', "The Noble Ring opera, mid-performance. The orchestra plays. The strings go taut."],
          ['pell', "You missed a step last night, my star. On the Skylift, of all places."],
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
          ['sys', "From the Crater: in Mira's mirror, the false Kael has no reflection. Rue runs."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Dance Mika free",
        intro: [
          ['sys', "The sky over the Crater tears. A crown with nothing inside it calls, and Mika answers."],
          ['sys', "The Skylift. Mika cuts the cables, and the Hollow Legion pours down them in endless ranks."],
          ['hero', "My teacher, with a crown on her head and violet in her eyes. Right where she taught me to fly."]
        ],
        meet: [
          ['mika', "Little dancer. Leap. There's no net, and no ground, and no you. Only the Crown."],
          ['hero', "You taught me to leap without a net. You never said anything about leaping without myself."],
          ['mika', "Let go of the string."],
          ['hero', "I already did. You were there. Now let me show you what you taught me."]
        ],
        win: [
          ['sys', "Coda dances along the cables, toll by toll, until Mika's feet find the beat again. The hollow crown breaks."],
          ['mika', "...That rhythm. One toll, push. Two, fly. You kept it."],
          ['hero', "Student's dance, teacher's steps. Come down, Mika. Sora's waiting to gloat."]
        ],
        lose: [
          ['mika', "You missed a step, little dancer."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['sys', "Across the Surface, Oda's bell rings. Coda counts the tolls with her feet, the way she did as a child."],
          ['convergence', "My dancer. Still on stage."],
          ['hero', "Never yours. This is the finale, Director. I choose the music."]
        ],
        win: [
          ['hero', "Finale. Ribbons everywhere, every beat a cut."],
          ['sys', "Itsuki's Five Calamities bring down the last chord. The Convergence breaks into light; the Crown falls into the Crater."],
          ['hero', "Oda's bell, all the way up here. One toll. I'm coming home to count the rest."],
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
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen loops a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I read faces for a living, darling. That boy has a face and nothing behind it. Like a card with no pips."],
          ['lin', "Deepline's runners say Nyra led the drills down there. Same blank behind the eyes."],
          ['hero', "Someone's dealing from a stacked deck. Fine. Every coin in the House, on the uprising."]
        ],
        win: [
          ['hero', "The House paid for the Subjects' doors, the Clan's stairs and every Paper Post kite. All in. Best bet I ever made."],
          ['sys', "From the Crater: Mira's mirror shows the false Kael with no reflection. The faceless one runs."],
          ['hero', "Told you. A card with no pips. Now, darlings: the Spire."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Luck against omen: face Corvin",
        intro: [
          ['sys', "The sky over the Crater splits. A hollow crown calls every Beyond-born home, and Corvin answers."],
          ['sys', "The Skyport goes black under ten thousand crows. The Hollow Legion lands in the dark."],
          ['hero', "A dark sky and long odds. My favourite table."]
        ],
        meet: [
          ['corvin', "Gambler. The omen is read. The sky ends. There is no luck in a written ending."],
          ['hero', "Omens are just odds, darling, and odds are my business. Let's play."],
          ['corvin', "You will lose."],
          ['hero', "Everyone says that before the last card."]
        ],
        win: [
          ['sys', "The last card is the jackpot. In the gap it opens, Isolde's falcon stoops. The crown over Corvin breaks."],
          ['corvin', "...The crows are landing. The sun... I did not read this ending."],
          ['hero', "Nobody reads luck, darling. That's what makes it luck."]
        ],
        lose: [
          ['corvin', "The house has fallen, gambler. Omen fulfilled."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia in the sky while everyone crosses."],
          ['convergence', "The card dealer who funded the rats below. Your account is closed."],
          ['hero', "My account, darling, is the only one in this city that ever balanced."],
          ['vael', "I have eaten worlds. And you bet against me?"],
          ['hero', "All in."]
        ],
        win: [
          ['hero', "All In. Every card, and the last one's a ten. It always is."],
          ['sys', "Itsuki's Five Calamities fall. The Convergence breaks into light, and the Hollow Crown falls into the Crater."],
          ['hero', "Lin, open the House. Drinks for everyone. Jax too. Especially Jax."],
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
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the Sump's vents. There are burns in every ward."],
          ['hero', "I treated those burns myself. And the boy on the feed never breathes. Forty seconds in Sump smoke. That's no boy."],
          ['nyra', "The wards are open, Maren. They're running. Halcyon is coming down the corridor."],
          ['hero', "Then everyone through this door, and nobody through it after them. The doctor is in."]
        ],
        win: [
          ['hero', "Last one through. Everyone's out. Now I can leave the room."],
          ['sys', "From the Crater: Mira's mirror shows the false Kael with no reflection. A copy that never breathed."],
          ['hero', "I knew it. Now, the Spire. Somebody up there needs a very long rest."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Keep Vega alive",
        intro: [
          ['sys', "The sky over the Crater splits. A hollow crown calls every Beyond-born home, and Vega answers."],
          ['sys', "Pylon Chamber Six. Vega pulls Aurelia down, the Hollow Legion pours in, and her bones bend under a city."],
          ['hero', "A city's weight on one body. I'm a doctor. I'm going in."]
        ],
        meet: [
          ['vega', "Doctor. Don't. The weight is going home, and so am I."],
          ['hero', "Your heart is at three times what a heart can take. You're breaking, Vega. Let me hold some of it."],
          ['vega', "No one holds a star."],
          ['hero', "I held Nyra through every test. I held Nami through the sea. Watch me."]
        ],
        win: [
          ['sys', "Maren's tide holds Vega together while Nyra sings and Tessa tells her the ending. The hollow crown breaks."],
          ['vega', "...I can let go. Of him. Not of the city."],
          ['hero', "Let go slowly. Breathe with me. I've got you until it's done."]
        ],
        lose: [
          ['vega', "Even doctors fall, Maren."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['nami', "I'm on your back, doctor. Like always."],
          ['hero', "Good. Inside that Crown is the thing that made every Husk I ever treated."],
          ['convergence', "The doctor. You kept my fuel alive for me. Thank you."],
          ['hero', "I kept my patients alive. They're about to pay you back."]
        ],
        win: [
          ['hero', "Spring Tide. In four times, and out."],
          ['sys', "Itsuki's Five Calamities fall, Nami's water among them. The Convergence breaks into light. The Crown falls."],
          ['hero', "The Legion has stopped. Somebody check their breathing. ...They're breathing. All of them."],
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
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the Sump's vents on the labs."],
          ['hero', "I ran that feed through my lab. Sump fire all round the boy, and he reads room temperature. That is no boy."],
          ['maren', "Then use your lab for something good, Elixa. Halcyon's guards on the Ring are full of your stimulants."],
          ['hero', "Then I'll give them a second colour. Blue to slow, green to sleep. Grand Experiment, everyone."]
        ],
        win: [
          ['hero', "Halcyon's own soldiers, asleep in the corridors. Serums reversed. Fascinating."],
          ['sys', "From the Crater: Mira's mirror shows the false Kael with no reflection. A copy. It runs."],
          ['hero', "No reflection and no heat. I'd love a sample. Later. The Spire first."]
        ] },
      5: { zone: 'noble', foe: 'lux', goal: "Bottle the light for one moment",
        intro: [
          ['sys', "The sky over the Crater splits. A hollow crown calls every Beyond-born home, and Lux answers."],
          ['sys', "The Noble Ring burns white. Behind Lux, the Hollow Legion marches through the glare."],
          ['hero', "Halcyon tried to bottle her and failed. I worked on that project. I know why it failed."]
        ],
        meet: [
          ['lux', "Chemist. You tried to bottle me. Now I bottle everything. White, and still, and done."],
          ['hero', "I was wrong to try. But I learned this: light holds still for exactly one moment, if the reaction is right."],
          ['lux', "Nothing holds light."],
          ['hero', "A reaction no one has tried. Red, blue, green, and you. Let's find out."]
        ],
        win: [
          ['sys', "For one moment the white light hangs still in a cloud of coloured smoke. Yara's arrow comes through. The crown breaks."],
          ['lux', "...You held me. Just for a breath. Long enough."],
          ['hero', "Light, bottled after all. For one moment. Never again, I promise. Fascinating, though."]
        ],
        lose: [
          ['lux', "Your flasks are glass, chemist. Glass breaks."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['hero', "The Hollow Legion. Husks, by the million. Same symptoms, same cause, same kind of engine."],
          ['ume', "The spores are ready. Your cure, chemist. Throw it."],
          ['hero', "Magnum Opus. Every colour, every reaction. Into the Legion."]
        ],
        win: [
          ['sys', "The cure rains through the Hollow Legion. Itsuki's Five Calamities break the Convergence into light."],
          ['hero', "The Legion is still. Their eyes are focusing. The cure for the Husks works on them too."],
          ['hero', "Pyra, cross me off the list. Maren, check the flasks. Ume, more spores. Lots more."],
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
      2: { zone: 'archive', with: 'tessa', goal: "Read the Director's last page",
        meet: [
          ['tessa', "Isa. You refused order forty-one. I've waited a few lifetimes for that."],
          ['hero', "Tessa. Subject 09. You read the future for the Director."],
          ['tessa', "I read him the bad endings. The good one I kept. Here. The last page of his story."],
          ['hero', "...He walks into his Engine, and comes out as something else. Can it be rewritten?"],
          ['tessa', "Not by me. I only read. You're the one who writes."],
          ['lin', "And I'm the one at the door. Halcyon is coming up the stacks, Isa. Write fast."]
        ],
        win: [
          ['hero', "Then I'll write a different last page. One word, big enough to unmake every law I sealed."],
          ['tessa', "I've seen that word once. In one ending. It's the good one."],
          ['lin', "Write it when you're ready. I'll be at the door."]
        ] },
      3: { zone: 'archive', rival: 'orin', goal: "Slam the door on Orin",
        meet: [
          ['sys', "The Archive. A magenta doorway opens in the middle of the reading room, and a grinning boy steps out of it."],
          ['orin', "Seal-writer. Your Archive has a lot of locked rooms. I'd like to see them."],
          ['hero', "Orin. You open doors, I close them, and we will never agree which is harder."],
          ['orin', "Opening. Obviously. Any fool can slam a door."],
          ['hero', "Then let's see you open one I've written shut."]
        ],
        win: [
          ['orin', "...All right. That one I couldn't open. Closing is harder. Today."],
          ['hero', "Today. I'll take today."],
          ['orin', "When it's time to close something big, seal-writer, I'll want you on the other side of it."]
        ],
        lose: [
          ['orin', "Every seal has a back door. Found it."]
        ] },
      4: { zone: 'noble', goal: "Write the Final Word",
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the vents. Deepline says Nyra led the drills."],
          ['hero', "Tessa says those faces are borrowed. She has read this page before. And Halcyon has its war law ready, in my ink."],
          ['lin', "I have your brush hand. Nobody comes near it. Write."],
          ['hero', "Every law the Director ever had me seal. One word for all of them."]
        ],
        win: [
          ['sys', "The Final Word falls across the sky in crimson ink. Every seal on every law of the Director's breaks at once."],
          ['hero', "Unwritten. The Proving Hall has no orders. The wards have no locks. The Subjects have their names."],
          ['sys', "From the Crater: Mira's mirror shows the false Kael with no reflection. Rue runs."]
        ] },
      5: { zone: 'pylon', foe: 'vega', goal: "Write the seal that holds the city",
        intro: [
          ['sys', "The sky over the Crater splits. A hollow crown calls every Beyond-born home, and Vega answers."],
          ['sys', "Pylon Chamber Six. Aurelia falls, and the Hollow Legion floods in."],
          ['hero', "If she lets go, the city needs something else to hold it. Ink will do."]
        ],
        meet: [
          ['vega', "Seal-writer. Your ink can't hold a falling star."],
          ['hero', "My ink held a whole city's laws for a year. It can hold its floor for a minute."],
          ['vega', "And when your minute ends?"],
          ['hero', "By then you'll have let go of him. Tessa read me that ending."]
        ],
        win: [
          ['sys', "Isa writes the seal across Chamber Six, and Aurelia hangs in it. Nyra sings, Tessa speaks, and Vega's crown breaks."],
          ['vega', "...The city is held. By ink. I can let go of him."],
          ['hero', "Let go. The seal will keep. Then pick the city up again, gently, when you're ready."]
        ],
        lose: [
          ['vega', "Ink runs, scholar. Everything falls."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['orin', "The door's open, seal-writer. Remember? You're on the other side of it."],
          ['hero', "I remember. Lin, my brush hand."],
          ['lin', "Always."]
        ],
        win: [
          ['hero', "Binding Script. Every letter of his name. Hold."],
          ['sys', "Itsuki's Five Calamities fall. The Convergence breaks into light, and the Hollow Crown falls into the Crater."],
          ['hero', "Orin, the door. You close it, I'll seal it. For once we agree which is harder: both."],
          ['hero', "Tessa, it's the good ending. Sen, I'll write you tonight. One line will do."],
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
        intro: [
          ['sys', "The Siege of the Noble Ring. The screens loop a Deepline boy opening the vents. Below, they say Nyra led the drills."],
          ['hero', "Watch the boy on that feed. No weight in his feet. Everyone stands like someone. He stands like nobody."],
          ['isa', "Then let's give Halcyon nothing to stand on. I'm writing the Final Word. Keep them off my hand."],
          ['hero', "Write. Nobody touches the brush."]
        ],
        win: [
          ['sys', "The Final Word crosses the sky in crimson ink. Every law the Director sealed comes undone."],
          ['hero', "Brush hand safe. Not a drop spilled. Breathe, Isa."],
          ['sys', "From the Crater: Mira's mirror shows the false Kael with no reflection. The one who stood like nobody."]
        ] },
      5: { zone: 'skylift', foe: 'mika', goal: "Seal the Call out of Mika",
        intro: [
          ['sys', "The sky over the Crater tears. A hollow crown calls every Beyond-born home, and Mika answers."],
          ['sys', "The Skylift. Mika cuts the cables, and the Hollow Legion pours down them toward the undercroft."],
          ['hero', "The crown calls through her. Every call needs a path. I close paths."]
        ],
        meet: [
          ['mika', "Quiet one. Can you hear it? The Crown is singing. Come home."],
          ['hero', "I hear it. It's loud. Loud is easy to hear, and easy to stop."],
          ['mika', "You can't stop the Call."],
          ['hero', "Every fifth strike seals. The crown cannot call through a sealed point."]
        ],
        win: [
          ['sys', "Five strikes, five sealed points, and the Call has no way in. Sora's string catches Mika. The hollow crown breaks."],
          ['mika', "...It's quiet. It's so quiet. Thank you."],
          ['hero', "Breathe. Coda and Sora are waiting. Let them shout at you."]
        ],
        lose: [
          ['mika', "Too slow, quiet one. Under the moons, I'm faster."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['kestra', "Fire first, sister!"],
          ['hero', "Then the fan. Then me. Zara, Isa: stay behind me."],
          ['vael', "A soft hand, against an empire of engines."],
          ['hero', "Soft hands find the seams. Every engine has seams."]
        ],
        win: [
          ['hero', "Hundred Palms. Every seam, every point. Sealed."],
          ['sys', "Itsuki's Five Calamities fall. The Convergence breaks into light, and the Hollow Crown falls into the Crater."],
          ['hero', "The Legion has stopped. The Clan can come up. Nobody needs to hide under the gold any more."],
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
      2: { zone: 'blank', with: 'noct', goal: "Bring a shadow to the Blank Wing",
        meet: [
          ['sys', "The Blank Wing. A room built with no shadows in it, to hold a Subject who walks in the dark. Subject 00."],
          ['hero', "...Noct."],
          ['noct', "...Vesper."],
          ['hero', "You kept the harbour's dark clean while I lit it. Here they took your dark away. So I brought a lamp."],
          ['sys', "The lamp flares. For the first time in a year there is a shadow in the Blank Wing, and Noct steps into it."],
          ['agent', "Shadow readings in the Blank Wing! Subject 00 is moving! All units!"]
        ],
        win: [
          ['noct', "...Not yet."],
          ['hero', "I know. Not yet. The lamp stays lit. When you're ready, walk."],
          ['noct', "...Thank you."]
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
      4: { zone: 'noble', goal: "Show Aldric the Husks",
        intro: [
          ['sys', "The Siege of the Noble Ring. Every screen loops a Deepline boy opening the vents on the labs. The Proving Hall marches."],
          ['hero', "That boy on the feed casts no shadow. Lamp behind him, lamp in front, nothing on the floor. I light lamps. I notice."],
          ['hero', "The knights will march on Deepline for a face with no shadow. Not if their captain sees first."],
          ['aldric', "Seventy-seven. You came to my Hall. Why?"],
          ['hero', "Come with me. Don't ask. Look."]
        ],
        win: [
          ['sys', "In the feed lines, Aldric sees the Husks. On the Ring, the Proving Hall turns around."],
          ['aldric', "I have been standing in the wrong place. No longer."],
          ['hero', "And the Crater says the Kael at the vents had no reflection either. No shadow, no reflection. Nobody."]
        ] },
      5: { zone: 'skyport', foe: 'corvin', goal: "Light a lamp in Corvin's dark",
        intro: [
          ['sys', "The sky over the Crater tears. A crown with nothing inside it calls, and Corvin answers."],
          ['sys', "The Skyport. Ten thousand crows put out the sun. In the dark, the Hollow Legion marches."],
          ['hero', "He puts out the sun. I light lamps."]
        ],
        meet: [
          ['corvin', "Lamplighter. The omen says dark forever. Your little lamps change nothing."],
          ['hero', "Your crows won't fly near Noct. I'm the one who keeps his lamps."],
          ['corvin', "...The dark is his. Not yours."],
          ['hero', "The dark is everyone's. The lamps are mine."]
        ],
        win: [
          ['sys', "Lamp by lamp, the Skyport lights up. The crows scatter, and in the light Isolde's falcon finds Corvin's crown."],
          ['corvin', "...Light. And ice. The omen was wrong. ...I'm glad."],
          ['hero', "Go and find your sister, crow-reader. She's in the dark down there. You know the way."]
        ],
        lose: [
          ['corvin', "Every lamp goes out, lamplighter."]
        ] },
      6: { goal: "Break the Hollow Crown",
        intro: [
          ['sys', "The Crown over the Crater. Orin opens a door; Vega and Lux hold Aurelia up while everyone crosses."],
          ['noct', "...Together."],
          ['hero', "Together. Scarf and shadow."],
          ['convergence', "Subject 77. Out of your ward again."],
          ['hero', "Every night, Director. You never once looked."]
        ],
        win: [
          ['hero', "Thousand Cuts. Already at the next lamp."],
          ['sys', "Itsuki's Five Calamities fall. The Convergence breaks into light, and the Hollow Crown falls into the Crater."],
          ['kessen', "The Engine, backwards. Once. The door is closing... almost."],
          ['noct', "...I stay. Someone keeps the dark clean."],
          ['hero', "Then I'll light a lamp beside you. Somebody has to keep the dark company."],
          ['hero', "You never saw me."]
        ] }
    }

  });
})();
