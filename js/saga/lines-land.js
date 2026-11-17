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
        card: "The cage in the Beast Pens was built for something larger than a man, and Fenn has had a long time to study its bars.",
        intro: [
          ['sys', "The Beast Pens, under Deepline. Wet straw, old rust, the sour smell of fear. One cage was built for something larger."],
          ['hero', "When the sky tore over our camp on Vharra, I set my storm-wolf between the tear and the tents."],
          ['hero', "It held. I fell. And Halcyon thinks a few iron bars will do what the sky could not."],
          ['agent', "Pen nine's awake! Prods, now. And somebody find out what it's been chewing."],
          ['hero', "Your bars. I've gnawed through worse in a hungry winter."]],
        win: [
          ['sys', "Out of the dark lopes the storm-wolf, violet lightning on four legs, and shoves its head under his hand."],
          ['hero', "There you are. Up, then. Open sky."],
          ['hero', "And once we have sky, Halcyon pays for the cage."]] },
      2: { zone: 'yard', with: 'kael', goal: 'Hold the Crusher Yard with Kael',
        card: "In the Crusher Yard a scrap-boy wears the storm-eye of Vharra on his jacket, and Fenn, who has no clan left, decides he has a brother.",
        meet: [
          ['kael', "Back off, wolf-man. This scrap pile's mine. Ferra said."],
          ['hero', "That mark on your jacket. The storm-eye. Who taught you to scratch that, kid?"],
          ['kael', "Nobody. Vharra. Born under the thunderheads, fell through the tear into this trash heap. What's it to you?"],
          ['hero', "Only the storm clans wear that eye. You're kin. Down here, I'm the nearest thing to a clan you've got."],
          ['kael', "Nobody asked for a big brother."],
          ['hero', "Nobody ever does. Drones, over the wall. Stay behind me."],
          ['kael', "Behind you? Watch this!"]],
        win: [
          ['kael', "Not bad, for an old wolf. You can stay. Tonight."],
          ['hero', "I'll stay till you can put a Halcyon captain on his back by yourself."],
          ['kael', "I just did!"],
          ['hero', "Then I'll stay till you stop shouting about it. Settle in. That could take years."]] },
      3: { zone: 'glowwild', rival: 'kova', goal: 'Take the trail from Kova',
        card: "Something Halcyon let loose is killing in the Glowwild, and two hunters who will not share a trail kneel at it in the same breath.",
        meet: [
          ['sys', "Something Halcyon let loose is killing in the Glowwild. Two hunters kneel at its trail in the same breath."],
          ['kova', "Back off, one-trick wolf. My forest. My hunt."],
          ['hero', "You'll go in a tiger, come out a tortoise, and somebody will die in between. Step aside, kid."],
          ['kova', "Every beast beats one wolf. Want me to prove it? I'll prove it four ways."],
          ['hero', "Yes. Whoever is standing at the end takes the trail."]],
        win: [
          ['kova', "Fine! Fine. The wolf is... good. For a wolf."],
          ['hero', "You're everything at once, and nothing all the way. Pick one beast. Keep it."],
          ['kova', "We could hunt it together. You know. Since I'm so fast. And you're so... there."],
          ['hero', "Keep up, then. And tell no one we enjoyed it."]],
        lose: [
          ['kova', "Tiger, eagle, tortoise... and one wolf, napping in the moss. Want to borrow a beast?"]] },
      4: { zone: 'meridian', goal: 'Lead the charge on the drills',
        card: "The storm-wolf runs at the head of the pack into Halcyon's drills, and word comes from the Crater that the thing wearing Kael's face has a name: Rue.",
        intro: [
          ['sys', "The Ash Dunes. Halcyon's drills sink into the Buried Meridian while the three layers go for each other's throats."],
          ['citizen', "Deepline swears a Sky girl, Nyra, led drills into its tunnels. The Sky swears a Deepline boy, Kael, gassed its labs."],
          ['hero', "Kael? Gas a ward full of Subjects? That boy can't keep a secret through supper. Someone is wearing his face."],
          ['hero', "Up, wolf. Whatever is lying about my brother, we start with its drills."]],
        win: [
          ['hero', "The drill camp's in pieces. Every wolf in the pack ran at my side."],
          ['sys', "Word from the Crater: Pell named the face-thief, Rue, and Kiri flew it there. A second Kael stood in the crowd, and ran."],
          ['hero', "Rue. I have her scent now. No one wears my brother's face and leaves on two legs."]] },
      5: { zone: 'glowwild', foe: 'apis', goal: 'Hunt the swarm to its queen',
        card: "When the sky splits, a stranger called Apis looses a starving swarm on the Glowwild, and Fenn does what he has always done with hungry things: he hunts them home.",
        intro: [
          ['sys', "Over the Crater the sky splits from edge to edge. A crown-ship the size of a city noses through, and the Legion spills after it."],
          ['sys', "In the Glowwild, a stranger in a small gold crown opens her hand. A swarm turns violet and begins to eat the trees."],
          ['hero', "Never seen her. Never seen a swarm that big. This is my hunting ground. Wolf. Hunt."]],
        meet: [
          ['apis', "Bzzz. A wolf. Vael has given me this forest, and my bees have not eaten well since an engine drank our hive dry."],
          ['hero', "That's Kova's forest. Ume's garden. Every track I ever followed. Not yours."],
          ['apis', "A pack is a handful of teeth. A swarm is a million mouths. Leave the trees to the hungry, little wolf."],
          ['hero', "A pack needn't be big. It needs to bite. The pack against the swarm, then."]],
        win: [
          ['sys', "Chain Bolt, Thunderclap, and the storm-wolf in the heart of the swarm. The bees scatter, singed and smoking."],
          ['apis', "You have burned my swarm. Keep your little forest. Vael has whole worlds left for me to eat."],
          ['sys', "Apis draws her bees up into the sky, back to the crown-ship. The Glowwild is scorched at the edges, and standing."],
          ['hero', "Forests grow back. Wolves remember. Next time, queen, I bite first."]],
        lose: [
          ['apis', "Eight bees, then all of them. A pack of one is only a meal, little wolf."]] },
      6: { goal: 'Hold the Pens for the pack',
        card: "Fenn and the storm-wolf keep the Beast Pens, where the beasts he freed now sleep, against the Legion's last column, while far above Kael climbs toward the Crown.",
        intro: [
          ['sys', "The Beast Pens. The cages hang open where Fenn tore them, and the beasts Halcyon caught sleep here now, free."],
          ['sys', "Far above, the sky over the Crater burns. Down here, the Legion's last column files through the tunnels toward the den."],
          ['hero', "Kael's up there with his thunder. Someone has to keep the den. Wolf. Up."]],
        meet: [
          ['sys', "A Siege Walker shoulders through the old pen gate, three times a man's height, a Legion captain riding its back."],
          ['hero', "Big. Slow. Hollow inside. I've brought down worse in snow up to my chest."]],
        win: [
          ['sys', "The storm-wolf drags the Walker down by one leg, and its captain goes under it. The rest of the column breaks."],
          ['sys', "Then every Legion soldier in the Pens goes still, turns, and is drawn up the tunnels like smoke up a flue. The sky has closed."],
          ['sys', "Next morning at the Crusher Yard, a kid with violet sparks still crackling in his hair comes limping home over the scrap."],
          ['kael', "Fenn! The whole sky, shut, bang, like a lid! ...Is Ferra mad?"],
          ['hero', "Furious. Go and let her shout. Then come back. The pack eats together tonight."],
          ['hero', "The hunt is over."]] }
    },

    // ---------------------------------------------------------------- BRAKK
    brakk: {
      1: { zone: 'dig', goal: 'Dig your way out of Shaft Nine',
        card: "Four hundred metres underground, Halcyon put a drill in Brakk's hands and told him to dig, and nobody thought to tell him which way.",
        intro: [
          ['sys', "Shaft Nine, Halcyon's deepest mine. Lamplight, dust, four hundred metres of rock overhead, and a worker who never complains."],
          ['agent', "You. Big one. Take the drill. Dig till the shift bell, then dig some more."],
          ['hero', "On Vharra I kept the Standing Stones. The children walked in my shadow. It was cool in summer."],
          ['hero', "The tear dropped me here. They gave me a drill. They did not say which way."],
          ['agent', "Down, you ox! The seam is DOWN!"],
          ['hero', "...Up, I think."]],
        win: [
          ['sys', "Four hundred metres later, a stone hand punches into grey daylight. Behind it the rock heaves up like a dragon waking."],
          ['hero', "Grey. Not Vharra's sky. Still sky."],
          ['hero', "Now. Somewhere to stand."]] },
      2: { zone: 'village', with: 'hollis', goal: 'Hold the mountain with Hollis',
        card: "For three days a huge man has sat on a mountain no map shows, and on the third evening an old man climbs up and sits beside him.",
        meet: [
          ['sys', "A mountain no map shows. A huge man sits on it and does not move. An old man climbs up and sits beside him."],
          ['hollis', "Comfortable? You've been sitting on my mountain three days."],
          ['hero', "On Vharra I stood by the Stones. Here, nothing needs me to stand anywhere."],
          ['hollis', "A mountain may choose where it stands, young one. That's the whole difference between a mountain and a rock."],
          ['hero', "...And if Halcyon's diggers come up the path?"],
          ['hollis', "Then I'd say they're coming now. Choose."],
          ['hero', "Here. I stand here."]],
        win: [
          ['hollis', "Well chosen. The village has a gate, a forge, a ring and a bell. Now it has a mountain."],
          ['hero', "The big one in the ring keeps looking at me. Like a bull at a gate."],
          ['hollis', "Taro. He wants to know which of you is harder to move. Let him find out. Slowly, for both your sakes."]] },
      3: { zone: 'village', rival: 'taro', goal: 'Face Taro in the Village ring',
        card: "Nobody has moved Taro out of the Village ring since he was nine, and then a mountain walked into the village.",
        meet: [
          ['taro', "Salt for the ring. A bow for the bell. Then we find out, mountain."],
          ['hero', "Find out what?"],
          ['taro', "Which of us is harder to move. I have stood in this ring since I was nine. No one has ever pushed me out."],
          ['hero', "I do not want to push you out. ...But you will not stop asking."],
          ['taro', "No. I will not."]],
        win: [
          ['sys', "Taro's heel stops on the lip of the ring, one grain of salt from out. The whole village is on its feet."],
          ['taro', "I could not move you one step. And you stopped one grain short of throwing me out. Why?"],
          ['hero', "The ring is yours. A mountain chooses where it stands. I chose not to stand there."],
          ['taro', "That is the most annoying thing anyone has ever said to me. Again tomorrow."]],
        lose: [
          ['taro', "Immovable. Bow, mountain. Then try again."]] },
      4: { zone: 'meridian', goal: 'Stop the drill with your hands',
        card: "Brakk lays two stone hands on Halcyon's biggest drill and it stops; that night the lie that set the layers at war gets a name: Rue, the face-thief.",
        intro: [
          ['sys', "The Buried Meridian. Halcyon's biggest drill gnaws down toward the city still lying under the sand."],
          ['agent', "Sky's at war with Deepline, Deepline with the Sky. Nobody's watching the Surface. Drill it all."],
          ['hero', "Deepline says a Sky girl led drills into its tunnels. The Sky says a Deepline boy gassed its labs."],
          ['hero', "Hollis says when everyone shouts, watch who is quiet. Halcyon is very quiet. And drilling."]],
        win: [
          ['sys', "Brakk lays both stone hands on the drill-head. It screams, it smokes, it stops."],
          ['agent', "It's one man! Why won't it turn?!"],
          ['hero', "Because there are people under this sand. And because I am standing here."],
          ['sys', "That night, word comes from the Crater: one faceless thing wore both faces. Pell named her. Rue."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Stand on the Glass Sea',
        card: "Wherever Vael's champion Opal walks, the Surface turns to glass; Brakk plants himself in her path, and for once it is the glass that gives way.",
        intro: [
          ['sys', "Over the Crater the sky tears like old sailcloth. Vael comes through, and his champions fall on every layer at once."],
          ['sys', "On the Glass Sea a girl with a pink crystal walks out of the light. Where she steps, the sand goes clear and still."],
          ['hero', "The dunes. The village. The mountain. She walks toward all of them, and never looks down."]],
        meet: [
          ['opal', "Come no closer, big man. Vael says once everything is glass, nothing will ever break again."],
          ['hero', "I do not know you, little one. But I know a frightened face. Glass breaks. That is what glass is for."],
          ['opal', "Then I will make it thick. Thick enough for your mountain, and your village, and you."],
          ['hero', "Then I stand here. A mountain chooses where it stands."]],
        win: [
          ['sys', "Crystal sheets off his arms like ice off a roof. Brakk gives not one step, and the glass stops at his feet."],
          ['opal', "You're not glass. Why aren't you glass? Everything goes to glass, in the end."],
          ['hero', "Stone remembers what it was. Go back to your king, little one. Tell him the mountain stood."],
          ['sys', "Opal runs into the light and is pulled up to the crown-ship. Behind her, the Glass Sea stops growing."]],
        lose: [
          ['opal', "Be still, big man. It doesn't hurt. It only stops."]] },
      6: { goal: 'Go up into the Crown with the six',
        card: "Brakk climbs into the Crown with the other five, and when six elements fall on Vael and the Convergence at once, it is his earth they all stand on.",
        intro: [
          ['sys', "The Crater. The crown-ship hangs over it like a second, darker moon, and the three layers hold the rim against its Legion."],
          ['sys', "Six go down through the middle of it toward the Crown: thunder, song and ice, fire, wind, water, and earth."],
          ['kael', "Big man! Stay close. If I fall over, you're what I land on."],
          ['hero', "Land, then. I will not move."],
          ['nyra', "Six of us and one stair. Brakk, can you lift us to it?"],
          ['hero', "Hollis told me to find somewhere to stand. Up there will do."]],
        meet: [
          ['sys', "At the foot of the Crown, one champion waits on the stair, alone. Five elements turn round him like slow moons."],
          ['itsuki', "Six. Fire, wind, thunder, earth, water, and a song. Five of those I learned on five worlds."],
          ['itsuki', "Go back down, mountain. I have crossed five worlds and none of them moved me. Yours will not."],
          ['hero', "I do not need to move you. Only to stand until you step aside."]],
        win: [
          ['sys', "Itsuki gives back up the stair, still calm, as if he had chosen to. The six go past him into the crown-ship."],
          ['sys', "Inside, under an empty crown, the Convergence and Vael stand side by side. The six strike together."],
          ['sys', "Kael's thunder, Nyra's song and ice, Pyra's fire, Gale's wind, Nami's water. And under all of them, Brakk's earth."],
          ['sys', "The crown-ship falls into the Crater. The door to the Beyond drags back the Legion and every champion. Itsuki goes last."],
          ['sys', "Next morning, the village children follow Brakk's shadow up the mountain path. It is cool there, in summer."],
          ['hero', "One day there will be a road back to Vharra, they say. Back to the Stones. A mountain chooses where it stands."],
          ['hero', "Here. I stand here."],
          ['hero', "Stone remembers. Stone endures."]],
        lose: [
          ['itsuki', "Even mountains wear down, Warden. Give it a thousand years, or one more round."]] }
    },

    // ---------------------------------------------------------------- JAX
    jax: {
      1: { zone: 'saloon', goal: 'Clear Halcyon out of the Long Bar',
        card: "Every road on the Surface starts on the porch of the Long Bar, and this morning Halcyon has come to close it.",
        intro: [
          ['sys', "The Long Bar at Mile Zero, last stop before the open wastes. Every road on the Surface starts on its porch. Most end there."],
          ['hero', "Came through the tear with a revolver, a deck of cards and my grandmother laughing as she dealt me in. Kept all three."],
          ['agent', "Halcyon requisition. This bar is a checkpoint now. And we're taking the runner who drinks here."],
          ['hero', "Tarn's out on the road. And this is a bar. You want a drink, or the other thing?"],
          ['agent', "Take him."],
          ['hero', "The other thing, then. Ante up."]],
        win: [
          ['hero', "Five to make a point. The sixth ends the conversation."],
          ['citizen', "They'll be back with more, Jax."],
          ['hero', "Then I keep the water cold and the gun warm. Every road starts here. None of theirs."]] },
      2: { zone: 'milezero', with: 'tarn', goal: 'Hold Mile Zero with Tarn',
        card: "Tarn comes up onto the porch with nine towns of dust on him and Halcyon a mile behind, and Jax pours the water cold.",
        meet: [
          ['tarn', "Water. Cold. Please. Nine towns since dawn, and a Halcyon checkpoint in every one."],
          ['hero', "Always cold. Sit. ...You ran nine towns with Halcyon on your heels?"],
          ['tarn', "They can't keep up. That's the point. But they tracked me here. Sorry."],
          ['hero', "Don't be. A porch is for meeting folks. Some get a drink. Some get the other thing."],
          ['tarn', "I'll take the left. You take everyone else."]],
        win: [
          ['tarn', "Captain's down. You missed one."],
          ['hero', "I never miss. That one was a warning. The sixth had the captain's name on it."],
          ['tarn', "Same time tomorrow. Keep the water cold."],
          ['hero', "Always is, runner."]] },
      3: { zone: 'milezero', rival: 'yara', goal: 'Duel Yara at ten paces',
        card: "Yara can drop a man at a mile and Jax can drop one at ten paces, and after years of argument they have agreed to settle it at his distance.",
        meet: [
          ['yara', "Ten paces, Jax. Your distance. Win here and the bet's yours. Lose, and it's mine at every range."],
          ['hero', "And the loser buys. Years on this bet, and not one round's been poured on it."],
          ['yara', "Halcyon had me shooting at a mile for a year. I'm going back up to answer for that. I want this settled first."],
          ['hero', "Then we settle it. Ten paces. Draw on the last stroke of the bell."]],
        win: [
          ['yara', "...Ten paces is yours. A mile is still mine."],
          ['hero', "A mile's a long way off to need a friend. Ten paces is where they stand."],
          ['yara', "Fine. I'm buying. Don't look so pleased."],
          ['hero', "First round ever poured on this bet. Make it cold."]],
        lose: [
          ['yara', "Ten paces, a mile. It's all one distance to an arrow."]] },
      4: { zone: 'meridian', goal: 'Six shots, six drill-heads',
        card: "Six Halcyon drills turn in the sand at the Buried Meridian, and Jax has six bullets and a gambler's nose for a stacked deck; the dealer turns out to be Rue.",
        intro: [
          ['sys', "The Buried Meridian. Six Halcyon drills churn the sand, and the Long Bar's regulars have come with rifles."],
          ['citizen', "Folks say a Deepline boy gassed the Sky's labs and a Sky girl drilled Deepline. Whose side are we on, Jax?"],
          ['hero', "Two faces, one week, both doing Halcyon's work. I've played cards. That's a stacked deck."],
          ['hero', "The side that isn't drilling. Six drills. I count six bullets. I like those odds."]],
        win: [
          ['sys', "Six shots crack out over the dunes. Six drill-heads grind to a stop."],
          ['hero', "Five to make a point. The sixth to end the conversation."],
          ['citizen', "Word from the Crater, Jax! The two faces were one liar. Something called Rue. Pell named her."],
          ['hero', "Told you. Stacked deck. Somebody tell Halcyon the bar is closed."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Stand against Itsuki',
        card: "The strongest fighter in any world walks out of the Ash Dunes toward Mile Zero, and Jax lands all six shots and still ends face down in the sand.",
        intro: [
          ['sys', "Noon goes dark. The sky splits and Vael comes through. In the Ash Dunes, one champion walks ahead of the Legion, alone."],
          ['sys', "Ivo is down. Tarn is down, and running for help anyway. The stranger walks on toward Mile Zero, unhurried."],
          ['hero', "Strongest thing I've ever seen, and it's walking toward my bar. ...Nope."]],
        meet: [
          ['itsuki', "Fire, wind, thunder, earth, water. I learned them on five worlds. And you have brought a pistol."],
          ['hero', "Six shots and a deck of cards. You'd be amazed what that hand has beaten. Who are you?"],
          ['itsuki', "Itsuki. Vael's champion. I break whatever is left standing, and your porch is still standing."],
          ['hero', "Every road on the Surface starts on that porch. It's high noon, champ. Somewhere."]],
        win: [
          ['sys', "Six shots, six hits. Itsuki shrugs them off like rain, the wheel turns once, and Jax is face down in the sand."],
          ['hero', "...Huh. Seen a man take one bullet and keep walking. Never six."],
          ['itsuki', "You made me stop for a breath. That is more than most worlds managed."],
          ['sys', "Itsuki walks on without looking back. Behind him, Jax gets to one knee, spits sand, and reloads."],
          ['hero', "One breath at a time. Somebody out there is holding the next card."]],
        lose: [
          ['itsuki', "The wheel turns. Get up, gunslinger. Or don't. The sand is patient."]] },
      6: { goal: 'Hold Itsuki at ten paces',
        card: "Jax holds the Crater rim beside Yara while the six run for the Crown, then meets Itsuki again at ten paces and buys them every breath he can.",
        intro: [
          ['sys', "The Crater. The Legion pours down from the crown-ship like black water. The Surface holds the rim, with the Long Bar's rifles."],
          ['sys', "Six run down through the middle of it toward the Crown. One is the Deepline kid who stood up to Itsuki after Jax fell."],
          ['hero', "Go on, kid. Drinks are on the house when you get back. Water too."],
          ['kael', "You don't even have a bar here!"],
          ['yara', "I've got the mile. You've got ten paces. Nothing lives in between."],
          ['hero', "Then keep the rim cold and the guns warm."]],
        meet: [
          ['sys', "Down the stair from the Crown comes one champion, after the six. Jax steps out in front of him, ten paces off."],
          ['itsuki', "The gunslinger. Six for six, in the dunes. I remember every one of them."],
          ['hero', "So do I. I reloaded. The kid and his friends are busy, champ. You'll have to make do with me."],
          ['itsuki', "You bought one breath in the dunes. Today one breath will not be enough."],
          ['hero', "Ten paces. Draw when you're ready."]],
        win: [
          ['sys', "Six shots, and six more. Itsuki takes every one, and stops for each. Up the stair, the six slip inside."],
          ['itsuki', "Twelve breaths, gunslinger. You bought them twelve. That is all of my time you can afford."],
          ['sys', "Itsuki turns back up to the Crown, unhurried. Jax lets him go, sits down on the rim, and thumbs in fresh rounds."],
          ['sys', "Above the Crater the crown-ship falls. The door to the Beyond drags back the Legion and every champion. Itsuki goes last."],
          ['sys', "Next morning the Long Bar opens on time. The porch is full, and Yara is paying."],
          ['yara', "First round's on me. Second too. Don't get used to it."],
          ['hero', "Water's cold. Somebody save a seat for the kid with the thunder."],
          ['hero', "High noon, partner."]],
        lose: [
          ['itsuki', "Six for six again, gunslinger. And again, I am standing."]] }
    },

    // ---------------------------------------------------------------- TARN
    tarn: {
      1: { zone: 'milezero', goal: 'Run the post past the checkpoint',
        card: "Tarn once ran the length of the Vharra steppe in nineteen days, and he does not mean to stop for a Halcyon checkpoint at Mile Zero.",
        intro: [
          ['sys', "Mile Zero, before dawn. A runner jogs on the spot, letters buttoned inside his shirt, his breath smoking."],
          ['hero', "Vharra's steppe, end to end, is forty days on a good horse. I did it in nineteen. On foot."],
          ['hero', "When the tear came, I walked in front of it nine hundred miles, shouting run at every camp. Then I turned and hit it."],
          ['agent', "Halcyon checkpoint. All post is confiscated, by order of the Director. Hand over the bag, runner."],
          ['hero', "Letters don't stop for checkpoints. Neither do I."]],
        win: [
          ['hero', "Every hit harder than the last. You should have stopped me at the first."],
          ['citizen', "Is that the post? From the Crater rim? We heard the road was cut!"],
          ['hero', "Nothing's cut while I've got legs. Next town's forty miles. Back by sundown."]] },
      2: { zone: 'saloon', with: 'fenn', goal: 'Run the hounds off the porch',
        card: "On the porch of the Long Bar, Tarn finds the one man from the steppe he never found on the steppe: Fenn, with Halcyon's hounds on his scent.",
        meet: [
          ['fenn', "Tarn. Nineteen days across the whole steppe, and you still can't sit still for one drink."],
          ['hero', "Fenn! You're alive! I ran in front of the tear shouting at every camp. I never reached yours."],
          ['fenn', "My wolf stood in front of it. I fell. Woke in a Halcyon cage. Bit my way out."],
          ['hero', "That's you all over. Jax, two waters. Cold."],
          ['fenn', "Later. Halcyon's hounds have my scent, and they've followed it to this porch. Sorry."],
          ['hero', "Like old times. You hunt. I run rings round them."]],
        win: [
          ['fenn', "Still the only man who keeps pace with the wolf."],
          ['hero', "The wolf's the one thing I never outran. Don't tell it."],
          ['hero', "The steppe is gone, Fenn. But a porch and a friend will do for a starting line."]] },
      3: { zone: 'milezero', rival: 'ivo', goal: 'Outrun Ivo at Mile Zero',
        card: "Ivo has trained before every dawn for years to catch the fastest man on the Surface, and today Tarn has a letter to deliver and no time to lose.",
        meet: [
          ['ivo', "Tarn! Before dawn, Mile Zero, like I said. Today's the day I catch you."],
          ['hero', "Ivo, I've got a letter for the Crater rim and Halcyon on the post's tail. I don't have time."],
          ['ivo', "Then fight me on the way! If I land one, I run the route with you. If not, I go back up the mountain."],
          ['hero', "Deal. Try to keep up."]],
        win: [
          ['ivo', "I touched you! Did you feel that? My knuckle touched your vest!"],
          ['hero', "...Almost. That was almost."],
          ['ivo', "From you, almost is basically a win! How are you still faster? I train before every dawn!"],
          ['hero', "I train at night. Don't tell anyone."],
          ['ivo', "...You WHAT?"]],
        lose: [
          ['ivo', "Caught you! Finally! Up you get. We're running the rest of the route together."]] },
      4: { zone: 'meridian', goal: 'Carry the word to every town',
        card: "The night before the Drills, Tarn runs forty towns and brings the whole Surface to the Buried Meridian by noon; by dusk he has a new name to carry: Rue.",
        intro: [
          ['sys', "The night before the Drills. Every town on the Surface has heard a different story, and every one of them is a lie."],
          ['citizen', "The Sky's girl Nyra drilled Deepline! Deepline's boy Kael gassed the Sky! It's war, runner. Choose a side."],
          ['hero', "Same two faces, two stories, one week. Faces can be borrowed. Halcyon's drills can't."],
          ['hollis', "Tarn. Every town, one night. The Buried Meridian at dawn. The Surface stands together, or it gets drilled."],
          ['hero', "Every town. One night. Easy."]],
        win: [
          ['sys', "By dawn every town on the Surface has heard. By noon they are all at the Buried Meridian, tools in hand."],
          ['hero', "Forty towns in one night. The nine hundred miles were harder."],
          ['sys', "By dusk there is fresh post from the Crater: Pell named the face-thief. Rue. Every porch on the Surface needs to hear it."],
          ['jax', "Water first, runner. Cold. Then run the name."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Hold Itsuki, then run for help',
        card: "In the Ash Dunes Itsuki beats Ivo, then Tarn; Tarn lands every mile he has ever walked in one punch, goes down, gets up, and runs for Kael.",
        intro: [
          ['sys', "The sky over the Crater tears from edge to edge and Vael comes through. In the Ash Dunes, a stranger walks ahead of the Legion."],
          ['sys', "Ivo was the first to face him. Ivo lies in the sand, still trying to rise."],
          ['hero', "Ivo! ...Okay. Every hit lands harder than the last. I just have to keep hitting."]],
        meet: [
          ['itsuki', "You're fast. Faster than the boy. He told me someone faster was coming. He sounded proud."],
          ['hero', "He says that about me every morning. Who are you? What do you want with these dunes?"],
          ['itsuki', "Itsuki. Vael sends me to break what the others miss. Run, runner. It is the one thing you do well."],
          ['hero', "I ran nine hundred miles in front of a tear. Then I turned round and hit it."]],
        win: [
          ['sys', "Tarn lands everything he has ever walked in one punch. Itsuki takes it, and nods. The wheel turns, and Tarn goes down."],
          ['hero', "...Strongest thing... in any world."],
          ['hero', "Can't beat him. Can still run. Kael throws thunder. Fenn's kid brother. Deepline, tonight."],
          ['sys', "Tarn gets up, and runs."]],
        lose: [
          ['itsuki', "Keep running, runner. The Legion has more legs than you, and none of them tire."]] },
      6: { goal: 'Keep Mile Zero open',
        card: "Every road on the Surface starts at Mile Zero, and the Legion is marching down all of them at once; Tarn keeps the first mile while Gale flies for the Crown.",
        intro: [
          ['sys', "Mile Zero. Every road on the Surface starts here, and the Legion's last column is coming down all of them at once."],
          ['sys', "Far off, over the Crater, the sky burns violet and gold. Gale is up there with the other five."],
          ['hero', "Race thirteen's on hold, then. Jax is at the Crater. Somebody has to mind his porch."]],
        meet: [
          ['sys', "A Siege Walker comes down the road on legs like towers, its captain riding high. Its foot crushes the Mile Zero sign."],
          ['hero', "That's the first mile. Everybody starts there. You're about to finish there."]],
        win: [
          ['sys', "Every hit harder than the last. The Walker's knee goes, then the Walker, then its captain. The road lies open."],
          ['sys', "Then the light changes. The violet drains from the sky over the Crater, and the Legion on every road stands still, and is gone."],
          ['hero', "...They shut it. They actually shut it."],
          ['sys', "Next morning Tarn sets off from the porch with a bag of post. Every town wants the news. Gale is waiting on the wind."],
          ['gale', "Race thirteen. To the Crater rim and back. Go!"],
          ['hero', "Keep up next time."]] }
    },

    // ---------------------------------------------------------------- BRANN
    brann: {
      1: { zone: 'icehouse', goal: 'Walk out of the Ice House',
        card: "Halcyon's Ice House has thick walls and stronger sleeping draughts, and neither was made for the last bear of the north.",
        intro: [
          ['sys', "Halcyon's Ice House. Frost on the pipes, walls a yard thick, and a Subject they cannot keep asleep."],
          ['agent', "He's awake again! Double the dose! It's a bear, it's a man, it's... it's both! Why is it both?!"],
          ['hero', "North of Vharra there were bears that walked like men, and men who fought like bears. I am the last of either."],
          ['hero', "Your walls are thick. I have walked through deeper snow."]],
        win: [
          ['sys', "The wall of the Ice House now has a hole in it the shape of a very large man."],
          ['hero', "North. Where nobody goes, nobody bothers me, and the snow knows how to keep quiet."],
          ['hero', "Whoever follows will learn why nobody does it twice."]] },
      2: { zone: 'icehouse', with: 'kova', goal: 'Teach Kova the bear',
        card: "For thirty days a boy has followed an old bear across the northern snow, talking, and today Halcyon's catchers come up the slope behind them both.",
        meet: [
          ['sys', "The cold northern rim. Snow, wind, and for the thirtieth day running, a boy trudging in an old bear's footprints."],
          ['kova', "Day thirty! Teach me the bear! Tiger, eagle, tortoise, got them. The bear's the only one I can't catch. Please!"],
          ['hero', "You talk more than the wind, and the wind never stops."],
          ['fenn', "He's talked since the Glowwild. I'd teach him just to buy the quiet back."],
          ['hero', "Halcyon's catchers are on the slope. Fight beside me without one word, boy, and you shall have the bear."],
          ['kova', "Deal! I mean... (nods very hard)"]],
        win: [
          ['kova', "..."],
          ['hero', "Good. Not one word. The bear is quiet until it is not. Lesson one."],
          ['fenn', "Lesson one took thirty days."],
          ['hero', "Lesson two will take longer."]] },
      3: { zone: 'icehouse', rival: 'isolde', goal: 'Settle whose winter it is',
        card: "Isolde says winter answers to her, and Brann has asked her up to the northern rim to say it to his face.",
        meet: [
          ['isolde', "You invited me north to say it to your face. So: winter answers to me."],
          ['hero', "Winter answers to no one. But it listens when I speak."],
          ['isolde', "Halcyon kept me a year in a vault colder than this. I never minded the cold. I minded the glass."],
          ['hero', "No glass here. Only snow. Say it again, falconer, and we see which of us the snow listens to."],
          ['isolde', "Winter answers to me."]],
        win: [
          ['isolde', "...Fine. Winter listens to you. Today."],
          ['hero', "Today is enough. Stay for tea. Your bird can sit by the window."],
          ['isolde', "It's made of ice. It has no use for a window."],
          ['hero', "Everyone has a use for a window."]],
        lose: [
          ['isolde', "Hush. Even bears sleep in winter."]] },
      4: { zone: 'meridian', goal: 'Bring the north south',
        card: "Brann believes the wolf over the faces and brings the north to the Buried Meridian, and for the first time in a hundred years snow falls on the Ash Dunes.",
        intro: [
          ['sys', "The Buried Meridian. The drills grind like teeth. All night Tarn ran, shouting for every town to come."],
          ['hero', "The runner says a Sky girl drilled Deepline and a Deepline boy gassed the Sky. Fenn says that boy is his brother."],
          ['hero', "I believe the wolf. Faces lie. Snow does not."],
          ['hero', "Halcyon wants the Surface to sit still while it drills. The north does not sit. The north comes south."]],
        win: [
          ['sys', "Snow falls on the Ash Dunes for the first time in a hundred years. The drill crews run from it, slipping."],
          ['hero', "That was not winter. That was a bear in a bad mood."],
          ['kova', "Can I talk now? The faces were fake! Rue, Pell says! I KNEW it!"],
          ['hero', "No."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Keep getting up against Itsuki',
        card: "Itsuki has put Ivo, Tarn and Jax in the sand; the last bear stands between him and the Hidden Village, and falls, and rises, and falls, until thunder comes.",
        intro: [
          ['sys', "The sky over the Crater splits and Vael comes through. In the Ash Dunes, Ivo is down. Tarn is down. Jax is down."],
          ['sys', "The stranger with the five elements walks on toward the Hidden Village, and the Legion follows him in like the tide."],
          ['hero', "The last bear in any world. Good. Let us meet the strongest fighter in any world."]],
        meet: [
          ['itsuki', "Old man. Move. You are the last thing between me and the village."],
          ['hero', "Then I am the right thing to stand between you and the village. Who sends a boy to break villages?"],
          ['itsuki', "Vael. And fire, earth and water have each laid down bigger than you."],
          ['hero', "Knock me down, boy. Then watch what I do next. It is the only trick I know."]],
        win: [
          ['sys', "The last bear falls. He gets up. He falls again. He gets up again, slower, with snow in his beard."],
          ['itsuki', "...Why do you keep getting up? You cannot win this."],
          ['hero', "Because a boy with thunder is running here behind you. I am buying him time with the only coin I have."],
          ['sys', "Over the dunes comes thunder. Kael is here. Brann lies down in the snow he brought, and gives him the next round."]],
        lose: [
          ['itsuki', "Stay down, bear. It is winter. Bears sleep."]] },
      6: { goal: 'Keep the north',
        card: "Brann keeps the northern rim alone against the Legion's last column, and brings the Last Winter down on a Siege Walker while far to the south the Crater burns.",
        intro: [
          ['sys', "The northern rim, by the broken Ice House. Snow on the wind, and the Legion's last column toiling up the slope."],
          ['sys', "Far to the south, the sky over the Crater burns. The bear does not look at it."],
          ['hero', "The falconer is at the Crater. The boy is wherever the noise is. The north is mine to keep."]],
        meet: [
          ['sys', "A Siege Walker looms out of the snow-mist, a captain on its back, crushing the slope at every stride."],
          ['hero', "Big. In the north, the big ones fall loudest."]],
        win: [
          ['sys', "The Last Winter falls on the slope. The Walker freezes mid-stride and topples, its captain under it."],
          ['sys', "Far south, the violet in the sky goes out like a lamp. The Legion on the slope stops, and is drawn away into the dark."],
          ['sys', "Next morning, a falcon of ice settles on the Ice House sill. Then a boy arrives, talking before he is through the door."],
          ['kova', "Brann! The sky's shut! I watched it from the Glowwild! Is it lesson two yet? Is it?"],
          ['hero', "Lesson two. Tea. Quietly. The bird can sit by the window."],
          ['hero', "Winter is mine."]] }
    },

    // ---------------------------------------------------------------- DUNE
    dune: {
      1: { zone: 'dunes', goal: 'Guard the Buried Meridian',
        card: "Under the Ash Dunes lies a city that went down with its people still in it, and above it, patient as the sand, stands the one who keeps them.",
        intro: [
          ['sys', "The Ash Dunes. Beneath them lies the Buried Meridian, a city that went down with its people still inside."],
          ['hero', "They are still here, under the sand. I keep them."],
          ['hero', "Some say I was one of them. Some say I am the sand they lie in, standing up. I correct neither."],
          ['sys', "Over the ridge come Tarek's chain raiders, with shovels and Halcyon's money."],
          ['hero', "Diggers. Again. No one digs up the dead to sell them."]],
        win: [
          ['hero', "The sand keeps what it takes. Go home, raiders."],
          ['sys', "On the far ridge a chain rattles. Tarek is watching, as he always is, from just out of reach."],
          ['hero', "Next year, chain-man. And the year after. I am patient. I am sand."]] },
      2: { zone: 'dunes', with: 'hollis', goal: 'Hold the longest night with Hollis',
        card: "On the longest night of every year an old man walks into the desert with tea that Dune will never drink, and sits with her until morning.",
        meet: [
          ['sys', "The longest night of the year. Stars like spilled salt. An old man walks into the desert, as he does every year, and sits."],
          ['hollis', "Evening, Dune. Brought tea. You won't drink yours. I'll drink it for you, as usual."],
          ['hero', "Every year. Why do you come?"],
          ['hollis', "Because it's the longest night, and nobody should sit through it alone. Not even sand."],
          ['hero', "...Halcyon's survey crews come at night now. They want the city."],
          ['hollis', "Then we'll stand up for a bit. Then we'll sit back down. The night's long enough for both."]],
        win: [
          ['hollis', "There. The tea's gone cold. Worth it."],
          ['hero', "Hollis. If I was one of them once, the people under the sand... would you still come?"],
          ['hollis', "Every year. It's not the sand I come to see."]] },
      3: { zone: 'meridian', rival: 'tarek', goal: 'Fight Tarek over the buried city',
        card: "For six years Tarek has dug at the buried city and Dune has buried his chains, thirty-one of them; today, for the first time, she goes out to meet him.",
        meet: [
          ['tarek', "Dune. My crew's worked this ground six years. How many of my chains have you buried? I've lost count."],
          ['hero', "Thirty-one. You cannot count them. I can. They lie down there with my people."],
          ['tarek', "Halcyon pays triple now. They want the deep levels. One more fight and the city's mine, Dune. The last one."],
          ['hero', "Then come. You never go to anyone. Today I come to you."]],
        win: [
          ['tarek', "...Thirty-two chains. You're keeping count, aren't you."],
          ['sys', "On the horizon behind the raiders' camp, something huge with Halcyon's sun on its flank begins to turn."],
          ['tarek', "Triple pay... They're done buying. They're bringing drills. They'll dig it all."],
          ['hero', "Then whoever stands on top of it is buried twice. You. Me. Everyone."]],
        lose: [
          ['tarek', "Reeled in. Thirty-one chains, Dune, and I only ever needed one."]] },
      4: { zone: 'meridian', goal: "Hold one end of Tarek's chain",
        card: "Tarek walks into the desert unarmed and holds out one end of his chain; Dune takes it, Halcyon's drills go under the sand, and the faces get a name: Rue.",
        intro: [
          ['sys', "The Buried Meridian. Halcyon's drills sink into the sand while the layers above and below shout each other hoarse."],
          ['citizen', "Deepline says the Sky's girl, Nyra, led drills into its tunnels. Now the same drills are here. Was she here too?"],
          ['hero', "A face is easy to wear. The sand knows the truth. These drills are Halcyon's, whoever's face walked before them."],
          ['sys', "A man walks into the desert. No chain on his arm, no sickle. Tarek, unarmed, holding out one end of his chain."],
          ['tarek', "They'll bury everyone, Dune. You, me, the dead. Take it. One end each."]],
        win: [
          ['sys', "Sand and chain together. The drill crews are reeled in, and the drills sink into the dunes they came to dig."],
          ['tarek', "Word from the Crater. The faces were one thing, wearing all of them in turn. Rue, Pell called it."],
          ['hero', "A thing with no face of its own. The sand will remember its name."],
          ['tarek', "Holding my end. Still don't like you."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Reach Opal on the Glass Sea',
        card: "Mile by mile a stranger called Opal seals the dunes over the Buried Meridian in glass, and Dune raises the whole desert against her.",
        intro: [
          ['sys', "The sky cracks like glass under a boot, and Vael comes through. On the Glass Sea, a stranger glasses the dunes, mile by mile."],
          ['sys', "The Legion marches over the new glass. Beneath it, the Buried Meridian falls silent."],
          ['hero', "My desert. My people under it. Sealed in glass, forever."]],
        meet: [
          ['opal', "Who are you? Vael says glass keeps things. Nothing under glass is ever dug up again. Isn't that kind?"],
          ['hero', "I keep them. I have kept them since the Ashfall War. They have no need of a stranger's glass."],
          ['opal', "I'm sorry. He told me to. My world was crystal and light, and it was beautiful, until he came."],
          ['hero', "Then you know what it is to lose a world. Do not take mine."]],
        win: [
          ['sys', "The desert rises. Sand pours over the glass faster than Opal can grow it, until she stands on a little island of crystal."],
          ['opal', "...It won't stay glass. It keeps going back to sand."],
          ['hero', "Sand keeps what it takes. Go home to your king, girl. Tell him the dead are kept."],
          ['sys', "Opal is pulled up into the light, back to the crown-ship. The dunes settle over the Meridian like a sheet drawn up."]],
        lose: [
          ['opal', "Hold still. Glass doesn't drift. Glass buries no one."]] },
      6: { goal: 'Keep Itsuki in the sand',
        card: "Dune holds the Crater rim while the six go up, and when Itsuki comes down after them, the whole desert rises out of the Crater floor to keep him.",
        intro: [
          ['sys', "The Crater. The Legion pours down from the crown-ship, more soldiers than the desert has grains, black as wet ash."],
          ['sys', "Six go down through it toward the Crown. Brakk, who stood on the Glass Sea before her, walks last."],
          ['hero', "Go, stone man. The rim is sand now. It will hold."],
          ['hollis', "Tea after, Dune? I'll drink yours, as usual."],
          ['hero', "After. Nothing crosses this rim."]],
        meet: [
          ['sys', "Down the stair from the Crown comes one champion, after the six. The sand rises to meet him, grain by grain."],
          ['itsuki', "Guardian. I crossed your desert to reach the Crown. Move, and I will cross you as well."],
          ['hero', "No one walks over the Meridian twice."],
          ['itsuki', "Then I will walk over it once more, and keep walking. Nothing on this side of the door stops me."],
          ['hero', "I do not have to stop you. Only keep you. I am patient. I am sand."]],
        win: [
          ['sys', "The desert pours up out of the Crater floor. Itsuki cuts it apart, and it closes round his feet again, and again."],
          ['itsuki', "...Sand. It has no end. Keep your desert, guardian. I am needed above."],
          ['sys', "Itsuki turns back up to the Crown. From the rim, Dune and Hollis watch the crown-ship tip, and fall into the Crater."],
          ['sys', "The door to the Beyond drags back the Legion and every champion. Itsuki is the last to go."],
          ['sys', "Next morning Dune walks home to the Ash Dunes. Tarek is walking out to meet her, the chain over his shoulder."],
          ['tarek', "One end each. And somebody has to guard the glass now too, I suppose. Don't look at me like that."],
          ['hero', "Somebody must. Rest now, all of you, under the sand."],
          ['hero', "Buried with the city."]],
        lose: [
          ['itsuki', "Sand blows away, guardian. Every desert ends at a wind."]] }
    },

    // ---------------------------------------------------------------- HOLLIS
    hollis: {
      1: { zone: 'village', goal: 'Defend the Hidden Village',
        card: "The Hidden Village sits on a mountain no map shows, and its elder has not moved since breakfast, which Halcyon is about to mistake for weakness.",
        intro: [
          ['sys', "A mountain no map shows. The Hidden Village of the Clans, and its elder, who has not moved since breakfast."],
          ['hero', "I remember the night after the Ashfall War. The rich went up, the poor went down. A few of us swore to live in all three."],
          ['hero', "I wrote the Pact by firelight. Oda rang the bell over it. We still argue about the second line."],
          ['agent', "Halcyon survey. This mountain is on no map, which makes it ours. Clear the old man out."],
          ['hero', "Standing still gathers Stillness, young man. And I have been standing still a very long time."]],
        win: [
          ['hero', "There. Now the mountain is on somebody's map. Mine."],
          ['sys', "Down the path, the bell of the Last Toll rings once: Oda's way of saying well done."],
          ['hero', "Don't gloat, Oda. You'd have rung it either way."]] },
      2: { zone: 'village', with: 'ivo', goal: 'Test Ivo at the Village gate',
        card: "A boy has sat at the village gate every dawn for a year because an old man told him to wait for the sunrise, and the old man has run out of excuses.",
        meet: [
          ['sys', "Dawn at the Hidden Village. A boy of fourteen sits by the gate, frost on his knees, as he has every dawn for a year."],
          ['ivo', "Three hundred and sixty-five. A year of sunrises, Elder. You said wait for the sunrise. I waited."],
          ['hero', "So you did. Most leave after a week. Brakk sat on my mountain three days, and I thought that was long."],
          ['brakk', "It was long."],
          ['ivo', "Teach me. Please."],
          ['hero', "Then here is the first lesson. Halcyon's on the path. Start before they're ready, and don't stop until it's done."]],
        win: [
          ['ivo', "Was that the lesson? I just hit them really fast."],
          ['hero', "The year was the lesson. This was the test. You passed both, young one."],
          ['brakk', "He will be up before every dawn now."],
          ['hero', "Good. So will I. Someone has to keep an eye on him."]] },
      3: { zone: 'village', rival: 'oda', goal: 'Argue the Pact out with Oda',
        card: "For ninety-six years two old men have argued over one line of the Pact, one with words and one with a bell, and today the argument comes to fists.",
        meet: [
          ['sys', "The Temple of the Last Toll. Two old men, and one argument over one line, ninety-six years long."],
          ['hero', "The second line says the Clans keep the layers from killing each other. It says nothing of fighting Halcyon's war."],
          ['sys', "Oda rings the bell. Once. Hard."],
          ['hero', "I know what Halcyon does. I know they take children. ...I know about Coda, old friend."],
          ['sys', "The bell rings again. Then Oda sets it down, and raises his fists."],
          ['hero', "Ninety-six years of arguing with a bell. Fine. Fists, then. The winner reads the line."]],
        win: [
          ['hero', "Ha. Still got it. ...So have you. My jaw is ringing louder than your bell."],
          ['sys', "Oda sits in the temple doorway, smiling, and waits. He was always better at waiting."],
          ['hero', "Fine. We go down the mountain. We stand with them, not just between them. You win the line. I win the fight."],
          ['sys', "The bell rings once, very softly. It sounds a great deal like laughter."]],
        lose: [
          ['sys', "The bell rings over Hollis, flat on the temple floor. It sounds exactly like I told you so."]] },
      4: { zone: 'meridian', goal: 'Cross out three, write four',
        card: "The bell rings three times, the Surface comes to the drills, and when the faces turn out to be Rue, Hollis takes up a brush and writes a fourth banner under the three.",
        intro: [
          ['sys', "The Buried Meridian. For the first time in living memory the Surface stands as one, and Halcyon's drills grind toward it."],
          ['hero', "The Sky says Deepline's boy gassed its labs. Deepline says the Sky's girl drilled its tunnels. Two faces. One liar."],
          ['hero', "When everyone is shouting, look at who is quiet. Halcyon is very quiet. Its drills are not."],
          ['sys', "At the Hidden Village the bell rings three times. In ninety-six years Oda has never rung it three times."],
          ['hero', "Three. ...Oh, old friend. Everyone! To the drills!"]],
        win: [
          ['sys', "Word from the Crater: Pell named the face-thief, Rue, and Kiri flew it there. When the true Kael stood up, the false one ran."],
          ['hero', "Then the layers were never at war. Someone wanted them to be. Bring me the Pact, and a brush."],
          ['sys', "Beneath the three layers Hollis writes a fourth: the Hidden Clans, who live in all of them. Four banners, four sides of the Spire."],
          ['hero', "Up we go, young ones. Mind your knees."]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Hold the Tether Fields',
        card: "A stranger in white and black drags the Tether Fields out of true and Aurelia lurches overhead, and Hollis, who has kept a balance for ninety-six years, stands still.",
        intro: [
          ['sys', "The sky opens like a wound and Vael steps through. At the Tether Fields, a stranger in white and black drags the tethers awry."],
          ['sys', "The Legion pours over the anchor stones. Overhead, Aurelia lurches like a ship in a swell."],
          ['hero', "If the tethers go, the city comes down on all of us. Up, old bones. One more time."]],
        meet: [
          ['ryo', "Step back, old man. Vael says the sides were never meant to balance. One falls so the other may rise."],
          ['hero', "That's not balance, young one. That's a seesaw with a king sitting on one end."],
          ['ryo', "Once I closed tears between worlds, with my brother. Then Vael found us. Now we open them."],
          ['hero', "Ninety-six years I've kept three layers from killing each other. I can keep one more rope."],
          ['ryo', "Light Palm. Dark Palm. Hold still, old man. It will be quick."]],
        win: [
          ['sys', "Hollis stands still and takes everything. Stillness gathers, and the Elder Mountain stamps three times."],
          ['ryo', "...You don't tip. There's no side of you to push."],
          ['hero', "That's what a lifetime of standing still is for. Go back to your king, young one. Tell him the ropes held."],
          ['sys', "Ryo steps back into the gale and is gone, up to the crown-ship. Taro and Tor haul the tethers level, hand over hand."]],
        lose: [
          ['ryo', "Out of balance, old man. You are leaning. Everyone leans, in the end."]] },
      6: { goal: 'Hold the rim under four banners',
        card: "Four banners fly on the Crater rim, and under them an old man holds the line while the six go up, then stands still in Itsuki's path for exactly as long as it takes.",
        intro: [
          ['sys', "The Crater. Four banners snap on its rim: Aurelia, the Surface, Deepline, the Hidden Clans. The Legion pours down to meet them."],
          ['sys', "Six go down through the Legion toward the Crown. One is a mountain Hollis once taught where to stand."],
          ['hero', "Go on, young one. You chose where to stand. Stand up there."],
          ['brakk', "And you, old man?"],
          ['hero', "Ninety-six years I kept three layers apart. Today I hold them together, on this rim. Go."]],
        meet: [
          ['sys', "Down from the Crown comes one champion, walking after the six. Hollis is already standing in his way."],
          ['itsuki', "Elder. You stood still before my brother. Stand aside for me. The six are mine to stop."],
          ['hero', "I'm not much for standing aside. Standing still, though. I'm very good at that."],
          ['itsuki', "I am the strongest thing on any world. Your stillness is a pebble in my road."],
          ['hero', "It needn't hold you forever, young one. Only long enough."]],
        win: [
          ['sys', "Hollis stands still and takes everything. Stillness gathers, the Elder Mountain stamps three times, and Itsuki halts."],
          ['itsuki', "...Enough. You have spent the time I needed, old man."],
          ['sys', "Itsuki turns back up to the Crown, not beaten, only late. From the rim, Hollis watches the crown-ship fall into the Crater."],
          ['sys', "The door to the Beyond drags back the Legion and every champion, Itsuki last."],
          ['sys', "Next morning, over the Pact, Oda rings the bell once and breaks his vow for one word."],
          ['hero', "Together. He said together. ...He says he didn't. The old bell isn't saying."],
          ['sys', "Hollis pats the nearest head. It happens to be Ivo's, asleep on his feet against the gatepost."],
          ['hero', "Rest, young one."]],
        lose: [
          ['itsuki', "Stillness is not enough, Elder. Even mountains are moved, given time."]] }
    },

    // ---------------------------------------------------------------- UME
    ume: {
      1: { zone: 'glowwild', goal: 'Weed Halcyon out of the garden',
        card: "The Glowwild glows because Halcyon poisoned it, and at its heart Ume has grown the loveliest garden on the Surface, and the deadliest.",
        intro: [
          ['sys', "The Glowwild, a forest that glows because Halcyon poisoned it. At its heart, the loveliest garden on the Surface."],
          ['hero', "If the forest was going to be poison, it was going to be beautiful poison. That was my first rule."],
          ['hero', "My second rule: touch none of it."],
          ['agent', "Collection team. We're taking samples. All of them. Halcyon owns whatever grows on Halcyon's waste."],
          ['hero', "Oh, help yourselves. Start with the pretty ones."]],
        win: [
          ['hero', "Spore Puff, Vine Snap, and a Corpse Flower to finish. They touched the pretty ones."],
          ['sys', "Bees drift in over the flowers, thin and starving, humming. Ume holds out a palm of nectar."],
          ['hero', "There, little ones. Eat. Nobody else would let you near. My garden will."]] },
      2: { zone: 'glowwild', with: 'elixa', goal: 'Guard the spore beds with Elixa',
        card: "Elixa comes down for spores, for a cure that might wake the Husks, and Ume, who always asks what for, likes the answer; the collectors behind her do not.",
        meet: [
          ['elixa', "Ume. Spores again, please. For the cure. The Husks Halcyon makes. I think I can wake one."],
          ['hero', "I always ask what for. ...Wake one? You mixed the serums that made them, Elixa."],
          ['elixa', "I know. That's what for. Also, Halcyon followed me down the Skylift. Collectors, by the poison oaks."],
          ['hero', "That's a good answer. Take two. They want everything in a jar. You throw flasks, I poison. A garden needs both."]],
        win: [
          ['elixa', "Red, blue, green, and your spores on top. They'll be scratching for a month."],
          ['hero', "Two months. Nobody touches the pretty ones."],
          ['elixa', "Same time next month? If the cure works, I'll bring you a Husk's first word."],
          ['hero', "Bring me that. It's the one thing I'd trade a Corpse Flower for."]] },
      3: { zone: 'glowwild', rival: 'thorne', goal: 'Out-garden Thorne',
        card: "Every spring Thorne sends cuttings with a polite note; this spring he comes himself, carrying shears, because Ume's roots are dripping on his dead.",
        meet: [
          ['thorne', "Good evening, Ume. Cuttings, as every spring. And shears, this time. Do forgive me."],
          ['hero', "Shears. In my garden. That's a bold thing to carry into a poison garden, Thorne."],
          ['thorne', "Your roots have broken through my catacomb ceiling, and something drips from them onto my dead. I've come to prune."],
          ['hero', "That's Halcyon's runoff, not my roots. And nobody prunes my garden but me. Nobody."],
          ['thorne', "Then let us settle it as gardeners. Whatever is still standing at the end, grows."]],
        win: [
          ['thorne', "Achoo. ...Your pollen. You have won, and I shall be sneezing for a week."],
          ['hero', "Two weeks. I bred it stronger. Now, the dripping: we follow it back to Halcyon's dump pipe. Together."],
          ['thorne', "A joint pruning. How perfectly delightful. Achoo."]],
        lose: [
          ['thorne', "Cut back hard, a garden grows stronger. You will see, come spring."]] },
      4: { zone: 'meridian', goal: 'Bloom the Glowwild over the camp',
        card: "Halcyon's drill camp pumps its waste into the Glowwild, so Ume gives it back: the whole forest blooms at once, and the two faces prove to be one graft called Rue.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. Halcyon's drill camp squats on the edge of the Glowwild, pumping waste into it."],
          ['hero', "Up top, a Deepline boy gassed the Sky. Down below, a Sky girl drilled the tunnels. Pretty stories. Poisonous."],
          ['hero', "Someone grafted the wrong face onto the wrong stem. I know a graft when I see one."],
          ['hero', "And all the while, Halcyon dumps on my forest. Let's give them something back."]],
        win: [
          ['sys', "The whole Glowwild blooms at once over the drill camp: spores like snow, vines like cables, flowers taller than the rigs."],
          ['agent', "Don't touch anything! Don't touch ANYTHING!"],
          ['hero', "Good advice. A little late."],
          ['sys', "By nightfall, word from the Crater: one thing wore both faces, and Pell has named it. Rue. A graft, as Ume said."]] },
      5: { zone: 'glowwild', foe: 'apis', goal: 'Save the garden from the swarm',
        card: "A queen whose hive was drunk by an engine turns her swarm on the Glowwild, and Ume, who has fed every starving thing that ever asked, offers it a poison garden.",
        intro: [
          ['sys', "The sky splits and Vael comes through. In the Glowwild a stranger opens her hand, and her bees turn the colour of a bruise."],
          ['sys', "The bees eat the forest from the edges in, and the Legion marches through the holes they leave."],
          ['hero', "My garden. Every flower I ever grew. ...Who in the world are you?"]],
        meet: [
          ['apis', "Apis. Queen of a hive the size of a world, until an engine drank it dry. Vael let me keep one swarm. It is hungry."],
          ['hero', "Then you ask. I have fed every starving thing that ever came to this forest. I would have fed yours."],
          ['apis', "Vael says take. So I take. That is all a queen is, now. Bzzz."],
          ['hero', "Take from a poison garden, then. Go on. Start with the pretty ones."]],
        win: [
          ['sys', "The swarm dives into Ume's flowers and comes out reeling: spores, Blight, a Corpse Flower snapping shut three times."],
          ['apis', "...Your flowers are poison. Every one."],
          ['hero', "To anything that takes. Never to anything that asks. Tell your king that, queen."],
          ['sys', "Apis calls her swarm into the sky and is gone, up to the crown-ship. The garden still stands."]],
        lose: [
          ['apis', "Bzzz. Pretty garden. Ours now."]] },
      6: { goal: 'Keep the garden growing',
        card: "Through the gaps the swarm burned in the Glowwild the Legion's last column marches in, toward a garden that has never once forgiven a trespasser.",
        intro: [
          ['sys', "The Glowwild. The swarm left the edges black, and the Legion's last column marches in through the burns."],
          ['sys', "Far away, over the Crater, the sky burns. At the heart of the forest, the garden still glows."],
          ['hero', "Everyone's at the Crater, being brave. Somebody has to water the plants."]],
        meet: [
          ['sys', "A Siege Walker steps over the garden wall, its captain riding high. Its great foot comes down on the poison oaks."],
          ['hero', "Oh, you shouldn't have touched those."]],
        win: [
          ['sys', "Vine Snap round its legs, Blight in its joints, a Corpse Flower for its captain. The Walker crashes into the flowerbeds."],
          ['sys', "Then the forest's glow is the only violet left. The sky has closed, and the Legion among the trees stands still, and is gone."],
          ['sys', "Next morning Elixa comes down the Skylift out of breath, holding an empty jar."],
          ['elixa', "One of the Husks moved a finger last night, Ume. One finger. I need more spores. All of them."],
          ['hero', "Take them. Then come back and help me plant the burned edges. Something lovely, and only a little lethal."],
          ['hero', "Beautiful, isn't it? Deadly too."]] }
    },

    // ---------------------------------------------------------------- KOVA
    kova: {
      1: { zone: 'glowwild', goal: 'Chase Halcyon out of the Glowwild',
        card: "A tiger raised him in the mornings, an eagle by noon and a tortoise by night, and when Halcyon comes to net him, Kova cannot decide which to be first.",
        intro: [
          ['sys', "The Glowwild at dawn, blue light leaking from the leaves. A Halcyon hunting party is setting snares for the forest's beasts."],
          ['hero', "A tiger raised me in the mornings, an eagle by noon, a tortoise by night. I never learned to be just one."],
          ['agent', "There. The wild boy. Halcyon wants him for the Beast Pens. Net him, and mind the teeth."],
          ['hero', "Net me? Which one of me? Tiger first!"]],
        win: [
          ['hero', "Tiger in the morning. Eagle by noon. And now they're running, so... tortoise, for a nap."],
          ['sys', "On the road past the forest a caravan creaks by. Kova watches it go, then slips after it, out of sight."],
          ['hero', "Somebody has to watch the spear guy's back. He never once looks behind him."]] },
      2: { zone: 'glowwild', with: 'hart', goal: "Guard Hart's caravan",
        card: "For nine years a caravan guard has left meat out for whatever follows his wagons through the Glowwild, and tonight it walks out of the trees to say thank you.",
        meet: [
          ['sys', "The caravan road through the Glowwild. Every night Hart leaves meat out for whatever follows the wagons. Every morning it is gone."],
          ['hero', "Got your meat. Thanks. Again. Also, there are Halcyon raiders waiting round the bend."],
          ['hart', "...You're the thing that follows the caravans?"],
          ['hero', "You thought I was a beast? I mean. Sometimes I am. Tiger, mostly."],
          ['hart', "Nine years, and I've never been surprised. Keep your distance. I'll keep it for you."],
          ['hero', "Brann taught me the bear. I can be quiet now. Mostly. Here they come!"]],
        win: [
          ['hart', "You fight like four different people at once."],
          ['hero', "Three beasts and me! And a bit of bear, now."],
          ['hart', "I'll keep leaving the meat out, then."],
          ['hero', "Could you cook it next time?"]] },
      3: { zone: 'glowwild', rival: 'fenn', goal: 'Prove every beast beats one wolf',
        card: "Something Halcyon let loose is killing in the Glowwild, and Kova means to prove to a one-trick wolf that every beast beats one.",
        meet: [
          ['sys', "Something Halcyon let loose is killing in the Glowwild. Two hunters find its trail in the same breath."],
          ['fenn', "Go home, kid. One wolf is plenty for this one."],
          ['hero', "One wolf. One trick. I've got tiger, eagle, tortoise and a bit of bear. Who finds it first, do you think?"],
          ['fenn', "Whoever's still standing."],
          ['hero', "Then let's find out who's standing. Every beast against one wolf!"]],
        win: [
          ['fenn', "...Fine. You hit like a tiger. You run like an eagle."],
          ['hero', "And take hits like a tortoise! Say it. Say I'm not a show-off."],
          ['fenn', "You're a show-off. And you won. We hunt it together."],
          ['hero', "Like always. And we both pretend we hate it."]],
        lose: [
          ['fenn', "One wolf. Pick a beast and keep it, kid."]] },
      4: { zone: 'meridian', goal: 'Bring the beasts to the drills',
        card: "The drill camp's waste runs into the Glowwild and the beasts are angry, so Kova leads every one of them to the Meridian, and learns the face-changer has a name: Rue.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. The camp's waste seeps into the Glowwild, and the beasts can taste it."],
          ['hero', "The Sky thinks Deepline gassed it. Deepline thinks the Sky drilled it. A face that changes shape? That's MY trick!"],
          ['hero', "Except I don't use it to lie. Somebody's wearing other people's faces, and the beasts smell Halcyon on them."],
          ['hero', "Tigers, eagles, tortoises, everyone. Follow me!"]],
        win: [
          ['sys', "The Glowwild's beasts boil out of the trees with Kova at their head, and the drill camp scatters like quail."],
          ['hart', "That's... that's the thing that follows my caravans. All of it. All at once."],
          ['hero', "Told you I wasn't just one thing!"],
          ['sys', "Word comes from the Crater: the face-changer is called Rue. Kova takes it personally, for every honest shape-shifter."]] },
      5: { zone: 'glowwild', foe: 'apis', goal: 'Drive the swarm out of the forest',
        card: "A stranger's swarm is eating the forest that raised him, so Kova goes at it as tiger, eagle, tortoise and bear at once, and the queen learns what a boy can be.",
        intro: [
          ['sys', "The sky splits like ripe fruit and Vael comes through. In the Glowwild a stranger's swarm turns violet and eats the forest inward."],
          ['sys', "Behind the swarm the Hollow Legion marches into the trees, rank on hollow rank."],
          ['hero', "That's my forest. The tiger's den. The eagle's tree. The tortoise's pond. All of it."]],
        meet: [
          ['apis', "Wild boy. Every beast at once? How quaint. My swarm is a million at once."],
          ['hero', "Who even ARE you? You fall out of the sky and eat the place that raised me?"],
          ['apis', "Apis. Vael gave me this forest. My bees have been hungry since our world was drunk dry, and I am done being hungry."],
          ['hero', "Then go find another world! Claw, wing and shell. Let's see who's hungrier."]],
        win: [
          ['sys', "Tiger, eagle, tortoise and bear, all at once. The swarm parts round him like water round a rock."],
          ['apis', "...You're four things. My bees can't sting four things."],
          ['hero', "Five, with me. Out of my forest!"],
          ['sys', "Apis pulls her swarm up into the sky, back to the crown-ship. The tiger's den is scorched black, and still there."]],
        lose: [
          ['apis', "Eight bees, then all of them. Your shell has cracks, wild boy. My bees have found them."]] },
      6: { goal: 'Be the whole pack',
        card: "The whole pack is somewhere else today, so Kova keeps the Glowwild's dens alone against the Legion's last column, as tiger, eagle, tortoise and bear.",
        intro: [
          ['sys', "The Glowwild. The tiger's den, the eagle's tree, the tortoise's pond, and the Legion's last column coming through all of them."],
          ['sys', "Far off over the Crater, the sky burns. Fenn, Brann, Hart: the whole pack is somewhere else today."],
          ['hero', "Fine! Then I'm the pack. Tiger, eagle, tortoise, bear. That's four of us already."]],
        meet: [
          ['sys', "A Siege Walker shoulders two trees apart, its captain riding high. It is walking straight at the tiger's den."],
          ['hero', "Not the den! Okay. Bear. Quietly. ...Then very, very loudly."]],
        win: [
          ['sys', "Primal Parade: tiger, eagle, tortoise and bear, all at once. The Walker goes down, and its captain under it."],
          ['sys', "Then the birds start up again. Over the Crater the burning sky has closed, and the Legion in the trees is drawn away like mist."],
          ['sys', "Next morning a caravan rolls down the Glowwild road. A plate waits by the wheel ruts. The meat on it is cooked."],
          ['hart', "You asked for it cooked. Took me long enough to hear you. Come and eat it at the fire, with us."],
          ['hero', "...At the fire? With you? Like, in the caravan? ...Okay. Okay!"],
          ['hero', "Claw, wing and shell."]] }
    },

    // ---------------------------------------------------------------- HART
    hart: {
      1: { zone: 'scrapton', goal: 'Guard the caravan on the Rust Flats',
        card: "Hart has guarded the caravans across the Rust Flats for nine years on a single rule, keep your distance, and Halcyon's toll riders are about to learn it.",
        intro: [
          ['sys', "The Rust Flats: the caravan road from Mile Zero to the Crater rim, red dust, and a young man with a very long spear."],
          ['hero', "I have one rule. Keep your distance. If you won't, I'll keep it for you."],
          ['citizen', "Hart! Halcyon's toll riders are across the road. They say the caravans pay or the caravans burn."],
          ['hero', "Nine years on this road, and I've never been surprised. Get behind me. Stay out of reach."]],
        win: [
          ['hero', "They stepped into reach. The spear did the rest. It usually does."],
          ['citizen', "Something behind the scrap heaps watched all that. Big. Orange. Stripes."],
          ['hero', "I know. I leave meat out for it. Never asked what it is. Roll on."]] },
      2: { zone: 'glasssea', with: 'tor', goal: 'Get the caravan across the glass',
        card: "Something moves under the crystal of the Glass Sea, Halcyon riders herd it at the caravan, and Hart and Tor do what they have always done: shield in front, spear behind.",
        meet: [
          ['sys', "The Glass Sea crossing. The caravan halts. Something is moving under the crystal."],
          ['tor', "Hart. Glass Crawlers ahead, and Halcyon riders behind them, driving them at us like cattle."],
          ['hero', "Shield in front. Spear behind it."],
          ['tor', "Arrows bounce. Crawlers bounce. Everything bounces."],
          ['hero', "And whatever doesn't bounce stays out of reach."]],
        win: [
          ['tor', "Nothing got past. Nothing's about to start."],
          ['hero', "We stopped arguing over who does the work years ago, didn't we?"],
          ['tor', "You stopped. I still say it's the shield."],
          ['hero', "...And the thing that follows us through the Glowwild is sitting on that dune again, licking its paws."]] },
      3: { zone: 'scrapton', rival: 'yara', goal: 'Settle the bet with Yara',
        card: "Yara says a bow reaches further and Hart says a bow never stopped a charge, and on the open Rust Flats, with no caravan to hide behind, reach decides.",
        meet: [
          ['yara', "That rider on the ridge was a mile off. He dropped before your spear finished turning. I'm ahead on the bet, Hart."],
          ['hero', "A bow reaches further. A bow has never stopped a charge."],
          ['yara', "Then charge me. The Rust Flats. No cover, no caravan to hide behind. Reach decides."],
          ['hero', "Reach decides. Keep your distance, Yara. I'll keep it for you."]],
        win: [
          ['yara', "I couldn't get far enough back. Every step I took, the spear was already waiting."],
          ['hero', "Then the bet is square, at last."],
          ['yara', "Square. At a mile, I'm still ahead."],
          ['hero', "At a mile, nobody's charging."]],
        lose: [
          ['yara', "Reach decides, spear-boy. Mine is a mile."]] },
      4: { zone: 'meridian', goal: "Hold the column's front",
        card: "Forty towns march on the Buried Meridian in one column with Hart at its head, and not one drill crew gets within reach; the seams in the faces are named Rue.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. The Surface marches in a column from forty towns, and Hart walks at its head."],
          ['citizen', "Is it true, Hart? A Deepline boy gassed the Sky, a Sky girl drilled Deepline? Is the whole world at war now?"],
          ['hero', "Somebody wants us to think so. At a distance, a face can be anyone's. Up close, you see the seams."],
          ['hero', "Keep the stories at a distance. Keep the drills at the end of my spear."]],
        win: [
          ['sys', "The column's front never bends. Not one drill crew gets within reach of the spear."],
          ['tor', "Flank held."],
          ['hero', "Front held. Nothing got past either of us."],
          ['sys', "That night word travels down the column from the Crater: the seams have a name. Rue. Pell named her."]] },
      5: { zone: 'glowwild', foe: 'apis', goal: 'Reach through the swarm to Apis',
        card: "A million stingers fall on the caravan road through the Glowwild, and Hart, whose spear was never meant for a swarm, aims past every one of them at the queen.",
        intro: [
          ['sys', "The sky splits and Vael comes through. On the caravan road through the Glowwild, a violet swarm falls on the wagons like hail."],
          ['hero', "A million stingers, and not one keeps its distance. A spear is a poor weapon for this."]],
        meet: [
          ['apis', "Spear-boy. Nobody has ever stabbed a swarm. You will only make holes in the air."],
          ['hero', "Nine years on this road and I've never once been surprised. You're the first. Who are you?"],
          ['apis', "Apis. Vael's. This forest is mine to eat, and your wagons are already in my mouth."],
          ['hero', "Then I'm not aiming at the swarm. I'm aiming at the queen. Reach decides."]],
        win: [
          ['sys', "A Thousand Spears fall through the swarm, and one goes exactly where Hart meant it: through the queen's guard."],
          ['apis', "...You reached me. Through a million of them."],
          ['hero', "Keep your distance. Next time, I'll keep it for you."],
          ['sys', "Apis flies up out of the trees to the crown-ship, the swarm streaming after. Something orange and striped growls at her back."]],
        lose: [
          ['apis', "Too close, spear-boy. Swarms keep no distance."]] },
      6: { goal: 'Hold the road without the shield',
        card: "With Tor away on the Crater rim, Hart walks alone in front of three caravans on the Rust Flats and holds the road against the Legion's last column.",
        intro: [
          ['sys', "The Rust Flats, on the caravan road. The Legion's last column marches down it, and three caravans are still out on the flats."],
          ['sys', "Far off, over the Crater, the sky burns. Tor is on the rim there, shield up. Hart is here without him, for the first time."],
          ['hero', "No shield in front today. Then the spear goes in front. Wagons behind me, out of reach."]],
        meet: [
          ['sys', "A Siege Walker steps out from behind the scrap heaps, a Legion captain riding its back."],
          ['hero', "Long legs. Long reach. Not long enough. Keep your distance."]],
        win: [
          ['sys', "A Thousand Spears rain down. The Walker staggers, and the last spear finds its captain. No wagon comes within its reach."],
          ['sys', "Then the wind drops. Over the Crater the violet sky closes, and the Legion on the flats stands still, and blows away like dust."],
          ['sys', "Two days later Tor comes down the road with a blackened shield and sets it in front of the lead wagon."],
          ['tor', "Anything get past you?"],
          ['hero', "Nothing. Not one wagon. ...Kova, you can come out now. Dinner's cooked. I cooked it."],
          ['hero', "Reach decides everything."]] }
    },

    // ---------------------------------------------------------------- TARO
    taro: {
      1: { zone: 'village', goal: 'Hold the Village ring',
        card: "There is a ring of packed earth in the Hidden Village, and in the ring there is Taro, and nobody has moved him since he was nine.",
        intro: [
          ['sys', "The Village ring: packed earth, a circle of salt, and a huge man no one has moved since he was nine."],
          ['hero', "Nobody has pushed me out of this ring. Brakk came closest. Brakk is a mountain."],
          ['agent', "Halcyon land survey. This village is an unlicensed structure. You, the large one, step outside the circle."],
          ['hero', "Step in. Then ask me again."]],
        win: [
          ['sys', "Halcyon's survey team lies in a heap beyond the salt. Taro's feet have not moved."],
          ['hero', "Out of the ring. All of you."],
          ['hero', "And bow to the floor. It has been kind to you."]] },
      2: { zone: 'village', with: 'oda', goal: 'Bless the ring and hold it',
        card: "Every spring the monk of the Last Toll comes down the path to bless the Village ring, and this spring Halcyon comes up the other way.",
        meet: [
          ['sys', "Spring at the Village ring. Down the path comes the monk of the Last Toll with his bell, as he comes every year."],
          ['hero', "Oda. The ring is ready. Salt, earth, and me."],
          ['sys', "Oda rings the bell over the ring once. Taro bows to it. The bell answers."],
          ['hero', "...Halcyon is at the gate again. You heard them too."],
          ['sys', "Oda nods, and does not lower the bell. He holds it now like a weapon."],
          ['hero', "Then we fight. You ring. I push."]],
        win: [
          ['hero', "A blessed ring holds better. Thank you."],
          ['sys', "The bell rings softly. From Oda, that is a speech."],
          ['hero', "Same time next spring, old friend."]] },
      3: { zone: 'village', rival: 'tor', goal: 'Prove who is the true wall',
        card: "For years Tor has asked which of them is the true wall, the shield at the gate or the man in the ring, and today Taro throws the salt and answers.",
        meet: [
          ['tor', "Years I've asked, Taro. Hollis wants his truest wall at the gate when Halcyon comes. That's me."],
          ['hero', "A gate is a door. The ring is a wall. Nobody has moved me since I was nine."],
          ['tor', "Nobody has ever got past me. Same thing, from where I stand."],
          ['hero', "Not the same thing. Step in. Salt, bow, push."]],
        win: [
          ['tor', "...I'm outside the salt."],
          ['hero', "You are. And I am still in it. The ring is the wall."],
          ['tor', "But you dug in. I felt it. Your heel moved."],
          ['hero', "...One grain. Do not tell Brakk."],
          ['tor', "Then the gate's mine, the ring's yours. Two walls. The village can afford both."]],
        lose: [
          ['tor', "Arrows bounce. Wrestlers too, it turns out."]] },
      4: { zone: 'meridian', goal: 'Throw the drill out of the ring',
        card: "Taro draws a ring of salt in the sand round Halcyon's biggest drill and throws it out, and the faces that started the war turn out to be one masked liar, Rue.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. Taro walks a ring of salt into the sand around the biggest drill of all."],
          ['citizen', "They're saying a Sky girl drilled Deepline and Deepline's boy gassed the Sky. Can it be true?"],
          ['hero', "In the ring you see your opponent's face, close. Whoever hides behind another face does not fight fair."],
          ['hero', "Whoever wore those faces never stepped into a ring. This drill did. Out."]],
        win: [
          ['sys', "Taro gets both arms round a Halcyon drill, plants his feet, and throws it out of the ring."],
          ['agent', "That thing weighs forty tonnes!"],
          ['hero', "It weighed forty tonnes. Now it is outside."],
          ['sys', "Word from the Crater comes by night: both faces were one masked thing. Pell named her. Rue."]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Hold the tethers against Ryo',
        card: "A stranger in light and dark tips the Tether Fields and Aurelia groans overhead, so Taro takes hold of the rope and becomes the other end of it.",
        intro: [
          ['sys', "The sky splits with a crack the whole Surface hears, and Vael comes through. At the Tether Fields, a stranger tips the tethers."],
          ['sys', "Overhead, Aurelia lurches. Below, the Hollow Legion pours across the field. If the tethers go, the city goes with them."],
          ['hero', "A tether is a rope. A rope needs someone on the other end. I will be the other end."]],
        meet: [
          ['ryo', "Wrestler. Move. Vael says everything tips. Balance means one side must fall."],
          ['hero', "I do not know you. In the ring, we bow first. Then you may push me."],
          ['ryo', "Ryo. Light Palm. Dark Palm. There is nothing I cannot tip."],
          ['hero', "Then tip me."]],
        win: [
          ['sys', "Ryo pushes with light, with dark, with both. Taro does not move, and Ryo's balance finds nothing to lean on."],
          ['ryo', "You don't tip. I cannot find a side of you to push."],
          ['hero', "Out of the ring, stranger. The rope stays here."],
          ['sys', "Ryo steps back, and back, and is drawn up to the crown-ship. The tether in Taro's fists goes taut, and level."]],
        lose: [
          ['ryo', "Out of the ring, wrestler. Everything tips in the end."]] },
      6: { goal: 'Hold the Village ring',
        card: "With Brakk in the Crown and Tor on the rim, Taro throws a fresh circle of salt in the Village ring and waits for the Legion's last column to step inside it.",
        intro: [
          ['sys', "The Hidden Village. The Legion's last column climbs the mountain path, and half the Surface's fighters are at the Crater."],
          ['sys', "Far away the sky over the Crater is a bruise of violet and gold. In the village ring, Taro throws a fresh circle of salt."],
          ['hero', "Brakk is up there. Tor is on the rim. The ring is here, and so am I."]],
        meet: [
          ['sys', "A Siege Walker shoulders through the village gate. Its great foot comes down inside the salt."],
          ['hero', "You stepped in. Then we bow, and I push."]],
        win: [
          ['sys', "Taro gets both arms round the Walker's leg, sets his feet, and throws. Walker and captain land outside the salt."],
          ['sys', "Then the bell of the Last Toll rings once. The sky over the Crater has closed, and the Legion on the mountain is simply gone."],
          ['sys', "Next morning half the village crowds the ring to hear how the Walker was thrown. Brakk and Tor come up the path."],
          ['tor', "So. Who's the true wall?"],
          ['hero', "Ask me tomorrow. Today I hold the ring, and I need to sweep it. Everyone, out."],
          ['hero', "Bow. Then leave."]] }
    },

    // ---------------------------------------------------------------- TAREK
    tarek: {
      1: { zone: 'sinkhole', goal: 'Hold the dig against Halcyon',
        card: "For six years Tarek's chain raiders have dug the dead city for scrap and sold it to Halcyon, and tonight Halcyon stops buying.",
        intro: [
          ['sys', "The Sinkhole, on the edge of the Buried Meridian. By lantern light, chain raiders haul scrap out of the dead city."],
          ['hero', "Copper, steel, old wire. The dead don't need it. Halcyon pays. That's the trade, and I never asked for a better one."],
          ['agent', "Change of plan, Tarek. Halcyon no longer requires buyers. We're bringing drills. Clear out."],
          ['hero', "Clear out? I never go to anyone. Everyone comes to me."],
          ['agent', "Then we'll come to you. Take them."]],
        win: [
          ['hero', "Reeled in, every one. You always come to me."],
          ['citizen', "Boss, if they're bringing drills, they'll dig the whole city. And whoever's standing on it."],
          ['hero', "...Us. Yeah. I see it now."]] },
      2: { zone: 'village', with: 'garo', goal: "Hold Garo's forge",
        card: "A raider with a notched sickle climbs the mountain to the only smith who will sharpen it, and brings Halcyon up the path behind him.",
        meet: [
          ['sys', "Garo's forge at the Hidden Village. Sparks, iron, heat. A raider with a notched sickle walks up the mountain path."],
          ['garo', "Notched again. Every time. What do you cut with this, rocks?"],
          ['hero', "Chains. Halcyon's. They've stopped buying, Garo. They want the buried city, and us out of the way of it."],
          ['garo', "Then it needs an edge. Sit. ...And somebody followed you up my mountain."],
          ['hero', "Halcyon. Sorry. They come to me. Always."]],
        win: [
          ['garo', "There. Sharp again. Bring it back notched. I like to see it used."],
          ['hero', "The best smith on the Surface, keeping a raider's sickle sharp. Why?"],
          ['garo', "Because one day you'll use it on the right side."]] },
      3: { zone: 'docks', rival: 'bando', goal: 'Measure reach with Bando',
        card: "Bando of Deepline claims the longer reach, in public, and Tarek has come down to Dockside Nine with a warning nobody will hear until they have measured.",
        meet: [
          ['bando', "Tarek of the chain raiders! On my dock! You told the whole Surface you've got the longer reach!"],
          ['hero', "I did. I came down to warn Deepline, Bando. Halcyon's drills won't stop at the Surface."],
          ['bando', "Everyone hears it after we measure. In public. That's the deal. Reach decides who talks first!"],
          ['hero', "Fine. Chain against arm. You'll come to me. Everyone does."]],
        win: [
          ['bando', "...You reeled me in. My arm was longer. I'm sure my arm was longer."],
          ['hero', "Your arm was. My chain wasn't. Now listen, all of you: the drills are coming down."],
          ['bando', "Okay, okay. Deepline is listening. And we're measuring again later. Twice."]],
        lose: [
          ['bando', "Long arm of Deepline! Want to measure again, chain-man?"]] },
      4: { zone: 'meridian', goal: 'Offer Dune your chain',
        card: "Tarek, who never goes to anyone, walks into the desert unarmed and holds out his chain to Dune; by dark the drills are buried and the face-thief has a name: Rue.",
        intro: [
          ['sys', "The Ash Dunes. Halcyon's drills turn in the Buried Meridian while the layers above and below curse each other."],
          ['citizen', "Boss, they say a Sky girl drilled Deepline and a Deepline boy gassed the Sky. So whose drills are THESE?"],
          ['hero', "Halcyon's. I sold them scrap for six years. Somebody lent them two faces. The drills are all theirs."],
          ['sys', "Tarek walks into the desert with no chain on his arm and no sickle. Dune rises out of the sand to meet him."],
          ['hero', "Dune. They'll bury everyone. Here's my chain. One end each."],
          ['dune', "...One end each."]],
        win: [
          ['sys', "Sand and chain. The drill crews are reeled in, and buried to their necks."],
          ['citizen', "Boss! Word from the Crater. The two faces were one thing. Pell named it: Rue."],
          ['hero', "Rue. Whoever she is, she'll come to me in the end. Everyone does."],
          ['dune', "You did not let go of the chain. Not once."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Chain the girl made of glass',
        card: "On the Glass Sea a girl made of crystal turns the glass toward the dunes and the dead city under them, and Tarek, who never goes to anyone, goes to her.",
        intro: [
          ['sys', "The sky splits and Vael comes through. On the Glass Sea a stranger answers him, and crystal creeps toward the dunes like frost."],
          ['sys', "The Hollow Legion marches over the new glass, more soldiers than there are grains of sand, and none of them leave footprints."],
          ['hero', "If she glasses the desert, she glasses the city under it. And Dune. Not happening."]],
        meet: [
          ['opal', "A chain? Chains are iron. Iron turns to glass too. Everything does, where Vael sends me."],
          ['hero', "Maybe. But you'll have to come to me to touch it, and everyone who comes to me gets reeled in."],
          ['opal', "I don't want to touch anything. I want it all to be still. Still is safe."],
          ['hero', "Still is dead, kid. Ask anyone under this sand."]],
        win: [
          ['sys', "The chain wraps Opal three times and holds. She cannot glass what she cannot reach."],
          ['opal', "...The chain. It didn't turn to glass."],
          ['hero', "Good chain. Go home to your king, kid. Tell him nothing gets out of my reach."],
          ['sys', "Tarek lets go. Opal is drawn up into the light, back to the crown-ship, and the glass stops at the edge of the dunes."]],
        lose: [
          ['opal', "Your chain is glass now. Don't move, or it shatters, and so do you."]] },
      6: { goal: 'Hold the Sinkhole for Dune',
        card: "With Dune on the Crater rim, Tarek puts out the lanterns at the Sinkhole and holds the dead city he once robbed against the Legion's last column.",
        intro: [
          ['sys', "The Sinkhole, on the edge of the Buried Meridian. The Legion's last column marches over the dunes toward the dead city."],
          ['sys', "Over the horizon the sky above the Crater burns like a forge. Dune is on its rim. Someone must hold her end of the desert."],
          ['hero', "Lanterns out, chains up. Nobody digs this city. Not Halcyon, not a king. Not even me, any more."]],
        meet: [
          ['sys', "A Siege Walker wades through the sand to the lip of the Sinkhole. Its captain peers down at the raiders below."],
          ['hero', "Big fish. Come on down. You'll come to me. Everyone does."]],
        win: [
          ['sys', "Iron Cyclone, then the Chain Prison. Tarek reels the Walker over the lip, and it drops into the Sinkhole, captain and all."],
          ['sys', "Then the sand goes quiet. Over the Crater the sky closes, and the Legion on the dunes stands still, and is gone."],
          ['sys', "Next morning Tarek walks out into the Ash Dunes with the chain over his shoulder. For once, he goes to someone."],
          ['dune', "You came to me."],
          ['hero', "Don't get used to it. Here. Your end. And Bando wants to measure reach again."],
          ['hero', "No one escapes my reach."]] }
    },

    // ---------------------------------------------------------------- ODA (vow of silence: the bell speaks)
    oda: {
      1: { zone: 'village', goal: 'Ring the dawn bell',
        card: "For ninety-six years the bell of the Last Toll has rung at every dawn, and this morning a Halcyon survey team has climbed the mountain to silence it.",
        intro: [
          ['sys', "The Temple of the Last Toll, before dawn. Frost on the steps. For ninety-six years the bell has rung here every morning."],
          ['sys', "Oda took a vow of silence the night he and Hollis made the Pact. The bell took no vow."],
          ['agent', "Halcyon survey. That bell carries for miles. It's giving the village away. Silence it."],
          ['hero', "(Oda looks at the agent for a long moment. Then he lifts the bell.)"],
          ['hero', "DONG."]],
        win: [
          ['sys', "The survey team lies in a ring round the temple steps. The bell is still humming in Oda's hand."],
          ['hero', "(Oda bows to the fallen, and to the dawn.)"],
          ['sys', "He rings once more, harder than he needs to. Every morning since Coda was taken, he has rung a little harder."]] },
      2: { zone: 'village', with: 'hollis', goal: 'Guard the Pact with Hollis',
        card: "The Pact of the Hidden Clans hangs under the bell in Hollis's handwriting, and Halcyon has climbed the temple stairs to file it away.",
        meet: [
          ['sys', "The Pact of the Hidden Clans hangs in the temple in Hollis's handwriting, beneath the bell."],
          ['hollis', "Ninety-six years, old friend, and you still ring at me every time I read the second line aloud."],
          ['hero', "DONG."],
          ['hollis', "Yes, yes. One word. Later. Halcyon is on the temple stairs, and they want the Pact for their filing cabinets."],
          ['hero', "(Oda sets himself in front of the scroll, the bell in his hand.)"],
          ['hollis', "I'll take the left. You take everyone with ears."]],
        win: [
          ['hollis', "Still here. The Pact, the bell, and two old men too stubborn to fall down."],
          ['hero', "Dong."],
          ['hollis', "I know. The second line. Later."]] },
      3: { zone: 'noble', rival: 'pell', goal: 'Face Pell at the Noble Ring',
        card: "Oda once watched a masked man carry a small girl up into the sky; now he rides the Skylift to the Noble Ring with his bell, to find the man, and the girl.",
        meet: [
          ['sys', "The Noble Ring opera, in Aurelia. Gilt, velvet, perfume. A monk in an ochre robe has ridden the Skylift up with a bell."],
          ['pell', "The monk of the Last Toll, all this way up. Come to watch her dance? She is exquisite now. I made her so."],
          ['hero', "(Oda says nothing. He has said nothing for ninety-six years. He rings the bell once, low.)"],
          ['pell', "She no longer counts your tolls, monk. She counts my strings."],
          ['hero', "DONG."]],
        win: [
          ['pell', "A monk who only rings a bell. And yet here I lie, on the floor of my own opera."],
          ['sys', "On the opera stage the star dancer hears the bell through the walls, and misses one step on Pell's string."],
          ['pell', "...She heard that."],
          ['hero', "(Oda rings once more, softly. One toll for every step she used to count.)"]],
        lose: [
          ['pell', "Silence suits you, monk. Keep it. Stay down."]] },
      4: { zone: 'meridian', goal: 'Ring the bell three times',
        card: "For ninety-six years Oda has rung the bell once at dawn; at the Buried Meridian he rings it three times, the whole Surface turns, and behind the faces is one mask: Rue.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. The layers swallow each other's lies, and Halcyon's drills bite into the sand."],
          ['citizen', "A Sky girl drilled the tunnels, a Deepline boy gassed the Sky... Is this the end of the Pact, monk?"],
          ['hero', "(Oda shakes his head. A face is not a person. He once watched a smiling mask take a child.)"],
          ['sys', "He raises the bell. For ninety-six years he has rung it once at dawn. Today he rings it three times."],
          ['hero', "DONG. DONG. DONG."],
          ['sys', "Across the Surface, everyone who knows the Pact stops what they are doing, and turns toward the Buried Meridian."]],
        win: [
          ['sys', "One by one the drills fall silent. Only the bell is still ringing, out over the sand."],
          ['hollis', "Three times. Ninety-six years, and you never once rang it three times. I came running."],
          ['sys', "Word comes from the Crater: Pell has named the face behind the faces. Rue. Oda nods. A mask, again."],
          ['hero', "(Oda rings a fourth time, very quietly. For the fourth banner: the Hidden Clans, who live in all three layers.)"]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Ring through the gale',
        card: "A stranger tips the Tether Fields to the sound of Vael's voice, and Oda walks into the gale to ring something smaller and truer underneath it.",
        intro: [
          ['sys', "The sky splits, and for once the bell is not the loudest thing on the Surface. At the Tether Fields, a stranger tips the tethers."],
          ['sys', "Aurelia lurches overhead like a ship in a swell, and below, the Legion floods in."],
          ['hero', "(Oda walks into the gale with his bell. A roar is only a loud bell, rung badly.)"]],
        meet: [
          ['ryo', "Monk. Go back to your temple. Vael's voice is all I hear, and it is enough."],
          ['hero', "Dong."],
          ['ryo', "...What was that? It is small. It is under his voice. It is... keeping time."],
          ['hero', "DONG."]],
        win: [
          ['sys', "The Last Toll rolls out through the gale and through the Legion, and Ryo's light and dark fall out of step."],
          ['ryo', "One bell, and I cannot keep my balance. Who are you, monk?"],
          ['hero', "(Oda says nothing. He bows, and rings once more.)"],
          ['sys', "Ryo steps back into the gale and is drawn up to the crown-ship. The tethers swing level again, and hum."]],
        lose: [
          ['ryo', "A bell is no louder than a king, monk."]] },
      6: { goal: 'Guard the Pact under the bell',
        card: "Oda guards the Pact beneath the bell against the Legion's last column, and when the sky closes, it is his bell that carries the word across the Surface.",
        intro: [
          ['sys', "The Temple of the Last Toll. The Legion's last column climbs the mountain path toward the bell, step by hollow step."],
          ['sys', "Far away, the sky over the Crater burns. Hollis is there, under four banners. The Pact hangs here, beneath the bell."],
          ['hero', "(Oda sets himself in front of the scroll, as he did the day Halcyon came for it. He lifts the bell.)"]],
        meet: [
          ['sys', "A Siege Walker climbs the temple stairs with a captain on its back. The old stones crack beneath it."],
          ['hero', "DONG."]],
        win: [
          ['sys', "The Last Toll rolls out over the mountain. The Walker staggers on the stairs and falls, its captain under it."],
          ['sys', "Far away the violet sky closes. The Legion on the path goes still, and is gone. Oda rings once, slowly, for the whole Surface."],
          ['sys', "High in Aurelia, a dancer hears it, and counts it with her feet."],
          ['sys', "Next morning Hollis climbs the stairs, very tired. Over the Pact, Oda rings the bell once, and says one word."],
          ['hollis', "Together. He said together. I heard it! ...He's not saying. Of course he's not saying."],
          ['hero', "(Hear the bell? It's for you.)"]] }
    },

    // ---------------------------------------------------------------- GARO
    garo: {
      1: { zone: 'village', goal: 'Hold the forge and the gate',
        card: "Garo forged his wheel from a Halcyon drill bit the width of a door, which seemed only fair, since Halcyon keeps drilling his mountain.",
        intro: [
          ['sys', "The forge and gate of the Hidden Village. Steel comes up from Deepline by tunnels no map shows; bread goes down."],
          ['hero', "I forged this wheel from a Halcyon drill bit the width of a door. Seemed fair. They keep drilling our mountain."],
          ['agent', "Smuggling tunnel found. Seal it and take the smith. Halcyon would like to know who is on the other end."],
          ['hero', "So do I. Never seen her face. Neither will you."]],
        win: [
          ['hero', "Throw once, hit twice. And the wheel comes home to the hand that threw it."],
          ['sys', "A crate creaks up the tunnel lift: Deepline steel, and a note scratched into the lid. Still here. F."],
          ['hero', "Still here. Send the bread down. Double, this time."]] },
      2: { zone: 'shafts', with: 'ferra', goal: 'Hold the hidden tunnel with Ferra',
        card: "For ten years Garo has sent bread down a hidden tunnel and Ferra has sent steel up, and today, in the pitch dark halfway between, Halcyon finds them both.",
        meet: [
          ['sys', "Halfway down the hidden tunnel, in a dark you could cut. Halcyon has found it from both ends at once."],
          ['ferra', "Garo? It's Ferra. Don't light the lamp. I like not knowing what you look like."],
          ['hero', "Ferra. Ten years of steel coming up and bread going down, and we meet in the dark."],
          ['ferra', "Halcyon's coming from my end and yours. I brought scrap. Every piece of junk down here does what I tell it."],
          ['hero', "And I brought a wheel. One throws..."],
          ['ferra', "...one catches. I know. You put it in every note."]],
        win: [
          ['ferra', "Tunnel's clear. And I still haven't seen your face."],
          ['hero', "Keep it that way. It's not much of a face."],
          ['ferra', "That's what the Pact is for, big man. People you'd die for, and never see."]] },
      3: { zone: 'village', rival: 'tor', goal: 'Test the shield at the gate',
        card: "Every morning Garo throws and Tor catches, but this morning Garo takes down the big wheel, because he has seen Halcyon's new drill-heads.",
        meet: [
          ['tor', "Garo. One throw, one catch, like every morning, you said. So why the big wheel?"],
          ['hero', "Halcyon's new drill-heads. I've seen them. If your shield can't take my Meteor Wheel, it can't take one of those."],
          ['tor', "So it's a test."],
          ['hero', "It started as a spar. Hold the gate, Tor. Show me nothing gets past it."]],
        win: [
          ['tor', "...Still holding. Never dropped it."],
          ['hero', "Not a scratch. Either I forged it better than I knew, or you're harder than the steel."],
          ['tor', "Both. Again?"],
          ['hero', "Again. One throws."],
          ['tor', "One catches."]],
        lose: [
          ['tor', "Nothing gets past. Not even the smith who made the shield."]] },
      4: { zone: 'meridian', goal: 'Cut the drill cables',
        card: "Each drill at the Buried Meridian hangs from cables thick as an arm, and Garo's wheel goes out and comes back until none are left; that night a crate names Rue.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. Each drill hangs from steel cables thick as a man's arm, humming back to the rigs."],
          ['hero', "Ferra's note came up this morning. Drills in Deepline, and everyone down there swears Nyra of the Sky led them in."],
          ['hero', "Ferra says faces are cheap and drills are not. Ferra is usually right."],
          ['hero', "These are the same drills. Same steel. I'd know it blind. My wheel was cut from one."]],
        win: [
          ['sys', "The wheel goes out and comes back, out and back, singing. Every cable parts, and the drills sag into the sand."],
          ['hero', "The wheel comes back. The drills don't."],
          ['sys', "That night a crate comes up the lift. On the lid, in Ferra's scratch: Face-thief named. Rue. Pell said it. Still here. F."],
          ['hero', "Still here. Send the bread down. Triple."]] },
      5: { zone: 'glasssea', foe: 'opal', goal: 'Smash through the crystal',
        card: "A stranger walls the Glass Sea in crystal and turns toward the mountain, and Garo, who has spent forty years hitting things right, takes down the Meteor Wheel.",
        intro: [
          ['sys', "The sky splits and Vael comes through. On the Glass Sea, a stranger's crystal spreads across the Surface like rime on an anvil."],
          ['sys', "Behind her the Hollow Legion marches across the glass toward the mountain, without a sound."],
          ['hero', "Glass is hard. Iron is harder, if you hit it right. I've been hitting things right for forty years."]],
        meet: [
          ['opal', "Your wheel is pretty. When it turns to glass it will be prettier. Everything is, after."],
          ['hero', "It's a drill bit, girl. Halcyon's. It has gone through worse than you. Who sent you to my mountain?"],
          ['opal', "Vael. He says glass the forge and the gate and the village, and then nothing will ever break."],
          ['hero', "One throws. Nobody catches. Here it comes."]],
        win: [
          ['sys', "The Meteor Wheel shatters the Prism Prison and every Geode Wall behind it. Opal stands alone on the glass."],
          ['opal', "...Everything I made is broken. Everything."],
          ['hero', "Glass breaks. Iron comes back. Go home to your king, girl."],
          ['sys', "Opal is pulled up into the light, back to the crown-ship. The wheel comes home to Garo's hand."]],
        lose: [
          ['opal', "Iron, glass. It all looks the same, standing still."]] },
      6: { goal: 'Hold the forge and the gate',
        card: "With Tor and Ferra at the Crater, the gate of the Hidden Village has only a smith in it, and the Legion's last column is coming up the mountain and up the tunnel.",
        intro: [
          ['sys', "The forge and gate of the Hidden Village. The Legion's last column climbs the mountain, and the hidden tunnel from below."],
          ['sys', "Far off, the sky above the Crater glows like iron in the fire. Tor's shield is there. Ferra is there. The gate has only a smith."],
          ['hero', "One throws, and nobody catches today. Fine. The wheel knows its own way back."]],
        meet: [
          ['sys', "A Siege Walker stoops through the gate arch, a captain on its back. The stones it knocks loose roll past the forge."],
          ['hero', "You're scratching my gate. Tor would call that character. I call it rude."]],
        win: [
          ['sys', "A wheel the size of a house goes out and comes back. The Walker's legs go, and its captain falls at the forge door."],
          ['sys', "Then the forge fire burns yellow again. The sky over the Crater has closed, and the Legion in the tunnel goes still, and is gone."],
          ['sys', "Next morning the tunnel lift comes up. No crate. Ferra, grey with Crater dust, steps off it into the light."],
          ['ferra', "Garo? Is that you? You're huge."],
          ['hero', "Ferra. So now you've seen my face."],
          ['ferra', "It's a good face. I brought scrap. Send the bread down. Double."],
          ['hero', "The wheel always returns."]] }
    },

    // ---------------------------------------------------------------- IVO
    ivo: {
      1: { zone: 'village', goal: 'Beat the dawn, and Halcyon',
        card: "Ivo is up an hour before every dawn, so when Halcyon creeps up the mountain to gas the village in its sleep, he is already warm.",
        intro: [
          ['sys', "The Hidden Village, an hour before dawn. Frost on the stones, and golden steam rising off a boy halfway through his training."],
          ['hero', "At fourteen I climbed this mountain. Hollis said wait for the sunrise. I waited a year of them. Then he taught me."],
          ['hero', "Every dawn since, I've been up before it. Today the dawn has company."],
          ['agent', "There's a kid up here. Gas him before he wakes the village. Quietly."],
          ['hero', "Wake the village? I've been up two hours! Fist Storm!"]],
        win: [
          ['hero', "Twelve punches in two seconds. They only needed three."],
          ['sys', "The sun lifts over the mountain. Ivo bows to it, still breathing hard."],
          ['hero', "Morning. Beat you again."]] },
      2: { zone: 'village', with: 'taro', goal: 'Hold the ring with Taro',
        card: "Ivo spars with Taro in the Village ring every dawn and has never moved him an inch, and this dawn Halcyon is at the gate, which at least moves.",
        meet: [
          ['sys', "The Village ring at dawn. Ivo spars with Taro every morning. Taro has never once been moved."],
          ['hero', "Morning, Taro! Today's the day. I can feel it."],
          ['taro', "You say that every day."],
          ['hero', "And one day it'll be true! Hollis says a teacher and a wall are all I need. You're the wall!"],
          ['taro', "...Halcyon is at the gate. The wall would welcome some help."],
          ['hero', "Ha! Finally, something that moves!"]],
        win: [
          ['taro', "Fast. Very fast. And still you have not moved me."],
          ['hero', "Tomorrow. Before dawn."],
          ['taro', "I will be here."]] },
      3: { zone: 'village', rival: 'lin', goal: 'Land one on Lin',
        card: "Lin of the Sky Clan has sealed Ivo twice and calls his style loud, and now she has come to the mountain with a question only his fists can answer.",
        meet: [
          ['lin', "Ivo. The Sky Clan asks whether the Surface is ready to stand against Halcyon. Hollis sent me to you for the answer."],
          ['hero', "Me? Great! ...You've sealed me twice, though. Is this a trick?"],
          ['lin', "It is a question. Twice I sealed you. Your style is loud, and loud is not the same as ready."],
          ['hero', "Loud gets heard! One hit, Lin. That's my answer."],
          ['lin', "Every fifth strike seals. Breathe in."]],
        win: [
          ['sys', "Strike four. Ivo's fist lands, square, for the first time in his life."],
          ['lin', "...You landed one."],
          ['hero', "I LANDED ONE!"],
          ['sys', "Strike five. Lin seals him mid-shout. He goes on grinning anyway."],
          ['lin', "Three times now. But you landed one. I'll tell the Sky Clan: the Surface is ready."]],
        lose: [
          ['lin', "Breathe out, loud one. Again, when you're ready."]] },
      4: { zone: 'meridian', goal: 'Punch through a drill-head',
        card: "The biggest drill-head on the Surface meets twelve punches a second for a minute and a half, and by nightfall all the shouting about faces has an answer: Rue.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. The biggest drill-head on the Surface grinds down toward the buried city."],
          ['hero', "Everyone's yelling about faces. The Sky girl, the Deepline boy. Lin says the Sky Clan never bought it."],
          ['hero', "Hollis says when everyone is shouting, look at who is quiet. Halcyon. Quiet, and drilling."],
          ['hero', "Not quiet any more. Twelve punches a second. Let's find out how long a drill lasts."]],
        win: [
          ['sys', "Twelve punches a second for a minute and a half. The drill-head comes apart like a sandcastle in the tide."],
          ['hero', "Hah! That's a thousand and eighty! Did anybody count?"],
          ['taro', "I counted. You missed four."],
          ['sys', "By nightfall, word from the Crater: the two faces were one face-thief. Pell has named her. Rue."]] },
      5: { zone: 'dunes', foe: 'itsuki', goal: 'Face the strongest first',
        card: "The strongest fighter in any world walks out of the Ash Dunes toward the Hidden Village, and Ivo, as always, is up first: first to face him, and first to fall.",
        intro: [
          ['sys', "The sky splits before dawn and Vael comes through. In the Ash Dunes a champion walks ahead of the Legion, five elements round him."],
          ['sys', "He is walking toward the Hidden Village, and he does not hurry."],
          ['hero', "That's the way to the village. Hollis is there. Taro. Everyone. Nope. Not today."]],
        meet: [
          ['itsuki', "You're fast. I can see it from here. Fast alone is nothing."],
          ['hero', "Twelve punches in two seconds! Up before every dawn for six years! Who are you?"],
          ['itsuki', "Itsuki. Vael's champion. I learned fire, wind, thunder, earth and water on five worlds. Step aside, boy."],
          ['hero', "Seventh Breath. From every side. Let's go!"]],
        win: [
          ['sys', "Every hit Ivo lands takes time off his skills, so he never stops. Itsuki lets him hit, and hit, and hit, and watches."],
          ['itsuki', "Good. Truly good. On most worlds you would be the best I had met."],
          ['sys', "Then the wheel turns once. Ivo goes down in the sand: the first to face the strongest, and the first to fall."],
          ['hero', "...Not done... Tarn's coming. Tarn's always... faster than me."]],
        lose: [
          ['itsuki', "Get up, if you can. Most cannot."]] },
      6: { goal: 'Hold the village till dawn',
        card: "With Hollis on the Crater rim, the boy who waited a year of sunrises holds the Hidden Village through the night, and is up before the dawn, as always.",
        intro: [
          ['sys', "The Hidden Village, an hour before dawn. The Legion's last column climbs the mountain. Ivo is already up."],
          ['sys', "Far away, the sky over the Crater burns where no dawn should be. Hollis is there. The village has the boy who waited a year."],
          ['hero', "Hollis said hold the village. So I'm holding it. Before dawn, obviously."]],
        meet: [
          ['sys', "A Siege Walker crests the path with its captain on its back, just as the sun comes up behind it."],
          ['hero', "You're blocking my sunrise. Fist Storm!"]],
        win: [
          ['sys', "Twelve punches in two seconds, again and again. The Walker comes apart like wet sand, and its captain with it."],
          ['sys', "Then the sun comes up properly. Far off, the sky over the Crater has closed, and the Legion on the path stands still, and is gone."],
          ['sys', "Next morning Hollis comes home up the path. Ivo is asleep on his feet by the gate."],
          ['hero', "...Elder! I held it! I didn't sleep! I'm not asleep now!"],
          ['sys', "Hollis pats his head and walks on. The next dawn, Ivo is up an hour before it, as he always is."],
          ['hero', "Iron never rests."]] }
    },

    // ---------------------------------------------------------------- TOR
    tor: {
      1: { zone: 'village', goal: 'Let nothing past the gate',
        card: "A tall man with a round shield has stood in the gate of the Hidden Village for years, and nothing has ever got past him.",
        intro: [
          ['sys', "The gate of the Hidden Village. A tall man with a round shield stands in it, as he has stood every day for years."],
          ['hero', "Nothing has ever got past me. Nothing is about to start now."],
          ['agent', "Halcyon enforcement! Open the gate, or we open it with the drill!"],
          ['hero', "Bring the drill. It will bounce."]],
        win: [
          ['sys', "Arrows on the ground. Drill bits on the ground. Halcyon on the ground. Tor has not taken one step back."],
          ['hero', "Garo. They scratched the shield. Can you fix it?"],
          ['garo', "Scratch? That's character. Leave it."]] },
      2: { zone: 'tethers', with: 'hart', goal: 'Shield the caravan in the gale',
        card: "In the Tether Fields the gale shoves the caravan sideways between anchor stones tall as towers, and Halcyon riders come in on the wind.",
        meet: [
          ['sys', "The Tether Fields. A caravan crawls between anchor stones as tall as towers, and the gale shoves it sideways."],
          ['hart', "Tor. Riders coming in on the wind, left side. Halcyon colours."],
          ['hero', "Shield on the left, then. Spear behind it."],
          ['hart', "Like always."],
          ['hero', "Like always. Arrows bounce. Riders bounce. Wind bounces."],
          ['hart', "Wind doesn't bounce, Tor."],
          ['hero', "Watch."]],
        win: [
          ['hart', "...The wind bounced."],
          ['hero', "Nothing gets past."],
          ['sys', "Behind the last wagon, something orange and striped pads along at a distance. Hart does not notice. Tor does."],
          ['hero', "(If Hart hasn't noticed in nine years, it's not my place to spoil it.)"]] },
      3: { zone: 'skyport', rival: 'aldric', goal: 'Meet Aldric at the Skyport',
        card: "On the Surface they say there is a knight in Aurelia who holds a line as well as Tor holds a gate, and Tor has ridden the Skylift up to see for himself.",
        meet: [
          ['sys', "The Skyport of Aurelia, all brass and wind. A Surface caravan has come up the Skylift. A knight in dented plate bars the way."],
          ['aldric', "No Surface goods pass the Skyport without Halcyon's seal. Turn back."],
          ['hero', "You're Aldric. The knight who holds a line. They talk about you on the Surface. I came to see for myself."],
          ['aldric', "And I have heard of a wall on the Surface that no one has ever passed. Here we both are."],
          ['hero', "Here we both are. Neither of us moves. Let's find out."]],
        win: [
          ['sys', "Shield against greatsword. Neither gives. Then a Halcyon drone wing dives at the caravan, and both of them move."],
          ['aldric', "...You turned your shield to cover the wagons. Not yourself."],
          ['hero', "So did you, with that sword. Who is your oath to, knight?"],
          ['aldric', "To the people behind the wall. I begin to wonder whether the Director remembers that."],
          ['hero', "Come down to the Surface sometime. Two walls hold better than one."]],
        lose: [
          ['aldric', "Hold, Surface wall. You held well. Not well enough."]] },
      4: { zone: 'meridian', goal: "Hold the column's flank",
        card: "Tor holds the column's flank at the Buried Meridian; high above, Aldric holds a door at the Spire, and all of Aurelia drops one floor, and holds.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. The Surface marches in a column from forty towns. Hart has the front. Tor, the flank."],
          ['hero', "Up top they say a Deepline boy gassed their labs. Down below, that a Sky girl drilled their tunnels."],
          ['hero', "A face is a gate anyone can walk through, if nobody guards it. Someone walked through two."],
          ['hero', "Not this flank. Nothing gets past this flank."]],
        win: [
          ['sys', "Drill crews, drones, dig mechs. Each one hits the shield and stops, like rain on a roof."],
          ['hart', "Anything get past your side?"],
          ['hero', "Nothing. Up in the Sky a knight is turning his line round. I hope he holds it as well as this."],
          ['sys', "At the Spire, Aldric holds the door of Pylon Chamber Six while Kessen reroutes the pylons. Aurelia drops one floor, and holds."]] },
      5: { zone: 'tethers', foe: 'ryo', goal: 'Hold the tethers for Hollis',
        card: "A stranger tips the Tether Fields while the Legion pours over the anchor stones, and Tor sets his shield in the gap and keeps it there until Hollis comes.",
        intro: [
          ['sys', "The sky splits and Vael comes through. At the Tether Fields a stranger leans on the tethers, and the whole world leans with him."],
          ['sys', "The Hollow Legion pours over the anchor stones. Above, Aurelia tips, and the whole sky groans like a ship's hull."],
          ['hero', "Hollis is coming. Till he gets here, nothing gets past. Not the Legion. Not him."]],
        meet: [
          ['ryo', "A wall. Walls do not balance. Walls fall over."],
          ['hero', "Walls stand. It's all they do. Who are you, to tip a city over?"],
          ['ryo', "Ryo. Vael's. Light, dark, light. Push long enough and something always gives."],
          ['hero', "Not this. Push."]],
        win: [
          ['sys', "Light and dark break on the shield again and again. Tor plants his feet, and the anchor stone behind him holds."],
          ['ryo', "...You didn't move. The whole time, you didn't move."],
          ['hero', "That's the job. Nothing gets past."],
          ['sys', "Ryo steps back into the gale and is drawn up to the crown-ship. Behind Tor, the tether holds, humming."]],
        lose: [
          ['ryo', "Even walls tip, wall. Only slowly."]] },
      6: { goal: 'Hold the gap against Itsuki',
        card: "Tor and Aldric stand on the Crater rim as two walls while the six go up, and when Itsuki comes down after them, there is a shield in the gap.",
        intro: [
          ['sys', "The Crater. The Legion pours down from the crown-ship, Siege Walkers wading through the dust. The three layers hold the rim."],
          ['sys', "Six go down through it toward the Crown. Brakk walks last, and the Legion breaks on him like surf."],
          ['hero', "Brakk! Taro and I still haven't settled who's the hardest thing on the mountain."],
          ['brakk', "Settle it while I am gone. Loudly. You both like that."],
          ['aldric', "Surface wall. You said two walls hold better than one."],
          ['hero', "I did. Plant your feet, knight. Nothing gets past this rim."]],
        meet: [
          ['sys', "Down from the Crown comes one champion, walking after the six. Tor sets his shield in the gap."],
          ['itsuki', "A shield. Arrows bounce, they tell me. My fire does not."],
          ['hero', "Nothing has ever got past me."],
          ['itsuki', "Nothing has ever stood in front of me. One of us is about to learn something."],
          ['hero', "Push, then."]],
        win: [
          ['sys', "Fire, wind, thunder, earth, water. Each breaks on the shield. Tor's heels plough two furrows in the rim, and stop."],
          ['itsuki', "...You moved. Not far. I have no more time to spend on walls."],
          ['sys', "Itsuki turns back up to the Crown. Then the crown-ship falls into the Crater. The door drags back the Legion and every champion."],
          ['sys', "Itsuki goes last. Behind Tor's shield, nothing got past."],
          ['sys', "Next morning at the gate, Garo turns the shield over in his hands: black from rim to rim, and not one crack."],
          ['taro', "Your heels moved. Two furrows. I measured them."],
          ['hero', "Tell Brakk and I'll deny it. ...Leave the scratches, Garo. That's character."],
          ['hero', "I am still standing."]],
        lose: [
          ['itsuki', "Something got past, wall. Me."]] }
    }
  });
})();
