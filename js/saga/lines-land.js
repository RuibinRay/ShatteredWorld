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
        card: "Under Deepline, in Halcyon's Beast Pens, one cage was built for something bigger than a man. Fenn has spent a month learning which of its bars is weakest.",
        intro: [
          ['sys', "The Beast Pens, under Deepline. Wet straw, rust, and the sour smell of animals that have stopped expecting to be fed."],
          ['hero', "On Vharra the sky tore open over our camp. I set my storm-wolf between the tear and the tents."],
          ['hero', "The wolf held. I fell through. Woke in here, behind bars they forged for a bear."],
          ['agent', "Pen Nine is awake. Prods out. And somebody log what it has been chewing on."],
          ['hero', "Third bar from the left. Took a month. Hungry winters teach a man to be patient with iron."]],
        win: [
          ['sys', "Out of the dark lopes the storm-wolf, violet lightning on four legs, and shoves its head under his hand."],
          ['hero', "There you are. Found my track, did you. Good wolf."],
          ['hero', "Up, then. Toward the air. Halcyon can count its empty cages after."]] },
      2: { zone: 'yard', with: 'kael', goal: 'Hold the Crusher Yard with Kael',
        card: "In the Crusher Yard a scrap-kid wears the storm-eye of Vharra scratched into his jacket. Fenn has no clan left, and Halcyon's drones are already in the air.",
        meet: [
          ['kael', "Hey! Wolf man! This heap's mine. Ferra said so, and when Ferra says a thing, the scrap listens."],
          ['hero', "That mark on your jacket. The storm-eye. Who taught you to cut that, kid?"],
          ['kael', "Nobody taught me nothing. Born under the thunderheads, fell through the tear, landed in trash. So?"],
          ['hero', "Only the storm clans wear that eye. You're kin. Down here, I'm the closest thing to a clan you've got."],
          ['kael', "Great. A big brother. Did I order one of those? I'm pretty sure I didn't order one of those."],
          ['hero', "Nobody orders one. Drones, coming over the wall. Stay behind me."],
          ['kael', "Behind you? Grandpa, watch THIS!"]],
        win: [
          ['kael', "Okay. Not bad for an old wolf. You can stay. Tonight. Maybe."],
          ['hero', "I'll stay till you can put a Halcyon captain down on your own."],
          ['kael', "I literally just did that! You were standing right there!"],
          ['hero', "Then I stay until you stop shouting about it. Could take years. Find me a blanket."]] },
      3: { zone: 'glowwild', rival: 'kova', goal: 'Duel Kova for the Glowwild trail',
        card: "Something Halcyon turned loose is killing in the Glowwild. Two hunters reach its trail in the same breath, and neither of them shares.",
        meet: [
          ['sys', "The Glowwild, blue light dripping off the leaves. A torn deer on the moss, and two hunters kneeling at one print."],
          ['kova', "Back off, one-trick wolf! Mine. My forest, my print, my hunt. Grrr."],
          ['hero', "You'll go in a tiger, come out a tortoise, and something gets eaten in between. Go home, pup."],
          ['kova', "Every beast beats one wolf. Want proof? I've got four kinds of proof!"],
          ['hero', "Fine. Whoever's still on his feet takes the trail."]],
        win: [
          ['kova', "Okay! Okay. The wolf is... good. For a wolf. One wolf."],
          ['hero', "You're every beast at once and none of them all the way. Pick one, show-off. Keep it."],
          ['kova', "Or. We hunt it together. Since I'm fast. And you're... there. Very there."],
          ['hero', "Keep up, then. And we tell nobody we enjoyed this."]],
        lose: [
          ['kova', "Tiger, eagle, tortoise... and one wolf, napping in the moss. Want to borrow a beast? I have spares."]] },
      4: { zone: 'meridian', goal: 'Lead the pack into the drill camp',
        card: "Halcyon's screens say Kael gassed the Sky's labs, and while the layers argue, the drills bite down into the buried city. Fenn knows his kid's scent. This lie does not carry it.",
        intro: [
          ['sys', "The Ash Dunes at dusk. Halcyon's drills sink into the Buried Meridian, a city that went under in the war with its people inside."],
          ['citizen', "It's on every screen. A Deepline boy, Kael, opening the Sump vents on the Sky's labs. A Sky girl, Nyra, leading drills into Deepline."],
          ['citizen', "Now the Sky blames Deepline and Deepline blames the Sky, and nobody's looking at the sand but us."],
          ['hero', "Kael? That kid can't keep a secret through supper. That's not his walk. Something is wearing his face."],
          ['sys', "Down the slope Dune and Tarek, enemies for years, haul on one chain. On the mountain Oda's bell rings three times. It never has."],
          ['hero', "Three tolls. The whole Surface is coming. Up, wolf. We run at the front."]],
        win: [
          ['sys', "The storm-wolf goes through the drill camp like lightning through dry grass, and the Surface pours in behind it."],
          ['hero', "Camp's broken. Drills are quiet. Now I want whatever owns the lie."],
          ['sys', "The same night the Sky's wards rise and Aldric turns his knights around. In Deepline's Pit Arena, Pell is caught in his own strings."],
          ['sys', "Pell names his faceless spy, Rue, who wore both faces for the Director. Kiri's crane flies it to the Crater, where a second Kael runs."],
          ['hero', "Rue. I'll know that scent anywhere now. Nobody wears my kid's face and walks away clean."],
          ['sys', "Hollis paints a fourth banner. Four banners, and every pack under them, climb the Halcyon Spire toward the Engine Core, before whatever it calls can answer."]] },
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
      1: { zone: 'dig', goal: 'Fight your way up out of Shaft Nine',
        card: "Four hundred metres under the Surface, Halcyon has put a drill in Brakk's hands and told him to dig. Nobody told him which way.",
        intro: [
          ['sys', "Shaft Nine, Halcyon's deepest mine. Lamp-smoke, rock dust, and four hundred metres of stone pressing down on everyone."],
          ['agent', "Unit Forty. The big one. Drill's yours. Dig till the shift bell, then keep digging."],
          ['hero', "On Vharra I kept the Standing Stones. Children walked in my shadow. It was cool there, in summer."],
          ['hero', "The sky tore. I fell here. They gave me a drill."],
          ['agent', "Why is it pointed at the roof? The seam is DOWN, you ox! Down!"],
          ['hero', "...Up is better."]],
        win: [
          ['sys', "Four hundred metres later, a stone fist breaks into grey daylight. The hillside heaves behind it like something waking."],
          ['hero', "Grey. Not Vharra's sky. Still sky."],
          ['hero', "Now. A place to stand."]] },
      2: { zone: 'village', with: 'hollis', goal: 'Hold the mountain with Hollis',
        card: "For three days a huge man has sat on a nameless peak without moving. On the third evening the village elder comes to sit beside him, and Halcyon's diggers start up the path.",
        meet: [
          ['sys', "A mountain no map shows. A huge man sits on it like part of the rock. An old man climbs up, puffing, and sits beside him."],
          ['hollis', "Comfortable? Three days you've sat on my mountain. The goats have started treating you as furniture."],
          ['hero', "On Vharra I stood by the Stones. Here, nothing needs me to stand."],
          ['hollis', "A rock sits where it was dropped. A mountain chooses where it stands. That's the whole difference, young one."],
          ['hero', "...And the men with drills. On the path."],
          ['hollis', "Halfway up it, by the sound. So. Choose."],
          ['hero', "Here."]],
        win: [
          ['hollis', "Well chosen. The village has a gate, a forge, a ring and a bell. Now it has a mountain, too."],
          ['hero', "The round man in the ring. He looks at me. Like a bull at a fence."],
          ['hollis', "That's Taro. He wants to know which of you is harder to move. Let him find out. Slowly, for both your sakes."]] },
      3: { zone: 'village', rival: 'taro', goal: 'Duel Taro in the Village ring',
        card: "Nobody has moved Taro out of the Village ring since he was nine years old. Then a mountain walked into the village, and this morning Taro has salted the ring for it.",
        meet: [
          ['taro', "Salt for the ring. A bow for the bell. Then we learn something, mountain."],
          ['hero', "Learn what?"],
          ['taro', "Which of us the earth would rather keep. I have stood here since I was nine. No one has ever put me past the rope."],
          ['hero', "I do not want to push you. ...You will keep asking."],
          ['taro', "Every morning. Politely."]],
        win: [
          ['sys', "Taro's heel stops on the rope, one grain of salt from out. The whole village is on its feet, and nobody breathes."],
          ['taro', "I could not move you a single step. And you stopped one grain short of putting me out. Why?"],
          ['hero', "The ring is yours. I chose where to stand. Not there."],
          ['taro', "That is the most irritating thing anyone has ever said to me. Again tomorrow. I will bow first."]],
        lose: [
          ['taro', "Unmoved. Bow to the ring, mountain. Then step in again."]] },
      4: { zone: 'meridian', goal: 'Stop the drill crews at the Meridian',
        card: "Halcyon's biggest drill chews toward the city under the Ash Dunes while every screen shows the same two stolen faces. Brakk does not follow the shouting. He walks to the drill.",
        intro: [
          ['sys', "The Buried Meridian. Halcyon's biggest drill gnaws down toward a city still lying under the sand, its people with it."],
          ['agent', "The screens do our work. The Sky thinks a Deepline boy gassed its labs. Deepline thinks a Sky girl drilled its tunnels."],
          ['agent', "Kael, Nyra, who cares. Each side blames the other, and nobody watches the Surface. Drill it all."],
          ['hero', "Hollis says: in a shouting room, watch the quiet one. You are quiet. And digging."],
          ['sys', "Dune and Tarek, who have fought over this sand for years, set their feet on one chain. Oda's bell tolls three times. The Surface comes."],
          ['hero', "People under the sand. I stand on top of them."]],
        win: [
          ['sys', "Brakk lays two stone hands on the drill-head. It screams. It smokes. It stops."],
          ['agent', "It's one man! Why won't it turn? How do I even report this?"],
          ['hero', "Report a mountain."],
          ['sys', "That night Aldric turns the Proving Hall's knights around, and in Deepline's Pit Arena, Pell is caught in his own Cat's Cradle."],
          ['sys', "Pell names the thing that wore both faces for the Director: Rue, his faceless spy. Kiri's crane flies it to the Crater, and a second Kael runs."],
          ['sys', "Hollis paints a fourth banner. Four banners start up the Halcyon Spire, toward the Engine Core and whatever it keeps calling."],
          ['hero', "Up, then. I will be the step."]] },
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
        card: "Every road on the Surface starts on Jax's porch. This morning Halcyon has ridden in to turn it into a checkpoint, and they want Tarn, the post runner, as well.",
        intro: [
          ['sys', "The Long Bar at Mile Zero, last stop before the open wastes. Dust on the porch, cold water behind the counter, a piano nobody plays."],
          ['hero', "Came through the tear with a revolver, a deck of cards and my grandmother laughin' as she dealt me in. Still got all three."],
          ['agent', "Halcyon requisition. These premises are a checkpoint as of now. We'll also be collecting the runner who drinks here."],
          ['hero', "Tarn's out on the road, and this here's a bar. So. You want a drink, partner, or the other thing?"],
          ['agent', "Detain the barkeep."],
          ['hero', "Other thing it is. Ante up."]],
        win: [
          ['hero', "Five to make a point. The sixth to end the conversation."],
          ['citizen', "They'll come back with more, Jax. They always come back with more."],
          ['hero', "Then the water stays cold and the iron stays warm. Every road starts on this porch. Theirs don't."]] },
      2: { zone: 'milezero', with: 'tarn', goal: 'Hold Mile Zero with Tarn',
        card: "Tarn comes up onto the porch with nine towns of dust on him and a Halcyon patrol a mile behind. Jax pours a cold one and checks his cylinder.",
        meet: [
          ['tarn', "Water! Cold! Please! Nine towns since dawn, a checkpoint in every one, and I didn't stop for a single one."],
          ['hero', "Always cold. Sit before you fall. ...Nine towns, with Halcyon on your heels?"],
          ['tarn', "They can't keep up, that's the point. Bad news, though: they kept up as far as your porch. Sorry, Jax."],
          ['hero', "Don't be. Porch is for meetin' folks. Some get a drink. Some get shown the road."],
          ['tarn', "I'll take the left side. You take everybody else. Fair split."]],
        win: [
          ['tarn', "Captain's down. Ha! You missed one, by the way."],
          ['hero', "Didn't miss. That one was a warnin'. The sixth had the captain's name on it."],
          ['tarn', "Same time tomorrow? Keep the water cold."],
          ['hero', "Always is, runner. Mind the road."]] },
      3: { zone: 'milezero', rival: 'yara', goal: 'Duel Yara at ten paces',
        card: "Yara can drop a rider at a mile and Jax can drop one at ten paces. Before she goes back up to the Sky to settle her own debts, they settle the old bet at his distance.",
        meet: [
          ['yara', "Ten paces, Jax. Your distance, no wind to read. Win here and the bet's yours. Lose, and it's mine at every range."],
          ['hero', "And loser buys. All this arguin', and not a single drink's changed hands."],
          ['yara', "Halcyon kept me shooting at a mile for a year. I'm going back up to answer for that. I want this settled first."],
          ['hero', "Then we settle it. Ten paces. Draw on the last stroke of the bell."]],
        win: [
          ['yara', "...Ten paces is yours. A mile is still mine."],
          ['hero', "Mile's a long way off to need a friend, partner. Ten paces is where they stand."],
          ['yara', "Fine. I'm buying. Wipe that look off your face."],
          ['hero', "First round ever poured on this bet. Make it cold."]],
        lose: [
          ['yara', "Ten paces or a mile. A good shot doesn't care which. Again?"]] },
      4: { zone: 'meridian', goal: 'Clear the six drills at the Meridian',
        card: "Six Halcyon drills turn in the sand over the Buried Meridian, and every screen on the Surface plays the same two faces. Jax has six bullets and a gambler's nose for a stacked deck.",
        intro: [
          ['sys', "The Buried Meridian. Six Halcyon drills churn the sand over a city full of the dead, and the Long Bar's regulars have brought rifles."],
          ['citizen', "Screens say a Deepline boy, Kael, gassed the Sky's labs, and a Sky girl, Nyra, ran drills into Deepline. Whose side are we on, Jax?"],
          ['hero', "Two faces, one week, both doin' Halcyon's chores. Sky blames the Deep, Deep blames the Sky. That's a stacked deck."],
          ['sys', "Dune and Tarek, who'd sooner bury each other, take one chain between them. Up the mountain, Oda's bell rings three times. It never has."],
          ['hero', "We're on the side that ain't drillin'. Six drills. Six in the cylinder. I like them odds."]],
        win: [
          ['sys', "Six shots crack across the dunes. Six drill-heads grind to a stop, one after another, like a clock running down."],
          ['citizen', "Paper crane from the Crater, Jax! The Sky rose on its own lords tonight, and Deepline caught its puppet-master in his own strings!"],
          ['citizen', "Pell named the liar: Rue, a thing with no face, wearin' whatever the Director told her. A second Kael ran from the Crater."],
          ['hero', "Told you. Same dealer, both hands. Somebody tell Halcyon the bar is closed."],
          ['sys', "Under the Pact's three banners Hollis paints a fourth. Four banners start up the Halcyon Spire, toward the Engine Core."],
          ['hero', "House always wins, they say. Let's go see the house. Before that Engine gets an answer to whatever it's callin'."]] },
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
      1: { zone: 'milezero', goal: 'Fight through the Mile Zero checkpoint',
        card: "Tarn once crossed the Vharra steppe on foot in nineteen days. This morning a Halcyon checkpoint stands across the road at Mile Zero, and his bag is full of letters.",
        intro: [
          ['sys', "Mile Zero, before dawn. A runner jogs on the spot, letters buttoned inside his shirt, his breath smoking in the cold."],
          ['hero', "Vharra's steppe, end to end: forty days on a good horse. I did it in nineteen. On foot. Still annoyed it wasn't eighteen."],
          ['hero', "Then the sky tore and the tear rolled east at a walk. I stayed ahead of it nine hundred miles, yelling run at every camp. Then I turned and hit it."],
          ['agent', "Halcyon checkpoint. All post is confiscated by order of the Director. Hand over the bag, runner."],
          ['hero', "Letters don't stop at checkpoints. I'll warm up on you."]],
        win: [
          ['hero', "Every hit harder than the last. You should've stopped me at the first one."],
          ['citizen', "Is that the post? From the Crater rim? We heard the road was cut!"],
          ['hero', "Road's only cut if I stop. Next town's forty miles. Back by sundown. Sooner, if it's downhill."]] },
      2: { zone: 'saloon', with: 'fenn', goal: 'Hold the Long Bar porch with Fenn',
        card: "On the porch of the Long Bar, Tarn runs into the one man from the steppe he thought the tear had taken: Fenn. Halcyon's hounds have followed Fenn's scent right up the steps.",
        meet: [
          ['fenn', "Tarn. Crossed the whole steppe in nineteen days, and still can't sit for one drink."],
          ['hero', "Fenn! You're alive! I went camp to camp in front of the tear. I never got as far as yours."],
          ['fenn', "Wolf stood in front of it. I fell. Woke in a Halcyon cage. Chewed my way out."],
          ['hero', "That's you all over. Jax! Two waters, cold, and one's for a man who eats cages!"],
          ['fenn', "Later. Halcyon's hounds have my scent. Tracked it to this porch. Sorry."],
          ['hero', "Like the old days. You hunt, I run rings round them till they're dizzy."]],
        win: [
          ['fenn', "Still the only man who keeps pace with the wolf."],
          ['hero', "The wolf's the one thing I never outran. Don't tell it. It'll get proud."],
          ['hero', "The steppe's gone, Fenn. But a porch and a friend make a decent starting line."]] },
      3: { zone: 'milezero', rival: 'ivo', goal: 'Beat Ivo at Mile Zero',
        card: "Ivo has trained before every dawn for years to catch the fastest man on the Surface. Today Tarn has post to deliver, Halcyon on his tail, and no time for this.",
        meet: [
          ['ivo', "TARN! Before sunup, like I promised! I've done four hundred reps already! Today I catch you!"],
          ['hero', "Ivo, I've got a letter for the Crater rim and Halcyon sniffing after the post. I haven't got the time."],
          ['ivo', "Then fight me on the way! If I land one, I run the route with you. If I don't, I go back up the mountain. Deal?"],
          ['hero', "Deal. Try to stay in sight."]],
        win: [
          ['ivo', "I touched you! Did you feel that? My knuckle touched your vest! That counts!"],
          ['hero', "...Nearly. That was a nearly."],
          ['ivo', "From you, nearly is basically a win! How are you still faster? I train before EVERY dawn!"],
          ['hero', "I train at night. Don't tell anyone."],
          ['ivo', "...You WHAT?"]],
        lose: [
          ['ivo', "GOT YOU! Finally! Up you get, we're running the rest of the route together. I'll set the pace! Kidding. Mostly."]] },
      4: { zone: 'meridian', goal: 'Hold the Meridian till the towns come',
        card: "Every town on the Surface has seen the same two faces on Halcyon's screens and picked a side. Tarn has one night to tell them all they picked wrong, and one dawn to hold the drills until they come.",
        intro: [
          ['sys', "The night before the Drills. Every Halcyon screen on the Surface plays the same two films, over and over."],
          ['citizen', "Deepline's boy Kael gassed the Sky's labs! The Sky's girl Nyra drilled Deepline! Each says the other started it. Pick a side, runner!"],
          ['hero', "Same two faces, same week, both doing Halcyon a favour. Faces can be borrowed. Drills can't."],
          ['hollis', "Tarn. The drills reach the Buried Meridian at dawn. Oda will ring three times, which he never has. See that every town knows why."],
          ['hero', "Forty towns tonight, the drills at dawn. I've run worse roads, Hollis. Tie my laces for luck."],
          ['sys', "Dawn. Tarn reaches the Meridian first, beside Dune and Tarek on their one shared chain. The drills are already turning."]],
        win: [
          ['sys', "By noon the dunes are full: forty towns with picks and rifles, and the bell still rolling off the mountain. The drill line breaks."],
          ['hero', "Forty towns in one night, and every one of them came. My legs want a word with me."],
          ['sys', "That same night Aldric turns the Sky's knights around, and in Deepline's Pit Arena the masked sensei Pell is caught in his own strings."],
          ['sys', "Pell names the one who wore both faces for the Director: Rue. Kiri's paper crane flies it to the Crater. A second Kael there runs."],
          ['jax', "Water first, runner. Cold. Then carry that name up the Spire with everybody else."],
          ['sys', "Hollis paints a fourth banner under the Pact's three. Four banners climb the Halcyon Spire toward the Engine Core."],
          ['hero', "Last leg's straight up. Good. Before that Engine finishes calling whatever it's calling."]] },
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
          ['hero', "I've outrun worse than you. Then I turned round and hit it, too."]],
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
      1: { zone: 'icehouse', goal: 'Smash your way out of the Ice House',
        card: "Halcyon built the Ice House to hold anything, and brews sleeping draughts strong enough for a bear. The last bear of the north has stopped drinking them.",
        intro: [
          ['sys', "Halcyon's Ice House. Frost on the pipes, walls a yard thick, and a Subject who will not stay asleep."],
          ['agent', "Subject's awake again! Double the dose! It's a bear, it's a man, it's... why is it both?"],
          ['hero', "North Vharra. Bears that walked like men. Men that fought like bears. I am the last of either."],
          ['hero', "Thick walls. Snow was deeper. Move."]],
        win: [
          ['sys', "The Ice House wall now has a hole in it the shape of a very large, very annoyed man."],
          ['hero', "North. Nobody goes there. Nobody talks there. Good."],
          ['hero', "Send more. They learn why nobody follows twice."]] },
      2: { zone: 'icehouse', with: 'kova', goal: 'Hold the northern rim with Kova',
        card: "For thirty days a boy has followed an old bear across the northern snow, talking the whole way. Today Halcyon's catchers come up the slope behind them both.",
        meet: [
          ['sys', "The northern rim. Wind, snow, and for the thirtieth day running, a boy hopping from one of the bear's footprints to the next."],
          ['kova', "Day thirty! Teach me the bear! Tiger, got it. Eagle, got it. Tortoise, got it. Bear, NOT got it. Please please please!"],
          ['hero', "Hn. You talk more than the wind."],
          ['fenn', "He's talked since the Glowwild. Teach him, Brann. Buy the quiet back."],
          ['hero', "Catchers on the slope. Fight beside me. No words, boy. Not one. Then the bear."],
          ['kova', "Deal! I mean. (nods very, very hard)"]],
        win: [
          ['kova', "..."],
          ['hero', "Good. The bear is quiet. Until it is not. Lesson one."],
          ['fenn', "Lesson one took thirty days."],
          ['hero', "Lesson two. Longer."]] },
      3: { zone: 'icehouse', rival: 'isolde', goal: 'Duel Isolde on the northern rim',
        card: "Isolde says winter answers to her. Brann has asked her up to the northern rim to say so to his face, in his snow.",
        meet: [
          ['isolde', "You asked me north to say it to your face. Very well. Winter answers to me."],
          ['hero', "Winter answers to nobody. It listens. To me."],
          ['isolde', "Halcyon kept me a year in a vault colder than your mountain. I never minded the cold. I minded the glass."],
          ['hero', "No glass here. Snow. Say it again, bird-woman. See who the snow listens to."],
          ['isolde', "Shall I say it again? Slower, for the bear?"]],
        win: [
          ['isolde', "...Fine. Winter listens to you. Today."],
          ['hero', "Today is enough. Tea. Your bird can sit by the window."],
          ['isolde', "She is made of ice. She has no use for a window."],
          ['hero', "Everyone wants a window."]],
        lose: [
          ['isolde', "Hush now. Even bears sleep through the winter. Hood that temper and come again."]] },
      4: { zone: 'meridian', goal: 'Maul the drill crews at the Meridian',
        card: "The screens swear a boy from Deepline poisoned the Sky. Fenn swears that boy is kin. Brann believes the wolf, and brings the north down to the Buried Meridian.",
        intro: [
          ['sys', "The Buried Meridian. Halcyon's drills grind like teeth into a city of the dead. All night the runner went town to town, shouting."],
          ['kova', "Old bear! The screens! Kael, Deepline boy, gassed the Sky! Nyra, Sky girl, drilled Deepline! Now everybody hates everybody! Rawr!"],
          ['hero', "Hn. Each blames the other. Halcyon drills."],
          ['hero', "Fenn says the boy is his brother. I believe the wolf. Faces lie. Snow does not."],
          ['sys', "Dune and Tarek take one chain between them. From the mountain, Oda's bell rings three times. In ninety-six years it never has."],
          ['hero', "North does not sit still for drills. North comes south."]],
        win: [
          ['sys', "Snow falls on the Ash Dunes for the first time in a hundred years. The drill crews run from it, slipping, and do not come back."],
          ['hero', "Not winter. A bear in a bad mood."],
          ['sys', "That night Aldric turns the Sky's knights around, and in Deepline's Pit Arena the masked Pell is caught in his own strings."],
          ['kova', "Can I talk now? One faceless thing wore both faces! Rue! Pell said! Kiri's crane told the Crater and the fake Kael RAN! I KNEW it!"],
          ['hero', "No."],
          ['sys', "Hollis paints a fourth banner for the Hidden Clans. Four banners climb the Halcyon Spire toward the Engine Core, and whatever it has been calling."],
          ['hero', "Up. Quietly."]] },
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
      1: { zone: 'dunes', goal: "Drive the raiders off the Meridian",
        card: "Under the Ash Dunes lies a city that went down in the Ashfall War with its people still inside. Above it, patient as the sand, stands the one who keeps them.",
        intro: [
          ['sys', "The Ash Dunes at dusk. Wind combs the ridges flat. Underneath lies the Buried Meridian, its people still at home."],
          ['hero', "We are still here. Ninety-six years under the sand, and still here. I keep the door."],
          ['hero', "Some say I was born down there. Some say I am the sand they lie in, standing up. We correct neither."],
          ['sys', "Lanterns crest the ridge: Tarek's chain raiders, with shovels, carts and Halcyon's money."],
          ['hero', "Diggers. Again. No one carries our dead away to be weighed and sold."]],
        win: [
          ['hero', "Go home, raiders. The sand has your shovels now. It keeps what it is given."],
          ['sys', "On the far ridge a chain rattles. Tarek is watching, as he always does, from just out of reach."],
          ['hero', "Next year, chain-man. And the year after. We have waited longer than you have lived."]] },
      2: { zone: 'dunes', with: 'hollis', goal: "Hold the dunes with Hollis till dawn",
        card: "On the longest night of every year an old man walks into the desert with tea Dune never drinks. This year Halcyon's survey crews have learned to work at night.",
        meet: [
          ['sys', "Midwinter, the year's longest dark. Stars like spilled salt. An old man crunches over the dunes with a kettle and two cups."],
          ['hollis', "Evening, Dune. Brought tea. You won't drink yours, so I'll drink it for you. Same as every year."],
          ['hero', "Every year you climb down your mountain for this. Why?"],
          ['hollis', "Because it's the longest night, and nobody should sit through it alone. Not even a desert."],
          ['hero', "...We are not alone tonight. Halcyon's survey crews come in the dark now. They measure us for the drill."],
          ['hollis', "Then we'll stand up for a bit, and sit back down after. The night's long enough for both."]],
        win: [
          ['hollis', "There. Tea's gone stone cold. Worth every sip."],
          ['hero', "Hollis. If I was one of them once, the people under the sand... would you still come?"],
          ['hollis', "Every year. It was never the sand I walked out here to see."]] },
      3: { zone: 'meridian', rival: 'tarek', goal: "Duel Tarek over the buried city",
        card: "For six years Tarek has dug at the Buried Meridian and Dune has swallowed his chains. Now Halcyon is paying triple for what lies deepest, and for the first time she walks out to meet him.",
        meet: [
          ['tarek', "Dune. Six years my crew's worked this ground. How many of my chains have you swallowed? I stopped counting."],
          ['hero', "Thirty-one. You stopped counting. We did not. They lie down there with our people."],
          ['tarek', "Halcyon's paying triple for the deep levels now. One more fight and the city's open. Last one, I promise."],
          ['hero', "You never walk to anyone. You wait, and reel them in. Today we walk to you."]],
        win: [
          ['tarek', "...Thirty-two. You really do keep count."],
          ['sys', "On the horizon behind the raiders' camp, something huge with Halcyon's sun painted on its flank begins to turn."],
          ['tarek', "Triple pay. So that's why. They're done buying. They've brought drills. They'll take the whole city in one bite."],
          ['hero', "Then whoever stands on top of it goes under too. You. Your crew. Me. Buried twice."]],
        lose: [
          ['tarek', "Reeled in. Thirty-one chains, Dune, and it turns out I only ever needed the one."]] },
      4: { zone: 'meridian', goal: "Beat back the drills with Tarek",
        card: "Halcyon's drills are sinking through the Buried Meridian on their way down to Deepline, and the three layers are too busy blaming each other to stop them. Dune cannot hold the city alone.",
        intro: [
          ['sys', "The same night, in all three layers, every screen plays two films, over and over."],
          ['sys', "In one, Kael, a white-haired Deepline kid, opens the Core Sump's vents onto the Sky's labs. In the other, Nyra, the Sky's singer, leads drills into Deepline."],
          ['citizen', "The Sky says Deepline struck first. Deepline says the Sky did. And the drills from that film are HERE. Is the singer with them?"],
          ['hero', "A face is a coat. Anyone can wear it. The sand knows whose drills these are. Halcyon's, as they always were."],
          ['sys', "From the mountain, the bell of the Last Toll rings three times. In ninety-six years Oda has never rung it more than once."],
          ['sys', "A man walks out across the sand with no sickle and no chain on his arm. Tarek, holding out one end of his chain."],
          ['tarek', "They'll bury everyone, Dune. You, me, the dead, my crew. Take it. One end each."]],
        win: [
          ['sys', "Sand and chain together. The crews are reeled in, the drills sink into the dunes they came to dig, and the whole Surface stands on the ridge."],
          ['tarek', "Word from the Crater, on one of Kiri's paper cranes. Pell got caught in the Pit and gave up a name. Rue. One faceless thing, wearing both faces."],
          ['hero', "Kael and the singer never struck anyone. The Director sent a mask, and the layers fought it. We remember masks."],
          ['sys', "Hollis writes a fourth banner under the Pact's three. Four banners start up the Halcyon Spire from four sides, toward the Engine Core."],
          ['hero', "Something under that Spire is calling. The sand hums with it. Climb, before it is answered."],
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
      1: { zone: 'village', goal: "Drive Halcyon off the mountain",
        card: "The Hidden Village sits on a mountain nobody ever charted, and its elder hasn't shifted from his bench all morning. Halcyon is about to mistake that for weakness.",
        intro: [
          ['sys', "A mountain no map shows. Smoke from the forge, frost on the terraces, and an old man on a bench who has not moved since breakfast."],
          ['hero', "I remember the night after the Ashfall War. The rich went up, the poor went down, and a few stubborn families swore to live in all three."],
          ['hero', "I wrote the Pact by firelight. Oda rang the bell over it. Ninety-six years on, we still argue about the second line."],
          ['agent', "Halcyon survey, Section Four. This mountain appears on no map, which makes it company property. Remove the elderly occupant."],
          ['hero', "Standing still gathers Stillness, son. And I've been sitting on this bench a very long time."]],
        win: [
          ['hero', "There. Now the mountain's on somebody's map. Mine. It has a little drawing of you lot rolling down it."],
          ['sys', "Down the path, Oda's bell rings once: his way of saying well done."],
          ['hero', "Don't gloat, you old bell. You'd have rung it either way."]] },
      2: { zone: 'village', with: 'ivo', goal: "Hold the Village gate with Ivo",
        card: "For a year a boy has waited at the village gate, because an old man told him to. The old man has run out of excuses, and Halcyon is on the path.",
        meet: [
          ['sys', "Dawn at the Hidden Village. A boy of fourteen sits by the gate with frost on his knees, as he has every dawn for a year."],
          ['ivo', "Three hundred and sixty-five! A whole year of sunrises, Elder! You said wait for the sunrise. I waited!"],
          ['hero', "So you did. Most leave after a week. Brakk sat on my mountain three days, and I thought that was patience."],
          ['brakk', "It was long."],
          ['ivo', "Teach me. Please. I'll do the reps. All of them. Twice."],
          ['hero', "Lesson one, then. Halcyon's coming up the path. Start before they're ready, and don't stop till it's done."]],
        win: [
          ['ivo', "Was that it? The lesson? I just hit them really, really fast."],
          ['hero', "The year was the lesson. This was the test. You passed both, young one."],
          ['brakk', "He will be up before every dawn now."],
          ['hero', "Good. So will I. Somebody has to keep an eye on him, and you snore."]] },
      3: { zone: 'village', rival: 'oda', goal: "Duel Oda at the Last Toll",
        card: "For ninety-six years two old men have argued over one line of the Pact, one with words and one with a bell. Halcyon is taking children again, and today the argument comes to fists.",
        meet: [
          ['sys', "The Temple of the Last Toll. Two old men, one bell, and an argument over one line, ninety-six years long."],
          ['hero', "The second line says the Clans keep the layers from killing each other. Between them, Oda. It says nothing about joining a war."],
          ['sys', "Oda rings the bell. Once. Hard enough to shake dust from the rafters."],
          ['hero', "I know what Halcyon does. I know they take children for their tanks. ...I know about Coda, old friend. Your little dancer."],
          ['sys', "The bell rings again, quieter. Then Oda sets it down on the step, and lifts his fists."],
          ['hero', "Ninety-six years of arguing with a bell. Fine. Fists, then. Whoever's standing reads the line."]],
        win: [
          ['hero', "Ha. Still got it. ...So have you. My jaw's ringing louder than your bell."],
          ['sys', "Oda sits in the temple doorway, smiling, and waits. Of the two of them, he was always the better at waiting."],
          ['hero', "All right. We go down the mountain. We stand with them, not only between them. You win the line. I win the fight."],
          ['sys', "The bell rings once, very softly. It sounds a great deal like laughter."]],
        lose: [
          ['sys', "The bell tolls over Hollis, flat on his back on the temple floor. It sounds exactly like I told you so."]] },
      4: { zone: 'meridian', goal: "Beat back the drills at the Meridian",
        card: "Every screen in the three layers says the other side struck first. Halcyon's drills are grinding down through the Buried Meridian, and for once the Surface will not stand between: it will stand together.",
        intro: [
          ['sys', "The Buried Meridian, under a sky of drill smoke. Halcyon's rigs are boring through the dead city on their way down to Deepline."],
          ['hero', "The Sky's films show Kael, Deepline's white-haired kid, opening the Core Sump's vents on their labs. Deepline's show Nyra, the Sky's singer, leading drills in."],
          ['hero', "So each side blames the other, and nobody asks whose drills they are. When everyone shouts, watch who stays quiet. Halcyon is very quiet."],
          ['sys', "On the mountain, Oda's bell rings three times. In ninety-six years he has never rung it more than once."],
          ['hero', "Three. ...Oh, old friend. Everyone! To the drills! Dune and Tarek have the chain. The rest of you have me."]],
        win: [
          ['sys', "The last rig topples into the sand. In the Sky the wards have risen; in the Pit, the Lantern Cell has caught Pell in his own strings."],
          ['sys', "Pell names the face-thief: Rue, his faceless spy, wearing Kael and Nyra on the Director's orders. Kiri's paper crane flies the name to the Crater."],
          ['hero', "So the layers were never at war. Somebody needed them to be. Bring me the Pact, and a brush. And something to lean on."],
          ['sys', "Under the Pact's three banners Hollis writes a fourth: the Hidden Clans, who live in all of them. By dawn four banners climb the Halcyon Spire."],
          ['hero', "The Engine Core's at the top, and the man who sold us the masks. Whatever that Engine's calling, I'd like it switched off before anything answers."],
          ['hero', "Up we go, everyone. Mind your knees. It's a long way, and I'm not carrying anybody."]] },
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
      1: { zone: 'glowwild', goal: "Weed the collectors out of the garden",
        card: "The Glowwild glows because Halcyon poisoned it. Ume has grown a garden in it, lovely and lethal in equal measure, and Halcyon wants every leaf of it in jars.",
        intro: [
          ['sys', "The Glowwild: a forest lit violet and green by the waste Halcyon pours into it. At its heart, the loveliest garden on the Surface."],
          ['hero', "If the forest had to be poison, it was going to be beautiful poison. That was my first rule."],
          ['hero', "My second rule is simpler. Touch none of it. Not the bluebells, not the moonmoss, and especially not the nice pink ones."],
          ['agent', "Collection Team Six. Halcyon owns whatever grows on Halcyon's runoff. We're taking samples. All of them."],
          ['hero', "Oh, help yourselves! Start with the pretty ones."]],
        win: [
          ['hero', "Spore Puff, Vine Snap, and a Corpse Flower for dessert. They went straight for the pink ones. They always do."],
          ['sys', "Bees drift in over the flowers, thin and starving, humming like a fever. Ume holds out a palm of nectar."],
          ['hero', "There, little ones. Eat. Nobody else would let you near. My garden will."]] },
      2: { zone: 'glowwild', with: 'elixa', goal: "Guard the spore beds with Elixa",
        card: "Elixa, Halcyon's chief alchemist, comes down the Skylift for spores, for a cure that might wake the Husks. Ume always asks what for. The collectors who followed Elixa down are not asked anything.",
        meet: [
          ['elixa', "Ume. Spores again, please. For the cure. I think I can wake a Husk, one of the grey ones the Engine leaves behind."],
          ['hero', "I always ask what for. ...Wake one? Elixa, sweetheart, you mixed the serums that made them."],
          ['elixa', "I did. That is the what-for. Also, a variable I failed to control: Halcyon followed me down. Collectors, by the poison oaks."],
          ['hero', "Then take two jars. They want everything bottled. You throw flasks, I grow trouble. A garden needs both."]],
        win: [
          ['elixa', "Red, blue, green, and your spores on top. Fascinating rash. I'm writing it down. They'll be scratching for a month."],
          ['hero', "Two months. I did put up a sign about the oaks. It's very small. It's under the oaks."],
          ['elixa', "Same time next month? If the cure works, I'll bring you a Husk's first word."],
          ['hero', "Bring me that, and you can have my Corpse Flower. Well. A cutting. Handled from a distance."]] },
      3: { zone: 'glowwild', rival: 'thorne', goal: "Duel Thorne in the Glowwild",
        card: "Every spring Thorne, who keeps a garden of bones in the catacombs under Deepline, sends cuttings with a polite note. This spring he comes himself, carrying shears, because Ume's roots are dripping on his dead.",
        meet: [
          ['thorne', "Good evening, Ume. Cuttings, as every spring. And shears, this time. Do forgive me. I did knock."],
          ['hero', "Thorne! Shears, in my garden? That's either very brave or very rude, and you've never once been rude."],
          ['thorne', "Your roots have broken through my catacomb ceiling, and something drips from them onto my dead. I have come to prune."],
          ['hero', "That's Halcyon's runoff, not my roots. And nobody prunes my garden but me. Nobody."],
          ['thorne', "Then let us settle it as gardeners do. Whatever is still standing at the end of the season, grows."]],
        win: [
          ['thorne', "Achoo. ...Your pollen. You have won, my dear, and I shall be sneezing for a week."],
          ['hero', "Two weeks. I bred it stronger, just for you. Now, the dripping: we follow it back to Halcyon's dump pipe. Together."],
          ['thorne', "A joint pruning. How perfectly delightful. Achoo. Do bring the shears."]],
        lose: [
          ['thorne', "Cut back hard, a garden grows stronger. You will see, come spring."]] },
      4: { zone: 'meridian', goal: "Overrun the drill camp at the Meridian",
        card: "The three layers are at each other's throats over two films, and Halcyon's drill camp on the Meridian is pumping its waste straight into the Glowwild. Ume decides to send it back.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. Halcyon's camp squats on the Glowwild's edge, its pipes coughing black sludge into the roots."],
          ['hero', "Up top, the films show a Deepline boy, Kael, opening vents on the Sky's labs. Down below, they show the Sky's singer, Nyra, drilling the tunnels."],
          ['hero', "So each side blames the other. Pretty stories. Poisonous. Someone grafted the wrong face onto the wrong stem, and I know a graft when I see one."],
          ['sys', "From the mountain the bell of the Last Toll rings three times. All across the Surface, people put down their tools and come."],
          ['hero', "Oda's never rung three. Well then. Halcyon's been feeding my forest for years. Time it fed them back."]],
        win: [
          ['sys', "The whole Glowwild blooms at once over the camp: spores like snow, vines like cables, flowers taller than the rigs."],
          ['agent', "Don't touch anything! Nobody touch ANYTHING!"],
          ['hero', "Good advice. A season late."],
          ['sys', "By nightfall, word from the Crater: caught in the Pit, Pell named the face-thief. Rue, his faceless spy, wearing both faces for the Director."],
          ['hero', "A graft, like I said. Now Hollis has painted a fourth banner, and everyone's climbing the Halcyon Spire for the Engine Core at the top."],
          ['hero', "I'm bringing seeds. Whatever that Engine's been calling down, it can meet my nastiest perennial first."]] },
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
        card: "A tiger raised him in the mornings, an eagle by noon, a tortoise by night. Now Halcyon has come into the Glowwild with nets, and Kova can't decide which to be first.",
        intro: [
          ['sys', "The Glowwild at dawn, blue light leaking from the leaves. A Halcyon party is stringing snares between the trees."],
          ['hero', "Tiger raised me mornings. Eagle, noons. Tortoise, nights. Never learned to be just one. Why would you?"],
          ['agent', "There. The feral. The Beast Pens want him intact. Net him, and mind the teeth."],
          ['hero', "Net me? Which me? Rrrrr. Tiger first!"]],
        win: [
          ['hero', "Tiger for the morning. Eagle for noon. And now they're running, so... tortoise. Nap time."],
          ['sys', "Past the forest's edge a caravan creaks along the road. Kova watches it go, then slips after it through the ferns."],
          ['hero', "Spear guy never looks behind him. Never! Somebody has to."]] },
      2: { zone: 'glowwild', with: 'hart', goal: 'Guard the caravan road with Hart',
        card: "For nine years a caravan guard has left meat out for whatever follows his wagons through the Glowwild. Tonight Halcyon raiders wait round the bend, and the thing in the trees walks out.",
        meet: [
          ['sys', "The caravan road through the Glowwild. Every night Hart leaves meat by the wheel ruts. Every morning it is gone."],
          ['hero', "Hi! The meat. Thanks. Nine years of thanks. Also! Halcyon raiders. Round the bend. Lots."],
          ['hart', "...You're what follows the caravans."],
          ['hero', "You thought I was a beast? I mean. Sometimes. Tiger, mostly. Bit of eagle."],
          ['hart', "Nine years, and nothing's surprised me. Fine. Keep your distance. I'll keep it for you."],
          ['hero', "Brann taught me the bear. I can be quiet now! ...Mostly. Here they come!"]],
        win: [
          ['hart', "You fight like four different people at once."],
          ['hero', "Three beasts and me! Plus some bear. Bear's new."],
          ['hart', "I'll keep leaving the meat out, then."],
          ['hero', "Could you cook it? Just once? Raw is a tiger thing. I'm not always tiger."]] },
      3: { zone: 'glowwild', rival: 'fenn', goal: 'Beat Fenn for the Glowwild trail',
        card: "Something Halcyon turned loose is killing in the Glowwild. Kova finds its trail, and finds Fenn and his storm-wolf there first.",
        meet: [
          ['sys', "Gutted deer under the blue leaves. Kova finds the print, and a wolf-man already crouched over it."],
          ['fenn', "Go home, pup. One wolf is plenty for this."],
          ['hero', "One wolf. One trick! I've got tiger, eagle, tortoise and a bit of bear. Who finds it first, hm? Hm?"],
          ['fenn', "Whoever's still standing."],
          ['hero', "Ha! Then let's see who's standing. Every beast against the one-trick wolf! Rawr!"]],
        win: [
          ['fenn', "...Fine. You hit like a tiger. You move like an eagle."],
          ['hero', "And take hits like a tortoise! Say it. Say I'm not a show-off."],
          ['fenn', "You're a show-off. And you won. We hunt it together."],
          ['hero', "Like always! And we both pretend we hate it. Grr. See? Hating it."]],
        lose: [
          ['fenn', "One wolf, pup. Pick a beast and keep it."]] },
      4: { zone: 'meridian', goal: 'Lead the beasts against the drills',
        card: "Poison from the drill camp is leaking into the forest, and the beasts are furious. Meanwhile somebody is going around wearing other people's faces, and Kova thinks that's his trick.",
        intro: [
          ['sys', "The Ash Dunes. Halcyon's drills sink into the Buried Meridian, and their waste runs downhill into the Glowwild. The beasts can taste it."],
          ['hero', "Screens everywhere! Kael, Deepline boy, gassing the Sky. Nyra, Sky girl, drilling Deepline. Sky blames Deep, Deep blames Sky. Bleh."],
          ['hero', "Changing faces? That's MY trick! Except I don't use it to lie. And the beasts smell Halcyon all over those two."],
          ['sys', "Dune and Tarek take one chain between them. From the mountain Oda's bell rings three times, and the whole Surface starts walking."],
          ['hero', "Tigers! Eagles! Tortoises! Everybody! Follow me! AROOO!"]],
        win: [
          ['sys', "The Glowwild's beasts boil out of the trees with Kova at their head. The drill camp scatters like quail."],
          ['hart', "That's... the thing that follows my caravans. All of it. All at once."],
          ['hero', "Told you I wasn't just one thing!"],
          ['sys', "The same night the Sky's wards rise behind Aldric's turned knights, and Deepline's Pit Arena traps Pell, its masked sensei, in his own strings."],
          ['sys', "Pell names the face-thief: Rue, who wore Kael and Nyra for the Director. Kiri's paper crane flies it to the Crater, and a second Kael runs."],
          ['hero', "Rue. Hmph. Shape-shifting to tell lies. Gives the rest of us a bad name."],
          ['sys', "Hollis paints a fourth banner. Four banners climb the Halcyon Spire for the Engine Core, before whatever it's calling can answer."]] },
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
        card: "Hart has guarded caravans across the Rust Flats for nine years on a single rule about distance. Halcyon's toll riders are across the road, and nobody has told them the rule.",
        intro: [
          ['sys', "The Rust Flats: red dust, the caravan road from Mile Zero to the Crater rim, and a young man with a very long spear."],
          ['hero', "I have one rule. Keep your distance. If you won't, I'll keep it for you."],
          ['citizen', "Hart! Halcyon toll riders across the road. They say the wagons pay or the wagons burn. Mine's the one with the chickens!"],
          ['hero', "Nine years on this road and nothing's surprised me yet. Get behind me. Stay out of reach. Mind the chickens."]],
        win: [
          ['hero', "They stepped into reach. The spear did the rest. It usually does."],
          ['citizen', "Something behind the scrap heaps watched all that. Big. Orange. Stripes."],
          ['hero', "I know. I leave meat out for it. Never asked what it is. That's its business. Roll on."]] },
      2: { zone: 'glasssea', with: 'tor', goal: 'Hold the Glass Sea crossing with Tor',
        card: "Something moves under the crystal of the Glass Sea, and Halcyon riders are herding it at the caravan. Tor plants the shield. Hart sets the spear behind it.",
        meet: [
          ['sys', "The Glass Sea crossing. The caravan halts. Under the crystal, something long is moving."],
          ['tor', "Crawlers ahead. Riders behind them. Herding."],
          ['hero', "Shield in front. Spear behind it. Same as every crossing."],
          ['tor', "Arrows bounce. Crawlers bounce. Everything bounces."],
          ['hero', "And whatever doesn't bounce stays three metres from the wagons."]],
        win: [
          ['tor', "Nothing got past. Nothing will."],
          ['hero', "We quit arguing over who does the work years ago, didn't we?"],
          ['tor', "You quit. It's the shield."],
          ['hero', "...And the thing that follows us through the Glowwild is on that dune again. Licking its paws. Watching."]] },
      3: { zone: 'scrapton', rival: 'yara', goal: 'Duel Yara on the Rust Flats',
        card: "Yara is ahead on their bet and says reach belongs to the bow. Out on the open Rust Flats, with no caravan to hide behind, Hart means to show her what a spear does about that.",
        meet: [
          ['yara', "That rider on the ridge was most of a mile off. He was down before your spear finished turning. I'm ahead on the bet, Hart."],
          ['hero', "A bow reaches further. A bow has never stopped a charge."],
          ['yara', "Then charge me. Open flats, light wind from the west, no wagon to hide behind. Reach decides."],
          ['hero', "Agreed. I'll start walking. You start counting the distance."]],
        win: [
          ['yara', "I couldn't get far enough back. Every step I took, the spear was already there."],
          ['hero', "Then the bet's square. Took long enough."],
          ['yara', "Square up close. At a mile I'm still ahead."],
          ['hero', "At a mile, nobody's charging."]],
        lose: [
          ['yara', "Reach decides, spear-boy. Mine is a mile, and the wind's on my side today."]] },
      4: { zone: 'meridian', goal: "Hold the column's front at the drills",
        card: "Forty towns are on the march for the drills, strung out in one long column, and Hart is at the point. Everyone behind him has seen the two faces on Halcyon's screens.",
        intro: [
          ['sys', "The Ash Dunes. Forty towns march on the Buried Meridian in one column. Hart walks at its head, with Tor on the flank."],
          ['citizen', "Is it true, Hart? Deepline's Kael gassed the Sky, the Sky's Nyra drilled Deepline? Each side says the other hit first."],
          ['hero', "At a distance a face can be anyone's. Up close you see the seams. Somebody wants all of us standing far apart."],
          ['sys', "Ahead, Dune and Tarek hold one chain between them. Behind, Oda's bell rings three times. In ninety-six years it never has."],
          ['hero', "Stories at a distance. Drills at the end of the spear. Column, close up behind me."]],
        win: [
          ['sys', "The column's front never bends. Not one drill crew gets inside the spear."],
          ['tor', "Flank held."],
          ['hero', "Front held. Nothing got past either of us. You can say it was the shield."],
          ['sys', "That night the Sky's wards rise and Aldric turns his knights around. In Deepline's Pit Arena, Pell is caught in his own strings."],
          ['sys', "Pell names the seams: Rue, his faceless spy, who wore Kael and Nyra on the Director's orders. Kiri's crane flies it to the Crater, and a second Kael runs."],
          ['sys', "Hollis paints a fourth banner. Four banners climb the Halcyon Spire toward the Engine Core, before whatever it calls can answer."],
          ['hero', "A tower. Long way up, no room to swing. I'll manage."]] },
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
      1: { zone: 'village', goal: "Throw the surveyors out of the ring",
        card: "In the Hidden Village there is a ring of packed earth, and in the ring there is Taro. Nobody has ever moved him out of it, and Halcyon has come to try.",
        intro: [
          ['sys', "The Village ring: packed earth, a circle of salt, a straw rope, and a very large man no one has moved since he was nine."],
          ['hero', "Nobody has pushed me out of this ring. Brakk came closest. Brakk is a mountain."],
          ['agent', "Halcyon land survey. This village is an unlicensed structure. You. The large one. Step outside the circle."],
          ['hero', "Step in first. Then ask me again."]],
        win: [
          ['sys', "The survey team lies in a heap beyond the salt. Taro's feet have not moved."],
          ['hero', "Out of the ring. All of you."],
          ['hero', "Now bow to the floor. It was gentle with you."]] },
      2: { zone: 'village', with: 'oda', goal: "Hold the ring with Oda",
        card: "Every spring Oda the bell-monk comes down the path to bless the Village ring. This spring Halcyon comes up the other way.",
        meet: [
          ['sys', "Spring in the village. Down the temple path comes Oda, the silent monk of the Last Toll, his bell in both hands, as every year."],
          ['hero', "Oda. The ring is ready. Fresh salt, swept earth, and me."],
          ['sys', "Oda rings the bell once over the ring. Taro bows to it. The bell hums back."],
          ['hero', "...Halcyon is on the lower path. You heard their boots too."],
          ['sys', "Oda nods, and does not lower the bell. He holds it now the way Taro holds a stance."],
          ['hero', "Then the blessing waits. You ring. I push."]],
        win: [
          ['hero', "A blessed ring holds better. Thank you, Oda."],
          ['sys', "The bell rings once, softly. From Oda, that is a whole speech."],
          ['hero', "Same time next spring. I will have the salt ready."]] },
      3: { zone: 'village', rival: 'tor', goal: "Push Tor out of the ring",
        card: "For years Tor, the shield at the village gate, has asked which of them is the true wall. Halcyon is coming, Hollis wants the strongest of them guarding the village, and today Taro throws the salt.",
        meet: [
          ['tor', "Taro. Halcyon's coming. Hollis wants his truest wall at the gate. Me."],
          ['hero', "A gate is a door. A ring is a wall. Nobody has moved me since I was nine."],
          ['tor', "Nobody has got past me. Ever. Same thing."],
          ['hero', "Not the same thing. Step in. Salt. Bow. Push."]],
        win: [
          ['tor', "...Outside the salt."],
          ['hero', "You are. And I am still in it. The ring holds."],
          ['tor', "You dug in. Felt it. Your heel moved."],
          ['hero', "...One grain. Do not tell Brakk."],
          ['tor', "Gate's mine. Ring's yours. Two walls. Village can afford both."]],
        lose: [
          ['tor', "Arrows bounce. Wrestlers too."]] },
      4: { zone: 'meridian', goal: "Hold the salt ring against the drills",
        card: "Halcyon's drills are sinking through the Buried Meridian on their way down to Deepline, and the layers are too busy blaming each other to notice. Taro means to draw a ring around the worst of them.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. Three tolls of Oda's bell have brought the whole Surface to the sand. Taro walks salt round the biggest rig."],
          ['citizen', "The films say the Sky's singer, Nyra, drilled Deepline, and Deepline's Kael gassed the Sky. Each side blames the other. Is any of it true?"],
          ['hero', "In the ring you see your opponent's face, close. A face on a screen is not an opponent."],
          ['hero', "Whoever wore those faces has never stepped into a ring. This drill has. Bow, drill."]],
        win: [
          ['sys', "Taro gets both arms round the rig, plants his feet, and throws it out of the salt. Out on the dunes, Dune and Tarek drag the rest under on one chain."],
          ['agent', "That rig weighs forty tonnes!"],
          ['hero', "Forty tonnes, inside the ring. Now it is outside."],
          ['sys', "Word comes by night: Pell, caught in the Pit, has named the thing that wore both faces. Rue, his faceless spy, on the Director's orders."],
          ['sys', "Hollis writes a fourth banner. Four banners climb the Halcyon Spire toward the Engine Core, before whatever it calls can answer."],
          ['hero', "A man who sends masks to fight for him has never been in a ring. We will go up and draw one around him."]] },
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
      1: { zone: 'sinkhole', goal: "Hold the Sinkhole against Halcyon",
        card: "For six years Tarek's chain raiders have dug the dead city for scrap and sold it to Halcyon. Tonight Halcyon stops buying.",
        intro: [
          ['sys', "The Sinkhole, on the edge of the Buried Meridian. By lantern light, chain raiders winch scrap out of the dead city."],
          ['hero', "Copper, steel, old wire. The dead don't need it, Halcyon pays for it. Fair trade. Never asked for a better one."],
          ['agent', "Change of procurement, Tarek. Halcyon no longer requires suppliers. The drills arrive this week. Vacate the site."],
          ['hero', "Vacate? I don't go anywhere, friend. You always come to me."],
          ['agent', "Noted. Then we come to you. Retire them."]],
        win: [
          ['hero', "Reeled in, the lot of you. Tell your bosses the price just went up."],
          ['citizen', "Boss... if they've got drills, they dig the whole city. And whoever's standing on top of it."],
          ['hero', "...That's us. Yeah. I see it now. Douse the lanterns."]] },
      2: { zone: 'village', with: 'garo', goal: "Hold the forge path with Garo",
        card: "A raider with a notched sickle climbs the mountain to the only smith who will sharpen it, and brings Halcyon up the path behind him.",
        meet: [
          ['sys', "Garo's forge at the Hidden Village: sparks, hot iron, a hammer that never seems to stop. A raider climbs the path, his sickle chipped like an old tooth."],
          ['garo', "Notched again. Every time. What do you cut with this, rocks?"],
          ['hero', "Halcyon's chains. They've stopped buying, Garo. They want the buried city, and my crew out of the way."],
          ['garo', "Then it needs an edge. Sit. ...And you brought company up my mountain."],
          ['hero', "Halcyon. Sorry. They've got a habit of following me. I'll pay for the damage. In scrap."]],
        win: [
          ['garo', "There. Sharp. Bring it back notched. I like to see it used."],
          ['hero', "Best smith on the Surface, sharpening a raider's sickle for nothing. What's your angle?"],
          ['garo', "One day you'll use it on the right side."]] },
      3: { zone: 'docks', rival: 'bando', goal: "Beat Bando at Dockside Nine",
        card: "Bando of Dockside Nine claims the longer reach, in public. Tarek has come down into Deepline with a warning about the drills, and nobody on the docks will listen until they have measured.",
        meet: [
          ['bando', "Tarek of the chain raiders! On MY dock! You told the whole Surface you've got the longer reach!"],
          ['hero', "I did. That's not why I'm here, dockhand. Halcyon's drills won't stop at the Surface. They're coming down."],
          ['bando', "Everyone hears it after we measure, buddy. That's the deal. I once reached across a whole festival field for little Sora's kite, you know!"],
          ['hero', "I know. Everybody knows. Fine. Chain against arm. Loser shuts up and listens."]],
        win: [
          ['bando', "...You reeled me in. My arm was longer. I'm sure my arm was longer. Six arm's lengths, easy."],
          ['hero', "Your arm was. My chain wasn't. Now listen, all of you: Halcyon's drills are coming down through your ceiling."],
          ['bando', "Okay, okay. Deepline's listening. And we're measuring again later. Twice."]],
        lose: [
          ['bando', "Reeled in by an arm! Want to measure again, chain-man? Bring a longer chain."]] },
      4: { zone: 'meridian', goal: "Beat back the drills with Dune",
        card: "The layers are tearing at each other over two films, and Halcyon's drills are turning in the Buried Meridian. Tarek sold Halcyon scrap for six years. He knows whose drills they are.",
        intro: [
          ['sys', "The Ash Dunes. Halcyon's drills turn in the dead city, boring down toward Deepline, while the layers above and below curse each other."],
          ['citizen', "Boss, the Sky says Deepline's Kael gassed its labs. Deepline says the Sky's singer, Nyra, drilled its tunnels. So whose drills are THESE?"],
          ['hero', "Halcyon's. Six years I sold them scrap. I know their bolts. Somebody lent them two faces. The drills are all theirs."],
          ['sys', "Up on the mountain the old bell tolls three times, as it never has in ninety-six years. Tarek unbuckles his sickle and drops it in the sand."],
          ['sys', "He walks out into the desert with nothing in his hands but the chain. Dune rises out of the sand to meet him."],
          ['hero', "Dune. They'll bury everyone. You, me, the dead, my crew. Here. One end each."],
          ['dune', "...One end each. Do not let go."]],
        win: [
          ['sys', "Sand and chain. The crews are reeled in and buried to their necks, and the whole Surface pours over the ridge behind them."],
          ['citizen', "Boss! Word from the Crater, on a paper crane. Pell got caught in the Pit and named the faker: Rue. Wore both faces, for the Director."],
          ['hero', "Rue. Never trusted a deal where I couldn't see the other face. Turns out nobody could."],
          ['sys', "Hollis paints a fourth banner under the Pact's three. Four banners start up the Halcyon Spire from four sides, toward the Engine Core."],
          ['dune', "You did not let go of the chain. Not once."],
          ['hero', "Don't make it a thing. Come on. Long climb, and whatever that Engine's been whistling for, I'd rather not shake its hand."]] },
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
      1: { zone: 'village', goal: "Drive the surveyors off the temple",
        card: "For ninety-six years Oda's temple bell has rung at every dawn. This morning a Halcyon survey team has climbed the mountain to silence it.",
        intro: [
          ['sys', "The Temple of the Last Toll, before dawn. Frost on the steps, and a bell that has not missed a morning in living memory."],
          ['sys', "Oda took a vow of silence the night he and Hollis made the Pact. The bell took no vow."],
          ['agent', "Halcyon survey. That bell carries eleven miles and gives the settlement away. Confiscate the bell. Remove the monk."],
          ['hero', "(Oda looks at the agent for a long moment. Then he lifts the bell in both hands.)"],
          ['hero', "DONG."]],
        win: [
          ['sys', "The survey team lies in a ring round the temple steps. The bell hums on in Oda's hands."],
          ['hero', "(Oda bows to the fallen, then to the sunrise, exactly as deep.)"],
          ['sys', "He rings once more, harder than he needs to. Every morning since a little girl called Coda was taken, he has rung a little harder."]] },
      2: { zone: 'village', with: 'hollis', goal: "Guard the Pact with Hollis",
        card: "The Pact of the Hidden Clans hangs beneath the bell in Hollis's handwriting. Halcyon has climbed the temple stairs to take it away and file it.",
        meet: [
          ['sys', "The Pact hangs in the temple under the bell, its ink browned by ninety-six years of candle smoke."],
          ['hollis', "Ninety-six years, old friend, and you still ring at me every time I read the second line aloud."],
          ['hero', "(A single, pointed toll.)"],
          ['hollis', "Yes, yes. Later. Halcyon is on the temple stairs, and they want the Pact for one of their filing cabinets."],
          ['hero', "(Oda sets himself in front of the scroll, the bell hanging from his fist like a stone in a sling.)"],
          ['hollis', "I'll take the left. You take everyone with ears."]],
        win: [
          ['hollis', "Still here. One scroll, one bell, and two old men too stubborn to fall over."],
          ['hero', "(Oda taps the bell with one knuckle. Tink.)"],
          ['hollis', "I know, I know. The second line. Later."]] },
      3: { zone: 'noble', rival: 'pell', goal: "Duel Pell at the Noble Ring",
        card: "Oda once watched a masked man carry a small girl up into the sky. Now he rides the Skylift to the Noble Ring with his bell, to find the man, and the girl.",
        meet: [
          ['sys', "The Noble Ring opera, in Aurelia. Gilt, velvet, perfume. A monk in an ochre robe has ridden the Skylift up with a bell."],
          ['pell', "The bell-monk from the mountain, all this way up! Come to watch her dance? She is exquisite now. I made her so. Do take a seat."],
          ['hero', "(Oda does not sit. He rings the bell once, low, and every chandelier in the house shivers.)"],
          ['pell', "She no longer counts your tolls, monk. She counts my strings. One, two, three, and turn."],
          ['hero', "(Oda plants his feet on the velvet carpet, and raises the bell.)"]],
        win: [
          ['pell', "A monk who only rings a bell. And yet here I lie, on the carpet of my own opera. How unscripted."],
          ['sys', "On the stage, Coda, the opera's star, hears the bell through the walls, and misses one step on Pell's string."],
          ['pell', "...She heard that."],
          ['hero', "(Oda rings once more, softly. One toll for every step she used to count.)"]],
        lose: [
          ['pell', "Silence suits you, monk. Keep it, and stay down. I shall take the bow for both of us."]] },
      4: { zone: 'meridian', goal: "Beat back the drills at the Meridian",
        card: "Two films have set the three layers at each other's throats, and Halcyon's drills are biting down through the Buried Meridian. Oda's bell has rung once every dawn since the Pact. Only ever once.",
        intro: [
          ['sys', "The Buried Meridian. Every screen in the three layers plays two films, each layer blames the other, and Halcyon's drills bite into the sand."],
          ['citizen', "Monk! The Sky says Deepline's Kael gassed its labs. Deepline says the Sky's Nyra drilled its tunnels. Is this the end of the Pact?"],
          ['hero', "(Oda shakes his head. A face is not a person. He once watched a smiling mask carry off a child.)"],
          ['sys', "He raises the bell. Once at every dawn, always once, since before most of the Surface was born. Today he rings it three times."],
          ['hero', "DONG. DONG. DONG."],
          ['sys', "Across the Surface, everyone who knows the Pact puts down what they hold and turns toward the Meridian. Dune and Tarek already share one chain."]],
        win: [
          ['sys', "One by one the drills fall silent. Only the bell is still ringing, far out over the sand."],
          ['hollis', "Three times. Ninety-six years, and never once three. I came running. At my age. Running."],
          ['sys', "Word from the Crater on a paper crane: caught in the Pit, Pell has named the face-thief. Rue, his faceless spy, wearing Kael and Nyra for the Director."],
          ['hero', "(Oda nods slowly. A mask, again. The same hand behind it, again.)"],
          ['sys', "Hollis writes a fourth banner under the Pact's three. Four banners start up the Halcyon Spire from four sides, toward the Engine Core."],
          ['hero', "(Oda strikes the bell a fourth time, barely a hum, for the fourth banner. Then he begins to climb.)"]] },
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
      1: { zone: 'village', goal: "Hold the forge and the gate",
        card: "Garo's throwing wheel was once a Halcyon drill bit. Only fair: Halcyon keeps drilling his mountain, and today it has found his tunnel.",
        intro: [
          ['sys', "The forge and gate of the Hidden Village. Deepline steel comes up by tunnels no map shows. Bread goes down."],
          ['hero', "Made this wheel from one of Halcyon's drill bits. Width of a door. Seemed fair. They keep drilling our mountain."],
          ['agent', "Smuggling tunnel located. Seal it, detain the smith. Halcyon would like to know who is on the other end."],
          ['hero', "So would I. Never seen her face. Neither will you."]],
        win: [
          ['hero', "Throw once, hit twice. And it comes home to the hand that threw it."],
          ['sys', "A crate creaks up the tunnel lift: Deepline steel, and a note scratched into the lid. Still here. F."],
          ['hero', "Still here. Send the bread down. Double, this time."]] },
      2: { zone: 'shafts', with: 'ferra', goal: "Hold the hidden tunnel with Ferra",
        card: "For ten years Garo has sent bread down a hidden tunnel and Ferra of the Crusher Yard has sent steel up. Today, in the pitch dark halfway between, Halcyon finds them both.",
        meet: [
          ['sys', "Halfway down the hidden tunnel, in a dark you could cut and sell. Halcyon has found it from both ends at once."],
          ['ferra', "Garo? It's Ferra. Don't light the lamp. I like not knowing what you look like."],
          ['hero', "Ferra. Ten years of steel up and bread down, and we meet in the dark. Figures."],
          ['ferra', "Halcyon's coming from my end and yours. I brought scrap. Every bit of junk down here does what I tell it."],
          ['hero', "I brought the wheel. One throws..."],
          ['ferra', "...one catches. I know. You scratch it on every crate."]],
        win: [
          ['ferra', "Tunnel's clear. And I still haven't seen your face. Good."],
          ['hero', "Keep it that way. It's not much of a face."],
          ['ferra', "That's the Pact, big man. Folk worth saving, that you never have to look at."]] },
      3: { zone: 'village', rival: 'tor', goal: "Duel Tor at the village gate",
        card: "Every morning Garo throws and Tor, the shield of the gate, catches. This morning Garo takes down the big wheel, because he has seen what Halcyon is fitting to its new drills.",
        meet: [
          ['tor', "Garo. One throw, one catch. Every morning. Why the big wheel?"],
          ['hero', "Halcyon's new drill-heads. Seen them. If your shield can't take my Meteor Wheel, it can't take one of those."],
          ['tor', "A test."],
          ['hero', "Started as a spar. Hold the gate, Tor. Show me nothing gets through."]],
        win: [
          ['tor', "...Holding. Never dropped it."],
          ['hero', "Not a scratch. Either I forged it better than I knew, or you're harder than the steel."],
          ['tor', "Both."],
          ['hero', "Good. Then the gate's ready. The drills aren't."],
          ['tor', "Again?"]],
        lose: [
          ['tor', "Nothing gets past. Not even the smith."]] },
      4: { zone: 'meridian', goal: "Cut the drills loose at the Meridian",
        card: "Each drill sunk into the Buried Meridian hangs from steel cables thick as an arm. Above and below, the layers blame each other for everything. Garo knows exactly whose steel this is.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. Each rig hangs from humming cables thick as a man's arm. On the mountain, the bell has rung three times."],
          ['hero', "Ferra's note came up this morning. Deepline's screens show Nyra, the Sky's singer, leading drills into their tunnels."],
          ['hero', "The Sky's screens show a Deepline kid, Kael, venting the Core Sump on their labs. So each side blames the other."],
          ['hero', "Ferra says faces are cheap and drills aren't. Same drills. Same steel. I'd know it blind. My wheel was cut from one."]],
        win: [
          ['sys', "The wheel goes out and comes back, out and back, singing. Every cable parts. The rigs sag, and Dune and Tarek's chain drags them under."],
          ['hero', "Wheel comes back. Drills don't."],
          ['sys', "That night a crate comes up the lift. On the lid, in Ferra's scratch: Pell caught. Face-thief named. Rue. Wore both. Director's job. Still here. F."],
          ['sys', "Under the Pact's three banners Hollis writes a fourth. By morning four banners climb the Halcyon Spire, toward the Engine Core."],
          ['hero', "Triple bread tonight. Then I'm going up that Spire to see what an Engine's made of. Everything breaks, hit right."]] },
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
      1: { zone: 'village', goal: 'Fight off the dawn raid on the village',
        card: "Ivo is up an hour before every dawn. So when Halcyon creeps up the mountain to gas the Hidden Village in its sleep, one boy is already warm, sweating, and delighted to see them.",
        intro: [
          ['sys', "The Hidden Village, an hour before dawn. Frost on the stones, and steam rising off a boy halfway through his morning reps."],
          ['hero', "Four hundred and ninety-eight! Four hundred and ninety-nine! FIVE HUNDRED! Hah! Morning, mountain!"],
          ['hero', "I climbed up here at fourteen. Hollis said wait for the sunrise. I waited a whole year of them. Worth it!"],
          ['agent', "Kid's awake. Gas him before he rouses the village. Quietly."],
          ['hero', "Quietly? I've been up two hours! You're late! Fist Storm!"]],
        win: [
          ['hero', "Twelve punches in two seconds! They only needed three! The other nine were free!"],
          ['sys', "The sun lifts over the peak. Ivo bows to it, still breathing hard, grinning."],
          ['hero', "Beat you again, sun!"]] },
      2: { zone: 'village', with: 'taro', goal: 'Hold the ring with Taro',
        card: "Ivo spars with Taro in the Village ring every dawn and has never once moved him. This dawn Halcyon's raiders are at the gate, and they, unlike Taro, move.",
        meet: [
          ['sys', "The Village ring at dawn. Salt on the earth, the rope pegged down. Taro stands in the middle, as he has since he was nine."],
          ['hero', "Morning, Taro! Today's the day! I can feel it in my knees!"],
          ['taro', "You say this every morning."],
          ['hero', "And one morning it'll be true! Hollis says a teacher and a wall are all I need. You're the wall!"],
          ['taro', "...Halcyon is at the gate. The wall would be grateful for some help."],
          ['hero', "YES! Something that actually moves when I hit it!"]],
        win: [
          ['taro', "Fast. Very fast. And still, you have not moved me."],
          ['hero', "Tomorrow! Before dawn! I'll bring breakfast!"],
          ['taro', "I will be here. Bring rice."]] },
      3: { zone: 'village', rival: 'lin', goal: 'Duel Lin. Land one hit.',
        card: "Lin of the Sky Clan has sealed Ivo twice and calls his style loud. Now she has climbed the mountain with a question for the Surface, and Hollis says Ivo's fists are the answer.",
        meet: [
          ['lin', "Ivo. The Sky Clan asks whether the Surface will stand against Halcyon. Hollis says you are the answer."],
          ['hero', "Me? Great! ...Wait. You've sealed me twice. Is this a trick?"],
          ['lin', "A question. Twice I sealed you. You are loud. Loud is not ready."],
          ['hero', "Loud gets heard! One hit, Lin. That's my answer. One clean hit."],
          ['lin', "Every fifth strike seals. Breathe in."]],
        win: [
          ['sys', "Strike four. Ivo's fist lands, square, for the first time in his life."],
          ['lin', "...You landed one."],
          ['hero', "I LANDED ONE! Did everyone see? TARO, DID YOU SEE?"],
          ['sys', "Strike five. Lin seals him mid-shout. He goes stiff as a fence post, still grinning."],
          ['lin', "Three seals now. And one hit. I will tell the Sky Clan the Surface is ready. Noisily, it seems."]],
        lose: [
          ['lin', "Breathe out, loud one. Slower. Again, when your breath is ready."]] },
      4: { zone: 'meridian', goal: 'Break the drill line at the Meridian',
        card: "Halcyon's drills are grinding down on the buried city, and every town is shouting about two faces on a screen. Ivo has trained his whole life for something this big to hit.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. A line of Halcyon drill-heads grinds down toward the city under the sand."],
          ['hero', "Everyone's yelling about the screens! Kael, the Deepline kid, gassing the Sky's labs! Nyra, the Sky singer, drilling Deepline!"],
          ['taro', "The Sky blames Deepline. Deepline blames the Sky. The Elder says: when everyone shouts, watch who is silent."],
          ['hero', "Halcyon! Silent! And drilling! Lin said the Sky Clan never believed it, and Lin is never wrong. Annoyingly."],
          ['sys', "Dune and Tarek hold one chain between them. Then Oda's bell rings three times. It has not rung three in ninety-six years."],
          ['hero', "THREE! The whole Surface is coming! I'm not waiting for them. Twelve punches a second. How long does a drill last?"]],
        win: [
          ['sys', "A minute and a half of Fist Storm. The first drill-head comes apart like a sandcastle in the tide. Then the next."],
          ['hero', "That's a thousand and eighty! Did anybody count? Somebody count!"],
          ['taro', "I counted. You missed four."],
          ['sys', "That night Aldric turns the Sky's knights around, and in Deepline's Pit Arena the masked Pell is caught in his own strings."],
          ['sys', "Pell names the face-thief: Rue, his faceless spy, wearing faces for the Director. Kiri's crane flies it to the Crater, and a second Kael runs."],
          ['sys', "Hollis paints a fourth banner. Four banners climb the Halcyon Spire toward the Engine Core, before whatever it's calling answers."],
          ['hero', "A tower full of stairs! Best training day of my LIFE! Elder, wait, I'm coming!"]] },
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
      1: { zone: 'village', goal: "Let nothing past the gate",
        card: "For years one man and one round shield have filled the Hidden Village's gate. Today Halcyon has brought a drill to empty it.",
        intro: [
          ['sys', "The gate of the Hidden Village. A tall man with a round shield stands in it, as he has stood every day for years."],
          ['hero', "Nothing gets past. Nothing has. Nothing will."],
          ['agent', "Halcyon enforcement! Open the gate, or we open it with the drill!"],
          ['hero', "Bring the drill."]],
        win: [
          ['sys', "Arrows on the ground. Drill bits on the ground. Halcyon on the ground. Tor has not taken one step back."],
          ['hero', "Garo. Scratched."],
          ['garo', "Give it here. I'll beat it out by supper."],
          ['hero', "Leave it. Character."]] },
      2: { zone: 'tethers', with: 'hart', goal: "Shield the caravan with Hart",
        card: "In the Tether Fields, under the ropes that hold a city in the sky, the gale shoves Hart's caravan sideways between anchor stones tall as towers. Halcyon riders come in on the wind.",
        meet: [
          ['sys', "The Tether Fields. Ropes thick as houses run up into the cloud, and the gale shoves the caravan sideways."],
          ['hart', "Tor. Riders, left side, four hundred paces and closing. Halcyon colours. Keep the wagons in line."],
          ['hero', "Shield left. Spear behind."],
          ['hart', "Standard."],
          ['hero', "Arrows bounce. Riders bounce. Wind bounces."],
          ['hart', "Wind doesn't bounce, Tor. That's not a rule. That's weather."],
          ['hero', "Watch."]],
        win: [
          ['hart', "...The wind bounced. I'm noting that as an exception."],
          ['hero', "Told you."],
          ['sys', "Behind the last wagon, something orange and striped pads along at a distance. Hart does not notice. Tor does."],
          ['hero', "(Nine years he hasn't noticed. Not my place.)"]] },
      3: { zone: 'skyport', rival: 'aldric', goal: "Duel Aldric at the Skyport",
        card: "On the Surface they say a knight in Aurelia holds a line as well as Tor holds a gate. Tor has ridden the Skylift up with a caravan to see for himself.",
        meet: [
          ['sys', "The Skyport of Aurelia, all brass and wind. A Surface caravan has come up the Skylift. A knight in dented plate bars the way."],
          ['aldric', "No Surface goods pass the Skyport without Halcyon's seal. Turn back, and I will not hold it against you."],
          ['hero', "Aldric. The knight who holds a line."],
          ['aldric', "I am. And you are the wall on the Surface that no one has ever passed. I have heard of you, shield-bearer."],
          ['hero', "Then we find out."]],
        win: [
          ['sys', "Shield against greatsword. Neither gives. Then a Halcyon drone wing dives on the caravan, and both of them move at once."],
          ['aldric', "...You turned your shield to cover the wagons. Not yourself."],
          ['hero', "You too. Who's your oath to, knight?"],
          ['aldric', "To the people behind the wall. Always. I begin to wonder whether the Director remembers that."],
          ['hero', "Come down to the Surface. Two walls hold better than one."]],
        lose: [
          ['aldric', "Hold, Surface wall. You held well. It was not quite enough today."]] },
      4: { zone: 'meridian', goal: "Hold the column's flank at the Meridian",
        card: "Three tolls of Oda's bell have brought forty towns to the Buried Meridian, where Halcyon's drills are boring down toward Deepline. Hart takes the front of the column. Tor takes the flank.",
        intro: [
          ['sys', "The Drills at the Buried Meridian. Oda rang three times, and the Surface came: forty towns in one column. Hart has the front. Tor, the flank."],
          ['sys', "Above and below, every screen plays two films: Kael of Deepline gassing the Sky's labs, Nyra of the Sky drilling Deepline. Each side blames the other."],
          ['hart', "Up top they want Deepline's blood. Down below, the Sky's. And these drills go straight through us to get there."],
          ['hero', "Faces are a gate. Nobody guarded it."],
          ['hero', "This flank, somebody guards."]],
        win: [
          ['sys', "Drill crews, drones, dig mechs. Each hits the shield and stops, like rain on a roof. Ahead, Dune and Tarek drag the rigs under on one chain."],
          ['hart', "Anything get past your side?"],
          ['hero', "No."],
          ['sys', "In the Sky, Aldric has turned his knights around. In the Pit, Pell is caught, and names the face-thief: Rue, his faceless spy, sent by the Director."],
          ['hero', "One mask. Two faces. Whole war."],
          ['sys', "Hollis writes a fourth banner. Four banners climb the Halcyon Spire toward the Engine Core, before whatever it calls can answer. Tor's shield goes first."],
          ['hero', "Knight's on the far side. Good. Now I watch him hold."]] },
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
