'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the spoken lines of every chapter for the heroes of the Surface, the Land.
// Data only; js/saga/saga-core.js plays it. Speakers: 'hero' (the hero being played), 'sys' (narration), a hero id,
// or 'director', 'kessen', 'vael', 'agent', 'citizen'.
(function () {
  const SW = window.SW; if (!SW.saga || !SW.saga.add) return;
  SW.saga.add({

    // ---------------------------------------------------------------- FENN
    fenn: {
      1: { zone: 'pens', goal: 'Break out of the Beast Pens',
        intro: [
          ['sys', "The Beast Pens, under Deepline. Halcyon keeps what it catches here. One cage was built for something larger."],
          ['hero', "Vharra. The hunting clans. When the sky tore over our camp, I set my storm-wolf between the tear and them."],
          ['hero', "It did not run. I fell. Now Halcyon thinks a cage will hold me."],
          ['agent', "Pen nine is awake! Get the prods. And somebody find out what it's chewing on."],
          ['hero', "Steel bars. I have bitten through worse."]],
        win: [
          ['sys', "The storm-wolf runs back out of the dark to him: violet lightning on four legs."],
          ['hero', "There you are. Up, then. Open sky."],
          ['hero', "And after the sky, Halcyon pays for the cage."]] },
      2: { zone: 'yard', with: 'kael', goal: 'Hold the Crusher Yard with Kael',
        meet: [
          ['kael', "Back off, wolf-man. This scrap pile's mine. Ferra said so."],
          ['hero', "That mark on your jacket. The storm-eye. Where are you from, kid?"],
          ['kael', "Vharra. Born under the thunderheads. Fell through the tear into this trash heap. What's it to you?"],
          ['hero', "That's the storm clans' mark. You're kin. Down here, I'm the closest thing to clan you've got."],
          ['kael', "Nobody asked for a big brother."],
          ['hero', "Nobody asked. Drones, over the wall. Stay behind me."],
          ['kael', "Behind you? Watch this!"]],
        win: [
          ['kael', "Not bad, for an old wolf. You can stay. Tonight."],
          ['hero', "I'll stay until you can handle a Halcyon captain on your own."],
          ['kael', "I just did!"],
          ['hero', "Then I'll stay until you stop shouting about it. A long while, then."]] },
      3: { zone: 'glowwild', rival: 'kova', goal: 'Take the trail from Kova',
        meet: [
          ['sys', "Something Halcyon let loose is killing in the Glowwild. Two hunters reach its trail at the same moment."],
          ['kova', "Back off, one-trick wolf. My forest. My hunt."],
          ['hero', "You'll go at it as a tiger, turn into a tortoise halfway, and get somebody killed. Step aside."],
          ['kova', "Every beast beats one wolf. Want me to prove it?"],
          ['hero', "Yes. Winner takes the trail."]],
        win: [
          ['kova', "Fine! Fine. The wolf is... good. For a wolf."],
          ['hero', "You're fast, kid. You're everything at once. And nothing all the way. Pick one and keep it."],
          ['kova', "We could hunt it together. You know. Since I'm so fast."],
          ['hero', "Keep up, then. And don't tell anyone we enjoyed it."]],
        lose: [
          ['kova', "Tiger, eagle, tortoise... and one wolf, lying down. Want to borrow a beast?"]] },
      4: { zone: 'meridian', goal: 'Lead the charge on the drills',
        intro: [
          ['sys', "The Ash Dunes. Halcyon's drills sink into the Buried Meridian while the three layers tear at each other."],
          ['citizen', "Deepline says a Sky girl, Nyra, led the drills into its tunnels. The Sky says a Deepline boy, Kael, gassed its labs."],
          ['hero', "Kael? Gassed a ward full of Subjects? That kid can't keep a secret for an hour. Somebody wore his face."],
          ['hero', "Up, wolf. Whatever is lying about my brother, we start by breaking its drills."]],
        win: [
          ['hero', "Drill camp's down. The pack ran with me, every one of them."],
          ['sys', "Word comes from the Crater: Mira held her mirror up to the Kael who opened the vents. It had no reflection."],
          ['hero', "A copy. I knew it. Nobody wears my little brother's face and walks away."]] },
      5: { zone: 'glowwild', foe: 'apis', goal: 'Hunt the swarm to its queen',
        intro: [
          ['sys', "The sky over the Crater splits from edge to edge. A crown the size of a city comes down through it."],
          ['sys', "Twelve Beyond-born answer its Call. In the Glowwild, Apis's swarm turns violet and starts to eat."],
          ['hero', "The Hollow Legion, in the trees. More of them than the steppe had grass. Wolf. Hunt."]],
        meet: [
          ['apis', "Come home, the Crown says. The hive is waiting. All of it. Every world it ever drank."],
          ['hero', "That isn't your hive talking. That's the engine that drank it."],
          ['apis', "Bzzz. Wolves don't understand a swarm. Get out of the forest."],
          ['hero', "I understand a pack. The pack against the swarm, then."]],
        win: [
          ['apis', "The Crown is so loud... and under it, the garden. Ume's garden is louder."],
          ['sys', "The scent of Ume's flowers drifts through the violet. The hollow crown over Apis cracks, and breaks."],
          ['apis', "...Wolf? My bees. Did they hurt the forest?"],
          ['hero', "Some. Forests grow back. So do hives. Get up, queen."]],
        lose: [
          ['apis', "Eight bees, and then all of them. One wolf is not a pack."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Hollow Crown hangs over it like a second sky. Inside, Vael and the Convergence wait together."],
          ['orin', "Door's open. Into the Crown. Don't stop to look at anything."],
          ['hero', "Brann. Kova. Kael. Run with me. One pack, one hunt."],
          ['vael', "A wolf. My Legion has eaten whole worlds of wolves."],
          ['hero', "Not this one."]],
        win: [
          ['sys', "The Convergence comes apart into light. The Hollow Crown falls into the Crater, and the Legion goes still."],
          ['kael', "Fenn! Did you see? Itsuki threw my thunder at him! My thunder!"],
          ['hero', "I saw. Loud as ever. Go home, Sparks. Ferra will want to shout at you."],
          ['hero', "The hunt is over."]] }
    },

    // ---------------------------------------------------------------- BRAKK
    brakk: {
      1: { zone: 'dig', goal: 'Dig your way out of Shaft Nine',
        intro: [
          ['sys', "Shaft Nine, Halcyon's deepest mine. Four hundred metres of rock overhead, and a new worker who never complains."],
          ['agent', "You. Big one. Take the drill. Dig until the shift bell, then dig some more."],
          ['hero', "On Vharra I kept the Standing Stones. The children followed my shadow because it was cool in summer."],
          ['hero', "The tear dropped me here. They gave me a drill. They did not say which way."],
          ['agent', "Down, you ox! The seam is DOWN!"],
          ['hero', "...Up, I think."]],
        win: [
          ['sys', "Four hundred metres later, a stone hand breaks through into grey daylight. Behind it, the rock rises like a dragon."],
          ['hero', "Grey. Not Vharra's sky. Still sky."],
          ['hero', "Now. Somewhere to stand."]] },
      2: { zone: 'village', with: 'hollis', goal: 'Hold the mountain with Hollis',
        meet: [
          ['sys', "A mountain no map shows. A huge man sits on it and does not move. An old man sits down beside him."],
          ['hollis', "Comfortable? You've been sitting on my mountain for three days."],
          ['hero', "On Vharra I stood by the Stones. Here, nothing needs me to stand anywhere."],
          ['hollis', "A mountain can choose where it stands, young one. That's the difference between a mountain and a rock."],
          ['hero', "...And if Halcyon's diggers come up the path?"],
          ['hollis', "Then I'd say they're coming now. Choose."],
          ['hero', "Here. I stand here."]],
        win: [
          ['hollis', "Well chosen. The village has a gate, a forge, a ring and a bell. And now a mountain."],
          ['hero', "The one in the ring keeps looking at me."],
          ['hollis', "Taro. He wants to know which of you is harder to move. Let him find out."]] },
      3: { zone: 'village', rival: 'taro', goal: 'Face Taro in the Village ring',
        meet: [
          ['taro', "Salt for the ring. A bow for the bell. Then we find out, mountain."],
          ['hero', "Find out what?"],
          ['taro', "Which of us is harder to move. I have stood in this ring since I was nine. Nobody has pushed me out."],
          ['hero', "I do not want to push you out. ...But you will not stop asking."],
          ['taro', "No. I will not."]],
        win: [
          ['sys', "Taro's heel stops on the very edge of the ring, one grain of salt from out. The whole village is shouting."],
          ['taro', "I could not move you one step. And you stopped one grain short of pushing me out. Why?"],
          ['hero', "The ring is yours. A mountain chooses where it stands. I chose not to stand there."],
          ['taro', "That is the most annoying thing anyone has ever said to me. Again tomorrow."]],
        lose: [
          ['taro', "Immovable. Bow, mountain. Then try again."]] },
      4: { zone: 'meridian', goal: 'Stop the drill with your hands',
        intro: [
          ['sys', "The Buried Meridian. Halcyon's biggest drill bites down toward the city still lying under the sand."],
          ['agent', "The Sky's at war with Deepline, Deepline with the Sky. Nobody's watching the Surface. Drill it all."],
          ['hero', "Deepline says a Sky girl led drills into its tunnels. The Sky says a Deepline boy gassed its labs."],
          ['hero', "Hollis says when everyone is shouting, look at who is quiet. Halcyon is very quiet. And drilling."]],
        win: [
          ['sys', "Brakk sets both stone hands on the drill-head. It screams, it smokes, and it stops."],
          ['agent', "It's one man! Why won't it turn?!"],
          ['hero', "Because there are people under this sand. And because I am standing here."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Carry Opal out of the Glass Sea',
        intro: [
          ['sys', "The sky splits over the Crater. Vael calls, and twelve answer. One of them is a girl made of crystal and fear."],
          ['sys', "The Glass Sea is growing: dunes, towns and roads turning to crystal, and the Legion marching across it."],
          ['hero', "Opal. She sits on my shoulder when she is scared. She must be very scared."]],
        meet: [
          ['opal', "Brakk? Don't come closer. The Crown says if everything is glass, nothing can break. Not ever again."],
          ['hero', "Glass breaks, little one. That is what glass does."],
          ['opal', "Then I'll make it thick. Go away, Brakk. Please. I don't want to glass you too."],
          ['hero', "I carried you out of here once. I can do it twice."]],
        win: [
          ['sys', "Crystal cracks off his arms in sheets. He reaches her anyway, and lifts her onto his shoulder."],
          ['opal', "...Brakk? I'm up high. I'm up high, so I'm not scared."],
          ['sys', "The hollow crown over her head breaks like thin ice."],
          ['hero', "There. The safest place on the near side. Hold on."]],
        lose: [
          ['opal', "Stay still, Brakk. It doesn't hurt. It just stops."]] },
      6: { goal: 'Give Itsuki the earth',
        intro: [
          ['sys', "The Crater. Inside the Crown, Vael and the Convergence fight side by side: the last two engines."],
          ['itsuki', "Brakk. I need the earth. All of it. The kind that does not move."],
          ['hero', "Then it is yours. Do not drop it."]],
        win: [
          ['sys', "Fire, wind, thunder, earth, water. Itsuki strikes, and the Hollow Crown falls into the Crater."],
          ['opal', "Brakk, look. The glass shines in the sun. It's pretty, when nobody's scared of it."],
          ['hero', "Pretty. Dune might even agree, one day. Not today."],
          ['hero', "The mountain chose where to stand. It stood."],
          ['hero', "Stone remembers. Stone endures."]] }
    },

    // ---------------------------------------------------------------- JAX
    jax: {
      1: { zone: 'saloon', goal: 'Clear Halcyon out of the Long Bar',
        intro: [
          ['sys', "The Long Bar at Mile Zero, the last stop before the open wastes. Every road on the Surface starts on its porch."],
          ['hero', "Came through the tear with a revolver, a deck of cards and my grandmother laughing as she dealt me in. Kept all three."],
          ['agent', "Halcyon requisition. Your bar's a checkpoint now. And we're taking that runner who drinks here."],
          ['hero', "Tarn's out on the road. And this is a bar. You want a drink, or do you want the other thing?"],
          ['agent', "Take him."],
          ['hero', "The other thing, then."]],
        win: [
          ['hero', "Five to make a point. The sixth ends the conversation."],
          ['citizen', "They'll come back with more, Jax."],
          ['hero', "Then I'll keep the water cold and the gun warm. Every road starts here. None of theirs."]] },
      2: { zone: 'milezero', with: 'tarn', goal: 'Hold Mile Zero with Tarn',
        meet: [
          ['tarn', "Water. Cold. Please. Nine towns since dawn, and every one had a Halcyon checkpoint."],
          ['hero', "Always cold. Sit. ...You ran nine towns with Halcyon on your tail?"],
          ['tarn', "They can't keep up. That's the point. But they followed me here. Sorry."],
          ['hero', "Don't be. A porch is for meeting folks. Some get a drink. Some get the other thing."],
          ['tarn', "I'll take the left. You take everyone else."]],
        win: [
          ['tarn', "Captain's down. You missed a shot."],
          ['hero', "I never miss. That was a warning. The sixth was for the captain."],
          ['tarn', "Same time tomorrow. Keep the water cold."],
          ['hero', "Always is, runner."]] },
      3: { zone: 'milezero', rival: 'yara', goal: 'Duel Yara at ten paces',
        meet: [
          ['yara', "Ten paces, Jax. Your distance. Beat me here and the bet's yours. Lose, and it's mine at every range."],
          ['hero', "And if you lose, you buy. Nobody's bought a single drink on this bet."],
          ['yara', "Halcyon had me shooting at a mile for a year. I'm going back up to answer for it. I want this settled first."],
          ['hero', "Then we settle it. Ten paces. Draw when the bell's done."]],
        win: [
          ['yara', "...Ten paces is yours. A mile is still mine."],
          ['hero', "A mile's a long way off to need a friend. Ten paces is where they stand."],
          ['yara', "Fine. I'm buying."],
          ['hero', "First drink anyone's bought on this bet. Make it cold."]],
        lose: [
          ['yara', "Ten paces, a mile. It's all the same distance to an arrow."]] },
      4: { zone: 'meridian', goal: 'Six shots, six drill-heads',
        intro: [
          ['sys', "The Buried Meridian. Six Halcyon drills turn in the sand, and the Long Bar's regulars have come with rifles."],
          ['citizen', "They say a Deepline boy gassed the Sky's labs and a Sky girl drilled Deepline. Whose side are we on, Jax?"],
          ['hero', "Two faces, same week, both doing Halcyon's work. I've played cards. That's a stacked deck."],
          ['hero', "We're on the side that isn't drilling. Six drills. I count six bullets."]],
        win: [
          ['sys', "Six shots ring out over the dunes. Six drill-heads grind to a stop."],
          ['hero', "Five to make a point."],
          ['hero', "The sixth to end the conversation. Somebody tell Halcyon the bar's closed."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Stand against Itsuki',
        intro: [
          ['sys', "The sky splits. In the Ash Dunes, the Hollow Legion fills the sand from edge to edge, and one fighter walks in front."],
          ['sys', "Itsuki, Vael's champion, eyes gone violet. Ivo is down. Tarn is down, and running for help anyway."],
          ['hero', "Strongest thing I've ever seen, and it's walking toward my bar. ...Nope."]],
        meet: [
          ['itsuki', "Fire, wind, thunder, earth, water. And you have a pistol."],
          ['hero', "Six shots and a deck of cards. You'd be surprised what that's beaten."],
          ['itsuki', "Nothing on the near side can stand in front of me. The Crown made sure of it."],
          ['hero', "Then I'll stand off to the side and shoot. High noon, champ."]],
        win: [
          ['sys', "Six shots, six hits. Itsuki shrugs them off like rain, and the wheel turns, and Jax is face down in the sand."],
          ['hero', "...Huh. Six for six, and he's still standing. Strongest thing I've ever seen."],
          ['itsuki', "You made me stop. For a breath. Nobody else has."],
          ['hero', "One breath at a time, kid. Your brother's coming. Hope he's faster than me."]],
        lose: [
          ['itsuki', "The wheel turns. Get up, gunslinger. Or don't."]] },
      6: { goal: 'Cover the crossing at the Crater',
        intro: [
          ['sys', "The Crater. Vega and Lux hold Aurelia in the sky while everyone crosses into the Crown through Orin's door."],
          ['hero', "Ten paces, a door, and a king with nothing in his hat. I've seen worse hands."],
          ['yara', "I've got the mile. You've got the ten paces. Nothing gets in between."]],
        win: [
          ['sys', "Itsuki's last blow lands. The Hollow Crown falls into the Crater. The Legion stops, all at once."],
          ['yara', "That's it. That's the drink I'm buying, Jax."],
          ['hero', "Put it on the porch. Tarn's going to be thirsty, and the water's cold."],
          ['hero', "High noon, partner."]] }
    },

    // ---------------------------------------------------------------- TARN
    tarn: {
      1: { zone: 'milezero', goal: 'Run the post past the checkpoint',
        intro: [
          ['sys', "Mile Zero, before dawn. A runner jogs on the spot with letters in his shirt."],
          ['hero', "Vharra's steppe, end to end, is forty days on a good horse. I did it in nineteen. On foot."],
          ['hero', "When the tear came, I walked in front of it nine hundred miles, shouting run at every camp. Then I turned and hit it."],
          ['agent', "Halcyon checkpoint. All post is confiscated. Hand over the bag, runner."],
          ['hero', "Letters don't stop for checkpoints. Neither do I."]],
        win: [
          ['hero', "Every hit harder than the last. They should have stopped me at the first one."],
          ['citizen', "Is that the post? From the Crater rim? We thought the road was cut!"],
          ['hero', "Nothing's cut while I've got legs. Next town's forty miles. See you tomorrow."]] },
      2: { zone: 'saloon', with: 'fenn', goal: 'Run the hounds off the porch',
        meet: [
          ['fenn', "Tarn. Nineteen days across the steppe, and you still can't sit still."],
          ['hero', "Fenn! You're alive! I ran in front of the tear shouting at every camp. I never found yours."],
          ['fenn', "My wolf stood in front of it. I fell. Woke in a Halcyon cage. Bit my way out."],
          ['hero', "That sounds like you. Jax, two waters. Cold."],
          ['fenn', "Later. Halcyon's hounds followed my scent to this porch. Sorry."],
          ['hero', "Like old times. You hunt. I run circles round them."]],
        win: [
          ['fenn', "Still the only one who keeps pace with the wolf."],
          ['hero', "The wolf's the one thing I never outran. Don't tell it."],
          ['hero', "The steppe is gone, Fenn. But a porch and a friend is a start."]] },
      3: { zone: 'milezero', rival: 'ivo', goal: 'Outrun Ivo at Mile Zero',
        meet: [
          ['ivo', "Tarn! Before dawn, Mile Zero, like I said. Today I catch you."],
          ['hero', "Ivo, I've got a letter for the Crater rim and Halcyon's tailing the post. I don't have time."],
          ['ivo', "Then fight me on the way. If I land one, I run the route with you. If not, I go back up the mountain."],
          ['hero', "Deal. Try to keep up."]],
        win: [
          ['ivo', "I touched you! Did you feel that? My knuckle touched your vest!"],
          ['hero', "...Almost. That was almost."],
          ['ivo', "From you, almost is basically a win! How are you still faster? I train before every dawn!"],
          ['hero', "I train at night. Don't tell anyone."],
          ['ivo', "...You WHAT?"]],
        lose: [
          ['ivo', "Caught you! Finally! Get up. We're running the rest of the route together."]] },
      4: { zone: 'meridian', goal: 'Carry the word to every town',
        intro: [
          ['sys', "The night before the Drills. Every town on the Surface has heard a different story, and every story is a lie."],
          ['citizen', "The Sky's girl Nyra drilled Deepline! Deepline's boy Kael gassed the Sky! It's war, runner. Pick a side."],
          ['hero', "Same two faces in two stories in one week. Faces can be borrowed. Halcyon's drills can't."],
          ['hollis', "Tarn. Every town, one night. The Buried Meridian, at dawn. The Surface stands together, or it gets drilled."],
          ['hero', "Every town. One night. Easy."]],
        win: [
          ['sys', "By dawn, every town on the Surface has heard. By noon, they are all at the Buried Meridian."],
          ['hero', "Forty towns in one night. The nine hundred miles were harder."],
          ['jax', "You look like a man who needs water."],
          ['hero', "Cold. Please. Then point me at the drills."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Hold Itsuki, then run for help',
        intro: [
          ['sys', "The sky splits from edge to edge. In the Ash Dunes, Itsuki walks in front of the Legion with violet eyes."],
          ['sys', "Ivo was the first to face him. Ivo is down."],
          ['hero', "Ivo! ...Okay. Every hit lands harder than the last. I just have to keep hitting."]],
        meet: [
          ['itsuki', "You're the runner. Gale told me about you. He says you call his wind cheating."],
          ['hero', "It is. Get out of the dunes, Itsuki. This isn't you."],
          ['itsuki', "The Crown says it is. Run, runner. That's what you're good at."],
          ['hero', "I ran nine hundred miles in front of a tear. Then I turned round and hit it."]],
        win: [
          ['sys', "Tarn lands everything he has ever walked in one punch. Itsuki takes it. The wheel turns, and Tarn goes down."],
          ['hero', "...He's the strongest thing... in any world."],
          ['hero', "Can't beat him. Can still run. Ryo, his brother. Kael, his thunder. Both, tonight."],
          ['sys', "Tarn gets up, and runs."]],
        lose: [
          ['itsuki', "Keep running, runner. The Crown has longer legs."]] },
      6: { goal: 'Race Gale to the Crown',
        intro: [
          ['sys', "The Crater. Orin's door hangs open into the Crown, where Vael and the Convergence wait. The Legion stands in between."],
          ['gale', "Race number twelve, Tarn. First to the door."],
          ['hero', "You're riding the wind again. Cheating. ...Go!"]],
        win: [
          ['sys', "Itsuki strikes the last blow. The Hollow Crown falls into the Crater, and the Legion stops."],
          ['gale', "That's a tie. Race twelve is a tie."],
          ['hero', "Tie? I was at the door first. You were in the air. Air doesn't count."],
          ['hero', "Keep up next time."]] }
    },

    // ---------------------------------------------------------------- BRANN
    brann: {
      1: { zone: 'icehouse', goal: 'Walk out of the Ice House',
        intro: [
          ['sys', "Halcyon's Ice House. Cold rooms, thick walls, and a Subject they cannot keep asleep."],
          ['agent', "He's awake again! Double the dose! It's a bear, it's a man, it's... it's both!"],
          ['hero', "North of Vharra there were bears that walked like men, and men who fought like bears. I am the last of either."],
          ['hero', "Your walls are thick. I have walked through thicker snow."]],
        win: [
          ['sys', "The wall of the Ice House now has a hole in it the shape of a very large man."],
          ['hero', "North. Where nobody goes, and nobody bothers me."],
          ['hero', "Anyone who follows will learn why nobody does it twice."]] },
      2: { zone: 'icehouse', with: 'kova', goal: 'Teach Kova the bear',
        meet: [
          ['sys', "The cold northern rim. Snow, wind, and for the thirtieth day running, a boy following an old bear."],
          ['kova', "Day thirty! Teach me the bear. Tiger, eagle, tortoise, I've got. The bear's the one I can't catch. Please!"],
          ['hero', "You talk more than the wind."],
          ['fenn', "He's been talking since the Glowwild. I'd teach him just to get the quiet back."],
          ['hero', "Halcyon's catchers are on the slope. Fight beside me without one word, boy, and I teach you the bear."],
          ['kova', "Deal! I mean... (nods very hard)"]],
        win: [
          ['kova', "..."],
          ['hero', "Good. Not one word. The bear is quiet until it is not. Lesson one."],
          ['fenn', "Lesson one took thirty days."],
          ['hero', "Lesson two will take longer."]] },
      3: { zone: 'icehouse', rival: 'isolde', goal: 'Settle whose winter it is',
        meet: [
          ['isolde', "You invited me north to say it to your face. So: winter answers to me."],
          ['hero', "Winter answers to no one. But it listens to me."],
          ['isolde', "Halcyon kept me in a vault colder than this for a year. I never minded the cold. I minded the glass."],
          ['hero', "No glass here. Only snow. Say it again, falconer, and we see who the snow listens to."],
          ['isolde', "Winter answers to me."]],
        win: [
          ['isolde', "...Fine. Winter listens to you. Today."],
          ['hero', "Today is enough. Stay for tea. The bird can sit by the window."],
          ['isolde', "It's made of ice. It doesn't need a window."],
          ['hero', "Everyone needs a window."]],
        lose: [
          ['isolde', "Hush. Even bears sleep in winter."]] },
      4: { zone: 'meridian', goal: 'Bring the north south',
        intro: [
          ['sys', "The Buried Meridian. The drills grind. All night Tarn ran, shouting for every town to come."],
          ['hero', "The runner says a Sky girl drilled Deepline and a Deepline boy gassed the Sky. Fenn says the boy is his brother."],
          ['hero', "I believe the wolf. Faces lie. Snow does not."],
          ['hero', "Halcyon wants the Surface to sit still while they drill it. The north does not sit. The north comes south."]],
        win: [
          ['sys', "Snow falls on the Ash Dunes for the first time in a hundred years. The drill crews run from it."],
          ['hero', "That was not winter. That was a bear in a bad mood."],
          ['kova', "Can I say something now?"],
          ['hero', "No."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Keep getting up against Itsuki',
        intro: [
          ['sys', "The sky over the Crater splits. In the Ash Dunes, Ivo is down. Tarn is down. Jax is down."],
          ['sys', "Itsuki, Vael's champion, walks on toward the Hidden Village, and the Legion follows him like a tide."],
          ['hero', "The last bear in any world. Then let us see the strongest fighter in any world."]],
        meet: [
          ['itsuki', "Old man. Move. You're the last thing between me and the village."],
          ['hero', "Then I am the right thing to be between you and the village."],
          ['itsuki', "Fire, earth, water. Each of them has knocked down bigger than you."],
          ['hero', "Knock me down, boy. Then watch what I do next."]],
        win: [
          ['sys', "The last bear falls. He gets up."],
          ['sys', "He falls again. He gets up again."],
          ['itsuki', "...Why do you keep getting up?"],
          ['hero', "Because two boys are running here behind you. I am buying them time, with the only coin I have."],
          ['sys', "Over the dunes come white light, black light, and thunder. Ryo and Kael are here."]],
        lose: [
          ['itsuki', "Stay down, bear. It's winter. Bears sleep."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Legion stands in the dust, more than anyone can count. Over it, the Crown, and two engines inside."],
          ['hero', "The Last Winter. Four times, if I have to."],
          ['fenn', "Out-howl me, old man. Like always."],
          ['hero', "Like always."]],
        win: [
          ['sys', "The Crown falls into the Crater. Snow drifts down over it, and the Legion lies still."],
          ['itsuki', "Old bear. You kept getting up. Thank you."],
          ['hero', "You came back. That is thanks enough."],
          ['isolde', "Snow. In the Crater. Showing off."],
          ['hero', "Winter is mine."]] }
    },

    // ---------------------------------------------------------------- DUNE
    dune: {
      1: { zone: 'dunes', goal: 'Guard the Buried Meridian',
        intro: [
          ['sys', "The Ash Dunes. Under them lies the Buried Meridian, a city that went down with its people still in it."],
          ['hero', "They are still here, under the sand. I keep them."],
          ['hero', "Some say I was one of them. Some say I am the sand they lie in, standing up. I correct neither."],
          ['sys', "Over the dunes come Tarek's chain raiders, with shovels and Halcyon's money."],
          ['hero', "Diggers. Again. Nobody digs up the dead to sell them."]],
        win: [
          ['hero', "The sand keeps what it takes. Go home, raiders."],
          ['sys', "On the far ridge, a chain rattles. Tarek is watching. He always is."],
          ['hero', "Next year, chain-man. And the year after. I am patient. I am sand."]] },
      2: { zone: 'dunes', with: 'hollis', goal: 'Hold the longest night with Hollis',
        meet: [
          ['sys', "The longest night of the year. An old man walks into the desert, as he does every year, and sits."],
          ['hollis', "Evening, Dune. Brought tea. You won't drink yours. I'll drink it for you."],
          ['hero', "Every year. Why do you come?"],
          ['hollis', "Because it's the longest night, and nobody should sit through it alone. Not even sand."],
          ['hero', "...Halcyon's survey crews. They come at night now. They want the city."],
          ['hollis', "Then we'll stand up for a bit. Then we'll sit back down."]],
        win: [
          ['hollis', "There. Tea's cold. Worth it."],
          ['hero', "Hollis. If I was one of them once, the people under the sand... would you still come?"],
          ['hollis', "Every year. It's not the sand I come to see."]] },
      3: { zone: 'meridian', rival: 'tarek', goal: 'Fight Tarek over the buried city',
        meet: [
          ['tarek', "Dune. My crew's dug this ground six years. How many of my chains have you buried? I've lost count."],
          ['hero', "Thirty-one. You cannot count them. I can. They lie down there with my people."],
          ['tarek', "Halcyon pays triple now. They want the deep levels. One more fight, and the city's mine."],
          ['hero', "Then come. You never come to anyone. Today I come to you."]],
        win: [
          ['tarek', "...Thirty-two chains."],
          ['sys', "On the horizon, behind the raiders' camp, something huge with Halcyon's sun on its side begins to turn."],
          ['tarek', "Triple pay... They're not buying any more. They're bringing drills. They'll dig it all."],
          ['hero', "Then whoever is on top of it is buried twice. You. Me. Everyone."]],
        lose: [
          ['tarek', "Reeled in. Thirty-one chains, Dune, and I only ever needed one."]] },
      4: { zone: 'meridian', goal: "Hold one end of Tarek's chain",
        intro: [
          ['sys', "The Buried Meridian. Halcyon's drills sink into the sand while the layers above and below blame each other."],
          ['citizen', "Deepline says the Sky's girl, Nyra, led drills into its tunnels. Now the same drills are here. Was she here too?"],
          ['hero', "A face is easy to wear. Sand knows the truth. These drills are Halcyon's, whoever's face walked in front."],
          ['sys', "A man walks into the desert. No chain on his arm, no sickle. Tarek, unarmed, holding out one end of his chain."],
          ['tarek', "They'll bury everyone, Dune. Take it. One end each."]],
        win: [
          ['sys', "Crystal grows out of the Glass Sea and seizes a drill. Opal's glass. For the first time, Dune lets it stand."],
          ['tarek', "You're letting the glass help? You?"],
          ['hero', "Today. Hold your end of the chain."],
          ['tarek', "Holding. I still don't like you."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Reach Opal on the Glass Sea',
        intro: [
          ['sys', "The sky splits. Twelve answer the Call. On the Glass Sea, Opal is turning the Surface to crystal, mile by mile."],
          ['sys', "The Hollow Legion marches over the new glass. Under it, the dunes go silent."],
          ['hero', "My desert. Again. All of it, this time."]],
        meet: [
          ['opal', "Dune. You never forgave me for the first night. Now you won't have to. I'll glass it all, and it'll be over."],
          ['hero', "That is the Crown speaking. You glassed my desert because you were afraid. This, you do because he told you."],
          ['opal', "...Does it matter? It's still glass."],
          ['hero', "It matters. Fear, I can forgive."]],
        win: [
          ['sys', "Dune's sand rises against the Legion. Opal's crystal rises beside it. For one night, the glass helps."],
          ['hero', "Look, girl. Sand and glass. The same wall."],
          ['opal', "You're letting it stay? You hate the glass."],
          ['hero', "I hated the glass. Never the girl. And I forgive the glass."],
          ['sys', "The hollow crown over Opal's head cracks, and breaks. Brakk is already running across the glass to catch her."]],
        lose: [
          ['opal', "Hold still, Dune. Glass doesn't drift. Glass doesn't bury anyone."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Legion stands from rim to rim. Above it, the Hollow Crown, and two engines inside it."],
          ['tarek', "One end each, Dune?"],
          ['hero', "One end each. Bury them."]],
        win: [
          ['sys', "The Hollow Crown falls into the Crater. The Legion goes still, and the sand begins, gently, to cover it."],
          ['hero', "So many. Emptied out of their own worlds. Nobody should lie unburied."],
          ['tarek', "You're going to guard them too, aren't you."],
          ['hero', "Somebody must. Rest now, all of you."],
          ['hero', "Buried with the city."]] }
    },

    // ---------------------------------------------------------------- HOLLIS
    hollis: {
      1: { zone: 'village', goal: 'Defend the Hidden Village',
        intro: [
          ['sys', "A mountain no map shows. The Hidden Village of the Clans, and its elder, who has not moved since breakfast."],
          ['hero', "I remember the night after the Ashfall War. The rich went up, the poor went down. A few of us swore to live in all three."],
          ['hero', "I wrote the Pact by firelight. Oda rang the bell over it. We still argue about the second line."],
          ['agent', "Halcyon survey. This mountain isn't on any map, so it's ours. Clear the old man out."],
          ['hero', "Standing still gathers Stillness, young man. And I have been standing still a very long time."]],
        win: [
          ['hero', "There. Now the mountain is on somebody's map. Mine."],
          ['sys', "Down the path, the bell of the Last Toll rings once. Oda's way of saying well done."],
          ['hero', "Don't gloat, Oda. You'd have rung it either way."]] },
      2: { zone: 'village', with: 'ivo', goal: 'Test Ivo at the Village gate',
        meet: [
          ['sys', "Dawn at the Hidden Village. A boy of fourteen sits by the gate, as he has every dawn for a year."],
          ['ivo', "Three hundred and sixty-five. A year of sunrises, Elder. You said wait for the sunrise. I waited."],
          ['hero', "So you did. Most leave after a week. Brakk sat on my mountain for three days, and I thought that was long."],
          ['brakk', "It was long."],
          ['ivo', "Teach me. Please."],
          ['hero', "First lesson, then. Halcyon's coming up the path. Start before they're ready, and don't stop until it's done."]],
        win: [
          ['ivo', "Was that the lesson? I just hit them really fast."],
          ['hero', "The year was the lesson. This was the test. You passed both, young one."],
          ['brakk', "He will be up before every dawn now."],
          ['hero', "Good. So will I. Somebody has to watch him."]] },
      3: { zone: 'village', rival: 'oda', goal: 'Argue the Pact out with Oda',
        meet: [
          ['sys', "The Temple of the Last Toll. Two old men, and one argument about one line, ninety-six years long."],
          ['hero', "The second line says the Clans keep the layers from killing each other. It does not say we fight Halcyon's war."],
          ['sys', "Oda rings the bell. Once. Hard."],
          ['hero', "I know what Halcyon does. I know they take children. ...I know about Coda, old friend."],
          ['sys', "The bell rings again. Then Oda sets it down, and raises his fists."],
          ['hero', "Ninety-six years of arguing with a bell. Fine. Fists, then. The winner reads the line."]],
        win: [
          ['hero', "Ha. Still got it. ...So have you. My jaw is ringing louder than your bell."],
          ['sys', "Oda sits in the temple doorway, smiling, and waits."],
          ['hero', "Fine. We go down the mountain. We stand with them, not just between them. You win the line. I win the fight."],
          ['sys', "The bell rings once, very softly. It sounds a lot like laughter."]],
        lose: [
          ['sys', "The bell rings over Hollis, flat on the temple floor. It sounds exactly like I told you so."]] },
      4: { zone: 'meridian', goal: 'Cross out three, write four',
        intro: [
          ['sys', "The Buried Meridian. The Surface stands together for the first time, and Halcyon's drills grind toward it."],
          ['hero', "The Sky says Deepline's boy gassed its labs. Deepline says the Sky's girl drilled its tunnels. Two faces. One liar."],
          ['hero', "When everyone is shouting, look at who is quiet. Halcyon is quiet, and its drills are very loud."],
          ['sys', "At the Hidden Village, the bell rings three times. In ninety-six years, Oda has never rung it three times."],
          ['hero', "Three. ...Oh, old friend. Everyone! To the drills!"]],
        win: [
          ['sys', "Word from the Crater: Mira's mirror. The Kael who opened the vents had no reflection. A copy, wearing faces."],
          ['hero', "Then the layers were never at war. Someone wanted them to be. Bring me the Pact, and a brush."],
          ['sys', "Hollis crosses out three layers and writes four: Aurelia, the Surface, Deepline, and the Beyond-born who stood with them."],
          ['hero', "Four banners. Four sides of the Spire. Up we go, young ones."]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Free Ryo at the Tether Fields',
        intro: [
          ['sys', "The sky over the Crater splits. Vael calls every Beyond-born home, and twelve answer."],
          ['sys', "At the Tether Fields, Ryo pulls the great tethers out of balance, and the Legion pours over the anchor stones."],
          ['sys', "Overhead, Aurelia lurches."],
          ['hero', "Ryo. You and I talked all night once, about keeping two sides even. Look at you now."]],
        meet: [
          ['ryo', "Step back, Hollis. The Crown says the sides were never meant to balance. One falls so the other can rise."],
          ['hero', "That's not balance, young one. That's a seesaw with a king sitting on one end."],
          ['ryo', "Itsuki is in the Ash Dunes, breaking everything. The Crown says I should be glad."],
          ['hero', "Are you?"],
          ['ryo', "Light Palm. Dark Palm. Hold still, old man."]],
        win: [
          ['sys', "Hollis stands still and takes everything. Stillness gathers. Across the field, Oda's bell rings through the crown."],
          ['sys', "The hollow crown over Ryo cracks down the middle, and breaks."],
          ['ryo', "Hollis... the tethers. Aurelia. Did I..."],
          ['hero', "Taro and Tor held them. Now listen: your brother is breaking the Surface in the Ash Dunes. He needs you. Go."],
          ['ryo', "Itsuki. ...I'm going."]],
        lose: [
          ['ryo', "Out of balance, old man. You're leaning."]] },
      6: { goal: 'Raise the Pact of Four',
        intro: [
          ['sys', "The Crater. The banners of the Pact of Four stand on its rim: Aurelia, the Surface, Deepline, the Beyond-born."],
          ['hero', "Ninety-six years I kept three layers from killing each other. Today they need no keeping. Today they need a push."],
          ['sys', "Orin opens a door into the Crown, where Vael and the Convergence wait. The Elder Mountain stamps three times."]],
        win: [
          ['sys', "The Crown falls into the Crater. The Hollow Legion goes still, like an army finally allowed to stop."],
          ['sys', "Later, over the Pact of Four, Oda rings the bell once and breaks his vow for one word."],
          ['hero', "Together. He said together. ...He says he didn't. The old bell is not saying."],
          ['sys', "Hollis pats the nearest head. It happens to be Itsuki's."],
          ['hero', "Rest, young one."]] }
    },

    // ---------------------------------------------------------------- UME
    ume: {
      1: { zone: 'glowwild', goal: 'Weed Halcyon out of the garden',
        intro: [
          ['sys', "The Glowwild, a forest that glows because Halcyon poisoned it. In the middle of it, the loveliest garden on the Surface."],
          ['hero', "If the forest was going to be poison, it was going to be beautiful poison. That was my first rule."],
          ['hero', "My second rule: do not touch any of it."],
          ['agent', "Collection team. We're taking samples. All of them. Halcyon owns whatever grows on its waste."],
          ['hero', "Oh, help yourselves. Start with the pretty ones."]],
        win: [
          ['hero', "Spore Puff, Vine Snap, and a Corpse Flower to finish. They touched the pretty ones."],
          ['sys', "Bees drift in over the flowers, starving, humming. Ume holds out a palm of nectar."],
          ['hero', "There, little ones. Eat. Nobody else would let you near. My garden will."]] },
      2: { zone: 'glowwild', with: 'apis', goal: 'Guard the swarm with Apis',
        meet: [
          ['apis', "Bzzz. Gardener. Your flowers are poison, and my bees are eating them anyway. That's how hungry they are."],
          ['hero', "Not those ones. These. I grew them for you last night. Nothing in them will hurt a bee."],
          ['apis', "...Why? Everyone else sees a swarm and thinks of the engine that ate my hive."],
          ['hero', "I see a swarm and think: pollinators. Do you know how hard good help is to find in a poisoned forest?"],
          ['apis', "Halcyon's collectors are back. They want my bees in a jar."],
          ['hero', "They want everything in a jar. You sting them. I'll poison them. A garden needs both."]],
        win: [
          ['apis', "Honey. From your flowers. The only safe sweet thing in the whole Glowwild."],
          ['elixa', "Ume. I need spores again. For a cure. For the Husks Halcyon makes."],
          ['hero', "I always check what for. ...That's a good answer, Elixa. Take two."]] },
      3: { zone: 'glowwild', rival: 'thorne', goal: 'Out-garden Thorne',
        meet: [
          ['thorne', "Good evening, Ume. Cuttings, as every spring. And shears, this time."],
          ['hero', "Shears. In my garden. That's a bold thing to bring into a poison garden, Thorne."],
          ['thorne', "Your roots have come through my catacomb ceiling, and something drips from them onto my dead. I've come to prune."],
          ['hero', "That's Halcyon's runoff, not my roots. And nobody prunes my garden but me."],
          ['thorne', "Then let us settle it as gardeners. Whatever is still standing at the end, grows."]],
        win: [
          ['thorne', "Achoo. ...Your pollen. You've won, and I shall be sneezing for a week."],
          ['hero', "Two weeks. I bred it stronger. Now, the dripping: we follow it back to Halcyon's dump pipe. Together."],
          ['thorne', "A joint pruning. How delightful."]],
        lose: [
          ['thorne', "Cut back hard, a garden grows stronger. You'll see, in spring."]] },
      4: { zone: 'meridian', goal: 'Bloom the Glowwild over the camp',
        intro: [
          ['sys', "The Drills at the Buried Meridian. Halcyon's drill camp sits on the edge of the Glowwild, pumping waste into it."],
          ['hero', "Up top, a Deepline boy gassed the Sky. Down below, a Sky girl drilled the tunnels. Pretty stories. Poisonous."],
          ['hero', "Somebody grafted the wrong face onto the wrong stem. I know a graft when I see one."],
          ['hero', "And meanwhile, Halcyon dumps on my forest. Let's give them something back."]],
        win: [
          ['sys', "The whole Glowwild blooms at once over the drill camp: spores, vines, flowers taller than the rigs."],
          ['agent', "Don't touch anything! Don't touch ANYTHING!"],
          ['hero', "Good advice. A little late."]] },
      5: { zone: 'glowwild', foe: 'apis', goal: 'Call Apis home to the garden',
        intro: [
          ['sys', "The sky splits from edge to edge. The Hollow Crown calls, and in the Glowwild, a swarm turns violet."],
          ['sys', "Apis's bees are eating the forest, and the Hollow Legion marches in through the gaps they leave."],
          ['hero', "My garden. My bees. ...Oh, Apis. Not you."]],
        meet: [
          ['apis', "Ume. The Crown is calling me home. My hive is there. My whole world, waiting."],
          ['hero', "Your hive was drunk dry by an engine. That's the engine calling. You told everyone what engines become."],
          ['apis', "It sounds like my hive. It sounds like a million wings."],
          ['hero', "Then listen to something smaller. Listen to the garden. I planted it for you."]],
        win: [
          ['sys', "Through the violet comes the smell of the flowers Ume grew for the bees. The swarm wavers, turns, and comes home."],
          ['apis', "...Ume? The garden is louder than the Crown."],
          ['sys', "The hollow crown over Apis breaks."],
          ['hero', "Of course it is. I grew it that way. Now, your bees owe my forest a great deal of pollinating."]],
        lose: [
          ['apis', "Bzzz. You fed us, gardener. Now we feed."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Hollow Legion fills it rim to rim. The Crown hangs over it like a dead sun, two engines inside."],
          ['apis', "My swarm, your spores. Together?"],
          ['hero', "Together. Last Spring, across the whole floor."]],
        win: [
          ['sys', "Itsuki's last blow falls. The Crown drops into the Crater, and the Legion goes still."],
          ['elixa', "Ume. The cure, with your spores. It works on the Legion too. They're... resting."],
          ['hero', "Then I'll plant something over them. Something lovely."],
          ['hero', "Beautiful, isn't it? Deadly too."]] }
    },

    // ---------------------------------------------------------------- KOVA
    kova: {
      1: { zone: 'glowwild', goal: 'Chase Halcyon out of the Glowwild',
        intro: [
          ['sys', "The Glowwild at dawn. A Halcyon hunting party is setting traps for the forest's beasts."],
          ['hero', "I was raised by a tiger in the morning, an eagle by noon and a tortoise by night. I never learned to be just one."],
          ['agent', "There. The wild boy. Halcyon wants him for the Beast Pens. Net him."],
          ['hero', "Net me? Which one of me? Tiger first!"]],
        win: [
          ['hero', "Tiger in the morning. Eagle by noon. And now they're running, so... tortoise, for a nap."],
          ['sys', "On the road past the forest, a caravan rolls by. Kova watches it go, then follows, out of sight."],
          ['hero', "Somebody has to watch the spear guy's back. He never looks behind him."]] },
      2: { zone: 'glowwild', with: 'hart', goal: "Guard Hart's caravan",
        meet: [
          ['sys', "The caravan road through the Glowwild. Every night, Hart leaves meat out for whatever follows the wagons."],
          ['hero', "Got your meat. Thanks. Again. Also, there are Halcyon raiders waiting at the bend."],
          ['hart', "...You're the thing that follows the caravans?"],
          ['hero', "You thought I was a beast? I mean. Sometimes. Tiger, mostly."],
          ['hart', "Nine years, and I've never been surprised. Keep your distance. I'll keep it for you."],
          ['hero', "Brann taught me the bear. I can keep quiet now. Mostly. Here they come!"]],
        win: [
          ['hart', "You fight like four different people."],
          ['hero', "Three beasts and me! And a bit of bear, now."],
          ['hart', "I'll keep leaving the meat out."],
          ['hero', "Could you cook it next time?"]] },
      3: { zone: 'glowwild', rival: 'fenn', goal: 'Prove every beast beats one wolf',
        meet: [
          ['sys', "Something Halcyon let loose is killing in the Glowwild. Two hunters find its trail at the same moment."],
          ['fenn', "Go home, kid. One wolf is plenty for this."],
          ['hero', "One wolf. One trick. I've got tiger, eagle, tortoise and a bit of bear. Who do you think finds it first?"],
          ['fenn', "Whoever's still standing."],
          ['hero', "Then let's see who's standing. Every beast against one wolf!"]],
        win: [
          ['fenn', "...Fine. You hit like a tiger and you run like an eagle."],
          ['hero', "And take hits like a tortoise! Say it. Say I'm not a show-off."],
          ['fenn', "You're a show-off. You won. We hunt it together."],
          ['hero', "Like always. And we both pretend we hate it."]],
        lose: [
          ['fenn', "One wolf. Pick a beast and keep it, kid."]] },
      4: { zone: 'meridian', goal: 'Bring the beasts to the drills',
        intro: [
          ['sys', "The Drills at the Buried Meridian. The camp's waste runs into the Glowwild, and the beasts are angry."],
          ['hero', "The Sky thinks Deepline gassed it. Deepline thinks the Sky drilled it. A face that changes shape? That's my trick!"],
          ['hero', "Except I don't use it to lie. Somebody's wearing other people's faces, and the beasts smell Halcyon on it."],
          ['hero', "Tigers, eagles, tortoises, everyone. Follow me!"]],
        win: [
          ['sys', "The Glowwild's beasts pour out of the trees with Kova at their head, and the drill camp scatters."],
          ['hart', "That's... that's the thing that follows my caravans. All of it."],
          ['hero', "Told you I wasn't just one thing!"]] },
      5: { zone: 'glowwild', foe: 'apis', goal: 'Drive the swarm out of the forest',
        intro: [
          ['sys', "The sky splits. Vael calls, and Apis answers. Her swarm turns violet and eats the Glowwild from the edges in."],
          ['sys', "Behind the swarm, the Hollow Legion marches into the trees, rank after rank."],
          ['hero', "That's my forest. The tiger's den. The eagle's tree. The tortoise's pond. All of it."]],
        meet: [
          ['apis', "Wild boy. Every beast at once? My swarm is a million at once."],
          ['hero', "You were kind to this forest. Ume fed your bees here. Now you're eating her flowers."],
          ['apis', "The Crown is hungry. So am I. I'm always hungry."],
          ['hero', "Then claw, wing and shell. Let's see who's hungrier."]],
        win: [
          ['sys', "Tiger, eagle, tortoise and bear, all at once. The swarm breaks around him, and Ume walks through the gap."],
          ['sys', "The scent of her garden reaches Apis. The hollow crown over her head cracks, and breaks."],
          ['apis', "...I ate the tiger's den. I'm sorry."],
          ['hero', "Dens grow back. Ask Ume. She grows everything."]],
        lose: [
          ['apis', "Eight bees, then all of them. Your shell has cracks, wild boy."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Hollow Legion, more soldiers than the Glowwild has trees. Over it, Vael's Crown."],
          ['hero', "Brann! Fenn! Hart! The whole pack's here. Primal Parade, every beast at once!"],
          ['brann', "Quiet, boy."],
          ['hero', "...Every beast at once. Quietly."]],
        win: [
          ['sys', "The Hollow Crown falls into the Crater. The Legion stops, every soldier, all at once."],
          ['hart', "Kova. Thank you. For nine years of watching my back."],
          ['hero', "You noticed?! ...You noticed."],
          ['hero', "Claw, wing and shell."]] }
    },

    // ---------------------------------------------------------------- HART
    hart: {
      1: { zone: 'scrapton', goal: 'Guard the caravan on the Rust Flats',
        intro: [
          ['sys', "The Rust Flats: the caravan road from Mile Zero to the Crater rim, and a young man with a very long spear."],
          ['hero', "I have one rule. Keep your distance. If you won't, I'll keep it for you."],
          ['citizen', "Hart! Halcyon's toll riders are blocking the road. They say the caravans pay or the caravans burn."],
          ['hero', "Nine years on this road and I've never been surprised. Get behind me. Stay out of reach."]],
        win: [
          ['hero', "They stepped into reach. The spear did the rest."],
          ['citizen', "Something behind the scrap heaps was watching all that. Big. Orange. Stripes."],
          ['hero', "I know. I leave meat out for it. Never asked what it is. Roll on."]] },
      2: { zone: 'glasssea', with: 'tor', goal: 'Get the caravan across the glass',
        meet: [
          ['sys', "The Glass Sea crossing. The caravan stops. Something under the crystal is moving."],
          ['tor', "Hart. Glass Crawlers ahead, and Halcyon riders behind them, herding them at us."],
          ['hero', "Shield in front. Spear behind it."],
          ['tor', "Arrows bounce. Crawlers bounce. Everything bounces."],
          ['hero', "And whatever doesn't bounce stays out of reach."]],
        win: [
          ['tor', "Nothing got past. Nothing's about to start."],
          ['hero', "We stopped arguing about who does the work years ago, didn't we?"],
          ['tor', "You stopped. I still think it's the shield."],
          ['hero', "...And the thing that follows us through the Glowwild is sitting on that dune again."]] },
      3: { zone: 'scrapton', rival: 'yara', goal: 'Settle the bet with Yara',
        meet: [
          ['yara', "That rider on the ridge was a mile off. I dropped him before your spear turned round. I'm ahead on the bet, Hart."],
          ['hero', "A bow reaches further. A bow has never stopped a charge."],
          ['yara', "Then charge me. The Rust Flats, no cover, no caravan to hide behind. Reach decides."],
          ['hero', "Reach decides. Keep your distance, Yara. I'll keep it for you."]],
        win: [
          ['yara', "I couldn't get far enough back. Every step I took, the spear was already there."],
          ['hero', "That's the bet, then. Square, at last."],
          ['yara', "Square. At a mile, I'm still ahead."],
          ['hero', "At a mile, nobody's charging."]],
        lose: [
          ['yara', "Reach decides, spear-boy. Mine's a mile."]] },
      4: { zone: 'meridian', goal: "Hold the column's front",
        intro: [
          ['sys', "The Drills at the Buried Meridian. The Surface marches in a column from forty towns, and Hart walks at its front."],
          ['citizen', "Is it true, Hart? A Deepline boy gassed the Sky, a Sky girl drilled Deepline? Is the whole world at war?"],
          ['hero', "Somebody wants us to think so. At a distance, a face can be anyone's. Up close, you see the seams."],
          ['hero', "Keep your distance from the stories. Keep the drills at the end of my spear."]],
        win: [
          ['sys', "The column's front never breaks. Not one drill crew gets within reach."],
          ['tor', "Flank held."],
          ['hero', "Front held. Nothing got past either of us."]] },
      5: { zone: 'glowwild', foe: 'apis', goal: "Reach through the swarm to Apis",
        intro: [
          ['sys', "The sky splits. In the Glowwild, Apis's swarm goes violet and starts to eat the forest, the Legion behind it."],
          ['hero', "A swarm. A million stingers, and not one of them keeps its distance. A spear is a bad weapon for this."]],
        meet: [
          ['apis', "Spear-boy. Nobody's ever stabbed a swarm. You'll just make holes in the air."],
          ['hero', "I'm not aiming at the swarm."],
          ['apis', "Then what?"],
          ['hero', "The queen. Reach decides."]],
        win: [
          ['sys', "A Thousand Spears come down through the swarm, and one goes exactly where Hart meant it: past the queen's ear."],
          ['apis', "...You missed?"],
          ['hero', "I never miss. Listen. That's Ume, calling you. You stopped to hear it."],
          ['sys', "Through the gap the spear made, the scent of Ume's garden reaches Apis. The hollow crown breaks."]],
        lose: [
          ['apis', "Too close, spear-boy. Swarms don't keep their distance."]] },
      6: { goal: 'Hold the line at the Crater',
        intro: [
          ['sys', "The Crater. The Legion stands in ranks to the horizon, and over it, Vael's Crown. Tor's shield goes up in front."],
          ['tor', "Like always."],
          ['hero', "Like always. Kova, I know you're there. Watch our backs."],
          ['kova', "You KNOW?"]],
        win: [
          ['sys', "The last blow falls. The Crown drops into the Crater, and the Legion is still."],
          ['yara', "Not bad, spear-boy. A whole army, and none of it got within reach."],
          ['hero', "It never does."],
          ['hero', "Reach decides everything."]] }
    },

    // ---------------------------------------------------------------- TARO
    taro: {
      1: { zone: 'village', goal: 'Hold the Village ring',
        intro: [
          ['sys', "The Village ring: packed earth, a circle of salt, and a huge man who has not been moved since he was nine."],
          ['hero', "Nobody has pushed me out of this ring. Brakk came closest. Brakk is a mountain."],
          ['agent', "Halcyon land survey. This village is an unlicensed structure. You, the big one, step out of the circle."],
          ['hero', "Step in. Then ask me again."]],
        win: [
          ['sys', "Halcyon's survey team lies in a heap outside the salt. Taro has not moved a step."],
          ['hero', "Out of the ring. All of you."],
          ['hero', "And bow to the floor. It has been kind to you."]] },
      2: { zone: 'village', with: 'oda', goal: 'Bless the ring and hold it',
        meet: [
          ['sys', "Spring at the Village ring. The monk of the Last Toll comes down the path with his bell, as he does every year."],
          ['hero', "Oda. The ring is ready. Salt, earth, and me."],
          ['sys', "Oda rings the bell over the ring once. Taro bows to it. The bell rings back."],
          ['hero', "...Halcyon is at the gate again. You heard them too."],
          ['sys', "Oda nods, and does not put the bell down. He holds it like a weapon."],
          ['hero', "Then we fight. You ring. I push."]],
        win: [
          ['hero', "A blessed ring holds better. Thank you."],
          ['sys', "The bell rings softly. From Oda, that is a whole speech."],
          ['hero', "Same time next spring, old friend."]] },
      3: { zone: 'village', rival: 'tor', goal: 'Prove who is the true wall',
        meet: [
          ['tor', "Years I have asked, Taro. Hollis wants his truest wall at the gate when Halcyon comes. That's me."],
          ['hero', "A gate is a door. The ring is a wall. Nobody has moved me since I was nine."],
          ['tor', "Nobody has ever got past me. Same thing."],
          ['hero', "Not the same thing. Step in. Salt, bow, push."]],
        win: [
          ['tor', "...I'm outside the salt."],
          ['hero', "You are. And I am still in it. The ring is the wall."],
          ['tor', "But you dug in. I felt it. Your heel moved."],
          ['hero', "...One grain. Do not tell Brakk."],
          ['tor', "Then the gate's mine and the ring's yours. Two walls. The village can afford both."]],
        lose: [
          ['tor', "Arrows bounce. Wrestlers too, it turns out."]] },
      4: { zone: 'meridian', goal: 'Throw the drill out of the ring',
        intro: [
          ['sys', "The Drills at the Buried Meridian. Taro draws a ring of salt in the sand around the biggest drill."],
          ['citizen', "They're saying a Sky girl drilled Deepline and Deepline's boy gassed the Sky. Can that be true?"],
          ['hero', "In the ring, you see your opponent's face, up close. Whoever hides behind another face does not fight fair."],
          ['hero', "Whoever wore those faces never stepped in a ring. This drill did. Out."]],
        win: [
          ['sys', "Taro gets both arms around a Halcyon drill, plants his feet, and throws it out of the ring."],
          ['agent', "That thing weighs forty tonnes!"],
          ['hero', "It weighed forty tonnes. Now it is outside."]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Hold the tethers against Ryo',
        intro: [
          ['sys', "The sky splits. Twelve answer the Call. At the Tether Fields, Ryo tips the great tethers out of balance."],
          ['sys', "Overhead, Aurelia lurches. Below, the Hollow Legion pours across the field. If the tethers go, the city goes too."],
          ['hero', "A tether is a rope. A rope needs someone on the other end. I will be the other end."]],
        meet: [
          ['ryo', "Taro. Move. Everything is tipping. Balance means one side falls."],
          ['hero', "You keep two sides even. Light, dark. I keep one side still. Push me."],
          ['ryo', "Light Palm. Dark Palm. I can tip anything."],
          ['hero', "Then tip me."]],
        win: [
          ['sys', "Ryo pushes with light, with dark, with both. Taro does not move, and Ryo's balance has nothing to lean on."],
          ['ryo', "You don't tip. Nothing in me can find a side to push."],
          ['hero', "Then stop pushing. Stand. Hollis is coming."],
          ['sys', "Hollis's stillness reaches Ryo. The hollow crown over his head cracks, and breaks."]],
        lose: [
          ['ryo', "Out of the ring, wrestler. Everything tips in the end."]] },
      6: { goal: 'Ring the Crater in salt',
        intro: [
          ['sys', "The Crater. The Hollow Legion stands rim to rim under Vael's Crown. Taro throws salt and draws a ring round all of it."],
          ['tor', "That's a big ring, Taro."],
          ['hero', "Then it needs two walls."]],
        win: [
          ['sys', "The Crown falls into the Crater, and the Legion stops."],
          ['hero', "All of you. Out of the ring."],
          ['tor', "So who's the true wall?"],
          ['hero', "Ask me tomorrow. Today, both."],
          ['hero', "Bow. Then leave."]] }
    },

    // ---------------------------------------------------------------- TAREK
    tarek: {
      1: { zone: 'sinkhole', goal: 'Hold the dig against Halcyon',
        intro: [
          ['sys', "The Sinkhole, at the edge of the Buried Meridian. Chain raiders haul scrap out of the dead city by lantern light."],
          ['hero', "Copper, steel, old wire. The dead don't need it. Halcyon pays. That's the trade."],
          ['agent', "Change of plan, Tarek. Halcyon doesn't need buyers any more. We're bringing drills. Clear out."],
          ['hero', "Clear out? I never go to anyone. Everyone comes to me."],
          ['agent', "Then we'll come to you. Take them."]],
        win: [
          ['hero', "Reeled in, every one. You always come to me."],
          ['citizen', "Boss, if they're bringing drills, they'll dig the whole city. And whoever's on top of it."],
          ['hero', "...Us. Yeah. I see it."]] },
      2: { zone: 'village', with: 'garo', goal: "Hold Garo's forge",
        meet: [
          ['sys', "Garo's forge at the Hidden Village. A raider with a notched sickle walks up the mountain path."],
          ['garo', "Notched again. Every time. What do you cut with this, rocks?"],
          ['hero', "Chains. Halcyon's. They've stopped buying, Garo. They want the buried city, and us out of the way."],
          ['garo', "Then it needs an edge. Sit. ...And somebody followed you up my mountain."],
          ['hero', "Halcyon. Sorry. They come to me. Always."]],
        win: [
          ['garo', "There. Sharp again. Bring it back notched. I like to see it used."],
          ['hero', "The best smith on the Surface keeps a raider's sickle sharp. Why?"],
          ['garo', "Because one day you'll use it on the right side."]] },
      3: { zone: 'docks', rival: 'bando', goal: 'Measure reach with Bando',
        meet: [
          ['bando', "Tarek of the chain raiders! On my dock! You told the whole Surface you've got the longer reach!"],
          ['hero', "I did. I came down to warn Deepline, Bando. Halcyon's drills. They won't stop at the Surface."],
          ['bando', "Everyone hears it after we measure. In public. That's the deal. Reach decides who talks first."],
          ['hero', "Fine. Chain against arm. You'll come to me. Everyone does."]],
        win: [
          ['bando', "...You reeled me in. My arm was longer. I'm sure my arm was longer."],
          ['hero', "Your arm was. My chain wasn't. Now listen, all of you: the drills are coming down."],
          ['bando', "Okay, okay. Deepline's listening. And we're measuring again later."]],
        lose: [
          ['bando', "Long arm of Deepline! Want to measure again, chain-man?"]] },
      4: { zone: 'meridian', goal: 'Offer Dune your chain',
        intro: [
          ['sys', "The Ash Dunes. Halcyon's drills turn in the Buried Meridian while the layers above and below blame each other."],
          ['citizen', "Boss, they say a Sky girl drilled Deepline and a Deepline boy gassed the Sky. So whose drills are THESE?"],
          ['hero', "Halcyon's. I sold them scrap for six years. Somebody lent them two faces. The drills are all theirs."],
          ['sys', "Tarek walks into the desert without his chain on his arm or his sickle. Dune rises out of the sand to meet him."],
          ['hero', "Dune. They'll bury everyone. Here's my chain. One end each."],
          ['dune', "...One end each."]],
        win: [
          ['sys', "Sand and chain. The drill crews are reeled in, and buried to the neck."],
          ['dune', "You did not let go."],
          ['hero', "Neither did you. I still don't like you."],
          ['dune', "Good."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Chain the girl made of glass',
        intro: [
          ['sys', "The sky splits. Vael calls, and on the Glass Sea, Opal answers. The crystal spreads toward the dunes."],
          ['sys', "The Hollow Legion marches over the new glass, more soldiers than there are grains of sand."],
          ['hero', "If she glasses the desert, she glasses the city under it. And Dune. Not happening."]],
        meet: [
          ['opal', "A chain? Chains are iron. Iron turns to glass too. Everything does."],
          ['hero', "Maybe. But you'll have to come to me to touch it. Everybody comes to me."],
          ['opal', "I don't want to touch anything. I want it all still. The Crown says still is safe."],
          ['hero', "Still is dead, kid. Ask anyone under this sand."]],
        win: [
          ['sys', "The chain wraps round Opal three times and holds. She cannot glass what she cannot reach."],
          ['hero', "Got you. Brakk! She's held! Come and get her!"],
          ['sys', "Brakk lifts her off the glass and onto his shoulder. The hollow crown over her head breaks."],
          ['opal', "...The chain. It didn't turn to glass."],
          ['hero', "Good chain. Nothing gets out of my reach, kid. Not even you."]],
        lose: [
          ['opal', "Your chain is glass now. Don't move, or it shatters."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Hollow Legion fills it to the rim, and Vael's Crown hangs above. Dune rises out of the dust."],
          ['dune', "One end each."],
          ['hero', "One end each. Iron Cyclone. Clear a circle."]],
        win: [
          ['sys', "The Hollow Crown falls. The Legion stops. Tarek's chain is still wrapped around half a Siege Walker."],
          ['bando', "That was some reach, chain-man. ...Mine's still longer."],
          ['hero', "Come up to the dunes and measure. You'll come to me. Everyone does."],
          ['hero', "No one escapes my reach."]] }
    },

    // ---------------------------------------------------------------- ODA (vow of silence: the bell speaks)
    oda: {
      1: { zone: 'village', goal: 'Ring the dawn bell',
        intro: [
          ['sys', "The Temple of the Last Toll, before dawn. For ninety-six years the bell has rung here every morning."],
          ['sys', "Oda took a vow of silence the night he and Hollis made the Pact. The bell did not."],
          ['agent', "Halcyon survey. That bell carries for miles. It's giving away the village. Silence it."],
          ['hero', "(Oda looks at the agent for a long moment. Then he lifts the bell.)"],
          ['hero', "DONG."]],
        win: [
          ['sys', "The survey team lies in a ring round the temple. The bell is still humming."],
          ['hero', "(Oda bows to the fallen, and to the dawn.)"],
          ['sys', "He rings once more, harder than he needs to. He has rung a little harder every morning since Coda was taken."]] },
      2: { zone: 'village', with: 'hollis', goal: 'Guard the Pact with Hollis',
        meet: [
          ['sys', "The Pact of the Hidden Clans hangs in the temple in Hollis's handwriting, under the bell."],
          ['hollis', "Ninety-six years, old friend, and you still ring at me every time I read the second line."],
          ['hero', "DONG."],
          ['hollis', "Yes, yes. One word. Later. Halcyon is on the temple stairs, and they want the Pact for their files."],
          ['hero', "(Oda sets himself in front of the scroll, the bell in his hand.)"],
          ['hollis', "I'll take the left. You take everyone who can hear."]],
        win: [
          ['hollis', "Still here. The Pact, the bell, and two old men."],
          ['hero', "Dong."],
          ['hollis', "I know. The second line. Later."]] },
      3: { zone: 'noble', rival: 'pell', goal: 'Face Pell at the Noble Ring',
        meet: [
          ['sys', "The Noble Ring opera, in Aurelia. A monk in an ochre robe has ridden the Skylift up with a bell in his hand."],
          ['pell', "The monk of the Last Toll, all this way up. Come to watch her dance? She is wonderful now. I made her so."],
          ['hero', "(Oda says nothing. He has said nothing for ninety-six years. He rings the bell once, low.)"],
          ['pell', "She doesn't count your tolls any more, monk. She counts my strings."],
          ['hero', "DONG."]],
        win: [
          ['pell', "A monk who only rings a bell. And here I am, on the floor."],
          ['sys', "On the opera stage, the star dancer hears the bell through the walls, and misses a step on Pell's string."],
          ['pell', "...She heard that."],
          ['hero', "(Oda rings once more, softly. One toll for every step she used to count.)"]],
        lose: [
          ['pell', "Silence suits you, monk. Stay down."]] },
      4: { zone: 'meridian', goal: 'Ring the bell three times',
        intro: [
          ['sys', "The Drills at the Buried Meridian. The layers believe each other's lies, and Halcyon's drills bite into the sand."],
          ['citizen', "A Sky girl drilled the tunnels, a Deepline boy gassed the Sky... Is this the end of the Pact, monk?"],
          ['hero', "(Oda shakes his head. A face is not a person. He once watched a smiling mask take a child.)"],
          ['sys', "He raises the bell. For ninety-six years he has rung it once. Today he rings it three times."],
          ['hero', "DONG. DONG. DONG."],
          ['sys', "Across the Surface, everyone who knows the Pact stops, and turns toward the Buried Meridian."]],
        win: [
          ['sys', "The drills fall silent one by one. Only the bell is still ringing."],
          ['hollis', "Three times. In ninety-six years you've never once rung it three times."],
          ['hero', "(Oda smiles, and rings it a fourth time, very quietly. For the Beyond-born.)"]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Ring through the crown',
        intro: [
          ['sys', "The sky splits. Vael calls, and the Call fills every Beyond-born head like a roar."],
          ['sys', "At the Tether Fields, Ryo pulls the tethers out of balance. Aurelia lurches above, and the Legion floods in below."],
          ['hero', "(Oda walks into the gale with his bell. A roar is only a loud bell, rung badly.)"]],
        meet: [
          ['ryo', "Monk. The Crown is all I can hear. Go back to your temple."],
          ['hero', "Dong."],
          ['ryo', "...What was that? It's small. It's under the Crown. It's... in time."],
          ['hero', "DONG."]],
        win: [
          ['sys', "The Last Toll rings out through the gale, through the Legion, through the crown on Ryo's head."],
          ['ryo', "I can hear it. One bell. The Crown can't drown it out."],
          ['sys', "Hollis steps in as the bell rings again. The hollow crown over Ryo cracks, and breaks."],
          ['hero', "(Oda bows to Ryo. Then he points east, to the Ash Dunes, where Ryo's brother is.)"]],
        lose: [
          ['ryo', "The Crown is louder than a bell, monk."]] },
      6: { goal: 'Ring the Last Toll over the Crater',
        intro: [
          ['sys', "The Crater. Vael's Crown fills the sky and the Legion fills the dust. Oda stands on the rim with his bell."],
          ['coda', "Oda! I'm counting. Every toll, with my feet. Like when I was small."],
          ['hero', "(Oda smiles. He rings the bell, and Coda dances on the beat.)"]],
        win: [
          ['sys', "Itsuki's last blow. The Crown falls into the Crater, and the Legion goes still."],
          ['sys', "Over the Pact of Four, Oda rings the bell once, and for the first time in ninety-six years he says one word."],
          ['hollis', "He said together. I heard it! ...He's not saying. Of course he's not saying."],
          ['sys', "Oda only smiles. The bell says the rest for him."],
          ['hero', "Hear the bell? It's for you."]] }
    },

    // ---------------------------------------------------------------- GARO
    garo: {
      1: { zone: 'village', goal: 'Hold the forge and the gate',
        intro: [
          ['sys', "The forge and gate of the Hidden Village. Steel comes up from Deepline by tunnels no map shows; food goes down."],
          ['hero', "I forged this wheel from a Halcyon drill bit the width of a door. Seemed fair. They keep drilling our mountain."],
          ['agent', "Smuggling tunnel found. Seal it and take the smith. Halcyon wants to know who's on the other end."],
          ['hero', "So do I. Never seen her face. You won't either."]],
        win: [
          ['hero', "Throw once, hit twice. The wheel comes back to the hand that threw it."],
          ['sys', "A crate rises up the tunnel lift: Deepline steel, and a note scratched on the lid. Still here. F."],
          ['hero', "Still here. Send the bread down. Double, this time."]] },
      2: { zone: 'shafts', with: 'ferra', goal: 'Hold the hidden tunnel with Ferra',
        meet: [
          ['sys', "Halfway down the hidden tunnel, in pitch dark. Halcyon has found it from both ends at once."],
          ['ferra', "Garo? It's Ferra. Don't light the lamp. I like not knowing what you look like."],
          ['hero', "Ferra. Ten years of steel up and bread down, and I meet you in the dark."],
          ['ferra', "Halcyon's coming from my end and yours. I brought scrap. Every piece of junk down here answers to me."],
          ['hero', "And I brought a wheel. One throws..."],
          ['ferra', "...one catches. I know. You put it in every note."]],
        win: [
          ['ferra', "Tunnel's clear. Still haven't seen your face."],
          ['hero', "Keep it that way. It's not much of a face."],
          ['ferra', "That's what the Pact is for, big man. People you'd die for, without ever seeing their faces."]] },
      3: { zone: 'village', rival: 'tor', goal: 'Test the shield at the gate',
        meet: [
          ['tor', "Garo. One throw, one catch, like every morning, you said. So why is that the big wheel?"],
          ['hero', "Halcyon's new drill-heads. I've seen them. If your shield can't take my Meteor Wheel, it can't take those."],
          ['tor', "So it's a test."],
          ['hero', "It started as a spar. Hold the gate, Tor. Show me nothing gets past."]],
        win: [
          ['tor', "...Still holding. Never dropped it."],
          ['hero', "Not a scratch. Either I forged it better than I knew, or you're harder than the shield."],
          ['tor', "Both. Again?"],
          ['hero', "Again. One throws."],
          ['tor', "One catches."]],
        lose: [
          ['tor', "Nothing gets past. Not even the smith who made the shield."]] },
      4: { zone: 'meridian', goal: 'Cut the drill cables',
        intro: [
          ['sys', "The Drills at the Buried Meridian. Each drill hangs from steel cables thick as an arm, running back to the rigs."],
          ['hero', "Ferra's note came up this morning. Drills in Deepline, and everyone down there swears Nyra of the Sky led them in."],
          ['hero', "Ferra says faces are cheap and drills are not. She's right."],
          ['hero', "These are the same drills. Same steel. I'd know it anywhere. My wheel is made of one."]],
        win: [
          ['sys', "The wheel goes out and comes back, out and back. Every cable is cut, and the drills sag into the sand."],
          ['hero', "The wheel comes back. The drills don't."],
          ['tarek', "Nice throw. Sharpen my sickle after?"],
          ['hero', "Bring it back notched. I like to see it used."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Smash through the crystal',
        intro: [
          ['sys', "The sky splits. The Called come down, and on the Glass Sea, Opal's crystal starts to swallow the Surface."],
          ['sys', "Behind her, the Hollow Legion pours out of the split sky and marches across the glass."],
          ['hero', "Glass is hard. Iron is harder, if you hit it right. I've been hitting things right for forty years."]],
        meet: [
          ['opal', "Your wheel is pretty. When it turns to glass, it will be prettier."],
          ['hero', "It's a drill bit, girl. Halcyon's. It has drilled through worse than you."],
          ['opal', "Prism Prison. Hold still, and you'll be still forever."],
          ['hero', "One throws. Nobody catches. Here it comes."]],
        win: [
          ['sys', "The Meteor Wheel smashes the Prism Prison and every Geode Wall behind it. Opal stands alone on the glass."],
          ['opal', "...Everything I made is broken."],
          ['hero', "Glass breaks. That's all right. Brakk! Your shoulder's needed!"],
          ['sys', "Brakk lifts her up. The hollow crown over her head shatters, the way the crystal did."]],
        lose: [
          ['opal', "Iron, glass. It all looks the same, standing still."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Legion stands rim to rim under Vael's Crown, and Siege Walkers stride through it."],
          ['tor', "One throws."],
          ['hero', "One catches. A Thousand Wheels, and one the size of a house. Get that shield up."]],
        win: [
          ['sys', "The Crown falls into the Crater and the Legion stops. In the dust, a woman with a red mohawk is looking for a smith."],
          ['ferra', "Garo? Is that you? You're huge."],
          ['hero', "Ferra. So now you've seen my face."],
          ['ferra', "It's a good face. Vex and I are taking the Crown's iron home. Want some, for bread?"],
          ['hero', "The wheel always returns."]] }
    },

    // ---------------------------------------------------------------- IVO
    ivo: {
      1: { zone: 'village', goal: 'Beat the dawn, and Halcyon',
        intro: [
          ['sys', "The Hidden Village, an hour before dawn. Golden steam rises off a boy already halfway through his training."],
          ['hero', "At fourteen I climbed this mountain. Hollis said wait for the sunrise. I waited a year of them. Then he taught me."],
          ['hero', "Every dawn since, I've been up before it. Today the dawn has company."],
          ['agent', "There's a kid up here. Gas him before he wakes the village."],
          ['hero', "Wake the village? I've been up for two hours! Fist Storm!"]],
        win: [
          ['hero', "Twelve punches in two seconds. They only needed three."],
          ['sys', "The sun comes up over the mountain. Ivo bows to it."],
          ['hero', "Morning. Beat you again."]] },
      2: { zone: 'village', with: 'taro', goal: 'Hold the ring with Taro',
        meet: [
          ['sys', "The Village ring at dawn. Ivo spars with Taro every morning. Taro has never been moved."],
          ['hero', "Morning, Taro! Today's the day. I can feel it."],
          ['taro', "You say that every day."],
          ['hero', "And one day it'll be true! Hollis says a teacher and a wall are all I need. You're the wall."],
          ['taro', "...Halcyon is at the gate. The wall would like some help."],
          ['hero', "Ha! Finally, something that moves!"]],
        win: [
          ['taro', "Fast. Very fast. And you have still not moved me."],
          ['hero', "Tomorrow. Before dawn."],
          ['taro', "I will be here."]] },
      3: { zone: 'village', rival: 'lin', goal: 'Land one on Lin',
        meet: [
          ['lin', "Ivo. The Sky Clan asks if the Surface is ready to stand against Halcyon. Hollis sent me to you for the answer."],
          ['hero', "Me? Great! ...You've sealed me twice, though. Is this a trick?"],
          ['lin', "It is a question. Twice I sealed you. Your style is loud, and loud is not ready."],
          ['hero', "Loud gets heard! One hit, Lin. That's my answer."],
          ['lin', "Every fifth strike seals. Breathe in."]],
        win: [
          ['sys', "Strike four. Ivo's fist lands, square, for the first time ever."],
          ['lin', "...You landed one."],
          ['hero', "I LANDED ONE!"],
          ['sys', "Strike five. Lin seals him mid-shout. He keeps grinning anyway."],
          ['lin', "Three times, now. But you landed one. I'll tell the Sky Clan: the Surface is ready."]],
        lose: [
          ['lin', "Breathe out, loud one. Again, when you're ready."]] },
      4: { zone: 'meridian', goal: 'Punch through a drill-head',
        intro: [
          ['sys', "The Drills at the Buried Meridian. The biggest drill-head on the Surface grinds toward the buried city."],
          ['hero', "Everyone's yelling about faces. The Sky girl, the Deepline boy. Lin says the Sky Clan never believed it."],
          ['hero', "Hollis says when everyone is shouting, look at who is quiet. Halcyon. Quiet, and drilling."],
          ['hero', "Not quiet any more. Twelve punches a second. Let's see how long a drill lasts."]],
        win: [
          ['sys', "Twelve punches a second for a minute and a half. The drill-head comes apart like wet sand."],
          ['hero', "Hah! That's a thousand and eighty! Did anybody count?"],
          ['taro', "I counted. You missed four."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Face the strongest first',
        intro: [
          ['sys', "The sky splits from edge to edge. Twelve Beyond-born answer the Call. One is the strongest fighter in any world."],
          ['sys', "In the Ash Dunes, Itsuki walks in front of the Legion, eyes violet, the five elements around him, toward the Hidden Village."],
          ['hero', "That's the way to the village. Hollis is there. Taro. Everyone. Nope. Not today."]],
        meet: [
          ['itsuki', "You're fast. I can see it from here. Fast is nothing on its own."],
          ['hero', "Twelve punches in two seconds! Up before every dawn for six years!"],
          ['itsuki', "I learned fire, wind, thunder, earth and water on five worlds. Step aside."],
          ['hero', "Seventh Breath. From every side. Let's go!"]],
        win: [
          ['sys', "Every hit Ivo lands takes time off his skills, so he never stops. Itsuki lets him hit, and hit, and hit."],
          ['itsuki', "Good. Really good. On most worlds, you'd be the best I've met."],
          ['sys', "Then the wheel turns once. Ivo goes down in the sand: the first to face the strongest, and the first to fall."],
          ['hero', "...Not done... Tarn's coming. Tarn's always... faster than me."]],
        lose: [
          ['itsuki', "Get up, if you can. Most can't."]] },
      6: { goal: 'Break the Hollow Crown',
        intro: [
          ['sys', "The Crater. The Legion fills it, and the Crown hangs over it. Ivo has been up since an hour before dawn. So has everyone."],
          ['tarn', "Ivo. Race you to the Crown."],
          ['hero', "You're on! Catch ME this time!"]],
        win: [
          ['sys', "Itsuki strikes the last blow. The Crown falls into the Crater, and the Legion stops."],
          ['itsuki', "You. The fast one. First to face me in the dunes. Train with me sometime?"],
          ['hero', "Before dawn. Every dawn. Can you keep up?"],
          ['hero', "Iron never rests."]] }
    },

    // ---------------------------------------------------------------- TOR
    tor: {
      1: { zone: 'village', goal: 'Let nothing past the gate',
        intro: [
          ['sys', "The gate of the Hidden Village. A tall man with a round shield stands in it, as he has every day for years."],
          ['hero', "Nothing has ever got past me. Nothing is about to start now."],
          ['agent', "Halcyon enforcement! Open the gate, or we open it with the drill."],
          ['hero', "Bring the drill. It will bounce."]],
        win: [
          ['sys', "Arrows on the ground. Drill bits on the ground. Halcyon on the ground. Tor has not stepped back once."],
          ['hero', "Garo. They scratched the shield. Can you fix it?"],
          ['garo', "Scratch? That's character. Leave it."]] },
      2: { zone: 'tethers', with: 'hart', goal: 'Shield the caravan in the gale',
        meet: [
          ['sys', "The Tether Fields. A caravan crawls between anchor stones as tall as towers, and the gale pushes it sideways."],
          ['hart', "Tor. Riders coming in on the wind, from the left. Halcyon colours."],
          ['hero', "Shield on the left, then. Spear behind it."],
          ['hart', "Like always."],
          ['hero', "Like always. Arrows bounce. Riders bounce. Wind bounces."],
          ['hart', "Wind doesn't bounce, Tor."],
          ['hero', "Watch."]],
        win: [
          ['hart', "...The wind bounced."],
          ['hero', "Nothing gets past."],
          ['sys', "Behind the last wagon, something orange and striped trots along at a distance. Hart does not notice. Tor does."],
          ['hero', "(If Hart hasn't noticed in nine years, it's not my place to spoil it.)"]] },
      3: { zone: 'skyport', rival: 'aldric', goal: 'Meet Aldric at the Skyport',
        meet: [
          ['sys', "The Skyport of Aurelia. A Surface caravan has come up the Skylift. A knight in dented plate bars the way."],
          ['aldric', "No Surface goods pass the Skyport without Halcyon's seal. Turn back."],
          ['hero', "You're Aldric. The knight who holds a line. They talk about you on the Surface. I wanted to see for myself."],
          ['aldric', "And I have heard of a wall on the Surface that has never been passed. Here we both are."],
          ['hero', "Here we both are. Neither of us moves. Let's find out."]],
        win: [
          ['sys', "Shield against greatsword. Neither moves. Then a Halcyon drone wing dives at the caravan, and both of them do."],
          ['aldric', "...You turned your shield to cover the wagons. Not yourself."],
          ['hero', "So did you, with that sword. Who is your oath to, knight?"],
          ['aldric', "To the people behind the wall. I begin to wonder if the Director remembers that."],
          ['hero', "Come down to the Surface sometime. Two walls hold better than one."]],
        lose: [
          ['aldric', "Hold, Surface wall. You held well. Not well enough."]] },
      4: { zone: 'meridian', goal: "Hold the column's flank",
        intro: [
          ['sys', "The Drills at the Buried Meridian. The Surface marches in a column from forty towns. Hart has the front. Tor, the flank."],
          ['hero', "Up top they say a Deepline boy gassed their labs. Down below, that a Sky girl drilled their tunnels."],
          ['hero', "A face is a gate anyone can walk through, if nobody guards it. Somebody walked through two."],
          ['hero', "Not this flank. Nothing gets past this flank."]],
        win: [
          ['sys', "Drill crews, drones, dig mechs. Every one hits the shield and stops."],
          ['hart', "Anything get past your side?"],
          ['hero', "Nothing. Up in the Sky, a knight is turning his line around today. I hope he holds it as well."]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Hold the tethers for Hollis',
        intro: [
          ['sys', "The sky splits. Ryo answers the Call, and at the Tether Fields he pulls the tethers out of balance."],
          ['sys', "The Hollow Legion pours over the anchor stones. Above, Aurelia tips, and the whole sky groans."],
          ['hero', "Hollis is coming. Until he gets here, nothing gets past. Not the Legion. Not Ryo."]],
        meet: [
          ['ryo', "A wall. Walls don't balance. Walls fall over."],
          ['hero', "Walls stand. That's all they do. Push."],
          ['ryo', "Light, dark, light. Something always gives."],
          ['hero', "Not this."]],
        win: [
          ['sys', "Light and dark break on the shield again and again. Tor plants his feet, and the anchor stone behind him holds."],
          ['hero', "Hollis! Now!"],
          ['sys', "Hollis's stillness reaches Ryo through the gap Tor held open. The hollow crown over Ryo's head breaks."],
          ['ryo', "...You didn't move. The whole time, you didn't move."],
          ['hero', "That's the job."]],
        lose: [
          ['ryo', "Even walls tip, Tor. Just slowly."]] },
      6: { goal: 'Make the Last Stand',
        intro: [
          ['sys', "The Crater. The Hollow Legion, Siege Walkers in the dust, and over everything, Vael's Crown."],
          ['aldric', "Surface wall. You said two walls hold better than one."],
          ['hero', "I did. Plant your feet, knight. Last Stand."]],
        win: [
          ['sys', "The Crown falls into the Crater. The Legion stops at the foot of two walls."],
          ['aldric', "Neither of us moved."],
          ['taro', "Neither did I. Three walls."],
          ['hero', "...Fine. Three walls."],
          ['hero', "I am still standing."]] }
    }
  });
})();
