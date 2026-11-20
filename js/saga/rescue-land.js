'use strict';
// Shattered Worlds - The Hollow Crown: the rescue scenes for the heroes of the Surface.
// Data only; js/saga/saga-rescue.js plays them. Speakers: 'hero' (the hero being played: any of the 48), 'sys'
// (narration), the rescued hero's id, the champion's id, 'vael'. {hero} in a line is the played hero's name.
(function () {
  const SG = window.SW && window.SW.saga; if (!SG) return;
  SG.rescueText = SG.rescueText || {};
  Object.assign(SG.rescueText, {

    // ---------------------------------------------------------------- FENN (called, the Ash Dunes)
    fenn: {
      title: "The Hunt Called Home",
      place: "The Ash Dunes. Fenn runs the Legion's hunt, his storm-wolf violet to the bone.",
      intro: [
        ['sys', "The Ash Dunes. Grey-violet soldiers stand on every ridge like fence posts, and the wind has stopped moving the sand."],
        ['sys', "Down the slope runs the storm-wolf, ahead of the Legion as it once ran ahead of the clans. It does not know you."],
        ['sys', "Behind it walks Fenn, an empty crown of violet light over his hood. He is whistling a steppe hunting call."]],
      meet: [
        ['fenn', "{hero}. Hear that? The horn at the edge of the camp. They're calling the hunters in."],
        ['fenn', "The tents are standing. The fires are lit. My mother's singing them up, the way she did when the snow came early."],
        ['vael', "Hunter. Your clan waits on the far side of the dark, every one of them, at the fire. Run the last hunt, and come home."],
        ['fenn', "One more hunt. Then home. Stand still, {hero}. I'll make it quick. I always did."]],
      lose: [
        ['fenn', "Down, and staying down. The wolf could have told you. It never had to run anything twice."]],
      win: [
        ['sys', "The crown splits like a dry branch. The storm-wolf stops mid-stride, shakes itself, and comes back blue."],
        ['fenn', "...There was no horn. There's been no horn since the sky came down on the camp. I knew it, and I ran anyway."],
        ['fenn', "That's the worst of it. He didn't have to drag me. He only had to whistle."],
        ['fenn', "Up, wolf. We know where the whistle came from now. To the Crater. We hunt it home."]],
      tie: {
        kael: [
          ['hero', "Wolf-man! You looked at me like I was a rabbit. Don't ever do that again."],
          ['fenn', "Kid. I heard the whole camp in that call, and you weren't in it. That should have told me it was a lie."]],
        kova: [
          ['hero', "One wolf, and you couldn't even keep that one! It went purple! I'm telling everybody."],
          ['fenn', "Tell them you beat me. That's the part you'll enjoy. ...Thanks, kid. Don't tell them that."]],
        tarn: [
          ['hero', "I never reached your camp on the steppe, Fenn. I wasn't going to miss it twice."],
          ['fenn', "You ran nine hundred miles past every horn there was. Teach me that trick, runner."]]
      }
    },

    // ---------------------------------------------------------------- BRAKK (champion Opal, the Glass Sea)
    brakk: {
      title: "The Shoulder of the Mountain",
      place: "The Glass Sea. Brakk holds the shore while Opal glasses the desert, unafraid.",
      intro: [
        ['sys', "The Glass Sea. Crystal climbs out of it in spires and spreads over the sand, pink and mint and blue, a mile an hour."],
        ['sys', "At its edge Brakk stands in a wall of bedrock, glass to the elbows, shoving the spires back one by one."],
        ['brakk', "{hero}. Do not touch the glass. It does not let go."],
        ['sys', "The Legion walks across the crystal toward him without a sound, and never slips."]],
      meet: [
        ['opal', "Brakk. You look so tired. You have been tired since the day you carried me out of here."],
        ['brakk', "Opal. You are making glass again. Come down."],
        ['opal', "I'm not afraid any more. He took the fear away, and look how much I grow. Nothing breaks when nothing is soft."],
        ['opal', "Vael has given me the desert, and after it the mountain. Stand aside, or stand still forever. Both are pretty."]],
      lose: [
        ['opal', "Crystal to the knee. Don't cry. I used to cry. It never helped."]],
      win: [
        ['sys', "Opal's spires shatter in a ring of falling light. She steps back across the glass toward the Crater, unhurt."],
        ['opal', "You never let me fall, Brakk. Now I don't need catching. The Crown is high, and nothing up there needs carrying."],
        ['brakk', "...She sat here. On this shoulder. It is lighter now. I do not like it."],
        ['brakk', "A mountain chooses where it stands. I choose the Crater, under the Crown. If anything falls, it falls on me."]],
      tie: {
        hollis: [
          ['hero', "Glass to the elbows, young one. Your knees will hate you in the morning."],
          ['brakk', "You told me to choose where I stand. Between the glass and the mountain was easy. She was not."]],
        taro: [
          ['hero', "Glass in your hair, mountain, and you still have not moved."],
          ['brakk', "Nor will I. Bow to the glass for me, Taro. She rode on this shoulder once."]]
      }
    },

    // ---------------------------------------------------------------- JAX (called, the Long Bar)
    jax: {
      title: "The House Always Wins",
      place: "The Long Bar. Jax deals for the Legion, and the stakes are everyone at Mile Zero.",
      intro: [
        ['sys', "The Long Bar at Mile Zero. Every table is full of grey-violet soldiers who do not drink. The water jug sweats, cold."],
        ['sys', "At the card table sits Jax under an empty crown of violet light, dealing hand after hand to nobody."],
        ['sys', "Every road on the Surface starts on this porch. Tonight the Legion is marching up all of them."]],
      meet: [
        ['jax', "{hero}. Sit. Gran's dealing tonight. Hear her laughing? She always laughed when she dealt you in."],
        ['vael', "Gambler. Every hand you ever lost, I will deal again, and every one will win. Sit at my table. The house is very large."],
        ['jax', "Six in the wheel and a full deck. House rules: you lose, you stay. Ante up."]],
      lose: [
        ['jax', "Five to make a point. You didn't need the sixth. Shuffle up, Gran. Pull another chair."]],
      win: [
        ['sys', "The sixth shot goes into the ceiling. The crown over Jax cracks like a dropped glass, and the room goes still."],
        ['jax', "Gran laughed when you caught her cheating. That voice dealt me a winner every hand. No Gran ever born did that."],
        ['jax', "Stacked deck. Should've smelled it. I've played cards."],
        ['jax', "Somebody hang a sign on the door. Closed. Gone to the Crater. Water's still cold."]],
      tie: {
        dyna: [
          ['hero', "Cowboy! A purple crown, and no sense of timing whatsoever."],
          ['jax', "Then you walked in at the right second, fuse. Don't tell anyone. Least of all me."]],
        tarn: [
          ['hero', "Water. Cold. ...You weren't pouring it, Jax. You were pouring for them."],
          ['jax', "Always cold, runner. Pour your own tonight. I owe you a few."]],
        yara: [
          ['hero', "Ten paces. Your distance. And you never once reached for the gun."],
          ['jax', "Bet's yours, then, at every range. I'm buying. Don't look so pleased."]],
        zara: [
          ['hero', "You dealt off the top all night, Jax. Honest cards. That's how I knew it wasn't you."],
          ['jax', "And you came back to a table you walked out on. Sit, sweetheart. Nobody walks out tonight."]]
      }
    },

    // ---------------------------------------------------------------- TARN (walker, Mile Zero)
    tarn: {
      title: "Mile Zero",
      place: "Mile Zero. The post road starts here, and Tarn will not let the Legion use it.",
      intro: [
        ['sys', "Mile Zero, where every road on the Surface starts. The Legion is marching up all of them at once, grey-violet and silent."],
        ['sys', "On the first milestone stands Tarn, jogging on the spot, a mailbag across his chest and a ring of soldiers round his feet."],
        ['tarn', "{hero}! Good timing. I've hit this lot forty times each, every hit harder. They still won't read the signs."],
        ['tarn', "Road's closed. Post only. Take the left."]],
      mid: [
        ['sys', "The ground thumps. Down the post road strides a Siege Walker, legs like towers, captain high, and the milestones crack."],
        ['tarn', "Oh, now that's cheating. Fine. It's got long legs. Let's see if it's got stamina."]],
      win: [
        ['sys', "The Walker goes down across the road like a felled tree. Its captain lands at the foot of the first milestone, and stays."],
        ['tarn', "Every hit harder than the last. That thing took about four hundred. It should have stopped me at the first."],
        ['tarn', "My bag's full of letters nobody can deliver while that ship hangs over the Crater. The Crater rim's on my route."],
        ['tarn', "Always was. Meet you there. I'll be early."]],
      tie: {
        fenn: [
          ['hero', "Still running rings round them, runner. I'd have hunted that thing, but you were having fun."],
          ['tarn', "The wolf came for me. Don't tell it I'm glad."]],
        gale: [
          ['hero', "Race thirteen came early. You had to fight a tower to win it."],
          ['tarn', "Didn't see you use your legs once, flyboy. Still cheating. Glad you came."]],
        ivo: [
          ['hero', "I caught up! I actually caught up with you! ...You were standing still."],
          ['tarn', "I was fighting a building, Ivo. Fine. You caught me. Don't tell anyone."]],
        jax: [
          ['hero', "Brought the water out to the road, runner. Cold. Figured you'd be thirsty about now."],
          ['tarn', "Always am. Same time tomorrow, Jax. If there's a tomorrow, it starts on your porch."]]
      }
    },

    // ---------------------------------------------------------------- BRANN (called, the Ice House)
    brann: {
      title: "The Long-House Under Snow",
      place: "The Ice House. Brann keeps the winter for Vael, and lost children call his name.",
      intro: [
        ['sys', "The Ice House on the northern rim. The hole Brann once walked through has frozen shut with violet ice."],
        ['sys', "Inside, the Legion stands in rows under the frost, still as cordwood. In the middle sits Brann, an empty crown overhead."],
        ['sys', "He is humming. He has not hummed since Vharra."]],
      meet: [
        ['brann', "Quiet. You will wake them. Listen. The long-house, under the snow. The children are shouting my name. My short name."],
        ['vael', "Last of the bears. The snow beyond the dark is deep, the hearth is lit, and every voice you lost is under one roof."],
        ['brann', "Go home, {hero}. Or stay and sleep. Nobody hurts me twice. I will see to it you do not try once."]],
      lose: [
        ['brann', "Sleep, then. The snow keeps quiet. It always did."]],
      win: [
        ['sys', "The crown cracks like river ice in spring. Brann sits back on his heels, frost melting in his beard."],
        ['brann', "There was no long-house. It burned the winter the sky tore. I knew that. I heard the children anyway. I wanted to."],
        ['brann', "That is a soft place in a bear. He found it with one breath."],
        ['brann', "Good. Now I know where he is. The north does not sit. The north comes south, to the Crater."]],
      tie: {
        isolde: [
          ['hero', "You were humming. Out of tune, and to nobody. Winter does not listen to that."],
          ['brann', "No. It listened to you. Today. Stay for tea. The bird can sit by the window."]],
        kova: [
          ['hero', "Not one word the whole fight! That's my rule! ...You okay, old bear?"],
          ['brann', "Lesson three, boy. The bear gets up. Then it says nothing about why it fell."]]
      }
    },

    // ---------------------------------------------------------------- DUNE (legion, the Buried Meridian)
    dune: {
      title: "Buried Twice",
      place: "The Buried Meridian. The Legion marches over the dead city, and Dune pulls it under.",
      intro: [
        ['sys', "The Buried Meridian. The Legion marches across the dunes over the dead city, and the sand will not take its footprints."],
        ['sys', "Dune stands in the middle of the march, veil torn, sand rising round her arms in ropes. Wherever a soldier steps, she opens."],
        ['dune', "{hero}. They are like my people. Emptied, and never buried. Help me bury them."]],
      mid: [
        ['dune', "They do not breathe. The sand cannot tell them from the dead. It takes them gently, as it took mine."]],
      win: [
        ['sys', "The last soldier sinks without a sound. The dunes close over the march and lie smooth, as if nobody ever came."],
        ['dune', "Nine worlds he has emptied. He keeps their dead standing, and calls it an army. That is not keeping."],
        ['hero', "Then what is?"],
        ['dune', "Sand over them, and someone who remembers. I will go to the Crater. I will remember all of them."]],
      tie: {
        hollis: [
          ['hero', "It's not the longest night, but I brought tea anyway. You won't drink yours."],
          ['dune', "No. Drink it for me, as usual. Then walk with me to the Crater. The night there will be long."]],
        tarek: [
          ['hero', "Brought my chain. One end each, like before."],
          ['dune', "Thirty-two of your chains lie under my sand, and now you bring the one I wanted. Hold your end. I still do not like you."]]
      }
    },

    // ---------------------------------------------------------------- HOLLIS (legion, the Hidden Village)
    hollis: {
      title: "The Mountain No Map Shows",
      place: "The Hidden Village. The Legion climbs the mountain no map shows. Hollis stands still.",
      intro: [
        ['sys', "The Hidden Village. For ninety-six years no map has shown this mountain. The Legion climbs it anyway, by every path at once."],
        ['sys', "On the village steps stands Hollis, both feet planted. Small rocks hang round his open palm like patient moons."],
        ['hollis', "Ah, {hero}. Mind your knees on the steps. I've stood still since the sky split. I've gathered a good deal of Stillness."]],
      mid: [
        ['hollis', "They found us by the hollow in people, you know. Not by any map. Clever. I'd almost admire it, at a distance."]],
      win: [
        ['sys', "The last soldier topples off the path. The gate stands, the forge still smokes, and the salt round the ring is unbroken."],
        ['hollis', "Everyone has a hollow in them. I have ninety-six years of them. He called, and I was too old and stubborn to hear."],
        ['hollis', "The Pact says the Clans keep the layers from killing each other. It says nothing about letting a stranger eat them."],
        ['hollis', "Down the mountain, then. Slowly. The Crater will wait for an old man. Everything else always has."]],
      tie: {
        brakk: [
          ['hero', "I came up the mountain. I chose to stand here."],
          ['hollis', "Well chosen, young one. Now choose again. The Crater needs a mountain more than I do."]],
        dune: [
          ['hero', "Every year you came out to me, Hollis. This year I came to you."],
          ['hollis', "So you did. And it isn't even the longest night. I'll make tea. You won't drink it."]],
        ivo: [
          ['hero', "Elder! I came before dawn! Is this a lesson? It feels like a lesson."],
          ['hollis', "It's a test. You passed. Now go to sleep for once. ...No? Then we walk to the Crater."]],
        oda: [
          ['hero', "(Oda rings the bell once, hard, and points down the mountain.)"],
          ['hollis', "Yes, yes, old friend. The second line. We go down and stand with them. You win the line again."]]
      }
    },

    // ---------------------------------------------------------------- UME (champion Apis, the Glowwild)
    ume: {
      title: "The Honey Goes Sour",
      place: "The Glowwild. Apis's swarm eats Ume's garden, and Ume fights for every poisoned leaf.",
      intro: [
        ['sys', "The Glowwild. Half the forest has stopped glowing. A violet swarm moves over it like smoke, and the trees go grey behind it."],
        ['sys', "In the last bright acre, Ume walks backward through her own garden, sowing spores into the swarm as fast as it eats."],
        ['ume', "{hero}. Don't touch anything. The pretty ones are mine. The purple ones are worse."],
        ['sys', "The Legion pushes through the hedges after the bees, and the hedges bite."]],
      meet: [
        ['apis', "Gardener. You fed my bees when nobody else would. Now my bees feed on you. That is gratitude, the only kind a hive knows."],
        ['ume', "Their honey was the only safe sweet thing in the Glowwild. What are they making now?"],
        ['apis', "Nothing. A hive does not make. It eats. Vael showed me how every engine ends, and I have chosen to be the engine."],
        ['apis', "Every sting adds a bee. At eight, they all go. Count, little gardener. You will not reach eight."]],
      lose: [
        ['apis', "Down among the flowers. Lie still. Bees are gentle with what has stopped moving."]],
      win: [
        ['sys', "The swarm breaks into a hundred threads and pours away toward the Crater. Apis goes with it, unhurt, unbowed."],
        ['apis', "Keep your garden. When the Crown has eaten this world, it will be the last thing left. I will come back for it."],
        ['ume', "...She calls it gratitude. I called it feeding the hungry. One of us was wrong, and the bees can't tell me which."],
        ['ume', "I'm coming to the Crater. I'll bring something that blooms in crowns. Nobody touches the pretty ones."]],
      tie: {
        elixa: [
          ['hero', "Your spores, my flasks. That swarm will be scratching for a month."],
          ['ume', "Two months. And this season I won't ask what for. I know what for. The Crater."]],
        thorne: [
          ['hero', "I came up to prune, as promised. Something has been at your hedges first. Do forgive the shears."],
          ['ume', "Bring them to the Crater. We'll prune the thing that eats every garden. Together, and you may sneeze after."]]
      }
    },

    // ---------------------------------------------------------------- KOVA (called, the Beast Pens)
    kova: {
      title: "One Shape, Forever",
      place: "The Beast Pens. Kova has gone quiet, and the Call has given him one shape and a cage.",
      intro: [
        ['sys', "The Beast Pens under Deepline. Wet straw, old rust. Every cage door stands open, and every cage is full of Legion."],
        ['sys', "In the cage built for something larger lies Kova under an empty crown. One shape: a tiger, grey-violet, very still."],
        ['sys', "He has not said a word in an hour. Nobody who knows him would believe it."]],
      meet: [
        ['kova', "Shh. I can be quiet now. I don't have to be four things. She says I can be one, and she'll keep me."],
        ['kova', "Nobody kept me. Tiger mornings, eagle noons, tortoise nights. Then everybody went home. I watched them go."],
        ['vael', "Wild thing. Nobody chose you. I choose you. One shape, one cage, one door that locks from the outside. Rest."],
        ['kova', "Go away, {hero}. This one's mine. Tiger first. Tiger only."]],
      lose: [
        ['kova', "One beast, and it was plenty. The wolf always said so. Lock the door on your way out."]],
      win: [
        ['sys', "The crown breaks. The tiger shrinks to a boy, then flickers: eagle, tortoise, a bit of bear, and a boy again."],
        ['kova', "I was quiet. The whole time. I was QUIET. That's the worst thing anyone's ever done to me."],
        ['kova', "One shape, she said. Like it was a present. I'm a tiger AND an eagle AND a tortoise AND a bear AND me."],
        ['kova', "That's five of us going to the Crater. Somebody tell the Crown it's outnumbered."]],
      tie: {
        brann: [
          ['hero', "You were quiet, boy. Not the good quiet. A bear's quiet is chosen."],
          ['kova', "Lesson two? ...Okay. I choose loud. Sorry. Not sorry."]],
        fenn: [
          ['hero', "Pick one beast and keep it, I said. A hundred times. I never meant that one, kid."],
          ['kova', "The one-trick wolf came to get me. Don't tell anyone. Say I won."]],
        hart: [
          ['hero', "Nine years you followed my caravans. I thought I'd return the favour."],
          ['kova', "You came looking for me! Nobody ever comes looking for me! ...Can you cook the meat next time?"]]
      }
    },

    // ---------------------------------------------------------------- HART (walker, the Rust Flats)
    hart: {
      title: "Keep Your Distance",
      place: "The Rust Flats. Hart holds a circled caravan against the Legion with one long spear.",
      intro: [
        ['sys', "The Rust Flats. Red dust, a caravan circled wagon to wagon, and the Legion walking in from every side without a sound."],
        ['sys', "At the gap in the circle stands Hart, spear on the diagonal. Every soldier that steps into reach meets the point."],
        ['hart', "{hero}. Keep your distance from me, and I'll keep it from them. Nine years, and I've not been surprised once."]],
      mid: [
        ['sys', "A shadow falls over the circle. A Siege Walker steps over the scrap heaps, legs like towers, a captain in its saddle."],
        ['hart', "...All right. That's a surprise. Long legs. Longer than my spear. Not by much."]],
      win: [
        ['sys', "The Walker kneels in the red dust, both front legs skewered. Its captain comes down the long way, past the spear."],
        ['hart', "Everything has a reach. Find it, stand one step outside, and wait. Even a tower has to come to you sometime."],
        ['hart', "The wagons can roll to Mile Zero without me. I'm walking to the Crater. That Crown has stayed out of reach long enough."]],
      tie: {
        kova: [
          ['hero', "Followed you all the way out here. Like always. You didn't notice. Like always."],
          ['hart', "Before you told me, I only wondered why nothing ever got behind me. Now I know. Thank you, Kova."]],
        tor: [
          ['hero', "Shield in front. Spear behind it. Like always."],
          ['hart', "Like always. Say it was the spear, Tor. Once. It's the end of the world."]],
        yara: [
          ['hero', "I took the captain from a mile off. Before your spear finished turning."],
          ['hart', "And I took the legs from right here. Square, Yara. You shoot the Crown from a mile. I'll hold the mile."]]
      }
    },

    // ---------------------------------------------------------------- TARO (champion Ryo, the Tether Fields)
    taro: {
      title: "Salt Around the Anchor",
      place: "The Tether Fields. Ryo tips the anchor stones over, and Taro stands in a ring of salt.",
      intro: [
        ['sys', "The Tether Fields. The gale shoves at everything, and three anchor stones tall as towers lean over, cables screaming."],
        ['sys', "Around the last one standing, Taro has walked a ring of salt into the earth. He is inside it. Nothing else is."],
        ['taro', "{hero}. Step in, if you are helping. Bow to the floor first. It has been busy today."]],
      meet: [
        ['ryo', "The wrestler of the Hidden village. I slept under your roof and bowed to your ring. I bowed to everything, then. Both sides."],
        ['taro', "You told our elder balance was barely, every day. I heard you. I was carrying the tea."],
        ['ryo', "Balance is a story the near side tells to stay upright. Every scale tips in the end. I have chosen which way. Toward him."],
        ['ryo', "Light in one hand, dark in the other, and both of them his now. Stand aside, little wall. This stone falls next."]],
      lose: [
        ['ryo', "Out of the ring. You see? Everything falls one way in the end."]],
      win: [
        ['sys', "Ryo slides back across the salt, both palms dimming. He bows once, to no one, and walks toward the Crater on the wind."],
        ['ryo', "Same side twice. I have lost the balance. Strange. I do not miss it."],
        ['taro', "He bowed. He does not mean it any more. That is worse than not bowing."],
        ['taro', "The anchor stands. The ring holds. Now I take my salt to the Crater. The Crown will be outside it."]],
      tie: {
        brakk: [
          ['hero', "You did not move. Not one grain."],
          ['taro', "One grain. Do not tell anyone. Again tomorrow, mountain. After the Crown."]],
        ivo: [
          ['hero', "Morning, Taro! Today's the day! ...Oh. The day for this. Not for moving you."],
          ['taro', "Tomorrow, before dawn. I will be here. Today, the Crater."]],
        oda: [
          ['hero', "(Oda rings the bell once over the salt, low, and bows to it.)"],
          ['taro', "A blessed ring holds better. Thank you, old friend. Bless the Crater too. It will need it."]],
        tor: [
          ['hero', "Two walls, I said. The village could afford both."],
          ['taro', "The Crater needs both. You hold the gate of it. I will hold the ring."]]
      }
    },

    // ---------------------------------------------------------------- TAREK (legion, the Sinkhole)
    tarek: {
      title: "Everyone Comes to Me",
      place: "The Sinkhole. The Legion climbs out of the buried city, and Tarek reels it back in.",
      intro: [
        ['sys', "The Sinkhole, on the edge of the Buried Meridian. The Legion climbs out of it hand over hand, like ants from a kicked nest."],
        ['sys', "On the lip stands Tarek, chain whirling, sickle notched to the handle. Every soldier who reaches the top goes back down."],
        ['tarek', "{hero}. Took your time. Don't bother going to them. They come to me. Everybody does."]],
      mid: [
        ['tarek', "They don't even flinch when the chain hits. Like reeling in fence posts. Next lot's bigger."]],
      win: [
        ['sys', "The last soldier falls back into the dark, and the Sinkhole is quiet. Tarek's chain hangs slack, smoking at the links."],
        ['tarek', "Six years I sold the dead city's bones to Halcyon. Now something from out there wants the whole world for scrap."],
        ['tarek', "I never go to anyone. Everyone comes to me. That's the trade."],
        ['tarek', "...Not this time. This time I walk to the Crater, and I go to him."]],
      tie: {
        bando: [
          ['hero', "Came up from the docks to measure again. Twice, I said. You were busy with an army."],
          ['tarek', "Bring the tape to the Crater. Longest reach takes the Crown. In public."]],
        dune: [
          ['hero', "You held the mouth of my city shut. Alone. With one chain."],
          ['tarek', "One end each, Dune. I was holding mine. Still don't like you."]],
        garo: [
          ['hero', "Notched to the handle. Good. I like to see it used."],
          ['tarek', "Right side, this time, like you said. Sharpen it before the Crater, smith. I'll bring it back notched."]]
      }
    },

    // ---------------------------------------------------------------- ODA (called, the Hidden Village)
    oda: {
      title: "The First Word",
      place: "The Hidden Village. Oda rings the Last Toll for Vael, and the bell makes no sound.",
      intro: [
        ['sys', "The Temple of the Last Toll, at the edge of the Hidden Village. Legion soldiers kneel in rows on the frosted steps."],
        ['sys', "At the top stands Oda under an empty crown of violet light. He rings the bell, over and over. It makes no sound at all."],
        ['sys', "Every time it swings, the soldiers on the steps lift their heads, as if they heard."]],
      meet: [
        ['sys', "Oda turns. His mouth opens. For the first time in ninety-six years, words come out of it."],
        ['oda', "One. Two. Count with me, little one. One. Two. She is counting the tolls with her feet again. She came home."],
        ['vael', "Bell-keeper. Ninety-six years of silence, and the first word you speak is mine. Ring for me. She will dance to it forever."],
        ['oda', "Leave, {hero}. You will make her lose count."]],
      lose: [
        ['oda', "One. Two. ...She is still counting. Go quietly."]],
      win: [
        ['sys', "The bell rings true at last, one deep toll over the village. The crown splits, and Oda's mouth closes like a temple door."],
        ['oda', "(Oda looks at his hands a long time. Then he holds up three fingers. She always reached three. The voice never did.)"],
        ['oda', "(He turns toward the Crater and rings once: the dawn toll, at noon. Then he starts down the mountain.)"]],
      tie: {
        hollis: [
          ['hero', "You spoke, old friend. Ninety-six years, and the first words weren't even yours. I'll never tell a soul."],
          ['oda', "(Oda rings the bell once, softly. Then once more, hard: the second line. Later.)"]],
        pell: [
          ['hero', "That was her count, monk, but not her feet. I would know. I tied the strings to them."],
          ['oda', "(Oda rings once, low, and holds the note. It is not forgiveness. It is not a shut door, either.)"]],
        taro: [
          ['hero', "You bless my ring every spring. Today I bow to the bell first."],
          ['oda', "(Oda rings once over Taro's bowed head. The bell answers. From Oda, that is a speech.)"]]
      }
    },

    // ---------------------------------------------------------------- GARO (walker, Shaft Nine)
    garo: {
      title: "Steel Up, Bread Down",
      place: "Shaft Nine. Garo holds the deep mine where the Pact's steel comes up from Deepline.",
      intro: [
        ['sys', "Shaft Nine, Halcyon's deepest mine. The lamps have gone violet. The Legion comes up the shaft from below, and down it from above."],
        ['sys', "At the tunnel mouth stands Garo, the hidden road to Deepline at his back. His wheel goes out and comes home, out and home."],
        ['garo', "{hero}. Mind the lift. There's bread on it for Deepline, and nobody touches the bread."]],
      mid: [
        ['sys', "The rock wall bursts. A Siege Walker shoulders into the shaft on legs like pit props, its captain shouting without a sound."],
        ['garo', "That's a drill bit with legs. I cut my wheel from one of those. Let's see what this one makes."]],
      win: [
        ['sys', "The Walker folds up in the shaft like a broken crane. The lift creaks down into the dark, bread and all."],
        ['garo', "There. The bread goes down. Somebody at the other end eats tonight, and never sees my face. That's the Pact."],
        ['garo', "Throw once, hit twice, and the wheel comes home. Next throw's at the Crater. I'm going with it."]],
      tie: {
        ferra: [
          ['hero', "Don't turn round, big man. I still like not knowing your face."],
          ['garo', "Then walk behind me to the Crater. One throws. You catch whatever comes back."]],
        tarek: [
          ['hero', "You held a hole in the ground for a loaf of bread? ...Fine. I'd hold mine for less."],
          ['garo', "Bring me that sickle. One day you'd use it on the right side, I said. Today's the day."]],
        tor: [
          ['hero', "One throws."],
          ['garo', "One catches. Plant your feet, Tor. The next thing I throw is at a crown."]]
      }
    },

    // ---------------------------------------------------------------- IVO (called, the Hollow)
    ivo: {
      title: "No Dawn Down Here",
      place: "The Hollow, an old mine under the mountain. Ivo has stopped training, and sits for Vael.",
      intro: [
        ['sys', "The Hollow, an old mine under the mountain. No sunrise reaches it. The Legion stands along the tunnels like pit props."],
        ['sys', "Deep inside sits Ivo, cross-legged under an empty crown of violet light. No steam rises off him. He does not move at all."],
        ['sys', "Anyone who knows him would call that the most frightening thing down here."]],
      meet: [
        ['ivo', "{hero}. Shh. I don't have to get up before dawn any more. There's no dawn down here. Isn't that great?"],
        ['ivo', "A year of sunrises at the gate, and every morning since. Sealed. Never moved the wall. Never caught the runner. Never enough."],
        ['vael', "Little striver. You climbed every morning to be enough. Stop climbing. You are mine, and that is enough. Sit."],
        ['ivo', "He says I've already won. So I only need one punch. Not twelve. One."]],
      lose: [
        ['ivo', "One. That's all it took. Twelve was always showing off."]],
      win: [
        ['sys', "The crown cracks. Golden steam pours off Ivo's shoulders all at once, like a kettle somebody forgot."],
        ['ivo', "I stopped. I actually stopped. I sat in the dark and let somebody tell me I was finished. Me!"],
        ['ivo', "What time is it? Is it before dawn? It's before dawn somewhere."],
        ['ivo', "Then I'm late. The Crater, before sunrise. Last one there does a thousand Sky Kicks."]],
      tie: {
        hollis: [
          ['hero', "You waited a year of sunrises at my gate. You don't sit in the dark for anybody. Up."],
          ['ivo', "Elder! Was that a lesson? ...It was a test. I failed it. I'm taking it again. Now."]],
        lin: [
          ['hero', "You were quiet, Ivo. I said work on it. I did not mean like that."],
          ['ivo', "Back to loud, then! Loud gets heard! ...Did you hear me? From all the way down there?"]],
        tarn: [
          ['hero', "First time I ever caught you standing still. Don't make a habit of it."],
          ['ivo', "You came to ME! That counts! That's basically a win! ...Race you to the Crater."]],
        taro: [
          ['hero', "No steam. No noise. I came down to see what could move you. Something did. I do not like it."],
          ['ivo', "Then let's go and push it out of the ring. Before dawn. Like always."]]
      }
    },

    // ---------------------------------------------------------------- TOR (walker, the Anchor Crown)
    tor: {
      title: "Nothing Gets Past",
      place: "The Anchor Crown. Tor holds the Great Tether's anchor, and nothing has got past him.",
      intro: [
        ['sys', "The Anchor Crown, where the Great Tether is bolted into bedrock. The cable hums like a plucked string the size of a road."],
        ['sys', "The Legion comes at it from three sides with blades and hooks. On the fourth stands Tor, and the blades bounce."],
        ['tor', "{hero}. Get behind the shield, or beside it. Not in front. Things bounce."]],
      mid: [
        ['sys', "The bedrock shudders. A Siege Walker climbs out of the gorge on legs like towers, its captain aiming it at the Tether."],
        ['tor', "Bring it. It'll bounce."]],
      win: [
        ['sys', "The Walker hits the shield, stops like rain on a roof, and goes over backwards into the gorge. The Tether hums on."],
        ['tor', "Nothing got past. Nothing's about to start."],
        ['tor', "The anchor can hold itself a day. The Crater can't. Somebody has to stand in front of that Crown, and it's going to bounce."]],
      tie: {
        aldric: [
          ['hero', "I came down to see a wall worthy of the name. It is. The Tether stands."],
          ['tor', "Two walls hold better than one, knight. Shoulder to shoulder, at the Crater."]],
        garo: [
          ['hero', "Not a scratch on it. Either I forged it better than I knew..."],
          ['tor', "...or I'm harder than the steel. Both. One throws, Garo. Throw something at the Crown."]],
        hart: [
          ['hero', "Anything get past your side?"],
          ['tor', "Nothing. And it was the shield. Don't argue, Hart. We've a Crown to stop."]],
        taro: [
          ['hero', "You did not step back. Not one grain. I watched."],
          ['tor', "Never have. Never will. Come to the Crater, Taro. We settle which of us is the wall afterwards."]]
      }
    }
  });
})();
